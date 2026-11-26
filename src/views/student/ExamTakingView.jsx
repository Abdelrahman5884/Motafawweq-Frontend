import React, { useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import '../../features/student/exam/exam.css';
import {
  ExamCatalog,
  ExamSession,
  ExamResults,
  useExam,
} from '../../features/student/exam';

export const ExamTakingView = () => {
  const { lang, isRtl } = useLanguage();
  const exam = useExam(lang);

  const breadcrumbs = useMemo(
    () => [
      {
        labelAr: 'الامتحانات والاختبارات',
        labelEn: 'Exams & Assessments',
      },
    ],
    []
  );
  useSetBreadcrumbs(breadcrumbs);

  return (
    <div
      style={{
        maxWidth: '1080px',
        margin: '0 auto',
        padding: '28px 20px 80px',
        fontFamily: 'var(--font-arabic, sans-serif)',
      }}
    >
      {/* VIEW 1: EXAM CATALOG */}
      {exam.examState === 'catalog' && (
        <ExamCatalog
          examsList={exam.examsList}
          filteredExams={exam.filteredExams}
          loadingExams={exam.loadingExams}
          examsError={exam.examsError}
          actionError={exam.actionError}
          onClearActionError={() => exam.setActionError(null)}
          onRetry={exam.refreshExams}
          sourceFilter={exam.sourceFilter}
          setSourceFilter={exam.setSourceFilter}
          sourceCounts={exam.sourceCounts}
          studentGradeAr={exam.studentGradeAr}
          searching={exam.searching}
          isSearchingAllGrades={exam.isSearchingAllGrades}
          tabCounts={exam.tabCounts}
          statusFilter={exam.statusFilter}
          setStatusFilter={exam.setStatusFilter}
          searchQuery={exam.searchQuery}
          setSearchQuery={exam.setSearchQuery}
          handleRequestStartExam={exam.handleRequestStartExam}
          handleRetakeMinistryExam={exam.handleRetakeMinistryExam}
          pendingExam={exam.pendingExam}
          setPendingExam={exam.setPendingExam}
          pendingRetake={exam.pendingRetake}
          isStartingExam={exam.isStartingExam}
          loadingResultId={exam.loadingResultId}
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
          answeredCount={exam.answeredCount}
          flaggedCount={exam.flaggedCount}
          currentQ={exam.currentQ}
          handleSelectAnswer={exam.handleSelectAnswer}
          tabSwitchesCount={exam.tabSwitchesCount}
          actionError={exam.actionError}
          onClearActionError={() => exam.setActionError(null)}
          setShowReviewConfirm={exam.setShowReviewConfirm}
          showReviewConfirm={exam.showReviewConfirm}
          isSubmittingExam={exam.isSubmittingExam}
          handleSubmitExam={exam.handleSubmitExam}
          lang={lang}
          isRtl={isRtl}
        />
      )}

      {/* VIEW 3: RESULTS & REVIEW */}
      {exam.examState === 'results' && (
        <ExamResults
          activeExam={exam.activeExam}
          serverResult={exam.serverResult}
          onBackToCatalog={exam.handleBackToCatalog}
          lang={lang}
        />
      )}
    </div>
  );
};

export default ExamTakingView;
