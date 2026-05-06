export default function ReportSummary({ data }) {
  if (!data) return null;

  const { summary, abnormal_parameters: abnormal, normal_parameters: normal, advice } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Summary box */}
      <div className="card">
        <div className="card-title">📋 Report Summary</div>
        <p style={{ lineHeight: 1.7 }}>{summary}</p>
      </div>

      {/* Abnormal */}
      {abnormal?.length > 0 && (
        <div className="card" style={{ borderColor: "rgba(255,82,82,0.3)" }}>
          <div className="card-title" style={{ color: "var(--red)" }}>
            ⚠ Abnormal Parameters ({abnormal.length})
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Parameter", "Value", "Reference", "Flag", "Meaning"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "var(--text-muted)", fontWeight: 500, fontSize: "0.8rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {abnormal.map((p, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>{p.parameter}</td>
                    <td style={{ padding: "10px 12px" }}>{p.value} {p.unit}</td>
                    <td style={{ padding: "10px 12px", color: "var(--text-muted)" }}>{p.reference} {p.unit}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{
                        fontSize: "0.75rem", padding: "2px 8px", borderRadius: 12,
                        background: p.flag === "HIGH" ? "rgba(255,82,82,0.1)" : "rgba(0,212,255,0.1)",
                        color: p.flag === "HIGH" ? "var(--red)" : "var(--accent)",
                        border: `1px solid ${p.flag === "HIGH" ? "rgba(255,82,82,0.3)" : "rgba(0,212,255,0.3)"}`
                      }}>{p.flag}</span>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: "var(--text-muted)" }}>{p.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Normal */}
      {normal?.length > 0 && (
        <div className="card" style={{ borderColor: "rgba(0,230,118,0.2)" }}>
          <div className="card-title" style={{ color: "var(--green)" }}>
            ✅ Normal Parameters ({normal.length})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {normal.map((p, i) => (
              <span key={i} style={{
                fontSize: "0.82rem", padding: "4px 12px", borderRadius: 20,
                background: "rgba(0,230,118,0.06)", border: "1px solid rgba(0,230,118,0.2)",
                color: "var(--green)"
              }}>
                {p.parameter}: {p.value} {p.unit}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Advice */}
      {advice && (
        <div className="alert alert-warning">{advice}</div>
      )}
    </div>
  );
}
