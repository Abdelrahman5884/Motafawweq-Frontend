import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { TEACHER_SUBSCRIPTION_PLANS, MOCK_TEACHER_INVOICES } from '../../data/teacherData';
import confetti from 'canvas-confetti';
import {
  ActiveSubscriptionBanner,
  SubscriptionPlanCard,
  BillingInvoicesList,
  CheckoutModal
} from '../../features/student/billing';
import { ShieldCheck, Sparkles, CheckCircle2, Zap } from 'lucide-react';

export const TeacherBillingView = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const isAr = lang === 'ar';

  // Active Teacher Subscription details
  const [activeSub, setActiveSub] = useState({
    planNameAr: 'باقة المعلم بلس — الفصل الدراسي الأول',
    planNameEn: 'Teacher Plus — Semester 1 Active',
    status: 'active',
    renewalDate: '2026-12-30',
    daysRemaining: 92,
    amountEgp: 480
  });

  // Duration toggle: 'monthly' | 'term' | 'annual'
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Checkout modal state
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('vodafone'); // 'vodafone' | 'instapay' | 'fawry' | 'card'
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Invoices list state
  const [invoices, setInvoices] = useState(MOCK_TEACHER_INVOICES);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'TEACHER2026' || clean === 'MOTAFAWWEQ2026' || clean === 'SALMA2026') {
      setCouponApplied(true);
      setDiscountPercent(25);
    } else {
      alert(isAr ? 'كود الخصم غير صحيح. جرب كود: TEACHER2026' : 'Invalid code. Try code: TEACHER2026');
    }
  };

  const handleCompletePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      try {
        confetti({
          particleCount: 140,
          spread: 85,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      const pricing = selectedPlanForCheckout.pricing?.[selectedPeriod] || selectedPlanForCheckout;
      const basePrice = pricing.priceEgp || selectedPlanForCheckout.priceEgp || 0;
      const finalPrice = couponApplied ? Math.round(basePrice * 0.75) : basePrice;

      const newInv = {
        id: `T-INV-2026-${Math.floor(Math.random() * 900 + 100)}`,
        date: isAr ? 'اليوم' : 'Today',
        descriptionAr: `اشتراك ${selectedPlanForCheckout.nameAr} (${selectedPeriod === 'monthly' ? 'شهري' : selectedPeriod === 'term' ? 'نصف سنوي - 5 شهور' : 'سنة كاملة'})`,
        descriptionEn: `${selectedPlanForCheckout.nameEn || selectedPlanForCheckout.nameAr} (${selectedPeriod})`,
        amount: `${finalPrice} ج.م`,
        amountEn: `${finalPrice} EGP`,
        method: selectedPaymentMethod === 'vodafone' ? 'فودافون كاش' : selectedPaymentMethod === 'instapay' ? 'إنستاباي' : selectedPaymentMethod === 'fawry' ? 'فوري' : 'بطاقة بنكية',
        methodAr: selectedPaymentMethod === 'vodafone' ? 'فودافون كاش ومحافظ المحمول' : selectedPaymentMethod === 'instapay' ? 'إنستاباي (InstaPay)' : selectedPaymentMethod === 'fawry' ? 'فوري باي (Fawry)' : 'بطاقة بنكية',
        methodEn: selectedPaymentMethod === 'vodafone' ? 'Vodafone Cash' : selectedPaymentMethod === 'instapay' ? 'InstaPay Transfer' : selectedPaymentMethod === 'fawry' ? 'Fawry Pay' : 'Credit/Debit Card',
        status: 'مدفوع'
      };
      setInvoices((prev) => [newInv, ...prev]);

      setActiveSub({
        planNameAr: `${selectedPlanForCheckout.nameAr} (${selectedPeriod === 'annual' ? 'سنة دراسية كاملة' : selectedPeriod === 'term' ? 'نصف سنة' : 'شهرياً'})`,
        planNameEn: `${selectedPlanForCheckout.nameEn || selectedPlanForCheckout.nameAr}`,
        status: 'active',
        renewalDate: selectedPeriod === 'annual' ? '2027-06-30' : selectedPeriod === 'term' ? '2027-02-15' : '2026-10-30',
        daysRemaining: selectedPeriod === 'annual' ? 270 : selectedPeriod === 'term' ? 150 : 30,
        amountEgp: finalPrice
      });

      setTimeout(() => {
        setPaymentSuccess(false);
        setSelectedPlanForCheckout(null);
      }, 2800);
    }, 1500);
  };

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 20px 84px',
        direction: isRtl ? 'rtl' : 'ltr',
        fontFamily: isRtl ? 'var(--font-arabic), "Cairo", system-ui, sans-serif' : 'var(--font-heading), "Outfit", sans-serif'
      }}
    >
      {/* ── Calm Header ── */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: '99px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: '11px',
              fontWeight: '900',
              letterSpacing: '0.2px'
            }}
          >
            {isAr ? 'بوابة المعلم الأكاديمية' : 'Teacher Suite'}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>•</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {isAr ? 'إدارة الاشتراك والترقية' : 'Subscription & Upgrades'}
          </span>
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
          {isAr ? 'باقات اشتراك المعلم والخدمات الأكاديمية' : 'Teacher Subscriptions & Professional Tiers'}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          {isAr
            ? 'اختر الباقة المناسبة لسعة مجموعاتك وكورساتك، وفّعل استوديو التسجيل الذكي بالذكاء الاصطناعي وحماية المحتوى عبر بوابات الدفع المصرية المعتمدة'
            : 'Select the optimal tier for your teaching scale, unlock AI studio conversion, and manage subscriptions with Egyptian payment channels.'}
        </p>
      </div>

      {/* ── Active Subscription Status Banner ── */}
      <ActiveSubscriptionBanner
        activeSub={activeSub}
        lang={lang}
        isRtl={isRtl}
        onUpgrade={() => {
          const proPlan = TEACHER_SUBSCRIPTION_PLANS.find((p) => p.id === 'plan-teacher-pro');
          if (proPlan) {
            setSelectedPlanForCheckout(proPlan);
          }
        }}
      />

      {/* ── Subscription Plans Cards Section ── */}
      <div style={{ marginBottom: '44px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '22px',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.2px' }}>
              {isAr ? 'باقات الاشتراك المخصصة لمعلمي منصة متفوّق' : 'Official Educator Subscription Tiers'}
            </h3>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
              {isAr
                ? 'الباقات تشمل أدوات التدريس الحديثة، بنوك أسئلة البابل شيت، دوري الكورس، وحماية الحصص ضد التسريب مع إمكانية الترقية في أي وقت'
                : 'All tiers include modern teaching tools, Bubble Sheet banks, course leagues, and DRM protection with seamless upgrade flexibility'}
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
                labelAr: 'نصف سنة (ترم - 5 شهور)',
                labelEn: 'Semester (5 Mo)',
                badgeAr: 'وفر 20%',
                badgeEn: 'Save 20%'
              },
              {
                id: 'annual',
                labelAr: 'سنة دراسية كاملة',
                labelEn: 'Full Academic Year',
                badgeAr: 'وفر 25%',
                badgeEn: 'Save 25%'
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
                  <span>{isAr ? dur.labelAr : dur.labelEn}</span>
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
                      {isAr ? dur.badgeAr : dur.badgeEn}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Highlight Banner for AI Studio & DRM Security */}
        <div
          style={{
            backgroundColor: 'var(--primary-surface)',
            border: '1px solid rgba(21, 136, 199, 0.22)',
            borderRadius: '16px',
            padding: '14px 20px',
            marginBottom: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '13px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(21, 136, 199, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <span style={{ fontWeight: '800' }}>
                {isAr
                  ? 'حماية متطورة ضد تسريب الفيديوهات والمذكرات:'
                  : 'Advanced Anti-Leak Protection for Lectures:'}
              </span>
              <span style={{ color: 'var(--text-secondary)', marginInlineStart: '6px' }}>
                {isAr
                  ? 'علامة مائية ديناميكية متحركة برقم هاتف الطالب + تشفير DRM لمنع تصوير الشاشة (متاحة في باقات بلس وبرو).'
                  : 'Dynamic floating watermarks with student phone number + DRM encryption to block screen recording.'}
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--primary)',
              fontWeight: '800',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{isAr ? 'تقارير واتساب فورية لأولياء الأمور' : 'Instant WhatsApp Parent Reports'}</span>
            <Zap size={14} />
          </div>
        </div>

        {/* The 3 Cards Grid */}
        <div
          className="teacher-billing-plans-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 330px), 1fr))',
            gap: '24px',
            alignItems: 'stretch'
          }}
        >
          {TEACHER_SUBSCRIPTION_PLANS.map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              period={selectedPeriod}
              lang={lang}
              isRtl={isRtl}
              isCurrentPlan={plan.id === 'plan-teacher-plus' && selectedPeriod === 'monthly'}
              onSelectPlan={(p) => {
                if (plan.id === 'plan-teacher-free') {
                  alert(
                    isAr
                      ? 'الباقة المجانية مفعّلة تلقائياً لأي معلم جديد لتجربة رفع المقررات وبنك الأسئلة الأساسي!'
                      : 'The Free Plan is activated by default for all new teachers to test courses and basic question banks!'
                  );
                  return;
                }
                setSelectedPlanForCheckout(p);
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Payment History Invoices Table ── */}
      <BillingInvoicesList invoices={invoices} lang={lang} isRtl={isRtl} />

      {/* ── Electronic Checkout Modal (Vodafone Cash, InstaPay, Fawry, Bank Card) ── */}
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

export default TeacherBillingView;
