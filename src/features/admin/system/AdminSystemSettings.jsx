import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { adminApi } from '../../../services/adminApi';
import { InfoTooltip } from '../../../components/common/InfoTooltip';
import { ServerCapacityPanel } from './ServerCapacityPanel';
import { SystemIssuesPanel } from './SystemIssuesPanel';
import { AdminPasswordAndSecurityPanel } from './AdminPasswordAndSecurityPanel';
import {
  Server,
  AlertTriangle,
  Sliders,
  Shield,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Lock,
} from 'lucide-react';

export const AdminSystemSettings = () => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const [activeSubTab, setActiveSubTab] = useState('server'); // 'server' | 'issues' | 'controls' | 'security'
  const [telemetry, setTelemetry] = useState(null);
  const [capacity, setCapacity] = useState(null);
  const [issues, setIssues] = useState(null);
  const [securitySummary, setSecuritySummary] = useState(null);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowTeacherRegistration: true,
    antiPassback: true,
    antiPassbackMinutes: 45,
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditMeta, setAuditMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [auditLevel, setAuditLevel] = useState('all');
  const [auditSearchInput, setAuditSearchInput] = useState('');
  const [auditSearch, setAuditSearch] = useState('');
  const [auditPage, setAuditPage] = useState(1);
  const [loadingAudit, setLoadingAudit] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingKey, setSavingKey] = useState(null);
  const [savingMinutes, setSavingMinutes] = useState(false);
  const [isFlushingCache, setIsFlushingCache] = useState(false);
  const [busyJobId, setBusyJobId] = useState(null);
  const [flushingJobs, setFlushingJobs] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const seqRef = useRef(0);

  const showToast = useCallback((text, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ text, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setAuditSearch(auditSearchInput.trim());
      setAuditPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [auditSearchInput]);

  const loadSystemOverview = useCallback(async () => {
    const seq = ++seqRef.current;
    setLoading(true);
    setError(null);
    try {
      const [ovRes, secRes] = await Promise.all([
        adminApi.system.getOverview(),
        adminApi.system.getSecuritySummary(),
      ]);
      if (seq !== seqRef.current) return;

      if (ovRes?.data?.telemetry) setTelemetry(ovRes.data.telemetry);
      if (ovRes?.data?.capacity) setCapacity(ovRes.data.capacity);
      if (ovRes?.data?.issues) setIssues(ovRes.data.issues);
      if (ovRes?.data?.settings) setSettings((prev) => ({ ...prev, ...ovRes.data.settings }));
      if (secRes?.data) setSecuritySummary(secRes.data);
    } catch (err) {
      if (seq !== seqRef.current) return;
      setError(err?.message || (isAr ? 'تعذر تحميل حالة السيرفر والإعدادات' : 'Failed to load system overview'));
    } finally {
      if (seq === seqRef.current) setLoading(false);
    }
  }, [isAr]);

  const loadAuditLogs = useCallback(async () => {
    setLoadingAudit(true);
    try {
      const res = await adminApi.system.listAuditLogs({
        level: auditLevel !== 'all' ? auditLevel : undefined,
        search: auditSearch || undefined,
        page: auditPage,
        per_page: 12,
      });
      setAuditLogs(Array.isArray(res?.data) ? res.data : []);
      if (res?.meta) {
        setAuditMeta({
          current_page: res.meta.current_page ?? 1,
          last_page: res.meta.last_page ?? 1,
          total: res.meta.total ?? 0,
        });
      }
    } catch {
      setAuditLogs([]);
    } finally {
      setLoadingAudit(false);
    }
  }, [auditLevel, auditSearch, auditPage]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) loadSystemOverview();
    });
    return () => {
      active = false;
    };
  }, [loadSystemOverview]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) loadAuditLogs();
    });
    return () => {
      active = false;
    };
  }, [loadAuditLogs]);

  const emitSettingsSync = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('admin-settings-updated'));
    }
  };

  const handleToggle = async (key) => {
    const prevVal = settings[key];
    const nextVal = !prevVal;
    setSettings((prev) => ({ ...prev, [key]: nextVal }));
    setSavingKey(key);
    try {
      const res = await adminApi.system.updateSettings({ [key]: nextVal });
      if (res?.data) setSettings((prev) => ({ ...prev, ...res.data }));
      emitSettingsSync();
      showToast(isAr ? 'تم تحديث الإعداد بنجاح' : 'Setting updated');
      loadSystemOverview();
      loadAuditLogs();
    } catch (err) {
      setSettings((prev) => ({ ...prev, [key]: prevVal }));
      showToast(err?.message || (isAr ? 'فشل تحديث الإعداد' : 'Failed to update setting'), 'error');
    } finally {
      setSavingKey(null);
    }
  };

  const handleSavePassbackMinutes = async (e) => {
    e.preventDefault();
    setSavingMinutes(true);
    try {
      const res = await adminApi.system.updateSettings({
        antiPassbackMinutes: Number(settings.antiPassbackMinutes),
      });
      if (res?.data) setSettings((prev) => ({ ...prev, ...res.data }));
      showToast(isAr ? 'تم حفظ مدة الحماية بنجاح' : 'Protection window saved');
      loadAuditLogs();
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر حفظ القيمة' : 'Failed to save'), 'error');
    } finally {
      setSavingMinutes(false);
    }
  };

  const handleFlushCache = async () => {
    setIsFlushingCache(true);
    try {
      const res = await adminApi.system.flushCache();
      const newEpoch = res?.data?.cacheEpoch;
      if (newEpoch !== undefined) {
        setTelemetry((prev) => (prev ? { ...prev, cacheEpoch: newEpoch } : prev));
      }
      showToast(isAr ? `تم إفراغ الكاش بنجاح (#${newEpoch ?? ''})` : `Cache cleared (#${newEpoch ?? ''})`);
      loadAuditLogs();
    } catch (err) {
      showToast(err?.message || (isAr ? 'فشل إفراغ الكاش' : 'Failed to clear cache'), 'error');
    } finally {
      setIsFlushingCache(false);
    }
  };

  const handleRetryFailedJob = async (id) => {
    setBusyJobId(id);
    try {
      await adminApi.system.retryFailedJob(id);
      showToast(isAr ? `تمت إعادة جدولة المهمة #${id}` : `Job #${id} queued for retry`);
      loadSystemOverview();
      loadAuditLogs();
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر إعادة المهمة' : 'Failed to retry job'), 'error');
    } finally {
      setBusyJobId(null);
    }
  };

  const handleDeleteFailedJob = async (id) => {
    setBusyJobId(id);
    try {
      await adminApi.system.deleteFailedJob(id);
      showToast(isAr ? `تم حذف المهمة #${id}` : `Failed job #${id} deleted`);
      loadSystemOverview();
      loadAuditLogs();
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر حذف المهمة' : 'Failed to delete job'), 'error');
    } finally {
      setBusyJobId(null);
    }
  };

  const handleFlushFailedJobs = async () => {
    if (!window.confirm(isAr ? 'هل تريد مسح جميع المهام الفاشلة من الطابور؟' : 'Flush all failed jobs?')) return;
    setFlushingJobs(true);
    try {
      const res = await adminApi.system.flushFailedJobs();
      const cnt = Number(res?.data?.flushedCount ?? 0);
      showToast(isAr ? `تم مسح ${cnt} مهمة فاشلة بنجاح` : `Flushed ${cnt} failed jobs`);
      loadSystemOverview();
      loadAuditLogs();
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر مسح المهام الفاشلة' : 'Failed to flush jobs'), 'error');
    } finally {
      setFlushingJobs(false);
    }
  };

  const totalAlerts = Number(issues?.totalAlerts ?? 0);
  const subTabs = [
    { id: 'server', labelAr: 'السيرفر والطاقة', labelEn: 'Server & Capacity', icon: Server },
    { id: 'issues', labelAr: 'المشاكل', labelEn: 'Issues', icon: AlertTriangle, badge: totalAlerts },
    { id: 'controls', labelAr: 'التحكم', labelEn: 'Controls', icon: Sliders },
    { id: 'security', labelAr: 'الأمان وكلمة المرور', labelEn: 'Security & Password', icon: Shield },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: isRtl ? '24px' : 'auto',
            right: isRtl ? 'auto' : '24px',
            backgroundColor: toast.type === 'error' ? '#991B1B' : 'var(--color-brand-dark)',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 9999,
            fontSize: '13.5px',
            fontWeight: '700',
          }}
        >
          {toast.type === 'error' ? <AlertCircle size={18} color="#FCA5A5" /> : <CheckCircle2 size={18} color="var(--primary-light)" />}
          <span>{toast.text}</span>
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#B91C1C', fontSize: '13px', fontWeight: '700' }}>
          <span>{error}</span>
          <button type="button" onClick={loadSystemOverview} style={{ backgroundColor: '#B91C1C', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
            {isAr ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* Sub-navigation Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '8px 12px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {subTabs.map((t) => {
            const selected = activeSubTab === t.id;
            const TabIcon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveSubTab(t.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '9px 14px',
                  borderRadius: '11px',
                  border: 'none',
                  backgroundColor: selected ? '#06254E' : 'transparent',
                  color: selected ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: selected ? '800' : '700',
                  cursor: 'pointer',
                }}
              >
                <TabIcon size={15} />
                <span>{isAr ? t.labelAr : t.labelEn}</span>
                {t.badge > 0 && (
                  <span
                    style={{
                      padding: '1px 7px',
                      borderRadius: '999px',
                      fontSize: '10.5px',
                      fontWeight: '900',
                      backgroundColor: selected ? '#EF4444' : 'rgba(239, 68, 68, 0.16)',
                      color: selected ? '#FFFFFF' : '#DC2626',
                    }}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            loadSystemOverview();
            loadAuditLogs();
          }}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 13px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          <span>{isAr ? 'فحص الآن' : 'Refresh'}</span>
        </button>
      </div>

      {/* Tab 1: Server Telemetry & Per-Role Capacity */}
      {activeSubTab === 'server' && (
        <ServerCapacityPanel
          telemetry={telemetry}
          capacity={capacity}
          loading={loading}
          lang={lang}
        />
      )}

      {/* Tab 2: Exact Live Issues & Server Errors */}
      {activeSubTab === 'issues' && (
        <SystemIssuesPanel
          issues={issues}
          loading={loading}
          busyJobId={busyJobId}
          flushingJobs={flushingJobs}
          lang={lang}
          onRetryFailedJob={handleRetryFailedJob}
          onDeleteFailedJob={handleDeleteFailedJob}
          onFlushFailedJobs={handleFlushFailedJobs}
        />
      )}

      {/* Tab 3: Essential Platform Controls */}
      {activeSubTab === 'controls' && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '20px 22px',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {isAr ? 'التحكم الأساسي' : 'Essential Controls'}
            </h3>
          </div>

          {[
            {
              key: 'maintenanceMode',
              titleAr: 'وضع الصيانة',
              titleEn: 'Maintenance Mode',
              infoAr: 'يغلق المنصة مؤقتاً أمام جميع المستخدمين مع إبقاء وصول الإدارة العليا فقط.',
              infoEn: 'Locks non-admin endpoints with 503 Maintenance while admins retain access.',
              danger: true,
            },
            {
              key: 'allowTeacherRegistration',
              titleAr: 'تسجيل المعلمين الجدد',
              titleEn: 'Teacher Registration',
              infoAr: 'يسمح أو يوقف إنشاء حسابات معلمين جدد من صفحة التسجيل.',
              infoEn: 'Controls whether new teachers can self-register.',
            },
            {
              key: 'antiPassback',
              titleAr: 'حماية الباركود (Anti-Passback)',
              titleEn: 'Barcode Anti-Passback',
              infoAr: `يمنع استخدام نفس كود الحضور مرتين خلال أقل من ${settings.antiPassbackMinutes} دقيقة.`,
              infoEn: `Blocks duplicate entrance scans within ${settings.antiPassbackMinutes} minutes.`,
            },
          ].map((item) => {
            const checked = Boolean(settings[item.key]);
            const isDangerOn = item.danger && checked;
            return (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  backgroundColor: isDangerOn ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-subtle)',
                  border: isDangerOn ? '1.5px solid rgba(239, 68, 68, 0.35)' : '1px solid var(--border-subtle)',
                  opacity: savingKey === item.key ? 0.65 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.danger && <Lock size={15} color={checked ? '#EF4444' : 'var(--text-secondary)'} />}
                  <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {isAr ? item.titleAr : item.titleEn}
                  </span>
                  <InfoTooltip size={13} text={isAr ? item.infoAr : item.infoEn} />
                </div>
                <input
                  type="checkbox"
                  disabled={savingKey === item.key}
                  checked={checked}
                  onChange={() => handleToggle(item.key)}
                  style={{ width: '21px', height: '21px', cursor: 'pointer', accentColor: item.danger ? '#EF4444' : 'var(--primary)' }}
                />
              </div>
            );
          })}

          {settings.antiPassback && (
            <form
              onSubmit={handleSavePassbackMinutes}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {isAr ? 'مدة منع تكرار الباركود (دقيقة)' : 'Anti-Passback Window (min)'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  min="5"
                  max="240"
                  value={settings.antiPassbackMinutes}
                  onChange={(e) => setSettings((prev) => ({ ...prev, antiPassbackMinutes: e.target.value }))}
                  style={{ width: '88px', padding: '7px 10px', borderRadius: '9px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontWeight: '800' }}
                />
                <button
                  type="submit"
                  disabled={savingMinutes}
                  style={{ padding: '7px 14px', borderRadius: '9px', border: 'none', backgroundColor: 'var(--primary)', color: '#FFFFFF', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                >
                  {savingMinutes ? '...' : (isAr ? 'حفظ' : 'Save')}
                </button>
              </div>
            </form>
          )}

          {/* Flush Cache */}
          <div
            style={{
              paddingTop: '14px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {isAr ? 'إفراغ الكاش' : 'Clear Cache'}
              </span>
              <InfoTooltip
                size={13}
                text={
                  isAr
                    ? 'تحديث فوري لذاكرة الكاش دون التأثير على جلسات المستخدمين.'
                    : 'Safely invalidates app caches via epoch rotation without logging users out.'
                }
              />
            </div>

            <button
              type="button"
              onClick={handleFlushCache}
              disabled={isFlushingCache}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                padding: '8px 15px',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                cursor: isFlushingCache ? 'wait' : 'pointer',
              }}
            >
              <RefreshCw size={14} style={{ animation: isFlushingCache ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isFlushingCache ? (isAr ? 'جارٍ الإفراغ...' : 'Clearing...') : (isAr ? 'إفراغ الكاش الآن' : 'Clear Cache')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Change Password & Security Audit */}
      {activeSubTab === 'security' && (
        <AdminPasswordAndSecurityPanel
          securitySummary={securitySummary}
          auditLogs={auditLogs}
          auditMeta={auditMeta}
          auditLevel={auditLevel}
          auditSearchInput={auditSearchInput}
          loadingAudit={loadingAudit}
          lang={lang}
          isRtl={isRtl}
          onAuditSearchChange={setAuditSearchInput}
          onAuditLevelChange={(lvl) => {
            setAuditLevel(lvl);
            setAuditPage(1);
          }}
          onAuditPageChange={setAuditPage}
          onPasswordChanged={() => {
            loadSystemOverview();
            loadAuditLogs();
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
};
