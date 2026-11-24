import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  GraduationCap,
  Users,
  Building2,
  Plus,
  Receipt,
  ArrowUpRight,
  Cpu,
  Wallet,
  CheckCircle2,
} from 'lucide-react';

const formatMoney = (val) =>
  Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const ROLE_CARDS_META = [
  {
    key: 'teacher',
    titleAr: 'إيرادات المعلمين',
    titleEn: 'Teachers Revenue',
    subtitleAr: 'اشتراكات باقات المعلمين + عمولة المبيعات',
    subtitleEn: 'Teacher plan subscriptions + commissions',
    icon: GraduationCap,
    accent: '#1588C7',
    bg: 'rgba(21, 136, 199, 0.1)',
  },
  {
    key: 'student',
    titleAr: 'إيرادات الطلاب',
    titleEn: 'Students Revenue',
    subtitleAr: 'اشتراكات باقات الطالب بلس وبرو',
    subtitleEn: 'Student Plus & Pro subscriptions',
    icon: Users,
    accent: '#16A34A',
    bg: 'rgba(22, 163, 74, 0.1)',
  },
  {
    key: 'center',
    titleAr: 'إيرادات السناتر التعليمية',
    titleEn: 'Centers Revenue',
    subtitleAr: 'اشتراكات باقات السنتر بلس وبرو',
    subtitleEn: 'Center Plus & Pro subscriptions',
    icon: Building2,
    accent: '#7C3AED',
    bg: 'rgba(124, 58, 237, 0.1)',
  },
];

const getRoleBadge = (role, isAr) => {
  if (role === 'teacher') return { label: isAr ? 'معلم' : 'Teacher', color: '#1588C7', bg: 'rgba(21, 136, 199, 0.12)' };
  if (role === 'center') return { label: isAr ? 'سنتر' : 'Center', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.12)' };
  return { label: isAr ? 'طالب' : 'Student', color: '#15803D', bg: 'rgba(22, 163, 74, 0.12)' };
};

export const FinancialOverviewSection = ({
  overview,
  lang = 'ar',
  isRtl = true,
  loading = false,
  onOpenAddExpense,
  onSwitchTab,
}) => {
  const isAr = lang === 'ar';
  const cur = isAr ? 'ج.م' : 'EGP';

  const grossRev = Number(overview?.grossPlatformRevenueEgp ?? overview?.platformCommissionEgp ?? 0);
  const manualCosts = Number(overview?.manualExpensesEgp ?? 0);
  const aiCosts = Number(overview?.aiInfrastructureCostEgp ?? 0);
  const totalCosts = Number(overview?.totalCostsEgp ?? manualCosts + aiCosts);
  const netProfit = Number(overview?.netProfitEgp ?? grossRev - totalCosts);
  const marginPct = Number(overview?.profitMarginPercent ?? 0);
  const isProfitable = netProfit >= 0;

  const roleBreakdown = overview?.roleBreakdown || {};
  const recentInvoices = Array.isArray(overview?.recentInvoices) ? overview.recentInvoices : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Executive Net Profit & P&L Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #06254E 0%, #0C3B75 56%, #1588C7 100%)',
          borderRadius: '22px',
          padding: '24px 28px',
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '4px 12px', borderRadius: '999px', backgroundColor: 'rgba(255, 255, 255, 0.14)', fontSize: '12px', fontWeight: '800', marginBottom: '10px' }}>
              {isProfitable ? <TrendingUp size={14} color="#86EFAC" /> : <TrendingDown size={14} color="#FCA5A5" />}
              <span>{isAr ? 'صافي الربح الفعلي للمنصة (بعد خصم التكاليف)' : 'Real Platform Net Profit (After Costs)'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '34px',
                  fontWeight: '900',
                  letterSpacing: '-0.5px',
                  color: isProfitable ? '#FFFFFF' : '#FCA5A5',
                }}
              >
                {loading ? '...' : `${formatMoney(netProfit)} ${cur}`}
              </span>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: '800',
                  backgroundColor: isProfitable ? 'rgba(34, 197, 94, 0.24)' : 'rgba(239, 68, 68, 0.28)',
                  color: isProfitable ? '#BBF7D0' : '#FECACA',
                }}
              >
                {isAr ? `هامش الربح: ${marginPct}%` : `Margin: ${marginPct}%`}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onOpenAddExpense}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '10px 18px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#FFFFFF',
                color: '#06254E',
                fontSize: '13px',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.18)',
              }}
            >
              <Plus size={16} />
              <span>{isAr ? 'إضافة تكلفة يدوية + ملاحظة' : 'Add Manual Cost'}</span>
            </button>
          </div>
        </div>

        {/* Live P&L Equation Strip inside Hero */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.16)',
          }}
        >
          <div style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.78)', marginBottom: '4px' }}>
              {isAr ? 'إجمالي إيرادات المنصة المحصلة' : 'Total Collected Revenue'}
            </div>
            <div style={{ fontSize: '19px', fontWeight: '900', color: '#FFFFFF' }}>
              {formatMoney(grossRev)} {cur}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '2px' }}>
              {isAr ? `حجم المعاملات الكلي (GMV): ${formatMoney(overview?.gmvEgp)} ${cur}` : `Total GMV: ${formatMoney(overview?.gmvEgp)} ${cur}`}
            </div>
          </div>

          <div
            onClick={() => onSwitchTab?.('expenses')}
            style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.78)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{isAr ? 'التكاليف المسجلة يدوياً' : 'Manual Recorded Costs'}</span>
              <ArrowUpRight size={13} />
            </div>
            <div style={{ fontSize: '19px', fontWeight: '900', color: '#FDE68A' }}>
              {formatMoney(manualCosts)} {cur}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '2px' }}>
              {isAr ? `${overview?.manualExpensesCount ?? 0} بند تكلفة مسجل بملاحظاته` : `${overview?.manualExpensesCount ?? 0} cost items`}
            </div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.78)', marginBottom: '4px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Cpu size={12} />
              <span>{isAr ? 'تكلفة معالجة الـ AI التلقائية' : 'Auto AI Processing Cost'}</span>
            </div>
            <div style={{ fontSize: '19px', fontWeight: '900', color: '#FFFFFF' }}>
              {formatMoney(aiCosts)} {cur}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '2px' }}>
              {isAr ? `${overview?.aiCostPerMinuteEgp ?? 0.42} ج.م لكل دقيقة صوتية` : `${overview?.aiCostPerMinuteEgp ?? 0.42} EGP / audio min`}
            </div>
          </div>

          <div
            onClick={() => onSwitchTab?.('payouts')}
            style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.78)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{isAr ? 'تسويات معلّقة للمعلمين والسناتر' : 'Pending Payouts'}</span>
              <Wallet size={13} />
            </div>
            <div style={{ fontSize: '19px', fontWeight: '900', color: '#FFFFFF' }}>
              {formatMoney(overview?.pendingPayoutsEgp)} {cur}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '2px' }}>
              {isAr
                ? `${overview?.pendingPayoutsCount ?? 0} قيد المراجعة • محوّل: ${formatMoney(overview?.settledPayoutsEgp)} ${cur}`
                : `${overview?.pendingPayoutsCount ?? 0} pending • Settled: ${formatMoney(overview?.settledPayoutsEgp)} ${cur}`}
            </div>
          </div>
        </div>
      </div>

      {/* Per-Role Revenue Attribution Cards (المعلم • الطالب • السنتر) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
            {isAr ? 'تفصيل الإيرادات والأرباح حسب الفئة (المعلم • الطالب • السنتر)' : 'Revenue Breakdown by Role (Teacher • Student • Center)'}
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>
            {isAr ? 'محسوبة لحظياً من الفواتير المدفوعة فعلياً في قاعدة البيانات' : 'Computed live from verified paid invoices'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(275px, 1fr))', gap: '16px' }}>
          {ROLE_CARDS_META.map((meta) => {
            const Icon = meta.icon;
            const data = roleBreakdown[meta.key] || {};
            const rev = Number(data.revenueEgp ?? 0);
            const share = Math.min(100, Math.max(0, Number(data.sharePercent ?? 0)));
            const paidCount = Number(data.paidInvoicesCount ?? 0);
            const activeSubs = Number(data.activePaidSubscribersCount ?? 0);

            return (
              <div
                key={meta.key}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '20px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', top: 0, insetInline: 0, height: '4px', backgroundColor: meta.accent }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '13px',
                        backgroundColor: meta.bg,
                        color: meta.accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={21} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
                        {isAr ? meta.titleAr : meta.titleEn}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        {isAr ? meta.subtitleAr : meta.subtitleEn}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      backgroundColor: meta.bg,
                      color: meta.accent,
                      fontSize: '12px',
                      fontWeight: '900',
                    }}
                  >
                    {share}%
                  </span>
                </div>

                <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-primary)' }}>
                  {loading ? '...' : `${formatMoney(rev)} ${cur}`}
                </div>

                {/* Progress Bar of Revenue Share */}
                <div style={{ height: '7px', borderRadius: '999px', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${share}%`,
                      height: '100%',
                      backgroundColor: meta.accent,
                      borderRadius: '999px',
                      transition: 'width 0.35s ease',
                    }}
                  />
                </div>

                {/* Stats Footer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    fontWeight: '700',
                  }}
                >
                  <span>
                    {isAr ? `فواتير مسددة: ` : `Paid invoices: `}
                    <strong style={{ color: 'var(--text-primary)' }}>{paidCount}</strong>
                  </span>
                  <span>
                    {isAr ? `مشتركون نشطون حالياً: ` : `Active paid: `}
                    <strong style={{ color: meta.accent }}>{activeSubs}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Paid Platform Invoices Ledger */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '20px 22px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Receipt size={19} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {isAr ? 'أحدث الفواتير المدفوعة في المنصة (طلاب • معلمون • سناتر)' : 'Recent Verified Paid Invoices'}
            </h3>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700' }}>
            {isAr ? `إجمالي الاشتراكات المحصلة: ${formatMoney(overview?.subscriptionRevenueEgp)} ${cur}` : `Subscriptions Total: ${formatMoney(overview?.subscriptionRevenueEgp)} ${cur}`}
          </span>
        </div>

        {recentInvoices.length === 0 ? (
          <div style={{ padding: '28px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
            {isAr ? 'لا توجد فواتير مدفوعة مسجلة بعد.' : 'No paid invoices recorded yet.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '640px', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '11px 14px' }}>{isAr ? 'رقم الفاتورة' : 'Invoice #'}</th>
                  <th style={{ padding: '11px 14px' }}>{isAr ? 'الفئة والمستخدم' : 'Role & User'}</th>
                  <th style={{ padding: '11px 14px' }}>{isAr ? 'تفاصيل الباقة' : 'Description'}</th>
                  <th style={{ padding: '11px 14px' }}>{isAr ? 'طريقة الدفع' : 'Method'}</th>
                  <th style={{ padding: '11px 14px' }}>{isAr ? 'التاريخ' : 'Date'}</th>
                  <th style={{ padding: '11px 14px' }}>{isAr ? 'المبلغ المحصل' : 'Amount'}</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv, idx) => {
                  const badge = getRoleBadge(inv.role, isAr);
                  return (
                    <tr key={`${inv.invoiceNumber}-${idx}`} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '13px' }}>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {inv.invoiceNumber}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '999px', backgroundColor: badge.bg, color: badge.color, fontSize: '11px', fontWeight: '800' }}>
                            {badge.label}
                          </span>
                          <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{inv.payerName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                        {inv.descriptionAr}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '11.5px', fontWeight: '700' }}>
                        {inv.paymentMethod || '—'}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                        {inv.paidDate || '—'}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: '900', color: '#15803D' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={13} />
                          {formatMoney(inv.amountEgp)} {cur}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
