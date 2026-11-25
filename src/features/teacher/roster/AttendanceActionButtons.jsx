import React, { memo } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const INACTIVE_STYLE = {
  backgroundColor: 'transparent',
  border: '1px solid var(--border-medium)',
  color: 'var(--text-secondary)',
  boxShadow: 'none',
};

const PRESENT_ACTIVE_STYLE = {
  backgroundColor: '#10B981',
  border: '1px solid #10B981',
  color: '#FFFFFF',
  boxShadow: '0 2px 10px rgba(16, 185, 129, 0.35)',
};

const ABSENT_ACTIVE_STYLE = {
  backgroundColor: '#EF4444',
  border: '1px solid #EF4444',
  color: '#FFFFFF',
  boxShadow: '0 2px 10px rgba(239, 68, 68, 0.35)',
};

export const AttendanceActionButtons = memo(function AttendanceActionButtons({
  isPresent = false,
  isAbsent = false,
  busy = null,
  isAr = true,
  fullWidth = false,
  onMark,
}) {
  const baseBtnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: fullWidth ? '7px 10px' : '5px 10px',
    borderRadius: '8px',
    fontSize: fullWidth ? '12px' : '11.5px',
    fontWeight: '800',
    cursor: busy ? 'wait' : 'pointer',
    transition: 'background-color 0.16s ease, color 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease',
  };

  return (
    <div
      style={
        fullWidth
          ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }
          : { display: 'inline-flex', alignItems: 'center', gap: '6px' }
      }
    >
      <button
        type="button"
        disabled={Boolean(busy)}
        aria-pressed={isPresent}
        onClick={() => {
          if (!isPresent) onMark('present');
        }}
        title={isAr ? 'تسجيل حضور' : 'Mark Present'}
        style={{
          ...baseBtnStyle,
          ...(isPresent ? PRESENT_ACTIVE_STYLE : INACTIVE_STYLE),
        }}
      >
        {busy === 'present' ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
        <span>{isAr ? 'حاضر' : 'Present'}</span>
      </button>

      <button
        type="button"
        disabled={Boolean(busy)}
        aria-pressed={isAbsent}
        onClick={() => {
          if (!isAbsent) onMark('absent');
        }}
        title={isAr ? 'تسجيل غياب' : 'Mark Absent'}
        style={{
          ...baseBtnStyle,
          ...(isAbsent ? ABSENT_ACTIVE_STYLE : INACTIVE_STYLE),
        }}
      >
        {busy === 'absent' ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
        <span>{isAr ? 'غائب' : 'Absent'}</span>
      </button>
    </div>
  );
});
