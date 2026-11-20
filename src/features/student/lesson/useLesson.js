import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { studentApi } from '../../../services/studentApi';
import { useAuth } from '../../../context/AuthContext';
import { COURSE_INFO } from './lessonData';
import {
  formatSeconds,
  readScopedJson,
  writeScopedJson,
} from './lessonUtils';

const DEFAULT_CHECKLIST = {
  watchVideo: false,
  reviewNotes: false,
  solveQuestions: false,
  completeMaterials: false,
};

export const useLesson = (lang) => {
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const userScope = currentUser?.id ? String(currentUser.id) : 'guest';

  const playerRef = useRef(null);
  const mediaElRef = useRef(null);
  const kmRef = useRef(null);
  const toastTimerRef = useRef(null);

  // Refs for stable 15-second heartbeat & throttled localStorage writes (zero interval thrashing!)
  const currentTimeRef = useRef(0);
  const durationRef = useRef(1800);
  const lastStorageSaveRef = useRef(0);
  const pendingResumeSecRef = useRef(null);
  const activeCourseIdRef = useRef('');
  const loadedCourseIdRef = useRef('');

  const [loadingLesson, setLoadingLesson] = useState(true);
  const [switchingLesson, setSwitchingLesson] = useState(false);
  const [lessonError, setLessonError] = useState(null);

  const [liveCourseInfo, setLiveCourseInfo] = useState(COURSE_INFO);
  const [liveLessonsMap, setLiveLessonsMap] = useState({});
  const [lessonOrder, setLessonOrder] = useState([]);
  const [lessonStatuses, setLessonStatuses] = useState({});

  const [liveTranscript, setLiveTranscript] = useState([]);
  const [liveGraphNodes, setLiveGraphNodes] = useState([]);
  const [liveGraphEdges, setLiveGraphEdges] = useState([]);
  const [graphCanvas, setGraphCanvas] = useState({ width: 1120, height: 360 });
  const [liveAttachments, setLiveAttachments] = useState([]);
  const [liveWhiteboardImages, setLiveWhiteboardImages] = useState([]);
  const [liveRelatedExams, setLiveRelatedExams] = useState([]);
  const [liveQuestions, setLiveQuestions] = useState([]);

  const [activeLessonId, setActiveLessonId] = useState(() => {
    try {
      const stored = sessionStorage.getItem('mtfq_target_lesson');
      if (stored) {
        sessionStorage.removeItem('mtfq_target_lesson');
        return stored;
      }
    } catch {
      // ignore
    }
    return '';
  });

  // UI & Media State
  const [mobilePlaylistOpen, setMobilePlaylistOpen] = useState(false);
  const [mediaMode, setMediaMode] = useState('video');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [embedSeekSec, setEmbedSeekSec] = useState(0);
  const [embedSeekNonce, setEmbedSeekNonce] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayerFS, setIsPlayerFS] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isTogglingComplete, setIsTogglingComplete] = useState(false);
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [lastEarnedXp, setLastEarnedXp] = useState(0);

  const [lessonChecklist, setLessonChecklist] = useState(DEFAULT_CHECKLIST);
  const [masteredConcepts, setMasteredConcepts] = useState({});
  const [savedQ, setSavedQ] = useState({});
  const [revealedA, setRevealedA] = useState({});

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    confirmColor: 'emerald',
    action: null,
  });

  const [activeTab, setActiveTab] = useState('notes');
  const [mobileSubpage, setMobileSubpage] = useState(null);
  const [roadmapViewMode, setRoadmapViewMode] = useState('cards');
  const [isKMFS, setIsKMFS] = useState(false);
  const [expandedConcept, setExpandedConcept] = useState(null);
  const [selectedGraphNode, setSelectedGraphNode] = useState('');
  const [transcriptSearch, setTranscriptSearch] = useState('');

  // Notes state
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Download & Feedback Toast
  const [dlId, setDlId] = useState(null);
  const [dlToast, setDlToast] = useState(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  const showToast = useCallback((message, durationMs = 3000) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setDlToast(message);
    toastTimerRef.current = window.setTimeout(() => {
      setDlToast(null);
      toastTimerRef.current = null;
    }, durationMs);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Derived active lesson object
  const lesson = useMemo(() => {
    return (
      liveLessonsMap[activeLessonId] || {
        id: activeLessonId || '',
        titleAr: '',
        titleEn: '',
        descAr: '',
        durationSec: 0,
        durationFmt: '00:00',
        time: '',
        videoUrl: '',
        embedUrl: '',
        isYoutube: false,
        mediaMode: 'video',
        completed: false,
        chapters: [],
        watermark: null,
      }
    );
  }, [liveLessonsMap, activeLessonId]);

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    if (lesson.durationSec > 0) {
      durationRef.current = lesson.durationSec;
    }
  }, [lesson.durationSec]);

  // Helper to hydrate per-lesson persisted checklist / mastered concepts / saved questions
  const hydrateScopedPreferences = useCallback(
    (lessonId) => {
      if (!lessonId) return;
      setLessonChecklist(
        readScopedJson(`mtfq_chk_${userScope}_${lessonId}`, { ...DEFAULT_CHECKLIST })
      );
      setMasteredConcepts(
        readScopedJson(`mtfq_mastered_${userScope}_${lessonId}`, {})
      );
      setSavedQ(
        readScopedJson(`mtfq_savedq_${userScope}_${lessonId}`, {})
      );
      setRevealedA({});
      setTranscriptSearch('');
    },
    [userScope]
  );

  // Apply server lesson payload cleanly into state
  const applyLessonPayload = useCallback(
    (targetId, ld, fallbackTeacherName = '') => {
      const durationSec = Math.max(10, Number(ld.durationSeconds || 1800));
      durationRef.current = durationSec;

      const normalizedChapters = Array.isArray(ld.chapters)
        ? ld.chapters.map((c, idx) => ({
            id: c.id || `ch-${idx + 1}`,
            order: Number(c.order || idx + 1),
            titleAr: c.titleAr || '',
            titleEn: c.titleEn || c.titleAr || '',
            startSec: Math.max(0, Number(c.startSeconds ?? 0)),
            endSec: Math.max(1, Number(c.endSeconds ?? durationSec)),
            startTime: c.startTime || formatSeconds(Number(c.startSeconds ?? 0)),
            duration: c.duration || '',
            keyTerms: Array.isArray(c.keyTerms) ? c.keyTerms : [],
            descAr: c.descAr || '',
          }))
        : [];

      setLiveLessonsMap((prev) => ({
        ...prev,
        [targetId]: {
          ...(prev[targetId] || {}),
          id: targetId,
          titleAr: ld.titleAr || prev[targetId]?.titleAr || '',
          titleEn: ld.titleEn || ld.titleAr || prev[targetId]?.titleEn || '',
          descAr: ld.descAr || '',
          durationSec,
          durationFmt: ld.durationLabel || formatSeconds(durationSec),
          time: ld.durationLabel || formatSeconds(durationSec),
          videoUrl: ld.mediaUrl || ld.embedUrl || '',
          embedUrl: ld.embedUrl || '',
          isYoutube: Boolean(ld.isYoutube),
          mediaMode: ld.mediaMode || 'video',
          hasMedia: Boolean(ld.mediaUrl || ld.embedUrl),
          chapters: normalizedChapters,
          watermark: ld.watermark || null,
        },
      }));

      setExpandedConcept(normalizedChapters[0]?.id ?? null);
      setLiveAttachments(Array.isArray(ld.attachments) ? ld.attachments : []);
      setLiveWhiteboardImages(
        Array.isArray(ld.whiteboardImages) ? ld.whiteboardImages : []
      );
      setMediaMode(ld.mediaMode === 'audio' ? 'audio' : 'video');

      const teacherName = ld.course?.teacherName || fallbackTeacherName || '';
      setLiveTranscript(
        Array.isArray(ld.transcript)
          ? ld.transcript.map((t, i) => ({
              id: t.id || `seg-${i}`,
              startSec: Math.max(0, Number(t.startSeconds ?? 0)),
              endSec: Math.max(1, Number(t.endSeconds ?? durationSec)),
              speaker: t.speaker || teacherName,
              text: t.textAr || '',
              textEn: t.textEn || t.textAr || '',
            }))
          : []
      );

      if (ld.conceptGraph && Array.isArray(ld.conceptGraph.nodes)) {
        setLiveGraphNodes(ld.conceptGraph.nodes);
        setLiveGraphEdges(
          Array.isArray(ld.conceptGraph.edges) ? ld.conceptGraph.edges : []
        );
        setGraphCanvas({
          width: Number(ld.conceptGraph.canvasWidth || 1120),
          height: Number(ld.conceptGraph.canvasHeight || 360),
        });
        setSelectedGraphNode(ld.conceptGraph.nodes[0]?.id || '');
      } else {
        setLiveGraphNodes([]);
        setLiveGraphEdges([]);
        setSelectedGraphNode('');
      }

      setLiveRelatedExams(Array.isArray(ld.relatedExams) ? ld.relatedExams : []);
      setLiveQuestions(
        Array.isArray(ld.practiceQuestions) ? ld.practiceQuestions : []
      );

      if (ld.course) {
        setLiveCourseInfo((prev) => ({
          ...prev,
          id: ld.course.id || prev.id,
          titleAr: ld.course.titleAr || prev.titleAr,
          titleEn: ld.course.titleEn || ld.course.titleAr || prev.titleEn,
          subjectAr: ld.course.subjectAr || ld.course.titleAr || prev.subjectAr,
          gradeAr: ld.course.gradeAr || prev.gradeAr,
          teacherAr: ld.course.teacherName || prev.teacherAr,
          teacherImg: ld.course.teacherAvatar || prev.teacherImg,
        }));
      }

      const serverNotes = Array.isArray(ld.notes)
        ? ld.notes.map((n) => ({
            id: n.id,
            ts: formatSeconds(Number(n.timestampSeconds || 0)),
            sec: Number(n.timestampSeconds || 0),
            text: n.content,
            date: (n.createdAt || '').slice(0, 10),
          }))
        : [];
      setNotes(serverNotes);

      const savedPos = readScopedJson(`mtfq_pos_${userScope}_${targetId}`, 0);
      const serverPos = Number(
        ld.progress?.maxPositionSeconds || ld.progress?.watchedSeconds || 0
      );
      const resumePos = Math.min(
        Math.max(0, durationSec - 5),
        Math.max(Number(savedPos) || 0, serverPos)
      );

      currentTimeRef.current = resumePos;
      pendingResumeSecRef.current = resumePos;
      setCurrentTime(resumePos);
      setEmbedSeekSec(0);

      const serverCompleted = Boolean(ld.progress?.isCompleted);
      setIsBookmarked(Boolean(ld.progress?.isBookmarked));
      setLessonStatuses((prev) => ({ ...prev, [targetId]: serverCompleted }));

      hydrateScopedPreferences(targetId);

      // Auto-sync watchVideo / reviewNotes milestones with authoritative DB state
      if (serverCompleted || (ld.progress?.progressPercent ?? 0) >= 90 || serverNotes.length > 0) {
        setLessonChecklist((prev) => {
          const next = {
            ...prev,
            watchVideo: prev.watchVideo || serverCompleted || (ld.progress?.progressPercent ?? 0) >= 90,
            reviewNotes: prev.reviewNotes || serverNotes.length > 0,
          };
          writeScopedJson(`mtfq_chk_${userScope}_${targetId}`, next);
          return next;
        });
      }
    },
    [userScope, hydrateScopedPreferences]
  );

  // Hydrate course playlist from API
  const applyCourseData = useCallback((courseData) => {
    const cid = courseData.id || '';
    activeCourseIdRef.current = cid;
    loadedCourseIdRef.current = cid;

    setLiveCourseInfo({
      id: cid,
      titleAr: courseData.titleAr || '',
      titleEn: courseData.titleEn || courseData.titleAr || '',
      subjectAr: courseData.subjectAr || courseData.titleAr || courseData.gradeAr || '',
      subjectEn: courseData.titleEn || courseData.subjectAr || '',
      gradeAr: courseData.gradeAr || '',
      teacherAr: courseData.teacherName || '',
      teacherImg: courseData.teacherAvatar || '',
      summaryPdf: '',
    });

    const rawLessons = Array.isArray(courseData.lessons) ? courseData.lessons : [];
    const map = {};
    const statusMap = {};
    const orderedIds = [];

    rawLessons.forEach((l) => {
      const dur = Math.max(10, Number(l.durationSeconds || 1800));
      orderedIds.push(l.id);
      map[l.id] = {
        id: l.id,
        titleAr: l.titleAr,
        titleEn: l.titleEn || l.titleAr,
        descAr: l.descAr || '',
        durationSec: dur,
        durationFmt: l.durationLabel || formatSeconds(dur),
        time: l.durationLabel || formatSeconds(dur),
        videoUrl: '',
        embedUrl: '',
        isYoutube: false,
        mediaMode: l.mediaMode || 'video',
        hasMedia: Boolean(l.hasMedia),
        completed: Boolean(l.isCompleted),
        chapters: [],
        watermark: null,
      };
      statusMap[l.id] = Boolean(l.isCompleted);
    });

    setLiveLessonsMap(map);
    setLessonOrder(orderedIds);
    setLessonStatuses(statusMap);

    return { rawLessons, map };
  }, []);

  // Load lesson workspace when URL params (?id=... & ?courseId=...) change
  const paramLessonId = searchParams.get('id') || searchParams.get('lessonId') || '';
  const paramCourseId = searchParams.get('courseId') || '';

  useEffect(() => {
    let mounted = true;

    const loadWorkspace = async () => {
      setLessonError(null);
      const isSameLoadedCourse =
        Boolean(loadedCourseIdRef.current) &&
        (!paramCourseId || paramCourseId === loadedCourseIdRef.current);

      if (isSameLoadedCourse && paramLessonId && liveLessonsMap[paramLessonId]) {
        // Fast lesson switch within already-loaded course
        setSwitchingLesson(true);
        setActiveLessonId(paramLessonId);
        setIsPlaying(false);
        try {
          const res = await studentApi.lessons.get(paramLessonId);
          if (mounted && res?.data) {
            applyLessonPayload(paramLessonId, res.data, liveCourseInfo.teacherAr || '');
          }
        } catch (err) {
          if (mounted) {
            setLessonError(
              err?.message ||
                (lang === 'ar' ? 'تعذر تحميل بيانات الحصة.' : 'Failed to load lesson.')
            );
          }
        } finally {
          if (mounted) setSwitchingLesson(false);
        }
        return;
      }

      setLoadingLesson(true);
      try {
        const directTargetId = paramLessonId || activeLessonId;

        // 1. If opened directly with a lesson UUID (even without courseId), fetch that lesson FIRST
        if (directTargetId && directTargetId.length > 8) {
          try {
            const lessonRes = await studentApi.lessons.get(directTargetId);
            const ld = lessonRes?.data;
            if (!mounted) return;
            if (ld) {
              const ownerCourseId = ld.courseId || paramCourseId;
              if (ownerCourseId) {
                try {
                  const courseRes = await studentApi.courses.get(ownerCourseId);
                  if (mounted && courseRes?.data) {
                    applyCourseData(courseRes.data);
                  }
                } catch {
                  // Still render the single lesson cleanly if playlist fetch fails
                  setLessonOrder([directTargetId]);
                }
              } else {
                setLessonOrder([directTargetId]);
              }
              setActiveLessonId(directTargetId);
              applyLessonPayload(directTargetId, ld, ld.course?.teacherName || '');
              return;
            }
          } catch {
            // Fall back to course catalog discovery if target lesson id is invalid
          }
        }

        // 2. Otherwise discover the student's accessible course & first playable lesson
        const coursesRes = await studentApi.courses.list();
        const courses = Array.isArray(coursesRes?.data) ? coursesRes.data : [];
        if (!mounted || courses.length === 0) {
          return;
        }

        const chosenCourse =
          (paramCourseId && courses.find((c) => c.id === paramCourseId)) ||
          courses.find((c) => c.isEnrolled) ||
          courses[0];

        const courseDetailRes = await studentApi.courses.get(chosenCourse.id);
        const courseData = courseDetailRes?.data || {};
        if (!mounted) return;

        const { rawLessons, map } = applyCourseData(courseData);
        if (rawLessons.length === 0) return;

        const firstPlayable = rawLessons.find((l) => l.hasMedia) || rawLessons[0];
        const targetId =
          directTargetId && map[directTargetId] ? directTargetId : firstPlayable.id;

        setActiveLessonId(targetId);
        const lessonRes = await studentApi.lessons.get(targetId);
        if (mounted && lessonRes?.data) {
          applyLessonPayload(targetId, lessonRes.data, courseData.teacherName || '');
        }
      } catch (err) {
        if (mounted) {
          setLessonError(
            err?.message ||
              (lang === 'ar'
                ? 'تعذر تحميل محتوى الحصة، يرجى المحاولة مرة أخرى.'
                : 'Failed to load lesson workspace.')
          );
        }
      } finally {
        if (mounted) {
          setLoadingLesson(false);
          setSwitchingLesson(false);
        }
      }
    };

    loadWorkspace();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramLessonId, paramCourseId, reloadNonce]);

  // Sync playbackRate, volume, mute, and audio play/pause state on owned mediaElRef
  useEffect(() => {
    const el = mediaElRef.current;
    if (!el) return;
    el.playbackRate = speed || 1;
    el.volume = isMuted ? 0 : (volume ?? 0.85);
    el.muted = Boolean(isMuted);
    if (el.tagName === 'AUDIO') {
      if (isPlaying && el.paused) {
        el.play().catch(() => {});
      } else if (!isPlaying && !el.paused) {
        el.pause();
      }
    }
  }, [isPlaying, speed, volume, isMuted, mediaMode, activeLessonId]);

  // Body scroll lock for mobile subpage
  useEffect(() => {
    if (!mobileSubpage) return undefined;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, [mobileSubpage]);

  // Flush playback progress heartbeat reliably (every 15s while playing + on pause)
  const sendProgressHeartbeat = useCallback(
    (deltaSeconds = 15) => {
      if (!activeLessonId || activeLessonId.length <= 8) return;
      const pos = Math.max(0, Math.floor(currentTimeRef.current));
      const dur = Math.max(10, Math.round(durationRef.current || 1800));
      studentApi.lessons
        .recordProgress(activeLessonId, {
          position_seconds: pos,
          watched_delta_seconds: Math.max(1, Math.min(60, Math.round(deltaSeconds))),
          duration_seconds: dur,
        })
        .then((res) => {
          const data = res?.data;
          if (!data) return;
          if (data.isCompleted) {
            setLessonStatuses((prev) =>
              prev[activeLessonId] ? prev : { ...prev, [activeLessonId]: true }
            );
            setLessonChecklist((prev) => {
              if (prev.watchVideo) return prev;
              const next = { ...prev, watchVideo: true };
              writeScopedJson(`mtfq_chk_${userScope}_${activeLessonId}`, next);
              return next;
            });
          }
        })
        .catch(() => {});
    },
    [activeLessonId, userScope]
  );

  // FIXED 15s Heartbeat — NO currentTime in dependency array, so it actually fires every 15s!
  useEffect(() => {
    if (!isPlaying || !activeLessonId || activeLessonId.length <= 8) return undefined;
    const hb = window.setInterval(() => {
      sendProgressHeartbeat(15);
    }, 15000);
    return () => {
      window.clearInterval(hb);
    };
  }, [isPlaying, activeLessonId, sendProgressHeartbeat]);

  const isCompleted = Boolean(lessonStatuses[activeLessonId]);

  const toggleChecklistItem = useCallback(
    (key) => {
      setLessonChecklist((prev) => {
        const next = { ...prev, [key]: !prev[key] };
        if (activeLessonId) {
          writeScopedJson(`mtfq_chk_${userScope}_${activeLessonId}`, next);
        }
        return next;
      });
    },
    [activeLessonId, userScope]
  );

  const toggleConceptMastered = useCallback(
    (cid) => {
      setMasteredConcepts((prev) => {
        const next = { ...prev, [cid]: !prev[cid] };
        if (activeLessonId) {
          writeScopedJson(`mtfq_mastered_${userScope}_${activeLessonId}`, next);
        }
        return next;
      });
    },
    [activeLessonId, userScope]
  );

  const toggleSavedQuestion = useCallback(
    (qid) => {
      setSavedQ((prev) => {
        const next = { ...prev, [qid]: !prev[qid] };
        if (activeLessonId) {
          writeScopedJson(`mtfq_savedq_${userScope}_${activeLessonId}`, next);
        }
        return next;
      });
    },
    [activeLessonId, userScope]
  );

  const triggerConfirm = useCallback(
    ({ title, message, confirmText, cancelText, confirmColor, onConfirm }) => {
      setConfirmDialog({
        open: true,
        title,
        message,
        confirmText: confirmText || (lang === 'ar' ? 'تأكيد' : 'Confirm'),
        cancelText: cancelText || (lang === 'ar' ? 'إلغاء' : 'Cancel'),
        confirmColor: confirmColor || 'emerald',
        action: onConfirm,
      });
    },
    [lang]
  );

  const handleConfirmAction = useCallback(() => {
    if (confirmDialog.action) {
      confirmDialog.action();
    }
    setConfirmDialog((p) => ({ ...p, open: false }));
  }, [confirmDialog]);

  // Memoized ordered playlist + Prev / Next helpers
  const playlist = useMemo(() => {
    const keys = lessonOrder.length > 0 ? lessonOrder : Object.keys(liveLessonsMap);
    return keys
      .filter((key) => Boolean(liveLessonsMap[key]))
      .map((key) => ({
        id: key,
        titleAr: liveLessonsMap[key].titleAr,
        titleEn: liveLessonsMap[key].titleEn || liveLessonsMap[key].titleAr,
        time: liveLessonsMap[key].time,
        mediaMode: liveLessonsMap[key].mediaMode || 'video',
        hasMedia: Boolean(liveLessonsMap[key].hasMedia),
        completed: Boolean(lessonStatuses[key]),
        active: key === activeLessonId,
      }));
  }, [lessonOrder, liveLessonsMap, lessonStatuses, activeLessonId]);

  const activePlaylistIdx = useMemo(
    () => playlist.findIndex((item) => item.id === activeLessonId),
    [playlist, activeLessonId]
  );
  const prevLesson = activePlaylistIdx > 0 ? playlist[activePlaylistIdx - 1] : null;
  const nextLesson =
    activePlaylistIdx >= 0 && activePlaylistIdx < playlist.length - 1
      ? playlist[activePlaylistIdx + 1]
      : null;

  const completedCount = useMemo(
    () => playlist.filter((l) => l.completed).length,
    [playlist]
  );
  const courseCompletionPct =
    playlist.length > 0 ? Math.round((completedCount / playlist.length) * 100) : 0;

  const currentCh = useMemo(() => {
    const list = lesson.chapters || [];
    if (list.length === 0) return null;
    return (
      list.find((c) => currentTime >= c.startSec && currentTime < c.endSec) || list[0]
    );
  }, [lesson.chapters, currentTime]);

  const progress = useMemo(() => {
    if (lesson.durationSec <= 0) return '0.0';
    return Math.min(100, Math.max(0, (currentTime / lesson.durationSec) * 100)).toFixed(1);
  }, [currentTime, lesson.durationSec]);

  const remainingSec = Math.max(0, (lesson.durationSec || 0) - currentTime);

  // Switch lesson cleanly and sync URL search params
  const switchLesson = useCallback(
    (lid) => {
      if (!lid || lid === activeLessonId) return;
      if (isPlaying) {
        sendProgressHeartbeat(5);
      }
      setIsPlaying(false);
      setMobilePlaylistOpen(false);
      setMobileSubpage(null);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('id', lid);
      if (activeCourseIdRef.current) {
        nextParams.set('courseId', activeCourseIdRef.current);
      }
      setSearchParams(nextParams, { replace: false });
    },
    [activeLessonId, isPlaying, sendProgressHeartbeat, searchParams, setSearchParams]
  );

  const handlePlaylistLessonClick = useCallback(
    (targetLesson) => {
      if (!targetLesson || targetLesson.id === activeLessonId) return;
      if (isPlaying) {
        triggerConfirm({
          title: lang === 'ar' ? 'الانتقال إلى درس آخر' : 'Switch Lesson',
          message:
            lang === 'ar'
              ? `أنت تذاكر حالياً "${lesson.titleAr}". هل تريد الانتقال إلى "${targetLesson.titleAr}" وحفظ موضع توقفك الحالي؟`
              : `Switch to "${targetLesson.titleAr}"? Your current progress will be preserved.`,
          confirmText: lang === 'ar' ? 'نعم، انتقل للدرس' : 'Yes, Switch',
          cancelText: lang === 'ar' ? 'البقاء في الدرس' : 'Stay Here',
          confirmColor: 'primary',
          onConfirm: () => switchLesson(targetLesson.id),
        });
      } else {
        switchLesson(targetLesson.id);
      }
    },
    [activeLessonId, isPlaying, lesson.titleAr, lang, triggerConfirm, switchLesson]
  );

  // Media time update (throttled localStorage writes every 5 seconds)
  const onMediaTimeUpdate = useCallback(
    (sec) => {
      const next = Math.max(0, Math.floor(sec));
      currentTimeRef.current = next;
      setCurrentTime((prev) => (prev === next ? prev : next));

      const now = Date.now();
      if (activeLessonId && now - lastStorageSaveRef.current >= 5000) {
        lastStorageSaveRef.current = now;
        writeScopedJson(`mtfq_pos_${userScope}_${activeLessonId}`, next);
      }
    },
    [activeLessonId, userScope]
  );

  // Restore saved resume timestamp when <video> / <audio> loads metadata
  const onMediaLoadedMetadata = useCallback(
    (durationSec) => {
      if (Number.isFinite(durationSec) && durationSec > 0 && activeLessonId) {
        const rounded = Math.round(durationSec);
        durationRef.current = rounded;
        setLiveLessonsMap((prev) => {
          const existing = prev[activeLessonId];
          if (!existing || existing.durationSec === rounded) return prev;
          return {
            ...prev,
            [activeLessonId]: {
              ...existing,
              durationSec: rounded,
              durationFmt: formatSeconds(rounded),
            },
          };
        });
      }

      const resumeTarget = pendingResumeSecRef.current;
      if (
        resumeTarget !== null &&
        resumeTarget > 2 &&
        mediaElRef.current &&
        Number.isFinite(durationSec) &&
        resumeTarget < durationSec - 3
      ) {
        try {
          mediaElRef.current.currentTime = resumeTarget;
        } catch {
          // ignore
        }
      }
      pendingResumeSecRef.current = null;
    },
    [activeLessonId]
  );

  // Preserve exact position when toggling between Video and Audio modes
  const handleSetMediaMode = useCallback((nextMode) => {
    pendingResumeSecRef.current = currentTimeRef.current;
    setMediaMode(nextMode);
  }, []);

  const seekTo = useCallback(
    (sec) => {
      const maxDur = durationRef.current > 0 ? durationRef.current : sec;
      const target = Math.max(0, Math.min(maxDur, Math.floor(sec)));
      currentTimeRef.current = target;
      setCurrentTime(target);
      if (mediaElRef.current && Number.isFinite(target)) {
        try {
          mediaElRef.current.currentTime = target;
        } catch {
          // ignore
        }
      } else {
        // Jump embedded YouTube / Vimeo player cleanly
        setEmbedSeekSec(target);
        setEmbedSeekNonce((n) => n + 1);
      }
      if (activeLessonId) {
        writeScopedJson(`mtfq_pos_${userScope}_${activeLessonId}`, target);
      }
    },
    [activeLessonId, userScope]
  );

  const seekBy = useCallback((delta) => {
    seekTo(currentTimeRef.current + delta);
  }, [seekTo]);

  // Complete / Uncomplete (Real backend persistence via /toggle-complete!)
  const handleCompleteButtonClick = useCallback(() => {
    if (!activeLessonId || isTogglingComplete) return;
    if (!isCompleted) {
      triggerConfirm({
        title: lang === 'ar' ? 'تأكيد إكمال الحصة' : 'Confirm Lesson Completion',
        message:
          lang === 'ar'
            ? 'هل أنت متأكد من تحديد هذه الحصة كمكتملة؟ سيتم حفظ تقدمك ومنحك +25 XP عند الإتمام لأول مرة.'
            : 'Mark this lesson as completed? You will earn +25 XP on first completion.',
        confirmText: lang === 'ar' ? 'نعم، أتممت الحصة' : 'Yes, Complete',
        confirmColor: 'emerald',
        onConfirm: async () => {
          setIsTogglingComplete(true);
          try {
            const res = await studentApi.lessons.toggleComplete(activeLessonId, true);
            const data = res?.data;
            const xp = Number(data?.xpAwarded ?? 0);
            setLastEarnedXp(xp);
            setLessonStatuses((prev) => ({ ...prev, [activeLessonId]: true }));
            setLessonChecklist((prev) => {
              const next = { ...prev, watchVideo: true };
              writeScopedJson(`mtfq_chk_${userScope}_${activeLessonId}`, next);
              return next;
            });
            try {
              confetti({ particleCount: 85, spread: 75, origin: { y: 0.6 } });
            } catch {
              // ignore
            }
            setShowCelebrationModal(true);
          } catch (err) {
            showToast(
              err?.message ||
                (lang === 'ar' ? 'تعذر تسجيل إتمام الحصة.' : 'Failed to complete lesson.')
            );
          } finally {
            setIsTogglingComplete(false);
          }
        },
      });
    } else {
      triggerConfirm({
        title: lang === 'ar' ? 'إلغاء إتمام الحصة' : 'Revert Completion',
        message:
          lang === 'ar'
            ? 'هل تريد إرجاع حالة الحصة إلى "قيد المذاكرة"؟ لن يتم حذف أي من ملاحظاتك.'
            : 'Revert this lesson status back to in-progress?',
        confirmText: lang === 'ar' ? 'نعم، إلغاء الإتمام' : 'Yes, Revert',
        confirmColor: 'amber',
        onConfirm: async () => {
          setIsTogglingComplete(true);
          try {
            await studentApi.lessons.toggleComplete(activeLessonId, false);
            setLessonStatuses((prev) => ({ ...prev, [activeLessonId]: false }));
            showToast(
              lang === 'ar'
                ? 'تم إرجاع الحصة إلى قيد المذاكرة.'
                : 'Lesson reverted to in-progress.'
            );
          } catch (err) {
            showToast(
              err?.message ||
                (lang === 'ar' ? 'تعذر تحديث حالة الحصة.' : 'Failed to update lesson status.')
            );
          } finally {
            setIsTogglingComplete(false);
          }
        },
      });
    }
  }, [activeLessonId, isCompleted, isTogglingComplete, lang, triggerConfirm, userScope, showToast]);

  // Bookmark (Real backend sync with optimistic rollback!)
  const handleBookmarkClick = useCallback(() => {
    if (!activeLessonId || isTogglingBookmark) return;
    triggerConfirm({
      title: isBookmarked
        ? lang === 'ar'
          ? 'إلغاء حفظ الحصة'
          : 'Remove Bookmark'
        : lang === 'ar'
          ? 'تأكيد حفظ الحصة'
          : 'Bookmark Lesson',
      message: isBookmarked
        ? lang === 'ar'
          ? 'هل تريد إزالة هذه الحصة من قائمة المحفوظات للمراجعة السريعة؟'
          : 'Remove from bookmarked lessons?'
        : lang === 'ar'
          ? 'هل تريد إضافة هذه الحصة إلى قائمة المحفوظات للرجوع إليها قبل الامتحانات؟'
          : 'Bookmark this lesson for quick revision?',
      confirmText: isBookmarked
        ? lang === 'ar'
          ? 'نعم، إزالة'
          : 'Remove'
        : lang === 'ar'
          ? 'نعم، حفظ الحصة'
          : 'Bookmark',
      confirmColor: isBookmarked ? 'amber' : 'emerald',
      onConfirm: async () => {
        const previous = isBookmarked;
        setIsTogglingBookmark(true);
        setIsBookmarked(!previous);
        try {
          const res = await studentApi.lessons.toggleBookmark(activeLessonId);
          const nextState = Boolean(res?.data?.isBookmarked ?? !previous);
          setIsBookmarked(nextState);
          showToast(
            nextState
              ? lang === 'ar'
                ? 'تمت إضافة الحصة إلى المحفوظات بنجاح.'
                : 'Lesson bookmarked.'
              : lang === 'ar'
                ? 'تمت إزالة الحصة من المحفوظات.'
                : 'Bookmark removed.'
          );
        } catch (err) {
          setIsBookmarked(previous);
          showToast(
            err?.message ||
              (lang === 'ar' ? 'تعذر تحديث المفضلة.' : 'Failed to update bookmark.')
          );
        } finally {
          setIsTogglingBookmark(false);
        }
      },
    });
  }, [activeLessonId, isBookmarked, isTogglingBookmark, lang, triggerConfirm, showToast]);

  // Real file download using dedicated signed downloadUrl (Content-Disposition: attachment)
  const handleDL = useCallback(
    (item) => {
      if (!item) return;
      const targetUrl = item.downloadUrl || item.url;
      setDlId(item.id);
      if (targetUrl) {
        try {
          const a = document.createElement('a');
          a.href = targetUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          if (item.titleAr) a.download = item.titleAr;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
      }
      if (activeLessonId) {
        setLessonChecklist((prev) => {
          if (prev.completeMaterials) return prev;
          const next = { ...prev, completeMaterials: true };
          writeScopedJson(`mtfq_chk_${userScope}_${activeLessonId}`, next);
          return next;
        });
      }
      window.setTimeout(() => {
        setDlId(null);
        showToast(
          lang === 'ar'
            ? `تم بدء تحميل "${item.titleAr || 'الملف'}"`
            : `Downloading "${item.titleAr || 'File'}"`
        );
      }, 400);
    },
    [activeLessonId, userScope, lang, showToast]
  );

  // Notes full CRUD (Create, Update, Delete — strictly backend-backed!)
  const handleAddNote = useCallback(async () => {
    const text = noteInput.trim();
    if (!text || !activeLessonId || isSavingNote) return;
    setIsSavingNote(true);
    try {
      const tsSec = Math.floor(currentTimeRef.current);
      const res = await studentApi.lessons.createNote(activeLessonId, {
        timestamp_seconds: tsSec,
        content: text,
      });
      const created = res?.data;
      if (created) {
        setNotes((prev) => [
          {
            id: created.id,
            ts: formatSeconds(Number(created.timestampSeconds ?? tsSec)),
            sec: Number(created.timestampSeconds ?? tsSec),
            text: created.content || text,
            date: (created.createdAt || '').slice(0, 10) || (lang === 'ar' ? 'الآن' : 'Just now'),
          },
          ...prev,
        ]);
        setNoteInput('');
        setLessonChecklist((prev) => {
          if (prev.reviewNotes) return prev;
          const next = { ...prev, reviewNotes: true };
          writeScopedJson(`mtfq_chk_${userScope}_${activeLessonId}`, next);
          return next;
        });
        showToast(lang === 'ar' ? 'تم حفظ الملاحظة بنجاح.' : 'Note saved.');
      }
    } catch (err) {
      showToast(
        err?.message ||
          (lang === 'ar' ? 'تعذر حفظ الملاحظة.' : 'Failed to save note.')
      );
    } finally {
      setIsSavingNote(false);
    }
  }, [noteInput, activeLessonId, isSavingNote, lang, userScope, showToast]);

  const handleUpdateNote = useCallback(
    async (noteId, newContent) => {
      const text = String(newContent || '').trim();
      if (!text || !noteId) return false;
      try {
        const res = await studentApi.lessons.updateNote(noteId, { content: text });
        const updated = res?.data;
        setNotes((prev) =>
          prev.map((n) =>
            n.id === noteId
              ? {
                  ...n,
                  text: updated?.content || text,
                  ts: formatSeconds(Number(updated?.timestampSeconds ?? n.sec)),
                  sec: Number(updated?.timestampSeconds ?? n.sec),
                }
              : n
          )
        );
        showToast(lang === 'ar' ? 'تم تحديث الملاحظة بنجاح.' : 'Note updated.');
        return true;
      } catch (err) {
        showToast(
          err?.message ||
            (lang === 'ar' ? 'تعذر تحديث الملاحظة.' : 'Failed to update note.')
        );
        return false;
      }
    },
    [lang, showToast]
  );

  const handleDeleteNote = useCallback(
    (note) => {
      triggerConfirm({
        title: lang === 'ar' ? 'تأكيد حذف الملاحظة' : 'Delete Note',
        message:
          lang === 'ar'
            ? `هل أنت متأكد من حذف هذه الملاحظة المسجلة عند [${note.ts}]؟`
            : 'Are you sure you want to delete this note?',
        confirmText: lang === 'ar' ? 'نعم، احذفها' : 'Delete',
        confirmColor: 'red',
        onConfirm: async () => {
          try {
            await studentApi.lessons.deleteNote(note.id);
            setNotes((prev) => prev.filter((n) => n.id !== note.id));
            showToast(lang === 'ar' ? 'تم حذف الملاحظة.' : 'Note deleted.');
          } catch (err) {
            showToast(
              err?.message ||
                (lang === 'ar' ? 'تعذر حذف الملاحظة.' : 'Failed to delete note.')
            );
          }
        },
      });
    },
    [lang, triggerConfirm, showToast]
  );

  const retryLoad = useCallback(() => {
    loadedCourseIdRef.current = '';
    setReloadNonce((n) => n + 1);
  }, []);

  return {
    loadingLesson,
    switchingLesson,
    lessonError,
    retryLoad,
    courseInfo: liveCourseInfo,
    lesson,
    playlist,
    prevLesson,
    nextLesson,
    switchLesson,
    completedCount,
    courseCompletionPct,
    currentCh,
    progress,
    remainingSec,
    activeLessonId,
    mobilePlaylistOpen,
    setMobilePlaylistOpen,
    mediaMode,
    setMediaMode: handleSetMediaMode,
    isPlaying,
    setIsPlaying,
    currentTime,
    embedSeekSec,
    embedSeekNonce,
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
    isTogglingComplete,
    isBookmarked,
    isTogglingBookmark,
    showCelebrationModal,
    setShowCelebrationModal,
    lastEarnedXp,
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
    graphCanvas,
    transcriptSearch,
    setTranscriptSearch,
    transcriptSegments: liveTranscript,
    notes,
    noteInput,
    setNoteInput,
    isSavingNote,
    handleAddNote,
    handleUpdateNote,
    handleDeleteNote,
    relatedExams: liveRelatedExams,
    questions: liveQuestions,
    savedQ,
    toggleSavedQuestion,
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
    fmt: formatSeconds,
    playerRef,
    mediaElRef,
    onMediaTimeUpdate,
    onMediaLoadedMetadata,
    kmRef,
  };
};
