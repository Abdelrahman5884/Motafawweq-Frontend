import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CertificateEligibilityCard = ({ requirements, lang }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1.5px solid var(--border-medium)',
      borderRadius: '24px',
      padding: '24px',
      marginBottom: '28px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <ShieldCheck size={22} color="var(--success)" />
        <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
          {lang === 'ar' ? 'شروط استحقاق الشهادة المعتمدة (Certificate Criteria):' : 'Certificate Eligibility Requirements:'}
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {requirements.map((req, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-primary)' }}>
            <CheckCircle2 size={18} color="var(--success)" />
            <span>{req.labelAr}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(22, 163, 74, 0.1)', color: 'var(--success)', fontSize: '13px', fontWeight: '800' }}>
        <CheckCircle2 size={16} color="var(--success)" />
        <span>تهانينا يا عمر! لقد استوفيت جميع الشروط بنجاح وشهادتك صادرة وجاهزة للتحميل والتوثيق.</span>
      </div>
    </div>
  );
};
