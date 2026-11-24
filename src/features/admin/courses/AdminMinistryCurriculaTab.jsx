import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Plus,
  Search,
  RefreshCw,
  Landmark,
  Video,
  Layers,
  BookOpen,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle,
  Globe,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import {
  MINISTRY_GRADES,
  STAGE_GROUPS,
  TERM_OPTIONS,
  getStageBadgeStyle,
  getTermLabel,
} from './ministryGrades';
import { MinistryCurriculumEditorModal } from './MinistryCurriculumEditorModal';
import { MinistryCourseWorkspace } from './MinistryCourseWorkspace';

export const AdminMinistryCurriculaTab = ({ lang = 'ar', isRtl = true, showToast }) => {
  const isAr = lang === 'ar';

  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalUnits: 0,
    totalLessons: 0,
    totalVideos: 0,
    totalResources: 0,
    coveredGradesCount: 0,
    totalGradesCount: 12,
    byStage: { 'stage-primary': 0, 'stage-prep': 0, secondary_all: 0 },
    byGrade: {},
  });
  const [meta, setMeta] = useState({ current_page: 1, per_page: 12, total: 0, last_page: 1 });

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [termFilter, setTermFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  // Step 1: Course Info Modal (Create / Edit Course metadata alone)
  const [editorState, setEditorState] = useState({ open: false, curriculum: null });
  const [saving, setSaving] = useState(false);

  // Step 2: Active Course Workspace (Manage Units & Add/Edit Lessons)
  const [activeCourse, setActiveCourse] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleting, setDeleting] = useState(false);

  const listSeqRef = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchCurricula = useCallback(async () => {
    const seq = ++listSeqRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.ministryCurricula.list({
        search: debouncedSearch || undefined,
        stage: stageFilter !== 'all' ? stageFilter : undefined,
        grade: gradeFilter !== 'all' ? gradeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        term: termFilter !== 'all' ? termFilter : undefined,
        page,
        per_page: 12,
      });
      if (seq !== listSeqRef.current) return;
      setItems(Array.isArray(res?.data) ? res.data : []);
      if (res?.meta?.summary) setSummary(res.meta.summary);
      if (res?.meta) {
        setMeta({
          current_page: res.meta.current_page ?? 1,
          per_page: res.meta.per_page ?? 12,
          total: res.meta.total ?? 0,
          last_page: res.meta.last_page ?? 1,
        });
      }
    } catch (err) {
      if (seq !== listSeqRef.current) return;
      setError(err?.message || (isAr ? 'تعذر تحميل مقررات وزارة التربية والتعليم' : 'Failed to load Ministry courses'));
    } finally {
      if (seq === listSeqRef.current) setLoading(false);
    }
  }, [debouncedSearch, stageFilter, gradeFilter, statusFilter, termFilter, page, isAr]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) fetchCurricula();
    });
    return () => {
      active = false;
    };
  }, [fetchCurricula]);

  const visibleGrades = useMemo(() => {
    if (stageFilter === 'all') return MINISTRY_GRADES;
    return MINISTRY_GRADES.filter((g) => g.stageGroup === stageFilter);
  }, [stageFilter]);

  const handleStageSelect = (nextStage) => {
    setStageFilter(nextStage);
    setGradeFilter('all');
    setPage(1);
  };

  const handleEnterCourseWorkspace = async (courseItem) => {
    setActiveCourse(courseItem);
    try {
      const res = await adminApi.ministryCurricula.get(courseItem.id);
      if (res?.data) {
        setActiveCourse((prev) => (prev && prev.id === courseItem.id ? res.data : prev));
      }
    } catch {
      // Keep snapshot if network hiccups
    }
  };

  const handleSaveCourseMetadata = async (payload, options = {}) => {
    setSaving(true);
    try {
      const targetId = editorState.curriculum?.uuid || editorState.curriculum?.id;
      if (targetId) {
        const res = await adminApi.ministryCurricula.update(targetId, payload);
        if (res?.data && activeCourse?.id === targetId) {
          setActiveCourse(res.data);
        }
        showToast?.(isAr ? 'تم حفظ تعديلات بيانات المقرر بنجاح' : 'Course info updated');
      } else {
        const res = await adminApi.ministryCurricula.create(payload);
        showToast?.(
          options.openWorkspaceAfter
            ? isAr ? 'تم إنشاء المقرر — يمكنك الآن إضافة الحصص والمحتوى!' : 'Course created — add lessons now!'
            : isAr ? 'تم إنشاء المقرر الوزاري بنجاح' : 'Ministry course created'
        );
        if (options.openWorkspaceAfter && res?.data) {
          setActiveCourse(res.data);
        }
      }
      setEditorState({ open: false, curriculum: null });
      fetchCurricula();
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (item) => {
    setBusyId(item.id);
    try {
      const res = await adminApi.ministryCurricula.togglePublish(item.id);
      const updated = res?.data;
      if (updated) {
        setItems((prev) => prev.map((c) => (c.id === item.id ? updated : c)));
      }
      showToast?.(
        updated?.isPublished
          ? isAr ? 'تم نشر المقرر وإتاحته للطلاب بنجاح' : 'Course published live'
          : isAr ? 'تم تحويل المقرر إلى مسودة' : 'Course moved to draft'
      );
      fetchCurricula();
    } catch (err) {
      showToast?.(err?.message || (isAr ? 'تعذر تحديث حالة النشر' : 'Failed to toggle publish'), 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.ministryCurricula.delete(deleteTarget.id, { reason: deleteReason.trim() || undefined });
      showToast?.(isAr ? 'تم حذف وأرشفة المقرر الوزاري بنجاح' : 'Course deleted');
      setDeleteTarget(null);
      setDeleteReason('');
      fetchCurricula();
    } catch (err) {
      showToast?.(err?.message || (isAr ? 'تعذر حذف المقرر' : 'Failed to delete course'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const EnterArrow = isRtl ? ArrowLeft : ArrowRight;

  // ── Render Dedicated Course Workspace when Admin enters a Course ───────────
  if (activeCourse) {
    return (
      <>
        <MinistryCourseWorkspace
          course={activeCourse}
          lang={lang}
          isRtl={isRtl}
          onBack={() => {
            setActiveCourse(null);
            fetchCurricula();
          }}
          onCourseUpdated={(updated) => {
            setActiveCourse(updated);
            setItems((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
          }}
          onEditCourseInfo={(courseObj) => setEditorState({ open: true, curriculum: courseObj })}
          showToast={showToast}
        />

        {editorState.open && (
          <MinistryCurriculumEditorModal
            key={editorState.curriculum?.id || 'edit-active'}
            curriculum={editorState.curriculum}
            lang={lang}
            isRtl={isRtl}
            saving={saving}
            onClose={() => !saving && setEditorState({ open: false, curriculum: null })}
            onSave={handleSaveCourseMetadata}
          />
        )}
      </>
    );
  }

  // ── Render Courses Catalog View ────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Elevated Brand Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #06254E 0%, #0D3C78 58%, #1588C7 100%)',
          borderRadius: '22px',
          padding: '22px 26px',
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', minWidth: 0 }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '15px',
              backgroundColor: 'rgba(255, 255, 255, 0.14)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Landmark size={24} color="#5CB6DB" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '19px', fontWeight: '900', color: '#FFFFFF' }}>
              {isAr ? 'مقررات ومناهج وزارة التربية والتعليم' : 'Ministry of Education Courses'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255, 255, 255, 0.82)', lineHeight: 1.55 }}>
              {isAr
                ? 'أنشئ المقرر لأي صف (من أولى ابتدائي حتى تالتة ثانوي)، ثم ادخل على المقرر لإضافة الحصص وفيديوهات يوتيوب والمحتوى.'
                : 'Create courses for any grade (1st Primary — 3rd Secondary), then open any course to add YouTube lessons & content.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setEditorState({ open: true, curriculum: null })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '11px 20px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: '#FFFFFF',
            color: '#06254E',
            fontSize: '13.5px',
            fontWeight: '900',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.18)',
            whiteSpace: 'nowrap',
          }}
        >
          <Plus size={17} />
          <span>{isAr ? 'إنشاء مقرر وزاري جديد' : 'Create New Course'}</span>
        </button>
      </div>

      {/* KPI Summary Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '12px' }}>
        {[
          { labelAr: 'إجمالي المقررات', labelEn: 'Total Courses', val: summary.total, icon: Landmark, color: 'var(--primary)', bg: 'var(--primary-surface)' },
          { labelAr: 'منشور للطلاب', labelEn: 'Published Live', val: summary.published, icon: CheckCircle, color: '#16A34A', bg: 'rgba(22, 163, 74, 0.1)' },
          { labelAr: 'إجمالي الوحدات', labelEn: 'Total Units', val: summary.totalUnits, icon: Layers, color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.1)' },
          { labelAr: 'إجمالي الحصص', labelEn: 'Total Lessons', val: summary.totalLessons ?? summary.totalVideos, icon: Video, color: '#DC2626', bg: 'rgba(220, 38, 38, 0.1)' },
          {
            labelAr: 'تغطية الصفوف',
            labelEn: 'Grades Covered',
            val: `${summary.coveredGradesCount || 0} / ${summary.totalGradesCount || 12}`,
            raw: true,
            icon: GraduationCap,
            color: '#D97706',
            bg: 'rgba(245, 158, 11, 0.12)',
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '14px 16px',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '11px',
                  backgroundColor: card.bg,
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={19} />
              </div>
              <div>
                <div style={{ fontSize: '11.5px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  {isAr ? card.labelAr : card.labelEn}
                </div>
                <div style={{ fontSize: '19px', fontWeight: '900', color: 'var(--text-primary)' }}>
                  {card.raw ? card.val : Number(card.val || 0).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unified Filter & Navigation Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '18px',
          padding: '16px 20px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* Stage Segmented Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          {STAGE_GROUPS.map((st) => {
            const active = stageFilter === st.id;
            const count = st.id === 'all' ? summary.total : summary.byStage?.[st.id] ?? 0;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleStageSelect(st.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 14px',
                  borderRadius: '11px',
                  border: active ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: active ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                  color: active ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: active ? '800' : '600',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{isAr ? st.labelAr : st.labelEn}</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '1px 7px',
                    borderRadius: '999px',
                    backgroundColor: active ? 'var(--primary)' : 'var(--bg-surface)',
                    color: active ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 12 Grades Pills Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            alignItems: 'center',
            paddingTop: '10px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setGradeFilter('all');
              setPage(1);
            }}
            style={{
              padding: '5px 12px',
              borderRadius: '999px',
              border: gradeFilter === 'all' ? '1.5px solid #06254E' : '1px solid var(--border-subtle)',
              backgroundColor: gradeFilter === 'all' ? '#06254E' : 'transparent',
              color: gradeFilter === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '11.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'جميع الصفوف' : 'All Grades'}
          </button>

          {visibleGrades.map((g) => {
            const active = gradeFilter === g.gradeAr;
            const gCount = summary.byGrade?.[g.gradeAr] ?? 0;
            return (
              <button
                key={g.gradeAr}
                type="button"
                onClick={() => {
                  setGradeFilter(g.gradeAr);
                  setPage(1);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  border: active ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: active ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: active ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '11.5px',
                  fontWeight: active ? '800' : '600',
                  cursor: 'pointer',
                }}
              >
                <span>{isAr ? g.shortAr : g.gradeEn}</span>
                <span style={{ opacity: active ? 0.9 : 0.7, fontSize: '10.5px' }}>({gCount})</span>
              </button>
            );
          })}
        </div>

        {/* Search + Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '400px' }}>
            <Search size={15} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={isAr ? 'ابحث باسم المقرر، المادة، أو الصف الدراسي...' : 'Search course, subject, or grade...'}
              style={{
                width: '100%',
                padding: '9px 12px',
                paddingInlineStart: '36px',
                borderRadius: '11px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={termFilter}
              onChange={(e) => {
                setTermFilter(e.target.value);
                setPage(1);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              <option value="all">{isAr ? 'كل الفصول الدراسية' : 'All Terms'}</option>
              {TERM_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {isAr ? t.labelAr : t.labelEn}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              <option value="all">{isAr ? 'كل الحالات' : 'All Statuses'}</option>
              <option value="published">{isAr ? 'منشور للطلاب' : 'Published'}</option>
              <option value="draft">{isAr ? 'مسودة' : 'Draft'}</option>
            </select>

            <button
              type="button"
              onClick={fetchCurricula}
              disabled={loading}
              title={isAr ? 'تحديث' : 'Refresh'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '14px',
            padding: '13px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#B91C1C',
            fontSize: '13px',
            fontWeight: '700',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            {error}
          </span>
          <button
            type="button"
            onClick={fetchCurricula}
            style={{ backgroundColor: '#B91C1C', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
          >
            {isAr ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* Courses Cards Grid */}
      {loading ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '18px',
            padding: '48px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          {isAr ? 'جاري تحميل المقررات الوزارية...' : 'Loading Ministry courses...'}
        </div>
      ) : items.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px dashed var(--border-medium)',
            borderRadius: '20px',
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Landmark size={36} color="var(--primary)" />
          <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
            {isAr ? 'لا توجد مقررات مطابقة لهذا الاختيار' : 'No courses match the current filter'}
          </div>
          <button
            type="button"
            onClick={() => setEditorState({ open: true, curriculum: null })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '10px 18px',
              borderRadius: '11px',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-primary)',
            }}
          >
            <Plus size={15} />
            <span>
              {gradeFilter !== 'all'
                ? isAr ? `إنشاء مقرر لـ ${gradeFilter}` : `Create Course for ${gradeFilter}`
                : isAr ? 'إنشاء مقرر وزاري جديد' : 'Create Ministry Course'}
            </span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 315px), 1fr))', gap: '18px' }}>
          {items.map((item) => {
            const stageBadge = getStageBadgeStyle(item.stage);
            const isBusy = busyId === item.id;
            const lessonsCount = item.lessonsCount ?? item.videosCount ?? 0;

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '20px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  opacity: isBusy ? 0.6 : 1,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Top Color Strip */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    insetInline: 0,
                    height: '4px',
                    background: item.isPublished
                      ? 'linear-gradient(90deg, #06254E 0%, #1588C7 100%)'
                      : 'linear-gradient(90deg, #D97706 0%, #F59E0B 100%)',
                  }}
                />

                {/* Badges Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginTop: '2px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <span
                      style={{
                        padding: '3.5px 10px',
                        borderRadius: '8px',
                        backgroundColor: stageBadge.bg,
                        color: stageBadge.color,
                        fontSize: '11px',
                        fontWeight: '800',
                      }}
                    >
                      {item.gradeAr}
                    </span>
                    <span
                      style={{
                        padding: '3.5px 9px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '11px',
                        fontWeight: '800',
                      }}
                    >
                      {item.subjectAr}
                    </span>
                  </div>

                  <span
                    style={{
                      padding: '3.5px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: '800',
                      flexShrink: 0,
                      backgroundColor: item.isPublished ? 'rgba(22, 163, 74, 0.1)' : 'rgba(245, 158, 11, 0.14)',
                      color: item.isPublished ? '#15803D' : '#B45309',
                    }}
                  >
                    {item.isPublished ? (isAr ? 'منشور' : 'Published') : (isAr ? 'مسودة' : 'Draft')}
                  </span>
                </div>

                {/* Course Title */}
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                    {isAr ? item.titleAr : item.titleEn || item.titleAr}
                  </h3>
                  <div style={{ marginTop: '5px', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span>{getTermLabel(item.term, lang)}</span>
                    {Array.isArray(item.tracks) && item.tracks.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{item.tracks.slice(0, 3).join('، ')}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats Strip */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '6px',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    <Layers size={14} color="#7C3AED" />
                    <span>{item.unitsCount ?? 0} {isAr ? 'وحدة' : 'Units'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    <BookOpen size={14} color="var(--primary)" />
                    <span>{lessonsCount} {isAr ? 'حصة' : 'Lessons'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '800', color: item.videosCount > 0 ? '#DC2626' : 'var(--text-secondary)' }}>
                    <Video size={14} color={item.videosCount > 0 ? '#DC2626' : 'var(--text-muted)'} />
                    <span>{item.videosCount ?? 0} {isAr ? 'فيديو' : 'Videos'}</span>
                  </div>
                </div>

                {/* Primary Enter Workspace CTA + Quick Secondary Controls */}
                <div style={{ display: 'flex', gap: '7px', marginTop: 'auto', paddingTop: '6px' }}>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleEnterCourseWorkspace(item)}
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '7px',
                      padding: '10px 14px',
                      borderRadius: '11px',
                      border: 'none',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(21, 136, 199, 0.22)',
                    }}
                  >
                    <span>{isAr ? 'إدارة الحصص والمحتوى' : 'Manage Lessons'}</span>
                    <EnterArrow size={14} />
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => setEditorState({ open: true, curriculum: item })}
                    title={isAr ? 'تعديل بيانات المقرر' : 'Edit Course Info'}
                    style={{
                      padding: '9px 10px',
                      borderRadius: '11px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleTogglePublish(item)}
                    title={item.isPublished ? (isAr ? 'إخفاء / مسودة' : 'Unpublish') : (isAr ? 'نشر للطلاب' : 'Publish')}
                    style={{
                      padding: '9px 10px',
                      borderRadius: '11px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: item.isPublished ? '#D97706' : '#16A34A',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.isPublished ? <EyeOff size={14} /> : <Globe size={14} />}
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => {
                      setDeleteTarget(item);
                      setDeleteReason('');
                    }}
                    title={isAr ? 'حذف المقرر' : 'Delete Course'}
                    style={{
                      padding: '9px 10px',
                      borderRadius: '11px',
                      border: '1px solid rgba(220, 38, 38, 0.2)',
                      backgroundColor: 'rgba(220, 38, 38, 0.05)',
                      color: '#DC2626',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
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

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
          <span>
            {isAr
              ? `صفحة ${meta.current_page} من ${meta.last_page} (${meta.total} مقرر)`
              : `Page ${meta.current_page} of ${meta.last_page} (${meta.total} courses)`}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              disabled={meta.current_page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '7px 13px',
                borderRadius: '9px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: '800',
                cursor: meta.current_page <= 1 ? 'not-allowed' : 'pointer',
                opacity: meta.current_page <= 1 ? 0.5 : 1,
              }}
            >
              {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              <span>{isAr ? 'السابق' : 'Prev'}</span>
            </button>
            <button
              type="button"
              disabled={meta.current_page >= meta.last_page}
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '7px 13px',
                borderRadius: '9px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: '800',
                cursor: meta.current_page >= meta.last_page ? 'not-allowed' : 'pointer',
                opacity: meta.current_page >= meta.last_page ? 0.5 : 1,
              }}
            >
              <span>{isAr ? 'التالي' : 'Next'}</span>
              {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>
        </div>
      )}

      {/* Standalone Course Create / Edit Modal */}
      {editorState.open && (
        <MinistryCurriculumEditorModal
          key={editorState.curriculum?.id || 'create-new'}
          curriculum={editorState.curriculum}
          defaultGrade={gradeFilter !== 'all' ? gradeFilter : ''}
          lang={lang}
          isRtl={isRtl}
          saving={saving}
          onClose={() => !saving && setEditorState({ open: false, curriculum: null })}
          onSave={handleSaveCourseMetadata}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => !deleting && setDeleteTarget(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 37, 78, 0.55)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '440px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              direction: isRtl ? 'rtl' : 'ltr',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {isAr ? 'تأكيد حذف المقرر الوزاري' : 'Confirm Course Deletion'}
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {isAr
                ? `سيتم إخفاء وأرشفة مقرر «${deleteTarget.titleAr}» من بوابة الطلاب مع تسجيل الحدث في سجل الأمان.`
                : `Course "${deleteTarget.titleEn || deleteTarget.titleAr}" will be unpublished and archived.`}
            </p>
            <textarea
              rows={2}
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder={isAr ? 'سبب الحذف (اختياري)...' : 'Reason (optional)...'}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                style={{
                  padding: '9px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: deleting ? 'wait' : 'pointer',
                }}
              >
                {deleting ? (isAr ? 'جاري الحذف...' : 'Deleting...') : (isAr ? 'تأكيد الحذف' : 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
