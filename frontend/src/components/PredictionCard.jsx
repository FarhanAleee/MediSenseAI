export default function PredictionCard({ predictions = [] }) {
  if (!predictions.length) return null;

  return (
    <div className="card">
      <div className="card-title">🧬 Disease Predictions</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {predictions.map((p, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "var(--surface2)", borderRadius: 8, padding: "12px 16px"
          }}>
            {/* Rank badge */}
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: i === 0 ? "var(--accent)" : "var(--border)",
              color: i === 0 ? "#000" : "var(--text-muted)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "0.8rem", flexShrink: 0
            }}>
              {i + 1}
            </div>

            {/* Name + specialization */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{p.disease}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                See: {p.specialization}
              </div>
            </div>

            {/* Confidence bar */}
            <div style={{ width: 120, textAlign: "right" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 4 }}>
                {(p.confidence * 100).toFixed(1)}% match
              </div>
              <div style={{ height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 2,
                  width: `${p.confidence * 100}%`,
                  background: `linear-gradient(90deg, var(--accent2), var(--accent))`
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 12, fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic" }}>
        Predictions are statistical estimates only — consult a qualified physician for diagnosis.
      </p>
    </div>
  );
}
