import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const SPIDEY_QUOTES_AR = [
  'يا بطل! مستعد تكسّر الدنيا؟ 🕷️',
  'مع متفوّق.. التفوق مضمون!',
  'أنا في ضهرك.. ركّز وذاكر!',
  'أبطال مصر قادمون للتفوق!'
];

const SPIDEY_QUOTES_EN = [
  'Ready to crush your goals, hero? 🕷️',
  'With Motafawweq, success is yours!',
  'I got your back.. Stay focused!',
  'Your superpowers start here!'
];

export const SpiderManWeb = () => {
  const { lang, isRtl } = useLanguage();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  // Animation lifecycle stages: 'entering' | 'hanging' | 'diving' | 'hidden'
  const [stage, setStage] = useState(isLandingPage ? 'entering' : 'hidden');
  const [showBubble, setShowBubble] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [bounceCount, setBounceCount] = useState(0);

  const cycleTimerRef = useRef(null);
  const bubbleTimerRef = useRef(null);

  // Landing page cycle vs Non-landing page peek
  useEffect(() => {
    // Clear existing timers
    if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);

    if (isLandingPage) {
      let isMounted = true;

      const runLandingCycle = () => {
        if (!isMounted) return;

        // Step 1: Drop in from top
        setStage('entering');
        
        // Auto show bubble after landing
        bubbleTimerRef.current = setTimeout(() => {
          if (isMounted) setShowBubble(true);
        }, 1100);

        // Hide bubble after 4.5s
        setTimeout(() => {
          if (isMounted) setShowBubble(false);
        }, 5500);

        // Transition to normal hanging swing after entrance
        setTimeout(() => {
          if (isMounted) setStage('hanging');
        }, 6000);

        // Step 2: After ~10 seconds of hanging, perform dramatic superhero downward dive ("يقع لتحت خالص")
        cycleTimerRef.current = setTimeout(() => {
          if (!isMounted) return;
          setShowBubble(false);
          setStage('diving');

          // Step 3: Once off-screen (after 800ms), transition to hidden cooldown
          setTimeout(() => {
            if (!isMounted) return;
            setStage('hidden');
            // Advance quote for next time
            setQuoteIndex((prev) => (prev + 1) % SPIDEY_QUOTES_AR.length);

            // Step 4: After 3.5s of hidden cooldown, drop in again from navbar!
            cycleTimerRef.current = setTimeout(() => {
              if (isMounted) runLandingCycle();
            }, 3500);

          }, 850);

        }, 10000); // 10 seconds hanging time
      };

      runLandingCycle();

      return () => {
        isMounted = false;
        if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
        if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
      };
    } else {
      // Non-landing pages: Polite peek every 3 minutes for 3 seconds
      let isMounted = true;
      setStage('hidden');
      setShowBubble(false);

      const HIDE_DURATION = 3 * 60 * 1000; // 3 minutes
      const PEEK_DURATION = 3500;           // 3.5 seconds

      const runPeekCycle = () => {
        cycleTimerRef.current = setTimeout(() => {
          if (!isMounted) return;
          setStage('entering');
          setShowBubble(true);

          setTimeout(() => {
            if (isMounted) setStage('hanging');
          }, 800);

          cycleTimerRef.current = setTimeout(() => {
            if (!isMounted) return;
            setShowBubble(false);
            setStage('diving');

            setTimeout(() => {
              if (!isMounted) return;
              setStage('hidden');
              runPeekCycle();
            }, 800);
          }, PEEK_DURATION);

        }, HIDE_DURATION);
      };

      runPeekCycle();

      return () => {
        isMounted = false;
        if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
        if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
      };
    }
  }, [location.pathname, isLandingPage]);

  // Interactive tap / click handler
  const handleClick = (e) => {
    e.stopPropagation();
    setBounceCount((prev) => prev + 1);
    setQuoteIndex((prev) => (prev + 1) % SPIDEY_QUOTES_AR.length);
    setShowBubble(true);

    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => {
      setShowBubble(false);
    }, 4000);
  };

  if (stage === 'hidden') return null;

  const currentQuote = lang === 'ar' ? SPIDEY_QUOTES_AR[quoteIndex] : SPIDEY_QUOTES_EN[quoteIndex];

  return (
    <div
      className="spidey-container-adaptive"
      style={{
        position: 'absolute',
        top: '100%',
        zIndex: 60,
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    >
      <style>{`
        /* Responsive Positioning and Adaptive Sizing */
        .spidey-container-adaptive {
          inset-inline-end: clamp(80px, 14vw, 220px);
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

        /* Web Line - Longer & Sturdier */
        .spidey-web-line {
          width: 2px;
          height: 75px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, #FFFFFF 50%, #38BDF8 100%);
          box-shadow: 0 0 8px rgba(56, 189, 248, 0.8), 0 0 3px rgba(255, 255, 255, 0.9);
          transition: height 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Spidey Character Sprite */
        .spidey-character-sprite {
          width: 66px;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 12px rgba(56, 189, 248, 0.3));
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

        /* Smooth Drop In from Navbar entrance */
        @keyframes spideyDropFromNav {
          0% {
            transform: translateY(-180px) scale(0.9);
            opacity: 0;
          }
          65% {
            transform: translateY(16px) scale(1.02);
            opacity: 1;
          }
          85% {
            transform: translateY(-8px) scale(0.99);
          }
          100% {
            transform: translateY(0px) scale(1);
            opacity: 1;
          }
        }

        /* Dramatic Superhero Downward Fall / Dive */
        @keyframes spideyDiveDown {
          0% {
            transform: translateY(0px) rotate(0deg) scale(1);
            opacity: 1;
          }
          20% {
            transform: translateY(-15px) rotate(-8deg) scale(1.04);
            opacity: 1;
          }
          100% {
            transform: translateY(115vh) rotate(18deg) scale(0.85);
            opacity: 0;
          }
        }

        /* Eye Lenses Glow */
        @keyframes spideyEyeGlow {
          0%, 100% {
            filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 10px rgba(56, 189, 248, 0.3));
          }
          50% {
            filter: drop-shadow(0 16px 32px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 18px rgba(56, 189, 248, 0.75));
          }
        }

        .spidey-anim-entering {
          transform-origin: top center;
          animation: spideyDropFromNav 0.95s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .spidey-anim-hanging {
          transform-origin: top center;
        }

        .spidey-anim-diving {
          transform-origin: top center;
          animation: spideyDiveDown 0.85s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
        }

        .spidey-swing-assembly {
          transform-origin: top center;
          animation: spideyNaturalSwing 4s ease-in-out infinite;
        }

        /* Hover & Tap: Elastic stretch downward */
        .spidey-interactive-wrapper:hover .spidey-web-line,
        .spidey-interactive-wrapper:active .spidey-web-line {
          height: 100px;
        }

        .spidey-interactive-wrapper:hover .spidey-character-sprite {
          transform: scale(1.08) translateY(6px);
          filter: drop-shadow(0 18px 34px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 20px rgba(56, 189, 248, 0.8));
        }

        .spidey-character-sprite {
          animation: spideyEyeGlow 3s ease-in-out infinite;
        }

        /* Tablet Responsive Adjustments */
        @media (max-width: 1024px) {
          .spidey-container-adaptive {
            inset-inline-end: clamp(35px, 9vw, 90px);
          }
          .spidey-character-sprite {
            width: 54px;
          }
          .spidey-web-line {
            height: 62px;
          }
          .spidey-interactive-wrapper:hover .spidey-web-line,
          .spidey-interactive-wrapper:active .spidey-web-line {
            height: 82px;
          }
        }

        /* Mobile Responsive & Adaptive: Guaranteed 100% visible speech bubble without any screen clipping */
        @media (max-width: 640px) {
          .spidey-container-adaptive {
            inset-inline-end: 18px !important;
          }
          .spidey-character-sprite {
            width: 46px !important;
          }
          .spidey-web-line {
            height: 50px !important;
          }
          .spidey-interactive-wrapper:hover .spidey-web-line,
          .spidey-interactive-wrapper:active .spidey-web-line {
            height: 68px !important;
          }
        }
      `}</style>

      {/* Spider-Man Animation Wrapper based on stage */}
      <div
        className={
          stage === 'entering'
            ? 'spidey-anim-entering'
            : stage === 'diving'
            ? 'spidey-anim-diving'
            : 'spidey-anim-hanging'
        }
      >
        <div
          className="spidey-interactive-wrapper"
          onMouseEnter={() => setShowBubble(true)}
          onMouseLeave={() => setShowBubble(false)}
          onClick={handleClick}
          title={lang === 'ar' ? 'سبايدرمان متفوّق! اضغط عليه 🕷️' : 'Spider-Man is here! Tap him 🕷️'}
        >
          {/* Silky Glowing Web Thread */}
          <div className="spidey-web-line" />

          {/* Upside-Down Realistic Spider-Man */}
          <div
            key={bounceCount}
            className="spidey-swing-assembly"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <img
              src="/characters/spiderman-realistic.png"
              alt="Spider-Man"
              className="spidey-character-sprite"
              draggable="false"
            />
          </div>

          {/* Speech Bubble - Intelligently Anchored Towards Inside Viewport so it NEVER clips */}
          {showBubble && stage !== 'diving' && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                // Anchor intelligently based on RTL so it opens towards the inside of the screen
                ...(isRtl
                  ? { left: '-10px', right: 'auto' }
                  : { right: '-10px', left: 'auto' }),
                backgroundColor: 'rgba(15, 23, 42, 0.96)',
                backdropFilter: 'blur(16px)',
                color: '#FFFFFF',
                border: '1.5px solid #EF4444',
                borderRadius: '16px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: '800',
                lineHeight: 1.35,
                whiteSpace: 'normal',
                width: 'max-content',
                maxWidth: 'clamp(180px, 65vw, 240px)',
                textAlign: 'center',
                boxShadow: '0 10px 28px rgba(239, 68, 68, 0.45), 0 4px 16px rgba(0, 0, 0, 0.7)',
                animation: 'authSpeechPop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                zIndex: 1000,
                pointerEvents: 'none'
              }}
            >
              {currentQuote}
              {/* Triangular arrow pointing to Spider-Man */}
              <div
                style={{
                  position: 'absolute',
                  top: '-7px',
                  ...(isRtl ? { left: '26px' } : { right: '26px' }),
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderBottom: '7px solid #EF4444'
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
