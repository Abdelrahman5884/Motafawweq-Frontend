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
} from 'lucide-react';

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
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptFileName, setReceiptFileName] = useState('');
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
      if (receiptImage) URL.revokeObjectURL(receiptImage);
    };
  }, [receiptImage]);

  if (!selectedPlan) return null;

  const basePrice = Number(selectedPlan.priceEgp || 0);
  const computedDiscount = couponApplied
    ? discountEgp !== null && discountEgp !== undefined && Number(discountEgp) > 0
      ? Number(discountEgp)
      : Math.round(basePrice * (Number(discountPercent || 0) / 100))
    : 0;
  const finalPrice = Math.max(0, Math.round((basePrice - computedDiscount) * 100) / 100);

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
    if (receiptImage) URL.revokeObjectURL(receiptImage);
    setReceiptFileName(file.name);
    setReceiptImage(URL.createObjectURL(file));
    setValidationError('');
  };

  const handleRemoveReceipt = () => {
    if (receiptImage) URL.revokeObjectURL(receiptImage);
    setReceiptImage(null);
    setReceiptFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    setValidationError('');

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
      if (!senderIpa.trim() && !instaRefNum.trim()) {
        setValidationError(
          isAr
            ? 'يرجى كتابة عنوان الدفع (IPA) أو الرقم المرجعي للتحويل لتأكيد العملية.'
            : 'Please enter your InstaPay IPA or transaction reference number.'
        );
        return;
      }
    }

    onCompletePayment?.({
      method: selectedPaymentMethod,
      senderPhone: senderPhone.trim(),
      transactionId: transactionId.trim(),
      senderIpa: senderIpa.trim(),
      instaRefNum: instaRefNum.trim(),
      hasReceipt: Boolean(receiptImage),
      amountPaid: finalPrice,
    });
  };

  const displayError = validationError || checkoutError;

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
          maxWidth: '600px',
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
            <ShieldCheck size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '19px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {isAr ? 'إتمام الاشتراك وتفعيل الباقة' : 'Complete Subscription Checkout'}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {isAr ? 'الباقة المختارة:' : 'Selected Plan:'}
            </span>
            <span style={{ fontSize: '13.5px', color: 'var(--primary)', fontWeight: '900' }}>
              {isAr ? selectedPlan.nameAr : selectedPlan.nameEn || selectedPlan.nameAr}
            </span>
            {selectedPlan.periodAr && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(21, 136, 199, 0.1)',
                  color: 'var(--primary)',
                }}
              >
                {isAr ? selectedPlan.periodAr : selectedPlan.periodEn || selectedPlan.periodAr}
              </span>
            )}
          </div>
        </div>

        {/* 3 Egyptian Payment Methods */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
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

        {/* Gateway Instructions & Fields */}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>
                  {isAr ? 'رقم محفظة المنصة المعتمد:' : 'Official Platform Wallet Number:'}
                </div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', backgroundColor: 'rgba(21, 136, 199, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
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
                <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: '900', color: 'var(--primary)', letterSpacing: '1px' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                    {isAr ? 'رقم المحفظة المحوّل منها:' : 'Sender Wallet Number:'} <span style={{ color: 'var(--primary)' }}>*</span>
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                    {isAr ? 'رقم العملية (اختياري):' : 'Transaction Ref (Optional):'}
                  </label>
                  <input
                    type="text"
                    placeholder="TXN-491029"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
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
              </div>
            </div>
          )}

          {selectedPaymentMethod === 'instapay' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>
                  {isAr ? 'عنوان إنستاباي الرسمي (IPA):' : 'Official InstaPay Address (IPA):'}
                </div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', backgroundColor: 'rgba(21, 136, 199, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                    {isAr ? 'عنوان الدفع المحوّل منه (IPA):' : 'Sender IPA:'} <span style={{ color: 'var(--primary)' }}>*</span>
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                    {isAr ? 'الرقم المرجعي (RRN):' : 'Reference (RRN):'}
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="948102847123"
                    value={instaRefNum}
                    onChange={(e) => setInstaRefNum(e.target.value)}
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
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {selectedPaymentMethod === 'fawry' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>
                  {isAr ? 'كود الدفع المرجعي لدى فوري (كود الخدمة 788):' : 'Fawry Reference Code (Service 788):'}
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '800', color: 'var(--primary)', backgroundColor: 'rgba(21, 136, 199, 0.1)', padding: '3px 8px', borderRadius: '6px' }}>
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
                }}
              >
                <div style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: '900', color: 'var(--primary)', letterSpacing: '1.5px' }}>
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
            </div>
          )}

          {/* Optional Receipt Screenshot (Vodafone / InstaPay) */}
          {selectedPaymentMethod !== 'fawry' && (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleReceiptUpload}
                style={{ display: 'none' }}
              />
              {receiptImage ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--bg-surface)',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={receiptImage} alt="Receipt" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} />
                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {receiptFileName || 'receipt.png'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveReceipt}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
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
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1.5px dashed var(--border-medium)',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    fontSize: '12px',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                  }}
                >
                  <UploadCloud size={15} />
                  <span>{isAr ? 'إرفاق صورة إيصال التحويل (اختياري)' : 'Attach receipt screenshot (optional)'}</span>
                </button>
              )}
            </div>
          )}
        </div>

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

        {/* Promo Coupon Form */}
        <form onSubmit={onApplyCoupon} style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--primary)', fontWeight: '800', marginTop: '8px' }}>
              <CheckCircle2 size={14} color="var(--primary)" />
              <span>
                {isAr
                  ? `تم تطبيق خصم ${discountPercent}% (توفير ${computedDiscount.toLocaleString()} ج.م)`
                  : `${discountPercent}% discount applied (Saved ${computedDiscount.toLocaleString()} EGP)`}
              </span>
            </div>
          )}
        </form>

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
              {isAr ? 'المبلغ الصافي المطلوب سداده:' : 'Total Amount Due:'}
            </div>
            {computedDiscount > 0 && (
              <div style={{ fontSize: '11.5px', color: 'var(--primary)', fontWeight: '800', marginTop: '2px' }}>
                {isAr
                  ? `السعر الأصلي ${basePrice.toLocaleString()} ج.م — خصم ${computedDiscount.toLocaleString()} ج.م`
                  : `Base ${basePrice.toLocaleString()} EGP — Discount ${computedDiscount.toLocaleString()} EGP`}
              </div>
            )}
          </div>
          <div style={{ fontSize: '25px', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-0.5px' }}>
            {finalPrice.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
          </div>
        </div>

        {/* Confirm Action */}
        {paymentSuccess ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              borderRadius: '16px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              color: 'var(--success, #059669)',
              fontSize: '14px',
              fontWeight: '900',
              border: '1px solid rgba(16, 185, 129, 0.35)',
            }}
          >
            <CheckCircle2 size={20} />
            <span>{isAr ? 'تم تفعيل الباقة وإصدار الفاتورة بنجاح!' : 'Plan Activated & Invoice Issued!'}</span>
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
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14.5px',
              fontWeight: '900',
              cursor: isProcessingPayment ? 'wait' : 'pointer',
              boxShadow: '0 8px 22px rgba(21, 136, 199, 0.32)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isProcessingPayment ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>{isAr ? 'جاري تفعيل الباقة وإصدار الفاتورة...' : 'Activating subscription...'}</span>
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>
                  {isAr
                    ? selectedPaymentMethod === 'fawry'
                      ? 'تأكيد السداد لدى فوري وتفعيل الباقة'
                      : 'تأكيد السداد وتفعيل الباقة فوراً'
                    : 'Confirm Payment & Activate'}
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
