import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Crown, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SPage, SCard, SButton, SBadge, SSkeleton } from './ui';
import {
  STUDENT_PLANS,
  getStudentFeatureGate,
  hasStudentFeatureAccess,
  normalizeStudentPlanTier,
} from '../../constants/studentPlanFeatures';

/**
 * Wraps any paid student feature route.
 * - While auth/subscription is loading, renders a minimal skeleton (no false lock flash).
 * - If student's active subscription does not cover `feature`, renders an empty locked screen
 *   naming the exact required subscription plan with a direct link to `/student/billing`.
 * - Never mounts gated children (and therefore triggers zero blocked API calls) while locked.
 */
export const StudentSubscriptionGate = ({ feature, children }) => {
  const navigate = useNavigate();
  const { authLoading, studentPlanTier } = useAuth();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const gate = getStudentFeatureGate(feature);
  if (!gate) return children;

  if (authLoading) {
    return (
      <SPage maxWidth={720}>
        <div style={{ padding: '64px 0', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <SSkeleton width="72px" height={72} radius={36} />
          <SSkeleton width="260px" height={24} radius={8} />
          <SSkeleton width="360px" height={16} radius={8} />
        </div>
      </SPage>
    );
  }

  const currentTier = normalizeStudentPlanTier(studentPlanTier);
  if (hasStudentFeatureAccess(currentTier, feature)) {
    return children;
  }

  const currentPlan = STUDENT_PLANS[currentTier] || STUDENT_PLANS.free;
  const requiredPlan = STUDENT_PLANS[gate.requiredTier] || STUDENT_PLANS.plus;
  const isPro = requiredPlan.tier === 'pro';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <SPage maxWidth={680}>
      <div
        style={{
          minHeight: 'calc(100vh - 210px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 0',
        }}
      >
        <SCard
          padding={36}
          style={{
            width: '100%',
            textAlign: 'center',
            border: '1.5px solid var(--border-medium)',
            boxShadow: 'var(--shadow-md)',
            borderRadius: '22px',
          }}
        >
          {/* Lock Icon Emblem */}
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '22px',
              margin: '0 auto 20px',
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
            <Lock size={34} />
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
          <h1
            style={{
              fontSize: '22px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: '0 0 10px',
              lineHeight: 1.35,
              fontFamily: 'var(--font-arabic)',
            }}
          >
            {isAr ? gate.titleAr : gate.titleEn}
          </h1>

          {/* Clear Subscription Notice */}
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: '0 auto 22px',
              maxWidth: '480px',
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
              marginBottom: '24px',
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
                  {isAr ? 'الاشتراك المطلوب لتفعيل هذه الميزة:' : 'Required Subscription:'}
                </div>
                <div style={{ fontSize: '15.5px', fontWeight: '900', color: 'var(--primary)', marginTop: '2px' }}>
                  {isAr ? requiredPlan.nameAr : requiredPlan.nameEn}
                  {!isPro && (
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginInlineStart: '6px' }}>
                      {isAr ? '(أو باقة الطالب برو Pro)' : '(or Student Pro)'}
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
                ? `تبدأ من ${requiredPlan.monthlyPriceEgp} ج.م / شهرياً`
                : `From ${requiredPlan.monthlyPriceEgp} EGP / mo`}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <SButton
              variant="primary"
              size="lg"
              icon={<Crown size={17} />}
              iconEnd={<ArrowIcon size={16} />}
              onClick={() => navigate(`/student/billing?plan=${requiredPlan.tier}`)}
            >
              {isAr
                ? `اشترك الآن في ${requiredPlan.nameAr}`
                : `Subscribe to ${requiredPlan.nameEn}`}
            </SButton>

            <SButton
              variant="ghost"
              size="lg"
              onClick={() => navigate('/student/dashboard')}
            >
              {isAr ? 'العودة للرئيسية' : 'Back to Dashboard'}
            </SButton>
          </div>
        </SCard>
      </div>
    </SPage>
  );
};

export default StudentSubscriptionGate;
