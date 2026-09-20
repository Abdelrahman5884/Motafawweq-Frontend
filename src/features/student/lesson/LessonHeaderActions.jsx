import React from 'react';
import { Clock, CheckCircle2, Download, Bookmark, BookmarkCheck } from 'lucide-react';

export const LessonHeaderActions = ({
  lesson,
  courseInfo,
  isCompleted,
  isBookmarked,
  handleCompleteButtonClick,
  handleSummaryClick,
  handleBookmarkClick,
  lang
}) => {
  return (
    <div className="lv-info">
      <div className="lv-info__header">
        {/* Right Side in RTL: Title, Meta, and Description */}
        <div className="lv-info__main">
          <h1 className="lv-info__title">{lesson.titleAr}</h1>

          <div className="lv-info__meta">
            <div className="lv-info__teacher">
              <img src={courseInfo.teacherImg} alt={courseInfo.teacherAr} className="lv-info__avatar" />
              <span>{courseInfo.teacherAr}</span>
            </div>
            <span className="lv-info__dot">•</span>
            <div className="lv-info__duration">
              <Clock size={13} />
              <span>{lesson.durationFmt.replace(':', ' دقيقة و ')} ثانية</span>
            </div>
            <span className="lv-info__dot">•</span>
            <span className="lv-info__badge">{courseInfo.subjectAr}</span>
            {isCompleted && (
              <span className="lv-info__status-pill completed">
                <CheckCircle2 size={12} />
                <span>{lang === 'ar' ? 'مكتملة' : 'Completed'}</span>
              </span>
            )}
          </div>

          <p className="lv-info__desc">{lesson.descAr}</p>
        </div>

        {/* Left Side in RTL: Action Buttons (With Universal Confirmation) */}
        <div className="lv-info__actions">
          <button
            className={`lv-info__complete-btn ${isCompleted ? 'completed' : ''}`}
            onClick={handleCompleteButtonClick}
            title={isCompleted ? 'إلغاء الإتمام' : 'تحديد كمكتمل'}
          >
            <CheckCircle2 size={16} />
            <span>{isCompleted ? (lang === 'ar' ? 'مكتمل بنجاح' : 'Completed') : (lang === 'ar' ? 'تحديد كمكتمل' : 'Mark Complete')}</span>
          </button>

          <button
            className="lv-info__summary-btn"
            onClick={handleSummaryClick}
            title="تحميل ملخص الحصة"
          >
            <Download size={15} />
            <span>{lang === 'ar' ? 'تحميل الملخص (PDF)' : 'Summary PDF'}</span>
          </button>

          <button
            className={`lv-info__bm-btn ${isBookmarked ? 'active' : ''}`}
            onClick={handleBookmarkClick}
            title="حفظ للمراجعة اللاحقة"
          >
            {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};
