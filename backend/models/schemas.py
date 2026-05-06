"""
Pydantic schemas for request validation and response serialization.
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional


# ─── Symptoms ─────────────────────────────────────────────────────────────────

class SymptomRequest(BaseModel):
    symptoms: List[str] = Field(..., example=["fever", "cough", "fatigue"])
    region: Optional[str] = Field(None, example="Pakistan")
    city: Optional[str] = None


class DiseaseResult(BaseModel):
    disease: str
    confidence: float   # 0.0 – 1.0
    specialization: str # doctor type to see


class SymptomResponse(BaseModel):
    predictions: List[DiseaseResult]
    risk_level: str          # mild | moderate | high
    outbreak_alert: Optional[str]
    advice: List[str]
    disclaimer: str


# ─── Risk ─────────────────────────────────────────────────────────────────────

class RiskRequest(BaseModel):
    symptoms: List[str]
    disease: Optional[str] = None
    region: Optional[str] = None


class RiskResponse(BaseModel):
    risk_level: str
    score: float
    factors: List[str]
    disclaimer: str


# ─── Doctors ──────────────────────────────────────────────────────────────────

class Doctor(BaseModel):
    name: str
    specialization: str
    hospital: str
    city: str
    contact: str
    available: bool


class DoctorResponse(BaseModel):
    doctors: List[Doctor]
    disclaimer: str


# ─── Reports ──────────────────────────────────────────────────────────────────

class ReportResponse(BaseModel):
    filename: str
    summary: str
    abnormal_parameters: List[dict]
    normal_parameters: List[dict]
    advice: str
    disclaimer: str


class AuthCreate(BaseModel):
    email: EmailStr
    password: str


class SignupRequest(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=255)
    last_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=8)

    @field_validator("first_name", "last_name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Name fields cannot be empty.")
        return cleaned


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not value:
            raise ValueError("Password is required.")
        return value


class AuthResponse(BaseModel):
    email: str
    message: str
    disclaimer: str


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# ─── Outbreaks ────────────────────────────────────────────────────────────────

class Outbreak(BaseModel):
    disease: str
    region: str
    severity: str
    symptoms: List[str]
    reported_date: Optional[str] = None
    source: Optional[str] = None


class OutbreakMatchRequest(BaseModel):
    symptoms: List[str]
    region: Optional[str] = None
    city: Optional[str] = None


class OutbreakMatchResponse(BaseModel):
    matched_outbreaks: List[Outbreak]
    risk_increase: bool
    alert_message: Optional[str]
