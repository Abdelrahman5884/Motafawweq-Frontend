import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { CENTER_SUBSCRIPTION_PLANS, MOCK_CENTER_INVOICES } from '../../data/centerData';
import { 
  Building2, 
  CreditCard, 
  Crown, 
  Check, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  ArrowRight,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Receipt,
  Download,
  AlertCircle
} from 'lucide-react';

export const CenterBillingView = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();

  // Active Center Subscription Details
  const [activePlanId, setActivePlanId] = useState('plan-center-plus');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly'); // 'monthly' | 'term' | 'annual'
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [invoices, setInvoices] = useState(MOCK_CENTER_INVOICES);
  const [successToast, setSuccessToast] = useState('');

  const ActionArrow = isRtl ? ArrowLeft : ArrowRight;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'CENTER2026' || clean === 'MOTAFAWWEQ2026') {
      setCouponApplied(true);
      setSuccessToast(lang === 'ar' ? 'تم تطبيق خصم 20% بنجاح!' : '20% discount code applied!');
      setTimeout(() => setSuccessToast(''), 3500);
    } else {
      alert(lang === 'ar' ? 'كود الخصم غير صحيح. جرب: CENTER2026' : 'Invalid code. Try: CENTER2026');
    }
  };

  const handleSelectPlan = (plan) => {
    setActivePlanId(plan.id);
    const pricing = plan.pricing[selectedPeriod];
    const basePrice = pricing.priceEgp;
    const finalPrice = couponApplied ? Math.round(basePrice * 0.8) : basePrice;

    if (plan.tier !== 'free') {
      const newInvoice = {
        id: `C-INV-2026-${Math.floor(Math.random() * 900 + 100)}`,
        date: lang === 'ar' ? 'اليوم' : 'Today',
        descriptionAr: `اشتراك ${plan.nameAr} (${selectedPeriod === 'monthly' ? 'شهري' : selectedPeriod === 'term' ? 'نصف سنوي - 5 شهور' : 'سنة كاملة'})`,
        descriptionEn: `${plan.nameEn} (${selectedPeriod})`,
        amount: `${finalPrice} ج.م`,
        amountEn: `${finalPrice} EGP`,
        method: lang === 'ar' ? 'إنستاباي' : 'InstaPay Transfer',
        methodAr: 'إنستاباي',
        methodEn: 'InstaPay Transfer',
        status: lang === 'ar' ? 'مدفوع' : 'Paid'
      };
      setInvoices(prev => [newInvoice, ...prev]);
    }

    setSuccessToast(lang === 'ar' 
      ? `تم ترقية اشتراك السنتر بنجاح إلى "${plan.nameAr}".`
      : `Center subscription successfully updated to "${plan.nameEn}".`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const currentPlan = CENTER_SUBSCRIPTION_PLANS.find(p => p.id === activePlanId) || CENTER_SUBSCRIPTION_PLANS[1];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      fontFamily: isRtl ? 'var(--font-arabic, "Cairo", sans-serif)' : 'var(--font-sans, "Inter", sans-serif)'
    }}>
      {/* ══════════════════ HEADER ══════════════════ */}
      <div style={{
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-surface, rgba(21, 136, 199, 0.1))',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CreditCard size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: 'var(--primary-surface, rgba(21, 136, 199, 0.1))',
                color: 'var(--primary)'
              }}>
                {lang === 'ar' ? 'إدارة الاشتراكات والفواتير' : 'Billing & Subscription'}
              </span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: '4px 0 0' }}>
              {lang === 'ar' ? 'باقات واشتراكات السنتر التعليمي' : 'Center Subscription Plans & Pricing'}
            </h1>
          </div>
        </div>

        {/* Quick Help Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: '10px',
          backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)',
          border: '1px solid var(--border-medium)',
          fontSize: '12.5px',
          color: 'var(--text-secondary)'
        }}>
          <ShieldCheck size={16} color="var(--primary)" />
          <span>{lang === 'ar' ? 'فواتير رسمية ودفع آمن 100%' : '100% Secure Local Billing'}</span>
        </div>
      </div>

      {/* ══════════════════ ACTIVE PLAN SUMMARY CARD ══════════════════ */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)',
        border: '1px solid var(--border-medium)',
        borderRadius: '16px',
        padding: '22px 24px',
        marginBottom: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            backgroundColor: 'var(--primary-surface, rgba(21, 136, 199, 0.12))',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Crown size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? currentPlan.nameAr : currentPlan.nameEn}
              </h3>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(22, 163, 74, 0.12)',
                color: 'var(--color-success, #16A34A)'
              }}>
                {lang === 'ar' ? 'الاشتراك ساري ونشط' : 'Active Plan'}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              {currentPlan.id === 'plan-center-pro'
                ? (lang === 'ar' ? 'مستخدمين وطلاب غير محدودين • السعر: 400 ج.م شهرياً' : 'Unlimited users capacity • 400 EGP / mo')
                : currentPlan.id === 'plan-center-plus'
                ? (lang === 'ar' ? 'سعة 500 مستخدم (نشط حالياً: 340 طالب ومعلم) • السعر: 200 ج.م شهرياً' : 'Capacity: 500 users (340 active) • 200 EGP / mo')
                : (lang === 'ar' ? 'سعة 100 مستخدم • باقة مجانية دائمة' : 'Capacity: 100 users • Free')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lang === 'ar' ? 'تاريخ التجديد' : 'Next Renewal'}</div>
            <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>2026-12-30 (باقي 54 يوماً)</div>
          </div>
        </div>
      </div>

      {/* ══════════════════ SUCCESS TOAST ══════════════════ */}
      {successToast && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '12px',
          backgroundColor: 'rgba(22, 163, 74, 0.1)',
          border: '1px solid rgba(22, 163, 74, 0.25)',
          color: 'var(--color-success, #16A34A)',
          fontSize: '13.5px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* ══════════════════ PERIOD SELECTOR & COUPON BAR ══════════════════ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        padding: '14px 20px',
        backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)',
        borderRadius: '14px',
        border: '1px solid var(--border-medium)',
        marginBottom: '26px'
      }}>
        {/* Period Selector Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[
            { id: 'monthly', labelAr: 'شهرياً', labelEn: 'Monthly' },
            { id: 'term', labelAr: 'للترم (5 شهور)', labelEn: 'Semester (5 mo)', badgeAr: 'وفر 20%', badgeEn: 'Save 20%' },
            { id: 'annual', labelAr: 'سنة دراسية (10 شهور)', labelEn: 'Full Year (10 mo)', badgeAr: 'وفر 25%', badgeEn: 'Save 25%' }
          ].map(p => {
            const isSel = selectedPeriod === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPeriod(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: isSel ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                  backgroundColor: isSel ? 'var(--primary-surface, rgba(21, 136, 199, 0.1))' : 'transparent',
                  color: isSel ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: isSel ? '800' : '600',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{lang === 'ar' ? p.labelAr : p.labelEn}</span>
                {p.badgeAr && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF'
                  }}>
                    {lang === 'ar' ? p.badgeAr : p.badgeEn}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Promo Coupon Form */}
        <form onSubmit={handleApplyCoupon} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder={lang === 'ar' ? 'كود الخصم (CENTER2026)' : 'Promo Code'}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-subtle, #f8fafc)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              width: '180px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {lang === 'ar' ? 'تطبيق' : 'Apply'}
          </button>
        </form>
      </div>

      {/* ══════════════════ 3 CENTER CARDS (FREE / PLUS 200 / PRO 400) ══════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
        gap: '24px',
        alignItems: 'stretch',
        marginBottom: '40px'
      }}>
        {CENTER_SUBSCRIPTION_PLANS.map(plan => {
          const isCurrent = activePlanId === plan.id;
          const isPro = plan.tier === 'pro';
          const pricing = plan.pricing[selectedPeriod];
          let basePrice = pricing.priceEgp;
          if (couponApplied && plan.tier !== 'free') {
            basePrice = Math.round(basePrice * 0.8);
          }

          return (
            <div
              key={plan.id}
              style={{
                position: 'relative',
                backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)',
                border: isCurrent 
                  ? '2px solid var(--primary)' 
                  : (isPro ? '2px solid var(--primary-light, #5CB6DB)' : '1px solid var(--border-medium)'),
                borderRadius: '16px',
                padding: '28px 24px',
                boxShadow: isCurrent 
                  ? '0 10px 28px rgba(21, 136, 199, 0.18)' 
                  : 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              {isCurrent && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  [isRtl ? 'right' : 'left']: '24px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '3px 12px',
                  borderRadius: '9999px',
                  boxShadow: '0 4px 10px rgba(21, 136, 199, 0.3)'
                }}>
                  {lang === 'ar' ? 'باقتك الحالية' : 'Current Plan'}
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                    {lang === 'ar' ? plan.nameAr : plan.nameEn}
                  </h3>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--primary-surface, rgba(21, 136, 199, 0.1))',
                    color: 'var(--primary)'
                  }}>
                    {plan.tier.toUpperCase()}
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', minHeight: '34px', lineHeight: 1.5 }}>
                  {lang === 'ar' ? plan.taglineAr : plan.taglineEn}
                </p>

                {/* Capacity User Limit Pill */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle, #f8fafc)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  marginBottom: '18px'
                }}>
                  <Users size={14} color="var(--primary)" />
                  <span>{lang === 'ar' ? plan.usersLimitAr : plan.usersLimitEn}</span>
                </div>

                {/* Price Display */}
                <div style={{
                  marginBottom: '20px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--border-medium)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '38px', fontWeight: '900', color: 'var(--text-primary)' }}>
                      {basePrice}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                      {plan.tier === 'free'
                        ? (lang === 'ar' ? 'دائم مجاناً' : 'Forever Free')
                        : (lang === 'ar'
                            ? (selectedPeriod === 'monthly' ? 'جنيه / شهرياً' : selectedPeriod === 'term' ? 'جنيه / للترم' : 'جنيه / للسنة')
                            : 'EGP')}
                    </span>
                  </div>
                </div>

                {/* Feature Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px' }}>
                  {(lang === 'ar' ? plan.featuresAr : plan.featuresEn).map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-surface, rgba(21, 136, 199, 0.12))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '2px',
                        flexShrink: 0
                      }}>
                        <Check size={11} color="var(--primary)" />
                      </div>
                      <span style={{ fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.45 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={isCurrent}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: isCurrent 
                    ? 'var(--bg-subtle, #f1f5f9)' 
                    : 'var(--primary, #1588C7)',
                  color: isCurrent ? 'var(--text-muted)' : '#FFFFFF',
                  border: isCurrent ? '1px solid var(--border-medium)' : 'none',
                  fontSize: '13.5px',
                  fontWeight: '800',
                  cursor: isCurrent ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: isCurrent ? 'none' : '0 4px 14px rgba(21, 136, 199, 0.3)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>
                  {isCurrent 
                    ? (lang === 'ar' ? 'باقتك الحالية النشطة' : 'Current Active Plan')
                    : (lang === 'ar' ? `الترقية إلى ${plan.nameAr}` : `Upgrade to ${plan.nameEn}`)}
                </span>
                {!isCurrent && <ActionArrow size={14} />}
              </button>
            </div>
          );
        })}
      </div>

      {/* ══════════════════ INVOICES & BILLING HISTORY ══════════════════ */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)',
        border: '1px solid var(--border-medium)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px'
        }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 2px' }}>
              {lang === 'ar' ? 'سجل فواتير واشتراكات السنتر' : 'Billing & Invoice History'}
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
              {lang === 'ar' ? 'جميع عمليات الدفع وتجديد الباقات موثقة بإيصالات رسمية' : 'All transactions and subscription receipts'}
            </p>
          </div>

          <div style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontWeight: '600'
          }}>
            {lang === 'ar' ? `${invoices.length} فواتير مسجلة` : `${invoices.length} Invoices`}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '10px 12px' }}>{lang === 'ar' ? 'رقم الفاتورة' : 'Invoice ID'}</th>
                <th style={{ padding: '10px 12px' }}>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                <th style={{ padding: '10px 12px' }}>{lang === 'ar' ? 'البيان' : 'Description'}</th>
                <th style={{ padding: '10px 12px' }}>{lang === 'ar' ? 'القيمة' : 'Amount'}</th>
                <th style={{ padding: '10px 12px' }}>{lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</th>
                <th style={{ padding: '10px 12px' }}>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>{inv.id}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{inv.date}</td>
                  <td style={{ padding: '12px', color: 'var(--text-primary)' }}>{lang === 'ar' ? inv.descriptionAr : inv.descriptionEn}</td>
                  <td style={{ padding: '12px', fontWeight: '800', color: 'var(--primary)' }}>{lang === 'ar' ? inv.amount : inv.amountEn}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{lang === 'ar' ? inv.methodAr : inv.methodEn}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(22, 163, 74, 0.12)',
                      color: 'var(--color-success, #16A34A)',
                      fontWeight: '700',
                      fontSize: '11px'
                    }}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CenterBillingView;

