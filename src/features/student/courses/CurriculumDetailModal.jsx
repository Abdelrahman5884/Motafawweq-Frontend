import React, { useEffect } from 'react';
import {
  X,
  Check,
  ExternalLink,
  ClipboardCheck,
  Landmark,
  BookOpen,
} from 'lucide-react';

export const CurriculumDetailModal = ({
  item,
  lang = 'ar',
  isRtl = true,
  onClose,
  onToggleUnit,
  togglingUnitKey = '',
  onTakeMinistryExam,
}) => {
  const isAr = lang === 'ar';

  useEffect(() => {
    if (!item) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const units = Array.isArray(item.units) ? item.units : [];
  const progress = Math.min(100, Math.max(0, Number(item.progressPercent || 0)));

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: '22px',
          maxWidth: '580px',
          width: '100%',
          maxHeight: '88vh',
          overflowY: 'auto',
          padding: '26px',
          boxShadow: '0 24px 50px rgba(0, 0, 0, 0.22)',
          position: 'relative',
          direction: isRtl ? 'rtl' : 'ltr',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={isAr ? 'إغلاق' : 'Close'}
          style={{
            position: 'absolute',
            top: '18px',
            insetInlineEnd: '18px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={15} />
        </button>

        {/* Source Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11.5px',
            fontWeight: '800',
            color: '#059669',
            backgroundColor: 'rgba(5, 150, 105, 0.1)',
            padding: '4px 10px',
            borderRadius: '999px',
            marginBottom: '10px',
          }}
        >
          <Landmark size={13} />
          <span>{isAr ? item.sourceAr : item.sourceEn || item.sourceAr}</span>
        </div>

        <h3 style={{ fontSize: '19px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
          {isAr ? item.titleAr : item.titleEn || item.titleAr}
        </h3>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
          {isAr ? item.gradeSubtitleAr || item.gradeAr : item.gradeSubtitleEn || item.gradeAr}
        </p>

        {/* Overall Progress Bar */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '14px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              fontWeight: '800',
              color: 'var(--text-secondary)',
              marginBottom: '6px',
            }}
          >
            <span>
              {isAr
                ? `تقدمك في وحدات المنهج (${item.completedUnitsCount || 0} من ${units.length})`
                : `Curriculum Progress (${item.completedUnitsCount || 0} of ${units.length})`}
            </span>
            <span style={{ color: progress >= 100 ? '#059669' : 'var(--primary)' }}>{progress}%</span>
          </div>
          <div style={{ height: '7px', borderRadius: '99px', backgroundColor: 'var(--bg-surface)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: progress >= 100 ? '#059669' : 'var(--primary)',
                borderRadius: '99px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
            {isAr
              ? 'اضغط على أي وحدة لتسجيل إتمامها وحفظ تقدمك تلقائياً.'
              : 'Click any unit below to mark it completed and save your progress.'}
          </div>
        </div>

        {/* Interactive Official Units Checklist */}
        {units.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
            {units.map((unit) => {
              const busy = togglingUnitKey === `${item.code}:${unit.index}`;
              return (
                <button
                  key={unit.index}
                  type="button"
                  disabled={busy}
                  onClick={() => onToggleUnit?.(item.code, unit.index)}
                  style={{
                    width: '100%',
                    textAlign: 'inherit',
                    fontFamily: 'inherit',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    backgroundColor: unit.isCompleted
                      ? 'rgba(5, 150, 105, 0.08)'
                      : 'var(--bg-subtle)',
                    border: unit.isCompleted
                      ? '1.5px solid rgba(5, 150, 105, 0.4)'
                      : '1px solid var(--border-subtle)',
                    cursor: busy ? 'wait' : 'pointer',
                    opacity: busy ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      marginTop: '1px',
                      backgroundColor: unit.isCompleted ? '#059669' : 'var(--bg-surface)',
                      border: unit.isCompleted ? 'none' : '1.5px solid var(--border-medium)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {unit.isCompleted && <Check size={13} />}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '13.5px',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        textDecoration: unit.isCompleted ? 'line-through' : 'none',
                        opacity: unit.isCompleted ? 0.85 : 1,
                      }}
                    >
                      {isAr ? unit.titleAr : unit.titleEn || unit.titleAr}
                    </div>
                    {Array.isArray(unit.topics) && unit.topics.length > 0 && (
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          marginTop: '4px',
                          lineHeight: 1.5,
                        }}
                      >
                        {unit.topics.join(' • ')}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Footer Actions: Official Textbook Portal + Official Ministry Exam */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          {item.textbookUrl && (
            <a
              href={item.textbookUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 14px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontWeight: '700',
                fontSize: '12.5px',
                textDecoration: 'none',
              }}
            >
              <BookOpen size={14} />
              <span>{isAr ? 'بوابة كتب الوزارة الرسمية' : 'MOE Official Textbooks'}</span>
              <ExternalLink size={12} />
            </a>
          )}

          <div style={{ display: 'flex', gap: '8px', marginInlineStart: 'auto' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 14px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '12.5px',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>

            {item.examCode && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onTakeMinistryExam?.(item);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(5, 150, 105, 0.28)',
                }}
              >
                <ClipboardCheck size={15} />
                <span>{isAr ? 'ابدأ اختبار الوزارة الاسترشادي' : 'Take MOE Practice Exam'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
