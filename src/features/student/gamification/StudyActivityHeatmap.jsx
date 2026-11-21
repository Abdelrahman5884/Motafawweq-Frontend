import React, { useState, useMemo } from 'react';
import { Calendar, Flame } from 'lucide-react';

const SQUARE_SIZE = 12;
const SQUARE_GAP = 3;
const COL_STEP = SQUARE_SIZE + SQUARE_GAP;

function getSquareColor(level) {
  switch (level) {
    case 1:
      return 'rgba(16, 185, 129, 0.28)';
    case 2:
      return 'rgba(16, 185, 129, 0.52)';
    case 3:
      return 'rgba(16, 185, 129, 0.78)';
    case 4:
      return 'var(--primary)';
    default:
      return 'var(--bg-subtle)';
  }
}

function buildDayDetails(day, isAr) {
  const parts = [];
  if (day.minutes > 0) {
    parts.push(isAr ? `${day.minutes} دقيقة مذاكرة` : `${day.minutes} min studied`);
  }
  if (day.lessons > 0) {
    parts.push(isAr ? `${day.lessons} حصة مكتملة` : `${day.lessons} lessons`);
  }
  if (day.quizzes > 0) {
    parts.push(isAr ? `${day.quizzes} اختبار` : `${day.quizzes} exams`);
  }
  if (day.homeworks > 0) {
    parts.push(isAr ? `${day.homeworks} واجب` : `${day.homeworks} homeworks`);
  }
  if (day.xp > 0) {
    parts.push(isAr ? `+${day.xp} نقطة XP` : `+${day.xp} XP`);
  }

  if (parts.length > 0) {
    return parts.join(' • ');
  }
  if (day.hasVisit || day.level > 0) {
    return isAr ? 'حضور مسجل على المنصة' : 'Platform visit recorded';
  }
  return isAr ? 'لا يوجد نشاط مسجل في هذا اليوم' : 'No study activity recorded on this day';
}

export const StudyActivityHeatmap = ({ heatmap, lang = 'ar' }) => {
  const isAr = lang === 'ar';
  const [activeDay, setActiveDay] = useState(null);

  const weeks = useMemo(
    () => (Array.isArray(heatmap?.weeks) ? heatmap.weeks : []),
    [heatmap]
  );
  const monthMarkers = useMemo(
    () => (Array.isArray(heatmap?.monthMarkers) ? heatmap.monthMarkers : []),
    [heatmap]
  );

  const activeDays = Number(heatmap?.activeDays ?? 0);
  const currentStreak = Number(heatmap?.currentStreakDays ?? 0);
  const gridWidth = Math.max(weeks.length * COL_STEP - SQUARE_GAP, 0);

  const dayRows = isAr
    ? ['أحد', '', 'ثلاثاء', '', 'خميس', '', 'سبت']
    : ['Sun', '', 'Tue', '', 'Thu', '', 'Sat'];

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '22px 24px',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--primary)" />
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                margin: 0,
                fontFamily: 'var(--font-arabic)',
              }}
            >
              {isAr ? 'سجل الالتزام والنشاط اليومي (آخر 52 أسبوعاً)' : 'Daily Study Activity (Last 52 Weeks)'}
            </h3>
          </div>

          <span
            style={{
              fontSize: '11.5px',
              fontWeight: '800',
              padding: '3px 10px',
              borderRadius: '999px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              color: 'var(--success)',
            }}
          >
            {isAr ? `${activeDays} يوم نشط` : `${activeDays} active days`}
          </span>

          {currentStreak > 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11.5px',
                fontWeight: '800',
                padding: '3px 10px',
                borderRadius: '999px',
                backgroundColor: 'rgba(245, 158, 11, 0.14)',
                color: '#D97706',
              }}
            >
              <Flame size={12} />
              <span>{isAr ? `استريك ${currentStreak} يوم` : `${currentStreak}-day streak`}</span>
            </span>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11.5px',
            color: 'var(--text-secondary)',
          }}
        >
          <span>{isAr ? 'أقل' : 'Less'}</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <span
              key={lvl}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '3px',
                backgroundColor: getSquareColor(lvl),
                border: lvl === 0 ? '1px solid var(--border-subtle)' : 'none',
              }}
            />
          ))}
          <span>{isAr ? 'أكثر' : 'More'}</span>
        </div>
      </div>

      {/* 52-Week Calendar Grid (strictly LTR chronological Left->Right for accurate month/column positioning) */}
      <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
        <div dir="ltr" style={{ width: 'max-content', margin: '0 auto' }}>
          {/* Dynamic Months Header aligned strictly to weekIndex */}
          <div
            style={{
              position: 'relative',
              height: '18px',
              marginLeft: '36px',
              width: `${gridWidth}px`,
              marginBottom: '4px',
              fontSize: '10.5px',
              fontWeight: '700',
              color: 'var(--text-muted)',
              userSelect: 'none',
            }}
          >
            {monthMarkers.map((m) => (
              <span
                key={`${m.year}-${m.weekIndex}`}
                style={{
                  position: 'absolute',
                  left: `${m.weekIndex * COL_STEP}px`,
                  top: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                {isAr ? m.monthAr : m.monthEn}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {/* Exact 7-row Weekday Labels (Sunday=0 .. Saturday=6) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: `${SQUARE_GAP}px`,
                width: '30px',
                flexShrink: 0,
                userSelect: 'none',
              }}
            >
              {dayRows.map((label, idx) => (
                <span
                  key={idx}
                  style={{
                    height: `${SQUARE_SIZE}px`,
                    lineHeight: `${SQUARE_SIZE}px`,
                    fontSize: '9.5px',
                    fontWeight: '700',
                    color: 'var(--text-muted)',
                    textAlign: 'right',
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* 52 Columns x 7 Rows */}
            <div style={{ display: 'flex', gap: `${SQUARE_GAP}px` }}>
              {weeks.map((week, wIdx) => (
                <div
                  key={wIdx}
                  style={{ display: 'flex', flexDirection: 'column', gap: `${SQUARE_GAP}px` }}
                >
                  {week.map((day) => {
                    if (day.isFuture) {
                      return (
                        <div
                          key={day.date}
                          aria-hidden="true"
                          style={{
                            width: `${SQUARE_SIZE}px`,
                            height: `${SQUARE_SIZE}px`,
                            borderRadius: '3px',
                            opacity: 0,
                            pointerEvents: 'none',
                          }}
                        />
                      );
                    }

                    const isSelected = activeDay?.date === day.date;
                    return (
                      <button
                        key={day.date}
                        type="button"
                        aria-label={`${day.date} ${isAr ? day.dayNameAr : day.dayNameEn}`}
                        onMouseEnter={() => setActiveDay(day)}
                        onFocus={() => setActiveDay(day)}
                        onClick={() => setActiveDay(day)}
                        style={{
                          width: `${SQUARE_SIZE}px`,
                          height: `${SQUARE_SIZE}px`,
                          padding: 0,
                          borderRadius: '3px',
                          backgroundColor: getSquareColor(day.level),
                          border: day.isToday
                            ? '1.5px solid var(--primary)'
                            : isSelected
                              ? '1.5px solid var(--text-primary)'
                              : '1px solid rgba(0,0,0,0.05)',
                          cursor: 'pointer',
                          outline: 'none',
                          transition: 'transform 0.1s ease',
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected / Hovered Day Details Bar */}
      <div
        style={{
          marginTop: '12px',
          padding: '10px 14px',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-main)',
          border: '1px solid var(--border-subtle)',
          fontSize: '12.5px',
          color: 'var(--text-secondary)',
          minHeight: '38px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {activeDay ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Calendar size={14} color="var(--primary)" />
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>
                {activeDay.date} ({isAr ? activeDay.dayNameAr || activeDay.dayName : activeDay.dayNameEn || activeDay.dayName}):
              </strong>{' '}
              {buildDayDetails(activeDay, isAr)}
            </span>
          </div>
        ) : (
          <span>
            {isAr
              ? 'مرّر المؤشر أو اضغط على أي يوم لعرض تفاصيل المذاكرة والاختبارات والواجبات.'
              : 'Hover or tap any day square to inspect your study minutes, lessons, exams, and XP.'}
          </span>
        )}
      </div>
    </div>
  );
};
