import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  UploadCloud, 
  Link as LinkIcon, 
  Sparkles, 
  Trash2, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  Film, 
  FileText, 
  Share2, 
  Clock, 
  Loader2, 
  X,
  AlertCircle
} from 'lucide-react';

export const VideoLessonUploader = ({
  videoData: externalVideoData,
  setVideoData: externalSetVideoData,
  lang = 'ar',
  isRtl = true,
  onStartProcessing,
  aiFeatures = { speechToText: true, conceptGraph: true, chapterIndexing: true }
}) => {
  const isAr = lang === 'ar';

  // Internal state fallback if not passed from parent
  const [internalVideoData, setInternalVideoData] = useState(null);
  const videoData = externalVideoData !== undefined ? externalVideoData : internalVideoData;
  const setVideoData = externalSetVideoData || setInternalVideoData;

  const [videoSourceTab, setVideoSourceTab] = useState(videoData?.type === 'url' ? 'url' : 'file'); // 'file' | 'url'
  const [videoUrlInput, setVideoUrlInput] = useState(videoData?.type === 'url' ? videoData.url : '');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Upload simulation state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState('16.4 MB/s');
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [uploadingFile, setUploadingFile] = useState(null);
  const uploadTimerRef = useRef(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
    };
  }, []);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      startUpload(file);
    }
  };

  const startUpload = (file) => {
    // Reset any previous state
    if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
    setUploadingFile(file);
    setIsUploading(true);
    setUploadProgress(0);
    setUploadedBytes(0);

    const totalBytes = file.size || 185 * 1024 * 1024;
    let currentPct = 0;

    uploadTimerRef.current = setInterval(() => {
      currentPct += Math.floor(Math.random() * 8) + 6;
      if (currentPct >= 100) {
        currentPct = 100;
        clearInterval(uploadTimerRef.current);
        setUploadProgress(100);
        setUploadedBytes(totalBytes);
        setIsUploading(false);

        // Create object URL and commit video data
        const url = URL.createObjectURL(file);
        const finalData = {
          type: 'file',
          file: file,
          url: url,
          name: file.name,
          size: formatFileSize(file.size),
          duration: '45:30',
          uploadedAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          isUploaded: true
        };
        setVideoData(finalData);
      } else {
        setUploadProgress(currentPct);
        setUploadedBytes(Math.floor((totalBytes * currentPct) / 100));
        setUploadSpeed((13 + Math.random() * 6).toFixed(1) + ' MB/s');
      }
    }, 220);
  };

  const handleCancelUpload = () => {
    if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadingFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      startUpload(file);
    }
  };

  const handleApplyUrl = (e) => {
    if (e) e.preventDefault();
    if (!videoUrlInput.trim()) return;

    let embedUrl = videoUrlInput.trim();
    let isYoutube = false;

    // Convert standard YouTube watch URLs to embed format
    if (embedUrl.includes('youtube.com/watch?v=')) {
      const videoId = embedUrl.split('v=')[1]?.split('&')[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
        isYoutube = true;
      }
    } else if (embedUrl.includes('youtu.be/')) {
      const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
        isYoutube = true;
      }
    }

    const finalData = {
      type: 'url',
      file: null,
      url: embedUrl,
      rawUrl: videoUrlInput.trim(),
      name: isAr ? 'فيديو خارجي من منصة مشاركة الفيديو' : 'External Video Feed',
      isYoutube: isYoutube,
      size: isAr ? 'بث سحابي عالي الدقة' : 'Cloud Stream'
    };
    setVideoData(finalData);
  };

  const handleClearVideo = () => {
    setVideoData(null);
    setVideoUrlInput('');
    setUploadingFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStart = () => {
    if (onStartProcessing) {
      onStartProcessing(videoData);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* Video Source Switcher (Upload vs URL) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={() => setVideoSourceTab('file')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '10px',
            border: `1.5px solid ${videoSourceTab === 'file' ? 'var(--primary)' : 'var(--border-subtle)'}`,
            backgroundColor: videoSourceTab === 'file' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
            color: videoSourceTab === 'file' ? 'var(--primary)' : 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Film size={15} />
          <span>{isAr ? 'رفع ملف فيديو من الجهاز (MP4 / WebM)' : 'Upload Video File'}</span>
        </button>

        <button
          type="button"
          onClick={() => setVideoSourceTab('url')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '10px',
            border: `1.5px solid ${videoSourceTab === 'url' ? 'var(--primary)' : 'var(--border-subtle)'}`,
            backgroundColor: videoSourceTab === 'url' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
            color: videoSourceTab === 'url' ? 'var(--primary)' : 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <LinkIcon size={15} />
          <span>{isAr ? 'إدراج رابط فيديو (YouTube / Cloud)' : 'Embed Video URL'}</span>
        </button>
      </div>

      {/* File Upload Mode */}
      {videoSourceTab === 'file' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
            style={{ display: 'none' }}
            onChange={handleVideoFileChange}
          />

          {/* 1. Initial State: Dropzone */}
          {!isUploading && (!videoData || videoData.type !== 'file') && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border-medium)'}`,
                borderRadius: 'var(--radius-xl)',
                padding: '42px 24px',
                backgroundColor: isDragging ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'var(--primary)'
              }}>
                <UploadCloud size={32} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {isAr ? 'اسحب ملف فيديو المحاضرة إلى هنا أو اضغط للاختيار من جهازك' : 'Drag & drop video lecture here or browse'}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 18px 0', lineHeight: 1.5 }}>
                {isAr ? 'يدعم صيغ MP4, WebM, MOV بجودة عالية حتى 1.5 جيجابايت مع سرعة معالجة فائقة' : 'Supports MP4, WebM, MOV up to 1.5GB'}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                style={{
                  padding: '9px 24px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(21, 136, 199, 0.35)'
                }}
              >
                {isAr ? 'استعراض واختيار ملف الفيديو' : 'Browse Video'}
              </button>
            </div>
          )}

          {/* 2. Uploading State with Realtime Percentage & Progress */}
          {isUploading && uploadingFile && (
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1.5px solid var(--primary)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px',
              textAlign: 'center',
              boxShadow: '0 12px 30px rgba(21, 136, 199, 0.15)',
              position: 'relative'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}>
                    <Loader2 size={18} className="animate-spin" />
                  </div>
                  <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {uploadingFile.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {formatFileSize(uploadingFile.size)} • {isAr ? 'جاري الرفع السحابي والتشفير...' : 'Uploading & encrypting...'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCancelUpload}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'transparent',
                    color: 'var(--danger)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <X size={14} />
                  <span>{isAr ? 'إلغاء' : 'Cancel'}</span>
                </button>
              </div>

              {/* Progress Bar & Percentage */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                    {isAr ? 'مؤشر تحميل ملف الفيديو:' : 'Video Upload Progress:'}
                  </span>
                  <span style={{ fontSize: '26px', fontWeight: '900', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                    {uploadProgress}%
                  </span>
                </div>

                <div style={{
                  width: '100%',
                  height: '12px',
                  backgroundColor: 'var(--border-subtle)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #1588C7 0%, #38BDF8 50%, #10B981 100%)',
                    borderRadius: '6px',
                    transition: 'width 0.2s ease'
                  }} />
                </div>
              </div>

              {/* Realtime stats row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '10px',
                padding: '12px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '10px',
                marginBottom: '20px',
                fontSize: '12px'
              }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>{isAr ? 'حجم المرفوع' : 'Uploaded'}</div>
                  <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {formatFileSize(uploadedBytes)} / {formatFileSize(uploadingFile.size)}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>{isAr ? 'سرعة النقل' : 'Transfer Speed'}</div>
                  <div style={{ fontWeight: '800', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                    {uploadSpeed}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>{isAr ? 'الوقت المتبقي' : 'ETA'}</div>
                  <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {Math.max(1, Math.ceil((100 - uploadProgress) / 12))} {isAr ? 'ثوانٍ' : 'sec'}
                  </div>
                </div>
              </div>

              {/* AI Features Scheduled for Extraction (Text & Graph) */}
              <div style={{
                border: '1px dashed var(--border-medium)',
                borderRadius: '12px',
                padding: '14px 16px',
                backgroundColor: 'rgba(21, 136, 199, 0.04)',
                textAlign: isRtl ? 'right' : 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', color: 'var(--primary)', fontSize: '13px', fontWeight: '800' }}>
                  <Sparkles size={15} />
                  <span>{isAr ? 'مخرجات الذكاء الاصطناعي المجدولة للمعالجة التلقائية فور انتهاء الرفع:' : 'Scheduled AI Outputs:'}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                  {/* Speech to Text Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px'
                  }}>
                    <FileText size={16} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {isAr ? 'تفريغ النص الصوتي (Speech-to-Text)' : 'Speech-to-Text Transcript'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {isAr ? 'قيد الانتظار • يبدأ فور اكتمال الرفع' : 'Queued • Starts after upload'}
                      </div>
                    </div>
                  </div>

                  {/* NotebookLM Mind Map Graph Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px'
                  }}>
                    <Share2 size={16} color="#0EA5E9" />
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {isAr ? 'خريطة المفاهيم التفاعلية (NotebookLM Graph)' : 'Interactive Concept Graph'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {isAr ? 'قيد الانتظار • استخراج الشجرة المفاهيمية' : 'Queued • Builds concept tree'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Upload Complete State & Video Preview */}
          {!isUploading && videoData && videoData.type === 'file' && (
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '20px',
              textAlign: 'center'
            }}>
              {/* Success Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--success)',
                fontSize: '13px',
                fontWeight: '800',
                marginBottom: '16px'
              }}>
                <CheckCircle2 size={16} />
                <span>{isAr ? 'اكتمل رفع ملف الفيديو بنجاح (100%) وجاهز للذكاء الاصطناعي' : 'Video Upload Completed 100%'}</span>
              </div>

              {/* Video Player */}
              <video
                controls
                src={videoData.url}
                style={{
                  width: '100%',
                  maxHeight: '360px',
                  borderRadius: '12px',
                  backgroundColor: '#000',
                  marginBottom: '16px'
                }}
              />

              {/* File Info & Change/Delete Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '0 4px', marginBottom: '16px' }}>
                <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {videoData.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {videoData.size} • {isAr ? 'تم التحقق من الصوت والصورة' : 'Audio & Video verified'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      color: 'var(--text-primary)',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <RotateCcw size={13} />
                    <span>{isAr ? 'تغيير الفيديو' : 'Change Video'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearVideo}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'transparent',
                      color: 'var(--danger)',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={13} />
                    <span>{isAr ? 'حذف' : 'Remove'}</span>
                  </button>
                </div>
              </div>

              {/* Ready Modules Chips (Text + Graph) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                padding: '12px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px'
              }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                  {isAr ? 'المخرجات المستهدفة بالذكاء الاصطناعي:' : 'Target AI Outputs:'}
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  <FileText size={13} />
                  <span>{isAr ? 'تفريغ نصي (Speech-to-Text)' : 'Speech-to-Text'}</span>
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(14, 165, 233, 0.12)',
                  color: '#0284C7',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  <Share2 size={13} />
                  <span>{isAr ? 'خريطة المفاهيم (NotebookLM Graph)' : 'Concept Graph'}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* URL Embed Mode */}
      {videoSourceTab === 'url' && (
        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px'
        }}>
          <form onSubmit={handleApplyUrl} style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <input
              type="url"
              value={videoUrlInput}
              onChange={(e) => setVideoUrlInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... أو رابط مباشر"
              style={{
                flex: 1,
                minWidth: '240px',
                padding: '11px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '11px 22px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {isAr ? 'تضمين ومعاينة' : 'Embed Video'}
            </button>
          </form>

          {videoData && videoData.type === 'url' && (
            <div>
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#000',
                marginBottom: '12px'
              }}>
                {videoData.isYoutube ? (
                  <iframe
                    src={videoData.url}
                    title="Embedded video"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    controls
                    src={videoData.url}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  />
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12.5px', color: 'var(--success)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} />
                  <span>{isAr ? 'تم تضمين رابط الفيديو بنجاح وجاهز للمعالجة بالذكاء الاصطناعي' : 'Video embedded successfully'}</span>
                </span>
                <button
                  type="button"
                  onClick={handleClearVideo}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--danger)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {isAr ? 'إلغاء الرابط' : 'Remove Link'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Primary Processing Action */}
      {!isUploading && videoData && (
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <button
            type="button"
            onClick={handleStart}
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
              boxShadow: '0 6px 22px rgba(21, 136, 199, 0.4)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Sparkles size={18} />
            <span>{isAr ? 'بدء معالجة فيديو الحصة بالذكاء الاصطناعي الآن' : 'Start Video AI Processing Now'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
export default VideoLessonUploader;
