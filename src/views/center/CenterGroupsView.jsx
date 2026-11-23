import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCenter } from '../../context/CenterContext';
import { useGroups } from '../../context/GroupsContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  CenterAddStudentModal,
  CenterCohortFormModal,
  CenterDeleteCohortModal,
  CenterGroupDetailSection,
  CenterGroupsListSection,
  CenterStudentCardModal,
} from '../../features/center/groups';

export const CenterGroupsView = () => {
  const navigate = useNavigate();
  const { groupId: routeGroupId } = useParams();
  const { authLoading, isAuthenticated, hasActiveToken, currentUser } = useAuth();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const {
    isBackendCenter,
    branches = [],
    rooms = [],
    centerTeachers = [],
    centerSettings,
    checkScheduleConflict,
    loadCoreCenterData,
  } = useCenter();

  const {
    groups = [],
    groupsMeta,
    loadingGroups,
    groupsError,
    refreshGroups,
    addGroup,
    updateGroup,
    deleteGroup,
    regenerateGroupJoinCode,
    enrolledStudents = {},
    pendingStudents = {},
    loadingRoster,
    fetchGroupRoster,
    enrollStudentDirectly,
    acceptPendingStudent,
    rejectPendingStudent,
    removeStudentFromGroup,
    updateStudentPayment,
    toggleStudentAttendance,
    recordStudentAttendanceByCode,
    showToast,
  } = useGroups();

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const [isAddCohortOpen, setIsAddCohortOpen] = useState(false);
  const [editingCohort, setEditingCohort] = useState(null);
  const [deleteConfirmCohort, setDeleteConfirmCohort] = useState(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [studentCardModal, setStudentCardModal] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!routeGroupId || !fetchGroupRoster) return undefined;
    let active = true;
    Promise.resolve().then(() => {
      if (active) fetchGroupRoster(routeGroupId);
    });
    return () => {
      active = false;
    };
  }, [routeGroupId, fetchGroupRoster]);

  const handleOpenGroupStudents = useCallback(
    (groupId) => {
      if (!groupId) return;
      navigate(`/center/groups/${groupId}`);
    },
    [navigate]
  );

  const handleBackToGroups = useCallback(() => {
    navigate('/center/groups');
  }, [navigate]);

  const handleOpenAddCohort = useCallback(() => {
    setEditingCohort(null);
    setIsAddCohortOpen(true);
  }, []);

  const handleOpenEditCohort = useCallback((cohort, e) => {
    if (e) e.stopPropagation();
    setEditingCohort(cohort);
    setIsAddCohortOpen(true);
  }, []);

  const handleSaveCohort = useCallback(
    async (cohortPayload) => {
      if (editingCohort) {
        await updateGroup(editingCohort.id, cohortPayload);
        setEditingCohort(null);
        setIsAddCohortOpen(false);
      } else {
        const created = await addGroup(cohortPayload);
        setIsAddCohortOpen(false);
        if (created?.id) {
          navigate(`/center/groups/${created.id}`);
        }
      }
    },
    [editingCohort, updateGroup, addGroup, navigate]
  );

  const handleConfirmDeleteCohort = useCallback(async () => {
    if (!deleteConfirmCohort) return;
    const deletedId = deleteConfirmCohort.id;
    await deleteGroup(deletedId);
    setDeleteConfirmCohort(null);
    if (routeGroupId === deletedId) {
      navigate('/center/groups');
    }
  }, [deleteConfirmCohort, deleteGroup, routeGroupId, navigate]);

  const handleEnrollExisting = useCallback(
    async (student) => {
      if (!routeGroupId) return;
      const res = await enrollStudentDirectly(routeGroupId, student);
      if (res?.success) {
        setIsAddStudentOpen(false);
      }
    },
    [routeGroupId, enrollStudentDirectly]
  );

  const handleEnrollManual = useCallback(
    async (studentPayload) => {
      if (!routeGroupId) return;
      const res = await enrollStudentDirectly(routeGroupId, studentPayload);
      if (res?.success) {
        setIsAddStudentOpen(false);
      }
    },
    [routeGroupId, enrollStudentDirectly]
  );

  const handleRefreshAll = useCallback(async () => {
    await Promise.all([
      refreshGroups?.(),
      loadCoreCenterData?.({ force: true }),
      routeGroupId ? fetchGroupRoster?.(routeGroupId) : Promise.resolve(),
    ]);
  }, [refreshGroups, loadCoreCenterData, routeGroupId, fetchGroupRoster]);

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

  const activeGroup = routeGroupId
    ? groups.find((g) => g.id === routeGroupId) || null
    : null;
  const activeGroupStudents = activeGroup ? enrolledStudents[activeGroup.id] || [] : [];
  const activeGroupPending = activeGroup ? pendingStudents[activeGroup.id] || [] : [];

  return (
    <div
      className="center-dashboard-container executive-dashboard"
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{ fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)' }}
    >
      {groupsError && (
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
            <span>{groupsError}</span>
          </span>
          <button
            type="button"
            onClick={handleRefreshAll}
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

      {!routeGroupId ? (
        <CenterGroupsListSection
          groups={groups}
          groupsMeta={groupsMeta}
          enrolledStudents={enrolledStudents}
          pendingStudents={pendingStudents}
          branches={branches}
          rooms={rooms}
          centerNameAr={centerNameAr}
          loadingGroups={loadingGroups}
          onRefresh={handleRefreshAll}
          onOpenAddCohort={handleOpenAddCohort}
          onOpenEditCohort={handleOpenEditCohort}
          onDeleteCohort={setDeleteConfirmCohort}
          onOpenGroupStudents={handleOpenGroupStudents}
          onRegenerateJoinCode={regenerateGroupJoinCode}
          lang={lang}
          isRtl={isRtl}
        />
      ) : loadingGroups && !activeGroup ? (
        <div
          className="executive-skeleton"
          style={{ height: '420px', borderRadius: 'var(--radius-xl)' }}
        />
      ) : !activeGroup ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '44px 24px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 8px' }}>
            {isAr ? 'المجموعة المطلوبة غير موجودة أو تم حذفها' : 'Cohort not found'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
            {isAr
              ? 'يمكنك العودة إلى دليل المجموعات لاختيار مجموعة أخرى أو إنشاء مجموعة جديدة.'
              : 'Return to the cohorts catalog to select or create a cohort.'}
          </p>
          <button
            type="button"
            onClick={handleBackToGroups}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            {isRtl ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
            <span>{isAr ? 'العودة إلى قائمة المجموعات' : 'Back to Cohorts'}</span>
          </button>
        </div>
      ) : (
        <CenterGroupDetailSection
          activeGroup={activeGroup}
          groups={groups}
          rooms={rooms}
          activeGroupStudents={activeGroupStudents}
          pendingStudentsList={activeGroupPending}
          loadingRoster={loadingRoster}
          isMobile={isMobile}
          onBackToGroups={handleBackToGroups}
          onSelectGroup={handleOpenGroupStudents}
          onEditCohort={handleOpenEditCohort}
          onDeleteCohort={setDeleteConfirmCohort}
          onRegenerateJoinCode={regenerateGroupJoinCode}
          onOpenAddStudent={() => setIsAddStudentOpen(true)}
          onOpenStudentCard={setStudentCardModal}
          onToggleAttendance={toggleStudentAttendance}
          onScanCode={recordStudentAttendanceByCode}
          onAcceptPending={acceptPendingStudent}
          onRejectPending={rejectPendingStudent}
          onRemoveStudent={removeStudentFromGroup}
          onUpdatePayment={updateStudentPayment}
          showToast={showToast}
          lang={lang}
          isRtl={isRtl}
        />
      )}

      {isAddCohortOpen && (
        <CenterCohortFormModal
          key={editingCohort?.id || 'create-cohort'}
          isOpen={isAddCohortOpen}
          editingCohort={editingCohort}
          onClose={() => {
            setIsAddCohortOpen(false);
            setEditingCohort(null);
          }}
          onSave={handleSaveCohort}
          branches={branches}
          rooms={rooms}
          centerTeachers={centerTeachers}
          checkScheduleConflict={checkScheduleConflict}
          lang={lang}
        />
      )}

      {deleteConfirmCohort && (
        <CenterDeleteCohortModal
          cohort={deleteConfirmCohort}
          enrolledCount={
            enrolledStudents[deleteConfirmCohort.id]?.length ??
            deleteConfirmCohort.enrolledCount ??
            0
          }
          onConfirm={handleConfirmDeleteCohort}
          onCancel={() => setDeleteConfirmCohort(null)}
          lang={lang}
        />
      )}

      {isAddStudentOpen && activeGroup && (
        <CenterAddStudentModal
          key={activeGroup.id}
          isOpen={isAddStudentOpen}
          onClose={() => setIsAddStudentOpen(false)}
          activeGroup={activeGroup}
          activeGroupStudents={activeGroupStudents}
          activeGroupPending={activeGroupPending}
          onEnrollExisting={handleEnrollExisting}
          onEnrollManual={handleEnrollManual}
          isBackendCenter={isBackendCenter}
          lang={lang}
        />
      )}

      {studentCardModal && (
        <CenterStudentCardModal
          key={studentCardModal.id || studentCardModal.enrollmentId}
          student={studentCardModal}
          activeGroup={activeGroup}
          centerNameAr={centerNameAr}
          onClose={() => setStudentCardModal(null)}
          isBackendCenter={isBackendCenter}
          lang={lang}
        />
      )}
    </div>
  );
};
