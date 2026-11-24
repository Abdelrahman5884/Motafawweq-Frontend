import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { adminApi } from '../../../services/adminApi';
import {
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Megaphone,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X
} from 'lucide-react';

export const AdminAnnouncementsManager = () => {
  const { lang, isRtl } = useLanguage();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const [form, setForm] = useState({
    titleAr: '',
    titleEn: '',
    contentAr: '',
    contentEn: '',
    audience: 'all',
    priority: 'normal',
  });

  const showToast = useCallback((text, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ text, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.announcements.list();
      setAnnouncements(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err?.message || (lang === 'ar' ? 'تعذر تحميل الإعلانات' : 'Failed to load announcements'));
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const emitSync = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('announcements-updated'));
    }
  };

  const handleToggle = async (id) => {
    try {
      await adminApi.announcements.toggleActive(id);
      emitSync();
      showToast(lang === 'ar' ? 'تم تحديث حالة تفعيل الإعلان' : 'Announcement status updated');
      loadData();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر تحديث حالة الإعلان' : 'Failed to toggle announcement'), 'error');
    }
  };

  const handleOpenDelete = (ann) => {
    setAnnouncementToDelete({
      id: ann.id,
      title: lang === 'ar' ? (ann.titleAr || ann.title) : (ann.titleEn || ann.title),
    });
  };

  const handleConfirmDelete = async () => {
    if (!announcementToDelete) return;
    setSubmitting(true);
    try {
      await adminApi.announcements.delete(announcementToDelete.id);
      setAnnouncementToDelete(null);
      emitSync();
      showToast(lang === 'ar' ? 'تم حذف الإعلان بنجاح' : 'Announcement deleted successfully');
      loadData();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر حذف الإعلان' : 'Failed to delete announcement'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const titleAr = (form.titleAr || form.titleEn).trim();
    const contentAr = (form.contentAr || form.contentEn).trim();
    if (!titleAr || !contentAr) return;

    setSubmitting(true);
    try {
      await adminApi.announcements.create({
        titleAr,
        titleEn: (form.titleEn || titleAr).trim(),
        contentAr,
        contentEn: (form.contentEn || contentAr).trim(),
        audience: form.audience,
        priority: form.priority,
        active: true,
      });
      setIsModalOpen(false);
      setForm({ titleAr: '', titleEn: '', contentAr: '', contentEn: '', audience: 'all', priority: 'normal' });
      emitSync();
      showToast(lang === 'ar' ? 'تم بث الإعلان بنجاح في شريط المنصة' : 'Announcement broadcasted successfully');
      loadData();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر نشر الإعلان' : 'Failed to create announcement'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const audienceLabels = {
    all: lang === 'ar' ? 'جميع مستخدمي المنصة' : 'All Users',
    students: lang === 'ar' ? 'الطلاب فقط' : 'Students Only',
    teachers: lang === 'ar' ? 'المعلمون فقط' : 'Teachers Only',
    parents: lang === 'ar' ? 'أولياء الأمور فقط' : 'Parents Only',
    centers: lang === 'ar' ? 'السناتر التعليمية فقط' : 'Centers Only',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', left: isRtl ? '24px' : 'auto', right: isRtl ? 'auto' : '24px',
          backgroundColor: toast.type === 'error' ? '#991B1B' : 'var(--color-brand-dark)', color: '#FFFFFF',
          padding: '12px 20px', borderRadius: '12px', boxShadow: 'var(--shadow-lg)',
          display: 'flex', alignItems: 'center', gap: '10px', zIndex: 9999, fontSize: '14px', fontWeight: '600'
        }}>
          {toast.type === 'error'
            ? <AlertCircle size={18} color="#FCA5A5" />
            : <CheckCircle size={18} color="var(--primary-light)" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Top Banner */}
      <div style={{
        backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '18px',
        padding: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
        gap: '14px', boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(21, 136, 199, 0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
          }}>
            <Megaphone size={22} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 2px', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'شريط الأخبار والإعلانات العاجلة' : 'Platform Announcements & News Ticker'}
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'بث رسائل وتنبيهات فورية تظهر أعلى صفحات المنصة وفي تطبيق الطالب والمعلم والسنتر' : 'Broadcast immediate news and banners to targeted platform users'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            style={{
              width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', color: '#FFFFFF',
              border: 'none', padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            <span>{lang === 'ar' ? 'بث إعلان جديد' : 'New Announcement'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px',
          padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#B91C1C', fontSize: '13px', fontWeight: '600'
        }}>
          <span>{error}</span>
          <button type="button" onClick={loadData} style={{ backgroundColor: '#B91C1C', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer' }}>
            {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* Announcements List */}
      {loading ? (
        <div style={{ padding: '44px', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          {lang === 'ar' ? 'جاري تحميل الإعلانات...' : 'Loading announcements...'}
        </div>
      ) : announcements.length === 0 ? (
        <div style={{ padding: '44px', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          {lang === 'ar' ? 'لا توجد إعلانات حالياً — اضغط "بث إعلان جديد" لإرسال أول تنبيه' : 'No announcements yet'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {announcements.map(ann => {
            const isUrgent = ann.priority === 'urgent';
            const isImportant = ann.priority === 'important';
            const isActive = ann.active ?? ann.isActive ?? true;
            const titleText = lang === 'ar' ? (ann.titleAr || ann.title) : (ann.titleEn || ann.title);
            const contentText = lang === 'ar' ? (ann.contentAr || ann.content) : (ann.contentEn || ann.content);

            return (
              <div
                key={ann.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: isActive ? '1.5px solid var(--border-subtle)' : '1px solid var(--border-subtle)',
                  opacity: isActive ? 1 : 0.65,
                  borderRadius: '16px', padding: '20px', boxShadow: 'var(--shadow-sm)',
                  display: 'flex', flexDirection: 'column', gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      padding: '3px 9px', borderRadius: '6px', fontSize: '11px', fontWeight: '700',
                      backgroundColor: isUrgent ? 'rgba(239, 68, 68, 0.14)' : isImportant ? 'rgba(245, 158, 11, 0.14)' : 'rgba(21, 136, 199, 0.1)',
                      color: isUrgent ? '#B91C1C' : isImportant ? '#B45309' : 'var(--primary)'
                    }}>
                      {isUrgent ? (lang === 'ar' ? 'عاجل' : 'Urgent') : isImportant ? (lang === 'ar' ? 'هام' : 'Important') : (lang === 'ar' ? 'تنبيه عام' : 'Notice')}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'موجّه إلى: ' : 'Target: '}<strong>{audienceLabels[ann.audience] || ann.audience}</strong>
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleToggle(ann.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'transparent',
                        border: '1px solid var(--border-subtle)', padding: '4px 10px', borderRadius: '8px',
                        fontSize: '12px', cursor: 'pointer', color: isActive ? 'var(--primary)' : 'var(--text-secondary)'
                      }}
                    >
                      {isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                      <span>{isActive ? (lang === 'ar' ? 'منشور' : 'Active') : (lang === 'ar' ? 'معطل' : 'Paused')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenDelete(ann)}
                      title={lang === 'ar' ? 'حذف الإعلان' : 'Delete'}
                      style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>{titleText}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{contentText}</p>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {lang === 'ar' ? 'تاريخ البث: ' : 'Broadcast Date: '}{ann.createdDate || '—'}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div className="responsive-modal-box" style={{
            backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-subtle)', borderRadius: '24px',
            width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'بث تنبيه أو إعلان جديد' : 'New Platform Announcement'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  {lang === 'ar' ? 'عنوان الإعلان' : 'Announcement Title'} *
                </label>
                <input
                  type="text"
                  required
                  minLength={3}
                  value={lang === 'ar' ? form.titleAr : form.titleEn}
                  onChange={e => setForm(prev => (lang === 'ar' ? { ...prev, titleAr: e.target.value } : { ...prev, titleEn: e.target.value }))}
                  placeholder={lang === 'ar' ? 'مثال: انطلاق تصفيات مسابقة أوائل الجمهورية' : 'e.g. Launch of National Excellence Finals'}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  {lang === 'ar' ? 'نص وتفاصيل الإعلان' : 'Announcement Content'} *
                </label>
                <textarea
                  required
                  minLength={5}
                  rows={3}
                  value={lang === 'ar' ? form.contentAr : form.contentEn}
                  onChange={e => setForm(prev => (lang === 'ar' ? { ...prev, contentAr: e.target.value } : { ...prev, contentEn: e.target.value }))}
                  placeholder={lang === 'ar' ? 'اكتب التنبيه الذي سيظهر للمستخدمين...' : 'Enter announcement message...'}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
                />
              </div>

              <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'الفئة المستهدفة' : 'Target Audience'}
                  </label>
                  <select
                    value={form.audience}
                    onChange={e => setForm({ ...form, audience: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}
                  >
                    <option value="all">{lang === 'ar' ? 'الجميع' : 'All Users'}</option>
                    <option value="students">{lang === 'ar' ? 'الطلاب فقط' : 'Students Only'}</option>
                    <option value="teachers">{lang === 'ar' ? 'المعلمون فقط' : 'Teachers Only'}</option>
                    <option value="parents">{lang === 'ar' ? 'أولياء الأمور فقط' : 'Parents Only'}</option>
                    <option value="centers">{lang === 'ar' ? 'السناتر التعليمية فقط' : 'Centers Only'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'درجة الأهمية' : 'Priority Level'}
                  </label>
                  <select
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}
                  >
                    <option value="normal">{lang === 'ar' ? 'عادي' : 'Normal'}</option>
                    <option value="important">{lang === 'ar' ? 'هام' : 'Important'}</option>
                    <option value="urgent">{lang === 'ar' ? 'عاجل' : 'Urgent'}</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer' }}>
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" disabled={submitting} style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', padding: '8px 22px', borderRadius: '10px', fontWeight: '700', cursor: submitting ? 'wait' : 'pointer' }}>
                  {submitting ? (lang === 'ar' ? 'جاري البث...' : 'Broadcasting...') : (lang === 'ar' ? 'بث فوري' : 'Broadcast')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {announcementToDelete && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.45)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-subtle)', borderRadius: '24px',
            width: '100%', maxWidth: '440px', padding: '28px 24px', boxShadow: '0 25px 50px -12px rgba(6, 37, 78, 0.25)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px'
          }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trash2 size={28} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'تأكيد حذف الإعلان' : 'Confirm Announcement Deletion'}
              </h3>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {lang === 'ar' ? `هل أنت متأكد من حذف إعلان (${announcementToDelete.title})؟` : `Are you sure you want to delete (${announcementToDelete.title})?`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button type="button" onClick={() => setAnnouncementToDelete(null)} style={{ flex: 1, backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '11px 18px', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button type="button" disabled={submitting} onClick={handleConfirmDelete} style={{ flex: 1, backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', padding: '11px 18px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                {lang === 'ar' ? 'تأكيد الحذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
