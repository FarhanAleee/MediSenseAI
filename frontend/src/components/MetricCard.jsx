export default function MetricCard({ icon, title, value, label }) {
  return (
    <div className="metric-card card">
      <div className="metric-card-icon">{icon}</div>
      <div className="metric-card-body">
        <div className="metric-value">{value}</div>
        <div className="metric-label">{title}</div>
        {label && <div style={{ marginTop: 8, color: "var(--text-muted)", fontSize: "0.9rem" }}>{label}</div>}
      </div>
    </div>
  );
}
