import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { adminApi } from '../../../services/adminApi';
import {
  BookOpen,
  Search,
  Star,
  Users,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Layers,
  Eye,
  X,
  Landmark,
  GraduationCap,
} from 'lucide-react';
import { AdminMinistryCurriculaTab } from './AdminMinistryCurriculaTab';
import { MINISTRY_GRADES } from './ministryGrades';

const TeacherCoursesModerationTab = ({ lang, isRtl, showToast }) => {
  const isAr = lang === 'ar';

  const [courses, setCourses] = useState([]);
  const [summary, setSummary] = useState({ total: 0, published: 0, review: 0, archived: 0, featured: 0, totalEnrolled: 0 });
  const [meta, setMeta] = useState({ current_page: 1, per_page: 12, total: 0, last_page: 1 });

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleting, setDeleting] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const seqRef = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchCourses = useCallback(async () => {
    const seq = ++seqRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.courses.list({
        search: debouncedSearch || undefined,
        stage: stageFilter !== 'all' ? stageFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page,
        per_page: 12,
      });
      if (seq !== seqRef.current) return;
      setCourses(Array.isArray(res?.data) ? res.data : []);
      if (res?.meta?.summary) setSummary(res.meta.summary);
      if (res?.meta) {
        setMeta({
          current_page: res.meta.current_page ?? 1,
          per_page: res.meta.per_page ?? 12,
          total: res.meta.total ?? 0,
          last_page: res.meta.last_page ?? 1,
        });
      }
    } catch (err) {
      if (seq !== seqRef.current) return;
      setError(err?.message || (isAr ? 'تعذر تحميل مقررات المعلمين' : 'Failed to load teacher courses'));
    } finally {
      if (seq === seqRef.current) setLoading(false);
    }
  }, [debouncedSearch, stageFilter, statusFilter, page, isAr]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) fetchCourses();
    });
    return () => {
      active = false;
    };
  }, [fetchCourses]);

  const handleTogglePublish = async (course) => {
    setBusyId(course.id);
    try {
      const res = await adminApi.courses.togglePublish(course.id);
      const updated = res?.data;
      if (updated) {
        setCourses((prev) => prev.map((c) => (c.id === course.id ? updated : c)));
      }
      showToast(
        updated?.status === 'published'
          ? isAr ? 'تم اعتماد ونشر المقرر في المنصة بنجاح' : 'Course approved & published'
          : isAr ? 'تم إيقاف نشر المقرر وإعادته للمراجعة' : 'Course moved to review'
      );
      fetchCourses();
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر تحديث حالة النشر' : 'Failed to update publish status'), 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleFeatured = async (course) => {
    setBusyId(course.id);
    try {
      const res = await adminApi.courses.toggleFeatured(course.id);
      const updated = res?.data;
      if (updated) {
        setCourses((prev) => prev.map((c) => (c.id === course.id ? updated : c)));
      }
      showToast(
        updated?.isFeatured
          ? isAr ? 'تم تمييز المقرر في الواجهة الرئيسية للمتجر' : 'Course marked as featured'
          : isAr ? 'تم إلغاء تمييز المقرر' : 'Removed featured badge'
      );
      fetchCourses();
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر تحديث حالة التمييز' : 'Failed to toggle featured'), 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    setDeleting(true);
    try {
      await adminApi.courses.delete(courseToDelete.id, { reason: deleteReason.trim() || undefined });
      showToast(isAr ? 'تم أرشفة وحذف المقرر بنجاح' : 'Course archived & removed');
      setCourseToDelete(null);
      setDeleteReason('');
      fetchCourses();
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر حذف المقرر' : 'Failed to delete course'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleInspectCourse = async (course) => {
    setSelectedCourse(course);
    setLoadingDetails(true);
    try {
      const res = await adminApi.courses.get(course.id);
      if (res?.data) setSelectedCourse(res.data);
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر جلب تفاصيل المقرر' : 'Failed to load course details'), 'error');
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '12px' }}>
        {[
          { labelAr: 'إجمالي مقررات المعلمين', labelEn: 'Total Courses', val: summary.total, icon: Layers, color: 'var(--primary)', bg: 'rgba(21, 136, 199, 0.12)' },
          { labelAr: 'مقررات منشورة', labelEn: 'Published', val: summary.published, icon: BookOpen, color: '#047857', bg: 'rgba(16, 185, 129, 0.12)' },
          { labelAr: 'قيد المراجعة', labelEn: 'Pending Review', val: summary.review, icon: AlertCircle, color: '#B45309', bg: 'rgba(245, 158, 11, 0.14)' },
          { labelAr: 'مقررات مميزة', labelEn: 'Featured', val: summary.featured, icon: Sparkles, color: 'var(--primary)', bg: 'rgba(92, 182, 219, 0.16)' },
          { labelAr: 'إجمالي المشتركين', labelEn: 'Total Enrolled', val: summary.totalEnrolled, icon: Users, color: '#6D28D9', bg: 'rgba(139, 92, 246, 0.12)' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} style={{
              backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '15px',
              padding: '13px 15px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px', backgroundColor: card.bg, color: card.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Icon size={18} />
              </div>
              <div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{isAr ? card.labelAr : card.labelEn}</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>{Number(card.val || 0).toLocaleString()}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters & Search */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '15px 18px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '360px' }}>
          <Search size={15} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={isAr ? 'بحث باسم المقرر، المادة، أو اسم المعلم...' : 'Search course, subject, or teacher...'}
            style={{
              width: '100%', padding: '9px 12px', paddingInlineStart: '36px', borderRadius: '10px',
              border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)', fontSize: '13px', boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={stageFilter}
            onChange={(e) => { setStageFilter(e.target.value); setPage(1); }}
            style={{
              padding: '8px 11px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
            }}
          >
            <option value="all">{isAr ? 'كل الصفوف (1 ابتدائي — 3 ثانوي)' : 'All Grades (1st Pri — 3rd Sec)'}</option>
            {MINISTRY_GRADES.map((g) => (
              <option key={g.gradeAr} value={g.gradeAr}>
                {isAr ? g.gradeAr : g.gradeEn}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{
              padding: '8px 11px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
            }}
          >
            <option value="all">{isAr ? 'كل الحالات' : 'All Statuses'}</option>
            <option value="published">{isAr ? 'منشور' : 'Published'}</option>
            <option value="review">{isAr ? 'قيد المراجعة' : 'Review'}</option>
            <option value="archived">{isAr ? 'مؤرشف' : 'Archived'}</option>
          </select>

          <button
            type="button"
            onClick={fetchCourses}
            disabled={loading}
            title={isAr ? 'تحديث' : 'Refresh'}
            style={{
              width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px',
          padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#B91C1C', fontSize: '13px', fontWeight: '600'
        }}>
          <span>{error}</span>
          <button type="button" onClick={fetchCourses} style={{ backgroundColor: '#B91C1C', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
            {isAr ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* Courses List */}
      {loading ? (
        <div style={{
          backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '18px',
          padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px'
        }}>
          {isAr ? 'جاري تحميل مقررات المعلمين...' : 'Loading teacher courses...'}
        </div>
      ) : courses.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '18px',
          padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px'
        }}>
          {isAr ? 'لا توجد مقررات تطابق معايير البحث الحالية' : 'No courses match the current filters'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 290px), 1fr))', gap: '16px' }}>
          {courses.map((course) => {
            const isPublished = course.status === 'published';
            const isBusy = busyId === course.id;
            return (
              <div
                key={course.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: course.isFeatured ? '1.5px solid rgba(21, 136, 199, 0.4)' : '1px solid var(--border-subtle)',
                  borderRadius: '18px',
                  padding: '18px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  opacity: isBusy ? 0.65 : 1,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div>
                    <span style={{
                      display: 'inline-block', padding: '3px 8px', borderRadius: '6px',
                      backgroundColor: 'rgba(21, 136, 199, 0.1)', color: 'var(--primary)',
                      fontSize: '11px', fontWeight: '700', marginBottom: '6px'
                    }}>
                      {(isAr ? (course.stageAr || course.stage) : (course.stageEn || course.stage)) || '—'}
                      {' • '}
                      {(isAr ? (course.subjectAr || course.subject) : (course.subjectEn || course.subject)) || '—'}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                      {isAr ? (course.titleAr || course.title) : (course.titleEn || course.title)}
                    </h3>
                  </div>

                  <span style={{
                    padding: '4px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', flexShrink: 0,
                    backgroundColor: isPublished ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.15)',
                    color: isPublished ? '#047857' : '#B45309'
                  }}>
                    {isPublished ? (isAr ? 'منشور' : 'Published') : (isAr ? 'قيد المراجعة' : 'Review')}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {isAr ? 'المعلم: ' : 'Instructor: '}
                    {isAr ? (course.instructorAr || course.instructor) : (course.instructorEn || course.instructor)}
                  </span>
                  <span>{course.totalLectures ?? 0} {isAr ? 'حصة' : 'Lessons'}</span>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px',
                  backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)', fontWeight: '700' }}>
                    <Users size={14} color="var(--primary)" />
                    <span>{Number(course.enrolled || 0).toLocaleString()} {isAr ? 'طالب' : 'Students'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#EAB308', fontWeight: '700' }}>
                    <Star size={14} fill="#EAB308" />
                    <span>{course.rating ?? '5.0'}</span>
                  </div>
                  <div style={{ fontWeight: '800', color: 'var(--primary)' }}>
                    {Number(course.priceEgp || 0).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleToggleFeatured(course)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                      padding: '8px 10px', borderRadius: '10px',
                      border: course.isFeatured ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: course.isFeatured ? 'rgba(21, 136, 199, 0.1)' : 'transparent',
                      color: course.isFeatured ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: '12px', fontWeight: '600', cursor: isBusy ? 'wait' : 'pointer'
                    }}
                  >
                    <Sparkles size={13} />
                    <span>{course.isFeatured ? (isAr ? 'مميز' : 'Featured') : (isAr ? 'تمييز' : 'Feature')}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleTogglePublish(course)}
                    style={{
                      padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                      backgroundColor: 'transparent',
                      color: isPublished ? 'var(--color-danger)' : 'var(--color-success)',
                      fontSize: '12px', fontWeight: '700', cursor: isBusy ? 'wait' : 'pointer'
                    }}
                  >
                    {isPublished ? (isAr ? 'إلغاء النشر' : 'Unpublish') : (isAr ? 'اعتماد ونشر' : 'Publish')}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInspectCourse(course)}
                    title={isAr ? 'عرض الحصص والتفاصيل' : 'Inspect Course'}
                    style={{
                      padding: '8px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                      backgroundColor: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <Eye size={14} />
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => { setCourseToDelete(course); setDeleteReason(''); }}
                    title={isAr ? 'حذف / أرشفة المقرر' : 'Archive / Delete Course'}
                    style={{
                      padding: '8px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                      backgroundColor: 'transparent', color: 'var(--color-danger)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
          <span>
            {isAr ? `صفحة ${meta.current_page} من ${meta.last_page}` : `Page ${meta.current_page} of ${meta.last_page}`}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              disabled={meta.current_page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px',
                border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)',
                fontSize: '12px', fontWeight: '700', cursor: meta.current_page <= 1 ? 'not-allowed' : 'pointer',
                opacity: meta.current_page <= 1 ? 0.5 : 1
              }}
            >
              {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              <span>{isAr ? 'السابق' : 'Prev'}</span>
            </button>
            <button
              type="button"
              disabled={meta.current_page >= meta.last_page}
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px',
                border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)',
                fontSize: '12px', fontWeight: '700', cursor: meta.current_page >= meta.last_page ? 'not-allowed' : 'pointer',
                opacity: meta.current_page >= meta.last_page ? 0.5 : 1
              }}
            >
              <span>{isAr ? 'التالي' : 'Next'}</span>
              {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>
        </div>
      )}

      {/* Course Details Modal */}
      {selectedCourse && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-subtle)', borderRadius: '22px',
            width: '100%', maxWidth: '580px', maxHeight: '85vh', overflowY: 'auto', padding: '24px', boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {isAr ? (selectedCourse.titleAr || selectedCourse.title) : (selectedCourse.titleEn || selectedCourse.title)}
              </h3>
              <button type="button" onClick={() => setSelectedCourse(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ color: 'var(--text-secondary)' }}>
                <strong>{isAr ? 'المعلم:' : 'Instructor:'}</strong> {selectedCourse.instructorAr || selectedCourse.instructor}
              </div>
              {selectedCourse.descriptionAr && (
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {isAr ? selectedCourse.descriptionAr : (selectedCourse.descriptionEn || selectedCourse.descriptionAr)}
                </p>
              )}
              <div style={{ fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px' }}>
                {isAr ? 'قائمة الحصص والمحاضرات:' : 'Course Lessons:'}
                {loadingDetails && <span style={{ fontWeight: '500', color: 'var(--text-secondary)', marginInlineStart: '8px' }}>({isAr ? 'جاري التحميل...' : 'Loading...'})</span>}
              </div>
              {Array.isArray(selectedCourse.lessons) && selectedCourse.lessons.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedCourse.lessons.map((l, idx) => (
                    <div key={l.id || idx} style={{
                      padding: '10px 12px', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px'
                    }}>
                      <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                        {idx + 1}. {isAr ? l.titleAr : (l.titleEn || l.titleAr)}
                      </span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '11.5px' }}>
                        {Math.round((l.durationSeconds || 0) / 60)} {isAr ? 'دقيقة' : 'min'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : !loadingDetails && (
                <div style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>
                  {isAr ? 'لا توجد حصص مضافة بعد لهذا المقرر' : 'No lessons uploaded yet'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.5)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-subtle)', borderRadius: '22px',
            width: '100%', maxWidth: '450px', padding: '24px', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', gap: '14px'
          }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {isAr ? 'تأكيد أرشفة وحذف المقرر' : 'Confirm Course Removal'}
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {isAr
                ? `سيتم إيقاف نشر المقرر (${courseToDelete.titleAr || courseToDelete.title}) وأرشفته مع تسجيل الحدث في سجل الأمان.`
                : `Course (${courseToDelete.titleEn || courseToDelete.title}) will be archived and soft-deleted with an audit entry.`}
            </p>
            <textarea
              rows={2}
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder={isAr ? 'سبب الإزالة / الإشراف (اختياري)...' : 'Moderation reason (optional)...'}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setCourseToDelete(null)}
                style={{
                  padding: '9px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                  backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '700', cursor: 'pointer'
                }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                style={{
                  padding: '9px 18px', borderRadius: '10px', border: 'none', backgroundColor: '#DC2626',
                  color: '#FFFFFF', fontSize: '13px', fontWeight: '700', cursor: deleting ? 'wait' : 'pointer'
                }}
              >
                {deleting ? (isAr ? 'جاري الحذف...' : 'Deleting...') : (isAr ? 'تأكيد الأرشفة' : 'Confirm Archive')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminCoursesManager = () => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const [sectionTab, setSectionTab] = useState('ministry'); // 'ministry' | 'teachers'
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((text, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ text, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3400);
  }, []);

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Global Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: isRtl ? '24px' : 'auto',
          right: isRtl ? 'auto' : '24px',
          backgroundColor: toast.type === 'error' ? '#991B1B' : 'var(--color-brand-dark)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 10001,
          fontSize: '13.5px',
          fontWeight: '700',
        }}>
          {toast.type === 'error'
            ? <AlertCircle size={18} color="#FCA5A5" />
            : <CheckCircle size={18} color="var(--primary-light)" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Clean Top Switcher: Ministry Curricula CMS vs Teacher Courses Moderation */}
      <div
        style={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '6px',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          alignSelf: 'flex-start',
        }}
      >
        <button
          type="button"
          onClick={() => setSectionTab('ministry')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: sectionTab === 'ministry' ? '#06254E' : 'transparent',
            color: sectionTab === 'ministry' ? '#FFFFFF' : 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: sectionTab === 'ministry' ? 'var(--shadow-sm)' : 'none',
          }}
        >
          <Landmark size={16} />
          <span>{isAr ? 'مقررات الوزارة (1 ابتدائي — 3 ثانوي)' : 'Ministry Courses (1st Pri — 3rd Sec)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setSectionTab('teachers')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: sectionTab === 'teachers' ? 'var(--primary)' : 'transparent',
            color: sectionTab === 'teachers' ? '#FFFFFF' : 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: sectionTab === 'teachers' ? '0 4px 12px rgba(21, 136, 199, 0.25)' : 'none',
          }}
        >
          <GraduationCap size={16} />
          <span>{isAr ? 'مقررات المعلمين (الإشراف)' : 'Teacher Courses Moderation'}</span>
        </button>
      </div>

      {/* Active Workspace */}
      {sectionTab === 'ministry' ? (
        <AdminMinistryCurriculaTab lang={lang} isRtl={isRtl} showToast={showToast} />
      ) : (
        <TeacherCoursesModerationTab lang={lang} isRtl={isRtl} showToast={showToast} />
      )}
    </div>
  );
};
