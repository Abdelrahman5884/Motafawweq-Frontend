import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Medal, 
  UserCheck, 
  Calendar, 
  ArrowRight,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';

export const GamificationLeaguesHistory = ({ lang = 'ar' }) => {
  const navigate = useNavigate();

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
      medal: '🥈'
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
      statusAr: 'متصدر المجموعة',
      medal: '🥇'
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
      statusAr: 'منصة التتويج',
      medal: '🥉'
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
      medal: '🎖️'
    }
  ];

  // Past leagues archive
  const pastLeagues = [
    {
      id: 'past-1',
      titleAr: 'دوري الأحياء الأسبوعي (الجولة السابقة)',
      seasonAr: 'الأسبوع الثاني - سبتمبر 2026',
      rank: 2,
      points: '3,450',
      badgeAr: 'وسام التميز الفضي',
      tierAr: 'دوري النخبة الماسي',
      dateAr: '18 سبتمبر 2026',
      medal: '🥈'
    },
    {
      id: 'past-2',
      titleAr: 'دوري المتفوقين لشهر أغسطس (على مستوى الجمهورية)',
      seasonAr: 'الموسم الصيفي التأسيسي',
      rank: 1,
      points: '4,820',
      badgeAr: 'درع المتفوق الذهبي الأول',
      tierAr: 'بطل الجمهورية',
      dateAr: '31 أغسطس 2026',
      medal: '🥇'
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
      medal: '🥈'
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
      medal: '🥉'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', marginBottom: '28px' }}>
      {/* 1. Teacher Course Leagues Ranking */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '22px 24px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={18} color="var(--primary)" />
              <h3 style={{
                fontSize: '16px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                margin: 0,
                fontFamily: 'var(--font-arabic)'
              }}>
                {lang === 'ar' ? 'ترتيبي في دوريات كورسات المعلمين' : 'Rankings in Teacher Leagues'}
              </h3>
            </div>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              margin: '3px 0 0 0',
              fontFamily: 'var(--font-arabic)'
            }}>
              {lang === 'ar' ? 'مركزك التنافسي ونقاطك مع كل معلم في الكورسات المشترك بها' : 'Your standing with each teacher across enrolled courses'}
            </p>
          </div>

          <button
            onClick={() => navigate('/student/league')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--primary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{lang === 'ar' ? 'استعراض الدوري الكامل' : 'View Full League'}</span>
            <ChevronLeft size={14} />
          </button>
        </div>

        {/* Teachers List */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '14px'
        }}>
          {teacherLeagues.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {item.subject}
                  </span>
                  <span style={{ fontSize: '18px' }}>{item.medal}</span>
                </div>

                <div style={{
                  fontSize: '14px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '2px'
                }}>
                  {item.teacherName}
                </div>
                <div style={{
                  fontSize: '11.5px',
                  color: 'var(--text-secondary)',
                  marginBottom: '12px'
                }}>
                  {item.courseTitle}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '12px'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>{lang === 'ar' ? 'المركز: ' : 'Rank: '}</span>
                  <strong style={{ color: 'var(--primary)', fontSize: '13px' }}>#{item.rank}</strong>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}> / {item.totalStudents}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>{item.xp.toLocaleString()}</strong>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}> XP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Past Leagues Archive */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '22px 24px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Trophy size={18} color="var(--primary)" />
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: 0,
              fontFamily: 'var(--font-arabic)'
            }}>
              {lang === 'ar' ? 'سجل ترتيبي في كل الدوريات السابقة' : 'Past Leagues & Seasons Archive'}
            </h3>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              margin: '3px 0 0 0',
              fontFamily: 'var(--font-arabic)'
            }}>
              {lang === 'ar' ? 'أرشيف نتائجك والمراكز والميداليات التي حققتها في جولات الدوري السابقة' : 'Your final ranks and awards in previous league seasons'}
            </p>
          </div>
        </div>

        {/* Past Leagues Table / Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '14px'
        }}>
          {pastLeagues.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{item.medal}</span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'var(--text-muted)'
                  }}>
                    {item.dateAr}
                  </span>
                </div>

                <div style={{
                  fontSize: '13.5px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '4px',
                  lineHeight: 1.35
                }}>
                  {item.titleAr}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  marginBottom: '12px'
                }}>
                  {item.seasonAr}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '12px'
              }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  {item.tierAr}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>#{item.rank}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({item.points} نقطة)</span>
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
