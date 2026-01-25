import random
from services.tasks.task_definitions import get_task_definitions
from services.tasks.task_engine import is_task_completed


def resolve_suggested_tasks(user: dict, limit: int = 4):
    tasks = get_task_definitions()
    completed_ids = {
        t["task_id"] for t in user.get("user_tasks", {}).get("completed", [])
    }

    eligible = []

    for task in tasks:
        if task.get("once") and task["id"] in completed_ids:
            continue

        if not task["condition"](user):
            continue

        eligible.append(task)

    # 🔥 sort safely
    eligible.sort(key=lambda t: t.get("priority", 0), reverse=True)

    # 🔄 rotate top candidates
    top = eligible[:6]
    random.shuffle(top)
    eligible[:6] = top

    return eligible[:limit]
