"""
MediSense AI – FastAPI Backend
Educational & Assistance purposes only. Not a medical diagnosis tool.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routers import symptoms, risk, doctors, reports, outbreaks, auth
from database import create_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_tables()
    yield
    # Shutdown (if needed)

app = FastAPI(
    title="MediSense AI",
    description="Intelligent Symptom Analysis & Health Assistance Platform",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(symptoms.router, prefix="/symptoms", tags=["Symptoms"])
app.include_router(risk.router, prefix="/risk", tags=["Risk"])
app.include_router(doctors.router, prefix="/doctors", tags=["Doctors"])
app.include_router(reports.router, prefix="/report", tags=["Reports"])
app.include_router(outbreaks.router, prefix="/outbreaks", tags=["Outbreaks"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])


@app.get("/")
def root():
    return {
        "message": "MediSense AI API",
        "disclaimer": "This system is for educational and assistance purposes only.",
    }
