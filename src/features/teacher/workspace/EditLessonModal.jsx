import React, { useEffect } from 'react';
import { X, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { MAX_STORAGE_FILE_SIZE_BYTES } from '../../../services/storageService';
import { formatBytesLabel } from './workspaceUtils';

export const EditLessonModal = ({
  isOpen,
  lesson,
  editForm,
  onChangeForm,
  coursesList,
  groupsList,
  editMediaFile,
  onChangeMediaFile,
  editNewPdfs,
  onChangeNewPdfs,
  editNewImages,
  onChangeNewImages,
  isSaving,
  saveProgress,
  saveError,
  onClearError,
  lang,
  onClose,
  onSubmit,
  onDeleteExistingAttachment,
}) => {
  const isAr = lang === 'ar';

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape' && !isSaving) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen || !lesson) return null;

  const existingAttachments = [...(lesson.lessonPdfs || []), ...(lesson.lessonImages || [])];

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => !isSaving && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmit}
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          maxWidth: '620px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '10px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {isAr ? 'تعديل بيانات وملفات الحصة' : 'Edit Lesson & Materials'}
          </h3>
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: isSaving ? 'not-allowed' : 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Title */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {isAr ? 'عنوان الحصة' : 'Lesson Title'}
          </label>
          <input
            type="text"
            required
            minLength={3}
            value={editForm.titleAr}
            onChange={(e) => onChangeForm({ titleAr: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13.5px',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Course & Group */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              {isAr ? 'المقرر الدراسي' : 'Course'}
            </label>
            <select
              value={editForm.courseId}
              onChange={(e) => onChangeForm({ courseId: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'inherit',
              }}
            >
              <option value="">{isAr ? '-- بدون ربط بمقرر --' : '-- None --'}</option>
              {coursesList.map((c) => (
                <option key={c.uuid || c.id} value={c.uuid || c.id}>
                  {c.titleAr || c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              {isAr ? 'المجموعة والقاعة' : 'Group'}
            </label>
            <select
              value={editForm.classGroup}
              onChange={(e) => onChangeForm({ classGroup: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'inherit',
              }}
            >
              <option value="">{isAr ? '-- جميع المجموعات --' : '-- All Groups --'}</option>
              {groupsList.map((g) => (
                <option key={g.uuid || g.id || g.code} value={g.code || g.uuid || g.id}>
                  {g.nameAr || g.name || g.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {isAr ? 'وصف الحصة' : 'Description'}
          </label>
          <textarea
            rows={3}
            value={editForm.descriptionAr}
            onChange={(e) => onChangeForm({ descriptionAr: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Media File Replacement */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {isAr ? 'استبدال أو رفع ملف صوت/فيديو جديد (حتى 50 م.ب — اختياري)' : 'Replace Audio/Video File (up to 50 MB — optional)'}
          </label>
          <input
            type="file"
            accept="audio/*,video/*"
            disabled={isSaving}
            onChange={(e) => {
              onClearError();
              onChangeMediaFile(e.target.files?.[0] || null);
            }}
            style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}
          />
          {editMediaFile && (
            <div style={{ fontSize: '11.5px', color: editMediaFile.size > MAX_STORAGE_FILE_SIZE_BYTES ? '#EF4444' : 'var(--primary)', marginTop: '4px', fontWeight: '700' }}>
              {editMediaFile.name} ({formatBytesLabel(editMediaFile.size)})
            </div>
          )}
        </div>

        {/* Embed URL */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {isAr ? 'رابط فيديو خارجي (YouTube / Shorts / Vimeo — اختياري)' : 'External Video URL (YouTube / Vimeo — optional)'}
          </label>
          <input
            type="url"
            dir="ltr"
            value={editForm.embedUrl}
            onChange={(e) => onChangeForm({ embedUrl: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=... / https://vimeo.com/..."
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Add New PDFs & Whiteboard Images */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              {isAr ? 'إضافة ملفات PDF جديدة' : 'Add New PDFs'}
            </label>
            <input
              type="file"
              accept="application/pdf,.pdf"
              multiple
              disabled={isSaving}
              onChange={(e) => {
                onClearError();
                onChangeNewPdfs(Array.from(e.target.files || []));
              }}
              style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
            />
            {editNewPdfs.length > 0 && (
              <div style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '3px', fontWeight: '700' }}>
                {isAr ? `${editNewPdfs.length} ملفات مختارة` : `${editNewPdfs.length} selected`}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              {isAr ? 'إضافة صور سبورة جديدة' : 'Add New Whiteboard Images'}
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              disabled={isSaving}
              onChange={(e) => {
                onClearError();
                onChangeNewImages(Array.from(e.target.files || []));
              }}
              style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
            />
            {editNewImages.length > 0 && (
              <div style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '3px', fontWeight: '700' }}>
                {isAr ? `${editNewImages.length} صور مختارة` : `${editNewImages.length} selected`}
              </div>
            )}
          </div>
        </div>

        {/* Existing Attachments Quick Delete */}
        {existingAttachments.length > 0 && (
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {isAr ? `المرفقات الحالية (${existingAttachments.length}):` : `Current Attachments (${existingAttachments.length}):`}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
              {existingAttachments.map((att) => (
                <div key={att.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', fontSize: '12.5px', color: 'var(--text-primary)' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {att.title || att.fileName}
                  </span>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => onDeleteExistingAttachment(lesson.id, att.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'transparent',
                      border: 'none',
                      color: '#EF4444',
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: '700',
                      flexShrink: 0,
                    }}
                  >
                    <Trash2 size={12} />
                    <span>{isAr ? 'حذف' : 'Remove'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isSaving && saveProgress > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
              <span>{isAr ? 'جاري رفع الملفات وحفظ التعديلات...' : 'Uploading & saving...'}</span>
              <span>{saveProgress}%</span>
            </div>
            <div style={{ height: '6px', borderRadius: '999px', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
              <div style={{ width: `${saveProgress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.2s ease' }} />
            </div>
          </div>
        )}

        {/* Inline Error */}
        {saveError && (
          <div
            style={{
              padding: '9px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{saveError}</span>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            style={{
              padding: '9px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: isSaving ? 'not-allowed' : 'pointer',
            }}
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={isSaving}
            style={{
              padding: '9px 20px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '800',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.72 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
            }}
          >
            {isSaving && <Loader2 size={14} className="lw-spin" />}
            <span>{isSaving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : isAr ? 'حفظ التعديلات' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
