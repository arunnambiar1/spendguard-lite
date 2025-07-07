from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import datetime as dt
import math

app = FastAPI()

class Tx(BaseModel):
    user_id: str
    category: str
    amount: float
    posted_at: str

@app.post("/analyze")
def analyze(tx: Tx):
    # 1. Initialize DF on first call
    if "df" not in analyze.__dict__:
        analyze.df = pd.DataFrame(columns=Tx.model_fields.keys())

    # 2. Drop rows older than 30 days
    # 1. Make cutoff tz‐aware UTC
    cutoff = dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=30)

# 2. Always parse posted_at as UTC
    times = pd.to_datetime(analyze.df.posted_at, utc=True)

# 3. Filter on those UTC timestamps
    analyze.df = analyze.df[times >= cutoff]


    # 3. Compute stats on existing data (before adding this tx)
    prior = analyze.df[analyze.df.category == tx.category]
    mean = prior.amount.mean()
    std  = prior.amount.std()

    # 4. Guard & compute z‑score
    if math.isnan(mean) or math.isnan(std) or std == 0:
        z = 0.0
    else:
        z = (tx.amount - mean) / std
    score = round(float(z), 2)

    # 5. Now append the new transaction (so it's included for future calls)
    analyze.df.loc[len(analyze.df)] = tx.model_dump()

    return {"category": tx.category, "score": score}

@app.get("/ping")
def ping():
    return {"status": "analytics up"}
