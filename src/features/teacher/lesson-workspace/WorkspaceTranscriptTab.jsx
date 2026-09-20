import React from 'react';
import { AudioPlayer } from '../../../components/audio/AudioPlayer';

export const WorkspaceTranscriptTab = ({
  lesson,
  currentTime,
  isPlaying,
  lang,
  onSeek,
  onTogglePlay,
  onJumpToTimestamp
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Audio Player Component */}
      <AudioPlayer
        currentTime={currentTime}
        duration={lesson.durationSeconds}
        onSeek={onSeek}
        isPlaying={isPlaying}
        onTogglePlay={onTogglePlay}
        activeChapter={lang === 'ar' ? lesson.chapters[1]?.titleAr : lesson.chapters[1]?.title}
      />

      {/* Transcript Paragraphs */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'التفريغ النصي المتزامن (اضغط للقفز للصوت)' : 'Synchronized Transcript (Click to seek)'}
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600' }}>
            {lang === 'ar' ? 'مفعل: لهجة مصرية + مصطلحات إنجليزية' : 'Active: Egyptian Dialect & Terms'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {lesson.transcript.map(tr => {
            const isActive = currentTime >= tr.startSeconds && currentTime < tr.startSeconds + 180;
            return (
              <div
                key={tr.id}
                onClick={() => onJumpToTimestamp(tr.startSeconds)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--primary-surface)' : 'transparent',
                  border: isActive ? '1px solid var(--primary-light)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <button
                  style={{
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-subtle)',
                    color: isActive ? '#FFFFFF' : 'var(--primary)',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: '700',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    marginTop: '2px',
                    flexShrink: 0
                  }}
                >
                  {tr.timestamp}
                </button>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '2px' }}>
                    {tr.speaker}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? '600' : '400'
                  }}>
                    {lang === 'ar' ? tr.textAr : tr.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
