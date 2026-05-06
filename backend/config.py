"""
Configuration settings for MediSense AI backend.
Uses environment variables with sensible defaults.
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Database
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:password@localhost:5432/medisense"
)
# For MongoDB: MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/medisense")

# Data paths
DATASET_PATH = BASE_DIR / "data" / "symptoms_dataset.csv"
OUTBREAKS_PATH = BASE_DIR / "data" / "outbreaks.json"

# Model settings
MODEL_PATH = BASE_DIR / "backend" / "services" / "trained_model.pkl"
RISK_WEIGHTS = {
    "symptom_count": 0.3,
    "disease_severity": 0.5,
    "outbreak_match": 0.2,
}

# App
DEBUG = os.getenv("DEBUG", "true").lower() == "true"
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production-12345")
DISCLAIMER = "This system is for educational and assistance purposes only. It does NOT replace professional medical advice."
