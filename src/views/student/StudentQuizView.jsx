import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_LESSON } from '../../data/mockData';
import {
  QuizStatusBar,
  QuizNavigatorStrip,
  QuizQuestionCard,
  QuizResultsScreen,
  QuizReviewModal,
  useQuiz
} from '../../features/student/quiz';

export const StudentQuizView = () => {
  const { lang, isRtl } = useLanguage();
  const {
    quizSource,
    currentIdx,
    setCurrentIdx,
    selectedAnswers,
    flaggedQuestions,
    timeLeft,
    isSubmitted,
    showReviewModal,
    setShowReviewModal,
    currentQuestionsList,
    currentQ,
    formatTime,
    handleSelectOption,
    handleToggleFlag,
    handleSubmitQuiz,
    handleResetQuiz,
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
      {/* Top Header */}
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
            {lang === 'ar' ? 'حل اختبارات الحصة والتدريبات ونافس في صدارة الدوري' : 'Practice quizzes, test your knowledge, and compete in the league'}
          </p>
        </div>
      </div>

      {/* QUIZ SOLVING INTERFACE */}
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
