import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  ExamCatalog,
  ExamSession,
  ExamResults,
  useExam
} from '../../features/student/exam';

export const ExamTakingView = () => {
  const { lang, isRtl } = useLanguage();
  const exam = useExam(lang);

  return (
    <div style={{
      maxWidth: '1060px',
      margin: '0 auto',
      padding: '28px 20px 80px',
      fontFamily: 'var(--font-arabic, sans-serif)'
    }}>
      <style>{`
        @keyframes softPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .clean-exam-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .clean-exam-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
          border-color: var(--border-medium);
        }
        .clean-btn {
          transition: all 0.15s ease;
        }
        .clean-btn:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }
        .clean-btn:active {
          transform: translateY(0);
        }
      `}</style>

      {/* VIEW 1: CLEAN & CALM EXAM CATALOG */}
      {exam.examState === 'catalog' && (
        <ExamCatalog
          handleRequestStartExam={exam.handleRequestStartExam}
          pendingExam={exam.pendingExam}
          setPendingExam={exam.setPendingExam}
          handleConfirmStart={exam.handleConfirmStart}
          lang={lang}
        />
      )}

      {/* VIEW 2: ACTIVE EXAM SESSION */}
      {exam.examState === 'taking' && (
        <ExamSession
          activeExam={exam.activeExam}
          timeLeft={exam.timeLeft}
          formatTime={exam.formatTime}
          flaggedQuestions={exam.flaggedQuestions}
          handleToggleFlag={exam.handleToggleFlag}
          questions={exam.questions}
          currentIdx={exam.currentIdx}
          setCurrentIdx={exam.setCurrentIdx}
          selectedAnswers={exam.selectedAnswers}
          currentQ={exam.currentQ}
          handleSelectOption={exam.handleSelectOption}
          setShowReviewConfirm={exam.setShowReviewConfirm}
          showReviewConfirm={exam.showReviewConfirm}
          handleSubmitExam={exam.handleSubmitExam}
          lang={lang}
          isRtl={isRtl}
        />
      )}

      {/* VIEW 3: RESULTS */}
      {exam.examState === 'results' && (
        <ExamResults
          activeExam={exam.activeExam}
          isPerfectScore={exam.isPerfectScore}
          examSource={exam.examSource}
          scorePercent={exam.scorePercent}
          correctCount={exam.correctCount}
          questions={exam.questions}
          handleRetakeExam={exam.handleRetakeExam}
          setExamState={exam.setExamState}
          totalEarnedPoints={exam.totalEarnedPoints}
          basePoints={exam.basePoints}
          perfectBonusPoints={exam.perfectBonusPoints}
          streakBonusPoints={exam.streakBonusPoints}
          studentTotalScore={exam.studentTotalScore}
          gapToLead={exam.gapToLead}
          selectedAnswers={exam.selectedAnswers}
          lang={lang}
        />
      )}
    </div>
  );
};

export default ExamTakingView;
