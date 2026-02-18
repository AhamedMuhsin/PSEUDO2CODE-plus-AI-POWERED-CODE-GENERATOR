import requests

BASE = "http://127.0.0.1:8000"

# Test login
r = requests.post(f"{BASE}/auth/login", json={"email": "newtest@example.com", "password": "test123"})
print(f"Login: {r.status_code}")
token = r.json()["token"]

# Test protected route
r2 = requests.get(f"{BASE}/users/me", headers={"Authorization": f"Bearer {token}"})
print(f"Protected /users/me: {r2.status_code} - {r2.text[:200]}")

# Test without token
r3 = requests.get(f"{BASE}/users/me")
print(f"Without token: {r3.status_code}")
