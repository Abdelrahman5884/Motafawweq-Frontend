import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Smartphone,
  Store,
  Zap,
  ShieldCheck,
  Loader2,
  Copy,
  UploadCloud,
  Trash2,
  Clock,
  AlertCircle,
  FileText,
  Gift,
  Sparkles,
} from 'lucide-react';

const MAX_RECEIPT_BYTES = 8 * 1024 * 1024; // 8 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];

export const CheckoutModal = ({
  selectedPlan,
  isRtl,
  lang,
  couponCode,
  setCouponCode,
  couponApplied,
  discountPercent,
  discountEgp = null,
  couponError = '',
  isApplyingCoupon = false,
  onClearCoupon,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  isProcessingPayment,
  paymentSuccess,
  paymentResult = null,
  checkoutError = '',
  onApplyCoupon,
  onCompletePayment,
  onClose,
}) => {
  const isAr = lang === 'ar';
  const fileInputRef = useRef(null);
  const copyTimerRef = useRef(null);

  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [senderIpa, setSenderIpa] = useState('');
  const [instaRefNum, setInstaRefNum] = useState('');
  const [fawryRefNum, setFawryRefNum] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState(null);
  const [receiptIsPdf, setReceiptIsPdf] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !isProcessingPayment) onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, [isProcessingPayment, onClose]);

  useEffect(() => {
    return () => {
      if (receiptPreviewUrl) URL.revokeObjectURL(receiptPreviewUrl);
    };
  }, [receiptPreviewUrl]);

  if (!selectedPlan) return null;

  const isFreePromoPlan = Boolean(selectedPlan.isFreePromo);
  const basePrice = isFreePromoPlan ? 0 : Number(selectedPlan.priceEgp || 0);
  const computedDiscount =
    couponApplied && basePrice > 0
      ? discountEgp !== null && discountEgp !== undefined && Number(discountEgp) > 0
        ? Number(discountEgp)
        : Math.round(basePrice * (Number(discountPercent || 0) / 100))
      : 0;
  const finalPrice = Math.max(0, Math.round((basePrice - computedDiscount) * 100) / 100);
  const isFreeActivation = finalPrice <= 0;

  const fawryRefDisplay = `7884 ${String(Math.round(finalPrice)).padStart(4, '0')} 26`;
  const fawryRefRaw = fawryRefDisplay.replace(/\s+/g, '');

  const paymentGateways = [
    {
      id: 'vodafone',
      shortNameAr: 'فودافون كاش',
      shortNameEn: 'Vodafone Cash',
      subAr: 'فودافون، أورنج، اتصالات، وي كاش',
      subEn: 'Vodafone, Orange, Etisalat, WE Cash',
      icon: Smartphone,
    },
    {
      id: 'instapay',
      shortNameAr: 'إنستاباي',
      shortNameEn: 'InstaPay',
      subAr: 'تحويل بنكي لحظي 24/7 عبر الـ IPA',
      subEn: 'Instant Bank Transfer 24/7',
      icon: Zap,
    },
    {
      id: 'fawry',
      shortNameAr: 'فوري باي',
      shortNameEn: 'Fawry Pay',
      subAr: 'الدفع نقداً من أي كشك أو فرع فوري',
      subEn: 'Pay cash at any Fawry retail kiosk',
      icon: Store,
    },
  ];

  const copyToClipboard = (text, key) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedKey(key);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopiedKey(null), 2200);
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_RECEIPT_BYTES) {
      setValidationError(
        isAr
          ? 'حجم ملف الإيصال يتجاوز الحد الأقصى المسموح به (8 ميجابايت).'
          : 'Receipt file exceeds the 8 MB maximum size limit.'
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (file.type && !ACCEPTED_TYPES.includes(file.type) && !isPdf) {
      setValidationError(
        isAr
          ? 'صيغة الإيصال غير مدعومة. يرجى رفع صورة (JPG / PNG / WEBP) أو ملف PDF.'
          : 'Unsupported file format. Please upload JPG, PNG, WEBP, or PDF.'
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (receiptPreviewUrl) URL.revokeObjectURL(receiptPreviewUrl);
    setReceiptFile(file);
    setReceiptIsPdf(isPdf);
    setReceiptPreviewUrl(isPdf ? null : URL.createObjectURL(file));
    setValidationError('');
  };

  const handleRemoveReceipt = () => {
    if (receiptPreviewUrl) URL.revokeObjectURL(receiptPreviewUrl);
    setReceiptPreviewUrl(null);
    setReceiptFile(null);
    setReceiptIsPdf(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resolveActiveTransactionRef = () => {
    if (selectedPaymentMethod === 'vodafone') return transactionId.trim();
    if (selectedPaymentMethod === 'instapay') return instaRefNum.trim();
    return fawryRefNum.trim();
  };

  const handleSubmit = () => {
    setValidationError('');

    if (isFreeActivation) {
      onCompletePayment?.({
        method: 'vodafone',
        senderPhone: '',
        senderIpa: '',
        transactionId: '',
        instaRefNum: '',
        transactionRef: '',
        receiptFile: null,
        hasReceipt: false,
        amountPaid: 0,
      });
      return;
    }

    if (selectedPaymentMethod === 'vodafone') {
      const cleanPhone = senderPhone.replace(/[^0-9]/g, '');
      if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
        setValidationError(
          isAr
            ? 'يرجى إدخال رقم المحفظة المحوّل منها صحيحاً (11 رقماً يبدأ بـ 01).'
            : 'Please enter a valid 11-digit Egyptian mobile wallet number (01xxxxxxxxx).'
        );
        return;
      }
    } else if (selectedPaymentMethod === 'instapay') {
      if (!senderIpa.trim()) {
        setValidationError(
          isAr
            ? 'يرجى كتابة عنوان الدفع المحوّل منه (IPA) لتأكيد العملية.'
            : 'Please enter the sender InstaPay address (IPA).'
        );
        return;
      }
    }

    const activeRef = resolveActiveTransactionRef();
    if (activeRef.length < 3) {
      setValidationError(
        isAr
          ? 'يرجى إدخال كود العملية / الرقم المرجعي للتحويل (3 أحرف على الأقل) ليتم مراجعته من الإدارة.'
          : 'Please enter the transaction reference code (at least 3 characters) for admin verification.'
      );
      return;
    }

    if (!receiptFile) {
      setValidationError(
        isAr
          ? 'يرجى إرفاق صورة أو ملف PDF لوصل الدفع ليتم مراجعته واعتماده من السوبر أدمن.'
          : 'Please attach your payment receipt image or PDF for Super Admin approval.'
      );
      return;
    }

    onCompletePayment?.({
      method: selectedPaymentMethod,
      senderPhone: senderPhone.trim(),
      transactionId: selectedPaymentMethod === 'vodafone' ? activeRef : '',
      senderIpa: senderIpa.trim(),
      instaRefNum: selectedPaymentMethod === 'instapay' ? activeRef : '',
      transactionRef: activeRef,
      receiptFile,
      hasReceipt: true,
      amountPaid: finalPrice,
    });
  };

  const displayError = validationError || checkoutError;
  const requiresApprovalResult = Boolean(paymentResult?.requiresApproval);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 37, 78, 0.78)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={() => !isProcessingPayment && onClose?.()}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '26px',
          maxWidth: '620px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '26px 24px',
          boxShadow: '0 25px 60px rgba(6, 37, 78, 0.35)',
          position: 'relative',
          direction: isRtl ? 'rtl' : 'ltr',
          fontFamily: isRtl
            ? 'var(--font-arabic), "Cairo", system-ui, sans-serif'
            : 'var(--font-heading), "Outfit", sans-serif',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessingPayment}
          aria-label={isAr ? 'إغلاق النافذة' : 'Close modal'}
          style={{
            position: 'absolute',
            top: '20px',
            insetInlineEnd: '20px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
        >
          <X size={17} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '20px', paddingInlineEnd: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            {isFreeActivation ? (
              <Gift size={20} color="#059669" />
            ) : (
              <ShieldCheck size={20} color="var(--primary)" />
            )}
            <h3 style={{ fontSize: '19px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {isFreeActivation
                ? isAr
                  ? 'تفعيل الباقة مجاناً بشكل فوري'
                  : 'Instant Free Plan Activation'
                : isAr
                  ? 'إتمام الاشتراك ورفع وصل الدفع'
                  : 'Complete Checkout & Upload Receipt'}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {isAr ? 'الباقة المختارة:' : 'Selected Plan:'}
            </span>
            <span style={{ fontSize: '13.5px', color: isFreeActivation ? '#059669' : 'var(--primary)', fontWeight: '900' }}>
              {isAr ? selectedPlan.nameAr : selectedPlan.nameEn || selectedPlan.nameAr}
            </span>
            {selectedPlan.periodAr && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: isFreeActivation ? 'rgba(16, 185, 129, 0.12)' : 'rgba(21, 136, 199, 0.1)',
                  color: isFreeActivation ? '#059669' : 'var(--primary)',
                }}
              >
                {isAr ? selectedPlan.periodAr : selectedPlan.periodEn || selectedPlan.periodAr}
              </span>
            )}
          </div>
        </div>

        {/* Free Activation Card vs Paid Receipt Submission Flow */}
        {isFreeActivation ? (
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%)',
              border: '1.5px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '18px',
              padding: '20px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                backgroundColor: '#059669',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '900', color: '#047857', marginBottom: '6px' }}>
                {isAr
                  ? 'تفعيل فوري مجاني — بدون إيصال أو انتظار مراجعة!'
                  : 'Instant Free Activation — No Receipt or Review Needed!'}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                {isFreePromoPlan
                  ? isAr
                    ? 'هذه الباقة مجانية حالياً ضمن عرض مؤقت من إدارة المنصة. اضغط على زر التفعيل بالأسفل وستُفتح جميع مميزاتها لحسابك فوراً.'
                    : 'This plan is currently free under a limited-time platform promotion. Click below to activate immediately.'
                  : isAr
                    ? 'بعد تطبيق كود الخصم أصبح المبلغ المطلوب 0 ج.م، لذلك سيتم تفعيل باقتك فوراً بدون الحاجة لرفع وصل دفع أو انتظار موافقة الإدارة.'
                    : 'Your discount reduced the total to 0 EGP, so your plan activates immediately without receipt review.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Super Admin Verification Notice */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '14px',
                backgroundColor: 'rgba(245, 158, 11, 0.09)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                marginBottom: '16px',
                fontSize: '12.5px',
                color: 'var(--text-primary)',
                lineHeight: 1.55,
                fontWeight: '700',
              }}
            >
              <Clock size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                {isAr
                  ? 'تأكيد الاشتراك عبر السوبر أدمن: بعد التحويل، أدخل كود العملية وأرفق صورة أو PDF لوصل الدفع ليتم مراجعته وتفعيل الباقة.'
                  : 'Super Admin Verification: After transferring, enter the transaction reference code and attach your payment receipt so Super Admin can verify and activate your plan.'}
              </span>
            </div>

            {/* 3 Egyptian Payment Methods */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                }}
              >
                {isAr ? 'اختر وسيلة الدفع المناسبة:' : 'Select Payment Method:'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                {paymentGateways.map((m) => {
                  const IconComponent = m.icon;
                  const isSelected = selectedPaymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedPaymentMethod(m.id);
                        setValidationError('');
                      }}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '16px',
                        backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.08)' : 'var(--bg-app)',
                        border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        textAlign: 'start',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '9px',
                            backgroundColor: isSelected ? 'var(--primary)' : 'rgba(21, 136, 199, 0.1)',
                            color: isSelected ? '#FFFFFF' : 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <IconComponent size={16} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>
                          {isAr ? m.shortNameAr : m.shortNameEn}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                        {isAr ? m.subAr : m.subEn}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gateway Instructions, Required Transaction Code & Required Receipt Upload */}
            <div
              style={{
                backgroundColor: 'var(--bg-app)',
                border: '1.5px solid rgba(21, 136, 199, 0.22)',
                borderRadius: '18px',
                padding: '18px 20px',
                marginBottom: '18px',
              }}
            >
              {selectedPaymentMethod === 'vodafone' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>
                      {isAr ? 'رقم محفظة المنصة المعتمد:' : 'Official Platform Wallet Number:'}
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        color: 'var(--primary)',
                        backgroundColor: 'rgba(21, 136, 199, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {isAr ? 'فودافون • أورنج • اتصالات • وي' : 'All Egyptian Wallets'}
                    </span>
                  </div>

                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '18px',
                        fontWeight: '900',
                        color: 'var(--primary)',
                        letterSpacing: '1px',
                      }}
                    >
                      010-9876-5432
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('01098765432', 'voda-num')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-medium)',
                        backgroundColor: 'var(--bg-app)',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {copiedKey === 'voda-num' ? <CheckCircle2 size={13} color="var(--primary)" /> : <Copy size={13} />}
                      <span>{copiedKey === 'voda-num' ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ الرقم' : 'Copy'}</span>
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                      gap: '12px',
                      marginBottom: '14px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: '800',
                          color: 'var(--text-primary)',
                          marginBottom: '5px',
                        }}
                      >
                        {isAr ? 'رقم المحفظة المحوّل منها:' : 'Sender Wallet Number:'}{' '}
                        <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <input
                        type="tel"
                        maxLength={11}
                        placeholder="010xxxxxxxx"
                        value={senderPhone}
                        onChange={(e) => {
                          setSenderPhone(e.target.value);
                          setValidationError('');
                        }}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--bg-surface)',
                          border: '1.5px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          fontFamily: 'monospace',
                          fontWeight: '700',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: '800',
                          color: 'var(--text-primary)',
                          marginBottom: '5px',
                        }}
                      >
                        {isAr ? 'كود العملية / الرقم المرجعي:' : 'Transaction Code:'}{' '}
                        <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="TXN-491029"
                        value={transactionId}
                        onChange={(e) => {
                          setTransactionId(e.target.value);
                          setValidationError('');
                        }}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--bg-surface)',
                          border: '1.5px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          fontFamily: 'monospace',
                          fontWeight: '700',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'instapay' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>
                      {isAr ? 'عنوان إنستاباي الرسمي (IPA):' : 'Official InstaPay Address (IPA):'}
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        color: 'var(--primary)',
                        backgroundColor: 'rgba(21, 136, 199, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      IPN 24/7
                    </span>
                  </div>

                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: '900', color: 'var(--primary)' }}>
                      motafawweq@instapay
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('motafawweq@instapay', 'ipa-addr')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-medium)',
                        backgroundColor: 'var(--bg-app)',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {copiedKey === 'ipa-addr' ? <CheckCircle2 size={13} color="var(--primary)" /> : <Copy size={13} />}
                      <span>{copiedKey === 'ipa-addr' ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ العنوان' : 'Copy'}</span>
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                      gap: '12px',
                      marginBottom: '14px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: '800',
                          color: 'var(--text-primary)',
                          marginBottom: '5px',
                        }}
                      >
                        {isAr ? 'عنوان الدفع المحوّل منه (IPA):' : 'Sender IPA:'}{' '}
                        <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="name@instapay"
                        value={senderIpa}
                        onChange={(e) => {
                          setSenderIpa(e.target.value);
                          setValidationError('');
                        }}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--bg-surface)',
                          border: '1.5px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: '800',
                          color: 'var(--text-primary)',
                          marginBottom: '5px',
                        }}
                      >
                        {isAr ? 'كود العملية / الرقم المرجعي (RRN):' : 'Transaction Reference (RRN):'}{' '}
                        <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={40}
                        placeholder="948102847123"
                        value={instaRefNum}
                        onChange={(e) => {
                          setInstaRefNum(e.target.value);
                          setValidationError('');
                        }}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--bg-surface)',
                          border: '1.5px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          fontFamily: 'monospace',
                          fontWeight: '700',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'fawry' && (
                <div style={{ marginBottom: '14px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>
                      {isAr ? 'كود السداد لدى فوري (كود الخدمة 788):' : 'Fawry Service Code (788):'}
                    </div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        fontWeight: '800',
                        color: 'var(--primary)',
                        backgroundColor: 'rgba(21, 136, 199, 0.1)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      <Clock size={12} />
                      <span>{isAr ? 'صالح 48 ساعة' : 'Valid 48h'}</span>
                    </span>
                  </div>

                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '2px dashed var(--primary)',
                      borderRadius: '14px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '20px',
                        fontWeight: '900',
                        color: 'var(--primary)',
                        letterSpacing: '1.5px',
                      }}
                    >
                      {fawryRefDisplay}
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(fawryRefRaw, 'fawry-code')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 14px',
                        borderRadius: '10px',
                        border: '1px solid var(--primary)',
                        backgroundColor: 'rgba(21, 136, 199, 0.08)',
                        color: 'var(--primary)',
                        fontSize: '12px',
                        fontWeight: '900',
                        cursor: 'pointer',
                      }}
                    >
                      {copiedKey === 'fawry-code' ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                      <span>{copiedKey === 'fawry-code' ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ الكود' : 'Copy Code'}</span>
                    </button>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        marginBottom: '5px',
                      }}
                    >
                      {isAr ? 'كود العملية من إيصال فوري:' : 'Fawry Receipt Reference Code:'}{' '}
                      <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="FWR-9823410"
                      value={fawryRefNum}
                      onChange={(e) => {
                        setFawryRefNum(e.target.value);
                        setValidationError('');
                      }}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1.5px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        fontWeight: '700',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* REQUIRED Payment Receipt Upload (ALL Payment Methods) */}
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
                  {isAr ? 'وصل الدفع (صورة واضحة أو ملف PDF):' : 'Payment Receipt (Image or PDF):'}{' '}
                  <span style={{ color: '#DC2626' }}>*</span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleReceiptUpload}
                  style={{ display: 'none' }}
                />

                {receiptFile ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      backgroundColor: 'var(--bg-surface)',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: '1.5px solid rgba(16, 185, 129, 0.45)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      {receiptIsPdf ? (
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#DC2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <FileText size={20} />
                        </div>
                      ) : (
                        <img
                          src={receiptPreviewUrl}
                          alt="Receipt"
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                        />
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '12.5px',
                            fontWeight: '800',
                            color: 'var(--text-primary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {receiptFile.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>
                          {(receiptFile.size / 1024).toFixed(0)} KB • {isAr ? 'جاهز للرفع والمراجعة' : 'Ready for review'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveReceipt}
                      aria-label={isAr ? 'حذف الإيصال' : 'Remove receipt'}
                      style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: '8px',
                        color: '#DC2626',
                        cursor: 'pointer',
                        padding: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '100%',
                      padding: '14px 12px',
                      borderRadius: '12px',
                      border: '1.5px dashed var(--primary)',
                      backgroundColor: 'var(--bg-surface)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '800', color: 'var(--primary)' }}>
                      <UploadCloud size={17} />
                      <span>{isAr ? 'اضغط لإرفاق صورة وصل الدفع أو PDF (إلزامي)' : 'Upload payment receipt image or PDF (Required)'}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                      {isAr ? 'JPG, PNG, WEBP أو PDF — بحد أقصى 8 ميجابايت' : 'JPG, PNG, WEBP, or PDF — up to 8 MB'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Validation / Server Error */}
        {displayError && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '16px',
              fontSize: '12.5px',
              fontWeight: '800',
              color: '#DC2626',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{displayError}</span>
          </div>
        )}

        {/* Promo Coupon Form (only when plan base price > 0) */}
        {basePrice > 0 && (
          <form onSubmit={onApplyCoupon} style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                marginBottom: '6px',
              }}
            >
              {isAr ? 'هل لديك كود خصم؟' : 'Have a Discount Coupon?'}
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder={isAr ? 'أدخل كود الخصم' : 'Enter coupon code'}
                value={couponCode}
                disabled={couponApplied || isApplyingCoupon}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-app)',
                  border: '1.5px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  fontWeight: '800',
                  outline: 'none',
                }}
              />
              {couponApplied && onClearCoupon ? (
                <button
                  type="button"
                  onClick={onClearCoupon}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12.5px',
                    fontWeight: '800',
                    cursor: 'pointer',
                  }}
                >
                  {isAr ? 'إلغاء' : 'Remove'}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isApplyingCoupon || !String(couponCode || '').trim()}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '900',
                    cursor: isApplyingCoupon ? 'wait' : 'pointer',
                    opacity: !String(couponCode || '').trim() ? 0.6 : 1,
                  }}
                >
                  {isApplyingCoupon ? (isAr ? 'جاري التحقق...' : 'Checking...') : isAr ? 'تطبيق' : 'Apply'}
                </button>
              )}
            </div>

            {couponError && (
              <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: '700', marginTop: '6px' }}>
                {couponError}
              </div>
            )}

            {couponApplied && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: 'var(--primary)',
                  fontWeight: '800',
                  marginTop: '8px',
                }}
              >
                <CheckCircle2 size={14} color="var(--primary)" />
                <span>
                  {isAr
                    ? `تم تطبيق خصم ${discountPercent}% (توفير ${computedDiscount.toLocaleString()} ج.م)`
                    : `${discountPercent}% discount applied (Saved ${computedDiscount.toLocaleString()} EGP)`}
                </span>
              </div>
            )}
          </form>
        )}

        {/* Total Summary */}
        <div
          style={{
            backgroundColor: 'var(--bg-app)',
            padding: '14px 18px',
            borderRadius: '16px',
            marginBottom: '18px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>
              {isFreeActivation
                ? isAr
                  ? 'المبلغ المطلوب (عرض مجاني):'
                  : 'Total Due (Free Offer):'
                : isAr
                  ? 'المبلغ الصافي المطلوب سداده:'
                  : 'Total Amount Due:'}
            </div>
            {computedDiscount > 0 && (
              <div style={{ fontSize: '11.5px', color: 'var(--primary)', fontWeight: '800', marginTop: '2px' }}>
                {isAr
                  ? `السعر الأصلي ${basePrice.toLocaleString()} ج.م — خصم ${computedDiscount.toLocaleString()} ج.م`
                  : `Base ${basePrice.toLocaleString()} EGP — Discount ${computedDiscount.toLocaleString()} EGP`}
              </div>
            )}
            {isFreePromoPlan && Number(selectedPlan.originalPriceEgp || 0) > 0 && (
              <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: '800', marginTop: '2px' }}>
                {isAr
                  ? `بدلاً من ${Number(selectedPlan.originalPriceEgp).toLocaleString()} ج.م (خصم 100%)`
                  : `Was ${Number(selectedPlan.originalPriceEgp).toLocaleString()} EGP (100% Off)`}
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: '25px',
              fontWeight: '900',
              color: isFreeActivation ? '#059669' : 'var(--primary)',
              letterSpacing: '-0.5px',
            }}
          >
            {isFreeActivation
              ? isAr
                ? 'مجاناً (0 ج.م)'
                : 'Free (0 EGP)'
              : `${finalPrice.toLocaleString()} ${isAr ? 'ج.م' : 'EGP'}`}
          </div>
        </div>

        {/* Confirm Action */}
        {paymentSuccess ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '15px',
              borderRadius: '16px',
              backgroundColor: requiresApprovalResult ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              color: requiresApprovalResult ? '#B45309' : '#059669',
              fontSize: '13.5px',
              fontWeight: '900',
              border: `1px solid ${requiresApprovalResult ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            {requiresApprovalResult ? <Clock size={20} style={{ flexShrink: 0 }} /> : <CheckCircle2 size={20} style={{ flexShrink: 0 }} />}
            <span>
              {requiresApprovalResult
                ? isAr
                  ? 'تم إرسال وصل الدفع وكود العملية بنجاح! بانتظار مراجعة واعتماد السوبر أدمن لتفعيل الباقة.'
                  : 'Receipt & transaction code submitted! Pending Super Admin approval to activate your plan.'
                : isAr
                  ? 'تم تفعيل الباقة مجاناً بنجاح فوراً!'
                  : 'Plan Activated Free Instantly!'}
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessingPayment}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '16px',
              backgroundColor: isFreeActivation ? '#059669' : 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14.5px',
              fontWeight: '900',
              cursor: isProcessingPayment ? 'wait' : 'pointer',
              boxShadow: isFreeActivation
                ? '0 8px 22px rgba(5, 150, 105, 0.32)'
                : '0 8px 22px rgba(21, 136, 199, 0.32)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isProcessingPayment ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>
                  {isFreeActivation
                    ? isAr
                      ? 'جاري تفعيل الباقة مجاناً...'
                      : 'Activating free plan...'
                    : isAr
                      ? 'جاري رفع وصل الدفع وإرسال الطلب...'
                      : 'Uploading receipt & submitting request...'}
                </span>
              </>
            ) : (
              <>
                {isFreeActivation ? <Gift size={18} /> : <ShieldCheck size={18} />}
                <span>
                  {isFreeActivation
                    ? isAr
                      ? 'تفعيل الباقة مجاناً الآن'
                      : 'Activate Free Plan Now'
                    : isAr
                      ? 'إرسال وصل الدفع وكود العملية للمراجعة'
                      : 'Submit Receipt & Code for Review'}
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
