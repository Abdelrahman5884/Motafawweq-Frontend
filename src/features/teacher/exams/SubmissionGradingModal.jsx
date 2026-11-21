import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  FileText,
  BookOpen,
  Loader2,
  AlertTriangle,
  Check,
  MessageSquare,
} from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { teacherApi } from '../../../services/teacherApi';
import { ARABIC_OPTION_LETTERS, formatExamDateTime } from './examConstants';

export const SubmissionGradingModal = ({
  examId,
  examPassScore = 0,
  submissionId,
  isAr,
  isDark,
  onClose,
  onGraded,
}) => {
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Editable per-question grading map: { [questionUuid]: { pointsAwarded, teacherFeedback } }
  const [gradeDrafts, setGradeDrafts] = useState({});
  const [generalFeedback, setGeneralFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSubmitting, onClose]);

  useEffect(() => {
    if (!examId || !submissionId) return;
    let mounted = true;

    const loadSubmission = async () => {
      try {
        const res = await teacherApi.exams.getSubmission(examId, submissionId);
        if (!mounted) return;
        const data = res?.data || null;
        setDetail(data);
        setGeneralFeedback(data?.teacherFeedback || '');

        const drafts = {};
        (data?.answers || []).forEach((ans) => {
          const key = ans.questionUuid || ans.id;
          drafts[key] = {
            pointsAwarded: ans.pointsAwarded !== undefined && ans.pointsAwarded !== null ? String(ans.pointsAwarded) : '0',
            teacherFeedback: ans.teacherFeedback || '',
          };
        });
        setGradeDrafts(drafts);
      } catch (err) {
        if (mounted) {
          setLoadError(
            err?.message || (isAr ? 'تعذر تحميل تفاصيل إجابات الطالب.' : 'Failed to load student submission.')
          );
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadSubmission();
    return () => { mounted = false; };
  }, [examId, submissionId, isAr]);

  const answers = useMemo(() => detail?.answers || [], [detail]);
  const essayAnswers = useMemo(
    () => answers.filter((a) => a.questionType === 'essay'),
    [answers]
  );

  // Live preview of final score as the teacher enters essay points
  const liveScoreSummary = useMemo(() => {
    const fullMark = Number(detail?.fullMark || 0);
    let total = 0;

    answers.forEach((ans) => {
      const key = ans.questionUuid || ans.id;
      const maxPts = Number(ans.points || 0);
      if (ans.questionType === 'essay') {
        const raw = Number(gradeDrafts[key]?.pointsAwarded ?? ans.pointsAwarded ?? 0);
        const clamped = Number.isNaN(raw) ? 0 : Math.max(0, Math.min(maxPts, raw));
        total += clamped;
      } else {
        total += Number(ans.pointsAwarded || 0);
      }
    });

    const roundedTotal = Math.round(total * 100) / 100;
    const pct = fullMark > 0 ? Math.round((roundedTotal / fullMark) * 1000) / 10 : 0;
    const isPassed = roundedTotal >= Number(examPassScore || 0);

    return { total: roundedTotal, fullMark, pct, isPassed };
  }, [answers, detail?.fullMark, gradeDrafts, examPassScore]);

  const updateDraft = (key, field, value) => {
    setGradeDrafts((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || { pointsAwarded: '0', teacherFeedback: '' }),
        [field]: value,
      },
    }));
  };

  const handleApproveAndSave = async (e) => {
    e.preventDefault();
    if (!detail || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const gradedEssayPayload = essayAnswers.map((ans) => {
        const key = ans.questionUuid || ans.id;
        const maxPts = Number(ans.points || 0);
        const raw = Number(gradeDrafts[key]?.pointsAwarded ?? 0);
        const safePts = Number.isNaN(raw) ? 0 : Math.max(0, Math.min(maxPts, raw));
        return {
          questionUuid: ans.questionUuid || ans.id,
          pointsAwarded: safePts,
          teacherFeedback: gradeDrafts[key]?.teacherFeedback ?? '',
        };
      });

      const res = await teacherApi.exams.gradeSubmission(examId, submissionId, {
        answers: gradedEssayPayload,
        teacherFeedback: generalFeedback,
      });

      if (res?.data) {
        onGraded?.(res.data);
      }
      onClose();
    } catch (err) {
      setSubmitError(
        err?.message || (isAr ? 'تعذر حفظ الدرجات واعتماد التصحيح.' : 'Failed to save grades and approve submission.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(3px)',
        zIndex: 2200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '860px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden',
      }}>
        {/* Top Modal Header */}
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <Avatar
              src={detail?.student?.avatar}
              name={detail?.student?.name || (isAr ? 'طالب' : 'Student')}
              size={44}
              border="2px solid var(--primary)"
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '15.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                  {detail?.student?.name || (isAr ? 'مراجعة إجابات الطالب' : 'Student Answer Review')}
                </h3>
                {detail?.student?.studentCode && (
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: '800',
                    padding: '2px 7px',
                    borderRadius: '5px',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--primary)',
                    border: '1px solid var(--border-subtle)',
                    fontFamily: 'var(--font-mono, monospace)',
                  }}>
                    {detail.student.studentCode}
                  </span>
                )}
                {detail && (
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: detail.status === 'graded'
                      ? 'rgba(16, 185, 129, 0.14)'
                      : 'rgba(245, 158, 11, 0.14)',
                    color: detail.status === 'graded' ? 'var(--success)' : '#D97706',
                  }}>
                    {detail.status === 'graded'
                      ? (isAr ? 'معتمد ومصحح ✓' : 'Approved & Graded')
                      : (isAr ? 'بانتظار مراجعة المقالي والاعتماد' : 'Pending Essay Review')}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {detail?.submittedAt
                  ? `${isAr ? 'تاريخ التسليم:' : 'Submitted:'} ${formatExamDateTime(detail.submittedAt, isAr)}`
                  : (detail?.examTitleAr || '')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {detail && (
              <div style={{
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: liveScoreSummary.isPassed
                  ? (isDark ? 'rgba(16, 185, 129, 0.16)' : '#ECFDF5')
                  : (isDark ? 'rgba(239, 68, 68, 0.14)' : '#FEF2F2'),
                border: `1px solid ${liveScoreSummary.isPassed ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.3)'}`,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>
                  {isAr ? 'الدرجة المتوقعة بعد الاعتماد' : 'Live Final Score'}
                </div>
                <div style={{
                  fontSize: '15px',
                  fontWeight: '900',
                  color: liveScoreSummary.isPassed ? 'var(--success)' : '#EF4444',
                  fontFamily: 'var(--font-heading)',
                }}>
                  {liveScoreSummary.total} / {liveScoreSummary.fullMark} ({liveScoreSummary.pct}%)
                </div>
              </div>
            )}

            <button
              type="button"
              aria-label={isAr ? 'إغلاق' : 'Close'}
              disabled={isSubmitting}
              onClick={onClose}
              style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleApproveAndSave}
          style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
        >
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
                <Loader2 size={28} className="spin" style={{ margin: '0 auto 10px', display: 'block', color: 'var(--primary)' }} />
                <div style={{ fontSize: '13px', fontWeight: '700' }}>
                  {isAr ? 'جاري تحميل إجابات الطالب...' : 'Loading student answers...'}
                </div>
              </div>
            ) : loadError ? (
              <div style={{
                padding: '16px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#EF4444',
                fontSize: '13px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <AlertTriangle size={18} />
                <span>{loadError}</span>
              </div>
            ) : (
              <>
                {submitError && (
                  <div
                    role="alert"
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.28)',
                      color: '#EF4444',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <AlertTriangle size={15} />
                    <span>{submitError}</span>
                  </div>
                )}

                {answers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    {isAr ? 'لا توجد إجابات مسجلة في هذا التسليم.' : 'No recorded answers for this submission.'}
                  </div>
                ) : (
                  answers.map((ans, idx) => {
                    const key = ans.questionUuid || ans.id;
                    const isEssay = ans.questionType === 'essay';
                    const maxPts = Number(ans.points || 0);
                    const draft = gradeDrafts[key] || { pointsAwarded: String(ans.pointsAwarded ?? 0), teacherFeedback: ans.teacherFeedback || '' };
                    const halfPts = Number((maxPts / 2).toFixed(1));

                    return (
                      <div
                        key={key || idx}
                        style={{
                          padding: '16px',
                          borderRadius: 'var(--radius-lg)',
                          backgroundColor: isEssay
                            ? (isDark ? 'rgba(245, 158, 11, 0.06)' : '#FFFDF7')
                            : 'var(--bg-subtle)',
                          border: `1.5px solid ${isEssay
                            ? 'rgba(245, 158, 11, 0.4)'
                            : ans.isCorrect
                              ? 'rgba(16, 185, 129, 0.3)'
                              : 'rgba(239, 68, 68, 0.25)'}`,
                        }}
                      >
                        {/* Question Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: '800',
                              padding: '2px 8px',
                              borderRadius: '5px',
                              backgroundColor: isEssay ? 'rgba(245, 158, 11, 0.16)' : 'var(--bg-surface)',
                              color: isEssay ? '#D97706' : 'var(--primary)',
                            }}>
                              {isAr ? `السؤال ${ans.questionNumber || idx + 1}` : `Q${ans.questionNumber || idx + 1}`}
                              {' • '}
                              {ans.questionType === 'mcq'
                                ? (isAr ? 'اختيار من متعدد' : 'MCQ')
                                : ans.questionType === 'true_false'
                                  ? (isAr ? 'صح وخطأ' : 'True/False')
                                  : (isAr ? 'سؤال مقالي (تصحيح المعلم)' : 'Essay (Teacher Grading)')}
                            </span>

                            {!isEssay && (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '11px',
                                fontWeight: '800',
                                color: ans.isCorrect ? 'var(--success)' : '#EF4444',
                              }}>
                                {ans.isCorrect ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                                {ans.isCorrect ? (isAr ? 'إجابة صحيحة' : 'Correct') : (isAr ? 'إجابة خاطئة' : 'Incorrect')}
                              </span>
                            )}
                          </div>

                          <span style={{
                            fontSize: '12px',
                            fontWeight: '900',
                            padding: '3px 9px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--bg-surface)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-subtle)',
                            fontFamily: 'var(--font-heading)',
                          }}>
                            {isEssay
                              ? `${draft.pointsAwarded === '' ? 0 : draft.pointsAwarded} / ${maxPts} ${isAr ? 'درجة' : 'pts'}`
                              : `${ans.pointsAwarded} / ${maxPts} ${isAr ? 'درجة' : 'pts'}`}
                          </span>
                        </div>

                        {/* Question Text */}
                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.55, marginBottom: '12px' }}>
                          {ans.questionAr}
                        </div>

                        {/* MCQ Display */}
                        {ans.questionType === 'mcq' && (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '8px' }}>
                            {(ans.optionsAr || []).map((opt, oIdx) => {
                              const isSelected = ans.selectedIndex === oIdx;
                              const isCorrectOpt = ans.correctIndex === oIdx;
                              const borderColor = isCorrectOpt
                                ? 'var(--success)'
                                : isSelected
                                  ? '#EF4444'
                                  : 'var(--border-subtle)';
                              const bgColor = isCorrectOpt
                                ? (isDark ? 'rgba(16, 185, 129, 0.14)' : '#ECFDF5')
                                : isSelected
                                  ? (isDark ? 'rgba(239, 68, 68, 0.14)' : '#FEF2F2')
                                  : 'var(--bg-surface)';

                              return (
                                <div
                                  key={oIdx}
                                  style={{
                                    padding: '8px 10px',
                                    borderRadius: '7px',
                                    border: `1.5px solid ${borderColor}`,
                                    backgroundColor: bgColor,
                                    fontSize: '12.5px',
                                    fontWeight: isSelected || isCorrectOpt ? '700' : '500',
                                    color: 'var(--text-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '8px',
                                  }}
                                >
                                  <span>{ARABIC_OPTION_LETTERS[oIdx] || oIdx + 1}) {opt}</span>
                                  <span style={{ fontSize: '10.5px', fontWeight: '800', whiteSpace: 'nowrap' }}>
                                    {isSelected && isCorrectOpt && (isAr ? '✓ إجابة الطالب' : '✓ Student')}
                                    {isSelected && !isCorrectOpt && (isAr ? '✗ اختيار الطالب' : '✗ Student')}
                                    {!isSelected && isCorrectOpt && (isAr ? '✓ الصحيحة' : '✓ Correct')}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* True / False Display */}
                        {ans.questionType === 'true_false' && (
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '12.5px' }}>
                            <div style={{
                              padding: '7px 12px',
                              borderRadius: '7px',
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                            }}>
                              <span style={{ color: 'var(--text-muted)' }}>{isAr ? 'إجابة الطالب: ' : 'Student Answer: '}</span>
                              <strong style={{ color: ans.isCorrect ? 'var(--success)' : '#EF4444' }}>
                                {ans.selectedBool === null || ans.selectedBool === undefined
                                  ? (isAr ? 'لم يجب' : 'Unanswered')
                                  : ans.selectedBool
                                    ? (isAr ? 'صواب ✓' : 'True ✓')
                                    : (isAr ? 'خطأ ✗' : 'False ✗')}
                              </strong>
                            </div>
                            <div style={{
                              padding: '7px 12px',
                              borderRadius: '7px',
                              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.12)' : '#ECFDF5',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                            }}>
                              <span style={{ color: 'var(--text-muted)' }}>{isAr ? 'الإجابة الصحيحة: ' : 'Correct Answer: '}</span>
                              <strong style={{ color: 'var(--success)' }}>
                                {ans.correctBool ? (isAr ? 'صواب ✓' : 'True ✓') : (isAr ? 'خطأ ✗' : 'False ✗')}
                              </strong>
                            </div>
                          </div>
                        )}

                        {/* ESSAY REVIEW & GRADING PANEL */}
                        {isEssay && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {/* Student's Written Answer */}
                            <div style={{
                              padding: '12px 14px',
                              borderRadius: '9px',
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-medium, var(--border-subtle))',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '800', color: 'var(--primary)', marginBottom: '6px' }}>
                                <FileText size={13} />
                                <span>{isAr ? 'إجابة الطالب المكتوبة:' : 'Student Written Answer:'}</span>
                              </div>
                              <div style={{
                                fontSize: '13px',
                                color: ans.essayAnswerText ? 'var(--text-primary)' : 'var(--text-muted)',
                                lineHeight: 1.7,
                                whiteSpace: 'pre-wrap',
                                fontStyle: ans.essayAnswerText ? 'normal' : 'italic',
                              }}>
                                {ans.essayAnswerText || (isAr ? 'لم يقم الطالب بكتابة إجابة لهذا السؤال.' : 'Student did not write an answer.')}
                              </div>
                            </div>

                            {/* Model Answer & Rubric Reference */}
                            {(ans.modelAnswerAr || (Array.isArray(ans.rubricPointsAr) && ans.rubricPointsAr.length > 0)) && (
                              <div style={{
                                padding: '10px 14px',
                                borderRadius: '9px',
                                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.08)' : '#F0FDF4',
                                border: '1px solid rgba(16, 185, 129, 0.28)',
                                fontSize: '12px',
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800', color: 'var(--success)', marginBottom: '4px' }}>
                                  <BookOpen size={13} />
                                  <span>{isAr ? 'الإجابة النموذجية ومعايير التصحيح:' : 'Model Answer & Rubric:'}</span>
                                </div>
                                {ans.modelAnswerAr && (
                                  <div style={{ color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: ans.rubricPointsAr?.length ? '6px' : 0 }}>
                                    {ans.modelAnswerAr}
                                  </div>
                                )}
                                {Array.isArray(ans.rubricPointsAr) && ans.rubricPointsAr.length > 0 && (
                                  <ul style={{ margin: 0, paddingInlineStart: '18px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    {ans.rubricPointsAr.map((r, rIdx) => (
                                      <li key={rIdx}>{r}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}

                            {/* Teacher Grading Input Controls */}
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                              gap: '12px',
                              padding: '12px',
                              borderRadius: '9px',
                              backgroundColor: 'var(--bg-subtle)',
                              border: '1px solid var(--border-subtle)',
                            }}>
                              <div>
                                <label style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                                  {isAr ? `الدرجة المستحقة (من ${maxPts}):` : `Awarded Points (max ${maxPts}):`}
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                  <input
                                    type="number"
                                    min="0"
                                    max={maxPts}
                                    step="0.5"
                                    value={draft.pointsAwarded}
                                    onChange={(e) => updateDraft(key, 'pointsAwarded', e.target.value)}
                                    style={{
                                      width: '78px',
                                      padding: '7px 10px',
                                      borderRadius: '7px',
                                      border: '1.5px solid var(--primary)',
                                      backgroundColor: 'var(--bg-surface)',
                                      color: 'var(--text-primary)',
                                      fontSize: '14px',
                                      fontWeight: '900',
                                      textAlign: 'center',
                                      outline: 'none',
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => updateDraft(key, 'pointsAwarded', '0')}
                                    style={{
                                      padding: '6px 9px',
                                      borderRadius: '6px',
                                      border: '1px solid rgba(239, 68, 68, 0.35)',
                                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                      color: '#EF4444',
                                      fontSize: '11px',
                                      fontWeight: '800',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    0
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateDraft(key, 'pointsAwarded', String(halfPts))}
                                    style={{
                                      padding: '6px 9px',
                                      borderRadius: '6px',
                                      border: '1px solid rgba(245, 158, 11, 0.35)',
                                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                      color: '#D97706',
                                      fontSize: '11px',
                                      fontWeight: '800',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {isAr ? `نصف (${halfPts})` : `Half (${halfPts})`}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateDraft(key, 'pointsAwarded', String(maxPts))}
                                    style={{
                                      padding: '6px 9px',
                                      borderRadius: '6px',
                                      border: '1px solid rgba(16, 185, 129, 0.35)',
                                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                                      color: 'var(--success)',
                                      fontSize: '11px',
                                      fontWeight: '800',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {isAr ? `كاملة (${maxPts})` : `Full (${maxPts})`}
                                  </button>
                                </div>
                              </div>

                              <div>
                                <label style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                                  {isAr ? 'ملاحظة المعلم على هذا السؤال (اختياري):' : 'Question Feedback (optional):'}
                                </label>
                                <input
                                  type="text"
                                  maxLength={1000}
                                  value={draft.teacherFeedback}
                                  onChange={(e) => updateDraft(key, 'teacherFeedback', e.target.value)}
                                  placeholder={isAr ? 'مثال: إجابة ممتازة، ينقصها ذكر المعادلة...' : 'e.g. Good explanation, add formula...'}
                                  style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    borderRadius: '7px',
                                    border: '1px solid var(--border-subtle)',
                                    backgroundColor: 'var(--bg-surface)',
                                    color: 'var(--text-primary)',
                                    fontSize: '12.5px',
                                    fontFamily: 'inherit',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* General Teacher Feedback */}
                {detail && (
                  <div style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      marginBottom: '8px',
                    }}>
                      <MessageSquare size={14} color="var(--primary)" />
                      <span>{isAr ? 'تعليق وملاحظة عامة للطالب على الامتحان (اختياري):' : 'Overall Teacher Feedback (optional):'}</span>
                    </label>
                    <textarea
                      rows={2}
                      maxLength={2000}
                      value={generalFeedback}
                      onChange={(e) => setGeneralFeedback(e.target.value)}
                      placeholder={isAr ? 'اكتب كلمة تشجيعية أو توصية لمذاكرة الطالب...' : 'Add general encouragement or study tips...'}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sticky Footer Actions */}
          <div style={{
            padding: '14px 22px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              {detail?.status === 'graded' ? <Award size={15} color="var(--success)" /> : <Clock size={15} color="#D97706" />}
              <span>
                {essayAnswers.length > 0
                  ? (isAr ? `يحتوي الامتحان على ${essayAnswers.length} سؤال مقالي للتصحيح والاعتماد` : `${essayAnswers.length} essay question(s) to grade & approve`)
                  : (isAr ? 'تصحيح الأسئلة الموضوعية تلقائي — يمكنك إضافة ملاحظة واعتماد المراجعة' : 'Objective questions auto-graded — add notes & approve review')}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              {detail && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '9px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--success, #10B981)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: isSubmitting ? 'wait' : 'pointer',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                  }}
                >
                  {isSubmitting ? <Loader2 size={14} className="spin" /> : <Check size={15} />}
                  <span>
                    {isSubmitting
                      ? (isAr ? 'جاري الحفظ والاعتماد...' : 'Saving & Approving...')
                      : detail.status === 'graded'
                        ? (isAr ? 'تحديث واعتماد الدرجة النهائية' : 'Update & Approve Grade')
                        : (isAr ? 'اعتماد الدرجة النهائية وإرسال النتيجة' : 'Approve & Finalize Score')}
                  </span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
