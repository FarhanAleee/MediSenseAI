export default function DoctorList({ doctors = [] }) {
  if (!doctors.length) return (
    <div className="card">
      <div className="card-title">🏥 Doctor Recommendations</div>
      <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "24px 0" }}>
        No specific doctor recommendations — risk level appears mild.<br />
        Consult your general physician if symptoms persist.
      </p>
    </div>
  );

  return (
    <div className="card">
      <div className="card-title">🏥 Doctor Recommendations</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {doctors.map((doc, i) => (
          <div key={i} style={{
            background: "var(--surface2)", borderRadius: 8, padding: "14px 16px",
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            border: "1px solid var(--border)"
          }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>{doc.name}</div>
              <div style={{
                display: "inline-block", fontSize: "0.75rem", padding: "2px 8px",
                background: "rgba(0,212,255,0.1)", color: "var(--accent)",
                borderRadius: 20, marginBottom: 6, border: "1px solid rgba(0,212,255,0.2)"
              }}>
                {doc.specialization}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                🏨 {doc.hospital}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                📍 {doc.city}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <a href={`tel:${doc.contact}`} style={{
                color: "var(--accent)", textDecoration: "none", fontSize: "0.85rem",
                display: "block", marginBottom: 6
              }}>
                📞 {doc.contact}
              </a>
              <span style={{
                fontSize: "0.75rem", padding: "2px 8px", borderRadius: 12,
                background: doc.available ? "rgba(0,230,118,0.1)" : "rgba(255,82,82,0.1)",
                color: doc.available ? "var(--green)" : "var(--red)",
                border: `1px solid ${doc.available ? "rgba(0,230,118,0.25)" : "rgba(255,82,82,0.25)"}`
              }}>
                {doc.available ? "✓ Available" : "Unavailable"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
