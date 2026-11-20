import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { studentApi } from '../../../services/studentApi';
import { useAuth } from '../../../context/AuthContext';

export function formatExamTimer(totalSecs) {
  const safe = Math.max(0, Math.floor(Number(totalSecs) || 0));
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function isQuestionAnswered(question, answerValue) {
  if (!question || answerValue === undefined || answerValue === null) return false;
  if (question.type === 'essay') {
    return String(answerValue).trim().length > 0;
  }
  return true;
}

function getExamDisplayStatus(e) {
  const subStatus = e.submissionStatus || 'not_started';
  if (subStatus === 'graded') return 'graded';
  if (subStatus === 'submitted') return 'submitted';
  if (subStatus === 'in_progress') {
    return e.status === 'active' ? 'in_progress' : 'closed';
  }
  if (e.status !== 'active') return 'closed';
  if (e.isUpcoming) return 'upcoming';
  return 'ready';
}

export const useExam = (lang = 'ar') => {
  const isAr = lang === 'ar';
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const userScope = currentUser?.id ? String(currentUser.id) : 'guest';

  const deepLinkHandledRef = useRef('');
  const startingRef = useRef(false);
  const loadingResultRef = useRef(false);
  const submittingRef = useRef(false);
  const searchParamsRef = useRef(searchParams);
  const expiresAtMsRef = useRef(0);
  const answersRef = useRef({});
  const questionsRef = useRef([]);
  const activeExamRef = useRef(null);
  const tabSwitchesRef = useRef(0);

  const [examsList, setExamsList] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [examsError, setExamsError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const [examState, setExamState] = useState('catalog'); // 'catalog' | 'taking' | 'results'
  const [activeExam, setActiveExam] = useState(null);
  const [pendingExam, setPendingExam] = useState(null);
  const [isStartingExam, setIsStartingExam] = useState(false);
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);
  const [loadingResultId, setLoadingResultId] = useState('');

  // Catalog filter & search state
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'ready' | 'in_progress' | 'completed' | 'closed'
  const [searchQuery, setSearchQuery] = useState('');

  // Active exam session state
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showReviewConfirm, setShowReviewConfirm] = useState(false);
  const [tabSwitchesCount, setTabSwitchesCount] = useState(0);

  // Server result state
  const [serverResult, setServerResult] = useState(null);

  useEffect(() => {
    answersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    activeExamRef.current = activeExam;
  }, [activeExam]);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  useEffect(() => {
    tabSwitchesRef.current = tabSwitchesCount;
  }, [tabSwitchesCount]);

  const draftStorageKey = useCallback(
    (examId) => (examId ? `mtfq_exam_draft_${userScope}_${examId}` : ''),
    [userScope]
  );

  // Persist draft answers & flags during active exam so accidental refresh preserves progress
  useEffect(() => {
    if (examState !== 'taking' || !activeExam?.id) return;
    try {
      localStorage.setItem(
        draftStorageKey(activeExam.id),
        JSON.stringify({ answers: selectedAnswers, flags: flaggedQuestions })
      );
    } catch {
      // ignore storage errors
    }
  }, [examState, activeExam?.id, selectedAnswers, flaggedQuestions, draftStorageKey]);

  const mapExams = useCallback(
    (raw) =>
      raw.map((e) => {
        const displayStatus = getExamDisplayStatus(e);
        return {
          id: e.id || e.uuid,
          titleAr: e.titleAr || '',
          titleEn: e.titleEn || e.titleAr || '',
          subjectAr: e.courseTitleAr || (isAr ? 'امتحان مقرر' : 'Course Exam'),
          teacherNameAr: e.teacherName || '',
          durationMinutes: Math.max(1, Number(e.durationMinutes || 30)),
          questionsCount: Number(e.questionsCount || 0),
          maxScore: Number(e.fullMark || 50),
          passScore: Number(e.passScore || 25),
          attemptsAllowed: 1,
          rawStatus: e.status,
          status: displayStatus, // 'ready' | 'in_progress' | 'submitted' | 'graded' | 'upcoming' | 'closed'
          submissionStatus: e.submissionStatus || 'not_started',
          showResults: e.showResults !== false,
          isBubbleSheet: Boolean(e.isBubbleSheet),
          remainingSeconds: e.remainingSeconds,
          score: e.score,
          percentage: e.percentage,
          isPassed: e.isPassed,
          isFullMark: e.isFullMark,
          date: e.dueDate || '',
          startsAt: e.startsAt || null,
          submittedAt: e.submittedAt || null,
        };
      }),
    [isAr]
  );

  const loadExams = useCallback(async () => {
    setLoadingExams(true);
    setExamsError(null);
    try {
      const res = await studentApi.exams.list();
      const raw = Array.isArray(res?.data) ? res.data : [];
      const mapped = mapExams(raw);
      setExamsList(mapped);
      return mapped;
    } catch (err) {
      setExamsError(
        err?.message ||
          (isAr ? 'تعذر تحميل قائمة الامتحانات.' : 'Failed to load exams.')
      );
      return [];
    } finally {
      setLoadingExams(false);
    }
  }, [isAr, mapExams]);

  // Open an existing submitted/graded exam result from backend
  const handleViewResult = useCallback(
    async (exam) => {
      if (!exam?.id || loadingResultRef.current) return;
      loadingResultRef.current = true;
      setLoadingResultId(exam.id);
      setActionError(null);
      try {
        const res = await studentApi.exams.getResult(exam.id);
        setActiveExam(exam);
        setServerResult(res?.data || null);
        setExamState('results');
      } catch (err) {
        setActionError(
          err?.message ||
            (isAr ? 'تعذر تحميل نتيجة الامتحان.' : 'Unable to load exam result.')
        );
      } finally {
        loadingResultRef.current = false;
        setLoadingResultId('');
      }
    },
    [isAr]
  );

  // Start or resume an active exam attempt
  const handleStartExam = useCallback(
    async (exam) => {
      if (!exam?.id || startingRef.current) return;
      startingRef.current = true;
      setIsStartingExam(true);
      setActionError(null);
      try {
        const res = await studentApi.exams.start(exam.id);
        const data = res?.data || {};
        const qs = (data.questions || []).map((q, i) => ({
          id: q.id || q.uuid,
          uuid: q.uuid || q.id,
          questionNumber: Number(q.questionNumber || i + 1),
          type: q.type || 'mcq',
          points: Number(q.points || 1),
          difficulty: q.difficulty || 'medium',
          questionAr: q.questionAr || '',
          questionEn: q.questionEn || q.questionAr || '',
          optionsAr: Array.isArray(q.optionsAr) ? q.optionsAr : [],
        }));

        // Restore saved draft answers if resuming the same exam attempt
        let restoredAnswers = {};
        let restoredFlags = {};
        try {
          const rawDraft = localStorage.getItem(draftStorageKey(exam.id));
          if (rawDraft) {
            const parsed = JSON.parse(rawDraft);
            if (parsed?.answers && typeof parsed.answers === 'object') {
              restoredAnswers = parsed.answers;
            }
            if (parsed?.flags && typeof parsed.flags === 'object') {
              restoredFlags = parsed.flags;
            }
          }
        } catch {
          // ignore
        }

        const remaining =
          data.remainingSeconds !== undefined && data.remainingSeconds !== null
            ? Math.max(0, Number(data.remainingSeconds))
            : exam.durationMinutes * 60;

        const expiresMs = data.expiresAt
          ? Date.parse(data.expiresAt)
          : Date.now() + remaining * 1000;

        expiresAtMsRef.current = Number.isFinite(expiresMs)
          ? expiresMs
          : Date.now() + remaining * 1000;

        const enrichedExam = {
          ...exam,
          showResults: data.showResults !== undefined ? Boolean(data.showResults) : exam.showResults,
          fullMark: Number(data.fullMark || exam.maxScore || 50),
          passScore: Number(data.passScore || exam.passScore || 25),
        };

        setPendingExam(null);
        setActiveExam(enrichedExam);
        setQuestions(qs);
        setSelectedAnswers(restoredAnswers);
        setFlaggedQuestions(restoredFlags);
        setTabSwitchesCount(0);
        setServerResult(null);
        setCurrentIdx(0);
        setTimeLeft(remaining);
        setExamState('taking');
      } catch (err) {
        const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
        setActionError(
          firstErr ||
            err?.message ||
            (isAr ? 'تعذر بدء الامتحان.' : 'Unable to start exam.')
        );
        // Refresh catalog in case an expired attempt was just auto-finalized
        await loadExams();
      } finally {
        startingRef.current = false;
        setIsStartingExam(false);
      }
    },
    [draftStorageKey, isAr, loadExams]
  );

  // Initial fetch + deep-link (?id=... or ?examId=...) resolution after async response
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const res = await studentApi.exams.list();
        if (!mounted) return;
        const raw = Array.isArray(res?.data) ? res.data : [];
        const mapped = mapExams(raw);
        setExamsList(mapped);
        setExamsError(null);

        const params = searchParamsRef.current;
        const deepLinkId = params.get('id') || params.get('examId') || '';
        if (deepLinkId && deepLinkHandledRef.current !== deepLinkId) {
          deepLinkHandledRef.current = deepLinkId;
          const target = mapped.find((ex) => ex.id === deepLinkId);
          if (target) {
            if (target.status === 'ready') {
              setPendingExam(target);
            } else if (target.status === 'in_progress') {
              handleStartExam(target);
            } else if (target.status === 'graded' || target.status === 'submitted') {
              handleViewResult(target);
            }
          }
          const next = new URLSearchParams(params);
          next.delete('id');
          next.delete('examId');
          setSearchParams(next, { replace: true });
        }
      } catch (err) {
        if (mounted) {
          setExamsError(
            err?.message ||
              (isAr ? 'تعذر تحميل قائمة الامتحانات.' : 'Failed to load exams.')
          );
        }
      } finally {
        if (mounted) setLoadingExams(false);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, [mapExams, isAr, handleStartExam, handleViewResult, setSearchParams]);

  // Anti-cheat tab switch telemetry + accidental close warning during active exam
  useEffect(() => {
    if (examState !== 'taking') return undefined;
    const onVisChange = () => {
      if (document.hidden) {
        setTabSwitchesCount((prev) => prev + 1);
      }
    };
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    document.addEventListener('visibilitychange', onVisChange);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      document.removeEventListener('visibilitychange', onVisChange);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [examState]);

  // Submit answers cleanly (supports MCQ, True/False, and Essay) with strict double-submit lock
  const handleSubmitExam = useCallback(
    async (isAutoSubmit = false) => {
      const currentExam = activeExamRef.current;
      if (!currentExam?.id || submittingRef.current) return;

      submittingRef.current = true;
      setIsSubmittingExam(true);
      setShowReviewConfirm(false);
      setActionError(null);

      try {
        const qs = questionsRef.current;
        const ansMap = answersRef.current;

        const answersPayload = qs.map((q) => {
          const val = ansMap[q.id];
          if (q.type === 'true_false') {
            return {
              questionUuid: q.uuid || q.id,
              selectedBool: typeof val === 'boolean' ? val : null,
            };
          }
          if (q.type === 'essay') {
            return {
              questionUuid: q.uuid || q.id,
              essayAnswerText: typeof val === 'string' && val.trim() ? val.trim() : null,
            };
          }
          return {
            questionUuid: q.uuid || q.id,
            selectedIndex: val !== undefined && val !== null ? Number(val) : null,
          };
        });

        const res = await studentApi.exams.submit(currentExam.id, {
          tabSwitchesCount: tabSwitchesRef.current,
          answers: answersPayload,
        });

        try {
          localStorage.removeItem(draftStorageKey(currentExam.id));
        } catch {
          // ignore
        }

        const resultData = res?.data || null;
        setServerResult(resultData);
        setExamState('results');
        await loadExams();

        if (!isAutoSubmit && resultData?.showResults !== false && !resultData?.isPendingManualGrading && resultData?.isPassed) {
          try {
            confetti({ particleCount: 95, spread: 70, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
        }
      } catch (err) {
        const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
        setActionError(
          firstErr ||
            err?.message ||
            (isAr
              ? 'تعذر تسليم الامتحان، يرجى المحاولة مرة أخرى فوراً.'
              : 'Failed to submit exam. Please retry.')
        );
      } finally {
        submittingRef.current = false;
        setIsSubmittingExam(false);
      }
    },
    [draftStorageKey, loadExams, isAr]
  );

  // Wall-clock accurate countdown interval (NEVER recreates on every tick, NEVER mutates inside updater)
  useEffect(() => {
    if (examState !== 'taking') return undefined;

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((expiresAtMsRef.current - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0 && !submittingRef.current) {
        handleSubmitExam(true);
      }
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [examState, handleSubmitExam]);

  const handleRequestStartExam = useCallback(
    (exam) => {
      setActionError(null);
      if (exam.status === 'ready') {
        setPendingExam(exam);
      } else if (exam.status === 'in_progress') {
        handleStartExam(exam);
      } else if (exam.status === 'graded' || exam.status === 'submitted') {
        handleViewResult(exam);
      }
    },
    [handleStartExam, handleViewResult]
  );

  const handleConfirmStart = useCallback(() => {
    if (!pendingExam) return;
    handleStartExam(pendingExam);
  }, [pendingExam, handleStartExam]);

  const currentQ = questions[currentIdx] || questions[0] || {
    id: '',
    type: 'mcq',
    points: 1,
    questionAr: '',
    optionsAr: [],
  };
  const currentQId = currentQ.id || '';

  const handleSelectAnswer = useCallback(
    (value) => {
      if (examState !== 'taking' || !currentQId) return;
      setSelectedAnswers((prev) => ({ ...prev, [currentQId]: value }));
    },
    [examState, currentQId]
  );

  const handleToggleFlag = useCallback(() => {
    if (!currentQId) return;
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQId]: !prev[currentQId],
    }));
  }, [currentQId]);

  const handleBackToCatalog = useCallback(() => {
    setActionError(null);
    setExamState('catalog');
  }, []);

  // Filter tab counts
  const tabCounts = useMemo(() => {
    let readyCount = 0;
    let inProgressCount = 0;
    let completedCount = 0;
    let closedCount = 0;

    examsList.forEach((e) => {
      if (e.status === 'ready') readyCount += 1;
      else if (e.status === 'in_progress') inProgressCount += 1;
      else if (e.status === 'graded' || e.status === 'submitted') completedCount += 1;
      else closedCount += 1;
    });

    return {
      totalCount: examsList.length,
      readyCount,
      inProgressCount,
      completedCount,
      closedCount,
    };
  }, [examsList]);

  const filteredExams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return examsList.filter((e) => {
      if (statusFilter === 'ready' && e.status !== 'ready') return false;
      if (statusFilter === 'in_progress' && e.status !== 'in_progress') return false;
      if (statusFilter === 'completed' && e.status !== 'graded' && e.status !== 'submitted') return false;
      if (statusFilter === 'closed' && e.status !== 'closed' && e.status !== 'upcoming') return false;
      if (!q) return true;
      const hay = `${e.titleAr} ${e.titleEn} ${e.subjectAr} ${e.teacherNameAr}`.toLowerCase();
      return hay.includes(q);
    });
  }, [examsList, statusFilter, searchQuery]);

  const answeredCount = useMemo(
    () => questions.filter((q) => isQuestionAnswered(q, selectedAnswers[q.id])).length,
    [questions, selectedAnswers]
  );

  const flaggedCount = useMemo(
    () => questions.filter((q) => Boolean(flaggedQuestions[q.id])).length,
    [questions, flaggedQuestions]
  );

  return {
    examsList,
    filteredExams,
    loadingExams,
    examsError,
    actionError,
    setActionError,
    refreshExams: loadExams,
    tabCounts,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    examState,
    setExamState,
    activeExam,
    pendingExam,
    setPendingExam,
    isStartingExam,
    isSubmittingExam,
    loadingResultId,
    questions,
    currentIdx,
    setCurrentIdx,
    currentQ,
    selectedAnswers,
    flaggedQuestions,
    answeredCount,
    flaggedCount,
    timeLeft,
    tabSwitchesCount,
    showReviewConfirm,
    setShowReviewConfirm,
    formatTime: formatExamTimer,
    handleRequestStartExam,
    handleConfirmStart,
    handleStartExam,
    handleViewResult,
    handleSelectAnswer,
    handleToggleFlag,
    handleSubmitExam,
    handleBackToCatalog,
    serverResult,
  };
};
