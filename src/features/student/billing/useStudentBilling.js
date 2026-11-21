import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { studentApi } from '../../../services/studentApi';
import { useAuth } from '../../../context/AuthContext';

export const useStudentBilling = (lang = 'ar') => {
  const isAr = lang === 'ar';
  const { syncUserProfile } = useAuth();
  const requestSeqRef = useRef(0);
  const closeTimerRef = useRef(null);

  const [overview, setOverview] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null);

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountEgp, setDiscountEgp] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('vodafone');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [switchingFree, setSwitchingFree] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const fetchOverview = useCallback(
    async ({ silent = false } = {}) => {
      const seq = ++requestSeqRef.current;
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const res = await studentApi.billing.overview();
        if (seq !== requestSeqRef.current) return null;
        const data = res?.data || {};
        setOverview(data);
        if (data?.activeSub?.planTier && syncUserProfile) {
          syncUserProfile({
            plan_tier: data.activeSub.planTier,
            unlocked_features: data.activeSub.unlockedFeatures || null,
          });
        }
        return data;
      } catch (err) {
        if (seq === requestSeqRef.current) {
          setError(
            err?.message ||
              (isAr
                ? 'تعذر تحميل بيانات الاشتراك والفواتير حالياً، يرجى المحاولة مرة أخرى.'
                : 'Failed to load billing overview. Please try again.')
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
    [isAr, syncUserProfile]
  );

  useEffect(() => {
    let mounted = true;
    const seq = ++requestSeqRef.current;

    const init = async () => {
      try {
        const res = await studentApi.billing.overview();
        if (!mounted || seq !== requestSeqRef.current) return;
        const data = res?.data || {};
        setOverview(data);
        if (data?.activeSub?.planTier && syncUserProfile) {
          syncUserProfile({
            plan_tier: data.activeSub.planTier,
            unlocked_features: data.activeSub.unlockedFeatures || null,
          });
        }
        setError(null);
      } catch (err) {
        if (mounted && seq === requestSeqRef.current) {
          setError(
            err?.message ||
              (isAr
                ? 'تعذر تحميل بيانات الاشتراك والفواتير حالياً، يرجى المحاولة مرة أخرى.'
                : 'Failed to load billing overview. Please try again.')
          );
        }
      } finally {
        if (mounted && seq === requestSeqRef.current) {
          setLoading(false);
        }
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, [isAr, syncUserProfile]);

  const activeSub = useMemo(() => overview?.activeSub || null, [overview]);
  const plans = useMemo(() => (Array.isArray(overview?.plans) ? overview.plans : []), [overview]);
  const invoices = useMemo(() => {
    const raw = Array.isArray(overview?.invoices) ? overview.invoices : [];
    return raw.map((inv) => ({
      ...inv,
      amount: `${Number(inv.amountEgp ?? 0).toLocaleString()} ج.م`,
      amountEn: `${Number(inv.amountEgp ?? 0).toLocaleString()} EGP`,
    }));
  }, [overview]);

  const resetCheckoutState = useCallback(() => {
    setCouponCode('');
    setCouponApplied(false);
    setDiscountPercent(0);
    setDiscountEgp(0);
    setCouponError('');
    setCheckoutError('');
    setPaymentSuccess(false);
    setSelectedPaymentMethod('vodafone');
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

  const handleSelectPlan = useCallback(
    async (planWithPricing) => {
      const tier = planWithPricing?.tier || (planWithPricing?.id === 'plan-free' ? 'free' : 'plus');
      if (tier === 'free') {
        if (activeSub?.planTier === 'free') {
          setNotice({
            type: 'info',
            text: isAr
              ? 'أنت بالفعل على باقة الطالب المجانية، ويمكنك الترقية لباقة بلس أو برو في أي وقت.'
              : 'You are already on the Student Free plan. You can upgrade anytime.',
          });
          return;
        }
        setSwitchingFree(true);
        setError(null);
        try {
          const res = await studentApi.billing.subscribe({
            plan_tier: 'free',
            billing_period: 'monthly',
          });
          await fetchOverview({ silent: true });
          setNotice({
            type: 'success',
            text:
              res?.message ||
              (isAr ? 'تم التبديل إلى باقة الطالب المجانية بنجاح.' : 'Switched to Student Free plan.'),
          });
        } catch (err) {
          setError(err?.message || (isAr ? 'تعذر تغيير الباقة.' : 'Failed to switch plan.'));
        } finally {
          setSwitchingFree(false);
        }
        return;
      }

      openCheckoutForPlan(planWithPricing, selectedPeriod);
    },
    [activeSub?.planTier, fetchOverview, isAr, openCheckoutForPlan, selectedPeriod]
  );

  const handleUpgradeFromBanner = useCallback(() => {
    const proPlan = plans.find((p) => p.tier === 'pro');
    if (!proPlan) return;
    const targetPeriod = activeSub?.planTier === 'pro' ? 'annual' : selectedPeriod;
    const pricing = proPlan.pricing?.[targetPeriod] || proPlan.pricing?.monthly || {};
    setSelectedPeriod(targetPeriod);
    openCheckoutForPlan({ ...proPlan, ...pricing }, targetPeriod);
  }, [activeSub?.planTier, openCheckoutForPlan, plans, selectedPeriod]);

  const handleApplyCoupon = useCallback(
    async (e) => {
      e.preventDefault();
      const trimmed = couponCode.trim();
      if (!trimmed || !selectedPlanForCheckout) return;

      setIsApplyingCoupon(true);
      setCouponError('');
      try {
        const res = await studentApi.billing.validateCoupon(
          trimmed,
          Number(selectedPlanForCheckout.priceEgp || 0)
        );
        setCouponApplied(true);
        setDiscountPercent(Number(res?.data?.discountPercent || 0));
        setDiscountEgp(Number(res?.data?.discountEgp || 0));
      } catch (err) {
        setCouponApplied(false);
        setDiscountPercent(0);
        setDiscountEgp(0);
        setCouponError(
          err?.message || (isAr ? 'كود الخصم غير صالح أو منتهي الصلاحية.' : 'Invalid or expired coupon code.')
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
        const res = await studentApi.billing.subscribe({
          plan_tier: selectedPlanForCheckout.tier || 'plus',
          billing_period: selectedPlanForCheckout.billingPeriod || selectedPeriod,
          payment_method: paymentDetails.method || selectedPaymentMethod,
          coupon_code: couponApplied ? couponCode.trim() : null,
          sender_phone: paymentDetails.senderPhone || null,
          sender_ipa: paymentDetails.senderIpa || null,
          transaction_ref: paymentDetails.transactionId || paymentDetails.instaRefNum || null,
        });

        await fetchOverview({ silent: true });
        setPaymentSuccess(true);

        try {
          confetti({
            particleCount: 110,
            spread: 75,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore confetti errors in headless browsers
        }

        setNotice({
          type: 'success',
          text:
            res?.data?.messageAr ||
            res?.message ||
            (isAr ? 'تم تفعيل الباقة وإصدار الفاتورة الرسمية بنجاح.' : 'Subscription activated and invoice issued.'),
        });

        closeTimerRef.current = setTimeout(() => {
          setSelectedPlanForCheckout(null);
          resetCheckoutState();
        }, 2200);
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
      fetchOverview,
      isAr,
      isProcessingPayment,
      resetCheckoutState,
      selectedPaymentMethod,
      selectedPeriod,
      selectedPlanForCheckout,
    ]
  );

  const handleRefresh = useCallback(() => {
    fetchOverview({ silent: Boolean(overview) });
  }, [fetchOverview, overview]);

  return {
    activeSub,
    plans,
    invoices,
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
    loading,
    refreshing,
    switchingFree,
    error,
    notice,
    setNotice,
    handleRefresh,
    handleSelectPlan,
    handleUpgradeFromBanner,
    handleApplyCoupon,
    handleClearCoupon,
    handleCompletePayment,
    closeCheckout,
  };
};
