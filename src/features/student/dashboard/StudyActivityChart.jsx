import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { clamp, generateSplinePaths } from '../../../utils';

// Fallback baseline when API hasn't returned yet
const DEFAULT_WEEKLY_STUDY_DATA = [
  { dayAr: 'السبت', dayEn: 'Sat', minutes: 0, lessons: 0, isToday: false },
  { dayAr: 'الأحد', dayEn: 'Sun', minutes: 0, lessons: 0, isToday: false },
  { dayAr: 'الإثنين', dayEn: 'Mon', minutes: 0, lessons: 0, isToday: false },
  { dayAr: 'الثلاثاء', dayEn: 'Tue', minutes: 0, lessons: 0, isToday: false },
  { dayAr: 'الأربعاء', dayEn: 'Wed', minutes: 0, lessons: 0, isToday: false },
  { dayAr: 'الخميس', dayEn: 'Thu', minutes: 0, lessons: 0, isToday: false },
  { dayAr: 'الجمعة', dayEn: 'Fri', minutes: 0, lessons: 0, isToday: true }
];

const DEFAULT_SUBJECT_MASTERY = [];

export const StudyActivityChart = ({
  lang,
  isDark,
  themeAccent,
  studyData = DEFAULT_WEEKLY_STUDY_DATA,
  subjectMastery = DEFAULT_SUBJECT_MASTERY,
  overallMasteryValue = 0,
  selectedSubject = 'all',
  onSelectSubject = null
}) => {
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  // Chart coordinate mapping (viewBox: 680 x 230)
  const chartWidth = 680;
  const chartHeight = 230;
  const paddingLeft = 72;
  const paddingRight = 38;
  const paddingTop = 36;
  const paddingBottom = 46;
  const baseline = chartHeight - paddingBottom;
  const highestDataMins = studyData.reduce((mx, d) => Math.max(mx, Number(d.minutes || 0)), 0);
  const maxMinutes = Math.max(60, Math.ceil(highestDataMins / 20) * 20);

  const points = studyData.map((item, idx) => {
    const xStep = (chartWidth - paddingLeft - paddingRight) / Math.max(1, studyData.length - 1);
    const x = paddingLeft + idx * xStep;
    const yRatio = Math.min(1, Math.max(0, (Number(item.minutes) || 0) / maxMinutes));
    const y = baseline - yRatio * (baseline - paddingTop);
    return { ...item, x, y };
  });

  const { linePath, areaPath } = generateSplinePaths(points, baseline, paddingTop);
  const yTicks = [1, 0.75, 0.5, 0.25, 0].map(r => Math.round(maxMinutes * r));

  // Donut chart calculations
  const safeMastery = clamp(Math.round(Number(overallMasteryValue) || 0), 0, 100);
  const donutRadius = 62;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutDashOffset = donutCircumference - (safeMastery / 100) * donutCircumference;

  // Adaptive theme colors for SVGs
  const themeGridStroke = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.08)';
  const themeTrackStroke = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
  const themeAxisFill = isDark ? '#94A3B8' : '#64748B';

  const hoveredPoint = hoveredPointIndex !== null ? points[hoveredPointIndex] : null;

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
              {lang === 'ar' ? 'إجمالي دقائق تواجدك ومذاكرتك على المنصة يومياً' : 'Daily active minutes on the platform and completed lessons'}
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
        <div style={{ position: 'relative', width: '100%', aspectRatio: `${chartWidth} / ${chartHeight}`, maxHeight: '260px' }}>
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: '100%', overflow: 'visible', display: 'block' }}
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

            {/* Y-Axis Title */}
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
              const mins = Number(p.minutes || 0);
              const badgeWidth = mins >= 100 ? 48 : 40;
              return (
                <g key={p.date || idx}>
                  {/* Vertical Guideline */}
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
                      x={p.x - badgeWidth / 2}
                      y={p.y - 25}
                      width={badgeWidth}
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
                      {mins} {lang === 'ar' ? 'د' : 'm'}
                    </text>
                  </g>

                  {/* Invisible Hit Area for smooth hover */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="20"
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
                      style={{ transition: 'r 0.2s ease', pointerEvents: 'none' }}
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
                    style={{ transition: 'r 0.2s ease, stroke-width 0.2s ease', pointerEvents: 'none' }}
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
          {hoveredPoint && (
            <div style={{
              position: 'absolute',
              left: `${(hoveredPoint.x / chartWidth) * 100}%`,
              top: `${(hoveredPoint.y / chartHeight) * 100}%`,
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
                {lang === 'ar' ? hoveredPoint.dayAr : hoveredPoint.dayEn}
                {hoveredPoint.date ? ` • ${hoveredPoint.date}` : ''}
              </div>
              <div>
                {hoveredPoint.minutes} {lang === 'ar' ? 'دقيقة' : 'mins'}
                <span style={{ color: 'var(--text-muted)', marginInlineStart: '6px', fontSize: '11px' }}>
                  ({hoveredPoint.lessons || 0} {lang === 'ar' ? 'حصص' : 'lessons'})
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
              {safeMastery}%
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

        {/* Interactive Subjects Mini Legend */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: subjectMastery.length > 0 ? 'repeat(2, 1fr)' : '1fr',
          gap: '6px',
          paddingTop: '8px',
          borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.08)'}`
        }}>
          {subjectMastery.length === 0 ? (
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '6px 0' }}>
              {lang === 'ar' ? 'لا توجد مقررات مفعّلة بعد لعرض توزيع الإتقان.' : 'No enrolled courses yet.'}
            </div>
          ) : (
            subjectMastery.map((sub, i) => {
              const isSelected = selectedSubject === sub.id;
              return (
                <button
                  key={sub.id || i}
                  type="button"
                  onClick={() => onSelectSubject && onSelectSubject(isSelected ? 'all' : sub.id)}
                  title={lang === 'ar' ? 'اضغط للفلترة بهذه المادة' : 'Click to filter by this subject'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '4px 6px',
                    borderRadius: '7px',
                    border: isSelected ? `1px solid ${themeAccent}` : '1px solid transparent',
                    background: isSelected
                      ? (isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.08)')
                      : 'transparent',
                    cursor: onSelectSubject ? 'pointer' : 'default',
                    textAlign: 'inherit',
                    width: '100%',
                    minWidth: 0
                  }}
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: sub.color,
                    flexShrink: 0
                  }} />
                  <span style={{ fontSize: '12px', color: isSelected ? themeAccent : 'var(--text-secondary)', fontWeight: isSelected ? '700' : '500', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lang === 'ar' ? sub.nameAr : (sub.nameEn || sub.nameAr)}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {sub.pct}%
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
