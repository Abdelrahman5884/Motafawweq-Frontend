import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  Eye,
  ArrowUp,
  ArrowDown,
  X,
  Layers,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { MAX_STORAGE_FILE_SIZE_BYTES } from '../../../services/storageService';

const ALLOWED_IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp']);

function formatSize(bytes) {
  if (typeof bytes === 'string') return bytes;
  if (!bytes || bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const LessonAttachmentsManager = ({
  pdfs = [],
  setPdfs,
  images = [],
  setImages,
  lang = 'ar',
  isRtl = true,
}) => {
  const isAr = lang === 'ar';
  const [activeSubTab, setActiveSubTab] = useState('pdfs');
  const [previewItem, setPreviewItem] = useState(null);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const pdfInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const createdUrlsRef = useRef(new Set());

  // Clean up all created blob URLs on unmount
  useEffect(() => {
    const urls = createdUrlsRef.current;
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
      urls.clear();
    };
  }, []);

  const trackBlobUrl = (file) => {
    const u = URL.createObjectURL(file);
    createdUrlsRef.current.add(u);
    return u;
  };

  const releaseBlobUrl = (url) => {
    if (url && createdUrlsRef.current.has(url)) {
      URL.revokeObjectURL(url);
      createdUrlsRef.current.delete(url);
    }
  };

  const handlePdfUpload = (files) => {
    setUploadError('');
    if (!files || files.length === 0) return;

    const accepted = [];
    const errors = [];

    Array.from(files).forEach((file, idx) => {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        errors.push(isAr ? `«${file.name}» ليس ملف PDF.` : `"${file.name}" is not a PDF file.`);
        return;
      }
      if (file.size > MAX_STORAGE_FILE_SIZE_BYTES) {
        errors.push(
          isAr
            ? `«${file.name}» يتجاوز الحد الأقصى (50 ميجابايت).`
            : `"${file.name}" exceeds the 50 MB limit.`
        );
        return;
      }

      accepted.push({
        id: `pdf-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        fileName: file.name,
        fileSize: formatSize(file.size),
        url: trackBlobUrl(file),
        fileObj: file,
      });
    });

    if (errors.length > 0) setUploadError(errors[0]);
    if (accepted.length > 0) setPdfs((prev) => [...prev, ...accepted]);
  };

  const handleRemovePdf = (id) => {
    setPdfs((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.url) releaseBlobUrl(target.url);
      return prev.filter((p) => p.id !== id);
    });
    if (previewItem?.item?.id === id) setPreviewItem(null);
  };

  const handleRenamePdf = (id, title) => {
    setPdfs((prev) => prev.map((p) => (p.id === id ? { ...p, title } : p)));
  };

  const handleImageUpload = (files) => {
    setUploadError('');
    if (!files || files.length === 0) return;

    const accepted = [];
    const errors = [];
    const startingOrder = images.length + 1;

    Array.from(files).forEach((file, idx) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const isImg = ALLOWED_IMAGE_MIMES.has(file.type) || ALLOWED_IMAGE_EXTS.has(ext);
      if (!isImg) {
        errors.push(
          isAr
            ? `«${file.name}» صيغة غير مدعومة (فقط PNG, JPG, WEBP).`
            : `"${file.name}" unsupported format (PNG, JPG, WEBP only).`
        );
        return;
      }
      if (file.size > MAX_STORAGE_FILE_SIZE_BYTES) {
        errors.push(
          isAr
            ? `«${file.name}» يتجاوز الحد الأقصى (50 ميجابايت).`
            : `"${file.name}" exceeds the 50 MB limit.`
        );
        return;
      }

      const order = startingOrder + accepted.length;
      accepted.push({
        id: `img-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        order,
        title: isAr
          ? `سبورة رقم ${order}: ${file.name.replace(/\.[^/.]+$/, '')}`
          : `Board #${order}: ${file.name.replace(/\.[^/.]+$/, '')}`,
        fileName: file.name,
        fileSize: formatSize(file.size),
        url: trackBlobUrl(file),
        caption: isAr ? 'رسم توضيحي للشرح وملاحظات السبورة' : 'Whiteboard diagram & notes',
        fileObj: file,
      });
    });

    if (errors.length > 0) setUploadError(errors[0]);
    if (accepted.length > 0) setImages((prev) => [...prev, ...accepted]);
  };

  const handleRemoveImage = (id) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target?.url) releaseBlobUrl(target.url);
      return prev.filter((img) => img.id !== id).map((item, idx) => ({ ...item, order: idx + 1 }));
    });
    if (previewItem?.item?.id === id) setPreviewItem(null);
  };

  const handleMoveImage = (index, delta) => {
    const nextIdx = index + delta;
    if (nextIdx < 0 || nextIdx >= images.length) return;
    setImages((prev) => {
      const updated = [...prev];
      [updated[index], updated[nextIdx]] = [updated[nextIdx], updated[index]];
      return updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const handleUpdateImageTitle = (id, title) => {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, title } : img)));
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px',
        boxShadow: 'var(--shadow-sm)',
        textAlign: isRtl ? 'right' : 'left',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-surface)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: '800',
              flexShrink: 0,
            }}
          >
            3
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={15} color="var(--primary)" />
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {isAr ? 'مرفقات وملازم الحصة (PDF وصور السبورة)' : 'Lesson Attachments (PDFs & Whiteboards)'}
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              {isAr
                ? 'أرفق ملازم الشرح وصور السبورة بالترتيب — تُرفع جميعها تلقائياً على الخادم السحابي'
                : 'Attach PDF booklets and ordered whiteboard photos — uploaded securely to cloud storage'}
            </p>
          </div>
        </div>

        {/* Subtabs */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '10px',
            padding: '4px',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveSubTab('pdfs');
              setUploadError('');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: activeSubTab === 'pdfs' ? 'var(--primary)' : 'transparent',
              color: activeSubTab === 'pdfs' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <FileText size={14} />
            <span>{isAr ? 'ملازم PDF' : 'PDFs'}</span>
            <span
              style={{
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: '6px',
                backgroundColor: activeSubTab === 'pdfs' ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
                color: activeSubTab === 'pdfs' ? '#FFFFFF' : 'var(--text-muted)',
              }}
            >
              {pdfs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSubTab('images');
              setUploadError('');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: activeSubTab === 'images' ? 'var(--primary)' : 'transparent',
              color: activeSubTab === 'images' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <ImageIcon size={14} />
            <span>{isAr ? 'صور السبورة' : 'Whiteboards'}</span>
            <span
              style={{
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: '6px',
                backgroundColor: activeSubTab === 'images' ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
                color: activeSubTab === 'images' ? '#FFFFFF' : 'var(--text-muted)',
              }}
            >
              {images.length}
            </span>
          </button>
        </div>
      </div>

      {/* Inline Upload Validation Error */}
      {uploadError && (
        <div
          style={{
            marginBottom: '12px',
            padding: '9px 12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#EF4444',
            fontSize: '12px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <span>{uploadError}</span>
        </div>
      )}

      {/* TAB 1: PDFs */}
      {activeSubTab === 'pdfs' && (
        <div>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingPdf(true);
            }}
            onDragLeave={() => setIsDraggingPdf(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingPdf(false);
              if (e.dataTransfer.files) handlePdfUpload(e.dataTransfer.files);
            }}
            onClick={() => pdfInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDraggingPdf ? 'var(--primary)' : 'var(--border-medium)'}`,
              borderRadius: '14px',
              padding: '20px 16px',
              backgroundColor: isDraggingPdf ? 'var(--primary-surface)' : 'var(--bg-subtle)',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '14px',
            }}
          >
            <input
              ref={pdfInputRef}
              type="file"
              multiple
              accept=".pdf,application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files) handlePdfUpload(e.target.files);
                e.target.value = '';
              }}
            />
            <UploadCloud size={22} color="var(--primary)" style={{ margin: '0 auto 6px', display: 'block' }} />
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {isAr ? 'اضغط لرفع ملفات PDF أو اسحبها إلى هنا' : 'Click or drag & drop PDF files'}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
              {isAr ? 'حتى 50 ميجابايت لكل ملف PDF' : 'Up to 50 MB per PDF file'}
            </div>
          </div>

          {pdfs.length === 0 ? (
            <div
              style={{
                padding: '18px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '10px',
                border: '1px dashed var(--border-subtle)',
                color: 'var(--text-muted)',
                fontSize: '12.5px',
              }}
            >
              {isAr ? 'لم تقم بإرفاق ملفات PDF لهذه الحصة بعد.' : 'No PDF booklets attached yet.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(239, 68, 68, 0.12)',
                        color: '#EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={18} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <input
                        type="text"
                        value={pdf.title}
                        onChange={(e) => handleRenamePdf(pdf.id, e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          fontWeight: '700',
                          fontFamily: 'inherit',
                          outline: 'none',
                          padding: 0,
                        }}
                      />
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {pdf.fileName} • {pdf.fileSize}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setPreviewItem({ type: 'pdf', item: pdf })}
                      title={isAr ? 'معاينة' : 'Preview'}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '7px',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Eye size={13} />
                      <span>{isAr ? 'معاينة' : 'Preview'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePdf(pdf.id)}
                      title={isAr ? 'حذف' : 'Delete'}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Ordered Whiteboard Images */}
      {activeSubTab === 'images' && (
        <div>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingImage(true);
            }}
            onDragLeave={() => setIsDraggingImage(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingImage(false);
              if (e.dataTransfer.files) handleImageUpload(e.dataTransfer.files);
            }}
            onClick={() => imageInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDraggingImage ? 'var(--primary)' : 'var(--border-medium)'}`,
              borderRadius: '14px',
              padding: '20px 16px',
              backgroundColor: isDraggingImage ? 'var(--primary-surface)' : 'var(--bg-subtle)',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '14px',
            }}
          >
            <input
              ref={imageInputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files) handleImageUpload(e.target.files);
                e.target.value = '';
              }}
            />
            <ImageIcon size={22} color="var(--primary)" style={{ margin: '0 auto 6px', display: 'block' }} />
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {isAr ? 'اضغط لرفع صور السبورة أو اسحبها إلى هنا' : 'Click or drop whiteboard photos'}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
              {isAr ? 'PNG, JPG, WEBP — يمكنك ترتيبها بالأسهم حسب تسلسل الشرح' : 'PNG, JPG, WEBP — reorder with arrows'}
            </div>
          </div>

          {images.length === 0 ? (
            <div
              style={{
                padding: '18px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '10px',
                border: '1px dashed var(--border-subtle)',
                color: 'var(--text-muted)',
                fontSize: '12.5px',
              }}
            >
              {isAr ? 'لم تضف صور سبورة لهذه الحصة بعد.' : 'No whiteboard images added yet.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    gap: '10px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                    <div
                      style={{
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
                        flexShrink: 0,
                      }}
                    >
                      #{img.order || idx + 1}
                    </div>
                    <div
                      onClick={() => setPreviewItem({ type: 'image', item: img })}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        cursor: 'pointer',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <img src={img.url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <input
                        type="text"
                        value={img.title}
                        onChange={(e) => handleUpdateImageTitle(img.id, e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          fontWeight: '700',
                          fontFamily: 'inherit',
                          outline: 'none',
                          padding: 0,
                        }}
                      />
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {img.fileName} • {img.fileSize}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveImage(idx, -1)}
                      title={isAr ? 'تقديم للأعلى' : 'Move up'}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        cursor: idx === 0 ? 'not-allowed' : 'pointer',
                        opacity: idx === 0 ? 0.4 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMoveImage(idx, 1)}
                      title={isAr ? 'تأخير للأسفل' : 'Move down'}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        cursor: idx === images.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: idx === images.length - 1 ? 0.4 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewItem({ type: 'image', item: img })}
                      title={isAr ? 'معاينة' : 'Preview'}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      title={isAr ? 'حذف' : 'Delete'}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REAL Preview Modal (iframe for PDF + img for Whiteboard) */}
      {previewItem && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewItem(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(4px)',
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
              border: '1px solid var(--border-medium)',
              borderRadius: '16px',
              maxWidth: '880px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                {previewItem.type === 'pdf' ? (
                  <FileText size={17} color="#EF4444" />
                ) : (
                  <ImageIcon size={17} color="var(--primary)" />
                )}
                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {previewItem.item?.title || previewItem.item?.fileName}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {previewItem.item?.url && (
                  <a
                    href={previewItem.item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 10px',
                      borderRadius: '7px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      textDecoration: 'none',
                    }}
                  >
                    <ExternalLink size={13} />
                    <span>{isAr ? 'فتح' : 'Open'}</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  style={{
                    width: '30px',
                    height: '30px',
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

            <div style={{ padding: '16px', overflowY: 'auto', textAlign: 'center', backgroundColor: 'var(--bg-subtle)' }}>
              {previewItem.type === 'image' ? (
                <img
                  src={previewItem.item?.url}
                  alt={previewItem.item?.title}
                  style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '10px' }}
                />
              ) : (
                <iframe
                  src={previewItem.item?.url}
                  title={previewItem.item?.fileName || 'PDF'}
                  style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '10px', backgroundColor: '#FFFFFF' }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
