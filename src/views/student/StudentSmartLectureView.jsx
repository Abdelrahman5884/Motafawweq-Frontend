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
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTranscript, setSearchTranscript] = useState('');

  // Active synchronized player & timestamp (US-63, US-64, US-65)
  const [activeSeconds, setActiveSeconds] = useState(320); // 05:20
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'transcript' | 'topics'

  // Recording toggle
  const toggleRecording = () => {
    if (isRecording) {
      clearInterval(recordIntervalRef.current);
      setIsRecording(false);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);
    } else {
      setIsRecording(true);
      setRecordSeconds(0);
      recordIntervalRef.current = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    }
  };

  const handleSimulateUpload = (e) => {
    const file = e.target.files?.[0];
    const name = file ? file.name : 'Physics-Lecture-Sept18.mp3';
    setUploadedFileName(name);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 1800);
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
      padding: '28px 20px 80px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '900', padding: '2px 8px', borderRadius: '10px', backgroundColor: 'rgba(21, 136, 199, 0.12)', color: 'var(--primary)' }}>
              FLAGSHIP AI FEATURE
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Whisper Speech Engine
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
            {lang === 'ar' ? 'استوديو المحاضرة الذكية (Smart Lecture)' : 'Smart Lecture AI Studio'}
          </h1>
        </div>

        {/* Generate Quiz from this Lecture Button */}
        <button
          onClick={() => navigate('/student/quiz')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '14px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(21, 136, 199, 0.3)'
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
        uploadedFileName={uploadedFileName}
        isProcessing={isProcessing}
        onToggleRecording={toggleRecording}
        onSimulateUpload={handleSimulateUpload}
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
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1.5px solid var(--border-medium)',
        borderRadius: '24px',
        overflow: 'hidden'
      }}>
        {/* Sub-tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 20px'
        }}>
          {[
            { id: 'map', labelAr: 'خريطة المفاهيم التفاعلية', icon: Brain },
            { id: 'transcript', labelAr: `النص المفرغ والبحث (${lesson.transcript.length} مقطع)`, icon: FileText },
            { id: 'topics', labelAr: `تقسيم موضوعات الحصة (${lesson.chapters.length})`, icon: Layers }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 20px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: activeTab === tab.id ? '800' : '600',
                cursor: 'pointer'
              }}
            >
              <tab.icon size={16} />
              <span>{tab.labelAr}</span>
            </button>
          ))}
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
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              color: '#FFFFFF',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '11.5px',
              fontWeight: '700',
              pointerEvents: 'none'
            }}>
              {lang === 'ar' ? 'اضغط على أي عقدة للانتقال المباشر لتوقيتها في الشرح الصوتي' : 'Click any node to jump to its lecture audio'}
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
