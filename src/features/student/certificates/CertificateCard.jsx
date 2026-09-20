import React from 'react';
import { QrCode, Download } from 'lucide-react';

export const CertificateCard = ({ cert, lang, onSelectCert }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '2px solid var(--warning)',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 10px 30px rgba(245, 158, 11, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span style={{ fontSize: '11px', fontWeight: '900', padding: '3px 10px', borderRadius: '12px', backgroundColor: '#FEF3C7', color: '#B45309' }}>
            مصدقة رسمياً ⭐
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {cert.completionDate}
          </span>
        </div>

        <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 10px 0', lineHeight: 1.4 }}>
          {cert.titleAr}
        </h3>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          المعلم: <strong>{cert.instructorAr}</strong> • الدرجة: <strong style={{ color: 'var(--success)' }}>{cert.score}</strong>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          padding: '10px 14px',
          borderRadius: '12px',
          fontSize: '11.5px',
          color: 'var(--text-muted)',
          marginBottom: '20px',
          fontFamily: 'monospace'
        }}>
          سيريال التحقق: {cert.serialId}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => onSelectCert(cert)}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <QrCode size={16} />
          <span>{lang === 'ar' ? 'معاينة وتوثيق' : 'View & Verify'}</span>
        </button>

        <button
          onClick={() => onSelectCert(cert)}
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
          title={lang === 'ar' ? 'تحميل' : 'Download'}
        >
          <Download size={16} />
        </button>
      </div>
    </div>
  );
};
