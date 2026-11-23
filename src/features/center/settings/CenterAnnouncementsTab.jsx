import React, { useState } from 'react';
import { Bell, Building, Calendar, Send, Trash2, User } from 'lucide-react';
import { errorText } from './centerSettingsUtils';

export const CenterAnnouncementsTab = ({
  lang,
  announcements = [],
  branches = [],
  addCenterAnnouncement,
  deleteCenterAnnouncement,
  showToast,
}) => {
  const isAr = lang === 'ar';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [branchId, setBranchId] = useState('all');
  const [isPublishing, setIsPublishing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsPublishing(true);
    try {
      const selectedBranch = branches.find((b) => b.id === branchId);
      const branchLabel =
        branchId === 'all'
          ? isAr
            ? 'جميع الفروع'
            : 'All Branches'
          : selectedBranch?.nameAr || (isAr ? 'الفرع المحدد' : 'Selected Branch');

      await addCenterAnnouncement({
        title_ar: title.trim(),
        content_ar: content.trim(),
        ...(branchId !== 'all' ? { branch_id: branchId } : {}),
        branch_label: branchLabel,
      });

      setTitle('');
      setContent('');
      if (showToast) {
        showToast(
          isAr ? 'تم نشر التعميم الإداري بنجاح.' : 'Announcement published.',
          'success'
        );
      }
    } catch (err) {
      if (showToast) {
        showToast(
          errorText(err, isAr ? 'تعذر نشر التعميم.' : 'Failed to publish.'),
          'warning'
        );
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteCenterAnnouncement(id);
      if (showToast) {
        showToast(isAr ? 'تم حذف التعميم الإداري.' : 'Announcement deleted.', 'info');
      }
    } catch (err) {
      if (showToast) {
        showToast(
          errorText(err, isAr ? 'تعذر حذف التعميم.' : 'Failed to delete.'),
          'warning'
        );
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* 1. Composer Card */}
      <div className="cs-card">
        <div className="cs-card-header">
          <h3 className="cs-card-title">
            <Send size={18} />
            <span>{isAr ? 'نشر تعميم أو توجيه إداري داخلي' : 'New Internal Announcement'}</span>
          </h3>
        </div>

        <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="cs-grid">
            <div className="cs-field">
              <label className="cs-label">{isAr ? 'عنوان التعميم *' : 'Title *'}</label>
              <input
                type="text"
                required
                maxLength={255}
                className="cs-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isAr ? 'مثال: تعليمات تسليم شيتات الامتحانات' : 'Announcement title'}
              />
            </div>

            <div className="cs-field">
              <label className="cs-label">{isAr ? 'الفرع المستهدف' : 'Target Branch'}</label>
              <select
                className="cs-select"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
              >
                <option value="all">{isAr ? 'جميع الفروع' : 'All Branches'}</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nameAr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="cs-field">
            <label className="cs-label">{isAr ? 'نص التعميم *' : 'Message Body *'}</label>
            <textarea
              rows={3}
              required
              maxLength={4000}
              className="cs-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isAr ? 'اكتب تفاصيل التوجيه أو التعميم الموجه لفريق العمل...' : 'Write message details...'}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={isPublishing}
              className="cs-btn cs-btn-primary"
            >
              <Send size={15} />
              <span>
                {isPublishing
                  ? isAr
                    ? 'جاري النشر...'
                    : 'Publishing...'
                  : isAr
                    ? 'نشر التعميم الآن'
                    : 'Publish'}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Announcements Feed Card */}
      <div className="cs-card">
        <div className="cs-card-header">
          <h3 className="cs-card-title">
            <Bell size={18} />
            <span>
              {isAr ? `التعميمات المنشورة (${announcements.length})` : `Announcements (${announcements.length})`}
            </span>
          </h3>
        </div>

        {announcements.length === 0 ? (
          <div className="cs-empty">
            {isAr
              ? 'لا توجد تعميمات داخلية منشورة حالياً.'
              : 'No announcements published yet.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {announcements.map((ann) => (
              <div
                key={ann.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md, 12px)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {ann.titleAr}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: 'var(--primary-light, rgba(21, 136, 199, 0.1))',
                        color: 'var(--primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Building size={11} />
                      <span>{ann.branch || (isAr ? 'جميع الفروع' : 'All Branches')}</span>
                    </span>

                    <button
                      type="button"
                      disabled={deletingId === ann.id}
                      onClick={() => handleDelete(ann.id)}
                      className="cs-btn cs-btn-danger cs-icon-btn"
                      title={isAr ? 'حذف التعميم' : 'Delete'}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    margin: '0 0 10px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {ann.contentAr}
                </p>

                <div
                  style={{
                    fontSize: '11.5px',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    gap: '14px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} />
                    <span>{ann.author || (isAr ? 'إدارة السنتر' : 'Center Admin')}</span>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    <span>{ann.date || ''}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
