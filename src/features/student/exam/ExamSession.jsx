import React from 'react';
import { Clock, Flag, ArrowLeft, ArrowRight, X } from 'lucide-react';

export const ExamSession = ({
  activeExam,
  timeLeft,
  formatTime,
  flaggedQuestions,
  handleToggleFlag,
  questions,
  currentIdx,
  setCurrentIdx,
  selectedAnswers,
  currentQ,
  handleSelectOption,
  setShowReviewConfirm,
  showReviewConfirm,
  handleSubmitExam,
  lang,
  isRtl
}) => {
  return (
    <div>
      {/* Header with timer */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '18px',
        padding: '16px 20px',
        marginBottom: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
            {activeExam.subjectAr}
          </span>
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
            {activeExam.titleAr}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Countdown Timer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '10px',
            backgroundColor: timeLeft < 300 ? 'var(--error-light)' : 'var(--bg-subtle)',
            border: '1px solid',
            borderColor: timeLeft < 300 ? 'var(--error)' : 'var(--border-subtle)',
            color: timeLeft < 300 ? 'var(--error)' : 'var(--text-primary)',
            fontWeight: '800',
            fontSize: '14.5px'
          }}>
            <Clock size={16} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Flag Question */}
          <button
            onClick={handleToggleFlag}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '10px',
              backgroundColor: flaggedQuestions[currentIdx] ? 'var(--warning-light)' : 'var(--bg-subtle)',
              border: '1px solid',
              borderColor: flaggedQuestions[currentIdx] ? 'var(--warning)' : 'var(--border-subtle)',
              color: flaggedQuestions[currentIdx] ? 'var(--warning)' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '12.5px',
              cursor: 'pointer'
            }}
          >
            <Flag size={14} fill={flaggedQuestions[currentIdx] ? 'var(--warning)' : 'none'} />
            <span>{flaggedQuestions[currentIdx] ? (lang === 'ar' ? 'معلم للمراجعة' : 'Flagged') : (lang === 'ar' ? 'تحديد للمراجعة' : 'Flag')}</span>
          </button>
        </div>
      </div>

      {/* Question Grid Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '10px',
        marginBottom: '16px'
      }}>
        {questions.map((_, idx) => {
          const isCurrent = idx === currentIdx;
          const isAnswered = selectedAnswers[idx] !== undefined;
          const isFlagged = !!flaggedQuestions[idx];

          return (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              style={{
                minWidth: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: isCurrent ? 'var(--primary)' : isAnswered ? 'var(--primary-surface)' : 'var(--bg-surface-elevated)',
                border: '1px solid',
                borderColor: isCurrent ? 'var(--primary)' : isAnswered ? 'var(--primary)' : 'var(--border-subtle)',
                color: isCurrent ? '#FFFFFF' : isAnswered ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: '800',
                fontSize: '13px',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {idx + 1}
              {isFlagged && (
                <span style={{ position: 'absolute', top: '3px', right: '3px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--warning)' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Question Box */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '28px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'inline-block',
          fontSize: '12px',
          fontWeight: '700',
          color: 'var(--primary)',
          backgroundColor: 'var(--primary-surface)',
          padding: '3px 10px',
          borderRadius: '6px',
          marginBottom: '14px'
        }}>
          {lang === 'ar' ? `السؤال ${currentIdx + 1} من ${questions.length}` : `Question ${currentIdx + 1} of ${questions.length}`}
        </div>

        <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.55, marginBottom: '24px' }}>
          {currentQ.questionAr}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {currentQ.optionsAr.map((opt, optIdx) => {
            const isSelected = selectedAnswers[currentIdx] === optIdx;
            return (
              <div
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                  border: '1.5px solid',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border-subtle)',
                  color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  lineHeight: 1.4,
                  transition: 'all 0.12s ease'
                }}
              >
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '1.5px solid',
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border-medium)',
                  backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '800',
                  flexShrink: 0
                }}>
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
              </div>
            );
          })}
        </div>

        {/* Stepper Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <button
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
              opacity: currentIdx === 0 ? 0.4 : 1
            }}
          >
            {isRtl ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
            <span>{lang === 'ar' ? 'السابق' : 'Previous'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <span>{lang === 'ar' ? 'التالي' : 'Next'}</span>
                {isRtl ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
              </button>
            ) : (
              <button
                onClick={() => setShowReviewConfirm(true)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--success)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'تسليم الامتحان' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal before submit */}
      {showReviewConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(6, 37, 78, 0.45)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: '24px',
            maxWidth: '460px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
              {lang === 'ar' ? 'تأكيد تسليم الامتحان' : 'Confirm Submission'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              {lang === 'ar'
                ? `لقد أجبت على ${Object.keys(selectedAnswers).length} من أصل ${questions.length} أسئلة. هل أنت متأكد من رغبتك في التسليم النهائي؟`
                : `You answered ${Object.keys(selectedAnswers).length} of ${questions.length} questions. Submit now?`}
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowReviewConfirm(false)}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'متابعة الحل' : 'Continue'}
              </button>
              <button
                onClick={handleSubmitExam}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--success)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'تأكيد التسليم' : 'Submit Exam'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
