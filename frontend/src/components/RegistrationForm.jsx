import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";


export default function RegistrationForm({ event, onClose, onSuccess }) {
  const { user } = useContext(AuthContext);
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState(event.min_team_size || 1);
  const navigate = useNavigate();

  
  // Initialize team members array - first member with user data, others empty
  const initializeTeamMembers = () => {
    const initialSize = event.min_team_size || 1;
    return Array.from({ length: initialSize }, (_, index) => {
      if (index === 0) {
        // First member - pre-fill with user data
        return {
          name: user?.name || "",
          email: user?.email || "",
          phone: "",
          college: user?.college || "",
          roll: user?.roll || "",
        };
      } else {
        // Other members - empty
        return {
          name: "",
          email: "",
          phone: "",
          college: "",
          roll: "",
        };
      }
    });
  };
  
  const [teamMembers, setTeamMembers] = useState(initializeTeamMembers());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTeamSizeChange = (newSize) => {
    const size = parseInt(newSize);
    setTeamSize(size);

    // Adjust team members array
    const currentMembers = [...teamMembers];
    if (size > currentMembers.length) {
      // Add new members - empty fields
      for (let i = currentMembers.length; i < size; i++) {
        currentMembers.push({
          name: "",
          email: "",
          phone: "",
          college: "",
          roll: "",
        });
      }
    } else if (size < currentMembers.length) {
      // Remove extra members
      currentMembers.splice(size);
    }
    setTeamMembers(currentMembers);
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index][field] = value;
    setTeamMembers(updatedMembers);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");

    if (!teamName.trim()) {
      setError("Team name is required");
      return;
    }

    for (let i = 0; i < teamMembers.length; i++) {
      const member = teamMembers[i];
      if (!member.name.trim() || !member.email.trim() || !member.phone.trim()) {
        setError(`Please fill all required fields for member ${i + 1}`);
        return;
      }
      if (!member.college && !member.roll) {
        setError(`Please provide either college or roll number for member ${i + 1}`);
        return;
      }
    }

    // Navigate to payment page instead of saving
    onClose();

    setTimeout(() => {
      navigate("/payment", {
        state: {
          eventId: event._id,
          eventName: event.name,
          amount: event.fees || event.fee,
          teamName,
          teamSize,
          teamMembers,
        },
      });
    }, 0);

  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button type="button" style={styles.closeBtn} onClick={onClose}>
          ×
        </button>

        <h2 style={styles.title}>Register for {event.name}</h2>
        <p style={styles.subtitle}>
          Fill in your team details to complete registration
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Team Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Team Name *</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team name"
              style={styles.input}
              required
            />
          </div>

          {/* Team Size */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Team Size * (Min: {event.min_team_size}, Max: {event.max_team_size})
            </label>
            <select
              value={teamSize}
              onChange={(e) => handleTeamSizeChange(e.target.value)}
              style={styles.input}
              required
            >
              {Array.from(
                { length: event.max_team_size - event.min_team_size + 1 },
                (_, i) => event.min_team_size + i
              ).map((size) => (
                <option key={size} value={size}>
                  {size} {size === 1 ? "member" : "members"}
                </option>
              ))}
            </select>
          </div>

          {/* Team Members */}
          <div style={styles.membersSection}>
            <h3 style={styles.sectionTitle}>Team Members</h3>
            {teamMembers.map((member, index) => (
              <div key={index} style={styles.memberCard}>
                <h4 style={styles.memberTitle}>
                  Member {index + 1} {index === 0 && "(You)"}
                </h4>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Name *</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) =>
                        handleMemberChange(index, "name", e.target.value)
                      }
                      placeholder="Full name"
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email *</label>
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) =>
                        handleMemberChange(index, "email", e.target.value)
                      }
                      placeholder="email@example.com"
                      style={styles.input}
                      required
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Phone *</label>
                    <input
                      type="tel"
                      value={member.phone}
                      onChange={(e) =>
                        handleMemberChange(index, "phone", e.target.value)
                      }
                      placeholder="10-digit phone number"
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>College</label>
                    <input
                      type="text"
                      value={member.college}
                      onChange={(e) =>
                        handleMemberChange(index, "college", e.target.value)
                      }
                      placeholder="College name"
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Roll Number (IIEST Students)</label>
                  <input
                    type="text"
                    value={member.roll}
                    onChange={(e) =>
                      handleMemberChange(
                        index,
                        "roll",
                        e.target.value.toUpperCase()
                      )
                    }
                    placeholder="e.g., 2021CSB062"
                    style={styles.input}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Fee Info */}
          <div style={styles.feeInfo}>
            <strong>Registration Fee:</strong> {event.fees || event.fee}
          </div>

          {/* Submit Button */}
          <div style={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelBtn}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? "Registering..." : "Complete Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.75)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
    overflowY: "auto",
  },
  modal: {
    background: "linear-gradient(160deg, #1a1f2b 0%, #0f1419 80%)",
    borderRadius: "20px",
    border: "1px solid rgba(144, 202, 249, 0.25)",
    boxShadow: "0 28px 60px rgba(0, 0, 0, 0.65)",
    padding: "32px",
    maxWidth: "720px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
    color: "#f5f7fa",
  },
  closeBtn: {
    position: "absolute",
    top: "16px",
    right: "16px",
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
  title: {
    fontSize: "1.8rem",
    fontWeight: 700,
    margin: "0 0 8px 0",
    color: "#90caf9",
  },
  subtitle: {
    color: "#b0bec5",
    margin: "0 0 24px 0",
    fontSize: "0.95rem",
  },
  error: {
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.4)",
    color: "#fca5a5",
    padding: "12px 16px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "0.9rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#cbd5f5",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(144, 202, 249, 0.3)",
    background: "rgba(15, 23, 42, 0.6)",
    color: "#f8fafc",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  membersSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: 600,
    color: "#90caf9",
    margin: "8px 0 0 0",
  },
  memberCard: {
    background: "rgba(15, 23, 42, 0.5)",
    border: "1px solid rgba(144, 202, 249, 0.2)",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  memberTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#e0f2fe",
    margin: 0,
  },
  feeInfo: {
    background: "rgba(255, 193, 7, 0.1)",
    border: "1px solid rgba(255, 193, 7, 0.3)",
    color: "#ffd54f",
    padding: "14px 18px",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: 600,
  },
  formActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "8px",
  },
  cancelBtn: {
    padding: "12px 24px",
    borderRadius: "10px",
    border: "1px solid rgba(148, 163, 184, 0.4)",
    background: "transparent",
    color: "#f8fafc",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  submitBtn: {
    padding: "12px 28px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)",
  },
};
