# 🐾 PawConnect AI Backend API

> **Stripe & Supabase Grade OpenAPI 3.0 Documentation**

PawConnect AI Backend is a clean architecture FastAPI platform supporting pet marketplace, adoption workflows, lost pet visual vector matching, AI veterinary diagnostics, emergency NGO dispatching, and Razorpay payment gateways.

---

## 📚 Interactive API Documentation

- **Swagger UI Developer Portal**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Technical Reference**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Postman Collection Export**: [http://localhost:8000/api/v1/docs/postman.json](http://localhost:8000/api/v1/docs/postman.json)

---

## 🏷 Organized API Endpoint Groups

- **🔐 Authentication**: `/api/v1/auth/login`, `/register`, `/me`
- **🐾 Pets Marketplace**: `/api/v1/pets` (Filtering by breed, category, location, listing_type)
- **❤️ Adoption**: `/api/v1/adoption/apply`, `/my-applications`
- **📍 Lost & Found**: `/api/v1/lost-found` (Vector visual search)
- **🤖 AI Assistant**: `/api/v1/ai/chat`, `/match-image`
- **📅 Bookings**: `/api/v1/services/providers`, `/book`
- **🛒 Marketplace**: `/api/v1/marketplace/products`, `/checkout`
- **🤝 NGOs & Rescue**: `/api/v1/rescue/alert`, `/alerts`
- **📊 Admin**: `/api/v1/admin/metrics`
- **⚙️ System**: `/api/v1/health`, `/ready`, `/version`, `/status`

---

## 🛠 Local Setup & Execution

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

## 🧪 Execute Backend Unit Tests
```bash
python -m pytest tests/
```
