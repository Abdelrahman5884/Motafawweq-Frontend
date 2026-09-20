/**
 * Motafawweq — Common Button Component
 * Semantic variants: primary | ghost | subtle | danger | success | dark | warning
 * All colors via CSS variables — no hex duplication.
 */
import React from 'react';

const VARIANTS = {
  primary: {
    background: 'var(--primary)',
    color: 'var(--text-inverse)',
    border: 'none',
    shadow: '0 4px 14px var(--primary-glow)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-medium)',
    shadow: 'none',
  },
  subtle: {
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    border: 'none',
    shadow: 'none',
  },
  danger: {
    background: 'var(--error-light)',
    color: 'var(--danger)',
    border: 'none',
    shadow: 'none',
  },
  'danger-solid': {
    background: 'var(--danger)',
    color: 'var(--text-inverse)',
    border: 'none',
    shadow: '0 4px 14px rgba(220, 38, 38, 0.3)',
  },
  success: {
    background: 'var(--success-light)',
    color: 'var(--success)',
    border: 'none',
    shadow: 'none',
  },
  'success-solid': {
    background: 'var(--success)',
    color: 'var(--text-inverse)',
    border: 'none',
    shadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
  },
  warning: {
    background: 'var(--warning-light)',
    color: 'var(--warning)',
    border: 'none',
    shadow: 'none',
  },
  dark: {
    background: 'var(--deep-indigo)',
    color: 'var(--text-inverse)',
    border: 'none',
    shadow: '0 4px 14px rgba(6, 37, 78, 0.3)',
  },
};

const SIZES = {
  xs: { padding: '5px 10px',  fontSize: '12px', height: '28px', gap: '4px'  },
  sm: { padding: '7px 14px',  fontSize: '13px', height: '34px', gap: '5px'  },
  md: { padding: '9px 18px',  fontSize: '14px', height: '40px', gap: '6px'  },
  lg: { padding: '11px 24px', fontSize: '15px', height: '46px', gap: '8px'  },
  xl: { padding: '13px 28px', fontSize: '16px', height: '52px', gap: '8px'  },
};

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  iconEnd,
  disabled = false,
  fullWidth = false,
  loading = false,
  type = 'button',
  style = {},
  className = '',
  id,
}) => {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  const iconSize = size === 'xs' ? 12 : size === 'sm' ? 13 : size === 'lg' ? 16 : size === 'xl' ? 18 : 15;

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`motafawweq-btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        padding: s.padding,
        height: s.height,
        borderRadius: 'var(--radius-sm)',
        background: v.background,
        color: v.color,
        border: v.border || 'none',
        boxShadow: v.shadow,
        fontSize: s.fontSize,
        fontWeight: '700',
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        opacity: (disabled || loading) ? 0.6 : 1,
        transition: 'opacity 0.15s ease, filter 0.15s ease, transform 0.1s ease',
        width: fullWidth ? '100%' : undefined,
        fontFamily: 'var(--font-arabic)',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        userSelect: 'none',
        ...style,
      }}
      data-variant={variant}
    >
      {loading ? (
        <span style={{
          width: iconSize,
          height: iconSize,
          border: `2px solid currentColor`,
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
          flexShrink: 0,
        }} />
      ) : (
        icon && React.cloneElement(icon, { size: iconSize })
      )}
      {children}
      {!loading && iconEnd && React.cloneElement(iconEnd, { size: iconSize })}
    </button>
  );
};

export default Button;
