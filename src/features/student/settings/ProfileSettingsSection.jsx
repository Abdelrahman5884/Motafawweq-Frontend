import React, { useRef } from 'react';
import { Camera, RefreshCw, Sparkles, User, School, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import { SCard, SSection, SBadge, SButton } from '../../../components/student/ui';

// Curated avatars library for Egyptian high-school students
export const PRESET_AVATARS = [
  { id: 'av-1', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80', labelAr: 'طالب متفوق' },
  { id: 'av-2', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', labelAr: 'طالبة متفوقة' },
  { id: 'av-3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', labelAr: 'طالب علمي' },
  { id: 'av-4', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80', labelAr: 'طالبة علمي' },
  { id: 'av-5', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80', labelAr: 'طالب رياضي' },
  { id: 'av-6', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80', labelAr: 'طالبة لغات' },
];

export const GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'القليوبية',
  'الدقهلية',
  'الشرقية',
  'المنوفية',
  'الغربية',
  'البحيرة',
  'دمياط',
  'كفر الشيخ',
  'بورسعيد',
  'الإسماعيلية',
  'السويس',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان'
];

export const ProfileSettingsSection = ({
  formData,
  handleChange,
  handleAvatarChange,
  handleAvatarUpload,
  lang,
  isRtl
}) => {
  const fileInputRef = useRef(null);

  const onFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(lang === 'ar' ? 'حجم الصورة يجب ألا يتجاوز 5 ميجابايت' : 'Image size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        handleAvatarUpload(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── 1. الصورة الشخصية والأفتار ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={lang === 'ar' ? 'الصورة الشخصية والأيقونة الرمزية' : 'Profile Picture & Avatar'}
          style={{ marginBottom: 0 }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            {/* الصورة الرئيسية الكبيرة */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid var(--primary)',
                boxShadow: '0 4px 16px rgba(21, 136, 199, 0.25)',
                backgroundColor: 'var(--bg-subtle)',
                position: 'relative'
              }}>
                <img
                  src={formData.avatar || PRESET_AVATARS[0].url}
                  alt={formData.name || 'Student Avatar'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* زر الكاميرا السريع فوق الصورة */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title={lang === 'ar' ? 'تغيير الصورة' : 'Change picture'}
                aria-label={lang === 'ar' ? 'تغيير الصورة' : 'Change picture'}
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
                  transition: 'transform 0.15s ease'
                }}
              >
                <Camera size={15} />
              </button>
            </div>

            {/* تفاصيل وخيارات الرفع */}
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {formData.nameAr || formData.name || (lang === 'ar' ? 'طالب متفوق' : 'Motafawweq Student')}
                </span>
                <SBadge variant="primary" size="xs">
                  {lang === 'ar' ? 'طالب نشط' : 'Active Student'}
                </SBadge>
              </div>

              <p style={{
                fontSize: '12.5px',
                color: 'var(--text-secondary)',
                margin: '0 0 14px 0',
                lineHeight: 1.5
              }}>
                {lang === 'ar'
                  ? 'الصورة تظهر في لوحة الدوري، شارات التميز، وعند تفاعلك في الحصص المباشرة. يُفضل استخدام صورة مربعة (JPG أو PNG أو WEBP).'
                  : 'Your avatar appears on leaderboards, badges, and live classes. Recommended size: square JPG/PNG/WEBP under 5MB.'}
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
                >
                  {lang === 'ar' ? 'رفع صورة من جهازك' : 'Upload New Picture'}
                </SButton>

                <SButton
                  variant="ghost"
                  size="sm"
                  icon={<RefreshCw />}
                  onClick={() => handleAvatarChange(PRESET_AVATARS[0].url)}
                >
                  {lang === 'ar' ? 'استعادة الافتراضية' : 'Reset to Default'}
                </SButton>
              </div>
            </div>
          </div>

          {/* أفتارات رمزية جاهزة */}
          <div style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '10px'
            }}>
              <Sparkles size={14} color="var(--primary)" />
              <span>{lang === 'ar' ? 'أو اختر شخصية رمزية جاهزة بنقرة واحدة:' : 'Or choose a preset avatar:'}</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {PRESET_AVATARS.map((av) => {
                const isSelected = formData.avatar === av.url;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => handleAvatarChange(av.url)}
                    title={av.labelAr}
                    style={{
                      position: 'relative',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      padding: '2px',
                      border: isSelected ? '2.5px solid var(--primary)' : '1.5px solid var(--border-medium)',
                      backgroundColor: isSelected ? 'var(--primary-surface)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 0 10px rgba(21, 136, 199, 0.35)' : 'none'
                    }}
                  >
                    <img
                      src={av.url}
                      alt={av.labelAr}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    {isSelected && (
                      <span style={{
                        position: 'absolute',
                        bottom: '-2px',
                        [isRtl ? 'left' : 'right']: '-2px',
                        backgroundColor: 'var(--primary)',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1.5px solid var(--bg-surface)'
                      }}>
                        <CheckCircle2 size={10} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </SSection>
      </SCard>

      {/* ── 2. الاسم والبيانات الأساسية ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={lang === 'ar' ? 'الاسم والبيانات التعريفية' : 'Basic Identification'}
          style={{ marginBottom: 0 }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px'
          }}>
            {/* الاسم باللغة العربية */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                {lang === 'ar' ? 'الاسم بالكامل (باللغة العربية) *' : 'Full Name (Arabic) *'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="nameAr"
                  value={formData.nameAr || ''}
                  onChange={handleChange}
                  placeholder={lang === 'ar' ? 'مثال: عمر طارق القاضي' : 'e.g. عمر طارق القاضي'}
                  dir="rtl"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'var(--font-arabic)'
                  }}
                />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                {lang === 'ar' ? 'يُستخدم هذا الاسم في شهادات التقدير الرسمية الصادرة من المنصة.' : 'Used on official certificates.'}
              </span>
            </div>

            {/* الاسم باللغة الإنجليزية */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                {lang === 'ar' ? 'الاسم باللغة الإنجليزية *' : 'Full Name (English) *'}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="e.g. Omar Tarek El-Kady"
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
                {lang === 'ar' ? 'يُستخدم في الواجهة الإنجليزية وملفات التصدير.' : 'Used in English interface and exports.'}
              </span>
            </div>

            {/* اسم الشهرة / اللقب في الدوري */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                {lang === 'ar' ? 'اسم الشهرة أو اللقب في الدوري' : 'Nickname / League Display Name'}
              </label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname || ''}
                onChange={handleChange}
                placeholder={lang === 'ar' ? 'مثال: د. عمر 🩺' : 'e.g. Dr. Omar 🩺'}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'var(--font-arabic)'
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                {lang === 'ar' ? 'اسم مستعار يظهر لزملائك في قائمة المتصدرين إن أردت.' : 'Optional nickname shown on the leaderboard.'}
              </span>
            </div>

            {/* الطموح الجامعي / النبذة */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                {lang === 'ar' ? 'الطموح والكلية المستهدفة' : 'Academic Dream / Target College'}
              </label>
              <input
                type="text"
                name="targetGoal"
                value={formData.targetGoal || ''}
                onChange={handleChange}
                placeholder={lang === 'ar' ? 'مثال: كلية الطب البشري - جامعة القاهرة' : 'e.g. Faculty of Medicine, Cairo University'}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'var(--font-arabic)'
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                {lang === 'ar' ? 'يعرضه الذكاء الاصطناعي لتشجيعك أثناء المذاكرة.' : 'Used by AI to personalize your study encouragement.'}
              </span>
            </div>
          </div>
        </SSection>
      </SCard>

      {/* ── 3. المرحلة الدراسية والشعبة والسنتر ── */}
      <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
        <SSection
          title={lang === 'ar' ? 'المرحلة الدراسية والتخصص الأكاديمي' : 'Academic Stage & Curriculum'}
          style={{ marginBottom: 0 }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px'
          }}>
            {/* المرحلة الدراسية */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                {lang === 'ar' ? 'المرحلة والصف الدراسي *' : 'Educational Stage & Grade *'}
              </label>
              <select
                name="grade"
                value={formData.grade || '3rd Secondary (Thanawya Amma)'}
                onChange={(e) => {
                  const newGrade = e.target.value;
                  handleChange(e);
                  // Smart track adjustment based on selected educational stage
                  if (newGrade.includes('Primary') || newGrade.includes('Preparatory') || newGrade === '1st Secondary') {
                    if (formData.track !== 'عام' && formData.track !== 'لغات' && formData.track !== 'أزهر') {
                      handleChange({ target: { name: 'track', value: 'عام' } });
                    }
                  } else if (newGrade === '2nd Secondary') {
                    if (formData.track !== 'علمي' && formData.track !== 'أدبي' && !formData.track?.includes('لغات')) {
                      handleChange({ target: { name: 'track', value: 'علمي' } });
                    }
                  } else if (newGrade.includes('3rd Secondary')) {
                    if (formData.track !== 'علمي علوم' && formData.track !== 'علمي رياضة' && formData.track !== 'أدبي') {
                      handleChange({ target: { name: 'track', value: 'علمي علوم' } });
                    }
                  }
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-arabic)'
                }}
              >
                {/* 1. المرحلة الابتدائية */}
                <optgroup label={lang === 'ar' ? 'المرحلة الابتدائية (Primary School)' : 'Primary School'}>
                  <option value="1st Primary">{lang === 'ar' ? 'الصف الأول الابتدائي' : '1st Primary'}</option>
                  <option value="2nd Primary">{lang === 'ar' ? 'الصف الثاني الابتدائي' : '2nd Primary'}</option>
                  <option value="3rd Primary">{lang === 'ar' ? 'الصف الثالث الابتدائي' : '3rd Primary'}</option>
                  <option value="4th Primary">{lang === 'ar' ? 'الصف الرابع الابتدائي' : '4th Primary'}</option>
                  <option value="5th Primary">{lang === 'ar' ? 'الصف الخامس الابتدائي' : '5th Primary'}</option>
                  <option value="6th Primary">{lang === 'ar' ? 'الصف السادس الابتدائي' : '6th Primary'}</option>
                </optgroup>

                {/* 2. المرحلة الإعدادية */}
                <optgroup label={lang === 'ar' ? 'المرحلة الإعدادية (Preparatory School)' : 'Preparatory / Middle School'}>
                  <option value="1st Preparatory">{lang === 'ar' ? 'الصف الأول الإعدادي' : '1st Preparatory'}</option>
                  <option value="2nd Preparatory">{lang === 'ar' ? 'الصف الثاني الإعدادي' : '2nd Preparatory'}</option>
                  <option value="3rd Preparatory (Certificate)">{lang === 'ar' ? 'الصف الثالث الإعدادي (الشهادة الإعدادية)' : '3rd Preparatory (Middle School Cert)'}</option>
                </optgroup>

                {/* 3. المرحلة الثانوية */}
                <optgroup label={lang === 'ar' ? 'المرحلة الثانوية (Secondary / High School)' : 'Secondary / High School'}>
                  <option value="1st Secondary">{lang === 'ar' ? 'الصف الأول الثانوي' : '1st Secondary'}</option>
                  <option value="2nd Secondary">{lang === 'ar' ? 'الصف الثاني الثانوي' : '2nd Secondary'}</option>
                  <option value="3rd Secondary (Thanawya Amma)">{lang === 'ar' ? 'الصف الثالث الثانوي (الثانوية العامة)' : '3rd Secondary (Thanawya Amma)'}</option>
                </optgroup>
              </select>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                {lang === 'ar' ? 'يتم تخصيص بنك الأسئلة والمناهج ومصائد الامتحانات والملخصات وفقاً لمرحلتك وصفك.' : 'Curriculum and question banks adjust automatically to your stage.'}
              </span>
            </div>

            {/* الشعبة والتخصص */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                {lang === 'ar' ? 'الشعبة والتخصص *' : 'Track / Stream *'}
              </label>
              <select
                name="track"
                value={formData.track || 'علمي علوم'}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-arabic)'
                }}
              >
                {/* خيارات المرحلة الابتدائية والإعدادية والأول الثانوي */}
                {(formData.grade?.includes('Primary') || formData.grade?.includes('Preparatory') || formData.grade === '1st Secondary') && (
                  <>
                    <option value="عام">{lang === 'ar' ? 'شعبة عامة (المنهج المطور الموحد)' : 'General Unified Curriculum'}</option>
                    <option value="لغات">{lang === 'ar' ? 'مدارس لغات ورسمية تجريبية' : 'Official Experimental / Languages'}</option>
                    <option value="أزهر">{lang === 'ar' ? 'التعليم الأزهري النموذجي' : 'Al-Azhar Curriculum'}</option>
                  </>
                )}

                {/* خيارات الصف الثاني الثانوي */}
                {formData.grade === '2nd Secondary' && (
                  <>
                    <option value="علمي">{lang === 'ar' ? 'الشعبة العلمية (علمي)' : 'Scientific Track'}</option>
                    <option value="أدبي">{lang === 'ar' ? 'الشعبة الأدبية (أدبي)' : 'Humanities / Literary Track'}</option>
                    <option value="علمي لغات">{lang === 'ar' ? 'علمي لغات وتجريبي' : 'Scientific (Languages)'}</option>
                    <option value="أدبي لغات">{lang === 'ar' ? 'أدبي لغات وتجريبي' : 'Literary (Languages)'}</option>
                  </>
                )}

                {/* خيارات الصف الثالث الثانوي (الثانوية العامة) */}
                {(!formData.grade || formData.grade.includes('3rd Secondary')) && (
                  <>
                    <option value="علمي علوم">{lang === 'ar' ? 'علمي علوم (الأحياء والجيولوجيا)' : 'Scientific - Biology'}</option>
                    <option value="علمي رياضة">{lang === 'ar' ? 'علمي رياضة (الرياضيات والفيزياء)' : 'Scientific - Mathematics'}</option>
                    <option value="أدبي">{lang === 'ar' ? 'الشعبة الأدبية (التاريخ والجغرافيا)' : 'Humanities / Literary'}</option>
                    <option value="علمي علوم لغات">{lang === 'ar' ? 'علمي علوم (مدارس لغات)' : 'Biology Track (Languages)'}</option>
                    <option value="علمي رياضة لغات">{lang === 'ar' ? 'علمي رياضة (مدارس لغات)' : 'Math Track (Languages)'}</option>
                  </>
                )}
              </select>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                {lang === 'ar' ? 'تحدد المواد الإجبارية والخرائط المفاهيمية المعروضة في حسابك.' : 'Determines the displayed subjects and concept maps.'}
              </span>
            </div>

            {/* اسم المدرسة */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                {lang === 'ar' ? 'اسم المدرسة' : 'School Name'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="school"
                  value={formData.school || ''}
                  onChange={handleChange}
                  placeholder={lang === 'ar' ? 'مثال: مدرسة السعيدية الثانوية العسكرية' : 'e.g. El-Saidia Secondary School'}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'var(--font-arabic)'
                  }}
                />
              </div>
            </div>

            {/* المحافظة */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                {lang === 'ar' ? 'المحافظة / المدينة' : 'Governorate / City'}
              </label>
              <select
                name="governorate"
                value={formData.governorate || 'الجيزة'}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-arabic)'
                }}
              >
                {GOVERNORATES.map(gov => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>

            {/* السنتر التعليمي أو طريقة الحضور */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                {lang === 'ar' ? 'السنتر التعليمي أو الأكاديمية التابع لها' : 'Educational Center / Academy'}
              </label>
              <input
                type="text"
                name="center"
                value={formData.center || ''}
                onChange={handleChange}
                placeholder={lang === 'ar' ? 'مثال: سنتر الرواد (فرع الدقي) أو أونلاين فقط' : 'e.g. Al-Rowad Academy (Dokki) or Online only'}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'var(--font-arabic)'
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                {lang === 'ar' ? 'يساعد في مزامنة جداول الحصص الحضورية ومسح بطاقات الـ QR في قاعات السنتر.' : 'Helps sync attendance QR codes with your physical center.'}
              </span>
            </div>
          </div>
        </SSection>
      </SCard>
    </div>
  );
};
