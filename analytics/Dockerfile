FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY . /app/analytics

RUN pip install fastapi uvicorn

CMD ["uvicorn", "analytics.main:app", "--host", "0.0.0.0", "--port", "8000"]

