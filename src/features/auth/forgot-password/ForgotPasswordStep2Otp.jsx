import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { ShieldCheck, RotateCw } from 'lucide-react';

export const ForgotPasswordStep2Otp = ({
  emailOrPhone,
  otpCode,
  setOtpCode,
  errorMsg,
  infoMsg,
  isLoading,
  onResend,
  onChangeEmail,
  onSubmit
}) => {
  const { lang } = useLanguage();

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '22px' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          backgroundColor: 'var(--primary-surface)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px'
        }}>
          <ShieldCheck size={22} />
        </div>
        <h2 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
          {lang === 'ar' ? 'أدخل رمز التحقق (6 أرقام)' : 'Enter 6-Digit Verification Code'}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {lang === 'ar' ? `تم إرسال الرمز إلى ${emailOrPhone}` : `Code sent to ${emailOrPhone}`}
        </p>
      </div>

      {infoMsg && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: 'var(--primary-surface)',
          color: 'var(--primary)',
          borderRadius: 'var(--radius-xs)',
          fontSize: '12.5px',
          marginBottom: '14px'
        }}>
          {infoMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: 'var(--error-light)',
          color: 'var(--error)',
          borderRadius: 'var(--radius-xs)',
          fontSize: '12.5px',
          marginBottom: '14px'
        }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            required
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            onPaste={(e) => {
              e.preventDefault();
              const pasted = (e.clipboardData || window.clipboardData).getData('text');
              setOtpCode(String(pasted || '').replace(/\D/g, '').slice(0, 6));
            }}
            placeholder="000000"
            dir="ltr"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-medium)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '24px',
              fontWeight: '800',
              letterSpacing: '10px',
              textAlign: 'center'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || otpCode.length !== 6}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '14px',
            fontWeight: '700'
          }}
        >
          {isLoading ? (lang === 'ar' ? 'جاري التحقق...' : 'Verifying...') : (lang === 'ar' ? 'تأكيد الرمز والمتابعة' : 'Verify & Continue')}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginTop: '4px' }}>
          {onResend && (
            <button
              type="button"
              onClick={onResend}
              disabled={isLoading}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCw size={13} />
              <span>{lang === 'ar' ? 'إعادة إرسال الرمز' : 'Resend Code'}</span>
            </button>
          )}

          {onChangeEmail && (
            <button
              type="button"
              onClick={onChangeEmail}
              disabled={isLoading}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {lang === 'ar' ? 'تغيير البريد الإلكتروني' : 'Change Email Address'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
