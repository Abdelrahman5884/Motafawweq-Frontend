import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { adminApi } from '../../../services/adminApi';
import { InfoTooltip } from '../../../components/common/InfoTooltip';
import {
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  Megaphone,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  ChevronRight,
  ChevronLeft,
  Calendar,
  X,
} from 'lucide-react';

const EMPTY_FORM = {
  titleAr: '',
  titleEn: '',
  contentAr: '',
  contentEn: '',
  audience: 'all',
  priority: 'normal',
  expiresAt: '',
  active: true,
};

export const AdminAnnouncementsManager = () => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const [announcements, setAnnouncements] = useState([]);
  const [summary, setSummary] = useState({ total: 0, active: 0, urgent: 0 });
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  // Filters & Pagination
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const seqRef = useRef(0);

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

  const loadData = useCallback(async () => {
    const seq = ++seqRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.announcements.list({
        search: debouncedSearch || undefined,
        audience: audienceFilter !== 'all' ? audienceFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        active: statusFilter !== 'all' ? statusFilter : undefined,
        page,
        per_page: 10,
      });
      if (seq !== seqRef.current) return;

      setAnnouncements(Array.isArray(res?.data) ? res.data : []);
      if (res?.meta) {
        setMeta({
          current_page: Number(res.meta.current_page ?? page),
          last_page: Math.max(1, Number(res.meta.last_page ?? 1)),
          total: Number(res.meta.total ?? 0),
          per_page: Number(res.meta.per_page ?? 10),
        });
        if (res.meta.summary) setSummary(res.meta.summary);
      }
    } catch (err) {
      if (seq !== seqRef.current) return;
      setError(err?.message || (isAr ? 'تعذر تحميل الإعلانات' : 'Failed to load announcements'));
    } finally {
      if (seq === seqRef.current) setLoading(false);
    }
  }, [debouncedSearch, audienceFilter, priorityFilter, statusFilter, page, isAr]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) loadData();
    });
    return () => {
      active = false;
    };
  }, [loadData]);

  const emitSync = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('announcements-updated'));
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (ann) => {
    setEditingId(ann.id);
    setForm({
      titleAr: ann.titleAr || ann.title || '',
      titleEn: ann.titleEn || '',
      contentAr: ann.contentAr || ann.content || '',
      contentEn: ann.contentEn || '',
      audience: ann.audience || 'all',
      priority: ann.priority || 'normal',
      expiresAt: ann.expiresAt ? String(ann.expiresAt).slice(0, 10) : '',
      active: ann.active ?? ann.isActive ?? true,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleToggle = async (id) => {
    setBusyId(id);
    try {
      await adminApi.announcements.toggleActive(id);
      emitSync();
      showToast(isAr ? 'تم تحديث حالة الإعلان' : 'Announcement status updated');
      loadData();
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر تحديث الحالة' : 'Failed to toggle announcement'), 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!announcementToDelete) return;
    setSubmitting(true);
    try {
      await adminApi.announcements.delete(announcementToDelete.id);
      setAnnouncementToDelete(null);
      emitSync();
      showToast(isAr ? 'تم حذف الإعلان بنجاح' : 'Announcement deleted');
      loadData();
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر حذف الإعلان' : 'Failed to delete announcement'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const titleAr = (form.titleAr || form.titleEn).trim();
    const contentAr = (form.contentAr || form.contentEn).trim();
    if (titleAr.length < 3 || contentAr.length < 5) {
      setFormError(isAr ? 'يرجى إدخال عنوان (3 أحرف على الأقل) ومحتوى (5 أحرف على الأقل).' : 'Title (min 3) and content (min 5) required.');
      return;
    }

    const payload = {
      titleAr,
      titleEn: (form.titleEn || titleAr).trim(),
      contentAr,
      contentEn: (form.contentEn || contentAr).trim(),
      audience: form.audience,
      priority: form.priority,
      active: form.active,
      expiresAt: form.expiresAt ? `${form.expiresAt} 23:59:59` : null,
    };

    setSubmitting(true);
    try {
      if (editingId) {
        await adminApi.announcements.update(editingId, payload);
        showToast(isAr ? 'تم تحديث الإعلان بنجاح' : 'Announcement updated');
      } else {
        await adminApi.announcements.create(payload);
        showToast(isAr ? 'تم بث الإعلان بنجاح' : 'Announcement published');
      }
      setIsModalOpen(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      emitSync();
      loadData();
    } catch (err) {
      const firstErr =
        err?.errors && typeof err.errors === 'object'
          ? Object.values(err.errors).flat()[0]
          : null;
      setFormError(firstErr || err?.message || (isAr ? 'تعذر حفظ الإعلان' : 'Failed to save announcement'));
    } finally {
      setSubmitting(false);
    }
  };

  const audienceLabels = {
    all: isAr ? 'الجميع' : 'All Users',
    students: isAr ? 'الطلاب' : 'Students',
    teachers: isAr ? 'المعلمون' : 'Teachers',
    parents: isAr ? 'أولياء الأمور' : 'Parents',
    centers: isAr ? 'السناتر' : 'Centers',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
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
            fontSize: '13.5px',
            fontWeight: '700',
          }}
        >
          {toast.type === 'error' ? <AlertCircle size={18} color="#FCA5A5" /> : <CheckCircle size={18} color="var(--primary-light)" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header + Stats + Actions */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '18px',
          padding: '18px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(21, 136, 199, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
            }}
          >
            <Megaphone size={20} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {isAr ? 'الإعلانات' : 'Announcements'}
            </h3>
            <InfoTooltip
              size={14}
              text={
                isAr
                  ? 'بث وتعديل وإيقاف التنبيهات الرسمية التي تظهر للطلاب والمعلمين وأولياء الأمور والسناتر.'
                  : 'Publish, edit, and pause targeted platform notices across all portals.'
              }
            />
            <span style={{ padding: '3px 9px', borderRadius: '999px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)', fontSize: '11.5px', fontWeight: '800' }}>
              {isAr ? `الكل: ${summary.total}` : `Total: ${summary.total}`}
            </span>
            <span style={{ padding: '3px 9px', borderRadius: '999px', backgroundColor: 'rgba(22, 163, 74, 0.12)', color: '#15803D', fontSize: '11.5px', fontWeight: '800' }}>
              {isAr ? `منشور: ${summary.active}` : `Active: ${summary.active}`}
            </span>
            {summary.urgent > 0 && (
              <span style={{ padding: '3px 9px', borderRadius: '999px', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#B91C1C', fontSize: '11.5px', fontWeight: '800' }}>
                {isAr ? `عاجل: ${summary.urgent}` : `Urgent: ${summary.urgent}`}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            aria-label={isAr ? 'تحديث' : 'Refresh'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              padding: '9px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-primary)',
            }}
          >
            <Plus size={16} />
            <span>{isAr ? 'إعلان جديد' : 'New Notice'}</span>
          </button>
        </div>
      </div>

      {/* Compact Filter Bar */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              insetInlineStart: '11px',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={isAr ? 'بحث في العنوان أو المحتوى...' : 'Search title or content...'}
            style={{
              width: '100%',
              padding: '8px 32px 8px 34px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              fontWeight: '600',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput('')}
              style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineEnd: '8px', border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <select
          value={audienceFilter}
          onChange={(e) => { setAudienceFilter(e.target.value); setPage(1); }}
          style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}
        >
          <option value="all">{isAr ? 'كل الفئات' : 'All Audiences'}</option>
          <option value="students">{isAr ? 'الطلاب' : 'Students'}</option>
          <option value="teachers">{isAr ? 'المعلمون' : 'Teachers'}</option>
          <option value="parents">{isAr ? 'أولياء الأمور' : 'Parents'}</option>
          <option value="centers">{isAr ? 'السناتر' : 'Centers'}</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
          style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}
        >
          <option value="all">{isAr ? 'كل الأولويات' : 'All Priorities'}</option>
          <option value="normal">{isAr ? 'عادي' : 'Normal'}</option>
          <option value="important">{isAr ? 'هام' : 'Important'}</option>
          <option value="urgent">{isAr ? 'عاجل' : 'Urgent'}</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}
        >
          <option value="all">{isAr ? 'كل الحالات' : 'All Statuses'}</option>
          <option value="true">{isAr ? 'منشور' : 'Active'}</option>
          <option value="false">{isAr ? 'متوقف' : 'Paused'}</option>
        </select>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#B91C1C', fontSize: '13px', fontWeight: '700' }}>
          <span>{error}</span>
          <button type="button" onClick={loadData} style={{ backgroundColor: '#B91C1C', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
            {isAr ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ padding: '44px', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-subtle)', fontSize: '13px', fontWeight: '700' }}>
          {isAr ? 'جاري التحميل...' : 'Loading...'}
        </div>
      ) : announcements.length === 0 ? (
        <div style={{ padding: '44px', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-subtle)', fontSize: '13.5px' }}>
          {isAr ? 'لا توجد إعلانات مطابقة.' : 'No announcements found.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {announcements.map((ann) => {
            const isUrgent = ann.priority === 'urgent';
            const isImportant = ann.priority === 'important';
            const isActive = ann.active ?? ann.isActive ?? true;
            const titleText = isAr ? (ann.titleAr || ann.title) : (ann.titleEn || ann.title);
            const contentText = isAr ? (ann.contentAr || ann.content) : (ann.contentEn || ann.content);

            return (
              <div
                key={ann.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderInlineStart: `4px solid ${isUrgent ? '#DC2626' : isImportant ? '#D97706' : 'var(--primary)'}`,
                  opacity: busyId === ann.id ? 0.55 : isActive ? 1 : 0.65,
                  borderRadius: '16px',
                  padding: '18px 20px',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '3px 9px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '800',
                        backgroundColor: isUrgent ? 'rgba(239, 68, 68, 0.14)' : isImportant ? 'rgba(245, 158, 11, 0.14)' : 'rgba(21, 136, 199, 0.1)',
                        color: isUrgent ? '#B91C1C' : isImportant ? '#B45309' : 'var(--primary)',
                      }}
                    >
                      {isUrgent ? (isAr ? 'عاجل' : 'Urgent') : isImportant ? (isAr ? 'هام' : 'Important') : (isAr ? 'عادي' : 'Normal')}
                    </span>
                    <span style={{ padding: '3px 9px', borderRadius: '6px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '11.5px', fontWeight: '700' }}>
                      {audienceLabels[ann.audience] || ann.audience}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      <Calendar size={12} />
                      {ann.createdDate || '—'}
                      {ann.expiresAt && ` → ${String(ann.expiresAt).slice(0, 10)}`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      disabled={busyId === ann.id}
                      onClick={() => handleToggle(ann.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        padding: '5px 10px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        color: isActive ? '#15803D' : 'var(--text-secondary)',
                      }}
                    >
                      {isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                      <span>{isActive ? (isAr ? 'منشور' : 'Active') : (isAr ? 'متوقف' : 'Paused')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(ann)}
                      title={isAr ? 'تعديل' : 'Edit'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                      }}
                    >
                      <Edit3 size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setAnnouncementToDelete({ id: ann.id, title: titleText })}
                      title={isAr ? 'حذف' : 'Delete'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        border: '1px solid rgba(220, 38, 38, 0.25)',
                        backgroundColor: 'rgba(220, 38, 38, 0.06)',
                        color: '#DC2626',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)' }}>{titleText}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{contentText}</p>
              </div>
            );
          })}

          {/* Pagination */}
          {meta.last_page > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', paddingTop: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {isAr ? `صفحة ${meta.current_page} من ${meta.last_page} • إجمالي ${meta.total}` : `Page ${meta.current_page} of ${meta.last_page} • ${meta.total}`}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  disabled={meta.current_page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '9px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '12px', fontWeight: '800', cursor: meta.current_page <= 1 ? 'not-allowed' : 'pointer', opacity: meta.current_page <= 1 ? 0.45 : 1 }}
                >
                  {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                  <span>{isAr ? 'السابق' : 'Prev'}</span>
                </button>
                <button
                  type="button"
                  disabled={meta.current_page >= meta.last_page}
                  onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '9px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '12px', fontWeight: '800', cursor: meta.current_page >= meta.last_page ? 'not-allowed' : 'pointer', opacity: meta.current_page >= meta.last_page ? 0.45 : 1 }}
                >
                  <span>{isAr ? 'التالي' : 'Next'}</span>
                  {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => !submitting && setIsModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 37, 78, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="responsive-modal-box"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '22px',
              width: '100%',
              maxWidth: '520px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {editingId ? (isAr ? 'تعديل الإعلان' : 'Edit Announcement') : (isAr ? 'إعلان جديد' : 'New Announcement')}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div style={{ marginBottom: '12px', padding: '10px 12px', borderRadius: '10px', backgroundColor: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#DC2626', fontSize: '12.5px', fontWeight: '700' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                  {isAr ? 'العنوان *' : 'Title *'}
                </label>
                <input
                  type="text"
                  required
                  minLength={3}
                  value={isAr ? form.titleAr : form.titleEn}
                  onChange={(e) => setForm((prev) => (isAr ? { ...prev, titleAr: e.target.value } : { ...prev, titleEn: e.target.value }))}
                  placeholder={isAr ? 'عنوان الإعلان...' : 'Announcement title...'}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                  {isAr ? 'المحتوى *' : 'Content *'}
                </label>
                <textarea
                  required
                  minLength={5}
                  rows={3}
                  value={isAr ? form.contentAr : form.contentEn}
                  onChange={(e) => setForm((prev) => (isAr ? { ...prev, contentAr: e.target.value } : { ...prev, contentEn: e.target.value }))}
                  placeholder={isAr ? 'نص الإعلان...' : 'Announcement message...'}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>

              <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                    {isAr ? 'الفئة المستهدفة' : 'Audience'}
                  </label>
                  <select
                    value={form.audience}
                    onChange={(e) => setForm({ ...form, audience: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}
                  >
                    <option value="all">{isAr ? 'الجميع' : 'All Users'}</option>
                    <option value="students">{isAr ? 'الطلاب' : 'Students'}</option>
                    <option value="teachers">{isAr ? 'المعلمون' : 'Teachers'}</option>
                    <option value="parents">{isAr ? 'أولياء الأمور' : 'Parents'}</option>
                    <option value="centers">{isAr ? 'السناتر' : 'Centers'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                    {isAr ? 'الأولوية' : 'Priority'}
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}
                  >
                    <option value="normal">{isAr ? 'عادي' : 'Normal'}</option>
                    <option value="important">{isAr ? 'هام' : 'Important'}</option>
                    <option value="urgent">{isAr ? 'عاجل' : 'Urgent'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                  {isAr ? 'تاريخ الانتهاء (اختياري)' : 'Expiry Date (Optional)'}
                </label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}>
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" disabled={submitting} style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', padding: '9px 22px', borderRadius: '10px', fontWeight: '800', cursor: submitting ? 'wait' : 'pointer' }}>
                  {submitting ? (isAr ? 'جاري الحفظ...' : 'Saving...') : editingId ? (isAr ? 'حفظ التعديل' : 'Save Changes') : (isAr ? 'نشر الإعلان' : 'Publish')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {announcementToDelete && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.45)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '22px', width: '100%', maxWidth: '420px', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {isAr ? 'تأكيد حذف الإعلان' : 'Confirm Deletion'}
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {isAr ? `حذف إعلان «${announcementToDelete.title}»؟` : `Delete "${announcementToDelete.title}"?`}
            </p>
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button type="button" onClick={() => setAnnouncementToDelete(null)} style={{ flex: 1, backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '10px', borderRadius: '11px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button type="button" disabled={submitting} onClick={handleConfirmDelete} style={{ flex: 1, backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', padding: '10px', borderRadius: '11px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>
                {isAr ? 'حذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
