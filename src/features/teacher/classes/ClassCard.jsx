import React from 'react';
import {
  QrCode,
  Calendar,
  MapPin,
  Coins,
  Check,
  Copy,
  ArrowRight,
  BookOpen,
  Edit2,
  Trash2,
  Users
} from 'lucide-react';

export const ClassCard = ({
  cls,
  lang,
  isRtl,
  copiedCode,
  enrolledCount = 0,
  pendingCount = 0,
  onOpenQr,
  onCopyCode,
  onViewRoster,
  onEdit,
  onDelete
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '18px',
        padding: '22px',
        boxShadow: 'var(--shadow-xs)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '16px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px var(--primary-glow)';
        e.currentTarget.style.borderColor = 'rgba(21, 136, 199, 0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      <div>
        {/* Top Badges & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '11.5px',
              fontWeight: '800',
              padding: '3px 10px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-surface)',
              color: 'var(--primary)',
              border: '1px solid rgba(21, 136, 199, 0.2)'
            }}>
              {lang === 'ar' ? (cls.gradeAr || 'الصف الثالث الثانوي') : (cls.gradeEn || cls.grade || 'Grade 12')}
            </span>

            {/* Enrolled Badge */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: '700',
              padding: '3px 8px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)'
            }}>
              <Users size={12} color="var(--primary)" />
              <span>{enrolledCount} {lang === 'ar' ? 'طالب' : 'Students'}</span>
            </span>

            {/* Pending Requests Badge if any */}
            {pendingCount > 0 && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: '800',
                padding: '3px 8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(21, 136, 199, 0.12)',
                color: 'var(--primary)',
                border: '1px solid rgba(21, 136, 199, 0.3)'
              }}>
                <span>{pendingCount} {lang === 'ar' ? 'طلب جديد' : 'Pending'}</span>
              </span>
            )}
          </div>

          {/* Quick Edit & Delete Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={onEdit}
              title={lang === 'ar' ? 'تعديل بيانات المجموعة' : 'Edit Cohort'}
              style={{
                border: 'none',
                background: 'var(--bg-subtle)',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-surface)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
            >
              <Edit2 size={14} />
            </button>

            <button
              onClick={onDelete}
              title={lang === 'ar' ? 'حذف المجموعة' : 'Delete Cohort'}
              style={{
                border: 'none',
                background: 'var(--bg-subtle)',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.color = '#EF4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Group Name & Subject Name */}
        <h3 style={{
          fontSize: '17px',
          fontWeight: '900',
          color: 'var(--text-primary)',
          margin: '0 0 6px 0',
          lineHeight: 1.35
        }}>
          {lang === 'ar' ? cls.nameAr : cls.nameEn || cls.name}
        </h3>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '8px',
          backgroundColor: 'var(--primary-surface)',
          border: '1px solid rgba(21, 136, 199, 0.15)',
          color: 'var(--primary)',
          fontSize: '12px',
          fontWeight: '800',
          marginBottom: '14px'
        }}>
          <BookOpen size={13} />
          <span>{lang === 'ar' ? (cls.subjectAr || 'الأحياء') : (cls.subjectEn || cls.subject || 'Biology')}</span>
        </div>

        {/* Details: Schedule, Center Location, Price */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Calendar size={14} color="var(--primary)" />
            <span style={{ fontWeight: '600' }}>{lang === 'ar' ? cls.scheduleAr : cls.scheduleEn || cls.schedule}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <MapPin size={14} color="var(--primary)" />
            <span style={{ fontWeight: '600' }}>{cls.centerName}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Coins size={14} color="var(--primary)" />
            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
              {cls.priceEgp} {lang === 'ar' ? 'ج.م / شهرياً' : 'EGP / mo'}
            </span>
          </div>
        </div>
      </div>

      {/* Join Code, QR & Roster Actions */}
      <div style={{
        paddingTop: '14px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        {/* Join Code Button */}
        <button
          onClick={onCopyCode}
          title={lang === 'ar' ? 'نسخ كود الانضمام' : 'Copy Join Code'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px',
            fontWeight: '800',
            fontFamily: 'monospace',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {copiedCode === cls.joinCode ? <Check size={13} color="var(--primary)" /> : <Copy size={13} />}
          <span>{cls.joinCode}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* QR Button */}
          <button
            onClick={onOpenQr}
            title={lang === 'ar' ? 'عرض الباركود الحقيقي للمجموعة' : 'View Real QR Code'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-surface)';
              e.currentTarget.style.color = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
          >
            <QrCode size={14} />
            <span>{lang === 'ar' ? 'الباركود' : 'QR Code'}</span>
          </button>

          {/* Roster Button */}
          <button
            onClick={onViewRoster}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 2px 8px var(--primary-glow)',
              transition: 'opacity 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <span>{lang === 'ar' ? 'سجل الطلاب' : 'View Roster'}</span>
            <ArrowRight size={13} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
          </button>
        </div>
      </div>
    </div>
  );
};
