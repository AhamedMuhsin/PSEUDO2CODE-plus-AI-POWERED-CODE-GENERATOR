
from db import db
from datetime import datetime
from uuid import uuid4
from services.badges.badge_engine import evaluate_badges
from services.xp.xp_config import XP, xp_needed_for_level
from services.activity.activity_service import add_activity


users_collection = db["users"]
MAX_ACTIVITY = 50

# ---------------- SERIALIZER ----------------
def serialize_user(user):
    return {
        "uid": user["uid"],
        "email": user["email"],
        "name": user.get("name"),
        "provider": user.get("provider"),
        "created_at": user.get("created_at"),
        "last_login": user.get("last_login"),
        "stats": user.get("stats", {
            "codes_generated": 0,
            "visualizations": 0,
            "badges": 0,
            "xp": 0,
            "level": 1,
            "xp_next_level": 100,
            "streak": 0,
        }),
        "recent_activity": user.get("recent_activity", []),
        "visualizations": user.get("visualizations", []),
        "generated_codes": user.get("generated_codes", []),
        "badges": user.get("badges", []),
    }

# ---------------- GET USER ----------------
async def get_user_by_uid(uid: str):
    return await users_collection.find_one({"uid": uid})

# ---------------- CREATE USER (FIXED) ----------------
async def create_user(uid: str, email: str, provider: str, name: str = None):
    user = {
        "uid": uid,
        "email": email,
        "provider": provider,
        "name": name,
        "created_at": datetime.utcnow(),
        "last_login": datetime.utcnow(),
        "stats": {
            "codes_generated": 0,
            "visualizations": 0,
            "badges": 0,
            "xp": 0,
            "level": 1,
            "xp_next_level": 100,
            "streak": 0,
        },
        "badges": [],
        "recent_activity": [], 
        "generated_codes": [], 
        "visualizations": [], 
    }

    await users_collection.insert_one(user)
    return user

# ---------------- UPDATE LOGIN ----------------
async def update_last_login(uid: str):
    await users_collection.update_one(
        {"uid": uid},
        {"$set": {"last_login": datetime.utcnow()}}
    )

async def save_generated_code(
    uid: str,
    pseudocode: str,
    language: str,
    level: str,
    code: str,
    explanation: str = None
):
    record = {
        "id": str(uuid4()),
        "pseudocode": pseudocode,
        "language": language,
        "level": level,
        "code": code,
        "explanation": explanation,
        "created_at": datetime.utcnow(),
    }

    await users_collection.update_one(
        {"uid": uid},
        {
            "$push": {"generated_codes": record},
            "$inc": {"stats.codes_generated": 1}
        }
    )

    await add_activity(
        uid,
        "generated_code",
        f"Generated {language} code ({level})",
        meta={
            "language": language,
            "level": level,
            "pseudocode": pseudocode,
            "code": code,
            "code_id": record["id"]
        }
    )

    user = await users_collection.find_one({"uid": uid})
    await evaluate_badges(user, uid)
    return record

# ---------------- SAVE VISUALIZATION ----------------
async def save_visualization(
    uid: str,
    language: str,
    code: str,
    viz_type: str
):
    record = {
        "id": str(uuid4()),
        "language": language,
        "code": code,
        "viz_type": viz_type,
        "created_at": datetime.utcnow(),
    }

    await users_collection.update_one(
        {"uid": uid},
        {
            "$push": {"visualizations": record},
            "$inc": {"stats.visualizations": 1}
        }
    )

    await add_activity(
        uid,
        "visualized_code",
        f"Visualized {language} code",
        meta={
            "language": language,
            "code": code,
            "viz_type": viz_type,
            "viz_id": record["id"]
        }
    )

    user = await users_collection.find_one({"uid": uid})
    await evaluate_badges(user, uid)
    return record
