import React, { useEffect } from 'react';
import { X, FileText, Image as ImageIcon, Download, ExternalLink } from 'lucide-react';

export const AttachmentPreviewModal = ({ attachment, isAr, onClose }) => {
  useEffect(() => {
    if (!attachment) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [attachment, onClose]);

  if (!attachment) return null;

  const isImage = attachment.type === 'image';
  const downloadHref = attachment.downloadUrl || attachment.url;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          maxWidth: '920px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            backgroundColor: 'var(--bg-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            {isImage ? (
              <ImageIcon size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
            ) : (
              <FileText size={18} color="#EF4444" style={{ flexShrink: 0 }} />
            )}
            <span
              style={{
                fontSize: '13.5px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {attachment.name || (isAr ? 'معاينة الملف المرفق' : 'Attachment Preview')}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          {attachment.url ? (
            isImage ? (
              <img
                src={attachment.url}
                alt={attachment.name || 'Preview'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '72vh',
                  objectFit: 'contain',
                  borderRadius: '8px',
                }}
              />
            ) : (
              <iframe
                src={attachment.url}
                title={attachment.name || 'PDF Preview'}
                style={{
                  width: '100%',
                  height: '72vh',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                }}
              />
            )
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
              <FileText size={44} style={{ margin: '0 auto 10px', opacity: 0.45 }} />
              <div style={{ fontSize: '13.5px', fontWeight: '700' }}>
                {isAr ? 'رابط المعاينة غير متاح لهذا الملف.' : 'Preview URL unavailable for this file.'}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 18px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '8px',
            flexWrap: 'wrap',
            backgroundColor: 'var(--bg-subtle)',
          }}
        >
          {attachment.url && (
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: '700',
                textDecoration: 'none',
              }}
            >
              <ExternalLink size={13} />
              <span>{isAr ? 'فتح في تبويب جديد' : 'Open in New Tab'}</span>
            </a>
          )}

          {downloadHref && (
            <a
              href={downloadHref}
              download={attachment.name || 'attachment'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '12px',
                fontWeight: '800',
                textDecoration: 'none',
              }}
            >
              <Download size={13} />
              <span>{isAr ? 'تحميل الملف' : 'Download'}</span>
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
