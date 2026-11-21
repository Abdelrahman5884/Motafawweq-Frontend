import React, { useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export const DeleteExamModal = ({
  dialog,
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

  if (!dialog?.isOpen) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) onCancel(); }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 2300,
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
        maxWidth: '390px',
        padding: '22px',
        boxShadow: 'var(--shadow-lg)',
        textAlign: 'center',
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px',
          color: '#EF4444',
        }}>
          <AlertTriangle size={20} />
        </div>

        <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
          {isAr ? 'تأكيد الحذف' : 'Confirm Delete'}
        </h3>

        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 18px', lineHeight: 1.55 }}>
          {isAr
            ? `هل أنت متأكد من حذف "${dialog.title}"؟`
            : `Are you sure you want to delete "${dialog.title}"?`}
        </p>

        {error && (
          <div style={{
            padding: '8px 10px',
            marginBottom: '12px',
            borderRadius: '7px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.28)',
            color: '#EF4444',
            fontSize: '12px',
            fontWeight: '700',
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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
              fontSize: '12px',
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
              gap: '5px',
              padding: '9px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: '800',
              cursor: isDeleting ? 'wait' : 'pointer',
            }}
          >
            {isDeleting && <Loader2 size={13} className="spin" />}
            <span>{isDeleting ? (isAr ? 'جاري الحذف...' : 'Deleting...') : (isAr ? 'نعم، حذف' : 'Delete')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
