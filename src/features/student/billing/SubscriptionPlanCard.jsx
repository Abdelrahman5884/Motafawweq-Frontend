import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const SubscriptionPlanCard = ({ plan, lang, isRtl, onSelectPlan }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: plan.popular ? `2px solid ${plan.color}` : '1.5px solid var(--border-medium)',
        borderRadius: '24px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        boxShadow: plan.popular ? '0 12px 36px rgba(21, 136, 199, 0.18)' : 'var(--shadow-sm)'
      }}
    >
      {plan.popular && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          right: isRtl ? '24px' : 'auto',
          left: isRtl ? 'auto' : '24px',
          backgroundColor: plan.color,
          color: '#FFFFFF',
          fontSize: '11px',
          fontWeight: '900',
          padding: '4px 12px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(21, 136, 199, 0.3)'
        }}>
          {plan.badgeAr}
        </div>
      )}

      <div>
        <h4 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
          {plan.nameAr}
        </h4>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          {plan.periodAr}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
          <span style={{ fontSize: '32px', fontWeight: '900', color: plan.color }}>
            {plan.priceEgp}
          </span>
          <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-secondary)' }}>
            {lang === 'ar' ? 'ج.م' : 'EGP'}
          </span>
          {plan.originalPriceEgp && (
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              {plan.originalPriceEgp} ج.م
            </span>
          )}
        </div>

        {/* Features List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {plan.featuresAr.map((f, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} color={plan.color} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subscribe CTA */}
      <button
        onClick={() => onSelectPlan(plan)}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '14px',
          backgroundColor: plan.color,
          color: '#FFFFFF',
          border: 'none',
          fontSize: '14px',
          fontWeight: '900',
          cursor: 'pointer',
          boxShadow: `0 4px 14px ${plan.color}40`
        }}
      >
        {lang === 'ar' ? 'اختيار هذه الباقة' : 'Select Plan'}
      </button>
    </div>
  );
};
