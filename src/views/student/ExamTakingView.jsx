import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_LESSON } from '../../data/mockData';
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
  RotateCcw
} from 'lucide-react';

export const ExamTakingView = () => {
  const { navigate } = useAuth();
  const { lang, isRtl } = useLanguage();

  const questions = MOCK_LESSON.quizzes || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(1500); // 25:00 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Timer countdown
  useEffect(() => {
    let timer;
    if (!isSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [currentIdx]: !prev[currentIdx]
    }));
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    // Fire celebratory confetti!
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
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
      maxWidth: '900px',
      margin: '0 auto',
      padding: '36px 24px 80px'
    }}>
      {/* Exam Header */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px 24px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
            {lang === 'ar' ? 'اختبار تقييم الحصة الإلكتروني' : 'Interactive Lesson Assessment'}
          </span>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
            {lang === 'ar' ? MOCK_LESSON.titleAr : MOCK_LESSON.title}
          </h2>
        </div>

        {/* Timed countdown */}
        {!isSubmitted && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: timeLeft < 300 ? '#FEF2F2' : 'var(--bg-subtle)',
            color: timeLeft < 300 ? '#EF4444' : 'var(--text-primary)',
            border: `1px solid ${timeLeft < 300 ? '#FCA5A5' : 'var(--border-subtle)'}`,
            fontFamily: 'var(--font-mono)',
            fontWeight: '800',
            fontSize: '15px'
          }}>
            <Clock size={16} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {!isSubmitted ? (
        <>
          {/* Question Navigator Dots */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            {questions.map((q, idx) => {
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isCurrent = currentIdx === idx;
              const isFlagged = flaggedQuestions[idx];

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: isCurrent ? 'var(--primary)' : (isAnswered ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface-elevated)'),
                    color: isCurrent ? '#FFFFFF' : (isAnswered ? '#10B981' : 'var(--text-primary)'),
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#F59E0B'
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Question Card */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {lang === 'ar' ? `السؤال ${currentIdx + 1} من ${questions.length}` : `Question ${currentIdx + 1} of ${questions.length}`}
              </span>

              <button
                onClick={handleToggleFlag}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: flaggedQuestions[currentIdx] ? '#FFFBEB' : 'transparent',
                  color: flaggedQuestions[currentIdx] ? '#F59E0B' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Flag size={14} fill={flaggedQuestions[currentIdx] ? '#F59E0B' : 'none'} />
                <span>{lang === 'ar' ? 'تمييز للمراجعة' : 'Flag for Review'}</span>
              </button>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '24px' }}>
              {lang === 'ar' ? currentQ.questionAr : currentQ.question}
            </h3>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {(lang === 'ar' ? currentQ.optionsAr : currentQ.options).map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentIdx] === optIdx;
                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--text-muted)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: '800',
                      fontSize: '11px',
                      backgroundColor: isSelected ? 'var(--primary-surface)' : 'transparent'
                    }}>
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <span style={{ fontSize: '14.5px', color: 'var(--text-primary)', fontWeight: isSelected ? '700' : '400' }}>
                      {opt}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Controls (Prev, Next, Submit) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
              <button
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentIdx === 0 ? 0.5 : 1
                }}
              >
                {isRtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                <span>{lang === 'ar' ? 'السابق' : 'Previous'}</span>
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <span>{lang === 'ar' ? 'التالي' : 'Next'}</span>
                  {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 24px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13.5px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{lang === 'ar' ? 'تسليم الامتحان النهائي' : 'Submit Exam'}</span>
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Score Report & Concept Breakdown */
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1.5px solid var(--primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
        }} className="animate-scale-in">
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Award size={36} />
          </div>

          <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
            {scorePercent >= 80 ? (lang === 'ar' ? 'ممتاز! نتيجة استثنائية 🌟' : 'Outstanding Performance! 🌟') : (lang === 'ar' ? 'نتيجة جيدة! واصل التقدم 👍' : 'Good Effort! Keep Pushing 👍')}
          </h2>

          <div style={{ fontSize: '48px', fontWeight: '900', color: 'var(--primary)', fontFamily: 'var(--font-heading)', margin: '16px 0' }}>
            {scorePercent}%
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--primary-surface)', color: 'var(--primary)', fontSize: '13px', fontWeight: '700', marginBottom: '32px' }}>
            <Sparkles size={16} />
            <span>+180 XP {lang === 'ar' ? 'أضيفت لرصيد تفوقك' : 'Added to your progress'}</span>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentIdx(0);
                setSelectedAnswers({});
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
              <span>{lang === 'ar' ? 'إعادة المحاولة' : 'Retake Quiz'}</span>
            </button>

            <button
              onClick={() => navigate('weak-areas')}
              style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(108, 77, 255, 0.35)'
              }}
            >
              {lang === 'ar' ? 'تشخيص نقاط الضعف' : 'Inspect Weak Areas'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
