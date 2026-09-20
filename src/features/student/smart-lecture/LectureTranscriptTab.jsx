import React from 'react';
import { Search } from 'lucide-react';

export const LectureTranscriptTab = ({
  searchTranscript,
  setSearchTranscript,
  filteredTranscript,
  activeSeconds,
  lang,
  onJumpToTime
}) => {
  return (
    <div style={{ padding: '24px' }}>
      {/* Search Input in Transcript */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'var(--bg-subtle)',
        border: '1.5px solid var(--border-medium)',
        borderRadius: '14px',
        padding: '10px 16px',
        marginBottom: '20px'
      }}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          placeholder={lang === 'ar' ? 'ابحث عن أي كلمة قيلت في المحاضرة (مثل: انشطار الماء، PGAL)...' : 'Search words in transcript...'}
          value={searchTranscript}
          onChange={(e) => setSearchTranscript(e.target.value)}
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '13px',
            width: '100%'
          }}
        />
      </div>

      {/* Transcript Snippets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredTranscript.map((t) => {
          const isActive = activeSeconds >= t.startSeconds && activeSeconds < t.startSeconds + 120;
          return (
            <div
              key={t.id}
              onClick={() => onJumpToTime(t.startSeconds)}
              style={{
                padding: '14px 18px',
                borderRadius: '16px',
                backgroundColor: isActive ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                border: '1.5px solid',
                borderColor: isActive ? 'var(--primary)' : 'var(--border-subtle)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                transition: 'all 0.15s ease'
              }}
            >
              <button
                style={{
                  padding: '4px 8px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-surface)',
                  color: isActive ? '#FFFFFF' : 'var(--primary)',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                ▶ {t.timestamp}
              </button>

              <div>
                <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--primary)', marginBottom: '2px' }}>
                  {t.speaker}
                </div>
                <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {t.textAr}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
