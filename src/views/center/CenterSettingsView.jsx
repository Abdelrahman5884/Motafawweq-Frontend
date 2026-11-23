import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Building2,
  Palette,
  Shield,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCenter } from '../../context/CenterContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { centerApi } from '../../services/centerApi';
import { SPage, SPageHeader, SButton, SSkeleton, SCard } from '../../components/student/ui';
import { SecuritySettingsSection } from '../../features/student/settings/SecuritySettingsSection';
import {
  CENTER_SETTINGS_TABS,
  buildCenterFormState,
  isCenterFormDirty,
  CenterProfileSection,
  CenterPreferencesSection,
} from '../../features/center/settings';

export const CenterSettingsView = () => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';
  const navigate = useNavigate();

  const {
    isAuthenticated,
    currentUser,
    activeViewRole,
    switchRole,
    syncUserProfile,
    centerPlanTier,
  } = useAuth();

  const {
    isBackendCenter,
    centerSettings,
    updateCenterSettings,
    loadSettingsData,
  } = useCenter();

  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const activeTab = CENTER_SETTINGS_TABS.includes(rawTab) ? rawTab : 'profile';

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

  const [formData, setFormData] = useState(() =>
    buildCenterFormState(centerSettings, currentUser)
  );
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    buildCenterFormState(centerSettings, currentUser)
  );
  const [loadingSettings, setLoadingSettings] = useState(() => Boolean(isBackendCenter));
  const [loadError, setLoadError] = useState(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  const [isSaving, setIsSaving] = useState(false);
  const [saveBanner, setSaveBanner] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const successTimerRef = useRef(null);

  const dirty = useMemo(
    () => isCenterFormDirty(formData, savedSnapshot),
    [formData, savedSnapshot]
  );

  const applySettingsResponse = useCallback(
    (data, { syncContext = true } = {}) => {
      if (!data) return;
      const mapped = buildCenterFormState(data, currentUserRef.current);
      setFormData(mapped);
      setSavedSnapshot(mapped);

      if (syncContext && syncUserProfile) {
        syncUserProfile({
          name: mapped.managerName || currentUserRef.current?.name,
          nameAr: mapped.managerName || currentUserRef.current?.nameAr,
          centerNameAr: mapped.centerNameAr,
          centerNameEn: mapped.centerNameEn,
          center_name_ar: mapped.centerNameAr,
          center_name_en: mapped.centerNameEn,
          phone: mapped.phone,
          avatar: mapped.avatar,
          email_verified: mapped.emailVerified,
        });
      }
    },
    [syncUserProfile]
  );

  // Fetch authoritative center settings on mount / retry
  useEffect(() => {
    if (!isBackendCenter) return undefined;

    let active = true;
    centerApi.settings
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
  }, [isBackendCenter, applySettingsResponse, reloadNonce]);

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

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
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

    const trimmedCenterNameAr = String(formData.centerNameAr || '').trim();
    if (trimmedCenterNameAr.length < 2) {
      setFieldErrors({
        centerNameAr: isAr
          ? 'يرجى إدخال اسم السنتر باللغة العربية (حرفين على الأقل).'
          : 'Center Arabic name must be at least 2 characters.',
      });
      setActiveTab('profile');
      return;
    }

    const trimmedManagerName = String(formData.managerName || '').trim();
    if (trimmedManagerName && trimmedManagerName.length < 2) {
      setFieldErrors({
        managerName: isAr
          ? 'يرجى إدخال اسم مدير السنتر (حرفين على الأقل).'
          : 'Manager name must be at least 2 characters.',
      });
      setActiveTab('profile');
      return;
    }

    setIsSaving(true);
    setFieldErrors({});
    setSaveBanner(null);

    try {
      const updated = await updateCenterSettings({
        name_ar: trimmedCenterNameAr,
        name_en: String(formData.centerNameEn || '').trim() || trimmedCenterNameAr,
        ...(trimmedManagerName ? { manager_name: trimmedManagerName } : {}),
        phone: String(formData.phone || '').trim() || null,
        working_hours: String(formData.workingHours || '').trim() || null,
        address_ar: String(formData.addressAr || '').trim() || null,
      });

      if (updated) {
        applySettingsResponse(updated, { syncContext: true });
      } else {
        setSavedSnapshot(formData);
      }

      setSaveBanner({
        type: 'success',
        text: isAr ? 'تم حفظ تعديلات السنتر بنجاح.' : 'Center settings saved successfully.',
      });

      if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
      successTimerRef.current = window.setTimeout(() => {
        setSaveBanner((prev) => (prev?.type === 'success' ? null : prev));
      }, 4000);
    } catch (err) {
      const apiFieldErrors = err?.getFieldErrors ? err.getFieldErrors() : (err?.errors || {});
      const flattenedErrors = Object.entries(apiFieldErrors).reduce((acc, [k, v]) => {
        acc[k] = Array.isArray(v) ? v[0] : v;
        return acc;
      }, {});
      setFieldErrors(flattenedErrors);
      setSaveBanner({
        type: 'error',
        text: err?.message || (isAr ? 'تعذر حفظ التعديلات. يرجى مراجعة البيانات.' : 'Could not save changes.'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Immediate Avatar/Logo Upload & Delete (never marks profile form dirty)
  const handleUploadAvatar = useCallback(
    async (croppedFile) => {
      const res = await centerApi.settings.uploadAvatar(croppedFile);
      const nextAvatar = res?.data?.avatar ?? res?.data?.logoUrl ?? null;
      setFormData((prev) => ({ ...prev, avatar: nextAvatar }));
      setSavedSnapshot((prev) => ({ ...prev, avatar: nextAvatar }));
      if (syncUserProfile) {
        syncUserProfile({ avatar: nextAvatar });
      }
      if (loadSettingsData) {
        loadSettingsData().catch(() => null);
      }
    },
    [syncUserProfile, loadSettingsData]
  );

  const handleDeleteAvatar = useCallback(async () => {
    await centerApi.settings.deleteAvatar();
    setFormData((prev) => ({ ...prev, avatar: null }));
    setSavedSnapshot((prev) => ({ ...prev, avatar: null }));
    if (syncUserProfile) {
      syncUserProfile({ avatar: null });
    }
    if (loadSettingsData) {
      loadSettingsData().catch(() => null);
    }
  }, [syncUserProfile, loadSettingsData]);

  // Immediate Theme / Language persistence
  const handleSyncPreference = useCallback(
    (prefs) => {
      updateCenterSettings(prefs).catch(() => {
        // Local theme/language already applied
      });
    },
    [updateCenterSettings]
  );

  const tabs = useMemo(
    () => [
      { id: 'profile', labelAr: 'بيانات السنتر والحساب', labelEn: 'Center & Account', icon: Building2 },
      { id: 'preferences', labelAr: 'المظهر واللغة', labelEn: 'Theme & Language', icon: Palette },
      { id: 'security', labelAr: 'الأمان والجلسات', labelEn: 'Security & Sessions', icon: Shield },
    ],
    []
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

  if (!isAuthenticated) {
    return (
      <SPage maxWidth={560}>
        <SCard padding={32} style={{ textAlign: 'center', marginTop: '32px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-surface)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <Lock size={24} />
          </div>
          <h2 style={{ fontSize: '19px', fontWeight: '800', margin: '0 0 8px', color: 'var(--text-primary)' }}>
            {isAr ? 'تسجيل الدخول مطلوب' : 'Sign In Required'}
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: 1.6 }}>
            {isAr
              ? 'يرجى تسجيل الدخول بحساب السنتر للوصول إلى إعدادات الحساب.'
              : 'Please sign in with an authorized Center account to manage settings.'}
          </p>
          <SButton variant="primary" size="sm" onClick={() => navigate('/login')}>
            {isAr ? 'تسجيل الدخول الآن' : 'Sign In Now'}
          </SButton>
        </SCard>
      </SPage>
    );
  }

  if (!isBackendCenter) {
    const canSwitchToCenter =
      Array.isArray(currentUser?.roles) && currentUser.roles.includes('center');

    return (
      <SPage maxWidth={560}>
        <SCard padding={32} style={{ textAlign: 'center', marginTop: '32px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <ShieldAlert size={24} />
          </div>
          <h2 style={{ fontSize: '19px', fontWeight: '800', margin: '0 0 8px', color: 'var(--text-primary)' }}>
            {isAr ? 'هذه الصفحة مخصصة لحسابات السنتر فقط' : 'Center Account Required'}
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: 1.6 }}>
            {isAr
              ? `أنت مسجل الدخول حالياً بدور (${activeViewRole || currentUser?.role}).`
              : `You are currently signed in with role (${activeViewRole || currentUser?.role}).`}
          </p>
          {canSwitchToCenter && (
            <SButton variant="primary" size="sm" onClick={() => switchRole('center')}>
              {isAr ? 'التبديل إلى بوابة السنتر' : 'Switch to Center Portal'}
            </SButton>
          )}
        </SCard>
      </SPage>
    );
  }

  const showSaveAction = activeTab === 'profile' || dirty;

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
          title={isAr ? 'إعدادات حساب السنتر' : 'Center Settings'}
          subtitle={
            isAr
              ? 'تحديث بيانات السنتر والمدير، الشعار، المظهر واللغة، وأمان الحساب وحذفه.'
              : 'Manage your center profile, logo, appearance, security sessions, and account deletion.'
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
                    ? isAr
                      ? 'جاري الحفظ...'
                      : 'Saving...'
                    : isAr
                      ? 'حفظ التعديلات'
                      : 'Save Changes'}
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
                  ? 'لديك تعديلات غير محفوظة في بيانات السنتر.'
                  : 'You have unsaved changes in your center profile.'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <SButton variant="ghost" size="sm" onClick={handleResetChanges} disabled={isSaving}>
                {isAr ? 'تراجع' : 'Discard'}
              </SButton>
              <SButton variant="primary" size="sm" onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : isAr ? 'حفظ الآن' : 'Save Now'}
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
                ? isAr
                  ? 'تعذر تحميل إعدادات السنتر من الخادم.'
                  : 'Failed to load center settings.'
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
              </button>
            );
          })}
        </div>

        {/* ── Active Tab Content ── */}
        <div style={{ marginTop: '4px' }}>
          {loadingSettings && activeTab === 'profile' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <SSkeleton height={150} radius={16} />
              <SSkeleton height={260} radius={16} />
            </div>
          ) : (
            <>
              {activeTab === 'profile' && (
                <CenterProfileSection
                  formData={formData}
                  fieldErrors={fieldErrors}
                  centerPlanTier={centerPlanTier}
                  handleChange={handleChange}
                  onUploadAvatar={handleUploadAvatar}
                  onDeleteAvatar={handleDeleteAvatar}
                  lang={lang}
                  isRtl={isRtl}
                />
              )}

              {activeTab === 'preferences' && (
                <CenterPreferencesSection
                  onSyncPreference={handleSyncPreference}
                  lang={lang}
                />
              )}

              {activeTab === 'security' && (
                <SecuritySettingsSection lang={lang} role="center" />
              )}
            </>
          )}
        </div>
      </div>
    </SPage>
  );
};

export default CenterSettingsView;
