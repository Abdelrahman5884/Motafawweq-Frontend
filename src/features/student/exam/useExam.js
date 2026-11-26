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
  const searchSeqRef = useRef(0);
  const hasLoadedDefaultRef = useRef(false);
  const defaultTeacherExamsRef = useRef([]);
  const defaultMinistryExamsRef = useRef([]);
  const searchQueryRef = useRef('');
  const expiresAtMsRef = useRef(0);
  const answersRef = useRef({});
  const questionsRef = useRef([]);
  const activeExamRef = useRef(null);
  const tabSwitchesRef = useRef(0);

  const [teacherExams, setTeacherExams] = useState([]);
  const [ministryExams, setMinistryExams] = useState([]);
  const [studentGradeAr, setStudentGradeAr] = useState('');

  const [loadingExams, setLoadingExams] = useState(true);
  const [searching, setSearching] = useState(false);
  const [examsError, setExamsError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const [examState, setExamState] = useState('catalog'); // 'catalog' | 'taking' | 'results'
  const [activeExam, setActiveExam] = useState(null);
  const [pendingExam, setPendingExam] = useState(null);
  const [pendingRetake, setPendingRetake] = useState(false);
  const [isStartingExam, setIsStartingExam] = useState(false);
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);
  const [loadingResultId, setLoadingResultId] = useState('');

  // Catalog filter & search state
  const [sourceFilter, setSourceFilter] = useState(() => {
    const raw = searchParams.get('source');
    return raw === 'ministry' || raw === 'teachers' ? raw : 'all';
  });
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

  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

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
    (raw, { isMinistry = false } = {}) =>
      raw.map((e) => {
        const displayStatus = getExamDisplayStatus(e);
        const ministryFlag = Boolean(isMinistry || e.isMinistry);
        return {
          id: e.id || e.uuid || e.code,
          code: e.code || e.id || e.uuid,
          isMinistry: ministryFlag,
          sourceAr: e.sourceAr || (ministryFlag ? 'وزارة التربية والتعليم والتعليم الفني' : ''),
          sourceEn: e.sourceEn || (ministryFlag ? 'Egyptian Ministry of Education' : ''),
          gradeAr: e.gradeAr || '',
          curriculumCode: e.curriculumCode || null,
          titleAr: e.titleAr || '',
          titleEn: e.titleEn || e.titleAr || '',
          subjectAr: e.subjectAr || e.courseTitleAr || (isAr ? 'امتحان مقرر' : 'Course Exam'),
          subjectEn: e.subjectEn || e.subjectAr || e.courseTitleAr || 'Exam',
          teacherNameAr: e.teacherName || '',
          durationMinutes: Math.max(1, Number(e.durationMinutes || 30)),
          questionsCount: Number(e.questionsCount || 0),
          maxScore: Number(e.fullMark || 50),
          passScore: Number(e.passScore || 25),
          attemptsAllowed: ministryFlag ? null : 1,
          attemptsCount: Number(e.attemptsCount || 0),
          bestPercentage: e.bestPercentage ?? null,
          canRetake: Boolean(e.canRetake || ministryFlag),
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

  const loadExams = useCallback(
    async ({ search = '', silent = false } = {}) => {
      const trimmedSearch = typeof search === 'string' ? search.trim() : '';
      const seq = ++searchSeqRef.current;

      if (!silent) {
        setLoadingExams(true);
      } else if (trimmedSearch) {
        setSearching(true);
      }
      setExamsError(null);

      try {
        const [teacherRes, ministryRes] = await Promise.allSettled([
          studentApi.exams.list(trimmedSearch),
          studentApi.ministry.listExams(trimmedSearch ? { search: trimmedSearch } : {}),
        ]);

        if (seq !== searchSeqRef.current) {
          return [];
        }

        const mappedTeacher =
          teacherRes.status === 'fulfilled' && Array.isArray(teacherRes.value?.data)
            ? mapExams(teacherRes.value.data, { isMinistry: false })
            : [];

        const ministryPayload =
          ministryRes.status === 'fulfilled' ? ministryRes.value?.data || {} : {};
        const mappedMinistry = Array.isArray(ministryPayload.items)
          ? mapExams(ministryPayload.items, { isMinistry: true })
          : [];

        if (!trimmedSearch) {
          defaultTeacherExamsRef.current = mappedTeacher;
          defaultMinistryExamsRef.current = mappedMinistry;
          hasLoadedDefaultRef.current = true;
        }

        setTeacherExams(mappedTeacher);
        setMinistryExams(mappedMinistry);

        if (ministryPayload.studentGradeAr) {
          setStudentGradeAr(ministryPayload.studentGradeAr);
        }

        if (teacherRes.status === 'rejected' && ministryRes.status === 'rejected') {
          setExamsError(
            teacherRes.reason?.message ||
              ministryRes.reason?.message ||
              (isAr ? 'تعذر تحميل قائمة الامتحانات.' : 'Failed to load exams.')
          );
        }

        return [...mappedTeacher, ...mappedMinistry];
      } finally {
        if (seq === searchSeqRef.current) {
          setLoadingExams(false);
          setSearching(false);
        }
      }
    },
    [isAr, mapExams]
  );

  // Open an existing submitted/graded exam result from backend
  const handleViewResult = useCallback(
    async (exam) => {
      if (!exam?.id || loadingResultRef.current) return;
      loadingResultRef.current = true;
      setLoadingResultId(exam.id);
      setActionError(null);
      try {
        const res = exam.isMinistry
          ? await studentApi.ministry.getExamResult(exam.code || exam.id)
          : await studentApi.exams.getResult(exam.id);
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

  // Start or resume an active exam attempt (teacher OR official Ministry guided exam)
  const handleStartExam = useCallback(
    async (exam, { retake = false } = {}) => {
      if (!exam?.id || startingRef.current) return;
      startingRef.current = true;
      setIsStartingExam(true);
      setActionError(null);
      try {
        const res = exam.isMinistry
          ? await studentApi.ministry.startExam(exam.code || exam.id, { retake })
          : await studentApi.exams.start(exam.id);
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

        // Clear stale draft when explicitly retaking a Ministry exam
        if (retake) {
          try {
            localStorage.removeItem(draftStorageKey(exam.id));
          } catch {
            // ignore
          }
        }

        // Restore saved draft answers if resuming the same exam attempt
        let restoredAnswers = {};
        let restoredFlags = {};
        if (!retake) {
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
        setPendingRetake(false);
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
        await loadExams();
      } finally {
        startingRef.current = false;
        setIsStartingExam(false);
      }
    },
    [draftStorageKey, isAr, loadExams]
  );

  // Initial grade-scoped fetch + deep-link (?id=... / ?examId=... / ?examCode=... / ?source=ministry)
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const combined = await loadExams();
      if (!mounted) return;

      const params = searchParamsRef.current;
      const sourceParam = params.get('source');
      if (sourceParam === 'ministry' || sourceParam === 'teachers') {
        setSourceFilter(sourceParam);
      }

      const deepLinkId = params.get('examCode') || params.get('id') || params.get('examId') || '';
      if (deepLinkId && deepLinkHandledRef.current !== deepLinkId) {
        deepLinkHandledRef.current = deepLinkId;
        let target = combined.find((ex) => ex.id === deepLinkId || ex.code === deepLinkId);

        // Support deep-linking to a cross-grade Ministry exam (e.g. discovered via search on Courses page)
        if (!target && deepLinkId.startsWith('moe-')) {
          try {
            const lookupRes = await studentApi.ministry.listExams({ search: deepLinkId });
            if (!mounted) return;
            const lookupItems = Array.isArray(lookupRes?.data?.items)
              ? mapExams(lookupRes.data.items, { isMinistry: true })
              : [];
            target = lookupItems.find((ex) => ex.id === deepLinkId || ex.code === deepLinkId) || null;
          } catch {
            // ignore lookup error
          }
        }

        if (target) {
          if (target.isMinistry) {
            setSourceFilter('ministry');
          }
          if (target.status === 'ready') {
            setPendingRetake(false);
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
        next.delete('examCode');
        setSearchParams(next, { replace: true });
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, [loadExams, mapExams, handleStartExam, handleViewResult, setSearchParams]);

  // Debounced cross-grade backend search (restores cached student-grade exams instantly when cleared)
  useEffect(() => {
    if (!hasLoadedDefaultRef.current) return undefined;

    const trimmed = searchQuery.trim();
    if (!trimmed) {
      searchSeqRef.current += 1;
      setTeacherExams(defaultTeacherExamsRef.current);
      setMinistryExams(defaultMinistryExamsRef.current);
      setSearching(false);
      return undefined;
    }

    setSearching(true);
    const timer = window.setTimeout(() => {
      loadExams({ search: trimmed, silent: true });
    }, 260);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchQuery, loadExams]);

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

  // Submit answers cleanly (supports Teacher & Official Ministry exams)
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

        const submissionPayload = {
          tabSwitchesCount: tabSwitchesRef.current,
          answers: answersPayload,
        };

        const res = currentExam.isMinistry
          ? await studentApi.ministry.submitExam(currentExam.code || currentExam.id, submissionPayload)
          : await studentApi.exams.submit(currentExam.id, submissionPayload);

        try {
          localStorage.removeItem(draftStorageKey(currentExam.id));
        } catch {
          // ignore
        }

        const resultData = res?.data || null;
        setServerResult(resultData);
        setExamState('results');
        // Refresh default grade-scoped cache and active search view if searching
        const activeSearch = searchQueryRef.current.trim();
        await loadExams({ search: '', silent: Boolean(activeSearch) });
        if (activeSearch) {
          await loadExams({ search: activeSearch, silent: true });
        }

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

  // Wall-clock accurate countdown interval
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
        setPendingRetake(false);
        setPendingExam(exam);
      } else if (exam.status === 'in_progress') {
        handleStartExam(exam);
      } else if (exam.status === 'graded' || exam.status === 'submitted') {
        handleViewResult(exam);
      }
    },
    [handleStartExam, handleViewResult]
  );

  const handleRetakeMinistryExam = useCallback((exam) => {
    if (!exam?.isMinistry) return;
    setActionError(null);
    setPendingRetake(true);
    setPendingExam(exam);
  }, []);

  const handleConfirmStart = useCallback(() => {
    if (!pendingExam) return;
    handleStartExam(pendingExam, { retake: pendingRetake });
  }, [pendingExam, pendingRetake, handleStartExam]);

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

  // Combined exams list scoped by sourceFilter
  const examsList = useMemo(
    () => [...teacherExams, ...ministryExams],
    [teacherExams, ministryExams]
  );

  const sourceScopedExams = useMemo(() => {
    if (sourceFilter === 'ministry') return ministryExams;
    if (sourceFilter === 'teachers') return teacherExams;
    return examsList;
  }, [sourceFilter, teacherExams, ministryExams, examsList]);

  const sourceCounts = useMemo(
    () => ({
      all: examsList.length,
      ministry: ministryExams.length,
      teachers: teacherExams.length,
    }),
    [examsList.length, ministryExams.length, teacherExams.length]
  );

  // Status tab counts (within current source scope)
  const tabCounts = useMemo(() => {
    let readyCount = 0;
    let inProgressCount = 0;
    let completedCount = 0;
    let closedCount = 0;

    sourceScopedExams.forEach((e) => {
      if (e.status === 'ready') readyCount += 1;
      else if (e.status === 'in_progress') inProgressCount += 1;
      else if (e.status === 'graded' || e.status === 'submitted') completedCount += 1;
      else closedCount += 1;
    });

    return {
      totalCount: sourceScopedExams.length,
      readyCount,
      inProgressCount,
      completedCount,
      closedCount,
    };
  }, [sourceScopedExams]);

  const filteredExams = useMemo(() => {
    return sourceScopedExams.filter((e) => {
      if (statusFilter === 'ready' && e.status !== 'ready') return false;
      if (statusFilter === 'in_progress' && e.status !== 'in_progress') return false;
      if (statusFilter === 'completed' && e.status !== 'graded' && e.status !== 'submitted') return false;
      if (statusFilter === 'closed' && e.status !== 'closed' && e.status !== 'upcoming') return false;
      return true;
    });
  }, [sourceScopedExams, statusFilter]);

  const isSearchingAllGrades = searchQuery.trim().length > 0;

  const refreshExams = useCallback(() => {
    const activeSearch = searchQueryRef.current.trim();
    return loadExams({ search: activeSearch });
  }, [loadExams]);

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
    searching,
    isSearchingAllGrades,
    examsError,
    actionError,
    setActionError,
    refreshExams,
    sourceFilter,
    setSourceFilter,
    sourceCounts,
    studentGradeAr,
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
    pendingRetake,
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
    handleRetakeMinistryExam,
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
