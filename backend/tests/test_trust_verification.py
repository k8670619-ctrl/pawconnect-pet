import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.models import User, Pet
from app.core.security import create_access_token
from tests.conftest import TestingSessionLocal

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_users():
    db = TestingSessionLocal()

    user1 = User(
        full_name="Priya Sharma",
        email="priya@pawconnect.ai",
        phone="+919876543210",
        hashed_password="hashed_pwd",
        role="user",
        is_email_verified=True,
        is_phone_verified=True,
        trust_score=70.0,
        verification_status="unverified"
    )

    seller1 = User(
        full_name="Apex Kennels",
        email="seller@pawconnect.ai",
        phone="+919876543211",
        hashed_password="hashed_pwd",
        role="seller",
        is_email_verified=True,
        is_phone_verified=True,
        is_identity_verified=True,
        verification_status="verified",
        verified_badge="verified_seller",
        trust_score=95.0
    )

    admin1 = db.query(User).filter(User.email == "admin@pawconnect.ai").first()
    if not admin1:
        admin1 = User(
            full_name="System Admin",
            email="admin@pawconnect.ai",
            hashed_password="hashed_pwd",
            role="admin",
            is_email_verified=True,
            verification_status="verified"
        )
        db.add(admin1)

    db.add_all([user1, seller1])
    db.commit()

    pet1 = Pet(
        owner_id=seller1.id,
        name="Charlie",
        category="Dogs",
        breed="Beagle",
        age_months=6,
        gender="Male",
        listing_type="sale",
        price=12000.0,
        location="Delhi, DL",
        description="Playful Beagle puppy.",
        image_url="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800"
    )
    db.add(pet1)
    db.commit()
    db.close()
    yield

def test_document_submission_and_trust_score():
    token = create_access_token(data={"sub": "priya@pawconnect.ai"})
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post(
        "/api/v1/verification/documents",
        json={
            "document_type": "govt_id",
            "document_number": "PAN1234567",
            "file_url": "https://storage.pawconnect.ai/docs/pan.jpg"
        },
        headers=headers
    )
    assert res.status_code == 201
    doc_data = res.json()
    assert doc_data["status"] == "pending"

    res_score = client.get(f"/api/v1/verification/trust-score/{doc_data['user_id']}")
    assert res_score.status_code == 200
    score_data = res_score.json()
    assert score_data["trust_score"] >= 70.0

def test_pet_verification_vaccination_microchip():
    token = create_access_token(data={"sub": "seller@pawconnect.ai"})
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post(
        "/api/v1/verification/pet/1",
        json={
            "vaccination_record_url": "https://storage.pawconnect.ai/pets/vax_charlie.pdf",
            "microchip_id": "98102000491823",
            "medical_certificate_url": "https://storage.pawconnect.ai/pets/med_charlie.pdf"
        },
        headers=headers
    )
    assert res.status_code == 200
    pet_data = res.json()
    assert pet_data["is_verified_pet"] is True
    assert pet_data["pet_verification_status"] == "verified"

def test_reviews_and_ratings():
    token = create_access_token(data={"sub": "priya@pawconnect.ai"})
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post(
        "/api/v1/verification/reviews",
        json={
            "target_id": 2,
            "target_type": "seller",
            "rating": 5.0,
            "comment": "Highly trustworthy seller with clean vaccination records!"
        },
        headers=headers
    )
    assert res.status_code == 201

    res_fetch = client.get("/api/v1/verification/reviews/seller/2")
    assert res_fetch.status_code == 200
    assert len(res_fetch.json()) == 1

def test_admin_verification_approve_reject_audit_logs():
    token_user = create_access_token(data={"sub": "priya@pawconnect.ai"})
    client.post(
        "/api/v1/verification/documents",
        json={
            "document_type": "govt_id",
            "document_number": "AADH12345678",
            "file_url": "https://storage.pawconnect.ai/docs/aadhaar.jpg"
        },
        headers={"Authorization": f"Bearer {token_user}"}
    )

    res_pending = client.get("/api/v1/admin/verifications/pending")
    assert res_pending.status_code == 200
    assert len(res_pending.json()) >= 1

    res_approve = client.post(
        "/api/v1/admin/verifications/approve",
        json={
            "user_id": 1,
            "status": "verified",
            "notes": "Govt Aadhaar ID verified successfully."
        }
    )
    assert res_approve.status_code == 200
    assert res_approve.json()["verified_badge"] == "verified_user"

    res_logs = client.get("/api/v1/admin/audit-logs")
    assert res_logs.status_code == 200
    assert len(res_logs.json()) >= 1

def test_permission_enforcement_sale_listing():
    token_unverified = create_access_token(data={"sub": "priya@pawconnect.ai"})

    res_fail = client.post(
        "/api/v1/pets",
        json={
            "name": "Unverified Sale Pet",
            "category": "Dogs",
            "breed": "Husky",
            "age_months": 4,
            "gender": "Male",
            "listing_type": "sale",
            "price": 25000.0,
            "location": "Mumbai, MH",
            "description": "Purebred Husky."
        },
        headers={"Authorization": f"Bearer {token_unverified}"}
    )
    assert res_fail.status_code == 403

    token_seller = create_access_token(data={"sub": "seller@pawconnect.ai"})
    res_pass = client.post(
        "/api/v1/pets",
        json={
            "name": "Verified Sale Pet",
            "category": "Dogs",
            "breed": "Pug",
            "age_months": 3,
            "gender": "Female",
            "listing_type": "sale",
            "price": 10000.0,
            "location": "Delhi, DL",
            "description": "Healthy pug puppy."
        },
        headers={"Authorization": f"Bearer {token_seller}"}
    )
    assert res_pass.status_code == 201
