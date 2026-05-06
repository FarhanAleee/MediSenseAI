"""
Risk classification service.
Combines symptom count, disease severity score, and outbreak match
to produce a final risk level: mild | moderate | high
"""
from typing import List, Optional, Tuple

# Static disease severity mapping (0.0 = low risk, 1.0 = very high risk)
DISEASE_SEVERITY = {
    "COVID-19": 0.85,
    "Tuberculosis": 0.90,
    "Dengue": 0.80,
    "Malaria": 0.85,
    "Typhoid": 0.70,
    "Pneumonia": 0.80,
    "Hepatitis B": 0.75,
    "Hepatitis C": 0.75,
    "Influenza": 0.50,
    "Asthma": 0.60,
    "Diabetes": 0.65,
    "Hypertension": 0.65,
    "Migraine": 0.35,
    "Common Cold": 0.15,
    "Chickenpox": 0.45,
    "Gastroenteritis": 0.40,
    "Urinary Tract Infection": 0.45,
    "Anemia": 0.50,
    "Arthritis": 0.40,
    "Psoriasis": 0.30,
}

# High-severity symptoms that always elevate risk
RED_FLAG_SYMPTOMS = {
    "chest pain", "difficulty breathing", "shortness of breath",
    "unconsciousness", "loss of consciousness", "severe headache",
    "blood in urine", "coughing blood", "high fever", "convulsions",
    "paralysis", "sudden vision loss", "numbness"
}


def classify_risk(
    symptoms: List[str],
    top_disease: Optional[str] = None,
    outbreak_match: bool = False,
) -> Tuple[str, float, List[str]]:
    """
    Returns (risk_level, score, factors).
    score is 0.0–1.0; risk_level is 'mild'|'moderate'|'high'.
    """
    factors = []
    score = 0.0

    # 1. Symptom count contribution (weight 0.30)
    sym_count = len(symptoms)
    count_score = min(sym_count / 10, 1.0) * 0.30
    score += count_score
    factors.append(f"{sym_count} symptom(s) reported")

    # 2. Red flag symptoms (override to high immediately)
    lower_symptoms = {s.lower() for s in symptoms}
    red_flags_found = lower_symptoms & RED_FLAG_SYMPTOMS
    if red_flags_found:
        score += 0.50
        factors.append(f"Red-flag symptoms detected: {', '.join(red_flags_found)}")

    # 3. Disease severity contribution (weight 0.50)
    if top_disease:
        sev = DISEASE_SEVERITY.get(top_disease, 0.40)
        score += sev * 0.50
        factors.append(f"Predicted disease severity for '{top_disease}': {sev:.0%}")

    # 4. Outbreak match contribution (weight 0.20)
    if outbreak_match:
        score += 0.20
        factors.append("Active outbreak match in your region")

    score = min(score, 1.0)

    if score >= 0.65:
        level = "high"
    elif score >= 0.35:
        level = "moderate"
    else:
        level = "mild"

    return level, round(score, 3), factors


def get_advice(risk_level: str, symptoms: List[str]) -> List[str]:
    """Return safe, non-prescriptive health guidance."""
    common = [
        "Stay hydrated and rest adequately.",
        "Monitor your symptoms and note any changes.",
        "Maintain proper hygiene to prevent spreading illness.",
    ]
    if risk_level == "mild":
        return common + [
            "You can manage mild symptoms at home with rest and fluids.",
            "If symptoms worsen or persist beyond 3 days, consult a doctor.",
        ]
    elif risk_level == "moderate":
        return common + [
            "Consider visiting a clinic or general physician soon.",
            "Avoid self-medicating — a professional diagnosis is recommended.",
            "Track your temperature and symptom progression.",
        ]
    else:  # high
        return [
            "⚠️ Please seek medical attention immediately.",
            "Visit the nearest hospital or emergency room.",
            "Do NOT delay — high-risk conditions require prompt professional care.",
            "Inform healthcare providers of all your symptoms and travel history.",
        ]
