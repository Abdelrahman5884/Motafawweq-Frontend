import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_TEACHER_EARNINGS } from '../../data/mockData';
import { 
  DollarSign, 
  ArrowDownRight, 
  ArrowUpRight, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Building,
  Smartphone,
  X
} from 'lucide-react';

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
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
          }}
        >
          <ArrowDownRight size={16} />
          <span>{lang === 'ar' ? 'طلب سحب رصيد (Instant Payout)' : 'Request Payout'}</span>
        </button>
      </div>

      {/* 3 Overview Cards */}
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
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#10B981', fontFamily: 'var(--font-heading)' }}>
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

      {/* Transactions History Table */}
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
          {earnings.transactions.map(tx => {
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
                    color: isWithdrawal ? '#EF4444' : '#10B981',
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
                    color: isWithdrawal ? '#EF4444' : '#10B981',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {isWithdrawal ? '' : '+'}{tx.amountEgp.toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
                  </div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#10B981'
                  }}>
                    {tx.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowWithdrawModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-xl)',
              padding: '32px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWithdrawModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {lang === 'ar' ? 'سحب أرباح الحصص' : 'Withdraw Earnings'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {lang === 'ar' ? 'اختر وسيلة التحويل لتحويل رصيدك فورياً' : 'Select your payout method for instant settlement'}
            </p>

            {successMessage ? (
              <div style={{
                textAlign: 'center',
                padding: '30px 10px',
                color: '#10B981'
              }}>
                <CheckCircle2 size={48} style={{ margin: '0 auto 12px' }} />
                <div style={{ fontSize: '16px', fontWeight: '800' }}>
                  {lang === 'ar' ? 'تم تقديم طلب السحب بنجاح!' : 'Withdrawal Request Submitted!'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {lang === 'ar' ? 'سيصل الإشعار لهاتفك خلال دقائق عبر إنستاباي/CIB' : 'Transfer will reflect in 15 minutes.'}
                </div>
              </div>
            ) : (
              <form onSubmit={handleWithdraw}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'المبلغ المراد سحبه (بالجنيه المصري)' : 'Amount (EGP)'}
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max={earnings.pendingPayoutEgp}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      fontSize: '16px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)'
                    }}
                  />
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {lang === 'ar' ? `الحد الأقصى المتاح: ${earnings.pendingPayoutEgp.toLocaleString()} ج.م` : `Max available: ${earnings.pendingPayoutEgp.toLocaleString()} EGP`}
                  </div>
                </div>

                {/* Method selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  <div
                    onClick={() => setWithdrawMethod('instapay')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: withdrawMethod === 'instapay' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: withdrawMethod === 'instapay' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    <Smartphone size={20} color="var(--primary)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {lang === 'ar' ? 'إنستاباي (InstaPay IPA)' : 'InstaPay (Instant Settlement)'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        salma.elsayed@instapay
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setWithdrawMethod('cib')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: withdrawMethod === 'cib' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: withdrawMethod === 'cib' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    <Building size={20} color="#10B981" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {lang === 'ar' ? 'البنك التجاري الدولي (CIB)' : 'Commercial International Bank (CIB)'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        EG89 CIBE 0000 0012 3456 7890 12
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  {lang === 'ar' ? 'تأكيد تحويل الرصيد' : 'Confirm Transfer'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
