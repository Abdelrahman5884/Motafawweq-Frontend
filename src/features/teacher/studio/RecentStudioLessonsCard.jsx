import React, { useState } from 'react';
import {
  Video,
  Mic,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Trash2,
  Clock,
  Layers,
  Loader2,
} from 'lucide-react';

export const RecentStudioLessonsCard = ({
  lessons = [],
  isLoading = false,
  lang = 'ar',
  isRtl = true,
  onOpenWorkspace,
  onDeleteLesson,
}) => {
  const isAr = lang === 'ar';
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleConfirmDelete = async (lessonId) => {
    setDeletingId(lessonId);
    try {
      await onDeleteLesson(lessonId);
      setConfirmDeleteId(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      style={{
        marginTop: '24px',
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px 22px',
        boxShadow: 'var(--shadow-xs)',
        textAlign: isRtl ? 'right' : 'left',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={17} color="var(--primary)" />
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {isAr ? `أحدث الحصص المرفوعة (${lessons.length})` : `Recent Uploaded Lessons (${lessons.length})`}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onOpenWorkspace('')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--primary)',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          <ExternalLink size={13} />
          <span>{isAr ? 'فتح مكتبة الحصص الكاملة' : 'Open Full Library'}</span>
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1, 2].map((i) => (
            <div key={i} style={{ height: '54px', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)' }} />
          ))}
        </div>
      ) : lessons.length === 0 ? (
        <div
          style={{
            padding: '22px',
            textAlign: 'center',
            borderRadius: '10px',
            border: '1px dashed var(--border-subtle)',
            color: 'var(--text-muted)',
            fontSize: '12.5px',
          }}
        >
          {isAr
            ? 'لا توجد حصص مرفوعة بعد. ابدأ بتسجيل أو رفع أول حصة من الاستوديو أعلاه.'
            : 'No uploaded lessons yet. Record or upload your first lesson above.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {lessons.slice(0, 6).map((lesson) => {
            const lid = lesson.id || lesson.uuid;
            const isVideo = lesson.mediaType === 'video' || lesson.mode === 'video' || lesson.mode === 'embed';
            const pdfCount = Array.isArray(lesson.lessonPdfs) ? lesson.lessonPdfs.length : 0;
            const imgCount = Array.isArray(lesson.lessonImages) ? lesson.lessonImages.length : 0;
            const isConfirming = confirmDeleteId === lid;
            const isDeletingThis = deletingId === lid;

            return (
              <div
                key={lid}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--primary-surface)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isVideo ? <Video size={18} /> : <Mic size={18} />}
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: '13.5px',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {lesson.titleAr || lesson.title}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexWrap: 'wrap',
                        fontSize: '11.5px',
                        color: 'var(--text-muted)',
                        marginTop: '2px',
                      }}
                    >
                      {lesson.courseTitleAr && <span>{lesson.courseTitleAr}</span>}
                      {lesson.durationLabel && lesson.durationLabel !== '00:00' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={11} /> {lesson.durationLabel}
                        </span>
                      )}
                      {pdfCount > 0 && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <FileText size={11} /> {pdfCount} PDF
                        </span>
                      )}
                      {imgCount > 0 && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <ImageIcon size={11} /> {imgCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isConfirming ? (
                    <>
                      <button
                        type="button"
                        disabled={isDeletingThis}
                        onClick={() => handleConfirmDelete(lid)}
                        style={{
                          padding: '6px 11px',
                          borderRadius: '7px',
                          border: 'none',
                          backgroundColor: '#EF4444',
                          color: '#FFFFFF',
                          fontSize: '11.5px',
                          fontWeight: '800',
                          cursor: isDeletingThis ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        {isDeletingThis && <Loader2 size={12} className="studio-spin" />}
                        <span>{isAr ? 'تأكيد الحذف' : 'Confirm'}</span>
                      </button>
                      <button
                        type="button"
                        disabled={isDeletingThis}
                        onClick={() => setConfirmDeleteId(null)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '7px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-surface-elevated)',
                          color: 'var(--text-secondary)',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        {isAr ? 'إلغاء' : 'Cancel'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => onOpenWorkspace(lid)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '7px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-surface-elevated)',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        {isAr ? 'عرض / تعديل' : 'Open'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(lid)}
                        title={isAr ? 'حذف الحصة' : 'Delete lesson'}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '7px',
                          border: 'none',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: '#EF4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
