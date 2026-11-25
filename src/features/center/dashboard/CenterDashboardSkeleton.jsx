import React from 'react';

/**
 * Accessible loading placeholder matching the executive Center dashboard grid.
 */
export const CenterDashboardSkeleton = () => (
  <div
    className="center-dashboard-container executive-dashboard"
    aria-busy="true"
    aria-label="Loading center dashboard"
  >
    <div
      className="executive-skeleton"
      style={{
        height: '104px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
      }}
    />

    <div className="executive-kpi-grid">
      {[1, 2, 3, 4].map((idx) => (
        <div
          key={idx}
          className="executive-skeleton"
          style={{
            height: '148px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}
        />
      ))}
    </div>

    <div className="executive-charts-grid">
      <div
        className="executive-chart-main executive-skeleton"
        style={{
          height: '360px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
        }}
      />
      <div
        className="executive-chart-side executive-skeleton"
        style={{
          height: '360px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
        }}
      />
    </div>

    <div
      className="executive-skeleton"
      style={{
        height: '240px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
      }}
    />
  </div>
);
