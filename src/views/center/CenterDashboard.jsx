import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCenter } from '../../context/CenterContext';
import { useGroups, parseScheduleSlots } from '../../context/GroupsContext';
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
  Clock,
  PlayCircle,
  Check,
  RotateCcw,
  Maximize2,
  X,
  ExternalLink,
  ChevronRight,
  ListOrdered,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { generateSplinePaths } from '../../utils';

const getTodayDayKey = () => {
  const dayIndex = new Date().getDay(); // 0 = sunday, 1 = monday, ...
  const map = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return map[dayIndex];
};

const QUEUE_WEEKDAYS = [
  { key: 'saturday', labelAr: 'السبت', labelEn: 'Saturday' },
  { key: 'sunday', labelAr: 'الأحد', labelEn: 'Sunday' },
  { key: 'monday', labelAr: 'الاثنين', labelEn: 'Monday' },
  { key: 'tuesday', labelAr: 'الثلاثاء', labelEn: 'Tuesday' },
  { key: 'wednesday', labelAr: 'الأربعاء', labelEn: 'Wednesday' },
  { key: 'thursday', labelAr: 'الخميس', labelEn: 'Thursday' },
  { key: 'friday', labelAr: 'الجمعة', labelEn: 'Friday' }
];

const formatTime12h = (timeStr = '', lang = 'ar') => {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  if (isNaN(h)) return timeStr;
  const isPm = h >= 12;
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  const formattedH = h.toString().padStart(2, '0');
  const suffix = lang === 'ar' ? (isPm ? 'م' : 'ص') : (isPm ? 'PM' : 'AM');
  return `${formattedH}:${m} ${suffix}`;
};

const RenderQueueTimeRange = ({ startTime, endTime, lang, isRtl, color, style = {} }) => {
  return (
    <span 
      dir={isRtl ? 'rtl' : 'ltr'} 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '6px',
        color: color || 'inherit',
        fontVariantNumeric: 'tabular-nums',
        ...style
      }}
    >
      <bdi>{formatTime12h(startTime, lang)}</bdi>
      <span style={{ opacity: 0.65, fontSize: '0.85em' }}>{lang === 'ar' ? 'إلى' : '–'}</span>
      <bdi>{formatTime12h(endTime, lang)}</bdi>
    </span>
  );
};

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
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const { 
    branches, 
    selectedBranchId, 
    setSelectedBranchId, 
    rooms 
  } = useCenter();
  const { groups = [], enrolledStudents = {} } = useGroups();

  // Time filter: 'today' | 'month' | 'year'
  const [timePeriod, setTimePeriod] = useState('month');
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  // ── LIVE COHORTS QUEUE STATE ──
  const todayKey = useMemo(() => getTodayDayKey(), []);
  const [selectedQueueDay, setSelectedQueueDay] = useState(todayKey);
  const [isFullQueueOpen, setIsFullQueueOpen] = useState(false);
  const [queueModalFilter, setQueueModalFilter] = useState('ALL'); // ALL, ACTIVE, COMPLETED
  const [queueToast, setQueueToast] = useState(null);

  const [completedQueueIds, setCompletedQueueIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`motafawweq_queue_completed_${todayKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleSelectQueueDay = (dayKey) => {
    setSelectedQueueDay(dayKey);
    try {
      const saved = localStorage.getItem(`motafawweq_queue_completed_${dayKey}`);
      setCompletedQueueIds(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setCompletedQueueIds([]);
    }
  };

  const handleCompleteQueueItem = (uniqueId, groupName, e) => {
    if (e) e.stopPropagation();
    setCompletedQueueIds(prev => {
      if (prev.includes(uniqueId)) return prev;
      const next = [...prev, uniqueId];
      try {
        localStorage.setItem(`motafawweq_queue_completed_${selectedQueueDay}`, JSON.stringify(next));
      } catch (err) {}
      return next;
    });
    setQueueToast(`تم إنهاء حصة «${groupName}» وإزالتها من الطابور! تقدمت المجموعة التالية.`);
    setTimeout(() => setQueueToast(null), 3500);
  };

  const handleRestoreQueueItem = (uniqueId, groupName, e) => {
    if (e) e.stopPropagation();
    setCompletedQueueIds(prev => {
      const next = prev.filter(id => id !== uniqueId);
      try {
        localStorage.setItem(`motafawweq_queue_completed_${selectedQueueDay}`, JSON.stringify(next));
      } catch (err) {}
      return next;
    });
    setQueueToast(`تمت إعادة حصة «${groupName}» إلى الطابور.`);
    setTimeout(() => setQueueToast(null), 3500);
  };

  const handleResetQueue = () => {
    setCompletedQueueIds([]);
    try {
      localStorage.removeItem(`motafawweq_queue_completed_${selectedQueueDay}`);
    } catch (err) {}
    setQueueToast('تمت إعادة ضبط طابور اليوم.');
    setTimeout(() => setQueueToast(null), 3500);
  };

  // Compile today's queue items strictly sorted chronologically by startTime
  const todayQueueItems = useMemo(() => {
    const items = [];
    (groups || []).forEach(group => {
      const slots = group.scheduleSlots && group.scheduleSlots.length > 0
        ? group.scheduleSlots
        : (parseScheduleSlots ? parseScheduleSlots(group.scheduleAr, group.hallName) : []);

      slots.forEach(slot => {
        if (slot.day === selectedQueueDay) {
          const studentList = enrolledStudents[group.id] || [];
          const studentCount = studentList.length > 0 ? studentList.length : 38;
          items.push({
            uniqueId: `${group.id}_${slot.id || slot.startTime}`,
            groupId: group.id,
            slotId: slot.id,
            groupNameAr: group.nameAr,
            groupNameEn: group.nameEn,
            subjectAr: group.subjectAr,
            gradeAr: group.gradeAr,
            teacherNameAr: group.teacherNameAr,
            hall: slot.hall || group.hallName || 'القاعة الرئيسية',
            startTime: slot.startTime || '12:00',
            endTime: slot.endTime || '14:00',
            studentCount,
            capacity: 60,
            priceEgp: group.priceEgp || 450
          });
        }
      });
    });

    // Strictly sort chronologically by startTime (e.g. 10:00 -> 12:00 -> 14:00 -> 16:00 -> 18:00)
    return items.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }, [groups, selectedQueueDay, enrolledStudents]);

  const activeQueue = useMemo(() => {
    return todayQueueItems.filter(item => !completedQueueIds.includes(item.uniqueId));
  }, [todayQueueItems, completedQueueIds]);

  const completedQueue = useMemo(() => {
    return todayQueueItems.filter(item => completedQueueIds.includes(item.uniqueId));
  }, [todayQueueItems, completedQueueIds]);

  const currentActiveItem = activeQueue[0] || null;
  const upcomingQueueItems = activeQueue.slice(1);

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

  const themeAccent = isDark ? '#5CB6DB' : '#1588C7';
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

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION: LIVE COHORTS QUEUE (طابور مجموعات اليوم المجدولة)
          ═══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          marginTop: '32px',
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.75)' : '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '24px 28px',
          boxShadow: isDark ? '0 12px 36px rgba(0,0,0,0.35)' : '0 6px 24px rgba(0,0,0,0.04)',
          backdropFilter: 'blur(10px)',
          position: 'relative'
        }}
      >
        {/* Header: Live Badge, Title, Day Selector, Full Queue Button */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '22px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10B981',
                  fontSize: '11px',
                  fontWeight: '800',
                  letterSpacing: '0.2px'
                }}>
                  <span style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 8px #10B981'
                  }} />
                  {lang === 'ar' ? 'طابور الحصص المباشر — Live Queue' : 'Live Daily Queue'}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {todayQueueItems.length} {lang === 'ar' ? 'حصص مجدولة لليوم' : 'sessions scheduled'}
                  {completedQueue.length > 0 && ` (${completedQueue.length} منجزة)`}
                </span>
              </div>

              <h2 style={{
                fontSize: '21px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <ListOrdered size={24} style={{ color: themeAccent }} />
                <span>{lang === 'ar' ? 'طابور مجموعات اليوم المتسلسل' : 'Today’s Cohorts Chronological Queue'}</span>
              </h2>
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '13px',
                color: 'var(--text-secondary)'
              }}>
                {lang === 'ar'
                  ? 'المجموعات مرتبة زمنياً تصاعدياً حسب مواعيد اليوم. اضغط على أي مجموعة للدخول، وعند الانتهاء انقر "إنهاء الحصة" لتتقدم المجموعة التالية تلقائياً.'
                  : 'Cohorts ordered chronologically by today’s schedule. Click to enter, or finish a session to advance the next group.'}
              </p>
            </div>

            {/* Top Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {completedQueue.length > 0 && (
                <button
                  onClick={handleResetQueue}
                  title={lang === 'ar' ? 'إعادة ضبط الطابور واستعادة الحصص المكتملة' : 'Reset Queue'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'var(--bg-app)',
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <RotateCcw size={14} />
                  <span>{lang === 'ar' ? 'إعادة ضبط الطابور' : 'Reset Queue'}</span>
                </button>
              )}

              <button
                onClick={() => setIsFullQueueOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <Maximize2 size={15} />
                <span>{lang === 'ar' ? 'عرض الطابور كاملاً (Full Queue)' : 'View Full Queue'}</span>
                <span style={{
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: '800'
                }}>
                  {todayQueueItems.length}
                </span>
              </button>
            </div>
          </div>

          {/* Weekdays Selector Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '2px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', marginInlineEnd: '4px' }}>
              {lang === 'ar' ? 'اليوم المعروض:' : 'View Day:'}
            </span>
            {QUEUE_WEEKDAYS.map(day => {
              const isSelected = selectedQueueDay === day.key;
              const isToday = todayKey === day.key;
              return (
                <button
                  key={day.key}
                  onClick={() => handleSelectQueueDay(day.key)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected 
                      ? 'var(--primary)'
                      : 'var(--bg-app)',
                    color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: isSelected ? '800' : '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.18s ease'
                  }}
                >
                  <span>{lang === 'ar' ? day.labelAr : day.labelEn}</span>
                  {isToday && (
                    <span style={{
                      fontSize: '10px',
                      padding: '1px 6px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : 'var(--primary-surface)',
                      color: isSelected ? '#FFFFFF' : 'var(--primary)',
                      fontWeight: '800'
                    }}>
                      {lang === 'ar' ? 'اليوم' : 'Today'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Queue Content Body */}
        {activeQueue.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)',
            gap: '24px'
          }}>
            {/* ── HERO SPOTLIGHT CARD: CURRENT ACTIVE COHORT (#1) ── */}
            <div style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '900',
                  color: themeAccent,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <PlayCircle size={16} />
                  {lang === 'ar' ? 'الحصة النشطة حالياً في مقدمة الطابور (#1)' : 'Current Active Cohort (#1)'}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0, 102, 204, 0.1)',
                  color: themeAccent
                }}>
                  {lang === 'ar' ? 'جارية / الترتيب الزمني الأول' : 'In Progress / First Slot'}
                </span>
              </div>

              <div style={{
                borderRadius: 'var(--radius-xl)',
                border: '1.5px solid var(--primary)',
                backgroundColor: 'var(--bg-surface)',
                padding: '22px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'all 0.25s ease'
              }}>
                {/* Top Pill: Time Range & Duration */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--primary-surface)',
                    color: 'var(--primary)',
                    border: '1px solid rgba(21, 136, 199, 0.2)',
                    fontSize: '13px',
                    fontWeight: '800'
                  }}>
                    <Clock size={15} />
                    <RenderQueueTimeRange 
                      startTime={currentActiveItem.startTime} 
                      endTime={currentActiveItem.endTime} 
                      lang={lang} 
                      isRtl={isRtl} 
                      color="var(--primary)" 
                    />
                  </div>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {lang === 'ar' ? 'ساعتان • موعد اليوم' : '2 Hours • Today'}
                  </span>
                </div>

                {/* Group Name & Subject */}
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '900',
                    color: 'var(--text-primary)',
                    margin: '0 0 6px 0',
                    lineHeight: 1.35
                  }}>
                    {currentActiveItem.groupNameAr}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                    fontSize: '12px',
                    color: 'var(--text-secondary)'
                  }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      fontWeight: '700'
                    }}>
                      {currentActiveItem.subjectAr}
                    </span>
                    <span>•</span>
                    <span>{currentActiveItem.gradeAr}</span>
                  </div>
                </div>

                {/* Teacher & Hall details */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      {lang === 'ar' ? 'المحاضر / المعلم' : 'Instructor'}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {currentActiveItem.teacherNameAr}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      {lang === 'ar' ? 'القاعة المخصصة' : 'Hall / Room'}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)' }}>
                      {currentActiveItem.hall}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      {lang === 'ar' ? 'الطلاب المسجلين' : 'Enrolled'}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {currentActiveItem.studentCount} / {currentActiveItem.capacity} طالب
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Navigate into Group & Finish from Queue */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '4px'
                }}>
                  <button
                    onClick={() => navigate(`/center/groups/${currentActiveItem.groupId}`)}
                    style={{
                      flex: 1.2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px 18px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '13.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
                  >
                    <span>{lang === 'ar' ? 'الدخول للحصة وتسجيل الحضور' : 'Enter Cohort & Attendance'}</span>
                    <ArrowUpRight size={16} />
                  </button>

                  <button
                    onClick={(e) => handleCompleteQueueItem(currentActiveItem.uniqueId, currentActiveItem.groupNameAr, e)}
                    title={lang === 'ar' ? 'إنهاء هذه الحصة وإزالتها من الطابور لتظهر المجموعة التالية' : 'Finish Session'}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--success)';
                      e.currentTarget.style.color = 'var(--success)';
                      e.currentTarget.style.backgroundColor = 'rgba(22, 163, 74, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-app)';
                    }}
                  >
                    <Check size={16} />
                    <span>{lang === 'ar' ? 'إنهاء الحصة وإزالتها' : 'Finish & Pop'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── UPCOMING QUEUE COLUMN: NEXT IN LINE (#2, #3, ...) ── */}
            <div style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '900',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Clock size={16} />
                  {lang === 'ar' ? `التالي في الطابور (${upcomingQueueItems.length} في الانتظار)` : `Next in Queue (${upcomingQueueItems.length})`}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {lang === 'ar' ? 'مرتبة تصاعدياً بالمواعيد' : 'Sorted by time'}
                </span>
              </div>

              {upcomingQueueItems.length > 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  maxHeight: '380px',
                  overflowY: 'auto',
                  paddingRight: isRtl ? '0' : '4px',
                  paddingLeft: isRtl ? '4px' : '0'
                }}>
                  {upcomingQueueItems.map((item, idx) => (
                    <div
                      key={item.uniqueId}
                      onClick={() => navigate(`/center/groups/${item.groupId}`)}
                      className="center-interactive-card"
                      style={{
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'var(--bg-app)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                    >
                      {/* Header row: Queue order badge & Time */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                            color: 'var(--text-secondary)',
                            fontSize: '11px',
                            fontWeight: '900'
                          }}>
                            #{idx + 2} {lang === 'ar' ? 'في الانتظار' : 'Waiting'}
                          </span>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '800',
                            color: 'var(--primary)'
                          }}>
                            <RenderQueueTimeRange 
                              startTime={item.startTime} 
                              endTime={item.endTime} 
                              lang={lang} 
                              isRtl={isRtl} 
                              color="var(--primary)" 
                            />
                          </span>
                        </div>

                        <span style={{
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                          fontWeight: '600'
                        }}>
                          {item.hall}
                        </span>
                      </div>

                      {/* Cohort Name & Teacher */}
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        lineHeight: 1.3
                      }}>
                        {item.groupNameAr}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '2px',
                        fontSize: '11.5px',
                        color: 'var(--text-muted)'
                      }}>
                        <span>{item.teacherNameAr} • {item.subjectAr}</span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/center/groups/${item.groupId}`);
                            }}
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'transparent',
                              color: themeAccent,
                              fontSize: '11px',
                              fontWeight: '800',
                              cursor: 'pointer'
                            }}
                          >
                            {lang === 'ar' ? 'دخول' : 'Enter'}
                          </button>

                          <button
                            onClick={(e) => handleCompleteQueueItem(item.uniqueId, item.groupNameAr, e)}
                            title={lang === 'ar' ? 'إنهاء وإزالة من الطابور' : 'Finish & Pop'}
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              backgroundColor: 'rgba(16, 185, 129, 0.08)',
                              color: '#10B981',
                              fontSize: '11px',
                              fontWeight: '800',
                              cursor: 'pointer'
                            }}
                          >
                            {lang === 'ar' ? 'إنهاء' : 'Done'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '24px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px dashed var(--border-subtle)',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.015)' : 'var(--bg-app)',
                  color: 'var(--text-muted)'
                }}>
                  <Sparkles size={28} style={{ color: themeAccent, marginBottom: '8px', opacity: 0.8 }} />
                  <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'هذه آخر حصة مجدولة لهذا اليوم!' : 'Last Session Scheduled for Today!'}
                  </div>
                  <div style={{ fontSize: '12px' }}>
                    {lang === 'ar' ? 'لا توجد حصص أخرى في الانتظار بعد الحصة النشطة الحالية.' : 'No more cohorts queued up for today.'}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : todayQueueItems.length > 0 ? (
          /* ── ALL DONE CELEBRATION STATE ── */
          <div style={{
            textAlign: 'center',
            padding: '36px 20px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.06)' : 'rgba(16, 185, 129, 0.04)',
            border: '1.5px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981'
            }}>
              <CheckCircle2 size={32} />
            </div>

            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                margin: '0 0 6px 0'
              }}>
                {lang === 'ar' ? 'تم إتمام جميع حصص اليوم بنجاح' : 'All Today Sessions Finished!'}
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                margin: 0,
                maxWidth: '500px'
              }}>
                {lang === 'ar'
                  ? `تم إنهاء وإزالة جميع المجموعات الـ ${todayQueueItems.length} المجدولة لهذا اليوم من الطابور وتسجيل الحضور بالكامل.`
                  : `All ${todayQueueItems.length} scheduled cohorts have been finished and removed from the active queue.`}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              <button
                onClick={handleResetQueue}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                <RotateCcw size={15} />
                <span>{lang === 'ar' ? 'إعادة فتح الطابور من البداية' : 'Re-open Queue from Start'}</span>
              </button>

              <button
                onClick={() => setIsFullQueueOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                <Maximize2 size={15} />
                <span>{lang === 'ar' ? 'استعراض الحصص المكتملة' : 'View Completed History'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* ── EMPTY SCHEDULE STATE ── */
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'var(--bg-app)',
            border: '1px dashed var(--border-subtle)',
            color: 'var(--text-muted)'
          }}>
            <Calendar size={36} style={{ color: themeAccent, marginBottom: '10px', opacity: 0.7 }} />
            <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {lang === 'ar' ? 'لا توجد حصص مجدولة لهذا اليوم' : 'No Sessions Scheduled for This Day'}
            </div>
            <div style={{ fontSize: '12.5px', marginBottom: '14px' }}>
              {lang === 'ar' ? 'اختر يوماً آخر من الأيام أعلاه أو أضف مجموعة جديدة في جدول السنتر.' : 'Select another day above or create a new group.'}
            </div>
            <Link
              to="/center/groups"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: themeAccent,
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: '800',
                textDecoration: 'none'
              }}
            >
              <span>{lang === 'ar' ? 'إدارة المجموعات وإضافة مواعيد' : 'Manage Cohorts'}</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL: EXPANDED FULL QUEUE (عرض الطابور كاملاً بترتيب اليوم)
          ═══════════════════════════════════════════════════════════════════════ */}
      {isFullQueueOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.78)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '860px',
            maxHeight: '90vh',
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
            borderRadius: '24px',
            border: `1.5px solid ${isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(0, 102, 204, 0.2)'}`,
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'var(--bg-app)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0, 102, 204, 0.1)',
                  color: themeAccent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ListOrdered size={22} />
                </div>

                <div>
                  <h3 style={{
                    fontSize: '17px',
                    fontWeight: '900',
                    color: 'var(--text-primary)',
                    margin: '0 0 2px 0'
                  }}>
                    {lang === 'ar' ? 'طابور مجموعات اليوم المتسلسل كاملاً' : 'Full Daily Cohorts Queue'}
                  </h3>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>
                      {QUEUE_WEEKDAYS.find(w => w.key === selectedQueueDay)?.[lang === 'ar' ? 'labelAr' : 'labelEn']}
                    </span>
                    <span>•</span>
                    <span>{todayQueueItems.length} {lang === 'ar' ? 'مجموعات مجدولة' : 'total cohorts'}</span>
                    <span>•</span>
                    <span style={{ color: '#10B981', fontWeight: '800' }}>
                      {completedQueue.length} {lang === 'ar' ? 'منجزة' : 'completed'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsFullQueueOpen(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Filter Tabs in Modal */}
            <div style={{
              padding: '12px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {[
                  { id: 'ALL', labelAr: `الكل (${todayQueueItems.length})`, labelEn: `All (${todayQueueItems.length})` },
                  { id: 'ACTIVE', labelAr: `النشطة في الطابور (${activeQueue.length})`, labelEn: `In Queue (${activeQueue.length})` },
                  { id: 'COMPLETED', labelAr: `المكتملة (${completedQueue.length})`, labelEn: `Completed (${completedQueue.length})` }
                ].map(tab => {
                  const isTabActive = queueModalFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setQueueModalFilter(tab.id)}
                      style={{
                        padding: '5px 14px',
                        borderRadius: '16px',
                        border: isTabActive ? `1px solid ${themeAccent}` : '1px solid transparent',
                        backgroundColor: isTabActive 
                          ? (isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0, 102, 204, 0.1)')
                          : 'transparent',
                        color: isTabActive ? themeAccent : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: isTabActive ? '800' : '600',
                        cursor: 'pointer'
                      }}
                    >
                      {lang === 'ar' ? tab.labelAr : tab.labelEn}
                    </button>
                  );
                })}
              </div>

              {completedQueue.length > 0 && (
                <button
                  onClick={handleResetQueue}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F1F5F9',
                    color: 'var(--text-secondary)',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={12} />
                  <span>{lang === 'ar' ? 'إعادة ضبط واستعادة الكل' : 'Reset All'}</span>
                </button>
              )}
            </div>

            {/* Modal Scrollable Timeline */}
            <div style={{
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {todayQueueItems
                .filter(item => {
                  const isComp = completedQueueIds.includes(item.uniqueId);
                  if (queueModalFilter === 'ACTIVE') return !isComp;
                  if (queueModalFilter === 'COMPLETED') return isComp;
                  return true;
                })
                .map((item, index) => {
                  const isCompleted = completedQueueIds.includes(item.uniqueId);
                  const isActiveHead = activeQueue[0]?.uniqueId === item.uniqueId;

                  return (
                    <div
                      key={item.uniqueId}
                      style={{
                        display: 'flex',
                        alignItems: 'stretch',
                        gap: '16px',
                        position: 'relative'
                      }}
                    >
                      {/* Time & Queue Number Column */}
                      <div style={{
                        width: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isActiveHead
                          ? 'var(--primary-surface)'
                          : isCompleted
                          ? 'rgba(22, 163, 74, 0.08)'
                          : 'var(--bg-app)',
                        border: isActiveHead 
                          ? '1.5px solid var(--primary)' 
                          : isCompleted
                          ? '1px solid rgba(22, 163, 74, 0.25)'
                          : '1px solid var(--border-subtle)',
                        textAlign: 'center'
                      }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '900',
                          color: isActiveHead ? 'var(--primary)' : isCompleted ? 'var(--success)' : 'var(--text-muted)',
                          marginBottom: '4px'
                        }}>
                          {isCompleted ? 'مكتملة' : isActiveHead ? 'الحالية #1' : `#${index + 1} في الطابور`}
                        </span>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: '800',
                          color: 'var(--text-primary)'
                        }}>
                          <bdi>{formatTime12h(item.startTime, lang)}</bdi>
                        </span>
                        <span style={{
                          fontSize: '11px',
                          color: 'var(--text-muted)'
                        }}>
                          {lang === 'ar' ? 'إلى' : 'to'} <bdi>{formatTime12h(item.endTime, lang)}</bdi>
                        </span>
                      </div>

                      {/* Cohort Card */}
                      <div style={{
                        flex: 1,
                        padding: '16px 20px',
                        borderRadius: 'var(--radius-md)',
                        border: isActiveHead
                          ? '1.5px solid var(--primary)'
                          : '1px solid var(--border-subtle)',
                        backgroundColor: isActiveHead
                          ? 'var(--primary-surface)'
                          : isCompleted
                          ? 'var(--bg-app)'
                          : 'var(--bg-surface)',
                        opacity: isCompleted ? 0.72 : 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '8px'
                        }}>
                          <div>
                            <h4 style={{
                              fontSize: '15px',
                              fontWeight: '900',
                              color: 'var(--text-primary)',
                              margin: '0 0 3px 0',
                              textDecoration: isCompleted ? 'line-through' : 'none'
                            }}>
                              {item.groupNameAr}
                            </h4>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              {item.subjectAr} • {item.gradeAr}
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div>
                            {isActiveHead ? (
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--primary-surface)',
                                color: 'var(--primary)',
                                fontSize: '11px',
                                fontWeight: '800',
                                border: '1px solid var(--primary)'
                              }}>
                                {lang === 'ar' ? 'الحصة النشطة الآن' : 'Active Now'}
                              </span>
                            ) : isCompleted ? (
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                                color: 'var(--success)',
                                fontSize: '11px',
                                fontWeight: '800'
                              }}>
                                {lang === 'ar' ? 'تم إتمام الحصة وإزالتها' : 'Completed'}
                              </span>
                            ) : (
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--bg-app)',
                                color: 'var(--text-secondary)',
                                fontSize: '11px',
                                fontWeight: '800',
                                border: '1px solid var(--border-subtle)'
                              }}>
                                {lang === 'ar' ? 'قادمة في الطابور' : 'Queued'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Cohort Meta */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          flexWrap: 'wrap',
                          fontSize: '12px',
                          color: 'var(--text-secondary)'
                        }}>
                          <span>{lang === 'ar' ? 'المحاضر:' : 'Teacher:'} <strong>{item.teacherNameAr}</strong></span>
                          <span>{lang === 'ar' ? 'القاعة:' : 'Hall:'} <strong style={{ color: themeAccent }}>{item.hall}</strong></span>
                          <span>{lang === 'ar' ? 'الطلاب:' : 'Students:'} <strong>{item.studentCount} طالب</strong></span>
                        </div>

                        {/* Actions inside Modal */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginTop: '4px'
                        }}>
                          <button
                            onClick={() => {
                              setIsFullQueueOpen(false);
                              navigate(`/center/groups/${item.groupId}`);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '7px 14px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: themeAccent,
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: '800',
                              cursor: 'pointer'
                            }}
                          >
                            <span>{lang === 'ar' ? 'فتح تفاصيل المجموعة وتسجيل الحضور' : 'Open Cohort'}</span>
                            <ArrowUpRight size={14} />
                          </button>

                          {isCompleted ? (
                            <button
                              onClick={(e) => handleRestoreQueueItem(item.uniqueId, item.groupNameAr, e)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '7px 14px',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--text-secondary)',
                                fontSize: '12px',
                                fontWeight: '800',
                                cursor: 'pointer'
                              }}
                            >
                              <RotateCcw size={13} />
                              <span>{lang === 'ar' ? 'إلغاء الإتمام وإعادة للطابور' : 'Restore to Queue'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={(e) => handleCompleteQueueItem(item.uniqueId, item.groupNameAr, e)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '7px 14px',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                                border: '1px solid rgba(16, 185, 129, 0.35)',
                                color: '#10B981',
                                fontSize: '12px',
                                fontWeight: '800',
                                cursor: 'pointer'
                              }}
                            >
                              <Check size={14} />
                              <span>{lang === 'ar' ? 'إتمام وإزالة من الطابور' : 'Finish & Pop'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Queue Toast Notification */}
      {queueToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: isRtl ? '24px' : 'auto',
          right: isRtl ? 'auto' : '24px',
          zIndex: 100000,
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(56, 189, 248, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: '800',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <Sparkles size={16} style={{ color: '#38BDF8' }} />
          <span>{queueToast}</span>
        </div>
      )}
    </div>
  );
};
