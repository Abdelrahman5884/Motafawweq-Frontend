import React, { useState, useRef } from 'react';
import { Eye, Download, Copy, Check, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { OfficialCertificateDocument } from './OfficialCertificateDocument';

export const CertificateCard = ({ cert, lang = 'ar', onSelectCert }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fullCertRef = useRef(null);
  const isAr = lang === 'ar';

  const isTeacher = cert.issuerType === 'teacher' || cert.category === 'teacher';
  const isLeague = cert.issuerType === 'league' || cert.category === 'league';

  const handleCopySerial = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(cert.serialId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = async (e) => {
    e.stopPropagation();
    if (isDownloading || !fullCertRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(fullCertRef.current, {
        pixelRatio: 2.5,
        cacheBust: true,
        backgroundColor: '#FFFFFF'
      });
      const link = document.createElement('a');
      const studentName = isAr ? (cert.studentNameAr || 'الطالب') : (cert.studentNameEn || 'Student');
      const courseName = isAr ? (cert.courseNameAr || cert.titleAr || 'الشهادة') : (cert.courseNameEn || cert.titleEn || 'Certificate');
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
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '16px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.25s ease',
        position: 'relative',
        direction: isAr ? 'rtl' : 'ltr'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(6, 37, 78, 0.1)';
        e.currentTarget.style.borderColor = 'rgba(21, 136, 199, 0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
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
          ref={fullCertRef}
          cert={cert}
          lang={lang}
          isExport={true}
        />
      </div>

      {/* ── Visual Certificate Canvas (Clean, Solid, Standing Beautifully) ── */}
      <div
        onClick={() => onSelectCert(cert)}
        style={{
          position: 'relative',
          borderRadius: '14px',
          overflow: 'hidden',
          cursor: 'pointer',
          marginBottom: '12px'
        }}
        title={isAr ? 'انقر لمعاينة الشهادة وتكبيرها بالكامل' : 'Click to preview full certificate'}
      >
        <OfficialCertificateDocument cert={cert} lang={lang} />

        {/* Hover Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(6, 37, 78, 0.35)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 18px',
            borderRadius: '20px',
            backgroundColor: '#FFFFFF',
            color: '#06254E',
            fontSize: '12px',
            fontWeight: '900',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)'
          }}>
            <Eye size={15} color="var(--primary)" />
            <span>{isAr ? 'معاينة وتكبير الشهادة' : 'Preview & Enlarge'}</span>
          </div>
        </div>
      </div>

      {/* ── Card Metrics Summary Chip ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        backgroundColor: 'rgba(21, 136, 199, 0.05)',
        border: '1px solid rgba(21, 136, 199, 0.15)',
        borderRadius: '10px',
        marginBottom: '12px',
        fontSize: '11.5px',
        gap: '8px'
      }}>
        {isLeague ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>
                {isAr ? 'المركز:' : 'Rank:'}
              </span>
              <span style={{ color: 'var(--primary)', fontWeight: '900' }}>
                {isAr ? (cert.rankAr || 'المركز الأول 🥇') : (cert.rankEn || '1st Place 🥇')}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>
                {isAr ? 'النقاط:' : 'XP:'}
              </span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '900' }}>
                {isAr ? (cert.pointsAr || '3,980') : (cert.pointsEn || '3,980 XP')}
              </span>
            </div>
          </>
        ) : isTeacher ? (
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
                {cert.score || '96.5%'}
              </span>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>
                {isAr ? 'إتمام المادة:' : 'Completion:'}
              </span>
              <span style={{ color: 'var(--primary)', fontWeight: '900' }}>
                {cert.completionRate || '100%'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>
                {isAr ? 'الامتحانات:' : 'Exams:'}
              </span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '900' }}>
                {cert.score || '98.5%'}
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Footer Bar: Serial Number & Action Buttons ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        {/* Serial Chip */}
        <button
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
            transition: 'all 0.15s ease'
          }}
          title={isAr ? 'نسخ رقم السيريال' : 'Copy Serial Number'}
        >
          {copied ? <Check size={12} color="var(--primary)" /> : <Copy size={12} />}
          <span style={{ fontWeight: '700' }}>{cert.serialId}</span>
        </button>

        {/* Actions: Preview & Save PNG */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
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
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(21, 136, 199, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Eye size={14} />
            <span>{isAr ? 'معاينة' : 'Preview'}</span>
          </button>

          <button
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
              transition: 'opacity 0.15s ease',
              boxShadow: '0 2px 8px rgba(21, 136, 199, 0.25)'
            }}
            title={isAr ? 'حفظ الشهادة كصورة PNG عالية الدقة' : 'Save Certificate as high-res PNG image'}
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
