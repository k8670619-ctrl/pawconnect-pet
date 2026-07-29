from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.models import Pet, User
from app.core.security import get_current_user_optional
from app.schemas.schemas import PetCreate, PetResponse, ErrorResponse

router = APIRouter(prefix="/pets", tags=["🐾 Pets"])

def seed_pets_if_needed(db: Session):
    if db.query(Pet).count() == 0:
        sample_pets = [
            Pet(
                name="Bella",
                category="Dogs",
                breed="Golden Retriever",
                age_months=8,
                gender="Female",
                color="Golden",
                weight_kg=18.5,
                listing_type="adoption",
                price=0.0,
                description="Friendly, fully vaccinated Golden Retriever puppy looking for a loving home with a yard.",
                image_url="https://images.unsplash.com/photo-1552053831-71594a27632d?w=800",
                is_vaccinated=True,
                has_medical_certificate=True,
                location="Bengaluru, KA"
            ),
            Pet(
                name="Milo",
                category="Cats",
                breed="Persian Cat",
                age_months=12,
                gender="Male",
                color="White",
                weight_kg=4.2,
                listing_type="sale",
                price=15000.0,
                description="Purebred champion line Persian cat. Extremely calm and indoor friendly.",
                image_url="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800",
                is_vaccinated=True,
                has_medical_certificate=True,
                location="Mumbai, MH"
            )
        ]
        db.add_all(sample_pets)
        db.commit()

@router.get(
    "",
    response_model=List[PetResponse],
    summary="Search & Filter Pet Listings",
    description="""
Retrieves pet listings across India with real-time filtering, category tabs, and search queries.

### 🔍 Query Parameters & Filtering
- `category`: Filter by `Dogs`, `Cats`, `Birds`, `Fish`, `Rabbit`, `Exotic Pets`
- `listing_type`: Filter by `adoption` (Free) or `sale`
- `location`: City or state substring match (e.g. `Bengaluru`, `Mumbai`)
- `search`: Keyword query against pet name, breed, or description

### 💻 Code Examples

#### cURL
```bash
curl -X GET "http://localhost:8000/api/v1/pets?category=Dogs&listing_type=adoption"
```

#### JavaScript (Axios)
```javascript
const res = await axios.get('http://localhost:8000/api/v1/pets', {
  params: { category: 'Dogs', listing_type: 'adoption', location: 'Bengaluru' }
});
```
"""
)
def get_pets(
    category: Optional[str] = Query(None, description="Pet Category e.g. Dogs, Cats, Birds", examples={"default": {"value": "Dogs"}}),
    listing_type: Optional[str] = Query(None, description="Listing Type: adoption, sale", examples={"default": {"value": "adoption"}}),
    location: Optional[str] = Query(None, description="City location filter", examples={"default": {"value": "Bengaluru"}}),
    search: Optional[str] = Query(None, description="Search keyword query", examples={"default": {"value": "Retriever"}}),
    db: Session = Depends(get_db)
):
    seed_pets_if_needed(db)
    query = db.query(Pet)
    if category and category.lower() != "all":
        query = query.filter(Pet.category.ilike(f"%{category}%"))
    if listing_type and listing_type.lower() != "all":
        query = query.filter(Pet.listing_type == listing_type.lower())
    if location:
        query = query.filter(Pet.location.ilike(f"%{location}%"))
    if search:
        query = query.filter((Pet.name.ilike(f"%{search}%")) | (Pet.breed.ilike(f"%{search}%")) | (Pet.description.ilike(f"%{search}%")))
    
    return query.order_by(Pet.id.desc()).all()

@router.get(
    "/{pet_id}",
    response_model=PetResponse,
    summary="Get Pet Details by ID",
    description="Fetches full profile, medical history, vaccination badges, and contact info for a specific pet.",
    responses={
        404: {"model": ErrorResponse, "description": "Pet listing not found"}
    }
)
def get_pet_by_id(pet_id: int, db: Session = Depends(get_db)):
    seed_pets_if_needed(db)
    pet = db.query(Pet).filter(Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet listing not found")
    return pet

@router.post(
    "",
    response_model=PetResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create New Pet Listing",
    description="Publishes a new pet for adoption or verified sale."
)
def create_pet(
    pet_in: PetCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    # Requirement: Only verified sellers & approved organizations can create pet sale listings
    if pet_in.listing_type == "sale" or (pet_in.price and pet_in.price > 0):
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required to create pet sale listings."
            )
        if current_user.verification_status != "verified" or current_user.role not in ["seller", "shelter", "ngo", "veterinarian", "admin", "super_admin"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only verified sellers, shelters, NGOs, or veterinarians can create pet sale listings. Please submit identity verification."
            )

    db_pet = Pet(**pet_in.model_dump())
    if current_user:
        db_pet.owner_id = current_user.id
    db.add(db_pet)
    db.commit()
    db.refresh(db_pet)
    return db_pet

