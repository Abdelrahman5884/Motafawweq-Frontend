import React, { useState, useEffect } from 'react';
import {
  X,
  Landmark,
  Globe,
  AlertCircle,
  Save,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  MINISTRY_GRADES,
  TERM_OPTIONS,
  TRACK_OPTIONS,
  COMMON_SUBJECTS,
} from './ministryGrades';

const buildInitialForm = (curriculum, defaultGrade) => {
  if (!curriculum) {
    return {
      titleAr: '',
      titleEn: '',
      subjectAr: '',
      subjectEn: '',
      gradeAr: defaultGrade && defaultGrade !== 'all' ? defaultGrade : 'الصف الأول الابتدائي',
      gradeSubtitleAr: '',
      term: 'full_year',
      tracks: ['عام'],
      descriptionAr: '',
      textbookUrl: 'https://elearning1.moe.gov.eg/',
      isPublished: true,
    };
  }

  return {
    titleAr: curriculum.titleAr || '',
    titleEn: curriculum.titleEn || '',
    subjectAr: curriculum.subjectAr || '',
    subjectEn: curriculum.subjectEn || '',
    gradeAr: curriculum.gradeAr || 'الصف الأول الابتدائي',
    gradeSubtitleAr: curriculum.gradeSubtitleAr || '',
    term: curriculum.term || 'full_year',
    tracks: Array.isArray(curriculum.tracks) && curriculum.tracks.length > 0 ? curriculum.tracks : ['عام'],
    descriptionAr: curriculum.descriptionAr || '',
    textbookUrl: curriculum.textbookUrl || 'https://elearning1.moe.gov.eg/',
    isPublished: curriculum.isPublished !== false,
  };
};

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
  transition: 'border-color 0.15s ease',
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '800',
  color: 'var(--text-primary)',
  marginBottom: '6px',
};

/**
 * Step 1 Modal: Focused exclusively on creating or editing the Ministry Course metadata itself.
 * Adding units, YouTube videos, and lesson content happens cleanly inside MinistryCourseWorkspace.
 */
export const MinistryCurriculumEditorModal = ({
  curriculum = null,
  defaultGrade = '',
  lang = 'ar',
  isRtl = true,
  saving = false,
  onClose,
  onSave,
}) => {
  const isAr = lang === 'ar';
  const isEdit = Boolean(curriculum?.uuid || curriculum?.id);

  const [form, setForm] = useState(() => buildInitialForm(curriculum, defaultGrade));
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !saving) onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, saving]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (formError) setFormError('');
  };

  const handleGradeChange = (nextGrade) => {
    setForm((prev) => {
      const prevAutoPrefix = prev.subjectAr ? `${prev.subjectAr} — ` : '';
      const shouldUpdateTitle =
        !prev.titleAr.trim() || (prevAutoPrefix && prev.titleAr.startsWith(prevAutoPrefix));
      return {
        ...prev,
        gradeAr: nextGrade,
        titleAr: shouldUpdateTitle && prev.subjectAr ? `${prev.subjectAr} — ${nextGrade}` : prev.titleAr,
      };
    });
  };

  const handleQuickSubject = (sub) => {
    setForm((prev) => ({
      ...prev,
      subjectAr: sub.ar,
      subjectEn: sub.en,
      titleAr: !prev.titleAr.trim() || prev.subjectAr ? `${sub.ar} — ${prev.gradeAr}` : prev.titleAr,
    }));
    if (formError) setFormError('');
  };

  const toggleTrack = (track) => {
    setForm((prev) => {
      const exists = prev.tracks.includes(track);
      const next = exists ? prev.tracks.filter((t) => t !== track) : [...prev.tracks, track];
      return { ...prev, tracks: next.length > 0 ? next : ['عام'] };
    });
  };

  const submitWithMode = async (openWorkspaceAfter) => {
    setFormError('');
    if (!form.subjectAr.trim()) {
      setFormError(isAr ? 'يرجى اختيار أو كتابة اسم المادة الدراسية.' : 'Subject name is required.');
      return;
    }
    if (!form.titleAr.trim()) {
      setFormError(isAr ? 'يرجى إدخال عنوان المقرر الدراسي.' : 'Course title is required.');
      return;
    }

    const payload = {
      titleAr: form.titleAr.trim(),
      titleEn: form.titleEn.trim() || form.titleAr.trim(),
      subjectAr: form.subjectAr.trim(),
      subjectEn: form.subjectEn.trim() || form.subjectAr.trim(),
      gradeAr: form.gradeAr,
      gradeSubtitleAr: form.gradeSubtitleAr.trim() || undefined,
      term: form.term,
      tracks: form.tracks,
      descriptionAr: form.descriptionAr.trim(),
      textbookUrl: form.textbookUrl.trim() || undefined,
      isPublished: Boolean(form.isPublished),
    };

    try {
      await onSave?.(payload, { openWorkspaceAfter });
    } catch (err) {
      const firstErr =
        err?.errors && typeof err.errors === 'object'
          ? Object.values(err.errors).flat()[0]
          : null;
      setFormError(firstErr || err?.message || (isAr ? 'تعذر حفظ بيانات المقرر.' : 'Failed to save course.'));
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

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
        onSubmit={(e) => {
          e.preventDefault();
          submitWithMode(!isEdit);
        }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '22px',
          width: '100%',
          maxWidth: '640px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          direction: isRtl ? 'rtl' : 'ltr',
          overflow: 'hidden',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #06254E 0%, #0E3F7B 100%)',
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
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.14)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Landmark size={20} color="#5CB6DB" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: '#FFFFFF' }}>
                {isEdit
                  ? isAr ? 'تعديل بيانات المقرر الوزاري' : 'Edit Ministry Course Info'
                  : isAr ? 'إنشاء مقرر وزاري جديد' : 'Create New Ministry Course'}
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'rgba(255, 255, 255, 0.78)' }}>
                {isEdit
                  ? isAr ? 'عدّل البيانات الأساسية للمقرر، ويمكنك إدارة الحصص من داخل صفحة المقرر' : 'Update course details'
                  : isAr ? 'الخطوة 1: أنشئ المقرر ببياناته الأساسية، ثم ادخل عليه لإضافة الوحدات والحصص براحتك' : 'Step 1: Create course metadata, then add units & lessons inside'}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={17} />
          </button>
        </div>

        {formError && (
          <div
            role="alert"
            style={{
              margin: '16px 24px 0',
              padding: '11px 14px',
              borderRadius: '12px',
              backgroundColor: 'var(--error-light, rgba(220, 38, 38, 0.08))',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: 'var(--color-danger, #DC2626)',
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

        {/* Form Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Grade & Term */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
            <div>
              <label style={labelStyle}>
                {isAr ? 'الصف الدراسي *' : 'Grade Level *'}
              </label>
              <select
                value={form.gradeAr}
                onChange={(e) => handleGradeChange(e.target.value)}
                style={{ ...fieldStyle, fontWeight: '700', cursor: 'pointer' }}
              >
                <optgroup label={isAr ? 'المرحلة الابتدائية (1 — 6)' : 'Primary Stage (1 — 6)'}>
                  {MINISTRY_GRADES.filter((g) => g.stageGroup === 'stage-primary').map((g) => (
                    <option key={g.gradeAr} value={g.gradeAr}>
                      {isAr ? g.gradeAr : g.gradeEn}
                    </option>
                  ))}
                </optgroup>
                <optgroup label={isAr ? 'المرحلة الإعدادية (1 — 3)' : 'Preparatory Stage (1 — 3)'}>
                  {MINISTRY_GRADES.filter((g) => g.stageGroup === 'stage-prep').map((g) => (
                    <option key={g.gradeAr} value={g.gradeAr}>
                      {isAr ? g.gradeAr : g.gradeEn}
                    </option>
                  ))}
                </optgroup>
                <optgroup label={isAr ? 'المرحلة الثانوية (1 — 3)' : 'Secondary Stage (1 — 3)'}>
                  {MINISTRY_GRADES.filter((g) => g.stageGroup === 'secondary_all').map((g) => (
                    <option key={g.gradeAr} value={g.gradeAr}>
                      {isAr ? g.gradeAr : g.gradeEn}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label style={labelStyle}>{isAr ? 'الفصل الدراسي' : 'Academic Term'}</label>
              <select
                value={form.term}
                onChange={(e) => updateField('term', e.target.value)}
                style={{ ...fieldStyle, fontWeight: '600', cursor: 'pointer' }}
              >
                {TERM_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {isAr ? t.labelAr : t.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick-pick Subject Chips */}
          <div>
            <label style={labelStyle}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={13} color="var(--primary)" />
                {isAr ? 'اختيار سريع للمادة الدراسية' : 'Quick Subject Pick'}
              </span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {COMMON_SUBJECTS.map((sub) => {
                const selected = form.subjectAr === sub.ar;
                return (
                  <button
                    key={sub.ar}
                    type="button"
                    onClick={() => handleQuickSubject(sub)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: selected ? '800' : '600',
                      border: selected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: selected ? 'var(--primary-surface, rgba(21, 136, 199, 0.12))' : 'var(--bg-subtle)',
                      color: selected ? 'var(--primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    {isAr ? sub.ar : sub.en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject & Course Title */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
            <div>
              <label style={labelStyle}>{isAr ? 'اسم المادة الدراسية *' : 'Subject Name *'}</label>
              <input
                type="text"
                required
                value={form.subjectAr}
                onChange={(e) => updateField('subjectAr', e.target.value)}
                placeholder={isAr ? 'مثال: الرياضيات، اللغة العربية...' : 'e.g. Mathematics'}
                style={fieldStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>{isAr ? 'عنوان المقرر *' : 'Course Title *'}</label>
              <input
                type="text"
                required
                value={form.titleAr}
                onChange={(e) => updateField('titleAr', e.target.value)}
                placeholder={isAr ? 'مثال: الرياضيات — الصف الأول الابتدائي' : 'Course title'}
                style={fieldStyle}
              />
            </div>
          </div>

          {/* Tracks */}
          <div>
            <label style={labelStyle}>{isAr ? 'الشعبة / المسار الدراسي' : 'Applicable Tracks'}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {TRACK_OPTIONS.map((track) => {
                const active = form.tracks.includes(track);
                return (
                  <button
                    key={track}
                    type="button"
                    onClick={() => toggleTrack(track)}
                    style={{
                      padding: '6px 13px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: '700',
                      border: active ? '1.5px solid #059669' : '1px solid var(--border-subtle)',
                      backgroundColor: active ? 'rgba(5, 150, 105, 0.1)' : 'var(--bg-subtle)',
                      color: active ? '#059669' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    {track}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>{isAr ? 'نبذة ووصف المقرر (اختياري)' : 'Course Description (optional)'}</label>
            <textarea
              rows={2}
              value={form.descriptionAr}
              onChange={(e) => updateField('descriptionAr', e.target.value)}
              placeholder={isAr ? 'مقدمة مختصرة عن محتوى المقرر وأهدافه للطلاب...' : 'Short overview for students...'}
              style={{ ...fieldStyle, resize: 'vertical' }}
            />
          </div>

          {/* Textbook URL + Publish Toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>{isAr ? 'رابط كتاب الوزارة الرسمي (اختياري)' : 'Official Textbook URL'}</label>
              <div style={{ position: 'relative' }}>
                <Globe size={15} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '11px', color: 'var(--text-muted)' }} />
                <input
                  type="url"
                  dir="ltr"
                  value={form.textbookUrl}
                  onChange={(e) => updateField('textbookUrl', e.target.value)}
                  placeholder="https://elearning1.moe.gov.eg/"
                  style={{ ...fieldStyle, paddingInlineStart: '34px' }}
                />
              </div>
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '11px',
                border: form.isPublished ? '1.5px solid rgba(22, 163, 74, 0.4)' : '1.5px solid var(--border-subtle)',
                backgroundColor: form.isPublished ? 'rgba(22, 163, 74, 0.08)' : 'var(--bg-subtle)',
                cursor: 'pointer',
                fontSize: '12.5px',
                fontWeight: '800',
                color: form.isPublished ? '#15803D' : 'var(--text-secondary)',
              }}
            >
              <span>{form.isPublished ? (isAr ? 'منشور للطلاب' : 'Published Live') : (isAr ? 'حفظ كمسودة' : 'Save as Draft')}</span>
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => updateField('isPublished', e.target.checked)}
                style={{ width: '17px', height: '17px', accentColor: '#16A34A', cursor: 'pointer' }}
              />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
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

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {!isEdit && (
              <button
                type="button"
                disabled={saving}
                onClick={() => submitWithMode(false)}
                style={{
                  padding: '9px 15px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: saving ? 'wait' : 'pointer',
                }}
              >
                {isAr ? 'إنشاء فقط' : 'Create Only'}
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '10px 20px',
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
              {isEdit ? <Save size={15} /> : null}
              <span>
                {saving
                  ? isAr ? 'جاري الحفظ...' : 'Saving...'
                  : isEdit
                    ? isAr ? 'حفظ تعديلات المقرر' : 'Save Course Info'
                    : isAr ? 'إنشاء والبدء في إضافة الحصص' : 'Create & Add Lessons'}
              </span>
              {!isEdit && !saving ? <ArrowIcon size={15} /> : null}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
