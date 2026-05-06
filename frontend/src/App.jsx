import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import SymptomPage from "./pages/SymptomPage";
import ReportUpload from "./pages/ReportUpload";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import { clearSession, getUser } from "./utils/auth";
import "./App.css";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  symptoms: "Symptom Checker",
  report: "Report Analyzer",
  outbreaks: "Outbreak Monitor",
  doctors: "Find Doctors",
  appointments: "Appointments",
  history: "Health History",
  settings: "Settings",
};

function DashboardLayout() {
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const username = user ? user.first_name : "Patient";
  const location = "Karachi, Pakistan";

  const handleLogout = () => {
    clearSession();
    window.location.href = "/login";
  };

  const renderPage = () => {
    if (page === "dashboard") return <Dashboard />;
    if (page === "symptoms") return <SymptomPage onNavigate={() => setPage("dashboard")} />;
    if (page === "report") return <ReportUpload />;

    return (
      <div className="card placeholder-card">
        <div className="card-title">{PAGE_TITLES[page] || "Coming Soon"}</div>
        <p className="placeholder-text">
          This section is under construction for the MediSense dashboard.
          Use the main dashboard to run symptom checks and monitor health insights.
        </p>
      </div>
    );
  };

  return (
    <div className="app-shell">
      <Sidebar activePage={page} onNavigate={setPage} userEmail={user?.email} />
      <div className="app-main">
        <Navbar location={location} username={username} onLogout={handleLogout} />
        <main className="main-content">{renderPage()}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignupPage />
            </GuestRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
