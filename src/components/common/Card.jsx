/**
 * Motafawweq — Common Card Components
 * Card, PrimaryCard, StatCard
 */
import React from 'react';

// ─── Base Card ────────────────────────────────────────────────────────────────
export const Card = ({ children, style = {}, onClick, padding = 20, elevated = false, id }) => (
  <div
    id={id}
    onClick={onClick}
    style={{
      backgroundColor: elevated ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: `${padding}px`,
      boxShadow: elevated ? 'var(--shadow-sm)' : 'none',
      transition: onClick ? 'box-shadow 0.15s ease, border-color 0.15s ease, transform 0.1s ease' : undefined,
      cursor: onClick ? 'pointer' : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── Primary Card (brand accent border) ───────────────────────────────────────
export const PrimaryCard = ({ children, style = {}, id }) => (
  <div
    id={id}
    style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1.5px solid rgba(21, 136, 199, 0.18)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: '0 2px 12px rgba(21, 136, 199, 0.07)',
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
export const StatCard = ({
  icon,
  value,
  label,
  sublabel,
  trend,          // '+5%' or '-2%' — auto-colors
  color,          // overrides value color (CSS var string)
  accentBg = false,
  style = {},
  id,
}) => {
  const isPositive = trend && (trend.startsWith('+') || parseFloat(trend) > 0);
  const isNegative = trend && (trend.startsWith('-') || parseFloat(trend) < 0);
  const trendColor = isPositive ? 'var(--success)' : isNegative ? 'var(--danger)' : 'var(--text-secondary)';

  return (
    <div
      id={id}
      style={{
        backgroundColor: accentBg ? 'var(--primary-surface)' : 'var(--bg-surface)',
        border: `1px solid ${accentBg ? 'rgba(21, 136, 199, 0.2)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        ...style,
      }}
    >
      {icon && (
        <div style={{ color: color || 'var(--primary)', marginBottom: '6px' }}>
          {icon}
        </div>
      )}
      <div style={{
        fontSize: '22px',
        fontWeight: '800',
        color: color || (accentBg ? 'var(--primary)' : 'var(--text-primary)'),
        lineHeight: 1.2,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '12px',
        color: 'var(--text-secondary)',
        fontWeight: '500',
        fontFamily: 'var(--font-arabic)',
      }}>
        {label}
      </div>
      {sublabel && (
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {sublabel}
        </div>
      )}
      {trend && (
        <div style={{ fontSize: '12px', fontWeight: '700', color: trendColor, marginTop: '4px' }}>
          {trend}
        </div>
      )}
    </div>
  );
};

export default Card;
