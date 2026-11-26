import React from 'react';

const getInitials = (name) => {
  const cleaned = String(name || '').trim();
  if (!cleaned) return 'ط';
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
};

export const ParentAvatar = ({
  src,
  name,
  size = 40,
  border = 'none',
  fontSize,
  inverted = false,
}) => {
  const resolvedFontSize = fontSize || Math.max(10, Math.round(size * 0.38));

  if (src) {
    return (
      <img
        src={src}
        alt={name || ''}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          border,
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        border,
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${resolvedFontSize}px`,
        fontWeight: 800,
        backgroundColor: inverted ? 'rgba(255,255,255,0.22)' : 'rgba(21, 136, 199, 0.14)',
        color: inverted ? '#FFFFFF' : 'var(--primary)',
        letterSpacing: '0.02em',
      }}
    >
      {getInitials(name)}
    </span>
  );
};
