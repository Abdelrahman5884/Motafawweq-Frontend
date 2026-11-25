import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Check,
} from 'lucide-react';
import {
  ARABIC_OPTION_LETTERS,
  QUESTION_TYPES,
  createBlankQuestion,
  serializeQuestionsForApi,
} from './examConstants';

const INPUT_STYLE = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: '8px',
  border: '1px solid var(--border-subtle)',
  backgroundColor: 'var(--bg-subtle)',
  color: 'var(--text-primary)',
  fontSize: '13px',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

const LABEL_STYLE = {
  fontSize: '12px',
  fontWeight: '700',
  color: 'var(--text-secondary)',
  display: 'block',
  marginBottom: '6px',
};

export const ExamCreateWizard = ({
  courses = [],
  isAr,
  isRtl,
  isSubmitting = false,
  error = '',
  onCancel,
  onSubmit,
}) => {
  const defaultCourse = courses[0] || null;
  const [step, setStep] = useState(1);

  const [title, setTitle] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(defaultCourse?.uuid || defaultCourse?.id || '');
  const [customCourseTitle, setCustomCourseTitle] = useState(defaultCourse?.titleAr || defaultCourse?.title || '');
  const [duration, setDuration] = useState('45');
  const [fullMark, setFullMark] = useState('15');
  const [passScore, setPassScore] = useState('9');
  const [dueDate, setDueDate] = useState('');
  const [targetCount, setTargetCount] = useState(3);
  const [showResults, setShowResults] = useState(true);

  const [questions, setQuestions] = useState(() => [
    createBlankQuestion('mcq', 1, 5),
    createBlankQuestion('mcq', 2, 5),
    createBlankQuestion('essay', 3, 5),
  ]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [stepError, setStepError] = useState('');

  const handleProceedToStep2 = (e) => {
    e.preventDefault();
    if (title.trim().length < 3) {
      setStepError(isAr ? 'يرجى إدخال عنوان للاختبار لا يقل عن 3 أحرف.' : 'Please enter an exam title (at least 3 characters).');
      return;
    }
    setStepError('');

    const count = Math.max(1, Math.min(100, Number(targetCount) || 1));
    const total = Math.max(count, Number(fullMark) || count * 5);
    const equalPts = Math.max(1, Math.round(total / count));

    const nextQuestions = Array.from({ length: count }, (_, idx) => {
      const existing = questions[idx];
      if (existing) {
        return { ...existing, number: idx + 1, points: equalPts };
      }
      return createBlankQuestion('mcq', idx + 1, equalPts);
    });

    const syncedTotal = nextQuestions.reduce((sum, q) => sum + Number(q.points || 1), 0);
    setQuestions(nextQuestions);
    setFullMark(String(syncedTotal));
    setPassScore((prev) => String(Math.min(syncedTotal, Number(prev) || Math.round(syncedTotal * 0.6))));
    setCurrentIdx(0);
    setStep(2);
  };

  const currentQuestion = questions[currentIdx] || questions[0];

  const updateCurrentQuestion = (patch) => {
    setQuestions((prev) => {
      const updated = prev.map((q, i) => (i === currentIdx ? { ...q, ...patch } : q));
      if (Object.prototype.hasOwnProperty.call(patch, 'points')) {
        const newTotal = updated.reduce((sum, q) => sum + Math.max(0, Number(q.points) || 0), 0);
        setFullMark(String(newTotal));
      }
      return updated;
    });
  };

  const handleFinish = () => {
    const emptyIdx = questions.findIndex((q) => !q.questionAr || q.questionAr.trim().length < 2);
    if (emptyIdx !== -1) {
      setCurrentIdx(emptyIdx);
      setStepError(
        isAr
          ? `يرجى كتابة نص السؤال رقم (${emptyIdx + 1}) قبل نشر الاختبار.`
          : `Please enter question text for question #${emptyIdx + 1}.`
      );
      return;
    }

    setStepError('');
    const serialized = serializeQuestionsForApi(questions);
    const finalFullMark = serialized.reduce((sum, q) => sum + Number(q.points || 1), 0);
    const matchedCourse = courses.find((c) => (c.uuid || c.id) === selectedCourseId);

    const payload = {
      title_ar: title.trim(),
      title_en: title.trim(),
      course_id: matchedCourse ? (matchedCourse.uuid || matchedCourse.id) : undefined,
      course_title_ar: matchedCourse
        ? (matchedCourse.titleAr || matchedCourse.title)
        : (customCourseTitle.trim() || 'المقرر الدراسي'),
      duration_minutes: Math.max(5, Number(duration) || 45),
      full_mark: finalFullMark,
      pass_score: Math.max(0, Math.min(finalFullMark, Number(passScore) || Math.round(finalFullMark * 0.6))),
      due_date: dueDate || undefined,
      show_results: showResults,
      status: 'active',
      questions: serialized,
    };

    onSubmit(payload);
  };

  const displayError = stepError || error;

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onCancel}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '7px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          <ArrowRight size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
          <span>{isAr ? 'الرجوع للاختبارات' : 'Back to Exams'}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '800' }}>
          <span style={{ color: step === 1 ? 'var(--primary)' : 'var(--success)' }}>
            1. {isAr ? 'إعدادات الامتحان' : 'Exam Info'}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span style={{ color: step === 2 ? 'var(--primary)' : 'var(--text-muted)' }}>
            2. {isAr ? 'بناء الأسئلة' : 'Questions Builder'}
          </span>
        </div>
      </div>

      {displayError && (
        <div
          role="alert"
          style={{
            padding: '11px 14px',
            marginBottom: '14px',
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
          <AlertTriangle size={16} />
          <span>{displayError}</span>
        </div>
      )}

      {step === 1 ? (
        <form
          onSubmit={handleProceedToStep2}
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 4px' }}>
              {isAr ? 'إنشاء اختبار تقييمي جديد' : 'Create New Assessment'}
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
              {isAr ? 'حدد بيانات الامتحان وعدد الأسئلة، ثم أضف أسئلة اختياري أو صح وخطأ أو مقالي.' : 'Configure exam details and then build your MCQ, True/False, or Essay questions.'}
            </p>
          </div>

          <div>
            <label style={LABEL_STYLE}>{isAr ? 'عنوان الاختبار:' : 'Exam Title:'}</label>
            <input
              type="text"
              required
              minLength={3}
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isAr ? 'مثال: اختبار الفصل الأول — الدعامة والحركة' : 'e.g. Chapter 1 Assessment'}
              style={INPUT_STYLE}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '12px' }}>
            <div>
              <label style={LABEL_STYLE}>{isAr ? 'المقرر المرتبط:' : 'Linked Course:'}</label>
              {courses.length > 0 ? (
                <select
                  value={selectedCourseId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedCourseId(id);
                    const found = courses.find((c) => (c.uuid || c.id) === id);
                    if (found) setCustomCourseTitle(found.titleAr || found.title || '');
                  }}
                  style={INPUT_STYLE}
                >
                  {courses.map((c) => (
                    <option key={c.uuid || c.id} value={c.uuid || c.id}>
                      {c.titleAr || c.title}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={customCourseTitle}
                  onChange={(e) => setCustomCourseTitle(e.target.value)}
                  placeholder={isAr ? 'اسم المقرر الدراسي' : 'Course title'}
                  style={INPUT_STYLE}
                />
              )}
            </div>

            <div>
              <label style={LABEL_STYLE}>{isAr ? 'آخر موعد للتسليم (اختياري):' : 'Due Date (optional):'}</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={INPUT_STYLE}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '12px' }}>
            <div>
              <label style={LABEL_STYLE}>{isAr ? 'عدد الأسئلة:' : 'Questions Count:'}</label>
              <input
                type="number"
                min="1"
                max="100"
                value={targetCount}
                onChange={(e) => setTargetCount(Number(e.target.value) || 1)}
                style={INPUT_STYLE}
              />
            </div>
            <div>
              <label style={LABEL_STYLE}>{isAr ? 'المدة (دقيقة):' : 'Duration (min):'}</label>
              <input
                type="number"
                min="5"
                max="360"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={INPUT_STYLE}
              />
            </div>
            <div>
              <label style={LABEL_STYLE}>{isAr ? 'الدرجة الكلية:' : 'Full Mark:'}</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={fullMark}
                onChange={(e) => setFullMark(e.target.value)}
                style={INPUT_STYLE}
              />
            </div>
            <div>
              <label style={LABEL_STYLE}>{isAr ? 'درجة النجاح:' : 'Pass Score:'}</label>
              <input
                type="number"
                min="0"
                max="1000"
                value={passScore}
                onChange={(e) => setPassScore(e.target.value)}
                style={INPUT_STYLE}
              />
            </div>
          </div>

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showResults}
              onChange={(e) => setShowResults(e.target.checked)}
              style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
            />
            <span>{isAr ? 'إظهار النتيجة ونموذج الإجابة للطالب فور اعتماد الدرجة' : 'Reveal score & model answers to students once graded'}</span>
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              style={{
                padding: '9px 22px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'التالي: بناء الأسئلة' : 'Next: Build Questions'}
            </button>
          </div>
        </form>
      ) : (
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {/* Step 2 Question Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {questions.map((q, idx) => {
                const isFilled = Boolean(q.questionAr && q.questionAr.trim().length >= 2);
                const isActive = idx === currentIdx;
                return (
                  <button
                    key={q.id || idx}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '7px',
                      border: `1.5px solid ${isActive ? 'var(--primary)' : isFilled ? 'var(--success)' : 'var(--border-subtle)'}`,
                      backgroundColor: isActive ? 'var(--primary)' : isFilled ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-subtle)',
                      color: isActive ? '#FFFFFF' : isFilled ? 'var(--success)' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)' }}>
              {isAr ? `الدرجة الكلية: ${fullMark} درجة` : `Total: ${fullMark} pts`}
            </span>
          </div>

          {/* Question Type & Points */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {Object.values(QUESTION_TYPES).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => updateCurrentQuestion({ type: t.id, typeNameAr: t.labelAr })}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '7px',
                    border: `1.5px solid ${currentQuestion.type === t.id ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    backgroundColor: currentQuestion.type === t.id ? 'rgba(0, 102, 204, 0.1)' : 'var(--bg-subtle)',
                    color: currentQuestion.type === t.id ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                  }}
                >
                  {isAr ? t.labelAr : t.labelEn}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {isAr ? 'الدرجة:' : 'Points:'}
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={currentQuestion.points}
                onChange={(e) => updateCurrentQuestion({ points: e.target.value })}
                style={{ ...INPUT_STYLE, width: '70px', textAlign: 'center', fontWeight: '800' }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label style={LABEL_STYLE}>
              {isAr ? `نص السؤال رقم (${currentIdx + 1}):` : `Question #${currentIdx + 1} Text:`}
            </label>
            <textarea
              rows={3}
              value={currentQuestion.questionAr}
              onChange={(e) => updateCurrentQuestion({ questionAr: e.target.value })}
              placeholder={isAr ? 'اكتب نص السؤال بوضوح هنا...' : 'Enter the question prompt...'}
              style={{ ...INPUT_STYLE, resize: 'vertical' }}
            />
          </div>

          {/* Type-specific fields */}
          {currentQuestion.type === 'mcq' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={LABEL_STYLE}>{isAr ? 'الاختيارات (حدد الدائرة بجانب الإجابة الصحيحة):' : 'Options (select correct answer):'}</label>
              {(currentQuestion.optionsAr || ['', '', '', '']).map((opt, oIdx) => (
                <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="radio"
                    name={`wizard-correct-${currentIdx}`}
                    checked={currentQuestion.correctIndex === oIdx}
                    onChange={() => updateCurrentQuestion({ correctIndex: oIdx })}
                    style={{ accentColor: 'var(--success)', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: '800', width: '22px', fontSize: '12.5px' }}>{ARABIC_OPTION_LETTERS[oIdx] || oIdx + 1})</span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const next = [...(currentQuestion.optionsAr || ['', '', '', ''])];
                      next[oIdx] = e.target.value;
                      updateCurrentQuestion({ optionsAr: next });
                    }}
                    placeholder={isAr ? `الخيار ${oIdx + 1}` : `Option ${oIdx + 1}`}
                    style={INPUT_STYLE}
                  />
                </div>
              ))}
            </div>
          )}

          {currentQuestion.type === 'true_false' && (
            <div>
              <label style={LABEL_STYLE}>{isAr ? 'الإجابة الصحيحة:' : 'Correct Answer:'}</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { val: true, label: isAr ? 'صواب (العبارة صحيحة)' : 'True' },
                  { val: false, label: isAr ? 'خطأ (العبارة غير صحيحة)' : 'False' },
                ].map((opt) => (
                  <button
                    key={String(opt.val)}
                    type="button"
                    onClick={() => updateCurrentQuestion({ correctBool: opt.val })}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: `1.5px solid ${currentQuestion.correctBool === opt.val ? 'var(--success)' : 'var(--border-subtle)'}`,
                      backgroundColor: currentQuestion.correctBool === opt.val ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-subtle)',
                      color: currentQuestion.correctBool === opt.val ? 'var(--success)' : 'var(--text-primary)',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentQuestion.type === 'essay' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={LABEL_STYLE}>{isAr ? 'الإجابة النموذجية (تظهر للمعلم أثناء التصحيح):' : 'Model Answer (grading reference):'}</label>
                <textarea
                  rows={3}
                  value={currentQuestion.modelAnswerAr}
                  onChange={(e) => updateCurrentQuestion({ modelAnswerAr: e.target.value })}
                  placeholder={isAr ? 'اكتب الإجابة النموذجية الكاملة للمقارنة مع إجابة الطالب...' : 'Write the expected model answer...'}
                  style={{ ...INPUT_STYLE, resize: 'vertical' }}
                />
              </div>
              <div>
                <label style={LABEL_STYLE}>{isAr ? 'معايير توزيع الدرجة (سطر لكل معيار):' : 'Grading Rubric Points (one per line):'}</label>
                <textarea
                  rows={2}
                  value={(currentQuestion.rubricPointsAr || []).join('\n')}
                  onChange={(e) => updateCurrentQuestion({ rubricPointsAr: e.target.value.split('\n') })}
                  style={{ ...INPUT_STYLE, resize: 'vertical' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={LABEL_STYLE}>{isAr ? 'التعليل أو الشرح (اختياري):' : 'Explanation (optional):'}</label>
            <input
              type="text"
              value={currentQuestion.explanationAr}
              onChange={(e) => updateCurrentQuestion({ explanationAr: e.target.value })}
              placeholder={isAr ? 'توضيح مختصر يظهر للطالب بعد التصحيح...' : 'Brief explanation shown after grading...'}
              style={INPUT_STYLE}
            />
          </div>

          {/* Step 2 Navigation Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '8px' }}>
            <button
              type="button"
              onClick={() => (currentIdx > 0 ? setCurrentIdx(currentIdx - 1) : setStep(1))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 14px',
                borderRadius: '7px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              <span>{currentIdx > 0 ? (isAr ? 'السؤال السابق' : 'Previous') : (isAr ? 'تعديل الإعدادات' : 'Back to Info')}</span>
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              {currentIdx < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 18px',
                    borderRadius: '7px',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: '800',
                    cursor: 'pointer',
                  }}
                >
                  <span>{isAr ? 'السؤال التالي' : 'Next Question'}</span>
                  {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinish}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--success, #10B981)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: isSubmitting ? 'wait' : 'pointer',
                  }}
                >
                  {isSubmitting ? <Loader2 size={14} className="spin" /> : <Check size={15} />}
                  <span>{isSubmitting ? (isAr ? 'جاري النشر...' : 'Publishing...') : (isAr ? 'إنهاء ونشر الاختبار الآن' : 'Publish Exam')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
