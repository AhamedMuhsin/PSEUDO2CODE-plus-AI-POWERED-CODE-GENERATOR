from datetime import date, datetime
from db import users_collection

async def update_streak(uid: str):
    user = await users_collection.find_one({"uid": uid})
    if not user:
        return

    stats = user.get("stats", {})
    today = date.today()

    last_date = stats.get("last_activity_date")

    # First ever activity
    if not last_date:
        await users_collection.update_one(
            {"uid": uid},
            {
                "$set": {
                    "stats.last_activity_date": datetime.utcnow(),
                },
                "$inc": {"stats.streak": 1},
            },
        )
        return

    last_date_only = last_date.date()

    # Already counted today → do nothing
    if last_date_only == today:
        return

    # Yesterday → increment streak
    if (today - last_date_only).days == 1:
        await users_collection.update_one(
            {"uid": uid},
            {
                "$inc": {"stats.streak": 1},
                "$set": {"stats.last_activity_date": datetime.utcnow()},
            },
        )
        return

    # Missed day → reset streak
    await users_collection.update_one(
        {"uid": uid},
        {
            "$set": {
                "stats.streak": 1,
                "stats.last_activity_date": datetime.utcnow(),
            }
        },
    )
