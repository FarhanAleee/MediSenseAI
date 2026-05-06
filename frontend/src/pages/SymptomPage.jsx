import { useState } from "react";
import SymptomForm from "../components/SymptomForm";
import { predictSymptoms } from "../services/api";

export default function SymptomPage({ onNavigate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (symptoms, region, city) => {
    setLoading(true);
    setError(null);
    try {
      const result = await predictSymptoms(symptoms, region, city);
      onNavigate("dashboard", { ...result, region, city });
    } catch (e) {
      setError(e.message || "Failed to analyze symptoms. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{
          fontSize: "4rem", marginBottom: 16,
          filter: "drop-shadow(0 0 24px rgba(0,212,255,0.4))"
        }}>⚕</div>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 8, letterSpacing: "-0.5px" }}>
          MediSense <span style={{ color: "var(--accent)" }}>AI</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: 480, margin: "0 auto" }}>
          Describe your symptoms to receive AI-powered health insights,
          risk assessment, and guidance — all in seconds.
        </p>
      </div>

      {/* Form card */}
      <div className="card">
        <div className="card-title">🤒 Symptom Input</div>
        <SymptomForm onSubmit={handleSubmit} loading={loading} />
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginTop: 16 }}>
          {error}
        </div>
      )}

      {/* How it works */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 32
      }}>
        {[
          { icon: "🧬", title: "Predict", desc: "ML model identifies possible diseases from your symptoms" },
          { icon: "🚦", title: "Risk Score", desc: "Classifies severity as mild, moderate, or high" },
          { icon: "🏥", title: "Get Help", desc: "Recommends specialists and shows regional outbreaks" },
        ].map(f => (
          <div key={f.title} className="card" style={{ textAlign: "center", padding: "20px 16px" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
