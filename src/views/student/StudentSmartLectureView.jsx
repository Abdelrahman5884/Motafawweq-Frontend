import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_LESSON } from '../../data/mockData';
import { NotebookMindMapCanvas } from '../../components/knowledge-map/NotebookMindMapCanvas';
import { Sparkles, Brain, FileText, Layers, CheckCircle2, FolderCheck, PlayCircle } from 'lucide-react';
import {
  LectureRecorderUploader,
  LectureMiniPlayer,
  LectureTranscriptTab,
  LectureTopicsTab
} from '../../features/student/smart-lecture';
import '../../features/student/smart-lecture/smart-lecture.css';

export const StudentSmartLectureView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const lesson = MOCK_LESSON;

  // Selected outputs: 'graph' | 'transcript' | 'topics' | 'quiz'
  const [selectedOutputs, setSelectedOutputs] = useState(['graph', 'transcript', 'topics']);

  // Generation status: Results only appear after clicking Generate
  const [hasGenerated, setHasGenerated] = useState(false);

  // Upload & AI Processing Simulation
  const [uploadedFile, setUploadedFile] = useState(null);
  const [lectureTitle, setLectureTitle] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle' | 'uploading' | 'processing' | 'done'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const uploadTimerRef = useRef(null);
  const stageTimeoutRef = useRef(null);
  const [searchTranscript, setSearchTranscript] = useState('');

  // Active synchronized player & timestamp (US-63, US-64, US-65)
  const [activeSeconds, setActiveSeconds] = useState(320); // 05:20
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'transcript' | 'topics' | 'quiz'

  // Toggle desired output
  const handleToggleOutput = (id) => {
    setSelectedOutputs(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // At least one output
        const next = prev.filter(item => item !== id);
        // If currently active tab was unchecked, switch tab
        if (id === 'graph' && activeTab === 'map') {
          setActiveTab(next.includes('transcript') ? 'transcript' : 'topics');
        } else if (id === 'transcript' && activeTab === 'transcript') {
          setActiveTab(next.includes('graph') ? 'map' : 'topics');
        } else if (id === 'topics' && activeTab === 'topics') {
          setActiveTab(next.includes('graph') ? 'map' : 'transcript');
        }
        return next;
      } else {
        return [...prev, id];
      }
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '12.4 MB';
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    }
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Clean timeouts on unmount
  useEffect(() => {
    return () => {
      if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
      if (stageTimeoutRef.current) clearTimeout(stageTimeoutRef.current);
    };
  }, []);

  // Sequential AI stages simulation
  const runAiStages = (targetOutputs) => {
    const totalStages = 1 + targetOutputs.length;
    let stage = 0;
    setCurrentStageIndex(0);

    const stepInterval = setInterval(() => {
      stage += 1;
      if (stage < totalStages) {
        setCurrentStageIndex(stage);
      } else {
        clearInterval(stepInterval);
        setCurrentStageIndex(totalStages);
        setUploadStatus('done');
        setHasGenerated(true); // Content appears now!

        // Save newly generated lecture to converted lectures archive
        try {
          const stored = localStorage.getItem('mtfq_converted_lectures');
          const list = stored ? JSON.parse(stored) : [];
          const activeFile = uploadedFile || {
            name: lang === 'ar' ? 'محاضرة_الأحياء_الفصل_الثالث.mp4' : 'Biology_Lecture_Chapter3.mp4',
            sizeFormatted: '24.6 MB'
          };
          const chosenTitle = lectureTitle.trim() || activeFile.name.replace(/\.[^/.]+$/, '') || lesson.titleAr;
          const newEntry = {
            id: `conv-${Date.now()}`,
            lessonId: 'l3',
            titleAr: chosenTitle,
            titleEn: chosenTitle,
            subjectAr: 'الأحياء',
            subjectEn: 'Biology',
            gradeAr: 'الصف الثالث الثانوي',
            teacherAr: 'د. سلمى السيد',
            dateAr: lang === 'ar' ? 'اليوم - الآن' : 'Today - Just now',
            fileName: activeFile.name,
            fileSize: activeFile.sizeFormatted || '24.6 MB',
            duration: lesson.durationFmt || '35:00',
            summaryAr: 'تم تحويل المحاضرة واستخراج خريطة المفاهيم والتفريغ الصوتي ومحاور الحصة والكويز بنجاح.',
            outputs: targetOutputs,
            questionsCount: targetOutputs.includes('quiz') ? 5 : 0,
            conceptsCount: 6,
            keyTopics: ['انشطار الماء', 'تجربة فان نيل', 'الفسفرة الضوئية', 'دورة كالفن']
          };
          const remaining = Array.isArray(list) ? list.filter(item => item.id !== 'conv-l3') : [];
          localStorage.setItem('mtfq_converted_lectures', JSON.stringify([newEntry, ...remaining]));
        } catch (e) {}

        // Ensure active tab matches generated outputs
        if (!targetOutputs.includes('graph') && activeTab === 'map') {
          setActiveTab(targetOutputs.includes('transcript') ? 'transcript' : 'topics');
        }
      }
    }, 600);
  };

  // Upload handler: Registers the file ready for generation
  const handleFileUpload = (file) => {
    if (!file) return;
    setUploadedFile({
      name: file.name,
      sizeFormatted: formatFileSize(file.size),
      type: file.type || ''
    });
    if (!lectureTitle) {
      setLectureTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
    setUploadStatus('idle');
    setUploadProgress(100);
    setCurrentStageIndex(0);
  };

  // Generate trigger: Called when user clicks Generate button
  const handleGenerate = () => {
    if (uploadStatus === 'processing' || uploadStatus === 'uploading') return;
    if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
    if (stageTimeoutRef.current) clearTimeout(stageTimeoutRef.current);

    // Fallback sample file if user didn't pick one yet
    const activeFile = uploadedFile || {
      name: lang === 'ar' ? 'محاضرة_الأحياء_الفصل_الثالث.mp4' : 'Biology_Lecture_Chapter3.mp4',
      sizeFormatted: '24.6 MB',
      type: 'video/mp4'
    };
    if (!uploadedFile) {
      setUploadedFile(activeFile);
    }

    setUploadStatus('uploading');
    setUploadProgress(20);
    setCurrentStageIndex(0);

    let current = 20;
    uploadTimerRef.current = setInterval(() => {
      current += Math.floor(Math.random() * 25) + 20;
      if (current >= 100) {
        clearInterval(uploadTimerRef.current);
        setUploadProgress(100);
        setUploadStatus('processing');
        runAiStages(selectedOutputs);
      } else {
        setUploadProgress(current);
      }
    }, 130);
  };

  const handleResetFile = () => {
    if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
    if (stageTimeoutRef.current) clearTimeout(stageTimeoutRef.current);
    setUploadedFile(null);
    setLectureTitle('');
    setUploadStatus('idle');
    setUploadProgress(0);
    setCurrentStageIndex(0);
    setHasGenerated(false);
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

  // Calculate available tabs based on selected/generated outputs
  const availableTabs = [
    ...(selectedOutputs.includes('graph') ? [{ id: 'map', labelAr: 'خريطة المفاهيم التفاعلية', labelEn: 'Knowledge Map', icon: Brain }] : []),
    ...(selectedOutputs.includes('transcript') ? [{ id: 'transcript', labelAr: `النص المفرغ والبحث (${lesson.transcript.length})`, labelEn: `Transcript (${lesson.transcript.length})`, icon: FileText }] : []),
    ...(selectedOutputs.includes('topics') ? [{ id: 'topics', labelAr: `محاور الحصة (${lesson.chapters.length})`, labelEn: `Topics (${lesson.chapters.length})`, icon: Layers }] : []),
    ...(selectedOutputs.includes('quiz') ? [{ id: 'quiz', labelAr: 'كويز المحاضرة (5 أسئلة)', labelEn: 'Generated Quiz (5)', icon: Sparkles }] : [])
  ];

  return (
    <div className="smart-lecture-container">
      {/* Calm Responsive Header */}
      <div className="smart-lecture-header">
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
            fontFamily: 'var(--font-arabic)',
            lineHeight: 1.4
          }}>
            {lang === 'ar' 
              ? 'تفريغ صوتي فوري، تلخيص للمحاور، وخريطة مفاهيم تفاعلية بالذكاء الاصطناعي' 
              : 'Instant audio transcription, chapter summary, and interactive knowledge map'}
          </p>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/student/converted-lectures')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: 'var(--font-arabic)',
              transition: 'all 0.15s ease'
            }}
          >
            <FolderCheck size={16} color="var(--primary)" />
            <span>{lang === 'ar' ? 'المحاضرات المحولة' : 'Converted Lectures'}</span>
          </button>

          {hasGenerated && (
            <button
              onClick={() => navigate('/student/lesson?id=l3')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                fontFamily: 'var(--font-arabic)',
                boxShadow: '0 2px 8px rgba(21, 136, 199, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              <PlayCircle size={16} />
              <span>{lang === 'ar' ? 'فتح في حصصي' : 'Open in My Lessons'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Upload Action Section with Multi-stage AI, Output Selector & Generate Action */}
      <LectureRecorderUploader
        lang={lang}
        uploadedFile={uploadedFile}
        uploadProgress={uploadProgress}
        uploadStatus={uploadStatus}
        currentStageIndex={currentStageIndex}
        selectedOutputs={selectedOutputs}
        hasGenerated={hasGenerated}
        lectureTitle={lectureTitle}
        onTitleChange={setLectureTitle}
        onGenerate={handleGenerate}
        onToggleOutput={handleToggleOutput}
        onFileUpload={handleFileUpload}
        onResetFile={handleResetFile}
      />

      {/* Generated Results: Only visible AFTER clicking Generate */}
      {hasGenerated ? (
        <div className="smart-generated-results">
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

          {/* AI Intelligence Work Area (Mindmap, Transcript, Topics, Quiz) */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xs)'
          }}>
            {/* Scrollable Tabs on Mobile */}
            <div className="smart-lecture-tabs-container">
              {availableTabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`smart-tab-btn ${isActive ? 'active' : ''}`}
                  >
                    <tab.icon size={15} />
                    <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Interactive Knowledge Map (NotebookLM Style) */}
            {activeTab === 'map' && selectedOutputs.includes('graph') && (
              <div className="smart-map-wrapper" style={{ minHeight: '580px', borderRadius: '16px', overflow: 'hidden' }}>
                <NotebookMindMapCanvas
                  treeData={lesson.notebookMindMap}
                  lessonTitle={lang === 'ar' ? lesson.titleAr : lesson.title}
                  unitTitle={lang === 'ar' ? lesson.unitAr : lesson.unit}
                  onJumpToTimestamp={(secs) => {
                    handleJumpToTime(secs);
                  }}
                  lang={lang}
                  isRtl={isRtl}
                />
              </div>
            )}

            {/* Tab 2: Transcript with Search */}
            {activeTab === 'transcript' && selectedOutputs.includes('transcript') && (
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
            {activeTab === 'topics' && selectedOutputs.includes('topics') && (
              <LectureTopicsTab
                chapters={lesson.chapters}
                lang={lang}
                isRtl={isRtl}
                onJumpToTime={handleJumpToTime}
              />
            )}

            {/* Tab 4: Quiz Tab Preview */}
            {activeTab === 'quiz' && selectedOutputs.includes('quiz') && (
              <div style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <CheckCircle2 size={26} />
                </div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  margin: '0 0 6px 0',
                  fontFamily: 'var(--font-arabic)'
                }}>
                  {lang === 'ar' ? 'تم استخراج وتوليد كويز المحاضرة بنجاح!' : 'Quiz Generated Successfully!'}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  margin: '0 0 18px 0',
                  fontFamily: 'var(--font-arabic)'
                }}>
                  {lang === 'ar' ? 'قام الذكاء الاصطناعي بصياغة 5 أسئلة اختيار من متعدد تغطي موضوعات المحاضرة.' : 'AI generated 5 MCQs based on this lecture.'}
                </p>
                <button
                  onClick={() => navigate('/student/quiz')}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-arabic)'
                  }}
                >
                  {lang === 'ar' ? 'بدء حل الكويز الآن' : 'Start Quiz Now'}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty Guidance State Before Generation */
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: '20px',
          padding: '36px 20px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px'
          }}>
            <Brain size={22} />
          </div>
          <div style={{
            fontSize: '14.5px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '4px',
            fontFamily: 'var(--font-arabic)'
          }}>
            {lang === 'ar' ? 'المحتوى الذكي بانتظار أمر التوليد' : 'Awaiting AI Generation'}
          </div>
          <div style={{
            fontSize: '12.5px',
            color: 'var(--text-secondary)',
            maxWidth: '460px',
            margin: '0 auto',
            lineHeight: 1.5,
            fontFamily: 'var(--font-arabic)'
          }}>
            {lang === 'ar' 
              ? 'اختر ملف المحاضرة أو سجّل صوتاً، وحدد المخرجات المطلوبة ثم اضغط على زر "توليد المحتوى بالذكاء الاصطناعي" لاستخراج خريطة المفاهيم والتفريغ الصوتي.'
              : 'Select lecture file or voice record, choose desired outputs, then click "Generate with AI" above to extract knowledge map and transcript.'}
          </div>
        </div>
      )}
    </div>
  );
};


