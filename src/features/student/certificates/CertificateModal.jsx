import React, { useEffect, useState, useRef, useCallback } from 'react';
import { X, Download, Check, Copy, ShieldCheck, Loader2, Share2, ExternalLink } from 'lucide-react';
import { toPng } from 'html-to-image';
import { OfficialCertificateDocument } from './OfficialCertificateDocument';

function waitForQrImage(node, timeoutMs = 700) {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      const qrImg = node?.querySelector('img[alt="QR"]');
      if (qrImg && typeof qrImg.src === 'string' && qrImg.src.startsWith('data:')) {
        requestAnimationFrame(() => resolve());
        return;
      }
      if (Date.now() - start >= timeoutMs) {
        resolve();
        return;
      }
      setTimeout(check, 30);
    };
    requestAnimationFrame(check);
  });
}

function resolveLiveVerifyUrl(cert) {
  if (!cert) return '';
  const serial = cert.serialId || cert.certificateNumber || cert.certNumber || '';
  const origin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';
  if (cert.verifyPath && origin) {
    return `${origin}${cert.verifyPath}`;
  }
  if (serial && origin) {
    return `${origin}/verify/${encodeURIComponent(serial)}`;
  }
  return cert.verificationUrl || '';
}

export const CertificateModal = ({ selectedCert, onClose, lang = 'ar' }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [mountExport, setMountExport] = useState(false);
  const [notice, setNotice] = useState(null);
  const exportCertRef = useRef(null);
  const timersRef = useRef([]);
  const isAr = lang === 'ar';

  const scheduleTimer = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [onClose]);

  const renderExportPng = useCallback(async () => {
    setMountExport(true);
    await new Promise((r) => setTimeout(r, 60));
    if (!exportCertRef.current) {
      throw new Error('Export canvas not ready');
    }
    await waitForQrImage(exportCertRef.current);
    return toPng(exportCertRef.current, {
      pixelRatio: 2.3,
      cacheBust: true,
      backgroundColor: '#FFFFFF',
    });
  }, []);

  if (!selectedCert) return null;

  const serialId = selectedCert.serialId || selectedCert.certificateNumber || selectedCert.certNumber || '';
  const liveVerifyUrl = resolveLiveVerifyUrl(selectedCert);

  const handleCopyLink = () => {
    if (!liveVerifyUrl) return;
    navigator.clipboard?.writeText(liveVerifyUrl).catch(() => {});
    setCopied(true);
    scheduleTimer(() => setCopied(false), 2500);
  };

  const handleDownloadPng = async () => {
    if (isDownloading || isSharing) return;
    setIsDownloading(true);
    setNotice(null);
    try {
      const dataUrl = await renderExportPng();
      const link = document.createElement('a');
      const studentName = isAr ? selectedCert.studentNameAr || 'الطالب' : selectedCert.studentNameEn || 'Student';
      const courseName = isAr
        ? selectedCert.courseNameAr || selectedCert.titleAr || 'الشهادة'
        : selectedCert.courseNameEn || selectedCert.titleEn || 'Certificate';
      link.download = `certificate-${studentName}-${courseName}.png`
        .replace(/[/\\?%*:|"<>]/g, '-')
        .replace(/\s+/g, '-');
      link.href = dataUrl;
      link.click();
    } catch {
      setNotice({
        type: 'error',
        text: isAr ? 'تعذر حفظ الشهادة كصورة، حاول مرة أخرى.' : 'Failed to save certificate PNG.',
      });
    } finally {
      setMountExport(false);
      setIsDownloading(false);
    }
  };

  const handleShareImage = async () => {
    if (isSharing || isDownloading) return;
    setIsSharing(true);
    setNotice(null);
    try {
      const dataUrl = await renderExportPng();
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const studentName = isAr
        ? selectedCert.studentNameAr || 'الطالب'
        : selectedCert.studentNameEn || 'Student';
      const courseName = isAr
        ? selectedCert.courseNameAr || selectedCert.titleAr || 'المقرر'
        : selectedCert.courseNameEn || selectedCert.titleEn || 'Course';
      const fileName = `certificate-${studentName}.png`.replace(/[/\\?%*:|"<>]/g, '-').replace(/\s+/g, '-');
      const file = new File([blob], fileName, { type: 'image/png' });
      const message = isAr
        ? `شهادة تقدير وتفوق معتمدة للطالب: *${studentName}*\nفي مقرر: *${courseName}*\nمنصة متفوّق التعليمية\nرابط التحقق الرسمي: ${liveVerifyUrl}`
        : `Official Verified Certificate for: *${studentName}*\nCourse: *${courseName}*\nMotafawweq Platform\nVerification: ${liveVerifyUrl}`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: isAr ? `شهادة معتمدة - ${studentName}` : `Certificate - ${studentName}`,
          text: message,
        });
      } else {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();

        try {
          if (navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          }
        } catch {
          // Clipboard image write not supported in all browsers
        }

        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
        setNotice({
          type: 'info',
          text: isAr
            ? 'تم حفظ صورة الشهادة وفتح رابط المشاركة بنجاح.'
            : 'Certificate PNG saved and sharing link opened.',
        });
        scheduleTimer(() => setNotice(null), 5000);
      }
    } catch {
      setNotice({
        type: 'error',
        text: isAr ? 'تعذر تجهيز الشهادة للمشاركة.' : 'Failed to prepare certificate for sharing.',
      });
    } finally {
      setMountExport(false);
      setIsSharing(false);
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
          gap: '18px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            paddingBottom: '14px',
            direction: isAr ? 'rtl' : 'ltr',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(21, 136, 199, 0.2)',
                color: '#7DD3FC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#FFFFFF', margin: 0 }}>
                {isAr ? 'المعاينة الرسمية للشهادة المعتمدة' : 'Official Certificate Verification Preview'}
              </h3>
              <div
                style={{
                  fontSize: '11.5px',
                  color: '#94A3B8',
                  marginTop: '2px',
                  fontFamily: 'var(--font-mono), monospace',
                }}
              >
                {isAr ? `رقم السيريال: ${serialId}` : `Serial: ${serialId}`}
              </div>
            </div>
          </div>

          <button
            type="button"
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
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Lazy Offscreen Export Canvas */}
        {mountExport && (
          <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              left: '-9999px',
              top: '0',
              width: '960px',
              pointerEvents: 'none',
              zIndex: -1,
            }}
          >
            <OfficialCertificateDocument ref={exportCertRef} cert={selectedCert} lang={lang} isExport={true} />
          </div>
        )}

        {/* Certificate Rendering Container */}
        <div
          style={{
            overflowX: 'auto',
            padding: '4px 0',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <OfficialCertificateDocument cert={selectedCert} lang={lang} className="in-modal-certificate" />
        </div>

        {notice && (
          <div
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              backgroundColor:
                notice.type === 'error' ? 'rgba(239, 68, 68, 0.18)' : 'rgba(21, 136, 199, 0.18)',
              border:
                notice.type === 'error'
                  ? '1px solid rgba(239, 68, 68, 0.4)'
                  : '1px solid rgba(21, 136, 199, 0.35)',
              color: notice.type === 'error' ? '#FCA5A5' : '#BAE6FD',
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              direction: isAr ? 'rtl' : 'ltr',
            }}
          >
            <Check size={16} />
            <span>{notice.text}</span>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            paddingTop: '16px',
            flexWrap: 'wrap',
            gap: '12px',
            direction: isAr ? 'rtl' : 'ltr',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleCopyLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {copied ? <Check size={15} color="#38BDF8" /> : <Copy size={15} />}
              <span>
                {copied
                  ? isAr
                    ? 'تم نسخ رابط التحقق!'
                    : 'Link Copied!'
                  : isAr
                    ? 'نسخ رابط التحقق'
                    : 'Copy Verification Link'}
              </span>
            </button>

            {liveVerifyUrl && (
              <a
                href={liveVerifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#BAE6FD',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  textDecoration: 'none',
                }}
              >
                <ExternalLink size={15} />
                <span>{isAr ? 'فتح صفحة التحقق' : 'Verify Online'}</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleShareImage}
              disabled={isSharing || isDownloading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: isSharing ? 'wait' : 'pointer',
                opacity: isSharing ? 0.7 : 1,
              }}
            >
              {isSharing ? <Loader2 size={15} className="animate-spin" /> : <Share2 size={15} />}
              <span>
                {isSharing
                  ? isAr
                    ? 'جاري التجهيز...'
                    : 'Preparing...'
                  : isAr
                    ? 'مشاركة كصورة'
                    : 'Share Image'}
              </span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isDownloading || isSharing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: isDownloading ? 'wait' : 'pointer',
                boxShadow: '0 4px 14px rgba(21, 136, 199, 0.4)',
                opacity: isDownloading ? 0.75 : 1,
              }}
            >
              {isDownloading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{isAr ? 'جاري حفظ الصورة...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>{isAr ? 'حفظ كـ صورة PNG' : 'Save as PNG'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: '11px',
                backgroundColor: 'transparent',
                color: '#94A3B8',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
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
