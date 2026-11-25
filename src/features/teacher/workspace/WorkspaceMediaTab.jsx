import React, { useState } from 'react';
import {
  Video,
  Mic,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  Edit3,
  Save,
  X,
  Clock,
  Cloud,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  formatBytesLabel,
  formatSecondsToTimestamp,
  parseTimestampToSeconds,
  getEmbedIframeSrc,
  isIframeEmbedUrl,
} from './workspaceUtils';

export const WorkspaceMediaTab = ({
  lesson,
  audioRef,
  videoRef,
  lang,
  isRtl,
  onJumpToTimestamp,
  onGetCurrentTime,
  onSyncChapters,
  onReorderWhiteboards,
  onDeleteAttachment,
  onOpenLightbox,
  onPreviewPdf,
}) => {
  const isAr = lang === 'ar';

  // Chapters inline editor state
  const [editingChapters, setEditingChapters] = useState(false);
  const [chapterDrafts, setChapterDrafts] = useState([]);
  const [savingChapters, setSavingChapters] = useState(false);
  const [chaptersError, setChaptersError] = useState('');

  // Reordering/deleting attachment state
  const [busyAttachmentId, setBusyAttachmentId] = useState(null);

  const openChaptersEditor = () => {
    setChaptersError('');
    setChapterDrafts(
      (lesson.chapters || []).map((ch, idx) => ({
        key: ch.id || `ch-${idx}`,
        titleAr: ch.titleAr || ch.title || '',
        timestamp: ch.timestamp || formatSecondsToTimestamp(ch.startSeconds || 0),
      }))
    );
    setEditingChapters(true);
  };

  const handleAddChapterRow = () => {
    const nowSecs = onGetCurrentTime ? onGetCurrentTime() : 0;
    setChapterDrafts((prev) => [
      ...prev,
      {
        key: `new-${Date.now()}-${prev.length}`,
        titleAr: '',
        timestamp: formatSecondsToTimestamp(nowSecs),
      },
    ]);
  };

  const handleSaveChapters = async () => {
    setChaptersError('');
    const cleaned = chapterDrafts
      .map((row) => ({
        title_ar: row.titleAr.trim(),
        start_seconds: parseTimestampToSeconds(row.timestamp),
        timestamp: formatSecondsToTimestamp(parseTimestampToSeconds(row.timestamp)),
      }))
      .filter((row) => row.title_ar.length > 0);

    setSavingChapters(true);
    try {
      await onSyncChapters(lesson.id, cleaned);
      setEditingChapters(false);
    } catch (err) {
      setChaptersError(err?.message || (isAr ? 'تعذر حفظ فصول الحصة.' : 'Failed to save chapters.'));
    } finally {
      setSavingChapters(false);
    }
  };

  const handleMoveWhiteboard = async (index, delta) => {
    const images = lesson.lessonImages || [];
    const targetIdx = index + delta;
    if (targetIdx < 0 || targetIdx >= images.length || busyAttachmentId) return;
    const reordered = [...images];
    [reordered[index], reordered[targetIdx]] = [reordered[targetIdx], reordered[index]];

    setBusyAttachmentId(images[index].id);
    try {
      await onReorderWhiteboards(
        lesson.id,
        reordered.map((i) => i.id)
      );
    } finally {
      setBusyAttachmentId(null);
    }
  };

  const handleDeleteAtt = async (attId) => {
    if (busyAttachmentId) return;
    setBusyAttachmentId(attId);
    try {
      await onDeleteAttachment(lesson.id, attId);
    } finally {
      setBusyAttachmentId(null);
    }
  };

  // Determine exact media presentation cleanly
  const hasEmbed = Boolean(lesson.embedUrl);
  const useEmbed = lesson.mode === 'embed' || (!lesson.mediaStreamUrl && hasEmbed);
  const showVideoPlayer = !useEmbed && lesson.mediaType === 'video' && Boolean(lesson.mediaStreamUrl);
  const showAudioPlayer = !useEmbed && lesson.mediaType === 'audio' && Boolean(lesson.mediaStreamUrl);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Media Player & Chapters Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '22px 24px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {useEmbed || lesson.mediaType === 'video' ? (
              <Video size={18} color="var(--primary)" />
            ) : (
              <Mic size={18} color="var(--primary)" />
            )}
            <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {useEmbed || lesson.mediaType === 'video'
                ? isAr
                  ? 'فيديو الحصة'
                  : 'Lesson Video'
                : isAr
                  ? 'التسجيل الصوتي للحصة'
                  : 'Lesson Audio Recording'}
            </h3>
            {lesson.mediaDisk === 'supabase' && !useEmbed && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#10B981',
                }}
              >
                <Cloud size={11} />
                <span>{isAr ? 'مخزّن سحابياً' : 'Cloud'}</span>
              </span>
            )}
          </div>

          {lesson.mediaOriginalName && !useEmbed && (
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              {lesson.mediaOriginalName}
              {lesson.mediaSizeBytes ? ` (${formatBytesLabel(lesson.mediaSizeBytes)})` : ''}
            </span>
          )}
        </div>

        {/* Player Body */}
        {useEmbed ? (
          isIframeEmbedUrl(lesson.embedUrl) ? (
            <div
              style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                borderRadius: '14px',
                backgroundColor: '#000',
              }}
            >
              <iframe
                src={getEmbedIframeSrc(lesson.embedUrl)}
                title={lesson.titleAr}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div style={{ borderRadius: '14px', overflow: 'hidden', backgroundColor: '#000' }}>
              <video
                ref={videoRef}
                key={lesson.embedUrl}
                controls
                src={lesson.embedUrl}
                style={{ width: '100%', maxHeight: '460px', display: 'block' }}
              />
            </div>
          )
        ) : showVideoPlayer ? (
          <div style={{ borderRadius: '14px', overflow: 'hidden', backgroundColor: '#000' }}>
            <video
              ref={videoRef}
              key={lesson.mediaStreamUrl}
              controls
              src={lesson.mediaStreamUrl}
              style={{ width: '100%', maxHeight: '460px', display: 'block' }}
            />
          </div>
        ) : showAudioPlayer ? (
          <div
            style={{
              padding: '18px 20px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <audio
              ref={audioRef}
              key={lesson.mediaStreamUrl}
              controls
              src={lesson.mediaStreamUrl}
              style={{ width: '100%' }}
            />
          </div>
        ) : (
          <div
            style={{
              padding: '26px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-subtle)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '13.5px',
            }}
          >
            {isAr
              ? 'لم يتم رفع ملف صوتي أو فيديو لهذه الحصة بعد — يمكنك إضافته من زر «تعديل الحصة».'
              : 'No media uploaded yet — add one via "Edit Lesson".'}
          </div>
        )}

        {/* Chapters Section (View + Live Editor) */}
        <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              marginBottom: '10px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
              <Clock size={15} color="var(--primary)" />
              <span>
                {isAr
                  ? `فصول وتوقيتات الحصة (${lesson.chapters?.length || 0})`
                  : `Lesson Chapters (${lesson.chapters?.length || 0})`}
              </span>
            </div>

            {!editingChapters ? (
              <button
                type="button"
                onClick={openChaptersEditor}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 11px',
                  borderRadius: '7px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                <Edit3 size={13} />
                <span>{isAr ? 'إدارة الفصول' : 'Manage Chapters'}</span>
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  disabled={savingChapters}
                  onClick={handleAddChapterRow}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '5px 10px',
                    borderRadius: '7px',
                    border: '1px solid var(--primary)',
                    backgroundColor: 'var(--primary-surface)',
                    color: 'var(--primary)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={13} />
                  <span>{isAr ? 'إضافة فصل' : 'Add Chapter'}</span>
                </button>
                <button
                  type="button"
                  disabled={savingChapters}
                  onClick={handleSaveChapters}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 12px',
                    borderRadius: '7px',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: savingChapters ? 'not-allowed' : 'pointer',
                  }}
                >
                  {savingChapters ? <Loader2 size={13} className="lw-spin" /> : <Save size={13} />}
                  <span>{isAr ? 'حفظ' : 'Save'}</span>
                </button>
                <button
                  type="button"
                  disabled={savingChapters}
                  onClick={() => setEditingChapters(false)}
                  style={{
                    padding: '5px 9px',
                    borderRadius: '7px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {chaptersError && (
            <div
              style={{
                marginBottom: '10px',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                fontSize: '12px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <AlertCircle size={14} />
              <span>{chaptersError}</span>
            </div>
          )}

          {editingChapters ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chapterDrafts.length === 0 ? (
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', padding: '10px', textAlign: 'center', backgroundColor: 'var(--bg-subtle)', borderRadius: '8px' }}>
                  {isAr ? 'لا توجد فصول — اضغط «إضافة فصل» أو اضغط «حفظ» لمسح الفصول.' : 'No chapters — click "Add Chapter" or "Save" to clear.'}
                </div>
              ) : (
                chapterDrafts.map((row, idx) => (
                  <div
                    key={row.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <input
                      type="text"
                      dir="ltr"
                      value={row.timestamp}
                      onChange={(e) =>
                        setChapterDrafts((prev) =>
                          prev.map((r, i) => (i === idx ? { ...r, timestamp: e.target.value } : r))
                        )
                      }
                      placeholder="00:00"
                      style={{
                        width: '74px',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        color: 'var(--primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        textAlign: 'center',
                      }}
                    />
                    <input
                      type="text"
                      value={row.titleAr}
                      onChange={(e) =>
                        setChapterDrafts((prev) =>
                          prev.map((r, i) => (i === idx ? { ...r, titleAr: e.target.value } : r))
                        )
                      }
                      placeholder={isAr ? 'عنوان الفصل (مثال: مقدمة الدرس)' : 'Chapter title'}
                      style={{
                        flex: 1,
                        minWidth: '160px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        color: 'var(--text-primary)',
                        fontSize: '12.5px',
                        fontFamily: 'inherit',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setChapterDrafts((prev) => prev.filter((_, i) => i !== idx))}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#EF4444',
                        cursor: 'pointer',
                        display: 'flex',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : lesson.chapters?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {lesson.chapters.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => onJumpToTimestamp(ch.startSeconds || 0)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  <span>{isAr ? ch.titleAr : ch.title}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--primary)' }}>
                    {ch.timestamp}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              {isAr
                ? 'لا توجد فصول مضافة بعد — اضغط «إدارة الفصول» لإضافة توقيتات سريعة يقفز إليها الطلاب.'
                : 'No chapters yet — click "Manage Chapters" to add timestamped markers.'}
            </div>
          )}
        </div>
      </div>

      {/* Attachments Card (PDFs + Ordered Whiteboard Images) */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '22px 24px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 14px 0' }}>
          {isAr ? 'الملازم وصور السبورة المرفقة' : 'Attached PDFs & Whiteboard Notes'}
        </h3>

        {(!lesson.lessonPdfs || lesson.lessonPdfs.length === 0) &&
        (!lesson.lessonImages || lesson.lessonImages.length === 0) ? (
          <div
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-subtle)',
              textAlign: 'center',
              fontSize: '13px',
              color: 'var(--text-tertiary)',
            }}
          >
            {isAr
              ? 'لا توجد ملازم PDF أو صور سبورة مرفقة بهذه الحصة — يمكنك إضافتها من «تعديل الحصة».'
              : 'No PDFs or whiteboard images attached yet.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* PDFs */}
            {lesson.lessonPdfs?.length > 0 && (
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={14} color="#EF4444" />
                  <span>{isAr ? `ملفات وملازم PDF (${lesson.lessonPdfs.length})` : `PDF Materials (${lesson.lessonPdfs.length})`}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                  {lesson.lessonPdfs.map((pdf) => (
                    <div
                      key={pdf.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-subtle)',
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {pdf.title || pdf.fileName}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                          {pdf.fileSize || ''}
                          {pdf.pagesCount ? ` • ${pdf.pagesCount} ${isAr ? 'صفحة' : 'pages'}` : ''}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => onPreviewPdf(pdf)}
                          title={isAr ? 'معاينة' : 'Preview'}
                          style={{
                            padding: '6px',
                            borderRadius: '7px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-surface-elevated)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                          }}
                        >
                          <Eye size={14} />
                        </button>
                        <a
                          href={pdf.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={isAr ? 'فتح في تبويب جديد' : 'Open'}
                          style={{
                            padding: '6px',
                            borderRadius: '7px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-surface-elevated)',
                            color: 'var(--primary)',
                            display: 'flex',
                          }}
                        >
                          <ExternalLink size={14} />
                        </a>
                        <button
                          type="button"
                          disabled={busyAttachmentId === pdf.id}
                          onClick={() => handleDeleteAtt(pdf.id)}
                          title={isAr ? 'حذف' : 'Delete'}
                          style={{
                            padding: '6px',
                            borderRadius: '7px',
                            border: 'none',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#EF4444',
                            cursor: busyAttachmentId === pdf.id ? 'not-allowed' : 'pointer',
                            display: 'flex',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ordered Whiteboard Images */}
            {lesson.lessonImages?.length > 0 && (
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ImageIcon size={14} color="var(--primary)" />
                  <span>{isAr ? `صور السبورة المرتبة (${lesson.lessonImages.length})` : `Ordered Whiteboard Images (${lesson.lessonImages.length})`}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {lesson.lessonImages.map((img, idx) => (
                    <div
                      key={img.id}
                      style={{
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-subtle)',
                      }}
                    >
                      <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => onOpenLightbox(img)}>
                        <img
                          src={img.url}
                          alt={img.title || `Whiteboard ${idx + 1}`}
                          style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            top: '8px',
                            [isRtl ? 'right' : 'left']: '8px',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            backgroundColor: 'rgba(15, 23, 42, 0.75)',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: '700',
                          }}
                        >
                          #{img.order || idx + 1}
                        </span>
                      </div>
                      <div style={{ padding: '10px 12px' }}>
                        <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {img.title}
                        </div>
                        {img.caption && (
                          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {img.caption}
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', gap: '4px' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              type="button"
                              disabled={idx === 0 || Boolean(busyAttachmentId)}
                              onClick={() => handleMoveWhiteboard(idx, -1)}
                              title={isAr ? 'تقديم' : 'Move up'}
                              style={{
                                padding: '4px 6px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-subtle)',
                                backgroundColor: 'var(--bg-surface-elevated)',
                                color: 'var(--text-primary)',
                                cursor: idx === 0 || busyAttachmentId ? 'not-allowed' : 'pointer',
                                opacity: idx === 0 ? 0.4 : 1,
                                display: 'flex',
                              }}
                            >
                              <ArrowUp size={12} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === lesson.lessonImages.length - 1 || Boolean(busyAttachmentId)}
                              onClick={() => handleMoveWhiteboard(idx, 1)}
                              title={isAr ? 'تأخير' : 'Move down'}
                              style={{
                                padding: '4px 6px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-subtle)',
                                backgroundColor: 'var(--bg-surface-elevated)',
                                color: 'var(--text-primary)',
                                cursor: idx === lesson.lessonImages.length - 1 || busyAttachmentId ? 'not-allowed' : 'pointer',
                                opacity: idx === lesson.lessonImages.length - 1 ? 0.4 : 1,
                                display: 'flex',
                              }}
                            >
                              <ArrowDown size={12} />
                            </button>
                          </div>
                          <button
                            type="button"
                            disabled={Boolean(busyAttachmentId)}
                            onClick={() => handleDeleteAtt(img.id)}
                            title={isAr ? 'حذف' : 'Delete'}
                            style={{
                              padding: '4px 6px',
                              borderRadius: '6px',
                              border: 'none',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              color: '#EF4444',
                              cursor: busyAttachmentId ? 'not-allowed' : 'pointer',
                              display: 'flex',
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
