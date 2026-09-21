import React from 'react';
import { CheckSquare, Square, Clock } from 'lucide-react';

export const LessonTodayCard = ({
  lessonChecklist = {},
  toggleChecklistItem,
  progress = 0,
  isCompleted = false,
  currentTime = 0,
  durationFmt = '35:00',
  fmt,
  lang = 'ar',
  className = ''
}) => {
  const isAr = lang === 'ar';
  const donutProgressVal = isCompleted ? 100 : Math.max(15, Math.round(progress));
  const donutRadius = 36;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutDashoffset = donutCircumference - (donutProgressVal / 100) * donutCircumference;

  const milestones = [
    {
      key: 'watchVideo',
      labelAr: 'مشاهدة فيديو الشرح والمحطات',
      labelEn: 'Watch Lecture & Video Chapters',
      time: isAr ? '35 دقيقة' : '35 mins'
    },
    {
      key: 'reviewNotes',
      labelAr: 'تدوين ومراجعة الملاحظات الذكية',
      labelEn: 'Smart Lesson Notes & Review',
      time: isAr ? '10 دقائق' : '10 mins'
    },
    {
      key: 'solveQuestions',
      labelAr: 'حل وتدريب أسئلة الدرس (بابل شيت)',
      labelEn: 'Solve Interactive Practice Questions',
      time: isAr ? '15 دقيقة' : '15 mins'
    },
    {
      key: 'completeMaterials',
      labelAr: 'تنزيل ملخص الـ PDF والمخطط',
      labelEn: 'Download Summary PDF & Concept Map',
      time: isAr ? '5 دقائق' : '5 mins'
    },
  ];

  return (
    <div className={`lv-today-card ${className}`}>
      <div className="lv-today-card__header">
        <div className="lv-today-card__title-wrap">
          <span className="lv-today-card__badge">
            {isAr ? 'خطة مذاكرة اليوم' : 'Daily Study Plan'}
          </span>
          <h3 className="lv-today-card__title">
            {isAr ? 'درس اليوم' : "Today's Lesson"}
          </h3>
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
            <span className="lv-donut__lbl">{isAr ? 'إنجاز' : 'Done'}</span>
          </div>
        </div>
      </div>

      {/* 4 Interactive Milestones Checklist with Live Timer */}
      <div className="lv-today-card__checklist">
        {milestones.map(item => {
          const isDone = !!lessonChecklist[item.key];
          return (
            <div
              key={item.key}
              className={`lv-check-item ${isDone ? 'lv-check-item--done' : ''}`}
              onClick={() => toggleChecklistItem && toggleChecklistItem(item.key)}
            >
              <button type="button" className="lv-check-item__btn" aria-label={isDone ? 'مكتمل' : 'غير مكتمل'}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                  <span className="lv-check-item__time">{item.time}</span>
                  {/* Live Video Sync Timer */}
                  {item.key === 'watchVideo' && currentTime > 0 && (
                    <span
                      className="lv-check-item__timer"
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
                        fontVariantNumeric: 'tabular-nums'
                      }}
                      title={isAr ? 'الوقت المشاهد الفعلي من الفيديو' : 'Actual watched time'}
                    >
                      <Clock size={10} />
                      <span>{fmt ? fmt(currentTime) : `${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, '0')}`} / {durationFmt}</span>
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
