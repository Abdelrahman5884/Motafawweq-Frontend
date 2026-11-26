import React, { useState } from 'react';
import {
  User as UserIcon,
  Save,
  Bell,
  Users,
  UserPlus,
  Trash2,
  MessageSquare,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { InfoTooltip } from '../../components/common/InfoTooltip';
import { ParentAvatar } from './ParentAvatar';
import { ParentEmptyState } from './ParentEmptyState';

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 14px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-subtle)',
  backgroundColor: 'var(--bg-app)',
  color: 'var(--text-primary)',
  fontSize: '13px',
};

const formatDateShort = (iso, lang) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

export const ParentSettingsTab = ({
  lang,
  parentName,
  setParentName,
  parentPhone,
  setParentPhone,
  parentEmergencyPhone,
  setParentEmergencyPhone,
  parentEmail,
  setParentEmail,
  notifyTuitionRenewal,
  notifyAchievementsCertificates,
  settingsSaving,
  settingsError,
  savingToggleField,
  onSaveSettings,
  onToggleNotification,
  onChangePassword,
  childrenList,
  confirmUnlinkId,
  setConfirmUnlinkId,
  unlinkingId,
  onUnlinkChild,
  onOpenLinkModal,
  inquiries,
  inquiriesLoading,
  inquiriesPagination,
  loadingMoreInquiries,
  onLoadMoreInquiries,
  onOpenContactModal,
}) => {
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 10) {
      setPasswordError(lang === 'ar'
        ? 'يجب أن تتكون كلمة المرور الجديدة من 10 أحرف على الأقل (حروف كبيرة وصغيرة وأرقام ورموز).'
        : 'New password must be at least 10 characters with mixed case, numbers, and symbols.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(lang === 'ar' ? 'تأكيد كلمة المرور غير مطابق.' : 'Password confirmation does not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await onChangePassword({ currentPassword, newPassword, confirmPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess(
        res?.message || (lang === 'ar' ? 'تم تحديث كلمة المرور بنجاح.' : 'Password updated successfully.')
      );
    } catch (err) {
      const firstFieldErr = err?.errors ? Object.values(err.errors).flat()[0] : null;
      setPasswordError(
        firstFieldErr || err?.message || (lang === 'ar' ? 'تعذر تحديث كلمة المرور.' : 'Could not update password.')
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 1. Parent Profile Form */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <UserIcon size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'بيانات ولي الأمر' : 'Parent Profile'}
          </h3>
          <InfoTooltip
            text={lang === 'ar'
              ? 'تُستخدم هذه البيانات للتواصل المباشر مع إدارة السنتر والمعلمين وإرسال التقارير.'
              : 'Used by centers and teachers to contact you and dispatch reports.'}
          />
        </div>

        {settingsError && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#DC2626',
            fontSize: '12.5px',
            fontWeight: '700',
            marginBottom: '14px',
          }}>
            {settingsError}
          </div>
        )}

        <form onSubmit={onSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                {lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                minLength={2}
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                {lang === 'ar' ? 'رقم الهاتف الأساسي' : 'Primary Phone'}
              </label>
              <input
                type="tel"
                dir="ltr"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                {lang === 'ar' ? 'هاتف الطوارئ (اختياري)' : 'Emergency Phone'}
              </label>
              <input
                type="tel"
                dir="ltr"
                value={parentEmergencyPhone}
                onChange={(e) => setParentEmergencyPhone(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                type="email"
                required
                dir="ltr"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={settingsSaving}
            style={{
              alignSelf: 'flex-start',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 22px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '700',
              cursor: settingsSaving ? 'not-allowed' : 'pointer',
              opacity: settingsSaving ? 0.7 : 1,
            }}
          >
            {settingsSaving ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
            <span>{lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}</span>
          </button>
        </form>
      </div>

      {/* 2. Notification Preferences */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Bell size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'تفضيلات الإشعارات' : 'Notification Preferences'}
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            {
              field: 'notify_tuition_renewal',
              titleAr: 'إشعارات تجديد الاشتراكات وسداد الإيصالات',
              titleEn: 'Tuition renewal and payment receipt alerts',
              value: notifyTuitionRenewal,
            },
            {
              field: 'notify_achievements_certificates',
              titleAr: 'إشعار فوري عند تحقيق إنجاز أو شهادة تقدير للطالب',
              titleEn: 'Instant alert on achievements, trophies, or certificates',
              value: notifyAchievementsCertificates,
            },
          ].map((item) => (
            <label
              key={item.field}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
                padding: '14px 16px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                cursor: savingToggleField === item.field ? 'wait' : 'pointer',
                opacity: savingToggleField === item.field ? 0.7 : 1,
              }}
            >
              <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? item.titleAr : item.titleEn}
              </span>
              <input
                type="checkbox"
                disabled={savingToggleField === item.field}
                checked={item.value}
                onChange={(e) => onToggleNotification(item.field, e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* 3. Security & Change Password */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'الأمان وكلمة المرور' : 'Security & Password'}
            </h3>
            <InfoTooltip
              text={lang === 'ar'
                ? 'استخدم كلمة مرور قوية لا تقل عن 10 أحرف تحتوي على حروف كبيرة وصغيرة وأرقام ورمز. سيتم تسجيل خروج باقي الأجهزة تلقائياً.'
                : 'Use a strong password of at least 10 characters with mixed case, numbers, and symbols. Other devices will be signed out.'}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowPasswords((v) => !v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{showPasswords ? (lang === 'ar' ? 'إخفاء' : 'Hide') : (lang === 'ar' ? 'إظهار' : 'Show')}</span>
          </button>
        </div>

        {passwordError && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#DC2626',
            fontSize: '12.5px',
            fontWeight: '700',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle size={15} />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(22, 163, 74, 0.1)',
            border: '1px solid rgba(22, 163, 74, 0.25)',
            color: 'var(--success, #16A34A)',
            fontSize: '12.5px',
            fontWeight: '700',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <CheckCircle2 size={15} />
            <span>{passwordSuccess}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                {lang === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                required
                dir="ltr"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                {lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                required
                minLength={10}
                dir="ltr"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                {lang === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                required
                minLength={10}
                dir="ltr"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordSaving}
            style={{
              alignSelf: 'flex-start',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-medium)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: passwordSaving ? 'not-allowed' : 'pointer',
              opacity: passwordSaving ? 0.7 : 1,
            }}
          >
            {passwordSaving ? <Loader2 size={14} className="spin" /> : <Lock size={14} />}
            <span>{lang === 'ar' ? 'تحديث كلمة المرور' : 'Update Password'}</span>
          </button>
        </form>
      </div>

      {/* 4. Linked Students Management */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'الأبناء المربوطون بالحساب' : 'Linked Students'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onOpenLinkModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <UserPlus size={14} />
            <span>{lang === 'ar' ? 'ربط طالب جديد' : 'Link Student'}</span>
          </button>
        </div>

        {childrenList.length === 0 ? (
          <ParentEmptyState
            icon={Users}
            title={lang === 'ar' ? 'لم يتم ربط أي طالب بعد' : 'No linked students yet'}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {childrenList.map((ch) => (
              <div
                key={ch.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ParentAvatar src={ch.avatar} name={ch.nameAr || ch.name} size={42} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {lang === 'ar' ? ch.nameAr : ch.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {lang === 'ar' ? ch.gradeAr : ch.grade} • {ch.studentCode}
                    </div>
                  </div>
                </div>

                {confirmUnlinkId === ch.id ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      disabled={unlinkingId === ch.id}
                      onClick={() => onUnlinkChild(ch.id)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#DC2626',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      {lang === 'ar' ? 'تأكيد' : 'Confirm'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmUnlinkId(null)}
                      style={{
                        padding: '5px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'transparent',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '11.5px',
                        cursor: 'pointer',
                      }}
                    >
                      {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    title={lang === 'ar' ? 'فك ارتباط الطالب' : 'Unlink student'}
                    onClick={() => setConfirmUnlinkId(ch.id)}
                    style={{
                      padding: '6px 9px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                      color: '#DC2626',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11.5px',
                      fontWeight: '700',
                    }}
                  >
                    <Trash2 size={13} />
                    <span>{lang === 'ar' ? 'فك الربط' : 'Unlink'}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Sent Inquiries History */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'سجل الاستفسارات المرسلة' : 'Sent Inquiries'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onOpenContactModal}
            style={{
              padding: '7px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {lang === 'ar' ? 'استفسار جديد +' : 'New Inquiry +'}
          </button>
        </div>

        {inquiriesLoading ? (
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Loader2 size={14} className="spin" />
            <span>{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
          </div>
        ) : inquiries.length === 0 ? (
          <ParentEmptyState
            icon={MessageSquare}
            title={lang === 'ar' ? 'لم ترسل أي استفسارات بعد' : 'No inquiries sent yet'}
          />
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {inq.subject}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '99px',
                      backgroundColor: inq.status === 'replied' ? 'rgba(22, 163, 74, 0.12)' : 'rgba(21, 136, 199, 0.12)',
                      color: inq.status === 'replied' ? 'var(--color-success, #16A34A)' : 'var(--primary)',
                    }}>
                      {inq.statusAr}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {inq.studentName && <span>{lang === 'ar' ? `الطالب: ${inq.studentName}` : `Student: ${inq.studentName}`}</span>}
                    {inq.centerNameAr && <span>• {inq.centerNameAr}</span>}
                    {inq.teacherName && <span>• {inq.teacherName}</span>}
                    {inq.createdAt && <span>• {formatDateShort(inq.createdAt, lang)}</span>}
                  </div>

                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {inq.message}
                  </div>
                  {inq.replyText && (
                    <div style={{
                      marginTop: '8px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                    }}>
                      <strong>{lang === 'ar' ? 'الرد:' : 'Reply:'}</strong> {inq.replyText}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {inquiriesPagination && inquiriesPagination.currentPage < inquiriesPagination.lastPage && (
              <div style={{ textAlign: 'center', marginTop: '14px' }}>
                <button
                  type="button"
                  disabled={loadingMoreInquiries}
                  onClick={onLoadMoreInquiries}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--primary)',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: loadingMoreInquiries ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {loadingMoreInquiries && <Loader2 size={13} className="spin" />}
                  <span>{lang === 'ar' ? 'عرض المزيد من الاستفسارات' : 'Load More Inquiries'}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
