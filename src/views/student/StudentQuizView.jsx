import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_LESSON } from '../../data/mockData';
import { LEAGUE_LEADERBOARD, STUDENT_PROFILE } from '../../data/studentData';
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
  Trophy,
  Brain,
  Zap,
  ChevronRight,
  HelpCircle,
  BarChart3
} from 'lucide-react';

export const StudentQuizView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();

  // Mode: 'quiz' | 'ai-generate' | 'league'
  const [activeMode, setActiveMode] = useState('quiz');

  // Quiz source: 'teacher' | 'ai'
  const [quizSource, setQuizSource] = useState('teacher');

  const baseQuestions = MOCK_LESSON.quizzes || [];
  
  // AI Generated questions presets
  const aiGeneratedQuestions = [
    {
      id: 'ai-q-1',
      questionAr: 'طبقاً للتفريغ الصوتي للمحاضرة: ما وظيفة مركب NADP+ في مرحلة التفاعلات الضوئية؟',
      type: 'mcq',
      conceptId: 'node-nadph',
      optionsAr: [
        'امتصاص طاقة الفوتونات مباشرة من الشمس',
        'استقبال ذرات الهيدروجين الناتجة من انشطار الماء لمنع اتحادها ثانية مع الأكسجين',
        'تكسير جزيئات الجلوكوز في الستروما',
        'إنتاج غاز ثاني أكسيد الكربون كناتج ثانوي'
      ],
      correctIndex: 1,
      explanationAr: 'ذكرت د. سلمى في الدقيقة 11:20 أن NADP+ يمثل "تاكسي الهيدروجين" الذي يستقبل H+ الناتج من انشطار الماء لتكوين NADPH ومنع هروب الهيدروجين.'
    },
    {
      id: 'ai-q-2',
      questionAr: 'من تفريغ تجربة كالفن: لماذا أوقف ملفين كالفن التجربة بعد ثانيتين فقط بإسقاط طحلب الكلوريلا في كحول ساخن؟',
      type: 'mcq',
      conceptId: 'node-pgal',
      optionsAr: [
        'لإثبات أن الجلوكوز يتكون مباشرة في خطوة واحدة',
        'لوقف التفاعلات الحيوية ورصد أول مركب كيميائي ثابت ناتج (وهو PGAL)',
        'لزيادة سرعة التفاعلات الضوئية في أقراص الثيلاكويد',
        'لقتل البكتيريا الضارة داخل بيئة الاختبار'
      ],
      correctIndex: 1,
      explanationAr: 'استخدم كالفن الكحول الساخن لقتل الخلية وتثبيط إنزيماتها في لحظة زمنية محددة (ثانيتين) لاكتشاف المركب الأولي وهو PGAL ثلاثي الكربون.'
    }
  ];

  const currentQuestionsList = quizSource === 'teacher' ? baseQuestions : aiGeneratedQuestions;

  // Quiz Session State
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Timer countdown
  useEffect(() => {
    let timer;
    if (!isSubmitted && timeLeft > 0 && activeMode === 'quiz') {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft, activeMode]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions(prev => ({ ...prev, [currentIdx]: !prev[currentIdx] }));
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    setShowReviewModal(false);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleGenerateAIQuiz = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      setIsGeneratingAI(false);
      setQuizSource('ai');
      setSelectedAnswers({});
      setFlaggedQuestions({});
      setCurrentIdx(0);
      setIsSubmitted(false);
      setTimeLeft(300);
      setActiveMode('quiz');
    }, 1200);
  };

  // Score calculation
  let correctCount = 0;
  currentQuestionsList.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctIndex) {
      correctCount++;
    }
  });
  const scorePercent = currentQuestionsList.length > 0 ? Math.round((correctCount / currentQuestionsList.length) * 100) : 0;
  const xpEarned = Math.round(scorePercent * 1.5);

  const currentQ = currentQuestionsList[currentIdx] || currentQuestionsList[0];

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '28px 20px 80px'
    }}>
      {/* Top Header & Navigation Mode Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'الكويزات التفاعلية ودوري المتفوقين' : 'Interactive Quizzes & League'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            {lang === 'ar' ? 'حل اختبارات الحصة أو أنشئ كويز ذكي بالـ AI ونافس في صدارة الدوري' : 'Practice quizzes, generate AI questions, and compete in the league'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{
          display: 'inline-flex',
          backgroundColor: 'var(--bg-surface)',
          padding: '4px',
          borderRadius: '16px',
          border: '1px solid var(--border-medium)'
        }}>
          <button
            onClick={() => setActiveMode('quiz')}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMode === 'quiz' ? 'var(--primary)' : 'transparent',
              color: activeMode === 'quiz' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            ✍️ {lang === 'ar' ? 'حل الكويز' : 'Take Quiz'}
          </button>

          <button
            onClick={() => setActiveMode('ai-generate')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMode === 'ai-generate' ? '#8B5CF6' : 'transparent',
              color: activeMode === 'ai-generate' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            <Brain size={15} />
            <span>{lang === 'ar' ? 'توليد بالـ AI ⭐' : 'AI Generator'}</span>
          </button>

          <button
            onClick={() => setActiveMode('league')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMode === 'league' ? '#F59E0B' : 'transparent',
              color: activeMode === 'league' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            <Trophy size={15} />
            <span>{lang === 'ar' ? 'دوري المتفوقين 🏆' : 'League'}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODE 1: QUIZ SOLVING (US-31 to US-37)
         ========================================================================= */}
      {activeMode === 'quiz' && (
        <div>
          {/* Quiz Top Status Bar */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1.5px solid var(--border-medium)',
            borderRadius: '20px',
            padding: '16px 22px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: quizSource === 'ai' ? '#8B5CF6' : 'var(--primary)', textTransform: 'uppercase' }}>
                {quizSource === 'ai' ? '🤖 كويز الذكاء الاصطناعي من الحصة' : '👨‍🏫 كويز المعلم الرسمي'}
              </span>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {MOCK_LESSON.titleAr}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Live Countdown Timer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '12px',
                backgroundColor: timeLeft < 120 ? '#FEF2F2' : 'var(--bg-subtle)',
                border: '1px solid',
                borderColor: timeLeft < 120 ? '#FCA5A5' : 'var(--border-subtle)',
                color: timeLeft < 120 ? '#DC2626' : 'var(--text-primary)',
                fontWeight: '900',
                fontSize: '14px'
              }}>
                <Clock size={16} />
                <span>{formatTime(timeLeft)}</span>
              </div>

              {/* Flag Question Button (US-33) */}
              {!isSubmitted && (
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
                  <span>{flaggedQuestions[currentIdx] ? (lang === 'ar' ? 'معلّم للمراجعة' : 'Flagged') : (lang === 'ar' ? 'وضع علامة' : 'Flag')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Question Navigation Numbers Strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '12px',
            marginBottom: '20px'
          }}>
            {currentQuestionsList.map((q, idx) => {
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
                      backgroundColor: '#F59E0B'
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Question Card Viewport */}
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
                {lang === 'ar' ? `السؤال ${currentIdx + 1} من ${currentQuestionsList.length}` : `Question ${currentIdx + 1} of ${currentQuestionsList.length}`}
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
                    optBg = '#ECFDF5';
                    optBorder = '#10B981';
                    optColor = '#065F46';
                  } else if (isSelected && !isCorrect) {
                    optBg = '#FEF2F2';
                    optBorder = '#EF4444';
                    optColor = '#991B1B';
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
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1.5px solid #10B981',
                borderRadius: '16px',
                padding: '18px 22px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: '900', fontSize: '13px', marginBottom: '6px' }}>
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
                    {currentIdx < currentQuestionsList.length - 1 ? (
                      <button
                        onClick={() => setCurrentIdx(prev => Math.min(currentQuestionsList.length - 1, prev + 1))}
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
                          backgroundColor: '#10B981',
                          color: '#FFFFFF',
                          border: 'none',
                          fontWeight: '900',
                          fontSize: '13.5px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                        }}
                      >
                        {lang === 'ar' ? 'مراجعة وتسليم الكويز' : 'Review & Submit'}
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setSelectedAnswers({});
                      setCurrentIdx(0);
                      setTimeLeft(600);
                    }}
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

          {/* Post-Submit Score Banner (US-36) */}
          {isSubmitted && (
            <div style={{
              background: 'linear-gradient(135deg, var(--bg-surface-elevated) 0%, rgba(16, 185, 129, 0.1) 100%)',
              border: '2px solid #10B981',
              borderRadius: '24px',
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div>
                <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#10B981' }}>
                  {lang === 'ar' ? 'تم تصحيح الكويز وحساب نقاط الدوري' : 'Quiz Graded'}
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', margin: '4px 0' }}>
                  {lang === 'ar' ? `درجتك: ${scorePercent}% (${correctCount}/${currentQuestionsList.length})` : `Your Score: ${scorePercent}%`}
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {scorePercent >= 80 
                    ? (lang === 'ar' ? 'أداء أسطوري! لقد أغلقت الكويز وحصلت على أعلى نقاط في الدوري 👑' : 'Legendary score! Maximized league points!') 
                    : (lang === 'ar' ? 'أداء جيد، يمكنك مراجعة الأسئلة الخاطئة من بنك الأخطاء وتكرار المحاولة.' : 'Good job! Check your mistake bank to review.')}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  padding: '10px 18px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(108, 77, 255, 0.15)',
                  border: '1.5px solid var(--primary)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--primary)' }}>
                    +{xpEarned} XP
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--primary)', fontWeight: '700' }}>
                    {lang === 'ar' ? 'نقاط دوري جديدة' : 'League XP'}
                  </div>
                </div>

                <button
                  onClick={() => setActiveMode('league')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    borderRadius: '14px',
                    backgroundColor: '#F59E0B',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13.5px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  <Trophy size={16} />
                  <span>{lang === 'ar' ? 'عرض ترتيبك في الدوري' : 'View League Standings'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODE 2: AI QUESTION GENERATOR (توليد كويز ذكي من المحاضرة)
         ========================================================================= */}
      {activeMode === 'ai-generate' && (
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1.5px solid #8B5CF6',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 12px 36px rgba(139, 92, 246, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
              <Brain size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'محرك توليد الأسئلة بالذكاء الاصطناعي ⭐' : 'AI Question Generator Engine'}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
                {lang === 'ar' ? 'يحلل الذكاء الاصطناعي تفريغ المحاضرة ويستخرج أهم الأسئلة المتوقعة بنظام البابل شيت' : 'Analyze lecture transcript & generate exam-level practice questions'}
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {lang === 'ar' ? 'المحاضرة المختارة لتحليل الأسئلة:' : 'Selected Lecture:'}
            </div>
            <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--primary)' }}>
              {MOCK_LESSON.titleAr}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              تتضمن: 10 مقاطع تفريغ صوتي • 14 مفهوماً علمياً • دورة كالفن وانشطار الماء
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                🎯 مستوى الصعوبة
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                مستويات عليا للتفكير والربط (Thanawya Bloom Levels)
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                ⚡ نوع الأسئلة
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                اختيار من متعدد (MCQ) مع تفسير علمي لكل اختيار
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateAIQuiz}
            disabled={isGeneratingAI}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: '#8B5CF6',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '15px',
              fontWeight: '900',
              cursor: isGeneratingAI ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)'
            }}
          >
            <Sparkles size={20} />
            <span>{isGeneratingAI ? (lang === 'ar' ? 'جاري استخراج الأسئلة من النص الصوتي...' : 'Generating...') : (lang === 'ar' ? 'أنشئ أسئلة ذكية فورية وابدأ الحل' : 'Generate & Start AI Quiz')}</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          MODE 3: COMPETITIVE LEAGUE (دوري المتفوقين الأسبوعي)
         ========================================================================= */}
      {activeMode === 'league' && (
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1.5px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: '0 12px 36px rgba(245, 158, 11, 0.12)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
                <Trophy size={26} />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                  {lang === 'ar' ? 'دوري المتفوقين — الأسبوع الثالث' : 'Weekly Champions League'}
                </h2>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {lang === 'ar' ? 'قفل امتحاناتك واجمع أعلى نقاط للمنافسة على درع التفوق' : 'Ace your quizzes to climb the national leaderboard'}
                </div>
              </div>
            </div>

            <div style={{ padding: '8px 16px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#D97706', fontWeight: '900', fontSize: '13px' }}>
              ⏳ ينتهي الأسبوع خلال: يومان و 14 ساعة
            </div>
          </div>

          {/* Leaderboard Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {LEAGUE_LEADERBOARD.map((item) => (
              <div
                key={item.rank}
                style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  backgroundColor: item.isMe ? 'rgba(108, 77, 255, 0.12)' : 'var(--bg-subtle)',
                  border: '1.5px solid',
                  borderColor: item.isMe ? 'var(--primary)' : 'var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* Rank Badge */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: item.rank === 1 ? '#FEF08A' : item.rank === 2 ? '#E0E7FF' : item.rank === 3 ? '#FED7AA' : 'var(--bg-surface)',
                    color: item.rank === 1 ? '#A16207' : item.rank === 2 ? '#3730A3' : item.rank === 3 ? '#9A3412' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '14px'
                  }}>
                    {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : item.rank}
                  </div>

                  {/* Avatar & Name */}
                  <img
                    src={item.avatar}
                    alt={item.nameAr}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />

                  <div>
                    <div style={{ fontSize: '14.5px', fontWeight: '900', color: item.isMe ? 'var(--primary)' : 'var(--text-primary)' }}>
                      {item.nameAr}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {item.badge} • الـ Streak: {item.streak} يوماً 🔥
                    </div>
                  </div>
                </div>

                {/* Score & Tier */}
                <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
                    {item.score.toLocaleString()} XP
                  </div>
                  <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '800' }}>
                    {item.tier} Tier
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pre-Submit Review Sheet Modal (US-34) */}
      {showReviewModal && (
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
            maxWidth: '520px',
            width: '100%',
            padding: '28px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {lang === 'ar' ? 'مراجعة إجابات الكويز قبل التسليم' : 'Review Answers'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {lang === 'ar' 
                ? `لقد أجبت على ${Object.keys(selectedAnswers).length} من أصل ${currentQuestionsList.length} أسئلة.`
                : `You answered ${Object.keys(selectedAnswers).length} of ${currentQuestionsList.length} questions.`}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '24px' }}>
              {currentQuestionsList.map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    borderRadius: '8px',
                    backgroundColor: selectedAnswers[idx] !== undefined ? 'var(--primary-surface)' : '#FEE2E2',
                    color: selectedAnswers[idx] !== undefined ? 'var(--primary)' : '#DC2626',
                    fontSize: '12px',
                    fontWeight: '800'
                  }}
                >
                  Q{idx + 1}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowReviewModal(false)}
                style={{ padding: '10px 18px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontWeight: '700', cursor: 'pointer' }}
              >
                {lang === 'ar' ? 'العودة للحل' : 'Back'}
              </button>
              <button
                onClick={handleSubmitQuiz}
                style={{ padding: '10px 24px', borderRadius: '12px', backgroundColor: '#10B981', border: 'none', color: '#FFFFFF', fontWeight: '900', cursor: 'pointer' }}
              >
                {lang === 'ar' ? 'تأكيد التسليم النهائي' : 'Confirm Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
