import React from 'react';
import { UserPlus } from 'lucide-react';

export const ChildSwitcher = ({ children, selectedChild, onSelectChild, lang, onLinkNewChild }) => {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      backgroundColor: 'var(--bg-subtle)',
      padding: '4px',
      borderRadius: 'var(--radius-full)',
      border: '1px solid var(--border-subtle)',
      gap: '4px',
      flexWrap: 'wrap'
    }}>
      {children.map(child => (
        <button
          key={child.id}
          onClick={() => onSelectChild(child.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 14px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            backgroundColor: selectedChild === child.id ? 'var(--primary)' : 'transparent',
            color: selectedChild === child.id ? '#FFFFFF' : 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <img src={child.avatar} alt="" style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
          <span>{lang === 'ar' ? child.nameAr.split(' ')[0] : child.name.split(' ')[0]}</span>
          <span style={{
            fontSize: '10px',
            padding: '1px 6px',
            borderRadius: '99px',
            backgroundColor: selectedChild === child.id ? 'rgba(255, 255, 255, 0.22)' : 'var(--bg-app)',
            color: selectedChild === child.id ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: '600'
          }}>
            {child.id === 'child-omar' ? (lang === 'ar' ? '3 ثانوي' : 'Grade 12') : (lang === 'ar' ? '1 إعدادي' : 'Grade 7')}
          </span>
        </button>
      ))}

      {onLinkNewChild && (
        <button
          onClick={onLinkNewChild}
          title={lang === 'ar' ? 'ربط ابن أو طالب إضافي' : 'Link another student'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: 'var(--radius-full)',
            border: '1px dashed var(--border-medium)',
            backgroundColor: 'transparent',
            color: 'var(--primary)',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <UserPlus size={14} />
          <span>{lang === 'ar' ? 'ربط طالب +' : 'Link +'}</span>
        </button>
      )}
    </div>
  );
};
