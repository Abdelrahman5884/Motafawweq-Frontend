import React from 'react';
import {
  Clock,
  FileCheck2,
  Hash,
  XCircle,
  AlertTriangle,
  Loader2,
  ShieldAlert,
} from 'lucide-react';

const PERIOD_LABELS = {
  monthly: { ar: 'شهري', en: 'Monthly' },
  term: { ar: 'نصف سنوي (ترم)', en: 'Semester' },
  annual: { ar: 'سنوي', en: 'Annual' },
};

export const SubscriptionRequestStatusBanner = ({
  pendingRequest = null,
  latestRejectedRequest = null,
  lang = 'ar',
  isRtl = true,
  onCancelPending = null,
  isCancelling = false,
}) => {
  const isAr = lang === 'ar';

  if (!pendingRequest && !latestRejectedRequest) {
    return null;
  }

  const fontFamily = isRtl
    ? 'var(--font-arabic), "Cairo", system-ui, sans-serif'
    : 'var(--font-heading), "Outfit", sans-serif';

  if (pendingRequest) {
    const periodLabel = PERIOD_LABELS[pendingRequest.billingPeriod]?.[isAr ? 'ar' : 'en'] || pendingRequest.billingPeriod;

    return (
      <div
        role="status"
        style={{
          background:
            'linear-gradient(135deg, rgba(245, 158, 11, 0.11) 0%, var(--bg-surface) 60%, rgba(21, 136, 199, 0.05) 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.42)',
          borderRadius: '22px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '18px',
          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.08)',
          direction: isRtl ? 'rtl' : 'ltr',
          fontFamily,
        }}
      >
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 12px',
                borderRadius: '99px',
                backgroundColor: 'rgba(245, 158, 11, 0.16)',
                color: '#B45309',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                fontSize: '11.5px',
                fontWeight: '900',
              }}
            >
              <Clock size={13} />
              <span>{isAr ? 'طلب اشتراك بانتظار اعتماد السوبر أدمن' : 'Subscription Pending Super Admin Review'}</span>
            </span>

            {pendingRequest.submittedDate && (
              <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                {isAr ? `أُرسل في ${pendingRequest.submittedDate}` : `Submitted ${pendingRequest.submittedDate}`}
              </span>
            )}
          </div>

          <div style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {isAr ? pendingRequest.planNameAr : pendingRequest.planNameEn || pendingRequest.planNameAr}{' '}
            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)' }}>
              ({periodLabel} • {Number(pendingRequest.amountEgp || 0).toLocaleString()} {isAr ? 'ج.م' : 'EGP'})
            </span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 12px 0', lineHeight: 1.55 }}>
            {isAr
              ? 'تم استلام وصل الدفع وكود العملية بنجاح. سيقوم السوبر أدمن بمراجعة التحويل وتفعيل باقتك تلقائياً فور الاعتماد.'
              : 'Your payment receipt and transaction code have been received. Super Admin will verify your transfer and activate your plan shortly.'}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {pendingRequest.transactionReference && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '12px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono), monospace',
                }}
              >
                <Hash size={12} color="var(--primary)" />
                <span>{pendingRequest.transactionReference}</span>
              </span>
            )}

            {pendingRequest.paymentMethodLabelAr && (
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: 'var(--text-secondary)',
                }}
              >
                {pendingRequest.paymentMethodLabelAr}
              </span>
            )}

            {pendingRequest.hasReceipt && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontSize: '11.5px',
                  fontWeight: '800',
                  color: '#059669',
                }}
              >
                <FileCheck2 size={13} />
                <span>{isAr ? 'وصل الدفع مرفق' : 'Receipt Attached'}</span>
              </span>
            )}
          </div>
        </div>

        {onCancelPending && (
          <button
            type="button"
            disabled={isCancelling}
            onClick={onCancelPending}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              color: '#DC2626',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: isCancelling ? 'wait' : 'pointer',
              opacity: isCancelling ? 0.7 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            {isCancelling ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
            <span>{isAr ? 'إلغاء الطلب المعلّق' : 'Cancel Pending Request'}</span>
          </button>
        )}
      </div>
    );
  }

  // Otherwise show latest rejected request feedback
  return (
    <div
      role="alert"
      style={{
        background:
          'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, var(--bg-surface) 70%)',
        border: '1.5px solid rgba(239, 68, 68, 0.35)',
        borderRadius: '20px',
        padding: '18px 22px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        direction: isRtl ? 'rtl' : 'ltr',
        fontFamily,
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          color: '#DC2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <ShieldAlert size={20} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
          <span style={{ fontSize: '15px', fontWeight: '900', color: '#DC2626' }}>
            {isAr
              ? `تم رفض طلب الاشتراك في ${latestRejectedRequest.planNameAr}`
              : `Subscription request for ${latestRejectedRequest.planNameEn || latestRejectedRequest.planNameAr} was rejected`}
          </span>
          {latestRejectedRequest.transactionReference && (
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: '800',
                fontFamily: 'var(--font-mono), monospace',
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#B91C1C',
              }}
            >
              {latestRejectedRequest.transactionReference}
            </span>
          )}
        </div>

        {latestRejectedRequest.rejectionReason && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '6px',
              marginTop: '6px',
              padding: '8px 12px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid rgba(239, 68, 68, 0.22)',
              fontSize: '13px',
              fontWeight: '700',
              color: 'var(--text-primary)',
            }}
          >
            <AlertTriangle size={15} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              {isAr ? 'سبب الرفض من الإدارة: ' : 'Admin rejection reason: '}
              {latestRejectedRequest.rejectionReason}
            </span>
          </div>
        )}

        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '600' }}>
          {isAr
            ? 'يمكنك اختيار الباقة مجدداً وإرفاق إيصال تحويل واضح مع كود العملية الصحيح لإعادة الإرسال.'
            : 'You can select a plan again and upload a clear receipt with the correct transaction reference.'}
        </div>
      </div>
    </div>
  );
};
