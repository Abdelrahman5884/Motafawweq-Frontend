import React from 'react';
import { Clock } from 'lucide-react';
import { formatTime12h } from './queueUtils';

/**
 * Renders a localized time range pill for a scheduled cohort queue slot.
 */
export const RenderQueueTimeRange = ({
  startTime,
  endTime,
  isAr = true,
  accentColor = 'var(--primary)',
  compact = false,
}) => {
  const startLabel = formatTime12h(startTime, isAr);
  const endLabel = formatTime12h(endTime, isAr);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: compact ? '3px 8px' : '5px 10px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'rgba(21, 136, 199, 0.1)',
        color: accentColor,
        fontSize: compact ? '11px' : '12px',
        fontWeight: '800',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <Clock size={compact ? 11 : 13} />
      <span>{startLabel} — {endLabel}</span>
    </span>
  );
};
