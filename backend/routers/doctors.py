"""GET /doctors – recommend doctors by specialization and city."""
from fastapi import APIRouter, Query
from typing import Optional
from models.schemas import DoctorResponse, Doctor
from services.doctor_recommender import recommend_doctors
from config import DISCLAIMER

router = APIRouter()


@router.get("", response_model=DoctorResponse)
def get_doctors(
    specialization: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    available_only: bool = Query(True),
):
    doctors = recommend_doctors(specialization, city, available_only)
    return DoctorResponse(doctors=[Doctor(**d) for d in doctors], disclaimer=DISCLAIMER)
