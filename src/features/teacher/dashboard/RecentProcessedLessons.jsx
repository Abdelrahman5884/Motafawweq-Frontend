import React from 'react';
import { Clock, Share2, Award, ArrowRight, BookOpen, CheckCircle2, Calendar } from 'lucide-react';

export const RecentProcessedLessons = ({ lessons, lang, isRtl, onOpenLesson }) => {
  const isAr = lang === 'ar';

  // Overall course progress mock stats
  const totalCourseLessons = 14;
  const completedLessons = 10;
  const courseProgressPct = Math.round((completedLessons / totalCourseLessons) * 100);

  // Ensure lessons are sorted from Newest to Oldest (من الأحدث للأقدم)
  const sortedLessons = [...lessons].sort((a, b) => {
    const dateA = new Date(a.recordedDate || '2026-09-01').getTime();
    const dateB = new Date(b.recordedDate || '2026-09-01').getTime();
    return dateB - dateA; // Descending: Newest first
  });

  const getRelativeDateLabel = (dateStr, index) => {
    if (index === 0) return isAr ? 'أحدث حصة • اليوم' : 'Latest • Today';
    if (index === 1) return isAr ? 'منذ 4 أيام' : '4 days ago';
    return isAr ? 'منذ أسبوع' : '1 week ago';
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
      </div>

      {/* ── COURSE PROGRESS BAR (Addressing Image 1) ── */}
      <div style={{
        backgroundColor: 'var(--bg-subtle)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)'
            }} />
            <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {isAr ? 'مسار المنهج — أحياء 3 ثانوي (2026)' : 'Biology 3rd Sec Curriculum'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              {completedLessons} / {totalCourseLessons} {isAr ? 'حصة معالجة' : 'lessons'}
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              padding: '1px 6px',
              borderRadius: '4px',
              backgroundColor: 'rgba(0, 102, 204, 0.1)',
              color: 'var(--primary)'
            }}>
              {courseProgressPct}%
            </span>
          </div>
        </div>

        {/* Visual Progress Bar Track */}
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: `${courseProgressPct}%`,
            height: '100%',
            backgroundColor: 'var(--primary)',
            borderRadius: '8px',
            transition: 'width 0.5s ease'
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span>{isAr ? 'بداية المنهج: الوحدة 1' : 'Start: Unit 1'}</span>
          <span>{isAr ? 'المتبقي 4 حصص حتى مراجعة نصف العام' : '4 lessons remaining'}</span>
        </div>
      </div>

      {/* Sorted Lessons List (Newest to Oldest) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sortedLessons.map((les, index) => {
          const isLatest = index === 0;
          const lessonNumber = totalCourseLessons - index;
          const lessonProgressPct = Math.round((lessonNumber / totalCourseLessons) * 100);

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
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    • {isAr ? `الحصة ${lessonNumber} من ${totalCourseLessons}` : `Lesson ${lessonNumber} of ${totalCourseLessons}`}
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
                {isAr ? les.titleAr : les.title}
              </div>

              {/* Micro Progress Bar of Course position */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  <span>{isAr ? 'موضع الحصة في المنهج' : 'Curriculum Progress'}</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>{lessonProgressPct}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${lessonProgressPct}%`,
                    height: '100%',
                    backgroundColor: isLatest ? 'var(--primary)' : 'var(--text-muted)',
                    borderRadius: '4px'
                  }} />
                </div>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} color="var(--text-muted)" />
                  <span>{les.durationFormatted}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Share2 size={13} color="var(--primary)" />
                  <span>{les.stats.conceptsCount} {isAr ? 'مفهوم ذكي' : 'concepts'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Award size={13} color="var(--success)" />
                  <span>{les.stats.completionRate}% {isAr ? 'إكمال واستيعاب' : 'completion'}</span>
                </div>

                {les.stats.avgQuizScore && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginInlineStart: 'auto' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isAr ? 'الكويز:' : 'Quiz:'}</span>
                    <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{les.stats.avgQuizScore}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
