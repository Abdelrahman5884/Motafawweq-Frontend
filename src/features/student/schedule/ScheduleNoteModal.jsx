import React, { useEffect } from 'react';
import { StickyNote, AlertCircle, X } from 'lucide-react';
import { DAYS_CONFIG, NOTE_PRIORITIES } from './scheduleUtils';

export const ScheduleNoteModal = ({
  isOpen,
  isEditing,
  formState,
  onChange,
  serverError,
  isSaving,
  isAr,
  isDark,
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

  if (!isOpen) return null;

  const canSubmit = (formState.text || '').trim().length > 0 && !isSaving;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-note-modal-title"
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
          maxWidth: '460px',
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
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <StickyNote size={19} />
            </div>
            <h3
              id="schedule-note-modal-title"
              style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}
            >
              {isEditing
                ? (isAr ? 'تعديل الملحوظة اليومية' : 'Edit Daily Note')
                : (isAr ? 'إضافة ملحوظة أو مهمة يومية' : 'Add Daily Note')}
            </h3>
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
          {/* Day selector */}
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
              {isAr ? 'اليوم' : 'Day'} *
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

          {/* Note Text */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {isAr ? 'نص الملحوظة / المهمة' : 'Note Content'} *
              </label>
              <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)' }}>
                {(formState.text || '').length}/500
              </span>
            </div>
            <textarea
              required
              rows={3}
              maxLength={500}
              placeholder={isAr ? 'مثال: طباعة ملزمة البلاغة ومراجعة 10 تدريبات قبل الحصة' : 'Write your task or reminder here...'}
              value={formState.text}
              onChange={(e) => onChange({ ...formState, text: e.target.value })}
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
                resize: 'vertical',
                minHeight: '84px',
              }}
            />
          </div>

          {/* Time (optional) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {isAr ? 'وقت التذكير (اختياري)' : 'Reminder Time (Optional)'}
              </label>
              {formState.time && (
                <button
                  type="button"
                  onClick={() => onChange({ ...formState, time: '' })}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {isAr ? 'مسح الوقت' : 'Clear time'}
                </button>
              )}
            </div>
            <input
              type="time"
              value={formState.time || ''}
              onChange={(e) => onChange({ ...formState, time: e.target.value })}
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

          {/* Priority Pills */}
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
              {isAr ? 'مستوى الأولوية' : 'Priority'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {['low', 'medium', 'high'].map((level) => {
                const meta = NOTE_PRIORITIES[level];
                const isActive = formState.priority === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => onChange({ ...formState, priority: level })}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: `1.5px solid ${isActive ? meta.color : 'var(--border-subtle)'}`,
                      backgroundColor: isActive
                        ? (isDark ? meta.bgDark : meta.bgLight)
                        : 'var(--bg-subtle)',
                      color: isActive ? meta.color : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {isAr ? meta.labelAr : meta.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Server Error */}
          {serverError && (
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
              <span>{serverError}</span>
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
                  : (isAr ? 'حفظ الملحوظة' : 'Save Note')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
