import React from 'react';
import { Clock, Flag } from 'lucide-react';

export const QuizStatusBar = ({
  quizSource,
  lessonTitle,
  timeLeft,
  formatTime,
  isSubmitted,
  isFlagged,
  handleToggleFlag,
  lang
}) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1.5px solid var(--border-medium)',
      borderRadius: '20px',
      padding: '16px 22px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '14px'
    }}>
      <div>
        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase' }}>
          {quizSource === 'ai' ? 'كويز الذكاء الاصطناعي من المحاضرة' : 'كويز المعلم الرسمي'}
        </span>
        <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
          {lessonTitle}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Live Countdown Timer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderRadius: '12px',
          backgroundColor: timeLeft < 120 ? 'var(--error-light)' : 'var(--bg-subtle)',
          border: '1px solid',
          borderColor: timeLeft < 120 ? 'var(--error)' : 'var(--border-subtle)',
          color: timeLeft < 120 ? 'var(--error)' : 'var(--text-primary)',
          fontWeight: '900',
          fontSize: '14px'
        }}>
          <Clock size={16} />
          <span>{formatTime(timeLeft)}</span>
        </div>

        {/* Flag Question Button (US-33) */}
        {!isSubmitted && (
          <button
            onClick={handleToggleFlag}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '12px',
              backgroundColor: isFlagged ? 'var(--warning-light)' : 'var(--bg-subtle)',
              border: '1px solid',
              borderColor: isFlagged ? 'var(--warning)' : 'var(--border-subtle)',
              color: isFlagged ? 'var(--warning)' : 'var(--text-secondary)',
              fontWeight: '800',
              fontSize: '12.5px',
              cursor: 'pointer'
            }}
          >
            <Flag size={14} fill={isFlagged ? 'var(--warning)' : 'none'} />
            <span>{isFlagged ? (lang === 'ar' ? 'معلّم للمراجعة' : 'Flagged') : (lang === 'ar' ? 'وضع علامة' : 'Flag')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
