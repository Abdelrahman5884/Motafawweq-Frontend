import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { AlertCircle, RefreshCw, Mail, Check, X, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useGroups } from '../../context/GroupsContext';
import { useStudentActivity } from '../../context/StudentActivityContext';
import { studentApi } from '../../services/studentApi';
import { getLocalDateKey, getClientTimezone } from '../../utils';
import { SPage } from '../../components/student/ui';
import {
  DashboardHeader,
  DashboardKpis,
  StudyActivityChart,
  ContinueLessonHero,
  TodayTasks,
  UpcomingDeadlines,
  SmartNextStepBanner
} from '../../features/student/dashboard';

export const StudentDashboard = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const { currentUser, authLoading } = useAuth();
  const {
    groups: studentAllGroups,
    studentAcceptInvitation,
    studentDeclineInvitation
  } = useGroups();
  const [respondingInvite, setRespondingInvite] = useState(null);

  const pendingTeacherInvites = useMemo(
    () =>
      (studentAllGroups || []).filter(
        (g) =>
          g.enrollmentStatus === 'pending' &&
          (g.isTeacherInvite || g.joinMethod === 'teacher_invite')
      ),
    [studentAllGroups]
  );

  const handleAcceptDashInvite = async (invite) => {
    const invId = invite?.enrollmentId;
    if (!invId || respondingInvite) return;
    setRespondingInvite({ id: invId, action: 'accept' });
    try {
      const res = await studentAcceptInvitation(invId);
      if (res?.success) {
        setReloadNonce((n) => n + 1);
      }
    } finally {
      setRespondingInvite(null);
    }
  };

  const handleDeclineDashInvite = async (invite) => {
    const invId = invite?.enrollmentId;
    if (!invId || respondingInvite) return;
    setRespondingInvite({ id: invId, action: 'decline' });
    try {
      await studentDeclineInvitation(invId);
    } finally {
      setRespondingInvite(null);
    }
  };
  const {
    activeSecondsToday,
    activeMinutesToday,
    streakDays: liveStreakDays,
    longestStreakDays: liveLongestStreakDays,
    streakWasReset: liveStreakWasReset,
    previousStreakDays: livePreviousStreakDays,
    todayDate: liveTodayDate,
    isTracking,
    hydrated: activityHydrated,
    dayRolloverCount,
    syncFromServerSnapshot
  } = useStudentActivity();

  const [student, setStudent] = useState({
    id: currentUser?.id || '',
    name: currentUser?.name || '',
    nameAr: currentUser?.nameAr || currentUser?.name || '',
    avatar: currentUser?.avatar || '',
    gradeNameAr: currentUser?.grade || '',
    trackAr: currentUser?.track || '',
    schoolAr: currentUser?.school || '',
    xp: 0,
    level: 1,
    streakDays: 0,
    longestStreakDays: 0,
    streakWasReset: false,
    previousStreakDays: 0,
    studyMinutesToday: 0,
    studySecondsToday: 0,
    dailyGoalMinutes: 120,
    completedLessonsCount: 0,
    totalEnrolledLessons: 0,
    examsCompletedCount: 0,
    fullMarkExamsCount: 0,
    batchRank: null,
    overallGpa: '0%'
  });

  const [lastLesson, setLastLesson] = useState(null);
  const [continueLessonsByCourse, setContinueLessonsByCourse] = useState({});
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [upcomingHomeworks, setUpcomingHomeworks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [subjectMastery, setSubjectMastery] = useState([]);
  const [smartRecommendation, setSmartRecommendation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [reloadNonce, setReloadNonce] = useState(0);
  const [togglingTaskId, setTogglingTaskId] = useState(null);

  const [selectedSubject, setSelectedSubject] = useState('all');
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [taskCategoryFilter, setTaskCategoryFilter] = useState('all');

  const clientTimezone = useMemo(() => getClientTimezone(), []);
  const activeDayStr = liveTodayDate || getLocalDateKey();

  const todayStorageKey = useMemo(() => {
    const uid = currentUser?.id || 'guest';
    return `mtfq_dash_tasks_${uid}_${activeDayStr}`;
  }, [currentUser?.id, activeDayStr]);

  const fetchDashboardData = useCallback(async () => {
    const [dashRes, profRes] = await Promise.all([
      studentApi.dashboard.get(clientTimezone),
      studentApi.profile.get().catch(() => null)
    ]);

    const data = dashRes?.data || {};
    const kpis = data.kpis || {};
    const prof = profRes?.data || {};

    if (data.activity) {
      syncFromServerSnapshot(data.activity);
    }

    const studySec = Number(kpis.studySecondsToday ?? Math.round(Number(kpis.studyMinutesToday || 0) * 60));

    setStudent({
      id: prof.id || currentUser?.id || '',
      name: prof.name || currentUser?.name || '',
      nameAr: prof.name || currentUser?.nameAr || currentUser?.name || '',
      avatar: prof.avatar || currentUser?.avatar || '',
      gradeNameAr: prof.gradeAr || currentUser?.grade || '',
      trackAr: prof.trackAr || currentUser?.track || '',
      schoolAr: prof.schoolName || '',
      xp: Number(kpis.totalXp || 0),
      level: Math.max(1, Math.floor(Number(kpis.totalXp || 0) / 100) + 1),
      streakDays: Number(kpis.streakDays || 0),
      longestStreakDays: Number(kpis.longestStreakDays || kpis.streakDays || 0),
      streakWasReset: Boolean(kpis.streakWasReset),
      previousStreakDays: Number(kpis.previousStreakDays || 0),
      studyMinutesToday: Number(kpis.studyMinutesToday ?? Math.floor(studySec / 60)),
      studySecondsToday: studySec,
      dailyGoalMinutes: Number(prof.dailyStudyGoalMinutes || 120),
      completedLessonsCount: Number(kpis.completedLessons || 0),
      totalEnrolledLessons: Number(kpis.totalEnrolledLessons ?? kpis.completedLessons ?? 0),
      examsCompletedCount: Number(kpis.examsCompletedCount || 0),
      fullMarkExamsCount: Number(kpis.fullMarkExamsCount || 0),
      batchRank: kpis.batchRank ?? null,
      overallGpa: `${Number(kpis.avgExamPercentage || 0)}%`
    });

    setWeeklyActivity(Array.isArray(data.weeklyActivity) ? data.weeklyActivity : []);
    setSubjectMastery(Array.isArray(data.subjectMastery) ? data.subjectMastery : []);
    setSmartRecommendation(data.smartRecommendation || null);
    setContinueLessonsByCourse(
      data.continueLessonsByCourse && typeof data.continueLessonsByCourse === 'object'
        ? data.continueLessonsByCourse
        : {}
    );

    const cont = data.continueLesson;
    if (cont && cont.lessonId) {
      setLastLesson({
        courseId: cont.courseId,
        lessonId: cont.lessonId,
        titleAr: cont.titleAr || cont.lessonTitleAr,
        titleEn: cont.titleEn || cont.titleAr || cont.lessonTitleAr,
        subjectAr: cont.subjectAr || cont.courseTitleAr || '',
        subjectEn: cont.subjectEn || cont.courseTitleAr || '',
        teacherAr: cont.teacherAr || '',
        teacherEn: cont.teacherEn || '',
        lessonNumber: Number(cont.lessonNumber || 1),
        totalLessons: Number(cont.totalLessons || 1),
        progressPercent: Number(cont.progressPercent || 0),
        isCompleted: Boolean(cont.isCompleted),
        pausedMinute: cont.pausedMinute || '00:00',
        totalDuration: cont.totalDuration || cont.durationLabel || '30:00',
        remainingMinutes: Number(cont.remainingMinutes ?? 0),
        nextLessonTitleAr: cont.nextLessonTitleAr || '',
        nextLessonTitleEn: cont.nextLessonTitleEn || '',
        route: cont.route || '/student/lesson'
      });
    } else {
      setLastLesson(null);
    }

    const deadlines = Array.isArray(data.upcomingDeadlines) ? data.upcomingDeadlines : [];
    setUpcomingExams(deadlines);

    const hws = Array.isArray(data.upcomingHomeworks) ? data.upcomingHomeworks : [];
    setUpcomingHomeworks(hws);

    let completedIdsMap = {};
    try {
      const saved = localStorage.getItem(todayStorageKey);
      if (saved) completedIdsMap = JSON.parse(saved) || {};
    } catch {
      // ignore storage parse error
    }

    const rawTasks = Array.isArray(data.todayTasks) ? data.todayTasks : [];

    setTasks(
      rawTasks.map((t) => {
        const isDone = t.source === 'study_session'
          ? Boolean(t.isCompleted)
          : Boolean(completedIdsMap[t.id] || t.isCompleted);

        return {
          ...t,
          isCompleted: isDone,
          status: isDone ? 'completed' : 'pending'
        };
      })
    );

    setLoadError(null);
  }, [clientTimezone, currentUser?.avatar, currentUser?.grade, currentUser?.id, currentUser?.name, currentUser?.nameAr, currentUser?.track, syncFromServerSnapshot, todayStorageKey]);

  useEffect(() => {
    if (authLoading) return undefined;
    let active = true;
    const run = async () => {
      try {
        await fetchDashboardData();
      } catch (err) {
        if (!active) return;
        setLoadError(
          err?.message ||
            (lang === 'ar'
              ? 'تعذر تحميل بيانات لوحة التحكم. تحقق من الاتصال وحاول مرة أخرى.'
              : 'Unable to load dashboard data. Please check your connection and try again.')
        );
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [authLoading, fetchDashboardData, dayRolloverCount, reloadNonce, lang]);

  const handleRetry = () => {
    setLoading(true);
    setLoadError(null);
    setReloadNonce((n) => n + 1);
  };

  const toggleTaskCompleted = async (taskId) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    // Database-backed personal study session toggle
    if (targetTask.source === 'study_session' && targetTask.sessionUuid) {
      const nextState = !targetTask.isCompleted;
      setTogglingTaskId(taskId);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, isCompleted: nextState, status: nextState ? 'completed' : 'pending' }
            : t
        )
      );

      if (nextState) {
        try {
          confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
        } catch {
          // ignore confetti errors
        }
      }

      try {
        await studentApi.schedule.toggleStudySession(targetTask.sessionUuid);
      } catch {
        // Revert optimistic update on failure
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, isCompleted: !nextState, status: !nextState ? 'completed' : 'pending' }
              : t
          )
        );
      } finally {
        setTogglingTaskId(null);
      }
      return;
    }

    // Local daily checklist toggle for lesson/exam/homework reminders
    setTasks((prev) => {
      const nextList = prev.map((t) => {
        if (t.id === taskId) {
          const nextState = !t.isCompleted;
          if (nextState) {
            try {
              confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
            } catch {
              // ignore
            }
          }
          return { ...t, isCompleted: nextState, status: nextState ? 'completed' : 'pending' };
        }
        return t;
      });

      try {
        const map = {};
        nextList.forEach((item) => {
          if (item.source !== 'study_session' && item.isCompleted) {
            map[item.id] = true;
          }
        });
        localStorage.setItem(todayStorageKey, JSON.stringify(map));
      } catch {
        // ignore storage errors
      }

      return nextList;
    });
  };

  // Merge live real-time platform timer & streak from StudentActivityContext into student state
  const liveStudent = useMemo(() => {
    const mergedSeconds = activityHydrated ? activeSecondsToday : student.studySecondsToday;
    const mergedMinutes = Math.floor(mergedSeconds / 60);
    const mergedStreak = activityHydrated ? liveStreakDays : student.streakDays;
    const mergedLongest = Math.max(
      mergedStreak,
      activityHydrated ? liveLongestStreakDays : student.longestStreakDays
    );

    return {
      ...student,
      studySecondsToday: mergedSeconds,
      studyMinutesToday: mergedMinutes,
      streakDays: mergedStreak,
      longestStreakDays: mergedLongest,
      streakWasReset: activityHydrated ? (liveStreakWasReset || student.streakWasReset) : student.streakWasReset,
      previousStreakDays: activityHydrated
        ? Number(livePreviousStreakDays || student.previousStreakDays || 0)
        : Number(student.previousStreakDays || 0),
    };
  }, [
    student,
    activityHydrated,
    activeSecondsToday,
    liveStreakDays,
    liveLongestStreakDays,
    liveStreakWasReset,
    livePreviousStreakDays
  ]);

  // Keep Today's point in the 7-day chart live-updated as active minutes increment
  const liveWeeklyActivity = useMemo(() => {
    if (!Array.isArray(weeklyActivity) || weeklyActivity.length === 0) return [];
    return weeklyActivity.map((day) => {
      if (!day.isToday) return day;
      const liveMins = activityHydrated ? activeMinutesToday : Number(day.minutes || 0);
      return {
        ...day,
        minutes: liveMins,
      };
    });
  }, [weeklyActivity, activityHydrated, activeMinutesToday]);

  const effectiveSelectedSubject = useMemo(() => {
    if (selectedSubject === 'all') return 'all';
    if (subjectMastery.length > 0 && !subjectMastery.some((s) => s.id === selectedSubject)) {
      return 'all';
    }
    return selectedSubject;
  }, [selectedSubject, subjectMastery]);

  // Active Subject Object when filtered
  const selectedSubjectObj = useMemo(
    () => (effectiveSelectedSubject === 'all' ? null : subjectMastery.find((s) => s.id === effectiveSelectedSubject) || null),
    [effectiveSelectedSubject, subjectMastery]
  );

  const matchesSelectedSubject = useCallback((itemCourseId, itemSubjectAr) => {
    if (effectiveSelectedSubject === 'all') return true;
    if (itemCourseId && itemCourseId === effectiveSelectedSubject) return true;
    if (selectedSubjectObj && itemSubjectAr && itemSubjectAr === selectedSubjectObj.nameAr) return true;
    return false;
  }, [effectiveSelectedSubject, selectedSubjectObj]);

  const subjectTasks = useMemo(
    () => tasks.filter((t) => matchesSelectedSubject(t.courseId, t.subjectAr)),
    [tasks, matchesSelectedSubject]
  );

  const completedTasksCount = subjectTasks.filter((t) => t.isCompleted).length;
  const filteredTasks = subjectTasks.filter((t) => {
    if (taskCategoryFilter === 'all') return true;
    return t.type === taskCategoryFilter;
  });

  const filteredUpcomingExams = useMemo(
    () => upcomingExams.filter((e) => matchesSelectedSubject(e.courseId, e.courseTitleAr)),
    [upcomingExams, matchesSelectedSubject]
  );

  const filteredUpcomingHomeworks = useMemo(
    () => upcomingHomeworks.filter((h) => matchesSelectedSubject(h.courseId, h.courseTitleAr)),
    [upcomingHomeworks, matchesSelectedSubject]
  );

  const activeContinueLesson = useMemo(() => {
    if (effectiveSelectedSubject === 'all') return lastLesson;
    if (continueLessonsByCourse[effectiveSelectedSubject]) return continueLessonsByCourse[effectiveSelectedSubject];
    if (lastLesson && matchesSelectedSubject(lastLesson.courseId, lastLesson.subjectAr)) return lastLesson;
    return null;
  }, [effectiveSelectedSubject, lastLesson, continueLessonsByCourse, matchesSelectedSubject]);

  const displayedStudentKpis = useMemo(() => {
    if (!selectedSubjectObj) return liveStudent;
    return {
      ...liveStudent,
      completedLessonsCount: Number(selectedSubjectObj.completedLessons ?? liveStudent.completedLessonsCount),
      totalEnrolledLessons: Number(selectedSubjectObj.totalLessons ?? liveStudent.totalEnrolledLessons),
      examsCompletedCount: Number(selectedSubjectObj.examsCompletedCount ?? 0),
      fullMarkExamsCount: Number(selectedSubjectObj.fullMarkExamsCount ?? 0)
    };
  }, [liveStudent, selectedSubjectObj]);

  const displayedMasteryValue = useMemo(() => {
    if (selectedSubjectObj) return Number(selectedSubjectObj.pct || 0);
    if (subjectMastery.length > 0) {
      const avgCoursePct = Math.round(
        subjectMastery.reduce((acc, s) => acc + Number(s.pct || 0), 0) / subjectMastery.length
      );
      return avgCoursePct || parseFloat(liveStudent.overallGpa) || 0;
    }
    return parseFloat(liveStudent.overallGpa) || 0;
  }, [selectedSubjectObj, subjectMastery, liveStudent.overallGpa]);

  const displayedRecommendation = useMemo(() => {
    if (!selectedSubjectObj) return smartRecommendation;

    if (activeContinueLesson && !activeContinueLesson.isCompleted) {
      return {
        textAr: `خطوتك التالية في مقرر «${selectedSubjectObj.nameAr}»: استكمال درس «${activeContinueLesson.titleAr}» (${activeContinueLesson.progressPercent}% مكتمل).`,
        textEn: `Next step in "${selectedSubjectObj.nameEn || selectedSubjectObj.nameAr}": Continue "${activeContinueLesson.titleEn || activeContinueLesson.titleAr}" (${activeContinueLesson.progressPercent}% completed).`,
        route: `/student/lesson?courseId=${activeContinueLesson.courseId}&lessonId=${activeContinueLesson.lessonId}`,
        buttonAr: 'متابعة الدرس الآن',
        buttonEn: 'Continue Lesson'
      };
    }

    if (filteredUpcomingExams.length > 0) {
      const nextExam = filteredUpcomingExams[0];
      return {
        textAr: `لديك اختبار متاح في «${selectedSubjectObj.nameAr}»: «${nextExam.titleAr}» — ابدأ الآن لرفع مستواك.`,
        textEn: `You have an active exam in "${selectedSubjectObj.nameEn || selectedSubjectObj.nameAr}": "${nextExam.titleEn || nextExam.titleAr}".`,
        route: `/student/exam?examId=${encodeURIComponent(nextExam.id)}`,
        buttonAr: 'بدء الاختبار الآن',
        buttonEn: 'Start Exam Now'
      };
    }

    if (filteredUpcomingHomeworks.length > 0) {
      const nextHw = filteredUpcomingHomeworks[0];
      return {
        textAr: `لديك واجب مطلوب في «${selectedSubjectObj.nameAr}»: «${nextHw.titleAr}» — قم بتسليمه قبل الموعد النهائي.`,
        textEn: `Pending homework in "${selectedSubjectObj.nameEn || selectedSubjectObj.nameAr}": "${nextHw.titleEn || nextHw.titleAr}".`,
        route: `/student/homework?homeworkId=${encodeURIComponent(nextHw.id)}`,
        buttonAr: 'حل الواجب الآن',
        buttonEn: 'Solve Homework'
      };
    }

    return smartRecommendation;
  }, [selectedSubjectObj, smartRecommendation, activeContinueLesson, filteredUpcomingExams, filteredUpcomingHomeworks]);

  const filterOptions = [
    { id: 'all', labelAr: 'جميع المواد', labelEn: 'All Subjects' },
    ...subjectMastery.map((s) => ({
      id: s.id,
      labelAr: s.nameAr,
      labelEn: s.nameEn || s.nameAr
    }))
  ];

  const currentSubjectLabel =
    filterOptions.find((o) => o.id === effectiveSelectedSubject)?.[lang === 'ar' ? 'labelAr' : 'labelEn'] ||
    (lang === 'ar' ? 'جميع المواد' : 'All Subjects');

  const themeAccent = isDark ? '#38BDF8' : '#0284C7';

  return (
    <SPage maxWidth={1240}>
      <div className="executive-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <DashboardHeader
          student={liveStudent}
          lang={lang}
          isRtl={isRtl}
          isDark={isDark}
          themeAccent={themeAccent}
          selectedSubject={effectiveSelectedSubject}
          setSelectedSubject={setSelectedSubject}
          subjectDropdownOpen={subjectDropdownOpen}
          setSubjectDropdownOpen={setSubjectDropdownOpen}
          filterOptions={filterOptions}
          currentSubjectLabel={currentSubjectLabel}
        />

        {loadError && (
          <div
            role="alert"
            className="executive-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              borderColor: 'rgba(239, 68, 68, 0.35)',
              background: isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444', fontSize: '13.5px', fontWeight: '600' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{loadError}</span>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#EF4444',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} />
              <span>{lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}</span>
            </button>
          </div>
        )}

        {pendingTeacherInvites.length > 0 && (
          <div
            className="executive-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              borderColor: 'rgba(21, 136, 199, 0.35)',
              background: isDark
                ? 'linear-gradient(135deg, rgba(21, 136, 199, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)'
                : 'linear-gradient(135deg, rgba(21, 136, 199, 0.07) 0%, rgba(16, 185, 129, 0.06) 100%)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(21, 136, 199, 0.14)',
                  color: themeAccent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Mail size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
                  {lang === 'ar'
                    ? `لديك ${pendingTeacherInvites.length === 1 ? 'دعوة انضمام جديدة' : `${pendingTeacherInvites.length} دعوات انضمام جديدة`} من معلميك`
                    : `You have ${pendingTeacherInvites.length} new group invitation${pendingTeacherInvites.length > 1 ? 's' : ''}`}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {lang === 'ar'
                    ? 'اقبل الدعوة للانضمام للمجموعة والبدء في متابعة المواعيد والمقررات.'
                    : 'Accept to join the study group and access its schedule and courses.'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pendingTeacherInvites.map((inv) => {
                const isBusy = respondingInvite?.id === inv.enrollmentId;
                const busyAction = isBusy ? respondingInvite.action : null;
                return (
                  <div
                    key={inv.enrollmentId || inv.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ minWidth: 0, flex: '1 1 220px' }}>
                      <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {lang === 'ar' ? inv.nameAr : (inv.nameEn || inv.nameAr)}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {(inv.teacherNameAr || inv.teacherName) && (
                          <span>
                            {lang === 'ar'
                              ? `المعلم: ${inv.teacherNameAr || inv.teacherName}`
                              : `Teacher: ${inv.teacherNameEn || inv.teacherName}`}
                          </span>
                        )}
                        {inv.subjectAr && <span> • {lang === 'ar' ? inv.subjectAr : (inv.subjectEn || inv.subjectAr)}</span>}
                        {inv.scheduleAr && <span> • {lang === 'ar' ? inv.scheduleAr : (inv.scheduleEn || inv.scheduleAr)}</span>}
                      </div>
                    </div>

                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        disabled={Boolean(respondingInvite)}
                        onClick={() => handleAcceptDashInvite(inv)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '7px 14px',
                          borderRadius: '9px',
                          border: 'none',
                          backgroundColor: '#10B981',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: respondingInvite ? 'wait' : 'pointer',
                          opacity: respondingInvite && !isBusy ? 0.65 : 1
                        }}
                      >
                        {busyAction === 'accept' ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                        <span>{lang === 'ar' ? 'قبول الدعوة' : 'Accept'}</span>
                      </button>

                      <button
                        type="button"
                        disabled={Boolean(respondingInvite)}
                        onClick={() => handleDeclineDashInvite(inv)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '7px 12px',
                          borderRadius: '9px',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          backgroundColor: 'rgba(239, 68, 68, 0.08)',
                          color: '#EF4444',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: respondingInvite ? 'wait' : 'pointer',
                          opacity: respondingInvite && !isBusy ? 0.65 : 1
                        }}
                      >
                        {busyAction === 'decline' ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                        <span>{lang === 'ar' ? 'رفض' : 'Decline'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} aria-busy="true">
            <div className="executive-kpi-grid">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="executive-kpi-card executive-skeleton" style={{ minHeight: '138px' }} />
              ))}
            </div>
            <div className="executive-charts-grid">
              <div className="executive-card executive-chart-main executive-skeleton" style={{ minHeight: '300px' }} />
              <div className="executive-card executive-chart-side executive-skeleton" style={{ minHeight: '300px' }} />
            </div>
            <div className="executive-card executive-skeleton" style={{ minHeight: '120px' }} />
          </div>
        ) : (
          <>
            <DashboardKpis
              student={displayedStudentKpis}
              lang={lang}
              isDark={isDark}
              themeAccent={themeAccent}
              isTrackingTime={isTracking}
            />

            <StudyActivityChart
              lang={lang}
              isDark={isDark}
              themeAccent={themeAccent}
              studyData={liveWeeklyActivity.length > 0 ? liveWeeklyActivity : undefined}
              subjectMastery={subjectMastery}
              overallMasteryValue={displayedMasteryValue}
              selectedSubject={effectiveSelectedSubject}
              onSelectSubject={setSelectedSubject}
            />

            <ContinueLessonHero
              lastLesson={activeContinueLesson}
              lang={lang}
              isRtl={isRtl}
              isDark={isDark}
              themeAccent={themeAccent}
            />

            <TodayTasks
              tasks={subjectTasks}
              filteredTasks={filteredTasks}
              completedTasksCount={completedTasksCount}
              taskCategoryFilter={taskCategoryFilter}
              setTaskCategoryFilter={setTaskCategoryFilter}
              toggleTaskCompleted={toggleTaskCompleted}
              togglingTaskId={togglingTaskId}
              lang={lang}
              isRtl={isRtl}
              isDark={isDark}
              themeAccent={themeAccent}
            />

            <UpcomingDeadlines
              upcomingExams={filteredUpcomingExams}
              upcomingHomeworks={filteredUpcomingHomeworks}
              lang={lang}
              isRtl={isRtl}
            />

            <SmartNextStepBanner
              lang={lang}
              isRtl={isRtl}
              isDark={isDark}
              recommendation={displayedRecommendation}
            />
          </>
        )}
      </div>
    </SPage>
  );
};

export default StudentDashboard;
