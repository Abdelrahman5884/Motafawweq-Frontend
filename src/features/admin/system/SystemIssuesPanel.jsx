import React, { useState } from 'react';
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
  Wrench,
  ChevronDown,
  ChevronUp,
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
  const [expandedTechIds, setExpandedTechIds] = useState({});

  const services = Array.isArray(issues?.services) ? issues.services : [];
  const alerts = Array.isArray(issues?.alerts) ? issues.alerts : [];
  const failedJobs = Array.isArray(issues?.failedJobsList) ? issues.failedJobsList : [];
  const recentErrors = Array.isArray(issues?.recentErrors) ? issues.recentErrors : [];

  const toggleTech = (key) => {
    setExpandedTechIds((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const serviceStatusColor = (st) => {
    if (st === 'critical') return { dot: '#DC2626', bg: 'rgba(220, 38, 38, 0.08)', text: '#B91C1C', labelAr: 'خلل', labelEn: 'Down' };
    if (st === 'warning') return { dot: '#D97706', bg: 'rgba(245, 158, 11, 0.1)', text: '#B45309', labelAr: 'تنبيه', labelEn: 'Warn' };
    return { dot: '#16A34A', bg: 'rgba(22, 163, 74, 0.08)', text: '#15803D', labelAr: 'سليم', labelEn: 'OK' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* 1. Top Issues Summary Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))', gap: '12px' }}>
        {[
          {
            labelAr: 'مشاكل حرجة',
            labelEn: 'Critical Issues',
            val: Number(issues?.criticalCount ?? 0),
            color: '#DC2626',
            bg: 'rgba(220, 38, 38, 0.08)',
          },
          {
            labelAr: 'تحذيرات',
            labelEn: 'Warnings',
            val: Number(issues?.warningCount ?? 0),
            color: '#D97706',
            bg: 'rgba(245, 158, 11, 0.1)',
          },
          {
            labelAr: 'مهام متوقفة',
            labelEn: 'Failed Jobs',
            val: Number(issues?.failedJobsCount ?? failedJobs.length),
            color: '#7C3AED',
            bg: 'rgba(124, 58, 237, 0.08)',
          },
          {
            labelAr: 'أخطاء السيرفر',
            labelEn: 'Server Errors',
            val: Number(issues?.recentErrorsCount ?? recentErrors.length),
            color: '#1588C7',
            bg: 'rgba(21, 136, 199, 0.08)',
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: kpi.val > 0 ? kpi.bg : 'var(--bg-surface)',
              border: `1px solid ${kpi.val > 0 ? `${kpi.color}33` : 'var(--border-subtle)'}`,
              borderRadius: '16px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-secondary)' }}>
              {isAr ? kpi.labelAr : kpi.labelEn}
            </span>
            <span style={{ fontSize: '22px', fontWeight: '900', color: kpi.val > 0 ? kpi.color : '#16A34A' }}>
              {loading ? '...' : kpi.val}
            </span>
          </div>
        ))}
      </div>

      {/* 2. Live Service Health Strip */}
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
              {isAr ? 'حالة خدمات السيرفر' : 'Server Services Status'}
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: st.dot, flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', fontWeight: '900', color: st.text }}>
                        {isAr ? svc.nameAr : svc.nameEn}
                      </span>
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: '800', color: st.text }}>
                      {isAr ? st.labelAr : st.labelEn}
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

      {/* 3. Active System Issues with Clear Arabic Solutions */}
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
              {isAr ? 'المشاكل النشطة وطريقة الحل' : 'Active Issues & Recommended Fix'}
            </h3>
            <InfoTooltip
              size={14}
              text={
                isAr
                  ? 'يعرض كل مشكلة نشطة في السيرفر الآن مع سببها الدقيق وخطوة الحل المباشرة.'
                  : 'Lists every active server issue with its exact cause and recommended fix.'
              }
            />
          </div>
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
            <span>{isAr ? 'لا توجد مشاكل نشطة — جميع خدمات السيرفر تعمل بكفاءة.' : 'No active issues — all server services are healthy.'}</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {alerts.map((al) => {
              const isCrit = al.severity === 'critical';
              return (
                <div
                  key={al.code}
                  style={{
                    padding: '16px 18px',
                    borderRadius: '15px',
                    backgroundColor: isCrit ? 'rgba(239, 68, 68, 0.06)' : 'rgba(245, 158, 11, 0.08)',
                    border: `1px solid ${isCrit ? 'rgba(239, 68, 68, 0.28)' : 'rgba(245, 158, 11, 0.32)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <ShieldAlert size={19} color={isCrit ? '#DC2626' : '#D97706'} style={{ marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '14.5px', fontWeight: '900', color: isCrit ? '#991B1B' : '#92400E' }}>
                          {isAr ? al.titleAr : al.titleEn}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '3px', lineHeight: 1.55 }}>
                          {isAr ? al.detailAr : al.detailEn}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '900',
                        backgroundColor: isCrit ? '#DC2626' : '#D97706',
                        color: '#FFFFFF',
                      }}
                    >
                      {isCrit ? (isAr ? 'مشكلة حرجة' : 'CRITICAL') : (isAr ? 'تحذير' : 'WARNING')}
                    </span>
                  </div>

                  {(al.solutionAr || al.solutionEn) && (
                    <div
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <Wrench size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span>
                        <strong style={{ color: 'var(--primary)' }}>{isAr ? 'الحل: ' : 'Fix: '}</strong>
                        {isAr ? al.solutionAr : al.solutionEn}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Actionable Failed Queue Jobs (Plain Arabic + Collapsible Technical Trace) */}
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
                {isAr ? `المهام الخلفية المتوقفة (${failedJobs.length})` : `Failed Queue Jobs (${failedJobs.length})`}
              </h3>
              <InfoTooltip
                size={14}
                text={
                  isAr
                    ? 'مهام خلفية مثل إرسال الإيميلات لم تكتمل. يمكنك إعادة تشغيلها بعد حل السبب أو مسحها.'
                    : 'Background jobs that failed. Retry after fixing the cause, or remove them.'
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
              const techKey = `job-${job.id}`;
              const isExpanded = Boolean(expandedTechIds[techKey]);

              return (
                <div
                  key={job.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderInlineStart: '4px solid #D97706',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    opacity: isBusy ? 0.55 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-primary)' }}>
                        {isAr ? (job.titleAr || job.jobName) : (job.titleEn || job.jobName)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '3px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        <span style={{ fontWeight: '800', color: 'var(--primary)' }}>#{job.id} • {job.jobName}</span>
                        <span>•</span>
                        <span dir="ltr" style={{ fontFamily: 'var(--font-mono)' }}>{job.failedAt}</span>
                      </div>
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
                          padding: '6px 11px',
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
                          padding: '6px 8px',
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

                  {(job.solutionAr || job.solutionEn) && (
                    <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Wrench size={13} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span>{isAr ? job.solutionAr : job.solutionEn}</span>
                    </div>
                  )}

                  <div>
                    <button
                      type="button"
                      onClick={() => toggleTech(techKey)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '7px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      <Terminal size={11} />
                      <span>{isExpanded ? (isAr ? 'إخفاء التفاصيل التقنية' : 'Hide technical details') : (isAr ? 'عرض التفاصيل التقنية' : 'Show technical details')}</span>
                      {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    {isExpanded && (
                      <div dir="ltr" style={{ marginTop: '8px', padding: '9px 11px', borderRadius: '9px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', wordBreak: 'break-word', textAlign: 'left', lineHeight: 1.5 }}>
                        {job.error}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Server Runtime Errors (Clear Arabic Summary + Collapsible Trace) */}
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
              {isAr ? 'سجل أخطاء السيرفر' : 'Server Runtime Errors'}
            </h3>
            <InfoTooltip
              size={14}
              text={
                isAr
                  ? 'أحدث الأخطاء الفعلية المسجلة في السيرفر مترجمة لسبب واضح وحل مقترح، مع إخفاء أي بيانات حساسة.'
                  : 'Latest runtime server errors with plain diagnosis and redacted technical traces.'
              }
            />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
            {recentErrors.length} {isAr ? 'سجل' : 'entries'}
          </span>
        </div>

        {recentErrors.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#15803D', fontSize: '13px', fontWeight: '800' }}>
            {isAr ? 'سجل السيرفر نظيف — لا توجد أخطاء تشغيل حالياً.' : 'Server log is clean — no runtime errors.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentErrors.map((err) => {
              const isCrit = err.level === 'critical' || err.level === 'emergency' || err.level === 'alert';
              const techKey = `err-${err.id}`;
              const isExpanded = Boolean(expandedTechIds[techKey]);

              return (
                <div
                  key={err.id}
                  style={{
                    padding: '13px 15px',
                    borderRadius: '13px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderInlineStart: `3.5px solid ${isCrit ? '#DC2626' : '#D97706'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '7px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '2px 7px', borderRadius: '6px', fontSize: '10.5px', fontWeight: '800', backgroundColor: isCrit ? 'rgba(220, 38, 38, 0.14)' : 'rgba(245, 158, 11, 0.16)', color: isCrit ? '#B91C1C' : '#B45309' }}>
                        {isCrit ? (isAr ? 'حرج' : 'CRITICAL') : (isAr ? 'خطأ' : 'ERROR')}
                      </span>
                      <span style={{ fontSize: '13.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
                        {isAr ? (err.titleAr || 'خطأ في السيرفر') : (err.titleEn || 'Server Error')}
                      </span>
                    </div>

                    <span dir="ltr" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      <Clock size={11} />
                      {err.timestamp || '—'}
                    </span>
                  </div>

                  {(err.solutionAr || err.solutionEn) && (
                    <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Wrench size={13} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span>{isAr ? err.solutionAr : err.solutionEn}</span>
                    </div>
                  )}

                  <div>
                    <button
                      type="button"
                      onClick={() => toggleTech(techKey)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '7px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      <Terminal size={11} />
                      <span>{isExpanded ? (isAr ? 'إخفاء التفاصيل التقنية' : 'Hide technical details') : (isAr ? 'التفاصيل التقنية' : 'Technical details')}</span>
                      {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    {isExpanded && (
                      <div dir="ltr" style={{ marginTop: '8px', padding: '9px 11px', borderRadius: '9px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', lineHeight: 1.55, wordBreak: 'break-word', textAlign: 'left' }}>
                        {err.message}
                      </div>
                    )}
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
