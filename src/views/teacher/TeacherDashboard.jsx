import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useGroups } from '../../context/GroupsContext';
import { teacherApi } from '../../services/teacherApi';
import { hasTeacherFeatureAccess } from '../../constants/teacherPlanFeatures';
import {
  TeacherWelcomeBanner,
  TeacherCenterInvitationsBanner,
  TeacherStatCards,
  TeacherAnalyticsCharts,
  RecentProcessedLessons,
  ActiveClassesList,
} from '../../features/teacher/dashboard';

const DashboardSkeleton = () => (
  <div className="teacher-dashboard-container" aria-busy="true">
    <div style={{
      height: '98px',
      borderRadius: 'var(--radius-xl)',
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-subtle)',
      opacity: 0.7
    }} />
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
      gap: '14px'
    }}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            height: '132px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            opacity: 0.7
          }}
        />
      ))}
    </div>
    <div className="executive-charts-grid">
      <div
        className="executive-chart-main"
        style={{
          height: '340px',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          opacity: 0.7
        }}
      />
      <div
        className="executive-chart-side"
        style={{
          height: '340px',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          opacity: 0.7
        }}
      />
    </div>
  </div>
);

export const TeacherDashboard = () => {
  const { navigate, currentUser, teacherPlanTier } = useAuth();
  const isScheduleLocked = !hasTeacherFeatureAccess(teacherPlanTier, 'schedule');
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const { setActiveGroupId } = useGroups();
  const isAr = lang === 'ar';

  const [dashboardData, setDashboardData] = useState(null);
  const [centerInvitations, setCenterInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const [res, invRes] = await Promise.all([
        teacherApi.dashboard.get(),
        teacherApi.centerInvitations.list().catch(() => null),
      ]);
      if (res?.data) {
        setDashboardData(res.data);
      } else {
        setError(
          isAr
            ? 'تعذر تحميل بيانات لوحة المعلم حالياً.'
            : 'Unable to load teacher dashboard data right now.'
        );
      }
      if (Array.isArray(invRes?.data?.invitations)) {
        setCenterInvitations(invRes.data.invitations);
      }
    } catch (err) {
      setError(
        err?.message ||
          (isAr
            ? 'حدث خطأ أثناء الاتصال بالخادم لتحميل لوحة التحكم.'
            : 'An error occurred while loading the dashboard.')
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAr]);

  useEffect(() => {
    let active = true;
    const loadInitial = async () => {
      setLoading(true);
      setError('');
      try {
        const [res, invRes] = await Promise.all([
          teacherApi.dashboard.get(),
          teacherApi.centerInvitations.list().catch(() => null),
        ]);
        if (active && res?.data) {
          setDashboardData(res.data);
        }
        if (active && Array.isArray(invRes?.data?.invitations)) {
          setCenterInvitations(invRes.data.invitations);
        }
      } catch (err) {
        if (active) {
          setError(
            err?.message ||
              (isAr
                ? 'حدث خطأ أثناء الاتصال بالخادم لتحميل لوحة التحكم.'
                : 'An error occurred while loading the dashboard.')
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadInitial();
    return () => { active = false; };
  }, [isAr]);

  const handleAcceptCenterInvitation = useCallback(async (uuid) => {
    await teacherApi.centerInvitations.accept(uuid);
    setCenterInvitations((prev) => prev.filter((item) => item.id !== uuid));
  }, []);

  const handleDeclineCenterInvitation = useCallback(async (uuid) => {
    await teacherApi.centerInvitations.decline(uuid);
    setCenterInvitations((prev) => prev.filter((item) => item.id !== uuid));
  }, []);

  const handleOpenLesson = useCallback((lessonId) => {
    if (!lessonId) {
      navigate('/teacher/workspace');
      return;
    }
    try {
      sessionStorage.setItem('currentLessonUuid', lessonId);
    } catch { /* ignore */ }
    navigate(`/teacher/workspace?lesson=${encodeURIComponent(lessonId)}`);
  }, [navigate]);

  const handleOpenGroupRoster = useCallback((groupId) => {
    if (groupId && typeof setActiveGroupId === 'function') {
      setActiveGroupId(groupId);
    }
    navigate('/teacher/students');
  }, [navigate, setActiveGroupId]);

  if (loading && !dashboardData) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="teacher-dashboard-container" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Error Banner with Retry */}
      {error && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '14px 18px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.28)',
            color: 'var(--text-primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '700' }}>
            <AlertTriangle size={18} color="#EF4444" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchDashboard({ silent: Boolean(dashboardData) })}
            disabled={refreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: refreshing ? 'wait' : 'pointer',
            }}
          >
            <RefreshCw size={13} className={refreshing ? 'spin' : undefined} />
            <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
        </div>
      )}

      {/* 1. Top Welcome Banner */}
      <TeacherWelcomeBanner
        currentUser={currentUser}
        welcomeData={dashboardData?.welcome}
        lang={lang}
        refreshing={refreshing}
        onRefresh={() => fetchDashboard({ silent: true })}
      />

      {/* 1.5 Incoming Educational Center Invitations (Requires Teacher Approval) */}
      <TeacherCenterInvitationsBanner
        invitations={centerInvitations}
        onAccept={handleAcceptCenterInvitation}
        onDecline={handleDeclineCenterInvitation}
        lang={lang}
      />

      {/* 2. Executive KPI Indicators */}
      <TeacherStatCards
        lang={lang}
        stats={dashboardData?.statCards}
      />

      {/* 3. Executive Charts (Weekly Active Students, Mastery Donut & Group Distribution) */}
      <TeacherAnalyticsCharts
        lang={lang}
        isDark={isDark}
        weeklyActivity={dashboardData?.weeklyActivity || []}
        subjectMastery={dashboardData?.subjectMastery || []}
        groupDistribution={dashboardData?.groupDistribution || []}
        classMastery={dashboardData?.statCards?.classMastery || 0}
        totalStudents={dashboardData?.statCards?.totalStudents || 0}
        onSelectGroup={handleOpenGroupRoster}
      />

      {/* 4. Adaptive Grid: Recent Lessons & Active Cohorts */}
      <div className="teacher-main-grid">
        <RecentProcessedLessons
          lessons={dashboardData?.recentLessons || []}
          lang={lang}
          isRtl={isRtl}
          onOpenLesson={handleOpenLesson}
          onOpenStudio={() => navigate('/teacher/studio')}
        />

        <ActiveClassesList
          lang={lang}
          activeClasses={dashboardData?.activeClasses || []}
          isScheduleLocked={isScheduleLocked}
          onOpenClasses={() => navigate('/teacher/classes')}
          onOpenSchedule={() => navigate('/teacher/schedule')}
          onOpenRoster={handleOpenGroupRoster}
          onAnnouncementSent={() => fetchDashboard({ silent: true })}
        />
      </div>
    </div>
  );
};

export default TeacherDashboard;
