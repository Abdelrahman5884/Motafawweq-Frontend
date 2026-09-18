import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { SUBSCRIPTION_PLANS, COURSES_CATALOG } from '../../data/studentData';
import confetti from 'canvas-confetti';
import { 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Tag, 
  X, 
  Receipt, 
  Sparkles, 
  AlertCircle,
  Smartphone,
  QrCode
} from 'lucide-react';

export const StudentBillingView = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();

  // Active Subscription details (US-106)
  const [activeSub, setActiveSub] = useState({
    planNameAr: 'باقة الفصل الدراسي الأول (توفير 25%)',
    status: 'active',
    renewalDate: '2026-12-15',
    daysRemaining: 88,
    amountEgp: 1100
  });

  // Checkout modal state (US-101, US-103, US-104)
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('vodafone'); // 'vodafone' | 'fawry' | 'instapay' | 'card'
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Past Invoices (US-105)
  const [invoices, setInvoices] = useState([
    { id: 'INV-2026-881', date: '2026-09-01', descriptionAr: 'اشتراك باقة الفصل الدراسي الأول', amount: '1,100 ج.م', method: 'فودافون كاش', status: 'مدفوع ✅' },
    { id: 'INV-2026-724', date: '2026-08-15', descriptionAr: 'شراء كورس معسكر الكيمياء العضوية', amount: '420 ج.م', method: 'فوري باي (Fawry)', status: 'مدفوع ✅' }
  ]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'MOTAFAWWEQ2026') {
      setCouponApplied(true);
      setDiscountPercent(25);
    } else {
      alert(lang === 'ar' ? 'كود الخصم غير صحيح. جرب كود: MOTAFAWWEQ2026' : 'Invalid code. Try: MOTAFAWWEQ2026');
    }
  };

  const handleCompletePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Add to invoices
      const finalPrice = couponApplied 
        ? Math.round(selectedPlanForCheckout.priceEgp * 0.75) 
        : selectedPlanForCheckout.priceEgp;

      const newInv = {
        id: `INV-2026-${Math.floor(Math.random() * 900 + 100)}`,
        date: 'اليوم',
        descriptionAr: selectedPlanForCheckout.nameAr,
        amount: `${finalPrice} ج.م`,
        method: selectedPaymentMethod === 'vodafone' ? 'فودافون كاش' : selectedPaymentMethod === 'fawry' ? 'فوري' : selectedPaymentMethod === 'instapay' ? 'إنستاباي' : 'بطاقة بنكية',
        status: 'مدفوع ✅'
      };
      setInvoices([newInv, ...invoices]);

      setActiveSub({
        planNameAr: selectedPlanForCheckout.nameAr,
        status: 'active',
        renewalDate: '2027-01-20',
        daysRemaining: 120,
        amountEgp: finalPrice
      });

      setTimeout(() => {
        setPaymentSuccess(false);
        setSelectedPlanForCheckout(null);
      }, 3000);
    }, 1500);
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '28px 20px 80px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
          {lang === 'ar' ? 'الاشتراكات والباقات التعليمية والمدفوعات 💳' : 'Subscriptions & Billing'}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          {lang === 'ar' ? 'إدارة باقتك الحالية، الاشتراك في باقات الفصل الدراسي، وطرق الدفع الإلكتروني المصرية' : 'Manage subscriptions, explore plans, and Egyptian payment gateways'}
        </p>
      </div>

      {/* Active Subscription Status Banner (US-106) */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1.5px solid var(--primary)',
        borderRadius: '24px',
        padding: '24px',
        marginBottom: '32px',
        boxShadow: '0 8px 24px rgba(108, 77, 255, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: '900', padding: '2px 8px', borderRadius: '10px', backgroundColor: '#10B981', color: '#FFFFFF' }}>
              اشتراك نشط ✅
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              ينتهي في {activeSub.renewalDate} (باقي {activeSub.daysRemaining} يوماً)
            </span>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
            {activeSub.planNameAr}
          </h2>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            يمكنك الوصول لجميع حصص الثانوية العامة، الكويزات الذكية، وتحميل الملازم بدون قيود.
          </div>
        </div>

        <div style={{ padding: '12px 20px', borderRadius: '16px', backgroundColor: 'var(--bg-subtle)', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>قيمة الاشتراك</div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--primary)' }}>
            {activeSub.amountEgp} ج.م
          </div>
        </div>
      </div>

      {/* Subscription Plans Cards (US-100 & US-101) */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '19px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '16px' }}>
          {lang === 'ar' ? 'الباقات المتاحة للمراحل الثانوية:' : 'Available Subscription Packages:'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: plan.popular ? `2px solid ${plan.color}` : '1.5px solid var(--border-medium)',
                borderRadius: '24px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: plan.popular ? '0 12px 36px rgba(108, 77, 255, 0.2)' : 'var(--shadow-sm)'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: isRtl ? '24px' : 'auto',
                  left: isRtl ? 'auto' : '24px',
                  backgroundColor: plan.color,
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: '900',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(108, 77, 255, 0.4)'
                }}>
                  {plan.badgeAr}
                </div>
              )}

              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                  {plan.nameAr}
                </h4>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  {plan.periodAr}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '32px', fontWeight: '900', color: plan.color }}>
                    {plan.priceEgp}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                  {plan.originalPriceEgp && (
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      {plan.originalPriceEgp} ج.م
                    </span>
                  )}
                </div>

                {/* Features List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                  {plan.featuresAr.map((f, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={16} color={plan.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscribe CTA (US-101) */}
              <button
                onClick={() => setSelectedPlanForCheckout(plan)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '14px',
                  backgroundColor: plan.color,
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  boxShadow: `0 4px 14px ${plan.color}40`
                }}
              >
                {lang === 'ar' ? 'اختيار هذه الباقة' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History Invoices Table (US-105) */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1.5px solid var(--border-medium)',
        borderRadius: '24px',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <Receipt size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'سجل المدفوعات وفواتيرك السابقة (Payment History):' : 'Payment History & Invoices:'}
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {invoices.map((inv) => (
            <div
              key={inv.id}
              style={{
                padding: '14px 18px',
                borderRadius: '16px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {inv.descriptionAr}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {inv.id} • {inv.date} • وسيلة الدفع: {inv.method}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)' }}>
                  {inv.amount}
                </span>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#10B981', padding: '3px 8px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                  {inv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Electronic Checkout Modal (US-101, US-103, US-104) */}
      {selectedPlanForCheckout && (
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
              onClick={() => setSelectedPlanForCheckout(null)}
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
              {selectedPlanForCheckout.nameAr}
            </div>

            {/* Promo Coupon Form (US-104) */}
            <form onSubmit={handleApplyCoupon} style={{ marginBottom: '20px' }}>
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
                <div style={{ fontSize: '12px', color: '#10B981', fontWeight: '800', marginTop: '6px' }}>
                  🎉 تم تطبيق خصم {discountPercent}% بنجاح!
                </div>
              )}
            </form>

            {/* Egyptian Payment Gateway Selector (US-103) */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
                {lang === 'ar' ? 'اختر طريقة الدفع الإلكتروني (مصر):' : 'Select Payment Gateway:'}
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {[
                  { id: 'vodafone', nameAr: 'فودافون كاش ومحافظ المحمول', icon: '📱' },
                  { id: 'fawry', nameAr: 'كود فوري باي (Fawry)', icon: '🏪' },
                  { id: 'instapay', nameAr: 'إنستاباي (InstaPay)', icon: '⚡' },
                  { id: 'card', nameAr: 'فيزا / ماستركارد / ميزة', icon: '💳' }
                ].map((m) => (
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
                    <span style={{ fontSize: '20px' }}>{m.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {m.nameAr}
                    </span>
                  </div>
                ))}
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
                  <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '700' }}>
                    تم خصم {Math.round(selectedPlanForCheckout.priceEgp * 0.25)} ج.م بالكوبون
                  </div>
                )}
              </div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary)' }}>
                {couponApplied ? Math.round(selectedPlanForCheckout.priceEgp * 0.75) : selectedPlanForCheckout.priceEgp} ج.م
              </div>
            </div>

            {paymentSuccess ? (
              <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: '#ECFDF5', color: '#065F46', textAlign: 'center', fontSize: '14px', fontWeight: '900' }}>
                🎉 تم الدفع بنجاح وتفعيل اشتراكك فوراً!
              </div>
            ) : (
              <button
                onClick={handleCompletePayment}
                disabled={isProcessingPayment}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '900',
                  cursor: isProcessingPayment ? 'wait' : 'pointer',
                  boxShadow: '0 6px 18px rgba(16, 185, 129, 0.4)'
                }}
              >
                {isProcessingPayment ? (lang === 'ar' ? 'جاري التحقق من بوابة الدفع...' : 'Processing...') : (lang === 'ar' ? 'تأكيد الدفع الإلكتروني الآن' : 'Pay Now')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
