import React from 'react';

export const FinancialsOverviewCards = ({ earnings, lang }) => {
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
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          {lang === 'ar' ? 'الرصيد المتاح للسحب الآن' : 'Available for Payout'}
        </div>
        <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--success)', fontFamily: 'var(--font-heading)' }}>
          {earnings.pendingPayoutEgp.toLocaleString()} <span style={{ fontSize: '14px' }}>{lang === 'ar' ? 'ج.م' : 'EGP'}</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
          {lang === 'ar' ? 'جاهز للتحويل الفوري خلال 15 دقيقة' : 'Instant transfer via InstaPay / Bank'}
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          {lang === 'ar' ? 'إجمالي الأرباح المحققة' : 'Total Gross Earnings'}
        </div>
        <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
          {earnings.totalRevenueEgp.toLocaleString()} <span style={{ fontSize: '14px' }}>{lang === 'ar' ? 'ج.م' : 'EGP'}</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
          {lang === 'ar' ? 'رسوم المنصة المخفضة 8% فقط' : 'Platform processing fee 8%'}
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          {lang === 'ar' ? 'إجمالي المسحوبات السابقة' : 'Withdrawn to Date'}
        </div>
        <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
          {earnings.withdrawnEgp.toLocaleString()} <span style={{ fontSize: '14px' }}>{lang === 'ar' ? 'ج.م' : 'EGP'}</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
          {lang === 'ar' ? 'آخر تحويل بنكي: 1 سبتمبر 2026' : 'Last bank transfer: Sep 1, 2026'}
        </div>
      </div>
    </div>
  );
};
