import React from 'react';
import { CheckCircle2, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export const SubscriptionPlanCard = ({ plan, lang = 'ar', isRtl = true, onSelectPlan, isCurrentPlan }) => {
  const features = lang === 'ar' ? plan.featuresAr : (plan.featuresEn || plan.featuresAr);
  const badge = lang === 'ar' ? plan.badgeAr : (plan.badgeEn || plan.badgeAr);
  const name = lang === 'ar' ? plan.nameAr : (plan.nameEn || plan.nameAr);
  const period = lang === 'ar' ? plan.periodAr : (plan.periodEn || plan.periodAr);

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: plan.popular 
          ? '2px solid var(--primary)' 
          : isCurrentPlan 
          ? '2px solid var(--success)' 
          : '1.5px solid var(--border-subtle)',
        borderRadius: '24px',
        padding: '30px 26px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        boxShadow: plan.popular ? '0 12px 32px rgba(21, 136, 199, 0.16)' : 'var(--shadow-sm)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {/* Top Badge (Popular or Current Plan) */}
      {(badge || isCurrentPlan) && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          insetInlineEnd: '24px',
          backgroundColor: isCurrentPlan ? 'var(--success)' : (plan.color || 'var(--primary)'),
          color: '#FFFFFF',
          fontSize: '11px',
          fontWeight: '900',
          padding: '4px 12px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          {isCurrentPlan ? (
            <span>{lang === 'ar' ? 'باقتك الحالية' : 'Current Active Plan'}</span>
          ) : (
            <>
              <Sparkles size={12} />
              <span>{badge}</span>
            </>
          )}
        </div>
      )}

      <div>
        {/* Plan Title */}
        <h4 style={{ 
          fontSize: '19px', 
          fontWeight: '900', 
          color: 'var(--text-primary)', 
          margin: '0 0 6px 0',
          lineHeight: 1.3
        }}>
          {name}
        </h4>

        {/* Period */}
        <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          {period}
        </div>

        {/* Price display */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '36px', fontWeight: '900', color: plan.color || 'var(--primary)', lineHeight: 1 }}>
            {plan.priceEgp?.toLocaleString()}
          </span>
          <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-secondary)' }}>
            {lang === 'ar' ? 'ج.م' : 'EGP'}
          </span>
          {plan.originalPriceEgp && (
            <span style={{ 
              fontSize: '14px', 
              color: 'var(--text-muted)', 
              textDecoration: 'line-through',
              fontWeight: '600'
            }}>
              {plan.originalPriceEgp?.toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
            </span>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderBottom: '1px solid var(--border-subtle)', marginBottom: '20px' }} />

        {/* Features List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
          {features.map((f, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              <CheckCircle2 size={16} color={plan.color || 'var(--primary)'} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subscribe CTA Button */}
      <button
        onClick={() => onSelectPlan?.(plan)}
        style={{
          width: '100%',
          padding: '13px 18px',
          borderRadius: '14px',
          backgroundColor: isCurrentPlan ? 'var(--bg-subtle)' : (plan.color || 'var(--primary)'),
          color: isCurrentPlan ? 'var(--text-primary)' : '#FFFFFF',
          border: isCurrentPlan ? '1.5px solid var(--border-medium)' : 'none',
          fontSize: '14px',
          fontWeight: '900',
          cursor: 'pointer',
          boxShadow: isCurrentPlan ? 'none' : `0 6px 18px ${plan.color}35`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.15s ease'
        }}
      >
        <span>
          {isCurrentPlan 
            ? (lang === 'ar' ? 'تجديد هذه الباقة' : 'Renew This Plan') 
            : (lang === 'ar' ? 'الاشتراك في هذه الباقة' : 'Choose This Plan')}
        </span>
        {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
      </button>
    </div>
  );
};
