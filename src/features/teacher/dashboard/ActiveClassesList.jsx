import React from 'react';
import { MOCK_CLASSES } from '../../../data/mockData';

export const ActiveClassesList = ({ lang, onOpenClasses }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
          {lang === 'ar' ? 'المجموعات والقاعات النشطة' : 'Active Classes & Cohorts'}
        </h3>
        <button
          onClick={onOpenClasses}
          style={{
            border: 'none',
            background: 'transparent',
            color: 'var(--primary)',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          {lang === 'ar' ? 'عرض الكل' : 'View All'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {MOCK_CLASSES.map(cls => (
          <div
            key={cls.id}
            onClick={onOpenClasses}
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? cls.nameAr : cls.name}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)'
              }}>
                {cls.joinCode}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span>{lang === 'ar' ? cls.scheduleAr : cls.schedule}</span>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                {cls.enrolledStudents} / {cls.capacity} {lang === 'ar' ? 'طالب' : 'students'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
