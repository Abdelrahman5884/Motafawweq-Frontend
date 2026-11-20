import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Lock,
  Clock,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react';

export const ExamResults = ({
  activeExam,
  serverResult,
  onBackToCatalog,
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';

  const result = serverResult || {};
  const showResults = result.showResults !== false && activeExam?.showResults !== false;
  const isPendingManualGrading =
    Boolean(result.isPendingManualGrading) || result.status === 'submitted';
  const totalQuestions = Number(result.totalQuestions || activeExam?.questionsCount || 0);
  const xpAwarded = Number(result.xpAwarded || 0);

  // Case 1: Results hidden by teacher OR awaiting manual grading of essay questions
  if (!showResults || isPendingManualGrading) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '24px',
          padding: '36px 24px',
          textAlign: 'center',
          maxWidth: '680px',
          margin: '16px auto 40px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            backgroundColor: 'rgba(21, 136, 199, 0.1)',
            border: '1px solid rgba(21, 136, 199, 0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'var(--primary)',
          }}
        >
          {isPendingManualGrading ? <Clock size={28} /> : <CheckCircle2 size={28} />}
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '999px',
            backgroundColor: 'rgba(245, 158, 11, 0.14)',
            color: '#D97706',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            fontSize: '12px',
            fontWeight: '800',
            marginBottom: '14px',
          }}
        >
          {isPendingManualGrading ? <Clock size={13} /> : <Lock size={13} />}
          <span>
            {isPendingManualGrading
              ? isAr
                ? 'تم التسليم — بانتظار تصحيح الأسئلة المقالية'
                : 'Submitted — Pending Essay Grading'
              : isAr
                ? 'النتيجة محجوبة مؤقتاً بقرار المعلم'
                : 'Results Temporarily Withheld by Teacher'}
          </span>
        </div>

        <h2 style={{ fontSize: '21px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 10px' }}>
          {isAr ? 'تم استلام وحفظ ورقة إجابتك بنجاح!' : 'Exam Submitted Successfully!'}
        </h2>

        <p
          style={{
            fontSize: '13.5px',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            margin: '0 auto 22px',
            maxWidth: '520px',
          }}
        >
          {isPendingManualGrading
            ? isAr
              ? 'يحتوي هذا الامتحان على أسئلة مقالية تتطلب مراجعة المعلم. ستظهر درجتك التفصيلية ونموذج الإجابة هنا فور اعتماد التصحيح.'
              : 'This exam contains essay questions that require teacher grading. Your detailed score will appear here once graded.'
            : isAr
              ? 'قام معلم المادة بحجب ظهور الدرجات ونموذج الإجابة مؤقتاً حتى انتهاء فترة الاختبار. ستظهر نتيجتك فور إتاحتها.'
              : 'Your teacher has temporarily hidden scores and model answers until the exam window closes.'}
        </p>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
            padding: '10px 18px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12.5px',
            color: 'var(--text-secondary)',
            fontWeight: '700',
            marginBottom: '26px',
          }}
        >
          <span>
            {isAr ? `عدد الأسئلة المستلمة: ${totalQuestions}` : `${totalQuestions} Questions Submitted`}
          </span>
          {isPendingManualGrading && showResults && Number(result.score) > 0 && (
            <>
              <span>•</span>
              <span style={{ color: '#059669' }}>
                {isAr
                  ? `الدرجة المبدئية للموضوعي: ${result.score} / ${result.fullMark || activeExam?.maxScore || 0}`
                  : `Preliminary Objective Score: ${result.score} / ${result.fullMark || activeExam?.maxScore || 0}`}
              </span>
            </>
          )}
          {xpAwarded > 0 && (
            <>
              <span>•</span>
              <span style={{ color: 'var(--primary)' }}>+{xpAwarded} XP</span>
            </>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={onBackToCatalog}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'العودة لقائمة الامتحانات' : 'Back to Exams'}
          </button>
        </div>
      </div>
    );
  }

  // Case 2: Graded & Visible Results (100% Real Server Data — ZERO hardcoded fake leaderboard!)
  const score = Number(result.score ?? 0);
  const fullMark = Number(result.fullMark || activeExam?.maxScore || 50);
  const scorePercent = Math.round(Number(result.percentage ?? 0));
  const isPassed = Boolean(result.isPassed);
  const isPerfectScore = Boolean(result.isFullMark || scorePercent >= 100);
  const correctCount = Number(result.correctCount ?? 0);
  const wrongCount = Number(result.wrongCount ?? 0);
  const unansweredCount = Number(result.unansweredCount ?? 0);
  const reviewItems = Array.isArray(result.review) ? result.review : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Scorecard Hero */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: isPerfectScore
            ? '2px solid #059669'
            : isPassed
              ? '1px solid rgba(21, 136, 199, 0.35)'
              : '1px solid rgba(220, 38, 38, 0.35)',
          borderRadius: '24px',
          padding: '26px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: '800',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                }}
              >
                {result.examTitleAr || activeExam?.titleAr}
              </span>

              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: '800',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  backgroundColor: isPassed ? 'rgba(5, 150, 105, 0.12)' : 'rgba(220, 38, 38, 0.12)',
                  color: isPassed ? '#059669' : '#DC2626',
                }}
              >
                {isPerfectScore
                  ? isAr
                    ? 'درجة نهائية كاملة 100%'
                    : 'Perfect Score 100%'
                  : isPassed
                    ? isAr
                      ? 'ناجح'
                      : 'Passed'
                    : isAr
                      ? 'تحتاج إلى مراجعة إضافية'
                      : 'Needs Review'}
              </span>
            </div>

            <h2 style={{ fontSize: '23px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
              {isPerfectScore
                ? isAr
                  ? 'ممتاز يا بطل! حققت الدرجة النهائية'
                  : 'Outstanding! Perfect Score!'
                : isPassed
                  ? isAr
                    ? 'أحسنت! تم تصحيح الامتحان بنجاح'
                    : 'Great Job! Exam Graded'
                  : isAr
                    ? 'انتهى الاختبار — راجع أخطاءك الآن لتعزيز مستواك'
                    : 'Exam Completed — Review Your Answers'}
            </h2>

            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              {isAr
                ? `درجتك النهائية: ${score} من ${fullMark} (${scorePercent}%)`
                : `Final Score: ${score} / ${fullMark} (${scorePercent}%)`}
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToCatalog}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            {isAr ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
            <span>{isAr ? 'قائمة الامتحانات' : 'Exam Catalog'}</span>
          </button>
        </div>

        {/* Real Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 155px), 1fr))',
            gap: '10px',
            marginBottom: result.teacherFeedback ? '18px' : 0,
          }}
        >
          <div style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: 'var(--primary-surface)', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary)' }}>{scorePercent}%</div>
            <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {score} / {fullMark} {isAr ? 'درجة' : 'pts'}
            </div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: 'rgba(5, 150, 105, 0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#059669' }}>{correctCount}</div>
            <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'إجابات صحيحة' : 'Correct'}
            </div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: 'rgba(220, 38, 38, 0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#DC2626' }}>{wrongCount}</div>
            <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'إجابات خاطئة' : 'Wrong'}
            </div>
          </div>
          {unansweredCount > 0 && (
            <div style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: 'var(--bg-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-muted)' }}>{unansweredCount}</div>
              <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {isAr ? 'بدون إجابة' : 'Unanswered'}
              </div>
            </div>
          )}
          <div style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: 'rgba(245, 158, 11, 0.12)', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#D97706' }}>+{xpAwarded} XP</div>
            <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'نقاط خبرة مكتسبة' : 'XP Awarded'}
            </div>
          </div>
        </div>

        {/* Teacher Feedback if available */}
        {result.teacherFeedback && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              fontSize: '13px',
              color: 'var(--text-primary)',
            }}
          >
            <MessageSquare size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>{isAr ? 'ملاحظة المعلم: ' : 'Teacher Feedback: '}</strong>
              <span>{result.teacherFeedback}</span>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Server-Graded Question Review (MCQ, True/False & Essay) */}
      {reviewItems.length > 0 && (
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 14px 0' }}>
            {isAr ? `مراجعة الأسئلة والإجابات النموذجية (${reviewItems.length}):` : `Question Review (${reviewItems.length}):`}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reviewItems.map((item, idx) => {
              const isCorrect = item.isCorrect === true;
              const isEssay = item.type === 'essay';
              const isTrueFalse = item.type === 'true_false';

              let studentAnswerLabel = isAr ? 'لم يتم الإجابة' : 'Unanswered';
              if (isEssay) {
                studentAnswerLabel = item.essayAnswerText || studentAnswerLabel;
              } else if (isTrueFalse) {
                if (item.selectedBool === true) studentAnswerLabel = isAr ? 'صواب (True)' : 'True';
                else if (item.selectedBool === false) studentAnswerLabel = isAr ? 'خطأ (False)' : 'False';
              } else if (item.selectedIndex !== null && item.selectedIndex !== undefined) {
                studentAnswerLabel = item.optionsAr?.[item.selectedIndex] ?? `#${item.selectedIndex + 1}`;
              }

              let correctAnswerLabel = '';
              if (isEssay) {
                correctAnswerLabel = item.modelAnswerAr || '';
              } else if (isTrueFalse) {
                if (item.correctBool === true) correctAnswerLabel = isAr ? 'صواب (True)' : 'True';
                else if (item.correctBool === false) correctAnswerLabel = isAr ? 'خطأ (False)' : 'False';
              } else if (item.correctIndex !== null && item.correctIndex !== undefined) {
                correctAnswerLabel = item.optionsAr?.[item.correctIndex] ?? '';
              }

              return (
                <div
                  key={item.id || idx}
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: `1.5px solid ${isCorrect ? 'rgba(5, 150, 105, 0.45)' : 'rgba(220, 38, 38, 0.4)'}`,
                    borderRadius: '16px',
                    padding: '18px 20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '12px',
                        fontWeight: '800',
                        color: isCorrect ? '#059669' : '#DC2626',
                      }}
                    >
                      {isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      <span>
                        {isCorrect
                          ? isAr
                            ? 'إجابة صحيحة'
                            : 'Correct'
                          : isAr
                            ? 'إجابة خاطئة'
                            : 'Incorrect'}
                      </span>
                    </span>
                    <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)' }}>
                      {isAr ? `السؤال ${item.questionNumber || idx + 1}` : `Q${item.questionNumber || idx + 1}`} •{' '}
                      {item.pointsAwarded} / {item.points} {isAr ? 'درجة' : 'pts'}
                    </span>
                  </div>

                  <h4
                    style={{
                      fontSize: '15px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      margin: '0 0 12px 0',
                      lineHeight: 1.5,
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {item.questionAr}
                  </h4>

                  <div
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      marginBottom: '6px',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    <strong>{isAr ? 'إجابتك: ' : 'Your Answer: '}</strong>
                    <span style={{ color: isCorrect ? '#059669' : '#DC2626', fontWeight: '700' }}>
                      {studentAnswerLabel}
                    </span>
                  </div>

                  {correctAnswerLabel && (
                    <div
                      style={{
                        fontSize: '13px',
                        color: '#059669',
                        marginBottom: item.explanationAr || item.teacherComment ? '10px' : 0,
                        fontWeight: '700',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      <strong>{isAr ? 'الإجابة النموذجية: ' : 'Correct Answer: '}</strong>
                      <span>{correctAnswerLabel}</span>
                    </div>
                  )}

                  {item.explanationAr && (
                    <div
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontSize: '12.5px',
                        color: 'var(--text-primary)',
                        lineHeight: 1.55,
                        overflowWrap: 'anywhere',
                      }}
                    >
                      <strong>{isAr ? 'التوضيح: ' : 'Explanation: '}</strong>
                      <span>{item.explanationAr}</span>
                    </div>
                  )}

                  {item.teacherComment && (
                    <div
                      style={{
                        marginTop: '8px',
                        backgroundColor: 'rgba(21, 136, 199, 0.08)',
                        padding: '9px 13px',
                        borderRadius: '10px',
                        fontSize: '12.5px',
                        color: 'var(--text-primary)',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      <strong>{isAr ? 'تعليق المعلم: ' : 'Teacher Comment: '}</strong>
                      <span>{item.teacherComment}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
