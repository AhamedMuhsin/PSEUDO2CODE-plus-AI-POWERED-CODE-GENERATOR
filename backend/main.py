from fastapi import FastAPI, Depends
from firebase_auth import verify_token

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/me")
def get_current_user(user_data: dict = Depends(verify_token)):
    return {
        "uid": user_data.get("uid"),
        "email": user_data.get("email")
    }
