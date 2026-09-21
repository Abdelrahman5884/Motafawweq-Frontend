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
    planNameEn: 'Semester 1 Hero Pass (Save 25%)',
    status: 'active',
    renewalDate: '2026-12-15',
    daysRemaining: 88,
    amountEgp: 450
  });

  // Checkout modal state (US-101, US-103, US-104)
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('vodafone'); // 'vodafone' | 'fawry' | 'instapay' | 'card'
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Duration toggle period: 'monthly' | 'term' | 'annual' (per Voice Note)
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Past Invoices (US-105)
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-2026-881',
      date: '2026-09-01',
      descriptionAr: 'اشتراك باقة الفصل الدراسي الأول (5 شهور)',
      descriptionEn: 'Semester 1 Hero Pass Subscription (5 Months)',
      amount: '450 ج.م',
      amountEn: '450 EGP',
      method: 'فودافون كاش',
      methodAr: 'فودافون كاش ومحافظ المحمول',
      methodEn: 'Vodafone Cash & Mobile Wallets',
      status: 'مدفوع'
    },
    {
      id: 'INV-2026-724',
      date: '2026-08-15',
      descriptionAr: 'شراء كورس معسكر الكيمياء العضوية',
      descriptionEn: 'Organic Chemistry Revision Camp',
      amount: '180 ج.م',
      amountEn: '180 EGP',
      method: 'فوري باي (Fawry)',
      methodAr: 'فوري باي (Fawry)',
      methodEn: 'Fawry Pay',
      status: 'مدفوع'
    }
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
      } catch {
        // ignore
      }

      // Add to invoices
      const finalPrice = couponApplied 
        ? Math.round(selectedPlanForCheckout.priceEgp * 0.75) 
        : selectedPlanForCheckout.priceEgp;

      const newInv = {
        id: `INV-2026-${Math.floor(Math.random() * 900 + 100)}`,
        date: lang === 'ar' ? 'اليوم' : 'Today',
        descriptionAr: selectedPlanForCheckout.nameAr,
        descriptionEn: selectedPlanForCheckout.nameEn || selectedPlanForCheckout.nameAr,
        amount: `${finalPrice} ج.م`,
        amountEn: `${finalPrice} EGP`,
        method: selectedPaymentMethod === 'vodafone' ? 'فودافون كاش' : selectedPaymentMethod === 'fawry' ? 'فوري' : selectedPaymentMethod === 'instapay' ? 'إنستاباي' : 'بطاقة بنكية',
        methodAr: selectedPaymentMethod === 'vodafone' ? 'فودافون كاش' : selectedPaymentMethod === 'fawry' ? 'فوري باي' : selectedPaymentMethod === 'instapay' ? 'إنستاباي' : 'بطاقة بنكية',
        methodEn: selectedPaymentMethod === 'vodafone' ? 'Vodafone Cash' : selectedPaymentMethod === 'fawry' ? 'Fawry Pay' : selectedPaymentMethod === 'instapay' ? 'InstaPay' : 'Credit/Debit Card',
        status: 'مدفوع'
      };
      setInvoices(prev => [newInv, ...prev]);

      setActiveSub({
        planNameAr: selectedPlanForCheckout.nameAr,
        planNameEn: selectedPlanForCheckout.nameEn || selectedPlanForCheckout.nameAr,
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
      padding: '28px 20px 80px',
      direction: isRtl ? 'rtl' : 'ltr',
      fontFamily: isRtl ? 'var(--font-arabic), "Cairo", system-ui, sans-serif' : 'var(--font-heading), "Outfit", sans-serif'
    }}>
      {/* Calm Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.3px' }}>
          {lang === 'ar' ? 'الاشتراكات والباقات التعليمية والمدفوعات' : 'Subscriptions & Billing'}
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: 1.5 }}>
          {lang === 'ar' ? 'إدارة باقتك الحالية، الاشتراك في باقات الفصل الدراسي، وتفعيل الحساب عبر بوابات الدفع الإلكتروني المصرية' : 'Manage active passes, explore semester packages, and Egyptian payment gateways'}
        </p>
      </div>

      {/* Active Subscription Status Banner */}
      <ActiveSubscriptionBanner
        activeSub={activeSub}
        lang={lang}
        isRtl={isRtl}
        onUpgrade={() => {
          const proPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'plan-pro');
          if (proPlan) {
            const pricing = proPlan.pricing?.annual || proPlan.pricing?.monthly;
            setSelectedPlanForCheckout({ ...proPlan, ...pricing });
          }
        }}
      />

      {/* Subscription Plans Cards Section */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.2px' }}>
              {lang === 'ar' ? 'باقات الاشتراك المعتمدة لمنصة متفوّق' : 'Official Motafawweq Subscription Tiers'}
            </h3>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
              {lang === 'ar' 
                ? 'اختر الباقة المناسبة لمستواك ومرحلتك الدراسية مع إمكانية الترقية أو تغيير المدة في أي لحظة' 
                : 'Choose the ideal tier for your academic journey with instant upgrade support'}
            </div>
          </div>

          {/* Duration Toggle (Monthly / Semester / Academic Year) */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-app)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '99px',
              padding: '4px',
              gap: '4px',
              boxShadow: 'var(--shadow-sm)',
              maxWidth: '100%',
              overflowX: 'auto'
            }}
          >
            {[
              {
                id: 'monthly',
                labelAr: 'شهرياً',
                labelEn: 'Monthly',
                badgeAr: null,
                badgeEn: null
              },
              {
                id: 'term',
                labelAr: 'نصف سنة (ترم)',
                labelEn: 'Semester (5 Mo)',
                badgeAr: 'وفر 20%',
                badgeEn: 'Save 20%'
              },
              {
                id: 'annual',
                labelAr: 'سنة دراسية كاملة',
                labelEn: 'Full Academic Year',
                badgeAr: 'وفر 30%',
                badgeEn: 'Save 30%'
              }
            ].map((dur) => {
              const isSelected = selectedPeriod === dur.id;
              return (
                <button
                  key={dur.id}
                  onClick={() => setSelectedPeriod(dur.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '99px',
                    border: 'none',
                    backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                    color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: isSelected ? '900' : '700',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isSelected ? '0 4px 14px rgba(21, 136, 199, 0.35)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'var(--border-subtle)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <span>{lang === 'ar' ? dur.labelAr : dur.labelEn}</span>
                  {dur.badgeAr && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: '900',
                        padding: '1px 6px',
                        borderRadius: '6px',
                        backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.22)' : 'rgba(21, 136, 199, 0.12)',
                        color: isSelected ? '#FFFFFF' : 'var(--primary)'
                      }}
                    >
                      {lang === 'ar' ? dur.badgeAr : dur.badgeEn}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Capabilities Notification Banner */}
        <div
          style={{
            backgroundColor: 'rgba(21, 136, 199, 0.05)',
            border: '1px solid rgba(21, 136, 199, 0.18)',
            borderRadius: '16px',
            padding: '12px 18px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12.5px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <span style={{ fontSize: '15px' }}>⚡</span>
            <span style={{ fontWeight: '700' }}>
              {lang === 'ar'
                ? 'ميزة تحويل المحاضرات الذكي بالـ AI (تفريغ صوت وفيديو وPDF) وتوليد كويزات البابل شيت الفورية متاحة حصرياً في باقة برو.'
                : 'AI Smart Lecture Transcription (Audio, Video & PDF) & instant Bubble Sheet quiz generation are exclusively unlocked in the Pro Plan.'}
            </span>
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--primary)', fontWeight: '800' }}>
            {lang === 'ar' ? 'تصحيح لحظي وشرح لكل إجابة' : 'Instant auto-grading & reasoning'}
          </div>
        </div>

        <div
          className="billing-plans-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 330px), 1fr))',
            gap: '24px',
            alignItems: 'stretch'
          }}
        >
          {SUBSCRIPTION_PLANS.map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              period={selectedPeriod}
              lang={lang}
              isRtl={isRtl}
              isCurrentPlan={plan.id === 'plan-plus' && selectedPeriod === 'term'}
              onSelectPlan={(p) => {
                if (plan.id === 'plan-free') {
                  alert(lang === 'ar' ? 'أنت مسجل بالفعل في الباقة المجانية، يمكنك متابعة مناهج الوزارة مباشرة!' : 'You are currently enjoying the Free Plan. Start exploring Ministry lectures!');
                  return;
                }
                setSelectedPlanForCheckout(p);
              }}
            />
          ))}
        </div>
      </div>

      {/* Payment History Invoices Table */}
      <BillingInvoicesList invoices={invoices} lang={lang} isRtl={isRtl} />

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
