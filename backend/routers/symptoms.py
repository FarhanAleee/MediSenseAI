"""
POST /symptoms – predict diseases from a list of symptoms.
GET  /symptoms/list – return all known symptoms (for autocomplete).
"""
from fastapi import APIRouter
from models.schemas import SymptomRequest, SymptomResponse, DiseaseResult
from services.disease_model import get_predictor
from services.risk_classifier import classify_risk, get_advice
from services.outbreak_service import match_symptoms_to_outbreaks
from utils.helpers import normalize_symptoms, add_disclaimer
from config import DISCLAIMER

router = APIRouter()


@router.post("", response_model=SymptomResponse)
def predict_symptoms(payload: SymptomRequest):
    predictor = get_predictor()
    symptoms = normalize_symptoms(payload.symptoms)

    # 1. Disease prediction
    raw_predictions = predictor.predict(symptoms)
    predictions = [DiseaseResult(**p) for p in raw_predictions]

    # 2. Outbreak match
    top_disease = raw_predictions[0]["disease"] if raw_predictions else None
    matched, risk_increase, alert = match_symptoms_to_outbreaks(
        payload.symptoms, payload.region, payload.city
    )

    # 3. Risk classification
    risk_level, _, _ = classify_risk(
        payload.symptoms,
        top_disease=top_disease,
        outbreak_match=risk_increase,
    )

    # 4. Safe advice
    advice = get_advice(risk_level, payload.symptoms)

    return SymptomResponse(
        predictions=predictions,
        risk_level=risk_level,
        outbreak_alert=alert,
        advice=advice,
        disclaimer=DISCLAIMER,
    )


@router.get("/list")
def list_symptoms():
    predictor = get_predictor()
    return {"symptoms": predictor.get_all_symptoms()}
