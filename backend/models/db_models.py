"""
SQLAlchemy ORM models for MediSense AI.
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, JSON
from sqlalchemy.sql import func
from database import Base


class SymptomLog(Base):
    """Logs every symptom query for analytics."""
    __tablename__ = "symptom_logs"

    id = Column(Integer, primary_key=True, index=True)
    symptoms = Column(JSON, nullable=False)           # ["fever", "cough"]
    predicted_diseases = Column(JSON, nullable=True)  # [{"disease": ..., "confidence": ...}]
    risk_level = Column(String(20), nullable=True)    # mild | moderate | high
    outbreak_match = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ReportLog(Base):
    """Logs uploaded medical reports."""
    __tablename__ = "report_logs"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=True)
    extracted_text = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    abnormal_flags = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class User(Base):
    """Application users for signup and login."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(512), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
