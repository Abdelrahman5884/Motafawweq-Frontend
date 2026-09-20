/**
 * Motafawweq — Common Input Component
 * Text input with label, helper text, and error state.
 */
import React from 'react';

export const Input = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  helperText,
  icon,
  iconEnd,
  disabled = false,
  required = false,
  style = {},
  inputStyle = {},
}) => {
  const hasError = Boolean(error);
  const borderColor = hasError ? 'var(--danger)' : 'var(--border-medium)';
  const focusBorderColor = hasError ? 'var(--danger)' : 'var(--primary)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-arabic)',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--danger)', marginInlineStart: '3px' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            insetInlineStart: '12px',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
          }}>
            {React.cloneElement(icon, { size: 16 })}
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={{
            width: '100%',
            height: '42px',
            padding: `10px ${iconEnd ? '38px' : '14px'} 10px ${icon ? '38px' : '14px'}`,
            borderRadius: 'var(--radius-sm)',
            border: `1px solid ${borderColor}`,
            backgroundColor: disabled ? 'var(--bg-subtle)' : 'var(--bg-surface)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontFamily: 'var(--font-arabic)',
            outline: 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            cursor: disabled ? 'not-allowed' : 'text',
            opacity: disabled ? 0.7 : 1,
            boxSizing: 'border-box',
            ...inputStyle,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = focusBorderColor;
            e.target.style.boxShadow = hasError
              ? '0 0 0 3px rgba(220, 38, 38, 0.12)'
              : '0 0 0 3px rgba(21, 136, 199, 0.12)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = borderColor;
            e.target.style.boxShadow = 'none';
          }}
        />
        {iconEnd && (
          <div style={{
            position: 'absolute',
            insetInlineEnd: '12px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
          }}>
            {React.cloneElement(iconEnd, { size: 16 })}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p style={{
          fontSize: '12px',
          color: hasError ? 'var(--danger)' : 'var(--text-secondary)',
          margin: 0,
          fontFamily: 'var(--font-arabic)',
        }}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
