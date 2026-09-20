import React from 'react';
import { Receipt } from 'lucide-react';

export const BillingInvoicesList = ({ invoices, lang }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1.5px solid var(--border-medium)',
      borderRadius: '24px',
      padding: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
        <Receipt size={20} color="var(--primary)" />
        <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
          {lang === 'ar' ? 'سجل المدفوعات وفواتيرك السابقة (Payment History):' : 'Payment History & Invoices:'}
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {invoices.map((inv) => (
          <div
            key={inv.id}
            style={{
              padding: '14px 18px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {inv.descriptionAr}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {inv.id} • {inv.date} • وسيلة الدفع: {inv.method}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {inv.amount}
              </span>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--success)', padding: '3px 8px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                {inv.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
