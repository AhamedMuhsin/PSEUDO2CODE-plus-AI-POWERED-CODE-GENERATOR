from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    uid: str
    email: EmailStr
    provider: str
    created_at: datetime
    last_login: datetime
