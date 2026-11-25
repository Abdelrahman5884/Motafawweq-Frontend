import React, { useMemo } from 'react';
import {
  Layers,
  UserPlus,
  RefreshCw,
  Search,
  X,
  Crown,
  Sparkles,
  UserMinus,
  TrendingUp,
  TrendingDown,
  Flame,
} from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { LEAGUE_TIERS, TIER_MAP } from './leagueConstants';

export const LeagueLeaderboardTable = ({
  league,
  searchQuery,
  onSearchChange,
  tierFilter,
  onTierFilterChange,
  isLoadingDetails,
  isRecalculating,
  onRecalculate,
  onOpenAddStudent,
  onSelectStudent,
  onAwardXp,
  onRemoveParticipant,
  lang,
  isDark,
  isMobile,
}) => {
  const isAr = lang === 'ar';
  const rawLeaderboard = league?.leaderboard;
  const allParticipants = useMemo(
    () => (Array.isArray(rawLeaderboard) ? rawLeaderboard : []),
    [rawLeaderboard]
  );

  const tierCounts = useMemo(() => {
    const counts = { all: allParticipants.length, Diamond: 0, Gold: 0, Silver: 0, Bronze: 0 };
    allParticipants.forEach((p) => {
      const t = p.tier || 'Bronze';
      if (counts[t] !== undefined) counts[t] += 1;
    });
    return counts;
  }, [allParticipants]);

  const filtered = useMemo(() => {
    let list = allParticipants;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((st) => {
        const name = String(st.nameAr || '').toLowerCase();
        const code = String(st.studentCode || '').toLowerCase();
        const school = String(st.schoolAr || '').toLowerCase();
        const group = String(st.groupAr || '').toLowerCase();
        return name.includes(q) || code.includes(q) || school.includes(q) || group.includes(q);
      });
    }
    if (tierFilter !== 'all') {
      list = list.filter((st) => (st.tier || 'Bronze') === tierFilter);
    }
    return list;
  }, [allParticipants, searchQuery, tierFilter]);

  const filterTabs = [
    { id: 'all', label: isAr ? 'الكل' : 'All' },
    ...LEAGUE_TIERS.map((t) => ({ id: t.id, label: isAr ? t.labelAr : t.labelEn })),
  ];

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: isMobile ? '16px 12px' : '22px',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Top Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <h3
            style={{
              fontSize: isMobile ? '15px' : '17px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Layers size={16} color="var(--primary)" />
            <span>
              {isAr
                ? `جدول الترتيب العام (${filtered.length})`
                : `Leaderboard Standings (${filtered.length})`}
            </span>
          </h3>

          {league?.id && !league.isConcluded && (
            <>
              <button
                type="button"
                onClick={onOpenAddStudent}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(21, 136, 199, 0.25)',
                }}
              >
                <UserPlus size={14} />
                <span>{isAr ? 'إضافة طالب' : 'Add Student'}</span>
              </button>

              <button
                type="button"
                onClick={onRecalculate}
                disabled={isRecalculating}
                title={isAr ? 'مزامنة الطلاب وتحديث الترتيب من نتائج الامتحانات والستريك' : 'Sync enrolled students and recalculate ranks'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 11px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-medium)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: isRecalculating ? 'wait' : 'pointer',
                  opacity: isRecalculating ? 0.7 : 1,
                }}
              >
                <RefreshCw
                  size={13}
                  style={isRecalculating ? { animation: 'spin 0.8s linear infinite' } : undefined}
                />
                <span>
                  {isRecalculating
                    ? (isAr ? 'جاري التحديث...' : 'Syncing...')
                    : (isAr ? 'تحديث الترتيب' : 'Recalculate')}
                </span>
              </button>
            </>
          )}
        </div>

        {/* Search & Tier Filters */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          <div
            style={{
              flex: isMobile ? '1 1 100%' : 'initial',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '6px 10px',
            }}
          >
            <Search size={13} color="var(--text-secondary)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isAr ? 'بحث بالاسم أو الكود...' : 'Search name or code...'}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '12px',
                color: 'var(--text-primary)',
                width: isMobile ? '100%' : '155px',
                fontFamily: 'inherit',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: 0,
                  display: 'flex',
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '10px',
              padding: '3px',
              gap: '2px',
              flexWrap: 'wrap',
            }}
          >
            {filterTabs.map((t) => {
              const active = tierFilter === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onTierFilterChange(t.id)}
                  style={{
                    border: 'none',
                    borderRadius: '7px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: active ? '800' : '600',
                    backgroundColor: active ? 'var(--primary)' : 'transparent',
                    color: active ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {t.label} ({tierCounts[t.id] ?? 0})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content States */}
      {isLoadingDetails ? (
        <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '700' }}>
          {isAr ? 'جاري تحميل جدول الترتيب...' : 'Loading leaderboard...'}
        </div>
      ) : allParticipants.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {isAr ? 'لا يوجد طلاب مشتركون في هذا الدوري بعد' : 'No participants in this league yet'}
          </div>
          <div style={{ fontSize: '12px', marginBottom: '14px' }}>
            {isAr
              ? 'يمكنك إضافة طلاب يدوياً بالاسم أو كود الطالب، أو الضغط على "تحديث الترتيب" لمزامنة طلاب المجموعة.'
              : 'Add students manually by name or student code, or click Recalculate to sync enrolled group students.'}
          </div>
          <button
            type="button"
            onClick={onOpenAddStudent}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <UserPlus size={14} />
            <span>{isAr ? 'إضافة أول طالب' : 'Add First Student'}</span>
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '28px 16px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {isAr ? 'لا توجد نتائج مطابقة للبحث أو التصنيف المحدد' : 'No matching participants'}
          </div>
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              onTierFilterChange('all');
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '9px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              color: 'var(--primary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map((st) => {
            const isTop3 = Number(st.rank) <= 3;
            const tierMeta = TIER_MAP[st.tier] || TIER_MAP.Bronze;
            const perfectExams = Number(st.perfectExams ?? 0);
            const examsSolved = Number(st.examsSolved ?? 0);
            const streakDays = Number(st.streak ?? 0);
            const xpScore = Number(st.score ?? 0);

            return (
              <div
                key={st.id || st.studentId}
                onClick={() => onSelectStudent(st)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStudent(st);
                  }
                }}
                role="button"
                tabIndex={0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: isMobile ? '10px 10px' : '11px 16px',
                  borderRadius: '14px',
                  backgroundColor: isTop3
                    ? (isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.05)')
                    : 'var(--bg-subtle)',
                  border: isTop3
                    ? '1.5px solid rgba(245, 158, 11, 0.25)'
                    : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  gap: '10px',
                  flexWrap: isMobile ? 'wrap' : 'nowrap',
                }}
              >
                {/* Left: Rank, Movement, Avatar, Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px', minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, gap: '2px' }}>
                    <span
                      style={{
                        width: isMobile ? '26px' : '30px',
                        height: isMobile ? '26px' : '30px',
                        borderRadius: '8px',
                        backgroundColor:
                          st.rank === 1
                            ? '#F59E0B'
                            : st.rank === 2
                            ? '#38BDF8'
                            : st.rank === 3
                            ? '#EA580C'
                            : 'var(--border-subtle)',
                        color: isTop3 ? '#FFFFFF' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isMobile ? '11px' : '12.5px',
                        fontWeight: '900',
                      }}
                    >
                      #{st.rank}
                    </span>
                    {st.movement === 'up' && <TrendingUp size={11} color="#10B981" />}
                    {st.movement === 'down' && <TrendingDown size={11} color="#EF4444" />}
                  </div>

                  <Avatar
                    src={st.avatar}
                    name={st.nameAr}
                    size={isMobile ? 36 : 42}
                    border={isTop3 ? '2px solid #F59E0B' : '1.5px solid var(--border-medium)'}
                  />

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: isMobile ? '13px' : '14px',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {st.nameAr}
                      </span>
                      {st.rank === 1 && <Crown size={13} color="#F59E0B" style={{ flexShrink: 0 }} />}
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '1px 7px',
                          borderRadius: '6px',
                          backgroundColor: tierMeta.bg,
                          color: tierMeta.color,
                          flexShrink: 0,
                        }}
                      >
                        {isAr ? tierMeta.labelAr : tierMeta.labelEn}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: isMobile ? '10.5px' : '11.5px',
                        color: 'var(--text-muted)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginTop: '1px',
                      }}
                    >
                      {st.studentCode ? `${st.studentCode} • ` : ''}
                      {st.schoolAr ? `${st.schoolAr} • ` : ''}
                      <span style={{ color: 'var(--primary)' }}>
                        {st.groupAr || league.groupNameAr}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Real Metrics + XP + Quick Actions */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '8px' : '14px',
                    flexShrink: 0,
                    marginInlineStart: 'auto',
                  }}
                >
                  {!isMobile && (
                    <>
                      <div style={{ textAlign: 'center', minWidth: '48px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '900', color: '#10B981' }}>
                          {perfectExams}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          {isAr ? 'فول مارك' : 'Full Mark'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'center', minWidth: '48px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {examsSolved}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          {isAr ? 'امتحان' : 'Exams'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'center', minWidth: '48px' }}>
                        <div
                          style={{
                            fontSize: '12.5px',
                            fontWeight: '800',
                            color: '#D97706',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          <Flame size={12} />
                          <span>{streakDays}</span>
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          {isAr ? 'ستريك' : 'Streak'}
                        </div>
                      </div>
                    </>
                  )}

                  <div style={{ textAlign: 'center', minWidth: isMobile ? '64px' : '82px' }}>
                    <div style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: '900', color: 'var(--primary)' }}>
                      {xpScore.toLocaleString()} XP
                    </div>
                  </div>

                  {/* Action Buttons (disabled once league is ended/crowned) */}
                  {!league.isConcluded && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAwardXp(st);
                        }}
                        title={isAr ? 'منح نقاط بونص للطالب' : 'Award Bonus XP'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: isMobile ? '5px 8px' : '6px 10px',
                          borderRadius: '9px',
                          backgroundColor: 'rgba(245, 158, 11, 0.14)',
                          border: '1px solid rgba(245, 158, 11, 0.35)',
                          color: isDark ? '#FBBF24' : '#B45309',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer',
                        }}
                      >
                        <Sparkles size={12} />
                        <span>{isAr ? '+ بونص' : '+ XP'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveParticipant(st);
                        }}
                        title={isAr ? 'إزالة الطالب من الدوري' : 'Remove from league'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px',
                          borderRadius: '9px',
                          backgroundColor: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          color: '#EF4444',
                          cursor: 'pointer',
                        }}
                      >
                        <UserMinus size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeagueLeaderboardTable;
