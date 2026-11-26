import React from 'react';

export const ParentEmptyState = ({ icon: Icon, title, subtitle, action }) => (
  <div style={{
    padding: '38px 20px',
    textAlign: 'center',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--bg-app)',
    border: '1px dashed var(--border-medium)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  }}>
    <div style={{
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      backgroundColor: 'rgba(21, 136, 199, 0.1)',
      color: 'var(--primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Icon size={20} />
    </div>
    <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)' }}>{title}</div>
    {subtitle && (
      <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.5 }}>
        {subtitle}
      </div>
    )}
    {action}
  </div>
);
