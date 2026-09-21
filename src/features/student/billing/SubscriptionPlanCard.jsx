import React from 'react';
import { CheckCircle2, XCircle, Sparkles, ArrowRight, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';

export const SubscriptionPlanCard = ({
  plan,
  period = 'monthly',
  lang = 'ar',
  isRtl = true,
  onSelectPlan,
  isCurrentPlan
}) => {
  const isAr = lang === 'ar';

  // Dynamic pricing based on selected period (monthly, term, annual)
  const currentPricing = plan.pricing?.[period] || {
    priceEgp: plan.priceEgp,
    originalPriceEgp: plan.originalPriceEgp,
    periodAr: plan.periodAr,
    periodEn: plan.periodEn,
    badgeAr: plan.badgeAr,
    badgeEn: plan.badgeEn
  };

  const name = isAr ? plan.nameAr : (plan.nameEn || plan.nameAr);
  const periodLabel = isAr ? currentPricing.periodAr : (currentPricing.periodEn || currentPricing.periodAr);
  const badge = isAr ? currentPricing.badgeAr : (currentPricing.badgeEn || currentPricing.badgeAr);
  const features = isAr ? plan.featuresAr : (plan.featuresEn || plan.featuresAr);
  const limitations = isAr ? (plan.limitationsAr || []) : (plan.limitationsEn || plan.limitationsAr || []);

  const isFree = plan.tier === 'free' || plan.id === 'plan-free';
  const isPlus = plan.tier === 'plus' || plan.id === 'plan-plus';
  const isPro = plan.tier === 'pro' || plan.id === 'plan-pro' || plan.popular;

  // Unified Motafawweq Platform Brand Palette (ZERO green)
  const cardBorderColor = isCurrentPlan
    ? 'var(--primary)'
    : isPro
    ? 'var(--primary)'
    : isPlus
    ? 'rgba(2, 132, 199, 0.35)'
    : 'var(--border-subtle)';

  const cardShadow = isPro
    ? '0 16px 44px rgba(21, 136, 199, 0.18)'
    : isPlus
    ? '0 10px 28px rgba(6, 37, 78, 0.08)'
    : 'var(--shadow-sm)';

  const accentColor = isPro
    ? '#1588C7'
    : isPlus
    ? '#0284C7'
    : 'var(--text-secondary)';

  return (
    <div
      className={`subscription-plan-card ${isPro ? 'subscription-plan-card--popular' : ''}`}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: `2px solid ${cardBorderColor}`,
        borderRadius: '26px',
        padding: '30px 24px 26px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        boxShadow: cardShadow,
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        direction: isRtl ? 'rtl' : 'ltr',
        fontFamily: isRtl ? 'var(--font-arabic), "Cairo", system-ui, sans-serif' : 'var(--font-heading), "Outfit", sans-serif'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = isPro
          ? '0 22px 52px rgba(21, 136, 199, 0.25)'
          : '0 14px 32px rgba(6, 37, 78, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = cardShadow;
      }}
    >
      {/* ── Top Badge Chip (Embedded, sleek pill) ── */}
      {(badge || isCurrentPlan) && (
        <div
          style={{
            position: 'absolute',
            top: '-13px',
            insetInlineStart: '24px',
            backgroundColor: isCurrentPlan
              ? 'var(--primary)'
              : isPro
              ? 'var(--primary)'
              : isPlus
              ? '#0284C7'
              : '#06254E',
            color: '#FFFFFF',
            fontSize: '11.5px',
            fontWeight: '900',
            padding: '5px 14px',
            borderRadius: '99px',
            boxShadow: '0 6px 16px rgba(6, 37, 78, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            letterSpacing: isAr ? '0' : '0.3px',
            border: '1.5px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {isCurrentPlan ? (
            <>
              <ShieldCheck size={13} color="#FFFFFF" />
              <span>{isAr ? 'باقتك الحالية' : 'Current Plan'}</span>
            </>
          ) : isPro ? (
            <>
              <Sparkles size={13} color="#FFFFFF" />
              <span>{badge}</span>
            </>
          ) : isPlus ? (
            <>
              <Zap size={13} color="#FFFFFF" />
              <span>{badge}</span>
            </>
          ) : (
            <span>{badge}</span>
          )}
        </div>
      )}

      <div>
        {/* Plan Title & Subheading */}
        <div style={{ marginBottom: '14px', marginTop: (badge || isCurrentPlan) ? '4px' : '0' }}>
          <h4
            style={{
              fontSize: '21px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
              lineHeight: 1.3,
              letterSpacing: '-0.3px'
            }}
          >
            {name}
          </h4>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {periodLabel}
          </div>
        </div>

        {/* Price Section */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '38px',
                fontWeight: '900',
                color: isFree ? 'var(--text-primary)' : accentColor,
                lineHeight: 1,
                letterSpacing: '-1px'
              }}
            >
              {isFree ? (isAr ? 'مجاناً' : 'Free') : currentPricing.priceEgp?.toLocaleString()}
            </span>

            {!isFree && (
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                {isAr ? 'ج.م' : 'EGP'}
              </span>
            )}

            {currentPricing.originalPriceEgp && (
              <span
                style={{
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  textDecoration: 'line-through',
                  fontWeight: '700',
                  marginInlineStart: '4px'
                }}
              >
                {currentPricing.originalPriceEgp?.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
              </span>
            )}
          </div>

          {/* Discount Pill if available */}
          {currentPricing.originalPriceEgp && (
            <div style={{ marginTop: '8px' }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(21, 136, 199, 0.1)',
                  color: 'var(--primary)',
                  border: '1px solid rgba(21, 136, 199, 0.2)'
                }}
              >
                {isAr
                  ? `وفر ${(currentPricing.originalPriceEgp - currentPricing.priceEgp).toLocaleString()} ج.م عند الاشتراك`
                  : `Save ${(currentPricing.originalPriceEgp - currentPricing.priceEgp).toLocaleString()} EGP`}
              </span>
            </div>
          )}
        </div>

        {/* Platform Divider */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, var(--border-subtle) 20%, var(--border-subtle) 80%, transparent 100%)',
            marginBottom: '22px'
          }}
        />

        {/* Included Features List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: limitations.length ? '18px' : '32px' }}>
          {features.map((f, idx) => (
            <div
              key={`feat-${idx}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                fontSize: '13.5px',
                color: 'var(--text-primary)',
                lineHeight: 1.55
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: isPro
                    ? 'rgba(21, 136, 199, 0.14)'
                    : isPlus
                    ? 'rgba(2, 132, 199, 0.12)'
                    : 'rgba(6, 37, 78, 0.08)',
                  color: isPro ? 'var(--primary)' : isPlus ? '#0284C7' : '#06254E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1.5px'
                }}
              >
                <CheckCircle2 size={13} strokeWidth={2.6} />
              </div>
              <span style={{ fontWeight: '600' }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Excluded Limitations (Clear & Transparent as user requested!) */}
        {limitations.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px', paddingTop: '10px', borderTop: '1px dashed var(--border-subtle)' }}>
            {limitations.map((lim, idx) => (
              <div
                key={`lim-${idx}`}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontSize: '12.5px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(100, 116, 139, 0.1)',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  <XCircle size={12} strokeWidth={2} />
                </div>
                <span style={{ textDecoration: 'line-through' }}>{lim}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subscribe CTA Button (Platform Palette) */}
      <button
        onClick={() => onSelectPlan?.({ ...plan, ...currentPricing })}
        style={{
          width: '100%',
          padding: '14px 20px',
          borderRadius: '16px',
          backgroundColor: isCurrentPlan
            ? 'var(--bg-subtle)'
            : isPro
            ? 'var(--primary)'
            : isPlus
            ? '#0284C7'
            : 'var(--bg-subtle)',
          color: isCurrentPlan
            ? 'var(--text-primary)'
            : (isPro || isPlus)
            ? '#FFFFFF'
            : 'var(--text-primary)',
          border: isCurrentPlan || isFree
            ? '1.5px solid var(--border-medium)'
            : 'none',
          fontSize: '14px',
          fontWeight: '900',
          cursor: 'pointer',
          boxShadow: isCurrentPlan || isFree
            ? 'none'
            : isPro
            ? '0 8px 22px rgba(21, 136, 199, 0.35)'
            : '0 8px 22px rgba(2, 132, 199, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          if (!isCurrentPlan) {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.opacity = '0.95';
          }
        }}
        onMouseLeave={(e) => {
          if (!isCurrentPlan) {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.opacity = '1';
          }
        }}
      >
        <span>
          {isCurrentPlan
            ? (isAr ? 'باقتك الحالية المفعّلة' : 'Current Active Plan')
            : isFree
            ? (isAr ? 'البدء مجاناً الآن' : 'Start Free')
            : (isAr ? `الاشتراك في ${name}` : `Select ${name}`)}
        </span>
        {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
      </button>
    </div>
  );
};

