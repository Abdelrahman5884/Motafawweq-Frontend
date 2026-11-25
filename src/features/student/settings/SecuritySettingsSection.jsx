import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  AlertTriangle,
} from 'lucide-react';
import { SCard, SSection, SBadge, SButton, SSkeleton } from '../../../components/student/ui';
import { useAuth } from '../../../context/AuthContext';
import { useDialog } from '../../../context/DialogContext';
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

export const SecuritySettingsSection = ({ lang, role = 'student' }) => {
  const isAr = lang === 'ar';
  const navigate = useNavigate();
  const { showAlert } = useDialog();
  const {
    hasActiveToken,
    changePassword,
    fetchSessions,
    revokeSession,
    revokeOtherSessions,
    deleteAccount,
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

  // Delete account modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    if (!showDeleteModal) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !isDeletingAccount) {
        setShowDeleteModal(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showDeleteModal, isDeletingAccount]);

  const handleOpenDeleteModal = () => {
    setDeletePassword('');
    setShowDeletePassword(false);
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteAccount = async (e) => {
    e.preventDefault();
    if (!deletePassword) {
      setDeleteError(isAr ? 'يرجى إدخال كلمة المرور الحالية للتأكيد.' : 'Please enter your current password.');
      return;
    }

    setIsDeletingAccount(true);
    setDeleteError('');
    try {
      const res = await deleteAccount(deletePassword);
      setShowDeleteModal(false);
      if (showAlert) {
        showAlert(
          res?.message || (isAr ? 'تم حذف حسابك نهائياً بنجاح.' : 'Your account has been permanently deleted.'),
          { variant: 'success', title: isAr ? 'تم حذف الحساب' : 'Account Deleted' }
        );
      }
      navigate('/login', { replace: true });
    } catch (err) {
      setDeleteError(
        err?.message || (isAr ? 'كلمة المرور غير صحيحة أو تعذر حذف الحساب.' : 'Incorrect password or failed to delete account.')
      );
    } finally {
      setIsDeletingAccount(false);
    }
  };

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

      {/* ── 3. منطقة الخطر: حذف الحساب نهائياً ── */}
      <SCard
        padding={24}
        style={{
          border: '1px solid rgba(220, 38, 38, 0.3)',
          backgroundColor: 'rgba(220, 38, 38, 0.04)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1, minWidth: '240px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(220, 38, 38, 0.12)',
                color: 'var(--danger, #DC2626)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--danger, #DC2626)' }}>
                {isAr ? 'حذف الحساب نهائياً' : 'Delete Account Permanently'}
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {role === 'center'
                  ? (isAr
                    ? 'سيتم حذف حساب السنتر وجميع بياناته وإلغاء جميع جلسات الدخول بشكل نهائي، ولا يمكن التراجع عن هذا الإجراء.'
                    : 'Your center account and all active sessions will be permanently removed. This action cannot be undone.')
                  : role === 'teacher'
                    ? (isAr
                      ? 'سيتم حذف حسابك وجميع بياناتك وإلغاء جميع جلسات الدخول بشكل نهائي، ولا يمكن التراجع عن هذا الإجراء.'
                      : 'Your teacher account and all active sessions will be permanently removed. This action cannot be undone.')
                    : (isAr
                      ? 'سيتم حذف حسابك وجميع بياناتك الدراسية وإلغاء جميع جلسات الدخول بشكل نهائي، ولا يمكن التراجع عن هذا الإجراء.'
                      : 'Your account, study progress, and all active sessions will be permanently removed. This action cannot be undone.')}
              </p>
            </div>
          </div>

          <SButton
            variant="danger"
            size="sm"
            icon={<Trash2 />}
            onClick={handleOpenDeleteModal}
            disabled={!hasActiveToken}
          >
            {isAr ? 'حذف الحساب' : 'Delete Account'}
          </SButton>
        </div>
      </SCard>

      {/* ── نافذة تأكيد حذف الحساب ── */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
          onClick={() => !isDeletingAccount && setShowDeleteModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.68)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleConfirmDeleteAccount}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: '18px',
              padding: '24px',
              maxWidth: '430px',
              width: '100%',
              boxShadow: 'var(--shadow-xl, 0 24px 60px rgba(0,0,0,0.35))',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: 'var(--danger, #DC2626)' }}>
              <Trash2 size={20} />
              <h3 id="delete-account-title" style={{ margin: 0, fontSize: '16.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {isAr ? 'تأكيد حذف الحساب نهائياً' : 'Confirm Permanent Account Deletion'}
              </h3>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
              {isAr
                ? 'أدخل كلمة المرور الحالية لتأكيد حذف حسابك بشكل نهائي. لن تتمكن من استعادة الحساب بعد هذه الخطوة.'
                : 'Enter your current password to permanently delete your account. This cannot be undone.'}
            </p>

            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <input
                type={showDeletePassword ? 'text' : 'password'}
                name="deleteAccountPassword"
                autoComplete="current-password"
                autoFocus
                required
                value={deletePassword}
                onChange={(e) => {
                  setDeletePassword(e.target.value);
                  if (deleteError) setDeleteError('');
                }}
                placeholder={isAr ? 'كلمة المرور الحالية' : 'Current password'}
                style={{
                  ...passwordInputStyle,
                  borderColor: deleteError ? 'var(--danger, #DC2626)' : 'var(--border-medium)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowDeletePassword((v) => !v)}
                aria-label={isAr ? 'إظهار أو إخفاء كلمة المرور' : 'Toggle password visibility'}
                style={eyeBtnStyle}
              >
                {showDeletePassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {deleteError && (
              <div
                role="alert"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12.5px',
                  color: 'var(--danger, #DC2626)',
                  fontWeight: '700',
                  marginBottom: '12px',
                }}
              >
                <AlertCircle size={14} />
                <span>{deleteError}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
              <SButton
                type="button"
                variant="ghost"
                size="sm"
                disabled={isDeletingAccount}
                onClick={() => setShowDeleteModal(false)}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </SButton>
              <SButton
                type="submit"
                variant="danger"
                size="sm"
                icon={<Trash2 />}
                disabled={isDeletingAccount || !deletePassword}
              >
                {isDeletingAccount
                  ? (isAr ? 'جاري حذف الحساب...' : 'Deleting...')
                  : (isAr ? 'تأكيد الحذف النهائي' : 'Confirm Delete')}
              </SButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
