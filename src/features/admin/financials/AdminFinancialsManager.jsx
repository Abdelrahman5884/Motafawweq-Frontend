import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { MOCK_PAYOUT_REQUESTS, MOCK_COUPONS } from '../../../data/mockAdminData';
import {
  getSubscriptionPlans,
  updateSubscriptionPlan,
  addSubscriptionPlan,
  deleteSubscriptionPlan,
  togglePlanActive,
  resetPlansToDefault
} from '../../../services/pricingStorage';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Plus,
  Ticket,
  Building,
  Check,
  X,
  Edit3,
  Trash2,
  Users,
  GraduationCap,
  Sparkles,
  Percent,
  Layers,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

export const AdminFinancialsManager = () => {
  const { lang, isRtl } = useLanguage();

  // Financial data state
  const [payouts, setPayouts] = useState(MOCK_PAYOUT_REQUESTS);
  const [coupons, setCoupons] = useState(MOCK_COUPONS);
  const [plans, setPlans] = useState(() => getSubscriptionPlans());
  
  // Navigation / Filter states
  const [activeFinanceSection, setActiveFinanceSection] = useState('plans'); // 'plans' | 'payouts' | 'coupons'
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'center' | 'teacher' | 'student'
  const [selectedPlanId, setSelectedPlanId] = useState('all'); // 'all' | plan.id

  // Modals state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // New coupon form state
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountPercent: 20,
    maxUses: 500,
    expiryDate: '2026-12-31'
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
    featuresEnText: ''
  });

  const loadPlans = () => {
    setPlans(getSubscriptionPlans());
  };

  useEffect(() => {
    loadPlans();
    const handleSync = () => loadPlans();
    window.addEventListener('pricing-updated', handleSync);
    return () => window.removeEventListener('pricing-updated', handleSync);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Payout Handlers ──
  const handleApprovePayout = (id, teacherName, amount) => {
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: 'completed' } : p));
    showToast(lang === 'ar' ? `تم اعتماد وتحويل مبلغ ${amount} ج.م إلى ${teacherName} بنجاح` : `Payout approved for ${teacherName}`);
  };

  // ── Coupon Handlers ──
  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;

    const created = {
      ...newCoupon,
      id: `cp-${Date.now()}`,
      usageCount: 0,
      status: 'active'
    };
    setCoupons([created, ...coupons]);
    setIsCouponModalOpen(false);
    setNewCoupon({ code: '', discountPercent: 20, maxUses: 500, expiryDate: '2026-12-31' });
    showToast(lang === 'ar' ? `تم تفعيل كوبون الخصم (${created.code}) بنجاح` : `Coupon created`);
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
      featuresEnText: 'First key feature\nSecond key benefit\nOngoing customer support'
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
      priceEgp: plan.priceEgp || 0,
      annualPriceEgp: plan.annualPriceEgp || 0,
      commissionPercent: plan.commissionPercent !== undefined ? plan.commissionPercent : 10,
      badgeAr: plan.badgeAr || '',
      badgeEn: plan.badgeEn || '',
      isPopular: Boolean(plan.isPopular),
      isActive: plan.isActive !== false,
      featuresArText: (plan.featuresAr || []).join('\n'),
      featuresEnText: (plan.featuresEn || []).join('\n')
    });
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = (e) => {
    e.preventDefault();
    if (!planForm.nameAr.trim()) return;

    const featuresAr = planForm.featuresArText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const featuresEn = planForm.featuresEnText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const planPayload = {
      nameAr: planForm.nameAr.trim(),
      nameEn: planForm.nameEn.trim() || planForm.nameAr.trim(),
      targetRole: planForm.targetRole,
      billingCycle: planForm.billingCycle,
      priceEgp: Number(planForm.priceEgp) || 0,
      annualPriceEgp: Number(planForm.annualPriceEgp) || 0,
      commissionPercent: planForm.targetRole === 'teacher' ? Number(planForm.commissionPercent) : undefined,
      badgeAr: planForm.badgeAr.trim(),
      badgeEn: planForm.badgeEn.trim() || planForm.badgeAr.trim(),
      isPopular: planForm.isPopular,
      isActive: planForm.isActive,
      featuresAr: featuresAr.length > 0 ? featuresAr : ['اشتراك معتمد في منصة متفوق'],
      featuresEn: featuresEn.length > 0 ? featuresEn : ['Full verified Motafawweq tier access']
    };

    if (editingPlan) {
      updateSubscriptionPlan(editingPlan.id, planPayload);
      showToast(lang === 'ar' ? `تم تحديث أسعار ومميزات (${planPayload.nameAr}) بنجاح` : 'Plan pricing updated successfully');
    } else {
      addSubscriptionPlan(planPayload);
      showToast(lang === 'ar' ? `تمت إضافة الباقة الجديدة (${planPayload.nameAr}) وتفعيلها` : 'New subscription plan created');
    }

    setIsPlanModalOpen(false);
    setEditingPlan(null);
    loadPlans();
  };

  const handleTogglePlan = (id, name) => {
    togglePlanActive(id);
    loadPlans();
    showToast(lang === 'ar' ? `تم تحديث حالة تفعيل باقة (${name})` : 'Plan status updated');
  };

  const handleConfirmDeletePlan = () => {
    if (!planToDelete) return;
    deleteSubscriptionPlan(planToDelete.id);
    loadPlans();
    showToast(lang === 'ar' ? `تم حذف الباقة بنجاح` : 'Plan deleted successfully');
    setPlanToDelete(null);
  };

  const handleResetDefaults = () => {
    if (window.confirm(lang === 'ar' ? 'هل تود استعادة باقات وأسعار المنصة الافتراضية؟' : 'Reset all subscription pricing to platform defaults?')) {
      resetPlansToDefault();
      loadPlans();
      showToast(lang === 'ar' ? 'تمت استعادة أسعار الباقات الافتراضية بنجاح' : 'Pricing reset to defaults');
    }
  };

  // Filtered plans
  const filteredPlans = plans.filter(p => {
    if (selectedPlanId !== 'all') {
      return p.id === selectedPlanId;
    }
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
      if (target) {
        setRoleFilter(target.targetRole);
      }
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: isRtl ? '24px' : 'auto',
          right: isRtl ? 'auto' : '24px',
          backgroundColor: 'var(--color-brand-dark)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          fontSize: '14px',
          fontWeight: '600'
        }}>
          <CheckCircle size={18} color="var(--primary-light)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Financial Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {[
          {
            label: lang === 'ar' ? 'إجمالي المبيعات' : 'Gross Merchandise Value (GMV)',
            val: lang === 'ar' ? '1,480,000 ج.م' : '1,480,000 EGP',
            icon: TrendingUp,
            color: 'var(--primary)',
            trend: lang === 'ar' ? '+18.4% هذا الشهر' : '+18.4% this month'
          },
          {
            label: lang === 'ar' ? 'صافي عمولة المنصة (20%)' : 'Platform Commission (20%)',
            val: lang === 'ar' ? '296,000 ج.م' : '296,000 EGP',
            icon: DollarSign,
            color: 'var(--primary)',
            trend: lang === 'ar' ? '+12.1% نمو صافي' : '+12.1% net growth'
          },
          {
            label: lang === 'ar' ? 'أرباح المعلمين المحولة' : 'Settled Tutor Payouts',
            val: lang === 'ar' ? '890,000 ج.م' : '890,000 EGP',
            icon: ArrowUpRight,
            color: 'var(--primary-light, #5CB6DB)',
            trend: lang === 'ar' ? 'تسويات مسددة بالكامل' : 'Fully settled payouts'
          },
          {
            label: lang === 'ar' ? 'تكاليف الخوادم ومعالجة الذكاء الاصطناعي' : 'Infrastructure & AI Inference Costs',
            val: lang === 'ar' ? '77,490 ج.م' : '77,490 EGP',
            icon: ArrowDownLeft,
            color: 'var(--primary)',
            trend: lang === 'ar' ? '0.42 ج.م لكل دقيقة صوتية' : '0.42 EGP per audio min'
          }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '18px',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.label}</span>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(21, 136, 199, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color
                }}>
                  <Icon size={18} />
                </div>
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {item.val}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {item.trend}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Sub Navigation Tabs ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1.5px solid var(--border-subtle)',
        paddingBottom: '12px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'plans', labelAr: 'تحديد أسعار وباقات المنصة (سناتر / مدرسين / طلبة)', labelEn: 'Tier Pricing & Packages (Centers / Tutors / Students)', icon: Layers },
          { id: 'payouts', labelAr: 'تسوية أرباح المعلمين والسناتر', labelEn: 'Teacher & Center Payouts', icon: ArrowUpRight },
          { id: 'coupons', labelAr: 'كوبونات الخصم الترويجية', labelEn: 'Discount Coupons', icon: Ticket }
        ].map(tab => {
          const isSelected = activeFinanceSection === tab.id;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFinanceSection(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '12px',
                border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-surface)',
                color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: isSelected ? '800' : '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <TabIcon size={16} />
              <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          SECTION 1: TIER PRICING & SUBSCRIPTION PACKAGES MANAGEMENT
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeFinanceSection === 'plans' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header & Controls Bar */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '18px',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(21, 136, 199, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}>
                <Layers size={22} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'إدارة وتحديد أسعار باقات المنصة الرسمية' : 'Platform Subscription Pricing & Tier Management'}
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {lang === 'ar'
                    ? 'تحكّم كامل في أسعار الاشتراكات الشهرية والسنوية، ونسب العمولة، ومزايا الباقات لجميع مستخدمي المنصة'
                    : 'Configure monthly & annual subscription fees, commission rates, and feature entitlements for all roles'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={handleResetDefaults}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  padding: '9px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
                title={lang === 'ar' ? 'استعادة أسعار الباقات الافتراضية' : 'Restore Default Pricing'}
              >
                <RefreshCw size={14} />
                <span>{lang === 'ar' ? 'استعادة الافتراضي' : 'Reset'}</span>
              </button>

              <button
                onClick={handleOpenAddPlan}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Plus size={16} />
                <span>{lang === 'ar' ? 'إضافة باقة جديدة' : 'Add New Tier'}</span>
              </button>
            </div>
          </div>

          {/* Plan Selector & Filter Controls Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '14px 18px'
          }}>
            {/* Role Filter Tabs */}
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
                    onClick={() => handleRoleFilterSelect(rf.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                      color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: '12.5px',
                      fontWeight: isSelected ? '800' : '600',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {lang === 'ar' ? rf.labelAr : rf.labelEn}
                  </button>
                );
              })}
            </div>

            {/* Direct Plan Selector Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 280px', maxWidth: '380px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                {lang === 'ar' ? 'سلكتور الباقة:' : 'Select Plan:'}
              </span>
              <select
                value={selectedPlanId}
                onChange={(e) => handlePlanSelectDropdown(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <option value="all">{lang === 'ar' ? 'عرض كل الباقات المتوفرة' : 'Show All Available Plans'}</option>
                <optgroup label={lang === 'ar' ? '🏫 باقات السناتر التعليمية' : 'Centers'}>
                  {plans.filter(p => p.targetRole === 'center').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nameAr} ({p.priceEgp} ج.م)
                    </option>
                  ))}
                </optgroup>
                <optgroup label={lang === 'ar' ? '👨‍🏫 باقات المعلمين' : 'Teachers'}>
                  {plans.filter(p => p.targetRole === 'teacher').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nameAr} ({p.priceEgp > 0 ? `${p.priceEgp} ج.م` : 'مجانية'})
                    </option>
                  ))}
                </optgroup>
                <optgroup label={lang === 'ar' ? '🎓 باقات الطلبة' : 'Students'}>
                  {plans.filter(p => p.targetRole === 'student').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nameAr} ({p.priceEgp} ج.م)
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Plans Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: '20px'
          }}>
            {filteredPlans.map(plan => {
              const RoleIcon = getRoleIcon(plan.targetRole);
              const isFree = plan.priceEgp === 0;

              return (
                <div
                  key={plan.id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: plan.isPopular
                      ? '2px solid var(--primary)'
                      : (plan.isActive ? '1px solid var(--border-subtle)' : '1px dashed var(--border-medium)'),
                    borderRadius: '20px',
                    padding: '24px',
                    boxShadow: plan.isPopular ? '0 8px 24px rgba(21, 136, 199, 0.12)' : 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    opacity: plan.isActive ? 1 : 0.65,
                    position: 'relative'
                  }}
                >
                  {/* Top Badges & Target Role */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(21, 136, 199, 0.12)',
                        color: 'var(--primary)',
                        fontSize: '11.5px',
                        fontWeight: '700'
                      }}>
                        <RoleIcon size={14} />
                        <span>{getRoleLabel(plan.targetRole)}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {plan.badgeAr && (
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(92, 182, 219, 0.15)',
                            color: 'var(--primary-light, #5CB6DB)',
                            fontSize: '11px',
                            fontWeight: '800'
                          }}>
                            {lang === 'ar' ? plan.badgeAr : (plan.badgeEn || plan.badgeAr)}
                          </span>
                        )}

                        <button
                          onClick={() => handleTogglePlan(plan.id, plan.nameAr)}
                          title={plan.isActive ? (lang === 'ar' ? 'تعطيل الباقة' : 'Disable Plan') : (lang === 'ar' ? 'تفعيل الباقة' : 'Activate Plan')}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: plan.isActive ? 'var(--primary)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {plan.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Plan Title */}
                    <h3 style={{
                      margin: '0 0 10px',
                      fontSize: '17px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      lineHeight: '1.3'
                    }}>
                      {lang === 'ar' ? plan.nameAr : (plan.nameEn || plan.nameAr)}
                    </h3>

                    {/* Price Display */}
                    <div style={{
                      padding: '14px',
                      borderRadius: '14px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                        <span style={{
                          fontSize: '28px',
                          fontWeight: '900',
                          color: 'var(--primary)',
                          fontFamily: 'var(--font-heading)'
                        }}>
                          {isFree ? (lang === 'ar' ? 'مجاناً' : 'Free') : plan.priceEgp.toLocaleString()}
                        </span>
                        {!isFree && (
                          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                            {lang === 'ar' ? 'ج.م / شهرياً' : 'EGP / month'}
                          </span>
                        )}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '11.5px',
                        color: 'var(--text-secondary)'
                      }}>
                        <span>
                          {lang === 'ar' ? 'الاشتراك السنوي: ' : 'Annual: '}
                          <strong>{plan.annualPriceEgp > 0 ? `${plan.annualPriceEgp.toLocaleString()} ${lang === 'ar' ? 'ج.م' : 'EGP'}` : (lang === 'ar' ? 'مجاني' : 'Free')}</strong>
                        </span>

                        {plan.commissionPercent !== undefined && (
                          <span style={{
                            color: 'var(--primary)',
                            fontWeight: '700',
                            backgroundColor: 'rgba(21, 136, 199, 0.1)',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            {lang === 'ar' ? `عمولة: ${plan.commissionPercent}%` : `${plan.commissionPercent}% Comm.`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {lang === 'ar' ? 'المزايا والصلاحيات المضمنة:' : 'Included Entitlements:'}
                      </span>
                      {(lang === 'ar' ? (plan.featuresAr || []) : (plan.featuresEn || plan.featuresAr || [])).map((feat, fi) => (
                        <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                          <Check size={14} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-subtle)',
                    marginTop: '12px'
                  }}>
                    <button
                      onClick={() => handleOpenEditPlan(plan)}
                      style={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '10px',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit3 size={14} />
                      <span>{lang === 'ar' ? 'تعديل السعر والمزايا' : 'Edit Plan Pricing'}</span>
                    </button>

                    <button
                      onClick={() => setPlanToDelete(plan)}
                      title={lang === 'ar' ? 'حذف الباقة' : 'Delete Tier'}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)',
                        padding: '8px 10px',
                        borderRadius: '10px',
                        cursor: 'pointer'
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

      {/* ══════════════════════════════════════════════════════════════════════════
          SECTION 2: PAYOUT REQUESTS SETTLEMENTS
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeFinanceSection === 'payouts' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '18px',
          padding: '22px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'طلبات سحب وتسوية أرباح المعلمين والسناتر' : 'Teacher & Center Payout Requests'}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'مراجعة المبالغ المستحقة والتحويل عبر فودافون كاش، إنستاباي، والتحويل البنكي' : 'Approve payments via Vodafone Cash, InstaPay, and Bank Wire'}
              </p>
            </div>
          </div>

          <div className="responsive-table-container" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table className="responsive-table" style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr style={{
                  backgroundColor: 'var(--bg-subtle)',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'var(--text-secondary)',
                  borderBottom: '1px solid var(--border-subtle)'
                }}>
                  <th style={{ padding: '12px 16px' }}>{lang === 'ar' ? 'المستفيد' : 'Recipient'}</th>
                  <th style={{ padding: '12px 16px' }}>{lang === 'ar' ? 'المبلغ المطلوب' : 'Amount'}</th>
                  <th style={{ padding: '12px 16px' }}>{lang === 'ar' ? 'طريقة الاستلام' : 'Method'}</th>
                  <th style={{ padding: '12px 16px' }}>{lang === 'ar' ? 'تاريخ الطلب' : 'Date'}</th>
                  <th style={{ padding: '12px 16px' }}>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>{lang === 'ar' ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map(p => {
                  const isCompleted = p.status === 'completed';
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '13px' }}>
                      <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {lang === 'ar' ? (p.teacherNameAr || p.teacherName) : (p.teacherNameEn || p.teacherName)}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--primary)' }}>
                        {p.amountEgp.toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                        {lang === 'ar' ? (p.methodAr || p.method) : (p.methodEn || p.method)}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                        {p.requestDate}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '700',
                          backgroundColor: isCompleted ? 'rgba(21, 136, 199, 0.12)' : 'rgba(92, 182, 219, 0.15)',
                          color: isCompleted ? 'var(--primary)' : 'var(--text-secondary)'
                        }}>
                          {isCompleted ? (lang === 'ar' ? 'تم التحويل' : 'Completed') : (lang === 'ar' ? 'قيد المراجعة' : 'Pending')}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        {!isCompleted ? (
                          <button
                            onClick={() => handleApprovePayout(p.id, p.teacherName, p.amountEgp)}
                            style={{
                              backgroundColor: 'var(--primary)',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            {lang === 'ar' ? 'تأكيد التحويل الآن' : 'Confirm Payout'}
                          </button>
                        ) : (
                          <span style={{ color: 'var(--primary)', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <Check size={14} />
                            {lang === 'ar' ? 'مسدد' : 'Settled'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          SECTION 3: COUPONS & PROMO CODES
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeFinanceSection === 'coupons' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '18px',
          padding: '22px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'كوبونات وأكواد الخصم الترويجية' : 'Platform Promo Codes & Coupons'}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'إنشاء وإدارة كوبونات الاشتراك للطلاب والمسابقات' : 'Create and manage discount codes for students'}
              </p>
            </div>

            <button
              onClick={() => setIsCouponModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} />
              <span>{lang === 'ar' ? 'إنشاء كود خصم جديد' : 'New Promo Code'}</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
            {coupons.map(cp => (
              <div
                key={cp.id}
                style={{
                  border: '1.5px dashed rgba(21, 136, 199, 0.3)',
                  borderRadius: '14px',
                  padding: '16px',
                  backgroundColor: 'var(--bg-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    letterSpacing: '1px',
                    fontFamily: 'monospace'
                  }}>
                    {cp.code}
                  </span>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(21, 136, 199, 0.12)',
                    color: 'var(--primary)',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>
                    {lang === 'ar' ? `خصم ${cp.discountPercent}%` : `${cp.discountPercent}% Off`}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'الاستخدامات: ' : 'Uses: '}<strong>{cp.usageCount}</strong>{lang === 'ar' ? ` من أصل ${cp.maxUses}` : ` of ${cp.maxUses}`}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {lang === 'ar' ? 'ينتهي في: ' : 'Expires: '}{cp.expiryDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          PLAN PRICING MODAL (ADD / EDIT)
          ══════════════════════════════════════════════════════════════════════════ */}
      {isPlanModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(6, 37, 78, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div 
            className="responsive-modal-box"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '26px',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {editingPlan
                    ? (lang === 'ar' ? `تعديل أسعار باقة: ${editingPlan.nameAr}` : `Edit Plan: ${editingPlan.nameEn}`)
                    : (lang === 'ar' ? 'إضافة وتحديد باقة اشتراك جديدة' : 'Add New Platform Tier')}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'تحديد الرسوم الشهرية والسنوية ومزايا الباقة للمنصة' : 'Configure pricing and entitlements for platform users'}
                </p>
              </div>
              <button onClick={() => setIsPlanModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePlan} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Plan Switcher Dropdown inside Modal */}
              <div style={{
                backgroundColor: 'rgba(21, 136, 199, 0.08)',
                border: '1.5px solid rgba(21, 136, 199, 0.25)',
                borderRadius: '14px',
                padding: '12px 14px'
              }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'سلكتور التبديل السريع بين الباقات:' : 'Quick Switch Between Plans:'}
                </label>
                <select
                  value={editingPlan ? editingPlan.id : 'new'}
                  onChange={(e) => {
                    const chosenId = e.target.value;
                    if (chosenId === 'new') {
                      handleOpenAddPlan();
                    } else {
                      const found = plans.find(p => p.id === chosenId);
                      if (found) handleOpenEditPlan(found);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--primary)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <option value="new">{lang === 'ar' ? '➕ إنشاء باقة جديدة تماماً' : '➕ Create Brand New Tier'}</option>
                  <optgroup label={lang === 'ar' ? '🏫 باقات السناتر التعليمية' : 'Centers'}>
                    {plans.filter(p => p.targetRole === 'center').map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nameAr} — ({p.priceEgp} ج.م/شهر)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={lang === 'ar' ? '👨‍🏫 باقات المعلمين' : 'Teachers'}>
                    {plans.filter(p => p.targetRole === 'teacher').map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nameAr} — ({p.priceEgp > 0 ? `${p.priceEgp} ج.م/شهر` : 'مجانية'}) • عمولة {p.commissionPercent}%
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={lang === 'ar' ? '🎓 باقات الطلبة' : 'Students'}>
                    {plans.filter(p => p.targetRole === 'student').map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nameAr} — ({p.priceEgp} ج.م/شهر)
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Target Role Selector */}
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
                        onClick={() => {
                          const plansOfRole = plans.filter(p => p.targetRole === r.id);
                          if (editingPlan && plansOfRole.length > 0) {
                            handleOpenEditPlan(plansOfRole[0]);
                          } else {
                            setPlanForm(prev => ({ ...prev, targetRole: r.id }));
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '10px 8px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                          backgroundColor: isSelected ? 'rgba(21, 136, 199, 0.12)' : 'var(--bg-subtle)',
                          color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        <RIcon size={15} />
                        <span>{lang === 'ar' ? r.labelAr : r.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Plan Name in Arabic & English */}
              <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'اسم الباقة (بالعربية)' : 'Plan Name (Arabic)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={planForm.nameAr}
                    onChange={e => setPlanForm({ ...planForm, nameAr: e.target.value })}
                    placeholder="مثال: باقة السنتر بلس"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
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
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              {/* Pricing (Monthly & Annual) */}
              <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'السعر الشهري (ج.م)' : 'Monthly Price (EGP)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    required
                    value={planForm.priceEgp}
                    onChange={e => setPlanForm({ ...planForm, priceEgp: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontWeight: '800'
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {lang === 'ar' ? '0 تعني باقة مجانية' : '0 = Free Plan'}
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'السعر السنوي (ج.م)' : 'Annual Price (EGP)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={planForm.annualPriceEgp}
                    onChange={e => setPlanForm({ ...planForm, annualPriceEgp: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontWeight: '800'
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {lang === 'ar' ? 'خصم الدفع السنوي المجمع' : 'Discounted upfront annual fee'}
                  </span>
                </div>
              </div>

              {/* Teacher Commission Rate (If teacher) */}
              {planForm.targetRole === 'teacher' && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                    {lang === 'ar' ? 'نسبة عمولة المنصة من مبيعات المعلم (%)' : 'Platform Sales Commission (%)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={planForm.commissionPercent}
                    onChange={e => setPlanForm({ ...planForm, commissionPercent: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--primary)',
                      fontSize: '14px',
                      fontWeight: '800'
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {lang === 'ar' ? 'تُخصم تلقائياً عند تسوية مبيعات الكورسات للمعلم' : 'Deducted automatically on course purchases'}
                  </span>
                </div>
              )}

              {/* Badge Text */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  {lang === 'ar' ? 'شارة تمييز الباقة (اختياري)' : 'Badge Label (Optional)'}
                </label>
                <input
                  type="text"
                  value={planForm.badgeAr}
                  onChange={e => setPlanForm({ ...planForm, badgeAr: e.target.value })}
                  placeholder="مثال: الأكثر طلباً، الأفضل قيمة، أو VIP"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              {/* Features Editor */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  {lang === 'ar' ? 'مزايا وصلاحيات الباقة (سطر لكل ميزة)' : 'Entitlements & Features (1 per line)'}
                </label>
                <textarea
                  rows={4}
                  value={planForm.featuresArText}
                  onChange={e => setPlanForm({ ...planForm, featuresArText: e.target.value })}
                  placeholder={'حتى 4 قاعات تعليمية\nتسجيل حضور ذكي بالباركود\nدعم فني مخصص'}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    lineHeight: '1.5'
                  }}
                />
              </div>

              {/* Switches */}
              <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                  <input
                    type="checkbox"
                    checked={planForm.isPopular}
                    onChange={e => setPlanForm({ ...planForm, isPopular: e.target.checked })}
                  />
                  <span>{lang === 'ar' ? 'إبراز كباقة رئيسية مفضلة (Featured)' : 'Mark as Featured Best Value'}</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                  <input
                    type="checkbox"
                    checked={planForm.isActive}
                    onChange={e => setPlanForm({ ...planForm, isActive: e.target.checked })}
                  />
                  <span>{lang === 'ar' ? 'تفعيل ظهور الباقة للمستخدمين الآن' : 'Publish & Activate Now'}</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    padding: '9px 18px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '9px 24px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {lang === 'ar' ? 'حفظ الأسعار وتطبيقها فوراً' : 'Save & Publish Pricing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          DELETE PLAN CONFIRMATION DIALOG
          ══════════════════════════════════════════════════════════════════════════ */}
      {planToDelete && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(6, 37, 78, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '420px',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: 'rgba(21, 136, 199, 0.12)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px'
            }}>
              <Trash2 size={24} />
            </div>

            <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'تأكيد حذف باقة الاشتراك' : 'Confirm Plan Deletion'}
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {lang === 'ar'
                ? `هل أنت متأكد من رغبتك في حذف باقة (${planToDelete.nameAr}) نهائياً من خطط أسعار المنصة؟`
                : `Are you sure you want to delete (${planToDelete.nameEn})?`}
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setPlanToDelete(null)}
                style={{
                  flex: 1,
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'transparent',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmDeletePlan}
                style={{
                  flex: 1,
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          NEW COUPON MODAL
          ══════════════════════════════════════════════════════════════════════════ */}
      {isCouponModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(6, 37, 78, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div 
            className="responsive-modal-box"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '460px',
              padding: '24px',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
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
                  {lang === 'ar' ? 'كود الخصم (Promo Code)' : 'Promo Code'}
                </label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="مثال: MOTAFAWWEQ25"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontFamily: 'monospace',
                    fontWeight: '700'
                  }}
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
                    value={newCoupon.discountPercent}
                    onChange={e => setNewCoupon({ ...newCoupon, discountPercent: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)'
                    }}
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
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  style={{ backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer' }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', padding: '8px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                >
                  {lang === 'ar' ? 'تفعيل الكود' : 'Activate Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
