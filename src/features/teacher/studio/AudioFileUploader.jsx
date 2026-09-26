import React, { useRef, useState } from 'react';
import { UploadCloud, Sparkles, Music, Trash2, CheckCircle2, Play, Volume2 } from 'lucide-react';

export const AudioFileUploader = ({
  uploadedFile,
  lang,
  onSelectFile,
  onStartProcessing
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const formattedSize = file.size < 1024 * 1024 
      ? `${(file.size / 1024).toFixed(1)} KB` 
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    onSelectFile({
      name: file.name,
      size: formattedSize,
      url: URL.createObjectURL(file),
      rawFile: file
    });
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
        style={{ display: 'none' }}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {!uploadedFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
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
            padding: '52px 24px',
            backgroundColor: isDragging ? 'var(--primary-surface)' : 'var(--bg-subtle)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textAlign: 'center'
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: 'var(--primary-surface)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <UploadCloud size={34} />
          </div>
          <h4 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
            {lang === 'ar' ? 'اسحب ملف الحصة الصوتي إلى هنا أو اضغط للاختيار' : 'Drag & drop your lecture audio file or click to browse'}
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
            {lang === 'ar' ? 'يدعم صيغ MP3, WAV, M4A, AAC حتى حجم 300 ميجابايت' : 'Supports MP3, WAV, M4A, AAC up to 300MB'}
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            style={{
              padding: '10px 24px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(21, 136, 199, 0.3)'
            }}
          >
            {lang === 'ar' ? 'اختيار ملف من جهازك' : 'Browse Local File'}
          </button>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          textAlign: 'center'
        }}>
          {/* File summary */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '20px',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Music size={22} />
              </div>
              <div style={{ textAlign: 'start', minWidth: 0, flex: 1 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {uploadedFile.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {uploadedFile.size} • {lang === 'ar' ? 'ملف صوتي جاهز للتحليل والتفريغ' : 'Audio ready for ASR'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'تغيير الملف' : 'Change'}
              </button>
              <button
                type="button"
                onClick={() => onSelectFile(null)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: 'none',
                  color: '#EF4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={lang === 'ar' ? 'حذف الملف' : 'Delete file'}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Audio Player if URL exists */}
          {uploadedFile.url && (
            <div style={{ marginBottom: '24px' }}>
              <audio
                controls
                src={uploadedFile.url}
                style={{ width: '100%', maxWidth: '500px', margin: '0 auto', display: 'block' }}
              />
            </div>
          )}

          {/* Start Processing Action */}
          <button
            onClick={onStartProcessing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 34px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '15px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(21, 136, 199, 0.4)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Sparkles size={18} />
            <span>{lang === 'ar' ? 'بدء المعالجة بالذكاء الاصطناعي الآن' : 'Start AI Processing Now'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
