import React from 'react';
import { ChevronLeft, ChevronRight, Flame, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { LeagueAvatar } from './LeagueAvatar';

const TIER_COLORS = {
  Diamond: { color: '#0284C7', bg: 'rgba(14, 165, 233, 0.12)' },
  Gold: { color: '#D97706', bg: 'rgba(245, 158, 11, 0.14)' },
  Silver: { color: '#475569', bg: 'rgba(100, 116, 139, 0.14)' },
  Bronze: { color: '#B45309', bg: 'rgba(180, 83, 9, 0.12)' },
};

export const LeagueLeaderboardTable = ({
  students = [],
  totalInLeague = 0,
  lang = 'ar',
  isRtl = true,
  onSelectStudent,
}) => {
  const isAr = lang === 'ar';

  if (students.length === 0) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: '18px',
          padding: '44px 24px',
          textAlign: 'center',
          color: 'var(--text-secondary)',
        }}
      >
        <div style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
          {totalInLeague > 0
            ? isAr
              ? 'لا يوجد طلاب مطابقون للفلتر أو البحث الحالي'
              : 'No Students Match Current Filter'
            : isAr
              ? 'لا يوجد متنافسون في هذا الدوري حتى الآن'
              : 'No Competitors Yet'}
        </div>
        <div style={{ fontSize: '13px' }}>
          {totalInLeague > 0
            ? isAr
              ? 'جرّب اختيار «جميع المستويات» أو مسح البحث لعرض كامل الترتيب.'
              : 'Try selecting All Tiers or clearing the search box.'
            : isAr
              ? 'سيظهر الترتيب تلقائياً فور بدء حل الامتحانات والحفاظ على الاستريك اليومي.'
              : 'Rankings update automatically as students solve exams and build their daily streak.'}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {students.map((item, idx) => {
          const isMe = item.isMe;
          const tierStyle = TIER_COLORS[item.tier] || TIER_COLORS.Bronze;
          const rankColor =
            item.rank === 1
              ? '#D97706'
              : item.rank === 2
                ? 'var(--primary)'
                : item.rank === 3
                  ? '#B45309'
                  : 'var(--text-secondary)';
          const rankBg =
            item.rank === 1
              ? 'rgba(245, 158, 11, 0.14)'
              : item.rank === 2
                ? 'var(--primary-surface)'
                : item.rank === 3
                  ? 'rgba(217, 119, 6, 0.12)'
                  : 'var(--bg-subtle)';

          const subMeta = [item.groupAr, item.schoolAr].filter(Boolean).join(' • ');

          return (
            <div
              key={`${item.rank}-${item.nameAr}-${idx}`}
              className="league-row-item"
              onClick={() => onSelectStudent?.(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectStudent?.(item);
                }
              }}
              role="button"
              tabIndex={0}
              style={{
                padding: '13px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                backgroundColor: isMe ? 'rgba(21, 136, 199, 0.08)' : undefined,
                borderBottom: idx < students.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                cursor: 'pointer',
              }}
            >
              {/* Rank + Avatar + Name/Tier */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: rankBg,
                    color: rankColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '13.5px',
                    flexShrink: 0,
                  }}
                >
                  {item.rank}
                </div>

                <LeagueAvatar
                  src={item.avatar}
                  name={item.nameAr}
                  size={40}
                  borderColor={isMe ? 'var(--primary)' : 'var(--border-subtle)'}
                />

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: '800',
                        color: isMe ? 'var(--primary)' : 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.nameAr}
                    </span>

                    {isMe && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '1px 6px',
                          borderRadius: '5px',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                        }}
                      >
                        {isAr ? 'أنت' : 'You'}
                      </span>
                    )}

                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: '800',
                        padding: '1px 7px',
                        borderRadius: '6px',
                        backgroundColor: tierStyle.bg,
                        color: tierStyle.color,
                      }}
                    >
                      {item.tierLabelAr}
                    </span>

                    {item.streak > 0 && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#EA580C',
                          backgroundColor: 'rgba(234, 88, 12, 0.08)',
                          padding: '1px 6px',
                          borderRadius: '6px',
                        }}
                      >
                        <Flame size={11} />
                        <span>{item.streak}</span>
                      </span>
                    )}
                  </div>

                  {subMeta && (
                    <div
                      style={{
                        fontSize: '11.5px',
                        color: 'var(--text-secondary)',
                        marginTop: '2px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {subMeta}
                    </div>
                  )}
                </div>
              </div>

              {/* XP Score + Real Rank Movement */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                  <div
                    style={{
                      fontSize: '14.5px',
                      fontWeight: '900',
                      color: isMe ? 'var(--primary)' : 'var(--text-primary)',
                    }}
                  >
                    {item.score.toLocaleString()} XP
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color:
                        item.rankChange > 0
                          ? '#059669'
                          : item.rankChange < 0
                            ? '#DC2626'
                            : 'var(--text-muted)',
                    }}
                  >
                    {item.rankChange > 0 ? (
                      <>
                        <ArrowUp size={11} />
                        <span>+{item.rankChange}</span>
                      </>
                    ) : item.rankChange < 0 ? (
                      <>
                        <ArrowDown size={11} />
                        <span>{item.rankChange}</span>
                      </>
                    ) : (
                      <>
                        <Minus size={11} />
                        <span>{isAr ? 'ثابت' : 'Steady'}</span>
                      </>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isRtl ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
