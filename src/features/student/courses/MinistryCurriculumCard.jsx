import React from 'react';
import { BookOpen, Layers, FileText, ClipboardCheck, Landmark, Award } from 'lucide-react';

export const MinistryCurriculumCard = ({ item, lang = 'ar', onOpenModal, onTakeMinistryExam }) => {
  const isAr = lang === 'ar';
  const progress = Math.min(100, Math.max(0, Number(item.progressPercent || 0)));

  return (
    <div
      className="clean-course-card"
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderTop: '3px solid #059669',
        borderRadius: '20px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-xs)',
        minWidth: 0,
      }}
    >
      <div>
        {/* Top Row: Subject & Official MOE Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              fontSize: '12px',
              fontWeight: '700',
              padding: '3px 10px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {isAr ? item.subjectAr : item.subjectEn || item.subjectAr}
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: '800',
              backgroundColor: 'rgba(5, 150, 105, 0.1)',
              color: '#059669',
              padding: '3px 9px',
              borderRadius: '999px',
            }}
          >
            <Landmark size={12} />
            <span>{isAr ? 'وزارة التربية والتعليم' : 'Ministry of Education'}</span>
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '16.5px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 4px 0',
            lineHeight: 1.45,
          }}
        >
          {isAr ? item.titleAr : item.titleEn || item.titleAr}
        </h3>

        {/* Grade & Track */}
        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginBottom: '12px',
          }}
        >
          {isAr ? item.gradeSubtitleAr || item.gradeAr : item.gradeSubtitleEn || item.gradeAr}
        </div>

        {/* Current Active Unit */}
        {item.activeUnitAr && (
          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              padding: '10px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              color: 'var(--text-primary)',
              marginBottom: '14px',
              lineHeight: 1.45,
            }}
          >
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '2px' }}>
              {progress >= 100
                ? isAr
                  ? 'أتممت جميع الوحدات:'
                  : 'All units completed:'
                : isAr
                  ? 'الوحدة الحالية:'
                  : 'Current Unit:'}
            </div>
            <strong>{isAr ? item.activeUnitAr : item.activeUnitEn || item.activeUnitAr}</strong>
          </div>
        )}

        {/* Persisted Unit Progress Bar */}
        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11.5px',
              fontWeight: '700',
              color: 'var(--text-secondary)',
              marginBottom: '6px',
            }}
          >
            <span>
              {isAr
                ? `إنجاز المنهج (${item.completedUnitsCount || 0} / ${item.unitsCount || 0} وحدات)`
                : `Progress (${item.completedUnitsCount || 0}/${item.unitsCount || 0} units)`}
            </span>
            <strong style={{ color: progress >= 100 ? '#059669' : 'var(--primary)' }}>
              {progress}%
            </strong>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-subtle)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                borderRadius: '6px',
                backgroundColor: progress >= 100 ? '#059669' : 'var(--primary)',
                transition: 'width 0.35s ease',
              }}
            />
          </div>
        </div>

        {/* Specs & Best Exam Score */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginBottom: '16px',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Layers size={13} color="var(--text-muted)" />
            {item.unitsCount} {isAr ? 'وحدات' : 'units'}
          </span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <FileText size={13} color="var(--text-muted)" />
            {item.chaptersCount} {isAr ? 'فصل' : 'chapters'}
          </span>
          {item.examBestPercentage !== null && item.examBestPercentage !== undefined && (
            <>
              <span>•</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#059669',
                  fontWeight: '800',
                }}
              >
                <Award size={13} />
                {isAr ? `أعلى درجة: ${Math.round(item.examBestPercentage)}%` : `Best: ${Math.round(item.examBestPercentage)}%`}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => onOpenModal?.(item)}
          className="clean-btn"
          style={{
            flex: '1 1 130px',
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '12.5px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(21, 136, 199, 0.25)',
          }}
        >
          <BookOpen size={14} />
          <span>{isAr ? 'الوحدات وكتاب الوزارة' : 'Units & Textbook'}</span>
        </button>

        {item.examCode && (
          <button
            type="button"
            onClick={() => onTakeMinistryExam?.(item)}
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              backgroundColor: 'rgba(5, 150, 105, 0.1)',
              border: '1px solid rgba(5, 150, 105, 0.3)',
              color: '#059669',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              whiteSpace: 'nowrap',
            }}
          >
            <ClipboardCheck size={14} />
            <span>{isAr ? 'اختبار الوزارة' : 'MOE Exam'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
