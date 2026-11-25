import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Info, XCircle, LogIn, X } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const DialogContext = createContext(null);

export const DialogProvider = ({ children }) => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const [dialog, setDialog] = useState(null);
  // dialog shape:
  // { type: 'alert' | 'session-expired', title, message, variant: 'info'|'success'|'warning'|'error', actionLabel }

  const detectVariant = (msg) => {
    const text = String(msg || '');
    if (text.includes('فشل') || text.includes('خطأ') || text.includes('تعذر') || text.includes('يتجاوز') || text.toLowerCase().includes('error') || text.toLowerCase().includes('failed')) {
      return 'error';
    }
    if (text.includes('بنجاح') || text.includes('تم ') || text.includes('مفعّلة') || text.startsWith('✓')) {
      return 'success';
    }
    if (text.includes('يرجى') || text.includes('تأكد') || text.includes('تحذير') || text.toLowerCase().includes('please')) {
      return 'warning';
    }
    return 'info';
  };

  const showAlert = useCallback((message, options = {}) => {
    const text = String(message ?? '').trim();
    if (!text) return;
    const variant = options.variant || detectVariant(text);

    const defaultTitles = {
      success: isAr ? 'تم بنجاح' : 'Success',
      error: isAr ? 'تنبيه هام' : 'Notice',
      warning: isAr ? 'يرجى الانتباه' : 'Attention',
      info: isAr ? 'إشعار المنصة' : 'Platform Notice',
    };

    setDialog((prev) => {
      // Never overwrite an active session-expired dialog with a generic alert
      if (prev?.type === 'session-expired') return prev;
      return {
        type: 'alert',
        variant,
        title: options.title || defaultTitles[variant],
        message: text,
        actionLabel: options.actionLabel || (isAr ? 'حسناً' : 'OK'),
      };
    });
  }, [isAr]);

  const showSessionExpired = useCallback(() => {
    setDialog({
      type: 'session-expired',
      variant: 'warning',
      title: isAr ? 'انتهت صلاحية الجلسة' : 'Session Expired',
      message: isAr
        ? 'انتهت صلاحية جلستك الحالية أو تم تسجيل خروجك. اضغط على الزر أدناه لتسجيل الدخول مرة أخرى.'
        : 'Your session has expired or you were signed out. Click below to log in again.',
      actionLabel: isAr ? 'تسجيل الدخول' : 'Go to Login',
    });
  }, [isAr]);

  const closeDialog = useCallback(() => {
    setDialog(null);
  }, []);

  // Override native window.alert globally so all alerts render as centered modals
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const originalAlert = window.alert;
    window.alert = (msg) => {
      showAlert(msg);
    };
    return () => {
      window.alert = originalAlert;
    };
  }, [showAlert]);

  // Listen for session expiration events from api.js
  useEffect(() => {
    const onExpired = () => {
      showSessionExpired();
    };
    window.addEventListener('motafawweq:auth-expired', onExpired);
    return () => window.removeEventListener('motafawweq:auth-expired', onExpired);
  }, [showSessionExpired]);

  const handlePrimaryAction = () => {
    if (dialog?.type === 'session-expired') {
      setDialog(null);
      navigate('/login');
      return;
    }
    setDialog(null);
  };

  const variantMeta = {
    success: { icon: CheckCircle2, color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' },
    error: { icon: XCircle, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)' },
    warning: { icon: AlertTriangle, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.14)' },
    info: { icon: Info, color: 'var(--primary)', bg: 'var(--primary-surface)' },
  };

  const currentMeta = variantMeta[dialog?.variant || 'info'] || variantMeta.info;
  const IconComp = dialog?.type === 'session-expired' ? LogIn : currentMeta.icon;

  return (
    <DialogContext.Provider value={{ showAlert, showSessionExpired, closeDialog }}>
      {children}

      {dialog && (
        <div
          onClick={dialog.type === 'session-expired' ? handlePrimaryAction : closeDialog}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(5px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            direction: isRtl ? 'rtl' : 'ltr',
            fontFamily: isRtl ? 'var(--font-arabic), "Cairo", system-ui, sans-serif' : 'inherit',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: '22px',
              padding: '28px 26px 24px',
              maxWidth: '430px',
              width: '100%',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.28)',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            {dialog.type !== 'session-expired' && (
              <button
                type="button"
                onClick={closeDialog}
                aria-label="Close"
                style={{
                  position: 'absolute',
                  top: '14px',
                  [isRtl ? 'left' : 'right']: '14px',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            )}

            <div
              style={{
                width: '58px',
                height: '58px',
                borderRadius: '18px',
                backgroundColor: currentMeta.bg,
                color: currentMeta.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <IconComp size={28} />
            </div>

            <h3
              style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '800',
                color: 'var(--text-primary)',
              }}
            >
              {dialog.title}
            </h3>

            <p
              style={{
                margin: '0 0 22px 0',
                fontSize: '14px',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
              }}
            >
              {dialog.message}
            </p>

            <button
              type="button"
              onClick={handlePrimaryAction}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: dialog.variant === 'error' ? '#EF4444' : 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 18px rgba(21, 136, 199, 0.28)',
              }}
            >
              {dialog.type === 'session-expired' && <LogIn size={17} />}
              <span>{dialog.actionLabel}</span>
            </button>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    return {
      showAlert: (msg) => window.alert(msg),
      showSessionExpired: () => {},
      closeDialog: () => {},
    };
  }
  return ctx;
};

