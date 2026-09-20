import React from 'react';
import { Play, HelpCircle } from 'lucide-react';

export const WeakAreaCard = ({ concept, lang, onListen, onPractice }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#FEF2F2',
              color: 'var(--danger)'
            }}>
              {lang === 'ar' ? concept.statusAr : concept.status}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              • {lang === 'ar' ? `نسبة الإتقان: ${concept.mastery}%` : `Mastery: ${concept.mastery}%`}
            </span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? concept.titleAr : concept.title}
          </h3>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onListen}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(21, 136, 199, 0.28)'
            }}
          >
            <Play size={13} fill="#FFFFFF" />
            <span>{lang === 'ar' ? `سماع دقيقة [${concept.timestamp}]` : `Listen [${concept.timestamp}]`}</span>
          </button>

          <button
            onClick={onPractice}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <HelpCircle size={14} color="var(--primary)" />
            <span>{lang === 'ar' ? 'تدريب 5 أسئلة' : 'Practice 5 Qs'}</span>
          </button>
        </div>
      </div>

      {/* Mastery Bar */}
      <div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'var(--border-subtle)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${concept.mastery}%`,
            height: '100%',
            backgroundColor: concept.mastery < 70 ? 'var(--danger)' : 'var(--warning)',
            borderRadius: '4px'
          }} />
        </div>
      </div>

      {/* Misconception Diagnostic Note */}
      <div style={{
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-subtle)',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        lineHeight: 1.5
      }}>
        <strong style={{ color: 'var(--text-primary)' }}>{lang === 'ar' ? 'سبب الخطأ الشائع: ' : 'Common Misconception: '}</strong>
        {lang === 'ar' ? concept.mistakePatternAr : concept.mistakePattern}
      </div>
    </div>
  );
};
