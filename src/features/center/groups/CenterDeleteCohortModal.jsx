import React from 'react';
import { Trash2 } from 'lucide-react';

export const CenterDeleteCohortModal = ({
  cohort,
  enrolledCount = 0,
  onConfirm,
  onCancel,
  lang = 'ar',
}) => {
  if (!cohort) return null;
  const isAr = lang === 'ar';

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          maxWidth: '460px',
          width: '100%',
          padding: '24px',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--danger, #EF4444)',
              flexShrink: 0,
            }}
          >
            <Trash2 size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              {isAr ? 'تأكيد حذف المجموعة' : 'Confirm Delete Cohort'}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {cohort.nameAr} • {cohort.subjectAr}
            </span>
          </div>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
          {isAr
            ? `هل أنت متأكد من رغبتك في حذف المجموعة «${cohort.nameAr}» نهائياً من النظام؟`
            : `Are you sure you want to permanently delete cohort "${cohort.nameAr}"?`}
        </p>

        {enrolledCount > 0 && (
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: 'var(--danger, #EF4444)',
              fontSize: '12px',
              marginBottom: '16px',
              lineHeight: 1.5,
            }}
          >
            <strong>{isAr ? 'تحذير هام:' : 'Important Warning:'}</strong>{' '}
            {isAr
              ? `يوجد ${enrolledCount} طالب مقيد في هذه المجموعة. حذفها سيؤدي لإلغاء قيود الطلاب وسجلات الحضور المرتبطة بها.`
              : `There are ${enrolledCount} students currently enrolled in this cohort.`}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger, #EF4444)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'نعم، حذف المجموعة' : 'Yes, Delete Cohort'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '11px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};
