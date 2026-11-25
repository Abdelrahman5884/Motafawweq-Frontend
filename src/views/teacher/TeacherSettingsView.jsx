import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  User,
  GraduationCap,
  CreditCard,
  Palette,
  Shield,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { teacherApi } from '../../services/teacherApi';
import { SPage, SPageHeader, SButton, SSkeleton } from '../../components/student/ui';
import { TeacherSubscriptionGate } from '../../components/teacher/TeacherSubscriptionGate';
import { hasTeacherFeatureAccess } from '../../constants/teacherPlanFeatures';
import { SecuritySettingsSection } from '../../features/student/settings/SecuritySettingsSection';
import {
  TEACHER_SETTINGS_TABS,
  DEFAULT_STAGES_CATALOG,
  normalizePayoutAccount,
  buildTeacherFormState,
  isTeacherFormDirty,
  TeacherProfileSection,
  TeacherStagesSection,
  TeacherPayoutsSection,
  TeacherPreferencesSection,
} from '../../features/teacher/settings';

export const TeacherSettingsView = () => {
  const { lang, isRtl } = useLanguage();
  const { currentUser, syncUserProfile, teacherPlanTier } = useAuth();
  const isAr = lang === 'ar';
  const canAccessFinancials = hasTeacherFeatureAccess(teacherPlanTier, 'financials');

  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const activeTab = TEACHER_SETTINGS_TABS.includes(rawTab) ? rawTab : 'profile';

  const setActiveTab = useCallback(
    (nextTab) => {
      if (nextTab === 'profile') {
        const next = new URLSearchParams(searchParams);
        next.delete('tab');
        setSearchParams(next, { replace: true });
      } else {
        setSearchParams({ tab: nextTab }, { replace: true });
      }
    },
    [searchParams, setSearchParams]
  );

  const currentUserRef = useRef(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Profile & Stages state (saved via Save Changes button)
  const [formData, setFormData] = useState(() => buildTeacherFormState({}, currentUser));
  const [savedSnapshot, setSavedSnapshot] = useState(() => buildTeacherFormState({}, currentUser));
  const [stagesCatalog, setStagesCatalog] = useState(DEFAULT_STAGES_CATALOG);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  const [isSaving, setIsSaving] = useState(false);
  const [saveBanner, setSaveBanner] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const successTimerRef = useRef(null);

  // Payout accounts state (Plus/Pro — saved immediately per action)
  const [payoutAccounts, setPayoutAccounts] = useState([]);
  const [loadingPayouts, setLoadingPayouts] = useState(false);
  const [payoutsError, setPayoutsError] = useState(null);
  const [payoutsNonce, setPayoutsNonce] = useState(0);

  const dirty = useMemo(
    () => isTeacherFormDirty(formData, savedSnapshot),
    [formData, savedSnapshot]
  );

  const applySettingsResponse = useCallback(
    (data, { syncContext = true } = {}) => {
      if (!data) return;
      const mapped = buildTeacherFormState(data, currentUserRef.current);
      setFormData(mapped);
      setSavedSnapshot(mapped);

      if (Array.isArray(data.stagesCatalog) && data.stagesCatalog.length > 0) {
        setStagesCatalog(data.stagesCatalog);
      }

      if (syncContext && syncUserProfile) {
        syncUserProfile({
          name: mapped.nameAr || mapped.nameEn,
          nameAr: mapped.nameAr,
          nameEn: mapped.nameEn,
          phone: mapped.phone,
          avatar: mapped.avatar,
          subject: mapped.subjectAr,
          email_verified: mapped.emailVerified,
        });
      }
    },
    [syncUserProfile]
  );

  // Fetch teacher settings on mount / retry
  useEffect(() => {
    let active = true;
    teacherApi.settings
      .get()
      .then((res) => {
        if (!active) return;
        if (res?.data) {
          applySettingsResponse(res.data, { syncContext: true });
        }
        setLoadError(null);
      })
      .catch((err) => {
        if (!active) return;
        setLoadError(err?.message || '__LOAD_FAILED__');
      })
      .finally(() => {
        if (active) setLoadingSettings(false);
      });

    return () => {
      active = false;
    };
  }, [applySettingsResponse, reloadNonce]);

  // Fetch payout accounts only when plan allows financials
  useEffect(() => {
    if (!canAccessFinancials) return undefined;

    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        setLoadingPayouts(true);
        setPayoutsError(null);
      }
    });

    teacherApi.payoutAccounts
      .list()
      .then((res) => {
        if (!active) return;
        const list = Array.isArray(res?.data)
          ? res.data.map(normalizePayoutAccount).filter(Boolean)
          : [];
        setPayoutAccounts(list);
        setPayoutsError(null);
      })
      .catch((err) => {
        if (!active) return;
        setPayoutsError(err?.message || (isAr ? 'تعذر تحميل حسابات الاستلام.' : 'Could not load payout accounts.'));
      })
      .finally(() => {
        if (active) setLoadingPayouts(false);
      });

    return () => {
      active = false;
    };
  }, [canAccessFinancials, payoutsNonce, isAr]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
    };
  }, []);

  const handleRetryLoad = useCallback(() => {
    setLoadingSettings(true);
    setLoadError(null);
    setReloadNonce((n) => n + 1);
  }, []);

  const handleRetryPayouts = useCallback(() => {
    setPayoutsNonce((n) => n + 1);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    setSaveBanner(null);
  }, []);

  const handleToggleGrade = useCallback((gradeAr) => {
    setFormData((prev) => {
      const exists = prev.stagesTaught.includes(gradeAr);
      return {
        ...prev,
        stagesTaught: exists
          ? prev.stagesTaught.filter((g) => g !== gradeAr)
          : [...prev.stagesTaught, gradeAr],
      };
    });
    setSaveBanner(null);
  }, []);

  const handleToggleStageGroup = useCallback((gradeNames, selectAll) => {
    setFormData((prev) => {
      const next = new Set(prev.stagesTaught);
      for (const name of gradeNames) {
        if (selectAll) next.add(name);
        else next.delete(name);
      }
      return { ...prev, stagesTaught: Array.from(next) };
    });
    setSaveBanner(null);
  }, []);

  const handleResetChanges = useCallback(() => {
    setFormData(savedSnapshot);
    setFieldErrors({});
    setSaveBanner(null);
  }, [savedSnapshot]);

  const handleSaveChanges = async (e) => {
    if (e) e.preventDefault();
    if (!dirty || isSaving) return;

    const trimmedNameAr = String(formData.nameAr || '').trim();
    if (trimmedNameAr.length < 3) {
      setFieldErrors({
        nameAr: isAr
          ? 'يرجى إدخال الاسم باللغة العربية (3 أحرف على الأقل).'
          : 'Arabic full name must be at least 3 characters.',
      });
      setActiveTab('profile');
      return;
    }

    setIsSaving(true);
    setFieldErrors({});
    setSaveBanner(null);

    try {
      const res = await teacherApi.settings.update({
        name_ar: trimmedNameAr,
        name_en: String(formData.nameEn || '').trim() || null,
        title_ar: String(formData.titleAr || '').trim() || null,
        subject_ar: String(formData.subjectAr || '').trim() || null,
        phone: String(formData.phone || '').trim() || null,
        bio_ar: String(formData.bioAr || '').trim() || null,
        stages_taught: formData.stagesTaught,
      });

      if (res?.data) {
        applySettingsResponse(res.data, { syncContext: true });
      } else {
        setSavedSnapshot(formData);
      }

      setSaveBanner({
        type: 'success',
        text: res?.message || (isAr ? 'تم حفظ التعديلات بنجاح.' : 'All settings saved successfully.'),
      });

      if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
      successTimerRef.current = window.setTimeout(() => {
        setSaveBanner((prev) => (prev?.type === 'success' ? null : prev));
      }, 4000);
    } catch (err) {
      const apiFieldErrors = err?.getFieldErrors ? err.getFieldErrors() : {};
      setFieldErrors(apiFieldErrors);
      setSaveBanner({
        type: 'error',
        text: err?.message || (isAr ? 'تعذر حفظ التعديلات. يرجى مراجعة البيانات.' : 'Could not save changes.'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Immediate Avatar Upload & Delete (never marks profile form dirty)
  const handleUploadAvatar = useCallback(
    async (croppedFile) => {
      const res = await teacherApi.settings.uploadAvatar(croppedFile);
      const nextAvatar = res?.data?.avatar ?? null;
      setFormData((prev) => ({ ...prev, avatar: nextAvatar }));
      setSavedSnapshot((prev) => ({ ...prev, avatar: nextAvatar }));
      if (syncUserProfile) {
        syncUserProfile({ avatar: nextAvatar });
      }
    },
    [syncUserProfile]
  );

  const handleDeleteAvatar = useCallback(async () => {
    await teacherApi.settings.deleteAvatar();
    setFormData((prev) => ({ ...prev, avatar: null }));
    setSavedSnapshot((prev) => ({ ...prev, avatar: null }));
    if (syncUserProfile) {
      syncUserProfile({ avatar: null });
    }
  }, [syncUserProfile]);

  // Immediate Theme / Language persistence
  const handleSyncPreference = useCallback((prefs) => {
    teacherApi.settings.updatePreferences(prefs).catch(() => {
      // Local theme/language already applied
    });
  }, []);

  // Immediate Payout Account CRUD
  const handleAddPayoutAccount = useCallback(async (payload) => {
    const res = await teacherApi.payoutAccounts.create(payload);
    const created = normalizePayoutAccount(res?.data);
    if (!created) return;
    setPayoutAccounts((prev) => {
      const updatedPrev = created.isDefault
        ? prev.map((item) => ({ ...item, isDefault: false }))
        : prev;
      return [...updatedPrev, created];
    });
  }, []);

  const handleTogglePayoutActive = useCallback(async (uuid) => {
    const res = await teacherApi.payoutAccounts.toggleActive(uuid);
    const updated = normalizePayoutAccount(res?.data);
    if (!updated) return;
    setPayoutAccounts((prev) => prev.map((item) => (item.id === uuid ? updated : item)));
  }, []);

  const handleSetDefaultPayout = useCallback(async (uuid) => {
    const res = await teacherApi.payoutAccounts.setDefault(uuid);
    const updated = normalizePayoutAccount(res?.data);
    setPayoutAccounts((prev) =>
      prev.map((item) =>
        item.id === uuid
          ? (updated || { ...item, isDefault: true, isActive: true })
          : { ...item, isDefault: false }
      )
    );
  }, []);

  const handleDeletePayoutAccount = useCallback(async (uuid) => {
    await teacherApi.payoutAccounts.delete(uuid);
    // Refetch to accurately reflect any promoted fallback default
    const listRes = await teacherApi.payoutAccounts.list().catch(() => null);
    if (Array.isArray(listRes?.data)) {
      setPayoutAccounts(listRes.data.map(normalizePayoutAccount).filter(Boolean));
    } else {
      setPayoutAccounts((prev) => prev.filter((item) => item.id !== uuid));
    }
  }, []);

  const tabs = useMemo(
    () => [
      { id: 'profile', labelAr: 'البيانات الشخصية', labelEn: 'Profile & Info', icon: User },
      { id: 'stages', labelAr: 'المراحل والمناهج', labelEn: 'Stages & Curriculum', icon: GraduationCap },
      {
        id: 'payouts',
        labelAr: 'حسابات الاستلام البنكية',
        labelEn: 'Receiving Accounts',
        icon: CreditCard,
        locked: !canAccessFinancials,
      },
      { id: 'preferences', labelAr: 'المظهر واللغة', labelEn: 'Theme & Language', icon: Palette },
      { id: 'security', labelAr: 'الأمان والجلسات', labelEn: 'Security & Sessions', icon: Shield },
    ],
    [canAccessFinancials]
  );

  const activeTabMeta = tabs.find((t) => t.id === activeTab);
  const breadcrumbs = useMemo(
    () =>
      activeTab !== 'profile' && activeTabMeta
        ? [
            {
              labelAr: activeTabMeta.labelAr,
              labelEn: activeTabMeta.labelEn,
              onClick: () => setActiveTab('profile'),
            },
          ]
        : [],
    [activeTab, activeTabMeta, setActiveTab]
  );
  useSetBreadcrumbs(breadcrumbs);

  const showSaveAction = activeTab === 'profile' || activeTab === 'stages' || dirty;

  return (
    <SPage maxWidth={1120}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          direction: isRtl ? 'rtl' : 'ltr',
          fontFamily: isRtl
            ? 'var(--font-arabic), "Cairo", system-ui, sans-serif'
            : 'var(--font-heading), "Outfit", sans-serif',
        }}
      >
        {/* ── Page Header ── */}
        <SPageHeader
          title={isAr ? 'إعدادات حساب المعلم' : 'Teacher Settings'}
          subtitle={
            isAr
              ? 'تحديث بياناتك الأكاديمية، المراحل الدراسية، حسابات الاستلام المباشر، المظهر، وأمان حسابك.'
              : 'Manage your academic profile, curriculum stages, direct receiving accounts, appearance, and security.'
          }
          action={
            showSaveAction ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {dirty && (
                  <SButton
                    variant="ghost"
                    size="sm"
                    icon={<RotateCcw />}
                    onClick={handleResetChanges}
                    disabled={isSaving}
                  >
                    {isAr ? 'تراجع' : 'Discard'}
                  </SButton>
                )}
                <SButton
                  variant="primary"
                  size="sm"
                  icon={<Save />}
                  onClick={handleSaveChanges}
                  disabled={!dirty || isSaving}
                >
                  {isSaving
                    ? (isAr ? 'جاري الحفظ...' : 'Saving...')
                    : (isAr ? 'حفظ التعديلات' : 'Save Changes')}
                </SButton>
              </div>
            ) : null
          }
        />

        {/* ── Save Success / Error Banner ── */}
        {saveBanner && (
          <div
            role="status"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '13px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: saveBanner.type === 'success' ? 'var(--success-light)' : 'var(--error-light)',
              border: `1px solid ${saveBanner.type === 'success' ? 'rgba(22, 163, 74, 0.35)' : 'rgba(220, 38, 38, 0.35)'}`,
              color: saveBanner.type === 'success' ? 'var(--success)' : 'var(--danger, #DC2626)',
              fontSize: '13.5px',
              fontWeight: '700',
            }}
          >
            {saveBanner.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{saveBanner.text}</span>
          </div>
        )}

        {/* ── Unsaved Changes Prompt ── */}
        {dirty && !saveBanner && (
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
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} />
              <span>
                {isAr
                  ? 'لديك تعديلات غير محفوظة في بياناتك أو المراحل الدراسية.'
                  : 'You have unsaved changes in your profile or stages.'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <SButton variant="ghost" size="sm" onClick={handleResetChanges} disabled={isSaving}>
                {isAr ? 'تراجع' : 'Discard'}
              </SButton>
              <SButton variant="primary" size="sm" onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ الآن' : 'Save Now')}
              </SButton>
            </div>
          </div>
        )}

        {/* ── Load Error Banner ── */}
        {loadError && !loadingSettings && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--error-light)',
              color: 'var(--danger, #DC2626)',
              fontSize: '13px',
              fontWeight: '600',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={17} />
              {loadError === '__LOAD_FAILED__'
                ? (isAr ? 'تعذر تحميل إعدادات المعلم من الخادم.' : 'Failed to load teacher settings.')
                : loadError}
            </span>
            <SButton variant="ghost" size="sm" icon={<RefreshCw />} onClick={handleRetryLoad}>
              {isAr ? 'إعادة المحاولة' : 'Retry'}
            </SButton>
          </div>
        )}

        {/* ── Tabs Navigation ── */}
        <div
          role="tablist"
          style={{
            display: 'flex',
            gap: '6px',
            borderBottom: '1px solid var(--border-subtle)',
            overflowX: 'auto',
            paddingBottom: '2px',
            scrollbarWidth: 'none',
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
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
                  fontFamily: 'inherit',
                }}
              >
                <Icon size={16} />
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                {tab.locked && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '2px 6px',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(217, 119, 6, 0.14)',
                      color: '#B45309',
                    }}
                  >
                    <Lock size={10} />
                    {isAr ? 'بلس' : 'Plus'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Active Tab Content ── */}
        <div style={{ marginTop: '4px' }}>
          {loadingSettings && (activeTab === 'profile' || activeTab === 'stages') ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <SSkeleton height={150} radius={16} />
              <SSkeleton height={260} radius={16} />
            </div>
          ) : (
            <>
              {activeTab === 'profile' && (
                <TeacherProfileSection
                  formData={formData}
                  fieldErrors={fieldErrors}
                  teacherPlanTier={teacherPlanTier}
                  handleChange={handleChange}
                  onUploadAvatar={handleUploadAvatar}
                  onDeleteAvatar={handleDeleteAvatar}
                  lang={lang}
                  isRtl={isRtl}
                />
              )}

              {activeTab === 'stages' && (
                <TeacherStagesSection
                  stagesCatalog={stagesCatalog}
                  stagesTaught={formData.stagesTaught}
                  onToggleGrade={handleToggleGrade}
                  onToggleStageGroup={handleToggleStageGroup}
                  lang={lang}
                />
              )}

              {activeTab === 'payouts' && (
                <TeacherSubscriptionGate feature="financials" inline>
                  <TeacherPayoutsSection
                    accounts={payoutAccounts}
                    loading={loadingPayouts}
                    loadError={payoutsError}
                    onRetry={handleRetryPayouts}
                    onAddAccount={handleAddPayoutAccount}
                    onToggleActive={handleTogglePayoutActive}
                    onSetDefault={handleSetDefaultPayout}
                    onDeleteAccount={handleDeletePayoutAccount}
                    lang={lang}
                  />
                </TeacherSubscriptionGate>
              )}

              {activeTab === 'preferences' && (
                <TeacherPreferencesSection
                  onSyncPreference={handleSyncPreference}
                  lang={lang}
                />
              )}

              {activeTab === 'security' && (
                <SecuritySettingsSection lang={lang} role="teacher" />
              )}
            </>
          )}
        </div>
      </div>
    </SPage>
  );
};

export default TeacherSettingsView;
