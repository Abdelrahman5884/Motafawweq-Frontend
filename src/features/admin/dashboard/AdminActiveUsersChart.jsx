import React, { useState, useEffect, memo, useMemo } from 'react';
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
  { timeAr: '00:00', timeEn: '00:00', users: 0, students: 0, teachers: 0, centers: 0, isCurrent: false },
  { timeAr: 'الآن', timeEn: 'Now', users: 0, students: 0, teachers: 0, centers: 0, isCurrent: true }
];

export const AdminActiveUsersChart = memo(() => {
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

  const rawData = useMemo(
    () => (Array.isArray(traffic?.series) && traffic.series.length >= 2 ? traffic.series : FALLBACK_SERIES),
    [traffic]
  );

  const rawMax = Math.max(...rawData.map(i => Number(i.users || 0)), 1);
  const maxVal = Math.max(4, Math.ceil((rawMax * 1.25) / 4) * 4);
  const currentLiveUsers = Number(traffic?.currentLiveUsers || 0);

  const chartWidth = 760;
  const chartHeight = 230;
  const axisLeft = 52;
  const graphLeft = 84;
  const graphRight = chartWidth - 34;
  const paddingTop = 38;
  const paddingBottom = 42;
  const baseline = chartHeight - paddingBottom;

  const points = useMemo(() => rawData.map((item, idx) => {
    const xStep = (graphRight - graphLeft) / Math.max(1, rawData.length - 1);
    const x = graphLeft + idx * xStep;
    const yRatio = Number(item.users || 0) / maxVal;
    const y = baseline - yRatio * (baseline - paddingTop);
    return { ...item, x, y };
  }), [rawData, maxVal, graphLeft, graphRight, baseline, paddingTop]);

  const { linePath, areaPath } = useMemo(() => generateSplinePaths(points, baseline), [points, baseline]);
  const yTicks = [maxVal, Math.round(maxVal * 0.75), Math.round(maxVal * 0.5), Math.round(maxVal * 0.25), 0];

  const themeGridStroke = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.08)';
  const themeAxisFill = isDark ? '#94A3B8' : '#64748B';

  const activePoint = hoveredIndex !== null && points[hoveredIndex]
    ? points[hoveredIndex]
    : (points.find(p => p.isCurrent) || points[points.length - 1]);

  return (
    <div
      className="admin-active-users-card"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '22px',
        padding: '22px 24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '11px',
              backgroundColor: 'rgba(21, 136, 199, 0.12)', border: '1px solid rgba(21, 136, 199, 0.24)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
            }}>
              <Activity size={18} />
            </div>

            <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {isAr ? 'حركة ونشاط المستخدمين اللحظي' : 'Real-Time Active Traffic'}
            </h3>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '4px 12px',
              borderRadius: '999px', backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.28)', color: '#059669', fontSize: '12px', fontWeight: '800'
            }}>
              <span className="live-pulse-dot" style={{
                width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981',
                boxShadow: '0 0 8px rgba(16, 185, 129, 0.7)', display: 'inline-block'
              }} />
              <span>{isAr ? `مباشر الآن: ${currentLiveUsers.toLocaleString()}` : `Live Now: ${currentLiveUsers.toLocaleString()}`}</span>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
            {isAr
              ? 'رصد لحظي لتوزّع الطلاب والمعلمين وإدارات السناتر المتواجدين على الخوادم'
              : 'Real-time concurrency telemetry across students, teachers, and center staff'}
          </p>
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px',
          borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)'
        }}>
          <button
            type="button"
            onClick={() => { setActiveTab('hourly'); setHoveredIndex(null); }}
            style={{
              padding: '6px 14px', borderRadius: '8px', border: 'none',
              backgroundColor: activeTab === 'hourly' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'hourly' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.15s ease'
            }}
          >
            {isAr ? 'ساعات اليوم (24h)' : 'Today (24h)'}
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('weekly'); setHoveredIndex(null); }}
            style={{
              padding: '6px 14px', borderRadius: '8px', border: 'none',
              backgroundColor: activeTab === 'weekly' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'weekly' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.15s ease'
            }}
          >
            {isAr ? 'آخر 7 أيام' : 'Last 7 Days'}
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
          <defs>
            <linearGradient id="adminActiveAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1588C7" stopOpacity={isDark ? 0.34 : 0.24} />
              <stop offset="90%" stopColor="#5CB6DB" stopOpacity={0.03} />
              <stop offset="100%" stopColor="#1588C7" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {yTicks.map((tick, idx) => {
            const yRatio = tick / maxVal;
            const y = baseline - yRatio * (baseline - paddingTop);
            return (
              <g key={idx}>
                <text x={axisLeft - 8} y={y + 4} textAnchor="end" fill={themeAxisFill} fontSize="10.5" fontFamily="var(--font-heading)" fontWeight="600">
                  {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
                </text>
                <line x1={axisLeft} y1={y} x2={graphRight} y2={y} stroke={themeGridStroke} strokeDasharray="4 4" strokeWidth="1" />
              </g>
            );
          })}

          <path d={areaPath} fill="url(#adminActiveAreaGrad)" />
          <path d={linePath} fill="none" stroke="#1588C7" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p, idx) => {
            const isHovered = hoveredIndex === idx;
            const isCurrent = p.isCurrent;
            const isPeak = p.isPeak;
            return (
              <g key={idx}>
                <line
                  x1={p.x} y1={p.y + 6} x2={p.x} y2={baseline + 4}
                  stroke={isCurrent || isPeak || isHovered ? '#1588C7' : themeGridStroke}
                  strokeDasharray="3 3" strokeWidth={isCurrent || isPeak || isHovered ? '1.4' : '1'}
                  opacity={isCurrent || isPeak || isHovered ? 0.7 : 0.32}
                />

                <rect
                  x={p.x - 21} y={p.y - 25} width="42" height="18" rx="6"
                  fill={isPeak ? '#1588C7' : isCurrent ? '#10B981' : (isDark ? '#102A4C' : '#F1F5F9')}
                  stroke={isPeak ? '#1588C7' : isCurrent ? '#10B981' : (isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(15, 23, 42, 0.1)')}
                  strokeWidth="1"
                />
                <text x={p.x} y={p.y - 12.5} textAnchor="middle" fill={isPeak || isCurrent ? '#FFFFFF' : (isDark ? '#E2E8F0' : '#1E293B')} fontSize="10" fontWeight="800" fontFamily="var(--font-heading)">
                  {p.users >= 1000 ? `${(p.users / 1000).toFixed(1)}k` : p.users}
                </text>

                {(isHovered || isCurrent || isPeak) && (
                  <circle cx={p.x} cy={p.y} r={isHovered ? 9 : 7} fill="none" stroke={isCurrent ? '#10B981' : '#1588C7'} strokeWidth="2" opacity="0.65" />
                )}

                <circle
                  cx={p.x} cy={p.y} r={isHovered ? 5.5 : 4.2}
                  fill={isCurrent ? '#10B981' : isPeak ? '#1588C7' : (isDark ? '#081D37' : '#FFFFFF')}
                  stroke={isCurrent ? '#10B981' : '#1588C7'} strokeWidth="2.3"
                />

                <rect
                  x={p.x - 20} y={paddingTop} width="40" height={baseline - paddingTop + 20}
                  fill="transparent" style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                <text x={p.x} y={baseline + 20} textAnchor="middle" fill={isCurrent ? '#10B981' : isPeak ? 'var(--primary)' : themeAxisFill} fontSize="11" fontWeight={isCurrent || isPeak ? '800' : '600'}>
                  {isAr ? p.timeAr : p.timeEn}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {activePoint && (
        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '13px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <span style={{
              width: '9px', height: '9px', borderRadius: '50%',
              backgroundColor: activePoint.isCurrent ? '#10B981' : 'var(--primary)'
            }} />
            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {isAr
                ? `نقطة الرصد (${activePoint.timeAr}): ${Number(activePoint.users || 0).toLocaleString()} متواجد`
                : `Snapshot (${activePoint.timeEn}): ${Number(activePoint.users || 0).toLocaleString()} online`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 11px', borderRadius: '9px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
              <GraduationCap size={14} color="#1588C7" />
              <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'الطلاب:' : 'Students:'}</span>
              <strong style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{Number(activePoint.students || 0).toLocaleString()}</strong>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 11px', borderRadius: '9px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
              <Users size={14} color="#38BDF8" />
              <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'المعلمون:' : 'Tutors:'}</span>
              <strong style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{Number(activePoint.teachers || 0).toLocaleString()}</strong>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 11px', borderRadius: '9px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
              <Building2 size={14} color="#10B981" />
              <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'السناتر:' : 'Centers:'}</span>
              <strong style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{Number(activePoint.centers || 0).toLocaleString()}</strong>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes livePulseDot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.35); opacity: 0.55; } }
        .live-pulse-dot { animation: livePulseDot 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
});

AdminActiveUsersChart.displayName = 'AdminActiveUsersChart';
