import { useState, useEffect } from "react";
import SymptomForm from "../components/SymptomForm";
import PredictionCard from "../components/PredictionCard";
import RiskIndicator from "../components/RiskIndicator";
import DoctorList from "../components/DoctorList";
import OutbreakPanel from "../components/OutbreakPanel";
import MetricCard from "../components/MetricCard";
import { predictSymptoms, getDoctors, getRisk, getOutbreaks } from "../services/api";

const summaryMetrics = [
  { icon: "🧪", title: "Symptom Checks", value: "7,824", label: "requests this month" },
  { icon: "📍", title: "Active Regions", value: "12", label: "monitored closely" },
  { icon: "🏥", title: "Verified Doctors", value: "54", label: "available nearby" },
  { icon: "⚠️", title: "Alerts", value: "3", label: "rising outbreaks" },
];

export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [outbreaks, setOutbreaks] = useState([]);
  const [riskDetail, setRiskDetail] = useState(null);

  const appointment = {
    date: "May 12, 2026",
    time: "10:30 AM",
    doctor: "Dr. Sana Iqbal",
    location: "Karachi Medical Center",
    status: "Confirmed",
  };

  useEffect(() => {
    if (!result) return;
    const topDisease = result.predictions?.[0];

    if (topDisease) {
      getDoctors(topDisease.specialization, result.city)
        .then(d => setDoctors(d.doctors || []))
        .catch(() => setDoctors([]));
    }

    if (result.risk_level) {
      getRisk([], topDisease?.disease, result.region)
        .then(data => setRiskDetail(data))
        .catch(() => setRiskDetail(null));
    }

    getOutbreaks(result.region)
      .then(d => setOutbreaks(d))
      .catch(() => setOutbreaks([]));
  }, [result]);

  const handleSubmit = async (symptoms, region, city) => {
    setLoading(true);
    setError(null);
    try {
      const response = await predictSymptoms(symptoms, region, city);
      setResult(response);
    } catch (e) {
      setError(e.message || "Failed to analyze symptoms. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero card">
        <div>
          <div className="page-label">Healthcare Intelligence</div>
          <h1>Welcome back, Ayesha.</h1>
          <p className="hero-copy">
            Your MediSense dashboard helps you track symptoms, monitor outbreaks, and connect with care faster.
          </p>
        </div>
        <div className="hero-actions">
          <button className="btn btn-primary">New Check</button>
          <button className="btn btn-secondary">View reports</button>
        </div>
      </section>

      <section className="overview-cards">
        {summaryMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      <section className="grid-2">
        <div className="card">
          <div className="card-title">🤒 Symptom Checker</div>
          <p className="section-description">
            Add your symptoms, pick your region, and get AI-powered guidance instantly.
          </p>
          <SymptomForm onSubmit={handleSubmit} loading={loading} />
          {error && <div className="alert alert-danger">{error}</div>}
        </div>

        <div className="card summary-card">
          <div className="card-title">🧬 Latest Analysis</div>
          {result ? (
            <>
              <PredictionCard predictions={result.predictions || []} />
              <RiskIndicator riskLevel={result.risk_level} factors={riskDetail?.factors || []} score={riskDetail?.score} />
              {result.advice?.length > 0 && (
                <div className="advice-panel">
                  <div className="panel-title">Recommended action</div>
                  <ul>
                    {result.advice.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>Run a symptom check to see predictions, risk level, and care advice.</p>
            </div>
          )}
        </div>
      </section>

      <section className="grid-2">
        <OutbreakPanel outbreaks={outbreaks} alertMessage={result?.outbreak_alert} />
        <div className="card appointment-card">
          <div className="card-title">📅 Upcoming Appointment</div>
          <div className="appointment-details">
            <div>
              <span className="appointment-tag">{appointment.status}</span>
              <h3>{appointment.doctor}</h3>
              <p>{appointment.date} · {appointment.time}</p>
              <p className="text-muted">{appointment.location}</p>
            </div>
            <button className="btn btn-secondary">Manage</button>
          </div>
          <div className="appointment-note">
            Need to reschedule? Contact the clinic or use the appointment section when available.
          </div>
        </div>
      </section>

      <section className="grid-2 bottom-row">
        <DoctorList doctors={doctors} />
        <div className="card">
          <div className="card-title">📘 Health History</div>
          <p className="section-description">
            Keep track of past symptom checks, doctor recommendations, and follow-up steps in one place.
          </p>
          <div className="history-grid">
            <div className="history-item">
              <strong>Apr 28</strong>
              <p>Fever, cough check completed.</p>
            </div>
            <div className="history-item">
              <strong>Apr 14</strong>
              <p>Outbreak alert reviewed for Karachi.</p>
            </div>
            <div className="history-item">
              <strong>Mar 30</strong>
              <p>Doctor referral sent to pulmonologist.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
