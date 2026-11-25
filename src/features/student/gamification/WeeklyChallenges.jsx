import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export const WeeklyChallenges = ({ challenges = [], lang = 'ar' }) => {
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  const firstChallenge = challenges[0] || null;
  const daysLeft = firstChallenge?.daysLeft ?? null;
  const resetDay = isAr
    ? firstChallenge?.resetDayAr || 'السبت'
    : firstChallenge?.resetDayEn || 'Saturday';

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '22px 24px',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '18px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={18} color="var(--primary)" />
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: 0,
              fontFamily: 'var(--font-arabic)',
            }}
          >
            {isAr ? 'تحديات الأسبوع على المنصة' : 'Weekly Platform Challenges'}
          </h3>
        </div>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontWeight: '700',
          }}
        >
          <Clock size={13} color="var(--primary)" />
          <span>
            {isAr
              ? `تتجدد كل يوم ${resetDay}${daysLeft !== null ? ` • متبقي ${daysLeft} يوم` : ''}`
              : `Resets every ${resetDay}${daysLeft !== null ? ` • ${daysLeft}d left` : ''}`}
          </span>
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {challenges.length === 0 && (
          <div
            style={{
              padding: '28px 16px',
              textAlign: 'center',
              borderRadius: '14px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px dashed var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '13.5px',
              fontWeight: '700',
            }}
          >
            {isAr ? 'لا توجد تحديات أسبوعية متاحة حالياً.' : 'No weekly challenges available right now.'}
          </div>
        )}

        {challenges.map((ch) => {
          const isCompleted = Boolean(ch.isCompleted ?? ch.completed);
          const xpReward = Number(ch.xpReward ?? ch.xp ?? 0);
          const target = Math.max(1, Number(ch.target || 1));
          const current = Math.min(target, Number(ch.current || 0));
          const percent = Math.min(100, Math.round((current / target) * 100));
          const title = isAr ? ch.titleAr : ch.titleEn || ch.titleAr;
          const desc = isAr ? ch.descAr : ch.descEn || ch.descAr;

          return (
            <div
              key={ch.id}
              style={{
                padding: '16px 20px',
                borderRadius: '16px',
                backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.06)' : 'var(--bg-subtle)',
                border: '1px solid',
                borderColor: isCompleted ? 'rgba(16, 185, 129, 0.32)' : 'var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px', flex: 1 }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '11px',
                      backgroundColor: isCompleted ? 'var(--success)' : 'var(--bg-surface)',
                      color: isCompleted ? '#FFFFFF' : 'var(--primary)',
                      border: isCompleted ? 'none' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={19} /> : <Target size={18} />}
                  </div>

                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {title}
                    </div>
                    {desc && (
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {desc}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(21, 136, 199, 0.1)',
                      color: 'var(--primary)',
                      fontWeight: '800',
                      fontSize: '12px',
                    }}
                  >
                    +{xpReward} {isAr ? 'نقطة XP' : 'XP'}
                  </div>

                  {isCompleted ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        fontWeight: '800',
                        color: 'var(--success)',
                        padding: '5px 11px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(16, 185, 129, 0.14)',
                      }}
                    >
                      <CheckCircle2 size={13} />
                      <span>{isAr ? 'مكتمل • أُضيفت النقاط' : 'Completed • XP Added'}</span>
                    </span>
                  ) : (
                    ch.link && (
                      <button
                        type="button"
                        onClick={() => navigate(ch.link)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: 'pointer',
                        }}
                      >
                        <span>{isAr ? 'بدء التحدي' : 'Start Challenge'}</span>
                        {isAr ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11.5px',
                    color: 'var(--text-secondary)',
                    marginBottom: '5px',
                    fontWeight: '700',
                  }}
                >
                  <span>{isAr ? 'معدل الإنجاز' : 'Progress'}</span>
                  <span>
                    {isAr
                      ? `${current} من ${target} (${percent}%)`
                      : `${current} / ${target} (${percent}%)`}
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: '100%',
                      backgroundColor: isCompleted ? 'var(--success)' : 'var(--primary)',
                      borderRadius: '999px',
                      transition: 'width 0.35s ease',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
