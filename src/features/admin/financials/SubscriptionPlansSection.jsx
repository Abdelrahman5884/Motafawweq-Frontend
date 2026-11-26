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
  Gift,
  Percent,
} from 'lucide-react';
import { InfoTooltip } from '../../../components/common/InfoTooltip';
import { PlanEditorModal } from './PlanEditorModal';

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

  const getRoleLabel = (role) => {
    if (role === 'center') return isAr ? 'سنتر تعليمي' : 'Center';
    if (role === 'teacher') return isAr ? 'معلم / محاضر' : 'Teacher';
    if (role === 'student') return isAr ? 'طالب' : 'Student';
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
    setIsPlanModalOpen(true);
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setIsPlanModalOpen(true);
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
              {isAr ? 'الباقات والأسعار والعروض' : 'Plans, Pricing & Promotions'}
            </h3>
            <InfoTooltip
              size={14}
              text={
                isAr
                  ? 'عدّل الأسعار، فعّل عروض الخصم بالسعر المشطوب ونسبة الخصم، أو اجعل أي باقة مجانية لفترة محدودة — وتنعكس فوراً في بوابات الطلاب والمعلمين والسناتر.'
                  : 'Manage live prices, strikethrough discount offers, and temporary free promotions synced across all portals.'
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
            { id: 'student', labelAr: `باقات الطلاب (${plans.filter((p) => p.targetRole === 'student').length})`, labelEn: 'Students' },
            { id: 'teacher', labelAr: `باقات المعلمين (${plans.filter((p) => p.targetRole === 'teacher').length})`, labelEn: 'Teachers' },
            { id: 'center', labelAr: `باقات السناتر (${plans.filter((p) => p.targetRole === 'center').length})`, labelEn: 'Centers' },
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
          {['student', 'teacher', 'center'].map((r) => (
            <optgroup key={r} label={getRoleLabel(r)}>
              {plans.filter((p) => p.targetRole === r).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nameAr} ({p.isFreePromoActive ? (isAr ? 'مجانية مؤقتاً' : 'Free Promo') : Number(p.priceEgp) > 0 ? `${p.priceEgp} ${cur}` : isAr ? 'مجانية' : 'Free'})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Plans Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '18px' }}>
        {filteredPlans.map((plan) => {
          const RoleIcon = getRoleIcon(plan.targetRole);
          const isFreePromo = Boolean(plan.isFreePromoActive);
          const isFree = isFreePromo || Number(plan.priceEgp || 0) === 0;
          const hasDiscount = !isFreePromo && plan.originalPriceEgp !== null && Number(plan.originalPriceEgp) > Number(plan.priceEgp);
          const activeSubs = Number(plan.activeSubscribersCount ?? 0);
          const features = isAr ? plan.featuresAr || [] : plan.featuresEn || plan.featuresAr || [];

          return (
            <div
              key={plan.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: isFreePromo
                  ? '2px solid #059669'
                  : plan.isPopular
                    ? '2px solid var(--primary)'
                    : '1px solid var(--border-subtle)',
                borderRadius: '22px',
                padding: '22px',
                boxShadow: isFreePromo
                  ? '0 10px 26px rgba(5, 150, 105, 0.14)'
                  : plan.isPopular
                    ? '0 10px 26px rgba(21, 136, 199, 0.14)'
                    : 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                opacity: busyId === plan.id ? 0.55 : plan.isActive ? 1 : 0.62,
              }}
            >
              <div>
                {/* Top Role + Badges + Active Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
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
                    {isFreePromo && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 9px',
                          borderRadius: '999px',
                          backgroundColor: 'rgba(5, 150, 105, 0.14)',
                          color: '#059669',
                          fontSize: '11px',
                          fontWeight: '900',
                        }}
                      >
                        <Gift size={11} />
                        <span>{isAr ? 'مجانية مؤقتاً' : 'Free Promo'}</span>
                      </span>
                    )}
                    {!isFreePromo && hasDiscount && plan.discountPercent && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: '3px 9px',
                          borderRadius: '999px',
                          backgroundColor: 'rgba(239, 68, 68, 0.12)',
                          color: '#DC2626',
                          fontSize: '11px',
                          fontWeight: '900',
                        }}
                      >
                        <Percent size={10} />
                        <span>{isAr ? `خصم ${plan.discountPercent}%` : `${plan.discountPercent}% OFF`}</span>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onTogglePlan?.(plan.id, plan.nameAr)}
                      title={plan.isActive ? (isAr ? 'إخفاء الباقة' : 'Disable') : (isAr ? 'تفعيل الباقة' : 'Activate')}
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

                {/* Prices Box */}
                <div
                  style={{
                    padding: '14px',
                    borderRadius: '14px',
                    backgroundColor: isFreePromo ? 'rgba(5, 150, 105, 0.06)' : 'var(--bg-subtle)',
                    border: isFreePromo ? '1px solid rgba(5, 150, 105, 0.28)' : '1px solid var(--border-subtle)',
                    marginBottom: '14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <span style={{ fontSize: '27px', fontWeight: '900', color: isFreePromo ? '#059669' : 'var(--primary)' }}>
                      {isFree ? (isAr ? 'مجاناً' : 'Free') : Number(plan.priceEgp).toLocaleString()}
                    </span>
                    {!isFree && (
                      <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                        {isAr ? `${cur} / شهرياً` : `${cur} / month`}
                      </span>
                    )}
                    {(hasDiscount || (isFreePromo && Number(plan.priceEgp) > 0)) && (
                      <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        {Number(hasDiscount ? plan.originalPriceEgp : plan.priceEgp).toLocaleString()} {cur}
                      </span>
                    )}
                  </div>

                  {isFreePromo && plan.freePromoUntil && (
                    <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#047857', marginBottom: '8px' }}>
                      {isAr
                        ? `مجانية حتى: ${new Date(plan.freePromoUntil).toLocaleDateString('ar-EG', { dateStyle: 'medium' })}`
                        : `Free until: ${new Date(plan.freePromoUntil).toLocaleDateString()}`}
                    </div>
                  )}

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
                      <span>{isAr ? 'الترم (5 شهور): ' : 'Term: '}</span>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {isFreePromo
                          ? isAr ? 'مجاناً' : 'Free'
                          : Number(plan.termPriceEgp || 0) > 0
                            ? `${Number(plan.termPriceEgp).toLocaleString()} ${cur}`
                            : isAr ? 'مجاني' : 'Free'}
                      </strong>
                    </div>
                    <div>
                      <span>{isAr ? 'السنوي: ' : 'Annual: '}</span>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {isFreePromo
                          ? isAr ? 'مجاناً' : 'Free'
                          : Number(plan.annualPriceEgp || 0) > 0
                            ? `${Number(plan.annualPriceEgp).toLocaleString()} ${cur}`
                            : isAr ? 'مجاني' : 'Free'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Features Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {features.slice(0, 5).map((feat, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.45 }}>
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
                          marginTop: '1px',
                        }}
                      >
                        <Check size={11} strokeWidth={3} />
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                  {features.length > 5 && (
                    <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--primary)', paddingInlineStart: '26px' }}>
                      {isAr ? `+ ${features.length - 5} مزايا إضافية` : `+ ${features.length - 5} more features`}
                    </div>
                  )}
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
                    padding: '10px 14px',
                    borderRadius: '11px',
                    fontSize: '12.5px',
                    fontWeight: '800',
                    cursor: 'pointer',
                  }}
                >
                  <Edit3 size={14} />
                  <span>{isAr ? 'تعديل الأسعار والعروض' : 'Edit Prices & Offers'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlanToDelete(plan)}
                  title={isAr ? 'حذف الباقة' : 'Delete Plan'}
                  style={{
                    backgroundColor: 'rgba(220, 38, 38, 0.06)',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                    color: '#DC2626',
                    padding: '10px 12px',
                    borderRadius: '11px',
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

      {/* Redesigned Sleek Plan Editor Studio Modal */}
      {isPlanModalOpen && (
        <PlanEditorModal
          key={editingPlan?.id || 'create-plan'}
          plan={editingPlan}
          defaultRole={roleFilter === 'all' ? 'student' : roleFilter}
          lang={lang}
          submitting={submitting}
          onClose={() => {
            setIsPlanModalOpen(false);
            setEditingPlan(null);
          }}
          onSave={onSavePlan}
        />
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
