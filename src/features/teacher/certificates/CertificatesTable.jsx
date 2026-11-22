import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  ShieldOff,
  FileCheck,
  Share2,
  Loader2,
  Copy,
  Check,
  Ban,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { Avatar } from '../../../components/common/Avatar';
import { formatCertScore, resolveLiveVerifyUrl } from './certificateHelpers';

export const CertificatesTable = ({
  certificates,
  pagination,
  sharingRowId,
  hasActiveFilters,
  onPreview,
  onShareImage,
  onRevoke,
  onPageChange,
  onResetFilters,
  onOpenIssue,
  lang,
  isRtl,
  isMobile,
}) => {
  const isAr = lang === 'ar';
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyVerifyLink = (cert) => {
    const url = resolveLiveVerifyUrl(cert);
    if (!url) return;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedId(cert.id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === cert.id ? null : prev));
    }, 2200);
  };

  if (certificates.length === 0) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '18px',
          border: '1px solid var(--border-subtle)',
          padding: '44px 20px',
          textAlign: 'center',
          color: 'var(--text-secondary)',
        }}
      >
        <Award size={38} style={{ margin: '0 auto 10px', opacity: 0.5, color: 'var(--primary)' }} />
        <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
          {hasActiveFilters
            ? isAr
              ? 'لا توجد شهادات مطابقة لخيارات البحث والفلترة'
              : 'No certificates match your filters'
            : isAr
              ? 'لم تصدر أي شهادات لطلابك بعد'
              : 'No certificates issued yet'}
        </div>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 auto 16px', maxWidth: '420px' }}>
          {hasActiveFilters
            ? isAr
              ? 'جرب تغيير كلمات البحث أو مسح الفلاتر.'
              : 'Try adjusting your search or resetting filters.'
            : isAr
              ? 'ابدأ بإصدار أول شهادة تفوق معتمدة وموقعة رقمياً لطلابك مع رمز QR للتحقق الفوري.'
              : 'Issue your first cryptographically signed certificate with QR verification.'}
        </p>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onResetFilters}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              color: 'var(--primary)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenIssue}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '11px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Plus size={15} />
            <span>{isAr ? 'إصدار أول شهادة' : 'Issue First Certificate'}</span>
          </button>
        )}
      </div>
    );
  }

  const renderStatusBadge = (cert) => {
    const isRevoked = cert.status === 'revoked';
    return (
      <div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 9px',
            borderRadius: '7px',
            backgroundColor: isRevoked ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
            color: isRevoked ? '#EF4444' : '#10B981',
            border: `1px solid ${isRevoked ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
            fontSize: '11px',
            fontWeight: '800',
          }}
        >
          {isRevoked ? <ShieldOff size={13} /> : <ShieldCheck size={13} />}
          <span>
            {isRevoked
              ? isAr
                ? 'ملغاة'
                : 'Revoked'
              : isAr
                ? 'معتمدة وموقعة'
                : 'Verified'}
          </span>
        </span>
        {isRevoked && cert.revocationReason && (
          <div
            style={{
              fontSize: '10.5px',
              color: '#EF4444',
              marginTop: '4px',
              maxWidth: '180px',
              lineHeight: 1.4,
            }}
          >
            {cert.revocationReason}
          </div>
        )}
      </div>
    );
  };

  const renderPagination = () => {
    const currentPage = Number(pagination?.current_page || 1);
    const lastPage = Number(pagination?.last_page || 1);
    if (lastPage <= 1) return null;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: isMobile ? '14px' : '0',
          marginTop: isMobile ? '12px' : 0,
          border: isMobile ? '1px solid var(--border-subtle)' : undefined,
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>
          {isAr
            ? `صفحة ${currentPage} من ${lastPage} (${Number(pagination?.total || 0)} شهادة)`
            : `Page ${currentPage} of ${lastPage} (${Number(pagination?.total || 0)} total)`}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '9px',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage <= 1 ? 0.5 : 1,
            }}
          >
            {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            <span>{isAr ? 'السابق' : 'Previous'}</span>
          </button>

          <button
            type="button"
            disabled={currentPage >= lastPage}
            onClick={() => onPageChange(currentPage + 1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '9px',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: currentPage >= lastPage ? 'not-allowed' : 'pointer',
              opacity: currentPage >= lastPage ? 0.5 : 1,
            }}
          >
            <span>{isAr ? 'التالي' : 'Next'}</span>
            {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>
      </div>
    );
  };

  if (isMobile) {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {certificates.map((cert) => {
            const isRowSharing = sharingRowId === cert.id;
            const isRevoked = cert.status === 'revoked';
            const isCopied = copiedId === cert.id;

            return (
              <div
                key={cert.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '16px',
                  border: `1px solid ${isRevoked ? 'rgba(239, 68, 68, 0.25)' : 'var(--border-subtle)'}`,
                  padding: '15px',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '11px',
                  opacity: isRevoked ? 0.88 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <Avatar src={cert.studentAvatar} name={cert.studentNameAr} size={36} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: '800', fontSize: '14.5px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cert.studentNameAr}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {cert.certNumber || cert.serialId} • {cert.issueDate}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '3px 9px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(21, 136, 199, 0.12)',
                      color: 'var(--primary)',
                      fontWeight: '900',
                      fontSize: '13px',
                      flexShrink: 0,
                    }}
                  >
                    {formatCertScore(cert)}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '3px 9px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--primary)',
                      border: '1px solid var(--border-subtle)',
                      fontWeight: '800',
                      fontSize: '11px',
                      marginBottom: '4px',
                    }}
                  >
                    {cert.honorsTitleAr}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {cert.courseNameAr}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                  {renderStatusBadge(cert)}
                  <button
                    type="button"
                    onClick={() => handleCopyVerifyLink(cert)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 9px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: isCopied ? '#10B981' : 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    {isCopied ? <Check size={12} /> : <Copy size={12} />}
                    <span>{isCopied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'رابط التحقق' : 'Verify Link')}</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => onPreview(cert)}
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(21, 136, 199, 0.1)',
                      color: 'var(--primary)',
                      border: '1px solid rgba(21, 136, 199, 0.25)',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    <FileCheck size={14} />
                    <span>{isAr ? 'معاينة' : 'Preview'}</span>
                  </button>

                  {!isRevoked && (
                    <>
                      <button
                        type="button"
                        onClick={() => onShareImage(cert)}
                        disabled={isRowSharing}
                        style={{
                          flex: 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          padding: '8px 10px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: isRowSharing ? 'wait' : 'pointer',
                          opacity: isRowSharing ? 0.75 : 1,
                        }}
                      >
                        {isRowSharing ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
                        <span>{isRowSharing ? (isAr ? 'تجهيز...' : 'Preparing...') : (isAr ? 'مشاركة' : 'Share')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onRevoke(cert)}
                        title={isAr ? 'إلغاء وسحب الشهادة' : 'Revoke Certificate'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '8px 10px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(239, 68, 68, 0.08)',
                          color: '#EF4444',
                          border: '1px solid rgba(239, 68, 68, 0.22)',
                          cursor: 'pointer',
                        }}
                      >
                        <Ban size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {renderPagination()}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '18px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-xs)',
        overflow: 'hidden',
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
              }}
            >
              <th style={{ padding: '14px 18px' }}>{isAr ? 'رقم الشهادة والتاريخ' : 'Serial & Date'}</th>
              <th style={{ padding: '14px 18px' }}>{isAr ? 'الطالب' : 'Student'}</th>
              <th style={{ padding: '14px 18px' }}>{isAr ? 'التقدير والمقرر' : 'Honors & Course'}</th>
              <th style={{ padding: '14px 18px' }}>{isAr ? 'النسبة' : 'Score'}</th>
              <th style={{ padding: '14px 18px' }}>{isAr ? 'حالة التوثيق' : 'Status'}</th>
              <th style={{ padding: '14px 18px', textAlign: 'center' }}>{isAr ? 'إجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => {
              const isRowSharing = sharingRowId === cert.id;
              const isRevoked = cert.status === 'revoked';
              const isCopied = copiedId === cert.id;

              return (
                <tr
                  key={cert.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    opacity: isRevoked ? 0.85 : 1,
                  }}
                >
                  <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '12.5px' }}>
                      {cert.certNumber || cert.serialId}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {cert.issueDate}
                    </div>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Avatar src={cert.studentAvatar} name={cert.studentNameAr} size={36} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                          {cert.studentNameAr}
                        </div>
                        {(cert.studentCode || cert.studentPhone || cert.studentEmail) && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {cert.studentCode || cert.studentPhone || cert.studentEmail}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(21, 136, 199, 0.1)',
                        color: 'var(--primary)',
                        fontWeight: '800',
                        fontSize: '11px',
                        marginBottom: '4px',
                      }}
                    >
                      {cert.honorsTitleAr}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {cert.courseNameAr}
                    </div>
                  </td>

                  <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '14.5px', fontWeight: '900', color: 'var(--primary)' }}>
                      {formatCertScore(cert)}
                    </span>
                  </td>

                  <td style={{ padding: '14px 18px' }}>{renderStatusBadge(cert)}</td>

                  <td style={{ padding: '14px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => onPreview(cert)}
                        title={isAr ? 'معاينة وتحميل الشهادة' : 'Preview & Download'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '6px 11px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(21, 136, 199, 0.1)',
                          color: 'var(--primary)',
                          border: '1px solid rgba(21, 136, 199, 0.25)',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: 'pointer',
                        }}
                      >
                        <FileCheck size={13} />
                        <span>{isAr ? 'معاينة' : 'Preview'}</span>
                      </button>

                      {!isRevoked && (
                        <button
                          type="button"
                          onClick={() => onShareImage(cert)}
                          disabled={isRowSharing}
                          title={isAr ? 'مشاركة الشهادة كصورة' : 'Share certificate image'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '6px 11px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--primary)',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: '800',
                            cursor: isRowSharing ? 'wait' : 'pointer',
                            opacity: isRowSharing ? 0.75 : 1,
                          }}
                        >
                          {isRowSharing ? <Loader2 size={13} className="animate-spin" /> : <Share2 size={13} />}
                          <span>{isRowSharing ? (isAr ? 'تجهيز...' : 'Preparing...') : (isAr ? 'مشاركة' : 'Share')}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCopyVerifyLink(cert)}
                        title={isAr ? 'نسخ رابط التحقق الرسمي' : 'Copy verification link'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px 8px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-subtle)',
                          border: '1px solid var(--border-medium)',
                          color: isCopied ? '#10B981' : 'var(--text-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        {isCopied ? <Check size={13} /> : <Copy size={13} />}
                      </button>

                      {!isRevoked && (
                        <button
                          type="button"
                          onClick={() => onRevoke(cert)}
                          title={isAr ? 'إلغاء وسحب الشهادة' : 'Revoke Certificate'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px 8px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid rgba(239, 68, 68, 0.22)',
                            color: '#EF4444',
                            cursor: 'pointer',
                          }}
                        >
                          <Ban size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );
};

export default CertificatesTable;
