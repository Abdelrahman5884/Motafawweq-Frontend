import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';

export const TeacherWelcomeBanner = ({ currentUser, lang }) => {
  const isAr = lang === 'ar';
  const currentDateFormatted = new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      padding: '20px 24px',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-xs)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2.5px solid var(--primary)'
            }}
          />
          <span style={{
            position: 'absolute',
            bottom: '2px',
            right: isAr ? '2px' : 'auto',
            left: isAr ? 'auto' : '2px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            border: '2px solid var(--bg-surface-elevated)'
          }} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: '0 0 2px 0',
              fontFamily: 'var(--font-heading), var(--font-arabic)'
            }}>
              {isAr ? `مرحباً بكِ، ${currentUser.nameAr || currentUser.name}` : `Welcome back, ${currentUser.name}`}
            </h1>
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(0, 102, 204, 0.1)',
              color: 'var(--primary)'
            }}>
              {isAr ? 'حساب المعلم المعتمد' : 'Verified Educator'}
            </span>
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            {isAr ? currentUser.roleLabelAr : currentUser.roleLabel} • {currentUser.center}
          </div>
        </div>
      </div>

      {/* Date & live indicator */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: 'var(--text-muted)',
        backgroundColor: 'var(--bg-subtle)',
        padding: '6px 12px',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)'
      }}>
        <Calendar size={13} color="var(--primary)" />
        <span>{currentDateFormatted}</span>
      </div>
    </div>
  );
};

