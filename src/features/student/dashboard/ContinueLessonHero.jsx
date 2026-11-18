import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight, ArrowLeft } from 'lucide-react';

export const ContinueLessonHero = ({ lastLesson, lang, isRtl, isDark, themeAccent }) => {
  const navigate = useNavigate();

  if (!lastLesson || !lastLesson.titleAr) {
    return (
      <div className="executive-card" style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
          {lang === 'ar' ? 'لا توجد محاضرات قيد المشاهدة حالياً' : 'No Lesson in Progress'}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          {lang === 'ar'
            ? 'لم تبدأ مشاهدة أي درس بعد. تصفح المقررات المتاحة وابدأ رحلة المذاكرة الآن.'
            : 'You have not started any lessons yet. Browse your courses to begin.'}
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/courses')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: themeAccent || 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '9px 18px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <Play size={15} fill="#FFFFFF" />
          <span>{lang === 'ar' ? 'استعراض المقررات' : 'Browse Courses'}</span>
        </button>
      </div>
    );
  }

  const hasStarted = Number(lastLesson.progressPercent || 0) > 0 && lastLesson.pausedMinute && lastLesson.pausedMinute !== '00:00';
  const subjectName = lang === 'ar' ? lastLesson.subjectAr : (lastLesson.subjectEn || lastLesson.subjectAr);
  const teacherName = lang === 'ar' ? lastLesson.teacherAr : (lastLesson.teacherEn || lastLesson.teacherAr);

  const handleOpenLesson = () => {
    const baseRoute = lastLesson.route || '/student/lesson';
    const params = new URLSearchParams();
    if (lastLesson.courseId) params.set('courseId', lastLesson.courseId);
    if (lastLesson.lessonId) params.set('lessonId', lastLesson.lessonId);
    const query = params.toString();
    navigate(query ? `${baseRoute}?${query}` : baseRoute);
  };

  return (
    <div className="executive-card" style={{ padding: 0 }}>
      <div className="executive-hero-lesson">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.12)',
            color: themeAccent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Play size={22} fill={themeAccent} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '6px',
                background: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.12)',
                color: themeAccent,
                border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.25)'}`
              }}>
                {hasStarted
                  ? (lang === 'ar' ? 'آخر درس توقفت عنده' : 'Last Studied Lesson')
                  : (lang === 'ar' ? 'الحصة المقترحة للبدء' : 'Next Up Lesson')}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {subjectName}
                {teacherName ? ` • ${teacherName}` : ''}
              </span>
            </div>

            <h2 style={{
              fontSize: '17px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
              fontFamily: 'var(--font-heading), var(--font-arabic)'
            }}>
              {lang === 'ar' ? lastLesson.titleAr : (lastLesson.titleEn || lastLesson.titleAr)}
            </h2>

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span>
                {hasStarted
                  ? (lang === 'ar'
                      ? `توقفت عند الدقيقة ${lastLesson.pausedMinute} من ${lastLesson.totalDuration} (متبقي ${lastLesson.remainingMinutes} دقيقة)`
                      : `Paused at ${lastLesson.pausedMinute} / ${lastLesson.totalDuration} (${lastLesson.remainingMinutes}m left)`)
                  : (lang === 'ar'
                      ? `مدة الحصة: ${lastLesson.totalDuration}`
                      : `Duration: ${lastLesson.totalDuration}`)
                }
              </span>
              {lastLesson.nextLessonTitleAr && (
                <>
                  <span>•</span>
                  <span style={{ color: themeAccent, fontWeight: '600' }}>
                    {lang === 'ar' ? `الدرس القادم: ${lastLesson.nextLessonTitleAr}` : `Next: ${lastLesson.nextLessonTitleEn || lastLesson.nextLessonTitleAr}`}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Resume Action & Progress */}
        <div className="executive-hero-lesson-actions">
          <div style={{ minWidth: '140px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px', gap: '10px' }}>
              <span>{lastLesson.progressPercent}% {lang === 'ar' ? 'مكتمل' : 'completed'}</span>
              <span>{lang === 'ar' ? `الدرس ${lastLesson.lessonNumber} من ${lastLesson.totalLessons}` : `Lesson ${lastLesson.lessonNumber}/${lastLesson.totalLessons}`}</span>
            </div>
            <div style={{ height: '6px', background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ width: `${lastLesson.progressPercent}%`, height: '100%', background: themeAccent, borderRadius: '99px' }} />
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenLesson}
            className="executive-hero-resume-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: themeAccent,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: `0 4px 16px ${isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.35)'}`,
              minHeight: '44px'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
          >
            <Play size={16} fill="#FFFFFF" />
            <span>
              {hasStarted
                ? (lang === 'ar' ? `أكمل من حيث توقفت (${lastLesson.pausedMinute})` : 'Resume Where You Left Off')
                : (lang === 'ar' ? 'ابدأ مشاهدة الحصة الآن' : 'Start Lesson Now')}
            </span>
            {isRtl ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
};
