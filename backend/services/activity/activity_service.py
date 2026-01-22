from datetime import datetime
from db import users_collection

MAX_ACTIVITY = 50


async def add_activity(uid: str, activity_type: str, title: str, meta=None):
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
                    "$position": 0,
                    "$slice": MAX_ACTIVITY,
                }
            }
        }
    )

async def delete_activity(uid: str, activity: dict):
    activity_type = activity["type"]

    # 🔻 decrement stats mapping
    stat_map = {
        "generated_code": "stats.codes_generated",
        "visualized_code": "stats.visualizations",
    }

    update = {
        "$pull": {
            "recent_activity": {
                "created_at": datetime.fromisoformat(activity["created_at"])
            }
        }
    }

    if activity_type in stat_map:
        update["$inc"] = {
            stat_map[activity_type]: -1
        }

    await users_collection.update_one(
        {"uid": uid},
        update
    )