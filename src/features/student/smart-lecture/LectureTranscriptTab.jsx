import React from 'react';
import { Search, Play } from 'lucide-react';

export const LectureTranscriptTab = ({
  searchTranscript,
  setSearchTranscript,
  filteredTranscript,
  activeSeconds,
  lang = 'ar',
  onJumpToTime
}) => {
  return (
    <div style={{ padding: '20px 24px' }}>
      {/* Search Input in Transcript */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '9px 14px',
        marginBottom: '16px',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <Search size={16} color="var(--text-muted)" />
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
            width: '100%',
            fontFamily: 'var(--font-arabic)'
          }}
        />
      </div>

      {/* Transcript Snippets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredTranscript.map((t) => {
          const isActive = activeSeconds >= t.startSeconds && activeSeconds < t.startSeconds + 120;
          return (
            <div
              key={t.id}
              onClick={() => onJumpToTime(t.startSeconds)}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: isActive ? 'var(--primary-surface)' : 'var(--bg-surface)',
                border: '1px solid',
                borderColor: isActive ? 'var(--primary)' : 'var(--border-subtle)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                transition: 'all 0.15s ease',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <button
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: isActive ? '#FFFFFF' : 'var(--primary)',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0
                }}
              >
                <Play size={10} fill="currentColor" />
                <span>{t.timestamp}</span>
              </button>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  marginBottom: '2px',
                  fontFamily: 'var(--font-arabic)'
                }}>
                  {t.speaker}
                </div>
                <div style={{
                  fontSize: '13.5px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.55,
                  fontFamily: 'var(--font-arabic)'
                }}>
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

