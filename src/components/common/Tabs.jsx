/**
 * Motafawweq — Common Tabs Components
 * Underline tabs (STabs style) + Segmented pill tabs
 */
import React from 'react';

// ─── Underline Tabs ────────────────────────────────────────────────────────────
export const Tabs = ({ tabs, active, onChange, style = {}, id }) => (
  <div
    id={id}
    style={{
      display: 'flex',
      gap: '4px',
      borderBottom: '1px solid var(--border-subtle)',
      overflowX: 'auto',
      ...style,
    }}
  >
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        style={{
          padding: '10px 16px',
          fontSize: '13px',
          fontWeight: active === tab.id ? '700' : '400',
          color: active === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
          background: 'none',
          border: 'none',
          borderBottom: active === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
          cursor: 'pointer',
          marginBottom: '-1px',
          transition: 'color 0.15s ease, border-color 0.15s ease',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-arabic)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {tab.icon && React.cloneElement(tab.icon, { size: 14 })}
        {tab.label}
        {tab.count !== undefined && (
          <span style={{
            fontSize: '11px',
            color: active === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
            backgroundColor: active === tab.id ? 'var(--primary-light)' : 'var(--bg-subtle)',
            padding: '1px 6px',
            borderRadius: '99px',
          }}>
            {tab.count}
          </span>
        )}
      </button>
    ))}
  </div>
);

// ─── Segmented / Pill Tabs ─────────────────────────────────────────────────────
export const SegmentedTabs = ({ tabs, active, onChange, style = {}, id }) => (
  <div
    id={id}
    style={{
      display: 'inline-flex',
      backgroundColor: 'var(--bg-surface)',
      padding: '4px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-medium)',
      gap: '2px',
      ...style,
    }}
  >
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '7px 14px',
          borderRadius: 'var(--radius-sm)',
          border: 'none',
          backgroundColor: active === tab.id ? 'var(--primary)' : 'transparent',
          color: active === tab.id ? 'var(--text-inverse)' : 'var(--text-secondary)',
          fontSize: '12.5px',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-arabic)',
        }}
      >
        {tab.icon && React.cloneElement(tab.icon, { size: 13 })}
        {tab.label}
      </button>
    ))}
  </div>
);

export default Tabs;
