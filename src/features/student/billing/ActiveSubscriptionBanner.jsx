import React from 'react';
import { ShieldCheck, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

export const ActiveSubscriptionBanner = ({ activeSub, lang = 'ar', isRtl = true, onUpgrade }) => {
  const isAr = lang === 'ar';

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1.5px solid rgba(21, 136, 199, 0.25)',
        borderRadius: '24px',
        padding: '24px 28px',
        marginBottom: '36px',
        boxShadow: '0 10px 30px rgba(6, 37, 78, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        background: 'linear-gradient(135deg, rgba(21, 136, 199, 0.07) 0%, rgba(255, 255, 255, 0.98) 50%, rgba(6, 37, 78, 0.03) 100%)',
        position: 'relative',
        overflow: 'hidden',
        direction: isRtl ? 'rtl' : 'ltr',
        fontFamily: isRtl ? 'var(--font-arabic), "Cairo", system-ui, sans-serif' : 'var(--font-heading), "Outfit", sans-serif'
      }}
    >
      {/* Decorative subtle platform curve glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          insetInlineEnd: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(21, 136, 199, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
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
              border: '1px solid rgba(21, 136, 199, 0.25)',
              fontSize: '11.5px',
              fontWeight: '900'
            }}
          >
            <ShieldCheck size={14} color="var(--primary)" />
            <span>{isAr ? 'اشتراك نشط وسارٍ' : 'Active Subscription'}</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              fontWeight: '600'
            }}
          >
            <Calendar size={13} color="var(--text-muted)" />
            <span>
              {isAr
                ? `ينتهي في ${activeSub.renewalDate} (متبقي ${activeSub.daysRemaining} يوماً)`
                : `Renews on ${activeSub.renewalDate} (${activeSub.daysRemaining} days remaining)`}
            </span>
          </div>
        </div>

        {/* Plan Title */}
        <h2
          style={{
            fontSize: '22px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            lineHeight: 1.3,
            letterSpacing: '-0.3px'
          }}
        >
          {isAr ? activeSub.planNameAr : (activeSub.planNameEn || activeSub.planNameAr)}
        </h2>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '13.5px',
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            marginBottom: '14px'
          }}
        >
          {isAr
            ? 'مفعّل لكافة مقررات الثانوية العامة، الكويزات الذكية، وتحميل الملازم والمذكرات بنظام البابل شيت بدون أي قيود.'
            : 'Unlimited access to all Thanawya Amma lectures, AI smart quizzes, and downloadable study booklets.'}
        </div>

        {/* Feature Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {[
            isAr ? 'شهادات رسمية بكود QR' : 'QR Certificates',
            isAr ? 'تحويل المحاضرات الذكي' : 'AI Transcripts',
            isAr ? 'مناهج وزارة التربية والتعليم' : 'Ministry Curriculum',
            isAr ? 'تقارير أسبوعية لولي الأمر' : 'Parent Reports'
          ].map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '11px',
                fontWeight: '800',
                padding: '3px 10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(6, 37, 78, 0.04)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
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
          zIndex: 2
        }}
      >
        <div
          style={{
            padding: '14px 22px',
            borderRadius: '18px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'center',
            minWidth: '150px'
          }}
        >
          <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '2px' }}>
            {isAr ? 'قيمة باقتك الحالية' : 'Plan Value'}
          </div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-0.5px' }}>
            {activeSub.amountEgp?.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
          </div>
        </div>

        {onUpgrade && (
          <button
            onClick={onUpgrade}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(21, 136, 199, 0.08)',
              color: 'var(--primary)',
              border: '1px solid rgba(21, 136, 199, 0.25)',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(21, 136, 199, 0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(21, 136, 199, 0.08)'}
          >
            <Sparkles size={13} />
            <span>{isAr ? 'الترقية للباقة السنوية (وفر 350 ج.م)' : 'Upgrade to Annual Pass (Save 350 EGP)'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

