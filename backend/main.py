from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from firebase_auth import get_current_user
from services.user_service import (
    get_user_by_uid,
    create_user,
    update_last_login,
    serialize_user,
)

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- HEALTH CHECK (OPTIONAL BUT RECOMMENDED) ----------------
@app.get("/")
def root():
    return {"status": "Backend running"}

# ---------------- GET CURRENT USER ----------------
@app.get("/me")
async def get_me(current_user=Depends(get_current_user)):
    uid = current_user["uid"]

    user = await get_user_by_uid(uid)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return serialize_user(user)

# ---------------- CREATE USER (SIGNUP / SOCIAL LOGIN) ----------------
@app.post("/users")
async def create_user_route(
    data: dict = None,
    current_user=Depends(get_current_user),
):
    uid = current_user["uid"]
    email = current_user.get("email")
    provider = current_user.get("firebase", {}).get(
        "sign_in_provider", "password"
    )

    existing_user = await get_user_by_uid(uid)
    if existing_user:
        await update_last_login(uid)
        return serialize_user(existing_user)

    user = await create_user(
        uid=uid,
        email=email,
        provider=provider,
    )

    return serialize_user(user)
