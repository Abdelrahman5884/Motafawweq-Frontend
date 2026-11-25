import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Flame,
  GraduationCap,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { centerApi } from '../../../services/centerApi';
import { SBadge, SButton, SCard } from '../../../components/student/ui';
import {
  STANDARD_CENTER_SLOTS,
  WEEKDAYS,
  doesSlotMatchRoom,
  formatTimeTo12h,
  getTodayWeekdayKey,
  resolveGroupEnrolledCount,
} from './centerHallsUtils';

const DAY_SHORT_AR = {
  saturday: 'السبت',
  sunday: 'الأحد',
  monday: 'الاثنين',
  tuesday: 'الثلاثاء',
  wednesday: 'الأربعاء',
  thursday: 'الخميس',
  friday: 'الجمعة',
};

const DAY_SHORT_EN = {
  saturday: 'Sat',
  sunday: 'Sun',
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
};

export const CenterMasterScheduleSection = ({
  rooms = [],
  groups = [],
  enrolledStudents = {},
  selectedDay = 'saturday',
  onSelectDay,
  selectedBranchId = 'all',
  focusedRoomId = null,
  onSelectFocusedRoom,
  onClearFocusedRoom,
  onOpenGroupDetail,
  onBookSlot,
  isBackendCenter = true,
  lang = 'ar',
  isRtl = true,
}) => {
  const isAr = lang === 'ar';
  const todayKey = useMemo(() => getTodayWeekdayKey(), []);
  const normalizedDayKey = String(selectedDay || todayKey).toLowerCase();

  // Teacher-style 3 view modes: 'grid' (7-day week), 'focus' (day view + open room slots), 'agenda' (chronological list)
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  const [apiSchedule, setApiSchedule] = useState(null);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  // Sync live backend schedule for the focused day (fallback when local groups are still hydrating)
  useEffect(() => {
    if (!isBackendCenter) return undefined;

    let cancelled = false;
    const params = {
      day: normalizedDayKey,
      ...(selectedBranchId && selectedBranchId !== 'all' && selectedBranchId !== 'main'
        ? { branch_id: selectedBranchId }
        : {}),
    };

    Promise.resolve().then(() => {
      if (cancelled) return;
      setLoadingSchedule(true);
      centerApi.schedule
        .getMaster(params)
        .then((res) => {
          if (!cancelled && res?.data) {
            setApiSchedule(res.data);
          }
        })
        .catch(() => {
          if (!cancelled) setApiSchedule(null);
        })
        .finally(() => {
          if (!cancelled) setLoadingSchedule(false);
        });
    });

    return () => {
      cancelled = true;
    };
  }, [isBackendCenter, normalizedDayKey, selectedBranchId, rooms.length, groups.length]);

  const focusedRoom = useMemo(
    () => (focusedRoomId ? rooms.find((r) => String(r.id) === String(focusedRoomId)) || null : null),
    [rooms, focusedRoomId]
  );

  // Build full 7-day sessions map matching TeacherWeeklySchedule structure
  const sessionsByDay = useMemo(() => {
    const map = {};
    WEEKDAYS.forEach((d) => {
      map[d.key] = [];
    });

    const q = searchQuery.trim().toLowerCase();

    groups.forEach((group) => {
      const slots = group.scheduleSlots || group.slots || [];
      const enrolledCount = resolveGroupEnrolledCount(group, enrolledStudents);

      slots.forEach((slot, idx) => {
        const dayKey = String(slot.day || '').toLowerCase();
        if (!map[dayKey]) return;

        const matchedRoom = rooms.find((r) => doesSlotMatchRoom(slot, group, r)) || null;

        if (selectedBranchId && selectedBranchId !== 'all') {
          if (selectedBranchId === 'main') {
            if (group.branchId) return;
          } else {
            const groupMatchesBranch = String(group.branchId || '') === String(selectedBranchId);
            if (!matchedRoom && !groupMatchesBranch) return;
          }
        }

        if (focusedRoom && !doesSlotMatchRoom(slot, group, focusedRoom)) {
          return;
        }

        const hallName =
          matchedRoom?.nameAr || slot.hall || group.hallName || (isAr ? 'القاعة الرئيسية' : 'Main Hall');
        const teacherName = group.teacherNameAr || (isAr ? 'معلم السنتر' : 'Center Teacher');

        if (q) {
          const hay = [
            group.nameAr,
            group.nameEn,
            group.subjectAr,
            group.gradeAr,
            teacherName,
            hallName,
            group.joinCode,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (!hay.includes(q)) return;
        }

        map[dayKey].push({
          id: slot.id || `${group.id}-${dayKey}-${idx}`,
          dayKey,
          startTime: slot.startTime || '16:00',
          endTime: slot.endTime || '18:00',
          groupId: group.id,
          group,
          room: matchedRoom,
          roomId: matchedRoom?.id || slot.roomId || group.roomId || null,
          hallName,
          teacherName,
          enrolledCount,
          capacity: Number(matchedRoom?.capacity || group.maxStudents) || 40,
        });
      });
    });

    // Backend fallback for selectedDay if local groups are empty/still hydrating
    if (map[normalizedDayKey]?.length === 0 && Array.isArray(apiSchedule?.halls)) {
      apiSchedule.halls.forEach((hall) => {
        if (focusedRoom && String(hall.roomId) !== String(focusedRoom.id)) return;
        const matchedRoom = rooms.find((r) => String(r.id) === String(hall.roomId)) || null;
        (hall.sessions || []).forEach((s, idx) => {
          const hallName = matchedRoom?.nameAr || hall.roomNameAr || (isAr ? 'القاعة الرئيسية' : 'Main Hall');
          const teacherName = s.teacherNameAr || (isAr ? 'معلم معتمد' : 'Assigned Teacher');
          if (q) {
            const hay = [s.groupNameAr, s.subjectAr, s.gradeAr, teacherName, hallName]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();
            if (!hay.includes(q)) return;
          }
          map[normalizedDayKey].push({
            id: s.slotId || `api-${hall.roomId}-${idx}`,
            dayKey: normalizedDayKey,
            startTime: s.startTime || '16:00',
            endTime: s.endTime || '18:00',
            groupId: s.groupId,
            group: {
              id: s.groupId,
              nameAr: s.groupNameAr,
              nameEn: s.groupNameEn || s.groupNameAr,
              subjectAr: s.subjectAr,
              gradeAr: s.gradeAr,
              joinCode: s.joinCode || null,
            },
            room: matchedRoom,
            roomId: hall.roomId,
            hallName,
            teacherName,
            enrolledCount: Number(s.enrolledCount) || 0,
            capacity: Number(s.capacity || matchedRoom?.capacity) || 40,
          });
        });
      });
    }

    Object.keys(map).forEach((dayKey) => {
      map[dayKey].sort((a, b) =>
        String(a.startTime || '').localeCompare(String(b.startTime || ''))
      );
    });

    return map;
  }, [
    groups,
    enrolledStudents,
    rooms,
    selectedBranchId,
    focusedRoom,
    searchQuery,
    normalizedDayKey,
    apiSchedule,
    isAr,
  ]);

  const metrics = useMemo(() => {
    const allSessions = Object.values(sessionsByDay).flat();
    const uniqueCohortIds = new Set(allSessions.map((s) => s.groupId).filter(Boolean));
    const availableRoomsCount = rooms.filter((r) => r.isAvailable !== false).length;
    return {
      totalWeeklySessions: allSessions.length,
      todaySessionsCount: (sessionsByDay[todayKey] || []).length,
      activeCohortsCount: uniqueCohortIds.size,
      availableRoomsCount,
    };
  }, [sessionsByDay, todayKey, rooms]);

  // Free slots per room for the selected day (shown cleanly in Day Focus view)
  const roomAvailabilityForSelectedDay = useMemo(() => {
    const targetRooms = focusedRoom ? [focusedRoom] : rooms;
    const daySessions = sessionsByDay[normalizedDayKey] || [];

    return targetRooms.map((room) => {
      const roomSessions = daySessions.filter((s) =>
        s.roomId ? String(s.roomId) === String(room.id) : s.hallName === room.nameAr
      );
      const freeSlots = STANDARD_CENTER_SLOTS.filter((std) => {
        return !roomSessions.some((sess) => {
          const sStart = sess.startTime || '16:00';
          const sEnd = sess.endTime || '18:00';
          return std.startTime < sEnd && std.endTime > sStart;
        });
      });

      return {
        room,
        isAvailable: room.isAvailable !== false,
        bookedCount: roomSessions.length,
        freeSlots,
      };
    });
  }, [rooms, focusedRoom, sessionsByDay, normalizedDayKey]);

  const handleCopyCode = (code, e) => {
    if (e) e.stopPropagation();
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const handleStepDay = (delta) => {
    const idx = WEEKDAYS.findIndex((d) => d.key === normalizedDayKey);
    const nextIdx = (idx + delta + WEEKDAYS.length) % WEEKDAYS.length;
    onSelectDay?.(WEEKDAYS[nextIdx].key);
  };

  const todayMeta = WEEKDAYS.find((d) => d.key === todayKey) || WEEKDAYS[0];
  const selectedDayMeta = WEEKDAYS.find((d) => d.key === normalizedDayKey) || WEEKDAYS[0];
  const selectedDaySessions = sessionsByDay[normalizedDayKey] || [];
  const defaultBookRoom =
    focusedRoom || rooms.find((r) => r.isAvailable !== false) || rooms[0] || null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* ── 1. Top Summary KPI Cards (Teacher Weekly Schedule Style) ── */}
      <div className="ch-kpi-grid-3">
        <div className="ch-kpi-card">
          <div
            className="ch-kpi-icon"
            style={{ backgroundColor: 'var(--primary-surface)', color: 'var(--primary)' }}
          >
            <CalendarDays size={21} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'إجمالي الحصص الأسبوعية' : 'Weekly Sessions'}
            </div>
            <div style={{ fontSize: '21px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '2px' }}>
              {metrics.totalWeeklySessions}{' '}
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {isAr ? 'حصة / أسبوع' : 'sessions / wk'}
              </span>
            </div>
          </div>
        </div>

        <div className="ch-kpi-card is-highlight">
          <div
            className="ch-kpi-icon"
            style={{ backgroundColor: 'var(--primary)', color: '#ffffff' }}
          >
            <Flame size={21} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)' }}>
              {isAr ? `حصص اليوم (${todayMeta.labelAr})` : `Today (${todayMeta.labelEn})`}
            </div>
            <div style={{ fontSize: '21px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '2px' }}>
              {metrics.todaySessionsCount}{' '}
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {isAr ? 'حصة مجدولة' : 'scheduled'}
              </span>
            </div>
          </div>
        </div>

        <div className="ch-kpi-card">
          <div
            className="ch-kpi-icon"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--success, #10B981)' }}
          >
            <Building2 size={21} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'القاعات والمجموعات النشطة' : 'Active Rooms & Cohorts'}
            </div>
            <div style={{ fontSize: '21px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '2px' }}>
              {metrics.availableRoomsCount}{' '}
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {isAr
                  ? `قاعة • ${metrics.activeCohortsCount} مجموعة`
                  : `rooms • ${metrics.activeCohortsCount} cohorts`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Controls & View Mode Switcher Bar (Teacher Schedule Style) ── */}
      <div className="ch-toolbar">
        {/* View Mode Switcher */}
        <div className="ch-seg-group" role="group" aria-label={isAr ? 'طريقة عرض الجدول' : 'Schedule view mode'}>
          {[
            { id: 'grid', labelAr: 'الجدول الأسبوعي', labelEn: 'Weekly Grid', icon: LayoutGrid },
            { id: 'focus', labelAr: 'اليوم', labelEn: 'Day View', icon: Calendar },
            { id: 'agenda', labelAr: 'الأجندة', labelEn: 'Agenda', icon: List },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = viewMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setViewMode(mode.id)}
                className={`ch-seg-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={14} />
                <span>{isAr ? mode.labelAr : mode.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Search + Room Filter + Conflict Shield */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: '1 1 320px', justifyContent: 'flex-end' }}>
          <div className="ch-search-wrap">
            <Search size={15} className="ch-search-icon" />
            <input
              type="text"
              className="ch-search-input"
              placeholder={
                isAr
                  ? 'ابحث بالمجموعة، المادة، المعلم، أو القاعة...'
                  : 'Search cohort, subject, teacher, or room...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            aria-label={isAr ? 'تصفية حسب القاعة' : 'Filter by room'}
            className="ch-select"
            value={focusedRoomId || 'ALL'}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'ALL') {
                onClearFocusedRoom?.();
              } else {
                onSelectFocusedRoom?.(val);
              }
            }}
          >
            <option value="ALL">
              {isAr ? `جميع القاعات (${rooms.length})` : `All Rooms (${rooms.length})`}
            </option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nameAr} {r.isAvailable === false ? (isAr ? '(صيانة)' : '(Maint.)') : ''}
              </option>
            ))}
          </select>

          <SBadge variant="success" size="sm">
            {loadingSchedule ? (
              <RefreshCw size={12} className="animate-spin" />
            ) : (
              <CheckCircle2 size={12} />
            )}
            <span>
              {loadingSchedule
                ? isAr
                  ? 'جاري المزامنة...'
                  : 'Syncing...'
                : isAr
                  ? 'خالٍ من التعارض'
                  : 'Conflict-Free'}
            </span>
          </SBadge>
        </div>
      </div>

      {/* Active Room Focus Banner */}
      {focusedRoom && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            padding: '10px 16px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-surface)',
            border: '1px solid rgba(21, 136, 199, 0.28)',
            fontSize: '12.5px',
            fontWeight: '700',
            color: 'var(--primary)',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={15} />
            <span>
              {isAr
                ? `عرض جدول القاعة المحددة فقط: ${focusedRoom.nameAr} (${focusedRoom.capacity} مقعد)`
                : `Filtered to room: ${focusedRoom.nameAr} (${focusedRoom.capacity} seats)`}
            </span>
          </span>
          <button
            type="button"
            onClick={onClearFocusedRoom}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(21, 136, 199, 0.35)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--primary)',
              fontSize: '11.5px',
              fontWeight: '800',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <X size={13} />
            <span>{isAr ? 'إظهار جميع القاعات' : 'Show All Rooms'}</span>
          </button>
        </div>
      )}

      {/* Day Pills Bar (Visible in Day View) */}
      {viewMode === 'focus' && (
        <div className="ch-day-pills">
          {WEEKDAYS.map((day) => {
            const count = (sessionsByDay[day.key] || []).length;
            const isSelected = normalizedDayKey === day.key;
            const isToday = day.key === todayKey;

            return (
              <button
                key={day.key}
                type="button"
                onClick={() => onSelectDay?.(day.key)}
                className={`ch-day-pill ${isSelected ? 'active' : ''} ${isToday ? 'is-today' : ''}`}
              >
                <span style={{ fontSize: '12.5px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span>{isAr ? DAY_SHORT_AR[day.key] : DAY_SHORT_EN[day.key]}</span>
                  {isToday && (
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#ffffff' : 'var(--primary)',
                      }}
                    />
                  )}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '1px 8px',
                    borderRadius: '999px',
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--bg-subtle)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  }}
                >
                  {count} {isAr ? 'حصة' : 'cls'}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          VIEW 1: 7-DAY WEEKLY GRID (Matching TeacherWeeklySchedule)
      ═══════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'grid' && (
        <div className="ch-week-grid">
          {WEEKDAYS.map((day) => {
            const daySessions = sessionsByDay[day.key] || [];
            const isToday = day.key === todayKey;

            return (
              <div key={day.key} className={`ch-day-col ${isToday ? 'is-today' : ''}`}>
                {/* Day Header */}
                <div className={`ch-day-head ${isToday ? 'is-today' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: '14.5px',
                        fontWeight: '900',
                        color: isToday ? '#ffffff' : 'var(--text-primary)',
                      }}
                    >
                      {isAr ? day.labelAr : day.labelEn}
                    </span>
                    {isToday && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '2px 7px',
                          borderRadius: '999px',
                          backgroundColor: '#ffffff',
                          color: 'var(--primary)',
                        }}
                      >
                        <Flame size={10} />
                        <span>{isAr ? 'اليوم' : 'Today'}</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectDay?.(day.key);
                      setViewMode('focus');
                    }}
                    title={isAr ? 'عرض حصص اليوم والمواعيد الشاغرة' : 'Open day view'}
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      border: 'none',
                      backgroundColor: isToday ? 'rgba(255,255,255,0.2)' : 'var(--bg-surface)',
                      color: isToday ? '#ffffff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {daySessions.length} {isAr ? 'حصة' : 'cls'}
                  </button>
                </div>

                {/* Day Sessions */}
                <div className="ch-day-body">
                  {daySessions.length === 0 ? (
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '28px 10px',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Sparkles size={20} style={{ opacity: 0.35, marginBottom: '6px' }} />
                      <span style={{ fontSize: '11.5px', fontWeight: '700' }}>
                        {isAr ? 'لا توجد حصص مجدولة' : 'No sessions'}
                      </span>
                    </div>
                  ) : (
                    daySessions.map((session) => {
                      const group = session.group;
                      return (
                        <div
                          key={session.id}
                          onClick={() => onOpenGroupDetail?.(session.groupId)}
                          className="ch-session-card"
                        >
                          {/* Time Pill + Hall Tag */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', flexWrap: 'wrap' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '2px 7px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--primary)',
                                color: '#ffffff',
                                fontSize: '10.5px',
                                fontWeight: '800',
                              }}
                            >
                              <Clock size={10} />
                              <span>
                                {formatTimeTo12h(session.startTime, isAr)} - {formatTimeTo12h(session.endTime, isAr)}
                              </span>
                            </span>

                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: '800',
                                color: 'var(--text-secondary)',
                                backgroundColor: 'var(--bg-subtle)',
                                padding: '2px 6px',
                                borderRadius: '5px',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {session.hallName}
                            </span>
                          </div>

                          {/* Cohort Title */}
                          <div
                            style={{
                              fontSize: '13px',
                              fontWeight: '800',
                              color: 'var(--text-primary)',
                              lineHeight: 1.38,
                            }}
                          >
                            {isAr ? group.nameAr : group.nameEn || group.nameAr}
                          </div>

                          {/* Subject & Grade Chips */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                            {group.subjectAr && (
                              <span
                                style={{
                                  fontSize: '10px',
                                  fontWeight: '800',
                                  padding: '2px 6px',
                                  borderRadius: '5px',
                                  backgroundColor: 'var(--primary-surface)',
                                  color: 'var(--primary)',
                                }}
                              >
                                {group.subjectAr}
                              </span>
                            )}
                            {group.gradeAr && (
                              <span
                                style={{
                                  fontSize: '10px',
                                  fontWeight: '700',
                                  padding: '2px 6px',
                                  borderRadius: '5px',
                                  backgroundColor: 'var(--bg-subtle)',
                                  color: 'var(--text-secondary)',
                                }}
                              >
                                {group.gradeAr}
                              </span>
                            )}
                          </div>

                          {/* Teacher & Enrolled Count */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '6px',
                              fontSize: '11px',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                minWidth: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <GraduationCap size={12} color="var(--primary)" style={{ flexShrink: 0 }} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {session.teacherName}
                              </span>
                            </span>

                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                fontWeight: '800',
                                color: 'var(--text-primary)',
                                flexShrink: 0,
                              }}
                            >
                              <Users size={11} color="var(--primary)" />
                              <span>
                                {session.enrolledCount}/{session.capacity}
                              </span>
                            </span>
                          </div>

                          {/* Quick Actions Footer */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingTop: '6px',
                              borderTop: '1px dashed var(--border-subtle)',
                              marginTop: '2px',
                            }}
                          >
                            {group.joinCode ? (
                              <button
                                type="button"
                                onClick={(e) => handleCopyCode(group.joinCode, e)}
                                title={isAr ? 'نسخ كود المجموعة' : 'Copy Join Code'}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  background: 'none',
                                  border: 'none',
                                  color:
                                    copiedCode === group.joinCode
                                      ? 'var(--success, #10B981)'
                                      : 'var(--text-muted)',
                                  fontSize: '10.5px',
                                  fontWeight: '700',
                                  fontFamily: 'monospace',
                                  cursor: 'pointer',
                                  padding: 0,
                                }}
                              >
                                {copiedCode === group.joinCode ? (
                                  <Check size={11} />
                                ) : (
                                  <Copy size={11} />
                                )}
                                <span>{group.joinCode}</span>
                              </button>
                            ) : (
                              <span />
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenGroupDetail?.(session.groupId);
                              }}
                              style={{
                                padding: '3px 8px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--primary-surface)',
                                border: '1px solid rgba(21, 136, 199, 0.22)',
                                color: 'var(--primary)',
                                fontSize: '10.5px',
                                fontWeight: '800',
                                fontFamily: 'inherit',
                                cursor: 'pointer',
                              }}
                            >
                              {isAr ? 'الطلاب' : 'Roster'}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Quick Add Slot Button per Day */}
                  <button
                    type="button"
                    className="ch-day-footer-btn"
                    onClick={() => onBookSlot?.(defaultBookRoom, day.key, null)}
                  >
                    <Plus size={13} />
                    <span>{isAr ? 'حجز حصة' : 'Book Slot'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          VIEW 2: EXPANDED DAY VIEW + AVAILABLE ROOM SLOTS
      ═══════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'focus' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Day Navigation Banner */}
          <SCard padding={18} style={{ boxShadow: 'var(--shadow-xs)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--primary), #0D69A0)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Flame size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '17.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                      {isAr
                        ? `جدول حصص يوم ${selectedDayMeta.labelAr}`
                        : `${selectedDayMeta.labelEn} Schedule`}
                    </h2>
                    {normalizedDayKey === todayKey && (
                      <SBadge variant="primary" size="xs">
                        {isAr ? 'اليوم الحالي' : 'Today'}
                      </SBadge>
                    )}
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                    {isAr
                      ? `${selectedDaySessions.length} حصة مجدولة عبر ${focusedRoom ? focusedRoom.nameAr : `${rooms.length} قاعات`}`
                      : `${selectedDaySessions.length} sessions scheduled across ${focusedRoom ? focusedRoom.nameAr : `${rooms.length} rooms`}`}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="ch-icon-btn"
                  onClick={() => handleStepDay(-1)}
                  aria-label={isAr ? 'اليوم السابق' : 'Previous day'}
                >
                  {isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>

                <SButton
                  variant={normalizedDayKey === todayKey ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onSelectDay?.(todayKey)}
                >
                  {isAr ? 'اليوم' : 'Today'}
                </SButton>

                <button
                  type="button"
                  className="ch-icon-btn"
                  onClick={() => handleStepDay(1)}
                  aria-label={isAr ? 'اليوم التالي' : 'Next day'}
                >
                  {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
              </div>
            </div>
          </SCard>

          {/* Expanded Session Cards */}
          {selectedDaySessions.length === 0 ? (
            <SCard padding={36} style={{ textAlign: 'center', boxShadow: 'var(--shadow-xs)' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}
              >
                <Calendar size={24} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px' }}>
                {isAr ? `لا توجد حصص مجدولة يوم ${selectedDayMeta.labelAr}` : 'No sessions scheduled for this day'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 auto 18px', maxWidth: '400px', lineHeight: 1.6 }}>
                {isAr
                  ? 'يمكنك حجز أي فترة زمنية شاغرة من بطاقات القاعات أدناه أو إنشاء مجموعة جديدة مباشرة.'
                  : 'Pick any open time slot from the rooms panel below or schedule a new cohort.'}
              </p>
              <SButton
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                onClick={() => onBookSlot?.(defaultBookRoom, normalizedDayKey, null)}
              >
                {isAr ? 'حجز حصة في هذا اليوم' : 'Schedule Session'}
              </SButton>
            </SCard>
          ) : (
            <div className="ch-focus-grid">
              {selectedDaySessions.map((session) => {
                const group = session.group;
                return (
                  <div
                    key={session.id}
                    className={`ch-focus-card ${normalizedDayKey === todayKey ? 'is-today' : ''}`}
                  >
                    {/* Header: Time + Hall */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 12px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--primary)',
                          color: '#ffffff',
                          fontSize: '12.5px',
                          fontWeight: '800',
                        }}
                      >
                        <Clock size={13} />
                        <span>
                          {formatTimeTo12h(session.startTime, isAr)}{' '}
                          {isAr ? 'إلى' : 'to'} {formatTimeTo12h(session.endTime, isAr)}
                        </span>
                      </span>

                      <SBadge variant="default" size="sm">
                        <Building2 size={12} />
                        <span>{session.hallName}</span>
                      </SBadge>
                    </div>

                    {/* Title & Subject/Grade */}
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 8px', lineHeight: 1.4 }}>
                        {isAr ? group.nameAr : group.nameEn || group.nameAr}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        {group.subjectAr && (
                          <SBadge variant="primary" size="xs">
                            {group.subjectAr}
                          </SBadge>
                        )}
                        {group.gradeAr && (
                          <SBadge variant="default" size="xs">
                            {group.gradeAr}
                          </SBadge>
                        )}
                      </div>
                    </div>

                    {/* Teacher & Attendance Metadata Box */}
                    <div
                      style={{
                        backgroundColor: 'var(--bg-app)',
                        padding: '12px 14px',
                        borderRadius: '11px',
                        border: '1px solid var(--border-subtle)',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px',
                        fontSize: '12px',
                      }}
                    >
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', marginBottom: '2px' }}>
                          {isAr ? 'المعلم المسؤول' : 'Teacher'}
                        </span>
                        <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                          {session.teacherName}
                        </span>
                      </div>

                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', marginBottom: '2px' }}>
                          {isAr ? 'إشغال القاعة' : 'Occupancy'}
                        </span>
                        <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                          {session.enrolledCount} / {session.capacity} {isAr ? 'طالب' : 'students'}
                        </span>
                      </div>
                    </div>

                    {/* Actions (Clean Flex — Zero Squishing) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                      <SButton
                        variant="primary"
                        size="sm"
                        icon={<Users size={14} />}
                        onClick={() => onOpenGroupDetail?.(session.groupId)}
                        style={{ flex: 1 }}
                      >
                        {isAr ? 'سجل الطلاب والباركود' : 'Student Roster'}
                      </SButton>

                      {group.joinCode && (
                        <SButton
                          variant="ghost"
                          size="sm"
                          icon={copiedCode === group.joinCode ? <Check size={13} /> : <Copy size={13} />}
                          onClick={(e) => handleCopyCode(group.joinCode, e)}
                          style={{ fontFamily: 'monospace' }}
                        >
                          {group.joinCode}
                        </SButton>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Available Free Room Slots for One-Click Booking */}
          {roomAvailabilityForSelectedDay.length > 0 && (
            <SCard padding={20} style={{ boxShadow: 'var(--shadow-xs)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '14px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={17} color="var(--primary)" />
                  <h3 style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                    {isAr
                      ? `المواعيد الشاغرة بالقاعات — يوم ${selectedDayMeta.labelAr}`
                      : `Open Room Slots — ${selectedDayMeta.labelEn}`}
                  </h3>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  {isAr ? 'اضغط على أي فترة شاغرة لحجزها فوراً' : 'Click any open slot to schedule immediately'}
                </span>
              </div>

              <div className="ch-free-rooms-grid">
                {roomAvailabilityForSelectedDay.map(({ room, isAvailable, bookedCount, freeSlots }) => (
                  <div key={room.id} className="ch-free-room-box">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-primary)' }}>
                          {room.nameAr}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '2px' }}>
                          {room.capacity} {isAr ? 'مقعد' : 'seats'} • {room.floor || (isAr ? 'الطابق الأول' : 'Floor 1')}
                        </div>
                      </div>

                      {!isAvailable ? (
                        <SBadge variant="warning" size="xs">
                          <Wrench size={11} />
                          <span>{isAr ? 'صيانة' : 'Maint.'}</span>
                        </SBadge>
                      ) : (
                        <SBadge variant={bookedCount > 0 ? 'primary' : 'success'} size="xs">
                          {bookedCount > 0
                            ? isAr
                              ? `${bookedCount} محجوزة • ${freeSlots.length} متاحة`
                              : `${bookedCount} booked • ${freeSlots.length} open`
                            : isAr
                              ? 'متاحة بالكامل'
                              : 'Available'}
                        </SBadge>
                      )}
                    </div>

                    {!isAvailable ? (
                      <div style={{ fontSize: '12px', color: 'var(--warning, #D97706)', fontWeight: '700' }}>
                        {isAr
                          ? 'هذه القاعة في وضع الصيانة حالياً.'
                          : 'This classroom is under maintenance.'}
                      </div>
                    ) : freeSlots.length === 0 ? (
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                        {isAr ? 'جميع الفترات القياسية محجوزة لهذا اليوم.' : 'All standard slots are booked.'}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                        {freeSlots.map((slot) => (
                          <button
                            key={slot.label}
                            type="button"
                            className="ch-free-slot-btn"
                            onClick={() => onBookSlot?.(room, normalizedDayKey, slot)}
                          >
                            <Plus size={12} color="var(--success, #10B981)" />
                            <span>{slot.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SCard>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          VIEW 3: CHRONOLOGICAL AGENDA VIEW (Matching TeacherWeeklySchedule)
      ═══════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'agenda' && (
        <SCard padding={22} style={{ boxShadow: 'var(--shadow-xs)' }}>
          {metrics.totalWeeklySessions === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-secondary)' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}
              >
                <Calendar size={24} />
              </div>
              <div style={{ fontSize: '15.5px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '6px' }}>
                {isAr ? 'لا توجد حصص مجدولة مطابقة حالياً' : 'No matching scheduled sessions'}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                {isAr
                  ? 'أنشئ مجموعة جديدة أو احجز موعداً شاغراً لتظهر الحصص في الأجندة الأسبوعية فوراً.'
                  : 'Create a cohort or schedule an open slot to populate the weekly agenda.'}
              </p>
              <SButton
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                onClick={() => onBookSlot?.(defaultBookRoom, todayKey, null)}
              >
                {isAr ? 'حجز حصة جديدة' : 'Schedule Session'}
              </SButton>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {WEEKDAYS.map((day) => {
                const daySessions = sessionsByDay[day.key] || [];
                if (daySessions.length === 0) return null;
                const isToday = day.key === todayKey;

                return (
                  <div key={day.key} className="ch-agenda-day">
                    <div className="ch-agenda-day-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            width: '4px',
                            height: '18px',
                            borderRadius: '99px',
                            backgroundColor: isToday ? 'var(--primary)' : 'var(--border-medium)',
                          }}
                        />
                        <span
                          style={{
                            fontSize: '15.5px',
                            fontWeight: '900',
                            color: isToday ? 'var(--primary)' : 'var(--text-primary)',
                          }}
                        >
                          {isAr ? day.labelAr : day.labelEn}
                        </span>
                        {isToday && (
                          <SBadge variant="primary" size="xs">
                            {isAr ? 'اليوم' : 'Today'}
                          </SBadge>
                        )}
                        <SBadge variant="default" size="xs">
                          {daySessions.length} {isAr ? 'حصة' : 'sessions'}
                        </SBadge>
                      </div>

                      <SButton
                        variant="subtle"
                        size="sm"
                        icon={<Plus size={13} />}
                        onClick={() => onBookSlot?.(defaultBookRoom, day.key, null)}
                        style={{ height: '30px', padding: '0 10px', fontSize: '12px' }}
                      >
                        {isAr ? 'حجز حصة' : 'Book'}
                      </SButton>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {daySessions.map((session) => (
                        <div key={session.id} className="ch-agenda-row">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', flex: '1 1 320px', minWidth: 0 }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                minWidth: '156px',
                                padding: '6px 12px',
                                borderRadius: '9px',
                                backgroundColor: 'var(--primary)',
                                color: '#ffffff',
                                fontSize: '12px',
                                fontWeight: '800',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <Clock size={12} />
                              <span>
                                {formatTimeTo12h(session.startTime, isAr)} -{' '}
                                {formatTimeTo12h(session.endTime, isAr)}
                              </span>
                            </span>

                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: '14.5px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px' }}>
                                {isAr ? session.group.nameAr : session.group.nameEn || session.group.nameAr}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <Building2 size={12} color="var(--primary)" />
                                  <span>{session.hallName}</span>
                                </span>
                                <span style={{ opacity: 0.4 }}>•</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <GraduationCap size={12} color="var(--primary)" />
                                  <span>{session.teacherName}</span>
                                </span>
                                <span style={{ opacity: 0.4 }}>•</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)', fontWeight: '800' }}>
                                  <Users size={12} color="var(--primary)" />
                                  <span>
                                    {session.enrolledCount}/{session.capacity} {isAr ? 'طالب' : 'st.'}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            {session.group.joinCode && (
                              <SButton
                                variant="ghost"
                                size="sm"
                                icon={copiedCode === session.group.joinCode ? <Check size={12} /> : <Copy size={12} />}
                                onClick={(e) => handleCopyCode(session.group.joinCode, e)}
                                style={{ fontFamily: 'monospace' }}
                              >
                                {session.group.joinCode}
                              </SButton>
                            )}

                            <SButton
                              variant="primary"
                              size="sm"
                              icon={<Users size={13} />}
                              onClick={() => onOpenGroupDetail?.(session.groupId)}
                            >
                              {isAr ? 'سجل الطلاب' : 'Roster'}
                            </SButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SCard>
      )}
    </div>
  );
};
