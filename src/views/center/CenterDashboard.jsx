import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCenter } from '../../context/CenterContext';
import { useGroups } from '../../context/GroupsContext';
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
  { dayAr: 'السبت', dayEn: 'Sat', students: 620, hours: 38, isToday: false },
  { dayAr: 'الأحد', dayEn: 'Sun', students: 840, hours: 52, isToday: false },
  { dayAr: 'الإثنين', dayEn: 'Mon', students: 710, hours: 44, isToday: false },
  { dayAr: 'الثلاثاء', dayEn: 'Tue', students: 890, hours: 56, isToday: false },
  { dayAr: 'الأربعاء', dayEn: 'Wed', students: 680, hours: 42, isToday: false },
  { dayAr: 'الخميس', dayEn: 'Thu', students: 960, hours: 61, isPeak: true, isToday: false },
  { dayAr: 'الجمعة', dayEn: 'Fri', students: 750, hours: 47, isToday: true }
];

export const CenterDashboard = () => {
  const { lang, isRtl } = useLanguage();
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
  const paddingLeft = 72;
  const paddingRight = 36;
  const paddingTop = 36;
  const paddingBottom = 46;
  const baseline = chartHeight - paddingBottom;
  const maxStudents = 1000;
  const themeAccent = '#0066CC';

  const points = WEEKLY_ATTENDANCE_DATA.map((item, idx) => {
    const xStep = (chartWidth - paddingLeft - paddingRight) / (WEEKLY_ATTENDANCE_DATA.length - 1);
    const x = paddingLeft + idx * xStep;
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
                {lang === 'ar' ? 'غرفة العمليات الرئيسية للسنتر' : 'Center Command Center'}
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
        <div style={{
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
        <div style={{
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
        <div style={{
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
        <div style={{
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        alignItems: 'stretch'
      }}>
        {/* Left Column: Curved Spline Attendance Graph (Identical to Teacher/Student & User screenshot) */}
        <div style={{
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
                    margin: 0
                  }}>
                    {lang === 'ar' ? 'حضور الطلاب' : 'Student Attendance'}
                  </h2>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: themeAccent,
                    backgroundColor: 'rgba(0, 102, 204, 0.08)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(0, 102, 204, 0.2)'
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
                background: 'rgba(15, 23, 42, 0.04)',
                border: '1px solid rgba(15, 23, 42, 0.08)',
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
                    <stop offset="0%" stopColor={themeAccent} stopOpacity={0.24} />
                    <stop offset="90%" stopColor={themeAccent} stopOpacity={0.02} />
                    <stop offset="100%" stopColor={themeAccent} stopOpacity={0.0} />
                  </linearGradient>

                  <filter id="centerGlow" x="-50%" y="-50%" width="200%" height="200%">
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
                  {lang === 'ar' ? 'الطلاب' : 'Students'}
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
                        fill="#64748B"
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
                        stroke="rgba(15, 23, 42, 0.08)"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                    </g>
                  );
                })}

                {/* Spline Area Fill */}
                <path d={areaPath} fill="url(#centerAreaGrad)" />

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
                        stroke={p.isToday || p.isPeak ? themeAccent : 'rgba(15, 23, 42, 0.08)'}
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
                          fill={p.isPeak ? '#10B981' : p.isToday ? themeAccent : '#F1F5F9'}
                          stroke={p.isPeak ? '#10B981' : p.isToday ? themeAccent : 'rgba(15, 23, 42, 0.12)'}
                          strokeWidth="1"
                        />
                        <text
                          x={p.x}
                          y={p.y - 12}
                          textAnchor="middle"
                          fill={p.isPeak || p.isToday ? '#FFFFFF' : '#1E293B'}
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
                          fill="rgba(0, 102, 204, 0.2)"
                          filter="url(#centerGlow)"
                        />
                      )}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 5 : 3.8}
                        fill="#FFFFFF"
                        stroke={p.isPeak ? '#10B981' : themeAccent}
                        strokeWidth="2.5"
                      />

                      {/* Day Axis Label */}
                      <text
                        x={p.x}
                        y={chartHeight - 12}
                        textAnchor="middle"
                        fill={p.isToday ? themeAccent : p.isPeak ? '#10B981' : '#64748B'}
                        fontSize="11"
                        fontFamily="var(--font-arabic)"
                        fontWeight={p.isToday || p.isPeak ? '800' : '600'}
                      >
                        {p.dayAr}
                        {p.isPeak ? ' (الذروة)' : p.isToday ? ' (اليوم)' : ''}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Quick Insights Row Below Chart */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '16px',
            paddingTop: '14px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '12px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span style={{ color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'ذروة الأسبوع:' : 'Weekly Peak:'}{' '}
                <strong style={{ color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'الخميس (960 طالباً • 61 ساعة استماع)' : 'Thursday (960 students • 61 hrs)'}
                </strong>
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>
              {lang === 'ar' ? 'متوسط الاستماع الأسبوعي: 48.5 ساعة/يوم' : 'Weekly average: 48.5 hrs/day'}
            </span>
          </div>
        </div>

        {/* Right Column: Hall Occupancy Side Widget (No progress bars under rooms, clean percentage badge) */}
        <div style={{
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
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  <Layers size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? 'إشغال القاعات والطاقة الاستيعابية' : 'Halls Capacity & Occupancy'}
                  </h2>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? `${branchRooms.length} قاعات دراسية مسجلة` : `${branchRooms.length} registered rooms`}
                  </span>
                </div>
              </div>

              <span style={{
                fontSize: '11.5px',
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
              padding: '14px',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '16px'
            }}>
              {/* Circular SVG Donut Gauge */}
              <div style={{ position: 'relative', width: '104px', height: '104px' }}>
                <svg width="104" height="104" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="60"
                    cy="60"
                    r={donutRadius}
                    fill="none"
                    stroke="var(--bg-subtle)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={donutRadius}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="10"
                    strokeDasharray={donutCircumference}
                    strokeDashoffset={donutDashOffset}
                    strokeLinecap="round"
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
                  <span style={{ fontSize: '19px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1 }}>
                    {overallOccupancyPct}%
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '700', marginTop: '2px' }}>
                    {lang === 'ar' ? 'الإشغال' : 'Occupied'}
                  </span>
                </div>
              </div>

              {/* Total Seats Counter */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>
                    {lang === 'ar' ? 'المقاعد المشغولة حالياً' : 'Occupied Seats'}
                  </span>
                  <span style={{ fontSize: '17px', fontWeight: '900', color: 'var(--primary)' }}>
                    {totalCenterOccupied} <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>/ {totalCenterCapacity}</span>
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>
                    {lang === 'ar' ? 'المقاعد الشاغرة' : 'Available Seats'}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--success)' }}>
                    {totalCenterCapacity - totalCenterOccupied} مقعد شاغر
                  </span>
                </div>
              </div>
            </div>

            {/* Per-Hall Capacity Breakdown (Pure text & badge, NO progress bars underneath as requested) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '2px' }}>
                {lang === 'ar' ? 'تفصيل إشغال القاعات:' : 'Per-Room Breakdown:'}
              </span>

              {roomOccupancyStats.slice(0, 5).map((room) => (
                <div
                  key={room.id}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: '800', fontSize: '12.5px', color: 'var(--text-primary)', display: 'block' }}>
                      {lang === 'ar' ? room.nameAr : room.nameEn}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                      {room.floor} • {room.occupied} / {room.capacity} مقعد
                    </span>
                  </div>

                  <span style={{
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    fontWeight: '800',
                    backgroundColor: room.pct >= 90 ? 'rgba(245, 158, 11, 0.12)' : 'var(--primary-light)',
                    color: room.pct >= 90 ? 'var(--warning)' : 'var(--primary)',
                    border: `1px solid ${room.pct >= 90 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(21, 136, 199, 0.25)'}`
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
            style={{
              marginTop: '16px',
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--primary)',
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
