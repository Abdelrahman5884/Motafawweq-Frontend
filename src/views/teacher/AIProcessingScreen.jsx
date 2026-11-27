import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { teacherApi } from '../../services/teacherApi';
import {
  Sparkles,
  FileText,
  Share2,
  Video,
  ArrowRight,
  Clock,
  Globe,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { ProcessingStepper } from '../../features/teacher/ai-processing';

const STAGE_LABELS = {
  queued: { ar: 'في قائمة الانتظار لبدء المعالجة الذكية...', en: 'Queued for AI processing...' },
  downloading_media: { ar: 'جاري تجهيز الصوت من رابط الفيديو...', en: 'Extracting audio from video link...' },
  extracting_audio: { ar: 'جاري استخراج الصوت وعزل الضوضاء وضبط الوضوح...', en: 'Extracting audio & suppressing noise...' },
  loading_model: { ar: 'جاري تجهيز محرك التفريغ الصوتي الذكي...', en: 'Loading AI Speech-to-Text engine...' },
  detecting_language: { ar: 'جاري اكتشاف لغة الشرح تلقائياً...', en: 'Auto-detecting spoken language...' },
  transcribing: { ar: 'جاري التفريغ النصي الذكي وتوقيت الفقرات...', en: 'Transcribing speech with timestamps...' },
  preparing_context: { ar: 'جاري تجهيز سياق الحصة للتحليل الذكي...', en: 'Preparing lesson transcript for AI analysis...' },
  loading_llm: { ar: 'جاري تجهيز محرك التحليل الذكي (Qwen2.5 LLM)...', en: 'Loading bilingual AI analysis model...' },
  generating_chapters: { ar: 'جاري فهرسة فصول الحصة واستخراج التوقيتات الزمنية...', en: 'Indexing timestamped lesson chapters...' },
  generating_concept_graph: { ar: 'جاري بناء خريطة المفاهيم التفاعلية (NotebookLM)...', en: 'Building interactive NotebookLM concept map...' },
  generating_quiz: { ar: 'جاري توليد أسئلة المراجعة...', en: 'Generating review questions...' },
  post_processing: { ar: 'جاري مراجعة المخرجات وحفظها في مساحة العمل...', en: 'Validating and saving AI outputs...' },
  completed: { ar: 'اكتملت جميع مخرجات الذكاء الاصطناعي بنجاح!', en: 'All AI outputs generated successfully!' },
  failed: { ar: 'تعذر إتمام المعالجة الذكية.', en: 'AI processing failed.' },
};

export const AIProcessingScreen = () => {
  const [searchParams] = useSearchParams();
  const { navigate } = useAuth();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const lessonUuid =
    searchParams.get('lesson') ||
    (() => {
      try {
        return sessionStorage.getItem('currentLessonUuid') || '';
      } catch {
        return '';
      }
    })();

  const [selectedFeatures, setSelectedFeatures] = useState(() => {
    try {
      const stored = sessionStorage.getItem('selectedAIFeatures');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore storage errors
    }
    return { speechToText: true, conceptGraph: true, chapterIndexing: true };
  });

  const wantsStt = Boolean(selectedFeatures.speechToText);
  const wantsChapters = Boolean(selectedFeatures.chapterIndexing);
  const wantsConceptGraph = Boolean(selectedFeatures.conceptGraph);
  const wantsAnyFeature = wantsStt || wantsChapters || wantsConceptGraph;

  const [pipelineState, setPipelineState] = useState({
    overallStatus: 'queued',
    overallProgress: 6,
    activePhase: 'stt',
    activeStage: 'queued',
    sttJob: null,
    analysisJob: null,
    transcriptCount: 0,
    chaptersCount: 0,
    conceptsCount: 0,
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);

  const startedLessonRef = useRef('');
  const pollTimerRef = useRef(null);

  const clearPollTimer = useCallback(() => {
    if (pollTimerRef.current) {
      window.clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const applyServerPayload = useCallback((data) => {
    if (!data) return;
    if (data.aiFeatures && typeof data.aiFeatures === 'object') {
      setSelectedFeatures((prev) => ({ ...prev, ...data.aiFeatures }));
    }
    setPipelineState((prev) => ({
      overallStatus: data.overallStatus || data.job?.status || prev.overallStatus,
      overallProgress:
        typeof data.overallProgress === 'number'
          ? data.overallProgress
          : typeof data.job?.progress === 'number'
            ? data.job.progress
            : prev.overallProgress,
      activePhase: data.activePhase || prev.activePhase,
      activeStage: data.activeStage || data.job?.stage || prev.activeStage,
      sttJob: data.sttJob ?? data.job ?? prev.sttJob,
      analysisJob: data.analysisJob ?? prev.analysisJob,
      transcriptCount: typeof data.transcriptCount === 'number' ? data.transcriptCount : prev.transcriptCount,
      chaptersCount: typeof data.chaptersCount === 'number' ? data.chaptersCount : prev.chaptersCount,
      conceptsCount: typeof data.conceptsCount === 'number' ? data.conceptsCount : prev.conceptsCount,
    }));
  }, []);

  const pollStatus = useCallback(async () => {
    if (!lessonUuid) return;
    try {
      const res = await teacherApi.workspace.getAiStatus(lessonUuid);
      const data = res?.data;
      if (!data) return;

      applyServerPayload(data);

      const status = data.overallStatus || data.job?.status;
      if (status === 'completed') {
        setErrorMsg('');
        clearPollTimer();
        return;
      }
      if (status === 'failed') {
        setErrorMsg(
          data.error ||
            data.analysisJob?.error ||
            data.sttJob?.error ||
            data.job?.error ||
            (isAr
              ? 'تعذر إتمام المعالجة الذكية. تأكد من تشغيل خدمة الذكاء الاصطناعي وأعد المحاولة.'
              : 'AI processing failed. Please verify the AI service is running and try again.')
        );
        clearPollTimer();
        return;
      }

      if (status === 'queued' || status === 'processing') {
        clearPollTimer();
        pollTimerRef.current = window.setTimeout(() => {
          pollStatus();
        }, 2000);
      }
    } catch (err) {
      setErrorMsg(
        err?.message ||
          (isAr ? 'تعذر متابعة حالة المعالجة بالذكاء الاصطناعي.' : 'Failed to check AI processing status.')
      );
      clearPollTimer();
    }
  }, [lessonUuid, isAr, clearPollTimer, applyServerPayload]);

  const startPipeline = useCallback(
    async (force = false) => {
      if (!lessonUuid) {
        setErrorMsg(isAr ? 'لم يتم تحديد الحصة المطلوب معالجتها.' : 'No target lesson specified.');
        return;
      }

      clearPollTimer();
      setErrorMsg('');
      setIsRetrying(force);

      if (!wantsAnyFeature) {
        setPipelineState((prev) => ({
          ...prev,
          overallStatus: 'completed',
          overallProgress: 100,
          activePhase: 'completed',
          activeStage: 'completed',
        }));
        setIsRetrying(false);
        return;
      }

      try {
        setPipelineState((prev) => ({
          ...prev,
          overallStatus: 'queued',
          overallProgress: 6,
          activeStage: 'extracting_audio',
        }));

        const res = await teacherApi.workspace.startAiPipeline(lessonUuid, {
          features: selectedFeatures,
          language: 'auto',
          force,
        });

        const data = res?.data;
        if (data) {
          applyServerPayload(data);
        }

        const nextStatus = data?.overallStatus || data?.job?.status;
        if (nextStatus === 'completed') {
          setErrorMsg('');
        } else if (nextStatus === 'failed') {
          setErrorMsg(
            data?.error || (isAr ? 'تعذر بدء المعالجة الذكية.' : 'Failed to start AI processing.')
          );
        } else {
          pollTimerRef.current = window.setTimeout(() => {
            pollStatus();
          }, 1500);
        }
      } catch (err) {
        setPipelineState((prev) => ({
          ...prev,
          overallStatus: 'failed',
          activePhase: 'failed',
          activeStage: 'failed',
        }));
        setErrorMsg(
          err?.message ||
            (isAr
              ? 'تعذر الاتصال بمحرك الذكاء الاصطناعي. تأكد من تشغيل خدمة Motafawweq AI.'
              : 'Could not reach the AI engine. Please make sure Motafawweq AI service is running.')
        );
      } finally {
        setIsRetrying(false);
      }
    },
    [lessonUuid, selectedFeatures, wantsAnyFeature, isAr, clearPollTimer, pollStatus, applyServerPayload]
  );

  useEffect(() => {
    if (!lessonUuid) return undefined;
    if (startedLessonRef.current !== lessonUuid) {
      startedLessonRef.current = lessonUuid;
      startPipeline(false);
    }
    return () => {
      clearPollTimer();
    };
  }, [lessonUuid, startPipeline, clearPollTimer]);

  const status = pipelineState.overallStatus || 'queued';
  const isComplete = status === 'completed';
  const isFailed = status === 'failed';
  const progress = isComplete ? 100 : Math.max(5, Math.min(99, Number(pipelineState.overallProgress || 8)));

  const hasAnalysisSteps = wantsChapters || wantsConceptGraph;

  const steps = useMemo(() => {
    const sttCap = hasAnalysisSteps ? 58 : 95;
    const list = [
      {
        id: 'extract',
        title: isAr
          ? 'تجهيز ملف الحصة واستخراج الصوت وعزل الضوضاء الخلفية'
          : 'Media Audio Extraction & Classroom Noise Suppression',
        icon: Video,
        threshold: Math.round(sttCap * 0.25),
      },
      {
        id: 'detect_lang',
        title: isAr
          ? 'اكتشاف لغة الشرح تلقائياً (العربية / اللهجة المصرية / الإنجليزية / أي لغة)'
          : 'Automatic Multilingual Detection (Arabic, English & 99+ languages)',
        icon: Globe,
        threshold: Math.round(sttCap * 0.45),
      },
      {
        id: 'speechToText',
        title: isAr
          ? 'التفريغ النصي الذكي (عربي/مصري + كلمات إنجليزي + باقي اللغات) مع التوقيت'
          : 'High-Accuracy Egyptian Arabic Code-Switching & Multilingual Speech-to-Text',
        icon: FileText,
        threshold: sttCap,
      },
    ];

    if (wantsChapters) {
      list.push({
        id: 'chapters',
        title: isAr
          ? 'فهرسة الفصول والتوقيتات الزمنية بالذكاء الاصطناعي'
          : 'AI Timestamped Chapter Indexing',
        icon: Clock,
        threshold: wantsConceptGraph ? 78 : 98,
      });
    }

    if (wantsConceptGraph) {
      list.push({
        id: 'graph',
        title: isAr
          ? 'استخراج وبناء خريطة المفاهيم التفاعلية (NotebookLM AI)'
          : 'Interactive NotebookLM Concept Graph Generation',
        icon: Share2,
        threshold: 99,
      });
    }

    return list;
  }, [hasAnalysisSteps, wantsChapters, wantsConceptGraph, isAr]);

  const currentStepIndex = useMemo(() => {
    if (isComplete) return steps.length - 1;
    const current = steps.findIndex((s) => progress < s.threshold);
    return current === -1 ? steps.length - 1 : current;
  }, [progress, steps, isComplete]);

  const stageLabel =
    STAGE_LABELS[pipelineState.activeStage]?.[isAr ? 'ar' : 'en'] ||
    (isComplete
      ? isAr
        ? 'اكتملت المعالجة الذكية بنجاح!'
        : 'AI processing completed!'
      : isAr
        ? 'جاري تحليل الحصة وتوليد المخرجات الذكية...'
        : 'Analyzing lesson and generating AI outputs...');

  const sttJob = pipelineState.sttJob;
  const detectedLangLabel = sttJob?.detectedLanguage
    ? isAr
      ? sttJob.detectedLanguageNameAr || sttJob.detectedLanguage.toUpperCase()
      : sttJob.detectedLanguageNameEn || sttJob.detectedLanguage.toUpperCase()
    : null;

  const detectedProbPct =
    typeof sttJob?.languageProbability === 'number' && sttJob.languageProbability > 0
      ? Math.round(sttJob.languageProbability * 100)
      : null;

  const defaultTab = wantsConceptGraph ? 'graph' : wantsStt ? 'transcript' : 'media';
  const buildWorkspaceUrl = (tab) =>
    lessonUuid
      ? `/teacher/workspace?lesson=${encodeURIComponent(lessonUuid)}&tab=${encodeURIComponent(tab)}`
      : '/teacher/workspace';

  return (
    <div
      style={{
        minHeight: 'calc(100vh - var(--topbar-height))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        backgroundColor: 'var(--bg-app)',
        fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <div
        style={{
          maxWidth: '700px',
          width: '100%',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          textAlign: 'center',
        }}
      >
        {/* Glow AI Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: isFailed ? 'rgba(239, 68, 68, 0.12)' : 'var(--primary-surface)',
            color: isFailed ? '#EF4444' : 'var(--primary)',
            fontSize: '13px',
            fontWeight: '700',
            marginBottom: '20px',
          }}
        >
          {isFailed ? <AlertCircle size={16} /> : <Sparkles size={16} />}
          <span>
            {isFailed
              ? isAr
                ? 'توقفت المعالجة الذكية'
                : 'AI Processing Interrupted'
              : isAr
                ? 'محرك متفوق للذكاء الاصطناعي (QwenCleo-ASR + Qwen2.5 LLM)'
                : 'Motafawweq AI Engine (QwenCleo-ASR + Qwen2.5 LLM)'}
          </span>
        </div>

        <h1
          style={{
            fontSize: '25px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            marginBottom: '10px',
            fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)',
          }}
        >
          {isComplete
            ? isAr
              ? 'اكتملت المعالجة الذكية للحصة بنجاح!'
              : 'Lesson AI Pipeline Completed!'
            : isFailed
              ? isAr
                ? 'تعذر إتمام المعالجة الذكية'
                : 'AI Processing Could Not Complete'
              : isAr
                ? 'جاري تجهيز مخرجات الذكاء الاصطناعي للحصة...'
                : 'Generating AI Lesson Intelligence...'}
        </h1>

        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
          {stageLabel}
        </p>

        {/* Live Telemetry Pills */}
        {(detectedLangLabel ||
          pipelineState.transcriptCount > 0 ||
          pipelineState.chaptersCount > 0 ||
          pipelineState.conceptsCount > 0) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '24px',
            }}
          >
            {detectedLangLabel && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  fontSize: '12px',
                  fontWeight: '800',
                }}
              >
                <Globe size={13} />
                <span>
                  {isAr ? `اللغة: ${detectedLangLabel}` : `Language: ${detectedLangLabel}`}
                  {detectedProbPct ? ` (${detectedProbPct}%)` : ''}
                </span>
              </span>
            )}

            {pipelineState.transcriptCount > 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#059669',
                  fontSize: '12px',
                  fontWeight: '800',
                }}
              >
                <CheckCircle2 size={13} />
                <span>
                  {isAr
                    ? `${pipelineState.transcriptCount} فقرة نصية`
                    : `${pipelineState.transcriptCount} transcript segments`}
                </span>
              </span>
            )}

            {pipelineState.chaptersCount > 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(14, 165, 233, 0.12)',
                  color: '#0284C7',
                  fontSize: '12px',
                  fontWeight: '800',
                }}
              >
                <Layers size={13} />
                <span>
                  {isAr
                    ? `${pipelineState.chaptersCount} فصول زمنية`
                    : `${pipelineState.chaptersCount} chapters`}
                </span>
              </span>
            )}

            {pipelineState.conceptsCount > 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(139, 92, 246, 0.12)',
                  color: '#7C3AED',
                  fontSize: '12px',
                  fontWeight: '800',
                }}
              >
                <Share2 size={13} />
                <span>
                  {isAr
                    ? `${pipelineState.conceptsCount} مفهوم في الخريطة`
                    : `${pipelineState.conceptsCount} map concepts`}
                </span>
              </span>
            )}
          </div>
        )}

        {/* Error Box */}
        {errorMsg && (
          <div
            style={{
              marginBottom: '24px',
              padding: '14px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.09)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontSize: '13px',
              fontWeight: '700',
              textAlign: isRtl ? 'right' : 'left',
              lineHeight: 1.6,
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Progress Bar & Percentage */}
        <div style={{ marginBottom: '30px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: '700',
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>
              {isAr ? 'نسبة الإنجاز الفعلية' : 'Live Pipeline Progress'}
            </span>
            <span
              style={{
                color: isFailed ? '#EF4444' : 'var(--primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '18px',
                fontWeight: '900',
              }}
            >
              {progress}%
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '10px',
              backgroundColor: 'var(--border-subtle)',
              borderRadius: '5px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: isFailed
                  ? '#EF4444'
                  : 'linear-gradient(90deg, #1588C7 0%, #38BDF8 50%, #10B981 100%)',
                borderRadius: '5px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Real Step Pipeline Status List */}
        <ProcessingStepper
          steps={steps}
          progress={progress}
          currentStepIndex={currentStepIndex}
          isComplete={isComplete}
          isRtl={isRtl}
        />

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {isFailed && (
            <button
              type="button"
              disabled={isRetrying}
              onClick={() => startPipeline(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '14px',
                fontWeight: '800',
                cursor: isRetrying ? 'not-allowed' : 'pointer',
              }}
            >
              <RefreshCw size={15} />
              <span>{isAr ? 'إعادة محاولة المعالجة الذكية' : 'Retry AI Pipeline'}</span>
            </button>
          )}

          {isComplete || isFailed ? (
            <>
              <button
                type="button"
                onClick={() => navigate(buildWorkspaceUrl(defaultTab))}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '13px 28px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isComplete ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: isComplete ? '#FFFFFF' : 'var(--text-primary)',
                  border: isComplete ? 'none' : '1px solid var(--border-medium)',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: isComplete ? '0 8px 24px rgba(21, 136, 199, 0.35)' : 'none',
                }}
              >
                <span>
                  {isComplete
                    ? wantsConceptGraph
                      ? isAr
                        ? 'عرض خريطة المفاهيم في مساحة العمل'
                        : 'Open Concept Map in Workspace'
                      : isAr
                        ? 'عرض النتائج في مساحة العمل'
                        : 'Open Results in Workspace'
                    : isAr
                      ? 'الانتقال لمساحة عمل الدرس'
                      : 'Go to Lesson Workspace'}
                </span>
                <ArrowRight size={16} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
              </button>

              {isComplete && wantsStt && defaultTab !== 'transcript' && (
                <button
                  type="button"
                  onClick={() => navigate(buildWorkspaceUrl('transcript'))}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  <FileText size={15} />
                  <span>{isAr ? 'التفريغ النصي' : 'Transcript'}</span>
                </button>
              )}

              {isComplete && wantsChapters && defaultTab !== 'media' && (
                <button
                  type="button"
                  onClick={() => navigate(buildWorkspaceUrl('media'))}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  <Clock size={15} />
                  <span>{isAr ? 'الفصول والتوقيتات' : 'Chapters'}</span>
                </button>
              )}
            </>
          ) : (
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              {isAr
                ? 'يتم تشغيل نماذج الذكاء الاصطناعي فعلياً على محتوى الحصة — يرجى عدم إغلاق الصفحة...'
                : 'AI models are actively processing your lesson — please keep this page open...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIProcessingScreen;
