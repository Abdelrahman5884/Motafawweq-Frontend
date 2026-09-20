import React from 'react';
import { X, QrCode } from 'lucide-react';

export const ClassQrModal = ({
  showQrModal,
  selectedClass,
  lang,
  onClose
}) => {
  if (!showQrModal || !selectedClass) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          maxWidth: '380px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
          {lang === 'ar' ? selectedClass.nameAr : selectedClass.name}
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          {lang === 'ar' ? 'امسح الباركود بهاتف الطالب للانضمام الفوري للمجموعة' : 'Scan with student phone camera to join instantly'}
        </p>

        {/* Simulated QR Code Box */}
        <div style={{
          width: '200px',
          height: '200px',
          margin: '0 auto 20px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
        }}>
          <QrCode size={160} color="#181622" />
        </div>

        <div style={{
          padding: '10px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-subtle)',
          fontSize: '13px',
          fontFamily: 'var(--font-mono)',
          fontWeight: '700',
          color: 'var(--primary)',
          letterSpacing: '1px'
        }}>
          {selectedClass.joinCode}
        </div>
      </div>
    </div>
  );
};
