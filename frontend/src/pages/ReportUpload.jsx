import { useState, useRef } from "react";
import { analyzeReportFile, analyzeReportText } from "../services/api";
import ReportSummary from "../components/ReportSummary";

const SAMPLE_REPORT = `Complete Blood Count (CBC)
Hemoglobin: 10.2 g/dL
WBC: 13.5 ×10³/µL
RBC: 3.8 ×10⁶/µL
Platelets: 280 ×10³/µL

Metabolic Panel
Glucose (Fasting): 118 mg/dL
Creatinine: 1.4 mg/dL
ALT: 72 U/L
AST: 45 U/L
Bilirubin: 0.9 mg/dL

Lipid Profile
Total Cholesterol: 240 mg/dL
LDL: 160 mg/dL
HDL: 38 mg/dL
Triglycerides: 195 mg/dL`;

export default function ReportUpload() {
  const [tab, setTab] = useState("file"); // "file" | "text"
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const handleFile = async () => {
    if (!file) return;
    setLoading(true); setError(null);
    try {
      const data = await analyzeReportFile(file);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleText = async () => {
    if (!text.trim()) return;
    setLoading(true); setError(null);
    try {
      const data = await analyzeReportText(text);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 8 }}>
          📄 Medical Report Analyzer
        </h2>
        <p style={{ color: "var(--text-muted)" }}>
          Upload a lab report (PDF, TXT, or image) or paste text directly.
          MediSense AI will extract key values and flag abnormal parameters with plain-language explanations.
        </p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "var(--surface2)", borderRadius: 10, padding: 4, width: "fit-content" }}>
        {["file", "text"].map(t => (
          <button key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
              fontFamily: "var(--font)", fontSize: "0.9rem", fontWeight: 600,
              background: tab === t ? "var(--surface)" : "transparent",
              color: tab === t ? "var(--accent)" : "var(--text-muted)",
              transition: "all 0.2s"
            }}>
            {t === "file" ? "📁 Upload File" : "✏️ Paste Text"}
          </button>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        {tab === "file" ? (
          <div>
            {/* Drop zone */}
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${file ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 12, padding: "40px 24px", textAlign: "center",
                cursor: "pointer", transition: "all 0.2s",
                background: file ? "rgba(0,212,255,0.04)" : "transparent"
              }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{file ? "📄" : "⬆"}</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                {file ? file.name : "Click or drag & drop a report"}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Supports PDF, TXT, and image files (PNG, JPG, BMP, TIFF)
              </div>
              <input ref={fileRef} type="file" accept=".pdf,.txt,.png,.jpg,.jpeg,.bmp,.tiff" hidden
                onChange={e => setFile(e.target.files[0])} />
            </div>

            <button className="btn btn-primary" onClick={handleFile}
              disabled={!file || loading}
              style={{ marginTop: 16, width: "100%", justifyContent: "center" }}>
              {loading ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Analyzing…</> : "🔬 Analyze Report"}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                Report Text
              </label>
              <button style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.82rem" }}
                onClick={() => setText(SAMPLE_REPORT)}>
                Load Sample Report
              </button>
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)}
              rows={12} style={{ width: "100%", fontFamily: "var(--mono)", fontSize: "0.82rem", lineHeight: 1.6 }}
              placeholder="Paste your lab report text here… e.g. Hemoglobin: 10.2 g/dL, WBC: 13.5 ×10³/µL…" />
            <button className="btn btn-primary" onClick={handleText}
              disabled={!text.trim() || loading}
              style={{ marginTop: 12, width: "100%", justifyContent: "center" }}>
              {loading ? <><span className="spinner" style={{ width: 18, height: 18 }} /> Analyzing…</> : "🔬 Analyze Text"}
            </button>
          </div>
        )}
      </div>

      {error && <div className="alert alert-danger" style={{ marginBottom: 20 }}>{error}</div>}

      {result && <ReportSummary data={result} />}
    </div>
  );
}
