import React, { useMemo } from 'react';
import {
  ArrowRight,
  Trash2,
  Edit3,
  Paperclip,
  FileText,
  Image as ImageIcon,
  Eye,
  Download,
  Search,
  X,
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Award,
  RefreshCw,
  AlertCircle,
  Cloud,
} from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { formatSubmissionDate } from './homeworkConstants';

export const HomeworkDetailView = ({
  homework,
  submissions,
  loadingSubmissions,
  submissionsError,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  isAr,
  isRtl,
  isDark,
  onBack,
  onRefreshSubmissions,
  onOpenEdit,
  onPromptDelete,
  onPreviewAttachment,
  onOpenGradingDesk,
}) => {
  const counts = useMemo(() => {
    let pending = 0;
    let graded = 0;
    let rejected = 0;
    for (const s of submissions) {
      if (s.status === 'pending') pending += 1;
      else if (s.status === 'graded') graded += 1;
      else if (s.status === 'rejected') rejected += 1;
    }
    return { total: submissions.length, pending, graded, rejected };
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return submissions.filter((sub) => {
      if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
      if (!q) return true;
      return (
        (sub.studentNameAr || '').toLowerCase().includes(q) ||
        (sub.studentEmail || '').toLowerCase().includes(q) ||
        (sub.studentCode || '').toLowerCase().includes(q) ||
        (sub.locationAr || '').toLowerCase().includes(q)
      );
    });
  }, [submissions, searchQuery, statusFilter]);

  const renderStatusBadge = (status, compact = false) => {
    const pad = compact ? '3px 8px' : '3px 9px';
    const fontSize = compact ? '11px' : '11.5px';
    if (status === 'graded') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: pad,
            borderRadius: '6px',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
            color: 'var(--success)',
            border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.25)' : '#A7F3D0'}`,
            fontSize,
            fontWeight: '800',
            whiteSpace: 'nowrap',
          }}
        >
          <CheckCircle size={compact ? 11 : 12} />
          <span>{isAr ? (compact ? 'تم الرصد' : 'تم الرصد والاعتماد') : 'Graded'}</span>
        </span>
      );
    }
    if (status === 'rejected') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: pad,
            borderRadius: '6px',
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
            color: '#EF4444',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            fontSize,
            fontWeight: '800',
            whiteSpace: 'nowrap',
          }}
        >
          <XCircle size={compact ? 11 : 12} />
          <span>{isAr ? (compact ? 'مرفوض' : 'مرفوض (إعادة رفع)') : 'Rejected'}</span>
        </span>
      );
    }
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: pad,
          borderRadius: '6px',
          backgroundColor: isDark ? 'rgba(245, 158, 11, 0.14)' : '#FFFBEB',
          color: '#D97706',
          border: '1px solid rgba(245, 158, 11, 0.28)',
          fontSize,
          fontWeight: '800',
          whiteSpace: 'nowrap',
        }}
      >
        <Clock size={compact ? 11 : 12} />
        <span>{isAr ? 'قيد الانتظار' : 'Pending'}</span>
      </span>
    );
  };

  const hwIsImage = homework.fileType === 'image';

  return (
    <div>
      {/* Top Navigation */}
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
          <span>{isAr ? 'الرجوع لقائمة الواجبات' : 'Back to Assignments'}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => onOpenEdit(homework)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 13px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <Edit3 size={13} />
            <span>{isAr ? 'تعديل الواجب' : 'Edit Homework'}</span>
          </button>

          <button
            type="button"
            onClick={(e) => onPromptDelete(homework.id, homework.titleAr, e)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 13px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              color: '#EF4444',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <Trash2 size={13} />
            <span>{isAr ? 'حذف الواجب' : 'Delete'}</span>
          </button>
        </div>
      </div>

      {/* Homework Specs Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '22px',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: '800',
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(0, 102, 204, 0.1)',
              color: 'var(--primary)',
              border: '1px solid rgba(0, 102, 204, 0.2)',
            }}
          >
            {homework.courseTitleAr || (isAr ? 'المقرر الدراسي' : 'Course')}
          </span>
          {homework.lessonAr && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {homework.lessonAr}
            </span>
          )}
          {homework.targetLocationAr && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {isAr ? `المكان: ${homework.targetLocationAr}` : homework.targetLocationAr}
            </span>
          )}
        </div>

        <h1
          style={{
            fontSize: '20px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: '0 0 14px',
            fontFamily: 'var(--font-heading), var(--font-arabic)',
          }}
        >
          {homework.titleAr}
        </h1>

        {/* Quick Specs Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 155px), 1fr))',
            gap: '10px',
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12.5px',
          }}
        >
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'الدرجة الكلية: ' : 'Max Grade: '}</span>
            <strong style={{ color: 'var(--primary)' }}>
              {homework.maxGrade} {isAr ? 'درجة' : 'pts'}
            </strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'آخر موعد: ' : 'Deadline: '}</span>
            <strong style={{ color: 'var(--text-primary)' }}>
              {homework.dueDate
                ? `${homework.dueDate} (${homework.dueTime || '23:59'})`
                : isAr
                  ? 'مفتوح'
                  : 'Open'}
            </strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'من سلّموا: ' : 'Submitted: '}</span>
            <strong style={{ color: 'var(--success)' }}>
              {homework.submittedCount || 0} {isAr ? 'طالب' : 'students'}
            </strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'قيد الانتظار: ' : 'Pending: '}</span>
            <strong style={{ color: Number(homework.pendingGrading || 0) > 0 ? '#D97706' : 'var(--text-muted)' }}>
              {homework.pendingGrading || 0}
            </strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>{isAr ? 'متوسط الدرجات: ' : 'Average: '}</span>
            <strong style={{ color: 'var(--text-primary)' }}>
              {Number(homework.avgGrade || 0).toFixed(1)} / {homework.maxGrade}
            </strong>
          </div>
        </div>

        {/* Real Server Attachment Card */}
        {homework.attachmentUrl && (
          <div
            style={{
              marginTop: '14px',
              padding: '14px 16px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: hwIsImage ? 'rgba(0, 102, 204, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: hwIsImage ? 'var(--primary)' : '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {hwIsImage ? <ImageIcon size={19} /> : <FileText size={19} />}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <Paperclip size={13} color="var(--primary)" />
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {homework.attachmentName || (isAr ? 'ملف الواجب المرفق' : 'Homework Attachment')}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', flexWrap: 'wrap' }}>
                  {homework.attachmentSizeLabel && (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {homework.attachmentSizeLabel}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: '700',
                      color: hwIsImage ? 'var(--primary)' : '#EF4444',
                      backgroundColor: hwIsImage ? 'rgba(0, 102, 204, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {hwIsImage ? (isAr ? 'صورة' : 'Image') : isAr ? 'مستند PDF' : 'PDF Document'}
                  </span>
                  {homework.attachmentDisk === 'supabase' && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '10.5px',
                        fontWeight: '700',
                        color: 'var(--success)',
                      }}
                    >
                      <Cloud size={11} />
                      <span>{isAr ? 'مرفوع على الخادم السحابي' : 'Stored on Cloud'}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() =>
                  onPreviewAttachment({
                    url: homework.attachmentUrl,
                    downloadUrl: homework.attachmentDownloadUrl || homework.attachmentUrl,
                    name: homework.attachmentName || 'homework',
                    type: hwIsImage ? 'image' : 'pdf',
                  })
                }
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                <Eye size={13} />
                <span>{isAr ? 'معاينة' : 'Preview'}</span>
              </button>

              <a
                href={homework.attachmentDownloadUrl || homework.attachmentUrl}
                download={homework.attachmentName || 'homework'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: '800',
                  textDecoration: 'none',
                }}
              >
                <Download size={13} />
                <span>{isAr ? 'تحميل' : 'Download'}</span>
              </a>
            </div>
          </div>
        )}

        {/* Written Instructions (shown for text homework OR alongside attachment) */}
        {homework.textContent && (
          <div
            style={{
              marginTop: '14px',
              padding: '13px 16px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px dashed var(--border-subtle)',
              fontSize: '13px',
              color: 'var(--text-primary)',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}
          >
            <div style={{ fontWeight: '800', color: 'var(--primary)', marginBottom: '4px', fontSize: '12px' }}>
              {isAr ? 'نص وتفاصيل الواجب المطلوب من الطلاب:' : 'Assignment Instructions:'}
            </div>
            {homework.textContent}
          </div>
        )}
      </div>

      {/* Submissions Controls */}
      <div
        className="hw-controls-row"
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '14px 18px',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div
          className="hw-filter-search-box"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '8px 14px',
            flex: 1,
            maxWidth: '400px',
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder={isAr ? 'بحث باسم الطالب أو الكود أو المكان...' : 'Search by student name, code, or location...'}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              width: '100%',
              fontFamily: 'inherit',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div
            className="hw-filter-tabs-wrap"
            style={{
              display: 'flex',
              gap: '4px',
              backgroundColor: 'var(--bg-subtle)',
              padding: '3px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {[
              { id: 'all', label: isAr ? `الكل (${counts.total})` : `All (${counts.total})` },
              { id: 'pending', label: isAr ? `قيد الانتظار (${counts.pending})` : `Pending (${counts.pending})` },
              { id: 'graded', label: isAr ? `تم التصحيح (${counts.graded})` : `Graded (${counts.graded})` },
              { id: 'rejected', label: isAr ? `مرفوض (${counts.rejected})` : `Rejected (${counts.rejected})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onStatusFilterChange(tab.id)}
                style={{
                  padding: '5px 11px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: statusFilter === tab.id ? 'var(--primary)' : 'transparent',
                  color: statusFilter === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onRefreshSubmissions}
            disabled={loadingSubmissions}
            title={isAr ? 'تحديث التسليمات' : 'Refresh'}
            style={{
              padding: '7px 10px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              cursor: loadingSubmissions ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <RefreshCw size={14} className={loadingSubmissions ? 'hw-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Submissions Error */}
      {submissionsError && !loadingSubmissions && (
        <div
          style={{
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', fontWeight: '700', fontSize: '13px' }}>
            <AlertCircle size={16} />
            <span>{submissionsError}</span>
          </div>
          <button
            type="button"
            onClick={onRefreshSubmissions}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* Loading State */}
      {loadingSubmissions ? (
        <div
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: '48px', borderRadius: '8px', backgroundColor: 'var(--bg-subtle)' }} />
          ))}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div
            className="hw-submissions-table-wrap"
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: isRtl ? 'right' : 'left',
                  fontSize: '13px',
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      borderBottom: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      fontWeight: '800',
                      fontSize: '12px',
                    }}
                  >
                    <th style={{ padding: '12px 16px', width: '40px' }}>#</th>
                    <th style={{ padding: '12px 16px' }}>{isAr ? 'الطالب' : 'Student'}</th>
                    <th style={{ padding: '12px 16px' }}>{isAr ? 'المكان / المجموعة' : 'Location'}</th>
                    <th style={{ padding: '12px 16px' }}>{isAr ? 'وقت التسليم' : 'Submitted At'}</th>
                    <th style={{ padding: '12px 16px' }}>{isAr ? 'نوع الحل' : 'Format'}</th>
                    <th style={{ padding: '12px 16px' }}>{isAr ? 'الحالة' : 'Status'}</th>
                    <th style={{ padding: '12px 16px' }}>{isAr ? 'الدرجة' : 'Score'}</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>{isAr ? 'الإجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((sub, idx) => (
                      <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontWeight: '700' }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Avatar src={sub.studentAvatar} name={sub.studentNameAr} size={34} />
                            <div>
                              <div style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                                {sub.studentNameAr}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                                {sub.studentCode || sub.studentEmail || ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {sub.locationAr || (isAr ? 'أونلاين' : 'Online')}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {formatSubmissionDate(sub.submittedAt, isAr)}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontSize: '11.5px',
                              fontWeight: '700',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor: 'var(--bg-subtle)',
                              color: 'var(--text-primary)',
                              border: '1px solid var(--border-subtle)',
                              maxWidth: '180px',
                            }}
                          >
                            {sub.type === 'pdf' ? (
                              <FileCheck size={12} color="#EF4444" style={{ flexShrink: 0 }} />
                            ) : sub.type === 'image' ? (
                              <ImageIcon size={12} color="var(--primary)" style={{ flexShrink: 0 }} />
                            ) : (
                              <FileText size={12} color="var(--primary)" style={{ flexShrink: 0 }} />
                            )}
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {sub.attachmentName ||
                                (sub.type === 'pdf'
                                  ? 'PDF'
                                  : sub.type === 'image'
                                    ? isAr
                                      ? 'صورة الحل'
                                      : 'Image'
                                    : isAr
                                      ? 'إجابة نصية'
                                      : 'Text Answer')}
                            </span>
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>{renderStatusBadge(sub.status)}</td>
                        <td style={{ padding: '14px 16px' }}>
                          {sub.status === 'graded' ? (
                            <span style={{ fontWeight: '900', color: 'var(--primary)', fontSize: '13.5px' }}>
                              {sub.score}{' '}
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                / {homework.maxGrade}
                              </span>
                            </span>
                          ) : sub.status === 'rejected' ? (
                            <span style={{ fontWeight: '800', color: '#EF4444', fontSize: '12px' }}>
                              0 / {homework.maxGrade}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                              — / {homework.maxGrade}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => onOpenGradingDesk(sub.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 14px',
                              borderRadius: '6px',
                              backgroundColor: sub.status === 'pending' ? 'var(--primary)' : 'var(--bg-subtle)',
                              color: sub.status === 'pending' ? '#FFFFFF' : 'var(--text-primary)',
                              border: sub.status === 'pending' ? 'none' : '1px solid var(--border-subtle)',
                              fontSize: '12px',
                              fontWeight: '800',
                              cursor: 'pointer',
                            }}
                          >
                            <Edit3 size={12} />
                            <span>
                              {sub.status === 'pending'
                                ? isAr
                                  ? 'تصحيح الواجب'
                                  : 'Grade'
                                : isAr
                                  ? 'مراجعة التصحيح'
                                  : 'Review'}
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        {submissions.length === 0
                          ? isAr
                            ? 'لم يقم أي طالب بتسليم هذا الواجب حتى الآن.'
                            : 'No student submissions received yet.'
                          : isAr
                            ? 'لا توجد تسليمات مطابقة للبحث أو التصفية الحالية.'
                            : 'No submissions match your search or filter.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Submissions Cards */}
          <div className="hw-submissions-mobile-cards">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '14px',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <Avatar src={sub.studentAvatar} name={sub.studentNameAr} size={38} />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: '900',
                            color: 'var(--text-primary)',
                            fontSize: '13.5px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {sub.studentNameAr}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {sub.studentCode || sub.studentEmail || ''}
                        </div>
                      </div>
                    </div>
                    {renderStatusBadge(sub.status, true)}
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '6px 8px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '11.5px',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', minWidth: 0 }}>
                      <MapPin size={11} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sub.locationAr || (isAr ? 'أونلاين' : 'Online')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', minWidth: 0 }}>
                      <FileText size={11} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sub.attachmentName || (isAr ? 'إجابة نصية' : 'Text')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                      <Clock size={11} style={{ flexShrink: 0 }} />
                      <span>{formatSubmissionDate(sub.submittedAt, isAr)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Award size={11} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span style={{ fontWeight: '800', color: sub.status === 'graded' ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {sub.status === 'graded'
                          ? `${sub.score} / ${homework.maxGrade}`
                          : sub.status === 'rejected'
                            ? `0 / ${homework.maxGrade}`
                            : `— / ${homework.maxGrade}`}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenGradingDesk(sub.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      backgroundColor: sub.status === 'pending' ? 'var(--primary)' : 'var(--bg-subtle)',
                      color: sub.status === 'pending' ? '#FFFFFF' : 'var(--text-primary)',
                      border: sub.status === 'pending' ? 'none' : '1px solid var(--border-subtle)',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    <Edit3 size={13} />
                    <span>
                      {sub.status === 'pending'
                        ? isAr
                          ? 'تصحيح الواجب'
                          : 'Grade Homework'
                        : isAr
                          ? 'مراجعة التصحيح'
                          : 'Review Grade'}
                    </span>
                  </button>
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: '30px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '13px',
                }}
              >
                {submissions.length === 0
                  ? isAr
                    ? 'لم يقم أي طالب بتسليم هذا الواجب حتى الآن.'
                    : 'No submissions yet.'
                  : isAr
                    ? 'لا توجد تسليمات مطابقة للبحث أو التصفية الحالية.'
                    : 'No matching submissions.'}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
