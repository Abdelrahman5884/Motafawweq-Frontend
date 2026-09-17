import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const SpiderManWeb = () => {
  const { lang, isRtl } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [hasDropped, setHasDropped] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    // Drop down smoothly from behind navbar after 600ms
    const timer = setTimeout(() => {
      setHasDropped(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    setShowBubble((prev) => !prev);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        // Positioned along the navbar with comfortable spacing
        insetInlineEnd: 'clamp(65px, 14vw, 220px)',
        zIndex: -1, // Sits directly behind the navbar surface
        pointerEvents: 'auto',
        cursor: 'pointer',
        userSelect: 'none'
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        setShowBubble(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowBubble(false);
      }}
      onClick={handleClick}
      title={lang === 'ar' ? 'سبايدرمان يحميك ويدعمك! اضغط عليه 🕷️' : 'Spider-Man is here! Click him 🕷️'}
    >
      <style>{`
        @keyframes spideyDropEntrance {
          0% {
            transform: translateY(-160px);
            opacity: 0;
          }
          60% {
            transform: translateY(18px);
            opacity: 1;
          }
          80% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
            opacity: 1;
          }
        }

        @keyframes spideyWebSwing {
          0%, 100% {
            transform: rotate(-4deg);
          }
          50% {
            transform: rotate(4.5deg);
          }
        }

        @keyframes webThreadShimmer {
          0%, 100% {
            box-shadow: 0 0 3px rgba(255, 255, 255, 0.7);
          }
          50% {
            box-shadow: 0 0 7px rgba(56, 189, 248, 0.95);
          }
        }

        @keyframes spideyLensesPulse {
          0%, 100% {
            filter: drop-shadow(0 0 2px #ffffff);
          }
          50% {
            filter: drop-shadow(0 0 7px #38BDF8);
          }
        }

        .spidey-root-assembly {
          transform-origin: top center;
          animation: spideyDropEntrance 1.1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .spidey-swing-assembly {
          transform-origin: top center;
          animation: spideyWebSwing 4.2s ease-in-out infinite;
          transition: transform 0.3s ease;
        }

        .spidey-swing-assembly:hover {
          animation-play-state: paused;
          transform: scale(1.08) translateY(6px);
        }

        @media (max-width: 640px) {
          .spidey-root-assembly {
            transform: scale(0.8);
            transform-origin: top center;
          }
        }
      `}</style>

      {/* Spider-Man Hanging Assembly */}
      <div className="spidey-root-assembly">
        <div className="spidey-swing-assembly" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Silky Web Thread emerging from behind navbar */}
          <div
            style={{
              width: '2px',
              height: isHovered ? '70px' : '55px',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, #FFFFFF 70%, #38BDF8 100%)',
              animation: 'webThreadShimmer 2.2s ease-in-out infinite',
              transition: 'height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          />

          {/* Upside-Down Hanging Spider-Man Character */}
          <div
            style={{
              position: 'relative',
              width: '68px',
              height: '96px',
              filter: 'drop-shadow(0 10px 22px rgba(0, 0, 0, 0.5))'
            }}
          >
            <svg
              viewBox="0 0 100 140"
              width="100%"
              height="100%"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Hanging Legs Hooked on Web (Top) */}
              <g id="spidey-legs">
                {/* Left bent leg */}
                <path
                  d="M 50 0 L 42 20 L 30 35 L 40 45 L 48 54"
                  stroke="#1E3A8A"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 42 20 L 30 35"
                  stroke="#DC2626"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                {/* Right hanging leg */}
                <path
                  d="M 50 0 L 58 18 L 70 32 L 60 46 L 52 54"
                  stroke="#1E3A8A"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 58 18 L 70 32"
                  stroke="#DC2626"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                {/* Boot accents */}
                <path d="M 48 2 L 52 14" stroke="#DC2626" strokeWidth="6" strokeLinecap="round" />
              </g>

              {/* Torso & Suit (Upside down) */}
              <g id="spidey-torso">
                {/* Blue flanks */}
                <path
                  d="M 42 52 C 34 60, 32 75, 38 85 L 62 85 C 68 75, 66 60, 58 52 Z"
                  fill="#1E3A8A"
                />
                {/* Red Center Chest */}
                <path
                  d="M 44 52 C 40 62, 40 76, 44 85 L 56 85 C 60 76, 60 62, 56 52 Z"
                  fill="#DC2626"
                />
                {/* Spider Emblem */}
                <path d="M 50 68 L 47 63 L 53 63 Z" fill="#0F172A" />
                <path d="M 50 68 L 50 75" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M 48 66 L 43 62 M 52 66 L 57 62" stroke="#0F172A" strokeWidth="1.2" />
                <path d="M 48 70 L 42 72 M 52 70 L 58 72" stroke="#0F172A" strokeWidth="1.2" />
                <path d="M 49 73 L 44 77 M 51 73 L 56 77" stroke="#0F172A" strokeWidth="1.2" />
              </g>

              {/* Arms */}
              <g id="spidey-arms">
                {/* Left arm holding the web */}
                <path
                  d="M 40 78 L 26 62 L 32 38 L 48 20"
                  stroke="#DC2626"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M 38 78 L 30 68" stroke="#1E3A8A" strokeWidth="6" strokeLinecap="round" />

                {/* Right arm waving / web shooter 🤟 */}
                <path
                  d="M 60 78 L 74 70 L 78 86 L 72 96"
                  stroke="#DC2626"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M 62 78 L 70 72" stroke="#1E3A8A" strokeWidth="6" strokeLinecap="round" />
                <circle cx="72" cy="98" r="4.5" fill="#DC2626" />
                <path d="M 72 98 L 76 104" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Mask / Head (Upside down at bottom) */}
              <g id="spidey-head">
                <ellipse cx="50" cy="108" rx="17" ry="21" fill="#EF4444" />
                <path
                  d="M 34 108 C 34 121, 41 129, 50 129 C 59 129, 66 121, 66 108 C 66 98, 59 90, 50 90 C 41 90, 34 98, 34 108 Z"
                  stroke="#B91C1C"
                  strokeWidth="1.5"
                />

                {/* Web lines on mask */}
                <path d="M 50 90 L 50 128" stroke="#7F1D1D" strokeWidth="1" opacity="0.6" />
                <path d="M 34 108 L 66 108" stroke="#7F1D1D" strokeWidth="1" opacity="0.6" />
                <path d="M 38 98 Q 50 102 62 98" stroke="#7F1D1D" strokeWidth="0.8" opacity="0.5" fill="none" />
                <path d="M 36 118 Q 50 114 64 118" stroke="#7F1D1D" strokeWidth="0.8" opacity="0.5" fill="none" />

                {/* Left Eye */}
                <path d="M 48 106 L 37 114 C 36 112, 38 104, 46 101 Z" fill="#0F172A" />
                <path
                  d="M 47 106.5 L 39 112.5 C 38.5 111, 40 105, 45.5 102.5 Z"
                  fill="#FFFFFF"
                  style={{ animation: 'spideyLensesPulse 2s ease-in-out infinite' }}
                />

                {/* Right Eye */}
                <path d="M 52 106 L 63 114 C 64 112, 62 104, 54 101 Z" fill="#0F172A" />
                <path
                  d="M 53 106.5 L 61 112.5 C 61.5 111, 60 105, 54.5 102.5 Z"
                  fill="#FFFFFF"
                  style={{ animation: 'spideyLensesPulse 2s ease-in-out infinite 0.3s' }}
                />
              </g>
            </svg>
          </div>

          {/* Comic Speech Bubble */}
          {showBubble && (
            <div
              style={{
                position: 'absolute',
                top: '110px',
                left: isRtl ? 'auto' : '50%',
                right: isRtl ? '50%' : 'auto',
                transform: isRtl ? 'translateX(50%)' : 'translateX(-50%)',
                backgroundColor: 'rgba(15, 23, 42, 0.96)',
                backdropFilter: 'blur(8px)',
                color: '#FFFFFF',
                border: '2px solid #EF4444',
                borderRadius: '16px',
                padding: '6px 14px',
                fontSize: '11.5px',
                fontWeight: '800',
                whiteSpace: 'nowrap',
                boxShadow: '0 8px 24px rgba(239, 68, 68, 0.45)',
                animation: 'authSpeechPop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                zIndex: 20
              }}
            >
              {lang === 'ar' ? 'يا بطل! ذاكر بذكاء متفوّق 🕷️🕸️' : 'Study Smart with Motafawweq 🕷️🕸️'}
              <div
                style={{
                  position: 'absolute',
                  top: '-7px',
                  left: '50%',
                  transform: 'translateX(-50%)',
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
