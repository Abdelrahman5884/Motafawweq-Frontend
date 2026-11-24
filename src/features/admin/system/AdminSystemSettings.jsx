import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { adminApi } from '../../../services/adminApi';
import {
  Server,
  Shield,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Lock,
  Search,
  ChevronLeft,
  ChevronRight,
  Sliders
} from 'lucide-react';

export const AdminSystemSettings = () => {
  const { lang, isRtl } = useLanguage();

  const [telemetry, setTelemetry] = useState(null);
  const [securitySummary, setSecuritySummary] = useState(null);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowTeacherRegistration: true,
    autoCertificates: true,
    antiPassback: true,
    antiPassbackMinutes: 45,
    highPerformanceAudio: true,
    logLevel: 'standard',
    platformCommissionPercent: 20,
    aiCostPerMinuteEgp: 0.42,
    aiRevenuePerMinuteEgp: 1.5,
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
  const [savingAdvanced, setSavingAdvanced] = useState(false);
  const [isFlushingCache, setIsFlushingCache] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

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
    setLoading(true);
    setError(null);
    try {
      const [ovRes, secRes] = await Promise.all([
        adminApi.system.getOverview(),
        adminApi.system.getSecuritySummary(),
      ]);
      if (ovRes?.data?.telemetry) setTelemetry(ovRes.data.telemetry);
      if (ovRes?.data?.settings) setSettings(prev => ({ ...prev, ...ovRes.data.settings }));
      if (secRes?.data) setSecuritySummary(secRes.data);
    } catch (err) {
      setError(err?.message || (lang === 'ar' ? 'تعذر تحميل حالة السيرفر وإعدادات النظام' : 'Failed to load system overview'));
    } finally {
      setLoading(false);
    }
  }, [lang]);

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
    loadSystemOverview();
  }, [loadSystemOverview]);

  useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  const emitSettingsSync = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('admin-settings-updated'));
    }
  };

  const handleToggle = async (key) => {
    const prevVal = settings[key];
    const nextVal = !prevVal;
    setSettings(prev => ({ ...prev, [key]: nextVal }));
    setSavingKey(key);
    try {
      const res = await adminApi.system.updateSettings({ [key]: nextVal });
      if (res?.data) setSettings(prev => ({ ...prev, ...res.data }));
      emitSettingsSync();
      showToast(lang === 'ar' ? 'تم تحديث السياسة وحفظها في قاعدة البيانات' : 'Policy updated & saved');
      loadAuditLogs();
    } catch (err) {
      setSettings(prev => ({ ...prev, [key]: prevVal }));
      showToast(err?.message || (lang === 'ar' ? 'فشل تحديث الإعداد' : 'Failed to update setting'), 'error');
    } finally {
      setSavingKey(null);
    }
  };

  const handleSaveAdvancedSettings = async (e) => {
    e.preventDefault();
    setSavingAdvanced(true);
    try {
      const res = await adminApi.system.updateSettings({
        platformCommissionPercent: Number(settings.platformCommissionPercent),
        aiCostPerMinuteEgp: Number(settings.aiCostPerMinuteEgp),
        antiPassbackMinutes: Number(settings.antiPassbackMinutes),
        logLevel: settings.logLevel,
      });
      if (res?.data) setSettings(prev => ({ ...prev, ...res.data }));
      emitSettingsSync();
      showToast(lang === 'ar' ? 'تم حفظ الإعدادات الاقتصادية والأمنية بنجاح' : 'Advanced parameters saved');
      loadAuditLogs();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر حفظ الإعدادات المتقدمة' : 'Failed to save advanced settings'), 'error');
    } finally {
      setSavingAdvanced(false);
    }
  };

  const handleFlushCache = async () => {
    setIsFlushingCache(true);
    try {
      const res = await adminApi.system.flushCache();
      const newEpoch = res?.data?.cacheEpoch;
      if (newEpoch !== undefined) {
        setTelemetry(prev => (prev ? { ...prev, cacheEpoch: newEpoch } : prev));
      }
      showToast(
        lang === 'ar'
          ? `تم تفريغ الذاكرة المؤقتة وتحديث حقبة الكاش (#${newEpoch ?? ''}) بنجاح`
          : `Cache purged successfully (Epoch #${newEpoch ?? ''})`
      );
      loadAuditLogs();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'فشل تفريغ الذاكرة المؤقتة' : 'Failed to flush cache'), 'error');
    } finally {
      setIsFlushingCache(false);
    }
  };

  const isOperational = telemetry ? telemetry.overallStatus === 'operational' : true;

  const getLevelBadgeStyle = (level) => {
    if (level === 'critical' || level === 'error') {
      return { bg: 'rgba(239, 68, 68, 0.14)', color: '#B91C1C' };
    }
    if (level === 'warning') {
      return { bg: 'rgba(245, 158, 11, 0.15)', color: '#B45309' };
    }
    return { bg: 'rgba(21, 136, 199, 0.12)', color: 'var(--primary)' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', left: isRtl ? '24px' : 'auto', right: isRtl ? 'auto' : '24px',
          backgroundColor: toast.type === 'error' ? '#991B1B' : 'var(--color-brand-dark)', color: '#FFFFFF',
          padding: '12px 20px', borderRadius: '12px', boxShadow: 'var(--shadow-lg)',
          display: 'flex', alignItems: 'center', gap: '10px', zIndex: 9999, fontSize: '14px', fontWeight: '600'
        }}>
          {toast.type === 'error'
            ? <AlertCircle size={18} color="#FCA5A5" />
            : <CheckCircle2 size={18} color="var(--primary-light)" />}
          <span>{toast.text}</span>
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px',
          padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#B91C1C', fontSize: '13px', fontWeight: '600'
        }}>
          <span>{error}</span>
          <button type="button" onClick={loadSystemOverview} style={{ backgroundColor: '#B91C1C', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer' }}>
            {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* 1. Live Cluster Health & Server Telemetry */}
      <div style={{
        backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
        borderRadius: '18px', padding: '22px', boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={22} color="var(--primary)" />
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'حالة السيرفر وقاعدة البيانات المباشرة' : 'Live Infrastructure Telemetry'}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'فحص فوري لزمن استجابة قاعدة البيانات والكاش وطوابير المعالجة' : 'Real-time database latency, cache health, queue jobs & storage'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px',
              backgroundColor: isOperational ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              color: isOperational ? '#047857' : '#B91C1C', fontSize: '12px', fontWeight: '700'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isOperational ? '#10B981' : '#EF4444', display: 'inline-block' }} />
              <span>
                {isOperational
                  ? (lang === 'ar' ? 'جميع الخدمات تعمل بكفاءة' : 'All Systems Operational')
                  : (lang === 'ar' ? 'يوجد تباطؤ أو خلل جزئي' : 'Degraded Health')}
              </span>
            </div>

            <button
              type="button"
              onClick={loadSystemOverview}
              disabled={loading}
              style={{
                width: '34px', height: '34px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '14px' }}>
          {[
            {
              label: lang === 'ar' ? 'زمن استجابة قاعدة البيانات' : 'Database Latency',
              val: telemetry ? `${telemetry.dbLatencyMs} ms` : '—',
              sub: telemetry?.dbHealthy ? (lang === 'ar' ? 'اتصال سليم ومستقر' : 'Healthy Connection') : (lang === 'ar' ? 'فشل الفحص' : 'Unhealthy'),
              color: telemetry?.dbHealthy ? '#10B981' : '#EF4444'
            },
            {
              label: lang === 'ar' ? 'محرك الكاش وحقبة التحديث' : 'Cache Driver & Epoch',
              val: telemetry ? `${telemetry.cacheDriver} • #${telemetry.cacheEpoch}` : '—',
              sub: telemetry?.cacheHealthy ? (lang === 'ar' ? 'جاهز بنسبة 100%' : '100% Operational') : (lang === 'ar' ? 'خارج الخدمة' : 'Unavailable'),
              color: 'var(--primary)'
            },
            {
              label: lang === 'ar' ? 'طوابير المهام وبيئة التشغيل' : 'Queues & Runtime',
              val: telemetry ? `${telemetry.queuePendingJobs} / ${telemetry.queueFailedJobs}` : '—',
              sub: telemetry ? `PHP ${telemetry.phpVersion} • ${telemetry.environment}` : '—',
              color: (telemetry?.queueFailedJobs ?? 0) > 0 ? '#EF4444' : '#6366F1'
            },
            {
              label: lang === 'ar' ? 'التخزين والذاكرة' : 'Storage & Memory',
              val: telemetry ? `${telemetry.storageUsedMb} MB` : '—',
              sub: telemetry
                ? (lang === 'ar' ? `${telemetry.storageFilesCount} ملف • RAM ${telemetry.memoryUsageMb} MB` : `${telemetry.storageFilesCount} files • RAM ${telemetry.memoryUsageMb} MB`)
                : '—',
              color: '#F59E0B'
            }
          ].map((item, i) => (
            <div key={i} style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: '14px', padding: '14px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{item.label}</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '2px' }}>{loading ? '...' : item.val}</div>
              <div style={{ fontSize: '11px', color: item.color, fontWeight: '700' }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Platform Controls & Toggles */}
      <div style={{
        backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
        borderRadius: '18px', padding: '22px', boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
          {lang === 'ar' ? 'مفاتيح التحكم وسياسات التشغيل الحية' : 'Live Platform Policies & Toggles'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            {
              key: 'maintenanceMode',
              titleAr: 'وضع الصيانة للمنصة (Maintenance Mode)',
              titleEn: 'Platform Maintenance Mode',
              descAr: 'عند التفعيل يُغلق الـ API أمام جميع المستخدمين مع إبقاء وصول مشرف المنصة فقط',
              descEn: 'Locks all non-admin endpoints with 503 Maintenance response while admins retain access',
              danger: true,
            },
            {
              key: 'allowTeacherRegistration',
              titleAr: 'السماح بتسجيل المعلمين الجدد ذاتياً',
              titleEn: 'Allow Teacher Self-Registration',
              descAr: 'يتحكم مباشرة في قبول طلبات تسجيل حسابات المعلمين الجديدة عبر /auth/register',
              descEn: 'Directly controls whether new teacher accounts can self-register',
            },
            {
              key: 'autoCertificates',
              titleAr: 'إصدار الشهادات المعتمدة تلقائياً',
              titleEn: 'Auto-issue Verified Certificates',
              descAr: 'توليد شهادة موثقة برقم مسلسل وكود QR تلقائياً عند اجتياز الطالب الاختبار الشامل',
              descEn: 'Automatically generate serial-numbered QR certificates on passing exams',
            },
            {
              key: 'antiPassback',
              titleAr: 'منع تكرار مسح الباركود في بوابات السنتر (Anti-Passback)',
              titleEn: 'Anti-Passback Gate Protection',
              descAr: `حظر استخدام نفس كود الحضور مرتين خلال أقل من ${settings.antiPassbackMinutes} دقيقة لمنع تمرير الباركود`,
              descEn: `Blocks duplicate entrance scans within ${settings.antiPassbackMinutes} minutes`,
            },
            {
              key: 'highPerformanceAudio',
              titleAr: 'معالجة الصوت بالذكاء الاصطناعي عالية الدقة',
              titleEn: 'High-Performance AI Audio Mode',
              descAr: 'تفعيل أولوية معالجة المحاضرات الصوتية وتوليد الملخصات السريع',
              descEn: 'Enables priority Whisper audio transcription & summary generation',
            },
          ].map(item => {
            const checked = Boolean(settings[item.key]);
            const isDangerOn = item.danger && checked;
            return (
              <div
                key={item.key}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px',
                  padding: '15px 16px', borderRadius: '14px',
                  backgroundColor: isDangerOn ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-subtle)',
                  border: isDangerOn ? '1.5px solid rgba(239, 68, 68, 0.35)' : '1px solid var(--border-subtle)',
                  opacity: savingKey === item.key ? 0.65 : 1,
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.danger && <Lock size={15} color={checked ? '#EF4444' : 'var(--text-secondary)'} />}
                    <span>{lang === 'ar' ? item.titleAr : item.titleEn}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {lang === 'ar' ? item.descAr : item.descEn}
                  </div>
                </div>
                <input
                  type="checkbox"
                  disabled={savingKey === item.key}
                  checked={checked}
                  onChange={() => handleToggle(item.key)}
                  style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: item.danger ? '#EF4444' : 'var(--primary)', flexShrink: 0 }}
                />
              </div>
            );
          })}
        </div>

        {/* Advanced Economic & Security Parameters */}
        <form onSubmit={handleSaveAdvancedSettings} style={{
          marginTop: '18px', padding: '16px', borderRadius: '14px', backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
            <Sliders size={16} color="var(--primary)" />
            <span>{lang === 'ar' ? 'المعايير المالية والتقنية' : 'Economic & Security Parameters'}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {lang === 'ar' ? 'نسبة عمولة المنصة (%)' : 'Platform Commission (%)'}
              </label>
              <input
                type="number" min="0" max="50" step="0.5"
                value={settings.platformCommissionPercent}
                onChange={e => setSettings(prev => ({ ...prev, platformCommissionPercent: e.target.value }))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontWeight: '700' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {lang === 'ar' ? 'تكلفة دقيقة الذكاء (ج.م)' : 'AI Cost / Min (EGP)'}
              </label>
              <input
                type="number" min="0" max="100" step="0.01"
                value={settings.aiCostPerMinuteEgp}
                onChange={e => setSettings(prev => ({ ...prev, aiCostPerMinuteEgp: e.target.value }))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontWeight: '700' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {lang === 'ar' ? 'مدة منع تكرار المسح (دقيقة)' : 'Anti-Passback Window (min)'}
              </label>
              <input
                type="number" min="5" max="240"
                value={settings.antiPassbackMinutes}
                onChange={e => setSettings(prev => ({ ...prev, antiPassbackMinutes: e.target.value }))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontWeight: '700' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {lang === 'ar' ? 'مستوى تسجيل الأمان' : 'Audit Log Level'}
              </label>
              <select
                value={settings.logLevel}
                onChange={e => setSettings(prev => ({ ...prev, logLevel: e.target.value }))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontWeight: '700' }}
              >
                <option value="standard">Standard</option>
                <option value="verbose">Verbose</option>
                <option value="strict">Strict</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={savingAdvanced}
              style={{
                backgroundColor: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 18px',
                borderRadius: '10px', fontSize: '12.5px', fontWeight: '700', cursor: savingAdvanced ? 'wait' : 'pointer'
              }}
            >
              {savingAdvanced ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ المعايير المتقدمة' : 'Save Parameters')}
            </button>
          </div>
        </form>

        {/* Flush Cache Action */}
        <div style={{
          marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'إفراغ الذاكرة المؤقتة (Cache Epoch Bump)' : 'Clear Platform Cache'}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'إبطال فوري لكاش اللوحات والإحصائيات دون التأثير على جلسات المستخدمين' : 'Instantly invalidates admin & catalog caches cleanly via epoch rotation'}
            </div>
          </div>

          <button
            type="button"
            onClick={handleFlushCache}
            disabled={isFlushingCache}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent',
              border: '1px solid var(--border-subtle)', padding: '8px 16px', borderRadius: '10px',
              fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', cursor: isFlushingCache ? 'wait' : 'pointer'
            }}
          >
            <RefreshCw size={14} style={{ animation: isFlushingCache ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isFlushingCache ? (lang === 'ar' ? 'جارٍ الإفراغ...' : 'Purging...') : (lang === 'ar' ? 'إفراغ الكاش الآن' : 'Purge Cache')}</span>
          </button>
        </div>
      </div>

      {/* 3. Security Posture & Immutable Security Audit Logs */}
      <div style={{
        backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
        borderRadius: '18px', padding: '22px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={22} color="var(--primary)" />
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'مؤشرات الأمان وسجل التدقيق غير القابل للتعديل (Audit Trail)' : 'Security Posture & Immutable Audit Trail'}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'رصد حي لمحاولات الدخول الفاشلة ومحاولات الاختراق وكافة إجراءات المشرفين' : 'Live 24h security telemetry and full immutable audit history'}
              </p>
            </div>
          </div>
        </div>

        {/* Security KPIs */}
        {securitySummary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
            {[
              { labelAr: 'دخول فاشل (24س)', labelEn: 'Failed Logins 24h', val: securitySummary.failedLogins24h, warn: securitySummary.failedLogins24h > 10 },
              { labelAr: 'حسابات مقفلة الآن', labelEn: 'Locked Accounts', val: securitySummary.lockedAccountsNow, warn: securitySummary.lockedAccountsNow > 0 },
              { labelAr: 'حسابات مجمدة', labelEn: 'Suspended Users', val: securitySummary.suspendedAccountsCount, warn: false },
              { labelAr: 'محاولات IDOR محجوبة', labelEn: 'IDOR Blocked 24h', val: securitySummary.idorAttemptsBlocked24h, warn: securitySummary.idorAttemptsBlocked24h > 0 },
              { labelAr: 'أحداث حرجة (24س)', labelEn: 'Critical Events 24h', val: securitySummary.criticalEvents24h, warn: securitySummary.criticalEvents24h > 0 },
              { labelAr: 'جلسات نشطة الآن', labelEn: 'Active Sessions', val: securitySummary.activeSessionsCount, warn: false },
            ].map((s, idx) => (
              <div key={idx} style={{
                padding: '12px', borderRadius: '12px',
                backgroundColor: s.warn ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-subtle)',
                border: s.warn ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '2px' }}>{lang === 'ar' ? s.labelAr : s.labelEn}</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: s.warn ? '#B91C1C' : 'var(--text-primary)' }}>
                  {Number(s.val || 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Audit Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '340px' }}>
            <Search size={15} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '11px', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={auditSearchInput}
              onChange={e => setAuditSearchInput(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث بالحدث، البريد، أو عنوان IP...' : 'Search event, actor, or IP...'}
              style={{
                width: '100%', padding: '8px 12px', paddingInlineStart: '34px', borderRadius: '10px',
                border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '12.5px'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['all', 'info', 'warning', 'error', 'critical'].map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => { setAuditLevel(lvl); setAuditPage(1); }}
                style={{
                  padding: '6px 11px', borderRadius: '8px', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer',
                  border: auditLevel === lvl ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: auditLevel === lvl ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                  color: auditLevel === lvl ? 'var(--primary)' : 'var(--text-secondary)'
                }}
              >
                {lvl === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : lvl.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="responsive-table-container" style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}>
          <table className="responsive-table" style={{ width: '100%', minWidth: '640px', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '10px 14px' }}>{lang === 'ar' ? 'الحدث' : 'Event'}</th>
                <th style={{ padding: '10px 14px' }}>{lang === 'ar' ? 'المستوى' : 'Level'}</th>
                <th style={{ padding: '10px 14px' }}>{lang === 'ar' ? 'الفاعل' : 'Actor'}</th>
                <th style={{ padding: '10px 14px' }}>{lang === 'ar' ? 'عنوان IP' : 'IP Address'}</th>
                <th style={{ padding: '10px 14px' }}>{lang === 'ar' ? 'التوقيت' : 'Timestamp'}</th>
              </tr>
            </thead>
            <tbody>
              {loadingAudit ? (
                <tr><td colSpan={5} style={{ padding: '28px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>{lang === 'ar' ? 'جاري تحميل سجل التدقيق...' : 'Loading audit trail...'}</td></tr>
              ) : auditLogs.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '28px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>{lang === 'ar' ? 'لا توجد أحداث مطابقة للفلتر' : 'No matching audit events'}</td></tr>
              ) : (
                auditLogs.map(log => {
                  const badge = getLevelBadgeStyle(log.level);
                  return (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '12.5px' }}>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {log.event}
                        {log.auditableType && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>
                            {log.auditableType} #{log.auditableId}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '10.5px', fontWeight: '800', backgroundColor: badge.bg, color: badge.color }}>
                          {(log.level || 'info').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-primary)' }}>
                        {log.actor ? (
                          <div style={{ fontWeight: '700' }}>{log.actor.name}</div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>System / Guest</span>
                        )}
                      </td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                        {log.ipAddress || '—'}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: '11.5px' }} dir="ltr">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US') : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Audit Pagination */}
        {auditMeta.last_page > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span>
              {lang === 'ar' ? `صفحة ${auditMeta.current_page} من ${auditMeta.last_page} (${auditMeta.total} حدث)` : `Page ${auditMeta.current_page} of ${auditMeta.last_page} (${auditMeta.total} events)`}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                disabled={auditMeta.current_page <= 1}
                onClick={() => setAuditPage(p => Math.max(1, p - 1))}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px',
                  border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)',
                  cursor: auditMeta.current_page <= 1 ? 'not-allowed' : 'pointer', opacity: auditMeta.current_page <= 1 ? 0.5 : 1
                }}
              >
                {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                <span>{lang === 'ar' ? 'السابق' : 'Prev'}</span>
              </button>
              <button
                type="button"
                disabled={auditMeta.current_page >= auditMeta.last_page}
                onClick={() => setAuditPage(p => Math.min(auditMeta.last_page, p + 1))}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px',
                  border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)',
                  cursor: auditMeta.current_page >= auditMeta.last_page ? 'not-allowed' : 'pointer', opacity: auditMeta.current_page >= auditMeta.last_page ? 0.5 : 1
                }}
              >
                <span>{lang === 'ar' ? 'التالي' : 'Next'}</span>
                {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
