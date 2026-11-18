import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { studentApi } from '../../services/studentApi';
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
  const { currentUser } = useAuth();

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
    studyMinutesToday: 0,
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

  const [selectedSubject, setSelectedSubject] = useState('all');
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [taskCategoryFilter, setTaskCategoryFilter] = useState('all');

  const todayStorageKey = useMemo(() => {
    const uid = currentUser?.id || 'guest';
    const dayStr = new Date().toISOString().slice(0, 10);
    return `mtfq_dash_tasks_${uid}_${dayStr}`;
  }, [currentUser?.id]);

  useEffect(() => {
    let mounted = true;
    const loadDashboard = async () => {
      try {
        const [dashRes, profRes] = await Promise.all([
          studentApi.dashboard.get().catch(() => null),
          studentApi.profile.get().catch(() => null)
        ]);
        if (!mounted) return;

        const data = dashRes?.data || {};
        const kpis = data.kpis || {};
        const prof = profRes?.data || {};

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
          studyMinutesToday: Number(kpis.studyMinutesToday ?? Math.round(Number(kpis.watchedHours || 0) * 60)),
          dailyGoalMinutes: Number(prof.dailyStudyGoalMinutes || 120),
          completedLessonsCount: Number(kpis.completedLessons || 0),
          totalEnrolledLessons: Number(kpis.totalEnrolledLessons ?? kpis.completedLessons ?? 0),
          examsCompletedCount: Number(kpis.examsCompletedCount || 0),
          fullMarkExamsCount: Number(kpis.fullMarkExamsCount || 0),
          batchRank: kpis.batchRank ?? null,
          overallGpa: `${Number(kpis.avgExamPercentage || 0)}%`
        });

        if (Array.isArray(data.weeklyActivity)) {
          setWeeklyActivity(data.weeklyActivity);
        }
        if (Array.isArray(data.subjectMastery)) {
          setSubjectMastery(data.subjectMastery);
        }
        if (data.smartRecommendation) {
          setSmartRecommendation(data.smartRecommendation);
        }
        if (data.continueLessonsByCourse && typeof data.continueLessonsByCourse === 'object') {
          setContinueLessonsByCourse(data.continueLessonsByCourse);
        }

        const cont = data.continueLesson;
        if (cont && cont.lessonId) {
          setLastLesson({
            courseId: cont.courseId,
            lessonId: cont.lessonId,
            titleAr: cont.titleAr || cont.lessonTitleAr,
            titleEn: cont.titleEn || cont.lessonTitleAr,
            subjectAr: cont.subjectAr || cont.courseTitleAr || '',
            subjectEn: cont.subjectEn || cont.courseTitleAr || '',
            teacherAr: cont.teacherAr || '',
            teacherEn: cont.teacherEn || '',
            lessonNumber: Number(cont.lessonNumber || 1),
            totalLessons: Number(cont.totalLessons || 1),
            progressPercent: Number(cont.progressPercent || 0),
            pausedMinute: cont.pausedMinute || '00:00',
            totalDuration: cont.totalDuration || cont.durationLabel || '30:00',
            remainingMinutes: Number(cont.remainingMinutes || 15),
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
        } catch {}

        const rawTasks = Array.isArray(data.todayTasks)
          ? data.todayTasks
          : [
              ...deadlines.map(e => ({
                id: `exam-${e.id}`,
                courseId: e.courseId,
                titleAr: e.titleAr,
                titleEn: e.titleAr,
                subjectAr: e.courseTitleAr || '',
                type: 'quiz',
                duration: `${e.durationMinutes || 30} دقيقة`,
                deadline: e.dueDate ? `آخر موعد: ${e.dueDate}` : 'متاح الآن',
                priority: 'urgent',
                actionRoute: '/student/exam'
              })),
              ...hws.map(h => ({
                id: `hw-${h.id}`,
                courseId: h.courseId,
                titleAr: h.titleAr,
                titleEn: h.titleAr,
                subjectAr: h.courseTitleAr || '',
                type: 'homework',
                duration: `${h.maxScore || 20} درجة`,
                deadline: h.dueDate ? `التسليم: ${h.dueDate}` : 'مطلوب للتسليم',
                priority: 'urgent',
                actionRoute: '/student/homework'
              }))
            ];

        setTasks(
          rawTasks.map((t) => ({
            ...t,
            isCompleted: Boolean(completedIdsMap[t.id] || t.isCompleted),
            status: completedIdsMap[t.id] || t.isCompleted ? 'completed' : 'pending'
          }))
        );
      } catch {
        // ignore
      }
    };
    loadDashboard();
    return () => {
      mounted = false;
    };
  }, [currentUser, todayStorageKey]);

  const toggleTaskCompleted = (taskId) => {
    setTasks(prev => {
      const nextList = prev.map(t => {
        if (t.id === taskId) {
          const nextState = !t.isCompleted;
          if (nextState) {
            try {
              confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
            } catch {}
          }
          return { ...t, isCompleted: nextState, status: nextState ? 'completed' : 'pending' };
        }
        return t;
      });

      try {
        const map = {};
        nextList.forEach(item => {
          if (item.isCompleted) map[item.id] = true;
        });
        localStorage.setItem(todayStorageKey, JSON.stringify(map));
      } catch {}

      return nextList;
    });
  };

  // Active Subject Object when filtered
  const selectedSubjectObj = useMemo(
    () => (selectedSubject === 'all' ? null : subjectMastery.find((s) => s.id === selectedSubject) || null),
    [selectedSubject, subjectMastery]
  );

  const matchesSelectedSubject = (itemCourseId, itemSubjectAr) => {
    if (selectedSubject === 'all') return true;
    if (itemCourseId && itemCourseId === selectedSubject) return true;
    if (selectedSubjectObj && itemSubjectAr && itemSubjectAr === selectedSubjectObj.nameAr) return true;
    return false;
  };

  // Filter tasks, exams, homeworks, continueLesson, KPIs, and overallMasteryValue by selectedSubject
  const subjectTasks = useMemo(
    () => tasks.filter((t) => matchesSelectedSubject(t.courseId, t.subjectAr)),
    [tasks, selectedSubject, selectedSubjectObj]
  );

  const completedTasksCount = subjectTasks.filter(t => t.isCompleted).length;
  const filteredTasks = subjectTasks.filter(t => {
    if (taskCategoryFilter === 'all') return true;
    return t.type === taskCategoryFilter;
  });

  const filteredUpcomingExams = useMemo(
    () => upcomingExams.filter((e) => matchesSelectedSubject(e.courseId, e.courseTitleAr)),
    [upcomingExams, selectedSubject, selectedSubjectObj]
  );

  const filteredUpcomingHomeworks = useMemo(
    () => upcomingHomeworks.filter((h) => matchesSelectedSubject(h.courseId, h.courseTitleAr)),
    [upcomingHomeworks, selectedSubject, selectedSubjectObj]
  );

  const activeContinueLesson = useMemo(() => {
    if (selectedSubject === 'all') return lastLesson;
    if (continueLessonsByCourse[selectedSubject]) return continueLessonsByCourse[selectedSubject];
    if (lastLesson && matchesSelectedSubject(lastLesson.courseId, lastLesson.subjectAr)) return lastLesson;
    return null;
  }, [selectedSubject, lastLesson, continueLessonsByCourse, selectedSubjectObj]);

  const displayedStudentKpis = useMemo(() => {
    if (!selectedSubjectObj) return student;
    return {
      ...student,
      completedLessonsCount: Number(selectedSubjectObj.completedLessons ?? student.completedLessonsCount),
      totalEnrolledLessons: Number(selectedSubjectObj.totalLessons ?? student.totalEnrolledLessons)
    };
  }, [student, selectedSubjectObj]);

  const displayedMasteryValue = useMemo(() => {
    if (selectedSubjectObj) return Number(selectedSubjectObj.pct || 0);
    if (subjectMastery.length > 0) {
      const avgCoursePct = Math.round(
        subjectMastery.reduce((acc, s) => acc + Number(s.pct || 0), 0) / subjectMastery.length
      );
      return avgCoursePct || parseFloat(student.overallGpa) || 0;
    }
    return parseFloat(student.overallGpa) || 0;
  }, [selectedSubjectObj, subjectMastery, student.overallGpa]);

  const filterOptions = [
    { id: 'all', labelAr: 'جميع المواد', labelEn: 'All Subjects' },
    ...subjectMastery.map((s) => ({
      id: s.id,
      labelAr: s.nameAr,
      labelEn: s.nameEn || s.nameAr
    }))
  ];

  const currentSubjectLabel =
    filterOptions.find(o => o.id === selectedSubject)?.[lang === 'ar' ? 'labelAr' : 'labelEn'] ||
    (lang === 'ar' ? 'جميع المواد' : 'All Subjects');

  const themeAccent = isDark ? '#38BDF8' : '#0284C7';

  return (
    <SPage maxWidth={1240}>
      <div className="executive-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <DashboardHeader
          student={student}
          lang={lang}
          isRtl={isRtl}
          isDark={isDark}
          themeAccent={themeAccent}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          subjectDropdownOpen={subjectDropdownOpen}
          setSubjectDropdownOpen={setSubjectDropdownOpen}
          filterOptions={filterOptions}
          currentSubjectLabel={currentSubjectLabel}
        />

        <DashboardKpis
          student={displayedStudentKpis}
          lang={lang}
          isDark={isDark}
          themeAccent={themeAccent}
        />

        <StudyActivityChart
          lang={lang}
          isDark={isDark}
          themeAccent={themeAccent}
          studyData={weeklyActivity.length > 0 ? weeklyActivity : undefined}
          subjectMastery={subjectMastery}
          overallMasteryValue={displayedMasteryValue}
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
          recommendation={smartRecommendation}
        />
      </div>
    </SPage>
  );
};

export default StudentDashboard;
