import React from 'react';
import {
  Server,
  Cpu,
  HardDrive,
  Database,
  Gauge,
  GraduationCap,
  Users,
  Building2,
  UserCheck,
  Activity,
  Globe,
} from 'lucide-react';
import { InfoTooltip } from '../../../components/common/InfoTooltip';

const ROLE_UI = {
  student: { icon: Users, color: '#16A34A', bg: 'rgba(22, 163, 74, 0.12)' },
  teacher: { icon: GraduationCap, color: '#1588C7', bg: 'rgba(21, 136, 199, 0.12)' },
  center: { icon: Building2, color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.12)' },
  parent: { icon: UserCheck, color: '#D97706', bg: 'rgba(245, 158, 11, 0.14)' },
};

const BOTTLENECK_LABELS = {
  php_workers: { ar: 'المعالج وعمال PHP', en: 'CPU / PHP Workers' },
  database: { ar: 'اتصالات قاعدة البيانات', en: 'Database Pool' },
  memory: { ar: 'ذاكرة السيرفر (RAM)', en: 'Server RAM' },
};

export const ServerCapacityPanel = ({ telemetry, capacity, loading = false, lang = 'ar' }) => {
  const isAr = lang === 'ar';

  const maxConcurrent = Number(capacity?.maxConcurrentUsers ?? 0);
  const maxTotalPlatform = Number(capacity?.maxTotalPlatformUsers ?? 0);
  const totalRegisteredNow = Number(capacity?.totalRegisteredNow ?? 0);
  const onlineTotal = Number(capacity?.currentOnlineTotal ?? 0);
  const online5Min = Number(capacity?.currentOnline5Min ?? 0);
  const remainingConcurrent = Number(capacity?.remainingCapacity ?? 0);
  const utilPct = Math.min(100, Math.max(0, Number(capacity?.utilizationPct ?? 0)));
  const safeRps = Number(capacity?.safeRps ?? 0);
  const avgReqMs = Number(capacity?.avgRequestTimeMs ?? 0);
  const effectiveWorkers = Number(capacity?.effectiveWorkers ?? 1);
  const loadStatus = capacity?.loadStatus || 'healthy';
  const bottleneck = capacity?.bottleneck || 'php_workers';
  const roles = Array.isArray(capacity?.byRole) ? capacity.byRole : [];

  const statusMeta =
    loadStatus === 'critical'
      ? { label: isAr ? 'ضغط حرج' : 'Critical', color: '#FCA5A5', bg: 'rgba(239, 68, 68, 0.25)' }
      : loadStatus === 'high'
        ? { label: isAr ? 'ضغط مرتفع' : 'High', color: '#FDE68A', bg: 'rgba(245, 158, 11, 0.25)' }
        : loadStatus === 'moderate'
          ? { label: isAr ? 'ضغط متوسط' : 'Moderate', color: '#BAE6FD', bg: 'rgba(56, 189, 248, 0.22)' }
          : { label: isAr ? 'مستقر' : 'Healthy', color: '#BBF7D0', bg: 'rgba(34, 197, 94, 0.24)' };

  const bottleneckText = BOTTLENECK_LABELS[bottleneck]?.[isAr ? 'ar' : 'en'] || bottleneck;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* 1. Clean Dual-Capacity Hero: Total Platform Users + Concurrent Online Users */}
      <div
        style={{
          background: 'linear-gradient(135deg, #06254E 0%, #0C3B75 56%, #1588C7 100%)',
          borderRadius: '22px',
          padding: '24px 26px',
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {/* Total Platform Users Capacity (Non-Simultaneous) */}
          <div style={{ padding: '16px 18px', borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.11)', border: '1px solid rgba(255, 255, 255, 0.16)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '8px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: '800', color: 'rgba(255,255,255,0.88)' }}>
                <Globe size={15} color="#7DD3FC" />
                <span>{isAr ? 'سعة المنصة الإجمالية (غير متزامن)' : 'Total Platform Users Capacity'}</span>
              </span>
              <InfoTooltip
                light
                align="end"
                size={13}
                text={
                  isAr
                    ? `إجمالي الحسابات التي تتحملها المنصة (بافتراض ذروة تزامن 3%–8% حسب الفئة). المسجل حالياً: ${totalRegisteredNow.toLocaleString()} مستخدم.`
                    : `Total accounts supported across all roles (3%–8% peak concurrency). Currently registered: ${totalRegisteredNow.toLocaleString()}.`
                }
              />
            </div>

            <div style={{ fontSize: '30px', fontWeight: '900', letterSpacing: '-0.5px', color: '#FFFFFF' }}>
              {loading ? '...' : maxTotalPlatform.toLocaleString()}
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.8)', marginInlineStart: '6px' }}>
                {isAr ? 'مستخدم' : 'users'}
              </span>
            </div>

            <div style={{ marginTop: '6px', fontSize: '11.5px', color: '#BBF7D0', fontWeight: '700' }}>
              {isAr ? `مسجل حالياً: ${totalRegisteredNow.toLocaleString()}` : `Registered now: ${totalRegisteredNow.toLocaleString()}`}
            </div>
          </div>

          {/* Simultaneous Concurrent Online Users */}
          <div style={{ padding: '16px 18px', borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.11)', border: '1px solid rgba(255, 255, 255, 0.16)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '8px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: '800', color: 'rgba(255,255,255,0.88)' }}>
                <Gauge size={15} color="#86EFAC" />
                <span>{isAr ? 'المستخدمون المتزامنون (في نفس اللحظة)' : 'Simultaneous Concurrent Users'}</span>
              </span>
              <InfoTooltip
                light
                align="end"
                size={13}
                text={
                  isAr
                    ? `محسوبة بدقة على هاردوير السيرفر (${effectiveWorkers} Workers، متوسط استجابة ${avgReqMs}ms، سرعة آمنة ${safeRps} طلب/ث). المتاح للانضمام الآن: ${remainingConcurrent.toLocaleString()}.`
                    : `Computed from server hardware (${effectiveWorkers} workers, ${avgReqMs}ms avg latency, ${safeRps} safe req/s). Available right now: ${remainingConcurrent.toLocaleString()}.`
                }
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '30px', fontWeight: '900', letterSpacing: '-0.5px', color: '#FFFFFF' }}>
                {loading ? '...' : maxConcurrent.toLocaleString()}
              </span>
              <span style={{ padding: '3px 9px', borderRadius: '999px', fontSize: '11.5px', fontWeight: '800', backgroundColor: statusMeta.bg, color: statusMeta.color }}>
                {statusMeta.label} ({utilPct}%)
              </span>
            </div>

            <div style={{ marginTop: '6px', fontSize: '11.5px', color: 'rgba(255,255,255,0.84)', fontWeight: '700' }}>
              {isAr
                ? `متصل الآن: ${onlineTotal.toLocaleString()} (آخر 5د: ${online5Min.toLocaleString()})`
                : `Online now: ${onlineTotal.toLocaleString()} (5m: ${online5Min.toLocaleString()})`}
            </div>
          </div>
        </div>

        {/* Utilization Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'rgba(255,255,255,0.85)', marginBottom: '6px', fontWeight: '700' }}>
            <span>{isAr ? `الحد الحاكم: ${bottleneckText}` : `Bottleneck: ${bottleneckText}`}</span>
            <span>{utilPct}%</span>
          </div>
          <div style={{ height: '7px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.max(utilPct, onlineTotal > 0 ? 1.5 : 0)}%`,
                height: '100%',
                borderRadius: '999px',
                backgroundColor: loadStatus === 'critical' ? '#EF4444' : loadStatus === 'high' ? '#F59E0B' : '#34D399',
                transition: 'width 0.35s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Per-Role Capacity Cards (Concurrent + Total Non-Concurrent) */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '20px 22px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Activity size={18} color="var(--primary)" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
            {isAr ? 'استيعاب المنصة لكل رول' : 'Capacity by Role'}
          </h3>
          <InfoTooltip
            size={14}
            text={
              isAr
                ? 'يعرض لكل فئة: إجمالي الحسابات التي تستوعبها المنصة (غير متزامن)، وعدد المتزامنين في نفس اللحظة (مختلط أو منفرد).'
                : 'Shows total non-concurrent accounts supported and simultaneous concurrent capacity per role.'
            }
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(235px, 1fr))', gap: '14px' }}>
          {roles.map((r) => {
            const ui = ROLE_UI[r.role] || ROLE_UI.student;
            const RoleIcon = ui.icon;

            return (
              <div
                key={r.role}
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'absolute', top: 0, insetInline: 0, height: '3.5px', borderRadius: '16px 16px 0 0', backgroundColor: ui.color }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: ui.bg, color: ui.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RoleIcon size={18} />
                    </div>
                    <span style={{ fontSize: '14.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
                      {isAr ? r.labelAr : r.labelEn}
                    </span>
                  </div>
                  <InfoTooltip
                    align="end"
                    size={13}
                    text={
                      isAr
                        ? `أقصى تزامن منفرد: ${Number(r.maxStandaloneConcurrent ?? 0).toLocaleString()} في نفس اللحظة (متاح الآن: ${Number(r.remainingNow ?? 0).toLocaleString()}). معدل الطلبات: طلب كل ${r.thinkTimeSec}ث • نسبة الذروة: ${r.peakConcurrencyPct}%.`
                        : `Max standalone concurrent: ${Number(r.maxStandaloneConcurrent ?? 0).toLocaleString()} (available now: ${Number(r.remainingNow ?? 0).toLocaleString()}). 1 req/${r.thinkTimeSec}s • peak ratio ${r.peakConcurrencyPct}%.`
                    }
                  />
                </div>

                {/* Total Non-Simultaneous Capacity */}
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                    {isAr ? 'إجمالي بالمنصة (غير متزامن)' : 'Total Platform Users'}
                  </div>
                  <div style={{ fontSize: '23px', fontWeight: '900', color: 'var(--text-primary)' }}>
                    {Number(r.totalPlatformCapacity ?? 0).toLocaleString()}
                    <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', marginInlineStart: '5px' }}>
                      {isAr ? 'حساب' : 'accounts'}
                    </span>
                  </div>
                </div>

                {/* Concurrent + Live Footer */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '11.5px' }}>
                  <div>
                    <div style={{ color: 'var(--text-secondary)' }}>{isAr ? 'متزامن (مختلط)' : 'Concurrent'}</div>
                    <strong style={{ color: ui.color, fontSize: '13.5px' }}>
                      {Number(r.recommendedConcurrent ?? 0).toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-secondary)' }}>{isAr ? 'متصل / مسجل' : 'Online / Reg'}</div>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '13.5px' }}>
                      {Number(r.onlineNow ?? 0).toLocaleString()} / {Number(r.registeredCount ?? 0).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Compact Server Hardware Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
        {[
          {
            icon: Database,
            label: isAr ? 'قاعدة البيانات' : 'Database',
            val: telemetry ? `${telemetry.dbLatencyMs} ms` : '—',
            sub: telemetry
              ? `${String(telemetry.dbDriver || '').toUpperCase()} • ${telemetry.dbActiveConnections}/${telemetry.dbMaxConnections}`
              : '—',
            color: telemetry?.dbHealthy ? '#16A34A' : '#DC2626',
            info: isAr ? 'زمن استجابة قاعدة البيانات وعدد الاتصالات النشطة من الحد الأقصى.' : 'Live DB latency and active/max connections.',
          },
          {
            icon: Cpu,
            label: isAr ? 'المعالج والذاكرة' : 'CPU & RAM',
            val: telemetry ? `${telemetry.cpuCores} Cores • ${telemetry.osFreeRamGb}/${telemetry.osTotalRamGb} GB` : '—',
            sub: telemetry ? `RAM ${telemetry.osRamUsedPct}% • PHP ${telemetry.phpVersion}` : '—',
            color: 'var(--primary)',
            info: isAr ? 'أنوية المعالج والذاكرة المتاحة من إجمالي RAM السيرفر.' : 'Server CPU cores and free/total OS RAM.',
          },
          {
            icon: HardDrive,
            label: isAr ? 'القرص والتخزين' : 'Disk Storage',
            val: telemetry ? `${telemetry.diskFreeGb} / ${telemetry.diskTotalGb} GB` : '—',
            sub: telemetry ? `${telemetry.diskUsedPct}% • ${telemetry.storageFilesCount} ${isAr ? 'ملف' : 'files'}` : '—',
            color: (telemetry?.diskUsedPct ?? 0) >= 85 ? '#DC2626' : '#D97706',
            info: isAr ? 'المساحة الحرة على القرص وعدد الملفات المخزنة.' : 'Free disk space and stored files count.',
          },
          {
            icon: Server,
            label: isAr ? 'الكاش والطابور' : 'Cache & Queue',
            val: telemetry ? `${telemetry.cacheDriver} • ${telemetry.cacheLatencyMs}ms` : '—',
            sub: telemetry
              ? `${isAr ? 'مهام فاشلة:' : 'Failed:'} ${telemetry.queueFailedJobs}`
              : '—',
            color: (telemetry?.queueFailedJobs ?? 0) > 0 || !telemetry?.cacheHealthy ? '#DC2626' : '#6366F1',
            info: isAr ? 'محرك الكاش وزمن استجابته وعدد المهام الفاشلة.' : 'Cache driver latency and failed queue jobs.',
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '15px 16px',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                  <Icon size={14} color={card.color} />
                  <span>{card.label}</span>
                </span>
                <InfoTooltip size={12} align="end" text={card.info} />
              </div>
              <div style={{ fontSize: '17.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {loading ? '...' : card.val}
              </div>
              <div style={{ fontSize: '11.5px', fontWeight: '700', color: card.color }}>
                {card.sub}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
