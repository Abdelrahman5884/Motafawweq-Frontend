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
} from 'lucide-react';
import { ProcessingStepper } from '../../features/teacher/ai-processing';

const STAGE_LABELS = {
  queued: { ar: 'في قائمة الانتظار لبدء التحليل الصوتي...', en: 'Queued for AI audio analysis...' },
  downloading_media: { ar: 'جاري تجهيز الصوت من رابط الفيديو...', en: 'Extracting audio from video link...' },
  extracting_audio: { ar: 'جاري استخراج الصوت وعزل الضوضاء وضبط الوضوح...', en: 'Extracting audio & suppressing noise...' },
  loading_model: { ar: 'جاري تجهيز محرك Whisper large-v3...', en: 'Loading Whisper large-v3 engine...' },
  detecting_language: { ar: 'جاري اكتشاف لغة الشرح تلقائياً...', en: 'Auto-detecting spoken language...' },
  transcribing: { ar: 'جاري التفريغ النصي الذكي وتوقيت الفقرات...', en: 'Transcribing speech with timestamps...' },
  post_processing: { ar: 'جاري تنسيق الفقرات وحفظ التفريغ النصي...', en: 'Formatting paragraphs & saving transcript...' },
  completed: { ar: 'اكتمل التفريغ النصي بنجاح!', en: 'Transcription completed successfully!' },
  failed: { ar: 'تعذر إتمام التفريغ النصي.', en: 'Transcription failed.' },
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

  const [selectedFeatures] = useState(() => {
    try {
      const stored = sessionStorage.getItem('selectedAIFeatures');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore storage errors
    }
    return { speechToText: true, conceptGraph: true, chapterIndexing: true };
  });

  const wantsStt = selectedFeatures.speechToText !== false;

  const [job, setJob] = useState(null);
  const [transcriptCount, setTranscriptCount] = useState(0);
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

  const pollStatus = useCallback(async () => {
    if (!lessonUuid) return;
    try {
      const res = await teacherApi.workspace.getAiStatus(lessonUuid);
      const data = res?.data;
      if (!data) return;

      if (data.job) {
        setJob(data.job);
      }
      if (typeof data.transcriptCount === 'number') {
        setTranscriptCount(data.transcriptCount);
      }

      const status = data.job?.status;
      if (status === 'completed') {
        setErrorMsg('');
        clearPollTimer();
        return;
      }
      if (status === 'failed') {
        setErrorMsg(
          data.job?.error ||
            (isAr
              ? 'تعذر إتمام التفريغ النصي. تأكد من تشغيل خدمة الذكاء الاصطناعي وأعد المحاولة.'
              : 'Transcription failed. Please verify the AI service is running and try again.')
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
  }, [lessonUuid, isAr, clearPollTimer]);

  const startPipeline = useCallback(
    async (force = false) => {
      if (!lessonUuid) {
        setErrorMsg(isAr ? 'لم يتم تحديد الحصة المطلوب معالجتها.' : 'No target lesson specified.');
        return;
      }

      clearPollTimer();
      setErrorMsg('');
      setIsRetrying(force);

      if (!wantsStt) {
        setJob({ status: 'completed', progress: 100, stage: 'completed' });
        setIsRetrying(false);
        return;
      }

      try {
        setJob((prev) => ({
          ...(prev || {}),
          status: 'queued',
          progress: 6,
          stage: 'extracting_audio',
        }));

        const res = await teacherApi.workspace.startTranscription(lessonUuid, {
          language: 'auto',
          force,
        });

        const nextJob = res?.data?.job || null;
        if (nextJob) {
          setJob(nextJob);
          if (typeof nextJob.segmentsCount === 'number') {
            setTranscriptCount(nextJob.segmentsCount);
          }
        }

        if (nextJob?.status === 'completed') {
          await pollStatus();
        } else if (nextJob?.status === 'failed') {
          setErrorMsg(nextJob.error || (isAr ? 'تعذر بدء التفريغ النصي.' : 'Failed to start transcription.'));
        } else {
          pollTimerRef.current = window.setTimeout(() => {
            pollStatus();
          }, 1500);
        }
      } catch (err) {
        setJob((prev) => ({
          ...(prev || {}),
          status: 'failed',
          stage: 'failed',
          progress: prev?.progress || 0,
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
    [lessonUuid, wantsStt, isAr, clearPollTimer, pollStatus]
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

  const status = job?.status || 'queued';
  const isComplete = status === 'completed';
  const isFailed = status === 'failed';
  const progress = isComplete ? 100 : Math.max(5, Math.min(99, Number(job?.progress || 8)));

  const steps = useMemo(() => {
    const list = [
      {
        id: 'extract',
        title: isAr
          ? 'تجهيز ملف الحصة واستخراج الصوت وعزل الضوضاء الخلفية'
          : 'Media Audio Extraction & Classroom Noise Suppression',
        icon: Video,
        threshold: 20,
      },
    ];

    if (wantsStt) {
      list.push(
        {
          id: 'detect_lang',
          title: isAr
            ? 'اكتشاف لغة الشرح تلقائياً (العربية / اللهجة المصرية / الإنجليزية / أي لغة)'
            : 'Automatic Multilingual Detection (Arabic, English & 99+ languages)',
          icon: Globe,
          threshold: 35,
        },
        {
          id: 'speechToText',
          title: isAr
            ? 'التفريغ النصي الذكي بدقة عالية (Whisper large-v3) مع التوقيت الزمني'
            : 'High-Accuracy Whisper large-v3 Speech-to-Text & Timestamps',
          icon: FileText,
          threshold: 95,
        }
      );
    }

    if (selectedFeatures.chapterIndexing !== false) {
      list.push({
        id: 'chapters',
        title: isAr
          ? 'تجهيز فهرسة الفصول والتوقيتات في مساحة العمل'
          : 'Chapter Indexing Workspace Preparation',
        icon: Clock,
        threshold: 100,
      });
    }

    if (selectedFeatures.conceptGraph !== false) {
      list.push({
        id: 'graph',
        title: isAr
          ? 'تجهيز مساحة خريطة المفاهيم التفاعلية (NotebookLM)'
          : 'Interactive Concept Graph Workspace Preparation',
        icon: Share2,
        threshold: 100,
      });
    }

    return list;
  }, [selectedFeatures, wantsStt, isAr]);

  const currentStepIndex = useMemo(() => {
    if (isComplete) return steps.length - 1;
    const current = steps.findIndex((s) => progress < s.threshold);
    return current === -1 ? steps.length - 1 : current;
  }, [progress, steps, isComplete]);

  const stageLabel =
    STAGE_LABELS[job?.stage]?.[isAr ? 'ar' : 'en'] ||
    (isComplete
      ? isAr
        ? 'اكتمل التفريغ النصي بنجاح!'
        : 'Transcription completed!'
      : isAr
        ? 'جاري تحليل الصوت وتوليد التفريغ النصي...'
        : 'Analyzing audio and generating transcript...');

  const detectedLangLabel = job?.detectedLanguage
    ? isAr
      ? job.detectedLanguageNameAr || job.detectedLanguage.toUpperCase()
      : job.detectedLanguageNameEn || job.detectedLanguage.toUpperCase()
    : null;

  const detectedProbPct =
    typeof job?.languageProbability === 'number' && job.languageProbability > 0
      ? Math.round(job.languageProbability * 100)
      : null;

  const workspaceUrl = lessonUuid
    ? `/teacher/workspace?lesson=${encodeURIComponent(lessonUuid)}&tab=transcript`
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
          maxWidth: '680px',
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
                ? 'محرك متفوق للذكاء الاصطناعي (Whisper large-v3)'
                : 'Motafawweq AI Engine (Whisper large-v3)'}
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
              ? 'اكتمل التفريغ النصي للحصة بنجاح!'
              : 'Lesson Transcript Generated Successfully!'
            : isFailed
              ? isAr
                ? 'تعذر إتمام التفريغ النصي'
                : 'Transcription Could Not Complete'
              : isAr
                ? 'جاري التفريغ النصي الذكي للحصة...'
                : 'Transcribing Your Lesson with AI...'}
        </h1>

        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
          {stageLabel}
        </p>

        {/* Live Telemetry Pills (Detected Language, Segments Count, Speed) */}
        {(detectedLangLabel || transcriptCount > 0 || job?.segmentsCount > 0) && (
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
                  {isAr ? `اللغة المكتشفة: ${detectedLangLabel}` : `Detected: ${detectedLangLabel}`}
                  {detectedProbPct ? ` (${detectedProbPct}%)` : ''}
                </span>
              </span>
            )}

            {(transcriptCount > 0 || job?.segmentsCount > 0) && (
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
                    ? `${transcriptCount || job?.segmentsCount} فقرة نصية مؤقتة`
                    : `${transcriptCount || job?.segmentsCount} timestamped segments`}
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {isFailed && (
            <button
              type="button"
              disabled={isRetrying}
              onClick={() => startPipeline(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 26px',
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
              <span>{isAr ? 'إعادة محاولة التفريغ النصي' : 'Retry Transcription'}</span>
            </button>
          )}

          {(isComplete || isFailed) ? (
            <button
              type="button"
              onClick={() => navigate(workspaceUrl)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '13px 30px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isComplete ? 'var(--primary)' : 'var(--bg-subtle)',
                color: isComplete ? '#FFFFFF' : 'var(--text-primary)',
                border: isComplete ? 'none' : '1px solid var(--border-medium)',
                fontSize: '14.5px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: isComplete ? '0 8px 24px rgba(21, 136, 199, 0.35)' : 'none',
              }}
            >
              <span>
                {isComplete
                  ? isAr
                    ? 'عرض التفريغ النصي في مساحة العمل'
                    : 'Open Transcript in Workspace'
                  : isAr
                    ? 'الانتقال لمساحة عمل الدرس'
                    : 'Go to Lesson Workspace'}
              </span>
              <ArrowRight size={16} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
            </button>
          ) : (
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              {isAr
                ? 'يتم تشغيل موديل الذكاء الاصطناعي فعلياً على صوت الحصة — يرجى عدم إغلاق الصفحة...'
                : 'Whisper large-v3 is actively transcribing your lesson audio...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIProcessingScreen;
