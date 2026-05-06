const CONFIG = {
  mild: { label: "MILD", color: "var(--green)", icon: "✅", bg: "rgba(0,230,118,0.08)", border: "rgba(0,230,118,0.25)" },
  moderate: { label: "MODERATE", color: "var(--yellow)", icon: "⚠️", bg: "rgba(255,215,64,0.08)", border: "rgba(255,215,64,0.25)" },
  high: { label: "HIGH", color: "var(--red)", icon: "🚨", bg: "rgba(255,82,82,0.08)", border: "rgba(255,82,82,0.25)" },
};

export default function RiskIndicator({ riskLevel, factors = [], score }) {
  if (!riskLevel) return null;
  const cfg = CONFIG[riskLevel] || CONFIG.mild;

  return (
    <div className="card" style={{ borderColor: cfg.border, background: cfg.bg }}>
      <div className="card-title">🚦 Risk Level</div>

      {/* Big indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <div style={{ fontSize: "2.5rem" }}>{cfg.icon}</div>
        <div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: cfg.color, letterSpacing: "2px" }}>
            {cfg.label}
          </div>
          {score !== undefined && (
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Risk score: {(score * 100).toFixed(0)}/100
            </div>
          )}
        </div>
      </div>

      {/* Score bar */}
      {score !== undefined && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 4,
              width: `${score * 100}%`,
              background: cfg.color,
              transition: "width 0.8s ease"
            }} />
          </div>
        </div>
      )}

      {/* Factors */}
      {factors.length > 0 && (
        <div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "1px" }}>
            Risk Factors
          </div>
          <ul style={{ paddingLeft: 16, display: "flex", flexDirection: "column", gap: 4 }}>
            {factors.map((f, i) => (
              <li key={i} style={{ fontSize: "0.88rem", color: "var(--text)" }}>{f}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
