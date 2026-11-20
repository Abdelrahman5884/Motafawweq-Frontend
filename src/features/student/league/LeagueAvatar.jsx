import React, { useState } from 'react';

function getInitials(name) {
  const clean = String(name || '').trim();
  if (!clean) return 'ط';
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0] || ''}${parts[1][0] || ''}`;
}

export const LeagueAvatar = ({
  src,
  name,
  size = 42,
  borderColor = 'var(--border-subtle)',
  borderWidth = 2,
  accentBg = 'var(--primary-surface)',
  accentColor = 'var(--primary)',
  boxShadow = 'none',
}) => {
  const [failedSrc, setFailedSrc] = useState('');
  const showImage = Boolean(src && String(src).trim() && failedSrc !== src);

  if (showImage) {
    return (
      <img
        src={src}
        alt={name || ''}
        onError={() => setFailedSrc(src)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          border: `${borderWidth}px solid ${borderColor}`,
          boxShadow,
          flexShrink: 0,
          display: 'block',
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: accentBg,
        color: accentColor,
        border: `${borderWidth}px solid ${borderColor}`,
        boxShadow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '900',
        fontSize: `${Math.max(12, Math.round(size * 0.36))}px`,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {getInitials(name)}
    </div>
  );
};
