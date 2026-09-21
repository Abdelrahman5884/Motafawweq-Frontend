import React from 'react';
import { Award, ChevronLeft, ChevronRight, Flame } from 'lucide-react';

export const LeagueLeaderboardTable = ({ students, lang, isRtl, onSelectStudent }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '18px',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-xs)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {students.map((item) => {
          const isMe = item.isMe;

          return (
            <div
              key={item.rank}
              onClick={() => onSelectStudent?.(item)}
              role="button"
              tabIndex={0}
              title={`عرض إنجازات الطالب ${item.nameAr}`}
              style={{
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
                backgroundColor: isMe ? 'rgba(92, 182, 219, 0.1)' : 'transparent',
                borderBottom: '1px solid var(--border-subtle)',
                transition: 'background-color 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!isMe) e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
              }}
              onMouseLeave={(e) => {
                if (!isMe) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {/* Rank & Student Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: item.rank === 1 ? 'rgba(245, 158, 11, 0.12)' : item.rank === 2 ? 'rgba(21, 136, 199, 0.12)' : item.rank === 3 ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg-subtle)',
                  color: item.rank === 1 ? '#D97706' : item.rank === 2 ? 'var(--primary)' : item.rank === 3 ? '#B45309' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '13px',
                  flexShrink: 0
                }}>
                  {item.rank}
                </div>

                <img
                  src={item.avatar}
                  alt={item.nameAr}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: isMe ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    flexShrink: 0
                  }}
                />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '800',
                      color: isMe ? 'var(--primary)' : 'var(--text-primary)'
                    }}>
                      {item.nameAr}
                    </span>
                    {isMe && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF'
                      }}>
                        {lang === 'ar' ? 'أنت' : 'You'}
                      </span>
                    )}
                    {item.streak && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#EA580C',
                        backgroundColor: 'rgba(234, 88, 12, 0.08)',
                        padding: '1px 6px',
                        borderRadius: '6px'
                      }}>
                        <Flame size={11} />
                        {item.streak}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {item.schoolAr}
                  </div>
                </div>
              </div>

              {/* Quizzes & Score */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  textAlign: isRtl ? 'left' : 'right',
                  minWidth: '85px'
                }}>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: isMe ? 'var(--primary)' : 'var(--text-primary)' }}>
                    {item.score?.toLocaleString()} نقطة
                  </div>
                  <div style={{ fontSize: '11px', color: item.change > 0 ? 'var(--success)' : item.change < 0 ? 'var(--danger, #EF4444)' : 'var(--text-secondary)', fontWeight: '600' }}>
                    {item.change > 0 ? `+${item.change} مركز` : item.change < 0 ? `${item.change}` : 'ثابت'}
                  </div>
                </div>

                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
