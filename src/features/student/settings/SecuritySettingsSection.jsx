import React, { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  Mail,
  Phone,
  ShieldCheck,
  Smartphone,
  Laptop,
  LogOut,
  CheckCircle,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { SCard, SSection, SBadge, SButton, SCallout } from '../../../components/student/ui';

export const SecuritySettingsSection = ({
  formData,
  handleChange,
  securityState,
  handleSecurityChange,
  handlePasswordSave,
  handleTerminateOtherSessions,
  lang,
  isRtl
}) => {
  // Eye toggles for passwords
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password strength calculation
  const newPass = securityState.newPassword || '';
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, labelAr: 'فارغة', labelEn: 'Empty', color: 'var(--text-muted)' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[A-Z]/.test(pwd) || /[\u0600-\u06FF]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, labelAr: 'ضعيفة', labelEn: 'Weak', color: 'var(--danger)' };
    if (score <= 4) return { score: 2, labelAr: 'متوسطة وجيدة', labelEn: 'Medium', color: 'var(--warning)' };
    return { score: 3, labelAr: 'قوية وآمنة جداً 🛡️', labelEn: 'Strong 🛡️', color: 'var(--success)' };
  };

  const strength = calculateStrength(newPass);

  const passwordsMatch = securityState.newPassword && securityState.confirmPassword
    ? securityState.newPassword === securityState.confirmPassword
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── 1. تغيير كلمة المرور ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
          style={{ marginBottom: 0 }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '560px'
          }}>
            {/* كلمة المرور الحالية */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                {lang === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  name="currentPassword"
                  value={securityState.currentPassword || ''}
                  onChange={handleSecurityChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    [isRtl ? 'left' : 'right']: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex'
                  }}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* كلمة المرور الجديدة */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                {lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  name="newPassword"
                  value={securityState.newPassword || ''}
                  onChange={handleSecurityChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    [isRtl ? 'left' : 'right']: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex'
                  }}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* مؤشر قوة كلمة المرور */}
              {newPass.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'مستوى أمان الكلمة:' : 'Password strength:'}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: strength.color }}>
                      {lang === 'ar' ? strength.labelAr : strength.labelEn}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', height: '4px' }}>
                    <div style={{
                      flex: 1,
                      borderRadius: '2px',
                      backgroundColor: strength.score >= 1 ? strength.color : 'var(--border-subtle)',
                      transition: 'background-color 0.2s'
                    }} />
                    <div style={{
                      flex: 1,
                      borderRadius: '2px',
                      backgroundColor: strength.score >= 2 ? strength.color : 'var(--border-subtle)',
                      transition: 'background-color 0.2s'
                    }} />
                    <div style={{
                      flex: 1,
                      borderRadius: '2px',
                      backgroundColor: strength.score >= 3 ? strength.color : 'var(--border-subtle)',
                      transition: 'background-color 0.2s'
                    }} />
                  </div>
                </div>
              )}
            </div>

            {/* تأكيد كلمة المرور الجديدة */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                {lang === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={securityState.confirmPassword || ''}
                  onChange={handleSecurityChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: passwordsMatch === false
                      ? '1px solid var(--danger)'
                      : passwordsMatch === true
                        ? '1px solid var(--success)'
                        : '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    [isRtl ? 'left' : 'right']: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex'
                  }}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {passwordsMatch === false && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '5px', color: 'var(--danger)', fontSize: '11.5px' }}>
                  <AlertCircle size={13} />
                  <span>{lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'}</span>
                </div>
              )}

              {passwordsMatch === true && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '5px', color: 'var(--success)', fontSize: '11.5px' }}>
                  <CheckCircle size={13} />
                  <span>{lang === 'ar' ? 'كلمتا المرور متطابقتان تماماً' : 'Passwords match successfully'}</span>
                </div>
              )}
            </div>

            <div style={{ paddingTop: '8px' }}>
              <SButton
                variant="primary"
                size="sm"
                icon={<KeyRound />}
                onClick={handlePasswordSave}
                disabled={!securityState.newPassword || passwordsMatch !== true}
              >
                {lang === 'ar' ? 'حفظ كلمة المرور الجديدة' : 'Update Password'}
              </SButton>
            </div>
          </div>
        </SSection>
      </SCard>

      {/* ── 2. البريد الإلكتروني وأرقام الهواتف ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={lang === 'ar' ? 'البريد الإلكتروني وأرقام الاتصال' : 'Email & Phone Contacts'}
          style={{ marginBottom: 0 }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px'
          }}>
            {/* البريد الإلكتروني */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                </label>
                <SBadge variant="success" size="xs">
                  {lang === 'ar' ? 'مؤكّد ✓' : 'Verified ✓'}
                </SBadge>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  placeholder="omar.tarek@motafawweq.me"
                  dir="ltr"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                {lang === 'ar' ? 'يُستخدم لتسجيل الدخول واستعادة الحساب.' : 'Used for login and password resets.'}
              </span>
            </div>

            {/* رقم هاتف الطالب */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'رقم هاتف الطالب (مصر)' : 'Student Phone (Egypt)'}
                </label>
                <SBadge variant="primary" size="xs">
                  {lang === 'ar' ? 'واتساب مفعّل' : 'WhatsApp Active'}
                </SBadge>
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                placeholder="01123456789"
                dir="ltr"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                {lang === 'ar' ? 'تصلك عليه تذكيرات مواعيد الحصص المباشرة والواجبات.' : 'Used for lesson reminders and live class alerts.'}
              </span>
            </div>

            {/* رقم ولي الأمر */}
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'رقم هاتف ولي الأمر (للمتابعة الأبوية)' : 'Guardian / Parent Phone'}
                </label>
                <SBadge variant="warning" size="xs">
                  {lang === 'ar' ? 'مرتبط بحساب ولي الأمر' : 'Linked to Parent Portal'}
                </SBadge>
              </div>
              <input
                type="tel"
                name="parentPhone"
                value={formData.parentPhone || ''}
                onChange={handleChange}
                placeholder="01223344556"
                dir="ltr"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                {lang === 'ar'
                  ? 'يستلم ولي الأمر عليه تقريراً أسبوعياً بدرجات الامتحانات ونسبة حضور الحصص.'
                  : 'Weekly performance and attendance reports will be sent to this number.'}
              </span>
            </div>
          </div>
        </SSection>
      </SCard>

      {/* ── 3. الجلسات النشطة والأجهزة ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={lang === 'ar' ? 'الأجهزة النشطة وجلسات الدخول' : 'Active Devices & Sessions'}
          style={{ marginBottom: 0 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* الجهاز الحالي */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Laptop size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      Windows 11 • Google Chrome
                    </span>
                    <SBadge variant="success" size="xs">
                      {lang === 'ar' ? 'هذا الجهاز الآن' : 'Current Device'}
                    </SBadge>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {lang === 'ar' ? 'القاهرة، مصر • نشط منذ قليل' : 'Cairo, Egypt • Active just now'}
                  </div>
                </div>
              </div>
              <ShieldCheck size={18} color="var(--success)" />
            </div>

            {/* جهاز هاتف مسجل */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Smartphone size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    iPhone 15 Pro • Motafawweq Mobile App
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {lang === 'ar' ? 'الجيزة، مصر • آخر دخول: أمس 08:30 م' : 'Giza, Egypt • Last active: Yesterday 08:30 PM'}
                  </div>
                </div>
              </div>
            </div>

            {/* زر إنهاء كافة الجلسات */}
            <div style={{ marginTop: '6px' }}>
              <SButton
                variant="ghost"
                size="sm"
                icon={<LogOut />}
                onClick={handleTerminateOtherSessions}
                style={{ color: 'var(--danger)', borderColor: 'rgba(220, 38, 38, 0.25)' }}
              >
                {lang === 'ar' ? 'تسجيل الخروج من كافة الأجهزة الأخرى' : 'Log out from all other devices'}
              </SButton>
            </div>
          </div>
        </SSection>
      </SCard>
    </div>
  );
};
