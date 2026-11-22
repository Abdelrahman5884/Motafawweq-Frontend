import React from 'react';
import {
  ArrowRight,
  Eye,
  FileCheck,
  Image as ImageIcon,
  FileText,
  Download,
  ExternalLink,
  Award,
  CheckCircle2,
  Send,
  XCircle,
  AlertCircle,
  Loader2,
  Maximize2,
  Cloud,
} from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { QUICK_FEEDBACK_CHIPS, formatSubmissionDate } from './homeworkConstants';

export const HomeworkGradingDesk = ({
  homework,
  submissions,
  activeSubmission,
  gradeInput,
  onGradeInputChange,
  feedbackInput,
  onFeedbackInputChange,
  isSavingGrade,
  gradeError,
  gradeSuccess,
  isAr,
  isRtl,
  isDark,
  onBack,
  onSelectSubmission,
  onSaveGrading,
  onRejectSubmission,
  onPreviewAttachment,
}) => {
  const currentIndex = submissions.findIndex((s) => s.id === activeSubmission.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < submissions.length - 1;

  const hasAttachment = Boolean(activeSubmission.attachmentUrl);
  const isImage =
    activeSubmission.type === 'image' ||
    (activeSubmission.attachmentMimeType || '').startsWith('image/');
  const isPdf = hasAttachment && !isImage;
  const hasText = Boolean((activeSubmission.solutionText || '').trim());

  const maxGrade = Number(homework.maxGrade || 20);
  const presets = [
    { label: isAr ? 'الدرجة الكاملة' : 'Full', val: maxGrade },
    { label: '75%', val: Math.round(maxGrade * 0.75 * 2) / 2 },
    { label: '50%', val: Math.round(maxGrade * 0.5 * 2) / 2 },
    { label: '0', val: 0 },
  ];

  return (
    <div>
      {/* Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          <ArrowRight size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
          <span>{isAr ? 'الرجوع لجدول التسليمات' : 'Back to Submissions'}</span>
        </button>

        {/* Student Navigator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
            {isAr
              ? `طالب ${currentIndex + 1} من ${submissions.length}`
              : `Student ${currentIndex + 1} of ${submissions.length}`}
          </span>

          <button
            type="button"
            disabled={!hasPrev || isSavingGrade}
            onClick={() => hasPrev && onSelectSubmission(submissions[currentIndex - 1])}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: !hasPrev || isSavingGrade ? 'not-allowed' : 'pointer',
              opacity: !hasPrev ? 0.45 : 1,
            }}
          >
            {isAr ? 'السابق' : 'Prev'}
          </button>

          <button
            type="button"
            disabled={!hasNext || isSavingGrade}
            onClick={() => hasNext && onSelectSubmission(submissions[currentIndex + 1])}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: !hasNext || isSavingGrade ? 'not-allowed' : 'pointer',
              opacity: !hasNext ? 0.45 : 1,
            }}
          >
            {isAr ? 'التالي' : 'Next'}
          </button>
        </div>
      </div>

      {/* Split Layout */}
      <div className="hw-grading-grid">
        {/* LEFT PANE: REAL STUDENT SOLUTION VIEWER */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          {/* Student Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '18px',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar src={activeSubmission.studentAvatar} name={activeSubmission.studentNameAr} size={46} />
              <div>
                <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
                  {activeSubmission.studentNameAr}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {[activeSubmission.studentCode || activeSubmission.studentEmail, activeSubmission.locationAr || (isAr ? 'أونلاين' : 'Online')]
                    .filter(Boolean)
                    .join(' • ')}
                </div>
              </div>
            </div>

            <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>
                {isAr ? 'وقت التسليم:' : 'Submitted:'}
              </span>
              <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {formatSubmissionDate(activeSubmission.submittedAt, isAr)}
              </span>
            </div>
          </div>

          {/* REAL ATTACHMENT VIEWER */}
          {hasAttachment && (
            <div style={{ marginBottom: hasText ? '18px' : 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {isPdf ? <FileCheck size={16} color="#EF4444" /> : <ImageIcon size={16} color="var(--primary)" />}
                  <span>{activeSubmission.attachmentName || (isAr ? 'ملف حل الطالب' : 'Student Attachment')}</span>
                  {activeSubmission.attachmentSizeLabel && (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                      ({activeSubmission.attachmentSizeLabel})
                    </span>
                  )}
                  {activeSubmission.attachmentDisk === 'supabase' && (
                    <Cloud size={13} color="var(--success)" title={isAr ? 'مرفوع على السحابة' : 'Cloud Storage'} />
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() =>
                      onPreviewAttachment({
                        url: activeSubmission.attachmentUrl,
                        downloadUrl: activeSubmission.attachmentDownloadUrl || activeSubmission.attachmentUrl,
                        name: activeSubmission.attachmentName || 'solution',
                        type: isImage ? 'image' : 'pdf',
                      })
                    }
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    <Maximize2 size={12} />
                    <span>{isAr ? 'تكبير' : 'Expand'}</span>
                  </button>

                  <a
                    href={activeSubmission.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      textDecoration: 'none',
                    }}
                  >
                    <ExternalLink size={12} />
                    <span>{isAr ? 'فتح' : 'Open'}</span>
                  </a>

                  <a
                    href={activeSubmission.attachmentDownloadUrl || activeSubmission.attachmentUrl}
                    download={activeSubmission.attachmentName || 'student-solution'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: '800',
                      textDecoration: 'none',
                    }}
                  >
                    <Download size={12} />
                    <span>{isAr ? 'تحميل' : 'Download'}</span>
                  </a>
                </div>
              </div>

              {isPdf ? (
                <div
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1.5px solid var(--border-subtle)',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <iframe
                    src={activeSubmission.attachmentUrl}
                    title={activeSubmission.attachmentName || 'Student PDF'}
                    style={{
                      width: '100%',
                      height: '520px',
                      border: 'none',
                      display: 'block',
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1.5px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '12px',
                    textAlign: 'center',
                  }}
                >
                  <img
                    src={activeSubmission.attachmentUrl}
                    alt={activeSubmission.attachmentName || 'Student solution'}
                    onClick={() =>
                      onPreviewAttachment({
                        url: activeSubmission.attachmentUrl,
                        downloadUrl: activeSubmission.attachmentDownloadUrl || activeSubmission.attachmentUrl,
                        name: activeSubmission.attachmentName || 'solution',
                        type: 'image',
                      })
                    }
                    style={{
                      maxWidth: '100%',
                      maxHeight: '520px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      cursor: 'zoom-in',
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* REAL TEXT SOLUTION */}
          {hasText && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}
              >
                <FileText size={15} color="var(--primary)" />
                <span>{isAr ? 'الإجابة النصية المكتوبة من الطالب:' : 'Student Written Answer:'}</span>
              </div>
              <div
                style={{
                  backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#FFFDF7',
                  border: '1.5px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '18px',
                  minHeight: hasAttachment ? '110px' : '240px',
                  lineHeight: 1.85,
                  fontSize: '13.5px',
                  color: 'var(--text-primary)',
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                }}
              >
                {activeSubmission.solutionText}
              </div>
            </div>
          )}

          {!hasAttachment && !hasText && (
            <div
              style={{
                padding: '44px 20px',
                textAlign: 'center',
                borderRadius: '12px',
                border: '1px dashed var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              <Eye size={34} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
              <div style={{ fontSize: '13.5px', fontWeight: '700' }}>
                {isAr ? 'لا يوجد نص أو ملف مرفق مع هذا التسليم.' : 'No file or written answer attached.'}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANE: GRADING CONTROLS */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {isAr ? 'رصد الدرجة والاعتماد' : 'Grade & Approve'}
              </h3>
            </div>
            {activeSubmission.gradedAt && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                {isAr ? 'آخر تقييم:' : 'Graded:'} {formatSubmissionDate(activeSubmission.gradedAt, isAr)}
              </span>
            )}
          </div>

          {gradeSuccess && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.14)',
                border: '1px solid var(--success)',
                color: 'var(--success)',
                fontSize: '12.5px',
                fontWeight: '800',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{gradeSuccess}</span>
            </div>
          )}

          {gradeError && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#EF4444',
                fontSize: '12.5px',
                fontWeight: '700',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{gradeError}</span>
            </div>
          )}

          <form onSubmit={onSaveGrading} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                  {isAr ? 'الدرجة المستحقة للطالب:' : 'Student Score:'}
                </label>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  {isAr ? `الحد الأقصى: ${maxGrade}` : `Max: ${maxGrade}`}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <input
                  type="number"
                  min="0"
                  max={maxGrade}
                  step="0.5"
                  required
                  value={gradeInput}
                  onChange={(e) => onGradeInputChange(e.target.value)}
                  placeholder={String(maxGrade)}
                  style={{
                    width: '104px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--primary)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    fontWeight: '900',
                    textAlign: 'center',
                    outline: 'none',
                  }}
                />
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                  / {maxGrade}
                </span>
              </div>

              {/* Quick Score Presets */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {presets.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => onGradeInputChange(String(p.val))}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: Number(gradeInput) === p.val ? 'rgba(0, 102, 204, 0.12)' : 'var(--bg-subtle)',
                      color: Number(gradeInput) === p.val ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    {p.label} ({p.val})
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Feedback Chips */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {isAr ? 'قوالب ملاحظات سريعة:' : 'Quick Feedback Templates:'}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {QUICK_FEEDBACK_CHIPS.map((chip, idx) => {
                  const text = isAr ? chip.ar : chip.en;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onFeedbackInputChange(feedbackInput ? `${feedbackInput}\n${text}` : text)}
                      style={{
                        padding: '4px 9px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-secondary)',
                        fontSize: '11px',
                        cursor: 'pointer',
                        textAlign: 'start',
                      }}
                    >
                      {text}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Teacher Feedback */}
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                {isAr ? 'ملاحظات وتوجيهات المعلم (تصل للطالب فوراً):' : 'Teacher Feedback:'}
              </label>
              <textarea
                rows="4"
                value={feedbackInput}
                onChange={(e) => onFeedbackInputChange(e.target.value)}
                placeholder={
                  isAr
                    ? 'اكتب تعليقك ونقاط القوة أو الأخطاء التي يجب على الطالب الانتباه لها...'
                    : 'Write feedback, strengths, or areas to improve...'
                }
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
              <button
                type="submit"
                disabled={isSavingGrade}
                style={{
                  flex: '1 1 170px',
                  padding: '11px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: isSavingGrade ? 'not-allowed' : 'pointer',
                  opacity: isSavingGrade ? 0.75 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {isSavingGrade ? <Loader2 size={15} className="hw-spin" /> : <Send size={15} />}
                <span>{isAr ? 'اعتماد الدرجة ورصد التصحيح' : 'Approve & Save Grade'}</span>
              </button>

              <button
                type="button"
                disabled={isSavingGrade}
                onClick={onRejectSubmission}
                style={{
                  flex: '1 1 130px',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #FECACA',
                  backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEF2F2',
                  color: '#EF4444',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: isSavingGrade ? 'not-allowed' : 'pointer',
                  opacity: isSavingGrade ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <XCircle size={15} />
                <span>{isAr ? 'رفض وإعادة للتسليم' : 'Reject'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
