import React from 'react';
import { Search, X, Play } from 'lucide-react';

export const LessonTranscriptTab = ({
  transcriptSegments,
  transcriptSearch,
  setTranscriptSearch,
  currentTime,
  seekTo,
  fmt,
  lang
}) => {
  const filtered = transcriptSegments.filter(
    seg => !transcriptSearch || seg.text.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  return (
    <div className="lv-transcript">
      {/* Search bar inside transcript */}
      <div className="lv-transcript__search-bar">
        <Search size={15} />
        <input
          type="text"
          placeholder={lang === 'ar' ? 'ابحث في كلمات وشرح الحصة...' : 'Search in lecture transcript...'}
          value={transcriptSearch}
          onChange={e => setTranscriptSearch(e.target.value)}
          className="lv-transcript__search-input"
        />
        {transcriptSearch && (
          <button onClick={() => setTranscriptSearch('')} className="lv-transcript__search-clear">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Segments List */}
      <div className="lv-transcript__list">
        {filtered.map(seg => {
          const isCurrent = currentTime >= seg.startSec && currentTime < seg.endSec;
          return (
            <div
              key={seg.id}
              className={`lv-transcript__item ${isCurrent ? 'active' : ''}`}
              onClick={() => seekTo(seg.startSec)}
            >
              <button className="lv-transcript__time-btn" title="تشغيل من هذه النقطة">
                <Play size={11} fill="currentColor" />
                <span>{fmt(seg.startSec)}</span>
              </button>
              <div className="lv-transcript__content">
                <div className="lv-transcript__speaker">{seg.speaker}</div>
                <p className="lv-transcript__p">{seg.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
