import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Medal, 
  ChevronLeft,
  Award,
  Crown,
  Sparkles,
  Flame,
  Shield,
  Star
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const GamificationLeaguesHistory = ({ lang = 'ar' }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // Teacher leagues standings
  const teacherLeagues = [
    {
      id: 'tch-salma',
      teacherName: 'د. سلمى السيد',
      subject: 'الأحياء',
      courseTitle: 'ماستر كورس الأحياء والوراثة',
      rank: 2,
      totalStudents: 4120,
      xp: 3450,
      tierAr: 'دوري النخبة الماسي',
      statusAr: 'مؤهل للمراكز الأولى',
      accentColor: '#38BDF8',
      glowColor: 'rgba(56, 189, 248, 0.25)',
      cardBgDark: 'linear-gradient(145deg, rgba(56, 189, 248, 0.12) 0%, rgba(15, 23, 42, 0.85) 100%)',
      cardBgLight: 'linear-gradient(145deg, #F0F9FF 0%, #FFFFFF 100%)',
      borderColor: 'rgba(56, 189, 248, 0.35)',
      badgeBg: 'rgba(56, 189, 248, 0.15)',
      medalTitle: 'المركز الثاني'
    },
    {
      id: 'tch-hany',
      teacherName: 'د. هاني الشناوي',
      subject: 'الفيزياء',
      courseTitle: 'الفيزياء الحديثة وقوانين كيرشوف',
      rank: 1,
      totalStudents: 3890,
      xp: 2890,
      tierAr: 'بطل الكورس الذهبي',
      statusAr: 'متصدر المجموعة 🥇',
      accentColor: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.3)',
      cardBgDark: 'linear-gradient(145deg, rgba(245, 158, 11, 0.16) 0%, rgba(15, 23, 42, 0.85) 100%)',
      cardBgLight: 'linear-gradient(145deg, #FFFBEB 0%, #FFFFFF 100%)',
      borderColor: 'rgba(245, 158, 11, 0.5)',
      badgeBg: 'rgba(245, 158, 11, 0.2)',
      medalTitle: 'المركز الأول'
    },
    {
      id: 'tch-walid',
      teacherName: 'مستر وليد محسن',
      subject: 'اللغة العربية',
      courseTitle: 'مراجعة النحو الشاملة والبلاغة',
      rank: 3,
      totalStudents: 3500,
      xp: 3120,
      tierAr: 'دوري النخبة الماسي',
      statusAr: 'منصة التتويج 🥉',
      accentColor: '#EA580C',
      glowColor: 'rgba(234, 88, 12, 0.22)',
      cardBgDark: 'linear-gradient(145deg, rgba(234, 88, 12, 0.12) 0%, rgba(15, 23, 42, 0.85) 100%)',
      cardBgLight: 'linear-gradient(145deg, #FFF7ED 0%, #FFFFFF 100%)',
      borderColor: 'rgba(234, 88, 12, 0.35)',
      badgeBg: 'rgba(234, 88, 12, 0.15)',
      medalTitle: 'المركز الثالث'
    },
    {
      id: 'tch-ehab',
      teacherName: 'د. إيهاب عبد العظيم',
      subject: 'الكيمياء',
      courseTitle: 'الاتزان الكيميائي والكيمياء الكهربية',
      rank: 4,
      totalStudents: 2940,
      xp: 2100,
      tierAr: 'الدوري الذهبي',
      statusAr: 'صاعد للمربع الذهبي',
      accentColor: '#8B5CF6',
      glowColor: 'rgba(139, 92, 246, 0.2)',
      cardBgDark: 'linear-gradient(145deg, rgba(139, 92, 246, 0.12) 0%, rgba(15, 23, 42, 0.85) 100%)',
      cardBgLight: 'linear-gradient(145deg, #F5F3FF 0%, #FFFFFF 100%)',
      borderColor: 'rgba(139, 92, 246, 0.35)',
      badgeBg: 'rgba(139, 92, 246, 0.15)',
      medalTitle: 'المركز الرابع'
    }
  ];

  // Past leagues archive
  const pastLeagues = [
    {
      id: 'past-2',
      titleAr: 'دوري المتفوقين لشهر أغسطس (على مستوى الجمهورية)',
      seasonAr: 'الموسم الصيفي التأسيسي • المنافسة الكبرى',
      rank: 1,
      points: '4,820',
      badgeAr: 'درع المتفوق الذهبي الأول',
      tierAr: 'بطل الجمهورية',
      dateAr: '31 أغسطس 2026',
      isChampion: true,
      accentColor: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.35)',
      cardBgDark: 'linear-gradient(145deg, rgba(245, 158, 11, 0.18) 0%, rgba(15, 23, 42, 0.9) 100%)',
      cardBgLight: 'linear-gradient(145deg, #FFFBEB 0%, #FFFFFF 100%)',
      borderColor: 'rgba(245, 158, 11, 0.55)'
    },
    {
      id: 'past-1',
      titleAr: 'دوري الأحياء الأسبوعي (الجولة السابقة)',
      seasonAr: 'الأسبوع الثاني - سبتمبر 2026',
      rank: 2,
      points: '3,450',
      badgeAr: 'وسام التميز الفضي',
      tierAr: 'دوري النخبة الماسي',
      dateAr: '18 سبتمبر 2026',
      isChampion: false,
      accentColor: '#38BDF8',
      glowColor: 'rgba(56, 189, 248, 0.22)',
      cardBgDark: 'linear-gradient(145deg, rgba(56, 189, 248, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)',
      cardBgLight: 'linear-gradient(145deg, #F0F9FF 0%, #FFFFFF 100%)',
      borderColor: 'rgba(56, 189, 248, 0.35)'
    },
    {
      id: 'past-3',
      titleAr: 'دوري الفيزياء العام والتطبيقات المتقدمة',
      seasonAr: 'الأسبوع الأول - سبتمبر 2026',
      rank: 2,
      points: '2,890',
      badgeAr: 'وسام الصعود السريع',
      tierAr: 'الدوري الماسي',
      dateAr: '11 سبتمبر 2026',
      isChampion: false,
      accentColor: '#06B6D4',
      glowColor: 'rgba(6, 182, 212, 0.22)',
      cardBgDark: 'linear-gradient(145deg, rgba(6, 182, 212, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)',
      cardBgLight: 'linear-gradient(145deg, #ECFEFF 0%, #FFFFFF 100%)',
      borderColor: 'rgba(6, 182, 212, 0.35)'
    },
    {
      id: 'past-4',
      titleAr: 'دوري تجارب الكيمياء والاتزان',
      seasonAr: 'الجولة التأهيلية',
      rank: 3,
      points: '2,650',
      badgeAr: 'وسام المنصة البرونزي',
      tierAr: 'الدوري الذهبي',
      dateAr: '28 أغسطس 2026',
      isChampion: false,
      accentColor: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.2)',
      cardBgDark: 'linear-gradient(145deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.9) 100%)',
      cardBgLight: 'linear-gradient(145deg, #FFFDF5 0%, #FFFFFF 100%)',
      borderColor: 'rgba(245, 158, 11, 0.35)'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '32px' }}>
      {/* ── 1. Teacher Course Leagues Ranking (Championship Arena Theme) ── */}
      <div style={{
        position: 'relative',
        background: isDark 
          ? 'radial-gradient(ellipse at 50% 0%, #152238 0%, #0A1120 75%, #060A13 100%)' 
          : 'radial-gradient(ellipse at 50% 0%, #E0F2FE 0%, #F1F5F9 60%, #F8FAFC 100%)',
        border: isDark ? '1px solid rgba(56, 189, 248, 0.22)' : '1px solid rgba(2, 132, 199, 0.22)',
        borderRadius: '24px',
        padding: '26px 28px',
        boxShadow: isDark 
          ? '0 16px 40px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)' 
          : '0 12px 30px -8px rgba(14, 165, 233, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        overflow: 'hidden'
      }}>
        {/* Subtle Championship Trophy Watermark */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: lang === 'ar' ? 'auto' : '-20px',
          right: lang === 'ar' ? '-20px' : 'auto',
          width: '260px',
          height: '260px',
          opacity: isDark ? 0.05 : 0.06,
          pointerEvents: 'none',
          zIndex: 0
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%', color: '#F59E0B' }}>
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        </div>

        {/* Stadium Light Beam Glow (Header Spotlights) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #38BDF8, #F59E0B, transparent)',
          opacity: 0.8
        }} />

        {/* Section Header */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '22px',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 10px',
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(245, 158, 11, 0.16)' : 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#F59E0B',
                fontSize: '11px',
                fontWeight: '800'
              }}>
                <Trophy size={13} />
                <span>{lang === 'ar' ? 'ساحة البطولات والتنافس الأكاديمي' : 'Championship Arena'}</span>
              </span>

              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 9px',
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.1)',
                color: isDark ? '#38BDF8' : '#0284C7',
                fontSize: '11px',
                fontWeight: '700'
              }}>
                <Sparkles size={12} />
                <span>{lang === 'ar' ? 'موسم 2026 الرسمي' : 'Official Season 2026'}</span>
              </span>
            </div>

            <h2 style={{
              fontSize: '18px',
              fontWeight: '900',
              color: isDark ? '#FFFFFF' : '#0F172A',
              margin: '6px 0 2px',
              fontFamily: 'var(--font-arabic)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Crown size={20} color="#F59E0B" />
              <span>{lang === 'ar' ? 'ترتيبي في دوريات كورسات المعلمين' : 'Rankings in Teacher Leagues'}</span>
            </h2>
            <p style={{
              fontSize: '12.5px',
              color: isDark ? '#94A3B8' : '#64748B',
              margin: 0,
              fontFamily: 'var(--font-arabic)'
            }}>
              {lang === 'ar' ? 'مركزك التنافسي ونقاطك مع كل معلم في الكورسات المشترك بها ضمن دوريات التفوق' : 'Your live standing and tournament points with each instructor'}
            </p>
          </div>

          <button
            onClick={() => navigate('/student/league')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '12px',
              background: isDark 
                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(2, 132, 199, 0.25) 100%)' 
                : 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              border: isDark ? '1px solid rgba(245, 158, 11, 0.4)' : 'none',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            <Trophy size={14} color="#F59E0B" />
            <span>{lang === 'ar' ? 'استعراض الدوري الكامل' : 'View Full League'}</span>
            <ChevronLeft size={15} />
          </button>
        </div>

        {/* Teachers Championship Cards Grid */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {teacherLeagues.map((item) => (
            <div
              key={item.id}
              style={{
                position: 'relative',
                background: isDark ? item.cardBgDark : item.cardBgLight,
                border: `1.5px solid ${item.borderColor}`,
                borderRadius: '18px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isDark 
                  ? `0 10px 25px -6px ${item.glowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.08)` 
                  : `0 8px 20px -6px ${item.glowColor}`,
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              {/* Corner Watermark Medal for Rank 1 */}
              {item.rank === 1 && (
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  left: lang === 'ar' ? '-15px' : 'auto',
                  right: lang === 'ar' ? 'auto' : '-15px',
                  width: '90px',
                  height: '90px',
                  opacity: isDark ? 0.08 : 0.07,
                  pointerEvents: 'none'
                }}>
                  <Crown size={90} color="#F59E0B" />
                </div>
              )}

              <div>
                {/* Top Row: Subject & Rank Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.05)',
                    color: isDark ? '#E2E8F0' : '#334155',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(15, 23, 42, 0.08)'
                  }}>
                    {item.subject}
                  </span>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    backgroundColor: item.badgeBg,
                    color: item.accentColor,
                    border: `1px solid ${item.borderColor}`,
                    fontSize: '11.5px',
                    fontWeight: '900'
                  }}>
                    {item.rank === 1 ? <Crown size={13} color="#F59E0B" /> : <Medal size={13} color={item.accentColor} />}
                    <span>{item.medalTitle}</span>
                  </div>
                </div>

                {/* Teacher Name & Course */}
                <div style={{
                  fontSize: '15px',
                  fontWeight: '900',
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  marginBottom: '3px',
                  fontFamily: 'var(--font-heading)'
                }}>
                  {item.teacherName}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: isDark ? '#94A3B8' : '#64748B',
                  marginBottom: '14px',
                  lineHeight: 1.4
                }}>
                  {item.courseTitle}
                </div>

                {/* Status Pill */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: item.accentColor,
                  marginBottom: '16px'
                }}>
                  <Flame size={13} color={item.accentColor} />
                  <span>{item.statusAr}</span>
                </div>
              </div>

              {/* Bottom Footer: Rank Standings + Points */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(15, 23, 42, 0.08)',
                fontSize: '12.5px'
              }}>
                <div>
                  <span style={{ color: isDark ? '#64748B' : '#94A3B8', fontSize: '11.5px' }}>{lang === 'ar' ? 'المركز: ' : 'Rank: '}</span>
                  <strong style={{ color: item.accentColor, fontSize: '15px', fontWeight: '900' }}>#{item.rank}</strong>
                  <span style={{ fontSize: '11px', color: isDark ? '#64748B' : '#94A3B8' }}> / {item.totalStudents}</span>
                </div>
                <div style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>
                  <strong style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '14px', fontWeight: '900' }}>
                    {item.xp.toLocaleString()}
                  </strong>
                  <span style={{ fontSize: '11px', color: isDark ? '#64748B' : '#94A3B8', marginInlineStart: '3px' }}>
                    {lang === 'ar' ? 'نقطة XP' : 'XP'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. Past Leagues & Seasons Hall of Fame (Championship Archive) ── */}
      <div style={{
        position: 'relative',
        background: isDark 
          ? 'radial-gradient(ellipse at 50% 0%, #171E31 0%, #0A101D 70%, #060911 100%)' 
          : 'radial-gradient(ellipse at 50% 0%, #FEF3C7 0%, #F8FAFC 60%, #F1F5F9 100%)',
        border: isDark ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '24px',
        padding: '26px 28px',
        boxShadow: isDark 
          ? '0 16px 40px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)' 
          : '0 12px 30px -8px rgba(245, 158, 11, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        overflow: 'hidden'
      }}>
        {/* Subtle Championship Shield Watermark */}
        <div style={{
          position: 'absolute',
          top: '-15px',
          left: lang === 'ar' ? 'auto' : '-15px',
          right: lang === 'ar' ? '-15px' : 'auto',
          width: '240px',
          height: '240px',
          opacity: isDark ? 0.05 : 0.06,
          pointerEvents: 'none',
          zIndex: 0
        }}>
          <Shield size={240} color="#F59E0B" />
        </div>

        {/* Section Header */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 10px',
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(245, 158, 11, 0.16)' : 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#F59E0B',
                fontSize: '11px',
                fontWeight: '800'
              }}>
                <Award size={13} />
                <span>{lang === 'ar' ? 'قاعة المشاهير والتتويج' : 'Hall of Fame & Trophies'}</span>
              </span>
            </div>

            <h2 style={{
              fontSize: '18px',
              fontWeight: '900',
              color: isDark ? '#FFFFFF' : '#0F172A',
              margin: '6px 0 2px',
              fontFamily: 'var(--font-arabic)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Trophy size={20} color="#F59E0B" />
              <span>{lang === 'ar' ? 'سجل ترتيبي في كل الدوريات السابقة' : 'Past Leagues & Seasons Archive'}</span>
            </h2>
            <p style={{
              fontSize: '12.5px',
              color: isDark ? '#94A3B8' : '#64748B',
              margin: 0,
              fontFamily: 'var(--font-arabic)'
            }}>
              {lang === 'ar' ? 'أرشيف نتائجك والمراكز المحققة في جولات الدوري السابقة وبطولات الجمهورية' : 'Your final standings and badges achieved in previous league rounds'}
            </p>
          </div>
        </div>

        {/* Past Leagues Championship Grid */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {pastLeagues.map((item) => (
            <div
              key={item.id}
              style={{
                position: 'relative',
                background: isDark ? item.cardBgDark : item.cardBgLight,
                border: `1.5px solid ${item.borderColor}`,
                borderRadius: '18px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isDark 
                  ? `0 10px 25px -6px ${item.glowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.08)` 
                  : `0 8px 20px -6px ${item.glowColor}`,
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <div>
                {/* Top Badge: Rank & Date */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    backgroundColor: item.rank === 1 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                    color: item.accentColor,
                    border: `1px solid ${item.borderColor}`,
                    fontSize: '11px',
                    fontWeight: '900'
                  }}>
                    {item.rank === 1 ? <Crown size={12} color="#F59E0B" /> : <Award size={12} color={item.accentColor} />}
                    <span>{item.rank === 1 ? 'المركز #1 (بطل الجمهورية)' : `المركز #${item.rank}`}</span>
                  </div>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: isDark ? '#94A3B8' : '#64748B'
                  }}>
                    {item.dateAr}
                  </span>
                </div>

                {/* Tournament Title */}
                <div style={{
                  fontSize: '14.5px',
                  fontWeight: '900',
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  marginBottom: '4px',
                  lineHeight: 1.4,
                  fontFamily: 'var(--font-heading)'
                }}>
                  {item.titleAr}
                </div>

                <div style={{
                  fontSize: '11.5px',
                  color: isDark ? '#94A3B8' : '#64748B',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Star size={12} color="#F59E0B" />
                  <span>{item.seasonAr}</span>
                </div>
              </div>

              {/* Bottom Footer: Tier Badge + Total Points */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(15, 23, 42, 0.08)',
                fontSize: '12px'
              }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: item.accentColor,
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.05)',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  border: `1px solid ${item.borderColor}`
                }}>
                  {item.tierAr}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '13.5px', fontWeight: '900' }}>
                    #{item.rank}
                  </strong>
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '11.5px' }}>
                    ({item.points} نقطة)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamificationLeaguesHistory;
