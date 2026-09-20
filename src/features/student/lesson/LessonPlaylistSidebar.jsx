import React from 'react';
import {
  BookOpen, CheckSquare, Square, Play, CheckCircle2,
  Lock, ChevronLeft, ChevronRight, Check
} from 'lucide-react';

export const LessonPlaylistSidebar = ({
  courseInfo,
  playlist,
  completedCount,
  courseCompletionPct,
  activeLessonId,
  isCompleted,
  progress,
  lessonChecklist,
  toggleChecklistItem,
  handlePlaylistLessonClick,
  lang,
  isRtl
}) => {
  const donutProgressVal = isCompleted ? 100 : Math.max(15, Math.round(progress));
  const donutRadius = 36;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutDashoffset = donutCircumference - (donutProgressVal / 100) * donutCircumference;

  return (
    <>
      {/* ── CARD 1: "درس اليوم" Checklist & Circular Progress ── */}
      <div className="lv-today-card">
        <div className="lv-today-card__header">
          <div className="lv-today-card__title-wrap">
            <span className="lv-today-card__badge">{lang === 'ar' ? 'خطة مذاكرة اليوم' : 'Daily Plan'}</span>
            <h3 className="lv-today-card__title">{lang === 'ar' ? 'درس اليوم' : "Today's Lesson"}</h3>
          </div>

          {/* Donut Progress Gauge */}
          <div className="lv-today-card__gauge">
            <svg width="86" height="86" viewBox="0 0 86 86" className="lv-donut">
              <circle
                cx="43" cy="43" r={donutRadius}
                className="lv-donut__bg"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="43" cy="43" r={donutRadius}
                className="lv-donut__val"
                strokeWidth="7"
                strokeDasharray={donutCircumference}
                strokeDashoffset={donutDashoffset}
                strokeLinecap="round"
                fill="none"
                transform="rotate(-90 43 43)"
              />
            </svg>
            <div className="lv-donut__center">
              <span className="lv-donut__pct">{donutProgressVal}%</span>
              <span className="lv-donut__lbl">{lang === 'ar' ? 'إنجاز' : 'Done'}</span>
            </div>
          </div>
        </div>

        {/* 4 Interactive Milestones Checklist */}
        <div className="lv-today-card__checklist">
          {[
            { key: 'watchVideo', labelAr: 'مشاهدة فيديو الشرح والمحطات', time: '35 دقيقة' },
            { key: 'reviewNotes', labelAr: 'تدوين ومراجعة الملاحظات الذكية', time: '10 دقائق' },
            { key: 'solveQuestions', labelAr: 'حل وتدريب أسئلة الدرس (بابل شيت)', time: '15 دقيقة' },
            { key: 'completeMaterials', labelAr: 'تنزيل ملخص الـ PDF والمخطط', time: '5 دقائق' },
          ].map(item => {
            const isDone = !!lessonChecklist[item.key];
            return (
              <div
                key={item.key}
                className={`lv-check-item ${isDone ? 'lv-check-item--done' : ''}`}
                onClick={() => toggleChecklistItem(item.key)}
              >
                <button type="button" className="lv-check-item__btn">
                  {isDone ? (
                    <CheckSquare size={17} className="lv-check-item__icon lv-check-item__icon--checked" />
                  ) : (
                    <Square size={17} className="lv-check-item__icon" />
                  )}
                </button>
                <div className="lv-check-item__info">
                  <span className="lv-check-item__label">{item.labelAr}</span>
                  <span className="lv-check-item__time">{item.time}</span>
                </div>
                {isDone && <span className="lv-check-item__badge">{lang === 'ar' ? 'تم' : 'Done'}</span>}
              </div>
            );
          })}
        </div>
      </div>

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
