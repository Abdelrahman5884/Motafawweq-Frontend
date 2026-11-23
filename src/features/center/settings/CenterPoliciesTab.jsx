import React, { useState } from 'react';
import { Building2, CheckCircle2, CreditCard, Save, Scale } from 'lucide-react';
import { PAYMENT_METHOD_LABELS, REFUND_POLICIES, errorText } from './centerSettingsUtils';

export const CenterPoliciesTab = ({
  lang,
  centerSettings,
  updateCenterSettings,
  showToast,
}) => {
  const isAr = lang === 'ar';
  const initialSettings = centerSettings || {};

  const [centerNameAr, setCenterNameAr] = useState(
    () => initialSettings.nameAr || initialSettings.centerNameAr || ''
  );
  const [centerNameEn, setCenterNameEn] = useState(
    () => initialSettings.nameEn || initialSettings.centerNameEn || ''
  );
  const [centerPhone, setCenterPhone] = useState(
    () => initialSettings.phone || initialSettings.centerPhone || ''
  );
  const [centerAddress, setCenterAddress] = useState(
    () => initialSettings.addressAr || initialSettings.centerAddress || ''
  );
  const [workingHours, setWorkingHours] = useState(
    () => initialSettings.workingHoursAr || initialSettings.workingHours || '08:00 ص - 10:00 م'
  );
  const [lateMarginMinutes, setLateMarginMinutes] = useState(
    () => Number(initialSettings.lateMarginMinutes ?? 15)
  );
  const [siblingDiscountPercent, setSiblingDiscountPercent] = useState(
    () => Number(initialSettings.siblingDiscountPercent ?? 15)
  );
  const [defaultSettlementPct, setDefaultSettlementPct] = useState(() => {
    const rate = Number(initialSettings.defaultTeacherSettlementRate ?? 0.75);
    return Math.round(rate <= 1 ? rate * 100 : rate);
  });
  const [mandatoryCashClose, setMandatoryCashClose] = useState(
    () => Boolean(initialSettings.mandatoryCashClose ?? true)
  );
  const [refundPolicy, setRefundPolicy] = useState(
    () => initialSettings.refundPolicy || 'strict'
  );
  const [paymentMethods, setPaymentMethods] = useState(() => ({
    cash: true,
    vodafoneCash: true,
    instaPay: true,
    visa: true,
    ...(initialSettings.paymentMethods || {}),
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
      const msg = isAr
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
      const normalizedRate = Math.min(
        0.95,
        Math.max(0.05, Number(defaultSettlementPct || 75) / 100)
      );

      await updateCenterSettings({
        name_ar: trimmedNameAr,
        name_en: (centerNameEn || trimmedNameAr).trim(),
        phone: centerPhone.trim() || null,
        address_ar: centerAddress.trim() || null,
        working_hours: workingHours.trim() || null,
        late_margin_minutes: Math.min(60, Math.max(5, Number(lateMarginMinutes) || 15)),
        sibling_discount_percent: Math.min(
          50,
          Math.max(0, Number(siblingDiscountPercent) || 0)
        ),
        default_teacher_settlement_rate: Number(normalizedRate.toFixed(2)),
        mandatory_cash_close: Boolean(mandatoryCashClose),
        refund_policy: refundPolicy,
        payment_methods: paymentMethods,
      });

      setSavedSuccess(true);
      if (showToast) {
        showToast(
          isAr
            ? 'تم حفظ هوية السنتر والسياسات التشغيلية بنجاح.'
            : 'Center policies saved successfully.',
          'success'
        );
      }
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      const msg = errorText(
        err,
        isAr ? 'تعذر حفظ إعدادات السنتر.' : 'Failed to save center settings.'
      );
      setErrorMessage(msg);
      if (showToast) showToast(msg, 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSavePolicies}>
      {/* 1. Official Identity */}
      <div className="cs-card">
        <div className="cs-card-header">
          <div>
            <h3 className="cs-card-title">
              <Building2 size={18} />
              <span>{isAr ? 'الهوية والبيانات الرسمية' : 'Center Official Identity'}</span>
            </h3>
            <p className="cs-card-subtitle">
              {isAr
                ? 'يظهر هذا الاسم في الهيدر، الفواتير، وبطاقات الطلاب المطبوعة.'
                : 'Appears across the header, invoices, and printed student ID cards.'}
            </p>
          </div>
        </div>

        <div className="cs-grid">
          <div className="cs-field">
            <label className="cs-label">
              {isAr ? 'اسم السنتر (بالعربية) *' : 'Center Name (Arabic) *'}
            </label>
            <input
              type="text"
              required
              minLength={2}
              maxLength={180}
              className="cs-input"
              value={centerNameAr}
              onChange={(e) => setCenterNameAr(e.target.value)}
              placeholder={isAr ? 'مثال: سنتر متفوق التعليمي' : 'Center Arabic Name'}
            />
          </div>

          <div className="cs-field">
            <label className="cs-label">
              {isAr ? 'اسم السنتر (بالإنجليزية)' : 'Center Name (English)'}
            </label>
            <input
              type="text"
              maxLength={180}
              className="cs-input"
              value={centerNameEn}
              onChange={(e) => setCenterNameEn(e.target.value)}
              placeholder="e.g. Motafawweq Educational Center"
              dir="ltr"
            />
          </div>

          <div className="cs-field">
            <label className="cs-label">
              {isAr ? 'الخط الساخن / هاتف الإدارة' : 'Center Hotline / Phone'}
            </label>
            <input
              type="text"
              maxLength={40}
              className="cs-input"
              value={centerPhone}
              onChange={(e) => setCenterPhone(e.target.value)}
              placeholder="01000000000"
              dir="ltr"
            />
          </div>

          <div className="cs-field">
            <label className="cs-label">
              {isAr ? 'مواعيد العمل الرسمية' : 'Working Hours'}
            </label>
            <input
              type="text"
              maxLength={120}
              className="cs-input"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              placeholder={isAr ? '08:00 ص - 10:00 م' : '08:00 AM - 10:00 PM'}
            />
          </div>

          <div className="cs-field span-all">
            <label className="cs-label">
              {isAr ? 'العنوان الرئيسي للسنتر' : 'Headquarters Address'}
            </label>
            <input
              type="text"
              maxLength={255}
              className="cs-input"
              value={centerAddress}
              onChange={(e) => setCenterAddress(e.target.value)}
              placeholder={isAr ? 'المدينة، الحي، الشارع الرئيسي...' : 'Main street, City'}
            />
          </div>
        </div>
      </div>

      {/* 2. Approved Payment Methods */}
      <div className="cs-card">
        <div className="cs-card-header">
          <div>
            <h3 className="cs-card-title">
              <CreditCard size={18} />
              <span>{isAr ? 'وسائل الدفع المعتمدة بالخزينة' : 'Approved Payment Methods'}</span>
            </h3>
            <p className="cs-card-subtitle">
              {isAr
                ? 'حدد الوسائل المتاحة للطلاب وأولياء الأمور عند سداد الاشتراكات.'
                : 'Select allowed payment channels for student dues.'}
            </p>
          </div>
        </div>

        <div className="cs-payment-grid">
          {PAYMENT_METHOD_LABELS.map((pm) => {
            const isChecked = Boolean(paymentMethods[pm.key]);
            return (
              <label
                key={pm.key}
                className={`cs-payment-chip ${isChecked ? 'checked' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleTogglePaymentMethod(pm.key)}
                />
                <span>{isAr ? pm.labelAr : pm.labelEn}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Operational & Financial Rules */}
      <div className="cs-card">
        <div className="cs-card-header">
          <div>
            <h3 className="cs-card-title">
              <Scale size={18} />
              <span>{isAr ? 'السياسات التشغيلية والمالية' : 'Operational & Financial Rules'}</span>
            </h3>
          </div>
        </div>

        <div className="cs-grid-3">
          <div className="cs-field">
            <label className="cs-label">
              {isAr ? 'مهلة السماح بالتأخير (دقائق)' : 'Late Arrival Grace (Mins)'}
            </label>
            <input
              type="number"
              min="5"
              max="60"
              className="cs-input"
              value={lateMarginMinutes}
              onChange={(e) => setLateMarginMinutes(Number(e.target.value))}
            />
          </div>

          <div className="cs-field">
            <label className="cs-label">
              {isAr ? 'نسبة خصم الأشقاء (%)' : 'Sibling Discount (%)'}
            </label>
            <input
              type="number"
              min="0"
              max="50"
              className="cs-input"
              value={siblingDiscountPercent}
              onChange={(e) => setSiblingDiscountPercent(Number(e.target.value))}
            />
          </div>

          <div className="cs-field">
            <label className="cs-label">
              {isAr ? 'نسبة تسوية المعلم الافتراضية (%)' : 'Teacher Settlement (%)'}
            </label>
            <input
              type="number"
              min="5"
              max="95"
              className="cs-input"
              value={defaultSettlementPct}
              onChange={(e) => setDefaultSettlementPct(Number(e.target.value))}
            />
          </div>

          <div className="cs-field span-all">
            <label className="cs-label">
              {isAr ? 'سياسة استرداد المصروفات' : 'Refund Policy'}
            </label>
            <select
              className="cs-select"
              value={refundPolicy}
              onChange={(e) => setRefundPolicy(e.target.value)}
            >
              {REFUND_POLICIES.map((pol) => (
                <option key={pol.value} value={pol.value}>
                  {isAr ? pol.labelAr : pol.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div className="cs-field span-all">
            <label className="cs-checkbox-row">
              <input
                type="checkbox"
                checked={mandatoryCashClose}
                onChange={(e) => setMandatoryCashClose(e.target.checked)}
              />
              <span>
                {isAr
                  ? 'إلزام مسؤولي الخزينة بمطابقة وإغلاق الشيفت المالي يومياً قبل الانصراف'
                  : 'Require mandatory daily cash drawer reconciliation before shift close'}
              </span>
            </label>
          </div>
        </div>

        {errorMessage && (
          <div className="cs-alert cs-alert-danger">{errorMessage}</div>
        )}

        {savedSuccess && (
          <div className="cs-alert cs-alert-success">
            <CheckCircle2 size={16} />
            <span>
              {isAr
                ? 'تم حفظ واعتماد هوية السنتر والسياسات بنجاح.'
                : 'Policies updated successfully.'}
            </span>
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={isSaving}
            className="cs-btn cs-btn-primary"
          >
            <Save size={15} />
            <span>
              {isSaving
                ? isAr
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : isAr
                  ? 'حفظ السياسات المحدثة'
                  : 'Save Policies'}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};
