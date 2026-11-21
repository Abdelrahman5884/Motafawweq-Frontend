import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, AlertCircle, CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { SPage } from '../../components/student/ui';
import {
  CertificateEligibilityCard,
  CertificateCard,
  CertificateModal,
  useStudentCertificates,
} from '../../features/student/certificates';

export const StudentCertificatesView = () => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';
  const vm = useStudentCertificates(lang);

  const breadcrumbs = useMemo(
    () => [
      {
        labelAr: 'الشهادات المعتمدة',
        labelEn: 'Official Certificates',
      },
    ],
    []
  );
  useSetBreadcrumbs(breadcrumbs);

  return (
    <SPage maxWidth={1120}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
          fontFamily: isRtl ? 'var(--font-arabic, sans-serif)' : 'var(--font-sans, sans-serif)',
          direction: isRtl ? 'rtl' : 'ltr',
          minWidth: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                margin: '0 0 6px 0',
                letterSpacing: '-0.3px',
              }}
            >
              {isAr ? 'الشهادات المعتمدة والتوثيق الأكاديمي' : 'Official Certificates & Academic Verification'}
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {isAr
                ? 'شهادات إنجاز وتفوق موثقة برقم تسلسلي وتوقيع رقمي وكود QR صالحة للتحقق الفوري والتحميل كصورة PNG'
                : 'Verified achievement credentials authenticated with serial IDs, digital signatures, and scannable QR verification'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Link
              to="/verify"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                backgroundColor: 'rgba(21, 136, 199, 0.08)',
                border: '1px solid rgba(21, 136, 199, 0.25)',
                color: 'var(--primary)',
                fontSize: '12.5px',
                fontWeight: '800',
                textDecoration: 'none',
              }}
            >
              <ShieldCheck size={14} />
              <span>{isAr ? 'التحقق من شهادة' : 'Verify a Certificate'}</span>
            </Link>

            <button
              type="button"
              disabled={vm.loading || vm.refreshing}
              onClick={vm.handleRefresh}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: vm.loading || vm.refreshing ? 'wait' : 'pointer',
                opacity: vm.loading || vm.refreshing ? 0.7 : 1,
              }}
            >
              <RefreshCw size={14} color="var(--primary)" />
              <span>{isAr ? 'تحديث' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Success Toast Banner */}
        {vm.claimMessage && (
          <div
            role="status"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '13px 16px',
              borderRadius: '14px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.32)',
              color: 'var(--success, #059669)',
              fontSize: '13px',
              fontWeight: '800',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} />
              <span>{vm.claimMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => vm.setClaimMessage(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                fontWeight: '800',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              {isAr ? 'إخفاء' : 'Dismiss'}
            </button>
          </div>
        )}

        {/* Error Alert */}
        {vm.error && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
              padding: '14px 16px',
              borderRadius: '14px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--danger, #DC2626)',
              fontSize: '13px',
              fontWeight: '700',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{vm.error}</span>
            </div>
            <button
              type="button"
              onClick={vm.handleRefresh}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: 'var(--danger, #DC2626)',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        )}

        {vm.loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div
              style={{
                height: '220px',
                borderRadius: '22px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
              }}
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                gap: '20px',
              }}
            >
              {[1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    height: '290px',
                    borderRadius: '20px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* 1. Real 3-Track Eligibility & 1-Click Claim for 100%-Completed Courses */}
            <CertificateEligibilityCard
              lang={lang}
              eligibility={vm.eligibility}
              claimingCourseId={vm.claimingCourseId}
              onClaimCourse={vm.handleClaimCourse}
            />

            {/* 2. Verified Certificates Gallery */}
            {vm.certificates.length === 0 ? (
              <div
                style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  borderRadius: '20px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px dashed var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(21, 136, 199, 0.1)',
                    color: 'var(--primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <Award size={26} />
                </div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {isAr ? 'لا توجد شهادات مصدرة لحسابك حتى الآن' : 'No Verified Certificates Issued Yet'}
                </div>
                <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
                  {isAr
                    ? 'أتمم 100% من دروس أي مقرر مشترك به لتتمكن من إصدار شهادتك المعتمدة فوراً، أو ستظهر هنا تلقائياً فور إصدارها من معلمك.'
                    : 'Complete 100% of an enrolled course to claim your verified certificate immediately, or view certificates issued by your instructors here.'}
                </div>
              </div>
            ) : (
              <div
                className="certificates-gallery-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                  gap: '20px',
                }}
              >
                {vm.certificates.map((cert) => (
                  <CertificateCard
                    key={cert.id}
                    cert={cert}
                    lang={lang}
                    onSelectCert={vm.setSelectedCert}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Official Certificate Preview Modal */}
        <CertificateModal
          selectedCert={vm.selectedCert}
          lang={lang}
          onClose={() => vm.setSelectedCert(null)}
        />
      </div>
    </SPage>
  );
};
