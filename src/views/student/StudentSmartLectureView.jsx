import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_LESSON } from '../../data/mockData';
import { KnowledgeMapCanvas } from '../../components/knowledge-map/KnowledgeMapCanvas';
import { Sparkles, Brain, FileText, Layers } from 'lucide-react';
import {
  LectureRecorderUploader,
  LectureMiniPlayer,
  LectureTranscriptTab,
  LectureTopicsTab
} from '../../features/student/smart-lecture';

export const StudentSmartLectureView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const lesson = MOCK_LESSON;

  // Recording State (US-57)
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const recordIntervalRef = useRef(null);

  // Upload & AI Processing Simulation (US-56, US-58)
  const [uploadedFile, setUploadedFile] = useState({
    name: lang === 'ar' ? 'محاضرة_الأحياء_الفصل_الثالث.mp4' : 'Biology_Lecture_Chapter3.mp4',
    sizeFormatted: '24.6 MB',
    type: 'video/mp4'
  });
  const [uploadStatus, setUploadStatus] = useState('done'); // 'idle' | 'uploading' | 'processing' | 'done'
  const [uploadProgress, setUploadProgress] = useState(100);
  const uploadTimerRef = useRef(null);
  const [searchTranscript, setSearchTranscript] = useState('');

  // Active synchronized player & timestamp (US-63, US-64, US-65)
  const [activeSeconds, setActiveSeconds] = useState(320); // 05:20
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'transcript' | 'topics'

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '12.4 MB';
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    }
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Upload handler with smooth real-time progress
  const handleFileUpload = (file) => {
    if (!file) return;
    if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);

    setUploadedFile({
      name: file.name,
      sizeFormatted: formatFileSize(file.size),
      type: file.type || ''
    });
    setUploadStatus('uploading');
    setUploadProgress(10);

    let current = 10;
    uploadTimerRef.current = setInterval(() => {
      current += Math.floor(Math.random() * 20) + 12;
      if (current >= 100) {
        clearInterval(uploadTimerRef.current);
        setUploadProgress(100);
        setUploadStatus('processing');
        setTimeout(() => {
          setUploadStatus('done');
        }, 1200);
      } else {
        setUploadProgress(current);
      }
    }, 180);
  };

  const handleResetFile = () => {
    if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
    setUploadedFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
  };

  // Recording toggle
  const toggleRecording = () => {
    if (isRecording) {
      clearInterval(recordIntervalRef.current);
      setIsRecording(false);
      const timeStr = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
      setUploadedFile({
        name: lang === 'ar' ? `تسجيل_صوتي_مباشر_${timeStr}.wav` : `live_record_${timeStr}.wav`,
        sizeFormatted: `${Math.max(1.2, (recordSeconds * 0.12)).toFixed(1)} MB`,
        type: 'audio/wav'
      });
      setUploadStatus('processing');
      setUploadProgress(100);
      setTimeout(() => {
        setUploadStatus('done');
      }, 1400);
    } else {
      setIsRecording(true);
      setRecordSeconds(0);
      recordIntervalRef.current = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    }
  };

  // Jump timestamp from Mindmap or Chapter (US-63, US-65)
  const handleJumpToTime = (secs) => {
    setActiveSeconds(secs);
    setIsPlaying(true);
  };

  const formatSecs = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // Filter transcript
  const filteredTranscript = lesson.transcript.filter(t => {
    if (!searchTranscript.trim()) return true;
    return t.textAr.includes(searchTranscript.trim()) || t.text.toLowerCase().includes(searchTranscript.toLowerCase());
  });

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '24px 20px 80px'
    }}>
      {/* Calm Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <h1 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: 1.3,
            fontFamily: 'var(--font-arabic)'
          }}>
            {lang === 'ar' ? 'استوديو المحاضرة الذكية' : 'Smart Lecture Studio'}
          </h1>
          <p style={{
            fontSize: '13.5px',
            color: 'var(--text-secondary)',
            margin: '4px 0 0 0',
            fontFamily: 'var(--font-arabic)'
          }}>
            {lang === 'ar' 
              ? 'تفريغ صوتي فوري، تلخيص للمحاور، وخريطة مفاهيم تفاعلية بالذكاء الاصطناعي' 
              : 'Instant audio transcription, chapter summary, and interactive knowledge map'}
          </p>
        </div>

        {/* Generate Quiz Button */}
        <button
          onClick={() => navigate('/student/quiz')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'var(--font-arabic)',
            boxShadow: '0 2px 8px rgba(21, 136, 199, 0.25)',
            transition: 'all 0.15s ease'
          }}
        >
          <Sparkles size={16} />
          <span>{lang === 'ar' ? 'توليد كويز فوري من المحاضرة' : 'Generate AI Quiz'}</span>
        </button>
      </div>

      {/* Upload or Record Action Section */}
      <LectureRecorderUploader
        lang={lang}
        isRecording={isRecording}
        recordSeconds={recordSeconds}
        formatSecs={formatSecs}
        uploadedFile={uploadedFile}
        uploadProgress={uploadProgress}
        uploadStatus={uploadStatus}
        onToggleRecording={toggleRecording}
        onFileUpload={handleFileUpload}
        onResetFile={handleResetFile}
      />

      {/* Synchronized Media Mini-Player Bar */}
      <LectureMiniPlayer
        lesson={lesson}
        activeSeconds={activeSeconds}
        isPlaying={isPlaying}
        formatSecs={formatSecs}
        isRtl={isRtl}
        lang={lang}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onOpenFullRoom={() => navigate('/student/lesson')}
      />

      {/* AI Intelligence Work Area (Mindmap, Transcript, Topics) */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xs)'
      }}>
        {/* Sub-tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 16px',
          gap: '4px',
          backgroundColor: 'var(--bg-subtle)'
        }}>
          {[
            { id: 'map', labelAr: 'خريطة المفاهيم التفاعلية', labelEn: 'Knowledge Map', icon: Brain },
            { id: 'transcript', labelAr: `النص المفرغ والبحث (${lesson.transcript.length})`, labelEn: `Transcript (${lesson.transcript.length})`, icon: FileText },
            { id: 'topics', labelAr: `محاور الحصة (${lesson.chapters.length})`, labelEn: `Topics (${lesson.chapters.length})`, icon: Layers }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 18px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-arabic)',
                  transition: 'all 0.15s ease'
                }}
              >
                <tab.icon size={16} />
                <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Interactive Knowledge Map */}
        {activeTab === 'map' && (
          <div style={{ height: '480px', width: '100%', position: 'relative' }}>
            <KnowledgeMapCanvas
              knowledgeMap={lesson.knowledgeMap}
              onNodeSelect={(node) => {
                if (node.seconds !== undefined) {
                  handleJumpToTime(node.seconds);
                }
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '14px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(6, 37, 78, 0.85)',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '11.5px',
              fontWeight: '600',
              pointerEvents: 'none',
              backdropFilter: 'blur(4px)',
              boxShadow: 'var(--shadow-xs)',
              fontFamily: 'var(--font-arabic)'
            }}>
              {lang === 'ar' ? 'اضغط على أي عنصر للانتقال لموقعه في الشرح الصوتي' : 'Click any node to jump to its timestamp'}
            </div>
          </div>
        )}

        {/* Tab 2: Transcript with Search */}
        {activeTab === 'transcript' && (
          <LectureTranscriptTab
            searchTranscript={searchTranscript}
            setSearchTranscript={setSearchTranscript}
            filteredTranscript={filteredTranscript}
            activeSeconds={activeSeconds}
            lang={lang}
            onJumpToTime={handleJumpToTime}
          />
        )}

        {/* Tab 3: Topics Division */}
        {activeTab === 'topics' && (
          <LectureTopicsTab
            chapters={lesson.chapters}
            lang={lang}
            isRtl={isRtl}
            onJumpToTime={handleJumpToTime}
          />
        )}
      </div>
    </div>
  );
};

