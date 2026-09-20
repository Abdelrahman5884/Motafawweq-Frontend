import React from 'react';
import { QrCode, Calendar, MapPin, DollarSign, Check, Copy, ArrowRight } from 'lucide-react';

export const ClassCard = ({
  cls,
  lang,
  isRtl,
  copiedCode,
  onOpenQr,
  onCopyCode,
  onViewRoster
}) => {
  const occupancyPercent = Math.round((cls.enrolledStudents / cls.capacity) * 100);

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '18px'
      }}
    >
      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '700',
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-surface)',
            color: 'var(--primary)'
          }}>
            {lang === 'ar' ? cls.gradeAr : cls.grade}
          </span>

          <button
            onClick={onOpenQr}
            title="View QR Code"
            style={{
              border: 'none',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '5px',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            <QrCode size={16} />
          </button>
        </div>

        <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
          {lang === 'ar' ? cls.nameAr : cls.name}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="var(--text-muted)" />
            <span>{lang === 'ar' ? cls.scheduleAr : cls.schedule}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="var(--text-muted)" />
            <span>{cls.centerName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <DollarSign size={14} color="var(--success)" />
            <span>{cls.priceEgp} {lang === 'ar' ? 'ج.م / شهرياً' : 'EGP / mo'}</span>
          </div>
        </div>

        {/* Capacity Bar */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'سعة القاعة' : 'Occupancy'}</span>
            <span style={{ fontWeight: '700', color: occupancyPercent > 90 ? 'var(--danger)' : 'var(--primary)' }}>
              {cls.enrolledStudents} / {cls.capacity} ({occupancyPercent}%)
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: 'var(--border-subtle)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${occupancyPercent}%`,
              height: '100%',
              backgroundColor: occupancyPercent > 90 ? 'var(--danger)' : 'var(--primary)',
              borderRadius: '3px'
            }} />
          </div>
        </div>
      </div>

      {/* Join Code & Students Action */}
      <div style={{
        paddingTop: '16px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px'
      }}>
        <button
          onClick={onCopyCode}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px',
            fontWeight: '700',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
        >
          {copiedCode === cls.joinCode ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
          <span>{cls.joinCode}</span>
        </button>

        <button
          onClick={onViewRoster}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary-surface)',
            color: 'var(--primary)',
            border: 'none',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <span>{lang === 'ar' ? 'سجل الطلاب' : 'View Roster'}</span>
          <ArrowRight size={12} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
        </button>
      </div>
    </div>
  );
};
