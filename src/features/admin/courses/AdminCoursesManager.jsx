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
  X
} from 'lucide-react';

export const AdminCoursesManager = () => {
  const { lang, isRtl } = useLanguage();

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

  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((text, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ text, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchCourses = useCallback(async () => {
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
      setError(err?.message || (lang === 'ar' ? 'تعذر تحميل المقررات التعليمية' : 'Failed to load courses'));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, stageFilter, statusFilter, page, lang]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleTogglePublish = async (course) => {
    setBusyId(course.id);
    try {
      const res = await adminApi.courses.togglePublish(course.id);
      const updated = res?.data;
      if (updated) {
        setCourses(prev => prev.map(c => (c.id === course.id ? updated : c)));
      }
      showToast(
        updated?.status === 'published'
          ? (lang === 'ar' ? 'تم اعتماد ونشر المقرر في المنصة بنجاح' : 'Course approved & published')
          : (lang === 'ar' ? 'تم إيقاف نشر المقرر وإعادته للمراجعة' : 'Course moved to review')
      );
      fetchCourses();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر تحديث حالة النشر' : 'Failed to update publish status'), 'error');
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
        setCourses(prev => prev.map(c => (c.id === course.id ? updated : c)));
      }
      showToast(
        updated?.isFeatured
          ? (lang === 'ar' ? 'تم تمييز المقرر في الواجهة الرئيسية للمتجر' : 'Course marked as featured')
          : (lang === 'ar' ? 'تم إلغاء تمييز المقرر' : 'Removed featured badge')
      );
      fetchCourses();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر تحديث حالة التمييز' : 'Failed to toggle featured'), 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    setDeleting(true);
    try {
      await adminApi.courses.delete(courseToDelete.id, { reason: deleteReason.trim() || undefined });
      showToast(lang === 'ar' ? 'تم أرشفة وحذف المقرر بنجاح' : 'Course archived & removed');
      setCourseToDelete(null);
      setDeleteReason('');
      fetchCourses();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر حذف المقرر' : 'Failed to delete course'), 'error');
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
      showToast(err?.message || (lang === 'ar' ? 'تعذر جلب تفاصيل المقرر' : 'Failed to load course details'), 'error');
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toast Notification */}
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
          zIndex: 9999,
          fontSize: '14px',
          fontWeight: '600'
        }}>
          {toast.type === 'error'
            ? <AlertCircle size={18} color="#FCA5A5" />
            : <CheckCircle size={18} color="var(--primary-light)" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        {[
          { labelAr: 'إجمالي المقررات', labelEn: 'Total Courses', val: summary.total, icon: Layers, color: 'var(--primary)', bg: 'rgba(21, 136, 199, 0.12)' },
          { labelAr: 'مقررات منشورة', labelEn: 'Published', val: summary.published, icon: BookOpen, color: '#047857', bg: 'rgba(16, 185, 129, 0.12)' },
          { labelAr: 'قيد المراجعة', labelEn: 'Pending Review', val: summary.review, icon: AlertCircle, color: '#B45309', bg: 'rgba(245, 158, 11, 0.14)' },
          { labelAr: 'مقررات مميزة', labelEn: 'Featured', val: summary.featured, icon: Sparkles, color: 'var(--primary)', bg: 'rgba(92, 182, 219, 0.16)' },
          { labelAr: 'إجمالي المشتركين', labelEn: 'Total Enrolled', val: summary.totalEnrolled, icon: Users, color: '#6D28D9', bg: 'rgba(139, 92, 246, 0.12)' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} style={{
              backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px',
              padding: '14px 16px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px', backgroundColor: card.bg, color: card.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Icon size={18} />
              </div>
              <div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{lang === 'ar' ? card.labelAr : card.labelEn}</div>
                <div style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-primary)' }}>{Number(card.val || 0).toLocaleString()}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Banner & Search */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 240px', maxWidth: '360px' }}>
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث باسم المقرر، المادة، أو اسم المعلم...' : 'Search course, subject, or teacher...'}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px'
            }}
          />
        </div>

        {/* Stage & Status Filters */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            { id: 'all', labelAr: 'كل المراحل', labelEn: 'All Stages' },
            { id: 'الصف الثالث الثانوي', labelAr: 'الصف الثالث الثانوي', labelEn: '3rd Secondary' },
            { id: 'الصف الثاني الثانوي', labelAr: 'الصف الثاني الثانوي', labelEn: '2nd Secondary' },
            { id: 'الصف الأول الثانوي', labelAr: 'الصف الأول الثانوي', labelEn: '1st Secondary' },
          ].map(stage => {
            const isSelected = stageFilter === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => { setStageFilter(stage.id); setPage(1); }}
                style={{
                  padding: '7px 12px', borderRadius: '10px',
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                  color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '12px', fontWeight: isSelected ? '700' : '500', cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? stage.labelAr : stage.labelEn}
              </button>
            );
          })}

          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            style={{
              padding: '7px 10px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
            }}
          >
            <option value="all">{lang === 'ar' ? 'كل الحالات' : 'All Statuses'}</option>
            <option value="published">{lang === 'ar' ? 'منشور' : 'Published'}</option>
            <option value="review">{lang === 'ar' ? 'قيد المراجعة' : 'Review'}</option>
            <option value="archived">{lang === 'ar' ? 'مؤرشف' : 'Archived'}</option>
          </select>

          <button
            type="button"
            onClick={fetchCourses}
            disabled={loading}
            title={lang === 'ar' ? 'تحديث' : 'Refresh'}
            style={{
              width: '34px', height: '34px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
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
            {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* Courses List */}
      {loading ? (
        <div style={{
          backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '18px',
          padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px'
        }}>
          {lang === 'ar' ? 'جاري تحميل المقررات التعليمية...' : 'Loading courses...'}
        </div>
      ) : courses.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '18px',
          padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px'
        }}>
          {lang === 'ar' ? 'لا توجد مقررات تطابق معايير البحث الحالية' : 'No courses match the current filters'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 290px), 1fr))', gap: '18px' }}>
          {courses.map(course => {
            const isPublished = course.status === 'published';
            const isBusy = busyId === course.id;
            return (
              <div
                key={course.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: course.isFeatured ? '1.5px solid rgba(21, 136, 199, 0.4)' : '1px solid var(--border-subtle)',
                  borderRadius: '18px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  opacity: isBusy ? 0.65 : 1,
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div>
                    <span style={{
                      display: 'inline-block', padding: '3px 8px', borderRadius: '6px',
                      backgroundColor: 'rgba(21, 136, 199, 0.1)', color: 'var(--primary)',
                      fontSize: '11px', fontWeight: '700', marginBottom: '6px'
                    }}>
                      {(lang === 'ar' ? (course.stageAr || course.stage) : (course.stageEn || course.stage)) || '—'}
                      {' • '}
                      {(lang === 'ar' ? (course.subjectAr || course.subject) : (course.subjectEn || course.subject)) || '—'}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                      {lang === 'ar' ? (course.titleAr || course.title) : (course.titleEn || course.title)}
                    </h3>
                  </div>

                  <span style={{
                    padding: '4px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', flexShrink: 0,
                    backgroundColor: isPublished ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.15)',
                    color: isPublished ? '#047857' : '#B45309'
                  }}>
                    {isPublished ? (lang === 'ar' ? 'منشور' : 'Published') : (lang === 'ar' ? 'قيد المراجعة' : 'Review')}
                  </span>
                </div>

                {/* Instructor & Lectures */}
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'المعلم: ' : 'Instructor: '}
                    {lang === 'ar' ? (course.instructorAr || course.instructor) : (course.instructorEn || course.instructor)}
                  </span>
                  <span>{course.totalLectures ?? 0} {lang === 'ar' ? 'حصة' : 'Lessons'}</span>
                </div>

                {/* Metrics */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px',
                  backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)', fontWeight: '700' }}>
                    <Users size={14} color="var(--primary)" />
                    <span>{Number(course.enrolled || 0).toLocaleString()} {lang === 'ar' ? 'طالب' : 'Students'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#EAB308', fontWeight: '700' }}>
                    <Star size={14} fill="#EAB308" />
                    <span>{course.rating ?? '5.0'}</span>
                  </div>
                  <div style={{ fontWeight: '800', color: 'var(--primary)' }}>
                    {Number(course.priceEgp || 0).toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
                  </div>
                </div>

                {/* Action Buttons */}
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
                    <span>{course.isFeatured ? (lang === 'ar' ? 'مميز' : 'Featured') : (lang === 'ar' ? 'تمييز' : 'Feature')}</span>
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
                    {isPublished ? (lang === 'ar' ? 'إلغاء النشر' : 'Unpublish') : (lang === 'ar' ? 'اعتماد ونشر' : 'Publish')}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInspectCourse(course)}
                    title={lang === 'ar' ? 'عرض الحصص والتفاصيل' : 'Inspect Course'}
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
                    title={lang === 'ar' ? 'حذف / أرشفة المقرر' : 'Archive / Delete Course'}
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
            {lang === 'ar' ? `صفحة ${meta.current_page} من ${meta.last_page}` : `Page ${meta.current_page} of ${meta.last_page}`}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              disabled={meta.current_page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px',
                border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)',
                fontSize: '12px', fontWeight: '700', cursor: meta.current_page <= 1 ? 'not-allowed' : 'pointer',
                opacity: meta.current_page <= 1 ? 0.5 : 1
              }}
            >
              {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              <span>{lang === 'ar' ? 'السابق' : 'Prev'}</span>
            </button>
            <button
              type="button"
              disabled={meta.current_page >= meta.last_page}
              onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px',
                border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)',
                fontSize: '12px', fontWeight: '700', cursor: meta.current_page >= meta.last_page ? 'not-allowed' : 'pointer',
                opacity: meta.current_page >= meta.last_page ? 0.5 : 1
              }}
            >
              <span>{lang === 'ar' ? 'التالي' : 'Next'}</span>
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
                {lang === 'ar' ? (selectedCourse.titleAr || selectedCourse.title) : (selectedCourse.titleEn || selectedCourse.title)}
              </h3>
              <button onClick={() => setSelectedCourse(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ color: 'var(--text-secondary)' }}>
                <strong>{lang === 'ar' ? 'المعلم:' : 'Instructor:'}</strong> {selectedCourse.instructorAr || selectedCourse.instructor}
              </div>
              {selectedCourse.descriptionAr && (
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {lang === 'ar' ? selectedCourse.descriptionAr : (selectedCourse.descriptionEn || selectedCourse.descriptionAr)}
                </p>
              )}
              <div style={{ fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px' }}>
                {lang === 'ar' ? 'قائمة الحصص والمحاضرات:' : 'Course Lessons:'}
                {loadingDetails && <span style={{ fontWeight: '500', color: 'var(--text-secondary)', marginInlineStart: '8px' }}>({lang === 'ar' ? 'جاري التحميل...' : 'Loading...'})</span>}
              </div>
              {Array.isArray(selectedCourse.lessons) && selectedCourse.lessons.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedCourse.lessons.map((l, idx) => (
                    <div key={l.id || idx} style={{
                      padding: '10px 12px', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px'
                    }}>
                      <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                        {idx + 1}. {lang === 'ar' ? l.titleAr : (l.titleEn || l.titleAr)}
                      </span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '11.5px' }}>
                        {Math.round((l.durationSeconds || 0) / 60)} {lang === 'ar' ? 'دقيقة' : 'min'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : !loadingDetails && (
                <div style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>
                  {lang === 'ar' ? 'لا توجد حصص مضافة بعد لهذا المقرر' : 'No lessons uploaded yet'}
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
              {lang === 'ar' ? 'تأكيد أرشفة وحذف المقرر' : 'Confirm Course Removal'}
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {lang === 'ar'
                ? `سيتم إيقاف نشر المقرر (${courseToDelete.titleAr || courseToDelete.title}) وأرشفته مع تسجيل الحدث في سجل الأمان.`
                : `Course (${courseToDelete.titleEn || courseToDelete.title}) will be archived and soft-deleted with an audit entry.`}
            </p>
            <textarea
              rows={2}
              value={deleteReason}
              onChange={e => setDeleteReason(e.target.value)}
              placeholder={lang === 'ar' ? 'سبب الإزالة / الإشراف (اختياري)...' : 'Moderation reason (optional)...'}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'inherit'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                style={{ padding: '9px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer' }}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                style={{ padding: '9px 18px', borderRadius: '10px', border: 'none', backgroundColor: '#DC2626', color: '#fff', fontWeight: '700', cursor: deleting ? 'wait' : 'pointer' }}
              >
                {deleting ? (lang === 'ar' ? 'جاري التنفيذ...' : 'Removing...') : (lang === 'ar' ? 'تأكيد الحذف' : 'Remove Course')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
