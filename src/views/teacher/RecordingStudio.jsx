import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Radio, Mic, UploadCloud, Video, Sparkles, CheckCircle2 } from 'lucide-react';
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

  // Lesson Metadata state
  const [title, setTitle] = useState(
    lang === 'ar' ? 'البناء الضوئي وحركية الطاقة في النبات' : 'Photosynthesis & Energy Dynamics'
  );
  const [description, setDescription] = useState(
    lang === 'ar' 
      ? 'شرح مفصل ومكثف لدرس البناء الضوئي للصف الثالث الثانوي: تركيب البلاستيدة، التفاعلات الضوئية واللاضوئية، دورة كالفن، وأهم أسئلة ومصائد امتحانات الثانوية العامة مع ملازم الشرح وصور السبورة.'
      : 'Comprehensive masterclass on plant cell photosynthesis, chloroplast anatomy, light vs dark reactions, and Thanawya Amma trap questions.'
  );
  const [subject, setSubject] = useState('Biology');
  const [grade, setGrade] = useState('3rd Secondary');
  const [classGroup, setClassGroup] = useState('cls-dokki-301');

  // Multi-PDF attachments state
  const [lessonPdfs, setLessonPdfs] = useState([
    {
      id: 'pdf-seed-1',
      title: 'مذكرة شرح البناء الضوئي والتفاعلات الضوئية - د. سلمى',
      fileName: 'Photosynthesis_Full_Notes_2026.pdf',
      fileSize: '4.8 MB',
      pagesCount: 24,
      uploadedAt: '10:30 ص',
      url: '#'
    },
    {
      id: 'pdf-seed-2',
      title: 'شيت تدريبات بنك الأسئلة والوزارة 2026',
      fileName: 'Biology_Ministry_Bank_Questions.pdf',
      fileSize: '2.3 MB',
      pagesCount: 16,
      uploadedAt: '10:35 ص',
      url: '#'
    }
  ]);

  // Multi-Images attachments state (with sequential ordering)
  const [lessonImages, setLessonImages] = useState([
    {
      id: 'img-seed-1',
      order: 1,
      title: 'سبورة 1: تشريح البلاستيدة الخضراء وأغشية الثيلاكويد',
      fileName: 'whiteboard_part1_chloroplast.jpg',
      fileSize: '1.8 MB',
      url: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=800&auto=format&fit=crop&q=80',
      caption: 'رسم توضيحي تفصيلي لغشاء الثيلاكويد وحبيبات الجرانا والستروما'
    },
    {
      id: 'img-seed-2',
      order: 2,
      title: 'سبورة 2: مسار الإلكترونات والفسفرة الضوئية والتفاعلات',
      fileName: 'whiteboard_part2_photophosphorylation.jpg',
      fileSize: '2.1 MB',
      url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80',
      caption: 'شرح حركة الإلكترونات بين نظام الصبغيات الأول والثاني'
    },
    {
      id: 'img-seed-3',
      order: 3,
      title: 'سبورة 3: دورة كالفن وتثبيت مركب PGAL',
      fileName: 'whiteboard_part3_calvin_cycle.jpg',
      fileSize: '1.9 MB',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
      caption: 'خطوات تثبيت ثاني أكسيد الكربون وإنتاج السكر'
    }
  ]);

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

  const handleStopAndProcess = () => {
    setIsRecording(false);
    navigate('ai-processing');
  };

  const handleVideoStartProcessing = (vidData) => {
    setVideoData(vidData);
    navigate('ai-processing');
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
        lang={lang}
        isRtl={isRtl}
      />

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
            onStartProcessing={() => navigate('ai-processing')}
          />
        )}

        {mode === 'video' && (
          <VideoLessonUploader
            onStartProcessing={handleVideoStartProcessing}
            lang={lang}
            isRtl={isRtl}
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
