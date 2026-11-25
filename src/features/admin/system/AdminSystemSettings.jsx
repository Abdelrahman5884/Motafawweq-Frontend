import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { adminApi } from '../../../services/adminApi';
import { ServerCapacityPanel } from './ServerCapacityPanel';
import { SystemIssuesPanel } from './SystemIssuesPanel';
import { AdminPasswordAndSecurityPanel } from './AdminPasswordAndSecurityPanel';
import {
  Server,
  AlertTriangle,
  Shield,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const AdminSystemSettings = () => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const [activeSubTab, setActiveSubTab] = useState('server'); // 'server' | 'issues' | 'security'
  const [telemetry, setTelemetry] = useState(null);
  const [capacity, setCapacity] = useState(null);
  const [issues, setIssues] = useState(null);
  const [securitySummary, setSecuritySummary] = useState(null);

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

      {/* Clean 3-Tab Sub-Navigation Switcher */}
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
                  padding: '9px 15px',
                  borderRadius: '11px',
                  border: 'none',
                  backgroundColor: selected ? '#06254E' : 'transparent',
                  color: selected ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: selected ? '800' : '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
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

      {/* Tab 2: Clear Diagnostics, Issues & Failed Jobs */}
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

      {/* Tab 3: Security & Change Password */}
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
