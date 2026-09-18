import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { CERTIFICATES_LIST, STUDENT_PROFILE } from '../../data/studentData';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Download, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Share2, 
  X,
  Printer
} from 'lucide-react';

export const StudentCertificatesView = () => {
  const navigate = useNavigate();
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
          {lang === 'ar' ? 'الشهادات المعتمدة والتوثيق الرسمي 📜' : 'Certificates & Official Verification'}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          {lang === 'ar' ? 'شهادات إتمام الكورسات الموثقة برقم تسلسلي معتمد وكود QR يمكن مشاركتها وطباعتها' : 'Accredited completion certificates with QR verification & serial ID'}
        </p>
      </div>

      {/* Requirements Checklist Card (US-95 & US-96) */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1.5px solid var(--border-medium)',
        borderRadius: '24px',
        padding: '24px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <ShieldCheck size={22} color="#10B981" />
          <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'شروط استحقاق الشهادة المعتمدة (Certificate Criteria):' : 'Certificate Eligibility Requirements:'}
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {requirements.map((req, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-primary)' }}>
              <CheckCircle2 size={18} color="#10B981" />
              <span>{req.labelAr}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontSize: '13px', fontWeight: '800' }}>
          🎉 تهانينا يا عمر! لقد استوفيت جميع الشروط بنجاح وشهادتك صادرة وجاهزة للتحميل والتوثيق.
        </div>
      </div>

      {/* Certificates Gallery (US-99) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {CERTIFICATES_LIST.map((cert) => (
          <div
            key={cert.id}
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '2px solid #F59E0B',
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
                المعلم: <strong>{cert.instructorAr}</strong> • الدرجة: <strong style={{ color: '#10B981' }}>{cert.score}</strong>
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

            {/* Actions (US-97, US-98) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setSelectedCert(cert)}
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
                onClick={() => setSelectedCert(cert)}
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
        ))}
      </div>

      {/* Official Certificate Preview Modal (US-97 & US-98) */}
      {selectedCert && (
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
              onClick={() => setSelectedCert(null)}
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

            {/* Certificate Verification Footer (US-98) */}
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

              {/* QR Code & Serial (US-98) */}
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

            {/* Print & Download Action (US-97) */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '28px' }}>
              <button
                onClick={handlePrint}
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
      )}
    </div>
  );
};
