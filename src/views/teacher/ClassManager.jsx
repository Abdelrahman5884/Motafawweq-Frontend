import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useGroups } from '../../context/GroupsContext';
import {
  Plus,
  Building2,
  AlertCircle,
  Calendar,
  Search,
  X,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { ClassCard, ClassQrModal, ClassFormModal } from '../../features/teacher/classes';
import { TeacherWeeklySchedule } from '../../features/teacher/schedule';

export const ClassManager = ({ defaultTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const {
    groups,
    loadingGroups,
    groupsError,
    refreshGroups,
    enrolledStudents,
    pendingStudents,
    addGroup,
    updateGroup,
    deleteGroup,
    setActiveGroupId,
    showToast,
  } = useGroups();

  const [isMobile, setIsMobile] = useState(
    () => (typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false)
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Derive activeTab directly from route/prop/query (URL is single source of truth)
  const activeTab =
    defaultTab === 'schedule' ||
    location.pathname.includes('/schedule') ||
    searchParams.get('tab') === 'schedule'
      ? 'schedule'
      : 'groups';

  const todayDayKey = useMemo(() => {
    const dayNum = new Date().getDay();
    const map = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return map[dayNum] || 'tuesday';
  }, []);

  const todaySessionsCount = useMemo(() => {
    return groups.reduce((acc, g) => {
      const slots = g.scheduleSlots || [];
      const matches = slots.filter((s) => s.day === todayDayKey);
      return acc + matches.length;
    }, 0);
  }, [groups, todayDayKey]);

  const centersList = useMemo(() => {
    const set = new Set();
    groups.forEach((g) => {
      if (g.centerName) set.add(g.centerName);
    });
    return Array.from(set);
  }, [groups]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCenter, setSelectedCenter] = useState('all');
  const [selectedClassForQr, setSelectedClassForQr] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deleteConfirmClass, setDeleteConfirmClass] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return groups.filter((g) => {
      if (selectedCenter !== 'all' && g.centerName !== selectedCenter) return false;
      if (!q) return true;
      return (
        String(g.nameAr || '').toLowerCase().includes(q) ||
        String(g.nameEn || '').toLowerCase().includes(q) ||
        String(g.subjectAr || '').toLowerCase().includes(q) ||
        String(g.gradeAr || '').toLowerCase().includes(q) ||
        String(g.centerName || '').toLowerCase().includes(q) ||
        String(g.hallName || '').toLowerCase().includes(q) ||
        String(g.joinCode || '').toLowerCase().includes(q)
      );
    });
  }, [groups, searchQuery, selectedCenter]);

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedCode(code);
    showToast?.(isAr ? `تم نسخ كود المجموعة: ${code}` : `Copied join code: ${code}`);
    window.setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenRoster = (cls) => {
    setActiveGroupId(cls.id);
    navigate('/teacher/students');
  };

  const handleSaveForm = async (formData) => {
    if (editingClass) {
      await updateGroup(editingClass.id, formData);
    } else {
      await addGroup(formData);
    }
    setFormModalOpen(false);
    setEditingClass(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmClass || isDeleting) return;
    setIsDeleting(true);
    setDeleteError('');
    const result = await deleteGroup(deleteConfirmClass.id);
    setIsDeleting(false);
    if (result?.success) {
      setDeleteConfirmClass(null);
    } else {
      setDeleteError(result?.error || (isAr ? 'تعذر حذف المجموعة.' : 'Failed to delete cohort.'));
    }
  };

  const getGroupEnrolledCount = (cls) =>
    Array.isArray(enrolledStudents[cls.id]) ? enrolledStudents[cls.id].length : Number(cls.enrolledCount ?? 0);

  const getGroupPendingCount = (cls) =>
    Array.isArray(pendingStudents[cls.id]) ? pendingStudents[cls.id].length : Number(cls.pendingCount ?? 0);

  return (
    <div
      style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: isMobile ? '16px 14px 64px' : '28px 24px 80px',
        fontFamily: 'var(--font-arabic)',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '22px',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
              letterSpacing: '-0.3px',
            }}
          >
            {activeTab === 'schedule'
              ? isAr
                ? 'جدول المواعيد والقاعات الأسبوعي'
                : 'Weekly Schedule & Halls'
              : isAr
                ? 'إدارة المجموعات والقاعات الدراسية'
                : 'Class & Hall Management'}
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            {activeTab === 'schedule'
              ? isAr
                ? 'تنظيم مواعيد الحصص الأسبوعية بالسناتر، متابعة جدول اليوم، وتدوين الملاحظات والتنبيهات السريعة'
                : 'Manage weekly center sessions, focus on today’s timetable, and keep quick daily notes'
              : isAr
                ? 'متابعة مواعيد القاعات، أكواد انضمام الطلاب، والباركود السريع وسجلات الحضور'
                : 'Monitor group schedules, join codes, fast QR invitations, and student rosters'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            disabled={loadingGroups}
            onClick={refreshGroups}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: loadingGroups ? 'wait' : 'pointer',
            }}
          >
            <RefreshCw size={14} className={loadingGroups ? 'animate-spin' : ''} />
            <span>{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingClass(null);
              setFormModalOpen(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-primary)',
            }}
          >
            <Plus size={16} />
            <span>{isAr ? 'إنشاء مجموعة جديدة' : 'Add New Cohort'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Cohorts vs Weekly Schedule) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '22px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '14px',
            border: '1px solid var(--border-subtle)',
            width: isMobile ? '100%' : 'fit-content',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/teacher/classes', { replace: true })}
            style={{
              flex: isMobile ? 1 : 'initial',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeTab === 'groups' ? '800' : '600',
              backgroundColor: activeTab === 'groups' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'groups' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === 'groups' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer',
            }}
          >
            <Building2 size={15} />
            <span>{isAr ? 'المجموعات والقاعات' : 'Cohorts & Centers'}</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: activeTab === 'groups' ? 'rgba(21, 136, 199, 0.12)' : 'var(--border-subtle)',
                color: activeTab === 'groups' ? 'var(--primary)' : 'var(--text-secondary)',
              }}
            >
              {groups.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/teacher/schedule', { replace: true })}
            style={{
              flex: isMobile ? 1 : 'initial',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeTab === 'schedule' ? '800' : '600',
              backgroundColor: activeTab === 'schedule' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'schedule' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === 'schedule' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer',
            }}
          >
            <Calendar size={15} />
            <span>{isAr ? 'الجدول الأسبوعي' : 'Weekly Schedule'}</span>
            {todaySessionsCount > 0 ? (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(21, 136, 199, 0.15)',
                  color: 'var(--primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                {isAr ? `${todaySessionsCount} اليوم` : `${todaySessionsCount} Today`}
              </span>
            ) : (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10B981',
                }}
              >
                {isAr ? 'محدث' : 'Active'}
              </span>
            )}
          </button>
        </div>

        {/* Search & Center Filter (only on Groups tab when groups exist) */}
        {activeTab === 'groups' && groups.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: isMobile ? '1 1 100%' : '0 1 auto' }}>
            {centersList.length > 1 && (
              <select
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <option value="all">{isAr ? 'جميع السناتر' : 'All Centers'}</option>
                {centersList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '8px 12px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                minWidth: isMobile ? '100%' : '240px',
              }}
            >
              <Search size={14} color="var(--text-secondary)" />
              <input
                type="text"
                placeholder={isAr ? 'ابحث باسم المجموعة أو الكود أو السنتر...' : 'Search group, code, or center...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  width: '100%',
                  fontFamily: 'inherit',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Loading / Error States */}
      {loadingGroups && groups.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '18px',
            border: '1px solid var(--border-subtle)',
            padding: '54px 20px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '13.5px',
            fontWeight: '700',
          }}
        >
          {isAr ? 'جاري تحميل المجموعات وجدول المواعيد...' : 'Loading cohorts and schedule...'}
        </div>
      ) : groupsError && groups.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '18px',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            padding: '40px 20px',
            textAlign: 'center',
          }}
        >
          <AlertCircle size={32} color="#EF4444" style={{ marginBottom: '10px' }} />
          <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
            {groupsError}
          </div>
          <button
            type="button"
            onClick={refreshGroups}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} />
            <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
        </div>
      ) : activeTab === 'schedule' ? (
        <TeacherWeeklySchedule
          onOpenQr={(cls) => setSelectedClassForQr(cls)}
          onEditClass={(cls) => {
            setEditingClass(cls);
            setFormModalOpen(true);
          }}
          onAddNewClass={() => {
            setEditingClass(null);
            setFormModalOpen(true);
          }}
        />
      ) : groups.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '18px',
            border: '1.5px dashed var(--border-medium)',
            padding: '48px 24px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          <Building2 size={38} color="var(--primary)" style={{ margin: '0 auto 12px', opacity: 0.7 }} />
          <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px' }}>
            {isAr ? 'لا توجد مجموعات حالية' : 'No cohorts available'}
          </h3>
          <p style={{ fontSize: '13px', margin: '0 auto 18px', maxWidth: '420px', lineHeight: 1.6 }}>
            {isAr
              ? 'ابدأ بإنشاء أول مجموعة دراسية وقاعة سنتر لطلابك الآن لإنشاء كود انضمام وباركود تلقائياً.'
              : 'Create your first study group now to generate a join code and QR automatically.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingClass(null);
              setFormModalOpen(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: '11px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <Plus size={15} />
            <span>{isAr ? 'إنشاء مجموعة الآن' : 'Create Group Now'}</span>
          </button>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '40px 20px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          <p style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 10px' }}>
            {isAr ? 'لا توجد مجموعات مطابقة للبحث أو الفلتر المحدد' : 'No cohorts match your search'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCenter('all');
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              color: 'var(--primary)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'مسح البحث والفلاتر' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '20px',
          }}
        >
          {filteredGroups.map((cls) => (
            <ClassCard
              key={cls.id}
              cls={cls}
              lang={lang}
              isRtl={isRtl}
              copiedCode={copiedCode}
              enrolledCount={getGroupEnrolledCount(cls)}
              pendingCount={getGroupPendingCount(cls)}
              onOpenQr={() => setSelectedClassForQr(cls)}
              onCopyCode={() => handleCopyCode(cls.joinCode)}
              onViewRoster={() => handleOpenRoster(cls)}
              onEdit={() => {
                setEditingClass(cls);
                setFormModalOpen(true);
              }}
              onDelete={() => {
                setDeleteError('');
                setDeleteConfirmClass(cls);
              }}
            />
          ))}
        </div>
      )}

      {/* QR Code Invitation Modal */}
      <ClassQrModal
        showQrModal={Boolean(selectedClassForQr)}
        selectedClass={selectedClassForQr}
        lang={lang}
        onClose={() => setSelectedClassForQr(null)}
        onOpenRoster={(cls) => handleOpenRoster(cls)}
      />

      {/* Create / Edit Cohort Form Modal */}
      <ClassFormModal
        isOpen={formModalOpen}
        initialData={editingClass}
        existingGroups={groups}
        lang={lang}
        onClose={() => {
          setFormModalOpen(false);
          setEditingClass(null);
        }}
        onSubmit={handleSaveForm}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmClass && (
        <div
          onClick={() => {
            if (!isDeleting) setDeleteConfirmClass(null);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(4, 25, 53, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '18px',
              padding: '24px',
              maxWidth: '420px',
              width: '100%',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertCircle size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {isAr ? 'تأكيد حذف المجموعة' : 'Confirm Cohort Deletion'}
              </h3>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 16px 0' }}>
              {isAr
                ? `هل أنت متأكد من حذف مجموعة «${deleteConfirmClass.nameAr}»؟ سيتم إخفاؤها من قائمتك وجدول مواعيدك.`
                : `Are you sure you want to delete "${deleteConfirmClass.nameAr}"? It will be removed from your cohorts and schedule.`}
            </p>

            {deleteError && (
              <div
                style={{
                  padding: '9px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444',
                  fontSize: '12px',
                  fontWeight: '700',
                  marginBottom: '14px',
                }}
              >
                {deleteError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmClass(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: isDeleting ? 'wait' : 'pointer',
                  opacity: isDeleting ? 0.7 : 1,
                }}
              >
                {isDeleting && <Loader2 size={14} className="animate-spin" />}
                <span>{isAr ? 'نعم، حذف المجموعة' : 'Delete Group'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
