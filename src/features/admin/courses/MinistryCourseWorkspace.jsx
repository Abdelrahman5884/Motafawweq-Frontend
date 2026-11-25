import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  Play,
  Video,
  FileText,
  Layers,
  BookOpen,
  ExternalLink,
  Clock,
  Globe,
  EyeOff,
  ArrowUp,
  ArrowDown,
  FolderPlus,
  Check,
  X,
  Paperclip,
  Landmark,
} from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import { getTermLabel } from './ministryGrades';
import { MinistryLessonEditorModal } from './MinistryLessonEditorModal';

/**
 * Step 2 Workspace: Full dedicated LMS view inside a single Ministry Course
 * where the Admin manages Units/Chapters and adds/edits/reorders/plays Lessons (الحصص).
 */
export const MinistryCourseWorkspace = ({
  course,
  lang = 'ar',
  isRtl = true,
  onBack,
  onCourseUpdated,
  onEditCourseInfo,
  showToast,
}) => {
  const isAr = lang === 'ar';
  const units = Array.isArray(course?.units) ? course.units : [];

  const [selectedUnitIdx, setSelectedUnitIdx] = useState(0);
  const [activeLessonPlayer, setActiveLessonPlayer] = useState(null);

  // Unit inline add / edit state
  const [addingUnit, setAddingUnit] = useState(false);
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [newUnitSummary, setNewUnitSummary] = useState('');
  const [editingUnitIdx, setEditingUnitIdx] = useState(null);
  const [editUnitTitle, setEditUnitTitle] = useState('');
  const [editUnitSummary, setEditUnitSummary] = useState('');
  const [unitBusy, setUnitBusy] = useState(false);

  // Lesson modal state
  const [lessonModal, setLessonModal] = useState({ open: false, lesson: null, unitIndex: 0 });
  const [savingLesson, setSavingLesson] = useState(false);
  const [busyActionId, setBusyActionId] = useState('');

  const safeUnitIdx = units.length > 0 ? Math.min(selectedUnitIdx, units.length - 1) : 0;
  const activeUnit = units[safeUnitIdx] || null;
  const activeLessons = Array.isArray(activeUnit?.lessons) ? activeUnit.lessons : [];

  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  // ── Unit Actions ───────────────────────────────────────────────────────────
  const handleCreateUnit = async (e) => {
    e.preventDefault();
    if (!newUnitTitle.trim()) return;
    setUnitBusy(true);
    try {
      const res = await adminApi.ministryCurricula.addUnit(course.id, {
        titleAr: newUnitTitle.trim(),
        summaryAr: newUnitSummary.trim(),
      });
      if (res?.data) {
        onCourseUpdated?.(res.data);
        setSelectedUnitIdx(Math.max(0, (res.data.units?.length || 1) - 1));
      }
      setNewUnitTitle('');
      setNewUnitSummary('');
      setAddingUnit(false);
      showToast?.(isAr ? 'تمت إضافة الوحدة الدراسية بنجاح' : 'Unit added');
    } catch (err) {
      showToast?.(err?.message || (isAr ? 'تعذر إضافة الوحدة' : 'Failed to add unit'), 'error');
    } finally {
      setUnitBusy(false);
    }
  };

  const startEditUnit = (idx, unit) => {
    setEditingUnitIdx(idx);
    setEditUnitTitle(unit.titleAr || '');
    setEditUnitSummary(unit.summaryAr || '');
  };

  const handleSaveUnitEdit = async (idx) => {
    if (!editUnitTitle.trim()) return;
    setUnitBusy(true);
    try {
      const res = await adminApi.ministryCurricula.updateUnit(course.id, idx, {
        titleAr: editUnitTitle.trim(),
        summaryAr: editUnitSummary.trim(),
      });
      if (res?.data) onCourseUpdated?.(res.data);
      setEditingUnitIdx(null);
      showToast?.(isAr ? 'تم تحديث بيانات الوحدة' : 'Unit updated');
    } catch (err) {
      showToast?.(err?.message || (isAr ? 'تعذر تحديث الوحدة' : 'Failed to update unit'), 'error');
    } finally {
      setUnitBusy(false);
    }
  };

  const handleDeleteUnit = async (idx, unit) => {
    const confirmed = window.confirm(
      isAr
        ? `هل تريد حذف «${unit.titleAr}» بجميع الحصص الموجودة بداخلها؟`
        : `Delete unit "${unit.titleAr}" and all its lessons?`
    );
    if (!confirmed) return;
    setUnitBusy(true);
    try {
      const res = await adminApi.ministryCurricula.deleteUnit(course.id, idx);
      if (res?.data) onCourseUpdated?.(res.data);
      setSelectedUnitIdx((prev) => Math.max(0, prev - 1));
      showToast?.(isAr ? 'تم حذف الوحدة' : 'Unit removed');
    } catch (err) {
      showToast?.(err?.message || (isAr ? 'تعذر حذف الوحدة' : 'Failed to delete unit'), 'error');
    } finally {
      setUnitBusy(false);
    }
  };

  // ── Lesson Actions ─────────────────────────────────────────────────────────
  const handleSaveLesson = async (payload, targetUnitIdx) => {
    setSavingLesson(true);
    try {
      let res;
      if (lessonModal.lesson?.id) {
        res = await adminApi.ministryCurricula.updateLesson(
          course.id,
          lessonModal.unitIndex,
          lessonModal.lesson.id,
          payload
        );
        showToast?.(isAr ? 'تم حفظ تعديلات الحصة بنجاح' : 'Lesson updated');
      } else {
        res = await adminApi.ministryCurricula.addLesson(course.id, payload);
        showToast?.(isAr ? 'تمت إضافة الحصة إلى المقرر بنجاح' : 'Lesson added');
        setSelectedUnitIdx(targetUnitIdx ?? 0);
      }
      if (res?.data) onCourseUpdated?.(res.data);
      setLessonModal({ open: false, lesson: null, unitIndex: 0 });
    } finally {
      setSavingLesson(false);
    }
  };

  const handleDeleteLesson = async (lesson) => {
    const confirmed = window.confirm(
      isAr ? `حذف الحصة «${lesson.titleAr}»؟` : `Delete lesson "${lesson.titleAr}"?`
    );
    if (!confirmed) return;
    setBusyActionId(lesson.id);
    try {
      const res = await adminApi.ministryCurricula.deleteLesson(course.id, safeUnitIdx, lesson.id);
      if (res?.data) onCourseUpdated?.(res.data);
      if (activeLessonPlayer?.id === lesson.id) setActiveLessonPlayer(null);
      showToast?.(isAr ? 'تم حذف الحصة' : 'Lesson deleted');
    } catch (err) {
      showToast?.(err?.message || (isAr ? 'تعذر حذف الحصة' : 'Failed to delete lesson'), 'error');
    } finally {
      setBusyActionId('');
    }
  };

  const handleMoveLesson = async (lIdx, delta) => {
    const target = lIdx + delta;
    if (target < 0 || target >= activeLessons.length) return;
    const ids = activeLessons.map((l) => l.id);
    [ids[lIdx], ids[target]] = [ids[target], ids[lIdx]];
    setBusyActionId(activeLessons[lIdx].id);
    try {
      const res = await adminApi.ministryCurricula.reorderLessons(course.id, safeUnitIdx, ids);
      if (res?.data) onCourseUpdated?.(res.data);
    } catch (err) {
      showToast?.(err?.message || (isAr ? 'تعذر إعادة ترتيب الحصص' : 'Failed to reorder'), 'error');
    } finally {
      setBusyActionId('');
    }
  };

  const handleTogglePublish = async () => {
    setBusyActionId('publish');
    try {
      const res = await adminApi.ministryCurricula.togglePublish(course.id);
      if (res?.data) onCourseUpdated?.(res.data);
      showToast?.(
        res?.data?.isPublished
          ? isAr ? 'تم نشر المقرر للطلاب بنجاح' : 'Course published'
          : isAr ? 'تم تحويل المقرر إلى مسودة' : 'Course moved to draft'
      );
    } catch (err) {
      showToast?.(err?.message || (isAr ? 'تعذر تغيير حالة النشر' : 'Failed to toggle publish'), 'error');
    } finally {
      setBusyActionId('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Course Hero Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #06254E 0%, #0C3B75 58%, #1588C7 100%)',
          borderRadius: '22px',
          padding: '22px 26px',
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        {/* Top Row: Back button + Status & Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '11px',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <BackIcon size={15} />
            <span>{isAr ? 'العودة إلى قائمة المقررات' : 'Back to Courses'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onEditCourseInfo?.(course)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.24)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              <Edit3 size={14} />
              <span>{isAr ? 'تعديل بيانات المقرر' : 'Edit Course Info'}</span>
            </button>

            <button
              type="button"
              disabled={busyActionId === 'publish'}
              onClick={handleTogglePublish}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.24)',
                backgroundColor: course.isPublished ? 'rgba(22, 163, 74, 0.28)' : 'rgba(245, 158, 11, 0.3)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              {course.isPublished ? <Globe size={14} /> : <EyeOff size={14} />}
              <span>{course.isPublished ? (isAr ? 'منشور للطلاب' : 'Published') : (isAr ? 'مسودة — اضغط للنشر' : 'Draft — Publish')}</span>
            </button>

            <button
              type="button"
              onClick={() => setLessonModal({ open: true, lesson: null, unitIndex: safeUnitIdx })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '9px 18px',
                borderRadius: '11px',
                border: 'none',
                backgroundColor: '#FFFFFF',
                color: '#06254E',
                fontSize: '13px',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.18)',
              }}
            >
              <Plus size={16} />
              <span>{isAr ? 'إضافة حصة جديدة' : 'Add New Lesson'}</span>
            </button>
          </div>
        </div>

        {/* Middle Row: Title + Metadata Badges */}
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 11px', borderRadius: '999px', backgroundColor: 'rgba(255, 255, 255, 0.16)', fontSize: '12px', fontWeight: '800' }}>
              <Landmark size={13} />
              {course.gradeAr}
            </span>
            <span style={{ padding: '4px 11px', borderRadius: '999px', backgroundColor: 'rgba(92, 182, 219, 0.25)', fontSize: '12px', fontWeight: '800' }}>
              {course.subjectAr}
            </span>
            <span style={{ padding: '4px 11px', borderRadius: '999px', backgroundColor: 'rgba(255, 255, 255, 0.12)', fontSize: '12px', fontWeight: '700' }}>
              {getTermLabel(course.term, lang)}
            </span>
            {course.textbookUrl && (
              <a
                href={course.textbookUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 11px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.14)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: '700',
                  textDecoration: 'none',
                }}
              >
                <BookOpen size={12} />
                <span>{isAr ? 'كتاب الوزارة' : 'Textbook'}</span>
                <ExternalLink size={11} />
              </a>
            )}
          </div>

          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', lineHeight: 1.35 }}>
            {isAr ? course.titleAr : course.titleEn || course.titleAr}
          </h2>
          {course.descriptionAr && (
            <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'rgba(255, 255, 255, 0.82)', maxWidth: '780px', lineHeight: 1.6 }}>
              {course.descriptionAr}
            </p>
          )}
        </div>

        {/* Bottom Stats Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.14)',
            fontSize: '12.5px',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '800' }}>
            <Layers size={15} color="#5CB6DB" />
            {units.length} {isAr ? 'وحدات دراسية' : 'Units'}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '800' }}>
            <BookOpen size={15} color="#5CB6DB" />
            {course.lessonsCount ?? 0} {isAr ? 'حصة مضافة' : 'Lessons'}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '800' }}>
            <Video size={15} color="#FCA5A5" />
            {course.videosCount ?? 0} {isAr ? 'فيديو يوتيوب' : 'YouTube Videos'}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '800' }}>
            <Paperclip size={15} color="#86EFAC" />
            {course.resourcesCount ?? 0} {isAr ? 'ملفات ومرفقات' : 'Attachments'}
          </span>
        </div>
      </div>

      {/* Inline Active Lesson Theater Player */}
      {activeLessonPlayer && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px solid var(--primary)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: '#06254E',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '14px' }}>
              <Play size={16} color="#5CB6DB" />
              <span>{activeLessonPlayer.titleAr}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveLessonPlayer(null)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.14)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              <X size={14} />
              <span>{isAr ? 'إغلاق المعاينة' : 'Close Preview'}</span>
            </button>
          </div>

          {activeLessonPlayer.embedUrl && (
            <div style={{ position: 'relative', paddingTop: '48%', backgroundColor: '#000' }}>
              <iframe
                src={activeLessonPlayer.embedUrl}
                title={activeLessonPlayer.titleAr}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
          )}

          {(activeLessonPlayer.contentAr || (activeLessonPlayer.attachments || []).length > 0) && (
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeLessonPlayer.contentAr && (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
                    {isAr ? 'شرح وملخص الحصة:' : 'Lesson Content:'}
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                    {activeLessonPlayer.contentAr}
                  </div>
                </div>
              )}

              {Array.isArray(activeLessonPlayer.attachments) && activeLessonPlayer.attachments.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {activeLessonPlayer.attachments.map((att, i) => (
                    <a
                      key={att.id || i}
                      href={att.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 12px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--primary-surface)',
                        border: '1px solid rgba(21, 136, 199, 0.25)',
                        color: 'var(--primary)',
                        fontSize: '12px',
                        fontWeight: '800',
                        textDecoration: 'none',
                      }}
                    >
                      <Paperclip size={13} />
                      <span>{att.titleAr}</span>
                      {att.url && <ExternalLink size={12} />}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Two-Column LMS Body: Units Sidebar + Lessons List */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(250px, 295px) minmax(0, 1fr)',
          gap: '18px',
          alignItems: 'start',
        }}
        className="admin-course-workspace-grid"
      >
        <style>{`
          @media (max-width: 860px) {
            .admin-course-workspace-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        {/* Left/Right Column: Units / Chapters Sidebar */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '18px',
            padding: '16px',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
              <Layers size={16} color="var(--primary)" />
              {isAr ? 'وحدات المقرر' : 'Course Units'}
            </span>

            <button
              type="button"
              onClick={() => setAddingUnit((v) => !v)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                borderRadius: '8px',
                border: '1px solid var(--primary)',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)',
                fontSize: '11.5px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              <FolderPlus size={13} />
              <span>{isAr ? 'وحدة جديدة' : 'New Unit'}</span>
            </button>
          </div>

          {addingUnit && (
            <form
              onSubmit={handleCreateUnit}
              style={{
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <input
                type="text"
                required
                value={newUnitTitle}
                onChange={(e) => setNewUnitTitle(e.target.value)}
                placeholder={isAr ? 'عنوان الوحدة (مثال: الوحدة الأولى)' : 'Unit title'}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '9px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  boxSizing: 'border-box',
                }}
              />
              <textarea
                rows={2}
                value={newUnitSummary}
                onChange={(e) => setNewUnitSummary(e.target.value)}
                placeholder={isAr ? 'ملخص قصير للوحدة (اختياري)...' : 'Short unit summary (optional)...'}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '9px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setAddingUnit(false)}
                  style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer' }}
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={unitBusy}
                  style={{ padding: '5px 12px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: '#FFFFFF', fontSize: '11.5px', fontWeight: '800', cursor: 'pointer' }}
                >
                  {unitBusy ? '...' : isAr ? 'حفظ الوحدة' : 'Add'}
                </button>
              </div>
            </form>
          )}

          {units.length === 0 ? (
            <div style={{ padding: '20px 12px', textAlign: 'center', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {isAr
                ? 'لا توجد وحدات بعد. يمكنك إضافة وحدة أو الضغط مباشرة على «إضافة حصة جديدة».'
                : 'No units yet. Add a unit or click "Add New Lesson" directly.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {units.map((u, idx) => {
                const isSelected = idx === safeUnitIdx;
                const uLessonsCount = Array.isArray(u.lessons) ? u.lessons.length : 0;

                if (editingUnitIdx === idx) {
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '10px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--primary)',
                        backgroundColor: 'var(--bg-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '7px',
                      }}
                    >
                      <input
                        type="text"
                        value={editUnitTitle}
                        onChange={(e) => setEditUnitTitle(e.target.value)}
                        style={{ width: '100%', padding: '7px 9px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '12.5px', boxSizing: 'border-box' }}
                      />
                      <textarea
                        rows={2}
                        value={editUnitSummary}
                        onChange={(e) => setEditUnitSummary(e.target.value)}
                        placeholder={isAr ? 'ملخص الوحدة...' : 'Unit summary...'}
                        style={{ width: '100%', padding: '7px 9px', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '12px', fontFamily: 'inherit', boxSizing: 'border-box' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button type="button" onClick={() => setEditingUnitIdx(null)} style={{ padding: '4px 8px', borderRadius: '7px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', cursor: 'pointer' }}>
                          <X size={13} />
                        </button>
                        <button type="button" disabled={unitBusy} onClick={() => handleSaveUnitEdit(idx)} style={{ padding: '4px 10px', borderRadius: '7px', border: 'none', background: '#16A34A', color: '#FFF', cursor: 'pointer' }}>
                          <Check size={13} />
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 11px',
                      borderRadius: '12px',
                      border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedUnitIdx(idx)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        border: 'none',
                        background: 'none',
                        padding: 0,
                        textAlign: 'inherit',
                        cursor: 'pointer',
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '7px',
                          backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-surface)',
                          color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                          fontSize: '11.5px',
                          fontWeight: '900',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {idx + 1}
                      </span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {u.titleAr}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {uLessonsCount} {isAr ? 'حصة' : 'lessons'}
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => startEditUnit(idx, u)}
                      title={isAr ? 'تعديل الوحدة' : 'Edit unit'}
                      style={{ padding: '4px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteUnit(idx, u)}
                      title={isAr ? 'حذف الوحدة' : 'Delete unit'}
                      style={{ padding: '4px', border: 'none', background: 'transparent', color: '#DC2626', cursor: 'pointer' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Column: Lessons of Active Unit */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '18px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {activeUnit ? (
            <>
              {/* Active Unit Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  paddingBottom: '14px',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--primary)', marginBottom: '3px' }}>
                    {isAr ? `الوحدة ${safeUnitIdx + 1} من ${units.length}` : `Unit ${safeUnitIdx + 1} of ${units.length}`}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
                    {activeUnit.titleAr}
                  </h3>
                  {activeUnit.summaryAr && (
                    <p style={{ margin: '6px 0 0', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {activeUnit.summaryAr}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setLessonModal({ open: true, lesson: null, unitIndex: safeUnitIdx })}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '11px',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-primary)',
                  }}
                >
                  <Plus size={15} />
                  <span>{isAr ? 'إضافة حصة لهذه الوحدة' : 'Add Lesson to Unit'}</span>
                </button>
              </div>

              {/* Lessons List */}
              {activeLessons.length === 0 ? (
                <div
                  style={{
                    padding: '42px 20px',
                    borderRadius: '16px',
                    border: '1.5px dashed var(--border-medium)',
                    backgroundColor: 'var(--bg-subtle)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      backgroundColor: 'var(--primary-surface)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Video size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {isAr ? 'لا توجد حصص مضافة في هذه الوحدة بعد' : 'No lessons in this unit yet'}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {isAr
                        ? 'ابدأ بإضافة أول حصة (فيديو شرح من يوتيوب، محتوى نصي، أو مذكرات PDF).'
                        : 'Add your first YouTube video lesson or study content.'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLessonModal({ open: true, lesson: null, unitIndex: safeUnitIdx })}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 18px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={15} />
                    <span>{isAr ? 'إضافة أول حصة الآن' : 'Add First Lesson'}</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeLessons.map((lesson, lIdx) => {
                    const hasVideo = Boolean(lesson.youtubeId || lesson.embedUrl);
                    const attCount = Array.isArray(lesson.attachments) ? lesson.attachments.length : 0;
                    const isPlaying = activeLessonPlayer?.id === lesson.id;
                    const isBusy = busyActionId === lesson.id;

                    return (
                      <div
                        key={lesson.id || lIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          flexWrap: 'wrap',
                          padding: '14px 16px',
                          borderRadius: '15px',
                          border: isPlaying ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                          backgroundColor: isPlaying ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                          opacity: isBusy ? 0.6 : 1,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {/* Lesson Order + Thumbnail */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '8px',
                              backgroundColor: '#06254E',
                              color: '#FFFFFF',
                              fontSize: '12px',
                              fontWeight: '900',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {lIdx + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() => setActiveLessonPlayer(isPlaying ? null : lesson)}
                            style={{
                              position: 'relative',
                              width: '104px',
                              height: '60px',
                              borderRadius: '10px',
                              overflow: 'hidden',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: hasVideo ? '#0F172A' : 'var(--bg-surface)',
                              cursor: 'pointer',
                              padding: 0,
                              flexShrink: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {hasVideo && lesson.thumbnailUrl ? (
                              <>
                                <img
                                  src={lesson.thumbnailUrl}
                                  alt={lesson.titleAr}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <span
                                  style={{
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundColor: 'rgba(6, 37, 78, 0.38)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#FFFFFF',
                                  }}
                                >
                                  <Play size={18} fill="#FFFFFF" />
                                </span>
                              </>
                            ) : (
                              <FileText size={22} color="var(--primary)" />
                            )}
                          </button>
                        </div>

                        {/* Lesson Info */}
                        <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                              {lesson.titleAr}
                            </h4>
                            {hasVideo && (
                              <span style={{ padding: '2px 8px', borderRadius: '999px', backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', fontSize: '11px', fontWeight: '800' }}>
                                YouTube
                              </span>
                            )}
                            {lesson.durationMinutes ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                                <Clock size={12} />
                                {lesson.durationMinutes} {isAr ? 'دقيقة' : 'min'}
                              </span>
                            ) : null}
                            {attCount > 0 && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11.5px', color: 'var(--primary)', fontWeight: '700' }}>
                                <Paperclip size={12} />
                                {attCount} {isAr ? 'مرفق' : 'files'}
                              </span>
                            )}
                          </div>

                          {lesson.contentAr && (
                            <p
                              style={{
                                margin: '5px 0 0',
                                fontSize: '12.5px',
                                color: 'var(--text-secondary)',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.55,
                              }}
                            >
                              {lesson.contentAr}
                            </p>
                          )}
                        </div>

                        {/* Lesson Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginInlineStart: 'auto' }}>
                          <button
                            type="button"
                            onClick={() => setActiveLessonPlayer(isPlaying ? null : lesson)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '7px 12px',
                              borderRadius: '9px',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-surface)',
                              color: 'var(--primary)',
                              fontSize: '12px',
                              fontWeight: '800',
                              cursor: 'pointer',
                            }}
                          >
                            <Play size={13} />
                            <span>{isPlaying ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'تشغيل / عرض' : 'View')}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setLessonModal({ open: true, lesson, unitIndex: safeUnitIdx })}
                            title={isAr ? 'تعديل الحصة' : 'Edit lesson'}
                            style={{
                              padding: '7px 9px',
                              borderRadius: '9px',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-surface)',
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                            }}
                          >
                            <Edit3 size={14} />
                          </button>

                          <button
                            type="button"
                            disabled={lIdx === 0 || isBusy}
                            onClick={() => handleMoveLesson(lIdx, -1)}
                            title={isAr ? 'تحريك لأعلى' : 'Move up'}
                            style={{
                              padding: '7px',
                              borderRadius: '9px',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-surface)',
                              color: 'var(--text-secondary)',
                              cursor: lIdx === 0 ? 'not-allowed' : 'pointer',
                              opacity: lIdx === 0 ? 0.4 : 1,
                            }}
                          >
                            <ArrowUp size={13} />
                          </button>

                          <button
                            type="button"
                            disabled={lIdx === activeLessons.length - 1 || isBusy}
                            onClick={() => handleMoveLesson(lIdx, 1)}
                            title={isAr ? 'تحريك لأسفل' : 'Move down'}
                            style={{
                              padding: '7px',
                              borderRadius: '9px',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-surface)',
                              color: 'var(--text-secondary)',
                              cursor: lIdx === activeLessons.length - 1 ? 'not-allowed' : 'pointer',
                              opacity: lIdx === activeLessons.length - 1 ? 0.4 : 1,
                            }}
                          >
                            <ArrowDown size={13} />
                          </button>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleDeleteLesson(lesson)}
                            title={isAr ? 'حذف الحصة' : 'Delete lesson'}
                            style={{
                              padding: '7px 9px',
                              borderRadius: '9px',
                              border: '1px solid rgba(220, 38, 38, 0.25)',
                              backgroundColor: 'rgba(220, 38, 38, 0.06)',
                              color: '#DC2626',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            /* Empty Course State (0 Units yet) */
            <div
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOpen size={26} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {isAr ? 'المقرر جاهز لإضافة الحصص والمحتوى!' : 'Course is ready for lessons!'}
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '460px', lineHeight: 1.65 }}>
                {isAr
                  ? 'اضغط «إضافة حصة جديدة» للبدء فوراً بإضافة فيديوهات الشرح من يوتيوب والملخصات النصية والمرفقات.'
                  : 'Click "Add New Lesson" to start publishing YouTube videos, written notes, and attachments.'}
              </p>
              <button
                type="button"
                onClick={() => setLessonModal({ open: true, lesson: null, unitIndex: 0 })}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 22px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-primary)',
                }}
              >
                <Plus size={16} />
                <span>{isAr ? 'إضافة أول حصة في المقرر' : 'Add First Lesson'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Lesson Modal */}
      {lessonModal.open && (
        <MinistryLessonEditorModal
          key={lessonModal.lesson?.id || `new-${lessonModal.unitIndex}`}
          units={units}
          defaultUnitIndex={lessonModal.unitIndex}
          lesson={lessonModal.lesson}
          lang={lang}
          isRtl={isRtl}
          saving={savingLesson}
          onClose={() => !savingLesson && setLessonModal({ open: false, lesson: null, unitIndex: 0 })}
          onSave={handleSaveLesson}
        />
      )}
    </div>
  );
};
