import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { studentApi } from '../../../services/studentApi';

export function formatCourseDuration(hoursTotal, publishedDurationSeconds, lessonsCount, lang = 'ar') {
  const isAr = lang === 'ar';
  if (hoursTotal && String(hoursTotal).trim()) {
    return String(hoursTotal).trim();
  }
  const secs = Number(publishedDurationSeconds || 0);
  if (secs > 0) {
    const totalMins = Math.max(1, Math.round(secs / 60));
    if (totalMins < 60) {
      return isAr ? `${totalMins} دقيقة` : `${totalMins} min`;
    }
    const hrs = totalMins / 60;
    const rounded = Number.isInteger(hrs) ? String(hrs) : hrs.toFixed(1);
    return isAr ? `${rounded} ساعة` : `${rounded} hrs`;
  }
  const cnt = Number(lessonsCount || 0);
  if (cnt <= 0) {
    return isAr ? 'قريباً' : 'Coming soon';
  }
  return isAr ? `${cnt} ساعات` : `${cnt} hrs`;
}

export const useStudentCourses = (lang = 'ar') => {
  const isAr = lang === 'ar';
  const toastTimerRef = useRef(null);

  const [coursesCatalog, setCoursesCatalog] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState(null);

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'enrolled' | 'pending' | 'discover'
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState('smart'); // 'smart' | 'progress' | 'price_asc' | 'lessons'
  const [searchQuery, setSearchQuery] = useState('');

  const [enrollTargetCourse, setEnrollTargetCourse] = useState(null);
  const [toast, setToast] = useState(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast({ message, type });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 4000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchCatalog = async () => {
      setLoadingCourses(true);
      setCoursesError(null);
      try {
        const res = await studentApi.courses.list();
        if (!mounted) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        const mapped = list.map((c) => ({
          id: c.id || c.uuid,
          titleAr: c.titleAr || '',
          titleEn: c.titleEn || c.titleAr || '',
          subjectAr: c.subjectAr || c.gradeAr || 'مادة دراسية',
          subjectEn: c.subjectEn || c.subjectAr || 'Course',
          stage: c.stage || '',
          gradeAr: c.gradeAr || '',
          descriptionAr: c.descriptionAr || '',
          descriptionEn: c.descriptionEn || c.descriptionAr || '',
          coverUrl: c.coverUrl || '',
          priceEgp: Math.max(0, Number(c.priceEgp || 0)),
          isEnrolled: Boolean(c.isEnrolled),
          isPending: Boolean(c.isPending),
          lessonsCount: Math.max(0, Number(c.lessonsCount || 0)),
          completedLessons: Math.max(0, Number(c.completedLessons || 0)),
          progressPercent: Math.min(100, Math.max(0, Number(c.progressPercent || 0))),
          hoursTotal: c.hoursTotal || '',
          publishedDurationSeconds: Math.max(0, Number(c.publishedDurationSeconds || 0)),
          studentsCount: Math.max(0, Number(c.studentsCount || 0)),
          nextLessonId: c.nextLessonId || null,
          payoutAccounts: Array.isArray(c.payoutAccounts) ? c.payoutAccounts : [],
          teacher: {
            nameAr: c.teacherName || 'المعلم',
            titleAr: c.gradeAr || '',
            avatar: c.teacherAvatar || '',
          },
        }));
        setCoursesCatalog(mapped);
      } catch (err) {
        if (mounted) {
          setCoursesError(
            err?.message ||
              (isAr
                ? 'تعذر تحميل قائمة المقررات الدراسية، يرجى المحاولة مرة أخرى.'
                : 'Failed to load courses catalog.')
          );
        }
      } finally {
        if (mounted) setLoadingCourses(false);
      }
    };

    fetchCatalog();
    return () => {
      mounted = false;
    };
  }, [reloadNonce, isAr]);

  const refreshCourses = useCallback(() => {
    setReloadNonce((n) => n + 1);
  }, []);

  // Filter tab counts
  const stats = useMemo(() => {
    let enrolledCount = 0;
    let pendingCount = 0;
    let discoverCount = 0;

    coursesCatalog.forEach((c) => {
      if (c.isEnrolled) enrolledCount += 1;
      else if (c.isPending) pendingCount += 1;
      else discoverCount += 1;
    });

    return {
      totalCount: coursesCatalog.length,
      enrolledCount,
      pendingCount,
      discoverCount,
    };
  }, [coursesCatalog]);

  // Unique real subjects for chip filtering
  const subjectOptions = useMemo(() => {
    const map = new Map();
    coursesCatalog.forEach((c) => {
      const key = (c.subjectAr || '').trim();
      if (key && !map.has(key)) {
        map.set(key, { ar: key, en: c.subjectEn || key });
      }
    });
    return Array.from(map.values());
  }, [coursesCatalog]);

  // Filtered + sorted courses
  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = coursesCatalog.filter((c) => {
      if (activeTab === 'enrolled' && !c.isEnrolled) return false;
      if (activeTab === 'pending' && !c.isPending) return false;
      if (activeTab === 'discover' && (c.isEnrolled || c.isPending)) return false;
      if (selectedSubject !== 'all' && c.subjectAr !== selectedSubject) return false;
      if (!q) return true;
      const hay = [
        c.titleAr,
        c.titleEn,
        c.subjectAr,
        c.subjectEn,
        c.gradeAr,
        c.descriptionAr,
        c.teacher?.nameAr,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });

    if (sortBy === 'progress') {
      return [...list].sort((a, b) => b.progressPercent - a.progressPercent);
    }
    if (sortBy === 'price_asc') {
      return [...list].sort((a, b) => a.priceEgp - b.priceEgp);
    }
    if (sortBy === 'lessons') {
      return [...list].sort((a, b) => b.lessonsCount - a.lessonsCount);
    }
    return list;
  }, [coursesCatalog, activeTab, selectedSubject, searchQuery, sortBy]);

  const hasActiveFilters =
    activeTab !== 'all' || selectedSubject !== 'all' || searchQuery.trim().length > 0;

  const resetFilters = useCallback(() => {
    setActiveTab('all');
    setSelectedSubject('all');
    setSearchQuery('');
    setSortBy('smart');
  }, []);

  // Submit verified enrollment / payment request via CourseEnrollModal
  const submitEnrollment = useCallback(
    async ({ course, paymentMethod, payoutAccountUuid, couponCode, notes }) => {
      const payload = {
        course_uuid: course.id,
        payment_method: paymentMethod || 'vodafone',
        notes:
          notes?.trim() ||
          (isAr ? `طلب اشتراك في مقرر: ${course.titleAr}` : `Enrollment request: ${course.titleAr}`),
      };
      if (payoutAccountUuid) {
        payload.payout_account_uuid = payoutAccountUuid;
      }
      if (couponCode?.trim()) {
        payload.coupon_code = couponCode.trim().toUpperCase();
      }

      const res = await studentApi.billing.createPayment(payload);
      setCoursesCatalog((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, isPending: true } : c))
      );
      setEnrollTargetCourse(null);

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.65 } });
      } catch {
        // ignore
      }

      const refNum = res?.data?.referenceNum;
      showToast(
        isAr
          ? `تم إرسال طلب الاشتراك في «${course.titleAr}» بنجاح${refNum ? ` (مرجع: ${refNum})` : ''} — بانتظار موافقة المعلم.`
          : `Enrollment request submitted for "${course.titleEn || course.titleAr}" — pending teacher approval.`
      );
      return res?.data;
    },
    [isAr, showToast]
  );

  return {
    coursesCatalog,
    filteredCourses,
    loadingCourses,
    coursesError,
    refreshCourses,
    stats,
    subjectOptions,
    activeTab,
    setActiveTab,
    selectedSubject,
    setSelectedSubject,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    hasActiveFilters,
    resetFilters,
    enrollTargetCourse,
    setEnrollTargetCourse,
    submitEnrollment,
    toast,
  };
};
