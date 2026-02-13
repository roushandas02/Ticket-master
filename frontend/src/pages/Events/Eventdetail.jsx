import { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import RegistrationForm from "../../components/RegistrationForm";
import api from "../../api/axios";
import { normalizeTeamSize } from "../../utils/eventUtils";



export default function Eventdetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  // const event = useMemo(() => EVENT_DETAILS.find(entry => entry.slug === id), [id]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        console.log(res);
        setEvent(res.data.event);
      } catch (err) {
        console.error("Failed to fetch event", err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);


  const eventTitle = event?.name ?? "Event";
  // const teamRange = event
  //   ? event.min_team_size === event.max_team_size
  //     ? `${event.min_team_size}`
  //     : `${event.min_team_size} – ${event.max_team_size}`
  //   : "Flexible";
  const eventType = event ? (event.min_team_size === 1 ? "Individual" : "Team") : "";
  const gallery = event?.gallery ?? (event ? [event.poster] : []);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [event]);

  const showPrevious = () => {
    setActiveImageIndex(prev => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const showNext = () => {
    setActiveImageIndex(prev => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="event-detail-page">
      <div className="event-detail-layout">
        {/*
        <button className="event-detail-back" type="button" onClick={() => navigate(-1)}>
          &lt;
        </button>
        */}
        <div className="event-detail-card">
          {event ? (
            <div className="event-detail-grid">
              <div className="event-media">
                <div className="event-poster">
                  {gallery.length > 0 && (
                    <>
                      <button className="event-gallery-control event-gallery-control--left" type="button" onClick={showPrevious}>
                        ‹
                      </button>
                      <div className="event-gallery-track">
                        <img
                          src={gallery[activeImageIndex]}
                          alt={`${event.name} highlight ${activeImageIndex + 1}`}
                        />
                      </div>
                      <button className="event-gallery-control event-gallery-control--right" type="button" onClick={showNext}>
                        ›
                      </button>
                      <div className="event-gallery-dots">
                        {gallery.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`event-gallery-dot${index === activeImageIndex ? " event-gallery-dot--active" : ""}`}
                            onClick={() => setActiveImageIndex(index)}
                            aria-label={`Show image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {registrationSuccess ? (
                  <div className="event-success-message">
                    ✓ Registration Successful!
                  </div>
                ) : (
                  <button 
                    className="event-register" 
                    type="button"
                    onClick={() => {
                      if (!user) {
                        alert("Please login to register for events");
                        navigate("/login");
                      } else {
                        setShowRegistrationForm(true);
                      }
                    }}
                  >
                    Register Now
                  </button>
                )}
                <span className="event-fee">Entry Fee: {event.fees}</span>
              </div>
              <div className="event-info">
                <div className="event-pills">
                  {event.tags?.map((tag) => (
                    <span key={tag} className="event-pill">
                      {tag}
                    </span>
                  ))}
                  <span className="event-pill">{eventType} Event</span>
                </div>

                <h1 className="event-detail-heading">{eventTitle}</h1>
                <div className="event-basics">
                  <div>
                    <strong>Date</strong>
                    <span>
                      {new Date(event.date).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>

                  <div>
                    <strong>Venue</strong>
                    <span>{event.venue}</span>
                  </div>
                  <div>
                    <strong>Registration Fee</strong>
                    <span>{event.fees}</span>
                  </div>
                  <div>
                    <strong>Team Size</strong>
                    <span>{event.teamSize}</span>
                  </div>
                </div>

                <section className="event-rules">
                  <h2>Rules & Guidelines</h2>
                  <ul>
                    {event.rules.map(rule => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          ) : (
            <div className="event-detail-empty">
              <h1 className="event-detail-heading">Event Not Found</h1>
              <p>We couldn&apos;t locate the event you were looking for.</p>
              <button className="event-detail-cta" type="button" onClick={() => navigate(-1)}>
                Go Back
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && event && (
        <RegistrationForm
          event={{
            ...event,
            ...normalizeTeamSize(event.teamSize), //adding extra fields - min_team_size & max_team_size
          }}
          onClose={() => setShowRegistrationForm(false)}
          onSuccess={(data) => {
            console.log("Registration successful:", data);
            setShowRegistrationForm(false);
            setRegistrationSuccess(true);
            setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
          }}
        />
      )}

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .event-detail-page {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background: linear-gradient(140deg, rgba(12, 18, 30, 0.88) 0%, rgba(5, 5, 7, 0.92) 65%), #020202;
    position: relative;
    color: #f4f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
  }
  .event-detail-layout {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: clamp(24px, 5vw, 48px);
  }
  .event-detail-page::before,
  .event-detail-page::after {
    content: "";
    position: absolute;
    inset: -180px;
    background: radial-gradient(circle, rgba(31, 84, 152, 0.35), transparent 68%);
    filter: blur(180px);
    opacity: 0.45;
    animation: eventDetailBgPulse 28s linear infinite;
    z-index: 0;
  }
  .event-detail-page::after {
    animation-direction: reverse;
    opacity: 0.32;
  }
  .event-detail-card {
    width: min(1380px, 98vw);
    height: min(620px, 86vh);
    background: rgba(17, 23, 34, 0.78);
    border-radius: 32px;
    border: 1px solid rgba(144, 202, 249, 0.18);
    backdrop-filter: blur(22px);
    overflow: hidden;
    box-shadow: 0 32px 64px rgba(3, 7, 14, 0.6);
    display: flex;
    flex-direction: column;
    gap: clamp(32px, 4vw, 40px);
    padding: clamp(32px, 5vw, 56px);
  }
  .event-detail-back {
    position: relative;
    z-index: 1;
    padding: 10px 22px;
    border-radius: 999px;
    border: none;
    background: rgba(59, 130, 246, 0.18);
    color: #90caf9;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease, color 0.3s ease;
  }
  .event-detail-back:hover {
    background: rgba(59, 130, 246, 0.28);
    color: #e9f2ff;
  }
  .event-detail-grid {
    display: grid;
    grid-template-columns: minmax(320px, 420px) 1fr;
    gap: clamp(36px, 5vw, 56px);
    align-items: start;
  }
  .event-media {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .event-poster {
    width: 100%;
    height: clamp(380px, 52vh, 520px);
    border-radius: 28px;
    overflow: hidden;
    border: 1px solid rgba(144, 202, 249, 0.2);
    box-shadow: 0 18px 36px rgba(6, 12, 22, 0.55);
    position: relative;
  }
  .event-gallery-track {
    width: 100%;
    height: 100%;
  }
  .event-gallery-track img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.95);
    transition: transform 0.6s ease;
  }
  .event-gallery-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    font-size: 22px;
    display: grid;
    place-items: center;
    cursor: pointer;
  }
  .event-gallery-control--left {
    left: 18px;
  }
  .event-gallery-control--right {
    right: 18px;
  }
  .event-gallery-dots {
    position: absolute;
    left: 50%;
    bottom: 18px;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
  }
  .event-gallery-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: none;
    background: rgba(144, 202, 249, 0.35);
    transition: transform 0.3s ease, background 0.3s ease;
    cursor: pointer;
  }
  .event-gallery-dot--active {
    background: #90caf9;
    transform: scale(1.4);
  }
  .event-register {
    margin-top: clamp(16px, 3vw, 28px);
    padding: 12px 24px;
    border: none;
    background: linear-gradient(120deg, #ff8a65, #ff7043);
    color: #fff;
    font-size: 1.02rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 999px;
    box-shadow: 0 16px 28px rgba(255, 112, 67, 0.28);
  }
  .event-register:hover {
    transform: translateY(-2px);
    box-shadow: 0 22px 40px rgba(255, 112, 67, 0.38);
  }
  .event-success-message {
    margin-top: clamp(16px, 3vw, 28px);
    padding: 12px 24px;
    background: linear-gradient(120deg, #4caf50, #66bb6a);
    color: #fff;
    font-size: 1.02rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 999px;
    box-shadow: 0 16px 28px rgba(76, 175, 80, 0.28);
    animation: successPulse 1.5s ease-in-out infinite;
  }
  @keyframes successPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  .event-fee {
    margin-top: 10px;
    color: #ffcbb3;
    font-weight: 600;
    letter-spacing: 0.05em;
  }
  .event-info {
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: center;
  }
  .event-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    padding: 6px 16px;
    border-radius: 999px;
    border: 1px solid rgba(144, 202, 249, 0.25);
    background: rgba(51, 109, 201, 0.18);
    color: #9ecbff;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .event-pills {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .event-basics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 18px;
    margin-top: 8px;
  }
  .event-basics div {
    background: rgba(19, 29, 49, 0.55);
    border-radius: 18px;
    border: 1px solid rgba(144, 202, 249, 0.18);
    padding: 16px 18px;
    display: grid;
    gap: 6px;
  }
  .event-basics strong {
    color: rgba(177, 205, 241, 0.9);
    font-size: 0.85rem;
    letter-spacing: 0.06em;
  }
  .event-basics span {
    color: #e7f1ff;
    font-weight: 600;
    font-size: 1.05rem;
  }
  .event-rules {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-top: clamp(16px, 3vw, 28px);
  }
  .event-rules h2 {
    margin: 0;
    font-size: clamp(1.3rem, 2.4vw, 1.6rem);
    letter-spacing: 0.05em;
    color: #c5ddff;
    text-align: left;
  }
  .event-rules ul {
    margin: 0;
    padding-left: 22px;
    display: grid;
    gap: 12px;
    color: #d4e1f7;
    line-height: 1.7;
    text-align: left;
  }
  .event-detail-empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 16px;
  }
  .event-detail-empty p {
    color: #c3d4eb;
  }
  .event-detail-cta {
    padding: 10px 24px;
    border-radius: 999px;
    border: none;
    background: linear-gradient(120deg, #1e88e5, #64b5f6);
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .event-detail-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba(30, 136, 229, 0.35);
  }
  @keyframes eventDetailBgPulse {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.1); }
    100% { transform: rotate(360deg) scale(1); }
  }
  @media (max-width: 960px) {
    .event-detail-card {
      padding: clamp(24px, 7vw, 42px);
      gap: 32px;
    }
    .event-detail-header {
      grid-template-columns: 1fr;
    }
    .event-poster {
      height: 320px;
    }
    .event-detail-heading {
      text-align: center;
    }
    .event-header-content {
      align-items: center;
      text-align: center;
    }
    .event-pill {
      margin: 0 auto;
    }
  }
  @media (max-width: 640px) {
    .event-basics {
      grid-template-columns: 1fr;
    }
    .event-detail-card {
      height: auto;
      min-height: auto;
    }
  }
`;
