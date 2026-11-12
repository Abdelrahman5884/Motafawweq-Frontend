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
          teacherApi.studio.uploadImage(
            lessonUuid,
            img.fileObj,
            img.title || img.fileName,
            img.caption || '',
            img.order || idx + 1
          ).catch((err) => console.warn('Image upload failed:', err))
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
      navigate('/teacher/processing');
    }
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
      maxWidth: '1060px',
      margin: '0 auto',
      padding: '40px 24px 80px',
      fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit'
    }}>
      {/* Studio Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Radio size={20} color="var(--primary)" />
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.5px' }}>
            {lang === 'ar' ? 'استوديو التسجيل الذكي والمواد التعليمية' : 'Smart Recording & Materials Studio'}
          </span>
        </div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          marginBottom: '8px',
          fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
        }}>
          {lang === 'ar' ? 'تسجيل وإعداد حصة جديدة ومعالجتها بالذكاء الاصطناعي' : 'Setup & Record New Lesson with AI Processing'}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '820px' }}>
          {lang === 'ar' 
            ? 'سجل صوت الحصة مباشرة، أو ارفع تسجيلاً صوتياً أو فيديو، وأرفق ملازم الشرح (PDF) وصور السبورة بالترتيب ليتمكن طلابك من مراجعتها بذكاء.'
            : 'Record classroom lecture via live mic, upload audio/video, and attach multiple PDF notes and ordered whiteboard photos for students.'}
        </p>
      </div>

      {/* Lesson Configuration Card (Includes Title, Description, Subject, Grade, Course, Class Group) */}
      <StudioLessonConfigCard
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        subject={subject}
        setSubject={setSubject}
        grade={grade}
        setGrade={setGrade}
        classGroup={classGroup}
        setClassGroup={setClassGroup}
        groups={availableGroups}
        courses={availableCourses}
        selectedCourseId={selectedCourseId}
        setSelectedCourseId={setSelectedCourseId}
        subjectOptions={subjectOptions}
        stageOptions={stageOptions}
        lang={lang}
        isRtl={isRtl}
      />

      {/* AI Output Modules Selection Card (Text, Concept Graph, Chapters) */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px 28px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)',
        textAlign: isRtl ? 'right' : 'left',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'تحديد مخرجات محرك الذكاء الاصطناعي للحصة' : 'Select AI Output Capabilities'}
            </h3>
            {!isProPlan && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(245, 158, 11, 0.14)',
                color: '#D97706',
                fontSize: '11px',
                fontWeight: '800',
              }}>
                <Crown size={12} />
                <span>{lang === 'ar' ? 'حصري لباقة Pro' : 'Pro Only'}</span>
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
                gap: '6px',
                padding: '7px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: '#D97706',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              <Lock size={13} />
              <span>{lang === 'ar' ? 'اشترك في Pro لتفعيل الذكاء الاصطناعي' : 'Upgrade to Pro to Unlock AI'}</span>
            </button>
          )}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 18px 0', lineHeight: 1.5 }}>
          {!isProPlan
            ? (lang === 'ar'
                ? 'ميزات التفريغ النصي وخريطة المفاهيم وفهرسة الفصول بالذكاء الاصطناعي متاحة فقط لمشتركي باقة Pro. يمكنك رفع الحصة والمرفقات الآن بشكل طبيعي.'
                : 'AI transcription, concept graph, and chapter indexing require a Pro subscription. You can still upload and publish lessons normally.')
            : (lang === 'ar'
                ? 'حدد التقنيات والتحليلات التي تريد توليدها تلقائياً بعد رفع أو تسجيل الحصة (مثل التفريغ النصي وخريطة المفاهيم الشجرية).'
                : 'Select which intelligence outputs to generate automatically upon lesson processing (Transcript, Concept Tree, Chapters).')}
        </p>

        {/* 3 Interactive Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px',
          opacity: isProPlan ? 1 : 0.52,
          pointerEvents: isProPlan ? 'auto' : 'none',
        }}>
          {/* Module 1: Speech-to-Text */}
          <div
            onClick={() => handleToggleAIFeature('speechToText')}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: `1.5px solid ${aiFeatures.speechToText ? 'var(--primary)' : 'var(--border-subtle)'}`,
              backgroundColor: aiFeatures.speechToText ? 'var(--primary-surface)' : 'var(--bg-subtle)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '6px',
              border: `2px solid ${aiFeatures.speechToText ? 'var(--primary)' : 'var(--border-medium)'}`,
              backgroundColor: aiFeatures.speechToText ? 'var(--primary)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              {aiFeatures.speechToText && <Check size={14} strokeWidth={3} />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <FileText size={15} color="var(--primary)" />
                <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'التفريغ النصي (Speech-to-Text)' : 'Speech-to-Text Transcript'}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                {lang === 'ar'
                  ? 'تحويل صوت الشرح إلى نص مقروء بدقة عالية باللهجة المصرية والمصطلحات العلمية مع إمكانية البحث.'
                  : 'Egyptian dialect ASR transcription synchronized with seconds.'}
              </p>
            </div>
          </div>

          {/* Module 2: Concept Graph (NotebookLM Style) */}
          <div
            onClick={() => handleToggleAIFeature('conceptGraph')}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: `1.5px solid ${aiFeatures.conceptGraph ? '#0EA5E9' : 'var(--border-subtle)'}`,
              backgroundColor: aiFeatures.conceptGraph ? 'rgba(14, 165, 233, 0.08)' : 'var(--bg-subtle)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '6px',
              border: `2px solid ${aiFeatures.conceptGraph ? '#0EA5E9' : 'var(--border-medium)'}`,
              backgroundColor: aiFeatures.conceptGraph ? '#0EA5E9' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              {aiFeatures.conceptGraph && <Check size={14} strokeWidth={3} />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Share2 size={15} color="#0EA5E9" />
                <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'خريطة المفاهيم (NotebookLM Graph)' : 'Interactive Concept Graph'}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                {lang === 'ar'
                  ? 'استخراج شجرة المفاهيم المترابطة التفاعلية مطابقة لـ Google NotebookLM مع دعم ملء الشاشة على الهاتف.'
                  : 'Interactive hierarchical knowledge tree matching Google NotebookLM.'}
              </p>
            </div>
          </div>

          {/* Module 3: Chapters & Timestamps */}
          <div
            onClick={() => handleToggleAIFeature('chapterIndexing')}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: `1.5px solid ${aiFeatures.chapterIndexing ? '#10B981' : 'var(--border-subtle)'}`,
              backgroundColor: aiFeatures.chapterIndexing ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-subtle)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '6px',
              border: `2px solid ${aiFeatures.chapterIndexing ? '#10B981' : 'var(--border-medium)'}`,
              backgroundColor: aiFeatures.chapterIndexing ? '#10B981' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              {aiFeatures.chapterIndexing && <Check size={14} strokeWidth={3} />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Clock size={15} color="#10B981" />
                <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'فهرسة الفصول والتوقيتات (Chapters)' : 'Smart Chapter Indexing'}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                {lang === 'ar'
                  ? 'تقسيم المحاضرة إلى فصول زمنية مع إمكانية القفز السريع للحظة الشرح المطلوبة بالثواني.'
                  : 'Automatic chapter division and timestamps for quick student scrubbing.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Media Input Card (Live Mic / Upload Audio / Upload or Embed Video) */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        boxShadow: 'var(--shadow-sm)',
        textAlign: 'center'
      }}>
        {/* Toggle Mode Pills: 3 Modes */}
        <div style={{
          display: 'inline-flex',
          backgroundColor: 'var(--bg-subtle)',
          padding: '5px',
          borderRadius: 'var(--radius-full)',
          marginBottom: '32px',
          gap: '6px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {/* Mode 1: Live Mic */}
          <button
            type="button"
            onClick={() => setMode('mic')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 20px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: mode === 'mic' ? 'var(--primary)' : 'transparent',
              color: mode === 'mic' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Mic size={16} />
            <span>{lang === 'ar' ? 'تسجيل صوتي بالميكروفون' : 'Live Microphone'}</span>
          </button>

          {/* Mode 2: Audio File Upload */}
          <button
            type="button"
            onClick={() => setMode('audio')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 20px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: mode === 'audio' ? 'var(--primary)' : 'transparent',
              color: mode === 'audio' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <UploadCloud size={16} />
            <span>{lang === 'ar' ? 'رفع ملف صوتي مسجل' : 'Upload Audio File'}</span>
          </button>

          {/* Mode 3: Video Lesson */}
          <button
            type="button"
            onClick={() => setMode('video')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 20px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: mode === 'video' ? 'var(--primary)' : 'transparent',
              color: mode === 'video' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Video size={16} />
            <span>{lang === 'ar' ? 'فيديو الحصة (رفع / يوتيوب)' : 'Lesson Video (File / Embed)'}</span>
          </button>
        </div>

        {/* Selected Media Component */}
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
