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
import { SBadge, SButton, SCard } from '../../../components/student/ui';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* ── Live Rooms KPIs Strip ── */}
      <div className="ch-kpi-grid">
        <div className="ch-kpi-card">
          <div
            className="ch-kpi-icon"
            style={{ backgroundColor: 'var(--primary-surface)', color: 'var(--primary)' }}
          >
            <Building2 size={21} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'القاعات المتاحة' : 'Active Classrooms'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '2px' }}>
              {kpis.availableRooms}{' '}
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-muted)' }}>
                / {kpis.totalRooms}
              </span>
            </div>
          </div>
        </div>

        <div className="ch-kpi-card">
          <div
            className="ch-kpi-icon"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--success, #10B981)' }}
          >
            <Users size={21} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'السعة الاستيعابية' : 'Total Capacity'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '2px' }}>
              {kpis.totalSeats.toLocaleString()}{' '}
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {isAr ? 'مقعد' : 'seats'}
              </span>
            </div>
          </div>
        </div>

        <div className="ch-kpi-card">
          <div
            className="ch-kpi-icon"
            style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6' }}
          >
            <Layers size={21} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'المجموعات المسندة' : 'Assigned Cohorts'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '2px' }}>
              {kpis.totalAssignedCohorts}{' '}
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {isAr ? 'مجموعة' : 'cohorts'}
              </span>
            </div>
          </div>
        </div>

        <div className="ch-kpi-card">
          <div
            className="ch-kpi-icon"
            style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#D97706' }}
          >
            <Activity size={21} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'متوسط إشغال المقاعد' : 'Avg. Utilization'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary)', marginTop: '2px' }}>
              {kpis.avgEfficiency}%
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter & Search Toolbar (RTL-Safe) ── */}
      {enrichedRooms.length > 0 && (
        <div className="ch-toolbar">
          <div className="ch-search-wrap">
            <Search size={15} className="ch-search-icon" />
            <input
              type="text"
              className="ch-search-input"
              placeholder={
                isAr
                  ? 'ابحث باسم القاعة أو الطابق أو التجهيزات...'
                  : 'Search by room name, floor, or equipment...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="ch-seg-group">
            {[
              { id: 'all', labelAr: `الكل (${enrichedRooms.length})`, labelEn: `All (${enrichedRooms.length})` },
              {
                id: 'available',
                labelAr: `متاحة (${kpis.availableRooms})`,
                labelEn: `Active (${kpis.availableRooms})`,
              },
              {
                id: 'maintenance',
                labelAr: `صيانة (${kpis.totalRooms - kpis.availableRooms})`,
                labelEn: `Maint. (${kpis.totalRooms - kpis.availableRooms})`,
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAvailabilityFilter(item.id)}
                className={`ch-seg-btn ${availabilityFilter === item.id ? 'subtle-active' : ''}`}
              >
                {isAr ? item.labelAr : item.labelEn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Rooms Grid ── */}
      {enrichedRooms.length === 0 ? (
        <SCard padding="lg">
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                backgroundColor: 'var(--primary-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                margin: '0 auto 14px',
              }}
            >
              <Building2 size={26} />
            </div>
            <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 8px' }}>
              {isAr ? 'لم يتم إضافة قاعات دراسية في هذا الفرع بعد' : 'No classrooms added yet'}
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                maxWidth: '420px',
                margin: '0 auto 18px',
                lineHeight: 1.6,
              }}
            >
              {isAr
                ? 'أضف أول قاعة دراسية وحدد سعتها الاستيعابية وتجهيزاتها لبدء جدولة المجموعات بدون تعارض.'
                : 'Add your first classroom, seating capacity, and equipment to start scheduling cohorts.'}
            </p>
            <SButton variant="primary" size="md" icon={<Plus size={15} />} onClick={onOpenAddRoom}>
              {isAr ? 'إضافة قاعة جديدة' : 'Add Classroom'}
            </SButton>
          </div>
        </SCard>
      ) : filteredRooms.length === 0 ? (
        <SCard padding="lg">
          <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--text-secondary)', fontSize: '13.5px', fontWeight: '700' }}>
            {isAr ? 'لا توجد قاعات تطابق معايير البحث الحالية.' : 'No classrooms match the current filter.'}
          </div>
        </SCard>
      ) : (
        <div className="ch-rooms-grid">
          {filteredRooms.map((room) => {
            const isToggling = togglingRoomId === room.id;
            const fillColor =
              room.efficiencyPct >= 90
                ? 'var(--danger, #EF4444)'
                : room.efficiencyPct >= 70
                  ? '#F59E0B'
                  : 'var(--primary)';

            return (
              <div
                key={room.id}
                className={`ch-room-card ${!room.isAvailable ? 'is-maintenance' : ''}`}
              >
                <div>
                  {/* Room Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        <SBadge
                          tone={room.isAvailable ? 'success' : 'warning'}
                          size="sm"
                          icon={room.isAvailable ? <Check size={11} /> : <Wrench size={11} />}
                        >
                          {room.isAvailable
                            ? isAr
                              ? 'متاحة للتشغيل'
                              : 'Available'
                            : isAr
                              ? 'في الصيانة'
                              : 'Maintenance'}
                        </SBadge>

                        {room.branchNameAr && (
                          <SBadge tone="neutral" size="sm">
                            {room.branchNameAr}
                          </SBadge>
                        )}
                      </div>

                      <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                        {isAr ? room.nameAr : room.nameEn || room.nameAr}
                      </h3>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px', fontWeight: '600' }}>
                        {room.floor || (isAr ? 'الطابق الأول' : 'Floor 1')} •{' '}
                        <strong style={{ color: 'var(--text-primary)' }}>
                          {room.capacity} {isAr ? 'مقعد' : 'seats'}
                        </strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                      <button
                        type="button"
                        className="ch-icon-btn"
                        disabled={isToggling}
                        onClick={() => handleToggleAvailability(room)}
                        title={
                          room.isAvailable
                            ? isAr
                              ? 'تحويل القاعة لوضع الصيانة'
                              : 'Set to maintenance'
                            : isAr
                              ? 'إعادة تفعيل القاعة'
                              : 'Activate room'
                        }
                      >
                        {room.isAvailable ? <Wrench size={14} /> : <Check size={14} />}
                      </button>

                      <button
                        type="button"
                        className="ch-icon-btn"
                        onClick={(e) => onOpenEditRoom?.(room, e)}
                        title={isAr ? 'تعديل بيانات القاعة' : 'Edit room'}
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        type="button"
                        className="ch-icon-btn danger"
                        onClick={() => onDeleteRoom?.(room)}
                        title={isAr ? 'حذف القاعة' : 'Delete room'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Utilization Bar */}
                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: '11px',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: '800', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {isAr ? 'كفاءة إشغال المقاعد' : 'Seat Utilization'}
                      </span>
                      <span style={{ color: fillColor }}>{room.efficiencyPct}%</span>
                    </div>
                    <div
                      style={{
                        height: '6px',
                        width: '100%',
                        borderRadius: '999px',
                        backgroundColor: 'var(--bg-subtle)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.min(100, Math.max(0, room.efficiencyPct))}%`,
                          backgroundColor: fillColor,
                          borderRadius: '999px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Equipment Chips */}
                  {room.equipped.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                      {room.equipped.slice(0, 4).map((eq, idx) => (
                        <span
                          key={`${eq}-${idx}`}
                          style={{
                            fontSize: '10.5px',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--bg-subtle)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          {eq}
                        </span>
                      ))}
                      {room.equipped.length > 4 && (
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: '800',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--primary-surface)',
                            color: 'var(--primary)',
                          }}
                        >
                          +{room.equipped.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Assigned Cohorts Preview */}
                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: '11px',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: room.assignedCohorts.length > 0 ? '8px' : 0 }}>
                      <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                        {isAr ? 'المجموعات المسندة:' : 'Assigned Cohorts:'}
                      </span>
                      <span style={{ fontSize: '11.5px', fontWeight: '900', color: 'var(--primary)' }}>
                        {room.assignedCohorts.length} {isAr ? 'مجموعة' : 'cohorts'}
                      </span>
                    </div>

                    {room.assignedCohorts.length === 0 ? (
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {isAr ? 'القاعة جاهزة ولم تُسند لها مجموعات بعد.' : 'No cohorts assigned yet.'}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {room.assignedCohorts.slice(0, 3).map((cohort) => (
                          <button
                            key={cohort.id}
                            type="button"
                            onClick={() => onOpenGroupDetail?.(cohort.id)}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '8px',
                              padding: '6px 9px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-surface)',
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                              textAlign: 'inherit',
                              fontFamily: 'inherit',
                            }}
                          >
                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: '12px',
                                  fontWeight: '800',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {cohort.nameAr}
                              </div>
                              <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                                {cohort.teacherNameAr} • {cohort.enrolledCount}/{cohort.capacity}{' '}
                                {isAr ? 'طالب' : 'st.'}
                              </div>
                            </div>
                            <ExternalLink size={12} color="var(--primary)" style={{ flexShrink: 0 }} />
                          </button>
                        ))}
                        {room.assignedCohorts.length > 3 && (
                          <button
                            type="button"
                            onClick={() => onOpenRoomSchedule?.(room)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--primary)',
                              fontSize: '11px',
                              fontWeight: '800',
                              cursor: 'pointer',
                              padding: '2px 0',
                              fontFamily: 'inherit',
                            }}
                          >
                            {isAr
                              ? `+${room.assignedCohorts.length - 3} مجموعات أخرى في جدول القاعة`
                              : `+${room.assignedCohorts.length - 3} more in room schedule`}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <SButton
                    variant="secondary"
                    size="sm"
                    icon={<Calendar size={14} />}
                    onClick={() => onOpenRoomSchedule?.(room)}
                  >
                    {isAr ? 'جدول القاعة' : 'Schedule'}
                  </SButton>

                  <SButton
                    variant="primary"
                    size="sm"
                    disabled={!room.isAvailable}
                    icon={<Plus size={14} />}
                    onClick={() => onScheduleCohortInRoom?.(room)}
                  >
                    {isAr ? 'تسكين مجموعة' : 'Book Cohort'}
                  </SButton>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
