import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Bug,
  Terminal,
  ShieldAlert,
  Clock,
  RotateCcw,
  Trash2,
  Activity,
} from 'lucide-react';
import { InfoTooltip } from '../../../components/common/InfoTooltip';

export const SystemIssuesPanel = ({
  issues,
  loading = false,
  busyJobId = null,
  flushingJobs = false,
  lang = 'ar',
  onRetryFailedJob,
  onDeleteFailedJob,
  onFlushFailedJobs,
}) => {
  const isAr = lang === 'ar';
  const services = Array.isArray(issues?.services) ? issues.services : [];
  const alerts = Array.isArray(issues?.alerts) ? issues.alerts : [];
  const failedJobs = Array.isArray(issues?.failedJobsList) ? issues.failedJobsList : [];
  const recentErrors = Array.isArray(issues?.recentErrors) ? issues.recentErrors : [];

  const serviceStatusColor = (st) => {
    if (st === 'critical') return { dot: '#DC2626', bg: 'rgba(220, 38, 38, 0.08)', text: '#B91C1C' };
    if (st === 'warning') return { dot: '#D97706', bg: 'rgba(245, 158, 11, 0.1)', text: '#B45309' };
    return { dot: '#16A34A', bg: 'rgba(22, 163, 74, 0.08)', text: '#15803D' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* 1. Live Service Health Strip */}
      {services.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '18px 20px',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Activity size={17} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {isAr ? 'فحص الخدمات الحية' : 'Live Services Health'}
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '10px' }}>
            {services.map((svc) => {
              const st = serviceStatusColor(svc.status);
              return (
                <div
                  key={svc.key}
                  style={{
                    padding: '11px 13px',
                    borderRadius: '12px',
                    backgroundColor: st.bg,
                    border: `1px solid ${st.dot}33`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: st.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', fontWeight: '900', color: st.text }}>
                      {isAr ? svc.nameAr : svc.nameEn}
                    </span>
                  </div>
                  <div dir="ltr" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontWeight: '700', textAlign: 'left' }}>
                    {svc.detail}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Active System Alerts */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '20px 22px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color={alerts.length > 0 ? '#DC2626' : '#16A34A'} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {isAr ? 'المشاكل النشطة' : 'Active Issues'}
            </h3>
            <InfoTooltip
              size={14}
              text={
                isAr
                  ? 'رصد مباشر لمشاكل قاعدة البيانات، الكاش، المساحة، المهام الفاشلة، والضغط المرتفع على السيرفر.'
                  : 'Real-time checks for database, cache, disk space, failed jobs, and server overload.'
              }
            />
          </div>

          {alerts.length > 0 && (
            <span style={{ padding: '4px 10px', borderRadius: '999px', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#B91C1C', fontSize: '12px', fontWeight: '800' }}>
              {alerts.length} {isAr ? 'نشط' : 'active'}
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
            {isAr ? 'جاري فحص السيرفر...' : 'Running diagnostics...'}
          </div>
        ) : alerts.length === 0 ? (
          <div
            style={{
              padding: '18px',
              borderRadius: '14px',
              backgroundColor: 'rgba(22, 163, 74, 0.08)',
              border: '1px solid rgba(22, 163, 74, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#15803D',
              fontSize: '13.5px',
              fontWeight: '800',
            }}
          >
            <CheckCircle2 size={20} />
            <span>{isAr ? 'لا توجد مشاكل نشطة — جميع الخدمات تعمل بشكل سليم.' : 'No active issues — all services are healthy.'}</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {alerts.map((al) => {
              const isCrit = al.severity === 'critical';
              return (
                <div
                  key={al.code}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '14px',
                    backgroundColor: isCrit ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.1)',
                    border: `1px solid ${isCrit ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.35)'}`,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <ShieldAlert size={18} color={isCrit ? '#DC2626' : '#D97706'} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '900', color: isCrit ? '#991B1B' : '#92400E' }}>
                        {isAr ? al.titleAr : al.titleEn}
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', marginTop: '3px', lineHeight: 1.5 }}>
                        {isAr ? al.detailAr : al.detailEn}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '3px 9px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '800',
                      backgroundColor: isCrit ? '#DC2626' : '#D97706',
                      color: '#FFFFFF',
                    }}
                  >
                    {isCrit ? (isAr ? 'حرج' : 'CRITICAL') : (isAr ? 'تحذير' : 'WARNING')}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Actionable Failed Queue Jobs */}
      {failedJobs.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '20px 22px',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RotateCcw size={17} color="#D97706" />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {isAr ? `المهام الفاشلة (${failedJobs.length})` : `Failed Queue Jobs (${failedJobs.length})`}
              </h3>
              <InfoTooltip
                size={14}
                text={
                  isAr
                    ? 'مهام خلفية فشل تنفيذها (مثل إرسال البريد أو الإشعارات). يمكنك إعادة تشغيلها أو مسحها.'
                    : 'Background jobs that failed execution. Retry or delete individual jobs, or flush all.'
                }
              />
            </div>

            <button
              type="button"
              disabled={flushingJobs}
              onClick={onFlushFailedJobs}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 13px',
                borderRadius: '9px',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                backgroundColor: 'rgba(220, 38, 38, 0.08)',
                color: '#DC2626',
                fontSize: '12px',
                fontWeight: '800',
                cursor: flushingJobs ? 'wait' : 'pointer',
              }}
            >
              <Trash2 size={13} />
              <span>{flushingJobs ? (isAr ? 'جاري المسح...' : 'Flushing...') : (isAr ? 'مسح كل المهام الفاشلة' : 'Flush All')}</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {failedJobs.map((job) => {
              const isBusy = busyJobId === job.id;
              return (
                <div
                  key={job.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderInlineStart: '3.5px solid #D97706',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '7px',
                    opacity: isBusy ? 0.55 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>
                        #{job.id} • {job.jobName}
                      </span>
                      <span style={{ padding: '2px 7px', borderRadius: '6px', fontSize: '10.5px', fontWeight: '700', backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                        {job.queue}
                      </span>
                      <span dir="ltr" style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {job.failedAt}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onRetryFailedJob?.(job.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '5px 10px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          fontSize: '11.5px',
                          fontWeight: '800',
                          cursor: 'pointer',
                        }}
                      >
                        <RotateCcw size={12} />
                        <span>{isAr ? 'إعادة' : 'Retry'}</span>
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onDeleteFailedJob?.(job.id)}
                        title={isAr ? 'حذف' : 'Delete'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '5px 8px',
                          borderRadius: '8px',
                          border: '1px solid rgba(220, 38, 38, 0.25)',
                          backgroundColor: 'rgba(220, 38, 38, 0.06)',
                          color: '#DC2626',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div dir="ltr" style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', wordBreak: 'break-word', textAlign: 'left', lineHeight: 1.5 }}>
                    {job.error}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Exact Server Runtime Error Log */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '20px 22px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bug size={18} color="#DC2626" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {isAr ? 'أخطاء السيرفر المسجلة' : 'Server Runtime Errors'}
            </h3>
            <InfoTooltip
              size={14}
              text={
                isAr
                  ? 'أحدث أخطاء التشغيل الفعلية من سجل السيرفر (بدون اختبارات وبدون تسريب أي بيانات حساسة).'
                  : 'Latest real runtime server errors (test logs excluded, secrets redacted).'
              }
            />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
            {recentErrors.length} {isAr ? 'سجل' : 'entries'}
          </span>
        </div>

        {recentErrors.length === 0 ? (
          <div style={{ padding: '26px', textAlign: 'center', color: '#15803D', fontSize: '13px', fontWeight: '700' }}>
            {isAr ? 'سجل السيرفر نظيف — لا توجد أخطاء تشغيل حالياً.' : 'Server log is clean — no runtime errors.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentErrors.map((err) => {
              const isCrit = err.level === 'critical' || err.level === 'emergency' || err.level === 'alert';
              return (
                <div
                  key={err.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderInlineStart: `3.5px solid ${isCrit ? '#DC2626' : '#D97706'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '2px 7px', borderRadius: '6px', fontSize: '10.5px', fontWeight: '800', backgroundColor: isCrit ? 'rgba(220, 38, 38, 0.14)' : 'rgba(245, 158, 11, 0.16)', color: isCrit ? '#B91C1C' : '#B45309' }}>
                        {String(err.level || 'error').toUpperCase()}
                      </span>
                      {err.location && (
                        <span dir="ltr" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: '700' }}>
                          <Terminal size={11} />
                          {err.location}
                        </span>
                      )}
                    </div>

                    <span dir="ltr" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      <Clock size={11} />
                      {err.timestamp || '—'}
                    </span>
                  </div>

                  <div
                    dir="ltr"
                    style={{
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-primary)',
                      lineHeight: 1.55,
                      wordBreak: 'break-word',
                      textAlign: 'left',
                    }}
                  >
                    {err.message}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
