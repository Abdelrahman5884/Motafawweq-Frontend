import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Eye, EyeOff, Lock } from 'lucide-react';

export const ForgotPasswordStep3NewPassword = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  errorMsg,
  isLoading,
  onSubmit
}) => {
  const { lang, t, isRtl } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

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
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••"
              style={{
                width: '100%',
                padding: '11px 38px 11px 38px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px'
              }}
            />
            <Lock size={15} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isRtl ? 'right' : 'left']: '12px', color: 'var(--text-muted)' }} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                [isRtl ? 'left' : 'right']: '10px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            {t('confirmPasswordLabel')}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••"
              style={{
                width: '100%',
                padding: isRtl ? '11px 38px 11px 14px' : '11px 14px 11px 38px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px'
              }}
            />
            <Lock size={15} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isRtl ? 'right' : 'left']: '12px', color: 'var(--text-muted)' }} />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '5px', display: 'block' }}>
            {lang === 'ar'
              ? '10 أحرف على الأقل تشمل حروفاً كبيرة وصغيرة وأرقاماً ورمزاً خاصاً (مثل: Motafawweq@2026)'
              : 'At least 10 chars with uppercase, lowercase, number, and symbol (e.g. Motafawweq@2026)'}
          </span>
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
