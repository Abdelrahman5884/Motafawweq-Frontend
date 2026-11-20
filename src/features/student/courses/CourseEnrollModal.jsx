import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  CreditCard,
  Smartphone,
  Building2,
  Ticket,
  Check,
  Copy,
  AlertCircle,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import { studentApi } from '../../../services/studentApi';
import { copyTextToClipboard } from '../../../utils';

const PAYMENT_METHODS = [
  { id: 'vodafone', ar: 'فودافون كاش', en: 'Vodafone Cash', icon: Smartphone },
  { id: 'instapay', ar: 'إنستاباي', en: 'InstaPay', icon: Smartphone },
  { id: 'cib', ar: 'تحويل بنكي', en: 'Bank Transfer', icon: Building2 },
  { id: 'fawry', ar: 'فوري باي', en: 'Fawry', icon: CreditCard },
  { id: 'card', ar: 'بطاقة بنكية', en: 'Bank Card', icon: CreditCard },
];

export const CourseEnrollModal = ({
  course,
  lang = 'ar',
  onClose,
  onSubmitEnrollment,
}) => {
  const isAr = lang === 'ar';

  const defaultMethod = useMemo(() => {
    const firstAcc = course?.payoutAccounts?.[0];
    if (firstAcc?.type && PAYMENT_METHODS.some((m) => m.id === firstAcc.type)) {
      return firstAcc.type;
    }
    return 'vodafone';
  }, [course]);

  const [paymentMethod, setPaymentMethod] = useState(defaultMethod);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const [notes, setNotes] = useState('');
  const [copiedAccId, setCopiedAccId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, isSubmitting]);

  if (!course) return null;

  const basePrice = Math.max(0, Number(course.priceEgp || 0));
  const discountEgp = appliedCoupon ? Number(appliedCoupon.discountEgp || 0) : 0;
  const finalPrice = appliedCoupon
    ? Math.max(0, Number(appliedCoupon.finalAmountEgp ?? basePrice - discountEgp))
    : basePrice;

  const matchedAccount =
    (course.payoutAccounts || []).find((acc) => acc.type === paymentMethod) ||
    (course.payoutAccounts || []).find((acc) => acc.isDefault) ||
    (course.payoutAccounts || [])[0] ||
    null;

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code || isValidatingCoupon) return;
    setIsValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await studentApi.billing.validateCoupon(code, basePrice);
      if (res?.data) {
        setAppliedCoupon(res.data);
      }
    } catch (err) {
      setAppliedCoupon(null);
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      setCouponError(
        firstErr ||
          err?.message ||
          (isAr ? 'كود الخصم غير صالح.' : 'Invalid coupon code.')
      );
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleCopyAccount = async (acc) => {
    if (!acc?.accountIdentifier) return;
    const ok = await copyTextToClipboard(acc.accountIdentifier);
    if (ok) {
      setCopiedAccId(acc.id);
      window.setTimeout(() => setCopiedAccId(''), 1800);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await onSubmitEnrollment({
        course,
        paymentMethod,
        payoutAccountUuid: matchedAccount?.id || null,
        couponCode: appliedCoupon?.code || '',
        notes,
      });
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      setSubmitError(
        firstErr ||
          err?.message ||
          (isAr ? 'تعذر إرسال طلب الاشتراك، يرجى المحاولة مرة أخرى.' : 'Failed to submit enrollment request.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-enroll-modal-title"
      onClick={() => !isSubmitting && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 25, 53, 0.72)',
        backdropFilter: 'blur(6px)',
        zIndex: 10002,
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
          borderRadius: '20px',
          padding: '24px',
          maxWidth: '520px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 24px 60px rgba(4, 25, 53, 0.35)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '16px',
            paddingBottom: '14px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <BookOpen size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3
                id="course-enroll-modal-title"
                style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}
              >
                {isAr ? 'تأكيد طلب الاشتراك بالمقرر' : 'Confirm Course Enrollment'}
              </h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                {isAr
                  ? 'يتم فتح جميع حصص المقرر فور مراجعة وتأكيد المعلم'
                  : 'Full course access unlocks as soon as the teacher approves'}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Course Summary Box */}
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '14px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              fontSize: '14.5px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              marginBottom: '4px',
              overflowWrap: 'anywhere',
            }}
          >
            {isAr ? course.titleAr : course.titleEn || course.titleAr}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {course.teacher?.nameAr} • {course.subjectAr}
            {course.lessonsCount > 0 ? ` • ${course.lessonsCount} ${isAr ? 'حصة' : 'lessons'}` : ''}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Payment Method Selector */}
          {basePrice > 0 && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}
              >
                {isAr ? 'اختر وسيلة الدفع / التحويل' : 'Select Payment Method'}
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
                  gap: '8px',
                }}
              >
                {PAYMENT_METHODS.map((pm) => {
                  const Icon = pm.icon;
                  const active = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '9px 10px',
                        borderRadius: '10px',
                        border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        backgroundColor: active ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                        color: active ? 'var(--primary)' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                      }}
                    >
                      <Icon size={14} />
                      <span>{isAr ? pm.ar : pm.en}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Teacher's Active Payout Account Box */}
          {basePrice > 0 && matchedAccount && (
            <div
              style={{
                backgroundColor: 'rgba(21, 136, 199, 0.07)',
                border: '1px solid rgba(21, 136, 199, 0.25)',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)' }}>
                  {isAr ? matchedAccount.labelAr : matchedAccount.labelEn || matchedAccount.labelAr}
                </div>
                <div
                  dir="ltr"
                  style={{
                    fontSize: '14px',
                    fontWeight: '900',
                    fontFamily: 'monospace',
                    color: 'var(--text-primary)',
                    marginTop: '2px',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {matchedAccount.accountIdentifier}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopyAccount(matchedAccount)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 11px',
                  borderRadius: '8px',
                  border: '1px solid rgba(21, 136, 199, 0.3)',
                  backgroundColor: 'var(--bg-surface)',
                  color: copiedAccId === matchedAccount.id ? '#059669' : 'var(--primary)',
                  fontSize: '11.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {copiedAccId === matchedAccount.id ? <Check size={13} /> : <Copy size={13} />}
                <span>
                  {copiedAccId === matchedAccount.id
                    ? isAr
                      ? 'تم النسخ'
                      : 'Copied'
                    : isAr
                      ? 'نسخ الحساب'
                      : 'Copy'}
                </span>
              </button>
            </div>
          )}

          {/* Discount Coupon Code */}
          {basePrice > 0 && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '6px',
                }}
              >
                {isAr ? 'هل لديك كود خصم؟ (اختياري)' : 'Discount Coupon (Optional)'}
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Ticket
                    size={15}
                    color="var(--text-muted)"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      insetInlineStart: '11px',
                    }}
                  />
                  <input
                    type="text"
                    maxLength={50}
                    dir="ltr"
                    value={couponInput}
                    disabled={Boolean(appliedCoupon)}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    placeholder="SAVE20"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      paddingInlineStart: '34px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: '700',
                      fontFamily: 'monospace',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponInput('');
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(220, 38, 38, 0.3)',
                      backgroundColor: 'rgba(220, 38, 38, 0.08)',
                      color: '#DC2626',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    {isAr ? 'إزالة' : 'Remove'}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!couponInput.trim() || isValidatingCoupon}
                    onClick={handleApplyCoupon}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: !couponInput.trim() || isValidatingCoupon ? 'not-allowed' : 'pointer',
                      opacity: !couponInput.trim() || isValidatingCoupon ? 0.6 : 1,
                    }}
                  >
                    {isValidatingCoupon
                      ? isAr
                        ? 'فحص...'
                        : 'Checking...'
                      : isAr
                        ? 'تطبيق'
                        : 'Apply'}
                  </button>
                )}
              </div>
              {couponError && (
                <div style={{ fontSize: '11.5px', color: '#DC2626', fontWeight: '700', marginTop: '5px' }}>
                  {couponError}
                </div>
              )}
              {appliedCoupon && (
                <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: '800', marginTop: '5px' }}>
                  {isAr
                    ? `تم تطبيق خصم ${appliedCoupon.discountPercent}% (−${discountEgp} ج.م)`
                    : `${appliedCoupon.discountPercent}% discount applied (−${discountEgp} EGP)`}
                </div>
              )}
            </div>
          )}

          {/* Notes / Transfer Reference */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {isAr
                  ? 'رقم المحفظة المحوّل منها / ملاحظات للمعلم (اختياري)'
                  : 'Transfer Reference / Notes (Optional)'}
              </label>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700' }}>
                {notes.length}/500
              </span>
            </div>
            <textarea
              rows={2}
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                isAr
                  ? 'مثال: تم التحويل من رقم 010xxxxxxxx الساعة 5 مساءً'
                  : 'e.g. Transferred from 010xxxxxxxx at 5:00 PM'
              }
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
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

          {/* Price Breakdown */}
          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '12.5px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>{isAr ? 'قيمة المقرر' : 'Course Fee'}</span>
              <strong>
                {basePrice > 0
                  ? `${basePrice} ${isAr ? 'ج.م' : 'EGP'}`
                  : isAr
                    ? 'بموافقة المعلم'
                    : 'Teacher Approval'}
              </strong>
            </div>
            {discountEgp > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: '700' }}>
                <span>{isAr ? 'الخصم' : 'Discount'}</span>
                <span>
                  −{discountEgp} {isAr ? 'ج.م' : 'EGP'}
                </span>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '6px',
                borderTop: '1px dashed var(--border-subtle)',
                fontSize: '14px',
                fontWeight: '900',
                color: 'var(--text-primary)',
              }}
            >
              <span>{isAr ? 'الإجمالي المطلوب' : 'Total Due'}</span>
              <span style={{ color: 'var(--primary)' }}>
                {finalPrice > 0 ? `${finalPrice} ${isAr ? 'ج.م' : 'EGP'}` : isAr ? '0 ج.م' : '0 EGP'}
              </span>
            </div>
          </div>

          {/* Submit Error */}
          {submitError && (
            <div
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid rgba(220, 38, 38, 0.35)',
                color: '#DC2626',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{submitError}</span>
            </div>
          )}

          {/* Footer Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '2px' }}>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                cursor: isSubmitting ? 'wait' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              <ShieldCheck size={15} />
              <span>
                {isSubmitting
                  ? isAr
                    ? 'جاري إرسال الطلب...'
                    : 'Submitting...'
                  : isAr
                    ? 'إرسال طلب الاشتراك'
                    : 'Submit Enrollment Request'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
