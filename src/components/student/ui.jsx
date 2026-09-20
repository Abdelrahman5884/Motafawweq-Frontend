/**
 * Motafawweq — Student UI Design System
 * Shared reusable components for all Student pages.
 * Use these components consistently across every student view.
 *
 * IMPORTANT: NO hardcoded hex values allowed here.
 * All colors reference CSS variables defined in src/index.css (single source of truth).
 */

import React from 'react';
import { ChevronLeft } from 'lucide-react';

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// JavaScript token bridge — exposes CSS variable names only. No hex duplication.
export const S = {
  // Spacing helper: 4px base unit → sp(2)=8px, sp(3)=12px, sp(4)=16px, sp(6)=24px
  sp: (n) => `${n * 4}px`,

  // Radius scale
  radius: {
    sm: 'var(--radius-xs)',   // 6px  — badge, chip
    md: 'var(--radius-sm)',   // 10px — button, small card
    lg: 'var(--radius-md)',   // 14px — card
    xl: 'var(--radius-lg)',   // 20px — large card / section
  },

  // Named semantic color CSS variables (no hex duplication)
  color: {
    primary:        'var(--primary)',
    primaryLight:   'var(--primary-light)',
    primarySurface: 'var(--primary-surface)',
    brandDark:      'var(--deep-indigo)',
    brandLight:     'var(--accent-cyan)',
    success:        'var(--success)',
    successLight:   'var(--success-light)',
    warning:        'var(--warning)',
    warningLight:   'var(--warning-light)',
    error:          'var(--error)',
    errorLight:     'var(--error-light)',
    textPrimary:    'var(--text-primary)',
    textSecondary:  'var(--text-secondary)',
    textMuted:      'var(--text-muted)',
    surface:        'var(--bg-surface)',
    bg:             'var(--bg-app)',
    subtle:         'var(--bg-subtle)',
    border:         'var(--border-subtle)',
    borderMedium:   'var(--border-medium)',
  }
};

// ─── PAGE WRAPPER ──────────────────────────────────────────────────────────────
export const SPage = ({ children, maxWidth = 1100 }) => (
  <div
    className="s-page-wrapper"
    style={{
      maxWidth: `${maxWidth}px`,
      margin: '0 auto',
      padding: '24px 20px 64px',
      width: '100%',
      boxSizing: 'border-box'
    }}
  >
    {children}
  </div>
);

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────
export const SPageHeader = ({ title, subtitle, action }) => (
  <div style={{
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '24px',
    gap: '16px',
    flexWrap: 'wrap'
  }}>
    <div>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: 'var(--text-primary)',
        margin: 0,
        lineHeight: 1.3,
        fontFamily: 'var(--font-arabic)'
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          margin: '4px 0 0 0',
          fontWeight: '400'
        }}>
          {subtitle}
        </p>
      )}
    </div>
    {action && <div style={{ flexShrink: 0 }}>{action}</div>}
  </div>
);

// ─── SECTION ──────────────────────────────────────────────────────────────────
export const SSection = ({ title, action, children, gap = 12, style = {} }) => (
  <div style={{ marginBottom: '32px', ...style }}>
    {(title || action) && (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
        gap: '12px'
      }}>
        {title && (
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0,
            fontFamily: 'var(--font-arabic)'
          }}>
            {title}
          </h2>
        )}
        {action && (
          <div style={{ flexShrink: 0 }}>{action}</div>
        )}
      </div>
    )}
    <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
      {children}
    </div>
  </div>
);

// ─── CARD ──────────────────────────────────────────────────────────────────────
export const SCard = ({ children, style = {}, onClick, padding = 20 }) => (
  <div
    onClick={onClick}
    style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: S.radius.lg,
      padding: `${padding}px`,
      transition: onClick ? 'box-shadow 0.15s ease, border-color 0.15s ease' : undefined,
      cursor: onClick ? 'pointer' : undefined,
      ...style
    }}
    className={onClick ? 's-card-clickable' : undefined}
  >
    {children}
  </div>
);

// ─── PRIMARY LEARNING CARD (larger, bordered) ─────────────────────────────────
export const SPrimaryCard = ({ children, style = {} }) => (
  <div style={{
    backgroundColor: 'var(--bg-surface)',
    border: '1.5px solid rgba(21, 136, 199, 0.16)',
    borderRadius: S.radius.xl,
    padding: '24px',
    boxShadow: '0 2px 12px rgba(21, 136, 199, 0.06)',
    ...style
  }}>
    {children}
  </div>
);

// ─── LIST ROW ──────────────────────────────────────────────────────────────────
export const SRowItem = ({ icon, title, subtitle, meta, badge, action, onClick, style = {} }) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: S.radius.md,
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        cursor: onClick ? 'pointer' : undefined,
        transition: onClick ? 'border-color 0.15s ease' : undefined,
        ...style
      }}
      className={onClick ? 's-row-clickable' : undefined}
    >
      {icon && (
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: S.radius.sm,
          backgroundColor: 'var(--bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: 'var(--text-secondary)'
        }}>
          {icon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--text-primary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-arabic)'
        }}>
          {title}
        </div>
        {subtitle && (
          <div style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginTop: '2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {subtitle}
          </div>
        )}
      </div>
      {meta && (
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', flexShrink: 0 }}>
          {meta}
        </div>
      )}
      {badge && <div style={{ flexShrink: 0 }}>{badge}</div>}
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      {onClick && !action && (
        <ChevronLeft size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
      )}
    </div>
  );
};

// ─── BADGE ─────────────────────────────────────────────────────────────────────
export const SBadge = ({ children, variant = 'default', size = 'sm' }) => {
  const variants = {
    default: { bg: 'var(--bg-subtle)',       color: 'var(--text-secondary)' },
    primary: { bg: 'var(--primary-light)',    color: 'var(--primary)' },
    success: { bg: 'var(--success-light)',    color: 'var(--success)' },
    warning: { bg: 'var(--warning-light)',    color: 'var(--warning)' },
    error:   { bg: 'var(--error-light)',      color: 'var(--error)' },
    danger:  { bg: 'var(--error-light)',      color: 'var(--danger)' },
    outline: { bg: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' },
  };
  const v = variants[variant] || variants.default;
  const fontSize = size === 'xs' ? '11px' : size === 'sm' ? '12px' : '13px';
  const padding  = size === 'xs' ? '2px 6px' : size === 'sm' ? '3px 8px' : '4px 10px';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding,
      borderRadius: S.radius.sm,
      backgroundColor: v.bg,
      color: v.color,
      fontSize,
      fontWeight: '600',
      border: v.border || 'none',
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
      fontFamily: 'var(--font-arabic)'
    }}>
      {children}
    </span>
  );
};

// ─── STATUS BADGE ──────────────────────────────────────────────────────────────
export const SStatusBadge = ({ status }) => {
  const map = {
    pending:     { label: 'لم يُحَل',    variant: 'default' },
    in_progress: { label: 'جارٍ',        variant: 'primary' },
    submitted:   { label: 'تم التسليم', variant: 'success' },
    graded:      { label: 'مُصحَّح',    variant: 'success' },
    completed:   { label: 'مكتمل',      variant: 'success' },
    upcoming:    { label: 'قادم',        variant: 'warning' },
    ready:       { label: 'متاح',        variant: 'primary' },
    locked:      { label: 'مقفول',       variant: 'default' },
    overdue:     { label: 'منتهي',       variant: 'error'   },
  };
  const s = map[status] || { label: status, variant: 'default' };
  return <SBadge variant={s.variant} size="xs">{s.label}</SBadge>;
};

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
export const SProgress = ({ value, max = 100, label, showPercent = true, color, height = 6, style = {} }) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const barColor = color || 'var(--primary)';

  return (
    <div style={{ ...style }}>
      {(label || showPercent) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '6px'
        }}>
          {label && (
            <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500', fontFamily: 'var(--font-arabic)' }}>
              {label}
            </span>
          )}
          {showPercent && (
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div style={{
        height: `${height}px`,
        backgroundColor: 'var(--border-subtle)',
        borderRadius: '99px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          backgroundColor: barColor,
          borderRadius: '99px',
          transition: 'width 0.4s ease'
        }} />
      </div>
    </div>
  );
};

// ─── BUTTON ────────────────────────────────────────────────────────────────────
export const SButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  iconEnd,
  disabled = false,
  fullWidth = false,
  type = 'button',
  style = {}
}) => {
  const variants = {
    primary: {
      background: 'var(--primary)',
      color: 'var(--text-inverse)',
      border: 'none',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-medium)',
    },
    subtle: {
      background: 'var(--primary-light)',
      color: 'var(--primary)',
      border: 'none',
    },
    danger: {
      background: 'var(--error-light)',
      color: 'var(--danger)',
      border: 'none',
    },
    success: {
      background: 'var(--success-light)',
      color: 'var(--success)',
      border: 'none',
    },
    dark: {
      background: 'var(--deep-indigo)',
      color: 'var(--text-inverse)',
      border: 'none',
    },
  };

  const sizes = {
    sm: { padding: '7px 14px',  fontSize: '13px', height: '34px' },
    md: { padding: '9px 18px',  fontSize: '14px', height: '40px' },
    lg: { padding: '11px 24px', fontSize: '15px', height: '46px' },
  };

  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: s.padding,
        height: s.height,
        borderRadius: S.radius.md,
        background: v.background,
        color: v.color,
        border: v.border || 'none',
        fontSize: s.fontSize,
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        transition: 'opacity 0.15s ease, filter 0.15s ease',
        width: fullWidth ? '100%' : undefined,
        fontFamily: 'var(--font-arabic)',
        whiteSpace: 'nowrap',
        ...style
      }}
      className="s-btn"
      data-variant={variant}
    >
      {icon && React.cloneElement(icon, { size: parseInt(s.fontSize) - 1 || 15 })}
      {children}
      {iconEnd && React.cloneElement(iconEnd, { size: parseInt(s.fontSize) - 1 || 15 })}
    </button>
  );
};

// ─── TEXT LINK BUTTON ─────────────────────────────────────────────────────────
export const STextLink = ({ children, onClick, href, style = {} }) => (
  href ? (
    <a href={href} style={{
      fontSize: '13px',
      color: 'var(--primary)',
      fontWeight: '500',
      textDecoration: 'none',
      cursor: 'pointer',
      ...style
    }}>{children}</a>
  ) : (
    <button onClick={onClick} style={{
      fontSize: '13px',
      color: 'var(--primary)',
      fontWeight: '500',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      fontFamily: 'var(--font-arabic)',
      ...style
    }}>{children}</button>
  )
);

// ─── STAT BLOCK ───────────────────────────────────────────────────────────────
export const SStatBlock = ({ icon, value, label, color, style = {} }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    ...style
  }}>
    {icon && (
      <div style={{ color: color || 'var(--text-secondary)', marginBottom: '2px' }}>
        {icon}
      </div>
    )}
    <div style={{
      fontSize: '20px',
      fontWeight: '700',
      color: color || 'var(--text-primary)',
      lineHeight: 1.2
    }}>
      {value}
    </div>
    <div style={{
      fontSize: '12px',
      color: 'var(--text-secondary)',
      fontWeight: '400',
      fontFamily: 'var(--font-arabic)'
    }}>
      {label}
    </div>
  </div>
);

// ─── DIVIDER ──────────────────────────────────────────────────────────────────
export const SDivider = ({ style = {} }) => (
  <div style={{
    height: '1px',
    backgroundColor: 'var(--border-subtle)',
    margin: '0',
    ...style
  }} />
);

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
export const SEmptyState = ({ icon, title, description, action }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center',
    gap: '12px'
  }}>
    {icon && (
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '14px',
        backgroundColor: 'var(--bg-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        marginBottom: '4px'
      }}>
        {icon}
      </div>
    )}
    <div style={{
      fontSize: '15px',
      fontWeight: '600',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-arabic)'
    }}>
      {title}
    </div>
    {description && (
      <div style={{
        fontSize: '13px',
        color: 'var(--text-secondary)',
        maxWidth: '280px',
        lineHeight: 1.6,
        fontFamily: 'var(--font-arabic)'
      }}>
        {description}
      </div>
    )}
    {action && <div style={{ marginTop: '8px' }}>{action}</div>}
  </div>
);

// ─── SKELETON LOADER ──────────────────────────────────────────────────────────
export const SSkeleton = ({ width = '100%', height = 16, radius = 8, style = {} }) => (
  <div style={{
    width,
    height: `${height}px`,
    borderRadius: `${radius}px`,
    backgroundColor: 'var(--border-subtle)',
    animation: 'sSkeleton 1.4s ease-in-out infinite',
    ...style
  }} />
);

// ─── TABS ─────────────────────────────────────────────────────────────────────
export const STabs = ({ tabs, active, onChange, style = {} }) => (
  <div style={{
    display: 'flex',
    gap: '4px',
    borderBottom: '1px solid var(--border-subtle)',
    ...style
  }}>
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        style={{
          padding: '10px 16px',
          fontSize: '13px',
          fontWeight: active === tab.id ? '600' : '400',
          color: active === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
          background: 'none',
          border: 'none',
          borderBottom: active === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
          cursor: 'pointer',
          marginBottom: '-1px',
          transition: 'color 0.15s ease, border-color 0.15s ease',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-arabic)'
        }}
      >
        {tab.label}
        {tab.count !== undefined && (
          <span style={{
            marginInlineStart: '6px',
            fontSize: '11px',
            color: active === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
            backgroundColor: active === tab.id ? 'var(--primary-light)' : 'var(--bg-subtle)',
            padding: '1px 6px',
            borderRadius: '99px'
          }}>
            {tab.count}
          </span>
        )}
      </button>
    ))}
  </div>
);

// ─── ICON BOX ─────────────────────────────────────────────────────────────────
export const SIconBox = ({ icon, size = 36, color, bg, radius = 8, style = {} }) => (
  <div style={{
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: `${radius}px`,
    backgroundColor: bg || 'var(--bg-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color || 'var(--text-secondary)',
    flexShrink: 0,
    ...style
  }}>
    {icon}
  </div>
);

// ─── MODAL OVERLAY ────────────────────────────────────────────────────────────
export const SModal = ({ children, onClose, maxWidth = 520 }) => (
  <div
    onClick={onClose}
    style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(6px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-medium)',
        borderRadius: S.radius.xl,
        maxWidth: `${maxWidth}px`,
        width: '100%',
        padding: '28px',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      {children}
    </div>
  </div>
);

// ─── INFO CALLOUT ─────────────────────────────────────────────────────────────
export const SCallout = ({ icon, title, description, variant = 'primary', style = {} }) => {
  const variantMap = {
    primary: { border: 'rgba(21, 136, 199, 0.3)',  bg: 'var(--primary-surface)',  color: 'var(--primary)' },
    success: { border: 'rgba(22, 163, 74, 0.3)',   bg: 'var(--success-light)',    color: 'var(--success)' },
    warning: { border: 'rgba(245, 158, 11, 0.35)', bg: 'var(--warning-light)',    color: 'var(--warning)' },
    error:   { border: 'rgba(220, 38, 38, 0.3)',   bg: 'var(--error-light)',      color: 'var(--error)' },
  };
  const v = variantMap[variant] || variantMap.primary;

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      padding: '14px 18px',
      borderRadius: S.radius.md,
      backgroundColor: v.bg,
      border: `1px solid ${v.border}`,
      ...style
    }}>
      {icon && (
        <div style={{ color: v.color, flexShrink: 0, marginTop: '1px' }}>{icon}</div>
      )}
      <div>
        {title && (
          <div style={{ fontSize: '13.5px', fontWeight: '700', color: v.color, marginBottom: description ? '3px' : 0 }}>
            {title}
          </div>
        )}
        {description && (
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

