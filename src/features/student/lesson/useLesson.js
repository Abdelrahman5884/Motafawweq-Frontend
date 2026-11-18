import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { studentApi } from '../../../services/studentApi';
import {
  COURSE_INFO,
  LESSONS_DATABASE,
  GRAPH_NODES,
  GRAPH_EDGES,
  INITIAL_NOTES,
  QUESTIONS_LIST,
  ATTACHMENTS_LIST,
  WHITEBOARD_IMAGES_LIST,
  TRANSCRIPT_SEGMENTS
} from './lessonData';

export const useLesson = (lang) => {
  const playerRef = useRef(null);
  const mediaElRef = useRef(null);
  const kmRef = useRef(null);
  const [liveCourseInfo, setLiveCourseInfo] = useState(COURSE_INFO);
  const [liveLessonsMap, setLiveLessonsMap] = useState(LESSONS_DATABASE);
  const [liveTranscript, setLiveTranscript] = useState(TRANSCRIPT_SEGMENTS);
  const [liveGraphNodes, setLiveGraphNodes] = useState(GRAPH_NODES);
  const [liveGraphEdges, setLiveGraphEdges] = useState(GRAPH_EDGES);
  const [liveAttachments, setLiveAttachments] = useState(ATTACHMENTS_LIST);
  const [liveWhiteboardImages, setLiveWhiteboardImages] = useState(WHITEBOARD_IMAGES_LIST);

  // Active Lesson State
  const [activeLessonId, setActiveLessonId] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlId = params.get('id') || params.get('lessonId');
      if (urlId) return urlId;
      const stored = sessionStorage.getItem('mtfq_target_lesson');
      if (stored) {
        sessionStorage.removeItem('mtfq_target_lesson');
        return stored;
      }
    } catch {}
    return '';
  });
  const [lessonStatuses, setLessonStatuses] = useState({});
  const [loadingLesson, setLoadingLesson] = useState(true);

  const lesson = liveLessonsMap[activeLessonId] || LESSONS_DATABASE[activeLessonId] || {
    id: activeLessonId || '',
    titleAr: '',
    descAr: '',
    durationSec: 0,
    durationFmt: '00:00',
    time: '',
    videoUrl: '',
    completed: false,
    chapters: []
  };

  const loadLessonDetails = async (targetId, fallbackTeacherName = '') => {
    if (!targetId || targetId.length <= 8) return;
    try {
      const lessonRes = await studentApi.lessons.get(targetId);
      const ld = lessonRes?.data || {};

      setLiveLessonsMap((prev) => ({
        ...prev,
        [targetId]: {
          ...(prev[targetId] || {}),
          id: targetId,
          titleAr: ld.titleAr || prev[targetId]?.titleAr || '',
          descAr: ld.descAr || '',
          durationSec: Number(ld.durationSeconds || 1800),
          durationFmt: ld.durationLabel || '30:00',
          time: ld.durationLabel || '30:00',
          videoUrl: ld.mediaUrl || ld.embedUrl || '',
          embedUrl: ld.embedUrl || '',
          isYoutube: Boolean(ld.isYoutube),
          mediaMode: ld.mediaMode || 'video',
          chapters: (ld.chapters || []).map((c, idx) => ({
            id: c.id || idx + 1,
            titleAr: c.titleAr,
            startSec: 0,
            endSec: 300,
            keyTerms: [],
            descAr: ''
          }))
        }
      }));

      setLiveAttachments(Array.isArray(ld.attachments) ? ld.attachments : []);
      setLiveWhiteboardImages(Array.isArray(ld.whiteboardImages) ? ld.whiteboardImages : []);
      setMediaMode(ld.mediaMode === 'audio' ? 'audio' : 'video');

      setLiveTranscript(
        Array.isArray(ld.transcript)
          ? ld.transcript.map((t, i) => ({
              id: t.id || `seg-${i}`,
              startSec: Number(t.startSeconds || 0),
              endSec: Number(t.endSeconds || 60),
              speaker: fallbackTeacherName || '',
              text: t.textAr || ''
            }))
          : []
      );

      if (ld.conceptGraph) {
        setLiveGraphNodes(ld.conceptGraph.nodes || []);
        setLiveGraphEdges(ld.conceptGraph.edges || []);
      } else {
        setLiveGraphNodes([]);
        setLiveGraphEdges([]);
      }

      if (ld.progress) {
        setCurrentTime(Number(ld.progress.maxPositionSeconds || ld.progress.watchedSeconds || 0));
        setIsBookmarked(Boolean(ld.progress.isBookmarked));
        setLessonStatuses((prev) => ({ ...prev, [targetId]: Boolean(ld.progress.isCompleted) }));
      }

      setNotes(
        Array.isArray(ld.notes)
          ? ld.notes.map((n) => ({
              id: n.id,
              ts: fmt(Number(n.timestampSeconds || 0)),
              sec: Number(n.timestampSeconds || 0),
              text: n.content,
              date: (n.createdAt || '').slice(0, 10)
            }))
          : []
      );
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadFromApi = async () => {
      setLoadingLesson(true);
      try {
        const params = new URLSearchParams(window.location.search);
        const requestedCourseId = params.get('courseId');
        const requestedLessonId = params.get('id') || params.get('lessonId');

        const coursesRes = await studentApi.courses.list();
        const courses = Array.isArray(coursesRes?.data) ? coursesRes.data : [];
        if (!mounted || courses.length === 0) {
          setLoadingLesson(false);
          return;
        }

        const chosenCourse =
          (requestedCourseId && courses.find((c) => c.id === requestedCourseId)) ||
          courses.find((c) => c.isEnrolled) ||
          courses[0];
        const courseDetailRes = await studentApi.courses.get(chosenCourse.id);
        const courseData = courseDetailRes?.data || {};
        if (!mounted) return;

        setLiveCourseInfo({
          titleAr: courseData.titleAr || '',
          subjectAr: courseData.subjectAr || courseData.titleAr || courseData.gradeAr || '',
          gradeAr: courseData.gradeAr || '',
          teacherAr: courseData.teacherName || '',
          teacherImg: courseData.teacherAvatar || '',
          summaryPdf: ''
        });

        const rawLessons = Array.isArray(courseData.lessons) ? courseData.lessons : [];
        if (rawLessons.length === 0) {
          setLoadingLesson(false);
          return;
        }

        const map = {};
        const statusMap = {};
        rawLessons.forEach((l) => {
          map[l.id] = {
            id: l.id,
            titleAr: l.titleAr,
            descAr: '',
            durationSec: 1800,
            durationFmt: l.durationLabel || '30:00',
            time: l.durationLabel || '30:00',
            videoUrl: '',
            mediaMode: l.mediaMode || 'video',
            hasMedia: Boolean(l.hasMedia),
            completed: Boolean(l.isCompleted),
            chapters: []
          };
          statusMap[l.id] = Boolean(l.isCompleted);
        });

        setLiveLessonsMap(map);
        setLessonStatuses(statusMap);

        const firstPlayable = rawLessons.find((l) => l.hasMedia) || rawLessons[0];
        const targetId = (requestedLessonId && map[requestedLessonId]) ? requestedLessonId : firstPlayable.id;
        setActiveLessonId(targetId);

        await loadLessonDetails(targetId, courseData.teacherName || '');
      } catch {
        // ignore
      } finally {
        if (mounted) setLoadingLesson(false);
      }
    };
    loadFromApi();
    return () => {
      mounted = false;
    };
  }, []);

  // Mobile drawer state
  const [mobilePlaylistOpen, setMobilePlaylistOpen] = useState(false);

  // Media State
  const [mediaMode, setMediaMode] = useState('video');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => {
    const s = activeLessonId ? localStorage.getItem(`mtfq_pos_${activeLessonId}`) : null;
    return s ? parseInt(s, 10) : 0;
  });
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayerFS, setIsPlayerFS] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  // Statuses
  const isCompleted = !!lessonStatuses[activeLessonId];
  const [isBookmarked, setIsBookmarked] = useState(() =>
    localStorage.getItem(`mtfq_bm_${activeLessonId}`) === 'true'
  );
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  // Checklist State ("درس اليوم" Card)
  const [lessonChecklist, setLessonChecklist] = useState({
    watchVideo: false,
    reviewNotes: false,
    solveQuestions: false,
    completeMaterials: false
  });

  const toggleChecklistItem = (key) => {
    setLessonChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Universal Confirmation Modal State
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    confirmColor: 'emerald',
    action: null
  });

  const triggerConfirm = ({ title, message, confirmText, cancelText, confirmColor, onConfirm }) => {
    setConfirmDialog({
      open: true,
      title,
      message,
      confirmText: confirmText || (lang === 'ar' ? 'تأكيد' : 'Confirm'),
      cancelText: cancelText || (lang === 'ar' ? 'إلغاء' : 'Cancel'),
      confirmColor: confirmColor || 'emerald',
      action: onConfirm
    });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.action) {
      confirmDialog.action();
    }
    setConfirmDialog(p => ({ ...p, open: false }));
  };

  // 5 Tabs State
  const [activeTab, setActiveTab] = useState('notes');
  const [mobileSubpage, setMobileSubpage] = useState(null);

  useEffect(() => {
    if (mobileSubpage) {
      const origOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = origOverflow;
      };
    }
  }, [mobileSubpage]);

  // Knowledge Map & Graph Sub-Mode
  const [roadmapViewMode, setRoadmapViewMode] = useState('cards');
  const [isKMFS, setIsKMFS] = useState(false);
  const [expandedConcept, setExpandedConcept] = useState(2);
  const [masteredConcepts, setMasteredConcepts] = useState({ 1: true });
  const [selectedGraphNode, setSelectedGraphNode] = useState('gn4');

  // Transcript Search State
  const [transcriptSearch, setTranscriptSearch] = useState('');

  // Notes State
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [noteInput, setNoteInput] = useState('');

  // Questions State
  const [savedQ, setSavedQ] = useState({ q1: true, q2: false, q3: true });
  const [revealedA, setRevealedA] = useState({ q1: true });

  // Attachments State
  const [dlId, setDlId] = useState(null);
  const [dlToast, setDlToast] = useState(null);

  // Playlist Array
  const playlist = Object.keys(liveLessonsMap).map(key => ({
    id: key,
    titleAr: liveLessonsMap[key].titleAr,
    time: liveLessonsMap[key].time,
    mediaMode: liveLessonsMap[key].mediaMode || 'video',
    hasMedia: Boolean(liveLessonsMap[key].hasMedia),
    completed: !!lessonStatuses[key],
    active: key === activeLessonId
  }));

  const completedCount = playlist.filter(l => l.completed).length;
  const courseCompletionPct = playlist.length > 0 ? Math.round((completedCount / playlist.length) * 100) : 0;
  const currentCh = (lesson.chapters || []).find(c => currentTime >= c.startSec && currentTime < c.endSec) || (lesson.chapters || [])[0] || null;
  const progress = lesson.durationSec > 0
    ? Math.min(100, Math.max(0, ((currentTime / lesson.durationSec) * 100))).toFixed(1)
    : '0.0';
  const remainingSec = Math.max(0, (lesson.durationSec || 0) - currentTime);

  // Lesson Switching with Confirmation
  const switchLesson = (lid) => {
    setActiveLessonId(lid);
    setIsPlaying(false);
    setCurrentTime(0);
    setMobilePlaylistOpen(false);
    loadLessonDetails(lid, liveCourseInfo?.teacherAr || '');
  };

  const handlePlaylistLessonClick = (targetLesson) => {
    if (targetLesson.id === activeLessonId) return;
    if (isPlaying || currentTime > 60) {
      triggerConfirm({
        title: lang === 'ar' ? 'الانتقال إلى درس آخر' : 'Switch Lesson',
        message: lang === 'ar'
          ? `أنت تذاكر حالياً "${lesson.titleAr}". هل تريد الانتقال إلى "${targetLesson.titleAr}" وحفظ موضع توقفك الحالي؟`
          : `Switch to "${targetLesson.titleAr}"? Your current progress will be preserved.`,
        confirmText: lang === 'ar' ? 'نعم، انتقل للدرس' : 'Yes, Switch',
        cancelText: lang === 'ar' ? 'البقاء في الدرس' : 'Stay Here',
        confirmColor: 'primary',
        onConfirm: () => switchLesson(targetLesson.id)
      });
    } else {
      switchLesson(targetLesson.id);
    }
  };

  const fmt = (sec) => {
    const safeSec = Number.isFinite(sec) && sec > 0 ? sec : 0;
    const m = Math.floor(safeSec / 60);
    const s = Math.floor(safeSec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const onMediaTimeUpdate = (sec) => {
    const next = Math.max(0, Math.floor(sec));
    setCurrentTime(next);
    if (activeLessonId) {
      localStorage.setItem(`mtfq_pos_${activeLessonId}`, next.toString());
    }
  };

  const onMediaLoadedMetadata = (durationSec) => {
    if (!Number.isFinite(durationSec) || durationSec <= 0 || !activeLessonId) return;
    const rounded = Math.round(durationSec);
    setLiveLessonsMap((prev) => {
      const existing = prev[activeLessonId];
      if (!existing) return prev;
      return {
        ...prev,
        [activeLessonId]: {
          ...existing,
          durationSec: rounded,
          durationFmt: fmt(rounded),
        },
      };
    });
  };

  const seekTo = (sec) => {
    const maxDur = lesson.durationSec > 0 ? lesson.durationSec : sec;
    const target = Math.max(0, Math.min(maxDur, sec));
    setCurrentTime(target);
    if (mediaElRef.current && Number.isFinite(target)) {
      try {
        mediaElRef.current.currentTime = target;
      } catch {}
    }
    if (activeLessonId) {
      localStorage.setItem(`mtfq_pos_${activeLessonId}`, target.toString());
    }
  };

  const seekBy = (sec) => seekTo(currentTime + sec);

  // Complete / Uncomplete
  const handleCompleteButtonClick = () => {
    if (!isCompleted) {
      triggerConfirm({
        title: lang === 'ar' ? 'تأكيد إكمال الحصة' : 'Confirm Lesson Completion',
        message: lang === 'ar'
          ? 'هل أنت متأكد من تحديد هذه الحصة كمكتملة؟ سيتم منحك +50 XP وتحديث نسبة تقدمك العامة في المنهج.'
          : 'Are you sure you want to mark this lesson as completed? You will receive +50 XP.',
        confirmText: lang === 'ar' ? 'نعم، أتممت الحصة' : 'Yes, Complete',
        confirmColor: 'emerald',
        onConfirm: async () => {
          const nextStatuses = { ...lessonStatuses, [activeLessonId]: true };
          setLessonStatuses(nextStatuses);
          localStorage.setItem('mtfq_lesson_statuses', JSON.stringify(nextStatuses));
          if (activeLessonId && activeLessonId.length > 8) {
            try {
              await studentApi.lessons.recordProgress(activeLessonId, {
                watched_seconds: Math.max(currentTime, lesson.durationSec || 60),
                is_completed: true,
              });
            } catch {}
          }
          try {
            confetti({
              particleCount: 85,
              spread: 75,
              origin: { y: 0.6 }
            });
          } catch (e) {}
          setShowCelebrationModal(true);
        }
      });
    } else {
      triggerConfirm({
        title: lang === 'ar' ? 'إلغاء إتمام الحصة' : 'Revert Completion',
        message: lang === 'ar'
          ? 'هل تريد إرجاع حالة الحصة إلى "قيد المذاكرة"؟ لن يتم حذف أي من ملاحظاتك أو إجاباتك.'
          : 'Do you want to revert this lesson status to in-progress?',
        confirmText: lang === 'ar' ? 'نعم، إلغاء الإتمام' : 'Yes, Revert',
        confirmColor: 'amber',
        onConfirm: async () => {
          const nextStatuses = { ...lessonStatuses, [activeLessonId]: false };
          setLessonStatuses(nextStatuses);
          localStorage.setItem('mtfq_lesson_statuses', JSON.stringify(nextStatuses));
          if (activeLessonId && activeLessonId.length > 8) {
            try {
              await studentApi.lessons.recordProgress(activeLessonId, {
                watched_seconds: currentTime,
                is_completed: false,
              });
            } catch {}
          }
        }
      });
    }
  };

  // Bookmark
  const handleBookmarkClick = () => {
    triggerConfirm({
      title: isBookmarked
        ? (lang === 'ar' ? 'إلغاء حفظ الحصة' : 'Remove Bookmark')
        : (lang === 'ar' ? 'تأكيد حفظ الحصة' : 'Bookmark Lesson'),
      message: isBookmarked
        ? (lang === 'ar' ? 'هل تريد إزالة هذه الحصة من قائمة المحفوظات للمراجعة السريعة؟' : 'Remove from bookmarked lessons?')
        : (lang === 'ar' ? 'هل تريد إضافة هذه الحصة إلى قائمة المحفوظات للرجوع إليها قبل الامتحانات؟' : 'Bookmark this lesson for quick revision?'),
      confirmText: isBookmarked ? (lang === 'ar' ? 'نعم، إزالة' : 'Remove') : (lang === 'ar' ? 'نعم، حفظ الحصة' : 'Bookmark'),
      confirmColor: isBookmarked ? 'amber' : 'emerald',
      onConfirm: async () => {
        const next = !isBookmarked;
        setIsBookmarked(next);
        localStorage.setItem(`mtfq_bm_${activeLessonId}`, next.toString());
        if (activeLessonId && activeLessonId.length > 8) {
          try {
            await studentApi.lessons.toggleBookmark(activeLessonId);
          } catch {}
        }
      }
    });
  };

  // Real file download / open
  const handleDL = (item) => {
    if (!item) return;
    setDlId(item.id);
    if (item.url) {
      try {
        const a = document.createElement('a');
        a.href = item.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        if (item.titleAr) a.download = item.titleAr;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      }
    }
    setTimeout(() => {
      setDlId(null);
      setDlToast(lang === 'ar' ? `تم فتح تحميل "${item.titleAr || 'الملف'}"` : `Opened "${item.titleAr || 'File'}"`);
      setTimeout(() => setDlToast(null), 3000);
    }, 500);
  };

  // Notes
  const handleAddNote = async () => {
    if (!noteInput.trim()) return;
    const text = noteInput.trim();
    setNoteInput('');
    if (activeLessonId && activeLessonId.length > 8) {
      try {
        const res = await studentApi.lessons.createNote(activeLessonId, {
          timestamp_seconds: currentTime,
          content: text,
        });
        const created = res?.data;
        if (created) {
          setNotes(prev => [{
            id: created.id,
            ts: fmt(created.timestampSeconds || currentTime),
            sec: Number(created.timestampSeconds || currentTime),
            text: created.content || text,
            date: lang === 'ar' ? 'الآن' : 'Just now'
          }, ...prev]);
          return;
        }
      } catch {}
    }
    const newN = {
      id: `n_${Date.now()}`,
      ts: fmt(currentTime),
      sec: currentTime,
      text,
      date: lang === 'ar' ? 'الآن' : 'Just now'
    };
    setNotes(prev => [newN, ...prev]);
  };

  const handleDeleteNote = (note) => {
    triggerConfirm({
      title: lang === 'ar' ? 'تأكيد حذف الملاحظة' : 'Delete Note',
      message: lang === 'ar' ? `هل أنت متأكد من حذف هذه الملاحظة المسجلة عند [${note.ts}]؟` : 'Are you sure you want to delete this note?',
      confirmText: lang === 'ar' ? 'نعم، احذفها' : 'Delete',
      confirmColor: 'red',
      onConfirm: async () => {
        if (note.id && String(note.id).length > 8) {
          try {
            await studentApi.lessons.deleteNote(note.id);
          } catch {}
        }
        setNotes(prev => prev.filter(n => n.id !== note.id));
      }
    });
  };

  // Toggle concept mastered
  const toggleConceptMastered = (cid) => {
    setMasteredConcepts(prev => ({
      ...prev,
      [cid]: !prev[cid]
    }));
  };

  // Heartbeat progress sync to backend every 15s while playing
  useEffect(() => {
    if (!isPlaying || !activeLessonId || activeLessonId.length <= 8) return;
    const hb = setInterval(() => {
      studentApi.lessons.recordProgress(activeLessonId, {
        position_seconds: Math.floor(currentTime),
        watched_delta_seconds: 15,
        duration_seconds: Math.max(60, lesson.durationSec || 1800),
      }).catch(() => {});
    }, 15000);
    return () => clearInterval(hb);
  }, [isPlaying, activeLessonId, currentTime, lesson.durationSec]);

  return {
    loadingLesson,
    courseInfo: liveCourseInfo,
    lesson,
    playlist,
    completedCount,
    courseCompletionPct,
    currentCh,
    progress,
    remainingSec,
    activeLessonId,
    mobilePlaylistOpen,
    setMobilePlaylistOpen,
    mediaMode,
    setMediaMode,
    isPlaying,
    setIsPlaying,
    currentTime,
    seekTo,
    seekBy,
    speed,
    setSpeed,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    isPlayerFS,
    setIsPlayerFS,
    isLandscape,
    setIsLandscape,
    isCompleted,
    isBookmarked,
    showCelebrationModal,
    setShowCelebrationModal,
    lessonChecklist,
    toggleChecklistItem,
    confirmDialog,
    setConfirmDialog,
    triggerConfirm,
    handleConfirmAction,
    activeTab,
    setActiveTab,
    mobileSubpage,
    setMobileSubpage,
    roadmapViewMode,
    setRoadmapViewMode,
    isKMFS,
    setIsKMFS,
    expandedConcept,
    setExpandedConcept,
    masteredConcepts,
    toggleConceptMastered,
    selectedGraphNode,
    setSelectedGraphNode,
    graphNodes: liveGraphNodes,
    graphEdges: liveGraphEdges,
    transcriptSearch,
    setTranscriptSearch,
    transcriptSegments: liveTranscript,
    notes,
    noteInput,
    setNoteInput,
    handleAddNote,
    handleDeleteNote,
    questions: QUESTIONS_LIST,
    savedQ,
    setSavedQ,
    revealedA,
    setRevealedA,
    attachments: liveAttachments,
    whiteboardImages: liveWhiteboardImages,
    dlId,
    dlToast,
    handleDL,
    handlePlaylistLessonClick,
    handleCompleteButtonClick,
    handleBookmarkClick,
    fmt,
    playerRef,
    mediaElRef,
    onMediaTimeUpdate,
    onMediaLoadedMetadata,
    kmRef
  };
};
