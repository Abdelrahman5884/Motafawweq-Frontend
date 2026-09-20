import React from 'react';
import { Play, Pause } from 'lucide-react';

export const LectureMiniPlayer = ({
  lesson,
  activeSeconds,
  isPlaying,
  formatSecs,
  isRtl,
  lang,
  onTogglePlay,
  onOpenFullRoom
}) => {
  const currentChapter = lesson.chapters.find(c => activeSeconds >= c.startSeconds) || lesson.chapters[0];

  return (
    <div style={{
      backgroundColor: '#090D16',
      borderRadius: '20px',
      padding: '14px 20px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: '#FFFFFF',
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onTogglePlay}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: isRtl ? 0 : '2px', marginRight: isRtl ? '2px' : 0 }} />}
        </button>

        <div>
          <div style={{ fontSize: '13px', fontWeight: '800' }}>
            {currentChapter?.titleAr}
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>
            متزامن مع الخريطة والنص • {formatSecs(activeSeconds)}
          </div>
        </div>
      </div>

      <button
        onClick={onOpenFullRoom}
        style={{
          padding: '6px 14px',
          borderRadius: '10px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: '#FFFFFF',
          border: 'none',
          fontSize: '12px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        {lang === 'ar' ? 'فتح في غرفة الحصة الكاملة' : 'Full Lesson Room'}
      </button>
    </div>
  );
};
