import React, { useMemo, useState } from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { generateSplinePaths } from '../../../utils';

const CHART_WIDTH = 680;
const CHART_HEIGHT = 245;
const AXIS_LEFT = 52;
const GRAPH_LEFT = 88;
const GRAPH_RIGHT = CHART_WIDTH - 36;
const PADDING_TOP = 38;
const PADDING_BOTTOM = 50;
const BASELINE = CHART_HEIGHT - PADDING_BOTTOM;

/**
 * Interactive 7-day attendance spline area chart matching TeacherAnalyticsCharts SVG geometry
 * with LTR SVG isolation so Y-axis ticks and baseline nodes never overlap in RTL layouts.
 */
export const CenterAttendanceChart = ({
  weeklyAttendance = {},
  isAr = true,
  isDark = false,
  themeAccent = '#1588C7',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const days = useMemo(
    () => (Array.isArray(weeklyAttendance.days) ? weeklyAttendance.days : []),
    [weeklyAttendance.days]
  );

  const peakDay = weeklyAttendance.peakDay || null;
  const dailyAverage = Number(weeklyAttendance.dailyAverage ?? 0);
  const commitmentRate = Number(weeklyAttendance.commitmentRate ?? 0);
  const totalWeeklyHours = Number(weeklyAttendance.totalWeeklyHours ?? 0);

  const maxObserved = useMemo(
    () => days.reduce((acc, d) => Math.max(acc, Number(d.students) || 0), 0),
    [days]
  );

  const { yMax, yTicks } = useMemo(() => {
    if (maxObserved <= 5) {
      return { yMax: 5, yTicks: [5, 4, 3, 2, 1, 0] };
    }
    const step = Math.max(5, Math.ceil(maxObserved / 4 / 5) * 5);
    const ceilMax = step * 4;
    return { yMax: ceilMax, yTicks: [ceilMax, step * 3, step * 2, step, 0] };
  }, [maxObserved]);

  const points = useMemo(() => {
    const denom = Math.max(1, days.length - 1);
    const xStep = (GRAPH_RIGHT - GRAPH_LEFT) / denom;
    return days.map((day, idx) => {
      const val = Number(day.students) || 0;
      const x = days.length > 1 ? GRAPH_LEFT + idx * xStep : GRAPH_LEFT + (GRAPH_RIGHT - GRAPH_LEFT) / 2;
      const ratio = yMax > 0 ? Math.min(1, val / yMax) : 0;
      const y = BASELINE - ratio * (BASELINE - PADDING_TOP);
      return { ...day, students: val, hours: Number(day.hours) || 0, x, y };
    });
  }, [days, yMax]);

  const { linePath, areaPath } = useMemo(
    () =>
      points.length >= 2
        ? generateSplinePaths(points, BASELINE, PADDING_TOP)
        : { linePath: '', areaPath: '' },
    [points]
  );

  const gridStroke = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.08)';
  const axisFill = isDark ? '#94A3B8' : '#64748B';
  const hoveredPoint = hoveredIdx !== null && points[hoveredIdx] ? points[hoveredIdx] : null;
  const tooltipTransform =
    hoveredIdx === 0
      ? 'translate(-12%, -138%)'
      : hoveredIdx === points.length - 1
      ? 'translate(-88%, -138%)'
      : 'translate(-50%, -138%)';

  return (
    <div
      className="executive-card executive-chart-main"
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px 24px',
        boxShadow: 'var(--shadow-xs)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '16px',
      }}
    >
      {/* Card Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h2
              style={{
                fontSize: '16px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                margin: 0,
                fontFamily: 'var(--font-heading), var(--font-arabic)',
              }}
            >
              {isAr ? 'مؤشر الحضور الأسبوعي المباشر' : 'Live Weekly Attendance Curve'}
            </h2>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '800',
                color: themeAccent,
                backgroundColor: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(0, 102, 204, 0.08)',
                padding: '2px 8px',
                borderRadius: '6px',
                border: `1px solid ${
                  isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(0, 102, 204, 0.2)'
                }`,
              }}
            >
              {isAr ? 'حركة القاعات' : 'Daily Gate Activity'}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            {isAr
              ? 'إجمالي الطلاب المسجل حضورهم وساعات التدريس الفعلية خلال آخر 7 أيام'
              : 'Verified student check-ins & teaching hours over the last 7 days'}
          </p>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)'}`,
            padding: '5px 10px',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontWeight: '600',
          }}
        >
          <Calendar size={13} style={{ color: themeAccent }} />
          <span>{isAr ? 'آخر 7 أيام' : 'Last 7 Days'}</span>
        </div>
      </div>

      {/* SVG Canvas isolated in LTR so Y-axis coordinates align properly */}
      <div dir="ltr" style={{ position: 'relative', width: '100%' }}>
        {points.length === 0 ? (
          <div
            style={{
              height: '220px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '13px',
            }}
          >
            {isAr
              ? 'لا توجد سجلات حضور مسجلة خلال الأسبوع الحالي.'
              : 'No attendance data recorded this week.'}
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
            role="img"
            aria-label={isAr ? 'منحنى الحضور الأسبوعي' : 'Weekly attendance chart'}
          >
            <defs>
              <linearGradient id="centerAttendanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={themeAccent} stopOpacity={isDark ? 0.32 : 0.24} />
                <stop offset="90%" stopColor={themeAccent} stopOpacity={0.02} />
                <stop offset="100%" stopColor={themeAccent} stopOpacity={0} />
              </linearGradient>
              <filter id="centerPointGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={themeAccent} floodOpacity={0.65} />
              </filter>
            </defs>

            {/* Y-Axis Caption */}
            <text
              x={AXIS_LEFT - 10}
              y={PADDING_TOP - 16}
              textAnchor="end"
              fill={themeAccent}
              fontSize="10.5"
              fontFamily="var(--font-arabic)"
              fontWeight="800"
            >
              {isAr ? 'الطلاب' : 'Students'}
            </text>

            {/* Horizontal Y-axis Gridlines */}
            {yTicks.map((tickVal) => {
              const ratio = yMax > 0 ? tickVal / yMax : 0;
              const tickY = BASELINE - ratio * (BASELINE - PADDING_TOP);
              return (
                <g key={tickVal}>
                  <text
                    x={AXIS_LEFT - 10}
                    y={tickY + 4}
                    textAnchor="end"
                    fill={axisFill}
                    fontSize="10.5"
                    fontFamily="var(--font-heading), var(--font-latin)"
                    fontWeight="600"
                  >
                    {tickVal}
                  </text>
                  <line
                    x1={AXIS_LEFT}
                    y1={tickY}
                    x2={GRAPH_RIGHT}
                    y2={tickY}
                    stroke={gridStroke}
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                </g>
              );
            })}

            {areaPath && <path d={areaPath} fill="url(#centerAttendanceGrad)" />}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke={themeAccent}
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {points.map((p, idx) => {
              const isHovered = hoveredIdx === idx;
              const nodeColor = p.isPeak ? '#10B981' : themeAccent;
              return (
                <g key={p.date || idx}>
                  <line
                    x1={p.x}
                    y1={p.y + 6}
                    x2={p.x}
                    y2={BASELINE + 5}
                    stroke={p.isToday || p.isPeak ? nodeColor : gridStroke}
                    strokeDasharray="3 3"
                    strokeWidth={p.isToday || p.isPeak ? '1.5' : '1'}
                    opacity={p.isToday || p.isPeak ? 0.75 : 0.45}
                  />

                  {/* Value Badge above node */}
                  <g>
                    <rect
                      x={p.x - 19}
                      y={p.y - 25}
                      width="38"
                      height="18"
                      rx="5"
                      fill={
                        p.isPeak
                          ? '#10B981'
                          : p.isToday
                          ? themeAccent
                          : isDark
                          ? '#1E293B'
                          : '#F1F5F9'
                      }
                      stroke={
                        p.isPeak
                          ? '#10B981'
                          : p.isToday
                          ? themeAccent
                          : isDark
                          ? 'rgba(255, 255, 255, 0.12)'
                          : 'rgba(15, 23, 42, 0.12)'
                      }
                      strokeWidth="1"
                    />
                    <text
                      x={p.x}
                      y={p.y - 12}
                      textAnchor="middle"
                      fill={
                        p.isPeak || p.isToday
                          ? '#FFFFFF'
                          : isDark
                          ? '#E2E8F0'
                          : '#1E293B'
                      }
                      fontSize="10"
                      fontWeight="800"
                      fontFamily="var(--font-heading)"
                    >
                      {p.students}
                    </text>
                  </g>

                  {/* Interactive Hit Target */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="18"
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onFocus={() => setHoveredIdx(idx)}
                    onBlur={() => setHoveredIdx(null)}
                    tabIndex={0}
                  />

                  {(isHovered || p.isPeak || p.isToday) && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 8 : 6}
                      fill={
                        p.isPeak
                          ? 'rgba(16, 185, 129, 0.22)'
                          : isDark
                          ? 'rgba(56, 189, 248, 0.25)'
                          : 'rgba(0, 102, 204, 0.2)'
                      }
                      filter="url(#centerPointGlow)"
                    />
                  )}

                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 5 : 3.8}
                    fill={isDark ? '#0E1726' : '#FFFFFF'}
                    stroke={nodeColor}
                    strokeWidth="2.5"
                  />

                  <text
                    x={p.x}
                    y={BASELINE + 21}
                    textAnchor="middle"
                    fill={
                      p.isToday
                        ? themeAccent
                        : p.isPeak
                        ? '#10B981'
                        : isDark
                        ? '#E2E8F0'
                        : '#334155'
                    }
                    fontSize="11.5"
                    fontWeight={p.isToday || p.isPeak ? '800' : '600'}
                    fontFamily="var(--font-arabic)"
                  >
                    {isAr ? p.dayAr : p.dayEn}
                  </text>

                  {p.isToday && (
                    <text
                      x={p.x}
                      y={BASELINE + 35}
                      textAnchor="middle"
                      fill={themeAccent}
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
                      y={BASELINE + 35}
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
        )}

        {/* Floating Tooltip anchored safely to hovered node */}
        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              left: `${(hoveredPoint.x / CHART_WIDTH) * 100}%`,
              top: `${(hoveredPoint.y / CHART_HEIGHT) * 100}%`,
              transform: tooltipTransform,
              background: isDark ? '#131E33' : '#FFFFFF',
              border: `1px solid ${
                isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(0, 102, 204, 0.25)'
              }`,
              boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.12)',
              padding: '8px 13px',
              borderRadius: '8px',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              zIndex: 20,
              fontSize: '12px',
              color: 'var(--text-primary)',
              direction: isAr ? 'rtl' : 'ltr',
            }}
          >
            <div style={{ color: themeAccent, fontSize: '11px', fontWeight: '800', marginBottom: '2px' }}>
              {isAr ? hoveredPoint.dayAr : hoveredPoint.dayEn} • {hoveredPoint.hours}{' '}
              {isAr ? 'ساعة تدريس' : 'teaching hrs'}
            </div>
            <div style={{ fontWeight: '800' }}>
              {hoveredPoint.students.toLocaleString()} {isAr ? 'طالب' : 'students'}
            </div>
            {hoveredPoint.topTopic && (
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {hoveredPoint.topTopic}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Metrics Summary Strip */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          paddingTop: '14px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '12px',
          color: 'var(--text-secondary)',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={13} style={{ color: '#10B981' }} />
          <span>{isAr ? 'الذروة:' : 'Peak:'}</span>
          <strong style={{ color: '#10B981', fontWeight: '800' }}>
            {peakDay && peakDay.students > 0
              ? `${isAr ? peakDay.dayAr : peakDay.dayEn} (${peakDay.students})`
              : isAr
              ? 'لا يوجد نشاط مسجل'
              : 'No data'}
          </strong>
        </span>

        <span>
          {isAr ? 'المتوسط اليومي: ' : 'Daily Avg: '}
          <strong style={{ color: themeAccent, fontWeight: '800' }}>
            {dailyAverage.toLocaleString()} {isAr ? 'طالب/يوم' : 'students'}
          </strong>
        </span>

        <span>
          {isAr ? 'إجمالي الساعات: ' : 'Weekly Hours: '}
          <strong style={{ color: 'var(--text-primary)', fontWeight: '800' }}>
            {totalWeeklyHours} {isAr ? 'ساعة' : 'hrs'}
          </strong>
        </span>

        <span>
          {isAr ? 'نسبة الالتزام: ' : 'Commitment: '}
          <strong style={{ color: '#10B981', fontWeight: '800' }}>{commitmentRate}%</strong>
        </span>
      </div>
    </div>
  );
};
