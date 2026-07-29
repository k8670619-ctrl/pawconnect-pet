from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
import app.models.models
from app.seed_dev_admins import seed_default_admins
from app.routers import auth, pets, adoption, lost_found, ai, services, marketplace, rescue, admin, system, payments, verification

# Create all database tables cleanly
Base.metadata.create_all(bind=engine)

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed default dev admin accounts automatically on startup (dev mode only)
    try:
        _db = SessionLocal()
        seed_default_admins(_db)
        _db.close()
    except Exception as _e:
        print(f"Startup seeding notice: {_e}")
    yield

tags_metadata = [
    {
        "name": "🔐 Authentication",
        "description": "JWT Register, Login, Token Refresh, Google OAuth, and Session Management endpoints.",
        "externalDocs": {
            "description": "JWT Security & RBAC Guide",
            "url": "https://pawconnect.ai/docs/auth"
        }
    },
    {
        "name": "👤 Users",
        "description": "User profile retrieval, avatar uploads, and medical record access."
    },
    {
        "name": "🐾 Pets",
        "description": "Pet catalog search, breed filtering, city locations, and listing creation for adoption or sale."
    },
    {
        "name": "❤️ Adoption",
        "description": "4-Stage adoption workflow: Application submission, home verification, and digital agreements."
    },
    {
        "name": "📍 Lost & Found",
        "description": "Lost/Found pet reports, community bulletin search, and AI visual vector matching."
    },
    {
        "name": "🤖 AI Assistant",
        "description": "24/7 AI Veterinary consultation, symptom checker, and apartment breed selector."
    },
    {
        "name": "📅 Bookings",
        "description": "Appointment scheduling for verified Veterinarians, Grooming Spas, and Boarding hosts."
    },
    {
        "name": "🛒 Marketplace",
        "description": "E-Commerce catalog for organic food, chew toys, beds, and Razorpay checkout initialization."
    },
    {
        "name": "🤝 NGOs",
        "description": "24/7 Emergency Animal Rescue SOS alert dispatching to 40+ verified NGO partners."
    },
    {
        "name": "📊 Admin",
        "description": "Super Admin metrics, platform revenue monitoring, and AI breeder fraud detection."
    },
    {
        "name": "⚙️ System",
        "description": "Liveness/Readiness probes, system telemetry status, and Postman Collection export."
    }
]

app = FastAPI(
    title="🐾 PawConnect AI - Developer API Documentation",
    lifespan=lifespan,
    description="""
# Welcome to PawConnect AI Developer Documentation 🚀

PawConnect AI is India's most advanced Pet Ecosystem API, supporting **Pet Adoption**, **Verified Sales**, **Emergency NGO Rescue Dispatch**, **AI Lost & Found Matching**, **24/7 AI Veterinary Diagnostics**, and **Razorpay E-Commerce Payments**.

---

### 🔑 Authentication Architecture
The API enforces **JWT Bearer Token Authentication** for protected endpoints.
1. Obtain token via `POST /api/v1/auth/login` or `POST /api/v1/auth/register`.
2. Include token in HTTP Header:
   `Authorization: Bearer <your_access_token>`

---

### ⚡ Standard Error Codes
| Status Code | Error Code | Description |
|---|---|---|
| `400 Bad Request` | `INVALID_INPUT` | Missing or malformed parameters |
| `401 Unauthorized` | `AUTH_REQUIRED` | Missing or expired JWT bearer token |
| `403 Forbidden` | `INSUFFICIENT_PERMISSIONS` | Role insufficient for action |
| `404 Not Found` | `RESOURCE_NOT_FOUND` | Target entity does not exist |
| `429 Too Many Requests` | `RATE_LIMIT_EXCEEDED` | Exceeded 100 requests per minute |

---

### 🌐 Quick Useful Links
- **Postman Collection Export**: [`GET /api/v1/docs/postman.json`](http://localhost:8000/api/v1/docs/postman.json)
- **Liveness Health Check**: [`GET /api/v1/health`](http://localhost:8000/api/v1/health)
- **Readiness Probe**: [`GET /api/v1/ready`](http://localhost:8000/api/v1/ready)
""",
    version="1.0.0",
    openapi_tags=tags_metadata,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=None, # Replaced with custom styled Swagger UI
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Swagger UI Route with Stripe / Supabase Aesthetic Theme
@app.get("/docs", include_in_schema=False)
def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        title="PawConnect AI | API Reference",
        swagger_favicon_url="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100",
        swagger_ui_parameters={
            "defaultModelsExpandDepth": 1,
            "deepLinking": True,
            "displayRequestDuration": True,
            "docExpansion": "list",
            "filter": True
        }
    )

# Include API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(pets.router, prefix=settings.API_V1_STR)
app.include_router(adoption.router, prefix=settings.API_V1_STR)
app.include_router(lost_found.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(services.router, prefix=settings.API_V1_STR)
app.include_router(marketplace.router, prefix=settings.API_V1_STR)
app.include_router(rescue.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(payments.router, prefix=settings.API_V1_STR)
app.include_router(verification.router)
app.include_router(system.router, prefix=settings.API_V1_STR)

@app.get("/", include_in_schema=False)
def root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "docs": "/docs",
        "tagline": "Adopt • Buy • Sell • Rescue • Care • Connect"
    }

@app.get("/health", summary="Root Health Check", include_in_schema=False)
def root_health():
    return {"status": "healthy"}


