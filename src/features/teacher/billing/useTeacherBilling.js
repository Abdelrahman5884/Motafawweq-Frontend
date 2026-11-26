import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { teacherApi } from '../../../services/teacherApi';
import { useAuth } from '../../../context/AuthContext';
import { TEACHER_SUBSCRIPTION_CATALOG, getTeacherPlanQuotas } from '../../../constants/teacherPlanFeatures';
import { buildSubscriptionPayload } from '../../student/billing/billingPayload';

export const useTeacherBilling = (lang = 'ar') => {
  const isAr = lang === 'ar';
  const { syncUserProfile } = useAuth();
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

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('vodafone');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
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
        plan_quotas: activeSub.quotas || getTeacherPlanQuotas(activeSub.planTier),
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
        const res = await teacherApi.billing.getSummary();
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
                ? 'تعذر تحميل بيانات باقات واشتراكات المعلم حالياً. يرجى المحاولة مرة أخرى.'
                : 'Failed to load teacher billing overview. Please try again.')
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
    let mounted = true;
    const seq = ++requestSeqRef.current;

    const init = async () => {
      try {
        const res = await teacherApi.billing.getSummary();
        if (!mounted || seq !== requestSeqRef.current) return;
        const data = res?.data || {};
        setSummary(data);
        if (data?.activeSub) {
          syncAuthTierFromActiveSub(data.activeSub);
        }
        setError(null);
      } catch (err) {
        if (mounted && seq === requestSeqRef.current) {
          setError(
            err?.message ||
              (isAr
                ? 'تعذر تحميل بيانات باقات واشتراكات المعلم حالياً. يرجى المحاولة مرة أخرى.'
                : 'Failed to load teacher billing overview. Please try again.')
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
  }, [isAr, syncAuthTierFromActiveSub]);

  const activeSub = useMemo(() => summary?.activeSub || null, [summary]);
  const pendingRequest = useMemo(() => summary?.pendingRequest || null, [summary]);
  const latestRejectedRequest = useMemo(() => summary?.latestRejectedRequest || null, [summary]);
  const hasPendingRequest = Boolean(pendingRequest);
  const usage = useMemo(
    () =>
      summary?.usage || {
        coursesCount: 0,
        lessonsCount: 0,
        groupsCount: 0,
        studentsCount: 0,
      },
    [summary]
  );

  const plans = useMemo(
    () => (Array.isArray(summary?.plans) && summary.plans.length > 0 ? summary.plans : TEACHER_SUBSCRIPTION_CATALOG),
    [summary]
  );

  const invoices = useMemo(() => {
    const raw = Array.isArray(summary?.invoices) ? summary.invoices : [];
    return raw.map((inv) => {
      const amt = Number(inv.amountEgp ?? inv.finalAmountEgp ?? inv.finalAmount ?? 0);
      return {
        ...inv,
        id: inv.invoiceNumber || inv.id,
        date: inv.date || (inv.paidAt ? String(inv.paidAt).slice(0, 10) : ''),
        amountEgp: amt,
        amount: inv.amount || `${amt.toLocaleString()} ج.م`,
        amountEn: inv.amountEn || `${amt.toLocaleString()} EGP`,
        methodAr: inv.methodAr || inv.methodLabelAr || inv.method || '',
        methodEn: inv.methodEn || inv.method || '',
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
      const tier = planWithPricing?.tier || 'plus';

      if (hasPendingRequest || mustCancelToSwitch) {
        // Strict cancel-before-switch UX (covers both pending approval requests and active paid plans)
        openCancelModal(tier === 'free' ? null : planWithPricing);
        return;
      }

      if (tier === 'free') {
        setNotice({
          type: 'info',
          text: isAr
            ? 'أنت بالفعل على الباقة المجانية للمعلم (كورس واحد، حتى 3 حصص بدون AI، ومجموعة واحدة حتى 50 طالب).'
            : 'You are already on the Teacher Free plan (1 course, up to 3 lessons without AI, 1 group up to 50 students).',
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
    const targetTier = 'plus';
    const targetPlan = plans.find((p) => p.tier === targetTier) || plans[1];
    if (!targetPlan) return;
    const pricing = targetPlan.pricing?.[selectedPeriod] || targetPlan.pricing?.monthly || {};
    openCheckoutForPlan({ ...targetPlan, ...pricing }, selectedPeriod);
  }, [hasPendingRequest, mustCancelToSwitch, openCancelModal, openCheckoutForPlan, plans, selectedPeriod]);

  const handleConfirmCancel = useCallback(async () => {
    if (isCancelling) return;
    setIsCancelling(true);
    setCancelError('');
    setError(null);

    try {
      const res = await teacherApi.billing.cancel();
      const targetAfterCancel = pendingSwitchTarget;

      const refreshed = await fetchSummary({ silent: true });
      setCancelModalOpen(false);
      setPendingSwitchTarget(null);

      const stillBlocked =
        Boolean(refreshed?.pendingRequest) ||
        Boolean(refreshed?.activeSub && !refreshed.activeSub.isFree && refreshed.activeSub.planTier !== 'free');

      if (!stillBlocked && targetAfterCancel && targetAfterCancel.tier && targetAfterCancel.tier !== 'free') {
        setNotice({
          type: 'success',
          text: isAr
            ? `تم الإلغاء بنجاح. يمكنك الآن إتمام الاشتراك في ${targetAfterCancel.nameAr}.`
            : `Cancelled successfully. You can now subscribe to ${targetAfterCancel.nameEn || targetAfterCancel.nameAr}.`,
        });
        openCheckoutForPlan(targetAfterCancel, selectedPeriod);
      } else {
        setNotice({
          type: 'success',
          text:
            res?.data?.messageAr ||
            res?.message ||
            (isAr
              ? 'تم الإلغاء بنجاح. يمكنك الآن الاشتراك في أي باقة أخرى.'
              : 'Cancelled successfully. You can now subscribe to another plan.'),
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
  }, [fetchSummary, isAr, isCancelling, openCheckoutForPlan, pendingSwitchTarget, selectedPeriod]);

  const handleApplyCoupon = useCallback(
    async (e) => {
      e.preventDefault();
      const trimmed = couponCode.trim();
      if (!trimmed || !selectedPlanForCheckout) return;

      setIsApplyingCoupon(true);
      setCouponError('');
      try {
        const res = await teacherApi.billing.validateCoupon(
          trimmed,
          Number(selectedPlanForCheckout.priceEgp || 0)
        );
        if (res?.data?.isValid) {
          setCouponApplied(true);
          setDiscountPercent(Number(res.data.discountPercent || 0));
          setDiscountEgp(Number(res.data.discountEgp ?? res.data.discountAmount ?? 0));
        } else {
          setCouponApplied(false);
          setDiscountPercent(0);
          setDiscountEgp(0);
          setCouponError(res?.data?.messageAr || (isAr ? 'كود الخصم غير صحيح.' : 'Invalid coupon code.'));
        }
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

        const res = await teacherApi.billing.subscribe(payload);
        const resultData = res?.data || {};

        await fetchSummary({ silent: true });
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
                : 'Subscription activated immediately.'),
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
      fetchSummary,
      isAr,
      isProcessingPayment,
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
    pendingRequest,
    latestRejectedRequest,
    hasPendingRequest,
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
