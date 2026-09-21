import React from 'react';
import { Trophy, Crown, Sparkles, Medal } from 'lucide-react';

export const LeaguePodium = ({ top1, top2, top3, lang, onSelectStudent, leagueBadge }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '20px',
      padding: '20px 20px',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-xs)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '18px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '12px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'منصة التتويج والمراكز الأولى' : 'Top 3 Podium'}
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {leagueBadge || 'دوري النخبة الماسي'}
          </span>
          <span style={{ 
            fontSize: '11px', 
            color: 'var(--primary)', 
            backgroundColor: 'var(--bg-subtle)',
            padding: '3px 8px',
            borderRadius: '6px',
            fontWeight: '600',
            border: '1px solid var(--border-subtle)'
          }}>
            اضغط لعرض إنجازات الطالب
          </span>
        </div>
      </div>

      {/* Desktop Classic Olympic Podium (Hidden on mobile via CSS) */}
      <div className="podium-desktop-layout">
        {/* 2nd Place */}
        {top2 && (
          <div 
            onClick={() => onSelectStudent?.(top2)}
            role="button"
            tabIndex={0}
            title={`عرض إنجازات ${top2.nameAr}`}
            style={{
              flex: 1,
              maxWidth: '180px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <img
                src={top2.avatar}
                alt={top2.nameAr}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: top2.isMe ? '2.5px solid var(--primary)' : '2px solid var(--border-medium)'
                }}
              />
            </div>

            <div style={{ 
              fontSize: '13px', 
              fontWeight: '800', 
              color: top2.isMe ? 'var(--primary)' : 'var(--text-primary)', 
              marginBottom: '2px', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              maxWidth: '100%' 
            }}>
              {top2.nameAr}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
              {top2.score?.toLocaleString()} نقطة
            </div>

            {/* 2nd pedestal */}
            <div style={{
              width: '100%',
              height: '75px',
              borderRadius: '12px 12px 0 0',
              backgroundColor: 'var(--bg-subtle)',
              border: '1.5px solid var(--border-medium)',
              borderBottom: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-secondary)' }}>2</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>المركز الثاني</div>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {top1 && (
          <div 
            onClick={() => onSelectStudent?.(top1)}
            role="button"
            tabIndex={0}
            title={`عرض إنجازات ${top1.nameAr}`}
            style={{
              flex: 1,
              maxWidth: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <Crown size={20} color="var(--warning)" style={{ position: 'absolute', top: '-18px', insetInlineStart: '50%', transform: 'translateX(50%)' }} />
              <img
                src={top1.avatar}
                alt={top1.nameAr}
                style={{
                  width: '62px',
                  height: '62px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: top1.isMe ? '3px solid var(--primary)' : '2.5px solid var(--warning)',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.25)'
                }}
              />
            </div>

            <div style={{ 
              fontSize: '13.5px', 
              fontWeight: '800', 
              color: top1.isMe ? 'var(--primary)' : 'var(--text-primary)', 
              marginBottom: '2px', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              maxWidth: '100%' 
            }}>
              {top1.nameAr}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--warning)', marginBottom: '8px' }}>
              {top1.score?.toLocaleString()} نقطة
            </div>

            {/* 1st pedestal */}
            <div style={{
              width: '100%',
              height: '100px',
              borderRadius: '14px 14px 0 0',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1.5px solid var(--warning)',
              borderBottom: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--warning)' }}>1</div>
              <div style={{ fontSize: '11.5px', color: '#B45309', fontWeight: '700' }}>المركز الأول</div>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3 && (
          <div 
            onClick={() => onSelectStudent?.(top3)}
            role="button"
            tabIndex={0}
            title={`عرض إنجازات ${top3.nameAr}`}
            style={{
              flex: 1,
              maxWidth: '180px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <img
                src={top3.avatar}
                alt={top3.nameAr}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: top3.isMe ? '2.5px solid var(--primary)' : '2px solid #D97706'
                }}
              />
            </div>

            <div style={{ 
              fontSize: '13px', 
              fontWeight: '800', 
              color: top3.isMe ? 'var(--primary)' : 'var(--text-primary)', 
              marginBottom: '2px', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              maxWidth: '100%' 
            }}>
              {top3.nameAr}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#B45309', marginBottom: '8px' }}>
              {top3.score?.toLocaleString()} نقطة
            </div>

            {/* 3rd pedestal */}
            <div style={{
              width: '100%',
              height: '60px',
              borderRadius: '12px 12px 0 0',
              backgroundColor: 'var(--bg-subtle)',
              border: '1.5px solid var(--border-medium)',
              borderBottom: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#9A3412' }}>3</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>المركز الثالث</div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Optimized Podium Layout (Active under 600px) */}
      <div className="podium-mobile-layout">
        {/* 1st Place Card on Mobile */}
        {top1 && (
          <div
            onClick={() => onSelectStudent?.(top1)}
            role="button"
            tabIndex={0}
            style={{
              padding: '14px',
              borderRadius: '16px',
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              border: '1.5px solid var(--warning)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Crown size={18} color="var(--warning)" style={{ position: 'absolute', top: '-14px', insetInlineStart: '50%', transform: 'translateX(50%)' }} />
              <img
                src={top1.avatar}
                alt={top1.nameAr}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--warning)'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                insetInlineEnd: '-4px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#F59E0B',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                1
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {top1.nameAr}
                </div>
                {top1.isMe && (
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '1px 5px', borderRadius: '4px', backgroundColor: 'var(--primary)', color: '#FFFFFF', flexShrink: 0 }}>
                    أنت
                  </span>
                )}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                المركز الأول • بطل الدوري
              </div>
            </div>

            <div style={{ textAlign: 'left', flexShrink: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#B45309' }}>
                {top1.score?.toLocaleString()}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                نقطة
              </div>
            </div>
          </div>
        )}

        {/* 2nd and 3rd Place side-by-side grid on Mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {/* 2nd Place Card */}
          {top2 && (
            <div
              onClick={() => onSelectStudent?.(top2)}
              role="button"
              tabIndex={0}
              style={{
                padding: '12px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ position: 'relative', marginBottom: '6px' }}>
                <img
                  src={top2.avatar}
                  alt={top2.nameAr}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--primary)'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '-3px',
                  insetInlineEnd: '-3px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: '900',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  2
                </div>
              </div>

              <div style={{ fontSize: '12.5px', fontWeight: '800', color: top2.isMe ? 'var(--primary)' : 'var(--text-primary)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {top2.nameAr}
              </div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', marginTop: '2px' }}>
                {top2.score?.toLocaleString()} نقطة
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '1px' }}>
                المركز الثاني
              </div>
            </div>
          )}

          {/* 3rd Place Card */}
          {top3 && (
            <div
              onClick={() => onSelectStudent?.(top3)}
              role="button"
              tabIndex={0}
              style={{
                padding: '12px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ position: 'relative', marginBottom: '6px' }}>
                <img
                  src={top3.avatar}
                  alt={top3.nameAr}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #D97706'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '-3px',
                  insetInlineEnd: '-3px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#D97706',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: '900',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  3
                </div>
              </div>

              <div style={{ fontSize: '12.5px', fontWeight: '800', color: top3.isMe ? 'var(--primary)' : 'var(--text-primary)', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {top3.nameAr}
              </div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#B45309', marginTop: '2px' }}>
                {top3.score?.toLocaleString()} نقطة
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '1px' }}>
                المركز الثالث
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .podium-desktop-layout {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 14px;
          max-width: 680px;
          margin: 0 auto;
          padding-top: 8px;
        }
        .podium-mobile-layout {
          display: none;
        }
        @media (max-width: 600px) {
          .podium-desktop-layout {
            display: none !important;
          }
          .podium-mobile-layout {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};
