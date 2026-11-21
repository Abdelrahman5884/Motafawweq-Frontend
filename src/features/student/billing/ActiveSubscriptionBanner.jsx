import React from 'react';
import { ShieldCheck, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

export const ActiveSubscriptionBanner = ({ activeSub, lang = 'ar', isRtl = true, onUpgrade }) => {
  const isAr = lang === 'ar';

  if (!activeSub) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: '20px',
          padding: '28px 24px',
          textAlign: 'center',
          direction: isRtl ? 'rtl' : 'ltr',
        }}
      >
        <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
          {isAr ? 'لا يوجد اشتراك نشط حالياً' : 'No Active Subscription'}
        </div>
        <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
          {isAr
            ? 'اختر الباقة المناسبة لك من الباقات المتاحة بالأسفل.'
            : 'Choose a subscription tier from the plans below.'}
        </div>
      </div>
    );
  }

  const tier = activeSub.planTier || 'free';
  const isFree = Boolean(activeSub.isFree || tier === 'free' || Number(activeSub.amountEgp || 0) === 0);
  const isMaxPlan = tier === 'pro' && activeSub.billingPeriod === 'annual';

  const highlights = isAr
    ? Array.isArray(activeSub.highlightsAr) && activeSub.highlightsAr.length > 0
      ? activeSub.highlightsAr
      : ['الحصص والمقررات', 'الاختبارات التقييمية', 'الشهادات المعتمدة بـ QR']
    : Array.isArray(activeSub.highlightsEn) && activeSub.highlightsEn.length > 0
      ? activeSub.highlightsEn
      : ['Courses & Lessons', 'Evaluations & Quizzes', 'Verified QR Certificates'];

  const subtitle = isFree
    ? isAr
      ? 'حسابك مفعّل على الباقة المجانية — يمكنك الترقية إلى باقة بلس أو برو في أي لحظة لفتح أدوات الذكاء الاصطناعي والاختبارات غير المحدودة.'
      : 'Your account is active on the Free tier — upgrade to Plus or Pro anytime to unlock AI tools and unlimited practice.'
    : tier === 'pro'
      ? isAr
        ? 'تمتلك كامل صلاحيات باقة برو بما في ذلك تحويل المحاضرات الذكي بالـ AI وتوليد كويزات البابل شيت الفورية والشهادات المعتمدة.'
        : 'Full Student Pro access unlocked: AI Lecture Converter, instant Bubble-Sheet quizzes, and verified certificates.'
      : isAr
        ? 'تمتلك صلاحيات باقة بلس: اختبارات تدريبية غير محدودة، تحليلات أداء تفصيلية، وشهادات إتمام رسمية بكود QR.'
        : 'Student Plus active: unlimited practice exams, detailed performance analytics, and official QR certificates.';

  const upgradeLabel =
    tier === 'pro'
      ? isAr
        ? 'الترقية للباقة السنوية (وفر 30%)'
        : 'Switch to Annual Pro (Save 30%)'
      : isAr
        ? 'الترقية إلى باقة برو (شاملة AI)'
        : 'Upgrade to Pro (AI Included)';

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1.5px solid rgba(21, 136, 199, 0.28)',
        borderRadius: '24px',
        padding: '24px 28px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        background:
          'linear-gradient(135deg, rgba(21, 136, 199, 0.08) 0%, var(--bg-surface) 55%, rgba(21, 136, 199, 0.04) 100%)',
        position: 'relative',
        overflow: 'hidden',
        direction: isRtl ? 'rtl' : 'ltr',
        fontFamily: isRtl
          ? 'var(--font-arabic), "Cairo", system-ui, sans-serif'
          : 'var(--font-heading), "Outfit", sans-serif',
      }}
    >
      {/* Decorative subtle glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          insetInlineEnd: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(21, 136, 199, 0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ flex: 1, minWidth: '280px', position: 'relative', zIndex: 2 }}>
        {/* Status Chip & Renewal Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 12px',
              borderRadius: '99px',
              backgroundColor: 'rgba(21, 136, 199, 0.12)',
              color: 'var(--primary)',
              border: '1px solid rgba(21, 136, 199, 0.28)',
              fontSize: '11.5px',
              fontWeight: '900',
            }}
          >
            <ShieldCheck size={14} color="var(--primary)" />
            <span>{isAr ? 'باقتك النشطة حالياً' : 'Active Plan'}</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              fontWeight: '700',
            }}
          >
            <Calendar size={13} color="var(--text-muted)" />
            <span>
              {isFree || !activeSub.renewalDate
                ? isAr
                  ? 'فعّالة مدى الحياة بدون تاريخ انتهاء'
                  : 'Active forever • No expiry'
                : isAr
                  ? `سارية حتى ${activeSub.renewalDate} (متبقي ${activeSub.daysRemaining ?? 0} يوم)`
                  : `Valid until ${activeSub.renewalDate} (${activeSub.daysRemaining ?? 0} days left)`}
            </span>
          </div>
        </div>

        {/* Plan Title */}
        <h2
          style={{
            fontSize: '21px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            lineHeight: 1.3,
            letterSpacing: '-0.3px',
          }}
        >
          {isAr ? activeSub.planNameAr : activeSub.planNameEn || activeSub.planNameAr}
        </h2>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '13.5px',
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            marginBottom: '14px',
          }}
        >
          {subtitle}
        </div>

        {/* Feature Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {highlights.map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '11px',
                fontWeight: '800',
                padding: '3px 10px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <CheckCircle2 size={11} color="var(--primary)" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Right Side: Price Box & Upgrade Button */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isRtl ? 'flex-start' : 'flex-end',
          gap: '12px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            padding: '14px 22px',
            borderRadius: '18px',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xs)',
            textAlign: 'center',
            minWidth: '150px',
          }}
        >
          <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '2px' }}>
            {isAr ? 'قيمة باقتك الحالية' : 'Current Plan Value'}
          </div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-0.5px' }}>
            {isFree
              ? isAr
                ? 'مجاناً'
                : 'Free'
              : `${Number(activeSub.amountEgp || 0).toLocaleString()} ${isAr ? 'ج.م' : 'EGP'}`}
          </div>
        </div>

        {onUpgrade && !isMaxPlan && (
          <button
            type="button"
            onClick={onUpgrade}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(21, 136, 199, 0.1)',
              color: 'var(--primary)',
              border: '1px solid rgba(21, 136, 199, 0.28)',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={13} />
            <span>{upgradeLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};
