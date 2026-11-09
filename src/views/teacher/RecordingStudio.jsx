import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { teacherApi } from '../../services/teacherApi';
import { Radio, Mic, UploadCloud, Video, Sparkles, CheckCircle2, FileText, Share2, Clock, Check } from 'lucide-react';
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

  const handleToggleAIFeature = (key) => {
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

  // Multi-PDF attachments state
  const [lessonPdfs, setLessonPdfs] = useState([]);

  // Multi-Images attachments state (with sequential ordering)
  const [lessonImages, setLessonImages] = useState([]);

  // Fetch groups on mount
  useEffect(() => {
    let mounted = true;
    teacherApi.groups.list().then((res) => {
      if (!mounted) return;
      if (res?.data && Array.isArray(res.data)) {
        setAvailableGroups(res.data);
        if (res.data.length > 0 && !classGroup) {
          setClassGroup(res.data[0].uuid || res.data[0].code || res.data[0].id);
        }
      }
    }).catch(() => {});
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

  const uploadLessonAttachments = (lessonUuid) => {
    if (!lessonUuid) return;
    lessonPdfs.forEach((p) => {
      if (p.fileObj) {
        teacherApi.studio.uploadAttachment(lessonUuid, p.fileObj, 'pdf').catch(() => {});
      }
    });
    lessonImages.forEach((img) => {
      if (img.fileObj) {
        teacherApi.studio.uploadAttachment(lessonUuid, img.fileObj, 'whiteboard_image').catch(() => {});
      }
    });
  };

  const handleStopAndProcess = () => {
    setIsRecording(false);
    const requestedFlags = Object.keys(aiFeatures).filter((k) => aiFeatures[k]);
    try {
      sessionStorage.setItem('selectedAIFeatures', JSON.stringify(aiFeatures));
    } catch (e) {}

    teacherApi.studio.createLesson({
      title_ar: title || (lang === 'ar' ? 'حصة بدون عنوان' : 'Untitled Lesson'),
      description_ar: description || '',
      subject_ar: subject || 'الأحياء',
      grade_ar: grade || 'الصف الثالث الثانوي',
      target_group_code: classGroup,
      media_mode: 'audio',
      duration_seconds: elapsedSeconds || 1800,
      ai_features_requested: requestedFlags,
    }).then((res) => {
      if (res?.data?.uuid) {
        sessionStorage.setItem('currentLessonUuid', res.data.uuid);
        uploadLessonAttachments(res.data.uuid);
      }
    }).catch((err) => {
      console.warn('Backend studio lesson save fallback:', err);
    });

    navigate('/teacher/processing');
  };

  const handleAudioStartProcessing = () => {
    const requestedFlags = Object.keys(aiFeatures).filter((k) => aiFeatures[k]);
    try {
      sessionStorage.setItem('selectedAIFeatures', JSON.stringify(aiFeatures));
    } catch (e) {}

    teacherApi.studio.createLesson({
      title_ar: title || (lang === 'ar' ? 'حصة صوتية جديدة' : 'New Audio Lesson'),
      description_ar: description || '',
      subject_ar: subject || 'الأحياء',
      grade_ar: grade || 'الصف الثالث الثانوي',
      target_group_code: classGroup,
      media_mode: 'audio',
      duration_seconds: 1800,
      ai_features_requested: requestedFlags,
    }).then((res) => {
      if (res?.data?.uuid) {
        sessionStorage.setItem('currentLessonUuid', res.data.uuid);
        if (uploadedAudioFile) {
          teacherApi.studio.uploadAttachment(res.data.uuid, uploadedAudioFile, 'audio').catch(() => {});
        }
        uploadLessonAttachments(res.data.uuid);
      }
    }).catch((err) => {
      console.warn('Backend studio audio lesson save fallback:', err);
    });

    navigate('/teacher/processing');
  };

  const handleVideoStartProcessing = (vidData) => {
    if (vidData) setVideoData(vidData);
    const requestedFlags = Object.keys(aiFeatures).filter((k) => aiFeatures[k]);
    try {
      sessionStorage.setItem('selectedAIFeatures', JSON.stringify(aiFeatures));
    } catch (e) {}

    teacherApi.studio.createLesson({
      title_ar: title || (lang === 'ar' ? 'حصة فيديو جديدة' : 'New Video Lesson'),
      description_ar: description || '',
      subject_ar: subject || 'الأحياء',
      grade_ar: grade || 'الصف الثالث الثانوي',
      target_group_code: classGroup,
      media_mode: 'video',
      embed_url: vidData?.youtubeUrl || vidData?.url,
      is_youtube: Boolean(vidData?.youtubeUrl),
      duration_seconds: vidData?.durationSeconds || 2400,
      ai_features_requested: requestedFlags,
    }).then((res) => {
      if (res?.data?.uuid) {
        sessionStorage.setItem('currentLessonUuid', res.data.uuid);
        uploadLessonAttachments(res.data.uuid);
      }
    }).catch((err) => {
      console.warn('Backend studio video lesson save fallback:', err);
    });

    navigate('/teacher/processing');
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

      {/* Lesson Configuration Card (Includes Title, Description, Subject, Grade, Class Group) */}
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
        textAlign: isRtl ? 'right' : 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sparkles size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'تحديد مخرجات محرك الذكاء الاصطناعي للحصة' : 'Select AI Output Capabilities'}
          </h3>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 18px 0', lineHeight: 1.5 }}>
          {lang === 'ar' 
            ? 'حدد التقنيات والتحليلات التي تريد توليدها تلقائياً بعد رفع أو تسجيل الحصة (مثل التفريغ النصي وخريطة المفاهيم الشجرية).'
            : 'Select which intelligence outputs to generate automatically upon lesson processing (Transcript, Concept Tree, Chapters).'}
        </p>

        {/* 3 Interactive Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px'
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
    </div>
  );
};
export default RecordingStudio;
