import React from 'react';
import { Crown, Flame, Zap } from 'lucide-react';

export const GamificationHero = ({ student }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #06254E 0%, #0d3b6f 100%)',
      border: '1.5px solid rgba(92, 182, 219, 0.35)',
      borderRadius: '24px',
      padding: '28px',
      marginBottom: '28px',
      color: '#FFFFFF',
      boxShadow: '0 12px 36px rgba(6, 37, 78, 0.25)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: 'rgba(92, 182, 219, 0.15)',
            border: '2px solid rgba(92, 182, 219, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Crown size={30} color="var(--primary-light)" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#BAE6FD', fontWeight: '800', textTransform: 'uppercase' }}>
              المستوى الحالي {student.level} • {student.levelTitleAr}
            </div>
            <div style={{ fontSize: '24px', fontWeight: '900', marginTop: '2px' }}>
              {student.xp.toLocaleString()} XP
            </div>
          </div>
        </div>

        {/* Dual Streaks (Study Streak & Exam Streak) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            padding: '12px 18px',
            borderRadius: '16px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.5)',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '18px', fontWeight: '900', color: '#FDE68A' }}>
              <Flame size={18} color="var(--warning)" />
              <span>{student.streakDays} يوماً</span>
            </div>
            <div style={{ fontSize: '11px', color: '#FCD34D', fontWeight: '800' }}>
              استريك المذاكرة اليومية
            </div>
          </div>

          <div style={{
            padding: '12px 18px',
            borderRadius: '16px',
            backgroundColor: 'rgba(92, 182, 219, 0.18)',
            border: '1px solid rgba(92, 182, 219, 0.5)',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '18px', fontWeight: '900', color: '#BAE6FD' }}>
              <Zap size={18} color="var(--primary-light)" />
              <span>{student.examStreak} اختبارات</span>
            </div>
            <div style={{ fontSize: '11px', color: '#7DD3FC', fontWeight: '800' }}>
              استريك الامتحانات المتواصلة
            </div>
          </div>
        </div>
      </div>

      {/* Level Progression Bar */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#BAE6FD', marginBottom: '6px', fontWeight: '700' }}>
          <span>المستوى 9 (Senior Scholar)</span>
          <span>باقي 550 XP للوصول إلى المستوى 10 (Master Genius)</span>
        </div>
        <div style={{ width: '100%', height: '10px', borderRadius: '5px', backgroundColor: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
          <div style={{ width: '74%', height: '100%', borderRadius: '5px', background: 'linear-gradient(90deg, #1588C7 0%, #5CB6DB 100%)' }} />
        </div>
      </div>
    </div>
  );
};
