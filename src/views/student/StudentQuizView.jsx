import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, RefreshCw, AlertCircle, BookOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  QuizStatusBar,
  QuizNavigatorStrip,
  QuizQuestionCard,
  QuizResultsScreen,
  QuizReviewModal,
  useQuiz,
} from '../../features/student/quiz';

export const StudentQuizView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const {
    convertedLectures,
    activeLecture,
    loadingQuiz,
    quizError,
    loadConvertedLecture,
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
    totalPointsEarned,
  } = useQuiz();

  const hasTranscript = Array.isArray(activeLecture?.transcript) && activeLecture.transcript.length > 0;

  return (
    <div
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '28px 20px 80px',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
            {isAr ? 'الكويزات الذكية التفاعلية' : 'Interactive AI Quizzes'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            {isAr
              ? 'حل أسئلة الذكاء الاصطناعي المستخرجة من محاضراتك وراجع التفسير العلمي لكل إجابة'
              : 'Practice AI-generated quizzes from your lectures with scientific explanations'}
          </p>
        </div>

        {/* Converted Lecture Selector + Regenerate AI Quiz */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {convertedLectures.length > 0 && (
            <select
              value={activeLecture?.id || ''}
              onChange={(e) => loadConvertedLecture(e.target.value)}
              style={{
                padding: '9px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '700',
                fontFamily: 'inherit',
                maxWidth: '280px',
              }}
            >
              {convertedLectures.map((lec) => (
                <option key={lec.id} value={lec.id}>
                  {lec.titleAr} {lec.questionsCount ? `(${lec.questionsCount})` : ''}
                </option>
              ))}
            </select>
          )}

          {activeLecture && hasTranscript && (
            <button
              type="button"
              disabled={isGeneratingAI}
              onClick={() => handleGenerateAIQuiz(activeLecture.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '9px 16px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: isGeneratingAI ? 'wait' : 'pointer',
                opacity: isGeneratingAI ? 0.8 : 1,
              }}
            >
              {isGeneratingAI ? <Loader2 size={15} className="spin" /> : <RefreshCw size={15} />}
              <span>
                {isGeneratingAI
                  ? isAr
                    ? 'جاري توليد الأسئلة بالـ AI...'
                    : 'Generating AI Quiz...'
                  : currentQuestionsList.length > 0
                    ? isAr
                      ? 'توليد أسئلة جديدة بالـ AI'
                      : 'Generate Fresh Quiz'
                    : isAr
                      ? 'توليد الكويز بالـ AI'
                      : 'Generate AI Quiz'}
              </span>
            </button>
          )}
        </div>
      </div>

      {quizError && (
        <div
          style={{
            marginBottom: '18px',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.09)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444',
            fontSize: '13px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} />
          <span>{quizError}</span>
        </div>
      )}

      {/* QUIZ SOLVING INTERFACE */}
      {loadingQuiz ? (
        <div
          style={{
            padding: '56px 24px',
            textAlign: 'center',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          <Loader2 size={28} color="var(--primary)" style={{ margin: '0 auto 10px' }} />
          <div style={{ fontSize: '14px', fontWeight: '700' }}>
            {isAr ? 'جاري تحميل الكويز الذكي...' : 'Loading AI Quiz...'}
          </div>
        </div>
      ) : !currentQuestionsList || currentQuestionsList.length === 0 || !currentQ ? (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px dashed var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}
          >
            <BookOpen size={24} />
          </div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {isAr ? 'لا توجد أسئلة كويز مولدة لهذه المحاضرة بعد' : 'No AI Quiz Questions Yet'}
          </div>
          <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
            {activeLecture && hasTranscript
              ? isAr
                ? 'اضغط على زر «توليد الكويز بالـ AI» بالأعلى لاستخراج أسئلة اختيار من متعدد فوراً من محاضرتك.'
                : 'Click "Generate AI Quiz" above to create multiple-choice questions from this lecture.'
              : isAr
                ? 'حوّل أي محاضرة صوتية أو فيديو أو PDF من استوديو المحاضرة الذكية لتوليد كويز تفاعلي تلقائياً.'
                : 'Convert any audio, video, or PDF lecture in Smart Lecture Studio to generate an interactive quiz.'}
          </div>

          {!activeLecture && (
            <button
              type="button"
              onClick={() => navigate('/student/smart-lecture')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              <Sparkles size={16} />
              <span>{isAr ? 'الذهاب لاستوديو المحاضرة الذكية' : 'Open Smart Lecture Studio'}</span>
            </button>
          )}
        </div>
      ) : (
        <div>
          <QuizStatusBar
            quizSource={quizSource}
            lessonTitle={activeLecture?.titleAr || (isAr ? 'كويز المحاضرة الذكي' : 'AI Lecture Quiz')}
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

      {/* Pre-Submit Review Sheet Modal */}
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
