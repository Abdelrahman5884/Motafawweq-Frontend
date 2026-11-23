import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Activity,
  Building2,
  Download,
  FileText,
  GraduationCap,
  Layers,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCenter } from '../../context/CenterContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  CenterAuditLogSection,
  CenterBranchesSection,
  CenterExecutiveReportModal,
  CenterStaffSection,
  CenterTeachersNetworkSection,
} from '../../features/center/operations';
import { centerApi } from '../../services/centerApi';

export const CenterOperationsView = () => {
  const navigate = useNavigate();
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

  const [activeTab, setActiveTab] = useState('branches'); // 'branches' | 'teachers' | 'staff' | 'audit'
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  useEffect(() => {
    loadOperationsData?.();
  }, [loadOperationsData]);

  const handleRefreshAll = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await Promise.all([
        loadCoreCenterData?.(),
        loadOperationsData?.(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, loadCoreCenterData, loadOperationsData]);

  const handleAddBranch = useCallback(
    async (payload) => {
      await addBranch(payload);
      showToast(`تم إنشاء وتدشين الفرع «${payload.nameAr}» بنجاح!`);
    },
    [addBranch, showToast]
  );

  const handleUpdateBranch = useCallback(
    async (branchId, payload) => {
      await updateBranch(branchId, payload);
      showToast(`تم تحديث بيانات الفرع «${payload.nameAr}» بنجاح!`);
    },
    [updateBranch, showToast]
  );

  const handleDeleteBranch = useCallback(
    async (branch) => {
      await deleteBranch(branch.id);
      showToast(`تم حذف الفرع «${branch.nameAr}».`);
    },
    [deleteBranch, showToast]
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
      if (res?.teacher?.activationLink) {
        navigator.clipboard?.writeText?.(res.teacher.activationLink).catch(() => {});
      }
      showToast(
        `تمت إضافة المعلم «${payload.nameAr}» ونسخ رابط التفعيل لمنصة متفوّق بنجاح!`
      );
    },
    [addCenterTeacher, showToast]
  );

  const handleUpdateTeacher = useCallback(
    async (teacherId, payload) => {
      await updateCenterTeacher(teacherId, payload);
      showToast(`تم حفظ تعديلات المعلم «${payload.nameAr}» بنجاح!`);
    },
    [updateCenterTeacher, showToast]
  );

  const handleDeleteTeacher = useCallback(
    async (teacher) => {
      await deleteCenterTeacher(teacher.id);
      showToast(`تم حذف وفك اعتماد المعلم «${teacher.nameAr}» من السنتر.`);
    },
    [deleteCenterTeacher, showToast]
  );

  const handleResendTeacherInvite = useCallback(
    async (tch) => {
      const res = await resendTeacherInvite(tch.id);
      const link = res?.link || tch.activationLink || '';
      if (link) {
        navigator.clipboard?.writeText?.(link).catch(() => {});
      }
      showToast(`تم تجديد ونسخ رابط تفعيل المنصة للمعلم «${tch.nameAr}»!`);
    },
    [resendTeacherInvite, showToast]
  );

  const handleDisconnectUser = useCallback(
    async (conn) => {
      await disconnectUserFromCenter(conn.id);
      showToast(`تم فك ربط حساب «${conn.nameAr}» من السنتر.`);
    },
    [disconnectUserFromCenter, showToast]
  );

  const handleAddStaff = useCallback(
    async (payload) => {
      await addStaff(payload);
      showToast(`تم تعيين الموظف «${payload.nameAr}» بنجاح!`);
    },
    [addStaff, showToast]
  );

  const handleUpdateStaff = useCallback(
    async (staffId, payload) => {
      await updateStaff(staffId, payload);
      showToast(`تم تحديث بيانات وصلاحيات الموظف «${payload.nameAr}» بنجاح!`);
    },
    [updateStaff, showToast]
  );

  const handleDeleteStaff = useCallback(
    async (member) => {
      await deleteStaff(member.id);
      showToast(`تم إلغاء تعيين الموظف «${member.nameAr}».`);
    },
    [deleteStaff, showToast]
  );

  const handleExportBranchesCsv = useCallback(async () => {
    if (isBackendCenter) {
      try {
        await centerApi.branches.exportCsv('مقارنة_فروع_السنتر_التشغيلية.csv');
        showToast('تم تحميل ملف مقارنة الفروع بنجاح!');
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
      const rCount = rooms.filter((r) => String(r.branchId) === String(b.id)).length || Number(b.roomsCount ?? 0);
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
  }, [isBackendCenter, branches, rooms, centerTeachers, exportToCsv, showToast]);

  if (authLoading) {
    return (
      <div className="center-dashboard-container executive-dashboard" aria-busy="true">
        <div
          className="executive-skeleton"
          style={{ height: '96px', borderRadius: 'var(--radius-xl)' }}
        />
        <div
          className="executive-skeleton"
          style={{ height: '380px', borderRadius: 'var(--radius-xl)' }}
        />
      </div>
    );
  }

  if (!isAuthenticated || !hasActiveToken || currentUser?.role !== 'center') {
    return <Navigate to="/login" replace />;
  }

  const centerNameAr =
    centerSettings?.nameAr ||
    currentUser?.centerNameAr ||
    currentUser?.center ||
    (isAr ? 'السنتر التعليمي' : 'Educational Center');

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '24px 20px 80px',
        fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '22px',
          backgroundColor: 'var(--bg-surface)',
          padding: '18px 24px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(21, 136, 199, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
            }}
          >
            <Layers size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: 'var(--primary)',
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                }}
              >
                {isAr ? 'العمليات والانتشار وشبكة المعلمين' : 'Operations & Teachers Network'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: 'var(--success, #10B981)',
                  fontWeight: '800',
                }}
              >
                {branches.length} {isAr ? 'فروع نشطة' : 'Branches'} • {centerTeachers.length}{' '}
                {isAr ? 'معلمين معتمدين' : 'Teachers'}
              </span>
            </div>
            <h1 style={{ fontSize: '21px', fontWeight: '900', color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
              {isAr
                ? 'مقارنة وإدارة الفروع، وشبكة المعلمين المعتمدين'
                : 'Branches Management & Certified Teachers Network'}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleRefreshAll}
            disabled={refreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: refreshing ? 'wait' : 'pointer',
            }}
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            <span>{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 15px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(21, 136, 199, 0.1)',
              color: 'var(--primary)',
              border: '1px solid rgba(21, 136, 199, 0.25)',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <FileText size={16} />
            <span>{isAr ? 'التقرير الإداري التنفيذي' : 'Executive Report'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportBranchesCsv}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 15px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Download size={16} />
            <span>{isAr ? 'تصدير Excel' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '22px',
          gap: '24px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        {[
          {
            id: 'branches',
            labelAr: 'مقارنة وإدارة الفروع',
            labelEn: 'Branch Benchmarks & Management',
            icon: Building2,
          },
          {
            id: 'teachers',
            labelAr: 'شبكة وإدارة المعلمين والربط بالمنصة',
            labelEn: 'Teachers Network & Connect',
            icon: GraduationCap,
          },
          {
            id: 'staff',
            labelAr: 'إدارة الموظفين والصلاحيات',
            labelEn: 'Staff & Roles',
            icon: ShieldCheck,
          },
          {
            id: 'audit',
            labelAr: 'سجل العمليات والأمان (Audit Log)',
            labelEn: 'Audit Trail',
            icon: Activity,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 4px',
                border: 'none',
                background: 'none',
                fontSize: '14px',
                fontWeight: '800',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
              <span>{isAr ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
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
            right: isRtl ? '24px' : 'auto',
            left: isRtl ? 'auto' : '24px',
            zIndex: 100000,
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(21, 136, 199, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: '700',
          }}
        >
          <Sparkles size={16} style={{ color: '#38BDF8' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
