import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Cpu } from 'lucide-react';

export const AdminAiEconomicsPanel = ({ econ }) => {
  const { lang } = useLanguage();

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-xl)',
      padding: '28px',
      marginBottom: '32px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Cpu size={20} color="var(--primary)" />
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
          {lang === 'ar' ? 'تحليل اقتصاديات الاستهلاك وتكاليف الذكاء الاصطناعي (AI Unit Economics)' : 'AI Unit Economics & Cost Breakdown'}
        </h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lang === 'ar' ? 'الدقائق الصوتية المعالجة' : 'Audio Minutes Transcribed'}</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
            {econ.aiEconomics.totalAudioMinutesProcessed.toLocaleString()} {lang === 'ar' ? 'دقيقة' : 'mins'}
          </div>
        </div>

        <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lang === 'ar' ? 'إجمالي تكلفة الخوادم (Whisper & LLM)' : 'Infrastructure & Inference Cost'}</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--danger, #DC2626)', marginTop: '4px' }}>
            {econ.aiEconomics.aiProcessingCostEgp.toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>~0.42 EGP / min</div>
        </div>

        <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lang === 'ar' ? 'عائد دقائق الـ AI المحصل' : 'Collected AI Quota Revenue'}</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--success, #16A34A)', marginTop: '4px' }}>
            {econ.aiEconomics.aiRevenueEgp.toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>~1.60 EGP / min</div>
        </div>
      </div>
    </div>
  );
};
