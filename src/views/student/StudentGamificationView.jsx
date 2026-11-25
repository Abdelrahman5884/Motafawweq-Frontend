import React, { useMemo } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { SPage } from '../../components/student/ui';
import {
  GamificationHero,
  GamificationLeaguesHistory,
  StudyActivityHeatmap,
  WeeklyChallenges,
  BadgesShowcase,
  useStudentGamification,
} from '../../features/student/gamification';

export const StudentGamificationView = () => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const gm = useStudentGamification(lang);

  const breadcrumbs = useMemo(
    () => [
      {
        labelAr: 'إنجازاتي وجوائز التفوق',
        labelEn: 'My Achievements & Honors',
      },
    ],
    []
  );
  useSetBreadcrumbs(breadcrumbs);

  return (
    <SPage maxWidth={1120}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
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
              {isAr ? 'لوحة إنجازاتي وجوائز التفوق' : 'My Achievements & Honors'}
            </h1>
            <p
              style={{
                fontSize: '13.5px',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {isAr
                ? 'تابع مستواك ونقاط الخبرة، ترتيبك في الدوريات، خريطة الالتزام اليومي، التحديات الأسبوعية، وشارات التميز'
                : 'Track your XP level, league standings, daily study heatmap, weekly challenges, and achievement badges'}
            </p>
          </div>

          <button
            type="button"
            disabled={gm.loading || gm.refreshing}
            onClick={gm.handleRefresh}
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
              cursor: gm.loading || gm.refreshing ? 'wait' : 'pointer',
              opacity: gm.loading || gm.refreshing ? 0.7 : 1,
            }}
          >
            <RefreshCw size={14} color="var(--primary)" />
            <span>{isAr ? 'تحديث البيانات' : 'Refresh'}</span>
          </button>
        </div>

        {/* Error Alert */}
        {gm.error && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
              padding: '14px 16px',
              borderRadius: '14px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--danger, #DC2626)',
              fontSize: '13px',
              fontWeight: '700',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{gm.error}</span>
            </div>
            <button
              type="button"
              onClick={gm.handleRefresh}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: 'var(--danger, #DC2626)',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {gm.loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {[150, 220, 190, 220].map((h, i) => (
              <div
                key={i}
                style={{
                  height: `${h}px`,
                  borderRadius: '20px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        ) : (
          <>
            {/* 1. Real XP Level & Streak Progress Banner */}
            <GamificationHero
              summary={gm.summary}
              completedChallengesCount={gm.completedChallengesCount}
              totalChallengesCount={gm.challenges.length}
              lang={lang}
            />

            {/* 2. Active Leagues Arena & Finished Leagues Hall of Fame */}
            <GamificationLeaguesHistory
              generalLeague={gm.generalLeague}
              activeTeacherLeagues={gm.activeTeacherLeagues}
              pastLeagues={gm.pastLeagues}
              lang={lang}
            />

            {/* 3. 52-Week Sunday-Aligned Study Activity Heatmap */}
            <StudyActivityHeatmap heatmap={gm.heatmap} lang={lang} />

            {/* 4. Weekly Platform Challenges with Live Progress & Real Navigation */}
            <WeeklyChallenges challenges={gm.challenges} lang={lang} />

            {/* 5. Server-Computed Achievement Badges & Verified XP Ledger */}
            <BadgesShowcase
              badges={gm.summary?.badges || []}
              recentLedger={gm.summary?.recentLedger || []}
              lang={lang}
            />
          </>
        )}
      </div>
    </SPage>
  );
};
