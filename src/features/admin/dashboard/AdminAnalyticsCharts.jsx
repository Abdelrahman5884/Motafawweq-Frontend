import React, { useState, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import {
  Calendar,
  Layers,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { generateSplinePaths } from '../../../utils';

const EMPTY_DAYS = [
  { dayAr: 'السبت', dayEn: 'Sat', users: 0, usersLabel: '0', hours: 0, isToday: false, isPeak: false },
  { dayAr: 'الأحد', dayEn: 'Sun', users: 0, usersLabel: '0', hours: 0, isToday: false, isPeak: false },
  { dayAr: 'الإثنين', dayEn: 'Mon', users: 0, usersLabel: '0', hours: 0, isToday: false, isPeak: false },
  { dayAr: 'الثلاثاء', dayEn: 'Tue', users: 0, usersLabel: '0', hours: 0, isToday: false, isPeak: false },
  { dayAr: 'الأربعاء', dayEn: 'Wed', users: 0, usersLabel: '0', hours: 0, isToday: false, isPeak: false },
  { dayAr: 'الخميس', dayEn: 'Thu', users: 0, usersLabel: '0', hours: 0, isToday: false, isPeak: false },
  { dayAr: 'الجمعة', dayEn: 'Fri', users: 0, usersLabel: '0', hours: 0, isToday: true, isPeak: false }
];

export const AdminAnalyticsCharts = memo(({ weeklyActivity, demographics, totalUsers = 0 }) => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const isAr = lang === 'ar';
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  const days = useMemo(
    () => (Array.isArray(weeklyActivity?.days) && weeklyActivity.days.length >= 2 ? weeklyActivity.days : EMPTY_DAYS),
    [weeklyActivity]
  );

  const rawMax = Math.max(...days.map(d => Number(d.users || 0)), 1);
  const maxUsers = Math.max(4, Math.ceil((rawMax * 1.25) / 4) * 4);

  const studentsInfo = demographics?.students || { count: 0, percentage: 0 };
  const teachersInfo = demographics?.teachers || { count: 0, percentage: 0 };
  const centersInfo = demographics?.centers || { count: 0, percentage: 0 };
  const parentsInfo = demographics?.parents || { count: 0, percentage: 0 };

  const totalUsersDisplay = totalUsers >= 1000
    ? `${(totalUsers / 1000).toFixed(1)}K`
    : String(totalUsers);

  const chartWidth = 680;
  const chartHeight = 250;
  const axisLeft = 52;
  const graphLeft = 84;
  const graphRight = chartWidth - 34;
  const paddingTop = 40;
  const paddingBottom = 50;
  const baseline = chartHeight - paddingBottom;

  const points = useMemo(() => days.map((item, idx) => {
    const xStep = (graphRight - graphLeft) / Math.max(1, days.length - 1);
    const x = graphLeft + idx * xStep;
    const yRatio = Number(item.users || 0) / maxUsers;
    const y = baseline - yRatio * (baseline - paddingTop);
    return { ...item, x, y };
  }), [days, maxUsers, graphLeft, graphRight, baseline, paddingTop]);

  const { linePath, areaPath } = useMemo(() => generateSplinePaths(points, baseline), [points, baseline]);
  const yTicks = [maxUsers, Math.round(maxUsers * 0.75), Math.round(maxUsers * 0.5), Math.round(maxUsers * 0.25), 0];

  // Multi-segment donut gauge calculation
  const donutRadius = 60;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const segments = useMemo(() => {
    const raw = [
      { key: 'students', pct: Number(studentsInfo.percentage || 0), color: '#1588C7' },
      { key: 'teachers', pct: Number(teachersInfo.percentage || 0), color: '#38BDF8' },
      { key: 'centers', pct: Number(centersInfo.percentage || 0), color: '#10B981' },
      { key: 'parents', pct: Number(parentsInfo.percentage || 0), color: '#8B5CF6' },
    ];
    let cumulative = 0;
    return raw.map((seg) => {
      const length = (Math.max(0, seg.pct) / 100) * donutCircumference;
      const offset = -cumulative;
      cumulative += length;
      return { ...seg, length, offset };
    });
  }, [studentsInfo.percentage, teachersInfo.percentage, centersInfo.percentage, parentsInfo.percentage, donutCircumference]);

  const themeTrackStroke = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0';
  const themeGridStroke = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.08)';
  const themeAxisFill = isDark ? '#94A3B8' : '#64748B';
  const peakDay = weeklyActivity?.peakDay || days[days.length - 1];

  return (
    <div>
      <div className="executive-charts-grid">
        {/* ── MAIN COLUMN: CURVED SPLINE USER ACTIVITY GRAPH ── */}
        <div
          className="executive-card executive-chart-main"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '22px',
            border: '1px solid var(--border-subtle)',
            padding: '22px 24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            animation: 'adminChartEntrance 0.45s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both'
          }}
        >
          <div>
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
                    borderRadius: '999px',
                    border: '1px solid rgba(21, 136, 199, 0.24)'
                  }}>
                    {isAr ? 'مباشر' : 'Live'}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  {isAr ? 'نشاط حسابات المنصة اليومي عبر الطلاب والمعلمين والسناتر' : 'Daily active accounts across students, teachers, and centers'}
                </p>
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                padding: '6px 11px',
                borderRadius: '10px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                fontWeight: '700'
              }}>
                <Calendar size={13} color="var(--primary)" />
                <span>{isAr ? 'آخر 7 أيام' : 'Last 7 Days'}</span>
              </div>
            </div>

            <div style={{ position: 'relative', width: '100%' }}>
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="xMidYMid meet"
                style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="adminUsersAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1588C7" stopOpacity={isDark ? 0.34 : 0.24} />
                    <stop offset="88%" stopColor="#1588C7" stopOpacity={0.03} />
                    <stop offset="100%" stopColor="#1588C7" stopOpacity={0.0} />
                  </linearGradient>
                  <filter id="adminCenterUsersGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2.8" floodColor="#1588C7" floodOpacity={0.5} />
                  </filter>
                </defs>

                {yTicks.map((tick, tIdx) => {
                  const yRatio = tick / maxUsers;
                  const y = baseline - yRatio * (baseline - paddingTop);
                  const formatted = tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : String(tick);
                  return (
                    <g key={tIdx}>
                      <text x={axisLeft - 8} y={y + 4} textAnchor="end" fill={themeAxisFill} fontSize="10.5" fontFamily="var(--font-heading)" fontWeight="600">
                        {formatted}
                      </text>
                      <line x1={axisLeft} y1={y} x2={graphRight} y2={y} stroke={themeGridStroke} strokeDasharray="4 4" strokeWidth="1" />
                    </g>
                  );
                })}

                <path d={areaPath} fill="url(#adminUsersAreaGrad)" />
                <path d={linePath} fill="none" stroke="#1588C7" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" filter="url(#adminCenterUsersGlow)" />

                {points.map((p, idx) => {
                  const isHovered = hoveredPointIndex === idx;
                  return (
                    <g key={idx}>
                      <line
                        x1={p.x} y1={p.y + 6} x2={p.x} y2={baseline + 4}
                        stroke={p.isToday || p.isPeak ? '#1588C7' : themeGridStroke}
                        strokeDasharray="3 3"
                        strokeWidth={p.isToday || p.isPeak ? '1.4' : '1'}
                        opacity={p.isToday || p.isPeak ? 0.7 : 0.35}
                      />

                      <rect
                        x={p.x - 21} y={p.y - 26} width="42" height="18" rx="6"
                        fill={p.isPeak ? '#10B981' : p.isToday ? '#1588C7' : (isDark ? '#102A4C' : '#F1F5F9')}
                        stroke={p.isPeak ? '#10B981' : p.isToday ? '#1588C7' : (isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(15, 23, 42, 0.1)')}
                        strokeWidth="1"
                      />
                      <text x={p.x} y={p.y - 13.5} textAnchor="middle" fill={p.isPeak || p.isToday ? '#FFFFFF' : (isDark ? '#E2E8F0' : '#1E293B')} fontSize="10" fontWeight="800" fontFamily="var(--font-heading)">
                        {p.usersLabel ?? p.users}
                      </text>

                      <circle cx={p.x} cy={p.y} r="18" fill="transparent" style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredPointIndex(idx)}
                        onMouseLeave={() => setHoveredPointIndex(null)}
                      />

                      {(isHovered || p.isPeak || p.isToday) && (
                        <circle cx={p.x} cy={p.y} r={isHovered ? 8.5 : 6.5} fill={isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(21, 136, 199, 0.2)'} />
                      )}

                      <circle
                        cx={p.x} cy={p.y} r={isHovered ? 5.5 : 4.2}
                        fill={p.isPeak ? '#10B981' : p.isToday ? '#1588C7' : '#FFFFFF'}
                        stroke="#1588C7" strokeWidth="2.2"
                      />

                      <text x={p.x} y={baseline + 20} textAnchor="middle" fill={p.isToday ? '#1588C7' : p.isPeak ? '#10B981' : (isDark ? '#E2E8F0' : '#334155')} fontSize="11.5" fontWeight={p.isToday || p.isPeak ? '800' : '600'} fontFamily="var(--font-arabic)">
                        {isAr ? p.dayAr : p.dayEn}
                      </text>

                      {p.isToday && (
                        <text x={p.x} y={baseline + 35} textAnchor="middle" fill="#1588C7" fontSize="9.5" fontWeight="700" fontFamily="var(--font-arabic)">
                          {isAr ? '(اليوم)' : '(Today)'}
                        </text>
                      )}
                      {p.isPeak && !p.isToday && (
                        <text x={p.x} y={baseline + 35} textAnchor="middle" fill="#10B981" fontSize="9.5" fontWeight="700" fontFamily="var(--font-arabic)">
                          {isAr ? '(الذروة)' : '(Peak)'}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {hoveredPointIndex !== null && points[hoveredPointIndex] && (
                <div style={{
                  position: 'absolute',
                  left: `${(points[hoveredPointIndex].x / chartWidth) * 100}%`,
                  top: `${(points[hoveredPointIndex].y / chartHeight) * 100}%`,
                  transform: 'translate(-50%, -148%)',
                  background: isDark ? 'rgba(8, 29, 55, 0.96)' : 'rgba(255, 255, 255, 0.98)',
                  border: '1.5px solid #1588C7',
                  boxShadow: '0 10px 26px rgba(6, 37, 78, 0.16)',
                  padding: '8px 13px',
                  borderRadius: '10px',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  zIndex: 20,
                  fontSize: '12px',
                  color: 'var(--text-primary)'
                }}>
                  <div style={{ color: 'var(--primary)', fontSize: '11px', fontWeight: '800', marginBottom: '2px' }}>
                    {isAr ? points[hoveredPointIndex].dayAr : points[hoveredPointIndex].dayEn} • {Number(points[hoveredPointIndex].hours || 0)} {isAr ? 'ساعة' : 'hrs'}
                  </div>
                  <div style={{ fontWeight: '900' }}>
                    {Number(points[hoveredPointIndex].users || 0).toLocaleString()} {isAr ? 'مستخدم نشط' : 'active users'}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            marginTop: '10px',
            borderTop: '1px solid var(--border-subtle)',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                color: '#059669', backgroundColor: 'rgba(16, 185, 129, 0.12)',
                padding: '3px 9px', borderRadius: '8px', fontSize: '11.5px', fontWeight: '800'
              }}>
                <TrendingUp size={13} />
                <span>{isAr ? (peakDay?.dayAr || '—') : (peakDay?.dayEn || '—')}</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {Number(peakDay?.users || 0).toLocaleString()} {isAr ? 'ذروة النشاط' : 'peak active'}
              </span>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span>
                <strong style={{ color: 'var(--text-primary)' }}>{Number(weeklyActivity?.averageDailyUsers || 0).toLocaleString()}</strong> {isAr ? 'متوسط يومي' : 'daily avg'}
              </span>
              <span>•</span>
              <span>
                <strong style={{ color: 'var(--text-primary)' }}>{Number(weeklyActivity?.totalActiveHours || 0).toLocaleString()}</strong> {isAr ? 'ساعة مذاكرة' : 'study hrs'}
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: MULTI-SEGMENT USER DEMOGRAPHICS DONUT ── */}
        <div
          className="executive-card executive-chart-side"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '22px',
            border: '1px solid var(--border-subtle)',
            padding: '22px 20px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            animation: 'adminChartEntrance 0.45s 0.22s cubic-bezier(0.16, 1, 0.3, 1) both'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '11px',
                backgroundColor: 'rgba(21, 136, 199, 0.12)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
              }}>
                <Layers size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                  {isAr ? 'توزيع مستخدمي المنصة' : 'User Demographics'}
                </h2>
                <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                  {isAr ? `${totalUsers.toLocaleString()} حساب مسجل` : `${totalUsers.toLocaleString()} total accounts`}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0 12px', position: 'relative' }}>
              <div style={{ position: 'relative', width: '144px', height: '144px' }}>
                <svg width="144" height="144" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="80" cy="80" r={donutRadius} fill="none" stroke={themeTrackStroke} strokeWidth="14" />
                  {segments.map((seg) => seg.length > 0 && (
                    <circle
                      key={seg.key}
                      cx="80"
                      cy="80"
                      r={donutRadius}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="14"
                      strokeDasharray={`${seg.length} ${donutCircumference}`}
                      strokeDashoffset={seg.offset}
                      style={{ transition: 'stroke-dasharray 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                  ))}
                </svg>

                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', textAlign: 'center', pointerEvents: 'none'
                }}>
                  <span style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                    {totalUsersDisplay}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '700' }}>
                    {isAr ? 'إجمالي الحسابات' : 'Total Users'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { labelAr: `طلاب المنصة (${studentsInfo.count.toLocaleString()})`, labelEn: `Students (${studentsInfo.count.toLocaleString()})`, pct: studentsInfo.percentage, color: '#1588C7' },
                { labelAr: `المعلمون (${teachersInfo.count.toLocaleString()})`, labelEn: `Teachers (${teachersInfo.count.toLocaleString()})`, pct: teachersInfo.percentage, color: '#38BDF8' },
                { labelAr: `السناتر التعليمية (${centersInfo.count.toLocaleString()})`, labelEn: `Centers (${centersInfo.count.toLocaleString()})`, pct: centersInfo.percentage, color: '#10B981' },
                { labelAr: `أولياء الأمور (${parentsInfo.count.toLocaleString()})`, labelEn: `Parents (${parentsInfo.count.toLocaleString()})`, pct: parentsInfo.percentage, color: '#8B5CF6' }
              ].map((row, idx) => (
                <div key={idx} style={{ padding: '7px 10px', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: row.color }} />
                      <span>{isAr ? row.labelAr : row.labelEn}</span>
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: row.color, fontVariantNumeric: 'tabular-nums' }}>
                      {row.pct}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, Math.max(row.pct > 0 ? 4 : 0, row.pct))}%`, height: '100%', backgroundColor: row.color, borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ paddingTop: '12px', marginTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
            <Link
              to="/admin/dashboard?tab=users"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                fontSize: '12px', fontWeight: '800', color: 'var(--primary)', textDecoration: 'none'
              }}
            >
              <span>{isAr ? 'فتح إدارة المستخدمين والتوثيق' : 'Open User Management'}</span>
              {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes adminChartEntrance {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
});

AdminAnalyticsCharts.displayName = 'AdminAnalyticsCharts';
