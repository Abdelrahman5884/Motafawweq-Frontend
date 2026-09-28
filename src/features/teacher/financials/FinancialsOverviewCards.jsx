import React from 'react';

export const FinancialsOverviewCards = ({ earnings, lang }) => {
  const isAr = lang === 'ar';
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '20px',
      marginBottom: '36px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          {isAr ? 'إجمالي التحويلات المستلمة مباشرة' : 'Direct Payments Received'}
        </div>
        <div style={{ fontSize: '30px', fontWeight: '900', color: 'var(--success)', fontFamily: 'var(--font-heading)' }}>
          {earnings.totalRevenueEgp.toLocaleString()} <span style={{ fontSize: '14px' }}>{isAr ? 'ج.م' : 'EGP'}</span>
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
          {isAr ? 'محولة مباشرة لحساباتك (إنستاباي / فودافون كاش / بنكي)' : 'Deposited directly to your personal accounts'}
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          {isAr ? 'إجمالي اشتراكات الطلاب المؤكدة' : 'Active Student Purchases'}
        </div>
        <div style={{ fontSize: '30px', fontWeight: '900', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
          3,890 <span style={{ fontSize: '14px' }}>{isAr ? 'طالباً مسجلاً' : 'students'}</span>
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
          {isAr ? 'مستلمة ومفعلة عبر السناتر والمنصة أونلاين' : 'Direct enrollments across centers and online'}
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          {isAr ? 'المقررات والكورسات النشطة' : 'Active Paid Courses'}
        </div>
        <div style={{ fontSize: '30px', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
          4 <span style={{ fontSize: '14px' }}>{isAr ? 'كورسات مفعلة' : 'courses'}</span>
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
          {isAr ? 'شاملة الملازم وامتحانات البابل شيت' : 'Including study packs and Bubble Sheet quizzes'}
        </div>
      </div>
    </div>
  );
};
