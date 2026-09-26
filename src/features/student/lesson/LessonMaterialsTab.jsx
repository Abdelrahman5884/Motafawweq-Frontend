import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Image as ImageIcon, 
  Eye, 
  X, 
  ExternalLink,
  Layers
} from 'lucide-react';

export const LessonMaterialsTab = ({
  attachments = [],
  whiteboardImages = [],
  handleAttachmentDownloadClick,
  dlId,
  lang = 'ar'
}) => {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'pdf' | 'images'
  const [lightboxImage, setLightboxImage] = useState(null);
  const [previewPdf, setPreviewPdf] = useState(null);

  const showPdfs = activeFilter === 'all' || activeFilter === 'pdf';
  const showImages = activeFilter === 'all' || activeFilter === 'images';

  return (
    <div className="lv-materials" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        paddingBottom: '8px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="var(--primary)" />
          <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {lang === 'ar' ? 'ملفات ومرفقات الحصة التفاعلية' : 'Lesson Materials & Media'}
          </span>
        </div>

        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: '10px',
          padding: '3px',
          gap: '3px'
        }}>
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All', count: attachments.length + whiteboardImages.length },
            { id: 'pdf', labelAr: 'ملازم PDF', labelEn: 'PDFs', count: attachments.length },
            { id: 'images', labelAr: 'صور السبورة', labelEn: 'Board Photos', count: whiteboardImages.length }
          ].map(f => (
            <button
              key={f.id}
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
                transition: 'all 0.15s ease'
              }}
            >
              <span>{lang === 'ar' ? f.labelAr : f.labelEn}</span>
              <span style={{
                fontSize: '10.5px',
                padding: '0 5px',
                borderRadius: '4px',
                backgroundColor: activeFilter === f.id ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
                color: activeFilter === f.id ? '#FFFFFF' : 'var(--text-muted)'
              }}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: PDF BOOKLETS */}
      {showPdfs && attachments.length > 0 && (
        <div>
          <div style={{
            fontSize: '12.5px',
            fontWeight: '800',
            color: 'var(--text-secondary)',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <FileText size={15} color="var(--primary)" />
            <span>{lang === 'ar' ? `المذكرات والكتب بصيغة PDF (${attachments.length}):` : `PDF Booklets (${attachments.length}):`}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {attachments.map((a, i) => (
              <div key={a.id || i} className="lv-att" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="lv-att__icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                  <FileText size={20} />
                </div>
                <div className="lv-att__info">
                  <div className="lv-att__name">{a.titleAr}</div>
                  <div className="lv-att__meta">{a.size} • {a.pages} • ملف {a.type}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setPreviewPdf(a)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <Eye size={13} />
                    <span>{lang === 'ar' ? 'معاينة' : 'Preview'}</span>
                  </button>
                  <button
                    className="lv-att__dl"
                    onClick={() => handleAttachmentDownloadClick(a)}
                    disabled={dlId === a.id}
                  >
                    <Download size={14} />
                    <span>{dlId === a.id ? (lang === 'ar' ? 'جاري التحميل...' : 'Downloading...') : (lang === 'ar' ? 'تحميل' : 'Download')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: ORDERED WHITEBOARDS */}
      {showImages && whiteboardImages.length > 0 && (
        <div style={{ marginTop: showPdfs && attachments.length > 0 ? '12px' : '0' }}>
          <div style={{
            fontSize: '12.5px',
            fontWeight: '800',
            color: 'var(--text-secondary)',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ImageIcon size={15} color="var(--primary)" />
            <span>{lang === 'ar' ? `صور ومخططات السبورة بالترتيب (${whiteboardImages.length}):` : `Ordered Whiteboards (${whiteboardImages.length}):`}</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px'
          }}>
            {whiteboardImages.map((img, idx) => (
              <div
                key={img.id || idx}
                onClick={() => setLightboxImage(img)}
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Sequence badge */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '800',
                  zIndex: 2,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}>
                  #{img.order || idx + 1}
                </div>

                {/* Thumbnail */}
                <div style={{ height: '140px', backgroundColor: '#0B0F19', overflow: 'hidden' }}>
                  <img
                    src={img.url}
                    alt={img.titleAr}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Details */}
                <div style={{ padding: '12px' }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {img.titleAr}
                  </div>
                  <div style={{
                    fontSize: '11.5px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '8px'
                  }}>
                    {img.caption}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: 'var(--text-muted)'
                  }}>
                    <span>{img.size}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Eye size={12} />
                      <span>{lang === 'ar' ? 'عرض مكبّر' : 'Zoom'}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IMAGE LIGHTBOX MODAL */}
      {lightboxImage && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(5px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: '20px',
            maxWidth: '860px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF'
                }}>
                  #{lightboxImage.order}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {lightboxImage.titleAr}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
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
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#090D16' }}>
              <img
                src={lightboxImage.url}
                alt={lightboxImage.titleAr}
                style={{ maxWidth: '100%', maxHeight: '68vh', objectFit: 'contain', borderRadius: '10px' }}
              />
              <div style={{ marginTop: '12px', fontSize: '13px', color: '#CBD5E1' }}>
                {lightboxImage.caption}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF PREVIEW MODAL */}
      {previewPdf && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(5px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: '20px',
            maxWidth: '680px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="var(--primary)" />
                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {previewPdf.titleAr}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPdf(null)}
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
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ padding: '36px 24px', backgroundColor: 'var(--bg-subtle)' }}>
              <FileText size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                {previewPdf.titleAr}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
                {previewPdf.size} • {previewPdf.pages} • ملف مذكرة رقمية جاهز للطباعة والتحميل للطالب
              </p>
              <button
                onClick={() => {
                  handleAttachmentDownloadClick(previewPdf);
                  setPreviewPdf(null);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <Download size={15} />
                <span>تحميل المذكرة الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default LessonMaterialsTab;
