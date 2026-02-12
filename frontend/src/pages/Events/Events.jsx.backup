import { useNavigate } from "react-router-dom";

const events = [
  {
    slug: "battle-of-the-bands",
    name: "Battle of the Bands",
    date: "February 21, 2025",
    prize: "₹50,000 + Studio Recording Session",
    image:
      "https://images.unsplash.com/photo-1521337580396-0259d4aeb3f4?auto=format&fit=crop&w=1200&q=80",
    description:
      "Rock out under the stars as campus bands go head-to-head for the ultimate REBECA crown.",
  },
  {
    slug: "street-football-showdown",
    name: "Street Football Showdown",
    date: "February 22, 2025",
    prize: "₹25,000 + Nike Gear",
    image:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80",
    description:
      "Fast-paced futsal action with alumni and students teaming up for high-energy matches.",
  },
  {
    slug: "mystic-quiz-night",
    name: "Mystic Quiz Night",
    date: "February 23, 2025",
    prize: "₹15,000 + Exclusive Merchandise",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80",
    description:
      "Brain-tickling trivia spanning pop culture, campus legends, and REBECA history.",
  },
  {
    slug: "heritage-theatre-gala",
    name: "Heritage Theatre Gala",
    date: "February 24, 2025",
    prize: "₹40,000 + Spotlight Trophy",
    image:
      "https://images.unsplash.com/photo-1515169067865-5387cf585550?auto=format&fit=crop&w=1200&q=80",
    description:
      "A dramatic evening where alumni troupes revisit classics with a modern twist on the Oval stage.",
  },
];

export default function Events() {
  const navigate = useNavigate();

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
            <article className="event-card" key={event.name}>
              <div className="event-card-media">
                <img src={event.image} alt={event.name} />
              </div>
              <div className="event-card-body">
                <h2>{event.name}</h2>
                <p className="event-card-description">{event.description}</p>
                <div className="event-card-meta">
                  <span className="event-card-date">{event.date}</span>
                  <span className="event-card-prize">{event.prize}</span>
                </div>
                <button
                  className="event-card-cta"
                  type="button"
                  onClick={() => navigate(`/events/${event.slug}`)}
                >
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .events-page {
          min-height: 100vh;
          width: 100vw;
          overflow-x: hidden;
          background: linear-gradient(140deg, rgba(12, 18, 30, 0.88) 0%, rgba(5, 5, 7, 0.92) 65%), #020202;
          position: relative;
          color: #f4f5f9;
        }
        .events-page::before,
        .events-page::after {
          content: "";
          position: absolute;
          inset: -180px;
          background: radial-gradient(circle, rgba(31, 84, 152, 0.35), transparent 68%);
          filter: blur(180px);
          opacity: 0.45;
          animation: eventsBgPulse 28s linear infinite;
          z-index: 0;
        }
        .events-page::after {
          animation-direction: reverse;
          opacity: 0.32;
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
          box-sizing: border-box;
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
          display: inline-block;
        }
        .events-title {
          font-size: clamp(2.4rem, 5vw, 3.5rem);
          font-weight: 800;
          letter-spacing: 0.06em;
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
          backdrop-filter: blur(18px);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          width: min(1344px, 100%);
          margin: 0 auto;
        }
        .event-card:hover {
          transform: translateY(-10px);
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
          transition: transform 0.6s ease;
        }
        .event-card:hover .event-card-media img {
          transform: scale(1.06);
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
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .event-card-cta:hover {
          transform: translateY(-2px);
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
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.1);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
  