import React, { useMemo } from 'react';
import {
  ClipboardList,
  HelpCircle,
  Gift,
  GraduationCap,
  BookOpen,
  Search,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { SPage } from '../../components/student/ui';
import '../../features/student/league/league.css';
import {
  LeagueHeroBanner,
  LeaguePodium,
  LeagueLeaderboardTable,
  LeagueRulesTab,
  LeaguePrizesTab,
  StudentAchievementModal,
  useStudentLeague,
} from '../../features/student/league';

export const StudentLeagueView = () => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';
  const lg = useStudentLeague(lang);

  const breadcrumbs = useMemo(
    () => [
      {
        labelAr: 'دوريات المتفوقين',
        labelEn: 'Student Leagues',
      },
    ],
    []
  );
  useSetBreadcrumbs(breadcrumbs);

  const tiers = lg.activeDetail?.tiers || [];
  const rules = lg.activeDetail?.rules || [];
  const prizes = lg.activeDetail?.prizes || [];

  return (
    <SPage maxWidth={1120}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          fontFamily: 'var(--font-arabic, sans-serif)',
          color: 'var(--text-primary)',
          minWidth: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                margin: '0 0 6px 0',
                letterSpacing: '-0.01em',
              }}
            >
              {isAr ? 'دوريات المتفوقين' : 'Student Leagues'}
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {isAr
                ? 'نظام النقاط الرسمي: الصواب والخطأ (+1)، الاختياري (+3)، المقالي (+5)، تقفيل الامتحان (+3)، والاستريك اليومي (+3/يوم)'
                : 'Official points: True/False (+1), MCQ (+3), Essay (+5), Full Mark (+3 bonus), and Daily Streak (+3/day)'}
            </p>
          </div>

          <button
            type="button"
            disabled={lg.loadingBoard || lg.loadingLeagues}
            onClick={lg.handleRefresh}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: lg.loadingBoard ? 'wait' : 'pointer',
            }}
          >
            <RefreshCw size={14} color="var(--primary)" />
            <span>{isAr ? 'تحديث الترتيب' : 'Refresh'}</span>
          </button>
        </div>

        {/* Error Alert */}
        {lg.error && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: '14px',
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: '#DC2626',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={17} />
              <span style={{ fontSize: '13px', fontWeight: '700' }}>{lg.error}</span>
            </div>
            <button
              type="button"
              onClick={lg.handleRefresh}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(220, 38, 38, 0.35)',
                backgroundColor: 'var(--bg-surface)',
                color: '#DC2626',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        )}

        {/* Category & League Switcher */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '18px',
            padding: '14px 18px',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => lg.handleCategorySwitch('general')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '8px 15px',
                borderRadius: '11px',
                border: `1.5px solid ${lg.leagueCategory === 'general' ? 'var(--primary)' : 'transparent'}`,
                backgroundColor: lg.leagueCategory === 'general' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                color: lg.leagueCategory === 'general' ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              <GraduationCap size={16} />
              <span>{isAr ? 'دوري الجمهورية العام' : 'General Republic League'}</span>
            </button>

            <button
              type="button"
              onClick={() => lg.handleCategorySwitch('teachers')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '8px 15px',
                borderRadius: '11px',
                border: `1.5px solid ${lg.leagueCategory === 'teachers' ? 'var(--primary)' : 'transparent'}`,
                backgroundColor: lg.leagueCategory === 'teachers' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                color: lg.leagueCategory === 'teachers' ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              <BookOpen size={16} />
              <span>
                {isAr
                  ? `دوريات كورسات المعلمين (${lg.teacherLeagues.length})`
                  : `Teacher Course Leagues (${lg.teacherLeagues.length})`}
              </span>
            </button>
          </div>

          {lg.leagueCategory === 'teachers' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              {lg.teacherLeagues.length === 0 ? (
                <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  {isAr
                    ? 'لم يطلق معلموك دوريات للكورسات حالياً — يمكنك المنافسة في «دوري الجمهورية العام».'
                    : 'No teacher course leagues yet — compete in the General Republic League.'}
                </span>
              ) : (
                lg.teacherLeagues.map((item) => {
                  const selected = item.id === lg.selectedLeagueId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => lg.handleSelectLeague(item.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 13px',
                        borderRadius: '10px',
                        border: `1px solid ${selected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        backgroundColor: selected ? 'var(--primary)' : 'var(--bg-subtle)',
                        color: selected ? '#FFFFFF' : 'var(--text-primary)',
                        fontSize: '12.5px',
                        fontWeight: selected ? '800' : '700',
                        cursor: 'pointer',
                      }}
                    >
                      <span>{item.titleAr}</span>
                      {!item.isActive && (
                        <span
                          style={{
                            fontSize: '10px',
                            padding: '1px 5px',
                            borderRadius: '5px',
                            backgroundColor: selected ? 'rgba(255,255,255,0.22)' : 'var(--bg-hover)',
                            color: selected ? '#FFFFFF' : 'var(--text-muted)',
                          }}
                        >
                          {isAr ? 'منتهي' : 'Ended'}
                        </span>
                      )}
                      {item.myRank && (
                        <span
                          style={{
                            fontSize: '10.5px',
                            padding: '1px 6px',
                            borderRadius: '6px',
                            backgroundColor: selected ? 'rgba(255, 255, 255, 0.22)' : 'var(--primary-surface)',
                            color: selected ? '#FFFFFF' : 'var(--primary)',
                            fontWeight: '900',
                          }}
                        >
                          #{item.myRank}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {lg.loadingLeagues || (lg.loadingBoard && !lg.activeDetail) ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ height: '185px', borderRadius: '22px', backgroundColor: 'var(--bg-subtle)' }} />
            <div style={{ height: '210px', borderRadius: '20px', backgroundColor: 'var(--bg-subtle)' }} />
          </div>
        ) : lg.activeDetail ? (
          <>
            {/* Hero Status Banner */}
            <LeagueHeroBanner
              activeDetail={lg.activeDetail}
              top1={lg.top1}
              lang={lang}
            />

            {/* Top 3 Podium */}
            <LeaguePodium
              top1={lg.top1}
              top2={lg.top2}
              top3={lg.top3}
              lang={lang}
              leagueSubtitle={lg.activeDetail.courseTitleAr || lg.activeDetail.groupNameAr}
              onSelectStudent={lg.setSelectedStudent}
            />

            {/* Controls Bar: View Tabs + Tier Filters + Search */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              {/* View Tabs */}
              <div
                role="tablist"
                style={{
                  display: 'inline-flex',
                  flexWrap: 'wrap',
                  gap: '4px',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '4px',
                  borderRadius: '13px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {[
                  { id: 'leaderboard', icon: ClipboardList, ar: 'جدول الترتيب', en: 'Leaderboard' },
                  { id: 'rules', icon: HelpCircle, ar: 'قواعد النقاط', en: 'Scoring Rules' },
                  { id: 'prizes', icon: Gift, ar: 'جوائز الدوري', en: 'Prizes' },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = lg.activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => lg.setActiveTab(tab.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 14px',
                        borderRadius: '9px',
                        border: 'none',
                        backgroundColor: active ? 'var(--bg-surface-elevated)' : 'transparent',
                        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontSize: '12.5px',
                        fontWeight: active ? '800' : '600',
                        cursor: 'pointer',
                        boxShadow: active ? 'var(--shadow-xs)' : 'none',
                      }}
                    >
                      <Icon size={14} />
                      <span>{isAr ? tab.ar : tab.en}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search (only in leaderboard tab) */}
              {lg.activeTab === 'leaderboard' && (
                <div style={{ position: 'relative', width: '100%', maxWidth: '260px' }}>
                  <Search
                    size={15}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      insetInlineStart: '11px',
                      color: 'var(--text-muted)',
                    }}
                  />
                  <input
                    type="text"
                    value={lg.searchQuery}
                    onChange={(e) => lg.setSearchQuery(e.target.value)}
                    placeholder={isAr ? 'بحث باسم الطالب أو المجموعة...' : 'Search student or group...'}
                    style={{
                      width: '100%',
                      height: '38px',
                      paddingInlineStart: '34px',
                      paddingInlineEnd: lg.searchQuery ? '30px' : '12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      color: 'var(--text-primary)',
                      fontSize: '12.5px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  {lg.searchQuery && (
                    <button
                      type="button"
                      onClick={() => lg.setSearchQuery('')}
                      aria-label={isAr ? 'مسح البحث' : 'Clear search'}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        insetInlineEnd: '8px',
                        border: 'none',
                        background: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Dynamic Tier Filter Pills (only on leaderboard tab) */}
            {lg.activeTab === 'leaderboard' && tiers.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', nameAr: 'جميع المستويات', nameEn: 'All Tiers', count: lg.tierCounts.all },
                  ...tiers.map((t) => ({
                    id: t.id,
                    nameAr: t.nameAr,
                    nameEn: t.nameEn,
                    count: lg.tierCounts[t.id] || 0,
                  })),
                ].map((tier) => {
                  const active = lg.selectedTier === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => lg.setSelectedTier(tier.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '999px',
                        border: `1px solid ${active ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        backgroundColor: active ? 'var(--primary)' : 'var(--bg-surface)',
                        color: active ? '#FFFFFF' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: active ? '800' : '700',
                        cursor: 'pointer',
                      }}
                    >
                      <span>{isAr ? tier.nameAr : tier.nameEn}</span>
                      <span
                        style={{
                          fontSize: '10.5px',
                          padding: '0px 6px',
                          borderRadius: '999px',
                          backgroundColor: active ? 'rgba(255,255,255,0.22)' : 'var(--bg-subtle)',
                          color: active ? '#FFFFFF' : 'var(--text-muted)',
                        }}
                      >
                        {tier.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tab Contents */}
            {lg.activeTab === 'leaderboard' && (
              <LeagueLeaderboardTable
                students={lg.filteredStudents}
                totalInLeague={lg.leaderboard.length}
                lang={lang}
                isRtl={isRtl}
                onSelectStudent={lg.setSelectedStudent}
              />
            )}

            {lg.activeTab === 'rules' && (
              <LeagueRulesTab
                rules={rules}
                tiers={tiers}
                currentTier={lg.activeDetail.myStanding?.tier || ''}
                lang={lang}
              />
            )}

            {lg.activeTab === 'prizes' && (
              <LeaguePrizesTab
                prizes={prizes}
                durationLabelAr={lg.activeDetail.durationLabelAr}
                lang={lang}
              />
            )}
          </>
        ) : null}

        {/* Real Student Metrics Modal */}
        <StudentAchievementModal
          student={lg.selectedStudent}
          leagueTitle={lg.activeDetail?.titleAr || ''}
          onClose={() => lg.setSelectedStudent(null)}
          lang={lang}
        />
      </div>
    </SPage>
  );
};

export default StudentLeagueView;
