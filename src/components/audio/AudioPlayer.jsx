import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Gauge
} from 'lucide-react';

export const AudioPlayer = ({
  currentTime = 0,
  duration = 2538, // 42m 18s
  onSeek = () => {},
  isPlaying: externalIsPlaying,
  onTogglePlay = null,
  activeChapter = 'Introduction to Photosynthesis'
}) => {
  const { lang, isRtl } = useLanguage();
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);

  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (secs) => {
    const s = Math.floor(secs);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const remM = m % 60;
    const remS = s % 60;
    if (h > 0) {
      return `${h}:${remM.toString().padStart(2, '0')}:${remS.toString().padStart(2, '0')}`;
    }
    return `${remM.toString().padStart(2, '0')}:${remS.toString().padStart(2, '0')}`;
  };

  // Simulated tick when playing
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        onSeek(prev => {
          if (prev >= duration) {
            handleToggle();
            return 0;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, duration]);

  const handleToggle = () => {
    if (onTogglePlay) {
      onTogglePlay(!isPlaying);
    } else {
      setInternalIsPlaying(!internalIsPlaying);
    }
  };

  const handleSkip = (seconds) => {
    onSeek(prev => Math.min(Math.max(0, prev + seconds), duration));
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 1.75, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  };

  const progressPercent = Math.min(100, (currentTime / duration) * 100);

  // Generate 48 waveform bar heights based on pseudo-sound frequencies
  const waveformBars = Array.from({ length: 48 }, (_, i) => {
    const seed = (Math.sin(i * 0.4) * 0.5 + 0.5) * 60 + 20;
    return Math.round(seed);
  });

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 20px',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Top Header info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-flex',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isPlaying ? '#10B981' : 'var(--text-muted)',
            boxShadow: isPlaying ? '0 0 10px #10B981' : 'none'
          }} />
          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
            {activeChapter}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Waveform Visualization & Scrubber */}
      <div 
        style={{
          position: 'relative',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          cursor: 'pointer',
          padding: '4px 0'
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = isRtl ? (rect.right - e.clientX) : (e.clientX - rect.left);
          const ratio = Math.max(0, Math.min(1, clickX / rect.width));
          onSeek(ratio * duration);
        }}
      >
        {waveformBars.map((h, idx) => {
          const barProgress = (idx / waveformBars.length) * 100;
          const isPassed = barProgress <= progressPercent;
          return (
            <div
              key={idx}
              style={{
                flex: 1,
                height: `${isPlaying ? Math.max(15, (h + Math.sin(idx + currentTime) * 15)) : h}%`,
                backgroundColor: isPassed ? 'var(--primary)' : 'var(--border-subtle)',
                borderRadius: '2px',
                transition: 'height 0.1s ease, background-color 0.15s ease',
                transformOrigin: 'bottom'
              }}
            />
          );
        })}
      </div>

      {/* Playback Controls Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '6px',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        {/* Speed & Volume */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={cycleSpeed}
            style={{
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              fontSize: '11px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {playbackSpeed}x
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{
              border: 'none',
              background: 'transparent',
              color: isMuted ? '#EF4444' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        {/* Center Primary Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => handleSkip(-10)}
            title={lang === 'ar' ? 'رجوع 10 ثواني' : 'Back 10s'}
            style={{
              border: 'none',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} />
          </button>

          <button
            onClick={handleToggle}
            style={{
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(108, 77, 255, 0.4)',
              transition: 'transform 0.1s ease'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.94)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: isRtl ? 0 : '2px' }} />}
          </button>

          <button
            onClick={() => handleSkip(10)}
            title={lang === 'ar' ? 'تقديم 10 ثواني' : 'Forward 10s'}
            style={{
              border: 'none',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <RotateCw size={14} />
          </button>
        </div>

        {/* Sync Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--primary)', fontWeight: '600' }}>
          <Sparkles size={13} />
          <span>{lang === 'ar' ? 'مزامنة دقيقة للنص' : 'Synced Transcript'}</span>
        </div>
      </div>
    </div>
  );
};
