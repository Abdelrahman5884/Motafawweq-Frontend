import React from 'react';

export const QuizReviewModal = ({
  show,
  onClose,
  onSubmit,
  totalQuestions,
  selectedAnswers,
  lang
}) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(6px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1.5px solid var(--border-medium)',
        borderRadius: '24px',
        maxWidth: '520px',
        width: '100%',
        padding: '28px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '8px' }}>
          {lang === 'ar' ? 'مراجعة إجابات الكويز قبل التسليم' : 'Review Answers'}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          {lang === 'ar' 
            ? `لقد أجبت على ${Object.keys(selectedAnswers).length} من أصل ${totalQuestions} أسئلة.`
            : `You answered ${Object.keys(selectedAnswers).length} of ${totalQuestions} questions.`}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '24px' }}>
          {Array.from({ length: totalQuestions }).map((_, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px',
                textAlign: 'center',
                borderRadius: '8px',
                backgroundColor: selectedAnswers[idx] !== undefined ? 'var(--primary-surface)' : 'var(--error-light)',
                color: selectedAnswers[idx] !== undefined ? 'var(--primary)' : 'var(--error)',
                fontSize: '12px',
                fontWeight: '800'
              }}
            >
              Q{idx + 1}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{ padding: '10px 18px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontWeight: '700', cursor: 'pointer' }}
          >
            {lang === 'ar' ? 'العودة للحل' : 'Back'}
          </button>
          <button
            onClick={onSubmit}
            style={{ padding: '10px 24px', borderRadius: '12px', backgroundColor: 'var(--success)', border: 'none', color: '#FFFFFF', fontWeight: '900', cursor: 'pointer' }}
          >
            {lang === 'ar' ? 'تأكيد التسليم النهائي' : 'Confirm Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};
