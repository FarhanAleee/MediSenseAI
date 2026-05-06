"""
Outbreak intelligence service.
Loads outbreak data from outbreaks.json and matches user symptoms.
"""
import json
from pathlib import Path
from typing import List, Optional

from config import OUTBREAKS_PATH


def load_outbreaks() -> List[dict]:
    with open(OUTBREAKS_PATH, "r") as f:
        return json.load(f)


def get_all_outbreaks(region: Optional[str] = None) -> List[dict]:
    outbreaks = load_outbreaks()
    if region:
        return [o for o in outbreaks if o["region"].lower() == region.lower()]
    return outbreaks


def match_symptoms_to_outbreaks(
    symptoms: List[str], region: Optional[str] = None, city: Optional[str] = None
) -> tuple[List[dict], bool, Optional[str]]:
    """
    Returns (matched_outbreaks, risk_increase, alert_message).
    """
    outbreaks = load_outbreaks()
    if region:
        outbreaks = [o for o in outbreaks if o["region"].lower() == region.lower()]

    lower_symptoms = {s.lower().strip() for s in symptoms}
    matched = []

    for outbreak in outbreaks:
        outbreak_symptoms = {s.lower().strip() for s in outbreak.get("symptoms", [])}
        overlap = lower_symptoms & outbreak_symptoms
        if len(overlap) >= 1:  # at least 1 symptom match
            matched.append({**outbreak, "matched_symptoms": list(overlap)})

    risk_increase = bool(matched)
    alert_message = None
    if matched:
        diseases = ", ".join(m["disease"] for m in matched)
        location = city if city and region and region.lower() != "global" else region or "your region"
        alert_message = (
            f"⚠️ Your symptoms overlap with active outbreak(s) in {location}: {diseases}. "
            "Take extra precautions and consult a doctor promptly."
        )

    return matched, risk_increase, alert_message
