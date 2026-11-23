import React, { useState } from 'react';
import { Bell, Building, Calendar, Plus, Trash2, User } from 'lucide-react';

export const CenterAnnouncementsTab = ({
  lang,
  announcements = [],
  branches = [],
  addCenterAnnouncement,
  deleteCenterAnnouncement,
  showToast,
}) => {
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
      const selectedBranchObj = branches.find((b) => b.id === branchId);
      const branchLabel =
        branchId === 'all'
          ? lang === 'ar'
            ? 'جميع الفروع'
            : 'All Branches'
          : selectedBranchObj?.nameAr || (lang === 'ar' ? 'الفرع المحدد' : 'Selected Branch');

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
          lang === 'ar' ? 'تم نشر التعميم الإداري بنجاح.' : 'Announcement published.',
          'success'
        );
      }
    } catch (err) {
      if (showToast) {
        showToast(
          err?.message ||
            (lang === 'ar' ? 'تعذر نشر الإعلان الإداري.' : 'Failed to publish announcement.'),
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
        showToast(
          lang === 'ar' ? 'تم حذف التعميم الإداري.' : 'Announcement deleted.',
          'info'
        );
      }
    } catch (err) {
      if (showToast) {
        showToast(
          err?.message || (lang === 'ar' ? 'تعذر حذف الإعلان.' : 'Failed to delete announcement.'),
          'warning'
        );
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Publish Form */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '22px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 14px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Bell size={18} style={{ color: 'var(--primary)' }} />
          <span>
            {lang === 'ar'
              ? 'نشر تعميم أو إعلان داخلي لفريق العمل'
              : 'Publish Internal Staff Announcement'}
          </span>
        </h3>

        <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
            }}
          >
            <input
              type="text"
              required
              maxLength={255}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === 'ar' ? 'عنوان التعميم الإداري' : 'Announcement Title'}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            />

            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            >
              <option value="all">
                {lang === 'ar' ? 'تعميم لجميع الفروع' : 'All Branches'}
              </option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nameAr}
                </option>
              ))}
            </select>
          </div>

          <textarea
            rows={3}
            required
            maxLength={4000}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              lang === 'ar'
                ? 'نص الإعلان أو التعليمات الموجهة لموظفي الاستقبال والمشرفين...'
                : 'Write announcement details...'
            }
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontFamily: 'inherit',
            }}
          />

          <button
            type="submit"
            disabled={isPublishing}
            style={{
              alignSelf: 'flex-start',
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '700',
              cursor: isPublishing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Plus size={15} />
            <span>
              {isPublishing
                ? lang === 'ar'
                  ? 'جاري النشر...'
                  : 'Publishing...'
                : lang === 'ar'
                  ? 'نشر التعميم الآن'
                  : 'Publish Announcement'}
            </span>
          </button>
        </form>
      </div>

      {/* Announcements Feed */}
      {announcements.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '36px 24px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '13.5px',
          }}
        >
          {lang === 'ar'
            ? 'لا توجد تعميمات أو إعلانات داخلية منشورة حالياً.'
            : 'No internal announcements published yet.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {announcements.map((ann) => (
            <div
              key={ann.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                padding: '18px 22px',
                boxShadow: 'var(--shadow-sm)',
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
                <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {ann.titleAr}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '11px',
                      fontWeight: '700',
                      backgroundColor: 'var(--primary-subtle)',
                      color: 'var(--primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Building size={12} />
                    <span>{ann.branch || (lang === 'ar' ? 'جميع الفروع' : 'All Branches')}</span>
                  </span>

                  <button
                    type="button"
                    disabled={deletingId === ann.id}
                    onClick={() => handleDelete(ann.id)}
                    title={lang === 'ar' ? 'حذف التعميم' : 'Delete Announcement'}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '30px',
                      height: '30px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(220, 38, 38, 0.25)',
                      backgroundColor: 'rgba(220, 38, 38, 0.06)',
                      color: 'var(--color-danger, #DC2626)',
                      cursor: deletingId === ann.id ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  margin: '0 0 12px 0',
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
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <User size={12} />
                  <span>{ann.author || (lang === 'ar' ? 'إدارة السنتر' : 'Center Admin')}</span>
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
  );
};
