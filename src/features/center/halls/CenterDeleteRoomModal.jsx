import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { doesGroupMatchRoom } from './centerHallsUtils';

export const CenterDeleteRoomModal = ({
  room,
  groups = [],
  onConfirm,
  onCancel,
  lang = 'ar',
}) => {
  if (!room) return null;
  const isAr = lang === 'ar';

  const activeCohorts = groups.filter((g) => doesGroupMatchRoom(g, room));

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
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
          maxWidth: '440px',
          width: '100%',
          padding: '24px',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--danger, #EF4444)',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              {isAr ? 'تأكيد حذف القاعة الدراسية' : 'Confirm Delete Room'}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {room.nameAr} • {room.branchNameAr || (isAr ? 'الفرع الرئيسي' : 'Main Branch')}
            </span>
          </div>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
          {isAr
            ? `هل أنت متأكد من رغبتك في حذف القاعة «${room.nameAr}» نهائياً؟`
            : `Are you sure you want to permanently delete room "${room.nameAr}"?`}
        </p>

        {activeCohorts.length > 0 && (
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: 'var(--warning, #D97706)',
              fontSize: '12px',
              marginBottom: '16px',
              lineHeight: 1.5,
            }}
          >
            <strong>{isAr ? 'تنبيه هام:' : 'Warning:'}</strong>{' '}
            {isAr
              ? `هناك ${activeCohorts.length} مجموعة دراسية مرتبطة حالياً بهذه القاعة. حذفها سيؤدي لفك ارتباط تلك المجموعات من هذه القاعة.`
              : `There are ${activeCohorts.length} cohorts currently assigned to this room.`}
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
            {isAr ? 'نعم، حذف القاعة' : 'Yes, Delete Room'}
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
