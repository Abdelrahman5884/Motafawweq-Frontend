import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { teacherApi } from '../../services/teacherApi';
import { MAX_STORAGE_FILE_SIZE_BYTES } from '../../services/storageService';
import {
  FileText,
  Share2,
  Clock,
  BookOpen,
  Calendar,
  X,
  Plus,
  Loader2,
  Headphones,
  Edit3,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  WorkspaceSidebar,
  WorkspaceMediaTab,
  WorkspaceTranscriptTab,
  WorkspaceMindMapTab,
  EditLessonModal,
  DeleteLessonModal,
  mapLesson,
  extractMediaDurationSeconds,
} from '../../features/teacher/workspace';

export const LessonWorkspace = () => {
  const [searchParams] = useSearchParams();
  const requestedLessonId = searchParams.get('lesson') || '';
  const requestedCourseId = searchParams.get('courseId') || '';
  const { navigate } = useAuth();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const [lessonsList, setLessonsList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState('');

  // Sidebar Filters
  const [lessonSearch, setLessonSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState(requestedCourseId || 'all');
  const [mediaFilter, setMediaFilter] = useState('all');

  // Active inner section: 'media' | 'transcript' | 'graph'
  const [activeSection, setActiveSection] = useState('media');

  // Modals: Lightbox, PDF Preview, Edit, Delete
  const [lightboxImage, setLightboxImage] = useState(null);
  const [previewPdf, setPreviewPdf] = useState(null);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Edit Lesson Modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [editError, setEditError] = useState('');
  const [editForm, setEditForm] = useState({
    titleAr: '',
    descriptionAr: '',
    courseId: '',
    classGroup: '',
    embedUrl: '',
  });
  const [editMediaFile, setEditMediaFile] = useState(null);
  const [editNewPdfs, setEditNewPdfs] = useState([]);
  const [editNewImages, setEditNewImages] = useState([]);

  // Toast feedback
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  // Real media player refs
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  useSetBreadcrumbs([
    {
      labelAr: 'مكتبة الحصص والشرح',
      labelEn: 'Lessons Library',
    },
  ]);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 3500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const fetchWorkspaceData = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const [wsRes, coursesRes, groupsRes] = await Promise.all([
        teacherApi.workspace.index(),
        teacherApi.courses.list().catch(() => ({ data: [] })),
        teacherApi.groups.list().catch(() => ({ data: [] })),
      ]);

      const rawLessons = Array.isArray(wsRes?.data?.lessons)
        ? wsRes.data.lessons
        : Array.isArray(wsRes?.data)
          ? wsRes.data
          : [];
      const mapped = rawLessons.map(mapLesson);
      setLessonsList(mapped);
      setCoursesList(Array.isArray(coursesRes?.data) ? coursesRes.data : []);
      setGroupsList(Array.isArray(groupsRes?.data) ? groupsRes.data : []);

      return mapped;
    } catch (err) {
      setLoadError(
        err?.message || (isAr ? 'تعذر تحميل مكتبة الحصص. يرجى المحاولة مرة أخرى.' : 'Failed to load workspace lessons.')
      );
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isAr]);

  useEffect(() => {
    let active = true;
    const init = async () => {
      try {
        const [wsRes, coursesRes, groupsRes] = await Promise.all([
          teacherApi.workspace.index(),
          teacherApi.courses.list().catch(() => ({ data: [] })),
          teacherApi.groups.list().catch(() => ({ data: [] })),
        ]);
        if (!active) return;

        const rawLessons = Array.isArray(wsRes?.data?.lessons)
          ? wsRes.data.lessons
          : Array.isArray(wsRes?.data)
            ? wsRes.data
            : [];
        const mapped = rawLessons.map(mapLesson);
        setLessonsList(mapped);
        setCoursesList(Array.isArray(coursesRes?.data) ? coursesRes.data : []);
        setGroupsList(Array.isArray(groupsRes?.data) ? groupsRes.data : []);

        const courseMatch = requestedCourseId
          ? mapped.find((m) => String(m.courseId) === String(requestedCourseId))
          : null;
        const storedUuid = (() => {
          try {
            return sessionStorage.getItem('currentLessonUuid') || '';
          } catch {
            return '';
          }
        })();
        const targetId = requestedLessonId || courseMatch?.id || storedUuid;
        if (targetId && mapped.some((m) => m.id === targetId)) {
          setSelectedLessonId(targetId);
        } else if (mapped.length > 0) {
          setSelectedLessonId(mapped[0].id);
        }
      } catch (err) {
        if (active) {
          setLoadError(
            err?.message || (isAr ? 'تعذر تحميل مكتبة الحصص. يرجى المحاولة مرة أخرى.' : 'Failed to load workspace lessons.')
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    init();
    return () => {
      active = false;
    };
  }, [requestedLessonId, requestedCourseId, isAr]);

  const refreshSingleLesson = useCallback(async (lessonUuid) => {
    const res = await teacherApi.workspace.getLesson(lessonUuid);
    if (res?.data) {
      const updated = mapLesson(res.data);
      setLessonsList((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      return updated;
    }
    return null;
  }, []);

  // Computed live KPI stats
  const workspaceStats = useMemo(() => {
    const totalSeconds = lessonsList.reduce((acc, l) => acc + Number(l.durationSeconds || 0), 0);
    const videoCount = lessonsList.filter((l) => l.mediaType === 'video').length;
    return {
      totalLessons: lessonsList.length,
      totalHours: Math.round((totalSeconds / 3600) * 10) / 10,
      videoCount,
      audioCount: lessonsList.length - videoCount,
    };
  }, [lessonsList]);

  const filteredLessons = useMemo(() => {
    const q = lessonSearch.trim().toLowerCase();
    return lessonsList.filter((l) => {
      if (courseFilter !== 'all' && String(l.courseId) !== String(courseFilter)) return false;
      if (mediaFilter !== 'all' && l.mediaType !== mediaFilter) return false;
      if (!q) return true;
      return (
        (l.titleAr || '').toLowerCase().includes(q) ||
        (l.title || '').toLowerCase().includes(q) ||
        (l.subjectAr || '').toLowerCase().includes(q) ||
        (l.courseTitleAr || '').toLowerCase().includes(q)
      );
    });
  }, [lessonsList, lessonSearch, courseFilter, mediaFilter]);

  const currentLesson = useMemo(() => {
    if (!lessonsList.length) return null;
    return lessonsList.find((l) => l.id === selectedLessonId) || filteredLessons[0] || lessonsList[0];
  }, [lessonsList, filteredLessons, selectedLessonId]);

  const handleSelectLesson = (lessonId) => {
    setSelectedLessonId(lessonId);
    setActiveSection('media');
    try {
      sessionStorage.setItem('currentLessonUuid', lessonId);
    } catch {
      // ignore
    }
  };

  const getCurrentPlayerTime = () => {
    const el = videoRef.current || audioRef.current;
    if (el && Number.isFinite(el.currentTime)) {
      return Math.floor(el.currentTime);
    }
    return 0;
  };

  const handleJumpToTimestamp = (seconds) => {
    setActiveSection('media');
    setTimeout(() => {
      const target = videoRef.current || audioRef.current;
      if (target) {
        target.currentTime = Math.max(0, Number(seconds) || 0);
        target.play().catch(() => {});
      }
    }, 60);
  };

  // Workspace Interactive Mutations (Chapters, Transcript, Concept Graph, Reorder, Delete Attachment)
  const handleSyncChapters = async (lessonId, chapters) => {
    const res = await teacherApi.workspace.syncChapters(lessonId, chapters);
    const updatedChapters = Array.isArray(res?.data) ? res.data : [];
    setLessonsList((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, chapters: updatedChapters } : l))
    );
    showToast(isAr ? 'تم حفظ فصول الحصة بنجاح.' : 'Lesson chapters saved.');
  };

  const handleSyncTranscript = async (lessonId, segments) => {
    const res = await teacherApi.workspace.syncTranscript(lessonId, segments);
    const updatedSegments = Array.isArray(res?.data) ? res.data : [];
    setLessonsList((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, transcript: updatedSegments } : l))
    );
    showToast(isAr ? 'تم حفظ التفريغ النصي بنجاح.' : 'Transcript saved.');
  };

  const handleSaveConceptGraph = async (lessonId, treeData) => {
    const res = await teacherApi.workspace.saveConceptGraph(lessonId, treeData);
    const savedTree = res?.data || treeData;
    setLessonsList((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, notebookMindMap: savedTree } : l))
    );
    showToast(isAr ? 'تم حفظ خريطة المفاهيم بنجاح.' : 'Concept map saved.');
  };

  const handleReorderWhiteboards = async (lessonId, orderedIds) => {
    try {
      await teacherApi.studio.reorderAttachments(lessonId, orderedIds, 'whiteboard_image');
      await refreshSingleLesson(lessonId);
      showToast(isAr ? 'تم تحديث ترتيب صور السبورة.' : 'Whiteboard order updated.');
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر إعادة ترتيب الصور.' : 'Failed to reorder images.'), 'error');
    }
  };

  const handleDeleteAttachment = async (lessonId, attachmentId) => {
    try {
      await teacherApi.studio.deleteAttachment(lessonId, attachmentId);
      await refreshSingleLesson(lessonId);
      showToast(isAr ? 'تم حذف المرفق بنجاح.' : 'Attachment deleted.');
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر حذف المرفق.' : 'Failed to delete attachment.'), 'error');
    }
  };

  // Edit Lesson Modal
  const handleOpenEditModal = () => {
    if (!currentLesson) return;
    setEditForm({
      titleAr: currentLesson.titleAr || '',
      descriptionAr: currentLesson.descriptionAr || '',
      courseId: currentLesson.courseId || '',
      classGroup: currentLesson.classGroup || '',
      embedUrl: currentLesson.embedUrl || '',
    });
    setEditMediaFile(null);
    setEditNewPdfs([]);
    setEditNewImages([]);
    setEditError('');
    setSaveProgress(0);
    setIsEditOpen(true);
  };

  const handleSaveLessonEdit = async (e) => {
    e.preventDefault();
    if (!currentLesson || isSavingEdit) return;
    setEditError('');

    if (editForm.titleAr.trim().length < 3) {
      setEditError(isAr ? 'عنوان الحصة يجب ألا يقل عن 3 أحرف.' : 'Title must be at least 3 characters.');
      return;
    }

    if (editMediaFile && editMediaFile.size > MAX_STORAGE_FILE_SIZE_BYTES) {
      setEditError(isAr ? 'حجم ملف الوسائط يتجاوز الحد الأقصى (50 ميجابايت).' : 'Media file exceeds 50 MB limit.');
      return;
    }

    const oversizedAtt = [...editNewPdfs, ...editNewImages].find((f) => f.size > MAX_STORAGE_FILE_SIZE_BYTES);
    if (oversizedAtt) {
      setEditError(
        isAr
          ? `الملف «${oversizedAtt.name}» يتجاوز الحد الأقصى (50 ميجابايت).`
          : `File "${oversizedAtt.name}" exceeds 50 MB limit.`
      );
      return;
    }

    setIsSavingEdit(true);
    setSaveProgress(10);

    try {
      await teacherApi.studio.updateLesson(currentLesson.id, {
        title_ar: editForm.titleAr.trim(),
        description_ar: editForm.descriptionAr.trim(),
        course_uuid: editForm.courseId || null,
        target_group_code: editForm.classGroup || '',
        embed_url: editForm.embedUrl.trim(),
      });
      setSaveProgress(30);

      if (editMediaFile) {
        const durSecs = await extractMediaDurationSeconds(editMediaFile);
        try {
          await teacherApi.studio.uploadMediaDirect(currentLesson.id, editMediaFile, {
            durationSeconds: durSecs,
            onProgress: (pct) => setSaveProgress(30 + Math.round((pct / 100) * 45)),
          });
        } catch {
          await teacherApi.studio.uploadMedia(currentLesson.id, editMediaFile, {
            duration_seconds: durSecs,
            onProgress: (pct) => setSaveProgress(30 + Math.round((pct / 100) * 45)),
          });
        }
      }
      setSaveProgress(75);

      for (const pdf of editNewPdfs) {
        await teacherApi.studio.uploadPdf(currentLesson.id, pdf, pdf.name.replace(/\.[^/.]+$/, ''));
      }

      const baseImgOrder = currentLesson.lessonImages?.length || 0;
      for (let i = 0; i < editNewImages.length; i += 1) {
        const img = editNewImages[i];
        await teacherApi.studio.uploadImage(currentLesson.id, img, {
          titleAr: img.name.replace(/\.[^/.]+$/, ''),
          order: baseImgOrder + i + 1,
        });
      }

      setSaveProgress(100);
      await refreshSingleLesson(currentLesson.id);
      setIsEditOpen(false);
      showToast(isAr ? 'تم حفظ تعديلات الحصة بنجاح.' : 'Lesson updated successfully.');
    } catch (err) {
      setEditError(err?.message || (isAr ? 'حدث خطأ أثناء حفظ التعديلات.' : 'Failed to save changes.'));
    } finally {
      setIsSavingEdit(false);
      setSaveProgress(0);
    }
  };

  // Delete Lesson
  const handleDeleteConfirm = async () => {
    if (!lessonToDelete || isDeleting) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await teacherApi.studio.deleteLesson(lessonToDelete.id);
      const remaining = lessonsList.filter((l) => l.id !== lessonToDelete.id);
      setLessonsList(remaining);
      if (selectedLessonId === lessonToDelete.id) {
        setSelectedLessonId(remaining[0]?.id || '');
      }
      setLessonToDelete(null);
      showToast(isAr ? 'تم حذف الحصة بنجاح.' : 'Lesson deleted successfully.');
    } catch (err) {
      setDeleteError(err?.message || (isAr ? 'تعذر حذف الحصة. يرجى المحاولة مرة أخرى.' : 'Failed to delete lesson.'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="lw-container"
      style={{
        maxWidth: '1320px',
        margin: '0 auto',
        fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <style>{`
        .lw-container { padding: 28px 24px 64px; }
        @keyframes lwSpin { to { transform: rotate(360deg); } }
        .lw-spin { animation: lwSpin 0.85s linear infinite; }
        .lw-split-grid {
          display: grid;
          grid-template-columns: minmax(280px, 330px) minmax(0, 1fr);
          gap: 20px;
          align-items: start;
        }
        .lw-sidebar {
          position: sticky;
          top: 20px;
        }
        @media (max-width: 960px) {
          .lw-container { padding: 16px 12px 64px !important; }
          .lw-split-grid { grid-template-columns: 1fr !important; }
          .lw-sidebar { position: static !important; }
        }
      `}</style>

      {/* Inline Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: isRtl ? '24px' : 'auto',
            right: isRtl ? 'auto' : '24px',
            zIndex: 99999,
            backgroundColor: toast.type === 'error' ? '#EF4444' : '#059669',
            color: '#FFFFFF',
            padding: '11px 16px',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '800',
          }}
        >
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
            {isAr ? 'مكتبة الحصص والشرح' : 'Lessons & Content Workspace'}
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0 }}>
            {isAr
              ? 'إدارة الحصص المسجلة، الفصول الزمنية، الملازم وصور السبورة، التفريغ النصي وخريطة المفاهيم.'
              : 'Manage recorded lessons, timestamped chapters, attachments, transcripts, and concept maps.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/teacher/studio')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: 'var(--radius-lg)',
            border: 'none',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            fontSize: '13.5px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Plus size={17} />
          <span>{isAr ? 'تسجيل أو رفع حصة جديدة' : 'New Lesson'}</span>
        </button>
      </div>

      {/* Workspace KPI Strip */}
      {!isLoading && !loadError && lessonsList.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 155px), 1fr))',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          {[
            { label: isAr ? 'إجمالي الحصص' : 'Total Lessons', value: workspaceStats.totalLessons, color: 'var(--text-primary)' },
            { label: isAr ? 'إجمالي الساعات' : 'Total Hours', value: `${workspaceStats.totalHours} ${isAr ? 'ساعة' : 'hrs'}`, color: 'var(--primary)' },
            { label: isAr ? 'حصص الفيديو' : 'Video Lessons', value: workspaceStats.videoCount, color: '#0EA5E9' },
            { label: isAr ? 'الحصص الصوتية' : 'Audio Lessons', value: workspaceStats.audioCount, color: '#10B981' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '13px 16px',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>{stat.label}</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: stat.color, marginTop: '4px' }}>{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Error Banner */}
      {loadError && !isLoading && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444', fontWeight: '700', fontSize: '13.5px' }}>
            <AlertCircle size={18} />
            <span>{loadError}</span>
          </div>
          <button
            type="button"
            onClick={fetchWorkspaceData}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} />
            <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      {isLoading ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '64px 24px',
            textAlign: 'center',
          }}
        >
          <Loader2 size={32} color="var(--primary)" className="lw-spin" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)' }}>
            {isAr ? 'جاري تحميل حصصك...' : 'Loading your lessons...'}
          </div>
        </div>
      ) : !loadError && lessonsList.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '64px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              backgroundColor: 'var(--primary-surface)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <BookOpen size={30} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px' }}>
            {isAr ? 'لا توجد حصص مسجلة بعد' : 'No Lessons Yet'}
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
            {isAr
              ? 'ابدأ بتسجيل أول حصة أو رفع ملف صوتي/فيديو وملازم الشرح من الاستوديو الذكي.'
              : 'Record or upload your first lesson from the Smart Studio.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/teacher/studio')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            <span>{isAr ? 'الذهاب لاستوديو التسجيل' : 'Go to Studio'}</span>
          </button>
        </div>
      ) : lessonsList.length > 0 ? (
        <div className="lw-split-grid">
          <WorkspaceSidebar
            lessons={filteredLessons}
            courses={coursesList}
            selectedLessonId={currentLesson?.id || ''}
            searchQuery={lessonSearch}
            onSearchChange={setLessonSearch}
            courseFilter={courseFilter}
            onCourseFilterChange={setCourseFilter}
            mediaFilter={mediaFilter}
            onMediaFilterChange={setMediaFilter}
            lang={lang}
            isRtl={isRtl}
            onSelectLesson={handleSelectLesson}
            onRequestDelete={(lesson) => {
              setDeleteError('');
              setLessonToDelete(lesson);
            }}
          />

          {currentLesson && (
            <main style={{ display: 'flex', flexDirection: 'column', gap: '18px', minWidth: 0 }}>
              {/* Lesson Header Card */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '22px 24px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                      {isAr ? currentLesson.titleAr : currentLesson.title}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      {currentLesson.subjectAr && (
                        <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px', backgroundColor: 'var(--primary-surface)', color: 'var(--primary)' }}>
                          {currentLesson.subjectAr}
                        </span>
                      )}
                      {currentLesson.gradeAr && (
                        <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
                          {currentLesson.gradeAr}
                        </span>
                      )}
                      {currentLesson.courseTitleAr && (
                        <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
                          {currentLesson.courseTitleAr}
                        </span>
                      )}
                      {currentLesson.classGroup && (
                        <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
                          {currentLesson.classGroup}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    {currentLesson.recordedDate && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={14} />
                        {currentLesson.recordedDate}
                      </span>
                    )}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)' }}>
                      <Clock size={14} />
                      {currentLesson.durationFormatted}
                    </span>
                    <button
                      type="button"
                      onClick={handleOpenEditModal}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--primary)',
                        backgroundColor: 'var(--primary-surface)',
                        color: 'var(--primary)',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      <Edit3 size={14} />
                      <span>{isAr ? 'تعديل الحصة' : 'Edit Lesson'}</span>
                    </button>
                  </div>
                </div>

                {currentLesson.descriptionAr && (
                  <p
                    style={{
                      fontSize: '13.5px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      margin: '10px 0 0 0',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-subtle)',
                    }}
                  >
                    {currentLesson.descriptionAr}
                  </p>
                )}

                {/* Section Switcher */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginTop: '18px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  {[
                    { id: 'media', icon: Headphones, labelAr: 'الوسائط والمرفقات والفصول', labelEn: 'Media, Chapters & Files' },
                    { id: 'transcript', icon: FileText, labelAr: `التفريغ النصي (${currentLesson.transcript?.length || 0})`, labelEn: `Transcript (${currentLesson.transcript?.length || 0})` },
                    { id: 'graph', icon: Share2, labelAr: 'خريطة المفاهيم', labelEn: 'Mind Map' },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const active = activeSection === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveSection(tab.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '7px',
                          padding: '8px 15px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid ' + (active ? 'var(--primary)' : 'var(--border-subtle)'),
                          backgroundColor: active ? 'var(--primary)' : 'var(--bg-subtle)',
                          color: active ? '#FFFFFF' : 'var(--text-secondary)',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        <Icon size={15} />
                        <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeSection === 'media' && (
                <WorkspaceMediaTab
                  key={currentLesson.id}
                  lesson={currentLesson}
                  audioRef={audioRef}
                  videoRef={videoRef}
                  lang={lang}
                  isRtl={isRtl}
                  onJumpToTimestamp={handleJumpToTimestamp}
                  onGetCurrentTime={getCurrentPlayerTime}
                  onSyncChapters={handleSyncChapters}
                  onReorderWhiteboards={handleReorderWhiteboards}
                  onDeleteAttachment={handleDeleteAttachment}
                  onOpenLightbox={setLightboxImage}
                  onPreviewPdf={setPreviewPdf}
                />
              )}

              {activeSection === 'transcript' && (
                <WorkspaceTranscriptTab
                  key={currentLesson.id}
                  lesson={currentLesson}
                  lang={lang}
                  isRtl={isRtl}
                  onJumpToTimestamp={handleJumpToTimestamp}
                  onGetCurrentTime={getCurrentPlayerTime}
                  onSyncTranscript={handleSyncTranscript}
                />
              )}

              {activeSection === 'graph' && (
                <WorkspaceMindMapTab
                  key={currentLesson.id}
                  lesson={currentLesson}
                  lang={lang}
                  isRtl={isRtl}
                  onJumpToTimestamp={handleJumpToTimestamp}
                  onSaveConceptGraph={handleSaveConceptGraph}
                />
              )}
            </main>
          )}
        </div>
      ) : null}

      {/* Whiteboard Lightbox Modal */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '920px',
              width: '100%',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lightboxImage.title}
              </span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <img
              src={lightboxImage.url}
              alt={lightboxImage.title}
              style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', display: 'block', backgroundColor: '#000' }}
            />
          </div>
        </div>
      )}

      {/* Inline PDF Preview Modal */}
      {previewPdf && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewPdf(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
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
              maxWidth: '920px',
              width: '100%',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', gap: '10px' }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {previewPdf.title || previewPdf.fileName}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a
                  href={previewPdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 11px',
                    borderRadius: '7px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: '700',
                    textDecoration: 'none',
                  }}
                >
                  <ExternalLink size={13} />
                  <span>{isAr ? 'فتح في تبويب جديد' : 'Open'}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewPdf(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <iframe
              src={previewPdf.url}
              title={previewPdf.title || 'PDF'}
              style={{ width: '100%', height: '75vh', border: 'none', display: 'block', backgroundColor: '#FFFFFF' }}
            />
          </div>
        </div>
      )}

      <EditLessonModal
        isOpen={isEditOpen}
        lesson={currentLesson}
        editForm={editForm}
        onChangeForm={(patch) => setEditForm((prev) => ({ ...prev, ...patch }))}
        coursesList={coursesList}
        groupsList={groupsList}
        editMediaFile={editMediaFile}
        onChangeMediaFile={setEditMediaFile}
        editNewPdfs={editNewPdfs}
        onChangeNewPdfs={setEditNewPdfs}
        editNewImages={editNewImages}
        onChangeNewImages={setEditNewImages}
        isSaving={isSavingEdit}
        saveProgress={saveProgress}
        saveError={editError}
        onClearError={() => setEditError('')}
        lang={lang}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleSaveLessonEdit}
        onDeleteExistingAttachment={handleDeleteAttachment}
      />

      <DeleteLessonModal
        lesson={lessonToDelete}
        isDeleting={isDeleting}
        deleteError={deleteError}
        lang={lang}
        onCancel={() => setLessonToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default LessonWorkspace;
