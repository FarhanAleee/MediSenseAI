export default function Navbar({ location, username, onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-badge">📍 {location}</div>
      </div>
      <div className="topbar-right">
        <div className="notification-pill">🔔 2 new alerts</div>
        <div className="profile-chip">
          <div className="profile-avatar">{username?.charAt(0).toUpperCase()}</div>
          <div>
            <div>{username}</div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Patient Account</div>
          </div>
        </div>
        <button className="btn btn-secondary" type="button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
