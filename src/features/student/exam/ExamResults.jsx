import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, RotateCcw, Trophy, CheckCircle2, Lock } from 'lucide-react';

export const ExamResults = ({
  activeExam,
  isPerfectScore,
  examSource,
  scorePercent,
  correctCount,
  questions,
  handleRetakeExam,
  setExamState,
  totalEarnedPoints,
  basePoints,
  perfectBonusPoints,
  streakBonusPoints,
  studentTotalScore,
  gapToLead,
  selectedAnswers,
  lang
}) => {
  const navigate = useNavigate();

  // If the teacher has hidden results for this exam ("حجب النتيجة عن الطلاب")
  if (activeExam && activeExam.showResults === false) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '24px',
        padding: '36px 24px',
        textAlign: 'center',
        maxWidth: '680px',
        margin: '20px auto 40px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 102, 204, 0.08)',
          border: '1px solid rgba(0, 102, 204, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: 'var(--primary)'
        }}>
          <CheckCircle2 size={28} />
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '20px',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          color: '#D97706',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          fontSize: '12px',
          fontWeight: '700',
          marginBottom: '14px'
        }}>
          <Lock size={13} />
          <span>{lang === 'ar' ? 'النتيجة محجوبة مؤقتاً بقرار المعلم' : 'Results Hidden by Teacher'}</span>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 10px' }}>
          {lang === 'ar' ? 'تم تسليم إجاباتك بنجاح وحفظها بالنظام!' : 'Exam Submitted Successfully!'}
        </h2>

        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 auto 24px', maxWidth: '520px' }}>
          {lang === 'ar' 
            ? 'قام معلم المادة بحجب ظهور الدرجات ونموذج الإجابة لجميع الطلاب حتى انتهاء موعد الاختبار وتدقيق الإجابات. سيتم إعلان نتيجتك فور اعتمادها.'
            : 'The instructor has locked exam results until all submissions are reviewed. Your scores will be available once finalized.'}
        </p>

        {/* Specs Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '16px',
          padding: '10px 18px',
          borderRadius: '10px',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          fontSize: '12.5px',
          color: 'var(--text-secondary)',
          marginBottom: '28px'
        }}>
          <span>{lang === 'ar' ? `عدد الأسئلة المستلمة: ${questions.length} سؤال` : `${questions.length} Questions Submitted`}</span>
          <span>•</span>
          <span>{lang === 'ar' ? 'حالة ورقة الإجابة: مقفلة ومؤمنة' : 'Answer Sheet: Secured'}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setExamState('catalog')}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {lang === 'ar' ? 'العودة لقائمة الامتحانات' : 'Back to Exams'}
          </button>

          <button
            onClick={() => navigate('/student/dashboard')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {lang === 'ar' ? 'لوحة تحكم الطالب' : 'Student Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Rich Gamified Scorecard & League Points */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: isPerfectScore ? '2px solid var(--success)' : '1px solid var(--border-subtle)',
        borderRadius: '24px',
        padding: '28px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top row: Score + Quiz Source Badge + Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '18px',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                fontSize: '11.5px',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(21, 136, 199, 0.1)',
                color: 'var(--primary)'
              }}>
                {examSource === 'ai' ? 'كويز المحاضرة' : 'امتحان المعلم الرسمي'}
              </span>
              {isPerfectScore && (
                <span style={{
                  fontSize: '11.5px',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--success-light)',
                  color: 'var(--success)'
                }}>
                  درجة كاملة 100%
                </span>
              )}
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
              {isPerfectScore 
                ? (lang === 'ar' ? 'درجة نهائية كاملة 100%! أداء متميز' : 'Perfect Score 100%!')
                : scorePercent >= 75 
                ? (lang === 'ar' ? 'نتيجة متميزة وجديرة بالتكريم' : 'Outstanding Performance!')
                : (lang === 'ar' ? 'انتهى الاختبار وتم التصحيح الفوري' : 'Exam Completed')}
            </h2>

            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {lang === 'ar' 
                ? `أجبت بشكل صحيح على ${correctCount} من أصل ${questions.length} أسئلة (${scorePercent}%)`
                : `Score: ${correctCount} of ${questions.length} correct (${scorePercent}%)`}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleRetakeExam}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
              <span>{lang === 'ar' ? 'إعادة المحاولة' : 'Retake'}</span>
            </button>

            <button
              onClick={() => setExamState('catalog')}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {lang === 'ar' ? 'قائمة الامتحانات' : 'Exam Catalog'}
            </button>
          </div>
        </div>

        {/* Points Earned & Breakdown Highlight */}
        <div style={{
          backgroundColor: 'rgba(21, 136, 199, 0.06)',
          border: '1px solid rgba(21, 136, 199, 0.2)',
          borderRadius: '18px',
          padding: '18px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(21, 136, 199, 0.3)'
            }}>
              <Award size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
                {lang === 'ar' ? 'النقاط المحتسبة في دوري المتفوقين' : 'League Points Earned'}
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                +{totalEarnedPoints} {lang === 'ar' ? 'نقطة' : 'pts'}
              </div>
            </div>
          </div>

          {/* Points Breakdown Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{
              padding: '6px 12px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              +{basePoints} {lang === 'ar' ? 'نقطة إجابات' : 'answers'}
            </div>

            {isPerfectScore ? (
              <div style={{
                padding: '6px 12px',
                borderRadius: '10px',
                backgroundColor: 'var(--success-light)',
                border: '1px solid var(--success)',
                fontSize: '12px',
                fontWeight: '700',
                color: 'var(--success)'
              }}>
                +{perfectBonusPoints} {lang === 'ar' ? 'نقاط بونص التقفيل' : 'full mark bonus'}
              </div>
            ) : (
              <div style={{
                padding: '6px 12px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px dashed var(--border-medium)',
                fontSize: '11.5px',
                fontWeight: '500',
                color: 'var(--text-secondary)'
              }}>
                {lang === 'ar' ? 'قفل 100% لتحصل على 3 نقاط بونص' : 'Get 100% for 3 bonus pts'}
              </div>
            )}

            <div style={{
              padding: '6px 12px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              +{streakBonusPoints} {lang === 'ar' ? 'نقطة استريك' : 'streak pt'}
            </div>
          </div>
        </div>

        {/* League Standing Preview Card & Direct Navigation CTA */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: '18px',
          padding: '18px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(21, 136, 199, 0.1)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Trophy size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'موقعك في دوري المتفوقين: المركز الثاني' : 'Your League Rank: #2'}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(21, 136, 199, 0.1)',
                  color: 'var(--primary)'
                }}>
                  دوري النخبة الماسي
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {lang === 'ar'
                  ? `رصيدك الإجمالي أصبح ${studentTotalScore.toLocaleString()} نقطة • يفصلك عن المركز الأول (سارة خالد): ${gapToLead} نقطة`
                  : `Total score: ${studentTotalScore.toLocaleString()} • ${gapToLead} pts to lead`}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/student/league')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 22px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(21, 136, 199, 0.3)',
              transition: 'opacity 0.15s ease'
            }}
          >
            <Trophy size={16} />
            <span>{lang === 'ar' ? 'عرض ترتيبي في الدوري' : 'View My Rank in League'}</span>
          </button>
        </div>
      </div>

      {/* Question Review */}
      <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px' }}>
        {lang === 'ar' ? 'مراجعة الأسئلة:' : 'Question Review:'}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {questions.map((q, idx) => {
          const selectedOpt = selectedAnswers[idx];
          const isCorrect = selectedOpt === q.correctIndex;

          return (
            <div
              key={q.id}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid',
                borderColor: isCorrect ? 'var(--success)' : 'var(--error)',
                borderRadius: '16px',
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: isCorrect ? 'var(--success)' : 'var(--error)' }}>
                  {isCorrect ? 'إجابة صحيحة' : 'إجابة خاطئة'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  السؤال {idx + 1}
                </span>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 12px 0' }}>
                {q.questionAr}
              </h4>

              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <strong>{lang === 'ar' ? 'إجابتك:' : 'Your Answer:'}</strong>{' '}
                <span style={{ color: isCorrect ? 'var(--success)' : 'var(--error)' }}>
                  {selectedOpt !== undefined ? q.optionsAr[selectedOpt] : (lang === 'ar' ? 'لم تجب' : 'Unanswered')}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--success)', marginBottom: '10px', fontWeight: '700' }}>
                <strong>{lang === 'ar' ? 'الإجابة الصحيحة:' : 'Correct Answer:'}</strong> {q.optionsAr[q.correctIndex]}
              </div>

              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: '10px', fontSize: '12.5px', color: 'var(--text-primary)' }}>
                <strong>{lang === 'ar' ? 'التوضيح:' : 'Explanation:'}</strong> {q.explanationAr}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
