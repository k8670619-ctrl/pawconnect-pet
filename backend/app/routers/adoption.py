from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import AdoptionApplication
from app.schemas.schemas import AdoptionCreate

router = APIRouter(prefix="/adoption", tags=["Adoption Workflow"])

@router.post("/apply")
def submit_adoption_application(app_in: AdoptionCreate, db: Session = Depends(get_db)):
    application = AdoptionApplication(
        pet_id=app_in.pet_id,
        applicant_id=1,
        home_type=app_in.home_type,
        has_other_pets=app_in.has_other_pets,
        reason=app_in.reason,
        status="Home Verification Pending"
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return {
        "message": "Adoption application submitted successfully!",
        "application_id": application.id,
        "status": application.status,
        "next_step": "Our regional volunteer will initiate home verification check within 24 hours."
    }

@router.get("/my-applications")
def get_user_adoptions(db: Session = Depends(get_db)):
    apps = db.query(AdoptionApplication).all()
    return apps
