import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MOCK_LESSON } from '../../../data/mockData';
import { UPCOMING_EXAMS, LEAGUE_LEADERBOARD, AI_LECTURE_QUESTIONS_BANK, STUDENT_PROFILE } from '../../../data/studentData';

export const useExam = (lang) => {
  const [examState, setExamState] = useState('catalog');
  const [examSource, setExamSource] = useState('teacher');
  const [activeExam, setActiveExam] = useState(UPCOMING_EXAMS[0]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [pendingExam, setPendingExam] = useState(null);

  const questions = examSource === 'ai' 
    ? AI_LECTURE_QUESTIONS_BANK 
    : (MOCK_LESSON.quizzes || []);

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

  const handleRequestStartExam = (exam) => {
    if (exam.status === 'upcoming') return;
    if (attemptsUsed >= exam.attemptsAllowed) {
      alert(lang === 'ar' ? 'عفواً، لقد استنفدت عدد المحاولات المسموح بها لهذا الامتحان.' : 'No attempts remaining.');
      return;
    }
    setPendingExam(exam);
  };

  const handleConfirmStart = () => {
    if (!pendingExam) return;
    const examToStart = pendingExam;
    setPendingExam(null);
    handleStartExam(examToStart);
  };

  const handleStartExam = (exam) => {
    setExamSource('teacher');
    setActiveExam(exam);
    setTimeLeft(exam.durationMinutes * 60);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setCurrentIdx(0);
    setExamState('taking');
  };

  const handleStartAIQuiz = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      setIsGeneratingAI(false);
      setExamSource('ai');
      setActiveExam({
        id: 'exam-ai-lecture',
        titleAr: 'كويز الذكاء الاصطناعي — تفريغ محاضرة الأحياء وكالفن',
        subjectAr: 'الأحياء',
        durationMinutes: 10,
        questionsCount: AI_LECTURE_QUESTIONS_BANK.length,
        attemptsAllowed: 99,
        status: 'ready',
        typeAr: 'توليد بالذكاء الاصطناعي',
        difficultyAr: 'مستويات تفكير عليا'
      });
      setTimeLeft(10 * 60);
      setSelectedAnswers({});
      setFlaggedQuestions({});
      setCurrentIdx(0);
      setExamState('taking');
    }, 800);
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
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleRetakeExam = () => {
    if (examSource === 'ai') {
      handleStartAIQuiz();
      return;
    }
    if (attemptsUsed >= activeExam.attemptsAllowed) {
      alert(lang === 'ar' ? 'عفواً، لقد استنفدت عدد المحاولات المسموح بها لهذا الامتحان.' : 'No attempts remaining.');
      return;
    }
    handleStartExam(activeExam);
  };

  // Calculate score & League points
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctIndex) {
      correctCount++;
    }
  });
  const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const isPerfectScore = scorePercent === 100;

  const basePoints = correctCount * 1;
  const perfectBonusPoints = isPerfectScore ? 3 : 0;
  const streakBonusPoints = 1;
  const totalEarnedPoints = basePoints + perfectBonusPoints + streakBonusPoints;
  const studentTotalScore = (STUDENT_PROFILE.xp || 3450) + totalEarnedPoints;
  const top1Score = LEAGUE_LEADERBOARD[0]?.score || 3920;
  const gapToLead = Math.max(0, top1Score - studentTotalScore);
  const currentQ = questions[currentIdx] || questions[0];

  return {
    examState,
    setExamState,
    examSource,
    activeExam,
    isGeneratingAI,
    pendingExam,
    setPendingExam,
    questions,
    currentIdx,
    setCurrentIdx,
    selectedAnswers,
    flaggedQuestions,
    timeLeft,
    attemptsUsed,
    showReviewConfirm,
    setShowReviewConfirm,
    formatTime,
    handleRequestStartExam,
    handleConfirmStart,
    handleStartExam,
    handleStartAIQuiz,
    handleSelectOption,
    handleToggleFlag,
    handleSubmitExam,
    handleRetakeExam,
    scorePercent,
    correctCount,
    basePoints,
    perfectBonusPoints,
    streakBonusPoints,
    totalEarnedPoints,
    studentTotalScore,
    gapToLead,
    currentQ
  };
};
