from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.models import LostFoundReport
from app.schemas.schemas import LostFoundCreate

router = APIRouter(prefix="/lost-found", tags=["Lost & Found Pets"])

def seed_reports(db: Session):
    if db.query(LostFoundReport).count() == 0:
        reports = [
            LostFoundReport(
                report_type="Lost",
                pet_name="Sheru",
                category="Dog",
                breed="Indie / Pariah",
                last_seen_location="HSR Layout Sector 1, Bengaluru",
                description="Wearing a blue collar with tag. Extremely friendly, answers to Sheru.",
                reward_amount=5000.0,
                contact_phone="+91 99887 76655",
                image_url="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600",
                status="Active"
            ),
            LostFoundReport(
                report_type="Found",
                pet_name="Unknown Cat",
                category="Cat",
                breed="Persian Mix",
                last_seen_location="Bandra West, Near Hill Road, Mumbai",
                description="Found roaming near Bandra station. Long white fur, fluffy tail.",
                reward_amount=0.0,
                contact_phone="+91 98200 11223",
                image_url="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600",
                status="Active"
            )
        ]
        db.add_all(reports)
        db.commit()

@router.get("")
def get_lost_found_reports(report_type: Optional[str] = Query(None), db: Session = Depends(get_db)):
    seed_reports(db)
    query = db.query(LostFoundReport)
    if report_type and report_type.lower() != "all":
        query = query.filter(LostFoundReport.report_type.ilike(f"%{report_type}%"))
    return query.order_by(LostFoundReport.id.desc()).all()

@router.post("")
def report_lost_or_found(report_in: LostFoundCreate, db: Session = Depends(get_db)):
    report = LostFoundReport(**report_in.model_dump(), user_id=1)
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
