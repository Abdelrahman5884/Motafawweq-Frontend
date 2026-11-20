import React, { useEffect } from 'react';
import {
  Clock,
  Flag,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Send,
  AlertCircle,
  X,
} from 'lucide-react';
import { isQuestionAnswered } from './useExam';

export const ExamSession = ({
  activeExam,
  timeLeft,
  formatTime,
  flaggedQuestions,
  handleToggleFlag,
  questions = [],
  currentIdx,
  setCurrentIdx,
  selectedAnswers,
  answeredCount = 0,
  flaggedCount = 0,
  currentQ,
  handleSelectAnswer,
  tabSwitchesCount = 0,
  actionError = null,
  onClearActionError,
  setShowReviewConfirm,
  showReviewConfirm,
  isSubmittingExam = false,
  handleSubmitExam,
  lang = 'ar',
  isRtl = true,
}) => {
  const isAr = lang === 'ar';

  // Keyboard navigation (Arrows when not typing in textarea, Escape closes review modal)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && showReviewConfirm && !isSubmittingExam) {
        setShowReviewConfirm(false);
        return;
      }
      const tag = e.target?.tagName;
      if (tag === 'TEXTAREA' || tag === 'INPUT' || showReviewConfirm) return;
      if (e.key === 'ArrowLeft') {
        setCurrentIdx((prev) => (isRtl ? Math.min(questions.length - 1, prev + 1) : Math.max(0, prev - 1)));
      } else if (e.key === 'ArrowRight') {
        setCurrentIdx((prev) => (isRtl ? Math.max(0, prev - 1) : Math.min(questions.length - 1, prev + 1)));
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showReviewConfirm, isSubmittingExam, setShowReviewConfirm, setCurrentIdx, questions.length, isRtl]);

  const currentAnswer = selectedAnswers[currentQ.id];
  const isCurrentFlagged = Boolean(flaggedQuestions[currentQ.id]);
  const unansweredCount = Math.max(0, questions.length - answeredCount);
  const progressPct = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;
  const isUrgent = timeLeft <= 300;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header with Wall-Clock Timer & Submit Button */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '18px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ minWidth: 0, flex: '1 1 220px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
            {activeExam?.subjectAr}
          </span>
          <h2
            style={{
              fontSize: '16.5px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: '2px 0 0 0',
              overflowWrap: 'anywhere',
            }}
          >
            {activeExam?.titleAr}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Countdown Timer */}
          <div
            dir="ltr"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: isUrgent ? 'rgba(220, 38, 38, 0.12)' : 'var(--bg-subtle)',
              border: `1.5px solid ${isUrgent ? '#DC2626' : 'var(--border-subtle)'}`,
              color: isUrgent ? '#DC2626' : 'var(--text-primary)',
              fontWeight: '900',
              fontSize: '15px',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <Clock size={16} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Flag Question */}
          <button
            type="button"
            onClick={handleToggleFlag}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '10px',
              backgroundColor: isCurrentFlagged ? 'rgba(245, 158, 11, 0.14)' : 'var(--bg-subtle)',
              border: `1px solid ${isCurrentFlagged ? '#D97706' : 'var(--border-subtle)'}`,
              color: isCurrentFlagged ? '#D97706' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <Flag size={14} fill={isCurrentFlagged ? '#D97706' : 'none'} />
            <span>
              {isCurrentFlagged
                ? isAr
                  ? 'مُعلَّم للمراجعة'
                  : 'Flagged'
                : isAr
                  ? 'تحديد للمراجعة'
                  : 'Flag'}
            </span>
          </button>

          {/* Quick Submit Trigger */}
          <button
            type="button"
            disabled={isSubmittingExam}
            onClick={() => setShowReviewConfirm(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: '#059669',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: '800',
              fontSize: '12.5px',
              cursor: isSubmittingExam ? 'wait' : 'pointer',
            }}
          >
            <Send size={13} />
            <span>{isAr ? 'إنهاء وتسليم' : 'Submit'}</span>
          </button>
        </div>
      </div>

      {/* Anti-Cheat Tab Switch Notice (transparent warning when > 0) */}
      {tabSwitchesCount > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            color: '#B45309',
            fontSize: '12px',
            fontWeight: '700',
          }}
        >
          <AlertTriangle size={15} style={{ flexShrink: 0 }} />
          <span>
            {isAr
              ? `تنبيه نزاهة الامتحان: تم رصد مغادرة نافذة الاختبار (${tabSwitchesCount} مرة). يُرجى البقاء داخل الصفحة حتى انتهاء الامتحان.`
              : `Exam integrity notice: tab switch detected (${tabSwitchesCount}x). Please stay on this page.`}
          </span>
        </div>
      )}

      {/* Submission Error Alert */}
      {actionError && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.35)',
            color: '#DC2626',
            fontSize: '12.5px',
            fontWeight: '700',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            {actionError}
          </span>
          <button
            type="button"
            onClick={onClearActionError}
            style={{ border: 'none', background: 'none', color: '#DC2626', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Progress Summary + Question Navigator Strip */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '12px 16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            fontWeight: '700',
            color: 'var(--text-secondary)',
            marginBottom: '8px',
          }}
        >
          <span>
            {isAr
              ? `تمت الإجابة على ${answeredCount} من ${questions.length} سؤال (${progressPct}%)`
              : `Answered ${answeredCount} of ${questions.length} (${progressPct}%)`}
          </span>
          {flaggedCount > 0 && (
            <span style={{ color: '#D97706' }}>
              {isAr ? `مُعلَّم للمراجعة: ${flaggedCount}` : `Flagged: ${flaggedCount}`}
            </span>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}
        >
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIdx;
            const answered = isQuestionAnswered(q, selectedAnswers[q.id]);
            const flagged = Boolean(flaggedQuestions[q.id]);

            return (
              <button
                key={q.id || idx}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                style={{
                  minWidth: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: isCurrent
                    ? 'var(--primary)'
                    : answered
                      ? 'var(--primary-surface)'
                      : 'var(--bg-subtle)',
                  border: `1.5px solid ${
                    isCurrent ? 'var(--primary)' : answered ? 'rgba(21, 136, 199, 0.45)' : 'var(--border-subtle)'
                  }`,
                  color: isCurrent ? '#FFFFFF' : answered ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                {idx + 1}
                {flagged && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '3px',
                      insetInlineEnd: '3px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#D97706',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Question Card (Supports MCQ, True/False, and Essay!) */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '26px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '14px',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: '800',
              color: 'var(--primary)',
              backgroundColor: 'var(--primary-surface)',
              padding: '4px 11px',
              borderRadius: '8px',
            }}
          >
            {isAr
              ? `السؤال ${currentIdx + 1} من ${questions.length}`
              : `Question ${currentIdx + 1} of ${questions.length}`}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 9px',
                borderRadius: '7px',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              {currentQ.type === 'true_false'
                ? isAr
                  ? 'صواب / خطأ'
                  : 'True / False'
                : currentQ.type === 'essay'
                  ? isAr
                    ? 'سؤال مقالي'
                    : 'Essay'
                  : isAr
                    ? 'اختيار من متعدد'
                    : 'Multiple Choice'}
            </span>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-subtle)',
                padding: '3px 9px',
                borderRadius: '7px',
              }}
            >
              {currentQ.points} {isAr ? 'درجة' : 'pts'}
            </span>
          </div>
        </div>

        <h3
          style={{
            fontSize: '17px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            lineHeight: 1.6,
            margin: '0 0 22px 0',
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
          }}
        >
          {isAr ? currentQ.questionAr : currentQ.questionEn || currentQ.questionAr}
        </h3>

        {/* Type 1: Multiple Choice (MCQ) */}
        {currentQ.type === 'mcq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px' }}>
            {(currentQ.optionsAr || []).map((opt, optIdx) => {
              const isSelected = currentAnswer === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectAnswer(optIdx)}
                  style={{
                    width: '100%',
                    textAlign: 'inherit',
                    padding: '14px 18px',
                    borderRadius: '13px',
                    backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                    border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '14px',
                    fontWeight: '700',
                    lineHeight: 1.45,
                  }}
                >
                  <span
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-medium)'}`,
                      backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                      color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '800',
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span style={{ flex: 1, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Type 2: True / False */}
        {currentQ.type === 'true_false' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              marginBottom: '26px',
            }}
          >
            {[
              { value: true, ar: 'صواب (True)', en: 'True', Icon: CheckCircle2, color: '#059669' },
              { value: false, ar: 'خطأ (False)', en: 'False', Icon: XCircle, color: '#DC2626' },
            ].map((choice) => {
              const Icon = choice.Icon;
              const isSelected = currentAnswer === choice.value;
              return (
                <button
                  key={String(choice.value)}
                  type="button"
                  onClick={() => handleSelectAnswer(choice.value)}
                  style={{
                    padding: '18px 16px',
                    borderRadius: '14px',
                    border: `2px solid ${isSelected ? choice.color : 'var(--border-subtle)'}`,
                    backgroundColor: isSelected ? `${choice.color}16` : 'var(--bg-subtle)',
                    color: isSelected ? choice.color : 'var(--text-primary)',
                    fontSize: '15px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                >
                  <Icon size={20} />
                  <span>{isAr ? choice.ar : choice.en}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Type 3: Essay */}
        {currentQ.type === 'essay' && (
          <div style={{ marginBottom: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                {isAr ? 'اكتب إجابتك المقالية بوضوح:' : 'Write your essay answer clearly:'}
              </label>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>
                {String(currentAnswer || '').length}/10000
              </span>
            </div>
            <textarea
              rows={6}
              maxLength={10000}
              value={typeof currentAnswer === 'string' ? currentAnswer : ''}
              onChange={(e) => handleSelectAnswer(e.target.value)}
              placeholder={
                isAr
                  ? 'اكتب خطوات الحل أو الشرح الكامل هنا... سيتم مراجعة إجابتك وتصحيحها بواسطة المعلم.'
                  : 'Write your detailed explanation here...'
              }
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '13px',
                border: '1.5px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                lineHeight: 1.6,
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        {/* Stepper Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <button
            type="button"
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            style={{
              display: 'inline-flex',
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
              opacity: currentIdx === 0 ? 0.4 : 1,
            }}
          >
            {isRtl ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
            <span>{isAr ? 'السابق' : 'Previous'}</span>
          </button>

          {currentIdx < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '800',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <span>{isAr ? 'التالي' : 'Next'}</span>
              {isRtl ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmittingExam}
              onClick={() => setShowReviewConfirm(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 22px',
                borderRadius: '10px',
                backgroundColor: '#059669',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '800',
                fontSize: '13px',
                cursor: isSubmittingExam ? 'wait' : 'pointer',
              }}
            >
              <Send size={14} />
              <span>{isAr ? 'تسليم الامتحان' : 'Submit Exam'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Review & Confirm Submission Modal */}
      {showReviewConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => !isSubmittingExam && setShowReviewConfirm(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 37, 78, 0.55)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: '24px',
              maxWidth: '460px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 10px 0' }}>
              {isAr ? 'تأكيد تسليم الامتحان نهائياً' : 'Confirm Final Submission'}
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginBottom: '14px',
              }}
            >
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(5, 150, 105, 0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#059669' }}>{answeredCount}</div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {isAr ? 'تمت الإجابة' : 'Answered'}
                </div>
              </div>
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: unansweredCount > 0 ? 'rgba(220, 38, 38, 0.1)' : 'var(--bg-subtle)', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '900', color: unansweredCount > 0 ? '#DC2626' : 'var(--text-muted)' }}>
                  {unansweredCount}
                </div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {isAr ? 'بدون إجابة' : 'Unanswered'}
                </div>
              </div>
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: flaggedCount > 0 ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-subtle)', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '900', color: flaggedCount > 0 ? '#D97706' : 'var(--text-muted)' }}>
                  {flaggedCount}
                </div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {isAr ? 'مُعلَّم' : 'Flagged'}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 18px 0', lineHeight: 1.55 }}>
              {unansweredCount > 0
                ? isAr
                  ? `تنبيه: لا يزال لديك ${unansweredCount} سؤال بدون إجابة. هل تريد التسليم النهائي الآن أم العودة للمراجعة؟`
                  : `Warning: ${unansweredCount} question(s) are still unanswered. Submit anyway?`
                : isAr
                  ? 'أجبت على جميع الأسئلة بنجاح. هل أنت مستعد للتسليم النهائي؟'
                  : 'All questions answered. Ready to submit?'}
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                disabled={isSubmittingExam}
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
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'العودة للمراجعة' : 'Keep Reviewing'}
              </button>
              <button
                type="button"
                disabled={isSubmittingExam}
                onClick={() => handleSubmitExam(false)}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '12px',
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: isSubmittingExam ? 'wait' : 'pointer',
                  opacity: isSubmittingExam ? 0.7 : 1,
                }}
              >
                {isSubmittingExam
                  ? isAr
                    ? 'جاري التصحيح...'
                    : 'Submitting...'
                  : isAr
                    ? 'تأكيد التسليم النهائي'
                    : 'Confirm Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
