import React, { useContext, useState } from "react";
import AnimatedAuthTitle from "../../components/AnimatedAuthTitle";
import axios from "axios";
import { AuthContext } from "../../context/Authcontext";
import { useNavigate } from "react-router-dom";

const BACKEND_URL="http://localhost:5000"

export default function Register() {
  const {setUser}=useContext(AuthContext);
  const navigate=useNavigate();


  const [userType, setUserType] = useState("iiestian");
  const [iiestianForm, setIIESTianForm] = useState({
    name: "",
    email: "",
    roll: "",
    // department: "",
    password: "",
  });
  const [nonIIESTianForm, setNonIIESTianForm] = useState({
    name: "",
    email: "",
    college: "",
    password: "",
  });
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "iiestian") {
      setIIESTianForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setNonIIESTianForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleRollChange = (e, formType) => {
    const { name, value } = e.target;
    const filteredValue = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");

    if (formType === "iiestian") {
      setIIESTianForm((prev) => ({ ...prev, [name]: filteredValue }));
    } else {
      setNonIIESTianForm((prev) => ({ ...prev, [name]: filteredValue }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowOtpStep(true);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      alert("Please enter the OTP sent to your email.");
      return;
    }
    signup();
    alert("Thank you for registering!");
    navigate("/login");
    setOtp("");
    setShowOtpStep(false);
    setUserType("iiestian");
    setIIESTianForm({
      name: "",
      email: "",
      roll: "",
      // department: "",
      password: "",
      confirm_password: "",
    });
    setNonIIESTianForm({
      name: "",
      email: "",
      college: "",
      password: "",
      confirm_password: "",
    });
  };

  const signup= async ()=>{
    try {
      let response;
      if (userType === "iiestian") {
        response=await axios.post(`${BACKEND_URL}/api/auth/signup`,iiestianForm);
      } else {
        response=await axios.post(`${BACKEND_URL}/api/auth/signup`,nonIIESTianForm);
      }
      console.log(response);
      // setUser(response.data.name);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#000",

    }}>
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
          border: isHovered ? "1px solid rgba(64,169,255,0.45)" : "1px solid #2d2d30",
          zIndex: 1,
          transition: "all 0.35s ease",
          transform: isHovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
          backdropFilter: "blur(2px)",
        }}
      >
        {!showOtpStep ? (
          <>
            <AnimatedAuthTitle text="Registration" style={{ textAlign: "center", marginBottom: 24 }} />
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
              <label>
                <input
                  type="radio"
                  className="register-dark-radio"
                  name="userType"
                  value="iiestian"
                  checked={userType === "iiestian"}
                  onChange={() => setUserType("iiestian")}
                />
                IIESTian
              </label>
              <label>
                <input
                  type="radio"
                  className="register-dark-radio"
                  name="userType"
                  value="non-iiestian"
                  checked={userType === "non-iiestian"}
                  onChange={() => setUserType("non-iiestian")}
                />
                Non-IIESTian
              </label>
            </div>
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
              {userType === "iiestian" ? (
                <>
                  <input
                    name="name"
                    placeholder="Name"
                    value={iiestianForm.name}
                    onChange={(e) => handleChange(e, "iiestian")}
                    required
                    className="register-dark-input" style={{ marginBottom: 12 }}
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={iiestianForm.email}
                    onChange={(e) => handleChange(e, "iiestian")}
                    required
                    className="register-dark-input" style={{ marginBottom: 12 }}
                  />
                  <input
                    name="roll"
                    placeholder="Roll Number"
                    value={iiestianForm.roll}
                    onChange={(e) => handleRollChange(e, "iiestian")}
                    required
                    className="register-dark-input" style={{ marginBottom: 12 }}
                  />
                  {/* <input
                    name="department"
                    placeholder="Department"
                    value={iiestianForm.department}
                    onChange={(e) => handleChange(e, "iiestian")}
                    required
                    className="register-dark-input" style={{ marginBottom: 12 }}
                  /> */}
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={iiestianForm.password}
                    onChange={(e) => handleChange(e, "iiestian")}
                    required
                    className="register-dark-input" style={{ marginBottom: 16 }}
                  />
                  <input
                    name="Confirm Password"
                    type="password"
                    placeholder="Confirm Password"
                    value={iiestianForm.confirm_password}
                    onChange={(e) => handleChange(e, "iiestian")}
                    required
                    className="register-dark-input" style={{ marginBottom: 16 }}
                  />
                </>
              ) : (
                <>
                  <input
                    name="name"
                    placeholder="Name"
                    value={nonIIESTianForm.name}
                    onChange={(e) => handleChange(e, "non-iiestian")}
                    required
                    className="register-dark-input" style={{ marginBottom: 12 }}
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={nonIIESTianForm.email}
                    onChange={(e) => handleChange(e, "non-iiestian")}
                    required
                    className="register-dark-input" style={{ marginBottom: 12 }}
                  />
                  <input
                    name="college"
                    placeholder="College Name"
                    value={nonIIESTianForm.college}
                    onChange={(e) => handleChange(e, "non-iiestian")}
                    required
                    className="register-dark-input" style={{ marginBottom: 12 }}
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={nonIIESTianForm.password}
                    onChange={(e) => handleChange(e, "non-iiestian")}
                    required
                    className="register-dark-input" style={{ marginBottom: 16 }}
                  />
                  <input
                    name="Confirm Password"
                    type="password"
                    placeholder="Confirm Password"
                    value={nonIIESTianForm.confirm_password}
                    onChange={(e) => handleChange(e, "non-iiestian")}
                    required
                    className="register-dark-input" style={{ marginBottom: 16 }}
                  />
                </>
              )}
              <button type="submit" className="register-dark-btn">
                Continue
              </button>
            </form>
          </>
        ) : (
          <>
            <AnimatedAuthTitle text="Verify OTP" style={{ textAlign: "center", marginBottom: 16 }} />
            <p style={{ textAlign: "center", marginBottom: 24, color: "#b8b8b8", fontSize: 14 }}>
              Enter the one-time password sent to your registered email/phone to complete the registration.
            </p>
            <form onSubmit={handleOtpSubmit}>
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
              <input
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="register-dark-input"
                style={{ marginBottom: 16, letterSpacing: 4, textAlign: "center" }}
              />
              <button type="submit" className="register-dark-btn">
                Verify & Finish
              </button>
            </form>
            <button
              type="button"
              onClick={() => setShowOtpStep(false)}
              style={{
                marginTop: 16,
                width: "100%",
                background: "transparent",
                border: "none",
                color: "#6fa8ff",
                fontSize: 12,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Edit registration details
            </button>
          </>
        )}
      </div>
    </div>
  );
}
