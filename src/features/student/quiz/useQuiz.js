import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { studentApi } from '../../../services/studentApi';

export const useQuiz = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const requestedConvertedId = searchParams.get('convertedLecture') || '';
  const initialLectureFromState = location.state?.convertedLecture || null;

  const [convertedLectures, setConvertedLectures] = useState([]);
  const [activeLecture, setActiveLecture] = useState(initialLectureFromState);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [quizError, setQuizError] = useState('');

  const [activeMode, setActiveMode] = useState('quiz');
  const [quizSource, setQuizSource] = useState('ai');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const pollTimerRef = useRef(null);

  const clearPollTimer = useCallback(() => {
    if (pollTimerRef.current) {
      window.clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const resetAttemptState = useCallback((questionsLen = 0) => {
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setCurrentIdx(0);
    setIsSubmitted(false);
    setTimeLeft(Math.max(180, questionsLen * 75));
  }, []);

  const loadConvertedLecture = useCallback(
    async (uuid) => {
      if (!uuid) return null;
      setLoadingQuiz(true);
      setQuizError('');
      try {
        const res = await studentApi.convertedLectures.get(uuid);
        const lecture = res?.data || null;
        setActiveLecture(lecture);
        const qs = Array.isArray(lecture?.quizQuestions) ? lecture.quizQuestions : [];
        resetAttemptState(qs.length);
        setQuizSource('ai');
        return lecture;
      } catch (err) {
        setQuizError(err?.message || 'تعذر تحميل كويز المحاضرة.');
        return null;
      } finally {
        setLoadingQuiz(false);
      }
    },
    [resetAttemptState]
  );

  // Load archive + requested lecture on mount
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoadingQuiz(true);
      setQuizError('');
      try {
        const listRes = await studentApi.convertedLectures.list().catch(() => ({ data: [] }));
        if (!mounted) return;
        const list = Array.isArray(listRes?.data) ? listRes.data : [];
        setConvertedLectures(list);

        if (initialLectureFromState?.quizQuestions?.length > 0 && (!requestedConvertedId || initialLectureFromState.id === requestedConvertedId)) {
          setActiveLecture(initialLectureFromState);
          resetAttemptState(initialLectureFromState.quizQuestions.length);
          setLoadingQuiz(false);
          return;
        }

        const targetId =
          requestedConvertedId ||
          list.find((l) => Number(l.questionsCount || 0) > 0)?.id ||
          list[0]?.id ||
          '';

        if (targetId) {
          const detailRes = await studentApi.convertedLectures.get(targetId);
          if (!mounted) return;
          const lecture = detailRes?.data || null;
          setActiveLecture(lecture);
          const qs = Array.isArray(lecture?.quizQuestions) ? lecture.quizQuestions : [];
          resetAttemptState(qs.length);
        } else {
          setActiveLecture(null);
        }
      } catch (err) {
        if (mounted) {
          setQuizError(err?.message || 'تعذر تحميل الكويزات الذكية.');
        }
      } finally {
        if (mounted) setLoadingQuiz(false);
      }
    };

    init();
    return () => {
      mounted = false;
      clearPollTimer();
    };
  }, [requestedConvertedId, initialLectureFromState, resetAttemptState, clearPollTimer]);

  const currentQuestionsList = Array.isArray(activeLecture?.quizQuestions)
    ? activeLecture.quizQuestions
    : [];

  useEffect(() => {
    let timer;
    if (!isSubmitted && timeLeft > 0 && activeMode === 'quiz' && currentQuestionsList.length > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft, activeMode, currentQuestionsList.length]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions((prev) => ({ ...prev, [currentIdx]: !prev[currentIdx] }));
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    setShowReviewModal(false);
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const handleResetQuiz = () => {
    resetAttemptState(currentQuestionsList.length);
  };

  const handleGenerateAIQuiz = async (targetLectureId = null) => {
    const id = targetLectureId || activeLecture?.id;
    if (!id || isGeneratingAI) return;

    clearPollTimer();
    setIsGeneratingAI(true);
    setQuizError('');

    try {
      await studentApi.convertedLectures.generateQuiz(id, { quizCount: 5 });

      for (let attempt = 0; attempt < 90; attempt += 1) {
        await new Promise((resolve) => {
          pollTimerRef.current = window.setTimeout(resolve, 2000);
        });
        const statusRes = await studentApi.convertedLectures.status(id);
        const data = statusRes?.data;
        if (data) {
          setActiveLecture(data);
          if (data.overallStatus === 'completed') {
            const qs = Array.isArray(data.quizQuestions) ? data.quizQuestions : [];
            resetAttemptState(qs.length);
            setQuizSource('ai');
            setActiveMode('quiz');
            break;
          }
          if (data.overallStatus === 'failed') {
            setQuizError(data.error || 'تعذر توليد الكويز بالذكاء الاصطناعي.');
            break;
          }
        }
      }
    } catch (err) {
      setQuizError(err?.message || 'تعذر توليد الكويز بالذكاء الاصطناعي.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Score calculation
  let correctCount = 0;
  currentQuestionsList.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctIndex) {
      correctCount++;
    }
  });
  const scorePercent =
    currentQuestionsList.length > 0
      ? Math.round((correctCount / currentQuestionsList.length) * 100)
      : 0;
  const isPerfectScore = scorePercent === 100;
  const mcqPoints = correctCount * 1;
  const fullMarkBonus = isPerfectScore ? 3 : 0;
  const streakBonus = currentQuestionsList.length > 0 ? 1 : 0;
  const totalPointsEarned = mcqPoints + fullMarkBonus + streakBonus;

  const currentQ = currentQuestionsList[currentIdx] || currentQuestionsList[0];

  return {
    convertedLectures,
    activeLecture,
    loadingQuiz,
    quizError,
    loadConvertedLecture,
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
    totalPointsEarned,
  };
};
