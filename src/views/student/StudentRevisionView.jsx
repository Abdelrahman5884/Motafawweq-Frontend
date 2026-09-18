import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MISTAKE_BANK, COURSES_CATALOG } from '../../data/studentData';
import { MOCK_LESSON } from '../../data/mockData';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Play, 
  Bookmark, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  ListCheck,
  Zap,
  Check
} from 'lucide-react';

export const StudentRevisionView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();

  const [activeTab, setActiveTab] = useState('mistakes'); // 'mistakes' | 'bookmarked-lessons' | 'pre-exam'
  const [mistakes, setMistakes] = useState(MISTAKE_BANK);
  const [activeMistakeModal, setActiveMistakeModal] = useState(null);
  const [selectedRetryOption, setSelectedRetryOption] = useState(null);
  const [retryResult, setRetryResult] = useState(null);

  // Pre-exam checklist state (US-74)
  const [checklist, setChecklist] = useState([
    { id: 'chk-1', textAr: 'مراجعة معادلة انشطار الماء ودور إنزيمات التفاعلات الضوئية', done: true },
    { id: 'chk-2', textAr: 'فهم قانون بلاكمان للعوامل المحددة ورسم المنحنيات البيانية', done: false },
    { id: 'chk-3', textAr: 'حل 15 سؤالاً من بنك الأخطاء والأسئلة الوزارية السابقة', done: false },
    { id: 'chk-4', textAr: 'سماع ملخص كورنيل الصوتي المركز (8 دقائق)', done: true }
  ]);

  const toggleChecklistItem = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleOpenMistake = (m) => {
    setActiveMistakeModal(m);
    setSelectedRetryOption(null);
    setRetryResult(null);
  };

  const handleResolveMistake = () => {
    if (selectedRetryOption === null) return;

    // Simulate correct resolution
    setRetryResult('correct');
    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.6 }
    });

    setMistakes(prev => prev.map(item => item.id === activeMistakeModal.id ? { ...item, solvedCorrectlyNow: true } : item));
  };

  const unsolvedMistakesCount = mistakes.filter(m => !m.solvedCorrectlyNow).length;

  return (
    <div style={{
      maxWidth: '1180px',
      margin: '0 auto',
      padding: '28px 20px 80px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
          {lang === 'ar' ? 'مركز المراجعة وبنك الأخطاء 🔄' : 'Revision Center & Mistake Bank'}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          {lang === 'ar' ? 'حوّل نقاط ضعفك إلى إتقان كامل قبل الامتحانات من خلال إعادة حل الأسئلة الخاطئة' : 'Review past mistakes, saved lessons, and pre-exam checklists'}
        </p>
      </div>

      {/* Tabs Switcher (US-69) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '14px',
        marginBottom: '28px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'mistakes', labelAr: `بنك الأسئلة الخاطئة (${unsolvedMistakesCount} متبقي) 🎯` },
          { id: 'bookmarked-lessons', labelAr: 'الدروس المحفوظة للمراجعة 📌' },
          { id: 'pre-exam', labelAr: 'قوائم المراجعة قبل الامتحان 📋' }
        ].map(tab => (
          <button
            key={tab.id}
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
              whiteSpace: 'nowrap'
            }}
          >
            {tab.labelAr}
          </button>
        ))}
      </div>

      {/* =========================================================================
          TAB 1: MISTAKE BANK (US-72 & US-73)
         ========================================================================= */}
      {activeTab === 'mistakes' && (
        <div>
          {/* Quick Stat Pill */}
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1.5px solid #FCA5A5',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle size={20} color="#EF4444" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#991B1B' }}>
                  {lang === 'ar' ? `لديك ${unsolvedMistakesCount} أسئلة أخطأت فيها سابقاً في الكويزات` : `You have ${unsolvedMistakesCount} questions to re-solve`}
                </div>
                <div style={{ fontSize: '12px', color: '#7F1D1D' }}>
                  {lang === 'ar' ? 'إعادة حلها تضمن لك فهم السبب العلمي ومنع تكرار الخطأ في الامتحان النهائي.' : 'Targeted re-solving boosts retention.'}
                </div>
              </div>
            </div>
          </div>

          {/* Mistakes Cards Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mistakes.map((m) => (
              <div
                key={m.id}
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1.5px solid',
                  borderColor: m.solvedCorrectlyNow ? '#10B981' : 'var(--border-medium)',
                  borderRadius: '20px',
                  padding: '22px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '8px', backgroundColor: 'var(--primary-surface)', color: 'var(--primary)' }}>
                      {m.subjectAr}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {m.topicAr} • مصدر: {m.examSourceAr}
                    </span>
                  </div>

                  {m.solvedCorrectlyNow && (
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} /> تم تصحيح الفهم بنجاح ✅
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                  {m.questionAr}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ padding: '10px 14px', borderRadius: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', fontSize: '12.5px', color: '#991B1B' }}>
                    ❌ <strong>إجابتك السابقة:</strong> {m.wrongAnswerGivenAr}
                  </div>
                  <div style={{ padding: '10px 14px', borderRadius: '12px', backgroundColor: '#ECFDF5', border: '1px solid #6EE7B7', fontSize: '12.5px', color: '#065F46' }}>
                    ✅ <strong>الإجابة الصحيحة:</strong> {m.correctAnswerAr}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    💡 <strong>التفسير:</strong> {m.explanationAr}
                  </div>

                  <button
                    onClick={() => handleOpenMistake(m)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      backgroundColor: m.solvedCorrectlyNow ? 'var(--bg-subtle)' : 'var(--primary)',
                      color: m.solvedCorrectlyNow ? 'var(--text-primary)' : '#FFFFFF',
                      border: 'none',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {m.solvedCorrectlyNow ? (lang === 'ar' ? 'حل تدريب إضافي' : 'Practice More') : (lang === 'ar' ? 'إعادة حل السؤال الآن' : 'Re-solve Now')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: BOOKMARKED LESSONS (US-70 & US-71)
         ========================================================================= */}
      {activeTab === 'bookmarked-lessons' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1.5px solid var(--primary)',
            borderRadius: '20px',
            padding: '22px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)' }}>
                الأحياء • 3 ثانوي
              </span>
              <Bookmark size={16} fill="var(--primary)" color="var(--primary)" />
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
              {MOCK_LESSON.titleAr}
            </h3>

            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              محفوظ للمراجعة قبل امتحان يوم الأحد. يتضمن التركيز على دورة كالفن ومصائد الثانوية العامة.
            </p>

            <button
              onClick={() => navigate('/student/lesson')}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Play size={15} fill="#FFFFFF" />
              <span>{lang === 'ar' ? 'فتح الحصة للمراجعة' : 'Open Lesson'}</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: PRE-EXAM CHECKLIST (US-74 & US-75)
         ========================================================================= */}
      {activeTab === 'pre-exam' && (
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1.5px solid var(--border-medium)',
          borderRadius: '24px',
          padding: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <ListCheck size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {lang === 'ar' ? 'قائمة الاستعداد لامتحان الأحياء الشامل (الأحد القادم):' : 'Pre-Exam Preparation Checklist:'}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                style={{
                  padding: '14px 18px',
                  borderRadius: '14px',
                  backgroundColor: item.done ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-subtle)',
                  border: '1.5px solid',
                  borderColor: item.done ? '#10B981' : 'var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '6px',
                  backgroundColor: item.done ? '#10B981' : 'var(--bg-surface)',
                  border: '1.5px solid',
                  borderColor: item.done ? '#10B981' : 'var(--border-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}>
                  {item.done && <Check size={14} />}
                </div>

                <span style={{
                  fontSize: '13.5px',
                  fontWeight: '700',
                  color: item.done ? '#065F46' : 'var(--text-primary)',
                  textDecoration: item.done ? 'line-through' : 'none'
                }}>
                  {item.textAr}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Re-solve Modal */}
      {activeMistakeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1.5px solid var(--border-medium)',
            borderRadius: '24px',
            maxWidth: '560px',
            width: '100%',
            padding: '28px'
          }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#EF4444' }}>
              إعادة حل السؤال الخاطئ 🎯
            </span>
            <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: '8px 0 16px 0', lineHeight: 1.5 }}>
              {activeMistakeModal.questionAr}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <button
                onClick={() => setSelectedRetryOption('opt-wrong')}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: selectedRetryOption === 'opt-wrong' ? '#FEF2F2' : 'var(--bg-subtle)',
                  border: '1.5px solid',
                  borderColor: selectedRetryOption === 'opt-wrong' ? '#EF4444' : 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                  textAlign: isRtl ? 'right' : 'left',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {activeMistakeModal.wrongAnswerGivenAr}
              </button>

              <button
                onClick={() => setSelectedRetryOption('opt-correct')}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: selectedRetryOption === 'opt-correct' ? '#ECFDF5' : 'var(--bg-subtle)',
                  border: '1.5px solid',
                  borderColor: selectedRetryOption === 'opt-correct' ? '#10B981' : 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                  textAlign: isRtl ? 'right' : 'left',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {activeMistakeModal.correctAnswerAr}
              </button>
            </div>

            {retryResult === 'correct' && (
              <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#065F46', fontSize: '13px', fontWeight: '800', marginBottom: '16px' }}>
                🎉 إجابة صحيحة! تم تصحيح الفهم في سجلك التعليمي.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setActiveMistakeModal(null)}
                style={{ padding: '10px 18px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                إغلاق
              </button>
              <button
                onClick={handleResolveMistake}
                style={{ padding: '10px 22px', borderRadius: '12px', backgroundColor: '#10B981', color: '#FFFFFF', border: 'none', fontWeight: '800', cursor: 'pointer' }}
              >
                تأكيد الإجابة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
