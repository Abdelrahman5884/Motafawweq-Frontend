import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MOCK_LESSON } from '../../../data/mockData';

const AI_GENERATED_QUESTIONS = [
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

export const useQuiz = () => {
  const [activeMode, setActiveMode] = useState('quiz');
  const [quizSource, setQuizSource] = useState('teacher');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const baseQuestions = MOCK_LESSON.quizzes || [];
  const currentQuestionsList = quizSource === 'teacher' ? baseQuestions : AI_GENERATED_QUESTIONS;

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
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  const handleResetQuiz = () => {
    setIsSubmitted(false);
    setSelectedAnswers({});
    setCurrentIdx(0);
    setTimeLeft(600);
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
  const isPerfectScore = scorePercent === 100;
  const mcqPoints = correctCount * 1;
  const fullMarkBonus = isPerfectScore ? 3 : 0;
  const streakBonus = 1;
  const totalPointsEarned = mcqPoints + fullMarkBonus + streakBonus;

  const currentQ = currentQuestionsList[currentIdx] || currentQuestionsList[0];

  return {
    activeMode,
    setActiveMode,
    quizSource,
    currentIdx,
    setCurrentIdx,
    selectedAnswers,
    flaggedQuestions,
    timeLeft,
    isSubmitted,
    showReviewModal,
    setShowReviewModal,
    isGeneratingAI,
    currentQuestionsList,
    currentQ,
    formatTime,
    handleSelectOption,
    handleToggleFlag,
    handleSubmitQuiz,
    handleResetQuiz,
    handleGenerateAIQuiz,
    scorePercent,
    correctCount,
    mcqPoints,
    fullMarkBonus,
    streakBonus,
    totalPointsEarned
  };
};
