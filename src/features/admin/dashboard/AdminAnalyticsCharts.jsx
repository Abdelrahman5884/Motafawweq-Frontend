import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import {
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { generateSplinePaths } from '../../../utils';

// Weekly Platform Traffic & Active Users Data (Sat to Fri)
const WEEKLY_ADMIN_USERS_ACTIVITY = [
  { dayAr: 'السبت', dayEn: 'Sat', users: 18200, usersLabel: '18.2k', hours: 2100, isToday: false, topTopic: 'انطلاق مراجعات الشهر وبوابات السناتر' },
  { dayAr: 'الأحد', dayEn: 'Sun', users: 24500, usersLabel: '24.5k', hours: 2850, isToday: false, topTopic: 'جلسات المذاكرة التفاعلية بالذكاء الاصطناعي' },
  { dayAr: 'الإثنين', dayEn: 'Mon', users: 22100, usersLabel: '22.1k', hours: 2600, isToday: false, topTopic: 'تسليم واجبات كيمياء وفيزياء الثانوية' },
  { dayAr: 'الثلاثاء', dayEn: 'Tue', users: 27800, usersLabel: '27.8k', hours: 3240, isToday: false, topTopic: 'كويزات الأحياء وبنك أسئلة الوزارة' },
  { dayAr: 'الأربعاء', dayEn: 'Wed', users: 21400, usersLabel: '21.4k', hours: 2450, isToday: false, topTopic: 'معالجة التسجيلات الصوتية وحصص الأونلاين' },
  { dayAr: 'الخميس', dayEn: 'Thu', users: 34800, usersLabel: '34.8k', hours: 4120, isPeak: true, isToday: false, topTopic: 'ذروة تصفيات دوري كؤوس المتفوقين' },
  { dayAr: 'الجمعة', dayEn: 'Fri', users: 26200, usersLabel: '26.2k', hours: 3180, isToday: true, topTopic: 'المذاكرة الحرة وحل الامتحانات الشاملة' }
];

export const AdminAnalyticsCharts = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const isAr = lang === 'ar';
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  const themeAccent = '#1588C7';
  const totalUsersDisplay = '34.8K';
  const overallActivePct = 95.8;

  // Spline chart coordinates (viewBox: 680 x 230)
  const chartWidth = 680;
  const chartHeight = 230;
  const axisLeft = 56;
  const graphLeft = 88;
  const graphRight = chartWidth - 36;
  const paddingTop = 36;
  const paddingBottom = 46;
  const baseline = chartHeight - paddingBottom;
  const maxUsers = 40000;

  const points = WEEKLY_ADMIN_USERS_ACTIVITY.map((item, idx) => {
    const xStep = (graphRight - graphLeft) / (WEEKLY_ADMIN_USERS_ACTIVITY.length - 1);
    const x = graphLeft + idx * xStep;
    const yRatio = item.users / maxUsers;
    const y = baseline - yRatio * (baseline - paddingTop);
    return { ...item, x, y };
  });

  const { linePath, areaPath } = generateSplinePaths(points, baseline);
  const yTicks = [40000, 30000, 20000, 10000, 0];

  // Large Prominent Donut Gauge calculations
  const donutRadius = 60;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutDashOffset = donutCircumference - (overallActivePct / 100) * donutCircumference;

  const themeTrackStroke = isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--bg-subtle, #E2E8F0)';
  const themeGridStroke = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.08)';
  const themeAxisFill = isDark ? '#94A3B8' : '#64748B';

  return (
    <div style={{ marginBottom: '24px' }}>
      <div className="executive-charts-grid">
        {/* ── LEFT / MAIN COLUMN: CURVED SPLINE USER ACTIVITY GRAPH (MATCHING CENTER SCREENSHOT 100%) ── */}
        <div
          className="executive-card executive-chart-main center-interactive-card"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl, 18px)',
            border: '1px solid var(--border-subtle)',
            padding: '22px 24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            animation: 'adminChartEntrance 0.5s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both'
          }}
        >
          <div>
            {/* Header: All Platform Users */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{
                    fontSize: '16px',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    margin: 0,
                    fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-heading)'
                  }}>
                    {isAr ? 'معدل نشاط وحضور المستخدمين — آخر 7 أيام' : 'User Activity & Engagement — Last 7 Days'}
                  </h2>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#1588C7',
                    backgroundColor: 'rgba(21, 136, 199, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(21, 136, 199, 0.25)'
                  }}>
                    {isAr ? 'عدد المستخدمين النشطين يومياً' : 'Daily Active Users'}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  {isAr ? 'إجمالي نشاط وتفاعل حسابات المنصة (الطلاب، المعلمون، وإدارات السناتر)' : 'Daily listeners and live session attendance for all users'}
                </p>
              </div>

              {/* Date Tag Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--bg-app, #F8FAFC)',
                border: '1px solid var(--border-subtle)',
                padding: '5px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                fontWeight: '700'
              }}>
                <Calendar size={13} color="#1588C7" />
                <span>{isAr ? 'آخر 7 أيام' : 'Last 7 Days'}</span>
              </div>
            </div>

            {/* Interactive SVG Area Spline Visualizer with All Badges and Guidelines */}
            <div style={{ position: 'relative', width: '100%', height: '240px' }}>
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="none"
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="adminUsersAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1588C7" stopOpacity={isDark ? 0.32 : 0.24} />
                    <stop offset="90%" stopColor="#1588C7" stopOpacity={0.02} />
                    <stop offset="100%" stopColor="#1588C7" stopOpacity={0.0} />
                  </linearGradient>

                  <filter id="adminCenterUsersGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#1588C7" floodOpacity={0.65} />
                  </filter>
                </defs>

                {/* Y-Axis Label: Users */}
                <text
                  x={axisLeft - 10}
                  y={paddingTop - 14}
                  textAnchor="end"
                  fill="#1588C7"
                  fontSize="11"
                  fontFamily="var(--font-arabic)"
                  fontWeight="800"
                >
                  {isAr ? 'المستخدمين' : 'Users'}
                </text>

                {/* Y-Axis Horizontal Dashed Grid Lines & Ticks */}
                {yTicks.map((tick) => {
                  const yRatio = tick / maxUsers;
                  const y = baseline - yRatio * (baseline - paddingTop);
                  const formatted = tick >= 1000 ? `${tick / 1000}k` : '0';
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
                        {formatted}
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
                <path d={areaPath} fill="url(#adminUsersAreaGrad)" />

                {/* Spline Line with smooth glow */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#1588C7"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#adminCenterUsersGlow)"
                />

                {/* Interactive Points, Vertical Guidelines, and Top Floating Badges */}
                {points.map((p, idx) => {
                  const isHovered = hoveredPointIndex === idx;
                  return (
                    <g key={idx}>
                      {/* Vertical Guideline from point down to baseline */}
                      <line
                        x1={p.x}
                        y1={p.y + 6}
                        x2={p.x}
                        y2={baseline + 5}
                        stroke={p.isToday || p.isPeak ? '#1588C7' : themeGridStroke}
                        strokeDasharray="3 3"
                        strokeWidth={p.isToday || p.isPeak ? '1.5' : '1'}
                        opacity={p.isToday || p.isPeak ? 0.75 : 0.4}
                      />

                      {/* Value Badge directly above EVERY point (Matching Center Screenshot Exactly) */}
                      <g>
                        <rect
                          x={p.x - 22}
                          y={p.y - 25}
                          width="44"
                          height="18"
                          rx="5"
                          fill={p.isPeak ? '#10B981' : p.isToday ? '#1588C7' : (isDark ? '#1E293B' : '#F1F5F9')}
                          stroke={p.isPeak ? '#10B981' : p.isToday ? '#1588C7' : (isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.12)')}
                          strokeWidth="1"
                        />
                        <text
                          x={p.x}
                          y={p.y - 12}
                          textAnchor="middle"
                          fill={p.isPeak || p.isToday ? '#FFFFFF' : (isDark ? '#E2E8F0' : '#1E293B')}
                          fontSize="10"
                          fontWeight="800"
                          fontFamily="var(--font-heading)"
                        >
                          {p.usersLabel}
                        </text>
                      </g>

                      {/* Hit Area */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="18"
                        fill="transparent"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredPointIndex(idx)}
                        onMouseLeave={() => setHoveredPointIndex(null)}
                      />

                      {/* Glow Halo on Hover / Today / Peak */}
                      {(isHovered || p.isPeak || p.isToday) && (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isHovered ? 8 : 6}
                          fill={isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(21, 136, 199, 0.2)'}
                          filter="url(#adminCenterUsersGlow)"
                        />
                      )}

                      {/* Main Point Dot */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 5.5 : 4}
                        fill={p.isPeak ? '#10B981' : p.isToday ? '#1588C7' : '#FFFFFF'}
                        stroke="#1588C7"
                        strokeWidth="2"
                        style={{ transition: 'all 0.15s ease' }}
                      />

                      {/* X-Axis Day Label */}
                      <text
                        x={p.x}
                        y={baseline + 18}
                        textAnchor="middle"
                        fill={p.isToday ? '#1588C7' : p.isPeak ? '#10B981' : (isDark ? '#E2E8F0' : '#334155')}
                        fontSize="11.5"
                        fontWeight={p.isToday || p.isPeak ? '800' : '600'}
                        fontFamily="var(--font-arabic)"
                      >
                        {isAr ? p.dayAr : p.dayEn}
                      </text>

                      {p.isToday && (
                        <text
                          x={p.x}
                          y={baseline + 33}
                          textAnchor="middle"
                          fill="#1588C7"
                          fontSize="9.5"
                          fontWeight="700"
                          fontFamily="var(--font-arabic)"
                        >
                          {isAr ? '(اليوم)' : '(Today)'}
                        </text>
                      )}

                      {p.isPeak && !p.isToday && (
                        <text
                          x={p.x}
                          y={baseline + 33}
                          textAnchor="middle"
                          fill="#10B981"
                          fontSize="9.5"
                          fontWeight="700"
                          fontFamily="var(--font-arabic)"
                        >
                          {isAr ? '(الذروة)' : '(Peak)'}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip on Hover */}
              {hoveredPointIndex !== null && (
                <div style={{
                  position: 'absolute',
                  left: `${(points[hoveredPointIndex].x / chartWidth) * 100}%`,
                  top: `${(points[hoveredPointIndex].y / chartHeight) * 100}%`,
                  transform: 'translate(-50%, -145%)',
                  background: isDark ? '#131E33' : '#FFFFFF',
                  border: '1.5px solid #1588C7',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  padding: '7px 13px',
                  borderRadius: '8px',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  zIndex: 20,
                  fontSize: '12px',
                  color: 'var(--text-primary)'
                }}>
                  <div style={{ color: '#1588C7', fontSize: '11px', fontWeight: '800', marginBottom: '2px' }}>
                    {isAr ? points[hoveredPointIndex].dayAr : points[hoveredPointIndex].dayEn} • {points[hoveredPointIndex].hours} {isAr ? 'ساعة تفاعل' : 'hours active'}
                  </div>
                  <div style={{ fontWeight: '800' }}>
                    {points[hoveredPointIndex].users.toLocaleString()} {isAr ? 'مستخدم نشط' : 'active users'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {points[hoveredPointIndex].topTopic}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer note: Platform-wide Users Analysis */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '14px',
            marginTop: '10px',
            borderTop: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {isAr ? 'ذروة الأسبوع:' : 'Weekly Peak:'}
              </span>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {isAr ? 'الخميس (34,800 مستخدم نشط • 4,120 ساعة تفاعل واستخدام)' : 'Thursday (34,800 active users • 4,120 hrs)'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              <span>{isAr ? 'متوسط الحضور: 25,000 مستخدم/يوم' : 'Avg: 25,000 users/day'}</span>
              <span>•</span>
              <span style={{ color: '#10B981', fontWeight: '700' }}>{isAr ? 'نسبة التفاعل النشط: 94.2%' : 'Active Rate: 94.2%'}</span>
              <span>•</span>
              <span>{isAr ? 'إجمالي الساعات: 28,400 س/أسبوع' : 'Total: 28,400 hrs/wk'}</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: LARGE PROMINENT DONUT GAUGE CARD (USER DEMOGRAPHICS) ── */}
        <div
          className="executive-card executive-chart-side center-interactive-card"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl, 18px)',
            border: '1px solid var(--border-subtle)',
            padding: '22px 20px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            animation: 'adminChartEntrance 0.5s 0.28s cubic-bezier(0.16, 1, 0.3, 1) both'
          }}
        >
          <div>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(21, 136, 199, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1588C7'
                }}>
                  <Layers size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                    {isAr ? 'توزيع ونسب المستخدمين' : 'User Demographics'}
                  </h2>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {isAr ? '34,800 مستخدم مسجل بالمنظومة' : '34,800 registered users'}
                  </span>
                </div>
              </div>

              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(21, 136, 199, 0.1)',
                color: '#1588C7'
              }}>
                {isAr ? 'توزيع متوازن' : 'Balanced'}
              </span>
            </div>

            {/* Large Centered Prominent Donut Gauge: Represents All Platform Users */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 0',
              position: 'relative',
              marginBottom: '10px'
            }}>
              <div style={{ position: 'relative', width: '136px', height: '136px' }}>
                <svg width="136" height="136" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Background Track */}
                  <circle
                    cx="80"
                    cy="80"
                    r={donutRadius}
                    fill="none"
                    stroke={themeTrackStroke}
                    strokeWidth="13"
                  />
                  {/* Primary Arc (Students 95.8%) */}
                  <circle
                    cx="80"
                    cy="80"
                    r={donutRadius}
                    fill="none"
                    stroke="#1588C7"
                    strokeWidth="13"
                    strokeDasharray={donutCircumference}
                    strokeDashoffset={donutDashOffset}
                    strokeLinecap="round"
                    style={{
                      transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  />
                </svg>

                {/* Center Stat Display: All Platform Users */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  pointerEvents: 'none'
                }}>
                  <span style={{
                    fontSize: '25px',
                    fontWeight: '900',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)',
                    lineHeight: 1
                  }}>
                    {totalUsersDisplay}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    marginTop: '3px',
                    fontWeight: '700'
                  }}>
                    {isAr ? 'إجمالي المستخدمين' : 'Total Users'}
                  </span>
                </div>
              </div>
            </div>

            {/* Compact, Well-Proportioned Breakdown Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                {isAr ? 'تصنيف وتوزيع المستخدمين بالمنصة:' : 'Platform User Categories:'}
              </span>

              {/* Row 1: Students */}
              <div style={{
                padding: '6px 10px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {isAr ? 'طلاب المنصة (33,332 مستخدم)' : 'Enrolled Students (33,332)'}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#1588C7',
                    backgroundColor: 'rgba(21, 136, 199, 0.12)',
                    padding: '1px 5px',
                    borderRadius: '4px'
                  }}>
                    95.8%
                  </span>
                </div>
                <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '95.8%', height: '100%', backgroundColor: '#1588C7', borderRadius: '2px' }} />
                </div>
              </div>

              {/* Row 2: Teachers */}
              <div style={{
                padding: '6px 10px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {isAr ? 'المعلمون والأساتذة (1,420 مستخدم)' : 'Certified Teachers (1,420)'}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#5CB6DB',
                    backgroundColor: 'rgba(92, 182, 219, 0.14)',
                    padding: '1px 5px',
                    borderRadius: '4px'
                  }}>
                    4.1%
                  </span>
                </div>
                <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '14%', height: '100%', backgroundColor: '#5CB6DB', borderRadius: '2px' }} />
                </div>
              </div>

              {/* Row 3: Centers */}
              <div style={{
                padding: '6px 10px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {isAr ? 'السناتر والمراكز (48 مؤسسة)' : 'Authorized Centers (48)'}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#06254E',
                    backgroundColor: 'rgba(6, 37, 78, 0.08)',
                    padding: '1px 5px',
                    borderRadius: '4px'
                  }}>
                    0.1%
                  </span>
                </div>
                <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '6%', height: '100%', backgroundColor: '#06254E', borderRadius: '2px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Compact Action Link */}
          <div style={{ paddingTop: '10px', marginTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
            <a
              href="/admin/dashboard?tab=users"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '12px',
                fontWeight: '800',
                color: '#1588C7',
                textDecoration: 'none',
                transition: 'gap 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.gap = '8px'; }}
              onMouseLeave={(e) => { e.currentTarget.style.gap = '5px'; }}
            >
              <span>{isAr ? 'فتح سجلات المستخدمين والتوثيق' : 'Open User Management'}</span>
              {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes adminChartEntrance {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
