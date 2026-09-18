import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_LESSON } from '../../data/mockData';
import { KnowledgeMapCanvas } from '../../components/knowledge-map/KnowledgeMapCanvas';
import { 
  UploadCloud, 
  Mic, 
  MicOff, 
  Sparkles, 
  FileText, 
  Search, 
  Play, 
  Pause, 
  Clock, 
  Brain, 
  Layers, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

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
  const [hasProcessed, setHasProcessed] = useState(true); // Default loaded with active lesson
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
        setHasProcessed(true);
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
      setHasProcessed(true);
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
            <span style={{ fontSize: '11px', fontWeight: '900', padding: '2px 8px', borderRadius: '10px', backgroundColor: 'rgba(108, 77, 255, 0.15)', color: '#6C4DFF' }}>
              FLAGSHIP AI FEATURE ⭐
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Whisper Speech Engine
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
            {lang === 'ar' ? 'استوديو المحاضرة الذكية (Smart Lecture) ⭐' : 'Smart Lecture AI Studio'}
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
            backgroundColor: '#8B5CF6',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
          }}
        >
          <Sparkles size={16} />
          <span>{lang === 'ar' ? 'توليد كويز فوري من المحاضرة' : 'Generate AI Quiz'}</span>
        </button>
      </div>

      {/* Upload or Record Action Section (US-56 & US-57) */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1.5px solid var(--border-medium)',
        borderRadius: '24px',
        padding: '24px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px' }}>
          {lang === 'ar' ? 'رفع محاضرة جديدة أو التسجيل المباشر من المايكروفون:' : 'Upload or Record Lecture Audio:'}
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {/* File Upload Box (US-56) */}
          <div style={{
            border: '2px dashed var(--border-medium)',
            borderRadius: '18px',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-subtle)',
            position: 'relative',
            cursor: 'pointer'
          }}>
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={handleSimulateUpload}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
            />
            <UploadCloud size={30} color="var(--primary)" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {uploadedFileName ? `تم اختيار: ${uploadedFileName}` : (lang === 'ar' ? 'رفع تسجيل صوتي أو فيديو (MP3, WAV, MP4)' : 'Upload Audio/Video')}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              الذكاء الاصطناعي يحول الصوت إلى نص مقسم تلقائياً
            </div>
          </div>

          {/* Direct Voice Recording Box (US-57) */}
          <div style={{
            border: isRecording ? '2px solid #EF4444' : '1.5px solid var(--border-subtle)',
            borderRadius: '18px',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: isRecording ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <button
              onClick={toggleRecording}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: isRecording ? '#EF4444' : 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginBottom: '8px',
                boxShadow: isRecording ? '0 0 16px rgba(239, 68, 68, 0.5)' : 'none'
              }}
            >
              {isRecording ? <MicOff size={22} /> : <Mic size={22} />}
            </button>

            <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {isRecording ? (lang === 'ar' ? `جاري التسجيل: ${formatSecs(recordSeconds)}` : `Recording: ${formatSecs(recordSeconds)}`) : (lang === 'ar' ? 'تسجيل صوت الحصة مباشرة من القاعة' : 'Record Live Lecture')}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {isRecording ? 'اضغط للإيقاف وبدء التحليل الذكي' : 'اضغط على المايك لبدء التسجيل'}
            </div>
          </div>
        </div>

        {/* Processing Spinner */}
        {isProcessing && (
          <div style={{
            marginTop: '16px',
            padding: '14px',
            borderRadius: '14px',
            backgroundColor: 'rgba(108, 77, 255, 0.12)',
            color: 'var(--primary)',
            fontSize: '13px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <Sparkles size={16} />
            <span>{lang === 'ar' ? 'جاري تحويل الصوت إلى نص وتقسيم الموضوعات وبناء الخريطة التفاعلية...' : 'Transcribing and generating mindmap...'}</span>
          </div>
        )}
      </div>

      {/* Synchronized Media Mini-Player Bar (US-65) */}
      <div style={{
        backgroundColor: '#090D16',
        borderRadius: '20px',
        padding: '14px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#FFFFFF',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: isRtl ? 0 : '2px', marginRight: isRtl ? '2px' : 0 }} />}
          </button>

          <div>
            <div style={{ fontSize: '13px', fontWeight: '800' }}>
              {lesson.chapters.find(c => activeSeconds >= c.startSeconds)?.titleAr || lesson.chapters[0].titleAr}
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>
              متزامن مع الخريطة والنص • {formatSecs(activeSeconds)}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/student/lesson')}
          style={{
            padding: '6px 14px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          {lang === 'ar' ? 'فتح في غرفة الحصة الكاملة' : 'Full Lesson Room'}
        </button>
      </div>

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
            { id: 'map', labelAr: 'خريطة المفاهيم التفاعلية 🧠', icon: Brain },
            { id: 'transcript', labelAr: `النص المفرغ والبحث (${lesson.transcript.length} مقطع) 📜`, icon: FileText },
            { id: 'topics', labelAr: `تقسيم موضوعات الحصة (${lesson.chapters.length}) 📑`, icon: Layers }
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

        {/* Tab 1: Interactive Knowledge Map (US-62, US-63, US-64, US-65) */}
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
            {/* Guide pill */}
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
              💡 {lang === 'ar' ? 'اضغط على أي عقدة (Node) للانتقال المباشر لتوقيتها في الشرح الصوتي' : 'Click any node to jump to its lecture audio'}
            </div>
          </div>
        )}

        {/* Tab 2: Transcript with Search (US-58, US-59, US-64) */}
        {activeTab === 'transcript' && (
          <div style={{ padding: '24px' }}>
            {/* Search Input in Transcript */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1.5px solid var(--border-medium)',
              borderRadius: '14px',
              padding: '10px 16px',
              marginBottom: '20px'
            }}>
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'ابحث عن أي كلمة قيلت في المحاضرة (مثل: انشطار الماء، PGAL)...' : 'Search words in transcript...'}
                value={searchTranscript}
                onChange={(e) => setSearchTranscript(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  width: '100%'
                }}
              />
            </div>

            {/* Transcript Snippets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredTranscript.map((t) => {
                const isActive = activeSeconds >= t.startSeconds && activeSeconds < t.startSeconds + 120;
                return (
                  <div
                    key={t.id}
                    onClick={() => handleJumpToTime(t.startSeconds)}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '16px',
                      backgroundColor: isActive ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                      border: '1.5px solid',
                      borderColor: isActive ? 'var(--primary)' : 'var(--border-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <button
                      style={{
                        padding: '4px 8px',
                        borderRadius: '8px',
                        backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-surface)',
                        color: isActive ? '#FFFFFF' : 'var(--primary)',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      ▶ {t.timestamp}
                    </button>

                    <div>
                      <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--primary)', marginBottom: '2px' }}>
                        {t.speaker}
                      </div>
                      <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                        {t.textAr}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Topics Division (US-60, US-61) */}
        {activeTab === 'topics' && (
          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
              {lang === 'ar' ? 'فصول ومحاور الشرح المستخرجة:' : 'Extracted Lecture Topics:'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lesson.chapters.map((ch, idx) => (
                <div
                  key={ch.id}
                  onClick={() => handleJumpToTime(ch.startSeconds)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-surface)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: '900'
                    }}>
                      {idx + 1}
                    </span>
                    <div>
                      <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {ch.titleAr}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        يبدأ عند الدقيقة {ch.timestamp}
                      </div>
                    </div>
                  </div>

                  <ChevronRight size={18} color="var(--text-muted)" style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
