/**
 * Motafawweq — Educational Center Domain API Client
 * Covers all /api/v1/center/... endpoints: Dashboard, Live Queue, Executive Report,
 * Branches, Rooms, Zero-Conflict Master Schedule, Teachers Network, Motafawweq Connect,
 * Staff, Audit Logs, Groups, Roster, Smart Gate QR Attendance, Financials ERP,
 * 3-Tier Billing & Coupons, and Settings / Tasks / Announcements / Import / Cloud Backups.
 */

import { apiGet, apiPost, apiPut, apiPatch, apiDelete, tokenStorage, ApiError } from './api';
import { API_BASE_URL } from '../constants';

const buildQuery = (params = {}) => {
  const clean = Object.entries(params).reduce((acc, [k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      acc[k] = String(v);
    }
    return acc;
  }, {});
  const qs = new URLSearchParams(clean).toString();
  return qs ? `?${qs}` : '';
};

/**
 * Downloads a formula-safe UTF-8 CSV directly from an authenticated backend endpoint.
 */
export async function downloadCenterCsv(path, filename = 'center-export.csv') {
  const token = tokenStorage.getAccessToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      Accept: 'text/csv, application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errPayload = await res.json().catch(() => ({}));
    throw new ApiError({
      message: errPayload?.message || `فشل تحميل ملف CSV (${res.status})`,
      status: res.status,
      errorCode: errPayload?.error_code || null,
    });
  }

  const csvText = await res.text();
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

export const centerApi = {
  // ─── 1. Dashboard, Live Daily Queue & Executive Report ─────────────────────
  dashboard: {
    get: (params = {}) => apiGet(`/center/dashboard${buildQuery(params)}`),
    completeQueueItem: (data) => apiPost('/center/queue/complete', data),
    restoreQueueItem: (data) => apiPost('/center/queue/restore', data),
    resetQueue: (data = {}) => apiPost('/center/queue/reset', data),
    getExecutiveReport: (period = 'weekly') =>
      apiGet(`/center/reports/executive${buildQuery({ period })}`),
  },

  // ─── 2. Multi-Branch Management ────────────────────────────────────────────
  branches: {
    list: (params = {}) => apiGet(`/center/branches${buildQuery(params)}`),
    get: (uuid) => apiGet(`/center/branches/${uuid}`),
    create: (data) => apiPost('/center/branches', data),
    update: (uuid, data) => apiPut(`/center/branches/${uuid}`, data),
    delete: (uuid) => apiDelete(`/center/branches/${uuid}`),
    exportCsv: (filename = 'center-branches.csv') =>
      downloadCenterCsv('/center/branches/export', filename),
  },

  // ─── 3. Classrooms / Halls & Master Schedule ───────────────────────────────
  rooms: {
    list: (params = {}) => apiGet(`/center/rooms${buildQuery(params)}`),
    get: (uuid) => apiGet(`/center/rooms/${uuid}`),
    create: (data) => apiPost('/center/rooms', data),
    update: (uuid, data) => apiPut(`/center/rooms/${uuid}`, data),
    delete: (uuid) => apiDelete(`/center/rooms/${uuid}`),
  },

  schedule: {
    getMaster: (params = {}) => apiGet(`/center/schedule${buildQuery(params)}`),
    getAvailability: (params = {}) =>
      apiGet(`/center/schedule/availability${buildQuery(params)}`),
    checkConflicts: (data) => apiPost('/center/schedule/check-conflicts', data),
  },

  // ─── 4. Center Teachers Network & Motafawweq Connect ───────────────────────
  teachers: {
    list: (params = {}) => apiGet(`/center/teachers${buildQuery(params)}`),
    get: (uuid) => apiGet(`/center/teachers/${uuid}`),
    create: (data) => apiPost('/center/teachers', data),
    update: (uuid, data) => apiPut(`/center/teachers/${uuid}`, data),
    delete: (uuid) => apiDelete(`/center/teachers/${uuid}`),
    resendInvite: (uuid) => apiPost(`/center/teachers/${uuid}/resend-invite`, {}),
  },

  connect: {
    searchUsers: (q, role = null, limit = 15) =>
      apiGet(`/center/connect/search${buildQuery({ q, role, limit })}`),
    listUsers: (params = {}) => apiGet(`/center/connect/users${buildQuery(params)}`),
    connectUser: (data) => apiPost('/center/connect/users', data),
    disconnectUser: (uuid) => apiDelete(`/center/connect/users/${uuid}`),
  },

  // ─── 5. Staff Management & Security Audit Trail ────────────────────────────
  staff: {
    list: (params = {}) => apiGet(`/center/staff${buildQuery(params)}`),
    create: (data) => apiPost('/center/staff', data),
    update: (uuid, data) => apiPut(`/center/staff/${uuid}`, data),
    delete: (uuid) => apiDelete(`/center/staff/${uuid}`),
    listAuditLogs: (params = {}) => apiGet(`/center/audit-logs${buildQuery(params)}`),
  },

  // ─── 6. Study Groups (Cohorts) & Student Roster ────────────────────────────
  groups: {
    list: (params = {}) => apiGet(`/center/groups${buildQuery(params)}`),
    get: (uuid) => apiGet(`/center/groups/${uuid}`),
    create: (data) => apiPost('/center/groups', data),
    update: (uuid, data) => apiPut(`/center/groups/${uuid}`, data),
    delete: (uuid) => apiDelete(`/center/groups/${uuid}`),
    regenerateCode: (uuid) => apiPost(`/center/groups/${uuid}/regenerate-code`, {}),

    getRoster: (uuid, params = {}) =>
      apiGet(`/center/groups/${uuid}/roster${buildQuery(params)}`),
    searchStudents: (q, limit = 20) =>
      apiGet(`/center/students/search${buildQuery({ q, limit })}`),
    enrollStudent: (uuid, data) => apiPost(`/center/groups/${uuid}/students`, data),
    acceptPending: (uuid, enrollmentUuid) =>
      apiPost(`/center/groups/${uuid}/enrollments/${enrollmentUuid}/accept`, {}),
    rejectPending: (uuid, enrollmentUuid) =>
      apiPost(`/center/groups/${uuid}/enrollments/${enrollmentUuid}/reject`, {}),
    removeStudent: (uuid, enrollmentUuid) =>
      apiDelete(`/center/groups/${uuid}/enrollments/${enrollmentUuid}`),
    updatePayment: (uuid, enrollmentUuid, data) =>
      apiPatch(`/center/groups/${uuid}/enrollments/${enrollmentUuid}/payment`, data),
    getStudentCard: (uuid, enrollmentUuid) =>
      apiGet(`/center/groups/${uuid}/enrollments/${enrollmentUuid}/card`),
  },

  // ─── 7. Attendance & Smart Gate Scanner ────────────────────────────────────
  attendance: {
    scanInGroup: (groupUuid, data) =>
      apiPost(`/center/groups/${groupUuid}/attendance/scan`, data),
    toggleInGroup: (groupUuid, data) =>
      apiPost(`/center/groups/${groupUuid}/attendance/toggle`, data),
    listGroupSessions: (groupUuid) =>
      apiGet(`/center/groups/${groupUuid}/attendance/sessions`),
    getSessionDetails: (groupUuid, sessionUuid) =>
      apiGet(`/center/groups/${groupUuid}/attendance/sessions/${sessionUuid}`),

    smartGateScan: (data) => apiPost('/center/attendance/smart-scan', data),
    listRecords: (params = {}) => apiGet(`/center/attendance/records${buildQuery(params)}`),
    sendAbsenceAlert: (data) => apiPost('/center/attendance/absence-alerts', data),
    exportCsv: (params = {}, filename = 'center-attendance.csv') =>
      downloadCenterCsv(`/center/attendance/export${buildQuery(params)}`, filename),
  },

  // ─── 8. Financials ERP (P&L, Expenses, Settlements, Dues) ──────────────────
  financials: {
    getOverview: (params = {}) => apiGet(`/center/financials/overview${buildQuery(params)}`),
    listExpenses: (params = {}) => apiGet(`/center/financials/expenses${buildQuery(params)}`),
    createExpense: (data) => apiPost('/center/financials/expenses', data),
    deleteExpense: (uuid) => apiDelete(`/center/financials/expenses/${uuid}`),
    exportExpensesCsv: (params = {}, filename = 'center-expenses.csv') =>
      downloadCenterCsv(`/center/financials/expenses/export${buildQuery(params)}`, filename),

    listSettlements: (params = {}) =>
      apiGet(`/center/financials/settlements${buildQuery(params)}`),
    approveSettlement: (teacherUuid, data = {}) =>
      apiPost(`/center/financials/settlements/${teacherUuid}/approve`, data),

    listDues: (params = {}) => apiGet(`/center/financials/dues${buildQuery(params)}`),
    remindDue: (enrollmentUuid) =>
      apiPost(`/center/financials/dues/${enrollmentUuid}/remind`, {}),
    markDuePaid: (enrollmentUuid) =>
      apiPost(`/center/financials/dues/${enrollmentUuid}/mark-paid`, {}),
  },

  // ─── 9. Billing & 3-Tier Subscriptions ─────────────────────────────────────
  billing: {
    getSummary: () => apiGet('/center/billing'),
    validateCoupon: (data) => apiPost('/center/billing/validate-coupon', data),
    subscribe: (data) => apiPost('/center/billing/subscribe', data),
    cancel: () => apiPost('/center/billing/cancel', {}),
  },

  // ─── 10. Settings, KPIs, Tasks, Announcements, Import & Cloud Backups ──────
  settings: {
    get: () => apiGet('/center/settings'),
    update: (data) => apiPut('/center/settings', data),
    uploadAvatar: async (file) => {
      const formData = new FormData();
      formData.append('avatar', file);

      const token = tokenStorage.getAccessToken();
      const res = await fetch(`${API_BASE_URL}/center/settings/avatar`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok || payload?.success === false) {
        const firstFieldErr =
          payload?.errors && typeof payload.errors === 'object'
            ? Object.values(payload.errors).flat().find(Boolean)
            : null;
        throw new Error(firstFieldErr || payload?.message || 'فشل رفع صورة السنتر.');
      }
      return payload;
    },
    deleteAvatar: () => apiDelete('/center/settings/avatar'),
    updateKpis: (data) => apiPut('/center/settings/kpis', data),

    listTasks: (params = {}) => apiGet(`/center/tasks${buildQuery(params)}`),
    createTask: (data) => apiPost('/center/tasks', data),
    updateTask: (uuid, data) => apiPut(`/center/tasks/${uuid}`, data),
    toggleTask: (uuid) => apiPatch(`/center/tasks/${uuid}/toggle`, {}),
    deleteTask: (uuid) => apiDelete(`/center/tasks/${uuid}`),

    listAnnouncements: () => apiGet('/center/announcements'),
    createAnnouncement: (data) => apiPost('/center/announcements', data),
    deleteAnnouncement: (uuid) => apiDelete(`/center/announcements/${uuid}`),

    downloadImportTemplate: (filename = 'center-students-template.csv') =>
      downloadCenterCsv('/center/import/template', filename),
    importStudents: (data) => apiPost('/center/import/students', data),

    listBackups: () => apiGet('/center/backups'),
    createBackup: () => apiPost('/center/backups', {}),
  },
};

export default centerApi;
