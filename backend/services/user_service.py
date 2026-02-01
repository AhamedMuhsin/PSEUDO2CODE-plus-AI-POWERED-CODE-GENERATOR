from db import db
from uuid import uuid4
from services.streak.streak_service import update_streak
from services.badges.badge_engine import evaluate_badges
from services.xp.xp_config import XP, xp_needed_for_level
from services.activity.activity_service import add_activity
from datetime import date, datetime
from services.tasks.task_engine import mark_task_completed

users_collection = db["users"]
MAX_ACTIVITY = 50

# ---------------- SERIALIZER ----------------

def serialize_user(user):
    stats = {
    **user.get("stats", {}),
    "badges": len(user.get("badges", [])),  # 🔥 normalize
}


    last_date = stats.get("last_activity_date")
    active_today = False

    if isinstance(last_date, datetime):
        active_today = last_date.date() == date.today()

    return {
        "uid": user["uid"],
        "email": user["email"],
        "name": user.get("name"),
        "avatar": user.get("avatar"),
        "provider": user.get("provider"),
        "created_at": user.get("created_at"),
        "last_login": user.get("last_login"),
        "stats": {
            **stats,
            "streak_active_today": active_today,
        },
        "user_tasks": user.get("user_tasks", {
            "completed": [],
            "last_suggested": []
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
        "avatar": None,
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
            "last_activity_date": None, 
        },
        "user_tasks": {
            "completed": [],
            "last_suggested": []
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
    await mark_task_completed(uid, "first_code")

    user = await users_collection.find_one({"uid": uid})

    if user["stats"]["codes_generated"] >= 5:
        await mark_task_completed(uid, "generate_5_codes")

    await update_streak(uid)
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
    """Save visualization record and update user stats (single atomic operation with deduplication)"""
    # ✅ CHECK FOR DUPLICATE VISUALIZATION (same code + language within 1 minute)
    user = await users_collection.find_one({"uid": uid})
    if user:
        recent_viz = user.get("visualizations", [])
        if recent_viz:
            last_viz = recent_viz[-1]  # Get most recent visualization
            last_time = last_viz.get("created_at")
            
            # If last visualization was less than 1 minute ago with same code and language
            if (isinstance(last_time, datetime) and 
                (datetime.utcnow() - last_time).total_seconds() < 60 and
                last_viz.get("code") == code and 
                last_viz.get("language") == language):
                # ✅ DUPLICATE DETECTED - Don't save again, just return existing record
                return last_viz
    
    record = {
        "id": str(uuid4()),
        "language": language,
        "code": code,
        "viz_type": viz_type,
        "created_at": datetime.utcnow(),
    }

    # ✅ ATOMIC UPDATE: Save visualization + increment counter (only if not duplicate)
    result = await users_collection.update_one(
        {"uid": uid},
        {
            "$push": {"visualizations": record},
            "$inc": {"stats.visualizations": 1}
        }
    )
    
    # Ensure update was successful
    if result.modified_count == 0:
        raise Exception(f"Failed to save visualization for user {uid}")

    # ✅ ADD ACTIVITY SEPARATELY (no duplicate stats)
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
    
    # ✅ MARK TASKS
    await mark_task_completed(uid, "first_visualization")

    # ✅ CHECK FOR BADGE CONDITIONS
    user = await users_collection.find_one({"uid": uid})
    if user and user.get("stats", {}).get("visualizations", 0) >= 5:
        await mark_task_completed(uid, "visualize_5_algorithms")

    # ✅ UPDATE STREAK
    await update_streak(uid)
    
    # ✅ EVALUATE BADGES
    user = await users_collection.find_one({"uid": uid})
    if user:
        await evaluate_badges(user, uid)
    
    return record
