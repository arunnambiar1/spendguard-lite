# Use the slim Python base
FROM python:3.12-slim

# Don’t write .pyc files & unbuffered stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory inside container
WORKDIR /app

# 1) Copy only the requirements file & install in one layer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2) Copy the rest of your analytics code
COPY . .

# Expose the port & run Uvicorn with reload (dev mode)
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
