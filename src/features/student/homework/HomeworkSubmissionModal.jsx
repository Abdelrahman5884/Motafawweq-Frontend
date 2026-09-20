import React from 'react';
import {
  X, Clock, FileText, Eye, EyeOff, Download,
  CheckCircle2, Paperclip, Send
} from 'lucide-react';

export const HomeworkSubmissionModal = ({
  selectedHw,
  setSelectedHw,
  showPdfPreview,
  setShowPdfPreview,
  answerText,
  setAnswerText,
  uploadedFileName,
  handleSimulateFileUpload,
  handleSubmitHomework,
  isSubmitting,
  lang,
  isRtl
}) => {
  if (!selectedHw) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(6, 37, 78, 0.45)',
      backdropFilter: 'blur(4px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: '24px',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        position: 'relative',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.15)',
        animation: 'modalFadeIn 0.2s ease',
        boxSizing: 'border-box'
      }}>
        {/* Close Button */}
        <button
          onClick={() => setSelectedHw(null)}
          style={{
            position: 'absolute',
            top: '20px',
            left: isRtl ? '20px' : 'auto',
            right: isRtl ? 'auto' : '20px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={15} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              fontSize: '11.5px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)'
            }}>
              {selectedHw.subjectAr}
            </span>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              المعلم: {selectedHw.teacherNameAr}
            </span>
          </div>

          <h2 style={{
            fontSize: '18px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            lineHeight: 1.4
          }}>
            {selectedHw.titleAr}
          </h2>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={13} />
            <span>الموعد النهائي: {selectedHw.deadlineTextAr}</span>
            <span>•</span>
            <span>الدرجة: {selectedHw.maxScore} درجة</span>
          </div>
        </div>

        {/* TEACHER ATTACHED PDF CARD */}
        {selectedHw.teacherAttachmentPdf && (
          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '18px',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: showPdfPreview ? '12px' : '0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-surface)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileText size={20} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{
                    fontSize: '13.5px',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {selectedHw.teacherAttachmentPdf.fileName}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar'
                      ? `ملف الأسئلة المرفق من الأستاذ • ${selectedHw.teacherAttachmentPdf.fileSize} • ${selectedHw.teacherAttachmentPdf.pagesCount} صفحات`
                      : `Teacher PDF Sheet • ${selectedHw.teacherAttachmentPdf.fileSize} • ${selectedHw.teacherAttachmentPdf.pagesCount} pages`}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowPdfPreview(!showPdfPreview)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {showPdfPreview ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showPdfPreview ? (lang === 'ar' ? 'إخفاء المعاينة' : 'Hide Preview') : (lang === 'ar' ? 'معاينة الأسئلة' : 'Preview Questions')}</span>
                </button>

                <a
                  href="#download"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(lang === 'ar' ? 'تم بدء تحميل ملف أسئلة الواجب بصيغة PDF.' : 'Downloading PDF file.');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(21, 136, 199, 0.25)'
                  }}
                >
                  <Download size={13} />
                  <span>{lang === 'ar' ? 'تحميل PDF' : 'Download PDF'}</span>
                </a>
              </div>
            </div>

            {/* Interactive Question Preview Inside Modal */}
            {showPdfPreview && (
              <div style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '12.5px',
                lineHeight: 1.6,
                boxSizing: 'border-box'
              }}>
                <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
                  {lang === 'ar' ? 'مقتطفات من أسئلة شيت الواجب:' : 'Sample Questions from Teacher Sheet:'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-primary)' }}>
                  {selectedHw.teacherAttachmentPdf.previewQuestions.map((q, qIdx) => (
                    <div key={qIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: '700' }}>•</span>
                      <span style={{ wordBreak: 'break-word' }}>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        {selectedHw.instructionsAr && (
          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '14px',
            padding: '12px 14px',
            marginBottom: '18px',
            fontSize: '12.5px',
            color: 'var(--text-primary)',
            lineHeight: 1.5
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '3px', fontWeight: '700' }}>
              تعليمات المعلم للحل:
            </div>
            {selectedHw.instructionsAr}
          </div>
        )}

        {/* Graded Feedback Card (if graded) */}
        {selectedHw.status === 'graded' && (
          <div style={{
            backgroundColor: 'var(--success-light)',
            border: '1.5px solid var(--success)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} />
                <span>تقييم المعلم والدرجة</span>
              </span>
              <strong style={{ fontSize: '15px', fontWeight: '900', color: 'var(--success)' }}>
                {selectedHw.earnedScore} / {selectedHw.maxScore} درجة
              </strong>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: '0 0 6px 0', lineHeight: 1.6 }}>
              {selectedHw.teacherFeedbackAr}
            </p>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              تاريخ التصحيح: {selectedHw.gradedDate}
            </div>
          </div>
        )}

        {/* Solution Submission Form (for pending / submitted) */}
        {selectedHw.status !== 'graded' ? (
          <form onSubmit={handleSubmitHomework}>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
              كتابة الحل أو التعليق:
            </div>
            <textarea
              value={answerText}
              onChange={e => setAnswerText(e.target.value)}
              placeholder="اكتب إجابتك أو خطوات الحل العلمي هنا..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'var(--font-arabic)',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                marginBottom: '12px'
              }}
            />

            {/* File Upload / Attach Solution Box */}
            <div style={{
              border: '1.5px dashed var(--border-medium)',
              borderRadius: '14px',
              padding: '14px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface)',
              marginBottom: '20px'
            }}>
              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}>
                <Paperclip size={18} color="var(--primary)" />
                <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {uploadedFileName || 'إرفاق ملف الحل من جهازك (PDF أو صورة)'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  انقر هنا لاختيار ملف من جهازك
                </span>
                <input type="file" style={{ display: 'none' }} onChange={handleSimulateFileUpload} />
              </label>
            </div>

            {/* Modal Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedHw(null)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="clean-btn"
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 10px rgba(21, 136, 199, 0.28)'
                }}
              >
                <Send size={14} />
                <span>{isSubmitting ? 'جارٍ التسليم...' : 'تسليم الواجب الآن'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Graded Close Button */
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setSelectedHw(null)}
              style={{
                padding: '10px 22px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '800',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              إغلاق
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
