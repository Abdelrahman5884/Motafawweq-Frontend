import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

export const ForgotPasswordStep3NewPassword = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  errorMsg,
  isLoading,
  onSubmit
}) => {
  const { lang, t } = useLanguage();

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '22px' }}>
        <h2 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
          {lang === 'ar' ? 'تعيين كلمة المرور الجديدة' : 'Set New Password'}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {lang === 'ar' ? 'اختر كلمة مرور قوية لتأمين حسابك في متفوّق' : 'Choose a strong password for your account'}
        </p>
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

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
          </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {t('confirmPasswordLabel')}
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px'
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
            marginTop: '6px'
          }}
        >
          {isLoading ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ كلمة المرور الجديدة' : 'Save New Password')}
        </button>
      </form>
    </div>
  );
};
