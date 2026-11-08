import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { generateSplinePaths } from '../../../utils';
import {
  Activity,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  GraduationCap,
  Building2,
  Sparkles,
  Zap
} from 'lucide-react';

// Real-Time 24-Hour Traffic Data (Hourly buckets)
const HOURLY_ACTIVE_USERS = [
  { timeAr: '12 ص', timeEn: '12 AM', users: 820, students: 780, teachers: 36, centers: 4 },
  { timeAr: '3 ص', timeEn: '3 AM', users: 310, students: 295, teachers: 13, centers: 2 },
  { timeAr: '6 ص', timeEn: '6 AM', users: 650, students: 615, teachers: 31, centers: 4 },
  { timeAr: '9 ص', timeEn: '9 AM', users: 1840, students: 1720, teachers: 104, centers: 16 },
  { timeAr: '12 م', timeEn: '12 PM', users: 2480, students: 2340, teachers: 122, centers: 18 },
  { timeAr: '3 م', timeEn: '3 PM', users: 2950, students: 2810, teachers: 124, centers: 16 },
  { timeAr: '6 م', timeEn: '6 PM', users: 3720, students: 3540, teachers: 162, centers: 18 },
  { timeAr: '9 م', timeEn: '9 PM', users: 4350, students: 4160, teachers: 172, centers: 18, isPeak: true },
  { timeAr: '11 م', timeEn: '11 PM', users: 2840, students: 2710, teachers: 112, centers: 18, isCurrent: true }
];

// Weekly 7-Day Traffic Data (Daily buckets)
const WEEKLY_ACTIVE_USERS = [
  { timeAr: 'السبت', timeEn: 'Sat', users: 28200, students: 26900, teachers: 1252, centers: 48 },
  { timeAr: 'الأحد', timeEn: 'Sun', users: 31400, students: 30010, teachers: 1342, centers: 48 },
  { timeAr: 'الإثنين', timeEn: 'Mon', users: 29800, students: 28480, teachers: 1272, centers: 48 },
  { timeAr: 'الثلاثاء', timeEn: 'Tue', users: 32600, students: 31180, teachers: 1372, centers: 48 },
  { timeAr: 'الأربعاء', timeEn: 'Wed', users: 30500, students: 29160, teachers: 1292, centers: 48 },
  { timeAr: 'الخميس', timeEn: 'Thu', users: 34200, students: 32740, teachers: 1412, centers: 48, isPeak: true },
  { timeAr: 'الجمعة', timeEn: 'Fri', users: 27900, students: 26650, teachers: 1202, centers: 48, isCurrent: true }
];

export const AdminActiveUsersChart = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState('hourly'); // 'hourly' | 'weekly'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const rawData = activeTab === 'hourly' ? HOURLY_ACTIVE_USERS : WEEKLY_ACTIVE_USERS;
  const maxVal = activeTab === 'hourly' ? 5000 : 40000;
  const currentLiveUsers = 2840;

  // Chart dimensions & coordinates
  const chartWidth = 720;
  const chartHeight = 240;
  const axisLeft = 56;
  const graphLeft = 90;
  const graphRight = chartWidth - 36;
  const paddingTop = 36;
  const paddingBottom = 46;
  const baseline = chartHeight - paddingBottom;

  const points = rawData.map((item, idx) => {
    const xStep = (graphRight - graphLeft) / (rawData.length - 1);
    const x = graphLeft + idx * xStep;
    const yRatio = item.users / maxVal;
    const y = baseline - yRatio * (baseline - paddingTop);
    return { ...item, x, y };
  });

  const { linePath, areaPath } = generateSplinePaths(points, baseline);

  const yTicks = activeTab === 'hourly'
    ? [5000, 4000, 3000, 2000, 1000, 0]
    : [40000, 30000, 20000, 10000, 0];

  const themeAccent = 'var(--primary, #1588C7)';
  const themeLightAccent = 'var(--primary-light, #5CB6DB)';
  const themeGridStroke = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.08)';
  const themeAxisFill = isDark ? '#94A3B8' : '#64748B';

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points.find(p => p.isCurrent) || points[points.length - 1];

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
        overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease'
      }}
    >
      {/* ── Top Header & Filter Controls ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              backgroundColor: 'rgba(21, 136, 199, 0.12)',
              border: '1px solid rgba(21, 136, 199, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <Activity size={18} />
            </div>

            <h3 style={{
              margin: 0,
              fontSize: '17px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading), var(--font-arabic)'
            }}>
              {isAr ? 'حركة ونشاط المستخدمين اللحظي بالمنصة' : 'Real-Time Active Users & Traffic'}
            </h3>

            {/* Live Indicator Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: 'rgba(21, 136, 199, 0.1)',
              border: '1px solid rgba(21, 136, 199, 0.25)',
              color: 'var(--primary)',
              fontSize: '12px',
              fontWeight: '800'
            }}>
              <span className="live-pulse-dot" style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                boxShadow: '0 0 10px rgba(21, 136, 199, 0.8)',
                display: 'inline-block'
              }} />
              <span>{isAr ? `مباشر الآن: ${currentLiveUsers.toLocaleString()} مستخدم` : `Live Now: ${currentLiveUsers.toLocaleString()} online`}</span>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            {isAr
              ? 'متابعة حية لتوزيع الطلاب والمعلمين ومسؤولي السناتر المتواجدين على خوادم المنصة'
              : 'Real-time telemetry of concurrent students, tutors, and learning center staff across clusters'}
          </p>
        </div>

        {/* View Mode Switcher (Hourly vs Weekly) */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-subtle, #f1f5f9)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => { setActiveTab('hourly'); setHoveredIndex(null); }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'hourly' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'hourly' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {isAr ? 'ساعات اليوم (24h)' : 'Today (24h)'}
          </button>
          <button
            onClick={() => { setActiveTab('weekly'); setHoveredIndex(null); }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'weekly' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'weekly' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {isAr ? 'آخر 7 أيام (أسبوعي)' : 'Last 7 Days'}
          </button>
        </div>
      </div>

      {/* ── Interactive SVG Area Spline Visualizer ── */}
      <div style={{ position: 'relative', width: '100%', height: '240px' }}>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
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

          {/* Y-Axis Label */}
          <text
            x={axisLeft - 10}
            y={paddingTop - 14}
            textAnchor="end"
            fill={themeLightAccent}
            fontSize="10.5"
            fontFamily="var(--font-arabic)"
            fontWeight="800"
          >
            {isAr ? 'المستخدمين' : 'Users'}
          </text>

          {/* Y-Axis Horizontal Dashed Grid Lines */}
          {yTicks.map((tick) => {
            const yRatio = tick / maxVal;
            const y = baseline - yRatio * (baseline - paddingTop);
            return (
              <g key={tick}>
                <text
                  x={axisLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill={themeAxisFill}
                  fontSize="10.5"
                  fontFamily="var(--font-heading), var(--font-latin)"
                  fontWeight="600"
                >
                  {tick >= 1000 ? `${tick / 1000}k` : tick}
                </text>
                <line
                  x1={axisLeft}
                  y1={y}
                  x2={graphRight}
                  y2={y}
                  stroke={themeGridStroke}
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Spline Area Fill */}
          <path d={areaPath} fill="url(#adminActiveAreaGrad)" />

          {/* Spline Line */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & Interactive Nodes */}
          {points.map((p, idx) => {
            const isHovered = hoveredIndex === idx;
            const isCurrent = p.isCurrent;
            const isPeak = p.isPeak;

            return (
              <g key={idx}>
                {/* Vertical Guideline */}
                <line
                  x1={p.x}
                  y1={p.y + 6}
                  x2={p.x}
                  y2={baseline + 5}
                  stroke={isCurrent || isPeak || isHovered ? 'var(--primary)' : themeGridStroke}
                  strokeDasharray="3 3"
                  strokeWidth={isCurrent || isPeak || isHovered ? '1.5' : '1'}
                  opacity={isCurrent || isPeak || isHovered ? 0.75 : 0.35}
                />

                {/* Point Bubble Value */}
                <g>
                  <rect
                    x={p.x - 22}
                    y={p.y - 25}
                    width="44"
                    height="18"
                    rx="6"
                    fill={isPeak ? 'var(--primary)' : isCurrent ? 'var(--primary-light, #5CB6DB)' : (isDark ? '#1E293B' : '#F1F5F9')}
                    stroke={isPeak || isCurrent ? 'var(--primary)' : (isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.12)')}
                    strokeWidth="1"
                  />
                  <text
                    x={p.x}
                    y={p.y - 12}
                    textAnchor="middle"
                    fill={isPeak || isCurrent ? '#FFFFFF' : (isDark ? '#E2E8F0' : '#1E293B')}
                    fontSize="10"
                    fontWeight="800"
                    fontFamily="var(--font-heading)"
                  >
                    {p.users >= 1000 ? `${(p.users / 1000).toFixed(1)}k` : p.users}
                  </text>
                </g>

                {/* Outer Glow Ring on Hover or Current */}
                {(isHovered || isCurrent || isPeak) && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 10 : 8}
                    fill="none"
                    stroke={isPeak ? 'var(--primary)' : 'var(--primary-light)'}
                    strokeWidth="2"
                    opacity="0.8"
                    filter="url(#adminGlow)"
                  />
                )}

                {/* Main Circle Node */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 5.5 : 4}
                  fill={isPeak ? 'var(--primary)' : isCurrent ? 'var(--primary-light)' : (isDark ? '#0F172A' : '#FFFFFF')}
                  stroke={isPeak ? 'var(--primary)' : isCurrent ? 'var(--primary-light)' : 'var(--primary)'}
                  strokeWidth="2.5"
                />

                {/* Invisible Hover Target */}
                <rect
                  x={p.x - 18}
                  y={paddingTop}
                  width="36"
                  height={baseline - paddingTop + 20}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* X-Axis Label */}
                <text
                  x={p.x}
                  y={baseline + 20}
                  textAnchor="middle"
                  fill={isCurrent ? 'var(--primary)' : isPeak ? 'var(--text-primary)' : themeAxisFill}
                  fontSize="11"
                  fontWeight={isCurrent || isPeak ? '800' : '600'}
                  fontFamily={isAr ? 'var(--font-arabic)' : 'var(--font-heading)'}
                >
                  {isAr ? p.timeAr : p.timeEn}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Active Point Details Card (Breakdown by Students, Teachers, Centers) ── */}
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
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: activePoint.isPeak ? 'var(--primary)' : 'var(--primary-light)',
            boxShadow: '0 0 8px rgba(21, 136, 199, 0.6)'
          }} />
          <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {isAr
              ? `تفاصيل نشاط توقيت (${activePoint.timeAr}): ${activePoint.users.toLocaleString()} متواجد`
              : `Activity at (${activePoint.timeEn}): ${activePoint.users.toLocaleString()} online`}
          </span>
          {activePoint.isPeak && (
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(21, 136, 199, 0.15)',
              color: 'var(--primary)'
            }}>
              {isAr ? '🔥 ذروة اليوم' : '🔥 Daily Peak'}
            </span>
          )}
        </div>

        {/* Breakdown chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Students */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px'
          }}>
            <GraduationCap size={14} color="var(--primary)" />
            <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'الطلاب:' : 'Students:'}</span>
            <strong style={{ color: 'var(--primary)' }}>{activePoint.students.toLocaleString()}</strong>
          </div>

          {/* Teachers */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px'
          }}>
            <Users size={14} color="var(--primary-light, #5CB6DB)" />
            <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'المعلمون:' : 'Tutors:'}</span>
            <strong style={{ color: 'var(--primary-light, #5CB6DB)' }}>{activePoint.teachers.toLocaleString()}</strong>
          </div>

          {/* Centers */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px'
          }}>
            <Building2 size={14} color="var(--color-brand-dark, #06254E)" />
            <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'السناتر:' : 'Centers:'}</span>
            <strong style={{ color: 'var(--text-primary)' }}>{activePoint.centers.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes livePulseDot {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.5;
          }
        }
        .live-pulse-dot {
          animation: livePulseDot 2s infinite ease-in-out;
        }
        .admin-active-users-card:hover {
          box-shadow: 0 10px 28px rgba(21, 136, 199, 0.08) !important;
          border-color: rgba(21, 136, 199, 0.25) !important;
        }
      `}</style>
    </div>
  );
};
