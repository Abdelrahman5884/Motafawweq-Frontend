import React, { useRef, useState, useMemo, useEffect } from 'react';
import { UploadCloud, Sparkles, Music, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { MAX_STORAGE_FILE_SIZE_BYTES } from '../../../services/storageService';

const ALLOWED_AUDIO_EXTS = new Set(['mp3', 'wav', 'm4a', 'aac', 'ogg', 'webm', 'flac']);

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const AudioFileUploader = ({
  uploadedFile,
  lang,
  isProAiActive = false,
  isSubmitting = false,
  onSelectFile,
  onStartProcessing,
}) => {
  const isAr = lang === 'ar';
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const rawFile = uploadedFile?.rawFile || null;
  const previewUrl = useMemo(() => (rawFile ? URL.createObjectURL(rawFile) : ''), [rawFile]);

  useEffect(() => {
    if (!previewUrl) return undefined;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleFiles = (files) => {
    setError('');
    if (!files || files.length === 0) return;
    const file = files[0];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isAudio = (file.type || '').startsWith('audio/') || ALLOWED_AUDIO_EXTS.has(ext);

    if (!isAudio) {
      setError(
        isAr
          ? 'صيغة الملف غير مدعومة. يرجى اختيار ملف صوتي (MP3, WAV, M4A, AAC, OGG, WebM).'
          : 'Unsupported file format. Please choose an audio file (MP3, WAV, M4A, AAC, OGG, WebM).'
      );
      return;
    }

    if (file.size > MAX_STORAGE_FILE_SIZE_BYTES) {
      setError(
        isAr
          ? `حجم الملف (${formatBytes(file.size)}) يتجاوز الحد الأقصى للتخزين السحابي (50 ميجابايت).`
          : `File (${formatBytes(file.size)}) exceeds the 50 MB cloud storage limit.`
      );
      return;
    }

    onSelectFile({
      name: file.name,
      size: formatBytes(file.size),
      rawFile: file,
    });
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.webm"
        style={{ display: 'none' }}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {!uploadedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border-medium)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '44px 24px',
            backgroundColor: isDragging ? 'var(--primary-surface)' : 'var(--bg-subtle)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              backgroundColor: 'var(--primary-surface)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <UploadCloud size={30} />
          </div>
          <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
            {isAr ? 'اسحب ملف الحصة الصوتي إلى هنا أو اضغط للاختيار' : 'Drag & drop lecture audio or click to browse'}
          </h4>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
            {isAr ? 'يدعم صيغ MP3, WAV, M4A, AAC, OGG, WebM حتى 50 ميجابايت' : 'Supports MP3, WAV, M4A, AAC, OGG, WebM up to 50 MB'}
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            style={{
              padding: '9px 22px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(21, 136, 199, 0.3)',
            }}
          >
            {isAr ? 'اختيار ملف صوتي من جهازك' : 'Browse Audio File'}
          </button>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '16px',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Music size={20} />
              </div>
              <div style={{ textAlign: 'start', minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: '13.5px',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {uploadedFile.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {uploadedFile.size} • {isAr ? 'جاهز للرفع على الخادم السحابي' : 'Ready to upload to cloud'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isAr ? 'تغيير الملف' : 'Change'}
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setError('');
                  onSelectFile(null);
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: 'none',
                  color: '#EF4444',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title={isAr ? 'حذف الملف' : 'Delete file'}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {previewUrl && (
            <div style={{ marginBottom: '18px' }}>
              <audio
                controls
                src={previewUrl}
                style={{ width: '100%', maxWidth: '500px', margin: '0 auto', display: 'block' }}
              />
            </div>
          )}

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onStartProcessing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: '800',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              boxShadow: '0 6px 20px rgba(21, 136, 199, 0.35)',
            }}
          >
            {isProAiActive ? <Sparkles size={17} /> : <CheckCircle2 size={17} />}
            <span>
              {isProAiActive
                ? isAr
                  ? 'رفع الحصة وبدء المعالجة بالذكاء الاصطناعي'
                  : 'Upload & Start AI Processing'
                : isAr
                  ? 'رفع وحفظ الحصة الصوتية الآن'
                  : 'Upload & Publish Audio Lesson'}
            </span>
          </button>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: '12px',
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#EF4444',
            fontSize: '12.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'start',
          }}
        >
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
