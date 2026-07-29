from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_get_pets():
    response = client.get("/api/v1/pets")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_ai_chat():
    response = client.post("/api/v1/ai/chat", json={"prompt": "breed recommendation for small flat"})
    assert response.status_code == 200
    assert "reply" in response.json()
