import React, { useRef, useState, useEffect } from 'react';
import { Mic, Play, Pause, Square, Sparkles, RotateCcw, Volume2, AlertCircle, Trash2 } from 'lucide-react';
import { getOptimalAudioConfig } from '../../../services/storageService';

export const LiveMicRecorder = ({
  isRecording,
  isPaused,
  elapsedSeconds,
  formatTime,
  lang,
  onStartRecording,
  onPauseRecording,
  onStopAndProcess,
  onRecordedFileReady,
}) => {
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [micPermissionError, setMicPermissionError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // Real mic recording integration with Supabase-optimized audio compression
  const startRealRecording = async () => {
    setMicPermissionError(null);
    setRecordedAudioUrl(null);
    audioChunksRef.current = [];

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        const audioConfig = getOptimalAudioConfig();
        const mediaRecorder = new MediaRecorder(stream, audioConfig);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.start(250);
      }
    } catch (err) {
      console.warn('Microphone permission not granted or device unavailable, falling back to simulated studio recording:', err);
      setMicPermissionError(err.message || 'Microphone unavailable');
    }

    onStartRecording();
  };

  const pauseRealRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
    } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
    }
    onPauseRecording();
  };

  const stopRealRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = () => {
        const audioConfig = getOptimalAudioConfig();
        const rawMime = mediaRecorderRef.current?.mimeType || audioConfig.mimeType || 'audio/webm';
        const baseMime = rawMime.split(';')[0].trim().toLowerCase() || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: baseMime });
        const ext = baseMime.includes('mp4') ? 'm4a' : baseMime.includes('ogg') ? 'ogg' : 'webm';
        const audioFile = new File([audioBlob], `lecture_${Date.now()}.${ext}`, { type: baseMime });

        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        if (onRecordedFileReady) {
          onRecordedFileReady(audioFile);
        } else if (onStopAndProcess) {
          onStopAndProcess(audioFile);
        }
      };
      mediaRecorderRef.current.stop();
    } else {
      if (onRecordedFileReady) {
        onRecordedFileReady(null);
      } else if (onStopAndProcess) {
        onStopAndProcess(null);
      }
    }
  };

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      {/* Waveform / Visualizer */}
      <div style={{
        height: '74px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        marginBottom: '24px',
        padding: '0 16px'
      }}>
        {Array.from({ length: 42 }).map((_, idx) => {
          const height = isRecording && !isPaused
            ? Math.max(10, Math.sin(idx * 0.45 + elapsedSeconds * 2.5) * 48 + 24)
            : 12;
          return (
            <div
              key={idx}
              style={{
                width: '4px',
                height: `${height}px`,
                borderRadius: '3px',
                backgroundColor: isRecording 
                  ? (idx % 2 === 0 ? 'var(--primary)' : 'var(--primary-light)') 
                  : 'var(--border-subtle)',
                transition: 'height 0.12s ease, background-color 0.2s ease'
              }}
            />
          );
        })}
      </div>

      {/* Timer Display */}
      <div style={{
        fontSize: '44px',
        fontWeight: '900',
        fontFamily: 'var(--font-mono)',
        color: isRecording ? 'var(--primary)' : 'var(--text-primary)',
        marginBottom: '24px',
        letterSpacing: '2px'
      }}>
        {formatTime(elapsedSeconds)}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {!isRecording ? (
          <button
            type="button"
            onClick={startRealRecording}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 38px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '16px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(21, 136, 199, 0.4)',
              transition: 'transform 0.15s ease'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Mic size={22} />
            <span>{lang === 'ar' ? 'بدء تسجيل الحصة مباشرة' : 'Start Live Recording'}</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={pauseRealRecording}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
              <span>{isPaused ? (lang === 'ar' ? 'استئناف' : 'Resume') : (lang === 'ar' ? 'إيقاف مؤقت' : 'Pause')}</span>
            </button>

            <button
              type="button"
              onClick={stopRealRecording}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 30px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--danger)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '15px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(220, 38, 38, 0.35)'
              }}
            >
              <Square size={16} fill="#FFFFFF" />
              <span>{lang === 'ar' ? 'إيقاف وحفظ التسجيل' : 'Stop & Save Recording'}</span>
            </button>
          </>
        )}
      </div>

      {micPermissionError && (
        <div style={{
          marginTop: '14px',
          padding: '10px 14px',
          borderRadius: '10px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#EF4444',
          fontSize: '12.5px',
          fontWeight: '600',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <AlertCircle size={15} />
          <span>{lang === 'ar' ? 'تعذر الوصول للميكروفون. يرجى السماح بالوصول للميكروفون من إعدادات المتصفح.' : `Microphone error: ${micPermissionError}`}</span>
        </div>
      )}

      {recordedAudioUrl && !isRecording && (
        <div style={{
          marginTop: '18px',
          padding: '14px 16px',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#10B981' }}>
              {lang === 'ar' ? '✓ تم تسجيل الصوت بنجاح — يمكنك الاستماع إليه أو حذفه' : '✓ Audio recorded — preview or delete'}
            </span>
            <button
              type="button"
              onClick={() => {
                if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
                setRecordedAudioUrl(null);
                audioChunksRef.current = [];
                if (onRecordedFileReady) onRecordedFileReady(null);
              }}
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
              <span>{lang === 'ar' ? 'حذف التسجيل' : 'Delete Recording'}</span>
            </button>
          </div>
          <audio controls src={recordedAudioUrl} style={{ width: '100%', maxWidth: '460px' }} />
        </div>
      )}

      <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        {lang === 'ar'
          ? 'الميكروفون مزود بعزل الضوضاء التلقائي وتصفية صدى القاعات الدراسية'
          : 'Microphone features automatic noise cancellation and classroom echo suppression'}
      </div>
    </div>
  );
};
