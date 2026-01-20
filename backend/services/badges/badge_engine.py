from services.badges.badge_definitions import BADGES
from services.badges.badge_actions import execute_badge_award


async def evaluate_badges(user: dict, uid: str):
    if not user:
        return

    stats = user.get("stats", {})
    earned_ids = {b["id"] for b in user.get("badges", [])}

    for badge_id, badge in BADGES.items():
        if badge_id in earned_ids:
            continue

        stat_type = badge.get("type")
        required_value = badge.get("value")

        current_value = stats.get(stat_type)
        if current_value is None:
            continue

        if current_value >= required_value:
            await execute_badge_award(
                uid=uid,
                badge={
                    "id": badge_id,
                    "title": badge["title"],
                    "description": badge.get("description"),
                    "icon": badge["icon"],
                }
            )
            break  # one badge per evaluation
