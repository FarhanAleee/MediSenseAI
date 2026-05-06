"""General utility helpers."""
import bcrypt
from config import DISCLAIMER


def add_disclaimer(data: dict) -> dict:
    """Inject the standard medical disclaimer into any response dict."""
    data["disclaimer"] = DISCLAIMER
    return data


def normalize_symptoms(symptoms: list[str]) -> list[str]:
    """Lowercase, strip, replace spaces with underscores (for ML model)."""
    return [s.strip().lower().replace(" ", "_") for s in symptoms if s.strip()]


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(password: str, stored_hash: str) -> bool:
    """Verify a password against a stored bcrypt hash."""
    try:
        return bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8"))
    except Exception:
        return False
