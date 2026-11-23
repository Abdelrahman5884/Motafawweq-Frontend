import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Crown,
} from 'lucide-react';
import { SCard, SSection, SBadge, SButton } from '../../../components/student/ui';
import { Avatar } from '../../../components/common/Avatar';
import { AvatarCropperModal, AvatarLightboxModal } from '../../../components/common/AvatarCropperModal';
import { CENTER_PLANS } from './centerSettingsConfig';

const inputBaseStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-medium)',
  backgroundColor: 'var(--bg-surface)',
  color: 'var(--text-primary)',
  fontSize: '13.5px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'var(--font-arabic)',
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: 'var(--text-primary)',
  marginBottom: '6px',
};

const fieldErrorStyle = {
  fontSize: '11.5px',
  color: 'var(--danger, #DC2626)',
  fontWeight: '600',
  marginTop: '4px',
  display: 'block',
};

export const CenterProfileSection = ({
  formData,
  fieldErrors = {},
  centerPlanTier = 'free',
  handleChange,
  onUploadAvatar,
  onDeleteAvatar,
  lang,
  isRtl,
}) => {
  const isAr = lang === 'ar';
  const fileInputRef = useRef(null);

  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const [isAvatarLightboxOpen, setIsAvatarLightboxOpen] = useState(false);
  const [avatarFeedback, setAvatarFeedback] = useState(null);

  const hasAvatar = Boolean(formData.avatar && String(formData.avatar).trim());
  const displayName =
    (isAr
      ? formData.centerNameAr
      : formData.centerNameEn || formData.centerNameAr
    )?.trim() || (isAr ? 'السنتر التعليمي' : 'Educational Center');

  const resolvedTier = String(formData.planTier || centerPlanTier || 'free').toLowerCase();
  const planMeta = CENTER_PLANS[resolvedTier] || CENTER_PLANS.free;
  const planLabel = isAr
    ? formData.planNameAr || planMeta.nameAr
    : formData.planNameEn || planMeta.nameEn;

  const centerNameError = fieldErrors.centerNameAr || fieldErrors.name_ar;
  const managerNameError = fieldErrors.managerName || fieldErrors.manager_name;
  const phoneError = fieldErrors.phone;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setAvatarFeedback(null);

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setAvatarFeedback({
        type: 'error',
        text: isAr
          ? 'صيغة الصورة غير مدعومة. يرجى اختيار صورة JPG أو PNG أو WEBP.'
          : 'Unsupported image format. Please choose JPG, PNG, or WEBP.',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setAvatarFeedback({
        type: 'error',
        text: isAr
          ? 'حجم الصورة كبير جداً (الحد الأقصى 10 ميجابايت قبل القص).'
          : 'Selected image is too large (max 10 MB before cropping).',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setCropImageSrc(ev.target.result);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmCrop = async (croppedFile) => {
    setIsUploadingAvatar(true);
    setAvatarFeedback(null);
    try {
      await onUploadAvatar(croppedFile);
      setIsCropperOpen(false);
      setCropImageSrc(null);
      setAvatarFeedback({
        type: 'success',
        text: isAr ? 'تم تحديث شعار السنتر بنجاح.' : 'Center logo updated successfully.',
      });
    } catch (err) {
      setAvatarFeedback({
        type: 'error',
        text: err?.message || (isAr ? 'تعذر رفع شعار السنتر.' : 'Failed to upload center logo.'),
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!hasAvatar || isDeletingAvatar) return;
    setIsDeletingAvatar(true);
    setAvatarFeedback(null);
    try {
      await onDeleteAvatar();
      setAvatarFeedback({
        type: 'success',
        text: isAr
          ? 'تم حذف شعار السنتر وعرض الأحرف الأولى مكانه.'
          : 'Center logo removed. Showing initials instead.',
      });
    } catch (err) {
      setAvatarFeedback({
        type: 'error',
        text: err?.message || (isAr ? 'تعذر حذف الشعار.' : 'Failed to remove logo.'),
      });
    } finally {
      setIsDeletingAvatar(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── 1. شعار / صورة السنتر ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={isAr ? 'شعار وصورة السنتر' : 'Center Logo & Picture'}
          style={{ marginBottom: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Avatar
                src={formData.avatar}
                name={displayName}
                size={96}
                border="3px solid var(--primary)"
                boxShadow="0 4px 16px rgba(21, 136, 199, 0.22)"
                onClick={() => (hasAvatar ? setIsAvatarLightboxOpen(true) : fileInputRef.current?.click())}
                title={
                  hasAvatar
                    ? isAr
                      ? 'اضغط لتكبير الشعار'
                      : 'Click to enlarge'
                    : isAr
                      ? 'اضغط لرفع شعار السنتر'
                      : 'Click to upload logo'
                }
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar || isDeletingAvatar}
                title={isAr ? 'رفع صورة جديدة' : 'Upload picture'}
                aria-label={isAr ? 'رفع صورة جديدة' : 'Upload picture'}
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  [isRtl ? 'left' : 'right']: '2px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: '2px solid var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                <Camera size={15} />
              </button>
            </div>

            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <span style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {displayName}
                </span>

                {formData.isVerifiedCenter && (
                  <SBadge variant="success" size="xs">
                    {isAr ? 'سنتر معتمد ✓' : 'Verified Center ✓'}
                  </SBadge>
                )}

                <Link
                  to="/center/billing"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '3px 9px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--primary-surface)',
                    color: 'var(--primary)',
                    textDecoration: 'none',
                  }}
                >
                  <Crown size={11} />
                  <span>{planLabel}</span>
                </Link>
              </div>

              {formData.managerName && (
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {isAr ? `الإدارة: ${formData.managerName}` : `Manager: ${formData.managerName}`}
                </div>
              )}

              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 14px 0', lineHeight: 1.55 }}>
                {isAr
                  ? 'يظهر الشعار في لوحة التحكم وبطاقات الطلاب المطبوعة (JPG أو PNG أو WEBP بحد أقصى 5 ميجابايت).'
                  : 'Shown across your dashboard and printed student ID passes (JPG, PNG, or WEBP up to 5MB).'}
              </p>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp"
                  style={{ display: 'none' }}
                />

                <SButton
                  variant="primary"
                  size="sm"
                  icon={<Camera />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar || isDeletingAvatar}
                >
                  {hasAvatar
                    ? isAr
                      ? 'تغيير الشعار'
                      : 'Change Logo'
                    : isAr
                      ? 'رفع شعار من جهازك'
                      : 'Upload Logo'}
                </SButton>

                {hasAvatar && (
                  <SButton
                    variant="danger"
                    size="sm"
                    icon={<Trash2 />}
                    onClick={handleRemoveAvatar}
                    disabled={isDeletingAvatar || isUploadingAvatar}
                  >
                    {isDeletingAvatar
                      ? isAr
                        ? 'جاري الحذف...'
                        : 'Removing...'
                      : isAr
                        ? 'حذف الشعار'
                        : 'Remove Logo'}
                  </SButton>
                )}
              </div>
            </div>
          </div>

          {avatarFeedback && (
            <div
              role="status"
              style={{
                marginTop: '14px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: avatarFeedback.type === 'success' ? 'var(--success-light)' : 'var(--error-light)',
                color: avatarFeedback.type === 'success' ? 'var(--success)' : 'var(--danger, #DC2626)',
                fontSize: '12.5px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {avatarFeedback.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
              <span>{avatarFeedback.text}</span>
            </div>
          )}
        </SSection>
      </SCard>

      {/* ── 2. بيانات السنتر والحساب ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={isAr ? 'بيانات السنتر والحساب' : 'Center & Account Information'}
          style={{ marginBottom: 0 }}
        >
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 18px 0', lineHeight: 1.5 }}>
            {isAr
              ? 'البيانات الأساسية للسنتر التي تظهر في لوحة التحكم، المجموعات، وبطاقات الحضور.'
              : 'Core center identity displayed across your dashboard, cohorts, and student passes.'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {/* اسم السنتر بالعربية */}
            <div>
              <label htmlFor="center-name-ar" style={labelStyle}>
                {isAr ? 'اسم السنتر (بالعربية) *' : 'Center Name (Arabic) *'}
              </label>
              <input
                id="center-name-ar"
                type="text"
                name="centerNameAr"
                value={formData.centerNameAr}
                onChange={handleChange}
                maxLength={180}
                placeholder={isAr ? 'مثال: سنتر متفوّق التعليمي' : 'e.g. Motafawweq Center'}
                style={{
                  ...inputBaseStyle,
                  borderColor: centerNameError ? 'var(--danger, #DC2626)' : 'var(--border-medium)',
                }}
              />
              {centerNameError && <span style={fieldErrorStyle}>{centerNameError}</span>}
            </div>

            {/* اسم السنتر بالإنجليزية */}
            <div>
              <label htmlFor="center-name-en" style={labelStyle}>
                {isAr ? 'اسم السنتر (بالإنجليزية)' : 'Center Name (English)'}
              </label>
              <input
                id="center-name-en"
                type="text"
                name="centerNameEn"
                dir="ltr"
                value={formData.centerNameEn}
                onChange={handleChange}
                maxLength={180}
                placeholder="e.g. Motafawweq Academic Center"
                style={inputBaseStyle}
              />
            </div>

            {/* اسم مدير السنتر */}
            <div>
              <label htmlFor="center-manager-name" style={labelStyle}>
                {isAr ? 'اسم مدير السنتر' : 'Center Manager Name'}
              </label>
              <input
                id="center-manager-name"
                type="text"
                name="managerName"
                value={formData.managerName}
                onChange={handleChange}
                maxLength={150}
                placeholder={isAr ? 'الاسم الشخصي لمدير الحساب' : 'Manager full name'}
                style={{
                  ...inputBaseStyle,
                  borderColor: managerNameError ? 'var(--danger, #DC2626)' : 'var(--border-medium)',
                }}
              />
              {managerNameError && <span style={fieldErrorStyle}>{managerNameError}</span>}
            </div>

            {/* البريد الإلكتروني للحساب (للقراءة فقط) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="center-email" style={{ ...labelStyle, marginBottom: 0 }}>
                  {isAr ? 'البريد الإلكتروني للحساب' : 'Account Email'}
                </label>
                <SBadge variant={formData.emailVerified ? 'success' : 'warning'} size="xs">
                  {formData.emailVerified
                    ? isAr
                      ? 'مؤكّد ✓'
                      : 'Verified ✓'
                    : isAr
                      ? 'بانتظار التأكيد'
                      : 'Unverified'}
                </SBadge>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="center-email"
                  type="email"
                  value={formData.email}
                  readOnly
                  disabled
                  dir="ltr"
                  style={{
                    ...inputBaseStyle,
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)',
                    cursor: 'not-allowed',
                    paddingInlineEnd: '36px',
                  }}
                />
                <Mail
                  size={15}
                  color="var(--text-muted)"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    insetInlineEnd: '12px',
                    pointerEvents: 'none',
                  }}
                />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                {isAr
                  ? 'يُستخدم لتسجيل الدخول واستعادة كلمة المرور (للقراءة فقط).'
                  : 'Used for sign-in and password recovery (read-only).'}
              </span>
            </div>

            {/* رقم الهاتف */}
            <div>
              <label htmlFor="center-phone" style={labelStyle}>
                {isAr ? 'رقم الهاتف / الخط الساخن' : 'Phone / Hotline'}
              </label>
              <input
                id="center-phone"
                type="tel"
                name="phone"
                dir="ltr"
                value={formData.phone}
                onChange={handleChange}
                maxLength={40}
                placeholder="01012345678"
                style={{
                  ...inputBaseStyle,
                  borderColor: phoneError ? 'var(--danger, #DC2626)' : 'var(--border-medium)',
                }}
              />
              {phoneError && <span style={fieldErrorStyle}>{phoneError}</span>}
            </div>

            {/* مواعيد العمل */}
            <div>
              <label htmlFor="center-working-hours" style={labelStyle}>
                {isAr ? 'مواعيد العمل الرسمية' : 'Working Hours'}
              </label>
              <input
                id="center-working-hours"
                type="text"
                name="workingHours"
                value={formData.workingHours}
                onChange={handleChange}
                maxLength={120}
                placeholder={isAr ? '08:00 ص - 10:00 م' : '08:00 AM - 10:00 PM'}
                style={inputBaseStyle}
              />
            </div>

            {/* العنوان الرئيسي */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="center-address-ar" style={labelStyle}>
                {isAr ? 'العنوان الرئيسي للسنتر' : 'Headquarters Address'}
              </label>
              <input
                id="center-address-ar"
                type="text"
                name="addressAr"
                value={formData.addressAr}
                onChange={handleChange}
                maxLength={255}
                placeholder={isAr ? 'المدينة، الحي، الشارع الرئيسي...' : 'City, District, Main Street'}
                style={inputBaseStyle}
              />
            </div>
          </div>
        </SSection>
      </SCard>

      <AvatarCropperModal
        isOpen={isCropperOpen}
        imageSrc={cropImageSrc}
        isAr={isAr}
        isUploading={isUploadingAvatar}
        onClose={() => {
          if (!isUploadingAvatar) {
            setIsCropperOpen(false);
            setCropImageSrc(null);
          }
        }}
        onConfirm={handleConfirmCrop}
      />

      {hasAvatar && (
        <AvatarLightboxModal
          isOpen={isAvatarLightboxOpen}
          imageSrc={formData.avatar}
          altText={displayName}
          isAr={isAr}
          onClose={() => setIsAvatarLightboxOpen(false)}
        />
      )}
    </div>
  );
};
