import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Phone,
  Bell,
  Download,
  User as UserIcon,
  Save,
  Users,
  UserPlus,
  Trash2,
  RefreshCw,
  AlertCircle,
  Loader2,
  BookOpen,
  FileText,
  CreditCard,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { parentApi } from '../../services/parentApi';
import { InfoTooltip } from '../../components/common/InfoTooltip';
import { ParentAvatar } from '../../features/parent/ParentAvatar';
import { ChildSwitcher } from '../../features/parent/ChildSwitcher';
import { ChildSummaryCard } from '../../features/parent/ChildSummaryCard';
import { ParentOverviewTab } from '../../features/parent/ParentOverviewTab';
import { LinkChildModal, ContactCenterModal } from '../../features/parent/ParentModals';

const VALID_TABS = ['overview', 'courses', 'attendance', 'exams', 'homework', 'financials', 'settings'];

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

const EmptyBox = ({ icon: Icon, title, subtitle, action }) => (
  <div style={{
    padding: '38px 20px',
    textAlign: 'center',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--bg-app)',
    border: '1px dashed var(--border-medium)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  }}>
    <div style={{
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      backgroundColor: 'rgba(21, 136, 199, 0.1)',
      color: 'var(--primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Icon size={20} />
    </div>
    <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)' }}>{title}</div>
    {subtitle && (
      <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.5 }}>
        {subtitle}
      </div>
    )}
    {action}
  </div>
);

export const ParentDashboard = () => {
  const { lang, isRtl } = useLanguage();
  const {
    isAuthenticated,
    authLoading,
    currentRole,
    currentUser,
    syncUserProfile,
  } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const activeTab = VALID_TABS.includes(tabParam) ? tabParam : 'overview';

  const handleTabChange = useCallback((nextTab) => {
    setSearchParams({ tab: VALID_TABS.includes(nextTab) ? nextTab : 'overview' });
  }, [setSearchParams]);

  const isParentSession = Boolean(isAuthenticated && currentRole === 'parent');

  // Core overview state
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState('');
  const [childrenList, setChildrenList] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);

  // Per-child cache + monotonic sequence ref (eliminates race conditions & stale-child flashes)
  const childCacheRef = useRef(new Map());
  const childReqSeqRef = useRef(0);
  const selectedChildIdRef = useRef(null);

  // Active child full dashboard state
  const [childLoading, setChildLoading] = useState(false);
  const [childError, setChildError] = useState('');
  const [childDashboard, setChildDashboard] = useState(EMPTY_CHILD_DASHBOARD);

  // Filters & Load-More pagination states
  const [attendanceFilter, setAttendanceFilter] = useState('all');
  const [homeworkFilter, setHomeworkFilter] = useState('all');
  const [loadingMoreAttendance, setLoadingMoreAttendance] = useState(false);
  const [loadingMoreExams, setLoadingMoreExams] = useState(false);

  // Inquiries state
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);

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

  // Single-roundtrip initial load (overview + active child dashboard + inquiries in 1 HTTP call!)
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

      const resolvedActiveId = data.activeChildId
        ? Number(data.activeChildId)
        : list.length > 0
        ? Number(list[0].id)
        : null;

      selectedChildIdRef.current = resolvedActiveId;
      setSelectedChildId(resolvedActiveId);

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
      const res = await parentApi.listInquiries({ per_page: 10 });
      setInquiries(Array.isArray(res?.data?.items) ? res.data.items : []);
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
    setHomeworkFilter('all');
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

  const filteredAttendanceLogs = useMemo(() => {
    const logs = childDashboard.attendance?.items || [];
    if (attendanceFilter === 'all') return logs;
    return logs.filter((log) => log.status === attendanceFilter);
  }, [childDashboard.attendance, attendanceFilter]);

  const filteredHomeworkItems = useMemo(() => {
    const items = childDashboard.homework?.items || [];
    if (homeworkFilter === 'all') return items;
    return items.filter((item) => item.status === homeworkFilter);
  }, [childDashboard.homework, homeworkFilter]);

  // Pagination: Load more attendance / exams from server
  const handleLoadMoreAttendance = async () => {
    const pag = childDashboard.attendance?.pagination;
    if (!selectedChildId || !pag || pag.currentPage >= pag.lastPage || loadingMoreAttendance) return;
    setLoadingMoreAttendance(true);
    try {
      const res = await parentApi.getChildAttendance(selectedChildId, {
        page: pag.currentPage + 1,
        per_page: pag.perPage || 30,
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
          childCacheRef.current.set(Number(selectedChildId), updated);
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
        <EmptyBox
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
        <EmptyBox
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

  const attendancePagination = childDashboard.attendance?.pagination;
  const examsPagination = childDashboard.exams?.pagination;

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
        <EmptyBox
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
          {/* ══════════════════ ACTIVE CHILD SUMMARY CARD ══════════════════ */}
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
              {/* ══════════════════ TAB 1: OVERVIEW ══════════════════ */}
              {activeTab === 'overview' && activeChildSummary && (
                <ParentOverviewTab
                  activeChild={activeChildSummary}
                  childDashboard={childDashboard}
                  lang={lang}
                  isRtl={isRtl}
                  onNavigateTab={handleTabChange}
                />
              )}

              {/* ══════════════════ TAB 2: COURSES & SYLLABUS ══════════════════ */}
              {activeTab === 'courses' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      {lang === 'ar' ? 'المقررات ومعدل التقدم' : 'Enrolled Courses & Progress'}
                    </h3>
                    <InfoTooltip
                      text={lang === 'ar'
                        ? 'يعرض جميع المقررات والمجموعات النشطة المسجل بها الطالب ونسبة إتمام الحصص ومتوسط الدرجات.'
                        : 'Shows all active courses and study groups with lesson completion and average quiz scores.'}
                    />
                  </div>

                  {childDashboard.courses.items.length === 0 ? (
                    <EmptyBox
                      icon={BookOpen}
                      title={lang === 'ar' ? 'لم ينضم الطالب لأي مقرر أو مجموعة بعد' : 'No active courses or groups'}
                    />
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '18px' }}>
                      {childDashboard.courses.items.map((c) => (
                        <div
                          key={c.id}
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            borderRadius: 'var(--radius-xl)',
                            border: '1px solid var(--border-subtle)',
                            padding: '22px',
                            boxShadow: 'var(--shadow-sm)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <ParentAvatar
                                  src={c.teacherAvatar}
                                  name={c.teacherNameAr}
                                  size={46}
                                  border="2px solid var(--primary-light)"
                                />
                                <div>
                                  <h4 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                                    {lang === 'ar' ? c.nameAr : c.name}
                                  </h4>
                                  <div style={{ fontSize: '12.5px', color: 'var(--primary)', fontWeight: '700', marginTop: '2px' }}>
                                    {lang === 'ar' ? c.teacherNameAr : c.teacherName}
                                  </div>
                                  {c.teacherTitleAr && (
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                      {c.teacherTitleAr}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <span style={{
                                fontSize: '11px',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'rgba(21, 136, 199, 0.1)',
                                color: 'var(--primary)',
                                fontWeight: '800',
                              }}>
                                {c.room}
                              </span>
                            </div>

                            <div style={{
                              padding: '12px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'var(--bg-app)',
                              border: '1px solid var(--border-subtle)',
                              marginBottom: '14px',
                            }}>
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                                {lang === 'ar' ? 'آخر درس / جدول المجموعة:' : 'Latest lesson / schedule:'}
                              </div>
                              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                                {lang === 'ar' ? c.lastLessonAr : c.lastLesson}
                              </div>
                            </div>

                            <div style={{ marginBottom: '14px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'التقدم:' : 'Progress:'}</span>
                                <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                                  {c.completedLessons} / {c.totalLessons} ({c.progress}%)
                                </span>
                              </div>
                              <div style={{ height: '7px', borderRadius: '99px', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
                                <div style={{ width: `${c.progress}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '99px' }} />
                              </div>
                            </div>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '12px',
                            borderTop: '1px solid var(--border-subtle)',
                            fontSize: '12px',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success, #16A34A)' }}>
                              <CheckCircle2 size={14} />
                              <span>{lang === 'ar' ? `الحضور: ${c.attendance}` : `Attendance: ${c.attendance}`}</span>
                            </div>
                            <div style={{ fontWeight: '800', color: 'var(--primary)' }}>
                              {lang === 'ar' ? `المتوسط: ${c.avgScore}` : `Avg: ${c.avgScore}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ══════════════════ TAB 3: GATE ATTENDANCE LOG ══════════════════ */}
              {activeTab === 'attendance' && (
                <div style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-subtle)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                        {lang === 'ar' ? 'سجل الحضور بالسنتر' : 'Center Attendance Log'}
                      </h3>
                      <InfoTooltip
                        text={lang === 'ar'
                          ? 'رصد توقيت مسح باركود الطالب عند بوابة الدخول وحالة الحضور لكل حصة دراسية.'
                          : 'Timestamped gate barcode scans and session attendance status.'}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <select
                        value={attendanceFilter}
                        onChange={(e) => setAttendanceFilter(e.target.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-app)',
                          color: 'var(--text-primary)',
                          fontSize: '12.5px',
                          fontWeight: '700',
                        }}
                      >
                        <option value="all">{lang === 'ar' ? 'كل الحالات' : 'All Statuses'}</option>
                        <option value="present">{lang === 'ar' ? 'حاضر' : 'Present'}</option>
                        <option value="late">{lang === 'ar' ? 'متأخر' : 'Late'}</option>
                        <option value="absent">{lang === 'ar' ? 'غائب' : 'Absent'}</option>
                        <option value="excused">{lang === 'ar' ? 'بعذر' : 'Excused'}</option>
                      </select>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(22, 163, 74, 0.1)',
                        color: 'var(--color-success, #16A34A)',
                        fontSize: '12.5px',
                        fontWeight: '700',
                      }}>
                        <CheckCircle2 size={15} />
                        <span>
                          {lang === 'ar'
                            ? `نسبة الانضباط: ${childDashboard.attendance.summary.rate}%`
                            : `Punctuality: ${childDashboard.attendance.summary.rate}%`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {filteredAttendanceLogs.length === 0 ? (
                    <EmptyBox
                      icon={Clock}
                      title={lang === 'ar' ? 'لا توجد سجلات حضور مطابقة' : 'No matching attendance logs'}
                    />
                  ) : (
                    <>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                              <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                              <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'المادة والمعلم' : 'Subject & Teacher'}</th>
                              <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'القاعة' : 'Hall'}</th>
                              <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'وقت المسح' : 'Scan Time'}</th>
                              <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAttendanceLogs.map((log) => (
                              <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <td style={{ padding: '13px 12px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                                  {lang === 'ar' ? log.dateAr : log.date}
                                </td>
                                <td style={{ padding: '13px 12px', fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>
                                  {lang === 'ar' ? log.subjectAr : log.subjectEn}
                                </td>
                                <td style={{ padding: '13px 12px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                                  {log.roomAr}
                                </td>
                                <td style={{ padding: '13px 12px', fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={13} color="var(--primary)" />
                                    {lang === 'ar' ? log.scanTime : log.scanTimeEn}
                                  </span>
                                </td>
                                <td style={{ padding: '13px 12px' }}>
                                  <span style={{
                                    fontSize: '11.5px',
                                    fontWeight: '700',
                                    padding: '3px 10px',
                                    borderRadius: 'var(--radius-full)',
                                    backgroundColor: log.status === 'present'
                                      ? 'rgba(22, 163, 74, 0.12)'
                                      : log.status === 'absent'
                                      ? 'rgba(239, 68, 68, 0.12)'
                                      : 'rgba(245, 158, 11, 0.12)',
                                    color: log.status === 'present'
                                      ? 'var(--color-success, #16A34A)'
                                      : log.status === 'absent'
                                      ? '#DC2626'
                                      : '#D97706',
                                  }}>
                                    {lang === 'ar' ? log.statusAr : log.statusEn}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {attendancePagination && attendancePagination.currentPage < attendancePagination.lastPage && (
                        <div style={{ textAlign: 'center', marginTop: '16px' }}>
                          <button
                            type="button"
                            disabled={loadingMoreAttendance}
                            onClick={handleLoadMoreAttendance}
                            style={{
                              padding: '8px 18px',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-app)',
                              color: 'var(--primary)',
                              fontSize: '12.5px',
                              fontWeight: '700',
                              cursor: loadingMoreAttendance ? 'not-allowed' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            {loadingMoreAttendance && <Loader2 size={13} className="spin" />}
                            <span>{lang === 'ar' ? 'عرض المزيد من السجلات' : 'Load More Records'}</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ══════════════════ TAB 4: EXAM SCORECARDS ══════════════════ */}
              {activeTab === 'exams' && (
                <div style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-subtle)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                        {lang === 'ar' ? 'كشف درجات الاختبارات' : 'Exam Scorecards'}
                      </h3>
                      <InfoTooltip
                        text={lang === 'ar'
                          ? 'نتائج اختبارات الطالب مع الترتيب على الدفعة وملاحظات المعلم وإمكانية التحميل بصيغة CSV.'
                          : 'Graded exam results with cohort ranking, teacher remarks, and CSV download.'}
                      />
                    </div>

                    <button
                      type="button"
                      disabled={exportingCsv || childDashboard.exams.items.length === 0}
                      onClick={handleExportScorecard}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: exportingCsv || childDashboard.exams.items.length === 0 ? 'not-allowed' : 'pointer',
                        opacity: exportingCsv || childDashboard.exams.items.length === 0 ? 0.6 : 1,
                      }}
                    >
                      {exportingCsv ? <Loader2 size={14} className="spin" /> : <Download size={14} />}
                      <span>{lang === 'ar' ? 'تحميل كشف الدرجات (CSV)' : 'Download Scorecard (CSV)'}</span>
                    </button>
                  </div>

                  {childDashboard.exams.items.length === 0 ? (
                    <EmptyBox
                      icon={FileText}
                      title={lang === 'ar' ? 'لا توجد اختبارات مسجلة للطالب بعد' : 'No exam attempts recorded yet'}
                    />
                  ) : (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {childDashboard.exams.items.map((ex) => (
                          <div
                            key={ex.id}
                            style={{
                              padding: '18px 20px',
                              borderRadius: 'var(--radius-lg)',
                              backgroundColor: 'var(--bg-app)',
                              border: '1px solid var(--border-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '16px',
                            }}
                          >
                            <div style={{ flex: 1, minWidth: '250px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                <span style={{
                                  fontSize: '11px',
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: 'rgba(21, 136, 199, 0.1)',
                                  color: 'var(--primary)',
                                  fontWeight: '800',
                                }}>
                                  {lang === 'ar' ? ex.subjectAr : ex.subjectEn}
                                </span>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                  {ex.teacherAr}{ex.date ? ` • ${ex.date}` : ''}
                                </span>
                              </div>

                              <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                                {lang === 'ar' ? ex.titleAr : ex.titleEn}
                              </h4>

                              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                {lang === 'ar' ? 'التقييم:' : 'Note:'} <span style={{ color: 'var(--text-primary)' }}>&ldquo;{ex.notesAr}&rdquo;</span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                  {lang === 'ar' ? ex.rankAr : ex.rankEn}
                                </div>
                                <div style={{ fontSize: '19px', fontWeight: '900', color: 'var(--primary)' }}>
                                  {ex.score !== null ? `${ex.score} / ${ex.maxScore}` : '—'}
                                </div>
                              </div>

                              <div style={{
                                padding: '8px 14px',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: ex.isPassed === false ? 'rgba(239, 68, 68, 0.12)' : 'rgba(22, 163, 74, 0.12)',
                                color: ex.isPassed === false ? '#DC2626' : 'var(--color-success, #16A34A)',
                                fontSize: '15px',
                                fontWeight: '900',
                              }}>
                                {ex.percent}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {examsPagination && examsPagination.currentPage < examsPagination.lastPage && (
                        <div style={{ textAlign: 'center', marginTop: '16px' }}>
                          <button
                            type="button"
                            disabled={loadingMoreExams}
                            onClick={handleLoadMoreExams}
                            style={{
                              padding: '8px 18px',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-app)',
                              color: 'var(--primary)',
                              fontSize: '12.5px',
                              fontWeight: '700',
                              cursor: loadingMoreExams ? 'not-allowed' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            {loadingMoreExams && <Loader2 size={13} className="spin" />}
                            <span>{lang === 'ar' ? 'عرض المزيد من الاختبارات' : 'Load More Exams'}</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ══════════════════ TAB 5: HOMEWORK TRACKER ══════════════════ */}
              {activeTab === 'homework' && (
                <div style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-subtle)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                        {lang === 'ar' ? 'متابعة الواجبات' : 'Homework Tracker'}
                      </h3>
                      <InfoTooltip
                        text={lang === 'ar'
                          ? 'متابعة الواجبات المسندة للطالب وحالة التسليم والدرجات وملاحظات المعلم.'
                          : 'Track assigned, submitted, and graded homework with teacher remarks.'}
                      />
                    </div>

                    <select
                      value={homeworkFilter}
                      onChange={(e) => setHomeworkFilter(e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-app)',
                        color: 'var(--text-primary)',
                        fontSize: '12.5px',
                        fontWeight: '700',
                      }}
                    >
                      <option value="all">{lang === 'ar' ? `الكل (${childDashboard.homework.summary.total})` : `All (${childDashboard.homework.summary.total})`}</option>
                      <option value="pending">{lang === 'ar' ? `لم يُسلّم (${childDashboard.homework.summary.pending})` : `Pending (${childDashboard.homework.summary.pending})`}</option>
                      <option value="submitted">{lang === 'ar' ? `بانتظار التصحيح (${childDashboard.homework.summary.submitted})` : `Submitted (${childDashboard.homework.summary.submitted})`}</option>
                      <option value="graded">{lang === 'ar' ? `تم التصحيح (${childDashboard.homework.summary.graded})` : `Graded (${childDashboard.homework.summary.graded})`}</option>
                      <option value="rejected">{lang === 'ar' ? `إعادة تسليم (${childDashboard.homework.summary.rejected})` : `Rejected (${childDashboard.homework.summary.rejected})`}</option>
                    </select>
                  </div>

                  {filteredHomeworkItems.length === 0 ? (
                    <EmptyBox
                      icon={FileText}
                      title={lang === 'ar' ? 'لا توجد واجبات مطابقة حالياً' : 'No homework assignments found'}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {filteredHomeworkItems.map((hw) => (
                        <div
                          key={hw.id}
                          style={{
                            padding: '18px 20px',
                            borderRadius: 'var(--radius-lg)',
                            backgroundColor: 'var(--bg-app)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '14px',
                          }}
                        >
                          <div style={{ flex: 1, minWidth: '250px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                              <span style={{
                                fontSize: '11px',
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'rgba(21, 136, 199, 0.1)',
                                color: 'var(--primary)',
                                fontWeight: '800',
                              }}>
                                {hw.subjectAr}
                              </span>
                              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                {hw.teacherAr} • {hw.deadlineAr}
                              </span>
                            </div>

                            <h4 style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                              {hw.titleAr}
                            </h4>

                            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                              {hw.notesAr}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {hw.earnedScore !== null && (
                              <div style={{ fontSize: '17px', fontWeight: '900', color: 'var(--color-success, #16A34A)' }}>
                                {hw.earnedScore} / {hw.maxScore}
                              </div>
                            )}

                            <span style={{
                              fontSize: '12px',
                              fontWeight: '700',
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: hw.status === 'graded'
                                ? 'rgba(22, 163, 74, 0.12)'
                                : hw.status === 'submitted'
                                ? 'rgba(21, 136, 199, 0.12)'
                                : hw.status === 'rejected' || hw.isOverdue
                                ? 'rgba(239, 68, 68, 0.12)'
                                : 'rgba(245, 158, 11, 0.12)',
                              color: hw.status === 'graded'
                                ? 'var(--color-success, #16A34A)'
                                : hw.status === 'submitted'
                                ? 'var(--primary)'
                                : hw.status === 'rejected' || hw.isOverdue
                                ? '#DC2626'
                                : '#D97706',
                            }}>
                              {lang === 'ar' ? hw.statusAr : hw.statusEn}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ══════════════════ TAB 6: FINANCIALS & INVOICES ══════════════════ */}
              {activeTab === 'financials' && (
                <div style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-subtle)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                        {lang === 'ar' ? 'المصروفات والإيصالات' : 'Tuition & Payment Receipts'}
                      </h3>
                      <InfoTooltip
                        text={lang === 'ar'
                          ? 'ملخص المدفوعات المسددة والمستحقات المفتوحة وباقة الطالب الحالية.'
                          : 'Overview of confirmed tuition payments, pending dues, and active student plan.'}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <div style={{
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'rgba(22, 163, 74, 0.08)',
                        border: '1px solid rgba(22, 163, 74, 0.2)',
                      }}>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                          {lang === 'ar' ? 'إجمالي المسدد' : 'Total Paid'}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--success, #16A34A)' }}>
                          {Number(childDashboard.financials.summary.totalPaidEgp || 0).toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
                        </div>
                      </div>

                      {Number(childDashboard.financials.summary.dueAmountEgp || 0) > 0 && (
                        <div style={{
                          padding: '8px 14px',
                          borderRadius: 'var(--radius-lg)',
                          backgroundColor: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                        }}>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                            {lang === 'ar' ? 'مستحق السداد' : 'Outstanding Due'}
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: '900', color: '#DC2626' }}>
                            {Number(childDashboard.financials.summary.dueAmountEgp).toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
                          </div>
                        </div>
                      )}

                      <div style={{
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--primary-surface, rgba(21, 136, 199, 0.08))',
                        border: '1px solid var(--border-subtle)',
                      }}>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                          {lang === 'ar' ? 'باقة الطالب' : 'Student Plan'}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)' }}>
                          {lang === 'ar'
                            ? childDashboard.financials.summary.activePlanAr
                            : childDashboard.financials.summary.activePlanEn}
                        </div>
                      </div>
                    </div>
                  </div>

                  {childDashboard.financials.invoices.length === 0 ? (
                    <EmptyBox
                      icon={CreditCard}
                      title={lang === 'ar' ? 'لا توجد فواتير أو مدفوعات مسجلة حتى الآن' : 'No payment records yet'}
                    />
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'رقم الإيصال' : 'Receipt'}</th>
                            <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                            <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'البيان' : 'Description'}</th>
                            <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'طريقة السداد' : 'Method'}</th>
                            <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                            <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {childDashboard.financials.invoices.map((inv) => (
                            <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                              <td style={{ padding: '13px 12px', fontSize: '12.5px', fontWeight: '800', color: 'var(--primary)' }}>
                                {inv.receiptNo}
                              </td>
                              <td style={{ padding: '13px 12px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                                {inv.date || '—'}
                              </td>
                              <td style={{ padding: '13px 12px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                                {lang === 'ar' ? inv.descriptionAr : inv.descriptionEn}
                              </td>
                              <td style={{ padding: '13px 12px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                                {lang === 'ar' ? inv.methodAr : inv.methodEn}
                              </td>
                              <td style={{ padding: '13px 12px', fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                                {inv.amountFormatted}
                              </td>
                              <td style={{ padding: '13px 12px' }}>
                                <span style={{
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  padding: '3px 8px',
                                  borderRadius: 'var(--radius-full)',
                                  backgroundColor: inv.status === 'paid'
                                    ? 'rgba(22, 163, 74, 0.12)'
                                    : inv.status === 'overdue' || inv.status === 'rejected' || inv.status === 'failed'
                                    ? 'rgba(239, 68, 68, 0.12)'
                                    : 'rgba(245, 158, 11, 0.12)',
                                  color: inv.status === 'paid'
                                    ? 'var(--color-success, #16A34A)'
                                    : inv.status === 'overdue' || inv.status === 'rejected' || inv.status === 'failed'
                                    ? '#DC2626'
                                    : '#D97706',
                                }}>
                                  {lang === 'ar' ? inv.statusAr : inv.statusEn}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ══════════════════ TAB 7: SETTINGS, LINKED CHILDREN & INQUIRIES ══════════════════ */}
          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Parent Profile Form */}
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <UserIcon size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                    {lang === 'ar' ? 'بيانات ولي الأمر' : 'Parent Profile'}
                  </h3>
                  <InfoTooltip
                    text={lang === 'ar'
                      ? 'تُستخدم هذه البيانات للتواصل المباشر مع إدارة السنتر والمعلمين وإرسال التقارير.'
                      : 'Used by centers and teachers to contact you and dispatch reports.'}
                  />
                </div>

                {settingsError && (
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#DC2626',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    marginBottom: '14px',
                  }}>
                    {settingsError}
                  </div>
                )}

                <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                        {lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                      </label>
                      <input
                        type="text"
                        required
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-app)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                        {lang === 'ar' ? 'رقم الهاتف الأساسي' : 'Primary Phone'}
                      </label>
                      <input
                        type="tel"
                        dir="ltr"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-app)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                        {lang === 'ar' ? 'هاتف الطوارئ (اختياري)' : 'Emergency Phone'}
                      </label>
                      <input
                        type="tel"
                        dir="ltr"
                        value={parentEmergencyPhone}
                        onChange={(e) => setParentEmergencyPhone(e.target.value)}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-app)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                        {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      <input
                        type="email"
                        required
                        dir="ltr"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-app)',
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={settingsSaving}
                    style={{
                      alignSelf: 'flex-start',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 22px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: settingsSaving ? 'not-allowed' : 'pointer',
                      opacity: settingsSaving ? 0.7 : 1,
                    }}
                  >
                    {settingsSaving ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
                    <span>{lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}</span>
                  </button>
                </form>
              </div>

              {/* Notification Preferences */}
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Bell size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                    {lang === 'ar' ? 'تفضيلات الإشعارات' : 'Notification Preferences'}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    {
                      field: 'notify_tuition_renewal',
                      titleAr: 'إشعارات تجديد الاشتراكات وسداد الإيصالات',
                      titleEn: 'Tuition renewal and payment receipt alerts',
                      value: notifyTuitionRenewal,
                    },
                    {
                      field: 'notify_achievements_certificates',
                      titleAr: 'إشعار فوري عند تحقيق إنجاز أو شهادة تقدير للطالب',
                      titleEn: 'Instant alert on achievements, trophies, or certificates',
                      value: notifyAchievementsCertificates,
                    },
                  ].map((item) => (
                    <label
                      key={item.field}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '14px',
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--bg-app)',
                        border: '1px solid var(--border-subtle)',
                        cursor: savingToggleField === item.field ? 'wait' : 'pointer',
                        opacity: savingToggleField === item.field ? 0.7 : 1,
                      }}
                    >
                      <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {lang === 'ar' ? item.titleAr : item.titleEn}
                      </span>
                      <input
                        type="checkbox"
                        disabled={savingToggleField === item.field}
                        checked={item.value}
                        onChange={(e) => handleToggleNotification(item.field, e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Linked Students Management */}
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="var(--primary)" />
                    <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      {lang === 'ar' ? 'الأبناء المربوطون بالحساب' : 'Linked Students'}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setLinkError('');
                      setShowLinkModal(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
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
                    <UserPlus size={14} />
                    <span>{lang === 'ar' ? 'ربط طالب جديد' : 'Link Student'}</span>
                  </button>
                </div>

                {childrenList.length === 0 ? (
                  <EmptyBox
                    icon={Users}
                    title={lang === 'ar' ? 'لم يتم ربط أي طالب بعد' : 'No linked students yet'}
                  />
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    {childrenList.map((ch) => (
                      <div
                        key={ch.id}
                        style={{
                          padding: '16px',
                          borderRadius: 'var(--radius-lg)',
                          backgroundColor: 'var(--bg-app)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <ParentAvatar src={ch.avatar} name={ch.nameAr || ch.name} size={42} />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                              {lang === 'ar' ? ch.nameAr : ch.name}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                              {lang === 'ar' ? ch.gradeAr : ch.grade} • {ch.studentCode}
                            </div>
                          </div>
                        </div>

                        {confirmUnlinkId === ch.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              type="button"
                              disabled={unlinkingId === ch.id}
                              onClick={() => handleUnlinkChild(ch.id)}
                              style={{
                                padding: '5px 10px',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: '#DC2626',
                                color: '#FFFFFF',
                                border: 'none',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                cursor: 'pointer',
                              }}
                            >
                              {lang === 'ar' ? 'تأكيد' : 'Confirm'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmUnlinkId(null)}
                              style={{
                                padding: '5px 8px',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'transparent',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border-subtle)',
                                fontSize: '11.5px',
                                cursor: 'pointer',
                              }}
                            >
                              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            title={lang === 'ar' ? 'فك ارتباط الطالب' : 'Unlink student'}
                            onClick={() => setConfirmUnlinkId(ch.id)}
                            style={{
                              padding: '6px 9px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'rgba(239, 68, 68, 0.08)',
                              color: '#DC2626',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11.5px',
                              fontWeight: '700',
                            }}
                          >
                            <Trash2 size={13} />
                            <span>{lang === 'ar' ? 'فك الربط' : 'Unlink'}</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sent Inquiries History */}
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={18} color="var(--primary)" />
                    <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      {lang === 'ar' ? 'سجل الاستفسارات المرسلة' : 'Sent Inquiries'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setContactError('');
                      setShowContactModal(true);
                    }}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--primary)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    {lang === 'ar' ? 'استفسار جديد +' : 'New Inquiry +'}
                  </button>
                </div>

                {inquiriesLoading ? (
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                  </div>
                ) : inquiries.length === 0 ? (
                  <EmptyBox
                    icon={MessageSquare}
                    title={lang === 'ar' ? 'لم ترسل أي استفسارات بعد' : 'No inquiries sent yet'}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        style={{
                          padding: '14px 16px',
                          borderRadius: 'var(--radius-lg)',
                          backgroundColor: 'var(--bg-app)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                            {inq.subject}
                          </span>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '99px',
                            backgroundColor: inq.status === 'replied' ? 'rgba(22, 163, 74, 0.12)' : 'rgba(21, 136, 199, 0.12)',
                            color: inq.status === 'replied' ? 'var(--color-success, #16A34A)' : 'var(--primary)',
                          }}>
                            {inq.statusAr}
                          </span>
                        </div>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {inq.message}
                        </div>
                        {inq.replyText && (
                          <div style={{
                            marginTop: '8px',
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            fontSize: '12px',
                            color: 'var(--text-primary)',
                          }}>
                            <strong>{lang === 'ar' ? 'الرد:' : 'Reply:'}</strong> {inq.replyText}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
