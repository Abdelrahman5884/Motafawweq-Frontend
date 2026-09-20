import React from 'react';

export const QuizNavigatorStrip = ({
  questions,
  currentIdx,
  setCurrentIdx,
  selectedAnswers,
  flaggedQuestions
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      overflowX: 'auto',
      paddingBottom: '12px',
      marginBottom: '20px'
    }}>
      {questions.map((q, idx) => {
        const isCurrent = idx === currentIdx;
        const isAnswered = selectedAnswers[idx] !== undefined;
        const isFlagged = !!flaggedQuestions[idx];

        let bg = 'var(--bg-surface)';
        let border = 'var(--border-subtle)';
        let color = 'var(--text-secondary)';

        if (isCurrent) {
          bg = 'var(--primary)';
          border = 'var(--primary)';
          color = '#FFFFFF';
        } else if (isAnswered) {
          bg = 'var(--primary-surface)';
          border = 'var(--primary-light)';
          color = 'var(--primary)';
        }

        return (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx)}
            style={{
              minWidth: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: bg,
              border: `1.5px solid ${border}`,
              color: color,
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            {idx + 1}
            {isFlagged && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--warning)'
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
};
