import React from 'react';
import { Bookmark, Play, Clock } from 'lucide-react';

export const BookmarkedLessonsTab = ({ lessons = [], lesson = null, lang, onOpenLesson }) => {
  const isAr = lang === 'ar';
  const items = Array.isArray(lessons) && lessons.length > 0
    ? lessons
    : (lesson && lesson.titleAr ? [lesson] : []);

  if (items.length === 0) {
    return (
      <div style={{
        padding: '48px 24px',
        textAlign: 'center',
        borderRadius: '20px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px dashed var(--border-subtle)',
        color: 'var(--text-secondary)',
      }}>
        <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
          {isAr ? 'لا توجد دروس محفوظة للمراجعة حالياً' : 'No Bookmarked Lessons'}
        </div>
        <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
          {isAr
            ? 'احفظ أي درس أثناء المشاهدة ليظهر هنا للوصول السريع قبل الامتحان.'
            : 'Bookmark any lesson while watching to find it here quickly.'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
      {items.map((item, idx) => {
        const lid = item.lessonId || item.id || '';
        const title = item.lessonTitleAr || item.titleAr || '';
        const courseLabel = item.courseTitleAr || item.subjectAr || (isAr ? 'مقرر دراسي' : 'Course');
        const pct = Number(item.progressPercent ?? 0);

        return (
          <div
            key={lid || `bm-${idx}`}
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1.5px solid var(--border-medium)',
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', gap: '8px' }}>
                <span style={{
                  fontSize: '11.5px',
                  fontWeight: '800',
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-light)',
                  padding: '3px 10px',
                  borderRadius: '8px',
                }}>
                  {courseLabel}
                </span>
                <Bookmark size={16} fill="var(--primary)" color="var(--primary)" />
              </div>

              <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0', lineHeight: 1.45 }}>
                {title}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                {item.durationLabel && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} color="var(--primary)" />
                    {item.durationLabel}
                  </span>
                )}
                <span>
                  {isAr ? `نسبة الإنجاز: ${pct}%` : `Progress: ${pct}%`}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenLesson && onOpenLesson(lid)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Play size={15} fill="#FFFFFF" />
              <span>{isAr ? 'فتح الحصة للمراجعة' : 'Open Lesson'}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
