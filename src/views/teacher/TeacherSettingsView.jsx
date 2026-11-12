import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Shield,
  Palette,
  CreditCard,
  GraduationCap,
  Save,
  CheckCircle2,
  Camera,
  Moon,
  Sun,
  Lock,
  Smartphone,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Zap,
  Globe,
  Languages,
  Check,
  UserCheck,
  ShieldCheck,
  FileCheck2,
  Building2,
  Info
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { teacherApi } from '../../services/teacherApi';
import { SPage, SPageHeader, SCard, SSection, SButton } from '../../components/student/ui';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { AvatarCropperModal, AvatarLightboxModal } from '../../components/common/AvatarCropperModal';

export const TeacherSettingsView = () => {
  const { lang, isRtl, setLang } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const { updateUserProfile } = useAuth();
  const isAr = lang === 'ar';

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTabState] = useState(() => tabParam || 'profile');
  const [isDirty, setIsDirty] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isAvatarLightboxOpen, setIsAvatarLightboxOpen] = useState(false);

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTabState(tabParam);
    } else if (!tabParam && activeTab !== 'profile') {
      setActiveTabState('profile');
    }
  }, [tabParam]);

  const setActiveTab = (newTab) => {
    setActiveTabState(newTab);
    if (newTab === 'profile') {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('tab');
      setSearchParams(nextParams, { replace: true });
    } else {
      setSearchParams({ tab: newTab }, { replace: true });
    }
  };

  // Form State initialized with clean defaults
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    titleAr: '',
    subjectAr: '',
    email: '',
    phone: '',
    bioAr: '',
    avatar: '',

    // Stages with selected grades
    stagesTaught: [],

    // Direct Receiving Payout Accounts
    payoutMethods: [],
    defaultPayout: '',

    // New account form
    newAccountType: 'instapay',
    newAccountLabel: '',
    newAccountValue: '',

    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,

    // Notifications
    notifyWhatsappIntervention: true,
    notifyNewEnrollment: true,
    notifyExamSubmission: true,
    autoWatermarkEnabled: true
  });

  const initialLoadedDataRef = useRef(null);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Fetch live settings and payout accounts on mount
  useEffect(() => {
    let mounted = true;
    Promise.all([
      teacherApi.settings.get().catch(() => null),
      teacherApi.payoutAccounts.list().catch(() => null),
    ]).then(([settingsRes, payoutRes]) => {
      if (!mounted) return;
      const s = settingsRes?.data || {};
      const profile = s.profile || {};
      const user = s.user || {};

      const rawPayouts = Array.isArray(payoutRes?.data)
        ? payoutRes.data
        : (Array.isArray(s.payoutMethods) ? s.payoutMethods : []);

      const mappedPayouts = rawPayouts.map((pm) => ({
        id: pm.uuid || pm.id,
        uuid: pm.uuid,
        type: pm.type,
        address: pm.type === 'instapay' ? (pm.account_identifier || pm.address) : undefined,
        phone: pm.type === 'vodafone' ? (pm.account_identifier || pm.phone) : undefined,
        accountNumber: (pm.type === 'cib' || pm.type === 'card' || pm.type === 'bank') ? (pm.account_identifier || pm.accountNumber) : undefined,
        labelAr: pm.label_ar || pm.labelAr || pm.provider_name || 'حساب استلام مالي',
        labelEn: pm.label_en || pm.labelEn || pm.provider_name || 'Receiving Account',
        isDefault: Boolean(pm.is_default ?? pm.isDefault),
        isActive: Boolean(pm.is_active ?? pm.isActive),
      }));

      const resolvedData = {
        nameAr: s.nameAr || s.name_ar || profile.name_ar || profile.nameAr || '',
        nameEn: s.nameEn || s.name_en || profile.name_en || profile.nameEn || '',
        titleAr: s.titleAr || s.title_ar || profile.title_ar || profile.titleAr || '',
        subjectAr: s.subjectAr || s.subject_ar || profile.subject_ar || profile.subjectAr || '',
        email: s.email || user.email || '',
        phone: s.phone || user.phone || profile.whatsapp_phone || '',
        bioAr: s.bioAr || s.bio_ar || profile.bio_ar || profile.bioAr || '',
        avatar: s.avatar || user.avatar || '',
        stagesTaught: Array.isArray(s.stagesTaught)
          ? s.stagesTaught
          : (Array.isArray(s.stages_taught) ? s.stages_taught : (Array.isArray(profile.stages_taught) ? profile.stages_taught : [])),
        payoutMethods: mappedPayouts,
        defaultPayout: s.defaultPayout || mappedPayouts.find((m) => m.isDefault)?.id || mappedPayouts[0]?.id || '',
        newAccountType: 'instapay',
        newAccountLabel: '',
        newAccountValue: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: Boolean(s.twoFactorEnabled ?? s.two_factor_enabled ?? profile.two_factor_enabled ?? false),
        autoWatermarkEnabled: Boolean(s.autoWatermarkEnabled ?? s.auto_watermark_enabled ?? profile.auto_watermark_enabled ?? true),
        notifyWhatsappIntervention: Boolean(s.notifyWhatsappIntervention ?? s.notify_whatsapp_intervention ?? profile.notify_whatsapp_intervention ?? true),
        notifyNewEnrollment: Boolean(s.notifyNewEnrollment ?? s.notify_new_enrollment ?? profile.notify_new_enrollment ?? true),
        notifyExamSubmission: Boolean(s.notifyExamSubmission ?? s.notify_exam_submission ?? profile.notify_exam_submission ?? true),
      };

      initialLoadedDataRef.current = resolvedData;
      setFormData(resolvedData);
    });

    return () => { mounted = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleToggle = (key) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
    setIsDirty(true);
  };

  const handleStageToggle = (grade) => {
    setFormData((prev) => {
      const exists = prev.stagesTaught.includes(grade);
      return {
        ...prev,
        stagesTaught: exists
          ? prev.stagesTaught.filter((g) => g !== grade)
          : [...prev.stagesTaught, grade]
      };
    });
    setIsDirty(true);
  };

  const handleAccountToggleActive = async (id) => {
    const acc = formData.payoutMethods.find((pm) => pm.id === id);
    if (acc?.uuid) {
      try {
        await teacherApi.payoutAccounts.toggleActive(acc.uuid);
      } catch (err) {
        console.error('Failed to toggle payout account:', err);
      }
    }
    setFormData((prev) => ({
      ...prev,
      payoutMethods: prev.payoutMethods.map((pm) =>
        pm.id === id ? { ...pm, isActive: !pm.isActive } : pm
      )
    }));
    setIsDirty(true);
  };

  const handleRemoveAccount = async (id) => {
    const acc = formData.payoutMethods.find((pm) => pm.id === id);
    if (acc?.uuid) {
      try {
        await teacherApi.payoutAccounts.delete(acc.uuid);
      } catch (err) {
        console.error('Failed to delete payout account:', err);
      }
    }
    setFormData((prev) => ({
      ...prev,
      payoutMethods: prev.payoutMethods.filter((pm) => pm.id !== id),
      defaultPayout: prev.defaultPayout === id && prev.payoutMethods.length > 1
        ? prev.payoutMethods.find((p) => p.id !== id)?.id || ''
        : prev.defaultPayout
    }));
    setIsDirty(true);
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    if (!formData.newAccountValue.trim()) return;

    try {
      const res = await teacherApi.payoutAccounts.create({
        type: formData.newAccountType,
        account_identifier: formData.newAccountValue.trim(),
        label_ar: formData.newAccountLabel.trim() || undefined,
        is_default: formData.payoutMethods.length === 0,
      });

      const created = res.data;
      const newAcc = {
        id: created.uuid || created.id || `pm-${Date.now()}`,
        uuid: created.uuid,
        type: created.type,
        labelAr: created.label_ar || formData.newAccountLabel.trim() || (formData.newAccountType === 'instapay' ? 'إنستاباي' : formData.newAccountType === 'vodafone' ? 'فودافون كاش' : 'حساب بنكي / فيزا'),
        labelEn: created.label_en || formData.newAccountLabel.trim() || (formData.newAccountType === 'instapay' ? 'InstaPay' : formData.newAccountType === 'vodafone' ? 'Vodafone Cash' : 'Bank Account / Card'),
        address: created.type === 'instapay' ? created.account_identifier : undefined,
        phone: created.type === 'vodafone' ? created.account_identifier : undefined,
        accountNumber: created.account_identifier,
        isDefault: Boolean(created.is_default),
        isActive: Boolean(created.is_active),
      };

      setFormData((prev) => ({
        ...prev,
        payoutMethods: [...prev.payoutMethods, newAcc],
        newAccountLabel: '',
        newAccountValue: ''
      }));
      setShowAddAccountModal(false);
      setIsDirty(true);
    } catch (err) {
      console.error('Failed to create payout account:', err);
      alert(isAr ? (err.message || 'فشل إضافة الحساب البنكي') : (err.message || 'Failed to add payout account'));
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    try {
      await teacherApi.settings.updateProfile({
        name_ar: formData.nameAr,
        name_en: formData.nameEn,
        title_ar: formData.titleAr,
        subject_ar: formData.subjectAr,
        bio_ar: formData.bioAr,
        email: formData.email,
        phone: formData.phone,
        stages_taught: formData.stagesTaught,
        two_factor_enabled: formData.twoFactorEnabled,
        auto_watermark_enabled: formData.autoWatermarkEnabled,
        notify_whatsapp_intervention: formData.notifyWhatsappIntervention,
        notify_new_enrollment: formData.notifyNewEnrollment,
        notify_exam_submission: formData.notifyExamSubmission,
      });

      setIsDirty(false);
      setSaveSuccess(true);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch {
        // ignore
      }
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to save teacher profile:', err);
      setSaveError(err.message || (isAr ? 'فشل حفظ الإعدادات' : 'Failed to save settings'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (initialLoadedDataRef.current) {
      setFormData(initialLoadedDataRef.current);
    } else {
      setFormData({
        nameAr: '',
        nameEn: '',
        titleAr: '',
        subjectAr: '',
        email: '',
        phone: '',
        bioAr: '',
        avatar: '',
        stagesTaught: [],
        payoutMethods: [],
        defaultPayout: '',
        newAccountType: 'instapay',
        newAccountLabel: '',
        newAccountValue: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false,
        notifyWhatsappIntervention: true,
        notifyNewEnrollment: true,
        notifyExamSubmission: true,
        autoWatermarkEnabled: true
      });
    }
    setIsDirty(false);
  };

  // 4 Stages definition
  const STAGES_CONFIG = [
    {
      id: 'stage-thanawya',
      nameAr: 'مرحلة الثانوية العامة',
      nameEn: 'Thanawya Amma Stage',
      descAr: 'الشهادة الرسمية والمؤهلة للجامعات ونظام البابل شيت الحديث',
      descEn: 'Official high school exit certification & university admission',
      grades: [
        { id: 'g-sec3', nameAr: 'الصف الثالث الثانوي', nameEn: '3rd Secondary (Thanawya Amma)' }
      ]
    },
    {
      id: 'stage-secondary',
      nameAr: 'المرحلة الثانوية',
      nameEn: 'Secondary Stage',
      descAr: 'صفوف النقل وتأسيس المواد العلمية والأدبية',
      descEn: '1st & 2nd secondary transition and foundation curricula',
      grades: [
        { id: 'g-sec2', nameAr: 'الصف الثاني الثانوي', nameEn: '2nd Secondary' },
        { id: 'g-sec1', nameAr: 'الصف الأول الثانوي', nameEn: '1st Secondary' }
      ]
    },
    {
      id: 'stage-prep',
      nameAr: 'المرحلة الإعدادية',
      nameEn: 'Preparatory Stage',
      descAr: 'مناهج العلوم والرياضيات واللغات للإعدادية العامة والشهادة',
      descEn: 'General prep stage curriculum and certificate level',
      grades: [
        { id: 'g-prep3', nameAr: 'الصف الثالث الإعدادي', nameEn: '3rd Preparatory' },
        { id: 'g-prep2', nameAr: 'الصف الثاني الإعدادي', nameEn: '2nd Preparatory' },
        { id: 'g-prep1', nameAr: 'الصف الأول الإعدادي', nameEn: '1st Preparatory' }
      ]
    },
    {
      id: 'stage-primary',
      nameAr: 'المرحلة الابتدائية',
      nameEn: 'Primary Stage',
      descAr: 'التأسيس المبكر ومناهج الصفوف الابتدائية المطورة',
      descEn: 'Early education foundations and primary grades',
      grades: [
        { id: 'g-pri6', nameAr: 'الصف السادس الابتدائي', nameEn: '6th Primary' },
        { id: 'g-pri5', nameAr: 'الصف الخامس الابتدائي', nameEn: '5th Primary' },
        { id: 'g-pri4', nameAr: 'الصف الرابع الابتدائي', nameEn: '4th Primary' }
      ]
    }
  ];

  // 5 Clean Tabs
  const tabs = [
    { id: 'profile', labelAr: 'البيانات الشخصية والتعريف الأكاديمي', labelEn: 'Profile & Info', icon: User },
    { id: 'stages', labelAr: 'المراحل والمناهج الدراسية', labelEn: 'Stages & Curriculum', icon: GraduationCap },
    { id: 'payouts', labelAr: 'الحسابات البنكية واستقبال التحويلات', labelEn: 'Bank & Receiving Accounts', icon: CreditCard },
    { id: 'preferences', labelAr: 'المظهر واللغة والتنبيهات', labelEn: 'Theme, Language & Alerts', icon: Palette },
    { id: 'security', labelAr: 'الأمان وكلمة المرور', labelEn: 'Security & 2FA', icon: Shield }
  ];

  const activeTabMeta = tabs.find(t => t.id === activeTab);
  useSetBreadcrumbs(
    activeTab !== 'profile' && activeTabMeta
      ? [
          {
            labelAr: activeTabMeta.labelAr,
            labelEn: activeTabMeta.labelEn,
            onClick: () => setActiveTab('profile')
          }
        ]
      : []
  );

  return (
    <SPage maxWidth={1120}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          direction: isRtl ? 'rtl' : 'ltr',
          fontFamily: isRtl ? 'var(--font-arabic), "Cairo", system-ui, sans-serif' : 'var(--font-heading), "Outfit", sans-serif'
        }}
      >
        {/* ── Page Header with Action Buttons ── */}
        <SPageHeader
          title={isAr ? 'إعدادات حساب المعلم' : 'Teacher Settings'}
          subtitle={
            isAr
              ? 'تخصيص ملفك الأكاديمي، ضبط المراحل والصفوف، وإدارة حسابات استقبال تحويلات الطلاب المباشرة والمظهر.'
              : 'Customize academic profile, stages taught, direct student payment receiving accounts, and interface appearance.'
          }
          action={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isDirty && (
                <SButton
                  variant="ghost"
                  size="sm"
                  icon={<RotateCcw />}
                  onClick={handleReset}
                >
                  {isAr ? 'إلغاء التعديلات' : 'Discard'}
                </SButton>
              )}
              <SButton
                variant="primary"
                size="sm"
                icon={<Save />}
                onClick={handleSave}
                disabled={!isDirty}
              >
                {isAr ? 'حفظ كافة التعديلات' : 'Save Changes'}
              </SButton>
            </div>
          }
        />

        {/* ── Save Success Toast ── */}
        {saveSuccess && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--success-light)',
              border: '1px solid rgba(22, 163, 74, 0.35)',
              color: 'var(--success)',
              fontSize: '13.5px',
              fontWeight: '700',
              animation: 'fadeIn 0.25s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} />
              <span>
                {isAr
                  ? 'تم حفظ كافة تعديلات ملف المعلم وتحديث الإعدادات بنجاح'
                  : 'All teacher profile changes and settings updated successfully'}
              </span>
            </div>
          </div>
        )}

        {/* ── Unsaved Changes Alert ── */}
        {isDirty && !saveSuccess && (
          <div
            style={{
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
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} />
              <span>
                {isAr
                  ? 'لديك تعديلات غير محفوظة في إعدادات حساب المعلم.'
                  : 'You have unsaved changes in teacher settings.'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <SButton variant="ghost" size="sm" onClick={handleReset}>
                {isAr ? 'تراجع' : 'Discard'}
              </SButton>
              <SButton variant="primary" size="sm" onClick={handleSave}>
                {isAr ? 'حفظ الآن' : 'Save Now'}
              </SButton>
            </div>
          </div>
        )}

        {/* ── Tabs Navigation ── */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            borderBottom: '1px solid var(--border-subtle)',
            overflowX: 'auto',
            paddingBottom: '2px',
            scrollbarWidth: 'none'
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
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
                  fontWeight: isActive ? '800' : '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
                }}
              >
                <Icon size={16} />
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        <div style={{ marginTop: '8px' }}>
          {/* ════════════ 1. PROFILE TAB ════════════ */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
                <SSection
                  title={isAr ? 'البيانات الشخصية والتعريف الأكاديمي' : 'Personal & Academic Identity'}
                  style={{ marginBottom: 0 }}
                >
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                    {isAr
                      ? 'هذه البيانات تظهر لطلابك في صفحة الكورسات والشهادات المعتمدة وكروت المحاضرات.'
                      : 'These details are displayed to students across courses, verified certificates, and live rooms.'}
                  </p>

                  {/* Avatar Upload with Live Preview */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      padding: '16px 20px',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '24px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <img
                        src={formData.avatar}
                        alt={formData.nameAr}
                        onClick={() => setIsAvatarLightboxOpen(true)}
                        title={isAr ? 'اضغط لتكبير الصورة' : 'Click to enlarge'}
                        style={{
                          width: '88px',
                          height: '88px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '3px solid var(--primary)',
                          boxShadow: '0 4px 14px rgba(21, 136, 199, 0.25)',
                          cursor: 'zoom-in',
                          transition: 'transform 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                      <label
                        title={isAr ? 'تغيير الصورة الشخصية' : 'Change profile picture'}
                        style={{
                          position: 'absolute',
                          bottom: '0',
                          insetInlineEnd: '0',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow-sm)',
                          transition: 'transform 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <Camera size={14} />
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            e.target.value = '';
                            if (!file) return;

                            if (file.size > 10 * 1024 * 1024) {
                              alert(isAr ? 'حجم الصورة المختارة كبير جداً (الحد الأقصى 10 ميجابايت قبل القص).' : 'Selected image is too large (max 10 MB before cropping).');
                              return;
                            }

                            const reader = new FileReader();
                            reader.onload = (re) => {
                              setCropImageSrc(re.target.result);
                              setIsCropperOpen(true);
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>

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
                      onConfirm={async (croppedFile, previewUrl) => {
                        setIsUploadingAvatar(true);
                        setFormData((prev) => ({ ...prev, avatar: previewUrl }));
                        setIsDirty(true);

                        try {
                          const uploadRes = await teacherApi.settings.uploadAvatar(croppedFile);
                          const newAvatar = uploadRes?.data?.avatar || uploadRes?.data?.avatarUrl || uploadRes?.data?.avatar_url;
                          if (newAvatar) {
                            setFormData((prev) => ({ ...prev, avatar: newAvatar }));
                            if (updateUserProfile) {
                              updateUserProfile({ avatar: newAvatar }).catch(() => {});
                            }
                          }
                          setIsCropperOpen(false);
                          setCropImageSrc(null);
                        } catch (err) {
                          console.error('Avatar upload failed:', err);
                          alert(err.message || (isAr ? 'فشل رفع الصورة الشخصية إلى السيرفر.' : 'Failed to upload profile picture.'));
                        } finally {
                          setIsUploadingAvatar(false);
                        }
                      }}
                    />

                    <AvatarLightboxModal
                      isOpen={isAvatarLightboxOpen}
                      imageSrc={formData.avatar}
                      altText={formData.nameAr}
                      isAr={isAr}
                      onClose={() => setIsAvatarLightboxOpen(false)}
                    />

                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)' }}>
                          {isAr ? formData.nameAr : (formData.nameEn || formData.nameAr)}
                        </div>
                        <span
                          style={{
                            fontSize: '11.5px',
                            fontWeight: '800',
                            padding: '3px 10px',
                            borderRadius: '99px',
                            backgroundColor: 'var(--success-light)',
                            color: 'var(--success)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <CheckCircle2 size={13} />
                          <span>{isAr ? 'معلم معتمد وموثق على المنصة' : 'Verified Motafawweq Educator'}</span>
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {formData.titleAr}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {isAr ? 'انقر على أيقونة الكاميرا لتحديث الصورة الشخصية المعتمدة' : 'Click the camera icon to upload a verified portrait'}
                      </div>
                    </div>
                  </div>

                  {/* Input Fields Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '18px'
                    }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {isAr ? 'الاسم الكامل باللغة العربية' : 'Full Name (Arabic)'}
                      </label>
                      <input
                        type="text"
                        name="nameAr"
                        value={formData.nameAr}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid var(--border-medium)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {isAr ? 'الاسم باللغة الإنجليزية' : 'Full Name (English)'}
                      </label>
                      <input
                        type="text"
                        name="nameEn"
                        value={formData.nameEn}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid var(--border-medium)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {isAr ? 'المسمى الأكاديمي والصفة التدريسية' : 'Academic Title / Position'}
                      </label>
                      <input
                        type="text"
                        name="titleAr"
                        value={formData.titleAr}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid var(--border-medium)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {isAr ? 'المادة التخصصية' : 'Subject'}
                      </label>
                      <input
                        type="text"
                        name="subjectAr"
                        value={formData.subjectAr}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid var(--border-medium)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {isAr ? 'البريد الإلكتروني المهني' : 'Official Email'}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid var(--border-medium)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {isAr ? 'رقم الهاتف والتواصل عبر WhatsApp' : 'Phone / WhatsApp'}
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid var(--border-medium)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Bio Field */}
                  <div style={{ marginTop: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      {isAr ? 'النبذة التعريفية والخبرات الأكاديمية' : 'Teacher Bio & Experience'}
                    </label>
                    <textarea
                      rows={3}
                      name="bioAr"
                      value={formData.bioAr}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-medium)',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit',
                        lineHeight: 1.5
                      }}
                    />
                  </div>
                </SSection>
              </SCard>
            </div>
          )}

          {/* ════════════ 2. STAGES & CURRICULUM TAB (4 Stages) ════════════ */}
          {activeTab === 'stages' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
                <SSection
                  title={isAr ? 'المراحل والمناهج الدراسية المعتمدة' : 'Stages & Curriculum'}
                  style={{ marginBottom: 0 }}
                >
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                    {isAr
                      ? 'حدد المراحل والصفوف الدراسية التي تقوم بتدريسها لربط بنك أسئلة الوزارة ومحرك الذكاء الاصطناعي بالمناهج الصحيحة (ابتدائي، إعدادي، ثانوي، وثانوية عامة).'
                      : 'Select active stages and grades (Primary, Prep, Secondary, Thanawya Amma) to synchronize AI lecture transcription and question banks.'}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                    {STAGES_CONFIG.map((stage) => {
                      return (
                        <div
                          key={stage.id}
                          style={{
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-subtle)',
                            padding: '18px 20px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                                {isAr ? stage.nameAr : stage.nameEn}
                              </h4>
                              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                {isAr ? stage.descAr : stage.descEn}
                              </div>
                            </div>

                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: '700',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--primary-light)',
                                color: 'var(--primary)'
                              }}
                            >
                              {stage.grades.filter((g) => formData.stagesTaught.includes(g.nameAr)).length} / {stage.grades.length} {isAr ? 'محدد' : 'selected'}
                            </span>
                          </div>

                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                              gap: '10px'
                            }}
                          >
                            {stage.grades.map((grade) => {
                              const isSelected = formData.stagesTaught.includes(grade.nameAr);
                              return (
                                <div
                                  key={grade.id}
                                  onClick={() => handleStageToggle(grade.nameAr)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 14px',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-surface)',
                                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  <span style={{ fontSize: '13px', fontWeight: isSelected ? '800' : '600', color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                                    {isAr ? grade.nameAr : grade.nameEn}
                                  </span>

                                  <div
                                    style={{
                                      width: '20px',
                                      height: '20px',
                                      borderRadius: '50%',
                                      backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                                      border: isSelected ? 'none' : '1.5px solid var(--border-medium)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: '#FFFFFF'
                                    }}
                                  >
                                    {isSelected && <Check size={12} />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SSection>
              </SCard>
            </div>
          )}

          {/* ════════════ 3. PAYOUTS & DIRECT RECEIVING ACCOUNTS TAB ════════════ */}
          {activeTab === 'payouts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
                <SSection
                  title={isAr ? 'الحسابات البنكية واستقبال تحويلات الطلاب المباشرة' : 'Bank & Direct Receiving Accounts'}
                  style={{ marginBottom: 0 }}
                >
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                    {isAr
                      ? 'حدد الحسابات ووسائل الدفع التي يحول إليها الطلاب مباشرة عند شراء الكورسات والمذكرات (إنستاباي، فودافون كاش، الحساب البنكي، أو الفيزا).'
                      : 'Configure accounts where students transfer funds directly when purchasing courses or booklets.'}
                  </p>

                  {/* Direct Payment Flow Notice */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--primary-surface)',
                      border: '1px solid var(--primary-light)',
                      marginBottom: '22px',
                      color: 'var(--primary)',
                      fontSize: '13px',
                      lineHeight: 1.5
                    }}
                  >
                    <Info size={20} style={{ flexShrink: 0 }} />
                    <div>
                      <span style={{ fontWeight: '800' }}>
                        {isAr ? 'نظام التحويل المباشر للمعلم:' : 'Direct Transfer System:'}
                      </span>
                      <span style={{ marginInlineStart: '6px', color: 'var(--text-secondary)' }}>
                        {isAr
                          ? 'التحويلات تتم مباشرة من الطالب إلى حسابك المعتمد أدناه، دون حجز مالي داخل المنصة وبدون أي تأخير أو عمولات سحب.'
                          : 'Student payments transfer directly to your designated receiving accounts with zero platform escrow holding.'}
                      </span>
                    </div>
                  </div>

                  {/* List of Receiving Accounts */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                    {formData.payoutMethods.map((pm) => {
                      const isDefault = formData.defaultPayout === pm.id;
                      return (
                        <div
                          key={pm.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 20px',
                            borderRadius: 'var(--radius-lg)',
                            backgroundColor: pm.isActive ? 'var(--bg-surface)' : 'var(--bg-subtle)',
                            border: `1.5px solid ${isDefault ? 'var(--primary)' : 'var(--border-subtle)'}`,
                            flexWrap: 'wrap',
                            gap: '14px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div
                              style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '12px',
                                backgroundColor: isDefault ? 'var(--primary)' : 'var(--primary-light)',
                                color: isDefault ? '#FFFFFF' : 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <CreditCard size={20} />
                            </div>

                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                                  {isAr ? pm.labelAr : pm.labelEn}
                                </div>
                                {isDefault && (
                                  <span
                                    style={{
                                      fontSize: '10.5px',
                                      fontWeight: '800',
                                      padding: '2px 8px',
                                      borderRadius: '6px',
                                      backgroundColor: 'var(--primary-light)',
                                      color: 'var(--primary)'
                                    }}
                                  >
                                    {isAr ? 'الحساب الافتراضي' : 'Default'}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                                {pm.address || pm.accountNumber || pm.phone}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {/* Make default button */}
                            {!isDefault && (
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({ ...prev, defaultPayout: pm.id }));
                                  setIsDirty(true);
                                }}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid var(--border-medium)',
                                  backgroundColor: 'transparent',
                                  color: 'var(--text-secondary)',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                              >
                                {isAr ? 'تعيين كافتراضي' : 'Set Default'}
                              </button>
                            )}

                            {/* Active switch for student checkout */}
                            <div
                              onClick={() => handleAccountToggleActive(pm.id)}
                              title={isAr ? 'تفعيل الحساب ليظهر للطلاب عند الدفع' : 'Toggle visibility to students'}
                              style={{
                                width: '42px',
                                height: '24px',
                                borderRadius: '99px',
                                backgroundColor: pm.isActive ? 'var(--primary)' : 'var(--border-medium)',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                flexShrink: 0
                              }}
                            >
                              <div
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '50%',
                                  backgroundColor: '#FFFFFF',
                                  position: 'absolute',
                                  top: '3px',
                                  insetInlineStart: pm.isActive ? '21px' : '3px',
                                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                              />
                            </div>

                            {/* Delete account */}
                            {formData.payoutMethods.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveAccount(pm.id)}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  backgroundColor: 'rgba(220, 38, 38, 0.08)',
                                  color: 'var(--danger)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add New Receiving Account Form */}
                  <div
                    style={{
                      padding: '18px 20px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1.5px dashed var(--border-medium)',
                      backgroundColor: 'var(--bg-surface)'
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px' }}>
                      {isAr ? 'إضافة حساب أو وسيلة استلام جديدة' : 'Add New Receiving Channel'}
                    </div>

                    <form onSubmit={handleAddAccount} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '12px'
                        }}
                      >
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            {isAr ? 'نوع الحساب' : 'Account Type'}
                          </label>
                          <select
                            value={formData.newAccountType}
                            onChange={(e) => setFormData((prev) => ({ ...prev, newAccountType: e.target.value }))}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border-medium)',
                              backgroundColor: 'var(--bg-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          >
                            <option value="instapay">{isAr ? 'عنوان إنستاباي الفوري (InstaPay IPA)' : 'InstaPay IPA'}</option>
                            <option value="vodafone">{isAr ? 'محفظة فودافون كاش / محفظة محمول' : 'Vodafone Cash / Mobile Wallet'}</option>
                            <option value="cib">{isAr ? 'حساب بنكي (IBAN / Account Number)' : 'Bank Account / IBAN'}</option>
                            <option value="card">{isAr ? 'رقم بطاقة بنكية / فيزا للاستلام' : 'Visa / Debit Card'}</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            {isAr ? 'اسم الحساب أو المسمى التوضيحي' : 'Account Label'}
                          </label>
                          <input
                            type="text"
                            placeholder={isAr ? 'مثال: محفظة فودافون الشخصية' : 'e.g. My Personal Wallet'}
                            value={formData.newAccountLabel}
                            onChange={(e) => setFormData((prev) => ({ ...prev, newAccountLabel: e.target.value }))}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border-medium)',
                              backgroundColor: 'var(--bg-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            {isAr ? 'رقم الحساب / العنوان / الآيبان' : 'Account Number / IPA / Phone'}
                          </label>
                          <input
                            type="text"
                            placeholder={isAr ? 'مثال: 010xxxxxxxx أو user@instapay' : 'e.g. 010xxxxxxxx or user@instapay'}
                            value={formData.newAccountValue}
                            onChange={(e) => setFormData((prev) => ({ ...prev, newAccountValue: e.target.value }))}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border-medium)',
                              backgroundColor: 'var(--bg-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                              outline: 'none',
                              boxSizing: 'border-box',
                              fontFamily: 'var(--font-mono)'
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                        <SButton
                          type="submit"
                          variant="primary"
                          size="sm"
                          icon={<Plus />}
                          disabled={!formData.newAccountValue.trim()}
                        >
                          {isAr ? 'إضافة وسيلة الاستلام' : 'Add Receiving Account'}
                        </SButton>
                      </div>
                    </form>
                  </div>
                </SSection>
              </SCard>
            </div>
          )}

          {/* ════════════ 4. PREFERENCES TAB (Theme, Language, Alerts - NO EMOJIS) ════════════ */}
          {activeTab === 'preferences' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* ── 1. نمط المظهر والألوان (Theme Mode) ── */}
              <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
                <SSection
                  title={isAr ? 'المظهر ونمط الألوان' : 'Theme & Color Mode'}
                  style={{ marginBottom: 0 }}
                >
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                    {isAr
                      ? 'اختر النمط المفضل لعينيك. الألوان مصممة بعناية لتوفير أعلى درجات التركيز والهدوء أثناء ساعات التحضير والشرح.'
                      : 'Choose your visual preference. Calibrated for calm teaching sessions and maximum contrast.'}
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '14px'
                    }}
                  >
                    {/* Light Mode Card */}
                    <div
                      onClick={() => setTheme('light')}
                      style={{
                        borderRadius: 'var(--radius-lg)',
                        border: theme === 'light' ? '2.5px solid var(--primary)' : '1.5px solid var(--border-medium)',
                        backgroundColor: theme === 'light' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        boxShadow: theme === 'light' ? '0 4px 18px rgba(21, 136, 199, 0.18)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            backgroundColor: '#FFFBEB',
                            color: '#D97706',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Sun size={20} />
                        </div>
                        {theme === 'light' && <CheckCircle2 size={18} color="var(--primary)" />}
                      </div>

                      {/* Mini Preview Light */}
                      <div
                        style={{
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          padding: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <div style={{ width: '22px', height: '6px', borderRadius: '3px', backgroundColor: '#1588C7' }} />
                          <div style={{ width: '42px', height: '6px', borderRadius: '3px', backgroundColor: '#E2E8F0' }} />
                        </div>
                        <div style={{ width: '100%', height: '18px', borderRadius: '4px', backgroundColor: '#F1F5F9' }} />
                      </div>

                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {isAr ? 'الوضع الفاتح النهاري' : 'Light Mode'}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {isAr ? 'ألوان ساطعة ونقية لضوء النهار' : 'Crisp contrast for daytime'}
                        </div>
                      </div>
                    </div>

                    {/* Dark Mode Card */}
                    <div
                      onClick={() => setTheme('dark')}
                      style={{
                        borderRadius: 'var(--radius-lg)',
                        border: theme === 'dark' ? '2.5px solid var(--primary)' : '1.5px solid var(--border-medium)',
                        backgroundColor: theme === 'dark' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        boxShadow: theme === 'dark' ? '0 4px 18px rgba(92, 182, 219, 0.22)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            backgroundColor: '#0E294B',
                            color: '#5CB6DB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Moon size={20} />
                        </div>
                        {theme === 'dark' && <CheckCircle2 size={18} color="var(--primary)" />}
                      </div>

                      {/* Mini Preview Dark */}
                      <div
                        style={{
                          borderRadius: '8px',
                          backgroundColor: '#081D37',
                          border: '1px solid rgba(255,255,255,0.12)',
                          padding: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <div style={{ width: '22px', height: '6px', borderRadius: '3px', backgroundColor: '#5CB6DB' }} />
                          <div style={{ width: '42px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
                        </div>
                        <div style={{ width: '100%', height: '18px', borderRadius: '4px', backgroundColor: '#041427' }} />
                      </div>

                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {isAr ? 'الوضع الليلي الهادئ' : 'Dark Mode'}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {isAr ? 'كحلي عميق هادئ لتقليل إجهاد العين' : 'Deep navy for calm night preparation'}
                        </div>
                      </div>
                    </div>
                  </div>
                </SSection>
              </SCard>

              {/* ── 2. لغة المنصة (Language) - NO EMOJIS ── */}
              <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
                <SSection
                  title={isAr ? 'لغة الواجهة' : 'Interface Language'}
                  style={{ marginBottom: 0 }}
                >
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                    {isAr
                      ? 'اختر اللغة المناسبة لواجهة تدريسك. يتم تطبيق اتجاه النصوص (RTL / LTR) والخطوط تلقائياً.'
                      : 'Choose your preferred teaching interface language. Direction and typography switch automatically.'}
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '14px'
                    }}
                  >
                    {/* Arabic Option */}
                    <div
                      onClick={() => setLang('ar')}
                      style={{
                        borderRadius: 'var(--radius-lg)',
                        border: lang === 'ar' ? '2.5px solid var(--primary)' : '1.5px solid var(--border-medium)',
                        backgroundColor: lang === 'ar' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: lang === 'ar' ? '0 4px 18px rgba(21, 136, 199, 0.16)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Languages size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                            اللغة العربية
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            خط Cairo • متوافق مع المناهج المصرية
                          </div>
                        </div>
                      </div>
                      {lang === 'ar' && <CheckCircle2 size={18} color="var(--primary)" />}
                    </div>

                    {/* English Option */}
                    <div
                      onClick={() => setLang('en')}
                      style={{
                        borderRadius: 'var(--radius-lg)',
                        border: lang === 'en' ? '2.5px solid var(--primary)' : '1.5px solid var(--border-medium)',
                        backgroundColor: lang === 'en' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: lang === 'en' ? '0 4px 18px rgba(21, 136, 199, 0.16)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Globe size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                            English (US)
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            Inter & Outfit typography
                          </div>
                        </div>
                      </div>
                      {lang === 'en' && <CheckCircle2 size={18} color="var(--primary)" />}
                    </div>
                  </div>
                </SSection>
              </SCard>

              {/* ── 3. تنبيهات التدريس وحماية المحتوى (NO EMOJIS) ── */}
              <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
                <SSection
                  title={isAr ? 'إشعارات التدريس وحماية المحتوى' : 'Teaching Alerts & Content Protection'}
                  style={{ marginBottom: 0 }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      {
                        key: 'notifyWhatsappIntervention',
                        titleAr: 'تنبيه WhatsApp فوري عند غياب طالب أو تراجع درجاته',
                        titleEn: 'Instant WhatsApp parent alert on student risk/absence',
                        descAr: 'إرسال تقرير آلي لولي الأمر عند تراجع كويزات البابل شيت أو تخلف الطالب عن محاضرتين',
                        icon: Smartphone
                      },
                      {
                        key: 'notifyNewEnrollment',
                        titleAr: 'إشعار فوري عند اشتراك طالب جديد في الكورس',
                        titleEn: 'Instant notification on new student enrollment',
                        descAr: 'تنبيه بالاسم والمجموعة ورقم ولي الأمر لتأكيد حجز المذكرات',
                        icon: UserCheck
                      },
                      {
                        key: 'autoWatermarkEnabled',
                        titleAr: 'تفعيل العلامة المائية الديناميكية المتحركة على الفيديو',
                        titleEn: 'Dynamic Floating Watermark on Lecture Player',
                        descAr: 'عرض رقم هاتف الطالب وكود اشتراكه بشكل عشوائي متحرك لمنع تصوير الشاشة وتسريب الحصة',
                        icon: ShieldCheck
                      },
                      {
                        key: 'notifyExamSubmission',
                        titleAr: 'إشعار عند اكتمال تصحيح كويزات البابل شيت الآلي',
                        titleEn: 'Notification on Bubble Sheet grading completion',
                        descAr: 'عرض ملخص متوسط الدرجات وأكثر الأسئلة التي تعثر فيها الطلاب فور انتهاء وقت الامتحان',
                        icon: FileCheck2
                      }
                    ].map((item) => {
                      const isEnabled = formData[item.key];
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.key}
                          onClick={() => handleToggle(item.key)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 18px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--bg-subtle)',
                            border: '1px solid var(--border-subtle)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                backgroundColor: isEnabled ? 'var(--primary-light)' : 'var(--bg-surface)',
                                color: isEnabled ? 'var(--primary)' : 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Icon size={18} />
                            </div>
                            <div>
                              <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                                {isAr ? item.titleAr : item.titleEn}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                {item.descAr}
                              </div>
                            </div>
                          </div>

                          {/* Custom Toggle Switch */}
                          <div
                            style={{
                              width: '44px',
                              height: '24px',
                              borderRadius: '99px',
                              backgroundColor: isEnabled ? 'var(--primary)' : 'var(--border-medium)',
                              position: 'relative',
                              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                              flexShrink: 0
                            }}
                          >
                            <div
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                backgroundColor: '#FFFFFF',
                                position: 'absolute',
                                top: '3px',
                                insetInlineStart: isEnabled ? '23px' : '3px',
                                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SSection>
              </SCard>
            </div>
          )}

          {/* ════════════ 5. SECURITY & 2FA TAB ════════════ */}
          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <SCard padding={24} style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
                <SSection
                  title={isAr ? 'الأمان وكلمة المرور وحماية بنك الأسئلة' : 'Password & Security'}
                  style={{ marginBottom: 0 }}
                >
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                    {isAr
                      ? 'حماية حساب المعلم، بنوك امتحانات البابل شيت السرية، وسجلات الدرجات والمحفظة المالية.'
                      : 'Protect educator workspace, confidential exam question banks, and financial payout routes.'}
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '18px',
                      marginBottom: '24px'
                    }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {isAr ? 'كلمة المرور الحالية' : 'Current Password'}
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid var(--border-medium)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {isAr ? 'كلمة المرور الجديدة' : 'New Password'}
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid var(--border-medium)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid var(--border-medium)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* 2FA Toggle Card */}
                  <div
                    style={{
                      padding: '18px 20px',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                      marginBottom: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--success-light)',
                          color: 'var(--success)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {isAr ? 'المصادقة الثنائية (2FA عبر رسائل SMS / WhatsApp)' : 'Two-Factor Authentication (2FA)'}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {isAr
                            ? 'إرسال رمز أمان إضافي عند تسجيل الدخول من جهاز حاسوب أو هاتف جديد'
                            : 'Require security confirmation code when signing in from an unrecognized device.'}
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => handleToggle('twoFactorEnabled')}
                      style={{
                        width: '44px',
                        height: '24px',
                        borderRadius: '99px',
                        backgroundColor: formData.twoFactorEnabled ? 'var(--success)' : 'var(--border-medium)',
                        position: 'relative',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          position: 'absolute',
                          top: '3px',
                          insetInlineStart: formData.twoFactorEnabled ? '23px' : '3px',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Active Sessions Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {isAr ? 'الجلسات والأجهزة النشطة حالياً' : 'Active Logged-in Sessions'}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {isAr
                          ? 'جهازك الحالي (Windows - Google Chrome) • مسجل دخول منذ 4 ساعات'
                          : 'Current Device (Windows - Google Chrome) • Logged in 4 hours ago'}
                      </div>
                    </div>

                    <SButton
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        alert(
                          isAr
                            ? 'تم تسجيل الخروج بنجاح من كافة الأجهزة الأخرى'
                            : 'Logged out of all other sessions'
                        )
                      }
                    >
                      {isAr ? 'تسجيل الخروج من باقي الأجهزة' : 'Logout Other Devices'}
                    </SButton>
                  </div>
                </SSection>
              </SCard>
            </div>
          )}
        </div>
      </div>
    </SPage>
  );
};

export default TeacherSettingsView;
