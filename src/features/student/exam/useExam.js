import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { studentApi } from '../../../services/studentApi';

export const useExam = (lang) => {
  const deepLinkHandledRef = useRef(false);
  const [examsList, setExamsList] = useState([]);
  const [examState, setExamState] = useState('catalog');
  const [examSource, setExamSource] = useState('teacher');
  const [activeExam, setActiveExam] = useState({
    id: '',
    titleAr: '',
    subjectAr: '',
    durationMinutes: 30,
    questionsCount: 0,
    attemptsAllowed: 1,
    status: 'ready'
  });
  const [questions, setQuestions] = useState([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [pendingExam, setPendingExam] = useState(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [showReviewConfirm, setShowReviewConfirm] = useState(false);
  const [tabSwitchesCount, setTabSwitchesCount] = useState(0);
  const [serverResult, setServerResult] = useState(null);

  const loadExams = useCallback(async () => {
    try {
      const res = await studentApi.exams.list();
      const raw = Array.isArray(res?.data) ? res.data : [];
      const mapped = raw.map((e) => ({
        id: e.id || e.uuid,
        titleAr: e.titleAr,
        subjectAr: e.courseTitleAr || 'امتحان',
        teacherNameAr: e.teacherName || '',
        durationMinutes: Number(e.durationMinutes || 30),
        questionsCount: Number(e.questionsCount || 0),
        maxScore: Number(e.fullMark || 50),
        passScore: Number(e.passScore || 25),
        attemptsAllowed: 1,
        status: e.status === 'active' && e.submissionStatus !== 'submitted' && e.submissionStatus !== 'graded' ? 'ready' : 'upcoming',
        submissionStatus: e.submissionStatus,
        score: e.score,
        percentage: e.percentage,
        date: e.dueDate || ''
      }));
      setExamsList(mapped);
      if (mapped.length > 0) {
        setActiveExam((prev) => (prev.id ? prev : mapped[0]));
        if (!deepLinkHandledRef.current && typeof window !== 'undefined') {
          const requestedExamId = new URLSearchParams(window.location.search).get('examId');
          if (requestedExamId) {
            deepLinkHandledRef.current = true;
            const targetExam = mapped.find((ex) => ex.id === requestedExamId && ex.status === 'ready');
            if (targetExam) {
              setPendingExam(targetExam);
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  // Anti-cheat tab switch telemetry during active exam
  useEffect(() => {
    if (examState !== 'taking') return;
    const onVisChange = () => {
      if (document.hidden) {
        setTabSwitchesCount((prev) => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', onVisChange);
    return () => document.removeEventListener('visibilitychange', onVisChange);
  }, [examState]);

  const submitToBackend = useCallback(async () => {
    if (!activeExam?.id) return;
    try {
      const answersPayload = questions.map((q, idx) => ({
        questionUuid: q.uuid || q.id,
        selectedIndex: selectedAnswers[idx] !== undefined ? Number(selectedAnswers[idx]) : null,
      }));
      const res = await studentApi.exams.submit(activeExam.id, {
        tabSwitchesCount,
        answers: answersPayload,
      });
      setServerResult(res?.data || null);
      await loadExams();
    } catch {
      // ignore
    }
  }, [activeExam, questions, selectedAnswers, tabSwitchesCount, loadExams]);

  // Countdown timer in 'taking' state
  useEffect(() => {
    let timer;
    if (examState === 'taking' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setExamState('results');
            submitToBackend();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examState, timeLeft, submitToBackend]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRequestStartExam = (exam) => {
    if (exam.status === 'upcoming') return;
    setPendingExam(exam);
  };

  const handleConfirmStart = () => {
    if (!pendingExam) return;
    const examToStart = pendingExam;
    setPendingExam(null);
    handleStartExam(examToStart);
  };

  const handleStartExam = async (exam) => {
    try {
      const res = await studentApi.exams.start(exam.id);
      const data = res?.data || {};
      const qs = (data.questions || []).map((q) => ({
        id: q.id || q.uuid,
        uuid: q.uuid || q.id,
        questionAr: q.questionAr,
        options: q.optionsAr || [],
        optionsAr: q.optionsAr || [],
        points: q.points || 1,
      }));
      setExamSource('teacher');
      setActiveExam(exam);
      setQuestions(qs);
      setTimeLeft(Number(data.remainingSeconds || (exam.durationMinutes * 60)));
      setSelectedAnswers({});
      setFlaggedQuestions({});
      setTabSwitchesCount(0);
      setServerResult(null);
      setCurrentIdx(0);
      setExamState('taking');
    } catch (err) {
      alert(err?.message || (lang === 'ar' ? 'تعذر بدء الامتحان.' : 'Unable to start exam.'));
    }
  };

  const handleStartAIQuiz = () => {
    setIsGeneratingAI(false);
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

  const handleSubmitExam = async () => {
    setShowReviewConfirm(false);
    await submitToBackend();
    setExamState('results');
    setAttemptsUsed(prev => prev + 1);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const handleRetakeExam = () => {
    setExamState('catalog');
  };

  const scorePercent = serverResult?.percentage !== undefined && serverResult?.percentage !== null
    ? Math.round(Number(serverResult.percentage))
    : 0;
  const correctCount = serverResult?.score !== undefined && serverResult?.score !== null
    ? Number(serverResult.score)
    : 0;
  const isPerfectScore = Boolean(serverResult?.isFullMark || scorePercent === 100);

  const basePoints = correctCount;
  const perfectBonusPoints = isPerfectScore ? 3 : 0;
  const streakBonusPoints = 1;
  const totalEarnedPoints = basePoints + perfectBonusPoints + streakBonusPoints;
  const studentTotalScore = totalEarnedPoints;
  const gapToLead = 0;
  const currentQ = questions[currentIdx] || questions[0] || { id: '', questionAr: '', options: [], optionsAr: [] };

  return {
    examsList,
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
