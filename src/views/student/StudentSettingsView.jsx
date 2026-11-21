import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  User,
  Target,
  Palette,
  Shield,
  RotateCcw,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { studentApi } from '../../services/studentApi';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useStudentActivity } from '../../context/StudentActivityContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { SPage, SPageHeader, SButton, SSkeleton } from '../../components/student/ui';
import {
  ProfileSettingsSection,
  StudyGoalsPrivacySection,
  PreferencesSettingsSection,
  SecuritySettingsSection,
  buildFormStateFromProfile,
  getTracksForGrade,
  getStageForGrade,
  isFormDirty,
  PLAYBACK_SPEED_STORAGE_KEY,
} from '../../features/student/settings';

const VALID_TABS = ['profile', 'study', 'preferences', 'security'];

export const StudentSettingsView = () => {
  const { currentUser, syncUserProfile } = useAuth();
  const { lang, isRtl } = useLanguage();
  const { updateDailyGoalMinutes } = useStudentActivity();
  const isAr = lang === 'ar';

  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const activeTab = VALID_TABS.includes(rawTab) ? rawTab : 'profile';

  const setActiveTab = useCallback(
    (tabId) => {
      if (tabId === 'profile') {
        const next = new URLSearchParams(searchParams);
        next.delete('tab');
        setSearchParams(next, { replace: true });
      } else {
        setSearchParams({ tab: tabId }, { replace: true });
      }
    },
    [searchParams, setSearchParams]
  );

  const currentUserRef = useRef(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const [formData, setFormData] = useState(() => buildFormStateFromProfile({}, currentUser));
  const [savedSnapshot, setSavedSnapshot] = useState(() => buildFormStateFromProfile({}, currentUser));
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  const [isSaving, setIsSaving] = useState(false);
  const [saveBanner, setSaveBanner] = useState(null); // { type: 'success' | 'error', text: string }
  const [fieldErrors, setFieldErrors] = useState({});
  const successTimerRef = useRef(null);

  const dirty = useMemo(() => isFormDirty(formData, savedSnapshot), [formData, savedSnapshot]);

  const applyProfileResponse = useCallback(
    (profileData, { syncContext = true } = {}) => {
      if (!profileData) return;
      const mapped = buildFormStateFromProfile(profileData, currentUserRef.current);
      setFormData(mapped);
      setSavedSnapshot(mapped);

      try {
        localStorage.setItem(PLAYBACK_SPEED_STORAGE_KEY, mapped.playbackSpeed);
      } catch {
        // ignore storage errors
      }

      if (updateDailyGoalMinutes) {
        updateDailyGoalMinutes(mapped.dailyStudyGoalMinutes);
      }

      if (syncContext && syncUserProfile) {
        syncUserProfile({
          name: mapped.name,
          nameAr: mapped.name,
          phone: mapped.phone,
          avatar: mapped.avatar,
          grade: mapped.gradeAr,
          track: mapped.trackAr,
          school: mapped.schoolName,
          center: mapped.centerName,
          governorate: mapped.governorate,
          parentPhone: mapped.parentPhone,
          studentCode: mapped.studentCode,
          student_code: mapped.studentCode,
          email_verified: mapped.emailVerified,
        });
      }
    },
    [syncUserProfile, updateDailyGoalMinutes]
  );

  useEffect(() => {
    let active = true;
    studentApi.profile
      .get()
      .then((res) => {
        if (!active) return;
        if (res?.data) {
          applyProfileResponse(res.data, { syncContext: true });
        }
        setLoadError(null);
      })
      .catch((err) => {
        if (!active) return;
        setLoadError(err?.message || '__LOAD_FAILED__');
      })
      .finally(() => {
        if (active) setLoadingProfile(false);
      });

    return () => {
      active = false;
    };
  }, [applyProfileResponse, reloadNonce]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) window.clearTimeout(successTimerRef.current);
    };
  }, []);

  const handleRetryLoad = useCallback(() => {
    setLoadingProfile(true);
    setLoadError(null);
    setReloadNonce((n) => n + 1);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    setSaveBanner(null);
  }, []);

  const handleSelectChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveBanner(null);
  }, []);

  // Atomically update gradeAr and keep trackAr valid for the newly selected grade
  const handleGradeChange = useCallback((nextGradeAr) => {
    setFormData((prev) => {
      const allowedTracks = getTracksForGrade(nextGradeAr);
      const nextTrack = allowedTracks.some((t) => t.value === prev.trackAr)
        ? prev.trackAr
        : allowedTracks[0].value;
      return { ...prev, gradeAr: nextGradeAr, trackAr: nextTrack };
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

    const trimmedName = String(formData.name || '').trim();
    if (trimmedName.length < 2) {
      setFieldErrors({
        name: isAr ? 'يرجى إدخال اسم لا يقل عن حرفين.' : 'Please enter a name of at least 2 characters.',
      });
      setActiveTab('profile');
      return;
    }

    setIsSaving(true);
    setFieldErrors({});
    setSaveBanner(null);

    try {
      const res = await studentApi.profile.update({
        name: trimmedName,
        phone: String(formData.phone || '').trim() || null,
        parent_phone: String(formData.parentPhone || '').trim() || null,
        stage: getStageForGrade(formData.gradeAr),
        grade_ar: formData.gradeAr,
        track_ar: formData.trackAr,
        governorate: String(formData.governorate || '').trim() || null,
        school_name: String(formData.schoolName || '').trim() || null,
        center_name: String(formData.centerName || '').trim() || null,
        daily_study_goal_minutes: Number(formData.dailyStudyGoalMinutes) || 120,
        weekly_exams_goal: Number(formData.weeklyExamsGoal) || 3,
        target_score_percent: Number(formData.targetScorePercent) || 90,
        show_on_leaderboard: Boolean(formData.showOnLeaderboard),
        display_name_mode: formData.displayNameMode || 'full',
        nickname: String(formData.nickname || '').trim() || null,
        preferences: {
          playbackSpeed: formData.playbackSpeed || '1.0x',
        },
      });

      if (res?.data) {
        applyProfileResponse(res.data, { syncContext: true });
      } else {
        setSavedSnapshot(formData);
      }

      setSaveBanner({
        type: 'success',
        text: res?.message || (isAr ? 'تم حفظ التعديلات وتحديث ملفك الشخصي بنجاح.' : 'All changes saved successfully.'),
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
        text: err?.message || (isAr ? 'تعذر حفظ التعديلات. يرجى مراجعة البيانات.' : 'Could not save changes. Please review your input.'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Immediate Avatar Upload -> syncs form, snapshot, and AuthContext without marking form dirty
  const handleUploadAvatar = useCallback(
    async (croppedFile) => {
      const res = await studentApi.profile.uploadAvatar(croppedFile);
      const nextAvatar = res?.data?.avatar || null;
      setFormData((prev) => ({ ...prev, avatar: nextAvatar }));
      setSavedSnapshot((prev) => ({ ...prev, avatar: nextAvatar }));
      if (syncUserProfile) {
        syncUserProfile({ avatar: nextAvatar });
      }
    },
    [syncUserProfile]
  );

  // Immediate Avatar Removal -> deletes from backend and reverts to 2-letter WhatsApp-style initials
  const handleDeleteAvatar = useCallback(async () => {
    await studentApi.profile.deleteAvatar();
    setFormData((prev) => ({ ...prev, avatar: null }));
    setSavedSnapshot((prev) => ({ ...prev, avatar: null }));
    if (syncUserProfile) {
      syncUserProfile({ avatar: null });
    }
  }, [syncUserProfile]);

  // Background sync for instant Theme / Language preferences without dirtying the form
  const handleSyncInstantPreference = useCallback((partialPrefs) => {
    studentApi.profile.update({ preferences: partialPrefs }).catch(() => {});
  }, []);

  const tabs = useMemo(
    () => [
      { id: 'profile', label: isAr ? 'الملف الشخصي والبيانات' : 'Profile & Info', icon: <User size={15} /> },
      { id: 'study', label: isAr ? 'أهداف المذاكرة والخصوصية' : 'Study Goals & Privacy', icon: <Target size={15} /> },
      { id: 'preferences', label: isAr ? 'المظهر واللغة والمشغل' : 'Theme, Language & Player', icon: <Palette size={15} /> },
      { id: 'security', label: isAr ? 'الأمان وكلمة المرور' : 'Security & Sessions', icon: <Shield size={15} /> },
    ],
    [isAr]
  );

  const currentTab = tabs.find((t) => t.id === activeTab);
  const breadcrumbs = useMemo(
    () =>
      activeTab !== 'profile' && currentTab
        ? [{ label: currentTab.label, onClick: () => setActiveTab('profile') }]
        : [],
    [activeTab, currentTab, setActiveTab]
  );
  useSetBreadcrumbs(breadcrumbs);

  return (
    <SPage maxWidth={1040}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* ── عنوان الصفحة وأزرار الحفظ ── */}
        <SPageHeader
          title={isAr ? 'إعدادات الحساب والملف الشخصي' : 'Account & Student Settings'}
          subtitle={
            isAr
              ? 'إدارة بياناتك الدراسية، أهدافك، خصوصية الدوري، المظهر، وأمان حسابك.'
              : 'Manage your academic profile, study goals, leaderboard privacy, appearance, and security.'
          }
          action={
            activeTab !== 'security' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {dirty && (
                  <SButton
                    variant="ghost"
                    size="sm"
                    icon={<RotateCcw />}
                    onClick={handleResetChanges}
                    disabled={isSaving}
                  >
                    {isAr ? 'إلغاء' : 'Discard'}
                  </SButton>
                )}
                <SButton
                  variant="primary"
                  size="sm"
                  icon={<Save />}
                  onClick={handleSaveChanges}
                  disabled={!dirty || isSaving || loadingProfile}
                >
                  {isSaving
                    ? (isAr ? 'جاري الحفظ...' : 'Saving...')
                    : (isAr ? 'حفظ التغييرات' : 'Save Changes')}
                </SButton>
              </div>
            )
          }
        />

        {/* ── رسالة خطأ تحميل الصفحة ── */}
        {loadError && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--error-light)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: 'var(--danger, #DC2626)',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              {loadError === '__LOAD_FAILED__'
                ? (isAr ? 'تعذر تحميل بيانات الملف الشخصي.' : 'Failed to load profile settings.')
                : loadError}
            </span>
            <SButton variant="ghost" size="sm" icon={<RefreshCw />} onClick={handleRetryLoad}>
              {isAr ? 'إعادة المحاولة' : 'Retry'}
            </SButton>
          </div>
        )}

        {/* ── شريط نتيجة الحفظ (نجاح أو خطأ — ظاهر على جميع التبويبات) ── */}
        {saveBanner && (
          <div
            role={saveBanner.type === 'error' ? 'alert' : 'status'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: saveBanner.type === 'success' ? 'var(--success-light)' : 'var(--error-light)',
              border:
                saveBanner.type === 'success'
                  ? '1px solid rgba(22, 163, 74, 0.3)'
                  : '1px solid rgba(220, 38, 38, 0.3)',
              color: saveBanner.type === 'success' ? 'var(--success)' : 'var(--danger, #DC2626)',
              fontSize: '13.5px',
              fontWeight: '600',
            }}
          >
            {saveBanner.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{saveBanner.text}</span>
          </div>
        )}

        {/* ── تنبيه التعديلات غير المحفوظة ── */}
        {dirty && activeTab !== 'security' && (
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
              <span>{isAr ? 'لديك تعديلات غير محفوظة.' : 'You have unsaved changes.'}</span>
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

        {/* ── شريط التبويبات ── */}
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
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  fontFamily: 'var(--font-arabic)',
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── محتوى التبويب النشط ── */}
        <div style={{ marginTop: '4px' }}>
          {loadingProfile && activeTab !== 'security' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <SSkeleton height={150} radius={14} />
              <SSkeleton height={210} radius={14} />
            </div>
          ) : (
            <>
              {activeTab === 'profile' && (
                <ProfileSettingsSection
                  formData={formData}
                  fieldErrors={fieldErrors}
                  handleChange={handleChange}
                  handleGradeChange={handleGradeChange}
                  onUploadAvatar={handleUploadAvatar}
                  onDeleteAvatar={handleDeleteAvatar}
                  lang={lang}
                  isRtl={isRtl}
                />
              )}

              {activeTab === 'study' && (
                <StudyGoalsPrivacySection
                  formData={formData}
                  handleSelectChange={handleSelectChange}
                  handleChange={handleChange}
                  lang={lang}
                  isRtl={isRtl}
                />
              )}

              {activeTab === 'preferences' && (
                <PreferencesSettingsSection
                  formData={formData}
                  handleSelectChange={handleSelectChange}
                  onSyncInstantPreference={handleSyncInstantPreference}
                  lang={lang}
                />
              )}

              {activeTab === 'security' && <SecuritySettingsSection lang={lang} />}
            </>
          )}
        </div>
      </div>
    </SPage>
  );
};

export default StudentSettingsView;
