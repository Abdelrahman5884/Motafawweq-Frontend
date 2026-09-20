import React from 'react';
import { UploadCloud, Sparkles } from 'lucide-react';

export const AudioFileUploader = ({
  uploadedFile,
  lang,
  onSelectFile,
  onStartProcessing
}) => {
  return (
    <div
      style={{
        border: '2px dashed var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '48px 24px',
        backgroundColor: 'var(--bg-subtle)',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease'
      }}
      onClick={() => {
        onSelectFile({ name: 'biology_lesson_photosynthesis_full.mp3', size: '38.4 MB' });
      }}
    >
      <UploadCloud size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
      <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
        {uploadedFile 
          ? (lang === 'ar' ? `تم اختيار: ${uploadedFile.name} (${uploadedFile.size})` : `Selected: ${uploadedFile.name} (${uploadedFile.size})`)
          : (lang === 'ar' ? 'اسحب ملف الحصة الصوتي إلى هنا أو اضغط للاختيار' : 'Drag & drop your lecture audio file or click to browse')}
      </h4>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
        {lang === 'ar' ? 'يدعم صيغ MP3, WAV, M4A, AAC حتى حجم 300 ميجابايت' : 'Supports MP3, WAV, M4A, AAC up to 300MB'}
      </p>

      {uploadedFile && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStartProcessing();
          }}
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
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(21, 136, 199, 0.35)'
          }}
        >
          <Sparkles size={16} />
          <span>{lang === 'ar' ? 'بدء المعالجة بالذكاء الاصطناعي الآن' : 'Start AI Processing Now'}</span>
        </button>
      )}
    </div>
  );
};
