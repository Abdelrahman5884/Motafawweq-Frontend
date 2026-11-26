/**
 * Builds the subscription submission payload for Student, Teacher, and Center billing endpoints.
 * Uses multipart FormData whenever a payment receipt file is attached, and clean JSON otherwise
 * (e.g. temporary free promotions or 100% discount coupons).
 */
export function buildSubscriptionPayload({
  planTier,
  billingPeriod,
  paymentMethod,
  couponCode,
  senderPhone,
  senderIpa,
  transactionRef,
  receiptFile,
}) {
  const cleanCoupon = typeof couponCode === 'string' && couponCode.trim() ? couponCode.trim() : null;
  const cleanPhone = typeof senderPhone === 'string' && senderPhone.trim() ? senderPhone.trim() : null;
  const cleanIpa = typeof senderIpa === 'string' && senderIpa.trim() ? senderIpa.trim() : null;
  const cleanRef = typeof transactionRef === 'string' && transactionRef.trim() ? transactionRef.trim() : null;

  if (receiptFile instanceof File) {
    const formData = new FormData();
    formData.append('plan_tier', planTier || 'plus');
    formData.append('billing_period', billingPeriod || 'monthly');
    if (paymentMethod) formData.append('payment_method', paymentMethod);
    if (cleanCoupon) formData.append('coupon_code', cleanCoupon);
    if (cleanPhone) formData.append('sender_phone', cleanPhone);
    if (cleanIpa) formData.append('sender_ipa', cleanIpa);
    if (cleanRef) formData.append('transaction_ref', cleanRef);
    formData.append('receipt', receiptFile);
    return formData;
  }

  return {
    plan_tier: planTier || 'plus',
    billing_period: billingPeriod || 'monthly',
    payment_method: paymentMethod || 'vodafone',
    coupon_code: cleanCoupon,
    sender_phone: cleanPhone,
    sender_ipa: cleanIpa,
    transaction_ref: cleanRef,
  };
}
