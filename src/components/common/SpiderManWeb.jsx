import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const SPIDEY_QUOTES_AR = [
  'يا بطل! ذاكر بذكاء متفوّق 🕷️🕸️',
  'قوة خارقة لنتائج مبهرة! 🚀',
  'مع متفوّق.. التفوق لعبتك! ⭐',
  'أنا هنا في ضهرك دايماً! 🕸️🔥'
];

const SPIDEY_QUOTES_EN = [
  'Study smart with Motafawweq! 🕷️🕸️',
  'Superpower your learning! 🚀',
  'With great focus comes great success! ⭐',
  'Always got your back, hero! 🕸️🔥'
];

export const SpiderManWeb = () => {
  const { lang, isRtl } = useLanguage();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const [isVisible, setIsVisible] = useState(isLandingPage);
  const [isHovered, setIsHovered] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const hideTimeoutRef = useRef(null);
  const showTimeoutRef = useRef(null);
  const bubbleTimeoutRef = useRef(null);

  // Routing and timing:
  // On Landing page (/): Always visible.
  // On other pages: Hidden for 3 minutes -> Appears for 2 seconds -> Hides for 3 minutes -> repeats.
  useEffect(() => {
    // Clear any pending timers on route change
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);

    if (isLandingPage) {
      setIsVisible(true);
      setIsExiting(false);
      return;
    }

    // On non-landing pages
    setIsVisible(false);
    setIsExiting(false);
    setShowBubble(false);

    const HIDE_DURATION = 3 * 60 * 1000; // 3 minutes = 180,000ms
    const PEEK_DURATION = 2 * 1000;      // 2 seconds

    const runPeekCycle = () => {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        setIsExiting(false);

        // Disappear after 2 seconds
        showTimeoutRef.current = setTimeout(() => {
          setIsExiting(true);
          // Wait for exit slide up transition (400ms) before hiding
          setTimeout(() => {
            setIsVisible(false);
            setIsExiting(false);
            // Schedule next cycle
            runPeekCycle();
          }, 450);
        }, PEEK_DURATION);

      }, HIDE_DURATION);
    };

    runPeekCycle();

    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    };
  }, [location.pathname, isLandingPage]);

  const handleClick = (e) => {
    e.stopPropagation();
    setQuoteIndex((prev) => (prev + 1) % SPIDEY_QUOTES_AR.length);
    setShowBubble(true);

    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    bubbleTimeoutRef.current = setTimeout(() => {
      setShowBubble(false);
    }, 3800);
  };

  if (!isVisible) return null;

  const currentQuote = lang === 'ar' ? SPIDEY_QUOTES_AR[quoteIndex] : SPIDEY_QUOTES_EN[quoteIndex];

  return (
    <div
      className="spidey-container-adaptive"
      style={{
        position: 'absolute',
        top: '100%',
        zIndex: 50,
        pointerEvents: 'none', // Allow page clicks/taps outside the character to pass through
        userSelect: 'none'
      }}
    >
      <style>{`
        /* Responsive Positioning and Adaptive Sizing */
        .spidey-container-adaptive {
          inset-inline-end: clamp(70px, 14vw, 210px);
        }

        .spidey-interactive-wrapper {
          pointer-events: auto;
          cursor: pointer;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          touch-action: manipulation;
        }

        /* Web Line */
        .spidey-web-line {
          width: 2px;
          height: 48px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, #FFFFFF 60%, #38BDF8 100%);
          box-shadow: 0 0 8px rgba(56, 189, 248, 0.8), 0 0 3px rgba(255, 255, 255, 0.9);
          transition: height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Spidey Character Sprite */
        .spidey-character-sprite {
          width: 66px;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 10px rgba(56, 189, 248, 0.25));
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease;
        }

        /* Natural web swinging animation */
        @keyframes spideyNaturalSwing {
          0%, 100% {
            transform: rotate(-3.5deg);
          }
          50% {
            transform: rotate(4deg);
          }
        }

        /* Smooth Drop In entrance */
        @keyframes spideyDropIn {
          0% {
            transform: translateY(-160px);
            opacity: 0;
          }
          65% {
            transform: translateY(14px);
            opacity: 1;
          }
          85% {
            transform: translateY(-6px);
          }
          100% {
            transform: translateY(0px);
            opacity: 1;
          }
        }

        /* Smooth Zip Up exit */
        @keyframes spideyZipUp {
          0% {
            transform: translateY(0px);
            opacity: 1;
          }
          100% {
            transform: translateY(-180px);
            opacity: 0;
          }
        }

        /* Eye Lenses Glow */
        @keyframes spideyEyeGlow {
          0%, 100% {
            filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 10px rgba(56, 189, 248, 0.3));
          }
          50% {
            filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 16px rgba(56, 189, 248, 0.7));
          }
        }

        .spidey-anim-assembly {
          transform-origin: top center;
          animation: ${isExiting ? 'spideyZipUp 0.45s ease-in forwards' : 'spideyDropIn 0.85s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'};
        }

        .spidey-swing-assembly {
          transform-origin: top center;
          animation: spideyNaturalSwing 4s ease-in-out infinite;
        }

        /* Hover & Tap: Drops down smoothly with elastic spring ("ينزل شوية") */
        .spidey-interactive-wrapper:hover .spidey-web-line,
        .spidey-interactive-wrapper:active .spidey-web-line {
          height: 68px;
        }

        .spidey-interactive-wrapper:hover .spidey-character-sprite {
          transform: scale(1.08) translateY(4px);
          filter: drop-shadow(0 16px 30px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 18px rgba(56, 189, 248, 0.65));
        }

        .spidey-character-sprite {
          animation: spideyEyeGlow 3s ease-in-out infinite;
        }

        /* Tablet Responsive Adjustments */
        @media (max-width: 1024px) {
          .spidey-container-adaptive {
            inset-inline-end: clamp(30px, 8vw, 80px);
          }
          .spidey-character-sprite {
            width: 52px;
          }
          .spidey-web-line {
            height: 38px;
          }
          .spidey-interactive-wrapper:hover .spidey-web-line,
          .spidey-interactive-wrapper:active .spidey-web-line {
            height: 52px;
          }
        }

        /* Mobile Responsive & Adaptive: Scaled down & shifted to safe corner so it NEVER covers text */
        @media (max-width: 640px) {
          .spidey-container-adaptive {
            /* Positioned at safe outer edge on mobile so it doesn't block hero headlines or navbar buttons */
            inset-inline-end: 14px !important;
          }
          .spidey-character-sprite {
            width: 42px !important;
          }
          .spidey-web-line {
            height: 28px !important;
          }
          .spidey-interactive-wrapper:hover .spidey-web-line,
          .spidey-interactive-wrapper:active .spidey-web-line {
            height: 42px !important;
          }
        }
      `}</style>

      {/* Spider-Man Hanging Animation Root */}
      <div className="spidey-anim-assembly">
        <div
          className="spidey-interactive-wrapper"
          onMouseEnter={() => {
            setIsHovered(true);
            setShowBubble(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            setShowBubble(false);
          }}
          onClick={handleClick}
          title={lang === 'ar' ? 'سبايدرمان متفوّق! اضغط عليه 🕷️' : 'Spider-Man is here! Tap him 🕷️'}
        >
          {/* Silky Glowing Web Thread */}
          <div className="spidey-web-line" />

          {/* Upside-Down Realistic Spider-Man */}
          <div className="spidey-swing-assembly" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src="/characters/spiderman-realistic.png"
              alt="Spider-Man"
              className="spidey-character-sprite"
              draggable="false"
            />
          </div>

          {/* Speech Bubble */}
          {showBubble && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: isRtl ? 'auto' : '50%',
                right: isRtl ? '50%' : 'auto',
                transform: isRtl ? 'translateX(50%)' : 'translateX(-50%)',
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(12px)',
                color: '#FFFFFF',
                border: '1.5px solid #EF4444',
                borderRadius: '16px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: '800',
                whiteSpace: 'normal',
                width: 'max-content',
                maxWidth: 'min(230px, 75vw)',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(239, 68, 68, 0.45), 0 4px 12px rgba(0, 0, 0, 0.5)',
                animation: 'authSpeechPop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                zIndex: 100,
                pointerEvents: 'none'
              }}
            >
              {currentQuote}
              {/* Triangular arrow pointing to Spider-Man */}
              <div
                style={{
                  position: 'absolute',
                  top: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderBottom: '6px solid #EF4444'
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
