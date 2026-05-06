"""POST /risk – standalone risk classification endpoint."""
from fastapi import APIRouter
from models.schemas import RiskRequest, RiskResponse
from services.risk_classifier import classify_risk
from services.outbreak_service import match_symptoms_to_outbreaks
from config import DISCLAIMER

router = APIRouter()


@router.post("", response_model=RiskResponse)
def get_risk(payload: RiskRequest):
    _, risk_increase, _ = match_symptoms_to_outbreaks(
        payload.symptoms, payload.region
    )
    level, score, factors = classify_risk(
        payload.symptoms,
        top_disease=payload.disease,
        outbreak_match=risk_increase,
    )
    return RiskResponse(
        risk_level=level,
        score=score,
        factors=factors,
        disclaimer=DISCLAIMER,
    )
