import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { useGroups } from '../../../context/GroupsContext';
import {
  Calendar,
  Clock,
  Building2,
  Users,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit3,
  QrCode,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  Flame,
  Search,
  Bell,
  Trash2,
  StickyNote,
  Maximize2
} from 'lucide-react';

export const DAYS_CONFIG = [
  { key: 'saturday', ar: 'السبت', en: 'Saturday', shortAr: 'سبت', shortEn: 'Sat', dayIndex: 6 },
  { key: 'sunday', ar: 'الأحد', en: 'Sunday', shortAr: 'أحد', shortEn: 'Sun', dayIndex: 0 },
  { key: 'monday', ar: 'الاثنين', en: 'Monday', shortAr: 'اثنين', shortEn: 'Mon', dayIndex: 1 },
  { key: 'tuesday', ar: 'الثلاثاء', en: 'Tuesday', shortAr: 'ثلاثاء', shortEn: 'Tue', dayIndex: 2 },
  { key: 'wednesday', ar: 'الأربعاء', en: 'Wednesday', shortAr: 'أربعاء', shortEn: 'Wed', dayIndex: 3 },
  { key: 'thursday', ar: 'الخميس', en: 'Thursday', shortAr: 'خميس', shortEn: 'Thu', dayIndex: 4 },
  { key: 'friday', ar: 'الجمعة', en: 'Friday', shortAr: 'جمعة', shortEn: 'Fri', dayIndex: 5 },
];

export const TeacherWeeklySchedule = ({ onOpenQr, onEditClass, onAddNewClass }) => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const isAr = lang === 'ar';

  const {
    groups,
    enrolledStudents,
    setActiveGroupId,
    scheduleNotes,
    addScheduleNote,
    toggleScheduleNote,
    deleteScheduleNote
  } = useGroups();

  // Detect Real-World Today Key
  const todayKey = useMemo(() => {
    const dayNum = new Date().getDay();
    const found = DAYS_CONFIG.find(d => d.dayIndex === dayNum);
    return found ? found.key : 'tuesday'; // Default to Tuesday if not found
  }, []);

  // Focused day for Day View and Mobile View (defaults to real today!)
  const [selectedDayKey, setSelectedDayKey] = useState(todayKey);

  // View Mode: 'grid' (7-day week) | 'focus' (expanded today/selected day) | 'agenda' (list)
  const [viewMode, setViewMode] = useState('grid');

  // Center filter
  const [selectedCenter, setSelectedCenter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Note Modal / Form State
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteTargetDay, setNoteTargetDay] = useState(todayKey);
  const [noteText, setNoteText] = useState('');
  const [noteTime, setNoteTime] = useState('16:00');
  const [notePriority, setNotePriority] = useState('medium'); // 'high' | 'medium' | 'normal'

  // Copied join code feedback
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenRoster = (groupId, e) => {
    if (e) e.stopPropagation();
    setActiveGroupId(groupId);
    navigate('/teacher/students');
  };

  // Extract all sessions organized by day
  const sessionsByDay = useMemo(() => {
    const result = {
      saturday: [],
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: []
    };

    groups.forEach(group => {
      // Filter center
      if (selectedCenter !== 'all' && group.centerName !== selectedCenter) return;
      // Filter search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (group.nameAr && group.nameAr.toLowerCase().includes(q)) ||
          (group.nameEn && group.nameEn.toLowerCase().includes(q)) ||
          (group.subjectAr && group.subjectAr.toLowerCase().includes(q)) ||
          (group.centerName && group.centerName.toLowerCase().includes(q));
        if (!matchTitle) return;
      }

      const slots = (Array.isArray(group.scheduleSlots) && group.scheduleSlots.length > 0)
        ? group.scheduleSlots
        : [];

      slots.forEach(slot => {
        const dayKey = (slot.day || '').toLowerCase();
        if (result[dayKey]) {
          result[dayKey].push({
            ...slot,
            group,
            enrolledCount: (enrolledStudents[group.id] || []).length
          });
        }
      });
    });

    // Sort sessions in each day by start time
    Object.keys(result).forEach(k => {
      result[k].sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));
    });

    return result;
  }, [groups, enrolledStudents, selectedCenter, searchQuery]);

  // Unique centers list for filter
  const centersList = useMemo(() => {
    const set = new Set();
    groups.forEach(g => {
      if (g.centerName) set.add(g.centerName);
    });
    return Array.from(set);
  }, [groups]);

  // Unique halls list
  const hallsList = useMemo(() => {
    const set = new Set();
    groups.forEach(g => {
      if (g.hallName) set.add(g.hallName);
      (g.scheduleSlots || []).forEach(s => {
        if (s.hall) set.add(s.hall);
      });
    });
    return Array.from(set);
  }, [groups]);

  // Total sessions count across the week
  const totalWeeklySessions = useMemo(() => {
    return Object.values(sessionsByDay).reduce((acc, list) => acc + list.length, 0);
  }, [sessionsByDay]);

  // Today's sessions count
  const todaySessions = sessionsByDay[todayKey] || [];
  const selectedDaySessions = sessionsByDay[selectedDayKey] || [];

  const handleSaveNewNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addScheduleNote(noteTargetDay, {
      text: noteText.trim(),
      time: noteTime,
      priority: notePriority
    });
    setNoteText('');
    setNoteModalOpen(false);
  };

  const formatTimeTo12h = (t24) => {
    if (!t24) return '';
    const [h, m] = t24.split(':').map(Number);
    const period = h >= 12 ? (isAr ? 'م' : 'PM') : (isAr ? 'ص' : 'AM');
    const h12 = h % 12 || 12;
    return `${h12}:${m < 10 ? '0' + m : m} ${period}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* ── TOP STATS & INDICATORS (Clutter-free, Symmetric, & Animated) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '16px'
      }}>
        {/* Total Sessions Card with animated counter */}
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '18px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: 'var(--shadow-xs)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'default'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
        }}
        >
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            backgroundColor: 'var(--primary-surface)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Calendar size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {isAr ? 'إجمالي الحصص الأسبوعية' : 'Weekly Sessions'}
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: '900',
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: 'rgba(21, 136, 199, 0.12)',
                color: 'var(--primary)'
              }}>
                {isAr ? 'أسبوعي' : 'Active'}
              </span>
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              letterSpacing: '-0.5px'
            }}>
              {totalWeeklySessions} <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>{isAr ? 'حصة أسبوعياً' : 'Sessions'}</span>
            </div>
          </div>
        </div>

        {/* Active Cohorts / Classes Count (Replaces partner centers & halls) */}
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '18px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: 'var(--shadow-xs)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'default'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
        }}
        >
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Building2 size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {isAr ? 'المجموعات والقاعات الدراسية' : 'Cohorts & Classes'}
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: '900',
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981'
              }}>
                {isAr ? 'معتمدة' : 'Verified'}
              </span>
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              letterSpacing: '-0.5px'
            }}>
              {groups.length} <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>{isAr ? 'مجموعة دراسية' : 'Cohorts'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTROLS & FILTER BAR ── */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        {/* Left: View Mode Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-subtle)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'grid' ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Calendar size={14} />
              <span>{isAr ? 'الجدول الأسبوعي' : 'Weekly'}</span>
            </button>

            <button
              onClick={() => {
                setViewMode('focus');
                setSelectedDayKey(todayKey);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: viewMode === 'focus' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'focus' ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Flame size={14} />
              <span>{isAr ? 'اليوم' : 'Today'}</span>
            </button>

            <button
              onClick={() => setViewMode('agenda')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: viewMode === 'agenda' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'agenda' ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Clock size={14} />
              <span>{isAr ? 'الأجندة' : 'Agenda'}</span>
            </button>
          </div>
        </div>

        {/* Right: Center Filter + Add Note Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Center selector */}
          <select
            value={selectedCenter}
            onChange={(e) => setSelectedCenter(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '700',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">{isAr ? 'جميع السناتر والقاعات' : 'All Centers & Halls'}</option>
            {centersList.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Add Note Button */}
          <button
            onClick={() => {
              setNoteTargetDay(selectedDayKey || todayKey);
              setNoteModalOpen(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <StickyNote size={14} color="var(--primary)" />
            <span>{isAr ? 'إضافة ملحوظة لليوم' : 'Add Day Note'}</span>
          </button>
        </div>
      </div>

      {/* ── FOCUS MODE DAY SELECTOR ONLY (Hidden in Grid View to avoid duplicate days) ── */}
      {viewMode === 'focus' && (
        <div className="mobile-day-tabs" style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '4px',
          scrollbarWidth: 'none'
        }}>
          {DAYS_CONFIG.map(day => {
            const isToday = day.key === todayKey;
            const isSelected = day.key === selectedDayKey;
            const daySessionsCount = (sessionsByDay[day.key] || []).length;
            const dayNotesCount = (scheduleNotes[day.key] || []).length;

            return (
              <button
                key={day.key}
                onClick={() => setSelectedDayKey(day.key)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  border: isSelected
                    ? '2px solid var(--primary)'
                    : (isToday ? '2px dashed var(--primary)' : '1px solid var(--border-subtle)'),
                  backgroundColor: isSelected
                    ? 'var(--primary)'
                    : (isToday ? 'var(--primary-surface)' : 'var(--bg-surface-elevated)'),
                  color: isSelected
                    ? '#FFFFFF'
                    : (isToday ? 'var(--primary)' : 'var(--text-primary)'),
                  cursor: 'pointer',
                  minWidth: '85px',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '900' }}>
                    {isAr ? day.shortAr : day.shortEn}
                  </span>
                  {isToday && (
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#FFFFFF' : 'var(--primary)'
                    }} />
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', opacity: 0.9 }}>
                  <span>{daySessionsCount} {isAr ? 'حصة' : 'class'}</span>
                  {dayNotesCount > 0 && <span>• 📌 {dayNotesCount}</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── 1. WEEKLY 7-DAY GRID VIEW ── */}
      {viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
          gap: '14px',
          alignItems: 'stretch'
        }}>
          {DAYS_CONFIG.map(day => {
            const isToday = day.key === todayKey;
            const daySessions = sessionsByDay[day.key] || [];
            const dayNotes = scheduleNotes[day.key] || [];

            return (
              <div
                id={`schedule-col-${day.key}`}
                key={day.key}
                style={{
                  backgroundColor: isToday ? 'var(--bg-surface)' : 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-xl)',
                  border: isToday
                    ? '2px solid var(--primary)'
                    : '1px solid var(--border-subtle)',
                  boxShadow: isToday
                    ? '0 8px 24px rgba(21, 136, 199, 0.18)'
                    : 'var(--shadow-xs)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {/* Day Header */}
                <div style={{
                  padding: '14px 16px',
                  background: isToday
                    ? 'linear-gradient(135deg, var(--primary), #0D69A0)'
                    : 'var(--bg-subtle)',
                  color: isToday ? '#FFFFFF' : 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: isToday ? 'none' : '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '900', letterSpacing: '-0.2px' }}>
                      {isAr ? day.ar : day.en}
                    </span>
                    {isToday && (
                      <span style={{
                        fontSize: '9.5px',
                        fontWeight: '900',
                        padding: '2px 7px',
                        borderRadius: '6px',
                        backgroundColor: '#FFFFFF',
                        color: 'var(--primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <Flame size={10} />
                        {isAr ? 'اليوم الحالي' : 'Today'}
                      </span>
                    )}
                  </div>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: isToday ? 'rgba(255, 255, 255, 0.22)' : 'var(--bg-surface)',
                    color: isToday ? '#FFFFFF' : 'var(--text-secondary)',
                    border: isToday ? 'none' : '1px solid var(--border-subtle)'
                  }}>
                    {daySessions.length} {isAr ? 'حصة' : 'Classes'}
                  </span>
                </div>

                {/* Day Body: Sessions Cards */}
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  {daySessions.length === 0 ? (
                    <div style={{
                      flex: 1,
                      minHeight: '150px',
                      padding: '28px 14px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: '12px',
                      border: '1px dashed var(--border-subtle)',
                      gap: '8px'
                    }}>
                      <Clock size={24} style={{ opacity: 0.35 }} />
                      <span style={{ fontSize: '12px', fontWeight: '600' }}>
                        {isAr ? 'لا توجد حصص في هذا اليوم' : 'No classes scheduled'}
                      </span>
                    </div>
                  ) : (
                    daySessions.map((session, sIdx) => {
                      const group = session.group;
                      return (
                        <div
                          key={session.id || sIdx}
                          style={{
                            backgroundColor: isToday
                              ? (isDark ? 'rgba(21, 136, 199, 0.08)' : '#F0F9FF')
                              : 'var(--bg-surface)',
                            border: `1px solid ${isToday ? 'rgba(21, 136, 199, 0.3)' : 'var(--border-subtle)'}`,
                            borderRadius: '12px',
                            padding: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            e.currentTarget.style.borderColor = 'var(--primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = isToday ? 'rgba(21, 136, 199, 0.3)' : 'var(--border-subtle)';
                          }}
                        >
                          {/* Time Badge & Hall Tag */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              backgroundColor: 'var(--primary)',
                              color: '#FFFFFF',
                              fontSize: '11px',
                              fontWeight: '800'
                            }}>
                              <Clock size={11} />
                              <span>{formatTimeTo12h(session.startTime)} - {formatTimeTo12h(session.endTime)}</span>
                            </span>

                            <span style={{
                              fontSize: '10.5px',
                              fontWeight: '700',
                              color: 'var(--text-secondary)',
                              backgroundColor: 'var(--bg-subtle)',
                              padding: '2px 7px',
                              borderRadius: '5px'
                            }}>
                              {session.hall || group.hallName || 'قاعة 1'}
                            </span>
                          </div>

                          {/* Group Title */}
                          <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                            {isAr ? group.nameAr : group.nameEn || group.nameAr}
                          </div>

                          {/* Center Location & Enrolled Students */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={11} color="var(--primary)" />
                              <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {group.centerName}
                              </span>
                            </span>

                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: '700' }}>
                              <Users size={11} />
                              <span>{session.enrolledCount} {isAr ? 'طالب' : 'St.'}</span>
                            </span>
                          </div>

                          {/* Quick Actions Bar */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '6px',
                            borderTop: '1px dashed var(--border-subtle)',
                            marginTop: '2px'
                          }}>
                            {/* Copy Code */}
                            <button
                              type="button"
                              onClick={(e) => handleCopyCode(group.joinCode, e)}
                              title={isAr ? 'نسخ كود انضمام الطلاب' : 'Copy Join Code'}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                background: 'none',
                                border: 'none',
                                color: copiedCode === group.joinCode ? 'var(--success)' : 'var(--text-muted)',
                                fontSize: '10.5px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                padding: 0
                              }}
                            >
                              {copiedCode === group.joinCode ? <Check size={11} /> : <Copy size={11} />}
                              <span>{group.joinCode}</span>
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {/* QR Modal Trigger */}
                              {onOpenQr && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenQr(group);
                                  }}
                                  title={isAr ? 'عرض باركود QR للحضور' : 'Show QR'}
                                  style={{
                                    padding: '3px 5px',
                                    borderRadius: '5px',
                                    backgroundColor: 'var(--bg-subtle)',
                                    border: '1px solid var(--border-subtle)',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <QrCode size={12} />
                                </button>
                              )}

                              {/* Edit Class Modal Trigger */}
                              {onEditClass && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEditClass(group);
                                  }}
                                  title={isAr ? 'تعديل موعد وبيانات الحصة' : 'Edit Class'}
                                  style={{
                                    padding: '3px 5px',
                                    borderRadius: '5px',
                                    backgroundColor: 'var(--bg-subtle)',
                                    border: '1px solid var(--border-subtle)',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Edit3 size={12} />
                                </button>
                              )}

                              {/* Open Roster Button */}
                              <button
                                type="button"
                                onClick={(e) => handleOpenRoster(group.id, e)}
                                title={isAr ? 'سجل الطلاب والغياب' : 'Student Roster'}
                                style={{
                                  padding: '3px 7px',
                                  borderRadius: '5px',
                                  backgroundColor: 'rgba(21, 136, 199, 0.1)',
                                  border: '1px solid rgba(21, 136, 199, 0.2)',
                                  color: 'var(--primary)',
                                  fontSize: '10.5px',
                                  fontWeight: '800',
                                  cursor: 'pointer'
                                }}
                              >
                                {isAr ? 'الطلاب' : 'Roster'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Daily Notes & Reminders Section in Grid Column */}
                  <div style={{
                    marginTop: 'auto',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <StickyNote size={12} color="var(--primary)" />
                        <span>{isAr ? 'ملاحظات اليوم' : 'Day Notes'}</span>
                        {dayNotes.length > 0 && <span style={{ opacity: 0.7 }}>({dayNotes.length})</span>}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setNoteTargetDay(day.key);
                          setNoteModalOpen(true);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary)',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        + {isAr ? 'إضافة' : 'Add'}
                      </button>
                    </div>

                    {dayNotes.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {dayNotes.slice(0, 3).map(note => (
                          <div
                            key={note.id}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '6px',
                              padding: '5px 8px',
                              borderRadius: '6px',
                              backgroundColor: note.isDone ? 'var(--bg-subtle)' : (note.priority === 'high' ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-surface)'),
                              border: `1px solid ${note.priority === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'var(--border-subtle)'}`,
                              fontSize: '11px'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={note.isDone}
                              onChange={() => toggleScheduleNote(day.key, note.id)}
                              style={{ marginTop: '2px', cursor: 'pointer' }}
                            />
                            <span style={{
                              flex: 1,
                              textDecoration: note.isDone ? 'line-through' : 'none',
                              color: note.isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                              lineHeight: 1.3
                            }}>
                              {note.text}
                            </span>
                            <button
                              type="button"
                              onClick={() => deleteScheduleNote(day.key, note.id)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 2. DAY FOCUS / EXPANDED TODAY VIEW ("يوم التلات يكبر ويشوف الجدول حلو") ── */}
      {viewMode === 'focus' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Day Navigation Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '14px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Flame size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                    {isAr ? `جدول حصص: ${DAYS_CONFIG.find(d => d.key === selectedDayKey)?.ar}` : `${DAYS_CONFIG.find(d => d.key === selectedDayKey)?.en} Schedule`}
                  </h2>
                  {selectedDayKey === todayKey && (
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: '900',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF'
                    }}>
                      {isAr ? 'اليوم الفعلي ⚡' : 'Current Day'}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  {selectedDaySessions.length} {isAr ? 'حصص دراسية مجدولة في هذا اليوم' : 'Sessions scheduled for this day'}
                </p>
              </div>
            </div>

            {/* Quick Day Switchers */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => {
                  const currIdx = DAYS_CONFIG.findIndex(d => d.key === selectedDayKey);
                  const prevIdx = (currIdx - 1 + DAYS_CONFIG.length) % DAYS_CONFIG.length;
                  setSelectedDayKey(DAYS_CONFIG[prevIdx].key);
                }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                {isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>

              <button
                onClick={() => setSelectedDayKey(todayKey)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: selectedDayKey === todayKey ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: selectedDayKey === todayKey ? '#FFFFFF' : 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                {isAr ? 'اليوم' : 'Today'}
              </button>

              <button
                onClick={() => {
                  const currIdx = DAYS_CONFIG.findIndex(d => d.key === selectedDayKey);
                  const nextIdx = (currIdx + 1) % DAYS_CONFIG.length;
                  setSelectedDayKey(DAYS_CONFIG[nextIdx].key);
                }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>
            </div>
          </div>

          {/* Expanded Big Session Cards */}
          {selectedDaySessions.length === 0 ? (
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-xl)',
              padding: '60px 20px',
              textAlign: 'center',
              border: '1px solid var(--border-subtle)'
            }}>
              <Calendar size={40} color="var(--primary)" style={{ opacity: 0.4, marginBottom: '12px' }} />
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                {isAr ? 'لا توجد حصص مجدولة في هذا اليوم' : 'No classes scheduled for this day'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                {isAr ? 'يمكنك إضافة موعد حصة جديد من خلال زر "إضافة مجموعة جديدة"' : 'Add new class schedules using the new cohort button'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {selectedDaySessions.map((session, sIdx) => {
                const group = session.group;
                return (
                  <div
                    key={session.id || sIdx}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '2px solid var(--primary)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      boxShadow: 'var(--shadow-md)',
                      position: 'relative'
                    }}
                  >
                    {/* Header: Time & Hall */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: '900'
                      }}>
                        <Clock size={14} />
                        <span>{formatTimeTo12h(session.startTime)} إلى {formatTimeTo12h(session.endTime)}</span>
                      </span>

                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12px',
                        fontWeight: '800',
                        color: 'var(--text-secondary)'
                      }}>
                        {session.hall || group.hallName || 'القاعة 1'}
                      </span>
                    </div>

                    {/* Group Title */}
                    <div>
                      <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 4px 0', lineHeight: 1.4 }}>
                        {isAr ? group.nameAr : group.nameEn || group.nameAr}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(21, 136, 199, 0.1)',
                          color: 'var(--primary)'
                        }}>
                          {group.subjectAr}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-secondary)'
                        }}>
                          {group.gradeAr}
                        </span>
                      </div>
                    </div>

                    {/* Location & Attendance info */}
                    <div style={{
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '10px',
                      fontSize: '12px'
                    }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', marginBottom: '2px' }}>
                          {isAr ? 'السنتر والمقر:' : 'Center Location:'}
                        </span>
                        <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                          {group.centerName}
                        </span>
                      </div>

                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', marginBottom: '2px' }}>
                          {isAr ? 'الطلاب المقيدون:' : 'Enrolled Students:'}
                        </span>
                        <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                          {session.enrolledCount} {isAr ? 'طالب بالقاعة' : 'Students'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: 'auto' }}>
                      <button
                        onClick={(e) => handleOpenRoster(group.id, e)}
                        style={{
                          padding: '9px 12px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '12.5px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Users size={14} />
                        <span>{isAr ? 'سجل الطلاب والغياب' : 'Student Roster'}</span>
                      </button>

                      {onOpenQr && (
                        <button
                          onClick={(e) => onOpenQr(group)}
                          style={{
                            padding: '9px 12px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--bg-subtle)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-subtle)',
                            fontSize: '12.5px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <QrCode size={14} />
                          <span>{isAr ? 'باركود QR' : 'QR Code'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Today's Notes Widget in Day View */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <StickyNote size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '15.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                  {isAr ? `ملاحظات وتنبيهات: ${DAYS_CONFIG.find(d => d.key === selectedDayKey)?.ar}` : `Notes for ${selectedDayKey}`}
                </h3>
              </div>

              <button
                onClick={() => {
                  setNoteTargetDay(selectedDayKey);
                  setNoteModalOpen(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  border: '1px solid rgba(21, 136, 199, 0.25)',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                <Plus size={13} />
                <span>{isAr ? 'إضافة ملحوظة جديدة' : 'Add Note'}</span>
              </button>
            </div>

            {(!scheduleNotes[selectedDayKey] || scheduleNotes[selectedDayKey].length === 0) ? (
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0, textAlign: 'center', padding: '16px' }}>
                {isAr ? 'لا توجد ملاحظات أو مهام مسجلة لهذا اليوم.' : 'No notes recorded for this day.'}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {scheduleNotes[selectedDayKey].map(note => (
                  <div
                    key={note.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: note.isDone ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <input
                        type="checkbox"
                        checked={note.isDone}
                        onChange={() => toggleScheduleNote(selectedDayKey, note.id)}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                      <span style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: note.isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: note.isDone ? 'line-through' : 'none'
                      }}>
                        {note.text}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: note.priority === 'high' ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-subtle)',
                        color: note.priority === 'high' ? '#EF4444' : 'var(--text-secondary)'
                      }}>
                        {note.time}
                      </span>
                      <button
                        onClick={() => deleteScheduleNote(selectedDayKey, note.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 3. AGENDA LIST VIEW ── */}
      {viewMode === 'agenda' && (
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {DAYS_CONFIG.map(day => {
            const daySessions = sessionsByDay[day.key] || [];
            if (daySessions.length === 0) return null;
            const isToday = day.key === todayKey;

            return (
              <div key={day.key} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  paddingBottom: '6px',
                  borderBottom: '2px solid var(--border-subtle)'
                }}>
                  <span style={{ fontSize: '15px', fontWeight: '900', color: isToday ? 'var(--primary)' : 'var(--text-primary)' }}>
                    {isAr ? day.ar : day.en}
                  </span>
                  {isToday && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF'
                    }}>
                      {isAr ? 'اليوم' : 'Today'}
                    </span>
                  )}
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    ({daySessions.length} {isAr ? 'حصة' : 'classes'})
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {daySessions.map(session => (
                    <div
                      key={session.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--primary-surface)',
                          color: 'var(--primary)',
                          fontSize: '12px',
                          fontWeight: '800'
                        }}>
                          {formatTimeTo12h(session.startTime)} - {formatTimeTo12h(session.endTime)}
                        </span>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                            {isAr ? session.group.nameAr : session.group.nameEn}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {session.group.centerName} • {session.hall || session.group.hallName}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenRoster(session.group.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--primary)',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          {isAr ? 'سجل الطلاب' : 'Roster'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── ADD NOTE MODAL ── */}
      {noteModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(4, 25, 53, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setNoteModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '440px',
              padding: '24px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <StickyNote size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  {isAr ? 'إضافة ملاحظة وتذكير لجدول المواعيد' : 'Add Day Note / Reminder'}
                </h3>
              </div>
              <button
                onClick={() => setNoteModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewNote} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {isAr ? 'اليوم المستهدف' : 'Target Day'}
                </label>
                <select
                  value={noteTargetDay}
                  onChange={(e) => setNoteTargetDay(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '12.5px',
                    fontWeight: '700'
                  }}
                >
                  {DAYS_CONFIG.map(d => (
                    <option key={d.key} value={d.key}>
                      {isAr ? d.ar : d.en} {d.key === todayKey ? (isAr ? '(اليوم)' : '(Today)') : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {isAr ? 'نص الملاحظة أو التذكير' : 'Note Content'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: تجهيز كويز التكاثر أو تسليم أوراق الغياب' : 'e.g. Prepare quiz papers'}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {isAr ? 'وقت التنبيه' : 'Alert Time'}
                  </label>
                  <input
                    type="time"
                    value={noteTime}
                    onChange={(e) => setNoteTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '12px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {isAr ? 'الأهمية' : 'Priority'}
                  </label>
                  <select
                    value={notePriority}
                    onChange={(e) => setNotePriority(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '12px'
                    }}
                  >
                    <option value="high">{isAr ? 'عاجل ومهم' : 'High'}</option>
                    <option value="medium">{isAr ? 'متوسط' : 'Medium'}</option>
                    <option value="normal">{isAr ? 'عادي' : 'Normal'}</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '9px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {isAr ? 'حفظ الملاحظة' : 'Save Note'}
                </button>
                <button
                  type="button"
                  onClick={() => setNoteModalOpen(false)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
