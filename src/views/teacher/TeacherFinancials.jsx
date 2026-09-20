import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_TEACHER_EARNINGS } from '../../data/mockData';
import { ArrowDownRight } from 'lucide-react';
import {
  FinancialsOverviewCards,
  TransactionsHistoryList,
  WithdrawModal
} from '../../features/teacher/financials';

export const TeacherFinancials = () => {
  const { lang, isRtl } = useLanguage();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('24600');
  const [withdrawMethod, setWithdrawMethod] = useState('cib'); // 'cib' | 'instapay'
  const [successMessage, setSuccessMessage] = useState(false);

  const earnings = MOCK_TEACHER_EARNINGS;

  const handleWithdraw = (e) => {
    e.preventDefault();
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      setShowWithdrawModal(false);
    }, 2000);
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '36px 24px 80px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
          }}>
            {lang === 'ar' ? 'المحفظة المالية والأرباح (بالجنيه المصري 🇪🇬)' : 'Financial Earnings & Payouts (EGP 🇪🇬)'}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            {lang === 'ar' ? 'متابعة اشتراكات الطلاب، عمولات السناتر، والسحب عبر الحسابات البنكية وإنستاباي' : 'Track student subscriptions, center splits, and payout withdrawals to CIB & InstaPay'}
          </p>
        </div>

        <button
          onClick={() => setShowWithdrawModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--success)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)'
          }}
        >
          <ArrowDownRight size={16} />
          <span>{lang === 'ar' ? 'طلب سحب رصيد (Instant Payout)' : 'Request Payout'}</span>
        </button>
      </div>

      {/* 3 Overview Cards */}
      <FinancialsOverviewCards earnings={earnings} lang={lang} />

      {/* Transactions History Table */}
      <TransactionsHistoryList transactions={earnings.transactions} lang={lang} isRtl={isRtl} />

      {/* Withdrawal Modal */}
      <WithdrawModal
        showWithdrawModal={showWithdrawModal}
        withdrawAmount={withdrawAmount}
        setWithdrawAmount={setWithdrawAmount}
        withdrawMethod={withdrawMethod}
        setWithdrawMethod={setWithdrawMethod}
        successMessage={successMessage}
        pendingPayoutEgp={earnings.pendingPayoutEgp}
        lang={lang}
        onWithdraw={handleWithdraw}
        onClose={() => setShowWithdrawModal(false)}
      />
    </div>
  );
};
