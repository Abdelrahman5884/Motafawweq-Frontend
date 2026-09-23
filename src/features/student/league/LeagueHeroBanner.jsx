import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Crown,
  Flame,
  Medal,
  Clock,
  Zap,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Award,
  Star,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export const LeagueHeroBanner = ({
  lang,
  isRtl,
  onStartQuiz,
  onStartExam,
  onGoToAchievements,
  activeLeague,
  currentUser
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const isRepublic = activeLeague?.id === 'general-republic' || activeLeague?.isRepublicLeague;

  // Champion of the league
  const champion = activeLeague?.champion || {
    nameAr: activeLeague?.students?.[0]?.nameAr || 'سارة خالد منصور',
    avatar: activeLeague?.students?.[0]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
    schoolAr: activeLeague?.students?.[0]?.schoolAr || 'مدرسة المتفوقات STEM كفر الشيخ',
    score: activeLeague?.students?.[0]?.score || 18450,
    streak: activeLeague?.students?.[0]?.streak || 28,
    title: 'بطلة الجمهورية للأسبوع الحالي',
    quoteAr: 'الاستمرار اليومي وحل امتحانات الوزارة الشاملة في كل المواد هو سر الصدارة في دوري الجمهورية.'
  };

  const studentUser = currentUser || {
    nameAr: 'عمر طارق القاضي (أنت)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    score: 17290,
    rank: 2
  };

  const totalSlides = 3;

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        background: 'linear-gradient(135deg, #041935 0%, #06254E 45%, #0B3A6F 85%, #082142 100%)',
        borderRadius: '24px',
        padding: '24px 28px',
        marginBottom: '20px',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 14px 40px rgba(6, 37, 78, 0.28)',
        border: '1.5px solid rgba(92, 182, 219, 0.3)',
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {/* Decorative Golden & Cyan Ambient Glows */}
      <div style={{
        position: 'absolute',
        top: '-70px',
        [isRtl ? 'left' : 'right']: '-60px',
        width: '260px',
        height: '260px',
        borderRadius: '50%',
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-80px',
        [isRtl ? 'right' : 'left']: '-50px',
        width: '240px',
        height: '240px',
        borderRadius: '50%',
        backgroundColor: 'rgba(21, 136, 199, 0.15)',
        filter: 'blur(55px)',
        pointerEvents: 'none'
      }} />

      {/* Top Header Row of the Slider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 2,
        marginBottom: '14px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {/* League Tag / Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '20px',
            backgroundColor: 'rgba(245, 158, 11, 0.18)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            color: '#FBBF24',
            fontSize: '12px',
            fontWeight: '800'
          }}>
            <Crown size={14} color="#FBBF24" />
            <span>
              {isRepublic
                ? (lang === 'ar' ? 'سلايدر شرف الجمهورية • المجموع الكلي لكل المواد' : 'National Republic All-Subjects Championship')
                : (activeLeague?.badge || (lang === 'ar' ? 'دوري المتفوقين' : 'League'))}
            </span>
          </div>

          <span style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.65)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Clock size={12} />
            <span>{lang === 'ar' ? 'حسم الأسبوع: بعد يومين' : 'Closes in: 2 days'}</span>
          </span>
        </div>

        {/* Navigation arrows for slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={isRtl ? handleNext : handlePrev}
            title={lang === 'ar' ? 'السابق' : 'Previous'}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.15s'
            }}
          >
            {isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.7)', minWidth: '32px', textAlign: 'center' }}>
            {currentSlide + 1} / {totalSlides}
          </span>

          <button
            type="button"
            onClick={isRtl ? handlePrev : handleNext}
            title={lang === 'ar' ? 'التالي' : 'Next'}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.15s'
            }}
          >
            {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      {/* ── SLIDE 1: صورة بطل الجمهورية المتصدر في السلايدر ── */}
      {currentSlide === 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          position: 'relative',
          zIndex: 2,
          animation: 'fadeIn 0.35s ease'
        }}>
          {/* Champion Details */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                fontSize: '12px',
                fontWeight: '800',
                color: '#FBBF24',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {lang === 'ar' ? '👑 صاحب المركز الأول على مستوى مصر' : '👑 National Champion #1'}
              </span>
              <span style={{
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                color: '#FDE68A',
                fontSize: '11px',
                fontWeight: '700',
                padding: '1px 8px',
                borderRadius: '99px',
                border: '1px solid rgba(245, 158, 11, 0.35)'
              }}>
                {lang === 'ar' ? 'صورة المتصدر في السلايدر' : 'Featured in Hero Slider'}
              </span>
            </div>

            <h2 style={{
              fontSize: '24px',
              fontWeight: '900',
              margin: '0 0 6px 0',
              color: '#FFFFFF',
              fontFamily: 'var(--font-arabic)'
            }}>
              {champion.nameAr}
            </h2>

            <div style={{
              fontSize: '13px',
              color: '#E2E8F0',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontWeight: '600' }}>{champion.schoolAr}</span>
              <span>•</span>
              <span style={{ color: 'var(--primary-light)' }}>
                {lang === 'ar' ? 'المجموع الكلي: كافة المواد المقررة' : 'Total Across All Subjects'}
              </span>
            </div>

            <p style={{
              fontSize: '12.5px',
              color: '#94A3B8',
              margin: '0 0 14px 0',
              lineHeight: 1.5,
              maxWidth: '520px',
              fontStyle: 'italic'
            }}>
              "{champion.quoteAr}"
            </p>

            {/* Score & Streak Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '12.5px',
                fontWeight: '700'
              }}>
                <Trophy size={14} color="#FBBF24" />
                <span>{champion.score.toLocaleString()} {lang === 'ar' ? 'نقطة بالدوري' : 'pts'}</span>
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                color: '#FDE68A',
                fontSize: '12.5px',
                fontWeight: '700'
              }}>
                <Flame size={14} color="#F59E0B" />
                <span>{champion.streak} {lang === 'ar' ? 'يوماً متواصلاً' : 'day streak'}</span>
              </div>
            </div>
          </div>

          {/* Golden Champion Avatar Frame */}
          <div style={{
            position: 'relative',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              position: 'relative',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              padding: '4px',
              background: 'linear-gradient(135deg, #F59E0B, #FDE68A, #D97706)',
              boxShadow: '0 0 25px rgba(245, 158, 11, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={champion.avatar}
                alt={champion.nameAr}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #06254E'
                }}
              />

              {/* Crown Floating Badge */}
              <div style={{
                position: 'absolute',
                top: '-12px',
                backgroundColor: '#D97706',
                color: '#FFF',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                border: '2px solid #FFFBEB'
              }}>
                <Crown size={18} color="#FFD700" fill="#FFD700" />
              </div>

              {/* Rank 1 Tag */}
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                backgroundColor: '#F59E0B',
                color: '#06254E',
                fontSize: '11px',
                fontWeight: '900',
                padding: '2px 10px',
                borderRadius: '99px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                border: '1.5px solid #FFFFFF'
              }}>
                #1 الجمهورية
              </div>
            </div>

            <span style={{
              fontSize: '11px',
              color: 'var(--primary-light)',
              fontWeight: '700',
              marginTop: '14px',
              textAlign: 'center'
            }}>
              {lang === 'ar' ? 'بطلة هذا الأسبوع' : 'Week Champion'}
            </span>
          </div>
        </div>
      )}

      {/* ── SLIDE 2: وضعك في المنافسة والوصافة ── */}
      {currentSlide === 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          position: 'relative',
          zIndex: 2,
          animation: 'fadeIn 0.35s ease'
        }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '2px 10px',
              borderRadius: '99px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: 'var(--primary-light)',
              fontSize: '11.5px',
              fontWeight: '800',
              marginBottom: '6px'
            }}>
              <TrendingUp size={13} />
              <span>{lang === 'ar' ? 'ترتيبك الوطني في دوري الجمهورية' : 'Your National Standing'}</span>
            </div>

            <h2 style={{
              fontSize: '22px',
              fontWeight: '900',
              margin: '0 0 6px 0',
              color: '#FFFFFF'
            }}>
              {lang === 'ar' ? 'أنت في المركز #2 (وصيف الجمهورية) 🥈' : 'You are Ranked #2 Nationwide 🥈'}
            </h2>

            <p style={{
              fontSize: '13px',
              color: '#CBD5E1',
              margin: '0 0 12px 0',
              maxWidth: '520px',
              lineHeight: 1.6
            }}>
              {lang === 'ar'
                ? `يفصلك ${((champion.score || 18450) - (studentUser.score || 17290)).toLocaleString()} نقطة فقط عن انتزاع المركز الأول وتثبيت صورتك في هذا السلايدر أمام طلاب مصر!`
                : 'Only 1,160 pts separate you from taking #1 and having your picture featured in the hero slider!'}
            </p>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={onStartExam}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(21, 136, 199, 0.4)'
                }}
              >
                <BookOpen size={15} />
                <span>{lang === 'ar' ? 'حل امتحان وزاري شامل (+50 نقطة)' : 'Take Exam'}</span>
              </button>

              <button
                type="button"
                onClick={onStartQuiz}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <Zap size={14} color="#FBBF24" />
                <span>{lang === 'ar' ? 'كويز سريع' : 'Fast Quiz'}</span>
              </button>
            </div>
          </div>

          {/* Student Profile Preview */}
          <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              padding: '3px',
              background: 'linear-gradient(135deg, #38BDF8, #1588C7)',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={studentUser.avatar}
                alt={studentUser.nameAr}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #06254E'
                }}
              />
            </div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#FFFFFF', marginTop: '8px' }}>
              {studentUser.nameAr}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--primary-light)' }}>
              17,290 {lang === 'ar' ? 'نقطة عامة' : 'pts'}
            </span>
          </div>
        </div>
      )}

      {/* ── SLIDE 3: قواعد وامتيازات صدارة السلايدر ── */}
      {currentSlide === 2 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          position: 'relative',
          zIndex: 2,
          animation: 'fadeIn 0.35s ease'
        }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FBBF24', fontSize: '12px', fontWeight: '800', marginBottom: '6px' }}>
              <Star size={14} fill="#FBBF24" />
              <span>{lang === 'ar' ? 'امتيازات بطل الجمهورية ومكافآته' : 'Champion Privileges & Rewards'}</span>
            </div>

            <h2 style={{
              fontSize: '22px',
              fontWeight: '900',
              margin: '0 0 8px 0',
              color: '#FFFFFF'
            }}>
              {lang === 'ar' ? 'كيف تضع صورتك واسمك في صدارة سلايدر مصر؟' : 'How to Feature Your Picture on the National Slider?'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#E2E8F0' }}>
                <CheckCircle2 size={15} color="var(--primary-light)" />
                <span>{lang === 'ar' ? '1. المجموع الكلي يُحسب من جميع المواد معاً (أحياء، فيزياء، كيمياء، عربي، لغات).' : '1. Total score combines all subjects.'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#E2E8F0' }}>
                <CheckCircle2 size={15} color="#FBBF24" />
                <span>{lang === 'ar' ? '2. الفائز بالمركز الأول في حسم ليلة الجمعة توضع صورته طوال الأسبوع في السلايدر.' : '2. The #1 student gets their picture featured in the hero slider.'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#E2E8F0' }}>
                <CheckCircle2 size={15} color="var(--success)" />
                <span>{lang === 'ar' ? '3. الحصول على وسام "بطل الجمهورية" الذهبي الرقمي في البروفايل الرسمي.' : '3. Awarded the Digital Republic Hero badge.'}</span>
              </div>
            </div>

            {onGoToAchievements && (
              <button
                type="button"
                onClick={onGoToAchievements}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <Award size={14} color="#FBBF24" />
                <span>{lang === 'ar' ? 'استعراض سجل الأوسمة والجوائز' : 'View Achievements'}</span>
              </button>
            )}
          </div>

          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '20px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '2px solid rgba(245, 158, 11, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: '#FDE68A',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.2)'
          }}>
            <Medal size={36} color="#FBBF24" />
            <span style={{ fontSize: '11px', fontWeight: '800' }}>درع الجمهورية</span>
          </div>
        </div>
      )}

      {/* ── Bottom Slider Dots ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '16px',
        position: 'relative',
        zIndex: 2
      }}>
        {[0, 1, 2].map((idx) => {
          const isActive = currentSlide === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              title={`Slide ${idx + 1}`}
              aria-label={`Slide ${idx + 1}`}
              style={{
                width: isActive ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: isActive ? '#FBBF24' : 'rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                padding: 0
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LeagueHeroBanner;
