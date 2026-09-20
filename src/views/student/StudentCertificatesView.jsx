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

  // Requirements checklist for the active course (US-95)
  const requirements = [
    { labelAr: 'إكمال 100% من محاضرات كورس الأحياء الفسيولوجية', met: true },
    { labelAr: 'تسليم جميع الواجبات المقالية واعتمادها من المعلم', met: true },
    { labelAr: 'اجتياز الامتحان الشامل للوحدة بنسبة 80% فأكثر (حاصل على 96%)', met: true }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '28px 20px 80px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
          {lang === 'ar' ? 'الشهادات المعتمدة والتوثيق الرسمي' : 'Certificates & Official Verification'}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          {lang === 'ar' ? 'شهادات إتمام الكورسات الموثقة برقم تسلسلي معتمد وكود QR يمكن مشاركتها وطباعتها' : 'Accredited completion certificates with QR verification & serial ID'}
        </p>
      </div>

      {/* Requirements Checklist Card */}
      <CertificateEligibilityCard requirements={requirements} lang={lang} />

      {/* Certificates Gallery */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
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
        onClose={() => setSelectedCert(null)}
        onPrint={handlePrint}
      />
    </div>
  );
};
