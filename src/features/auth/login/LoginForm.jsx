import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

export const LoginForm = ({
  emailOrPhone,
  setEmailOrPhone,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  isLoading,
  errorMsg,
  onSubmit
}) => {
  const { lang, t, isRtl } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {errorMsg && (
        <div style={{
          padding: '10px 14px',
          backgroundColor: 'var(--error-light)',
          color: 'var(--error)',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {lang === 'ar' ? 'البريد الإلكتروني أو رقم الموبايل' : 'Email or Mobile Number'}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: omar@motafawweq.me أو 010...' : 'e.g. name@motafawweq.me'}
              style={{
                width: '100%',
                padding: isRtl ? '11px 40px 11px 14px' : '11px 14px 11px 40px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13.5px',
                fontFamily: 'inherit'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              [isRtl ? 'right' : 'left']: '12px',
              color: 'var(--text-muted)'
            }}>
              <Mail size={16} />
            </div>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {t('passwordLabel')}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: isRtl ? '11px 40px 11px 40px' : '11px 40px 11px 40px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13.5px',
                fontFamily: 'inherit'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              [isRtl ? 'right' : 'left']: '12px',
              color: 'var(--text-muted)'
            }}>
              <Lock size={16} />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                [isRtl ? 'left' : 'right']: '12px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)} 
              style={{ accentColor: 'var(--primary)' }}
            />
            {t('rememberMe')}
          </label>
          <Link to="/forgot-password" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
            {t('forgotPasswordLink')}
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '13px',
            fontSize: '14px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '6px'
          }}
        >
          {isLoading ? (
            <span>{lang === 'ar' ? 'جاري التحقق...' : 'Signing in...'}</span>
          ) : (
            <>
              <span>{t('signInBtn')}</span>
              {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </>
          )}
        </button>
      </form>
    </>
  );
};
