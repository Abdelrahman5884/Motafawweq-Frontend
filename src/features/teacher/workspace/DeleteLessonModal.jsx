import React from 'react';
import { AlertTriangle, AlertCircle, Loader2 } from 'lucide-react';

export const DeleteLessonModal = ({
  lesson,
  isDeleting,
  deleteError,
  lang,
  onCancel,
  onConfirm,
}) => {
  if (!lesson) return null;
  const isAr = lang === 'ar';

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => !isDeleting && onCancel()}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(2px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#EF4444' }}>
          <AlertTriangle size={22} />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {isAr ? 'تأكيد حذف الحصة' : 'Confirm Lesson Deletion'}
          </h3>
        </div>

        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 18px', lineHeight: 1.6 }}>
          {isAr
            ? `هل أنت متأكد من حذف «${lesson.titleAr}»؟ سيتم تحديث عدد الحصص في المقرر المرتبط تلقائياً.`
            : `Are you sure you want to delete "${lesson.title}"? Linked course lesson count will update automatically.`}
        </p>

        {deleteError && (
          <div
            style={{
              marginBottom: '14px',
              padding: '9px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{deleteError}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
            }}
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '700',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              opacity: isDeleting ? 0.7 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {isDeleting && <Loader2 size={14} className="lw-spin" />}
            <span>{isDeleting ? (isAr ? 'جاري الحذف...' : 'Deleting...') : isAr ? 'حذف الحصة' : 'Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
