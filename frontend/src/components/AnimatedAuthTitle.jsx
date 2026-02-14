import { useEffect, useRef, useState } from "react";

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function injectGlobalStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("animated-auth-title-styles")) return;

  const styleEl = document.createElement("style");
  styleEl.id = "animated-auth-title-styles";
  styleEl.textContent = `
    .auth-title {
      font-size: 2rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.2rem;
      background: linear-gradient(120deg, #64b5f6, #42a5f5, #90caf9, #42a5f5);
      background-size: 300% auto;
      color: transparent;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: authTitleSheen 3s ease-in-out infinite, authTitleGlow 3s ease-in-out infinite;
      display: inline-block;
    }

    @keyframes authTitleSheen {
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

    @keyframes authTitleGlow {
      0% {
        filter: drop-shadow(0 0 4px rgba(100, 181, 246, 0.25));
        transform: translateY(0px);
      }
      50% {
        filter: drop-shadow(0 0 12px rgba(66, 165, 245, 0.55));
        transform: translateY(-3px);
      }
      100% {
        filter: drop-shadow(0 0 4px rgba(100, 181, 246, 0.25));
        transform: translateY(0px);
      }
    }
  `;

  document.head.appendChild(styleEl);
}

export default function AnimatedAuthTitle({ text, className = "", style, cycleDelay = 2000 }) {
  const [displayText, setDisplayText] = useState(text);
  const animationFrameRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    injectGlobalStyles();
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const scramble = () => {
      let frame = 0;
      const iterations = Math.max(text.length * 4, 36);

      const animate = () => {
        frame += 1;
        setDisplayText(prev => {
          return text
            .split("")
            .map((char, index) => {
              if (char === " ") {
                return " ";
              }
              if (index < Math.floor(frame / 3)) {
                return char;
              }
              const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
              return CHARACTERS[randomIndex];
            })
            .join("");
        });

        if (frame < iterations) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayText(text);
          if (!isCancelled) {
            timeoutRef.current = setTimeout(scramble, cycleDelay);
          }
        }
      };

      animate();
    };

    scramble();

    return () => {
      isCancelled = true;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setDisplayText(text);
    };
  }, [text, cycleDelay]);

  const combinedStyle = {
    textAlign: "center",
    display: "block",
    margin: "0 auto",
    ...style,
  };

  return (
    <h2 className={`auth-title ${className}`.trim()} style={combinedStyle}>
      {displayText}
    </h2>
  );
}
