from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import ServiceBooking
from app.schemas.schemas import BookingCreate

router = APIRouter(prefix="/services", tags=["Pet Care & Bookings"])

@router.get("/providers")
def get_service_providers():
    return [
        {
            "id": 1,
            "name": "Dr. Ananya Sharma (BVSc & AH)",
            "service_type": "Veterinary",
            "rating": 4.9,
            "reviews_count": 142,
            "location": "Koramangala, Bengaluru",
            "price_per_slot": 600,
            "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400"
        },
        {
            "id": 2,
            "name": "Pawsome Spa & Grooming Studio",
            "service_type": "Grooming",
            "rating": 4.8,
            "reviews_count": 98,
            "location": "Indiranagar, Bengaluru",
            "price_per_slot": 1200,
            "image": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400"
        },
        {
            "id": 3,
            "name": "Happy Tails Pet Resort & Boarding",
            "service_type": "Boarding",
            "rating": 4.9,
            "reviews_count": 210,
            "location": "Whitefield, Bengaluru",
            "price_per_slot": 850,
            "image": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400"
        }
    ]

@router.post("/book")
def create_booking(booking_in: BookingCreate, db: Session = Depends(get_db)):
    booking = ServiceBooking(
        user_id=1,
        service_type=booking_in.service_type,
        provider_name=booking_in.provider_name,
        booking_date=booking_in.booking_date,
        booking_time=booking_in.booking_time,
        notes=booking_in.notes,
        price=booking_in.price,
        status="Confirmed"
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return {
        "message": "Appointment booked successfully!",
        "booking_id": booking.id,
        "details": booking
    }

@router.get("/my-bookings")
def get_my_bookings(db: Session = Depends(get_db)):
    return db.query(ServiceBooking).all()
