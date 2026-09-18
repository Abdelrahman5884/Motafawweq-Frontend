/**
 * Motafawweq — Student UI Design System
 * Shared reusable components for all Student pages.
 * Use these components consistently across every student view.
 */

import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
export const S = {
  // Colors
  primary: '#6C4BFF',
  primaryLight: '#F0EEFF',
  success: '#14B87A',
  successLight: '#EDFAF3',
  warning: '#F5A623',
  warningLight: '#FFF8EC',
  error: '#F25C5C',
  errorLight: '#FFF0F0',
  textPrimary: '#171725',
  textSecondary: '#77778A',
  border: '#E8E7F0',
  surface: '#FFFFFF',
  bg: '#F7F7FC',

  // Spacing
  sp: (n) => `${n * 4}px`,  // 4px base unit → sp(2)=8px, sp(3)=12px, sp(4)=16px, sp(6)=24px

  // Radius
  radius: {
    sm: '8px',    // badge, chip
    md: '12px',   // button, small card
    lg: '16px',   // card
    xl: '24px',   // large card / section
  }
};

// ─── PAGE WRAPPER ──────────────────────────────────────────────────────────────
export const SPage = ({ children, maxWidth = 1100 }) => (
  <div style={{
    maxWidth: `${maxWidth}px`,
    margin: '0 auto',
    padding: '28px 20px 64px',
    width: '100%',
    boxSizing: 'border-box'
  }}>
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
    border: `1.5px solid ${S.primary}28`,
    borderRadius: S.radius.xl,
    padding: '24px',
    boxShadow: `0 2px 12px ${S.primary}10`,
    ...style
  }}>
    {children}
  </div>
);

// ─── LIST ROW ──────────────────────────────────────────────────────────────────
export const SRowItem = ({ icon, title, subtitle, meta, badge, action, onClick, style = {} }) => {
  const isRtl = document.documentElement.dir === 'rtl';
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '10px',
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
          borderRadius: '8px',
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
    default: { bg: 'var(--bg-subtle)', color: 'var(--text-secondary)' },
    primary: { bg: S.primaryLight, color: S.primary },
    success: { bg: S.successLight, color: S.success },
    warning: { bg: S.warningLight, color: S.warning },
    error: { bg: S.errorLight, color: S.error },
    outline: { bg: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' },
  };
  const v = variants[variant] || variants.default;
  const fontSize = size === 'xs' ? '11px' : size === 'sm' ? '12px' : '13px';
  const padding = size === 'xs' ? '2px 6px' : size === 'sm' ? '3px 8px' : '4px 10px';

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
      fontWeight: '500',
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
    pending:   { label: 'لم يُحَل', variant: 'default' },
    in_progress: { label: 'جارٍ', variant: 'primary' },
    submitted:  { label: 'تم التسليم', variant: 'success' },
    graded:    { label: 'مُصحَّح', variant: 'success' },
    completed:  { label: 'مكتمل', variant: 'success' },
    upcoming:  { label: 'قادم', variant: 'warning' },
    ready:    { label: 'متاح', variant: 'primary' },
    locked:   { label: 'مقفول', variant: 'default' },
    overdue:  { label: 'منتهي', variant: 'error' },
  };
  const s = map[status] || { label: status, variant: 'default' };
  return <SBadge variant={s.variant} size="xs">{s.label}</SBadge>;
};

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
export const SProgress = ({ value, max = 100, label, showPercent = true, color, height = 6, style = {} }) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const barColor = color || S.primary;

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
      background: S.primary,
      color: '#fff',
      border: 'none',
      hoverBg: '#5939F0'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-subtle)',
      hoverBg: 'var(--bg-subtle)'
    },
    subtle: {
      background: S.primaryLight,
      color: S.primary,
      border: 'none',
      hoverBg: '#E4DFFF'
    },
    danger: {
      background: S.errorLight,
      color: S.error,
      border: 'none',
      hoverBg: '#FFE4E4'
    },
    success: {
      background: S.successLight,
      color: S.success,
      border: 'none',
      hoverBg: '#D4F5E7'
    },
  };

  const sizes = {
    sm: { padding: '7px 14px', fontSize: '13px', height: '34px' },
    md: { padding: '9px 18px', fontSize: '14px', height: '40px' },
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
        transition: 'background-color 0.15s ease, opacity 0.15s ease',
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
      color: S.primary,
      fontWeight: '500',
      textDecoration: 'none',
      cursor: 'pointer',
      ...style
    }}>{children}</a>
  ) : (
    <button onClick={onClick} style={{
      fontSize: '13px',
      color: S.primary,
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
          color: active === tab.id ? S.primary : 'var(--text-secondary)',
          background: 'none',
          border: 'none',
          borderBottom: active === tab.id ? `2px solid ${S.primary}` : '2px solid transparent',
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
            color: active === tab.id ? S.primary : 'var(--text-secondary)',
            backgroundColor: active === tab.id ? S.primaryLight : 'var(--bg-subtle)',
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

// ─── ICON WRAPPER ─────────────────────────────────────────────────────────────
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
