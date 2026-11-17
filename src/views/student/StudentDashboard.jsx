import React, { useState, useEffect } from 'react';
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
    gradeNameAr: currentUser?.grade || '',
    schoolAr: currentUser?.school || '',
    xp: 0,
    level: 1,
    streakDays: 0,
    studyMinutesToday: 0,
    dailyGoalMinutes: 120,
    completedLessonsCount: 0,
    totalEnrolledLessons: 0,
    overallGpa: '0%'
  });

  const [lastLesson, setLastLesson] = useState(null);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [upcomingHomeworks, setUpcomingHomeworks] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    let mounted = true;
    const loadDashboard = async () => {
      try {
        const [dashRes, profRes, hwRes] = await Promise.all([
          studentApi.dashboard.get().catch(() => null),
          studentApi.profile.get().catch(() => null),
          studentApi.homeworks.list().catch(() => null)
        ]);
        if (!mounted) return;

        const kpis = dashRes?.data?.kpis || {};
        const prof = profRes?.data || {};

        setStudent({
          id: prof.id || currentUser?.id || '',
          name: prof.name || currentUser?.name || '',
          nameAr: prof.name || currentUser?.nameAr || currentUser?.name || '',
          gradeNameAr: prof.gradeAr || '',
          schoolAr: prof.schoolName || '',
          xp: Number(kpis.totalXp || 0),
          level: Math.max(1, Math.floor(Number(kpis.totalXp || 0) / 100) + 1),
          streakDays: 0,
          studyMinutesToday: Math.round(Number(kpis.watchedHours || 0) * 60),
          dailyGoalMinutes: Number(prof.dailyStudyGoalMinutes || 120),
          completedLessonsCount: Number(kpis.completedLessons || 0),
          totalEnrolledLessons: Number(kpis.completedLessons || 0),
          overallGpa: `${Number(kpis.avgExamPercentage || 0)}%`
        });

        const cont = dashRes?.data?.continueLesson;
        if (cont && cont.lessonId) {
          setLastLesson({
            courseId: cont.courseId,
            lessonId: cont.lessonId,
            titleAr: cont.lessonTitleAr,
            titleEn: cont.lessonTitleAr,
            subjectAr: cont.courseTitleAr || '',
            subjectEn: cont.courseTitleAr || '',
            teacherAr: '',
            teacherEn: '',
            lessonNumber: 1,
            totalLessons: 1,
            progressPercent: Number(cont.progressPercent || 0),
            pausedMinute: '00:00',
            totalDuration: '30:00',
            remainingMinutes: 15,
            nextLessonTitleAr: cont.courseTitleAr || '',
            nextLessonTitleEn: cont.courseTitleAr || '',
            route: '/student/lesson'
          });
        }

        const deadlines = Array.isArray(dashRes?.data?.upcomingDeadlines) ? dashRes.data.upcomingDeadlines : [];
        setUpcomingExams(deadlines);

        const hws = Array.isArray(hwRes?.data)
          ? hwRes.data.filter(h => h.submissionStatus === 'not_submitted')
          : [];
        setUpcomingHomeworks(hws);

        const builtTasks = [
          ...deadlines.map(e => ({
            id: `exam-${e.id}`,
            titleAr: e.titleAr,
            titleEn: e.titleAr,
            subjectAr: e.courseTitleAr || '',
            type: 'quiz',
            status: 'pending',
            isCompleted: false,
            route: '/student/exam'
          })),
          ...hws.map(h => ({
            id: `hw-${h.id}`,
            titleAr: h.titleAr,
            titleEn: h.titleAr,
            subjectAr: h.courseTitleAr || '',
            type: 'homework',
            status: 'pending',
            isCompleted: false,
            route: '/student/homework'
          }))
        ];
        setTasks(builtTasks);
      } catch {
        // ignore
      }
    };
    loadDashboard();
    return () => {
      mounted = false;
    };
  }, [currentUser]);

  const [selectedSubject, setSelectedSubject] = useState('all');
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [taskCategoryFilter, setTaskCategoryFilter] = useState('all');

  const toggleTaskCompleted = (taskId) => {
    setTasks(prev =>
      prev.map(t => {
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
      })
    );
  };

  const completedTasksCount = tasks.filter(t => t.isCompleted).length;
  const filteredTasks = tasks.filter(t => {
    if (taskCategoryFilter === 'all') return true;
    return t.type === taskCategoryFilter;
  });

  const filterOptions = [
    { id: 'all', labelAr: 'جميع المواد', labelEn: 'All Subjects' },
    { id: 'sub-bio', labelAr: 'الأحياء', labelEn: 'Biology' },
    { id: 'sub-phy', labelAr: 'الفيزياء', labelEn: 'Physics' },
    { id: 'sub-chem', labelAr: 'الكيمياء', labelEn: 'Chemistry' },
    { id: 'sub-ar', labelAr: 'اللغة العربية', labelEn: 'Arabic' }
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
          student={student}
          lang={lang}
          isDark={isDark}
          themeAccent={themeAccent}
        />

        <StudyActivityChart
          lang={lang}
          isDark={isDark}
          themeAccent={themeAccent}
          overallMasteryValue={parseFloat(student.overallGpa) || 0}
        />

        <ContinueLessonHero
          lastLesson={lastLesson}
          lang={lang}
          isRtl={isRtl}
          isDark={isDark}
          themeAccent={themeAccent}
        />

        <TodayTasks
          tasks={tasks}
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
          upcomingExams={upcomingExams}
          upcomingHomeworks={upcomingHomeworks}
          lang={lang}
          isRtl={isRtl}
        />

        <SmartNextStepBanner
          lang={lang}
          isRtl={isRtl}
          isDark={isDark}
        />
      </div>
    </SPage>
  );
};

export default StudentDashboard;
