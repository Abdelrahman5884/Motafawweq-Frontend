import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const DONUT_RADIUS = 56;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

/**
 * Balanced Hall Occupancy Gauge card pairing a clean centered donut visualization,
 * 3-column capacity summary strip, and top occupied halls or empty-state CTA.
 */
export const CenterHallOccupancyCard = ({
  hallOccupancy = {},
  isAr = true,
  isRtl = true,
  isDark = false,
  themeAccent = '#1588C7',
}) => {
  const totalCapacity = Number(hallOccupancy.totalCapacity ?? 0);
  const totalOccupied = Number(hallOccupancy.totalOccupied ?? 0);
  const availableSeats = Number(hallOccupancy.availableSeats ?? 0);
  const rawPct = Number(hallOccupancy.overallOccupancyPct ?? 0);
  const clampedPct = Math.max(0, Math.min(100, rawPct));
  const rooms = Array.isArray(hallOccupancy.rooms) ? hallOccupancy.rooms : [];
  const topRooms = rooms.slice(0, 3);

  const dashOffset = DONUT_CIRCUMFERENCE * (1 - clampedPct / 100);
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div
      className="executive-card executive-chart-side"
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px 24px',
        boxShadow: 'var(--shadow-xs)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={18} style={{ color: themeAccent }} />
          <h2
            style={{
              margin: 0,
              fontSize: '15.5px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading), var(--font-arabic)',
            }}
          >
            {isAr ? 'معدل استغلال القاعات' : 'Hall Occupancy Rate'}
          </h2>
        </div>

        <Link
          to="/center/halls"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '11.5px',
            fontWeight: '700',
            color: themeAccent,
            textDecoration: 'none',
          }}
        >
          <span>{isAr ? 'عرض الكل' : 'View all'}</span>
          <ArrowIcon size={13} />
        </Link>
      </div>

      {/* Centered Crisp Donut Gauge */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
        <div style={{ position: 'relative', width: '144px', height: '144px' }}>
          <svg
            width="144"
            height="144"
            viewBox="0 0 144 144"
            style={{ display: 'block', transform: 'rotate(-90deg)' }}
          >
            <circle
              cx="72"
              cy="72"
              r={DONUT_RADIUS}
              fill="transparent"
              stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)'}
              strokeWidth="11"
            />
            <circle
              cx="72"
              cy="72"
              r={DONUT_RADIUS}
              fill="transparent"
              stroke={rawPct >= 90 ? '#F59E0B' : themeAccent}
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={DONUT_CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              className="executive-donut-segment"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: '26px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                lineHeight: 1.05,
              }}
            >
              {rawPct}%
            </span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', marginTop: '3px' }}>
              {isAr ? 'نسبة الإشغال' : 'Occupancy'}
            </span>
          </div>
        </div>
      </div>

      {/* 3-Column Metrics Summary Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          padding: '10px 12px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
            {isAr ? 'المشغول' : 'Occupied'}
          </div>
          <div style={{ fontSize: '14.5px', fontWeight: '900', color: themeAccent, marginTop: '2px' }}>
            {totalOccupied.toLocaleString()}
          </div>
        </div>
        <div
          style={{
            borderInline: '1px solid var(--border-subtle)',
            paddingInline: '6px',
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
            {isAr ? 'السعة الكلية' : 'Capacity'}
          </div>
          <div style={{ fontSize: '14.5px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '2px' }}>
            {totalCapacity.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
            {isAr ? 'المتاح' : 'Available'}
          </div>
          <div style={{ fontSize: '14.5px', fontWeight: '900', color: '#10B981', marginTop: '2px' }}>
            {availableSeats.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Rooms Breakdown or Balanced Empty CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {topRooms.length === 0 ? (
          <div
            style={{
              padding: '16px 14px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-app)',
              border: '1px dashed var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              {isAr
                ? 'لم يتم تسجيل قاعات دراسية حتى الآن'
                : 'No classrooms have been added yet'}
            </div>
            <Link
              to="/center/halls"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: themeAccent,
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: '800',
                textDecoration: 'none',
              }}
            >
              <Plus size={14} />
              <span>{isAr ? 'إضافة أول قاعة' : 'Add First Hall'}</span>
            </Link>
          </div>
        ) : (
          topRooms.map((room) => {
            const roomPct = Math.max(0, Math.min(100, Number(room.pct ?? 0)));
            const isNearFull = roomPct >= 90;
            return (
              <div
                key={room.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-app)',
                  border: `1px solid ${
                    isNearFull
                      ? 'rgba(245, 158, 11, 0.3)'
                      : isDark
                      ? 'rgba(56, 189, 248, 0.18)'
                      : 'rgba(21, 136, 199, 0.16)'
                  }`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {isAr ? room.nameAr : room.nameEn || room.nameAr}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {room.branchNameAr ? `${room.branchNameAr} • ` : ''}
                      {room.groupsCount ?? 0} {isAr ? 'مجموعات' : 'groups'}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: '800',
                      color: isNearFull ? 'var(--warning)' : themeAccent,
                    }}
                  >
                    {room.occupied ?? 0} / {room.capacity ?? 0} ({roomPct}%)
                  </span>
                </div>

                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${roomPct}%`,
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isNearFull ? '#F59E0B' : themeAccent,
                      transition: 'width 0.35s ease',
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
