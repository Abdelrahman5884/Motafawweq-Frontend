import React from 'react';
import { Bookmark, Play } from 'lucide-react';

export const BookmarkedLessonsTab = ({ lesson, lang, onOpenLesson }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1.5px solid var(--primary)',
        borderRadius: '20px',
        padding: '22px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)' }}>
            الأحياء • 3 ثانوي
          </span>
          <Bookmark size={16} fill="var(--primary)" color="var(--primary)" />
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
          {lesson.titleAr}
        </h3>

        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          محفوظ للمراجعة قبل امتحان يوم الأحد. يتضمن التركيز على دورة كالفن ومصائد الثانوية العامة.
        </p>

        <button
          onClick={onOpenLesson}
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
            gap: '6px'
          }}
        >
          <Play size={15} fill="#FFFFFF" />
          <span>{lang === 'ar' ? 'فتح الحصة للمراجعة' : 'Open Lesson'}</span>
        </button>
      </div>
    </div>
  );
};
