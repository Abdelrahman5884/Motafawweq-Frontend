import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Activity,
  Building2,
  Clock,
  DoorOpen,
  Download,
  FileText,
  GraduationCap,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCenter } from '../../context/CenterContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { SButton, SPage, SPageHeader, SSkeleton } from '../../components/student/ui';
import {
  CenterAuditLogSection,
  CenterBranchesSection,
  CenterExecutiveReportModal,
  CenterStaffSection,
  CenterTeachersNetworkSection,
} from '../../features/center/operations';
import '../../features/center/operations/operations.css';
import { centerApi } from '../../services/centerApi';

const VALID_TABS = ['branches', 'teachers', 'staff', 'audit'];

export const CenterOperationsView = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { authLoading, isAuthenticated, hasActiveToken, currentUser } = useAuth();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const {
    isBackendCenter,
    loadCoreCenterData,
    loadOperationsData,
    branches = [],
    setSelectedBranchId,
    addBranch,
    updateBranch,
    deleteBranch,
    centerTeachers = [],
    addCenterTeacher,
    updateCenterTeacher,
    deleteCenterTeacher,
    resendTeacherInvite,
    rooms = [],
    staff = [],
    addStaff,
    updateStaff,
    deleteStaff,
    auditLogs = [],
    refreshAuditLogs,
    connectedUsers = [],
    searchGlobalUsers,
    searchGlobalUsersRemote,
    connectUserToCenter,
    disconnectUserFromCenter,
    centerSettings,
    executiveReport,
    fetchExecutiveReport,
    exportToCsv,
  } = useCenter();

  const rawTab = searchParams.get('tab');
  const activeTab = VALID_TABS.includes(rawTab) ? rawTab : 'branches';

  const setActiveTab = useCallback(
    (nextTab) => {
      if (nextTab === 'branches') {
        const next = new URLSearchParams(searchParams);
        next.delete('tab');
        setSearchParams(next, { replace: true });
      } else {
        setSearchParams({ tab: nextTab }, { replace: true });
      }
    },
    [searchParams, setSearchParams]
  );

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  useEffect(() => {
    if (!isBackendCenter) return;
    loadOperationsData();
  }, [isBackendCenter, loadOperationsData]);

  const handleRefreshAll = useCallback(async () => {
    if (!isBackendCenter || refreshing) return;
    setRefreshing(true);
    try {
      await Promise.all([loadCoreCenterData(), loadOperationsData()]);
      showToast(isAr ? 'تم تحديث بيانات الفروع والمعلمين بنجاح.' : 'Operations data refreshed.');
    } finally {
      setRefreshing(false);
    }
  }, [isBackendCenter, refreshing, loadCoreCenterData, loadOperationsData, showToast, isAr]);

  const handleAddBranch = useCallback(
    async (payload) => {
      await addBranch(payload);
      showToast(
        isAr
          ? `تم تدشين فرع «${payload.nameAr}» بنجاح!`
          : `Branch "${payload.nameAr}" created successfully!`
      );
    },
    [addBranch, showToast, isAr]
  );

  const handleUpdateBranch = useCallback(
    async (branchId, payload) => {
      await updateBranch(branchId, payload);
      showToast(
        isAr
          ? `تم حفظ تعديلات فرع «${payload.nameAr}» بنجاح!`
          : `Branch "${payload.nameAr}" updated.`
      );
    },
    [updateBranch, showToast, isAr]
  );

  const handleDeleteBranch = useCallback(
    async (branch) => {
      await deleteBranch(branch.id);
      showToast(isAr ? `تم حذف الفرع «${branch.nameAr}».` : `Branch "${branch.nameAr}" deleted.`);
    },
    [deleteBranch, showToast, isAr]
  );

  const handleOpenBranchHalls = useCallback(
    (branch) => {
      if (branch?.id && setSelectedBranchId) {
        setSelectedBranchId(branch.id);
      }
      navigate('/center/halls');
    },
    [setSelectedBranchId, navigate]
  );

  const handleAddTeacher = useCallback(
    async (payload) => {
      const res = await addCenterTeacher(payload);
      const created = res?.teacher;
      if (created?.awaitingTeacherApproval) {
        showToast(
          isAr
            ? `تم إرسال دعوة انضمام رسمية للمعلم «${payload.nameAr}» — سيُعتمد تلقائياً فور موافقته من حسابه.`
            : `Invitation sent to "${payload.nameAr}". Waiting for teacher approval.`
        );
        return;
      }
      if (created?.activationLink) {
        navigator.clipboard?.writeText?.(created.activationLink).catch(() => {});
      }
      showToast(
        isAr
          ? `تمت إضافة المعلم «${payload.nameAr}» ونسخ رابط التفعيل بنجاح!`
          : `Teacher "${payload.nameAr}" added and invite link copied!`
      );
    },
    [addCenterTeacher, showToast, isAr]
  );

  const handleUpdateTeacher = useCallback(
    async (teacherId, payload) => {
      await updateCenterTeacher(teacherId, payload);
      showToast(
        isAr
          ? `تم حفظ تعديلات المعلم «${payload.nameAr}» بنجاح!`
          : `Teacher "${payload.nameAr}" updated.`
      );
    },
    [updateCenterTeacher, showToast, isAr]
  );

  const handleDeleteTeacher = useCallback(
    async (teacher) => {
      await deleteCenterTeacher(teacher.id);
      showToast(
        isAr
          ? `تم حذف المعلم «${teacher.nameAr}» من شبكة السنتر.`
          : `Teacher "${teacher.nameAr}" removed.`
      );
    },
    [deleteCenterTeacher, showToast, isAr]
  );

  const handleResendTeacherInvite = useCallback(
    async (tch) => {
      const res = await resendTeacherInvite(tch.id);
      if (!res?.success) return;

      if (tch.isPlatformLinked) {
        showToast(
          isAr
            ? `تم إعادة إرسال دعوة الانضمام لحساب المعلم «${tch.nameAr}» على منصة متفوّق.`
            : `Platform invitation re-sent to "${tch.nameAr}".`
        );
        return;
      }

      const link = res?.link || tch.activationLink || '';
      if (link) {
        navigator.clipboard?.writeText?.(link).catch(() => {});
      }
      showToast(
        isAr
          ? `تم تجديد ونسخ رابط التفعيل للمعلم «${tch.nameAr}»!`
          : `Invite link regenerated & copied for "${tch.nameAr}".`
      );
    },
    [resendTeacherInvite, showToast, isAr]
  );

  const handleDisconnectUser = useCallback(
    async (conn) => {
      await disconnectUserFromCenter(conn.id);
      showToast(
        isAr
          ? conn.status === 'pending'
            ? `تم إلغاء دعوة «${conn.nameAr}».`
            : `تم فك ربط حساب «${conn.nameAr}» من السنتر.`
          : `Disconnected "${conn.nameAr}".`
      );
    },
    [disconnectUserFromCenter, showToast, isAr]
  );

  const handleAddStaff = useCallback(
    async (payload) => {
      await addStaff(payload);
      showToast(isAr ? `تم تعيين الموظف «${payload.nameAr}» بنجاح!` : `Staff "${payload.nameAr}" added.`);
    },
    [addStaff, showToast, isAr]
  );

  const handleUpdateStaff = useCallback(
    async (staffId, payload) => {
      await updateStaff(staffId, payload);
      showToast(
        isAr
          ? `تم تحديث بيانات وصلاحيات «${payload.nameAr}» بنجاح!`
          : `Staff "${payload.nameAr}" updated.`
      );
    },
    [updateStaff, showToast, isAr]
  );

  const handleDeleteStaff = useCallback(
    async (member) => {
      await deleteStaff(member.id);
      showToast(isAr ? `تم حذف الموظف «${member.nameAr}».` : `Staff "${member.nameAr}" removed.`);
    },
    [deleteStaff, showToast, isAr]
  );

  const handleExportBranchesCsv = useCallback(async () => {
    if (isBackendCenter) {
      try {
        await centerApi.branches.exportCsv('مقارنة_فروع_السنتر_التشغيلية.csv');
        showToast(isAr ? 'تم تحميل ملف مقارنة الفروع بنجاح!' : 'Branches CSV downloaded!');
        return;
      } catch {
        // fallback to client export
      }
    }
    const headers = [
      'اسم الفرع',
      'العنوان',
      'المدير',
      'الهاتف',
      'عدد القاعات',
      'عدد الطلاب',
      'عدد المدرسين',
      'نسبة الإشغال',
    ];
    const rows = branches.map((b) => {
      const rCount =
        rooms.filter((r) => String(r.branchId) === String(b.id)).length ||
        Number(b.roomsCount ?? 0);
      const tCount =
        centerTeachers.filter((t) => String(t.branchId) === String(b.id)).length ||
        Number(b.teachersCount ?? 0);
      return [
        b.nameAr,
        b.addressAr || '',
        b.managerNameAr || '',
        b.phone || '',
        rCount,
        Number(b.activeStudents ?? 0),
        tCount,
        `${Number(b.utilizationRate ?? 0)}%`,
      ];
    });
    exportToCsv('مقارنة_فروع_السنتر_التشغيلية', headers, rows);
  }, [isBackendCenter, branches, rooms, centerTeachers, exportToCsv, showToast, isAr]);

  const metrics = useMemo(() => {
    const activeTeachers = centerTeachers.filter((t) => t.status === 'active').length;
    const pendingTeachers = centerTeachers.filter(
      (t) => t.status === 'invited' && t.isPlatformLinked
    ).length;
    const totalCapacity = rooms.reduce((sum, r) => sum + (Number(r.capacity) || 0), 0);
    return {
      branchesCount: branches.length,
      activeTeachers,
      pendingTeachers,
      roomsCount: rooms.length,
      totalCapacity,
      staffCount: staff.length,
    };
  }, [branches.length, centerTeachers, rooms, staff.length]);

  const tabs = useMemo(
    () => [
      {
        id: 'branches',
        labelAr: 'الفروع',
        labelEn: 'Branches',
        icon: Building2,
        count: metrics.branchesCount,
      },
      {
        id: 'teachers',
        labelAr: 'شبكة المعلمين',
        labelEn: 'Teachers Network',
        icon: GraduationCap,
        count: centerTeachers.length,
        pendingCount: metrics.pendingTeachers,
      },
      {
        id: 'staff',
        labelAr: 'الموظفون والصلاحيات',
        labelEn: 'Staff & Roles',
        icon: ShieldCheck,
        count: metrics.staffCount,
      },
      {
        id: 'audit',
        labelAr: 'سجل العمليات',
        labelEn: 'Audit Log',
        icon: Activity,
        count: auditLogs.length,
      },
    ],
    [metrics, centerTeachers.length, auditLogs.length]
  );

  const activeTabMeta = tabs.find((t) => t.id === activeTab);
  const breadcrumbs = useMemo(
    () =>
      activeTab !== 'branches' && activeTabMeta
        ? [
            {
              labelAr: activeTabMeta.labelAr,
              labelEn: activeTabMeta.labelEn,
              onClick: () => setActiveTab('branches'),
            },
          ]
        : [],
    [activeTab, activeTabMeta, setActiveTab]
  );
  useSetBreadcrumbs(breadcrumbs);

  if (authLoading) {
    return (
      <SPage maxWidth={1240}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SSkeleton height={88} radius={16} />
          <div className="co-kpi-grid">
            {[1, 2, 3, 4].map((i) => (
              <SSkeleton key={i} height={82} radius={16} />
            ))}
          </div>
          <SSkeleton height={340} radius={16} />
        </div>
      </SPage>
    );
  }

  if (!isAuthenticated || !hasActiveToken || currentUser?.role !== 'center') {
    return <Navigate to="/login" replace />;
  }

  const centerNameAr =
    centerSettings?.nameAr ||
    centerSettings?.centerNameAr ||
    currentUser?.centerNameAr ||
    currentUser?.center ||
    (isAr ? 'السنتر التعليمي' : 'Educational Center');

  return (
    <SPage maxWidth={1240}>
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          paddingBottom: '48px',
          fontFamily: isRtl
            ? 'var(--font-arabic), "Cairo", system-ui, sans-serif'
            : 'var(--font-heading), "Outfit", sans-serif',
        }}
      >
        {/* ── 1. Unified Page Header ── */}
        <SPageHeader
          title={isAr ? 'الفروع وشبكة المعلمين' : 'Branches & Teachers Network'}
          subtitle={
            isAr
              ? `إدارة فروع «${centerNameAr}»، دعوة واعتماد معلمي منصة متفوّق، وصلاحيات الفريق الإداري.`
              : `Manage branches, invite & approve Motafawweq teachers, and control staff roles.`
          }
          action={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <SButton
                variant="ghost"
                size="sm"
                icon={<RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />}
                onClick={handleRefreshAll}
                disabled={refreshing}
              >
                {isAr ? 'تحديث' : 'Refresh'}
              </SButton>

              <SButton
                variant="ghost"
                size="sm"
                icon={<FileText size={14} />}
                onClick={() => setIsReportModalOpen(true)}
              >
                {isAr ? 'التقرير التنفيذي' : 'Executive Report'}
              </SButton>

              <SButton
                variant="ghost"
                size="sm"
                icon={<Download size={14} />}
                onClick={handleExportBranchesCsv}
              >
                {isAr ? 'تصدير CSV' : 'Export CSV'}
              </SButton>
            </div>
          }
        />

        {/* ── 2. Live Overview KPI Strip ── */}
        <div className="co-kpi-grid">
          <div className="co-kpi-card">
            <div
              className="co-kpi-icon"
              style={{ backgroundColor: 'rgba(21, 136, 199, 0.12)', color: 'var(--primary)' }}
            >
              <Building2 size={21} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {isAr ? 'الفروع النشطة' : 'Active Branches'}
              </div>
              <div style={{ fontSize: '21px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '2px' }}>
                {metrics.branchesCount}
              </div>
            </div>
          </div>

          <div className="co-kpi-card">
            <div
              className="co-kpi-icon"
              style={{ backgroundColor: 'rgba(22, 163, 74, 0.12)', color: 'var(--success)' }}
            >
              <GraduationCap size={21} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {isAr ? 'المعلمون المعتمدون' : 'Active Teachers'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                <span style={{ fontSize: '21px', fontWeight: '900', color: 'var(--text-primary)' }}>
                  {metrics.activeTeachers}
                </span>
                {metrics.pendingTeachers > 0 && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(245, 158, 11, 0.14)',
                      color: '#B45309',
                    }}
                  >
                    <Clock size={11} />
                    <span>
                      +{metrics.pendingTeachers} {isAr ? 'بانتظار الموافقة' : 'pending'}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="co-kpi-card">
            <div
              className="co-kpi-icon"
              style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#7C3AED' }}
            >
              <DoorOpen size={21} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {isAr ? 'القاعات والسعة' : 'Rooms & Capacity'}
              </div>
              <div style={{ fontSize: '19px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '2px' }}>
                {metrics.roomsCount}{' '}
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {isAr ? `قاعة • ${metrics.totalCapacity} مقعد` : `rooms • ${metrics.totalCapacity} seats`}
                </span>
              </div>
            </div>
          </div>

          <div className="co-kpi-card">
            <div
              className="co-kpi-icon"
              style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#D97706' }}
            >
              <Users size={21} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {isAr ? 'الفريق الإداري' : 'Administrative Staff'}
              </div>
              <div style={{ fontSize: '21px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '2px' }}>
                {metrics.staffCount}
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Clean Underline Tabs ── */}
        <div role="tablist" className="co-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`co-tab-btn${isActive ? ' active' : ''}`}
              >
                <Icon size={16} />
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                {tab.count > 0 && <span className="co-tab-count">{tab.count}</span>}
                {tab.pendingCount > 0 && (
                  <span className="co-tab-count pending">
                    {tab.pendingCount} {isAr ? 'معلق' : 'pending'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── 4. Active Tab Content ── */}
        <div>
          {activeTab === 'branches' && (
            <CenterBranchesSection
              branches={branches}
              rooms={rooms}
              centerTeachers={centerTeachers}
              onAddBranch={handleAddBranch}
              onUpdateBranch={handleUpdateBranch}
              onDeleteBranch={handleDeleteBranch}
              onOpenBranchHalls={handleOpenBranchHalls}
              lang={lang}
            />
          )}

          {activeTab === 'teachers' && (
            <CenterTeachersNetworkSection
              centerTeachers={centerTeachers}
              branches={branches}
              connectedUsers={connectedUsers}
              searchGlobalUsers={searchGlobalUsers}
              searchGlobalUsersRemote={searchGlobalUsersRemote}
              onConnectUser={connectUserToCenter}
              onDisconnectUser={handleDisconnectUser}
              onAddTeacher={handleAddTeacher}
              onUpdateTeacher={handleUpdateTeacher}
              onDeleteTeacher={handleDeleteTeacher}
              onResendInvite={handleResendTeacherInvite}
              isBackendCenter={isBackendCenter}
              lang={lang}
              isRtl={isRtl}
            />
          )}

          {activeTab === 'staff' && (
            <CenterStaffSection
              staff={staff}
              branches={branches}
              onAddStaff={handleAddStaff}
              onUpdateStaff={handleUpdateStaff}
              onDeleteStaff={handleDeleteStaff}
              lang={lang}
              isRtl={isRtl}
            />
          )}

          {activeTab === 'audit' && (
            <CenterAuditLogSection
              auditLogs={auditLogs}
              onRefreshAuditLogs={refreshAuditLogs}
              lang={lang}
              isRtl={isRtl}
            />
          )}
        </div>

        {/* Executive Operational Report Modal */}
        <CenterExecutiveReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          centerNameAr={centerNameAr}
          branches={branches}
          rooms={rooms}
          centerTeachers={centerTeachers}
          staff={staff}
          executiveReport={executiveReport}
          fetchExecutiveReport={fetchExecutiveReport}
          isBackendCenter={isBackendCenter}
          lang={lang}
        />

        {/* Floating Toast */}
        {toastMessage && (
          <div
            role="status"
            aria-live="polite"
            style={{
              position: 'fixed',
              bottom: '24px',
              insetInlineStart: '24px',
              zIndex: 100000,
              backgroundColor: 'var(--color-brand-dark, #06254E)',
              color: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: '12px',
              boxShadow: '0 12px 30px rgba(6, 37, 78, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              fontWeight: '700',
              maxWidth: '460px',
            }}
          >
            <Sparkles size={16} style={{ color: '#5CB6DB', flexShrink: 0 }} />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </SPage>
  );
};

export default CenterOperationsView;
