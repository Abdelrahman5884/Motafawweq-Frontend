import React, { useState, useEffect } from 'react';
import { BookOpen, Edit3, X, Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import { STAGE_OPTIONS, COURSE_STATUS_META, getStageOption } from './courseConstants';

const INPUT_STYLE = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: '8px',
  border: '1px solid var(--border-subtle)',
  backgroundColor: 'var(--bg-subtle)',
  color: 'var(--text-primary)',
  fontSize: '13px',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

const LABEL_STYLE = {
  fontSize: '12.5px',
  fontWeight: '700',
  color: 'var(--text-secondary)',
  display: 'block',
  marginBottom: '6px',
};

export const CourseFormModal = ({
  mode, // 'create' | 'edit'
  initialCourse = null,
  defaultSubject = '',
  isAr,
  isSubmitting = false,
  error = '',
  isQuotaError = false,
  onClose,
  onSubmit,
  onOpenBilling,
}) => {
  const isEdit = mode === 'edit' && Boolean(initialCourse);

  const [form, setForm] = useState(() => {
    if (isEdit) {
      const stageId = initialCourse.stageId || 'sec';
      const stageOpt = getStageOption(stageId);
      const validGrade = stageOpt.grades.includes(initialCourse.gradeAr)
        ? initialCourse.gradeAr
        : stageOpt.defaultGrade;
      return {
        title: initialCourse.titleAr || '',
        stage: stageId,
        grade: validGrade,
        subject: initialCourse.subjectAr || defaultSubject || '',
        price: String(initialCourse.priceEgp ?? 0),
        status: initialCourse.status || 'published',
        hours: initialCourse.hoursTotal || '0 ساعة',
        lessonsCount: String(initialCourse.lessonsCount ?? 0),
        description: initialCourse.descriptionAr || '',
      };
    }

    return {
      title: '',
      stage: 'sec',
      grade: 'الصف الثالث الثانوي',
      subject: defaultSubject || '',
      price: '0',
      status: 'published',
      hours: '0 ساعة',
      lessonsCount: '0',
      description: '',
    };
  });

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSubmitting, onClose]);

  const stageOption = getStageOption(form.stage);
  const isFree = Number(form.price) === 0;
  const hasActualLessons = isEdit && Number(initialCourse?.actualLessonsCount || 0) > 0;

  const handleStageChange = (nextStage) => {
    const nextOpt = getStageOption(nextStage);
    setForm((prev) => ({
      ...prev,
      stage: nextStage,
      grade: nextOpt.defaultGrade,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = form.title.trim();
    if (trimmedTitle.length < 3 || isSubmitting) return;

    const parsedPrice = form.price === '' ? 0 : Math.max(0, Number(form.price) || 0);
    const payload = {
      title_ar: trimmedTitle,
      stage_id: form.stage,
      grade_ar: form.grade,
      subject_ar: form.subject.trim() || defaultSubject || undefined,
      price_egp: parsedPrice,
      status: form.status,
      description_ar: form.description.trim(),
    };

    if (isEdit) {
      if (form.hours.trim()) payload.hours_total = form.hours.trim();
      if (!hasActualLessons && form.lessonsCount !== '') {
        payload.lessons_count = Math.max(0, Number(form.lessonsCount) || 0);
      }
    }

    onSubmit(payload);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isEdit ? <Edit3 size={18} color="var(--primary)" /> : <BookOpen size={18} color="var(--primary)" />}
            <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {isEdit
                ? (isAr ? 'تعديل بيانات الكورس' : 'Edit Course Details')
                : (isAr ? 'إنشاء كورس أو مقرر جديد' : 'Create New Course')}
            </h3>
          </div>
          <button
            type="button"
            aria-label={isAr ? 'إغلاق' : 'Close'}
            disabled={isSubmitting}
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Inline Error Banner (including Plan Quota Exceeded upgrade CTA) */}
        {error && (
          <div
            role="alert"
            style={{
              padding: '12px 14px',
              marginBottom: '14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.28)',
              color: '#EF4444',
              fontSize: '12.5px',
              fontWeight: '700',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
            {isQuotaError && onOpenBilling && (
              <div>
                <button
                  type="button"
                  onClick={onOpenBilling}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '7px',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                  }}
                >
                  <Sparkles size={13} />
                  <span>{isAr ? 'ترقية باقة المعلم الآن' : 'Upgrade Teacher Plan'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Title */}
          <div>
            <label style={LABEL_STYLE}>
              {isAr ? 'عنوان المقرر أو الكورس:' : 'Course Title:'}
            </label>
            <input
              type="text"
              required
              minLength={3}
              maxLength={200}
              placeholder={isAr ? 'مثال: ماستر كلاس الفصل الأول — المراجعة الشاملة' : 'e.g. Complete Secondary Curriculum'}
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              style={INPUT_STYLE}
            />
          </div>

          {/* Stage & Grade */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={LABEL_STYLE}>
                {isAr ? 'المرحلة الدراسية:' : 'Stage:'}
              </label>
              <select
                value={form.stage}
                onChange={(e) => handleStageChange(e.target.value)}
                style={INPUT_STYLE}
              >
                {STAGE_OPTIONS.map((st) => (
                  <option key={st.id} value={st.id}>
                    {isAr ? st.labelAr : st.labelEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={LABEL_STYLE}>
                {isAr ? 'الصف الدراسي:' : 'Grade:'}
              </label>
              <select
                value={form.grade}
                onChange={(e) => setForm((prev) => ({ ...prev, grade: e.target.value }))}
                style={INPUT_STYLE}
              >
                {stageOption.grades.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={LABEL_STYLE}>
                {isAr ? 'المادة الدراسية:' : 'Subject:'}
              </label>
              <input
                type="text"
                maxLength={120}
                placeholder={isAr ? 'مثال: الفيزياء، الأحياء، الرياضيات' : 'e.g. Physics, Biology, Math'}
                value={form.subject}
                onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                style={INPUT_STYLE}
              />
            </div>

            <div>
              <label style={LABEL_STYLE}>
                {isAr ? 'حالة النشر:' : 'Status:'}
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                style={INPUT_STYLE}
              >
                {Object.values(COURSE_STATUS_META).map((st) => (
                  <option key={st.id} value={st.id}>
                    {isAr ? st.labelAr : st.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ ...LABEL_STYLE, marginBottom: 0 }}>
                {isAr ? 'سعر الاشتراك الشهري (ج.م):' : 'Monthly Price (EGP):'}
              </label>
              <label style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '700',
                color: isFree ? 'var(--success)' : 'var(--text-secondary)',
                cursor: 'pointer',
                userSelect: 'none',
              }}>
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.checked ? '0' : '350' }))}
                  style={{ accentColor: 'var(--success)', cursor: 'pointer', width: '15px', height: '15px' }}
                />
                {isAr ? 'كورس مجاني (0 ج.م)' : 'Free Course (0 EGP)'}
              </label>
            </div>
            <input
              type="number"
              min="0"
              max="50000"
              step="1"
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              placeholder={isAr ? 'أدخل 0 لكورس مجاني' : '0 for free'}
              style={{
                ...INPUT_STYLE,
                border: `1px solid ${isFree ? 'var(--success)' : 'var(--border-subtle)'}`,
              }}
            />
            {isFree && (
              <span style={{ fontSize: '11.5px', color: 'var(--success)', fontWeight: '700', marginTop: '5px', display: 'inline-block' }}>
                {isAr ? '✓ هذا الكورس مجاني ومتاح للطلاب دون رسوم إضافية' : '✓ This course is free for students'}
              </span>
            )}
          </div>

          {/* Edit-only Duration & Lessons fields */}
          {isEdit && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={LABEL_STYLE}>
                  {isAr ? 'عدد الحصص:' : 'Lessons Count:'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  disabled={hasActualLessons}
                  value={form.lessonsCount}
                  onChange={(e) => setForm((prev) => ({ ...prev, lessonsCount: e.target.value }))}
                  style={{
                    ...INPUT_STYLE,
                    opacity: hasActualLessons ? 0.65 : 1,
                    cursor: hasActualLessons ? 'not-allowed' : 'text',
                  }}
                />
                {hasActualLessons && (
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block', marginTop: '3px' }}>
                    {isAr ? 'محسوب تلقائياً من الحصص المرفوعة' : 'Auto-synced from uploaded lessons'}
                  </span>
                )}
              </div>

              <div>
                <label style={LABEL_STYLE}>
                  {isAr ? 'إجمالي ساعات الشرح:' : 'Total Hours:'}
                </label>
                <input
                  type="text"
                  maxLength={60}
                  placeholder={isAr ? 'مثال: 24 ساعة' : 'e.g. 24 hrs'}
                  value={form.hours}
                  onChange={(e) => setForm((prev) => ({ ...prev, hours: e.target.value }))}
                  style={INPUT_STYLE}
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label style={LABEL_STYLE}>
              {isAr ? 'وصف المقرر ومخرجات التعلم:' : 'Description:'}
            </label>
            <textarea
              rows={3}
              maxLength={3000}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder={isAr ? 'اكتب نبذة واضحة عن الوحدات ومحتوى الكورس...' : 'Brief summary of the course curriculum...'}
              style={{ ...INPUT_STYLE, resize: 'vertical' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || form.title.trim().length < 3}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isSubmitting || form.title.trim().length < 3 ? 'var(--border-subtle)' : 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                cursor: isSubmitting || form.title.trim().length < 3 ? 'not-allowed' : 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {isSubmitting && <Loader2 size={14} className="spin" />}
              <span>
                {isSubmitting
                  ? (isAr ? 'جاري الحفظ...' : 'Saving...')
                  : isEdit
                    ? (isAr ? 'حفظ التعديلات' : 'Save Changes')
                    : (isAr ? 'حفظ ونشر المقرر' : 'Save & Publish')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
