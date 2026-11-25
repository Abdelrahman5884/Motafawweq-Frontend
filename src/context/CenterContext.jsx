import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useGroups } from './GroupsContext';
import { useAuth } from './AuthContext';
import { tokenStorage } from '../services/api';
import { centerApi } from '../services/centerApi';
import { hasCenterFeatureAccess } from '../constants/centerPlanFeatures';

const CenterContext = createContext(null);

const AUDIT_EVENT_LABELS = {
  'center.branch.created': 'إنشاء وتدشين فرع جديد',
  'center.branch.updated': 'تحديث بيانات فرع',
  'center.branch.deleted': 'حذف فرع من السنتر',
  'center.room.created': 'إضافة قاعة دراسية جديدة',
  'center.room.updated': 'تعديل بيانات قاعة دراسية',
  'center.room.deleted': 'حذف قاعة دراسية',
  'center.teacher.created': 'إضافة مدرس جديد واعتماده',
  'center.teacher.invited': 'إرسال دعوة لمعلم منصة متفوّق',
  'center.teacher.invite_accepted': 'قبول معلم المنصة لدعوة الانضمام',
  'center.teacher.invite_declined': 'رفض معلم المنصة لدعوة الانضمام',
  'center.teacher.updated': 'تحديث بيانات مدرس',
  'center.teacher.deleted': 'فك ارتباط مدرس بالسنتر',
  'center.teacher.invite_resent': 'إعادة إرسال دعوة لمعلم',
  'center.connect.user_linked': 'ربط حساب مستخدم بالسنتر (Motafawweq Connect)',
  'center.connect.user_unlinked': 'فك ربط حساب مستخدم من السنتر',
  'center.staff.created': 'تعيين موظف جديد بالسنتر',
  'center.staff.updated': 'تحديث صلاحيات موظف',
  'center.staff.deleted': 'إلغاء تعيين موظف',
  'center.group.created': 'إنشاء مجموعة دراسية جديدة',
  'center.group.updated': 'تحديث جدول وبيانات مجموعة',
  'center.group.deleted': 'حذف مجموعة دراسية',
  'center.group.code_regenerated': 'تجديد كود الانضمام للمجموعة',
  'center.group.student_enrolled': 'تسجيل طالب بالمجموعة وإصدار الباركود',
  'center.group.student_accepted': 'قبول طلب انضمام طالب للمجموعة',
  'center.group.student_rejected': 'رفض طلب انضمام طالب',
  'center.group.student_removed': 'إلغاء قيد طالب من المجموعة',
  'center.group.payment_updated': 'تحديث حالة سداد اشتراك طالب',
  'center.attendance.scanned': 'تسجيل حضور طالب بمسح الباركود',
  'center.attendance.toggled': 'تحديث حالة حضور طالب يدوياً',
  'center.attendance.smart_gate_matched': 'تسجيل حضور تلقائي عبر بوابة المسح الذكي',
  'center.attendance.absence_alert_sent': 'إرسال تنبيه غياب فوري لولي الأمر',
  'center.financials.expense_created': 'تسجيل سند صرف مصروف تشغيلي',
  'center.financials.expense_deleted': 'حذف سند مصروف',
  'center.financials.settlement_approved': 'اعتماد وصرف تسوية مستحقات مدرس',
  'center.financials.due_reminded': 'إرسال تذكير سداد متأخرات لطالب',
  'center.financials.due_marked_paid': 'تحصيل متأخرات طالب وتسويتها',
  'center.billing.subscribed': 'تفعيل أو ترقية باقة اشتراك السنتر',
  'center.billing.cancelled': 'إلغاء باقة اشتراك السنتر المدفوعة',
  'center.settings.updated': 'تحديث بيانات وسياسات السنتر',
  'center.settings.avatar_updated': 'تحديث شعار السنتر',
  'center.settings.avatar_deleted': 'حذف شعار السنتر',
  'center.settings.kpis_updated': 'تحديث مستهدفات مؤشرات الأداء (KPIs)',
  'center.settings.task_created': 'إسناد مهمة إدارية جديدة',
  'center.settings.task_updated': 'تحديث مهمة إدارية',
  'center.settings.task_toggled': 'تغيير حالة إنجاز مهمة إدارية',
  'center.settings.task_deleted': 'حذف مهمة إدارية',
  'center.settings.announcement_created': 'نشر إعلان أو تعميم داخلي',
  'center.settings.announcement_deleted': 'حذف إعلان داخلي',
  'center.settings.students_imported': 'استيراد دفعة طلاب مجمعة',
  'center.settings.backup_created': 'إنشاء نسخة احتياطية سحابية مشفرة',
  'center.queue.item_completed': 'إنهاء حصة من طابور التشغيل اليومي',
  'center.queue.item_restored': 'إعادة حصة إلى طابور التشغيل اليومي',
  'center.queue.reset': 'إعادة ضبط طابور الحصص اليومي',
  'center.idor_attempt_blocked': 'حظر محاولة وصول غير مصرح بها (IDOR)',
};

const EMPTY_ATTENDANCE_SUMMARY = {
  scannedPresentCount: 0,
  lateCount: 0,
  absentCount: 0,
  complianceRatePct: 0,
};

const EMPTY_DUES_STATE = {
  totalDuesEgp: 0,
  count: 0,
  items: [],
};

const EMPTY_AUDIT_META = {
  currentPage: 1,
  perPage: 15,
  total: 0,
  lastPage: 1,
  from: 0,
  to: 0,
  hasMore: false,
};

function normalizeAuditMeta(meta, itemCount = 0) {
  if (!meta || typeof meta !== 'object') {
    return {
      ...EMPTY_AUDIT_META,
      total: itemCount,
      from: itemCount > 0 ? 1 : 0,
      to: itemCount,
    };
  }
  const currentPage = Number(meta.current_page ?? meta.currentPage ?? 1) || 1;
  const perPage = Number(meta.per_page ?? meta.perPage ?? 15) || 15;
  const total = Number(meta.total ?? itemCount) || 0;
  const lastPage = Math.max(1, Number(meta.last_page ?? meta.lastPage ?? Math.ceil(total / perPage)) || 1);
  const from = Number(meta.from ?? (total > 0 ? (currentPage - 1) * perPage + 1 : 0)) || 0;
  const to = Number(meta.to ?? (total > 0 ? Math.min(total, from + Math.max(0, itemCount - 1)) : 0)) || 0;
  return {
    currentPage,
    perPage,
    total,
    lastPage,
    from,
    to,
    hasMore: Boolean(meta.has_more ?? meta.hasMore ?? currentPage < lastPage),
  };
}

const AUTH_REQUIRED_MESSAGE = 'يرجى تسجيل الدخول بحساب سنتر مفعل أولاً.';

function formatAuditLogItem(log, centerName = 'إدارة السنتر') {
  if (log?.actionAr && log?.detailsAr) return log;
  const eventKey = String(log?.event || '');
  const ctx = log?.context && typeof log.context === 'object' ? log.context : {};
  const actionAr = AUDIT_EVENT_LABELS[eventKey] || eventKey || 'عملية نظام';

  const detailsParts = [];
  if (ctx.name_ar) detailsParts.push(`الاسم: ${ctx.name_ar}`);
  if (ctx.receipt_number) detailsParts.push(`سند: ${ctx.receipt_number}`);
  if (ctx.amount_egp !== undefined) detailsParts.push(`المبلغ: ${ctx.amount_egp} ج.م`);
  if (ctx.teacher_share_egp !== undefined) detailsParts.push(`مستحق المدرس: ${ctx.teacher_share_egp} ج.م`);
  if (ctx.plan_tier) detailsParts.push(`الباقة: ${String(ctx.plan_tier).toUpperCase()}`);
  if (ctx.group_uuid) detailsParts.push(`مجموعة: ${String(ctx.group_uuid).slice(0, 8)}`);
  if (ctx.barcode) detailsParts.push(`باركود: ${ctx.barcode}`);
  if (ctx.imported_count !== undefined) detailsParts.push(`عدد المستوردين: ${ctx.imported_count}`);
  if (ctx.filename) detailsParts.push(`الملف: ${ctx.filename}`);

  const rawDate = log?.createdAt || log?.created_at || '';
  const timestamp = rawDate
    ? new Date(rawDate).toLocaleString('ar-EG', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'الآن';

  return {
    id: log?.id || `log-${eventKey}`,
    event: eventKey,
    level: log?.level || 'info',
    actionAr,
    userAr: centerName,
    detailsAr: detailsParts.length > 0 ? detailsParts.join(' • ') : `كود العملية: ${eventKey}`,
    timestamp,
    createdAt: rawDate,
  };
}

export const CenterProvider = ({ children }) => {
  const { currentUser, isAuthenticated, authLoading, centerPlanTier, refreshUser } = useAuth();
  const { groups, refreshGroups, showToast } = useGroups();

  const isBackendCenter =
    !authLoading &&
    isAuthenticated &&
    Boolean(tokenStorage.getAccessToken()) &&
    currentUser?.role === 'center';

  const [selectedBranchId, setSelectedBranchId] = useState('all');
  const [centerLoading, setCenterLoading] = useState(false);

  // Core Entities State (strictly empty until hydrated from API — zero static mock data)
  const [branches, setBranches] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [centerTeachers, setCenterTeachers] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLogsMeta, setAuditLogsMeta] = useState(EMPTY_AUDIT_META);
  const [auditLogsLoading, setAuditLogsLoading] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState(EMPTY_ATTENDANCE_SUMMARY);
  const [globalPlatformUsers, setGlobalPlatformUsers] = useState([]);

  // Financials ERP State
  const [expenses, setExpenses] = useState([]);
  const [remoteFinancialSummary, setRemoteFinancialSummary] = useState(null);
  const [teacherSettlements, setTeacherSettlements] = useState([]);
  const [outstandingDues, setOutstandingDues] = useState(EMPTY_DUES_STATE);

  // Dashboard & Live Queue State
  const [dashboardData, setDashboardData] = useState(null);
  const [executiveReport, setExecutiveReport] = useState(null);

  // Billing State
  const [billingData, setBillingData] = useState(null);

  // Settings, Tasks, Announcements & Backups State
  const [centerSettings, setCenterSettings] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [backups, setBackups] = useState([]);

  const dashboardSeqRef = useRef(0);
  const auditSeqRef = useRef(0);

  const resetAllCenterState = useCallback(() => {
    setSelectedBranchId('all');
    setBranches([]);
    setRooms([]);
    setCenterTeachers([]);
    setConnectedUsers([]);
    setStaff([]);
    setAuditLogs([]);
    setAuditLogsMeta(EMPTY_AUDIT_META);
    setAuditLogsLoading(false);
    setAttendanceRecords([]);
    setAttendanceSummary(EMPTY_ATTENDANCE_SUMMARY);
    setGlobalPlatformUsers([]);
    setExpenses([]);
    setRemoteFinancialSummary(null);
    setTeacherSettlements([]);
    setOutstandingDues(EMPTY_DUES_STATE);
    setDashboardData(null);
    setExecutiveReport(null);
    setBillingData(null);
    setCenterSettings(null);
    setTasks([]);
    setAnnouncements([]);
    setBackups([]);
  }, []);

  // Reset immediately on sign-out, non-center role, or account change to prevent cross-account leakage
  useEffect(() => {
    resetAllCenterState();
  }, [isBackendCenter, currentUser?.id, resetAllCenterState]);

  const assertBackendCenter = useCallback(() => {
    if (!isBackendCenter) {
      throw new Error(AUTH_REQUIRED_MESSAGE);
    }
  }, [isBackendCenter]);

  const refreshAuditLogs = useCallback(
    async ({ page = 1, perPage = 15, level = 'all', search = '' } = {}) => {
      if (!isBackendCenter || !hasCenterFeatureAccess(centerPlanTier, 'audit_logs')) return null;
      const seq = ++auditSeqRef.current;
      setAuditLogsLoading(true);
      try {
        const queryParams = {
          page: Math.max(1, Number(page) || 1),
          per_page: Math.min(100, Math.max(5, Number(perPage) || 15)),
        };
        if (level && level !== 'all') {
          queryParams.level = level;
        }
        const trimmedSearch = String(search || '').trim();
        if (trimmedSearch) {
          queryParams.search = trimmedSearch;
        }

        const res = await centerApi.staff.listAuditLogs(queryParams);
        if (seq !== auditSeqRef.current) return null;

        if (Array.isArray(res?.data)) {
          const cName = centerSettings?.nameAr || currentUser?.nameAr || 'إدارة السنتر';
          const formatted = res.data.map((l) => formatAuditLogItem(l, cName));
          const normalizedMeta = normalizeAuditMeta(res?.meta, formatted.length);
          setAuditLogs(formatted);
          setAuditLogsMeta(normalizedMeta);
          return { items: formatted, meta: normalizedMeta };
        }
        return null;
      } catch {
        return null;
      } finally {
        if (seq === auditSeqRef.current) {
          setAuditLogsLoading(false);
        }
      }
    },
    [isBackendCenter, centerPlanTier, centerSettings, currentUser]
  );

  // ─── Lightweight Core Hydration (Only 4 safe endpoints on mount — zero 403s) ─
  const loadCoreCenterData = useCallback(async () => {
    if (!isBackendCenter) return;
    const [branchesRes, roomsRes, teachersRes, settingsRes] = await Promise.all([
      centerApi.branches.list().catch(() => null),
      centerApi.rooms.list().catch(() => null),
      centerApi.teachers.list().catch(() => null),
      centerApi.settings.get().catch(() => null),
    ]);

    if (Array.isArray(branchesRes?.data)) setBranches(branchesRes.data);
    if (Array.isArray(roomsRes?.data)) setRooms(roomsRes.data);
    if (Array.isArray(teachersRes?.data)) setCenterTeachers(teachersRes.data);
    if (settingsRes?.data) setCenterSettings(settingsRes.data);
  }, [isBackendCenter]);

  // ─── On-Demand Section Loaders ──────────────────────────────────────────────
  const loadOperationsData = useCallback(async () => {
    if (!isBackendCenter) return;
    const canViewStaff = hasCenterFeatureAccess(centerPlanTier, 'staff_management');
    const canViewAudit = hasCenterFeatureAccess(centerPlanTier, 'audit_logs');

    const [connectedRes, staffRes, auditRes] = await Promise.all([
      centerApi.connect.listUsers().catch(() => null),
      canViewStaff ? centerApi.staff.list().catch(() => null) : Promise.resolve(null),
      canViewAudit ? centerApi.staff.listAuditLogs({ page: 1, per_page: 15 }).catch(() => null) : Promise.resolve(null),
    ]);
    if (Array.isArray(connectedRes?.data)) setConnectedUsers(connectedRes.data);
    if (canViewStaff && Array.isArray(staffRes?.data)) {
      setStaff(staffRes.data);
    } else if (!canViewStaff) {
      setStaff([]);
    }
    if (canViewAudit && Array.isArray(auditRes?.data)) {
      const cName = centerSettings?.nameAr || currentUser?.nameAr || 'إدارة السنتر';
      const formatted = auditRes.data.map((l) => formatAuditLogItem(l, cName));
      setAuditLogs(formatted);
      setAuditLogsMeta(normalizeAuditMeta(auditRes?.meta, formatted.length));
    } else if (!canViewAudit) {
      setAuditLogs([]);
      setAuditLogsMeta(EMPTY_AUDIT_META);
    }
  }, [isBackendCenter, centerPlanTier, centerSettings, currentUser]);

  const loadAttendanceData = useCallback(async () => {
    if (!isBackendCenter) return;
    const attendanceRes = await centerApi.attendance.listRecords().catch(() => null);
    if (attendanceRes?.data) {
      if (Array.isArray(attendanceRes.data.records)) {
        setAttendanceRecords(attendanceRes.data.records);
      }
      if (attendanceRes.data.summary) {
        setAttendanceSummary(attendanceRes.data.summary);
      }
    }
  }, [isBackendCenter]);

  const loadFinancialsData = useCallback(
    async (tierOverride = null) => {
      if (!isBackendCenter) return;
      const tier = tierOverride || centerPlanTier || 'free';
      if (tier !== 'plus' && tier !== 'pro') {
        setRemoteFinancialSummary(null);
        setExpenses([]);
        setTeacherSettlements([]);
        setOutstandingDues(EMPTY_DUES_STATE);
        return;
      }

      const [finOverviewRes, expensesRes, settlementsRes, duesRes] = await Promise.all([
        centerApi.financials.getOverview().catch(() => null),
        centerApi.financials.listExpenses().catch(() => null),
        centerApi.financials.listSettlements().catch(() => null),
        centerApi.financials.listDues().catch(() => null),
      ]);

      if (finOverviewRes?.data?.summary) {
        setRemoteFinancialSummary(finOverviewRes.data.summary);
      }
      if (Array.isArray(expensesRes?.data)) {
        setExpenses(expensesRes.data);
      }
      if (Array.isArray(settlementsRes?.data)) {
        setTeacherSettlements(settlementsRes.data);
      }
      if (duesRes?.data) {
        setOutstandingDues(duesRes.data);
      }
    },
    [isBackendCenter, centerPlanTier]
  );

  const loadBillingData = useCallback(async () => {
    if (!isBackendCenter) return;
    const billingRes = await centerApi.billing.getSummary().catch(() => null);
    if (billingRes?.data) {
      setBillingData(billingRes.data);
    }
  }, [isBackendCenter]);

  const loadSettingsData = useCallback(
    async (tierOverride = null) => {
      if (!isBackendCenter) return;
      const tier = tierOverride || centerPlanTier || 'free';
      const [settingsRes, tasksRes, announcementsRes] = await Promise.all([
        centerApi.settings.get().catch(() => null),
        centerApi.settings.listTasks().catch(() => null),
        centerApi.settings.listAnnouncements().catch(() => null),
      ]);

      if (settingsRes?.data) setCenterSettings(settingsRes.data);
      if (Array.isArray(tasksRes?.data)) setTasks(tasksRes.data);
      if (Array.isArray(announcementsRes?.data)) setAnnouncements(announcementsRes.data);

      if (tier === 'pro') {
        const backupsRes = await centerApi.settings.listBackups().catch(() => null);
        if (Array.isArray(backupsRes?.data)) {
          setBackups(backupsRes.data);
        }
      } else {
        setBackups([]);
      }
    },
    [isBackendCenter, centerPlanTier]
  );

  const refreshCenterData = useCallback(
    async (tierOverride = null) => {
      if (!isBackendCenter) return;
      setCenterLoading(true);
      try {
        await Promise.all([
          loadCoreCenterData(),
          loadOperationsData(),
          loadBillingData(),
          loadFinancialsData(tierOverride),
          loadSettingsData(tierOverride),
        ]);
      } finally {
        setCenterLoading(false);
      }
    },
    [
      isBackendCenter,
      loadCoreCenterData,
      loadOperationsData,
      loadBillingData,
      loadFinancialsData,
      loadSettingsData,
    ]
  );

  useEffect(() => {
    if (!isBackendCenter) return undefined;
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      loadCoreCenterData();
    });
    return () => {
      active = false;
    };
  }, [isBackendCenter, currentUser?.id, loadCoreCenterData]);

  // ─── 1. Branches CRUD ───────────────────────────────────────────────────────
  const addBranch = async (branchData) => {
    assertBackendCenter();
    try {
      const res = await centerApi.branches.create({
        name_ar: branchData.nameAr || 'فرع جديد',
        name_en: branchData.nameEn || branchData.nameAr || 'New Branch',
        address_ar: branchData.addressAr || '',
        phone: branchData.phone || '',
        manager_name_ar: branchData.managerNameAr || '',
        ...(branchData.isMain !== undefined ? { is_main: Boolean(branchData.isMain) } : {}),
        ...(branchData.isActive !== undefined ? { is_active: Boolean(branchData.isActive) } : {}),
      });
      const created = res?.data;
      if (created) {
        setBranches((prev) => {
          const next = created.isMain
            ? prev.map((b) => ({ ...b, isMain: false }))
            : prev;
          return [created, ...next];
        });
        refreshAuditLogs();
      }
      return created;
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      if (showToast) showToast(firstErr || err?.message || 'فشل إنشاء الفرع.', 'warning');
      throw err;
    }
  };

  const updateBranch = async (branchId, branchData) => {
    assertBackendCenter();
    try {
      const res = await centerApi.branches.update(branchId, {
        name_ar: branchData.nameAr,
        name_en: branchData.nameEn || branchData.nameAr,
        address_ar: branchData.addressAr,
        phone: branchData.phone,
        manager_name_ar: branchData.managerNameAr,
        ...(branchData.isMain !== undefined ? { is_main: Boolean(branchData.isMain) } : {}),
        ...(branchData.isActive !== undefined ? { is_active: Boolean(branchData.isActive) } : {}),
      });
      const updated = res?.data;
      if (updated) {
        setBranches((prev) =>
          prev.map((b) => {
            if (b.id === branchId) return updated;
            return updated.isMain ? { ...b, isMain: false } : b;
          })
        );
        refreshAuditLogs();
      }
      return updated;
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      if (showToast) showToast(firstErr || err?.message || 'فشل تحديث بيانات الفرع.', 'warning');
      throw err;
    }
  };

  const deleteBranch = async (branchId) => {
    assertBackendCenter();
    try {
      await centerApi.branches.delete(branchId);
      setBranches((prev) => prev.filter((b) => b.id !== branchId));
      if (selectedBranchId === branchId) setSelectedBranchId('all');
      await Promise.all([loadCoreCenterData(), refreshAuditLogs()]);
      return true;
    } catch (err) {
      if (showToast) showToast(err?.message || 'فشل حذف الفرع.', 'warning');
      throw err;
    }
  };

  // ─── 2. Center Teachers CRUD & Invites ──────────────────────────────────────
  const isUuidString = (val) =>
    typeof val === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val.trim());

  const addCenterTeacher = async (teacherData) => {
    assertBackendCenter();
    try {
      const candidateBranch =
        teacherData.branchId && teacherData.branchId !== 'all'
          ? teacherData.branchId
          : branches[0]?.id || undefined;
      const validBranchId = isUuidString(candidateBranch) ? candidateBranch.trim() : undefined;

      const res = await centerApi.teachers.create({
        name_ar: teacherData.nameAr,
        name_en: teacherData.nameEn || teacherData.nameAr,
        subject_ar: teacherData.subjectAr,
        phone: teacherData.phone,
        email: teacherData.email,
        ...(validBranchId ? { branch_id: validBranchId } : {}),
        settlement_rate: teacherData.settlementRate ?? 0.75,
      });
      const created = res?.data;
      if (created) {
        setCenterTeachers((prev) => [created, ...prev]);
        loadCoreCenterData();
        refreshAuditLogs();
      }
      return { success: true, teacher: created };
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      if (showToast) showToast(firstErr || err?.message || 'فشل إضافة المدرس.', 'warning');
      throw err;
    }
  };

  const updateCenterTeacher = async (teacherId, teacherData) => {
    assertBackendCenter();
    try {
      const validBranchId = isUuidString(teacherData.branchId)
        ? teacherData.branchId.trim()
        : undefined;

      const res = await centerApi.teachers.update(teacherId, {
        ...(teacherData.nameAr !== undefined
          ? {
              name_ar: teacherData.nameAr,
              name_en: teacherData.nameEn || teacherData.nameAr,
            }
          : {}),
        ...(teacherData.subjectAr !== undefined ? { subject_ar: teacherData.subjectAr } : {}),
        ...(teacherData.phone !== undefined ? { phone: teacherData.phone } : {}),
        ...(teacherData.email !== undefined ? { email: teacherData.email } : {}),
        ...(validBranchId ? { branch_id: validBranchId } : {}),
        ...(teacherData.settlementRate !== undefined
          ? { settlement_rate: Number(teacherData.settlementRate) }
          : {}),
        ...(teacherData.status !== undefined ? { status: teacherData.status } : {}),
      });
      const updated = res?.data;
      if (updated) {
        setCenterTeachers((prev) => prev.map((t) => (t.id === teacherId ? updated : t)));
        await Promise.all([loadCoreCenterData(), refreshGroups(), refreshAuditLogs()]);
      }
      return updated;
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      if (showToast) showToast(firstErr || err?.message || 'فشل تحديث بيانات المعلم.', 'warning');
      throw err;
    }
  };

  const deleteCenterTeacher = async (teacherId) => {
    assertBackendCenter();
    try {
      await centerApi.teachers.delete(teacherId);
      setCenterTeachers((prev) => prev.filter((t) => t.id !== teacherId));
      loadCoreCenterData();
      refreshAuditLogs();
      return true;
    } catch (err) {
      if (showToast) showToast(err?.message || 'فشل حذف المعلم.', 'warning');
      throw err;
    }
  };

  const resendTeacherInvite = async (teacherId) => {
    assertBackendCenter();
    try {
      const res = await centerApi.teachers.resendInvite(teacherId);
      const link = res?.data?.activationLink;
      const nextStatus = res?.data?.status;
      setCenterTeachers((prev) =>
        prev.map((t) =>
          t.id === teacherId
            ? {
                ...t,
                ...(link ? { activationLink: link } : {}),
                ...(nextStatus
                  ? {
                      status: nextStatus,
                      statusAr:
                        nextStatus === 'invited' && t.isPlatformLinked
                          ? 'بانتظار موافقة المعلم'
                          : t.statusAr,
                      awaitingTeacherApproval: Boolean(t.isPlatformLinked && nextStatus === 'invited'),
                    }
                  : {}),
              }
            : t
        )
      );
      await loadOperationsData();
      refreshAuditLogs();
      return { success: true, link, status: nextStatus };
    } catch (err) {
      if (showToast) showToast(err?.message || 'تعذر تجديد رابط الدعوة.', 'warning');
      return { success: false, error: err?.message };
    }
  };

  // ─── 3. Rooms CRUD & Schedule Conflict Engine ───────────────────────────────
  const isUuidLike = (val) =>
    typeof val === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val.trim());

  const addRoom = async (roomData) => {
    assertBackendCenter();
    try {
      const candidateBranch =
        roomData.branchId && roomData.branchId !== 'all'
          ? roomData.branchId
          : branches[0]?.id || undefined;
      const validBranchId = isUuidLike(candidateBranch) ? candidateBranch.trim() : undefined;

      const res = await centerApi.rooms.create({
        name_ar: roomData.nameAr,
        name_en: roomData.nameEn || roomData.nameAr,
        ...(validBranchId ? { branch_id: validBranchId } : {}),
        capacity: Number(roomData.capacity) || 40,
        floor: roomData.floor || 'الطابق الأول',
        equipped: Array.isArray(roomData.equipped) ? roomData.equipped : [],
        is_available: roomData.isAvailable !== false,
      });
      const created = res?.data;
      if (created) {
        setRooms((prev) => [created, ...prev]);
        loadCoreCenterData();
        refreshAuditLogs();
      }
      return created;
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      if (showToast) showToast(firstErr || err?.message || 'فشل إضافة القاعة.', 'warning');
      throw err;
    }
  };

  const updateRoom = async (roomId, updatedData) => {
    assertBackendCenter();
    try {
      const validBranchId = isUuidLike(updatedData.branchId)
        ? updatedData.branchId.trim()
        : undefined;

      const res = await centerApi.rooms.update(roomId, {
        ...(updatedData.nameAr !== undefined
          ? {
              name_ar: updatedData.nameAr,
              name_en: updatedData.nameEn || updatedData.nameAr,
            }
          : {}),
        ...(validBranchId ? { branch_id: validBranchId } : {}),
        ...(updatedData.capacity !== undefined
          ? { capacity: Number(updatedData.capacity) || 40 }
          : {}),
        ...(updatedData.floor !== undefined ? { floor: updatedData.floor } : {}),
        ...(updatedData.equipped !== undefined ? { equipped: updatedData.equipped } : {}),
        ...(updatedData.isAvailable !== undefined
          ? { is_available: Boolean(updatedData.isAvailable) }
          : {}),
      });
      const updated = res?.data;
      if (updated) {
        setRooms((prev) => prev.map((r) => (r.id === roomId ? updated : r)));
        await Promise.all([refreshGroups(), refreshAuditLogs()]);
      }
      return updated;
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      if (showToast) showToast(firstErr || err?.message || 'فشل تحديث بيانات القاعة.', 'warning');
      throw err;
    }
  };

  const deleteRoom = async (roomId) => {
    assertBackendCenter();
    try {
      await centerApi.rooms.delete(roomId);
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
      loadCoreCenterData();
      refreshAuditLogs();
      return true;
    } catch (err) {
      if (showToast) showToast(err?.message || 'فشل حذف القاعة.', 'warning');
      throw err;
    }
  };

  // Synchronous client-side conflict check mirroring backend CenterScheduleService for instant form feedback
  const checkScheduleConflict = useCallback(
    (candidateSlot, _existingSlots, excludeGroupId = null, candidateTeacher = null) => {
      const candidateDay = (candidateSlot.day || '').toLowerCase();
      const candidateHall = (candidateSlot.hall || '').trim();
      const candidateStart = candidateSlot.startTime || '16:00';
      const candidateEnd = candidateSlot.endTime || '18:00';

      if (candidateEnd <= candidateStart) {
        return {
          hasConflict: true,
          type: 'invalid_time_range',
          messageAr: `وقت انتهاء الحصة (${candidateEnd}) يجب أن يكون بعد وقت البداية (${candidateStart}).`,
        };
      }

      const teacherHint = candidateTeacher ? String(candidateTeacher).trim() : '';

      for (const group of groups) {
        if (excludeGroupId && group.id === excludeGroupId) continue;
        const slots = group.scheduleSlots || [];
        for (const slot of slots) {
          if ((slot.day || '').toLowerCase() === candidateDay) {
            const isSameHall =
              Boolean(candidateHall) &&
              (slot.hall || group.hallName || '').trim() === candidateHall;
            const overlap =
              candidateStart < (slot.endTime || '20:00') &&
              candidateEnd > (slot.startTime || '10:00');

            if (isSameHall && overlap) {
              return {
                hasConflict: true,
                type: 'hall_overlap',
                messageAr: `تعارض قاعات: القاعة «${candidateHall}» محجوزة بالفعل يوم ${candidateSlot.dayAr || candidateDay} في نفس التوقيت لمجموعة «${group.nameAr}»!`,
                conflictingGroup: group,
                conflictingSlot: slot,
              };
            }

            if (
              overlap &&
              teacherHint &&
              ((group.teacherId && String(group.teacherId) === teacherHint) ||
                (group.teacherNameAr && group.teacherNameAr.trim() === teacherHint))
            ) {
              return {
                hasConflict: true,
                type: 'teacher_overlap',
                messageAr: `تعارض مواعيد المعلم: المعلم «${group.teacherNameAr || teacherHint}» لديه حصة أخرى في نفس التوقيت بمجموعة «${group.nameAr}»!`,
                conflictingGroup: group,
                conflictingSlot: slot,
              };
            }
          }
        }
      }
      return { hasConflict: false };
    },
    [groups]
  );

  // ─── 4. Smart Gate QR Scanner & Absence Alerts ──────────────────────────────
  const processSmartStudentQrScan = async (rawScanText, simulatedDay = null, simulatedTime = null) => {
    if (!isBackendCenter) {
      return { success: false, type: 'auth_required', messageAr: AUTH_REQUIRED_MESSAGE };
    }

    try {
      const res = await centerApi.attendance.smartGateScan({
        code: String(rawScanText || '').trim(),
        simulated_day: simulatedDay ? String(simulatedDay).toLowerCase() : undefined,
        simulated_time: simulatedTime || undefined,
      });
      const data = res?.data || {};
      if (data.record) {
        setAttendanceRecords((prev) => {
          const exists = prev.some((r) => r.id === data.record.id);
          return exists ? prev : [data.record, ...prev];
        });
      }
      refreshAuditLogs();
      return {
        success: true,
        isDuplicateNotice: Boolean(data.alreadyRecorded),
        isNew: !data.alreadyRecorded,
        record: data.record,
        studentNameAr: data.student?.nameAr || data.record?.studentNameAr || 'الطالب',
        group: data.group,
        slot: data.matchedSlot,
        paymentStatus: data.student?.paymentStatus || 'paid',
        paymentStatusAr: data.student?.paymentStatusAr || 'مسدد بالكامل',
        messageAr: data.messageAr || res?.message || 'تم تسجيل الحضور بنجاح.',
      };
    } catch (err) {
      return {
        success: false,
        type: 'scan_error',
        messageAr: err?.message || 'لم يتم العثور على طالب مطابق لهذا الباركود في مجموعات السنتر.',
      };
    }
  };

  const sendAbsenceAlert = async (payload) => {
    assertBackendCenter();
    const res = await centerApi.attendance.sendAbsenceAlert(payload);
    refreshAuditLogs();
    return res?.data;
  };

  // ─── 5. Financials ERP (Expenses, Settlements, Dues) ────────────────────────
  const addExpense = async (expenseData) => {
    assertBackendCenter();
    try {
      const validBranchId =
        expenseData.branchId && expenseData.branchId !== 'all'
          ? expenseData.branchId
          : branches[0]?.id || undefined;

      const res = await centerApi.financials.createExpense({
        title_ar: expenseData.titleAr,
        title_en: expenseData.titleEn || expenseData.titleAr,
        category: expenseData.category || 'other',
        amount_egp: Number(expenseData.amountEgp) || 0,
        branch_id: validBranchId,
        expense_date: expenseData.date || undefined,
      });
      const created = res?.data;
      if (created) {
        setExpenses((prev) => [created, ...prev]);
        const ov = await centerApi.financials.getOverview().catch(() => null);
        if (ov?.data?.summary) setRemoteFinancialSummary(ov.data.summary);
        refreshAuditLogs();
      }
      return created;
    } catch (err) {
      if (showToast) showToast(err?.message || 'فشل تسجيل المصروف.', 'warning');
      throw err;
    }
  };

  const deleteExpense = async (expenseId) => {
    assertBackendCenter();
    await centerApi.financials.deleteExpense(expenseId);
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
    const ov = await centerApi.financials.getOverview().catch(() => null);
    if (ov?.data?.summary) setRemoteFinancialSummary(ov.data.summary);
    refreshAuditLogs();
    return true;
  };

  const approveTeacherSettlement = async (teacherId, period = null, referenceNote = null) => {
    assertBackendCenter();
    const res = await centerApi.financials.approveSettlement(teacherId, {
      ...(period ? { period } : {}),
      ...(referenceNote ? { reference_note: referenceNote } : {}),
    });
    const updated = res?.data;
    if (updated) {
      setTeacherSettlements((prev) =>
        prev.map((item) =>
          item.teacherId === teacherId || item.id === teacherId ? updated : item
        )
      );
      refreshAuditLogs();
    }
    return updated;
  };

  const remindStudentDue = async (enrollmentId) => {
    assertBackendCenter();
    const res = await centerApi.financials.remindDue(enrollmentId);
    refreshAuditLogs();
    return res?.data;
  };

  const markStudentDuePaid = async (enrollmentId) => {
    assertBackendCenter();
    const res = await centerApi.financials.markDuePaid(enrollmentId);
    const [duesRes, ovRes] = await Promise.all([
      centerApi.financials.listDues().catch(() => null),
      centerApi.financials.getOverview().catch(() => null),
    ]);
    if (duesRes?.data) setOutstandingDues(duesRes.data);
    if (ovRes?.data?.summary) setRemoteFinancialSummary(ovRes.data.summary);
    refreshAuditLogs();
    return res?.data;
  };

  // ─── 6. Staff CRUD ──────────────────────────────────────────────────────────
  const addStaff = async (staffData) => {
    assertBackendCenter();
    try {
      const roleMap = {
        'مدير فرع': 'manager',
        'مدير الفرع العام': 'manager',
        'سكرتارية واستقبال': 'receptionist',
        'محاسب مالي': 'accountant',
        'مشرف قاعات': 'supervisor',
      };
      const resolvedRole = staffData.role || roleMap[staffData.roleAr] || 'receptionist';
      const candidateBranch =
        staffData.branchId && staffData.branchId !== 'all'
          ? staffData.branchId
          : branches[0]?.id || undefined;
      const validBranchId = isUuidString(candidateBranch) ? candidateBranch.trim() : undefined;

      const res = await centerApi.staff.create({
        name_ar: staffData.nameAr,
        name_en: staffData.nameEn || staffData.nameAr,
        role: resolvedRole,
        role_ar: staffData.roleAr,
        ...(validBranchId ? { branch_id: validBranchId } : {}),
        phone: staffData.phone || undefined,
        email: staffData.email || undefined,
        salary_egp: Number(staffData.salaryEgp) || 0,
        permissions: Array.isArray(staffData.permissions)
          ? staffData.permissions
          : ['إدارة الحضور بالباركود', 'تسجيل الطلاب'],
      });
      const created = res?.data;
      if (created) {
        setStaff((prev) => [created, ...prev]);
        loadCoreCenterData();
        refreshAuditLogs();
      }
      return created;
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      if (showToast) showToast(firstErr || err?.message || 'فشل إضافة الموظف.', 'warning');
      throw err;
    }
  };

  const updateStaff = async (staffId, staffData) => {
    assertBackendCenter();
    try {
      const roleMap = {
        'مدير فرع': 'manager',
        'مدير الفرع العام': 'manager',
        'سكرتارية واستقبال': 'receptionist',
        'محاسب مالي': 'accountant',
        'مشرف قاعات': 'supervisor',
      };
      const resolvedRole = staffData.role || roleMap[staffData.roleAr] || undefined;
      const validBranchId = isUuidString(staffData.branchId)
        ? staffData.branchId.trim()
        : undefined;

      const res = await centerApi.staff.update(staffId, {
        ...(staffData.nameAr !== undefined
          ? { name_ar: staffData.nameAr, name_en: staffData.nameEn || staffData.nameAr }
          : {}),
        ...(resolvedRole ? { role: resolvedRole } : {}),
        ...(staffData.roleAr !== undefined ? { role_ar: staffData.roleAr } : {}),
        ...(validBranchId ? { branch_id: validBranchId } : {}),
        ...(staffData.phone !== undefined ? { phone: staffData.phone } : {}),
        ...(staffData.email !== undefined ? { email: staffData.email } : {}),
        ...(staffData.salaryEgp !== undefined
          ? { salary_egp: Number(staffData.salaryEgp) || 0 }
          : {}),
        ...(Array.isArray(staffData.permissions) ? { permissions: staffData.permissions } : {}),
        ...(staffData.status !== undefined ? { status: staffData.status } : {}),
      });
      const updated = res?.data;
      if (updated) {
        setStaff((prev) => prev.map((s) => (s.id === staffId ? updated : s)));
        loadCoreCenterData();
        refreshAuditLogs();
      }
      return updated;
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      if (showToast) showToast(firstErr || err?.message || 'فشل تحديث بيانات الموظف.', 'warning');
      throw err;
    }
  };

  const deleteStaff = async (staffId) => {
    assertBackendCenter();
    await centerApi.staff.delete(staffId);
    setStaff((prev) => prev.filter((s) => s.id !== staffId));
    loadCoreCenterData();
    refreshAuditLogs();
    return true;
  };

  // ─── 7. Motafawweq Connect (Global User Search & Link) ──────────────────────
  const searchGlobalUsers = useCallback(
    (query) => {
      if (!query || !query.trim() || query.trim().length < 2) return [];
      const q = query.trim().toLowerCase();
      return globalPlatformUsers.filter(
        (u) =>
          (u.nameAr || '').toLowerCase().includes(q) ||
          (u.phone || '').includes(q) ||
          (u.email || '').toLowerCase().includes(q) ||
          (u.username || '').toLowerCase().includes(q)
      );
    },
    [globalPlatformUsers]
  );

  const searchGlobalUsersRemote = useCallback(
    async (query, role = null) => {
      if (!isBackendCenter || !query || query.trim().length < 2) return [];
      try {
        const res = await centerApi.connect.searchUsers(query.trim(), role);
        const list = Array.isArray(res?.data) ? res.data : [];
        setGlobalPlatformUsers(list);
        return list;
      } catch {
        return [];
      }
    },
    [isBackendCenter]
  );

  const connectUserToCenter = async (user, branchId) => {
    if (!isBackendCenter) {
      return { success: false, messageAr: AUTH_REQUIRED_MESSAGE };
    }
    try {
      const targetUserId = Number(user?.userId || user?.id);
      const candidateBranch =
        branchId && branchId !== 'all' ? branchId : branches[0]?.id || undefined;
      const validBranchId = isUuidString(candidateBranch) ? candidateBranch.trim() : undefined;

      const res = await centerApi.connect.connectUser({
        user_id: targetUserId,
        ...(validBranchId ? { branch_id: validBranchId } : {}),
      });
      const created = res?.data;
      if (created) {
        setConnectedUsers((prev) => [created, ...prev]);
        await Promise.all([loadCoreCenterData(), loadOperationsData()]);
      }
      const isPendingTeacher = Boolean(created?.awaitingTeacherApproval || user?.role === 'teacher');
      return {
        success: true,
        awaitingApproval: isPendingTeacher,
        messageAr: isPendingTeacher
          ? `تم إرسال دعوة الانضمام للمعلم «${user.nameAr}» — سيُعتمد تلقائياً فور موافقته من حسابه.`
          : res?.message || `تم ربط حساب «${user.nameAr}» بالسنتر بنجاح!`,
      };
    } catch (err) {
      const firstErr = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
      return {
        success: false,
        messageAr: firstErr || err?.message || 'المستخدم مربوط بالفعل بهذا السنتر أو تعذر الربط.',
      };
    }
  };

  const disconnectUserFromCenter = async (connectionId) => {
    assertBackendCenter();
    await centerApi.connect.disconnectUser(connectionId);
    setConnectedUsers((prev) => prev.filter((c) => c.id !== connectionId));
    await Promise.all([loadCoreCenterData(), loadOperationsData(), refreshAuditLogs()]);
    return true;
  };

  // ─── 8. Dashboard, Queue & Executive Report Actions ─────────────────────────
  const fetchDashboard = useCallback(
    async (params = {}) => {
      if (!isBackendCenter) return null;
      const seq = ++dashboardSeqRef.current;
      const res = await centerApi.dashboard.get(params);
      if (seq !== dashboardSeqRef.current) return null;
      if (res?.data) {
        setDashboardData(res.data);
        if (branches.length === 0 && Array.isArray(res.data.branches)) {
          setBranches(res.data.branches);
        }
        return res.data;
      }
      return null;
    },
    [isBackendCenter, branches.length]
  );

  const completeQueueItemRemote = async (groupId, slotId = null, queueDate = null) => {
    assertBackendCenter();
    const res = await centerApi.dashboard.completeQueueItem({
      group_id: groupId,
      ...(slotId ? { slot_id: slotId } : {}),
      ...(queueDate ? { queue_date: queueDate } : {}),
    });
    refreshAuditLogs();
    return res?.data;
  };

  const restoreQueueItemRemote = async (groupId, slotId = null, queueDate = null) => {
    assertBackendCenter();
    await centerApi.dashboard.restoreQueueItem({
      group_id: groupId,
      ...(slotId ? { slot_id: slotId } : {}),
      ...(queueDate ? { queue_date: queueDate } : {}),
    });
    refreshAuditLogs();
    return true;
  };

  const resetQueueRemote = async (day = null, queueDate = null) => {
    assertBackendCenter();
    const res = await centerApi.dashboard.resetQueue({
      ...(day ? { day: String(day).toLowerCase() } : {}),
      ...(queueDate ? { queue_date: queueDate } : {}),
    });
    refreshAuditLogs();
    return res?.data;
  };

  const fetchExecutiveReport = useCallback(
    async (period = 'weekly') => {
      if (!isBackendCenter) return null;
      try {
        const res = await centerApi.dashboard.getExecutiveReport(period);
        if (res?.data) {
          setExecutiveReport(res.data);
          return res.data;
        }
      } catch {
        // ignore
      }
      return null;
    },
    [isBackendCenter]
  );

  // ─── 9. Settings, KPIs, Tasks, Announcements, Import & Cloud Backups ────────
  const updateCenterSettings = async (payload) => {
    assertBackendCenter();
    const res = await centerApi.settings.update(payload);
    if (res?.data) {
      setCenterSettings(res.data);
      const updatedNameAr = res.data.centerNameAr || res.data.nameAr;
      const updatedNameEn = res.data.centerNameEn || res.data.nameEn;
      if (updatedNameAr) {
        setDashboardData((prev) =>
          prev
            ? {
                ...prev,
                centerNameAr: updatedNameAr,
                centerNameEn: updatedNameEn || updatedNameAr,
              }
            : prev
        );
      }
      if (typeof refreshUser === 'function') {
        refreshUser().catch(() => null);
      }
      refreshAuditLogs();
    }
    return res?.data;
  };

  const updateKpiTargets = async (payload) => {
    assertBackendCenter();
    const res = await centerApi.settings.updateKpis(payload);
    if (res?.data) {
      setCenterSettings(res.data);
      refreshAuditLogs();
    }
    return res?.data;
  };

  const addCenterTask = async (taskData) => {
    assertBackendCenter();
    const res = await centerApi.settings.createTask(taskData);
    if (res?.data) {
      setTasks((prev) => [res.data, ...prev]);
      refreshAuditLogs();
    }
    return res?.data;
  };

  const updateCenterTask = async (taskId, taskData) => {
    assertBackendCenter();
    const res = await centerApi.settings.updateTask(taskId, taskData);
    if (res?.data) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
      refreshAuditLogs();
    }
    return res?.data;
  };

  const toggleCenterTask = async (taskId) => {
    assertBackendCenter();
    const res = await centerApi.settings.toggleTask(taskId);
    if (res?.data) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
    }
    return res?.data;
  };

  const deleteCenterTask = async (taskId) => {
    assertBackendCenter();
    await centerApi.settings.deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    refreshAuditLogs();
    return true;
  };

  const addCenterAnnouncement = async (data) => {
    assertBackendCenter();
    const res = await centerApi.settings.createAnnouncement(data);
    if (res?.data) {
      setAnnouncements((prev) => [res.data, ...prev]);
      refreshAuditLogs();
    }
    return res?.data;
  };

  const deleteCenterAnnouncement = async (uuid) => {
    assertBackendCenter();
    await centerApi.settings.deleteAnnouncement(uuid);
    setAnnouncements((prev) => prev.filter((a) => a.id !== uuid));
    refreshAuditLogs();
    return true;
  };

  const importCenterStudents = async (rows, defaultGroupId = null) => {
    assertBackendCenter();
    const res = await centerApi.settings.importStudents({
      rows,
      ...(defaultGroupId ? { default_group_id: defaultGroupId } : {}),
    });
    await Promise.all([refreshGroups(), refreshAuditLogs()]);
    return res?.data;
  };

  const createCenterBackup = async () => {
    assertBackendCenter();
    const res = await centerApi.settings.createBackup();
    if (res?.data) {
      setBackups((prev) => [res.data, ...prev]);
      setCenterSettings((prev) =>
        prev
          ? {
              ...prev,
              lastBackupAt: res.data.completedAt || prev.lastBackupAt,
              lastBackupChecksum: res.data.checksumSha256 || prev.lastBackupChecksum,
            }
          : prev
      );
      refreshAuditLogs();
    }
    return res?.data;
  };

  // ─── 10. Billing & Subscriptions ────────────────────────────────────────────
  const validateCenterCoupon = async (code, orderAmount = 0) => {
    assertBackendCenter();
    const res = await centerApi.billing.validateCoupon({
      code,
      order_amount: orderAmount,
    });
    return res?.data;
  };

  const subscribeCenterPlan = async (payload) => {
    assertBackendCenter();
    const res = await centerApi.billing.subscribe(payload);
    const newTier = res?.data?.activeSub?.tier || payload?.plan_tier || 'free';
    await Promise.all([refreshUser(), refreshCenterData(newTier)]);
    return { data: res?.data, message: res?.message };
  };

  const cancelCenterSubscription = async () => {
    assertBackendCenter();
    const res = await centerApi.billing.cancel();
    await Promise.all([refreshUser(), refreshCenterData('free')]);
    return { data: res?.data, message: res?.message };
  };

  // ─── CSV Export Helper (Formula-Injection Safe) ─────────────────────────────
  const exportToCsv = (filename, headers, rows) => {
    const escapeCell = (cell) => {
      let s = String(cell ?? '');
      if (s !== '' && /^[=+\-@\t\r]/.test(s)) {
        s = `'${s}`;
      }
      return `"${s.replace(/"/g, '""')}"`;
    };
    const csvContent =
      '\uFEFF' +
      [headers.map(escapeCell).join(','), ...rows.map((row) => row.map(escapeCell).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ─── Authoritative Financial Summary ────────────────────────────────────────
  const financialSummary = useMemo(() => {
    if (isBackendCenter && remoteFinancialSummary) {
      return {
        grossCollectedRevenue: Number(remoteFinancialSummary.grossCollectedRevenue ?? 0),
        totalExpenses: Number(remoteFinancialSummary.totalExpenses ?? 0),
        teacherPayouts: Number(remoteFinancialSummary.teacherPayouts ?? 0),
        centerNetRevenue: Number(remoteFinancialSummary.centerNetRevenue ?? 0),
        netProfit: Number(remoteFinancialSummary.netProfit ?? 0),
        operatingMarginPct: Number(remoteFinancialSummary.operatingMarginPct ?? 0),
        outstandingReceivables: Number(remoteFinancialSummary.outstandingReceivables ?? 0),
      };
    }

    return {
      grossCollectedRevenue: 0,
      totalExpenses: 0,
      teacherPayouts: 0,
      centerNetRevenue: 0,
      netProfit: 0,
      operatingMarginPct: 0,
      outstandingReceivables: 0,
    };
  }, [isBackendCenter, remoteFinancialSummary]);

  return (
    <CenterContext.Provider
      value={{
        isBackendCenter,
        centerLoading,
        refreshCenterData,
        loadCoreCenterData,
        loadOperationsData,
        loadAttendanceData,
        loadFinancialsData,
        loadBillingData,
        loadSettingsData,
        branches,
        selectedBranchId,
        setSelectedBranchId,
        addBranch,
        updateBranch,
        deleteBranch,
        centerTeachers,
        addCenterTeacher,
        updateCenterTeacher,
        deleteCenterTeacher,
        resendTeacherInvite,
        rooms,
        addRoom,
        updateRoom,
        deleteRoom,
        expenses,
        addExpense,
        deleteExpense,
        teacherSettlements,
        approveTeacherSettlement,
        outstandingDues,
        remindStudentDue,
        markStudentDuePaid,
        staff,
        addStaff,
        updateStaff,
        deleteStaff,
        attendanceRecords,
        attendanceSummary,
        processSmartStudentQrScan,
        sendAbsenceAlert,
        auditLogs,
        auditLogsMeta,
        auditLogsLoading,
        refreshAuditLogs,
        financialSummary,
        checkScheduleConflict,
        connectedUsers,
        searchGlobalUsers,
        searchGlobalUsersRemote,
        connectUserToCenter,
        disconnectUserFromCenter,
        dashboardData,
        fetchDashboard,
        completeQueueItemRemote,
        restoreQueueItemRemote,
        resetQueueRemote,
        executiveReport,
        fetchExecutiveReport,
        billingData,
        validateCenterCoupon,
        subscribeCenterPlan,
        cancelCenterSubscription,
        centerSettings,
        updateCenterSettings,
        updateKpiTargets,
        tasks,
        setTasks,
        addCenterTask,
        updateCenterTask,
        toggleCenterTask,
        deleteCenterTask,
        announcements,
        setAnnouncements,
        addCenterAnnouncement,
        deleteCenterAnnouncement,
        importCenterStudents,
        backups,
        createCenterBackup,
        exportToCsv,
      }}
    >
      {children}
    </CenterContext.Provider>
  );
};

export const useCenter = () => {
  const ctx = useContext(CenterContext);
  if (!ctx) {
    throw new Error('useCenter must be used within a CenterProvider');
  }
  return ctx;
};
