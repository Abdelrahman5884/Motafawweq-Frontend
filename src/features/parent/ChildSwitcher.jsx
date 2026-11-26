import React from 'react';
import { UserPlus } from 'lucide-react';
import { ParentAvatar } from './ParentAvatar';

export const ChildSwitcher = ({ students = [], selectedChild, onSelectChild, lang, onLinkNewChild }) => {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      backgroundColor: 'var(--bg-subtle)',
      padding: '4px',
      borderRadius: 'var(--radius-full)',
      border: '1px solid var(--border-subtle)',
      gap: '4px',
      flexWrap: 'wrap',
    }}>
      {students.map((child) => {
        const isActive = Number(selectedChild) === Number(child.id);
        const displayName = (lang === 'ar' ? (child.nameAr || child.name) : (child.name || child.nameAr)) || '';
        const firstName = displayName.trim().split(/\s+/)[0] || displayName;
        const gradeBadge = lang === 'ar'
          ? (child.gradeShortAr || child.gradeAr || 'طالب')
          : (child.gradeShortEn || child.grade || 'Student');

        return (
          <button
            key={child.id}
            type="button"
            onClick={() => onSelectChild(child.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 14px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <ParentAvatar src={child.avatar} name={displayName} size={22} inverted={isActive} />
            <span>{firstName}</span>
            <span style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '99px',
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.22)' : 'var(--bg-app)',
              color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: '600',
            }}>
              {gradeBadge}
            </span>
          </button>
        );
      })}

      {onLinkNewChild && (
        <button
          type="button"
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
            transition: 'all 0.15s ease',
          }}
        >
          <UserPlus size={14} />
          <span>{lang === 'ar' ? 'ربط طالب +' : 'Link +'}</span>
        </button>
      )}
    </div>
  );
};
