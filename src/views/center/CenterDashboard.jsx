import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCenter } from '../../context/CenterContext';
import { useGroups } from '../../context/GroupsContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  Activity, 
  Calendar, 
  Layers, 
  ArrowUpRight, 
  ChevronLeft, 
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateSplinePaths } from '../../utils';

// Attendance Spline Data exactly matching Teacher View & User screenshot
const WEEKLY_ATTENDANCE_DATA = [
  { dayAr: 'السبت', dayEn: 'Sat', students: 620, hours: 38, isToday: false, topTopic: 'الفيزياء - قانون كيرشوف والدوائر المغلقة' },
  { dayAr: 'الأحد', dayEn: 'Sun', students: 840, hours: 52, isToday: false, topTopic: 'الأحياء - البيولوجيا الجزيئية وDNA' },
  { dayAr: 'الإثنين', dayEn: 'Mon', students: 710, hours: 44, isToday: false, topTopic: 'الكيمياء - الاتزان الكيميائي ومبدأ لوشاتيليه' },
  { dayAr: 'الثلاثاء', dayEn: 'Tue', students: 890, hours: 56, isToday: false, topTopic: 'الرياضيات - التفاضل والتكامل وتطبيقاته' },
  { dayAr: 'الأربعاء', dayEn: 'Wed', students: 680, hours: 42, isToday: false, topTopic: 'اللغة العربية - نصوص متحررة وبلاغة' },
  { dayAr: 'الخميس', dayEn: 'Thu', students: 960, hours: 61, isPeak: true, isToday: false, topTopic: 'المراجعات الشاملة الأسبوعية والورش' },
  { dayAr: 'الجمعة', dayEn: 'Fri', students: 750, hours: 47, isToday: true, topTopic: 'نماذج امتحانات الوزارة وبنك الأسئلة' }
];

export const CenterDashboard = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const { 
    branches, 
    selectedBranchId, 
    setSelectedBranchId, 
    rooms 
  } = useCenter();
  const { groups } = useGroups();

  // Time filter: 'today' | 'month' | 'year'
  const [timePeriod, setTimePeriod] = useState('month');
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  const selectedBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  // Distinct teachers count
  const teachersCount = useMemo(() => {
    const teacherNames = new Set(groups.map(g => g.teacherNameAr).filter(Boolean));
    return Math.max(28, teacherNames.size);
  }, [groups]);

  // Hall Occupancy and capacity calculations
  const branchRooms = useMemo(() => {
    const list = rooms.filter(r => !selectedBranchId || r.branchId === selectedBranchId || !r.branchId);
    return list.length > 0 ? list : rooms;
  }, [rooms, selectedBranchId]);

  const roomOccupancyStats = useMemo(() => {
    const sampleOccupiedRatios = [0.89, 0.92, 0.82, 0.78, 0.86];
    return branchRooms.map((r, i) => {
      const ratio = sampleOccupiedRatios[i % sampleOccupiedRatios.length];
      const occupied = Math.round(r.capacity * ratio);
      const pct = Math.round(ratio * 100);
      return {
        ...r,
        occupied,
        pct
      };
    });
  }, [branchRooms]);

  const totalCenterCapacity = roomOccupancyStats.reduce((sum, r) => sum + (r.capacity || 0), 0) || 250;
  const totalCenterOccupied = roomOccupancyStats.reduce((sum, r) => sum + r.occupied, 0) || 215;
  const overallOccupancyPct = Math.round((totalCenterOccupied / totalCenterCapacity) * 100) || 86;

  // Donut Gauge calculations
  const donutRadius = 46;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutDashOffset = donutCircumference - (overallOccupancyPct / 100) * donutCircumference;

  // ── SPLINE GRAPH SETUP (viewBox: 680 x 230) ──
  const chartWidth = 680;
  const chartHeight = 230;
  const axisLeft = 56;
  const graphLeft = 90;
  const graphRight = chartWidth - 36;
  const paddingTop = 36;
  const paddingBottom = 46;
  const baseline = chartHeight - paddingBottom;
  const maxStudents = 1000;

  const themeAccent = isDark ? '#38BDF8' : '#0066CC';
  const themeGridStroke = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.08)';
  const themeAxisFill = isDark ? '#94A3B8' : '#64748B';

  const points = WEEKLY_ATTENDANCE_DATA.map((item, idx) => {
    const xStep = (graphRight - graphLeft) / (WEEKLY_ATTENDANCE_DATA.length - 1);
    const x = graphLeft + idx * xStep;
    const yRatio = item.students / maxStudents;
    const y = baseline - yRatio * (baseline - paddingTop);
    return { ...item, x, y };
  });

  const { linePath, areaPath } = generateSplinePaths(points, baseline);
  const yTicks = [1000, 800, 600, 400, 200, 0];

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
    }}>
      {/* Top Bar: Center Identity & Branch Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
        backgroundColor: 'var(--bg-surface)',
        padding: '18px 24px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'rgba(21, 136, 199, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                color: 'var(--primary)',
                letterSpacing: '0.6px',
                textTransform: 'uppercase'
              }}>
                {lang === 'ar' ? 'لوحة التحكم' : 'Control Panel'}
              </span>
              <span style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                fontWeight: '700'
              }}>
                {lang === 'ar' ? 'مباشر • تشغيل مستقر' : 'LIVE • Nominal'}
              </span>
            </div>
            <h1 style={{
              fontSize: '22px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: '2px 0 0 0'
            }}>
              {lang === 'ar' ? 'أكاديمية الرواد التعليمية' : 'Al-Rowad Educational Academy'}
            </h1>
          </div>
        </div>

        {/* Branch Selector + Period Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all">
              {lang === 'ar' ? 'جميع الفروع' : 'All Branches'}
            </option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>
                {lang === 'ar' ? b.nameAr : b.nameEn}
              </option>
            ))}
          </select>

          {/* Time Filter Pills */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-subtle)',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            {[
              { id: 'today', labelAr: 'اليوم', labelEn: 'Today' },
              { id: 'month', labelAr: 'الشهر الحالي', labelEn: 'This Month' },
              { id: 'year', labelAr: 'السنة', labelEn: 'Year' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setTimePeriod(p.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: timePeriod === p.id ? 'var(--primary)' : 'transparent',
                  color: timePeriod === p.id ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {lang === 'ar' ? p.labelAr : p.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4 KPI CARDS (Requested by User: Students, Teachers, Rooms Count, Room Utilization) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* KPI 1: Active Students from Total Students */}
        <div className="center-interactive-card" style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '18px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700' }}>
              {lang === 'ar' ? 'الطلاب النشطون' : 'Active Students'}
            </span>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <Users size={17} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            680 <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>طالب نشط</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={14} />
            <span>{lang === 'ar' ? 'من إجمالي 1,250 طالب مسجل بالسنتر (54.4%)' : 'out of 1,250 registered students'}</span>
          </div>
        </div>

        {/* KPI 2: Teachers Count */}
        <div className="center-interactive-card" style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '18px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700' }}>
              {lang === 'ar' ? 'المدرسون والمحاضرون' : 'Teachers & Instructors'}
            </span>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981'
            }}>
              <GraduationCap size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {teachersCount} <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>مدرس معتمد</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {lang === 'ar' ? 'يقدمون حصصاً ومجموعات نشطة حالياً بالسنتر' : 'Active educators in center'}
          </div>
        </div>

        {/* KPI 3: Rooms Count */}
        <div className="center-interactive-card" style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '18px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700' }}>
              {lang === 'ar' ? 'القاعات الدراسية' : 'Classrooms & Halls'}
            </span>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--warning)'
            }}>
              <Building2 size={17} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {rooms.length} <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>قاعات مجهزة</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {lang === 'ar' ? `سعة إجمالية ${totalCenterCapacity} مقعد مجهز بالشاشات` : `${totalCenterCapacity} total seat capacity`}
          </div>
        </div>

        {/* KPI 4: Room Utilization */}
        <div className="center-interactive-card" style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '18px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700' }}>
              {lang === 'ar' ? 'معدل إشغال القاعات' : 'Room Utilization Rate'}
            </span>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'rgba(21, 136, 199, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <Activity size={17} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {overallOccupancyPct}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '700' }}>
            {lang === 'ar' ? 'تشغيل ممتاز بدون تعارضات زمنية' : 'Optimal schedule integrity'}
          </div>
        </div>
      </div>

      {/* ── MAIN DASHBOARD ROW: ATTENDANCE SPLINE GRAPH & HALL OCCUPANCY CARD ── */}
      <div className="executive-charts-grid">
        {/* Left Column: Curved Spline Attendance Graph (Matching Teacher View Aesthetics) */}
        <div className="executive-card executive-chart-main center-interactive-card" style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
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
                  {lang === 'ar' ? 'معدل حضور ونشاط الطلاب — آخر 7 أيام' : 'Student Attendance & Engagement — Last 7 Days'}
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
                  {lang === 'ar' ? 'عدد الطلاب النشطين يومياً' : 'Daily Active Students'}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                {lang === 'ar' ? 'إجمالي الحضور والاستماع للحصص المباشرة والمسجلة' : 'Daily listeners and live session attendance'}
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
              <span>{lang === 'ar' ? 'آخر 7 أيام' : 'Last 7 Days'}</span>
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
                <linearGradient id="centerAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={themeAccent} stopOpacity={isDark ? 0.32 : 0.24} />
                  <stop offset="90%" stopColor={themeAccent} stopOpacity={0.02} />
                  <stop offset="100%" stopColor={themeAccent} stopOpacity={0.0} />
                </linearGradient>

                <filter id="centerGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={themeAccent} floodOpacity={0.65} />
                </filter>
              </defs>

              {/* Y-Axis Label */}
              <text
                x={axisLeft - 10}
                y={paddingTop - 14}
                textAnchor="end"
                fill={themeAccent}
                fontSize="10.5"
                fontFamily="var(--font-arabic)"
                fontWeight="800"
              >
                {lang === 'ar' ? 'الطلاب' : 'Students'}
              </text>

              {/* Y-Axis Horizontal Dashed Grid Lines */}
              {yTicks.map((tick) => {
                const yRatio = tick / maxStudents;
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
                      {tick}
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

              {/* Spline Area Fill with animation */}
              <path d={areaPath} fill="url(#centerAreaGrad)" className="spline-area" />

              {/* Spline Line with smooth draw animation */}
              <path
                d={linePath}
                className="spline-line"
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
                        filter="url(#centerGlow)"
                      />
                    )}
                    {p.isToday && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="10"
                        fill="none"
                        stroke={themeAccent}
                        strokeWidth="1.5"
                        className="pulse-ring-indicator"
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

                    {/* Day Axis Label */}
                    <text
                      x={p.x}
                      y={baseline + 20}
                      textAnchor="middle"
                      fill={p.isToday ? themeAccent : p.isPeak ? '#10B981' : (isDark ? '#E2E8F0' : '#334155')}
                      fontSize="11.5"
                      fontFamily="var(--font-arabic)"
                      fontWeight={p.isToday || p.isPeak ? '800' : '600'}
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
                        {lang === 'ar' ? '(الذروة)' : '(Peak)'}
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
                  {lang === 'ar' ? points[hoveredPointIndex].dayAr : points[hoveredPointIndex].dayEn} • {points[hoveredPointIndex].hours} {lang === 'ar' ? 'ساعة تدريس' : 'teaching hrs'}
                </div>
                <div style={{ fontWeight: '800' }}>
                  {points[hoveredPointIndex].students.toLocaleString()} {lang === 'ar' ? 'طالب حاضر' : 'attending students'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {points[hoveredPointIndex].topTopic}
                </div>
              </div>
            )}
          </div>

          {/* Footer note matching Teacher View aesthetics */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '14px',
            marginTop: '12px',
            borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--border-subtle)'}`,
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'ذروة الأسبوع:' : 'Weekly Peak:'}
              </span>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'الخميس (960 طالباً • 61 ساعة تدريس)' : 'Thursday (960 students • 61 hrs)'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              <span>
                {lang === 'ar' ? 'متوسط الحضور:' : 'Daily Avg:'}{' '}
                <strong style={{ color: themeAccent, fontWeight: '800' }}>780 {lang === 'ar' ? 'طالب/يوم' : 'students'}</strong>
              </span>
              <span>
                {lang === 'ar' ? 'نسبة الالتزام:' : 'Commitment:'}{' '}
                <strong style={{ color: '#10B981', fontWeight: '800' }}>94.2%</strong>
              </span>
              <span style={{ color: 'var(--text-muted)' }}>
                {lang === 'ar' ? 'إجمالي الساعات: 340 س/أسبوع' : 'Total Hours: 340 hrs/wk'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Hall Occupancy Side Widget (Balanced to match Teacher Donut Card height) */}
        <div className="executive-card executive-chart-side center-interactive-card" style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: isDark ? 'rgba(56, 189, 248, 0.12)' : 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: themeAccent
                }}>
                  <Layers size={19} />
                </div>
                <div>
                  <h2 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'إشغال القاعات والطاقة الاستيعابية' : 'Halls Capacity & Occupancy'}
                  </h2>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? `${branchRooms.length} قاعات دراسية مسجلة` : `${branchRooms.length} registered rooms`}
                  </span>
                </div>
              </div>

              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)'
              }}>
                {lang === 'ar' ? 'إشغال ممتاز' : 'Optimal'}
              </span>
            </div>

            {/* Circular Donut Gauge & Top Stat */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '12px',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--bg-app)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '12px'
            }}>
              {/* Circular SVG Donut Gauge */}
              <div style={{ position: 'relative', width: '90px', height: '90px' }}>
                <svg width="90" height="90" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="60"
                    cy="60"
                    r={donutRadius}
                    fill="none"
                    stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--bg-subtle)'}
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={donutRadius}
                    fill="none"
                    stroke={themeAccent}
                    strokeWidth="10"
                    strokeDasharray={donutCircumference}
                    strokeDashoffset={donutDashOffset}
                    strokeLinecap="round"
                    className="executive-donut-segment"
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1 }}>
                    {overallOccupancyPct}%
                  </span>
                  <span style={{ fontSize: '9.5px', color: 'var(--text-secondary)', fontWeight: '700', marginTop: '2px' }}>
                    {lang === 'ar' ? 'الإشغال' : 'Occupied'}
                  </span>
                </div>
              </div>

              {/* Total Seats Counter */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', display: 'block' }}>
                    {lang === 'ar' ? 'المقاعد المشغولة' : 'Occupied Seats'}
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: '900', color: themeAccent }}>
                    {totalCenterOccupied} <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>/ {totalCenterCapacity}</span>
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', display: 'block' }}>
                    {lang === 'ar' ? 'المقاعد الشاغرة' : 'Available Seats'}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--success)' }}>
                    {totalCenterCapacity - totalCenterOccupied} {lang === 'ar' ? 'مقعد شاغر' : 'seats left'}
                  </span>
                </div>
              </div>
            </div>

            {/* Per-Hall Capacity Breakdown (Compact & sleek matching Teacher style) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              paddingTop: '8px',
              borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.08)'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'أعلى القاعات إشغالاً:' : 'Top Utilized Halls:'}
                </span>
                <Link to="/center/halls" style={{ fontSize: '11px', color: themeAccent, fontWeight: '700', textDecoration: 'none' }}>
                  {lang === 'ar' ? 'عرض الكل' : 'View all'}
                </Link>
              </div>

              {roomOccupancyStats.slice(0, 3).map((room) => (
                <div
                  key={room.id}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11.5px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                      {lang === 'ar' ? room.nameAr : room.nameEn}
                    </span>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                      ({room.occupied}/{room.capacity})
                    </span>
                  </div>

                  <span style={{
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    fontWeight: '800',
                    backgroundColor: room.pct >= 90 ? 'rgba(245, 158, 11, 0.12)' : (isDark ? 'rgba(56, 189, 248, 0.12)' : 'var(--primary-light)'),
                    color: room.pct >= 90 ? 'var(--warning)' : themeAccent,
                    border: `1px solid ${room.pct >= 90 ? 'rgba(245, 158, 11, 0.3)' : (isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(21, 136, 199, 0.25)')}`
                  }}>
                    {room.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Link to Halls View */}
          <Link
            to="/center/halls"
            className="center-interactive-card"
            style={{
              marginTop: '12px',
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--bg-app)',
              color: themeAccent,
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{lang === 'ar' ? 'فتح جدول القاعات ومنع التعارضات' : 'Open Halls Schedule'}</span>
            <ChevronLeft size={15} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
          </Link>
        </div>
      </div>
    </div>
  );
};
