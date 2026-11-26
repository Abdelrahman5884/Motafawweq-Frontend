import React from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

export const CancelSubscriptionModal = ({
  open = false,
  isRtl = true,
  lang = 'ar',
  role = 'student',
  activeSub = null,
  pendingRequest = null,
  pendingSwitchTarget = null,
  isCancelling = false,
  cancelError = '',
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  const isAr = lang === 'ar';
  const cancellingPending = Boolean(pendingRequest);

  const title = cancellingPending
    ? pendingSwitchTarget
      ? isAr
        ? 'إلغاء الطلب المعلّق قبل التبديل'
        : 'Cancel Pending Request Before Switching'
      : isAr
        ? 'تأكيد إلغاء طلب الاشتراك المعلّق'
        : 'Confirm Pending Request Cancellation'
    : pendingSwitchTarget
      ? isAr
        ? 'إلغاء الاشتراك الحالي قبل التبديل'
        : 'Cancel Active Plan Before Switching'
      : isAr
        ? 'تأكيد إلغاء الاشتراك الحالي'
        : 'Confirm Subscription Cancellation';

  const roleFallbackCopyAr =
    role === 'center'
      ? 'سيعود السنتر فوراً إلى الباقة المجانية (20 مستخدم نشط) وستُقفل المميزات المدفوعة حتى تشترك مجدداً، مع الاحتفاظ بجميع بياناتك دون حذف.'
      : role === 'teacher'
        ? 'سيعود حسابك فوراً إلى الباقة المجانية للمعلم وستُقفل المميزات المدفوعة حتى تشترك مجدداً، مع الاحتفاظ بجميع كورساتك وبياناتك دون حذف.'
        : 'سيعود حسابك فوراً إلى باقة الطالب المجانية وستُقفل المميزات المدفوعة (مثل الدوريات والـ AI) حتى تشترك مجدداً، مع الاحتفاظ بجميع دروسك ودرجاتك دون حذف.';

  const roleFallbackCopyEn =
    role === 'center'
      ? 'Your center will immediately revert to the Free tier (20 active users) and paid features will lock until you subscribe again. All existing data stays safe.'
      : role === 'teacher'
        ? 'Your account will immediately revert to the Teacher Free tier and paid features will lock until you subscribe again. All courses and data stay safe.'
        : 'Your account will immediately revert to Student Free and paid features (Leagues & AI) will lock until you subscribe again. All your lessons and scores stay safe.';

  const body = cancellingPending
    ? pendingSwitchTarget
      ? isAr
        ? `لديك طلب اشتراك معلّق لباقة «${pendingRequest.planNameAr}» بانتظار مراجعة السوبر أدمن. للانتقال إلى «${pendingSwitchTarget.nameAr}»، يجب إلغاء الطلب المعلّق أولاً ثم إرسال الطلب الجديد.`
        : `You have a pending subscription request for "${pendingRequest.planNameEn || pendingRequest.planNameAr}". To switch to "${pendingSwitchTarget.nameEn || pendingSwitchTarget.nameAr}", cancel the pending request first.`
      : isAr
        ? `هل أنت متأكد من إلغاء طلب الاشتراك المعلّق لباقة «${pendingRequest.planNameAr}»؟ سيتم سحب الطلب من قائمة مراجعة الإدارة ويمكنك اختيار أي باقة أخرى بعدها.`
        : `Are you sure you want to withdraw your pending request for "${pendingRequest.planNameEn || pendingRequest.planNameAr}"? You can submit a new subscription anytime.`
    : pendingSwitchTarget
      ? isAr
        ? `للانتقال إلى «${pendingSwitchTarget.nameAr}»، يجب إلغاء اشتراكك النشط في «${activeSub?.planNameAr || ''}» أولاً. بمجرد الإلغاء ستُفتح لك نافذة الاشتراك في الباقة الجديدة فوراً.`
        : `To switch to "${pendingSwitchTarget.nameEn || pendingSwitchTarget.nameAr}", you must cancel your active subscription first. Checkout for the new plan will open right after.`
      : isAr
        ? `هل أنت متأكد من إلغاء اشتراكك النشط في «${activeSub?.planNameAr || ''}»؟ ${roleFallbackCopyAr}`
        : `Are you sure you want to cancel "${activeSub?.planNameEn || activeSub?.planNameAr || ''}"? ${roleFallbackCopyEn}`;

  const confirmText = cancellingPending
    ? pendingSwitchTarget
      ? isAr
        ? 'إلغاء الطلب المعلّق والمتابعة'
        : 'Cancel Pending & Continue'
      : isAr
        ? 'نعم، إلغاء الطلب المعلّق'
        : 'Yes, Cancel Pending Request'
    : pendingSwitchTarget
      ? isAr
        ? 'إلغاء الحالي والانتقال للباقة الجديدة'
        : 'Cancel & Continue to New Plan'
      : isAr
        ? 'نعم، إلغاء الاشتراك الحالي'
        : 'Yes, Cancel Subscription';

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 37, 78, 0.78)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '22px',
          maxWidth: '470px',
          width: '100%',
          padding: '26px',
          boxShadow: '0 24px 60px rgba(6, 37, 78, 0.35)',
          direction: isRtl ? 'rtl' : 'ltr',
          fontFamily: isRtl
            ? 'var(--font-arabic), "Cairo", system-ui, sans-serif'
            : 'var(--font-heading), "Outfit", sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {title}
            </h3>
          </div>
          <button
            type="button"
            disabled={isCancelling}
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 14px 0' }}>
          {body}
        </p>

        {cancelError && (
          <div
            role="alert"
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#DC2626',
              fontSize: '12.5px',
              fontWeight: '700',
              marginBottom: '14px',
            }}
          >
            {cancelError}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px', flexWrap: 'wrap' }}>
          <button
            type="button"
            disabled={isCancelling}
            onClick={onClose}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '700',
              fontFamily: 'inherit',
              cursor: isCancelling ? 'not-allowed' : 'pointer',
            }}
          >
            {isAr ? 'تراجع' : 'Keep'}
          </button>

          <button
            type="button"
            disabled={isCancelling}
            onClick={onConfirm}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '10px 18px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '800',
              fontFamily: 'inherit',
              cursor: isCancelling ? 'wait' : 'pointer',
              opacity: isCancelling ? 0.75 : 1,
            }}
          >
            {isCancelling && <Loader2 size={14} className="animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
