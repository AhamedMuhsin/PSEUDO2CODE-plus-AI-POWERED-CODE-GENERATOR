from db import db
from datetime import datetime

users_collection = db["users"]

def serialize_user(user):
    user["_id"] = str(user["_id"])
    return user

async def get_user_by_uid(uid: str):
    return await users_collection.find_one({"uid": uid})

async def create_user(uid: str, email: str, provider: str, name: str = None):
    user = {
        "uid": uid,
        "email": email,
        "provider": provider,
        "name": name,
        "created_at": datetime.utcnow(),
        "last_login": datetime.utcnow(),
    }

    await users_collection.insert_one(user)
    return serialize_user(user)

async def update_last_login(uid: str):
    await users_collection.update_one(
        {"uid": uid},
        {"$set": {"last_login": datetime.utcnow()}}
    )
