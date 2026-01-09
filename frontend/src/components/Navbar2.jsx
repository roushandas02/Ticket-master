import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";

const Navbar2 = () => {
    const {user,logout}=useContext(AuthContext);

  return (
    <nav style={styles.navbar}>
      {/* Left Section */}
      <div style={styles.left}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/events" style={styles.link}>Events</Link>
      </div>

      {/* Center Section */}
      <div style={styles.center}>
        <Link to="/" style={styles.brand}>REBECA</Link>
      </div>

      {/* Right Section */}
      <div style={styles.right}>
        {user && <span style={styles.username}>{user}</span>}
        {user === null ? (
            <Link to="/register">
                <button style={styles.button}>Sign in</button>
            </Link>
            ) : (
            <button onClick={logout} style={styles.button}>
                Log Out
            </button>
            )}

      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    backgroundColor: "#111",
    color: "#fff",
  },
  left: {
    display: "flex",
    gap: "20px",
    flex: 1,
  },
  center: {
    flex: 1,
    textAlign: "center",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flex: 1,
    justifyContent: "flex-end",
  },
  brand: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#fff",
    textDecoration: "none",
    letterSpacing: "1px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "16px",
  },
  button: {
    padding: "6px 14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  },
  username: {
    fontSize: "14px",
    opacity: 0.9,
  },
};

export default Navbar2;
