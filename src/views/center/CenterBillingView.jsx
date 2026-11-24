import React, { useEffect, useMemo, useRef } from 'react';
import { InfoTooltip } from '../../components/common/InfoTooltip';
import { Navigate, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Crown,
  DoorOpen,
  GraduationCap,
  Layers,
  Loader2,
  Lock,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { SButton, SPage, SPageHeader, SSkeleton } from '../../components/student/ui';
import { CENTER_PLANS, CENTER_PLAN_QUOTAS } from '../../constants/centerPlanFeatures';
import {
  ActiveSubscriptionBanner,
  BillingInvoicesList,
  CheckoutModal,
  SubscriptionPlanCard,
} from '../../features/student/billing';
import { useCenterBilling } from '../../features/center/billing/useCenterBilling';

const PERIODS = [
  { id: 'monthly', labelAr: 'شهرياً', labelEn: 'Monthly', badgeAr: null, badgeEn: null },
  {
    id: 'term',
    labelAr: 'للترم (5 شهور)',
    labelEn: 'Semester (5 Mo)',
    badgeAr: 'وفر 20%',
    badgeEn: 'Save 20%',
  },
  {
    id: 'annual',
    labelAr: 'سنة دراسية (10 شهور)',
    labelEn: 'Full Year (10 Mo)',
    badgeAr: 'وفر 25%',
    badgeEn: 'Save 25%',
  },
];

export const CenterBillingView = () => {
  const { authLoading, isAuthenticated, hasActiveToken, currentUser } = useAuth();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';
  const [searchParams] = useSearchParams();
  const plansGridRef = useRef(null);

  const vm = useCenterBilling(lang);

  const requestedTier = searchParams.get('plan');
  const requestedPlanInfo =
    requestedTier === 'plus' || requestedTier === 'pro' ? CENTER_PLANS[requestedTier] : null;

  useEffect(() => {
    if (!vm.loading && requestedPlanInfo && plansGridRef.current) {
      plansGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [vm.loading, requestedPlanInfo]);

  const breadcrumbs = useMemo(() => [], []);
  useSetBreadcrumbs(breadcrumbs);

  const activeTier = vm.activeSub?.planTier || 'free';
  const activeQuotas = vm.activeSub?.quotas || CENTER_PLAN_QUOTAS[activeTier] || CENTER_PLAN_QUOTAS.free;

  const centerBannerSubtitle = useMemo(() => {
    if (activeTier === 'pro') {
      return isAr
        ? 'تمتلك كامل صلاحيات باقة السنتر برو: مستخدمون وفروع وقاعات ومجموعات بلا حدود + ماسح الباركود + الجدول الشامل + سجل العمليات والتقرير التنفيذي.'
        : 'Center Pro active: unlimited users, branches, classrooms & cohorts + QR scanner, master schedule, audit logs & executive reports.';
    }
    if (activeTier === 'plus') {
      return isAr
        ? 'تمتلك صلاحيات باقة السنتر بلس: حتى 500 مستخدم نشط، 5 فروع، 8 قاعات، 12 معلماً، 15 موظفاً، 20 مجموعة + ماسح الباركود والجدول الأسبوعي الشامل.'
        : 'Center Plus active: up to 500 active users, 5 branches, 8 rooms, 12 teachers, 15 staff & 20 cohorts + QR scanner and master schedule.';
    }
    return isAr
      ? 'حساب السنتر مفعّل على الباقة المجانية (حتى 20 مستخدم نشط فقط، فرع واحد، قاعة واحدة، معلمان، ومجموعتان) — قم بالترقية إلى بلس (200 ج.م/شهر) أو برو (400 ج.م/شهر) لفتح جميع الأدوات.'
      : 'Your center is on the Free tier (20 active users max, 1 branch, 1 room, 2 teachers & 2 cohorts) — upgrade to Plus (200 EGP/mo) or Pro (400 EGP/mo) anytime.';
  }, [activeTier, isAr]);

  const quotaCards = useMemo(() => {
    const formatLimit = (used, max, lockedLabelAr = null, lockedLabelEn = null) => {
      if (max === 0 && lockedLabelAr) {
        return {
          text: isAr ? lockedLabelAr : lockedLabelEn,
          ratio: 0,
          isFull: true,
          isLocked: true,
        };
      }
      if (max === null || max === undefined) {
        return {
          text: isAr ? `${used.toLocaleString()} / غير محدود` : `${used.toLocaleString()} / Unlimited`,
          ratio: 0,
          isFull: false,
          isLocked: false,
        };
      }
      return {
        text: `${used.toLocaleString()} / ${max.toLocaleString()}`,
        ratio: Math.min(100, Math.round((used / Math.max(1, max)) * 100)),
        isFull: used >= max,
        isLocked: false,
      };
    };

    return [
      {
        key: 'users',
        icon: Users,
        label: isAr ? 'المستخدمون النشطون' : 'Active Users',
        ...formatLimit(vm.usage.activeUsersCount, activeQuotas.maxUsers),
      },
      {
        key: 'groups',
        icon: Layers,
        label: isAr ? 'المجموعات الدراسية' : 'Study Cohorts',
        ...formatLimit(vm.usage.groupsCount, activeQuotas.maxGroups),
      },
      {
        key: 'rooms',
        icon: DoorOpen,
        label: isAr ? 'القاعات الدراسية' : 'Classrooms',
        ...formatLimit(vm.usage.roomsCount, activeQuotas.maxRooms),
      },
      {
        key: 'branches',
        icon: Building2,
        label: isAr ? 'الفروع' : 'Branches',
        ...formatLimit(vm.usage.branchesCount, activeQuotas.maxBranches),
      },
      {
        key: 'teachers',
        icon: GraduationCap,
        label: isAr ? 'المعلمون' : 'Teachers',
        ...formatLimit(vm.usage.teachersCount, activeQuotas.maxTeachers),
      },
      {
        key: 'staff',
        icon: activeQuotas.maxStaff === 0 ? Lock : ShieldCheck,
        label: isAr ? 'الموظفون الإداريون' : 'Admin Staff',
        ...formatLimit(
          vm.usage.staffCount,
          activeQuotas.maxStaff,
          'مقفول — يتطلب Plus',
          'Locked — Plus+'
        ),
      },
    ];
  }, [activeQuotas, isAr, vm.usage]);

  if (authLoading) {
    return (
      <SPage maxWidth={1180}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <SSkeleton height={84} radius={16} />
          <SSkeleton height={160} radius={20} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
            {[1, 2, 3].map((i) => (
              <SSkeleton key={i} height={410} radius={22} />
            ))}
          </div>
        </div>
      </SPage>
    );
  }

  if (!isAuthenticated || !hasActiveToken || currentUser?.role !== 'center') {
    return <Navigate to="/login" replace />;
  }

  return (
    <SPage maxWidth={1180}>
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
          paddingBottom: '48px',
          fontFamily: isRtl
            ? 'var(--font-arabic), "Cairo", system-ui, sans-serif'
            : 'var(--font-heading), "Outfit", sans-serif',
          minWidth: 0,
        }}
      >
        {/* ── 1. Unified Page Header ── */}
        <SPageHeader
          title={isAr ? 'الباقات والاشتراك للسنتر' : 'Center Plans & Subscriptions'}
          info={
            isAr
              ? 'إدارة باقة السنتر (مجاني 20 مستخدم • بلس 200 ج.م/شهر • برو 400 ج.م/شهر)، متابعة حدود الاستخدام الحية، والفواتير الرسمية.'
              : 'Manage your center plan (Free 20 users • Plus 200 EGP/mo • Pro 400 EGP/mo), live quota usage, and official invoices.'
          }
          action={
            <SButton
              variant="ghost"
              size="sm"
              disabled={vm.loading || vm.refreshing}
              icon={<RefreshCw size={14} className={vm.refreshing ? 'animate-spin' : ''} />}
              onClick={vm.handleRefresh}
            >
              {isAr ? 'تحديث' : 'Refresh'}
            </SButton>
          }
        />

        {/* ── Redirect Highlight Banner (when navigated from a locked Center feature) ── */}
        {requestedPlanInfo &&
          activeTier !== requestedPlanInfo.tier &&
          !(requestedPlanInfo.tier === 'plus' && activeTier === 'pro') && (
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
                      : `To unlock this feature, cancel your active plan first and then subscribe to ${requestedPlanInfo.nameEn}.`
                    : isAr
                      ? `لفتح الميزة التي طلبتها، قم بالترقية الآن إلى ${requestedPlanInfo.nameAr}.`
                      : `To unlock the requested feature, upgrade now to ${requestedPlanInfo.nameEn}.`}
                </span>
              </div>

              {vm.mustCancelToSwitch && (
                <SButton
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    vm.openCancelModal(
                      vm.plans.find((p) => p.tier === requestedPlanInfo.tier) || null
                    )
                  }
                >
                  {isAr ? 'إلغاء الاشتراك الحالي للتبديل' : 'Cancel Active Plan to Switch'}
                </SButton>
              )}
            </div>
          )}

        {/* ── Notice Banner ── */}
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
                vm.notice.type === 'success'
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(21, 136, 199, 0.08)',
              border: `1px solid ${
                vm.notice.type === 'success'
                  ? 'rgba(16, 185, 129, 0.35)'
                  : 'rgba(21, 136, 199, 0.28)'
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
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                fontWeight: '800',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: 'inherit',
              }}
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
            <SButton variant="ghost" size="sm" onClick={vm.handleRefresh}>
              {isAr ? 'إعادة المحاولة' : 'Retry'}
            </SButton>
          </div>
        )}

        {vm.loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <SSkeleton height={165} radius={22} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {[1, 2, 3].map((i) => (
                <SSkeleton key={i} height={420} radius={24} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* ── 2. Active Subscription Banner (with Cancel Subscription Button) ── */}
            <ActiveSubscriptionBanner
              activeSub={vm.activeSub}
              lang={lang}
              isRtl={isRtl}
              subtitleOverride={centerBannerSubtitle}
              hideUpgrade={vm.mustCancelToSwitch}
              upgradeLabelOverride={
                isAr ? 'الترقية إلى باقة بلس (200 ج.م)' : 'Upgrade to Center Plus (200 EGP)'
              }
              onUpgrade={vm.mustCancelToSwitch ? undefined : vm.handleUpgradeFromBanner}
              onCancel={vm.mustCancelToSwitch ? () => vm.openCancelModal(null) : null}
              isCancelling={vm.isCancelling}
              cancelLabel={isAr ? 'إلغاء الاشتراك الحالي' : 'Cancel Subscription'}
            />

            {/* ── 3. Live Quota Consumption Strip (Zero Static Numbers) ── */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 175px), 1fr))',
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
                      border: `1px solid ${item.isFull ? 'rgba(245, 158, 11, 0.45)' : 'var(--border-subtle)'}`,
                      borderRadius: '16px',
                      padding: '14px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                        {item.label}
                      </span>
                      <Icon size={15} color={item.isFull ? '#D97706' : 'var(--primary)'} />
                    </div>
                    <div
                      style={{
                        fontSize: item.isLocked ? '12.5px' : '16.5px',
                        fontWeight: '900',
                        color: item.isFull ? '#D97706' : 'var(--text-primary)',
                      }}
                    >
                      {item.text}
                    </div>
                    {!item.isLocked && item.ratio > 0 && (
                      <div
                        style={{
                          height: '5px',
                          borderRadius: '99px',
                          backgroundColor: 'var(--bg-subtle)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${item.ratio}%`,
                            height: '100%',
                            backgroundColor: item.isFull ? '#D97706' : 'var(--primary)',
                            borderRadius: '99px',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── 4. Cancel-Before-Switch Policy Banner (when currently on paid tier) ── */}
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
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span>{isAr ? 'تغيير الباقة يتطلب إلغاء الاشتراك الحالي أولاً' : 'Switching plans requires cancelling first'}</span>
                    <InfoTooltip
                      text={isAr
                        ? 'للانتقال من اشتراكك الحالي إلى باقة أخرى (أو تغيير مدة الاشتراك)، يجب إلغاء الاشتراك الحالي أولاً ثم الاشتراك في الباقة الجديدة.'
                        : 'To switch from your active plan to another tier (or change billing period), you must cancel your active subscription first.'}
                    />
                  </span>
                </div>
                <SButton
                  variant="danger"
                  size="sm"
                  onClick={() => vm.openCancelModal(null)}
                >
                  {isAr ? 'إلغاء الاشتراك الحالي' : 'Cancel Current Plan'}
                </SButton>
              </div>
            )}

            {/* ── 5. Three Official Center Subscription Tiers ── */}
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
                  <h3 style={{ fontSize: '19.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{isAr ? 'باقات الاشتراك المعتمدة للسناتر' : 'Official Center Subscription Tiers'}</span>
                    <InfoTooltip
                      text={isAr
                        ? 'مجاني (20 مستخدم) • بلس (200 ج.م/شهر — باركود وجدول وموظفون) • برو (400 ج.م/شهر — مفتوح بالكامل + رقابة وتقارير)'
                        : 'Free (20 users) • Plus (200 EGP/mo — QR, Schedule & Staff) • Pro (400 EGP/mo — Unlimited + Audit & Reports)'}
                    />
                  </h3>
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
                          padding: '8px 14px',
                          borderRadius: '99px',
                          border: 'none',
                          backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                          color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                          fontWeight: isSelected ? '900' : '700',
                          fontSize: '12.5px',
                          fontFamily: 'inherit',
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
                              backgroundColor: isSelected
                                ? 'rgba(255, 255, 255, 0.22)'
                                : 'rgba(21, 136, 199, 0.12)',
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

              {/* Pro Highlight Strip */}
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
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span>{isAr ? 'كود الخصم CENTER2026 — خصم 20%' : 'Promo code CENTER2026 — 20% off'}</span>
                  <InfoTooltip
                    text={isAr
                      ? 'يمكنك استخدام كود الخصم CENTER2026 عند الدفع للحصول على خصم فوري 20% على أي باقة مدفوعة.'
                      : 'Use promo code CENTER2026 during checkout for an instant 20% discount on any paid tier.'}
                  />
                </span>
              </div>

              {/* 3 Plans Grid */}
              <div
                ref={plansGridRef}
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
                      isHighlighted={Boolean(
                        requestedPlanInfo && requestedPlanInfo.tier === plan.tier && !isCurrent
                      )}
                      switchBlocked={isSwitchBlocked}
                      switchBlockedLabel={
                        plan.tier === 'free'
                          ? isAr
                            ? 'ألغِ اشتراكك للعودة للمجاني'
                            : 'Cancel plan to return to Free'
                          : isAr
                            ? 'ألغِ اشتراكك الحالي أولاً للتبديل'
                            : 'Cancel active plan first to switch'
                      }
                      freeActionLabel={
                        isAr ? 'باقتك المجانية الافتراضية' : 'Default Free Tier'
                      }
                      onSelectPlan={vm.handleSelectPlan}
                    />
                  );
                })}
              </div>
            </div>

            {/* ── 6. Official Invoices List ── */}
            <BillingInvoicesList invoices={vm.invoices} lang={lang} isRtl={isRtl} />
          </>
        )}

        {/* ── 7. Cancel Subscription Confirmation Modal ── */}
        {vm.cancelModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
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
                    : `To switch to "${vm.pendingSwitchTarget.nameEn || vm.pendingSwitchTarget.nameAr}", cancel your active subscription first. Checkout for the new plan opens immediately after cancellation.`
                  : isAr
                    ? `هل أنت متأكد من إلغاء اشتراكك النشط في «${vm.activeSub?.planNameAr || ''}»؟ سيعود السنتر فوراً إلى الباقة المجانية (20 مستخدم نشط) وستُقفل المميزات المدفوعة حتى تشترك مجدداً، مع الاحتفاظ بجميع بياناتك دون حذف.`
                    : `Are you sure you want to cancel "${vm.activeSub?.planNameEn || vm.activeSub?.planNameAr || ''}"? Your center will revert to the Free plan (20 active users) and paid features will lock until you subscribe again. All existing data stays safe.`}
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
                <SButton
                  variant="ghost"
                  size="md"
                  disabled={vm.isCancelling}
                  onClick={vm.closeCancelModal}
                >
                  {isAr ? 'تراجع' : 'Keep Plan'}
                </SButton>

                <button
                  type="button"
                  disabled={vm.isCancelling}
                  onClick={vm.handleConfirmCancel}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '800',
                    fontFamily: 'inherit',
                    cursor: vm.isCancelling ? 'wait' : 'pointer',
                    opacity: vm.isCancelling ? 0.75 : 1,
                  }}
                >
                  {vm.isCancelling && <Loader2 size={14} className="animate-spin" />}
                  <span>
                    {vm.pendingSwitchTarget
                      ? isAr
                        ? 'إلغاء الحالي والانتقال للباقة الجديدة'
                        : 'Cancel & Switch Plan'
                      : isAr
                        ? 'نعم، إلغاء الاشتراك الحالي'
                        : 'Yes, Cancel Subscription'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 8. Electronic Checkout Modal ── */}
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

export default CenterBillingView;
