import React from 'react';
import { Play, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export const LectureTopicsTab = ({ chapters, lang = 'ar', isRtl = true, onJumpToTime }) => {
  return (
    <div style={{ padding: '20px 24px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          margin: 0,
          fontFamily: 'var(--font-arabic)'
        }}>
          {lang === 'ar' ? 'فصول ومحاور الشرح المستخرجة بالذكاء الاصطناعي' : 'Extracted Lecture Topics'}
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {lang === 'ar' ? `${chapters.length} محاور رئيسية` : `${chapters.length} chapters`}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {chapters.map((ch, idx) => (
          <div
            key={ch.id}
            onClick={() => onJumpToTime(ch.startSeconds)}
            style={{
              padding: '14px 18px',
              borderRadius: '14px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: 'var(--shadow-xs)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.backgroundColor = 'var(--primary-surface)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12.5px',
                fontWeight: '700'
              }}>
                {idx + 1}
              </span>
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-arabic)'
                }}>
                  {ch.titleAr}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  marginTop: '2px'
                }}>
                  <Clock size={12} color="var(--text-muted)" />
                  <span>يبدأ عند الدقيقة {ch.timestamp}</span>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                fontSize: '12px',
                color: 'var(--primary)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'var(--primary-light)',
                padding: '4px 10px',
                borderRadius: '8px'
              }}>
                <Play size={11} fill="currentColor" />
                <span>تشغيل</span>
              </span>
              {isRtl ? (
                <ChevronLeft size={16} color="var(--text-muted)" />
              ) : (
                <ChevronRight size={16} color="var(--text-muted)" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

