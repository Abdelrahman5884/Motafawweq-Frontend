import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Trophy, ChevronRight, ChevronLeft } from 'lucide-react';

const CHAMPIONS_DATA = [
  {
    id: 'champ-sep',
    monthAr: 'دوري شهر سبتمبر 2026',
    monthEn: 'September 2026 League',
    titleAr: 'بطل دوري المتفوقين لشهر سبتمبر',
    titleEn: 'September League Champion',
    nameAr: 'أحمد إبراهيم الدسوقي',
    nameEn: 'Ahmed Ibrahim El-Desouky',
    schoolAr: 'مدرسة السعيدية الثانوية العسكرية، الجيزة',
    schoolEn: 'El Saidiya Military High School, Giza',
    scoreAr: '3,980 نقطة',
    scoreEn: '3,980 Points',
    rankAr: 'المركز الأول جمهورياً',
    rankEn: 'National 1st Place',
    streakAr: '30 يوم استريك',
    streakEn: '30-Day Streak',
    image: '/characters/real-male-champ-1.png',
    badgeAr: 'كأس التفوق الشهري',
    badgeEn: 'Monthly Excellence Cup'
  },
  {
    id: 'champ-aug',
    monthAr: 'دوري شهر أغسطس 2026',
    monthEn: 'August 2026 League',
    titleAr: 'بطلة دوري المتفوقات لشهر أغسطس',
    titleEn: 'August League Champion',
    nameAr: 'سارة خالد منصور',
    nameEn: 'Sara Khaled Mansour',
    schoolAr: 'مدرسة المتفوقات STEM، كفر الشيخ',
    schoolEn: 'STEM High School, Kafr El-Sheikh',
    scoreAr: '3,920 نقطة',
    scoreEn: '3,920 Points',
    rankAr: 'المركز الأول جمهورياً',
    rankEn: 'National 1st Place',
    streakAr: '28 يوم استريك',
    streakEn: '28-Day Streak',
    image: '/characters/real-female-champ.png',
    badgeAr: 'درع المتفوقة الذهبي',
    badgeEn: 'Golden Champion Shield'
  },
  {
    id: 'champ-jul',
    monthAr: 'دوري شهر يوليو 2026',
    monthEn: 'July 2026 League',
    titleAr: 'بطل دوري المتفوقين لشهر يوليو',
    titleEn: 'July League Champion',
    nameAr: 'عمر طارق القاضي',
    nameEn: 'Omar Tarek El-Kady',
    schoolAr: 'الأورمان النموذجية الثانوية، الدقي',
    schoolEn: 'Orman Model High School, Dokki',
    scoreAr: '3,850 نقطة',
    scoreEn: '3,850 Points',
    rankAr: 'المركز الأول جمهورياً',
    rankEn: 'National 1st Place',
    streakAr: '26 يوم استريك',
    streakEn: '26-Day Streak',
    image: '/characters/real-male-champ-2.png',
    badgeAr: 'وسام التميز الوطني',
    badgeEn: 'National Excellence Medal'
  }
];

export const MonthlyChampionsSlider = ({ isRtl: propIsRtl, lang: propLang }) => {
  const languageContext = useLanguage?.() || {};
  const lang = propLang || languageContext.lang || 'ar';
  const isRtl = propIsRtl !== undefined ? propIsRtl : (lang === 'ar');

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
    }, 5500);

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
        maxWidth: '410px',
        margin: '0 auto',
        padding: '8px'
      }}
    >
      {/* Decorative Outer Platform Accent Frame */}
      <div 
        style={{
          position: 'absolute',
          top: '0px',
          insetInlineStart: '0px',
          width: 'calc(100% - 16px)',
          height: 'calc(100% - 16px)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: '26px',
          pointerEvents: 'none',
          zIndex: 1,
          transform: isRtl ? 'translate(-8px, -8px)' : 'translate(8px, -8px)',
          opacity: 0.7
        }} 
      />

      {/* Main Champion Card - Fully Adaptive to Platform Colors (Dark & Light) */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'var(--bg-surface)',
          background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-subtle) 100%)',
          borderRadius: '24px',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden',
          zIndex: 2,
          minHeight: '460px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {/* Ambient Radial Platform Glow behind Student */}
        <div style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          backgroundColor: 'rgba(21, 136, 199, 0.12)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />

        {/* Top Header inside Card */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          padding: '16px 18px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          {/* League Cup Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: '800',
            color: 'var(--text-primary)'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Trophy size={15} color="#D97706" />
            </div>
            <span>{lang === 'ar' ? 'لوحة أبطال الدوري' : 'League Champions'}</span>
          </div>

          {/* Month Indicator Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--primary)',
            fontSize: '11.5px',
            fontWeight: '700'
          }}>
            <span>{lang === 'ar' ? currentChamp.monthAr : currentChamp.monthEn}</span>
          </div>
        </div>

        {/* Center: Real Student Photo with Transparent Background (No background box) */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 16px 4px',
          minHeight: '290px'
        }}>
          <img
            key={currentChamp.id}
            src={currentChamp.image}
            alt={lang === 'ar' ? currentChamp.nameAr : currentChamp.nameEn}
            style={{
              maxHeight: '300px',
              maxWidth: '92%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))',
              animation: 'championFadeIn 0.4s ease-out both'
            }}
          />
        </div>

        {/* Bottom Student Info & Controls */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          padding: '14px 18px 16px',
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          {/* Winner Details */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '4px',
              gap: '8px'
            }}>
              <div style={{
                fontSize: '15.5px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {lang === 'ar' ? currentChamp.nameAr : currentChamp.nameEn}
              </div>

              <div style={{
                fontSize: '12px',
                fontWeight: '800',
                color: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                flexShrink: 0
              }}>
                {lang === 'ar' ? currentChamp.scoreAr : currentChamp.scoreEn}
              </div>
            </div>

            <div style={{
              fontSize: '11.5px',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {lang === 'ar' ? currentChamp.schoolAr : currentChamp.schoolEn}
              </span>
              <span style={{ 
                color: '#D97706', 
                fontWeight: '800', 
                flexShrink: 0,
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                padding: '2px 7px',
                borderRadius: '5px',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                {lang === 'ar' ? currentChamp.rankAr : currentChamp.rankEn}
              </span>
            </div>
          </div>

          {/* Controls: Prev/Next Buttons and Month Dots */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            {/* Prev Arrow */}
            <button
              onClick={handlePrev}
              aria-label={lang === 'ar' ? 'السابق' : 'Previous'}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary)';
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              {isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Indicator Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {CHAMPIONS_DATA.map((champ, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={champ.id}
                    onClick={() => setCurrentIndex(idx)}
                    title={lang === 'ar' ? champ.titleAr : champ.titleEn}
                    aria-label={lang === 'ar' ? champ.titleAr : champ.titleEn}
                    style={{
                      width: isActive ? '22px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      backgroundColor: isActive ? 'var(--primary)' : 'var(--border-medium)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: isActive ? '0 0 8px rgba(21, 136, 199, 0.4)' : 'none',
                      padding: 0
                    }}
                  />
                );
              })}
            </div>

            {/* Next Arrow */}
            <button
              onClick={handleNext}
              aria-label={lang === 'ar' ? 'التالي' : 'Next'}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary)';
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes championFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.96) translateY(6px);
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
