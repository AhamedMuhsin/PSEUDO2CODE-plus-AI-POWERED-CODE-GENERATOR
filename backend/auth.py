"""
JWT Authentication System - Replaces Firebase Auth
Handles: JWT creation/verification, password hashing, OAuth (Google, GitHub)
"""

from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
import bcrypt
from dotenv import load_dotenv
import os
import httpx

load_dotenv()

# ==================== CONFIG ====================
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    import warnings
    SECRET_KEY = "pseudo2code-plus-dev-only-fallback-key-2026"
    warnings.warn(
        "⚠️  JWT_SECRET_KEY not set! Using insecure fallback. "
        "Set JWT_SECRET_KEY in .env before deploying to production.",
        stacklevel=2,
    )
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day (reduced from 7 days)

# OAuth Config
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID", "")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET", "")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# ==================== PASSWORD HASHING ====================
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

# ==================== JWT TOKEN ====================
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

# ==================== FASTAPI DEPENDENCY ====================
security = HTTPBearer(auto_error=True)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    Returns dict with 'uid' and 'email' from the JWT token.
    """
    token = credentials.credentials
    payload = decode_access_token(token)
    
    uid = payload.get("uid")
    email = payload.get("email")
    
    if not uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    
    return {"uid": uid, "email": email}

# ==================== GOOGLE OAUTH ====================
async def exchange_google_code(code: str, redirect_uri: str = None) -> dict:
    """Exchange Google auth code for user info"""
    callback_uri = redirect_uri or f"{FRONTEND_URL}/auth/callback/google"
    async with httpx.AsyncClient() as client:
        # Exchange code for tokens
        token_response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": callback_uri,
                "grant_type": "authorization_code",
            },
        )
        
        if token_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to exchange Google auth code")
        
        tokens = token_response.json()
        access_token = tokens.get("access_token")
        
        # Get user info
        user_response = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        
        if user_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get Google user info")
        
        user_info = user_response.json()
        return {
            "email": user_info["email"],
            "name": user_info.get("name", ""),
            "avatar": user_info.get("picture", ""),
            "provider": "google",
            "provider_id": user_info["id"],
        }

# ==================== GITHUB OAUTH ====================
async def exchange_github_code(code: str, redirect_uri: str = None) -> dict:
    """Exchange GitHub auth code for user info"""
    async with httpx.AsyncClient() as client:
        # Exchange code for access token
        token_response = await client.post(
            "https://github.com/login/oauth/access_token",
            json={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code,
            },
            headers={"Accept": "application/json"},
        )
        
        if token_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to exchange GitHub auth code")
        
        tokens = token_response.json()
        access_token = tokens.get("access_token")
        
        if not access_token:
            error_desc = tokens.get("error_description", "Unknown error")
            raise HTTPException(status_code=400, detail=f"GitHub OAuth error: {error_desc}")
        
        # Get user info
        user_response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json",
            },
        )
        
        if user_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get GitHub user info")
        
        user_info = user_response.json()
        
        # Get email (may be private)
        email = user_info.get("email")
        if not email:
            email_response = await client.get(
                "https://api.github.com/user/emails",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/json",
                },
            )
            if email_response.status_code == 200:
                emails = email_response.json()
                primary = next((e for e in emails if e.get("primary")), None)
                email = primary["email"] if primary else emails[0]["email"] if emails else None
        
        if not email:
            raise HTTPException(status_code=400, detail="Could not retrieve email from GitHub")
        
        return {
            "email": email,
            "name": user_info.get("name") or user_info.get("login", ""),
            "avatar": user_info.get("avatar_url", ""),
            "provider": "github",
            "provider_id": str(user_info["id"]),
        }
