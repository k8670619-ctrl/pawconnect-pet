from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import (
    User, Pet, AdoptionApplication, LostFoundReport, ServiceBooking,
    VerificationDocument, VerificationAuditLog, FraudDetectionFlag, Notification
)
from app.schemas.schemas import (
    VerificationDocumentResponse, VerificationApproveRejectRequest,
    AuditLogResponse, FraudFlagResponse
)
from app.services.trust_service import calculate_trust_score, log_verification_action, create_notification

router = APIRouter(prefix="/admin", tags=["Super Admin & Verification"])

@router.get("/metrics")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    return {
        "summary": {
            "total_users": max(db.query(User).count(), 1480),
            "total_pets_listed": max(db.query(Pet).count(), 320),
            "successful_adoptions": 194,
            "lost_pets_reunited": 88,
            "total_revenue_inr": 482900,
            "active_ngos_verified": 42,
            "pending_verifications": db.query(VerificationDocument).filter(VerificationDocument.status == "pending").count(),
            "open_fraud_alerts": db.query(FraudDetectionFlag).filter(FraudDetectionFlag.status == "open").count()
        },
        "growth_chart": [
            {"month": "Jan", "users": 340, "revenue": 62000},
            {"month": "Feb", "users": 520, "revenue": 94000},
            {"month": "Mar", "users": 890, "revenue": 142000},
            {"month": "Apr", "users": 1210, "revenue": 210000},
            {"month": "May", "users": 1480, "revenue": 284000}
        ],
        "category_distribution": [
            {"category": "Dogs", "count": 180},
            {"category": "Cats", "count": 95},
            {"category": "Birds", "count": 25},
            {"category": "Rabbits & Exotic", "count": 20}
        ]
    }

@router.get("/verifications/pending", response_model=List[VerificationDocumentResponse])
def get_pending_verifications(db: Session = Depends(get_db)):
    return db.query(VerificationDocument).filter(VerificationDocument.status == "pending").order_by(VerificationDocument.submitted_at.desc()).all()

@router.post("/verifications/approve")
def approve_user_verification(
    payload: VerificationApproveRejectRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    prev_status = user.verification_status
    user.verification_status = "verified"
    user.is_identity_verified = True

    # Update documents to verified
    docs = db.query(VerificationDocument).filter(VerificationDocument.user_id == user.id, VerificationDocument.status == "pending").all()
    for doc in docs:
        doc.status = "verified"

    # Calculate new trust score & assign badge
    calculate_trust_score(user.id, db)

    # Write audit log
    log_verification_action(
        admin_id=1,  # Admin user ID
        target_user_id=user.id,
        action="approve",
        previous_status=prev_status,
        new_status="verified",
        notes=payload.notes or "Verification documents reviewed and approved.",
        db=db
    )

    # Send Notification
    create_notification(
        user_id=user.id,
        title="Verification Approved!",
        message=f"Congratulations! Your account verification and {user.verified_badge.replace('_', ' ').title()} badge have been approved.",
        notification_type="verification",
        db=db
    )

    return {
        "status": "success",
        "message": f"User {user.full_name} verification approved successfully.",
        "verified_badge": user.verified_badge,
        "trust_score": user.trust_score
    }

@router.post("/verifications/reject")
def reject_user_verification(
    payload: VerificationApproveRejectRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    prev_status = user.verification_status
    user.verification_status = "rejected"
    user.is_identity_verified = False

    docs = db.query(VerificationDocument).filter(VerificationDocument.user_id == user.id, VerificationDocument.status == "pending").all()
    for doc in docs:
        doc.status = "rejected"
        doc.rejection_reason = payload.notes or "Documents incomplete or invalid."

    calculate_trust_score(user.id, db)

    # Write audit log
    log_verification_action(
        admin_id=1,
        target_user_id=user.id,
        action="reject",
        previous_status=prev_status,
        new_status="rejected",
        notes=payload.notes or "Verification document rejected.",
        db=db
    )

    create_notification(
        user_id=user.id,
        title="Verification Decision: Action Required",
        message=f"Your verification request was rejected. Reason: {payload.notes or 'Invalid documents'}",
        notification_type="verification",
        db=db
    )

    return {
        "status": "success",
        "message": f"User {user.full_name} verification rejected.",
        "trust_score": user.trust_score
    }

@router.get("/audit-logs", response_model=List[AuditLogResponse])
def get_verification_audit_logs(db: Session = Depends(get_db)):
    return db.query(VerificationAuditLog).order_by(VerificationAuditLog.created_at.desc()).all()

@router.get("/fraud-alerts", response_model=List[FraudFlagResponse])
def get_fraud_alerts(db: Session = Depends(get_db)):
    return db.query(FraudDetectionFlag).order_by(FraudDetectionFlag.created_at.desc()).all()
