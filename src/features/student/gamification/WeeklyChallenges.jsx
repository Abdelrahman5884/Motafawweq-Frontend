import React from 'react';
import { Zap, CheckCircle2, Target } from 'lucide-react';

export const WeeklyChallenges = ({ challenges, lang }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1.5px solid var(--border-medium)',
      borderRadius: '24px',
      padding: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
        <Zap size={20} color="var(--primary)" />
        <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
          {lang === 'ar' ? 'تحديات الأسبوع التعليمية (+XP إضافي):' : 'Weekly Challenges:'}
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {challenges.map((ch) => (
          <div
            key={ch.id}
            style={{
              padding: '16px 20px',
              borderRadius: '16px',
              backgroundColor: ch.completed ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-subtle)',
              border: '1px solid',
              borderColor: ch.completed ? 'var(--success)' : 'var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: ch.completed ? 'var(--success)' : 'var(--bg-surface)',
                color: ch.completed ? '#FFFFFF' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {ch.completed ? <CheckCircle2 size={18} /> : <Target size={18} color="var(--primary)" />}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {ch.titleAr}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  التقدم: {ch.progress}
                </div>
              </div>
            </div>

            <div style={{ padding: '6px 14px', borderRadius: '10px', backgroundColor: 'var(--primary-surface)', color: 'var(--primary)', fontWeight: '900', fontSize: '12.5px' }}>
              +{ch.xpReward} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
