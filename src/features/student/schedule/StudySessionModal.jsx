import React, { useEffect, useMemo } from 'react';
import { BookOpen, AlertCircle, Check, Clock, X } from 'lucide-react';
import {
  DAYS_CONFIG,
  STUDY_COLOR_PRESETS,
  parseTimeToMinutes,
  formatDurationLabel,
} from './scheduleUtils';

export const StudySessionModal = ({
  isOpen,
  isEditing,
  formState,
  onChange,
  availableSubjects,
  conflictError,
  serverError,
  isSaving,
  isAr,
  onSubmit,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const currentSubject = formState?.subject || '';
  const startTimeVal = formState?.startTime || '';
  const endTimeVal = formState?.endTime || '';

  const subjectOptions = useMemo(() => {
    const base = Array.isArray(availableSubjects) ? availableSubjects : [];
    if (currentSubject && !base.includes(currentSubject)) {
      return [currentSubject, ...base];
    }
    return base;
  }, [availableSubjects, currentSubject]);

  const durationMinutes = useMemo(() => {
    const start = parseTimeToMinutes(startTimeVal);
    const end = parseTimeToMinutes(endTimeVal);
    return start >= 0 && end > start ? end - start : 0;
  }, [startTimeVal, endTimeVal]);

  if (!isOpen) return null;

  const trimmedTitle = (formState.title || '').trim();
  const titleTooShort = trimmedTitle.length > 0 && trimmedTitle.length < 2;
  const canSubmit = trimmedTitle.length >= 2 && !conflictError && !isSaving;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="study-session-modal-title"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 25, 53, 0.72)',
        backdropFilter: 'blur(6px)',
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          padding: '24px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 24px 60px rgba(4, 25, 53, 0.35)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
            paddingBottom: '14px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '11px',
                backgroundColor: `${formState.color || '#1588C7'}1A`,
                color: formState.color || '#1588C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <BookOpen size={19} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3
                id="study-session-modal-title"
                style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}
              >
                {isEditing
                  ? (isAr ? 'تعديل جلسة المذاكرة' : 'Edit Study Session')
                  : (isAr ? 'إضافة جلسة مذاكرة جديدة' : 'Add Self-Study Session')}
              </h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                {isAr
                  ? 'يتم التحقق تلقائياً من عدم تعارض الموعد مع حصص السنتر وجلساتك'
                  : 'Automatically checked against center classes & study sessions'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Subject */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                marginBottom: '5px',
              }}
            >
              {isAr ? 'المادة الدراسية' : 'Subject'} *
            </label>
            <select
              value={formState.subject}
              onChange={(e) => onChange({ ...formState, subject: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '700',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            >
              {subjectOptions.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* Title / Goal */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {isAr ? 'موضوع الجلسة والهدف' : 'Topic & Goal'} *
              </label>
              <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {(formState.title || '').length}/200
              </span>
            </div>
            <input
              type="text"
              required
              minLength={2}
              maxLength={200}
              placeholder={isAr ? 'مثال: مراجعة الباب الثاني وحل 30 سؤالاً' : 'e.g. Review Chapter 2 & solve 30 questions'}
              value={formState.title}
              onChange={(e) => onChange({ ...formState, title: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                border: titleTooShort ? '1px solid #DC2626' : '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            {titleTooShort && (
              <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: '700', display: 'block', marginTop: '4px' }}>
                {isAr ? 'يجب أن يكون الموضوع حرفين على الأقل.' : 'Topic must be at least 2 characters.'}
              </span>
            )}
          </div>

          {/* Day + Time */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                marginBottom: '5px',
              }}
            >
              {isAr ? 'يوم المذاكرة' : 'Day of Week'} *
            </label>
            <select
              value={formState.day}
              onChange={(e) => onChange({ ...formState, day: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '700',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            >
              {DAYS_CONFIG.map((d) => (
                <option key={d.key} value={d.key}>
                  {isAr ? d.ar : d.en}
                </option>
              ))}
            </select>
          </div>

          {/* Start & End Time + Duration Pill */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {isAr ? 'توقيت الجلسة' : 'Session Time'} *
              </span>
              {durationMinutes > 0 && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    backgroundColor: 'var(--primary-surface)',
                    padding: '2px 8px',
                    borderRadius: '999px',
                  }}
                >
                  <Clock size={11} />
                  {formatDurationLabel(durationMinutes, isAr)}
                </span>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  {isAr ? 'من الساعة' : 'Start Time'}
                </label>
                <input
                  type="time"
                  required
                  value={formState.startTime}
                  onChange={(e) => onChange({ ...formState, startTime: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  {isAr ? 'إلى الساعة' : 'End Time'}
                </label>
                <input
                  type="time"
                  required
                  value={formState.endTime}
                  onChange={(e) => onChange({ ...formState, endTime: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Color Accent Picker */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                marginBottom: '6px',
              }}
            >
              {isAr ? 'لون البطاقة في الجدول' : 'Card Color'}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {STUDY_COLOR_PRESETS.map((preset) => {
                const isActive = (formState.color || '#1588C7').toUpperCase() === preset.hex.toUpperCase();
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => onChange({ ...formState, color: preset.hex })}
                    title={isAr ? preset.labelAr : preset.labelEn}
                    aria-label={isAr ? preset.labelAr : preset.labelEn}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '999px',
                      backgroundColor: preset.hex,
                      border: isActive ? '2.5px solid var(--text-primary)' : '2px solid transparent',
                      boxShadow: isActive ? `0 0 0 2px var(--bg-surface), 0 0 0 4px ${preset.hex}` : 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease',
                    }}
                  >
                    {isActive && <Check size={14} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {isAr ? 'ملاحظات إضافية (اختياري)' : 'Additional Notes (Optional)'}
              </label>
              <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {(formState.notes || '').length}/500
              </span>
            </div>
            <input
              type="text"
              maxLength={500}
              placeholder={isAr ? 'مثال: التركيز على المسائل المقالية وتطبيقات الرسم البياني' : 'e.g. Focus on essay questions'}
              value={formState.notes || ''}
              onChange={(e) => onChange({ ...formState, notes: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Validation / Conflict / Server Error */}
          {(conflictError || serverError) && (
            <div
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid rgba(220, 38, 38, 0.35)',
                color: '#DC2626',
                fontSize: '12px',
                fontWeight: '700',
                lineHeight: 1.5,
                overflowWrap: 'anywhere',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>{conflictError || serverError}</span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                padding: '9px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: canSubmit ? 'var(--primary)' : 'var(--text-muted)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                opacity: canSubmit ? 1 : 0.6,
              }}
            >
              {isSaving
                ? (isAr ? 'جاري الحفظ...' : 'Saving...')
                : isEditing
                  ? (isAr ? 'حفظ التعديلات' : 'Save Changes')
                  : (isAr ? 'تأكيد الإضافة للجدول' : 'Add to Schedule')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
