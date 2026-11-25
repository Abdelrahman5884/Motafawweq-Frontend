import React, { useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export const DeleteCourseModal = ({
  course,
  isAr,
  isDark,
  isDeleting = false,
  error = '',
  onCancel,
  onConfirm,
}) => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !isDeleting) onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDeleting, onCancel]);

  if (!course) return null;

  const title = isAr ? course.titleAr : (course.titleEn || course.titleAr);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onCancel();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '400px',
        padding: '22px',
        boxShadow: 'var(--shadow-lg)',
        textAlign: 'center',
      }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px',
          color: '#EF4444',
        }}>
          <AlertTriangle size={22} />
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px' }}>
          {isAr ? 'تأكيد حذف المقرر الدراسي' : 'Confirm Delete Course'}
        </h3>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 18px', lineHeight: 1.55 }}>
          {isAr
            ? `هل أنت متأكد من رغبتك في حذف مقرر "${title}"؟ سيتم إزالته من قائمة المقررات النشطة.`
            : `Are you sure you want to delete "${title}"? It will be removed from your active courses.`}
        </p>

        {error && (
          <div style={{
            padding: '8px 12px',
            marginBottom: '14px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.28)',
            color: '#EF4444',
            fontSize: '12px',
            fontWeight: '700',
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            style={{
              padding: '9px',
              borderRadius: '7px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
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
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: isDeleting ? 'wait' : 'pointer',
              opacity: isDeleting ? 0.75 : 1,
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
            }}
          >
            {isDeleting && <Loader2 size={13} className="spin" />}
            <span>{isDeleting ? (isAr ? 'جاري الحذف...' : 'Deleting...') : (isAr ? 'نعم، حذف الكورس' : 'Delete Course')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
