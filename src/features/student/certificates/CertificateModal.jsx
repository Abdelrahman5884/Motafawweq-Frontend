import React, { useEffect, useState, useRef } from 'react';
import { X, Download, Check, Copy, ShieldCheck, Loader2, MessageCircle } from 'lucide-react';
import { toPng } from 'html-to-image';
import { OfficialCertificateDocument } from './OfficialCertificateDocument';

export const CertificateModal = ({ selectedCert, onClose, lang = 'ar' }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const exportCertRef = useRef(null);
  const isAr = lang === 'ar';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!selectedCert) return null;

  const handleCopyLink = () => {
    const url = selectedCert.verificationUrl || `https://motafawweq.me/verify/${selectedCert.serialId}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const [isSharing, setIsSharing] = useState(false);
  const [shareNotice, setShareNotice] = useState(null);

  const handleShareWhatsApp = async () => {
    if (isSharing || !exportCertRef.current) return;
    setIsSharing(true);
    try {
      const dataUrl = await toPng(exportCertRef.current, {
        pixelRatio: 2.5,
        cacheBust: true,
        backgroundColor: '#FFFFFF'
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const studentName = isAr ? (selectedCert.studentNameAr || selectedCert.studentName || 'الطالب') : (selectedCert.studentNameEn || 'Student');
      const courseName = isAr ? (selectedCert.courseNameAr || selectedCert.titleAr || 'المقرر') : (selectedCert.courseNameEn || selectedCert.titleEn || 'Course');
      const fileName = `شهادة-${studentName}.png`.replace(/\s+/g, '-');
      const file = new File([blob], fileName, { type: 'image/png' });
      const serialCode = selectedCert.serialId || selectedCert.certNumber || 'MTF-2026';
      const verifyUrl = selectedCert.verificationUrl || `https://motafawweq.me/verify/${serialCode}`;
      const message = isAr
        ? `شهادة تقدير وتفوق معتمدة للطالب: *${studentName}*\nفي مقرر: *${courseName}*\nمنصة متفوّق التعليمية 🎓\nرابط التوثيق: ${verifyUrl}`
        : `Official Certificate of Excellence for: *${studentName}*\nCourse: *${courseName}*\nMotafawweq Platform 🎓\nVerification: ${verifyUrl}`;

      // 1. Mobile & Web Share API with actual image file
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `شهادة تقدير - ${studentName}`,
          text: message
        });
      } else {
        // 2. Desktop Fallback: Download PNG image + copy to clipboard + open WhatsApp Web
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();

        try {
          if (navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
          }
        } catch (clipErr) {}

        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
        setShareNotice(isAr ? 'تم تنزيل صورة الشهادة ونسخها للحافظة! يمكنك لصقها مباشرة في واتساب (Ctrl+V).' : 'Certificate image downloaded & copied! Paste directly in WhatsApp.');
        setTimeout(() => setShareNotice(null), 5000);
      }
    } catch (err) {
      console.error('WhatsApp image share failed:', err);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadPng = async () => {
    if (isDownloading || !exportCertRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(exportCertRef.current, {
        pixelRatio: 2.5,
        cacheBust: true,
        backgroundColor: '#FFFFFF'
      });
      const link = document.createElement('a');
      const studentName = isAr ? (selectedCert.studentNameAr || 'الطالب') : (selectedCert.studentNameEn || 'Student');
      const courseName = isAr ? (selectedCert.courseNameAr || selectedCert.titleAr || 'الشهادة') : (selectedCert.courseNameEn || selectedCert.titleEn || 'Certificate');
      link.download = `شهادة-${studentName}-${courseName}.png`.replace(/[/\\?%*:|"<>]/g, '-').replace(/\s+/g, '-');
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download PNG failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="certificate-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 25, 53, 0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="certificate-modal-card"
        style={{
          backgroundColor: '#06254E',
          color: '#FFFFFF',
          borderRadius: '24px',
          maxWidth: '980px',
          width: '100%',
          maxHeight: '94vh',
          overflowY: 'auto',
          padding: '24px',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Chrome Bar */}
        <div className="certificate-modal-chrome" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          paddingBottom: '14px',
          direction: isAr ? 'rtl' : 'ltr'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(21, 136, 199, 0.2)',
              color: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#FFFFFF', margin: 0 }}>
                {isAr ? 'المعاينة الرسمية للشهادة المعتمدة' : 'Official Certificate Verification Preview'}
              </h3>
              <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px', fontFamily: 'var(--font-mono), monospace' }}>
                {isAr ? `رقم السيريال: ${selectedCert.serialId}` : `Serial: ${selectedCert.serialId}`}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#CBD5E1',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Hidden full-scale certificate for crystal-sharp 1-click PNG image generation ── */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: '-9999px',
            top: '0',
            width: '960px',
            pointerEvents: 'none',
            zIndex: -1
          }}
        >
          <OfficialCertificateDocument
            ref={exportCertRef}
            cert={selectedCert}
            lang={lang}
            isExport={true}
          />
        </div>

        {/* Certificate Rendering Container */}
        <div style={{
          overflowX: 'auto',
          padding: '4px 0',
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}>
          <OfficialCertificateDocument
            cert={selectedCert}
            lang={lang}
            className="in-modal-certificate"
          />
        </div>

        {shareNotice && (
          <div style={{
            padding: '10px 16px',
            borderRadius: '10px',
            backgroundColor: 'rgba(37, 211, 102, 0.15)',
            border: '1px solid rgba(37, 211, 102, 0.35)',
            color: '#4ADE80',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            direction: isAr ? 'rtl' : 'ltr'
          }}>
            <Check size={16} />
            <span>{shareNotice}</span>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="certificate-modal-chrome" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          paddingTop: '16px',
          flexWrap: 'wrap',
          gap: '12px',
          direction: isAr ? 'rtl' : 'ltr'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Copy Verification Link */}
            <button
              onClick={handleCopyLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.14)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
            >
              {copied ? <Check size={15} color="#38BDF8" /> : <Copy size={15} />}
              <span>{copied ? (isAr ? 'تم نسخ رابط التوثيق!' : 'Link Copied!') : (isAr ? 'نسخ رابط التوثيق الرسمي' : 'Copy Verification Link')}</span>
            </button>

            {/* Share on WhatsApp as Image */}
            <button
              onClick={handleShareWhatsApp}
              disabled={isSharing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '12px',
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: isSharing ? 'wait' : 'pointer',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
                opacity: isSharing ? 0.7 : 1,
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              title={isAr ? 'مشاركة صورة الشهادة عبر واتساب' : 'Share certificate image via WhatsApp'}
            >
              {isSharing ? <Loader2 size={15} className="animate-spin" /> : <MessageCircle size={15} />}
              <span>{isSharing ? (isAr ? 'جاري تجهيز الصورة...' : 'Preparing...') : (isAr ? 'مشاركة كـ صورة واتساب' : 'Share as Image')}</span>
            </button>
          </div>

          {/* Download PNG & Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleDownloadPng}
              disabled={isDownloading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: isDownloading ? 'wait' : 'pointer',
                boxShadow: '0 4px 14px rgba(21, 136, 199, 0.4)',
                opacity: isDownloading ? 0.75 : 1,
                transition: 'opacity 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              title={isAr ? 'حفظ الشهادة كصورة PNG عالية الدقة' : 'Save certificate as high-resolution PNG image'}
            >
              {isDownloading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{isAr ? 'جاري حفظ الصورة...' : 'Saving Image...'}</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>{isAr ? 'حفظ كـ صورة PNG' : 'Save as PNG Image'}</span>
                </>
              )}
            </button>

            <button
              className="certificate-modal-btn-close"
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: '11px',
                backgroundColor: 'transparent',
                color: '#94A3B8',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94A3B8';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
