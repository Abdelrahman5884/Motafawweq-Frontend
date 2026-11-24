import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { adminApi } from '../../../services/adminApi';
import {
  TrendingUp,
  Layers,
  Receipt,
  ArrowUpRight,
  Ticket,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { FinancialOverviewSection } from './FinancialOverviewSection';
import { ManualExpensesSection, ManualExpenseModal } from './ManualExpensesSection';
import { SubscriptionPlansSection } from './SubscriptionPlansSection';
import { PayoutsSection, CouponsSection } from './PayoutsAndCouponsSection';

export const AdminFinancialsManager = () => {
  const { lang, isRtl } = useLanguage();
  const isAr = lang === 'ar';

  const [overview, setOverview] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [expensesSummary, setExpensesSummary] = useState({ totalEgp: 0, count: 0, byCategory: {} });
  const [plans, setPlans] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [coupons, setCoupons] = useState([]);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'expenses' | 'plans' | 'payouts' | 'coupons'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  // Shared Manual Expense Modal State (accessible from both Overview hero & Expenses tab)
  const [expenseModal, setExpenseModal] = useState({ open: false, expense: null });
  const [savingExpense, setSavingExpense] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const seqRef = useRef(0);

  const showToast = useCallback((text, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ text, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  const loadAllFinancials = useCallback(async () => {
    const seq = ++seqRef.current;
    setLoading(true);
    setError(null);
    try {
      const [ovRes, expRes, plansRes, payoutsRes, couponsRes] = await Promise.all([
        adminApi.financials.getOverview(),
        adminApi.financials.expenses.list({ per_page: 100 }),
        adminApi.financials.plans.list(),
        adminApi.financials.payouts.list({ per_page: 50 }),
        adminApi.financials.coupons.list({ per_page: 50 }),
      ]);
      if (seq !== seqRef.current) return;

      if (ovRes?.data) setOverview(ovRes.data);
      setExpenses(Array.isArray(expRes?.data) ? expRes.data : []);
      if (expRes?.meta?.summary) setExpensesSummary(expRes.meta.summary);
      setPlans(Array.isArray(plansRes?.data) ? plansRes.data : []);
      setPayouts(Array.isArray(payoutsRes?.data) ? payoutsRes.data : []);
      setCoupons(Array.isArray(couponsRes?.data) ? couponsRes.data : []);
    } catch (err) {
      if (seq !== seqRef.current) return;
      setError(err?.message || (isAr ? 'تعذر تحميل البيانات المالية للمنصة' : 'Failed to load financial data'));
    } finally {
      if (seq === seqRef.current) setLoading(false);
    }
  }, [isAr]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) loadAllFinancials();
    });
    return () => {
      active = false;
    };
  }, [loadAllFinancials]);

  const emitPricingSync = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pricing-updated'));
    }
  };

  // ── Manual Expense Handlers ──
  const handleSaveExpense = async (payload) => {
    setSavingExpense(true);
    try {
      if (expenseModal.expense?.id) {
        await adminApi.financials.expenses.update(expenseModal.expense.id, payload);
        showToast(isAr ? 'تم تحديث بند التكلفة وصافي الربح بنجاح' : 'Cost updated');
      } else {
        await adminApi.financials.expenses.create(payload);
        showToast(isAr ? 'تم تسجيل التكلفة اليدوية وتحديث صافي الربح بنجاح' : 'Manual cost recorded');
      }
      setExpenseModal({ open: false, expense: null });
      loadAllFinancials();
    } finally {
      setSavingExpense(false);
    }
  };

  const handleDeleteExpense = async (exp) => {
    const ok = window.confirm(
      isAr ? `هل تريد حذف بند التكلفة «${exp.title}» (${exp.amountEgp} ج.م)؟` : `Delete cost "${exp.title}"?`
    );
    if (!ok) return;
    setBusyId(exp.id);
    try {
      await adminApi.financials.expenses.delete(exp.id);
      showToast(isAr ? 'تم حذف بند التكلفة وتحديث صافي الربح' : 'Cost removed');
      loadAllFinancials();
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر حذف التكلفة' : 'Failed to delete cost'), 'error');
    } finally {
      setBusyId(null);
    }
  };

  // ── Subscription Plans Handlers ──
  const handleSavePlan = async (planId, payload) => {
    setSubmitting(true);
    try {
      if (planId) {
        await adminApi.financials.plans.update(planId, payload);
        showToast(isAr ? `تم تحديث أسعار ومزايا «${payload.nameAr}» في قاعدة البيانات` : 'Plan updated');
      } else {
        await adminApi.financials.plans.create(payload);
        showToast(isAr ? `تمت إضافة الباقة «${payload.nameAr}» وتفعيلها` : 'Plan created');
      }
      emitPricingSync();
      loadAllFinancials();
      return true;
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر حفظ بيانات الباقة' : 'Failed to save plan'), 'error');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePlan = async (id, name) => {
    setBusyId(id);
    try {
      await adminApi.financials.plans.toggleActive(id);
      emitPricingSync();
      showToast(isAr ? `تم تحديث حالة تفعيل باقة «${name}»` : 'Plan status updated');
      loadAllFinancials();
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر تحديث حالة الباقة' : 'Failed to toggle plan'), 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeletePlan = async (id) => {
    setSubmitting(true);
    try {
      await adminApi.financials.plans.delete(id);
      emitPricingSync();
      showToast(isAr ? 'تم حذف الباقة بنجاح' : 'Plan deleted');
      loadAllFinancials();
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر حذف الباقة' : 'Failed to delete plan'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm(isAr ? 'هل تود استعادة مزايا وأسعار باقات المنصة الرسمية الافتراضية في قاعدة البيانات؟' : 'Restore official default plans & prices?')) {
      return;
    }
    setSubmitting(true);
    try {
      await adminApi.financials.plans.resetDefaults();
      emitPricingSync();
      showToast(isAr ? 'تمت استعادة مزايا وأسعار الباقات الرسمية بنجاح' : 'Official plans restored');
      loadAllFinancials();
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر استعادة الباقات الافتراضية' : 'Failed to reset plans'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Payouts & Coupons Handlers ──
  const handleCreatePayout = async (payload) => {
    setSubmitting(true);
    try {
      await adminApi.financials.payouts.create(payload);
      showToast(isAr ? 'تم تسجيل طلب السحب المالي بنجاح' : 'Payout recorded');
      loadAllFinancials();
      return true;
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر تسجيل طلب السحب' : 'Failed to create payout'), 'error');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprovePayout = async (payout) => {
    setBusyId(payout.id);
    try {
      await adminApi.financials.payouts.approve(payout.id, {});
      showToast(isAr ? `تم اعتماد وتحويل مبلغ ${Number(payout.amountEgp || 0).toLocaleString()} ج.م بنجاح` : 'Payout approved');
      loadAllFinancials();
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر اعتماد طلب التحويل' : 'Failed to approve payout'), 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleRejectPayout = async (id, reason) => {
    setSubmitting(true);
    try {
      await adminApi.financials.payouts.reject(id, { rejection_reason: reason, reason });
      showToast(isAr ? 'تم رفض طلب التسوية وتحديث السجل المالي' : 'Payout rejected');
      loadAllFinancials();
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر رفض طلب التسوية' : 'Failed to reject payout'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCoupon = async (payload) => {
    setSubmitting(true);
    try {
      await adminApi.financials.coupons.create(payload);
      showToast(isAr ? `تم تفعيل كوبون الخصم (${payload.code}) بنجاح` : `Coupon (${payload.code}) created`);
      loadAllFinancials();
      return true;
    } catch (err) {
      showToast(err?.message || (isAr ? 'تعذر إنشاء كوبون الخصم' : 'Failed to create coupon'), 'error');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleCoupon = async (cp) => {
    setBusyId(cp.id);
    try {
      await adminApi.financials.coupons.toggleActive(cp.id);
      showToast(isAr ? `تم تحديث حالة الكوبون (${cp.code})` : 'Coupon updated');
      loadAllFinancials();
    } catch (err) {
      showToast(err?.message || (isAr ? 'فشل تحديث حالة الكوبون' : 'Failed to update coupon'), 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteCoupon = async (cp) => {
    setBusyId(cp.id);
    try {
      await adminApi.financials.coupons.delete(cp.id);
      showToast(isAr ? `تم حذف كوبون (${cp.code})` : 'Coupon deleted');
      loadAllFinancials();
    } catch (err) {
      showToast(err?.message || (isAr ? 'فشل حذف الكوبون' : 'Failed to delete coupon'), 'error');
    } finally {
      setBusyId(null);
    }
  };

  const tabs = [
    { id: 'overview', labelAr: 'الأرباح', labelEn: 'Profit', icon: TrendingUp },
    { id: 'expenses', labelAr: `التكاليف (${expenses.length})`, labelEn: `Costs (${expenses.length})`, icon: Receipt },
    { id: 'plans', labelAr: `الباقات (${plans.length})`, labelEn: `Plans (${plans.length})`, icon: Layers },
    { id: 'payouts', labelAr: `التسويات (${payouts.length})`, labelEn: `Payouts (${payouts.length})`, icon: ArrowUpRight },
    { id: 'coupons', labelAr: `الكوبونات (${coupons.length})`, labelEn: `Coupons (${coupons.length})`, icon: Ticket },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: isRtl ? '24px' : 'auto',
            right: isRtl ? 'auto' : '24px',
            backgroundColor: toast.type === 'error' ? '#991B1B' : 'var(--color-brand-dark)',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 10001,
            fontSize: '13.5px',
            fontWeight: '700',
          }}
        >
          {toast.type === 'error'
            ? <AlertCircle size={18} color="#FCA5A5" />
            : <CheckCircle size={18} color="var(--primary-light)" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#B91C1C',
            fontSize: '13px',
            fontWeight: '700',
          }}
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={loadAllFinancials}
            style={{ backgroundColor: '#B91C1C', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
          >
            {isAr ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* Top Navigation Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '8px 12px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {tabs.map((tab) => {
            const selected = activeTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '9px 15px',
                  borderRadius: '11px',
                  border: 'none',
                  backgroundColor: selected ? '#06254E' : 'transparent',
                  color: selected ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: selected ? '800' : '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <TabIcon size={15} />
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            loadAllFinancials();
            setRefreshTick((t) => t + 1);
          }}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 13px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          <span>{isAr ? 'تحديث' : 'Refresh'}</span>
        </button>
      </div>

      {/* Active Financial Section */}
      {activeTab === 'overview' && (
        <FinancialOverviewSection
          overview={overview}
          lang={lang}
          isRtl={isRtl}
          loading={loading}
          refreshTick={refreshTick}
          onOpenAddExpense={() => setExpenseModal({ open: true, expense: null })}
          onSwitchTab={setActiveTab}
        />
      )}

      {activeTab === 'expenses' && (
        <ManualExpensesSection
          expenses={expenses}
          expensesSummary={expensesSummary}
          lang={lang}
          busyId={busyId}
          onOpenAdd={() => setExpenseModal({ open: true, expense: null })}
          onOpenEdit={(exp) => setExpenseModal({ open: true, expense: exp })}
          onDelete={handleDeleteExpense}
        />
      )}

      {activeTab === 'plans' && (
        <SubscriptionPlansSection
          plans={plans}
          lang={lang}
          busyId={busyId}
          submitting={submitting}
          onSavePlan={handleSavePlan}
          onTogglePlan={handleTogglePlan}
          onDeletePlan={handleDeletePlan}
          onResetDefaults={handleResetDefaults}
        />
      )}

      {activeTab === 'payouts' && (
        <PayoutsSection
          payouts={payouts}
          lang={lang}
          isRtl={isRtl}
          busyId={busyId}
          submitting={submitting}
          onCreatePayout={handleCreatePayout}
          onApprovePayout={handleApprovePayout}
          onRejectPayout={handleRejectPayout}
        />
      )}

      {activeTab === 'coupons' && (
        <CouponsSection
          coupons={coupons}
          lang={lang}
          busyId={busyId}
          submitting={submitting}
          onCreateCoupon={handleCreateCoupon}
          onToggleCoupon={handleToggleCoupon}
          onDeleteCoupon={handleDeleteCoupon}
        />
      )}

      {/* Shared Manual Expense Create / Edit Modal */}
      {expenseModal.open && (
        <ManualExpenseModal
          key={expenseModal.expense?.id || 'create-expense'}
          expense={expenseModal.expense}
          lang={lang}
          isRtl={isRtl}
          saving={savingExpense}
          onClose={() => !savingExpense && setExpenseModal({ open: false, expense: null })}
          onSave={handleSaveExpense}
        />
      )}
    </div>
  );
};
