"""
Payment Routes — Razorpay Integration
Handles order creation, verification, and webhooks.
"""

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, Field
from typing import Optional
from auth import get_current_user
from services.payment.razorpay_service import (
    create_razorpay_order,
    verify_razorpay_payment,
    verify_webhook_signature,
    handle_payment_webhook,
    PLANS,
    RAZORPAY_KEY_ID,
)
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/payment", tags=["payment"])


# ==================== REQUEST MODELS ====================
class CreateOrderRequest(BaseModel):
    plan_id: str = Field(..., pattern=r"^premium_(monthly|yearly|student)$")
    promo_code: Optional[str] = Field(None, max_length=20)


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str = Field(..., min_length=10, max_length=50)
    razorpay_payment_id: str = Field(..., min_length=10, max_length=50)
    razorpay_signature: str = Field(..., min_length=32, max_length=128)


# ==================== ENDPOINTS ====================

@router.get("/plans")
async def get_plans():
    """Return available plans (public endpoint)."""
    return {
        "key_id": RAZORPAY_KEY_ID,  # Frontend needs this for Razorpay checkout
        "plans": {
            pid: {
                "name": p["name"],
                "amount": p["amount"],
                "currency": p["currency"],
                "description": p["description"],
                "price_display": f"₹{p['amount'] // 100}",
            }
            for pid, p in PLANS.items()
        },
    }


@router.post("/create-order")
@limiter.limit("5/minute")
async def create_order(
    request: Request,
    payload: CreateOrderRequest,
    current_user=Depends(get_current_user),
):
    """Create a Razorpay order for the authenticated user."""
    uid = current_user["uid"]
    order = await create_razorpay_order(uid, payload.plan_id, payload.promo_code)
    return order


@router.post("/verify")
@limiter.limit("5/minute")
async def verify_payment(
    request: Request,
    payload: VerifyPaymentRequest,
    current_user=Depends(get_current_user),
):
    """Verify a Razorpay payment after checkout. Activates Premium on success."""
    uid = current_user["uid"]
    result = await verify_razorpay_payment(
        uid=uid,
        razorpay_order_id=payload.razorpay_order_id,
        razorpay_payment_id=payload.razorpay_payment_id,
        razorpay_signature=payload.razorpay_signature,
    )
    return result


@router.post("/webhook")
async def razorpay_webhook(request: Request):
    """
    Razorpay server-to-server webhook. No auth — verified by HMAC signature.
    Configure in Razorpay Dashboard → Settings → Webhooks.
    """
    signature = request.headers.get("X-Razorpay-Signature", "")
    body = await request.body()

    if not signature or not verify_webhook_signature(body, signature):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid webhook signature",
        )

    data = await request.json()
    event = data.get("event", "")
    payload = data.get("payload", {})

    result = await handle_payment_webhook(event, payload)
    return result
