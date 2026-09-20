import React from 'react';
import { X } from 'lucide-react';

export const CurriculumDetailModal = ({ item, isRtl, onClose, onStartLesson }) => {
  if (!item) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(5px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: '20px',
        maxWidth: '480px',
        width: '100%',
        padding: '26px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18)',
        position: 'relative',
        animation: 'modalFadeIn 0.2s ease-out'
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            left: isRtl ? '18px' : 'auto',
            right: isRtl ? 'auto' : '18px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={15} />
        </button>

        <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
          {item.sourceAr}
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
          {item.titleAr}
        </h3>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
          {item.gradeAr}
        </p>

        {/* Topics List */}
        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: '14px',
          padding: '14px',
          marginBottom: '18px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>
            الأبواب والوحدات المقررة رسمياً:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {item.topics.map((t, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                <span style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  flexShrink: 0
                }}>
                  {idx + 1}
                </span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '9px 16px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            إغلاق
          </button>
          <button
            onClick={() => {
              onClose();
              onStartLesson();
            }}
            style={{
              padding: '9px 20px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(21, 136, 199, 0.28)'
            }}
          >
            بدء مذاكرة المنهج
          </button>
        </div>
      </div>
    </div>
  );
};
