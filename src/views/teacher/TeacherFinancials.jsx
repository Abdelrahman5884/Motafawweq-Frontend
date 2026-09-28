import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_TEACHER_EARNINGS } from '../../data/mockData';
import { MOCK_TEACHER_DIRECT_PAYMENTS } from '../../data/teacherData';
import { CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';
import {
  FinancialsOverviewCards,
  TransactionsHistoryList
} from '../../features/teacher/financials';

export const TeacherFinancials = () => {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const earnings = MOCK_TEACHER_EARNINGS;
  const directPayments = MOCK_TEACHER_DIRECT_PAYMENTS;

  return (
    <div
      style={{
        maxWidth: '1060px',
        margin: '0 auto',
        padding: '36px 20px 80px',
        direction: isRtl ? 'rtl' : 'ltr',
        fontFamily: isRtl ? 'var(--font-arabic), "Cairo", system-ui, sans-serif' : 'var(--font-heading), "Outfit", sans-serif'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: '99px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                fontSize: '11px',
                fontWeight: '900'
              }}
            >
              {isAr ? 'التحويل المباشر للمعلم' : 'Direct Educator Payout'}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              {isAr ? 'بدون وساطة مالية من المنصة' : 'Zero Platform Escrow'}
            </span>
          </div>

          <h1
            style={{
              fontSize: '25px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
              letterSpacing: '-0.3px'
            }}
          >
            {isAr ? 'سجل مدفوعات الطلاب واشتراكات المقررات' : 'Direct Student Payments & Course Enrollments'}
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0 }}>
            {isAr
              ? 'متابعة الطلاب المشتركين والتحويلات المستلمة مباشرة على حساباتك (إنستاباي / فودافون كاش / بنكي).'
              : 'Monitor student course enrollments and direct payments received to your verified receiving channels.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/teacher/billing')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--primary)',
              border: '1.5px solid var(--primary)',
              fontSize: '13.5px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <CreditCard size={15} />
            <span>{isAr ? 'باقات اشتراك المعلم' : 'Teacher Plans'}</span>
          </button>

          <button
            onClick={() => navigate('/teacher/settings')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(21, 136, 199, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <CreditCard size={15} />
            <span>{isAr ? 'إدارة حسابات الاستلام' : 'Manage Receiving Accounts'}</span>
          </button>
        </div>
      </div>

      {/* 3 Overview Cards */}
      <FinancialsOverviewCards earnings={earnings} lang={lang} />

      {/* Transactions History Table */}
      <TransactionsHistoryList transactions={directPayments} lang={lang} isRtl={isRtl} />
    </div>
  );
};

export default TeacherFinancials;
