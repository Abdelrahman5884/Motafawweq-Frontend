import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { teacherApi } from '../../services/teacherApi';
import {
  TeacherWelcomeBanner,
  TeacherStatCards,
  TeacherAnalyticsCharts,
  RecentProcessedLessons,
  ActiveClassesList,
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
        console.warn('Teacher dashboard load error:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const lessons = dashboardData?.recentLessons || [];

  return (
    <div className="teacher-dashboard-container">
      {/* 1. Top Welcome Banner */}
      <TeacherWelcomeBanner
        currentUser={currentUser}
        welcomeData={dashboardData?.welcome}
        lang={lang}
      />

      {/* 2. Sleek Compact Executive Indicators (Revenue, Students, Class Mastery, Pending Grading) */}
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
          activeClasses={dashboardData?.activeClasses || []}
          onOpenClasses={() => navigate('/teacher/classes')}
          onOpenSchedule={() => navigate('/teacher/schedule')}
        />
      </div>
    </div>
  );
};

export default TeacherDashboard;
