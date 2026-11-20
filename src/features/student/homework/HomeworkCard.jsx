import React from 'react';
import {
  Clock,
  FileText,
  Image as ImageIcon,
  Send,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Edit3,
} from 'lucide-react';
import { formatFileSize } from './useStudentHomework';

export const HomeworkCard = ({ hw, handleOpenHw, lang = 'ar' }) => {
  const isAr = lang === 'ar';
  const isPending = hw.status === 'pending';
  const isRejected = hw.status === 'rejected';
  const isSubmitted = hw.status === 'submitted';
  const isGraded = hw.status === 'graded';
  const needsAction = isPending || isRejected;

  const isTeacherImage = hw.fileType === 'image' || hw.type === 'image';
  const typeLabel = hw.attachmentUrl
    ? isTeacherImage
      ? isAr
        ? 'صورة توضيحية'
        : 'Image Sheet'
      : isAr
        ? 'شيت PDF'
        : 'PDF Sheet'
    : isAr
      ? 'واجب نصي'
      : 'Text Assignment';

  return (
    <div
      className="clean-hw-card"
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: isRejected
          ? '1.5px solid rgba(220, 38, 38, 0.45)'
          : isGraded
            ? '1px solid rgba(5, 150, 105, 0.35)'
            : '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-xs)',
        minWidth: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ minWidth: 0 }}>
        {/* Top Row: Subject & Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '12px',
          }}
        >
          <span
            title={hw.subjectAr}
            style={{
              fontSize: '11.5px',
              fontWeight: '700',
              padding: '3px 10px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              maxWidth: '55%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {hw.subjectAr}
          </span>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {hw.isOverdue && needsAction && (
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: '800',
                  color: '#DC2626',
                  backgroundColor: 'rgba(220, 38, 38, 0.1)',
                  padding: '2px 7px',
                  borderRadius: '7px',
                }}
              >
                {isAr ? 'متأخر' : 'Overdue'}
              </span>
            )}

            {isPending && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#D97706',
                  backgroundColor: 'rgba(245, 158, 11, 0.14)',
                  padding: '3px 9px',
                  borderRadius: '8px',
                }}
              >
                {isAr ? 'مطلوب تسليمه' : 'Due'}
              </span>
            )}

            {isRejected && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#DC2626',
                  backgroundColor: 'rgba(220, 38, 38, 0.12)',
                  padding: '3px 9px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <AlertTriangle size={11} />
                <span>{isAr ? 'مرفوض • أعد التسليم' : 'Resubmit Required'}</span>
              </span>
            )}

            {isSubmitted && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-surface)',
                  padding: '3px 9px',
                  borderRadius: '8px',
                }}
              >
                {isAr ? 'قيد المراجعة' : 'In Review'}
              </span>
            )}

            {isGraded && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#059669',
                  backgroundColor: 'rgba(5, 150, 105, 0.12)',
                  padding: '3px 9px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CheckCircle2 size={12} />
                <span>
                  {hw.earnedScore}/{hw.maxScore}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          title={hw.titleAr}
          style={{
            fontSize: '16px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            lineHeight: 1.45,
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {hw.titleAr}
        </h3>

        {hw.lessonTitleAr && (
          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginBottom: '10px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {isAr ? `الحصة: ${hw.lessonTitleAr}` : `Lesson: ${hw.lessonTitleAr}`}
          </div>
        )}

        {/* Teacher & Deadline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginBottom: '12px',
          }}
        >
          <span style={{ fontWeight: '700' }}>
            {hw.teacherNameAr || (isAr ? 'معلم المادة' : 'Instructor')}
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: hw.isOverdue && needsAction ? '#DC2626' : needsAction ? '#D97706' : 'var(--text-muted)',
              fontWeight: '700',
            }}
          >
            <Clock size={12} />
            <span dir="ltr">{hw.deadlineTextAr}</span>
          </span>
        </div>

        {/* Real Teacher Attachment Chip */}
        {hw.attachmentName && (
          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              padding: '8px 10px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: 'var(--text-primary)',
              fontWeight: '700',
              marginBottom: '12px',
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {isTeacherImage ? <ImageIcon size={13} /> : <FileText size={13} />}
            </div>
            <span
              title={hw.attachmentName}
              style={{
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {hw.attachmentName}
            </span>
            {hw.attachmentSizeBytes > 0 && (
              <span
                style={{
                  fontSize: '10.5px',
                  padding: '2px 6px',
                  borderRadius: '5px',
                  backgroundColor: 'var(--bg-hover)',
                  color: 'var(--text-secondary)',
                  fontWeight: '700',
                  flexShrink: 0,
                }}
              >
                {formatFileSize(hw.attachmentSizeBytes, lang)}
              </span>
            )}
          </div>
        )}

        {/* Rejection Note Preview */}
        {isRejected && hw.feedbackAr && (
          <div
            style={{
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
              color: '#DC2626',
              padding: '8px 10px',
              borderRadius: '10px',
              fontSize: '11.5px',
              fontWeight: '700',
              lineHeight: 1.5,
              marginBottom: '12px',
              overflowWrap: 'anywhere',
            }}
          >
            {hw.feedbackAr}
          </div>
        )}

        {/* Meta Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginBottom: '16px',
          }}
        >
          <span>{typeLabel}</span>
          <span>•</span>
          <span>
            {isAr ? `الدرجة: ${hw.maxScore} درجة` : `Max Grade: ${hw.maxScore}`}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={() => handleOpenHw(hw)}
        className="clean-hw-btn"
        style={{
          width: '100%',
          padding: '11px 16px',
          borderRadius: '12px',
          backgroundColor: isRejected
            ? '#DC2626'
            : isPending
              ? 'var(--primary)'
              : 'var(--bg-subtle)',
          color: needsAction ? '#FFFFFF' : 'var(--text-primary)',
          border: needsAction ? 'none' : '1px solid var(--border-subtle)',
          fontSize: '13px',
          fontWeight: '800',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: isPending
            ? '0 2px 10px rgba(21, 136, 199, 0.25)'
            : isRejected
              ? '0 2px 10px rgba(220, 38, 38, 0.25)'
              : 'none',
          boxSizing: 'border-box',
        }}
      >
        {isRejected ? (
          <RotateCcw size={14} />
        ) : isPending ? (
          <Send size={14} />
        ) : isGraded ? (
          <CheckCircle2 size={14} color="#059669" />
        ) : (
          <Edit3 size={14} color="var(--primary)" />
        )}
        <span>
          {isRejected
            ? isAr
              ? 'تعديل وإعادة التسليم'
              : 'Fix & Resubmit'
            : isPending
              ? isAr
                ? 'حل وتسليم الواجب'
                : 'Solve & Submit'
              : isGraded
                ? isAr
                  ? 'عرض التقييم والملاحظات'
                  : 'View Grade & Feedback'
                : isAr
                  ? 'عرض أو تعديل الحل'
                  : 'View or Edit Solution'}
        </span>
      </button>
    </div>
  );
};
