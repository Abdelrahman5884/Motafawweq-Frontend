import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { DEFAULT_SCORING_RULES, LEAGUE_TIERS } from './leagueConstants';

const RULE_ACCENTS = ['#8B5CF6', '#0EA5E9', '#10B981', '#D97706', '#EF4444'];

export const LeagueScoringRulesCard = ({ scoringRules, tiers, lang, isMobile }) => {
  const isAr = lang === 'ar';
  const [expanded, setExpanded] = useState(false);

  const rules = Array.isArray(scoringRules) && scoringRules.length > 0
    ? scoringRules
    : DEFAULT_SCORING_RULES;

  const tierList = Array.isArray(tiers) && tiers.length > 0
    ? tiers.map((t) => ({
        id: t.id,
        label: isAr ? (t.nameAr || t.id) : (t.nameEn || t.id),
        minXp: Number(t.minXp ?? 0),
        color: t.color || '#64748B',
      }))
    : LEAGUE_TIERS.map((t) => ({
        id: t.id,
        label: isAr ? t.fullLabelAr : t.labelEn,
        minXp: t.minXp,
        color: t.color,
      }));

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '18px',
        padding: isMobile ? '14px' : '16px 20px',
        marginBottom: '22px',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div
        onClick={() => setExpanded((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setExpanded((v) => !v);
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          cursor: 'pointer',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              backgroundColor: 'rgba(21, 136, 199, 0.12)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FileText size={16} />
          </div>
          <div>
            <h4 style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {isAr ? 'قواعد احتساب النقاط ومستويات الدوري الرسمية' : 'Official Scoring Rules & League Tiers'}
            </h4>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              {isAr
                ? 'احتساب تلقائي من السيرفر: مقالي (+5) • اختياري (+3) • صح وخطأ (+1) • فول مارك (+3) • ستريك (+3/يوم)'
                : 'Server-computed: Essay (+5) • MCQ (+3) • True/False (+1) • Full Mark (+3) • Streak (+3/day)'}
            </p>
          </div>
        </div>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11.5px',
            fontWeight: '700',
            color: 'var(--primary)',
          }}
        >
          <span>{expanded ? (isAr ? 'إخفاء التفاصيل' : 'Hide details') : (isAr ? 'عرض القواعد والمستويات' : 'Show details')}</span>
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </div>

      {expanded && (
        <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px',
              marginBottom: '12px',
            }}
          >
            {rules.map((rule, idx) => {
              const accent = RULE_ACCENTS[idx % RULE_ACCENTS.length];
              return (
                <div
                  key={rule.id || idx}
                  style={{
                    padding: '11px 13px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: accent }}>
                      {isAr ? rule.titleAr : (rule.titleEn || rule.titleAr)}
                    </span>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: '900',
                        padding: '2px 7px',
                        borderRadius: '6px',
                        backgroundColor: `${accent}1F`,
                        color: accent,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isAr ? rule.pointsLabelAr : (rule.pointsLabelEn || rule.pointsLabelAr)}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {isAr ? rule.descAr : (rule.descEn || rule.descAr)}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              padding: '10px 12px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-subtle)',
            }}
          >
            <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {isAr ? 'مستويات الدوري:' : 'League Tiers:'}
            </span>
            {tierList.map((t) => (
              <span
                key={t.id}
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '3px 9px',
                  borderRadius: '8px',
                  backgroundColor: `${t.color}1C`,
                  color: t.color,
                }}
              >
                {t.label} ({t.minXp}+ XP)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeagueScoringRulesCard;
