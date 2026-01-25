from datetime import datetime
from db import users_collection

def is_task_completed(user: dict, task_id: str) -> bool:
    completed = user.get("user_tasks", {}).get("completed", [])
    return any(t["task_id"] == task_id for t in completed)

async def mark_task_completed(uid: str, task_id: str, meta: dict | None = None):
    entry = {
        "task_id": task_id,
        "completed_at": datetime.utcnow(),
        "meta": meta or {}
    }

    await users_collection.update_one(
        {
            "uid": uid,
            "user_tasks.completed.task_id": {"$ne": task_id}
        },
        {
            "$push": {
                "user_tasks.completed": entry
            }
        }
    )
