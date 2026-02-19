
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
import os
print("GROQ_API_KEY exists:", bool(os.getenv("GROQ_API_KEY")))

from services.ai.provider_manager import AIProviderManager
from routes import tasks
from routes.auth_routes import router as auth_router


from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from db import users_collection
import re
from services.streak.streak_service import update_streak
from services.xp.xp_service import add_xp
from services.activity.activity_service import add_activity
from services.xp.xp_config import XP
from services.gemini_service import generate_code, generate_multi_language
from services.visualization.visualizer_router import get_visualization
from urllib.parse import quote_plus
from services.visualization.cfg_generator import generate_mermaid_cfg
from services.activity.activity_service import delete_activity

from auth import get_current_user, hash_password, verify_password
from services.user_service import (
    get_user_by_uid,
    create_user,
    update_last_login,
    serialize_user,
    save_generated_code,
    save_visualization,
)

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # allow any origin during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ai_manager = AIProviderManager()
app.include_router(auth_router)
app.include_router(tasks.router)
# ============ REQUEST MODELS ============
class CreateUserRequest(BaseModel):
    provider: str = "password"
    name: str = None

class UpdateProfileRequest(BaseModel):
    name: str
    avatar: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    currentPassword: str
    newPassword: str

class VisualizeRequest(BaseModel):
    language: str
    code: str
    pseudocode: str = None
    algorithm: str = None

# ============ ROUTES ============
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
            status_code=401,
            detail="User no longer exists. Please log in again."
        )

    return {
        **serialize_user(user),
        "recent_activity": user.get("recent_activity", [])
    }


# ---------------- CREATE USER (SIGNUP / SOCIAL LOGIN) ----------------
@app.post("/users")
async def create_user_route(
    payload: CreateUserRequest,
    current_user=Depends(get_current_user)
):
    """Create or get user after successful Firebase authentication"""
    uid = current_user["uid"]
    email = current_user.get("email")
    
    # Extract provider from Firebase sign_in_provider claim
    provider = current_user.get("firebase", {}).get(
        "sign_in_provider", "password"
    )
    
    # Override with request payload if provided
    if payload.provider:
        provider = payload.provider
    
    # Get name from payload or derive from email
    raw_name = payload.name if payload.name else current_user.get("name")
    name = raw_name if raw_name else email.split("@")[0]
    
    # Check if user already exists
    existing_user = await get_user_by_uid(uid)
    if existing_user:
        await update_last_login(uid)
        return serialize_user(existing_user)
    
    # Create new user
    user = await create_user(
        uid=uid,
        email=email,
        provider=provider,
        name=name,
    )
    
    return serialize_user(user)

@app.put("/users/profile")
async def update_profile(
    payload: UpdateProfileRequest,
    current_user=Depends(get_current_user)
):
    """Update user profile information (name and/or avatar)"""
    if not payload.name or not payload.name.strip():
        raise HTTPException(
            status_code=400,
            detail="Name is required and cannot be empty"
        )
    
    update_data = {"name": payload.name.strip()}
    
    # Update avatar if provided (including empty string to remove it)
    if "avatar" in payload.__dict__:
        # None or empty string removes avatar, otherwise set it
        update_data["avatar"] = payload.avatar or None
    
    await users_collection.update_one(
        {"uid": current_user["uid"]},
        {"$set": update_data}
    )
    
    return {"success": True, "message": "Profile updated successfully"}

@app.post("/users/password")
async def change_password(
    payload: ChangePasswordRequest,
    current_user=Depends(get_current_user)
):
    """Change user password (email/password providers only)"""
    uid = current_user["uid"]
    
    # Get user from database
    user = await get_user_by_uid(uid)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Check if user is using email/password authentication
    if user.get("provider") not in ("password", "email"):
        raise HTTPException(
            status_code=400,
            detail="Password change is only available for email/password accounts"
        )
    
    try:
        # Verify current password
        password_hash = user.get("password_hash")
        if not password_hash or not verify_password(payload.currentPassword, password_hash):
            raise HTTPException(
                status_code=401,
                detail="Current password is incorrect."
            )
        
        # Hash and save new password
        new_hash = hash_password(payload.newPassword)
        await users_collection.update_one(
            {"uid": uid},
            {"$set": {"password_hash": new_hash}}
        )
        
        return {
            "success": True,
            "message": "Password changed successfully"
        }
        
    except HTTPException:
        raise
    except Exception as err:
        print(f"Password change error: {err}")
        raise HTTPException(
            status_code=401,
            detail="Failed to change password. Please verify your current password."
        )

@app.get("/dashboard")
async def get_dashboard(current_user=Depends(get_current_user)):
    uid = current_user["uid"]
    user = await get_user_by_uid(uid)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Calculate weekly increments for generated codes and visualizations
    from datetime import datetime, timedelta
    from services.badges.badge_definitions import BADGES

    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)

    generated_codes = user.get("generated_codes", [])
    visualizations = user.get("visualizations", [])

    codes_last_7 = sum(1 for c in generated_codes if isinstance(c.get("created_at"), datetime) and c["created_at"] >= week_ago)
    viz_last_7 = sum(1 for v in visualizations if isinstance(v.get("created_at"), datetime) and v["created_at"] >= week_ago)

    # Badges: compute remaining badges and next badge title
    owned_badges = set(b.get("id") if isinstance(b, dict) and b.get("id") else b for b in user.get("badges", []))
    # BADGES is a dict of badge_id -> definition
    all_badge_ids = list(BADGES.keys())
    remaining_badges = [bid for bid in all_badge_ids if bid not in owned_badges]
    badges_remaining = max(0, len(remaining_badges))
    next_badge_title = None
    if remaining_badges:
        # Prefer the next logical badge by value if available
        next_badge_id = remaining_badges[0]
        next_badge_title = BADGES.get(next_badge_id, {}).get("title")

    stats = user.get("stats", {})
    # merge weekly info
    stats = {
        **stats,
        "weekly": {
            "codes": codes_last_7,
            "visualizations": viz_last_7,
        },
        "badges_next": {
            "remaining": badges_remaining,
            "next_title": next_badge_title,
        }
    }

    return {
        "user": {
            "name": user.get("name"),
            "email": user.get("email"),
            "avatar": user.get("avatar"),
        },
        "stats": stats,
        "recent_activity": user.get("recent_activity", [])
    }

@app.post("/visualize")
async def visualize(
    payload: VisualizeRequest,
    current_user=Depends(get_current_user)
):
    uid = current_user["uid"]
    language = payload.language
    code = payload.code
    algorithm = payload.algorithm or payload.pseudocode

    if not language or not code:
        raise HTTPException(
            status_code=400,
            detail="Language and code required"
        )

    lang = language.lower()

    # ✅ Python → Python Tutor (UNCHANGED)
    if lang == "python":
        await save_visualization(
            uid=current_user["uid"],
            language=lang,
            code=code,
            viz_type="python-tutor"
        )
        return {
            "success": True,
            "visualization": {
                "type": "iframe",
                "url": "https://pythontutor.com/iframe-embed.html"
            }
        }

    # ✅ C / C++ → Mermaid CFG (NEW)
    if lang in ("c", "cpp"):
        diagram = generate_mermaid_cfg(code)
        if not diagram or diagram.strip() == "":
            return {
                "success": False,
                "error": "Failed to generate CFG diagram. Please check your code syntax."
            }
        await save_visualization(
            uid=current_user["uid"],
            language=lang,
            code=code,
            viz_type="mermaid-cfg"
        )
        return {
            "success": True,
            "visualization": {
                "type": "mermaid",
                "diagram": diagram
            }
        }


    # ⏳ Other languages (UNCHANGED PLACEHOLDER)
    if lang in ("javascript", "java"):
        await save_visualization(
            uid=current_user["uid"],
            language=lang,
            code=code,
            viz_type="external"
        )
        return {
            "success": True,
            "visualization": {
                "type": "external",
                "message": f"Use external visualizer for {language}"
            }
        }
    return {
        "success": False,
        "message": f"Visualization not supported for {language}"
    }

@app.get("/test-generate-code")
async def test_generate_code():
    """Test the generate_code function"""
    try:
        from services.gemini_service import generate_code
        
        pseudocode = "Input a number, multiply by 2, print result"
        result = generate_code(pseudocode, language="python" , level="beginner")
        
        return {
    "success": True,
    "code": result,
    "code_length": len(result),
    "code_preview": result[:100]
}

    except Exception as e:
        import traceback
        return {
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }

@app.post("/generate-code")
async def generate_code_endpoint(
    payload: dict,
    current_user=Depends(get_current_user)
):
    uid = current_user["uid"]

    pseudocode = payload.get("pseudocode")
    languages = payload.get("languages", ["python"])
    level = payload.get("level", "intermediate")

    if not pseudocode:
        raise HTTPException(status_code=400, detail="Pseudocode required")

    generated_code = {}

    # 🔥 STEP 6: Provider Manager usage
    for lang in languages:
        code = ai_manager.generate_code(
            pseudocode=pseudocode,
            language=lang,
            level=level
        )
        generated_code[lang] = code

        # Save per-language
        await save_generated_code(
            uid=uid,
            pseudocode=pseudocode,
            language=lang,
            level=level,
            code=code,
            explanation=None
        )

    await add_xp(uid, XP["GENERATE_CODE"])
    await update_streak(uid)

    return {
        "success": True,
        "generated_code": generated_code,
        "languages": languages,
        "level": level
    }
    
@app.get("/list-models")
def list_models():
    from google import genai
    import os

    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    models = client.models.list()

    return [m.name for m in models]

@app.get("/history/code/{code_id}")
async def get_generated_code(
    code_id: str,
    current_user=Depends(get_current_user)
):
    user = await get_user_by_uid(current_user["uid"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for code in user.get("generated_codes", []):
        if code.get("id") == code_id:
            return {
                "success": True,
                "code": code
            }

    raise HTTPException(status_code=404, detail="Code not found")

@app.get("/leaderboard")
async def get_leaderboard(
    type: str = "level",
    limit: int = 20,
    page: int = 1,
):
    """
    Global leaderboard
    type: level | xp | codes | visualizations
    """

    limit = min(limit, 50)
    skip = (page - 1) * limit

    if type == "level":
        sort = [
            ("stats.level", -1),
            ("stats.xp", -1),
        ]
    elif type == "xp":
        sort = [("stats.xp", -1)]
    elif type == "codes":
        sort = [("stats.codes_generated", -1)]
    elif type == "visualizations":
        sort = [("stats.visualizations", -1)]
    else:
        raise HTTPException(status_code=400, detail="Invalid leaderboard type")

    # Fetch one extra row to know if there is a next page
    cursor = (
        users_collection
        .find(
            {},
            {
                "_id": 0,
                "uid": 1,
                "name": 1,
                "avatar": 1,
                "stats": 1,
                "badges": 1, 
            }
        )
        .sort(sort)
        .skip(skip)
        .limit(limit + 1)
    )

    users = await cursor.to_list(length=limit + 1)
    has_next = len(users) > limit
    users = users[:limit]          # trim the extra probe row

    # Total count for total_pages
    total_count = await users_collection.count_documents({})
    total_pages = max(1, -(-total_count // limit))  # ceil division

    leaderboard = []
    rank_start = skip + 1

    for idx, user in enumerate(users):
        leaderboard.append({
            "rank": rank_start + idx,
            "uid": user["uid"],
            "name": user.get("name"),
            "avatar": user.get("avatar"),
            "level": user["stats"]["level"],
            "xp": user["stats"]["xp"],
            "codes_generated": user["stats"]["codes_generated"],
            "visualizations": user["stats"]["visualizations"],
            "badges": [
                b["icon"]
                for b in user.get("badges", [])[:3]  # ✅ TOP 3 ONLY
            ]
        })


    return {
        "type": type,
        "page": page,
        "limit": limit,
        "has_next": has_next,
        "total_pages": total_pages,
        "results": leaderboard
    }

@app.delete("/activity")
async def delete_user_activity(
    payload: dict,
    current_user=Depends(get_current_user)
):
    """
    Delete a single activity entry.
    - Removes from recent_activity
    - Decrements stats if applicable
    - Does NOT affect XP, level, or badges
    """
    uid = current_user["uid"]

    if not payload or "type" not in payload or "created_at" not in payload:
        raise HTTPException(
            status_code=400,
            detail="Invalid activity payload"
        )

    await delete_activity(uid, payload)

    return {"success": True}

@app.delete("/users/me")
async def delete_account(current_user=Depends(get_current_user)):
    uid = current_user["uid"]

    # Delete MongoDB user
    await users_collection.delete_one({"uid": uid})

    return {"success": True}
