# Day 3 – Dockerised Stack

## Local single‑service dev
```bash
# analytics (FastAPI)
cd analytics
.\.venv\Scripts\Activate
uvicorn analytics.main:app --reload --port 8000
