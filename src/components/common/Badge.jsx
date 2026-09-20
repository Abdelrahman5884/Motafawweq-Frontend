/**
 * Motafawweq — Common Badge & Status Components
 * Badge, StatusBadge — semantic variants via CSS variables
 */
import React from 'react';

const BADGE_VARIANTS = {
  default: { bg: 'var(--bg-subtle)',      color: 'var(--text-secondary)',  border: 'none' },
  primary: { bg: 'var(--primary-light)',   color: 'var(--primary)',         border: 'none' },
  success: { bg: 'var(--success-light)',   color: 'var(--success)',         border: 'none' },
  warning: { bg: 'var(--warning-light)',   color: 'var(--warning)',         border: 'none' },
  danger:  { bg: 'var(--error-light)',     color: 'var(--danger)',          border: 'none' },
  error:   { bg: 'var(--error-light)',     color: 'var(--error)',           border: 'none' },
  outline: { bg: 'transparent',           color: 'var(--text-secondary)',  border: '1px solid var(--border-subtle)' },
  dark:    { bg: 'var(--deep-indigo)',     color: 'var(--text-inverse)',    border: 'none' },
};

const BADGE_SIZES = {
  xs: { fontSize: '10px', padding: '2px 6px',   borderRadius: 'var(--radius-xs)' },
  sm: { fontSize: '11px', padding: '3px 8px',   borderRadius: 'var(--radius-xs)' },
  md: { fontSize: '12px', padding: '4px 10px',  borderRadius: 'var(--radius-sm)' },
  lg: { fontSize: '13px', padding: '5px 12px',  borderRadius: 'var(--radius-sm)' },
};

export const Badge = ({ children, variant = 'default', size = 'sm', icon, style = {}, id }) => {
  const v = BADGE_VARIANTS[variant] || BADGE_VARIANTS.default;
  const s = BADGE_SIZES[size] || BADGE_SIZES.sm;

  return (
    <span
      id={id}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: s.padding,
        borderRadius: s.borderRadius,
        backgroundColor: v.bg,
        color: v.color,
        fontSize: s.fontSize,
        fontWeight: '700',
        border: v.border,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        fontFamily: 'var(--font-arabic)',
        ...style,
      }}
    >
      {icon && React.cloneElement(icon, { size: 11 })}
      {children}
    </span>
  );
};

// ─── Status Badge ──────────────────────────────────────────────────────────────
const STATUS_MAP = {
  pending:     { label: 'لم يُحَل',    labelEn: 'Pending',      variant: 'default' },
  in_progress: { label: 'جارٍ',        labelEn: 'In Progress',  variant: 'primary' },
  submitted:   { label: 'تم التسليم', labelEn: 'Submitted',    variant: 'success' },
  graded:      { label: 'مُصحَّح',    labelEn: 'Graded',       variant: 'success' },
  completed:   { label: 'مكتمل',      labelEn: 'Completed',    variant: 'success' },
  upcoming:    { label: 'قادم',        labelEn: 'Upcoming',     variant: 'warning' },
  ready:       { label: 'متاح',        labelEn: 'Available',    variant: 'primary' },
  locked:      { label: 'مقفول',       labelEn: 'Locked',       variant: 'default' },
  overdue:     { label: 'منتهي',       labelEn: 'Overdue',      variant: 'danger'  },
  active:      { label: 'نشط',         labelEn: 'Active',       variant: 'success' },
  inactive:    { label: 'غير نشط',    labelEn: 'Inactive',     variant: 'default' },
};

export const StatusBadge = ({ status, lang = 'ar', size = 'xs', id }) => {
  const s = STATUS_MAP[status] || { label: status, labelEn: status, variant: 'default' };
  return (
    <Badge id={id} variant={s.variant} size={size}>
      {lang === 'ar' ? s.label : s.labelEn}
    </Badge>
  );
};

export default Badge;
