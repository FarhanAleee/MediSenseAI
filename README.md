# ⚕ MediSense AI
### Intelligent Symptom Analysis & Health Assistance Platform

> **Disclaimer:** This system is for educational and assistance purposes only.  
> It does NOT replace professional medical advice, diagnosis, or treatment.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [ML Model Details](#ml-model-details)
- [Development Plan](#development-plan)

---

## Overview

MediSense AI is an MVP full-stack web application that allows users to:
- Enter symptoms → get AI-predicted disease candidates
- Understand their risk level (mild / moderate / high)
- Receive safe, evidence-informed health guidance
- Get doctor recommendations for serious conditions
- Upload medical lab reports for plain-language explanations
- View active disease outbreaks and see if their symptoms match

---

## Features

| Feature | Description |
|---|---|
| 🧬 Disease Prediction | Random Forest model trained on 600+ symptom-disease mappings |
| 🚦 Risk Classification | Weighted scoring: symptom count + disease severity + outbreak match |
| 🏥 Doctor Recommendation | Mock dataset filtered by specialization and city |
| 📄 Report Analyzer | Extracts 15+ lab parameters and flags abnormal values |
| 🌍 Outbreak Intelligence | JSON-based outbreak data with real-time symptom matching |
| 🔒 Medical Safety | No prescriptions — only general guidance and "see a doctor" recommendations |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI (Python 3.11+) |
| ML | scikit-learn (Random Forest) |
| Frontend | React 18 + Vite |
| Database | PostgreSQL (via SQLAlchemy) |
| Styling | Pure CSS with CSS variables |

---

## Project Structure

```
medisense/
│
├── backend/
│   ├── main.py              # FastAPI app, CORS, router registration
│   ├── config.py            # All config (paths, weights, disclaimer)
│   ├── database.py          # SQLAlchemy setup + session dependency
│   ├── requirements.txt     # Python dependencies
│   │
│   ├── models/
│   │   ├── db_models.py     # ORM: SymptomLog, ReportLog
│   │   └── schemas.py       # Pydantic request/response schemas
│   │
│   ├── routers/
│   │   ├── symptoms.py      # POST /symptoms
│   │   ├── risk.py          # POST /risk
│   │   ├── doctors.py       # GET /doctors
│   │   ├── reports.py       # POST /report, POST /report/text
│   │   └── outbreaks.py     # GET /outbreaks, POST /outbreaks/match
│   │
│   ├── services/
│   │   ├── disease_model.py     # Random Forest training + prediction
│   │   ├── risk_classifier.py   # Risk scoring + safe advice
│   │   ├── doctor_recommender.py # Mock doctor filtering
│   │   ├── report_analyzer.py   # Lab value extraction + interpretation
│   │   └── outbreak_service.py  # Outbreak JSON loader + matcher
│   │
│   └── utils/
│       └── helpers.py       # Disclaimer injector, symptom normalizer
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx         # React entry point
│       ├── App.jsx          # Root component + navigation
│       ├── App.css          # Global dark theme design system
│       │
│       ├── pages/
│       │   ├── SymptomPage.jsx   # Symptom input + autocomplete
│       │   ├── Dashboard.jsx     # Full analysis results dashboard
│       │   └── ReportUpload.jsx  # File/text upload + results
│       │
│       ├── components/
│       │   ├── SymptomForm.jsx   # Autocomplete symptom input
│       │   ├── PredictionCard.jsx # Disease predictions with bars
│       │   ├── RiskIndicator.jsx  # Risk level + score bar
│       │   ├── DoctorList.jsx     # Doctor cards
│       │   ├── ReportSummary.jsx  # Abnormal/normal parameter tables
│       │   └── OutbreakPanel.jsx  # Outbreak list + alerts
│       │
│       └── services/
│           └── api.js            # All API calls (fetch wrappers)
│
└── data/
    ├── symptoms_dataset.csv   # 600-row ML training data (auto-generated)
    ├── generate_dataset.py    # Script to regenerate training data
    └── outbreaks.json         # 10 real-world outbreak scenarios
```

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (or SQLite for development)

### 1. Backend Setup

```bash
cd medisense/backend
pip install -r requirements.txt

# (Optional) Set up PostgreSQL
# Edit DATABASE_URL in config.py or set environment variable:
export DATABASE_URL="postgresql://user:pass@localhost/medisense"

# Start the backend
uvicorn main:app --reload --port 8000
```

The backend auto-trains the ML model on first run and caches it as `trained_model.pkl`.

### 2. Generate Training Data (if not already present)

```bash
cd medisense/data
python generate_dataset.py
```

### 3. Frontend Setup

```bash
cd medisense/frontend
npm install
npm run dev
```

Open http://localhost:3000

### 4. API Documentation
Auto-generated Swagger UI at: http://localhost:8000/docs

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/symptoms` | Predict diseases from symptoms list |
| GET | `/symptoms/list` | Get all known symptoms (for autocomplete) |
| POST | `/risk` | Standalone risk classification |
| GET | `/doctors` | Get doctor recommendations |
| POST | `/report` | Upload and analyze medical report file |
| POST | `/report/text` | Analyze raw report text |
| GET | `/outbreaks` | List all active outbreaks |
| POST | `/outbreaks/match` | Match symptoms against outbreaks |

### Example Request — Symptom Prediction
```bash
curl -X POST http://localhost:8000/symptoms \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["fever", "joint pain", "rash"], "region": "Pakistan"}'
```

### Example Response
```json
{
  "predictions": [
    {"disease": "Dengue", "confidence": 0.72, "specialization": "Internal Medicine"},
    {"disease": "Malaria", "confidence": 0.18, "specialization": "Infectious Disease"}
  ],
  "risk_level": "high",
  "outbreak_alert": "⚠️ Your symptoms overlap with active outbreak(s): Dengue.",
  "advice": ["⚠️ Please seek medical attention immediately.", "..."],
  "disclaimer": "This system is for educational and assistance purposes only..."
}
```

---

## ML Model Details

### Training Data
- 600 rows across 20 diseases
- Each row: Disease + up to 17 symptoms (columns Symptom_1 to Symptom_17)
- Diseases include: Dengue, Malaria, Typhoid, COVID-19, Influenza, Pneumonia, TB, Hepatitis B/C, Diabetes, Hypertension, Migraine, Asthma, Chickenpox, Common Cold, Gastroenteritis, UTI, Anemia, Arthritis, Psoriasis

### Model
- **Algorithm:** Random Forest (100 estimators)
- **Preprocessing:** MultiLabelBinarizer (symptoms → binary feature vector)
- **Train/Test Split:** 80/20
- **Typical Accuracy:** ~85–92% on test set
- **Caching:** Model pickled to `backend/services/trained_model.pkl` after first run

### Risk Scoring Formula
```
score = (symptom_count / 10) × 0.30
      + disease_severity × 0.50
      + outbreak_match × 0.20
      + red_flag_bonus × 0.50 (if any red-flag symptom present)

score capped at 1.0

mild     → score < 0.35
moderate → 0.35 ≤ score < 0.65
high     → score ≥ 0.65
```

---

## Development Plan

### Week 1 — Backend Core ✅
- [x] FastAPI project setup with CORS
- [x] Disease prediction model (Random Forest)
- [x] Risk classification service
- [x] All 6 API endpoints
- [x] Outbreak JSON + matching logic
- [x] PostgreSQL schema

### Week 2 — Frontend + Integration ✅
- [x] React + Vite setup
- [x] Symptom input with autocomplete
- [x] Dashboard with all panels
- [x] Doctor recommendations
- [x] Outbreak alert panel
- [x] API service layer

### Week 3 — Report Analyzer + Polish ✅
- [x] Lab value extraction (15+ parameters)
- [x] Abnormal flagging with plain-language explanations
- [x] PDF support (pdfminer.six)
- [x] Sample report for testing
- [x] Full responsive dark UI

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'Add my feature'`
4. Push and open a PR

---

## License

MIT License — Educational use only.

---

> **⚕ MediSense AI** — Built as an educational MVP demonstrating AI-assisted health guidance.  
> Always consult a qualified healthcare professional for medical decisions.
