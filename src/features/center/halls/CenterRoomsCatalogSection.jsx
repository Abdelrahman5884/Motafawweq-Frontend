import React, { useMemo, useState } from 'react';
import {
  Activity,
  Building2,
  Calendar,
  Check,
  ExternalLink,
  Layers,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  Wrench,
} from 'lucide-react';
import { computeRoomCohortsAndEfficiency } from './centerHallsUtils';

export const CenterRoomsCatalogSection = ({
  rooms = [],
  groups = [],
  enrolledStudents = {},
  onOpenAddRoom,
  onOpenEditRoom,
  onDeleteRoom,
  onToggleRoomAvailability,
  onOpenRoomSchedule,
  onOpenGroupDetail,
  onScheduleCohortInRoom,
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all' | 'available' | 'maintenance'
  const [togglingRoomId, setTogglingRoomId] = useState(null);

  const enrichedRooms = useMemo(() => {
    return rooms.map((room) => {
      const { assignedCohorts, efficiencyPct } = computeRoomCohortsAndEfficiency(
        room,
        groups,
        enrolledStudents
      );
      return {
        ...room,
        isAvailable: room.isAvailable !== false,
        equipped: Array.isArray(room.equipped)
          ? room.equipped
          : Array.isArray(room.equipment)
            ? room.equipment
            : [],
        assignedCohorts,
        efficiencyPct,
      };
    });
  }, [rooms, groups, enrolledStudents]);

  const kpis = useMemo(() => {
    const totalRooms = enrichedRooms.length;
    const availableRooms = enrichedRooms.filter((r) => r.isAvailable).length;
    const totalSeats = enrichedRooms.reduce((sum, r) => sum + (Number(r.capacity) || 0), 0);
    const activeRoomsWithCohorts = enrichedRooms.filter((r) => r.assignedCohorts.length > 0);
    const totalAssignedCohorts = enrichedRooms.reduce(
      (sum, r) => sum + r.assignedCohorts.length,
      0
    );
    const avgEfficiency =
      activeRoomsWithCohorts.length > 0
        ? Math.round(
            activeRoomsWithCohorts.reduce((sum, r) => sum + r.efficiencyPct, 0) /
              activeRoomsWithCohorts.length
          )
        : 0;

    return {
      totalRooms,
      availableRooms,
      totalSeats,
      totalAssignedCohorts,
      avgEfficiency,
    };
  }, [enrichedRooms]);

  const filteredRooms = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return enrichedRooms.filter((r) => {
      if (availabilityFilter === 'available' && !r.isAvailable) return false;
      if (availabilityFilter === 'maintenance' && r.isAvailable) return false;
      if (!q) return true;
      return (
        (r.nameAr || '').toLowerCase().includes(q) ||
        (r.nameEn || '').toLowerCase().includes(q) ||
        (r.floor || '').toLowerCase().includes(q) ||
        (r.branchNameAr || '').toLowerCase().includes(q) ||
        r.equipped.some((eq) => String(eq).toLowerCase().includes(q))
      );
    });
  }, [enrichedRooms, searchTerm, availabilityFilter]);

  const handleToggleAvailability = async (room) => {
    if (!onToggleRoomAvailability || togglingRoomId) return;
    setTogglingRoomId(room.id);
    try {
      await onToggleRoomAvailability(room, !room.isAvailable);
    } finally {
      setTogglingRoomId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Live Rooms KPIs Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'القاعات الدراسية المتاحة' : 'Active Classrooms'}
            </div>
            <div style={{ fontSize: '23px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '4px' }}>
              {kpis.availableRooms}{' '}
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                / {kpis.totalRooms}
              </span>
            </div>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(21, 136, 199, 0.12)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Building2 size={21} />
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'إجمالي السعة الاستيعابية' : 'Total Seating Capacity'}
            </div>
            <div style={{ fontSize: '23px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '4px' }}>
              {kpis.totalSeats}{' '}
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {isAr ? 'مقعد' : 'seats'}
              </span>
            </div>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              color: 'var(--success, #10B981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Users size={21} />
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'المجموعات المسندة للقاعات' : 'Assigned Cohorts'}
            </div>
            <div style={{ fontSize: '23px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '4px' }}>
              {kpis.totalAssignedCohorts}{' '}
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {isAr ? 'مجموعة' : 'cohorts'}
              </span>
            </div>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(139, 92, 246, 0.12)',
              color: '#8B5CF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={21} />
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'متوسط إشغال المقاعد الفعلي' : 'Average Seat Utilization'}
            </div>
            <div style={{ fontSize: '23px', fontWeight: '900', color: 'var(--primary)', marginTop: '4px' }}>
              {kpis.avgEfficiency}%
            </div>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Activity size={21} />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      {enrichedRooms.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            backgroundColor: 'var(--bg-surface)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
            <input
              type="text"
              placeholder={
                isAr
                  ? 'ابحث باسم القاعة أو الطابق أو التجهيزات...'
                  : 'Search by room name, floor, or equipment...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                height: '38px',
                padding: '0 14px 0 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '700',
              }}
            />
            <Search
              size={15}
              color="var(--text-secondary)"
              style={{ position: 'absolute', left: '12px', top: '11px' }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'var(--bg-app)',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
            }}
          >
            {[
              { id: 'all', labelAr: `الكل (${enrichedRooms.length})`, labelEn: `All (${enrichedRooms.length})` },
              {
                id: 'available',
                labelAr: `متاحة للتشغيل (${kpis.availableRooms})`,
                labelEn: `Available (${kpis.availableRooms})`,
              },
              {
                id: 'maintenance',
                labelAr: `في الصيانة (${kpis.totalRooms - kpis.availableRooms})`,
                labelEn: `Maintenance (${kpis.totalRooms - kpis.availableRooms})`,
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAvailabilityFilter(item.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: availabilityFilter === item.id ? 'var(--bg-surface)' : 'transparent',
                  color: availabilityFilter === item.id ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '11.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {isAr ? item.labelAr : item.labelEn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rooms Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
          gap: '20px',
        }}
      >
        {enrichedRooms.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '60px 24px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px dashed var(--border-subtle)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                backgroundColor: 'rgba(21, 136, 199, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                margin: '0 auto 16px',
              }}
            >
              <Building2 size={28} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {isAr ? 'لم يتم إضافة قاعات دراسية في هذا الفرع بعد' : 'No classrooms added to this branch yet'}
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                maxWidth: '420px',
                margin: '0 auto 20px',
                lineHeight: 1.6,
              }}
            >
              {isAr
                ? 'يمكنك إضافة قاعة دراسية جديدة وتحديد سعتها المجهزة بالشاشات والتكييف ونظام الصوتيات الآن.'
                : 'You can add a classroom, define its seating capacity and multimedia equipment now.'}
            </p>
            <button
              type="button"
              onClick={onOpenAddRoom}
              style={{
                padding: '10px 22px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={16} />
              <span>{isAr ? 'إضافة قاعة جديدة الآن' : 'Add Classroom Now'}</span>
            </button>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '44px 24px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '13px',
            }}
          >
            {isAr ? 'لا توجد قاعات تطابق معايير البحث الحالية.' : 'No rooms match the current search filter.'}
          </div>
        ) : (
          filteredRooms.map((room) => {
            const { assignedCohorts, efficiencyPct } = room;
            const isAvailable = room.isAvailable !== false;
            const isToggling = togglingRoomId === room.id;

            return (
              <div
                key={room.id}
                className="center-interactive-card"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: isAvailable
                    ? '1px solid var(--border-subtle)'
                    : '1.5px solid rgba(245, 158, 11, 0.4)',
                  padding: '22px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                        {room.branchNameAr || (isAr ? 'الفرع الرئيسي' : 'Main Branch')} • {room.floor || (isAr ? 'الطابق الأول' : '1st Floor')}
                      </span>
                      <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: '3px 0 0 0' }}>
                        {isAr ? room.nameAr : room.nameEn || room.nameAr}
                      </h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: '800',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'rgba(21, 136, 199, 0.1)',
                          color: 'var(--primary)',
                        }}
                      >
                        {room.capacity} {isAr ? 'مقعد' : 'seats'}
                      </span>

                      <button
                        type="button"
                        disabled={isToggling}
                        onClick={() => handleToggleAvailability(room)}
                        title={
                          isAr
                            ? 'اضغط لتبديل حالة القاعة (متاحة للتشغيل / في الصيانة)'
                            : 'Toggle room availability'
                        }
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '4px 9px',
                          borderRadius: 'var(--radius-full)',
                          border: isAvailable
                            ? '1px solid rgba(16, 185, 129, 0.35)'
                            : '1px solid rgba(245, 158, 11, 0.4)',
                          backgroundColor: isAvailable
                            ? 'rgba(16, 185, 129, 0.12)'
                            : 'rgba(245, 158, 11, 0.14)',
                          color: isAvailable ? 'var(--success, #10B981)' : '#D97706',
                          cursor: isToggling ? 'wait' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {isAvailable ? <Check size={11} /> : <Wrench size={11} />}
                        <span>
                          {isAvailable
                            ? isAr
                              ? 'متاحة'
                              : 'Active'
                            : isAr
                              ? 'صيانة'
                              : 'Maintenance'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => onOpenEditRoom(room, e)}
                        title={isAr ? 'تعديل بيانات القاعة' : 'Edit Room'}
                        aria-label={isAr ? 'تعديل القاعة' : 'Edit Room'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '31px',
                          height: '31px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                        }}
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteRoom(room);
                        }}
                        title={isAr ? 'حذف القاعة' : 'Delete Room'}
                        aria-label={isAr ? 'حذف القاعة' : 'Delete Room'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '31px',
                          height: '31px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--danger, #EF4444)',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Room Equipment Pills */}
                  {room.equipped.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {room.equipped.map((eq, i) => (
                        <span
                          key={`${eq}-${i}`}
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--bg-subtle)',
                            color: 'var(--text-secondary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Check size={11} color="var(--success)" />
                          <span>{eq}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Cohorts using this room */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                        {isAr ? 'المجموعات المرتبطة بالقاعة:' : 'Assigned Cohorts:'} ({assignedCohorts.length})
                      </span>

                      <button
                        type="button"
                        onClick={() => onScheduleCohortInRoom?.(room)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary)',
                          fontSize: '11.5px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: 0,
                        }}
                      >
                        <Plus size={12} />
                        <span>{isAr ? 'تسكين مجموعة' : 'Assign Cohort'}</span>
                      </button>
                    </div>

                    {assignedCohorts.length === 0 ? (
                      <div
                        style={{
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-app)',
                          border: '1px dashed var(--border-subtle)',
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          textAlign: 'center',
                        }}
                      >
                        {isAr
                          ? 'لا توجد مجموعات مجدولة حالياً في هذه القاعة'
                          : 'No cohorts assigned to this classroom yet'}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {assignedCohorts.map((c) => {
                          const enrolled = Number(c.enrolledCount ?? 0);
                          const cap = Math.max(1, Number(room.capacity) || 40);
                          const fillRatio =
                            typeof c.fillRatio === 'number'
                              ? c.fillRatio
                              : Math.min(100, Math.round((enrolled / cap) * 100));

                          return (
                            <div
                              key={c.id}
                              onClick={() => onOpenGroupDetail?.(c.id)}
                              title={isAr ? 'اضغط لفتح سجل طلاب المجموعة' : 'Open cohort roster'}
                              style={{
                                padding: '9px 11px',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: 'var(--bg-app)',
                                border: '1px solid var(--border-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px',
                                fontSize: '12px',
                                cursor: 'pointer',
                              }}
                            >
                              <div style={{ minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                                    {c.nameAr}
                                  </span>
                                  <ExternalLink size={11} color="var(--primary)" />
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                  {c.teacherNameAr || (isAr ? 'معلم معتمد' : 'Assigned Teacher')}
                                  {c.scheduleAr ? ` • ${c.scheduleAr}` : ''}
                                </div>
                              </div>

                              <span
                                style={{
                                  fontWeight: '800',
                                  flexShrink: 0,
                                  color:
                                    fillRatio >= 90
                                      ? 'var(--danger)'
                                      : fillRatio >= 70
                                        ? 'var(--warning)'
                                        : 'var(--success)',
                                }}
                              >
                                {enrolled} / {cap} ({fillRatio}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Capacity Progress Bar & Schedule Jump */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '11.5px',
                        fontWeight: '800',
                        marginBottom: '5px',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {isAr ? 'مؤشر الكفاءة وإشغال القاعة الفعلي' : 'Live Seat Utilization'}
                      </span>
                      <span
                        style={{
                          color:
                            efficiencyPct >= 85
                              ? 'var(--success, #10B981)'
                              : efficiencyPct > 0
                                ? 'var(--primary)'
                                : 'var(--text-secondary)',
                        }}
                      >
                        {efficiencyPct}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: '6px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-subtle)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(100, Math.max(0, efficiencyPct))}%`,
                          height: '100%',
                          backgroundColor:
                            efficiencyPct >= 85
                              ? 'var(--success, #10B981)'
                              : 'var(--primary)',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenRoomSchedule?.(room)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Calendar size={14} color="var(--primary)" />
                    <span>{isAr ? 'استعراض جدول مواعيد القاعة' : 'View Hall Schedule'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
