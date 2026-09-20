import React from 'react';

export const ChildSwitcher = ({ children, selectedChild, onSelectChild, lang }) => {
  return (
    <div style={{
      display: 'inline-flex',
      backgroundColor: 'var(--bg-subtle)',
      padding: '4px',
      borderRadius: 'var(--radius-full)',
      border: '1px solid var(--border-subtle)'
    }}>
      {children.map(child => (
        <button
          key={child.id}
          onClick={() => onSelectChild(child.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            backgroundColor: selectedChild === child.id ? 'var(--primary)' : 'transparent',
            color: selectedChild === child.id ? '#FFFFFF' : 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <img src={child.avatar} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
          <span>{lang === 'ar' ? child.nameAr.split(' ')[0] : child.name.split(' ')[0]}</span>
        </button>
      ))}
    </div>
  );
};
