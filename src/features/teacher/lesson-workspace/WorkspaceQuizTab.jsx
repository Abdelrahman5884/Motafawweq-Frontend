import React from 'react';
import { Send, Play, CheckCircle2 } from 'lucide-react';

export const WorkspaceQuizTab = ({ lesson, lang, onJumpToTimestamp }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'بنك أسئلة الحصة المولد بالذكاء الاصطناعي' : 'Generated Lesson Assessment'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            {lang === 'ar' ? '12 سؤالاً تمت صياغتها وفق معايير المركز القومي للامتحانات' : '12 Questions formulated with explanation rationale and audio links'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => alert(lang === 'ar' ? 'تم نشر الاختبار لجميع طلاب السنتر والأونلاين بنجاح!' : 'Quiz published to all enrolled students!')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--success)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <Send size={14} />
            <span>{lang === 'ar' ? 'نشر الاختبار للمجموعات' : 'Publish to Classes'}</span>
          </button>
        </div>
      </div>

      {/* Question List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {lesson.quizzes.map((q, idx) => (
          <div
            key={q.id}
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '800'
                }}>
                  {idx + 1}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: q.difficulty === 'Easy' ? '#ECFDF5' : '#FFFBEB',
                  color: q.difficulty === 'Easy' ? 'var(--success)' : 'var(--warning)'
                }}>
                  {q.difficulty}
                </span>
              </div>

              <button
                onClick={() => onJumpToTimestamp(q.timestamp === '08:10' ? 490 : 680)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '11px',
                  color: 'var(--primary)',
                  fontWeight: '700',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer'
                }}
              >
                <Play size={10} fill="var(--primary)" />
                <span>{q.timestamp}</span>
              </button>
            </div>

            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.5 }}>
              {lang === 'ar' ? q.questionAr : q.question}
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {(lang === 'ar' ? q.optionsAr : q.options).map((opt, optIdx) => {
                const isCorrect = optIdx === q.correctIndex;
                return (
                  <div
                    key={optIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-subtle)',
                      border: isCorrect ? '1.5px solid var(--success)' : '1px solid var(--border-subtle)',
                      fontSize: '13.5px',
                      color: isCorrect ? 'var(--success)' : 'var(--text-primary)',
                      fontWeight: isCorrect ? '700' : '500'
                    }}
                  >
                    <span style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: `1.5px solid ${isCorrect ? 'var(--success)' : 'var(--text-muted)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: '700'
                    }}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                    {isCorrect && <CheckCircle2 size={16} color="var(--success)" style={{ marginLeft: 'auto' }} />}
                  </div>
                );
              })}
            </div>

            {/* Explanation */}
            <div style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              fontSize: '12.5px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>{lang === 'ar' ? 'التعليل النموذجي: ' : 'Rationale: '}</strong>
              {lang === 'ar' ? q.explanationAr : q.explanation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
