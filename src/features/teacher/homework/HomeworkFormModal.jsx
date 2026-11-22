import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  BookOpen,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Eye,
  Trash2,
  AlertCircle,
  Loader2,
  Paperclip,
  Cloud,
} from 'lucide-react';
import {
  MAX_HOMEWORK_FILE_BYTES,
  ALLOWED_HOMEWORK_MIMES,
  ALLOWED_HOMEWORK_EXTENSIONS,
  formatFileSize,
} from './homeworkConstants';

export const HomeworkFormModal = ({
  isOpen,
  editingHomework,
  form,
  onFormChange,
  availableCourses,
  availableLessons,
  locationOptions,
  selectedFile,
  onSelectFile,
  onClearSelectedFile,
  isSubmitting,
  uploadProgress,
  submitError,
  onClearError,
  isAr,
  onClose,
  onSubmit,
  onPreviewAttachment,
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState('');

  const previewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : ''),
    [selectedFile]
  );

  useEffect(() => {
    if (!previewUrl) return undefined;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  const filteredLessons = useMemo(() => {
    if (!form.courseId) return availableLessons;
    return availableLessons.filter((l) => !l.courseId || l.courseId === form.courseId);
  }, [availableLessons, form.courseId]);

  if (!isOpen) return null;

  const isEditing = Boolean(editingHomework);
  const hasExistingServerFile =
    isEditing && Boolean(editingHomework?.attachmentUrl) && !form.removeExistingAttachment && !selectedFile;

  const validateAndPickFile = (file) => {
    setLocalError('');
    onClearError();
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const mimeOk = ALLOWED_HOMEWORK_MIMES.has(file.type) || ALLOWED_HOMEWORK_EXTENSIONS.has(ext);
    if (!mimeOk) {
      setLocalError(
        isAr
          ? 'صيغة الملف غير مدعومة. يُسمح فقط بملفات PDF أو صور (PNG, JPG, WEBP).'
          : 'Unsupported format. Only PDF, PNG, JPG, and WEBP are allowed.'
      );
      return;
    }

    if (file.size > MAX_HOMEWORK_FILE_BYTES) {
      setLocalError(
        isAr
          ? `حجم الملف (${formatFileSize(file.size, true)}) يتجاوز الحد الأقصى المسموح به (25 ميجابايت).`
          : `File size exceeds the 25 MB limit.`
      );
      return;
    }

    onSelectFile(file);
    onFormChange({ removeExistingAttachment: false });
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) validateAndPickFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndPickFile(file);
  };

  const selectedIsImage = selectedFile
    ? selectedFile.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(selectedFile.name)
    : false;

  const displayError = localError || submitError;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => !isSubmitting && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '18px',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {isEditing
                ? isAr
                  ? 'تعديل بيانات وملف الواجب'
                  : 'Edit Homework Assignment'
                : isAr
                  ? 'إضافة وتكليف واجب جديد'
                  : 'Create New Homework'}
            </h3>
          </div>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: isSubmitting ? 'not-allowed' : 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Title */}
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              {isAr ? 'عنوان الواجب والتطبيق:' : 'Assignment Title:'}
            </label>
            <input
              type="text"
              required
              minLength={3}
              placeholder={isAr ? 'مثال: واجب الأسبوع 4 — مسائل وتدريبات الباب الأول' : 'e.g. Week 4 Homework'}
              value={form.title}
              onChange={(e) => onFormChange({ title: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Course & Lesson */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {isAr ? 'المقرر / الكورس:' : 'Course:'}
              </label>
              <select
                value={form.courseId}
                onChange={(e) => {
                  const chosen = availableCourses.find((c) => (c.id || c.uuid) === e.target.value);
                  onFormChange({
                    courseId: e.target.value,
                    courseTitle: chosen ? chosen.titleAr || chosen.title || '' : '',
                    lessonId: '',
                  });
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">{isAr ? 'اختر المقرر (اختياري)' : 'Select Course (optional)'}</option>
                {availableCourses.map((c) => (
                  <option key={c.id || c.uuid} value={c.id || c.uuid}>
                    {c.titleAr || c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {isAr ? 'الحصة المرتبطة:' : 'Linked Lesson:'}
              </label>
              {filteredLessons.length > 0 ? (
                <select
                  value={form.lessonId}
                  onChange={(e) => {
                    const chosen = filteredLessons.find((l) => (l.id || l.uuid) === e.target.value);
                    onFormChange({
                      lessonId: e.target.value,
                      lessonTitle: chosen ? chosen.titleAr || chosen.title || '' : form.lessonTitle,
                    });
                  }}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '12.5px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">{isAr ? 'حصة عامة / مخصصة' : 'General / Custom lesson'}</option>
                  {filteredLessons.map((l) => (
                    <option key={l.id || l.uuid} value={l.id || l.uuid}>
                      {l.titleAr || l.title}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={form.lessonTitle}
                  onChange={(e) => onFormChange({ lessonTitle: e.target.value, lessonId: '' })}
                  placeholder={isAr ? 'مثال: الحصة الأولى أو الباب الثاني' : 'e.g. Lesson 1'}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '12.5px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              )}
            </div>
          </div>

          {/* Target Location (Dynamic from teacher's real study groups) */}
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              {isAr ? 'المجموعة / المكان المستهدف:' : 'Target Group / Location:'}
            </label>
            <select
              value={form.targetLocationId}
              onChange={(e) => {
                const loc = locationOptions.find((l) => l.id === e.target.value);
                onFormChange({
                  targetLocationId: e.target.value,
                  targetLocationAr: loc?.label || '',
                });
              }}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            >
              {locationOptions.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Type Switcher */}
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              {isAr ? 'نوع الواجب:' : 'Assignment Format:'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => onFormChange({ type: 'file' })}
                style={{
                  padding: '9px',
                  borderRadius: '8px',
                  border: `1.5px solid ${form.type === 'file' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  backgroundColor: form.type === 'file' ? 'rgba(0, 102, 204, 0.1)' : 'var(--bg-subtle)',
                  color: form.type === 'file' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <UploadCloud size={14} />
                <span>{isAr ? 'ملف PDF أو صورة (على الخادم)' : 'PDF / Image Upload'}</span>
              </button>

              <button
                type="button"
                onClick={() => onFormChange({ type: 'text' })}
                style={{
                  padding: '9px',
                  borderRadius: '8px',
                  border: `1.5px solid ${form.type === 'text' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  backgroundColor: form.type === 'text' ? 'rgba(0, 102, 204, 0.1)' : 'var(--bg-subtle)',
                  color: form.type === 'text' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <FileText size={14} />
                <span>{isAr ? 'كتابة الواجب كنص ومسائل' : 'Written Text Task'}</span>
              </button>
            </div>
          </div>

          {/* File Upload Area */}
          {form.type === 'file' && (
            <div
              style={{
                padding: '14px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  <Paperclip size={14} color="var(--primary)" />
                  <span>{isAr ? 'ملف الواجب المرفق (PDF / PNG / JPG / WEBP — حد أقصى 25 م.ب):' : 'Homework Attachment (PDF or Image, max 25 MB):'}</span>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--success)', fontWeight: '700' }}>
                  <Cloud size={12} />
                  <span>{isAr ? 'رفع مباشر للسيرفر' : 'Cloud Upload'}</span>
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf,image/png,image/jpeg,image/webp"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />

              {/* Existing Server File (in Edit mode) */}
              {hasExistingServerFile && (
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                    {editingHomework.fileType === 'image' ? (
                      <ImageIcon size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                    ) : (
                      <FileText size={20} color="#EF4444" style={{ flexShrink: 0 }} />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {editingHomework.attachmentName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {isAr ? 'الملف الحالي المرفوع على الخادم' : 'Current server file'}
                        {editingHomework.attachmentSizeLabel ? ` • ${editingHomework.attachmentSizeLabel}` : ''}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() =>
                        onPreviewAttachment({
                          url: editingHomework.attachmentUrl,
                          downloadUrl: editingHomework.attachmentDownloadUrl || editingHomework.attachmentUrl,
                          name: editingHomework.attachmentName,
                          type: editingHomework.fileType === 'image' ? 'image' : 'pdf',
                        })
                      }
                      style={{
                        padding: '5px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                      }}
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '5px 9px',
                        borderRadius: '6px',
                        border: '1px solid var(--primary)',
                        backgroundColor: 'transparent',
                        color: 'var(--primary)',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      {isAr ? 'استبدال' : 'Replace'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onFormChange({ removeExistingAttachment: true })}
                      title={isAr ? 'إزالة الملف' : 'Remove'}
                      style={{
                        padding: '5px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'transparent',
                        color: '#EF4444',
                        cursor: 'pointer',
                        display: 'flex',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* Newly Picked File Preview */}
              {selectedFile ? (
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1.5px solid var(--primary)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                    {selectedIsImage && previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: '#EF4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <FileText size={18} />
                      </div>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedFile.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {formatFileSize(selectedFile.size, isAr)} • {selectedIsImage ? (isAr ? 'صورة' : 'Image') : 'PDF'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {previewUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          onPreviewAttachment({
                            url: previewUrl,
                            name: selectedFile.name,
                            type: selectedIsImage ? 'image' : 'pdf',
                          })
                        }
                        style={{
                          padding: '5px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                        }}
                      >
                        <Eye size={13} />
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => {
                        onClearSelectedFile();
                        setLocalError('');
                      }}
                      style={{
                        padding: '5px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'transparent',
                        color: '#EF4444',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        display: 'flex',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ) : !hasExistingServerFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(false);
                  }}
                  onDrop={handleDrop}
                  style={{
                    padding: '22px 16px',
                    borderRadius: '10px',
                    backgroundColor: isDragging ? 'rgba(0, 102, 204, 0.08)' : 'var(--bg-surface-elevated)',
                    border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <UploadCloud size={26} color="var(--primary)" />
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {isAr ? 'انقر لاختيار ملف PDF أو صورة، أو اسحبه هنا' : 'Click to choose PDF or image, or drag & drop'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    {isAr ? 'سيتم رفع الملف وتأمينه تلقائياً على خادم التخزين السحابي' : 'Automatically uploaded and secured on cloud storage'}
                  </div>
                </div>
              ) : null}

              {/* Upload Progress Bar */}
              {isSubmitting && uploadProgress > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                    <span>{isAr ? 'جاري رفع الملف إلى الخادم...' : 'Uploading file to server...'}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '999px', backgroundColor: 'var(--bg-surface-elevated)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${uploadProgress}%`,
                        height: '100%',
                        backgroundColor: 'var(--primary)',
                        transition: 'width 0.2s ease',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions / Text Content (Required for text type, optional instructions for file type) */}
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              {form.type === 'text'
                ? isAr
                  ? 'نص ومسائل الواجب (مطلوب):'
                  : 'Assignment Questions (required):'
                : isAr
                  ? 'ملاحظات أو تعليمات إضافية للطلاب (اختياري):'
                  : 'Additional Instructions for Students (optional):'}
            </label>
            <textarea
              rows={form.type === 'text' ? 4 : 2}
              required={form.type === 'text'}
              value={form.textContent}
              onChange={(e) => onFormChange({ textContent: e.target.value })}
              placeholder={
                form.type === 'text'
                  ? isAr
                    ? 'اكتب نصوص الأسئلة والمسائل المطلوب من الطالب حلها بالتفصيل...'
                    : 'Write the homework questions and exercises...'
                  : isAr
                    ? 'مثال: حل المسائل من 1 إلى 10 في الشيت المرفق بخطوات واضحة...'
                    : 'e.g. Solve exercises 1–10 in the attached sheet...'
              }
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Max Grade and Deadline */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {isAr ? 'درجة الواجب:' : 'Max Grade:'}
              </label>
              <input
                type="number"
                min="1"
                max="500"
                required
                value={form.maxGrade}
                onChange={(e) => onFormChange({ maxGrade: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {isAr ? 'تاريخ التسليم:' : 'Due Date:'}
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => onFormChange({ dueDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {isAr ? 'ساعة الديدلاين:' : 'Due Time:'}
              </label>
              <input
                type="time"
                value={form.dueTime}
                onChange={(e) => onFormChange({ dueTime: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Error Banner */}
          {displayError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{displayError}</span>
            </div>
          )}

          {/* Footer Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '9px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.78 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
              }}
            >
              {isSubmitting && <Loader2 size={14} className="hw-spin" />}
              <span>
                {isSubmitting
                  ? isAr
                    ? 'جاري الحفظ والرفع...'
                    : 'Saving...'
                  : isEditing
                    ? isAr
                      ? 'حفظ التعديلات'
                      : 'Save Changes'
                    : isAr
                      ? 'نشر الواجب للطلاب'
                      : 'Publish Homework'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
