import React, { useEffect, useRef } from 'react';
import { Play, Pause, ExternalLink, Volume2, Video } from 'lucide-react';

export const LectureMiniPlayer = ({
  lesson,
  mediaUrl = '',
  mediaType = 'document',
  sourceUrl = '',
  hasLinkedLesson = false,
  activeSeconds = 0,
  seekNonce = 0,
  isPlaying = false,
  formatSecs,
  isRtl = true,
  lang = 'ar',
  onTimeUpdate,
  onPlayingChange,
  onTogglePlay,
  onOpenFullRoom,
}) => {
  const isAr = lang === 'ar';
  const mediaRef = useRef(null);
  const hasPlayableMedia = Boolean(mediaUrl) && (mediaType === 'audio' || mediaType === 'video');

  const chapters = Array.isArray(lesson?.chapters) ? lesson.chapters : [];
  const currentChapter =
    [...chapters].reverse().find((c) => activeSeconds >= Number(c.startSeconds ?? 0)) || chapters[0];

  // Jump media element deterministically whenever user clicks a Mind Map node, Chapter, or Transcript segment
  useEffect(() => {
    const el = mediaRef.current;
    if (!el || !hasPlayableMedia || seekNonce === 0) return;
    try {
      el.currentTime = Math.max(0, Number(activeSeconds || 0));
      el.play().catch(() => {});
    } catch {
      // ignore autoplay restriction
    }
  }, [seekNonce, activeSeconds, hasPlayableMedia]);

  // Keep play/pause button in sync with underlying HTML5 audio/video element
  const handleTogglePlay = () => {
    const el = mediaRef.current;
    if (el && hasPlayableMedia) {
      if (el.paused) {
        el.play().catch(() => {});
      } else {
        el.pause();
      }
      return;
    }
    if (onTogglePlay) onTogglePlay();
  };

  return (
    <div
      className="smart-mini-player"
      style={{ flexDirection: mediaType === 'video' && hasPlayableMedia ? 'column' : 'row', alignItems: mediaType === 'video' && hasPlayableMedia ? 'stretch' : 'center' }}
    >
      {/* Video Player preview when student uploaded a video lecture */}
      {mediaType === 'video' && hasPlayableMedia && (
        <div style={{ width: '100%', marginBottom: '12px', borderRadius: '14px', overflow: 'hidden', backgroundColor: '#0B1220' }}>
          <video
            ref={mediaRef}
            src={mediaUrl}
            controls
            playsInline
            onPlay={() => onPlayingChange && onPlayingChange(true)}
            onPause={() => onPlayingChange && onPlayingChange(false)}
            onTimeUpdate={(e) => onTimeUpdate && onTimeUpdate(Math.floor(e.currentTarget.currentTime || 0))}
            style={{ width: '100%', maxHeight: '360px', display: 'block' }}
          />
        </div>
      )}

      {/* Hidden/compact audio element when student uploaded or recorded audio */}
      {mediaType === 'audio' && hasPlayableMedia && (
        <audio
          ref={mediaRef}
          src={mediaUrl}
          onPlay={() => onPlayingChange && onPlayingChange(true)}
          onPause={() => onPlayingChange && onPlayingChange(false)}
          onTimeUpdate={(e) => onTimeUpdate && onTimeUpdate(Math.floor(e.currentTarget.currentTime || 0))}
          style={{ display: 'none' }}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', width: '100%', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
          <button
            type="button"
            onClick={handleTogglePlay}
            disabled={!hasPlayableMedia && !sourceUrl}
            aria-label={isPlaying ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'تشغيل' : 'Play')}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: hasPlayableMedia ? 'var(--primary)' : 'var(--bg-subtle)',
              color: hasPlayableMedia ? '#FFFFFF' : 'var(--text-muted)',
              border: hasPlayableMedia ? 'none' : '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: hasPlayableMedia ? 'pointer' : 'default',
              flexShrink: 0,
              boxShadow: hasPlayableMedia ? '0 2px 8px rgba(21, 136, 199, 0.25)' : 'none',
            }}
          >
            {hasPlayableMedia ? (
              isPlaying ? (
                <Pause size={18} />
              ) : (
                <Play size={18} style={{ marginLeft: isRtl ? 0 : '2px', marginRight: isRtl ? '2px' : 0 }} />
              )
            ) : mediaType === 'url' ? (
              <Video size={18} />
            ) : (
              <Volume2 size={18} />
            )}
          </button>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontSize: '13.5px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-arabic)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {currentChapter?.titleAr || lesson?.titleAr || (isAr ? 'المحاضرة الذكية' : 'Smart Lecture')}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '2px',
              flexWrap: 'wrap',
            }}>
              <span style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isPlaying ? 'var(--success)' : 'var(--primary)',
              }} />
              <span>
                {hasPlayableMedia
                  ? (isAr ? 'مشغل صوتي/مرئي متزامن مع الخريطة والنص' : 'Real player synced with mind map & transcript')
                  : (isAr ? 'متزامن مع الخريطة والنص' : 'Synced with mind map & transcript')}
              </span>
              <span>•</span>
              <span dir="ltr" style={{ fontWeight: '700', color: 'var(--primary)' }}>
                {formatSecs(activeSeconds)}
                {lesson?.durationFmt && lesson.durationFmt !== '00:00' ? ` / ${lesson.durationFmt}` : ''}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: '800',
              }}
            >
              <span>{isAr ? 'فتح الفيديو الأصلي' : 'Open Source Video'}</span>
              <ExternalLink size={13} />
            </a>
          )}

          <button
            type="button"
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
              transition: 'all 0.15s ease',
            }}
          >
            <span>
              {hasLinkedLesson
                ? (isAr ? 'فتح في حصصي' : 'Open in My Lessons')
                : (isAr ? 'أرشيف المحاضرات' : 'Lectures Archive')}
            </span>
            <ExternalLink size={14} color="var(--text-secondary)" />
          </button>
        </div>
      </div>
    </div>
  );
};
