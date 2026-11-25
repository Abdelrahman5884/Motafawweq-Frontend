import React, { useState } from 'react';
import { ShieldOff, X, AlertCircle, Loader2 } from 'lucide-react';

const QUICK_REASONS_AR = [
  'تصحيح خطأ في البيانات أو الدرجة',
  'إصدار مكرر عن طريق الخطأ',
  'مخالفة تعليمات الاختبار أو المقرر',
];

const QUICK_REASONS_EN = [
  'Correction of student details or grade',
  'Duplicate issuance by mistake',
  'Exam or academic integrity violation',
];

export const RevokeCertificateModal = ({
  certificate,
  onConfirm,
  onClose,
  lang,
  isRtl,
}) => {
  const isAr = lang === 'ar';
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!certificate) return null;

  const quickReasons = isAr ? QUICK_REASONS_AR : QUICK_REASONS_EN;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);
    try {
      await onConfirm(certificate.id, reason.trim());
    } catch (err) {
      setError(err?.message || (isAr ? 'تعذر إلغاء الشهادة.' : 'Failed to revoke certificate.'));
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={() => { if (!isSubmitting) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 25, 53, 0.72)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: '22px',
          width: '100%',
          maxWidth: '460px',
          padding: '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '11px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldOff size={19} />
            </div>
            <div>
              <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                {isAr ? 'إلغاء وسحب الشهادة المعتمدة' : 'Revoke Official Certificate'}
              </h3>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                {certificate.certNumber || certificate.serialId}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            padding: '11px 13px',
            borderRadius: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.06)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontSize: '12.5px',
            color: 'var(--text-primary)',
            lineHeight: 1.6,
            marginBottom: '14px',
          }}
        >
          {isAr
            ? `سيتم إلغاء شهادة الطالب "${certificate.studentNameAr}" في مقرر "${certificate.courseNameAr}". عند مسح رمز QR مستقبلاً ستظهر الشهادة كملغاة رسمياً.`
            : `Revoking "${certificate.studentNameAr}"'s certificate for "${certificate.courseNameAr}". Any future QR verification will clearly show it as revoked.`}
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '9px 12px',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontSize: '12px',
              fontWeight: '700',
              marginBottom: '12px',
            }}
          >
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {isAr ? 'سبب الإلغاء (سيظهر في سجل التحقق):' : 'Revocation Reason:'}
          </label>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
            {quickReasons.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                style={{
                  padding: '4px 9px',
                  borderRadius: '8px',
                  border: `1px solid ${reason === r ? '#EF4444' : 'var(--border-medium)'}`,
                  backgroundColor: reason === r ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-subtle)',
                  color: reason === r ? '#EF4444' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <textarea
            rows={2}
            maxLength={255}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={isAr ? 'اكتب سبب سحب الشهادة (اختياري)...' : 'Enter reason for revocation (optional)...'}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '11px',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontFamily: 'inherit',
              outline: 'none',
              resize: 'vertical',
              marginBottom: '18px',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: '11px',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'تراجع' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '11px',
                border: 'none',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: isSubmitting ? 'wait' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <ShieldOff size={14} />}
              <span>{isSubmitting ? (isAr ? 'جاري الإلغاء...' : 'Revoking...') : (isAr ? 'تأكيد إلغاء الشهادة' : 'Confirm Revoke')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RevokeCertificateModal;
