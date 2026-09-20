import React from 'react';
import { Play } from 'lucide-react';

export const WorkspaceOverviewTab = ({ lesson, lang, onJumpToChapter }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Key Metrics Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px'
      }}>
        <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'المفاهيم المستخرجة' : 'Concepts Extracted'}</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary)', marginTop: '4px' }}>{lesson.stats.conceptsCount}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'فصول الحصة' : 'Chapters'}</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary-light)', marginTop: '4px' }}>{lesson.stats.chaptersCount}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الأسئلة المولدة' : 'Quiz Questions'}</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--success)', marginTop: '4px' }}>{lesson.stats.quizQuestionsCount}</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'متوسط استيعاب الطلاب' : 'Class Mastery Avg'}</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--warning)', marginTop: '4px' }}>{lesson.stats.avgQuizScore}%</div>
        </div>
      </div>

      {/* Chapters Table */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
          {lang === 'ar' ? 'فصول الحصة والتوقيتات الزمنية' : 'Lesson Chapters & Milestones'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {lesson.chapters.map(ch => (
            <div
              key={ch.id}
              onClick={() => onJumpToChapter(ch.startSeconds)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)'
                }}>
                  {ch.timestamp}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? ch.titleAr : ch.title}
                </span>
              </div>
              <Play size={14} color="var(--primary)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
