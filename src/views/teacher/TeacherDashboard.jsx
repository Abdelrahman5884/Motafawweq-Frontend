import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_LESSON } from '../../data/mockData';
import {
  TeacherWelcomeBanner,
  TeacherStatCards,
  TeacherAnalyticsCharts,
  RecentProcessedLessons,
  ActiveClassesList
} from '../../features/teacher/dashboard';

export const TeacherDashboard = () => {
  const { navigate, currentUser } = useAuth();
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();

  // Lessons sorted from Newest to Oldest
  const lessons = [
    {
      ...MOCK_LESSON,
      id: 'les-bio-301',
      recordedDate: '2026-09-12',
      titleAr: 'البناء الضوئي وحركية الطاقة في الخلايا النباتية',
      durationFormatted: '42:18',
      stats: { conceptsCount: 14, completionRate: 88, avgQuizScore: 84.5 }
    },
    {
      id: 'les-bio-302',
      title: 'Cellular Respiration & Krebs Cycle',
      titleAr: 'التنفس الخلوي الهوائي ودورة كريبس',
      subjectAr: 'الأحياء - الثانوية العامة',
      durationFormatted: '54:10',
      recordedDate: '2026-09-08',
      stats: { conceptsCount: 16, completionRate: 91, avgQuizScore: 82.0 }
    },
    {
      id: 'les-bio-303',
      title: 'Molecular Genetics & DNA Replication',
      titleAr: 'البيولوجيا الجزيئية وتضاعف الحمض النووي DNA',
      subjectAr: 'الأحياء - الثانوية العامة',
      durationFormatted: '1:12:00',
      recordedDate: '2026-09-02',
      stats: { conceptsCount: 22, completionRate: 78, avgQuizScore: 79.5 }
    }
  ];

  return (
    <div className="teacher-dashboard-container">
      {/* 1. Top Welcome Banner */}
      <TeacherWelcomeBanner
        currentUser={currentUser}
        lang={lang}
      />

      {/* 2. Sleek Compact Executive Indicators (Revenue, Students, AI Quota, Class Mastery) */}
      <TeacherStatCards lang={lang} />

      {/* 3. Executive Charts:
          - Weekly Attendance Spline & Bar Chart (Last 7 Days)
          - Class & Subject Mastery Donut Gauge
          - Divided Neutral Cards for Subject & Center Student Distribution
      */}
      <TeacherAnalyticsCharts lang={lang} isDark={isDark} isRtl={isRtl} />

      {/* 4. Adaptive Grid: Recent Processed Lessons & Active Cohorts Table */}
      <div className="teacher-main-grid">
        {/* Left Column: Recent Processed Lessons with Curriculum Progress */}
        <RecentProcessedLessons
          lessons={lessons}
          lang={lang}
          isRtl={isRtl}
          onOpenLesson={(id) => navigate('lesson-workspace', { lessonId: id })}
        />

        {/* Right Column: Active Groups & Classes Structured Responsive Table/Cards */}
        <ActiveClassesList
          lang={lang}
          onOpenClasses={() => navigate('/teacher/classes')}
        />
      </div>
    </div>
  );
};

export default TeacherDashboard;
