import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

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
  const { user, logout, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [formState, setFormState] = useState(initialFormState);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  
  // Statistics state
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  
  // Team registrations modal state
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [teamRegistrations, setTeamRegistrations] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

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

  // Fetch real statistics from backend
  const loadStatistics = async () => {
    try {
      const response = await api.get('/event-registration/admin/stats');
      
      if (response.data.success) {
        const { stats } = response.data;
        setTotalUsers(stats.totalRegistrations);
        setTotalRevenue(stats.totalRevenue);
        
        // Format registrations for the users modal
        const formattedUsers = stats.registrations.map((reg, index) => ({
          id: `user-${index}`,
          name: reg.name,
          email: reg.email,
          college: reg.college,
          event: reg.event,
          registrationDate: new Date(reg.registrationDate).toLocaleDateString('en-IN'),
          iiestian: reg.isIIEST,
        }));
        
        setRegisteredUsers(formattedUsers);
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
      // Set defaults if API fails
      setTotalUsers(0);
      setTotalRevenue(0);
      setRegisteredUsers([]);
    }
  };

  const loadEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await api.get(`/events/list`);
      const data = Array.isArray(response.data) ? response.data : response.data?.data ?? [];
      setEvents(data);
      setStatus({ type: "idle", message: "" });
      console.log(response);
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

  const loadAllData = async () => {
    await Promise.all([loadEvents(), loadStatistics()]);
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
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
      await api.post(`/events/create`, payload, {
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

  // Handle event click to view team registrations
  const handleEventClick = async (event) => {
    console.log("Fetching registrations for event:", event._id);
    setSelectedEvent(event);
    setShowTeamsModal(true);
    setLoadingTeams(true);
    
    try {
      const response = await api.get(`/event-registration/event/${event._id}`);
      console.log("Team registrations response:", response.data);
      
      if (response.data.success) {
        setTeamRegistrations(response.data.registrations);
        console.log("Set team registrations:", response.data.registrations);
      }
    } catch (error) {
      console.error("Error fetching team registrations:", error);
      console.error("Error response:", error.response);
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Failed to load team registrations",
      });
    } finally {
      setLoadingTeams(false);
    }
  };

  // Handle delete team registration
  const handleDeleteTeam = async (registrationId) => {
    if (!window.confirm("Are you sure you want to remove this team?")) {
      return;
    }

    try {
      const response = await api.delete(`/event-registration/${registrationId}`);

      if (response.data.success) {
        // Remove the deleted registration from the list
        setTeamRegistrations((prev) =>
          prev.filter((reg) => reg._id !== registrationId)
        );
        setStatus({
          type: "success",
          message: "Team removed successfully",
        });
        setTimeout(() => setStatus({ type: "idle", message: "" }), 3000);
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Failed to delete team",
      });
      setTimeout(() => setStatus({ type: "idle", message: "" }), 3000);
    }
  };

  return (
    <>
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

      {/* Statistics Cards */}
      <section style={styles.statsSection}>
        <div 
          style={{...styles.statCard, cursor: 'pointer'}} 
          onClick={() => setShowUsersModal(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 24px 55px -24px rgba(37, 99, 235, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 20px 45px -24px rgba(15, 23, 42, 0.9)';
          }}
        >
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{totalUsers.toLocaleString()}</h3>
            <p style={styles.statLabel}>Total Registered Users</p>
            <p style={{fontSize: '0.75rem', color: '#60a5fa', margin: '4px 0 0 0'}}>Click to view details →</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>₹{totalRevenue.toLocaleString()}</h3>
            <p style={styles.statLabel}>Total Revenue</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🎉</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{events.length}</h3>
            <p style={styles.statLabel}>Total Events</p>
          </div>
        </div>
      </section>

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
              <p style={styles.cardSubtitle}>Review and manage published events. Click on any event to view team registrations.</p>
            </div>
            <button style={styles.refreshButton} onClick={loadAllData} disabled={loadingEvents}>
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
                    <tr 
                      key={eventItem._id} 
                      style={{
                        ...styles.tr,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                      }}
                      onClick={() => handleEventClick(eventItem)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
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

      {/* Users Modal */}
      {showUsersModal && (
        <div style={styles.modalOverlay} onClick={() => setShowUsersModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Registered Users ({registeredUsers.length})</h2>
              <button 
                style={styles.modalCloseBtn} 
                onClick={() => setShowUsersModal(false)}
              >
                ×
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tr}>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>College</th>
                      <th style={styles.th}>Event</th>
                      <th style={styles.th}>Registration Date</th>
                      <th style={styles.th}>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredUsers.map((user) => (
                      <tr key={user.id} style={styles.tr}>
                        <td style={styles.td}>{user.name}</td>
                        <td style={styles.td}>{user.email}</td>
                        <td style={styles.td}>{user.college}</td>
                        <td style={styles.td}>{user.event}</td>
                        <td style={styles.td}>{user.registrationDate}</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.badge,
                            background: user.iiestian ? 'rgba(34, 197, 94, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                            color: user.iiestian ? '#86efac' : '#93c5fd',
                            border: user.iiestian ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)',
                          }}>
                            {user.iiestian ? 'IIEST' : 'External'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Registrations Modal */}
      {showTeamsModal && (
        <div style={styles.modalOverlay} onClick={() => setShowTeamsModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>
                  {selectedEvent?.name} - Team Registrations
                </h2>
                <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
                  Total Teams: {teamRegistrations.length}
                </p>
              </div>
              <button 
                style={styles.modalCloseBtn} 
                onClick={() => setShowTeamsModal(false)}
              >
                ×
              </button>
            </div>
            
            <div style={styles.modalBody}>
              {loadingTeams ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                  Loading team registrations...
                </div>
              ) : teamRegistrations.length === 0 ? (
                <div style={styles.emptyState}>
                  <h3 style={styles.emptyTitle}>No Teams Registered</h3>
                  <p style={styles.emptySubtitle}>No teams have registered for this event yet.</p>
                </div>
              ) : (
                <div style={styles.tableWrapper}>
                  {teamRegistrations.map((registration, index) => (
                    <div 
                      key={registration._id} 
                      style={{
                        marginBottom: '24px',
                        padding: '20px',
                        borderRadius: '12px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                      }}>
                        <div>
                          <h3 style={{
                            margin: 0,
                            fontSize: '18px',
                            color: '#60a5fa',
                            fontWeight: 600,
                          }}>
                            Team #{index + 1}: {registration.teamName}
                          </h3>
                          <p style={{
                            margin: '4px 0 0 0',
                            fontSize: '13px',
                            color: '#94a3b8',
                          }}>
                            Team Size: {registration.teamSize} | Registered: {new Date(registration.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteTeam(registration._id)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#fca5a5',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500,
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                          }}
                        >
                          🗑️ Remove Team
                        </button>
                      </div>

                      <table style={{
                        ...styles.table,
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}>
                        <thead>
                          <tr>
                            <th style={{...styles.th, background: 'rgba(15, 23, 42, 0.8)'}}>#</th>
                            <th style={{...styles.th, background: 'rgba(15, 23, 42, 0.8)'}}>Name</th>
                            <th style={{...styles.th, background: 'rgba(15, 23, 42, 0.8)'}}>Email</th>
                            <th style={{...styles.th, background: 'rgba(15, 23, 42, 0.8)'}}>Phone</th>
                            <th style={{...styles.th, background: 'rgba(15, 23, 42, 0.8)'}}>College</th>
                            <th style={{...styles.th, background: 'rgba(15, 23, 42, 0.8)'}}>Roll No.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registration.teamMembers.map((member, memberIndex) => (
                            <tr key={memberIndex} style={styles.tr}>
                              <td style={styles.td}>{memberIndex + 1}</td>
                              <td style={styles.td}>{member.name}</td>
                              <td style={styles.td}>{member.email}</td>
                              <td style={styles.td}>{member.phone}</td>
                              <td style={styles.td}>{member.college || '-'}</td>
                              <td style={styles.td}>
                                {member.roll ? (
                                  <span style={{
                                    ...styles.badge,
                                    background: 'rgba(34, 197, 94, 0.15)',
                                    color: '#86efac',
                                    border: '1px solid rgba(34, 197, 94, 0.3)',
                                  }}>
                                    {member.roll}
                                  </span>
                                ) : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    minWidth: "100vw",
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
    width: "90%",
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
  statsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    padding: "0 clamp(24px, 6vw, 80px)",
    marginTop: "32px",
    marginBottom: "32px",
  },
  statCard: {
    background: "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(15, 23, 42, 0.85) 100%)",
    borderRadius: "20px",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    padding: "28px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    boxShadow: "0 20px 45px -24px rgba(15, 23, 42, 0.9)",
    backdropFilter: "blur(12px)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "default",
  },
  statIcon: {
    fontSize: "3rem",
    lineHeight: 1,
    filter: "drop-shadow(0 4px 12px rgba(37, 99, 235, 0.4))",
  },
  statContent: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  statValue: {
    fontSize: "2.2rem",
    fontWeight: 700,
    margin: 0,
    color: "#e0f2fe",
    letterSpacing: "0.02em",
  },
  statLabel: {
    fontSize: "0.9rem",
    color: "#94a3b8",
    margin: 0,
    fontWeight: 500,
    letterSpacing: "0.02em",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.75)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  },
  modalContent: {
    background: "linear-gradient(160deg, #1a1f2b 0%, #0f1419 80%)",
    borderRadius: "20px",
    border: "1px solid rgba(148, 163, 184, 0.25)",
    boxShadow: "0 28px 60px rgba(0, 0, 0, 0.65)",
    maxWidth: "1200px",
    width: "100%",
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 32px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.15)",
  },
  modalTitle: {
    fontSize: "1.8rem",
    fontWeight: 700,
    margin: 0,
    color: "#90caf9",
  },
  modalCloseBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    fontSize: "28px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.3s ease",
  },
  modalBody: {
    padding: "24px 32px",
    overflowY: "auto",
    flex: 1,
  },
  tableWrapper: {
    overflowX: "auto",
  },
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
};

export default AdminDashboard;
