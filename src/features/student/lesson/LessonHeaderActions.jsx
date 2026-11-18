import React from 'react';
import { Clock, CheckCircle2, Download, Bookmark, BookmarkCheck } from 'lucide-react';

function formatDurationDisplay(rawFmt, lang) {
  if (!rawFmt) return '';
  if (/^\d{1,3}:\d{2}$/.test(rawFmt.trim())) {
    const [mStr, sStr] = rawFmt.trim().split(':');
    const m = parseInt(mStr, 10);
    const s = parseInt(sStr, 10);
    if (lang === 'ar') {
      if (m > 0 && s > 0) return `${m} دقيقة و ${s} ثانية`;
      if (m > 0) return `${m} دقيقة`;
      return `${s} ثانية`;
    }
    return `${m}m ${s}s`;
  }
  return rawFmt;
}

export const LessonHeaderActions = ({
  lesson,
  courseInfo,
  hasSummaryPdf = false,
  isCompleted,
  isBookmarked,
  handleCompleteButtonClick,
  handleSummaryClick,
  handleBookmarkClick,
  lang
}) => {
  const teacherName = courseInfo?.teacherAr || (lang === 'ar' ? 'معلم المادة' : 'Instructor');
  const teacherInitial = teacherName.trim().charAt(0) || 'م';
  const durationText = formatDurationDisplay(lesson?.durationFmt, lang);

  return (
    <div className="lv-info">
      <div className="lv-info__header">
        {/* Right Side in RTL: Title, Meta, and Description */}
        <div className="lv-info__main">
          <h1 className="lv-info__title">{lesson?.titleAr}</h1>

          <div className="lv-info__meta">
            <div className="lv-info__teacher">
              {courseInfo?.teacherImg ? (
                <img src={courseInfo.teacherImg} alt={teacherName} className="lv-info__avatar" />
              ) : (
                <span className="lv-info__avatar lv-info__avatar--fallback">{teacherInitial}</span>
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
                <span>{lang === 'ar' ? 'مكتملة' : 'Completed'}</span>
              </span>
            )}
          </div>

          {lesson?.descAr && <p className="lv-info__desc">{lesson.descAr}</p>}
        </div>

        {/* Left Side in RTL: Action Buttons */}
        <div className="lv-info__actions">
          <button
            className={`lv-info__complete-btn ${isCompleted ? 'completed' : ''}`}
            onClick={handleCompleteButtonClick}
            title={isCompleted ? (lang === 'ar' ? 'إلغاء الإتمام' : 'Revert Completion') : (lang === 'ar' ? 'تحديد كمكتمل' : 'Mark Complete')}
          >
            <CheckCircle2 size={16} />
            <span>{isCompleted ? (lang === 'ar' ? 'مكتمل بنجاح' : 'Completed') : (lang === 'ar' ? 'تحديد كمكتمل' : 'Mark Complete')}</span>
          </button>

          {hasSummaryPdf && (
            <button
              className="lv-info__summary-btn"
              onClick={handleSummaryClick}
              title={lang === 'ar' ? 'تحميل ملخص الحصة' : 'Download Summary PDF'}
            >
              <Download size={15} />
              <span>{lang === 'ar' ? 'تحميل الملخص (PDF)' : 'Summary PDF'}</span>
            </button>
          )}

          <button
            className={`lv-info__bm-btn ${isBookmarked ? 'active' : ''}`}
            onClick={handleBookmarkClick}
            title={lang === 'ar' ? 'حفظ للمراجعة اللاحقة' : 'Bookmark Lesson'}
          >
            {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};
