import React, { useState } from 'react';
import {
  KeyRound,
  Eye,
  EyeOff,
  Check,
  Shield,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import { InfoTooltip } from '../../../components/common/InfoTooltip';

const inputStyle = {
  width: '100%',
  padding: '10px 38px 10px 12px',
  borderRadius: '10px',
  border: '1.5px solid var(--border-subtle)',
  backgroundColor: 'var(--bg-subtle)',
  color: 'var(--text-primary)',
  fontSize: '13.5px',
  boxSizing: 'border-box',
  outline: 'none',
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

  // Change Password Form State
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
  const allValid = rules.length && rules.upper && rules.lower && rules.number && rules.symbol && rules.match && currentPassword.length > 0;

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
          ? `تم تغيير كلمة المرور بنجاح${revoked > 0 ? ` وإنهاء ${revoked} جلسة أخرى` : ''}`
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* 1. Change SuperAdmin Password */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '20px 22px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <KeyRound size={18} color="var(--primary)" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
            {isAr ? 'تغيير كلمة مرور المشرف' : 'Change Admin Password'}
          </h3>
          <InfoTooltip
            size={14}
            text={
              isAr
                ? 'يتطلب إدخال كلمة المرور الحالية وتعيين كلمة مرور قوية (10 أحرف على الأقل تشمل حروفاً كبيرة وصغيرة وأرقاماً ورموزاً).'
                : 'Requires current password and a strong new password (10+ chars with upper, lower, numbers & symbols).'
            }
          />
        </div>

        {pwError && (
          <div style={{ marginBottom: '14px', padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#B91C1C', fontSize: '12.5px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={15} />
            <span>{pwError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '5px', color: 'var(--text-primary)' }}>
                {isAr ? 'كلمة المرور الحالية *' : 'Current Password *'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineEnd: '10px', border: 'none', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
                >
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '5px', color: 'var(--text-primary)' }}>
                {isAr ? 'كلمة المرور الجديدة *' : 'New Password *'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineEnd: '10px', border: 'none', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '5px', color: 'var(--text-primary)' }}>
                {isAr ? 'تأكيد كلمة المرور الجديدة *' : 'Confirm New Password *'}
              </label>
              <input
                type={showNew ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ ...inputStyle, padding: '10px 12px' }}
              />
            </div>
          </div>

          {/* Compact Password Strength Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
            {[
              { ok: rules.length, label: isAr ? '10+ أحرف' : '10+ chars' },
              { ok: rules.upper && rules.lower, label: isAr ? 'حروف كبيرة وصغيرة' : 'Upper & lower' },
              { ok: rules.number, label: isAr ? 'رقم' : 'Number' },
              { ok: rules.symbol, label: isAr ? 'رمز (@#$!)' : 'Symbol' },
              { ok: rules.match, label: isAr ? 'تطابق التأكيد' : 'Confirmed' },
            ].map((req, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 9px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: '800',
                  backgroundColor: req.ok ? 'rgba(22, 163, 74, 0.12)' : 'var(--bg-subtle)',
                  color: req.ok ? '#15803D' : 'var(--text-muted)',
                  border: `1px solid ${req.ok ? 'rgba(22, 163, 74, 0.25)' : 'var(--border-subtle)'}`,
                }}
              >
                <Check size={11} />
                <span>{req.label}</span>
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '6px' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
              <input
                type="checkbox"
                checked={revokeOtherSessions}
                onChange={(e) => setRevokeOtherSessions(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              <span>{isAr ? 'تسجيل الخروج من جميع الأجهزة الأخرى' : 'Sign out other devices'}</span>
            </label>

            <button
              type="submit"
              disabled={savingPw || !allValid}
              style={{
                padding: '9px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: allValid ? 'var(--primary)' : 'var(--border-medium)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                cursor: savingPw ? 'wait' : allValid ? 'pointer' : 'not-allowed',
              }}
            >
              {savingPw ? (isAr ? 'جاري التحديث...' : 'Updating...') : (isAr ? 'تغيير كلمة المرور' : 'Update Password')}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Security KPIs & Immutable Audit Trail */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} color="var(--primary)" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
            {isAr ? 'الأمان وسجل التدقيق' : 'Security & Audit Trail'}
          </h3>
          <InfoTooltip
            size={14}
            text={
              isAr
                ? 'ملخص أحداث الأمان خلال آخر 24 ساعة وسجل العمليات غير القابل للتعديل.'
                : 'Live 24h security counters and immutable audit history.'
            }
          />
        </div>

        {securitySummary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: '10px' }}>
            {[
              { labelAr: 'دخول فاشل (24س)', labelEn: 'Failed Logins', val: securitySummary.failedLogins24h, warn: securitySummary.failedLogins24h > 10 },
              { labelAr: 'حسابات مقفلة', labelEn: 'Locked', val: securitySummary.lockedAccountsNow, warn: securitySummary.lockedAccountsNow > 0 },
              { labelAr: 'محاولات محجوبة', labelEn: 'IDOR Blocked', val: securitySummary.idorAttemptsBlocked24h, warn: securitySummary.idorAttemptsBlocked24h > 0 },
              { labelAr: 'أحداث حرجة', labelEn: 'Critical 24h', val: securitySummary.criticalEvents24h, warn: securitySummary.criticalEvents24h > 0 },
              { labelAr: 'جلسات نشطة', labelEn: 'Active Sessions', val: securitySummary.activeSessionsCount, warn: false },
            ].map((s, idx) => (
              <div
                key={idx}
                style={{
                  padding: '11px 12px',
                  borderRadius: '12px',
                  backgroundColor: s.warn ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-subtle)',
                  border: s.warn ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>{isAr ? s.labelAr : s.labelEn}</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: s.warn ? '#B91C1C' : 'var(--text-primary)' }}>
                  {Number(s.val || 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: '320px' }}>
            <Search size={15} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '11px', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={auditSearchInput}
              onChange={(e) => onAuditSearchChange?.(e.target.value)}
              placeholder={isAr ? 'بحث بالحدث أو الاسم أو IP...' : 'Search event, name, or IP...'}
              style={{
                width: '100%',
                padding: '8px 12px',
                paddingInlineStart: '34px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                boxSizing: 'border-box',
              }}
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
                  fontWeight: '700',
                  cursor: 'pointer',
                  border: auditLevel === lvl ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: auditLevel === lvl ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                  color: auditLevel === lvl ? 'var(--primary)' : 'var(--text-secondary)',
                }}
              >
                {lvl === 'all' ? (isAr ? 'الكل' : 'All') : lvl.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}>
          <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', fontSize: '11.5px', fontWeight: '800', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '10px 14px' }}>{isAr ? 'الحدث' : 'Event'}</th>
                <th style={{ padding: '10px 14px' }}>{isAr ? 'المستوى' : 'Level'}</th>
                <th style={{ padding: '10px 14px' }}>{isAr ? 'الفاعل' : 'Actor'}</th>
                <th style={{ padding: '10px 14px' }}>IP</th>
                <th style={{ padding: '10px 14px' }}>{isAr ? 'التوقيت' : 'Time'}</th>
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
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {log.event}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '10.5px', fontWeight: '800', backgroundColor: badge.bg, color: badge.color }}>
                          {(log.level || 'info').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {log.actor ? log.actor.name : <span style={{ color: 'var(--text-muted)' }}>System</span>}
                      </td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                        {log.ipAddress || '—'}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: '11.5px' }} dir="ltr">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString(isAr ? 'ar-EG' : 'en-US') : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
