import React, { useRef, useState } from 'react';
import {
  Camera,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  KeyRound,
  Mail,
} from 'lucide-react';
import { SCard, SSection, SBadge, SButton } from '../../../components/student/ui';
import { Avatar } from '../../../components/common/Avatar';
import { AvatarCropperModal, AvatarLightboxModal } from '../../../components/common/AvatarCropperModal';
import { copyTextToClipboard } from '../../../utils';
import {
  GRADE_GROUPS,
  EGYPT_GOVERNORATES,
  getTracksForGrade,
} from './studentSettingsConfig';

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

export const ProfileSettingsSection = ({
  formData,
  fieldErrors = {},
  handleChange,
  handleGradeChange,
  onUploadAvatar,
  onDeleteAvatar,
  lang,
  isRtl,
}) => {
  const isAr = lang === 'ar';
  const fileInputRef = useRef(null);

  const [copiedCode, setCopiedCode] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const [isAvatarLightboxOpen, setIsAvatarLightboxOpen] = useState(false);
  const [avatarFeedback, setAvatarFeedback] = useState(null);

  const hasAvatar = Boolean(formData.avatar && String(formData.avatar).trim());
  const availableTracks = getTracksForGrade(formData.gradeAr);
  const displayName = formData.name?.trim() || (isAr ? 'طالب متفوق' : 'Motafawweq Student');

  const handleCopyStudentCode = async () => {
    if (!formData.studentCode) return;
    const ok = await copyTextToClipboard(formData.studentCode);
    if (ok) {
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const onFileInput = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setAvatarFeedback(null);

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setAvatarFeedback({
        type: 'error',
        text: isAr
          ? 'صيغة الصورة غير مدعومة. يرجى اختيار صورة JPG أو PNG أو WEBP.'
          : 'Unsupported image format. Please select JPG, PNG, or WEBP.',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setAvatarFeedback({
        type: 'error',
        text: isAr
          ? 'حجم الصورة كبير جداً (الحد الأقصى 10 ميجابايت قبل القص).'
          : 'Image is too large (max 10 MB before cropping).',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCropImageSrc(event.target.result);
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
      {/* ── 1. الصورة الشخصية (مع أول حرفين من الاسم تلقائياً كواتساب عند عدم وجود صورة) ── */}
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
                    ? (isAr ? 'اضغط لتكبير الصورة' : 'Click to view full picture')
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
                  color: '#fff',
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
                <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {displayName}
                </span>
                <SBadge variant="primary" size="xs">
                  {formData.gradeAr}
                </SBadge>
              </div>

              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 14px 0', lineHeight: 1.55 }}>
                {isAr
                  ? 'يمكنك رفع صورة شخصية (JPG أو PNG أو WEBP بحد أقصى 5 ميجابايت). عند عدم وضع صورة، يظهر أول حرفين من اسمك تلقائياً في المنصة ولوحة الدوري.'
                  : 'Upload a personal photo (JPG, PNG, or WEBP up to 5MB). Without a photo, your first two initials are displayed automatically.'}
              </p>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileInput}
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

      {/* ── 2. كود الطالب لربط حساب ولي الأمر ── */}
      {formData.studentCode && (
        <SCard
          padding={20}
          style={{
            border: '1px solid var(--primary)',
            background: 'linear-gradient(135deg, var(--primary-surface, rgba(21, 136, 199, 0.08)) 0%, var(--bg-surface) 100%)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <KeyRound size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {isAr ? 'كود الطالب الخاص بك (لربط حساب ولي الأمر)' : 'Your Student Code (Parent Link)'}
                  </span>
                  <SBadge variant="primary" size="xs">
                    {isAr ? 'كود رسمي' : 'Official Code'}
                  </SBadge>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                  {isAr
                    ? 'شارك هذا الكود مع ولي أمرك لاستخدامه عند إنشاء حساب ولي الأمر على المنصة ومتابعة مستواك.'
                    : 'Share this code with your parent to link their Parent Account to your progress.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <code
                dir="ltr"
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1.5px dashed var(--primary)',
                  color: 'var(--primary)',
                  fontSize: '15px',
                  fontWeight: '800',
                  letterSpacing: '1px',
                }}
              >
                {formData.studentCode}
              </code>
              <SButton
                variant={copiedCode ? 'success' : 'primary'}
                size="sm"
                icon={copiedCode ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                onClick={handleCopyStudentCode}
              >
                {copiedCode
                  ? (isAr ? 'تم النسخ!' : 'Copied!')
                  : (isAr ? 'نسخ الكود' : 'Copy Code')}
              </SButton>
            </div>
          </div>
        </SCard>
      )}

      {/* ── 3. البيانات الشخصية والتواصل ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={isAr ? 'البيانات الشخصية ومعلومات التواصل' : 'Personal & Contact Details'}
          style={{ marginBottom: 0 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {/* الاسم بالكامل */}
            <div>
              <label htmlFor="student-name" style={labelStyle}>
                {isAr ? 'الاسم بالكامل *' : 'Full Name *'}
              </label>
              <input
                id="student-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={120}
                placeholder={isAr ? 'مثال: عمر طارق القاضي' : 'e.g. Omar Tarek El-Kady'}
                style={{
                  ...inputBaseStyle,
                  borderColor: fieldErrors.name ? 'var(--danger, #DC2626)' : 'var(--border-medium)',
                }}
              />
              {fieldErrors.name ? (
                <span style={fieldErrorStyle}>{fieldErrors.name}</span>
              ) : (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  {isAr ? 'يُستخدم في الشهادات المعتمدة، بطاقة السنتر، ولوحة الدوري.' : 'Used on official certificates, center pass, and leaderboards.'}
                </span>
              )}
            </div>

            {/* البريد الإلكتروني (للقراءة فقط) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="student-email" style={{ ...labelStyle, marginBottom: 0 }}>
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
                  id="student-email"
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
                {isAr ? 'يُستخدم لتسجيل الدخول واستعادة كلمة المرور (للقراءة فقط).' : 'Used for login and password recovery (read-only).'}
              </span>
            </div>

            {/* رقم هاتف الطالب */}
            <div>
              <label htmlFor="student-phone" style={labelStyle}>
                {isAr ? 'رقم هاتف الطالب' : 'Student Phone Number'}
              </label>
              <input
                id="student-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={20}
                placeholder="01012345678"
                dir="ltr"
                style={{
                  ...inputBaseStyle,
                  borderColor: fieldErrors.phone ? 'var(--danger, #DC2626)' : 'var(--border-medium)',
                }}
              />
              {fieldErrors.phone && <span style={fieldErrorStyle}>{fieldErrors.phone}</span>}
            </div>

            {/* رقم هاتف ولي الأمر */}
            <div>
              <label htmlFor="student-parent-phone" style={labelStyle}>
                {isAr ? 'رقم هاتف ولي الأمر' : 'Parent / Guardian Phone'}
              </label>
              <input
                id="student-parent-phone"
                type="tel"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                maxLength={20}
                placeholder="01223344556"
                dir="ltr"
                style={{
                  ...inputBaseStyle,
                  borderColor: fieldErrors.parent_phone ? 'var(--danger, #DC2626)' : 'var(--border-medium)',
                }}
              />
              {fieldErrors.parent_phone && <span style={fieldErrorStyle}>{fieldErrors.parent_phone}</span>}
            </div>
          </div>
        </SSection>
      </SCard>

      {/* ── 4. المرحلة الدراسية والبيانات الأكاديمية ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={isAr ? 'المرحلة الدراسية والبيانات الأكاديمية' : 'Academic Stage & School Info'}
          style={{ marginBottom: 0 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {/* المرحلة والصف الدراسي */}
            <div>
              <label htmlFor="student-grade" style={labelStyle}>
                {isAr ? 'المرحلة والصف الدراسي *' : 'Educational Stage & Grade *'}
              </label>
              <select
                id="student-grade"
                name="gradeAr"
                value={formData.gradeAr}
                onChange={(e) => handleGradeChange(e.target.value)}
                style={{ ...inputBaseStyle, cursor: 'pointer' }}
              >
                {GRADE_GROUPS.map((group) => (
                  <optgroup key={group.id} label={isAr ? group.labelAr : group.labelEn}>
                    {group.grades.map((g) => (
                      <option key={g.value} value={g.value}>
                        {isAr ? g.labelAr : g.labelEn}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* الشعبة والتخصص */}
            <div>
              <label htmlFor="student-track" style={labelStyle}>
                {isAr ? 'الشعبة / النظام التعليمي *' : 'Track / Stream *'}
              </label>
              <select
                id="student-track"
                name="trackAr"
                value={formData.trackAr}
                onChange={handleChange}
                style={{ ...inputBaseStyle, cursor: 'pointer' }}
              >
                {availableTracks.map((tr) => (
                  <option key={tr.value} value={tr.value}>
                    {isAr ? tr.labelAr : tr.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* المحافظة */}
            <div>
              <label htmlFor="student-governorate" style={labelStyle}>
                {isAr ? 'المحافظة' : 'Governorate'}
              </label>
              <select
                id="student-governorate"
                name="governorate"
                value={formData.governorate}
                onChange={handleChange}
                style={{ ...inputBaseStyle, cursor: 'pointer' }}
              >
                <option value="">{isAr ? '— اختر المحافظة —' : '— Select Governorate —'}</option>
                {EGYPT_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>

            {/* اسم المدرسة */}
            <div>
              <label htmlFor="student-school" style={labelStyle}>
                {isAr ? 'اسم المدرسة' : 'School Name'}
              </label>
              <input
                id="student-school"
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                maxLength={150}
                placeholder={isAr ? 'مثال: مدرسة السعيدية الثانوية' : 'e.g. El-Saidia Secondary School'}
                style={inputBaseStyle}
              />
            </div>

            {/* السنتر التعليمي */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="student-center" style={labelStyle}>
                {isAr ? 'السنتر التعليمي (اختياري)' : 'Educational Center (Optional)'}
              </label>
              <input
                id="student-center"
                type="text"
                name="centerName"
                value={formData.centerName}
                onChange={handleChange}
                maxLength={150}
                placeholder={isAr ? 'مثال: سنتر الرواد — الدقي (أو أونلاين فقط)' : 'e.g. Al-Rowad Center — Dokki (or Online only)'}
                style={inputBaseStyle}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                {isAr
                  ? 'يظهر كبيان افتراضي على بطاقة حضور السنتر الذكية في حال لم تكن مسجلاً في مجموعة حضورية.'
                  : 'Shown as default center on your Smart Attendance Pass when not enrolled in an offline cohort.'}
              </span>
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
