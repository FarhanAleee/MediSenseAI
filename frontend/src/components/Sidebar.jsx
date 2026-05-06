const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "symptoms", label: "Symptom Checker", icon: "🩺" },
  { id: "report", label: "Report Analyzer", icon: "📄" },
  { id: "outbreaks", label: "Outbreak Monitor", icon: "🌍" },
  { id: "doctors", label: "Find Doctors", icon: "🏥" },
  { id: "appointments", label: "Appointments", icon: "📅" },
  { id: "history", label: "Health History", icon: "📘" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar({ activePage, onNavigate, userEmail }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        MediSense <span>AI</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-link ${activePage === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
            type="button"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        {userEmail ? `Signed in as ${userEmail}` : "Sign in to unlock your full health history."}
      </div>
    </aside>
  );
}
