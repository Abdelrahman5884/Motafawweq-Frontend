import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Radio, Mic, UploadCloud } from 'lucide-react';
import {
  StudioLessonConfigCard,
  LiveMicRecorder,
  AudioFileUploader
} from '../../features/teacher/studio';

export const RecordingStudio = () => {
  const { navigate } = useAuth();
  const { lang, isRtl } = useLanguage();

  const [mode, setMode] = useState('mic'); // 'mic' | 'upload'
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Lesson Metadata state
  const [title, setTitle] = useState(lang === 'ar' ? 'البناء الضوئي وحركية الطاقة في النبات' : 'Photosynthesis & Energy Dynamics');
  const [subject, setSubject] = useState('Biology');
  const [grade, setGrade] = useState('3rd Secondary');
  const [classGroup, setClassGroup] = useState('cls-dokki-301');

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

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '40px 24px 80px'
    }}>
      {/* Studio Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Radio size={20} color="var(--primary)" />
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.5px' }}>
            {lang === 'ar' ? 'استوديو التسجيل الذكي' : 'Learnora Smart Studio'}
          </span>
        </div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          marginBottom: '8px',
          fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
        }}>
          {lang === 'ar' ? 'تسجيل حصة جديدة ومعالجتها بالذكاء الاصطناعي' : 'Record New Lesson & AI Processing'}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          {lang === 'ar' 
            ? 'سجل صوت الشرح مباشرة من الميكروفون أو ارفع ملف تسجيل صوتي سابق لتحويله لخريطة معرفية وملخص واختبار.'
            : 'Record classroom lecture via live mic or upload an audio file to transform it into knowledge map, summary, and quiz.'}
        </p>
      </div>

      {/* Lesson Configuration Card */}
      <StudioLessonConfigCard
        title={title}
        setTitle={setTitle}
        subject={subject}
        setSubject={setSubject}
        grade={grade}
        setGrade={setGrade}
        classGroup={classGroup}
        setClassGroup={setClassGroup}
        lang={lang}
        isRtl={isRtl}
      />

      {/* Recording / Upload Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        boxShadow: 'var(--shadow-sm)',
        textAlign: 'center'
      }}>
        {/* Toggle Mode Pills */}
        <div style={{
          display: 'inline-flex',
          backgroundColor: 'var(--bg-subtle)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          marginBottom: '32px'
        }}>
          <button
            onClick={() => setMode('mic')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: mode === 'mic' ? 'var(--primary)' : 'transparent',
              color: mode === 'mic' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Mic size={16} />
            <span>{lang === 'ar' ? 'تسجيل مباشر بالميكروفون' : 'Live Microphone'}</span>
          </button>

          <button
            onClick={() => setMode('upload')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: mode === 'upload' ? 'var(--primary)' : 'transparent',
              color: mode === 'upload' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <UploadCloud size={16} />
            <span>{lang === 'ar' ? 'رفع ملف صوتي مسجل' : 'Upload Audio File'}</span>
          </button>
        </div>

        {mode === 'mic' ? (
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
        ) : (
          <AudioFileUploader
            uploadedFile={uploadedFile}
            lang={lang}
            onSelectFile={setUploadedFile}
            onStartProcessing={() => navigate('ai-processing')}
          />
        )}
      </div>
    </div>
  );
};
