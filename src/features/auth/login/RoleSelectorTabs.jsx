import React from 'react';

export const RoleSelectorTabs = ({ roleOptions, selectedRole, onRoleChange }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '6px',
      backgroundColor: 'var(--bg-subtle)',
      padding: '4px',
      borderRadius: 'var(--radius-md)',
      marginBottom: '22px'
    }}>
      {roleOptions.map((item) => {
        const IconComp = item.icon;
        const isSelected = selectedRole === item.id;
        return (
          <button
            type="button"
            key={item.id}
            onClick={() => onRoleChange(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 4px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: isSelected ? 'var(--bg-surface)' : 'transparent',
              color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: isSelected ? 'var(--shadow-xs)' : 'none',
              cursor: 'pointer',
              fontWeight: isSelected ? '700' : '500',
              fontSize: '11.5px',
              transition: 'all 0.2s ease'
            }}
          >
            <IconComp size={16} color={isSelected ? 'var(--primary)' : 'currentColor'} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
