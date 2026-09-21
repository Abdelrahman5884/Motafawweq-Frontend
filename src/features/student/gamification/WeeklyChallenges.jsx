import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, ChevronLeft, ArrowUpRight } from 'lucide-react';

export const WeeklyChallenges = ({ challenges, lang }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '20px',
      padding: '22px 24px',
      boxShadow: 'var(--shadow-xs)'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '18px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-arabic)' }}>
            {lang === 'ar' ? 'تحديات الأسبوع على المنصة' : 'Platform Weekly Challenges'}
          </h3>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
          تتجدد التحديات كل يوم أحد
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {challenges.map((ch) => {
          const percent = Math.min(100, Math.round((ch.current / ch.target) * 100));

          return (
            <div
              key={ch.id}
              style={{
                padding: '16px 20px',
                borderRadius: '16px',
                backgroundColor: ch.completed ? 'rgba(16, 185, 129, 0.06)' : 'var(--bg-subtle)',
                border: '1px solid',
                borderColor: ch.completed ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px', flex: 1 }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: ch.completed ? 'var(--success)' : 'var(--bg-surface)',
                    color: ch.completed ? '#FFFFFF' : 'var(--primary)',
                    border: ch.completed ? 'none' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {ch.completed ? <CheckCircle2 size={19} /> : <Target size={18} />}
                  </div>

                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {ch.titleAr}
                    </div>
                    {ch.descAr && (
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {ch.descAr}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(21, 136, 199, 0.1)',
                    color: 'var(--primary)',
                    fontWeight: '800',
                    fontSize: '12px'
                  }}>
                    +{ch.xpReward} نقطة
                  </div>

                  {ch.completed ? (
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: 'var(--success)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)'
                    }}>
                      مكتمل
                    </span>
                  ) : (
                    <button
                      onClick={() => ch.link && navigate(ch.link)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'opacity 0.15s ease'
                      }}
                    >
                      <span>بدء التحدي</span>
                      <ChevronLeft size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: '600' }}>
                  <span>معدل الإنجاز</span>
                  <span>{ch.current} من {ch.target} ({percent}%)</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percent}%`,
                    height: '100%',
                    backgroundColor: ch.completed ? 'var(--success)' : 'var(--primary)',
                    borderRadius: '3px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
