import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Award, Target, Zap, Trophy, ArrowRight, ArrowLeft } from 'lucide-react';

export const QuizResultsScreen = ({
  scorePercent,
  selectedAnswersCount,
  totalQuestions,
  correctCount,
  mcqPoints,
  fullMarkBonus,
  streakBonus,
  totalPointsEarned,
  lang,
  isRtl
}) => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Main Results Hero Card */}
      <div style={{
        background: scorePercent >= 80
          ? 'linear-gradient(135deg, rgba(22, 163, 74, 0.08) 0%, rgba(21, 136, 199, 0.06) 100%)'
          : 'linear-gradient(135deg, rgba(21, 136, 199, 0.06) 0%, rgba(245, 158, 11, 0.06) 100%)',
        border: `2px solid ${scorePercent >= 80 ? 'var(--success)' : 'var(--warning)'}`,
        borderRadius: '24px',
        padding: '28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          insetInlineEnd: '-40px',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          backgroundColor: scorePercent >= 80 ? 'rgba(22, 163, 74, 0.12)' : 'rgba(245, 158, 11, 0.12)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '800',
              color: scorePercent >= 80 ? 'var(--success)' : 'var(--warning)',
              marginBottom: '8px'
            }}>
              <CheckCircle2 size={14} />
              <span>{lang === 'ar' ? 'تم تسليم الكويز وتصحيحه بنجاح' : 'Quiz Submitted & Graded'}</span>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              {lang === 'ar'
                ? `أجبت على ${selectedAnswersCount} من ${totalQuestions} سؤال`
                : `Answered ${selectedAnswersCount} of ${totalQuestions} questions`}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '48px', fontWeight: '900', color: scorePercent >= 80 ? 'var(--success)' : 'var(--warning)', lineHeight: 1 }}>
                {scorePercent}%
              </span>
              <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                ({correctCount}/{totalQuestions})
              </span>
            </div>

            <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '380px', lineHeight: 1.6 }}>
              {scorePercent === 100
                ? (lang === 'ar' ? 'درجة مثالية! حصلت على كامل النقاط مع بونص الإتقان.' : 'Perfect score! You earned full marks + mastery bonus.')
                : scorePercent >= 80
                ? (lang === 'ar' ? 'أداء ممتاز! لقد أضفت نقاطاً قيمة لرصيدك في الدوري.' : 'Excellent performance! Valuable points added to your league score.')
                : (lang === 'ar' ? 'أداء جيد. راجع الأسئلة الخاطئة لتقوية فهمك وارفع درجتك.' : 'Good effort. Review incorrect answers to strengthen your knowledge.')}
            </div>
          </div>

          {/* Score Circle Visual */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: scorePercent >= 80
                ? 'linear-gradient(135deg, var(--success) 0%, #22C55E 100%)'
                : 'linear-gradient(135deg, var(--warning) 0%, #FBBF24 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: scorePercent >= 80
                ? '0 8px 24px rgba(22, 163, 74, 0.35)'
                : '0 8px 24px rgba(245, 158, 11, 0.35)',
              color: '#FFFFFF'
            }}>
              {scorePercent >= 80 ? <Award size={28} /> : <Target size={28} />}
              <div style={{ fontSize: '10px', fontWeight: '700', marginTop: '2px' }}>
                {scorePercent >= 80 ? (lang === 'ar' ? 'ممتاز' : 'Excellent') : (lang === 'ar' ? 'جيد' : 'Good')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Points Breakdown Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1.5px solid var(--border-medium)',
        borderRadius: '20px',
        padding: '22px 26px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <Zap size={17} color="var(--primary)" />
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'تفاصيل نقاط الدوري المكتسبة' : 'League Points Breakdown'}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          {/* Per-question points */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '14px',
            backgroundColor: 'var(--primary-surface)',
            border: '1px solid rgba(21, 136, 199, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '4px' }}>
              {lang === 'ar' ? 'إجابات صحيحة' : 'Correct Answers'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary)' }}>+{mcqPoints}</div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {lang === 'ar' ? `${correctCount} × 1 نقطة` : `${correctCount} × 1 pt`}
            </div>
          </div>

          {/* Full mark bonus */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '14px',
            backgroundColor: fullMarkBonus > 0 ? 'rgba(22, 163, 74, 0.08)' : 'var(--bg-subtle)',
            border: `1px solid ${fullMarkBonus > 0 ? 'rgba(22, 163, 74, 0.3)' : 'var(--border-subtle)'}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '4px' }}>
              {lang === 'ar' ? 'بونص الإتقان الكامل' : 'Perfect Score Bonus'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: fullMarkBonus > 0 ? 'var(--success)' : 'var(--text-muted)' }}>+{fullMarkBonus}</div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {fullMarkBonus > 0 ? (lang === 'ar' ? 'درجة كاملة!' : '100% achieved!') : (lang === 'ar' ? 'يتطلب 100%' : 'Requires 100%')}
            </div>
          </div>

          {/* Streak bonus */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '14px',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '4px' }}>
              {lang === 'ar' ? 'بونص الانتظام' : 'Streak Bonus'}
            </div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--warning)' }}>+{streakBonus}</div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {lang === 'ar' ? 'نشاط يومي' : 'Daily activity'}
            </div>
          </div>

          {/* Total */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%)',
            textAlign: 'center',
            boxShadow: '0 6px 18px rgba(21, 136, 199, 0.3)'
          }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: '700', marginBottom: '4px' }}>
              {lang === 'ar' ? 'إجمالي المكتسب' : 'Total Earned'}
            </div>
            <div style={{ fontSize: '26px', fontWeight: '900', color: '#FFFFFF' }}>+{totalPointsEarned}</div>
            <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.75)', marginTop: '2px' }}>
              {lang === 'ar' ? 'نقطة دوري' : 'league pts'}
            </div>
          </div>
        </div>
      </div>

      {/* League Ranking CTA Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1.5px solid rgba(21, 136, 199, 0.35)',
        borderRadius: '20px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'linear-gradient(135deg, rgba(6, 37, 78, 0.04) 0%, rgba(21, 136, 199, 0.06) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #06254E 0%, #1588C7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Trophy size={22} color="var(--warning)" />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '2px' }}>
              {lang === 'ar' ? 'شوف ترتيبك في دوري المتفوقين' : 'View Your League Standing'}
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              {lang === 'ar'
                ? `أضفت +${totalPointsEarned} نقطة لرصيدك — تحقق من مركزك الحالي بين زملائك`
                : `+${totalPointsEarned} pts added — check your current rank among peers`}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/student/league')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '13px 24px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #06254E 0%, #1588C7 100%)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '14px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(21, 136, 199, 0.35)',
            whiteSpace: 'nowrap'
          }}
        >
          <Trophy size={17} />
          <span>{lang === 'ar' ? 'عرض ترتيبي في الدوري' : 'View My League Rank'}</span>
          {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
};
