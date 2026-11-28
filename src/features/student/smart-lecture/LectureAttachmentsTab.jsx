import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  FileText,
  Download,
  ExternalLink,
  Trash2,
  Plus,
  Loader2,
  Sparkles,
  X,
  ZoomIn,
  Music,
  Video,
} from 'lucide-react';

export const LectureAttachmentsTab = ({
  attachments = [],
  lang = 'ar',
  isUploading = false,
  onAddAttachments,
  onDeleteAttachment,
}) => {
  const isAr = lang === 'ar';
  const fileInputRef = useRef(null);
  const [reanalyzeAfterAdd, setReanalyzeAfterAdd] = useState(true);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [deletingId, setDeletingId] = useState('');

  const images = attachments.filter((a) => a.kind === 'image');
  const otherFiles = attachments.filter((a) => a.kind !== 'image');

  const handleFilesSelected = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = '';
    if (picked.length > 0 && onAddAttachments) {
      onAddAttachments(picked, reanalyzeAfterAdd);
    }
  };

  const handleRemove = async (attId) => {
    if (!onDeleteAttachment || deletingId) return;
    setDeletingId(attId);
    try {
      await onDeleteAttachment(attId);
    } finally {
      setDeletingId('');
    }
  };

  const getFileIcon = (kind) => {
    if (kind === 'video') return <Video size={18} color="var(--primary)" />;
    if (kind === 'audio') return <Music size={18} color="var(--primary)" />;
    if (kind === 'image') return <ImageIcon size={18} color="var(--primary)" />;
    return <FileText size={18} color="var(--primary)" />;
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Top Action Bar: Add More Images / Files Anytime */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '14px 16px',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {isAr ? 'صور السبورة والملخصات والمرفقات الإضافية' : 'Whiteboard Photos, Notes & Attachments'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {isAr
              ? 'يمكنك إضافة صور سبورة أو مذكرات أو ملفات PDF/Word في أي وقت ليقرأها الذكاء الاصطناعي ويدمجها في المحاضرة.'
              : 'Add whiteboard photos, notebook pages, or PDF/Word files anytime so AI reads and merges them.'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '700',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={reanalyzeAfterAdd}
              disabled={isUploading}
              onChange={(e) => setReanalyzeAfterAdd(e.target.checked)}
              style={{ accentColor: 'var(--primary)', width: '15px', height: '15px' }}
            />
            <Sparkles size={13} color="var(--primary)" />
            <span>{isAr ? 'تحديث الخريطة والكويز بالـ AI' : 'Refresh AI Map & Quiz'}</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,audio/*,video/*,.pdf,.docx,.pptx,.txt,.md"
            onChange={handleFilesSelected}
            style={{ display: 'none' }}
          />

          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '9px 16px',
              borderRadius: '11px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: isUploading ? 'wait' : 'pointer',
              opacity: isUploading ? 0.8 : 1,
            }}
          >
            {isUploading ? <Loader2 size={15} className="spin" /> : <Plus size={15} />}
            <span>
              {isUploading
                ? isAr ? 'جاري الرفع وقراءة النص بالـ AI...' : 'Uploading & Extracting...'
                : isAr ? 'إضافة صور أو ملفات' : 'Add Images / Files'}
            </span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {attachments.length === 0 ? (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            borderRadius: '16px',
            border: '1px dashed var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          <ImageIcon size={32} color="var(--primary)" style={{ opacity: 0.65, marginBottom: '10px' }} />
          <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {isAr ? 'لا توجد صور أو مرفقات إضافية بعد' : 'No Images or Attachments Yet'}
          </div>
          <div style={{ fontSize: '12.5px', maxWidth: '460px', margin: '0 auto' }}>
            {isAr
              ? 'اضغط على «إضافة صور أو ملفات» بالأعلى لرفع صور السبورة أو صفحات الكتاب أو ملخص PDF مع هذه المحاضرة.'
              : 'Click "Add Images / Files" above to attach whiteboard photos, textbook pages, or PDF notes.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Images Gallery */}
          {images.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '13.5px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                }}
              >
                <ImageIcon size={16} color="var(--primary)" />
                <span>{isAr ? `الصور المرفقة (${images.length})` : `Attached Images (${images.length})`}</span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                  gap: '14px',
                }}
              >
                {images.map((img) => (
                  <div
                    key={img.id}
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setLightboxItem(img)}
                      style={{
                        position: 'relative',
                        padding: 0,
                        border: 'none',
                        backgroundColor: '#0F172A',
                        height: '165px',
                        width: '100%',
                        cursor: 'zoom-in',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '8px',
                          insetInlineEnd: '8px',
                          backgroundColor: 'rgba(15, 23, 42, 0.72)',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          padding: '4px 7px',
                          fontSize: '11px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <ZoomIn size={12} />
                        {isAr ? 'تكبير' : 'Zoom'}
                      </span>
                    </button>

                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <span
                          title={img.name}
                          style={{
                            fontSize: '12.5px',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {img.name}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>{img.size}</span>
                      </div>

                      {img.extractedText && (
                        <div
                          dir="auto"
                          style={{
                            fontSize: '11.5px',
                            color: 'var(--text-secondary)',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            padding: '6px 8px',
                            lineHeight: 1.5,
                            maxHeight: '62px',
                            overflow: 'hidden',
                          }}
                        >
                          <strong style={{ color: 'var(--primary)' }}>OCR: </strong>
                          {img.extractedText}
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '4px' }}>
                        <a
                          href={img.downloadUrl || img.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11.5px',
                            fontWeight: '700',
                            color: 'var(--primary)',
                            textDecoration: 'none',
                          }}
                        >
                          <Download size={13} />
                          <span>{isAr ? 'تحميل' : 'Download'}</span>
                        </a>

                        {onDeleteAttachment && (
                          <button
                            type="button"
                            disabled={deletingId === img.id}
                            onClick={() => handleRemove(img.id)}
                            title={isAr ? 'حذف الصورة' : 'Delete image'}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#EF4444',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                            }}
                          >
                            {deletingId === img.id ? <Loader2 size={13} className="spin" /> : <Trash2 size={13} />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents & Extra Files List */}
          {otherFiles.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '13.5px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                }}
              >
                <FileText size={16} color="var(--primary)" />
                <span>{isAr ? `الملفات والمستندات (${otherFiles.length})` : `Documents & Files (${otherFiles.length})`}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {otherFiles.map((att) => (
                  <div
                    key={att.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--primary-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {getFileIcon(att.kind)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {att.name}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          {att.size}
                          {att.extractedText ? (isAr ? ' • تم استخراج النص للـ AI' : ' • Text extracted for AI') : ''}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '6px 11px',
                          borderRadius: '9px',
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                          fontWeight: '700',
                          textDecoration: 'none',
                        }}
                      >
                        <ExternalLink size={13} />
                        <span>{isAr ? 'فتح' : 'Open'}</span>
                      </a>

                      <a
                        href={att.downloadUrl || att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '6px 11px',
                          borderRadius: '9px',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          fontSize: '12px',
                          fontWeight: '700',
                          textDecoration: 'none',
                        }}
                      >
                        <Download size={13} />
                        <span>{isAr ? 'تحميل' : 'Download'}</span>
                      </a>

                      {onDeleteAttachment && (
                        <button
                          type="button"
                          disabled={deletingId === att.id}
                          onClick={() => handleRemove(att.id)}
                          title={isAr ? 'حذف المرفق' : 'Delete attachment'}
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '8px',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            backgroundColor: 'rgba(239, 68, 68, 0.08)',
                            color: '#EF4444',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          {deletingId === att.id ? <Loader2 size={13} className="spin" /> : <Trash2 size={13} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full-Screen Image Lightbox Modal */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxItem(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(2, 6, 23, 0.88)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            gap: '14px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '960px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: '800' }}>{lightboxItem.name}</span>
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.14)',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>

          <img
            src={lightboxItem.url}
            alt={lightboxItem.name}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '92vw',
              maxHeight: '72vh',
              borderRadius: '14px',
              objectFit: 'contain',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            }}
          />

          {lightboxItem.extractedText && (
            <div
              dir="auto"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '820px',
                width: '100%',
                maxHeight: '16vh',
                overflowY: 'auto',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#E2E8F0',
                fontSize: '12.5px',
                lineHeight: 1.65,
              }}
            >
              <strong style={{ color: '#38BDF8', marginInlineEnd: '6px' }}>
                {isAr ? 'النص المستخرج من الصورة (AI OCR):' : 'Extracted Image Text (AI OCR):'}
              </strong>
              {lightboxItem.extractedText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
