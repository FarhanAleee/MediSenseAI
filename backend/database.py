"""
Database connection setup using SQLAlchemy (PostgreSQL).
Swap DATABASE_URL in config.py to use MongoDB via Motor instead.
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency: yields a DB session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Call this on startup to create all tables."""
    from models.db_models import SymptomLog, ReportLog, User  # noqa: F401
    Base.metadata.create_all(bind=engine)
