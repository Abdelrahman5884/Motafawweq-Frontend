import React from 'react';

export const TeacherWelcomeBanner = ({ currentUser, lang }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px 28px',
      marginBottom: '32px',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid var(--primary-light)'
          }}
        />
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
            {lang === 'ar' ? `مرحباً بكِ، ${currentUser.nameAr}` : `Welcome back, ${currentUser.name}`}
          </h1>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {lang === 'ar' ? currentUser.roleLabelAr : currentUser.roleLabel} • {currentUser.center}
          </div>
        </div>
      </div>
    </div>
  );
};
