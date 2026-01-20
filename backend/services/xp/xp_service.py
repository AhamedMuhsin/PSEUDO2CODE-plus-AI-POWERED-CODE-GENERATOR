from db import users_collection
from services.xp.xp_config import XP, xp_needed_for_level
from services.badges.badge_engine import evaluate_badges
from services.activity.activity_service import add_activity


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
        needed = xp_needed_for_level(level)
        if new_xp >= needed:
            new_xp -= needed
            level += 1
            leveled_up = True
            new_xp += XP["LEVEL_UP_BONUS"]
        else:
            break

    await users_collection.update_one(
        {"uid": uid},
        {
            "$set": {
                "stats.xp": new_xp,
                "stats.level": level,
                "stats.xp_next_level": xp_needed_for_level(level),
            }
        }
    )

    if leveled_up:
        await add_activity(
            uid,
            "level_up",
            f"Reached Level {level}",
            meta={"from_level": old_level, "to_level": level},
        )

    # evaluate badges AFTER XP update
    user = await users_collection.find_one({"uid": uid})
    await evaluate_badges(user, uid)
