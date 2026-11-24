import React, { useState } from 'react';
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

export const AdminAnalyticsCharts = ({ weeklyActivity, demographics, totalUsers = 0 }) => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const isAr = lang === 'ar';
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  const days = Array.isArray(weeklyActivity?.days) && weeklyActivity.days.length >= 2
    ? weeklyActivity.days
    : EMPTY_DAYS;

  const rawMax = Math.max(...days.map(d => Number(d.users || 0)), 1);
  const maxUsers = Math.max(4, Math.ceil((rawMax * 1.25) / 4) * 4);

  const studentsInfo = demographics?.students || { count: 0, percentage: 0 };
  const teachersInfo = demographics?.teachers || { count: 0, percentage: 0 };
  const centersInfo = demographics?.centers || { count: 0, percentage: 0 };
  const parentsInfo = demographics?.parents || { count: 0, percentage: 0 };

  const totalUsersDisplay = totalUsers >= 1000
    ? `${(totalUsers / 1000).toFixed(1)}K`
    : String(totalUsers);

  const overallActivePct = Number(studentsInfo.percentage || 0);

  const chartWidth = 680;
  const chartHeight = 230;
  const axisLeft = 56;
  const graphLeft = 88;
  const graphRight = chartWidth - 36;
  const paddingTop = 36;
  const paddingBottom = 46;
  const baseline = chartHeight - paddingBottom;

  const points = days.map((item, idx) => {
    const xStep = (graphRight - graphLeft) / Math.max(1, days.length - 1);
    const x = graphLeft + idx * xStep;
    const yRatio = Number(item.users || 0) / maxUsers;
    const y = baseline - yRatio * (baseline - paddingTop);
    return { ...item, x, y };
  });

  const { linePath, areaPath } = generateSplinePaths(points, baseline);
  const yTicks = [maxUsers, Math.round(maxUsers * 0.75), Math.round(maxUsers * 0.5), Math.round(maxUsers * 0.25), 0];

  const donutRadius = 60;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutDashOffset = donutCircumference - (overallActivePct / 100) * donutCircumference;

  const themeTrackStroke = isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--bg-subtle, #E2E8F0)';
  const themeGridStroke = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.08)';
  const themeAxisFill = isDark ? '#94A3B8' : '#64748B';
  const peakDay = weeklyActivity?.peakDay || days[days.length - 1];

  return (
    <div style={{ marginBottom: '4px' }}>
      <div className="executive-charts-grid">
        {/* ── MAIN COLUMN: CURVED SPLINE USER ACTIVITY GRAPH ── */}
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
                    {isAr ? 'بيانات حية من السيرفر' : 'Live Server Data'}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  {isAr ? 'إجمالي نشاط وتفاعل حسابات المنصة (الطلاب، المعلمون، وإدارات السناتر)' : 'Daily active platform users across all roles'}
                </p>
              </div>

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

                <text x={axisLeft - 10} y={paddingTop - 14} textAnchor="end" fill="#1588C7" fontSize="11" fontFamily="var(--font-arabic)" fontWeight="800">
                  {isAr ? 'المستخدمين' : 'Users'}
                </text>

                {yTicks.map((tick, tIdx) => {
                  const yRatio = tick / maxUsers;
                  const y = baseline - yRatio * (baseline - paddingTop);
                  const formatted = tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : String(tick);
                  return (
                    <g key={tIdx}>
                      <text x={axisLeft - 10} y={y + 4} textAnchor="end" fill={themeAxisFill} fontSize="10.5" fontFamily="var(--font-heading)" fontWeight="600">
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
                        x1={p.x} y1={p.y + 6} x2={p.x} y2={baseline + 5}
                        stroke={p.isToday || p.isPeak ? '#1588C7' : themeGridStroke}
                        strokeDasharray="3 3"
                        strokeWidth={p.isToday || p.isPeak ? '1.5' : '1'}
                        opacity={p.isToday || p.isPeak ? 0.75 : 0.4}
                      />
                      <g>
                        <rect
                          x={p.x - 22} y={p.y - 25} width="44" height="18" rx="5"
                          fill={p.isPeak ? '#10B981' : p.isToday ? '#1588C7' : (isDark ? '#1E293B' : '#F1F5F9')}
                          stroke={p.isPeak ? '#10B981' : p.isToday ? '#1588C7' : (isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.12)')}
                          strokeWidth="1"
                        />
                        <text x={p.x} y={p.y - 12} textAnchor="middle" fill={p.isPeak || p.isToday ? '#FFFFFF' : (isDark ? '#E2E8F0' : '#1E293B')} fontSize="10" fontWeight="800" fontFamily="var(--font-heading)">
                          {p.usersLabel ?? p.users}
                        </text>
                      </g>

                      <circle cx={p.x} cy={p.y} r="18" fill="transparent" style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredPointIndex(idx)}
                        onMouseLeave={() => setHoveredPointIndex(null)}
                      />

                      {(isHovered || p.isPeak || p.isToday) && (
                        <circle cx={p.x} cy={p.y} r={isHovered ? 8 : 6} fill={isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(21, 136, 199, 0.2)'} filter="url(#adminCenterUsersGlow)" />
                      )}

                      <circle
                        cx={p.x} cy={p.y} r={isHovered ? 5.5 : 4}
                        fill={p.isPeak ? '#10B981' : p.isToday ? '#1588C7' : '#FFFFFF'}
                        stroke="#1588C7" strokeWidth="2"
                      />

                      <text x={p.x} y={baseline + 18} textAnchor="middle" fill={p.isToday ? '#1588C7' : p.isPeak ? '#10B981' : (isDark ? '#E2E8F0' : '#334155')} fontSize="11.5" fontWeight={p.isToday || p.isPeak ? '800' : '600'} fontFamily="var(--font-arabic)">
                        {isAr ? p.dayAr : p.dayEn}
                      </text>

                      {p.isToday && (
                        <text x={p.x} y={baseline + 33} textAnchor="middle" fill="#1588C7" fontSize="9.5" fontWeight="700" fontFamily="var(--font-arabic)">
                          {isAr ? '(اليوم)' : '(Today)'}
                        </text>
                      )}
                      {p.isPeak && !p.isToday && (
                        <text x={p.x} y={baseline + 33} textAnchor="middle" fill="#10B981" fontSize="9.5" fontWeight="700" fontFamily="var(--font-arabic)">
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
                    {isAr ? points[hoveredPointIndex].dayAr : points[hoveredPointIndex].dayEn} • {Number(points[hoveredPointIndex].hours || 0)} {isAr ? 'ساعة تفاعل' : 'hrs active'}
                  </div>
                  <div style={{ fontWeight: '800' }}>
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
            marginTop: '8px',
            borderTop: '1px solid var(--border-subtle)',
            gap: '12px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)',
                padding: '2px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '800'
              }}>
                <TrendingUp size={13} />
                <span>{isAr ? (peakDay?.dayAr || '—') : (peakDay?.dayEn || '—')}</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {Number(peakDay?.users || 0).toLocaleString()} {isAr ? 'نشط' : 'active'}
              </span>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '11.5px', color: 'var(--text-secondary)', flexShrink: 0 }}>
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

        {/* ── RIGHT COLUMN: USER DEMOGRAPHICS DONUT GAUGE ── */}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '10px',
                  backgroundColor: 'rgba(21, 136, 199, 0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#1588C7'
                }}>
                  <Layers size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                    {isAr ? 'توزيع ونسب المستخدمين' : 'User Demographics'}
                  </h2>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {isAr ? `${totalUsers.toLocaleString()} مستخدم مسجل بالمنظومة` : `${totalUsers.toLocaleString()} registered users`}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0', position: 'relative', marginBottom: '10px' }}>
              <div style={{ position: 'relative', width: '136px', height: '136px' }}>
                <svg width="136" height="136" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="80" cy="80" r={donutRadius} fill="none" stroke={themeTrackStroke} strokeWidth="13" />
                  <circle
                    cx="80" cy="80" r={donutRadius} fill="none" stroke="#1588C7" strokeWidth="13"
                    strokeDasharray={donutCircumference} strokeDashoffset={donutDashOffset} strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  />
                </svg>

                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', textAlign: 'center', pointerEvents: 'none'
                }}>
                  <span style={{ fontSize: '25px', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                    {totalUsersDisplay}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px', fontWeight: '700' }}>
                    {isAr ? 'إجمالي المستخدمين' : 'Total Users'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { labelAr: `طلاب المنصة (${studentsInfo.count.toLocaleString()})`, labelEn: `Students (${studentsInfo.count.toLocaleString()})`, pct: studentsInfo.percentage, color: '#1588C7' },
                { labelAr: `المعلمون والأساتذة (${teachersInfo.count.toLocaleString()})`, labelEn: `Teachers (${teachersInfo.count.toLocaleString()})`, pct: teachersInfo.percentage, color: '#5CB6DB' },
                { labelAr: `السناتر والمراكز (${centersInfo.count.toLocaleString()})`, labelEn: `Centers (${centersInfo.count.toLocaleString()})`, pct: centersInfo.percentage, color: '#06254E' },
                { labelAr: `أولياء الأمور (${parentsInfo.count.toLocaleString()})`, labelEn: `Parents (${parentsInfo.count.toLocaleString()})`, pct: parentsInfo.percentage, color: '#8B5CF6' }
              ].map((row, idx) => (
                <div key={idx} style={{ padding: '6px 10px', borderRadius: '8px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {isAr ? row.labelAr : row.labelEn}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: row.color }}>
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

          <div style={{ paddingTop: '10px', marginTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
            <Link
              to="/admin/dashboard?tab=users"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                fontSize: '12px', fontWeight: '800', color: '#1588C7', textDecoration: 'none'
              }}
            >
              <span>{isAr ? 'فتح سجلات المستخدمين والتوثيق' : 'Open User Management'}</span>
              {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes adminChartEntrance {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
