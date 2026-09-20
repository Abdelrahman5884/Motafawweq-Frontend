import React from 'react';
import { X, CheckCircle2, Smartphone, Building } from 'lucide-react';

export const WithdrawModal = ({
  showWithdrawModal,
  withdrawAmount,
  setWithdrawAmount,
  withdrawMethod,
  setWithdrawMethod,
  successMessage,
  pendingPayoutEgp,
  lang,
  onWithdraw,
  onClose
}) => {
  if (!showWithdrawModal) return null;

  return (
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
      onClick={onClose}
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
          onClick={onClose}
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
            color: 'var(--success)'
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
          <form onSubmit={onWithdraw}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {lang === 'ar' ? 'المبلغ المراد سحبه (بالجنيه المصري)' : 'Amount (EGP)'}
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                max={pendingPayoutEgp}
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
                {lang === 'ar' ? `الحد الأقصى المتاح: ${pendingPayoutEgp.toLocaleString()} ج.م` : `Max available: ${pendingPayoutEgp.toLocaleString()} EGP`}
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
                <Building size={20} color="var(--success)" />
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
                backgroundColor: 'var(--success)',
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
  );
};
