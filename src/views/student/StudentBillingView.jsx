import React, { useMemo } from 'react';
import { RefreshCw, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { SPage } from '../../components/student/ui';
import {
  ActiveSubscriptionBanner,
  SubscriptionPlanCard,
  BillingInvoicesList,
  CheckoutModal,
  useStudentBilling,
} from '../../features/student/billing';

const PERIODS = [
  { id: 'monthly', labelAr: 'شهرياً', labelEn: 'Monthly', badgeAr: null, badgeEn: null },
  { id: 'term', labelAr: 'نصف سنة (5 شهور)', labelEn: 'Semester (5 Mo)', badgeAr: 'وفر 20%', badgeEn: 'Save 20%' },
  { id: 'annual', labelAr: 'سنة دراسية كاملة', labelEn: 'Full Year', badgeAr: 'وفر 30%', badgeEn: 'Save 30%' },
];

export const StudentBillingView = () => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';
  const vm = useStudentBilling(lang);

  const breadcrumbs = useMemo(
    () => [
      {
        labelAr: 'الاشتراكات والمدفوعات',
        labelEn: 'Subscriptions & Billing',
      },
    ],
    []
  );
  useSetBreadcrumbs(breadcrumbs);

  return (
    <SPage maxWidth={1160}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          direction: isRtl ? 'rtl' : 'ltr',
          fontFamily: isRtl
            ? 'var(--font-arabic), "Cairo", system-ui, sans-serif'
            : 'var(--font-heading), "Outfit", sans-serif',
          minWidth: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
              {isAr ? 'الاشتراكات والباقات التعليمية والمدفوعات' : 'Subscriptions & Billing'}
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {isAr
                ? 'إدارة باقتك الحالية (الطالب المجاني، بلس، برو)، الترقية في أي لحظة، ومتابعة سجل الفواتير الرسمية'
                : 'Manage your active plan (Free, Plus, Pro), upgrade anytime, and review verified payment invoices'}
            </p>
          </div>

          <button
            type="button"
            disabled={vm.loading || vm.refreshing}
            onClick={vm.handleRefresh}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: vm.loading || vm.refreshing ? 'wait' : 'pointer',
              opacity: vm.loading || vm.refreshing ? 0.7 : 1,
            }}
          >
            <RefreshCw size={14} color="var(--primary)" />
            <span>{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>
        </div>

        {/* Inline Notice Banner */}
        {vm.notice && (
          <div
            role="status"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '13px 16px',
              borderRadius: '14px',
              backgroundColor:
                vm.notice.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(21, 136, 199, 0.08)',
              border: `1px solid ${
                vm.notice.type === 'success' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(21, 136, 199, 0.28)'
              }`,
              color: vm.notice.type === 'success' ? 'var(--success, #059669)' : 'var(--primary)',
              fontSize: '13px',
              fontWeight: '800',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} />
              <span>{vm.notice.text}</span>
            </div>
            <button
              type="button"
              onClick={() => vm.setNotice(null)}
              style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: '800', cursor: 'pointer', fontSize: '12px' }}
            >
              {isAr ? 'إخفاء' : 'Dismiss'}
            </button>
          </div>
        )}

        {/* Error Banner */}
        {vm.error && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '14px 16px',
              borderRadius: '14px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.32)',
              color: '#DC2626',
              fontSize: '13px',
              fontWeight: '700',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{vm.error}</span>
            </div>
            <button
              type="button"
              onClick={vm.handleRefresh}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#DC2626',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        )}

        {vm.loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ height: '165px', borderRadius: '24px', backgroundColor: 'var(--bg-subtle)' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ height: '420px', borderRadius: '26px', backgroundColor: 'var(--bg-subtle)' }} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* 1. Active Subscription Banner */}
            <ActiveSubscriptionBanner
              activeSub={vm.activeSub}
              lang={lang}
              isRtl={isRtl}
              onUpgrade={vm.handleUpgradeFromBanner}
            />

            {/* 2. Three Official Student Tiers (Free, Plus, Pro) */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '18px',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                    {isAr ? 'باقات الاشتراك المعتمدة للطالب' : 'Official Student Subscription Plans'}
                  </h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {isAr
                      ? 'اختر بين باقة الطالب المجانية أو بلس أو برو مع خصم يصل إلى 30% للاشتراك السنوي'
                      : 'Choose between Student Free, Plus, or Pro with up to 30% annual savings'}
                  </div>
                </div>

                {/* Duration Toggle */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-app)',
                    border: '1.5px solid var(--border-subtle)',
                    borderRadius: '99px',
                    padding: '4px',
                    gap: '4px',
                    maxWidth: '100%',
                    overflowX: 'auto',
                  }}
                >
                  {PERIODS.map((dur) => {
                    const isSelected = vm.selectedPeriod === dur.id;
                    return (
                      <button
                        key={dur.id}
                        type="button"
                        onClick={() => vm.setSelectedPeriod(dur.id)}
                        style={{
                          padding: '8px 15px',
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
                              color: isSelected ? '#FFFFFF' : 'var(--primary)',
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

              {/* AI Note Strip */}
              <div
                style={{
                  backgroundColor: 'rgba(21, 136, 199, 0.06)',
                  border: '1px solid rgba(21, 136, 199, 0.18)',
                  borderRadius: '14px',
                  padding: '11px 16px',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                  fontSize: '12.5px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: '700' }}>
                  <Sparkles size={15} color="var(--primary)" />
                  <span>
                    {isAr
                      ? 'ميزة تحويل المحاضرات الذكي بالـ AI (صوت وفيديو وPDF) وتوليد كويزات البابل شيت الفورية متاحة حصرياً في باقة برو.'
                      : 'AI Smart Lecture Converter (Audio, Video & PDF) & instant Bubble-Sheet quizzes are included exclusively in Student Pro.'}
                  </span>
                </div>
              </div>

              {/* 3 Plans Grid */}
              <div
                className="billing-plans-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
                  gap: '22px',
                  alignItems: 'stretch',
                }}
              >
                {vm.plans.map((plan) => {
                  const isCurrent =
                    vm.activeSub?.planTier === plan.tier &&
                    (plan.tier === 'free' || vm.activeSub?.billingPeriod === vm.selectedPeriod);

                  return (
                    <SubscriptionPlanCard
                      key={plan.id}
                      plan={plan}
                      period={vm.selectedPeriod}
                      lang={lang}
                      isRtl={isRtl}
                      isCurrentPlan={isCurrent}
                      onSelectPlan={vm.handleSelectPlan}
                    />
                  );
                })}
              </div>
            </div>

            {/* 3. Payment History & Official Invoices */}
            <BillingInvoicesList invoices={vm.invoices} lang={lang} isRtl={isRtl} />
          </>
        )}

        {/* 4. Checkout Modal */}
        <CheckoutModal
          selectedPlan={vm.selectedPlanForCheckout}
          isRtl={isRtl}
          lang={lang}
          couponCode={vm.couponCode}
          setCouponCode={vm.setCouponCode}
          couponApplied={vm.couponApplied}
          discountPercent={vm.discountPercent}
          discountEgp={vm.discountEgp}
          couponError={vm.couponError}
          isApplyingCoupon={vm.isApplyingCoupon}
          onClearCoupon={vm.handleClearCoupon}
          selectedPaymentMethod={vm.selectedPaymentMethod}
          setSelectedPaymentMethod={vm.setSelectedPaymentMethod}
          isProcessingPayment={vm.isProcessingPayment}
          paymentSuccess={vm.paymentSuccess}
          checkoutError={vm.checkoutError}
          onApplyCoupon={vm.handleApplyCoupon}
          onCompletePayment={vm.handleCompletePayment}
          onClose={vm.closeCheckout}
        />
      </div>
    </SPage>
  );
};
