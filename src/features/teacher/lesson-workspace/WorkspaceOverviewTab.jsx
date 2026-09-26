import React, { useState } from 'react';
import { 
  Play, 
  FileText, 
  Image as ImageIcon, 
  Download, 
  Eye, 
  Video, 
  Info, 
  ExternalLink, 
  X, 
  Layers 
} from 'lucide-react';

export const WorkspaceOverviewTab = ({ lesson, lang, onJumpToChapter }) => {
  const [selectedPreviewImage, setSelectedPreviewImage] = useState(null);
  const [previewPdf, setPreviewPdf] = useState(null);

  const pdfList = lesson.attachments?.pdfs || [];
  const imageList = lesson.attachments?.images || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Key Metrics Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px'
      }}>
        <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'المفاهيم المستخرجة' : 'Concepts Extracted'}</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary)', marginTop: '4px' }}>{lesson.stats?.conceptsCount || 14}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'فصول الحصة' : 'Chapters'}</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary-light)', marginTop: '4px' }}>{lesson.stats?.chaptersCount || 5}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الأسئلة المولدة' : 'Quiz Questions'}</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--success)', marginTop: '4px' }}>{lesson.stats?.quizQuestionsCount || 12}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'ملازم وصور مرفقة' : 'Attached Materials'}</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--warning)', marginTop: '4px' }}>
            {pdfList.length + imageList.length} {lang === 'ar' ? 'ملفات' : 'files'}
          </div>
        </div>
      </div>

      {/* Lesson Description Card */}
      {(lesson.description || lesson.descriptionAr) && (
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Info size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'وصف الحصة ومحاور الشرح' : 'Lesson Description & Outline'}
            </h3>
          </div>
          <p style={{
            fontSize: '14px',
            lineHeight: 1.7,
            color: 'var(--text-primary)',
            margin: 0,
            whiteSpace: 'pre-line'
          }}>
            {lang === 'ar' ? (lesson.descriptionAr || lesson.description) : (lesson.description || lesson.descriptionAr)}
          </p>
        </div>
      )}

      {/* Video Player Card (If video exists) */}
      {lesson.videoUrl && (
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Video size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'فيديو الشرح التفاعلي للحصة' : 'Interactive Lecture Video'}
            </h3>
          </div>

          <div style={{
            position: 'relative',
            paddingBottom: '56.25%', // 16:9 aspect ratio
            height: 0,
            overflow: 'hidden',
            borderRadius: '14px',
            backgroundColor: '#000000',
            boxShadow: 'var(--shadow-md)'
          }}>
            <iframe
              src={
                lesson.videoUrl.includes('youtube.com/watch?v=')
                  ? lesson.videoUrl.replace('watch?v=', 'embed/')
                  : lesson.videoUrl.includes('youtu.be/')
                    ? lesson.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/')
                    : 'https://www.youtube.com/embed/sQK3Yr4Sc_k'
              }
              title="Lesson Video Player"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Attached Materials: Multiple PDFs & Ordered Whiteboards */}
      {(pdfList.length > 0 || imageList.length > 0) && (
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Layers size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'مرفقات الحصة (ملازم PDF وصور السبورة)' : 'Lesson Attachments (PDFs & Board Photos)'}
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Section 1: Multiple PDFs */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={15} color="var(--primary)" />
                <span>{lang === 'ar' ? `المذكرات والملازم بصيغة PDF (${pdfList.length}):` : `PDF Booklets (${pdfList.length}):`}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pdfList.map((pdf) => (
                  <div
                    key={pdf.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <FileText size={18} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '700',
                          color: 'var(--text-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {pdf.title || pdf.fileName}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {pdf.fileSize} • {pdf.pagesCount} {lang === 'ar' ? 'صفحة' : 'pages'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setPreviewPdf(pdf)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-surface-elevated)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        <Eye size={13} />
                        <span>{lang === 'ar' ? 'معاينة' : 'Preview'}</span>
                      </button>
                      <a
                        href={pdf.url || '#'}
                        download={pdf.fileName}
                        onClick={(e) => {
                          if (!pdf.url || pdf.url === '#') {
                            e.preventDefault();
                            alert(lang === 'ar' ? `بدء تحميل المذكرة: ${pdf.fileName}` : `Downloading ${pdf.fileName}`);
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          textDecoration: 'none',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        <Download size={13} />
                        <span>{lang === 'ar' ? 'تحميل' : 'Download'}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Multiple Ordered Whiteboards */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ImageIcon size={15} color="var(--primary)" />
                <span>{lang === 'ar' ? `صور السبورة بالترتيب التسلسلي (${imageList.length}):` : `Ordered Whiteboards (${imageList.length}):`}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {imageList.map((img, idx) => (
                  <div
                    key={img.id}
                    onClick={() => setSelectedPreviewImage(img)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                      <span style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '800',
                        flexShrink: 0
                      }}>
                        #{img.order || idx + 1}
                      </span>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        backgroundColor: '#1E293B'
                      }}>
                        <img src={img.url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '700',
                          color: 'var(--text-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {img.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {img.fileSize} • {lang === 'ar' ? 'اضغط للتكبير' : 'Click to enlarge'}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Eye size={13} />
                      <span>{lang === 'ar' ? 'تكبير' : 'View'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chapters Table */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
          {lang === 'ar' ? 'فصول الحصة والتوقيتات الزمنية' : 'Lesson Chapters & Milestones'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {lesson.chapters.map(ch => (
            <div
              key={ch.id}
              onClick={() => onJumpToChapter(ch.startSeconds)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)'
                }}>
                  {ch.timestamp}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? ch.titleAr : ch.title}
                </span>
              </div>
              <Play size={14} color="var(--primary)" />
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal Preview */}
      {selectedPreviewImage && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: '20px',
            maxWidth: '840px',
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
                  #{selectedPreviewImage.order}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {selectedPreviewImage.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPreviewImage(null)}
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
            <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#0B0F19' }}>
              <img
                src={selectedPreviewImage.url}
                alt={selectedPreviewImage.title}
                style={{ maxWidth: '100%', maxHeight: '68vh', objectFit: 'contain', borderRadius: '10px' }}
              />
              <div style={{ marginTop: '12px', fontSize: '13px', color: '#94A3B8' }}>
                {selectedPreviewImage.caption}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Modal Preview */}
      {previewPdf && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)',
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
                  {previewPdf.title || previewPdf.fileName}
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
                {previewPdf.fileName}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
                {previewPdf.fileSize} • {previewPdf.pagesCount} صفحات • ملف مذكرة رقمية جاهز للطباعة والتحميل للطالب
              </p>
              <a
                href={previewPdf.url || '#'}
                download={previewPdf.fileName}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '700'
                }}
              >
                <ExternalLink size={15} />
                <span>تحميل أو فتح الملف في تبويب جديد</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
