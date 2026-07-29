from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Product

router = APIRouter(prefix="/marketplace", tags=["Pet E-Commerce Marketplace"])

def seed_products(db: Session):
    if db.query(Product).count() == 0:
        items = [
            Product(
                title="Royal Canin Breed Health Nutrition Adult Dry Dog Food (3kg)",
                category="Food",
                price=2450.0,
                rating=4.9,
                image_url="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600",
                description="Tailored nutrition designed specifically for purebred adult dogs."
            ),
            Product(
                title="Interactive Tough Rubber Chew Toy with Treats Slot",
                category="Toys",
                price=499.0,
                rating=4.7,
                image_url="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600",
                description="Ultra-durable non-toxic rubber chew toy for active teething dogs."
            ),
            Product(
                title="Orthopedic Memory Foam Soft Bolster Pet Bed (Large)",
                category="Beds",
                price=3299.0,
                rating=4.8,
                image_url="https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=600",
                description="Relieves joint pressure with high-density premium memory foam cushion."
            ),
            Product(
                title="Organic Neem & Tea Tree Flea & Tick Shampoo (500ml)",
                category="Grooming",
                price=650.0,
                rating=4.8,
                image_url="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600",
                description="Natural Ayurvedic formula that repels ticks and calms itchy pet skin."
            )
        ]
        db.add_all(items)
        db.commit()

@router.get("/products")
def get_products(db: Session = Depends(get_db)):
    seed_products(db)
    return db.query(Product).all()

@router.post("/checkout")
def checkout_cart(order_data: dict):
    return {
        "status": "success",
        "order_id": "ORD-PAW-98421",
        "razorpay_order_id": "order_NzK89123xP",
        "amount": order_data.get("amount", 2949.0),
        "currency": "INR",
        "message": "Razorpay order initialized. Ready for payment gateway modal."
    }
