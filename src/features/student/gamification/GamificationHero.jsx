import React from 'react';
import { Crown, Flame, Target, Award } from 'lucide-react';

export const GamificationHero = ({
  summary,
  completedChallengesCount = 0,
  totalChallengesCount = 4,
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';
  const level = Number(summary?.level ?? 1);
  const totalXp = Number(summary?.totalXp ?? 0);
  const levelTitle = isAr
    ? summary?.levelTitleAr || 'مبتدئ طموح'
    : summary?.levelTitleEn || 'Rising Learner';
  const xpInLevel = Number(summary?.xpInCurrentLevel ?? 0);
  const xpRemaining = Number(summary?.xpRemainingForNextLevel ?? 100);
  const progressPercent = Math.min(100, Math.max(0, Number(summary?.levelProgressPercent ?? 0)));
  const streakDays = Number(summary?.streakDays ?? 0);
  const longestStreakDays = Number(summary?.longestStreakDays ?? 0);
  const unlockedBadges = Number(summary?.unlockedBadgesCount ?? 0);
  const totalBadges = Number(summary?.totalBadgesCount ?? 6);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #06254E 0%, #0D3B6F 65%, #124E89 100%)',
        border: '1px solid rgba(92, 182, 219, 0.3)',
        borderRadius: '22px',
        padding: '24px 26px',
        color: '#FFFFFF',
        boxShadow: '0 12px 32px rgba(6, 37, 78, 0.22)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '18px',
        }}
      >
        {/* Level & Total XP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '18px',
              backgroundColor: 'rgba(92, 182, 219, 0.16)',
              border: '1.5px solid rgba(92, 182, 219, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Crown size={28} color="#7DD3FC" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#BAE6FD', fontWeight: '800' }}>
              {isAr
                ? `المستوى ${level} • ${levelTitle}`
                : `Level ${level} • ${levelTitle}`}
            </div>
            <div style={{ fontSize: '24px', fontWeight: '900', marginTop: '2px', lineHeight: 1.2 }}>
              {totalXp.toLocaleString()}{' '}
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#BAE6FD' }}>XP</span>
            </div>
          </div>
        </div>

        {/* Live Achievement Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '14px',
              backgroundColor: 'rgba(245, 158, 11, 0.16)',
              border: '1px solid rgba(245, 158, 11, 0.42)',
              minWidth: '115px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '16px',
                fontWeight: '900',
                color: '#FDE68A',
              }}
            >
              <Flame size={16} color="#F59E0B" />
              <span>
                {streakDays} {isAr ? 'يوم' : 'days'}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#FCD34D', fontWeight: '700', marginTop: '2px' }}>
              {isAr ? `الأطول: ${longestStreakDays} يوم` : `Best: ${longestStreakDays}d`}
            </div>
          </div>

          <div
            style={{
              padding: '10px 14px',
              borderRadius: '14px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              minWidth: '115px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '16px',
                fontWeight: '900',
                color: '#A7F3D0',
              }}
            >
              <Target size={16} color="#34D399" />
              <span>
                {completedChallengesCount} / {totalChallengesCount}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#6EE7B7', fontWeight: '700', marginTop: '2px' }}>
              {isAr ? 'تحديات الأسبوع' : 'Weekly Challenges'}
            </div>
          </div>

          <div
            style={{
              padding: '10px 14px',
              borderRadius: '14px',
              backgroundColor: 'rgba(92, 182, 219, 0.16)',
              border: '1px solid rgba(92, 182, 219, 0.4)',
              minWidth: '115px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '16px',
                fontWeight: '900',
                color: '#E0F2FE',
              }}
            >
              <Award size={16} color="#7DD3FC" />
              <span>
                {unlockedBadges} / {totalBadges}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#BAE6FD', fontWeight: '700', marginTop: '2px' }}>
              {isAr ? 'شارات مفتوحة' : 'Unlocked Badges'}
            </div>
          </div>
        </div>
      </div>

      {/* Real Level Progression Bar */}
      <div style={{ marginTop: '18px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            fontSize: '12px',
            color: '#BAE6FD',
            marginBottom: '6px',
            fontWeight: '700',
          }}
        >
          <span>
            {isAr
              ? `تقدم المستوى ${level}: ${xpInLevel} / 100 XP (${progressPercent}%)`
              : `Level ${level} progress: ${xpInLevel} / 100 XP (${progressPercent}%)`}
          </span>
          <span>
            {isAr
              ? `متبقي ${xpRemaining} XP للوصول إلى المستوى ${level + 1}`
              : `${xpRemaining} XP left to reach Level ${level + 1}`}
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '9px',
            borderRadius: '999px',
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #38BDF8 0%, #34D399 100%)',
              transition: 'width 0.35s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
};
