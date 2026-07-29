import hashlib
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.models import (
    User, VerificationDocument, Pet, ReviewRating,
    FraudDetectionFlag, VerificationAuditLog, Notification
)

def calculate_trust_score(user_id: int, db: Session) -> float:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return 0.0

    score = 40.0  # Base trust score for registered user

    # 1. Email verification (+15)
    if user.is_email_verified:
        score += 15.0

    # 2. Phone OTP verification (+15)
    if user.is_phone_verified:
        score += 15.0

    # 3. Identity Verification (+20)
    if user.is_identity_verified or user.verification_status == "verified":
        score += 20.0

    # 4. Verified Role / License (+10)
    if user.role in ["seller", "shelter", "ngo", "veterinarian"] and user.verification_status == "verified":
        score += 10.0

    # 5. Reviews & Ratings (+/- up to 10 points)
    avg_rating = db.query(func.avg(ReviewRating.rating)).filter(
        ReviewRating.target_id == user_id,
        ReviewRating.target_type.in_(["user", "seller", "shelter", "ngo", "veterinarian"])
    ).scalar()

    if avg_rating is not None:
        if avg_rating >= 4.5:
            score += 10.0
        elif avg_rating >= 4.0:
            score += 5.0
        elif avg_rating < 3.0:
            score -= 15.0

    # 6. Fraud alert penalties
    open_flags_count = db.query(FraudDetectionFlag).filter(
        FraudDetectionFlag.user_id == user_id,
        FraudDetectionFlag.status == "open"
    ).count()

    score -= (open_flags_count * 20.0)

    # Clamp score between 0.0 and 100.0
    final_score = max(0.0, min(100.0, score))

    user.trust_score = round(final_score, 1)

    # Assign badge based on status & role
    if user.verification_status == "verified":
        if user.role == "seller":
            user.verified_badge = "verified_seller"
        elif user.role == "shelter":
            user.verified_badge = "verified_shelter"
        elif user.role == "ngo":
            user.verified_badge = "verified_ngo"
        elif user.role == "veterinarian":
            user.verified_badge = "verified_vet"
        else:
            user.verified_badge = "verified_user"
    else:
        user.verified_badge = "unverified"

    db.commit()
    db.refresh(user)
    return user.trust_score


def run_ai_fraud_detection(user_id: int, pet_data: Optional[dict], db: Session) -> List[FraudDetectionFlag]:
    flags = []
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return flags

    # Rule 1: Duplicate phone or email check across accounts
    if user.phone:
        dup_phones = db.query(User).filter(User.phone == user.phone, User.id != user_id).count()
        if dup_phones > 0:
            flag = FraudDetectionFlag(
                user_id=user_id,
                flag_type="duplicate_account",
                risk_score=85.0,
                details=f"Phone number {user.phone} is linked to {dup_phones} other account(s).",
                status="open"
            )
            db.add(flag)
            flags.append(flag)

    # Rule 2: Pet Image Hash & Duplicate Listing Detection
    if pet_data and pet_data.get("image_url"):
        img_url = pet_data["image_url"]
        dup_pets = db.query(Pet).filter(Pet.image_url == img_url, Pet.owner_id != user_id).count()
        if dup_pets > 0:
            flag = FraudDetectionFlag(
                user_id=user_id,
                flag_type="duplicate_image",
                risk_score=90.0,
                details=f"Pet image is identical to existing pet listing owned by another user.",
                status="open"
            )
            db.add(flag)
            flags.append(flag)

    # Rule 3: Suspicious Pricing for Rare Breeds
    if pet_data and pet_data.get("listing_type") == "sale":
        price = pet_data.get("price", 0.0)
        breed = (pet_data.get("breed") or "").lower()
        if ("retriever" in breed or "husky" in breed or "persian" in breed) and price < 500:
            flag = FraudDetectionFlag(
                user_id=user_id,
                flag_type="suspicious_listing",
                risk_score=75.0,
                details=f"Unusually low sale price (₹{price}) for purebred {breed}.",
                status="open"
            )
            db.add(flag)
            flags.append(flag)

    db.commit()
    return flags


def verify_pet(pet_id: int, vaccination_record_url: str, microchip_id: str, medical_cert_url: str, db: Session) -> Pet:
    pet = db.query(Pet).filter(Pet.id == pet_id).first()
    if not pet:
        raise ValueError("Pet not found")

    pet.vaccination_record_url = vaccination_record_url
    pet.microchip_id = microchip_id
    pet.medical_certificate_url = medical_cert_url
    pet.is_vaccinated = True
    pet.has_medical_certificate = True
    pet.pet_verification_status = "verified"
    pet.is_verified_pet = True

    db.commit()
    db.refresh(pet)
    return pet


def log_verification_action(
    admin_id: Optional[int],
    target_user_id: int,
    action: str,
    previous_status: Optional[str],
    new_status: str,
    notes: Optional[str],
    db: Session
) -> VerificationAuditLog:
    log_entry = VerificationAuditLog(
        admin_id=admin_id,
        target_user_id=target_user_id,
        action=action,
        previous_status=previous_status,
        new_status=new_status,
        notes=notes
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry


def create_notification(user_id: int, title: str, message: str, notification_type: str, db: Session) -> Notification:
    notif = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notification_type
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif
