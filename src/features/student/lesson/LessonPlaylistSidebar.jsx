import React from 'react';
import {
  Play, CheckCircle2,
  Lock, ChevronLeft, ChevronRight
} from 'lucide-react';
import { LessonTodayCard } from './LessonTodayCard';

export const LessonPlaylistSidebar = ({
  courseInfo,
  playlist,
  completedCount,
  courseCompletionPct,
  activeLessonId,
  isCompleted,
  progress,
  currentTime,
  durationFmt,
  fmt,
  lessonChecklist,
  toggleChecklistItem,
  handlePlaylistLessonClick,
  lang,
  isRtl
}) => {
  return (
    <>
      {/* ── CARD 1: "درس اليوم" Checklist & Circular Progress ── */}
      <LessonTodayCard
        lessonChecklist={lessonChecklist}
        toggleChecklistItem={toggleChecklistItem}
        progress={progress}
        isCompleted={isCompleted}
        currentTime={currentTime}
        durationFmt={durationFmt}
        fmt={fmt}
        lang={lang}
      />

      {/* ── CARD 2: "محتوى الدورة" Playlist with Explicit Progress ── */}
      <div className="lv-playlist-card">
        <div className="lv-playlist-card__head">
          <div>
            <span className="lv-playlist-card__sub">{courseInfo.gradeAr}</span>
            <h3 className="lv-playlist-card__title">{lang === 'ar' ? 'محتوى الدورة' : 'Course Content'}</h3>
          </div>
          <div className="lv-playlist-card__progress-pill">
            <span className="lv-playlist-card__pct">{courseCompletionPct}%</span>
            <span className="lv-playlist-card__count">
              {lang === 'ar' ? `${completedCount} من ${playlist.length} حصص` : `${completedCount} of ${playlist.length} lessons`}
            </span>
          </div>
        </div>

        {/* Global Course Progress Bar */}
        <div className="lv-course-pbar">
          <div className="lv-course-pbar__fill" style={{ width: `${courseCompletionPct}%` }} />
        </div>

        {/* Lessons List in Playlist */}
        <div className="lv-playlist-list">
          {playlist.map((l, i) => {
            const isActive = l.id === activeLessonId;
            return (
              <div
                key={l.id}
                className={`lv-pl-item ${isActive ? 'lv-pl-item--active' : ''} ${l.completed ? 'lv-pl-item--completed' : ''}`}
                onClick={() => handlePlaylistLessonClick(l)}
              >
                <div className="lv-pl-item__idx">
                  {l.completed ? (
                    <CheckCircle2 size={16} className="lv-pl-item__completed-icon" />
                  ) : isActive ? (
                    <Play size={14} fill="currentColor" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>

                <div className="lv-pl-item__info">
                  <span className="lv-pl-item__title">{l.titleAr}</span>
                  <span className="lv-pl-item__time">{l.time}</span>
                </div>

                <div className="lv-pl-item__meta">
                  {isActive ? (
                    <span className="lv-pl-item__status-tag active">{lang === 'ar' ? 'تدرسه الآن' : 'Now'}</span>
                  ) : l.completed ? (
                    <span className="lv-pl-item__status-tag completed">{lang === 'ar' ? 'مكتمل' : 'Done'}</span>
                  ) : (
                    <span className="lv-pl-item__lock"><Lock size={12} /></span>
                  )}
                  {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
