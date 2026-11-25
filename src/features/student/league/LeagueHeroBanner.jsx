import React from 'react';
import { Crown, Flame, Clock, Users, TrendingUp, Trophy, CheckCircle2 } from 'lucide-react';
import { LeagueAvatar } from './LeagueAvatar';

export const LeagueHeroBanner = ({ activeDetail, top1, lang = 'ar' }) => {
  const isAr = lang === 'ar';
  if (!activeDetail) return null;

  const standing = activeDetail.myStanding;
  const hasStarted = activeDetail.hasStarted !== false;
  const isActive = activeDetail.isActive !== false;
  const daysRemaining = Number(activeDetail.daysRemaining || 0);

  const countdownLabel = !hasStarted
    ? isAr
      ? 'لم يبدأ بعد'
      : 'Not Started Yet'
    : !isActive
      ? isAr
        ? 'انتهت الجولة'
        : 'Round Finished'
      : daysRemaining > 0
        ? isAr
          ? `متبقي ${daysRemaining} ${daysRemaining === 1 ? 'يوم' : 'أيام'}`
          : `${daysRemaining}d left`
        : activeDetail.endsAt
          ? isAr
            ? `ينتهي ${activeDetail.endsAt}`
            : `Ends ${activeDetail.endsAt}`
          : isAr
            ? 'جولة نشطة'
            : 'Active Round';

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #041935 0%, #06254E 50%, #0B3A6F 100%)',
        borderRadius: '22px',
        padding: '22px 24px',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 32px rgba(6, 37, 78, 0.24)',
        border: '1px solid rgba(92, 182, 219, 0.28)',
      }}
    >
      {/* Top Meta Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              backgroundColor: 'rgba(245, 158, 11, 0.18)',
              border: '1px solid rgba(245, 158, 11, 0.42)',
              color: '#FDE68A',
              fontSize: '12px',
              fontWeight: '800',
            }}
          >
            <Crown size={14} color="#FBBF24" />
            <span>{activeDetail.durationLabelAr || (isAr ? 'دوري المتفوقين' : 'League')}</span>
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '999px',
              backgroundColor: isActive ? 'rgba(16, 185, 129, 0.16)' : 'rgba(148, 163, 184, 0.2)',
              color: isActive ? '#6EE7B7' : '#CBD5E1',
              fontSize: '11.5px',
              fontWeight: '700',
            }}
          >
            <Clock size={12} />
            <span>{countdownLabel}</span>
          </span>
        </div>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '12px',
            color: '#CBD5E1',
            fontWeight: '700',
          }}
        >
          <Users size={14} color="#38BDF8" />
          <span>
            {activeDetail.totalCompetitors} {isAr ? 'متنافس' : 'competitors'}
          </span>
        </span>
      </div>

      {/* Main Content Grid: League Info + Standing vs Current #1 Leader */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '18px',
          alignItems: 'center',
        }}
      >
        {/* Left: League Title + My Real Standing & Tier Progress */}
        <div style={{ minWidth: 0 }}>
          <h2
            style={{
              fontSize: '21px',
              fontWeight: '900',
              margin: '0 0 4px 0',
              color: '#FFFFFF',
              overflowWrap: 'anywhere',
            }}
          >
            {activeDetail.titleAr}
          </h2>
          <div style={{ fontSize: '13px', color: '#CBD5E1', marginBottom: '14px' }}>
            {[activeDetail.courseTitleAr, activeDetail.groupNameAr, activeDetail.teacherName]
              .filter(Boolean)
              .join(' • ')}
          </div>

          {standing && (
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '14px',
                padding: '12px 14px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '15px', fontWeight: '900', color: '#38BDF8' }}>
                    {standing.rank
                      ? isAr
                        ? `مركزك: #${standing.rank}`
                        : `Your Rank: #${standing.rank}`
                      : isAr
                        ? 'ابدأ جمع النقاط للدخول في الترتيب'
                        : 'Start earning XP to rank'}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(56, 189, 248, 0.18)',
                      color: '#BAE6FD',
                    }}
                  >
                    {standing.tierLabelAr}
                  </span>
                </div>

                <span style={{ fontSize: '14px', fontWeight: '900', color: '#FFFFFF' }}>
                  {Number(standing.xpPoints || 0).toLocaleString()} XP
                </span>
              </div>

              {/* Tier Progress Bar */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11.5px',
                    color: '#CBD5E1',
                    marginBottom: '5px',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  {standing.nextTierLabelAr ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <TrendingUp size={12} color="#38BDF8" />
                      <span>
                        {isAr
                          ? `متبقي ${Number(standing.xpToNextTier || 0).toLocaleString()} نقطة للترقية إلى ${standing.nextTierLabelAr}`
                          : `${Number(standing.xpToNextTier || 0).toLocaleString()} XP to ${standing.nextTierLabelAr}`}
                      </span>
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#6EE7B7' }}>
                      <CheckCircle2 size={12} />
                      <span>{isAr ? 'أعلى مستوى في الدوري (الدوري الماسي)' : 'Highest Tier Reached (Diamond)'}</span>
                    </span>
                  )}

                  {standing.rank > 1 && standing.xpToFirst > 0 && (
                    <span style={{ color: '#FDE68A', fontWeight: '700' }}>
                      {isAr
                        ? `فارق الصدارة: ${Number(standing.xpToFirst).toLocaleString()} XP`
                        : `${Number(standing.xpToFirst).toLocaleString()} XP behind #1`}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    height: '7px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.14)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(100, Math.max(4, Number(standing.tierProgressPercent || 0)))}%`,
                      height: '100%',
                      borderRadius: '999px',
                      background: 'linear-gradient(90deg, #38BDF8, #FBBF24)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Current #1 Leader Card (only when a real leader exists) */}
        {top1 && (
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <LeagueAvatar
                src={top1.avatar}
                name={top1.nameAr}
                size={60}
                borderColor="#F59E0B"
                borderWidth={2.5}
                accentBg="rgba(245, 158, 11, 0.2)"
                accentColor="#FDE68A"
                boxShadow="0 0 18px rgba(245, 158, 11, 0.35)"
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  insetInlineEnd: '-4px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: '#F59E0B',
                  color: '#041935',
                  fontSize: '11px',
                  fontWeight: '900',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #06254E',
                }}
              >
                #1
              </div>
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#FBBF24', marginBottom: '2px' }}>
                {top1.badgeTitleAr || (isAr ? 'متصدر الدوري حالياً' : 'Current #1 Leader')}
              </div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '900',
                  color: '#FFFFFF',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: '6px',
                }}
              >
                {top1.nameAr}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    padding: '3px 9px',
                    borderRadius: '8px',
                  }}
                >
                  <Trophy size={12} color="#FBBF24" />
                  <span>{top1.score.toLocaleString()} XP</span>
                </span>

                {top1.streak > 0 && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#FDE68A',
                      backgroundColor: 'rgba(245, 158, 11, 0.14)',
                      padding: '3px 9px',
                      borderRadius: '8px',
                    }}
                  >
                    <Flame size={12} color="#F59E0B" />
                    <span>
                      {top1.streak} {isAr ? 'يوم' : 'd'}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeagueHeroBanner;
