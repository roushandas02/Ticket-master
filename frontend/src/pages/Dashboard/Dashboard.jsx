import { useState } from "react";

export default function Dashboard() {
  const tabs = [
    { id: "registrations", label: "My Registrations" },
    { id: "tickets", label: "My Tickets" },
    { id: "submissions", label: "My Submissions" },
    { id: "teams", label: "My Teams" },
    { id: "profile", label: "My Profile" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const styles = {
    page: {
      minHeight: "100vh",
      width: "100vw",
      background: "radial-gradient(circle at top, #1f2430 0%, #121419 55%, #0a0b0e 100%)",
      padding: 0,
      fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: "#f5f7fa",
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      boxSizing: "border-box",
    },
    shell: {
      display: "grid",
      gridTemplateColumns: "minmax(260px, 320px) minmax(0, 1fr)",
      gap: "32px",
      width: "100%",
      flex: 1,
      padding: "48px clamp(24px, 5vw, 64px)",
      boxSizing: "border-box",
    },
    sidebar: {
      background: "linear-gradient(180deg, rgba(24, 27, 36, 0.96) 0%, rgba(16, 18, 25, 0.88) 100%)",
      borderRadius: "22px",
      padding: "28px 24px",
      border: "1px solid rgba(255, 255, 255, 0.03)",
      boxShadow: "0 24px 50px -28px rgba(7, 14, 35, 0.6)",
      backdropFilter: "blur(28px)",
      display: "flex",
      flexDirection: "column",
      gap: "18px",
    },
    tabButton: isActive => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      padding: "14px 16px",
      borderRadius: "14px",
      background: isActive ? "linear-gradient(135deg, rgba(64, 147, 255, 0.25), rgba(64, 147, 255, 0.05))" : "transparent",
      border: isActive ? "1px solid rgba(64, 147, 255, 0.45)" : "1px solid transparent",
      color: isActive ? "#bcd9ff" : "#c0cad9",
      fontSize: "0.95rem",
      fontWeight: isActive ? 600 : 500,
      letterSpacing: "0.24px",
      cursor: "pointer",
      transition: "all 0.25s ease",
      backdropFilter: isActive ? "blur(12px)" : undefined,
    }),
    main: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      height: "100%",
    },
    mainCard: {
      background: "rgba(16, 19, 28, 0.88)",
      borderRadius: "22px",
      padding: "28px",
      border: "1px solid rgba(255, 255, 255, 0.04)",
      boxShadow: "0 30px 65px -32px rgba(10, 17, 40, 0.75)",
      backdropFilter: "blur(24px)",
    },
    statGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
      gap: "18px",
    },
    statCard: accent => ({
      padding: "18px",
      borderRadius: "18px",
      background: `linear-gradient(135deg, ${accent} 0%, rgba(21, 24, 33, 0.68) 100%)`,
      border: "1px solid rgba(255, 255, 255, 0.06)",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      minHeight: "130px",
    }),
    subtleText: {
      color: "#8b97ad",
      fontSize: "0.82rem",
      letterSpacing: "0.18px",
    },
    chip: color => ({
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 12px",
      borderRadius: "999px",
      fontSize: "0.78rem",
      fontWeight: 600,
      letterSpacing: "0.22px",
      color,
      background: `${color}1e`,
    }),
    list: {
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      marginTop: "16px",
    },
    listItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "16px",
      padding: "18px",
      borderRadius: "16px",
      background: "rgba(24, 28, 40, 0.62)",
      border: "1px solid rgba(255, 255, 255, 0.04)",
    },
  };

  const summaryStats = [
    { label: "Active Tickets", value: 4, accent: "rgba(82, 142, 255, 0.65)" },
    { label: "Upcoming Deadlines", value: 3, accent: "rgba(255, 121, 198, 0.55)" },
    { label: "Team Invites", value: 2, accent: "rgba(116, 254, 192, 0.52)" },
    { label: "Pending Reviews", value: 5, accent: "rgba(255, 198, 106, 0.55)" },
  ];

  const renderRegistrations = () => (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.8rem", letterSpacing: "0.4px" }}>My Event Registrations</h2>
          <p style={styles.subtleText}>Stay on top of every event you are part of.</p>
        </div>
        <button
          type="button"
          style={{
            padding: "12px 20px",
            borderRadius: 14,
            border: "1px solid rgba(64,147,255,0.35)",
            background: "linear-gradient(135deg, rgba(64,147,255,0.28), rgba(64,147,255,0.12))",
            color: "#dbe9ff",
            fontWeight: 600,
            letterSpacing: "0.28px",
            cursor: "pointer",
          }}
        >
          Browse Events
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
          marginTop: 28,
        }}
      >
        {[
          { title: "Tech Symposium 2025", status: "Confirmed", date: "12 Feb 2025", category: "Conference" },
          { title: "Innovation Hackathon", status: "Payment Pending", date: "24 Mar 2025", category: "Hackathon" },
          { title: "Design Sprint", status: "Waitlisted", date: "09 Apr 2025", category: "Workshop" },
        ].map(event => (
          <div
            key={event.title}
            style={{
              padding: "20px",
              borderRadius: "18px",
              background: "rgba(22, 26, 37, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.04)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <span style={{ ...styles.subtleText, textTransform: "uppercase", letterSpacing: "0.32px" }}>{event.category}</span>
            <h3 style={{ margin: 0, fontSize: "1.2rem", letterSpacing: "0.24px", color: "#f4f7fd" }}>{event.title}</h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#9aa6bd", fontSize: "0.9rem" }}>{event.date}</span>
              <span
                style={styles.chip(
                  event.status === "Confirmed"
                    ? "#52f5a7"
                    : event.status === "Payment Pending"
                    ? "#ffd76b"
                    : "#ff8fa2"
                )}
              >
                {event.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderTickets = () => (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.8rem", letterSpacing: "0.4px" }}>My Tickets</h2>
          <p style={styles.subtleText}>Access QR codes and keep track of entry windows.</p>
        </div>
        <button
          type="button"
          style={{
            padding: "12px 20px",
            borderRadius: 14,
            border: "1px solid rgba(116,254,192,0.35)",
            background: "linear-gradient(135deg, rgba(116,254,192,0.28), rgba(116,254,192,0.12))",
            color: "#dbffee",
            fontWeight: 600,
            letterSpacing: "0.28px",
            cursor: "pointer",
          }}
        >
          Download All
        </button>
      </div>

      <div style={styles.list}>
        {[
          { name: "Tech Symposium", gate: "Hall B", window: "09:00 - 09:45", seat: "Row C, Seat 12" },
          { name: "Startup Pitch Night", gate: "Auditorium", window: "18:30 - 19:10", seat: "Row A, Seat 4" },
          { name: "After Party", gate: "Sky Lounge", window: "21:00 - 23:00", seat: "Free Access" },
        ].map(ticket => (
          <div key={ticket.name} style={styles.listItem}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#eef3ff" }}>{ticket.name}</h3>
              <div style={{ display: "flex", gap: "18px", marginTop: "6px", color: "#8e9bb0", fontSize: "0.87rem" }}>
                <span>Gate: {ticket.gate}</span>
                <span>Window: {ticket.window}</span>
                <span>Seat: {ticket.seat}</span>
              </div>
            </div>
            <button
              type="button"
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                border: "1px solid rgba(123, 167, 255, 0.3)",
                background: "rgba(32, 42, 68, 0.6)",
                color: "#d8e4ff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              View QR
            </button>
          </div>
        ))}
      </div>
    </>
  );

  const renderSubmissions = () => (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.8rem", letterSpacing: "0.4px" }}>My Submissions</h2>
          <p style={styles.subtleText}>Check status updates and reviewer feedback.</p>
        </div>
        <button
          type="button"
          style={{
            padding: "12px 20px",
            borderRadius: 14,
            border: "1px solid rgba(255,198,106,0.35)",
            background: "linear-gradient(135deg, rgba(255,198,106,0.24), rgba(255,198,106,0.08))",
            color: "#ffe6c3",
            fontWeight: 600,
            letterSpacing: "0.28px",
            cursor: "pointer",
          }}
        >
          New Submission
        </button>
      </div>

      <div style={styles.list}>
        {[
          {
            title: "AI for Social Good",
            event: "Innovation Hackathon",
            status: "Under Review",
            updated: "Updated 2 days ago",
          },
          {
            title: "Redesigning Campus Experience",
            event: "Design Sprint",
            status: "Feedback Available",
            updated: "Updated 6 hours ago",
          },
          {
            title: "Solar-Powered Mobility",
            event: "Green Challenge",
            status: "Accepted",
            updated: "Updated 1 hour ago",
          },
        ].map(entry => (
          <div key={entry.title} style={{ ...styles.listItem, alignItems: "flex-start" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#f2f5ff" }}>{entry.title}</h3>
              <p style={{ ...styles.subtleText, marginTop: 6 }}>{entry.event}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
              <span
                style={styles.chip(
                  entry.status === "Accepted"
                    ? "#5df2a7"
                    : entry.status === "Under Review"
                    ? "#6aa7ff"
                    : "#ffd76b"
                )}
              >
                {entry.status}
              </span>
              <span style={{ ...styles.subtleText, fontSize: "0.78rem" }}>{entry.updated}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderTeams = () => (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.8rem", letterSpacing: "0.4px" }}>My Teams</h2>
          <p style={styles.subtleText}>Collaborate with teammates and manage roles.</p>
        </div>
        <button
          type="button"
          style={{
            padding: "12px 20px",
            borderRadius: 14,
            border: "1px solid rgba(94,132,255,0.38)",
            background: "linear-gradient(135deg, rgba(94,132,255,0.24), rgba(94,132,255,0.08))",
            color: "#d9e1ff",
            fontWeight: 600,
            letterSpacing: "0.28px",
            cursor: "pointer",
          }}
        >
          Create Team
        </button>
      </div>

      <div style={styles.list}>
        {[
          { name: "Quantum Pixels", role: "Team Lead", members: ["You", "Aisha", "Ravi", "Noah"] },
          { name: "Neural Nomads", role: "Developer", members: ["You", "Sofia", "Liam"] },
          { name: "Design Cadence", role: "Designer", members: ["You", "Mia", "Ethan", "Olivia", "Kai"] },
        ].map(team => (
          <div key={team.name} style={{ ...styles.listItem, flexDirection: "column", alignItems: "stretch", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#eef2ff" }}>{team.name}</h3>
              <span style={styles.chip("#6aa7ff")}>{team.role}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#8e9bb0" }}>
              <span style={{ fontSize: "0.85rem" }}>Members</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {team.members.map(member => (
                  <span
                    key={member}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      background: "rgba(46, 57, 82, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.04)",
                      fontSize: "0.8rem",
                      color: "#b9c6dd",
                    }}
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderProfile = () => (
    <>
      <h2 style={{ margin: 0, fontSize: "1.8rem", letterSpacing: "0.4px" }}>My Profile</h2>
      <p style={styles.subtleText}>Personal details, preferences, and contact information.</p>

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 24,
        }}
      >
        <div style={{ ...styles.mainCard, background: "rgba(22, 26, 37, 0.7)" }}>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Contact</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <span style={styles.subtleText}>Email</span>
              <p style={{ margin: "6px 0 0", fontWeight: 600 }}>alex.morgan@example.com</p>
            </div>
            <div>
              <span style={styles.subtleText}>Phone</span>
              <p style={{ margin: "6px 0 0", fontWeight: 600 }}>+91 98765 43210</p>
            </div>
            <div>
              <span style={styles.subtleText}>Location</span>
              <p style={{ margin: "6px 0 0", fontWeight: 600 }}>Kolkata, India</p>
            </div>
          </div>
        </div>
        <div style={{ ...styles.mainCard, background: "rgba(22, 26, 37, 0.7)" }}>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Preferences</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Notifications", value: "Enabled for all events" },
              { label: "Privacy", value: "Show profile to teammates" },
              { label: "Timezone", value: "IST (UTC +5:30)" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#9aa6bd" }}>{item.label}</span>
                <span style={{ fontWeight: 600, color: "#f0f4ff" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "registrations":
        return renderRegistrations();
      case "tickets":
        return renderTickets();
      case "submissions":
        return renderSubmissions();
      case "teams":
        return renderTeams();
      case "profile":
        return renderProfile();
      default:
        return null;
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <aside style={styles.sidebar}>
          <div>
            <span style={{ ...styles.subtleText, textTransform: "uppercase", letterSpacing: "0.4px" }}>Dashboard</span>
            <h1 style={{ margin: "12px 0 0", fontSize: "1.65rem", letterSpacing: "0.38px" }}>Welcome back, Alex!</h1>
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {tabs.map(tab => (
              <button key={tab.id} type="button" style={styles.tabButton(tab.id === activeTab)} onClick={() => setActiveTab(tab.id)}>
                <span>{tab.label}</span>
                <span style={{ fontSize: "0.8rem", opacity: tab.id === activeTab ? 0.9 : 0.65 }}>→</span>
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: "auto",
              padding: "18px",
              borderRadius: "18px",
              background: "linear-gradient(145deg, rgba(64,147,255,0.25), rgba(64,147,255,0.05))",
              border: "1px solid rgba(64,147,255,0.28)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <strong style={{ fontSize: "1.05rem", color: "#d6e6ff" }}>Need help?</strong>
            <span style={{ ...styles.subtleText, lineHeight: 1.5 }}>
              Browse the knowledge base or chat with support for quick assistance.
            </span>
            <button
              type="button"
              style={{
                marginTop: 6,
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(214,230,255,0.24)",
                background: "rgba(27, 33, 49, 0.55)",
                color: "#dfecff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Contact Support
            </button>
          </div>
        </aside>

        <main style={styles.main}>
          <section style={styles.mainCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.6rem", letterSpacing: "0.32px" }}>Today&apos;s Snapshot</h2>
                <p style={styles.subtleText}>A quick overview of what needs your attention right now.</p>
              </div>
              <button
                type="button"
                style={{
                  padding: "10px 18px",
                  borderRadius: 12,
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  background: "rgba(31, 36, 49, 0.55)",
                  color: "#d8e5ff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Refresh
              </button>
            </div>
            <div style={styles.statGrid}>
              {summaryStats.map(stat => (
                <div key={stat.label} style={styles.statCard(stat.accent)}>
                  <span style={styles.subtleText}>{stat.label}</span>
                  <strong style={{ fontSize: "2rem", letterSpacing: "0.32px" }}>{stat.value}</strong>
                  <span style={{ fontSize: "0.78rem", color: "#ced7ea" }}>Updated just now</span>
                </div>
              ))}
            </div>
          </section>

          <section style={{ ...styles.mainCard, minHeight: "420px" }}>{renderContent()}</section>
        </main>
      </div>
    </div>
  );
}
