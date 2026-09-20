/**
 * Motafawweq — Common EmptyState & Skeleton Components
 */
import React from 'react';

// ─── Empty State ───────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, description, action, compact = false, id }) => (
  <div
    id={id}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: compact ? '24px 16px' : '48px 24px',
      textAlign: 'center',
      gap: '12px',
    }}
  >
    {icon && (
      <div style={{
        width: compact ? '40px' : '52px',
        height: compact ? '40px' : '52px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        marginBottom: '4px',
      }}>
        {icon}
      </div>
    )}
    <div style={{
      fontSize: compact ? '14px' : '15px',
      fontWeight: '700',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-arabic)',
    }}>
      {title}
    </div>
    {description && (
      <div style={{
        fontSize: '13px',
        color: 'var(--text-secondary)',
        maxWidth: '280px',
        lineHeight: 1.6,
        fontFamily: 'var(--font-arabic)',
      }}>
        {description}
      </div>
    )}
    {action && <div style={{ marginTop: '8px' }}>{action}</div>}
  </div>
);

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
export const Skeleton = ({ width = '100%', height = 16, radius = 8, style = {} }) => (
  <div style={{
    width,
    height: `${height}px`,
    borderRadius: `${radius}px`,
    backgroundColor: 'var(--bg-subtle)',
    animation: 'sSkeleton 1.4s ease-in-out infinite',
    ...style,
  }} />
);

// ─── Skeleton Card (preset) ────────────────────────────────────────────────────
export const SkeletonCard = ({ lines = 3 }) => (
  <div style={{
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  }}>
    <Skeleton height={18} width="60%" />
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} height={12} width={i === lines - 1 ? '40%' : '100%'} />
    ))}
  </div>
);

export default EmptyState;
