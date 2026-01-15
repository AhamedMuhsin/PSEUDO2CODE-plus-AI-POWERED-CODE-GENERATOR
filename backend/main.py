
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
import os
print("GROQ_API_KEY exists:", bool(os.getenv("GROQ_API_KEY")))

from services.ai.provider_manager import AIProviderManager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from db import users_collection
import re
from services.user_service import add_xp, award_badge
from services.gemini_service import generate_code, generate_multi_language
from services.visualization.visualizer_router import get_visualization
from urllib.parse import quote_plus
from services.visualization.cfg_generator import generate_mermaid_cfg

from firebase_auth import get_current_user
from services.user_service import (
    get_user_by_uid,
    create_user,
    update_last_login,
    serialize_user,
    save_generated_code,
    save_visualization, 
    add_activity,
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
ai_manager = AIProviderManager()

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
        "user": {
            "name": user.get("name"),
            "email": user.get("email"),
        },
        "stats": user.get("stats", {}),
        "recent_activity": user.get("recent_activity", [])
    }

@app.post("/visualize")
async def visualize(payload: dict, current_user=Depends(get_current_user)):
    language = payload.get("language")
    code = payload.get("code")
    algorithm = payload.get("algorithm") or payload.get("pseudocode")

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

    # XP + Activity
    await add_xp(uid, 10 * len(languages))
    await add_activity(
        uid,
        "code",
        f"Generated {', '.join(languages)} code ({level})"
    )

    return {
        "success": True,
        "generated_code": generated_code,
        "languages": languages,
        "level": level
    }

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
