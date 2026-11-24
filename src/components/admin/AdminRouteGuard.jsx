import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  Terminal,
  Loader2
} from 'lucide-react';

/**
 * High-Security SuperAdmin Route Guard & Isolated Sign-In Vault.
 * - Never trusts localStorage role flags alone; requires a live server-verified Bearer token with role === 'admin'.
 * - Never pre-fills credentials, never displays demo hints, and defaults to ephemeral sessionStorage tokens.
 * - Rejects and immediately signs out non-admin accounts attempting to authenticate through the Admin Vault.
 */
export const AdminRouteGuard = ({ children }) => {
  const { isVerifiedAdmin, authLoading, login, logout } = useAuth();
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const isAr = lang === 'ar';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)',
        direction: isRtl ? 'rtl' : 'ltr',
        padding: '24px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          padding: '32px 40px',
          borderRadius: '24px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <Loader2 size={32} color="var(--primary)" className="admin-vault-spin" />
          <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {isAr ? 'جاري التحقق من الجلسة المشفّرة لصلاحيات المشرف...' : 'Verifying encrypted administrator session...'}
          </div>
        </div>
        <style>{`@keyframes adminVaultSpin { to { transform: rotate(360deg); } } .admin-vault-spin { animation: adminVaultSpin 0.9s linear infinite; }`}</style>
      </div>
    );
  }

  if (isVerifiedAdmin) {
    return children;
  }

  const handleVaultSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMsg(isAr ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور.' : 'Please enter your email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const targetRoute = await login({
        email: cleanEmail,
        password,
        rememberMe: rememberDevice,
      });

      if (targetRoute !== '/admin/dashboard') {
        await logout();
        setPassword('');
        setErrorMsg(
          isAr
            ? 'تم رفض الدخول: هذا الحساب لا يمتلك صلاحيات مشرف المنصة.'
            : 'Access denied: This account does not have Platform Administrator privileges.'
        );
        return;
      }

      // Clear local form secrets from component state immediately on success
      setEmail('');
      setPassword('');
    } catch (err) {
      setPassword('');
      setErrorMsg(
        err?.message ||
          (isAr
            ? 'تعذر التحقق من بيانات الدخول. تحقق من البريد وكلمة المرور.'
            : 'Authentication failed. Please check your credentials.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      direction: isRtl ? 'rtl' : 'ltr',
      position: 'relative',
      overflow: 'hidden',
      background: isDark
        ? 'radial-gradient(circle at 20% 15%, rgba(21, 136, 199, 0.18), transparent 45%), radial-gradient(circle at 80% 85%, rgba(6, 37, 78, 0.65), transparent 50%), #031122'
        : 'radial-gradient(circle at 20% 15%, rgba(21, 136, 199, 0.12), transparent 48%), radial-gradient(circle at 80% 85%, rgba(6, 37, 78, 0.08), transparent 50%), #F4F8FC'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-medium)',
        borderRadius: '26px',
        padding: '34px 30px',
        boxShadow: isDark
          ? '0 28px 64px rgba(0, 0, 0, 0.55)'
          : '0 24px 60px rgba(6, 37, 78, 0.12)',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Top Security Strip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '22px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '5px 12px',
            borderRadius: '999px',
            backgroundColor: 'rgba(21, 136, 199, 0.12)',
            border: '1px solid rgba(21, 136, 199, 0.25)',
            color: 'var(--primary)',
            fontSize: '11.5px',
            fontWeight: '800'
          }}>
            <ShieldCheck size={14} />
            <span>{isAr ? 'بوابة مشرف المنصة المحمية' : 'Protected Admin Vault'}</span>
          </div>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: '700',
            color: 'var(--text-muted)'
          }}>
            <Lock size={12} />
            <span>Zero-Trust</span>
          </span>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            margin: '0 0 6px',
            fontSize: '23px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            letterSpacing: '-0.3px'
          }}>
            {isAr ? 'تسجيل دخول المشرف الأعلى' : 'Platform SuperAdmin Sign In'}
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {isAr
              ? 'الوصول مقتصر على حسابات الإدارة العليا المُنشأة من الطرفية (Terminal) فقط. يتم تسجيل جميع المحاولات في سجل التدقيق الأمني.'
              : 'Restricted to CLI-provisioned platform administrators. All access attempts are logged in the immutable audit trail.'}
          </p>
        </div>

        {errorMsg && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '9px',
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.28)',
              color: '#DC2626',
              fontSize: '12.5px',
              fontWeight: '700',
              marginBottom: '18px',
              lineHeight: '1.5'
            }}
          >
            <AlertCircle size={17} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleVaultSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              htmlFor="admin-vault-email"
              style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}
            >
              {isAr ? 'البريد الإلكتروني للمشرف' : 'Administrator Email'}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  insetInlineStart: '13px',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                id="admin-vault-email"
                name="admin_email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.tld"
                dir="ltr"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  paddingInlineStart: '40px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-vault-password"
              style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}
            >
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound
                size={16}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  insetInlineStart: '13px',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                id="admin-vault-password"
                name="admin_password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                dir="ltr"
                style={{
                  width: '100%',
                  padding: '11px 42px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  insetInlineEnd: '10px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            userSelect: 'none'
          }}>
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              style={{ accentColor: 'var(--primary)', width: '15px', height: '15px' }}
            />
            <span>
              {isAr
                ? 'تذكر الجلسة على هذا الجهاز (الافتراضي: جلسة مؤقتة تنتهي بإغلاق المتصفح)'
                : 'Keep session on this device (default: ephemeral browser session)'}
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: '13px',
              border: 'none',
              background: 'linear-gradient(135deg, #06254E 0%, #1588C7 100%)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '800',
              cursor: submitting ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 10px 24px rgba(21, 136, 199, 0.28)',
              opacity: submitting ? 0.8 : 1,
              marginTop: '4px'
            }}
          >
            {submitting ? (
              <>
                <Loader2 size={17} className="admin-vault-spin" />
                <span>{isAr ? 'جاري التحقق الأمني...' : 'Authenticating...'}</span>
              </>
            ) : (
              <>
                <Lock size={16} />
                <span>{isAr ? 'دخول آمن إلى لوحة التحكم' : 'Unlock Admin Console'}</span>
              </>
            )}
          </button>
        </form>

        {/* CLI Security Note */}
        <div style={{
          marginTop: '20px',
          padding: '11px 13px',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '9px',
          fontSize: '11.5px',
          color: 'var(--text-secondary)'
        }}>
          <Terminal size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
          <span>
            {isAr
              ? 'إدارة وتدوير حسابات المشرفين تتم حصرياً من الطرفية عبر الأمر الآمن php artisan admin:provision'
              : 'Admin accounts are provisioned strictly via CLI: php artisan admin:provision'}
          </span>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '700',
              color: 'var(--text-muted)',
              textDecoration: 'none'
            }}
          >
            {isRtl ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
            <span>{isAr ? 'العودة إلى الموقع الرئيسي' : 'Back to Home'}</span>
          </Link>
        </div>
      </div>

      <style>{`@keyframes adminVaultSpin { to { transform: rotate(360deg); } } .admin-vault-spin { animation: adminVaultSpin 0.9s linear infinite; }`}</style>
    </div>
  );
};
