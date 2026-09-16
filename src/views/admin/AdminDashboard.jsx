import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_ADMIN_ECONOMICS } from '../../data/mockData';
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Cpu, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Zap, 
  AlertCircle
} from 'lucide-react';

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
          <ShieldCheck size={20} color="#EC4899" />
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#EC4899', letterSpacing: '0.5px' }}>
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
          <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', marginTop: '4px' }}>
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
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#10B981', fontFamily: 'var(--font-heading)' }}>
            {econ.aiEconomics.grossMarginPercent}%
          </div>
          <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', marginTop: '4px' }}>
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
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#06B6D4', fontFamily: 'var(--font-heading)' }}>
            {econ.aiEconomics.avgLessonProcessingSeconds}s
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {lang === 'ar' ? 'لكل 45 دقيقة صوتية' : 'Per 45m lesson audio'}
          </div>
        </div>
      </div>

      {/* AI Economics Deep-Dive Panel */}
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
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#EF4444', marginTop: '4px' }}>
              {econ.aiEconomics.aiProcessingCostEgp.toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>~0.42 EGP / min</div>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lang === 'ar' ? 'عائد دقائق الـ AI المحصل' : 'Collected AI Quota Revenue'}</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#10B981', marginTop: '4px' }}>
              {econ.aiEconomics.aiRevenueEgp.toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>~1.60 EGP / min</div>
          </div>
        </div>
      </div>

      {/* Teacher Verification Accreditation Queue */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'طلبات اعتماد وتوثيق المعلمين (Verification Queue)' : 'Tutor Accreditation & KYC Queue'}
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {queue.filter(q => q.status === 'Pending Review').length} {lang === 'ar' ? 'قيد المراجعة' : 'pending'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {queue.map(req => (
            <div
              key={req.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {req.name}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: req.status === 'Approved' ? '#ECFDF5' : (req.status === 'Rejected' ? '#FEF2F2' : '#FFFBEB'),
                    color: req.status === 'Approved' ? '#10B981' : (req.status === 'Rejected' ? '#EF4444' : '#F59E0B')
                  }}>
                    {req.status}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', marginTop: '2px' }}>
                  {req.subject} • {req.certificate}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {lang === 'ar' ? 'الرقم القومي: ' : 'National ID: '}{req.nationalId}
                </div>
              </div>

              {req.status === 'Pending Review' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleApprove(req.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '7px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <CheckCircle2 size={13} />
                    <span>{lang === 'ar' ? 'اعتماد المعلم' : 'Approve'}</span>
                  </button>

                  <button
                    onClick={() => handleReject(req.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '7px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'transparent',
                      color: '#EF4444',
                      border: '1px solid #FCA5A5',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <XCircle size={13} />
                    <span>{lang === 'ar' ? 'رفض' : 'Reject'}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
