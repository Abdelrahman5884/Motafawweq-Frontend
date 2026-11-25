import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

/**
 * Compact "?" help icon with an accessible hover/click popover tooltip.
 * Keeps dashboard headers short and clean while tucking explanations behind "?".
 */
export const InfoTooltip = ({
  text,
  light = false,
  align = 'start',
  size = 14,
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  if (!text) return null;

  const posStyle =
    align === 'end'
      ? { insetInlineEnd: 0 }
      : align === 'center'
        ? { left: '50%', transform: 'translateX(-50%)' }
        : { insetInlineStart: 0 };

  return (
    <span
      ref={wrapRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle',
        flexShrink: 0,
      }}
    >
      <button
        type="button"
        aria-label={text}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${size + 6}px`,
          height: `${size + 6}px`,
          padding: 0,
          borderRadius: '50%',
          border: 'none',
          backgroundColor: light ? 'rgba(255, 255, 255, 0.16)' : 'var(--bg-subtle)',
          color: light ? 'rgba(255, 255, 255, 0.92)' : 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'background-color 0.15s ease, color 0.15s ease',
        }}
      >
        <HelpCircle size={size} />
      </button>

      {open && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            ...posStyle,
            zIndex: 50,
            minWidth: '210px',
            maxWidth: '280px',
            padding: '9px 12px',
            borderRadius: '11px',
            backgroundColor: '#06254E',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: '600',
            lineHeight: 1.55,
            whiteSpace: 'normal',
            boxShadow: '0 10px 26px rgba(6, 37, 78, 0.28)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            pointerEvents: 'none',
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
};
