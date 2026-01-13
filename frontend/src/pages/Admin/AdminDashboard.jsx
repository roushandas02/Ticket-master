import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const API_BASE_URL = "http://localhost:5000";

const initialFormState = {
  name: "",
  date: "",
  prize: "",
  description: "",
  tags: "",
  venue: "",
  fees: "",
  teamSize: "",
  rules: "",
  image: null,
};

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [formState, setFormState] = useState(initialFormState);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (!isAdmin) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const loadEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events/list`);
      const data = Array.isArray(response.data) ? response.data : response.data?.data ?? [];
      setEvents(data);
      setStatus({ type: "idle", message: "" });
    } catch (error) {
      console.error("Failed to load events", error);
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Unable to fetch events. Please try again.",
      });
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setFormState((prev) => ({ ...prev, image: file }));
  };

  const resetForm = () => {
    setFormState(initialFormState);
  };

  const handleCreateEvent = async (event) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    if (!formState.image) {
      setStatus({ type: "error", message: "Event image is required." });
      return;
    }

    const payload = new FormData();
    payload.append("name", formState.name);
    payload.append("date", formState.date);
    payload.append("prize", formState.prize);
    payload.append("description", formState.description);
    payload.append("venue", formState.venue);
    payload.append("fees", formState.fees);
    payload.append("teamSize", formState.teamSize);
    payload.append("image", formState.image);

    const tagsArray = formState.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const rulesArray = formState.rules
      .split("\n")
      .map((rule) => rule.trim())
      .filter(Boolean);

    tagsArray.forEach((tag) => payload.append("tags", tag));
    rulesArray.forEach((rule) => payload.append("rules", rule));

    setCreatingEvent(true);

    try {
      await axios.post(`${API_BASE_URL}/api/events/create`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus({ type: "success", message: "Event created successfully." });
      resetForm();
      await loadEvents();
    } catch (error) {
      console.error("Event creation failed", error);
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Unable to create event. Please try again.",
      });
    } finally {
      setCreatingEvent(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
        <div style={styles.headerContent}>
          <span style={styles.welcomeText}>Signed in as {user?.name ?? "Admin"}</span>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Manage events and keep your community informed.</p>
        </div>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </header>

        <main style={styles.mainContent}>
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>Create Event</h2>
              <p style={styles.cardSubtitle}>Publish a new event to the platform.</p>
            </div>
          </div>

          {status.type !== "idle" && (
            <div
              style={{
                ...styles.statusBanner,
                ...(status.type === "error" ? styles.statusError : {}),
                ...(status.type === "success" ? styles.statusSuccess : {}),
              }}
            >
              {status.message}
            </div>
          )}

          <form style={styles.form} onSubmit={handleCreateEvent}>
            <div style={styles.formRow}>
              <label style={styles.label} htmlFor="name">
                Event Name*
              </label>
              <input
                style={styles.input}
                id="name"
                name="name"
                placeholder="Enter event name"
                value={formState.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div style={styles.formGrid}>
              <div style={styles.formRow}>
                <label style={styles.label} htmlFor="date">
                  Date*
                </label>
                <input
                  style={styles.input}
                  id="date"
                  name="date"
                  type="datetime-local"
                  value={formState.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.label} htmlFor="venue">
                  Venue*
                </label>
                <input
                  style={styles.input}
                  id="venue"
                  name="venue"
                  placeholder="Main Auditorium"
                  value={formState.venue}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div style={styles.formGrid}>
              <div style={styles.formRow}>
                <label style={styles.label} htmlFor="fees">
                  Registration Fees*
                </label>
                <input
                  style={styles.input}
                  id="fees"
                  name="fees"
                  placeholder="Rs. 200"
                  value={formState.fees}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.label} htmlFor="teamSize">
                  Team Size*
                </label>
                <input
                  style={styles.input}
                  id="teamSize"
                  name="teamSize"
                  placeholder="1-4"
                  value={formState.teamSize}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div style={styles.formGrid}>
              <div style={styles.formRow}>
                <label style={styles.label} htmlFor="prize">
                  Prize Pool*
                </label>
                <input
                  style={styles.input}
                  id="prize"
                  name="prize"
                  placeholder="Rs. 10,000"
                  value={formState.prize}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={styles.formRow}>
                <label style={styles.label} htmlFor="tags">
                  Tags (comma separated)
                </label>
                <input
                  style={styles.input}
                  id="tags"
                  name="tags"
                  placeholder="tech, workshop, robotics"
                  value={formState.tags}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <label style={styles.label} htmlFor="description">
                Description*
              </label>
              <textarea
                style={{ ...styles.input, minHeight: 120, resize: "vertical" }}
                id="description"
                name="description"
                placeholder="Write a compelling description for your event."
                value={formState.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div style={styles.formRow}>
              <label style={styles.label} htmlFor="rules">
                Rules (one per line)
              </label>
              <textarea
                style={{ ...styles.input, minHeight: 100, resize: "vertical" }}
                id="rules"
                name="rules"
                placeholder={"Enter each rule on a new line."}
                value={formState.rules}
                onChange={handleInputChange}
              />
            </div>

            <div style={styles.formRow}>
              <label style={styles.label} htmlFor="image">
                Event Banner*
              </label>
              <input
                style={styles.fileInput}
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>

            <div style={styles.formActions}>
              <button type="button" style={styles.secondaryButton} onClick={resetForm} disabled={creatingEvent}>
                Reset
              </button>
              <button type="submit" style={styles.primaryButton} disabled={creatingEvent}>
                {creatingEvent ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>Upcoming Events</h2>
              <p style={styles.cardSubtitle}>Review and manage published events.</p>
            </div>
            <button style={styles.refreshButton} onClick={loadEvents} disabled={loadingEvents}>
              {loadingEvents ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {events.length === 0 ? (
            <div style={styles.emptyState}>
              <h3 style={styles.emptyTitle}>No events found</h3>
              <p style={styles.emptySubtitle}>Create your first event to see it listed here.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Venue</th>
                    <th style={styles.th}>Team Size</th>
                    <th style={styles.th}>Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((eventItem) => (
                    <tr key={eventItem._id} style={styles.tr}>
                      <td style={styles.td}>{eventItem.name}</td>
                      <td style={styles.td}>
                        {eventItem.date ? new Date(eventItem.date).toLocaleString() : "TBD"}
                      </td>
                      <td style={styles.td}>{eventItem.venue}</td>
                      <td style={styles.td}>{eventItem.teamSize}</td>
                      <td style={styles.td}>{eventItem.fees}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        </main>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(160deg, #0f172a 0%, #020617 60%, #000)",
    color: "#f8fafc",
    padding: "48px 48px 64px",
    boxSizing: "border-box",
  },
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "24px",
  },
  headerContent: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  title: {
    fontSize: "36px",
    margin: 0,
    fontWeight: 700,
  },
  subtitle: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "15px",
  },
  welcomeText: {
    color: "#cbd5f5",
    fontSize: "14px",
    opacity: 0.75,
  },
  logoutButton: {
    padding: "12px 20px",
    borderRadius: "12px",
    border: "1px solid rgba(148, 163, 184, 0.4)",
    background: "rgba(15, 23, 42, 0.82)",
    color: "#f8fafc",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },
  mainContent: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(540px, 1fr))",
    gap: "28px",
    alignItems: "start",
  },
  card: {
    background: "rgba(15, 23, 42, 0.75)",
    borderRadius: "20px",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    padding: "24px",
    boxShadow: "0 20px 45px -24px rgba(15, 23, 42, 0.9)",
    backdropFilter: "blur(12px)",
    width: "100%",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  cardTitle: {
    fontSize: "22px",
    fontWeight: 600,
    marginBottom: "4px",
  },
  cardSubtitle: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },
  statusBanner: {
    borderRadius: "12px",
    padding: "12px 16px",
    marginBottom: "16px",
    background: "rgba(59, 130, 246, 0.1)",
    color: "#bfdbfe",
    fontSize: "14px",
  },
  statusError: {
    background: "rgba(239, 68, 68, 0.12)",
    color: "#fecaca",
  },
  statusSuccess: {
    background: "rgba(34, 197, 94, 0.12)",
    color: "#bbf7d0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px",
  },
  formRow: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    color: "#cbd5f5",
    fontWeight: 500,
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(148, 163, 184, 0.4)",
    background: "rgba(2, 6, 23, 0.75)",
    color: "#f8fafc",
    fontSize: "14px",
  },
  fileInput: {
    padding: "10px",
    borderRadius: "10px",
    border: "1px dashed rgba(148, 163, 184, 0.5)",
    background: "rgba(2, 6, 23, 0.6)",
    color: "#cbd5f5",
    cursor: "pointer",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "8px",
  },
  primaryButton: {
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#f8fafc",
    cursor: "pointer",
    fontWeight: 600,
  },
  secondaryButton: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "1px solid rgba(148, 163, 184, 0.4)",
    background: "transparent",
    color: "#f8fafc",
    cursor: "pointer",
  },
  refreshButton: {
    padding: "10px 18px",
    borderRadius: "999px",
    border: "1px solid rgba(148, 163, 184, 0.4)",
    background: "rgba(2, 6, 23, 0.6)",
    color: "#e2e8f0",
    cursor: "pointer",
  },
  emptyState: {
    textAlign: "center",
    padding: "48px 24px",
    borderRadius: "16px",
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px dashed rgba(148, 163, 184, 0.3)",
  },
  emptyTitle: {
    fontSize: "18px",
    marginBottom: "8px",
    fontWeight: 600,
  },
  emptySubtitle: {
    color: "#94a3b8",
    fontSize: "14px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "640px",
  },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "#94a3b8",
    borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
  },
  tr: {
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
  },
  td: {
    padding: "14px 16px",
    fontSize: "14px",
    color: "#e2e8f0",
  },
};

export default AdminDashboard;
