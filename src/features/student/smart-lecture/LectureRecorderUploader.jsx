import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  UploadCloud,
  Sparkles,
  FileText,
  Video,
  Music,
  Image as ImageIcon,
  X,
  PenLine,
  Mic,
  Link2,
  BookOpen,
  AlertCircle,
  RefreshCw,
  Globe,
  Plus,
} from 'lucide-react';
import { LectureOutputSelector } from './LectureOutputSelector';
import { LectureAiStagesProgress } from './LectureAiStagesProgress';
import { LiveMicRecorder } from '../../teacher/studio/LiveMicRecorder';

const formatTimer = (totalSeconds) => {
  const safe = Math.max(0, Number(totalSeconds || 0));
  const mins = Math.floor(safe / 60).toString().padStart(2, '0');
  const secs = (safe % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const detectKind = (file) => {
  const type = (file?.type || '').toLowerCase();
  const name = (file?.name || '').toLowerCase();
  if (type.startsWith('image/') || /\.(png|jpe?g|webp|bmp)$/.test(name)) return 'image';
  if (type.startsWith('video/') || /\.(mp4|mkv|mov|avi)$/.test(name)) return 'video';
  if (type.startsWith('audio/') || /\.(mp3|wav|m4a|aac|ogg|flac|webm)$/.test(name)) return 'audio';
  return 'document';
};

export const LectureRecorderUploader = ({
  lang = 'ar',
  inputMode = 'file', // 'file' | 'mic' | 'url' | 'lesson'
  onInputModeChange,
  attachedFiles = [],
  onFilesAdd,
  onRemoveAttachedFile,
  recordedFile,
  onRecordedFileReady,
  embedUrl = '',
  onEmbedUrlChange,
  accessibleLessons = [],
  selectedLessonId = '',
  onSelectLesson,
  language = 'auto',
  onLanguageChange,
  uploadProgress = 0,
  uploadStatus = 'idle', // 'idle' | 'uploading' | 'processing' | 'done' | 'failed'
  currentStageIndex = 0,
  overallProgress = null,
  selectedOutputs = ['graph', 'transcript', 'topics', 'quiz'],
  hasGenerated = false,
  lectureTitle = '',
  errorMessage = '',
  onTitleChange,
  onGenerate,
  onRetry,
  onToggleOutput,
  onResetFile,
}) => {
  const isRtl = lang === 'ar';
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const extraFilesInputRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isRecording || isPaused) return undefined;
    const id = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRecording, isPaused]);

  // Safely build & revoke local thumbnail URLs for attached images
  const imageThumbs = useMemo(() => {
    const map = {};
    attachedFiles.forEach((f, idx) => {
      if (detectKind(f) === 'image') {
        map[`${f.name}-${f.size}-${idx}`] = URL.createObjectURL(f);
      }
    });
    return map;
  }, [attachedFiles]);

  useEffect(() => {
    return () => {
      Object.values(imageThumbs).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageThumbs]);

  const isBusy = uploadStatus === 'uploading' || uploadStatus === 'processing';

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isBusy) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!isBusy && e.dataTransfer.files && e.dataTransfer.files.length > 0 && onFilesAdd) {
      onFilesAdd(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = '';
    if (picked.length > 0 && onFilesAdd) {
      onFilesAdd(picked);
    }
  };

  const getFileBadge = (kind) => {
    if (kind === 'image') return { icon: ImageIcon, ar: 'صورة', en: 'Image', bg: 'rgba(16, 185, 129, 0.12)', color: '#059669' };
    if (kind === 'video') return { icon: Video, ar: 'فيديو', en: 'Video', bg: 'rgba(99, 102, 241, 0.12)', color: '#4F46E5' };
    if (kind === 'audio') return { icon: Music, ar: 'صوت', en: 'Audio', bg: 'rgba(21, 136, 199, 0.12)', color: 'var(--primary)' };
    return { icon: FileText, ar: 'مستند', en: 'Doc', bg: 'rgba(245, 158, 11, 0.12)', color: '#D97706' };
  };

  const modes = [
    { id: 'file', labelAr: 'ملفات وصور وفيديو', labelEn: 'Files, Images & Video', icon: UploadCloud },
    { id: 'mic', labelAr: 'تسجيل مباشر', labelEn: 'Live Mic', icon: Mic },
    { id: 'url', labelAr: 'رابط فيديو', labelEn: 'Video URL', icon: Link2 },
    { id: 'lesson', labelAr: 'من حصصي', labelEn: 'My Lessons', icon: BookOpen },
  ];

  const totalSourcesCount =
    attachedFiles.length +
    (recordedFile ? 1 : 0) +
    (embedUrl.trim() ? 1 : 0) +
    (selectedLessonId ? 1 : 0);

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Card Header + 4 Source Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '9px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
          }}>
            <Sparkles size={15} />
          </span>
          <h2 style={{
            fontSize: '15px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: 0,
            fontFamily: 'var(--font-arabic)',
          }}>
            {isRtl ? 'مصادر المحاضرة (فيديو + صور + ملفات معاً)' : 'Lecture Sources (Combine Video + Images + Docs)'}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {modes.map((m) => {
            const Icon = m.icon;
            const active = inputMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                disabled={isBusy || isRecording}
                onClick={() => onInputModeChange && onInputModeChange(m.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: active ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: active ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: active ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: isBusy || isRecording ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-arabic)',
                }}
              >
                <Icon size={14} />
                <span>{isRtl ? m.labelAr : m.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inline Error Banner */}
      {errorMessage && (
        <div
          role="alert"
          style={{
            marginBottom: '14px',
            padding: '11px 14px',
            borderRadius: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#DC2626',
            fontSize: '12.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </span>
          {uploadStatus === 'failed' && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(220, 38, 38, 0.4)',
                backgroundColor: 'var(--bg-surface)',
                color: '#DC2626',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={13} />
              <span>{isRtl ? 'إعادة المحاولة بالـ AI' : 'Retry AI'}</span>
            </button>
          )}
        </div>
      )}

      {/* Hidden multi-file picker */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,audio/*,video/*,.pdf,.docx,.pptx,.txt,.md"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {/* MODE 1: Multi-File Dropzone (Appends files instead of stopping after 1!) */}
      {inputMode === 'file' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (!isBusy && fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          style={{
            border: isDragOver ? '1.5px dashed var(--primary)' : '1.5px dashed var(--border-medium)',
            borderRadius: '16px',
            padding: attachedFiles.length > 0 ? '16px 18px' : '22px 18px',
            backgroundColor: isDragOver ? 'var(--primary-surface)' : 'var(--bg-subtle)',
            cursor: isBusy ? 'default' : 'pointer',
            textAlign: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            marginBottom: '8px',
            boxShadow: 'var(--shadow-xs)',
          }}>
            {attachedFiles.length > 0 ? <Plus size={20} /> : <UploadCloud size={22} />}
          </div>

          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {attachedFiles.length > 0
              ? isRtl
                ? 'اضغط أو اسحب هنا لإضافة المزيد من الصور أو الملفات (حتى 10 ملفات معاً)'
                : 'Click or drop here to add MORE images or files (up to 10 combined)'
              : isRtl
                ? 'اسحب وأفلت فيديو أو صوت أو صور سبورة أو PDF هنا (يمكنك اختيار أكثر من ملف معاً)'
                : 'Drop video, audio, whiteboard photos, or PDF/Word files here (multi-file supported)'}
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            {isRtl
              ? 'يدعم دمج: فيديو (MP4) + صور سبورة ومذكرات (JPG/PNG/WEBP) + صوت (MP3/WAV) + مستندات (PDF/Word/PowerPoint/TXT)'
              : 'Combine: Video (MP4) + Photos (JPG/PNG/WEBP) + Audio (MP3/WAV) + Documents (PDF/DOCX/PPTX/TXT)'}
          </div>
        </div>
      )}

      {/* MODE 2: Live Microphone Recording */}
      {inputMode === 'mic' && (
        <div style={{
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '22px 18px',
          backgroundColor: 'var(--bg-subtle)',
          textAlign: 'center',
        }}>
          <LiveMicRecorder
            isRecording={isRecording}
            isPaused={isPaused}
            elapsedSeconds={elapsedSeconds}
            formatTime={formatTimer}
            lang={lang}
            recordedFile={recordedFile}
            onStartRecording={() => {
              setIsRecording(true);
              setIsPaused(false);
            }}
            onPauseRecording={() => setIsPaused((p) => !p)}
            onResetTimer={() => {
              setIsRecording(false);
              setIsPaused(false);
              setElapsedSeconds(0);
            }}
            onRecordedFileReady={(file) => {
              setIsRecording(false);
              setIsPaused(false);
              if (onRecordedFileReady) onRecordedFileReady(file);
            }}
          />
        </div>
      )}

      {/* MODE 3: YouTube / Vimeo URL */}
      {inputMode === 'url' && (
        <div style={{
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '18px',
          backgroundColor: 'var(--bg-subtle)',
        }}>
          <label style={{
            display: 'block',
            fontSize: '12.5px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}>
            {isRtl ? 'رابط محاضرة يوتيوب أو فيميو (HTTPS)' : 'YouTube or Vimeo Lecture URL (HTTPS)'}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '10px 14px' }}>
            <Link2 size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
            <input
              type="url"
              dir="ltr"
              value={embedUrl}
              disabled={isBusy}
              onChange={(e) => onEmbedUrlChange && onEmbedUrlChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '600',
                width: '100%',
              }}
            />
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {isRtl
              ? 'يمكنك أيضاً إرفاق صور سبورة أو ملف ملخص مع رابط الفيديو بالأسفل ليحلّلهم الذكاء الاصطناعي معاً.'
              : 'You can also attach whiteboard photos or a summary PDF below to analyze everything together.'}
          </div>
        </div>
      )}

      {/* MODE 4: From My Course Lessons */}
      {inputMode === 'lesson' && (
        <div style={{
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '18px',
          backgroundColor: 'var(--bg-subtle)',
        }}>
          <label style={{
            display: 'block',
            fontSize: '12.5px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}>
            {isRtl ? 'اختر حصة من مقرراتك الدراسية (ويمكنك إضافة صورك وملاحظاتك عليها بالأسفل)' : 'Select an enrolled lesson (you can also attach photos/files below)'}
          </label>
          {accessibleLessons.length === 0 ? (
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', padding: '6px 0' }}>
              {isRtl
                ? 'لا توجد حصص متاحة في مقرراتك حالياً. يمكنك رفع ملفات وصور أو تسجيل صوتي.'
                : 'No accessible course lessons yet. Upload files/images or record live audio.'}
            </div>
          ) : (
            <select
              value={selectedLessonId}
              disabled={isBusy}
              onChange={(e) => onSelectLesson && onSelectLesson(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '700',
                fontFamily: 'inherit',
              }}
            >
              <option value="">{isRtl ? '— اختر حصة من مقرراتك —' : '— Select a lesson —'}</option>
              {accessibleLessons.map((les) => (
                <option key={les.id} value={les.id}>
                  {les.courseTitleAr ? `${les.courseTitleAr} — ` : ''}{les.titleAr}
                  {les.hasTranscript ? (isRtl ? ' ✓ (مفرّغة)' : ' ✓ (Transcribed)') : ''}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Always-available Quick Button to Combine Additional Images/Files across ANY mode */}
      {inputMode !== 'file' && !isBusy && (
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <input
            ref={extraFilesInputRef}
            type="file"
            multiple
            accept="image/*,audio/*,video/*,.pdf,.docx,.pptx,.txt,.md"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => extraFilesInputRef.current?.click()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 14px',
              borderRadius: '11px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px dashed var(--primary)',
              color: 'var(--primary)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <ImageIcon size={15} />
            <span>{isRtl ? '+ إرفاق صور (سبورة / كتاب) أو ملفات إضافية مع هذا المصدر' : '+ Attach Whiteboard Photos or Extra Files'}</span>
          </button>
        </div>
      )}

      {/* Attached Files & Images Queue (Shows ALL uploaded videos, audio, photos with thumbnails, and docs!) */}
      {attachedFiles.length > 0 && (
        <div style={{
          marginTop: '14px',
          padding: '14px',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-main)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {isRtl ? `الملفات والصور المضافة (${attachedFiles.length} / 10)` : `Attached Files & Photos (${attachedFiles.length} / 10)`}
            </span>

            {!isBusy && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {attachedFiles.length < 10 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 11px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      border: 'none',
                      fontSize: '11.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={13} />
                    <span>{isRtl ? 'إضافة صورة أو ملف آخر' : 'Add Another File / Image'}</span>
                  </button>
                )}
                {onResetFile && (
                  <button
                    type="button"
                    onClick={onResetFile}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    {isRtl ? 'مسح الكل' : 'Clear All'}
                  </button>
                )}
              </div>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
            gap: '10px',
          }}>
            {attachedFiles.map((file, idx) => {
              const kind = detectKind(file);
              const badge = getFileBadge(kind);
              const BadgeIcon = badge.icon;
              const thumbKey = `${file.name}-${file.size}-${idx}`;
              const thumbUrl = imageThumbs[thumbKey];

              return (
                <div
                  key={thumbKey}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    minWidth: 0,
                  }}
                >
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt={file.name}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '9px',
                        objectFit: 'cover',
                        flexShrink: 0,
                        border: '1px solid var(--border-subtle)',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '9px',
                      backgroundColor: badge.bg,
                      color: badge.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <BadgeIcon size={18} />
                    </div>
                  )}

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      title={file.name}
                      style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {file.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', fontSize: '10.5px' }}>
                      <span style={{
                        padding: '1px 6px',
                        borderRadius: '6px',
                        backgroundColor: badge.bg,
                        color: badge.color,
                        fontWeight: '800',
                      }}>
                        {isRtl ? badge.ar : badge.en}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>{formatFileSize(file.size)}</span>
                    </div>
                  </div>

                  {!isBusy && onRemoveAttachedFile && (
                    <button
                      type="button"
                      onClick={() => onRemoveAttachedFile(idx)}
                      title={isRtl ? 'إزالة الملف' : 'Remove file'}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '7px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Multi-Stage AI Generation Progress */}
      {(uploadStatus === 'processing' || uploadStatus === 'uploading') && (
        <LectureAiStagesProgress
          currentStageIndex={currentStageIndex}
          selectedOutputs={selectedOutputs}
          overallProgress={
            uploadStatus === 'uploading'
              ? Math.round(uploadProgress * 0.25)
              : Math.min(99, Math.max(8, Number(overallProgress ?? (40 + Math.round(currentStageIndex * 20)))))
          }
          lang={lang}
        />
      )}

      {/* Custom Lecture Title + Language Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(190px, 240px)',
        gap: '12px',
        marginTop: '14px',
        marginBottom: '14px',
      }}>
        <div style={{
          backgroundColor: 'var(--bg-main)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <PenLine size={16} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              fontWeight: '600',
              marginBottom: '2px',
            }}>
              {isRtl ? 'اسم المحاضرة أو الحصة' : 'Lecture / Lesson Title'}
            </label>
            <input
              type="text"
              value={lectureTitle}
              onChange={(e) => onTitleChange && onTitleChange(e.target.value)}
              placeholder={isRtl ? 'اكتب اسماً مخصصاً للمحاضرة...' : 'Enter custom lecture name...'}
              disabled={isBusy}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '700',
                width: '100%',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-main)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <Globe size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              fontWeight: '600',
              marginBottom: '2px',
            }}>
              {isRtl ? 'لغة الشرح' : 'Spoken Language'}
            </label>
            <select
              value={language}
              disabled={isBusy}
              onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '700',
                width: '100%',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              <option value="auto">{isRtl ? 'تلقائي — أي لغة (موصى به)' : 'Auto — Any Language'}</option>
              <option value="ar">{isRtl ? 'العربية (مصرية + فصحى)' : 'Arabic (Egyptian / MSA)'}</option>
              <option value="en">{isRtl ? 'الإنجليزية (English)' : 'English'}</option>
              <option value="fr">{isRtl ? 'الفرنسية (Français)' : 'French'}</option>
              <option value="de">{isRtl ? 'الألمانية (Deutsch)' : 'German'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Output Selector */}
      <LectureOutputSelector
        selectedOutputs={selectedOutputs}
        onToggleOutput={onToggleOutput}
        disabled={isBusy}
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
        gap: '12px',
      }}>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '7px' }}>
          {totalSourcesCount > 0 ? (
            <>
              <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
              <span>
                {isRtl
                  ? `جاهز للتحليل بالذكاء الاصطناعي (${totalSourcesCount} مصدر مضاف)`
                  : `Ready for AI analysis (${totalSourcesCount} source${totalSourcesCount > 1 ? 's' : ''} attached)`}
              </span>
            </>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>
              {isRtl
                ? 'أضف فيديو أو صور أو ملفات أو تسجيل صوتي أو رابط — ويمكنك دمجهم معاً!'
                : 'Add video, images, docs, mic recording, or URL — you can combine them!'}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={isBusy || isRecording}
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
            cursor: isBusy || isRecording ? 'not-allowed' : 'pointer',
            opacity: isBusy || isRecording ? 0.7 : 1,
            boxShadow: '0 4px 14px rgba(21, 136, 199, 0.28)',
            fontFamily: 'var(--font-arabic)',
          }}
        >
          <Sparkles size={16} />
          <span>
            {isBusy
              ? isRtl ? 'جاري التوليد والمعالجة الذكية...' : 'Generating...'
              : hasGenerated
                ? isRtl ? 'تحويل محاضرة جديدة بالخيارات الحالية' : 'Generate New with Options'
                : isRtl ? 'توليد المحتوى بالذكاء الاصطناعي' : 'Generate with AI'}
          </span>
        </button>
      </div>
    </div>
  );
};
