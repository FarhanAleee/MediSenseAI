"""
GET  /outbreaks        – list all active outbreaks (filter by region).
POST /outbreaks/match  – match user symptoms against outbreaks.
"""
from fastapi import APIRouter, Query
from typing import Optional
from models.schemas import Outbreak, OutbreakMatchRequest, OutbreakMatchResponse
from services.outbreak_service import get_all_outbreaks, match_symptoms_to_outbreaks

router = APIRouter()


@router.get("", response_model=list[Outbreak])
def list_outbreaks(region: Optional[str] = Query(None)):
    return get_all_outbreaks(region)


@router.post("/match", response_model=OutbreakMatchResponse)
def match_outbreaks(payload: OutbreakMatchRequest):
    matched, risk_increase, alert = match_symptoms_to_outbreaks(
        payload.symptoms, payload.region
    )
    return OutbreakMatchResponse(
        matched_outbreaks=matched,
        risk_increase=risk_increase,
        alert_message=alert,
    )
