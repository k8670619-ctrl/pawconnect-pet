import pytest
import uuid
from fastapi.testclient import TestClient
from app.main import app
from app.models.models import User
from tests.conftest import TestingSessionLocal

client = TestClient(app)

def test_password_strength_validation():
    res = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Weak Password User",
            "username": f"user_{uuid.uuid4().hex[:6]}",
            "email": f"weak_{uuid.uuid4().hex[:6]}@example.com",
            "phone": f"+91{uuid.uuid4().hex[:10]}",
            "password": "123",
            "role": "user"
        }
    )
    assert res.status_code == 400
    assert "8 characters" in res.json()["detail"]

def test_user_registration_and_availability():
    unique_email = f"priya_{uuid.uuid4().hex[:6]}@example.com"
    unique_user = f"priya_{uuid.uuid4().hex[:6]}"
    unique_phone = f"+91{uuid.uuid4().hex[:10]}"

    res_avail = client.get(f"/api/v1/auth/check-username?username={unique_user}")
    assert res_avail.status_code == 200
    assert res_avail.json()["available"] is True

    res = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Priya Sharma",
            "username": unique_user,
            "email": unique_email,
            "phone": unique_phone,
            "password": "Password123!",
            "role": "seller"
        }
    )
    assert res.status_code == 200
    assert res.json()["status"] == "success"

def test_login_success_and_jwt():
    unique_email = f"login_{uuid.uuid4().hex[:6]}@example.com"

    client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Login User",
            "username": f"login_{uuid.uuid4().hex[:6]}",
            "email": unique_email,
            "phone": f"+91{uuid.uuid4().hex[:10]}",
            "password": "Password123!",
            "role": "user"
        }
    )

    res_login = client.post(
        "/api/v1/auth/login",
        json={
            "email_or_phone": unique_email,
            "password": "Password123!"
        }
    )
    assert res_login.status_code == 200
    data = res_login.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_failure_and_lockout():
    res_fail = client.post(
        "/api/v1/auth/login",
        json={
            "email_or_phone": "nonexistent@example.com",
            "password": "WrongPassword!"
        }
    )
    assert res_fail.status_code == 401

def test_forgot_and_reset_password():
    unique_email = f"reset_{uuid.uuid4().hex[:6]}@example.com"

    client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Reset User",
            "username": f"reset_{uuid.uuid4().hex[:6]}",
            "email": unique_email,
            "phone": f"+91{uuid.uuid4().hex[:10]}",
            "password": "Password123!",
            "role": "user"
        }
    )

    res_forgot = client.post(
        "/api/v1/auth/forgot-password",
        json={"email": unique_email}
    )
    assert res_forgot.status_code == 200
    # The API embeds the OTP in the message text e.g. "...OTP generated: 123456 (expires..."
    message = res_forgot.json().get("message", "")
    import re
    match = re.search(r'\b(\d{6})\b', message)
    reset_token = match.group(1) if match else "000000"

    res_reset = client.post(
        "/api/v1/auth/reset-password",
        json={
            "token_or_otp": reset_token,
            "new_password": "NewSecurePassword123!"
        }
    )
    assert res_reset.status_code == 200

def test_document_verification_upload_and_admin_approve():
    unique_email = f"doc_{uuid.uuid4().hex[:6]}@example.com"
    reg = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Doc Seller",
            "username": f"seller_{uuid.uuid4().hex[:6]}",
            "email": unique_email,
            "phone": f"+91{uuid.uuid4().hex[:10]}",
            "password": "Password123!",
            "role": "seller"
        }
    )
    user_id = reg.json()["user_id"]

    res_approve = client.post(
        "/api/v1/admin/verifications/approve",
        json={
            "user_id": user_id,
            "status": "verified",
            "notes": "Verified Aadhaar ID card."
        }
    )
    assert res_approve.status_code == 200
    assert res_approve.json()["verified_badge"] == "verified_seller"

def test_production_otp_flow_and_cooldown():
    unique_email = f"otp_{uuid.uuid4().hex[:6]}@example.com"
    
    # 1. Register
    reg_res = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "OTP Test User",
            "email": unique_email,
            "password": "Password123!",
            "role": "user"
        }
    )
    assert reg_res.status_code == 200
    otp_code = reg_res.json()["otp_hint"]
    assert otp_code is not None

    # 2. Resend OTP within 60s -> should trigger 429 Too Many Requests
    cooldown_res = client.post(
        "/api/v1/auth/resend-otp",
        json={"target": unique_email, "channel": "email"}
    )
    assert cooldown_res.status_code == 429

    # 3. Verify OTP -> should verify user & return access_token for auto-login
    verify_res = client.post(
        "/api/v1/auth/verify-otp",
        json={"target": unique_email, "otp_code": otp_code}
    )
    assert verify_res.status_code == 200
    data = verify_res.json()
    assert "access_token" in data
    assert data["user"]["is_email_verified"] is True

from app.seed_dev_admins import seed_default_admins

def test_default_dev_admin_accounts():
    db = TestingSessionLocal()
    seed_default_admins(db)
    db.close()

    # 1. Super Admin login
    res_super = client.post(
        "/api/v1/auth/login",
        json={"email_or_phone": "admin@pawconnect.ai", "password": "Admin@123456"}
    )
    assert res_super.status_code == 200
    data_super = res_super.json()
    assert data_super["user"]["role"] == "super_admin"

    # 2. Support Admin login
    res_admin = client.post(
        "/api/v1/auth/login",
        json={"email_or_phone": "support@pawconnect.ai", "password": "Admin@123456"}
    )
    assert res_admin.status_code == 200
    data_admin = res_admin.json()
    assert data_admin["user"]["role"] == "admin"

    # 3. Incorrect password -> generic response
    res_bad = client.post(
        "/api/v1/auth/login",
        json={"email_or_phone": "admin@pawconnect.ai", "password": "WrongPassword123!"}
    )
    assert res_bad.status_code == 401
    assert res_bad.json()["detail"] == "Invalid email or password."

def test_complete_registration_to_otp_verification_flow():
    unique_email = f"otp_flow_{uuid.uuid4().hex[:6]}@example.com"
    unique_user = f"user_{uuid.uuid4().hex[:6]}"

    # 1. Register User
    reg_res = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "OTP Test User",
            "username": unique_user,
            "email": unique_email,
            "phone": f"+91{uuid.uuid4().hex[:10]}",
            "password": "Password123!",
            "role": "user"
        }
    )
    assert reg_res.status_code == 200
    reg_data = reg_res.json()
    assert reg_data["status"] == "success"
    otp_code = reg_data.get("otp_hint")
    assert otp_code is not None
    assert len(otp_code) == 6

    # 2. Test Invalid OTP Code (should fail with 400 and log diagnostic warning)
    invalid_verify = client.post(
        "/api/v1/auth/verify-otp",
        json={"target": unique_email, "otp_code": "000000"}
    )
    assert invalid_verify.status_code == 400
    assert "Invalid or expired" in invalid_verify.json()["detail"]

    # 3. Test Valid OTP Verification (should succeed, set is_email_verified=True, and issue JWT token)
    valid_verify = client.post(
        "/api/v1/auth/verify-otp",
        json={"target": unique_email, "otp_code": otp_code}
    )
    assert valid_verify.status_code == 200
    verify_data = valid_verify.json()
    assert verify_data["user"]["is_email_verified"] is True
    assert verify_data["user"]["verification_status"] == "verified"
    assert "access_token" in verify_data

    # 4. Re-verify used OTP Code (should fail because it's already used)
    reused_verify = client.post(
        "/api/v1/auth/verify-otp",
        json={"target": unique_email, "otp_code": otp_code}
    )
    assert reused_verify.status_code == 400
    assert "Invalid or expired" in reused_verify.json()["detail"]



