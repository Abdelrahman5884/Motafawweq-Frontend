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

function mapCourseItem(c) {
  return {
    id: c.id || c.uuid,
    titleAr: c.titleAr || '',
    titleEn: c.titleEn || c.titleAr || '',
    subjectAr: c.subjectAr || c.gradeAr || 'مادة دراسية',
    subjectEn: c.subjectEn || c.subjectAr || 'Course',
    stage: c.stage || '',
    gradeAr: c.gradeAr || '',
    isSameGrade: c.isSameGrade !== false,
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
  };
}

export const useStudentCourses = (lang = 'ar') => {
  const isAr = lang === 'ar';
  const toastTimerRef = useRef(null);
  const searchSeqRef = useRef(0);
  const hasLoadedDefaultRef = useRef(false);
  const defaultCoursesRef = useRef([]);
  const defaultMinistryRef = useRef([]);

  const [coursesCatalog, setCoursesCatalog] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState(null);

  // Official Ministry of Education curricula state (strictly student's grade by default)
  const [ministryCurricula, setMinistryCurricula] = useState([]);
  const [loadingMinistry, setLoadingMinistry] = useState(true);
  const [ministryError, setMinistryError] = useState(null);
  const [studentGradeAr, setStudentGradeAr] = useState('');
  const [togglingUnitKey, setTogglingUnitKey] = useState('');

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'ministry' | 'enrolled' | 'pending' | 'discover'
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

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

  // Fetch initial default grade-scoped teacher courses + Ministry curricula in parallel
  useEffect(() => {
    let mounted = true;
    const seq = ++searchSeqRef.current;

    const fetchDefaultCatalog = async () => {
      setLoadingCourses(true);
      setLoadingMinistry(true);
      setCoursesError(null);
      setMinistryError(null);

      const [coursesRes, ministryRes] = await Promise.allSettled([
        studentApi.courses.list(),
        studentApi.ministry.listCurricula(),
      ]);

      if (!mounted || seq !== searchSeqRef.current) return;

      if (coursesRes.status === 'fulfilled') {
        const list = Array.isArray(coursesRes.value?.data) ? coursesRes.value.data : [];
        const mapped = list.map(mapCourseItem);
        defaultCoursesRef.current = mapped;
        setCoursesCatalog(mapped);
      } else {
        setCoursesError(
          coursesRes.reason?.message ||
            (isAr
              ? 'تعذر تحميل قائمة المقررات الدراسية، يرجى المحاولة مرة أخرى.'
              : 'Failed to load courses catalog.')
        );
      }

      if (ministryRes.status === 'fulfilled') {
        const data = ministryRes.value?.data || {};
        const items = Array.isArray(data.items) ? data.items : [];
        defaultMinistryRef.current = items;
        setMinistryCurricula(items);
        if (data.studentGradeAr || data.selectedGradeAr) {
          setStudentGradeAr(data.studentGradeAr || data.selectedGradeAr);
        }
      } else {
        setMinistryError(
          ministryRes.reason?.message ||
            (isAr
              ? 'تعذر تحميل مقررات وزارة التربية والتعليم.'
              : 'Failed to load Ministry of Education curricula.')
        );
      }

      hasLoadedDefaultRef.current = true;
      setLoadingCourses(false);
      setLoadingMinistry(false);
      setSearching(false);
    };

    fetchDefaultCatalog();
    return () => {
      mounted = false;
    };
  }, [reloadNonce, isAr]);

  // Debounced cross-grade backend search (restores cached student-grade view instantly when cleared)
  useEffect(() => {
    if (!hasLoadedDefaultRef.current) return undefined;

    const trimmed = searchQuery.trim();
    if (!trimmed) {
      searchSeqRef.current += 1;
      setCoursesCatalog(defaultCoursesRef.current);
      setMinistryCurricula(defaultMinistryRef.current);
      setSearching(false);
      return undefined;
    }

    let cancelled = false;
    setSearching(true);

    const timer = window.setTimeout(async () => {
      const seq = ++searchSeqRef.current;
      const [coursesRes, ministryRes] = await Promise.allSettled([
        studentApi.courses.list(trimmed),
        studentApi.ministry.listCurricula({ search: trimmed }),
      ]);

      if (cancelled || seq !== searchSeqRef.current) return;

      if (coursesRes.status === 'fulfilled') {
        const list = Array.isArray(coursesRes.value?.data) ? coursesRes.value.data : [];
        setCoursesCatalog(list.map(mapCourseItem));
        setCoursesError(null);
      }

      if (ministryRes.status === 'fulfilled') {
        const data = ministryRes.value?.data || {};
        setMinistryCurricula(Array.isArray(data.items) ? data.items : []);
        setMinistryError(null);
      }

      setSearching(false);
    }, 260);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  const refreshCourses = useCallback(() => {
    setSearchQuery('');
    setReloadNonce((n) => n + 1);
  }, []);

  // Persist Ministry curriculum unit completion toggle (keeps both active & cached lists in sync)
  const toggleMinistryUnit = useCallback(
    async (curriculumCode, unitIndex) => {
      const key = `${curriculumCode}:${unitIndex}`;
      setTogglingUnitKey(key);
      try {
        const res = await studentApi.ministry.toggleUnit(curriculumCode, unitIndex);
        const updated = res?.data;
        if (updated) {
          const completedSet = new Set(updated.completedUnitIndices || []);
          const applyUpdate = (list) =>
            list.map((item) => {
              if (item.code !== curriculumCode) return item;
              return {
                ...item,
                completedUnitsCount: updated.completedUnitsCount,
                completedUnitIndices: updated.completedUnitIndices,
                progressPercent: updated.progressPercent,
                activeUnitAr: updated.activeUnitAr || item.activeUnitAr,
                activeUnitEn: updated.activeUnitEn || item.activeUnitEn,
                units: (item.units || []).map((u) => ({
                  ...u,
                  isCompleted: completedSet.has(u.index),
                })),
              };
            });

          defaultMinistryRef.current = applyUpdate(defaultMinistryRef.current);
          setMinistryCurricula((prev) => applyUpdate(prev));
        }
        return updated;
      } catch (err) {
        showToast(
          err?.message ||
            (isAr ? 'تعذر تحديث تقدم الوحدة.' : 'Could not update unit progress.'),
          'warning'
        );
        return null;
      } finally {
        setTogglingUnitKey('');
      }
    },
    [isAr, showToast]
  );

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
      totalCount: coursesCatalog.length + ministryCurricula.length,
      teacherCoursesCount: coursesCatalog.length,
      ministryCount: ministryCurricula.length,
      enrolledCount,
      pendingCount,
      discoverCount,
    };
  }, [coursesCatalog, ministryCurricula]);

  // Tab-filtered teacher courses (backend already scoped by grade or cross-grade search)
  const filteredCourses = useMemo(() => {
    if (activeTab === 'ministry') return [];
    return coursesCatalog.filter((c) => {
      if (activeTab === 'enrolled' && !c.isEnrolled) return false;
      if (activeTab === 'pending' && !c.isPending) return false;
      if (activeTab === 'discover' && (c.isEnrolled || c.isPending)) return false;
      return true;
    });
  }, [coursesCatalog, activeTab]);

  // Tab-filtered Ministry curricula (backend already scoped by grade or cross-grade search)
  const filteredMinistryCurricula = useMemo(() => {
    if (activeTab !== 'all' && activeTab !== 'ministry') return [];
    return ministryCurricula;
  }, [ministryCurricula, activeTab]);

  const isSearchingAllGrades = searchQuery.trim().length > 0;
  const hasActiveFilters = activeTab !== 'all' || isSearchingAllGrades;

  const resetFilters = useCallback(() => {
    setActiveTab('all');
    setSearchQuery('');
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
      const markPending = (list) =>
        list.map((c) => (c.id === course.id ? { ...c, isPending: true } : c));
      defaultCoursesRef.current = markPending(defaultCoursesRef.current);
      setCoursesCatalog((prev) => markPending(prev));
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
    ministryCurricula,
    filteredMinistryCurricula,
    loadingMinistry,
    ministryError,
    studentGradeAr,
    toggleMinistryUnit,
    togglingUnitKey,
    refreshCourses,
    stats,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    searching,
    isSearchingAllGrades,
    hasActiveFilters,
    resetFilters,
    enrollTargetCourse,
    setEnrollTargetCourse,
    submitEnrollment,
    toast,
  };
};
