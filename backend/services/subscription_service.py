"""
Subscription & Freemium Model Service
Manages user subscription tiers and usage quotas
"""

from db import db
from datetime import datetime, timedelta
from enum import Enum

subscriptions_collection = db["subscriptions"]
usage_collection = db["usage_logs"]

class SubscriptionTier(str, Enum):
    FREE = "free"
    PREMIUM = "premium"

# ============ QUOTA LIMITS PER TIER ============
QUOTA_LIMITS = {
    "free": {
        "monthly_code_generations": 20,
        "monthly_visualizations": 10,
        "monthly_downloads": 5,
        "ai_providers": ["groq"],  # Only Groq for free
        "explanation_max_length": 200,
        "algorithms_access": "basic",  # Refer to basic algorithms only
    },
    "premium": {
        "monthly_code_generations": None,  # Unlimited
        "monthly_visualizations": None,
        "monthly_downloads": None,
        "ai_providers": ["gemini", "groq", "openrouter"],  # All providers
        "explanation_max_length": 1000,
        "algorithms_access": "all",
    }
}

# ============ CREATE/GET SUBSCRIPTION ============
async def get_user_subscription(uid: str):
    """Get user's subscription tier"""
    sub = await subscriptions_collection.find_one({"uid": uid})
    if not sub:
        # Create default FREE tier subscription
        return await create_subscription(uid, SubscriptionTier.FREE)
    return sub

async def create_subscription(uid: str, tier: str = SubscriptionTier.FREE):
    """Create new subscription for user"""
    subscription = {
        "uid": uid,
        "tier": tier,
        "started_at": datetime.utcnow(),
        "renews_at": datetime.utcnow() + timedelta(days=30),
        "is_active": True,
    }
    await subscriptions_collection.insert_one(subscription)
    return subscription

async def upgrade_to_premium(uid: str):
    """Upgrade user to premium tier"""
    result = await subscriptions_collection.update_one(
        {"uid": uid},
        {
            "$set": {
                "tier": SubscriptionTier.PREMIUM,
                "renews_at": datetime.utcnow() + timedelta(days=30),
            }
        },
        upsert=True
    )
    return result.modified_count > 0

async def downgrade_to_free(uid: str):
    """Downgrade user to free tier"""
    result = await subscriptions_collection.update_one(
        {"uid": uid},
        {
            "$set": {
                "tier": SubscriptionTier.FREE,
                "renews_at": datetime.utcnow() + timedelta(days=30),
            }
        }
    )
    return result.modified_count > 0

# ============ USAGE TRACKING ============
async def log_usage(uid: str, action_type: str, metadata: dict = None):
    """Log user action for quota tracking"""
    usage_record = {
        "uid": uid,
        "action_type": action_type,  # code_generation, visualization, download
        "timestamp": datetime.utcnow(),
        "metadata": metadata or {},
    }
    await usage_collection.insert_one(usage_record)
    return usage_record

async def get_usage_this_month(uid: str, action_type: str) -> int:
    """Count usage for current month"""
    now = datetime.utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    count = await usage_collection.count_documents({
        "uid": uid,
        "action_type": action_type,
        "timestamp": {"$gte": month_start}
    })
    return count

async def can_perform_action(uid: str, action_type: str) -> bool:
    """Check if user can perform action based on quota"""
    subscription = await get_user_subscription(uid)
    tier = subscription.get("tier", SubscriptionTier.FREE)
    limits = QUOTA_LIMITS[tier]
    
    # Check if action has a limit
    limit_key = f"monthly_{action_type}"
    if limit_key not in limits:
        return True  # No limit for this action
    
    limit = limits[limit_key]
    if limit is None:  # Unlimited
        return True
    
    usage_count = await get_usage_this_month(uid, action_type)
    return usage_count < limit

async def get_remaining_quota(uid: str, action_type: str) -> dict:
    """Get remaining quota for user"""
    subscription = await get_user_subscription(uid)
    tier = subscription.get("tier", SubscriptionTier.FREE)
    limits = QUOTA_LIMITS[tier]
    
    limit_key = f"monthly_{action_type}"
    limit = limits.get(limit_key)
    
    if limit is None:
        return {
            "action": action_type,
            "limit": None,
            "used": None,
            "remaining": None,
            "unlimited": True,
        }
    
    used = await get_usage_this_month(uid, action_type)
    return {
        "action": action_type,
        "limit": limit,
        "used": used,
        "remaining": max(0, limit - used),
        "unlimited": False,
    }

# ============ GET TIER FEATURES ============
def get_tier_features(tier: str) -> dict:
    """Get all features available for a subscription tier"""
    return QUOTA_LIMITS.get(tier, QUOTA_LIMITS["free"])

def get_available_providers(uid_or_tier) -> list:
    """Get available AI providers for user tier"""
    if isinstance(uid_or_tier, str) and not uid_or_tier.startswith(("free", "premium")):
        # It's a uid, fetch subscription
        import asyncio
        sub = asyncio.run(get_user_subscription(uid_or_tier))
        tier = sub.get("tier", "free")
    else:
        tier = uid_or_tier
    
    return QUOTA_LIMITS[tier]["ai_providers"]
