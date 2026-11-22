import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Crown, Sparkles, ArrowLeft, ArrowRight, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SPage, SCard, SButton, SBadge, SSkeleton } from '../student/ui';
import {
  TEACHER_PLANS,
  getTeacherFeatureGate,
  hasTeacherFeatureAccess,
  normalizeTeacherPlanTier,
} from '../../constants/teacherPlanFeatures';

/**
 * Wraps any paid teacher feature route or inline tab.
 * - While auth/subscription is loading, renders a minimal skeleton (no false lock flash).
 * - If teacher's active subscription does not cover `feature`, renders a clear lock screen
 *   naming the exact required subscription plan with a direct link to `/teacher/billing?plan=...`.
 * - Never mounts gated children (and therefore triggers zero blocked API calls) while locked.
 */
export const TeacherSubscriptionGate = ({ feature, inline = false, children }) => {
  const navigate = useNavigate();
  const { authLoading, teacherPlanTier } = useAuth();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const gate = getTeacherFeatureGate(feature);
  if (!gate) return children;

  if (authLoading) {
    const skeleton = (
      <div style={{ padding: inline ? '40px 0' : '64px 0', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <SSkeleton width="72px" height={72} radius={36} />
        <SSkeleton width="260px" height={24} radius={8} />
        <SSkeleton width="360px" height={16} radius={8} />
      </div>
    );
    return inline ? skeleton : <SPage maxWidth={720}>{skeleton}</SPage>;
  }

  const currentTier = normalizeTeacherPlanTier(teacherPlanTier);
  if (hasTeacherFeatureAccess(currentTier, feature)) {
    return children;
  }

  const currentPlan = TEACHER_PLANS[currentTier] || TEACHER_PLANS.free;
  const requiredPlan = TEACHER_PLANS[gate.requiredTier] || TEACHER_PLANS.plus;
  const isPro = requiredPlan.tier === 'pro';
  const needsCancelFirst = currentTier !== 'free';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

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
        {/* Lock Icon Emblem */}
        <div
          style={{
            width: '74px',
            height: '74px',
            borderRadius: '22px',
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
          <Lock size={32} />
        </div>

        {/* Current Plan Pill */}
        <div style={{ marginBottom: '12px' }}>
          <SBadge variant="default" size="sm">
            {isAr
              ? `باقتك الحالية: ${currentPlan.nameAr}`
              : `Current Plan: ${currentPlan.nameEn}`}
          </SBadge>
        </div>

        {/* Title */}
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

        {/* Clear Subscription Notice */}
        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            margin: '0 auto 20px',
            maxWidth: '500px',
          }}
        >
          {isAr ? gate.descAr : gate.descEn}
        </p>

        {/* Highlighted Required Plan Box */}
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
                {isAr ? 'الاشتراك المطلوب لفتح هذه الميزة:' : 'Required Subscription to Unlock:'}
              </div>
              <div style={{ fontSize: '15.5px', fontWeight: '900', color: 'var(--primary)', marginTop: '2px' }}>
                {isAr ? requiredPlan.nameAr : requiredPlan.nameEn}
                {!isPro && (
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginInlineStart: '6px' }}>
                    {isAr ? '(أو باقة المعلم برو Pro)' : '(or Teacher Pro)'}
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

        {/* Cancel-Before-Switch Guidance when Teacher is already on Plus */}
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
                ? `للانتقال من ${currentPlan.nameAr} إلى ${requiredPlan.nameAr}، يرجى إلغاء اشتراكك الحالي أولاً من صفحة الباقات.`
                : `To switch from ${currentPlan.nameEn} to ${requiredPlan.nameEn}, please cancel your current active subscription first on the Billing page.`}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <SButton
            variant="primary"
            size="lg"
            icon={<Crown size={17} />}
            iconEnd={<ArrowIcon size={16} />}
            onClick={() => navigate(`/teacher/billing?plan=${requiredPlan.tier}`)}
          >
            {isAr
              ? `اشترك الآن في ${requiredPlan.nameAr}`
              : `Subscribe to ${requiredPlan.nameEn}`}
          </SButton>

          {!inline && (
            <SButton
              variant="ghost"
              size="lg"
              onClick={() => navigate('/teacher/dashboard')}
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

export default TeacherSubscriptionGate;
