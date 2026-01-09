import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

export default function Navbar() {
  const token = localStorage.getItem("token");

  return (
    <header
      style={{
        background: "linear-gradient(90deg, #232526 0%, #414345 100%)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
        padding: "16px 32px",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        borderBottom: "1px solid #222",
        minHeight: 24,
        height: 24,
        boxSizing: "border-box",
      }}
      className="w-full flex justify-between items-center relative"
    >
      {/* LEFT SECTION — Home */}
      <nav>
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-widest"
          style={{
            color: "#40a9ff",
            letterSpacing: 10,
            fontFamily: "Montserrat, sans-serif",
            textShadow: "0 2px 8px rgba(64,169,255,0.15)",
          }}
        >
          <FaHome size={20} />
        </Link>

      {/* CENTER SECTION — Events */}
      <Link
        to="/events"
        className="text-lg font-medium transition-colors duration-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ color: "#fff" }}
        onMouseOver={(e) => (e.target.style.color = "#40a9ff")}
        onMouseOut={(e) => (e.target.style.color = "#fff")}
      >
        Events
      </Link>

      {/* RIGHT SECTION — Login/Register/Dashboard */}
      {token ? (
        <Link
          to="/dashboard"
          className="px-5 py-2 rounded-full font-semibold shadow-lg"
          style={{
            background: "linear-gradient(90deg, #1976d2 0%, #40a9ff 100%)",
            color: "#fff",
            boxShadow: "0 2px 8px rgba(25,118,210,0.2)",
          }}
          onMouseOver={(e) => (e.target.style.background = "#1253a2")}
          onMouseOut={(e) =>
            (e.target.style.background =
              "linear-gradient(90deg, #1976d2 0%, #40a9ff 100%)")
          }
        >
           Dashboard
        </Link>
      ) : (
        <>
          <Link
            to="/login"
            className="text-lg font-medium transition-colors duration-200"
            style={{ color: "#fff",  marginLeft: "auto"  }}
            onMouseOver={(e) => (e.target.style.color = "#40a9ff")}
            onMouseOut={(e) => (e.target.style.color = "#fff")}
          >
             | Login |
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-full font-semibold shadow-lg ml-2"
            style={{
              color: "#fff",
              marginLeft: "auto" 
            }}
            onMouseOver={(e) => (e.target.style.background = "#1253a2")}
            onMouseOut={(e) =>
              (e.target.style.background =
                "linear-gradient(90deg, #1976d2 0%, #40a9ff 100%)")
            }
          >
             Register
          </Link>
        </>
      )}
      </nav>
    </header>
  );
}
