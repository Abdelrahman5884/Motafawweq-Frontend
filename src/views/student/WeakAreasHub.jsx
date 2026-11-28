import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { studentApi } from '../../services/studentApi';
import {
  AlertTriangle,
  Sparkles,
  Loader2,
  CheckCircle2,
  Lightbulb,
  Target,
  AlertCircle,
  BookOpen,
  RefreshCw,
} from 'lucide-react';

const SEVERITY_STYLES = {
  high: { bg: 'rgba(239, 68, 68, 0.1)', color: '#DC2626', ar: 'أولوية قصوى', en: 'High Priority' },
  medium: { bg: 'rgba(245, 158, 11, 0.12)', color: '#D97706', ar: 'أولوية متوسطة', en: 'Medium Priority' },
  low: { bg: 'rgba(16, 185, 129, 0.12)', color: '#059669', ar: 'مراجعة سريعة', en: 'Quick Review' },
};

export const WeakAreasHub = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const [mistakes, setMistakes] = useState([]);
  const [coachReport, setCoachReport] = useState(null);
  const [remediationQuiz, setRemediationQuiz] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const pollTimerRef = useRef(null);

  const clearPoll = useCallback(() => {
    if (pollTimerRef.current) {
      window.clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const pollDiagnosisJob = useCallback(
    async (jobUuid) => {
      for (let attempt = 0; attempt < 90; attempt += 1) {
        await new Promise((resolve) => {
          pollTimerRef.current = window.setTimeout(resolve, 2000);
        });
        const statusRes = await studentApi.ai.getJobStatus(jobUuid);
        const payload = statusRes?.data;
        const job = payload?.job;
        if (!job) continue;

        setProgressPct(Number(job.progress || 30));
        if (job.status === 'completed') {
          setCoachReport(payload.coachReport || null);
          setRemediationQuiz(Array.isArray(payload.quizQuestions) ? payload.quizQuestions : []);
          return true;
        }
        if (job.status === 'failed') {
          setErrorMsg(job.errorMessage || (isAr ? 'تعذر إتمام التشخيص بالذكاء الاصطناعي.' : 'AI diagnosis failed.'));
          return false;
        }
      }
      return false;
    },
    [isAr]
  );

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingInitial(true);
      try {
        const [mistakesRes, latestCoachRes] = await Promise.all([
          studentApi.exams.mistakeBank().catch(() => ({ data: [] })),
          studentApi.ai.getLatestWeakAreasDiagnosis().catch(() => ({ data: null })),
        ]);
        if (!mounted) return;

        setMistakes(Array.isArray(mistakesRes?.data) ? mistakesRes.data : []);
        const latest = latestCoachRes?.data;
        if (latest) {
          if (latest.coachReport) setCoachReport(latest.coachReport);
          if (Array.isArray(latest.quizQuestions)) setRemediationQuiz(latest.quizQuestions);
          if (latest.job && (latest.job.status === 'queued' || latest.job.status === 'processing')) {
            setIsDiagnosing(true);
            setProgressPct(Number(latest.job.progress || 20));
            await pollDiagnosisJob(latest.job.id);
            if (mounted) setIsDiagnosing(false);
          }
        }
      } finally {
        if (mounted) setLoadingInitial(false);
      }
    };

    load();
    return () => {
      mounted = false;
      clearPoll();
    };
  }, [pollDiagnosisJob, clearPoll]);

  const handleRunAiDiagnosis = async () => {
    if (isDiagnosing || mistakes.length === 0) return;
    clearPoll();
    setIsDiagnosing(true);
    setProgressPct(10);
    setErrorMsg('');

    try {
      const startRes = await studentApi.ai.diagnoseWeakAreas({
        includeQuiz: true,
        quizCount: 5,
      });
      const jobUuid = startRes?.data?.job?.id;
      if (!jobUuid) {
        throw new Error(isAr ? 'تعذر بدء التحليل الذكي.' : 'Failed to start AI diagnosis.');
      }
      await pollDiagnosisJob(jobUuid);
    } catch (err) {
      setErrorMsg(err?.message || (isAr ? 'تعذر الاتصال بمحرك الذكاء الاصطناعي.' : 'AI service unavailable.'));
    } finally {
      setIsDiagnosing(false);
      setProgressPct(0);
    }
  };

  const handleOpenRemediationQuiz = () => {
    if (remediationQuiz.length === 0) return;
    navigate('/student/quiz', {
      state: {
        customQuiz: {
          titleAr: isAr ? 'كويز علاجي بالـ AI لنقاط ضعفك' : 'AI Weak-Areas Remediation Quiz',
          sourceLabelAr: isAr ? 'كويز علاجي مخصص' : 'AI Remediation Quiz',
          questions: remediationQuiz,
        },
      },
    });
  };

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '26px',
      }}>
        <div style={{ maxWidth: '660px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertTriangle size={19} color="var(--danger)" />
            <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--danger)', letterSpacing: '0.5px' }}>
              {isAr ? 'المدرب الذكي لتشخيص نقاط الضعف (AI)' : 'Motafawweq AI Diagnostic Coach'}
            </span>
          </div>
          <h1 style={{
            fontSize: '25px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)',
          }}>
            {isAr ? 'مركز معالجة نقاط الضعف والمراجعة الذكية' : 'Weak Areas & Targeted Revision Hub'}
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            {isAr
              ? 'يقوم محرك متفوق للذكاء الاصطناعي بتحليل أخطائك الحقيقية في الامتحانات، وكشف السبب العلمي لكل خطأ، وبناء خطة مراجعة وكويز علاجي مخصص لك.'
              : 'Motafawweq AI diagnoses your real exam mistakes, pinpoints root misconceptions, and builds a personalized revision plan & targeted remediation quiz.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {mistakes.length > 0 && (
            <button
              type="button"
              disabled={isDiagnosing}
              onClick={handleRunAiDiagnosis}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 20px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: '800',
                cursor: isDiagnosing ? 'wait' : 'pointer',
                boxShadow: '0 4px 14px rgba(21, 136, 199, 0.28)',
              }}
            >
              {isDiagnosing ? <Loader2 size={16} className="spin" /> : coachReport ? <RefreshCw size={15} /> : <Sparkles size={16} />}
              <span>
                {isDiagnosing
                  ? (isAr ? `جاري التحليل بالـ AI (${progressPct || 15}%)...` : `Diagnosing (${progressPct || 15}%)...`)
                  : coachReport
                    ? (isAr ? 'تحديث التشخيص والخطة بالـ AI' : 'Refresh AI Diagnosis')
                    : (isAr ? 'تشخيص نقاط ضعفي بالـ AI الآن' : 'Diagnose Weak Areas with AI')}
              </span>
            </button>
          )}

          {remediationQuiz.length > 0 && (
            <button
              type="button"
              onClick={handleOpenRemediationQuiz}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 18px',
                borderRadius: '12px',
                backgroundColor: '#059669',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              <Target size={15} />
              <span>{isAr ? `ابدأ الكويز العلاجي (${remediationQuiz.length} أسئلة)` : `Start Remediation Quiz (${remediationQuiz.length} Qs)`}</span>
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div style={{
          marginBottom: '18px',
          padding: '12px 16px',
          borderRadius: '12px',
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#DC2626',
          fontSize: '13px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Live AI Progress Bar */}
      {isDiagnosing && (
        <div style={{
          marginBottom: '22px',
          padding: '20px',
          borderRadius: '18px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--primary)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
              <Loader2 size={16} color="var(--primary)" className="spin" />
              {isAr ? 'المدرب الذكي يحلّل أخطاءك ويعدّ الخطة العلاجية والكويز...' : 'AI Coach is analyzing your mistakes and preparing your remediation quiz...'}
            </span>
            <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--primary)' }}>{Math.max(10, progressPct)}%</span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--bg-subtle)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.max(10, progressPct)}%`, backgroundColor: 'var(--primary)', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {/* AI Diagnostic Report Panel */}
      {coachReport && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px solid var(--primary)',
          borderRadius: '20px',
          padding: '22px',
          marginBottom: '26px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--primary)', fontWeight: '800', fontSize: '14px' }}>
            <Sparkles size={17} />
            <span>{isAr ? 'التقرير التشخيصي الذكي وخطة العلاج' : 'AI Diagnostic Report & Study Plan'}</span>
          </div>

          <p dir="auto" style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.7, margin: '0 0 16px 0', fontWeight: '600' }}>
            {isAr ? coachReport.overviewAr : (coachReport.overviewEn || coachReport.overviewAr)}
          </p>

          {/* 3-Step Personalized Revision Plan */}
          {Array.isArray(isAr ? coachReport.revisionPlanAr : coachReport.revisionPlanEn) &&
            (isAr ? coachReport.revisionPlanAr : coachReport.revisionPlanEn).length > 0 && (
              <div style={{
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '14px',
                padding: '14px 16px',
                marginBottom: '18px',
              }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} color="#059669" />
                  <span>{isAr ? 'خطة المراجعة العلاجية المقترحة:' : 'Recommended Action Plan:'}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(isAr ? coachReport.revisionPlanAr : coachReport.revisionPlanEn).map((step, i) => (
                    <div key={i} dir="auto" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        fontSize: '11px',
                        fontWeight: '800',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}>
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Per-Concept Root-Cause Diagnosis Cards */}
          {Array.isArray(coachReport.diagnoses) && coachReport.diagnoses.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {coachReport.diagnoses.map((d) => {
                const sev = SEVERITY_STYLES[d.severity] || SEVERITY_STYLES.high;
                return (
                  <div
                    key={d.id}
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 9px', borderRadius: '8px', backgroundColor: sev.bg, color: sev.color }}>
                        {isAr ? sev.ar : sev.en}
                      </span>
                      <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--primary)' }}>
                        {d.subjectAr}
                      </span>
                    </div>

                    <h3 dir="auto" style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      {isAr ? d.topicAr : (d.topicEn || d.topicAr)}
                    </h3>

                    <div dir="auto" style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{isAr ? 'السبب الجذري: ' : 'Root Cause: '}</strong>
                      {isAr ? d.rootCauseAr : (d.rootCauseEn || d.rootCauseAr)}
                    </div>

                    <div dir="auto" style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '6px',
                      padding: '9px 11px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      lineHeight: 1.55,
                    }}>
                      <Lightbulb size={14} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{isAr ? d.actionTipAr : (d.actionTipEn || d.actionTipAr)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Real Recorded Mistakes Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {loadingInitial ? (
          <div style={{ padding: '44px 20px', textAlign: 'center', borderRadius: '18px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            <Loader2 size={26} color="var(--primary)" className="spin" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
              {isAr ? 'جاري تحميل سجل نقاط الضعف...' : 'Loading weak areas...'}
            </div>
          </div>
        ) : mistakes.length === 0 ? (
          <div style={{
            padding: '48px 24px',
            textAlign: 'center',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px dashed var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {isAr ? 'لا توجد نقاط ضعف مسجلة حالياً' : 'No Weak Areas Detected Yet'}
            </div>
            <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              {isAr
                ? 'بمجرد تصحيح امتحاناتك، سيقوم متفوق AI بتحليل أخطائك وبناء خطة مراجعة وكويز علاجي تلقائياً.'
                : 'Once your exams are graded, Motafawweq AI will automatically analyze mistakes and build your remediation plan.'}
            </div>
            <button
              type="button"
              onClick={() => navigate('/student/exam')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '9px 18px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              <BookOpen size={15} />
              <span>{isAr ? 'استعراض الامتحانات المتاحة' : 'Browse Available Exams'}</span>
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {isAr ? `الأسئلة التي تحتاج لمراجعة (${mistakes.length})` : `Recorded Exam Mistakes (${mistakes.length})`}
              </h2>
              <button
                type="button"
                onClick={() => navigate('/student/revision')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--primary)',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'إعادة الحل في مركز المراجعة' : 'Practice in Revision Center'}
              </button>
            </div>

            {mistakes.map((m, idx) => (
              <div
                key={m.id || `weak-${idx}`}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '18px',
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 9px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                    {m.subjectAr || (isAr ? 'امتحان' : 'Exam')}
                  </span>
                  {m.examTitleAr && (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                      • {m.examTitleAr}
                    </span>
                  )}
                </div>

                <div dir="auto" style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {m.questionAr}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '12.5px' }}>
                  <div style={{ padding: '8px 12px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#B91C1C' }}>
                    <strong>{isAr ? 'إجابتك: ' : 'Your Answer: '}</strong>
                    {m.wrongAnswerGivenAr}
                  </div>
                  {m.correctAnswerAr && (
                    <div style={{ padding: '8px 12px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#065F46' }}>
                      <strong>{isAr ? 'الإجابة الصحيحة: ' : 'Correct: '}</strong>
                      {m.correctAnswerAr}
                    </div>
                  )}
                </div>

                {m.explanationAr && (
                  <div dir="auto" style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{isAr ? 'التفسير العلمي: ' : 'Explanation: '}</strong>
                    {m.explanationAr}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
