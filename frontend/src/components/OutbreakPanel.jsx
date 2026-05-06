const SEV_COLOR = {
  High: "var(--red)",
  Moderate: "var(--yellow)",
  Low: "var(--green)",
};

export default function OutbreakPanel({ outbreaks = [], alertMessage = null }) {
  return (
    <div className="card">
      <div className="card-title">🌍 Active Outbreaks</div>

      {alertMessage && (
        <div className="alert alert-danger" style={{ marginBottom: 16 }}>
          {alertMessage}
        </div>
      )}

      {outbreaks.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "16px 0" }}>
          No outbreaks loaded yet. Run a symptom check to see outbreak data.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {outbreaks.map((o, i) => (
            <div key={i} style={{
              background: "var(--surface2)", borderRadius: 8, padding: "12px 14px",
              borderLeft: `3px solid ${SEV_COLOR[o.severity] || "var(--border)"}`,
              display: "flex", justifyContent: "space-between", alignItems: "flex-start"
            }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{o.disease}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  📍 {o.region} · {o.reported_date || "Ongoing"}
                </div>
                <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {(o.symptoms || []).slice(0, 5).map(s => (
                    <span key={s} style={{
                      fontSize: "0.72rem", padding: "2px 7px", borderRadius: 12,
                      background: "rgba(255,255,255,0.05)", color: "var(--text-muted)",
                      border: "1px solid var(--border)"
                    }}>{s}</span>
                  ))}
                </div>
              </div>
              <span style={{
                fontSize: "0.75rem", padding: "3px 10px", borderRadius: 12, flexShrink: 0,
                color: SEV_COLOR[o.severity],
                background: `${SEV_COLOR[o.severity]}18`,
                border: `1px solid ${SEV_COLOR[o.severity]}40`
              }}>
                {o.severity}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
