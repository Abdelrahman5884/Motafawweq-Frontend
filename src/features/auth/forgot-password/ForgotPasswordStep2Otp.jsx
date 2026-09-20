import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { ShieldCheck } from 'lucide-react';

export const ForgotPasswordStep2Otp = ({
  emailOrPhone,
  otpCode,
  setOtpCode,
  generatedCode,
  errorMsg,
  isLoading,
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
          {lang === 'ar' ? 'أدخل رمز التحقق (OTP)' : 'Enter Verification Code'}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {lang === 'ar' ? `تم إرسال الرمز إلى ${emailOrPhone}` : `Code sent to ${emailOrPhone}`}
        </p>
      </div>

      {/* Demo Helper Banner */}
      <div style={{
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--primary-surface)',
        border: '1px solid var(--border-medium)',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px'
      }}>
        <span style={{ color: 'var(--text-secondary)' }}>
          {lang === 'ar' ? `رمز التحقق التجريبي هو: ` : `Demo OTP is: `}
          <strong style={{ color: 'var(--primary)', letterSpacing: '2px', fontSize: '14px' }}>{generatedCode || '4829'}</strong>
        </span>
        <button
          type="button"
          onClick={() => setOtpCode(generatedCode || '4829')}
          style={{
            padding: '4px 8px',
            borderRadius: 'var(--radius-xs)',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            border: 'none',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          {lang === 'ar' ? 'تعبئة تلقائية' : 'Auto Fill'}
        </button>
      </div>

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
            required
            maxLength={4}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="4829"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-medium)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '24px',
              fontWeight: '800',
              letterSpacing: '12px',
              textAlign: 'center'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
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
      </form>
    </div>
  );
};
