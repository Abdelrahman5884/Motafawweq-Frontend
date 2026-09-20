import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_ADMIN_ECONOMICS } from '../../data/mockData';
import { ShieldCheck } from 'lucide-react';
import {
  AdminKpiCards,
  AdminAiEconomicsPanel,
  AdminVerificationQueue
} from '../../features/admin/dashboard';

export const AdminDashboard = () => {
  const { lang, isRtl } = useLanguage();
  const [queue, setQueue] = useState(MOCK_ADMIN_ECONOMICS.verificationQueue);

  const econ = MOCK_ADMIN_ECONOMICS;

  const handleApprove = (id) => {
    setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'Approved' } : item));
  };

  const handleReject = (id) => {
    setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'Rejected' } : item));
  };

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '36px 24px 80px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <ShieldCheck size={20} color="var(--primary)" />
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.5px' }}>
            {lang === 'ar' ? 'لوحة تحكم إدارة المنصة' : 'Learnora SaaS HQ'}
          </span>
        </div>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          margin: 0,
          fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
        }}>
          {lang === 'ar' ? 'اقتصاديات المنصة والذكاء الاصطناعي 🇪🇬' : 'Platform Operations & AI Economics 🇪🇬'}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          {lang === 'ar' ? 'متابعة تكاليف استهلاك الـ GPU، هوامش الربح لكل دقيقة صوتية، وتوثيق المعلمين' : 'Real-time telemetry of Whisper GPU costs, gross margin per audio minute, and tutor accreditation'}
        </p>
      </div>

      {/* Global SaaS Platform KPIs */}
      <AdminKpiCards econ={econ} />

      {/* AI Economics Deep-Dive Panel */}
      <AdminAiEconomicsPanel econ={econ} />

      {/* Teacher Verification Accreditation Queue */}
      <AdminVerificationQueue
        queue={queue}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};
