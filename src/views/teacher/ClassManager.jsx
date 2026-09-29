import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useGroups } from '../../context/GroupsContext';
import { Plus, Building2, AlertCircle, Calendar } from 'lucide-react';
import { ClassCard, ClassQrModal, ClassFormModal } from '../../features/teacher/classes';
import { TeacherWeeklySchedule } from '../../features/teacher/schedule';

export const ClassManager = ({ defaultTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { lang, isRtl } = useLanguage();
  const {
    groups,
    enrolledStudents,
    pendingStudents,
    addGroup,
    updateGroup,
    deleteGroup,
    setActiveGroupId
  } = useGroups();

  const isScheduleInitial = defaultTab === 'schedule' || 
    location.pathname.includes('/schedule') || 
    searchParams.get('tab') === 'schedule';

  const [activeTab, setActiveTab] = useState(isScheduleInitial ? 'schedule' : 'groups');

  useEffect(() => {
    if (defaultTab === 'schedule' || location.pathname.includes('/schedule') || searchParams.get('tab') === 'schedule') {
      setActiveTab('schedule');
    } else if (defaultTab === 'groups' || location.pathname.endsWith('/classes')) {
      if (searchParams.get('tab') !== 'schedule') {
        setActiveTab('groups');
      }
    }
  }, [defaultTab, location.pathname, searchParams]);

  const todayDayKey = useMemo(() => {
    const dayNum = new Date().getDay();
    const map = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return map[dayNum] || 'tuesday';
  }, []);

  const todaySessionsCount = useMemo(() => {
    return groups.reduce((acc, g) => {
      const slots = g.scheduleSlots || [];
      const matches = slots.filter(s => s.day === todayDayKey);
      return acc + matches.length;
    }, 0);
  }, [groups, todayDayKey]);

  const [selectedClassForQr, setSelectedClassForQr] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deleteConfirmClass, setDeleteConfirmClass] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenRoster = (cls) => {
    setActiveGroupId(cls.id);
    navigate('/teacher/students');
  };

  const handleSaveForm = (formData) => {
    if (editingClass) {
      updateGroup(editingClass.id, formData);
    } else {
      addGroup(formData);
    }
    setFormModalOpen(false);
    setEditingClass(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmClass) return;
    deleteGroup(deleteConfirmClass.id);
    setDeleteConfirmClass(null);
  };

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '28px 24px 80px',
      fontFamily: 'var(--font-arabic)',
      direction: isRtl ? 'rtl' : 'ltr'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '22px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            letterSpacing: '-0.3px'
          }}>
            {activeTab === 'schedule'
              ? (lang === 'ar' ? 'جدول المواعيد والقاعات الأسبوعي' : 'Weekly Schedule & Halls')
              : (lang === 'ar' ? 'إدارة المجموعات والقاعات الدراسية' : 'Class & Hall Management')}
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            {activeTab === 'schedule'
              ? (lang === 'ar'
                ? 'تنظيم مواعيد الحصص الأسبوعية بالسناتر، متابعة جدول اليوم، وتدوين الملاحظات والتنبيهات السريعة'
                : 'Manage weekly center sessions, focus on today’s timetable, and keep quick daily notes')
              : (lang === 'ar'
                ? 'متابعة مواعيد القاعات، أكواد انضمام الطلاب، والباركود السريع وسجلات الحضور'
                : 'Monitor group schedules, join codes, fast QR invitations, and student rosters')}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingClass(null);
            setFormModalOpen(true);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '11px 22px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-primary)',
            transition: 'opacity 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <Plus size={16} />
          <span>{lang === 'ar' ? 'إنشاء مجموعة جديدة' : 'Add New Cohort'}</span>
        </button>
      </div>

      {/* Navigation Tabs (Cohorts vs Weekly Schedule) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '26px',
        padding: '6px',
        backgroundColor: 'var(--bg-subtle)',
        borderRadius: '14px',
        width: 'fit-content',
        border: '1px solid var(--border-subtle)'
      }}>
        <button
          onClick={() => {
            setActiveTab('groups');
            navigate('/teacher/classes', { replace: true });
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: activeTab === 'groups' ? '800' : '600',
            backgroundColor: activeTab === 'groups' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'groups' ? 'var(--primary)' : 'var(--text-secondary)',
            boxShadow: activeTab === 'groups' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Building2 size={16} />
          <span>{lang === 'ar' ? 'المجموعات والقاعات الدراسية' : 'Cohorts & Centers'}</span>
          <span style={{
            fontSize: '11px',
            fontWeight: '800',
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: activeTab === 'groups' ? 'rgba(21, 136, 199, 0.12)' : 'var(--border-subtle)',
            color: activeTab === 'groups' ? 'var(--primary)' : 'var(--text-secondary)'
          }}>
            {groups.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('schedule');
            navigate('/teacher/schedule', { replace: true });
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: activeTab === 'schedule' ? '800' : '600',
            backgroundColor: activeTab === 'schedule' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'schedule' ? 'var(--primary)' : 'var(--text-secondary)',
            boxShadow: activeTab === 'schedule' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Calendar size={16} />
          <span>{lang === 'ar' ? 'جدول المواعيد والقاعات الأسبوعي' : 'Weekly Schedule'}</span>
          {todaySessionsCount > 0 ? (
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: 'rgba(21, 136, 199, 0.15)',
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
              {lang === 'ar' ? `${todaySessionsCount} اليوم` : `${todaySessionsCount} Today`}
            </span>
          ) : (
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#10B981'
            }}>
              {lang === 'ar' ? 'محدث' : 'Active'}
            </span>
          )}
        </button>
      </div>

      {/* Tab Body */}
      {activeTab === 'schedule' ? (
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
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          padding: '48px 24px',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <Building2 size={36} color="var(--primary)" style={{ margin: '0 auto 12px', opacity: 0.7 }} />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
            {lang === 'ar' ? 'لا توجد مجموعات حالية' : 'No cohorts available'}
          </h3>
          <p style={{ fontSize: '13px', margin: '0 0 16px' }}>
            {lang === 'ar' ? 'ابدأ بإنشاء أول مجموعة دراسية وقاعة سنتر لطلابك الآن' : 'Create your first study group now'}
          </p>
          <button
            onClick={() => {
              setEditingClass(null);
              setFormModalOpen(true);
            }}
            style={{
              padding: '9px 18px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            {lang === 'ar' ? 'إنشاء مجموعة الآن' : 'Create Group Now'}
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '20px'
        }}>
          {groups.map(cls => (
            <ClassCard
              key={cls.id}
              cls={cls}
              lang={lang}
              isRtl={isRtl}
              copiedCode={copiedCode}
              enrolledCount={(enrolledStudents[cls.id] || []).length}
              pendingCount={(pendingStudents[cls.id] || []).length}
              onOpenQr={() => setSelectedClassForQr(cls)}
              onCopyCode={() => handleCopyCode(cls.joinCode)}
              onViewRoster={() => handleOpenRoster(cls)}
              onEdit={() => {
                setEditingClass(cls);
                setFormModalOpen(true);
              }}
              onDelete={() => setDeleteConfirmClass(cls)}
            />
          ))}
        </div>
      )}

      {/* QR Code Invitation Modal with Real Authentic QR Code */}
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
        lang={lang}
        onClose={() => {
          setFormModalOpen(false);
          setEditingClass(null);
        }}
        onSubmit={handleSaveForm}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmClass && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(4, 25, 53, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 10001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '18px',
            padding: '24px',
            maxWidth: '420px',
            width: '100%',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertCircle size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'تأكيد حذف المجموعة' : 'Confirm Cohort Deletion'}
              </h3>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 20px 0' }}>
              {lang === 'ar'
                ? `هل أنت متأكد من حذف مجموعة «${deleteConfirmClass.nameAr}»؟ سيتم حذف سجل الطلاب المرتبط بها.`
                : `Are you sure you want to delete "${deleteConfirmClass.nameAr}"? Its associated roster will be cleared.`}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setDeleteConfirmClass(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                onClick={handleConfirmDelete}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'نعم، حذف المجموعة' : 'Delete Group'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
