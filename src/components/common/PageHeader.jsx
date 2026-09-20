/**
 * Motafawweq — Common PageHeader & PageWrapper
 */
import React from 'react';

// ─── Page Wrapper ─────────────────────────────────────────────────────────────
export const PageWrapper = ({ children, maxWidth = 1100, id }) => (
  <div
    id={id}
    style={{
      maxWidth: `${maxWidth}px`,
      margin: '0 auto',
      padding: '24px 20px 64px',
      width: '100%',
      boxSizing: 'border-box',
    }}
  >
    {children}
  </div>
);

// ─── Page Header ──────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, action, breadcrumb, id }) => (
  <div
    id={id}
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '24px',
      gap: '16px',
      flexWrap: 'wrap',
    }}
  >
    <div>
      {breadcrumb && (
        <div style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginBottom: '4px',
          fontFamily: 'var(--font-arabic)',
        }}>
          {breadcrumb}
        </div>
      )}
      <h1 style={{
        fontSize: '24px',
        fontWeight: '800',
        color: 'var(--text-primary)',
        margin: 0,
        lineHeight: 1.3,
        fontFamily: 'var(--font-arabic)',
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          margin: '4px 0 0 0',
          fontWeight: '400',
          lineHeight: 1.5,
        }}>
          {subtitle}
        </p>
      )}
    </div>
    {action && (
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
        {action}
      </div>
    )}
  </div>
);

// ─── Section ──────────────────────────────────────────────────────────────────
export const Section = ({ title, action, children, gap = 12, style = {}, id }) => (
  <div id={id} style={{ marginBottom: '32px', ...style }}>
    {(title || action) && (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
        gap: '12px',
      }}>
        {title && (
          <h2 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: 0,
            fontFamily: 'var(--font-arabic)',
          }}>
            {title}
          </h2>
        )}
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
    )}
    <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
      {children}
    </div>
  </div>
);

// ─── Divider ──────────────────────────────────────────────────────────────────
export const Divider = ({ style = {} }) => (
  <div style={{
    height: '1px',
    backgroundColor: 'var(--border-subtle)',
    ...style,
  }} />
);

export default PageHeader;
