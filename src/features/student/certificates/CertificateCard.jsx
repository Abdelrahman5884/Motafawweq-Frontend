import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Eye, Download, Copy, Check, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { OfficialCertificateDocument } from './OfficialCertificateDocument';

function waitForNodeQrReady(node, timeoutMs = 700) {
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

export const CertificateCard = ({ cert, lang = 'ar', onSelectCert }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mountExport, setMountExport] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const fullCertRef = useRef(null);
  const copyTimerRef = useRef(null);
  const isAr = lang === 'ar';

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const isLeague = cert.issuerType === 'league' || cert.category === 'league';

  const handleCopySerial = useCallback(
    (e) => {
      e.stopPropagation();
      if (!cert.serialId) return;
      navigator.clipboard?.writeText(cert.serialId).catch(() => {});
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    },
    [cert.serialId]
  );

  const handleDownloadPng = useCallback(
    async (e) => {
      e.stopPropagation();
      if (isDownloading) return;
      setIsDownloading(true);
      setDownloadError(null);
      setMountExport(true);

      try {
        // Wait for React to mount the offscreen export node and generate its offline QR
        await new Promise((r) => setTimeout(r, 60));
        if (!fullCertRef.current) {
          throw new Error('Export canvas not ready');
        }
        await waitForNodeQrReady(fullCertRef.current);

        const dataUrl = await toPng(fullCertRef.current, {
          pixelRatio: 2.2,
          cacheBust: true,
          backgroundColor: '#FFFFFF',
        });

        const link = document.createElement('a');
        const studentName = isAr ? cert.studentNameAr || 'الطالب' : cert.studentNameEn || 'Student';
        const courseName = isAr
          ? cert.courseNameAr || cert.titleAr || 'الشهادة'
          : cert.courseNameEn || cert.titleEn || 'Certificate';
        link.download = `certificate-${studentName}-${courseName}.png`
          .replace(/[/\\?%*:|"<>]/g, '-')
          .replace(/\s+/g, '-');
        link.href = dataUrl;
        link.click();
      } catch {
        setDownloadError(isAr ? 'تعذر حفظ صورة الشهادة، حاول مرة أخرى.' : 'Failed to save PNG image.');
      } finally {
        setMountExport(false);
        setIsDownloading(false);
      }
    },
    [cert, isAr, isDownloading]
  );

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '16px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        position: 'relative',
        direction: isAr ? 'rtl' : 'ltr',
      }}
    >
      {/* Lazy offscreen export DOM: ONLY mounted while downloading PNG */}
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
          <OfficialCertificateDocument ref={fullCertRef} cert={cert} lang={lang} isExport={true} />
        </div>
      )}

      {/* Visual Certificate Preview Canvas */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelectCert(cert)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectCert(cert);
          }
        }}
        style={{
          position: 'relative',
          borderRadius: '14px',
          overflow: 'hidden',
          cursor: 'pointer',
          marginBottom: '12px',
        }}
        title={isAr ? 'انقر لمعاينة الشهادة وتكبيرها بالكامل' : 'Click to preview full certificate'}
      >
        <OfficialCertificateDocument cert={cert} lang={lang} />
      </div>

      {/* Real Metrics Summary Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: 'rgba(21, 136, 199, 0.05)',
          border: '1px solid rgba(21, 136, 199, 0.15)',
          borderRadius: '10px',
          marginBottom: '12px',
          fontSize: '11.5px',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        {isLeague ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>
                {isAr ? 'المركز:' : 'Rank:'}
              </span>
              <span style={{ color: 'var(--primary)', fontWeight: '900' }}>
                {isAr ? cert.rankAr || '—' : cert.rankEn || cert.rankAr || '—'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>
                {isAr ? 'النقاط:' : 'Points:'}
              </span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '900' }}>
                {isAr ? cert.pointsAr || '—' : cert.pointsEn || cert.pointsAr || '—'}
              </span>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>
                {isAr ? 'نسبة الإتمام:' : 'Completion:'}
              </span>
              <span style={{ color: 'var(--primary)', fontWeight: '900' }}>
                {cert.completionRate || '100%'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>
                {isAr ? 'التقييم:' : 'Score:'}
              </span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '900' }}>
                {cert.score || '—'}
              </span>
            </div>
          </>
        )}
      </div>

      {downloadError && (
        <div
          style={{
            fontSize: '11.5px',
            fontWeight: '700',
            color: 'var(--danger, #DC2626)',
            marginBottom: '8px',
          }}
        >
          {downloadError}
        </div>
      )}

      {/* Footer Bar: Serial Copy + Preview + Save PNG */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={handleCopySerial}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 10px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono), monospace',
            cursor: 'pointer',
          }}
          title={isAr ? 'نسخ رقم السيريال' : 'Copy Serial Number'}
        >
          {copied ? <Check size={12} color="var(--primary)" /> : <Copy size={12} />}
          <span style={{ fontWeight: '700' }}>{cert.serialId}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => onSelectCert(cert)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '10px',
              backgroundColor: 'transparent',
              color: 'var(--primary)',
              border: '1px solid var(--primary)',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Eye size={14} />
            <span>{isAr ? 'معاينة' : 'Preview'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isDownloading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12px',
              fontWeight: '800',
              cursor: isDownloading ? 'wait' : 'pointer',
              opacity: isDownloading ? 0.75 : 1,
              boxShadow: '0 2px 8px rgba(21, 136, 199, 0.25)',
            }}
          >
            {isDownloading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>{isAr ? 'جاري الحفظ...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>{isAr ? 'حفظ PNG' : 'Save PNG'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
