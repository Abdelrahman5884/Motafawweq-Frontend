import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Crown, Sparkles, ArrowLeft, ArrowRight, Info, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SPage, SCard, SButton, SBadge, SSkeleton } from '../student/ui';
import {
  CENTER_PLANS,
  getCenterFeatureGate,
  hasCenterFeatureAccess,
  normalizeCenterPlanTier,
} from '../../constants/centerPlanFeatures';

/**
 * Wraps any paid center feature route, tab, or inline section.
 * - Never mounts gated children while locked (prevents 403 noise).
 * - Clearly shows the required Center tier (Plus / Pro) with direct link to `/center/billing?plan=...`.
 */
export const CenterSubscriptionGate = ({ feature, inline = false, compact = false, children }) => {
  const navigate = useNavigate();
  const { authLoading, centerPlanTier } = useAuth();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const gate = getCenterFeatureGate(feature);
  if (!gate) return children;

  if (authLoading) {
    const skeleton = (
      <div style={{ padding: inline ? '32px 0' : '64px 0', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
        <SSkeleton width="64px" height={64} radius={20} />
        <SSkeleton width="240px" height={22} radius={8} />
        <SSkeleton width="340px" height={16} radius={8} />
      </div>
    );
    return inline ? skeleton : <SPage maxWidth={720}>{skeleton}</SPage>;
  }

  const currentTier = normalizeCenterPlanTier(centerPlanTier);
  if (hasCenterFeatureAccess(currentTier, feature)) {
    return children;
  }

  const currentPlan = CENTER_PLANS[currentTier] || CENTER_PLANS.free;
  const requiredPlan = CENTER_PLANS[gate.requiredTier] || CENTER_PLANS.plus;
  const isPro = requiredPlan.tier === 'pro';
  const needsCancelFirst = currentTier !== 'free';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  if (compact) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px dashed rgba(21, 136, 199, 0.38)',
          borderRadius: '18px',
          padding: '20px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          direction: isRtl ? 'rtl' : 'ltr',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 300px', minWidth: 0 }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              backgroundColor: 'var(--primary-surface)',
              border: '1px solid rgba(21, 136, 199, 0.25)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Lock size={21} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <span style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {isAr ? gate.titleAr : gate.titleEn}
              </span>
              <SBadge variant={isPro ? 'primary' : 'warning'} size="xs">
                <Crown size={11} />
                <span>{isAr ? requiredPlan.nameAr : requiredPlan.nameEn}</span>
              </SBadge>
            </div>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              {isAr ? gate.descAr : gate.descEn}
            </p>
          </div>
        </div>

        <SButton
          variant="primary"
          size="sm"
          icon={<Crown size={14} />}
          iconEnd={<ArrowIcon size={14} />}
          onClick={() => navigate(`/center/billing?plan=${requiredPlan.tier}`)}
        >
          {isAr
            ? `ترقية إلى ${requiredPlan.shortAr} (${requiredPlan.monthlyPriceEgp} ج.م/شهر)`
            : `Upgrade to ${requiredPlan.shortEn}`}
        </SButton>
      </div>
    );
  }

  const card = (
    <div
      style={{
        minHeight: inline ? 'auto' : 'calc(100vh - 210px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: inline ? '12px 0' : '24px 0',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <SCard
        padding={inline ? 28 : 36}
        style={{
          width: '100%',
          maxWidth: '660px',
          textAlign: 'center',
          border: '1.5px solid var(--border-medium)',
          boxShadow: 'var(--shadow-md)',
          borderRadius: '22px',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            margin: '0 auto 18px',
            background: isPro
              ? 'linear-gradient(135deg, rgba(21, 136, 199, 0.16) 0%, rgba(124, 58, 237, 0.16) 100%)'
              : 'var(--primary-surface)',
            border: `1.5px solid ${isPro ? 'rgba(21, 136, 199, 0.35)' : 'var(--primary-light)'}`,
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Lock size={30} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <SBadge variant="default" size="sm">
            {isAr
              ? `باقتك الحالية: ${currentPlan.nameAr}`
              : `Current Plan: ${currentPlan.nameEn}`}
          </SBadge>
        </div>

        <h2
          style={{
            fontSize: inline ? '19px' : '22px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: '0 0 10px',
            lineHeight: 1.35,
            fontFamily: 'var(--font-arabic)',
          }}
        >
          {isAr ? gate.titleAr : gate.titleEn}
        </h2>

        <p
          style={{
            fontSize: '13.5px',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            margin: '0 auto 20px',
            maxWidth: '500px',
          }}
        >
          {isAr ? gate.descAr : gate.descEn}
        </p>

        <div
          style={{
            padding: '16px 20px',
            borderRadius: '14px',
            backgroundColor: 'var(--primary-surface)',
            border: '1.5px solid var(--primary-light)',
            marginBottom: needsCancelFirst ? '14px' : '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            textAlign: isRtl ? 'right' : 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {isPro ? <Sparkles size={19} /> : <Crown size={19} />}
            </div>
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {isAr ? 'الباقة المطلوبة لفتح هذه الميزة:' : 'Required Plan to Unlock:'}
              </div>
              <div style={{ fontSize: '15.5px', fontWeight: '900', color: 'var(--primary)', marginTop: '2px' }}>
                {isAr ? requiredPlan.nameAr : requiredPlan.nameEn}
                {!isPro && (
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginInlineStart: '6px' }}>
                    {isAr ? '(أو باقة برو Pro)' : '(or Center Pro)'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: '13.5px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-surface)',
              padding: '6px 12px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {isAr
              ? `${requiredPlan.monthlyPriceEgp} ج.م / شهرياً`
              : `${requiredPlan.monthlyPriceEgp} EGP / mo`}
          </div>
        </div>

        {needsCancelFirst && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#B45309',
              fontSize: '12px',
              fontWeight: '800',
              marginBottom: '20px',
            }}
          >
            <Info size={15} style={{ flexShrink: 0 }} />
            <span>
              {isAr
                ? `للانتقال من ${currentPlan.nameAr} إلى ${requiredPlan.nameAr}، ألغِ اشتراكك الحالي أولاً من صفحة الباقات ثم اشترك بالباقة الجديدة.`
                : `To switch from ${currentPlan.nameEn} to ${requiredPlan.nameEn}, cancel your active subscription first on the Billing page.`}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <SButton
            variant="primary"
            size="lg"
            icon={<Crown size={17} />}
            iconEnd={<ArrowIcon size={16} />}
            onClick={() => navigate(`/center/billing?plan=${requiredPlan.tier}`)}
          >
            {isAr
              ? `الترقية إلى ${requiredPlan.nameAr}`
              : `Upgrade to ${requiredPlan.nameEn}`}
          </SButton>

          {!inline && (
            <SButton
              variant="ghost"
              size="lg"
              onClick={() => navigate('/center/dashboard')}
            >
              {isAr ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
            </SButton>
          )}
        </div>
      </SCard>
    </div>
  );

  return inline ? card : <SPage maxWidth={680}>{card}</SPage>;
};

/**
 * Reusable inline quota warning banner when the center hits a resource cap (e.g., 20 active users, 1 room, 2 groups, 1 branch).
 */
export const CenterQuotaLimitBanner = ({
  resourceLabelAr,
  resourceLabelEn,
  used,
  limit,
  planTier = 'free',
  lang = 'ar',
  isRtl = true,
}) => {
  const navigate = useNavigate();
  const isAr = lang === 'ar';
  if (limit === null || limit === undefined || used < limit) return null;

  const normalized = normalizeCenterPlanTier(planTier);
  const nextTier = normalized === 'free' ? 'plus' : 'pro';
  const nextPlan = CENTER_PLANS[nextTier];

  return (
    <div
      role="status"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '14px',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.38)',
        color: '#92400E',
        fontSize: '12.5px',
        fontWeight: '700',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flex: '1 1 280px' }}>
        <AlertTriangle size={17} color="#D97706" style={{ flexShrink: 0 }} />
        <span>
          {isAr
            ? `وصلت للحد الأقصى المسموح به لـ «${resourceLabelAr}» (${used}/${limit}) في باقتك الحالية. قم بالترقية إلى ${nextPlan.nameAr} لرفع الحد الأقصى.`
            : `You reached the maximum "${resourceLabelEn}" limit (${used}/${limit}) on your current plan. Upgrade to ${nextPlan.nameEn} to expand capacity.`}
        </span>
      </div>

      <SButton
        variant="primary"
        size="sm"
        icon={<Crown size={13} />}
        onClick={() => navigate(`/center/billing?plan=${nextTier}`)}
      >
        {isAr ? `ترقية إلى ${nextPlan.shortAr}` : `Upgrade to ${nextPlan.shortEn}`}
      </SButton>
    </div>
  );
};

export default CenterSubscriptionGate;
