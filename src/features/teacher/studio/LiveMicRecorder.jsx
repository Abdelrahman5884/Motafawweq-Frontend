import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Mic, Play, Pause, Square, AlertCircle, Trash2 } from 'lucide-react';
import { getOptimalAudioConfig, MAX_STORAGE_FILE_SIZE_BYTES } from '../../../services/storageService';

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const LiveMicRecorder = ({
  isRecording,
  isPaused,
  elapsedSeconds,
  formatTime,
  lang,
  recordedFile,
  onStartRecording,
  onPauseRecording,
  onResetTimer,
  onRecordedFileReady,
}) => {
  const isAr = lang === 'ar';
  const [micError, setMicError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const recordedAudioUrl = useMemo(
    () => (recordedFile ? URL.createObjectURL(recordedFile) : ''),
    [recordedFile]
  );

  useEffect(() => {
    if (!recordedAudioUrl) return undefined;
    return () => URL.revokeObjectURL(recordedAudioUrl);
  }, [recordedAudioUrl]);

  // Cleanup active media stream on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const stopStreamTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startRealRecording = async () => {
    setMicError('');

    if (!navigator.mediaDevices?.getUserMedia || typeof window.MediaRecorder === 'undefined') {
      setMicError(
        isAr
          ? 'المتصفح لا يدعم التسجيل المباشر بالميكروفون. يرجى استخدام تبويب «رفع ملف صوتي».'
          : 'Live microphone recording is not supported in this browser. Please use Upload Audio.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const audioConfig = getOptimalAudioConfig();
      let mediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, audioConfig);
      } catch {
        mediaRecorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = () => {
        stopStreamTracks();
        setMicError(
          isAr
            ? 'حدث خطأ أثناء التسجيل الصوتي. يرجى المحاولة مرة أخرى.'
            : 'An error occurred during audio recording. Please try again.'
        );
      };

      if (onRecordedFileReady) onRecordedFileReady(null);
      if (onResetTimer) onResetTimer();

      mediaRecorder.start(250);
      onStartRecording();
    } catch (err) {
      stopStreamTracks();
      const denied = err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError';
      setMicError(
        denied
          ? isAr
            ? 'تم رفض صلاحية الوصول للميكروفون. يرجى السماح بالوصول للميكروفون من إعدادات المتصفح ثم المحاولة مرة أخرى.'
            : 'Microphone permission was denied. Please allow access in your browser settings.'
          : isAr
            ? 'تعذر العثور على ميكروفون متصل بهذا الجهاز. يمكنك رفع ملف صوتي جاهز من تبويب «رفع ملف صوتي».'
            : `Microphone unavailable: ${err?.message || 'No device found'}`
      );
    }
  };

  const pauseRealRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder) {
      if (recorder.state === 'recording') {
        recorder.pause();
      } else if (recorder.state === 'paused') {
        recorder.resume();
      }
    }
    onPauseRecording();
  };

  const stopRealRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = () => {
        const audioConfig = getOptimalAudioConfig();
        const rawMime = recorder.mimeType || audioConfig.mimeType || 'audio/webm';
        const baseMime = rawMime.split(';')[0].trim().toLowerCase() || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: baseMime });
        stopStreamTracks();

        if (audioBlob.size === 0) {
          setMicError(
            isAr
              ? 'لم يتم التقاط أي صوت في التسجيل. تأكد من عمل الميكروفون ثم أعد المحاولة.'
              : 'No audio data was captured. Please check your microphone and try again.'
          );
          if (onRecordedFileReady) onRecordedFileReady(null);
          return;
        }

        if (audioBlob.size > MAX_STORAGE_FILE_SIZE_BYTES) {
          setMicError(
            isAr
              ? 'حجم التسجيل يتجاوز الحد الأقصى المسموح به (50 ميجابايت). يرجى تقليل مدة التسجيل.'
              : 'Recording exceeds the 50 MB cloud storage limit.'
          );
          if (onRecordedFileReady) onRecordedFileReady(null);
          return;
        }

        const ext = baseMime.includes('mp4') ? 'm4a' : baseMime.includes('ogg') ? 'ogg' : 'webm';
        const audioFile = new File([audioBlob], `lecture_${Date.now()}.${ext}`, { type: baseMime });
        if (onRecordedFileReady) onRecordedFileReady(audioFile);
      };
      recorder.stop();
    } else {
      stopStreamTracks();
      if (onRecordedFileReady) onRecordedFileReady(null);
    }
  };

  const handleDeleteRecording = () => {
    audioChunksRef.current = [];
    setMicError('');
    if (onResetTimer) onResetTimer();
    if (onRecordedFileReady) onRecordedFileReady(null);
  };

  return (
    <div>
      {/* Waveform Visualizer */}
      <div
        style={{
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          marginBottom: '20px',
          padding: '0 12px',
        }}
      >
        {Array.from({ length: 38 }).map((_, idx) => {
          const height =
            isRecording && !isPaused
              ? Math.max(10, Math.sin(idx * 0.45 + elapsedSeconds * 2.5) * 26 + 34)
              : 12;
          return (
            <div
              key={idx}
              style={{
                width: '4px',
                height: `${height}px`,
                borderRadius: '3px',
                backgroundColor: isRecording
                  ? idx % 2 === 0
                    ? 'var(--primary)'
                    : 'var(--primary-light)'
                  : 'var(--border-subtle)',
                transition: 'height 0.14s ease, background-color 0.2s ease',
              }}
            />
          );
        })}
      </div>

      {/* Timer Display */}
      <div
        dir="ltr"
        style={{
          fontSize: '42px',
          fontWeight: '900',
          fontFamily: 'var(--font-mono)',
          color: isRecording ? 'var(--primary)' : 'var(--text-primary)',
          marginBottom: '22px',
          letterSpacing: '2px',
        }}
      >
        {formatTime(elapsedSeconds)}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {!isRecording ? (
          <button
            type="button"
            onClick={startRealRecording}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 32px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '15px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 8px 22px rgba(21, 136, 199, 0.35)',
            }}
          >
            <Mic size={20} />
            <span>
              {recordedFile
                ? isAr
                  ? 'إعادة التسجيل بالميكروفون'
                  : 'Record Again'
                : isAr
                  ? 'بدء تسجيل الحصة مباشرة'
                  : 'Start Live Recording'}
            </span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={pauseRealRecording}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 22px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
              <span>{isPaused ? (isAr ? 'استئناف' : 'Resume') : isAr ? 'إيقاف مؤقت' : 'Pause'}</span>
            </button>

            <button
              type="button"
              onClick={stopRealRecording}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '13px 28px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '14.5px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(220, 38, 38, 0.35)',
              }}
            >
              <Square size={15} fill="#FFFFFF" />
              <span>{isAr ? 'إيقاف وحفظ التسجيل' : 'Stop & Save Recording'}</span>
            </button>
          </>
        )}
      </div>

      {/* Inline Mic Error */}
      {micError && (
        <div
          style={{
            marginTop: '14px',
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#EF4444',
            fontSize: '12.5px',
            fontWeight: '700',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'start',
          }}
        >
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <span>{micError}</span>
        </div>
      )}

      {/* Recorded Audio Preview */}
      {recordedAudioUrl && recordedFile && !isRecording && (
        <div
          style={{
            marginTop: '18px',
            padding: '14px 16px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '10px',
            }}
          >
            <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#10B981' }}>
              {isAr
                ? `✓ تسجيل جاهز للرفع (${formatBytes(recordedFile.size)})`
                : `✓ Recording ready (${formatBytes(recordedFile.size)})`}
            </span>
            <button
              type="button"
              onClick={handleDeleteRecording}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                color: '#EF4444',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={13} />
              <span>{isAr ? 'حذف التسجيل' : 'Delete Recording'}</span>
            </button>
          </div>
          <audio controls src={recordedAudioUrl} style={{ width: '100%', maxWidth: '460px' }} />
        </div>
      )}

      <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        {isAr
          ? 'تسجيل صوتي عالي الوضوح مضغوط تلقائياً (64 kbps) مناسب لساعة كاملة وحجم أقل من 50 ميجابايت'
          : 'Auto-compressed crisp speech (64 kbps) — fits ~60 min lectures comfortably under the 50 MB cloud limit'}
      </div>
    </div>
  );
};
