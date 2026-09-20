import React from 'react';
import { ChevronRight } from 'lucide-react';

export const LectureTopicsTab = ({ chapters, lang, isRtl, onJumpToTime }) => {
  return (
    <div style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
        {lang === 'ar' ? 'فصول ومحاور الشرح المستخرجة:' : 'Extracted Lecture Topics:'}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {chapters.map((ch, idx) => (
          <div
            key={ch.id}
            onClick={() => onJumpToTime(ch.startSeconds)}
            style={{
              padding: '16px 20px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '900'
              }}>
                {idx + 1}
              </span>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {ch.titleAr}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  يبدأ عند الدقيقة {ch.timestamp}
                </div>
              </div>
            </div>

            <ChevronRight size={18} color="var(--text-muted)" style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
          </div>
        ))}
      </div>
    </div>
  );
};
