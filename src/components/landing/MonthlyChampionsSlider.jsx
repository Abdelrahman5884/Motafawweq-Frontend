import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ChevronRight, ChevronLeft, Award, Sparkles, Flame } from 'lucide-react';

const CHAMPIONS_DATA = [
  {
    id: 'champ-sep',
    monthAr: 'دوري شهر سبتمبر 2026',
    titleAr: 'بطل دوري المتفوقين لشهر سبتمبر',
    nameAr: 'أحمد إبراهيم الدسوقي',
    schoolAr: 'مدرسة السعيدية الثانوية العسكرية، الجيزة',
    score: '3,980 نقطة',
    rankAr: 'المركز الأول جمهورياً 🥇',
    streak: '30 يوم استريك',
    image: '/characters/league-champion.png',
    badge: 'كأس التفوق الشهري'
  },
  {
    id: 'champ-aug',
    monthAr: 'دوري شهر أغسطس 2026',
    titleAr: 'بطل دوري المتفوقين لشهر أغسطس',
    nameAr: 'عمر طارق القاضي',
    schoolAr: 'الأورمان النموذجية الثانوية، الدقي',
    score: '3,850 نقطة',
    rankAr: 'المركز الأول جمهورياً 🥇',
    streak: '26 يوم استريك',
    image: '/characters/student.png',
    badge: 'درع المتفوق الذهبي'
  },
  {
    id: 'champ-jul',
    monthAr: 'دوري شهر يوليو 2026',
    titleAr: 'بطلة دوري المتفوقات لشهر يوليو',
    nameAr: 'سارة خالد منصور',
    schoolAr: 'مدرسة المتفوقات STEM، كفر الشيخ',
    score: '3,920 نقطة',
    rankAr: 'المركز الأول جمهورياً 🥇',
    streak: '28 يوم استريك',
    image: '/characters/female-champion.jpg',
    badge: 'وسام التميز الوطني'
  }
];

export const MonthlyChampionsSlider = ({ isRtl = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const currentChamp = CHAMPIONS_DATA[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CHAMPIONS_DATA.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CHAMPIONS_DATA.length) % CHAMPIONS_DATA.length);
  };

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentIndex]);

  return (
    <div 
      className="monthly-champions-slider-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '430px',
        margin: '0 auto',
        padding: '10px'
      }}
    >
      {/* Decorative Outer Cyan Wireframe Accent */}
      <div 
        style={{
          position: 'absolute',
          top: '0px',
          insetInlineStart: '0px',
          width: 'calc(100% - 16px)',
          height: 'calc(100% - 16px)',
          border: '1.5px solid rgba(92, 182, 219, 0.35)',
          borderRadius: '28px',
          pointerEvents: 'none',
          zIndex: 1,
          transform: isRtl ? 'translate(-8px, -8px)' : 'translate(8px, -8px)'
        }} 
      />

      {/* Main Champion Card */}
      <div
        style={{
          position: 'relative',
          backgroundColor: '#040F1F',
          background: 'radial-gradient(ellipse at 50% 35%, #0B3A6F 0%, #061B36 55%, #040F1F 100%)',
          borderRadius: '24px',
          border: '1.5px solid rgba(92, 182, 219, 0.4)',
          boxShadow: '0 20px 48px rgba(6, 37, 78, 0.45), 0 0 35px rgba(21, 136, 199, 0.2)',
          overflow: 'hidden',
          zIndex: 2,
          minHeight: '480px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {/* Subtle Cyber Grid & Stars in Card Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(92, 182, 219, 0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.6,
          pointerEvents: 'none'
        }} />

        {/* Ambient Radial Center Light behind Student */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          backgroundColor: 'rgba(21, 136, 199, 0.25)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />

        {/* Floating Constellation Decorative Lines */}
        <svg 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.3 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="20" y1="90" x2="80" y2="40" stroke="#5CB6DB" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="80" cy="40" r="2.5" fill="#5CB6DB" />
          <line x1="80" y1="40" x2="130" y2="80" stroke="#5CB6DB" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="130" cy="80" r="2" fill="#5CB6DB" />
          <line x1="330" y1="120" x2="380" y2="70" stroke="#5CB6DB" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="330" cy="120" r="2.5" fill="#5CB6DB" />
          <circle cx="380" cy="70" r="2" fill="#5CB6DB" />
        </svg>

        {/* Top Header Label inside Card */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          padding: '20px 22px 10px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#5CB6DB',
              marginBottom: '2px',
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <Sparkles size={13} color="#5CB6DB" />
              <span>قصص نجاح طلابنا</span>
            </div>
            <div style={{
              fontSize: '17px',
              fontWeight: '800',
              color: '#FFFFFF',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }}>
              متفوقو المنصة
            </div>
          </div>

          {/* Month Indicator Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '20px',
            backgroundColor: 'rgba(21, 136, 199, 0.2)',
            border: '1px solid rgba(92, 182, 219, 0.35)',
            color: '#5CB6DB',
            fontSize: '11.5px',
            fontWeight: '700',
            backdropFilter: 'blur(8px)'
          }}>
            <Trophy size={13} color="#FBBF24" />
            <span>{currentChamp.monthAr}</span>
          </div>
        </div>

        {/* Center: Champion Student Photo with Smooth Transition */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 10px',
          minHeight: '310px'
        }}>
          <img
            key={currentChamp.id}
            src={currentChamp.image}
            alt={currentChamp.nameAr}
            style={{
              maxHeight: '340px',
              maxWidth: '92%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.6))',
              animation: 'championFadeIn 0.5s ease-out both'
            }}
          />
        </div>

        {/* Bottom Glassmorphic Winner Info & Slider Controls */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          padding: '16px 20px 18px',
          background: 'linear-gradient(180deg, rgba(4, 15, 31, 0.75) 0%, rgba(4, 15, 31, 0.96) 100%)',
          borderTop: '1px solid rgba(92, 182, 219, 0.25)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Winner Details */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '4px'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '800',
                color: '#FFFFFF'
              }}>
                {currentChamp.nameAr}
              </div>

              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#34D399',
                backgroundColor: 'rgba(52, 211, 153, 0.12)',
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(52, 211, 153, 0.25)'
              }}>
                {currentChamp.score}
              </div>
            </div>

            <div style={{
              fontSize: '12px',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}>
              <span>{currentChamp.schoolAr}</span>
              <span style={{ color: '#FBBF24', fontWeight: '700', flexShrink: 0 }}>
                {currentChamp.rankAr}
              </span>
            </div>
          </div>

          {/* Controls: Prev/Next Buttons and Month Dots */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '8px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {/* Prev Arrow */}
            <button
              onClick={handlePrev}
              aria-label="السابق"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(21, 136, 199, 0.15)',
                border: '1px solid rgba(92, 182, 219, 0.3)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(21, 136, 199, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(92, 182, 219, 0.3)';
              }}
            >
              {isRtl ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
            </button>

            {/* Indicator Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {CHAMPIONS_DATA.map((champ, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={champ.id}
                    onClick={() => setCurrentIndex(idx)}
                    title={champ.titleAr}
                    style={{
                      width: isActive ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      backgroundColor: isActive ? 'var(--primary, #1588C7)' : 'rgba(255, 255, 255, 0.25)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: isActive ? '0 0 10px rgba(21, 136, 199, 0.8)' : 'none',
                      padding: 0
                    }}
                  />
                );
              })}
            </div>

            {/* Next Arrow */}
            <button
              onClick={handleNext}
              aria-label="التالي"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(21, 136, 199, 0.15)',
                border: '1px solid rgba(92, 182, 219, 0.3)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(21, 136, 199, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(92, 182, 219, 0.3)';
              }}
            >
              {isRtl ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes championFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(8px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
