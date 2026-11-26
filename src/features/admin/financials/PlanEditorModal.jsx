import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Building2,
  GraduationCap,
  Users,
  Percent,
  Gift,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Tag,
  Clock,
  Wand2,
  CheckCircle2,
  Layers,
} from 'lucide-react';

function toDatetimeLocalValue(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function addDaysToDatetimeLocal(days) {
  const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T23:59`;
}

function calcPercent(orig, sale) {
  const o = Number(orig);
  const s = Number(sale);
  if (!Number.isFinite(o) || o <= 0 || !Number.isFinite(s) || s >= o || s < 0) return '';
  return String(Math.round(((o - s) / o) * 1000) / 10);
}

function calcSaleFromPercent(orig, pct) {
  const o = Number(orig);
  const p = Number(pct);
  if (!Number.isFinite(o) || o <= 0 || !Number.isFinite(p) || p < 0 || p >= 100) return '';
  return String(Math.max(0, Math.round(o * (1 - p / 100))));
}

const SwitchToggle = ({ checked, onChange, accent = 'var(--primary)', label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      border: 'none',
      background: 'transparent',
      padding: 0,
      cursor: 'pointer',
      color: 'var(--text-primary)',
      fontFamily: 'inherit',
    }}
  >
    <span
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '999px',
        backgroundColor: checked ? accent : 'var(--border-medium, #CBD5E1)',
        position: 'relative',
        transition: 'background-color 0.2s ease',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '3px',
          left: checked ? '23px' : '3px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </span>
    {label && <span style={{ fontSize: '13px', fontWeight: '800' }}>{label}</span>}
  </button>
);

export const PlanEditorModal = ({
  plan = null,
  defaultRole = 'student',
  lang = 'ar',
  submitting = false,
  onClose,
  onSave,
}) => {
  const isAr = lang === 'ar';
  const cur = isAr ? 'ج.م' : 'EGP';

  const initialMonthly = plan ? Number(plan.priceEgp ?? 0) : 100;
  const initialOrigMonthly =
    plan?.originalPriceEgp !== null && plan?.originalPriceEgp !== undefined && Number(plan.originalPriceEgp) > initialMonthly
      ? Number(plan.originalPriceEgp)
      : '';
  const initialTerm =
    plan?.termPriceEgp !== null && plan?.termPriceEgp !== undefined ? Number(plan.termPriceEgp) : initialMonthly * 4;
  const initialOrigTerm =
    plan?.originalTermPriceEgp !== null && plan?.originalTermPriceEgp !== undefined && Number(plan.originalTermPriceEgp) > initialTerm
      ? Number(plan.originalTermPriceEgp)
      : '';
  const initialAnnual = plan ? Number(plan.annualPriceEgp ?? 0) : initialMonthly * 8;
  const initialOrigAnnual =
    plan?.originalAnnualPriceEgp !== null && plan?.originalAnnualPriceEgp !== undefined && Number(plan.originalAnnualPriceEgp) > initialAnnual
      ? Number(plan.originalAnnualPriceEgp)
      : '';

  const hasInitialDiscount = Boolean(initialOrigMonthly || initialOrigTerm || initialOrigAnnual);

  const [nameAr, setNameAr] = useState(plan?.nameAr || '');
  const [nameEn, setNameEn] = useState(plan?.nameEn || '');
  const [targetRole, setTargetRole] = useState(plan?.targetRole || defaultRole || 'student');
  const [tierKey, setTierKey] = useState(plan?.tierKey || 'custom');
  const [badgeAr, setBadgeAr] = useState(plan?.badgeAr || '');
  const badgeEn = plan?.badgeEn || '';
  const [isPopular, setIsPopular] = useState(Boolean(plan?.isPopular));
  const [isActive, setIsActive] = useState(plan ? plan.isActive !== false : true);
  const [commissionPercent, setCommissionPercent] = useState(
    plan?.commissionPercent !== null && plan?.commissionPercent !== undefined ? String(plan.commissionPercent) : '10'
  );

  // Regular / sale prices
  const [priceEgp, setPriceEgp] = useState(String(initialMonthly));
  const [termPriceEgp, setTermPriceEgp] = useState(String(initialTerm));
  const [annualPriceEgp, setAnnualPriceEgp] = useState(String(initialAnnual));

  // Discount offer state (compare-at strikethrough prices + live bidirectional discount %)
  const [discountEnabled, setDiscountEnabled] = useState(hasInitialDiscount);
  const [originalPriceEgp, setOriginalPriceEgp] = useState(initialOrigMonthly ? String(initialOrigMonthly) : '');
  const [monthlyDiscountPct, setMonthlyDiscountPct] = useState(
    initialOrigMonthly ? calcPercent(initialOrigMonthly, initialMonthly) : ''
  );
  const [originalTermPriceEgp, setOriginalTermPriceEgp] = useState(initialOrigTerm ? String(initialOrigTerm) : '');
  const [termDiscountPct, setTermDiscountPct] = useState(
    initialOrigTerm ? calcPercent(initialOrigTerm, initialTerm) : ''
  );
  const [originalAnnualPriceEgp, setOriginalAnnualPriceEgp] = useState(initialOrigAnnual ? String(initialOrigAnnual) : '');
  const [annualDiscountPct, setAnnualDiscountPct] = useState(
    initialOrigAnnual ? calcPercent(initialOrigAnnual, initialAnnual) : ''
  );

  // Temporary free promotion state
  const [freePromoEnabled, setFreePromoEnabled] = useState(Boolean(plan?.freePromoEnabled));
  const [freePromoUntil, setFreePromoUntil] = useState(toDatetimeLocalValue(plan?.freePromoUntil));
  const [freePromoLabelAr, setFreePromoLabelAr] = useState(
    plan?.freePromoLabelAr || 'مجانية لفترة محدودة'
  );

  // Interactive feature items
  const [featuresAr, setFeaturesAr] = useState(() =>
    Array.isArray(plan?.featuresAr) && plan.featuresAr.length > 0
      ? [...plan.featuresAr]
      : ['وصول كامل لمزايا الباقة على منصة متفوّق', 'دعم فني ومتابعة مستمرة']
  );
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [previewCycle, setPreviewCycle] = useState('monthly');

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !submitting) onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [submitting, onClose]);

  // Toggle Discount Offer ON/OFF cleanly
  const handleToggleDiscountOffer = (nextEnabled) => {
    setDiscountEnabled(nextEnabled);
    if (nextEnabled) {
      const mSale = Number(priceEgp) || 0;
      if (!originalPriceEgp && mSale > 0) {
        const suggestedOrig = Math.round(mSale * 1.25);
        setOriginalPriceEgp(String(suggestedOrig));
        setMonthlyDiscountPct(calcPercent(suggestedOrig, mSale));
      }
      const tSale = Number(termPriceEgp) || 0;
      if (!originalTermPriceEgp && tSale > 0) {
        const suggestedTermOrig = Math.round(tSale * 1.25);
        setOriginalTermPriceEgp(String(suggestedTermOrig));
        setTermDiscountPct(calcPercent(suggestedTermOrig, tSale));
      }
      const aSale = Number(annualPriceEgp) || 0;
      if (!originalAnnualPriceEgp && aSale > 0) {
        const suggestedAnnualOrig = Math.round(aSale * 1.3);
        setOriginalAnnualPriceEgp(String(suggestedAnnualOrig));
        setAnnualDiscountPct(calcPercent(suggestedAnnualOrig, aSale));
      }
    }
  };

  // Bidirectional calculator handlers (Original <-> Sale <-> Discount %)
  const makeCycleHandlers = (origVal, setOrig, saleVal, setSale, pctVal, setPct) => ({
    onOriginalChange: (raw) => {
      setOrig(raw);
      const o = Number(raw);
      const s = Number(saleVal);
      if (raw !== '' && Number.isFinite(o) && o > 0) {
        if (pctVal !== '' && Number(pctVal) > 0 && Number(pctVal) < 100 && (!Number.isFinite(s) || s === 0)) {
          setSale(calcSaleFromPercent(o, pctVal));
        } else if (Number.isFinite(s) && s >= 0 && s < o) {
          setPct(calcPercent(o, s));
        } else {
          setPct('');
        }
      } else {
        setPct('');
      }
    },
    onSaleChange: (raw) => {
      setSale(raw);
      setPct(calcPercent(origVal, raw));
    },
    onPercentChange: (raw) => {
      setPct(raw);
      const p = Number(raw);
      const o = Number(origVal);
      if (raw !== '' && Number.isFinite(p) && p >= 0 && p < 100 && Number.isFinite(o) && o > 0) {
        setSale(calcSaleFromPercent(o, p));
      }
    },
  });

  const monthlyHandlers = makeCycleHandlers(
    originalPriceEgp,
    setOriginalPriceEgp,
    priceEgp,
    setPriceEgp,
    monthlyDiscountPct,
    setMonthlyDiscountPct
  );
  const termHandlers = makeCycleHandlers(
    originalTermPriceEgp,
    setOriginalTermPriceEgp,
    termPriceEgp,
    setTermPriceEgp,
    termDiscountPct,
    setTermDiscountPct
  );
  const annualHandlers = makeCycleHandlers(
    originalAnnualPriceEgp,
    setOriginalAnnualPriceEgp,
    annualPriceEgp,
    setAnnualPriceEgp,
    annualDiscountPct,
    setAnnualDiscountPct
  );

  const handleAutoCalcCycles = () => {
    const mSale = Number(priceEgp) || 0;
    const mOrig = discountEnabled && Number(originalPriceEgp) > mSale ? Number(originalPriceEgp) : mSale;

    const nextTermSale = Math.round(mSale * 4);
    const nextAnnualSale = Math.round(mSale * 7);
    setTermPriceEgp(String(nextTermSale));
    setAnnualPriceEgp(String(nextAnnualSale));

    if (discountEnabled && mOrig > 0) {
      const nextTermOrig = Math.round(mOrig * 5);
      const nextAnnualOrig = Math.round(mOrig * 10);
      setOriginalTermPriceEgp(String(nextTermOrig));
      setTermDiscountPct(calcPercent(nextTermOrig, nextTermSale));
      setOriginalAnnualPriceEgp(String(nextAnnualOrig));
      setAnnualDiscountPct(calcPercent(nextAnnualOrig, nextAnnualSale));
    }
  };

  const handleAddFeature = () => {
    const clean = newFeatureInput.trim();
    if (!clean) return;
    setFeaturesAr((prev) => [...prev, clean]);
    setNewFeatureInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nameAr.trim()) return;

    const mSale = Math.max(0, Number(priceEgp) || 0);
    const tSale = Math.max(0, Number(termPriceEgp) || 0);
    const aSale = Math.max(0, Number(annualPriceEgp) || 0);

    const mOrig = discountEnabled && Number(originalPriceEgp) > mSale ? Number(originalPriceEgp) : null;
    const tOrig = discountEnabled && Number(originalTermPriceEgp) > tSale ? Number(originalTermPriceEgp) : null;
    const aOrig = discountEnabled && Number(originalAnnualPriceEgp) > aSale ? Number(originalAnnualPriceEgp) : null;

    const computedPct = mOrig ? Number(calcPercent(mOrig, mSale)) || null : null;

    const cleanFeatures = featuresAr.map((f) => f.trim()).filter(Boolean);

    const payload = {
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim() || nameAr.trim(),
      targetRole,
      tierKey: tierKey || 'custom',
      billingCycle: 'monthly',
      priceEgp: mSale,
      originalPriceEgp: mOrig,
      termPriceEgp: tSale,
      originalTermPriceEgp: tOrig,
      annualPriceEgp: aSale,
      originalAnnualPriceEgp: aOrig,
      discountPercent: computedPct,
      commissionPercent: targetRole === 'teacher' ? Number(commissionPercent || 0) : null,
      badgeAr: badgeAr.trim() || null,
      badgeEn: badgeEn.trim() || badgeAr.trim() || null,
      isPopular,
      isActive,
      freePromoEnabled,
      freePromoUntil: freePromoEnabled && freePromoUntil ? new Date(freePromoUntil).toISOString() : null,
      freePromoLabelAr: freePromoEnabled ? (freePromoLabelAr.trim() || 'مجانية لفترة محدودة') : null,
      freePromoLabelEn: freePromoEnabled ? 'Free for a Limited Time' : null,
      featuresAr: cleanFeatures.length > 0 ? cleanFeatures : ['اشتراك معتمد في منصة متفوّق'],
      featuresEn:
        Array.isArray(plan?.featuresEn) && plan.featuresEn.length > 0
          ? plan.featuresEn
          : cleanFeatures.length > 0
            ? cleanFeatures
            : ['Verified Motafawweq tier'],
    };

    const ok = await onSave?.(plan?.id || null, payload);
    if (ok !== false) {
      onClose?.();
    }
  };

  // Live preview computed values
  const preview = useMemo(() => {
    const cycleMap = {
      monthly: {
        sale: Number(priceEgp) || 0,
        orig: discountEnabled && Number(originalPriceEgp) > (Number(priceEgp) || 0) ? Number(originalPriceEgp) : null,
        labelAr: 'شهرياً (30 يوماً)',
        labelEn: 'Monthly (30 days)',
      },
      term: {
        sale: Number(termPriceEgp) || 0,
        orig: discountEnabled && Number(originalTermPriceEgp) > (Number(termPriceEgp) || 0) ? Number(originalTermPriceEgp) : null,
        labelAr: 'نصف سنة (5 شهور)',
        labelEn: 'Semester (5 Mo)',
      },
      annual: {
        sale: Number(annualPriceEgp) || 0,
        orig: discountEnabled && Number(originalAnnualPriceEgp) > (Number(annualPriceEgp) || 0) ? Number(originalAnnualPriceEgp) : null,
        labelAr: 'سنة دراسية كاملة',
        labelEn: 'Full Academic Year',
      },
    };
    const active = cycleMap[previewCycle] || cycleMap.monthly;
    if (freePromoEnabled) {
      const struck = active.orig || (active.sale > 0 ? active.sale : null);
      return {
        effectivePrice: 0,
        struckPrice: struck,
        pct: struck ? 100 : null,
        savedEgp: struck || 0,
        periodLabel: isAr ? active.labelAr : active.labelEn,
        isFreePromo: true,
      };
    }
    const pct = active.orig ? Number(calcPercent(active.orig, active.sale)) : null;
    return {
      effectivePrice: active.sale,
      struckPrice: active.orig,
      pct,
      savedEgp: active.orig ? Math.max(0, active.orig - active.sale) : 0,
      periodLabel: isAr ? active.labelAr : active.labelEn,
      isFreePromo: false,
    };
  }, [
    annualPriceEgp,
    discountEnabled,
    freePromoEnabled,
    isAr,
    originalAnnualPriceEgp,
    originalPriceEgp,
    originalTermPriceEgp,
    previewCycle,
    priceEgp,
    termPriceEgp,
  ]);

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '11px',
    border: '1.5px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    fontSize: '13.5px',
    fontWeight: '700',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const renderCycleRow = (titleAr, titleEn, orig, sale, pct, handlers, quickPcts = [15, 25, 30, 50]) => (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
        <span style={{ fontSize: '12.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
          {isAr ? titleAr : titleEn}
        </span>
        {discountEnabled && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
            {quickPcts.map((qp) => (
              <button
                key={qp}
                type="button"
                onClick={() => handlers.onPercentChange(String(qp))}
                style={{
                  padding: '2px 8px',
                  borderRadius: '999px',
                  border: Number(pct) === qp ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: Number(pct) === qp ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                  color: Number(pct) === qp ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                -{qp}%
              </button>
            ))}
          </div>
        )}
      </div>

      {discountEnabled ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '4px' }}>
              {isAr ? 'السعر الأصلي (المشطوب)' : 'Original Price'}
            </label>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="100"
              value={orig}
              onChange={(e) => handlers.onOriginalChange(e.target.value)}
              style={{
                ...inputStyle,
                textDecoration: orig && Number(orig) > Number(sale) ? 'line-through' : 'none',
                color: 'var(--text-secondary)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
              {isAr ? 'السعر بعد الخصم (الفعلي)' : 'Offer Price'}
            </label>
            <input
              type="number"
              min="0"
              step="any"
              required
              value={sale}
              onChange={(e) => handlers.onSaleChange(e.target.value)}
              style={{
                ...inputStyle,
                borderColor: 'rgba(21, 136, 199, 0.45)',
                color: 'var(--primary)',
                fontWeight: '900',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#059669', marginBottom: '4px' }}>
              {isAr ? 'نسبة الخصم (%)' : 'Discount %'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min="0"
                max="99"
                step="0.5"
                placeholder="25"
                value={pct}
                onChange={(e) => handlers.onPercentChange(e.target.value)}
                style={{
                  ...inputStyle,
                  paddingInlineEnd: '28px',
                  borderColor: pct ? 'rgba(5, 150, 105, 0.45)' : 'var(--border-subtle)',
                  color: '#059669',
                  fontWeight: '900',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  insetInlineEnd: '10px',
                  fontSize: '12px',
                  fontWeight: '900',
                  color: '#059669',
                  pointerEvents: 'none',
                }}
              >
                %
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <input
            type="number"
            min="0"
            step="any"
            required
            value={sale}
            onChange={(e) => handlers.onSaleChange(e.target.value)}
            style={inputStyle}
          />
        </div>
      )}
    </div>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => !submitting && onClose?.()}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 37, 78, 0.68)',
        backdropFilter: 'blur(7px)',
        WebkitBackdropFilter: 'blur(7px)',
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
          borderRadius: '26px',
          width: '100%',
          maxWidth: '1040px',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 28px 70px rgba(6, 37, 78, 0.35)',
        }}
      >
        {/* Top Studio Bar */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            background: 'linear-gradient(135deg, rgba(21, 136, 199, 0.07) 0%, var(--bg-surface) 70%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(21, 136, 199, 0.3)',
              }}
            >
              <Layers size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {plan
                  ? isAr
                    ? `تعديل باقة: ${plan.nameAr}`
                    : `Edit Plan: ${plan.nameEn}`
                  : isAr
                    ? 'إنشاء باقة اشتراك جديدة'
                    : 'Create Subscription Plan'}
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {isAr
                  ? 'تحكم كامل بالأسعار والعروض (السعر المشطوب ونسبة الخصم) والمجانية المؤقتة مع معاينة فورية'
                  : 'Configure pricing, strikethrough discounts, temporary free promotions, and features with live preview'}
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable 2-Column Studio Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '22px 24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: '24px',
              alignItems: 'start',
            }}
          >
            {/* ══════ LEFT COLUMN: CLEAN FORM SECTIONS ══════ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', minWidth: 0 }}>
              {/* 1. Identity & Target Role Card */}
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '18px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Tag size={14} color="var(--primary)" />
                  <span>{isAr ? 'بيانات الباقة الأساسية' : 'Plan Identity'}</span>
                </div>

                {/* Role Pill Selector */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'student', labelAr: 'الطلاب', labelEn: 'Student', icon: Users },
                    { id: 'teacher', labelAr: 'المعلمون', labelEn: 'Teacher', icon: GraduationCap },
                    { id: 'center', labelAr: 'السناتر', labelEn: 'Center', icon: Building2 },
                  ].map((r) => {
                    const selected = targetRole === r.id;
                    const RIcon = r.icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setTargetRole(r.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '10px 8px',
                          borderRadius: '12px',
                          border: selected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                          backgroundColor: selected ? 'var(--primary-surface)' : 'var(--bg-surface)',
                          color: selected ? 'var(--primary)' : 'var(--text-secondary)',
                          fontSize: '12.5px',
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      {isAr ? 'اسم الباقة (عربي) *' : 'Name (Arabic) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      placeholder={isAr ? 'باقة الطالب بلس (Plus)' : 'Student Plus'}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      {isAr ? 'اسم الباقة (إنجليزي)' : 'Name (English)'}
                    </label>
                    <input
                      type="text"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      placeholder="Student Plus"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      {isAr ? 'شارة التمييز (Badge)' : 'Badge Label'}
                    </label>
                    <input
                      type="text"
                      value={badgeAr}
                      onChange={(e) => setBadgeAr(e.target.value)}
                      placeholder={isAr ? 'الأكثر طلباً' : 'Most Popular'}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      {isAr ? 'فئة الباقة (Tier)' : 'Tier Key'}
                    </label>
                    <select value={tierKey} onChange={(e) => setTierKey(e.target.value)} style={inputStyle}>
                      <option value="free">Free (مجانية)</option>
                      <option value="plus">Plus (بلس)</option>
                      <option value="pro">Pro (برو)</option>
                      <option value="custom">Custom (إضافية)</option>
                    </select>
                  </div>
                  {targetRole === 'teacher' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        {isAr ? 'عمولة المنصة (%)' : 'Commission %'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        value={commissionPercent}
                        onChange={(e) => setCommissionPercent(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', paddingTop: '4px' }}>
                  <SwitchToggle
                    checked={isActive}
                    onChange={setIsActive}
                    accent="#059669"
                    label={isAr ? 'الباقة ظاهرة ومفعّلة' : 'Active'}
                  />
                  <SwitchToggle
                    checked={isPopular}
                    onChange={setIsPopular}
                    accent="var(--primary)"
                    label={isAr ? 'إبراز كالأكثر طلباً' : 'Highlight Popular'}
                  />
                </div>
              </div>

              {/* 2. Temporary Free Promo Card */}
              <div
                style={{
                  backgroundColor: freePromoEnabled ? 'rgba(5, 150, 105, 0.08)' : 'var(--bg-subtle)',
                  border: freePromoEnabled ? '1.5px solid rgba(5, 150, 105, 0.45)' : '1px solid var(--border-subtle)',
                  borderRadius: '18px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Gift size={17} color="#059669" />
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
                        {isAr ? 'جعل الباقة مجانية لفترة محدودة' : 'Temporary Free Promotion'}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        {isAr
                          ? 'تُفعَّل فوراً مجاناً بدون وصل دفع أو انتظار موافقة حتى ينتهي العرض'
                          : 'Activates instantly at 0 EGP without receipt or approval while active'}
                      </div>
                    </div>
                  </div>
                  <SwitchToggle checked={freePromoEnabled} onChange={setFreePromoEnabled} accent="#059669" />
                </div>

                {freePromoEnabled && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '6px', borderTop: '1px dashed rgba(5, 150, 105, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {isAr ? 'مدة سريعة:' : 'Quick duration:'}
                      </span>
                      {[
                        { days: 3, labelAr: '3 أيام', labelEn: '3 Days' },
                        { days: 7, labelAr: 'أسبوع', labelEn: '7 Days' },
                        { days: 14, labelAr: 'أسبوعين', labelEn: '14 Days' },
                        { days: 30, labelAr: 'شهر كامل', labelEn: '30 Days' },
                      ].map((p) => (
                        <button
                          key={p.days}
                          type="button"
                          onClick={() => setFreePromoUntil(addDaysToDatetimeLocal(p.days))}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '999px',
                            border: '1px solid rgba(5, 150, 105, 0.35)',
                            backgroundColor: 'var(--bg-surface)',
                            color: '#059669',
                            fontSize: '11.5px',
                            fontWeight: '800',
                            cursor: 'pointer',
                          }}
                        >
                          {isAr ? p.labelAr : p.labelEn}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setFreePromoUntil('')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-surface)',
                          color: 'var(--text-secondary)',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        {isAr ? 'حتى أوقفها يدوياً' : 'Until disabled'}
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', color: '#047857', marginBottom: '4px' }}>
                          {isAr ? 'تنتهي المجانية في (اختياري):' : 'Free Promo Ends At (Optional):'}
                        </label>
                        <input
                          type="datetime-local"
                          value={freePromoUntil}
                          onChange={(e) => setFreePromoUntil(e.target.value)}
                          style={{ ...inputStyle, borderColor: 'rgba(5, 150, 105, 0.4)' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '800', color: '#047857', marginBottom: '4px' }}>
                          {isAr ? 'نص شارة العرض المجاني:' : 'Promo Ribbon Label:'}
                        </label>
                        <input
                          type="text"
                          value={freePromoLabelAr}
                          onChange={(e) => setFreePromoLabelAr(e.target.value)}
                          placeholder="مجانية لفترة محدودة"
                          style={{ ...inputStyle, borderColor: 'rgba(5, 150, 105, 0.4)' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Interactive Pricing & Bidirectional Strikethrough Discount Offer */}
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  border: discountEnabled ? '1.5px solid rgba(21, 136, 199, 0.35)' : '1px solid var(--border-subtle)',
                  borderRadius: '18px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  opacity: freePromoEnabled ? 0.8 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Percent size={16} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
                        {isAr ? 'الأسعار وعروض الخصم (السعر المشطوب)' : 'Pricing & Discount Offers'}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        {isAr
                          ? 'أدخل السعرين ليُحسب الخصم تلقائياً، أو أدخل نسبة الخصم ليُحسب السعر فوراً'
                          : 'Enter both prices to auto-compute discount %, or enter discount % to compute offer price'}
                      </div>
                    </div>
                  </div>
                  <SwitchToggle
                    checked={discountEnabled}
                    onChange={handleToggleDiscountOffer}
                    accent="var(--primary)"
                    label={isAr ? 'تفعيل عرض خصم' : 'Discount Offer'}
                  />
                </div>

                {renderCycleRow('الاشتراك الشهري (ج.م)', 'Monthly (EGP)', originalPriceEgp, priceEgp, monthlyDiscountPct, monthlyHandlers)}
                {renderCycleRow('اشتراك الترم — 5 شهور (ج.م)', 'Semester 5-Mo (EGP)', originalTermPriceEgp, termPriceEgp, termDiscountPct, termHandlers)}
                {renderCycleRow('الاشتراك السنوي (ج.م)', 'Annual (EGP)', originalAnnualPriceEgp, annualPriceEgp, annualDiscountPct, annualHandlers)}

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleAutoCalcCycles}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '9px',
                      border: '1px solid rgba(21, 136, 199, 0.3)',
                      backgroundColor: 'var(--primary-surface)',
                      color: 'var(--primary)',
                      fontSize: '11.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    <Wand2 size={13} />
                    <span>{isAr ? 'حساب أسعار الترم والسنوي تلقائياً من الشهري' : 'Auto-fill Term & Annual from Monthly'}</span>
                  </button>
                </div>
              </div>

              {/* 4. Interactive Features Builder */}
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '18px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} color="var(--primary)" />
                  <span>{isAr ? `مزايا الباقة (${featuresAr.length})` : `Plan Features (${featuresAr.length})`}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {featuresAr.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFeaturesAr((prev) => prev.map((item, i) => (i === idx ? val : item)));
                        }}
                        style={{ ...inputStyle, padding: '8px 11px', fontSize: '12.5px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setFeaturesAr((prev) => prev.filter((_, i) => i !== idx))}
                        aria-label={isAr ? 'حذف الميزة' : 'Remove feature'}
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '9px',
                          border: '1px solid rgba(220, 38, 38, 0.25)',
                          backgroundColor: 'rgba(220, 38, 38, 0.06)',
                          color: '#DC2626',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder={isAr ? 'أضف ميزة جديدة واضغط Enter...' : 'Add a feature and press Enter...'}
                    style={{ ...inputStyle, padding: '9px 12px', fontSize: '12.5px' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '0 14px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Plus size={15} />
                    <span>{isAr ? 'إضافة' : 'Add'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ══════ RIGHT COLUMN: LIVE CARD PREVIEW ══════ */}
            <div style={{ position: 'sticky', top: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: '900', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Sparkles size={14} color="var(--primary)" />
                  {isAr ? 'معاينة حية كما يراها المستخدم' : 'Live User Preview'}
                </span>

                <div style={{ display: 'inline-flex', gap: '4px', padding: '3px', borderRadius: '99px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                  {[
                    { id: 'monthly', ar: 'شهري', en: 'Mo' },
                    { id: 'term', ar: 'ترم', en: 'Term' },
                    { id: 'annual', ar: 'سنوي', en: 'Year' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setPreviewCycle(c.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '99px',
                        border: 'none',
                        backgroundColor: previewCycle === c.id ? 'var(--primary)' : 'transparent',
                        color: previewCycle === c.id ? '#FFFFFF' : 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: 'pointer',
                      }}
                    >
                      {isAr ? c.ar : c.en}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: preview.isFreePromo
                    ? '2px solid #059669'
                    : isPopular
                      ? '2px solid var(--primary)'
                      : '1.5px solid var(--border-medium)',
                  borderRadius: '24px',
                  padding: '26px 22px 22px',
                  boxShadow: preview.isFreePromo
                    ? '0 16px 36px rgba(5, 150, 105, 0.16)'
                    : isPopular
                      ? '0 16px 36px rgba(21, 136, 199, 0.18)'
                      : 'var(--shadow-sm)',
                  position: 'relative',
                }}
              >
                {(preview.isFreePromo || badgeAr) && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      backgroundColor: preview.isFreePromo ? '#059669' : isPopular ? 'var(--primary)' : '#06254E',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: '900',
                      marginBottom: '12px',
                    }}
                  >
                    {preview.isFreePromo ? <Gift size={12} /> : <Sparkles size={12} />}
                    <span>{preview.isFreePromo ? (freePromoLabelAr || 'مجانية لفترة محدودة') : badgeAr}</span>
                  </div>
                )}

                <h4 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)' }}>
                  {nameAr.trim() || (isAr ? 'اسم الباقة هنا' : 'Plan Name')}
                </h4>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '16px' }}>
                  {preview.periodLabel}
                </div>

                {/* Live Strikethrough & Offer Price */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '36px',
                        fontWeight: '900',
                        color: preview.isFreePromo ? '#059669' : 'var(--primary)',
                        lineHeight: 1,
                      }}
                    >
                      {preview.effectivePrice === 0 ? (isAr ? 'مجاناً' : 'Free') : preview.effectivePrice.toLocaleString()}
                    </span>
                    {preview.effectivePrice > 0 && (
                      <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-secondary)' }}>{cur}</span>
                    )}
                    {preview.struckPrice !== null && (
                      <span
                        style={{
                          fontSize: '15px',
                          fontWeight: '800',
                          color: 'var(--text-muted)',
                          textDecoration: 'line-through',
                        }}
                      >
                        {preview.struckPrice.toLocaleString()} {cur}
                      </span>
                    )}
                  </div>

                  {preview.pct !== null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                      <span
                        style={{
                          padding: '3px 9px',
                          borderRadius: '999px',
                          backgroundColor: preview.isFreePromo ? 'rgba(5, 150, 105, 0.14)' : 'rgba(239, 68, 68, 0.1)',
                          color: preview.isFreePromo ? '#059669' : '#DC2626',
                          fontSize: '11.5px',
                          fontWeight: '900',
                        }}
                      >
                        {preview.isFreePromo
                          ? isAr
                            ? 'خصم 100% — مجاناً الآن'
                            : '100% OFF — FREE NOW'
                          : isAr
                            ? `خصم ${preview.pct}%`
                            : `${preview.pct}% OFF`}
                      </span>
                      {preview.savedEgp > 0 && !preview.isFreePromo && (
                        <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--primary)' }}>
                          {isAr ? `توفير ${preview.savedEgp.toLocaleString()} ج.م` : `Save ${preview.savedEgp.toLocaleString()} EGP`}
                        </span>
                      )}
                    </div>
                  )}

                  {preview.isFreePromo && freePromoUntil && (
                    <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#047857', marginTop: '6px' }}>
                      {isAr
                        ? `العرض ساري حتى: ${new Date(freePromoUntil).toLocaleDateString('ar-EG', { dateStyle: 'medium' })}`
                        : `Ends: ${new Date(freePromoUntil).toLocaleDateString()}`}
                    </div>
                  )}
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', marginBottom: '14px' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '18px' }}>
                  {featuresAr.filter(Boolean).slice(0, 6).map((f, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: preview.isFreePromo ? 'rgba(5, 150, 105, 0.14)' : 'var(--primary-surface)',
                          color: preview.isFreePromo ? '#059669' : 'var(--primary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '1px',
                        }}
                      >
                        <Check size={11} strokeWidth={3} />
                      </span>
                      <span style={{ fontWeight: '600' }}>{f}</span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '13px',
                    backgroundColor: preview.isFreePromo ? '#059669' : 'var(--primary)',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    fontSize: '12.5px',
                    fontWeight: '900',
                    boxSizing: 'border-box',
                  }}
                >
                  {preview.isFreePromo
                    ? isAr
                      ? 'تفعيل مجاناً الآن — بدون انتظار'
                      : 'Activate Free Instantly'
                    : isAr
                      ? `الاشتراك في ${nameAr.trim() || 'الباقة'}`
                      : `Subscribe`}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Footer Actions */}
          <div
            style={{
              padding: '14px 24px',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
            }}
          >
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '10px 20px',
                borderRadius: '11px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '11px',
                fontSize: '13px',
                fontWeight: '900',
                cursor: submitting ? 'wait' : 'pointer',
                boxShadow: '0 6px 18px rgba(21, 136, 199, 0.3)',
              }}
            >
              {submitting
                ? isAr
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : isAr
                  ? 'حفظ وتطبيق التعديلات فوراً'
                  : 'Save & Publish Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
