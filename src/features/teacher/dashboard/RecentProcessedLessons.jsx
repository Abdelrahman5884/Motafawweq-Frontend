import React, { useMemo } from 'react';
import { Clock, Share2, Award, ArrowRight, BookOpen, Video, Mic, Layers, Plus } from 'lucide-react';

export const RecentProcessedLessons = ({
  lessons = [],
  lang,
  isRtl,
  onOpenLesson,
  onOpenStudio,
}) => {
  const isAr = lang === 'ar';

  const sortedLessons = useMemo(() => {
    return [...lessons].sort((a, b) => {
      const timeA = new Date(a.createdAt || a.recordedDate || 0).getTime();
      const timeB = new Date(b.createdAt || b.recordedDate || 0).getTime();
      return timeB - timeA;
    });
  }, [lessons]);

  const getRelativeDateLabel = (dateStr, index) => {
    if (index === 0) return isAr ? 'أحدث حصة' : 'Latest';
    if (!dateStr) return isAr ? 'حديثاً' : 'Recent';
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
      gap: '18px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {isAr ? 'أحدث الحصص المضافة' : 'Recent Lessons'}
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
            border: '1px solid var(--border-subtle)',
          }}>
            {isAr ? 'من الأحدث للأقدم' : 'Newest First'}
          </span>
        )}
      </div>

      {/* Sorted Lessons List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sortedLessons.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '36px 16px',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border-subtle)',
          }}>
            <BookOpen size={34} style={{ margin: '0 auto 10px', opacity: 0.35, display: 'block' }} />
            <p style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'لا توجد حصص مضافة حتى الآن' : 'No lessons published yet'}
            </p>
            <p style={{ margin: '6px 0 14px', fontSize: '12px', color: 'var(--text-muted)' }}>
              {isAr ? 'ابدأ بتسجيل أو رفع أول حصة من استوديو التسجيل' : 'Start by recording or uploading your first lesson from the studio'}
            </p>
            {onOpenStudio && (
              <button
                type="button"
                onClick={onOpenStudio}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                <Plus size={14} />
                <span>{isAr ? 'تسجيل أو رفع حصة' : 'Add First Lesson'}</span>
              </button>
            )}
          </div>
        ) : (
          sortedLessons.map((les, index) => {
            const isLatest = index === 0;
            const isVideo = les.mediaMode === 'video' || les.mediaMode === 'embed';
            const courseLabel = isAr ? les.courseTitleAr : (les.courseTitleEn || les.courseTitleAr);

            return (
              <div
                key={les.id}
                role="button"
                tabIndex={0}
                onClick={() => onOpenLesson(les.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenLesson(les.id);
                  }
                }}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: `1px solid ${isLatest ? 'rgba(0, 102, 204, 0.35)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  position: 'relative',
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: '800',
                      padding: '2px 7px',
                      borderRadius: '5px',
                      backgroundColor: isLatest ? 'var(--primary)' : 'var(--bg-surface)',
                      color: isLatest ? '#FFFFFF' : 'var(--text-secondary)',
                      border: isLatest ? 'none' : '1px solid var(--border-subtle)',
                    }}>
                      {getRelativeDateLabel(les.recordedDate, index)}
                    </span>

                    {courseLabel && (
                      <span style={{
                        fontSize: '10.5px',
                        fontWeight: '700',
                        padding: '2px 7px',
                        borderRadius: '5px',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-subtle)',
                      }}>
                        {courseLabel}
                      </span>
                    )}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--primary)',
                    fontSize: '11.5px',
                    fontWeight: '700',
                  }}>
                    <span>{isAr ? 'فتح مساحة الدرس' : 'Open Workspace'}</span>
                    <ArrowRight size={13} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
                  </div>
                </div>

                {/* Title */}
                <div style={{
                  fontSize: '14.5px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                  lineHeight: 1.35,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                }}>
                  {isVideo ? (
                    <Video size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
                  ) : (
                    <Mic size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
                  )}
                  <span>{isAr ? (les.titleAr || les.title) : (les.titleEn || les.title || les.titleAr)}</span>
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
                  borderTop: '1px solid var(--border-subtle)',
                }}>
                  {les.durationFormatted && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} color="var(--text-muted)" />
                      <span>{les.durationFormatted}</span>
                    </div>
                  )}

                  {les.stats?.conceptsCount > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Share2 size={13} color="var(--primary)" />
                      <span>{les.stats.conceptsCount} {isAr ? 'مفهوم' : 'concepts'}</span>
                    </div>
                  )}

                  {les.stats?.chaptersCount > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Layers size={13} color="var(--text-muted)" />
                      <span>{les.stats.chaptersCount} {isAr ? 'فصل' : 'chapters'}</span>
                    </div>
                  )}

                  {les.stats?.completionRate != null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Award size={13} color="var(--success)" />
                      <span>
                        {les.stats.completionRate}% {isAr ? 'إكمال' : 'completion'}
                        {les.stats.viewersCount > 0 ? ` (${les.stats.viewersCount})` : ''}
                      </span>
                    </div>
                  )}

                  {les.stats?.avgQuizScore != null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginInlineStart: 'auto' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isAr ? 'متوسط المقرر:' : 'Course Avg:'}</span>
                      <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{les.stats.avgQuizScore}%</span>
                    </div>
                  )}

                  {!les.durationFormatted && !les.stats?.conceptsCount && !les.stats?.chaptersCount && les.stats?.completionRate == null && (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {les.recordedDate || (isAr ? 'جاهزة للإدارة' : 'Ready in workspace')}
                    </span>
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
