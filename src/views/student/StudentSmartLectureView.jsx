import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
  Image as ImageIcon,
} from 'lucide-react';
import {
  LectureRecorderUploader,
  LectureMiniPlayer,
  LectureTranscriptTab,
  LectureTopicsTab,
  LectureAttachmentsTab,
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

const formatSecs = (s) => {
  const safe = Math.max(0, Math.floor(Number(s || 0)));
  const m = Math.floor(safe / 60).toString().padStart(2, '0');
  const sec = (safe % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

export const StudentSmartLectureView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedLectureId = searchParams.get('lecture') || '';
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const [inputMode, setInputMode] = useState('file'); // 'file' | 'mic' | 'url' | 'lesson'
  const [generatedLecture, setGeneratedLecture] = useState(null);
  const [selectedOutputs, setSelectedOutputs] = useState(['graph', 'transcript', 'topics', 'quiz']);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Multi-file queue: supports Video + Audio + Images + PDF/DOCX/PPTX/TXT all together!
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [recordedFile, setRecordedFile] = useState(null);
  const [embedUrl, setEmbedUrl] = useState('');
  const [accessibleLessons, setAccessibleLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [language, setLanguage] = useState('auto');

  const [lectureTitle, setLectureTitle] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle' | 'uploading' | 'processing' | 'done' | 'failed'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isRegeneratingQuiz, setIsRegeneratingQuiz] = useState(false);
  const [isAddingAttachments, setIsAddingAttachments] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const stageTimeoutRef = useRef(null);
  const [searchTranscript, setSearchTranscript] = useState('');

  const [activeSeconds, setActiveSeconds] = useState(0);
  const [seekNonce, setSeekNonce] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'transcript' | 'topics' | 'attachments' | 'quiz'

  // Pick first local audio/video file (or mic recording) for instant preview fallback
  const localMediaFile = useMemo(() => {
    if (recordedFile) return recordedFile;
    return (
      attachedFiles.find((f) => {
        const type = (f.type || '').toLowerCase();
        const name = (f.name || '').toLowerCase();
        return type.startsWith('video/') || type.startsWith('audio/') || /\.(mp4|mkv|mov|avi|mp3|wav|m4a|ogg|webm)$/.test(name);
      }) || null
    );
  }, [recordedFile, attachedFiles]);

  const localPreviewUrl = useMemo(
    () => (localMediaFile ? URL.createObjectURL(localMediaFile) : ''),
    [localMediaFile]
  );

  useEffect(() => {
    if (!localPreviewUrl) return undefined;
    return () => URL.revokeObjectURL(localPreviewUrl);
  }, [localPreviewUrl]);

  const resolvedMediaUrl = generatedLecture?.mediaUrl || localPreviewUrl || '';
  const resolvedMediaType =
    generatedLecture?.mediaType ||
    (localMediaFile?.type?.startsWith('video/') ? 'video' : localMediaFile ? 'audio' : 'document');

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
    attachments: Array.isArray(generatedLecture?.attachments) ? generatedLecture.attachments : [],
    summaryAr: generatedLecture?.summaryAr || '',
  };

  const tabLabels = {
    map: { ar: 'الخريطة الذهنية التفاعلية', en: 'Mind Map' },
    transcript: { ar: 'التفريغ النصي الذكي', en: 'Smart Transcript' },
    topics: { ar: 'الفصول والموضوعات', en: 'Chapters & Topics' },
    attachments: { ar: 'الصور والمرفقات', en: 'Images & Attachments' },
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

  useEffect(() => {
    let mounted = true;
    studentApi.ai
      .listLessons()
      .then((res) => {
        if (mounted && Array.isArray(res?.data)) {
          setAccessibleLessons(res.data);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const pickBestTab = useCallback((lectureData, outs) => {
    if (outs.includes('graph') && lectureData?.mindmap) {
      setActiveTab('map');
    } else if (outs.includes('transcript') && Array.isArray(lectureData?.transcript) && lectureData.transcript.length > 0) {
      setActiveTab('transcript');
    } else if (outs.includes('topics') && Array.isArray(lectureData?.topics) && lectureData.topics.length > 0) {
      setActiveTab('topics');
    } else if (Array.isArray(lectureData?.attachments) && lectureData.attachments.length > 0) {
      setActiveTab('attachments');
    } else if (outs.includes('quiz')) {
      setActiveTab('quiz');
    }
  }, []);

  const pollUntilComplete = useCallback(async (lectureId, targetOutputs) => {
    let latestData = null;
    for (let attempt = 0; attempt < 240; attempt += 1) {
      await new Promise((r) => {
        stageTimeoutRef.current = window.setTimeout(r, 2000);
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

  useEffect(() => {
    if (!requestedLectureId) return undefined;
    let mounted = true;

    studentApi.convertedLectures
      .get(requestedLectureId)
      .then(async (res) => {
        if (!mounted || !res?.data) return;
        let data = res.data;
        const outs = Array.isArray(data.outputs) && data.outputs.length > 0 ? data.outputs : ['graph', 'transcript', 'topics'];
        setGeneratedLecture(data);
        setSelectedOutputs(outs);
        setLectureTitle(data.titleAr || '');
        setHasGenerated(true);
        setOverallProgress(Number(data.overallProgress || 100));
        setCurrentStageIndex(computeStageIndex(data, outs));

        if (data.overallStatus === 'processing' || data.overallStatus === 'queued') {
          setUploadStatus('processing');
          const finished = await pollUntilComplete(data.id, outs);
          if (!mounted) return;
          if (finished) data = finished;
        }

        if (data.overallStatus === 'failed') {
          setUploadStatus('failed');
          setErrorMessage(data.error || (isAr ? 'تعذر إتمام معالجة المحاضرة بالذكاء الاصطناعي.' : 'AI processing failed.'));
        } else {
          setUploadStatus('done');
          setErrorMessage('');
          pickBestTab(data, outs);
        }
      })
      .catch((err) => {
        if (mounted) {
          setErrorMessage(err?.message || (isAr ? 'تعذر تحميل بيانات المحاضرة.' : 'Failed to load lecture.'));
        }
      });

    return () => {
      mounted = false;
    };
  }, [requestedLectureId, pollUntilComplete, pickBestTab, isAr]);

  useEffect(() => {
    return () => {
      if (stageTimeoutRef.current) window.clearTimeout(stageTimeoutRef.current);
    };
  }, []);

  const handleToggleOutput = (id) => {
    setSelectedOutputs((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev;
        const next = prev.filter((item) => item !== id);
        if (id === 'graph' && activeTab === 'map') {
          setActiveTab(next.includes('transcript') ? 'transcript' : next.includes('topics') ? 'topics' : 'attachments');
        } else if (id === 'transcript' && activeTab === 'transcript') {
          setActiveTab(next.includes('graph') ? 'map' : next.includes('topics') ? 'topics' : 'attachments');
        } else if (id === 'topics' && activeTab === 'topics') {
          setActiveTab(next.includes('graph') ? 'map' : next.includes('transcript') ? 'transcript' : 'attachments');
        } else if (id === 'quiz' && activeTab === 'quiz') {
          setActiveTab(next.includes('graph') ? 'map' : next.includes('transcript') ? 'transcript' : 'attachments');
        }
        return next;
      }
      return [...prev, id];
    });
  };

  const handleFilesAdd = (newFiles) => {
    setErrorMessage('');
    setAttachedFiles((prev) => {
      const merged = [...prev];
      for (const file of newFiles) {
        if (merged.length >= 10) break;
        const dup = merged.some((x) => x.name === file.name && x.size === file.size);
        if (!dup) merged.push(file);
      }
      if (!lectureTitle && merged.length > 0) {
        setLectureTitle(merged[0].name.replace(/\.[^/.]+$/, ''));
      }
      return merged;
    });
    setUploadStatus('idle');
  };

  const handleRemoveAttachedFile = (idx) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRecordedFileReady = (file) => {
    setErrorMessage('');
    setRecordedFile(file);
    if (file && !lectureTitle) {
      setLectureTitle(isAr ? 'تسجيل محاضرة صوتية مباشر' : 'Live Voice Lecture');
    }
  };

  const handleSelectLesson = (lid) => {
    setErrorMessage('');
    setSelectedLessonId(lid);
    const found = accessibleLessons.find((l) => l.id === lid);
    if (found) {
      setLectureTitle(found.titleAr || '');
    }
  };

  const runAiStages = async (targetOutputs) => {
    setErrorMessage('');
    setCurrentStageIndex(0);
    setOverallProgress(10);

    try {
      const filesToSend = [];
      if (recordedFile) filesToSend.push(recordedFile);
      attachedFiles.forEach((f) => {
        if (filesToSend.length < 10) filesToSend.push(f);
      });

      const pickedLesson = selectedLessonId
        ? accessibleLessons.find((l) => l.id === selectedLessonId)
        : null;

      let body;
      if (filesToSend.length > 0) {
        body = new FormData();
        filesToSend.forEach((f) => body.append('files[]', f));
        if (lectureTitle.trim()) body.append('title_ar', lectureTitle.trim());
        if (embedUrl.trim()) body.append('embed_url', embedUrl.trim());
        if (selectedLessonId) {
          body.append('lesson_uuid', selectedLessonId);
          if (pickedLesson?.subjectAr) body.append('subject_ar', pickedLesson.subjectAr);
          if (pickedLesson?.gradeAr) body.append('grade_ar', pickedLesson.gradeAr);
        }
        if (language && language !== 'auto') body.append('language', language);
        targetOutputs.forEach((out) => body.append('outputs[]', out));
      } else if (embedUrl.trim()) {
        body = {
          title_ar: lectureTitle.trim() || 'محاضرة من رابط فيديو',
          embed_url: embedUrl.trim(),
          language: language || 'auto',
          outputs: targetOutputs,
        };
      } else if (selectedLessonId) {
        body = {
          title_ar: lectureTitle.trim() || pickedLesson?.titleAr || 'محاضرة من حصصي',
          subject_ar: pickedLesson?.subjectAr || null,
          grade_ar: pickedLesson?.gradeAr || null,
          lesson_uuid: selectedLessonId,
          language: language || 'auto',
          outputs: targetOutputs,
        };
      } else {
        throw new Error(isAr ? 'يرجى إضافة ملف أو صورة أو تسجيل صوتي أو رابط أولاً.' : 'Please add a source first.');
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

      if (lectureData?.overallStatus === 'failed') {
        setUploadStatus('failed');
        setErrorMessage(
          lectureData.error ||
            (isAr ? 'تعذر إتمام التحليل بالذكاء الاصطناعي. يمكنك الضغط على «إعادة المحاولة».' : 'AI processing failed. You can retry below.')
        );
        return;
      }

      setOverallProgress(100);
      setCurrentStageIndex(1 + targetOutputs.length);
      setUploadStatus('done');
      setHasGenerated(true);
      pickBestTab(lectureData, targetOutputs);
    } catch (err) {
      setUploadStatus('idle');
      setErrorMessage(err?.message || (isAr ? 'تعذر حفظ طلب تحويل المحاضرة.' : 'Failed to start lecture AI conversion.'));
    }
  };

  const handleAddLectureAttachments = async (files, reanalyze = true) => {
    if (!generatedLecture?.id || !files.length || isAddingAttachments) return;
    setIsAddingAttachments(true);
    setErrorMessage('');

    try {
      const fd = new FormData();
      files.slice(0, 10).forEach((f) => fd.append('files[]', f));
      fd.append('reanalyze', reanalyze ? '1' : '0');

      const res = await studentApi.convertedLectures.addAttachments(generatedLecture.id, fd);
      if (res?.data) {
        setGeneratedLecture(res.data);
        if (reanalyze && (res.data.overallStatus === 'queued' || res.data.overallStatus === 'processing')) {
          setUploadStatus('processing');
          const finished = await pollUntilComplete(generatedLecture.id, selectedOutputs);
          if (finished?.overallStatus === 'failed') {
            setUploadStatus('failed');
            setErrorMessage(finished.error || (isAr ? 'تعذر تحديث التحليل بالذكاء الاصطناعي.' : 'Failed to refresh AI analysis.'));
          } else {
            setUploadStatus('done');
          }
        }
      }
    } catch (err) {
      setErrorMessage(err?.message || (isAr ? 'تعذر إضافة الصور أو الملفات للمحاضرة.' : 'Failed to add attachments.'));
    } finally {
      setIsAddingAttachments(false);
    }
  };

  const handleDeleteLectureAttachment = async (attId) => {
    if (!generatedLecture?.id || !attId) return;
    try {
      const res = await studentApi.convertedLectures.deleteAttachment(generatedLecture.id, attId);
      if (res?.data) {
        setGeneratedLecture(res.data);
      }
    } catch (err) {
      setErrorMessage(err?.message || (isAr ? 'تعذر حذف المرفق.' : 'Failed to delete attachment.'));
    }
  };

  const handleRetry = async () => {
    if (!generatedLecture?.id) return;
    setErrorMessage('');
    setUploadStatus('processing');
    setOverallProgress(10);
    setCurrentStageIndex(0);
    try {
      const res = await studentApi.convertedLectures.retry(generatedLecture.id);
      if (res?.data) setGeneratedLecture(res.data);
      const finalData = await pollUntilComplete(generatedLecture.id, selectedOutputs);
      if (finalData?.overallStatus === 'failed') {
        setUploadStatus('failed');
        setErrorMessage(finalData.error || (isAr ? 'تعذر إتمام المعالجة الذكية.' : 'AI processing failed.'));
      } else {
        setUploadStatus('done');
        setHasGenerated(true);
        pickBestTab(finalData, selectedOutputs);
      }
    } catch (err) {
      setUploadStatus('failed');
      setErrorMessage(err?.message || (isAr ? 'تعذر إعادة تشغيل المعالجة الذكية.' : 'Failed to retry AI processing.'));
    }
  };

  const handleRegenerateQuiz = async () => {
    if (!generatedLecture?.id || isRegeneratingQuiz) return;
    setIsRegeneratingQuiz(true);
    setErrorMessage('');
    try {
      const res = await studentApi.convertedLectures.generateQuiz(generatedLecture.id, { quizCount: 5 });
      if (res?.data) setGeneratedLecture(res.data);
      const finalData = await pollUntilComplete(generatedLecture.id, selectedOutputs);
      if (finalData?.overallStatus === 'failed') {
        setErrorMessage(finalData.error || (isAr ? 'تعذر توليد أسئلة الكويز بالذكاء الاصطناعي.' : 'Failed to generate AI quiz.'));
      }
    } catch (err) {
      setErrorMessage(err?.message || (isAr ? 'تعذر توليد أسئلة الكويز بالذكاء الاصطناعي.' : 'Failed to generate AI quiz.'));
    } finally {
      setIsRegeneratingQuiz(false);
    }
  };

  const handleGenerate = () => {
    if (uploadStatus === 'processing' || uploadStatus === 'uploading') return;
    setErrorMessage('');

    const hasAnySource =
      attachedFiles.length > 0 ||
      Boolean(recordedFile) ||
      Boolean(embedUrl.trim()) ||
      Boolean(selectedLessonId);

    if (!hasAnySource) {
      setErrorMessage(
        isAr
          ? 'يرجى إضافة ملف أو صورة أو تسجيل صوتي أو رابط فيديو أو اختيار حصة أولاً.'
          : 'Please add a file, photo, mic recording, video URL, or lesson first.'
      );
      return;
    }
    if (embedUrl.trim() && !embedUrl.trim().startsWith('https://')) {
      setErrorMessage(isAr ? 'يرجى إدخال رابط HTTPS صحيح (مثل رابط يوتيوب أو فيميو).' : 'Please enter a valid HTTPS video URL.');
      return;
    }

    if (stageTimeoutRef.current) window.clearTimeout(stageTimeoutRef.current);

    setUploadStatus('uploading');
    setUploadProgress(65);
    setOverallProgress(12);
    setCurrentStageIndex(0);

    window.setTimeout(() => {
      setUploadProgress(100);
      setUploadStatus('processing');
      runAiStages(selectedOutputs);
    }, 120);
  };

  const handleResetFile = () => {
    if (stageTimeoutRef.current) window.clearTimeout(stageTimeoutRef.current);
    setAttachedFiles([]);
    setRecordedFile(null);
    setEmbedUrl('');
    setSelectedLessonId('');
    setGeneratedLecture(null);
    setLectureTitle('');
    setErrorMessage('');
    setUploadStatus('idle');
    setUploadProgress(0);
    setOverallProgress(0);
    setCurrentStageIndex(0);
    setHasGenerated(false);
    setIsPlaying(false);
    setActiveSeconds(0);
  };

  const handleJumpToTime = (secs) => {
    setActiveSeconds(Math.max(0, Math.floor(Number(secs || 0))));
    setSeekNonce((n) => n + 1);
    setIsPlaying(true);
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
    {
      id: 'attachments',
      labelAr: `الصور والمرفقات (${lesson.attachments.length})`,
      labelEn: `Images & Files (${lesson.attachments.length})`,
      icon: ImageIcon,
    },
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
      {/* Header */}
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
              ? 'ادمج الفيديو والصوت مع صور السبورة وملفات PDF/Word — لتوليد تفريغ نصي، خريطة مفاهيم NotebookLM، وكويز تفاعلي بالـ AI'
              : 'Combine video, audio, whiteboard photos & PDF/Word files into a unified transcript, NotebookLM mind map & AI quiz'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
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
            }}
          >
            <FolderCheck size={16} color="var(--primary)" />
            <span>{isAr ? 'المحاضرات المحولة' : 'Converted Lectures'}</span>
          </button>

          {hasGenerated && generatedLecture?.lessonId && (
            <button
              type="button"
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
              }}
            >
              <PlayCircle size={16} />
              <span>{isAr ? 'فتح في حصصي' : 'Open in My Lessons'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-Source + Multi-File + Images Uploader */}
      <LectureRecorderUploader
        lang={lang}
        inputMode={inputMode}
        onInputModeChange={(m) => {
          setInputMode(m);
          setErrorMessage('');
        }}
        attachedFiles={attachedFiles}
        onFilesAdd={handleFilesAdd}
        onRemoveAttachedFile={handleRemoveAttachedFile}
        recordedFile={recordedFile}
        onRecordedFileReady={handleRecordedFileReady}
        embedUrl={embedUrl}
        onEmbedUrlChange={setEmbedUrl}
        accessibleLessons={accessibleLessons}
        selectedLessonId={selectedLessonId}
        onSelectLesson={handleSelectLesson}
        language={language}
        onLanguageChange={setLanguage}
        uploadProgress={uploadProgress}
        overallProgress={overallProgress}
        uploadStatus={uploadStatus}
        currentStageIndex={currentStageIndex}
        selectedOutputs={selectedOutputs}
        hasGenerated={hasGenerated}
        lectureTitle={lectureTitle}
        errorMessage={errorMessage}
        onTitleChange={setLectureTitle}
        onGenerate={handleGenerate}
        onRetry={handleRetry}
        onToggleOutput={handleToggleOutput}
        onResetFile={handleResetFile}
      />

      {/* Generated Results */}
      {hasGenerated ? (
        <div className="smart-generated-results">
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

          <LectureMiniPlayer
            lesson={lesson}
            mediaUrl={resolvedMediaUrl}
            mediaType={resolvedMediaType}
            sourceUrl={generatedLecture?.sourceUrl || ''}
            hasLinkedLesson={Boolean(generatedLecture?.lessonId)}
            activeSeconds={activeSeconds}
            seekNonce={seekNonce}
            isPlaying={isPlaying}
            formatSecs={formatSecs}
            isRtl={isRtl}
            lang={lang}
            onTimeUpdate={setActiveSeconds}
            onPlayingChange={setIsPlaying}
            onTogglePlay={() => setIsPlaying((p) => !p)}
            onOpenFullRoom={() =>
              navigate(
                generatedLecture?.lessonId
                  ? `/student/lesson?id=${encodeURIComponent(generatedLecture.lessonId)}`
                  : '/student/converted-lectures'
              )
            }
          />

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
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`smart-tab-btn ${isActive ? 'active' : ''}`}
                  >
                    <tab.icon size={15} />
                    <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                  </button>
                );
              })}
            </div>

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

            {activeTab === 'topics' && selectedOutputs.includes('topics') && (
              <LectureTopicsTab
                chapters={lesson.chapters}
                lang={lang}
                isRtl={isRtl}
                onJumpToTime={handleJumpToTime}
              />
            )}

            {activeTab === 'attachments' && (
              <LectureAttachmentsTab
                attachments={lesson.attachments}
                lang={lang}
                isUploading={isAddingAttachments}
                onAddAttachments={handleAddLectureAttachments}
                onDeleteAttachment={handleDeleteLectureAttachment}
              />
            )}

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
                      ? 'قام الذكاء الاصطناعي بصياغة أسئلة اختيار من متعدد مع تفسير علمي لكل سؤال بناءً على المحاضرة والصور والمرفقات.'
                      : 'AI formulated multiple-choice questions grounded in your lecture, images, and attached files.'
                    : isAr
                      ? 'اضغط على زر التوليد لاستخراج أسئلة اختيار من متعدد فورية من محتوى المحاضرة.'
                      : 'Click below to generate instant multiple-choice practice questions from the lecture.'}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {quizCount > 0 && (
                    <button
                      type="button"
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
                      type="button"
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
                          ? isAr ? 'جاري توليد الأسئلة بالـ AI...' : 'Generating AI Quiz...'
                          : quizCount > 0
                            ? isAr ? 'توليد أسئلة جديدة بالـ AI' : 'Generate Fresh Questions'
                            : isAr ? 'توليد الكويز بالـ AI الآن' : 'Generate AI Quiz Now'}
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
              maxWidth: '520px',
              margin: '0 auto',
              lineHeight: 1.5,
              fontFamily: 'var(--font-arabic)',
            }}
          >
            {isAr
              ? 'ارفع فيديو أو صوت وأضف عليه صور السبورة وملفات PDF/Word كما تشاء — سيقرأ الذكاء الاصطناعي الصور ويفرّغ الصوت ويدمجها في خريطة مفاهيم NotebookLM وكويز واحد.'
              : 'Upload a video or audio and attach whiteboard photos and PDF/Word notes together — AI will OCR the images, transcribe the audio, and merge everything into one mind map and quiz.'}
          </div>
        </div>
      )}
    </div>
  );
};
