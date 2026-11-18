import React, { useEffect, useRef } from 'react';
import {
  Play, Pause, RotateCcw, FastForward, Volume2, VolumeX,
  Maximize2, Minimize2, RotateCw, Headphones, Video
} from 'lucide-react';

function toYoutubeEmbedUrl(url = '') {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  const watchMatch = url.match(/[?&]v=([^&#]+)/);
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}?rel=0`;
  const shortMatch = url.match(/youtu\.be\/([^?&#]+)/);
  if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}?rel=0`;
  return url;
}

export const LessonVideoPlayer = ({
  playerRef,
  lesson,
  courseInfo,
  currentCh,
  mediaMode,
  setMediaMode,
  isPlaying,
  setIsPlaying,
  currentTime,
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
  toggleLandscape,
  isLandscape,
  progress,
  fmt,
  lang
}) => {
  const videoElRef = useRef(null);
  const isYoutubeOrEmbed = Boolean(lesson?.isYoutube || (lesson?.embedUrl && (lesson.embedUrl.includes('youtube.com') || lesson.embedUrl.includes('youtu.be') || lesson.embedUrl.includes('vimeo.com'))));
  const embedSrc = isYoutubeOrEmbed ? toYoutubeEmbedUrl(lesson?.embedUrl || lesson?.videoUrl) : '';
  const hasDirectMedia = Boolean(!isYoutubeOrEmbed && lesson?.videoUrl);

  useEffect(() => {
    const el = videoElRef.current;
    if (!el || !hasDirectMedia) return;
    el.playbackRate = speed || 1;
    el.volume = isMuted ? 0 : (volume ?? 0.85);
    el.muted = Boolean(isMuted);
    if (isPlaying && el.paused) {
      el.play().catch(() => {});
    } else if (!isPlaying && !el.paused) {
      el.pause();
    }
  }, [isPlaying, speed, volume, isMuted, hasDirectMedia]);

  return (
    <div
      ref={playerRef}
      className={`lv-player ${mediaMode === 'audio' ? 'lv-player--audio' : ''} ${isPlayerFS ? 'lv-player--fullscreen lv-player--fs' : ''} ${isLandscape ? 'lv-player--landscape lv-player--fs' : ''}`}
    >
      {mediaMode === 'video' ? (
        <div className="lv-player__screen">
          {isYoutubeOrEmbed && embedSrc ? (
            <iframe
              src={embedSrc}
              title={lesson.titleAr}
              className="lv-player__video"
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : hasDirectMedia ? (
            <video
              ref={videoElRef}
              src={lesson.videoUrl}
              controls
              playsInline
              className="lv-player__video"
              style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#000' }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={(e) => {
                if (Math.abs(e.currentTarget.currentTime - currentTime) > 1.5) {
                  seekTo(Math.floor(e.currentTarget.currentTime));
                }
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#CBD5E1',
              background: 'linear-gradient(135deg, #06254E 0%, #0B192C 100%)',
              padding: '24px',
              textAlign: 'center'
            }}>
              <Video size={38} color="#38BDF8" />
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF' }}>
                {lesson.titleAr || (lang === 'ar' ? 'الحصة التعليمية' : 'Lesson')}
              </div>
              <div style={{ fontSize: '12.5px', color: '#94A3B8' }}>
                {lang === 'ar' ? 'لم يقم المعلم بإضافة فيديو أو رابط شرح لهذه الحصة بعد.' : 'No video or embed link uploaded for this lesson yet.'}
              </div>
            </div>
          )}

          {/* Chapter Pill */}
          {currentCh && (
            <div className="lv-player__chapter-pill">
              <span className="lv-player__chapter-num">
                {lang === 'ar' ? `المحطة ${currentCh.id}` : `Part ${currentCh.id}`}
              </span>
              <span className="lv-player__chapter-title">{currentCh.titleAr}</span>
            </div>
          )}

          {/* Center Play/Pause Overlay (only when no iframe/direct video controls) */}
          {!isYoutubeOrEmbed && !hasDirectMedia && (
            <button
              className="lv-player__center-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'إيقاف' : 'تشغيل'}
            >
              <span className="lv-player__center-ring" />
              {isPlaying ? (
                <Pause size={28} />
              ) : (
                <Play size={28} fill="currentColor" style={{ marginInlineStart: '3px' }} />
              )}
            </button>
          )}

          {/* Fullscreen & Landscape Buttons */}
          <div className="lv-player__top-actions">
            <button
              className="lv-player__fs-btn lv-player__rotate-btn"
              onClick={toggleLandscape}
              title={lang === 'ar' ? 'تشغيل بالعرض (Landscape للتليفون)' : 'Landscape Orientation'}
            >
              <RotateCw size={15} />
            </button>

            <button
              className="lv-player__fs-btn"
              onClick={togglePlayerFS}
              title={isPlayerFS ? 'إنهاء وضع الشاشة الكاملة' : 'شاشة كاملة'}
            >
              {isPlayerFS ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
      ) : (
        /* Audio Studio (Adaptive Mode) */
        <div className="lv-player__audio-studio">
          <div className="lv-player__audio-glow" />
          <div className="lv-player__audio-avatar-wrap">
            <img src={courseInfo.teacherImg} alt={courseInfo.teacherAr} className="lv-player__audio-avatar" />
            <div className="lv-player__audio-badge"><Headphones size={13} /></div>
          </div>
          <p className="lv-player__audio-label">
            {lang === 'ar' ? 'تسجيل الحصة الصوتي عالي النقاء (HD Podcast)' : 'HD Master Audio'}
          </p>
          <h3 className="lv-player__audio-title">{lesson.titleAr}</h3>
          <p className="lv-player__audio-sub">{courseInfo.teacherAr} {currentCh?.titleAr ? `• ${currentCh.titleAr}` : ''}</p>
          {hasDirectMedia && (
            <audio
              ref={videoElRef}
              src={lesson.videoUrl}
              controls
              style={{ width: '100%', maxWidth: '420px', margin: '10px auto', position: 'relative', zIndex: 2 }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          )}

          {/* Pulsing Audio Waveform */}
          <div className="lv-waveform">
            {Array.from({ length: 32 }, (_, i) => (
              <div
                key={i}
                className="lv-waveform__bar"
                style={{
                  animationDelay: `${(i % 8) * 0.12}s`,
                  animationPlayState: isPlaying ? 'running' : 'paused'
                }}
              />
            ))}
          </div>

          <div className="lv-player__audio-footer">
            <span className="lv-player__data-badge">
              {lang === 'ar' ? 'يوفر 85% من باقة الإنترنت' : '85% Data Saved'}
            </span>
            <button className="lv-player__fs-btn" onClick={togglePlayerFS} title="شاشة كاملة">
              {isPlayerFS ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
      )}

      {/* Player Scrubber & Controls */}
      <div className="lv-controls">
        {/* Scrub Track */}
        <div
          className="lv-scrub"
          onClick={e => {
            const r = e.currentTarget.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
            seekTo(Math.round(pct * lesson.durationSec));
          }}
        >
          <div className="lv-scrub__track">
            {lesson.chapters.map((c, i) => i > 0 && (
              <div
                key={c.id}
                className="lv-scrub__mark"
                style={{ left: `${(c.startSec / lesson.durationSec) * 100}%` }}
                title={c.titleAr}
              />
            ))}
            <div className="lv-scrub__fill" style={{ width: `${progress}%` }} />
            <div className="lv-scrub__thumb" style={{ left: `${progress}%` }} />
          </div>
        </div>

        {/* Controls Row */}
        <div className="lv-controls__row">
          <div className="lv-controls__left">
            <button className="lv-ctrl-btn" onClick={() => seekBy(-10)} title="-10s">
              <RotateCcw size={16} />
            </button>
            <button className="lv-ctrl-btn" onClick={() => seekBy(10)} title="+10s">
              <FastForward size={16} />
            </button>
            <div className="lv-time">
              <span className="lv-time__curr">{fmt(currentTime)}</span>
              <span className="lv-time__sep">/</span>
              <span className="lv-time__tot">{lesson.durationFmt}</span>
            </div>
          </div>

          {/* Primary Play Button */}
          <button
            className="lv-play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'إيقاف' : 'تشغيل'}
          >
            {isPlaying ? (
              <Pause size={19} />
            ) : (
              <Play size={19} fill="currentColor" style={{ marginInlineStart: '2px' }} />
            )}
          </button>

          <div className="lv-controls__right">
            {/* Mute / Volume (Desktop only — phones use hardware buttons) */}
            <div className="lv-vol-group desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                className="lv-ctrl-btn"
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? 'إلغاء الكتم' : 'كتم'}
              >
                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={e => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="lv-vol"
                title="مستوى الصوت"
              />
            </div>

            {/* Playback Speed */}
            <select
              value={speed}
              onChange={e => setSpeed(parseFloat(e.target.value))}
              className="lv-speed"
              title="سرعة التشغيل"
            >
              {[0.75, 1, 1.25, 1.5, 1.75, 2].map(s => (
                <option key={s} value={s}>{s === 1 ? '1.0x' : `${s}x`}</option>
              ))}
            </select>

            {/* Adaptive Media Switcher (Video vs Audio) */}
            <button
              className={`lv-ctrl-btn lv-mode-toggle ${mediaMode === 'audio' ? 'active' : ''}`}
              onClick={() => setMediaMode(m => m === 'video' ? 'audio' : 'video')}
              title={mediaMode === 'video' ? 'التحويل للاستماع الصوتي (Podcast)' : 'التحويل للفيديو'}
            >
              {mediaMode === 'video' ? <Headphones size={16} /> : <Video size={16} />}
            </button>

            {/* Fullscreen Button */}
            <button
              className="lv-ctrl-btn"
              onClick={togglePlayerFS}
              title={isPlayerFS ? 'إنهاء وضع الشاشة الكاملة' : 'شاشة كاملة'}
            >
              {isPlayerFS ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
