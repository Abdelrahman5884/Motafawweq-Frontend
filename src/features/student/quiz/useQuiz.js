import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MOCK_LESSON } from '../../../data/mockData';

const AI_GENERATED_QUESTIONS = [];

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
