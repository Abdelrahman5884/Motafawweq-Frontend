import React from 'react';
import { Play, Layers, FileText } from 'lucide-react';

export const MinistryCurriculumCard = ({ item, lang, onContinue, onOpenModal }) => {
  return (
    <div
      className="clean-course-card"
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      <div>
        {/* Top Row: Subject & Source */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <span style={{
            fontSize: '12px',
            fontWeight: '700',
            padding: '3px 10px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)'
          }}>
            {item.subjectAr}
          </span>

          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            color: '#059669',
            padding: '3px 8px',
            borderRadius: '6px'
          }}>
            معتمد وزارياً
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '17px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          margin: '0 0 6px 0',
          lineHeight: 1.45
        }}>
          {item.titleAr}
        </h3>

        {/* Grade Track */}
        <div style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginBottom: '14px'
        }}>
          {item.gradeAr}
        </div>

        {/* Current Unit */}
        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          padding: '10px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          color: 'var(--text-primary)',
          marginBottom: '16px',
          lineHeight: 1.4
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '2px' }}>الوحدة الحالية:</div>
          <strong>{item.activeUnitAr}</strong>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            fontWeight: '700',
            color: 'var(--text-secondary)',
            marginBottom: '6px'
          }}>
            <span>إنجاز المنهج الدراسي</span>
            <strong style={{ color: 'var(--text-primary)' }}>{item.progressPercent}%</strong>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-subtle)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${item.progressPercent}%`,
              height: '100%',
              borderRadius: '6px',
              backgroundColor: 'var(--primary)',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        {/* Curriculum Specs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginBottom: '18px'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Layers size={13} color="var(--text-muted)" />
            {item.unitsCount} وحدات
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FileText size={13} color="var(--text-muted)" />
            {item.chaptersCount} درساً
          </span>
          <span>•</span>
          <span>بنك أسئلة الوزارة</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onContinue}
          className="clean-btn"
          style={{
            flex: 1,
            padding: '11px 16px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(21, 136, 199, 0.25)'
          }}
        >
          <Play size={14} fill="#FFFFFF" />
          <span>{lang === 'ar' ? 'متابعة المذاكرة' : 'Continue'}</span>
        </button>

        <button
          onClick={() => onOpenModal(item)}
          style={{
            padding: '11px 14px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          {lang === 'ar' ? 'كتاب الوزارة' : 'Textbook'}
        </button>
      </div>
    </div>
  );
};
