from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class TokenOut(BaseModel):
    token: str

class UserOut(BaseModel):
    id: str
    email: str

class AuthOut(BaseModel):
    token: str
    user: UserOut

class RegisterIn(BaseModel):
    email: str
    password: str

class LoginIn(RegisterIn):
    pass

class TxCreate(BaseModel):
    category: Optional[str] = None
    amount: float
    posted_at: datetime
