import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  getAnnouncements,
  addAnnouncement,
  toggleAnnouncementActive,
  deleteAnnouncement
} from '../../../services/announcementsStorage';
import {
  BellRing,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  Megaphone,
  CheckCircle,
  X
} from 'lucide-react';

export const AdminAnnouncementsManager = () => {
  const { lang, isRtl } = useLanguage();
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const loadData = () => {
    setAnnouncements(getAnnouncements());
  };

  useEffect(() => {
    loadData();
    const handleSync = () => loadData();
    window.addEventListener('announcements-updated', handleSync);
    return () => window.removeEventListener('announcements-updated', handleSync);
  }, []);

  const [form, setForm] = useState({
    titleAr: '',
    titleEn: '',
    contentAr: '',
    contentEn: '',
    audience: 'all',
    priority: 'normal'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggle = (id) => {
    toggleAnnouncementActive(id);
    loadData();
    showToast(lang === 'ar' ? 'تم تحديث حالة تفعيل الإعلان' : 'Announcement status updated');
  };

  const handleOpenDelete = (ann) => {
    setAnnouncementToDelete({
      id: ann.id,
      title: lang === 'ar' ? (ann.titleAr || ann.title) : (ann.titleEn || ann.title)
    });
  };

  const handleConfirmDelete = () => {
    if (!announcementToDelete) return;
    deleteAnnouncement(announcementToDelete.id);
    loadData();
    showToast(lang === 'ar' ? 'تم حذف الإعلان بنجاح' : 'Announcement deleted successfully');
    setAnnouncementToDelete(null);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const title = lang === 'ar' ? form.titleAr : (form.titleEn || form.titleAr);
    const content = lang === 'ar' ? form.contentAr : (form.contentEn || form.contentAr);
    if (!title.trim() || !content.trim()) return;

    addAnnouncement({
      titleAr: form.titleAr || form.titleEn,
      titleEn: form.titleEn || form.titleAr,
      contentAr: form.contentAr || form.contentEn,
      contentEn: form.contentEn || form.contentAr,
      audience: form.audience,
      priority: form.priority,
      active: true
    });
    setIsModalOpen(false);
    setForm({ titleAr: '', titleEn: '', contentAr: '', contentEn: '', audience: 'all', priority: 'normal' });
    showToast(lang === 'ar' ? 'تم نشر الإعلان بنجاح في شريط المنصة' : 'Announcement broadcasted successfully');
    loadData();
  };

  const audienceLabels = {
    all: lang === 'ar' ? 'جميع مستخدمي المنصة' : 'All Users',
    students: lang === 'ar' ? 'الطلاب فقط' : 'Students Only',
    teachers: lang === 'ar' ? 'المعلمون فقط' : 'Teachers Only',
    parents: lang === 'ar' ? 'أولياء الأمور فقط' : 'Parents Only'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: isRtl ? '24px' : 'auto',
          right: isRtl ? 'auto' : '24px',
          backgroundColor: 'var(--color-brand-dark)',
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
          <CheckCircle size={18} color="var(--primary-light)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '18px',
        padding: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'rgba(21, 136, 199, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Megaphone size={22} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 2px', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'شريط الأخبار والإعلانات العاجلة' : 'Platform Announcements & News Ticker'}
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'بث رسائل وتنبيهات فورية تظهر أعلى صفحات المنصة وفي تطبيق الطالب والمعلم' : 'Broadcast immediate news and banners to targeted platform users'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            padding: '9px 18px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          <span>{lang === 'ar' ? 'بث إعلان جديد' : 'New Announcement'}</span>
        </button>
      </div>

      {/* Announcements List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {announcements.map(ann => {
          const isUrgent = ann.priority === 'urgent';
          const isImportant = ann.priority === 'important';

          const titleText = lang === 'ar' ? (ann.titleAr || ann.title) : (ann.titleEn || ann.title);
          const contentText = lang === 'ar' ? (ann.contentAr || ann.content) : (ann.contentEn || ann.content);

          return (
            <div
              key={ann.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: ann.active ? '1.5px solid var(--border-subtle)' : '1px solid var(--border-subtle)',
                opacity: ann.active ? 1 : 0.65,
                borderRadius: '16px',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    backgroundColor: isUrgent ? 'rgba(21, 136, 199, 0.18)' : isImportant ? 'rgba(92, 182, 219, 0.18)' : 'rgba(21, 136, 199, 0.08)',
                    color: isUrgent ? 'var(--primary)' : isImportant ? 'var(--primary-light, #5CB6DB)' : 'var(--text-secondary)'
                  }}>
                    {isUrgent
                      ? (lang === 'ar' ? 'عاجل' : 'Urgent')
                      : isImportant
                      ? (lang === 'ar' ? 'هام' : 'Important')
                      : (lang === 'ar' ? 'تنبيه عام' : 'Notice')}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'موجّه إلى: ' : 'Target: '}<strong>{audienceLabels[ann.audience] || ann.audience}</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleToggle(ann.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      color: ann.active ? 'var(--primary)' : 'var(--text-secondary)'
                    }}
                  >
                    {ann.active ? <Eye size={13} /> : <EyeOff size={13} />}
                    <span>{ann.active ? (lang === 'ar' ? 'منشور' : 'Active') : (lang === 'ar' ? 'معطل' : 'Paused')}</span>
                  </button>

                  <button
                    onClick={() => handleOpenDelete(ann)}
                    title={lang === 'ar' ? 'حذف الإعلان' : 'Delete Announcement'}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {titleText}
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {contentText}
              </p>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {lang === 'ar' ? 'تاريخ البث: ' : 'Broadcast Date: '}{ann.createdDate}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(6, 37, 78, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div 
            className="responsive-modal-box"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '520px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
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
                  value={lang === 'ar' ? form.titleAr : form.titleEn}
                  onChange={e => {
                    if (lang === 'ar') setForm({ ...form, titleAr: e.target.value, titleEn: form.titleEn || e.target.value });
                    else setForm({ ...form, titleEn: e.target.value, titleAr: form.titleAr || e.target.value });
                  }}
                  placeholder={lang === 'ar' ? 'مثال: انطلاق تصفيات مسابقة أوائل الجمهورية' : 'e.g. Launch of National Excellence Finals'}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  {lang === 'ar' ? 'نص وتفاصيل الإعلان' : 'Announcement Content'} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={lang === 'ar' ? form.contentAr : form.contentEn}
                  onChange={e => {
                    if (lang === 'ar') setForm({ ...form, contentAr: e.target.value, contentEn: form.contentEn || e.target.value });
                    else setForm({ ...form, contentEn: e.target.value, contentAr: form.contentAr || e.target.value });
                  }}
                  placeholder={lang === 'ar' ? 'اكتب التنبيه الذي سيظهر للمستخدمين...' : 'Enter announcement message...'}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit'
                  }}
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
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)'
                    }}
                  >
                    <option value="all">{lang === 'ar' ? 'الجميع' : 'All Users'}</option>
                    <option value="students">{lang === 'ar' ? 'الطلاب فقط' : 'Students Only'}</option>
                    <option value="teachers">{lang === 'ar' ? 'المعلمون فقط' : 'Teachers Only'}</option>
                    <option value="parents">{lang === 'ar' ? 'أولياء الأمور فقط' : 'Parents Only'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'درجة الأهمية' : 'Priority Level'}
                  </label>
                  <select
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)'
                    }}
                  >
                    <option value="normal">{lang === 'ar' ? 'عادي' : 'Normal'}</option>
                    <option value="important">{lang === 'ar' ? 'هام' : 'Important'}</option>
                    <option value="urgent">{lang === 'ar' ? 'عاجل' : 'Urgent'}</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer' }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', padding: '8px 22px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                >
                  {lang === 'ar' ? 'بث فوري' : 'Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Themed Delete Confirmation Dialog */}
      {announcementToDelete && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(6, 37, 78, 0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '440px',
            padding: '28px 24px',
            boxShadow: '0 25px 50px -12px rgba(6, 37, 78, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '16px',
            direction: isRtl ? 'rtl' : 'ltr'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <Trash2 size={28} />
            </div>

            <div>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'تأكيد حذف الإعلان' : 'Confirm Announcement Deletion'}
              </h3>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {lang === 'ar' ? (
                  <>
                    هل أنت متأكد من حذف إعلان <strong style={{ color: 'var(--text-primary)' }}>({announcementToDelete.title})</strong> من المنصة؟
                  </>
                ) : (
                  <>
                    Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>({announcementToDelete.title})</strong>?
                  </>
                )}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setAnnouncementToDelete(null)}
                style={{
                  flex: 1,
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  padding: '11px 18px',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                style={{
                  flex: 1,
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '11px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)',
                  transition: 'all 0.15s ease'
                }}
              >
                {lang === 'ar' ? 'تأكيد الحذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
