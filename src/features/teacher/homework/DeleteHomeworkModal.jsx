import React from 'react';
import { AlertTriangle, AlertCircle, Loader2 } from 'lucide-react';

export const DeleteHomeworkModal = ({
  isOpen,
  title,
  isDeleting,
  error,
  isAr,
  isDark,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => !isDeleting && onCancel()}
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
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '400px',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
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
          }}
        >
          <AlertTriangle size={22} />
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px' }}>
          {isAr ? 'تأكيد حذف الواجب' : 'Confirm Delete Assignment'}
        </h3>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 18px', lineHeight: 1.6 }}>
          {isAr
            ? `هل أنت متأكد من رغبتك في حذف واجب «${title}»؟ سيتم إخفاؤه عن الطلاب مع تسليماته.`
            : `Are you sure you want to delete "${title}"? It will be removed along with its submissions.`}
        </p>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontSize: '12px',
              fontWeight: '700',
              marginBottom: '14px',
              textAlign: isAr ? 'right' : 'left',
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            style={{
              padding: '9px',
              borderRadius: '8px',
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
              padding: '9px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              opacity: isDeleting ? 0.75 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            {isDeleting && <Loader2 size={14} className="hw-spin" />}
            <span>{isAr ? 'نعم، حذف الواجب' : 'Delete Homework'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
