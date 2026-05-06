"""
Disease prediction service using Random Forest / Naive Bayes.
Trains on symptoms_dataset.csv on first run and caches the model.
"""
import pickle
import logging
from pathlib import Path
from typing import List, Dict

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

from config import DATASET_PATH, MODEL_PATH

logger = logging.getLogger(__name__)

# Disease → recommended specialist mapping
SPECIALIZATION_MAP = {
    "Dengue": "Internal Medicine",
    "Malaria": "Infectious Disease",
    "Typhoid": "Gastroenterology",
    "COVID-19": "Pulmonology",
    "Influenza": "General Physician",
    "Pneumonia": "Pulmonology",
    "Tuberculosis": "Pulmonology",
    "Hepatitis B": "Hepatology",
    "Hepatitis C": "Hepatology",
    "Diabetes": "Endocrinology",
    "Hypertension": "Cardiology",
    "Migraine": "Neurology",
    "Asthma": "Pulmonology",
    "Chickenpox": "Dermatology",
    "Common Cold": "General Physician",
    "Gastroenteritis": "Gastroenterology",
    "Urinary Tract Infection": "Urology",
    "Anemia": "Hematology",
    "Arthritis": "Rheumatology",
    "Psoriasis": "Dermatology",
}


class DiseasePredictor:
    def __init__(self):
        self.model = None
        self.mlb = MultiLabelBinarizer()
        self.all_symptoms: List[str] = []
        self._load_or_train()

    # ── Training ────────────────────────────────────────────────────────────

    def _load_or_train(self):
        if MODEL_PATH.exists():
            logger.info("Loading cached model from %s", MODEL_PATH)
            with open(MODEL_PATH, "rb") as f:
                data = pickle.load(f)
            self.model = data["model"]
            self.mlb = data["mlb"]
            self.all_symptoms = data["all_symptoms"]
        else:
            logger.info("Training new model…")
            self._train()

    def _train(self):
        df = pd.read_csv(DATASET_PATH)

        # Expected columns: Disease, Symptom_1, Symptom_2, …, Symptom_17
        symptom_cols = [c for c in df.columns if c.lower().startswith("symptom")]
        df[symptom_cols] = df[symptom_cols].fillna("").applymap(str.strip)

        # Build symptom lists per row
        df["symptom_list"] = df[symptom_cols].apply(
            lambda row: [s for s in row if s and s != "nan"], axis=1
        )

        self.all_symptoms = sorted(
            {s for symptoms in df["symptom_list"] for s in symptoms}
        )

        X_raw = df["symptom_list"].tolist()
        y = df["Disease"].tolist()

        X = self.mlb.fit_transform(X_raw)

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)

        acc = accuracy_score(y_test, self.model.predict(X_test))
        logger.info("Model trained. Test accuracy: %.2f", acc)

        MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(MODEL_PATH, "wb") as f:
            pickle.dump(
                {"model": self.model, "mlb": self.mlb, "all_symptoms": self.all_symptoms},
                f,
            )

    # ── Prediction ──────────────────────────────────────────────────────────

    def predict(self, symptoms: List[str], top_n: int = 5) -> List[Dict]:
        cleaned = [s.strip().lower().replace(" ", "_") for s in symptoms]
        X = self.mlb.transform([cleaned])

        probabilities = self.model.predict_proba(X)[0]
        classes = self.model.classes_

        # Sort by probability descending
        ranked = sorted(zip(classes, probabilities), key=lambda x: x[1], reverse=True)[:top_n]

        results = []
        for disease, confidence in ranked:
            if confidence > 0.01:  # Filter near-zero predictions
                results.append({
                    "disease": disease,
                    "confidence": round(float(confidence), 3),
                    "specialization": SPECIALIZATION_MAP.get(disease, "General Physician"),
                })
        return results

    def get_all_symptoms(self) -> List[str]:
        formatted = [s.replace("_", " ").title() for s in self.all_symptoms]
        logger.info("Returning %d symptoms to frontend", len(formatted))
        return formatted


# Singleton
_predictor: DiseasePredictor | None = None


def get_predictor() -> DiseasePredictor:
    global _predictor
    if _predictor is None:
        _predictor = DiseasePredictor()
    return _predictor
