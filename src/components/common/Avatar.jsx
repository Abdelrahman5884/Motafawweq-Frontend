/**
 * Motafawweq — Common Avatar Component
 * Image avatar with initials fallback
 */
import React from 'react';

const getInitials = (name = '') =>
  name.trim().split(' ').slice(0, 2).map((w) => w[0]).join('');

const SIZE_MAP = {
  xs:  { size: 24, fontSize: '10px' },
  sm:  { size: 32, fontSize: '12px' },
  md:  { size: 40, fontSize: '14px' },
  lg:  { size: 52, fontSize: '18px' },
  xl:  { size: 64, fontSize: '22px' },
  '2xl': { size: 80, fontSize: '28px' },
};

export const Avatar = ({
  src,
  name,
  size = 'md',
  style = {},
  id,
  online,
}) => {
  const s = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div
      id={id}
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexShrink: 0,
        ...style,
      }}
    >
      <div style={{
        width: `${s.size}px`,
        height: `${s.size}px`,
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--primary-surface)',
        border: '2px solid var(--border-medium)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {src ? (
          <img
            src={src}
            alt={name || 'Avatar'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{
            fontSize: s.fontSize,
            fontWeight: '700',
            color: 'var(--primary)',
            fontFamily: 'var(--font-arabic)',
            lineHeight: 1,
          }}>
            {getInitials(name)}
          </span>
        )}
      </div>
      {online !== undefined && (
        <span style={{
          position: 'absolute',
          bottom: 0,
          insetInlineEnd: 0,
          width: `${s.size * 0.28}px`,
          height: `${s.size * 0.28}px`,
          borderRadius: '50%',
          backgroundColor: online ? 'var(--success)' : 'var(--text-muted)',
          border: '2px solid var(--bg-surface)',
        }} />
      )}
    </div>
  );
};

export default Avatar;
