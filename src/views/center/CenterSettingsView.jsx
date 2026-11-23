import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  ClipboardList,
  Cloud,
  FileSpreadsheet,
  Lock,
  Settings,
  ShieldAlert,
  Target,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCenter } from '../../context/CenterContext';
import { useAuth } from '../../context/AuthContext';
import {
  CenterAnnouncementsTab,
  CenterCloudBackupTab,
  CenterDataImportTab,
  CenterKpiBuilderTab,
  CenterPoliciesTab,
  CenterTasksTab,
  SETTINGS_TABS,
} from '../../features/center/settings';

const TAB_ICONS = {
  policies: Settings,
  tasks: ClipboardList,
  announcements: Bell,
  import: FileSpreadsheet,
  backup: Cloud,
  kpis: Target,
};

export const CenterSettingsView = () => {
  const { lang } = useLanguage();
  const isRtl = lang === 'ar';
  const navigate = useNavigate();
  const {
    isAuthenticated,
    currentUser,
    activeViewRole,
    switchRole,
    centerPlanTier,
    showToast,
  } = useAuth();

  const {
    isBackendCenter,
    loadSettingsData,
    loadOperationsData,
    exportToCsv,
    branches,
    groups,
    rooms,
    staff,
    centerTeachers,
    centerSettings,
    dashboardData,
    financialSummary,
    updateCenterSettings,
    updateKpiTargets,
    tasks,
    addCenterTask,
    updateCenterTask,
    toggleCenterTask,
    deleteCenterTask,
    announcements,
    addCenterAnnouncement,
    deleteCenterAnnouncement,
    importCenterStudents,
    backups,
    createCenterBackup,
  } = useCenter();

  const [activeTab, setActiveTab] = useState('policies');

  useEffect(() => {
    if (isBackendCenter) {
      loadSettingsData();
      if (staff.length === 0) {
        loadOperationsData();
      }
    }
  }, [isBackendCenter, loadSettingsData, loadOperationsData, staff.length]);

  if (!isAuthenticated) {
    return (
      <div
        style={{
          direction: isRtl ? 'rtl' : 'ltr',
          padding: '48px 24px',
          maxWidth: '540px',
          margin: '40px auto',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <Lock size={26} />
        </div>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 8px',
          }}
        >
          {lang === 'ar'
            ? 'تسجيل الدخول مطلوب لإدارة إعدادات السنتر'
            : 'Sign In Required for Center Settings'}
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            margin: '0 0 24px',
            lineHeight: 1.6,
          }}
        >
          {lang === 'ar'
            ? 'يرجى تسجيل الدخول بحساب إدارة السنتر للوصول إلى السياسات التشغيلية والمهام والنسخ الاحتياطي السحابي.'
            : 'Please sign in with an authorized Center account to manage policies, tasks, and cloud backups.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{
            padding: '11px 24px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            border: 'none',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          {lang === 'ar' ? 'تسجيل الدخول الآن' : 'Sign In Now'}
        </button>
      </div>
    );
  }

  if (!isBackendCenter) {
    const canSwitchToCenter =
      Array.isArray(currentUser?.roles) && currentUser.roles.includes('center');
    return (
      <div
        style={{
          direction: isRtl ? 'rtl' : 'ltr',
          padding: '48px 24px',
          maxWidth: '560px',
          margin: '40px auto',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            color: '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <ShieldAlert size={26} />
        </div>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 8px',
          }}
        >
          {lang === 'ar'
            ? 'هذه الصفحة مخصصة لحسابات إدارة السنتر فقط'
            : 'Center Account Required'}
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            margin: '0 0 24px',
            lineHeight: 1.6,
          }}
        >
          {lang === 'ar'
            ? `أنت مسجل الدخول حالياً بدور (${activeViewRole || currentUser?.role}). لإدارة إعدادات السنتر، يرجى التبديل إلى حساب سنتر معتمد.`
            : `You are currently signed in with role (${activeViewRole || currentUser?.role}). Switch to an authorized Center account to continue.`}
        </p>
        {canSwitchToCenter && (
          <button
            type="button"
            onClick={() => switchRole('center')}
            style={{
              padding: '11px 24px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {lang === 'ar' ? 'التبديل إلى بوابة السنتر' : 'Switch to Center Portal'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        direction: isRtl ? 'rtl' : 'ltr',
        paddingBottom: '48px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '22px 26px',
          marginBottom: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--primary-subtle)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Settings size={24} />
          </div>
          <div>
            <h1
              style={{
                fontSize: '21px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              {lang === 'ar'
                ? 'إعدادات السنتر، السياسات، والمهام اليومية'
                : 'Center Settings, Policies & Operations'}
            </h1>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                margin: '4px 0 0 0',
              }}
            >
              {lang === 'ar'
                ? 'تخصيص هوية السنتر، السياسات المالية، المهام اليومية، التعميمات، استيراد الطلاب، والنسخ الاحتياطي السحابي'
                : 'Configure center identity, financial rules, daily tasks, announcements, CSV import, and cloud backup'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '22px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
          overflowX: 'auto',
        }}
      >
        {SETTINGS_TABS.map((t) => {
          const Icon = TAB_ICONS[t.id] || Settings;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                border: isActive ? 'none' : '1px solid var(--border-subtle)',
                backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-surface)',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={16} />
              <span>{lang === 'ar' ? t.labelAr : t.labelEn}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'policies' && (
        <CenterPoliciesTab
          key={centerSettings?.id || 'center-policies'}
          lang={lang}
          centerSettings={centerSettings}
          updateCenterSettings={updateCenterSettings}
          showToast={showToast}
        />
      )}

      {activeTab === 'tasks' && (
        <CenterTasksTab
          lang={lang}
          tasks={tasks}
          staff={staff}
          centerTeachers={centerTeachers}
          addCenterTask={addCenterTask}
          updateCenterTask={updateCenterTask}
          toggleCenterTask={toggleCenterTask}
          deleteCenterTask={deleteCenterTask}
          showToast={showToast}
        />
      )}

      {activeTab === 'announcements' && (
        <CenterAnnouncementsTab
          lang={lang}
          announcements={announcements}
          branches={branches}
          addCenterAnnouncement={addCenterAnnouncement}
          deleteCenterAnnouncement={deleteCenterAnnouncement}
          showToast={showToast}
        />
      )}

      {activeTab === 'import' && (
        <CenterDataImportTab
          lang={lang}
          isRtl={isRtl}
          groups={groups}
          importCenterStudents={importCenterStudents}
          exportToCsv={exportToCsv}
          showToast={showToast}
        />
      )}

      {activeTab === 'backup' && (
        <CenterCloudBackupTab
          lang={lang}
          isRtl={isRtl}
          centerSettings={centerSettings}
          centerPlanTier={centerPlanTier}
          backups={backups}
          createCenterBackup={createCenterBackup}
          showToast={showToast}
        />
      )}

      {activeTab === 'kpis' && (
        <CenterKpiBuilderTab
          key={`${centerSettings?.id || 'kpi'}-${centerSettings?.kpiTargets?.targetAttendance ?? ''}`}
          lang={lang}
          centerSettings={centerSettings}
          dashboardData={dashboardData}
          groups={groups}
          rooms={rooms}
          financialSummary={financialSummary}
          updateKpiTargets={updateKpiTargets}
          showToast={showToast}
        />
      )}
    </div>
  );
};

export default CenterSettingsView;
