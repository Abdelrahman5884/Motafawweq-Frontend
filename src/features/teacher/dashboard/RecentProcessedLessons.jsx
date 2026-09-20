import React from 'react';
import { Clock, Share2, Award, ArrowRight } from 'lucide-react';

export const RecentProcessedLessons = ({ lessons, lang, isRtl, onOpenLesson }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
          {lang === 'ar' ? 'الحصص المعالجة مؤخراً' : 'Recent Processed Lessons'}
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {lessons.length} {lang === 'ar' ? 'حصص نشطة' : 'Lessons'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {lessons.map(les => (
          <div
            key={les.id}
            onClick={() => onOpenLesson(les.id)}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, background-color 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? les.titleAr : les.title}
              </span>
              <ArrowRight size={15} color="var(--primary)" style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} color="var(--text-muted)" />
                <span>{les.durationFormatted}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Share2 size={13} color="var(--primary)" />
                <span>{les.stats.conceptsCount} {lang === 'ar' ? 'مفهوم' : 'concepts'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award size={13} color="var(--success)" />
                <span>{les.stats.completionRate}% {lang === 'ar' ? 'إكمال' : 'completion'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
