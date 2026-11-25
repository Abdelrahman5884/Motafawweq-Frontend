import React, { useState } from 'react';
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Check,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserX,
  Activity,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import { InfoTooltip } from '../../../components/common/InfoTooltip';

const fieldWrapStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const fieldInputStyle = {
  width: '100%',
  padding: '11px 38px 11px 38px',
  borderRadius: '12px',
  border: '1.5px solid var(--border-subtle)',
  backgroundColor: 'var(--bg-subtle)',
  color: 'var(--text-primary)',
  fontSize: '13.5px',
  fontWeight: '600',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.15s ease',
};

export const AdminPasswordAndSecurityPanel = ({
  securitySummary,
  auditLogs = [],
  auditMeta = { current_page: 1, last_page: 1, total: 0 },
  auditLevel = 'all',
  auditSearchInput = '',
  loadingAudit = false,
  lang = 'ar',
  isRtl = true,
  onAuditSearchChange,
  onAuditLevelChange,
  onAuditPageChange,
  onPasswordChanged,
  showToast,
}) => {
  const isAr = lang === 'ar';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [pwError, setPwError] = useState('');

  const rules = {
    length: newPassword.length >= 10,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    symbol: /[^A-Za-z0-9]/.test(newPassword),
    match: newPassword.length > 0 && newPassword === confirmPassword,
  };

  const strengthScore = [
    rules.length,
    rules.upper && rules.lower,
    rules.number,
    rules.symbol,
  ].filter(Boolean).length;

  const strengthMeta =
    strengthScore === 4
      ? { labelAr: 'قوية جداً', labelEn: 'Very Strong', color: '#16A34A' }
      : strengthScore === 3
        ? { labelAr: 'جيدة', labelEn: 'Good', color: '#1588C7' }
        : strengthScore === 2
          ? { labelAr: 'متوسطة', labelEn: 'Fair', color: '#D97706' }
          : { labelAr: 'ضعيفة', labelEn: 'Weak', color: '#DC2626' };

  const allValid = strengthScore === 4 && rules.match && currentPassword.length > 0;

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');

    if (!allValid) {
      setPwError(isAr ? 'يرجى استيفاء جميع شروط كلمة المرور القوية وتأكيدها.' : 'Please meet all password requirements.');
      return;
    }

    setSavingPw(true);
    try {
      const res = await adminApi.system.changePassword({
        currentPassword,
        newPassword,
        newPasswordConfirmation: confirmPassword,
        revokeOtherSessions,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      const revoked = Number(res?.data?.revokedOtherSessionsCount ?? 0);
      showToast?.(
        isAr
          ? `تم تحديث كلمة المرور بنجاح${revoked > 0 ? ` وإنهاء ${revoked} جلسة أخرى` : ''}`
          : `Password updated${revoked > 0 ? ` (${revoked} other sessions revoked)` : ''}`
      );
      onPasswordChanged?.();
    } catch (err) {
      const firstErr =
        err?.errors && typeof err.errors === 'object'
          ? Object.values(err.errors).flat()[0]
          : null;
      setPwError(firstErr || err?.message || (isAr ? 'تعذر تغيير كلمة المرور.' : 'Failed to change password.'));
    } finally {
      setSavingPw(false);
    }
  };

  const getLevelBadgeStyle = (level) => {
    if (level === 'critical' || level === 'error') {
      return { bg: 'rgba(239, 68, 68, 0.14)', color: '#B91C1C' };
    }
    if (level === 'warning') {
      return { bg: 'rgba(245, 158, 11, 0.15)', color: '#B45309' };
    }
    return { bg: 'rgba(21, 136, 199, 0.12)', color: 'var(--primary)' };
  };

  const securityCards = securitySummary
    ? [
        {
          icon: ShieldAlert,
          labelAr: 'دخول فاشل (24س)',
          labelEn: 'Failed Logins',
          val: securitySummary.failedLogins24h,
          warn: securitySummary.failedLogins24h > 10,
          accent: '#D97706',
          bg: 'rgba(245, 158, 11, 0.12)',
        },
        {
          icon: UserX,
          labelAr: 'حسابات مقفلة',
          labelEn: 'Locked Accounts',
          val: securitySummary.lockedAccountsNow,
          warn: securitySummary.lockedAccountsNow > 0,
          accent: '#DC2626',
          bg: 'rgba(220, 38, 38, 0.12)',
        },
        {
          icon: ShieldCheck,
          labelAr: 'محاولات محجوبة',
          labelEn: 'IDOR Blocked',
          val: securitySummary.idorAttemptsBlocked24h,
          warn: securitySummary.idorAttemptsBlocked24h > 0,
          accent: '#7C3AED',
          bg: 'rgba(124, 58, 237, 0.12)',
        },
        {
          icon: AlertCircle,
          labelAr: 'أحداث حرجة (24س)',
          labelEn: 'Critical Events',
          val: securitySummary.criticalEvents24h,
          warn: securitySummary.criticalEvents24h > 0,
          accent: '#DC2626',
          bg: 'rgba(220, 38, 38, 0.12)',
        },
        {
          icon: Activity,
          labelAr: 'جلسات نشطة',
          labelEn: 'Active Sessions',
          val: securitySummary.activeSessionsCount,
          warn: false,
          accent: '#1588C7',
          bg: 'rgba(21, 136, 199, 0.12)',
        },
      ]
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Premium Change Admin Password Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '22px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Navy Security Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #06254E 0%, #0E3E78 60%, #1588C7 100%)',
            padding: '18px 24px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.16)',
                border: '1px solid rgba(255, 255, 255, 0.24)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <KeyRound size={20} color="#7DD3FC" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: '900', color: '#FFFFFF' }}>
                {isAr ? 'تغيير كلمة مرور السوبر أدمن' : 'Change SuperAdmin Password'}
              </h3>
              <InfoTooltip
                light
                size={13}
                text={
                  isAr
                    ? 'يتم تشفير كلمة المرور الجديدة فوراً وتوثيق العملية في سجل الأمان، مع خيار إنهاء جميع الجلسات على الأجهزة الأخرى.'
                    : 'Securely hashes your new password, logs a critical audit event, and optionally signs out all other devices.'
                }
              />
            </div>
          </div>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 11px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.14)',
              fontSize: '11.5px',
              fontWeight: '800',
              color: '#BAE6FD',
            }}
          >
            <ShieldCheck size={14} />
            <span>{isAr ? 'حماية عالية' : 'High Security'}</span>
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleChangePassword} style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pwError && (
            <div style={{ padding: '11px 14px', borderRadius: '12px', backgroundColor: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#B91C1C', fontSize: '12.5px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{pwError}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>
                {isAr ? 'كلمة المرور الحالية' : 'Current Password'} *
              </label>
              <div style={fieldWrapStyle}>
                <Lock size={15} style={{ position: 'absolute', insetInlineStart: '12px', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••"
                  style={fieldInputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  style={{ position: 'absolute', insetInlineEnd: '10px', border: 'none', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', padding: '4px' }}
                >
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>
                {isAr ? 'كلمة المرور الجديدة' : 'New Password'} *
              </label>
              <div style={fieldWrapStyle}>
                <KeyRound size={15} style={{ position: 'absolute', insetInlineStart: '12px', color: 'var(--primary)', pointerEvents: 'none' }} />
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••"
                  style={fieldInputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  style={{ position: 'absolute', insetInlineEnd: '10px', border: 'none', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', padding: '4px' }}
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>
                {isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'} *
              </label>
              <div style={fieldWrapStyle}>
                <ShieldCheck size={15} style={{ position: 'absolute', insetInlineStart: '12px', color: rules.match ? '#16A34A' : 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••"
                  style={{ ...fieldInputStyle, paddingInlineEnd: '12px' }}
                />
              </div>
            </div>
          </div>

          {/* 4-Segment Strength Bar + Rule Pills */}
          <div style={{ padding: '14px 16px', borderRadius: '14px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                {isAr ? 'قوة كلمة المرور' : 'Password Strength'}
              </span>
              {newPassword.length > 0 && (
                <span style={{ fontSize: '11.5px', fontWeight: '900', color: strengthMeta.color }}>
                  {isAr ? strengthMeta.labelAr : strengthMeta.labelEn}
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {[1, 2, 3, 4].map((seg) => (
                <div
                  key={seg}
                  style={{
                    height: '6px',
                    borderRadius: '999px',
                    backgroundColor: newPassword.length > 0 && strengthScore >= seg ? strengthMeta.color : 'var(--border-subtle)',
                    transition: 'background-color 0.2s ease',
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {[
                { ok: rules.length, label: isAr ? '10+ أحرف' : '10+ chars' },
                { ok: rules.upper && rules.lower, label: isAr ? 'كبيرة وصغيرة' : 'Upper & lower' },
                { ok: rules.number, label: isAr ? 'رقم' : 'Number' },
                { ok: rules.symbol, label: isAr ? 'رمز (@#$!)' : 'Symbol' },
                { ok: rules.match, label: isAr ? 'متطابقة' : 'Matched' },
              ].map((req, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: '800',
                    backgroundColor: req.ok ? 'rgba(22, 163, 74, 0.12)' : 'var(--bg-surface)',
                    color: req.ok ? '#15803D' : 'var(--text-muted)',
                    border: `1px solid ${req.ok ? 'rgba(22, 163, 74, 0.28)' : 'var(--border-subtle)'}`,
                  }}
                >
                  <Check size={11} />
                  <span>{req.label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Footer: Modern Pill Toggle + Submit */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', paddingTop: '4px' }}>
            <button
              type="button"
              role="switch"
              aria-checked={revokeOtherSessions}
              onClick={() => setRevokeOtherSessions((v) => !v)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                border: 'none',
                background: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: '40px',
                  height: '22px',
                  borderRadius: '999px',
                  backgroundColor: revokeOtherSessions ? 'var(--primary)' : 'var(--border-medium)',
                  position: 'relative',
                  transition: 'background-color 0.2s ease',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '3px',
                    left: revokeOtherSessions ? '21px' : '3px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                    transition: 'left 0.2s ease',
                  }}
                />
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                <LogOut size={14} color="var(--primary)" />
                <span>{isAr ? 'إنهاء جلسات الأجهزة الأخرى' : 'Sign out other devices'}</span>
              </span>
            </button>

            <button
              type="submit"
              disabled={savingPw || !allValid}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '10px 22px',
                borderRadius: '11px',
                border: 'none',
                backgroundColor: allValid ? '#06254E' : 'var(--border-medium)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                cursor: savingPw ? 'wait' : allValid ? 'pointer' : 'not-allowed',
                boxShadow: allValid ? '0 8px 18px rgba(6, 37, 78, 0.2)' : 'none',
              }}
            >
              <Lock size={14} />
              <span>{savingPw ? (isAr ? 'جاري التحديث...' : 'Updating...') : (isAr ? 'حفظ كلمة المرور الجديدة' : 'Save New Password')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Security Posture KPI Grid */}
      {securityCards.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
          {securityCards.map((c, idx) => {
            const CIcon = c.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: c.warn ? `1px solid ${c.accent}44` : '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '11px', backgroundColor: c.bg, color: c.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CIcon size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                    {isAr ? c.labelAr : c.labelEn}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: c.warn ? c.accent : 'var(--text-primary)' }}>
                    {Number(c.val || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Immutable Security Audit Trail */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '20px 22px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {isAr ? 'سجل الأمان والتدقيق' : 'Security Audit Trail'}
            </h3>
            <InfoTooltip
              size={14}
              text={
                isAr
                  ? 'سجل غير قابل للتعديل لكل العمليات الحساسة ومحاولات الدخول وتغييرات الأمان.'
                  : 'Immutable log of all sensitive operations, logins, and security actions.'
              }
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['all', 'info', 'warning', 'error', 'critical'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onAuditLevelChange?.(lvl)}
                style={{
                  padding: '6px 11px',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  border: auditLevel === lvl ? 'none' : '1px solid var(--border-subtle)',
                  backgroundColor: auditLevel === lvl ? '#06254E' : 'var(--bg-subtle)',
                  color: auditLevel === lvl ? '#FFFFFF' : 'var(--text-secondary)',
                }}
              >
                {lvl === 'all' ? (isAr ? 'الكل' : 'All') : lvl.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', maxWidth: '340px' }}>
          <Search size={15} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '11px', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            value={auditSearchInput}
            onChange={(e) => onAuditSearchChange?.(e.target.value)}
            placeholder={isAr ? 'بحث بالحدث أو الاسم أو IP...' : 'Search event, name, or IP...'}
            style={{
              width: '100%',
              padding: '9px 12px',
              paddingInlineStart: '34px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}>
          <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', fontSize: '11.5px', fontWeight: '800', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '11px 14px' }}>{isAr ? 'الحدث' : 'Event'}</th>
                <th style={{ padding: '11px 14px' }}>{isAr ? 'المستوى' : 'Level'}</th>
                <th style={{ padding: '11px 14px' }}>{isAr ? 'الفاعل' : 'Actor'}</th>
                <th style={{ padding: '11px 14px' }}>IP</th>
                <th style={{ padding: '11px 14px' }}>{isAr ? 'التوقيت' : 'Time'}</th>
              </tr>
            </thead>
            <tbody>
              {loadingAudit ? (
                <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>{isAr ? 'جاري التحميل...' : 'Loading...'}</td></tr>
              ) : auditLogs.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>{isAr ? 'لا توجد أحداث مطابقة.' : 'No matching events.'}</td></tr>
              ) : (
                auditLogs.map((log) => {
                  const badge = getLevelBadgeStyle(log.level);
                  return (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '12.5px' }}>
                      <td style={{ padding: '11px 14px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {log.event}
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '10.5px', fontWeight: '800', backgroundColor: badge.bg, color: badge.color }}>
                          {(log.level || 'info').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '11px 14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {log.actor ? log.actor.name : <span style={{ color: 'var(--text-muted)' }}>System</span>}
                      </td>
                      <td style={{ padding: '11px 14px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                        {log.ipAddress || '—'}
                      </td>
                      <td style={{ padding: '11px 14px', color: 'var(--text-secondary)', fontSize: '11.5px' }} dir="ltr">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString(isAr ? 'ar-EG' : 'en-US') : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {auditMeta.last_page > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span>
              {isAr ? `صفحة ${auditMeta.current_page} من ${auditMeta.last_page} (${auditMeta.total})` : `Page ${auditMeta.current_page} of ${auditMeta.last_page} (${auditMeta.total})`}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                disabled={auditMeta.current_page <= 1}
                onClick={() => onAuditPageChange?.(Math.max(1, auditMeta.current_page - 1))}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', cursor: auditMeta.current_page <= 1 ? 'not-allowed' : 'pointer', opacity: auditMeta.current_page <= 1 ? 0.5 : 1 }}
              >
                {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                <span>{isAr ? 'السابق' : 'Prev'}</span>
              </button>
              <button
                type="button"
                disabled={auditMeta.current_page >= auditMeta.last_page}
                onClick={() => onAuditPageChange?.(Math.min(auditMeta.last_page, auditMeta.current_page + 1))}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', cursor: auditMeta.current_page >= auditMeta.last_page ? 'not-allowed' : 'pointer', opacity: auditMeta.current_page >= auditMeta.last_page ? 0.5 : 1 }}
              >
                <span>{isAr ? 'التالي' : 'Next'}</span>
                {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
