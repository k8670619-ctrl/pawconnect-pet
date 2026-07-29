# PawConnect AI Platform

> **Adopt • Buy • Sell • Rescue • Care • Connect**

PawConnect AI is India's most advanced Pet Ecosystem platform, providing pet adoption, verified buying & selling, lost pet visual AI matching, 24/7 AI veterinary diagnostics, emergency NGO rescue dispatch, e-commerce marketplace, and verified vet/grooming booking.

---

## 🚀 Key Features

- **Pet Marketplace & Adoption Hub**: Dogs, Cats, Birds, Fish, Rabbits, Exotic Pets with medical verification badges.
- **AI Health & Breed Advisor**: Interactive AI vet consultation, symptom checker, and apartment breed selector.
- **AI Lost & Found Matching**: Instant visual similarity vector search across lost/found reports.
- **Emergency Animal Rescue SOS**: Broadcast injured animal alerts directly to 40+ verified NGO partners.
- **Pet Care & Booking**: Online video consultation with certified vets, grooming spas, and luxury boarding resorts.
- **Pet Store E-Commerce**: Organic food, chew toys, orthopedic beds, and Razorpay payment gateway integration.
- **Super Admin Dashboard**: Ecosystem metrics, revenue tracking, and AI breeder fraud detection.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Zustand, Axios.
- **Backend**: FastAPI (Python 3.12+), SQLAlchemy 2.0, Pydantic v2, PyJWT, Passlib, Uvicorn.
- **DevOps**: Docker, Docker Compose, Nginx Reverse Proxy.

---

## 🏃 Quick Start (Local Run)

### 1. Run Backend (FastAPI)
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
- API Documentation (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Run Frontend (Next.js 15)
```bash
cd frontend
npm install
npm run dev
```
- Web Application: [http://localhost:3000](http://localhost:3000)

---

## 🐳 Docker Deployment

```bash
docker-compose up --build
```
Access the application at [http://localhost](http://localhost).
