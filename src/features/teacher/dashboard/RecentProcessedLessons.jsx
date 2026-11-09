import React from 'react';
import { Clock, Share2, Award, ArrowRight, BookOpen } from 'lucide-react';

export const RecentProcessedLessons = ({ lessons = [], lang, isRtl, onOpenLesson }) => {
  const isAr = lang === 'ar';

  // Ensure lessons are sorted from Newest to Oldest (من الأحدث للأقدم)
  const sortedLessons = [...lessons].sort((a, b) => {
    const dateA = new Date(a.recordedDate || 0).getTime();
    const dateB = new Date(b.recordedDate || 0).getTime();
    return dateB - dateA;
  });

  const getRelativeDateLabel = (dateStr, index) => {
    if (!dateStr) return isAr ? 'حديثاً' : 'Recent';
    if (index === 0) return isAr ? 'أحدث حصة' : 'Latest';
    return dateStr;
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px',
      boxShadow: 'var(--shadow-xs)',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {isAr ? 'الحصص المعالجة مؤخراً' : 'Recent Processed Lessons'}
          </h3>
        </div>
        {sortedLessons.length > 0 && (
          <span style={{
            fontSize: '11.5px',
            fontWeight: '700',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-subtle)',
            padding: '3px 9px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)'
          }}>
            {isAr ? 'مرتبة من الأحدث للأقدم' : 'Newest to Oldest'}
          </span>
        )}
      </div>

      {/* Sorted Lessons List (Newest to Oldest) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sortedLessons.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 16px',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border-subtle)'
          }}>
            <BookOpen size={36} style={{ margin: '0 auto 10px', opacity: 0.35, display: 'block' }} />
            <p style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'لا توجد حصص معالجة حتى الآن' : 'No processed lessons yet'}
            </p>
            <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              {isAr ? 'ابدأ بتسجيل أو رفع أول حصة من استوديو التسجيل' : 'Start by recording or uploading your first lesson from the studio'}
            </p>
          </div>
        ) : (
          sortedLessons.map((les, index) => {
            const isLatest = index === 0;

            return (
              <div
                key={les.id}
                onClick={() => onOpenLesson(les.id)}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: `1px solid ${isLatest ? 'rgba(0, 102, 204, 0.35)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isLatest ? 'rgba(0, 102, 204, 0.35)' : 'var(--border-subtle)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                {/* Top Tag Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: '800',
                      padding: '2px 7px',
                      borderRadius: '5px',
                      backgroundColor: isLatest ? 'var(--primary)' : 'var(--bg-surface)',
                      color: isLatest ? '#FFFFFF' : 'var(--text-secondary)',
                      border: isLatest ? 'none' : '1px solid var(--border-subtle)'
                    }}>
                      {getRelativeDateLabel(les.recordedDate, index)}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--primary)',
                    fontSize: '11.5px',
                    fontWeight: '700'
                  }}>
                    <span>{isAr ? 'فتح مساحة الدرس' : 'Open'}</span>
                    <ArrowRight size={13} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
                  </div>
                </div>

                {/* Title */}
                <div style={{
                  fontSize: '14.5px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                  lineHeight: 1.3
                }}>
                  {isAr ? (les.titleAr || les.title) : (les.titleEn || les.title || les.titleAr)}
                </div>

                {/* Metadata Badges */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  fontSize: '11.5px',
                  color: 'var(--text-secondary)',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  {les.durationFormatted && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} color="var(--text-muted)" />
                      <span>{les.durationFormatted}</span>
                    </div>
                  )}

                  {les.stats?.conceptsCount !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Share2 size={13} color="var(--primary)" />
                      <span>{les.stats.conceptsCount} {isAr ? 'مفهوم ذكي' : 'concepts'}</span>
                    </div>
                  )}

                  {les.stats?.completionRate != null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Award size={13} color="var(--success)" />
                      <span>{les.stats.completionRate}% {isAr ? 'إكمال' : 'completion'}</span>
                    </div>
                  )}

                  {les.stats?.avgQuizScore != null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginInlineStart: 'auto' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isAr ? 'الكويز:' : 'Quiz:'}</span>
                      <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{les.stats.avgQuizScore}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
