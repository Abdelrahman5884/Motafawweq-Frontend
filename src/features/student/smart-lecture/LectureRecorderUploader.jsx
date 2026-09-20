import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Mic, 
  MicOff, 
  Sparkles, 
  FileText, 
  Video, 
  Music, 
  CheckCircle2, 
  X
} from 'lucide-react';

export const LectureRecorderUploader = ({
  lang = 'ar',
  isRecording,
  recordSeconds,
  formatSecs,
  uploadedFile,
  uploadProgress = 0,
  uploadStatus = 'idle', // 'idle' | 'uploading' | 'processing' | 'done'
  onToggleRecording,
  onFileUpload,
  onResetFile
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  // Helper to determine icon based on file type / name
  const getFileIcon = (file) => {
    if (!file) return <FileText size={22} color="var(--primary)" />;
    const name = file.name?.toLowerCase() || '';
    const type = file.type?.toLowerCase() || '';
    if (type.includes('audio') || name.match(/\.(mp3|wav|m4a|aac|ogg)$/)) {
      return <Music size={22} color="var(--primary)" />;
    }
    if (type.includes('video') || name.match(/\.(mp4|mkv|mov|avi|webm)$/)) {
      return <Video size={22} color="var(--primary)" />;
    }
    return <FileText size={22} color="var(--primary)" />;
  };

  const isRtl = lang === 'ar';

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '20px',
      padding: '22px 24px',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-sm)',
      transition: 'border-color 0.2s ease'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '26px',
            height: '26px',
            borderRadius: '8px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)'
          }}>
            <Sparkles size={14} />
          </span>
          <h2 style={{
            fontSize: '15px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: 0,
            fontFamily: 'var(--font-arabic)'
          }}>
            {isRtl ? 'إدخال محتوى المحاضرة' : 'Lecture Input Source'}
          </h2>
        </div>

        <div style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span>{isRtl ? 'صيغ مدعومة: PDF • Word • MP3 • MP4' : 'Supported: PDF • DOCX • MP3 • MP4'}</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px'
      }}>
        {/* Box 1: File/Media Upload Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (uploadStatus === 'idle' && fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          style={{
            border: isDragOver 
              ? '1.5px dashed var(--primary)' 
              : uploadStatus !== 'idle' 
                ? '1px solid var(--border-subtle)' 
                : '1.5px dashed var(--border-medium)',
            borderRadius: '16px',
            padding: '20px',
            backgroundColor: isDragOver 
              ? 'var(--primary-surface)' 
              : uploadStatus !== 'idle'
                ? 'var(--bg-surface)'
                : 'var(--bg-subtle)',
            position: 'relative',
            cursor: uploadStatus === 'idle' ? 'pointer' : 'default',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '135px',
            transition: 'all 0.2s ease'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.txt"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />

          {uploadStatus === 'idle' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                marginBottom: '10px',
                boxShadow: 'var(--shadow-xs)'
              }}>
                <UploadCloud size={22} />
              </div>
              
              <div style={{
                fontSize: '13.5px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '4px',
                fontFamily: 'var(--font-arabic)'
              }}>
                {isRtl ? 'اسحب وأفلت أو اضغط لرفع ملف' : 'Drop or browse to upload'}
              </div>

              <div style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                lineHeight: 1.4
              }}>
                {isRtl ? 'فيديو، تسجيل صوتي، أو مستند دراسي (PDF / Word)' : 'Video, Audio recording, or Document (PDF / Word)'}
              </div>
            </div>
          ) : (
            /* Uploading / Processing / Done State */
            <div style={{ width: '100%' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: uploadStatus === 'done' ? 'var(--success-light)' : 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {uploadStatus === 'done' ? (
                      <CheckCircle2 size={20} color="var(--success)" />
                    ) : (
                      getFileIcon(uploadedFile)
                    )}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '220px'
                    }}>
                      {uploadedFile?.name || (isRtl ? 'محاضرة_التنفس_الخلوي.mp4' : 'lecture_file.mp4')}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {uploadedFile?.sizeFormatted || '18.4 MB'}
                      {uploadStatus === 'uploading' && ` • ${isRtl ? 'جاري الرفع' : 'Uploading'} (${uploadProgress}%)`}
                      {uploadStatus === 'processing' && ` • ${isRtl ? 'جاري المعالجة بالذكاء الاصطناعي...' : 'AI Processing...'}`}
                      {uploadStatus === 'done' && ` • ${isRtl ? 'تمت المعالجة بنجاح' : 'Processed'}`}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {uploadStatus === 'done' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (fileInputRef.current) fileInputRef.current.click();
                      }}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)',
                        fontSize: '11.5px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {isRtl ? 'استبدال' : 'Replace'}
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onResetFile) onResetFile();
                    }}
                    title={isRtl ? 'إلغاء' : 'Cancel'}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Progress Bar with smooth percentage */}
              <div style={{
                height: '6px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '99px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  height: '100%',
                  width: `${uploadStatus === 'processing' || uploadStatus === 'done' ? 100 : uploadProgress}%`,
                  backgroundColor: uploadStatus === 'done' ? 'var(--success)' : 'var(--primary)',
                  borderRadius: '99px',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              {/* Status Hint */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '8px',
                fontSize: '11px',
                color: uploadStatus === 'done' ? 'var(--success)' : 'var(--text-secondary)'
              }}>
                <span>
                  {uploadStatus === 'uploading' && (isRtl ? 'يتم الآن نقل الملف إلى استوديو المعالجة...' : 'Uploading file...')}
                  {uploadStatus === 'processing' && (isRtl ? 'جاري استخراج محاور الشرح والنص المفرغ...' : 'Generating transcript & mindmap...')}
                  {uploadStatus === 'done' && (isRtl ? 'جاهز للعرض والتصفح الذكي' : 'Ready for study')}
                </span>
                <span style={{ fontWeight: '700' }}>
                  {uploadStatus === 'uploading' ? `${uploadProgress}%` : uploadStatus === 'processing' ? '99%' : '100%'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Box 2: Direct Voice Recording Box */}
        <div style={{
          border: isRecording 
            ? '1.5px solid var(--danger)' 
            : '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '20px',
          backgroundColor: isRecording 
            ? 'rgba(220, 38, 38, 0.04)' 
            : 'var(--bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          minHeight: '135px',
          transition: 'all 0.2s ease'
        }}>
          <button
            onClick={onToggleRecording}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              backgroundColor: isRecording ? 'var(--danger)' : 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: isRecording 
                ? '0 0 16px rgba(220, 38, 38, 0.35)' 
                : '0 2px 8px rgba(21, 136, 199, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            {isRecording ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '13.5px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-arabic)'
            }}>
              {isRecording 
                ? (isRtl ? `جاري تسجيل الصوت: ${formatSecs(recordSeconds)}` : `Recording: ${formatSecs(recordSeconds)}`)
                : (isRtl ? 'تسجيل مباشر من المايكروفون' : 'Direct Microphone Recording')}
            </div>
            
            <div style={{
              fontSize: '12px',
              color: isRecording ? 'var(--danger)' : 'var(--text-secondary)',
              marginTop: '4px',
              lineHeight: 1.4
            }}>
              {isRecording 
                ? (isRtl ? 'اضغط للإيقاف وتحويل الشرح إلى نص وخريطة' : 'Click to stop & generate mindmap')
                : (isRtl ? 'سجل صوت الحصة مباشرة من القاعة الدراسية' : 'Record classroom lecture live')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
