/**
 * Motafawweq — Common ProgressBar Component
 */
import React from 'react';

export const ProgressBar = ({
  value,
  max = 100,
  label,
  showPercent = true,
  color,        // CSS var string or omit for primary
  height = 6,
  style = {},
  id,
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const barColor = color || 'var(--primary)';

  return (
    <div id={id} style={{ ...style }}>
      {(label || showPercent) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '6px',
        }}>
          {label && (
            <span style={{
              fontSize: '13px',
              color: 'var(--text-primary)',
              fontWeight: '500',
              fontFamily: 'var(--font-arabic)',
            }}>
              {label}
            </span>
          )}
          {showPercent && (
            <span style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              fontWeight: '600',
            }}>
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div style={{
        height: `${height}px`,
        backgroundColor: 'var(--border-subtle)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          backgroundColor: barColor,
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />
      </div>
    </div>
  );
};

export default ProgressBar;
