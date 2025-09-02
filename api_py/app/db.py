import os
from sqlmodel import SQLModel, create_engine

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://postgres:postgres@localhost:5432/spendguard")
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

def init_db() -> None:
    SQLModel.metadata.create_all(engine)
