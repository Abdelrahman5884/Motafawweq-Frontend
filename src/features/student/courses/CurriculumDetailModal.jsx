import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  ExternalLink,
  ClipboardCheck,
  Landmark,
  BookOpen,
  Video,
  Play,
  FileText,
  Clock,
  Paperclip,
} from 'lucide-react';

export const CurriculumDetailModal = ({
  item,
  lang = 'ar',
  isRtl = true,
  onClose,
  onToggleUnit,
  togglingUnitKey = '',
  onTakeMinistryExam,
}) => {
  const isAr = lang === 'ar';
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    if (!item) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const units = Array.isArray(item.units) ? item.units : [];
  const progress = Math.min(100, Math.max(0, Number(item.progressPercent || 0)));

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: '22px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '88vh',
          overflowY: 'auto',
          padding: '26px',
          boxShadow: '0 24px 50px rgba(0, 0, 0, 0.22)',
          position: 'relative',
          direction: isRtl ? 'rtl' : 'ltr',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={isAr ? 'إغلاق' : 'Close'}
          style={{
            position: 'absolute',
            top: '18px',
            insetInlineEnd: '18px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={15} />
        </button>

        {/* Source Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11.5px',
            fontWeight: '800',
            color: '#059669',
            backgroundColor: 'rgba(5, 150, 105, 0.1)',
            padding: '4px 10px',
            borderRadius: '999px',
            marginBottom: '10px',
          }}
        >
          <Landmark size={13} />
          <span>{isAr ? item.sourceAr : item.sourceEn || item.sourceAr}</span>
        </div>

        <h3 style={{ fontSize: '19px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
          {isAr ? item.titleAr : item.titleEn || item.titleAr}
        </h3>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
          {isAr ? item.gradeSubtitleAr || item.gradeAr : item.gradeSubtitleEn || item.gradeAr}
        </p>

        {item.descriptionAr && (
          <p style={{ fontSize: '13px', color: 'var(--text-primary)', backgroundColor: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: '12px', margin: '0 0 14px 0', lineHeight: 1.65 }}>
            {isAr ? item.descriptionAr : item.descriptionEn || item.descriptionAr}
          </p>
        )}

        {/* Active Lesson Viewer (YouTube Player + Written Content + Attachments) */}
        {activeLesson && (
          <div style={{ marginBottom: '16px', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid var(--primary)', backgroundColor: '#0B1120' }}>
            <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFFFFF', fontSize: '13px', fontWeight: '800' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                <Video size={16} color="#5CB6DB" />
                {activeLesson.titleAr}
              </span>
              <button
                type="button"
                onClick={() => setActiveLesson(null)}
                style={{ background: 'rgba(255,255,255,0.14)', border: 'none', color: '#FFF', padding: '4px 10px', borderRadius: '8px', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer' }}
              >
                {isAr ? 'إغلاق الحصة' : 'Close Lesson'}
              </button>
            </div>

            {activeLesson.embedUrl && (
              <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  src={activeLesson.embedUrl}
                  title={activeLesson.titleAr || 'YouTube Lesson'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                />
              </div>
            )}

            {(activeLesson.contentAr || activeLesson.notesAr || (activeLesson.attachments || []).length > 0) && (
              <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(activeLesson.contentAr || activeLesson.notesAr) && (
                  <div style={{ fontSize: '13px', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {activeLesson.contentAr || activeLesson.notesAr}
                  </div>
                )}
                {Array.isArray(activeLesson.attachments) && activeLesson.attachments.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {activeLesson.attachments.map((att, idx) => (
                      <a
                        key={att.id || idx}
                        href={att.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '6px 12px',
                          borderRadius: '9px',
                          backgroundColor: 'var(--primary-surface)',
                          color: 'var(--primary)',
                          fontSize: '12px',
                          fontWeight: '800',
                          textDecoration: 'none',
                        }}
                      >
                        <Paperclip size={13} />
                        <span>{att.titleAr}</span>
                        {att.url && <ExternalLink size={11} />}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Overall Progress Bar */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '14px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              fontWeight: '800',
              color: 'var(--text-secondary)',
              marginBottom: '6px',
            }}
          >
            <span>
              {isAr
                ? `تقدمك في وحدات المنهج (${item.completedUnitsCount || 0} من ${units.length})`
                : `Curriculum Progress (${item.completedUnitsCount || 0} of ${units.length})`}
            </span>
            <span style={{ color: progress >= 100 ? '#059669' : 'var(--primary)' }}>{progress}%</span>
          </div>
          <div style={{ height: '7px', borderRadius: '99px', backgroundColor: 'var(--bg-surface)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: progress >= 100 ? '#059669' : 'var(--primary)',
                borderRadius: '99px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
            {isAr
              ? 'اضغط على مربع أي وحدة لتسجيل إتمامها، واضغط على أي حصة لمشاهدة فيديو الشرح والملخصات.'
              : 'Check any unit to mark it completed, and click any lesson to watch its video & study notes.'}
          </div>
        </div>

        {/* Interactive Official Units + Lessons & Resources */}
        {units.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
            {units.map((unit) => {
              const busy = togglingUnitKey === `${item.code}:${unit.index}`;
              const unitLessons = Array.isArray(unit.lessons) && unit.lessons.length > 0
                ? unit.lessons
                : (Array.isArray(unit.videos) ? unit.videos : []);
              const unitResources = Array.isArray(unit.resources) ? unit.resources : [];

              return (
                <div
                  key={unit.index}
                  style={{
                    padding: '13px 14px',
                    borderRadius: '14px',
                    backgroundColor: unit.isCompleted ? 'rgba(5, 150, 105, 0.07)' : 'var(--bg-subtle)',
                    border: unit.isCompleted
                      ? '1.5px solid rgba(5, 150, 105, 0.4)'
                      : '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onToggleUnit?.(item.code, unit.index)}
                    style={{
                      width: '100%',
                      textAlign: 'inherit',
                      fontFamily: 'inherit',
                      padding: 0,
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: busy ? 'wait' : 'pointer',
                      opacity: busy ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        marginTop: '1px',
                        backgroundColor: unit.isCompleted ? '#059669' : 'var(--bg-surface)',
                        border: unit.isCompleted ? 'none' : '1.5px solid var(--border-medium)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {unit.isCompleted && <Check size={13} />}
                    </span>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '13.5px',
                          fontWeight: '800',
                          color: 'var(--text-primary)',
                          textDecoration: unit.isCompleted ? 'line-through' : 'none',
                          opacity: unit.isCompleted ? 0.85 : 1,
                        }}
                      >
                        {isAr ? unit.titleAr : unit.titleEn || unit.titleAr}
                      </div>
                      {Array.isArray(unit.topics) && unit.topics.length > 0 && (
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                          {unit.topics.join(' • ')}
                        </div>
                      )}
                    </div>
                  </button>

                  {unit.summaryAr && (
                    <div
                      style={{
                        padding: '9px 12px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12.5px',
                        color: 'var(--text-primary)',
                        lineHeight: 1.65,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {unit.summaryAr}
                    </div>
                  )}

                  {unitLessons.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))', gap: '8px' }}>
                      {unitLessons.map((les, lIdx) => {
                        const hasVideo = Boolean(les.embedUrl || les.youtubeId);
                        return (
                          <button
                            key={les.id || lIdx}
                            type="button"
                            onClick={() => setActiveLesson(les)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 10px',
                              borderRadius: '10px',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-surface)',
                              cursor: 'pointer',
                              textAlign: 'inherit',
                            }}
                          >
                            <div style={{ position: 'relative', width: '60px', height: '38px', borderRadius: '7px', overflow: 'hidden', flexShrink: 0, backgroundColor: hasVideo ? '#111' : 'var(--primary-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {hasVideo && les.thumbnailUrl ? (
                                <>
                                  <img src={les.thumbnailUrl} alt={les.titleAr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.35)', color: '#FFF' }}>
                                    <Play size={13} fill="#FFF" />
                                  </span>
                                </>
                              ) : (
                                <FileText size={16} color="var(--primary)" />
                              )}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {les.titleAr}
                              </div>
                              {les.durationMinutes ? (
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                                  <Clock size={11} />
                                  <span>{les.durationMinutes} {isAr ? 'دقيقة' : 'min'}</span>
                                </div>
                              ) : null}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {unitResources.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {unitResources.map((res, rIdx) => (
                        <div
                          key={res.id || rIdx}
                          style={{
                            padding: '8px 11px',
                            borderRadius: '10px',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            fontSize: '12px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: '700', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <FileText size={13} />
                              {res.titleAr}
                            </span>
                            {res.url && (
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: '700', textDecoration: 'none' }}
                              >
                                <span>{isAr ? 'فتح' : 'Open'}</span>
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                          {res.contentAr && (
                            <p style={{ margin: '5px 0 0', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                              {res.contentAr}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          {item.textbookUrl && (
            <a
              href={item.textbookUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 14px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontWeight: '700',
                fontSize: '12.5px',
                textDecoration: 'none',
              }}
            >
              <BookOpen size={14} />
              <span>{isAr ? 'بوابة كتب الوزارة الرسمية' : 'MOE Official Textbooks'}</span>
              <ExternalLink size={12} />
            </a>
          )}

          <div style={{ display: 'flex', gap: '8px', marginInlineStart: 'auto' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 14px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '12.5px',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>

            {item.examCode && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onTakeMinistryExam?.(item);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(5, 150, 105, 0.28)',
                }}
              >
                <ClipboardCheck size={15} />
                <span>{isAr ? 'ابدأ اختبار الوزارة الاسترشادي' : 'Take MOE Practice Exam'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
