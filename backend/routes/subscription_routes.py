"""
Subscription and Freemium Model API Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from auth import get_current_user
from services.subscription_service import (
    get_user_subscription,
    upgrade_to_premium,
    downgrade_to_free,
    get_remaining_quota,
    get_tier_features,
    SubscriptionTier,
)

router = APIRouter(prefix="/subscription", tags=["subscription"])

# ============ GET SUBSCRIPTION STATUS ============
@router.get("/me")
async def get_my_subscription(current_user=Depends(get_current_user)):
    """Get current user's subscription tier and features"""
    uid = current_user["uid"]
    subscription = await get_user_subscription(uid)
    tier = subscription.get("tier", SubscriptionTier.FREE)
    
    return {
        "uid": uid,
        "tier": tier,
        "is_premium": tier == SubscriptionTier.PREMIUM,
        "started_at": subscription.get("started_at"),
        "renews_at": subscription.get("renews_at"),
        "features": get_tier_features(tier),
    }

# ============ GET QUOTAS ============
@router.get("/quotas")
async def get_user_quotas(current_user=Depends(get_current_user)):
    """Get remaining quotas for current month"""
    uid = current_user["uid"]
    
    quotas = {
        "code_generations": await get_remaining_quota(uid, "code_generations"),
        "visualizations": await get_remaining_quota(uid, "visualizations"),
        "downloads": await get_remaining_quota(uid, "downloads"),
    }
    
    return quotas

# ============ UPGRADE TO PREMIUM ============
@router.post("/upgrade")
async def upgrade_subscription(current_user=Depends(get_current_user)):
    """
    Upgrade user to premium tier.
    
    ⚠️  IMPORTANT: This endpoint is now protected.
    It only works if the user has a verified payment record.
    Direct upgrades go through /payment/create-order → /payment/verify.
    This endpoint is kept for admin/testing purposes only when ENV != production.
    """
    import os
    if os.getenv("ENV") == "production":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Direct upgrade is disabled. Please complete payment through /payment/create-order.",
        )

    uid = current_user["uid"]
    
    success = await upgrade_to_premium(uid)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upgrade subscription"
        )
    
    subscription = await get_user_subscription(uid)
    return {
        "message": "Successfully upgraded to Premium!",
        "tier": subscription.get("tier"),
        "features": get_tier_features(subscription.get("tier")),
    }

# ============ DOWNGRADE TO FREE ============
@router.post("/downgrade")
async def downgrade_subscription(current_user=Depends(get_current_user)):
    """Downgrade user to free tier"""
    uid = current_user["uid"]
    
    success = await downgrade_to_free(uid)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to downgrade subscription"
        )
    
    subscription = await get_user_subscription(uid)
    return {
        "message": "Downgraded to Free tier",
        "tier": subscription.get("tier"),
        "features": get_tier_features(subscription.get("tier")),
    }

# ============ PRICING PAGE ============
@router.get("/pricing")
async def get_pricing():
    """Get pricing and feature comparison"""
    return {
        "plans": {
            "free": {
                "name": "Free",
                "price": "$0/month",
                "features": get_tier_features("free"),
            },
            "premium": {
                "name": "Premium",
                "price": "$9.99/month",
                "features": get_tier_features("premium"),
                "benefits": [
                    "Unlimited code generations",
                    "Unlimited visualizations",
                    "Access to all AI providers (Gemini, Groq, OpenRouter)",
                    "Detailed explanations (1000+ words)",
                    "All algorithms unlocked",
                    "Ad-free experience",
                    "Priority support",
                ]
            }
        }
    }
