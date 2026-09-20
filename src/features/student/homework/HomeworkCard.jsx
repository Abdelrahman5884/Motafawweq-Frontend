import React from 'react';
import { Clock, FileText, Send, CheckCircle2 } from 'lucide-react';

export const HomeworkCard = ({ hw, handleOpenHw, lang }) => {
  const isPending = hw.status === 'pending';
  const isSubmitted = hw.status === 'submitted';
  const isGraded = hw.status === 'graded';

  return (
    <div
      className="clean-hw-card"
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-xs)',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div>
        {/* Top Badges */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <span style={{
            fontSize: '12px',
            fontWeight: '700',
            padding: '3px 10px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)'
          }}>
            {hw.subjectAr}
          </span>

          {isPending && (
            <span style={{
              fontSize: '11.5px',
              fontWeight: '700',
              color: 'var(--warning)',
              backgroundColor: 'var(--warning-light)',
              padding: '3px 9px',
              borderRadius: '8px'
            }}>
              {lang === 'ar' ? 'مطلوب تسليمه' : 'Due'}
            </span>
          )}

          {isSubmitted && (
            <span style={{
              fontSize: '11.5px',
              fontWeight: '700',
              color: 'var(--primary)',
              backgroundColor: 'var(--primary-surface)',
              padding: '3px 9px',
              borderRadius: '8px'
            }}>
              {lang === 'ar' ? 'تم التسليم • قيد المراجعة' : 'Submitted • In Review'}
            </span>
          )}

          {isGraded && (
            <span style={{
              fontSize: '11.5px',
              fontWeight: '800',
              color: 'var(--success)',
              backgroundColor: 'var(--success-light)',
              padding: '3px 9px',
              borderRadius: '8px'
            }}>
              {lang === 'ar' ? `تم التصحيح (${hw.earnedScore}/${hw.maxScore})` : `Graded (${hw.earnedScore}/${hw.maxScore})`}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '16.5px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          margin: '0 0 10px 0',
          lineHeight: 1.45,
          minHeight: '44px',
          wordBreak: 'break-word'
        }}>
          {hw.titleAr}
        </h3>

        {/* Teacher & Deadline */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginBottom: '14px'
        }}>
          <span style={{ fontWeight: '600' }}>{hw.teacherNameAr}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isPending ? 'var(--warning)' : 'var(--text-muted)' }}>
            <Clock size={12} />
            {hw.deadlineTextAr}
          </span>
        </div>

        {/* PDF Attachment Notice */}
        {hw.teacherAttachmentPdf && (
          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            padding: '8px 12px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--text-primary)',
            fontWeight: '700',
            marginBottom: '14px',
            boxSizing: 'border-box'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              backgroundColor: 'var(--primary-surface)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <FileText size={13} />
            </div>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px' }}>
              {lang === 'ar' ? 'شيت الأسئلة مرفق بصيغة PDF' : 'Attached Assignment PDF'}
            </span>
            <span style={{
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '5px',
              backgroundColor: 'var(--bg-hover)',
              color: 'var(--text-secondary)',
              fontWeight: '600'
            }}>
              {hw.teacherAttachmentPdf.fileSize}
            </span>
          </div>
        )}

        {/* Specs row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginBottom: '18px'
        }}>
          <span>{hw.questionsCount} أسئلة</span>
          <span>•</span>
          <span>الدرجة: {hw.maxScore} درجة</span>
        </div>
      </div>

      {/* Action Button */}
      <div>
        <button
          onClick={() => handleOpenHw(hw)}
          className="clean-btn"
          style={{
            width: '100%',
            padding: '11px 16px',
            borderRadius: '12px',
            backgroundColor: isPending ? 'var(--primary)' : 'var(--bg-subtle)',
            color: isPending ? '#FFFFFF' : 'var(--text-primary)',
            border: isPending ? 'none' : '1px solid var(--border-subtle)',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: isPending ? '0 2px 10px rgba(21, 136, 199, 0.25)' : 'none',
            boxSizing: 'border-box'
          }}
        >
          {isPending ? <Send size={14} /> : isGraded ? <CheckCircle2 size={14} /> : <FileText size={14} />}
          <span>
            {isPending
              ? (lang === 'ar' ? 'حل وتسليم الواجب' : 'Solve & Submit')
              : isGraded
              ? (lang === 'ar' ? 'عرض التقييم والملاحظات' : 'View Grade')
              : (lang === 'ar' ? 'عرض الحل المسلّم' : 'View Submission')}
          </span>
        </button>
      </div>
    </div>
  );
};
