import React from 'react';
import { Play, Sparkles, Trash2 } from 'lucide-react';

export const LessonNotesTab = ({
  notes,
  noteInput,
  setNoteInput,
  handleAddNote,
  handleDeleteNote,
  seekTo,
  currentTime,
  fmt,
  lang
}) => {
  const onSubmit = (e) => {
    e.preventDefault();
    handleAddNote();
  };

  return (
    <div className="lv-notes">
      <div className="lv-notes__head">
        <div className="lv-notes__title-group">
          <h3 className="lv-notes__heading">{lang === 'ar' ? 'مفكرة الطالب الذكية' : 'Student Notebook'}</h3>
          <span className="lv-notes__saved">
            <span className="lv-notes__saved-dot" />
            {lang === 'ar' ? `تم الحفظ تلقائياً: ${fmt(currentTime)}` : `Auto-saved: ${fmt(currentTime)}`}
          </span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="lv-notes__form">
        <textarea
          rows={3}
          value={noteInput}
          onChange={e => setNoteInput(e.target.value)}
          placeholder={lang === 'ar' ? 'اكتب ملاحظاتك هنا... سيتم ربط الملاحظة بالوقت الحالي للمقطع' : 'Type your notes here... linked to current video timestamp.'}
          className="lv-notes__input"
        />
        <div className="lv-notes__form-footer">
          <span className="lv-notes__hint">
            {lang === 'ar' ? `سيتم تسجيل الملاحظة عند الدقيقة ${fmt(currentTime)}` : `Linked at ${fmt(currentTime)}`}
          </span>
          <button type="submit" disabled={!noteInput.trim()} className="lv-notes__submit">
            <Sparkles size={13} />
            <span>{lang === 'ar' ? 'حفظ الملاحظة' : 'Save Note'}</span>
          </button>
        </div>
      </form>

      {notes.length > 0 && (
        <div className="lv-notes__list">
          {notes.map((n, i) => (
            <div key={n.id} className="lv-note" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="lv-note__top">
                <button
                  className="lv-note__ts"
                  onClick={() => seekTo(n.sec)}
                  title="انتقل لهذا التوقيت في الفيديو"
                >
                  <Play size={10} fill="currentColor" />
                  <span>{n.ts}</span>
                </button>
                <div className="lv-note__actions">
                  <span className="lv-note__date">{n.date}</span>
                  <button
                    className="lv-note__del"
                    onClick={() => handleDeleteNote(n)}
                    title="حذف الملاحظة"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <p className="lv-note__text">{n.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
