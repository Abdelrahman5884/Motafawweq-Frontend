import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Sparkles, 
  FileText, 
  Video, 
  Music, 
  CheckCircle2, 
  X
} from 'lucide-react';
import { LectureOutputSelector } from './LectureOutputSelector';
import { LectureAiStagesProgress } from './LectureAiStagesProgress';

export const LectureRecorderUploader = ({
  lang = 'ar',
  uploadedFile,
  uploadProgress = 0,
  uploadStatus = 'idle', // 'idle' | 'uploading' | 'processing' | 'done'
  currentStageIndex = 0,
  selectedOutputs = ['graph', 'transcript', 'topics'],
  hasGenerated = false,
  onGenerate,
  onToggleOutput,
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
      padding: '20px',
      marginBottom: '20px',
      boxShadow: 'var(--shadow-sm)',
      transition: 'border-color 0.2s ease'
    }}>
      {/* Card Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
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
            fontSize: '14.5px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: 0,
            fontFamily: 'var(--font-arabic)'
          }}>
            {isRtl ? 'رفع ملف المحاضرة' : 'Lecture File Upload'}
          </h2>
        </div>

        <div style={{
          fontSize: '11.5px',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <span>{isRtl ? 'مستندات PDF و Word • فيديوهات • تسجيلات صوتية' : 'PDF • Word • Video • Audio'}</span>
        </div>
      </div>

      {/* File/Media Upload Dropzone (Full-width & calm) */}
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
          padding: '22px 18px',
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
          minHeight: '130px',
          transition: 'all 0.2s ease',
          width: '100%',
          boxSizing: 'border-box'
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
              marginBottom: '8px',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <UploadCloud size={22} />
            </div>
            
            <div style={{
              fontSize: '14px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '4px',
              fontFamily: 'var(--font-arabic)'
            }}>
              {isRtl ? 'اسحب وأفلت ملف المحاضرة هنا أو اضغط للاختيار' : 'Drop lecture file here or click to browse'}
            </div>

            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.4
            }}>
              {isRtl ? 'يدعم مستندات وملخصات PDF و Word، مقاطع الفيديو (MP4)، والتسجيلات الصوتية (MP3)' : 'Supports PDF, Word documents, MP4 video, and MP3 audio recordings'}
            </div>
          </div>
        ) : (
          /* Uploading / Processing / Done State */
          <div style={{ width: '100%' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
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
                    <CheckCircle2 size={18} color="var(--success)" />
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
                    maxWidth: '280px'
                  }}>
                    {uploadedFile?.name || (isRtl ? 'ملف_المحاضرة.pdf' : 'lecture_file.pdf')}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {uploadedFile?.sizeFormatted || '18.4 MB'}
                    {uploadStatus === 'uploading' && ` • ${isRtl ? 'جاري الرفع' : 'Uploading'} (${uploadProgress}%)`}
                    {uploadStatus === 'processing' && ` • ${isRtl ? 'جاري المعالجة الذكية...' : 'Processing...'}`}
                    {uploadStatus === 'done' && ` • ${isRtl ? 'تمت المعالجة بنجاح' : 'Processed'}`}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (fileInputRef.current) fileInputRef.current.click();
                  }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {isRtl ? 'تغيير الملف' : 'Change File'}
                </button>
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
              marginTop: '6px',
              fontSize: '11px',
              color: uploadStatus === 'done' ? 'var(--success)' : 'var(--text-secondary)'
            }}>
              <span>
                {uploadStatus === 'uploading' && (isRtl ? 'يتم الآن نقل الملف إلى استوديو المعالجة...' : 'Uploading file...')}
                {uploadStatus === 'processing' && (isRtl ? 'جاري تنفيذ مراحل التوليد المختارة...' : 'Executing AI generation stages...')}
                {uploadStatus === 'done' && (isRtl ? 'المحتوى جاهز للعرض والتصفح الذكي' : 'Ready for study')}
              </span>
              <span style={{ fontWeight: '700' }}>
                {uploadStatus === 'uploading' ? `${uploadProgress}%` : uploadStatus === 'processing' ? '99%' : '100%'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Multi-Stage AI Generation Progress (Shown during Processing / Uploading) */}
      {(uploadStatus === 'processing' || uploadStatus === 'uploading') && (
        <LectureAiStagesProgress
          currentStageIndex={currentStageIndex}
          selectedOutputs={selectedOutputs}
          overallProgress={uploadStatus === 'uploading' ? Math.round(uploadProgress * 0.4) : Math.min(99, 40 + Math.round(currentStageIndex * 20))}
          lang={lang}
        />
      )}

      {/* Output Selector: Graph, Text, Topics, Quiz */}
      <LectureOutputSelector
        selectedOutputs={selectedOutputs}
        onToggleOutput={onToggleOutput}
        disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
        lang={lang}
      />

      {/* Generate Action Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '18px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {uploadedFile ? (
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--success)'
              }} />
              <span>{isRtl ? 'الملف المختار:' : 'Selected:'}</span>
              <strong style={{ color: 'var(--text-primary)' }}>{uploadedFile.name}</strong>
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {isRtl ? 'اختر ملفاً أو اضغط مباشرة لتجربة نموذج المحاضرة' : 'Choose a file or click generate directly to test'}
            </div>
          )}
        </div>

        <button
          onClick={onGenerate}
          disabled={uploadStatus === 'processing' || uploadStatus === 'uploading'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: '700',
            cursor: (uploadStatus === 'processing' || uploadStatus === 'uploading') ? 'not-allowed' : 'pointer',
            opacity: (uploadStatus === 'processing' || uploadStatus === 'uploading') ? 0.7 : 1,
            boxShadow: '0 4px 14px rgba(21, 136, 199, 0.28)',
            fontFamily: 'var(--font-arabic)',
            transition: 'all 0.15s ease'
          }}
        >
          <Sparkles size={16} />
          <span>
            {uploadStatus === 'processing' || uploadStatus === 'uploading'
              ? (isRtl ? 'جاري التوليد والمعالجة الذكية...' : 'Generating...')
              : hasGenerated
                ? (isRtl ? 'إعادة التوليد بالخيارات الحالية' : 'Re-Generate with Options')
                : (isRtl ? 'توليد المحتوى بالذكاء الاصطناعي' : 'Generate with AI')}
          </span>
        </button>
      </div>
    </div>
  );
};
