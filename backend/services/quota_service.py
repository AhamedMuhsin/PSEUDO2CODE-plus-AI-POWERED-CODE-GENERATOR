"""
Quota Enforcement Middleware
Checks usage limits before allowing actions
"""

from fastapi import HTTPException, status
from services.subscription_service import can_perform_action, get_remaining_quota

class QuotaExceeded(HTTPException):
    def __init__(self, action: str, remaining: int):
        super().__init__(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "error": "quota_exceeded",
                "message": f"You have exceeded your monthly {action} quota",
                "remaining": remaining,
                "action": action,
                "upgrade_url": "/subscription/upgrade"
            }
        )

# ============ QUOTA CHECK DECORATOR ============
async def check_quota(uid: str, action_type: str) -> dict:
    """
    Check if user can perform action based on subscription tier
    Returns remaining quota info if allowed
    Raises QuotaExceeded if limit reached
    
    Usage in route:
        @app.post("/generate-code")
        async def generate_code(current_user=Depends(get_current_user)):
            quota_info = await check_quota(current_user["uid"], "code_generations")
            # ... perform action ...
            return quota_info
    """
    can_act = await can_perform_action(uid, action_type)
    quota_info = await get_remaining_quota(uid, action_type)
    
    if not can_act:
        raise QuotaExceeded(action_type, quota_info["remaining"])
    
    return quota_info

async def enforce_quota(uid: str, action_type: str) -> None:
    """
    Simple check that raises exception if quota exceeded
    """
    can_act = await can_perform_action(uid, action_type)
    if not can_act:
        quota_info = await get_remaining_quota(uid, action_type)
        raise QuotaExceeded(action_type, quota_info["remaining"])
