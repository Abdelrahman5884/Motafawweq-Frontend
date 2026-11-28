import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, RefreshCw, AlertCircle, BookOpen, FolderCheck, GraduationCap, Target } from 'lucide-react';
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
    sourceMode,
    setSourceMode,
    convertedLectures,
    accessibleLessons,
    selectedLessonId,
    setSelectedLessonId,
    activeLecture,
    customQuiz,
    activeTitleAr,
    quizCount,
    setQuizCount,
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
    generationProgress,
    currentQuestionsList,
    currentQ,
    formatTime,
    handleSelectOption,
    handleToggleFlag,
    handleSubmitQuiz,
    handleResetQuiz,
    handleGenerateAIQuiz,
    handleGenerateLessonAIQuiz,
    scorePercent,
    correctCount,
    mcqPoints,
    fullMarkBonus,
    streakBonus,
    totalPointsEarned,
  } = useQuiz();

  const hasConvertedTranscript = Array.isArray(activeLecture?.transcript) && activeLecture.transcript.length > 0;
  const selectedLesson = accessibleLessons.find((l) => l.id === selectedLessonId) || null;
  const transcribedLessons = accessibleLessons.filter((l) => l.hasTranscript);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 20px 80px' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px',
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
            {isAr ? 'الكويزات الذكية التفاعلية (AI)' : 'Interactive AI Quizzes'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            {isAr
              ? 'ولّد وحل أسئلة اختيار من متعدد بالذكاء الاصطناعي من محاضراتك المحولة أو حصص مقرراتك أو نقاط ضعفك'
              : 'Generate and practice AI multiple-choice quizzes from converted lectures, course lessons, or weak areas'}
          </p>
        </div>

        {/* Source Switcher Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            disabled={isGeneratingAI}
            onClick={() => {
              setSourceMode('converted');
              if (!activeLecture && convertedLectures[0]?.id) {
                loadConvertedLecture(convertedLectures[0].id);
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '11px',
              border: sourceMode === 'converted' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
              backgroundColor: sourceMode === 'converted' ? 'var(--primary)' : 'var(--bg-surface)',
              color: sourceMode === 'converted' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <FolderCheck size={14} />
            <span>{isAr ? `محاضراتي المحولة (${convertedLectures.length})` : `Converted (${convertedLectures.length})`}</span>
          </button>

          <button
            type="button"
            disabled={isGeneratingAI}
            onClick={() => {
              setSourceMode('lesson');
              if (!selectedLessonId && transcribedLessons[0]?.id) {
                setSelectedLessonId(transcribedLessons[0].id);
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '11px',
              border: sourceMode === 'lesson' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
              backgroundColor: sourceMode === 'lesson' ? 'var(--primary)' : 'var(--bg-surface)',
              color: sourceMode === 'lesson' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <GraduationCap size={15} />
            <span>{isAr ? `من حصصي (${transcribedLessons.length})` : `From My Lessons (${transcribedLessons.length})`}</span>
          </button>

          {sourceMode === 'custom' && customQuiz && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '11px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              color: '#059669',
              fontSize: '12.5px',
              fontWeight: '800',
            }}>
              <Target size={14} />
              <span>{customQuiz.sourceLabelAr || (isAr ? 'كويز علاجي بالـ AI' : 'AI Remediation Quiz')}</span>
            </span>
          )}
        </div>
      </div>

      {/* Control Bar: Source Selector + Question Count + Generate Action */}
      {sourceMode !== 'custom' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '14px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
            {sourceMode === 'converted' ? (
              convertedLectures.length > 0 ? (
                <select
                  value={activeLecture?.id || ''}
                  disabled={isGeneratingAI}
                  onChange={(e) => loadConvertedLecture(e.target.value)}
                  style={{
                    padding: '9px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '700',
                    fontFamily: 'inherit',
                    minWidth: '220px',
                    maxWidth: '340px',
                    flex: 1,
                  }}
                >
                  {convertedLectures.map((lec) => (
                    <option key={lec.id} value={lec.id}>
                      {lec.titleAr} {lec.questionsCount ? `(${lec.questionsCount})` : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  {isAr ? 'لا توجد محاضرات محولة بعد — جرّب «من حصصي» أو استوديو المحاضرة الذكية.' : 'No converted lectures yet — try "From My Lessons" or Smart Lecture Studio.'}
                </span>
              )
            ) : accessibleLessons.length > 0 ? (
              <select
                value={selectedLessonId}
                disabled={isGeneratingAI}
                onChange={(e) => setSelectedLessonId(e.target.value)}
                style={{
                  padding: '9px 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: '700',
                  fontFamily: 'inherit',
                  minWidth: '220px',
                  maxWidth: '400px',
                  flex: 1,
                }}
              >
                <option value="">{isAr ? '— اختر حصة لتوليد كويز منها —' : '— Select a lesson —'}</option>
                {accessibleLessons.map((les) => (
                  <option key={les.id} value={les.id} disabled={!les.hasTranscript}>
                    {les.courseTitleAr ? `${les.courseTitleAr} — ` : ''}{les.titleAr}
                    {les.hasTranscript ? (isAr ? ' ✓' : ' ✓') : (isAr ? ' (بدون تفريغ نصي)' : ' (No transcript)')}
                  </option>
                ))}
              </select>
            ) : (
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {isAr ? 'انضم لمقرر دراسي لتوليد كويزات فورية من حصص معلمك.' : 'Enroll in a course to generate instant quizzes from lessons.'}
              </span>
            )}

            {/* Question Count Selector */}
            <select
              value={quizCount}
              disabled={isGeneratingAI}
              onChange={(e) => setQuizCount(Number(e.target.value))}
              aria-label={isAr ? 'عدد الأسئلة' : 'Question Count'}
              style={{
                padding: '9px 12px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '700',
                fontFamily: 'inherit',
              }}
            >
              {[3, 5, 8].map((n) => (
                <option key={n} value={n}>
                  {isAr ? `${n} أسئلة` : `${n} Questions`}
                </option>
              ))}
            </select>
          </div>

          {sourceMode === 'converted' && activeLecture && hasConvertedTranscript && (
            <button
              type="button"
              disabled={isGeneratingAI}
              onClick={() => handleGenerateAIQuiz(activeLecture.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '9px 18px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: isGeneratingAI ? 'wait' : 'pointer',
                opacity: isGeneratingAI ? 0.85 : 1,
              }}
            >
              {isGeneratingAI ? <Loader2 size={15} className="spin" /> : <RefreshCw size={15} />}
              <span>
                {isGeneratingAI
                  ? isAr
                    ? `جاري التوليد (${generationProgress || 20}%)...`
                    : `Generating (${generationProgress || 20}%)...`
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

          {sourceMode === 'lesson' && selectedLesson?.hasTranscript && (
            <button
              type="button"
              disabled={isGeneratingAI}
              onClick={() => handleGenerateLessonAIQuiz(selectedLesson.id, quizCount)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '9px 18px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: isGeneratingAI ? 'wait' : 'pointer',
                opacity: isGeneratingAI ? 0.85 : 1,
              }}
            >
              {isGeneratingAI ? <Loader2 size={15} className="spin" /> : <Sparkles size={15} />}
              <span>
                {isGeneratingAI
                  ? isAr
                    ? `جاري توليد أسئلة الحصة (${generationProgress || 20}%)...`
                    : `Generating Lesson Quiz (${generationProgress || 20}%)...`
                  : isAr
                    ? 'توليد كويز بالـ AI من الحصة'
                    : 'Generate AI Lesson Quiz'}
              </span>
            </button>
          )}
        </div>
      )}

      {quizError && (
        <div style={{
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
        }}>
          <AlertCircle size={16} />
          <span>{quizError}</span>
        </div>
      )}

      {/* Live Generation Card */}
      {isGeneratingAI && (
        <div style={{
          marginBottom: '20px',
          padding: '22px 20px',
          borderRadius: '18px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--primary)',
          textAlign: 'center',
        }}>
          <Loader2 size={26} color="var(--primary)" className="spin" style={{ margin: '0 auto 10px' }} />
          <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {isAr ? 'الذكاء الاصطناعي يصيغ أسئلة الكويز والتفسيرات العلمية الآن...' : 'AI is generating multiple-choice questions & rationales...'}
          </div>
          <div style={{ maxWidth: '380px', margin: '10px auto 0', height: '6px', backgroundColor: 'var(--bg-subtle)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.max(12, generationProgress)}%`, backgroundColor: 'var(--primary)', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {/* QUIZ SOLVING INTERFACE */}
      {loadingQuiz ? (
        <div style={{
          padding: '56px 24px',
          textAlign: 'center',
          borderRadius: '20px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-secondary)',
        }}>
          <Loader2 size={28} color="var(--primary)" className="spin" style={{ margin: '0 auto 10px' }} />
          <div style={{ fontSize: '14px', fontWeight: '700' }}>
            {isAr ? 'جاري تحميل الكويز الذكي...' : 'Loading AI Quiz...'}
          </div>
        </div>
      ) : !currentQuestionsList || currentQuestionsList.length === 0 || !currentQ ? (
        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          borderRadius: '20px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px dashed var(--border-subtle)',
          color: 'var(--text-secondary)',
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
          }}>
            <BookOpen size={24} />
          </div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {isAr ? 'جاهز لتوليد كويز ذكي بالذكاء الاصطناعي' : 'Ready to Generate an AI Quiz'}
          </div>
          <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '18px', maxWidth: '500px', margin: '0 auto 18px' }}>
            {sourceMode === 'lesson' && selectedLesson?.hasTranscript
              ? isAr
                ? 'اضغط على زر «توليد كويز بالـ AI من الحصة» بالأعلى لصياغة أسئلة فورية من شرح المعلم.'
                : 'Click "Generate AI Lesson Quiz" above to create instant practice questions from this lesson.'
              : sourceMode === 'converted' && activeLecture && hasConvertedTranscript
                ? isAr
                  ? 'اضغط على زر «توليد الكويز بالـ AI» بالأعلى لاستخراج أسئلة اختيار من متعدد فوراً.'
                  : 'Click "Generate AI Quiz" above to create multiple-choice questions from this lecture.'
                : isAr
                  ? 'حوّل أي محاضرة صوتية أو فيديو أو PDF في استوديو المحاضرة الذكية، أو اختر حصة مفرّغة من تبويب «من حصصي».'
                  : 'Convert any audio, video, or PDF in Smart Lecture Studio, or pick a transcribed lesson from "From My Lessons".'}
          </div>

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
        </div>
      ) : (
        <div>
          <QuizStatusBar
            quizSource={quizSource}
            lessonTitle={activeTitleAr}
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
