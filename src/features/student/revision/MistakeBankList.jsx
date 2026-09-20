import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export const MistakeBankList = ({ mistakes, unsolvedMistakesCount, lang, onOpenMistake }) => {
  return (
    <div>
      {/* Quick Stat Pill */}
      <div style={{
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        border: '1.5px solid #FCA5A5',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={20} color="var(--danger)" />
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#991B1B' }}>
              {lang === 'ar' ? `لديك ${unsolvedMistakesCount} أسئلة أخطأت فيها سابقاً في الكويزات` : `You have ${unsolvedMistakesCount} questions to re-solve`}
            </div>
            <div style={{ fontSize: '12px', color: '#7F1D1D' }}>
              {lang === 'ar' ? 'إعادة حلها تضمن لك فهم السبب العلمي ومنع تكرار الخطأ في الامتحان النهائي.' : 'Targeted re-solving boosts retention.'}
            </div>
          </div>
        </div>
      </div>

      {/* Mistakes Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {mistakes.map((m) => (
          <div
            key={m.id}
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1.5px solid',
              borderColor: m.solvedCorrectlyNow ? 'var(--success)' : 'var(--border-medium)',
              borderRadius: '20px',
              padding: '22px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '8px', backgroundColor: 'var(--primary-surface)', color: 'var(--primary)' }}>
                  {m.subjectAr}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {m.topicAr} • مصدر: {m.examSourceAr}
                </span>
              </div>

              {m.solvedCorrectlyNow && (
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> تم تصحيح الفهم بنجاح
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 12px 0', lineHeight: 1.5 }}>
              {m.questionAr}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', fontSize: '12.5px', color: '#991B1B' }}>
                <XCircle size={14} color="var(--danger)" />
                <div><strong>إجابتك السابقة:</strong> {m.wrongAnswerGivenAr}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '12px', backgroundColor: '#ECFDF5', border: '1px solid #6EE7B7', fontSize: '12.5px', color: '#065F46' }}>
                <CheckCircle2 size={14} color="var(--success)" />
                <div><strong>الإجابة الصحيحة:</strong> {m.correctAnswerAr}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                <strong>التفسير العلمي:</strong> {m.explanationAr}
              </div>

              <button
                onClick={() => onOpenMistake(m)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  backgroundColor: m.solvedCorrectlyNow ? 'var(--bg-subtle)' : 'var(--primary)',
                  color: m.solvedCorrectlyNow ? 'var(--text-primary)' : '#FFFFFF',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                {m.solvedCorrectlyNow ? (lang === 'ar' ? 'حل تدريب إضافي' : 'Practice More') : (lang === 'ar' ? 'إعادة حل السؤال الآن' : 'Re-solve Now')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
