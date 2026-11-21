import React, { useState } from 'react';
import { getInitials, getAvatarColor } from '../../../utils';

export const LeagueAvatar = ({
  src,
  name,
  size = 42,
  borderColor = 'var(--border-subtle)',
  borderWidth = 2,
  accentBg,
  accentColor = '#FFFFFF',
  boxShadow = 'none',
}) => {
  const [failedSrc, setFailedSrc] = useState('');
  const cleanSrc = typeof src === 'string' ? src.trim() : '';
  const showImage = Boolean(cleanSrc && failedSrc !== cleanSrc);

  if (showImage) {
    return (
      <img
        src={cleanSrc}
        alt={name || ''}
        onError={() => setFailedSrc(cleanSrc)}
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
        backgroundColor: accentBg || getAvatarColor(name),
        color: accentBg ? accentColor : '#FFFFFF',
        border: `${borderWidth}px solid ${borderColor}`,
        boxShadow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '800',
        fontSize: `${Math.max(12, Math.round(size * 0.35))}px`,
        flexShrink: 0,
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {getInitials(name)}
    </div>
  );
};
