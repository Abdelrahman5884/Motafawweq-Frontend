import React, { useState } from 'react';
import { Play, Sparkles, Trash2, Pencil, Check, X } from 'lucide-react';

export const LessonNotesTab = ({
  notes = [],
  noteInput,
  setNoteInput,
  isSavingNote = false,
  handleAddNote,
  handleUpdateNote,
  handleDeleteNote,
  seekTo,
  currentTime,
  fmt,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editDraft, setEditDraft] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    handleAddNote();
  };

  const startEdit = (note) => {
    setEditingNoteId(note.id);
    setEditDraft(note.text || '');
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setEditDraft('');
  };

  const submitEdit = async (noteId) => {
    if (!editDraft.trim() || isUpdating) return;
    setIsUpdating(true);
    try {
      const ok = await handleUpdateNote?.(noteId, editDraft.trim());
      if (ok) {
        cancelEdit();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="lv-notes">
      <div className="lv-notes__head">
        <div className="lv-notes__title-group">
          <h3 className="lv-notes__heading">
            {isAr ? 'مفكرة الطالب الذكية' : 'Student Notebook'}
          </h3>
          <span className="lv-notes__saved">
            <span className="lv-notes__saved-dot" />
            {isAr
              ? `ملاحظاتك المحفوظة: ${notes.length}`
              : `Saved Notes: ${notes.length}`}
          </span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="lv-notes__form">
        <textarea
          rows={3}
          maxLength={2000}
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder={
            isAr
              ? 'اكتب ملاحظاتك هنا... سيتم ربط الملاحظة بالتوقيت الحالي للشرح تلقائياً'
              : 'Type your notes here... automatically linked to the current timestamp.'
          }
          className="lv-notes__input"
        />
        <div className="lv-notes__form-footer">
          <span className="lv-notes__hint">
            {isAr
              ? `مرتبطة عند الدقيقة ${fmt(currentTime)} • ${noteInput.length}/2000`
              : `Linked at ${fmt(currentTime)} • ${noteInput.length}/2000`}
          </span>
          <button
            type="submit"
            disabled={!noteInput.trim() || isSavingNote}
            className="lv-notes__submit"
          >
            <Sparkles size={13} />
            <span>
              {isSavingNote
                ? isAr
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : isAr
                  ? 'حفظ الملاحظة'
                  : 'Save Note'}
            </span>
          </button>
        </div>
      </form>

      {notes.length === 0 ? (
        <div
          style={{
            padding: '24px 16px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: '600',
          }}
        >
          {isAr
            ? 'لا توجد ملاحظات مسجلة على هذا الدرس حتى الآن. دوّن أول ملاحظة للرجوع إليها قبل الامتحان.'
            : 'No notes saved for this lesson yet.'}
        </div>
      ) : (
        <div className="lv-notes__list">
          {notes.map((n, i) => {
            const isEditingThis = editingNoteId === n.id;
            return (
              <div
                key={n.id}
                className="lv-note"
                style={{ animationDelay: `${Math.min(i, 8) * 0.04}s`, minWidth: 0 }}
              >
                <div className="lv-note__top">
                  <button
                    type="button"
                    className="lv-note__ts"
                    onClick={() => seekTo(n.sec)}
                    title={isAr ? 'انتقل لهذا التوقيت في الشرح' : 'Jump to timestamp'}
                  >
                    <Play size={10} fill="currentColor" />
                    <span>{n.ts}</span>
                  </button>
                  <div className="lv-note__actions">
                    <span className="lv-note__date">{n.date}</span>
                    {!isEditingThis && handleUpdateNote && (
                      <button
                        type="button"
                        className="lv-note__del"
                        onClick={() => startEdit(n)}
                        title={isAr ? 'تعديل الملاحظة' : 'Edit note'}
                        aria-label={isAr ? 'تعديل الملاحظة' : 'Edit note'}
                      >
                        <Pencil size={13} />
                      </button>
                    )}
                    <button
                      type="button"
                      className="lv-note__del"
                      onClick={() => handleDeleteNote(n)}
                      title={isAr ? 'حذف الملاحظة' : 'Delete note'}
                      aria-label={isAr ? 'حذف الملاحظة' : 'Delete note'}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {isEditingThis ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                    <textarea
                      rows={3}
                      maxLength={2000}
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      className="lv-notes__input"
                      style={{ minHeight: '72px' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '5px 11px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-subtle)',
                          background: 'transparent',
                          color: 'var(--text-secondary)',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={13} />
                        <span>{isAr ? 'إلغاء' : 'Cancel'}</span>
                      </button>
                      <button
                        type="button"
                        disabled={!editDraft.trim() || isUpdating}
                        onClick={() => submitEdit(n.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '5px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: !editDraft.trim() || isUpdating ? 'not-allowed' : 'pointer',
                          opacity: !editDraft.trim() || isUpdating ? 0.65 : 1,
                        }}
                      >
                        <Check size={13} />
                        <span>{isUpdating ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ' : 'Save')}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p
                    className="lv-note__text"
                    style={{
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {n.text}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
