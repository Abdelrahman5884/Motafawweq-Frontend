import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const RegisterRoleCards = ({ roleCards, selectedRole, onSelectRole }) => {
  return (
    <div>
      <div className="auth-roles-grid">
        {roleCards.map((rc) => {
          const IconC = rc.icon;
          const isSelected = selectedRole === rc.id;
          return (
            <div
              key={rc.id}
              onClick={() => onSelectRole(rc.id)}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                border: isSelected ? `2px solid ${rc.color}` : '1px solid var(--border-subtle)',
                backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '12.5px', color: isSelected ? rc.color : 'var(--text-primary)' }}>
                  <IconC size={16} color={rc.color} />
                  {rc.title}
                </div>
                {isSelected && <CheckCircle2 size={15} color={rc.color} />}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                {rc.subtitle}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
