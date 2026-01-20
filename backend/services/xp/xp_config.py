XP = {
    "GENERATE_CODE": 10,
    "VISUALIZE": 8,
    "BADGE_EARNED": 5,
    "LEVEL_UP_BONUS": 20,
}

def xp_needed_for_level(level: int) -> int:
    # Smooth, scalable curve
    return 100 + (level - 1) * 50
