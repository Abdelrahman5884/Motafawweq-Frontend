import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  UploadCloud, 
  Trash2, 
  Eye, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  CheckCircle2, 
  X, 
  Layers, 
  ExternalLink 
} from 'lucide-react';

export const LessonAttachmentsManager = ({
  pdfs = [],
  setPdfs,
  images = [],
  setImages,
  lang = 'ar',
  isRtl = true
}) => {
  const [activeSubTab, setActiveSubTab] = useState('pdfs'); // 'pdfs' | 'images'
  const [previewItem, setPreviewItem] = useState(null); // { type: 'pdf' | 'image', item: object }
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  const pdfInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Format file size
  const formatSize = (bytes) => {
    if (typeof bytes === 'string') return bytes;
    if (!bytes) return '1.5 MB';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Add multiple PDFs
  const handlePdfUpload = (files) => {
    if (!files || files.length === 0) return;
    const newItems = Array.from(files).map((file, idx) => ({
      id: `pdf-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      fileName: file.name,
      fileSize: formatSize(file.size),
      pagesCount: Math.floor(Math.random() * 18) + 4,
      uploadedAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      url: URL.createObjectURL(file),
      fileObj: file
    }));
    setPdfs(prev => [...prev, ...newItems]);
  };

  // Remove a PDF
  const handleRemovePdf = (id) => {
    setPdfs(prev => prev.filter(p => p.id !== id));
    if (previewItem && previewItem.item?.id === id) setPreviewItem(null);
  };

  // Add multiple Images
  const handleImageUpload = (files) => {
    if (!files || files.length === 0) return;
    const startingOrder = images.length + 1;
    const newItems = Array.from(files).map((file, idx) => ({
      id: `img-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      order: startingOrder + idx,
      title: `سبورة رقم ${startingOrder + idx}: ${file.name.replace(/\.[^/.]+$/, '')}`,
      fileName: file.name,
      fileSize: formatSize(file.size),
      url: URL.createObjectURL(file),
      caption: lang === 'ar' ? 'رسم توضيحي للشرح وملاحظات السبورة' : 'Whiteboard diagram & lecture notes',
      fileObj: file
    }));
    setImages(prev => [...prev, ...newItems]);
  };

  // Remove Image
  const handleRemoveImage = (id) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      // Re-index orders
      return filtered.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
    if (previewItem && previewItem.item?.id === id) setPreviewItem(null);
  };

  // Move Image Order Up (swapping with previous)
  const handleMoveImageUp = (index) => {
    if (index === 0) return;
    setImages(prev => {
      const updated = [...prev];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      // update order attributes
      return updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  // Move Image Order Down (swapping with next)
  const handleMoveImageDown = (index) => {
    if (index === images.length - 1) return;
    setImages(prev => {
      const updated = [...prev];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      // update order attributes
      return updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px',
      marginTop: '24px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Layers size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? '2. مرفقات وملازم الحصة (كتب، ملازم، وصور السبورة)' : '2. Lesson Attachments (PDFs & Ordered Whiteboards)'}
            </h3>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
            {lang === 'ar'
              ? 'أضف أكثر من ملف PDF ومجموعة صور للسبورة بالترتيب لتظهر للطالب مع الفيديو أو التسجيل الصوتي'
              : 'Attach multiple PDF notes and ordered whiteboard photos for students alongside the lesson'}
          </p>
        </div>

        {/* Subtabs: PDFs vs Images */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: '12px',
          padding: '4px',
          gap: '4px'
        }}>
          <button
            type="button"
            onClick={() => setActiveSubTab('pdfs')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeSubTab === 'pdfs' ? 'var(--primary)' : 'transparent',
              color: activeSubTab === 'pdfs' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <FileText size={15} />
            <span>{lang === 'ar' ? 'ملفات PDF وملازم' : 'PDF Booklets'}</span>
            <span style={{
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '6px',
              backgroundColor: activeSubTab === 'pdfs' ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
              color: activeSubTab === 'pdfs' ? '#FFFFFF' : 'var(--text-muted)'
            }}>
              {pdfs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('images')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeSubTab === 'images' ? 'var(--primary)' : 'transparent',
              color: activeSubTab === 'images' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <ImageIcon size={15} />
            <span>{lang === 'ar' ? 'صور السبورة (بالترتيب)' : 'Whiteboard Photos'}</span>
            <span style={{
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '6px',
              backgroundColor: activeSubTab === 'images' ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
              color: activeSubTab === 'images' ? '#FFFFFF' : 'var(--text-muted)'
            }}>
              {images.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: PDFS MANAGER */}
      {activeSubTab === 'pdfs' && (
        <div>
          {/* Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDraggingPdf(true); }}
            onDragLeave={() => setIsDraggingPdf(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingPdf(false);
              if (e.dataTransfer.files) handlePdfUpload(e.dataTransfer.files);
            }}
            onClick={() => pdfInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDraggingPdf ? 'var(--primary)' : 'var(--border-medium)'}`,
              borderRadius: '16px',
              padding: '24px 20px',
              backgroundColor: isDraggingPdf ? 'var(--primary-surface)' : 'var(--bg-subtle)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '16px'
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
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary-surface)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px'
            }}>
              <UploadCloud size={24} />
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {lang === 'ar' ? 'اضغط لرفع ملفات PDF أو اسحبها إلى هنا (يمكنك رفع أكثر من ملف)' : 'Click or drag & drop multiple PDF files'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'يدعم ملازم الشرح، بنوك الأسئلة، والكتب المدرسية بصيغة PDF' : 'Supports notes, question banks, and textbooks'}
            </div>
          </div>

          {/* PDF List */}
          {pdfs.length === 0 ? (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '12px',
              border: '1px dashed var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '13px'
            }}>
              {lang === 'ar' ? 'لم تقم بإرفاق ملفات PDF لهذه الحصة بعد.' : 'No PDF booklets attached yet.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pdfs.map((pdf, idx) => (
                <div
                  key={pdf.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      color: '#EF4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <FileText size={20} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontSize: '13.5px',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {pdf.title || pdf.fileName}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
                        <span>{pdf.fileSize}</span>
                        <span>•</span>
                        <span>{pdf.pagesCount || 10} {lang === 'ar' ? 'صفحة' : 'pages'}</span>
                        <span>•</span>
                        <span style={{ color: 'var(--primary)', fontWeight: '600' }}>PDF</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setPreviewItem({ type: 'pdf', item: pdf })}
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
                      <Eye size={14} />
                      <span>{lang === 'ar' ? 'معاينة' : 'Preview'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePdf(pdf.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer'
                      }}
                      title={lang === 'ar' ? 'حذف الملف' : 'Delete file'}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: IMAGES MANAGER (WITH ORDERING) */}
      {activeSubTab === 'images' && (
        <div>
          {/* Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDraggingImage(true); }}
            onDragLeave={() => setIsDraggingImage(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingImage(false);
              if (e.dataTransfer.files) handleImageUpload(e.dataTransfer.files);
            }}
            onClick={() => imageInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDraggingImage ? 'var(--primary)' : 'var(--border-medium)'}`,
              borderRadius: '16px',
              padding: '24px 20px',
              backgroundColor: isDraggingImage ? 'var(--primary-surface)' : 'var(--bg-subtle)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '16px'
            }}
          >
            <input
              ref={imageInputRef}
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files) handleImageUpload(e.target.files);
                e.target.value = '';
              }}
            />
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary-surface)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px'
            }}>
              <ImageIcon size={24} />
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {lang === 'ar' ? 'اضغط لرفع صور السبورة والشرح (يمكنك اختيار أكثر من صورة معاً)' : 'Click or drop multiple whiteboard/board photos'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'يمكنك إعادة ترتيب الصور للأعلى والأسفل حسب تسلسل الشرح في القاعة' : 'You can re-order photos up/down according to explanation sequence'}
            </div>
          </div>

          {/* Images Ordered Gallery */}
          {images.length === 0 ? (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '12px',
              border: '1px dashed var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '13px'
            }}>
              {lang === 'ar' ? 'لم تضف صور سبورة لهذه الحصة بعد.' : 'No whiteboard images added yet.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 4px',
                fontSize: '12px',
                color: 'var(--text-secondary)'
              }}>
                <span>{lang === 'ar' ? `الصور مرتبة تسلسلياً (${images.length} صور):` : `Ordered Photos (${images.length}):`}</span>
                <span style={{ fontSize: '11.5px', color: 'var(--primary)' }}>
                  {lang === 'ar' ? 'استخدم أزرار الأسهم لتقديم أو تأخير ترتيب أي صورة' : 'Use arrow buttons to adjust order'}
                </span>
              </div>

              {images.map((img, idx) => (
                <div
                  key={img.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    gap: '14px',
                    transition: 'border-color 0.15s ease'
                  }}
                >
                  {/* Left: Sequence Badge + Thumbnail + Details */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
                    {/* Order Badge */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: '800',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(21, 136, 199, 0.3)'
                    }}>
                      #{img.order || idx + 1}
                    </div>

                    {/* Thumbnail */}
                    <div
                      onClick={() => setPreviewItem({ type: 'image', item: img })}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        backgroundColor: '#1E293B',
                        flexShrink: 0,
                        cursor: 'pointer',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontSize: '13.5px',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginBottom: '3px'
                      }}>
                        {img.title}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        {img.caption || img.fileName} • {img.fileSize}
                      </div>
                    </div>
                  </div>

                  {/* Right: Re-ordering Buttons & Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {/* Move Up */}
                    <button
                      type="button"
                      onClick={() => handleMoveImageUp(idx)}
                      disabled={idx === 0}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        color: idx === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                        cursor: idx === 0 ? 'not-allowed' : 'pointer',
                        opacity: idx === 0 ? 0.4 : 1
                      }}
                      title={lang === 'ar' ? 'تقديم الترتيب للأعلى' : 'Move up'}
                    >
                      <ArrowUp size={15} />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      onClick={() => handleMoveImageDown(idx)}
                      disabled={idx === images.length - 1}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        color: idx === images.length - 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                        cursor: idx === images.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: idx === images.length - 1 ? 0.4 : 1
                      }}
                      title={lang === 'ar' ? 'تأخير الترتيب للأسفل' : 'Move down'}
                    >
                      <ArrowDown size={15} />
                    </button>

                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewItem({ type: 'image', item: img })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer'
                      }}
                      title={lang === 'ar' ? 'تكبير ومعاينة' : 'Enlarge preview'}
                    >
                      <Eye size={15} />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer'
                      }}
                      title={lang === 'ar' ? 'حذف الصورة' : 'Delete image'}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: '20px',
            maxWidth: previewItem.type === 'pdf' ? '760px' : '820px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {previewItem.type === 'pdf' ? <FileText size={18} color="var(--primary)" /> : <ImageIcon size={18} color="var(--primary)" />}
                <span style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {previewItem.item?.title || previewItem.item?.fileName}
                </span>
                {previewItem.type === 'image' && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF'
                  }}>
                    #{previewItem.item?.order}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
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

            {/* Modal Body */}
            <div style={{ padding: '20px', overflowY: 'auto', textAlign: 'center', backgroundColor: 'var(--bg-subtle)' }}>
              {previewItem.type === 'image' ? (
                <div>
                  <img
                    src={previewItem.item?.url}
                    alt={previewItem.item?.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '65vh',
                      objectFit: 'contain',
                      borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }}
                  />
                  <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {previewItem.item?.caption}
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '40px 24px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center'
                }}>
                  <FileText size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                    {previewItem.item?.fileName}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
                    {previewItem.item?.fileSize} • {previewItem.item?.pagesCount} صفحات • ملف مذكرة رقمية جاهز للطباعة والتحميل للطالب
                  </p>
                  <a
                    href={previewItem.item?.url || '#'}
                    download={previewItem.item?.fileName}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
