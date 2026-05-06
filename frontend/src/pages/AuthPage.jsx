import { useState } from "react";
import { login, signup } from "../services/api";

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const data = mode === "login" ? await login({ email, password }) : await signup({ email, password });
      setMessage(data.message);
      onAuthSuccess(data.email);
    } catch (err) {
      setError(err.message || "Unable to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 8, color: "#0c4da2" }}>
          Welcome to MediSense AI
        </h2>
        <p style={{ color: "#516d91", lineHeight: 1.7 }}>
          Sign up to keep your healthcare workflow organized, or log in to access personalized health analysis and report uploads.
          MediSense AI is a secure, PostgreSQL-backed medical intelligence platform built for educational health insights.
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
        {[
          { key: "login", label: "Login" },
          { key: "signup", label: "Sign Up" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => { setMode(item.key); setError(null); setMessage(null); }}
            className={mode === item.key ? "btn btn-primary" : "btn btn-secondary"}
            style={{ minWidth: 120 }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="card">
        <div style={{ display: "grid", gap: 18 }}>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a secure password"
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-info">{message}</div>}

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!email || !password || loading}
            style={{ width: "100%" }}
          >
            {loading ? "Processing…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: "center", color: "#516d91" }}>
        <p style={{ maxWidth: 520, margin: "0 auto" }}>
          This project uses a PostgreSQL database on the backend to store user accounts securely and keep medical reports available for future analysis.
          The login flow is designed for a realistic web app experience while keeping the focus on intelligent health insights.
        </p>
      </div>
    </div>
  );
}
