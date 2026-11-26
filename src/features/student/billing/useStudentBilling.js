import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { studentApi } from '../../../services/studentApi';
import { useAuth } from '../../../context/AuthContext';
import { buildSubscriptionPayload } from './billingPayload';

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
  const [paymentResult, setPaymentResult] = useState(null);
  const [checkoutError, setCheckoutError] = useState('');

  // Cancel-before-switch & pending-request cancellation modal state
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
  const pendingRequest = useMemo(() => overview?.pendingRequest || null, [overview]);
  const latestRejectedRequest = useMemo(() => overview?.latestRejectedRequest || null, [overview]);
  const hasPendingRequest = Boolean(pendingRequest);
  const plans = useMemo(() => (Array.isArray(overview?.plans) ? overview.plans : []), [overview]);
  const invoices = useMemo(() => {
    const raw = Array.isArray(overview?.invoices) ? overview.invoices : [];
    return raw.map((inv) => ({
      ...inv,
      amount: `${Number(inv.amountEgp ?? 0).toLocaleString()} ج.م`,
      amountEn: `${Number(inv.amountEgp ?? 0).toLocaleString()} EGP`,
    }));
  }, [overview]);

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
    setPaymentResult(null);
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
      const tier = planWithPricing?.tier || (planWithPricing?.id === 'plan-free' ? 'free' : 'plus');

      if (hasPendingRequest || mustCancelToSwitch) {
        openCancelModal(tier === 'free' ? null : planWithPricing);
        return;
      }

      if (tier === 'free') {
        setNotice({
          type: 'info',
          text: isAr
            ? 'أنت بالفعل على باقة الطالب المجانية، ويمكنك الترقية لباقة بلس أو برو في أي وقت.'
            : 'You are already on the Student Free plan. You can upgrade anytime.',
        });
        return;
      }

      openCheckoutForPlan(planWithPricing, selectedPeriod);
    },
    [hasPendingRequest, isAr, mustCancelToSwitch, openCancelModal, openCheckoutForPlan, selectedPeriod]
  );

  const handleUpgradeFromBanner = useCallback(() => {
    if (hasPendingRequest || mustCancelToSwitch) {
      openCancelModal(null);
      return;
    }
    const proPlan = plans.find((p) => p.tier === 'pro');
    if (!proPlan) return;
    const pricing = proPlan.pricing?.[selectedPeriod] || proPlan.pricing?.monthly || {};
    openCheckoutForPlan({ ...proPlan, ...pricing }, selectedPeriod);
  }, [hasPendingRequest, mustCancelToSwitch, openCancelModal, openCheckoutForPlan, plans, selectedPeriod]);

  const handleConfirmCancel = useCallback(async () => {
    if (isCancelling) return;
    setIsCancelling(true);
    setCancelError('');
    setError(null);

    try {
      const res = await studentApi.billing.cancel();
      const targetAfterCancel = pendingSwitchTarget;

      const refreshed = await fetchOverview({ silent: true });
      setCancelModalOpen(false);
      setPendingSwitchTarget(null);

      const stillBlocked =
        Boolean(refreshed?.pendingRequest) ||
        Boolean(refreshed?.activeSub && !refreshed.activeSub.isFree && refreshed.activeSub.planTier !== 'free');

      if (!stillBlocked && targetAfterCancel && targetAfterCancel.tier && targetAfterCancel.tier !== 'free') {
        setNotice({
          type: 'success',
          text: isAr
            ? `تم الإلغاء بنجاح. يمكنك الآن إتمام الاشتراك في «${targetAfterCancel.nameAr}».`
            : `Cancelled successfully. You can now subscribe to "${targetAfterCancel.nameEn || targetAfterCancel.nameAr}".`,
        });
        openCheckoutForPlan(targetAfterCancel, selectedPeriod);
      } else {
        setNotice({
          type: 'success',
          text:
            res?.data?.messageAr ||
            res?.message ||
            (isAr
              ? 'تم إلغاء الاشتراك بنجاح والعودة إلى الباقة المجانية. يمكنك الآن اختيار أي باقة أخرى.'
              : 'Subscription cancelled successfully. You can now subscribe to another plan.'),
        });
      }
    } catch (err) {
      setCancelError(
        err?.message ||
          (isAr ? 'تعذر إلغاء الاشتراك حالياً. يرجى المحاولة مرة أخرى.' : 'Failed to cancel subscription. Please try again.')
      );
    } finally {
      setIsCancelling(false);
    }
  }, [fetchOverview, isAr, isCancelling, openCheckoutForPlan, pendingSwitchTarget, selectedPeriod]);

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
        const payload = buildSubscriptionPayload({
          planTier: selectedPlanForCheckout.tier || 'plus',
          billingPeriod: selectedPlanForCheckout.billingPeriod || selectedPeriod,
          paymentMethod: paymentDetails.method || selectedPaymentMethod,
          couponCode: couponApplied ? couponCode.trim() : null,
          senderPhone: paymentDetails.senderPhone || null,
          senderIpa: paymentDetails.senderIpa || null,
          transactionRef:
            paymentDetails.transactionRef || paymentDetails.transactionId || paymentDetails.instaRefNum || null,
          receiptFile: paymentDetails.receiptFile || null,
        });

        const res = await studentApi.billing.subscribe(payload);
        const resultData = res?.data || {};

        await fetchOverview({ silent: true });
        setPaymentResult(resultData);
        setPaymentSuccess(true);

        if (!resultData.requiresApproval) {
          try {
            confetti({
              particleCount: 110,
              spread: 75,
              origin: { y: 0.6 },
            });
          } catch {
            // ignore confetti errors in headless browsers
          }
        }

        setNotice({
          type: resultData.requiresApproval ? 'info' : 'success',
          text:
            resultData.messageAr ||
            res?.message ||
            (resultData.requiresApproval
              ? isAr
                ? 'تم إرسال طلب الاشتراك ووصل الدفع للمراجعة — سيتم تفعيل الباقة فور اعتماد السوبر أدمن.'
                : 'Subscription request and receipt submitted for Super Admin review.'
              : isAr
                ? 'تم تفعيل الباقة مجاناً بنجاح فوراً!'
                : 'Subscription activated immediately!'),
        });

        closeTimerRef.current = setTimeout(() => {
          setSelectedPlanForCheckout(null);
          resetCheckoutState();
        }, 2300);
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
    pendingRequest,
    latestRejectedRequest,
    hasPendingRequest,
    mustCancelToSwitch,
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
    paymentResult,
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
