import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { studentApi } from '../../services/studentApi';
import confetti from 'canvas-confetti';
import {
  MistakeBankList,
  MistakeRetryModal,
  BookmarkedLessonsTab,
  PreExamChecklistTab,
} from '../../features/student/revision';

export const StudentRevisionView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState('mistakes');
  const [mistakes, setMistakes] = useState([]);
  const [bookmarkedLessons, setBookmarkedLessons] = useState([]);
  const [activeMistakeModal, setActiveMistakeModal] = useState(null);
  const [selectedRetryOption, setSelectedRetryOption] = useState(null);
  const [retryResult, setRetryResult] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [isGeneratingDrill, setIsGeneratingDrill] = useState(false);
  const [drillError, setDrillError] = useState('');

  const pollTimerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    studentApi.dashboard.revision()
      .then((res) => {
        if (!mounted) return;
        const data = res?.data || {};
        const rawMistakes = Array.isArray(data.mistakeBank) ? data.mistakeBank : [];
        setMistakes(
          rawMistakes.map((m) => {
            const opts = Array.isArray(m.optionsAr) ? m.optionsAr : [];
            const wrongText =
              m.wrongAnswerGivenAr ||
              (m.selectedIndex !== null && m.selectedIndex !== undefined && opts[m.selectedIndex]
                ? opts[m.selectedIndex]
                : (isAr ? 'لم يتم اختيار إجابة' : 'No answer selected'));
            const correctText =
              m.correctAnswerAr ||
              (m.correctIndex !== null && m.correctIndex !== undefined && opts[m.correctIndex]
                ? opts[m.correctIndex]
                : '');

            return {
              id: m.id,
              subjectAr: m.subjectAr || m.examTitleAr || (isAr ? 'امتحان' : 'Exam'),
              topicAr: m.examTitleAr || '',
              examSourceAr: m.examTitleAr || '',
              questionAr: m.questionAr,
              options: opts,
              wrongSelectedIdx: m.selectedIndex,
              correctIndex: m.correctIndex,
              wrongAnswerGivenAr: wrongText,
              correctAnswerAr: correctText,
              explanationAr: m.explanationAr || (isAr ? 'راجع الفرق بين إجابتك والإجابة الصحيحة ثم أعد المحاولة.' : 'Review the difference and retry.'),
              solvedCorrectlyNow: false,
            };
          })
        );
        const bms = Array.isArray(data.bookmarkedLessons) ? data.bookmarkedLessons : [];
        setBookmarkedLessons(bms);
        if (Array.isArray(data.preExamChecklist)) {
          setChecklist(data.preExamChecklist);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
      if (pollTimerRef.current) window.clearTimeout(pollTimerRef.current);
    };
  }, [isAr]);

  const toggleChecklistItem = (id) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  const handleOpenMistake = (m) => {
    setActiveMistakeModal(m);
    setSelectedRetryOption(null);
    setRetryResult(null);
  };

  const handleResolveMistake = () => {
    if (selectedRetryOption === null || !activeMistakeModal) return;

    const isRight = Number(selectedRetryOption) === Number(activeMistakeModal.correctIndex);
    setRetryResult(isRight ? 'correct' : 'wrong');

    if (isRight) {
      try {
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
      setMistakes((prev) =>
        prev.map((item) => (item.id === activeMistakeModal.id ? { ...item, solvedCorrectlyNow: true } : item))
      );
    }
  };

  // Generate a fresh targeted AI MCQ drill directly from the student's unsolved mistakes
  const handleStartAiMistakeDrill = async () => {
    if (isGeneratingDrill || mistakes.length === 0) return;
    setIsGeneratingDrill(true);
    setDrillError('');

    try {
      const unsolvedIds = mistakes.filter((m) => !m.solvedCorrectlyNow).map((m) => m.id).slice(0, 15);
      const startRes = await studentApi.ai.diagnoseWeakAreas({
        mistakeIds: unsolvedIds,
        includeQuiz: true,
        quizCount: 5,
      });
      const jobId = startRes?.data?.job?.id;
      if (!jobId) {
        throw new Error(isAr ? 'تعذر بدء توليد الكويز العلاجي.' : 'Failed to start AI drill.');
      }

      for (let attempt = 0; attempt < 90; attempt += 1) {
        await new Promise((resolve) => {
          pollTimerRef.current = window.setTimeout(resolve, 2000);
        });
        const statusRes = await studentApi.ai.getJobStatus(jobId);
        const payload = statusRes?.data;
        const status = payload?.job?.status;
        if (status === 'completed') {
          const qs = Array.isArray(payload?.quizQuestions) ? payload.quizQuestions : [];
          if (qs.length > 0) {
            navigate('/student/quiz', {
              state: {
                customQuiz: {
                  titleAr: isAr ? 'كويز علاجي بالـ AI على بنك أخطائك' : 'AI Remediation Drill (Mistake Bank)',
                  sourceLabelAr: isAr ? 'تدريب علاجي ذكي' : 'AI Targeted Drill',
                  questions: qs,
                },
              },
            });
          } else {
            setDrillError(isAr ? 'تعذر استخراج أسئلة جديدة حالياً، حاول مرة أخرى.' : 'Could not generate new drill questions.');
          }
          break;
        }
        if (status === 'failed') {
          setDrillError(payload?.job?.errorMessage || (isAr ? 'فشل توليد الكويز العلاجي.' : 'AI drill failed.'));
          break;
        }
      }
    } catch (err) {
      setDrillError(err?.message || (isAr ? 'تعذر تشغيل الكويز العلاجي بالذكاء الاصطناعي.' : 'Failed to launch AI drill.'));
    } finally {
      setIsGeneratingDrill(false);
    }
  };

  const unsolvedMistakesCount = mistakes.filter((m) => !m.solvedCorrectlyNow).length;

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '28px 20px 80px' }}>
      {/* Header + AI Targeted Drill Action */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '24px',
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
            {isAr ? 'مركز المراجعة وبنك الأخطاء' : 'Revision Center & Mistake Bank'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            {isAr
              ? 'حوّل نقاط ضعفك إلى إتقان كامل قبل الامتحانات من خلال إعادة حل الأسئلة الخاطئة والتدريب بالذكاء الاصطناعي'
              : 'Review past mistakes, saved lessons, and pre-exam checklists with AI-targeted drills'}
          </p>
        </div>

        {mistakes.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              disabled={isGeneratingDrill}
              onClick={handleStartAiMistakeDrill}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: isGeneratingDrill ? 'wait' : 'pointer',
                boxShadow: '0 4px 14px rgba(21, 136, 199, 0.25)',
              }}
            >
              {isGeneratingDrill ? <Loader2 size={15} className="spin" /> : <Sparkles size={15} />}
              <span>
                {isGeneratingDrill
                  ? (isAr ? 'جاري بناء كويز علاجي بالـ AI...' : 'Building AI Drill...')
                  : (isAr ? 'توليد كويز علاجي بالـ AI على أخطائك' : 'Generate AI Mistake Drill')}
              </span>
            </button>
          </div>
        )}
      </div>

      {drillError && (
        <div style={{
          marginBottom: '16px',
          padding: '11px 14px',
          borderRadius: '12px',
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#DC2626',
          fontSize: '12.5px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <AlertCircle size={15} />
          <span>{drillError}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '14px',
        marginBottom: '28px',
        overflowX: 'auto',
      }}>
        {[
          { id: 'mistakes', labelAr: `بنك الأسئلة الخاطئة (${unsolvedMistakesCount} متبقي)`, labelEn: `Mistake Bank (${unsolvedMistakesCount})` },
          { id: 'bookmarked-lessons', labelAr: `الدروس المحفوظة (${bookmarkedLessons.length})`, labelEn: `Bookmarked (${bookmarkedLessons.length})` },
          { id: 'pre-exam', labelAr: 'قوائم المراجعة قبل الامتحان', labelEn: 'Pre-Exam Checklist' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'var(--bg-surface)',
              color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {isAr ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      {activeTab === 'mistakes' && (
        <MistakeBankList
          mistakes={mistakes}
          unsolvedMistakesCount={unsolvedMistakesCount}
          lang={lang}
          onOpenMistake={handleOpenMistake}
        />
      )}

      {activeTab === 'bookmarked-lessons' && (
        <BookmarkedLessonsTab
          lessons={bookmarkedLessons}
          lang={lang}
          onOpenLesson={(lid) => navigate(lid ? `/student/lesson?id=${encodeURIComponent(lid)}` : '/student/lesson')}
        />
      )}

      {activeTab === 'pre-exam' && (
        <PreExamChecklistTab
          checklist={checklist}
          lang={lang}
          onToggleChecklistItem={toggleChecklistItem}
        />
      )}

      <MistakeRetryModal
        activeMistakeModal={activeMistakeModal}
        selectedRetryOption={selectedRetryOption}
        setSelectedRetryOption={setSelectedRetryOption}
        retryResult={retryResult}
        isRtl={isRtl}
        onClose={() => setActiveMistakeModal(null)}
        onResolveMistake={handleResolveMistake}
      />
    </div>
  );
};
