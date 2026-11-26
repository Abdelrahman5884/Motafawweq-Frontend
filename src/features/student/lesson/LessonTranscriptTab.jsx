import React, { useMemo } from 'react';
import { Search, X, Play } from 'lucide-react';

export const LessonTranscriptTab = ({
  transcriptSegments = [],
  transcriptSearch,
  setTranscriptSearch,
  currentTime,
  seekTo,
  fmt,
  lang,
}) => {
  const isAr = lang === 'ar';
  const trimmedQuery = transcriptSearch.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!trimmedQuery) return transcriptSegments;
    return transcriptSegments.filter((seg) => {
      const hay = `${seg.text || ''} ${seg.textEn || ''} ${seg.speaker || ''}`.toLowerCase();
      return hay.includes(trimmedQuery);
    });
  }, [transcriptSegments, trimmedQuery]);

  return (
    <div className="lv-transcript">
      {/* Search bar inside transcript */}
      <div className="lv-transcript__search-bar">
        <Search size={15} />
        <input
          type="text"
          placeholder={
            isAr ? 'ابحث في كلمات وشرح الحصة...' : 'Search in lecture transcript...'
          }
          value={transcriptSearch}
          onChange={(e) => setTranscriptSearch(e.target.value)}
          className="lv-transcript__search-input"
        />
        {trimmedQuery && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: '800',
              color: 'var(--primary)',
              whiteSpace: 'nowrap',
            }}
          >
            {filtered.length} {isAr ? 'نتيجة' : 'matches'}
          </span>
        )}
        {transcriptSearch && (
          <button
            type="button"
            onClick={() => setTranscriptSearch('')}
            className="lv-transcript__search-clear"
            aria-label={isAr ? 'مسح البحث' : 'Clear search'}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Segments List */}
      <div className="lv-transcript__list">
        {transcriptSegments.length === 0 ? (
          <div
            style={{
              padding: '28px 16px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '13.5px',
              fontWeight: '700',
            }}
          >
            {isAr
              ? 'لا يوجد تفريغ نصي متاح لهذا الدرس حالياً.'
              : 'No transcript available for this lesson yet.'}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: '28px 16px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
            }}
          >
            {isAr
              ? `لا توجد فقرات مطابقة للبحث «${transcriptSearch}».`
              : `No transcript lines match "${transcriptSearch}".`}
          </div>
        ) : (
          filtered.map((seg) => {
            const isCurrent =
              currentTime >= seg.startSec && currentTime < seg.endSec;
            const segText = isAr ? seg.text : seg.textEn || seg.text;

            return (
              <div
                key={seg.id}
                className={`lv-transcript__item ${isCurrent ? 'active' : ''}`}
                onClick={() => seekTo(seg.startSec)}
              >
                <button
                  type="button"
                  className="lv-transcript__time-btn"
                  title={isAr ? 'تشغيل من هذه النقطة' : 'Play from here'}
                >
                  <Play size={11} fill="currentColor" />
                  <span>{fmt(seg.startSec)}</span>
                </button>
                <div className="lv-transcript__content" style={{ minWidth: 0 }}>
                  {seg.speaker && (
                    <div className="lv-transcript__speaker">{seg.speaker}</div>
                  )}
                  <p
                    dir="auto"
                    className="lv-transcript__p"
                    style={{
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word',
                    }}
                  >
                    {segText}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
