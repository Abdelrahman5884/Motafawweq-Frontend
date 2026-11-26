import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { teacherApi } from '../../services/teacherApi';
import { MAX_STORAGE_FILE_SIZE_BYTES } from '../../services/storageService';
import {
  Radio,
  Mic,
  UploadCloud,
  Video,
  Sparkles,
  CheckCircle2,
  FileText,
  Share2,
  Clock,
  Check,
  Lock,
  Crown,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  StudioLessonConfigCard,
  LiveMicRecorder,
  AudioFileUploader,
  VideoLessonUploader,
  LessonAttachmentsManager,
  RecentStudioLessonsCard,
} from '../../features/teacher/studio';

function formatTimer(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function extractMediaDurationSeconds(file) {
  return new Promise((resolve) => {
    if (!(file instanceof File || file instanceof Blob)) {
      resolve(0);
      return;
    }
    const isVideo =
      file.type?.startsWith('video/') || /\.(mp4|webm|mov|ogv|mkv|avi)$/i.test(file.name || '');
    const el = document.createElement(isVideo ? 'video' : 'audio');
    const objectUrl = URL.createObjectURL(file);
    let settled = false;

    const cleanup = (val) => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(objectUrl);
      el.removeAttribute('src');
      resolve(val);
    };

    const timer = setTimeout(() => cleanup(0), 6000);
    el.preload = 'metadata';
    el.onloadedmetadata = () => {
      clearTimeout(timer);
      const dur = Number.isFinite(el.duration) && el.duration > 0 ? Math.round(el.duration) : 0;
      cleanup(dur);
    };
    el.onerror = () => {
      clearTimeout(timer);
      cleanup(0);
    };
    el.src = objectUrl;
  });
}

export const RecordingStudio = () => {
  const { navigate, teacherPlanTier, teacherPlanQuotas } = useAuth();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  // Media mode: 'mic' | 'audio' | 'video'
  const [mode, setMode] = useState('mic');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [uploadedAudioFile, setUploadedAudioFile] = useState(null);
  const [recordedMicFile, setRecordedMicFile] = useState(null);
  const [videoData, setVideoData] = useState(null);

  // AI Output Modules Selection (Pro only)
  const [aiFeatures, setAiFeatures] = useState(() => {
    try {
      const saved = sessionStorage.getItem('selectedAIFeatures');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage errors
    }
    return {
      speechToText: true,
      conceptGraph: true,
      chapterIndexing: true,
    };
  });

  const [fetchedPlanTier, setFetchedPlanTier] = useState(null);
  const [lessonsMeta, setLessonsMeta] = useState(() => ({
    maxLessons: teacherPlanQuotas?.maxLessons ?? null,
    activeLessonsCount: 0,
  }));

  const effectivePlanTier = fetchedPlanTier || teacherPlanTier || 'free';
  const isProPlan = effectivePlanTier === 'pro';
  const isProAiActive = isProPlan && Object.values(aiFeatures).some(Boolean);

  // Lesson Metadata & Catalogs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [defaultSubject, setDefaultSubject] = useState('');
  const [defaultGrade, setDefaultGrade] = useState('');
  const [classGroup, setClassGroup] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [availableGroups, setAvailableGroups] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [recentLessons, setRecentLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(true);

  // Attachments
  const [lessonPdfs, setLessonPdfs] = useState([]);
  const [lessonImages, setLessonImages] = useState([]);

  // Submission & Feedback state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [studioError, setStudioError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef(null);
  const draftLessonUuidRef = useRef(null);

  const showToast = useCallback((msg) => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage('');
      toastTimerRef.current = null;
    }, 3500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Load groups, courses, settings, and recent studio lessons on mount
  useEffect(() => {
    let mounted = true;
    const params = new URLSearchParams(window.location.search);
    const courseFromQuery = params.get('courseId') || '';

    Promise.allSettled([
      teacherApi.groups.list(),
      teacherApi.courses.list(),
      teacherApi.settings.get(),
      teacherApi.studio.listLessons(),
    ]).then(([groupsRes, coursesRes, settingsRes, lessonsRes]) => {
      if (!mounted) return;

      if (groupsRes.status === 'fulfilled' && Array.isArray(groupsRes.value?.data)) {
        const grps = groupsRes.value.data;
        setAvailableGroups(grps);
        if (grps.length > 0) {
          setClassGroup((prev) => prev || grps[0].code || grps[0].uuid || grps[0].id || '');
        }
      }

      if (coursesRes.status === 'fulfilled' && Array.isArray(coursesRes.value?.data)) {
        const crses = coursesRes.value.data;
        setAvailableCourses(crses);
        if (courseFromQuery) {
          setSelectedCourseId(courseFromQuery);
        } else if (crses.length > 0) {
          setSelectedCourseId((prev) => prev || crses[0].uuid || crses[0].id || '');
        }
      }

      if (settingsRes.status === 'fulfilled' && settingsRes.value?.data) {
        const s = settingsRes.value.data;
        if (s.planTier) setFetchedPlanTier(s.planTier);
        if (s.subjectAr || s.subjectEn) {
          setDefaultSubject(s.subjectAr || s.subjectEn);
        }
        const catalog = Array.isArray(s.stagesCatalog) ? s.stagesCatalog : [];
        const taught = Array.isArray(s.stagesTaught) ? s.stagesTaught : [];
        const firstStage = taught[0]
          ? catalog.find((c) => c.id === taught[0] || c.nameAr === taught[0] || c.nameEn === taught[0])?.nameAr || taught[0]
          : catalog[0]?.nameAr || '';
        if (firstStage) setDefaultGrade(firstStage);
      }

      if (lessonsRes.status === 'fulfilled' && Array.isArray(lessonsRes.value?.data)) {
        const list = lessonsRes.value.data;
        setRecentLessons(list);
        if (lessonsRes.value?.meta) {
          setLessonsMeta({
            maxLessons: lessonsRes.value.meta.maxLessons ?? null,
            activeLessonsCount: Number(lessonsRes.value.meta.activeLessonsCount ?? list.length),
          });
          if (lessonsRes.value.meta.planTier) {
            setFetchedPlanTier(lessonsRes.value.meta.planTier);
          }
        }
      }
      setLoadingLessons(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Derive active subject & grade from selected course (falling back to teacher profile)
  const selectedCourse = useMemo(
    () => availableCourses.find((c) => (c.uuid || c.id) === selectedCourseId) || null,
    [availableCourses, selectedCourseId]
  );

  const effectiveSubject = selectedCourse?.subjectAr || selectedCourse?.subject || defaultSubject || '';
  const effectiveGrade = selectedCourse?.gradeAr || selectedCourse?.grade || defaultGrade || '';

  const effectiveMaxLessons = lessonsMeta.maxLessons !== undefined ? lessonsMeta.maxLessons : (teacherPlanQuotas?.maxLessons ?? null);
  const currentLessonsCount = recentLessons.length;
  const isLessonQuotaReached = effectiveMaxLessons !== null && currentLessonsCount >= effectiveMaxLessons;

  // Live recording timer
  useEffect(() => {
    if (!isRecording || isPaused) return undefined;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const handleToggleAIFeature = (key) => {
    if (!isProPlan) return;
    setAiFeatures((prev) => {
      const count = Object.values(prev).filter(Boolean).length;
      if (prev[key] && count <= 1) return prev;
      const next = { ...prev, [key]: !prev[key] };
      try {
        sessionStorage.setItem('selectedAIFeatures', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const uploadAttachmentsSequentially = async (lessonUuid) => {
    const failedNames = [];
    const totalAttachments = lessonPdfs.filter((p) => p.fileObj).length + lessonImages.filter((i) => i.fileObj).length;
    if (totalAttachments === 0) return failedNames;

    let completed = 0;

    // Upload PDFs sequentially to preserve order and accurate progress
    for (const pdf of lessonPdfs) {
      if (!pdf.fileObj) continue;
      setUploadStatusText(
        isAr
          ? `جاري رفع ملزمة PDF (${completed + 1} من ${totalAttachments})...`
          : `Uploading PDF (${completed + 1} of ${totalAttachments})...`
      );
      try {
        await teacherApi.studio.uploadPdf(lessonUuid, pdf.fileObj, pdf.title || pdf.fileName, null);
      } catch {
        failedNames.push(pdf.fileName);
      }
      completed += 1;
      setUploadProgress(Math.min(99, 75 + Math.round((completed / totalAttachments) * 24)));
    }

    // Upload whiteboard images sequentially with explicit order so #1, #2, #3 stay exact
    for (let idx = 0; idx < lessonImages.length; idx += 1) {
      const img = lessonImages[idx];
      if (!img.fileObj) continue;
      setUploadStatusText(
        isAr
          ? `جاري رفع صورة السبورة #${idx + 1} (${completed + 1} من ${totalAttachments})...`
          : `Uploading whiteboard #${idx + 1} (${completed + 1} of ${totalAttachments})...`
      );
      try {
        await teacherApi.studio.uploadImage(lessonUuid, img.fileObj, {
          titleAr: img.title || img.fileName,
          captionAr: img.caption || '',
          order: idx + 1,
        });
      } catch {
        failedNames.push(img.fileName);
      }
      completed += 1;
      setUploadProgress(Math.min(99, 75 + Math.round((completed / totalAttachments) * 24)));
    }

    return failedNames;
  };

  const submitLessonAndUpload = async ({
    mediaMode,
    mediaFile = null,
    embedUrl = '',
    isYoutube = false,
    durationSeconds = 0,
    defaultTitle,
  }) => {
    if (isSubmitting) return;
    setStudioError('');

    if (isLessonQuotaReached && !draftLessonUuidRef.current) {
      setStudioError(
        isAr
          ? `لقد وصلت للحد الأقصى للحصص في الباقة المجانية (${effectiveMaxLessons} حصص). اشترك في باقة المعلم بلس (120 ج.م/شهر) لرفع حصص غير محدودة.`
          : `You reached the Free plan lesson limit (${effectiveMaxLessons} lessons). Subscribe to Teacher Plus (120 EGP/mo) for unlimited lessons.`
      );
      return;
    }

    const resolvedTitle = title.trim() || defaultTitle;
    if (resolvedTitle.length < 3) {
      setStudioError(
        isAr
          ? 'يرجى إدخال عنوان الحصة (3 أحرف على الأقل).'
          : 'Please enter a lesson title (at least 3 characters).'
      );
      return;
    }

    if (mediaFile && mediaFile.size > MAX_STORAGE_FILE_SIZE_BYTES) {
      setStudioError(
        isAr
          ? 'حجم ملف الوسائط يتجاوز 50 ميجابايت (الحد الأقصى للتخزين السحابي).'
          : 'Media file exceeds the 50 MB cloud upload limit.'
      );
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(5);
    setUploadStatusText(isAr ? 'جاري حفظ بيانات الحصة...' : 'Saving lesson metadata...');

    const effectiveAiFeatures = isProPlan
      ? aiFeatures
      : { speechToText: false, conceptGraph: false, chapterIndexing: false };

    try {
      sessionStorage.setItem('selectedAIFeatures', JSON.stringify(effectiveAiFeatures));
    } catch {
      // ignore
    }

    let finalLessonUuid = null;

    try {
      let resolvedDurationSeconds = Number(durationSeconds) > 0 ? Math.round(Number(durationSeconds)) : 0;
      if (mediaFile && resolvedDurationSeconds === 0) {
        const extracted = await extractMediaDurationSeconds(mediaFile);
        if (extracted > 0) resolvedDurationSeconds = extracted;
      }

      const lessonPayload = {
        title_ar: resolvedTitle,
        description_ar: description.trim(),
        subject_ar: effectiveSubject || undefined,
        grade_ar: effectiveGrade || undefined,
        course_uuid: selectedCourseId || undefined,
        target_group_code: classGroup || undefined,
        media_mode: mediaMode,
        embed_url: embedUrl || undefined,
        is_youtube: isYoutube,
        duration_seconds: resolvedDurationSeconds,
        ai_features_requested: effectiveAiFeatures,
      };

      // Reuse draft lesson UUID if retrying after an interrupted upload (prevents duplicate orphan lessons)
      let lessonUuid = draftLessonUuidRef.current;
      if (lessonUuid) {
        await teacherApi.studio.updateLesson(lessonUuid, lessonPayload);
      } else {
        const res = await teacherApi.studio.createLesson(lessonPayload);
        lessonUuid = res?.data?.uuid || res?.data?.id;
        if (!lessonUuid) {
          throw new Error(isAr ? 'تعذر إنشاء الحصة على الخادم.' : 'Failed to create lesson on server.');
        }
        draftLessonUuidRef.current = lessonUuid;
      }

      setUploadProgress(20);
      sessionStorage.setItem('currentLessonUuid', lessonUuid);

      // Step 2: Upload Media to Supabase S3 (Direct Presigned PUT with server-to-Supabase fallback)
      if (mediaFile) {
        setUploadStatusText(isAr ? 'جاري رفع ملف الحصة إلى السحابة (0%)...' : 'Uploading media to cloud (0%)...');
        try {
          await teacherApi.studio.uploadMediaDirect(lessonUuid, mediaFile, {
            durationSeconds: resolvedDurationSeconds,
            onProgress: (pct) => {
              setUploadProgress(20 + Math.round((pct / 100) * 55));
              setUploadStatusText(
                isAr
                  ? `جاري رفع ملف الحصة إلى السحابة (${pct}%)...`
                  : `Uploading media to cloud (${pct}%)...`
              );
            },
          });
        } catch {
          setUploadStatusText(isAr ? 'جاري رفع ملف الحصة عبر الخادم...' : 'Uploading media via server...');
          await teacherApi.studio.uploadMedia(lessonUuid, mediaFile, {
            mode: mediaMode,
            duration_seconds: resolvedDurationSeconds,
            onProgress: (pct) => {
              setUploadProgress(20 + Math.round((pct / 100) * 55));
              setUploadStatusText(
                isAr
                  ? `جاري رفع ملف الحصة عبر الخادم (${pct}%)...`
                  : `Uploading media via server (${pct}%)...`
              );
            },
          });
        }
      }

      setUploadProgress(75);

      // Step 3: Upload PDFs & Ordered Whiteboard Images
      const failedAttachments = await uploadAttachmentsSequentially(lessonUuid);
      if (failedAttachments.length > 0) {
        throw new Error(
          isAr
            ? `تم حفظ الحصة ولكن تعذر رفع المرفقات التالية: ${failedAttachments.join('، ')}. يمكنك المحاولة مجدداً.`
            : `Lesson saved, but failed to upload: ${failedAttachments.join(', ')}.`
        );
      }

      setUploadProgress(100);
      draftLessonUuidRef.current = null;
      finalLessonUuid = lessonUuid;
    } catch (err) {
      setStudioError(
        err?.message || (isAr ? 'حدث خطأ أثناء رفع وحفظ الحصة. يرجى المحاولة مرة أخرى.' : 'Failed to upload lesson. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
      setUploadStatusText('');
      setUploadProgress(0);

      if (finalLessonUuid) {
        const hasAudioOrVideo = Boolean(mediaFile || embedUrl);
        const target = isProAiActive && hasAudioOrVideo
          ? `/teacher/processing?lesson=${encodeURIComponent(finalLessonUuid)}`
          : `/teacher/workspace?lesson=${encodeURIComponent(finalLessonUuid)}`;
        navigate(target);
      }
    }
  };

  const handleFinalSubmitAll = async () => {
    setStudioError('');
    if (isRecording) {
      setStudioError(
        isAr
          ? 'يرجى إيقاف التسجيل الصوتي أولاً قبل حفظ ونشر الحصة.'
          : 'Please stop the live microphone recording before publishing.'
      );
      return;
    }

    const audioUploadRaw = uploadedAudioFile?.rawFile || null;
    const videoFile = videoData?.type === 'file' ? videoData.file : null;
    const rawUrl = videoData?.type === 'url' ? videoData.url || '' : '';
    const safeEmbedUrl = rawUrl.startsWith('https://') ? rawUrl : '';

    let mediaMode = 'audio';
    let mediaFile = null;
    let durationSeconds = 0;

    if (mode === 'video' && (videoFile || safeEmbedUrl)) {
      mediaMode = safeEmbedUrl ? 'embed' : 'video';
      mediaFile = videoFile;
      durationSeconds = videoData?.durationSeconds || 0;
    } else if (mode === 'audio' && audioUploadRaw) {
      mediaMode = 'audio';
      mediaFile = audioUploadRaw;
    } else if (recordedMicFile) {
      mediaMode = 'audio';
      mediaFile = recordedMicFile;
      durationSeconds = elapsedSeconds || 0;
    } else if (audioUploadRaw) {
      mediaMode = 'audio';
      mediaFile = audioUploadRaw;
    } else if (videoFile || safeEmbedUrl) {
      mediaMode = safeEmbedUrl ? 'embed' : 'video';
      mediaFile = videoFile;
      durationSeconds = videoData?.durationSeconds || 0;
    }

    await submitLessonAndUpload({
      mediaMode,
      mediaFile,
      embedUrl: safeEmbedUrl,
      isYoutube: Boolean(videoData?.isYoutube),
      durationSeconds,
      defaultTitle: isAr ? 'حصة دراسية جديدة' : 'New Lesson',
    });
  };

  const handleAudioStartProcessing = async () => {
    const audioFile = uploadedAudioFile?.rawFile || null;
    await submitLessonAndUpload({
      mediaMode: 'audio',
      mediaFile: audioFile,
      durationSeconds: 0,
      defaultTitle: isAr ? 'حصة صوتية جديدة' : 'New Audio Lesson',
    });
  };

  const handleVideoStartProcessing = async (vidData) => {
    const current = vidData || videoData;
    const videoFile = current?.type === 'file' ? current.file : null;
    const rawUrl = current?.type === 'url' ? current.url || '' : '';
    const safeEmbedUrl = rawUrl.startsWith('https://') ? rawUrl : '';

    await submitLessonAndUpload({
      mediaMode: safeEmbedUrl ? 'embed' : 'video',
      mediaFile: videoFile,
      embedUrl: safeEmbedUrl,
      isYoutube: Boolean(current?.isYoutube),
      durationSeconds: current?.durationSeconds || 0,
      defaultTitle: isAr ? 'حصة فيديو جديدة' : 'New Video Lesson',
    });
  };

  const handleDeleteRecentLesson = async (lessonId) => {
    setStudioError('');
    try {
      await teacherApi.studio.deleteLesson(lessonId);
      setRecentLessons((prev) => prev.filter((l) => (l.id || l.uuid) !== lessonId));
      showToast(isAr ? 'تم حذف الحصة بنجاح.' : 'Lesson deleted successfully.');
    } catch (err) {
      setStudioError(err?.message || (isAr ? 'تعذر حذف الحصة.' : 'Failed to delete lesson.'));
    }
  };

  return (
    <div
      style={{
        maxWidth: '1260px',
        margin: '0 auto',
        padding: '28px 24px 72px',
        fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <style>{`
        @keyframes studioSpin { to { transform: rotate(360deg); } }
        .studio-spin { animation: studioSpin 0.85s linear infinite; }
      `}</style>

      {/* Inline Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: isRtl ? '24px' : 'auto',
            right: isRtl ? 'auto' : '24px',
            zIndex: 9999,
            backgroundColor: '#059669',
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
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Studio Header */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
          <Radio size={18} color="var(--primary)" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)' }}>
            {isAr ? 'استوديو التسجيل والمواد التعليمية' : 'Recording & Materials Studio'}
          </span>
          {effectiveMaxLessons !== null && (
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: '800',
                padding: '3px 10px',
                borderRadius: '999px',
                backgroundColor: isLessonQuotaReached ? 'rgba(245, 158, 11, 0.14)' : 'var(--bg-subtle)',
                color: isLessonQuotaReached ? '#D97706' : 'var(--text-secondary)',
                border: `1px solid ${isLessonQuotaReached ? 'rgba(245, 158, 11, 0.35)' : 'var(--border-subtle)'}`,
              }}
            >
              {isAr
                ? `رصيد الحصص: ${currentLessonsCount} / ${effectiveMaxLessons} حصة`
                : `Lessons Quota: ${currentLessonsCount} / ${effectiveMaxLessons}`}
            </span>
          )}
        </div>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)',
          }}
        >
          {isAr ? 'إعداد وتسجيل حصة جديدة' : 'Setup & Record New Lesson'}
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, maxWidth: '760px' }}>
          {isAr
            ? 'أدخل بيانات الحصة والمقرر، ثم سجل الصوت أو ارفع ملف صوت/فيديو وأرفق ملازم الشرح (PDF) وصور السبورة.'
            : 'Enter lesson details, then record or upload audio/video and attach PDF booklets & whiteboard photos.'}
        </p>
      </div>

      {/* Free Plan 3-Lesson Limit Banner */}
      {isLessonQuotaReached && (
        <div
          style={{
            marginBottom: '18px',
            padding: '14px 18px',
            borderRadius: '14px',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: '1.5px solid rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '800', color: '#B45309' }}>
            <Lock size={17} style={{ flexShrink: 0 }} />
            <span>
              {isAr
                ? `لقد استهلكت الحد الأقصى للباقة المجانية (${effectiveMaxLessons} حصص بدون AI). اشترك في باقة المعلم بلس (120 ج.م/شهر) لرفع عدد غير محدود من الحصص، أو باقة برو (150 ج.م/شهر) مع أدوات الذكاء الاصطناعي.`
                : `You reached the Free tier limit (${effectiveMaxLessons} lessons without AI). Subscribe to Teacher Plus (120 EGP/mo) for unlimited lessons, or Teacher Pro (150 EGP/mo) with full AI tools.`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/teacher/billing?plan=plus')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 15px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Crown size={14} />
            <span>{isAr ? 'ترقية إلى باقة المعلم بلس' : 'Upgrade to Teacher Plus'}</span>
          </button>
        </div>
      )}

      {/* Global Inline Error Banner */}
      {studioError && (
        <div
          style={{
            marginBottom: '18px',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444',
            fontSize: '13px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={17} style={{ flexShrink: 0 }} />
            <span>{studioError}</span>
          </div>
          <button
            type="button"
            onClick={() => setStudioError('')}
            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '2px', display: 'flex' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 2-Column Studio Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
          gap: '22px',
          alignItems: 'start',
        }}
      >
        {/* Column 1: Lesson Details + AI Pro Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <StudioLessonConfigCard
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            classGroup={classGroup}
            setClassGroup={setClassGroup}
            groups={availableGroups}
            courses={availableCourses}
            selectedCourseId={selectedCourseId}
            setSelectedCourseId={setSelectedCourseId}
            subject={effectiveSubject}
            grade={effectiveGrade}
            lang={lang}
            isRtl={isRtl}
          />

          {/* AI Output Modules Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '22px',
              boxShadow: 'var(--shadow-sm)',
              textAlign: isRtl ? 'right' : 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={17} color="var(--primary)" />
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  {isAr ? 'مخرجات الذكاء الاصطناعي' : 'AI Output Capabilities'}
                </h3>
                {!isProPlan && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 9px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(245, 158, 11, 0.14)',
                      color: '#D97706',
                      fontSize: '11px',
                      fontWeight: '800',
                    }}
                  >
                    <Crown size={11} />
                    <span>{isAr ? 'Pro فقط' : 'Pro Only'}</span>
                  </span>
                )}
              </div>

              {!isProPlan && (
                <button
                  type="button"
                  onClick={() => navigate('/teacher/billing?plan=pro')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    backgroundColor: '#D97706',
                    color: '#FFFFFF',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  <Lock size={12} />
                  <span>{isAr ? 'اشترك في Pro (150 ج.م/شهر)' : 'Upgrade to Pro (150 EGP/mo)'}</span>
                </button>
              )}
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 14px 0', lineHeight: 1.5 }}>
              {!isProPlan
                ? isAr
                  ? 'التفريغ النصي وخريطة المفاهيم وفهرسة الفصول متاحة لمشتركي باقة Pro فقط.'
                  : 'AI transcription, concept graph, and chapters require a Pro subscription.'
                : isAr
                  ? 'اختر التحليلات التي تريد توليدها تلقائياً بعد رفع الحصة.'
                  : 'Select AI outputs to generate automatically after upload.'}
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                opacity: isProPlan ? 1 : 0.52,
                pointerEvents: isProPlan ? 'auto' : 'none',
              }}
            >
              {[
                {
                  key: 'speechToText',
                  icon: FileText,
                  color: 'var(--primary)',
                  bg: 'var(--primary-surface)',
                  titleAr: 'التفريغ النصي (Speech-to-Text)',
                  titleEn: 'Speech-to-Text Transcript',
                  descAr: 'تحويل صوت الشرح إلى نص مقروء بدقة عالية بأي لغة (العربية، اللهجة المصرية، الإنجليزية وغيرها).',
                  descEn: 'High-accuracy multilingual ASR (Arabic, Egyptian dialect, English, French & 99+ languages).',
                },
                {
                  key: 'conceptGraph',
                  icon: Share2,
                  color: '#0EA5E9',
                  bg: 'rgba(14, 165, 233, 0.08)',
                  titleAr: 'خريطة المفاهيم (NotebookLM)',
                  titleEn: 'Interactive Concept Graph',
                  descAr: 'استخراج شجرة المفاهيم المترابطة التفاعلية.',
                  descEn: 'Interactive hierarchical knowledge tree.',
                },
                {
                  key: 'chapterIndexing',
                  icon: Clock,
                  color: '#10B981',
                  bg: 'rgba(16, 185, 129, 0.08)',
                  titleAr: 'فهرسة الفصول والتوقيتات',
                  titleEn: 'Smart Chapter Indexing',
                  descAr: 'تقسيم الحصة إلى فصول زمنية للقفز السريع.',
                  descEn: 'Automatic chapter timestamps.',
                },
              ].map((item) => {
                const Icon = item.icon;
                const active = Boolean(aiFeatures[item.key]);
                return (
                  <div
                    key={item.key}
                    onClick={() => handleToggleAIFeature(item.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-lg)',
                      border: `1.5px solid ${active ? item.color : 'var(--border-subtle)'}`,
                      backgroundColor: active ? item.bg : 'var(--bg-subtle)',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        border: `2px solid ${active ? item.color : 'var(--border-medium)'}`,
                        backgroundColor: active ? item.color : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        flexShrink: 0,
                      }}
                    >
                      {active && <Check size={13} strokeWidth={3} />}
                    </div>
                    <Icon size={16} color={item.color} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {isAr ? item.titleAr : item.titleEn}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {isAr ? item.descAr : item.descEn}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column 2: Media Recording/Upload + Attachments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Step 2: Media Input Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '22px',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', textAlign: isRtl ? 'right' : 'left' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: '800',
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {isAr ? 'تسجيل أو رفع ملف الحصة' : 'Record or Upload Lesson Media'}
              </h3>
            </div>

            {/* 3 Media Mode Tabs */}
            <div
              style={{
                display: 'inline-flex',
                backgroundColor: 'var(--bg-subtle)',
                padding: '5px',
                borderRadius: 'var(--radius-full)',
                marginBottom: '22px',
                gap: '6px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {[
                { id: 'mic', icon: Mic, labelAr: 'تسجيل بالميكروفون', labelEn: 'Live Mic' },
                { id: 'audio', icon: UploadCloud, labelAr: 'رفع ملف صوتي', labelEn: 'Upload Audio' },
                { id: 'video', icon: Video, labelAr: 'فيديو / يوتيوب', labelEn: 'Video / YouTube' },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const active = mode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setMode(tab.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '8px 15px',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      backgroundColor: active ? 'var(--primary)' : 'transparent',
                      color: active ? '#FFFFFF' : 'var(--text-secondary)',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    <TabIcon size={15} />
                    <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {mode === 'mic' && (
              <LiveMicRecorder
                isRecording={isRecording}
                isPaused={isPaused}
                elapsedSeconds={elapsedSeconds}
                formatTime={formatTimer}
                lang={lang}
                recordedFile={recordedMicFile}
                onStartRecording={() => {
                  setIsRecording(true);
                  setIsPaused(false);
                }}
                onPauseRecording={() => setIsPaused((p) => !p)}
                onResetTimer={() => setElapsedSeconds(0)}
                onRecordedFileReady={(file) => {
                  setIsRecording(false);
                  setIsPaused(false);
                  setRecordedMicFile(file || null);
                }}
              />
            )}

            {mode === 'audio' && (
              <AudioFileUploader
                uploadedFile={uploadedAudioFile}
                lang={lang}
                isProAiActive={isProAiActive}
                isSubmitting={isSubmitting}
                onSelectFile={setUploadedAudioFile}
                onStartProcessing={handleAudioStartProcessing}
              />
            )}

            {mode === 'video' && (
              <VideoLessonUploader
                videoData={videoData}
                setVideoData={setVideoData}
                lang={lang}
                isRtl={isRtl}
                isProAiActive={isProAiActive}
                isSubmitting={isSubmitting}
                onStartProcessing={handleVideoStartProcessing}
              />
            )}
          </div>

          {/* Step 3: Lesson Attachments Manager */}
          <LessonAttachmentsManager
            pdfs={lessonPdfs}
            setPdfs={setLessonPdfs}
            images={lessonImages}
            setImages={setLessonImages}
            lang={lang}
            isRtl={isRtl}
          />
        </div>
      </div>

      {/* Unified Publish Bar */}
      <div
        style={{
          marginTop: '24px',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '18px 24px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <CheckCircle2 size={18} color="var(--primary)" />
          <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
            {title.trim() ? title.trim() : isAr ? 'حصة جديدة جاهزة للحفظ' : 'Ready to publish lesson'}
          </span>
          <span>•</span>
          <span>
            {recordedMicFile || uploadedAudioFile
              ? isAr
                ? 'ملف صوتي مرفق'
                : 'Audio ready'
              : videoData
                ? isAr
                  ? 'فيديو مرفق'
                  : 'Video ready'
                : isAr
                  ? 'بدون صوت/فيديو (مرفقات أو ملاحظات فقط)'
                  : 'Attachments / notes only'}
          </span>
          {(lessonPdfs.length > 0 || lessonImages.length > 0) && (
            <>
              <span>•</span>
              <span style={{ color: 'var(--primary)', fontWeight: '700' }}>
                {lessonPdfs.length} PDF / {lessonImages.length} {isAr ? 'صور سبورة' : 'images'}
              </span>
            </>
          )}
        </div>

        {isLessonQuotaReached ? (
          <button
            type="button"
            onClick={() => navigate('/teacher/billing?plan=plus')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid rgba(245, 158, 11, 0.45)',
              backgroundColor: 'rgba(245, 158, 11, 0.14)',
              color: '#B45309',
              fontSize: '13.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Lock size={16} />
            <span>{isAr ? 'ترقية إلى Plus لرفع المزيد من الحصص' : 'Upgrade to Plus to Upload More Lessons'}</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleFinalSubmitAll}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 26px',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '800',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 18px rgba(21, 136, 199, 0.35)',
              opacity: isSubmitting ? 0.72 : 1,
            }}
          >
            {isSubmitting ? <Loader2 size={17} className="studio-spin" /> : <CheckCircle2 size={17} />}
            <span>{isAr ? 'حفظ ونشر الحصة ومرفقاتها' : 'Save & Publish Lesson'}</span>
          </button>
        )}
      </div>

      {/* Live Recent Studio Lessons */}
      <RecentStudioLessonsCard
        lessons={recentLessons}
        isLoading={loadingLessons}
        lang={lang}
        isRtl={isRtl}
        onOpenWorkspace={(lessonId) =>
          navigate(lessonId ? `/teacher/workspace?lesson=${encodeURIComponent(lessonId)}` : '/teacher/workspace')
        }
        onDeleteLesson={handleDeleteRecentLesson}
      />

      {/* Real Progress Uploading Overlay */}
      {isSubmitting && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.58)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px 34px',
              textAlign: 'center',
              maxWidth: '400px',
              width: '100%',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <Loader2 size={36} color="var(--primary)" className="studio-spin" style={{ margin: '0 auto 14px' }} />
            <div style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {uploadStatusText || (isAr ? 'جاري رفع ملفات الحصة...' : 'Uploading lesson files...')}
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {isAr ? 'يرجى الانتظار حتى يكتمل الرفع إلى الخادم السحابي.' : 'Please wait until cloud upload completes.'}
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '999px',
                backgroundColor: 'var(--bg-subtle)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.max(6, uploadProgress)}%`,
                  height: '100%',
                  backgroundColor: 'var(--primary)',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: '800', color: 'var(--primary)' }}>
              {uploadProgress}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordingStudio;
