from fastapi import APIRouter
from app.schemas.schemas import AIChatRequest, AIChatResponse, ErrorResponse
from app.services.ai_service import AIService

router = APIRouter(prefix="/ai", tags=["🤖 AI Assistant"])

@router.post(
    "/chat",
    response_model=AIChatResponse,
    summary="AI Vet & Breed Advisor Consultation",
    description="""
Interacts with PawConnect AI Vet 2.0 engine to evaluate health symptoms, generate vaccination reminders, recommend apartment-friendly breeds, and suggest pet names.

### 🤖 Capabilities & Modes
- `general`: Behavior, care, diet, and nutrition guidance
- `breed`: Lifestyle, climate & home-size breed selector
- `symptom`: Symptom severity evaluation & emergency vet triage
- `vaccine`: Core Rabies, DHPPi & Deworming schedule generator
- `name`: Creative pet naming assistant

### 💻 Code Example (Python)
```python
import requests
res = requests.post("http://localhost:8000/api/v1/ai/chat", json={
    "prompt": "Recommend top 3 breeds for an apartment in Mumbai with active lifestyle",
    "category": "breed"
})
print(res.json())
```
"""
)
def ai_assistant_chat(req: AIChatRequest):
    res = AIService.generate_chat_response(req.prompt, req.category or "general")
    if "reply" in res and "response" not in res:
        res["response"] = res["reply"]
    return AIChatResponse(**res)

@router.post(
    "/match-image",
    summary="AI Lost Pet Visual Vector Matcher",
    description="""
Performs AI image feature similarity search to find matching lost or found pet reports in our vector database.

### 💻 Code Example (cURL)
```bash
curl -X POST "http://localhost:8000/api/v1/ai/match-image?image_url=https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=500"
```
""",
    tags=["📍 Lost & Found"]
)
def match_lost_pet_image(image_url: str, description: str = ""):
    matches = AIService.match_lost_pet_image(image_url, description)
    return {
        "status": "success",
        "matches_found": len(matches),
        "matches": matches
    }
