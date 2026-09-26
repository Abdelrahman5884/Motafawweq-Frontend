import React, { useState, useRef } from 'react';
import { Video, UploadCloud, Link as LinkIcon, Sparkles, Trash2, RotateCcw, Play, CheckCircle2, Film } from 'lucide-react';

export const VideoLessonUploader = ({
  videoData,
  setVideoData,
  lang,
  onStartProcessing
}) => {
  const isAr = lang === 'ar';
  const [videoSourceTab, setVideoSourceTab] = useState(videoData?.type === 'url' ? 'url' : 'file'); // 'file' | 'url'
  const [videoUrlInput, setVideoUrlInput] = useState(videoData?.type === 'url' ? videoData.url : '');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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
      processVideoFile(file);
    }
  };

  const processVideoFile = (file) => {
    const url = URL.createObjectURL(file);
    setVideoData({
      type: 'file',
      file: file,
      url: url,
      name: file.name,
      size: formatFileSize(file.size)
    });
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
      processVideoFile(file);
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

    setVideoData({
      type: 'url',
      file: null,
      url: embedUrl,
      rawUrl: videoUrlInput.trim(),
      name: isAr ? 'فيديو خارجي من منصة مشاركة الفيديو' : 'External Video Feed',
      isYoutube: isYoutube,
      size: isAr ? 'بث سحابي عالي الدقة' : 'Cloud Stream'
    });
  };

  const handleClearVideo = () => {
    setVideoData(null);
    setVideoUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Video Source Switcher (Upload vs URL) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={() => setVideoSourceTab('file')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 16px',
            borderRadius: '8px',
            border: `1.5px solid ${videoSourceTab === 'file' ? 'var(--primary)' : 'var(--border-subtle)'}`,
            backgroundColor: videoSourceTab === 'file' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
            color: videoSourceTab === 'file' ? 'var(--primary)' : 'var(--text-secondary)',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer'
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
            padding: '7px 16px',
            borderRadius: '8px',
            border: `1.5px solid ${videoSourceTab === 'url' ? 'var(--primary)' : 'var(--border-subtle)'}`,
            backgroundColor: videoSourceTab === 'url' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
            color: videoSourceTab === 'url' ? 'var(--primary)' : 'var(--text-secondary)',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <LinkIcon size={15} />
          <span>{isAr ? 'إدراج رابط فيديو (YouTube / Vimeo / Cloud)' : 'Embed Video URL'}</span>
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

          {!videoData || videoData.type !== 'file' ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border-medium)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '40px 20px',
                backgroundColor: isDragging ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <Video size={44} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                {isAr ? 'اسحب ملف فيديو المحاضرة إلى هنا أو اضغط للاختيار من جهازك' : 'Drag & drop video lecture here or browse'}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
                {isAr ? 'يدعم صيغ MP4, WebM, MOV, MKV بجودة عالية حتى 1 جيجابايت' : 'Supports MP4, WebM, MOV up to 1GB'}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                style={{
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {isAr ? 'استعراض ملف الفيديو' : 'Browse Video'}
              </button>
            </div>
          ) : (
            /* Video File Preview */
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              textAlign: 'center'
            }}>
              <video
                controls
                src={videoData.url}
                style={{
                  width: '100%',
                  maxHeight: '340px',
                  borderRadius: '10px',
                  backgroundColor: '#000',
                  marginBottom: '12px'
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', padding: '0 4px' }}>
                <div style={{ textAlign: isAr ? 'right' : 'left' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {videoData.name}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    {videoData.size} • {isAr ? 'جاهز للمعالجة بالذكاء الاصطناعي' : 'Ready for AI processing'}
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
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
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
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'transparent',
                      color: 'var(--danger)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
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
        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px'
        }}>
          <form onSubmit={handleApplyUrl} style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <input
              type="url"
              value={videoUrlInput}
              onChange={(e) => setVideoUrlInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... أو رابط مباشر"
              style={{
                flex: 1,
                minWidth: '240px',
                padding: '10px 14px',
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
                padding: '10px 20px',
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
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundColor: '#000',
                marginBottom: '10px'
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
                <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={14} />
                  <span>{isAr ? 'تم تضمين رابط الفيديو بنجاح وجاهز للمعالجة' : 'Video embedded successfully'}</span>
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
      {videoData && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button
            type="button"
            onClick={onStartProcessing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '15px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(21, 136, 199, 0.4)'
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
