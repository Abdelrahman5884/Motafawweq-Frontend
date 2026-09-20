import React from 'react';
import { LEAGUE_RULES } from '../../../data/studentData';

export const LeagueRulesTab = ({ lang }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '20px',
      padding: '28px',
      boxShadow: 'var(--shadow-xs)'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
          {lang === 'ar' ? 'قواعد احتساب نقاط الدوري' : 'Scoring System'}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          {lang === 'ar' 
            ? 'النظام المعتمد لاحتساب النقاط وتصعيد الترتيب في دوري المتفوقين:'
            : 'Approved scoring mechanics across all exams and quizzes.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {LEAGUE_RULES.map((rule, idx) => (
          <div
            key={idx}
            style={{
              padding: '18px 20px',
              borderRadius: '14px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--primary)' }}>
              {rule.titleAr}
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {rule.descAr}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
