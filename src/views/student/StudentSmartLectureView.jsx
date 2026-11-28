import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { studentApi } from '../../services/studentApi';
import { NotebookMindMapCanvas } from '../../components/knowledge-map/NotebookMindMapCanvas';
import {
  Sparkles,
  Brain,
  FileText,
  Layers,
  CheckCircle2,
  FolderCheck,
  PlayCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import {
  LectureRecorderUploader,
  LectureMiniPlayer,
  LectureTranscriptTab,
  LectureTopicsTab,
} from '../../features/student/smart-lecture';
import '../../features/student/smart-lecture/smart-lecture.css';

function computeStageIndex(lectureData, selectedOutputs) {
  const activeStages = [
    'extract',
    ...(selectedOutputs.includes('transcript') ? ['transcript'] : []),
    ...(selectedOutputs.includes('topics') ? ['topics'] : []),
    ...(selectedOutputs.includes('graph') ? ['graph'] : []),
    ...(selectedOutputs.includes('quiz') ? ['quiz'] : []),
  ];

  const overallStatus = lectureData?.overallStatus;
  if (overallStatus === 'completed') return activeStages.length;

  const phase = lectureData?.activePhase;
  const stage = lectureData?.activeStage || '';

  if (phase === 'stt') {
    const idx = activeStages.indexOf('transcript');
    return idx >= 0 ? idx : 1;
  }

  if (phase === 'analysis') {
    if (stage === 'generating_chapters') {
      const idx = activeStages.indexOf('topics');
      if (idx >= 0) return idx;
    }
    if (stage === 'generating_concept_graph') {
      const idx = activeStages.indexOf('graph');
      if (idx >= 0) return idx;
    }
    if (stage === 'generating_quiz') {
      const idx = activeStages.indexOf('quiz');
      if (idx >= 0) return idx;
    }
    return Math.max(1, activeStages.length - 1);
  }

  return 0;
}

export const StudentSmartLectureView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedLectureId = searchParams.get('lecture') || '';
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const [generatedLecture, setGeneratedLecture] = useState(null);
  const [selectedOutputs, setSelectedOutputs] = useState(['graph', 'transcript', 'topics', 'quiz']);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [rawFileObj, setRawFileObj] = useState(null);
  const [lectureTitle, setLectureTitle] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle' | 'uploading' | 'processing' | 'done'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isRegeneratingQuiz, setIsRegeneratingQuiz] = useState(false);

  const uploadTimerRef = useRef(null);
  const stageTimeoutRef = useRef(null);
  const [searchTranscript, setSearchTranscript] = useState('');

  // Active synchronized player & timestamp
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'transcript' | 'topics' | 'quiz'

  const lesson = {
    titleAr: generatedLecture?.titleAr || '',
    title: generatedLecture?.titleAr || '',
    unitAr: generatedLecture?.subjectAr || '',
    unit: generatedLecture?.subjectAr || '',
    durationFmt: generatedLecture?.duration || '00:00',
    transcript: Array.isArray(generatedLecture?.transcript) ? generatedLecture.transcript : [],
    chapters: Array.isArray(generatedLecture?.topics) ? generatedLecture.topics : [],
    notebookMindMap: generatedLecture?.mindmap || null,
    quizQuestions: Array.isArray(generatedLecture?.quizQuestions) ? generatedLecture.quizQuestions : [],
    summaryAr: generatedLecture?.summaryAr || '',
  };

  const tabLabels = {
    map: { ar: 'الخريطة الذهنية التفاعلية', en: 'Mind Map' },
    transcript: { ar: 'التفريغ النصي الذكي', en: 'Smart Transcript' },
    topics: { ar: 'الفصول والموضوعات', en: 'Chapters & Topics' },
    quiz: { ar: 'كويز المحاضرة', en: 'Lecture Quiz' },
  };

  useSetBreadcrumbs(
    tabLabels[activeTab]
      ? [
          {
            labelAr: tabLabels[activeTab].ar,
            labelEn: tabLabels[activeTab].en,
            onClick: () => setActiveTab('map'),
          },
        ]
      : []
  );

  const pollUntilComplete = useCallback(async (lectureId, targetOutputs) => {
    let latestData = null;
    for (let attempt = 0; attempt < 240; attempt += 1) {
      await new Promise((r) => {
        stageTimeoutRef.current = setTimeout(r, 2000);
      });
      const statusRes = await studentApi.convertedLectures.status(lectureId);
      if (statusRes?.data) {
        latestData = statusRes.data;
        setGeneratedLecture(latestData);
        setOverallProgress(Number(latestData.overallProgress || 0));
        setCurrentStageIndex(computeStageIndex(latestData, targetOutputs));

        const st = latestData.overallStatus;
        if (st === 'completed' || st === 'failed') {
          break;
        }
      }
    }
    return latestData;
  }, []);

  // Hydrate an existing converted lecture when navigated from archive (?lecture=<uuid>)
  useEffect(() => {
    if (!requestedLectureId) return undefined;
    let mounted = true;

    studentApi.convertedLectures
      .get(requestedLectureId)
      .then((res) => {
        if (!mounted || !res?.data) return;
        const data = res.data;
        const outs = Array.isArray(data.outputs) && data.outputs.length > 0 ? data.outputs : ['graph', 'transcript', 'topics'];
        setGeneratedLecture(data);
        setSelectedOutputs(outs);
        setLectureTitle(data.titleAr || '');
        if (data.fileName) {
          setUploadedFile({ name: data.fileName, sizeFormatted: data.fileSize || '' });
        }
        setHasGenerated(true);
        setUploadStatus(data.overallStatus === 'processing' || data.overallStatus === 'queued' ? 'processing' : 'done');
        setOverallProgress(Number(data.overallProgress || 100));
        setCurrentStageIndex(computeStageIndex(data, outs));

        if (data.mindmap && outs.includes('graph')) {
          setActiveTab('map');
        } else if (Array.isArray(data.transcript) && data.transcript.length > 0 && outs.includes('transcript')) {
          setActiveTab('transcript');
        } else if (Array.isArray(data.topics) && data.topics.length > 0 && outs.includes('topics')) {
          setActiveTab('topics');
        } else if (outs.includes('quiz')) {
          setActiveTab('quiz');
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [requestedLectureId]);

  const handleToggleOutput = (id) => {
    setSelectedOutputs((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev;
        const next = prev.filter((item) => item !== id);
        if (id === 'graph' && activeTab === 'map') {
          setActiveTab(next.includes('transcript') ? 'transcript' : next.includes('topics') ? 'topics' : 'quiz');
        } else if (id === 'transcript' && activeTab === 'transcript') {
          setActiveTab(next.includes('graph') ? 'map' : next.includes('topics') ? 'topics' : 'quiz');
        } else if (id === 'topics' && activeTab === 'topics') {
          setActiveTab(next.includes('graph') ? 'map' : next.includes('transcript') ? 'transcript' : 'quiz');
        } else if (id === 'quiz' && activeTab === 'quiz') {
          setActiveTab(next.includes('graph') ? 'map' : next.includes('transcript') ? 'transcript' : 'topics');
        }
        return next;
      }
      return [...prev, id];
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    }
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  useEffect(() => {
    return () => {
      if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
      if (stageTimeoutRef.current) clearTimeout(stageTimeoutRef.current);
    };
  }, []);

  // Run real multi-stage AI pipeline (Hybrid STT -> Qwen2.5 LLM for Mind Map, Topics, Quiz & Summary)
  const runAiStages = async (targetOutputs) => {
    setCurrentStageIndex(0);
    setOverallProgress(10);

    try {
      let body;
      if (rawFileObj) {
        body = new FormData();
        body.append('file', rawFileObj);
        if (lectureTitle.trim()) body.append('title_ar', lectureTitle.trim());
        targetOutputs.forEach((out) => body.append('outputs[]', out));
      } else {
        body = {
          title_ar: lectureTitle.trim() || uploadedFile?.name || 'محاضرة جديدة',
          file_name: uploadedFile?.name || null,
          file_size: uploadedFile?.sizeFormatted || null,
          outputs: targetOutputs,
        };
      }

      const res = await studentApi.convertedLectures.create(body);
      let lectureData = res?.data || null;
      if (lectureData) {
        setGeneratedLecture(lectureData);
        setOverallProgress(Number(lectureData.overallProgress || 15));
        setCurrentStageIndex(computeStageIndex(lectureData, targetOutputs));
      }

      const lectureId = lectureData?.id;
      const initialOverall = lectureData?.overallStatus;

      if (lectureId && (initialOverall === 'queued' || initialOverall === 'processing')) {
        const finalData = await pollUntilComplete(lectureId, targetOutputs);
        if (finalData) {
          lectureData = finalData;
        }
      }

      setOverallProgress(100);
      setCurrentStageIndex(1 + targetOutputs.length);
      setUploadStatus('done');
      setHasGenerated(true);

      if (targetOutputs.includes('graph') && lectureData?.mindmap) {
        setActiveTab('map');
      } else if (targetOutputs.includes('transcript') && Array.isArray(lectureData?.transcript) && lectureData.transcript.length > 0) {
        setActiveTab('transcript');
      } else if (targetOutputs.includes('topics') && Array.isArray(lectureData?.topics) && lectureData.topics.length > 0) {
        setActiveTab('topics');
      } else if (targetOutputs.includes('quiz')) {
        setActiveTab('quiz');
      }
    } catch (err) {
      setUploadStatus('idle');
      alert(err?.message || (isAr ? 'تعذر حفظ طلب تحويل المحاضرة.' : 'Failed to save lecture conversion.'));
    }
  };

  const handleRegenerateQuiz = async () => {
    if (!generatedLecture?.id || isRegeneratingQuiz) return;
    setIsRegeneratingQuiz(true);
    try {
      const res = await studentApi.convertedLectures.generateQuiz(generatedLecture.id, { quizCount: 5 });
      if (res?.data) {
        setGeneratedLecture(res.data);
      }
      await pollUntilComplete(generatedLecture.id, selectedOutputs);
    } catch (err) {
      alert(err?.message || (isAr ? 'تعذر توليد أسئلة الكويز بالذكاء الاصطناعي.' : 'Failed to generate AI quiz.'));
    } finally {
      setIsRegeneratingQuiz(false);
    }
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    setRawFileObj(file);
    setUploadedFile({
      name: file.name,
      sizeFormatted: formatFileSize(file.size),
      type: file.type || '',
    });
    if (!lectureTitle) {
      setLectureTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
    setUploadStatus('idle');
    setUploadProgress(100);
    setOverallProgress(0);
    setCurrentStageIndex(0);
  };

  const handleGenerate = () => {
    if (uploadStatus === 'processing' || uploadStatus === 'uploading') return;
    if (!uploadedFile && !lectureTitle.trim()) {
      alert(
        isAr
          ? 'يرجى اختيار ملف محاضرة أو كتابة عنوان المحاضرة أولاً.'
          : 'Please select a lecture file or enter a title first.'
      );
      return;
    }
    if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
    if (stageTimeoutRef.current) clearTimeout(stageTimeoutRef.current);

    setUploadStatus('uploading');
    setUploadProgress(60);
    setOverallProgress(12);
    setCurrentStageIndex(0);

    setTimeout(() => {
      setUploadProgress(100);
      setUploadStatus('processing');
      runAiStages(selectedOutputs);
    }, 150);
  };

  const handleResetFile = () => {
    if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
    if (stageTimeoutRef.current) clearTimeout(stageTimeoutRef.current);
    setUploadedFile(null);
    setRawFileObj(null);
    setGeneratedLecture(null);
    setLectureTitle('');
    setUploadStatus('idle');
    setUploadProgress(0);
    setOverallProgress(0);
    setCurrentStageIndex(0);
    setHasGenerated(false);
  };

  const handleJumpToTime = (secs) => {
    setActiveSeconds(secs);
    setIsPlaying(true);
  };

  const formatSecs = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const filteredTranscript = lesson.transcript.filter((t) => {
    const q = searchTranscript.trim().toLowerCase();
    if (!q) return true;
    const textAr = String(t.textAr || '').toLowerCase();
    const textEn = String(t.text || '').toLowerCase();
    return textAr.includes(q) || textEn.includes(q);
  });

  const quizCount = lesson.quizQuestions.length || generatedLecture?.questionsCount || 0;

  const availableTabs = [
    ...(selectedOutputs.includes('graph')
      ? [{ id: 'map', labelAr: 'خريطة المفاهيم التفاعلية', labelEn: 'Knowledge Map', icon: Brain }]
      : []),
    ...(selectedOutputs.includes('transcript')
      ? [
          {
            id: 'transcript',
            labelAr: `النص المفرغ والبحث (${lesson.transcript.length})`,
            labelEn: `Transcript (${lesson.transcript.length})`,
            icon: FileText,
          },
        ]
      : []),
    ...(selectedOutputs.includes('topics')
      ? [
          {
            id: 'topics',
            labelAr: `محاور الحصة (${lesson.chapters.length})`,
            labelEn: `Topics (${lesson.chapters.length})`,
            icon: Layers,
          },
        ]
      : []),
    ...(selectedOutputs.includes('quiz')
      ? [
          {
            id: 'quiz',
            labelAr: `كويز المحاضرة (${quizCount})`,
            labelEn: `Generated Quiz (${quizCount})`,
            icon: Sparkles,
          },
        ]
      : []),
  ];

  return (
    <div className="smart-lecture-container">
      {/* Calm Responsive Header */}
      <div className="smart-lecture-header">
        <div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: 1.3,
              fontFamily: 'var(--font-arabic)',
            }}
          >
            {isAr ? 'استوديو المحاضرة الذكية' : 'Smart Lecture Studio'}
          </h1>
          <p
            style={{
              fontSize: '13.5px',
              color: 'var(--text-secondary)',
              margin: '4px 0 0 0',
              fontFamily: 'var(--font-arabic)',
              lineHeight: 1.4,
            }}
          >
            {isAr
              ? 'تفريغ صوتي فوري، فهرسة للمحاور، خريطة مفاهيم NotebookLM، وكويز تفاعلي بالذكاء الاصطناعي'
              : 'Instant audio transcription, chapter indexing, interactive NotebookLM mind map, and AI quiz'}
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
              transition: 'all 0.15s ease',
            }}
          >
            <FolderCheck size={16} color="var(--primary)" />
            <span>{isAr ? 'المحاضرات المحولة' : 'Converted Lectures'}</span>
          </button>

          {hasGenerated && generatedLecture?.lessonId && (
            <button
              onClick={() => navigate(`/student/lesson?id=${encodeURIComponent(generatedLecture.lessonId)}`)}
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
                transition: 'all 0.15s ease',
              }}
            >
              <PlayCircle size={16} />
              <span>{isAr ? 'فتح في حصصي' : 'Open in My Lessons'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Upload Action Section with Multi-stage AI, Output Selector & Generate Action */}
      <LectureRecorderUploader
        lang={lang}
        uploadedFile={uploadedFile}
        uploadProgress={uploadProgress}
        overallProgress={overallProgress}
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

      {/* Generated Results */}
      {hasGenerated ? (
        <div className="smart-generated-results">
          {/* AI Executive Summary Banner */}
          {lesson.summaryAr && (
            <div
              dir="auto"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '14px 18px',
                marginBottom: '14px',
                fontSize: '13.5px',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
              }}
            >
              <strong style={{ color: 'var(--primary)', marginInlineEnd: '8px' }}>
                {isAr ? 'ملخص الذكاء الاصطناعي:' : 'AI Summary:'}
              </strong>
              <span>{lesson.summaryAr}</span>
            </div>
          )}

          {/* Synchronized Media Mini-Player Bar */}
          <LectureMiniPlayer
            lesson={lesson}
            activeSeconds={activeSeconds}
            isPlaying={isPlaying}
            formatSecs={formatSecs}
            isRtl={isRtl}
            lang={lang}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onOpenFullRoom={() =>
              navigate(
                generatedLecture?.lessonId
                  ? `/student/lesson?id=${encodeURIComponent(generatedLecture.lessonId)}`
                  : '/student/converted-lectures'
              )
            }
          />

          {/* AI Intelligence Work Area */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div className="smart-lecture-tabs-container">
              {availableTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`smart-tab-btn ${isActive ? 'active' : ''}`}
                  >
                    <tab.icon size={15} />
                    <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Interactive Knowledge Map */}
            {activeTab === 'map' && selectedOutputs.includes('graph') && (
              <div className="smart-map-wrapper" style={{ minHeight: '580px', borderRadius: '16px', overflow: 'hidden' }}>
                <NotebookMindMapCanvas
                  key={`${generatedLecture?.id || 'smart'}-${lesson.notebookMindMap?.labelAr || ''}-${lesson.notebookMindMap?.children?.length || 0}`}
                  treeData={lesson.notebookMindMap}
                  lessonTitle={isAr ? lesson.titleAr : lesson.title}
                  unitTitle={isAr ? lesson.unitAr : lesson.unit}
                  onJumpToTimestamp={(secs) => handleJumpToTime(secs)}
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

            {/* Tab 4: Real AI-Generated Quiz Tab */}
            {activeTab === 'quiz' && selectedOutputs.includes('quiz') && (
              <div style={{ padding: '28px 24px', textAlign: 'center' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <CheckCircle2 size={26} />
                </div>
                <h3
                  style={{
                    fontSize: '16.5px',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    margin: '0 0 6px 0',
                    fontFamily: 'var(--font-arabic)',
                  }}
                >
                  {quizCount > 0
                    ? isAr
                      ? `تم توليد ${quizCount} أسئلة ذكية من المحاضرة بنجاح!`
                      : `${quizCount} AI Quiz Questions Generated!`
                    : isAr
                      ? 'جاهز لتوليد كويز ذكي من هذه المحاضرة'
                      : 'Ready to Generate an AI Quiz'}
                </h3>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    margin: '0 auto 20px auto',
                    maxWidth: '500px',
                    fontFamily: 'var(--font-arabic)',
                    lineHeight: 1.6,
                  }}
                >
                  {quizCount > 0
                    ? isAr
                      ? 'قام الذكاء الاصطناعي بصياغة أسئلة اختيار من متعدد مع تفسير علمي لكل سؤال بناءً على محتوى المحاضرة الفعلي.'
                      : 'AI formulated multiple-choice questions with scientific explanations grounded in this lecture.'
                    : isAr
                      ? 'اضغط على زر التوليد لاستخراج أسئلة اختيار من متعدد فورية من نص المحاضرة.'
                      : 'Click below to generate instant multiple-choice practice questions from the lecture.'}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {quizCount > 0 && (
                    <button
                      onClick={() =>
                        navigate(`/student/quiz?convertedLecture=${encodeURIComponent(generatedLecture?.id || '')}`, {
                          state: { convertedLecture: generatedLecture },
                        })
                      }
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '11px 24px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '13.5px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-arabic)',
                      }}
                    >
                      <Sparkles size={16} />
                      <span>{isAr ? 'بدء حل الكويز الآن' : 'Start AI Quiz Now'}</span>
                    </button>
                  )}

                  {lesson.transcript.length > 0 && (
                    <button
                      onClick={handleRegenerateQuiz}
                      disabled={isRegeneratingQuiz}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '7px',
                        padding: '10px 18px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: isRegeneratingQuiz ? 'wait' : 'pointer',
                        fontFamily: 'var(--font-arabic)',
                      }}
                    >
                      {isRegeneratingQuiz ? <Loader2 size={15} className="spin" /> : <RefreshCw size={15} />}
                      <span>
                        {isRegeneratingQuiz
                          ? isAr
                            ? 'جاري توليد الأسئلة بالـ AI...'
                            : 'Generating AI Quiz...'
                          : quizCount > 0
                            ? isAr
                              ? 'توليد أسئلة جديدة بالـ AI'
                              : 'Generate Fresh Questions'
                            : isAr
                              ? 'توليد الكويز بالـ AI الآن'
                              : 'Generate AI Quiz Now'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px dashed var(--border-subtle)',
            borderRadius: '20px',
            padding: '36px 20px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px',
            }}
          >
            <Brain size={22} />
          </div>
          <div
            style={{
              fontSize: '14.5px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '4px',
              fontFamily: 'var(--font-arabic)',
            }}
          >
            {isAr ? 'المحتوى الذكي بانتظار أمر التوليد' : 'Awaiting AI Generation'}
          </div>
          <div
            style={{
              fontSize: '12.5px',
              color: 'var(--text-secondary)',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.5,
              fontFamily: 'var(--font-arabic)',
            }}
          >
            {isAr
              ? 'ارفع ملف صوتي أو فيديو أو PDF، وحدد المخرجات المطلوبة (خريطة مفاهيم، تفريغ نصي، محاور، كويز) ثم اضغط «توليد المحتوى بالذكاء الاصطناعي».'
              : 'Upload an audio, video, or PDF file, pick your desired outputs (mind map, transcript, topics, quiz), and click "Generate with AI".'}
          </div>
        </div>
      )}
    </div>
  );
};
