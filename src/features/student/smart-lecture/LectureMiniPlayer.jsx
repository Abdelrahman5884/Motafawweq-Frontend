import React from 'react';
import { Play, Pause, ExternalLink } from 'lucide-react';

export const LectureMiniPlayer = ({
  lesson,
  activeSeconds,
  isPlaying,
  formatSecs,
  isRtl = true,
  lang = 'ar',
  onTogglePlay,
  onOpenFullRoom
}) => {
  const currentChapter = lesson.chapters.find(c => activeSeconds >= c.startSeconds) || lesson.chapters[0];

  return (
    <div className="smart-mini-player">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
        <button
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(21, 136, 199, 0.25)',
            transition: 'transform 0.15s ease'
          }}
        >
          {isPlaying ? (
            <Pause size={18} />
          ) : (
            <Play size={18} style={{ marginLeft: isRtl ? 0 : '2px', marginRight: isRtl ? '2px' : 0 }} />
          )}
        </button>

        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: '13.5px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-arabic)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {currentChapter?.titleAr}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '2px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isPlaying ? 'var(--success)' : 'var(--primary)'
            }} />
            <span>{lang === 'ar' ? 'متزامن مع الخريطة والنص' : 'Synced with mindmap & transcript'}</span>
            <span>•</span>
            <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{formatSecs(activeSeconds)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onOpenFullRoom}
        className="smart-mini-player-btn"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          borderRadius: '10px',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-primary)',
          fontSize: '12.5px',
          fontWeight: '700',
          cursor: 'pointer',
          fontFamily: 'var(--font-arabic)',
          transition: 'all 0.15s ease'
        }}
      >
        <span>{lang === 'ar' ? 'فتح في حصصي' : 'Open in My Lessons'}</span>
        <ExternalLink size={14} color="var(--text-secondary)" />
      </button>
    </div>
  );
};

