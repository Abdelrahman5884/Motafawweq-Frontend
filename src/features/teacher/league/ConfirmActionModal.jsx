import React, { useState } from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';

export const ConfirmActionModal = ({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
  isRtl,
}) => {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (isBusy) return;
    setError('');
    setIsBusy(true);
    try {
      await onConfirm();
    } catch (err) {
      setError(err?.message || 'تعذر تنفيذ العملية. يرجى المحاولة مرة أخرى.');
      setIsBusy(false);
    }
  };

  return (
    <div
      onClick={() => { if (!isBusy) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '20px',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: '20px',
          padding: '26px',
          maxWidth: '430px',
          width: '100%',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '15px',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
          }}
        >
          <AlertTriangle size={26} />
        </div>

        <h3 style={{ fontSize: '17.5px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px' }}>
          {title}
        </h3>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0 0 18px' }}>
          {message}
        </p>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontSize: '12px',
              fontWeight: '700',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            disabled={isBusy}
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '11px',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: isBusy ? 'not-allowed' : 'pointer',
            }}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={isBusy}
            onClick={handleConfirm}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '11px',
              border: 'none',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '800',
              cursor: isBusy ? 'wait' : 'pointer',
              opacity: isBusy ? 0.7 : 1,
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
            }}
          >
            {isBusy ? '...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;
