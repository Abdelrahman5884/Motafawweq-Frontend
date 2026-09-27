import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export const RealQRCode = ({ value, size = 200, className = '' }) => {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    if (!value) return;
    QRCode.toDataURL(value, {
      width: size,
      margin: 1.5,
      color: {
        dark: '#06254E',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setDataUrl(url))
      .catch(err => {
        console.error('QR code generation error:', err);
      });
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div style={{
        width: size,
        height: size,
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)'
      }}>
        ...
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt={`QR Code for ${value}`}
      width={size}
      height={size}
      className={className}
      style={{
        borderRadius: '12px',
        display: 'block',
        margin: '0 auto',
        boxShadow: '0 4px 16px rgba(6, 37, 78, 0.08)'
      }}
    />
  );
};
