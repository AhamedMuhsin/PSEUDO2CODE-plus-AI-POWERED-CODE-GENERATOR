from datetime import date, datetime
from db import users_collection
from services.tasks.task_engine import mark_task_completed

async def update_streak(uid: str):
    user = await users_collection.find_one({"uid": uid})
    if not user:
        return

    stats = user.get("stats", {})
    today = date.today()
    last_date = stats.get("last_activity_date")

    # First activity ever
    if not last_date:
        await users_collection.update_one(
            {"uid": uid},
            {
                "$set": {"stats.last_activity_date": datetime.utcnow()},
                "$inc": {"stats.streak": 1},
            },
        )
        new_streak = 1
    else:
        last_date_only = last_date.date()

        if last_date_only == today:
            return

        if (today - last_date_only).days == 1:
            await users_collection.update_one(
                {"uid": uid},
                {
                    "$inc": {"stats.streak": 1},
                    "$set": {"stats.last_activity_date": datetime.utcnow()},
                },
            )
            new_streak = stats.get("streak", 0) + 1
        else:
            await users_collection.update_one(
                {"uid": uid},
                {
                    "$set": {
                        "stats.streak": 1,
                        "stats.last_activity_date": datetime.utcnow(),
                    }
                },
            )
            new_streak = 1

    # 🎯 Task completion hooks
    if new_streak >= 3:
        await mark_task_completed(uid, "maintain_3_day_streak")

    if new_streak >= 7:
        await mark_task_completed(uid, "maintain_7_day_streak")
