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
import { TEACHER_PLANS } from '../../../constants/teacherPlanFeatures';

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

export const TeacherProfileSection = ({
  formData,
  fieldErrors = {},
  teacherPlanTier = 'free',
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
  const displayName = (isAr ? formData.nameAr : (formData.nameEn || formData.nameAr))?.trim()
    || (isAr ? 'معلم متفوّق' : 'Motafawweq Educator');
  const planMeta = TEACHER_PLANS[teacherPlanTier] || TEACHER_PLANS.free;

  const nameArError = fieldErrors.nameAr || fieldErrors.name_ar;
  const phoneError = fieldErrors.phone || fieldErrors.whatsapp_phone;
  const bioError = fieldErrors.bioAr || fieldErrors.bio_ar;

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
        text: isAr ? 'تم تحديث صورتك الشخصية بنجاح.' : 'Profile picture updated successfully.',
      });
    } catch (err) {
      setAvatarFeedback({
        type: 'error',
        text: err?.message || (isAr ? 'تعذر رفع الصورة الشخصية.' : 'Failed to upload profile picture.'),
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
          ? 'تم حذف الصورة الشخصية وعرض أول حرفين من اسمك مكانها.'
          : 'Profile picture removed. Showing your initials instead.',
      });
    } catch (err) {
      setAvatarFeedback({
        type: 'error',
        text: err?.message || (isAr ? 'تعذر حذف الصورة الشخصية.' : 'Failed to remove profile picture.'),
      });
    } finally {
      setIsDeletingAvatar(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── 1. الصورة الشخصية والهوية الأكاديمية ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={isAr ? 'الصورة الشخصية' : 'Profile Picture'}
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
                    ? (isAr ? 'اضغط لتكبير الصورة' : 'Click to enlarge')
                    : (isAr ? 'اضغط لرفع صورة شخصية' : 'Click to upload picture')
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

                {formData.isVerifiedEducator && (
                  <SBadge variant="success" size="xs">
                    {isAr ? 'معلم معتمد ✓' : 'Verified Educator ✓'}
                  </SBadge>
                )}

                <Link
                  to="/teacher/billing"
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
                  <span>{isAr ? planMeta.nameAr : planMeta.nameEn}</span>
                </Link>
              </div>

              {formData.titleAr && (
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {formData.titleAr}
                </div>
              )}

              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 14px 0', lineHeight: 1.55 }}>
                {isAr
                  ? 'تظهر لطلابك في صفحات الكورسات والشهادات المعتمدة (JPG أو PNG أو WEBP بحد أقصى 5 ميجابايت).'
                  : 'Shown to students on course pages and verified certificates (JPG, PNG, or WEBP up to 5MB).'}
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
                    ? (isAr ? 'تغيير الصورة' : 'Change Picture')
                    : (isAr ? 'رفع صورة من جهازك' : 'Upload Picture')}
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
                      ? (isAr ? 'جاري الحذف...' : 'Removing...')
                      : (isAr ? 'حذف الصورة' : 'Remove Picture')}
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

      {/* ── 2. البيانات الشخصية والتعريف الأكاديمي ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={isAr ? 'البيانات الشخصية والتعريف الأكاديمي' : 'Personal & Academic Identity'}
          style={{ marginBottom: 0 }}
        >
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 18px 0', lineHeight: 1.5 }}>
            {isAr
              ? 'هذه البيانات تظهر لطلابك في صفحة الكورسات والشهادات المعتمدة وكروت المجموعات.'
              : 'Displayed to students across courses, verified certificates, and cohort cards.'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {/* الاسم بالعربية */}
            <div>
              <label htmlFor="teacher-name-ar" style={labelStyle}>
                {isAr ? 'الاسم الكامل باللغة العربية *' : 'Full Name (Arabic) *'}
              </label>
              <input
                id="teacher-name-ar"
                type="text"
                name="nameAr"
                value={formData.nameAr}
                onChange={handleChange}
                maxLength={150}
                placeholder={isAr ? 'مثال: د. سلمى السيد' : 'e.g. Dr. Salma El-Sayed'}
                style={{
                  ...inputBaseStyle,
                  borderColor: nameArError ? 'var(--danger, #DC2626)' : 'var(--border-medium)',
                }}
              />
              {nameArError && <span style={fieldErrorStyle}>{nameArError}</span>}
            </div>

            {/* الاسم بالإنجليزية */}
            <div>
              <label htmlFor="teacher-name-en" style={labelStyle}>
                {isAr ? 'الاسم باللغة الإنجليزية' : 'Full Name (English)'}
              </label>
              <input
                id="teacher-name-en"
                type="text"
                name="nameEn"
                dir="ltr"
                value={formData.nameEn}
                onChange={handleChange}
                maxLength={150}
                placeholder="e.g. Dr. Salma El-Sayed"
                style={inputBaseStyle}
              />
            </div>

            {/* المسمى الأكاديمي */}
            <div>
              <label htmlFor="teacher-title-ar" style={labelStyle}>
                {isAr ? 'المسمى الأكاديمي والصفة التدريسية' : 'Academic Title / Position'}
              </label>
              <input
                id="teacher-title-ar"
                type="text"
                name="titleAr"
                value={formData.titleAr}
                onChange={handleChange}
                maxLength={200}
                placeholder={isAr ? 'مثال: كبير معلمي الأحياء للثانوية العامة' : 'e.g. Senior Biology Educator'}
                style={inputBaseStyle}
              />
            </div>

            {/* المادة التخصصية */}
            <div>
              <label htmlFor="teacher-subject-ar" style={labelStyle}>
                {isAr ? 'المادة التخصصية' : 'Subject'}
              </label>
              <input
                id="teacher-subject-ar"
                type="text"
                name="subjectAr"
                value={formData.subjectAr}
                onChange={handleChange}
                maxLength={120}
                placeholder={isAr ? 'مثال: الأحياء والجيولوجيا' : 'e.g. Biology & Geology'}
                style={inputBaseStyle}
              />
            </div>

            {/* البريد الإلكتروني (للقراءة فقط لحماية تسجيل الدخول والتوثيق) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="teacher-email" style={{ ...labelStyle, marginBottom: 0 }}>
                  {isAr ? 'البريد الإلكتروني للحساب' : 'Account Email'}
                </label>
                <SBadge variant={formData.emailVerified ? 'success' : 'warning'} size="xs">
                  {formData.emailVerified
                    ? (isAr ? 'مؤكّد ✓' : 'Verified ✓')
                    : (isAr ? 'بانتظار التأكيد' : 'Unverified')}
                </SBadge>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="teacher-email"
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
                {isAr ? 'يُستخدم لتسجيل الدخول واستعادة كلمة المرور (للقراءة فقط).' : 'Used for sign-in and password recovery (read-only).'}
              </span>
            </div>

            {/* رقم الهاتف / واتساب */}
            <div>
              <label htmlFor="teacher-phone" style={labelStyle}>
                {isAr ? 'رقم الهاتف / WhatsApp' : 'Phone / WhatsApp'}
              </label>
              <input
                id="teacher-phone"
                type="tel"
                name="phone"
                dir="ltr"
                value={formData.phone}
                onChange={handleChange}
                maxLength={30}
                placeholder="01012345678"
                style={{
                  ...inputBaseStyle,
                  borderColor: phoneError ? 'var(--danger, #DC2626)' : 'var(--border-medium)',
                }}
              />
              {phoneError && <span style={fieldErrorStyle}>{phoneError}</span>}
            </div>
          </div>

          {/* النبذة التعريفية */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label htmlFor="teacher-bio-ar" style={{ ...labelStyle, marginBottom: 0 }}>
                {isAr ? 'النبذة التعريفية والخبرات الأكاديمية' : 'Teacher Bio & Experience'}
              </label>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {(formData.bioAr || '').length} / 3000
              </span>
            </div>
            <textarea
              id="teacher-bio-ar"
              rows={3}
              name="bioAr"
              maxLength={3000}
              value={formData.bioAr}
              onChange={handleChange}
              placeholder={
                isAr
                  ? 'اكتب نبذة مختصرة عن خبرتك التدريسية وأسلوبك التعليمي...'
                  : 'Write a brief overview of your teaching experience...'
              }
              style={{
                ...inputBaseStyle,
                lineHeight: 1.6,
                resize: 'vertical',
                borderColor: bioError ? 'var(--danger, #DC2626)' : 'var(--border-medium)',
              }}
            />
            {bioError && <span style={fieldErrorStyle}>{bioError}</span>}
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
