from __future__ import annotations
import os, uuid, statistics, time
from typing import List
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Session, select

from .db import engine, init_db
from .models import Transaction, Alert
from .schemas import TxCreate
from .auth import router as auth_router

app = FastAPI(title="SpendGuard API")

origins = (os.getenv("CORS_ORIGINS") or "").split(",") if os.getenv("CORS_ORIGINS") else ["*"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

SECRET = os.getenv("JWT_SECRET","change_me")
ALGO = "HS256"
bearer = HTTPBearer()

def current_user_id(creds: HTTPAuthorizationCredentials = Depends(bearer)) -> uuid.UUID:
    try:
        payload = jwt.decode(creds.credentials, SECRET, algorithms=[ALGO])
        return uuid.UUID(payload["sub"])
    except Exception:
        raise HTTPException(401, "Invalid or expired token")

@app.on_event("startup")
def on_start():
    # wait for DB be ready
    for _ in range(60):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            break
        except SQLAlchemyError:
            time.sleep(1)
    init_db()

# mount /auth/*
app.include_router(auth_router)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/transactions")
def list_transactions(user_id: uuid.UUID = Depends(current_user_id)):
    with Session(engine) as s:
        return s.exec(
            select(Transaction)
            .where(Transaction.user_id == user_id)
            .order_by(Transaction.posted_at.desc())
        ).all()

def zscore(value: float, arr: List[float]) -> float:
    if len(arr) < 2:
        return 0.0
    mean = statistics.fmean(arr)
    try:
        std = statistics.stdev(arr)
    except statistics.StatisticsError:
        std = 1.0
    if std == 0:
        std = 1.0
    return (value - mean) / std

@app.post("/transactions")
def create_transaction(body: TxCreate, user_id: uuid.UUID = Depends(current_user_id)):
    with Session(engine) as s:
        # robustly normalize prior amounts to floats regardless of shape
        prev = s.exec(
            select(Transaction.amount)
            .where(Transaction.user_id == user_id)
            .order_by(Transaction.posted_at.desc())
            .limit(200)
        ).all()

        prev_vals: List[float] = []
        for item in prev:
            try:
                if isinstance(item, (tuple, list)):
                    prev_vals.append(float(item[0]))
                else:
                    prev_vals.append(float(item))
            except Exception:
                # skip anything weird
                pass

        score = zscore(float(body.amount), prev_vals)

        t = Transaction(
            user_id=user_id,
            category=body.category,
            amount=float(body.amount),
            posted_at=body.posted_at,
        )
        s.add(t); s.commit(); s.refresh(t)

        if abs(score) >= 3:
            s.add(Alert(user_id=user_id, category=body.category, score=float(round(score, 3))))
            s.commit()

        return {
            "id": t.id,
            "user_id": str(user_id),
            "category": t.category,
            "amount": t.amount,
            "posted_at": t.posted_at,
            "score": float(round(score, 3)),
        }

@app.get("/alerts")
def list_alerts(user_id: uuid.UUID = Depends(current_user_id)):
    with Session(engine) as s:
        return s.exec(
            select(Alert)
            .where(Alert.user_id == user_id)
            .order_by(Alert.created_at.desc())
        ).all()
