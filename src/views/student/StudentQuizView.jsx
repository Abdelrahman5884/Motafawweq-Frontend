import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_LESSON } from '../../data/mockData';
import { CheckCircle2, Brain } from 'lucide-react';
import {
  QuizStatusBar,
  QuizNavigatorStrip,
  QuizQuestionCard,
  QuizResultsScreen,
  QuizReviewModal,
  AiGeneratorTab,
  useQuiz
} from '../../features/student/quiz';

export const StudentQuizView = () => {
  const { lang, isRtl } = useLanguage();
  const {
    activeMode,
    setActiveMode,
    quizSource,
    currentIdx,
    setCurrentIdx,
    selectedAnswers,
    flaggedQuestions,
    timeLeft,
    isSubmitted,
    showReviewModal,
    setShowReviewModal,
    isGeneratingAI,
    currentQuestionsList,
    currentQ,
    formatTime,
    handleSelectOption,
    handleToggleFlag,
    handleSubmitQuiz,
    handleResetQuiz,
    handleGenerateAIQuiz,
    scorePercent,
    correctCount,
    mcqPoints,
    fullMarkBonus,
    streakBonus,
    totalPointsEarned
  } = useQuiz();

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '28px 20px 80px'
    }}>
      {/* Top Header & Navigation Mode Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'الكويزات التفاعلية ودوري المتفوقين' : 'Interactive Quizzes & League'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            {lang === 'ar' ? 'حل اختبارات الحصة أو أنشئ كويز ذكي بالـ AI ونافس في صدارة الدوري' : 'Practice quizzes, generate AI questions, and compete in the league'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{
          display: 'inline-flex',
          backgroundColor: 'var(--bg-surface)',
          padding: '4px',
          borderRadius: '16px',
          border: '1px solid var(--border-medium)'
        }}>
          <button
            onClick={() => setActiveMode('quiz')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMode === 'quiz' ? 'var(--primary)' : 'transparent',
              color: activeMode === 'quiz' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            <CheckCircle2 size={15} />
            <span>{lang === 'ar' ? 'حل الكويز' : 'Take Quiz'}</span>
          </button>

          <button
            onClick={() => setActiveMode('ai-generate')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeMode === 'ai-generate' ? 'var(--primary)' : 'transparent',
              color: activeMode === 'ai-generate' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            <Brain size={15} />
            <span>{lang === 'ar' ? 'توليد بالذكاء الاصطناعي' : 'AI Generator'}</span>
          </button>
        </div>
      </div>

      {/* MODE 1: QUIZ SOLVING (US-31 to US-37) */}
      {activeMode === 'quiz' && (
        <div>
          <QuizStatusBar
            quizSource={quizSource}
            lessonTitle={MOCK_LESSON.titleAr}
            timeLeft={timeLeft}
            formatTime={formatTime}
            isSubmitted={isSubmitted}
            isFlagged={flaggedQuestions[currentIdx]}
            handleToggleFlag={handleToggleFlag}
            lang={lang}
          />

          <QuizNavigatorStrip
            questions={currentQuestionsList}
            currentIdx={currentIdx}
            setCurrentIdx={setCurrentIdx}
            selectedAnswers={selectedAnswers}
            flaggedQuestions={flaggedQuestions}
          />

          <QuizQuestionCard
            currentQ={currentQ}
            currentIdx={currentIdx}
            totalQuestions={currentQuestionsList.length}
            selectedAnswers={selectedAnswers}
            handleSelectOption={handleSelectOption}
            isSubmitted={isSubmitted}
            setCurrentIdx={setCurrentIdx}
            setShowReviewModal={setShowReviewModal}
            handleResetQuiz={handleResetQuiz}
            lang={lang}
            isRtl={isRtl}
          />

          {isSubmitted && (
            <QuizResultsScreen
              scorePercent={scorePercent}
              selectedAnswersCount={Object.keys(selectedAnswers).length}
              totalQuestions={currentQuestionsList.length}
              correctCount={correctCount}
              mcqPoints={mcqPoints}
              fullMarkBonus={fullMarkBonus}
              streakBonus={streakBonus}
              totalPointsEarned={totalPointsEarned}
              lang={lang}
              isRtl={isRtl}
            />
          )}
        </div>
      )}

      {/* MODE 2: AI QUESTION GENERATOR */}
      {activeMode === 'ai-generate' && (
        <AiGeneratorTab
          lessonTitle={MOCK_LESSON.titleAr}
          handleGenerateAIQuiz={handleGenerateAIQuiz}
          isGeneratingAI={isGeneratingAI}
          lang={lang}
        />
      )}

      {/* Pre-Submit Review Sheet Modal (US-34) */}
      <QuizReviewModal
        show={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmitQuiz}
        totalQuestions={currentQuestionsList.length}
        selectedAnswers={selectedAnswers}
        lang={lang}
      />
    </div>
  );
};

export default StudentQuizView;
