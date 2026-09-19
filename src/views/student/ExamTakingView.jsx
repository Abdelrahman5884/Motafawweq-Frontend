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
  ArrowLeft, 
  ArrowRight, 
  Award, 
  RotateCcw, 
  FileText, 
  Calendar, 
  X, 
  Play, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const ExamTakingView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();

  // Mode: 'catalog' | 'taking' | 'results'
  const [examState, setExamState] = useState('catalog');
  const [activeExam, setActiveExam] = useState(UPCOMING_EXAMS[0]);

  // Pre-exam confirmation modal state
  const [pendingExam, setPendingExam] = useState(null);

  const questions = MOCK_LESSON.quizzes || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(activeExam.durationMinutes * 60);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [showReviewConfirm, setShowReviewConfirm] = useState(false);

  // Countdown timer in 'taking' state
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

  // Open confirmation modal when user clicks start
  const handleRequestStartExam = (exam) => {
    if (exam.status === 'upcoming') return;
    if (attemptsUsed >= exam.attemptsAllowed) {
      alert(lang === 'ar' ? 'عفواً، لقد استنفدت عدد المحاولات المسموح بها لهذا الامتحان.' : 'No attempts remaining.');
      return;
    }
    setPendingExam(exam);
  };

  // Confirm and start the exam
  const handleConfirmStart = () => {
    if (!pendingExam) return;
    const examToStart = pendingExam;
    setPendingExam(null);
    handleStartExam(examToStart);
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
      particleCount: 100,
      spread: 70,
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

  // Calculate score
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
      maxWidth: '1060px',
      margin: '0 auto',
      padding: '28px 20px 80px',
      fontFamily: 'var(--font-arabic, sans-serif)'
    }}>
      {/* Subtle & Calm Styles */}
      <style>{`
        @keyframes softPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .clean-exam-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .clean-exam-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
          border-color: var(--border-medium);
        }
        .clean-btn {
          transition: all 0.15s ease;
        }
        .clean-btn:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }
        .clean-btn:active {
          transform: translateY(0);
        }
      `}</style>

      {/* =========================================================================
          VIEW 1: CLEAN & CALM EXAM CATALOG
         ========================================================================= */}
      {examState === 'catalog' && (
        <div>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '28px',
            paddingBottom: '20px',
            borderBottom: '1px solid var(--border-subtle)',
            flexWrap: 'wrap'
          }}>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                margin: '0 0 6px 0',
                letterSpacing: '-0.01em'
              }}>
                {lang === 'ar' ? 'الامتحانات والاختبارات' : 'Exams & Assessments'}
              </h1>
              <p style={{
                fontSize: '13.5px',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.5
              }}>
                {lang === 'ar' 
                  ? 'امتحانات بنظام البابل شيت مع توقيت زمني دقيق وتصحيح تفصيلي فوري' 
                  : 'Official timed bubble sheet exams with automated grading'}
              </p>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12.5px',
              fontWeight: '700',
              color: 'var(--text-secondary)'
            }}>
              <span>{UPCOMING_EXAMS.filter(e => e.status === 'ready').length} {lang === 'ar' ? 'امتحانات متاحة الآن' : 'exams available'}</span>
            </div>
          </div>

          {/* Clean Exam Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {UPCOMING_EXAMS.map((exam) => {
              const isReady = exam.status === 'ready';

              return (
                <div
                  key={exam.id}
                  className="clean-exam-card"
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '20px',
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <div>
                    {/* Top Row: Subject & Status */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        padding: '3px 10px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        {exam.subjectAr}
                      </span>

                      {isReady ? (
                        <span style={{
                          fontSize: '11.5px',
                          fontWeight: '700',
                          color: '#059669',
                          backgroundColor: 'rgba(16, 185, 129, 0.08)',
                          padding: '3px 9px',
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: '#10B981',
                            animation: 'softPulse 2s infinite ease-in-out'
                          }} />
                          <span>{lang === 'ar' ? 'متاح الآن' : 'Available'}</span>
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '11.5px',
                          fontWeight: '600',
                          color: 'var(--text-muted)',
                          backgroundColor: 'var(--bg-subtle)',
                          padding: '3px 9px',
                          borderRadius: '8px'
                        }}>
                          {exam.date}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: '16.5px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      margin: '0 0 8px 0',
                      lineHeight: 1.45,
                      minHeight: '44px'
                    }}>
                      {exam.titleAr}
                    </h3>

                    {/* Subtitle / Teacher */}
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      marginBottom: '16px'
                    }}>
                      {exam.teacherNameAr || 'معلم المادة'} • {exam.typeAr || 'بابل شيت رسمي'}
                    </div>

                    {/* Clean Specs Grid */}
                    <div style={{
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      marginBottom: '18px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="var(--text-muted)" />
                        <span>{exam.durationMinutes} دقيقة</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FileText size={14} color="var(--text-muted)" />
                        <span>{exam.questionsCount || questions.length} سؤالاً</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Award size={14} color="var(--text-muted)" />
                        <span>{exam.maxScore} درجة</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <RotateCcw size={14} color="var(--text-muted)" />
                        <span>المحاولات: {exam.attemptsAllowed}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {isReady ? (
                      <button
                        onClick={() => handleRequestStartExam(exam)}
                        className="clean-btn"
                        style={{
                          width: '100%',
                          padding: '11px 16px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '13.5px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 2px 10px rgba(108, 77, 255, 0.25)'
                        }}
                      >
                        <Play size={14} fill="#FFFFFF" />
                        <span>{lang === 'ar' ? 'بدء الامتحان' : 'Start Exam'}</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        style={{
                          width: '100%',
                          padding: '11px 16px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'not-allowed'
                        }}
                      >
                        {lang === 'ar' ? `متاح في موعده (${exam.date})` : 'Upcoming'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: ACTIVE EXAM SESSION
         ========================================================================= */}
      {examState === 'taking' && (
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
                backgroundColor: timeLeft < 300 ? '#FEF2F2' : 'var(--bg-subtle)',
                border: '1px solid',
                borderColor: timeLeft < 300 ? '#FCA5A5' : 'var(--border-subtle)',
                color: timeLeft < 300 ? '#DC2626' : 'var(--text-primary)',
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
                  backgroundColor: flaggedQuestions[currentIdx] ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-subtle)',
                  border: '1px solid',
                  borderColor: flaggedQuestions[currentIdx] ? '#F59E0B' : 'var(--border-subtle)',
                  color: flaggedQuestions[currentIdx] ? '#B45309' : 'var(--text-secondary)',
                  fontWeight: '700',
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
                    <span style={{ position: 'absolute', top: '3px', right: '3px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
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
                      backgroundColor: '#10B981',
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
        </div>
      )}

      {/* =========================================================================
          VIEW 3: RESULTS
         ========================================================================= */}
      {examState === 'results' && (
        <div>
          {/* Clean Scorecard */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '28px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px'
          }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)' }}>
                {lang === 'ar' ? 'نتيجة الامتحان' : 'Exam Result'}
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: '2px 0 6px 0' }}>
                {scorePercent >= 80 ? 'نتيجة متميزة' : 'انتهى الامتحان'}
              </h2>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {lang === 'ar' 
                  ? `أجبت بشكل صحيح على ${correctCount} من ${questions.length} أسئلة (${scorePercent}%)`
                  : `Score: ${correctCount} / ${questions.length} (${scorePercent}%)`}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={handleRetakeExam}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={14} />
                <span>{lang === 'ar' ? 'إعادة المحاولة' : 'Retake'}</span>
              </button>

              <button
                onClick={() => setExamState('catalog')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'العودة للامتحانات' : 'Back to Exams'}
              </button>
            </div>
          </div>

          {/* Question Review */}
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px' }}>
            {lang === 'ar' ? 'مراجعة الأسئلة:' : 'Question Review:'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {questions.map((q, idx) => {
              const selectedOpt = selectedAnswers[idx];
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div
                  key={q.id}
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid',
                    borderColor: isCorrect ? '#10B981' : '#EF4444',
                    borderRadius: '16px',
                    padding: '20px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: isCorrect ? '#10B981' : '#EF4444' }}>
                      {isCorrect ? 'إجابة صحيحة' : 'إجابة خاطئة'}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      السؤال {idx + 1}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 12px 0' }}>
                    {q.questionAr}
                  </h4>

                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <strong>{lang === 'ar' ? 'إجابتك:' : 'Your Answer:'}</strong>{' '}
                    <span style={{ color: isCorrect ? '#059669' : '#DC2626' }}>
                      {selectedOpt !== undefined ? q.optionsAr[selectedOpt] : (lang === 'ar' ? 'لم تجب' : 'Unanswered')}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#059669', marginBottom: '10px', fontWeight: '700' }}>
                    <strong>{lang === 'ar' ? 'الإجابة الصحيحة:' : 'Correct Answer:'}</strong> {q.optionsAr[q.correctIndex]}
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: '10px', fontSize: '12.5px', color: 'var(--text-primary)' }}>
                    <strong>{lang === 'ar' ? 'التوضيح:' : 'Explanation:'}</strong> {q.explanationAr}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: CALM PRE-EXAM CONFIRMATION
         ========================================================================= */}
      {pendingExam && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: '20px',
            maxWidth: '460px',
            width: '100%',
            padding: '26px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18)',
            position: 'relative',
            animation: 'modalFadeIn 0.2s ease-out'
          }}>
            {/* Close button */}
            <button
              onClick={() => setPendingExam(null)}
              style={{
                position: 'absolute',
                top: '18px',
                left: isRtl ? '18px' : 'auto',
                right: isRtl ? 'auto' : '18px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={15} />
            </button>

            {/* Title */}
            <h3 style={{
              fontSize: '18px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: '0 0 6px 0'
            }}>
              {lang === 'ar' ? 'تأكيد بدء الامتحان' : 'Confirm Exam Start'}
            </h3>
            <p style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              margin: '0 0 16px 0',
              lineHeight: 1.5
            }}>
              {lang === 'ar'
                ? 'هل أنت مستعد لبدء الامتحان الآن؟ سيبدأ المؤقت فور الضغط على تأكيد.'
                : 'Are you ready to begin? The countdown timer will start immediately.'}
            </p>

            {/* Exam Summary Box */}
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {pendingExam.subjectAr}
              </div>
              <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
                {pendingExam.titleAr}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                paddingTop: '8px',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <span>المدة: <strong>{pendingExam.durationMinutes} دقيقة</strong></span>
                <span>الأسئلة: <strong>{pendingExam.questionsCount || questions.length} سؤال</strong></span>
                <span>الدرجة: <strong>{pendingExam.maxScore} درجة</strong></span>
              </div>
            </div>

            {/* Minimal Alert Note */}
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '10px',
              padding: '10px 12px',
              marginBottom: '20px',
              lineHeight: 1.5
            }}>
              تنبيه: لا يمكن إيقاف المؤقت بعد البدء، وسيتم حفظ إجاباتك تلقائياً.
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setPendingExam(null)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                onClick={handleConfirmStart}
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(108, 77, 255, 0.3)'
                }}
              >
                {lang === 'ar' ? 'تأكيد وبدء الامتحان' : 'Confirm & Start'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: CONFIRM SUBMISSION
         ========================================================================= */}
      {showReviewConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: '20px',
            maxWidth: '440px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18)',
            animation: 'modalFadeIn 0.2s ease-out'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {lang === 'ar' ? 'تسليم الامتحان' : 'Submit Exam'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5 }}>
              {lang === 'ar' 
                ? `أجبت على ${Object.keys(selectedAnswers).length} من ${questions.length} أسئلة. هل تود تسليم الامتحان الآن؟`
                : `You answered ${Object.keys(selectedAnswers).length} of ${questions.length} questions. Submit now?`}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowReviewConfirm(false)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
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
                  padding: '9px 20px',
                  borderRadius: '10px',
                  backgroundColor: '#10B981',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'تسليم نهائي' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
