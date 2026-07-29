import random
from typing import Dict, Any, List

class AIService:
    @staticmethod
    def generate_chat_response(prompt: str, category: str = "general") -> Dict[str, Any]:
        prompt_lower = prompt.lower()
        
        if "symptom" in prompt_lower or "vomiting" in prompt_lower or "fever" in prompt_lower or "sick" in prompt_lower:
            return {
                "reply": "Based on your description, your pet may be experiencing mild gastrointestinal distress or fatigue. Ensure they have access to fresh water and rest. If symptoms persist for more than 24 hours or if you notice severe lethargy, please consult a verified veterinarian immediately via our Booking tab.",
                "recommendations": [
                    "Keep pet hydrated with fresh water",
                    "Bland diet (boiled rice + chicken for dogs)",
                    "Monitor body temperature",
                    "Book online consultation with Dr. Ananya Sharma"
                ],
                "urgency_level": "Moderate"
            }
            
        elif "breed" in prompt_lower or "recommend" in prompt_lower or "lifestyle" in prompt_lower:
            return {
                "reply": "Based on Indian climate and urban living conditions, here are the top 3 breed recommendations suited for warm weather, apartment compatibility, and minimal shedding:",
                "recommendations": [
                    "Golden Retriever (Friendly, active, great with families)",
                    "Labrador Retriever (Highly adaptable, intelligent)",
                    "Indian Pariah Dog (Extremely resilient, highly immune, perfect for Indian climate)",
                    "Persian Cat (Calm indoor companion)"
                ],
                "urgency_level": "Normal"
            }
            
        elif "vaccine" in prompt_lower or "vaccination" in prompt_lower:
            return {
                "reply": "Essential core vaccination schedule for Indian pets:\n1. 6-8 weeks: DHPPi + Lepto (Dogs) / FVRCP (Cats)\n2. 12 weeks: Booster + Rabies Vaccine\n3. Annual Deworming & Rabies Booster.",
                "recommendations": [
                    "Rabies Vaccine (Mandatory)",
                    "9-in-1 Combo Vaccine",
                    "Monthly Anti-Tick Spot-on Treatment"
                ],
                "urgency_level": "Normal"
            }
            
        elif "name" in prompt_lower:
            names = ["Simba", "Bella", "Bruno", "Coco", "Milo", "Kira", "Leo", "Oreo", "Tommy", "Sheru"]
            selected = random.sample(names, 4)
            return {
                "reply": f"Here are 4 popular and catchy pet names for your new companion: {', '.join(selected)}!",
                "recommendations": selected,
                "urgency_level": "Normal"
            }

        else:
            return {
                "reply": f"Hello! I am PawConnect AI assistant. I can assist you with breed advice, nutrition guidelines, emergency medical guidance, and matching lost pets. How can I help your furry friend today?",
                "recommendations": [
                    "Ask for breed recommendations based on apartment size",
                    "Check vaccination schedule",
                    "Find top-rated grooming centers near you",
                    "Report a lost or found pet"
                ],
                "urgency_level": "Normal"
            }

    @staticmethod
    def match_lost_pet_image(image_url: str, description: str) -> List[Dict[str, Any]]:
        # Visual similarity matching simulation score
        return [
            {
                "matched_report_id": 101,
                "confidence_score": 0.94,
                "pet_name": "Bruno",
                "category": "Dog",
                "breed": "Beagle",
                "last_seen": "Koramangala, Bengaluru",
                "contact_phone": "+91 98765 43210",
                "status": "Found",
                "image_url": "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=500"
            },
            {
                "matched_report_id": 102,
                "confidence_score": 0.81,
                "pet_name": "Unknown Golden",
                "category": "Dog",
                "breed": "Golden Retriever",
                "last_seen": "Indiranagar, Bengaluru",
                "contact_phone": "+91 98123 45678",
                "status": "Found",
                "image_url": "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500"
            }
        ]
