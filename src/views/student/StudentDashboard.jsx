import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  STUDENT_PROFILE,
  TODAY_TASKS,
  UPCOMING_EXAMS,
  HOMEWORK_LIST,
  COURSES_CATALOG,
  SUBJECTS_LIST
} from '../../data/studentData';
import {
  Play,
  BookOpen,
  FileText,
  ClipboardList,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Target,
  TrendingUp,
  Award,
  Zap,
  GraduationCap,
  ChevronDown,
  ExternalLink,
  Sparkles,
  Layers,
  ChevronRight,
  Check,
  Flame,
  AlertCircle,
  FileCheck2,
  HelpCircle
} from 'lucide-react';
import { SPage } from '../../components/student/ui';

// Weekly Study Data (7 days) for the interactive SVG Area Spline Graph
const WEEKLY_STUDY_DATA = [
  { dayAr: 'السبت', dayEn: 'Sat', minutes: 45, lessons: 2, isToday: false },
  { dayAr: 'الأحد', dayEn: 'Sun', minutes: 70, lessons: 3, isToday: false },
  { dayAr: 'الإثنين', dayEn: 'Mon', minutes: 55, lessons: 2, isToday: false },
  { dayAr: 'الثلاثاء', dayEn: 'Tue', minutes: 85, lessons: 4, isToday: false },
  { dayAr: 'الأربعاء', dayEn: 'Wed', minutes: 40, lessons: 1, isToday: false },
  { dayAr: 'الخميس', dayEn: 'Thu', minutes: 80, lessons: 3, isToday: false },
  { dayAr: 'الجمعة', dayEn: 'Fri', minutes: 65, lessons: 2, isToday: true }
];

// Helper to compute smooth cubic spline curve path
function generateSplinePaths(points, baseline = 165) {
  if (!points || points.length === 0) return { linePath: '', areaPath: '' };
  let linePath = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 >= points.length ? points.length - 1 : i + 2];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    linePath += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  const areaPath = `${linePath} L ${points[points.length - 1].x},${baseline} L ${points[0].x},${baseline} Z`;
  return { linePath, areaPath };
}

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const student = STUDENT_PROFILE;

  // Active filter state for subjects
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  // Filter state for Today's Tasks (US-10)
  const [taskCategoryFilter, setTaskCategoryFilter] = useState('all'); // 'all' | 'lesson' | 'homework' | 'quiz'

  // Interactive Today's Tasks with toggle capability (US-10)
  const [tasks, setTasks] = useState(
    TODAY_TASKS.map(t => ({
      ...t,
      isCompleted: t.status === 'completed'
    }))
  );

  // Toggle task completed with celebration confetti
  const toggleTaskCompleted = (taskId) => {
    setTasks(prev => {
      return prev.map(t => {
        if (t.id === taskId) {
          const nextState = !t.isCompleted;
          if (nextState) {
            try {
              confetti({
                particleCount: 45,
                spread: 60,
                origin: { y: 0.7 }
              });
            } catch (e) {
              // ignore
            }
          }
          return { ...t, isCompleted: nextState, status: nextState ? 'completed' : 'pending' };
        }
        return t;
      });
    });
  };

  const completedTasksCount = tasks.filter(t => t.isCompleted).length;
  const filteredTasks = tasks.filter(t => {
    if (taskCategoryFilter === 'all') return true;
    return t.type === taskCategoryFilter;
  });

  // Active last studied course for US-08 and US-09
  const lastLesson = {
    courseId: 'course-bio-301',
    titleAr: 'البناء الضوئي وحركية الطاقة في الخلايا النباتية',
    titleEn: 'Photosynthesis & Cellular Energy Dynamics',
    subjectAr: 'الأحياء',
    subjectEn: 'Biology',
    teacherAr: 'د. سلمى السيد',
    teacherEn: 'Dr. Salma El-Sayed',
    lessonNumber: 3,
    totalLessons: 12,
    progressPercent: 68,
    pausedMinute: '08:00',
    totalDuration: '35:00',
    remainingMinutes: 14,
    nextLessonTitleAr: 'التنفس الخلوي وحلقة كريبس',
    nextLessonTitleEn: 'Cellular Respiration & Krebs Cycle',
    route: '/student/lesson'
  };

  // Subject mastery data for the donut chart
  const subjectMastery = [
    { nameAr: 'الأحياء', nameEn: 'Biology', pct: 78, color: '#10B981' },
    { nameAr: 'الفيزياء', nameEn: 'Physics', pct: 62, color: '#06B6D4' },
    { nameAr: 'اللغة العربية', nameEn: 'Arabic', pct: 85, color: '#8B5CF6' },
    { nameAr: 'الكيمياء', nameEn: 'Chemistry', pct: 45, color: '#F59E0B' }
  ];

  // Subject filter options
  const filterOptions = [
    { id: 'all', labelAr: 'جميع المواد', labelEn: 'All Subjects' },
    { id: 'sub-bio', labelAr: 'الأحياء', labelEn: 'Biology' },
    { id: 'sub-phy', labelAr: 'الفيزياء', labelEn: 'Physics' },
    { id: 'sub-chem', labelAr: 'الكيمياء', labelEn: 'Chemistry' },
    { id: 'sub-ar', labelAr: 'اللغة العربية', labelEn: 'Arabic' }
  ];

  const currentSubjectLabel = filterOptions.find(o => o.id === selectedSubject)?.[lang === 'ar' ? 'labelAr' : 'labelEn'] || (lang === 'ar' ? 'جميع المواد' : 'All Subjects');

  // Chart coordinate mapping (viewBox: 650 x 200)
  const chartWidth = 650;
  const chartHeight = 200;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 40;
  const baseline = chartHeight - paddingBottom;
  const maxMinutes = 100;

  const points = WEEKLY_STUDY_DATA.map((item, idx) => {
    const xStep = (chartWidth - paddingLeft - paddingRight) / (WEEKLY_STUDY_DATA.length - 1);
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
  const overallMasteryValue = 94.6;
  const donutDashOffset = donutCircumference - (overallMasteryValue / 100) * donutCircumference;

  return (
    <SPage maxWidth={1240}>
      <div className="executive-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* ══════════════════════════════════════════════════════════════════════
            1. US-07 — عرض الصفحة الرئيسية (Dashboard Overview & Profile Header)
            ══════════════════════════════════════════════════════════════════════ */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Student Profile Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              position: 'relative',
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              border: '2px solid rgba(56, 189, 248, 0.35)',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <img
                src={student.avatar}
                alt={student.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{
                position: 'absolute',
                bottom: '3px',
                insetInlineEnd: '3px',
                width: '10px',
                height: '10px',
                backgroundColor: '#10B981',
                borderRadius: '50%',
                border: '2px solid #0E1726',
                boxShadow: '0 0 6px #10B981'
              }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '11.5px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  color: '#38BDF8',
                  border: '1px solid rgba(56, 189, 248, 0.25)'
                }}>
                  {student.gradeNameAr}
                </span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8' }}>
                  {student.trackAr}
                </span>
              </div>

              <h1 style={{
                fontSize: '24px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                margin: '3px 0 0',
                fontFamily: 'var(--font-heading), var(--font-arabic)',
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>{lang === 'ar' ? 'مرحباً' : 'Welcome,'}</span>
                <span style={{ color: '#38BDF8' }}>
                  {lang === 'ar' ? student.nameAr.split(' ')[0] : student.name.split(' ')[0]}
                </span>
              </h1>
            </div>
          </div>

          {/* Subject Filter Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setSubjectDropdownOpen(!subjectDropdownOpen)}
              className="executive-filter-btn"
              style={{ minWidth: '155px', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={15} style={{ color: '#38BDF8' }} />
                <span>{currentSubjectLabel}</span>
              </div>
              <ChevronDown
                size={14}
                style={{
                  color: '#94A3B8',
                  transform: subjectDropdownOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease'
                }}
              />
            </button>

            {/* Dropdown Menu */}
            {subjectDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                insetInlineEnd: 0,
                width: '180px',
                background: '#0E1726',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                padding: '6px',
                zIndex: 50
              }}>
                {filterOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedSubject(opt.id);
                      setSubjectDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: selectedSubject === opt.id ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                      color: selectedSubject === opt.id ? '#38BDF8' : '#CBD5E1',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: selectedSubject === opt.id ? '700' : '500',
                      cursor: 'pointer',
                      textAlign: isRtl ? 'right' : 'left',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <span>{lang === 'ar' ? opt.labelAr : opt.labelEn}</span>
                    {selectedSubject === opt.id && <Check size={14} style={{ color: '#38BDF8' }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            1.1 US-07 — مؤشرات الأداء الحيوية (4 KPI Cards - Adaptive Grid)
            ══════════════════════════════════════════════════════════════════════ */}
        <div className="executive-kpi-grid">
          {/* Card 1: Completed Lessons */}
          <div className="executive-kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="executive-icon-box" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38BDF8' }}>
                <BookOpen size={19} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                {lang === 'ar' ? '+3 هذا الأسبوع' : '+3 this week'}
              </span>
            </div>
            <div>
              <div className="executive-kpi-val">
                <span>{student.completedLessonsCount}</span>
                <span style={{ fontSize: '18px', fontWeight: '500', color: '#64748B', marginInlineStart: '4px' }}>
                  / {student.totalEnrolledLessons}
                </span>
              </div>
              <div className="executive-kpi-sub">
                {lang === 'ar' ? 'الحصص المكتملة' : 'Completed Lessons'}
              </div>
            </div>
          </div>

          {/* Card 2: Overall GPA */}
          <div className="executive-kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="executive-icon-box" style={{ background: 'rgba(52, 211, 153, 0.12)', color: '#34D399' }}>
                <TrendingUp size={19} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                {lang === 'ar' ? '+2.4% نمو' : '+2.4% growth'}
              </span>
            </div>
            <div>
              <div className="executive-kpi-val" style={{ color: '#34D399' }}>
                {student.overallGpa}
              </div>
              <div className="executive-kpi-sub">
                {lang === 'ar' ? 'المعدل العام التراكمي' : 'Cumulative GPA'}
              </div>
            </div>
          </div>

          {/* Card 3: Streak Days */}
          <div className="executive-kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="executive-icon-box" style={{ background: 'rgba(192, 132, 252, 0.12)', color: '#C084FC' }}>
                <Calendar size={19} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#C084FC', background: 'rgba(192, 132, 252, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                {lang === 'ar' ? 'التزام نشط' : 'Active Streak'}
              </span>
            </div>
            <div>
              <div className="executive-kpi-val">
                <span>{student.streakDays}</span>
                <span style={{ fontSize: '16px', fontWeight: '500', color: '#94A3B8', marginInlineStart: '6px' }}>
                  {lang === 'ar' ? 'يوماً متتالياً' : 'Days'}
                </span>
              </div>
              <div className="executive-kpi-sub">
                {lang === 'ar' ? 'سلسلة المذاكرة المتتالية' : 'Consecutive Study Days'}
              </div>
            </div>
          </div>

          {/* Card 4: Dual Metric (Today's Study + Batch Rank - Adaptive) */}
          <div className="executive-kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="executive-icon-box" style={{ background: 'rgba(96, 165, 250, 0.12)', color: '#60A5FA' }}>
                <GraduationCap size={19} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#60A5FA', background: 'rgba(96, 165, 250, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                {lang === 'ar' ? 'دوري النخبة' : 'Elite League'}
              </span>
            </div>
            <div>
              <div className="executive-dual-stat">
                <div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: '#FFFFFF', lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
                    {student.studyMinutesToday}
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#94A3B8', marginInlineStart: '3px' }}>
                      {lang === 'ar' ? 'د' : 'm'}
                    </span>
                  </div>
                  <div className="executive-kpi-sub" style={{ marginTop: '3px' }}>
                    {lang === 'ar' ? 'مذاكرة اليوم' : "Today's Study"}
                  </div>
                </div>

                <div className="executive-dual-stat-divider" style={{ width: '1px', height: '36px', background: 'rgba(255, 255, 255, 0.1)', margin: '0 20px' }} />

                <div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: '#38BDF8', lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
                    #2
                  </div>
                  <div className="executive-kpi-sub" style={{ marginTop: '3px' }}>
                    {lang === 'ar' ? 'ترتيب الدفعة' : 'Batch Rank'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            2. الرسوم البيانية والجرافات (Area Spline Chart 65% + Donut Chart 35%)
            ══════════════════════════════════════════════════════════════════════ */}
        <div className="executive-charts-grid">
          
          {/* Left Chart: Study Activity — Last 7 Days (~65% width) */}
          <div className="executive-card executive-chart-main">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  margin: 0,
                  fontFamily: 'var(--font-heading), var(--font-arabic)'
                }}>
                  {lang === 'ar' ? 'معدل المذاكرة — آخر 7 أيام' : 'Study Activity — Last 7 Days'}
                </h2>
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '2px 0 0' }}>
                  {lang === 'ar' ? 'إجمالي الدقائق والحصص المنجزة يومياً' : 'Daily study minutes and completed sessions'}
                </p>
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '5px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#94A3B8',
                fontWeight: '500'
              }}>
                <Calendar size={13} style={{ color: '#38BDF8' }} />
                <span>{lang === 'ar' ? 'آخر 7 أيام' : 'Last 7 Days'}</span>
              </div>
            </div>

            {/* SVG Area Spline Visualizer */}
            <div style={{ position: 'relative', width: '100%', height: '220px' }}>
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="none"
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="execAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.28" />
                    <stop offset="90%" stopColor="#38BDF8" stopOpacity="0.01" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                  </linearGradient>

                  <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38BDF8" floodOpacity="0.7" />
                  </filter>
                </defs>

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
                        fill="#64748B"
                        fontSize="10"
                        fontFamily="var(--font-latin)"
                        fontWeight="500"
                      >
                        {tick}
                      </text>
                      <line
                        x1={paddingLeft}
                        y1={y}
                        x2={chartWidth - paddingRight}
                        y2={y}
                        stroke="rgba(255, 255, 255, 0.05)"
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
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="spline-line"
                />

                {/* Interactive Points & X-Axis Labels */}
                {points.map((p, idx) => {
                  const isHovered = hoveredPointIndex === idx;
                  return (
                    <g key={idx}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="18"
                        fill="transparent"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredPointIndex(idx)}
                        onMouseLeave={() => setHoveredPointIndex(null)}
                      />

                      {(isHovered || p.isToday) && (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isHovered ? 8 : 6}
                          fill="rgba(56, 189, 248, 0.25)"
                          filter="url(#glowEffect)"
                          style={{ transition: 'r 0.2s ease' }}
                        />
                      )}

                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 4.5 : 3.5}
                        fill="#0E1726"
                        stroke="#38BDF8"
                        strokeWidth="2.5"
                        style={{ transition: 'r 0.2s ease, stroke-width 0.2s ease' }}
                      />

                      <text
                        x={p.x}
                        y={baseline + 20}
                        textAnchor="middle"
                        fill={p.isToday ? '#38BDF8' : '#94A3B8'}
                        fontSize="11"
                        fontWeight={p.isToday ? '700' : '500'}
                        fontFamily="var(--font-arabic)"
                      >
                        {lang === 'ar' ? p.dayAr : p.dayEn}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Floating Tooltip */}
              {hoveredPointIndex !== null && (
                <div style={{
                  position: 'absolute',
                  left: `${(points[hoveredPointIndex].x / chartWidth) * 100}%`,
                  top: `${(points[hoveredPointIndex].y / chartHeight) * 100}%`,
                  transform: 'translate(-50%, -135%)',
                  background: '#131E33',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  zIndex: 20,
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  animation: 'fadeInArea 0.15s ease'
                }}>
                  <div style={{ color: '#38BDF8', fontSize: '11px', marginBottom: '2px' }}>
                    {lang === 'ar' ? points[hoveredPointIndex].dayAr : points[hoveredPointIndex].dayEn}
                  </div>
                  <div>
                    {points[hoveredPointIndex].minutes} {lang === 'ar' ? 'دقيقة' : 'mins'}
                    <span style={{ color: '#94A3B8', marginInlineStart: '6px', fontSize: '11px' }}>
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
                color: '#FFFFFF',
                margin: 0,
                fontFamily: 'var(--font-heading), var(--font-arabic)'
              }}>
                {lang === 'ar' ? 'توزيع إتقان المواد' : 'Subject Mastery'}
              </h2>
              <p style={{ fontSize: '12px', color: '#94A3B8', margin: '2px 0 0' }}>
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
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth="14"
                />

                <circle
                  cx="80"
                  cy="80"
                  r={donutRadius}
                  fill="transparent"
                  stroke="#38BDF8"
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
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-heading)',
                  lineHeight: 1
                }}>
                  {overallMasteryValue}%
                </span>
                <span style={{
                  fontSize: '11px',
                  color: '#94A3B8',
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
              borderTop: '1px solid rgba(255, 255, 255, 0.06)'
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
                  <span style={{ fontSize: '12px', color: '#94A3B8', flex: 1 }}>
                    {lang === 'ar' ? sub.nameAr : sub.nameEn}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF' }}>
                    {sub.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            3. US-08 & US-09 — معرفة آخر درس ومتابعة من حيث توقفت (Resume Hero)
            ══════════════════════════════════════════════════════════════════════ */}
        <div className="executive-card" style={{ padding: 0 }}>
          <div className="executive-hero-lesson">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#38BDF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Play size={22} fill="#38BDF8" />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(56, 189, 248, 0.12)',
                    color: '#38BDF8',
                    border: '1px solid rgba(56, 189, 248, 0.25)'
                  }}>
                    {lang === 'ar' ? 'آخر درس توقفت عنده (US-08)' : 'Last Studied Lesson'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                    {lang === 'ar' ? lastLesson.subjectAr : lastLesson.subjectEn} • {lang === 'ar' ? lastLesson.teacherAr : lastLesson.teacherEn}
                  </span>
                </div>

                <h2 style={{
                  fontSize: '17px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  margin: '0 0 6px 0',
                  fontFamily: 'var(--font-heading), var(--font-arabic)'
                }}>
                  {lang === 'ar' ? lastLesson.titleAr : lastLesson.titleEn}
                </h2>

                <div style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span>
                    {lang === 'ar'
                      ? `توقفت عند الدقيقة ${lastLesson.pausedMinute} من ${lastLesson.totalDuration} (متبقي ${lastLesson.remainingMinutes} دقيقة)`
                      : `Paused at ${lastLesson.pausedMinute} / ${lastLesson.totalDuration} (${lastLesson.remainingMinutes}m left)`
                    }
                  </span>
                  <span>•</span>
                  <span style={{ color: '#38BDF8' }}>
                    {lang === 'ar' ? `الدرس القادم: ${lastLesson.nextLessonTitleAr}` : `Next: ${lastLesson.nextLessonTitleEn}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Resume Action & Progress */}
            <div className="executive-hero-lesson-actions">
              <div style={{ minWidth: '140px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94A3B8', marginBottom: '5px' }}>
                  <span>{lastLesson.progressPercent}% {lang === 'ar' ? 'مكتمل' : 'completed'}</span>
                  <span>{lang === 'ar' ? `الدرس ${lastLesson.lessonNumber} من ${lastLesson.totalLessons}` : `Lesson ${lastLesson.lessonNumber}/${lastLesson.totalLessons}`}</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${lastLesson.progressPercent}%`, height: '100%', background: '#38BDF8', borderRadius: '99px' }} />
                </div>
              </div>

              {/* US-09: One-Click Resume Action */}
              <button
                onClick={() => navigate(`${lastLesson.route}?course=${lastLesson.courseId}&resume=true`)}
                className="executive-hero-resume-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#38BDF8',
                  color: '#0A0F1D',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 4px 16px rgba(56, 189, 248, 0.35)',
                  minHeight: '44px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
              >
                <Play size={16} fill="#0A0F1D" />
                <span>{lang === 'ar' ? `أكمل من حيث توقفت (د ${lastLesson.pausedMinute})` : 'Resume Where You Left Off'}</span>
                {isRtl ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            4. US-10 — معرفة مهام اليوم (Today's Tasks & Checklist)
            ══════════════════════════════════════════════════════════════════════ */}
        <div className="executive-card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{
                  fontSize: '17px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  margin: 0,
                  fontFamily: 'var(--font-heading), var(--font-arabic)'
                }}>
                  {lang === 'ar' ? 'مهام اليوم المجدولة' : "Today's Tasks"}
                </h2>
                <span style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(56, 189, 248, 0.12)',
                  color: '#38BDF8',
                  fontWeight: '700'
                }}>
                  {completedTasksCount} / {tasks.length} {lang === 'ar' ? 'مكتملة' : 'completed'}
                </span>
              </div>
              <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: '3px 0 0' }}>
                {lang === 'ar'
                  ? `الحصص والاختبارات والواجبات المطلوبة منك اليوم لإنجاز خطتك الدراسية.`
                  : 'Daily lessons, quizzes, and homework scheduled for today.'
                }
              </p>
            </div>

            {/* Task Category Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', labelAr: 'الكل', labelEn: 'All' },
                { id: 'lesson', labelAr: 'حصص', labelEn: 'Lessons' },
                { id: 'homework', labelAr: 'واجبات', labelEn: 'Homework' },
                { id: 'quiz', labelAr: 'كويزات', labelEn: 'Quizzes' }
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setTaskCategoryFilter(pill.id)}
                  style={{
                    background: taskCategoryFilter === pill.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: taskCategoryFilter === pill.id ? '#38BDF8' : '#94A3B8',
                    border: `1px solid ${taskCategoryFilter === pill.id ? 'rgba(56, 189, 248, 0.35)' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '8px',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {lang === 'ar' ? pill.labelAr : pill.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredTasks.map((task) => (
              <div key={task.id} className="executive-task-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* Clickable Toggle Checkbox */}
                  <button
                    onClick={() => toggleTaskCompleted(task.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      color: task.isCompleted ? '#10B981' : '#64748B',
                      transition: 'transform 0.15s ease'
                    }}
                    title={lang === 'ar' ? 'تحديد المهمة كمكتملة' : 'Toggle Completed'}
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 size={22} fill="#10B981" color="#0E1726" />
                    ) : (
                      <Circle size={22} />
                    )}
                  </button>

                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: task.isCompleted ? '#64748B' : '#FFFFFF',
                      textDecoration: task.isCompleted ? 'line-through' : 'none'
                    }}>
                      {task.titleAr}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '3px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ color: '#38BDF8', fontWeight: '600' }}>{task.subjectAr}</span>
                      <span>•</span>
                      <span>{task.duration}</span>
                      {task.deadline && (
                        <>
                          <span>•</span>
                          <span style={{ color: task.priority === 'urgent' ? '#F59E0B' : '#94A3B8', fontWeight: task.priority === 'urgent' ? '700' : '400' }}>
                            {task.deadline}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(task.actionRoute || '/student/courses')}
                  className="executive-task-action-btn"
                >
                  <span>
                    {task.type === 'homework'
                      ? (lang === 'ar' ? 'حل الواجب' : 'Solve Homework')
                      : task.type === 'quiz'
                      ? (lang === 'ar' ? 'بدء الكويز' : 'Start Quiz')
                      : (lang === 'ar' ? 'استكمال الحصة' : 'Continue Lesson')
                    }
                  </span>
                  {isRtl ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            5. US-11 (الاختبارات القادمة) & US-12 (الواجبات القادمة)
            ══════════════════════════════════════════════════════════════════════ */}
        <div className="executive-deadlines-grid">
          
          {/* US-11: Upcoming Exams */}
          <div className="executive-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.12)',
                    color: '#F59E0B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Calendar size={17} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                      {lang === 'ar' ? 'الاختبارات القادمة (US-11)' : 'Upcoming Exams'}
                    </h3>
                  </div>
                </div>

                <span style={{ fontSize: '11px', fontWeight: '700', color: '#F59E0B', background: 'rgba(245, 158, 11, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                  {lang === 'ar' ? 'متبقي 18 ساعة' : '18h left'}
                </span>
              </div>

              <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
                {UPCOMING_EXAMS[0].titleAr}
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '14px' }}>
                {lang === 'ar'
                  ? `الموعد: الأحد 06:00 م • المدة: ${UPCOMING_EXAMS[0].durationMinutes} دقيقة • ${UPCOMING_EXAMS[0].questionsCount} سؤال (${UPCOMING_EXAMS[0].maxScore} درجة)`
                  : `Sunday 06:00 PM • ${UPCOMING_EXAMS[0].durationMinutes} mins • ${UPCOMING_EXAMS[0].questionsCount} questions`
                }
              </div>
            </div>

            <button
              onClick={() => navigate('/student/exam')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                padding: '9px 14px',
                color: '#F59E0B',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                minHeight: '40px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{lang === 'ar' ? 'مراجعة المنهج ودخول الاختبار' : 'View Exam & Prepare'}</span>
              {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </button>
          </div>

          {/* US-12: Upcoming Homeworks & Deadlines */}
          <div className="executive-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    color: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FileText size={17} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                      {lang === 'ar' ? 'الواجبات المطلوبة (US-12)' : 'Upcoming Homework'}
                    </h3>
                  </div>
                </div>

                <span style={{ fontSize: '11px', fontWeight: '700', color: '#EF4444', background: 'rgba(239, 68, 68, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                  {lang === 'ar' ? 'ينتهي الليلة ⚠️' : 'Due Tonight'}
                </span>
              </div>

              <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
                {HOMEWORK_LIST[0].titleAr}
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '14px' }}>
                {lang === 'ar'
                  ? `الموعد النهائي: الليلة قبل 11:59 م • ${HOMEWORK_LIST[0].questionsCount} أسئلة (${HOMEWORK_LIST[0].maxScore} درجة) • مادة ${HOMEWORK_LIST[0].subjectAr}`
                  : `Deadline: Tonight 11:59 PM • ${HOMEWORK_LIST[0].questionsCount} questions (${HOMEWORK_LIST[0].maxScore} pts)`
                }
              </div>
            </div>

            <button
              onClick={() => navigate('/student/homework')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '9px 14px',
                color: '#EF4444',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                minHeight: '40px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{lang === 'ar' ? 'حل وتسليم الواجب الآن' : 'Solve & Submit Homework'}</span>
              {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </button>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            6. US-13 — معرفة الخطوة التالية (AI Next-Step Guidance)
            ══════════════════════════════════════════════════════════════════════ */}
        <div className="executive-card" style={{
          background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.08) 0%, rgba(14, 23, 38, 0.8) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', maxWidth: '750px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.15)',
              color: '#C084FC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Target size={22} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#C084FC', background: 'rgba(168, 85, 247, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                  {lang === 'ar' ? 'توصية المستشار الذكي (US-13)' : 'AI Smart Next Step'}
                </span>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                  {lang === 'ar' ? 'إرشاد موجه يزيل أي حيرة' : 'Zero hesitation workflow'}
                </span>
              </div>

              <div style={{ fontSize: '13.5px', color: '#E2E8F0', lineHeight: 1.45 }}>
                {lang === 'ar'
                  ? 'خطوتك التالية الموصى بها الآن: تسليم واجب الأحياء المطلوب قبل إغلاقه الليلة، ثم استكمال آخر 14 دقيقة من درس "البناء الضوئي" لضمان الاستعداد التام لاختبار الأحد والحفاظ على ترتيبك #2.'
                  : 'Your recommended next step: Submit Biology homework before midnight, then finish the remaining 14m of Photosynthesis lesson to stay ready for Sunday’s exam and retain your #2 rank.'
                }
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/student/homework')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#C084FC',
              color: '#0A0F1D',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              minHeight: '44px',
              boxShadow: '0 4px 16px rgba(192, 132, 252, 0.35)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
          >
            <span>{lang === 'ar' ? 'تنفيذ الخطوة التالية فوراً' : 'Execute Next Step'}</span>
            {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          </button>
        </div>

      </div>
    </SPage>
  );
};
