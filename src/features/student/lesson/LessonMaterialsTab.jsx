import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Download,
  Image as ImageIcon,
  Eye,
  X,
  ExternalLink,
  Layers,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export const LessonMaterialsTab = ({
  attachments = [],
  whiteboardImages = [],
  handleAttachmentDownloadClick,
  dlId,
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'pdf' | 'images'
  const [lightboxIdx, setLightboxIdx] = useState(-1);
  const [previewPdf, setPreviewPdf] = useState(null);

  const lightboxImage =
    lightboxIdx >= 0 && lightboxIdx < whiteboardImages.length
      ? whiteboardImages[lightboxIdx]
      : null;

  const closeModals = useCallback(() => {
    setLightboxIdx(-1);
    setPreviewPdf(null);
  }, []);

  // Escape & Arrow navigation for Lightbox / PDF preview
  useEffect(() => {
    if (!lightboxImage && !previewPdf) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModals();
      } else if (lightboxImage && whiteboardImages.length > 1) {
        if (e.key === 'ArrowRight') {
          setLightboxIdx((i) => (i + 1) % whiteboardImages.length);
        } else if (e.key === 'ArrowLeft') {
          setLightboxIdx((i) => (i - 1 + whiteboardImages.length) % whiteboardImages.length);
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [lightboxImage, previewPdf, whiteboardImages.length, closeModals]);

  const showPdfs = activeFilter === 'all' || activeFilter === 'pdf';
  const showImages = activeFilter === 'all' || activeFilter === 'images';

  return (
    <div className="lv-materials" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Filter Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          paddingBottom: '8px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="var(--primary)" />
          <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {isAr ? 'ملفات ومرفقات الحصة التفاعلية' : 'Lesson Materials & Media'}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '10px',
            padding: '3px',
            gap: '3px',
          }}
        >
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All', count: attachments.length + whiteboardImages.length },
            { id: 'pdf', labelAr: 'ملازم PDF', labelEn: 'PDFs', count: attachments.length },
            { id: 'images', labelAr: 'صور السبورة', labelEn: 'Board Photos', count: whiteboardImages.length },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '7px',
                border: 'none',
                backgroundColor: activeFilter === f.id ? 'var(--primary)' : 'transparent',
                color: activeFilter === f.id ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: activeFilter === f.id ? '800' : '600',
                cursor: 'pointer',
              }}
            >
              <span>{isAr ? f.labelAr : f.labelEn}</span>
              <span
                style={{
                  fontSize: '10.5px',
                  padding: '0 5px',
                  borderRadius: '4px',
                  backgroundColor:
                    activeFilter === f.id ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
                  color: activeFilter === f.id ? '#FFFFFF' : 'var(--text-muted)',
                }}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {((activeFilter === 'all' && attachments.length === 0 && whiteboardImages.length === 0) ||
        (activeFilter === 'pdf' && attachments.length === 0) ||
        (activeFilter === 'images' && whiteboardImages.length === 0)) && (
        <div
          style={{
            padding: '32px 16px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '14px',
            border: '1px dashed var(--border-subtle)',
            fontSize: '13.5px',
            fontWeight: '700',
          }}
        >
          <FileText size={28} color="var(--primary)" style={{ opacity: 0.6, marginBottom: '8px' }} />
          <div>
            {isAr
              ? 'لا توجد ملفات أو صور سبورة مرفقة بهذه الحصة حالياً.'
              : 'No files or whiteboard images attached to this lesson yet.'}
          </div>
        </div>
      )}

      {/* SECTION 1: PDF BOOKLETS */}
      {showPdfs && attachments.length > 0 && (
        <div>
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: '800',
              color: 'var(--text-secondary)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileText size={15} color="var(--primary)" />
            <span>
              {isAr
                ? `المذكرات والملفات بصيغة PDF (${attachments.length}):`
                : `PDF Booklets (${attachments.length}):`}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {attachments.map((a, i) => (
              <div
                key={a.id || i}
                className="lv-att"
                style={{ animationDelay: `${Math.min(i, 8) * 0.04}s`, minWidth: 0 }}
              >
                <div
                  className="lv-att__icon"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}
                >
                  <FileText size={20} />
                </div>
                <div className="lv-att__info" style={{ minWidth: 0 }}>
                  <div
                    className="lv-att__name"
                    style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                  >
                    {a.titleAr}
                  </div>
                  <div className="lv-att__meta">
                    {a.size} • {a.pages} • {isAr ? `ملف ${a.type}` : `${a.type} File`}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => setPreviewPdf(a)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    <Eye size={13} />
                    <span>{isAr ? 'معاينة' : 'Preview'}</span>
                  </button>
                  <button
                    type="button"
                    className="lv-att__dl"
                    onClick={() => handleAttachmentDownloadClick(a)}
                    disabled={dlId === a.id}
                  >
                    <Download size={14} />
                    <span>
                      {dlId === a.id
                        ? isAr
                          ? 'جاري التحميل...'
                          : 'Downloading...'
                        : isAr
                          ? 'تحميل'
                          : 'Download'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: ORDERED WHITEBOARDS */}
      {showImages && whiteboardImages.length > 0 && (
        <div style={{ marginTop: showPdfs && attachments.length > 0 ? '8px' : '0' }}>
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: '800',
              color: 'var(--text-secondary)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ImageIcon size={15} color="var(--primary)" />
            <span>
              {isAr
                ? `صور ومخططات السبورة بالترتيب (${whiteboardImages.length}):`
                : `Ordered Whiteboards (${whiteboardImages.length}):`}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
              gap: '14px',
            }}
          >
            {whiteboardImages.map((img, idx) => (
              <div
                key={img.id || idx}
                onClick={() => setLightboxIdx(idx)}
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    insetInlineStart: '10px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '800',
                    zIndex: 2,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  }}
                >
                  #{img.order || idx + 1}
                </div>

                <div style={{ height: '148px', backgroundColor: '#0B0F19', overflow: 'hidden' }}>
                  <img
                    src={img.url}
                    alt={img.titleAr}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ padding: '12px' }}>
                  <div
                    title={img.titleAr}
                    style={{
                      fontSize: '13px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {img.titleAr}
                  </div>
                  {img.caption && (
                    <div
                      style={{
                        fontSize: '11.5px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        marginBottom: '8px',
                      }}
                    >
                      {img.caption}
                    </div>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span>{img.size}</span>
                    <span
                      style={{
                        color: 'var(--primary)',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <Eye size={12} />
                      <span>{isAr ? 'عرض مكبّر' : 'Zoom'}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IMAGE LIGHTBOX MODAL (Backdrop close, Escape, Prev/Next, Direct Download) */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIdx(-1)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(5px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: '20px',
              maxWidth: '920px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                padding: '14px 18px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    flexShrink: 0,
                  }}
                >
                  {lightboxIdx + 1} / {whiteboardImages.length}
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {lightboxImage.titleAr}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => handleAttachmentDownloadClick(lightboxImage)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  <Download size={13} />
                  <span>{isAr ? 'تحميل الصورة' : 'Download'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIdx(-1)}
                  aria-label={isAr ? 'إغلاق' : 'Close'}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div style={{ position: 'relative', padding: '18px', textAlign: 'center', backgroundColor: '#090D16' }}>
              {whiteboardImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIdx((i) => (i - 1 + whiteboardImages.length) % whiteboardImages.length)
                    }
                    aria-label={isAr ? 'الصورة السابقة' : 'Previous'}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '14px',
                      transform: 'translateY(-50%)',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: 'rgba(15, 23, 42, 0.78)',
                      color: '#FFFFFF',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightboxIdx((i) => (i + 1) % whiteboardImages.length)}
                    aria-label={isAr ? 'الصورة التالية' : 'Next'}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '14px',
                      transform: 'translateY(-50%)',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: 'rgba(15, 23, 42, 0.78)',
                      color: '#FFFFFF',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              <img
                src={lightboxImage.url}
                alt={lightboxImage.titleAr}
                style={{
                  maxWidth: '100%',
                  maxHeight: '68vh',
                  objectFit: 'contain',
                  borderRadius: '10px',
                }}
              />
              {lightboxImage.caption && (
                <div style={{ marginTop: '12px', fontSize: '13px', color: '#CBD5E1' }}>
                  {lightboxImage.caption}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REAL EMBEDDED PDF PREVIEW MODAL */}
      {previewPdf && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewPdf(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(5px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: '20px',
              maxWidth: '940px',
              width: '100%',
              height: '86vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                padding: '14px 18px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <FileText size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {previewPdf.titleAr}
                </span>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', flexShrink: 0 }}>
                  ({previewPdf.size})
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {previewPdf.url && (
                  <a
                    href={previewPdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 11px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: '700',
                      textDecoration: 'none',
                    }}
                  >
                    <ExternalLink size={13} />
                    <span>{isAr ? 'فتح في نافذة جديدة' : 'Open Tab'}</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    handleAttachmentDownloadClick(previewPdf);
                    setPreviewPdf(null);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 13px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                  }}
                >
                  <Download size={13} />
                  <span>{isAr ? 'تحميل' : 'Download'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPdf(null)}
                  aria-label={isAr ? 'إغلاق' : 'Close'}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div style={{ flex: 1, backgroundColor: '#1E293B', position: 'relative' }}>
              {previewPdf.url ? (
                <iframe
                  src={previewPdf.url}
                  title={previewPdf.titleAr}
                  style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                />
              ) : (
                <div style={{ padding: '48px 24px', textAlign: 'center', color: '#CBD5E1' }}>
                  {isAr ? 'لا يتوفر رابط معاينة لهذا الملف.' : 'Preview URL unavailable.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default LessonMaterialsTab;
