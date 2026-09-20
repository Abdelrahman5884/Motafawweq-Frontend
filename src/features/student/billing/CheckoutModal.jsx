import React from 'react';
import { X, CheckCircle2, Smartphone, Store, Zap, CreditCard } from 'lucide-react';

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
  if (!selectedPlan) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1.5px solid var(--border-medium)',
        borderRadius: '24px',
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            left: isRtl ? '20px' : 'auto',
            right: isRtl ? 'auto' : '20px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)'
          }}
        >
          <X size={18} />
        </button>

        <h3 style={{ fontSize: '19px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px' }}>
          {lang === 'ar' ? 'إتمام الاشتراك والدفع الإلكتروني' : 'Checkout & Payment'}
        </h3>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          {selectedPlan.nameAr}
        </div>

        {/* Promo Coupon Form */}
        <form onSubmit={onApplyCoupon} style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {lang === 'ar' ? 'هل لديك كوبون خصم؟' : 'Have a Promo Coupon?'}
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
                backgroundColor: 'var(--bg-subtle)',
                border: '1.5px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'monospace',
                fontWeight: '800',
                outline: 'none'
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
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              {lang === 'ar' ? 'تطبيق الخصم' : 'Apply'}
            </button>
          </div>

          {couponApplied && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--success)', fontWeight: '800', marginTop: '6px' }}>
              <CheckCircle2 size={14} color="var(--success)" />
              <span>تم تطبيق خصم {discountPercent}% بنجاح!</span>
            </div>
          )}
        </form>

        {/* Egyptian Payment Gateway Selector */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
            {lang === 'ar' ? 'اختر طريقة الدفع الإلكتروني (مصر):' : 'Select Payment Gateway:'}
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {[
              { id: 'vodafone', nameAr: 'فودافون كاش ومحافظ المحمول', icon: Smartphone },
              { id: 'fawry', nameAr: 'كود فوري باي (Fawry)', icon: Store },
              { id: 'instapay', nameAr: 'إنستاباي (InstaPay)', icon: Zap },
              { id: 'card', nameAr: 'فيزا / ماستركارد / ميزة', icon: CreditCard }
            ].map((m) => {
              const IconComponent = m.icon;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedPaymentMethod(m.id)}
                  style={{
                    padding: '12px',
                    borderRadius: '14px',
                    backgroundColor: selectedPaymentMethod === m.id ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                    border: '1.5px solid',
                    borderColor: selectedPaymentMethod === m.id ? 'var(--primary)' : 'var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <IconComponent size={18} color="var(--primary)" />
                  <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {m.nameAr}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total Price Summary */}
        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          padding: '16px',
          borderRadius: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>المبلغ الإجمالي المطلوب للدفع:</div>
            {couponApplied && (
              <div style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '700' }}>
                تم خصم {Math.round(selectedPlan.priceEgp * 0.25)} ج.م بالكوبون
              </div>
            )}
          </div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary)' }}>
            {couponApplied ? Math.round(selectedPlan.priceEgp * 0.75) : selectedPlan.priceEgp} ج.م
          </div>
        </div>

        {paymentSuccess ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '14px', backgroundColor: '#ECFDF5', color: '#065F46', textAlign: 'center', fontSize: '14px', fontWeight: '900' }}>
            <CheckCircle2 size={18} color="var(--success)" />
            <span>تم الدفع بنجاح وتفعيل اشتراكك فوراً!</span>
          </div>
        ) : (
          <button
            onClick={onCompletePayment}
            disabled={isProcessingPayment}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              backgroundColor: 'var(--success)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '15px',
              fontWeight: '900',
              cursor: isProcessingPayment ? 'wait' : 'pointer',
              boxShadow: '0 6px 18px rgba(22, 163, 74, 0.4)'
            }}
          >
            {isProcessingPayment ? (lang === 'ar' ? 'جاري التحقق من بوابة الدفع...' : 'Processing...') : (lang === 'ar' ? 'تأكيد الدفع الإلكتروني الآن' : 'Pay Now')}
          </button>
        )}
      </div>
    </div>
  );
};
