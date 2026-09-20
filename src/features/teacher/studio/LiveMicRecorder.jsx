import React from 'react';
import { Mic, Play, Pause, Square } from 'lucide-react';

export const LiveMicRecorder = ({
  isRecording,
  isPaused,
  elapsedSeconds,
  formatTime,
  lang,
  onStartRecording,
  onPauseRecording,
  onStopAndProcess
}) => {
  return (
    <div>
      {/* Live Waveform or Frequency bars */}
      <div style={{
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        marginBottom: '24px'
      }}>
        {Array.from({ length: 36 }).map((_, idx) => {
          const height = isRecording && !isPaused
            ? Math.max(10, Math.sin(idx * 0.5 + elapsedSeconds * 2) * 50 + 20)
            : 12;
          return (
            <div
              key={idx}
              style={{
                width: '5px',
                height: `${height}px`,
                borderRadius: '3px',
                backgroundColor: isRecording ? 'var(--primary)' : 'var(--border-subtle)',
                transition: 'height 0.1s ease, background-color 0.2s ease'
              }}
            />
          );
        })}
      </div>

      {/* Timer display */}
      <div style={{
        fontSize: '44px',
        fontWeight: '900',
        fontFamily: 'var(--font-mono)',
        color: isRecording ? 'var(--primary)' : 'var(--text-primary)',
        marginBottom: '28px',
        letterSpacing: '2px'
      }}>
        {formatTime(elapsedSeconds)}
      </div>

      {/* Mic Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        {!isRecording ? (
          <button
            onClick={onStartRecording}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 36px',
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
            <span>{lang === 'ar' ? 'بدء تسجيل الحصة' : 'Start Recording'}</span>
          </button>
        ) : (
          <>
            <button
              onClick={onPauseRecording}
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
              onClick={onStopAndProcess}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
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
              <span>{lang === 'ar' ? 'إنهاء وبدء المعالجة بالـ AI' : 'Finish & Process with AI'}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
