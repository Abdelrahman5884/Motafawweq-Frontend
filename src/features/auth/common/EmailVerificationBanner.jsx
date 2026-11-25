import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, RotateCw, Clock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';

export const EmailVerificationBanner = () => {
  const { isAuthenticated, currentUser, verifyEmailOtp, resendEmailOtp } = useAuth();
  const { lang } = useLanguage();

  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text: string }

  useEffect(() => {
    const applySyncedOtp = (payload) => {
      const syncedCode = String(payload?.code || '').replace(/\D/g, '').slice(0, 6);
      if (syncedCode.length !== 6) return;
      setCode(syncedCode);
      setFeedback({
        type: 'success',
        text: lang === 'ar'
          ? `تم نسخ وملء الرمز (${syncedCode}) تلقائياً!`
          : `Code (${syncedCode}) copied and filled automatically!`
      });
    };

    // Check if an OTP was just synced in the last 2 minutes
    try {
      const saved = localStorage.getItem('motafawweq_otp_sync');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.ts && Date.now() - parsed.ts < 120000) {
          applySyncedOtp(parsed);
        }
      }
    } catch {
      // ignore
    }

    const onStorage = (e) => {
      if (e.key === 'motafawweq_otp_sync' && e.newValue) {
        try {
          applySyncedOtp(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', onStorage);
    let ch = null;
    if (typeof BroadcastChannel !== 'undefined') {
      ch = new BroadcastChannel('motafawweq_otp');
      ch.onmessage = (ev) => applySyncedOtp(ev.data);
    }

    return () => {
      window.removeEventListener('storage', onStorage);
      if (ch) ch.close();
    };
  }, [lang]);

  if (!isAuthenticated || !currentUser) return null;

  const isUnverified = currentUser.email_verified === false;
  const isPendingApproval = currentUser.status === 'pending';

  if (!isUnverified && !isPendingApproval) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return;
    setIsSubmitting(true);
    setFeedback(null);

    try {
      await verifyEmailOtp(code);
      setCode('');
      setFeedback({
        type: 'success',
        text: lang === 'ar' ? 'تم تأكيد البريد الإلكتروني بنجاح!' : 'Email verified successfully!'
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err?.message || (lang === 'ar' ? 'الرمز غير صحيح أو منتهي الصلاحية.' : 'Invalid or expired code.')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setFeedback(null);

    try {
      await resendEmailOtp();
      setFeedback({
        type: 'success',
        text: lang === 'ar' ? 'تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني.' : 'New verification code sent to your email.'
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err?.message || (lang === 'ar' ? 'يرجى الانتظار قليلاً قبل طلب رمز جديد.' : 'Please wait before requesting a new code.')
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div style={{
      padding: '10px 20px',
      backgroundColor: 'var(--primary-surface)',
      borderBottom: '1px solid var(--border-medium)',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      fontSize: '13px'
    }}>
      {isUnverified ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <ShieldAlert size={17} color="var(--warning, #f59e0b)" />
            <span>
              {lang === 'ar'
                ? `يرجى تأكيد بريدك الإلكتروني (${currentUser.email}) بإدخال الرمز المكون من 6 أرقام:`
                : `Please verify your email (${currentUser.email}) with the 6-digit OTP code:`}
            </span>
          </div>

          <form onSubmit={handleVerify} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onPaste={(e) => {
                e.preventDefault();
                const pasted = (e.clipboardData || window.clipboardData).getData('text');
                setCode(String(pasted || '').replace(/\D/g, '').slice(0, 6));
              }}
              placeholder="000000"
              dir="ltr"
              style={{
                width: '105px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm, 6px)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontWeight: '800',
                letterSpacing: '3px',
                textAlign: 'center',
                fontSize: '13px'
              }}
            />
            <button
              type="submit"
              disabled={isSubmitting || code.length !== 6}
              className="btn btn-primary"
              style={{ padding: '6px 12px', fontSize: '12px', fontWeight: '700' }}
            >
              {isSubmitting
                ? (lang === 'ar' ? 'جاري التأكيد...' : 'Verifying...')
                : (lang === 'ar' ? 'تأكيد الرمز' : 'Verify')}
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm, 6px)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCw size={12} />
              <span>{lang === 'ar' ? 'إعادة إرسال' : 'Resend'}</span>
            </button>

            {feedback && (
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: feedback.type === 'success' ? 'var(--success, #16a34a)' : 'var(--error, #dc2626)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {feedback.type === 'success' && <CheckCircle2 size={14} />}
                {feedback.text}
              </span>
            )}
          </form>
        </>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <Clock size={16} color="var(--primary)" />
          <span>
            {lang === 'ar'
              ? 'حسابك قيد المراجعة والاعتماد من قِبل إدارة المنصة. سيتم تفعيل كامل الصلاحيات فور الموافقة.'
              : 'Your account is pending administrator approval.'}
          </span>
        </div>
      )}
    </div>
  );
};

