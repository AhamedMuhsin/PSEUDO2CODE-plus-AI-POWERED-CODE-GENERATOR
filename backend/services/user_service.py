
from db import db
from datetime import datetime

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

async def add_activity(
    uid: str,
    activity_type: str,
    title: str,
    meta: dict | None = None
):
    activity = {
        "type": activity_type,
        "title": title,
        "meta": meta or {},
        "created_at": datetime.utcnow(),
    }

    await users_collection.update_one(
        {"uid": uid},
        {
            "$push": {
                "recent_activity": {
                    "$each": [activity],
                    "$position": 0,   # newest first
                    "$slice": MAX_ACTIVITY
                }
            }
        }
    )

async def add_xp(uid: str, xp_to_add: int):
    user = await users_collection.find_one({"uid": uid})
    if not user:
        return

    stats = user.get("stats", {})
    current_xp = stats.get("xp", 0)
    level = stats.get("level", 1)
    old_level = level

    new_xp = current_xp + xp_to_add
    leveled_up = False

    while True:
        xp_needed = level * 100
        if new_xp >= xp_needed:
            new_xp -= xp_needed
            level += 1
            leveled_up = True
        else:
            break

    await users_collection.update_one(
        {"uid": uid},
        {
            "$set": {
                "stats.xp": new_xp,
                "stats.level": level,
                "stats.xp_next_level": level * 100,
            }
        }
    )

    # 🔥 ADD THIS BLOCK
    if leveled_up:
        await add_activity(
            uid,
            "level_up",
            f"Reached Level {level}",
            meta={
                "from_level": old_level,
                "to_level": level
            }
        )

    return {
        "leveled_up": leveled_up,
        "level": level,
        "xp": new_xp,
    }


async def award_badge(uid: str, badge_id: str, title: str, icon: str):
    user = await users_collection.find_one({"uid": uid})

    # Prevent duplicate badges
    existing = user.get("badges", [])
    if any(b["id"] == badge_id for b in existing):
        return False

    badge = {
        "id": badge_id,
        "title": title,
        "icon": icon,
        "earned_at": datetime.utcnow(),
    }

    await users_collection.update_one(
        {"uid": uid},
        {
            "$push": {"badges": badge},
            "$inc": {"stats.badges": 1}
        }
    )

    # Log activity
    await add_activity(
        uid,
        "badge_earned",
        f'Earned badge "{title}"',
        meta={
            "badge_id": badge_id,
            "icon": icon
        }
    )


    return True

async def save_generated_code(
    uid: str,
    pseudocode: str,
    language: str,
    level: str,
    code: str,
    explanation: str = None
):
    record = {
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
            "level": level
        }
    )


    return record

# ---------------- SAVE VISUALIZATION ----------------
async def save_visualization(
    uid: str,
    language: str,
    code: str,
    viz_type: str
):
    record = {
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
            "viz_type": viz_type
        }
    )

    return record
