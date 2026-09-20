import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { KeyRound } from 'lucide-react';

export const ForgotPasswordStep1Request = ({
  emailOrPhone,
  setEmailOrPhone,
  isLoading,
  onSubmit
}) => {
  const { lang, t } = useLanguage();

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
          <KeyRound size={22} />
        </div>
        <h1 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
          {t('forgotPasswordTitle')}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {t('forgotPasswordSubtitle')}
        </p>
      </div>

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {lang === 'ar' ? 'البريد أو رقم الهاتف المسجل' : 'Registered Email or Phone'}
          </label>
          <input
            type="text"
            required
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder="omar@motafawweq.me"
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13.5px'
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
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {isLoading ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (lang === 'ar' ? 'إرسال رمز التحقق OTP' : 'Send Verification OTP')}
        </button>
      </form>
    </div>
  );
};
