import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { generateSplinePaths } from '../../../utils';
import { adminApi } from '../../../services/adminApi';
import {
  Activity,
  Users,
  GraduationCap,
  Building2
} from 'lucide-react';

const FALLBACK_SERIES = [
  { timeAr: '—', timeEn: '—', users: 0, students: 0, teachers: 0, centers: 0, isCurrent: true },
  { timeAr: '—', timeEn: '—', users: 0, students: 0, teachers: 0, centers: 0 }
];

export const AdminActiveUsersChart = () => {
  const { lang } = useLanguage();
  const { isDark } = useTheme();
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState('hourly');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [traffic, setTraffic] = useState(null);

  useEffect(() => {
    let active = true;
    adminApi.dashboard.getActiveUsers(activeTab)
      .then((res) => {
        if (active && res?.data) {
          setTraffic(res.data);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, [activeTab]);

  const rawData = Array.isArray(traffic?.series) && traffic.series.length >= 2
    ? traffic.series
    : FALLBACK_SERIES;

  const rawMax = Math.max(...rawData.map(i => Number(i.users || 0)), 1);
  const maxVal = Math.max(4, Math.ceil((rawMax * 1.25) / 4) * 4);
  const currentLiveUsers = Number(traffic?.currentLiveUsers || 0);

  const chartWidth = 720;
  const chartHeight = 240;
  const axisLeft = 56;
  const graphLeft = 90;
  const graphRight = chartWidth - 36;
  const paddingTop = 36;
  const paddingBottom = 46;
  const baseline = chartHeight - paddingBottom;

  const points = rawData.map((item, idx) => {
    const xStep = (graphRight - graphLeft) / Math.max(1, rawData.length - 1);
    const x = graphLeft + idx * xStep;
    const yRatio = Number(item.users || 0) / maxVal;
    const y = baseline - yRatio * (baseline - paddingTop);
    return { ...item, x, y };
  });

  const { linePath, areaPath } = generateSplinePaths(points, baseline);
  const yTicks = [maxVal, Math.round(maxVal * 0.75), Math.round(maxVal * 0.5), Math.round(maxVal * 0.25), 0];

  const themeLightAccent = 'var(--primary-light, #5CB6DB)';
  const themeGridStroke = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.08)';
  const themeAxisFill = isDark ? '#94A3B8' : '#64748B';

  const activePoint = hoveredIndex !== null && points[hoveredIndex]
    ? points[hoveredIndex]
    : (points.find(p => p.isCurrent) || points[points.length - 1]);

  return (
    <div
      className="admin-active-users-card"
      style={{
        backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '10px',
              backgroundColor: 'rgba(21, 136, 199, 0.12)', border: '1px solid rgba(21, 136, 199, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
            }}>
              <Activity size={18} />
            </div>

            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {isAr ? 'حركة ونشاط المستخدمين اللحظي بالمنصة' : 'Real-Time Active Users & Traffic'}
            </h3>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '4px 12px',
              borderRadius: '20px', backgroundColor: 'rgba(21, 136, 199, 0.1)',
              border: '1px solid rgba(21, 136, 199, 0.25)', color: 'var(--primary)', fontSize: '12px', fontWeight: '800'
            }}>
              <span className="live-pulse-dot" style={{
                width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)',
                boxShadow: '0 0 10px rgba(21, 136, 199, 0.8)', display: 'inline-block'
              }} />
              <span>{isAr ? `مباشر الآن: ${currentLiveUsers.toLocaleString()} مستخدم` : `Live Now: ${currentLiveUsers.toLocaleString()} online`}</span>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            {isAr
              ? 'متابعة حية لتوزيع الطلاب والمعلمين ومسؤولي السناتر المتواجدين على خوادم المنصة'
              : 'Real-time telemetry of concurrent students, tutors, and learning center staff'}
          </p>
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px',
          borderRadius: '12px', backgroundColor: 'var(--bg-subtle, #f1f5f9)', border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => { setActiveTab('hourly'); setHoveredIndex(null); }}
            style={{
              padding: '6px 14px', borderRadius: '8px', border: 'none',
              backgroundColor: activeTab === 'hourly' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'hourly' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12px', fontWeight: '800', cursor: 'pointer'
            }}
          >
            {isAr ? 'ساعات اليوم (24h)' : 'Today (24h)'}
          </button>
          <button
            onClick={() => { setActiveTab('weekly'); setHoveredIndex(null); }}
            style={{
              padding: '6px 14px', borderRadius: '8px', border: 'none',
              backgroundColor: activeTab === 'weekly' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'weekly' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12px', fontWeight: '800', cursor: 'pointer'
            }}
          >
            {isAr ? 'آخر 7 أيام (أسبوعي)' : 'Last 7 Days'}
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '240px' }}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="adminActiveAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1588C7" stopOpacity={isDark ? 0.35 : 0.28} />
              <stop offset="90%" stopColor="#5CB6DB" stopOpacity={0.03} />
              <stop offset="100%" stopColor="#1588C7" stopOpacity={0.0} />
            </linearGradient>
            <filter id="adminGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#1588C7" floodOpacity={0.6} />
            </filter>
          </defs>

          <text x={axisLeft - 10} y={paddingTop - 14} textAnchor="end" fill={themeLightAccent} fontSize="10.5" fontFamily="var(--font-arabic)" fontWeight="800">
            {isAr ? 'المستخدمين' : 'Users'}
          </text>

          {yTicks.map((tick, idx) => {
            const yRatio = tick / maxVal;
            const y = baseline - yRatio * (baseline - paddingTop);
            return (
              <g key={idx}>
                <text x={axisLeft - 10} y={y + 4} textAnchor="end" fill={themeAxisFill} fontSize="10.5" fontFamily="var(--font-heading)" fontWeight="600">
                  {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
                </text>
                <line x1={axisLeft} y1={y} x2={graphRight} y2={y} stroke={themeGridStroke} strokeDasharray="4 4" strokeWidth="1" />
              </g>
            );
          })}

          <path d={areaPath} fill="url(#adminActiveAreaGrad)" />
          <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p, idx) => {
            const isHovered = hoveredIndex === idx;
            const isCurrent = p.isCurrent;
            const isPeak = p.isPeak;
            return (
              <g key={idx}>
                <line
                  x1={p.x} y1={p.y + 6} x2={p.x} y2={baseline + 5}
                  stroke={isCurrent || isPeak || isHovered ? 'var(--primary)' : themeGridStroke}
                  strokeDasharray="3 3" strokeWidth={isCurrent || isPeak || isHovered ? '1.5' : '1'}
                  opacity={isCurrent || isPeak || isHovered ? 0.75 : 0.35}
                />
                <g>
                  <rect
                    x={p.x - 22} y={p.y - 25} width="44" height="18" rx="6"
                    fill={isPeak ? 'var(--primary)' : isCurrent ? 'var(--primary-light, #5CB6DB)' : (isDark ? '#1E293B' : '#F1F5F9')}
                    stroke={isPeak || isCurrent ? 'var(--primary)' : (isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.12)')}
                    strokeWidth="1"
                  />
                  <text x={p.x} y={p.y - 12} textAnchor="middle" fill={isPeak || isCurrent ? '#FFFFFF' : (isDark ? '#E2E8F0' : '#1E293B')} fontSize="10" fontWeight="800" fontFamily="var(--font-heading)">
                    {p.users >= 1000 ? `${(p.users / 1000).toFixed(1)}k` : p.users}
                  </text>
                </g>

                {(isHovered || isCurrent || isPeak) && (
                  <circle cx={p.x} cy={p.y} r={isHovered ? 10 : 8} fill="none" stroke={isPeak ? 'var(--primary)' : 'var(--primary-light)'} strokeWidth="2" opacity="0.8" filter="url(#adminGlow)" />
                )}

                <circle
                  cx={p.x} cy={p.y} r={isHovered ? 5.5 : 4}
                  fill={isPeak ? 'var(--primary)' : isCurrent ? 'var(--primary-light)' : (isDark ? '#0F172A' : '#FFFFFF')}
                  stroke={isPeak ? 'var(--primary)' : isCurrent ? 'var(--primary-light)' : 'var(--primary)'} strokeWidth="2.5"
                />

                <rect
                  x={p.x - 18} y={paddingTop} width="36" height={baseline - paddingTop + 20}
                  fill="transparent" style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                <text x={p.x} y={baseline + 20} textAnchor="middle" fill={isCurrent ? 'var(--primary)' : isPeak ? 'var(--text-primary)' : themeAxisFill} fontSize="11" fontWeight={isCurrent || isPeak ? '800' : '600'}>
                  {isAr ? p.timeAr : p.timeEn}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {activePoint && (
        <div style={{
          backgroundColor: 'var(--bg-subtle, #f8fafc)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              backgroundColor: activePoint.isPeak ? 'var(--primary)' : 'var(--primary-light)'
            }} />
            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {isAr
                ? `تفاصيل نشاط (${activePoint.timeAr}): ${Number(activePoint.users || 0).toLocaleString()} متواجد`
                : `Activity at (${activePoint.timeEn}): ${Number(activePoint.users || 0).toLocaleString()} online`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '10px', backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
              <GraduationCap size={14} color="var(--primary)" />
              <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'الطلاب:' : 'Students:'}</span>
              <strong style={{ color: 'var(--primary)' }}>{Number(activePoint.students || 0).toLocaleString()}</strong>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '10px', backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
              <Users size={14} color="var(--primary-light, #5CB6DB)" />
              <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'المعلمون:' : 'Tutors:'}</span>
              <strong style={{ color: 'var(--primary-light, #5CB6DB)' }}>{Number(activePoint.teachers || 0).toLocaleString()}</strong>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '10px', backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
              <Building2 size={14} color="var(--color-brand-dark, #06254E)" />
              <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'السناتر:' : 'Centers:'}</span>
              <strong style={{ color: 'var(--text-primary)' }}>{Number(activePoint.centers || 0).toLocaleString()}</strong>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes livePulseDot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.5; } }
        .live-pulse-dot { animation: livePulseDot 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};
