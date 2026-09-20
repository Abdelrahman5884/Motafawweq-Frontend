import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const MistakeRetryModal = ({
  activeMistakeModal,
  selectedRetryOption,
  setSelectedRetryOption,
  retryResult,
  isRtl,
  onClose,
  onResolveMistake
}) => {
  if (!activeMistakeModal) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(6px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1.5px solid var(--border-medium)',
        borderRadius: '24px',
        maxWidth: '560px',
        width: '100%',
        padding: '28px'
      }}>
        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--danger)' }}>
          إعادة حل السؤال الخاطئ
        </span>
        <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: '8px 0 16px 0', lineHeight: 1.5 }}>
          {activeMistakeModal.questionAr}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setSelectedRetryOption('opt-wrong')}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: selectedRetryOption === 'opt-wrong' ? '#FEF2F2' : 'var(--bg-subtle)',
              border: '1.5px solid',
              borderColor: selectedRetryOption === 'opt-wrong' ? 'var(--danger)' : 'var(--border-subtle)',
              color: 'var(--text-primary)',
              textAlign: isRtl ? 'right' : 'left',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {activeMistakeModal.wrongAnswerGivenAr}
          </button>

          <button
            onClick={() => setSelectedRetryOption('opt-correct')}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: selectedRetryOption === 'opt-correct' ? '#ECFDF5' : 'var(--bg-subtle)',
              border: '1.5px solid',
              borderColor: selectedRetryOption === 'opt-correct' ? 'var(--success)' : 'var(--border-subtle)',
              color: 'var(--text-primary)',
              textAlign: isRtl ? 'right' : 'left',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {activeMistakeModal.correctAnswerAr}
          </button>
        </div>

        {retryResult === 'correct' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#065F46', fontSize: '13px', fontWeight: '800', marginBottom: '16px' }}>
            <CheckCircle2 size={16} color="var(--success)" />
            <span>إجابة صحيحة! تم تصحيح الفهم في سجلك التعليمي.</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{ padding: '10px 18px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            إغلاق
          </button>
          <button
            onClick={onResolveMistake}
            style={{ padding: '10px 22px', borderRadius: '12px', backgroundColor: 'var(--success)', color: '#FFFFFF', border: 'none', fontWeight: '800', cursor: 'pointer' }}
          >
            تأكيد الإجابة
          </button>
        </div>
      </div>
    </div>
  );
};
