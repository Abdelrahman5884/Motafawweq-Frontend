import React from 'react';
import { Trophy, Crown } from 'lucide-react';

export const LeaguePodium = ({ top1, top2, top3, lang }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '20px',
      padding: '20px 24px',
      marginBottom: '24px',
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
          <Trophy size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'منصة التتويج والمراكز الأولى' : 'Top 3 Podium'}
          </h3>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
          دوري النخبة الماسي
        </span>
      </div>

      {/* Compact Podiums Layout */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '14px',
        maxWidth: '680px',
        margin: '0 auto',
        paddingTop: '8px'
      }}>
        {/* 2nd Place */}
        {top2 && (
          <div style={{
            flex: 1,
            maxWidth: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <img
                src={top2.avatar}
                alt={top2.nameAr}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--border-medium)'
                }}
              />
            </div>

            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
              {top2.nameAr}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
              {top2.score.toLocaleString()} نقطة
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
          <div style={{
            flex: 1,
            maxWidth: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
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
                  border: '2.5px solid var(--warning)',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.25)'
                }}
              />
            </div>

            <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
              {top1.nameAr}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--warning)', marginBottom: '8px' }}>
              {top1.score.toLocaleString()} نقطة
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
          <div style={{
            flex: 1,
            maxWidth: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <img
                src={top3.avatar}
                alt={top3.nameAr}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #D97706'
                }}
              />
            </div>

            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
              {top3.nameAr}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#B45309', marginBottom: '8px' }}>
              {top3.score.toLocaleString()} نقطة
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
    </div>
  );
};
