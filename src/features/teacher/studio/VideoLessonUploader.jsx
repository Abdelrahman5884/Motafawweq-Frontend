import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  UploadCloud,
  Link as LinkIcon,
  Sparkles,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Film,
  AlertCircle,
} from 'lucide-react';
import { MAX_STORAGE_FILE_SIZE_BYTES } from '../../../services/storageService';

const ALLOWED_VIDEO_EXTS = new Set(['mp4', 'webm', 'mov', 'ogv', 'ogg']);

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function parseVideoEmbedUrl(rawInput) {
  const trimmed = String(rawInput || '').trim();
  if (!trimmed) return { error: 'empty' };
  if (!/^https:\/\//i.test(trimmed)) return { error: 'https_required' };

  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|live\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,20})/i
  );
  if (ytMatch) {
    return {
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
      isYoutube: true,
      isIframe: true,
    };
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d{5,15})/i);
  if (vimeoMatch) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      isYoutube: false,
      isIframe: true,
    };
  }

  return {
    embedUrl: trimmed,
    isYoutube: false,
    isIframe: false,
  };
}

export const VideoLessonUploader = ({
  videoData: externalVideoData,
  setVideoData: externalSetVideoData,
  lang = 'ar',
  isRtl = true,
  isProAiActive = false,
  isSubmitting = false,
  onStartProcessing,
}) => {
  const isAr = lang === 'ar';
  const [internalVideoData, setInternalVideoData] = useState(null);
  const videoData = externalVideoData !== undefined ? externalVideoData : internalVideoData;
  const setVideoData = externalSetVideoData || setInternalVideoData;

  const [videoSourceTab, setVideoSourceTab] = useState(videoData?.type === 'url' ? 'url' : 'file');
  const [videoUrlInput, setVideoUrlInput] = useState(videoData?.type === 'url' ? videoData.rawUrl || videoData.url : '');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const localVideoFile = videoData?.type === 'file' ? videoData.file : null;
  const localVideoPreviewUrl = useMemo(
    () => (localVideoFile ? URL.createObjectURL(localVideoFile) : ''),
    [localVideoFile]
  );

  useEffect(() => {
    if (!localVideoPreviewUrl) return undefined;
    return () => URL.revokeObjectURL(localVideoPreviewUrl);
  }, [localVideoPreviewUrl]);

  const handleVideoFileSelect = (file) => {
    setError('');
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isVideo = (file.type || '').startsWith('video/') || ALLOWED_VIDEO_EXTS.has(ext);

    if (!isVideo) {
      setError(
        isAr
          ? 'صيغة الملف غير مدعومة. يرجى اختيار ملف فيديو (MP4, WebM, MOV, OGG).'
          : 'Unsupported video format. Please choose MP4, WebM, MOV, or OGG.'
      );
      return;
    }

    if (file.size > MAX_STORAGE_FILE_SIZE_BYTES) {
      setError(
        isAr
          ? `حجم الفيديو (${formatBytes(file.size)}) يتجاوز الحد الأقصى للرفع المباشر (50 ميجابايت). للفيديوهات الطويلة، ارفعه على YouTube أو Vimeo وأدرج الرابط في تبويب «رابط فيديو».`
          : `Video (${formatBytes(file.size)}) exceeds the 50 MB direct upload limit. For longer videos, paste a YouTube or Vimeo link instead.`
      );
      return;
    }

    setVideoData({
      type: 'file',
      file,
      name: file.name,
      size: formatBytes(file.size),
      durationSeconds: 0,
      isYoutube: false,
    });
  };

  const handleApplyUrl = (e) => {
    if (e) e.preventDefault();
    setError('');

    const parsed = parseVideoEmbedUrl(videoUrlInput);
    if (parsed.error === 'empty') {
      setError(isAr ? 'يرجى لصق رابط الفيديو أولاً.' : 'Please enter a video URL first.');
      return;
    }
    if (parsed.error === 'https_required') {
      setError(
        isAr
          ? 'يجب أن يبدأ رابط الفيديو بـ https:// (مثل روابط YouTube أو Vimeo).'
          : 'Video URL must start with https:// (e.g., YouTube or Vimeo).'
      );
      return;
    }

    setVideoData({
      type: 'url',
      file: null,
      url: parsed.embedUrl,
      rawUrl: videoUrlInput.trim(),
      name: parsed.isYoutube
        ? isAr
          ? 'فيديو يوتيوب مضمّن'
          : 'Embedded YouTube Video'
        : isAr
          ? 'رابط فيديو خارجي'
          : 'External Video Link',
      isYoutube: parsed.isYoutube,
      isIframe: parsed.isIframe,
      durationSeconds: 0,
    });
  };

  const handleClearVideo = () => {
    setVideoData(null);
    setVideoUrlInput('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* Video Source Switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => {
            setVideoSourceTab('file');
            setError('');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            border: `1.5px solid ${videoSourceTab === 'file' ? 'var(--primary)' : 'var(--border-subtle)'}`,
            backgroundColor: videoSourceTab === 'file' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
            color: videoSourceTab === 'file' ? 'var(--primary)' : 'var(--text-secondary)',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          <Film size={15} />
          <span>{isAr ? 'رفع ملف فيديو (حتى 50 م.ب)' : 'Upload Video (up to 50 MB)'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setVideoSourceTab('url');
            setError('');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            border: `1.5px solid ${videoSourceTab === 'url' ? 'var(--primary)' : 'var(--border-subtle)'}`,
            backgroundColor: videoSourceTab === 'url' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
            color: videoSourceTab === 'url' ? 'var(--primary)' : 'var(--text-secondary)',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          <LinkIcon size={15} />
          <span>{isAr ? 'رابط فيديو (YouTube / Vimeo)' : 'Embed URL (YouTube / Vimeo)'}</span>
        </button>
      </div>

      {/* Local Video Upload Mode */}
      {videoSourceTab === 'file' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime,.mp4,.webm,.mov"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (file) handleVideoFileSelect(file);
            }}
          />

          {!localVideoFile ? (
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
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleVideoFileSelect(file);
              }}
              style={{
                border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border-medium)'}`,
                borderRadius: 'var(--radius-xl)',
                padding: '38px 20px',
                backgroundColor: isDragging ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                  color: 'var(--primary)',
                }}
              >
                <UploadCloud size={28} />
              </div>
              <h4 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
                {isAr ? 'اسحب ملف الفيديو إلى هنا أو اضغط للاختيار' : 'Drag & drop video file or click to browse'}
              </h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 16px', lineHeight: 1.55 }}>
                {isAr
                  ? 'يدعم MP4, WebM, MOV حتى 50 ميجابايت — للفيديوهات الأكبر استخدم تبويب رابط YouTube / Vimeo'
                  : 'Supports MP4, WebM, MOV up to 50 MB — use YouTube / Vimeo embed for larger videos'}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                style={{
                  padding: '9px 22px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'اختيار ملف الفيديو' : 'Browse Video'}
              </button>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '18px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '5px 14px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: 'var(--success)',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  marginBottom: '14px',
                }}
              >
                <CheckCircle2 size={15} />
                <span>{isAr ? 'الفيديو جاهز للرفع والنشر على الخادم السحابي' : 'Video selected & ready to upload'}</span>
              </div>

              {localVideoPreviewUrl && (
                <video
                  controls
                  src={localVideoPreviewUrl}
                  onLoadedMetadata={(e) => {
                    const dur = Math.round(e.currentTarget.duration || 0);
                    if (dur > 0 && videoData?.durationSeconds !== dur) {
                      setVideoData((prev) => (prev ? { ...prev, durationSeconds: dur } : prev));
                    }
                  }}
                  style={{
                    width: '100%',
                    maxHeight: '340px',
                    borderRadius: '12px',
                    backgroundColor: '#000',
                    marginBottom: '14px',
                  }}
                />
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ textAlign: isRtl ? 'right' : 'left', minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {videoData.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{videoData.size}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <RotateCcw size={13} />
                    <span>{isAr ? 'تغيير الفيديو' : 'Change'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleClearVideo}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                      color: '#EF4444',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Trash2 size={13} />
                    <span>{isAr ? 'حذف' : 'Remove'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* URL Embed Mode */}
      {videoSourceTab === 'url' && (
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '20px',
          }}
        >
          <form onSubmit={handleApplyUrl} style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <input
              type="url"
              dir="ltr"
              value={videoUrlInput}
              onChange={(e) => setVideoUrlInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... / https://vimeo.com/..."
              style={{
                flex: 1,
                minWidth: '220px',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'تضمين ومعاينة' : 'Embed & Preview'}
            </button>
          </form>

          {videoData && videoData.type === 'url' && (
            <div>
              <div
                style={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: 0,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#000',
                  marginBottom: '10px',
                }}
              >
                {videoData.isIframe || videoData.isYoutube ? (
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} />
                  <span>{isAr ? 'تم تضمين رابط الفيديو بنجاح' : 'Video URL embedded successfully'}</span>
                </span>
                <button
                  type="button"
                  onClick={handleClearVideo}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EF4444',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {isAr ? 'إلغاء الرابط' : 'Remove Link'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div
          style={{
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

      {/* Primary Action */}
      {videoData && (
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onStartProcessing && onStartProcessing(videoData)}
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
                  ? 'حفظ الفيديو وبدء المعالجة بالذكاء الاصطناعي'
                  : 'Save Video & Start AI Processing'
                : isAr
                  ? 'حفظ ونشر حصة الفيديو الآن'
                  : 'Save & Publish Video Lesson'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoLessonUploader;
