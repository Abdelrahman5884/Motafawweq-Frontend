import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';

export const LeagueRulesTab = ({ rules = [], tiers = [], currentTier = '', lang = 'ar' }) => {
  const isAr = lang === 'ar';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'lgFadeIn 0.2s ease' }}>
      {/* Live Official Scoring Rules from Backend */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <ShieldCheck size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
            {isAr ? 'قواعد احتساب النقاط المعتمدة في المنصة' : 'Official Scoring Rules'}
          </h3>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 18px 0' }}>
          {isAr
            ? 'تُحتسب نقاط الدوري تلقائياً على السيرفر فور إتمام كل نشاط دون أي تدخل يدوي:'
            : 'League XP is automatically calculated and verified on the server for every completed activity:'}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))',
            gap: '12px',
          }}
        >
          {rules.map((rule) => (
            <div
              key={rule.id}
              style={{
                padding: '16px 18px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {isAr ? rule.titleAr : rule.titleEn}
                </span>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: '900',
                    padding: '3px 9px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--primary-surface)',
                    color: 'var(--primary)',
                    flexShrink: 0,
                  }}
                >
                  {isAr ? rule.pointsLabelAr : rule.pointsLabelEn}
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {isAr ? rule.descAr : rule.descEn}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Tier Threshold Ladder from Backend LeagueTier Enum */}
      {tiers.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Award size={18} color="#D97706" />
            <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
              {isAr ? 'سُلّم المستويات والترقيات في الدوري' : 'League Tiers & Promotion Thresholds'}
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
            {isAr
              ? 'يرتقي مستواك تلقائياً بمجرد وصول مجموع نقاطك إلى الحد الأدنى لكل مستوى، ويُكسر التعادل بعدد أيام الاستمرار:'
              : 'Your tier upgrades automatically upon crossing each XP threshold; ties are broken by streak days:'}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
              gap: '12px',
            }}
          >
            {tiers.map((tier) => {
              const isCurrent = currentTier === tier.id;
              const rangeLabel =
                tier.maxXp !== null && tier.maxXp !== undefined
                  ? `${Number(tier.minXp).toLocaleString()} – ${Number(tier.maxXp).toLocaleString()} XP`
                  : `${Number(tier.minXp).toLocaleString()}+ XP`;

              return (
                <div
                  key={tier.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '14px',
                    backgroundColor: isCurrent ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                    border: `1.5px solid ${isCurrent ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '900', color: tier.color || 'var(--text-primary)' }}>
                      {isAr ? tier.nameAr : tier.nameEn}
                    </span>
                    {isCurrent && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '1px 6px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                        }}
                      >
                        {isAr ? 'مستواك' : 'Current'}
                      </span>
                    )}
                  </div>
                  <div dir="ltr" style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    {rangeLabel}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
