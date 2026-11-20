import React, { useEffect } from 'react';
import {
  X,
  Clock,
  FileText,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Download,
  ExternalLink,
  CheckCircle2,
  Paperclip,
  Send,
  AlertTriangle,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { formatFileSize, formatHomeworkDate } from './useStudentHomework';

export const HomeworkSubmissionModal = ({
  selectedHw,
  onClose,
  showAttachmentPreview,
  setShowAttachmentPreview,
  answerText,
  setAnswerText,
  selectedFile,
  selectedFilePreviewUrl,
  removeExistingAttachment,
  setRemoveExistingAttachment,
  handleSelectFile,
  handleClearSelectedFile,
  handleSubmitHomework,
  isSubmitting,
  submitError,
  onClearError,
  lang = 'ar',
  isRtl = true,
}) => {
  const isAr = lang === 'ar';

  useEffect(() => {
    if (!selectedHw) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selectedHw, isSubmitting, onClose]);

  if (!selectedHw) return null;

  const isGraded = selectedHw.status === 'graded';
  const isRejected = selectedHw.status === 'rejected';
  const isSubmitted = selectedHw.status === 'submitted';
  const isTeacherImage = selectedHw.fileType === 'image' || selectedHw.type === 'image';
  const hasExistingSubFile = Boolean(selectedHw.submittedAttachmentName) && !removeExistingAttachment;
  const scorePct =
    isGraded && selectedHw.earnedScore !== null && selectedHw.maxScore > 0
      ? Math.round((selectedHw.earnedScore / selectedHw.maxScore) * 100)
      : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => !isSubmitting && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 37, 78, 0.52)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: '22px',
          maxWidth: '720px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          position: 'relative',
          boxShadow: '0 24px 55px rgba(0, 0, 0, 0.22)',
          animation: 'hwModalFadeIn 0.2s ease',
          boxSizing: 'border-box',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onClose}
          aria-label={isAr ? 'إغلاق' : 'Close'}
          style={{
            position: 'absolute',
            top: '18px',
            left: isRtl ? '18px' : 'auto',
            right: isRtl ? 'auto' : '18px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '18px', paddingInlineEnd: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: '700',
                padding: '2px 9px',
                borderRadius: '7px',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {selectedHw.subjectAr}
            </span>
            {selectedHw.teacherNameAr && (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                {isAr ? `المعلم: ${selectedHw.teacherNameAr}` : `Teacher: ${selectedHw.teacherNameAr}`}
              </span>
            )}
          </div>

          <h2
            style={{
              fontSize: '18.5px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
              lineHeight: 1.4,
              overflowWrap: 'anywhere',
            }}
          >
            {selectedHw.titleAr}
          </h2>

          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} />
              <span>
                {isAr ? 'الموعد النهائي:' : 'Due:'} <span dir="ltr">{selectedHw.deadlineTextAr}</span>
              </span>
            </span>
            <span>•</span>
            <span>
              {isAr ? `الدرجة النهائية: ${selectedHw.maxScore} درجة` : `Max Score: ${selectedHw.maxScore}`}
            </span>
          </div>
        </div>

        {/* Teacher Text Instructions */}
        {selectedHw.textContent && (
          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '16px',
              fontSize: '13px',
              color: 'var(--text-primary)',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              overflowWrap: 'anywhere',
            }}
          >
            <div style={{ color: 'var(--primary)', fontSize: '11.5px', marginBottom: '6px', fontWeight: '800' }}>
              {isAr ? 'تفاصيل وأسئلة الواجب من المعلم:' : 'Assignment Instructions:'}
            </div>
            {selectedHw.textContent}
          </div>
        )}

        {/* Teacher Attachment (Real Signed Preview & Download) */}
        {selectedHw.attachmentUrl && (
          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '14px 16px',
              marginBottom: '16px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: '1 1 200px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--primary-surface)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {isTeacherImage ? <ImageIcon size={18} /> : <FileText size={18} />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    title={selectedHw.attachmentName}
                    style={{
                      fontSize: '13px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {selectedHw.attachmentName || (isAr ? 'ملف الواجب المرفق' : 'Homework Attachment')}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    {isTeacherImage
                      ? isAr
                        ? 'صورة مرفقة من المعلم'
                        : 'Teacher Image Attachment'
                      : isAr
                        ? 'ملف PDF مرفق من المعلم'
                        : 'Teacher PDF Attachment'}
                    {selectedHw.attachmentSizeBytes > 0
                      ? ` • ${formatFileSize(selectedHw.attachmentSizeBytes, lang)}`
                      : ''}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setShowAttachmentPreview((prev) => !prev)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 11px',
                    borderRadius: '9px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {showAttachmentPreview ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>
                    {showAttachmentPreview
                      ? isAr
                        ? 'إخفاء'
                        : 'Hide'
                      : isAr
                        ? 'معاينة'
                        : 'Preview'}
                  </span>
                </button>

                <a
                  href={selectedHw.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '7px 11px',
                    borderRadius: '9px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: '700',
                  }}
                >
                  <ExternalLink size={13} />
                  <span>{isAr ? 'فتح' : 'Open'}</span>
                </a>

                <a
                  href={selectedHw.attachmentDownloadUrl}
                  download={selectedHw.attachmentName || undefined}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 12px',
                    borderRadius: '9px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: '800',
                  }}
                >
                  <Download size={13} />
                  <span>{isAr ? 'تحميل' : 'Download'}</span>
                </a>
              </div>
            </div>

            {showAttachmentPreview && (
              <div
                style={{
                  marginTop: '12px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                }}
              >
                {isTeacherImage ? (
                  <img
                    src={selectedHw.attachmentUrl}
                    alt={selectedHw.attachmentName || selectedHw.titleAr}
                    style={{
                      display: 'block',
                      maxWidth: '100%',
                      maxHeight: '420px',
                      margin: '0 auto',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <iframe
                    src={selectedHw.attachmentUrl}
                    title={selectedHw.attachmentName || selectedHw.titleAr}
                    style={{
                      width: '100%',
                      height: '400px',
                      border: 'none',
                      display: 'block',
                    }}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Rejected Notice from Teacher */}
        {isRejected && (
          <div
            role="alert"
            style={{
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              border: '1.5px solid rgba(220, 38, 38, 0.35)',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '16px',
              color: '#DC2626',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '800', marginBottom: '4px' }}>
              <AlertTriangle size={15} />
              <span>{isAr ? 'طلب المعلم إعادة تسليم الواجب' : 'Teacher Requested Resubmission'}</span>
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.6, overflowWrap: 'anywhere' }}>
              {selectedHw.feedbackAr ||
                (isAr
                  ? 'يرجى مراجعة الحل وإعادة رفعه بشكل كامل وواضح.'
                  : 'Please review your work and submit an updated solution.')}
            </div>
          </div>
        )}

        {/* Graded Evaluation Card */}
        {isGraded && (
          <div
            style={{
              backgroundColor: 'rgba(5, 150, 105, 0.08)',
              border: '1.5px solid rgba(5, 150, 105, 0.35)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '800',
                  color: '#059669',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle2 size={16} />
                <span>{isAr ? 'تقييم المعلم والدرجة النهائية' : 'Teacher Evaluation & Grade'}</span>
              </span>
              <strong style={{ fontSize: '16px', fontWeight: '900', color: '#059669' }}>
                {selectedHw.earnedScore} / {selectedHw.maxScore} ({scorePct}%)
              </strong>
            </div>

            {selectedHw.feedbackAr && (
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  margin: '0 0 8px 0',
                  lineHeight: 1.65,
                  overflowWrap: 'anywhere',
                }}
              >
                {selectedHw.feedbackAr}
              </p>
            )}

            {selectedHw.gradedAt && (
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600' }}>
                {isAr
                  ? `تاريخ التصحيح: ${formatHomeworkDate(selectedHw.gradedAt, lang)}`
                  : `Graded on: ${formatHomeworkDate(selectedHw.gradedAt, lang)}`}
              </div>
            )}
          </div>
        )}

        {/* Graded: Read-Only Summary of Student's Own Submitted Work */}
        {isGraded ? (
          <div>
            {(selectedHw.solutionText || selectedHw.submittedAttachmentUrl) && (
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {isAr ? 'الحل الذي قمت بتسليمه:' : 'Your Submitted Solution:'}
                </div>

                {selectedHw.solutionText && (
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      margin: selectedHw.submittedAttachmentUrl ? '0 0 10px 0' : 0,
                      lineHeight: 1.65,
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {selectedHw.solutionText}
                  </p>
                )}

                {selectedHw.submittedAttachmentUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Paperclip size={14} color="var(--primary)" />
                      <span>{selectedHw.submittedAttachmentName}</span>
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <a
                        href={selectedHw.submittedAttachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-surface-elevated)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--primary)',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '700',
                        }}
                      >
                        <ExternalLink size={12} />
                        <span>{isAr ? 'معاينة' : 'Open'}</span>
                      </a>
                      <a
                        href={selectedHw.submittedAttachmentDownloadUrl}
                        download={selectedHw.submittedAttachmentName || undefined}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: '700',
                        }}
                      >
                        <Download size={12} />
                        <span>{isAr ? 'تحميل' : 'Download'}</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        ) : (
          /* Editable Submission Form (pending / submitted / rejected) */
          <form onSubmit={handleSubmitHomework}>
            {submitError && (
              <div
                role="alert"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(220, 38, 38, 0.08)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  color: '#DC2626',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  <span>{submitError}</span>
                </div>
                <button
                  type="button"
                  onClick={onClearError}
                  aria-label="Dismiss"
                  style={{ border: 'none', background: 'none', color: '#DC2626', cursor: 'pointer', padding: 0 }}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label
                htmlFor="hw-solution-text"
                style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)' }}
              >
                {isAr ? 'كتابة الحل أو ملاحظات للمعلم:' : 'Written Solution or Notes:'}
              </label>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {answerText.length} / 20000
              </span>
            </div>

            <textarea
              id="hw-solution-text"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              maxLength={20000}
              placeholder={
                isAr
                  ? 'اكتب إجابتك أو خطوات الحل العلمي هنا...'
                  : 'Write your answer or step-by-step solution here...'
              }
              rows={4}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                marginBottom: '12px',
                lineHeight: 1.6,
              }}
            />

            {/* Previously Uploaded Submission File (when editing submitted / rejected homework) */}
            {hasExistingSubFile && !selectedFile && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-surface)',
                  border: '1px solid rgba(21, 136, 199, 0.3)',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                  <Paperclip size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)' }}>
                      {isAr ? 'ملف الحل المرفق حالياً:' : 'Currently Attached Solution:'}
                    </div>
                    <div
                      style={{
                        fontSize: '12.5px',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {selectedHw.submittedAttachmentName}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {selectedHw.submittedAttachmentUrl && (
                    <a
                      href={selectedHw.submittedAttachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '5px 9px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        fontSize: '11.5px',
                        fontWeight: '700',
                      }}
                    >
                      <ExternalLink size={12} />
                      <span>{isAr ? 'عرض' : 'View'}</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setRemoveExistingAttachment(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 9px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(220, 38, 38, 0.1)',
                      border: '1px solid rgba(220, 38, 38, 0.25)',
                      color: '#DC2626',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={12} />
                    <span>{isAr ? 'إزالة' : 'Remove'}</span>
                  </button>
                </div>
              </div>
            )}

            {removeExistingAttachment && !selectedFile && selectedHw.submittedAttachmentName && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px dashed var(--border-medium)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginBottom: '12px',
                }}
              >
                <span>{isAr ? 'سيتم إزالة الملف السابق عند الحفظ.' : 'Previous file will be removed on save.'}</span>
                <button
                  type="button"
                  onClick={() => setRemoveExistingAttachment(false)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'var(--primary)',
                    fontWeight: '800',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {isAr ? 'تراجع' : 'Undo'}
                </button>
              </div>
            )}

            {/* File Picker Box */}
            <div
              style={{
                border: '1.5px dashed var(--border-medium)',
                borderRadius: '14px',
                padding: '14px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-surface)',
                marginBottom: '18px',
              }}
            >
              {selectedFile ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  {selectedFilePreviewUrl && (
                    <img
                      src={selectedFilePreviewUrl}
                      alt={selectedFile.name}
                      style={{
                        maxHeight: '150px',
                        maxWidth: '100%',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                        objectFit: 'contain',
                      }}
                    />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Paperclip size={15} color="var(--primary)" />
                    <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {selectedFile.name}
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      ({formatFileSize(selectedFile.size, lang)})
                    </span>
                    <button
                      type="button"
                      onClick={handleClearSelectedFile}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 9px',
                        borderRadius: '7px',
                        backgroundColor: 'rgba(220, 38, 38, 0.1)',
                        border: 'none',
                        color: '#DC2626',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={12} />
                      <span>{isAr ? 'إلغاء الملف' : 'Clear'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                  }}
                >
                  <Paperclip size={18} color="var(--primary)" />
                  <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {hasExistingSubFile
                      ? isAr
                        ? 'رفع ملف جديد لاستبدال الملف الحالي (اختياري)'
                        : 'Upload a new file to replace current attachment (optional)'
                      : isAr
                        ? 'إرفاق ملف الحل من جهازك (PDF أو صورة)'
                        : 'Attach your solution file (PDF or Image)'}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {isAr
                      ? 'الصيغ المدعومة: PDF, PNG, JPG, WEBP • الحد الأقصى 25 ميجابايت'
                      : 'Supported: PDF, PNG, JPG, WEBP • Max 25 MB'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/webp"
                    style={{ display: 'none' }}
                    onChange={handleSelectFile}
                  />
                </label>
              )}
            </div>

            {/* Submit / Cancel Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="clean-hw-btn"
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  backgroundColor: isRejected ? '#DC2626' : 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isRejected
                    ? '0 2px 10px rgba(220, 38, 38, 0.28)'
                    : '0 2px 10px rgba(21, 136, 199, 0.28)',
                }}
              >
                <Send size={14} />
                <span>
                  {isSubmitting
                    ? isAr
                      ? 'جارٍ الرفع والتسليم...'
                      : 'Submitting...'
                    : isRejected
                      ? isAr
                        ? 'إعادة تسليم الواجب'
                        : 'Resubmit Homework'
                      : isSubmitted
                        ? isAr
                          ? 'تحديث الحل المسلّم'
                          : 'Update Submission'
                        : isAr
                          ? 'تسليم الواجب الآن'
                          : 'Submit Homework'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
