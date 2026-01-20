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
