import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const TransactionsHistoryList = ({ transactions, lang, isRtl }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
        {lang === 'ar' ? 'سجل العمليات والتحويلات البنكية' : 'Recent Transactions Log'}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {transactions.map(tx => {
          const isWithdrawal = tx.amountEgp < 0;
          return (
            <div
              key={tx.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: isWithdrawal ? '#FEF2F2' : '#ECFDF5',
                  color: isWithdrawal ? 'var(--danger)' : 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isWithdrawal ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {tx.description}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {tx.date} • ID: {tx.id}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                <div style={{
                  fontSize: '15px',
                  fontWeight: '900',
                  color: isWithdrawal ? 'var(--danger)' : 'var(--success)',
                  fontFamily: 'var(--font-heading)'
                }}>
                  {isWithdrawal ? '' : '+'}{tx.amountEgp.toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
                </div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: 'var(--success)'
                }}>
                  {tx.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
