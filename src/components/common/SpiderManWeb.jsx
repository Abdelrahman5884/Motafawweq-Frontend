import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const SPIDEY_QUOTES_AR = [
  'يا بطل! مستعد تكسّر الدنيا؟ 🕷️',
  'مع متفوّق.. التفوق مضمون!',
  'أنا في ضهرك.. ركّز وذاكر! 🕸️',
  'أبطال مصر قادمون للتفوق! 🚀',
  'كل دقيقة بتفرق في مستقبلك! ⚡',
  'ذاكر بذكاء مش بمجهود ع الفاضي! 🧠'
];

const SPIDEY_QUOTES_EN = [
  'Ready to crush your goals, hero? 🕷️',
  'With Motafawweq, success is yours!',
  'I got your back.. Stay focused! 🕸️',
  'Your superpowers start here! 🚀',
  'Every minute counts towards your dream! ⚡',
  'Study smarter, not harder! 🧠'
];

export const SpiderManWeb = () => {
  const { lang, isRtl } = useLanguage();
  const location = useLocation();

  // Strictly ONLY on the Landing Page
  const isLandingPage = location.pathname === '/';

  // Animation lifecycle stages: 'entering' | 'hanging' | 'retracting' | 'hidden'
  const [stage, setStage] = useState('hidden');
  const [showBubble, setShowBubble] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [bounceCount, setBounceCount] = useState(0);

  const cycleTimerRef = useRef(null);
  const bubbleTimerRef = useRef(null);
  const autoHideTimerRef = useRef(null);

  useEffect(() => {
    // If NOT on the landing page, ensure hidden and do nothing
    if (!isLandingPage) {
      setStage('hidden');
      setShowBubble(false);
      return;
    }

    let isMounted = true;

    // Routine to trigger a Spidey descent and retract cycle
    const triggerCycle = () => {
      if (!isMounted) return;

      // 1. Drop down from top
      setStage('entering');

      // 2. Pop the motivational quote bubble after landing
      bubbleTimerRef.current = setTimeout(() => {
        if (isMounted) setShowBubble(true);
      }, 850);

      // 3. Transition to gentle hanging swing
      setTimeout(() => {
        if (isMounted) setStage('hanging');
      }, 950);

      // 4. Stay hanging for 7 seconds, then retract back up
      autoHideTimerRef.current = setTimeout(() => {
        if (!isMounted) return;
        setShowBubble(false);
        setStage('retracting');

        // 5. Hide completely after retraction finishes
        setTimeout(() => {
          if (!isMounted) return;
          setStage('hidden');
          setQuoteIndex((prev) => (prev + 1) % SPIDEY_QUOTES_AR.length);
        }, 750);

      }, 7000);
    };

    // Initial show shortly after page load (1.5s delay for pleasant entrance)
    const initialTimer = setTimeout(() => {
      triggerCycle();
    }, 1500);

    // Recurring cycle: every 60 seconds (1 minute), Spider-Man drops in and retracts
    const recurringInterval = setInterval(() => {
      triggerCycle();
    }, 60000);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      clearInterval(recurringInterval);
      if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    };
  }, [isLandingPage]);

  // Handle tap / click to trigger interactive bounce and quote change
  const handleClick = (e) => {
    e.stopPropagation();
    setBounceCount((prev) => prev + 1);
    setQuoteIndex((prev) => (prev + 1) % SPIDEY_QUOTES_AR.length);
    setShowBubble(true);

    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => {
      setShowBubble(false);
    }, 4500);
  };

  // Do not render anything when hidden or off the landing page
  if (!isLandingPage || stage === 'hidden') return null;

  const currentQuote = lang === 'ar' ? SPIDEY_QUOTES_AR[quoteIndex] : SPIDEY_QUOTES_EN[quoteIndex];

  return (
    <div
      className="spidey-fixed-root"
      aria-label="Motafawweq Spider-Man"
      style={{
        position: 'fixed',
        top: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    >
      <style>{`
        /* Positioning on Desktop and Tablets */
        .spidey-fixed-root {
          ${isRtl ? 'left: clamp(20px, 8vw, 140px);' : 'right: clamp(20px, 8vw, 140px);'}
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

        /* Web Line Thread - Radiant Silky Web */
        .spidey-web-line {
          width: 2px;
          height: clamp(45px, 8vh, 85px);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, #FFFFFF 40%, #38BDF8 100%);
          box-shadow: 0 0 8px rgba(56, 189, 248, 0.8), 0 0 3px rgba(255, 255, 255, 0.9);
          transition: height 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Spidey Character Sprite */
        .spidey-character-sprite {
          width: clamp(46px, 6vw, 62px);
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 12px rgba(56, 189, 248, 0.35));
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

        /* Drop In From Top (Entering) */
        @keyframes spideyDropFromTop {
          0% {
            transform: translateY(-220px) scale(0.9);
            opacity: 0;
          }
          65% {
            transform: translateY(14px) scale(1.03);
            opacity: 1;
          }
          85% {
            transform: translateY(-6px) scale(0.99);
          }
          100% {
            transform: translateY(0px) scale(1);
            opacity: 1;
          }
        }

        /* Retract Back Up To Top (Retracting) */
        @keyframes spideyRetractUp {
          0% {
            transform: translateY(0px) scale(1);
            opacity: 1;
          }
          20% {
            transform: translateY(10px) scale(1.02);
            opacity: 1;
          }
          100% {
            transform: translateY(-240px) scale(0.85);
            opacity: 0;
          }
        }

        /* Eye Lenses Subtle Glow */
        @keyframes spideyEyeGlow {
          0%, 100% {
            filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 8px rgba(56, 189, 248, 0.3));
          }
          50% {
            filter: drop-shadow(0 16px 32px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 16px rgba(56, 189, 248, 0.75));
          }
        }

        .spidey-anim-entering {
          transform-origin: top center;
          animation: spideyDropFromTop 0.85s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .spidey-anim-hanging {
          transform-origin: top center;
        }

        .spidey-anim-retracting {
          transform-origin: top center;
          animation: spideyRetractUp 0.75s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
        }

        .spidey-swing-assembly {
          transform-origin: top center;
          animation: spideyNaturalSwing 4s ease-in-out infinite;
        }

        /* Hover & Tap: Elastic stretch downward */
        .spidey-interactive-wrapper:hover .spidey-web-line,
        .spidey-interactive-wrapper:active .spidey-web-line {
          height: clamp(65px, 12vh, 105px);
        }

        .spidey-interactive-wrapper:hover .spidey-character-sprite {
          transform: scale(1.08) translateY(6px);
          filter: drop-shadow(0 18px 34px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 20px rgba(56, 189, 248, 0.8));
        }

        .spidey-character-sprite {
          animation: spideyEyeGlow 3s ease-in-out infinite;
        }

        /* Mobile Responsive & Adaptive: Guaranteed NO screen overflow or clipping */
        @media (max-width: 640px) {
          .spidey-fixed-root {
            ${isRtl ? 'left: 14px !important;' : 'right: 14px !important;'}
          }
          .spidey-character-sprite {
            width: 44px !important;
          }
          .spidey-web-line {
            height: 40px !important;
          }
          .spidey-interactive-wrapper:hover .spidey-web-line,
          .spidey-interactive-wrapper:active .spidey-web-line {
            height: 56px !important;
          }
        }
      `}</style>

      {/* Spider-Man Animation Container */}
      <div
        className={
          stage === 'entering'
            ? 'spidey-anim-entering'
            : stage === 'retracting'
            ? 'spidey-anim-retracting'
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

          {/* Speech Bubble - Designed to always open towards the inside of the screen */}
          {showBubble && stage !== 'retracting' && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                // Anchor toward inside viewport so it NEVER clips off screen on mobile
                ...(isRtl
                  ? { left: '0px', right: 'auto' }
                  : { right: '0px', left: 'auto' }),
                backgroundColor: 'rgba(15, 23, 42, 0.96)',
                backdropFilter: 'blur(14px)',
                color: '#FFFFFF',
                border: '1.5px solid #EF4444',
                borderRadius: '16px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: '800',
                lineHeight: 1.35,
                whiteSpace: 'normal',
                width: 'max-content',
                maxWidth: 'clamp(180px, 60vw, 240px)',
                textAlign: 'center',
                boxShadow: '0 10px 28px rgba(239, 68, 68, 0.45), 0 4px 16px rgba(0, 0, 0, 0.7)',
                animation: 'authSpeechPop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                zIndex: 10000,
                pointerEvents: 'none'
              }}
            >
              {currentQuote}
              {/* Triangular indicator arrow pointing to Spidey */}
              <div
                style={{
                  position: 'absolute',
                  top: '-7px',
                  ...(isRtl ? { left: '20px' } : { right: '20px' }),
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
