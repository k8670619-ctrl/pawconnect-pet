from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, VerificationDocument, ReviewRating, Notification, Pet
from app.schemas.schemas import (
    VerificationDocumentCreate, VerificationDocumentResponse,
    PetVerificationRequest, PetVerificationResponse,
    TrustScoreResponse, ReviewCreate, ReviewResponse,
    NotificationResponse
)
from app.services.trust_service import calculate_trust_score, verify_pet, create_notification, run_ai_fraud_detection

router = APIRouter(prefix="/api/v1/verification", tags=["Trust & Verification"])

@router.post("/documents", response_model=VerificationDocumentResponse, status_code=status.HTTP_201_CREATED)
def submit_verification_document(
    payload: VerificationDocumentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = VerificationDocument(
        user_id=current_user.id,
        document_type=payload.document_type,
        document_number=payload.document_number,
        file_url=payload.file_url,
        status="pending"
    )
    db.add(doc)

    # Update user verification status to pending
    current_user.verification_status = "pending"
    db.commit()
    db.refresh(doc)

    # Run AI Fraud detection
    run_ai_fraud_detection(current_user.id, None, db)

    # Recalculate trust score
    calculate_trust_score(current_user.id, db)

    # Send Notification
    create_notification(
        user_id=current_user.id,
        title="Verification Submitted",
        message=f"Your {payload.document_type.replace('_', ' ').title()} document has been submitted for admin review.",
        notification_type="verification",
        db=db
    )

    return doc

@router.post("/pet/{pet_id}", response_model=PetVerificationResponse)
def submit_pet_verification(
    pet_id: int,
    payload: PetVerificationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pet = db.query(Pet).filter(Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    if pet.owner_id != current_user.id and current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to verify this pet")

    verified_pet = verify_pet(
        pet_id=pet_id,
        vaccination_record_url=payload.vaccination_record_url,
        microchip_id=payload.microchip_id,
        medical_cert_url=payload.medical_certificate_url,
        db=db
    )

    # Trigger AI fraud check on pet listing
    run_ai_fraud_detection(
        user_id=current_user.id,
        pet_data={
            "listing_type": pet.listing_type,
            "price": pet.price,
            "breed": pet.breed,
            "image_url": pet.image_url
        },
        db=db
    )

    create_notification(
        user_id=current_user.id,
        title="Pet Verified",
        message=f"Vaccination record and Microchip ID ({payload.microchip_id}) for {pet.name} have been verified!",
        notification_type="verification",
        db=db
    )

    return verified_pet

@router.get("/trust-score/{user_id}", response_model=TrustScoreResponse)
def get_user_trust_score(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    trust_score = calculate_trust_score(user.id, db)

    return TrustScoreResponse(
        user_id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role,
        trust_score=trust_score,
        verified_badge=user.verified_badge or "unverified",
        verification_status=user.verification_status,
        is_email_verified=user.is_email_verified,
        is_phone_verified=user.is_phone_verified,
        is_identity_verified=user.is_identity_verified
    )

@router.post("/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review_rating(
    payload: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if payload.rating < 1.0 or payload.rating > 5.0:
        raise HTTPException(status_code=400, detail="Rating must be between 1.0 and 5.0")

    review = ReviewRating(
        reviewer_id=current_user.id,
        target_id=payload.target_id,
        target_type=payload.target_type,
        rating=payload.rating,
        comment=payload.comment
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    # Recalculate target user's trust score if target is a user/seller/vet/shelter/ngo
    if payload.target_type in ["user", "seller", "shelter", "ngo", "veterinarian"]:
        calculate_trust_score(payload.target_id, db)

    return review

@router.get("/reviews/{target_type}/{target_id}", response_model=List[ReviewResponse])
def get_reviews_for_target(
    target_type: str,
    target_id: int,
    db: Session = Depends(get_db)
):
    return db.query(ReviewRating).filter(
        ReviewRating.target_type == target_type,
        ReviewRating.target_id == target_id
    ).all()

@router.get("/notifications", response_model=List[NotificationResponse])
def get_user_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()
