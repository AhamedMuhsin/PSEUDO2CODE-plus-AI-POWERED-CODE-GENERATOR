from datetime import date

def get_user_state(user: dict) -> dict:
    stats = user.get("stats", {})

    codes = stats.get("codes_generated", 0)
    visualizations = stats.get("visualizations", 0)
    badges = stats.get("badges", 0)
    xp = stats.get("xp", 0)
    xp_next = stats.get("xp_next_level", 1)
    streak = stats.get("streak", 0)
    streak_active_today = stats.get("streak_active_today", False)

    return {
        # 🟢 ONBOARDING
        "is_new_user": codes == 0 and visualizations == 0,
        "has_generated_code": codes > 0,
        "has_visualized": visualizations > 0,
        "has_badge": badges > 0,

        # 🔥 STREAK
        "streak_days": streak,
        "streak_active_today": streak_active_today,
        "needs_streak_save": not streak_active_today,

        # 📈 PROGRESSION
        "is_leveling_up": xp < xp_next,
        "is_progressing": codes >= 1 or visualizations >= 1,

        # 🧭 EXPLORATION
        "is_exploring": codes >= 5 and visualizations >= 5,
    }
