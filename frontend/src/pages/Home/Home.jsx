import { useEffect, useState } from "react";

const cards = [
  {
    title: "What is REBECA?",
    description:
      "REBECA (Reunion and Bengal Engineering College Alumni) is the legendary cultural and alumni festival of IIEST Shibpur, blending generations of students and alumni since the mid-20th century.",
    image:
      "https://images.unsplash.com/photo-1464375117522-1311d6a5b81b?auto=format&fit=crop&w=1200&q=80",
    details:
      "Reuniting thousands of alumni each year, REBECA rekindles friendships and showcases the institute's enduring traditions with performances, exhibitions, and interactive sessions that bridge generations.",
    gallery: [
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529158062015-cad636e69505?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    title: "A Legacy of Celebration",
    description:
      "Born in 1944, REBECA began as a modest alumni meet and has grown into a multi-day celebration of music, theatre, art, and camaraderie, keeping alive the spirit of the institute.",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    details:
      "Through the decades, REBECA has hosted legendary artists, dramatic productions, and student-led innovations. The festival evolves with the times while cherishing the values of creativity and community.",
    gallery: [
      "https://images.unsplash.com/photo-1529158062015-cad636e69505?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    title: "Moments that Matter",
    description:
      "From iconic performances on the Oval to nostalgic batch reunions, REBECA unites the campus with unforgettable evenings filled with stories, songs, and shared memories.",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
    details:
      "Each edition captures heartfelt reunions and electrifying nights. Photo walks, memory walls, and storytelling circles ensure every visitor finds their own cherished REBECA moment.",
    gallery: [
      "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1529158062015-cad636e69505?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1529158062015-cad636e69505?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80",
];

export default function Home() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [sliderIndex, setSliderIndex] = useState(0);

  const handleCardKeyDown = (event, card) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedCard(card);
      setSliderIndex(0);
    }
  };

  const openModal = card => {
    setSelectedCard(card);
    setSliderIndex(0);
  };

  const showNextImage = () => {
    if (!selectedCard || !selectedCard.gallery?.length) return;
    setSliderIndex(prev => (prev + 1) % selectedCard.gallery.length);
  };

  const showPrevImage = () => {
    if (!selectedCard || !selectedCard.gallery?.length) return;
    setSliderIndex(prev => (prev - 1 + selectedCard.gallery.length) % selectedCard.gallery.length);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "#f9fafb",
        padding: 0,
        overflow: "hidden",
      }}
      className="rebeca-hero-wrapper"
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 72,
          padding: "80px clamp(20px, 6vw, 120px)",
          boxSizing: "border-box",
          filter: selectedCard ? "blur(7px)" : "none",
          transition: "filter 0.35s ease",
          pointerEvents: selectedCard ? "none" : "auto",
        }}
      >
        <header style={{ textAlign: "center" }}>
          <p className="rebeca-hero-kicker">Since 1944</p>
          <h1 className="rebeca-hero-title">REBECA — The Eternal Bond of IIEST Shibpur</h1>
          <p className="rebeca-hero-subtitle">
            Journey through decades of heritage, creativity, and camaraderie. REBECA brings together alumni and students for a vibrant celebration that honors the past while igniting the future.
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 28,
            padding: "0 clamp(12px, 5vw, 80px)",
            boxSizing: "border-box",
          }}
        >
          {cards.map(card => (
            <article
              key={card.title}
              style={{
                background: "rgba(26, 27, 33, 0.85)",
                borderRadius: 18,
                boxShadow: "0 22px 44px rgba(15, 23, 42, 0.45)",
                border: "1px solid rgba(144, 202, 249, 0.18)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.4s ease, box-shadow 0.4s ease",
                cursor: "pointer",
              }}
              className="rebeca-card"
              onClick={() => openModal(card)}
              onKeyDown={event => handleCardKeyDown(event, card)}
              role="button"
              tabIndex={0}
              aria-label={`Learn more about ${card.title}`}
            >
              <div style={{ position: "relative", overflow: "hidden" }}>
                <img
                  src={card.image}
                  alt={card.title}
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    filter: "grayscale(10%)",
                    transition: "transform 0.6s ease",
                  }}
                />
              </div>
              <div style={{ padding: "24px 24px 32px" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 12 }}>{card.title}</h2>
                <p style={{ color: "#c3cad6", lineHeight: 1.6 }}>{card.description}</p>
              </div>
            </article>
          ))}
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Captured Moments</h3>
            <span style={{ fontSize: "0.95rem", color: "#90caf9" }}>Swipe through the nostalgia →</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 24,
              padding: "0 clamp(12px, 5vw, 80px)",
              boxSizing: "border-box",
            }}
          >
            {galleryImages.map((src, index) => (
              <figure
                key={src + index}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.02)",
                  aspectRatio: "4 / 3",
                }}
              >
                <img
                  src={src}
                  alt={`REBECA memory ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    mixBlendMode: "screen",
                    transition: "transform 0.5s ease",
                  }}
                />
              </figure>
            ))}
          </div>
        </section>
      </div>
      {selectedCard && (
        <div className="rebeca-modal" role="dialog" aria-modal="true" aria-labelledby="rebeca-modal-title">
          <div className="rebeca-modal-content">
            <button className="rebeca-modal-close" onClick={() => setSelectedCard(null)} aria-label="Close details">
              ×
            </button>
            {selectedCard.gallery?.length ? (
              <div className="rebeca-slider">
                <button className="rebeca-slider-btn prev" onClick={showPrevImage} aria-label="Previous image">
                  ‹
                </button>
                <img
                  src={selectedCard.gallery[sliderIndex]}
                  alt={`${selectedCard.title} slide ${sliderIndex + 1}`}
                  className="rebeca-modal-image"
                />
                <button className="rebeca-slider-btn next" onClick={showNextImage} aria-label="Next image">
                  ›
                </button>
                <div className="rebeca-slider-dots" role="group" aria-label="Slide pagination">
                  {selectedCard.gallery.map((_, index) => (
                    <button
                      key={index}
                      className={`rebeca-slider-dot ${index === sliderIndex ? "active" : ""}`}
                      onClick={() => setSliderIndex(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <img src={selectedCard.image} alt={selectedCard.title} className="rebeca-modal-image" />
            )}
            <h2 id="rebeca-modal-title">{selectedCard.title}</h2>
            <p>{selectedCard.details}</p>
          </div>
          <div className="rebeca-modal-backdrop" onClick={() => setSelectedCard(null)} aria-hidden="true" />
        </div>
      )}

      <style>{`
        .rebeca-hero-wrapper {
          position: relative;
          background: radial-gradient(circle at 15% -10%, rgba(30, 30, 36, 0.55), transparent 62%),
            radial-gradient(circle at 85% -20%, rgba(20, 18, 28, 0.35), transparent 60%),
            #030303;
          overflow: hidden;
        }
        .rebeca-hero-wrapper::before,
        .rebeca-hero-wrapper::after {
          content: "";
          position: absolute;
          inset: -120px;
          background: conic-gradient(
            from 0deg,
            rgba(12, 20, 28, 0.85),
            rgba(4, 8, 16, 0.55),
            rgba(18, 26, 36, 0.75),
            rgba(8, 14, 24, 0.65),
            rgba(12, 20, 28, 0.85)
          );
          filter: blur(160px);
          opacity: 0.6;
          animation: backgroundHue 26s linear infinite;
          z-index: 0;
          pointer-events: none;
        }
        .rebeca-hero-wrapper > * {
          position: relative;
          z-index: 1;
        }
        .rebeca-hero-wrapper::after {
          animation-direction: reverse;
          animation-duration: 34s;
          opacity: 0.32;
        }
        .rebeca-hero-wrapper::before {
          mix-blend-mode: screen;
        }
        .rebeca-hero-wrapper::after {
          mix-blend-mode: multiply;
        }
        .rebeca-card:hover {
          transform: translateY(-12px) scale(1.01);
          box-shadow: 0 28px 56px rgba(15, 23, 42, 0.55);
        }
        .rebeca-card:hover img {
          transform: scale(1.08);
        }
        .rebeca-hero-kicker {
          font-size: 14px;
          letter-spacing: 6px;
          text-transform: uppercase;
          color: #90caf9;
          margin-bottom: 12px;
          display: inline-block;
          position: relative;
          overflow: hidden;
        }
        .rebeca-hero-kicker::after {
          content: "";
          position: absolute;
          inset: auto 0 -2px 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(144, 202, 249, 0.7), transparent);
          animation: kickerSweep 4s ease-in-out infinite;
        }
        .rebeca-hero-title {
          font-size: clamp(2.6rem, 5vw, 3.9rem);
          font-weight: 800;
          margin-bottom: 16px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: radial-gradient(circle at 20% 20%, rgba(144, 202, 249, 0.95), rgba(66, 165, 245, 0.2)),
            linear-gradient(120deg, #64b5f6, #bbdefb, #42a5f5, #0d47a1);
          background-size: 220% 220%;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: heroGradient 9s ease infinite, heroGlow 4s ease-in-out infinite;
          position: relative;
        }
        .rebeca-hero-title::after {
          content: "";
          position: absolute;
          inset: -8px -12px;
          border-radius: 28px;
          background: radial-gradient(circle, rgba(144, 202, 249, 0.14), transparent 68%);
          z-index: -1;
          opacity: 0;
          animation: heroHalo 8s ease-in-out infinite;
        }
        .rebeca-hero-title::before {
          content: "";
          position: absolute;
          inset: -18px -40px;
          border-radius: 42px;
          background: radial-gradient(circle, rgba(80, 170, 255, 0.28), transparent 70%);
          filter: blur(32px);
          opacity: 0.5;
          animation: heroAura 6s ease-in-out infinite;
          z-index: -2;
        }
        .rebeca-hero-subtitle {
          font-size: clamp(1.05rem, 2vw, 1.2rem);
          color: #d0d7de;
          line-height: 1.7;
          max-width: 760px;
          margin: 0 auto;
          animation: subtitleFade 6s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .rebeca-card {
            border-radius: 14px;
          }
          .rebeca-card img {
            height: 180px;
          }
        }
        @keyframes heroGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes heroGlow {
          0%, 100% {
            filter: drop-shadow(0 0 24px rgba(130, 200, 255, 0.45)) drop-shadow(0 0 36px rgba(80, 140, 220, 0.25));
          }
          50% {
            filter: drop-shadow(0 0 40px rgba(160, 220, 255, 0.65)) drop-shadow(0 0 64px rgba(64, 120, 210, 0.45));
          }
        }
        @keyframes heroAura {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.08);
          }
        }
        @keyframes heroHalo {
          0%, 100% {
            opacity: 0.18;
            transform: scale(1);
          }
          50% {
            opacity: 0.45;
            transform: scale(1.06);
          }
        }
        @keyframes kickerSweep {
          0%, 100% {
            transform: translateX(-80%);
            opacity: 0;
          }
          40%, 60% {
            transform: translateX(80%);
            opacity: 1;
          }
        }
        @keyframes subtitleFade {
          0%, 100% {
            opacity: 0.85;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes backgroundHue {
          0% {
            transform: rotate(0deg) scale(1.05);
          }
          50% {
            transform: rotate(180deg) scale(1.15);
          }
          100% {
            transform: rotate(360deg) scale(1.05);
          }
        }
        .rebeca-modal {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .rebeca-modal-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(4, 9, 20, 0.72);
          backdrop-filter: blur(6px);
          z-index: 1;
        }
        .rebeca-modal-content {
          position: relative;
          background: rgba(12, 16, 26, 0.95);
          border-radius: 20px;
          border: 1px solid rgba(144, 202, 249, 0.25);
          box-shadow: 0 28px 60px rgba(6, 12, 30, 0.65);
          padding: clamp(28px, 4vw, 40px);
          max-width: min(520px, 90vw);
          color: #eef2f7;
          z-index: 2;
          display: grid;
          gap: 20px;
        }
        .rebeca-modal-content h2 {
          font-size: clamp(1.5rem, 3vw, 2rem);
          margin: 0;
        }
        .rebeca-modal-content p {
          line-height: 1.7;
          color: #c5cdd8;
        }
        .rebeca-modal-image {
          width: 100%;
          height: 240px;
          object-fit: cover;
          border-radius: 14px;
        }
        .rebeca-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 999px;
          border: none;
          background: rgba(255, 255, 255, 0.08);
          color: #f0f4f9;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
          z-index: 3;
        }
        .rebeca-modal-close:hover {
          background: rgba(255, 255, 255, 0.18);
        }
        .rebeca-slider {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rebeca-slider-btn {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 56px;
          border: none;
          background: rgba(0, 0, 0, 0.35);
          color: #f7faff;
          cursor: pointer;
          transition: background 0.3s ease;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.3rem;
        }
        .rebeca-slider-btn:hover {
          background: rgba(0, 0, 0, 0.55);
        }
        .rebeca-slider-btn.prev {
          left: 0;
          border-top-left-radius: 14px;
          border-bottom-left-radius: 14px;
        }
        .rebeca-slider-btn.next {
          right: 0;
          border-top-right-radius: 14px;
          border-bottom-right-radius: 14px;
        }
        .rebeca-slider-btn.prev::before {
          content: "‹";
          color: currentColor;
        }
        .rebeca-slider-btn.next::before {
          content: "›";
          color: currentColor;
        }
        .rebeca-slider-dots {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
        }
      `}</style>
    </div>
  );
}