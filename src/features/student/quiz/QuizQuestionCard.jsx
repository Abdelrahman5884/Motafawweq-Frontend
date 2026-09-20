import React from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';

export const QuizQuestionCard = ({
  currentQ,
  currentIdx,
  totalQuestions,
  selectedAnswers,
  handleSelectOption,
  isSubmitted,
  setCurrentIdx,
  setShowReviewModal,
  handleResetQuiz,
  lang,
  isRtl
}) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1.5px solid var(--border-medium)',
      borderRadius: '24px',
      padding: '32px',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)' }}>
          {lang === 'ar' ? `السؤال ${currentIdx + 1} من ${totalQuestions}` : `Question ${currentIdx + 1} of ${totalQuestions}`}
        </span>
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '24px' }}>
        {currentQ.questionAr}
      </h2>

      {/* Answer Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        {currentQ.optionsAr.map((opt, optIdx) => {
          const isSelected = selectedAnswers[currentIdx] === optIdx;
          const isCorrect = optIdx === currentQ.correctIndex;
          let optBg = 'var(--bg-subtle)';
          let optBorder = 'var(--border-subtle)';
          let optColor = 'var(--text-primary)';

          if (isSubmitted) {
            if (isCorrect) {
              optBg = 'var(--success-light)';
              optBorder = 'var(--success)';
              optColor = 'var(--success)';
            } else if (isSelected && !isCorrect) {
              optBg = 'var(--error-light)';
              optBorder = 'var(--error)';
              optColor = 'var(--error)';
            }
          } else if (isSelected) {
            optBg = 'var(--primary-surface)';
            optBorder = 'var(--primary)';
            optColor = 'var(--primary)';
          }

          return (
            <div
              key={optIdx}
              onClick={() => handleSelectOption(optIdx)}
              style={{
                padding: '16px 20px',
                borderRadius: '16px',
                backgroundColor: optBg,
                border: `2px solid ${optBorder}`,
                color: optColor,
                cursor: isSubmitted ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                fontSize: '14px',
                fontWeight: '700',
                lineHeight: 1.4,
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                border: `2px solid ${optBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '900'
              }}>
                {String.fromCharCode(65 + optIdx)}
              </span>
              <span>{opt}</span>
            </div>
          );
        })}
      </div>

      {/* Explanation card after submit (US-37) */}
      {isSubmitted && (
        <div style={{
          backgroundColor: 'var(--success-light)',
          border: '1.5px solid var(--success)',
          borderRadius: '16px',
          padding: '18px 22px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: '900', fontSize: '13px', marginBottom: '6px' }}>
            <CheckCircle2 size={18} />
            <span>{lang === 'ar' ? 'التفسير العلمي المعتمد والنموذجي:' : 'Verified Explanation:'}</span>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {currentQ.explanationAr}
          </p>
        </div>
      )}

      {/* Footer Question Navigator Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <button
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontWeight: '700',
            fontSize: '13px',
            cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
            opacity: currentIdx === 0 ? 0.5 : 1
          }}
        >
          {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          <span>{lang === 'ar' ? 'السابق' : 'Previous'}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isSubmitted ? (
            <>
              {currentIdx < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentIdx(prev => Math.min(totalQuestions - 1, prev + 1))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <span>{lang === 'ar' ? 'التالي' : 'Next'}</span>
                  {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </button>
              ) : (
                <button
                  onClick={() => setShowReviewModal(true)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--success)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '900',
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)'
                  }}
                >
                  {lang === 'ar' ? 'مراجعة وتسليم الكويز' : 'Review & Submit'}
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleResetQuiz}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontWeight: '800',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={16} />
              <span>{lang === 'ar' ? 'إعادة المحاولة' : 'Retake'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
