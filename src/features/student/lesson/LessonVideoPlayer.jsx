import React, { useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Headphones,
  Video,
} from 'lucide-react';
import { isEmbedVideoUrl, toEmbedPlayerUrl } from './lessonUtils';

export const LessonVideoPlayer = ({
  playerRef,
  mediaElRef,
  onMediaTimeUpdate,
  onMediaLoadedMetadata,
  lesson,
  courseInfo,
  currentCh,
  mediaMode,
  setMediaMode,
  isPlaying,
  setIsPlaying,
  currentTime,
  embedSeekSec = 0,
  embedSeekNonce = 0,
  seekTo,
  seekBy,
  speed,
  setSpeed,
  volume,
  setVolume,
  isMuted,
  setIsMuted,
  isPlayerFS,
  togglePlayerFS,
  isLandscape,
  progress,
  fmt,
  lang,
}) => {
  const isYoutubeOrEmbed = isEmbedVideoUrl(lesson);
  const embedSrc = isYoutubeOrEmbed
    ? toEmbedPlayerUrl(lesson?.embedUrl || lesson?.videoUrl, embedSeekSec)
    : '';
  const hasDirectMedia = Boolean(!isYoutubeOrEmbed && lesson?.videoUrl);
  const isAudioOnlyLesson = lesson?.mediaMode === 'audio';
  const showAudioStudio =
    (mediaMode === 'audio' || isAudioOnlyLesson) && !isYoutubeOrEmbed && hasDirectMedia;

  // Accessible keyboard shortcuts when the player wrapper is focused
  const handlePlayerKeyDown = useCallback(
    (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (!hasDirectMedia) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (showAudioStudio) {
          setIsPlaying((p) => !p);
        } else if (mediaElRef?.current) {
          if (mediaElRef.current.paused) mediaElRef.current.play().catch(() => {});
          else mediaElRef.current.pause();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        seekBy(10);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seekBy(-10);
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsMuted((m) => !m);
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        togglePlayerFS?.();
      }
    },
    [hasDirectMedia, showAudioStudio, setIsPlaying, mediaElRef, seekBy, setIsMuted, togglePlayerFS]
  );

  const teacherInitial = (courseInfo?.teacherAr || 'م').trim().charAt(0);
  const watermarkLabel = lesson?.watermark?.studentCode || '';

  return (
    <div
      ref={playerRef}
      tabIndex={0}
      onKeyDown={handlePlayerKeyDown}
      className={`lv-player ${showAudioStudio ? 'lv-player--audio' : ''} ${isPlayerFS ? 'lv-player--fullscreen lv-player--fs' : ''} ${isLandscape ? 'lv-player--landscape lv-player--fs' : ''}`}
      style={{ outline: 'none' }}
    >
      {showAudioStudio ? (
        <>
          {/* Audio Studio Mode */}
          <div className="lv-player__audio-studio">
            <div className="lv-player__audio-glow" />
            <div className="lv-player__audio-avatar-wrap">
              {courseInfo?.teacherImg ? (
                <img
                  src={courseInfo.teacherImg}
                  alt={courseInfo.teacherAr}
                  className="lv-player__audio-avatar"
                />
              ) : (
                <div className="lv-player__audio-avatar lv-player__audio-avatar--fallback">
                  {teacherInitial}
                </div>
              )}
              <div className="lv-player__audio-badge">
                <Headphones size={13} />
              </div>
            </div>

            <p className="lv-player__audio-label">
              {lang === 'ar' ? 'تسجيل الحصة الصوتي عالي النقاء' : 'HD Master Audio'}
            </p>
            <h3 className="lv-player__audio-title">{lesson.titleAr}</h3>
            <p className="lv-player__audio-sub">
              {courseInfo?.teacherAr}
              {currentCh?.titleAr ? ` • ${currentCh.titleAr}` : ''}
            </p>

            {/* Real HTML5 Audio element synced with custom controls */}
            <audio
              key={`audio-${lesson.id}-${lesson.videoUrl}`}
              ref={mediaElRef}
              src={lesson.videoUrl}
              preload="metadata"
              onLoadedMetadata={(e) => onMediaLoadedMetadata?.(e.currentTarget.duration)}
              onTimeUpdate={(e) => onMediaTimeUpdate?.(e.currentTarget.currentTime)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />

            {/* Pulsing Audio Waveform */}
            <div className="lv-waveform">
              {Array.from({ length: 32 }, (_, i) => (
                <div
                  key={i}
                  className="lv-waveform__bar"
                  style={{
                    animationDelay: `${(i % 8) * 0.12}s`,
                    animationPlayState: isPlaying ? 'running' : 'paused',
                  }}
                />
              ))}
            </div>

            <div className="lv-player__audio-footer">
              <span className="lv-player__data-badge">
                {lang === 'ar'
                  ? 'وضع الاستماع الصوتي • يوفر استهلاك الإنترنت'
                  : 'Audio Mode • Data Saver'}
              </span>
              <button
                type="button"
                className="lv-player__fs-btn"
                onClick={togglePlayerFS}
                title={lang === 'ar' ? 'شاشة كاملة' : 'Fullscreen'}
                aria-label={lang === 'ar' ? 'شاشة كاملة' : 'Fullscreen'}
              >
                {isPlayerFS ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>

          {/* Custom Controls & RTL-Safe LTR Scrubber */}
          <div className="lv-controls">
            <div
              dir="ltr"
              role="slider"
              aria-label={lang === 'ar' ? 'شريط التقدم' : 'Seek bar'}
              aria-valuemin={0}
              aria-valuemax={lesson.durationSec || 0}
              aria-valuenow={currentTime}
              className="lv-scrub"
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
                seekTo(Math.round(pct * (lesson.durationSec || 0)));
              }}
            >
              <div className="lv-scrub__track">
                {(lesson.chapters || []).map(
                  (c, i) =>
                    i > 0 &&
                    lesson.durationSec > 0 && (
                      <div
                        key={c.id}
                        className="lv-scrub__mark"
                        style={{ left: `${(c.startSec / lesson.durationSec) * 100}%` }}
                        title={c.titleAr}
                      />
                    )
                )}
                <div className="lv-scrub__fill" style={{ width: `${progress}%` }} />
                <div className="lv-scrub__thumb" style={{ left: `${progress}%` }} />
              </div>
            </div>

            <div className="lv-controls__row" dir="ltr">
              <div className="lv-controls__left">
                <button
                  type="button"
                  className="lv-ctrl-btn"
                  onClick={() => seekBy(-10)}
                  title="-10s"
                  aria-label="Rewind 10 seconds"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  type="button"
                  className="lv-ctrl-btn"
                  onClick={() => seekBy(10)}
                  title="+10s"
                  aria-label="Forward 10 seconds"
                >
                  <FastForward size={16} />
                </button>
                <div className="lv-time">
                  <span className="lv-time__curr">{fmt(currentTime)}</span>
                  <span className="lv-time__sep">/</span>
                  <span className="lv-time__tot">{lesson.durationFmt}</span>
                </div>
              </div>

              <button
                type="button"
                className="lv-play-btn"
                onClick={() => setIsPlaying(!isPlaying)}
                title={
                  isPlaying
                    ? lang === 'ar'
                      ? 'إيقاف'
                      : 'Pause'
                    : lang === 'ar'
                      ? 'تشغيل'
                      : 'Play'
                }
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause size={19} />
                ) : (
                  <Play size={19} fill="currentColor" style={{ marginInlineStart: '2px' }} />
                )}
              </button>

              <div className="lv-controls__right">
                <div
                  className="lv-vol-group desktop-only"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <button
                    type="button"
                    className="lv-ctrl-btn"
                    onClick={() => setIsMuted(!isMuted)}
                    title={
                      isMuted
                        ? lang === 'ar'
                          ? 'إلغاء الكتم'
                          : 'Unmute'
                        : lang === 'ar'
                          ? 'كتم'
                          : 'Mute'
                    }
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="lv-vol"
                    title={lang === 'ar' ? 'مستوى الصوت' : 'Volume'}
                  />
                </div>

                <select
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="lv-speed"
                  title={lang === 'ar' ? 'سرعة التشغيل' : 'Playback Speed'}
                >
                  {[0.75, 1, 1.25, 1.5, 1.75, 2].map((s) => (
                    <option key={s} value={s}>
                      {s === 1 ? '1.0x' : `${s}x`}
                    </option>
                  ))}
                </select>

                {!isAudioOnlyLesson && (
                  <button
                    type="button"
                    className="lv-ctrl-btn lv-mode-toggle active"
                    onClick={() => setMediaMode('video')}
                    title={lang === 'ar' ? 'العودة لوضع الفيديو' : 'Switch to Video'}
                  >
                    <Video size={16} />
                  </button>
                )}

                <button
                  type="button"
                  className="lv-ctrl-btn"
                  onClick={togglePlayerFS}
                  title={
                    isPlayerFS
                      ? lang === 'ar'
                        ? 'إنهاء الشاشة الكاملة'
                        : 'Exit Fullscreen'
                      : lang === 'ar'
                        ? 'شاشة كاملة'
                        : 'Fullscreen'
                  }
                >
                  {isPlayerFS ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="lv-player__screen">
          {isYoutubeOrEmbed && embedSrc ? (
            <iframe
              key={`${embedSrc}-${embedSeekNonce}`}
              src={embedSrc}
              title={lesson.titleAr}
              className="lv-player__video"
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : hasDirectMedia ? (
            <video
              key={`video-${lesson.id}-${lesson.videoUrl}`}
              ref={mediaElRef}
              src={lesson.videoUrl}
              controls
              controlsList="nodownload"
              playsInline
              preload="metadata"
              className="lv-player__video"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: '#000',
              }}
              onLoadedMetadata={(e) => onMediaLoadedMetadata?.(e.currentTarget.duration)}
              onTimeUpdate={(e) => onMediaTimeUpdate?.(e.currentTarget.currentTime)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
          ) : (
            <div className="lv-player__empty">
              <div className="lv-player__empty-icon">
                <Video size={34} />
              </div>
              <div className="lv-player__empty-title">
                {lesson.titleAr || (lang === 'ar' ? 'الحصة التعليمية' : 'Lesson')}
              </div>
              <div className="lv-player__empty-sub">
                {lang === 'ar'
                  ? 'لم يقم المعلم بإضافة فيديو أو رابط شرح لهذه الحصة بعد.'
                  : 'No video or embed link uploaded for this lesson yet.'}
              </div>
            </div>
          )}

          {/* Subtle Anti-Piracy Student Watermark */}
          {watermarkLabel && (hasDirectMedia || isYoutubeOrEmbed) && (
            <div
              aria-hidden="true"
              dir="ltr"
              style={{
                position: 'absolute',
                bottom: '54px',
                insetInlineStart: '16px',
                pointerEvents: 'none',
                userSelect: 'none',
                fontSize: '11px',
                fontWeight: '800',
                fontFamily: 'monospace',
                letterSpacing: '0.8px',
                color: 'rgba(255, 255, 255, 0.42)',
                backgroundColor: 'rgba(6, 37, 78, 0.32)',
                padding: '3px 8px',
                borderRadius: '6px',
                zIndex: 4,
              }}
            >
              {watermarkLabel}
            </div>
          )}

          {/* Chapter Pill (uses readable sequential chapter order, never raw UUID) */}
          {currentCh && (
            <div className="lv-player__chapter-pill">
              <span className="lv-player__chapter-num">
                {lang === 'ar' ? `المحطة ${currentCh.order || 1}` : `Part ${currentCh.order || 1}`}
              </span>
              <span className="lv-player__chapter-title">{currentCh.titleAr}</span>
            </div>
          )}

          {/* Audio-mode switch button for direct video lessons */}
          {hasDirectMedia && !isYoutubeOrEmbed && (
            <div className="lv-player__top-actions">
              <button
                type="button"
                className="lv-player__fs-btn"
                onClick={() => setMediaMode('audio')}
                title={lang === 'ar' ? 'التحويل للاستماع الصوتي' : 'Audio Mode'}
                aria-label={lang === 'ar' ? 'التحويل للاستماع الصوتي' : 'Audio Mode'}
              >
                <Headphones size={15} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
