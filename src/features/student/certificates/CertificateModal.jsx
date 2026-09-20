import React from 'react';
import { X, Printer } from 'lucide-react';

export const CertificateModal = ({ selectedCert, isRtl, onClose, onPrint }) => {
  if (!selectedCert) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        color: '#0F172A',
        borderRadius: '24px',
        maxWidth: '780px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '36px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        position: 'relative',
        border: '8px double #D97706'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            left: isRtl ? '16px' : 'auto',
            right: isRtl ? 'auto' : '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#F1F5F9',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#334155'
          }}
        >
          <X size={18} />
        </button>

        {/* Certificate Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: '900', letterSpacing: '2px', color: '#D97706', textTransform: 'uppercase' }}>
            جمهورية مصر العربية • منصة متفوّق التعليمية
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', margin: '8px 0 4px' }}>
            شهادة إتمام وتفوق معتمدة
          </h2>
          <div style={{ fontSize: '14px', color: '#64748B' }}>
            Certificate of Academic Excellence
          </div>
        </div>

        {/* Certificate Body */}
        <div style={{ textAlign: 'center', margin: '28px 0', lineHeight: 1.8 }}>
          <p style={{ fontSize: '15px', color: '#334155' }}>
            تشهد إدارة منصة متفوّق للتعليم الذكي بأن الطالب:
          </p>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#1E1B4B', margin: '8px 0', fontFamily: 'var(--font-heading)' }}>
            {selectedCert.studentNameAr}
          </div>
          <p style={{ fontSize: '14px', color: '#475569' }}>
            قد أتم بنجاح متطلبات دراسة واختبارات منهج:
          </p>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#2563EB', margin: '6px 0' }}>
            {selectedCert.titleAr}
          </div>
          <p style={{ fontSize: '14px', color: '#475569' }}>
            وحصل على تقدير عام <strong>(امتياز بنسبة {selectedCert.score})</strong> بتاريخ {selectedCert.completionDate}.
          </p>
        </div>

        {/* Certificate Verification Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '24px',
          borderTop: '2px solid #E2E8F0',
          marginTop: '32px'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>رئيس المنظومة والمعلم المعتمد:</div>
            <div style={{ fontSize: '15px', fontWeight: '900', color: '#0F172A', marginTop: '2px' }}>
              {selectedCert.instructorAr}
            </div>
          </div>

          {/* QR Code & Serial */}
          <div style={{ textAlign: 'center' }}>
            <img
              src={selectedCert.qrCodeUrl}
              alt="Verification QR"
              style={{ width: '80px', height: '80px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
            />
            <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px', fontFamily: 'monospace' }}>
              {selectedCert.serialId}
            </div>
          </div>
        </div>

        {/* Print & Download Action */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '28px' }}>
          <button
            onClick={onPrint}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '14px',
              backgroundColor: '#D97706',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            <Printer size={16} />
            <span>طباعة أو حفظ كملف PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
