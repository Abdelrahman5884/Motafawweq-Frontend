import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Medal,
  ChevronLeft,
  ChevronRight,
  Award,
  Crown,
  Flame,
  Shield,
  Clock,
  Globe,
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

function getTierPalette(tier) {
  switch (tier) {
    case 'Diamond':
      return {
        accent: '#0EA5E9',
        border: 'rgba(14, 165, 233, 0.38)',
        badgeBg: 'rgba(14, 165, 233, 0.14)',
        glow: 'rgba(14, 165, 233, 0.16)',
        cardLight: 'linear-gradient(160deg, #FFFFFF 0%, #F0F9FF 100%)',
      };
    case 'Gold':
      return {
        accent: '#F59E0B',
        border: 'rgba(245, 158, 11, 0.38)',
        badgeBg: 'rgba(245, 158, 11, 0.14)',
        glow: 'rgba(245, 158, 11, 0.16)',
        cardLight: 'linear-gradient(160deg, #FFFFFF 0%, #FFFBEB 100%)',
      };
    case 'Silver':
      return {
        accent: '#64748B',
        border: 'rgba(100, 116, 139, 0.35)',
        badgeBg: 'rgba(100, 116, 139, 0.14)',
        glow: 'rgba(100, 116, 139, 0.14)',
        cardLight: 'linear-gradient(160deg, #FFFFFF 0%, #F8FAFC 100%)',
      };
    default:
      return {
        accent: '#B45309',
        border: 'rgba(180, 83, 9, 0.32)',
        badgeBg: 'rgba(180, 83, 9, 0.12)',
        glow: 'rgba(180, 83, 9, 0.12)',
        cardLight: 'linear-gradient(160deg, #FFFFFF 0%, #FFF7ED 100%)',
      };
  }
}

function resolvePastRankLabel(item, isAr) {
  if (!item.rank || item.rank <= 0) {
    return isAr ? 'مشارك' : 'Participant';
  }
  if (item.rank === 1) {
    if (item.isRepublicLeague) {
      return isAr ? 'المركز #1 (بطل الجمهورية)' : 'Rank #1 (Republic Champion)';
    }
    return isAr ? 'المركز #1 (بطل الكورس)' : 'Rank #1 (Course Champion)';
  }
  return isAr ? `المركز #${item.rank}` : `Rank #${item.rank}`;
}

export const GamificationLeaguesHistory = ({
  generalLeague = null,
  activeTeacherLeagues = [],
  pastLeagues = [],
  lang = 'ar',
}) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const isAr = lang === 'ar';

  const activeLeagues = [
    ...(generalLeague && generalLeague.hasStarted ? [generalLeague] : []),
    ...activeTeacherLeagues,
  ];

  const cardBgDark = 'linear-gradient(160deg, rgba(30, 41, 59, 0.88) 0%, rgba(15, 23, 42, 0.96) 100%)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ── 1. Active Leagues Arena ── */}
      <div
        style={{
          position: 'relative',
          background: isDark
            ? 'radial-gradient(ellipse at 50% 0%, #152238 0%, #0A1120 75%, #060A13 100%)'
            : 'radial-gradient(ellipse at 50% 0%, #E0F2FE 0%, #F1F5F9 60%, #F8FAFC 100%)',
          border: isDark ? '1px solid rgba(56, 189, 248, 0.22)' : '1px solid rgba(2, 132, 199, 0.22)',
          borderRadius: '22px',
          padding: '24px 26px',
          boxShadow: isDark
            ? '0 14px 36px -10px rgba(0, 0, 0, 0.55)'
            : '0 10px 26px -8px rgba(14, 165, 233, 0.14)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? 'rgba(245, 158, 11, 0.16)' : 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  color: '#F59E0B',
                  fontSize: '11px',
                  fontWeight: '800',
                }}
              >
                <Trophy size={13} />
                <span>{isAr ? 'ساحة البطولات الجارية' : 'Active Leagues Arena'}</span>
              </span>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 9px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.1)',
                  color: isDark ? '#38BDF8' : '#0284C7',
                  fontSize: '11px',
                  fontWeight: '800',
                }}
              >
                <span>
                  {isAr ? `${activeLeagues.length} دوري نشط` : `${activeLeagues.length} Active`}
                </span>
              </span>
            </div>

            <h2
              style={{
                fontSize: '18px',
                fontWeight: '900',
                color: isDark ? '#FFFFFF' : '#0F172A',
                margin: '6px 0 2px',
                fontFamily: 'var(--font-arabic)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Crown size={20} color="#F59E0B" />
              <span>{isAr ? 'ترتيبي في الدوريات النشطة' : 'My Standings in Active Leagues'}</span>
            </h2>
            <p
              style={{
                fontSize: '12.5px',
                color: isDark ? '#94A3B8' : '#64748B',
                margin: 0,
                fontFamily: 'var(--font-arabic)',
              }}
            >
              {isAr
                ? 'مركزك الحالي وفئتك ونقاطك الرسمية في الدوريات المفتوحة الآن'
                : 'Your live rank, tier, and official rule points across open leagues'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/student/league')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '9px 16px',
              borderRadius: '12px',
              background: isDark
                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(2, 132, 199, 0.28) 100%)'
                : 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              border: isDark ? '1px solid rgba(245, 158, 11, 0.4)' : 'none',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.22)',
            }}
          >
            <Trophy size={14} color="#FDE68A" />
            <span>{isAr ? 'استعراض الدوري الكامل' : 'Open Full Leagues'}</span>
            {isAr ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
          </button>
        </div>

        {/* Active Leagues Grid */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '16px',
          }}
        >
          {activeLeagues.length === 0 && (
            <div
              style={{
                padding: '24px',
                textAlign: 'center',
                borderRadius: '14px',
                border: isDark ? '1px dashed rgba(148, 163, 184, 0.25)' : '1px dashed rgba(15, 23, 42, 0.14)',
                color: isDark ? '#94A3B8' : '#64748B',
                fontSize: '13.5px',
                fontWeight: '700',
              }}
            >
              {isAr
                ? 'لا توجد دوريات نشطة حالياً. سيظهر ترتيبك هنا تلقائياً فور إطلاق معلمك أو الإدارة لدوري جديد.'
                : 'No active leagues right now. Your standings will appear here once a league starts.'}
            </div>
          )}

          {activeLeagues.map((item) => {
            const palette = getTierPalette(item.tier);
            const hasRank = Number(item.myRank) > 0;
            const isRep = Boolean(item.isRepublicLeague || item.category === 'general');

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/student/league?league=${encodeURIComponent(item.id)}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/student/league?league=${encodeURIComponent(item.id)}`);
                  }
                }}
                style={{
                  position: 'relative',
                  background: isDark ? cardBgDark : palette.cardLight,
                  border: `1.5px solid ${palette.border}`,
                  borderRadius: '18px',
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isDark
                    ? `0 8px 22px -6px ${palette.glow}`
                    : `0 6px 18px -6px ${palette.glow}`,
                  cursor: 'pointer',
                  textAlign: 'start',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      marginBottom: '12px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '3px 10px',
                        borderRadius: '8px',
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.05)',
                        color: isDark ? '#E2E8F0' : '#334155',
                      }}
                    >
                      {isRep && <Globe size={12} color="#F59E0B" />}
                      <span>{item.courseTitleAr || item.titleAr}</span>
                    </span>

                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 10px',
                        borderRadius: '8px',
                        backgroundColor: palette.badgeBg,
                        color: palette.accent,
                        border: `1px solid ${palette.border}`,
                        fontSize: '11px',
                        fontWeight: '900',
                      }}
                    >
                      {item.myRank === 1 ? (
                        <Crown size={12} color={palette.accent} />
                      ) : (
                        <Medal size={12} color={palette.accent} />
                      )}
                      <span>{item.tierLabelAr || (isAr ? 'دوري برونزي' : 'Bronze')}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: '900',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      marginBottom: '3px',
                    }}
                  >
                    {item.titleAr}
                  </div>

                  <div
                    style={{
                      fontSize: '12px',
                      color: isDark ? '#94A3B8' : '#64748B',
                      marginBottom: '12px',
                    }}
                  >
                    {isRep
                      ? isAr
                        ? 'دوري الجمهورية العام على مستوى المنصة'
                        : 'Platform-wide General Republic League'
                      : item.teacherName || item.groupNameAr || ''}
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      color: palette.accent,
                      marginBottom: '14px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      <span>
                        {isAr ? `متبقي ${item.daysRemaining ?? 0} يوم` : `${item.daysRemaining ?? 0}d left`}
                      </span>
                    </span>
                    {Number(item.myStreak) > 0 && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Flame size={12} />
                        <span>
                          {isAr ? `استريك ${item.myStreak} يوم` : `${item.myStreak}d streak`}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer: Rank & Points */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: isDark
                      ? '1px solid rgba(255, 255, 255, 0.08)'
                      : '1px solid rgba(15, 23, 42, 0.08)',
                    fontSize: '12.5px',
                  }}
                >
                  <div>
                    <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '11.5px' }}>
                      {isAr ? 'المركز: ' : 'Rank: '}
                    </span>
                    {hasRank ? (
                      <>
                        <strong style={{ color: palette.accent, fontSize: '15px', fontWeight: '900' }}>
                          #{item.myRank}
                        </strong>
                        <span style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B' }}>
                          {' '}
                          / {item.participantsCount || 0}
                        </span>
                      </>
                    ) : (
                      <strong style={{ color: isDark ? '#CBD5E1' : '#475569', fontSize: '12.5px' }}>
                        {isAr ? 'غير مصنف بعد' : 'Unranked'}
                      </strong>
                    )}
                  </div>

                  <div>
                    <strong style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '14.5px', fontWeight: '900' }}>
                      {Number(item.myXp || 0).toLocaleString()}
                    </strong>
                    <span
                      style={{
                        fontSize: '11px',
                        color: isDark ? '#94A3B8' : '#64748B',
                        marginInlineStart: '4px',
                      }}
                    >
                      {isAr ? 'نقطة' : 'pts'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2. Past Leagues & Seasons Archive (Hall of Fame) ── */}
      <div
        style={{
          position: 'relative',
          background: isDark
            ? 'radial-gradient(ellipse at 50% 0%, #171E31 0%, #0A101D 70%, #060911 100%)'
            : 'radial-gradient(ellipse at 50% 0%, #FEF3C7 0%, #F8FAFC 60%, #F1F5F9 100%)',
          border: isDark ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '22px',
          padding: '24px 26px',
          boxShadow: isDark
            ? '0 14px 36px -10px rgba(0, 0, 0, 0.55)'
            : '0 10px 26px -8px rgba(245, 158, 11, 0.12)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 10px',
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(245, 158, 11, 0.16)' : 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#F59E0B',
                fontSize: '11px',
                fontWeight: '800',
              }}
            >
              <Shield size={13} />
              <span>{isAr ? 'قاعة المشاهير والأرشيف' : 'Hall of Fame & Archive'}</span>
            </span>

            <h2
              style={{
                fontSize: '18px',
                fontWeight: '900',
                color: isDark ? '#FFFFFF' : '#0F172A',
                margin: '6px 0 2px',
                fontFamily: 'var(--font-arabic)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Trophy size={20} color="#F59E0B" />
              <span>{isAr ? 'سجل ترتيبي في الدوريات المنتهية' : 'Finished Leagues Archive'}</span>
            </h2>
            <p
              style={{
                fontSize: '12.5px',
                color: isDark ? '#94A3B8' : '#64748B',
                margin: 0,
              }}
            >
              {isAr
                ? 'أرشيف المراكز النهائية والنقاط التي حققتها في الجولات المكتملة'
                : 'Your final standings and points from completed league rounds'}
            </p>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          {pastLeagues.length === 0 && (
            <div
              style={{
                padding: '22px',
                textAlign: 'center',
                borderRadius: '14px',
                border: isDark ? '1px dashed rgba(148, 163, 184, 0.25)' : '1px dashed rgba(15, 23, 42, 0.14)',
                color: isDark ? '#94A3B8' : '#64748B',
                fontSize: '13.5px',
                fontWeight: '700',
              }}
            >
              {isAr ? 'لا توجد جولات سابقة مسجلة في الأرشيف حتى الآن.' : 'No completed league rounds in your archive yet.'}
            </div>
          )}

          {pastLeagues.map((item) => {
            const palette = getTierPalette(item.tier);
            return (
              <div
                key={item.id}
                style={{
                  background: isDark ? cardBgDark : palette.cardLight,
                  border: `1.5px solid ${palette.border}`,
                  borderRadius: '18px',
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isDark
                    ? `0 8px 22px -6px ${palette.glow}`
                    : `0 6px 18px -6px ${palette.glow}`,
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      marginBottom: '10px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 10px',
                        borderRadius: '8px',
                        backgroundColor: palette.badgeBg,
                        color: palette.accent,
                        border: `1px solid ${palette.border}`,
                        fontSize: '11px',
                        fontWeight: '900',
                      }}
                    >
                      {item.rank === 1 ? (
                        <Crown size={12} color={palette.accent} />
                      ) : (
                        <Award size={12} color={palette.accent} />
                      )}
                      <span>{resolvePastRankLabel(item, isAr)}</span>
                    </div>

                    {item.dateAr && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          color: isDark ? '#94A3B8' : '#64748B',
                        }}
                      >
                        {item.dateAr}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: '14.5px',
                      fontWeight: '900',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      marginBottom: '4px',
                      lineHeight: 1.4,
                    }}
                  >
                    {item.titleAr}
                  </div>

                  <div
                    style={{
                      fontSize: '11.5px',
                      color: isDark ? '#94A3B8' : '#64748B',
                      marginBottom: '14px',
                    }}
                  >
                    {[item.courseTitleAr || item.seasonAr, item.teacherName].filter(Boolean).join(' • ')}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: isDark
                      ? '1px solid rgba(255, 255, 255, 0.08)'
                      : '1px solid rgba(15, 23, 42, 0.08)',
                    fontSize: '12px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      color: palette.accent,
                      backgroundColor: palette.badgeBg,
                      padding: '3px 10px',
                      borderRadius: '8px',
                      border: `1px solid ${palette.border}`,
                    }}
                  >
                    {item.tierAr}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.rank > 0 && (
                      <strong style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '13.5px', fontWeight: '900' }}>
                        #{item.rank}
                        {item.totalCompetitors > 0 ? ` / ${item.totalCompetitors}` : ''}
                      </strong>
                    )}
                    <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '11.5px', fontWeight: '700' }}>
                      ({Number(item.points || 0).toLocaleString()} {isAr ? 'نقطة' : 'pts'})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GamificationLeaguesHistory;
