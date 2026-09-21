import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CERTIFICATES_LIST } from '../../data/studentData';
import {
  CertificateEligibilityCard,
  CertificateCard,
  CertificateModal
} from '../../features/student/certificates';
export const StudentCertificatesView = () => {
  const { lang, isRtl } = useLanguage();
  const [selectedCert, setSelectedCert] = useState(null);

  const isAr = lang === 'ar';

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '28px 20px 80px',
      fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-sans)',
      direction: isRtl ? 'rtl' : 'ltr'
    }}>
      {/* Calm Elegant Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '900',
          color: 'var(--text-primary)',
          margin: '0 0 6px 0',
          letterSpacing: '-0.3px'
        }}>
          {isAr ? 'الشهادات المعتمدة والتوثيق الأكاديمي' : 'Official Certificates & Academic Verification'}
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          {isAr 
            ? 'شهادات إنجاز وتفوق موثقة برقم تسلسلي رسمي وكود QR صالحة للتحقق والتحميل كصورة PNG بجودة فائقة' 
            : 'Verified achievement credentials authenticated with serial IDs and instant QR validation ready for high-resolution PNG download'}
        </p>
      </div>

      {/* 3-Tier Criteria Checklist Card (Calm Formal Aesthetic) */}
      <CertificateEligibilityCard lang={lang} />

      {/* Certificates Gallery (No filter buttons, prominent certificate display) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '24px',
        marginTop: '8px'
      }}>
        {CERTIFICATES_LIST.map((cert) => (
          <CertificateCard
            key={cert.id}
            cert={cert}
            lang={lang}
            onSelectCert={(c) => setSelectedCert(c)}
          />
        ))}
      </div>

      {/* Official Certificate Preview Modal */}
      <CertificateModal
        selectedCert={selectedCert}
        isRtl={isRtl}
        lang={lang}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
};

