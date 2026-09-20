import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

export const AdminKpiCards = ({ econ }) => {
  const { lang } = useLanguage();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '18px',
      marginBottom: '32px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        padding: '22px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          {lang === 'ar' ? 'الإيراد الشهري المتكرر (MRR)' : 'Monthly Recurring (MRR)'}
        </div>
        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
          {econ.mrrEgp.toLocaleString()} <span style={{ fontSize: '13px' }}>{lang === 'ar' ? 'ج.م' : 'EGP'}</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--success, #16A34A)', fontWeight: '700', marginTop: '4px' }}>
          +24.2% MoM
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        padding: '22px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          {lang === 'ar' ? 'إجمالي المستخدمين النشطين' : 'Total Active Users'}
        </div>
        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
          {econ.totalUsers.toLocaleString()}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
          1,420 {lang === 'ar' ? 'معلماً' : 'tutors'} • 48 {lang === 'ar' ? 'سنتر' : 'centers'}
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        padding: '22px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          {lang === 'ar' ? 'هامش ربح الذكاء الاصطناعي' : 'AI Gross Profit Margin'}
        </div>
        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--success, #16A34A)', fontFamily: 'var(--font-heading)' }}>
          {econ.aiEconomics.grossMarginPercent}%
        </div>
        <div style={{ fontSize: '11px', color: 'var(--success, #16A34A)', fontWeight: '700', marginTop: '4px' }}>
          {lang === 'ar' ? 'هامش ربحي استثنائي' : 'High SaaS Efficiency'}
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        padding: '22px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          {lang === 'ar' ? 'متوسط سرعة المعالجة' : 'Avg Pipeline Latency'}
        </div>
        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary-light, #5CB6DB)', fontFamily: 'var(--font-heading)' }}>
          {econ.aiEconomics.avgLessonProcessingSeconds}s
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
          {lang === 'ar' ? 'لكل 45 دقيقة صوتية' : 'Per 45m lesson audio'}
        </div>
      </div>
    </div>
  );
};
