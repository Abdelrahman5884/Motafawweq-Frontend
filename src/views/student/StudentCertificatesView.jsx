import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { studentApi } from '../../services/studentApi';
import {
  CertificateEligibilityCard,
  CertificateCard,
  CertificateModal
} from '../../features/student/certificates';
export const StudentCertificatesView = () => {
  const { lang, isRtl } = useLanguage();
  const [selectedCert, setSelectedCert] = useState(null);
  const [certificatesList, setCertificatesList] = useState([]);
  const [eligibility, setEligibility] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      studentApi.gamification.certificates().catch(() => null),
      studentApi.gamification.certificateEligibility().catch(() => null),
    ]).then(([certsRes, eligRes]) => {
      if (!mounted) return;
      const list = Array.isArray(certsRes?.data) ? certsRes.data : [];
      setCertificatesList(list.map((c) => ({
        id: c.id,
        serialId: c.certificateNumber,
        courseTitleAr: c.courseNameAr,
        courseTitleEn: c.courseNameAr,
        studentNameAr: c.studentNameAr,
        gradePercent: `${c.gradePercent}%`,
        honorsAr: c.honorsTitleAr,
        issueDate: c.issueDate,
        verifyUrl: c.verifyUrl
      })));
      if (eligRes?.data) {
        setEligibility(eligRes.data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

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
      <CertificateEligibilityCard lang={lang} eligibility={eligibility} />

      {/* Certificates Gallery (100% Mobile Responsive Grid) */}
      {certificatesList.length === 0 ? (
        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          borderRadius: '20px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px dashed var(--border-subtle)',
          color: 'var(--text-secondary)',
          marginTop: '16px'
        }}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {isAr ? 'لا توجد شهادات مصدرة حتى الآن' : 'No Certificates Issued Yet'}
          </div>
          <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
            {isAr
              ? 'ستظهر شهادات التقدير والتفوق المعتمدة هنا فور إتمامك لمتطلبات الكورس.'
              : 'Your verified course completion certificates will appear here once earned.'}
          </div>
        </div>
      ) : (
        <div
          className="certificates-gallery-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '20px',
            marginTop: '8px'
          }}
        >
          {certificatesList.map((cert) => (
            <CertificateCard
              key={cert.id}
              cert={cert}
              lang={lang}
              onSelectCert={(c) => setSelectedCert(c)}
            />
          ))}
        </div>
      )}

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

