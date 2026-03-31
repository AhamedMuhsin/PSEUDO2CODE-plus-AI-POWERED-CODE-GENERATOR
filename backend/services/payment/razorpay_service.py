"""
Razorpay Payment Service
Handles order creation, payment verification, and webhook processing.
All payments are in INR (₹).
"""

import os
import hmac
import hashlib
import razorpay
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from db import db

payments_collection = db["payments"]

# ==================== CONFIG ====================
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")

# Initialise client (lazy — only when keys exist)
_client = None


def _get_client():
    global _client
    if _client is None:
        if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Payment service is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
            )
        _client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    return _client


# ==================== PLAN DEFINITIONS (INR) ====================
PLANS = {
    "premium_monthly": {
        "name": "Premium Monthly",
        "amount": 9900,  # ₹99 in paise
        "currency": "INR",
        "duration_days": 30,
        "description": "Pseudo2Code+ Premium — 1 Month",
    },
    "premium_yearly": {
        "name": "Premium Yearly",
        "amount": 99900,  # ₹999 in paise
        "currency": "INR",
        "duration_days": 365,
        "description": "Pseudo2Code+ Premium — 1 Year",
    },
    "premium_student": {
        "name": "Premium Student (3 months)",
        "amount": 14700,  # ₹49 × 3 = ₹147 in paise
        "currency": "INR",
        "duration_days": 90,
        "description": "Pseudo2Code+ Premium — Student (3 Months)",
    },
}


# ==================== CREATE ORDER ====================
async def create_razorpay_order(uid: str, plan_id: str, promo_code: str = None) -> dict:
    """
    Create a Razorpay order and persist it in the DB.
    Returns the order details needed by the frontend checkout.
    """
    if plan_id not in PLANS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid plan: {plan_id}. Valid plans: {', '.join(PLANS.keys())}",
        )

    plan = PLANS[plan_id]
    amount = plan["amount"]

    # Apply promo code
    if promo_code and promo_code.upper() == "STUDENT50" and plan_id == "premium_monthly":
        amount = 4900  # ₹49 in paise

    client = _get_client()

    order_data = {
        "amount": amount,
        "currency": plan["currency"],
        "receipt": f"rcpt_{uid[:12]}_{int(datetime.utcnow().timestamp())}",
        "notes": {
            "uid": uid,
            "plan_id": plan_id,
            "promo_code": promo_code or "",
        },
    }

    try:
        order = client.order.create(data=order_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Razorpay order creation failed: {str(e)}",
        )

    # Persist in payments collection
    payment_record = {
        "uid": uid,
        "razorpay_order_id": order["id"],
        "plan_id": plan_id,
        "amount": amount,
        "currency": plan["currency"],
        "promo_code": promo_code,
        "status": "created",
        "created_at": datetime.utcnow(),
    }
    await payments_collection.insert_one(payment_record)

    return {
        "order_id": order["id"],
        "amount": amount,
        "currency": plan["currency"],
        "key_id": RAZORPAY_KEY_ID,
        "plan": plan["name"],
        "description": plan["description"],
    }


# ==================== VERIFY PAYMENT ====================
async def verify_razorpay_payment(
    uid: str,
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
) -> dict:
    """
    Verify the Razorpay payment signature (server-side).
    If valid, activate the Premium subscription.
    """
    # 1. Verify the payment record belongs to this user
    payment = await payments_collection.find_one({
        "razorpay_order_id": razorpay_order_id,
        "uid": uid,
    })
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment record not found for this user.",
        )

    if payment.get("status") == "paid":
        return {"already_paid": True, "message": "This payment was already verified."}

    # 2. Verify signature using HMAC-SHA256
    message = f"{razorpay_order_id}|{razorpay_payment_id}"
    expected_signature = hmac.new(
        RAZORPAY_KEY_SECRET.encode("utf-8"),
        message.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected_signature, razorpay_signature):
        # Mark as failed
        await payments_collection.update_one(
            {"razorpay_order_id": razorpay_order_id},
            {"$set": {"status": "signature_failed", "updated_at": datetime.utcnow()}},
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment verification failed: invalid signature.",
        )

    # 3. Mark payment as successful
    plan_id = payment.get("plan_id", "premium_monthly")
    plan = PLANS.get(plan_id, PLANS["premium_monthly"])

    await payments_collection.update_one(
        {"razorpay_order_id": razorpay_order_id},
        {
            "$set": {
                "status": "paid",
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
                "updated_at": datetime.utcnow(),
            }
        },
    )

    # 4. Activate Premium subscription
    from services.subscription_service import subscriptions_collection, SubscriptionTier

    await subscriptions_collection.update_one(
        {"uid": uid},
        {
            "$set": {
                "tier": SubscriptionTier.PREMIUM,
                "started_at": datetime.utcnow(),
                "renews_at": datetime.utcnow() + timedelta(days=plan["duration_days"]),
                "is_active": True,
                "payment_id": razorpay_payment_id,
                "plan_id": plan_id,
            }
        },
        upsert=True,
    )

    return {
        "success": True,
        "message": "Payment verified. Premium activated!",
        "plan": plan["name"],
        "renews_at": (datetime.utcnow() + timedelta(days=plan["duration_days"])).isoformat(),
    }


# ==================== WEBHOOK HANDLER ====================
def verify_webhook_signature(body: bytes, signature: str) -> bool:
    """Verify Razorpay webhook signature (X-Razorpay-Signature header)."""
    webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET", RAZORPAY_KEY_SECRET)
    expected = hmac.new(
        webhook_secret.encode("utf-8"),
        body,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


async def handle_payment_webhook(event: str, payload: dict) -> dict:
    """
    Process Razorpay webhook events.
    Only handles payment.captured and payment.failed for now.
    """
    payment_entity = payload.get("payment", {}).get("entity", {})
    order_id = payment_entity.get("order_id")
    payment_id = payment_entity.get("id")

    if not order_id:
        return {"status": "ignored", "reason": "no order_id"}

    payment_record = await payments_collection.find_one({"razorpay_order_id": order_id})
    if not payment_record:
        return {"status": "ignored", "reason": "unknown order"}

    if event == "payment.captured":
        # Double-check and activate if not already paid
        if payment_record.get("status") != "paid":
            uid = payment_record["uid"]
            plan_id = payment_record.get("plan_id", "premium_monthly")
            plan = PLANS.get(plan_id, PLANS["premium_monthly"])

            await payments_collection.update_one(
                {"razorpay_order_id": order_id},
                {
                    "$set": {
                        "status": "paid",
                        "razorpay_payment_id": payment_id,
                        "updated_at": datetime.utcnow(),
                        "webhook_verified": True,
                    }
                },
            )

            from services.subscription_service import subscriptions_collection, SubscriptionTier

            await subscriptions_collection.update_one(
                {"uid": uid},
                {
                    "$set": {
                        "tier": SubscriptionTier.PREMIUM,
                        "started_at": datetime.utcnow(),
                        "renews_at": datetime.utcnow() + timedelta(days=plan["duration_days"]),
                        "is_active": True,
                        "payment_id": payment_id,
                        "plan_id": plan_id,
                    }
                },
                upsert=True,
            )

        return {"status": "captured"}

    elif event == "payment.failed":
        await payments_collection.update_one(
            {"razorpay_order_id": order_id},
            {
                "$set": {
                    "status": "failed",
                    "razorpay_payment_id": payment_id,
                    "updated_at": datetime.utcnow(),
                    "failure_reason": payment_entity.get("error_description", ""),
                }
            },
        )
        return {"status": "failed"}

    return {"status": "ignored", "reason": f"unhandled event: {event}"}
