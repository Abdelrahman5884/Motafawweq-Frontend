import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { adminApi } from '../../../services/adminApi';
import {
  DollarSign,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
  Plus,
  Ticket,
  Building,
  Check,
  X,
  Edit3,
  Trash2,
  Users,
  GraduationCap,
  Layers,
  RefreshCw,
  Eye,
  EyeOff,
  XCircle
} from 'lucide-react';

export const AdminFinancialsManager = () => {
  const { lang, isRtl } = useLanguage();

  // Live Financial Data State
  const [overview, setOverview] = useState({
    gmvEgp: 0,
    subscriptionRevenueEgp: 0,
    directPaymentsVolumeEgp: 0,
    platformCommissionPercent: 20,
    platformCommissionEgp: 0,
    settledPayoutsEgp: 0,
    pendingPayoutsEgp: 0,
    pendingPayoutsCount: 0,
    aiInfrastructureCostEgp: 0,
    aiCostPerMinuteEgp: 0.42,
    activeCouponsCount: 0,
  });
  const [plans, setPlans] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [coupons, setCoupons] = useState([]);

  // Loading & Error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  // Navigation / Filter states
  const [activeFinanceSection, setActiveFinanceSection] = useState('plans'); // 'plans' | 'payouts' | 'coupons'
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'center' | 'teacher' | 'student'
  const [selectedPlanId, setSelectedPlanId] = useState('all');

  // Modals state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutToReject, setPayoutToReject] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [editingPlan, setEditingPlan] = useState(null);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  // New coupon form state
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountPercent: 20,
    maxUses: 500,
    expiryDate: '2027-12-31',
  });

  // New payout request form state
  const [newPayout, setNewPayout] = useState({
    recipientType: 'teacher',
    recipientNameAr: '',
    amountEgp: 1500,
    payoutMethod: 'instapay',
    destination: '',
    notesAr: '',
  });

  // Plan Form State (for Add / Edit)
  const [planForm, setPlanForm] = useState({
    nameAr: '',
    nameEn: '',
    targetRole: 'center',
    billingCycle: 'monthly',
    priceEgp: 850,
    annualPriceEgp: 8500,
    commissionPercent: 10,
    badgeAr: '',
    badgeEn: '',
    isPopular: false,
    isActive: true,
    featuresArText: '',
    featuresEnText: '',
  });

  const showToast = useCallback((text, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ text, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  const loadAllFinancials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ovRes, plansRes, payoutsRes, couponsRes] = await Promise.all([
        adminApi.financials.getOverview(),
        adminApi.financials.plans.list(),
        adminApi.financials.payouts.list({ per_page: 50 }),
        adminApi.financials.coupons.list({ per_page: 50 }),
      ]);
      if (ovRes?.data) setOverview(ovRes.data);
      setPlans(Array.isArray(plansRes?.data) ? plansRes.data : []);
      setPayouts(Array.isArray(payoutsRes?.data) ? payoutsRes.data : []);
      setCoupons(Array.isArray(couponsRes?.data) ? couponsRes.data : []);
    } catch (err) {
      setError(err?.message || (lang === 'ar' ? 'تعذر تحميل البيانات المالية للمنصة' : 'Failed to load financial data'));
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    loadAllFinancials();
  }, [loadAllFinancials]);

  const emitPricingSync = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pricing-updated'));
    }
  };

  // ── Payout Handlers ──
  const handleApprovePayout = async (payout) => {
    setBusyId(payout.id);
    try {
      await adminApi.financials.payouts.approve(payout.id, {});
      showToast(
        lang === 'ar'
          ? `تم اعتماد وتحويل مبلغ ${Number(payout.amountEgp || 0).toLocaleString()} ج.م إلى ${payout.teacherNameAr || payout.teacherName} بنجاح`
          : `Payout approved for ${payout.teacherNameEn || payout.teacherName}`
      );
      loadAllFinancials();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر اعتماد طلب التحويل' : 'Failed to approve payout'), 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmRejectPayout = async () => {
    if (!payoutToReject) return;
    setSubmitting(true);
    try {
      await adminApi.financials.payouts.reject(payoutToReject.id, {
        reason: rejectReason.trim() || undefined,
      });
      showToast(lang === 'ar' ? 'تم رفض طلب التسوية وتحديث السجل المالي' : 'Payout request rejected');
      setPayoutToReject(null);
      setRejectReason('');
      loadAllFinancials();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر رفض طلب التسوية' : 'Failed to reject payout'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatePayout = async (e) => {
    e.preventDefault();
    if (!newPayout.recipientNameAr.trim() || Number(newPayout.amountEgp) <= 0) return;

    setSubmitting(true);
    try {
      await adminApi.financials.payouts.create({
        recipient_type: newPayout.recipientType,
        recipient_name_ar: newPayout.recipientNameAr.trim(),
        amount_egp: Number(newPayout.amountEgp),
        payout_method: newPayout.payoutMethod,
        destination: newPayout.destination.trim() || undefined,
        notes_ar: newPayout.notesAr.trim() || undefined,
      });
      setIsPayoutModalOpen(false);
      setNewPayout({ recipientType: 'teacher', recipientNameAr: '', amountEgp: 1500, payoutMethod: 'instapay', destination: '', notesAr: '' });
      showToast(lang === 'ar' ? 'تم تسجيل طلب السحب المالي بنجاح' : 'Payout request recorded');
      loadAllFinancials();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر تسجيل طلب السحب' : 'Failed to create payout'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Coupon Handlers ──
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;

    setSubmitting(true);
    try {
      const cleanCode = newCoupon.code.trim().toUpperCase();
      await adminApi.financials.coupons.create({
        code: cleanCode,
        discount_percent: Number(newCoupon.discountPercent),
        max_uses: Number(newCoupon.maxUses) || null,
        expires_at: newCoupon.expiryDate || null,
        is_active: true,
      });
      setIsCouponModalOpen(false);
      setNewCoupon({ code: '', discountPercent: 20, maxUses: 500, expiryDate: '2027-12-31' });
      showToast(lang === 'ar' ? `تم تفعيل كوبون الخصم (${cleanCode}) بنجاح` : `Coupon (${cleanCode}) created`);
      loadAllFinancials();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر إنشاء كوبون الخصم' : 'Failed to create coupon'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleCoupon = async (cp) => {
    setBusyId(cp.id);
    try {
      await adminApi.financials.coupons.toggleActive(cp.id);
      showToast(lang === 'ar' ? `تم تحديث حالة الكوبون (${cp.code})` : `Coupon (${cp.code}) status updated`);
      loadAllFinancials();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'فشل تحديث حالة الكوبون' : 'Failed to update coupon'), 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteCoupon = async (cp) => {
    setBusyId(cp.id);
    try {
      await adminApi.financials.coupons.delete(cp.id);
      showToast(lang === 'ar' ? `تم حذف كوبون (${cp.code}) نهائياً` : `Coupon (${cp.code}) deleted`);
      loadAllFinancials();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'فشل حذف الكوبون' : 'Failed to delete coupon'), 'error');
    } finally {
      setBusyId(null);
    }
  };

  // ── Plan Pricing Handlers ──
  const handleOpenAddPlan = () => {
    setEditingPlan(null);
    setPlanForm({
      nameAr: '',
      nameEn: '',
      targetRole: roleFilter === 'all' ? 'center' : roleFilter,
      billingCycle: 'monthly',
      priceEgp: 500,
      annualPriceEgp: 5000,
      commissionPercent: 10,
      badgeAr: 'باقة جديدة',
      badgeEn: 'New Tier',
      isPopular: false,
      isActive: true,
      featuresArText: 'ميزة أولى في الباقة\nميزة ثانية مع المنصة\nدعم فني ومتابعة دورية',
      featuresEnText: 'First key feature\nSecond key benefit\nOngoing customer support',
    });
    setIsPlanModalOpen(true);
  };

  const handleOpenEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      nameAr: plan.nameAr || '',
      nameEn: plan.nameEn || '',
      targetRole: plan.targetRole || 'center',
      billingCycle: plan.billingCycle || 'monthly',
      priceEgp: plan.priceEgp ?? 0,
      annualPriceEgp: plan.annualPriceEgp ?? 0,
      commissionPercent: plan.commissionPercent !== null && plan.commissionPercent !== undefined ? plan.commissionPercent : 10,
      badgeAr: plan.badgeAr || '',
      badgeEn: plan.badgeEn || '',
      isPopular: Boolean(plan.isPopular),
      isActive: plan.isActive !== false,
      featuresArText: (plan.featuresAr || []).join('\n'),
      featuresEnText: (plan.featuresEn || []).join('\n'),
    });
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (!planForm.nameAr.trim()) return;

    const featuresAr = planForm.featuresArText.split('\n').map(s => s.trim()).filter(Boolean);
    const featuresEn = planForm.featuresEnText.split('\n').map(s => s.trim()).filter(Boolean);

    const planPayload = {
      nameAr: planForm.nameAr.trim(),
      nameEn: planForm.nameEn.trim() || planForm.nameAr.trim(),
      targetRole: planForm.targetRole,
      billingCycle: planForm.billingCycle,
      priceEgp: Number(planForm.priceEgp) || 0,
      annualPriceEgp: Number(planForm.annualPriceEgp) || 0,
      commissionPercent: planForm.targetRole === 'teacher' ? Number(planForm.commissionPercent) : null,
      badgeAr: planForm.badgeAr.trim() || null,
      badgeEn: planForm.badgeEn.trim() || planForm.badgeAr.trim() || null,
      isPopular: planForm.isPopular,
      isActive: planForm.isActive,
      featuresAr: featuresAr.length > 0 ? featuresAr : ['اشتراك معتمد في منصة متفوق'],
      featuresEn: featuresEn.length > 0 ? featuresEn : ['Full verified Motafawweq tier access'],
    };

    setSubmitting(true);
    try {
      if (editingPlan) {
        await adminApi.financials.plans.update(editingPlan.id, planPayload);
        showToast(lang === 'ar' ? `تم تحديث أسعار ومميزات (${planPayload.nameAr}) بنجاح` : 'Plan pricing updated successfully');
      } else {
        await adminApi.financials.plans.create(planPayload);
        showToast(lang === 'ar' ? `تمت إضافة الباقة الجديدة (${planPayload.nameAr}) وتفعيلها` : 'New subscription plan created');
      }
      setIsPlanModalOpen(false);
      setEditingPlan(null);
      emitPricingSync();
      loadAllFinancials();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر حفظ بيانات الباقة' : 'Failed to save plan'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePlan = async (id, name) => {
    setBusyId(id);
    try {
      await adminApi.financials.plans.toggleActive(id);
      emitPricingSync();
      showToast(lang === 'ar' ? `تم تحديث حالة تفعيل باقة (${name})` : 'Plan status updated');
      loadAllFinancials();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر تحديث حالة الباقة' : 'Failed to toggle plan'), 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmDeletePlan = async () => {
    if (!planToDelete) return;
    setSubmitting(true);
    try {
      await adminApi.financials.plans.delete(planToDelete.id);
      setPlanToDelete(null);
      emitPricingSync();
      showToast(lang === 'ar' ? 'تم حذف الباقة بنجاح' : 'Plan deleted successfully');
      loadAllFinancials();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر حذف الباقة' : 'Failed to delete plan'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm(lang === 'ar' ? 'هل تود استعادة باقات وأسعار المنصة الافتراضية؟' : 'Reset all subscription pricing to platform defaults?')) {
      return;
    }
    setSubmitting(true);
    try {
      await adminApi.financials.plans.resetDefaults();
      emitPricingSync();
      showToast(lang === 'ar' ? 'تمت استعادة أسعار الباقات الافتراضية بنجاح' : 'Pricing reset to defaults');
      loadAllFinancials();
    } catch (err) {
      showToast(err?.message || (lang === 'ar' ? 'فشل استعادة الباقات الافتراضية' : 'Failed to reset plans'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPlans = plans.filter(p => {
    if (selectedPlanId !== 'all') return p.id === selectedPlanId;
    if (roleFilter === 'all') return true;
    return p.targetRole === roleFilter;
  });

  const handleRoleFilterSelect = (rfId) => {
    setRoleFilter(rfId);
    setSelectedPlanId('all');
  };

  const handlePlanSelectDropdown = (pId) => {
    setSelectedPlanId(pId);
    if (pId !== 'all') {
      const target = plans.find(p => p.id === pId);
      if (target) setRoleFilter(target.targetRole);
    }
  };

  const getRoleLabel = (role) => {
    if (role === 'center') return lang === 'ar' ? 'سنتر تعليمي' : 'Center';
    if (role === 'teacher') return lang === 'ar' ? 'معلم / محاضر' : 'Teacher';
    if (role === 'student') return lang === 'ar' ? 'طالب / ولي أمر' : 'Student';
    return role;
  };

  const getRoleIcon = (role) => {
    if (role === 'center') return Building;
    if (role === 'teacher') return GraduationCap;
    return Users;
  };

  const cur = lang === 'ar' ? 'ج.م' : 'EGP';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', left: isRtl ? '24px' : 'auto', right: isRtl ? 'auto' : '24px',
          backgroundColor: toast.type === 'error' ? '#991B1B' : 'var(--color-brand-dark)', color: '#FFFFFF',
          padding: '12px 20px', borderRadius: '12px', boxShadow: 'var(--shadow-lg)',
          display: 'flex', alignItems: 'center', gap: '10px', zIndex: 9999, fontSize: '14px', fontWeight: '600'
        }}>
          {toast.type === 'error'
            ? <AlertCircle size={18} color="#FCA5A5" />
            : <CheckCircle size={18} color="var(--primary-light)" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px',
          padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#B91C1C', fontSize: '13px', fontWeight: '600'
        }}>
          <span>{error}</span>
          <button type="button" onClick={loadAllFinancials} style={{ backgroundColor: '#B91C1C', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
            {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* Live Financial Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {[
          {
            label: lang === 'ar' ? 'إجمالي المبيعات (GMV)' : 'Gross Merchandise Value (GMV)',
            val: `${Number(overview.gmvEgp || 0).toLocaleString()} ${cur}`,
            icon: TrendingUp,
            color: 'var(--primary)',
            trend: lang === 'ar'
              ? `اشتراكات: ${Number(overview.subscriptionRevenueEgp || 0).toLocaleString()} • مدفوعات: ${Number(overview.directPaymentsVolumeEgp || 0).toLocaleString()}`
              : `Subs: ${Number(overview.subscriptionRevenueEgp || 0).toLocaleString()} • Direct: ${Number(overview.directPaymentsVolumeEgp || 0).toLocaleString()}`
          },
          {
            label: lang === 'ar'
              ? `صافي عمولة المنصة (${overview.platformCommissionPercent ?? 20}%)`
              : `Platform Commission (${overview.platformCommissionPercent ?? 20}%)`,
            val: `${Number(overview.platformCommissionEgp || 0).toLocaleString()} ${cur}`,
            icon: DollarSign,
            color: '#047857',
            trend: lang === 'ar' ? `${overview.activeCouponsCount ?? 0} كوبون خصم نشط` : `${overview.activeCouponsCount ?? 0} active promo coupons`
          },
          {
            label: lang === 'ar' ? 'أرباح المعلمين المحولة' : 'Settled Tutor Payouts',
            val: `${Number(overview.settledPayoutsEgp || 0).toLocaleString()} ${cur}`,
            icon: ArrowUpRight,
            color: 'var(--primary-light, #5CB6DB)',
            trend: lang === 'ar'
              ? `معلّق: ${overview.pendingPayoutsCount ?? 0} طلب (${Number(overview.pendingPayoutsEgp || 0).toLocaleString()} ج.م)`
              : `Pending: ${overview.pendingPayoutsCount ?? 0} (${Number(overview.pendingPayoutsEgp || 0).toLocaleString()} EGP)`
          },
          {
            label: lang === 'ar' ? 'تكاليف الذكاء الاصطناعي والبنية' : 'Infrastructure & AI Inference Costs',
            val: `${Number(overview.aiInfrastructureCostEgp || 0).toLocaleString()} ${cur}`,
            icon: ArrowDownLeft,
            color: '#B45309',
            trend: lang === 'ar'
              ? `${overview.aiCostPerMinuteEgp ?? 0.42} ج.م لكل دقيقة صوتية`
              : `${overview.aiCostPerMinuteEgp ?? 0.42} EGP per audio min`
          }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: '18px', padding: '20px', boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.label}</span>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(21, 136, 199, 0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color
                }}>
                  <Icon size={18} />
                </div>
              </div>
              <div style={{ fontSize: '21px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {loading ? '...' : item.val}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {item.trend}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sub Navigation Tabs */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
        borderBottom: '1.5px solid var(--border-subtle)', paddingBottom: '12px', overflowX: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[
            { id: 'plans', labelAr: `باقات المنصة (${plans.length})`, labelEn: `Tier Pricing (${plans.length})`, icon: Layers },
            { id: 'payouts', labelAr: `تسويات المعلمين والسناتر (${payouts.length})`, labelEn: `Payouts (${payouts.length})`, icon: ArrowUpRight },
            { id: 'coupons', labelAr: `كوبونات الخصم (${coupons.length})`, labelEn: `Coupons (${coupons.length})`, icon: Ticket }
          ].map(tab => {
            const isSelected = activeFinanceSection === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFinanceSection(tab.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '12px',
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-surface)',
                  color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '13px', fontWeight: isSelected ? '800' : '600', cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                <TabIcon size={16} />
                <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={loadAllFinancials}
          disabled={loading}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '10px',
            border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', flexShrink: 0
          }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          <span>{lang === 'ar' ? 'تحديث' : 'Refresh'}</span>
        </button>
      </div>

      {/* ══ SECTION 1: TIER PRICING & SUBSCRIPTION PACKAGES ══ */}
      {activeFinanceSection === 'plans' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '18px',
            padding: '20px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'space-between', gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '46px', height: '46px', borderRadius: '12px', backgroundColor: 'rgba(21, 136, 199, 0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
              }}>
                <Layers size={22} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'إدارة وتحديد أسعار باقات المنصة الرسمية' : 'Platform Subscription Pricing & Tier Management'}
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {lang === 'ar'
                    ? 'أي تعديل هنا يُحفظ مباشرة في قاعدة البيانات وينعكس فوراً في صفحة الباقات العامة'
                    : 'All changes persist directly to the database and reflect live on the public Pricing page'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                disabled={submitting}
                onClick={handleResetDefaults}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent',
                  border: '1px solid var(--border-subtle)', padding: '9px 14px', borderRadius: '10px',
                  fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', cursor: 'pointer'
                }}
              >
                <RefreshCw size={14} />
                <span>{lang === 'ar' ? 'استعادة الافتراضي' : 'Reset'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddPlan}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)',
                  color: '#FFFFFF', border: 'none', padding: '9px 18px', borderRadius: '10px',
                  fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Plus size={16} />
                <span>{lang === 'ar' ? 'إضافة باقة جديدة' : 'Add New Tier'}</span>
              </button>
            </div>
          </div>

          {/* Role Filter & Plan Selector Bar */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px',
            backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '14px 18px'
          }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', labelAr: `جميع الباقات (${plans.length})`, labelEn: `All Plans (${plans.length})` },
                { id: 'center', labelAr: `باقات السناتر (${plans.filter(p => p.targetRole === 'center').length})`, labelEn: `Centers (${plans.filter(p => p.targetRole === 'center').length})` },
                { id: 'teacher', labelAr: `باقات المدرسين (${plans.filter(p => p.targetRole === 'teacher').length})`, labelEn: `Teachers (${plans.filter(p => p.targetRole === 'teacher').length})` },
                { id: 'student', labelAr: `باقات الطلبة (${plans.filter(p => p.targetRole === 'student').length})`, labelEn: `Students (${plans.filter(p => p.targetRole === 'student').length})` }
              ].map(rf => {
                const isSelected = roleFilter === rf.id && selectedPlanId === 'all';
                return (
                  <button
                    key={rf.id}
                    type="button"
                    onClick={() => handleRoleFilterSelect(rf.id)}
                    style={{
                      padding: '8px 16px', borderRadius: '10px',
                      border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                      color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: '12.5px', fontWeight: isSelected ? '800' : '600', cursor: 'pointer'
                    }}
                  >
                    {lang === 'ar' ? rf.labelAr : rf.labelEn}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 260px', maxWidth: '360px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                {lang === 'ar' ? 'سلكتور الباقة:' : 'Select Plan:'}
              </span>
              <select
                value={selectedPlanId}
                onChange={(e) => handlePlanSelectDropdown(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer'
                }}
              >
                <option value="all">{lang === 'ar' ? 'عرض كل الباقات المتوفرة' : 'Show All Plans'}</option>
                {['center', 'teacher', 'student'].map(r => (
                  <optgroup key={r} label={getRoleLabel(r)}>
                    {plans.filter(p => p.targetRole === r).map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nameAr} ({p.priceEgp > 0 ? `${p.priceEgp} ج.م` : 'مجانية'})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          {/* Plans Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
            {filteredPlans.map(plan => {
              const RoleIcon = getRoleIcon(plan.targetRole);
              const isFree = Number(plan.priceEgp || 0) === 0;

              return (
                <div
                  key={plan.id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: plan.isPopular ? '2px solid var(--primary)' : (plan.isActive ? '1px solid var(--border-subtle)' : '1px dashed var(--border-medium)'),
                    borderRadius: '20px', padding: '24px',
                    boxShadow: plan.isPopular ? '0 8px 24px rgba(21, 136, 199, 0.12)' : 'var(--shadow-sm)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px',
                    opacity: busyId === plan.id ? 0.55 : (plan.isActive ? 1 : 0.65)
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px',
                        backgroundColor: 'rgba(21, 136, 199, 0.12)', color: 'var(--primary)', fontSize: '11.5px', fontWeight: '700'
                      }}>
                        <RoleIcon size={14} />
                        <span>{getRoleLabel(plan.targetRole)}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {plan.badgeAr && (
                          <span style={{
                            padding: '3px 8px', borderRadius: '6px', backgroundColor: 'rgba(92, 182, 219, 0.15)',
                            color: 'var(--primary)', fontSize: '11px', fontWeight: '800'
                          }}>
                            {lang === 'ar' ? plan.badgeAr : (plan.badgeEn || plan.badgeAr)}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleTogglePlan(plan.id, plan.nameAr)}
                          title={plan.isActive ? (lang === 'ar' ? 'تعطيل الباقة' : 'Disable') : (lang === 'ar' ? 'تفعيل الباقة' : 'Activate')}
                          style={{ background: 'none', border: 'none', color: plan.isActive ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex' }}
                        >
                          {plan.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </div>
                    </div>

                    <h3 style={{ margin: '0 0 10px', fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.3' }}>
                      {lang === 'ar' ? plan.nameAr : (plan.nameEn || plan.nameAr)}
                    </h3>

                    <div style={{
                      padding: '14px', borderRadius: '14px', backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)', marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '26px', fontWeight: '900', color: 'var(--primary)' }}>
                          {isFree ? (lang === 'ar' ? 'مجاناً' : 'Free') : Number(plan.priceEgp).toLocaleString()}
                        </span>
                        {!isFree && (
                          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                            {lang === 'ar' ? 'ج.م / شهرياً' : 'EGP / month'}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        <span>
                          {lang === 'ar' ? 'السنوي: ' : 'Annual: '}
                          <strong>{Number(plan.annualPriceEgp || 0) > 0 ? `${Number(plan.annualPriceEgp).toLocaleString()} ${cur}` : (lang === 'ar' ? 'مجاني' : 'Free')}</strong>
                        </span>
                        {plan.commissionPercent !== null && plan.commissionPercent !== undefined && (
                          <span style={{ color: 'var(--primary)', fontWeight: '700', backgroundColor: 'rgba(21, 136, 199, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                            {lang === 'ar' ? `عمولة: ${plan.commissionPercent}%` : `${plan.commissionPercent}% Comm.`}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      {(lang === 'ar' ? (plan.featuresAr || []) : (plan.featuresEn || plan.featuresAr || [])).map((feat, fi) => (
                        <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                          <Check size={14} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEditPlan(plan)}
                      style={{
                        flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', padding: '8px 14px',
                        borderRadius: '10px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer'
                      }}
                    >
                      <Edit3 size={14} />
                      <span>{lang === 'ar' ? 'تعديل السعر والمزايا' : 'Edit Plan'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlanToDelete(plan)}
                      title={lang === 'ar' ? 'حذف الباقة' : 'Delete Tier'}
                      style={{
                        backgroundColor: 'transparent', border: '1px solid var(--border-subtle)',
                        color: 'var(--color-danger)', padding: '8px 10px', borderRadius: '10px', cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ SECTION 2: PAYOUT REQUESTS SETTLEMENTS ══ */}
      {activeFinanceSection === 'payouts' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: '18px', padding: '22px', boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'طلبات سحب وتسوية أرباح المعلمين والسناتر' : 'Teacher & Center Payout Requests'}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'مراجعة المبالغ المستحقة واعتماد أو رفض التحويلات عبر فودافون كاش وإنستاباي والبنك' : 'Review, approve, or reject payout transfers'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPayoutModalOpen(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', color: '#fff',
                border: 'none', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer'
              }}
            >
              <Plus size={16} />
              <span>{lang === 'ar' ? 'تسجيل طلب صرف جديد' : 'Record Payout'}</span>
            </button>
          </div>

          <div className="responsive-table-container" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table className="responsive-table" style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr style={{
                  backgroundColor: 'var(--bg-subtle)', fontSize: '12px', fontWeight: '700',
                  color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)'
                }}>
                  <th style={{ padding: '12px 16px' }}>{lang === 'ar' ? 'المستفيد والمرجع' : 'Recipient & Ref'}</th>
                  <th style={{ padding: '12px 16px' }}>{lang === 'ar' ? 'المبلغ المطلوب' : 'Amount'}</th>
                  <th style={{ padding: '12px 16px' }}>{lang === 'ar' ? 'طريقة الاستلام' : 'Method'}</th>
                  <th style={{ padding: '12px 16px' }}>{lang === 'ar' ? 'تاريخ الطلب' : 'Date'}</th>
                  <th style={{ padding: '12px 16px' }}>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>{lang === 'ar' ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'لا توجد طلبات تسوية مالية مسجلة حتى الآن' : 'No payout requests recorded yet'}
                    </td>
                  </tr>
                ) : (
                  payouts.map(p => {
                    const isCompleted = p.status === 'completed';
                    const isRejected = p.status === 'rejected';
                    const isPending = p.status === 'pending';
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '13px', opacity: busyId === p.id ? 0.6 : 1 }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                            {lang === 'ar' ? (p.teacherNameAr || p.teacherName) : (p.teacherNameEn || p.teacherName)}
                          </div>
                          {p.referenceNumber && (
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                              {p.referenceNumber}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--primary)' }}>
                          {Number(p.amountEgp || 0).toLocaleString()} {cur}
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                          <div>{lang === 'ar' ? (p.methodAr || p.method) : (p.methodEn || p.method)}</div>
                          {p.destinationMasked && (
                            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                              {p.destinationMasked}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                          {p.requestDate || '—'}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                            backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.12)' : isRejected ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.14)',
                            color: isCompleted ? '#047857' : isRejected ? '#B91C1C' : '#B45309'
                          }}>
                            {isCompleted ? (lang === 'ar' ? 'تم التحويل' : 'Completed')
                              : isRejected ? (lang === 'ar' ? 'مرفوض' : 'Rejected')
                              : (lang === 'ar' ? 'قيد المراجعة' : 'Pending')}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          {isPending ? (
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              <button
                                type="button"
                                disabled={busyId === p.id}
                                onClick={() => handleApprovePayout(p)}
                                style={{
                                  backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none',
                                  padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer'
                                }}
                              >
                                {lang === 'ar' ? 'تأكيد التحويل' : 'Approve'}
                              </button>
                              <button
                                type="button"
                                disabled={busyId === p.id}
                                onClick={() => { setPayoutToReject(p); setRejectReason(''); }}
                                style={{
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#B91C1C',
                                  border: '1px solid rgba(239, 68, 68, 0.25)', padding: '6px 10px',
                                  borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer'
                                }}
                              >
                                {lang === 'ar' ? 'رفض' : 'Reject'}
                              </button>
                            </div>
                          ) : isCompleted ? (
                            <span style={{ color: '#047857', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
                              <Check size={14} />
                              {p.transferReference || (lang === 'ar' ? 'مسدد' : 'Settled')}
                            </span>
                          ) : (
                            <span style={{ color: '#B91C1C', fontSize: '11.5px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <XCircle size={13} />
                              {p.rejectionReason || (lang === 'ar' ? 'مرفوض' : 'Rejected')}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ SECTION 3: COUPONS & PROMO CODES ══ */}
      {activeFinanceSection === 'coupons' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: '18px', padding: '22px', boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'كوبونات وأكواد الخصم الترويجية' : 'Platform Promo Codes & Coupons'}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'إنشاء وتفعيل وإيقاف كوبونات الاشتراك الترويجية للطلاب' : 'Create, toggle, and delete discount codes'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCouponModalOpen(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary)', color: '#FFFFFF',
                border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer'
              }}
            >
              <Plus size={16} />
              <span>{lang === 'ar' ? 'إنشاء كود خصم جديد' : 'New Promo Code'}</span>
            </button>
          </div>

          {coupons.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13.5px' }}>
              {lang === 'ar' ? 'لا توجد كوبونات خصم منشأة بعد' : 'No coupons created yet'}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
              {coupons.map(cp => (
                <div
                  key={cp.id}
                  style={{
                    border: cp.isActive ? '1.5px dashed rgba(21, 136, 199, 0.35)' : '1.5px dashed var(--border-subtle)',
                    borderRadius: '14px', padding: '16px', backgroundColor: 'var(--bg-subtle)',
                    display: 'flex', flexDirection: 'column', gap: '8px',
                    opacity: busyId === cp.id ? 0.5 : (cp.isActive ? 1 : 0.65)
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px', fontFamily: 'monospace' }}>
                      {cp.code}
                    </span>
                    <span style={{
                      padding: '3px 8px', borderRadius: '6px', backgroundColor: 'rgba(21, 136, 199, 0.12)',
                      color: 'var(--primary)', fontSize: '11px', fontWeight: '700'
                    }}>
                      {lang === 'ar' ? `خصم ${cp.discountPercent}%` : `${cp.discountPercent}% Off`}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'الاستخدامات: ' : 'Uses: '}
                    <strong>{cp.usageCount ?? 0}</strong>
                    {cp.maxUses ? (lang === 'ar' ? ` من أصل ${cp.maxUses}` : ` of ${cp.maxUses}`) : (lang === 'ar' ? ' (غير محدود)' : ' (Unlimited)')}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {lang === 'ar' ? 'ينتهي في: ' : 'Expires: '}{cp.expiryDate || (lang === 'ar' ? 'مفتوح' : 'No expiry')}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleCoupon(cp)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)', padding: '5px 10px', borderRadius: '8px',
                        fontSize: '11.5px', fontWeight: '700', color: cp.isActive ? '#047857' : 'var(--text-secondary)', cursor: 'pointer'
                      }}
                    >
                      {cp.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                      <span>{cp.isActive ? (lang === 'ar' ? 'مفعّل' : 'Active') : (lang === 'ar' ? 'متوقف' : 'Paused')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCoupon(cp)}
                      title={lang === 'ar' ? 'حذف الكوبون' : 'Delete Coupon'}
                      style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ PLAN PRICING MODAL (ADD / EDIT) ══ */}
      {isPlanModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div className="responsive-modal-box" style={{
            backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-subtle)', borderRadius: '24px',
            width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '26px', boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {editingPlan
                    ? (lang === 'ar' ? `تعديل أسعار باقة: ${editingPlan.nameAr}` : `Edit Plan: ${editingPlan.nameEn}`)
                    : (lang === 'ar' ? 'إضافة باقة اشتراك جديدة' : 'Add New Platform Tier')}
                </h3>
              </div>
              <button onClick={() => setIsPlanModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePlan} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'الفئة المستهدفة بالباقة' : 'Target User Group'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {[
                    { id: 'center', labelAr: 'سنتر تعليمي', labelEn: 'Center', icon: Building },
                    { id: 'teacher', labelAr: 'معلم / محاضر', labelEn: 'Teacher', icon: GraduationCap },
                    { id: 'student', labelAr: 'طالب / ولي أمر', labelEn: 'Student', icon: Users }
                  ].map(r => {
                    const isSelected = planForm.targetRole === r.id;
                    const RIcon = r.icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setPlanForm(prev => ({ ...prev, targetRole: r.id }))}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 8px',
                          borderRadius: '10px', border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                          backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                          color: isSelected ? 'var(--primary)' : 'var(--text-secondary)', fontSize: '12px', fontWeight: '700', cursor: 'pointer'
                        }}
                      >
                        <RIcon size={15} />
                        <span>{lang === 'ar' ? r.labelAr : r.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'اسم الباقة (بالعربية)' : 'Plan Name (Arabic)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={planForm.nameAr}
                    onChange={e => setPlanForm({ ...planForm, nameAr: e.target.value })}
                    placeholder="مثال: باقة السنتر بلس"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'اسم الباقة (بالإنجليزية)' : 'Plan Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={planForm.nameEn}
                    onChange={e => setPlanForm({ ...planForm, nameEn: e.target.value })}
                    placeholder="e.g. Center Plus Tier"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'السعر الشهري (ج.م)' : 'Monthly Price (EGP)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={planForm.priceEgp}
                    onChange={e => setPlanForm({ ...planForm, priceEgp: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '800' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'السعر السنوي (ج.م)' : 'Annual Price (EGP)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={planForm.annualPriceEgp}
                    onChange={e => setPlanForm({ ...planForm, annualPriceEgp: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '800' }}
                  />
                </div>
              </div>

              {planForm.targetRole === 'teacher' && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'نسبة عمولة المنصة من مبيعات المعلم (%)' : 'Platform Commission (%)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={planForm.commissionPercent}
                    onChange={e => setPlanForm({ ...planForm, commissionPercent: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--primary)', fontSize: '14px', fontWeight: '800' }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  {lang === 'ar' ? 'شارة تمييز الباقة (اختياري)' : 'Badge Label (Optional)'}
                </label>
                <input
                  type="text"
                  value={planForm.badgeAr}
                  onChange={e => setPlanForm({ ...planForm, badgeAr: e.target.value })}
                  placeholder="مثال: الأكثر طلباً"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  {lang === 'ar' ? 'مزايا الباقة (سطر لكل ميزة)' : 'Features (1 per line)'}
                </label>
                <textarea
                  rows={4}
                  value={planForm.featuresArText}
                  onChange={e => setPlanForm({ ...planForm, featuresArText: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', lineHeight: '1.5' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                  <input type="checkbox" checked={planForm.isPopular} onChange={e => setPlanForm({ ...planForm, isPopular: e.target.checked })} />
                  <span>{lang === 'ar' ? 'إبراز كباقة مفضلة (Popular)' : 'Mark as Popular'}</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                  <input type="checkbox" checked={planForm.isActive} onChange={e => setPlanForm({ ...planForm, isActive: e.target.checked })} />
                  <span>{lang === 'ar' ? 'تفعيل الباقة الآن' : 'Active'}</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <button type="button" onClick={() => setIsPlanModalOpen(false)} style={{ backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" disabled={submitting} style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', padding: '9px 24px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: submitting ? 'wait' : 'pointer' }}>
                  {submitting ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ وتطبيق فوراً' : 'Save Pricing')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE PLAN MODAL */}
      {planToDelete && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-subtle)', borderRadius: '20px',
            width: '100%', maxWidth: '420px', padding: '24px', boxShadow: 'var(--shadow-xl)', textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'تأكيد حذف باقة الاشتراك' : 'Confirm Plan Deletion'}
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {lang === 'ar' ? `هل أنت متأكد من حذف باقة (${planToDelete.nameAr}) نهائياً؟` : `Are you sure you want to delete (${planToDelete.nameEn})?`}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setPlanToDelete(null)} style={{ flex: 1, padding: '9px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'transparent', fontWeight: '700', cursor: 'pointer' }}>
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button type="button" disabled={submitting} onClick={handleConfirmDeletePlan} style={{ flex: 1, padding: '9px 16px', borderRadius: '10px', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', fontWeight: '700', cursor: 'pointer' }}>
                {lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW PAYOUT MODAL */}
      {isPayoutModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-subtle)', borderRadius: '22px',
            width: '100%', maxWidth: '480px', padding: '24px', boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'تسجيل طلب صرف مستحقات' : 'Record New Payout Request'}
              </h3>
              <button onClick={() => setIsPayoutModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreatePayout} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>{lang === 'ar' ? 'نوع المستفيد' : 'Recipient Type'}</label>
                  <select value={newPayout.recipientType} onChange={e => setNewPayout({ ...newPayout, recipientType: e.target.value })} style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}>
                    <option value="teacher">{lang === 'ar' ? 'معلم' : 'Teacher'}</option>
                    <option value="center">{lang === 'ar' ? 'سنتر تعليمي' : 'Center'}</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>{lang === 'ar' ? 'وسيلة الدفع' : 'Method'}</label>
                  <select value={newPayout.payoutMethod} onChange={e => setNewPayout({ ...newPayout, payoutMethod: e.target.value })} style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}>
                    <option value="instapay">InstaPay</option>
                    <option value="vodafone">Vodafone Cash</option>
                    <option value="bank">{lang === 'ar' ? 'تحويل بنكي' : 'Bank Wire'}</option>
                    <option value="fawry">Fawry</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>{lang === 'ar' ? 'اسم المستفيد' : 'Recipient Name'} *</label>
                <input type="text" required value={newPayout.recipientNameAr} onChange={e => setNewPayout({ ...newPayout, recipientNameAr: e.target.value })} placeholder="مثال: أ. محمد عبد الرحمن" style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>{lang === 'ar' ? 'المبلغ (ج.م)' : 'Amount (EGP)'} *</label>
                  <input type="number" min="1" required value={newPayout.amountEgp} onChange={e => setNewPayout({ ...newPayout, amountEgp: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontWeight: '800' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>{lang === 'ar' ? 'رقم المحفظة / الحساب' : 'Destination'}</label>
                  <input type="text" value={newPayout.destination} onChange={e => setNewPayout({ ...newPayout, destination: e.target.value })} placeholder="010XXXXXXXX" style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsPayoutModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'transparent', cursor: 'pointer' }}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" disabled={submitting} style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>{lang === 'ar' ? 'تسجيل الطلب' : 'Create Payout'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT PAYOUT MODAL */}
      {payoutToReject && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-subtle)', borderRadius: '20px',
            width: '100%', maxWidth: '430px', padding: '24px', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', gap: '12px'
          }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'رفض طلب التحويل المالي' : 'Reject Payout Request'}
            </h3>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder={lang === 'ar' ? 'اكتب سبب الرفض ليظهر في السجل المالي...' : 'Enter rejection reason...'}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setPayoutToReject(null)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'transparent', cursor: 'pointer' }}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
              <button type="button" disabled={submitting} onClick={handleConfirmRejectPayout} style={{ padding: '8px 18px', borderRadius: '10px', border: 'none', backgroundColor: '#DC2626', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>{lang === 'ar' ? 'تأكيد الرفض' : 'Confirm Reject'}</button>
            </div>
          </div>
        </div>
      )}

      {/* NEW COUPON MODAL */}
      {isCouponModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
          <div className="responsive-modal-box" style={{
            backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--border-subtle)', borderRadius: '24px',
            width: '100%', maxWidth: '460px', padding: '24px', boxShadow: 'var(--shadow-xl)', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'إنشاء كود خصم جديد' : 'Create New Coupon'}
              </h3>
              <button onClick={() => setIsCouponModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  {lang === 'ar' ? 'كود الخصم (أحرف إنجليزية وأرقام فقط)' : 'Promo Code (A-Z, 0-9)'} *
                </label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="MOTAFAWWEQ25"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontFamily: 'monospace', fontWeight: '700' }}
                />
              </div>

              <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'نسبة الخصم (%)' : 'Discount (%)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newCoupon.discountPercent}
                    onChange={e => setNewCoupon({ ...newCoupon, discountPercent: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'الحد الأقصى للاستخدام' : 'Max Uses'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCoupon.maxUses}
                    onChange={e => setNewCoupon({ ...newCoupon, maxUses: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  {lang === 'ar' ? 'تاريخ انتهاء الصلاحية' : 'Expiry Date'}
                </label>
                <input
                  type="date"
                  value={newCoupon.expiryDate}
                  onChange={e => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsCouponModalOpen(false)} style={{ backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer' }}>
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" disabled={submitting} style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', padding: '8px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>
                  {submitting ? (lang === 'ar' ? 'جاري التفعيل...' : 'Saving...') : (lang === 'ar' ? 'تفعيل الكود' : 'Activate Code')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
