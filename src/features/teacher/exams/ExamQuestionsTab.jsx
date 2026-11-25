import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { ARABIC_OPTION_LETTERS, QUESTION_TYPES } from './examConstants';

const INPUT_STYLE = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: '7px',
  border: '1px solid var(--border-subtle)',
  backgroundColor: 'var(--bg-surface)',
  color: 'var(--text-primary)',
  fontSize: '12.5px',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

export const ExamQuestionsTab = ({
  exam,
  isAr,
  isDark,
  isSaving,
  onAddQuestion,
  onSaveQuestion,
  onUpdatePoints,
  onPromptDeleteQuestion,
}) => {
  const [questionTypeFilter, setQuestionTypeFilter] = useState('all');
  const [showAnswerKey, setShowAnswerKey] = useState(true);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editBuffer, setEditBuffer] = useState(null);
  const [pointsDrafts, setPointsDrafts] = useState({});

  const questions = exam?.questions || [];
  const displayedQuestions = questions.filter(
    (q) => questionTypeFilter === 'all' || q.type === questionTypeFilter
  );

  const startEdit = (q) => {
    setEditingQuestionId(q.id);
    setEditBuffer({
      questionAr: q.questionAr || '',
      points: Number(q.points) || 5,
      type: q.type || 'mcq',
      optionsAr: Array.isArray(q.optionsAr) && q.optionsAr.length >= 2
        ? [...q.optionsAr]
        : ['الخيار الأول', 'الخيار الثاني', 'الخيار الثالث', 'الخيار الرابع'],
      correctIndex: q.correctIndex ?? 0,
      correctBool: q.correctBool !== undefined ? Boolean(q.correctBool) : true,
      modelAnswerAr: q.modelAnswerAr || '',
      rubricPointsAr: Array.isArray(q.rubricPointsAr) && q.rubricPointsAr.length > 0
        ? [...q.rubricPointsAr]
        : ['استيفاء الفكرة العلمية الأساسية'],
      explanationAr: q.explanationAr || '',
    });
  };

  const commitEdit = (qId) => {
    if (!editBuffer) return;
    onSaveQuestion(qId, {
      ...editBuffer,
      points: Math.max(1, Math.round(Number(editBuffer.points) || 1)),
    });
    setEditingQuestionId(null);
    setEditBuffer(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Add Question & Filter Toolbar */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginInlineEnd: '4px' }}>
            {isAr ? 'إضافة سؤال:' : 'Add Question:'}
          </span>
          {Object.values(QUESTION_TYPES).map((t) => (
            <button
              key={t.id}
              type="button"
              disabled={isSaving}
              onClick={() => onAddQuestion(t.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 11px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: isSaving ? 'wait' : 'pointer',
              }}
            >
              <Plus size={12} color="var(--primary)" />
              <span>{isAr ? t.labelAr : t.labelEn}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: isAr ? `الكل (${questions.length})` : `All (${questions.length})` },
            { id: 'mcq', label: isAr ? 'اختياري' : 'MCQ' },
            { id: 'true_false', label: isAr ? 'صح وخطأ' : 'T/F' },
            { id: 'essay', label: isAr ? 'مقالي' : 'Essay' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setQuestionTypeFilter(f.id)}
              style={{
                padding: '5px 9px',
                borderRadius: '6px',
                border: `1px solid ${questionTypeFilter === f.id ? 'var(--primary)' : 'var(--border-subtle)'}`,
                backgroundColor: questionTypeFilter === f.id ? 'rgba(0, 102, 204, 0.1)' : 'transparent',
                color: questionTypeFilter === f.id ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {f.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setShowAnswerKey((v) => !v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: showAnswerKey ? 'var(--primary-surface)' : 'var(--bg-subtle)',
              color: showAnswerKey ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {showAnswerKey ? <Eye size={12} /> : <EyeOff size={12} />}
            <span>{showAnswerKey ? (isAr ? 'نموذج الإجابة ظاهر' : 'Key Shown') : (isAr ? 'إظهار النموذج' : 'Show Key')}</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      {displayedQuestions.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 20px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '13px',
        }}>
          {isAr ? 'لا توجد أسئلة مطابقة لهذا التصنيف.' : 'No questions match this filter.'}
        </div>
      ) : (
        displayedQuestions.map((q) => {
          const isEditing = editingQuestionId === q.id && editBuffer;
          const typeMeta = QUESTION_TYPES[q.type] || QUESTION_TYPES.mcq;
          const draftPts = pointsDrafts[q.id] !== undefined ? pointsDrafts[q.id] : String(q.points ?? 5);

          return (
            <div
              key={q.id}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: `1px solid ${isEditing ? 'var(--primary)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '16px 18px',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(0, 102, 204, 0.1)',
                    color: 'var(--primary)',
                  }}>
                    {isAr ? `سؤال ${q.number}` : `Q${q.number}`} • {isAr ? typeMeta.labelAr : typeMeta.labelEn}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* Points Input (commits on blur/Enter to prevent keystroke race conditions) */}
                  {!isEditing && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={draftPts}
                        onChange={(e) => setPointsDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        onBlur={() => {
                          const parsed = Math.max(1, Math.round(Number(draftPts) || 1));
                          setPointsDrafts((prev) => {
                            const next = { ...prev };
                            delete next[q.id];
                            return next;
                          });
                          if (parsed !== Number(q.points)) {
                            onUpdatePoints(q.id, parsed);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') e.currentTarget.blur();
                        }}
                        style={{
                          width: '50px',
                          padding: '3px 6px',
                          borderRadius: '5px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                          fontWeight: '800',
                          textAlign: 'center',
                        }}
                      />
                      <span>{isAr ? 'درجة' : 'pts'}</span>
                    </div>
                  )}

                  {!isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => startEdit(q)}
                        title={isAr ? 'تعديل السؤال' : 'Edit question'}
                        style={{
                          padding: '5px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: '700',
                        }}
                      >
                        <Edit3 size={12} color="var(--primary)" />
                        <span>{isAr ? 'تعديل' : 'Edit'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onPromptDeleteQuestion(q)}
                        title={isAr ? 'حذف السؤال' : 'Delete question'}
                        style={{
                          padding: '5px 7px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'transparent',
                          color: '#EF4444',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingQuestionId(null);
                          setEditBuffer(null);
                        }}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-secondary)',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <X size={12} />
                        <span>{isAr ? 'إلغاء' : 'Cancel'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => commitEdit(q.id)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          fontSize: '11.5px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Check size={12} />
                        <span>{isAr ? 'حفظ السؤال' : 'Save'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Edit Mode vs Display Mode */}
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        {isAr ? 'نص السؤال:' : 'Question Text:'}
                      </label>
                      <textarea
                        rows={2}
                        value={editBuffer.questionAr}
                        onChange={(e) => setEditBuffer((prev) => ({ ...prev, questionAr: e.target.value }))}
                        style={{ ...INPUT_STYLE, resize: 'vertical' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        {isAr ? 'الدرجة:' : 'Points:'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={editBuffer.points}
                        onChange={(e) => setEditBuffer((prev) => ({ ...prev, points: e.target.value }))}
                        style={INPUT_STYLE}
                      />
                    </div>
                  </div>

                  {q.type === 'mcq' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                        {isAr ? 'الخيارات (اختر الإجابة الصحيحة):' : 'Options (select correct answer):'}
                      </span>
                      {editBuffer.optionsAr.map((opt, oIdx) => (
                        <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="radio"
                            name={`edit-correct-${q.id}`}
                            checked={editBuffer.correctIndex === oIdx}
                            onChange={() => setEditBuffer((prev) => ({ ...prev, correctIndex: oIdx }))}
                            style={{ accentColor: 'var(--success)', cursor: 'pointer' }}
                          />
                          <span style={{ fontSize: '12px', fontWeight: '800', width: '20px' }}>{ARABIC_OPTION_LETTERS[oIdx] || oIdx + 1})</span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const next = [...editBuffer.optionsAr];
                              next[oIdx] = e.target.value;
                              setEditBuffer((prev) => ({ ...prev, optionsAr: next }));
                            }}
                            style={INPUT_STYLE}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'true_false' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {[
                        { val: true, label: isAr ? 'صواب ✓' : 'True ✓' },
                        { val: false, label: isAr ? 'خطأ ✗' : 'False ✗' },
                      ].map((opt) => (
                        <button
                          key={String(opt.val)}
                          type="button"
                          onClick={() => setEditBuffer((prev) => ({ ...prev, correctBool: opt.val }))}
                          style={{
                            padding: '7px 14px',
                            borderRadius: '7px',
                            border: `1.5px solid ${editBuffer.correctBool === opt.val ? 'var(--success)' : 'var(--border-subtle)'}`,
                            backgroundColor: editBuffer.correctBool === opt.val ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-subtle)',
                            color: editBuffer.correctBool === opt.val ? 'var(--success)' : 'var(--text-primary)',
                            fontSize: '12px',
                            fontWeight: '800',
                            cursor: 'pointer',
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === 'essay' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>
                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                          {isAr ? 'الإجابة النموذجية المعتمدة:' : 'Model Answer:'}
                        </label>
                        <textarea
                          rows={2}
                          value={editBuffer.modelAnswerAr}
                          onChange={(e) => setEditBuffer((prev) => ({ ...prev, modelAnswerAr: e.target.value }))}
                          style={{ ...INPUT_STYLE, resize: 'vertical' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                          {isAr ? 'معايير التصحيح (سطر لكل معيار):' : 'Rubric Criteria (one per line):'}
                        </label>
                        <textarea
                          rows={2}
                          value={(editBuffer.rubricPointsAr || []).join('\n')}
                          onChange={(e) => setEditBuffer((prev) => ({
                            ...prev,
                            rubricPointsAr: e.target.value.split('\n'),
                          }))}
                          style={{ ...INPUT_STYLE, resize: 'vertical' }}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      {isAr ? 'الشرح والتعليل (اختياري):' : 'Explanation (optional):'}
                    </label>
                    <input
                      type="text"
                      value={editBuffer.explanationAr}
                      onChange={(e) => setEditBuffer((prev) => ({ ...prev, explanationAr: e.target.value }))}
                      style={INPUT_STYLE}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.55, marginBottom: '12px' }}>
                    {q.questionAr}
                  </div>

                  {/* MCQ View */}
                  {q.type === 'mcq' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '8px' }}>
                      {(q.optionsAr || []).map((opt, oIdx) => {
                        const isCorrect = showAnswerKey && q.correctIndex === oIdx;
                        return (
                          <div
                            key={oIdx}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '7px',
                              border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--border-subtle)'}`,
                              backgroundColor: isCorrect ? (isDark ? 'rgba(16, 185, 129, 0.14)' : '#ECFDF5') : 'var(--bg-subtle)',
                              fontSize: '12.5px',
                              fontWeight: isCorrect ? '800' : '600',
                              color: isCorrect ? 'var(--success)' : 'var(--text-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '6px',
                            }}
                          >
                            <span>{ARABIC_OPTION_LETTERS[oIdx] || oIdx + 1}) {opt}</span>
                            {isCorrect && <CheckCircle2 size={14} color="var(--success)" />}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* True/False View */}
                  {q.type === 'true_false' && showAnswerKey && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '7px',
                      backgroundColor: isDark ? 'rgba(16, 185, 129, 0.14)' : '#ECFDF5',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontSize: '12px',
                      fontWeight: '800',
                      color: 'var(--success)',
                    }}>
                      <CheckCircle2 size={13} />
                      <span>
                        {isAr ? 'الإجابة الصحيحة: ' : 'Correct Answer: '}
                        {q.correctBool ? (isAr ? 'صواب' : 'True') : (isAr ? 'خطأ' : 'False')}
                      </span>
                    </div>
                  )}

                  {/* Essay Model Answer View */}
                  {q.type === 'essay' && showAnswerKey && (
                    <div style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: isDark ? 'rgba(16, 185, 129, 0.08)' : '#F0FDF4',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      fontSize: '12px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '800', color: 'var(--success)', marginBottom: '4px' }}>
                        <BookOpen size={13} />
                        <span>{isAr ? 'الإجابة النموذجية المعتمدة:' : 'Model Answer:'}</span>
                      </div>
                      <div style={{ color: 'var(--text-primary)', lineHeight: 1.55 }}>
                        {q.modelAnswerAr || (isAr ? 'لم يتم إدخال إجابة نموذجية بعد.' : 'No model answer provided yet.')}
                      </div>
                      {Array.isArray(q.rubricPointsAr) && q.rubricPointsAr.length > 0 && (
                        <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed rgba(16, 185, 129, 0.3)', color: 'var(--text-secondary)', fontSize: '11.5px' }}>
                          <strong>{isAr ? 'معايير التقييم: ' : 'Rubric: '}</strong>
                          {q.rubricPointsAr.join(' • ')}
                        </div>
                      )}
                    </div>
                  )}

                  {showAnswerKey && q.explanationAr && (
                    <div style={{ marginTop: '8px', fontSize: '11.5px', color: 'var(--text-secondary)', padding: '6px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-subtle)' }}>
                      <strong>{isAr ? 'التعليل: ' : 'Explanation: '}</strong>
                      {q.explanationAr}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
