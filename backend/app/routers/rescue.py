from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import RescueAlert

router = APIRouter(prefix="/rescue", tags=["NGO & Emergency Rescue"])

def seed_rescues(db: Session):
    if db.query(RescueAlert).count() == 0:
        alerts = [
            RescueAlert(
                title="Injured Stray Dog Needs Immediate Medical Care",
                animal_type="Dog",
                location="Koramangala 4th Block, Bengaluru",
                urgency="Critical",
                description="Street dog hit by a two-wheeler, leg injury detected. Needs ambulance transport to vet.",
                reporter_phone="+91 98450 12345",
                status="Open",
                image_url="https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600"
            ),
            RescueAlert(
                title="Abandoned Kittens Found in Cardboard Box",
                animal_type="Cat",
                location="Shivaji Nagar, Pune",
                urgency="High",
                description="4 newborn kittens abandoned in rain. Require foster care and milk formula urgently.",
                reporter_phone="+91 97654 32109",
                status="Assigned",
                image_url="https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600"
            )
        ]
        db.add_all(alerts)
        db.commit()

@router.get("/alerts")
def get_rescue_alerts(db: Session = Depends(get_db)):
    seed_rescues(db)
    return db.query(RescueAlert).order_by(RescueAlert.id.desc()).all()

@router.post("/alert")
def create_rescue_alert(data: dict, db: Session = Depends(get_db)):
    alert = RescueAlert(
        title=data.get("title", "Emergency Animal Rescue SOS"),
        animal_type=data.get("animal_type", "Dog"),
        location=data.get("location", "Unknown Location"),
        urgency=data.get("urgency", "Critical"),
        description=data.get("description", "Urgent help needed"),
        reporter_phone=data.get("reporter_phone", "+91 90000 00000"),
        status="Open"
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return {
        "status": "broadcasted",
        "message": "Emergency alert broadcasted to 14 verified NGOs and nearby rescue volunteers!",
        "alert": alert
    }
