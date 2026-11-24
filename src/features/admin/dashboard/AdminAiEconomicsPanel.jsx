import React, { memo } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Cpu } from 'lucide-react';

export const AdminAiEconomicsPanel = memo(({ aiEconomics = {} }) => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const totalMinutes = Number(aiEconomics?.totalAudioMinutesProcessed || 0);
  const processingCost = Number(aiEconomics?.aiProcessingCostEgp || 0);
  const costPerMin = Number(aiEconomics?.costPerMinuteEgp ?? 0.42);
  const aiRevenue = Number(aiEconomics?.aiRevenueEgp || 0);
  const revPerMin = Number(aiEconomics?.revenuePerMinuteEgp ?? 1.6);
  const grossMargin = Math.min(100, Math.max(0, Number(aiEconomics?.grossMarginPct || 0)));

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '22px',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '11px',
            backgroundColor: 'rgba(21, 136, 199, 0.12)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Cpu size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {isAr ? 'تحليل اقتصاديات وتكاليف الذكاء الاصطناعي' : 'AI Unit Economics & Margin'}
            </h3>
            <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              {isAr ? 'مقارنة تكلفة التفريغ الصوتي بعائد باقات الذكاء الاصطناعي' : 'Transcription inference cost vs. collected AI tier revenue'}
            </span>
          </div>
        </div>
        <span style={{
          padding: '5px 12px',
          borderRadius: '999px',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          color: '#059669',
          fontSize: '12px',
          fontWeight: '800'
        }}>
          {isAr ? `هامش الربح: ${grossMargin}%` : `Gross Margin: ${grossMargin}%`}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '14px',
        marginBottom: '16px'
      }}>
        <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
            {isAr ? 'الدقائق الصوتية المعالجة' : 'Audio Minutes Transcribed'}
          </div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
            {totalMinutes.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{isAr ? 'دقيقة' : 'mins'}</span>
          </div>
        </div>

        <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
            {isAr ? 'تكلفة الخوادم والمعالجة' : 'Inference Cost'}
          </div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
            {processingCost.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{isAr ? 'ج.م' : 'EGP'}</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {isAr ? `قرابة ${costPerMin} ج.م / دقيقة` : `~${costPerMin} EGP / min`}
          </div>
        </div>

        <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
            {isAr ? 'عائد باقات الذكاء الاصطناعي' : 'Collected AI Revenue'}
          </div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary)', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
            {aiRevenue.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: '700' }}>{isAr ? 'ج.م' : 'EGP'}</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {isAr ? `قرابة ${revPerMin} ج.م / دقيقة` : `~${revPerMin} EGP / min`}
          </div>
        </div>
      </div>

      {/* Visual Margin Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
          <span>{isAr ? 'مؤشر كفاءة الهامش التشغيلي' : 'Operating Margin Efficiency'}</span>
          <span style={{ color: '#059669' }}>{grossMargin}%</span>
        </div>
        <div style={{ width: '100%', height: '8px', borderRadius: '999px', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
          <div style={{
            width: `${grossMargin}%`,
            height: '100%',
            borderRadius: '999px',
            background: 'linear-gradient(90deg, #1588C7, #10B981)',
            transition: 'width 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />
        </div>
      </div>
    </div>
  );
});

AdminAiEconomicsPanel.displayName = 'AdminAiEconomicsPanel';
