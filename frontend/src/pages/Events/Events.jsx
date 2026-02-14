import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axios";



export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events/list");
        const data = res.data;
        // console.log(data);
        if (data) {
          setEvents(data);
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    
  }, []);

  if (loading) {
    return (
      <div className="events-page">
        <h2 style={{ textAlign: "center", marginTop: "100px" }}>
          Loading events...
        </h2>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-wrapper">
        <div className="events-hero">
          <p className="events-kicker">Experience the Pulse</p>
          <h1 className="events-title">REBECA 2025 Marquee Events</h1>
          <p className="events-subtitle">
            From exhilarating sports to soul-stirring performances, dive into a curated lineup celebrating the heart
            and talent of IIEST Shibpur.
          </p>
        </div>

        <div className="events-list">
          {events.map(event => (
            <article className="event-card" key={event._id}>
              <div className="event-card-media">
                <img src={event.image} alt={event.name} loading="lazy" />
              </div>
              <div className="event-card-body">
                <h2>{event.name}</h2>
                <p className="event-card-description">{event.description}</p>
                <div className="event-card-meta">
                  <span className="event-card-date">
                    {new Date(event.date).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>


                  <span className="event-card-prize">{event.prize}</span>
                </div>

                <button
                  className="event-card-cta"
                  type="button"
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }
        
        .events-page {
          min-height: 100vh;
          width: 100vw;
          overflow-x: hidden;
          overflow-y: auto;
          background: linear-gradient(140deg, rgba(12, 18, 30, 0.88) 0%, rgba(5, 5, 7, 0.92) 65%), #020202;
          position: relative;
          color: #f4f5f9;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        
        .events-page::before,
        .events-page::after {
          content: "";
          position: fixed;
          inset: -180px;
          background: radial-gradient(circle, rgba(31, 84, 152, 0.35), transparent 68%);
          filter: blur(100px);
          opacity: 0.3;
          animation: eventsBgPulse 28s linear infinite;
          z-index: 0;
          will-change: transform;
          pointer-events: none;
          transform: translateZ(0);
        }
        
        .events-page::after {
          animation-direction: reverse;
          opacity: 0.2;
        }
        
        .events-wrapper {
          position: relative;
          z-index: 1;
          width: min(1400px, 100%);
          margin: 0 auto;
          padding: clamp(60px, 10vw, 120px) clamp(20px, 10vw, 160px) clamp(80px, 12vw, 160px);
          display: flex;
          flex-direction: column;
          gap: clamp(40px, 6vw, 72px);
        }
        
        .events-hero {
          text-align: center;
          display: grid;
          gap: 12px;
        }
        
        .events-kicker {
          text-transform: uppercase;
          letter-spacing: 6px;
          font-size: 13px;
          color: #8ab4ff;
          font-weight: 700;
          margin: 0;
        }
        
        .events-title {
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 800;
          margin: 0;
          letter-spacing: 2px;
          text-transform: uppercase;
          background: linear-gradient(120deg, #bbdefb, #42a5f5, #90caf9);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 24px rgba(66, 165, 245, 0.45));
        }
        
        .events-subtitle {
          max-width: 720px;
          margin: 0 auto;
          color: #c7d0dc;
          line-height: 1.7;
          font-size: clamp(1rem, 2.2vw, 1.1rem);
        }
        
        .events-list {
          display: grid;
          gap: 28px;
        }
        
        .event-card {
          display: flex;
          flex-direction: row;
          gap: 24px;
          background: rgba(17, 23, 34, 0.78);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(144, 202, 249, 0.18);
          box-shadow: 0 24px 48px rgba(5, 10, 20, 0.45);
          backdrop-filter: blur(6px);
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          width: min(1344px, 100%);
          margin: 0 auto;
          will-change: transform;
          transform: translateZ(0);
        }
        
        .event-card:hover {
          transform: translateY(-6px) translateZ(0);
          box-shadow: 0 32px 64px rgba(5, 10, 20, 0.55);
        }
        
        .event-card-media {
          flex: 0 0 320px;
          overflow: hidden;
        }
        
        .event-card-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.9);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
          transform: translateZ(0);
        }
        
        .event-card:hover .event-card-media img {
          transform: scale(1.03) translateZ(0);
        }
        
        .event-card-body {
          display: grid;
          gap: 12px;
          padding: clamp(20px, 4vw, 32px);
        }
        
        .event-card-body h2 {
          font-size: clamp(1.6rem, 3vw, 2rem);
          margin: 0;
          font-weight: 700;
          color: #e9f2ff;
        }
        
        .event-card-description {
          color: #b9c5d6;
          line-height: 1.6;
        }
        
        .event-card-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #9fc3ff;
          font-weight: 600;
        }
        
        .event-card-date {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .event-card-date::before {
          content: "📅";
        }
        
        .event-card-prize {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #ffdea9;
        }
        
        .event-card-prize::before {
          content: "🏆";
        }
        
        .event-card-cta {
          justify-self: flex-start;
          padding: 10px 22px;
          border: none;
          border-radius: 999px;
          background: linear-gradient(120deg, #1976d2, #42a5f5);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
          transform: translateZ(0);
        }
        
        .event-card-cta:hover {
          transform: translateY(-2px) translateZ(0);
          box-shadow: 0 16px 32px rgba(25, 118, 210, 0.45);
        }
        
        @media (max-width: 1024px) {
          .events-wrapper {
            padding: 72px clamp(18px, 6vw, 60px);
          }
          .event-card {
            flex-direction: column;
            width: 100%;
          }
          .event-card-media {
            flex: unset;
            max-height: 240px;
          }
        }
        
        @media (max-width: 640px) {
          .events-wrapper {
            padding: 48px 16px;
          }
          .event-card {
            gap: 0;
          }
          .event-card-body {
            padding: 20px;
          }
        }
        
        @keyframes eventsBgPulse {
          0% {
            transform: rotate(0deg) scale(1) translateZ(0);
          }
          50% {
            transform: rotate(180deg) scale(1.05) translateZ(0);
          }
          100% {
            transform: rotate(360deg) scale(1) translateZ(0);
          }
        }
      `}</style>
    </div>
  );
}
