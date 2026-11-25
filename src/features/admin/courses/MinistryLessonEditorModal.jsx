import React, { useState, useEffect } from 'react';
import {
  X,
  Video,
  FileText,
  Plus,
  Trash2,
  Play,
  CheckCircle2,
  AlertCircle,
  Save,
  Clock,
  Paperclip,
} from 'lucide-react';
import { RESOURCE_TYPES, parseYouTubeUrl } from './ministryGrades';

const emptyAttachment = () => ({
  id: `att-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
  titleAr: '',
  type: 'pdf',
  url: '',
});

const fieldStyle = {
  width: '100%',
  padding: '10px 13px',
  borderRadius: '11px',
  border: '1.5px solid var(--border-subtle)',
  backgroundColor: 'var(--bg-subtle)',
  color: 'var(--text-primary)',
  fontSize: '13.5px',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '800',
  color: 'var(--text-primary)',
  marginBottom: '6px',
};

/**
 * Clean, dedicated modal for adding or editing a single Lesson (حصة) inside a Ministry course unit.
 */
export const MinistryLessonEditorModal = ({
  units = [],
  defaultUnitIndex = 0,
  lesson = null,
  lang = 'ar',
  isRtl = true,
  saving = false,
  onClose,
  onSave,
}) => {
  const isAr = lang === 'ar';
  const isEdit = Boolean(lesson?.id);

  const [unitIndex, setUnitIndex] = useState(() =>
    Math.max(0, Math.min(defaultUnitIndex, Math.max(0, units.length - 1)))
  );
  const [newUnitTitle, setNewUnitTitle] = useState('الوحدة الأولى: دروس المقرر');
  const [titleAr, setTitleAr] = useState(() => lesson?.titleAr || '');
  const [youtubeUrl, setYoutubeUrl] = useState(() => lesson?.youtubeUrl || '');
  const [durationMinutes, setDurationMinutes] = useState(() =>
    lesson?.durationMinutes !== null && lesson?.durationMinutes !== undefined ? String(lesson.durationMinutes) : ''
  );
  const [contentAr, setContentAr] = useState(() => lesson?.contentAr || lesson?.notesAr || '');
  const [attachments, setAttachments] = useState(() =>
    Array.isArray(lesson?.attachments) ? lesson.attachments.map((a) => ({ ...a })) : []
  );

  const [showEmbedPreview, setShowEmbedPreview] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !saving) onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, saving]);

  const parsedYt = parseYouTubeUrl(youtubeUrl);
  const hasYtInput = youtubeUrl.trim() !== '';

  const addAttachmentRow = () => {
    setAttachments((prev) => [...prev, emptyAttachment()]);
  };

  const updateAttachmentRow = (idx, patch) => {
    setAttachments((prev) => prev.map((row, i) => (i === idx ? { ...row, ...patch } : row)));
  };

  const removeAttachmentRow = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!titleAr.trim()) {
      setFormError(isAr ? 'يرجى إدخال عنوان الحصة.' : 'Lesson title is required.');
      return;
    }

    if (hasYtInput && !parsedYt) {
      setFormError(
        isAr
          ? 'رابط يوتيوب غير صحيح — يرجى لصق رابط صالح من youtube.com أو youtu.be.'
          : 'Invalid YouTube URL.'
      );
      return;
    }

    const cleanAttachments = attachments
      .filter((a) => String(a.titleAr || '').trim() || String(a.url || '').trim())
      .map((a, idx) => ({
        id: a.id,
        titleAr: String(a.titleAr || '').trim() || `ملف مرفق #${idx + 1}`,
        type: a.type || 'pdf',
        url: String(a.url || '').trim() || null,
      }));

    if (!hasYtInput && !contentAr.trim() && cleanAttachments.length === 0) {
      setFormError(
        isAr
          ? 'يرجى إضافة رابط فيديو يوتيوب أو كتابة محتوى نصي للحصة أو إرفاق ملف.'
          : 'Please provide a YouTube video, written lesson content, or an attachment.'
      );
      return;
    }

    const payload = {
      unitIndex,
      unitTitleAr: units.length === 0 ? newUnitTitle.trim() || 'الوحدة الأولى: دروس المقرر' : undefined,
      titleAr: titleAr.trim(),
      youtubeUrl: hasYtInput ? youtubeUrl.trim() : '',
      durationMinutes: durationMinutes !== '' ? Number(durationMinutes) : null,
      contentAr: contentAr.trim(),
      attachments: cleanAttachments,
    };

    try {
      await onSave?.(payload, unitIndex);
    } catch (err) {
      const firstErr =
        err?.errors && typeof err.errors === 'object'
          ? Object.values(err.errors).flat()[0]
          : null;
      setFormError(firstErr || err?.message || (isAr ? 'تعذر حفظ الحصة.' : 'Failed to save lesson.'));
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => !saving && onClose?.()}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 37, 78, 0.62)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '16px',
      }}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '22px',
          width: '100%',
          maxWidth: '660px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          direction: isRtl ? 'rtl' : 'ltr',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            background: 'linear-gradient(135deg, #06254E 0%, #1588C7 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Video size={20} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: '#FFFFFF' }}>
                {isEdit ? (isAr ? 'تعديل الحصة والمحتوى' : 'Edit Lesson') : (isAr ? 'إضافة حصة جديدة للمقرر' : 'Add New Lesson')}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(255, 255, 255, 0.82)' }}>
                {isAr
                  ? 'أضف فيديو الشرح من يوتيوب، الملخص النصي للدرس، وأي مذكرات أو ملفات مرفقة'
                  : 'Attach a YouTube lesson video, written explanation, and study files'}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={17} />
          </button>
        </div>

        {formError && (
          <div
            role="alert"
            style={{
              margin: '14px 24px 0',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: '#DC2626',
              fontSize: '12.5px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{formError}</span>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Target Unit selector (when creating) */}
          {!isEdit && (
            units.length > 0 ? (
              <div>
                <label style={labelStyle}>{isAr ? 'الوحدة / الباب الدراسي' : 'Target Unit'}</label>
                <select
                  value={unitIndex}
                  onChange={(e) => setUnitIndex(Number(e.target.value))}
                  style={{ ...fieldStyle, fontWeight: '700', cursor: 'pointer' }}
                >
                  {units.map((u, idx) => (
                    <option key={idx} value={idx}>
                      {idx + 1}. {u.titleAr}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label style={labelStyle}>{isAr ? 'عنوان الوحدة الأولى (تُنشأ تلقائياً مع الحصة)' : 'First Unit Title'}</label>
                <input
                  type="text"
                  value={newUnitTitle}
                  onChange={(e) => setNewUnitTitle(e.target.value)}
                  placeholder={isAr ? 'مثال: الوحدة الأولى: تأسيس ومفاهيم أساسية' : 'Unit 1 title'}
                  style={fieldStyle}
                />
              </div>
            )
          )}

          {/* Lesson Title + Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: '12px' }}>
            <div>
              <label style={labelStyle}>{isAr ? 'عنوان الحصة / الدرس *' : 'Lesson Title *'}</label>
              <input
                type="text"
                required
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder={isAr ? 'مثال: الحصة الأولى — شرح الدرس الأول وتطبيقاته' : 'Lesson title'}
                style={fieldStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} />
                  {isAr ? 'المدة (دقيقة)' : 'Duration (min)'}
                </span>
              </label>
              <input
                type="number"
                min={0}
                max={600}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="25"
                style={fieldStyle}
              />
            </div>
          </div>

          {/* YouTube Video Input + Instant Preview */}
          <div
            style={{
              padding: '14px',
              borderRadius: '14px',
              backgroundColor: 'rgba(220, 38, 38, 0.035)',
              border: '1px solid rgba(220, 38, 38, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <label style={{ ...labelStyle, marginBottom: 0, color: '#B91C1C', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Video size={15} />
              <span>{isAr ? 'رابط فيديو الحصة من يوتيوب (YouTube)' : 'YouTube Video URL'}</span>
            </label>

            <input
              type="url"
              dir="ltr"
              value={youtubeUrl}
              onChange={(e) => {
                setYoutubeUrl(e.target.value);
                setShowEmbedPreview(false);
              }}
              placeholder="https://www.youtube.com/watch?v=...  أو  https://youtu.be/..."
              style={{
                ...fieldStyle,
                backgroundColor: 'var(--bg-surface)',
                borderColor: !hasYtInput ? 'var(--border-subtle)' : parsedYt ? '#16A34A' : '#DC2626',
              }}
            />

            {hasYtInput && (
              parsedYt ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={parsedYt.thumbnailUrl}
                        alt={titleAr || 'YouTube'}
                        style={{ width: '80px', height: '46px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                      />
                      <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '800', color: '#15803D' }}>
                          <CheckCircle2 size={14} />
                          <span>{isAr ? 'فيديو يوتيوب جاهز للعرض' : 'Valid YouTube Video'}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                          ID: {parsedYt.youtubeId}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowEmbedPreview((v) => !v)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 12px',
                        borderRadius: '9px',
                        border: '1px solid var(--primary)',
                        backgroundColor: 'var(--primary-surface)',
                        color: 'var(--primary)',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                      }}
                    >
                      <Play size={12} />
                      <span>{showEmbedPreview ? (isAr ? 'إخفاء المشغل' : 'Hide Player') : (isAr ? 'تجربة تشغيل الفيديو' : 'Test Video')}</span>
                    </button>
                  </div>

                  {showEmbedPreview && (
                    <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000' }}>
                      <iframe
                        src={parsedYt.embedUrl}
                        title={titleAr || 'Preview'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <AlertCircle size={14} />
                  <span>{isAr ? 'رابط غير مدعوم — الصق رابط فيديو من youtube.com أو youtu.be' : 'Invalid YouTube link'}</span>
                </div>
              )
            )}
          </div>

          {/* Written Lesson Content / Notes */}
          <div>
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={14} color="var(--primary)" />
              <span>{isAr ? 'المحتوى النصي للحصة / الشرح والملخص' : 'Lesson Written Content & Summary'}</span>
            </label>
            <textarea
              rows={4}
              value={contentAr}
              onChange={(e) => setContentAr(e.target.value)}
              placeholder={
                isAr
                  ? 'اكتب شرح الدرس، أهم القوانين والمفاهيم، أو ملخص النقاط التي يراجعها الطالب مع الحصة...'
                  : 'Write lesson notes, key concepts, formulas, or study summary...'
              }
              style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.65 }}
            />
          </div>

          {/* Lesson Attachments (PDFs / Worksheets / Links) */}
          <div
            style={{
              padding: '14px',
              borderRadius: '14px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                <Paperclip size={14} color="var(--primary)" />
                {isAr ? 'ملفات ومذكرات مرفقة بالحصة (اختياري)' : 'Lesson Attachments (optional)'}
              </span>
              <button
                type="button"
                onClick={addAttachmentRow}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 11px',
                  borderRadius: '8px',
                  border: '1px solid var(--primary)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--primary)',
                  fontSize: '11.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                <Plus size={13} />
                <span>{isAr ? 'إضافة مرفق' : 'Add File'}</span>
              </button>
            </div>

            {attachments.map((att, idx) => (
              <div
                key={att.id || idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 125px 1.2fr auto',
                  gap: '8px',
                  alignItems: 'center',
                  backgroundColor: 'var(--bg-surface)',
                  padding: '8px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <input
                  type="text"
                  value={att.titleAr}
                  onChange={(e) => updateAttachmentRow(idx, { titleAr: e.target.value })}
                  placeholder={isAr ? 'اسم المذكرة / الملف' : 'File title'}
                  style={{ ...fieldStyle, padding: '8px 10px', fontSize: '12.5px' }}
                />
                <select
                  value={att.type}
                  onChange={(e) => updateAttachmentRow(idx, { type: e.target.value })}
                  style={{ ...fieldStyle, padding: '8px 8px', fontSize: '12px' }}
                >
                  {RESOURCE_TYPES.map((rt) => (
                    <option key={rt.value} value={rt.value}>
                      {isAr ? rt.labelAr : rt.labelEn}
                    </option>
                  ))}
                </select>
                <input
                  type="url"
                  dir="ltr"
                  value={att.url}
                  onChange={(e) => updateAttachmentRow(idx, { url: e.target.value })}
                  placeholder="https://..."
                  style={{ ...fieldStyle, padding: '8px 10px', fontSize: '12.5px' }}
                />
                <button
                  type="button"
                  onClick={() => removeAttachmentRow(idx)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'rgba(220, 38, 38, 0.08)',
                    color: '#DC2626',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            style={{
              padding: '9px 16px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '10px 22px',
              borderRadius: '11px',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '800',
              cursor: saving ? 'wait' : 'pointer',
              boxShadow: 'var(--shadow-primary)',
            }}
          >
            <Save size={15} />
            <span>
              {saving
                ? isAr ? 'جاري الحفظ...' : 'Saving...'
                : isEdit
                  ? isAr ? 'حفظ تعديلات الحصة' : 'Save Lesson'
                  : isAr ? 'إضافة الحصة للمقرر' : 'Add Lesson'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
