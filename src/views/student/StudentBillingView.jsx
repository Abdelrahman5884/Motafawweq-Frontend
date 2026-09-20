import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SUBSCRIPTION_PLANS } from '../../data/studentData';
import confetti from 'canvas-confetti';
import {
  ActiveSubscriptionBanner,
  SubscriptionPlanCard,
  BillingInvoicesList,
  CheckoutModal
} from '../../features/student/billing';

export const StudentBillingView = () => {
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
    { id: 'INV-2026-881', date: '2026-09-01', descriptionAr: 'اشتراك باقة الفصل الدراسي الأول', amount: '1,100 ج.م', method: 'فودافون كاش', status: 'مدفوع' },
    { id: 'INV-2026-724', date: '2026-08-15', descriptionAr: 'شراء كورس معسكر الكيمياء العضوية', amount: '420 ج.م', method: 'فوري باي (Fawry)', status: 'مدفوع' }
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
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

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
        status: 'مدفوع'
      };
      setInvoices(prev => [newInv, ...prev]);

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
          {lang === 'ar' ? 'الاشتراكات والباقات التعليمية والمدفوعات' : 'Subscriptions & Billing'}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          {lang === 'ar' ? 'إدارة باقتك الحالية، الاشتراك في باقات الفصل الدراسي، وطرق الدفع الإلكتروني المصرية' : 'Manage subscriptions, explore plans, and Egyptian payment gateways'}
        </p>
      </div>

      {/* Active Subscription Status Banner */}
      <ActiveSubscriptionBanner activeSub={activeSub} />

      {/* Subscription Plans Cards */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '19px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '16px' }}>
          {lang === 'ar' ? 'الباقات المتاحة للمراحل الثانوية:' : 'Available Subscription Packages:'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              lang={lang}
              isRtl={isRtl}
              onSelectPlan={(p) => setSelectedPlanForCheckout(p)}
            />
          ))}
        </div>
      </div>

      {/* Payment History Invoices Table */}
      <BillingInvoicesList invoices={invoices} lang={lang} />

      {/* Electronic Checkout Modal */}
      <CheckoutModal
        selectedPlan={selectedPlanForCheckout}
        isRtl={isRtl}
        lang={lang}
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        couponApplied={couponApplied}
        discountPercent={discountPercent}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        isProcessingPayment={isProcessingPayment}
        paymentSuccess={paymentSuccess}
        onApplyCoupon={handleApplyCoupon}
        onCompletePayment={handleCompletePayment}
        onClose={() => setSelectedPlanForCheckout(null)}
      />
    </div>
  );
};
