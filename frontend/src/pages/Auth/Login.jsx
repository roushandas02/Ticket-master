import { useContext, useState } from "react";
import AnimatedAuthTitle from "../../components/AnimatedAuthTitle";
import axios from "axios";
import { AuthContext } from "../../context/Authcontext";
import { useNavigate } from "react-router-dom";

const BACKEND_URL="http://localhost:5000"

export default function Login() {
  const {setUser}=useContext(AuthContext);
  const navigate=useNavigate();

  const [mode, setMode] = useState("user");
  const [userType, setUserType] = useState("iiest");
  const [iiestCredentials, setIIESTCredentials] = useState({
    roll: "",
    password: "",
  });
  const [nonIIESTCredentials, setNonIIESTCredentials] = useState({
    email: "",
    password: "",
  });
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (event, type) => {
    const { name, value } = event.target;
    if (type === "iiest") {
      setIIESTCredentials(prev => ({ ...prev, [name]: value }));
    } else if (type === "non-iiest") {
      setNonIIESTCredentials(prev => ({ ...prev, [name]: value }));
    } else {
      setAdminCredentials(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleRollChange = (event, type) => {
    const { name, value } = event.target;
    const filteredValue = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");


    if (type === "iiest") {
      setIIESTCredentials(prev => ({ ...prev, [name]: filteredValue }));
    } else if (type === "non-iiest") {
      setNonIIESTCredentials(prev => ({ ...prev, [name]: filteredValue }));
    } else {
      setAdminCredentials(prev => ({ ...prev, [name]: filteredValue }));
    }
  };


  const handleSubmit = async event => {
    event.preventDefault();
    try {
      let response;
        if (mode === "admin") {
          alert("Admin Login: " + JSON.stringify(adminCredentials, null, 2));
          response=await axios.post(`${BACKEND_URL}/api/auth/login`,adminCredentials);
        } else if (userType === "iiest") {
          alert("IIEST Login: " + JSON.stringify(iiestCredentials, null, 2));
          response=await axios.post(`${BACKEND_URL}/api/auth/login`,iiestCredentials);
        } else {
          alert("Non-IIEST Login: " + JSON.stringify(nonIIESTCredentials, null, 2));
          response=await axios.post(`${BACKEND_URL}/api/auth/login`,nonIIESTCredentials);
        }
        console.log(response);
        setUser(response.data.user.name);
        navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
    
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
      }}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          maxWidth: 400,
          width: "100%",
          padding: 32,
          boxShadow: isHovered ? "0 12px 42px rgba(25,118,210,0.35)" : "0 4px 24px rgba(0,0,0,0.08)",
          borderRadius: 12,
          background: isHovered ? "linear-gradient(160deg, #1a1f2b 0%, #161616 80%)" : "#181818",
          color: "#fff",
          border: isHovered ? "1px solid rgba(64,169,255,0.45)" : "1px solid #e0e3e9",
          zIndex: 1,
          transition: "all 0.35s ease",
          transform: isHovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
          backdropFilter: "blur(2px)",
        }}
      >
        <AnimatedAuthTitle text="Login" style={{ textAlign: "center", marginBottom: 24 }} />

        {mode !== "admin" && (
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
            <label>
              <input
                type="radio"
                className="register-dark-radio"
                name="userType"
                value="iiest"
                checked={userType === "iiest"}
                onChange={() => setUserType("iiest")}
              />
              IIEST Member
            </label>
            <label>
              <input
                type="radio"
                className="register-dark-radio"
                name="userType"
                value="non-iiest"
                checked={userType === "non-iiest"}
                onChange={() => setUserType("non-iiest")}
              />
              Non-IIEST Guest
            </label>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <style>{`
            .register-dark-input {
              background: #232323;
              color: #fff;
              border: 1px solid #444;
              border-radius: 4px;
              width: 100%;
              padding: 12px;
              box-sizing: border-box;
            }
            .register-dark-input::placeholder {
              color: #aaa;
            }
            .register-dark-radio {
              accent-color: #1976d2;
            }
            .register-dark-btn {
              background: #1976d2;
              color: #fff;
              border: none;
              border-radius: 4px;
              font-weight: 600;
              transition: background 0.2s;
              width: 100%;
              padding: 12px;
            }
            .register-dark-btn:hover {
              background: #1253a2;
            }
          `}</style>

          {mode === "admin" ? (
            <>
              <input
                name="username"
                placeholder="Admin Username"
                value={adminCredentials.username}
                onChange={event => handleChange(event, "admin")}
                required
                className="register-dark-input"
                style={{ marginBottom: 12 }}
              />
              <input
                name="password"
                type="password"
                placeholder="Admin Password"
                value={adminCredentials.password}
                onChange={event => handleChange(event, "admin")}
                required
                className="register-dark-input"
                style={{ marginBottom: 16 }}
              />
            </>
          ) : userType === "iiest" ? (
            <>
              <input
                name="roll"
                placeholder="Roll Number"
                value={iiestCredentials.roll}
                onChange={event => handleRollChange(event, "iiest")}
                required
                className="register-dark-input"
                style={{ marginBottom: 12 }}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={iiestCredentials.password}
                onChange={event => handleChange(event, "iiest")}
                required
                className="register-dark-input"
                style={{ marginBottom: 16 }}
              />
            </>
          ) : (
            <>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={nonIIESTCredentials.email}
                onChange={event => handleChange(event, "non-iiest")}
                required
                className="register-dark-input"
                style={{ marginBottom: 12 }}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={nonIIESTCredentials.password}
                onChange={event => handleChange(event, "non-iiest")}
                required
                className="register-dark-input"
                style={{ marginBottom: 16 }}
              />
            </>
          )}

          <button type="submit" className="register-dark-btn" style={{ marginBottom: 12 }}>
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode(prev => (prev === "admin" ? "user" : "admin"))}
            style={{
              width: "100%",
              background: "transparent",
              color: "#40a9ff",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "underline",
              letterSpacing: 0.3,
            }}
          >
            {mode === "admin" ? "Back to User Login" : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
