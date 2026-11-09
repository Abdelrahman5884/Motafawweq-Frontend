import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_LESSON } from '../../data/mockData';
import { teacherApi } from '../../services/teacherApi';
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

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    teacherApi.dashboard.get()
      .then((res) => {
        if (isMounted && res?.data) {
          setDashboardData(res.data);
        }
      })
      .catch((err) => {
        console.warn('Teacher dashboard fallback to mock data:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Lessons sorted from Newest to Oldest (fallback to mock if empty)
  const fallbackLessons = [
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

  const lessons = (dashboardData?.recentLessons && dashboardData.recentLessons.length > 0)
    ? dashboardData.recentLessons
    : fallbackLessons;

  return (
    <div className="teacher-dashboard-container">
      {/* 1. Top Welcome Banner */}
      <TeacherWelcomeBanner
        currentUser={currentUser}
        welcomeData={dashboardData?.welcome}
        lang={lang}
      />

      {/* 2. Sleek Compact Executive Indicators (Revenue, Students, AI Quota, Class Mastery) */}
      <TeacherStatCards
        lang={lang}
        stats={dashboardData?.statCards}
      />

      {/* 3. Executive Charts:
          - Weekly Attendance Spline & Bar Chart (Last 7 Days)
          - Class & Subject Mastery Donut Gauge
          - Divided Neutral Cards for Subject & Center Student Distribution
      */}
      <TeacherAnalyticsCharts
        lang={lang}
        isDark={isDark}
        isRtl={isRtl}
        centerDistribution={dashboardData?.centerDistribution}
      />

      {/* 4. Adaptive Grid: Recent Processed Lessons & Active Cohorts Table */}
      <div className="teacher-main-grid">
        {/* Left Column: Recent Processed Lessons with Curriculum Progress */}
        <RecentProcessedLessons
          lessons={lessons}
          lang={lang}
          isRtl={isRtl}
          onOpenLesson={(id) => navigate('/teacher/workspace')}
        />

        {/* Right Column: Active Groups & Classes Structured Responsive Table/Cards */}
        <ActiveClassesList
          lang={lang}
          activeClasses={dashboardData?.activeClasses}
          onOpenClasses={() => navigate('/teacher/classes')}
          onOpenSchedule={() => navigate('/teacher/schedule')}
        />
      </div>
    </div>
  );
};

export default TeacherDashboard;
