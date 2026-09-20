import React from 'react';
import { Play } from 'lucide-react';

export const WorkspaceHeader = ({ lesson, lang, isRtl, onTakeExamAsStudent }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '20px'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '700',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-surface)',
            color: 'var(--primary)',
            border: '1px solid var(--primary-light)'
          }}>
            {lang === 'ar' ? lesson.subjectAr : lesson.subject}
          </span>

          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-secondary)'
          }}>
            {lang === 'ar' ? lesson.gradeAr : lesson.grade}
          </span>

          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            • {lesson.durationFormatted} ({lang === 'ar' ? 'تفريغ كامل' : 'Full Transcript'})
          </span>
        </div>

        <h1 style={{
          fontSize: '24px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          margin: '0 0 6px 0',
          fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
        }}>
          {lang === 'ar' ? lesson.titleAr : lesson.title}
        </h1>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {lang === 'ar' ? lesson.unitAr : lesson.unit}
        </div>
      </div>

      {/* Quick Action CTAs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onTakeExamAsStudent}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(21, 136, 199, 0.35)'
          }}
        >
          <Play size={14} fill="#FFFFFF" />
          <span>{lang === 'ar' ? 'تجربة الامتحان كطالب' : 'Take Exam as Student'}</span>
        </button>
      </div>
    </div>
  );
};
