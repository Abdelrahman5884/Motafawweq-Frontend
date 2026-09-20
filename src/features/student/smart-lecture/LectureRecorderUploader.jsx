import React from 'react';
import { UploadCloud, Mic, MicOff, Sparkles } from 'lucide-react';

export const LectureRecorderUploader = ({
  lang,
  isRecording,
  recordSeconds,
  formatSecs,
  uploadedFileName,
  isProcessing,
  onToggleRecording,
  onSimulateUpload
}) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1.5px solid var(--border-medium)',
      borderRadius: '24px',
      padding: '24px',
      marginBottom: '28px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px' }}>
        {lang === 'ar' ? 'رفع محاضرة جديدة أو التسجيل المباشر من المايكروفون:' : 'Upload or Record Lecture Audio:'}
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {/* File Upload Box */}
        <div style={{
          border: '2px dashed var(--border-medium)',
          borderRadius: '18px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-subtle)',
          position: 'relative',
          cursor: 'pointer'
        }}>
          <input
            type="file"
            accept="audio/*,video/*"
            onChange={onSimulateUpload}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
          />
          <UploadCloud size={30} color="var(--primary)" style={{ margin: '0 auto 6px' }} />
          <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {uploadedFileName ? `تم اختيار: ${uploadedFileName}` : (lang === 'ar' ? 'رفع تسجيل صوتي أو فيديو (MP3, WAV, MP4)' : 'Upload Audio/Video')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            الذكاء الاصطناعي يحول الصوت إلى نص مقسم تلقائياً
          </div>
        </div>

        {/* Direct Voice Recording Box */}
        <div style={{
          border: isRecording ? '2px solid var(--danger)' : '1.5px solid var(--border-subtle)',
          borderRadius: '18px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: isRecording ? 'rgba(220, 38, 38, 0.08)' : 'var(--bg-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <button
            onClick={onToggleRecording}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: isRecording ? 'var(--danger)' : 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginBottom: '8px',
              boxShadow: isRecording ? '0 0 16px rgba(220, 38, 38, 0.5)' : 'none'
            }}
          >
            {isRecording ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {isRecording ? (lang === 'ar' ? `جاري التسجيل: ${formatSecs(recordSeconds)}` : `Recording: ${formatSecs(recordSeconds)}`) : (lang === 'ar' ? 'تسجيل صوت الحصة مباشرة من القاعة' : 'Record Live Lecture')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {isRecording ? 'اضغط للإيقاف وبدء التحليل الذكي' : 'اضغط على المايك لبدء التسجيل'}
          </div>
        </div>
      </div>

      {/* Processing Spinner */}
      {isProcessing && (
        <div style={{
          marginTop: '16px',
          padding: '14px',
          borderRadius: '14px',
          backgroundColor: 'rgba(21, 136, 199, 0.12)',
          color: 'var(--primary)',
          fontSize: '13px',
          fontWeight: '800',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <Sparkles size={16} />
          <span>{lang === 'ar' ? 'جاري تحويل الصوت إلى نص وتقسيم الموضوعات وبناء الخريطة التفاعلية...' : 'Transcribing and generating mindmap...'}</span>
        </div>
      )}
    </div>
  );
};
