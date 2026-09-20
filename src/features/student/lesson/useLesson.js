import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  COURSE_INFO,
  LESSONS_DATABASE,
  GRAPH_NODES,
  GRAPH_EDGES,
  INITIAL_NOTES,
  QUESTIONS_LIST,
  ATTACHMENTS_LIST,
  TRANSCRIPT_SEGMENTS
} from './lessonData';

export const useLesson = (lang) => {
  const playerRef = useRef(null);
  const kmRef = useRef(null);

  // Active Lesson State
  const [activeLessonId, setActiveLessonId] = useState('l3');
  const [lessonStatuses, setLessonStatuses] = useState(() => {
    const saved = localStorage.getItem('mtfq_lesson_statuses');
    return saved ? JSON.parse(saved) : { l1: true, l2: true, l3: false, l4: false, l5: false, l6: false };
  });

  const lesson = LESSONS_DATABASE[activeLessonId] || LESSONS_DATABASE.l3;

  // Mobile drawer state
  const [mobilePlaylistOpen, setMobilePlaylistOpen] = useState(false);

  // Media State
  const [mediaMode, setMediaMode] = useState('video');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => {
    const s = localStorage.getItem(`mtfq_pos_${activeLessonId}`);
    return s ? parseInt(s, 10) : 480;
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
    watchVideo: true,
    reviewNotes: true,
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
  const playlist = Object.keys(LESSONS_DATABASE).map(key => ({
    id: key,
    titleAr: LESSONS_DATABASE[key].titleAr,
    time: LESSONS_DATABASE[key].time,
    completed: !!lessonStatuses[key],
    active: key === activeLessonId
  }));

  const completedCount = playlist.filter(l => l.completed).length;
  const courseCompletionPct = Math.round((completedCount / playlist.length) * 100);
  const currentCh = lesson.chapters.find(c => currentTime >= c.startSec && currentTime < c.endSec) || lesson.chapters[0];
  const progress = Math.min(100, Math.max(0, ((currentTime / lesson.durationSec) * 100))).toFixed(1);
  const remainingSec = Math.max(0, lesson.durationSec - currentTime);

  // Lesson Switching with Confirmation
  const switchLesson = (lid) => {
    setActiveLessonId(lid);
    setIsPlaying(false);
    const s = localStorage.getItem(`mtfq_pos_${lid}`);
    setCurrentTime(s ? parseInt(s, 10) : 0);
    setIsBookmarked(localStorage.getItem(`mtfq_bm_${lid}`) === 'true');
    setMobilePlaylistOpen(false);
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

  // Video Time Simulation
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= lesson.durationSec) {
            setIsPlaying(false);
            if (!lessonStatuses[activeLessonId]) {
              const nextStatuses = { ...lessonStatuses, [activeLessonId]: true };
              setLessonStatuses(nextStatuses);
              localStorage.setItem('mtfq_lesson_statuses', JSON.stringify(nextStatuses));
              setShowCelebrationModal(true);
            }
            return lesson.durationSec;
          }
          const next = prev + 1;
          localStorage.setItem(`mtfq_pos_${activeLessonId}`, next.toString());
          return next;
        });
      }, 1000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, lesson.durationSec, activeLessonId, lessonStatuses]);

  const fmt = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const seekTo = (sec) => {
    const target = Math.max(0, Math.min(lesson.durationSec, sec));
    setCurrentTime(target);
    localStorage.setItem(`mtfq_pos_${activeLessonId}`, target.toString());
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
        onConfirm: () => {
          const nextStatuses = { ...lessonStatuses, [activeLessonId]: true };
          setLessonStatuses(nextStatuses);
          localStorage.setItem('mtfq_lesson_statuses', JSON.stringify(nextStatuses));
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
        onConfirm: () => {
          const nextStatuses = { ...lessonStatuses, [activeLessonId]: false };
          setLessonStatuses(nextStatuses);
          localStorage.setItem('mtfq_lesson_statuses', JSON.stringify(nextStatuses));
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
      onConfirm: () => {
        const next = !isBookmarked;
        setIsBookmarked(next);
        localStorage.setItem(`mtfq_bm_${activeLessonId}`, next.toString());
      }
    });
  };

  // Download simulation
  const handleDL = (item) => {
    setDlId(item.id);
    setTimeout(() => {
      setDlId(null);
      setDlToast(lang === 'ar' ? `تم تحميل "${item.titleAr}" بنجاح!` : `Downloaded "${item.titleAr}"!`);
      setTimeout(() => setDlToast(null), 3500);
    }, 1400);
  };

  // Notes
  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    const newN = {
      id: `n_${Date.now()}`,
      ts: fmt(currentTime),
      sec: currentTime,
      text: noteInput.trim(),
      date: lang === 'ar' ? 'الآن' : 'Just now'
    };
    setNotes(prev => [newN, ...prev]);
    setNoteInput('');
  };

  const handleDeleteNote = (note) => {
    triggerConfirm({
      title: lang === 'ar' ? 'تأكيد حذف الملاحظة' : 'Delete Note',
      message: lang === 'ar' ? `هل أنت متأكد من حذف هذه الملاحظة المسجلة عند [${note.ts}]؟` : 'Are you sure you want to delete this note?',
      confirmText: lang === 'ar' ? 'نعم، احذفها' : 'Delete',
      confirmColor: 'red',
      onConfirm: () => setNotes(prev => prev.filter(n => n.id !== note.id))
    });
  };

  // Toggle concept mastered
  const toggleConceptMastered = (cid) => {
    setMasteredConcepts(prev => ({
      ...prev,
      [cid]: !prev[cid]
    }));
  };

  return {
    courseInfo: COURSE_INFO,
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
    graphNodes: GRAPH_NODES,
    graphEdges: GRAPH_EDGES,
    transcriptSearch,
    setTranscriptSearch,
    transcriptSegments: TRANSCRIPT_SEGMENTS,
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
    attachments: ATTACHMENTS_LIST,
    dlId,
    dlToast,
    handleDL,
    handlePlaylistLessonClick,
    handleCompleteButtonClick,
    handleBookmarkClick,
    fmt,
    playerRef,
    kmRef
  };
};
