from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import (
    UserRegister, UserLogin, GoogleLoginRequest, OTPRequest, OTPVerify,
    EmailVerifyRequest, ForgotPasswordRequest, ResetPasswordRequest,
    ChangePasswordRequest, Enable2FARequest, Verify2FARequest, TokenResponse,
    AvailabilityCheckResponse, DocumentVerifyRequest, AdminVerifyDocumentRequest,
    SendOTPRequest, VerifyOTPRequest, ResendOTPRequest
)
from app.services.auth_service import AuthService
from app.services.otp_service import OTPService
from app.core.security import create_access_token, create_refresh_token, verify_password, get_password_hash
from app.models.models import User, UserSession, OTPCode, VerificationDocument
from datetime import datetime, timedelta, timezone
from typing import Dict, Any

router = APIRouter(prefix="/auth", tags=["🔐 Authentication"])

@router.post("/register", summary="User Registration", description="Registers a new user account with role selection (User, Seller, Shelter, NGO, Vet, Groomer).")
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    user, msg = AuthService.register_user(db, payload.model_dump())
    if not user:
        raise HTTPException(status_code=400, detail=msg)
    
    # Automatically generate and store OTP code in database for the registered user
    otp_ok, otp_msg, otp_data = OTPService.send_otp(db, user.email, "email")
    otp_hint = otp_data.get("otp_hint") if otp_ok else None

    return {
        "status": "success",
        "message": msg,
        "user_id": user.id,
        "email": user.email,
        "role": user.role,
        "otp_hint": otp_hint
    }

@router.get("/check-username", summary="Check Username Availability", description="Checks if a username is available in real-time.")
def check_username(username: str = Query(..., examples={"default": {"value": "priyasharma"}}), db: Session = Depends(get_db)):
    available, msg = AuthService.check_availability(db, "username", username)
    return {
        "available": available,
        "field": "username",
        "value": username,
        "message": msg
    }

@router.get("/check-email", summary="Check Email Availability", description="Checks if an email is available for registration.")
def check_email(email: str = Query(..., examples={"default": {"value": "priya@example.com"}}), db: Session = Depends(get_db)):
    available, msg = AuthService.check_availability(db, "email", email)
    return {
        "available": available,
        "field": "email",
        "value": email,
        "message": msg
    }

@router.post("/login", summary="User Login", description="Authenticates user with Email/Phone & Password, supporting Remember Me and 2FA triggers.")
def login_user(payload: UserLogin, request: Request, db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("user-agent", "Unknown")

    user, msg, extra = AuthService.authenticate_user(db, payload.email_or_phone, payload.password, client_ip, user_agent)
    if not user:
        raise HTTPException(status_code=401, detail=msg)

    if extra.get("two_factor_required"):
        return {
            "status": "2fa_required",
            "message": msg,
            "two_factor_required": True,
            "user_id": user.id,
            "otp_hint": extra.get("otp_hint")
        }

    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    return {
        "status": "success",
        "message": "Authentication successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "is_email_verified": user.is_email_verified,
            "is_phone_verified": user.is_phone_verified,
            "verification_status": user.verification_status
        }
    }

@router.post("/google-login", summary="Google OAuth Login", description="Logs in or registers a user using Google OAuth ID token.")
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    # Mock Google OAuth verification for demonstration
    email = "google_user@pawconnect.ai"
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            full_name="Google User",
            email=email,
            hashed_password=get_password_hash("GoogleAuth123!"),
            role=payload.role or "user",
            is_email_verified=True,
            verification_status="verified"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    return {
        "status": "success",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "verification_status": user.verification_status
        }
    }

@router.post("/send-otp", summary="Send Email/SMS OTP", description="Generates and dispatches a 6-digit OTP via Email or SMS with 60s cooldown enforcement.")
def send_otp(payload: SendOTPRequest, db: Session = Depends(get_db)):
    success, msg, data = OTPService.send_otp(db, payload.target, payload.channel or "email")
    if not success:
        if data.get("cooldown_active"):
            raise HTTPException(status_code=429, detail=msg)
        raise HTTPException(status_code=400, detail=msg)
    return {
        "status": "success",
        "message": msg,
        "otp_hint": data.get("otp_hint"),
        "cooldown_seconds": data.get("cooldown_seconds", 60)
    }

@router.post("/verify-otp", summary="Verify OTP Code & Auto-Login", description="Verifies 6-digit OTP code, marks user as verified, and returns JWT session for auto-login.")
def verify_otp_endpoint(payload: VerifyOTPRequest, db: Session = Depends(get_db)):
    success, msg, session_data = OTPService.verify_otp(db, payload.target, payload.otp_code)
    if not success:
        raise HTTPException(status_code=400, detail=msg)
    return {
        "status": "success",
        "message": msg,
        **(session_data or {})
    }

@router.post("/resend-otp", summary="Resend OTP with 60s Cooldown", description="Resends a fresh 6-digit OTP code enforcing a 60-second cooldown period.")
def resend_otp(payload: ResendOTPRequest, db: Session = Depends(get_db)):
    success, msg, data = OTPService.send_otp(db, payload.target, payload.channel or "email")
    if not success:
        if data.get("cooldown_active"):
            raise HTTPException(status_code=429, detail=msg)
        raise HTTPException(status_code=400, detail=msg)
    return {
        "status": "success",
        "message": msg,
        "otp_hint": data.get("otp_hint"),
        "cooldown_seconds": data.get("cooldown_seconds", 60)
    }

@router.post("/request-otp", summary="Request Phone/Email OTP", description="Sends a 6-digit OTP via SMS or Email for OTP login or verification.")
def request_otp(payload: OTPRequest, db: Session = Depends(get_db)):
    success, msg, data = OTPService.send_otp(db, payload.target, "email" if "@" in payload.target else "phone")
    if not success:
        if data.get("cooldown_active"):
            raise HTTPException(status_code=429, detail=msg)
        raise HTTPException(status_code=400, detail=msg)
    return {
        "status": "success",
        "message": msg,
        "otp_hint": data.get("otp_hint")
    }

@router.post("/login-otp", summary="Phone/Email OTP Login", description="Authenticates user using 6-digit OTP.")
def login_otp(payload: OTPVerify, db: Session = Depends(get_db)):
    record = db.query(OTPCode).filter(
        OTPCode.target == payload.target,
        OTPCode.code == payload.otp_code,
        OTPCode.otp_type == payload.otp_type,
        OTPCode.is_used == False,
        OTPCode.expires_at > datetime.utcnow()
    ).first()

    if not record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP.")

    record.is_used = True
    user = db.query(User).filter((User.email == payload.target) | (User.phone == payload.target)).first()
    if not user:
        user = User(
            full_name="Mobile User",
            email=f"user_{payload.target.replace('+', '')}@pawconnect.ai",
            phone=payload.target,
            hashed_password=get_password_hash("OTPPass123!"),
            role="user",
            is_phone_verified=True
        )
        db.add(user)

    db.commit()
    db.refresh(user)

    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    return {
        "status": "success",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        }
    }

@router.post("/verify-email", summary="Verify Email Address", description="Verifies user's email address using 6-digit OTP or link token and creates JWT session.")
def verify_email(payload: EmailVerifyRequest, db: Session = Depends(get_db)):
    success, msg = AuthService.verify_email(db, payload.email, payload.code_or_token)
    if not success:
        raise HTTPException(status_code=400, detail=msg)
    user = db.query(User).filter(User.email == payload.email).first()
    access_token = create_access_token({"sub": str(user.id), "role": user.role}) if user else ""
    refresh_token = create_refresh_token({"sub": str(user.id)}) if user else ""
    return {
        "status": "success",
        "message": msg,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "is_email_verified": user.is_email_verified,
            "is_phone_verified": user.is_phone_verified,
            "verification_status": user.verification_status
        } if user else None
    }

@router.post("/verify-phone", summary="Verify Phone Number", description="Verifies user's mobile number using 6-digit SMS OTP and creates JWT session.")
def verify_phone(payload: OTPVerify, db: Session = Depends(get_db)):
    success, msg = AuthService.verify_phone(db, payload.target, payload.otp_code)
    if not success:
        raise HTTPException(status_code=400, detail=msg)
    user = db.query(User).filter(User.phone == payload.target).first()
    access_token = create_access_token({"sub": str(user.id), "role": user.role}) if user else ""
    refresh_token = create_refresh_token({"sub": str(user.id)}) if user else ""
    return {
        "status": "success",
        "message": msg,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "is_email_verified": user.is_email_verified,
            "is_phone_verified": user.is_phone_verified,
            "verification_status": user.verification_status
        } if user else None
    }

@router.post("/forgot-password", summary="Forgot Password Request", description="Initiates password recovery by generating a reset OTP/token.")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    success, msg = AuthService.request_forgot_password(db, payload.email)
    return {"status": "success", "message": msg}

@router.post("/reset-password", summary="Reset Password", description="Resets account password using reset token/OTP and forces logout from all devices.")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    success, msg = AuthService.reset_password(db, payload.token_or_otp, payload.new_password)
    if not success:
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "success", "message": msg}

@router.post("/logout-all", summary="Logout From All Devices", description="Revokes all active JWT sessions and refresh tokens across all devices.")
def logout_all_devices(user_id: int = Query(1, examples={"default": {"value": 1}}), db: Session = Depends(get_db)):
    db.query(UserSession).filter(UserSession.user_id == user_id).update({"is_active": False})
    db.commit()
    return {"status": "success", "message": "Logged out from all active devices successfully."}

@router.post("/verify-document", summary="Upload Identity Verification Document", description="Uploads Seller ID, NGO Registration, Shelter License, or Vet Medical License for verification.")
def upload_verification_document(payload: DocumentVerifyRequest, user_id: int = Query(1, examples={"default": {"value": 1}}), db: Session = Depends(get_db)):
    doc = VerificationDocument(
        user_id=user_id,
        document_type=payload.document_type,
        document_number=payload.document_number,
        file_url=payload.file_url,
        status="pending"
    )
    db.add(doc)
    
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.verification_status = "pending"

    db.commit()
    return {
        "status": "success",
        "message": "Verification document uploaded successfully and placed under review.",
        "document_id": doc.id,
        "verification_status": "pending"
    }

@router.get("/admin/verifications", summary="List Pending Profile Verifications", description="Admin endpoint to review submitted seller/NGO/shelter/vet verification documents.")
def list_pending_verifications(db: Session = Depends(get_db)):
    docs = db.query(VerificationDocument).all()
    return {
        "total": len(docs),
        "documents": [
            {
                "id": d.id,
                "user_id": d.user_id,
                "document_type": d.document_type,
                "document_number": d.document_number,
                "file_url": d.file_url,
                "status": d.status,
                "submitted_at": d.submitted_at
            }
            for d in docs
        ]
    }

@router.put("/admin/verifications/{document_id}", summary="Approve or Reject Verification", description="Admin endpoint to approve or reject profile verification documents.")
def admin_verify_document(document_id: int, payload: AdminVerifyDocumentRequest, db: Session = Depends(get_db)):
    doc = db.query(VerificationDocument).filter(VerificationDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    doc.status = payload.status
    doc.rejection_reason = payload.rejection_reason
    doc.reviewed_at = datetime.now(timezone.utc).replace(tzinfo=None)

    user = db.query(User).filter(User.id == doc.user_id).first()
    if user:
        if payload.status == "verified":
            user.is_identity_verified = True
            user.verification_status = "verified"
        else:
            user.verification_status = "rejected"

    db.commit()
    return {
        "status": "success",
        "message": f"Verification status updated to {payload.status}.",
        "document_id": doc.id
    }
