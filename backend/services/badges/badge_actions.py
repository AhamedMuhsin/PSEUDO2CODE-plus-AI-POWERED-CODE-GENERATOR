from datetime import datetime
from db import users_collection
from services.activity.activity_service import add_activity
from services.tasks.task_engine import mark_task_completed

async def execute_badge_award(uid: str, badge: dict):
    badge_record = {
        "id": badge["id"],
        "title": badge["title"],
        "description": badge.get("description"),
        "icon": badge["icon"],
        "earned_at": datetime.utcnow(),
    }

    await users_collection.update_one(
        {"uid": uid},
        {
            "$push": {"badges": badge_record},
            "$inc": {"stats.badges": 1},
        }
    )

    await add_activity(
        uid,
        "badge_earned",
        f'Earned badge "{badge["title"]}"',
        meta={
            "badge_id": badge["id"],
            "icon": badge["icon"],
        },
    )

    await mark_task_completed(uid, "first_badge")