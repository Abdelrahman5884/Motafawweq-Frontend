import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { teacherApi } from '../../services/teacherApi';
import { Radio, Mic, UploadCloud, Video, Sparkles, CheckCircle2, FileText, Share2, Clock, Check, Lock, Crown, Loader2 } from 'lucide-react';
import {
  StudioLessonConfigCard,
  LiveMicRecorder,
  AudioFileUploader,
  VideoLessonUploader,
  LessonAttachmentsManager
} from '../../features/teacher/studio';

export const RecordingStudio = () => {
  const { navigate } = useAuth();
  const { lang, isRtl } = useLanguage();

  // Mode: 'mic' | 'audio' | 'video'
  const [mode, setMode] = useState('mic');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [uploadedAudioFile, setUploadedAudioFile] = useState(null);
  const [recordedMicFile, setRecordedMicFile] = useState(null);

  // Video state
  const [videoData, setVideoData] = useState(null);

  // AI Output Modules Selection state (Text, Graph, Chapters)
  const [aiFeatures, setAiFeatures] = useState(() => {
    try {
      const saved = sessionStorage.getItem('selectedAIFeatures');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      speechToText: true,
      conceptGraph: true,
      chapterIndexing: true
    };
  });

  const [planTier, setPlanTier] = useState('free');
  const isProPlan = planTier === 'pro';

  const handleToggleAIFeature = (key) => {
    if (!isProPlan) return;
    setAiFeatures(prev => {
      const count = Object.values(prev).filter(Boolean).length;
      if (prev[key] && count <= 1) return prev; // Keep at least one active
      const next = { ...prev, [key]: !prev[key] };
      try {
        sessionStorage.setItem('selectedAIFeatures', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Lesson Metadata state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Biology');
  const [grade, setGrade] = useState('3rd Secondary');
  const [classGroup, setClassGroup] = useState('');
  const [availableGroups, setAvailableGroups] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [stageOptions, setStageOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');

  // Multi-PDF attachments state
  const [lessonPdfs, setLessonPdfs] = useState([]);

  // Multi-Images attachments state (with sequential ordering)
  const [lessonImages, setLessonImages] = useState([]);

  // Fetch groups, courses, and teacher settings on mount
  useEffect(() => {
    let mounted = true;

    const params = new URLSearchParams(window.location.search);
    const courseFromQuery = params.get('courseId') || '';

    Promise.allSettled([
      teacherApi.groups.list(),
      teacherApi.courses.list(),
      teacherApi.settings.get(),
    ]).then(([groupsRes, coursesRes, settingsRes]) => {
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
        if (s.planTier) {
          setPlanTier(s.planTier);
        }
        if (s.subjectAr || s.subjectEn) {
          const val = s.subjectAr || s.subjectEn;
          setSubjectOptions([{
            value: val,
            labelAr: s.subjectAr || s.subjectEn,
            labelEn: s.subjectEn || s.subjectAr,
          }]);
          setSubject(val);
        }

        const catalog = Array.isArray(s.stagesCatalog) ? s.stagesCatalog : [];
        const taught = Array.isArray(s.stagesTaught) ? s.stagesTaught : [];
        const stageSource = taught.length > 0
          ? taught.map((item) => {
              const found = catalog.find((c) => c.id === item || c.nameAr === item || c.nameEn === item);
              return found || { id: item, nameAr: item, nameEn: item };
            })
          : catalog;

        if (stageSource.length > 0) {
          const mappedStages = stageSource.map((st) => ({
            value: st.nameAr || st.id || st.nameEn,
            labelAr: st.nameAr || st.nameEn || st.id,
            labelEn: st.nameEn || st.nameAr || st.id,
          }));
          setStageOptions(mappedStages);
          setGrade(mappedStages[0].value);
        }
      }
    });

    return () => { mounted = false; };
  }, []);

  // Timer simulation
  useEffect(() => {
    let interval;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
  };

  const handlePauseRecording = () => {
    setIsPaused(!isPaused);
  };

  const uploadLessonAttachments = async (lessonUuid) => {
    if (!lessonUuid) return;
    const tasks = [];

    lessonPdfs.forEach((p) => {
      if (p.fileObj) {
        tasks.push(
          teacherApi.studio.uploadPdf(lessonUuid, p.fileObj, p.title || p.fileName, p.pagesCount || 1)
            .catch((err) => console.warn('PDF upload failed:', err))
        );
      }
    });

    lessonImages.forEach((img, idx) => {
      if (img.fileObj) {
        tasks.push(
          teacherApi.studio.uploadImage(lessonUuid, img.fileObj, {
            titleAr: img.title || img.fileName,
            captionAr: img.caption || '',
            order: img.order || idx + 1,
          }).catch((err) => console.warn('Image upload failed:', err))
        );
      }
    });

    if (tasks.length > 0) {
      setUploadStatusText(lang === 'ar' ? 'جاري رفع المرفقات والملفات...' : 'Uploading lesson attachments...');
      await Promise.all(tasks);
    }
  };

  const submitLessonAndUpload = async ({
    mediaMode,
    mediaFile = null,
    embedUrl = '',
    isYoutube = false,
    durationSeconds = 1800,
    defaultTitle,
  }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setUploadStatusText(lang === 'ar' ? 'جاري إنشاء الحصة وحفظ البيانات...' : 'Creating lesson...');

    const effectiveAiFeatures = isProPlan
      ? aiFeatures
      : { speechToText: false, conceptGraph: false, chapterIndexing: false };

    try {
      sessionStorage.setItem('selectedAIFeatures', JSON.stringify(effectiveAiFeatures));
    } catch (e) {}

    try {
      const res = await teacherApi.studio.createLesson({
        title_ar: title || defaultTitle,
        description_ar: description || '',
        subject_ar: subject || 'الأحياء',
        grade_ar: grade || 'الصف الثالث الثانوي',
        course_uuid: selectedCourseId || undefined,
        target_group_code: classGroup,
        media_mode: mediaMode,
        embed_url: embedUrl || undefined,
        is_youtube: isYoutube,
        duration_seconds: durationSeconds,
        ai_features_requested: effectiveAiFeatures,
      });

      const lessonUuid = res?.data?.uuid || res?.data?.id;
      if (lessonUuid) {
        sessionStorage.setItem('currentLessonUuid', lessonUuid);

        if (mediaFile) {
          setUploadStatusText(lang === 'ar' ? 'جاري رفع ملف الحصة إلى السحابة...' : 'Uploading lesson media...');
          try {
            await teacherApi.studio.uploadMediaDirect(lessonUuid, mediaFile, {
              durationSeconds,
            });
          } catch (directErr) {
            console.warn('Direct Supabase media upload fallback:', directErr);
            await teacherApi.studio.uploadMedia(lessonUuid, mediaFile, {
              duration_seconds: durationSeconds,
            }).catch((fallbackErr) => console.warn('Backend media upload fallback failed:', fallbackErr));
          }
        }

        await uploadLessonAttachments(lessonUuid);
      }
    } catch (err) {
      console.warn('Backend studio lesson save fallback:', err);
    } finally {
      setIsSubmitting(false);
      setUploadStatusText('');
      const hasAnyAi = isProPlan && Object.values(effectiveAiFeatures).some(Boolean);
      navigate(hasAnyAi ? '/teacher/processing' : '/teacher/workspace');
    }
  };

  const handleFinalSubmitAll = async () => {
    if (isRecording) {
      alert(lang === 'ar' ? 'يرجى إيقاف التسجيل الصوتي أولاً قبل الحفظ والنشر.' : 'Please stop the live recording first.');
      return;
    }

    const audioUploadRaw = uploadedAudioFile?.rawFile || uploadedAudioFile?.file || (uploadedAudioFile instanceof File || uploadedAudioFile instanceof Blob ? uploadedAudioFile : null);
    const videoFile = videoData?.file || null;
    const rawUrl = videoData?.youtubeUrl || videoData?.url || '';
    const safeEmbedUrl = rawUrl.startsWith('https://') ? rawUrl : '';

    let mediaMode = 'audio';
    let mediaFile = null;
    let durationSeconds = 1800;

    if (mode === 'video' && (videoFile || safeEmbedUrl)) {
      mediaMode = safeEmbedUrl ? 'embed' : 'video';
      mediaFile = videoFile;
      durationSeconds = videoData?.durationSeconds || 2400;
    } else if (mode === 'audio' && audioUploadRaw) {
      mediaMode = 'audio';
      mediaFile = audioUploadRaw;
    } else if (recordedMicFile) {
      mediaMode = 'audio';
      mediaFile = recordedMicFile;
      durationSeconds = elapsedSeconds || 60;
    } else if (audioUploadRaw) {
      mediaMode = 'audio';
      mediaFile = audioUploadRaw;
    } else if (videoFile || safeEmbedUrl) {
      mediaMode = safeEmbedUrl ? 'embed' : 'video';
      mediaFile = videoFile;
      durationSeconds = videoData?.durationSeconds || 2400;
    }

    if (mediaFile && mediaFile.size > 52428800) {
      alert(lang === 'ar' ? 'حجم الملف يتجاوز 50 ميجابايت (الحد الأقصى للتخزين السحابي).' : 'File size exceeds 50 MB upload limit.');
      return;
    }

    await submitLessonAndUpload({
      mediaMode,
      mediaFile,
      embedUrl: safeEmbedUrl,
      isYoutube: Boolean(videoData?.youtubeUrl || videoData?.isYoutube),
      durationSeconds,
      defaultTitle: lang === 'ar' ? 'حصة دراسية جديدة' : 'New Lesson',
    });
  };

  const handleStopAndProcess = async (recordedAudioFile = null) => {
    setIsRecording(false);

    if (recordedAudioFile && recordedAudioFile.size > 52428800) {
      alert(lang === 'ar' ? 'حجم التسجيل الصوتي يتجاوز الحد الأقصى المسموح به (50 ميجابايت) في باقة التخزين السحابي. يرجى تقليل مدة التسجيل.' : 'Audio recording exceeds the 50 MB platform limit.');
      return;
    }

    await submitLessonAndUpload({
      mediaMode: 'audio',
      mediaFile: recordedAudioFile,
      durationSeconds: elapsedSeconds || 1800,
      defaultTitle: lang === 'ar' ? 'حصة بدون عنوان' : 'Untitled Lesson',
    });
  };

  const handleAudioStartProcessing = async () => {
    const audioFile = uploadedAudioFile?.rawFile || uploadedAudioFile?.file || (uploadedAudioFile instanceof File || uploadedAudioFile instanceof Blob ? uploadedAudioFile : null);
    if (audioFile && audioFile.size > 52428800) {
      alert(lang === 'ar' ? 'حجم الملف الصوتي يتجاوز 50 ميجابايت (الحد الأقصى للتخزين السحابي).' : 'Audio file exceeds 50 MB upload limit.');
      return;
    }

    await submitLessonAndUpload({
      mediaMode: 'audio',
      mediaFile: audioFile,
      durationSeconds: 1800,
      defaultTitle: lang === 'ar' ? 'حصة صوتية جديدة' : 'New Audio Lesson',
    });
  };

  const handleVideoStartProcessing = async (vidData) => {
    if (vidData) setVideoData(vidData);
    const videoFile = vidData?.file || null;
    if (videoFile && videoFile.size > 52428800) {
      alert(lang === 'ar' ? 'حجم ملف الفيديو يتجاوز 50 ميجابايت (الحد الأقصى للتخزين السحابي).' : 'Video file exceeds 50 MB upload limit.');
      return;
    }

    const rawUrl = vidData?.youtubeUrl || vidData?.url || '';
    const safeEmbedUrl = rawUrl.startsWith('https://') ? rawUrl : '';

    await submitLessonAndUpload({
      mediaMode: safeEmbedUrl ? 'embed' : 'video',
      mediaFile: videoFile,
      embedUrl: safeEmbedUrl,
      isYoutube: Boolean(vidData?.youtubeUrl),
      durationSeconds: vidData?.durationSeconds || 2400,
      defaultTitle: lang === 'ar' ? 'حصة فيديو جديدة' : 'New Video Lesson',
    });
  };

  return (
    <div style={{
      maxWidth: '1260px',
      margin: '0 auto',
      padding: '28px 24px 72px',
      fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit',
      direction: isRtl ? 'rtl' : 'ltr',
    }}>
      {/* Studio Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Radio size={18} color="var(--primary)" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)' }}>
            {lang === 'ar' ? 'استوديو التسجيل الذكي والمواد التعليمية' : 'Smart Recording & Materials Studio'}
          </span>
        </div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          margin: '0 0 6px 0',
          fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
        }}>
          {lang === 'ar' ? 'إعداد وتسجيل حصة جديدة' : 'Setup & Record New Lesson'}
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, maxWidth: '760px' }}>
          {lang === 'ar'
            ? 'أدخل بيانات الحصة والمقرر، ثم سجل الصوت أو ارفع الملف وأرفق ملازم الشرح (PDF) وصور السبورة.'
            : 'Enter lesson & course details, then record or upload media and attach PDFs & whiteboard photos.'}
        </p>
      </div>

      {/* 2-Column Clean Studio Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '22px',
        alignItems: 'start',
      }}>
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
            lang={lang}
            isRtl={isRtl}
          />

          {/* Compact AI Output Modules Selection Card */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px',
            boxShadow: 'var(--shadow-sm)',
            textAlign: isRtl ? 'right' : 'left',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={17} color="var(--primary)" />
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  {lang === 'ar' ? 'مخرجات الذكاء الاصطناعي' : 'AI Output Capabilities'}
                </h3>
                {!isProPlan && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 9px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(245, 158, 11, 0.14)',
                    color: '#D97706',
                    fontSize: '11px',
                    fontWeight: '800',
                  }}>
                    <Crown size={11} />
                    <span>{lang === 'ar' ? 'Pro فقط' : 'Pro Only'}</span>
                  </span>
                )}
              </div>

              {!isProPlan && (
                <button
                  type="button"
                  onClick={() => navigate('/teacher/billing')}
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
                  <span>{lang === 'ar' ? 'ترقية إلى Pro' : 'Upgrade to Pro'}</span>
                </button>
              )}
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 14px 0', lineHeight: 1.5 }}>
              {!isProPlan
                ? (lang === 'ar'
                    ? 'التفريغ النصي وخريطة المفاهيم وفهرسة الفصول متاحة لمشتركي باقة Pro فقط.'
                    : 'AI transcription, concept graph, and chapters require a Pro subscription.')
                : (lang === 'ar'
                    ? 'اختر التحليلات التي تريد توليدها تلقائياً بعد رفع الحصة.'
                    : 'Select AI outputs to generate automatically after upload.')}
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              opacity: isProPlan ? 1 : 0.52,
              pointerEvents: isProPlan ? 'auto' : 'none',
            }}>
              {[
                {
                  key: 'speechToText',
                  icon: FileText,
                  color: 'var(--primary)',
                  bg: 'var(--primary-surface)',
                  titleAr: 'التفريغ النصي (Speech-to-Text)',
                  titleEn: 'Speech-to-Text Transcript',
                  descAr: 'تحويل صوت الشرح إلى نص مقروء باللهجة المصرية.',
                  descEn: 'Egyptian dialect ASR transcription.',
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
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{
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
                    }}>
                      {active && <Check size={13} strokeWidth={3} />}
                    </div>
                    <Icon size={16} color={item.color} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {lang === 'ar' ? item.titleAr : item.titleEn}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {lang === 'ar' ? item.descAr : item.descEn}
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
          {/* Media Input Card */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'center',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '18px',
              textAlign: isRtl ? 'right' : 'left',
            }}>
              <div style={{
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
              }}>
                2
              </div>
              <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'تسجيل أو رفع ملف الحصة' : 'Record or Upload Lesson Media'}
              </h3>
            </div>

            {/* Toggle Mode Pills: 3 Modes */}
            <div style={{
              display: 'inline-flex',
              backgroundColor: 'var(--bg-subtle)',
              padding: '5px',
              borderRadius: 'var(--radius-full)',
              marginBottom: '24px',
              gap: '6px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <button
                type="button"
                onClick={() => setMode('mic')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: mode === 'mic' ? 'var(--primary)' : 'transparent',
                  color: mode === 'mic' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                <Mic size={15} />
                <span>{lang === 'ar' ? 'تسجيل بالميكروفون' : 'Live Mic'}</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('audio')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: mode === 'audio' ? 'var(--primary)' : 'transparent',
                  color: mode === 'audio' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                <UploadCloud size={15} />
                <span>{lang === 'ar' ? 'رفع ملف صوتي' : 'Upload Audio'}</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('video')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: mode === 'video' ? 'var(--primary)' : 'transparent',
                  color: mode === 'video' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                <Video size={15} />
                <span>{lang === 'ar' ? 'فيديو / يوتيوب' : 'Video / YouTube'}</span>
              </button>
            </div>

            {mode === 'mic' && (
              <LiveMicRecorder
                isRecording={isRecording}
                isPaused={isPaused}
                elapsedSeconds={elapsedSeconds}
                formatTime={formatTime}
                lang={lang}
                onStartRecording={handleStartRecording}
                onPauseRecording={handlePauseRecording}
                onStopAndProcess={handleStopAndProcess}
                onRecordedFileReady={(file) => {
                  setIsRecording(false);
                  if (file) setRecordedMicFile(file);
                }}
              />
            )}

            {mode === 'audio' && (
              <AudioFileUploader
                uploadedFile={uploadedAudioFile}
                lang={lang}
                onSelectFile={setUploadedAudioFile}
                onStartProcessing={handleAudioStartProcessing}
              />
            )}

            {mode === 'video' && (
              <VideoLessonUploader
                videoData={videoData}
                setVideoData={setVideoData}
                onStartProcessing={(data) => handleVideoStartProcessing(data)}
                lang={lang}
                isRtl={isRtl}
                aiFeatures={aiFeatures}
              />
            )}
          </div>

          {/* Lesson Attachments Manager: Multiple PDFs + Ordered Whiteboard Images */}
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

      {/* Final Unified Submit Bar (Works with Audio, Video, or Attachments Only) */}
      <div style={{
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
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <CheckCircle2 size={18} color="var(--primary)" />
          <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
            {title ? title : (lang === 'ar' ? 'حصة جديدة جاهزة للحفظ' : 'Ready to publish lesson')}
          </span>
          <span>•</span>
          <span>
            {recordedMicFile || uploadedAudioFile
              ? (lang === 'ar' ? 'ملف صوتي مرفق' : 'Audio ready')
              : videoData
                ? (lang === 'ar' ? 'فيديو مرفق' : 'Video ready')
                : (lang === 'ar' ? 'بدون صوت/فيديو (مرفقات فقط)' : 'Attachments / notes only')}
          </span>
          {(lessonPdfs.length > 0 || lessonImages.length > 0) && (
            <>
              <span>•</span>
              <span style={{ color: 'var(--primary)', fontWeight: '700' }}>
                {lessonPdfs.length} PDF / {lessonImages.length} {lang === 'ar' ? 'صور' : 'images'}
              </span>
            </>
          )}
        </div>

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
            fontSize: '14.5px',
            fontWeight: '800',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 18px rgba(21, 136, 199, 0.35)',
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          <CheckCircle2 size={18} />
          <span>{lang === 'ar' ? 'حفظ ونشر الحصة ومرفقاتها' : 'Save & Publish Lesson'}</span>
        </button>
      </div>

      {/* Uploading Overlay */}
      {isSubmitting && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px 36px',
            textAlign: 'center',
            maxWidth: '380px',
            width: '100%',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <Loader2 size={36} color="var(--primary)" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 14px' }} />
            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {uploadStatusText || (lang === 'ar' ? 'جاري رفع ملفات الحصة...' : 'Uploading lesson files...')}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'يرجى الانتظار حتى يكتمل الرفع والحفظ.' : 'Please wait until upload and saving complete.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default RecordingStudio;
