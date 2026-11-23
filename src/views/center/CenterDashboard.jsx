import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { centerApi } from '../../services/centerApi';
import {
  CenterAttendanceChart,
  CenterDashboardHeader,
  CenterDashboardSkeleton,
  CenterFullQueueModal,
  CenterHallOccupancyCard,
  CenterKpiCards,
  CenterLiveQueueSection,
  getTodayDayKey,
} from '../../features/center/dashboard';

export const CenterDashboard = () => {
  const navigate = useNavigate();
  const { authLoading, isAuthenticated, hasActiveToken, currentUser, refreshUser } = useAuth();
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();

  const isAr = lang === 'ar';
  const themeAccent = isDark ? '#5CB6DB' : '#1588C7';
  const isAuthorizedCenter =
    !authLoading && isAuthenticated && hasActiveToken && currentUser?.role === 'center';

  const [branchId, setBranchId] = useState('all');
  const [period, setPeriod] = useState('today');
  const [queueDay, setQueueDay] = useState(() => getTodayDayKey());

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [busyItemId, setBusyItemId] = useState(null);
  const [resettingQueue, setResettingQueue] = useState(false);
  const [isFullQueueOpen, setIsFullQueueOpen] = useState(false);
  const [queueToast, setQueueToast] = useState('');

  const reqSeqRef = useRef(0);
  const hasLoadedRef = useRef(false);
  const syncedCenterNameRef = useRef(false);
  const mountedRef = useRef(true);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToastMessage = useCallback((msg) => {
    if (!msg) return;
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setQueueToast(msg);
    toastTimerRef.current = setTimeout(() => {
      if (mountedRef.current) setQueueToast('');
    }, 3200);
  }, []);

  const fetchDashboard = useCallback(
    async ({ silent = false } = {}) => {
      if (!isAuthorizedCenter) return;

      const seq = ++reqSeqRef.current;
      if (silent || hasLoadedRef.current) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      try {
        const res = await centerApi.dashboard.get({
          branch_id: branchId,
          period,
          queue_day: queueDay,
        });

        if (!mountedRef.current || seq !== reqSeqRef.current) return;

        if (res?.data) {
          hasLoadedRef.current = true;
          setDashboardData(res.data);
        } else {
          setError(
            isAr
              ? 'تعذر قراءة بيانات لوحة التحكم من الخادم.'
              : 'Unable to parse dashboard data from server.'
          );
        }
      } catch (err) {
        if (!mountedRef.current || seq !== reqSeqRef.current) return;
        setError(
          err?.message ||
            (isAr
              ? 'حدث خطأ أثناء تحميل بيانات لوحة تحكم السنتر.'
              : 'An error occurred while loading the center dashboard.')
        );
      } finally {
        if (mountedRef.current && seq === reqSeqRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [isAuthorizedCenter, branchId, period, queueDay, isAr]
  );

  useEffect(() => {
    if (!isAuthorizedCenter) return undefined;
    let active = true;
    Promise.resolve().then(() => {
      if (active) fetchDashboard();
    });
    return () => {
      active = false;
    };
  }, [isAuthorizedCenter, fetchDashboard]);

  // Auto-sync center name once if legacy account recorded manager name in center_profiles while client metadata holds the actual center name
  const legacySavedCenterName = String(currentUser?.center || '').trim();
  const backendCenterNameAr = String(dashboardData?.center?.nameAr || '').trim();
  const userPersonalName = String(currentUser?.name || '').trim();

  useEffect(() => {
    if (
      !isAuthorizedCenter ||
      !dashboardData?.center ||
      syncedCenterNameRef.current ||
      !legacySavedCenterName ||
      legacySavedCenterName === 'HQ Cairo' ||
      legacySavedCenterName === userPersonalName ||
      backendCenterNameAr !== userPersonalName
    ) {
      return undefined;
    }

    syncedCenterNameRef.current = true;
    let active = true;

    Promise.resolve().then(async () => {
      try {
        await centerApi.settings.update({
          name_ar: legacySavedCenterName,
          name_en: legacySavedCenterName,
        });
        if (!active || !mountedRef.current) return;
        await fetchDashboard({ silent: true });
        await refreshUser?.();
      } catch {
        // Ignore silent sync error; user can rename inline
      }
    });

    return () => {
      active = false;
    };
  }, [
    isAuthorizedCenter,
    dashboardData,
    legacySavedCenterName,
    backendCenterNameAr,
    userPersonalName,
    fetchDashboard,
    refreshUser,
  ]);

  const handleRenameCenter = useCallback(
    async (newCenterName) => {
      const trimmed = String(newCenterName || '').trim();
      if (trimmed.length < 2) return false;
      setError('');
      try {
        await centerApi.settings.update({
          name_ar: trimmed,
          name_en: trimmed,
        });
        await fetchDashboard({ silent: true });
        await refreshUser?.();
        if (mountedRef.current) {
          showToastMessage(
            isAr
              ? `تم تحديث اسم السنتر إلى «${trimmed}»`
              : `Center name updated to "${trimmed}"`
          );
        }
        return true;
      } catch (err) {
        if (mountedRef.current) {
          setError(
            err?.message ||
              (isAr ? 'تعذر تحديث اسم السنتر.' : 'Failed to update center name.')
          );
        }
        return false;
      }
    },
    [fetchDashboard, refreshUser, isAr, showToastMessage]
  );

  const handleCompleteQueueItem = useCallback(
    async (item) => {
      if (!item?.groupId || !item?.slotId || busyItemId) return;
      setBusyItemId(item.uniqueId);
      setError('');
      try {
        await centerApi.dashboard.completeQueueItem({
          group_id: item.groupId,
          slot_id: item.slotId,
        });
        await fetchDashboard({ silent: true });
        if (mountedRef.current) {
          const title = isAr ? item.groupNameAr : item.groupNameEn || item.groupNameAr;
          showToastMessage(
            isAr
              ? `تم إتمام حصة «${title}» وتحديث طابور اليوم`
              : `Completed "${title}" and updated daily queue`
          );
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(
            err?.message ||
              (isAr ? 'تعذر تحديث حالة المجموعة في الطابور.' : 'Failed to complete queue session.')
          );
        }
      } finally {
        if (mountedRef.current) setBusyItemId(null);
      }
    },
    [busyItemId, fetchDashboard, isAr, showToastMessage]
  );

  const handleRestoreQueueItem = useCallback(
    async (item) => {
      if (!item?.groupId || !item?.slotId || busyItemId) return;
      setBusyItemId(item.uniqueId);
      setError('');
      try {
        await centerApi.dashboard.restoreQueueItem({
          group_id: item.groupId,
          slot_id: item.slotId,
        });
        await fetchDashboard({ silent: true });
        if (mountedRef.current) {
          const title = isAr ? item.groupNameAr : item.groupNameEn || item.groupNameAr;
          showToastMessage(
            isAr ? `تمت إعادة «${title}» إلى طابور اليوم` : `Restored "${title}" to queue`
          );
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(
            err?.message ||
              (isAr ? 'تعذر استعادة المجموعة إلى الطابور.' : 'Failed to restore queue item.')
          );
        }
      } finally {
        if (mountedRef.current) setBusyItemId(null);
      }
    },
    [busyItemId, fetchDashboard, isAr, showToastMessage]
  );

  const handleResetQueue = useCallback(async () => {
    if (resettingQueue) return;
    setResettingQueue(true);
    setError('');
    try {
      await centerApi.dashboard.resetQueue({ day: queueDay });
      await fetchDashboard({ silent: true });
      if (mountedRef.current) {
        showToastMessage(
          isAr ? 'تمت إعادة تهيئة طابور اليوم بنجاح' : 'Daily queue reset successfully'
        );
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(
          err?.message || (isAr ? 'تعذر تصفير طابور اليوم.' : 'Failed to reset daily queue.')
        );
      }
    } finally {
      if (mountedRef.current) setResettingQueue(false);
    }
  }, [resettingQueue, queueDay, fetchDashboard, isAr, showToastMessage]);

  const handleOpenGroup = useCallback(
    (groupId) => {
      if (groupId) navigate(`/center/groups/${groupId}`);
    },
    [navigate]
  );

  if (authLoading) {
    return <CenterDashboardSkeleton />;
  }

  if (!isAuthenticated || !hasActiveToken || currentUser?.role !== 'center') {
    return <Navigate to="/login" replace />;
  }

  if (loading && !dashboardData) {
    return <CenterDashboardSkeleton />;
  }

  const centerInfo = dashboardData?.center || {};
  const branches = Array.isArray(dashboardData?.branches) ? dashboardData.branches : [];
  const kpis = dashboardData?.kpis || {};
  const weeklyAttendance = dashboardData?.weeklyAttendance || {};
  const hallOccupancy = dashboardData?.hallOccupancy || {};
  const liveQueue = dashboardData?.liveQueue || {};

  return (
    <div
      className="center-dashboard-container executive-dashboard"
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{ fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)' }}
    >
      {error && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.35)',
            color: 'var(--danger, #DC2626)',
            fontSize: '13px',
            fontWeight: '700',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </span>
          <button
            type="button"
            onClick={() => fetchDashboard({ silent: Boolean(dashboardData) })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid currentColor',
              backgroundColor: 'transparent',
              color: 'inherit',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} />
            <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
        </div>
      )}

      <CenterDashboardHeader
        center={centerInfo}
        managerName={centerInfo.managerName || currentUser?.name || ''}
        onRenameCenter={handleRenameCenter}
        branches={branches}
        selectedBranchId={branchId}
        onSelectBranch={setBranchId}
        period={period}
        onSelectPeriod={setPeriod}
        refreshing={refreshing}
        onRefresh={() => fetchDashboard({ silent: true })}
        isAr={isAr}
        isRtl={isRtl}
        isDark={isDark}
        themeAccent={themeAccent}
      />

      <CenterKpiCards
        kpis={kpis}
        period={period}
        isAr={isAr}
        onNavigate={navigate}
      />

      <div className="executive-charts-grid">
        <CenterAttendanceChart
          weeklyAttendance={weeklyAttendance}
          isAr={isAr}
          isDark={isDark}
          themeAccent={themeAccent}
        />

        <CenterHallOccupancyCard
          hallOccupancy={hallOccupancy}
          isAr={isAr}
          isRtl={isRtl}
          isDark={isDark}
          themeAccent={themeAccent}
        />
      </div>

      <CenterLiveQueueSection
        liveQueue={liveQueue}
        queueDay={queueDay}
        onChangeQueueDay={setQueueDay}
        onCompleteItem={handleCompleteQueueItem}
        onResetQueue={handleResetQueue}
        busyItemId={busyItemId}
        resetting={resettingQueue}
        onOpenFullQueue={() => setIsFullQueueOpen(true)}
        onOpenGroup={handleOpenGroup}
        isAr={isAr}
        isDark={isDark}
        themeAccent={themeAccent}
      />

      <CenterFullQueueModal
        isOpen={isFullQueueOpen}
        onClose={() => setIsFullQueueOpen(false)}
        liveQueue={liveQueue}
        onCompleteItem={handleCompleteQueueItem}
        onRestoreItem={handleRestoreQueueItem}
        onResetQueue={handleResetQueue}
        busyItemId={busyItemId}
        resetting={resettingQueue}
        onOpenGroup={handleOpenGroup}
        isAr={isAr}
        isRtl={isRtl}
        isDark={isDark}
        themeAccent={themeAccent}
      />

      {queueToast && (
        <div
          role="status"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: isRtl ? '24px' : 'auto',
            right: isRtl ? 'auto' : '24px',
            zIndex: 100000,
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(56, 189, 248, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: '800',
          }}
        >
          <Sparkles size={16} style={{ color: '#38BDF8' }} />
          <span>{queueToast}</span>
        </div>
      )}
    </div>
  );
};
