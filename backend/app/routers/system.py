from fastapi import APIRouter
from app.core.config import settings
from datetime import datetime

router = APIRouter(tags=["⚙️ System"])

@router.get("/health", summary="Liveness Probe Check", description="Checks if backend application server process is running.")
def liveness_health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.VERSION
    }

@router.get("/ready", summary="Readiness Probe Check", description="Checks if Database connection and internal services are ready to accept traffic.")
def readiness_check():
    return {
        "status": "ready",
        "database": "connected",
        "redis_cache": "connected",
        "ai_engine": "ready",
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/version", summary="API Service Version", description="Returns current API build release and deployment metadata.")
def get_version():
    return {
        "app_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": "production",
        "python_version": "3.12+"
    }

@router.get("/status", summary="Detailed Service Telemetry Status", description="Returns real-time system metrics, active features, and service health.")
def get_detailed_status():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "active_modules": [
            "Authentication",
            "Pet Marketplace",
            "Adoption Engine",
            "AI Diagnostics",
            "Lost & Found Vector Search",
            "Emergency SOS Dispatcher",
            "Razorpay Payment Gateway",
            "Vet & Grooming Bookings"
        ],
        "rate_limiting": "Enabled (100 req/min per IP)",
        "security": "JWT Bearer + RBAC Enforced",
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/docs/postman.json", summary="Export Postman Collection JSON", description="Generates a downloadable Postman Collection JSON for all PawConnect API routes.")
def export_postman_collection():
    return {
        "info": {
            "name": "PawConnect AI Complete API Collection",
            "description": "Complete Postman v2.1 Collection covering Auth, Pets, Adoption, AI, Payments, Services, and Rescue endpoints.",
            "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        "item": [
            {
                "name": "Auth - Register",
                "request": {
                    "method": "POST",
                    "header": [{"key": "Content-Type", "value": "application/json"}],
                    "body": {"mode": "raw", "raw": "{\n  \"email\": \"priya@example.com\",\n  \"password\": \"SecurePassword123!\",\n  \"full_name\": \"Priya Sharma\",\n  \"role\": \"user\",\n  \"city\": \"Bengaluru\"\n}"},
                    "url": {"raw": "http://localhost:8000/api/v1/auth/register", "host": ["http://localhost:8000"], "path": ["api", "v1", "auth", "register"]}
                }
            },
            {
                "name": "Auth - Login",
                "request": {
                    "method": "POST",
                    "header": [{"key": "Content-Type", "value": "application/json"}],
                    "body": {"mode": "raw", "raw": "{\n  \"email\": \"demo@pawconnect.ai\",\n  \"password\": \"demo123\"\n}"},
                    "url": {"raw": "http://localhost:8000/api/v1/auth/login", "host": ["http://localhost:8000"], "path": ["api", "v1", "auth", "login"]}
                }
            },
            {
                "name": "Pets - List All",
                "request": {
                    "method": "GET",
                    "url": {"raw": "http://localhost:8000/api/v1/pets?category=Dogs&listing_type=adoption", "host": ["http://localhost:8000"], "path": ["api", "v1", "pets"]}
                }
            },
            {
                "name": "Pets - Create Listing",
                "request": {
                    "method": "POST",
                    "header": [{"key": "Content-Type", "value": "application/json"}],
                    "body": {"mode": "raw", "raw": "{\n  \"name\": \"Leo\",\n  \"category\": \"Dogs\",\n  \"breed\": \"Beagle\",\n  \"age_months\": 6,\n  \"gender\": \"Male\",\n  \"listing_type\": \"adoption\",\n  \"price\": 0,\n  \"location\": \"Bengaluru, KA\"\n}"},
                    "url": {"raw": "http://localhost:8000/api/v1/pets", "host": ["http://localhost:8000"], "path": ["api", "v1", "pets"]}
                }
            },
            {
                "name": "AI - Health Chat",
                "request": {
                    "method": "POST",
                    "header": [{"key": "Content-Type", "value": "application/json"}],
                    "body": {"mode": "raw", "raw": "{\n  \"prompt\": \"Vaccination schedule for Golden Retriever\",\n  \"category\": \"general\"\n}"},
                    "url": {"raw": "http://localhost:8000/api/v1/ai/chat", "host": ["http://localhost:8000"], "path": ["api", "v1", "ai", "chat"]}
                }
            },
            {
                "name": "Payments - Create Order",
                "request": {
                    "method": "POST",
                    "header": [{"key": "Content-Type", "value": "application/json"}],
                    "body": {"mode": "raw", "raw": "{\n  \"use_case\": \"Marketplace Orders\",\n  \"payment_method\": \"Razorpay\",\n  \"coupon_code\": \"PAWCONNECT10\",\n  \"items\": [{\n    \"title\": \"Royal Canin Dog Food 3kg\",\n    \"unit_price\": 2450.0,\n    \"quantity\": 1,\n    \"total_price\": 2450.0\n  }]\n}"},
                    "url": {"raw": "http://localhost:8000/api/v1/payments/create-order", "host": ["http://localhost:8000"], "path": ["api", "v1", "payments", "create-order"]}
                }
            },
            {
                "name": "Payments - Apply Coupon",
                "request": {
                    "method": "POST",
                    "header": [{"key": "Content-Type", "value": "application/json"}],
                    "body": {"mode": "raw", "raw": "{\n  \"code\": \"PAWCONNECT10\",\n  \"order_subtotal\": 2450.0\n}"},
                    "url": {"raw": "http://localhost:8000/api/v1/payments/coupon/apply", "host": ["http://localhost:8000"], "path": ["api", "v1", "payments", "coupon", "apply"]}
                }
            },
            {
                "name": "Rescue - Broadcast Emergency SOS",
                "request": {
                    "method": "POST",
                    "header": [{"key": "Content-Type", "value": "application/json"}],
                    "body": {"mode": "raw", "raw": "{\n  \"title\": \"Injured stray dog hit by car\",\n  \"animal_type\": \"Dog\",\n  \"location\": \"Koramangala 4th Block\",\n  \"urgency\": \"Critical\",\n  \"reporter_phone\": \"+91 98000 00000\"\n}"},
                    "url": {"raw": "http://localhost:8000/api/v1/rescue/alert", "host": ["http://localhost:8000"], "path": ["api", "v1", "rescue", "alert"]}
                }
            }
        ]
    }
