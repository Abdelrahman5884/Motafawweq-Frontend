import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { studentApi } from '../../../services/studentApi';

export const useQuiz = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const requestedConvertedId = searchParams.get('convertedLecture') || '';
  const requestedLessonId = searchParams.get('lesson') || '';
  const autostartLesson = searchParams.get('autostart') === '1';

  const initialLectureFromState = location.state?.convertedLecture || null;
  const initialCustomQuizFromState = location.state?.customQuiz || null;

  const [sourceMode, setSourceMode] = useState(() => {
    if (initialCustomQuizFromState?.questions?.length > 0) return 'custom';
    if (requestedLessonId) return 'lesson';
    return 'converted';
  });

  const [convertedLectures, setConvertedLectures] = useState([]);
  const [accessibleLessons, setAccessibleLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState(requestedLessonId || '');
  const [activeLecture, setActiveLecture] = useState(initialLectureFromState);
  const [customQuiz, setCustomQuiz] = useState(initialCustomQuizFromState);
  const [quizCount, setQuizCount] = useState(5);

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
  const [generationProgress, setGenerationProgress] = useState(0);

  const pollTimerRef = useRef(null);
  const autostartDoneRef = useRef(false);

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
      setSourceMode('converted');
      setCustomQuiz(null);
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

  const handleGenerateLessonAIQuiz = useCallback(
    async (targetLessonUuid = null, countOverride = null) => {
      const lid = targetLessonUuid || selectedLessonId;
      if (!lid || isGeneratingAI) return;

      clearPollTimer();
      setSourceMode('lesson');
      setSelectedLessonId(lid);
      setIsGeneratingAI(true);
      setGenerationProgress(10);
      setQuizError('');

      try {
        const startRes = await studentApi.ai.generateLessonQuiz(lid, {
          quizCount: countOverride || quizCount,
        });
        const jobId = startRes?.data?.job?.id;
        if (!jobId) {
          throw new Error('تعذر بدء توليد الكويز بالذكاء الاصطناعي.');
        }

        for (let attempt = 0; attempt < 90; attempt += 1) {
          await new Promise((resolve) => {
            pollTimerRef.current = window.setTimeout(resolve, 2000);
          });
          const statusRes = await studentApi.ai.getJobStatus(jobId);
          const payload = statusRes?.data;
          const job = payload?.job;
          if (job) {
            setGenerationProgress(Number(job.progress || 25));
            if (job.status === 'completed') {
              const qs = Array.isArray(payload.quizQuestions) ? payload.quizQuestions : [];
              setCustomQuiz({
                titleAr: payload.lessonTitleAr || 'كويز الحصة الذكي',
                subjectAr: payload.subjectAr || '',
                sourceLabelAr: 'كويز ذكي من الحصة (AI)',
                questions: qs,
              });
              resetAttemptState(qs.length);
              setQuizSource('ai');
              setActiveMode('quiz');
              break;
            }
            if (job.status === 'failed') {
              setQuizError(job.errorMessage || 'تعذر توليد الكويز بالذكاء الاصطناعي.');
              break;
            }
          }
        }
      } catch (err) {
        setQuizError(err?.message || 'تعذر توليد الكويز بالذكاء الاصطناعي.');
      } finally {
        setIsGeneratingAI(false);
        setGenerationProgress(0);
      }
    },
    [selectedLessonId, isGeneratingAI, clearPollTimer, quizCount, resetAttemptState]
  );

  // Hydrate converted lectures + accessible course lessons on mount
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoadingQuiz(true);
      setQuizError('');
      try {
        const [convRes, lessonsRes] = await Promise.all([
          studentApi.convertedLectures.list().catch(() => ({ data: [] })),
          studentApi.ai.listLessons().catch(() => ({ data: [] })),
        ]);
        if (!mounted) return;

        const convList = Array.isArray(convRes?.data) ? convRes.data : [];
        const lessonsList = Array.isArray(lessonsRes?.data) ? lessonsRes.data : [];
        setConvertedLectures(convList);
        setAccessibleLessons(lessonsList);

        // 1. Custom remediation quiz passed via router state (from Weak Areas / Revision)
        if (initialCustomQuizFromState?.questions?.length > 0) {
          setSourceMode('custom');
          setCustomQuiz(initialCustomQuizFromState);
          resetAttemptState(initialCustomQuizFromState.questions.length);
          setLoadingQuiz(false);
          return;
        }

        // 2. Direct lesson link (?lesson=<uuid>)
        if (requestedLessonId) {
          setSourceMode('lesson');
          setSelectedLessonId(requestedLessonId);
          setLoadingQuiz(false);
          return;
        }

        // 3. Passed convertedLecture state
        if (
          initialLectureFromState?.quizQuestions?.length > 0 &&
          (!requestedConvertedId || initialLectureFromState.id === requestedConvertedId)
        ) {
          setSourceMode('converted');
          setActiveLecture(initialLectureFromState);
          resetAttemptState(initialLectureFromState.quizQuestions.length);
          setLoadingQuiz(false);
          return;
        }

        // 4. Pick requested or first converted lecture with questions
        const targetConvId =
          requestedConvertedId ||
          convList.find((l) => Number(l.questionsCount || 0) > 0)?.id ||
          convList[0]?.id ||
          '';

        if (targetConvId) {
          const detailRes = await studentApi.convertedLectures.get(targetConvId);
          if (!mounted) return;
          const lecture = detailRes?.data || null;
          setSourceMode('converted');
          setActiveLecture(lecture);
          const qs = Array.isArray(lecture?.quizQuestions) ? lecture.quizQuestions : [];
          resetAttemptState(qs.length);
        } else if (lessonsList.length > 0) {
          // If no converted lectures yet, cleanly default to "From My Lessons" tab!
          const firstWithTranscript = lessonsList.find((l) => l.hasTranscript) || lessonsList[0];
          setSourceMode('lesson');
          setSelectedLessonId(firstWithTranscript.id);
          setActiveLecture(null);
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
  }, [
    requestedConvertedId,
    requestedLessonId,
    initialLectureFromState,
    initialCustomQuizFromState,
    resetAttemptState,
    clearPollTimer,
  ]);

  // Auto-start AI quiz generation when navigated from LessonQuestionsTab with ?lesson=...&autostart=1
  useEffect(() => {
    if (
      !loadingQuiz &&
      autostartLesson &&
      requestedLessonId &&
      !autostartDoneRef.current &&
      !isGeneratingAI
    ) {
      autostartDoneRef.current = true;
      handleGenerateLessonAIQuiz(requestedLessonId, quizCount);
    }
  }, [loadingQuiz, autostartLesson, requestedLessonId, isGeneratingAI, handleGenerateLessonAIQuiz, quizCount]);

  const currentQuestionsList =
    sourceMode === 'converted'
      ? (Array.isArray(activeLecture?.quizQuestions) ? activeLecture.quizQuestions : [])
      : (Array.isArray(customQuiz?.questions) ? customQuiz.questions : []);

  const activeTitleAr =
    sourceMode === 'converted'
      ? (activeLecture?.titleAr || 'كويز المحاضرة الذكي')
      : (customQuiz?.titleAr ||
          accessibleLessons.find((l) => l.id === selectedLessonId)?.titleAr ||
          'كويز تدريبي ذكي');

  useEffect(() => {
    let timer;
    if (!isSubmitted && timeLeft > 0 && activeMode === 'quiz' && currentQuestionsList.length > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => window.clearInterval(timer);
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
    setGenerationProgress(12);
    setQuizError('');

    try {
      await studentApi.convertedLectures.generateQuiz(id, { quizCount });

      for (let attempt = 0; attempt < 90; attempt += 1) {
        await new Promise((resolve) => {
          pollTimerRef.current = window.setTimeout(resolve, 2000);
        });
        const statusRes = await studentApi.convertedLectures.status(id);
        const data = statusRes?.data;
        if (data) {
          setActiveLecture(data);
          setGenerationProgress(Number(data.overallProgress || 45));
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
      setGenerationProgress(0);
    }
  };

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
    sourceMode,
    setSourceMode,
    convertedLectures,
    accessibleLessons,
    selectedLessonId,
    setSelectedLessonId,
    activeLecture,
    customQuiz,
    activeTitleAr,
    quizCount,
    setQuizCount,
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
    generationProgress,
    currentQuestionsList,
    currentQ,
    formatTime,
    handleSelectOption,
    handleToggleFlag,
    handleSubmitQuiz,
    handleResetQuiz,
    handleGenerateAIQuiz,
    handleGenerateLessonAIQuiz,
    scorePercent,
    correctCount,
    mcqPoints,
    fullMarkBonus,
    streakBonus,
    totalPointsEarned,
  };
};
