"""
Auth Routes - Email/Password + Google/GitHub OAuth
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

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

router = APIRouter(prefix="/auth", tags=["auth"])

# ==================== REQUEST MODELS ====================
class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class OAuthCodeRequest(BaseModel):
    code: str
    redirect_uri: Optional[str] = None

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
async def signup(payload: SignupRequest):
    """Register a new user with email and password"""
    
    # Check if email already exists
    existing = await _find_user_by_email(payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists."
        )
    
    # Validate password
    if len(payload.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters."
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
async def login(payload: LoginRequest):
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
    callback_uri = redirect_uri or f"{FRONTEND_URL}/auth/callback/google"
    url = (
        f"https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={callback_uri}"
        f"&response_type=code"
        f"&scope=openid email profile"
        f"&access_type=offline"
        f"&prompt=select_account"
    )
    return {"url": url}

@router.post("/google/callback")
async def google_callback(payload: OAuthCodeRequest):
    """Exchange Google auth code for JWT token"""
    redirect_uri = payload.redirect_uri or f"{FRONTEND_URL}/auth/callback/google"
    user_info = await exchange_google_code(payload.code, redirect_uri)
    return await _oauth_login_or_signup(user_info)

# ==================== GITHUB OAUTH ====================

@router.get("/github/url")
async def github_auth_url(redirect_uri: Optional[str] = None):
    """Return GitHub OAuth URL for frontend redirect"""
    callback_uri = redirect_uri or f"{FRONTEND_URL}/auth/callback/github"
    url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        f"&redirect_uri={callback_uri}"
        f"&scope=user:email"
    )
    return {"url": url}

@router.post("/github/callback")
async def github_callback(payload: OAuthCodeRequest):
    """Exchange GitHub auth code for JWT token"""
    redirect_uri = payload.redirect_uri or f"{FRONTEND_URL}/auth/callback/github"
    user_info = await exchange_github_code(payload.code, redirect_uri)
    return await _oauth_login_or_signup(user_info)

# ==================== PASSWORD MANAGEMENT ====================

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest):
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
