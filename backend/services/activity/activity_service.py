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

    # ✅ CHECK FOR DUPLICATE ACTIVITY (same type + code within 1 minute)
    user = await users_collection.find_one({"uid": uid})
    if user:
        recent_activities = user.get("recent_activity", [])
        if recent_activities:
            last_activity = recent_activities[0]  # Most recent is at index 0
            
            # If last activity was less than 1 minute ago with same type and code
            if (activity_type in ["visualized_code", "generated_code"] and
                last_activity.get("type") == activity_type and
                isinstance(last_activity.get("created_at"), datetime) and
                (datetime.utcnow() - last_activity.get("created_at")).total_seconds() < 60 and
                last_activity.get("meta", {}).get("code") == (meta or {}).get("code")):
                # ✅ DUPLICATE DETECTED - Skip adding duplicate activity
                return

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