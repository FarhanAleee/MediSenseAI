"""
Medical report analyzer.
Extracts key lab values from uploaded text/PDF reports
and flags abnormal parameters with plain-language explanations.
"""
import re
from typing import List, Dict, Tuple

# ── Reference Ranges ──────────────────────────────────────────────────────────
# Format: param_name → (min, max, unit, plain_name, low_meaning, high_meaning)
REFERENCE_RANGES = {
    # Blood counts
    "hemoglobin": (12.0, 17.5, "g/dL", "Hemoglobin",
                   "Low hemoglobin may indicate anemia or blood loss.",
                   "High hemoglobin may indicate dehydration or a blood disorder."),
    "wbc": (4.0, 11.0, "×10³/µL", "White Blood Cells",
            "Low WBC may weaken immunity.",
            "High WBC often signals infection or inflammation."),
    "rbc": (4.2, 5.9, "×10⁶/µL", "Red Blood Cells",
            "Low RBC may indicate anemia.",
            "High RBC may indicate dehydration."),
    "platelets": (150.0, 400.0, "×10³/µL", "Platelets",
                  "Low platelets increase bleeding risk.",
                  "High platelets may increase clotting risk."),
    # Metabolic
    "glucose": (70.0, 100.0, "mg/dL", "Blood Glucose (Fasting)",
                "Low blood sugar (hypoglycemia) — eat something.",
                "High blood sugar may indicate diabetes or prediabetes."),
    "hba1c": (0.0, 5.7, "%", "HbA1c",
              "No concern for low HbA1c.",
              "Elevated HbA1c indicates poor long-term blood sugar control."),
    "creatinine": (0.6, 1.2, "mg/dL", "Creatinine",
                   "Low creatinine may indicate muscle loss.",
                   "High creatinine may indicate kidney dysfunction."),
    "urea": (7.0, 20.0, "mg/dL", "Blood Urea",
             "Low urea may indicate liver issues.",
             "High urea may indicate kidney problems or dehydration."),
    # Liver
    "alt": (7.0, 56.0, "U/L", "ALT (Liver enzyme)",
            "No concern for low ALT.",
            "Elevated ALT suggests liver inflammation or damage."),
    "ast": (10.0, 40.0, "U/L", "AST (Liver enzyme)",
            "No concern for low AST.",
            "Elevated AST may indicate liver or muscle damage."),
    "bilirubin": (0.2, 1.2, "mg/dL", "Bilirubin",
                  "No concern for low bilirubin.",
                  "High bilirubin can cause jaundice; may indicate liver issues."),
    # Lipids
    "cholesterol": (0.0, 200.0, "mg/dL", "Total Cholesterol",
                    "No concern for very low cholesterol.",
                    "High cholesterol increases cardiovascular risk."),
    "ldl": (0.0, 100.0, "mg/dL", "LDL Cholesterol",
            "No concern for low LDL.",
            "High LDL ('bad' cholesterol) increases heart disease risk."),
    "hdl": (40.0, 9999.0, "mg/dL", "HDL Cholesterol",
            "Low HDL ('good' cholesterol) increases heart disease risk.",
            "High HDL is generally protective."),
    "triglycerides": (0.0, 150.0, "mg/dL", "Triglycerides",
                      "No concern for low triglycerides.",
                      "High triglycerides increase risk of heart disease."),
    # Thyroid
    "tsh": (0.4, 4.0, "mIU/L", "TSH (Thyroid)",
            "Low TSH may indicate overactive thyroid (hyperthyroidism).",
            "High TSH may indicate underactive thyroid (hypothyroidism)."),
}

# Keywords that help locate values in report text
ALIASES = {
    "hemoglobin": ["hgb", "hb", "hemoglobin"],
    "wbc": ["wbc", "leukocytes", "white blood cell", "white blood count"],
    "rbc": ["rbc", "red blood cell", "erythrocyte"],
    "platelets": ["plt", "platelet", "thrombocyte"],
    "glucose": ["glucose", "fbs", "blood sugar", "fasting blood sugar"],
    "hba1c": ["hba1c", "glycated hemoglobin", "a1c"],
    "creatinine": ["creatinine", "cr"],
    "urea": ["urea", "bun", "blood urea nitrogen"],
    "alt": ["alt", "sgpt", "alanine aminotransferase"],
    "ast": ["ast", "sgot", "aspartate aminotransferase"],
    "bilirubin": ["bilirubin", "total bilirubin"],
    "cholesterol": ["total cholesterol", "cholesterol"],
    "ldl": ["ldl", "ldl-c"],
    "hdl": ["hdl", "hdl-c"],
    "triglycerides": ["triglycerides", "tg"],
    "tsh": ["tsh", "thyroid stimulating hormone"],
}


def _extract_value(text: str, aliases: List[str]) -> float | None:
    """Try to extract a numeric value following one of the given keywords."""
    for alias in aliases:
        pattern = rf"{re.escape(alias)}\s*[:\-]?\s*([\d.]+)"
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                return float(match.group(1))
            except ValueError:
                continue
    return None


def analyze_report(text: str) -> Dict:
    """
    Parse raw report text, identify lab parameters, and flag abnormals.
    Returns dict with normal_parameters, abnormal_parameters, and summary.
    """
    text_lower = text.lower()
    abnormal = []
    normal = []

    for param_key, (lo, hi, unit, plain_name, low_msg, high_msg) in REFERENCE_RANGES.items():
        value = _extract_value(text_lower, ALIASES.get(param_key, [param_key]))
        if value is None:
            continue

        entry = {
            "parameter": plain_name,
            "value": value,
            "unit": unit,
            "reference": f"{lo}–{hi}" if hi < 9000 else f">{lo}",
        }

        if value < lo:
            entry["flag"] = "LOW"
            entry["explanation"] = low_msg
            abnormal.append(entry)
        elif value > hi:
            entry["flag"] = "HIGH"
            entry["explanation"] = high_msg
            abnormal.append(entry)
        else:
            entry["flag"] = "NORMAL"
            normal.append(entry)

    # Generate a plain-language summary
    if not abnormal and not normal:
        summary = "No recognizable lab values were detected. Please ensure the report text is correctly formatted."
    elif not abnormal:
        summary = f"All {len(normal)} detected parameter(s) are within normal range. Great news!"
    else:
        flags = ", ".join(f"{a['parameter']} ({a['flag']})" for a in abnormal)
        summary = (
            f"{len(abnormal)} parameter(s) outside normal range: {flags}. "
            "Please consult a doctor for proper interpretation."
        )

    return {
        "abnormal_parameters": abnormal,
        "normal_parameters": normal,
        "summary": summary,
        "advice": (
            "These results are auto-interpreted and may not be fully accurate. "
            "Always consult a qualified healthcare professional for diagnosis."
        ),
    }
