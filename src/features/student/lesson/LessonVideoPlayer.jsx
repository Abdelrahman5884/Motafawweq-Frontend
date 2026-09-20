import React from 'react';
import {
  Play, Pause, RotateCcw, FastForward, Volume2, VolumeX,
  Maximize2, Minimize2, RotateCw, Headphones, Video
} from 'lucide-react';

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
  progress,
  fmt,
  lang
}) => {
  return (
    <div
      ref={playerRef}
      className={`lv-player ${mediaMode === 'audio' ? 'lv-player--audio' : ''} ${isPlayerFS ? 'lv-player--fullscreen' : ''}`}
    >
      {mediaMode === 'video' ? (
        <div className="lv-player__screen">
          <img src={lesson.videoUrl} alt={lesson.titleAr} className="lv-player__video" />
          <div className="lv-player__video-gradient" />

          {/* Chapter Pill */}
          <div className="lv-player__chapter-pill">
            <span className="lv-player__chapter-num">
              {lang === 'ar' ? `المحطة ${currentCh.id} من 4` : `Part ${currentCh.id}/4`}
            </span>
            <span className="lv-player__chapter-title">{currentCh.titleAr}</span>
          </div>

          {/* Center Play/Pause Overlay */}
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
          <p className="lv-player__audio-sub">{courseInfo.teacherAr} • {currentCh.titleAr}</p>

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
            {/* Mute / Volume */}
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

            {/* Mobile Landscape Quick Switcher */}
            <button
              className="lv-ctrl-btn lv-mobile-rot-btn mobile-only"
              onClick={toggleLandscape}
              title="تشغيل بالعرض (Landscape)"
            >
              <RotateCw size={15} />
            </button>

            {/* Adaptive Media Switcher (Video vs Audio) */}
            <button
              className={`lv-ctrl-btn lv-mode-toggle ${mediaMode === 'audio' ? 'active' : ''}`}
              onClick={() => setMediaMode(m => m === 'video' ? 'audio' : 'video')}
              title={mediaMode === 'video' ? 'التحويل للاستماع الصوتي (Podcast)' : 'التحويل للفيديو'}
            >
              {mediaMode === 'video' ? <Headphones size={16} /> : <Video size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
