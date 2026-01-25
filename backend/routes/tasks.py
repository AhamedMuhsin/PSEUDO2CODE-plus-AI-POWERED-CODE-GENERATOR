from fastapi import APIRouter, Depends
from firebase_auth import get_current_user
from services.user_service import get_user_by_uid
from services.tasks.task_resolver import resolve_suggested_tasks
from services.user_service import serialize_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("/suggested")
async def get_suggested_tasks(current_user=Depends(get_current_user)):
    user = await get_user_by_uid(current_user["uid"])
    if not user:
        return {"tasks": []}

    serialized_user = serialize_user(user)

    tasks = resolve_suggested_tasks(serialized_user)

    return {
        "tasks": [
            {
                "id": t["id"],
                "title": t["title"],
                "description": t["description"],
                "route": t["route"],
                "icon": t.get("icon"),
            }
            for t in tasks
        ]
    }
