import React from 'react';
import { SCard, S } from '../../../components/student/ui';

export const WeeklyPerformanceChart = ({ weeklyScores, maxScore, lang }) => {
  return (
    <SCard style={{ marginBottom: '28px' }}>
      <h3 style={{
        fontSize: '15px',
        fontWeight: '700',
        color: S.textPrimary,
        margin: '0 0 20px 0'
      }}>
        {lang === 'ar' ? 'تطور الدرجات عبر الأسابيع الأخيرة' : 'Recent weekly test performance'}
      </h3>

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: '140px',
        paddingTop: '20px',
        gap: '12px'
      }}>
        {weeklyScores.map((w, i) => {
          const heightPct = Math.round((w.score / maxScore) * 100);
          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                height: '100%',
                justifyContent: 'flex-end'
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: '700', color: S.textPrimary }}>
                {w.score}%
              </span>
              <div style={{
                width: '100%',
                maxWidth: '48px',
                height: `${heightPct}%`,
                backgroundColor: i === weeklyScores.length - 1 ? S.primary : S.primaryLight,
                borderRadius: '6px 6px 0 0',
                transition: 'height 0.3s ease'
              }} />
              <span style={{ fontSize: '11px', color: S.textMuted, whiteSpace: 'nowrap' }}>
                {w.week}
              </span>
            </div>
          );
        })}
      </div>
    </SCard>
  );
};
