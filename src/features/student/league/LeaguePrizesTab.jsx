import React from 'react';
import { LEAGUE_PRIZES } from '../../../data/studentData';

export const LeaguePrizesTab = ({ lang }) => {
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
          {lang === 'ar' ? 'جوائز وتكريمات أبطال الدوري' : 'Weekly Champions Prizes'}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          {lang === 'ar' 
            ? 'يحصل الطلاب المتصدرون عند انتهاء الأسبوع على شهادات وجوائز تقديرية رسمية:'
            : 'Top ranking students win honor awards and subscription perks.'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {LEAGUE_PRIZES.map((prize, idx) => (
          <div
            key={idx}
            style={{
              padding: '16px 20px',
              borderRadius: '14px',
              backgroundColor: idx === 0 ? 'rgba(21, 136, 199, 0.06)' : 'var(--bg-subtle)',
              border: '1px solid',
              borderColor: idx === 0 ? 'var(--primary)' : 'var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '15px', fontWeight: '800', color: idx === 0 ? 'var(--primary)' : 'var(--text-primary)' }}>
                {prize.rankAr}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                {prize.titleAr}
              </span>
            </div>

            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)'
            }}>
              {lang === 'ar' ? 'أسبوعياً' : 'Weekly'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
