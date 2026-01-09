
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from db import users_collection
from services.user_service import add_xp, award_badge
from services.gemini_service import generate_code, generate_multi_language

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

@app.get("/test-generate-code")
async def test_generate_code():
    """Test the generate_code function"""
    try:
        from services.gemini_service import generate_code
        
        pseudocode = "Input a number, multiply by 2, print result"
        result = generate_code(pseudocode, language="python", explanation=False)
        
        return {
            "success": True,
            "result": result,
            "code_length": len(result.get("code", "")) if result.get("code") else 0,
            "code_preview": result.get("code", "")[:100] if result.get("code") else "NO CODE"
        }
    except Exception as e:
        import traceback
        return {
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }


# ============ GEMINI CODE GENERATION ============

@app.post("/generate-code")
async def generate_code_endpoint(payload: dict, current_user=Depends(get_current_user)):
    pseudocode = payload.get("pseudocode", "")
    language = payload.get("language", "python")

    if not pseudocode:
        return {"success": False, "error": "Pseudocode is required"}

    result = generate_code(pseudocode, language)
    return result

@app.get("/test-gemini")
def test_gemini():
    from services.gemini_service import generate_code
    return generate_code("Print Hello World", "python")

@app.post("/generate-code-multi")
async def generate_code_multi_endpoint(payload: dict, current_user=Depends(get_current_user)):
    """Generate code in multiple languages"""
    uid = current_user["uid"]
    
    pseudocode = payload.get("pseudocode", "")
    languages = payload.get("languages", ["python", "javascript", "java"])
    
    if not pseudocode:
        raise HTTPException(status_code=400, detail="Pseudocode is required")
    
    # Generate code for all languages
    result = generate_multi_language(pseudocode, languages=languages)
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail="Code generation failed")
    
    # Save to database
    try:
        await users_collection.update_one(
            {"uid": uid},
            {
                "$push": {
                    "generated_codes": {
                        "pseudocode": pseudocode,
                        "code_by_language": result.get("generated_code"),
                        "languages": languages,
                        "created_at": __import__("datetime").datetime.utcnow()
                    }
                },
                "$inc": {
                    "stats.codes_generated": len(languages)
                }
            }
        )
        
        # Add XP
        await add_xp(uid, 10 * len(languages))
        
        # Log activity
        await add_activity(
            uid,
            "code",
            f"Generated code in {', '.join(languages)}"
        )
        
        return {
            "success": True,
            "generated_code": result.get("generated_code"),
            "xp_earned": 10 * len(languages)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}") 
    
@app.get("/list-models")
def list_models():
    from google import genai
    import os

    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    models = client.models.list()

    return [m.name for m in models]
