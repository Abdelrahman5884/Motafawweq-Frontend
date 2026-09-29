import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { useGroups } from '../../../context/GroupsContext';
import { useAuth } from '../../../context/AuthContext';
import {
  Calendar,
  Clock,
  Building2,
  BookOpen,
  MapPin,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Sparkles,
  Flame,
  Search,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  GraduationCap,
  Award,
  AlertCircle,
  StickyNote,
  UserCheck,
  Target
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

export const StudentWeeklySchedule = ({ onSwitchToGroups }) => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const { currentUser } = useAuth();
  const isAr = lang === 'ar';

  const {
    groups,
    enrolledStudents,
    studentStudySessions,
    addStudySession,
    toggleStudySession,
    deleteStudySession,
    scheduleNotes,
    addScheduleNote,
    toggleScheduleNote,
    deleteScheduleNote
  } = useGroups();

  // Detect Real-World Today
  const todayKey = useMemo(() => {
    const dayNum = new Date().getDay();
    const found = DAYS_CONFIG.find(d => d.dayIndex === dayNum);
    return found ? found.key : 'tuesday';
  }, []);

  const [selectedDayKey, setSelectedDayKey] = useState(todayKey);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'focus' | 'agenda'
  const [filterType, setFilterType] = useState('all'); // 'all' | 'center' | 'study'
  const [searchQuery, setSearchQuery] = useState('');

  // Add Study Session Modal State
  const [studyModalOpen, setStudyModalOpen] = useState(false);
  const [newStudy, setNewStudy] = useState({
    subject: 'الأحياء (الثانوية العامة)',
    title: '',
    day: todayKey,
    startTime: '19:00',
    endTime: '21:00',
    durationMinutes: 120,
    notes: '',
    color: '#1588C7'
  });

  // Add Note Modal State
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteTargetDay, setNoteTargetDay] = useState(todayKey);
  const [noteText, setNoteText] = useState('');
  const [noteTime, setNoteTime] = useState('18:00');
  const [notePriority, setNotePriority] = useState('medium');

  const studentNameAr = currentUser?.nameAr || 'عمر طارق القاضي';
  const studentPhone = currentUser?.phone || '+20 102 458 9912';

  // Extract enrolled center groups
  const enrolledGroups = useMemo(() => {
    return groups.filter(g => {
      const list = enrolledStudents[g.id] || [];
      return list.some(s => s.nameAr === studentNameAr || s.phone === studentPhone || s.name === currentUser?.name);
    });
  }, [groups, enrolledStudents, studentNameAr, studentPhone, currentUser]);

  // Combine Center Sessions and Self-Study Sessions per day
  const timetableByDay = useMemo(() => {
    const map = {
      saturday: [],
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: []
    };

    const q = searchQuery.trim().toLowerCase();

    // 1. Center Sessions
    enrolledGroups.forEach(group => {
      const slots = group.scheduleSlots || [];
      slots.forEach(slot => {
        const d = (slot.day || '').toLowerCase();
        if (!map[d]) return;

        if (q) {
          const match = (group.nameAr && group.nameAr.toLowerCase().includes(q)) ||
            (group.subjectAr && group.subjectAr.toLowerCase().includes(q)) ||
            (group.centerName && group.centerName.toLowerCase().includes(q)) ||
            (slot.hall && slot.hall.toLowerCase().includes(q));
          if (!match) return;
        }

        if (filterType === 'all' || filterType === 'center') {
          map[d].push({
            id: `center-slot-${group.id}-${slot.id}`,
            type: 'center',
            group,
            subject: group.subjectAr || 'المادة الدراسية',
            title: group.nameAr,
            centerName: group.centerName,
            hall: slot.hall || group.hallName || 'القاعة الرئيسية',
            teacherName: group.teacherNameAr || 'د. سلمى السيد',
            startTime: slot.startTime || '16:00',
            endTime: slot.endTime || '18:00',
            priceEgp: group.priceEgp,
            joinCode: group.joinCode
          });
        }
      });
    });

    // 2. Self-Study Sessions
    (studentStudySessions || []).forEach(sess => {
      const d = (sess.day || '').toLowerCase();
      if (!map[d]) return;

      if (q) {
        const match = (sess.subject && sess.subject.toLowerCase().includes(q)) ||
          (sess.title && sess.title.toLowerCase().includes(q)) ||
          (sess.notes && sess.notes.toLowerCase().includes(q));
        if (!match) return;
      }

      if (filterType === 'all' || filterType === 'study') {
        map[d].push({
          id: sess.id,
          type: 'study',
          subject: sess.subject,
          title: sess.title,
          startTime: sess.startTime,
          endTime: sess.endTime,
          durationMinutes: sess.durationMinutes || 120,
          isCompleted: sess.isCompleted,
          color: sess.color || '#1588C7',
          notes: sess.notes
        });
      }
    });

    // Sort chronologically by start time
    Object.keys(map).forEach(k => {
      map[k].sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));
    });

    return map;
  }, [enrolledGroups, studentStudySessions, filterType, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    let totalCenterSessions = 0;
    enrolledGroups.forEach(g => {
      totalCenterSessions += (g.scheduleSlots || []).length;
    });

    const studyList = studentStudySessions || [];
    const totalStudySessions = studyList.length;
    const completedStudySessions = studyList.filter(s => s.isCompleted).length;
    const studyHours = Math.round(studyList.reduce((acc, s) => acc + (Number(s.durationMinutes) || 120) / 60, 0));
    const completionRate = totalStudySessions > 0 ? Math.round((completedStudySessions / totalStudySessions) * 100) : 100;

    return {
      totalCenterSessions,
      totalStudySessions,
      completedStudySessions,
      studyHours,
      completionRate
    };
  }, [enrolledGroups, studentStudySessions]);

  const formatTimeTo12h = (t24) => {
    if (!t24) return '';
    const [h, m] = t24.split(':').map(Number);
    const period = h >= 12 ? (isAr ? 'م' : 'PM') : (isAr ? 'ص' : 'AM');
    const h12 = h % 12 || 12;
    return `${h12}:${m < 10 ? '0' + m : m} ${period}`;
  };

  const handleSaveStudySession = (e) => {
    e.preventDefault();
    if (!newStudy.title.trim()) return;
    addStudySession(newStudy);
    setNewStudy({
      subject: 'الأحياء (الثانوية العامة)',
      title: '',
      day: todayKey,
      startTime: '19:00',
      endTime: '21:00',
      durationMinutes: 120,
      notes: '',
      color: '#1588C7'
    });
    setStudyModalOpen(false);
  };

  const handleSaveNote = (e) => {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* ── TOP STATS BAR (Sleek, Animated, Clean) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
        gap: '14px'
      }}>
        {/* Center Classes Stat */}
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: 'var(--shadow-xs)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
        }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-surface)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Building2 size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {isAr ? 'حصص السناتر الأسبوعية' : 'Weekly Center Classes'}
              </span>
              <span style={{
                fontSize: '9.5px',
                fontWeight: '900',
                padding: '2px 6px',
                borderRadius: '999px',
                backgroundColor: 'rgba(21, 136, 199, 0.12)',
                color: 'var(--primary)'
              }}>
                {isAr ? 'مؤكدة' : 'Fixed'}
              </span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{stats.totalCenterSessions} <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{isAr ? 'حصص سنتر' : 'Classes'}</span></span>
              {onSwitchToGroups && (
                <button
                  type="button"
                  onClick={onSwitchToGroups}
                  style={{
                    border: 'none',
                    background: 'var(--primary-surface)',
                    color: 'var(--primary)',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {isAr ? 'إدارة المجموعات ←' : 'Cohorts →'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Self-Study Sessions Stat */}
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: 'var(--shadow-xs)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
        }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)',
            color: '#8B5CF6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <BookOpen size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {isAr ? 'جلسات المذاكرة الخاصة' : 'Self-Study Sessions'}
              </span>
              <span style={{
                fontSize: '9.5px',
                fontWeight: '900',
                padding: '2px 6px',
                borderRadius: '999px',
                backgroundColor: 'rgba(139, 92, 246, 0.12)',
                color: '#8B5CF6'
              }}>
                {isAr ? 'مخططة' : 'Planned'}
              </span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {stats.totalStudySessions} <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{isAr ? 'جلسات' : 'Sessions'}</span>
            </div>
          </div>
        </div>

        {/* Total Planned Study Hours */}
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: 'var(--shadow-xs)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
        }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Clock size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {isAr ? 'ساعات المذاكرة المستهدفة' : 'Target Study Hours'}
              </span>
              <span style={{
                fontSize: '9.5px',
                fontWeight: '900',
                padding: '2px 6px',
                borderRadius: '999px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981'
              }}>
                {isAr ? 'أسبوعياً' : 'Weekly'}
              </span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {stats.studyHours} <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{isAr ? 'ساعة أسبوعياً' : 'Hours'}</span>
            </div>
          </div>
        </div>

        {/* Study Completion Rate */}
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: 'var(--shadow-xs)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
        }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
            color: '#F59E0B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Flame size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {isAr ? 'نسبة الإنجاز الأسبوعي' : 'Completion Rate'}
              </span>
              <span style={{
                fontSize: '9.5px',
                fontWeight: '900',
                padding: '2px 6px',
                borderRadius: '999px',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                color: '#F59E0B'
              }}>
                {stats.completedStudySessions}/{stats.totalStudySessions}
              </span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {stats.completionRate}%
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
        gap: '12px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        {/* Left: View Modes & Filter Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* View Mode Toggle */}
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
                padding: '6px 12px',
                borderRadius: '7px',
                border: 'none',
                backgroundColor: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'grid' ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Calendar size={13} />
              <span>{isAr ? 'الجدول الأسبوعي' : '7-Day Grid'}</span>
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
                padding: '6px 12px',
                borderRadius: '7px',
                border: 'none',
                backgroundColor: viewMode === 'focus' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'focus' ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Target size={13} />
              <span>{isAr ? 'اليوم' : 'Today'}</span>
            </button>
          </div>

          {/* Type Filter Pills */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-subtle)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setFilterType('all')}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: filterType === 'all' ? 'var(--bg-surface)' : 'transparent',
                color: filterType === 'all' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: filterType === 'all' ? '800' : '600',
                fontSize: '11.5px',
                cursor: 'pointer',
                boxShadow: filterType === 'all' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              {isAr ? 'الكل' : 'All'}
            </button>
            <button
              onClick={() => setFilterType('center')}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: filterType === 'center' ? 'var(--bg-surface)' : 'transparent',
                color: filterType === 'center' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: filterType === 'center' ? '800' : '600',
                fontSize: '11.5px',
                cursor: 'pointer',
                boxShadow: filterType === 'center' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              {isAr ? 'حصص السنتر' : 'Center Classes'}
            </button>
            <button
              onClick={() => setFilterType('study')}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: filterType === 'study' ? 'var(--bg-surface)' : 'transparent',
                color: filterType === 'study' ? '#8B5CF6' : 'var(--text-secondary)',
                fontWeight: filterType === 'study' ? '800' : '600',
                fontSize: '11.5px',
                cursor: 'pointer',
                boxShadow: filterType === 'study' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              {isAr ? 'المذاكرة الخاصة' : 'Self-Study'}
            </button>
          </div>
        </div>

        {/* Right: Search & Add Study Session Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Quick Search */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '9px',
            border: '1px solid var(--border-subtle)',
            padding: '5px 10px'
          }}>
            <Search size={14} color="var(--text-muted)" style={{ marginInlineEnd: '6px' }} />
            <input
              type="text"
              placeholder={isAr ? 'بحث في المادة أو السنتر...' : 'Search subjects, centers...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '12px',
                outline: 'none',
                width: '140px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Add Study Session Button */}
          <button
            onClick={() => {
              setNewStudy(prev => ({ ...prev, day: selectedDayKey }));
              setStudyModalOpen(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-primary)',
              transition: 'opacity 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Plus size={15} />
            <span>{isAr ? 'إضافة جلسة مذاكرة' : 'Add Study Session'}</span>
          </button>
        </div>
      </div>

      {/* ── FOCUS MODE DAY SELECTOR TABS ONLY ── */}
      {viewMode === 'focus' && (
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '4px',
          scrollbarWidth: 'none'
        }}>
          {DAYS_CONFIG.map(day => {
            const isToday = day.key === todayKey;
            const isSelected = day.key === selectedDayKey;
            const dayItems = timetableByDay[day.key] || [];
            const centerCount = dayItems.filter(i => i.type === 'center').length;
            const studyCount = dayItems.filter(i => i.type === 'study').length;

            return (
              <button
                key={day.key}
                onClick={() => {
                  setSelectedDayKey(day.key);
                }}
                style={{
                  flex: '1 0 110px',
                  padding: '9px 12px',
                  borderRadius: '12px',
                  border: isSelected
                    ? '2px solid var(--primary)'
                    : isToday
                      ? '1.5px solid rgba(21, 136, 199, 0.4)'
                      : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected
                    ? 'var(--primary-surface)'
                    : isToday
                      ? 'var(--bg-surface)'
                      : 'var(--bg-surface-elevated)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: isSelected || isToday ? '900' : '700',
                    color: isSelected ? 'var(--primary)' : 'var(--text-primary)'
                  }}>
                    {isAr ? day.ar : day.en}
                  </span>
                  {isToday && (
                    <span style={{
                      fontSize: '8.5px',
                      fontWeight: '900',
                      padding: '1px 4px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF'
                    }}>
                      {isAr ? 'اليوم' : 'Today'}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '10.5px' }}>
                  {centerCount > 0 && (
                    <span style={{
                      color: 'var(--primary)',
                      fontWeight: '800'
                    }}>
                      {centerCount} {isAr ? 'سنتر' : 'Class'}
                    </span>
                  )}
                  {centerCount > 0 && studyCount > 0 && <span>•</span>}
                  {studyCount > 0 && (
                    <span style={{
                      color: '#8B5CF6',
                      fontWeight: '800'
                    }}>
                      {studyCount} {isAr ? 'مذاكرة' : 'Study'}
                    </span>
                  )}
                  {centerCount === 0 && studyCount === 0 && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                      {isAr ? 'راحة' : 'Rest'}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── VIEW MODE 1: 7-DAY GRID VIEW ── */}
      {viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 155px), 1fr))',
          gap: '12px',
          alignItems: 'stretch'
        }}>
          {DAYS_CONFIG.map(day => {
            const isToday = day.key === todayKey;
            const isSelected = day.key === selectedDayKey;
            const items = timetableByDay[day.key] || [];
            const dayNotes = scheduleNotes[day.key] || [];

            return (
              <div
                key={day.key}
                onClick={() => setSelectedDayKey(day.key)}
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderRadius: '16px',
                  border: isToday
                    ? '2px solid var(--primary)'
                    : isSelected
                      ? '1.5px solid rgba(21, 136, 199, 0.4)'
                      : '1px solid var(--border-subtle)',
                  boxShadow: isToday
                    ? '0 0 0 1px rgba(21, 136, 199, 0.3), var(--shadow-sm)'
                    : 'var(--shadow-xs)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  transition: 'transform 0.18s ease, box-shadow 0.18s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = isToday ? '0 8px 24px rgba(21, 136, 199, 0.22)' : 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isToday ? '0 0 0 1px rgba(21, 136, 199, 0.3), var(--shadow-sm)' : 'var(--shadow-xs)';
                }}
              >
                {/* Column Day Header */}
                <div style={{
                  padding: '12px',
                  backgroundColor: isToday
                    ? 'var(--primary-surface)'
                    : isSelected
                      ? 'var(--bg-subtle)'
                      : 'var(--bg-surface)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{
                      fontSize: '13.5px',
                      fontWeight: '900',
                      color: isToday ? 'var(--primary)' : 'var(--text-primary)'
                    }}>
                      {isAr ? day.ar : day.en}
                    </span>
                    {isToday && (
                      <span style={{
                        fontSize: '9px',
                        fontWeight: '900',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF'
                      }}>
                        {isAr ? 'اليوم' : 'Today'}
                      </span>
                    )}
                  </div>

                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: '800',
                    color: items.length > 0 ? 'var(--primary)' : 'var(--text-muted)'
                  }}>
                    {items.length} {isAr ? 'مواعيد' : 'Slots'}
                  </span>
                </div>

                {/* Day Items List */}
                <div style={{
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  flex: 1
                }}>
                  {items.length === 0 ? (
                    <div style={{
                      flex: 1,
                      minHeight: '140px',
                      padding: '24px 8px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '11px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: '10px',
                      border: '1px dashed var(--border-subtle)',
                      gap: '6px'
                    }}>
                      <Calendar size={20} style={{ opacity: 0.35 }} />
                      <span style={{ fontWeight: '600' }}>{isAr ? 'لا توجد مواعيد' : 'Free day'}</span>
                    </div>
                  ) : (
                    items.map(item => (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: item.type === 'center'
                            ? (isDark ? 'rgba(21, 136, 199, 0.12)' : 'rgba(21, 136, 199, 0.06)')
                            : (item.isCompleted
                              ? 'rgba(16, 185, 129, 0.08)'
                              : (isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.06)')),
                          border: '1px solid',
                          borderColor: item.type === 'center'
                            ? 'rgba(21, 136, 199, 0.3)'
                            : (item.isCompleted ? 'rgba(16, 185, 129, 0.3)' : 'rgba(139, 92, 246, 0.3)'),
                          borderRadius: '10px',
                          padding: '9px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '5px',
                          transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {/* Type Badge & Time */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{
                            fontSize: '9.5px',
                            fontWeight: '900',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            backgroundColor: item.type === 'center' ? 'var(--primary)' : '#8B5CF6',
                            color: '#FFFFFF'
                          }}>
                            {item.type === 'center'
                              ? (isAr ? 'سنتر' : 'Center')
                              : (isAr ? 'مذاكرة' : 'Study')}
                          </span>

                          <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                            {formatTimeTo12h(item.startTime)}
                          </span>
                        </div>

                        {/* Title & Subject */}
                        <div>
                          <div style={{
                            fontSize: '11.5px',
                            fontWeight: '800',
                            color: 'var(--text-primary)',
                            lineHeight: 1.3,
                            textDecoration: item.isCompleted ? 'line-through' : 'none'
                          }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {item.subject}
                          </div>
                        </div>

                        {/* Center specific info */}
                        {item.type === 'center' && (
                          <div style={{
                            fontSize: '10px',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: 'rgba(0,0,0,0.03)',
                            padding: '3px 6px',
                            borderRadius: '5px'
                          }}>
                            <MapPin size={11} color="var(--primary)" />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.hall}
                            </span>
                          </div>
                        )}

                        {/* Study specific completion toggle */}
                        {item.type === 'study' && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '2px',
                            marginTop: '2px',
                            borderTop: '1px dashed var(--border-subtle)'
                          }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStudySession(item.id);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '10px',
                                fontWeight: '800',
                                color: item.isCompleted ? '#10B981' : 'var(--text-muted)'
                              }}
                            >
                              {item.isCompleted ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                              <span>{item.isCompleted ? (isAr ? 'تم الإنجاز' : 'Done') : (isAr ? 'إنجاز' : 'Mark done')}</span>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteStudySession(item.id);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '2px'
                              }}
                              title={isAr ? 'حذف جلسة المذاكرة' : 'Delete'}
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}

                  {/* Daily Notes Quick Pill */}
                  {dayNotes.length > 0 && (
                    <div style={{
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: '8px',
                      padding: '6px 8px',
                      marginTop: 'auto',
                      border: '1px dashed var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '9.5px', fontWeight: '800', color: 'var(--text-muted)' }}>
                          <StickyNote size={10} style={{ verticalAlign: 'middle', marginInlineEnd: '3px' }} />
                          {isAr ? 'ملاحظات' : 'Notes'}
                        </span>
                        <span style={{ fontSize: '9px', fontWeight: '900', color: 'var(--primary)' }}>
                          {dayNotes.length}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '10.5px',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {dayNotes[0].text}
                      </div>
                    </div>
                  )}

                  {/* Add Study Session / Note trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewStudy(prev => ({ ...prev, day: day.key }));
                      setStudyModalOpen(true);
                    }}
                    style={{
                      width: '100%',
                      padding: '5px',
                      borderRadius: '6px',
                      border: '1px dashed var(--border-subtle)',
                      backgroundColor: 'transparent',
                      color: 'var(--text-muted)',
                      fontSize: '10.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      marginTop: '4px'
                    }}
                  >
                    <Plus size={11} />
                    <span>{isAr ? 'جلسة مذاكرة' : 'Study Slot'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── VIEW MODE 2: EXPANDED DAY FOCUS ("يكبر كده ويشوف الجدول حلو") ── */}
      {viewMode === 'focus' && (
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderRadius: '18px',
          border: selectedDayKey === todayKey ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Day Focus Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '16px'
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
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '16px'
              }}>
                <Calendar size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                    {isAr ? `جدول ومذاكرة يوم ${DAYS_CONFIG.find(d => d.key === selectedDayKey)?.ar}` : `${DAYS_CONFIG.find(d => d.key === selectedDayKey)?.en} Schedule`}
                  </h2>
                  {selectedDayKey === todayKey && (
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: '900',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF'
                    }}>
                      {isAr ? 'اليوم النشط' : 'TODAY'}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
                  {isAr
                    ? 'عرض موسع لكافة حصص السنتر وجلسات الاستذكار والمهام الخاصة بهذا اليوم'
                    : 'Expanded view of all center sessions, self-study goals, and daily tasks'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => {
                  setNoteTargetDay(selectedDayKey);
                  setNoteModalOpen(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '9px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <StickyNote size={13} color="var(--primary)" />
                <span>{isAr ? 'إضافة ملحوظة اليوم' : 'Add Day Note'}</span>
              </button>

              <button
                onClick={() => {
                  setNewStudy(prev => ({ ...prev, day: selectedDayKey }));
                  setStudyModalOpen(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '9px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} />
                <span>{isAr ? 'جلسة استذكار جديدة' : 'Add Study Session'}</span>
              </button>
            </div>
          </div>

          {/* Expanded Sessions Cards */}
          {(timetableByDay[selectedDayKey] || []).length === 0 ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '14px',
              color: 'var(--text-muted)'
            }}>
              <Calendar size={36} color="var(--primary)" style={{ margin: '0 auto 8px', opacity: 0.5 }} />
              <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px' }}>
                {isAr ? 'لا توجد حصص أو جلسات مذاكرة مسجلة في هذا اليوم' : 'No sessions scheduled for this day'}
              </h4>
              <p style={{ fontSize: '12px', margin: 0 }}>
                {isAr ? 'استغل اليوم في الراحة أو أضف جلسة استذكار جديدة لمراجعة دروسك' : 'Add a study session to organize your day'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(timetableByDay[selectedDayKey] || []).map(item => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid',
                    borderColor: item.type === 'center'
                      ? 'rgba(21, 136, 199, 0.4)'
                      : (item.isCompleted ? 'rgba(16, 185, 129, 0.4)' : 'rgba(139, 92, 246, 0.4)'),
                    borderRadius: '14px',
                    padding: '16px 20px',
                    boxShadow: 'var(--shadow-xs)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: item.type === 'center'
                        ? 'var(--primary-surface)'
                        : (item.isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)'),
                      color: item.type === 'center'
                        ? 'var(--primary)'
                        : (item.isCompleted ? '#10B981' : '#8B5CF6'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {item.type === 'center' ? <Building2 size={24} /> : <BookOpen size={24} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '900',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          backgroundColor: item.type === 'center' ? 'var(--primary)' : '#8B5CF6',
                          color: '#FFFFFF'
                        }}>
                          {item.type === 'center' ? (isAr ? 'حصة سنتر معتمدة' : 'Center Class') : (isAr ? 'جلسة استذكار خاصة' : 'Self-Study')}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)' }}>
                          {item.subject}
                        </span>
                      </div>

                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '900',
                        color: 'var(--text-primary)',
                        margin: 0,
                        textDecoration: item.isCompleted ? 'line-through' : 'none'
                      }}>
                        {item.title}
                      </h3>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginTop: '6px',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} color="var(--primary)" />
                          {formatTimeTo12h(item.startTime)} - {formatTimeTo12h(item.endTime)}
                        </span>

                        {item.type === 'center' ? (
                          <>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Building2 size={13} color="#F59E0B" />
                              {item.centerName}
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={13} color="#10B981" />
                              {item.hall}
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <GraduationCap size={13} />
                              {item.teacherName}
                            </span>
                          </>
                        ) : (
                          item.notes && (
                            <span style={{ color: 'var(--text-muted)' }}>
                              🎯 {item.notes}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.type === 'study' ? (
                      <>
                        <button
                          onClick={() => toggleStudySession(item.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: item.isCompleted ? '#10B981' : 'var(--bg-subtle)',
                            color: item.isCompleted ? '#FFFFFF' : 'var(--text-primary)',
                            fontSize: '12px',
                            fontWeight: '800',
                            cursor: 'pointer'
                          }}
                        >
                          <Check size={14} />
                          <span>{item.isCompleted ? (isAr ? 'مكتملة' : 'Completed') : (isAr ? 'تحديد كمكتملة' : 'Mark Done')}</span>
                        </button>

                        <button
                          onClick={() => deleteStudySession(item.id)}
                          style={{
                            padding: '8px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'transparent',
                            color: '#EF4444',
                            cursor: 'pointer'
                          }}
                          title={isAr ? 'حذف الجلسة' : 'Delete'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    ) : (
                      <span style={{
                        fontSize: '11.5px',
                        fontWeight: '800',
                        color: 'var(--primary)',
                        backgroundColor: 'var(--primary-surface)',
                        padding: '6px 12px',
                        borderRadius: '8px'
                      }}>
                        {isAr ? 'كود: ' + item.joinCode : item.joinCode}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Daily Notes section for the day */}
          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <StickyNote size={16} color="var(--primary)" />
                <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  {isAr ? 'قائمة المهام والملاحظات اليومية' : 'Daily Tasks & Reminders'}
                </h4>
              </div>

              <button
                onClick={() => {
                  setNoteTargetDay(selectedDayKey);
                  setNoteModalOpen(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={13} />
                <span>{isAr ? 'إضافة ملحوظة' : 'Add Note'}</span>
              </button>
            </div>

            {(scheduleNotes[selectedDayKey] || []).length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                {isAr ? 'لا توجد مهام أو ملاحظات مسجلة لهذا اليوم.' : 'No notes added for today.'}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(scheduleNotes[selectedDayKey] || []).map(note => (
                  <div
                    key={note.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => toggleScheduleNote(selectedDayKey, note.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: note.isDone ? '#10B981' : 'var(--text-muted)',
                          padding: 0
                        }}
                      >
                        {note.isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </button>

                      <span style={{
                        fontSize: '12.5px',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        textDecoration: note.isDone ? 'line-through' : 'none'
                      }}>
                        {note.text}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {note.time && (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {formatTimeTo12h(note.time)}
                        </span>
                      )}

                      <button
                        onClick={() => deleteScheduleNote(selectedDayKey, note.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '2px'
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL: ADD STUDY SESSION ── */}
      {studyModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(4, 25, 53, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 10001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '18px',
            padding: '24px',
            maxWidth: '480px',
            width: '100%',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                  {isAr ? 'إضافة جلسة استذكار ومراجعة' : 'Add Self-Study Session'}
                </h3>
              </div>
              <button
                onClick={() => setStudyModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStudySession} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Subject */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {isAr ? 'المادة الدراسية' : 'Subject'} *
                </label>
                <select
                  value={newStudy.subject}
                  onChange={(e) => setNewStudy({ ...newStudy, subject: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '700',
                    outline: 'none'
                  }}
                >
                  <option value="الأحياء (الثانوية العامة)">{isAr ? 'الأحياء (الثانوية العامة)' : 'Biology'}</option>
                  <option value="الفيزياء (الثانوية العامة)">{isAr ? 'الفيزياء (الثانوية العامة)' : 'Physics'}</option>
                  <option value="الكيمياء">{isAr ? 'الكيمياء' : 'Chemistry'}</option>
                  <option value="اللغة العربية">{isAr ? 'اللغة العربية' : 'Arabic'}</option>
                  <option value="اللغة الإنجليزية">{isAr ? 'اللغة الإنجليزية' : 'English'}</option>
                  <option value="الرياضيات">{isAr ? 'الرياضيات والرياضيات التطبيقية' : 'Mathematics'}</option>
                  <option value="الجيولوجيا وعلوم البيئة">{isAr ? 'الجيولوجيا وعلوم البيئة' : 'Geology'}</option>
                </select>
              </div>

              {/* Title / Goal */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {isAr ? 'موضوع الجلسة والهدف من المذاكرة' : 'Topic & Goal'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: مراجعة الباب الثاني وحل شيت كيرشوف 30 سؤال' : 'e.g. Solve 30 practice problems'}
                  value={newStudy.title}
                  onChange={(e) => setNewStudy({ ...newStudy, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Day */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {isAr ? 'يوم المذاكرة' : 'Day of Week'} *
                </label>
                <select
                  value={newStudy.day}
                  onChange={(e) => setNewStudy({ ...newStudy, day: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '700',
                    outline: 'none'
                  }}
                >
                  {DAYS_CONFIG.map(d => (
                    <option key={d.key} value={d.key}>
                      {isAr ? d.ar : d.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start & End Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {isAr ? 'من الساعة' : 'Start Time'}
                  </label>
                  <input
                    type="time"
                    value={newStudy.startTime}
                    onChange={(e) => setNewStudy({ ...newStudy, startTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {isAr ? 'إلى الساعة' : 'End Time'}
                  </label>
                  <input
                    type="time"
                    value={newStudy.endTime}
                    onChange={(e) => setNewStudy({ ...newStudy, endTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {isAr ? 'ملاحظات إضافية (اختياري)' : 'Notes'}
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: التركيز على المسائل المقالية' : 'e.g. Focus on essay questions'}
                  value={newStudy.notes}
                  onChange={(e) => setNewStudy({ ...newStudy, notes: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setStudyModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {isAr ? 'تأكيد الإضافة للجدول' : 'Add to Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD DAILY NOTE ── */}
      {noteModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(4, 25, 53, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 10001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '18px',
            padding: '24px',
            maxWidth: '440px',
            width: '100%',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <StickyNote size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                  {isAr ? `إضافة ملحوظة ليوم ${DAYS_CONFIG.find(d => d.key === noteTargetDay)?.ar}` : 'Add Daily Note'}
                </h3>
              </div>
              <button
                onClick={() => setNoteModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNote} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {isAr ? 'نص الملحوظة / المهمة' : 'Note Content'} *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={isAr ? 'مثال: طباعة ملزمة البلاغة ومراجعة 10 تدريبات قبل الحصة' : 'Write your note here...'}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setNoteModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {isAr ? 'حفظ الملحوظة' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentWeeklySchedule;
