import React, { useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Crown,
  BookOpen,
  Mic,
  Building2,
  Users,
  Lock,
  AlertTriangle,
  X,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { SPage } from '../../components/student/ui';
import { TEACHER_PLANS } from '../../constants/teacherPlanFeatures';
import {
  ActiveSubscriptionBanner,
  SubscriptionPlanCard,
  BillingInvoicesList,
  CheckoutModal,
} from '../../features/student/billing';
import { useTeacherBilling } from '../../features/teacher/billing/useTeacherBilling';

const PERIODS = [
  { id: 'monthly', labelAr: 'شهرياً', labelEn: 'Monthly', badgeAr: null, badgeEn: null },
  { id: 'term', labelAr: 'نصف سنة (5 شهور)', labelEn: 'Semester (5 Mo)', badgeAr: 'وفر 20%', badgeEn: 'Save 20%' },
  { id: 'annual', labelAr: 'سنة دراسية كاملة', labelEn: 'Full Year', badgeAr: 'وفر 25%', badgeEn: 'Save 25%' },
];

const DEFAULT_FREE_QUOTAS = {
  maxCourses: 1,
  maxLessons: 3,
  maxGroups: 1,
  maxStudents: 50,
  allowsAi: false,
};

export const TeacherBillingView = () => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';
  const vm = useTeacherBilling(lang);
  const [searchParams] = useSearchParams();
  const plansGridRef = useRef(null);

  const requestedTier = searchParams.get('plan');
  const requestedPlanInfo = requestedTier === 'plus' || requestedTier === 'pro' ? TEACHER_PLANS[requestedTier] : null;

  useEffect(() => {
    if (!vm.loading && requestedPlanInfo && plansGridRef.current) {
      plansGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [vm.loading, requestedPlanInfo]);

  const breadcrumbs = useMemo(
    () => [
      {
        labelAr: 'الاشتراكات وباقات المعلم',
        labelEn: 'Teacher Plans & Billing',
      },
    ],
    []
  );
  useSetBreadcrumbs(breadcrumbs);

  const activeTier = vm.activeSub?.planTier || 'free';
  const activeQuotas = vm.activeSub?.quotas || DEFAULT_FREE_QUOTAS;

  const teacherBannerSubtitle = useMemo(() => {
    if (activeTier === 'pro') {
      return isAr
        ? 'تمتلك كامل صلاحيات باقة المعلم برو: مجموعات وكورسات وحصص غير محدودة + كافة أدوات الذكاء الاصطناعي (AI) على الحصص.'
        : 'Teacher Pro active: unlimited study groups, courses & lessons + full lesson AI suite (Transcripts, Mind Maps & AI Studio).';
    }
    if (activeTier === 'plus') {
      return isAr
        ? 'تمتلك صلاحيات باقة المعلم بلس: حتى 12 مجموعة دراسية، كورسات وحصص غير محدودة، الجدول الأسبوعي، الامتحانات، الواجبات، الدوري والشهادات والماليات (بدون AI).'
        : 'Teacher Plus active: up to 12 study groups, unlimited courses & lessons, weekly schedule, exams, homework, leagues, certificates & financials (without AI).';
    }
    return isAr
      ? 'حسابك مفعّل على الباقة المجانية للمعلم (كورس واحد، حتى 3 حصص بدون AI، ومجموعة واحدة حتى 50 طالب) — يمكنك الاشتراك في باقة بلس (120 ج.م/شهر) أو برو (150 ج.م/شهر) لفتح جميع المميزات.'
      : 'Your account is on Teacher Free (1 course, up to 3 lessons without AI, 1 group up to 50 students) — upgrade to Plus (120 EGP/mo) or Pro (150 EGP/mo) anytime.';
  }, [activeTier, isAr]);

  const quotaCards = useMemo(() => {
    const formatLimit = (used, max) => {
      if (max === null || max === undefined) {
        return {
          text: isAr ? `${used} / غير محدود` : `${used} / Unlimited`,
          ratio: 0,
          isFull: false,
        };
      }
      return {
        text: `${used} / ${max}`,
        ratio: Math.min(100, Math.round((used / Math.max(1, max)) * 100)),
        isFull: used >= max,
      };
    };

    const coursesMeta = formatLimit(vm.usage.coursesCount, activeQuotas.maxCourses);
    const lessonsMeta = formatLimit(vm.usage.lessonsCount, activeQuotas.maxLessons);
    const groupsMeta = formatLimit(vm.usage.groupsCount, activeQuotas.maxGroups);
    const studentsMeta = formatLimit(vm.usage.studentsCount, activeQuotas.maxStudents);

    return [
      {
        key: 'courses',
        icon: BookOpen,
        label: isAr ? 'الكورسات' : 'Courses',
        ...coursesMeta,
      },
      {
        key: 'lessons',
        icon: Mic,
        label: isAr ? 'الحصص المسجلة' : 'Lessons',
        ...lessonsMeta,
      },
      {
        key: 'groups',
        icon: Building2,
        label: isAr ? 'المجموعات الدراسية' : 'Study Groups',
        ...groupsMeta,
      },
      {
        key: 'students',
        icon: Users,
        label: isAr ? 'الطلاب المقيدون' : 'Enrolled Students',
        ...studentsMeta,
      },
      {
        key: 'ai',
        icon: activeQuotas.allowsAi ? Sparkles : Lock,
        label: isAr ? 'أدوات AI على الحصص' : 'Lesson AI Suite',
        text: activeQuotas.allowsAi
          ? isAr ? 'مفعّل بالكامل (Pro)' : 'Unlocked (Pro)'
          : isAr ? 'مقفول — يتطلب Pro' : 'Locked — Pro Only',
        ratio: 0,
        isFull: !activeQuotas.allowsAi,
        isAiCard: true,
      },
    ];
  }, [activeQuotas, isAr, vm.usage]);

  return (
    <SPage maxWidth={1180}>
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
        {/* ── Header ── */}
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
              {isAr ? 'باقات واشتراكات المعلم' : 'Teacher Plans & Subscriptions'}
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
              {isAr
                ? 'إدارة باقتك الحالية (مجاني • بلس 120 ج.م/شهر • برو 150 ج.م/شهر)، متابعة حدود الاستخدام، والفواتير الرسمية'
                : 'Manage your plan (Free • Plus 120 EGP/mo • Pro 150 EGP/mo), live quota usage, and official invoices'}
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
            <RefreshCw size={14} color="var(--primary)" className={vm.refreshing ? 'animate-spin' : ''} />
            <span>{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>
        </div>

        {/* ── Redirect Highlight Banner (from locked feature) ── */}
        {requestedPlanInfo && activeTier !== requestedPlanInfo.tier && !(requestedPlanInfo.tier === 'plus' && activeTier === 'pro') && (
          <div
            role="status"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '14px 18px',
              borderRadius: '14px',
              backgroundColor: 'var(--primary-surface)',
              border: '1.5px solid var(--primary)',
              color: 'var(--primary)',
              fontSize: '13.5px',
              fontWeight: '800',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Crown size={18} />
              <span>
                {vm.mustCancelToSwitch
                  ? isAr
                    ? `لفتح هذه الميزة، يرجى إلغاء اشتراكك الحالي أولاً ثم الاشتراك في ${requestedPlanInfo.nameAr}.`
                    : `To unlock this feature, please cancel your active subscription first and then subscribe to ${requestedPlanInfo.nameEn}.`
                  : isAr
                    ? `لفتح الميزة التي حاولت الوصول إليها، يرجى الاشتراك في ${requestedPlanInfo.nameAr}.`
                    : `To unlock the feature you requested, please subscribe to ${requestedPlanInfo.nameEn}.`}
              </span>
            </div>
            {vm.mustCancelToSwitch && (
              <button
                type="button"
                onClick={() => vm.openCancelModal(vm.plans.find((p) => p.tier === requestedPlanInfo.tier) || null)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'إلغاء الاشتراك الحالي للتبديل' : 'Cancel Active Plan to Switch'}
              </button>
            )}
          </div>
        )}

        {/* ── Inline Notice Banner ── */}
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

        {/* ── Error Banner ── */}
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
            {/* 1. Active Subscription Banner with Cancel Subscription Button */}
            <ActiveSubscriptionBanner
              activeSub={vm.activeSub}
              lang={lang}
              isRtl={isRtl}
              subtitleOverride={teacherBannerSubtitle}
              hideUpgrade={vm.mustCancelToSwitch}
              upgradeLabelOverride={isAr ? 'الترقية إلى باقة المعلم بلس (120 ج.م)' : 'Upgrade to Teacher Plus (120 EGP)'}
              onUpgrade={vm.mustCancelToSwitch ? undefined : vm.handleUpgradeFromBanner}
              onCancel={vm.mustCancelToSwitch ? () => vm.openCancelModal(null) : null}
              isCancelling={vm.isCancelling}
              cancelLabel={isAr ? 'إلغاء الاشتراك الحالي' : 'Cancel Subscription'}
            />

            {/* 2. Live Quota Consumption Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 195px), 1fr))',
                gap: '12px',
              }}
            >
              {quotaCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: `1px solid ${item.isFull ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)'}`,
                      borderRadius: '16px',
                      padding: '14px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                        {item.label}
                      </span>
                      <Icon
                        size={15}
                        color={item.isAiCard ? (activeQuotas.allowsAi ? 'var(--primary)' : '#D97706') : item.isFull ? '#D97706' : 'var(--primary)'}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: item.isAiCard ? '13.5px' : '16px',
                        fontWeight: '900',
                        color: item.isFull ? '#D97706' : 'var(--text-primary)',
                      }}
                    >
                      {item.text}
                    </div>
                    {!item.isAiCard && item.ratio > 0 && (
                      <div style={{ height: '5px', borderRadius: '99px', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${item.ratio}%`,
                            height: '100%',
                            backgroundColor: item.isFull ? '#D97706' : 'var(--primary)',
                            borderRadius: '99px',
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 3. Cancel-Before-Switch Policy Banner (when currently on paid tier) */}
            {vm.mustCancelToSwitch && (
              <div
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '16px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  fontSize: '13px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontWeight: '700' }}>
                  <Lock size={17} color="#D97706" style={{ flexShrink: 0 }} />
                  <span>
                    {isAr
                      ? 'للانتقال من اشتراكك الحالي إلى باقة أخرى (أو تغيير مدة الفوترة)، يجب إلغاء اشتراكك الحالي أولاً ثم الاشتراك في الباقة الجديدة.'
                      : 'To switch from your current active plan to another plan (or change billing period), you must cancel your current subscription first.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => vm.openCancelModal(null)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    color: '#DC2626',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isAr ? 'إلغاء الاشتراك الحالي' : 'Cancel Current Plan'}
                </button>
              </div>
            )}

            {/* 4. Three Official Teacher Tiers (Free / Plus 120 / Pro 150) */}
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
                    {isAr ? 'باقات الاشتراك المعتمدة للمعلم' : 'Official Teacher Subscription Tiers'}
                  </h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {isAr
                      ? 'المجاني للبدء • بلس (120 ج.م/شهر) لكل الأدوات ماعدا AI • برو (150 ج.م/شهر) لكل أدوات AI ومجموعات غير محدودة'
                      : 'Free to start • Plus (120 EGP/mo) for all tools except AI • Pro (150 EGP/mo) for all AI tools & unlimited groups'}
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
                  gap: '8px',
                  fontSize: '12.5px',
                  color: 'var(--text-primary)',
                  fontWeight: '700',
                }}
              >
                <Sparkles size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>
                  {isAr
                    ? 'جميع أدوات الذكاء الاصطناعي (AI) على الحصص — التفريغ النصي، خرائط المفاهيم التفاعلية، وفهرسة الفصول الذكية — متاحة حصرياً في باقة المعلم برو (150 ج.م/شهر).'
                    : 'All lesson AI capabilities — AI Transcripts, Interactive Concept Mind Maps, and Smart Chapter Indexing — are exclusively unlocked in Teacher Pro (150 EGP/mo).'}
                </span>
              </div>

              {/* 3 Plans Grid */}
              <div
                ref={plansGridRef}
                className="teacher-billing-plans-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))',
                  gap: '22px',
                  alignItems: 'stretch',
                }}
              >
                {vm.plans.map((plan) => {
                  const isCurrent =
                    activeTier === plan.tier &&
                    (plan.tier === 'free' || vm.activeSub?.billingPeriod === vm.selectedPeriod);
                  const isSwitchBlocked = vm.mustCancelToSwitch && !isCurrent;

                  return (
                    <SubscriptionPlanCard
                      key={plan.id || plan.tier}
                      plan={plan}
                      period={vm.selectedPeriod}
                      lang={lang}
                      isRtl={isRtl}
                      isCurrentPlan={isCurrent}
                      isHighlighted={Boolean(requestedPlanInfo && requestedPlanInfo.tier === plan.tier && !isCurrent)}
                      switchBlocked={isSwitchBlocked}
                      switchBlockedLabel={
                        plan.tier === 'free'
                          ? isAr ? 'ألغِ اشتراكك للعودة للمجاني' : 'Cancel plan to return to Free'
                          : isAr ? 'ألغِ اشتراكك الحالي أولاً للتبديل' : 'Cancel active plan first to switch'
                      }
                      freeActionLabel={isAr ? 'باقتك المجانية الافتراضية' : 'Default Free Tier'}
                      onSelectPlan={vm.handleSelectPlan}
                    />
                  );
                })}
              </div>
            </div>

            {/* 5. Official Invoices List */}
            <BillingInvoicesList invoices={vm.invoices} lang={lang} isRtl={isRtl} />
          </>
        )}

        {/* 6. Cancel Subscription Confirmation Modal */}
        {vm.cancelModalOpen && (
          <div
            onClick={vm.closeCancelModal}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(6, 37, 78, 0.78)',
              backdropFilter: 'blur(6px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '22px',
                maxWidth: '470px',
                width: '100%',
                padding: '26px',
                boxShadow: '0 24px 60px rgba(6, 37, 78, 0.35)',
                direction: isRtl ? 'rtl' : 'ltr',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#DC2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AlertTriangle size={20} />
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                    {vm.pendingSwitchTarget
                      ? isAr
                        ? 'إلغاء الاشتراك الحالي قبل التبديل'
                        : 'Cancel Active Plan Before Switching'
                      : isAr
                        ? 'تأكيد إلغاء الاشتراك الحالي'
                        : 'Confirm Subscription Cancellation'}
                  </h3>
                </div>
                <button
                  type="button"
                  disabled={vm.isCancelling}
                  onClick={vm.closeCancelModal}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 14px 0' }}>
                {vm.pendingSwitchTarget
                  ? isAr
                    ? `للانتقال إلى «${vm.pendingSwitchTarget.nameAr}»، يجب إلغاء اشتراكك النشط في «${vm.activeSub?.planNameAr || ''}» أولاً. بمجرد الإلغاء ستُفتح لك نافذة الاشتراك في الباقة الجديدة فوراً.`
                    : `To switch to "${vm.pendingSwitchTarget.nameEn || vm.pendingSwitchTarget.nameAr}", you must cancel your active subscription first. Checkout for the new plan will open immediately after cancellation.`
                  : isAr
                    ? `هل أنت متأكد من إلغاء اشتراكك النشط في «${vm.activeSub?.planNameAr || ''}»؟ سيعود حسابك فوراً إلى الباقة المجانية وستُقفل المميزات المدفوعة (مثل الجدول، الامتحانات، والـ AI) حتى تشترك مجدداً، مع الاحتفاظ بجميع بياناتك وكورساتك دون حذف.`
                    : `Are you sure you want to cancel "${vm.activeSub?.planNameEn || vm.activeSub?.planNameAr || ''}"? Your account will immediately revert to the Free plan and paid features will lock until you subscribe again. All your existing data stays safe.`}
              </p>

              {vm.cancelError && (
                <div
                  role="alert"
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#DC2626',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    marginBottom: '14px',
                  }}
                >
                  {vm.cancelError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
                <button
                  type="button"
                  disabled={vm.isCancelling}
                  onClick={vm.closeCancelModal}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: vm.isCancelling ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isAr ? 'تراجع' : 'Keep Plan'}
                </button>

                <button
                  type="button"
                  disabled={vm.isCancelling}
                  onClick={vm.handleConfirmCancel}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: vm.isCancelling ? 'wait' : 'pointer',
                    opacity: vm.isCancelling ? 0.75 : 1,
                  }}
                >
                  {vm.isCancelling && <Loader2 size={14} className="animate-spin" />}
                  <span>
                    {vm.pendingSwitchTarget
                      ? isAr ? 'إلغاء الحالي والانتقال للباقة الجديدة' : 'Cancel & Continue to New Plan'
                      : isAr ? 'نعم، إلغاء الاشتراك الحالي' : 'Yes, Cancel Subscription'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 7. Electronic Checkout Modal */}
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

export default TeacherBillingView;
