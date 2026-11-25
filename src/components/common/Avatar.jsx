/**
 * Motafawweq — Common Avatar Component
 * WhatsApp-style image avatar with deterministic 2-letter initials fallback.
 */
import React, { useState } from 'react';
import { getInitials, getAvatarColor } from '../../utils';

const SIZE_MAP = {
  xs:  24,
  sm:  32,
  md:  40,
  lg:  52,
  xl:  64,
  '2xl': 80,
};

const normalizeAvatarUrl = (raw) => {
  if (typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  // Rewrite default Laravel APP_URL without port (http://localhost/storage/...) to relative /storage/... so Vite proxy or backend resolves it
  return trimmed.replace(/^https?:\/\/(localhost|127\.0\.0\.1)\/storage\//i, '/storage/');
};

export const Avatar = ({
  src,
  name = '',
  size = 'md',
  radius = '50%',
  border = 'none',
  boxShadow = 'none',
  style = {},
  id,
  online,
  onClick,
  title,
}) => {
  const [failedSrc, setFailedSrc] = useState('');
  const px = typeof size === 'number' ? size : (SIZE_MAP[size] || SIZE_MAP.md);
  const cleanSrc = normalizeAvatarUrl(src);
  const showImage = Boolean(cleanSrc) && failedSrc !== cleanSrc;
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);
  const fontSize = `${Math.max(11, Math.round(px * 0.35))}px`;

  return (
    <div
      id={id}
      onClick={onClick}
      title={title}
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexShrink: 0,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      <div
        style={{
          width: `${px}px`,
          height: `${px}px`,
          borderRadius: radius,
          backgroundColor: showImage ? 'var(--bg-subtle)' : bgColor,
          border,
          boxShadow,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          userSelect: 'none',
        }}
      >
        {showImage ? (
          <img
            src={cleanSrc}
            alt={name || 'Avatar'}
            onError={() => setFailedSrc(cleanSrc)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <span
            aria-label={name || 'Avatar'}
            style={{
              fontSize,
              fontWeight: '800',
              color: '#FFFFFF',
              fontFamily: 'var(--font-arabic), var(--font-heading), sans-serif',
              lineHeight: 1,
              letterSpacing: /[\u0600-\u06FF]/.test(initials) ? '0' : '0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            {initials}
          </span>
        )}
      </div>
      {online !== undefined && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            insetInlineEnd: 0,
            width: `${Math.max(8, Math.round(px * 0.26))}px`,
            height: `${Math.max(8, Math.round(px * 0.26))}px`,
            borderRadius: '50%',
            backgroundColor: online ? 'var(--success)' : 'var(--text-muted)',
            border: '2px solid var(--bg-surface)',
          }}
        />
      )}
    </div>
  );
};

export default Avatar;
