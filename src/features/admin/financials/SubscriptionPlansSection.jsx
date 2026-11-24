import React, { useState } from 'react';
import {
  Layers,
  RefreshCw,
  Plus,
  Building2,
  GraduationCap,
  Users,
  Check,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

export const SubscriptionPlansSection = ({
  plans = [],
  lang = 'ar',
  busyId = null,
  submitting = false,
  onSavePlan,
  onTogglePlan,
  onDeletePlan,
  onResetDefaults,
}) => {
  const isAr = lang === 'ar';
  const cur = isAr ? 'ج.م' : 'EGP';

  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedPlanId, setSelectedPlanId] = useState('all');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planToDelete, setPlanToDelete] = useState(null);

  const [planForm, setPlanForm] = useState({
    nameAr: '',
    nameEn: '',
    targetRole: 'center',
    tierKey: 'custom',
    billingCycle: 'monthly',
    priceEgp: 200,
    termPriceEgp: 800,
    annualPriceEgp: 1500,
    commissionPercent: 10,
    badgeAr: '',
    badgeEn: '',
    isPopular: false,
    isActive: true,
    featuresArText: '',
    featuresEnText: '',
  });

  const getRoleLabel = (role) => {
    if (role === 'center') return isAr ? 'سنتر تعليمي' : 'Center';
    if (role === 'teacher') return isAr ? 'معلم / محاضر' : 'Teacher';
    if (role === 'student') return isAr ? 'طالب / ولي أمر' : 'Student';
    return role;
  };

  const getRoleIcon = (role) => {
    if (role === 'center') return Building2;
    if (role === 'teacher') return GraduationCap;
    return Users;
  };

  const filteredPlans = plans.filter((p) => {
    if (selectedPlanId !== 'all') return p.id === selectedPlanId;
    if (roleFilter === 'all') return true;
    return p.targetRole === roleFilter;
  });

  const openAddModal = () => {
    setEditingPlan(null);
    setPlanForm({
      nameAr: '',
      nameEn: '',
      targetRole: roleFilter === 'all' ? 'center' : roleFilter,
      tierKey: 'custom',
      billingCycle: 'monthly',
      priceEgp: 200,
      termPriceEgp: 800,
      annualPriceEgp: 1500,
      commissionPercent: 10,
      badgeAr: 'باقة مميزة',
      badgeEn: 'Featured Tier',
      isPopular: false,
      isActive: true,
      featuresArText: 'ميزة أساسية أولى في الباقة\nميزة ثانية متكاملة مع المنصة\nدعم فني ومتابعة مستمرة',
      featuresEnText: 'First core tier benefit\nSecond integrated capability\nOngoing priority support',
    });
    setIsPlanModalOpen(true);
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    const monthly = Number(plan.priceEgp ?? 0);
    setPlanForm({
      nameAr: plan.nameAr || '',
      nameEn: plan.nameEn || '',
      targetRole: plan.targetRole || 'center',
      tierKey: plan.tierKey || 'custom',
      billingCycle: plan.billingCycle || 'monthly',
      priceEgp: monthly,
      termPriceEgp: plan.termPriceEgp !== null && plan.termPriceEgp !== undefined ? plan.termPriceEgp : monthly * 4,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!planForm.nameAr.trim()) return;

    const featuresAr = planForm.featuresArText.split('\n').map((s) => s.trim()).filter(Boolean);
    const featuresEn = planForm.featuresEnText.split('\n').map((s) => s.trim()).filter(Boolean);

    const payload = {
      nameAr: planForm.nameAr.trim(),
      nameEn: planForm.nameEn.trim() || planForm.nameAr.trim(),
      targetRole: planForm.targetRole,
      tierKey: planForm.tierKey || 'custom',
      billingCycle: planForm.billingCycle,
      priceEgp: Number(planForm.priceEgp) || 0,
      termPriceEgp: Number(planForm.termPriceEgp) || 0,
      annualPriceEgp: Number(planForm.annualPriceEgp) || 0,
      commissionPercent: planForm.targetRole === 'teacher' ? Number(planForm.commissionPercent) : null,
      badgeAr: planForm.badgeAr.trim() || null,
      badgeEn: planForm.badgeEn.trim() || planForm.badgeAr.trim() || null,
      isPopular: planForm.isPopular,
      isActive: planForm.isActive,
      featuresAr: featuresAr.length > 0 ? featuresAr : ['اشتراك معتمد في منصة متفوق'],
      featuresEn: featuresEn.length > 0 ? featuresEn : ['Full verified Motafawweq tier access'],
    };

    const ok = await onSavePlan?.(editingPlan?.id || null, payload);
    if (ok !== false) {
      setIsPlanModalOpen(false);
      setEditingPlan(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header Toolbar */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '13px',
              backgroundColor: 'var(--primary-surface)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={22} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {isAr ? 'الباقات والأسعار' : 'Plans & Pricing'}
            </h3>
            <InfoTooltip
              size={14}
              text={
                isAr
                  ? 'الأسعار الفعلية (شهري • ترم 5 شهور • سنوي) وجميع المزايا المخزنة في قاعدة البيانات وتنعكس فوراً في بوابات الطلاب والمعلمين والسناتر.'
                  : 'Live Monthly, Semester (5-Mo), and Annual prices & features synced directly with all portals.'
              }
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            disabled={submitting}
            onClick={onResetDefaults}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              padding: '9px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} />
            <span>{isAr ? 'استعادة الافتراضي' : 'Restore Defaults'}</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '11px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-primary)',
            }}
          >
            <Plus size={16} />
            <span>{isAr ? 'إضافة باقة جديدة' : 'Add Plan'}</span>
          </button>
        </div>
      </div>

      {/* Role Filter Pills + Plan Dropdown */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '14px 18px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', labelAr: `جميع الباقات (${plans.length})`, labelEn: `All (${plans.length})` },
            { id: 'center', labelAr: `باقات السناتر (${plans.filter((p) => p.targetRole === 'center').length})`, labelEn: `Centers` },
            { id: 'teacher', labelAr: `باقات المعلمين (${plans.filter((p) => p.targetRole === 'teacher').length})`, labelEn: `Teachers` },
            { id: 'student', labelAr: `باقات الطلاب (${plans.filter((p) => p.targetRole === 'student').length})`, labelEn: `Students` },
          ].map((rf) => {
            const active = roleFilter === rf.id && selectedPlanId === 'all';
            return (
              <button
                key={rf.id}
                type="button"
                onClick={() => {
                  setRoleFilter(rf.id);
                  setSelectedPlanId('all');
                }}
                style={{
                  padding: '8px 15px',
                  borderRadius: '10px',
                  border: active ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: active ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                  color: active ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: active ? '800' : '600',
                  cursor: 'pointer',
                }}
              >
                {isAr ? rf.labelAr : rf.labelEn}
              </button>
            );
          })}
        </div>

        <select
          value={selectedPlanId}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedPlanId(val);
            if (val !== 'all') {
              const found = plans.find((p) => p.id === val);
              if (found) setRoleFilter(found.targetRole);
            }
          }}
          style={{
            minWidth: '230px',
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-primary)',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          <option value="all">{isAr ? 'اختر باقة محددة أو اعرض الكل' : 'Show All Plans'}</option>
          {['center', 'teacher', 'student'].map((r) => (
            <optgroup key={r} label={getRoleLabel(r)}>
              {plans.filter((p) => p.targetRole === r).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nameAr} ({Number(p.priceEgp) > 0 ? `${p.priceEgp} ${cur}` : isAr ? 'مجانية' : 'Free'})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Plans Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 310px), 1fr))', gap: '18px' }}>
        {filteredPlans.map((plan) => {
          const RoleIcon = getRoleIcon(plan.targetRole);
          const isFree = Number(plan.priceEgp || 0) === 0;
          const activeSubs = Number(plan.activeSubscribersCount ?? 0);
          const features = isAr ? plan.featuresAr || [] : plan.featuresEn || plan.featuresAr || [];

          return (
            <div
              key={plan.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: plan.isPopular ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                borderRadius: '22px',
                padding: '22px',
                boxShadow: plan.isPopular ? '0 10px 26px rgba(21, 136, 199, 0.14)' : 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                opacity: busyId === plan.id ? 0.55 : plan.isActive ? 1 : 0.65,
              }}
            >
              <div>
                {/* Top Role + Badge + Active Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      backgroundColor: 'var(--primary-surface)',
                      color: 'var(--primary)',
                      fontSize: '11.5px',
                      fontWeight: '800',
                    }}
                  >
                    <RoleIcon size={13} />
                    <span>{getRoleLabel(plan.targetRole)}</span>
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {plan.badgeAr && (
                      <span
                        style={{
                          padding: '3px 9px',
                          borderRadius: '999px',
                          backgroundColor: plan.isPopular ? '#06254E' : 'var(--bg-subtle)',
                          color: plan.isPopular ? '#FFFFFF' : 'var(--text-secondary)',
                          fontSize: '11px',
                          fontWeight: '800',
                        }}
                      >
                        {isAr ? plan.badgeAr : plan.badgeEn || plan.badgeAr}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onTogglePlan?.(plan.id, plan.nameAr)}
                      title={plan.isActive ? (isAr ? 'تعطيل الباقة' : 'Disable') : (isAr ? 'تفعيل الباقة' : 'Activate')}
                      style={{ background: 'none', border: 'none', color: plan.isActive ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex' }}
                    >
                      {plan.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </div>

                {/* Title & Active Subscribers Pill */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
                    {isAr ? plan.nameAr : plan.nameEn || plan.nameAr}
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      backgroundColor: activeSubs > 0 ? 'rgba(22, 163, 74, 0.1)' : 'var(--bg-subtle)',
                      color: activeSubs > 0 ? '#15803D' : 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {activeSubs} {isAr ? 'مشترك نشط' : 'active'}
                  </span>
                </div>

                {/* All 3 DB Prices Box: Monthly • Term (5 Mo) • Annual */}
                <div
                  style={{
                    padding: '14px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '27px', fontWeight: '900', color: 'var(--primary)' }}>
                      {isFree ? (isAr ? 'مجاناً' : 'Free') : Number(plan.priceEgp).toLocaleString()}
                    </span>
                    {!isFree && (
                      <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                        {isAr ? `${cur} / شهرياً` : `${cur} / month`}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: '11.5px',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <div>
                      <span>{isAr ? 'الترم (5 شهور): ' : 'Term (5 Mo): '}</span>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {Number(plan.termPriceEgp || 0) > 0
                          ? `${Number(plan.termPriceEgp).toLocaleString()} ${cur}`
                          : isAr ? 'مجاني' : 'Free'}
                      </strong>
                    </div>
                    <div>
                      <span>{isAr ? 'السنوي: ' : 'Annual: '}</span>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {Number(plan.annualPriceEgp || 0) > 0
                          ? `${Number(plan.annualPriceEgp).toLocaleString()} ${cur}`
                          : isAr ? 'مجاني' : 'Free'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Full DB Features List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {features.map((feat, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(22, 163, 74, 0.12)',
                          color: '#16A34A',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        <Check size={11} strokeWidth={3} />
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => openEditModal(plan)}
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '9px 14px',
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    fontWeight: '800',
                    cursor: 'pointer',
                  }}
                >
                  <Edit3 size={14} />
                  <span>{isAr ? 'تعديل الأسعار والمزايا' : 'Edit Prices & Features'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlanToDelete(plan)}
                  title={isAr ? 'حذف الباقة' : 'Delete Plan'}
                  style={{
                    backgroundColor: 'rgba(220, 38, 38, 0.06)',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                    color: '#DC2626',
                    padding: '9px 11px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Plan Modal */}
      {isPlanModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => !submitting && setIsPlanModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 37, 78, 0.62)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '22px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {editingPlan
                  ? isAr ? `تعديل باقة: ${editingPlan.nameAr}` : `Edit Plan: ${editingPlan.nameEn}`
                  : isAr ? 'إضافة باقة اشتراك جديدة' : 'Add Subscription Plan'}
              </h3>
              <button type="button" onClick={() => setIsPlanModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {[
                  { id: 'center', labelAr: 'سنتر تعليمي', labelEn: 'Center', icon: Building2 },
                  { id: 'teacher', labelAr: 'معلم / محاضر', labelEn: 'Teacher', icon: GraduationCap },
                  { id: 'student', labelAr: 'طالب / ولي أمر', labelEn: 'Student', icon: Users },
                ].map((r) => {
                  const selected = planForm.targetRole === r.id;
                  const RIcon = r.icon;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setPlanForm((prev) => ({ ...prev, targetRole: r.id }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px 8px',
                        borderRadius: '10px',
                        border: selected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                        backgroundColor: selected ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                        color: selected ? 'var(--primary)' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                      }}
                    >
                      <RIcon size={15} />
                      <span>{isAr ? r.labelAr : r.labelEn}</span>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                    {isAr ? 'اسم الباقة (عربي) *' : 'Name (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={planForm.nameAr}
                    onChange={(e) => setPlanForm({ ...planForm, nameAr: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                    {isAr ? 'اسم الباقة (إنجليزي)' : 'Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={planForm.nameEn}
                    onChange={(e) => setPlanForm({ ...planForm, nameEn: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* 3 Billing Prices: Monthly • Term (5 Mo) • Annual */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                    {isAr ? 'شهري (ج.م)' : 'Monthly (EGP)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={planForm.priceEgp}
                    onChange={(e) => setPlanForm({ ...planForm, priceEgp: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '800', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                    {isAr ? 'ترم 5 شهور (ج.م)' : 'Term 5-Mo (EGP)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={planForm.termPriceEgp}
                    onChange={(e) => setPlanForm({ ...planForm, termPriceEgp: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '800', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                    {isAr ? 'سنوي (ج.م)' : 'Annual (EGP)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={planForm.annualPriceEgp}
                    onChange={(e) => setPlanForm({ ...planForm, annualPriceEgp: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '800', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                    {isAr ? 'شارة تمييز الباقة' : 'Badge Label'}
                  </label>
                  <input
                    type="text"
                    value={planForm.badgeAr}
                    onChange={(e) => setPlanForm({ ...planForm, badgeAr: e.target.value })}
                    placeholder={isAr ? 'مثال: الأكثر طلباً' : 'Most Popular'}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                    {isAr ? 'كود الفئة (ربط البوابات)' : 'Tier Key'}
                  </label>
                  <select
                    value={planForm.tierKey}
                    onChange={(e) => setPlanForm({ ...planForm, tierKey: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '700', boxSizing: 'border-box' }}
                  >
                    <option value="free">Free (مجانية)</option>
                    <option value="plus">Plus (بلس)</option>
                    <option value="pro">Pro (برو)</option>
                    <option value="custom">Custom (إضافية)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>
                  {isAr ? 'مزايا الباقة باللغة العربية (ميزة في كل سطر)' : 'Arabic Features (1 per line)'}
                </label>
                <textarea
                  rows={5}
                  value={planForm.featuresArText}
                  onChange={(e) => setPlanForm({ ...planForm, featuresArText: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', lineHeight: 1.6, fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>
                  <input type="checkbox" checked={planForm.isPopular} onChange={(e) => setPlanForm({ ...planForm, isPopular: e.target.checked })} />
                  <span>{isAr ? 'إبراز كباقة مفضلة (Popular)' : 'Mark as Popular'}</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>
                  <input type="checkbox" checked={planForm.isActive} onChange={(e) => setPlanForm({ ...planForm, isActive: e.target.checked })} />
                  <span>{isAr ? 'الباقة مفعّلة' : 'Active'}</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <button type="button" onClick={() => setIsPlanModalOpen(false)} style={{ backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" disabled={submitting} style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', padding: '10px 22px', borderRadius: '10px', fontSize: '13px', fontWeight: '800', cursor: submitting ? 'wait' : 'pointer' }}>
                  {submitting ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ وتحديث في قاعدة البيانات' : 'Save Plan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Plan Confirmation */}
      {planToDelete && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 37, 78, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '20px', width: '100%', maxWidth: '420px', padding: '24px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {isAr ? 'تأكيد حذف باقة الاشتراك' : 'Confirm Plan Deletion'}
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {isAr ? `هل أنت متأكد من حذف باقة «${planToDelete.nameAr}»؟` : `Delete plan "${planToDelete.nameEn}"?`}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setPlanToDelete(null)} style={{ flex: 1, padding: '9px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'transparent', fontWeight: '700', cursor: 'pointer' }}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={async () => {
                  await onDeletePlan?.(planToDelete.id);
                  setPlanToDelete(null);
                }}
                style={{ flex: 1, padding: '9px 16px', borderRadius: '10px', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', fontWeight: '800', cursor: 'pointer' }}
              >
                {isAr ? 'تأكيد الحذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
