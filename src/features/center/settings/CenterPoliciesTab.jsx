import React, { useState } from 'react';
import { Building2, CheckCircle2, CreditCard, Save, ShieldCheck } from 'lucide-react';
import { PAYMENT_METHOD_LABELS, REFUND_POLICIES } from './centerSettingsUtils';

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-subtle)',
  backgroundColor: 'var(--bg-app)',
  color: 'var(--text-primary)',
  fontSize: '13px',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '700',
  marginBottom: '6px',
  color: 'var(--text-primary)',
};

export const CenterPoliciesTab = ({
  lang,
  centerSettings,
  updateCenterSettings,
  showToast,
}) => {
  const [centerNameAr, setCenterNameAr] = useState(
    () => centerSettings?.nameAr || centerSettings?.centerNameAr || ''
  );
  const [centerNameEn, setCenterNameEn] = useState(
    () => centerSettings?.nameEn || centerSettings?.centerNameEn || ''
  );
  const [centerPhone, setCenterPhone] = useState(
    () => centerSettings?.phone || centerSettings?.centerPhone || ''
  );
  const [centerAddress, setCenterAddress] = useState(
    () => centerSettings?.addressAr || centerSettings?.centerAddress || ''
  );
  const [workingHours, setWorkingHours] = useState(
    () => centerSettings?.workingHoursAr || centerSettings?.workingHours || '08:00 ص - 10:00 م'
  );
  const [customDomain, setCustomDomain] = useState(
    () => centerSettings?.customDomain || ''
  );
  const [lateMarginMinutes, setLateMarginMinutes] = useState(
    () => Number(centerSettings?.lateMarginMinutes ?? 15)
  );
  const [siblingDiscountPercent, setSiblingDiscountPercent] = useState(
    () => Number(centerSettings?.siblingDiscountPercent ?? 15)
  );
  const [defaultSettlementPct, setDefaultSettlementPct] = useState(() => {
    const rate = Number(centerSettings?.defaultTeacherSettlementRate ?? 0.75);
    return Math.round((rate <= 1 ? rate * 100 : rate));
  });
  const [mandatoryCashClose, setMandatoryCashClose] = useState(
    () => Boolean(centerSettings?.mandatoryCashClose ?? true)
  );
  const [refundPolicy, setRefundPolicy] = useState(
    () => centerSettings?.refundPolicy || 'strict'
  );
  const [paymentMethods, setPaymentMethods] = useState(() => ({
    cash: true,
    vodafoneCash: true,
    instaPay: true,
    visa: true,
    ...(centerSettings?.paymentMethods || {}),
  }));

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleTogglePaymentMethod = (key) => {
    setPaymentMethods((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePolicies = async (e) => {
    e.preventDefault();
    const trimmedNameAr = centerNameAr.trim();
    if (trimmedNameAr.length < 2) {
      const msg =
        lang === 'ar'
          ? 'يرجى إدخال اسم السنتر الرسمي (حرفين على الأقل).'
          : 'Please enter a valid center name (at least 2 characters).';
      setErrorMessage(msg);
      if (showToast) showToast(msg, 'warning');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSavedSuccess(false);

    try {
      const normalizedRate = Math.min(0.95, Math.max(0.05, Number(defaultSettlementPct || 75) / 100));
      await updateCenterSettings({
        name_ar: trimmedNameAr,
        name_en: (centerNameEn || trimmedNameAr).trim(),
        phone: centerPhone.trim() || null,
        address_ar: centerAddress.trim() || null,
        working_hours: workingHours.trim() || null,
        custom_domain: customDomain.trim() || null,
        late_margin_minutes: Math.min(60, Math.max(5, Number(lateMarginMinutes) || 15)),
        sibling_discount_percent: Math.min(50, Math.max(0, Number(siblingDiscountPercent) || 0)),
        default_teacher_settlement_rate: Number(normalizedRate.toFixed(2)),
        mandatory_cash_close: Boolean(mandatoryCashClose),
        refund_policy: refundPolicy,
        payment_methods: paymentMethods,
      });

      setSavedSuccess(true);
      if (showToast) {
        showToast(
          lang === 'ar'
            ? 'تم حفظ هوية السنتر والسياسات التشغيلية بنجاح.'
            : 'Center identity and operational policies saved successfully.',
          'success'
        );
      }
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      const msg =
        firstErr ||
        err?.message ||
        (lang === 'ar'
          ? 'تعذر حفظ إعدادات السنتر، يرجى مراجعة البيانات المدخلة.'
          : 'Failed to save center settings.');
      setErrorMessage(msg);
      if (showToast) showToast(msg, 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '17px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: '0 0 4px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Building2 size={18} style={{ color: 'var(--primary)' }} />
            <span>
              {lang === 'ar'
                ? 'الهوية الرسمية والسياسات التشغيلية والمالية'
                : 'Official Identity & Operational Policies'}
            </span>
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
            {lang === 'ar'
              ? 'يظهر اسم السنتر المعتمد هنا في الهيدر، بطاقات الطلاب المطبوعة، والفواتير الرسمية.'
              : 'The center name configured here appears across the header, student passes, and receipts.'}
          </p>
        </div>

        {centerSettings?.planNameAr && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary-subtle)',
              color: 'var(--primary)',
              fontSize: '12px',
              fontWeight: '800',
            }}
          >
            <ShieldCheck size={14} />
            <span>
              {lang === 'ar' ? centerSettings.planNameAr : centerSettings.planNameEn || centerSettings.planTier}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSavePolicies} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <label style={labelStyle}>
              {lang === 'ar' ? 'اسم السنتر التعليمي (بالعربية) *' : 'Center Official Name (Arabic) *'}
            </label>
            <input
              type="text"
              required
              minLength={2}
              maxLength={180}
              value={centerNameAr}
              onChange={(e) => setCenterNameAr(e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: سنتر متفوق التعليمي' : 'Center Arabic Name'}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              {lang === 'ar' ? 'اسم السنتر (بالإنجليزية)' : 'Center Name (English)'}
            </label>
            <input
              type="text"
              maxLength={180}
              value={centerNameEn}
              onChange={(e) => setCenterNameEn(e.target.value)}
              placeholder="e.g. Motafawweq Academic Center"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              {lang === 'ar' ? 'الخط الساخن / هاتف الإدارة' : 'Hotline / Administration Phone'}
            </label>
            <input
              type="text"
              maxLength={40}
              value={centerPhone}
              onChange={(e) => setCenterPhone(e.target.value)}
              placeholder="01000000000"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              {lang === 'ar' ? 'مواعيد العمل الرسمية' : 'Official Working Hours'}
            </label>
            <input
              type="text"
              maxLength={120}
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              placeholder={lang === 'ar' ? '08:00 ص - 10:00 م' : '08:00 AM - 10:00 PM'}
              style={inputStyle}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>
              {lang === 'ar' ? 'العنوان الرئيسي للمؤسسة' : 'Headquarters Address'}
            </label>
            <input
              type="text"
              maxLength={255}
              value={centerAddress}
              onChange={(e) => setCenterAddress(e.target.value)}
              placeholder={lang === 'ar' ? 'المدينة، الحي، الشارع الرئيسي...' : 'Main street, District, City'}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              {lang === 'ar'
                ? 'النطاق المخصص لبوابة السنتر (Custom Domain)'
                : 'Custom Portal Domain'}
            </label>
            <input
              type="text"
              maxLength={180}
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="e.g. portal.mycenter.edu.eg"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Approved Payment Methods */}
        <div
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CreditCard size={16} style={{ color: 'var(--primary)' }} />
            <span>
              {lang === 'ar'
                ? 'وسائل الدفع المعتمدة في شبابيك التحصيل'
                : 'Approved Payment Methods'}
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {PAYMENT_METHOD_LABELS.map((pm) => (
              <label
                key={pm.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                }}
              >
                <input
                  type="checkbox"
                  checked={Boolean(paymentMethods[pm.key])}
                  onChange={() => handleTogglePaymentMethod(pm.key)}
                  style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                />
                <span>{lang === 'ar' ? pm.labelAr : pm.labelEn}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Operational & Financial Rules */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <label style={labelStyle}>
              {lang === 'ar'
                ? 'مهلة السماح بالتأخير قبل تسجيل (متأخر) بالدقائق'
                : 'Late Arrival Grace Period (Minutes)'}
            </label>
            <input
              type="number"
              min="5"
              max="60"
              value={lateMarginMinutes}
              onChange={(e) => setLateMarginMinutes(Number(e.target.value))}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              {lang === 'ar' ? 'نسبة خصم الأشقاء الافتراضية (%)' : 'Default Sibling Discount (%)'}
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={siblingDiscountPercent}
              onChange={(e) => setSiblingDiscountPercent(Number(e.target.value))}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              {lang === 'ar' ? 'نسبة تسوية المعلم الافتراضية (%)' : 'Default Teacher Settlement (%)'}
            </label>
            <input
              type="number"
              min="5"
              max="95"
              value={defaultSettlementPct}
              onChange={(e) => setDefaultSettlementPct(Number(e.target.value))}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              {lang === 'ar' ? 'سياسة استرداد المصروفات' : 'Fee Refund Policy'}
            </label>
            <select
              value={refundPolicy}
              onChange={(e) => setRefundPolicy(e.target.value)}
              style={inputStyle}
            >
              {REFUND_POLICIES.map((pol) => (
                <option key={pol.value} value={pol.value}>
                  {lang === 'ar' ? pol.labelAr : pol.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            <input
              type="checkbox"
              checked={mandatoryCashClose}
              onChange={(e) => setMandatoryCashClose(e.target.checked)}
              style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
            />
            <span>
              {lang === 'ar'
                ? 'إلزام مسؤولي الخزينة بإغلاق ومطابقة الشيفت المالي يومياً قبل الخروج'
                : 'Require mandatory daily cash drawer reconciliation before shift close'}
            </span>
          </label>
        </div>

        {errorMessage && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
              color: 'var(--color-danger, #DC2626)',
              fontSize: '13px',
              fontWeight: '700',
            }}
          >
            {errorMessage}
          </div>
        )}

        {savedSuccess && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(22, 163, 74, 0.1)',
              border: '1px solid rgba(22, 163, 74, 0.25)',
              color: 'var(--success)',
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} />
            <span>
              {lang === 'ar'
                ? 'تم حفظ وتحديث هوية السنتر والسياسات التشغيلية بنجاح.'
                : 'Center identity and policies updated successfully.'}
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          style={{
            alignSelf: 'flex-start',
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: '700',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving ? 0.75 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Save size={15} />
          <span>
            {isSaving
              ? lang === 'ar'
                ? 'جاري الحفظ...'
                : 'Saving...'
              : lang === 'ar'
                ? 'حفظ واعتماد السياسات'
                : 'Save Policies'}
          </span>
        </button>
      </form>
    </div>
  );
};
