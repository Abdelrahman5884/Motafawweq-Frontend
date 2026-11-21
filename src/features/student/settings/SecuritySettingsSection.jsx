import React, { useState, useEffect, useCallback } from 'react';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Smartphone,
  Laptop,
  LogOut,
  CheckCircle,
  AlertCircle,
  KeyRound,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { SCard, SSection, SBadge, SButton, SSkeleton } from '../../../components/student/ui';
import { useAuth } from '../../../context/AuthContext';
import { parseUserAgent, formatDate } from '../../../utils';

const passwordInputStyle = {
  width: '100%',
  paddingBlock: '10px',
  paddingInlineStart: '14px',
  paddingInlineEnd: '42px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-medium)',
  backgroundColor: 'var(--bg-surface)',
  color: 'var(--text-primary)',
  fontSize: '13.5px',
  outline: 'none',
  boxSizing: 'border-box',
};

const eyeBtnStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  insetInlineEnd: '10px',
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  padding: '4px',
  display: 'flex',
};

export const SecuritySettingsSection = ({ lang }) => {
  const isAr = lang === 'ar';
  const {
    hasActiveToken,
    changePassword,
    fetchSessions,
    revokeSession,
    revokeOtherSessions,
  } = useAuth();

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState(null);

  // Active sessions state
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(() => Boolean(hasActiveToken && fetchSessions));
  const [sessionsError, setSessionsError] = useState(null);
  const [sessionsFeedback, setSessionsFeedback] = useState(null);
  const [revokingId, setRevokingId] = useState(null);
  const [revokingAll, setRevokingAll] = useState(false);
  const [sessionsNonce, setSessionsNonce] = useState(0);

  useEffect(() => {
    if (!hasActiveToken || !fetchSessions) return undefined;
    let active = true;
    fetchSessions()
      .then((list) => {
        if (!active) return;
        setSessions(Array.isArray(list) ? list : []);
        setSessionsError(null);
      })
      .catch((err) => {
        if (!active) return;
        setSessionsError(err?.message || '__SESSIONS_FAILED__');
      })
      .finally(() => {
        if (active) setLoadingSessions(false);
      });

    return () => {
      active = false;
    };
  }, [hasActiveToken, fetchSessions, sessionsNonce]);

  const handleRefreshSessions = useCallback(() => {
    if (!hasActiveToken || !fetchSessions) return;
    setLoadingSessions(true);
    setSessionsError(null);
    setSessionsNonce((n) => n + 1);
  }, [hasActiveToken, fetchSessions]);

  // Real backend password policy checklist (AppServiceProvider::configurePasswordPolicy)
  const newPass = passwordForm.newPassword;
  const checks = {
    minLen: newPass.length >= 10,
    upper: /[A-Z]/.test(newPass),
    lower: /[a-z]/.test(newPass),
    number: /[0-9]/.test(newPass),
    symbol: /[^A-Za-z0-9]/.test(newPass),
    different: !passwordForm.currentPassword || newPass !== passwordForm.currentPassword,
  };
  const policySatisfied =
    checks.minLen && checks.upper && checks.lower && checks.number && checks.symbol && checks.different;

  const passwordsMatch =
    newPass && passwordForm.confirmPassword
      ? newPass === passwordForm.confirmPassword
      : null;

  const canSubmitPassword =
    Boolean(passwordForm.currentPassword) &&
    policySatisfied &&
    passwordsMatch === true &&
    !isUpdatingPassword;

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmitPassword) return;

    setIsUpdatingPassword(true);
    setPasswordFeedback(null);
    try {
      const res = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      setPasswordFeedback({
        type: 'success',
        text:
          res?.message ||
          (isAr
            ? 'تم تحديث كلمة المرور بنجاح وتسجيل الخروج من الأجهزة الأخرى.'
            : 'Password updated and all other devices signed out.'),
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      // Refresh sessions because backend revoked all other sessions
      handleRefreshSessions();
    } catch (err) {
      setPasswordFeedback({
        type: 'error',
        text: err?.message || (isAr ? 'تعذر تحديث كلمة المرور.' : 'Failed to update password.'),
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleRevokeSingle = async (sessionId) => {
    setRevokingId(sessionId);
    setSessionsFeedback(null);
    try {
      await revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setSessionsFeedback({
        type: 'success',
        text: isAr ? 'تم إنهاء جلسة الجهاز بنجاح.' : 'Device session revoked.',
      });
    } catch (err) {
      setSessionsFeedback({
        type: 'error',
        text: err?.message || (isAr ? 'تعذر إنهاء الجلسة.' : 'Failed to revoke session.'),
      });
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeOthers = async () => {
    setRevokingAll(true);
    setSessionsFeedback(null);
    try {
      const res = await revokeOtherSessions();
      setSessions((prev) => prev.filter((s) => s.is_current));
      setSessionsFeedback({
        type: 'success',
        text:
          res?.message ||
          (isAr ? 'تم تسجيل الخروج من كافة الأجهزة الأخرى.' : 'Signed out from all other devices.'),
      });
    } catch (err) {
      setSessionsFeedback({
        type: 'error',
        text: err?.message || (isAr ? 'تعذر إنهاء الجلسات الأخرى.' : 'Could not revoke other sessions.'),
      });
    } finally {
      setRevokingAll(false);
    }
  };

  const otherSessionsCount = sessions.filter((s) => !s.is_current).length;

  const ruleItems = [
    { ok: checks.minLen, labelAr: '10 أحرف على الأقل', labelEn: 'At least 10 characters' },
    { ok: checks.upper, labelAr: 'حرف إنجليزي كبير (A-Z)', labelEn: 'Uppercase letter (A-Z)' },
    { ok: checks.lower, labelAr: 'حرف إنجليزي صغير (a-z)', labelEn: 'Lowercase letter (a-z)' },
    { ok: checks.number, labelAr: 'رقم واحد على الأقل (0-9)', labelEn: 'At least one number (0-9)' },
    { ok: checks.symbol, labelAr: 'رمز خاص مثل (!@#$)', labelEn: 'Special character (!@#$)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── 1. تغيير كلمة المرور ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={isAr ? 'تغيير كلمة المرور' : 'Change Password'}
          style={{ marginBottom: 0 }}
        >
          {passwordFeedback && (
            <div
              role="status"
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: passwordFeedback.type === 'success' ? 'var(--success-light)' : 'var(--error-light)',
                color: passwordFeedback.type === 'success' ? 'var(--success)' : 'var(--danger, #DC2626)',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              {passwordFeedback.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{passwordFeedback.text}</span>
            </div>
          )}

          <form
            onSubmit={handlePasswordSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '540px' }}
          >
            {/* كلمة المرور الحالية */}
            <div>
              <label htmlFor="sec-current-pw" style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
                {isAr ? 'كلمة المرور الحالية *' : 'Current Password *'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="sec-current-pw"
                  type={showCurrent ? 'text' : 'password'}
                  name="currentPassword"
                  autoComplete="current-password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                  placeholder="••••••••••"
                  style={passwordInputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  aria-label={isAr ? 'إظهار أو إخفاء كلمة المرور' : 'Toggle password visibility'}
                  style={eyeBtnStyle}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* كلمة المرور الجديدة */}
            <div>
              <label htmlFor="sec-new-pw" style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
                {isAr ? 'كلمة المرور الجديدة *' : 'New Password *'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="sec-new-pw"
                  type={showNew ? 'text' : 'password'}
                  name="newPassword"
                  autoComplete="new-password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                  placeholder="••••••••••"
                  style={passwordInputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  aria-label={isAr ? 'إظهار أو إخفاء كلمة المرور' : 'Toggle password visibility'}
                  style={eyeBtnStyle}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* متطلبات قوة كلمة المرور المطابقة للباك إند */}
              <div
                style={{
                  marginTop: '10px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))',
                  gap: '6px 12px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {ruleItems.map((item) => (
                  <div
                    key={item.labelEn}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11.5px',
                      fontWeight: item.ok ? '700' : '500',
                      color: item.ok ? 'var(--success)' : 'var(--text-secondary)',
                    }}
                  >
                    <CheckCircle size={13} style={{ opacity: item.ok ? 1 : 0.35, flexShrink: 0 }} />
                    <span>{isAr ? item.labelAr : item.labelEn}</span>
                  </div>
                ))}
              </div>

              {newPass && !checks.different && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', color: 'var(--danger, #DC2626)', fontSize: '11.5px', fontWeight: '600' }}>
                  <AlertCircle size={13} />
                  <span>{isAr ? 'يجب أن تكون كلمة المرور الجديدة مختلفة عن الحالية.' : 'New password must be different from current password.'}</span>
                </div>
              )}
            </div>

            {/* تأكيد كلمة المرور الجديدة */}
            <div>
              <label htmlFor="sec-confirm-pw" style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px' }}>
                {isAr ? 'تأكيد كلمة المرور الجديدة *' : 'Confirm New Password *'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="sec-confirm-pw"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="••••••••••"
                  style={{
                    ...passwordInputStyle,
                    borderColor:
                      passwordsMatch === false
                        ? 'var(--danger, #DC2626)'
                        : passwordsMatch === true
                          ? 'var(--success)'
                          : 'var(--border-medium)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={isAr ? 'إظهار أو إخفاء كلمة المرور' : 'Toggle password visibility'}
                  style={eyeBtnStyle}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {passwordsMatch === false && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '5px', color: 'var(--danger, #DC2626)', fontSize: '11.5px', fontWeight: '600' }}>
                  <AlertCircle size={13} />
                  <span>{isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'}</span>
                </div>
              )}

              {passwordsMatch === true && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '5px', color: 'var(--success)', fontSize: '11.5px', fontWeight: '600' }}>
                  <CheckCircle size={13} />
                  <span>{isAr ? 'كلمتا المرور متطابقتان' : 'Passwords match'}</span>
                </div>
              )}
            </div>

            <div style={{ paddingTop: '4px' }}>
              <SButton
                type="submit"
                variant="primary"
                size="sm"
                icon={<KeyRound />}
                disabled={!canSubmitPassword}
              >
                {isUpdatingPassword
                  ? (isAr ? 'جاري التحديث...' : 'Updating...')
                  : (isAr ? 'تحديث كلمة المرور' : 'Update Password')}
              </SButton>
            </div>
          </form>
        </SSection>
      </SCard>

      {/* ── 2. الأجهزة النشطة وجلسات الدخول ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={isAr ? 'الأجهزة النشطة وجلسات الدخول' : 'Active Devices & Sessions'}
          action={
            <SButton
              variant="ghost"
              size="sm"
              icon={<RefreshCw />}
              onClick={handleRefreshSessions}
              disabled={loadingSessions}
            >
              {isAr ? 'تحديث' : 'Refresh'}
            </SButton>
          }
          style={{ marginBottom: 0 }}
        >
          {sessionsFeedback && (
            <div
              role="status"
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: sessionsFeedback.type === 'success' ? 'var(--success-light)' : 'var(--error-light)',
                color: sessionsFeedback.type === 'success' ? 'var(--success)' : 'var(--danger, #DC2626)',
                fontSize: '12.5px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              {sessionsFeedback.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
              <span>{sessionsFeedback.text}</span>
            </div>
          )}

          {loadingSessions ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SSkeleton height={62} radius={10} />
              <SSkeleton height={62} radius={10} />
            </div>
          ) : sessionsError ? (
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--error-light)',
                color: 'var(--danger, #DC2626)',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                {sessionsError === '__SESSIONS_FAILED__'
                  ? (isAr ? 'تعذر تحميل الأجهزة النشطة.' : 'Could not load active sessions.')
                  : sessionsError}
              </span>
              <SButton variant="ghost" size="sm" onClick={handleRefreshSessions}>
                {isAr ? 'إعادة المحاولة' : 'Retry'}
              </SButton>
            </div>
          ) : sessions.length === 0 ? (
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center' }}>
              {isAr ? 'لا توجد جلسات نشطة مسجلة حالياً.' : 'No active sessions found.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sessions.map((session) => {
                const device = parseUserAgent(session.user_agent, lang);
                const lastUsed = session.last_used_at || session.created_at;
                return (
                  <div
                    key={session.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      flexWrap: 'wrap',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: session.is_current ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          backgroundColor: session.is_current ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                          color: session.is_current ? 'var(--primary)' : 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {device.isMobile ? <Smartphone size={19} /> : <Laptop size={19} />}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                            {device.label}
                          </span>
                          {session.is_current && (
                            <SBadge variant="success" size="xs">
                              {isAr ? 'هذا الجهاز الآن' : 'Current Device'}
                            </SBadge>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span dir="ltr">IP: {session.ip_address || '—'}</span>
                          {lastUsed && (
                            <>
                              <span>•</span>
                              <span>
                                {isAr ? 'آخر نشاط:' : 'Last active:'} {formatDate(lastUsed, lang)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {session.is_current ? (
                      <ShieldCheck size={18} color="var(--success)" />
                    ) : (
                      <SButton
                        variant="danger"
                        size="sm"
                        icon={<Trash2 size={14} />}
                        onClick={() => handleRevokeSingle(session.id)}
                        disabled={revokingId === session.id || revokingAll}
                      >
                        {revokingId === session.id
                          ? (isAr ? 'جاري الإخراج...' : 'Revoking...')
                          : (isAr ? 'إخراج' : 'Revoke')}
                      </SButton>
                    )}
                  </div>
                );
              })}

              <div style={{ marginTop: '6px' }}>
                <SButton
                  variant="danger"
                  size="sm"
                  icon={<LogOut />}
                  onClick={handleRevokeOthers}
                  disabled={otherSessionsCount === 0 || revokingAll}
                >
                  {revokingAll
                    ? (isAr ? 'جاري تسجيل الخروج...' : 'Signing out...')
                    : otherSessionsCount > 0
                      ? (isAr
                        ? `تسجيل الخروج من باقي الأجهزة (${otherSessionsCount})`
                        : `Sign out all other devices (${otherSessionsCount})`)
                      : (isAr ? 'لا توجد أجهزة أخرى متصلة' : 'No other connected devices')}
                </SButton>
              </div>
            </div>
          )}
        </SSection>
      </SCard>
    </div>
  );
};
