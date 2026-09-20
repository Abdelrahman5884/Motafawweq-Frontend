import React from 'react';
import { Trophy, Award, Flame, Target, Shield, Brain, Lock } from 'lucide-react';
import { STUDENT_BADGES } from '../../../data/studentData';

export const BadgesShowcase = ({ lang }) => {
  const renderBadgeIcon = (iconName) => {
    switch (iconName) {
      case 'Dna': return <Award size={24} color="var(--primary)" />;
      case 'Flame': return <Flame size={24} color="var(--warning)" />;
      case 'Target': return <Target size={24} color="var(--success)" />;
      case 'Shield': return <Shield size={24} color="var(--primary)" />;
      case 'Trophy': return <Trophy size={24} color="var(--warning)" />;
      case 'Brain': return <Brain size={24} color="var(--primary-light)" />;
      default: return <Award size={24} color="var(--primary)" />;
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '20px',
      padding: '22px 24px',
      marginBottom: '26px',
      boxShadow: 'var(--shadow-xs)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
        <Trophy size={18} color="var(--primary)" />
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-arabic)' }}>
          {lang === 'ar' ? 'معرض شارات التميز والأوسمة' : 'Badges & Honors'}
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {STUDENT_BADGES.map((b) => (
          <div
            key={b.id}
            style={{
              padding: '18px',
              borderRadius: '16px',
              backgroundColor: b.unlocked ? 'var(--bg-subtle)' : 'rgba(0,0,0,0.02)',
              border: '1.5px solid',
              borderColor: b.unlocked ? 'var(--border-medium)' : 'var(--border-subtle)',
              opacity: b.unlocked ? 1 : 0.6,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px'
            }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              backgroundColor: b.unlocked ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {renderBadgeIcon(b.icon)}
            </div>

            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {b.titleAr}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                {b.descAr}
              </div>
              <div style={{ fontSize: '11px', color: b.unlocked ? 'var(--success)' : 'var(--text-muted)', fontWeight: '700', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {b.unlocked ? `تم الإنجاز في: ${b.date}` : (
                  <>
                    <Lock size={12} />
                    <span>لم يُفتح بعد</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
