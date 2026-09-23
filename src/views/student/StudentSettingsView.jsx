import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Shield,
  Palette,
  Target,
  Bell,
  RotateCcw,
  Sparkles,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SPage, SPageHeader, SButton } from '../../components/student/ui';
import {
  ProfileSettingsSection,
  SecuritySettingsSection,
  PreferencesSettingsSection,
  StudyGoalsSection,
  NotificationsPrivacySection
} from '../../features/student/settings';

export const StudentSettingsView = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { lang, isRtl } = useLanguage();

  // Active Tab: 'profile' | 'security' | 'preferences' | 'goals' | 'notifications'
  const [activeTab, setActiveTab] = useState('profile');

  // Form State initialized from currentUser
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Omar Tarek El-Kady',
    nameAr: currentUser?.nameAr || 'عمر طارق القاضي',
    nickname: currentUser?.nickname || 'د. عمر 🩺',
    targetGoal: currentUser?.targetGoal || 'كلية الطب البشري - جامعة القاهرة',
    grade: currentUser?.grade || '3rd Secondary (Thanawya Amma)',
    track: currentUser?.track || 'علمي علوم',
    school: currentUser?.school || 'مدرسة السعيدية الثانوية العسكرية، الجيزة',
    center: currentUser?.center || 'سنتر الرواد (فرع الدقي) وأونلاين',
    governorate: currentUser?.governorate || 'الجيزة',
    avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    email: currentUser?.email || 'omar.tarek@motafawweq.me',
    phone: currentUser?.phone || '01123456789',
    parentPhone: currentUser?.parentPhone || '01223344556',
    playbackSpeed: currentUser?.playbackSpeed || '1.25x',
    autoCornell: currentUser?.autoCornell !== false,
    soundEffects: currentUser?.soundEffects !== false,
    dailyGoalMinutes: currentUser?.dailyGoalMinutes || 60,
    pomodoroReminder: currentUser?.pomodoroReminder !== false,
    weeklyLessonsTarget: currentUser?.weeklyLessonsTarget || 8,
    preferredStudyTime: currentUser?.preferredStudyTime || 'evening',
    notifyWhatsapp: currentUser?.notifyWhatsapp !== false,
    notifyStreak: currentUser?.notifyStreak !== false,
    notifyHomework: currentUser?.notifyHomework !== false,
    leaderboardVisible: currentUser?.leaderboardVisible !== false,
    parentReportSync: currentUser?.parentReportSync !== false
  });

  // Track if changes were made
  const [isDirty, setIsDirty] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security separate password state
  const [securityState, setSecurityState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Handle generic input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  // Handle select / buttons change
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  // Handle preference toggle
  const handlePreferenceToggle = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  // Handle avatar select from presets
  const handleAvatarChange = (avatarUrl) => {
    setFormData((prev) => ({ ...prev, avatar: avatarUrl }));
    setIsDirty(true);
  };

  // Handle avatar upload data URL
  const handleAvatarUpload = (dataUrl) => {
    setFormData((prev) => ({ ...prev, avatar: dataUrl }));
    setIsDirty(true);
  };

  // Security state handler
  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityState((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes handler
  const handleSaveChanges = (e) => {
    if (e) e.preventDefault();

    if (updateUserProfile) {
      updateUserProfile(formData);
    }

    setIsDirty(false);
    setSaveSuccess(true);

    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.8 }
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setSaveSuccess(false);
    }, 3500);
  };

  // Reset changes
  const handleResetChanges = () => {
    if (currentUser) {
      setFormData({
        name: currentUser?.name || 'Omar Tarek El-Kady',
        nameAr: currentUser?.nameAr || 'عمر طارق القاضي',
        nickname: currentUser?.nickname || 'د. عمر 🩺',
        targetGoal: currentUser?.targetGoal || 'كلية الطب البشري - جامعة القاهرة',
        grade: currentUser?.grade || '3rd Secondary (Thanawya Amma)',
        track: currentUser?.track || 'علمي علوم',
        school: currentUser?.school || 'مدرسة السعيدية الثانوية العسكرية، الجيزة',
        center: currentUser?.center || 'سنتر الرواد (فرع الدقي) وأونلاين',
        governorate: currentUser?.governorate || 'الجيزة',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
        email: currentUser?.email || 'omar.tarek@motafawweq.me',
        phone: currentUser?.phone || '01123456789',
        parentPhone: currentUser?.parentPhone || '01223344556',
        playbackSpeed: currentUser?.playbackSpeed || '1.25x',
        autoCornell: currentUser?.autoCornell !== false,
        soundEffects: currentUser?.soundEffects !== false,
        dailyGoalMinutes: currentUser?.dailyGoalMinutes || 60,
        pomodoroReminder: currentUser?.pomodoroReminder !== false,
        weeklyLessonsTarget: currentUser?.weeklyLessonsTarget || 8,
        preferredStudyTime: currentUser?.preferredStudyTime || 'evening',
        notifyWhatsapp: currentUser?.notifyWhatsapp !== false,
        notifyStreak: currentUser?.notifyStreak !== false,
        notifyHomework: currentUser?.notifyHomework !== false,
        leaderboardVisible: currentUser?.leaderboardVisible !== false,
        parentReportSync: currentUser?.parentReportSync !== false
      });
    }
    setIsDirty(false);
  };

  // Handle password change submit
  const handlePasswordSave = () => {
    alert(lang === 'ar' ? 'تم تحديث كلمة المرور بنجاح 🔒' : 'Password updated successfully 🔒');
    setSecurityState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // Terminate other sessions
  const handleTerminateOtherSessions = () => {
    alert(lang === 'ar' ? 'تم تسجيل الخروج بنجاح من جميع الأجهزة الأخرى.' : 'All other devices logged out.');
  };

  // Export student data
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `motafawweq_student_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Tab definitions
  const tabs = [
    { id: 'profile', label: lang === 'ar' ? 'الملف الشخصي والبيانات' : 'Profile & Info', icon: <User size={15} /> },
    { id: 'security', label: lang === 'ar' ? 'الأمان وكلمة المرور' : 'Security & Password', icon: <Shield size={15} /> },
    { id: 'preferences', label: lang === 'ar' ? 'المظهر واللغة' : 'Theme & Language', icon: <Palette size={15} /> },
    { id: 'goals', label: lang === 'ar' ? 'أهداف المذاكرة' : 'Study Goals', icon: <Target size={15} /> },
    { id: 'notifications', label: lang === 'ar' ? 'الإشعارات والخصوصية' : 'Alerts & Privacy', icon: <Bell size={15} /> },
  ];

  return (
    <SPage maxWidth={1080}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* ── عنوان الصفحة وزر الحفظ ── */}
        <SPageHeader
          title={lang === 'ar' ? 'إعدادات الحساب والملف الشخصي' : 'Account & Student Settings'}
          subtitle={
            lang === 'ar'
              ? 'خصص ملفك الدراسي، تحكم بأمان حسابك، واضبط بيئة المذاكرة والمظهر حسب رغبتك.'
              : 'Customize your academic profile, manage security, and adjust your study preferences.'
          }
          action={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isDirty && (
                <SButton
                  variant="ghost"
                  size="sm"
                  icon={<RotateCcw />}
                  onClick={handleResetChanges}
                >
                  {lang === 'ar' ? 'إلغاء التعديلات' : 'Cancel'}
                </SButton>
              )}
              <SButton
                variant="primary"
                size="sm"
                icon={<Save />}
                onClick={handleSaveChanges}
                disabled={!isDirty}
              >
                {lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
              </SButton>
            </div>
          }
        />

        {/* ── شريط نجاح الحفظ الناعم (Toast / Alert) ── */}
        {saveSuccess && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--success-light)',
            border: '1px solid rgba(22, 163, 74, 0.3)',
            color: 'var(--success)',
            fontSize: '13.5px',
            fontWeight: '600',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} />
              <span>{lang === 'ar' ? 'تم حفظ كافة التعديلات وتحديث ملفك الشخصي بنجاح 🎉' : 'All changes saved successfully 🎉'}</span>
            </div>
          </div>
        )}

        {/* ── شريط التنبيه عند وجود تعديلات غير محفوظة ── */}
        {isDirty && !saveSuccess && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-surface)',
            border: '1px solid var(--primary-light)',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--primary)',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} />
              <span>{lang === 'ar' ? 'لديك تعديلات غير محفوظة، لا تنسَ النقر على حفظ.' : 'You have unsaved changes.'}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <SButton
                variant="ghost"
                size="sm"
                onClick={handleResetChanges}
              >
                {lang === 'ar' ? 'تراجع' : 'Discard'}
              </SButton>
              <SButton
                variant="primary"
                size="sm"
                onClick={handleSaveChanges}
              >
                {lang === 'ar' ? 'حفظ الآن' : 'Save Now'}
              </SButton>
            </div>
          </div>
        )}

        {/* ── التبويبات العلوية ── */}
        <div style={{
          display: 'flex',
          gap: '6px',
          borderBottom: '1px solid var(--border-subtle)',
          overflowX: 'auto',
          paddingBottom: '2px',
          scrollbarWidth: 'none'
        }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                  borderBottom: isActive ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '13.5px',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  fontFamily: 'var(--font-arabic)'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── المحتوى حسب التبويب النشط ── */}
        <div style={{ marginTop: '8px' }}>
          {activeTab === 'profile' && (
            <ProfileSettingsSection
              formData={formData}
              handleChange={handleChange}
              handleAvatarChange={handleAvatarChange}
              handleAvatarUpload={handleAvatarUpload}
              lang={lang}
              isRtl={isRtl}
            />
          )}

          {activeTab === 'security' && (
            <SecuritySettingsSection
              formData={formData}
              handleChange={handleChange}
              securityState={securityState}
              handleSecurityChange={handleSecurityChange}
              handlePasswordSave={handlePasswordSave}
              handleTerminateOtherSessions={handleTerminateOtherSessions}
              lang={lang}
              isRtl={isRtl}
            />
          )}

          {activeTab === 'preferences' && (
            <PreferencesSettingsSection
              formData={formData}
              handlePreferenceToggle={handlePreferenceToggle}
              handleSelectChange={handleSelectChange}
              lang={lang}
              isRtl={isRtl}
            />
          )}

          {activeTab === 'goals' && (
            <StudyGoalsSection
              formData={formData}
              handleSelectChange={handleSelectChange}
              handlePreferenceToggle={handlePreferenceToggle}
              lang={lang}
              isRtl={isRtl}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsPrivacySection
              formData={formData}
              handlePreferenceToggle={handlePreferenceToggle}
              handleExportData={handleExportData}
              lang={lang}
              isRtl={isRtl}
            />
          )}
        </div>
      </div>
    </SPage>
  );
};

export default StudentSettingsView;
