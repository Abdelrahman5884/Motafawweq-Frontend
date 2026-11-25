import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { centerApi } from '../../../services/centerApi';
import { useAuth } from '../../../context/AuthContext';
import { useCenter } from '../../../context/CenterContext';
import {
  CENTER_SUBSCRIPTION_CATALOG,
  getCenterPlanQuotas,
} from '../../../constants/centerPlanFeatures';

const EMPTY_USAGE = {
  branchesCount: 0,
  roomsCount: 0,
  groupsCount: 0,
  teachersCount: 0,
  staffCount: 0,
  studentsCount: 0,
  activeUsersCount: 0,
};

export const useCenterBilling = (lang = 'ar') => {
  const isAr = lang === 'ar';
  const { syncUserProfile } = useAuth();
  const { loadCoreCenterData } = useCenter();
  const requestSeqRef = useRef(0);
  const closeTimerRef = useRef(null);

  const [summary, setSummary] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null);

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountEgp, setDiscountEgp] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('instapay');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Cancel-before-switch modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [pendingSwitchTarget, setPendingSwitchTarget] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const syncAuthTierFromActiveSub = useCallback(
    (activeSub) => {
      if (!activeSub?.planTier || !syncUserProfile) return;
      syncUserProfile({
        plan_tier: activeSub.planTier,
        unlocked_features: activeSub.unlockedFeatures || null,
        plan_quotas: activeSub.quotas || getCenterPlanQuotas(activeSub.planTier),
      });
    },
    [syncUserProfile]
  );

  const fetchSummary = useCallback(
    async ({ silent = false } = {}) => {
      const seq = ++requestSeqRef.current;
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const res = await centerApi.billing.getSummary();
        if (seq !== requestSeqRef.current) return null;
        const data = res?.data || {};
        setSummary(data);
        if (data?.activeSub) {
          syncAuthTierFromActiveSub(data.activeSub);
        }
        return data;
      } catch (err) {
        if (seq === requestSeqRef.current) {
          setError(
            err?.message ||
              (isAr
                ? 'تعذر تحميل بيانات باقات واشتراكات السنتر حالياً. يرجى المحاولة مرة أخرى.'
                : 'Failed to load center billing overview. Please try again.')
          );
        }
        return null;
      } finally {
        if (seq === requestSeqRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [isAr, syncAuthTierFromActiveSub]
  );

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        fetchSummary({ silent: false });
      }
    });
    return () => {
      active = false;
    };
  }, [fetchSummary]);

  const activeSub = useMemo(() => summary?.activeSub || null, [summary]);
  const usage = useMemo(() => ({ ...EMPTY_USAGE, ...(summary?.usage || {}) }), [summary]);

  const plans = useMemo(
    () =>
      Array.isArray(summary?.plans) && summary.plans.length > 0
        ? summary.plans
        : CENTER_SUBSCRIPTION_CATALOG,
    [summary]
  );

  const invoices = useMemo(() => {
    const raw = Array.isArray(summary?.invoices) ? summary.invoices : [];
    return raw.map((inv) => {
      const amt = Number(inv.finalAmountEgp ?? inv.amountEgp ?? 0);
      return {
        ...inv,
        id: inv.invoiceNumber || inv.id,
        date: inv.date || (inv.paidAt ? String(inv.paidAt).slice(0, 10) : ''),
        amountEgp: amt,
        amount: inv.amount || `${amt.toLocaleString()} ج.م`,
        amountEn: inv.amountEn || `${amt.toLocaleString()} EGP`,
        methodAr: inv.methodAr || inv.paymentMethod || '',
        methodEn: inv.methodEn || inv.paymentMethod || '',
      };
    });
  }, [summary]);

  const mustCancelToSwitch = useMemo(() => {
    if (!activeSub) return false;
    return Boolean(activeSub.mustCancelToSwitch ?? (!activeSub.isFree && activeSub.planTier !== 'free'));
  }, [activeSub]);

  const resetCheckoutState = useCallback(() => {
    setCouponCode('');
    setCouponApplied(false);
    setDiscountPercent(0);
    setDiscountEgp(0);
    setCouponError('');
    setCheckoutError('');
    setPaymentSuccess(false);
    setSelectedPaymentMethod('instapay');
  }, []);

  const openCheckoutForPlan = useCallback(
    (planWithPricing, periodOverride) => {
      resetCheckoutState();
      setSelectedPlanForCheckout({
        ...planWithPricing,
        billingPeriod: periodOverride || selectedPeriod,
      });
    },
    [resetCheckoutState, selectedPeriod]
  );

  const closeCheckout = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setSelectedPlanForCheckout(null);
    resetCheckoutState();
  }, [resetCheckoutState]);

  const openCancelModal = useCallback((targetPlan = null) => {
    setCancelError('');
    setPendingSwitchTarget(targetPlan);
    setCancelModalOpen(true);
  }, []);

  const closeCancelModal = useCallback(() => {
    if (isCancelling) return;
    setCancelModalOpen(false);
    setPendingSwitchTarget(null);
    setCancelError('');
  }, [isCancelling]);

  const handleSelectPlan = useCallback(
    (planWithPricing) => {
      const tier = planWithPricing?.tier || 'plus';

      if (mustCancelToSwitch) {
        // Strict cancel-before-switch UX
        openCancelModal(tier === 'free' ? null : planWithPricing);
        return;
      }

      if (tier === 'free') {
        setNotice({
          type: 'info',
          text: isAr
            ? 'حساب السنتر مفعّل بالفعل على الباقة المجانية (حتى 20 مستخدم نشط، فرع واحد، قاعة واحدة، معلمان، ومجموعتان).'
            : 'Your center is already on the Free plan (up to 20 active users, 1 branch, 1 room, 2 teachers, and 2 cohorts).',
        });
        return;
      }

      openCheckoutForPlan(planWithPricing, selectedPeriod);
    },
    [isAr, mustCancelToSwitch, openCancelModal, openCheckoutForPlan, selectedPeriod]
  );

  const handleUpgradeFromBanner = useCallback(() => {
    if (mustCancelToSwitch) {
      openCancelModal(null);
      return;
    }
    const targetPlan = plans.find((p) => p.tier === 'plus') || plans[1];
    if (!targetPlan) return;
    const pricing = targetPlan.pricing?.[selectedPeriod] || targetPlan.pricing?.monthly || {};
    openCheckoutForPlan({ ...targetPlan, ...pricing }, selectedPeriod);
  }, [mustCancelToSwitch, openCancelModal, openCheckoutForPlan, plans, selectedPeriod]);

  const handleConfirmCancel = useCallback(async () => {
    if (isCancelling) return;
    setIsCancelling(true);
    setCancelError('');
    setError(null);

    try {
      const res = await centerApi.billing.cancel();
      const targetAfterCancel = pendingSwitchTarget;

      await Promise.all([
        fetchSummary({ silent: true }),
        loadCoreCenterData?.().catch(() => {}),
      ]);

      setCancelModalOpen(false);
      setPendingSwitchTarget(null);

      if (targetAfterCancel && targetAfterCancel.tier && targetAfterCancel.tier !== 'free') {
        setNotice({
          type: 'success',
          text: isAr
            ? `تم إلغاء اشتراكك السابق بنجاح. يمكنك الآن إتمام الاشتراك في «${targetAfterCancel.nameAr}».`
            : `Previous subscription cancelled. Complete checkout for "${targetAfterCancel.nameEn || targetAfterCancel.nameAr}".`,
        });
        openCheckoutForPlan(targetAfterCancel, selectedPeriod);
      } else {
        setNotice({
          type: 'success',
          text:
            res?.message ||
            (isAr
              ? 'تم إلغاء الاشتراك المدفوع والعودة للباقة المجانية بنجاح. يمكنك الآن الاشتراك في أي باقة أخرى.'
              : 'Your active subscription has been cancelled and reverted to Free. You can now switch to any other plan.'),
        });
      }
    } catch (err) {
      setCancelError(
        err?.message ||
          (isAr
            ? 'تعذر إلغاء الاشتراك حالياً. يرجى المحاولة مرة أخرى.'
            : 'Failed to cancel subscription. Please try again.')
      );
    } finally {
      setIsCancelling(false);
    }
  }, [
    fetchSummary,
    isAr,
    isCancelling,
    loadCoreCenterData,
    openCheckoutForPlan,
    pendingSwitchTarget,
    selectedPeriod,
  ]);

  const handleApplyCoupon = useCallback(
    async (e) => {
      e.preventDefault();
      const trimmed = couponCode.trim();
      if (!trimmed || !selectedPlanForCheckout) return;

      setIsApplyingCoupon(true);
      setCouponError('');
      try {
        const res = await centerApi.billing.validateCoupon({
          code: trimmed,
          order_amount: Number(selectedPlanForCheckout.priceEgp || 0),
        });
        if (res?.data?.isValid) {
          setCouponApplied(true);
          setDiscountPercent(Number(res.data.discountPercent || 0));
          setDiscountEgp(Number(res.data.discountAmount ?? res.data.discountEgp ?? 0));
        } else {
          setCouponApplied(false);
          setDiscountPercent(0);
          setDiscountEgp(0);
          setCouponError(
            res?.data?.messageAr || (isAr ? 'كود الخصم غير صحيح.' : 'Invalid coupon code.')
          );
        }
      } catch (err) {
        setCouponApplied(false);
        setDiscountPercent(0);
        setDiscountEgp(0);
        setCouponError(
          err?.message ||
            (isAr ? 'كود الخصم غير صالح أو منتهي الصلاحية.' : 'Invalid or expired coupon code.')
        );
      } finally {
        setIsApplyingCoupon(false);
      }
    },
    [couponCode, isAr, selectedPlanForCheckout]
  );

  const handleClearCoupon = useCallback(() => {
    setCouponCode('');
    setCouponApplied(false);
    setDiscountPercent(0);
    setDiscountEgp(0);
    setCouponError('');
  }, []);

  const handleCompletePayment = useCallback(
    async (paymentDetails = {}) => {
      if (!selectedPlanForCheckout || isProcessingPayment) return;
      setIsProcessingPayment(true);
      setCheckoutError('');

      try {
        const res = await centerApi.billing.subscribe({
          plan_tier: selectedPlanForCheckout.tier || 'plus',
          billing_period: selectedPlanForCheckout.billingPeriod || selectedPeriod,
          payment_method: paymentDetails.method || selectedPaymentMethod,
          coupon_code: couponApplied ? couponCode.trim() : null,
          sender_phone: paymentDetails.senderPhone || null,
          sender_ipa: paymentDetails.senderIpa || null,
          transaction_ref: paymentDetails.transactionId || paymentDetails.instaRefNum || null,
        });

        await Promise.all([
          fetchSummary({ silent: true }),
          loadCoreCenterData?.().catch(() => {}),
        ]);

        setPaymentSuccess(true);

        try {
          confetti({
            particleCount: 110,
            spread: 75,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore confetti errors in non-visual contexts
        }

        setNotice({
          type: 'success',
          text:
            res?.message ||
            (isAr
              ? 'تم تفعيل الباقة وإصدار الفاتورة الرسمية للسنتر بنجاح!'
              : 'Center subscription activated and official invoice issued.'),
        });

        closeTimerRef.current = setTimeout(() => {
          setSelectedPlanForCheckout(null);
          resetCheckoutState();
        }, 1800);
      } catch (err) {
        setCheckoutError(
          err?.message ||
            (isAr
              ? 'تعذر إتمام الاشتراك حالياً، يرجى التحقق من البيانات والمحاولة مرة أخرى.'
              : 'Unable to complete subscription. Please check your details and try again.')
        );
      } finally {
        setIsProcessingPayment(false);
      }
    },
    [
      couponApplied,
      couponCode,
      fetchSummary,
      isAr,
      isProcessingPayment,
      loadCoreCenterData,
      resetCheckoutState,
      selectedPaymentMethod,
      selectedPeriod,
      selectedPlanForCheckout,
    ]
  );

  const handleRefresh = useCallback(() => {
    fetchSummary({ silent: Boolean(summary) });
  }, [fetchSummary, summary]);

  return {
    activeSub,
    usage,
    plans,
    invoices,
    mustCancelToSwitch,
    selectedPeriod,
    setSelectedPeriod,
    selectedPlanForCheckout,
    couponCode,
    setCouponCode,
    couponApplied,
    discountPercent,
    discountEgp,
    couponError,
    isApplyingCoupon,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    isProcessingPayment,
    paymentSuccess,
    checkoutError,
    cancelModalOpen,
    pendingSwitchTarget,
    isCancelling,
    cancelError,
    loading,
    refreshing,
    error,
    notice,
    setNotice,
    handleRefresh,
    handleSelectPlan,
    handleUpgradeFromBanner,
    openCancelModal,
    closeCancelModal,
    handleConfirmCancel,
    handleApplyCoupon,
    handleClearCoupon,
    handleCompletePayment,
    closeCheckout,
  };
};
