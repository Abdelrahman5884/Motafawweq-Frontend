import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { generateSplinePaths } from '../../../utils';

// Weekly Study Data (7 days) for the interactive SVG Area Spline Graph
const DEFAULT_WEEKLY_STUDY_DATA = [
  { dayAr: 'السبت', dayEn: 'Sat', minutes: 45, lessons: 2, isToday: false },
  { dayAr: 'الأحد', dayEn: 'Sun', minutes: 70, lessons: 3, isToday: false },
  { dayAr: 'الإثنين', dayEn: 'Mon', minutes: 55, lessons: 2, isToday: false },
  { dayAr: 'الثلاثاء', dayEn: 'Tue', minutes: 85, lessons: 4, isToday: false },
  { dayAr: 'الأربعاء', dayEn: 'Wed', minutes: 40, lessons: 1, isToday: false },
  { dayAr: 'الخميس', dayEn: 'Thu', minutes: 80, lessons: 3, isToday: false },
  { dayAr: 'الجمعة', dayEn: 'Fri', minutes: 65, lessons: 2, isToday: true }
];

const DEFAULT_SUBJECT_MASTERY = [
  { nameAr: 'الأحياء', nameEn: 'Biology', pct: 78, color: '#10B981' },
  { nameAr: 'الفيزياء', nameEn: 'Physics', pct: 62, color: '#06B6D4' },
  { nameAr: 'اللغة العربية', nameEn: 'Arabic', pct: 85, color: '#3B82F6' },
  { nameAr: 'الكيمياء', nameEn: 'Chemistry', pct: 45, color: '#F59E0B' }
];

export const StudyActivityChart = ({
  lang,
  isDark,
  themeAccent,
  studyData = DEFAULT_WEEKLY_STUDY_DATA,
  subjectMastery = DEFAULT_SUBJECT_MASTERY,
  overallMasteryValue = 94.6
}) => {
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  // Chart coordinate mapping (viewBox: 680 x 230)
  const chartWidth = 680;
  const chartHeight = 230;
  const paddingLeft = 72; // Generous space so Y-axis labels never collide with Saturday dot
  const paddingRight = 36;
  const paddingTop = 36;
  const paddingBottom = 46;
  const baseline = chartHeight - paddingBottom;
  const maxMinutes = 100;

  const points = studyData.map((item, idx) => {
    const xStep = (chartWidth - paddingLeft - paddingRight) / (studyData.length - 1);
    const x = paddingLeft + idx * xStep;
    const yRatio = item.minutes / maxMinutes;
    const y = baseline - yRatio * (baseline - paddingTop);
    return { ...item, x, y };
  });

  const { linePath, areaPath } = generateSplinePaths(points, baseline);
  const yTicks = [100, 80, 60, 40, 20, 0];

  // Donut chart calculations
  const donutRadius = 62;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutDashOffset = donutCircumference - (overallMasteryValue / 100) * donutCircumference;

  // Adaptive theme colors for SVGs
  const themeGridStroke = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.08)';
  const themeTrackStroke = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
  const themeAxisFill = isDark ? '#94A3B8' : '#64748B';

  return (
    <div className="executive-charts-grid">
      {/* Left Chart: Study Activity — Last 7 Days (~65% width) */}
      <div className="executive-card executive-chart-main">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                margin: 0,
                fontFamily: 'var(--font-heading), var(--font-arabic)'
              }}>
                {lang === 'ar' ? 'معدل المذاكرة — آخر 7 أيام' : 'Study Activity — Last 7 Days'}
              </h2>
              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                color: themeAccent,
                backgroundColor: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.1)',
                padding: '2px 8px',
                borderRadius: '6px',
                border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.2)'}`
              }}>
                {lang === 'ar' ? 'القيم بالدقائق (دقيقة)' : 'Values in Minutes'}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              {lang === 'ar' ? 'إجمالي دقائق المذاكرة والحصص المنجزة يومياً' : 'Daily study minutes and completed sessions'}
            </p>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)'}`,
            padding: '5px 10px',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontWeight: '600'
          }}>
            <Calendar size={13} style={{ color: themeAccent }} />
            <span>{lang === 'ar' ? 'آخر 7 أيام' : 'Last 7 Days'}</span>
          </div>
        </div>

        {/* SVG Area Spline Visualizer */}
        <div style={{ position: 'relative', width: '100%', height: '240px' }}>
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="execAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={themeAccent} stopOpacity={isDark ? 0.28 : 0.22} />
                <stop offset="90%" stopColor={themeAccent} stopOpacity={0.01} />
                <stop offset="100%" stopColor={themeAccent} stopOpacity={0.0} />
              </linearGradient>

              <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={themeAccent} floodOpacity={0.6} />
              </filter>
            </defs>

            {/* Y-Axis Label: Title on top of the vertical axis */}
            <text
              x={paddingLeft - 10}
              y={paddingTop - 14}
              textAnchor="end"
              fill={themeAccent}
              fontSize="10.5"
              fontFamily="var(--font-arabic)"
              fontWeight="800"
            >
              {lang === 'ar' ? 'الدقائق' : 'Minutes'}
            </text>

            {/* Y-Axis Horizontal Dashed Grid Lines */}
            {yTicks.map((tick) => {
              const yRatio = tick / maxMinutes;
              const y = baseline - yRatio * (baseline - paddingTop);
              return (
                <g key={tick}>
                  <text
                    x={paddingLeft - 12}
                    y={y + 4}
                    textAnchor="end"
                    fill={themeAxisFill}
                    fontSize="10.5"
                    fontFamily="var(--font-heading), var(--font-latin)"
                    fontWeight="600"
                  >
                    {tick} {lang === 'ar' ? 'د' : 'm'}
                  </text>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={chartWidth - paddingRight}
                    y2={y}
                    stroke={themeGridStroke}
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                </g>
              );
            })}

            {/* Spline Area Fill */}
            <path
              d={areaPath}
              fill="url(#execAreaGradient)"
              className="spline-area"
            />

            {/* Spline Glowing Line */}
            <path
              d={linePath}
              fill="none"
              stroke={themeAccent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="spline-line"
            />

            {/* Interactive Points, Vertical Guide Lines, Value Badges & X-Axis Labels */}
            {points.map((p, idx) => {
              const isHovered = hoveredPointIndex === idx;
              return (
                <g key={idx}>
                  {/* Vertical Guideline connecting point to day name */}
                  <line
                    x1={p.x}
                    y1={p.y + (p.isToday || isHovered ? 8 : 5)}
                    x2={p.x}
                    y2={baseline + 5}
                    stroke={p.isToday ? themeAccent : themeGridStroke}
                    strokeDasharray="3 3"
                    strokeWidth={p.isToday ? '1.5' : '1'}
                    opacity={p.isToday ? 0.75 : 0.4}
                  />

                  {/* Value Badge directly above the point */}
                  <g style={{ transition: 'transform 0.15s ease' }}>
                    <rect
                      x={p.x - 19}
                      y={p.y - 25}
                      width="38"
                      height="17"
                      rx="5"
                      fill={p.isToday ? themeAccent : (isDark ? '#1E293B' : '#F1F5F9')}
                      stroke={p.isToday ? themeAccent : (isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.12)')}
                      strokeWidth="1"
                    />
                    <text
                      x={p.x}
                      y={p.y - 13}
                      textAnchor="middle"
                      fill={p.isToday ? '#FFFFFF' : (isDark ? '#E2E8F0' : '#1E293B')}
                      fontSize="10"
                      fontWeight="800"
                      fontFamily="var(--font-heading)"
                    >
                      {p.minutes} {lang === 'ar' ? 'د' : 'm'}
                    </text>
                  </g>

                  {/* Invisible Hit Area for smooth hover */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="18"
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  />

                  {/* Outer Glow Circle */}
                  {(isHovered || p.isToday) && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 8 : 6}
                      fill={isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.2)'}
                      filter="url(#glowEffect)"
                      style={{ transition: 'r 0.2s ease' }}
                    />
                  )}

                  {/* Inner Dot Circle */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 5 : 3.8}
                    fill={isDark ? '#0E1726' : '#FFFFFF'}
                    stroke={themeAccent}
                    strokeWidth="2.5"
                    style={{ transition: 'r 0.2s ease, stroke-width 0.2s ease' }}
                  />

                  {/* Day Label */}
                  <text
                    x={p.x}
                    y={baseline + 20}
                    textAnchor="middle"
                    fill={p.isToday ? themeAccent : (isDark ? '#E2E8F0' : '#334155')}
                    fontSize="11.5"
                    fontWeight={p.isToday ? '800' : '600'}
                    fontFamily="var(--font-arabic)"
                  >
                    {lang === 'ar' ? p.dayAr : p.dayEn}
                  </text>
                  {p.isToday && (
                    <text
                      x={p.x}
                      y={baseline + 33}
                      textAnchor="middle"
                      fill={themeAccent}
                      fontSize="9.5"
                      fontWeight="700"
                      fontFamily="var(--font-arabic)"
                    >
                      {lang === 'ar' ? '(اليوم)' : '(Today)'}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Floating Tooltip on Hover */}
          {hoveredPointIndex !== null && (
            <div style={{
              position: 'absolute',
              left: `${(points[hoveredPointIndex].x / chartWidth) * 100}%`,
              top: `${(points[hoveredPointIndex].y / chartHeight) * 100}%`,
              transform: 'translate(-50%, -145%)',
              background: isDark ? '#131E33' : '#FFFFFF',
              border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.25)'}`,
              boxShadow: isDark ? '0 8px 24px rgba(0, 0, 0, 0.5)' : '0 8px 24px rgba(0, 0, 0, 0.12)',
              padding: '6px 12px',
              borderRadius: '8px',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              zIndex: 20,
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              animation: 'fadeInArea 0.15s ease'
            }}>
              <div style={{ color: themeAccent, fontSize: '11px', marginBottom: '2px' }}>
                {lang === 'ar' ? points[hoveredPointIndex].dayAr : points[hoveredPointIndex].dayEn}
              </div>
              <div>
                {points[hoveredPointIndex].minutes} {lang === 'ar' ? 'دقيقة' : 'mins'}
                <span style={{ color: 'var(--text-muted)', marginInlineStart: '6px', fontSize: '11px' }}>
                  ({points[hoveredPointIndex].lessons} {lang === 'ar' ? 'حصص' : 'lessons'})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Chart: Subject Mastery Distribution (35% width) */}
      <div className="executive-card executive-chart-side" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: 0,
            fontFamily: 'var(--font-heading), var(--font-arabic)'
          }}>
            {lang === 'ar' ? 'توزيع إتقان المواد' : 'Subject Mastery'}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
            {lang === 'ar' ? 'مؤشر الفهم والاستيعاب التراكمي' : 'Cumulative mastery & comprehension'}
          </p>
        </div>

        {/* Circular Donut Gauge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '12px 0'
        }}>
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r={donutRadius}
              fill="transparent"
              stroke={themeTrackStroke}
              strokeWidth="14"
            />

            <circle
              cx="80"
              cy="80"
              r={donutRadius}
              fill="transparent"
              stroke={themeAccent}
              strokeWidth="14"
              strokeDasharray={donutCircumference}
              strokeDashoffset={donutDashOffset}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
              className="executive-donut-segment"
            />
          </svg>

          <div style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            <span style={{
              fontSize: '28px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              lineHeight: 1
            }}>
              {overallMasteryValue}%
            </span>
            <span style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              marginTop: '4px',
              fontWeight: '500'
            }}>
              {lang === 'ar' ? 'معدل الإتقان' : 'Mastery'}
            </span>
          </div>
        </div>

        {/* 4 Subjects Mini Legend */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          paddingTop: '8px',
          borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.08)'}`
        }}>
          {subjectMastery.map((sub, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: sub.color,
                flexShrink: 0
              }} />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', flex: 1 }}>
                {lang === 'ar' ? sub.nameAr : sub.nameEn}
              </span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {sub.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
