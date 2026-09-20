import React from 'react';

export const ActiveSubscriptionBanner = ({ activeSub }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1.5px solid var(--primary)',
      borderRadius: '24px',
      padding: '24px',
      marginBottom: '32px',
      boxShadow: '0 8px 24px rgba(21, 136, 199, 0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '20px'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: '900', padding: '2px 8px', borderRadius: '10px', backgroundColor: 'var(--success)', color: '#FFFFFF' }}>
            اشتراك نشط
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            ينتهي في {activeSub.renewalDate} (باقي {activeSub.daysRemaining} يوماً)
          </span>
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
          {activeSub.planNameAr}
        </h2>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          يمكنك الوصول لجميع حصص الثانوية العامة، الكويزات الذكية، وتحميل الملازم بدون قيود.
        </div>
      </div>

      <div style={{ padding: '12px 20px', borderRadius: '16px', backgroundColor: 'var(--bg-subtle)', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>قيمة الاشتراك</div>
        <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--primary)' }}>
          {activeSub.amountEgp} ج.م
        </div>
      </div>
    </div>
  );
};
