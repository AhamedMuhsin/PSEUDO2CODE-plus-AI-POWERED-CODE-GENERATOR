"""
Auth Routes - Email/Password + Google/GitHub OAuth
"""

from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime
import re

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    exchange_google_code,
    exchange_github_code,
    GOOGLE_CLIENT_ID,
    GITHUB_CLIENT_ID,
    FRONTEND_URL,
)
from db import users_collection
from services.user_service import create_user, get_user_by_uid, update_last_login, serialize_user

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/auth", tags=["auth"])

# ==================== REQUEST MODELS ====================
class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    name: str = Field(..., min_length=1, max_length=100)

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters.")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number.")
        return v

    @field_validator("name")
    @classmethod
    def sanitize_name(cls, v):
        # Strip HTML tags and limit length
        clean = re.sub(r"<[^>]+>", "", v).strip()
        if not clean:
            raise ValueError("Name cannot be empty.")
        return clean[:100]

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., max_length=128)

class OAuthCodeRequest(BaseModel):
    code: str = Field(..., min_length=10, max_length=500)
    redirect_uri: Optional[str] = Field(None, max_length=200)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# ==================== HELPER ====================
def _generate_uid(provider: str, identifier: str) -> str:
    """Generate a consistent uid for a user"""
    import hashlib
    return hashlib.sha256(f"{provider}:{identifier}".encode()).hexdigest()[:28]

async def _find_user_by_email(email: str):
    return await users_collection.find_one({"email": email})

async def _oauth_login_or_signup(user_info: dict) -> dict:
    """Handle OAuth login/signup flow — returns JWT token + user data"""
    email = user_info["email"]
    provider = user_info["provider"]
    name = user_info.get("name", "")
    avatar = user_info.get("avatar", "")
    
    # Check if user exists by email
    existing = await _find_user_by_email(email)
    
    if existing:
        # User exists — update last login and provider info
        update_data = {"last_login": datetime.utcnow()}
        
        # Update avatar from OAuth if user doesn't have one
        if not existing.get("avatar") and avatar:
            update_data["avatar"] = avatar
        
        # Track linked providers
        current_provider = existing.get("provider", "")
        if provider not in current_provider:
            if current_provider:
                update_data["provider"] = f"{current_provider}+{provider}"
            else:
                update_data["provider"] = provider
        
        await users_collection.update_one(
            {"uid": existing["uid"]},
            {"$set": update_data}
        )
        
        uid = existing["uid"]
        user = await get_user_by_uid(uid)
    else:
        # New user — create account
        uid = _generate_uid(provider, email)
        user = await create_user(
            uid=uid,
            email=email,
            provider=provider,
            name=name or email.split("@")[0],
        )
        
        # Set avatar if available
        if avatar:
            await users_collection.update_one(
                {"uid": uid},
                {"$set": {"avatar": avatar}}
            )
            user["avatar"] = avatar
    
    # Generate JWT
    token = create_access_token({"uid": uid, "email": email})
    
    return {
        "token": token,
        "user": serialize_user(user),
    }

# ==================== EMAIL/PASSWORD ROUTES ====================

@router.post("/signup")
@limiter.limit("5/minute")
async def signup(request: Request, payload: SignupRequest):
    """Register a new user with email and password"""
    
    # Check if email already exists
    existing = await _find_user_by_email(payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists."
        )
    
    # Create user
    uid = _generate_uid("password", payload.email)
    hashed = hash_password(payload.password)
    
    user = await create_user(
        uid=uid,
        email=payload.email,
        provider="password",
        name=payload.name.strip(),
    )
    
    # Store hashed password
    await users_collection.update_one(
        {"uid": uid},
        {"$set": {"password_hash": hashed}}
    )
    
    # Generate JWT
    token = create_access_token({"uid": uid, "email": payload.email})
    
    return {
        "token": token,
        "user": serialize_user(user),
    }

@router.post("/login")
@limiter.limit("10/minute")
async def login(request: Request, payload: LoginRequest):
    """Login with email and password"""
    
    user = await _find_user_by_email(payload.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email or password is incorrect."
        )
    
    # Check if user has password (might be OAuth-only)
    password_hash = user.get("password_hash")
    if not password_hash:
        provider = user.get("provider", "social")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"This account uses {provider} sign-in. Please use that method."
        )
    
    # Verify password
    if not verify_password(payload.password, password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email or password is incorrect."
        )
    
    # Update last login
    await update_last_login(user["uid"])
    
    # Generate JWT
    token = create_access_token({"uid": user["uid"], "email": user["email"]})
    
    return {
        "token": token,
        "user": serialize_user(user),
    }

# ==================== GOOGLE OAUTH ====================

@router.get("/google/url")
async def google_auth_url(redirect_uri: Optional[str] = None):
    """Return Google OAuth URL for frontend redirect"""
    import secrets
    state = secrets.token_urlsafe(32)
    callback_uri = redirect_uri or f"{FRONTEND_URL}/auth/callback/google"
    url = (
        f"https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={callback_uri}"
        f"&response_type=code"
        f"&scope=openid email profile"
        f"&access_type=offline"
        f"&prompt=select_account"
        f"&state={state}"
    )
    return {"url": url, "state": state}

@router.post("/google/callback")
@limiter.limit("10/minute")
async def google_callback(request: Request, payload: OAuthCodeRequest):
    """Exchange Google auth code for JWT token"""
    redirect_uri = payload.redirect_uri or f"{FRONTEND_URL}/auth/callback/google"
    user_info = await exchange_google_code(payload.code, redirect_uri)
    return await _oauth_login_or_signup(user_info)

# ==================== GITHUB OAUTH ====================

@router.get("/github/url")
async def github_auth_url(redirect_uri: Optional[str] = None):
    """Return GitHub OAuth URL for frontend redirect"""
    import secrets
    state = secrets.token_urlsafe(32)
    callback_uri = redirect_uri or f"{FRONTEND_URL}/auth/callback/github"
    url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        f"&redirect_uri={callback_uri}"
        f"&scope=user:email"
        f"&state={state}"
    )
    return {"url": url, "state": state}

@router.post("/github/callback")
@limiter.limit("10/minute")
async def github_callback(request: Request, payload: OAuthCodeRequest):
    """Exchange GitHub auth code for JWT token"""
    redirect_uri = payload.redirect_uri or f"{FRONTEND_URL}/auth/callback/github"
    user_info = await exchange_github_code(payload.code, redirect_uri)
    return await _oauth_login_or_signup(user_info)

# ==================== PASSWORD MANAGEMENT ====================

@router.post("/forgot-password")
@limiter.limit("3/minute")
async def forgot_password(request: Request, payload: ForgotPasswordRequest):
    """
    For now, just verify the email exists.
    In production, send a reset email with a token.
    """
    user = await _find_user_by_email(payload.email)
    
    # Always return success to prevent email enumeration
    return {
        "success": True,
        "message": "If an account exists with this email, you will receive a password reset link."
    }
