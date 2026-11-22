import React, { useState } from 'react';
import {
  Search,
  Copy,
  Check,
  Edit3,
  Plus,
  Save,
  X,
  Trash2,
  Loader2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { formatSecondsToTimestamp, parseTimestampToSeconds } from './workspaceUtils';

export const WorkspaceTranscriptTab = ({
  lesson,
  lang,
  isRtl,
  onJumpToTimestamp,
  onGetCurrentTime,
  onSyncTranscript,
}) => {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const segments = lesson.transcript || [];

  const openEditor = () => {
    setError('');
    setDrafts(
      segments.map((seg, idx) => ({
        key: seg.id || `seg-${idx}`,
        speaker: seg.speaker || (isAr ? 'المعلم' : 'Teacher'),
        timestamp: seg.timestamp || formatSecondsToTimestamp(seg.startSeconds || 0),
        textAr: seg.textAr || seg.text || '',
      }))
    );
    setIsEditing(true);
  };

  const handleAddSegment = () => {
    const nowSecs = onGetCurrentTime ? onGetCurrentTime() : 0;
    setDrafts((prev) => [
      ...prev,
      {
        key: `new-seg-${Date.now()}-${prev.length}`,
        speaker: isAr ? 'المعلم' : 'Teacher',
        timestamp: formatSecondsToTimestamp(nowSecs),
        textAr: '',
      },
    ]);
  };

  const handleSave = async () => {
    setError('');
    const cleaned = drafts
      .map((row) => ({
        speaker: row.speaker.trim() || (isAr ? 'المعلم' : 'Teacher'),
        start_seconds: parseTimestampToSeconds(row.timestamp),
        timestamp: formatSecondsToTimestamp(parseTimestampToSeconds(row.timestamp)),
        text_ar: row.textAr.trim(),
      }))
      .filter((row) => row.text_ar.length > 0);

    setSaving(true);
    try {
      await onSyncTranscript(lesson.id, cleaned);
      setIsEditing(false);
    } catch (err) {
      setError(err?.message || (isAr ? 'تعذر حفظ التفريغ النصي.' : 'Failed to save transcript.'));
    } finally {
      setSaving(false);
    }
  };

  const handleCopyAll = () => {
    if (!segments.length) return;
    const fullText = segments
      .map((seg) => `[${seg.timestamp || '00:00'}] ${seg.textAr || seg.text || ''}`)
      .join('\n\n');
    navigator.clipboard?.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredSegments = segments.filter((seg) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (seg.textAr || seg.text || '').toLowerCase().includes(q) ||
      (seg.speaker || '').toLowerCase().includes(q)
    );
  });

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px 24px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
          {isAr ? `التفريغ النصي للحصة (${segments.length})` : `Lesson Transcript (${segments.length})`}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {!isEditing && segments.length > 0 && (
            <>
              <div style={{ position: 'relative' }}>
                <Search
                  size={14}
                  color="var(--text-tertiary)"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    [isRtl ? 'right' : 'left']: '10px',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'ابحث في النص...' : 'Search transcript...'}
                  style={{
                    padding: isRtl ? '7px 32px 7px 12px' : '7px 12px 7px 32px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '12.5px',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handleCopyAll}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : isAr ? 'نسخ الكل' : 'Copy All'}</span>
              </button>
            </>
          )}

          {!isEditing ? (
            <button
              type="button"
              onClick={openEditor}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 13px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--primary)',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              <Edit3 size={14} />
              <span>{segments.length > 0 ? (isAr ? 'تعديل التفريغ' : 'Edit Transcript') : isAr ? 'كتابة تفريغ نصي' : 'Add Transcript'}</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={saving}
                onClick={handleAddSegment}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--primary)',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                <Plus size={14} />
                <span>{isAr ? 'إضافة فقرة' : 'Add Segment'}</span>
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? <Loader2 size={14} className="lw-spin" /> : <Save size={14} />}
                <span>{isAr ? 'حفظ التفريغ' : 'Save'}</span>
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => setIsEditing(false)}
                style={{
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <X size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div
          style={{
            marginBottom: '14px',
            padding: '10px 12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
            fontSize: '12.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
          }}
        >
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {drafts.length === 0 ? (
            <div style={{ padding: '28px', textAlign: 'center', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)', fontSize: '13px' }}>
              {isAr
                ? 'اضغط «إضافة فقرة» لكتابة التفريغ النصي مع التوقيت، أو اضغط «حفظ التفريغ» لمسحه.'
                : 'Click "Add Segment" to write timestamped transcript lines, or "Save" to clear.'}
            </div>
          ) : (
            drafts.map((row, idx) => (
              <div
                key={row.key}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    dir="ltr"
                    value={row.timestamp}
                    onChange={(e) =>
                      setDrafts((prev) =>
                        prev.map((r, i) => (i === idx ? { ...r, timestamp: e.target.value } : r))
                      )
                    }
                    placeholder="00:00"
                    style={{
                      width: '74px',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      color: 'var(--primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      fontWeight: '700',
                      textAlign: 'center',
                    }}
                  />
                  <input
                    type="text"
                    value={row.speaker}
                    onChange={(e) =>
                      setDrafts((prev) =>
                        prev.map((r, i) => (i === idx ? { ...r, speaker: e.target.value } : r))
                      )
                    }
                    placeholder={isAr ? 'المتحدث (مثال: المعلم)' : 'Speaker'}
                    style={{
                      width: '160px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      color: 'var(--text-primary)',
                      fontSize: '12.5px',
                      fontFamily: 'inherit',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setDrafts((prev) => prev.filter((_, i) => i !== idx))}
                    style={{
                      marginInlineStart: 'auto',
                      padding: '6px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#EF4444',
                      cursor: 'pointer',
                      display: 'flex',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={row.textAr}
                  onChange={(e) =>
                    setDrafts((prev) =>
                      prev.map((r, i) => (i === idx ? { ...r, textAr: e.target.value } : r))
                    )
                  }
                  placeholder={isAr ? 'نص الشرح في هذا الجزء...' : 'Transcript text...'}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            ))
          )}
        </div>
      ) : segments.length === 0 ? (
        <div
          style={{
            padding: '36px 20px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-subtle)',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '13.5px',
          }}
        >
          <FileText size={26} color="var(--primary)" style={{ margin: '0 auto 10px', display: 'block', opacity: 0.7 }} />
          <div>
            {isAr
              ? 'لا يوجد تفريغ نصي لهذه الحصة حتى الآن. يمكنك كتابته وتوقيته يدوياً من زر «كتابة تفريغ نصي».'
              : 'No transcript yet. Click "Add Transcript" to create timestamped study notes.'}
          </div>
        </div>
      ) : filteredSegments.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
          {isAr ? 'لا توجد فقرات مطابقة لكلمة البحث.' : 'No matching transcript segments.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredSegments.map((seg, idx) => (
            <div
              key={seg.id || idx}
              onClick={() => onJumpToTimestamp(seg.startSeconds || 0)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-surface)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  flexShrink: 0,
                }}
              >
                {seg.timestamp || '00:00'}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                {seg.speaker && (
                  <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                    {seg.speaker}
                  </div>
                )}
                <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.7, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                  {seg.textAr || seg.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
