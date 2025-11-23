from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_login_success():
    response = client.post("/login", json={"username":"chaima","password":"chaima"})
    assert response.status_code==200
    assert "access_token" in response.json()