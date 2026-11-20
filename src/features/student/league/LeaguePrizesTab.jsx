import React from 'react';
import { Trophy } from 'lucide-react';

export const LeaguePrizesTab = ({ prizes = [], durationLabelAr = '', lang = 'ar' }) => {
  const isAr = lang === 'ar';

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: 'var(--shadow-xs)',
        animation: 'lgFadeIn 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <Trophy size={18} color="#D97706" />
        <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
          {isAr ? 'جوائز وتكريمات أبطال الدوري' : 'League Honors & Prizes'}
        </h3>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 18px 0' }}>
        {isAr
          ? `يحصل المتصدرون وفق ترتيب ${durationLabelAr || 'الدوري'} على الأوسمة والشهادات المعتمدة تلقائياً:`
          : 'Top ranked competitors receive verified honor badges and certificate eligibility automatically:'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {prizes.map((prize, idx) => (
          <div
            key={prize.rankRange || idx}
            style={{
              padding: '15px 18px',
              borderRadius: '14px',
              backgroundColor: idx === 0 ? 'rgba(245, 158, 11, 0.08)' : 'var(--bg-subtle)',
              border: `1px solid ${idx === 0 ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0, flex: 1 }}>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '900',
                  color: idx === 0 ? '#D97706' : 'var(--text-primary)',
                }}
              >
                {isAr ? prize.rankAr : prize.rankEn}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {isAr ? prize.titleAr : prize.titleEn}
              </span>
            </div>

            <span
              style={{
                fontSize: '11px',
                fontWeight: '800',
                padding: '4px 10px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                flexShrink: 0,
              }}
            >
              {isAr ? prize.cadenceAr : prize.cadenceEn}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
