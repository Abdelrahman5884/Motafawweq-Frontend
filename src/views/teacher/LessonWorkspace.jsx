import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { teacherApi } from '../../services/teacherApi';
import { NotebookMindMapCanvas } from '../../components/knowledge-map/NotebookMindMapCanvas';
import {
  Video,
  Mic,
  FileText,
  Share2,
  Search,
  Clock,
  BookOpen,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Calendar,
  Trash2,
  AlertTriangle,
  X,
  Plus,
  Image as ImageIcon,
  Layers,
  Loader2,
  Headphones,
} from 'lucide-react';

export const LessonWorkspace = () => {
  const { navigate } = useAuth();
  const { lang, isRtl } = useLanguage();

  const [lessonsList, setLessonsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters
  const [lessonSearch, setLessonSearch] = useState('');
  const [mediaFilter, setMediaFilter] = useState('all'); // 'all' | 'audio' | 'video'

  // Active inner section: 'media' | 'transcript' | 'graph'
  const [activeSection, setActiveSection] = useState('media');

  // Transcript helpers
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  // Image lightbox
  const [lightboxImage, setLightboxImage] = useState(null);

  // Real media refs
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  useSetBreadcrumbs([
    {
      labelAr: 'مكتبة الحصص والشرح',
      labelEn: 'Lessons Library',
    },
  ]);

  // Fetch real lessons from backend
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    teacherApi.studio
      .listLessons()
      .then((res) => {
        if (!mounted) return;
        const raw = Array.isArray(res?.data) ? res.data : [];
        const mapped = raw.map((l) => ({
          id: l.id || l.uuid,
          uuid: l.id || l.uuid,
          title: l.titleEn || l.titleAr || l.title || '',
          titleAr: l.titleAr || l.title || '',
          descriptionAr: l.descriptionAr || l.description || '',
          unitAr: l.unitAr || l.courseTitleAr || l.subjectAr || '',
          courseTitleAr: l.courseTitleAr || '',
          subjectAr: l.subjectAr || l.subject || '',
          gradeAr: l.gradeAr || l.grade || '',
          classGroup: l.classGroup || '',
          mediaType: l.mediaType || (l.mode === 'video' || l.mode === 'embed' ? 'video' : 'audio'),
          mediaStreamUrl: l.mediaStreamUrl || null,
          mediaOriginalName: l.mediaOriginalName || '',
          mediaSizeBytes: l.mediaSizeBytes || 0,
          embedUrl: l.embedUrl || '',
          videoUrl: l.videoUrl || l.embedUrl || l.mediaStreamUrl || '',
          isYoutube: Boolean(l.isYoutube),
          durationFormatted: l.durationFormatted || l.durationLabel || '00:00',
          durationSeconds: l.durationSeconds || 0,
          recordedDate: (l.publishedAt || l.createdAt || '').slice(0, 10) || '',
          aiFeatures: l.aiFeatures || { speechToText: false, conceptGraph: false, chapterIndexing: false },
          chapters: Array.isArray(l.chapters) ? l.chapters : [],
          transcript: Array.isArray(l.transcript) ? l.transcript : [],
          notebookMindMap: l.notebookMindMap || null,
          lessonPdfs: Array.isArray(l.lessonPdfs) ? l.lessonPdfs : [],
          lessonImages: Array.isArray(l.lessonImages) ? l.lessonImages : [],
        }));

        setLessonsList(mapped);
        const savedUuid = sessionStorage.getItem('currentLessonUuid');
        if (savedUuid && mapped.some((m) => m.id === savedUuid)) {
          setSelectedLessonId(savedUuid);
        } else if (mapped.length > 0) {
          setSelectedLessonId(mapped[0].id);
        }
      })
      .catch((err) => {
        console.warn('Teacher studio lessons fetch error:', err);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredLessons = useMemo(() => {
    const q = lessonSearch.trim().toLowerCase();
    return lessonsList.filter((l) => {
      const matchQuery =
        !q ||
        (l.titleAr && l.titleAr.toLowerCase().includes(q)) ||
        (l.title && l.title.toLowerCase().includes(q)) ||
        (l.subjectAr && l.subjectAr.toLowerCase().includes(q)) ||
        (l.courseTitleAr && l.courseTitleAr.toLowerCase().includes(q));
      const matchMedia = mediaFilter === 'all' || l.mediaType === mediaFilter;
      return matchQuery && matchMedia;
    });
  }, [lessonsList, lessonSearch, mediaFilter]);

  const currentLesson = useMemo(() => {
    if (!lessonsList.length) return null;
    return lessonsList.find((l) => l.id === selectedLessonId) || filteredLessons[0] || lessonsList[0];
  }, [lessonsList, filteredLessons, selectedLessonId]);

  const handleSelectLesson = (lessonId) => {
    setSelectedLessonId(lessonId);
    setActiveSection('media');
    try {
      sessionStorage.setItem('currentLessonUuid', lessonId);
    } catch (e) {}
  };

  const handleJumpToTimestamp = (seconds) => {
    setActiveSection('media');
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = seconds;
        audioRef.current.play().catch(() => {});
      }
      if (videoRef.current) {
        videoRef.current.currentTime = seconds;
        videoRef.current.play().catch(() => {});
      }
    }, 50);
  };

  const handleDeleteConfirm = async () => {
    if (!lessonToDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      await teacherApi.studio.deleteLesson(lessonToDelete.id);
      const remaining = lessonsList.filter((l) => l.id !== lessonToDelete.id);
      setLessonsList(remaining);
      if (selectedLessonId === lessonToDelete.id) {
        setSelectedLessonId(remaining[0]?.id || '');
      }
      setLessonToDelete(null);
    } catch (err) {
      console.warn('Delete lesson error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyTranscript = () => {
    if (!currentLesson?.transcript?.length) return;
    const text = currentLesson.transcript
      .map((seg) => `[${seg.timestamp || '00:00'}] ${seg.textAr || seg.text || ''}`)
      .join('\n\n');
    navigator.clipboard?.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const formatBytesLabel = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getEmbedIframeSrc = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    return url;
  };

  return (
    <div
      style={{
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '28px 24px 64px',
        fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: '0 0 4px 0',
            }}
          >
            {lang === 'ar' ? 'مكتبة الحصص والشرح' : 'Lessons & Content Workspace'}
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0 }}>
            {lang === 'ar'
              ? 'تصفح حصصك المسجلة، استمع للتسجيلات، وراجع الملازم وصور السبورة بسهولة.'
              : 'Browse your recorded lessons, play media, and review attached PDFs and whiteboard notes.'}
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
          <span>{lang === 'ar' ? 'تسجيل أو رفع حصة جديدة' : 'New Lesson'}</span>
        </button>
      </div>

      {/* Loading State */}
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
          <Loader2 size={32} color="var(--primary)" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)' }}>
            {lang === 'ar' ? 'جاري تحميل حصصك...' : 'Loading your lessons...'}
          </div>
        </div>
      ) : lessonsList.length === 0 ? (
        /* Empty State */
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
            {lang === 'ar' ? 'لا توجد حصص مسجلة بعد' : 'No Lessons Yet'}
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
            {lang === 'ar'
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
            <span>{lang === 'ar' ? 'الذهاب لاستوديو التسجيل' : 'Go to Studio'}</span>
          </button>
        </div>
      ) : (
        /* Master-Detail Clean Split Layout */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(290px, 340px) 1fr',
            gap: '20px',
            alignItems: 'start',
          }}
        >
          {/* Sidebar: Lessons List */}
          <aside
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '16px',
              boxShadow: 'var(--shadow-sm)',
              position: 'sticky',
              top: '20px',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <Search
                size={15}
                color="var(--text-tertiary)"
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  [isRtl ? 'right' : 'left']: '12px',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                value={lessonSearch}
                onChange={(e) => setLessonSearch(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحث في الحصص...' : 'Search lessons...'}
                style={{
                  width: '100%',
                  padding: isRtl ? '9px 36px 9px 12px' : '9px 12px 9px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
              {[
                { key: 'all', labelAr: 'الكل', labelEn: 'All' },
                { key: 'audio', labelAr: 'صوتي', labelEn: 'Audio' },
                { key: 'video', labelAr: 'فيديو', labelEn: 'Video' },
              ].map((pill) => {
                const active = mediaFilter === pill.key;
                return (
                  <button
                    key={pill.key}
                    type="button"
                    onClick={() => setMediaFilter(pill.key)}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid ' + (active ? 'var(--primary)' : 'var(--border-subtle)'),
                      backgroundColor: active ? 'var(--primary-surface)' : 'transparent',
                      color: active ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    {lang === 'ar' ? pill.labelAr : pill.labelEn}
                  </button>
                );
              })}
            </div>

            {/* Lessons Cards */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '65vh',
                overflowY: 'auto',
              }}
            >
              {filteredLessons.length === 0 ? (
                <div style={{ padding: '24px 12px', textAlign: 'center', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                  {lang === 'ar' ? 'لا توجد نتائج مطابقة' : 'No matching lessons'}
                </div>
              ) : (
                filteredLessons.map((lesson) => {
                  const isSelected = currentLesson?.id === lesson.id;
                  const attachmentsCount = (lesson.lessonPdfs?.length || 0) + (lesson.lessonImages?.length || 0);
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-lg)',
                        border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        position: 'relative',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                          <div
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '8px',
                              backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                              color: isSelected ? '#FFFFFF' : 'var(--primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {lesson.mediaType === 'video' ? <Video size={15} /> : <Mic size={15} />}
                          </div>
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
                            {lang === 'ar' ? lesson.titleAr : lesson.title}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLessonToDelete(lesson);
                          }}
                          title={lang === 'ar' ? 'حذف الحصة' : 'Delete lesson'}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-tertiary)',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '6px',
                            flexShrink: 0,
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        {lesson.subjectAr && <span>{lesson.subjectAr}</span>}
                        {lesson.courseTitleAr && (
                          <span style={{ color: '#10B981', fontWeight: '700' }}>• {lesson.courseTitleAr}</span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} />
                          {lesson.durationFormatted}
                        </span>
                        {attachmentsCount > 0 && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: '700' }}>
                            <Layers size={12} />
                            {attachmentsCount} {lang === 'ar' ? 'مرفقات' : 'files'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          {/* Main Workspace Area */}
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
                      {lang === 'ar' ? currentLesson.titleAr : currentLesson.title}
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

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
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
                    { id: 'media', icon: Headphones, labelAr: 'الوسائط والمرفقات', labelEn: 'Media & Attachments' },
                    { id: 'transcript', icon: FileText, labelAr: 'التفريغ النصي', labelEn: 'Transcript' },
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
                          padding: '8px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid ' + (active ? 'var(--primary)' : 'var(--border-subtle)'),
                          backgroundColor: active ? 'var(--primary)' : 'var(--bg-subtle)',
                          color: active ? '#FFFFFF' : 'var(--text-secondary)',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Icon size={15} />
                        <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 1: MEDIA & ATTACHMENTS */}
              {activeSection === 'media' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* Media Player Card */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '22px 24px',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {currentLesson.mediaType === 'video' ? (
                          <Video size={18} color="var(--primary)" />
                        ) : (
                          <Mic size={18} color="var(--primary)" />
                        )}
                        <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                          {currentLesson.mediaType === 'video'
                            ? lang === 'ar' ? 'فيديو الحصة' : 'Lesson Video'
                            : lang === 'ar' ? 'التسجيل الصوتي للحصة' : 'Lesson Audio Recording'}
                        </h3>
                      </div>

                      {currentLesson.mediaOriginalName && (
                        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                          {currentLesson.mediaOriginalName}
                          {currentLesson.mediaSizeBytes ? ` (${formatBytesLabel(currentLesson.mediaSizeBytes)})` : ''}
                        </span>
                      )}
                    </div>

                    {currentLesson.mediaType === 'video' ? (
                      currentLesson.mediaStreamUrl && !currentLesson.isYoutube && !currentLesson.videoUrl?.includes('youtu') ? (
                        <div style={{ borderRadius: '14px', overflow: 'hidden', backgroundColor: '#000' }}>
                          <video
                            ref={videoRef}
                            key={currentLesson.mediaStreamUrl}
                            controls
                            src={currentLesson.mediaStreamUrl}
                            style={{ width: '100%', maxHeight: '460px', display: 'block' }}
                          />
                        </div>
                      ) : currentLesson.embedUrl || currentLesson.videoUrl ? (
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
                            src={getEmbedIframeSrc(currentLesson.embedUrl || currentLesson.videoUrl)}
                            title={currentLesson.titleAr}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            padding: '28px',
                            borderRadius: 'var(--radius-lg)',
                            backgroundColor: 'var(--bg-subtle)',
                            textAlign: 'center',
                            color: 'var(--text-secondary)',
                            fontSize: '13.5px',
                          }}
                        >
                          {lang === 'ar' ? 'لم يتم رفع ملف فيديو أو رابط لهذه الحصة.' : 'No video file or embed URL attached.'}
                        </div>
                      )
                    ) : currentLesson.mediaStreamUrl ? (
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
                          key={currentLesson.mediaStreamUrl}
                          controls
                          src={currentLesson.mediaStreamUrl}
                          style={{ width: '100%', display: 'block' }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: '28px',
                          borderRadius: 'var(--radius-lg)',
                          backgroundColor: 'var(--bg-subtle)',
                          textAlign: 'center',
                          color: 'var(--text-secondary)',
                          fontSize: '13.5px',
                        }}
                      >
                        {lang === 'ar'
                          ? 'لم يتم رفع ملف صوتي لهذه الحصة بعد.'
                          : 'No audio file uploaded for this lesson yet.'}
                      </div>
                    )}

                    {/* Chapters timestamps */}
                    {currentLesson.chapters && currentLesson.chapters.length > 0 && (
                      <div style={{ marginTop: '18px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
                          {lang === 'ar' ? 'فصول الحصة' : 'Lesson Chapters'}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {currentLesson.chapters.map((ch) => (
                            <button
                              key={ch.id}
                              type="button"
                              onClick={() => handleJumpToTimestamp(ch.startSeconds || 0)}
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
                              <span>{lang === 'ar' ? ch.titleAr : ch.title}</span>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--primary)' }}>
                                {ch.timestamp}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Attachments Card (PDFs + Whiteboard Images) */}
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
                      {lang === 'ar' ? 'الملازم وصور السبورة المرفقة' : 'Attached PDFs & Whiteboard Notes'}
                    </h3>

                    {(!currentLesson.lessonPdfs || currentLesson.lessonPdfs.length === 0) &&
                    (!currentLesson.lessonImages || currentLesson.lessonImages.length === 0) ? (
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
                        {lang === 'ar' ? 'لا توجد ملازم PDF أو صور سبورة مرفقة بهذه الحصة.' : 'No PDFs or whiteboard images attached.'}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        {/* PDFs */}
                        {currentLesson.lessonPdfs?.length > 0 && (
                          <div>
                            <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <FileText size={14} />
                              <span>{lang === 'ar' ? 'ملفات وملازم PDF' : 'PDF Materials'}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                              {currentLesson.lessonPdfs.map((pdf) => (
                                <a
                                  key={pdf.id}
                                  href={pdf.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '12px',
                                    padding: '12px 14px',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--border-subtle)',
                                    backgroundColor: 'var(--bg-subtle)',
                                    color: 'var(--text-primary)',
                                    textDecoration: 'none',
                                  }}
                                >
                                  <div style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: '13.5px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {pdf.title || pdf.fileName}
                                    </div>
                                    <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                                      {pdf.fileSize || ''}
                                      {pdf.pagesCount ? ` • ${pdf.pagesCount} ${lang === 'ar' ? 'صفحة' : 'pages'}` : ''}
                                    </div>
                                  </div>
                                  <ExternalLink size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Whiteboard Images */}
                        {currentLesson.lessonImages?.length > 0 && (
                          <div>
                            <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <ImageIcon size={14} />
                              <span>{lang === 'ar' ? 'صور السبورة' : 'Whiteboard Images'}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '12px' }}>
                              {currentLesson.lessonImages.map((img, idx) => (
                                <div
                                  key={img.id}
                                  onClick={() => setLightboxImage(img)}
                                  style={{
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    border: '1px solid var(--border-subtle)',
                                    backgroundColor: 'var(--bg-subtle)',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <div style={{ position: 'relative' }}>
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
                                        backgroundColor: 'rgba(15, 23, 42, 0.72)',
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
                                      <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {img.caption}
                                      </div>
                                    )}
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
              )}

              {/* SECTION 2: TRANSCRIPT */}
              {activeSection === 'transcript' && (
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '22px 24px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      {lang === 'ar' ? 'التفريغ النصي للحصة' : 'Lesson Transcript'}
                    </h3>

                    {currentLesson.transcript?.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative' }}>
                          <Search
                            size={14}
                            color="var(--text-tertiary)"
                            style={{
                              position: 'absolute',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              [isRtl ? 'right' : 'left']: '10px',
                            }}
                          />
                          <input
                            type="text"
                            value={transcriptSearch}
                            onChange={(e) => setTranscriptSearch(e.target.value)}
                            placeholder={lang === 'ar' ? 'ابحث في النص...' : 'Search transcript...'}
                            style={{
                              padding: isRtl ? '7px 32px 7px 12px' : '7px 12px 7px 32px',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: '12.5px',
                            }}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleCopyTranscript}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
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
                          {copiedText ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                          <span>{copiedText ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ النص' : 'Copy')}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {!currentLesson.transcript || currentLesson.transcript.length === 0 ? (
                    <div
                      style={{
                        padding: '36px 20px',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--bg-subtle)',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        fontSize: '13.5px',
                      }}
                    >
                      <Sparkles size={24} color="var(--primary)" style={{ margin: '0 auto 10px', display: 'block' }} />
                      {lang === 'ar'
                        ? 'لا يوجد تفريغ نصي لهذه الحصة حتى الآن (يتطلب تفعيل مخرجات الذكاء الاصطناعي على باقة Pro).'
                        : 'No transcript available for this lesson yet (requires Pro AI processing).'}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {currentLesson.transcript
                        .filter((seg) => {
                          if (!transcriptSearch.trim()) return true;
                          const txt = (seg.textAr || seg.text || '').toLowerCase();
                          return txt.includes(transcriptSearch.trim().toLowerCase());
                        })
                        .map((seg, idx) => (
                          <div
                            key={seg.id || idx}
                            onClick={() => handleJumpToTimestamp(seg.startSeconds || 0)}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px',
                              padding: '12px 14px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'var(--bg-subtle)',
                              cursor: 'pointer',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                color: 'var(--primary)',
                                backgroundColor: 'var(--primary-surface)',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                flexShrink: 0,
                              }}
                            >
                              {seg.timestamp || '00:00'}
                            </span>
                            <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.7, color: 'var(--text-primary)' }}>
                              {seg.textAr || seg.text}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 3: CONCEPT GRAPH */}
              {activeSection === 'graph' && (
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '22px 24px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {!currentLesson.notebookMindMap ? (
                    <div
                      style={{
                        padding: '36px 20px',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--bg-subtle)',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        fontSize: '13.5px',
                      }}
                    >
                      <Share2 size={24} color="var(--primary)" style={{ margin: '0 auto 10px', display: 'block' }} />
                      {lang === 'ar'
                        ? 'لم يتم توليد خريطة مفاهيم لهذه الحصة بعد (متاح لمشتركي باقة Pro).'
                        : 'No concept map generated for this lesson yet (available on Pro plan).'}
                    </div>
                  ) : (
                    <NotebookMindMapCanvas
                      treeData={currentLesson.notebookMindMap}
                      lessonTitle={lang === 'ar' ? currentLesson.titleAr : currentLesson.title}
                      unitTitle={currentLesson.unitAr || ''}
                      onJumpToTimestamp={handleJumpToTimestamp}
                      lang={lang}
                      isRtl={isRtl}
                    />
                  )}
                </div>
              )}
            </main>
          )}
        </div>
      )}

      {/* Whiteboard Lightbox Modal */}
      {lightboxImage && (
        <div
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
              maxWidth: '900px',
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

      {/* Delete Lesson Modal */}
      {lessonToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#EF4444' }}>
              <AlertTriangle size={22} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'تأكيد حذف الحصة' : 'Confirm Lesson Deletion'}
              </h3>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: 1.6 }}>
              {lang === 'ar'
                ? `هل أنت متأكد من حذف "${lessonToDelete.titleAr}"؟ سيتم تحديث عدد الحصص في المقرر المرتبط تلقائياً.`
                : `Delete "${lessonToDelete.title}"? Linked course lesson count will update automatically.`}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setLessonToDelete(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  opacity: isDeleting ? 0.6 : 1,
                }}
              >
                {isDeleting ? (lang === 'ar' ? 'جاري الحذف...' : 'Deleting...') : (lang === 'ar' ? 'حذف الحصة' : 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonWorkspace;
