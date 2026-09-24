import React, { useState } from 'react';
import {
  Calendar,
  Award,
  BookOpen,
  Building2,
  Sparkles,
  Layers
} from 'lucide-react';
import { generateSplinePaths } from '../../../utils';

// Weekly Attendance & Active Listeners Data (7 days: Sat to Fri)
const WEEKLY_TEACHER_ATTENDANCE = [
  { dayAr: 'السبت', dayEn: 'Sat', students: 620, hours: 38, isToday: false, topTopic: 'البناء الضوئي وحلقات كريبس' },
  { dayAr: 'الأحد', dayEn: 'Sun', students: 840, hours: 52, isToday: false, topTopic: 'البيولوجيا الجزيئية وDNA' },
  { dayAr: 'الإثنين', dayEn: 'Mon', students: 710, hours: 44, isToday: false, topTopic: 'حل كويز المناعة' },
  { dayAr: 'الثلاثاء', dayEn: 'Tue', students: 890, hours: 56, isToday: false, topTopic: 'تضاعف DNA ومصائد الامتحان' },
  { dayAr: 'الأربعاء', dayEn: 'Wed', students: 680, hours: 42, isToday: false, topTopic: 'التغذية والنقل في النبات' },
  { dayAr: 'الخميس', dayEn: 'Thu', students: 960, hours: 61, isPeak: true, isToday: false, topTopic: 'مراجعة الباب الأول الشاملة' },
  { dayAr: 'الجمعة', dayEn: 'Fri', students: 750, hours: 47, isToday: true, topTopic: 'بنك أسئلة الوزارة والنماذج' }
];

// Subject Mastery Rates
const SUBJECT_MASTERY_DATA = [
  { nameAr: 'أحياء 3 ثانوي (عامة)', nameEn: 'Biology - 3rd Sec', pct: 88, students: 2450 },
  { nameAr: 'أحياء 2 ثانوي (نقل)', nameEn: 'Biology - 2nd Sec', pct: 84, students: 840 },
  { nameAr: 'أحياء 1 ثانوي (تأسيسي)', nameEn: 'Biology - 1st Sec', pct: 81, students: 530 },
  { nameAr: 'علوم لغات (إعدادي)', nameEn: 'Advanced Science', pct: 76, students: 300 }
];

// Clean Neutral Distribution by Subjects
const SUBJECTS_DISTRIBUTION = [
  {
    id: 'sub-3sec',
    titleAr: 'أحياء 3 ثانوي (عامة)',
    titleEn: 'Biology - 3rd Secondary',
    categoryAr: 'الثانوية العامة',
    categoryEn: 'Thanawya Amma',
    count: 2450,
    pct: 59,
    activeToday: 1540
  },
  {
    id: 'sub-2sec',
    titleAr: 'أحياء 2 ثانوي (نقل)',
    titleEn: 'Biology - 2nd Secondary',
    categoryAr: 'المرحلة الثانوية',
    categoryEn: 'Secondary Stage',
    count: 840,
    pct: 20,
    activeToday: 560
  },
  {
    id: 'sub-1sec',
    titleAr: 'أحياء 1 ثانوي (مبادئ البيولوجي)',
    titleEn: 'Biology - 1st Secondary',
    categoryAr: 'المرحلة الثانوية',
    categoryEn: 'Secondary Stage',
    count: 530,
    pct: 13,
    activeToday: 380
  },
  {
    id: 'sub-prep',
    titleAr: 'علوم لغات (3 إعدادي متقدم)',
    titleEn: 'Advanced Science - 3rd Prep',
    categoryAr: 'المرحلة الإعدادية',
    categoryEn: 'Prep Stage',
    count: 300,
    pct: 8,
    activeToday: 180
  }
];

// Clean Neutral Distribution by Centers & Locations
const CENTERS_DISTRIBUTION = [
  {
    id: 'ctr-online',
    titleAr: 'أكاديمية المتفوق (أونلاين المنصة)',
    titleEn: 'Motafawweq Online Academy',
    categoryAr: 'البث المباشر والمنصة',
    categoryEn: 'Live Streaming & Platform',
    count: 1890,
    pct: 46,
    activeToday: 1280
  },
  {
    id: 'ctr-dokki',
    titleAr: 'سنتر الدقي النخبة',
    titleEn: 'El Dokki Elite Center',
    categoryAr: 'شارع التحرير، الدقي',
    categoryEn: 'Tahrir St, Dokki',
    count: 1250,
    pct: 30,
    activeToday: 790
  },
  {
    id: 'ctr-nasr',
    titleAr: 'سنتر الرواد بمدينة نصر',
    titleEn: 'El Rowad Center - Nasr City',
    categoryAr: 'شارع عباس العقاد',
    categoryEn: 'Abbas El-Akkad St',
    count: 980,
    pct: 24,
    activeToday: 590
  }
];

export const TeacherAnalyticsCharts = ({ lang, isDark, isRtl }) => {
  const isAr = lang === 'ar';
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);
  const [distributionTab, setDistributionTab] = useState('subjects'); // 'subjects' | 'centers'

  const themeAccent = isDark ? '#38BDF8' : '#0066CC';
  const overallMasteryValue = 84.5;

  // Chart coordinate mapping (viewBox: 680 x 230)
  const chartWidth = 680;
  const chartHeight = 230;
  const paddingLeft = 72;
  const paddingRight = 36;
  const paddingTop = 36;
  const paddingBottom = 46;
  const baseline = chartHeight - paddingBottom;
  const maxStudents = 1000;

  const points = WEEKLY_TEACHER_ATTENDANCE.map((item, idx) => {
    const xStep = (chartWidth - paddingLeft - paddingRight) / (WEEKLY_TEACHER_ATTENDANCE.length - 1);
    const x = paddingLeft + idx * xStep;
    const yRatio = item.students / maxStudents;
    const y = baseline - yRatio * (baseline - paddingTop);
    return { ...item, x, y };
  });

  const { linePath, areaPath } = generateSplinePaths(points, baseline);
  const yTicks = [1000, 800, 600, 400, 200, 0];

  // Donut chart calculations
  const donutRadius = 62;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutDashOffset = donutCircumference - (overallMasteryValue / 100) * donutCircumference;

  const themeGridStroke = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.08)';
  const themeTrackStroke = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
  const themeAxisFill = isDark ? '#94A3B8' : '#64748B';

  const activeDistData = distributionTab === 'subjects' ? SUBJECTS_DISTRIBUTION : CENTERS_DISTRIBUTION;
  const totalEnrolled = 4120;

  return (
    <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ── ROW 1: EXECUTIVE CHARTS (WEEKLY ATTENDANCE SPLINE GRAPH + MASTERY DONUT) ── */}
      <div className="executive-charts-grid">
        {/* Left Chart: Weekly Attendance & Engagement (Smooth Interactive Spline Graph) */}
        <div className="executive-card executive-chart-main" style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-xs)'
        }}>
          {/* Header */}
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
                  fontFamily: 'var(--font-heading), var(--font-arabic)'
                }}>
                  {isAr ? 'معدل حضور ونشاط الطلاب — آخر 7 أيام' : 'Student Attendance & Engagement — Last 7 Days'}
                </h2>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: themeAccent,
                  backgroundColor: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(0, 102, 204, 0.08)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(0, 102, 204, 0.2)'}`
                }}>
                  {isAr ? 'عدد الطلاب النشطين يومياً' : 'Daily Active Students'}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                {isAr ? 'إجمالي الحضور والاستماع للحصص المباشرة والمسجلة' : 'Daily listeners and live session attendance'}
              </p>
            </div>

            {/* Date Tag Badge */}
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
              <span>{isAr ? 'آخر 7 أيام' : 'Last 7 Days'}</span>
            </div>
          </div>

          {/* Interactive SVG Area Spline Visualizer */}
          <div style={{ position: 'relative', width: '100%', height: '240px' }}>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="teacherAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={themeAccent} stopOpacity={isDark ? 0.32 : 0.24} />
                  <stop offset="90%" stopColor={themeAccent} stopOpacity={0.02} />
                  <stop offset="100%" stopColor={themeAccent} stopOpacity={0.0} />
                </linearGradient>

                <filter id="teacherGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={themeAccent} floodOpacity={0.65} />
                </filter>
              </defs>

              {/* Y-Axis Label */}
              <text
                x={paddingLeft - 10}
                y={paddingTop - 14}
                textAnchor="end"
                fill={themeAccent}
                fontSize="10.5"
                fontFamily="var(--font-arabic)"
                fontWeight="800"
              >
                {isAr ? 'الطلاب' : 'Students'}
              </text>

              {/* Y-Axis Horizontal Dashed Grid Lines */}
              {yTicks.map((tick) => {
                const yRatio = tick / maxStudents;
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
                      {tick}
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
              <path d={areaPath} fill="url(#teacherAreaGrad)" />

              {/* Spline Line */}
              <path
                d={linePath}
                fill="none"
                stroke={themeAccent}
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Points & Day Markers */}
              {points.map((p, idx) => {
                const isHovered = hoveredPointIndex === idx;
                return (
                  <g key={idx}>
                    {/* Vertical Guideline */}
                    <line
                      x1={p.x}
                      y1={p.y + 6}
                      x2={p.x}
                      y2={baseline + 5}
                      stroke={p.isToday || p.isPeak ? themeAccent : themeGridStroke}
                      strokeDasharray="3 3"
                      strokeWidth={p.isToday || p.isPeak ? '1.5' : '1'}
                      opacity={p.isToday || p.isPeak ? 0.75 : 0.4}
                    />

                    {/* Value Badge directly above point */}
                    <g>
                      <rect
                        x={p.x - 22}
                        y={p.y - 25}
                        width="44"
                        height="18"
                        rx="5"
                        fill={p.isPeak ? '#10B981' : p.isToday ? themeAccent : (isDark ? '#1E293B' : '#F1F5F9')}
                        stroke={p.isPeak ? '#10B981' : p.isToday ? themeAccent : (isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.12)')}
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
                        {p.students}
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

                    {/* Glow & Point Dot */}
                    {(isHovered || p.isPeak || p.isToday) && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 8 : 6}
                        fill={isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(0, 102, 204, 0.2)'}
                        filter="url(#teacherGlow)"
                      />
                    )}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 5 : 3.8}
                      fill={isDark ? '#0E1726' : '#FFFFFF'}
                      stroke={p.isPeak ? '#10B981' : themeAccent}
                      strokeWidth="2.5"
                    />

                    {/* Day Label */}
                    <text
                      x={p.x}
                      y={baseline + 20}
                      textAnchor="middle"
                      fill={p.isToday ? themeAccent : p.isPeak ? '#10B981' : (isDark ? '#E2E8F0' : '#334155')}
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
                border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(0, 102, 204, 0.25)'}`,
                boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.12)',
                padding: '7px 13px',
                borderRadius: '8px',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                zIndex: 20,
                fontSize: '12px',
                color: 'var(--text-primary)'
              }}>
                <div style={{ color: themeAccent, fontSize: '11px', fontWeight: '800', marginBottom: '2px' }}>
                  {isAr ? points[hoveredPointIndex].dayAr : points[hoveredPointIndex].dayEn} • {points[hoveredPointIndex].hours} {isAr ? 'ساعة استماع' : 'hours'}
                </div>
                <div style={{ fontWeight: '800' }}>
                  {points[hoveredPointIndex].students.toLocaleString()} {isAr ? 'طالب نشط' : 'active students'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {points[hoveredPointIndex].topTopic}
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
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
                {isAr ? 'الخميس (960 طالباً • 61 ساعة استماع)' : 'Thursday (960 students • 61 hrs)'}
              </span>
            </div>

            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              {isAr ? 'متوسط الاستماع الأسبوعي: 48.5 ساعة/يوم' : 'Weekly Avg: 48.5 hrs/day'}
            </span>
          </div>
        </div>

        {/* Right Chart: Class Mastery & Comprehension Donut Gauge */}
        <div className="executive-card executive-chart-side" style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Award size={18} color="var(--primary)" />
              <h2 style={{
                fontSize: '16px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                margin: 0,
                fontFamily: 'var(--font-heading), var(--font-arabic)'
              }}>
                {isAr ? 'معدل إتقان واستيعاب الدفعة' : 'Class Mastery & Comprehension'}
              </h2>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              {isAr ? 'مؤشر الفهم التراكمي لأسئلة الكويزات وشروحات الذكاء الاصطناعي' : 'Cumulative quiz & AI concept comprehension'}
            </p>
          </div>

          {/* Donut Circle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '12px 0'
          }}>
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle
                cx="75"
                cy="75"
                r={donutRadius}
                fill="transparent"
                stroke={themeTrackStroke}
                strokeWidth="12"
              />
              <circle
                cx="75"
                cy="75"
                r={donutRadius}
                fill="transparent"
                stroke={themeAccent}
                strokeWidth="12"
                strokeDasharray={donutCircumference}
                strokeDashoffset={donutDashOffset}
                strokeLinecap="round"
                transform="rotate(-90 75 75)"
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
                fontSize: '26px',
                fontWeight: '900',
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
                fontWeight: '600'
              }}>
                {isAr ? 'معدل الإتقان العام' : 'Overall Mastery'}
              </span>
            </div>
          </div>

          {/* Subject Breakdown List */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            paddingTop: '10px',
            borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.08)'}`
          }}>
            {SUBJECT_MASTERY_DATA.map((sub, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
                  {isAr ? sub.nameAr : sub.nameEn}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    ({sub.students.toLocaleString()} {isAr ? 'طالب' : 'std'})
                  </span>
                  <span style={{
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)',
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '2px 6px',
                    borderRadius: '5px'
                  }}>
                    {sub.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 2: CLEAN NEUTRAL CARDS FOR SUBJECTS & CENTERS ── */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        {/* Header & Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--primary)" />
              <h3 style={{
                fontSize: '16px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                {isAr ? 'توزيع الطلاب المسجلين' : 'Enrolled Student Distribution'}
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
              {isAr
                ? 'عرض منقسم في بطاقات هادئة وواضحة حسب المواد أو السناتر والفروع'
                : 'Divided into clean, neutral cards by subject or teaching branch'}
            </p>
          </div>

          {/* Switcher Toggle */}
          <div style={{
            display: 'inline-flex',
            padding: '3px',
            borderRadius: '10px',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setDistributionTab('subjects')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '12px',
                fontWeight: distributionTab === 'subjects' ? '800' : '600',
                backgroundColor: distributionTab === 'subjects' ? (isDark ? 'var(--primary)' : '#FFFFFF') : 'transparent',
                color: distributionTab === 'subjects' ? (isDark ? '#FFFFFF' : 'var(--primary)') : 'var(--text-secondary)',
                boxShadow: distributionTab === 'subjects' ? (isDark ? 'none' : '0 2px 6px rgba(0,0,0,0.08)') : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <BookOpen size={14} />
              <span>{isAr ? 'حسب المواد والمراحل' : 'By Subject'}</span>
            </button>

            <button
              onClick={() => setDistributionTab('centers')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '12px',
                fontWeight: distributionTab === 'centers' ? '800' : '600',
                backgroundColor: distributionTab === 'centers' ? (isDark ? 'var(--primary)' : '#FFFFFF') : 'transparent',
                color: distributionTab === 'centers' ? (isDark ? '#FFFFFF' : 'var(--primary)') : 'var(--text-secondary)',
                boxShadow: distributionTab === 'centers' ? (isDark ? 'none' : '0 2px 6px rgba(0,0,0,0.08)') : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Building2 size={14} />
              <span>{isAr ? 'حسب المقرات والسناتر' : 'By Centers'}</span>
            </button>
          </div>
        </div>

        {/* Clean Neutral Cards Grid (Responsive & Adaptive) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
          gap: '14px'
        }}>
          {activeDistData.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-medium)';
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'var(--text-muted)',
                    backgroundColor: 'var(--bg-surface)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {isAr ? item.categoryAr : item.categoryEn}
                  </span>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-surface)',
                    padding: '2px 7px',
                    borderRadius: '6px'
                  }}>
                    {item.pct}%
                  </span>
                </div>

                <div style={{
                  fontSize: '14px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                  lineHeight: 1.3
                }}>
                  {isAr ? item.titleAr : item.titleEn}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{
                    fontSize: '22px',
                    fontWeight: '900',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {item.count.toLocaleString()}
                    <span style={{ fontSize: '12px', fontWeight: '600', marginInlineStart: '4px', color: 'var(--text-secondary)' }}>
                      {isAr ? 'طالب' : 'students'}
                    </span>
                  </div>

                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    {item.activeToday.toLocaleString()} {isAr ? 'نشط اليوم' : 'active today'}
                  </span>
                </div>

                {/* Neutral clean progress bar */}
                <div style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${item.pct}%`,
                    height: '100%',
                    backgroundColor: 'var(--text-primary)',
                    opacity: 0.75,
                    borderRadius: '6px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Summary Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '16px',
          marginTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="var(--primary)" />
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {isAr
                ? `إجمالي الطلاب المسجلين مع المدرس: ${totalEnrolled.toLocaleString()} طالباً`
                : `Total Enrolled Students: ${totalEnrolled.toLocaleString()}`}
            </span>
          </div>

          <span style={{
            fontSize: '11.5px',
            color: 'var(--success)',
            fontWeight: '700',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.12)' : '#ECFDF5',
            padding: '2px 8px',
            borderRadius: '6px'
          }}>
            {isAr ? 'سعة الفصول منتظمة 100%' : '100% Active Capacity'}
          </span>
        </div>
      </div>
    </div>
  );
};
