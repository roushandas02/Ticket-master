import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EVENT_DETAILS = [
  {
    slug: "battle-of-the-bands",
    name: "Battle of the Bands",
    category: "Music",
    poster:
      "https://images.unsplash.com/photo-1515169067865-5387cf585550?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1515169067865-5387cf585550?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1600&q=80",
    ],
    fee: "₹1,500",
    date: "February 21, 2025 • 6:30 PM",
    venue: "Oval Stage",
    min_team_size: 3,
    max_team_size: 6,
    rules: [
      "Original compositions and covers are both allowed (max 6-minute performance).",
      "At least one alumni member per band is mandatory.",
      "Use of pyrotechnics or open flames is prohibited.",
    ],
  },
  {
    slug: "street-football-showdown",
    name: "Street Football Showdown",
    category: "Sports",
    poster:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    ],
    fee: "₹1,000",
    date: "February 22, 2025 • 4:30 PM",
    venue: "Recreational Grounds",
    min_team_size: 5,
    max_team_size: 7,
    rules: [
      "Matches follow futsal regulations with rolling substitutions.",
      "Studded boots are not permitted on the court.",
      "Yellow/Red card system will be strictly enforced.",
    ],
  },
  {
    slug: "mystic-quiz-night",
    name: "Mystic Quiz Night",
    category: "Literary",
    poster:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=70",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1600&q=80",
    ],
    fee: "₹600",
    date: "February 23, 2025 • 5:30 PM",
    venue: "Heritage Hall",
    min_team_size: 1,
    max_team_size: 2,
    rules: [
      "Mobile phones and smart watches must be switched off.",
      "Team discussions are allowed only during allotted time windows.",
      "In case of tie, visual rapid-fire round will decide the winner.",
    ],
  },
  {
    slug: "heritage-theatre-gala",
    name: "Heritage Theatre Gala",
    category: "Drama",
    poster:
      "https://images.unsplash.com/photo-1518133927612-6d0619f41f03?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518133927612-6d0619f41f03?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    ],
    fee: "₹2,000",
    date: "February 24, 2025 • 6:00 PM",
    venue: "Auditorium Royale",
    min_team_size: 6,
    max_team_size: 12,
    rules: [
      "Props must be declared during registration for safety clearance.",
      "Background music tracks should be submitted 24 hours in advance.",
      "Maximum staging time is 20 minutes including setup and teardown.",
    ],
  },
];

export default function Eventdetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const event = useMemo(() => EVENT_DETAILS.find(entry => entry.slug === id), [id]);
  const eventTitle = event?.name ?? "Event";
  const teamRange = event
    ? event.min_team_size === event.max_team_size
      ? `${event.min_team_size}`
      : `${event.min_team_size} – ${event.max_team_size}`
    : "-";
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
                <button className="event-register" type="button">
                  Register Now
                </button>
                <span className="event-fee">Entry Fee: {event.fee}</span>
              </div>
              <div className="event-info">
                <div className="event-pills">
                  <span className="event-pill">{event.category}</span>
                  <span className="event-pill">{eventType} Event</span>
                </div>
                <h1 className="event-detail-heading">{eventTitle}</h1>
                <div className="event-basics">
                  <div>
                    <strong>Date</strong>
                    <span>{event.date}</span>
                  </div>
                  <div>
                    <strong>Venue</strong>
                    <span>{event.venue}</span>
                  </div>
                  <div>
                    <strong>Registration Fee</strong>
                    <span>{event.fee}</span>
                  </div>
                  <div>
                    <strong>Team Size</strong>
                    <span>{teamRange}</span>
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
