import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ClipboardCheck, Clock, ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';

export const LessonQuestionsTab = ({
  lessonId = '',
  lessonTitleAr = '',
  hasTranscript = false,
  relatedExams = [],
  questions = [],
  savedQ = {},
  handleSaveQuestionClick,
  revealedA = {},
  setRevealedA,
  lang = 'ar',
}) => {
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  return (
    <div className="lv-questions" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Instant AI Practice Quiz from this lesson */}
      {lessonId && hasTranscript && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(21, 136, 199, 0.08), rgba(99, 102, 241, 0.08))',
            border: '1px solid rgba(21, 136, 199, 0.28)',
            borderRadius: '14px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={18} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {isAr ? 'اختبر فهمك فوراً بكويز ذكي (AI)' : 'Test Your Mastery with an Instant AI Quiz'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {isAr
                  ? `توليد أسئلة اختيار من متعدد جديدة مبنية على شرح «${lessonTitleAr || 'هذه الحصة'}» مع التفسير العلمي.`
                  : `Generate fresh multiple-choice questions strictly grounded in "${lessonTitleAr || 'this lesson'}".`}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/student/quiz?lesson=${encodeURIComponent(lessonId)}&autostart=1`)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <Sparkles size={14} />
            <span>{isAr ? 'توليد كويز بالـ AI الآن' : 'Generate AI Quiz'}</span>
          </button>
        </div>
      )}
      {/* Linked Course Exams / Quizzes */}
      {relatedExams.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '13px',
              fontWeight: '800',
              color: 'var(--text-primary)',
            }}
          >
            <ClipboardCheck size={16} color="var(--primary)" />
            <span>{isAr ? 'اختبارات وتدريبات المقرر المرتبطة' : 'Course Quizzes & Exams'}</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: '10px',
            }}
          >
            {relatedExams.map((exam) => {
              const isGraded = exam.submissionStatus === 'graded';
              return (
                <div
                  key={exam.id}
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    minWidth: 0,
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {exam.titleAr}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        flexWrap: 'wrap',
                        marginTop: '4px',
                        fontSize: '11.5px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} color="var(--primary)" />
                        {exam.durationMinutes} {isAr ? 'دقيقة' : 'min'}
                      </span>
                      <span>
                        {exam.questionsCount} {isAr ? 'سؤال' : 'Q'}
                      </span>
                      {isGraded && exam.percentage !== null && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: '800',
                            color: exam.isPassed ? '#059669' : '#D97706',
                          }}
                        >
                          <CheckCircle2 size={12} />
                          {Math.round(exam.percentage)}%
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/student/exam?id=${encodeURIComponent(exam.id)}`)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isGraded ? 'var(--bg-surface)' : 'var(--primary)',
                      color: isGraded ? 'var(--primary)' : '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span>
                      {isGraded
                        ? isAr
                          ? 'مراجعة'
                          : 'Review'
                        : isAr
                          ? 'ابدأ الاختبار'
                          : 'Start Exam'}
                    </span>
                    {isAr ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review / Practice Questions (from completed & graded course quizzes) */}
      {questions.length === 0 ? (
        <div
          style={{
            padding: '28px 16px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '14px',
            border: '1px dashed var(--border-subtle)',
            fontSize: '13px',
            fontWeight: '700',
          }}
        >
          <HelpCircle size={26} color="var(--primary)" style={{ opacity: 0.6, marginBottom: '8px' }} />
          <div>
            {relatedExams.length > 0
              ? isAr
                ? 'أكمل الاختبار المرتبط بالمقرر أعلاه لتظهر لك أسئلته وإجاباته النموذجية هنا للمراجعة السريعة.'
                : 'Complete a linked course quiz above to unlock model answers & revision questions here.'
              : isAr
                ? 'لا توجد أسئلة تدريبية مسجلة لهذا الدرس حالياً.'
                : 'No practice questions available for this lesson yet.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-secondary)' }}>
            {isAr
              ? `أسئلة المراجعة وإجاباتها النموذجية (${questions.length}):`
              : `Review Questions & Model Answers (${questions.length}):`}
          </div>

          {questions.map((q, i) => (
            <div key={q.id} className="lv-q" style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}>
              <div className="lv-q__head">
                <span
                  className={`lv-q__diff ${q.diff === 'صعب' ? 'hard' : q.diff === 'سهل' ? 'easy' : 'med'}`}
                >
                  {q.diff}
                </span>
                <span className="lv-q__src">{q.src}</span>
                <button
                  type="button"
                  className={`lv-q__save ${savedQ[q.id] ? 'on' : ''}`}
                  onClick={() => handleSaveQuestionClick(q)}
                  title={isAr ? 'حفظ السؤال للمراجعة' : 'Bookmark question'}
                  aria-label={isAr ? 'حفظ السؤال للمراجعة' : 'Bookmark question'}
                >
                  <Star size={14} fill={savedQ[q.id] ? 'currentColor' : 'transparent'} />
                </button>
              </div>

              <p
                className="lv-q__text"
                style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
              >
                {q.q}
              </p>

              {Array.isArray(q.options) && q.options.length > 0 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                    gap: '6px',
                    marginBottom: '10px',
                  }}
                >
                  {q.options.map((opt, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '7px 10px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        fontWeight: '600',
                      }}
                    >
                      {idx + 1}. {opt}
                    </div>
                  ))}
                </div>
              )}

              <div className="lv-q__reveal-action">
                <button
                  type="button"
                  className="lv-q__toggle-btn"
                  onClick={() => setRevealedA((p) => ({ ...p, [q.id]: !p[q.id] }))}
                >
                  {revealedA[q.id]
                    ? isAr
                      ? 'إخفاء الإجابة النموذجية'
                      : 'Hide Answer'
                    : isAr
                      ? 'عرض الإجابة النموذجية والتفسير'
                      : 'Show Model Answer'}
                </button>
              </div>

              {revealedA[q.id] && (
                <div className="lv-q__answer">
                  <div className="lv-q__answer-bar" />
                  <div
                    className="lv-q__answer-content"
                    style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                  >
                    <strong>{isAr ? 'الإجابة المعتمدة: ' : 'Official Answer: '}</strong>
                    <span>{q.a}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
