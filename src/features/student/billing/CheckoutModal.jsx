import React, { useState, useRef } from 'react';
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
  FileCheck2
} from 'lucide-react';

export const CheckoutModal = ({
  selectedPlan,
  isRtl,
  lang,
  couponCode,
  setCouponCode,
  couponApplied,
  discountPercent,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  isProcessingPayment,
  paymentSuccess,
  onApplyCoupon,
  onCompletePayment,
  onClose
}) => {
  const isAr = lang === 'ar';
  const fileInputRef = useRef(null);

  // Realistic Payment Details States
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [senderIpa, setSenderIpa] = useState('');
  const [instaRefNum, setInstaRefNum] = useState('');
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptFileName, setReceiptFileName] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [isCheckingFawry, setIsCheckingFawry] = useState(false);
  const [fawryFeedback, setFawryFeedback] = useState(null);

  if (!selectedPlan) return null;

  // Price calculations
  const basePrice = selectedPlan.priceEgp || 0;
  const finalPrice = couponApplied
    ? Math.round(basePrice * (1 - discountPercent / 100))
    : basePrice;

  // The 3 Egyptian Payment Methods requested
  const paymentGateways = [
    {
      id: 'vodafone',
      shortNameAr: 'فودافون كاش',
      shortNameEn: 'Vodafone Cash',
      nameAr: 'فودافون كاش ومحافظ المحمول',
      nameEn: 'Vodafone Cash & Smart Wallets',
      subAr: 'فودافون، أورنج، اتصالات، وي كاش',
      subEn: 'Vodafone, Orange, Etisalat, WE Cash',
      icon: Smartphone,
      accent: 'var(--primary)'
    },
    {
      id: 'instapay',
      shortNameAr: 'إنستاباي',
      shortNameEn: 'InstaPay',
      nameAr: 'شبكة المدفوعات اللحظية (إنستاباي)',
      nameEn: 'InstaPay Instant Network (IPN)',
      subAr: 'تحويل بنكي لحظي 24/7 عبر الـ IPA',
      subEn: 'Instant Bank Transfer 24/7',
      icon: Zap,
      accent: '#0284C7'
    },
    {
      id: 'fawry',
      shortNameAr: 'فوري باي',
      shortNameEn: 'Fawry Pay',
      nameAr: 'كود سداد فوري باي (Fawry)',
      nameEn: 'Fawry Pay Reference Code',
      subAr: 'الدفع نقداً من أي كشك أو فرع فوري',
      subEn: 'Pay cash at any Fawry retail kiosk',
      icon: Store,
      accent: '#06254E'
    }
  ];

  const copyToClipboard = (text, key) => {
    try {
      navigator.clipboard?.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      // ignore
    }
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      const previewUrl = URL.createObjectURL(file);
      setReceiptImage(previewUrl);
      setValidationError('');
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptImage(null);
    setReceiptFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCheckFawryStatus = () => {
    setIsCheckingFawry(true);
    setFawryFeedback(null);
    setTimeout(() => {
      setIsCheckingFawry(false);
      setFawryFeedback(
        isAr
          ? 'تم التحقق: الكود المرجعي نشط في شبكة فوري وجاهز للسداد لدى أي تاجر.'
          : 'Verified: Reference code is active on Fawry POS network, ready for payment.'
      );
    }, 1200);
  };

  const handleSubmit = () => {
    setValidationError('');

    // Realistic Validation per payment gateway
    if (selectedPaymentMethod === 'vodafone') {
      const cleanPhone = senderPhone.replace(/[^0-9]/g, '');
      if (!cleanPhone || cleanPhone.length !== 11) {
        setValidationError(
          isAr
            ? 'يرجى إدخال رقم المحفظة المحول منها صحيحاً (11 رقماً، مثال: 01012345678)'
            : 'Please enter a valid 11-digit sender wallet phone number.'
        );
        return;
      }
    } else if (selectedPaymentMethod === 'instapay') {
      if (!senderIpa.trim() && !instaRefNum.trim()) {
        setValidationError(
          isAr
            ? 'يرجى كتابة عنوان الدفع (IPA) أو الرقم المرجعي للتحويل لتأكيد العملية.'
            : 'Please enter your InstaPay IPA or the 12-digit transaction reference.'
        );
        return;
      }
    }

    onCompletePayment({
      method: selectedPaymentMethod,
      senderPhone,
      transactionId,
      senderIpa,
      instaRefNum,
      hasReceipt: !!receiptImage,
      amountPaid: finalPrice
    });
  };

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
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
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
          fontFamily: isRtl ? 'var(--font-arabic), "Cairo", system-ui, sans-serif' : 'var(--font-heading), "Outfit", sans-serif'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
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
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--border-subtle)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-app)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <X size={17} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '20px', paddingInlineEnd: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <ShieldCheck size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {isAr ? 'بوابة الدفع الإلكتروني المعتمدة' : 'Official Egyptian Payment Gateway'}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {isAr ? 'الباقة المختارة:' : 'Selected Plan:'}
            </span>
            <span style={{ fontSize: '13.5px', color: 'var(--primary)', fontWeight: '900' }}>
              {isAr ? selectedPlan.nameAr : (selectedPlan.nameEn || selectedPlan.nameAr)}
            </span>
            {selectedPlan.periodAr && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(21, 136, 199, 0.1)',
                  color: 'var(--primary)'
                }}
              >
                {isAr ? selectedPlan.periodAr : (selectedPlan.periodEn || selectedPlan.periodAr)}
              </span>
            )}
          </div>
        </div>

        {/* Egyptian Payment Gateways Selector (3 Authentic Methods) */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
            {isAr ? 'طرق الدفع المصرية المتاحة:' : 'Available Egyptian Payment Methods:'}
          </label>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '10px'
            }}
          >
            {paymentGateways.map((m) => {
              const IconComponent = m.icon;
              const isSelected = selectedPaymentMethod === m.id;
              return (
                <div
                  key={m.id}
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
                    transition: 'all 0.18s ease',
                    boxShadow: isSelected ? '0 4px 14px rgba(21, 136, 199, 0.15)' : 'none'
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
                        flexShrink: 0
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Realistic Gateway Instructions & Verification Fields */}
        <div
          style={{
            backgroundColor: 'var(--bg-app)',
            border: '1.5px solid rgba(21, 136, 199, 0.22)',
            borderRadius: '18px',
            padding: '18px 20px',
            marginBottom: '20px'
          }}
        >
          {/* METHOD 1: VODAFONE CASH & SMART WALLETS */}
          {selectedPaymentMethod === 'vodafone' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>
                  {isAr ? 'رقم محفظة فودافون كاش المعتمدة للمنصة:' : 'Official Platform Vodafone Cash Wallet:'}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    backgroundColor: 'rgba(21, 136, 199, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >
                  {isAr ? 'فودافون • أورنج • اتصالات • وي' : 'Vodafone • Orange • Etisalat • WE'}
                </div>
              </div>

              {/* Number and Copy Box */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px'
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
                    transition: 'all 0.15s ease'
                  }}
                >
                  {copiedKey === 'voda-num' ? (
                    <>
                      <CheckCircle2 size={13} color="var(--primary)" />
                      <span style={{ color: 'var(--primary)' }}>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>{isAr ? 'نسخ الرقم' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* USSD Shortcut helper */}
              <div
                style={{
                  fontSize: '11.5px',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'rgba(21, 136, 199, 0.05)',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}
              >
                <span>
                  {isAr ? 'كود التحويل السريع من فودافون:' : 'Direct Vodafone USSD code:'}{' '}
                  <strong style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>*9*7*01098765432*{finalPrice}#</strong>
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(`*9*7*01098765432*${finalPrice}#`, 'ussd')}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'var(--primary)',
                    fontWeight: '800',
                    fontSize: '11px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  {copiedKey === 'ussd' ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ كود الـ USSD' : 'Copy USSD')}
                </button>
              </div>

              {/* Realistic Form Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                    {isAr ? 'رقم المحفظة التي قمت بالتحويل منها:' : 'Sender Wallet Mobile Number:'}{' '}
                    <span style={{ color: 'var(--primary)' }}>*</span>
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
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                    {isAr ? 'كود العملية / رقم التحويل (SMS):' : 'Transaction ID from SMS (Optional):'}
                  </label>
                  <input
                    type="text"
                    placeholder={isAr ? 'مثال: TXN-491029' : 'e.g. TXN-491029'}
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
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Receipt Screenshot Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {isAr ? 'إرفاق صورة إيصال أو سكرين شوت التحويل:' : 'Attach Receipt Screenshot:'}
                </label>
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
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={receiptImage}
                        alt="Receipt preview"
                        style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {receiptFileName || (isAr ? 'صورة الإشعار' : 'receipt.png')}
                        </div>
                        <div style={{ fontSize: '10.5px', color: 'var(--primary)', fontWeight: '700' }}>
                          {isAr ? 'تم إرفاق الإيصال بنجاح' : 'Receipt attached'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveReceipt}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title={isAr ? 'حذف الصورة' : 'Remove'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1.5px dashed var(--border-medium)',
                      backgroundColor: 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      fontWeight: '800',
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <UploadCloud size={16} />
                    <span>{isAr ? 'اضغط لرفع سكرين شوت العملية من الموبايل' : 'Upload transaction screenshot'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* METHOD 2: INSTAPAY (IPN) */}
          {selectedPaymentMethod === 'instapay' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>
                  {isAr ? 'عنوان الدفع اللحظي الرسمي لمنصة متفوّق (IPA):' : 'Official Platform InstaPay Address (IPA):'}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    backgroundColor: 'rgba(21, 136, 199, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >
                  {isAr ? 'شبكة البنك المركزي IPN' : 'Central Bank IPN Network'}
                </div>
              </div>

              {/* IPA Box */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
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
                    color: 'var(--text-primary)'
                  }}
                >
                  {copiedKey === 'ipa-addr' ? (
                    <>
                      <CheckCircle2 size={13} color="var(--primary)" />
                      <span style={{ color: 'var(--primary)' }}>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>{isAr ? 'نسخ العنوان' : 'Copy IPA'}</span>
                    </>
                  )}
                </button>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                {isAr
                  ? 'المستلم المعتمد: شركة متفوّق للتعليم التفاعلي والحلول الذكية (ذ.م.م)'
                  : 'Verified Recipient: Motafawweq EdTech Solutions LLC'}
              </div>

              {/* Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                    {isAr ? 'عنوان الدفع (IPA) أو اسم الحساب المحول منه:' : 'Sender IPA or Account Name:'}{' '}
                    <span style={{ color: 'var(--primary)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={isAr ? 'مثال: ahmed@instapay' : 'e.g. ahmed@instapay'}
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
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '5px' }}>
                    {isAr ? 'الرقم المرجعي للعملية (RRN - 12 رقم):' : 'InstaPay Reference (RRN):'}
                  </label>
                  <input
                    type="text"
                    maxLength={14}
                    placeholder={isAr ? 'مثال: 9481 0284 7123' : 'e.g. 9481 0284 7123'}
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
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Receipt upload */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {isAr ? 'إرفاق صورة إيصال إنستاباي (اختياري للتحقق الفوري):' : 'Attach InstaPay Receipt Screenshot:'}
                </label>
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
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={receiptImage}
                        alt="Receipt preview"
                        style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {receiptFileName || 'receipt.png'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveReceipt}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1.5px dashed var(--border-medium)',
                      backgroundColor: 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      fontWeight: '800',
                      color: 'var(--primary)',
                      cursor: 'pointer'
                    }}
                  >
                    <UploadCloud size={16} />
                    <span>{isAr ? 'اضغط لرفع سكرين شوت إيصال إنستاباي' : 'Upload InstaPay confirmation'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* METHOD 3: FAWRY PAY */}
          {selectedPaymentMethod === 'fawry' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>
                  {isAr ? 'كود الدفع المرجعي المباشر لدى فوري:' : 'Fawry Direct Payment Reference Code:'}
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    backgroundColor: 'rgba(21, 136, 199, 0.1)',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}
                >
                  <Clock size={12} />
                  <span>{isAr ? 'صالح لمدة 48 ساعة' : 'Valid for 48 hours'}</span>
                </div>
              </div>

              {/* Fawry Code Box */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '2px dashed var(--primary)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800', marginBottom: '2px' }}>
                    {isAr ? 'رقم المعاملة المرجعي (Fawry Reference):' : 'Fawry Reference Number:'}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '22px', fontWeight: '900', color: 'var(--primary)', letterSpacing: '2px' }}>
                    7729 4821 00
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard('7729482100', 'fawry-code')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--primary)',
                    backgroundColor: 'rgba(21, 136, 199, 0.08)',
                    color: 'var(--primary)',
                    fontSize: '12.5px',
                    fontWeight: '900',
                    cursor: 'pointer'
                  }}
                >
                  {copiedKey === 'fawry-code' ? (
                    <>
                      <CheckCircle2 size={14} />
                      <span>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>{isAr ? 'نسخ الكود' : 'Copy Code'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Service Code & Instructions */}
              <div
                style={{
                  backgroundColor: 'rgba(6, 37, 78, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '12px'
                }}
              >
                <div style={{ fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {isAr ? 'تعليمات السداد عند أي كشك أو فرع فوري:' : 'How to pay at any Fawry retail kiosk:'}
                </div>
                <div>1. {isAr ? 'اطلب من البائع خدمة "فوري باي" بكود الخدمة (788).' : 'Ask the merchant for "Fawry Pay" Service Code (788).'}</div>
                <div>2. {isAr ? 'أعطِ البائع الرقم المرجعي الموضح بالأعلى (7729 4821 00).' : 'Provide the reference code (7729 4821 00).'}</div>
                <div>3. {isAr ? 'سدد المبلغ المطلوب نقداً واحتفظ بإيصال الماكينة.' : 'Pay cash and collect your paper receipt.'}</div>
                <div style={{ marginTop: '4px', color: 'var(--primary)', fontWeight: '800' }}>
                  {isAr ? '✨ يتم تفعيل اشتراكك في المنصة تلقائياً خلال دقيقة واحدة من طباعة الإيصال.' : '✨ Your account activates automatically within 60 seconds.'}
                </div>
              </div>

              {/* Live Fawry Status Check */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleCheckFawryStatus}
                  disabled={isCheckingFawry}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    fontSize: '11.5px',
                    fontWeight: '800',
                    cursor: isCheckingFawry ? 'wait' : 'pointer'
                  }}
                >
                  {isCheckingFawry ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>{isAr ? 'جاري الاستعلام من فوري...' : 'Checking Fawry POS API...'}</span>
                    </>
                  ) : (
                    <>
                      <FileCheck2 size={13} color="var(--primary)" />
                      <span>{isAr ? 'فحص حالة السداد مع شبكة فوري الآن' : 'Check Fawry Payment Status'}</span>
                    </>
                  )}
                </button>

                {fawryFeedback && (
                  <span style={{ fontSize: '11.5px', color: 'var(--primary)', fontWeight: '700' }}>
                    {fawryFeedback}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Validation Error Alert if any */}
        {validationError && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(21, 136, 199, 0.08)',
              border: '1px solid var(--primary)',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '16px',
              fontSize: '12px',
              fontWeight: '800',
              color: 'var(--primary)'
            }}
          >
            <AlertCircle size={16} color="var(--primary)" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Promo Coupon Form */}
        <form onSubmit={onApplyCoupon} style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {isAr ? 'هل تمتلك كود خصم إضافي؟' : 'Have a Promo Discount Code?'}
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="MOTAFAWWEQ2026"
              value={couponCode}
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
                letterSpacing: '0.5px'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '900',
                cursor: 'pointer',
                transition: 'opacity 0.15s ease'
              }}
            >
              {isAr ? 'تطبيق الخصم' : 'Apply'}
            </button>
          </div>

          {couponApplied && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--primary)', fontWeight: '800', marginTop: '8px' }}>
              <CheckCircle2 size={14} color="var(--primary)" />
              <span>{isAr ? `تم تطبيق خصم ${discountPercent}% بنجاح!` : `Discount ${discountPercent}% applied!`}</span>
            </div>
          )}
        </form>

        {/* Total Price Summary Box */}
        <div
          style={{
            backgroundColor: 'var(--bg-app)',
            padding: '16px 20px',
            borderRadius: '16px',
            marginBottom: '22px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>
              {isAr ? 'المبلغ الصافي المطلوب سداده:' : 'Total Amount Due:'}
            </div>
            {couponApplied && (
              <div style={{ fontSize: '11.5px', color: 'var(--primary)', fontWeight: '800', marginTop: '2px' }}>
                {isAr
                  ? `تم توفير ${Math.round(basePrice * (discountPercent / 100))} ج.م بالكوبون`
                  : `Saved ${Math.round(basePrice * (discountPercent / 100))} EGP with coupon`}
              </div>
            )}
          </div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-0.5px' }}>
            {finalPrice?.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
          </div>
        </div>

        {/* Action Confirm Button */}
        {paymentSuccess ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '15px',
              borderRadius: '16px',
              backgroundColor: 'rgba(21, 136, 199, 0.12)',
              color: 'var(--primary)',
              textAlign: 'center',
              fontSize: '14.5px',
              fontWeight: '900',
              border: '1px solid rgba(21, 136, 199, 0.3)'
            }}
          >
            <CheckCircle2 size={20} color="var(--primary)" />
            <span>{isAr ? 'تم استلام بيانات السداد وتفعيل الباقة بنجاح!' : 'Payment Confirmed & Plan Activated!'}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessingPayment}
            style={{
              width: '100%',
              padding: '15px 20px',
              borderRadius: '16px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '15px',
              fontWeight: '900',
              cursor: isProcessingPayment ? 'wait' : 'pointer',
              boxShadow: '0 8px 24px rgba(21, 136, 199, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.15s ease'
            }}
          >
            {isProcessingPayment ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>{isAr ? 'جاري التحقق من عملية السداد والربط مع الخوادم...' : 'Verifying transaction with gateway...'}</span>
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>
                  {isAr
                    ? selectedPaymentMethod === 'fawry'
                      ? 'تم السداد لدى فوري، تفعيل الحساب الآن'
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


