import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MISTAKE_BANK } from '../../data/studentData';
import { MOCK_LESSON } from '../../data/mockData';
import confetti from 'canvas-confetti';
import {
  MistakeBankList,
  MistakeRetryModal,
  BookmarkedLessonsTab,
  PreExamChecklistTab
} from '../../features/student/revision';

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
    try {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

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
          {lang === 'ar' ? 'مركز المراجعة وبنك الأخطاء' : 'Revision Center & Mistake Bank'}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          {lang === 'ar' ? 'حوّل نقاط ضعفك إلى إتقان كامل قبل الامتحانات من خلال إعادة حل الأسئلة الخاطئة' : 'Review past mistakes, saved lessons, and pre-exam checklists'}
        </p>
      </div>

      {/* Tabs Switcher */}
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
          { id: 'mistakes', labelAr: `بنك الأسئلة الخاطئة (${unsolvedMistakesCount} متبقي)` },
          { id: 'bookmarked-lessons', labelAr: 'الدروس المحفوظة للمراجعة' },
          { id: 'pre-exam', labelAr: 'قوائم المراجعة قبل الامتحان' }
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

      {/* TAB 1: MISTAKE BANK */}
      {activeTab === 'mistakes' && (
        <MistakeBankList
          mistakes={mistakes}
          unsolvedMistakesCount={unsolvedMistakesCount}
          lang={lang}
          onOpenMistake={handleOpenMistake}
        />
      )}

      {/* TAB 2: BOOKMARKED LESSONS */}
      {activeTab === 'bookmarked-lessons' && (
        <BookmarkedLessonsTab
          lesson={MOCK_LESSON}
          lang={lang}
          onOpenLesson={() => navigate('/student/lesson')}
        />
      )}

      {/* TAB 3: PRE-EXAM CHECKLIST */}
      {activeTab === 'pre-exam' && (
        <PreExamChecklistTab
          checklist={checklist}
          lang={lang}
          onToggleChecklistItem={toggleChecklistItem}
        />
      )}

      {/* Re-solve Modal */}
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
