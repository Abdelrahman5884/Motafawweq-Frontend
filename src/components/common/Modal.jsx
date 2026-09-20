/**
 * Motafawweq — Common Modal Component
 * Overlay with backdrop blur, click-outside to close, keyboard Escape support.
 */
import React, { useEffect } from 'react';

export const Modal = ({ children, onClose, maxWidth = 520, id }) => {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        id={id}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: `${maxWidth}px`,
          width: '100%',
          padding: '28px',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ─── Modal Header ─────────────────────────────────────────────────────────────
export const ModalHeader = ({ title, subtitle, onClose }) => (
  <div style={{ marginBottom: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '800',
        color: 'var(--text-primary)',
        margin: 0,
        fontFamily: 'var(--font-arabic)',
      }}>
        {title}
      </h3>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            padding: '4px',
            borderRadius: 'var(--radius-xs)',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
          aria-label="Close"
        >
          ✕
        </button>
      )}
    </div>
    {subtitle && (
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: 1.6 }}>
        {subtitle}
      </p>
    )}
  </div>
);

// ─── Modal Footer ─────────────────────────────────────────────────────────────
export const ModalFooter = ({ children }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-subtle)',
  }}>
    {children}
  </div>
);

export default Modal;
