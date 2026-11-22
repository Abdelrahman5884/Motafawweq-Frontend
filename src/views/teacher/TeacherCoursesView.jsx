import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  X,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { teacherApi } from '../../services/teacherApi';
import {
  CourseCard,
  CourseFormModal,
  DeleteCourseModal,
  COURSE_STATUS_META,
  mapCourseFromApi,
} from '../../features/teacher/courses';

const STATUS_FILTERS = [
  { id: 'all', labelAr: 'الكل', labelEn: 'All' },
  { id: 'published', labelAr: COURSE_STATUS_META.published.labelAr, labelEn: COURSE_STATUS_META.published.labelEn },
  { id: 'draft', labelAr: COURSE_STATUS_META.draft.labelAr, labelEn: COURSE_STATUS_META.draft.labelEn },
  { id: 'archived', labelAr: COURSE_STATUS_META.archived.labelAr, labelEn: COURSE_STATUS_META.archived.labelEn },
];

export const TeacherCoursesView = () => {
  const navigate = useNavigate();
  const { teacherPlanTier, teacherPlanQuotas } = useAuth();
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const isAr = lang === 'ar';

  const [courses, setCourses] = useState([]);
  const [meta, setMeta] = useState(() => ({
    activeCoursesCount: 0,
    maxCourses: teacherPlanQuotas?.maxCourses ?? null,
    planTier: teacherPlanTier || 'free',
    defaultSubjectAr: '',
    defaultSubjectEn: '',
  }));
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Modal states
  const [modalMode, setModalMode] = useState(null); // null | 'create' | 'edit'
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [isQuotaError, setIsQuotaError] = useState(false);

  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Description expansion state
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await teacherApi.courses.list();
      const rawList = Array.isArray(res?.data) ? res.data : [];
      setCourses(rawList.map(mapCourseFromApi));
      if (res?.meta) {
        setMeta((prev) => ({
          ...prev,
          activeCoursesCount: Number(res.meta.activeCoursesCount ?? rawList.length),
          maxCourses: res.meta.maxCourses ?? null,
          planTier: res.meta.planTier || prev.planTier,
          defaultSubjectAr: res.meta.defaultSubjectAr || prev.defaultSubjectAr,
          defaultSubjectEn: res.meta.defaultSubjectEn || prev.defaultSubjectEn,
        }));
      }
    } catch (err) {
      setLoadError(
        err?.message ||
          (isAr ? 'تعذر تحميل قائمة المقررات حالياً. يرجى إعادة المحاولة.' : 'Failed to load courses. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  }, [isAr]);

  useEffect(() => {
    let active = true;
    const loadInitial = async () => {
      try {
        const res = await teacherApi.courses.list();
        if (!active) return;
        const rawList = Array.isArray(res?.data) ? res.data : [];
        setCourses(rawList.map(mapCourseFromApi));
        if (res?.meta) {
          setMeta({
            activeCoursesCount: Number(res.meta.activeCoursesCount ?? rawList.length),
            maxCourses: res.meta.maxCourses ?? null,
            planTier: res.meta.planTier || 'free',
            defaultSubjectAr: res.meta.defaultSubjectAr || '',
            defaultSubjectEn: res.meta.defaultSubjectEn || '',
          });
        }
      } catch (err) {
        if (active) {
          setLoadError(
            err?.message ||
              (isAr ? 'تعذر تحميل قائمة المقررات حالياً. يرجى إعادة المحاولة.' : 'Failed to load courses. Please try again.')
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadInitial();
    return () => { active = false; };
  }, [isAr]);

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return courses.filter((course) => {
      const matchStatus = statusFilter === 'all' || course.status === statusFilter;
      if (!matchStatus) return false;
      if (!q) return true;
      return (
        course.titleAr.toLowerCase().includes(q) ||
        course.titleEn.toLowerCase().includes(q) ||
        course.gradeAr.toLowerCase().includes(q) ||
        course.subjectAr.toLowerCase().includes(q) ||
        course.descriptionAr.toLowerCase().includes(q)
      );
    });
  }, [courses, searchQuery, statusFilter]);

  const totalStudents = useMemo(
    () => courses.reduce((sum, c) => sum + (c.studentsCount || 0), 0),
    [courses]
  );

  const totalLessons = useMemo(
    () => courses.reduce((sum, c) => sum + (c.lessonsCount || 0), 0),
    [courses]
  );

  const effectiveMaxCourses = meta.maxCourses !== undefined ? meta.maxCourses : (teacherPlanQuotas?.maxCourses ?? null);
  const isQuotaReached = effectiveMaxCourses !== null && courses.length >= effectiveMaxCourses;

  const openCreateModal = () => {
    if (isQuotaReached) {
      navigate('/teacher/billing?plan=plus');
      return;
    }
    setFormError('');
    setIsQuotaError(false);
    setEditingCourse(null);
    setModalMode('create');
  };

  const openEditModal = (course) => {
    setFormError('');
    setIsQuotaError(false);
    setEditingCourse(course);
    setModalMode('edit');
  };

  const closeFormModal = () => {
    if (isSaving) return;
    setModalMode(null);
    setEditingCourse(null);
    setFormError('');
    setIsQuotaError(false);
  };

  const handleSaveCourse = async (payload) => {
    setIsSaving(true);
    setFormError('');
    setIsQuotaError(false);

    try {
      if (modalMode === 'edit' && editingCourse?.uuid) {
        const res = await teacherApi.courses.update(editingCourse.uuid, payload);
        if (res?.data) {
          const updated = mapCourseFromApi(res.data);
          setCourses((prev) => prev.map((c) => (c.uuid === updated.uuid ? updated : c)));
        }
      } else {
        const res = await teacherApi.courses.create(payload);
        if (res?.data) {
          const created = mapCourseFromApi(res.data);
          setCourses((prev) => [created, ...prev]);
          setMeta((prev) => ({
            ...prev,
            activeCoursesCount: prev.activeCoursesCount + 1,
          }));
        }
      }
      setModalMode(null);
      setEditingCourse(null);
    } catch (err) {
      const quotaHit = err?.status === 403 || err?.data?.error_code === 'PLAN_QUOTA_EXCEEDED';
      setIsQuotaError(quotaHit);
      setFormError(
        err?.message ||
          (modalMode === 'edit'
            ? (isAr ? 'فشل تحديث بيانات الكورس.' : 'Failed to update course.')
            : (isAr ? 'فشل إنشاء الكورس.' : 'Failed to create course.'))
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete?.uuid || isDeleting) return;
    setIsDeleting(true);
    setDeleteError('');

    try {
      await teacherApi.courses.delete(courseToDelete.uuid);
      setCourses((prev) => prev.filter((c) => c.uuid !== courseToDelete.uuid));
      setMeta((prev) => ({
        ...prev,
        activeCoursesCount: Math.max(0, prev.activeCoursesCount - 1),
      }));
      setCourseToDelete(null);
    } catch (err) {
      setDeleteError(
        err?.message || (isAr ? 'تعذر حذف المقرر حالياً. يرجى المحاولة مجدداً.' : 'Failed to delete course. Please try again.')
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleDescription = (courseId) => {
    setExpandedDescriptions((prev) => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  const defaultSubject = isAr ? meta.defaultSubjectAr : (meta.defaultSubjectEn || meta.defaultSubjectAr);

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '28px 24px 110px',
        fontFamily: 'var(--font-arabic)',
        boxSizing: 'border-box',
      }}
    >
      {/* ── TOP HEADER ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '8px',
              backgroundColor: isDark ? 'rgba(0, 102, 204, 0.15)' : 'rgba(0, 102, 204, 0.08)',
              color: 'var(--primary)',
              fontSize: '11.5px',
              fontWeight: '800',
            }}>
              <BookOpen size={13} />
              <span>{isAr ? 'المناهج والمقررات الأكاديمية' : 'Curriculum & Courses'}</span>
            </span>

            {meta.maxCourses !== null && (
              <span style={{
                fontSize: '11.5px',
                fontWeight: '700',
                padding: '3px 9px',
                borderRadius: '8px',
                backgroundColor: isQuotaReached ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-subtle)',
                color: isQuotaReached ? '#D97706' : 'var(--text-secondary)',
                border: `1px solid ${isQuotaReached ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-subtle)'}`,
              }}>
                {isAr
                  ? `الاستهلاك: ${courses.length} / ${meta.maxCourses} مقرر`
                  : `Quota: ${courses.length} / ${meta.maxCourses} courses`}
              </span>
            )}
          </div>

          <h1 style={{
            fontSize: '22px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: 0,
            fontFamily: 'var(--font-heading), var(--font-arabic)',
          }}>
            {isAr ? 'إدارة المقررات والمناهج والدروس' : 'Course & Curriculum Management'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            {isAr
              ? 'إنشاء وتعديل المقررات، متابعة الطلاب والحصص المسجلة، والانتقال المباشر للاستوديو وخريطة الحصص'
              : 'Create and manage courses, track enrolled students and lessons, and jump directly to Studio or Workspace'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {isQuotaReached ? (
            <button
              type="button"
              onClick={() => navigate('/teacher/billing?plan=plus')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                backgroundColor: 'rgba(245, 158, 11, 0.14)',
                color: '#B45309',
                border: '1.5px solid rgba(245, 158, 11, 0.45)',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              <Lock size={15} />
              <span>{isAr ? 'ترقية إلى Plus لإنشاء كورسات غير محدودة' : 'Upgrade to Plus for Unlimited Courses'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={openCreateModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'opacity 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.92'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              <Plus size={16} />
              <span>{isAr ? 'إنشاء كورس جديد' : 'New Course'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Free Tier Course Limit Banner */}
      {isQuotaReached && (
        <div
          style={{
            marginBottom: '18px',
            padding: '14px 18px',
            borderRadius: '14px',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '800', color: '#B45309' }}>
            <Lock size={17} style={{ flexShrink: 0 }} />
            <span>
              {isAr
                ? `لقد وصلت للحد الأقصى في الباقة المجانية (${effectiveMaxCourses} كورس فقط). اشترك في باقة المعلم بلس (120 ج.م/شهر) لإنشاء عدد غير محدود من الكورسات والحصص.`
                : `You reached the Free plan limit (${effectiveMaxCourses} course max). Subscribe to Teacher Plus (120 EGP/mo) for unlimited courses and lessons.`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/teacher/billing?plan=plus')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={14} />
            <span>{isAr ? 'اشترك في باقة المعلم بلس' : 'Subscribe to Teacher Plus'}</span>
          </button>
        </div>
      )}

      {/* ── COMPACT KPI STRIP ── */}
      {!isLoading && !loadError && courses.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}>
          {[
            {
              label: isAr ? 'إجمالي المقررات' : 'Total Courses',
              value: courses.length.toLocaleString(),
            },
            {
              label: isAr ? 'إجمالي الطلاب المقيدين' : 'Enrolled Students',
              value: totalStudents.toLocaleString(),
            },
            {
              label: isAr ? 'إجمالي الحصص المسجلة' : 'Total Lessons',
              value: totalLessons.toLocaleString(),
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {stat.label}
              </span>
              <span style={{
                fontSize: '20px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
              }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── SEARCH & STATUS FILTER BAR ── */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '14px 18px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-xs)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '8px 14px',
          flex: 1,
          minWidth: '220px',
          maxWidth: '420px',
        }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            placeholder={isAr ? 'بحث في أسماء الكورسات والمواد والصفوف...' : 'Search by title, subject, or grade...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '13px',
              width: '100%',
              fontFamily: 'inherit',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              aria-label={isAr ? 'مسح البحث' : 'Clear search'}
              onClick={() => setSearchQuery('')}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: 0,
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${active ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  backgroundColor: active ? 'rgba(0, 102, 204, 0.1)' : 'var(--bg-subtle)',
                  color: active ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {isAr ? tab.labelAr : tab.labelEn}
              </button>
            );
          })}

          <span style={{
            fontSize: '12px',
            fontWeight: '700',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-subtle)',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
          }}>
            {isAr ? `${filteredCourses.length} كورس` : `${filteredCourses.length} courses`}
          </span>
        </div>
      </div>

      {/* ── ERROR STATE ── */}
      {loadError && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.28)',
            color: 'var(--text-primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '700' }}>
            <AlertTriangle size={18} color="#EF4444" />
            <span>{loadError}</span>
          </div>
          <button
            type="button"
            onClick={fetchCourses}
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
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} />
            <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
        </div>
      )}

      {/* ── LOADING SKELETON ── */}
      {isLoading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '18px',
        }}>
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              style={{
                height: '250px',
                borderRadius: 'var(--radius-xl)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        /* ── EMPTY STATES ── */
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px dashed var(--border-medium, var(--border-subtle))',
          borderRadius: 'var(--radius-xl)',
          padding: '52px 24px',
          textAlign: 'center',
        }}>
          <BookOpen size={40} color="var(--text-muted)" style={{ opacity: 0.4, margin: '0 auto 12px', display: 'block' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
            {courses.length === 0
              ? (isAr ? 'لم تقم بإنشاء أي مقرر دراسي بعد' : 'You haven’t created any courses yet')
              : (isAr ? 'لا توجد مقررات مطابقة للبحث أو الفلتر' : 'No courses match your search or filter')}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 18px' }}>
            {courses.length === 0
              ? (isAr ? 'أنشئ مقررك الأول الآن لتنظيم حصصك ومجموعاتك وربط طلابك به بسهولة.' : 'Create your first course to organize lessons, study groups, and students.')
              : (isAr ? 'جرّب تعديل كلمات البحث أو اختيار "الكل" من فلتر الحالة.' : 'Try adjusting your search keywords or resetting the status filter.')}
          </p>

          {courses.length === 0 ? (
            <button
              type="button"
              onClick={openCreateModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              <span>{isAr ? 'إنشاء أول كورس' : 'Create First Course'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '700',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
            </button>
          )}
        </div>
      ) : (
        /* ── COURSES GRID ── */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '18px',
        }}>
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.uuid}
              course={course}
              isAr={isAr}
              isDark={isDark}
              isExpanded={Boolean(expandedDescriptions[course.id])}
              onToggleDescription={toggleDescription}
              onEdit={openEditModal}
              onDelete={(c) => {
                setDeleteError('');
                setCourseToDelete(c);
              }}
              onOpenWorkspace={(courseId) => navigate(`/teacher/workspace?courseId=${encodeURIComponent(courseId)}`)}
              onOpenStudio={(courseId) => navigate(`/teacher/studio?courseId=${encodeURIComponent(courseId)}`)}
            />
          ))}
        </div>
      )}

      {/* ── CREATE / EDIT COURSE MODAL ── */}
      {modalMode && (
        <CourseFormModal
          key={modalMode === 'edit' ? `edit-${editingCourse?.uuid}` : 'create-new'}
          mode={modalMode}
          initialCourse={editingCourse}
          defaultSubject={defaultSubject}
          isAr={isAr}
          isSubmitting={isSaving}
          error={formError}
          isQuotaError={isQuotaError}
          onClose={closeFormModal}
          onSubmit={handleSaveCourse}
          onOpenBilling={() => {
            closeFormModal();
            navigate('/teacher/billing?plan=plus');
          }}
        />
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      <DeleteCourseModal
        course={courseToDelete}
        isAr={isAr}
        isDark={isDark}
        isDeleting={isDeleting}
        error={deleteError}
        onCancel={() => !isDeleting && setCourseToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default TeacherCoursesView;
