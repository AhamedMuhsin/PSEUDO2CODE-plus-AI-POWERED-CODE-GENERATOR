
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from db import users_collection
from services.user_service import add_xp, award_badge

from firebase_auth import get_current_user
from services.user_service import (
    get_user_by_uid,
    create_user,
    update_last_login,
    serialize_user,
    add_activity,   # ✅ ADD THIS
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
        raise HTTPException(status_code=404, detail="User not found")

    return {
        **serialize_user(user),
        "recent_activity": user.get("recent_activity", [])
    }


# ---------------- CREATE USER (SIGNUP / SOCIAL LOGIN) ----------------
@app.post("/users")
async def create_user_route(current_user=Depends(get_current_user)):
    uid = current_user["uid"]
    email = current_user.get("email")
    provider = current_user.get("firebase", {}).get(
        "sign_in_provider", "password"
    )

    raw_name = current_user.get("name")
    name = raw_name if raw_name else email.split("@")[0]

    existing_user = await get_user_by_uid(uid)
    if existing_user:
        await update_last_login(uid)
        return serialize_user(existing_user)

    user = await create_user(
        uid=uid,
        email=email,
        provider=provider,
        name=name,   # ✅ GUARANTEED NON-NULL
    )

    return serialize_user(user)

@app.get("/dashboard")
async def get_dashboard(current_user=Depends(get_current_user)):
    uid = current_user["uid"]
    user = await get_user_by_uid(uid)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "stats": user.get("stats", {}),
        "recent_activity": user.get("recent_activity", [])
    }

@app.post("/generate-code")
async def generate_code(payload: dict, current_user=Depends(get_current_user)):
    uid = current_user["uid"]

    language = payload.get("language", "Unknown")
    algorithm = payload.get("algorithm", "algorithm")

    # TODO: AI generation logic later
    generated_code = "..."

    result = await add_xp(uid, 10)
    await add_xp(uid, 10)

# Check first code badge
    user = await get_user_by_uid(uid)
    if user["stats"]["codes_generated"] == 1:
        await award_badge(
            uid,
            "first_code",
            "First Code Generated",
            "🥉"
        )

    if result and result.get("leveled_up"):
        await add_activity(
            uid,
            "level",
            f"Leveled up to Level {result['level']}!"
        )
        await award_badge(
            uid,
            f"level_{result['level']}",
            f"Reached Level {result['level']}",
            "🚀"
        )

    # ✅ LOG ACTIVITY
    await add_activity(
        uid,
        "code",
        f"Generated {language} code for {algorithm}"
    )

    return {"code": generated_code}

@app.post("/visualize")
async def visualize(payload: dict, current_user=Depends(get_current_user)):
    uid = current_user["uid"]
    algorithm = payload.get("algorithm", "algorithm")

    result = await add_xp(uid, 15)
    user = await get_user_by_uid(uid)
    if user["stats"]["visualizations"] == 1:
        await award_badge(
            uid,
            "first_visual",
            "First Visualization",
            "👁"
    )
    if result and result.get("leveled_up"):
        await add_activity(
            uid,
            "level",
            f"Leveled up to Level {result['level']}!"
        )
        await award_badge(
            uid,
            f"level_{result['level']}",
            f"Reached Level {result['level']}",
            "🚀"
        )

    # ✅ LOG ACTIVITY
    await add_activity(
        uid,
        "visual",
        f"Visualized {algorithm} algorithm"
    )

    return {"status": "ok"}
