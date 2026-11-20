import React from 'react';
import {
  Clock,
  CheckCircle2,
  Download,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { formatDurationDisplay } from './lessonUtils';

export const LessonHeaderActions = ({
  lesson,
  courseInfo,
  hasSummaryPdf = false,
  isCompleted,
  isTogglingComplete = false,
  isBookmarked,
  isTogglingBookmark = false,
  prevLesson = null,
  nextLesson = null,
  onSelectLesson,
  handleCompleteButtonClick,
  handleSummaryClick,
  handleBookmarkClick,
  lang,
}) => {
  const isAr = lang === 'ar';
  const teacherName = courseInfo?.teacherAr || (isAr ? 'معلم المادة' : 'Instructor');
  const teacherInitial = teacherName.trim().charAt(0) || 'م';
  const durationText = formatDurationDisplay(lesson?.durationFmt, lesson?.durationSec, lang);

  return (
    <div className="lv-info">
      <div className="lv-info__header">
        {/* Title, Meta & Description */}
        <div className="lv-info__main" style={{ minWidth: 0 }}>
          <h1
            className="lv-info__title"
            style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
          >
            {lesson?.titleAr}
          </h1>

          <div className="lv-info__meta">
            <div className="lv-info__teacher">
              {courseInfo?.teacherImg ? (
                <img
                  src={courseInfo.teacherImg}
                  alt={teacherName}
                  className="lv-info__avatar"
                />
              ) : (
                <span className="lv-info__avatar lv-info__avatar--fallback">
                  {teacherInitial}
                </span>
              )}
              <span>{teacherName}</span>
            </div>

            {durationText && (
              <>
                <span className="lv-info__dot">•</span>
                <div className="lv-info__duration">
                  <Clock size={13} />
                  <span>{durationText}</span>
                </div>
              </>
            )}

            {courseInfo?.subjectAr && (
              <>
                <span className="lv-info__dot">•</span>
                <span className="lv-info__badge">{courseInfo.subjectAr}</span>
              </>
            )}

            {isCompleted && (
              <span className="lv-info__status-pill completed">
                <CheckCircle2 size={12} />
                <span>{isAr ? 'مكتملة' : 'Completed'}</span>
              </span>
            )}
          </div>

          {lesson?.descAr && (
            <p
              className="lv-info__desc"
              style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
            >
              {lesson.descAr}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="lv-info__actions">
          <button
            type="button"
            disabled={isTogglingComplete}
            className={`lv-info__complete-btn ${isCompleted ? 'completed' : ''}`}
            onClick={handleCompleteButtonClick}
            title={
              isCompleted
                ? isAr
                  ? 'إلغاء الإتمام'
                  : 'Revert Completion'
                : isAr
                  ? 'تحديد كمكتمل'
                  : 'Mark Complete'
            }
          >
            <CheckCircle2 size={16} />
            <span>
              {isTogglingComplete
                ? isAr
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : isCompleted
                  ? isAr
                    ? 'مكتمل بنجاح'
                    : 'Completed'
                  : isAr
                    ? 'تحديد كمكتمل'
                    : 'Mark Complete'}
            </span>
          </button>

          {hasSummaryPdf && (
            <button
              type="button"
              className="lv-info__summary-btn"
              onClick={handleSummaryClick}
              title={isAr ? 'تحميل ملخص الحصة' : 'Download Summary PDF'}
            >
              <Download size={15} />
              <span>{isAr ? 'تحميل الملخص (PDF)' : 'Summary PDF'}</span>
            </button>
          )}

          <button
            type="button"
            disabled={isTogglingBookmark}
            className={`lv-info__bm-btn ${isBookmarked ? 'active' : ''}`}
            onClick={handleBookmarkClick}
            title={isAr ? 'حفظ للمراجعة اللاحقة' : 'Bookmark Lesson'}
            aria-label={isAr ? 'حفظ للمراجعة اللاحقة' : 'Bookmark Lesson'}
          >
            {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>
      </div>

      {/* Previous / Next Lesson Quick Stepper */}
      {(prevLesson || nextLesson) && onSelectLesson && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '14px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          {prevLesson ? (
            <button
              type="button"
              onClick={() => onSelectLesson(prevLesson)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '9px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                maxWidth: '48%',
              }}
            >
              {isAr ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {isAr ? `السابق: ${prevLesson.titleAr}` : `Prev: ${prevLesson.titleEn || prevLesson.titleAr}`}
              </span>
            </button>
          ) : (
            <span />
          )}

          {nextLesson && (
            <button
              type="button"
              onClick={() => onSelectLesson(nextLesson)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '9px',
                border: '1px solid rgba(21, 136, 199, 0.3)',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                maxWidth: '48%',
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {isAr ? `التالي: ${nextLesson.titleAr}` : `Next: ${nextLesson.titleEn || nextLesson.titleAr}`}
              </span>
              {isAr ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
