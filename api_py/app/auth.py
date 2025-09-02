import os, uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException
from jose import jwt
from passlib.hash import bcrypt
from sqlmodel import Session, select
from .db import engine
from .models import User
from .schemas import RegisterIn, LoginIn, AuthOut, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])
SECRET = os.getenv("JWT_SECRET","change_me"); ALGO = "HS256"; EXPIRES = timedelta(hours=24)

def sign_token(user_id: uuid.UUID) -> str:
    return jwt.encode({"sub": str(user_id), "exp": datetime.utcnow()+EXPIRES}, SECRET, algorithm=ALGO)

@router.post("/register", response_model=AuthOut)
def register(body: RegisterIn):
    with Session(engine) as s:
        if s.exec(select(User).where(User.email==body.email)).first():
            raise HTTPException(400, "Email already in use")
        user = User(email=body.email, password_hash=bcrypt.hash(body.password))
        s.add(user); s.commit(); s.refresh(user)
        return {"token": sign_token(user.id), "user": UserOut(id=str(user.id), email=user.email)}

@router.post("/login", response_model=AuthOut)
def login(body: LoginIn):
    with Session(engine) as s:
        user = s.exec(select(User).where(User.email==body.email)).first()
        if not user or not bcrypt.verify(body.password, user.password_hash):
            raise HTTPException(401, "Invalid credentials")
        return {"token": sign_token(user.id), "user": UserOut(id=str(user.id), email=user.email)}
