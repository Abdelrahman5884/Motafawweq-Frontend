import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Phone,
  UserPlus,
  RefreshCw,
  AlertCircle,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useSetBreadcrumbs } from '../../context/BreadcrumbContext';
import { parentApi } from '../../services/parentApi';
import { InfoTooltip } from '../../components/common/InfoTooltip';
import {
  ParentEmptyState,
  ChildSwitcher,
  ChildSummaryCard,
  ParentOverviewTab,
  ParentCoursesTab,
  ParentAttendanceTab,
  ParentExamsTab,
  ParentHomeworkTab,
  ParentFinancialsTab,
  ParentSettingsTab,
  LinkChildModal,
  ContactCenterModal,
} from '../../features/parent';

const VALID_TABS = ['overview', 'courses', 'attendance', 'exams', 'homework', 'financials', 'settings'];

const TAB_BREADCRUMBS = {
  courses: { labelAr: 'المقررات والدروس', labelEn: 'Enrolled Courses' },
  attendance: { labelAr: 'سجل حضور السنتر', labelEn: 'Center Attendance' },
  exams: { labelAr: 'الدرجات والامتحانات', labelEn: 'Exam Scorecards' },
  homework: { labelAr: 'الواجبات والتسليمات', labelEn: 'Homework Tracker' },
  financials: { labelAr: 'المصروفات والاشتراكات', labelEn: 'Tuition & Fees' },
  settings: { labelAr: 'الإعدادات والملف الشخصي', labelEn: 'Settings & Profile' },
};

const EMPTY_CHILD_DASHBOARD = {
  summary: null,
  courses: { summary: { totalCourses: 0, avgProgress: 0 }, items: [] },
  attendance: {
    summary: { rate: 0, presentCount: 0, lateCount: 0, absentCount: 0, excusedCount: 0, totalCount: 0 },
    items: [],
    pagination: { currentPage: 1, lastPage: 1, perPage: 30, total: 0 },
  },
  exams: {
    summary: { avgPercent: 0, totalGraded: 0, passedCount: 0, fullMarkCount: 0 },
    items: [],
    pagination: { currentPage: 1, lastPage: 1, perPage: 30, total: 0 },
  },
  homework: { summary: { total: 0, graded: 0, submitted: 0, pending: 0, rejected: 0, overdue: 0 }, items: [] },
  financials: {
    summary: {
      totalPaidEgp: 0,
      pendingAmountEgp: 0,
      dueAmountEgp: 0,
      activePlanTier: 'free',
      activePlanAr: 'الباقة المجانية',
      activePlanEn: 'Free Plan',
      renewsAt: null,
    },
    invoices: [],
  },
};

const normalizeDashboard = (data) => ({
  summary: data?.summary || null,
  courses: data?.courses || EMPTY_CHILD_DASHBOARD.courses,
  attendance: data?.attendance || EMPTY_CHILD_DASHBOARD.attendance,
  exams: data?.exams || EMPTY_CHILD_DASHBOARD.exams,
  homework: data?.homework || EMPTY_CHILD_DASHBOARD.homework,
  financials: data?.financials || EMPTY_CHILD_DASHBOARD.financials,
});

const extractErrorMessage = (err, fallbackAr, fallbackEn, lang) => {
  if (err?.errors) {
    const firstKey = Object.keys(err.errors)[0];
    const firstMsg = Array.isArray(err.errors[firstKey]) ? err.errors[firstKey][0] : err.errors[firstKey];
    if (firstMsg) return String(firstMsg);
  }
  if (err?.message) return String(err.message);
  return lang === 'ar' ? fallbackAr : fallbackEn;
};

export const ParentDashboard = () => {
  const { lang, isRtl } = useLanguage();
  const {
    isAuthenticated,
    authLoading,
    currentRole,
    currentUser,
    syncUserProfile,
    changePassword,
  } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const activeTab = VALID_TABS.includes(tabParam) ? tabParam : 'overview';

  const breadcrumbCrumbs = useMemo(() => {
    const meta = TAB_BREADCRUMBS[activeTab];
    return meta ? [{ labelAr: meta.labelAr, labelEn: meta.labelEn }] : [];
  }, [activeTab]);
  useSetBreadcrumbs(breadcrumbCrumbs);

  const handleTabChange = useCallback((nextTab) => {
    setSearchParams({ tab: VALID_TABS.includes(nextTab) ? nextTab : 'overview' });
  }, [setSearchParams]);

  const isParentSession = Boolean(isAuthenticated && currentRole === 'parent');

  // Core overview state
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState('');
  const [childrenList, setChildrenList] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);

  // Per-child cache + monotonic sequence refs (eliminates race conditions & stale-child flashes)
  const childCacheRef = useRef(new Map());
  const childReqSeqRef = useRef(0);
  const attReqSeqRef = useRef(0);
  const selectedChildIdRef = useRef(null);

  // Active child full dashboard state
  const [childLoading, setChildLoading] = useState(false);
  const [childError, setChildError] = useState('');
  const [childDashboard, setChildDashboard] = useState(EMPTY_CHILD_DASHBOARD);

  // Server-backed Attendance Filter & Pagination states
  const [attendanceFilter, setAttendanceFilter] = useState('all');
  const [attendanceFilterLoading, setAttendanceFilterLoading] = useState(false);
  const [loadingMoreAttendance, setLoadingMoreAttendance] = useState(false);
  const [loadingMoreExams, setLoadingMoreExams] = useState(false);

  // Inquiries state
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesPagination, setInquiriesPagination] = useState({ currentPage: 1, lastPage: 1, perPage: 10, total: 0 });
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [loadingMoreInquiries, setLoadingMoreInquiries] = useState(false);

  // Modals & Action states
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkSubmitting, setLinkSubmitting] = useState(false);
  const [linkError, setLinkError] = useState('');

  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState('');

  const [exportingCsv, setExportingCsv] = useState(false);
  const [unlinkingId, setUnlinkingId] = useState(null);
  const [confirmUnlinkId, setConfirmUnlinkId] = useState(null);
  const [savingToggleField, setSavingToggleField] = useState(null);

  // Toast banner
  const [toast, setToast] = useState({ type: 'success', text: '' });
  const pushToast = useCallback((text, type = 'success') => {
    setToast({ type, text });
  }, []);

  useEffect(() => {
    if (!toast.text) return undefined;
    const timer = setTimeout(() => setToast({ type: 'success', text: '' }), 4500);
    return () => clearTimeout(timer);
  }, [toast.text]);

  // Settings form state
  const [parentName, setParentName] = useState(currentUser?.name || '');
  const [parentPhone, setParentPhone] = useState(currentUser?.phone || '');
  const [parentEmergencyPhone, setParentEmergencyPhone] = useState('');
  const [parentEmail, setParentEmail] = useState(currentUser?.email || '');
  const [notifyTuitionRenewal, setNotifyTuitionRenewal] = useState(true);
  const [notifyAchievementsCertificates, setNotifyAchievementsCertificates] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  const hydrateParentSettings = useCallback((parentData) => {
    if (!parentData) return;
    setParentName(parentData.name ?? '');
    setParentPhone(parentData.phone ?? '');
    setParentEmergencyPhone(parentData.emergencyPhone ?? '');
    setParentEmail(parentData.email ?? '');
    setNotifyTuitionRenewal(Boolean(parentData.notifyTuitionRenewal));
    setNotifyAchievementsCertificates(Boolean(parentData.notifyAchievementsCertificates));
  }, []);

  const loadChildDashboard = useCallback(async (studentId, { force = false } = {}) => {
    if (!studentId) {
      setChildDashboard(EMPTY_CHILD_DASHBOARD);
      setChildLoading(false);
      setChildError('');
      return;
    }

    const numericId = Number(studentId);
    if (!force && childCacheRef.current.has(numericId)) {
      setChildDashboard(childCacheRef.current.get(numericId));
      setChildError('');
      setChildLoading(false);
      return;
    }

    const reqSeq = ++childReqSeqRef.current;
    setChildLoading(true);
    setChildError('');
    setChildDashboard(EMPTY_CHILD_DASHBOARD);

    try {
      const res = await parentApi.getChildDashboard(numericId);
      if (reqSeq !== childReqSeqRef.current) return;
      const normalized = normalizeDashboard(res?.data);
      childCacheRef.current.set(numericId, normalized);
      setChildDashboard(normalized);
    } catch (err) {
      if (reqSeq !== childReqSeqRef.current) return;
      setChildError(
        extractErrorMessage(
          err,
          'تعذر تحميل بيانات الطالب المحدد.',
          'Failed to load selected student dashboard.',
          lang
        )
      );
    } finally {
      if (reqSeq === childReqSeqRef.current) {
        setChildLoading(false);
      }
    }
  }, [lang]);

  // Single-roundtrip initial load (overview + active child dashboard + inquiries in 1 HTTP call)
  const loadOverview = useCallback(async (preferredChildId = null, { clearCache = false } = {}) => {
    if (!isParentSession) return;
    if (clearCache) {
      childCacheRef.current.clear();
    }

    setOverviewLoading(true);
    setOverviewError('');

    const targetChildId = preferredChildId ?? selectedChildIdRef.current;

    try {
      const res = await parentApi.getOverview({
        include_child: 1,
        ...(targetChildId ? { child_id: targetChildId } : {}),
      });
      const data = res?.data || {};
      hydrateParentSettings(data.parent);

      const list = Array.isArray(data.children) ? data.children : [];
      setChildrenList(list);

      if (Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
      }
      if (data.inquiriesPagination) {
        setInquiriesPagination(data.inquiriesPagination);
      }

      const resolvedActiveId = data.activeChildId
        ? Number(data.activeChildId)
        : list.length > 0
        ? Number(list[0].id)
        : null;

      selectedChildIdRef.current = resolvedActiveId;
      setSelectedChildId(resolvedActiveId);
      setAttendanceFilter('all');

      if (resolvedActiveId && data.activeChildDashboard) {
        const normalized = normalizeDashboard(data.activeChildDashboard);
        childCacheRef.current.set(resolvedActiveId, normalized);
        childReqSeqRef.current += 1;
        setChildDashboard(normalized);
        setChildLoading(false);
        setChildError('');
      } else {
        setChildDashboard(EMPTY_CHILD_DASHBOARD);
      }
    } catch (err) {
      setOverviewError(
        extractErrorMessage(
          err,
          'تعذر تحميل بيانات بوابة ولي الأمر. يرجى المحاولة مرة أخرى.',
          'Could not load Parent Portal data. Please try again.',
          lang
        )
      );
    } finally {
      setOverviewLoading(false);
    }
  }, [hydrateParentSettings, isParentSession, lang]);

  const loadInquiries = useCallback(async () => {
    if (!isParentSession) return;
    setInquiriesLoading(true);
    try {
      const res = await parentApi.listInquiries({ page: 1, per_page: 10 });
      setInquiries(Array.isArray(res?.data?.items) ? res.data.items : []);
      if (res?.data?.pagination) {
        setInquiriesPagination(res.data.pagination);
      }
    } catch {
      // Non-blocking refresh
    } finally {
      setInquiriesLoading(false);
    }
  }, [isParentSession]);

  useEffect(() => {
    if (authLoading || !isParentSession) return;
    Promise.resolve().then(() => {
      loadOverview();
    });
  }, [authLoading, isParentSession, loadOverview]);

  const handleSelectChild = useCallback((nextId) => {
    const numericId = Number(nextId);
    if (numericId === Number(selectedChildIdRef.current)) return;
    selectedChildIdRef.current = numericId;
    setSelectedChildId(numericId);
    setAttendanceFilter('all');
    attReqSeqRef.current += 1;
    setAttendanceFilterLoading(false);
    loadChildDashboard(numericId);
  }, [loadChildDashboard]);

  const activeChildSummary = useMemo(() => {
    if (childDashboard.summary && Number(childDashboard.summary.id) === Number(selectedChildId)) {
      return childDashboard.summary;
    }
    return childrenList.find((c) => Number(c.id) === Number(selectedChildId)) || null;
  }, [childDashboard.summary, childrenList, selectedChildId]);

  const hasCurrentChildData = Boolean(
    childDashboard.summary && Number(childDashboard.summary.id) === Number(selectedChildId)
  );

  // Server-backed Attendance Status Filter (works accurately even across multiple pages!)
  const handleAttendanceFilterChange = async (nextStatus) => {
    if (!selectedChildId || nextStatus === attendanceFilter) return;
    setAttendanceFilter(nextStatus);
    const seq = ++attReqSeqRef.current;
    setAttendanceFilterLoading(true);
    try {
      const res = await parentApi.getChildAttendance(selectedChildId, {
        status: nextStatus === 'all' ? '' : nextStatus,
        page: 1,
        per_page: 25,
      });
      if (seq !== attReqSeqRef.current) return;
      const nextData = res?.data;
      if (nextData) {
        setChildDashboard((prev) => {
          const updated = {
            ...prev,
            attendance: {
              summary: nextData.summary || prev.attendance.summary,
              items: nextData.items || [],
              pagination: nextData.pagination || prev.attendance.pagination,
            },
          };
          if (nextStatus === 'all') {
            childCacheRef.current.set(Number(selectedChildId), updated);
          }
          return updated;
        });
      }
    } catch (err) {
      if (seq === attReqSeqRef.current) {
        pushToast(extractErrorMessage(err, 'تعذر تصفية سجل الحضور.', 'Failed to filter attendance logs.', lang), 'error');
      }
    } finally {
      if (seq === attReqSeqRef.current) {
        setAttendanceFilterLoading(false);
      }
    }
  };

  // Pagination: Load more attendance / exams / inquiries
  const handleLoadMoreAttendance = async () => {
    const pag = childDashboard.attendance?.pagination;
    if (!selectedChildId || !pag || pag.currentPage >= pag.lastPage || loadingMoreAttendance) return;
    setLoadingMoreAttendance(true);
    try {
      const res = await parentApi.getChildAttendance(selectedChildId, {
        status: attendanceFilter === 'all' ? '' : attendanceFilter,
        page: pag.currentPage + 1,
        per_page: pag.perPage || 25,
      });
      const nextData = res?.data;
      if (nextData) {
        setChildDashboard((prev) => {
          const existingIds = new Set((prev.attendance?.items || []).map((i) => i.id));
          const merged = [
            ...(prev.attendance?.items || []),
            ...(nextData.items || []).filter((i) => !existingIds.has(i.id)),
          ];
          const updated = {
            ...prev,
            attendance: {
              ...prev.attendance,
              summary: nextData.summary || prev.attendance.summary,
              items: merged,
              pagination: nextData.pagination || prev.attendance.pagination,
            },
          };
          if (attendanceFilter === 'all') {
            childCacheRef.current.set(Number(selectedChildId), updated);
          }
          return updated;
        });
      }
    } catch (err) {
      pushToast(extractErrorMessage(err, 'تعذر تحميل المزيد من سجلات الحضور.', 'Failed to load more logs.', lang), 'error');
    } finally {
      setLoadingMoreAttendance(false);
    }
  };

  const handleLoadMoreExams = async () => {
    const pag = childDashboard.exams?.pagination;
    if (!selectedChildId || !pag || pag.currentPage >= pag.lastPage || loadingMoreExams) return;
    setLoadingMoreExams(true);
    try {
      const res = await parentApi.getChildExams(selectedChildId, {
        page: pag.currentPage + 1,
        per_page: pag.perPage || 30,
      });
      const nextData = res?.data;
      if (nextData) {
        setChildDashboard((prev) => {
          const existingIds = new Set((prev.exams?.items || []).map((i) => i.id));
          const merged = [
            ...(prev.exams?.items || []),
            ...(nextData.items || []).filter((i) => !existingIds.has(i.id)),
          ];
          const updated = {
            ...prev,
            exams: {
              ...prev.exams,
              summary: nextData.summary || prev.exams.summary,
              items: merged,
              pagination: nextData.pagination || prev.exams.pagination,
            },
          };
          childCacheRef.current.set(Number(selectedChildId), updated);
          return updated;
        });
      }
    } catch (err) {
      pushToast(extractErrorMessage(err, 'تعذر تحميل المزيد من نتائج الاختبارات.', 'Failed to load more exams.', lang), 'error');
    } finally {
      setLoadingMoreExams(false);
    }
  };

  const handleLoadMoreInquiries = async () => {
    if (loadingMoreInquiries || inquiriesPagination.currentPage >= inquiriesPagination.lastPage) return;
    setLoadingMoreInquiries(true);
    try {
      const res = await parentApi.listInquiries({
        page: inquiriesPagination.currentPage + 1,
        per_page: inquiriesPagination.perPage || 10,
      });
      const nextItems = Array.isArray(res?.data?.items) ? res.data.items : [];
      setInquiries((prev) => {
        const seen = new Set(prev.map((i) => i.id));
        return [...prev, ...nextItems.filter((i) => !seen.has(i.id))];
      });
      if (res?.data?.pagination) {
        setInquiriesPagination(res.data.pagination);
      }
    } catch (err) {
      pushToast(extractErrorMessage(err, 'تعذر تحميل المزيد من الاستفسارات.', 'Failed to load more inquiries.', lang), 'error');
    } finally {
      setLoadingMoreInquiries(false);
    }
  };

  // Actions
  const handleLinkSubmit = async (code) => {
    setLinkSubmitting(true);
    setLinkError('');
    try {
      const res = await parentApi.linkChild(code);
      const linked = res?.data;
      setShowLinkModal(false);
      pushToast(
        res?.message || (lang === 'ar' ? 'تم ربط حساب الطالب بنجاح!' : 'Student linked successfully!')
      );
      await loadOverview(linked?.id || null, { clearCache: true });
      return true;
    } catch (err) {
      setLinkError(
        extractErrorMessage(
          err,
          'تأكد من صحة كود الطالب أو رقم الباركود بالكارنيه.',
          'Please verify the student code or barcode.',
          lang
        )
      );
      return false;
    } finally {
      setLinkSubmitting(false);
    }
  };

  const handleUnlinkChild = async (studentId) => {
    setUnlinkingId(studentId);
    try {
      const res = await parentApi.unlinkChild(studentId);
      setConfirmUnlinkId(null);
      pushToast(
        res?.message || (lang === 'ar' ? 'تم فك ارتباط الطالب بنجاح.' : 'Student unlinked successfully.')
      );
      await loadOverview(null, { clearCache: true });
    } catch (err) {
      pushToast(
        extractErrorMessage(err, 'تعذر فك ارتباط الطالب.', 'Failed to unlink student.', lang),
        'error'
      );
    } finally {
      setUnlinkingId(null);
    }
  };

  const handleContactSubmit = async (payload) => {
    setContactSubmitting(true);
    setContactError('');
    try {
      const res = await parentApi.createInquiry(payload);
      setShowContactModal(false);
      pushToast(
        res?.message || (lang === 'ar' ? 'تم إرسال استفسارك بنجاح.' : 'Inquiry sent successfully.')
      );
      await loadInquiries();
      return true;
    } catch (err) {
      setContactError(
        extractErrorMessage(err, 'تعذر إرسال الاستفسار.', 'Could not send inquiry.', lang)
      );
      return false;
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleExportScorecard = async () => {
    if (!selectedChildId || exportingCsv) return;
    setExportingCsv(true);
    try {
      const code = activeChildSummary?.studentCode || `student-${selectedChildId}`;
      await parentApi.exportChildExamsCsv(selectedChildId, `scorecard-${code}.csv`);
      pushToast(lang === 'ar' ? 'تم تحميل كشف الدرجات بنجاح.' : 'Scorecard downloaded successfully.');
    } catch (err) {
      pushToast(
        extractErrorMessage(err, 'تعذر تحميل كشف الدرجات.', 'Failed to download scorecard.', lang),
        'error'
      );
    } finally {
      setExportingCsv(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsError('');
    try {
      const res = await parentApi.updateSettings({
        name: parentName.trim(),
        phone: parentPhone.trim(),
        email: parentEmail.trim(),
        emergency_phone: parentEmergencyPhone.trim() || null,
        notify_tuition_renewal: notifyTuitionRenewal,
        notify_achievements_certificates: notifyAchievementsCertificates,
      });
      if (res?.data) {
        hydrateParentSettings(res.data);
        if (typeof syncUserProfile === 'function') {
          syncUserProfile({
            name: res.data.name,
            nameAr: res.data.name,
            phone: res.data.phone,
            email: res.data.email,
          });
        }
      }
      pushToast(
        res?.message || (lang === 'ar' ? 'تم حفظ بيانات وإعدادات ولي الأمر بنجاح.' : 'Settings saved successfully.')
      );
    } catch (err) {
      setSettingsError(
        extractErrorMessage(err, 'تعذر حفظ التعديلات.', 'Could not save settings.', lang)
      );
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleToggleNotification = async (field, nextVal) => {
    if (savingToggleField === field) return;
    setSavingToggleField(field);
    if (field === 'notify_tuition_renewal') setNotifyTuitionRenewal(nextVal);
    if (field === 'notify_achievements_certificates') setNotifyAchievementsCertificates(nextVal);
    try {
      await parentApi.updateSettings({ [field]: nextVal });
      pushToast(lang === 'ar' ? 'تم تحديث تفضيل الإشعارات.' : 'Notification preference updated.');
    } catch (err) {
      if (field === 'notify_tuition_renewal') setNotifyTuitionRenewal(!nextVal);
      if (field === 'notify_achievements_certificates') setNotifyAchievementsCertificates(!nextVal);
      pushToast(
        extractErrorMessage(err, 'تعذر تحديث الإشعارات.', 'Failed to update preference.', lang),
        'error'
      );
    } finally {
      setSavingToggleField(null);
    }
  };

  // Auth / Role Guard UI (prevents spurious 401/403 API calls for guests or non-parent roles)
  if (authLoading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Loader2 size={28} color="var(--primary)" className="spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '520px', margin: '64px auto', padding: '0 20px' }}>
        <ParentEmptyState
          icon={ShieldAlert}
          title={lang === 'ar' ? 'يرجى تسجيل الدخول للوصول لبوابة ولي الأمر' : 'Sign in to access the Parent Portal'}
          subtitle={lang === 'ar'
            ? 'سجّل الدخول بحساب ولي الأمر لمتابعة حضور ودرجات وواجبات أبنائك.'
            : 'Log in with your parent account to monitor your children’s progress.'}
          action={
            <Link
              to="/login"
              style={{
                marginTop: '6px',
                padding: '10px 22px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '700',
              }}
            >
              {lang === 'ar' ? 'تسجيل الدخول' : 'Log In'}
            </Link>
          }
        />
      </div>
    );
  }

  if (currentRole !== 'parent') {
    const fallbackRoute = currentUser?.defaultRoute || `/${currentRole}/dashboard`;
    return (
      <div style={{ maxWidth: '520px', margin: '64px auto', padding: '0 20px' }}>
        <ParentEmptyState
          icon={ShieldAlert}
          title={lang === 'ar' ? 'هذه الصفحة مخصصة لحسابات أولياء الأمور فقط' : 'Parent accounts only'}
          subtitle={lang === 'ar'
            ? 'أنت مسجل الدخول حالياً بدور آخر. يمكنك العودة إلى لوحة التحكم الخاصة بك.'
            : 'You are currently signed in with a different role.'}
          action={
            <Link
              to={fallbackRoute}
              style={{
                marginTop: '6px',
                padding: '10px 22px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '700',
              }}
            >
              {lang === 'ar' ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '26px 20px 80px',
      fontFamily: isRtl ? 'var(--font-arabic, "Cairo", sans-serif)' : 'var(--font-sans, "Inter", sans-serif)',
    }}>
      {/* ══════════════════ HEADER ══════════════════ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '22px',
        flexWrap: 'wrap',
        gap: '14px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '99px',
              backgroundColor: 'var(--primary-surface, rgba(21, 136, 199, 0.1))',
              color: 'var(--primary)',
              fontWeight: '800',
            }}>
              {lang === 'ar' ? 'بوابة أولياء الأمور' : 'Parent Portal'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{
              fontSize: '22px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: 0,
              fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)',
            }}>
              {lang === 'ar' ? 'متابعة الأبناء' : 'Student Monitoring'}
            </h1>
            <InfoTooltip
              text={lang === 'ar'
                ? 'متابعة لحظية لدخول قاعات السنتر، نتائج الامتحانات، الواجبات، والمصروفات للأبناء المربوطين بحسابك.'
                : 'Real-time monitoring of gate check-ins, exams, homework, and tuition for your linked children.'}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <ChildSwitcher
            students={childrenList}
            selectedChild={selectedChildId}
            onSelectChild={handleSelectChild}
            lang={lang}
            onLinkNewChild={() => {
              setLinkError('');
              setShowLinkModal(true);
            }}
          />

          <button
            type="button"
            onClick={() => {
              setContactError('');
              setShowContactModal(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <Phone size={14} />
            <span>{lang === 'ar' ? 'تواصل مع السنتر' : 'Contact Center'}</span>
          </button>

          <button
            type="button"
            disabled={overviewLoading || childLoading}
            onClick={() => loadOverview(selectedChildId, { clearCache: true })}
            title={lang === 'ar' ? 'تحديث البيانات' : 'Refresh'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              cursor: overviewLoading || childLoading ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw size={15} className={overviewLoading || childLoading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* ══════════════════ TOAST BANNER ══════════════════ */}
      {toast.text && (
        <div style={{
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: toast.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(22, 163, 74, 0.1)',
          border: `1px solid ${toast.type === 'error' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(22, 163, 74, 0.25)'}`,
          color: toast.type === 'error' ? '#DC2626' : 'var(--success, #16A34A)',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* ══════════════════ OVERVIEW LOADING / ERROR ══════════════════ */}
      {overviewLoading ? (
        <div style={{
          padding: '64px 20px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}>
          <Loader2 size={28} color="var(--primary)" className="spin" />
          <span style={{ fontSize: '14px', fontWeight: '700' }}>
            {lang === 'ar' ? 'جاري تحميل بيانات الأبناء...' : 'Loading linked students...'}
          </span>
        </div>
      ) : overviewError ? (
        <div style={{
          padding: '24px 22px',
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#DC2626', fontWeight: '700', fontSize: '13.5px' }}>
            <AlertCircle size={18} />
            <span>{overviewError}</span>
          </div>
          <button
            type="button"
            onClick={() => loadOverview(selectedChildId, { clearCache: true })}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      ) : childrenList.length === 0 && activeTab !== 'settings' ? (
        <ParentEmptyState
          icon={UserPlus}
          title={lang === 'ar' ? 'لا يوجد أبناء مربوطون بحسابك حالياً' : 'No linked students yet'}
          subtitle={lang === 'ar'
            ? 'أضف كود الطالب أو رقم الباركود الموجود على كارنيه السنتر لبدء متابعة الحضور والامتحانات والواجبات والمصروفات.'
            : 'Enter your child’s student code or center barcode to track attendance, exams, homework, and fees.'}
          action={
            <button
              type="button"
              onClick={() => {
                setLinkError('');
                setShowLinkModal(true);
              }}
              style={{
                marginTop: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              <UserPlus size={15} />
              <span>{lang === 'ar' ? 'ربط طالب بالكود' : 'Link Student by Code'}</span>
            </button>
          }
        />
      ) : (
        <>
          {activeChildSummary && activeTab !== 'settings' && (
            <ChildSummaryCard activeChild={activeChildSummary} lang={lang} isRtl={isRtl} />
          )}

          {childError && activeTab !== 'settings' && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#DC2626',
              fontSize: '13px',
              fontWeight: '700',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
            }}>
              <span>{childError}</span>
              <button
                type="button"
                onClick={() => loadChildDashboard(selectedChildId, { force: true })}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '800', cursor: 'pointer' }}
              >
                {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
              </button>
            </div>
          )}

          {activeTab !== 'settings' && (childLoading || !hasCurrentChildData) ? (
            <div style={{
              padding: '48px 20px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              color: 'var(--text-secondary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}>
              <Loader2 size={24} color="var(--primary)" className="spin" />
              <span style={{ fontSize: '13px', fontWeight: '700' }}>
                {lang === 'ar' ? 'جاري تحميل تفاصيل الطالب...' : 'Loading student details...'}
              </span>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && activeChildSummary && (
                <ParentOverviewTab
                  key={`ov-${selectedChildId}`}
                  activeChild={activeChildSummary}
                  childDashboard={childDashboard}
                  lang={lang}
                  isRtl={isRtl}
                  onNavigateTab={handleTabChange}
                />
              )}

              {activeTab === 'courses' && (
                <ParentCoursesTab
                  key={`crs-${selectedChildId}`}
                  coursesData={childDashboard.courses}
                  lang={lang}
                />
              )}

              {activeTab === 'attendance' && (
                <ParentAttendanceTab
                  key={`att-${selectedChildId}`}
                  attendanceData={childDashboard.attendance}
                  statusFilter={attendanceFilter}
                  onChangeFilter={handleAttendanceFilterChange}
                  filterLoading={attendanceFilterLoading}
                  loadingMore={loadingMoreAttendance}
                  onLoadMore={handleLoadMoreAttendance}
                  lang={lang}
                  isRtl={isRtl}
                />
              )}

              {activeTab === 'exams' && (
                <ParentExamsTab
                  key={`ex-${selectedChildId}`}
                  examsData={childDashboard.exams}
                  exportingCsv={exportingCsv}
                  onExportCsv={handleExportScorecard}
                  loadingMore={loadingMoreExams}
                  onLoadMore={handleLoadMoreExams}
                  lang={lang}
                  isRtl={isRtl}
                />
              )}

              {activeTab === 'homework' && (
                <ParentHomeworkTab
                  key={`hw-${selectedChildId}`}
                  homeworkData={childDashboard.homework}
                  lang={lang}
                />
              )}

              {activeTab === 'financials' && (
                <ParentFinancialsTab
                  key={`fin-${selectedChildId}`}
                  financialsData={childDashboard.financials}
                  lang={lang}
                  isRtl={isRtl}
                />
              )}
            </>
          )}

          {activeTab === 'settings' && (
            <ParentSettingsTab
              lang={lang}
              parentName={parentName}
              setParentName={setParentName}
              parentPhone={parentPhone}
              setParentPhone={setParentPhone}
              parentEmergencyPhone={parentEmergencyPhone}
              setParentEmergencyPhone={setParentEmergencyPhone}
              parentEmail={parentEmail}
              setParentEmail={setParentEmail}
              notifyTuitionRenewal={notifyTuitionRenewal}
              notifyAchievementsCertificates={notifyAchievementsCertificates}
              settingsSaving={settingsSaving}
              settingsError={settingsError}
              savingToggleField={savingToggleField}
              onSaveSettings={handleSaveSettings}
              onToggleNotification={handleToggleNotification}
              onChangePassword={changePassword}
              childrenList={childrenList}
              confirmUnlinkId={confirmUnlinkId}
              setConfirmUnlinkId={setConfirmUnlinkId}
              unlinkingId={unlinkingId}
              onUnlinkChild={handleUnlinkChild}
              onOpenLinkModal={() => {
                setLinkError('');
                setShowLinkModal(true);
              }}
              inquiries={inquiries}
              inquiriesLoading={inquiriesLoading}
              inquiriesPagination={inquiriesPagination}
              loadingMoreInquiries={loadingMoreInquiries}
              onLoadMoreInquiries={handleLoadMoreInquiries}
              onOpenContactModal={() => {
                setContactError('');
                setShowContactModal(true);
              }}
            />
          )}
        </>
      )}

      {/* ══════════════════ MODALS ══════════════════ */}
      <LinkChildModal
        open={showLinkModal}
        lang={lang}
        onClose={() => setShowLinkModal(false)}
        onSubmit={handleLinkSubmit}
        submitting={linkSubmitting}
        error={linkError}
      />

      <ContactCenterModal
        key={selectedChildId || 'no-child'}
        open={showContactModal}
        lang={lang}
        activeChild={activeChildSummary}
        onClose={() => setShowContactModal(false)}
        onSubmit={handleContactSubmit}
        submitting={contactSubmitting}
        error={contactError}
      />
    </div>
  );
};
