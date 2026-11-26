import React, { useMemo, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { InfoTooltip } from '../../components/common/InfoTooltip';
import { ParentEmptyState } from './ParentEmptyState';

export const ParentFinancialsTab = ({ financialsData, lang, isRtl }) => {
  const [statusFilter, setStatusFilter] = useState('all');

  const summary = financialsData?.summary || {
    totalPaidEgp: 0,
    pendingAmountEgp: 0,
    dueAmountEgp: 0,
    activePlanAr: 'الباقة المجانية',
    activePlanEn: 'Free Plan',
    renewsAt: null,
  };
  const invoices = useMemo(() => financialsData?.invoices || [], [financialsData]);

  const filteredInvoices = useMemo(() => {
    if (statusFilter === 'all') return invoices;
    if (statusFilter === 'paid') return invoices.filter((inv) => inv.status === 'paid');
    if (statusFilter === 'pending') return invoices.filter((inv) => inv.status === 'pending');
    if (statusFilter === 'due') return invoices.filter((inv) => inv.status === 'overdue' || inv.status === 'failed' || inv.status === 'rejected');
    return invoices;
  }, [invoices, statusFilter]);

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-subtle)',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'ar' ? 'المصروفات والإيصالات' : 'Tuition & Payment Receipts'}
          </h3>
          <InfoTooltip
            text={lang === 'ar'
              ? 'ملخص المدفوعات المسددة والمستحقات المفتوحة وباقة الطالب الحالية.'
              : 'Overview of confirmed tuition payments, pending dues, and active student plan.'}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            padding: '8px 14px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(22, 163, 74, 0.08)',
            border: '1px solid rgba(22, 163, 74, 0.2)',
          }}>
            <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              {lang === 'ar' ? 'إجمالي المسدد' : 'Total Paid'}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--success, #16A34A)' }}>
              {Number(summary.totalPaidEgp || 0).toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
            </div>
          </div>

          {Number(summary.pendingAmountEgp || 0) > 0 && (
            <div style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.22)',
            }}>
              <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {lang === 'ar' ? 'قيد التأكيد' : 'Pending Review'}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '900', color: '#D97706' }}>
                {Number(summary.pendingAmountEgp).toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
              </div>
            </div>
          )}

          {Number(summary.dueAmountEgp || 0) > 0 && (
            <div style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}>
              <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {lang === 'ar' ? 'مستحق السداد' : 'Outstanding Due'}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '900', color: '#DC2626' }}>
                {Number(summary.dueAmountEgp).toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
              </div>
            </div>
          )}

          <div style={{
            padding: '8px 14px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--primary-surface, rgba(21, 136, 199, 0.08))',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              {lang === 'ar' ? 'باقة الطالب' : 'Student Plan'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)' }}>
              {lang === 'ar' ? summary.activePlanAr : summary.activePlanEn}
            </div>
            {summary.renewsAt && (
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '1px' }}>
                {lang === 'ar' ? `يتجدد: ${summary.renewsAt}` : `Renews: ${summary.renewsAt}`}
              </div>
            )}
          </div>
        </div>
      </div>

      {invoices.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {[
            { key: 'all', labelAr: 'كل المعاملات', labelEn: 'All' },
            { key: 'paid', labelAr: 'مسدد', labelEn: 'Paid' },
            { key: 'pending', labelAr: 'قيد المراجعة', labelEn: 'Pending' },
            { key: 'due', labelAr: 'مستحق / مرفوض', labelEn: 'Due / Failed' },
          ].map((tab) => {
            const active = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: active ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: active ? 'rgba(21, 136, 199, 0.1)' : 'var(--bg-app)',
                  color: active ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {lang === 'ar' ? tab.labelAr : tab.labelEn}
              </button>
            );
          })}
        </div>
      )}

      {filteredInvoices.length === 0 ? (
        <ParentEmptyState
          icon={CreditCard}
          title={lang === 'ar' ? 'لا توجد فواتير أو مدفوعات مطابقة' : 'No matching payment records'}
          subtitle={lang === 'ar'
            ? 'جميع إيصالات اشتراكات المقررات، السنتر، وباقات المنصة تظهر هنا تلقائياً.'
            : 'All course receipts, center tuition payments, and plan invoices appear here automatically.'}
        />
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'رقم الإيصال' : 'Receipt'}</th>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'البيان' : 'Description'}</th>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'طريقة السداد' : 'Method'}</th>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '13px 12px', fontSize: '12.5px', fontWeight: '800', color: 'var(--primary)' }}>
                    {inv.receiptNo}
                  </td>
                  <td style={{ padding: '13px 12px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    {inv.date || '—'}
                  </td>
                  <td style={{ padding: '13px 12px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? inv.descriptionAr : inv.descriptionEn}
                  </td>
                  <td style={{ padding: '13px 12px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? inv.methodAr : inv.methodEn}
                  </td>
                  <td style={{ padding: '13px 12px', fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {inv.amountFormatted}
                  </td>
                  <td style={{ padding: '13px 12px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: inv.status === 'paid'
                        ? 'rgba(22, 163, 74, 0.12)'
                        : inv.status === 'overdue' || inv.status === 'rejected' || inv.status === 'failed'
                        ? 'rgba(239, 68, 68, 0.12)'
                        : 'rgba(245, 158, 11, 0.12)',
                      color: inv.status === 'paid'
                        ? 'var(--color-success, #16A34A)'
                        : inv.status === 'overdue' || inv.status === 'rejected' || inv.status === 'failed'
                        ? '#DC2626'
                        : '#D97706',
                    }}>
                      {lang === 'ar' ? inv.statusAr : inv.statusEn}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
