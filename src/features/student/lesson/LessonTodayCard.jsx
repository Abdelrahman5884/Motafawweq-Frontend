import React from 'react';
import { CheckSquare, Square, Clock } from 'lucide-react';
import { formatDurationDisplay } from './lessonUtils';

export const LessonTodayCard = ({
  lessonChecklist = {},
  toggleChecklistItem,
  progress = 0,
  isCompleted = false,
  currentTime = 0,
  durationSec = 0,
  durationFmt = '30:00',
  fmt,
  lang = 'ar',
  className = '',
}) => {
  const isAr = lang === 'ar';
  const donutProgressVal = isCompleted
    ? 100
    : Math.min(100, Math.max(0, Math.round(Number(progress) || 0)));
  const donutRadius = 36;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutDashoffset =
    donutCircumference - (donutProgressVal / 100) * donutCircumference;

  const lectureTimeLabel =
    formatDurationDisplay(durationFmt, durationSec, lang) ||
    (isAr ? 'مدة الحصة' : 'Full Lecture');

  const milestones = [
    {
      key: 'watchVideo',
      labelAr: 'مشاهدة فيديو الشرح والمحطات',
      labelEn: 'Watch Lecture & Video Chapters',
      time: lectureTimeLabel,
    },
    {
      key: 'reviewNotes',
      labelAr: 'تدوين ومراجعة الملاحظات الذكية',
      labelEn: 'Smart Lesson Notes & Review',
      time: isAr ? '10 دقائق' : '10 mins',
    },
    {
      key: 'solveQuestions',
      labelAr: 'حل وتدريب أسئلة الدرس',
      labelEn: 'Solve Practice Questions',
      time: isAr ? '15 دقيقة' : '15 mins',
    },
    {
      key: 'completeMaterials',
      labelAr: 'تنزيل ملخص الـ PDF والمخطط',
      labelEn: 'Download Summary PDF & Map',
      time: isAr ? '5 دقائق' : '5 mins',
    },
  ];

  const checkedCount = milestones.filter((m) => Boolean(lessonChecklist[m.key])).length;

  return (
    <div className={`lv-today-card ${className}`}>
      <div className="lv-today-card__header">
        <div className="lv-today-card__title-wrap">
          <span className="lv-today-card__badge">
            {isAr
              ? `خطة مذاكرة اليوم (${checkedCount}/4)`
              : `Daily Study Plan (${checkedCount}/4)`}
          </span>
          <h3 className="lv-today-card__title">
            {isAr ? 'درس اليوم' : "Today's Lesson"}
          </h3>
        </div>

        {/* Donut Progress Gauge */}
        <div className="lv-today-card__gauge">
          <svg width="86" height="86" viewBox="0 0 86 86" className="lv-donut">
            <circle
              cx="43"
              cy="43"
              r={donutRadius}
              className="lv-donut__bg"
              strokeWidth="7"
              fill="none"
            />
            <circle
              cx="43"
              cy="43"
              r={donutRadius}
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
            <span className="lv-donut__lbl">{isAr ? 'إنجاز' : 'Done'}</span>
          </div>
        </div>
      </div>

      {/* 4 Interactive Milestones Checklist with Live Timer */}
      <div className="lv-today-card__checklist">
        {milestones.map((item) => {
          const isDone = Boolean(lessonChecklist[item.key]);
          return (
            <div
              key={item.key}
              className={`lv-check-item ${isDone ? 'lv-check-item--done' : ''}`}
              onClick={() => toggleChecklistItem?.(item.key)}
            >
              <button
                type="button"
                className="lv-check-item__btn"
                aria-label={isDone ? 'مكتمل' : 'غير مكتمل'}
              >
                {isDone ? (
                  <CheckSquare size={17} className="lv-check-item__icon lv-check-item__icon--checked" />
                ) : (
                  <Square size={17} className="lv-check-item__icon" />
                )}
              </button>
              <div className="lv-check-item__info">
                <span className="lv-check-item__label">
                  {isAr ? item.labelAr : item.labelEn}
                </span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexWrap: 'wrap',
                    marginTop: '2px',
                  }}
                >
                  <span className="lv-check-item__time">{item.time}</span>
                  {item.key === 'watchVideo' && currentTime > 0 && (
                    <span
                      className="lv-check-item__timer"
                      dir="ltr"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '11px',
                        fontWeight: '800',
                        color: 'var(--primary)',
                        backgroundColor: 'var(--primary-surface)',
                        padding: '1px 6px',
                        borderRadius: '6px',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                      title={isAr ? 'الوقت المشاهد الفعلي من الفيديو' : 'Current playback position'}
                    >
                      <Clock size={10} />
                      <span>
                        {fmt ? fmt(currentTime) : '00:00'} / {durationFmt}
                      </span>
                    </span>
                  )}
                </div>
              </div>
              {isDone && (
                <span className="lv-check-item__badge">
                  {isAr ? 'تم' : 'Done'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
