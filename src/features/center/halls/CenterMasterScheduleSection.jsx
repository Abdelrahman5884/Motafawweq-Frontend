import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  RefreshCw,
  Users,
  Wrench,
} from 'lucide-react';
import { centerApi } from '../../../services/centerApi';
import {
  STANDARD_CENTER_SLOTS,
  WEEKDAYS,
  doesSlotMatchRoom,
  formatTimeTo12h,
  resolveGroupEnrolledCount,
} from './centerHallsUtils';

export const CenterMasterScheduleSection = ({
  rooms = [],
  groups = [],
  enrolledStudents = {},
  selectedDay = 'saturday',
  onSelectDay,
  selectedBranchId = 'all',
  focusedRoomId = null,
  onClearFocusedRoom,
  onOpenGroupDetail,
  onBookSlot,
  isBackendCenter = true,
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';
  const [apiSchedule, setApiSchedule] = useState(null);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  const normalizedDayKey = String(selectedDay || 'saturday').toLowerCase();

  useEffect(() => {
    if (!isBackendCenter) return undefined;

    let cancelled = false;
    const params = {
      day: normalizedDayKey,
      ...(selectedBranchId && selectedBranchId !== 'all' ? { branch_id: selectedBranchId } : {}),
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

  // Compute live schedule combining local rooms/groups state with backend master schedule
  const hallsSchedule = useMemo(() => {
    const targetRooms = focusedRoomId
      ? rooms.filter((r) => String(r.id) === String(focusedRoomId))
      : rooms;

    return targetRooms.map((room) => {
      const apiHall = Array.isArray(apiSchedule?.halls)
        ? apiSchedule.halls.find((h) => String(h.roomId) === String(room.id))
        : null;

      const localSessions = [];
      groups.forEach((g) => {
        const allSlots = g.scheduleSlots || g.slots || [];
        allSlots.forEach((s) => {
          const slotDay = String(s.day || '').toLowerCase();
          if (slotDay === normalizedDayKey && doesSlotMatchRoom(s, g, room)) {
            localSessions.push({
              slotId: s.id,
              groupId: g.id,
              groupNameAr: g.nameAr,
              groupNameEn: g.nameEn || g.nameAr,
              subjectAr: g.subjectAr,
              gradeAr: g.gradeAr,
              teacherNameAr: g.teacherNameAr || 'معلم معتمد',
              startTime: s.startTime || '16:00',
              endTime: s.endTime || '18:00',
              enrolledCount: resolveGroupEnrolledCount(g, enrolledStudents),
              capacity: Number(room.capacity) || 40,
            });
          }
        });
      });

      const sessions =
        localSessions.length > 0
          ? localSessions
          : Array.isArray(apiHall?.sessions)
            ? apiHall.sessions
            : [];

      sessions.sort((a, b) => String(a.startTime || '').localeCompare(String(b.startTime || '')));

      const freeSlots = STANDARD_CENTER_SLOTS.filter((std) => {
        return !sessions.some((sess) => {
          const sStart = sess.startTime || '16:00';
          const sEnd = sess.endTime || '18:00';
          return std.startTime < sEnd && std.endTime > sStart;
        });
      });

      return {
        room,
        isOccupied: sessions.length > 0,
        sessions,
        freeSlots,
      };
    });
  }, [rooms, groups, enrolledStudents, normalizedDayKey, apiSchedule, focusedRoomId]);

  const daySummary = useMemo(() => {
    const totalRooms = hallsSchedule.length;
    const occupiedRooms = hallsSchedule.filter((h) => h.isOccupied).length;
    const availableRooms = Math.max(0, totalRooms - occupiedRooms);
    const totalSessions = hallsSchedule.reduce((sum, h) => sum + h.sessions.length, 0);
    return { totalRooms, occupiedRooms, availableRooms, totalSessions };
  }, [hallsSchedule]);

  const currentDayMeta =
    WEEKDAYS.find((w) => w.key === normalizedDayKey) || WEEKDAYS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Day Selector Pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}
        >
          {WEEKDAYS.map((day) => {
            const isSelected = day.key === normalizedDayKey;
            return (
              <button
                key={day.key}
                type="button"
                onClick={() => onSelectDay(day.key)}
                style={{
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? 'none' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-surface)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? 'var(--shadow-xs)' : 'none',
                }}
              >
                {isAr ? day.labelAr : day.labelEn}
              </button>
            );
          })}
        </div>

        {focusedRoomId && (
          <button
            type="button"
            onClick={onClearFocusedRoom}
            style={{
              padding: '7px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              color: 'var(--primary)',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'عرض جدول جميع القاعات' : 'Show All Classrooms'}
          </button>
        )}
      </div>

      {/* Day Summary KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
            {isAr ? 'إجمالي القاعات المعروضة' : 'Displayed Classrooms'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '2px' }}>
            {daySummary.totalRooms}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
            {isAr ? 'قاعات بها حصص هذا اليوم' : 'Occupied Classrooms'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--primary)', marginTop: '2px' }}>
            {daySummary.occupiedRooms}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
            {isAr ? 'قاعات شاغرة بالكامل اليوم' : 'Completely Free Today'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--success, #10B981)', marginTop: '2px' }}>
            {daySummary.availableRooms}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
            {isAr ? 'إجمالي الحصص المجدولة اليوم' : 'Scheduled Sessions Today'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '2px' }}>
            {daySummary.totalSessions}
          </div>
        </div>
      </div>

      {/* Schedule Grid Matrix */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Header info */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: 'var(--bg-app)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="var(--success)" />
            <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {isAr
                ? `جدول يوم ${currentDayMeta.labelAr} — درع منع التعارض الزمني نشط`
                : `${currentDayMeta.labelEn} Master Schedule — Zero Conflict Shield Active`}
            </span>
            {loadingSchedule && <RefreshCw size={13} className="animate-spin" color="var(--primary)" />}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {isAr
              ? 'اضغط على أي موعد شاغر لحجز مجموعة جديدة في القاعة مباشرةً بدون تداخل'
              : 'Click any free slot to schedule a cohort directly in that room'}
          </span>
        </div>

        {/* Responsive Halls Schedule Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
          {hallsSchedule.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 24px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px dashed var(--border-subtle)',
              }}
            >
              <Building2 size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 12px', display: 'block' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                {isAr
                  ? 'لم يتم إضافة قاعات دراسية لعرض الجدول في هذا الفرع'
                  : 'No classrooms available for this branch schedule'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {isAr
                  ? 'يرجى اختيار فرع آخر أو إضافة قاعة دراسية جديدة أولاً'
                  : 'Please select another branch or add a classroom first'}
              </p>
            </div>
          ) : (
            hallsSchedule.map(({ room, isOccupied, sessions, freeSlots }) => {
              const isRoomAvailable = room.isAvailable !== false;

              return (
                <div
                  key={room.id}
                  style={{
                    backgroundColor: 'var(--bg-app)',
                    borderRadius: 'var(--radius-xl)',
                    border: isOccupied
                      ? '1.5px solid rgba(21, 136, 199, 0.3)'
                      : '1px solid var(--border-subtle)',
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  {/* Room Header Banner */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                      paddingBottom: '12px',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          backgroundColor: isOccupied
                            ? 'rgba(21, 136, 199, 0.12)'
                            : 'var(--bg-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isOccupied ? 'var(--primary)' : 'var(--text-secondary)',
                        }}
                      >
                        <Building2 size={20} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)' }}>
                            {isAr ? room.nameAr : room.nameEn || room.nameAr}
                          </span>
                          {!isRoomAvailable && (
                            <span
                              style={{
                                fontSize: '10.5px',
                                fontWeight: '800',
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: 'rgba(245, 158, 11, 0.14)',
                                color: '#D97706',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <Wrench size={10} />
                              <span>{isAr ? 'في الصيانة' : 'Maintenance'}</span>
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {room.floor || (isAr ? 'الطابق الأول' : '1st Floor')} • {isAr ? 'سعة:' : 'Cap:'}{' '}
                          <strong>
                            {room.capacity} {isAr ? 'مقعد' : 'seats'}
                          </strong>{' '}
                          • {room.branchNameAr || (isAr ? 'الفرع الرئيسي' : 'Main Branch')}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: '800',
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: isOccupied
                            ? 'rgba(21, 136, 199, 0.12)'
                            : 'rgba(16, 185, 129, 0.12)',
                          color: isOccupied ? 'var(--primary)' : 'var(--success, #10B981)',
                          border: isOccupied
                            ? '1px solid rgba(21, 136, 199, 0.3)'
                            : '1px solid rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        {isOccupied
                          ? isAr
                            ? `محجوزة (${sessions.length} حصص اليوم)`
                            : `Booked (${sessions.length} sessions)`
                          : isAr
                            ? 'شاغرة طوال اليوم'
                            : 'Available all day'}
                      </span>
                    </div>
                  </div>

                  {/* Scheduled Cohorts List */}
                  {isOccupied ? (
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                        {isAr
                          ? 'الحصص والمجموعات المحجوزة في هذه القاعة اليوم:'
                          : 'Scheduled cohorts in this hall today:'}
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                          gap: '12px',
                        }}
                      >
                        {sessions.map((sess, idx) => {
                          const enrolled = Number(sess.enrolledCount ?? 0);
                          const cap = Math.max(1, Number(sess.capacity || room.capacity || 40));

                          return (
                            <div
                              key={sess.slotId || `${sess.groupId}-${idx}`}
                              onClick={() => sess.groupId && onOpenGroupDetail?.(sess.groupId)}
                              style={{
                                backgroundColor: 'var(--bg-surface)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border-subtle)',
                                padding: '14px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                boxShadow: 'var(--shadow-xs)',
                                cursor: sess.groupId ? 'pointer' : 'default',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '4px 9px',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: 'rgba(21, 136, 199, 0.1)',
                                    color: 'var(--primary)',
                                    fontSize: '11.5px',
                                    fontWeight: '800',
                                  }}
                                >
                                  <Clock size={13} />
                                  <span>
                                    {formatTimeTo12h(sess.startTime, isAr)} -{' '}
                                    {formatTimeTo12h(sess.endTime, isAr)}
                                  </span>
                                </div>
                                <span
                                  style={{
                                    fontSize: '10.5px',
                                    fontWeight: '800',
                                    padding: '2px 8px',
                                    borderRadius: 'var(--radius-full)',
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    color: 'var(--danger)',
                                  }}
                                >
                                  {isAr ? 'محجوزة' : 'Booked'}
                                </span>
                              </div>

                              <div
                                style={{
                                  fontSize: '13.5px',
                                  fontWeight: '800',
                                  color: 'var(--text-primary)',
                                  lineHeight: 1.4,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: '6px',
                                }}
                              >
                                <span>{sess.groupNameAr}</span>
                                {sess.groupId && <ExternalLink size={12} color="var(--primary)" />}
                              </div>

                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  fontSize: '11.5px',
                                  color: 'var(--text-secondary)',
                                  paddingTop: '6px',
                                  borderTop: '1px dashed var(--border-subtle)',
                                }}
                              >
                                <span>
                                  {isAr ? 'المدرس:' : 'Teacher:'}{' '}
                                  <strong style={{ color: 'var(--text-primary)' }}>
                                    {sess.teacherNameAr || (isAr ? 'معلم معتمد' : 'Assigned Teacher')}
                                  </strong>
                                </span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <Users size={12} color="var(--primary)" />
                                  <strong style={{ color: 'var(--primary)' }}>
                                    {enrolled} / {cap} {isAr ? 'طالب' : 'std'}
                                  </strong>
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: '14px 18px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px dashed var(--border-medium)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '10px',
                        color: 'var(--text-secondary)',
                        fontSize: '12.5px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Check size={16} color="var(--success)" />
                        <span>
                          {isAr
                            ? 'القاعة شاغرة طوال هذا اليوم — متاحة لحجز حصص جديدة بدون أي تداخل زمني.'
                            : 'Room is free throughout this day.'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Free Slots Interactive Booking Strip */}
                  {freeSlots.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '6px',
                        paddingTop: '6px',
                        fontSize: '11.5px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span style={{ fontWeight: '800' }}>
                        {isAr ? 'المواعيد الشاغرة المتاحة للحجز الفوري:' : 'Available Free Slots:'}
                      </span>
                      {freeSlots.map((fs) => (
                        <button
                          key={fs.startTime}
                          type="button"
                          onClick={() => onBookSlot?.(room, normalizedDayKey, fs)}
                          title={
                            isAr
                              ? `اضغط لحجز مجموعة جديدة في ${room.nameAr} (${fs.label})`
                              : `Book new cohort in ${room.nameAr} (${fs.label})`
                          }
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                            color: 'var(--success, #10B981)',
                            fontWeight: '800',
                            fontSize: '11px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Plus size={11} />
                          <span>{fs.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
