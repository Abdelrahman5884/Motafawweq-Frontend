import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { STUDENT_PROFILE, TODAY_TASKS } from '../../data/studentData';
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
  const student = STUDENT_PROFILE;

  // Active filter state for subjects
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);

  // Filter state for Today's Tasks (US-10)
  const [taskCategoryFilter, setTaskCategoryFilter] = useState('all');

  // Interactive Today's Tasks with toggle capability (US-10)
  const [tasks, setTasks] = useState(
    TODAY_TASKS.map(t => ({
      ...t,
      isCompleted: t.status === 'completed'
    }))
  );

  // Toggle task completed with celebration confetti
  const toggleTaskCompleted = (taskId) => {
    setTasks(prev => {
      return prev.map(t => {
        if (t.id === taskId) {
          const nextState = !t.isCompleted;
          if (nextState) {
            try {
              confetti({
                particleCount: 45,
                spread: 60,
                origin: { y: 0.7 }
              });
            } catch (e) {
              // ignore
            }
          }
          return { ...t, isCompleted: nextState, status: nextState ? 'completed' : 'pending' };
        }
        return t;
      });
    });
  };

  const completedTasksCount = tasks.filter(t => t.isCompleted).length;
  const filteredTasks = tasks.filter(t => {
    if (taskCategoryFilter === 'all') return true;
    return t.type === taskCategoryFilter;
  });

  // Active last studied course for US-08 and US-09
  const lastLesson = {
    courseId: 'course-bio-301',
    titleAr: 'البناء الضوئي وحركية الطاقة في الخلايا النباتية',
    titleEn: 'Photosynthesis & Cellular Energy Dynamics',
    subjectAr: 'الأحياء',
    subjectEn: 'Biology',
    teacherAr: 'د. سلمى السيد',
    teacherEn: 'Dr. Salma El-Sayed',
    lessonNumber: 3,
    totalLessons: 12,
    progressPercent: 68,
    pausedMinute: '08:00',
    totalDuration: '35:00',
    remainingMinutes: 14,
    nextLessonTitleAr: 'التنفس الخلوي وحلقة كريبس',
    nextLessonTitleEn: 'Cellular Respiration & Krebs Cycle',
    route: '/student/lesson'
  };

  // Subject filter options
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

  // Adaptive theme colors for SVGs & UI
  const themeAccent = isDark ? '#38BDF8' : '#0284C7';

  return (
    <SPage maxWidth={1240}>
      <div className="executive-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* 1. US-07 — Dashboard Overview & Profile Header */}
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

        {/* 1.1 US-07 — 4 KPI Cards */}
        <DashboardKpis
          student={student}
          lang={lang}
          isDark={isDark}
          themeAccent={themeAccent}
        />

        {/* 2. Charts (Area Spline Chart 65% + Donut Chart 35%) */}
        <StudyActivityChart
          lang={lang}
          isDark={isDark}
          themeAccent={themeAccent}
        />

        {/* 3. US-08 & US-09 — Resume Hero */}
        <ContinueLessonHero
          lastLesson={lastLesson}
          lang={lang}
          isRtl={isRtl}
          isDark={isDark}
          themeAccent={themeAccent}
        />

        {/* 4. US-10 — Today's Tasks & Checklist */}
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

        {/* 5. US-11 & US-12 — Upcoming Exams & Homework */}
        <UpcomingDeadlines
          lang={lang}
          isRtl={isRtl}
        />

        {/* 6. US-13 — AI Next-Step Guidance */}
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
