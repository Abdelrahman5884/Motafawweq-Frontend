import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_LESSON } from '../../data/mockData';
import { UPCOMING_EXAMS } from '../../data/studentData';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  Flag, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  Award, 
  Sparkles,
  RotateCcw,
  ShieldAlert,
  HelpCircle,
  FileCheck2,
  Calendar,
  X,
  Play
} from 'lucide-react';

export const ExamTakingView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();

  // Mode: 'catalog' (US-46, US-47) | 'taking' (US-48 - US-52) | 'results' (US-53, US-54, US-55)
  const [examState, setExamState] = useState('catalog');
  const [activeExam, setActiveExam] = useState(UPCOMING_EXAMS[0]);

  const questions = MOCK_LESSON.quizzes || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(activeExam.durationMinutes * 60);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [showReviewConfirm, setShowReviewConfirm] = useState(false);

  // Countdown timer in 'taking' state (US-49)
  useEffect(() => {
    let timer;
    if (examState === 'taking' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examState, timeLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartExam = (exam) => {
    setActiveExam(exam);
    setTimeLeft(exam.durationMinutes * 60);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setCurrentIdx(0);
    setExamState('taking');
  };

  const handleSelectOption = (optIdx) => {
    if (examState !== 'taking') return;
    // Auto-save answers (US-50)
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [currentIdx]: !prev[currentIdx]
    }));
  };

  const handleAutoSubmit = () => {
    setExamState('results');
    setAttemptsUsed(prev => prev + 1);
  };

  const handleSubmitExam = () => {
    setShowReviewConfirm(false);
    setExamState('results');
    setAttemptsUsed(prev => prev + 1);
    confetti({
      particleCount: 130,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleRetakeExam = () => {
    if (attemptsUsed >= activeExam.attemptsAllowed) {
      alert(lang === 'ar' ? 'عفواً، لقد استنفدت عدد المحاولات المسموح بها لهذا الامتحان.' : 'No attempts remaining.');
      return;
    }
    handleStartExam(activeExam);
  };

  // Calculate score (US-53)
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctIndex) {
      correctCount++;
    }
  });
  const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const currentQ = questions[currentIdx] || questions[0];

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '28px 20px 80px'
    }}>
      {/* =========================================================================
          VIEW 1: EXAM CATALOG & DETAILS (US-46 & US-47)
         ========================================================================= */}
      {examState === 'catalog' && (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'الامتحانات الرسمية والاختبارات الدورية' : 'Formal Exams & Tests'}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              {lang === 'ar' ? 'امتحانات بنظام البابل شيت الحديث مع توقيت زمني دقيق وتصحيح تفصيلي' : 'Official exams with timed sessions and question-by-question review'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {UPCOMING_EXAMS.map((exam) => (
              <div
                key={exam.id}
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1.5px solid var(--border-medium)',
                  borderRadius: '24px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '8px', backgroundColor: 'var(--primary-surface)', color: 'var(--primary)' }}>
                      {exam.subjectAr}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '8px' }}>
                      متاح الآن ✅
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                    {exam.titleAr}
                  </h3>

                  {/* Exam Conditions & Details (US-47) */}
                  <div style={{
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '14px',
                    borderRadius: '16px',
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '12.5px',
                    color: 'var(--text-secondary)'
                  }}>
                    <div>⏱️ {lang === 'ar' ? `المدة الزمنية: ${exam.durationMinutes} دقيقة` : `Duration: ${exam.durationMinutes} mins`}</div>
                    <div>📝 {lang === 'ar' ? `عدد الأسئلة: ${questions.length} سؤالاً اختيارياً` : `Questions: ${questions.length}`}</div>
                    <div>🎯 {lang === 'ar' ? `الدرجة العظمى: ${exam.maxScore} درجة` : `Max Score: ${exam.maxScore}`}</div>
                    <div>🔄 {lang === 'ar' ? `المحاولات المسموحة: ${exam.attemptsAllowed} (المستخدم: ${attemptsUsed})` : `Attempts: ${exam.attemptsAllowed}`}</div>
                  </div>
                </div>

                {/* Start Exam Button (US-48) */}
                <button
                  onClick={() => handleStartExam(exam)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(108, 77, 255, 0.35)'
                  }}
                >
                  <Play size={16} fill="#FFFFFF" />
                  <span>{lang === 'ar' ? 'بدء الامتحان الآن' : 'Start Exam'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: ACTIVE EXAM SESSION (US-48, US-49, US-50, US-51, US-52)
         ========================================================================= */}
      {examState === 'taking' && (
        <div>
          {/* Header with live timer */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1.5px solid var(--border-medium)',
            borderRadius: '20px',
            padding: '16px 24px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)' }}>
                {activeExam.subjectAr}
              </div>
              <h2 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                {activeExam.titleAr}
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Countdown Timer (US-49) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                backgroundColor: timeLeft < 300 ? '#FEF2F2' : 'var(--bg-subtle)',
                border: '1px solid',
                borderColor: timeLeft < 300 ? '#FCA5A5' : 'var(--border-subtle)',
                color: timeLeft < 300 ? '#DC2626' : 'var(--text-primary)',
                fontWeight: '900',
                fontSize: '15px'
              }}>
                <Clock size={18} />
                <span>{formatTime(timeLeft)}</span>
              </div>

              {/* Flag Question */}
              <button
                onClick={handleToggleFlag}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  backgroundColor: flaggedQuestions[currentIdx] ? '#FEF3C7' : 'var(--bg-subtle)',
                  border: '1px solid',
                  borderColor: flaggedQuestions[currentIdx] ? '#F59E0B' : 'var(--border-subtle)',
                  color: flaggedQuestions[currentIdx] ? '#B45309' : 'var(--text-secondary)',
                  fontWeight: '800',
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                <Flag size={14} fill={flaggedQuestions[currentIdx] ? '#F59E0B' : 'none'} />
                <span>{flaggedQuestions[currentIdx] ? 'معلم للمراجعة' : 'تحديد للمراجعة'}</span>
              </button>
            </div>
          </div>

          {/* Question Grid Strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '12px',
            marginBottom: '20px'
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
                    minWidth: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: isCurrent ? 'var(--primary)' : isAnswered ? 'var(--primary-surface)' : 'var(--bg-surface)',
                    border: '1.5px solid',
                    borderColor: isCurrent ? 'var(--primary)' : isAnswered ? 'var(--primary-light)' : 'var(--border-subtle)',
                    color: isCurrent ? '#FFFFFF' : isAnswered ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span style={{ position: 'absolute', top: '2px', right: '2px', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Question Box */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1.5px solid var(--border-medium)',
            borderRadius: '24px',
            padding: '32px',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)', marginBottom: '12px' }}>
              {lang === 'ar' ? `السؤال ${currentIdx + 1} من ${questions.length}` : `Question ${currentIdx + 1} of ${questions.length}`}
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '24px' }}>
              {currentQ.questionAr}
            </h3>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {currentQ.optionsAr.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentIdx] === optIdx;
                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '16px',
                      backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                      border: '2px solid',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border-subtle)',
                      color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                      cursor: 'pointer',
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
                      border: '2px solid',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border-medium)',
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

            {/* Stepper Buttons */}
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
                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
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
                    onClick={() => setShowReviewConfirm(true)}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '12px',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: '900',
                      fontSize: '13.5px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    {lang === 'ar' ? 'مراجعة وتسليم الامتحان' : 'Review & Submit'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: RESULTS & FULL ERROR REVIEW (US-53, US-54, US-55)
         ========================================================================= */}
      {examState === 'results' && (
        <div>
          {/* Scorecard Hero */}
          <div style={{
            background: 'linear-gradient(135deg, var(--bg-surface-elevated) 0%, rgba(108, 77, 255, 0.12) 100%)',
            border: '2px solid var(--primary)',
            borderRadius: '24px',
            padding: '32px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--primary)' }}>
                {lang === 'ar' ? 'نتيجة الامتحان الشامل' : 'Official Exam Scorecard'}
              </span>
              <h2 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-primary)', margin: '4px 0 8px 0' }}>
                {scorePercent >= 80 ? '🎉 مبروك! نتيجة متميزة' : '👍 أحسنت المحاولة'}
              </h2>
              <div style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                {lang === 'ar' 
                  ? `أجبت بشكل صحيح على ${correctCount} من ${questions.length} أسئلة بنسبة ${scorePercent}%`
                  : `Score: ${correctCount} / ${questions.length} (${scorePercent}%)`}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button
                onClick={handleRetakeExam}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 20px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={16} />
                <span>{lang === 'ar' ? 'إعادة الامتحان (محاولة إضافية)' : 'Retake Exam'}</span>
              </button>

              <button
                onClick={() => setExamState('catalog')}
                style={{
                  padding: '12px 22px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13.5px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'العودة للامتحانات' : 'Back to Exams'}
              </button>
            </div>
          </div>

          {/* Detailed Question by Question Error Review (US-54) */}
          <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '16px' }}>
            {lang === 'ar' ? 'مراجعة نموذج الإجابة وتصحيح الأخطاء:' : 'Detailed Question Review:'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {questions.map((q, idx) => {
              const selectedOpt = selectedAnswers[idx];
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div
                  key={q.id}
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1.5px solid',
                    borderColor: isCorrect ? '#10B981' : '#EF4444',
                    borderRadius: '20px',
                    padding: '22px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: isCorrect ? '#10B981' : '#EF4444' }}>
                      {isCorrect ? '✅ إجابة صحيحة' : '❌ إجابة خاطئة'}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      السؤال {idx + 1}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 14px 0' }}>
                    {q.questionAr}
                  </h4>

                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    <strong>{lang === 'ar' ? 'إجابتك:' : 'Your Answer:'}</strong> {selectedOpt !== undefined ? q.optionsAr[selectedOpt] : (lang === 'ar' ? 'لم تجب' : 'Unanswered')}
                  </div>
                  <div style={{ fontSize: '13px', color: '#059669', marginBottom: '12px', fontWeight: '700' }}>
                    <strong>{lang === 'ar' ? 'الإجابة الصحيحة:' : 'Correct Answer:'}</strong> {q.optionsAr[q.correctIndex]}
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: '12px', fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    💡 <strong>{lang === 'ar' ? 'التفسير العلمي:' : 'Explanation:'}</strong> {q.explanationAr}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review Confirm Modal (US-51) */}
      {showReviewConfirm && (
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
            maxWidth: '480px',
            width: '100%',
            padding: '28px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {lang === 'ar' ? 'تأكيد تسليم الامتحان' : 'Confirm Submission'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {lang === 'ar' 
                ? `لقد قمت بحل ${Object.keys(selectedAnswers).length} من ${questions.length} سؤالاً. هل تريد التسليم النهائي الآن؟`
                : `You answered ${Object.keys(selectedAnswers).length} of ${questions.length} questions. Submit now?`}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowReviewConfirm(false)}
                style={{ padding: '10px 18px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontWeight: '700', cursor: 'pointer' }}
              >
                {lang === 'ar' ? 'متابعة الحل' : 'Continue'}
              </button>
              <button
                onClick={handleSubmitExam}
                style={{ padding: '10px 24px', borderRadius: '12px', backgroundColor: '#10B981', border: 'none', color: '#FFFFFF', fontWeight: '900', cursor: 'pointer' }}
              >
                {lang === 'ar' ? 'نعم، تسليم الامتحان' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
