import React from 'react';

export const ChildSummaryCard = ({ activeChild, lang, isRtl }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-xl)',
      padding: '28px',
      marginBottom: '28px',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <img
          src={activeChild.avatar}
          alt=""
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid var(--primary-light)'
          }}
        />
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? activeChild.nameAr : activeChild.name}
          </h2>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {lang === 'ar' ? activeChild.gradeAr : activeChild.grade}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lang === 'ar' ? 'نسبة الحضور بالسنتر' : 'Attendance'}</div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--success)', fontFamily: 'var(--font-heading)' }}>
            {activeChild.attendanceRate}%
          </div>
        </div>

        <div style={{ width: '1px', height: '36px', backgroundColor: 'var(--border-subtle)' }} />

        <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lang === 'ar' ? 'متوسط الامتحانات' : 'Exam Average'}</div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
            {activeChild.avgQuizScore}%
          </div>
        </div>
      </div>
    </div>
  );
};
