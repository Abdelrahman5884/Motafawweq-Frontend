import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Sparkles,
  FileText,
  Video,
  Music,
  CheckCircle2,
  X,
  PenLine,
  Mic,
  Link2,
  BookOpen,
  AlertCircle,
  RefreshCw,
  Globe,
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

export const LectureRecorderUploader = ({
  lang = 'ar',
  inputMode = 'file', // 'file' | 'mic' | 'url' | 'lesson'
  onInputModeChange,
  uploadedFile,
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
  onFileUpload,
  onResetFile,
}) => {
  const isRtl = lang === 'ar';
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Live mic timer state
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
    if (!isBusy && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  const getFileIcon = (file) => {
    if (!file) return <FileText size={22} color="var(--primary)" />;
    const name = file.name?.toLowerCase() || '';
    const type = file.type?.toLowerCase() || '';
    if (type.includes('audio') || name.match(/\.(mp3|wav|m4a|aac|ogg|flac|webm)$/)) {
      return <Music size={22} color="var(--primary)" />;
    }
    if (type.includes('video') || name.match(/\.(mp4|mkv|mov|avi)$/)) {
      return <Video size={22} color="var(--primary)" />;
    }
    return <FileText size={22} color="var(--primary)" />;
  };

  const modes = [
    { id: 'file', labelAr: 'رفع ملف', labelEn: 'Upload File', icon: UploadCloud },
    { id: 'mic', labelAr: 'تسجيل مباشر', labelEn: 'Live Mic', icon: Mic },
    { id: 'url', labelAr: 'رابط فيديو', labelEn: 'Video URL', icon: Link2 },
    { id: 'lesson', labelAr: 'من حصصي', labelEn: 'My Lessons', icon: BookOpen },
  ];

  const activeSourceLabel = (() => {
    if (inputMode === 'mic' && recordedFile) return recordedFile.name;
    if (inputMode === 'url' && embedUrl.trim()) return embedUrl.trim();
    if (inputMode === 'lesson' && selectedLessonId) {
      const found = accessibleLessons.find((l) => l.id === selectedLessonId);
      return found ? found.titleAr : '';
    }
    return uploadedFile?.name || '';
  })();

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: 'var(--shadow-sm)',
      transition: 'border-color 0.2s ease',
    }}>
      {/* Card Header + Source Mode Switcher */}
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
            {isRtl ? 'مصدر المحاضرة الذكية' : 'Smart Lecture Source'}
          </h2>
        </div>

        {/* 4 Clean Source Tabs */}
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
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} />
                <span>{isRtl ? m.labelAr : m.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inline Error Banner (Zero alert() popups!) */}
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

      {/* MODE 1: File Upload Dropzone */}
      {inputMode === 'file' && (
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
            minHeight: '124px',
            transition: 'all 0.2s ease',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*,.pdf,.docx,.pptx,.txt,.md"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />

          {uploadStatus === 'idle' && !uploadedFile ? (
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
                boxShadow: 'var(--shadow-xs)',
              }}>
                <UploadCloud size={22} />
              </div>

              <div style={{
                fontSize: '14px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '4px',
                fontFamily: 'var(--font-arabic)',
              }}>
                {isRtl ? 'اسحب وأفلت ملف المحاضرة هنا أو اضغط للاختيار' : 'Drop lecture file here or click to browse'}
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {isRtl
                  ? 'يدعم الصوت (MP3/WAV/M4A/WEBM)، الفيديو (MP4)، ومستندات PDF و Word (DOCX) و PowerPoint (PPTX) و TXT'
                  : 'Supports Audio (MP3/WAV/M4A/WEBM), Video (MP4), PDF, Word (DOCX), PowerPoint (PPTX), and TXT'}
              </div>
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: isBusy || uploadStatus === 'done' ? '10px' : 0,
                flexWrap: 'wrap',
                gap: '8px',
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
                    flexShrink: 0,
                  }}>
                    {uploadStatus === 'done' ? <CheckCircle2 size={18} color="var(--success)" /> : getFileIcon(uploadedFile)}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '320px',
                    }}>
                      {uploadedFile?.name || (isRtl ? 'ملف المحاضرة' : 'Lecture File')}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {uploadedFile?.sizeFormatted || ''}
                      {uploadStatus === 'uploading' && ` • ${isRtl ? 'جاري الرفع' : 'Uploading'} (${uploadProgress}%)`}
                      {uploadStatus === 'processing' && ` • ${isRtl ? 'جاري المعالجة بالذكاء الاصطناعي...' : 'AI Processing...'}`}
                      {uploadStatus === 'done' && ` • ${isRtl ? 'تمت المعالجة بنجاح' : 'Processed'}`}
                      {uploadStatus === 'failed' && ` • ${isRtl ? 'توقفت المعالجة' : 'Failed'}`}
                    </div>
                  </div>
                </div>

                {!isBusy && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
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
                        cursor: 'pointer',
                      }}
                    >
                      {isRtl ? 'تغيير الملف' : 'Change File'}
                    </button>
                    <button
                      type="button"
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
                        cursor: 'pointer',
                      }}
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
              </div>

              {(isBusy || uploadStatus === 'done') && (
                <div style={{
                  height: '6px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: '99px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${uploadStatus === 'done' ? 100 : uploadStatus === 'processing' ? Math.max(10, Number(overallProgress ?? 50)) : uploadProgress}%`,
                    backgroundColor: uploadStatus === 'done' ? 'var(--success)' : 'var(--primary)',
                    borderRadius: '99px',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              )}
            </div>
          )}
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
            fontFamily: 'var(--font-arabic)',
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
              ? 'سيقوم محرك الذكاء الاصطناعي بسحب الصوت تلقائياً، تفريغه نصياً بدقة، ثم توليد خريطة المفاهيم والمحاور والكويز.'
              : 'AI will extract audio from the video link, transcribe it accurately, and build the mind map, topics, and quiz.'}
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
            fontFamily: 'var(--font-arabic)',
          }}>
            {isRtl ? 'اختر حصة من مقرراتك الدراسية لتحويلها بالـ AI' : 'Select one of your enrolled course lessons'}
          </label>
          {accessibleLessons.length === 0 ? (
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', padding: '10px 0' }}>
              {isRtl
                ? 'لا توجد حصص متاحة في مقرراتك حالياً. يمكنك رفع ملف أو تسجيل صوتي أو لصق رابط يوتيوب.'
                : 'No accessible course lessons yet. You can upload a file, record audio, or paste a video link.'}
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
              fontFamily: 'var(--font-arabic)',
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

        {/* Speech Language Selector */}
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

      {/* Output Selector: Graph, Text, Topics, Quiz */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          {activeSourceLabel ? (
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              minWidth: 0,
            }}>
              <span style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--success)',
                flexShrink: 0,
              }} />
              <span>{isRtl ? 'المصدر الجاهز:' : 'Ready source:'}</span>
              <strong style={{
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '280px',
              }}>
                {activeSourceLabel}
              </strong>
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {isRtl
                ? 'اختر ملفاً أو سجّل صوتاً أو أدخل رابط فيديو أو اختر حصة ثم اضغط توليد'
                : 'Upload a file, record audio, paste a video URL, or pick a lesson to start'}
            </div>
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
            transition: 'all 0.15s ease',
          }}
        >
          <Sparkles size={16} />
          <span>
            {isBusy
              ? (isRtl ? 'جاري التوليد والمعالجة الذكية...' : 'Generating...')
              : hasGenerated
                ? (isRtl ? 'تحويل محاضرة جديدة بالخيارات الحالية' : 'Generate New with Options')
                : (isRtl ? 'توليد المحتوى بالذكاء الاصطناعي' : 'Generate with AI')}
          </span>
        </button>
      </div>
    </div>
  );
};
