import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  UploadCloud, 
  Sparkles, 
  Radio, 
  FileAudio, 
  Clock, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

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
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
          {lang === 'ar' ? '1. بيانات الحصة والمجموعة' : '1. Lesson & Class Details'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {/* Lesson Title */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              {lang === 'ar' ? 'عنوان الحصة أو المحاضرة' : 'Lesson Title'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-latin)'
              }}
            />
          </div>

          {/* Subject */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              {lang === 'ar' ? 'المادة الدراسية' : 'Subject'}
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13.5px'
              }}
            >
              <option value="Biology">{lang === 'ar' ? 'الأحياء' : 'Biology'}</option>
              <option value="Physics">{lang === 'ar' ? 'الفيزياء' : 'Physics'}</option>
              <option value="Chemistry">{lang === 'ar' ? 'الكيمياء' : 'Chemistry'}</option>
              <option value="Mathematics">{lang === 'ar' ? 'الرياضيات' : 'Mathematics'}</option>
            </select>
          </div>

          {/* Grade */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              {lang === 'ar' ? 'المرحلة الدراسية' : 'Educational Stage'}
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13.5px'
              }}
            >
              <option value="3rd Secondary">{lang === 'ar' ? 'الصف الثالث الثانوي (ثانوية عامة)' : '3rd Secondary (Thanawya)'}</option>
              <option value="2nd Secondary">{lang === 'ar' ? 'الصف الثاني الثانوي' : '2nd Secondary'}</option>
              <option value="1st Secondary">{lang === 'ar' ? 'الصف الأول الثانوي' : '1st Secondary'}</option>
              <option value="3rd Prep">{lang === 'ar' ? 'الصف الثالث الإعدادي (شهادة إعدادية)' : '3rd Prep'}</option>
            </select>
          </div>

          {/* Class Group */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              {lang === 'ar' ? 'المجموعة والقاعة' : 'Target Group / Hall'}
            </label>
            <select
              value={classGroup}
              onChange={(e) => setClassGroup(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13.5px'
              }}
            >
              <option value="cls-dokki-301">{lang === 'ar' ? 'سنتر الدقي - قاعة النخبة (الأحد 4 عصراً)' : 'Dokki Elite Hall (Sun 4 PM)'}</option>
              <option value="cls-nasr-302">{lang === 'ar' ? 'سنتر مدينة نصر - قاعة 1 (الثلاثاء 6 مساءً)' : 'Nasr City Hall 1 (Tue 6 PM)'}</option>
              <option value="cls-online-303">{lang === 'ar' ? 'مجموعة الأونلاين التفاعلية (الجمعة)' : 'Online Interactive Cohort'}</option>
            </select>
          </div>
        </div>
      </div>

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
          <div>
            {/* Live Waveform or Frequency bars */}
            <div style={{
              height: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              marginBottom: '24px'
            }}>
              {Array.from({ length: 36 }).map((_, idx) => {
                const height = isRecording && !isPaused
                  ? Math.max(10, Math.sin(idx * 0.5 + elapsedSeconds * 2) * 50 + 20)
                  : 12;
                return (
                  <div
                    key={idx}
                    style={{
                      width: '5px',
                      height: `${height}px`,
                      borderRadius: '3px',
                      backgroundColor: isRecording ? 'var(--primary)' : 'var(--border-subtle)',
                      transition: 'height 0.1s ease, background-color 0.2s ease'
                    }}
                  />
                );
              })}
            </div>

            {/* Timer display */}
            <div style={{
              fontSize: '44px',
              fontWeight: '900',
              fontFamily: 'var(--font-mono)',
              color: isRecording ? 'var(--primary)' : 'var(--text-primary)',
              marginBottom: '28px',
              letterSpacing: '2px'
            }}>
              {formatTime(elapsedSeconds)}
            </div>

            {/* Mic Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 36px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(108, 77, 255, 0.4)',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Mic size={22} />
                  <span>{lang === 'ar' ? 'بدء تسجيل الحصة' : 'Start Recording'}</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handlePauseRecording}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {isPaused ? <Play size={16} /> : <Pause size={16} />}
                    <span>{isPaused ? (lang === 'ar' ? 'استئناف' : 'Resume') : (lang === 'ar' ? 'إيقاف مؤقت' : 'Pause')}</span>
                  </button>

                  <button
                    onClick={handleStopAndProcess}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '14px 28px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: '#EF4444',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '15px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 6px 20px rgba(239, 68, 68, 0.35)'
                    }}
                  >
                    <Square size={16} fill="#FFFFFF" />
                    <span>{lang === 'ar' ? 'إنهاء وبدء المعالجة بالـ AI' : 'Finish & Process with AI'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          /* File Upload Dropzone */
          <div
            style={{
              border: '2px dashed var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '48px 24px',
              backgroundColor: 'var(--bg-subtle)',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease'
            }}
            onClick={() => {
              setUploadedFile({ name: 'biology_lesson_photosynthesis_full.mp3', size: '38.4 MB' });
            }}
          >
            <UploadCloud size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {uploadedFile 
                ? (lang === 'ar' ? `تم اختيار: ${uploadedFile.name} (${uploadedFile.size})` : `Selected: ${uploadedFile.name} (${uploadedFile.size})`)
                : (lang === 'ar' ? 'اسحب ملف الحصة الصوتي إلى هنا أو اضغط للاختيار' : 'Drag & drop your lecture audio file or click to browse')}
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
              {lang === 'ar' ? 'يدعم صيغ MP3, WAV, M4A, AAC حتى حجم 300 ميجابايت' : 'Supports MP3, WAV, M4A, AAC up to 300MB'}
            </p>

            {uploadedFile && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('ai-processing');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(108, 77, 255, 0.35)'
                }}
              >
                <Sparkles size={16} />
                <span>{lang === 'ar' ? 'بدء المعالجة بالذكاء الاصطناعي الآن' : 'Start AI Processing Now'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
