import pytest
import re
from fastapi.testclient import TestClient
from app.main import app
from app.models.models import User
from tests.conftest import TestingSessionLocal

client = TestClient(app)

@pytest.fixture(autouse=True)
def seed_test_user():
    db = TestingSessionLocal()
    existing = db.query(User).filter(User.email == "buyer@example.com").first()
    if not existing:
        u = User(full_name="Test Buyer", email="buyer@example.com", hashed_password="hashed_pass_123", role="user")
        db.add(u)
        db.commit()
    db.close()
    yield

def test_create_order():
    response = client.post(
        "/api/v1/payments/create-order",
        json={
            "use_case": "Marketplace Orders",
            "payment_method": "Razorpay",
            "items": [
                {
                    "item_title": "Royal Canin Golden Retriever Adult",
                    "title": "Royal Canin Golden Retriever Adult",
                    "quantity": 1,
                    "unit_price": 2450.0,
                    "total_price": 2450.0
                }
            ],
            "shipping_address": "Flat 402, Green Acres, Indiranagar, Bengaluru, KA - 560038"
        }
    )
    assert response.status_code == 201, response.text
    data = response.json()
    assert "id" in data
    assert data["total_amount"] > 2450.0
    assert data["payment_status"] in ("Pending", "pending")
    assert data["order_status"] in ("Created", "confirmed")

def test_apply_coupon():
    response = client.post(
        "/api/v1/payments/coupon/apply",
        json={
            "code": "PAWCONNECT10",
            "order_subtotal": 2450.0
        }
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["discount_amount"] > 0

def test_wallet_balance():
    response = client.get("/api/v1/payments/wallet")
    assert response.status_code == 200, response.text
    data = response.json()
    assert "balance" in data
    assert data["currency"] == "INR"

def test_admin_payment_analytics():
    response = client.get("/api/v1/payments/admin/analytics")
    assert response.status_code == 200, response.text
    data = response.json()
    assert "revenue_summary" in data
    assert "payment_method_share" in data
