import React, { useState, useMemo, useCallback } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { useGroups } from '../../../context/GroupsContext';
import { useAuth } from '../../../context/AuthContext';
import { copyTextToClipboard } from '../../../utils';
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
  Pencil,
  Flame,
  Search,
  Check,
  GraduationCap,
  AlertCircle,
  StickyNote,
  Target,
  Printer,
  RefreshCw,
  X,
  Copy,
  Maximize2,
} from 'lucide-react';
import {
  DAYS_CONFIG,
  NOTE_PRIORITIES,
  DEFAULT_SUBJECTS,
  getTodayDayKey,
  getColorPreset,
  parseTimeToMinutes,
  formatTimeTo12h,
  formatDurationLabel,
  formatStudyHoursValue,
  formatSlotsCount,
  formatArabicSessionsUnit,
  findScheduleConflict,
} from './scheduleUtils';
import { StudySessionModal } from './StudySessionModal';
import { ScheduleNoteModal } from './ScheduleNoteModal';
import { printStudentWeeklySchedule } from './studentSchedulePrintTemplate';

const EMPTY_TIMETABLE = () => ({
  saturday: [],
  sunday: [],
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
});

export const StudentWeeklySchedule = ({ onSwitchToGroups }) => {
  const { lang } = useLanguage();
  const { isDark } = useTheme();
  const { currentUser } = useAuth();
  const isAr = lang === 'ar';

  const {
    groups,
    loadingGroups,
    groupsError,
    loadingSchedule,
    scheduleError,
    refreshGroups,
    enrolledStudents,
    studentStudySessions,
    addStudySession,
    updateStudySession,
    toggleStudySession,
    deleteStudySession,
    scheduleNotes,
    addScheduleNote,
    updateScheduleNote,
    toggleScheduleNote,
    deleteScheduleNote,
  } = useGroups();

  const todayKey = useMemo(() => getTodayDayKey(), []);

  const [selectedDayKey, setSelectedDayKey] = useState(todayKey);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'focus'
  const [filterType, setFilterType] = useState('all'); // 'all' | 'center' | 'study'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState('');
  const [busyIds, setBusyIds] = useState(() => new Set());

  // Add / Edit Study Session Modal State
  const [studyModalOpen, setStudyModalOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [isSavingStudy, setIsSavingStudy] = useState(false);
  const [studyServerError, setStudyServerError] = useState('');
  const [studyForm, setStudyForm] = useState({
    subject: DEFAULT_SUBJECTS[0],
    title: '',
    day: todayKey,
    startTime: '19:00',
    endTime: '21:00',
    notes: '',
    color: '#1588C7',
  });

  // Add / Edit Daily Note Modal State
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // { id, previousDay } | null
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteServerError, setNoteServerError] = useState('');
  const [noteForm, setNoteForm] = useState({
    day: todayKey,
    text: '',
    time: '',
    priority: 'medium',
  });

  const studentNameAr = currentUser?.nameAr || currentUser?.name || '';
  const studentPhone = currentUser?.phone || '';

  // Strictly confirmed ENROLLED center groups only (matches backend overlap & timetable rules)
  const enrolledGroups = useMemo(() => {
    const list = Array.isArray(groups) ? groups : [];
    if (currentUser?.role === 'student') {
      return list.filter((g) => g.enrollmentStatus === 'enrolled');
    }
    return list.filter((g) => {
      const roster = enrolledStudents[g.id] || [];
      return roster.some(
        (s) =>
          s.nameAr === studentNameAr ||
          s.phone === studentPhone ||
          s.name === currentUser?.name
      );
    });
  }, [groups, enrolledStudents, studentNameAr, studentPhone, currentUser]);

  // 1. Unfiltered complete timetable (used for conflict checking, stats & print)
  const allTimetableByDay = useMemo(() => {
    const map = EMPTY_TIMETABLE();

    enrolledGroups.forEach((group) => {
      const slots = group.scheduleSlots || [];
      slots.forEach((slot) => {
        const d = String(slot.day || '').toLowerCase();
        if (!map[d]) return;

        const start = slot.startTime || '16:00';
        const end = slot.endTime || '18:00';
        const dur = Math.max(
          0,
          parseTimeToMinutes(end) - parseTimeToMinutes(start)
        );

        map[d].push({
          id: `center-slot-${group.id}-${slot.id}`,
          type: 'center',
          group,
          subject: isAr
            ? group.subjectAr || 'المادة الدراسية'
            : group.subjectEn || group.subjectAr || 'Subject',
          title: isAr
            ? group.nameAr || group.nameEn || ''
            : group.nameEn || group.nameAr || '',
          centerName: group.centerName || '',
          hall: slot.hall || group.hallName || (isAr ? 'القاعة الرئيسية' : 'Main Hall'),
          teacherName: group.teacherName || group.teacherNameAr || '',
          startTime: start,
          endTime: end,
          durationMinutes: dur || 120,
          priceEgp: group.priceEgp,
          joinCode: group.joinCode || '',
        });
      });
    });

    (studentStudySessions || []).forEach((sess) => {
      const d = String(sess.day || '').toLowerCase();
      if (!map[d]) return;

      const start = sess.startTime || '19:00';
      const end = sess.endTime || '21:00';
      const computedDur =
        Number(sess.durationMinutes) > 0
          ? Number(sess.durationMinutes)
          : Math.max(15, parseTimeToMinutes(end) - parseTimeToMinutes(start));

      map[d].push({
        id: sess.id,
        type: 'study',
        subject: sess.subject || (isAr ? 'مذاكرة عامة' : 'General Study'),
        title: sess.title || '',
        startTime: start,
        endTime: end,
        durationMinutes: computedDur,
        isCompleted: Boolean(sess.isCompleted),
        color: sess.color || '#1588C7',
        notes: sess.notes || '',
      });
    });

    Object.keys(map).forEach((k) => {
      map[k].sort((a, b) =>
        (a.startTime || '00:00').localeCompare(b.startTime || '00:00')
      );
    });

    return map;
  }, [enrolledGroups, studentStudySessions, isAr]);

  // 2. Filtered timetable for display (applies filterType & searchQuery)
  const filteredTimetableByDay = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const map = EMPTY_TIMETABLE();

    Object.keys(map).forEach((dayKey) => {
      map[dayKey] = (allTimetableByDay[dayKey] || []).filter((item) => {
        if (filterType !== 'all' && item.type !== filterType) return false;
        if (!q) return true;
        const haystack = [
          item.title,
          item.subject,
          item.centerName,
          item.hall,
          item.teacherName,
          item.notes,
          item.joinCode,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      });
    });

    return map;
  }, [allTimetableByDay, filterType, searchQuery]);

  // Weekly KPI statistics (always derived from confirmed unfiltered schedule)
  const stats = useMemo(() => {
    let totalCenterSessions = 0;
    enrolledGroups.forEach((g) => {
      totalCenterSessions += (g.scheduleSlots || []).length;
    });

    const studyList = studentStudySessions || [];
    const totalStudySessions = studyList.length;
    const completedStudySessions = studyList.filter((s) => s.isCompleted).length;
    const totalStudyMinutes = studyList.reduce((acc, s) => {
      const explicit = Number(s.durationMinutes);
      if (explicit > 0) return acc + explicit;
      const diff = parseTimeToMinutes(s.endTime) - parseTimeToMinutes(s.startTime);
      return acc + (diff > 0 ? diff : 60);
    }, 0);
    const completionRate =
      totalStudySessions > 0
        ? Math.round((completedStudySessions / totalStudySessions) * 100)
        : 0;

    return {
      totalCenterSessions,
      totalStudySessions,
      completedStudySessions,
      totalStudyMinutes,
      completionRate,
    };
  }, [enrolledGroups, studentStudySessions]);

  const studyHoursDisplay = useMemo(
    () => formatStudyHoursValue(stats.totalStudyMinutes, isAr),
    [stats.totalStudyMinutes, isAr]
  );

  const availableSubjects = useMemo(() => {
    const enrolledSubjs = enrolledGroups
      .map((g) => (g.subjectAr || '').trim())
      .filter(Boolean);
    return Array.from(new Set([...enrolledSubjs, ...DEFAULT_SUBJECTS]));
  }, [enrolledGroups]);

  // Conflict check against ALL sessions (unfiltered!)
  const studyConflictError = useMemo(
    () =>
      findScheduleConflict({
        day: studyForm.day,
        startTime: studyForm.startTime,
        endTime: studyForm.endTime,
        allTimetableByDay,
        editingSessionId,
        isAr,
      }),
    [
      studyForm.day,
      studyForm.startTime,
      studyForm.endTime,
      allTimetableByDay,
      editingSessionId,
      isAr,
    ]
  );

  const hasActiveFilters = filterType !== 'all' || searchQuery.trim().length > 0;
  const totalFilteredCount = useMemo(
    () =>
      Object.values(filteredTimetableByDay).reduce(
        (sum, arr) => sum + arr.length,
        0
      ),
    [filteredTimetableByDay]
  );
  const totalUnfilteredCount = stats.totalCenterSessions + stats.totalStudySessions;

  const markBusy = useCallback((id, busy) => {
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (busy) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  // Study Session Modal Handlers
  const closeStudyModal = useCallback(() => {
    setStudyModalOpen(false);
    setEditingSessionId(null);
    setStudyServerError('');
  }, []);

  const openCreateStudyModal = useCallback(
    (dayKey) => {
      setEditingSessionId(null);
      setStudyServerError('');
      setStudyForm({
        subject: availableSubjects[0] || DEFAULT_SUBJECTS[0],
        title: '',
        day: dayKey || selectedDayKey,
        startTime: '19:00',
        endTime: '21:00',
        notes: '',
        color: '#1588C7',
      });
      setStudyModalOpen(true);
    },
    [availableSubjects, selectedDayKey]
  );

  const openEditStudyModal = useCallback(
    (item, dayKey) => {
      setEditingSessionId(item.id);
      setStudyServerError('');
      setStudyForm({
        subject: item.subject || availableSubjects[0] || DEFAULT_SUBJECTS[0],
        title: item.title || '',
        day: dayKey || selectedDayKey,
        startTime: item.startTime || '19:00',
        endTime: item.endTime || '21:00',
        notes: item.notes || '',
        color: item.color || '#1588C7',
      });
      setStudyModalOpen(true);
    },
    [availableSubjects, selectedDayKey]
  );

  const handleSaveStudySession = async (e) => {
    e.preventDefault();
    if (studyForm.title.trim().length < 2 || studyConflictError || isSavingStudy) {
      return;
    }

    setIsSavingStudy(true);
    setStudyServerError('');

    const startMin = parseTimeToMinutes(studyForm.startTime);
    const endMin = parseTimeToMinutes(studyForm.endTime);
    const computedDuration = Math.max(15, endMin - startMin);

    try {
      const payload = {
        ...studyForm,
        title: studyForm.title.trim(),
        notes: (studyForm.notes || '').trim(),
        durationMinutes: computedDuration,
      };
      if (editingSessionId) {
        await updateStudySession(editingSessionId, payload);
      } else {
        await addStudySession(payload);
      }
      setSelectedDayKey(studyForm.day);
      closeStudyModal();
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      setStudyServerError(
        firstErr ||
          err?.message ||
          (isAr ? 'تعذر حفظ جلسة المذاكرة.' : 'Failed to save study session.')
      );
    } finally {
      setIsSavingStudy(false);
    }
  };

  // Daily Note Modal Handlers
  const closeNoteModal = useCallback(() => {
    setNoteModalOpen(false);
    setEditingNote(null);
    setNoteServerError('');
  }, []);

  const openCreateNoteModal = useCallback(
    (dayKey) => {
      setEditingNote(null);
      setNoteServerError('');
      setNoteForm({
        day: dayKey || selectedDayKey,
        text: '',
        time: '',
        priority: 'medium',
      });
      setNoteModalOpen(true);
    },
    [selectedDayKey]
  );

  const openEditNoteModal = useCallback((note, dayKey) => {
    setEditingNote({ id: note.id, previousDay: dayKey });
    setNoteServerError('');
    setNoteForm({
      day: dayKey,
      text: note.text || '',
      time: note.time || '',
      priority: note.priority || 'medium',
    });
    setNoteModalOpen(true);
  }, []);

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!noteForm.text.trim() || isSavingNote) return;

    setIsSavingNote(true);
    setNoteServerError('');

    try {
      const payload = {
        day: noteForm.day,
        text: noteForm.text.trim(),
        time: noteForm.time || null,
        priority: noteForm.priority || 'medium',
      };
      if (editingNote) {
        await updateScheduleNote(editingNote.previousDay, editingNote.id, payload);
      } else {
        await addScheduleNote(noteForm.day, payload);
      }
      setSelectedDayKey(noteForm.day);
      closeNoteModal();
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      setNoteServerError(
        firstErr ||
          err?.message ||
          (isAr ? 'تعذر حفظ الملحوظة.' : 'Failed to save note.')
      );
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleToggleStudy = async (id) => {
    if (busyIds.has(id)) return;
    markBusy(id, true);
    try {
      await toggleStudySession(id);
    } finally {
      markBusy(id, false);
    }
  };

  const handleDeleteStudy = async (id) => {
    if (busyIds.has(id)) return;
    markBusy(id, true);
    try {
      await deleteStudySession(id);
    } finally {
      markBusy(id, false);
    }
  };

  const handleToggleNote = async (dayKey, noteId) => {
    if (busyIds.has(noteId)) return;
    markBusy(noteId, true);
    try {
      await toggleScheduleNote(dayKey, noteId);
    } finally {
      markBusy(noteId, false);
    }
  };

  const handleDeleteNote = async (dayKey, noteId) => {
    if (busyIds.has(noteId)) return;
    markBusy(noteId, true);
    try {
      await deleteScheduleNote(dayKey, noteId);
    } finally {
      markBusy(noteId, false);
    }
  };

  const handleCopyCode = async (itemId, code) => {
    if (!code) return;
    const ok = await copyTextToClipboard(code);
    if (ok) {
      setCopiedCodeId(itemId);
      window.setTimeout(() => setCopiedCodeId(''), 1800);
    }
  };

  const handlePrintSchedule = () => {
    printStudentWeeklySchedule({
      studentName: studentNameAr,
      timetableByDay: allTimetableByDay,
      scheduleNotes,
      stats,
      lang,
    });
  };

  const openDayFocus = (dayKey) => {
    setSelectedDayKey(dayKey);
    setViewMode('focus');
  };

  const isInitialLoading = (loadingGroups || loadingSchedule) && totalUnfilteredCount === 0;
  const activeError = scheduleError || groupsError;

  const selectedDayMeta = DAYS_CONFIG.find((d) => d.key === selectedDayKey) || DAYS_CONFIG[0];
  const focusItems = filteredTimetableByDay[selectedDayKey] || [];
  const focusNotes = scheduleNotes[selectedDayKey] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
      {/* ── ERROR ALERT WITH RETRY ── */}
      {activeError && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '14px',
            backgroundColor: 'rgba(220, 38, 38, 0.08)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            color: '#DC2626',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>{activeError}</span>
          </div>
          <button
            type="button"
            onClick={refreshGroups}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(220, 38, 38, 0.35)',
              backgroundColor: 'var(--bg-surface)',
              color: '#DC2626',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} />
            <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
        </div>
      )}

      {/* ── TOP STATS BAR ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
          gap: '14px',
        }}
      >
        {/* 1. Center Classes Stat */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: 'var(--shadow-xs)',
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary-surface)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Building2 size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '2px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {isAr ? 'حصص السناتر الأسبوعية' : 'Weekly Center Classes'}
              </span>
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: '900',
                  padding: '2px 7px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(21, 136, 199, 0.12)',
                  color: 'var(--primary)',
                  flexShrink: 0,
                }}
              >
                {isAr ? 'مؤكدة' : 'Confirmed'}
              </span>
            </div>
            <div style={{ fontSize: '21px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <span>
                {stats.totalCenterSessions}{' '}
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {formatArabicSessionsUnit(stats.totalCenterSessions, 'حصة', 'حصتان', 'حصص', isAr, 'Class', 'Classes')}
                </span>
              </span>
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
                    padding: '4px 9px',
                    borderRadius: '7px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isAr ? 'المجموعات ←' : 'Groups →'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Self-Study Sessions Stat */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: 'var(--shadow-xs)',
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(124, 58, 237, 0.12)',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <BookOpen size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '2px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {isAr ? 'جلسات المذاكرة الخاصة' : 'Self-Study Sessions'}
              </span>
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: '900',
                  padding: '2px 7px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(124, 58, 237, 0.12)',
                  color: '#7C3AED',
                  flexShrink: 0,
                }}
              >
                {isAr ? 'مخططة' : 'Planned'}
              </span>
            </div>
            <div style={{ fontSize: '21px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {stats.totalStudySessions}{' '}
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {formatArabicSessionsUnit(stats.totalStudySessions, 'جلسة', 'جلستان', 'جلسات', isAr, 'Session', 'Sessions')}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Target Study Hours Stat */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: 'var(--shadow-xs)',
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(5, 150, 105, 0.12)',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Clock size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '2px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {isAr ? 'ساعات المذاكرة المستهدفة' : 'Target Study Time'}
              </span>
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: '900',
                  padding: '2px 7px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(5, 150, 105, 0.12)',
                  color: '#059669',
                  flexShrink: 0,
                }}
              >
                {isAr ? 'أسبوعياً' : 'Weekly'}
              </span>
            </div>
            <div style={{ fontSize: '21px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {studyHoursDisplay.value}{' '}
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {studyHoursDisplay.unit}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Weekly Completion Rate Stat */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: 'var(--shadow-xs)',
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: isDark ? 'rgba(245, 158, 11, 0.16)' : 'rgba(245, 158, 11, 0.12)',
              color: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Flame size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '2px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {isAr ? 'نسبة الإنجاز الأسبوعي' : 'Weekly Completion'}
              </span>
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: '900',
                  padding: '2px 7px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(245, 158, 11, 0.14)',
                  color: '#D97706',
                  flexShrink: 0,
                }}
              >
                {stats.completedStudySessions}/{stats.totalStudySessions}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '21px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {stats.completionRate}%
              </span>
              <div
                style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--bg-subtle)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${stats.completionRate}%`,
                    height: '100%',
                    borderRadius: '999px',
                    backgroundColor: stats.completionRate === 100 && stats.totalStudySessions > 0 ? '#059669' : '#F59E0B',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTROLS & FILTER BAR ── */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        {/* View Mode + Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* View Mode Switcher */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: 'var(--bg-subtle)',
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              type="button"
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
              }}
            >
              <Calendar size={13} />
              <span>{isAr ? 'الجدول الأسبوعي' : '7-Day Grid'}</span>
            </button>

            <button
              type="button"
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
              }}
            >
              <Target size={13} />
              <span>{isAr ? 'عرض اليوم' : 'Day Focus'}</span>
            </button>
          </div>

          {/* Type Filter Pills */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: 'var(--bg-subtle)',
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {[
              { id: 'all', ar: 'الكل', en: 'All' },
              { id: 'center', ar: 'حصص السنتر', en: 'Center' },
              { id: 'study', ar: 'المذاكرة الخاصة', en: 'Self-Study' },
            ].map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setFilterType(pill.id)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: filterType === pill.id ? 'var(--bg-surface)' : 'transparent',
                  color: filterType === pill.id ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: filterType === pill.id ? '800' : '600',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  boxShadow: filterType === pill.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                {isAr ? pill.ar : pill.en}
              </button>
            ))}
          </div>
        </div>

        {/* Search + Print + Add Study Session */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '9px',
              border: '1px solid var(--border-subtle)',
              padding: '6px 10px',
              gap: '6px',
            }}
          >
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder={isAr ? 'بحث في المادة أو الموضوع...' : 'Search subject or topic...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '12px',
                outline: 'none',
                width: '155px',
                fontFamily: 'inherit',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label={isAr ? 'مسح البحث' : 'Clear search'}
                style={{
                  border: 'none',
                  background: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'inline-flex',
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handlePrintSchedule}
            title={isAr ? 'طباعة الجدول الأسبوعي (A4 أفقي)' : 'Print Weekly Schedule'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Printer size={14} color="var(--primary)" />
            <span>{isAr ? 'طباعة الجدول' : 'Print'}</span>
          </button>

          <button
            type="button"
            onClick={() => openCreateStudyModal(selectedDayKey)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 15px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-primary)',
            }}
          >
            <Plus size={15} />
            <span>{isAr ? 'إضافة جلسة مذاكرة' : 'Add Study Session'}</span>
          </button>
        </div>
      </div>

      {/* ── NO RESULTS BANNER WHEN FILTERING ── */}
      {!isInitialLoading && hasActiveFilters && totalFilteredCount === 0 && totalUnfilteredCount > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px dashed var(--border-subtle)',
            fontSize: '12.5px',
            color: 'var(--text-secondary)',
            fontWeight: '700',
          }}
        >
          <span>
            {isAr
              ? 'لا توجد مواعيد مطابقة لخيارات البحث أو الفلتر الحالية.'
              : 'No schedule slots match your current search or filter.'}
          </span>
          <button
            type="button"
            onClick={() => {
              setFilterType('all');
              setSearchQuery('');
            }}
            style={{
              padding: '5px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--primary)',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
          </button>
        </div>
      )}

      {/* ── INITIAL LOADING SKELETON ── */}
      {isInitialLoading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 172px), 1fr))',
            gap: '12px',
          }}
        >
          {DAYS_CONFIG.map((day) => (
            <div
              key={day.key}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                padding: '14px',
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ height: '18px', width: '60%', borderRadius: '6px', backgroundColor: 'var(--bg-subtle)' }} />
              <div style={{ height: '74px', width: '100%', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)' }} />
              <div style={{ height: '56px', width: '100%', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)', opacity: 0.65 }} />
            </div>
          ))}
        </div>
      )}

      {/* ── FOCUS MODE DAY SELECTOR TABS ── */}
      {!isInitialLoading && viewMode === 'focus' && (
        <div
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'none',
          }}
        >
          {DAYS_CONFIG.map((day) => {
            const isToday = day.key === todayKey;
            const isSelected = day.key === selectedDayKey;
            const dayItems = filteredTimetableByDay[day.key] || [];
            const centerCount = dayItems.filter((i) => i.type === 'center').length;
            const studyCount = dayItems.filter((i) => i.type === 'study').length;

            return (
              <button
                key={day.key}
                type="button"
                onClick={() => setSelectedDayKey(day.key)}
                style={{
                  flex: '1 0 112px',
                  padding: '9px 12px',
                  borderRadius: '12px',
                  border: isSelected
                    ? '2px solid var(--primary)'
                    : isToday
                      ? '1.5px solid rgba(21, 136, 199, 0.45)'
                      : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected
                    ? 'var(--primary-surface)'
                    : 'var(--bg-surface-elevated)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: isSelected || isToday ? '900' : '700',
                      color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                    }}
                  >
                    {isAr ? day.ar : day.en}
                  </span>
                  {isToday && (
                    <span
                      style={{
                        fontSize: '8.5px',
                        fontWeight: '900',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                      }}
                    >
                      {isAr ? 'اليوم' : 'Today'}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '10.5px' }}>
                  {centerCount > 0 && (
                    <span style={{ color: 'var(--primary)', fontWeight: '800' }}>
                      {centerCount} {isAr ? 'سنتر' : 'Class'}
                    </span>
                  )}
                  {centerCount > 0 && studyCount > 0 && <span>•</span>}
                  {studyCount > 0 && (
                    <span style={{ color: '#7C3AED', fontWeight: '800' }}>
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
      {!isInitialLoading && viewMode === 'grid' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 172px), 1fr))',
            gap: '12px',
            alignItems: 'stretch',
          }}
        >
          {DAYS_CONFIG.map((day) => {
            const isToday = day.key === todayKey;
            const isSelected = day.key === selectedDayKey;
            const items = filteredTimetableByDay[day.key] || [];
            const dayNotes = scheduleNotes[day.key] || [];

            return (
              <div
                key={day.key}
                onClick={() => setSelectedDayKey(day.key)}
                style={{
                  minWidth: 0,
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderRadius: '16px',
                  border: isToday
                    ? '2px solid var(--primary)'
                    : isSelected
                      ? '1.5px solid rgba(21, 136, 199, 0.4)'
                      : '1px solid var(--border-subtle)',
                  boxShadow: isToday
                    ? '0 0 0 1px rgba(21, 136, 199, 0.25), var(--shadow-sm)'
                    : 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  transition: 'box-shadow 0.18s ease',
                }}
              >
                {/* Column Day Header (Click to expand Day Focus) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDayFocus(day.key);
                  }}
                  title={isAr ? `عرض تفاصيل يوم ${day.ar}` : `Focus on ${day.en}`}
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    backgroundColor: isToday
                      ? 'var(--primary-surface)'
                      : isSelected
                        ? 'var(--bg-subtle)'
                        : 'var(--bg-surface)',
                    border: 'none',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                    cursor: 'pointer',
                    textAlign: 'inherit',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: '13.5px',
                        fontWeight: '900',
                        color: isToday ? 'var(--primary)' : 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isAr ? day.ar : day.en}
                    </span>
                    {isToday && (
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: '900',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          flexShrink: 0,
                        }}
                      >
                        {isAr ? 'اليوم' : 'Today'}
                      </span>
                    )}
                  </div>

                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: '800',
                      color: items.length > 0 ? 'var(--primary)' : 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {formatSlotsCount(items.length, isAr)}
                  </span>
                </button>

                {/* Day Items List */}
                <div
                  style={{
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {items.length === 0 ? (
                    <div
                      style={{
                        flex: 1,
                        minHeight: '132px',
                        padding: '20px 8px',
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
                        gap: '6px',
                      }}
                    >
                      <Calendar size={18} style={{ opacity: 0.35 }} />
                      <span style={{ fontWeight: '700' }}>
                        {isAr ? 'لا توجد مواعيد' : 'Free day'}
                      </span>
                    </div>
                  ) : (
                    items.map((item) => {
                      const isCenter = item.type === 'center';
                      const preset = getColorPreset(item.color);
                      const accentColor = isCenter
                        ? '#1588C7'
                        : item.isCompleted
                          ? '#059669'
                          : preset.hex;
                      const cardBg = isCenter
                        ? isDark
                          ? 'rgba(21, 136, 199, 0.14)'
                          : 'rgba(21, 136, 199, 0.06)'
                        : item.isCompleted
                          ? isDark
                            ? 'rgba(5, 150, 105, 0.15)'
                            : 'rgba(5, 150, 105, 0.07)'
                          : isDark
                            ? preset.darkBg
                            : preset.lightBg;
                      const cardBorder = isCenter
                        ? 'rgba(21, 136, 199, 0.32)'
                        : item.isCompleted
                          ? 'rgba(5, 150, 105, 0.35)'
                          : preset.border;
                      const isBusy = busyIds.has(item.id);

                      return (
                        <div
                          key={item.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            openDayFocus(day.key);
                          }}
                          style={{
                            minWidth: 0,
                            overflow: 'hidden',
                            backgroundColor: cardBg,
                            border: `1px solid ${cardBorder}`,
                            borderInlineStart: `3.5px solid ${accentColor}`,
                            borderRadius: '10px',
                            padding: '9px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                            cursor: 'pointer',
                            opacity: isBusy ? 0.65 : 1,
                          }}
                        >
                          {/* Badge & Time */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '6px',
                              minWidth: 0,
                            }}
                          >
                            <span
                              style={{
                                fontSize: '9.5px',
                                fontWeight: '900',
                                padding: '2px 6px',
                                borderRadius: '5px',
                                backgroundColor: accentColor,
                                color: '#FFFFFF',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                              }}
                            >
                              {isCenter
                                ? isAr
                                  ? 'سنتر'
                                  : 'Center'
                                : isAr
                                  ? 'مذاكرة'
                                  : 'Study'}
                            </span>

                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: '800',
                                color: 'var(--text-secondary)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {formatTimeTo12h(item.startTime, isAr)}
                            </span>
                          </div>

                          {/* Title & Subject — strict wrap & clamp so long text NEVER overflows */}
                          <div style={{ minWidth: 0, overflow: 'hidden' }}>
                            <div
                              title={item.title}
                              style={{
                                fontSize: '11.5px',
                                fontWeight: '800',
                                color: 'var(--text-primary)',
                                lineHeight: 1.4,
                                textDecoration: item.isCompleted ? 'line-through' : 'none',
                                opacity: item.isCompleted ? 0.72 : 1,
                                overflowWrap: 'anywhere',
                                wordBreak: 'break-word',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {item.title}
                            </div>
                            <div
                              title={item.subject}
                              style={{
                                fontSize: '10px',
                                fontWeight: '600',
                                color: 'var(--text-muted)',
                                marginTop: '2px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.subject}
                            </div>
                          </div>

                          {/* Center Hall Pill */}
                          {isCenter && (
                            <div
                              style={{
                                fontSize: '10px',
                                color: 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.035)',
                                padding: '3px 6px',
                                borderRadius: '6px',
                                minWidth: 0,
                              }}
                            >
                              <MapPin size={11} color="var(--primary)" style={{ flexShrink: 0 }} />
                              <span
                                title={item.hall}
                                style={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  minWidth: 0,
                                }}
                              >
                                {item.hall}
                              </span>
                            </div>
                          )}

                          {/* Study Card Actions (Complete + Edit + Delete) */}
                          {!isCenter && (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '4px',
                                paddingTop: '5px',
                                marginTop: '2px',
                                borderTop: '1px dashed var(--border-subtle)',
                              }}
                            >
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleStudy(item.id);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: isBusy ? 'wait' : 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '10px',
                                  fontWeight: '800',
                                  padding: 0,
                                  color: item.isCompleted ? '#059669' : 'var(--text-secondary)',
                                }}
                              >
                                {item.isCompleted ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                                <span>
                                  {item.isCompleted
                                    ? isAr
                                      ? 'مكتملة'
                                      : 'Done'
                                    : isAr
                                      ? 'إنجاز'
                                      : 'Done'}
                                </span>
                              </button>

                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditStudyModal(item, day.key);
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '3px',
                                    borderRadius: '5px',
                                    display: 'inline-flex',
                                  }}
                                  title={isAr ? 'تعديل الجلسة' : 'Edit session'}
                                  aria-label={isAr ? 'تعديل الجلسة' : 'Edit session'}
                                >
                                  <Pencil size={11.5} />
                                </button>
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteStudy(item.id);
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: isBusy ? 'wait' : 'pointer',
                                    padding: '3px',
                                    borderRadius: '5px',
                                    display: 'inline-flex',
                                  }}
                                  title={isAr ? 'حذف الجلسة' : 'Delete session'}
                                  aria-label={isAr ? 'حذف الجلسة' : 'Delete session'}
                                >
                                  <Trash2 size={11.5} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}

                  {/* Daily Notes Quick Preview (Click opens Day Focus) */}
                  {dayNotes.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDayFocus(day.key);
                      }}
                      style={{
                        width: '100%',
                        minWidth: 0,
                        textAlign: 'inherit',
                        backgroundColor: 'var(--bg-subtle)',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        marginTop: 'auto',
                        border: '1px dashed var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '3px',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span style={{ fontSize: '9.5px', fontWeight: '800', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <StickyNote size={10} color="var(--primary)" />
                          {isAr ? 'ملاحظات' : 'Notes'}
                        </span>
                        <span style={{ fontSize: '9.5px', fontWeight: '900', color: 'var(--primary)' }}>
                          {dayNotes.length}
                        </span>
                      </div>
                      <div
                        title={dayNotes[0].text}
                        style={{
                          width: '100%',
                          fontSize: '10.5px',
                          color: 'var(--text-secondary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {dayNotes[0].text}
                      </div>
                    </button>
                  )}

                  {/* Column Footer Quick Actions */}
                  <div style={{ display: 'flex', gap: '5px', marginTop: dayNotes.length > 0 ? '2px' : 'auto' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openCreateStudyModal(day.key);
                      }}
                      style={{
                        flex: 1,
                        padding: '6px 4px',
                        borderRadius: '7px',
                        border: '1px dashed var(--border-subtle)',
                        backgroundColor: 'transparent',
                        color: 'var(--text-muted)',
                        fontSize: '10.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '3px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Plus size={11} />
                      <span>{isAr ? 'مذاكرة' : 'Study'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openCreateNoteModal(day.key);
                      }}
                      title={isAr ? `إضافة ملحوظة ليوم ${day.ar}` : `Add note for ${day.en}`}
                      aria-label={isAr ? `إضافة ملحوظة ليوم ${day.ar}` : `Add note for ${day.en}`}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '7px',
                        border: '1px dashed var(--border-subtle)',
                        backgroundColor: 'transparent',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <StickyNote size={11.5} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── VIEW MODE 2: EXPANDED DAY FOCUS ── */}
      {!isInitialLoading && viewMode === 'focus' && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: '18px',
            border: selectedDayKey === todayKey ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
            padding: '22px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            minWidth: 0,
          }}
        >
          {/* Day Focus Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Calendar size={20} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '19px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                    {isAr
                      ? `جدول ومذاكرة يوم ${selectedDayMeta.ar}`
                      : `${selectedDayMeta.en} Schedule`}
                  </h2>
                  {selectedDayKey === todayKey && (
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: '900',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                      }}
                    >
                      {isAr ? 'اليوم النشط' : 'TODAY'}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
                  {isAr
                    ? 'عرض موسّع لحصص السنتر وجلسات المذاكرة الشخصية والمهام اليومية'
                    : 'Detailed timeline of confirmed center classes, self-study goals, and daily notes'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => openCreateNoteModal(selectedDayKey)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 13px',
                  borderRadius: '9px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                <StickyNote size={13} color="var(--primary)" />
                <span>{isAr ? 'إضافة ملحوظة' : 'Add Note'}</span>
              </button>

              <button
                type="button"
                onClick={() => openCreateStudyModal(selectedDayKey)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '9px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                <Plus size={14} />
                <span>{isAr ? 'جلسة مذاكرة جديدة' : 'Add Study Session'}</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '8px 11px',
                  borderRadius: '9px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
                title={isAr ? 'العودة للجدول الأسبوعي الكامل' : 'Back to 7-day grid'}
              >
                <Maximize2 size={13} />
                <span>{isAr ? 'كل الأسبوع' : 'Full Week'}</span>
              </button>
            </div>
          </div>

          {/* Expanded Session Cards */}
          {focusItems.length === 0 ? (
            <div
              style={{
                padding: '44px 20px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '14px',
                color: 'var(--text-muted)',
              }}
            >
              <Calendar size={34} color="var(--primary)" style={{ margin: '0 auto 8px', opacity: 0.5 }} />
              <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px' }}>
                {isAr ? 'لا توجد حصص أو جلسات مذاكرة في هذا اليوم' : 'No sessions scheduled for this day'}
              </h4>
              <p style={{ fontSize: '12.5px', margin: '0 0 14px' }}>
                {isAr
                  ? 'استغل اليوم في الراحة أو أضف جلسة مذاكرة منظمة لمراجعة دروسك'
                  : 'Use this day to rest or add a planned study session'}
              </p>
              <button
                type="button"
                onClick={() => openCreateStudyModal(selectedDayKey)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                <Plus size={14} />
                <span>{isAr ? 'إضافة جلسة مذاكرة لهذا اليوم' : 'Add Study Session'}</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {focusItems.map((item) => {
                const isCenter = item.type === 'center';
                const preset = getColorPreset(item.color);
                const accentColor = isCenter
                  ? '#1588C7'
                  : item.isCompleted
                    ? '#059669'
                    : preset.hex;
                const isBusy = busyIds.has(item.id);

                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: `1px solid ${isCenter ? 'rgba(21, 136, 199, 0.35)' : item.isCompleted ? 'rgba(5, 150, 105, 0.4)' : preset.border}`,
                      borderInlineStart: `4.5px solid ${accentColor}`,
                      borderRadius: '14px',
                      padding: '16px 18px',
                      boxShadow: 'var(--shadow-xs)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '14px',
                      minWidth: 0,
                      overflow: 'hidden',
                      opacity: isBusy ? 0.65 : 1,
                    }}
                  >
                    {/* Left Info Block (strict minWidth: 0 & flex: 1 so long titles wrap cleanly) */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: '1 1 260px', minWidth: 0 }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          backgroundColor: `${accentColor}1A`,
                          color: accentColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isCenter ? <Building2 size={22} /> : <BookOpen size={22} />}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: '900',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              backgroundColor: accentColor,
                              color: '#FFFFFF',
                            }}
                          >
                            {isCenter
                              ? isAr
                                ? 'حصة سنتر معتمدة'
                                : 'Center Class'
                              : isAr
                                ? 'جلسة مذاكرة خاصة'
                                : 'Self-Study'}
                          </span>
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: '800',
                              color: 'var(--text-muted)',
                              overflowWrap: 'anywhere',
                            }}
                          >
                            {item.subject}
                          </span>
                          {item.durationMinutes > 0 && (
                            <span
                              style={{
                                fontSize: '10.5px',
                                fontWeight: '800',
                                color: 'var(--text-secondary)',
                                backgroundColor: 'var(--bg-subtle)',
                                padding: '2px 7px',
                                borderRadius: '6px',
                              }}
                            >
                              {formatDurationLabel(item.durationMinutes, isAr)}
                            </span>
                          )}
                        </div>

                        <h3
                          style={{
                            fontSize: '15.5px',
                            fontWeight: '900',
                            color: 'var(--text-primary)',
                            margin: 0,
                            lineHeight: 1.45,
                            textDecoration: item.isCompleted ? 'line-through' : 'none',
                            opacity: item.isCompleted ? 0.72 : 1,
                            overflowWrap: 'anywhere',
                            wordBreak: 'break-word',
                          }}
                        >
                          {item.title}
                        </h3>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginTop: '7px',
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
                            <Clock size={13} color="var(--primary)" />
                            {formatTimeTo12h(item.startTime, isAr)} - {formatTimeTo12h(item.endTime, isAr)}
                          </span>

                          {isCenter ? (
                            <>
                              {item.centerName && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <Building2 size={13} color="var(--primary)" />
                                  {item.centerName}
                                </span>
                              )}
                              {item.hall && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <MapPin size={13} color="var(--primary)" />
                                  {item.hall}
                                </span>
                              )}
                              {item.teacherName && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <GraduationCap size={13} />
                                  {item.teacherName}
                                </span>
                              )}
                            </>
                          ) : (
                            item.notes && (
                              <span
                                style={{
                                  color: 'var(--text-muted)',
                                  overflowWrap: 'anywhere',
                                  wordBreak: 'break-word',
                                }}
                              >
                                {item.notes}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      {!isCenter ? (
                        <>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggleStudy(item.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 13px',
                              borderRadius: '9px',
                              border: 'none',
                              backgroundColor: item.isCompleted ? '#059669' : 'var(--bg-subtle)',
                              color: item.isCompleted ? '#FFFFFF' : 'var(--text-primary)',
                              fontSize: '12px',
                              fontWeight: '800',
                              cursor: isBusy ? 'wait' : 'pointer',
                            }}
                          >
                            <Check size={14} />
                            <span>
                              {item.isCompleted
                                ? isAr
                                  ? 'مكتملة'
                                  : 'Completed'
                                : isAr
                                  ? 'تحديد كمكتملة'
                                  : 'Mark Done'}
                            </span>
                          </button>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => openEditStudyModal(item, selectedDayKey)}
                            style={{
                              padding: '8px',
                              borderRadius: '9px',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'transparent',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                            }}
                            title={isAr ? 'تعديل الجلسة' : 'Edit session'}
                            aria-label={isAr ? 'تعديل الجلسة' : 'Edit session'}
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleDeleteStudy(item.id)}
                            style={{
                              padding: '8px',
                              borderRadius: '9px',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'transparent',
                              color: '#DC2626',
                              cursor: isBusy ? 'wait' : 'pointer',
                              display: 'inline-flex',
                            }}
                            title={isAr ? 'حذف الجلسة' : 'Delete session'}
                            aria-label={isAr ? 'حذف الجلسة' : 'Delete session'}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : item.joinCode ? (
                        <button
                          type="button"
                          onClick={() => handleCopyCode(item.id, item.joinCode)}
                          title={isAr ? 'نسخ كود المجموعة' : 'Copy group code'}
                          dir="ltr"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '11.5px',
                            fontWeight: '800',
                            fontFamily: 'monospace',
                            color: copiedCodeId === item.id ? '#059669' : 'var(--primary)',
                            backgroundColor:
                              copiedCodeId === item.id
                                ? 'rgba(5, 150, 105, 0.12)'
                                : 'var(--primary-surface)',
                            border: '1px solid transparent',
                            padding: '6px 11px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                          }}
                        >
                          {copiedCodeId === item.id ? <Check size={13} /> : <Copy size={13} />}
                          <span>{item.joinCode}</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Daily Notes & Reminders Section */}
          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid var(--border-subtle)',
              minWidth: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <StickyNote size={16} color="var(--primary)" />
                <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  {isAr ? 'قائمة المهام والملاحظات اليومية' : 'Daily Tasks & Reminders'}
                </h4>
                {focusNotes.length > 0 && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '1px 7px',
                      borderRadius: '999px',
                      backgroundColor: 'var(--primary-surface)',
                      color: 'var(--primary)',
                    }}
                  >
                    {focusNotes.length}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => openCreateNoteModal(selectedDayKey)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Plus size={13} />
                <span>{isAr ? 'إضافة ملحوظة' : 'Add Note'}</span>
              </button>
            </div>

            {focusNotes.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                {isAr ? 'لا توجد مهام أو ملاحظات مسجلة لهذا اليوم.' : 'No notes added for this day.'}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {focusNotes.map((note) => {
                  const prMeta = NOTE_PRIORITIES[note.priority] || NOTE_PRIORITIES.medium;
                  const isBusy = busyIds.has(note.id);
                  return (
                    <div
                      key={note.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '10px',
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        border: '1px solid var(--border-subtle)',
                        minWidth: 0,
                        opacity: isBusy ? 0.65 : 1,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, minWidth: 0 }}>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleToggleNote(selectedDayKey, note.id)}
                          aria-label={isAr ? 'تغيير حالة الإنجاز' : 'Toggle completion'}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: isBusy ? 'wait' : 'pointer',
                            color: note.isDone ? '#059669' : 'var(--text-muted)',
                            padding: '1px 0 0',
                            flexShrink: 0,
                            display: 'inline-flex',
                          }}
                        >
                          {note.isDone ? <CheckCircle2 size={17} /> : <Circle size={17} />}
                        </button>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span
                            style={{
                              display: 'block',
                              fontSize: '12.5px',
                              fontWeight: '700',
                              lineHeight: 1.45,
                              color: 'var(--text-primary)',
                              textDecoration: note.isDone ? 'line-through' : 'none',
                              opacity: note.isDone ? 0.65 : 1,
                              overflowWrap: 'anywhere',
                              wordBreak: 'break-word',
                            }}
                          >
                            {note.text}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: '800',
                                padding: '1px 7px',
                                borderRadius: '999px',
                                backgroundColor: isDark ? prMeta.bgDark : prMeta.bgLight,
                                color: prMeta.color,
                                border: `1px solid ${prMeta.border}`,
                              }}
                            >
                              {isAr ? prMeta.labelAr : prMeta.labelEn}
                            </span>
                            {note.time && (
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: '700' }}>
                                <Clock size={11} />
                                {formatTimeTo12h(note.time, isAr)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => openEditNoteModal(note, selectedDayKey)}
                          title={isAr ? 'تعديل الملحوظة' : 'Edit note'}
                          aria-label={isAr ? 'تعديل الملحوظة' : 'Edit note'}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'inline-flex',
                          }}
                        >
                          <Pencil size={13} />
                        </button>

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleDeleteNote(selectedDayKey, note.id)}
                          title={isAr ? 'حذف الملحوظة' : 'Delete note'}
                          aria-label={isAr ? 'حذف الملحوظة' : 'Delete note'}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#DC2626',
                            cursor: isBusy ? 'wait' : 'pointer',
                            padding: '4px',
                            display: 'inline-flex',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      <StudySessionModal
        isOpen={studyModalOpen}
        isEditing={Boolean(editingSessionId)}
        formState={studyForm}
        onChange={setStudyForm}
        availableSubjects={availableSubjects}
        conflictError={studyConflictError}
        serverError={studyServerError}
        isSaving={isSavingStudy}
        isAr={isAr}
        onSubmit={handleSaveStudySession}
        onClose={closeStudyModal}
      />

      <ScheduleNoteModal
        isOpen={noteModalOpen}
        isEditing={Boolean(editingNote)}
        formState={noteForm}
        onChange={setNoteForm}
        serverError={noteServerError}
        isSaving={isSavingNote}
        isAr={isAr}
        isDark={isDark}
        onSubmit={handleSaveNote}
        onClose={closeNoteModal}
      />
    </div>
  );
};

export default StudentWeeklySchedule;
