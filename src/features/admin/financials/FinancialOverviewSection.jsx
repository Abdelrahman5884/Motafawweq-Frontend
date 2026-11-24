import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Search,
  X,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import { InfoTooltip } from './InfoTooltip';

const formatMoney = (val) =>
  Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const ROLE_CARDS_META = [
  {
    key: 'teacher',
    titleAr: 'المعلمون',
    titleEn: 'Teachers',
    infoAr: 'إجمالي إيرادات المعلمين من اشتراكات الباقات وعمولة المبيعات المحصلة.',
    infoEn: 'Total teacher revenue from plan subscriptions and collected commissions.',
    icon: GraduationCap,
    accent: '#1588C7',
    bg: 'rgba(21, 136, 199, 0.1)',
  },
  {
    key: 'student',
    titleAr: 'الطلاب',
    titleEn: 'Students',
    infoAr: 'إجمالي إيرادات الطلاب من اشتراكات باقات الطالب بلس وبرو.',
    infoEn: 'Total student revenue from Student Plus & Pro subscriptions.',
    icon: Users,
    accent: '#16A34A',
    bg: 'rgba(22, 163, 74, 0.1)',
  },
  {
    key: 'center',
    titleAr: 'السناتر',
    titleEn: 'Centers',
    infoAr: 'إجمالي إيرادات السناتر التعليمية من اشتراكات باقات السنتر بلس وبرو.',
    infoEn: 'Total educational center revenue from Center Plus & Pro subscriptions.',
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
  refreshTick = 0,
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

  // Paginated & Searchable Invoices State
  const [invoices, setInvoices] = useState([]);
  const [invoicesMeta, setInvoicesMeta] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const invSeqRef = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const loadInvoices = useCallback(async () => {
    const seq = ++invSeqRef.current;
    setInvoicesLoading(true);
    try {
      const res = await adminApi.financials.invoices.list({
        search: debouncedSearch || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        page,
        per_page: 10,
      });
      if (seq !== invSeqRef.current) return;
      setInvoices(Array.isArray(res?.data) ? res.data : []);
      setInvoicesMeta({
        current_page: Number(res?.meta?.current_page ?? page),
        last_page: Math.max(1, Number(res?.meta?.last_page ?? 1)),
        total: Number(res?.meta?.total ?? 0),
        per_page: Number(res?.meta?.per_page ?? 10),
      });
    } catch {
      if (seq !== invSeqRef.current) return;
      setInvoices([]);
    } finally {
      if (seq === invSeqRef.current) setInvoicesLoading(false);
    }
  }, [debouncedSearch, roleFilter, page]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) loadInvoices();
    });
    return () => {
      active = false;
    };
  }, [loadInvoices, refreshTick]);

  // Build compact page numbers around current page
  const getPageNumbers = () => {
    const last = invoicesMeta.last_page;
    const curr = invoicesMeta.current_page;
    if (last <= 5) return Array.from({ length: last }, (_, i) => i + 1);
    const start = Math.max(1, Math.min(curr - 2, last - 4));
    return Array.from({ length: 5 }, (_, i) => start + i);
  };

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
              <span>{isAr ? 'صافي الربح' : 'Net Profit'}</span>
              <InfoTooltip
                light
                size={13}
                text={
                  isAr
                    ? 'صافي الربح الفعلي للمنصة = إجمالي الإيرادات المحصلة − (التكاليف اليدوية + تكلفة الـ AI التلقائية).'
                    : 'Real Net Profit = Collected Revenue − (Manual Costs + Auto AI Costs).'
                }
              />
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
                {isAr ? `الهامش ${marginPct}%` : `Margin ${marginPct}%`}
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
              <span>{isAr ? 'إضافة تكلفة' : 'Add Cost'}</span>
            </button>
          </div>
        </div>

        {/* Compact P&L Strip inside Hero */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.16)',
          }}
        >
          <div style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
              <span style={{ fontWeight: '700' }}>{isAr ? 'الإيرادات' : 'Revenue'}</span>
              <InfoTooltip
                light
                align="end"
                size={13}
                text={
                  isAr
                    ? `إجمالي الإيرادات المحصلة للمنصة. حجم المعاملات الكلي (GMV): ${formatMoney(overview?.gmvEgp)} ${cur}.`
                    : `Total collected platform revenue. Total GMV: ${formatMoney(overview?.gmvEgp)} ${cur}.`
                }
              />
            </div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF' }}>
              {formatMoney(grossRev)} {cur}
            </div>
          </div>

          <div
            onClick={() => onSwitchTab?.('expenses')}
            style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: '700' }}>
                <span>{isAr ? 'التكاليف اليدوية' : 'Manual Costs'}</span>
                <ArrowUpRight size={13} />
              </span>
              <InfoTooltip
                light
                align="end"
                size={13}
                text={
                  isAr
                    ? `إجمالي المصروفات المسجلة يدوياً (${overview?.manualExpensesCount ?? 0} بند بملاحظاته) وتُخصم تلقائياً من الربح.`
                    : `Manually recorded expenses (${overview?.manualExpensesCount ?? 0} items), deducted from Net Profit.`
                }
              />
            </div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#FDE68A' }}>
              {formatMoney(manualCosts)} {cur}
            </div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: '700' }}>
                <Cpu size={13} />
                <span>{isAr ? 'تكلفة الـ AI' : 'AI Cost'}</span>
              </span>
              <InfoTooltip
                light
                align="end"
                size={13}
                text={
                  isAr
                    ? `تكلفة معالجة الذكاء الاصطناعي التلقائية بمعدل ${overview?.aiCostPerMinuteEgp ?? 0.42} ج.م لكل دقيقة صوتية.`
                    : `Auto AI infrastructure cost at ${overview?.aiCostPerMinuteEgp ?? 0.42} EGP per audio minute.`
                }
              />
            </div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF' }}>
              {formatMoney(aiCosts)} {cur}
            </div>
          </div>

          <div
            onClick={() => onSwitchTab?.('payouts')}
            style={{ padding: '12px 14px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.1)', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: '700' }}>
                <Wallet size={13} />
                <span>{isAr ? 'تسويات معلّقة' : 'Pending Payouts'}</span>
              </span>
              <InfoTooltip
                light
                align="end"
                size={13}
                text={
                  isAr
                    ? `${overview?.pendingPayoutsCount ?? 0} طلبات قيد المراجعة للمعلمين والسناتر • إجمالي المحوّل: ${formatMoney(overview?.settledPayoutsEgp)} ${cur}.`
                    : `${overview?.pendingPayoutsCount ?? 0} pending payout requests • Settled: ${formatMoney(overview?.settledPayoutsEgp)} ${cur}.`
                }
              />
            </div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF' }}>
              {formatMoney(overview?.pendingPayoutsEgp)} {cur}
            </div>
          </div>
        </div>
      </div>

      {/* Per-Role Revenue Attribution Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(265px, 1fr))', gap: '16px' }}>
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
              }}
            >
              <div style={{ position: 'absolute', top: 0, insetInline: 0, height: '4px', borderRadius: '20px 20px 0 0', backgroundColor: meta.accent }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: meta.bg,
                      color: meta.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '900', color: 'var(--text-primary)' }}>
                      {isAr ? meta.titleAr : meta.titleEn}
                    </span>
                    <InfoTooltip text={isAr ? meta.infoAr : meta.infoEn} size={13} />
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

              {/* Compact Stats Footer */}
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
                  {isAr ? 'الفواتير: ' : 'Invoices: '}
                  <strong style={{ color: 'var(--text-primary)' }}>{paidCount}</strong>
                </span>
                <span>
                  {isAr ? 'نشط: ' : 'Active: '}
                  <strong style={{ color: meta.accent }}>{activeSubs}</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Paid Invoices Ledger with Name Search & Server-Side Pagination */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '20px 22px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Receipt size={18} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {isAr ? 'الفواتير' : 'Invoices'}
            </h3>
            <InfoTooltip
              size={14}
              text={
                isAr
                  ? `سجل الفواتير المدفوعة فعلياً (طلاب، معلمون، سناتر). إجمالي الاشتراكات المحصلة: ${formatMoney(overview?.subscriptionRevenueEgp)} ${cur}.`
                  : `Verified paid invoices across all roles. Subscriptions total: ${formatMoney(overview?.subscriptionRevenueEgp)} ${cur}.`
              }
            />
            {invoicesMeta.total > 0 && (
              <span
                style={{
                  padding: '2px 9px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '11.5px',
                  fontWeight: '800',
                }}
              >
                {invoicesMeta.total}
              </span>
            )}
          </div>

          {/* Search by Name + Role Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  insetInlineStart: '11px',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={isAr ? 'بحث بالاسم أو رقم الفاتورة...' : 'Search by name or invoice #...'}
                style={{
                  width: '100%',
                  padding: '8px 32px 8px 34px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {searchInput && (
                <button
                  type="button"
                  aria-label={isAr ? 'مسح البحث' : 'Clear search'}
                  onClick={() => setSearchInput('')}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    insetInlineEnd: '8px',
                    border: 'none',
                    background: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              aria-label={isAr ? 'تصفية حسب الفئة' : 'Filter by role'}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="all">{isAr ? 'كل الفئات' : 'All Roles'}</option>
              <option value="teacher">{isAr ? 'المعلمون' : 'Teachers'}</option>
              <option value="student">{isAr ? 'الطلاب' : 'Students'}</option>
              <option value="center">{isAr ? 'السناتر' : 'Centers'}</option>
            </select>
          </div>
        </div>

        {invoicesLoading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '700' }}>
            {isAr ? 'جاري التحميل...' : 'Loading...'}
          </div>
        ) : invoices.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
            {debouncedSearch || roleFilter !== 'all'
              ? (isAr ? 'لا توجد فواتير مطابقة للبحث.' : 'No matching invoices found.')
              : (isAr ? 'لا توجد فواتير مدفوعة بعد.' : 'No paid invoices yet.')}
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: '620px', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-subtle)', fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '11px 14px' }}>{isAr ? 'الفاتورة' : 'Invoice #'}</th>
                    <th style={{ padding: '11px 14px' }}>{isAr ? 'المستخدم' : 'User'}</th>
                    <th style={{ padding: '11px 14px' }}>{isAr ? 'الباقة' : 'Plan'}</th>
                    <th style={{ padding: '11px 14px' }}>{isAr ? 'الدفع' : 'Method'}</th>
                    <th style={{ padding: '11px 14px' }}>{isAr ? 'التاريخ' : 'Date'}</th>
                    <th style={{ padding: '11px 14px' }}>{isAr ? 'المبلغ' : 'Amount'}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv, idx) => {
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

            {/* Pagination Bar */}
            {invoicesMeta.last_page > 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                  marginTop: '14px',
                  paddingTop: '14px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {isAr
                    ? `صفحة ${invoicesMeta.current_page} من ${invoicesMeta.last_page} • إجمالي ${invoicesMeta.total} فاتورة`
                    : `Page ${invoicesMeta.current_page} of ${invoicesMeta.last_page} • ${invoicesMeta.total} total`}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    disabled={invoicesMeta.current_page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 11px',
                      borderRadius: '9px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: invoicesMeta.current_page <= 1 ? 'not-allowed' : 'pointer',
                      opacity: invoicesMeta.current_page <= 1 ? 0.45 : 1,
                    }}
                  >
                    {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    <span>{isAr ? 'السابق' : 'Prev'}</span>
                  </button>

                  {getPageNumbers().map((num) => {
                    const active = num === invoicesMeta.current_page;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPage(num)}
                        style={{
                          minWidth: '32px',
                          height: '32px',
                          borderRadius: '9px',
                          border: active ? 'none' : '1px solid var(--border-subtle)',
                          backgroundColor: active ? '#06254E' : 'var(--bg-surface)',
                          color: active ? '#FFFFFF' : 'var(--text-primary)',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: 'pointer',
                        }}
                      >
                        {num}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={invoicesMeta.current_page >= invoicesMeta.last_page}
                    onClick={() => setPage((p) => Math.min(invoicesMeta.last_page, p + 1))}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 11px',
                      borderRadius: '9px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: invoicesMeta.current_page >= invoicesMeta.last_page ? 'not-allowed' : 'pointer',
                      opacity: invoicesMeta.current_page >= invoicesMeta.last_page ? 0.45 : 1,
                    }}
                  >
                    <span>{isAr ? 'التالي' : 'Next'}</span>
                    {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
