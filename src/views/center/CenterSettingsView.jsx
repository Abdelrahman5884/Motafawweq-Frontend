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
import { useGroups } from '../../context/GroupsContext';
import {
  CenterAnnouncementsTab,
  CenterCloudBackupTab,
  CenterDataImportTab,
  CenterKpiBuilderTab,
  CenterPoliciesTab,
  CenterTasksTab,
  SETTINGS_TABS,
} from '../../features/center/settings';
import '../../features/center/settings/settings.css';

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
  const isAr = lang === 'ar';
  const isRtl = isAr;
  const navigate = useNavigate();

  const { isAuthenticated, currentUser, activeViewRole, switchRole, centerPlanTier } = useAuth();
  const { showToast } = useGroups();

  const {
    isBackendCenter,
    loadSettingsData,
    loadOperationsData,
    exportToCsv,
    branches = [],
    groups = [],
    rooms = [],
    staff = [],
    centerTeachers = [],
    centerSettings,
    dashboardData,
    financialSummary,
    updateCenterSettings,
    updateKpiTargets,
    tasks = [],
    addCenterTask,
    updateCenterTask,
    toggleCenterTask,
    deleteCenterTask,
    announcements = [],
    addCenterAnnouncement,
    deleteCenterAnnouncement,
    importCenterStudents,
    backups = [],
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
      <div className="cs-container" style={{ textAlign: 'center', paddingTop: '60px' }}>
        <div className="cs-card" style={{ maxWidth: '480px', margin: '0 auto', padding: '36px 24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(21, 136, 199, 0.1)',
              color: 'var(--primary)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Lock size={26} />
          </div>
          <h2 style={{ fontSize: '19px', fontWeight: '800', margin: '0 0 8px' }}>
            {isAr ? 'تسجيل الدخول مطلوب لإدارة السنتر' : 'Sign In Required'}
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
            {isAr
              ? 'يرجى تسجيل الدخول بحساب سنتر للوصول إلى إعدادات المنظومة والمهام.'
              : 'Please sign in with a center account to access operational settings.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="cs-btn cs-btn-primary"
            style={{ width: '100%' }}
          >
            {isAr ? 'تسجيل الدخول الآن' : 'Sign In'}
          </button>
        </div>
      </div>
    );
  }

  if (!isBackendCenter) {
    const canSwitch =
      Array.isArray(currentUser?.roles) && currentUser.roles.includes('center');

    return (
      <div className="cs-container" style={{ textAlign: 'center', paddingTop: '60px' }}>
        <div className="cs-card" style={{ maxWidth: '480px', margin: '0 auto', padding: '36px 24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              color: '#d97706',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 16px',
            }}
          >
            <ShieldAlert size={26} />
          </div>
          <h2 style={{ fontSize: '19px', fontWeight: '800', margin: '0 0 8px' }}>
            {isAr ? 'هذه الصفحة مخصصة لإدارة السنتر فقط' : 'Center Account Required'}
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
            {isAr
              ? `أنت مسجل حالياً بدور (${activeViewRole || currentUser?.role}). يرجى التبديل لحساب السنتر المعتمد.`
              : `Current role: ${activeViewRole || currentUser?.role}. Switch to center.`}
          </p>
          {canSwitch && (
            <button
              type="button"
              onClick={() => switchRole('center')}
              className="cs-btn cs-btn-primary"
              style={{ width: '100%' }}
            >
              {isAr ? 'التبديل إلى بوابة السنتر' : 'Switch to Center'}
            </button>
          )}
        </div>
      </div>
    );
  }

  const centerDisplayTitle =
    centerSettings?.nameAr ||
    centerSettings?.centerNameAr ||
    currentUser?.centerNameAr ||
    (isAr ? 'السنتر التعليمي' : 'Center Portal');

  return (
    <div className="cs-container" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 1. Header Banner */}
      <div className="cs-header">
        <div className="cs-header-start">
          <div className="cs-header-icon">
            <Settings size={24} />
          </div>
          <div>
            <h1 className="cs-header-title">
              {isAr
                ? `إعدادات منظومة السنتر والمهام اليومية — ${centerDisplayTitle}`
                : `Center Settings & Daily Operations — ${centerDisplayTitle}`}
            </h1>
            <p className="cs-header-desc">
              {isAr
                ? 'إدارة الهوية الرسمية، سياسات التحصيل، المهام اليومية، التعميمات، واستيراد الطلاب'
                : 'Manage official identity, cash policies, daily tasks, announcements, and imports'}
            </p>
          </div>
        </div>

        {centerSettings?.planNameAr && (
          <div className="cs-header-badge">
            <span>{isAr ? centerSettings.planNameAr : centerSettings.planNameEn || centerSettings.planTier}</span>
          </div>
        )}
      </div>

      {/* 2. Navigation Tabs Bar */}
      <nav className="cs-tabs-nav" role="tablist">
        {SETTINGS_TABS.map((t) => {
          const Icon = TAB_ICONS[t.id] || Settings;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`cs-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <Icon size={16} />
              <span>{isAr ? t.labelAr : t.labelEn}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. Tab Contents */}
      {activeTab === 'policies' && (
        <CenterPoliciesTab
          key={centerSettings?.id || 'policies'}
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
          key={`${centerSettings?.id || 'kpis'}-${centerSettings?.kpiTargets?.targetAttendance ?? ''}`}
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
