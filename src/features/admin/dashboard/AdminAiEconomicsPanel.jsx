import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Cpu } from 'lucide-react';

export const AdminAiEconomicsPanel = ({ aiEconomics = {} }) => {
  const { lang } = useLanguage();

  const totalMinutes = Number(aiEconomics?.totalAudioMinutesProcessed || 0);
  const processingCost = Number(aiEconomics?.aiProcessingCostEgp || 0);
  const costPerMin = Number(aiEconomics?.costPerMinuteEgp ?? 0.42);
  const aiRevenue = Number(aiEconomics?.aiRevenueEgp || 0);
  const revPerMin = Number(aiEconomics?.revenuePerMinuteEgp ?? 1.6);
  const grossMargin = Number(aiEconomics?.grossMarginPct || 0);

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-xl)',
      padding: '28px',
      marginBottom: '4px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'تحليل اقتصاديات وتكاليف الذكاء الاصطناعي' : 'AI Unit Economics & Cost Breakdown'}
          </h3>
        </div>
        <span style={{
          padding: '4px 10px',
          borderRadius: '999px',
          backgroundColor: 'rgba(21, 136, 199, 0.12)',
          color: 'var(--primary)',
          fontSize: '12px',
          fontWeight: '800'
        }}>
          {lang === 'ar' ? `هامش الربح: ${grossMargin}%` : `Gross Margin: ${grossMargin}%`}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {lang === 'ar' ? 'الدقائق الصوتية المعالجة' : 'Audio Minutes Transcribed'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
            {totalMinutes.toLocaleString()} {lang === 'ar' ? 'دقيقة' : 'mins'}
          </div>
        </div>

        <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {lang === 'ar' ? 'إجمالي تكلفة الخوادم والمعالجة' : 'Infrastructure & Inference Cost'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
            {processingCost.toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            {lang === 'ar' ? `قرابة ${costPerMin} ج.م / دقيقة` : `~${costPerMin} EGP / min`}
          </div>
        </div>

        <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {lang === 'ar' ? 'عائد باقات الذكاء الاصطناعي المحصل' : 'Collected AI Quota Revenue'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>
            {aiRevenue.toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            {lang === 'ar' ? `قرابة ${revPerMin} ج.م / دقيقة` : `~${revPerMin} EGP / min`}
          </div>
        </div>
      </div>
    </div>
  );
};
