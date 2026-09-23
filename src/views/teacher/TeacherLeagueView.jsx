import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { TEACHER_COURSE_LEAGUE } from '../../data/teacherData';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Award, 
  Sparkles, 
  Flame, 
  Users, 
  Send, 
  Star,
  CheckCircle2
} from 'lucide-react';

export const TeacherLeagueView = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();

  const league = TEACHER_COURSE_LEAGUE;
  const [publishedNotice, setPublishedNotice] = useState(false);

  const handleAnnounceWinners = () => {
    setPublishedNotice(true);
    setTimeout(() => setPublishedNotice(false), 3000);
  };

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '32px 24px 80px',
      fontFamily: 'var(--font-arabic)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '26px'
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
              color: '#F59E0B',
              fontSize: '11px',
              fontWeight: '800'
            }}>
              <Trophy size={13} />
              <span>{lang === 'ar' ? 'بطولة الكورس والمنافسات الطلابية' : 'Course League Arena'}</span>
            </span>
          </div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Crown size={24} color="#F59E0B" />
            <span>{lang === 'ar' ? 'إدارة دوري الكورس وصدارة المتفوقين' : 'Teacher Course League Leaderboard'}</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            {lang === 'ar' 
              ? 'متابعة ترتيب طلاب كورساتك، منصة التتويج، ومنح نقاط الـ XP وأوسمة الشرف الأسبوعية' 
              : 'Track student standings, manage podium rewards, and distribute weekly honors'}
          </p>
        </div>

        <button
          onClick={handleAnnounceWinners}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '800',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
            transition: 'all 0.15s ease'
          }}
        >
          <Award size={16} />
          <span>{lang === 'ar' ? 'إعلان وتكريم أبطال الأسبوع' : 'Announce Champions'}</span>
        </button>
      </div>

      {publishedNotice && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '12px',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid #10B981',
          color: '#10B981',
          fontSize: '13px',
          fontWeight: '800',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          <span>تم إعلان التتويج الأسبوعي وإرسال إشعار فوري لجميع طلاب الكورس (4,120 طالباً)!</span>
        </div>
      )}

      {/* Top Championship Arena Podium Banner */}
      <div style={{
        position: 'relative',
        background: isDark 
          ? 'radial-gradient(ellipse at 50% 0%, #152238 0%, #0A1120 75%, #060A13 100%)' 
          : 'radial-gradient(ellipse at 50% 0%, #FEF3C7 0%, #F1F5F9 60%, #F8FAFC 100%)',
        border: isDark ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(245, 158, 11, 0.35)',
        borderRadius: '24px',
        padding: '28px',
        boxShadow: isDark 
          ? '0 16px 40px -10px rgba(0, 0, 0, 0.6)' 
          : '0 12px 30px -8px rgba(245, 158, 11, 0.15)',
        overflow: 'hidden',
        marginBottom: '28px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#F59E0B' }}>
              {league.seasonAr}
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A', margin: '2px 0 0' }}>
              منصة التتويج والمراكز الثلاثة الأولى (Top 3 Podium)
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: '8px',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)',
              color: isDark ? '#E2E8F0' : '#334155',
              fontSize: '12px',
              fontWeight: '800'
            }}>
              {league.totalCompetitors.toLocaleString()} طالب متنافس
            </span>
          </div>
        </div>

        {/* 3 Podium Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {league.podium.map((st) => (
            <div
              key={st.rank}
              style={{
                position: 'relative',
                background: st.rank === 1
                  ? (isDark ? 'linear-gradient(145deg, rgba(245, 158, 11, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)' : 'linear-gradient(145deg, #FFFBEB 0%, #FFFFFF 100%)')
                  : st.rank === 2
                  ? (isDark ? 'linear-gradient(145deg, rgba(56, 189, 248, 0.16) 0%, rgba(15, 23, 42, 0.9) 100%)' : 'linear-gradient(145deg, #F0F9FF 0%, #FFFFFF 100%)')
                  : (isDark ? 'linear-gradient(145deg, rgba(234, 88, 12, 0.14) 0%, rgba(15, 23, 42, 0.9) 100%)' : 'linear-gradient(145deg, #FFF7ED 0%, #FFFFFF 100%)'),
                border: st.rank === 1
                  ? '1.5px solid #F59E0B'
                  : st.rank === 2
                  ? '1.5px solid #38BDF8'
                  : '1.5px solid #EA580C',
                borderRadius: '20px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: st.rank === 1 ? '0 10px 25px -6px rgba(245, 158, 11, 0.3)' : 'var(--shadow-xs)'
              }}
            >
              <div style={{ position: 'relative', width: '64px', height: '64px', margin: '0 auto 12px' }}>
                <img
                  src={st.avatar}
                  alt={st.nameAr}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `2px solid ${st.rank === 1 ? '#F59E0B' : st.rank === 2 ? '#38BDF8' : '#EA580C'}`
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '-6px',
                  right: '-6px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: st.rank === 1 ? '#F59E0B' : st.rank === 2 ? '#38BDF8' : '#EA580C',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: '900',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  #{st.rank}
                </div>
              </div>

              <div style={{
                fontSize: '15px',
                fontWeight: '900',
                color: isDark ? '#FFFFFF' : '#0F172A',
                marginBottom: '2px'
              }}>
                {st.nameAr}
              </div>
              <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', marginBottom: '10px' }}>
                {st.schoolAr}
              </div>

              <span style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: '8px',
                backgroundColor: st.rank === 1 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                color: st.rank === 1 ? '#F59E0B' : '#0284C7',
                fontSize: '11.5px',
                fontWeight: '800',
                marginBottom: '12px'
              }}>
                {st.badge}
              </span>

              <div style={{
                paddingTop: '10px',
                borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(15, 23, 42, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px'
              }}>
                <span style={{ color: isDark ? '#94A3B8' : '#64748B' }}>النقاط المحققة:</span>
                <strong style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '14px', fontWeight: '900' }}>
                  {st.score.toLocaleString()} XP
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 16px' }}>
          جدول الترتيب العام لطلاب الكورس (Top 8 Standings)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {league.leaderboard.map((st) => (
            <div
              key={st.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: st.rank <= 3 ? 'rgba(21, 136, 199, 0.05)' : 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: st.rank === 1 ? '#F59E0B' : st.rank === 2 ? '#38BDF8' : st.rank === 3 ? '#EA580C' : 'var(--bg-subtle)',
                  color: st.rank <= 3 ? '#FFFFFF' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: '900'
                }}>
                  #{st.rank}
                </span>

                <img
                  src={st.avatar}
                  alt={st.nameAr}
                  style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                />

                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {st.nameAr}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    {st.schoolAr}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#10B981' }}>
                    {st.perfectExams}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>فول مارك</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {st.examsSolved}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>امتحان محلول</div>
                </div>

                <div style={{ textAlign: 'left', minWidth: '90px' }}>
                  <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--primary)' }}>
                    {st.score.toLocaleString()} XP
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>مجموع النقاط</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherLeagueView;
