import React, { useEffect } from 'react';
import { Printer, X } from 'lucide-react';
import { ARABIC_OPTION_LETTERS } from './examConstants';

export const PrintableExamSheet = ({ exam, mode = 'student' }) => {
  if (!exam) return null;
  const questions = exam.questions || [];
  const isStudent = mode === 'student';

  return (
    <div style={{
      backgroundColor: '#ffffff',
      color: '#111827',
      fontFamily: "'Cairo', system-ui, -apple-system, sans-serif",
      padding: '24px 28px',
      lineHeight: 1.6,
      direction: 'rtl',
      boxSizing: 'border-box',
    }}>
      <div style={{
        border: '2px solid #1e293b',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '16px',
        backgroundColor: '#f8fafc',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px', marginBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '900', color: '#0f172a' }}>منصة متفوق التعليمية</div>
            <div style={{ fontSize: '12px', color: '#475569', fontWeight: '700' }}>بنك الأسئلة والامتحانات النموذجية</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>{exam.titleAr || 'امتحان تقييمي'}</div>
            <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: '800' }}>
              {exam.courseTitleAr || 'المقرر الدراسي'} - {exam.gradeAr || 'الصف الثالث الثانوي'}
            </div>
          </div>
          <div style={{ textAlign: 'left', fontSize: '11.5px', color: '#475569', fontWeight: '700' }}>
            <div>{isStudent ? 'ورقة امتحان الطالب' : 'نموذج الإجابة المعتمد'}</div>
            <div>الزمن: {exam.durationMinutes || 45} دقيقة</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px', fontSize: '12.5px', color: '#1e293b', fontWeight: '700' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>اسم الطالب:</span>
            <span style={{ flex: 1, borderBottom: '1px dashed #64748b', minHeight: '18px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>المجموعة / القاعة:</span>
            <span style={{ flex: 1, borderBottom: '1px dashed #64748b', minHeight: '18px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>رقم الكود:</span>
            <span style={{ flex: 1, borderBottom: '1px dashed #64748b', minHeight: '18px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <span>الدرجة الكلية: <strong>{exam.fullMark || 0}</strong></span>
            <span>•</span>
            <span>النجاح: <strong>{exam.passScore || 0}</strong></span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {questions.map((q, idx) => (
          <div
            key={q.id || idx}
            className="print-break-inside-avoid"
            style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px 14px', backgroundColor: '#ffffff' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: '900', color: '#0f172a' }}>
                السؤال ({idx + 1}): {q.typeNameAr || (q.type === 'mcq' ? 'اختيار من متعدد' : q.type === 'true_false' ? 'صح وخطأ' : 'مقالي')}
              </span>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#2563eb', backgroundColor: '#eff6ff', padding: '1px 8px', borderRadius: '4px' }}>
                [{q.points || 5} درجة]
              </span>
            </div>

            <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b', marginBottom: '10px' }}>
              {q.questionAr}
            </div>

            {q.type === 'mcq' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {(q.optionsAr || []).map((opt, oIdx) => {
                  const isCorrect = !isStudent && q.correctIndex === oIdx;
                  return (
                    <div
                      key={oIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 10px',
                        borderRadius: '5px',
                        border: isCorrect ? '1.5px solid #059669' : '1px solid #e2e8f0',
                        backgroundColor: isCorrect ? '#ecfdf5' : '#ffffff',
                        fontSize: '12.5px',
                        fontWeight: isCorrect ? '800' : '600',
                        color: isCorrect ? '#047857' : '#334155',
                      }}
                    >
                      <span>{ARABIC_OPTION_LETTERS[oIdx] || oIdx + 1}) {opt}</span>
                      {isCorrect && <span style={{ marginRight: 'auto', fontSize: '11px', color: '#059669' }}>✓</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {q.type === 'true_false' && (
              <div style={{ display: 'flex', gap: '18px', fontSize: '12.5px' }}>
                <span style={{ fontWeight: !isStudent && q.correctBool === true ? '800' : '600', color: !isStudent && q.correctBool === true ? '#059669' : '#1e293b' }}>
                  [ {!isStudent && q.correctBool === true ? '✓' : ' '} ] صواب
                </span>
                <span style={{ fontWeight: !isStudent && q.correctBool === false ? '800' : '600', color: !isStudent && q.correctBool === false ? '#059669' : '#1e293b' }}>
                  [ {!isStudent && q.correctBool === false ? '✓' : ' '} ] خطأ
                </span>
              </div>
            )}

            {q.type === 'essay' && isStudent && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '10px 0 4px' }}>
                <div style={{ borderBottom: '1px dashed #94a3b8' }} />
                <div style={{ borderBottom: '1px dashed #94a3b8' }} />
                <div style={{ borderBottom: '1px dashed #94a3b8' }} />
              </div>
            )}

            {q.type === 'essay' && !isStudent && (
              <div style={{ marginTop: '8px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '6px', padding: '8px 12px', fontSize: '12px' }}>
                <strong style={{ color: '#047857' }}>الإجابة النموذجية: </strong>
                <span style={{ color: '#065f46' }}>{q.modelAnswerAr || '—'}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ExamPrintModal = ({ exam, printMode, setPrintMode, isAr, isDark, onClose }) => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="screen-only-modal"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 2500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '860px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {isAr ? 'معاينة وطباعة ورقة الامتحان (PDF)' : 'Print Exam Paper (PDF)'}
            </h3>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setPrintMode('student')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: `1.5px solid ${printMode === 'student' ? 'var(--primary)' : 'var(--border-subtle)'}`,
              backgroundColor: printMode === 'student' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
              color: printMode === 'student' ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'ورقة امتحان الطالب (بدون إجابات)' : 'Student Paper'}
          </button>
          <button
            type="button"
            onClick={() => setPrintMode('teacher')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: `1.5px solid ${printMode === 'teacher' ? 'var(--primary)' : 'var(--border-subtle)'}`,
              backgroundColor: printMode === 'teacher' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
              color: printMode === 'teacher' ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'نموذج الإجابة للمعلم' : 'Teacher Answer Key'}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : '#f1f5f9' }}>
          <div style={{ maxWidth: '740px', margin: '0 auto', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', borderRadius: '6px', overflow: 'hidden' }}>
            <PrintableExamSheet exam={exam} mode={printMode} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', padding: '14px 20px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 20px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--primary)', color: '#FFFFFF', fontSize: '12.5px', fontWeight: '800', cursor: 'pointer' }}
          >
            <Printer size={14} />
            <span>{isAr ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
