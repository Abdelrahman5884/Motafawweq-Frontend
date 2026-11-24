/**
 * Motafawweq — Platform Admin & Public Catalog API Client
 * Covers all /api/v1/admin/... and /api/v1/public/... endpoints with
 * Bearer auth, Idempotency-Key support, and formula-safe CSV downloads.
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

const makeIdempotencyHeader = (prefix = 'adm') => {
  const rand =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return { 'Idempotency-Key': `${prefix}:${rand}` };
};

/**
 * Downloads a formula-safe UTF-8 CSV directly from an authenticated admin backend endpoint.
 */
export async function downloadAdminCsv(path, filename = 'admin-export.csv') {
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

/**
 * Downloads a real Office Open XML Excel (.xlsx) workbook directly from an authenticated admin endpoint.
 */
export async function downloadAdminExcel(path, filename = 'admin-export.xlsx') {
  const token = tokenStorage.getAccessToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errPayload = await res.json().catch(() => ({}));
    throw new ApiError({
      message: errPayload?.message || `فشل تصدير ملف Excel (${res.status})`,
      status: res.status,
      errorCode: errPayload?.error_code || null,
    });
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

export const adminApi = {
  // ─── 1. Executive Dashboard, KPIs & Real-Time Traffic ──────────────────────
  dashboard: {
    get: (params = {}) => apiGet(`/admin/dashboard${buildQuery(params)}`),
    getActiveUsers: (mode = 'hourly') =>
      apiGet(`/admin/dashboard/active-users${buildQuery({ mode })}`),
  },

  // ─── 2. Honor Roll Cup Champions & General Republic League ─────────────────
  champions: {
    list: (params = {}) => apiGet(`/admin/champions${buildQuery(params)}`),
    create: (data) =>
      apiPost('/admin/champions', data, { headers: makeIdempotencyHeader('champ-create') }),
    approveNominee: (data) =>
      apiPost('/admin/champions/approve-nominee', data, {
        headers: makeIdempotencyHeader(`champ-approve-${data?.studentId ?? data?.student_id ?? 'std'}`),
      }),
    uploadPhoto: (file) => {
      const formData = new FormData();
      formData.append('photo', file);
      return apiPost('/admin/champions/upload-photo', formData);
    },
    update: (uuid, data) => apiPut(`/admin/champions/${uuid}`, data),
    togglePin: (uuid) => apiPatch(`/admin/champions/${uuid}/toggle-pin`, {}),
    delete: (uuid) => apiDelete(`/admin/champions/${uuid}`),
  },

  republicLeague: {
    get: (params = {}) => apiGet(`/admin/leagues/republic${buildQuery(params)}`),
    getLeaderboard: (params = {}) =>
      apiGet(`/admin/leagues/republic/leaderboard${buildQuery(params)}`),
    getNominees: (params = {}) =>
      apiGet(`/admin/leagues/republic/nominees${buildQuery(params)}`),
    start: (data = {}) =>
      apiPost('/admin/leagues/republic/start', data, { headers: makeIdempotencyHeader('rep-start') }),
    stop: (data = {}) => apiPost('/admin/leagues/republic/stop', data),
    announceEnd: (data = {}) =>
      apiPost('/admin/leagues/republic/announce-end', data, {
        headers: makeIdempotencyHeader('rep-announce-end'),
      }),
  },

  // ─── 3. User Management, KYC Verification & Security Controls ──────────────
  users: {
    list: (params = {}) => apiGet(`/admin/users${buildQuery(params)}`),
    listVerifications: (params = {}) => apiGet(`/admin/users/verifications${buildQuery(params)}`),
    get: (id) => apiGet(`/admin/users/${id}`),
    create: (data) =>
      apiPost('/admin/users', data, { headers: makeIdempotencyHeader('usr-create') }),
    update: (id, data) => apiPut(`/admin/users/${id}`, data),
    toggleStatus: (id) => apiPatch(`/admin/users/${id}/toggle-status`, {}),
    verify: (id, data = {}) =>
      apiPost(`/admin/users/${id}/verify`, data, { headers: makeIdempotencyHeader(`usr-verify-${id}`) }),
    rejectVerification: (id, data = {}) =>
      apiPost(`/admin/users/${id}/reject-verification`, data, {
        headers: makeIdempotencyHeader(`usr-reject-${id}`),
      }),
    resetPassword: (id) =>
      apiPost(`/admin/users/${id}/reset-password`, {}, {
        headers: makeIdempotencyHeader(`usr-reset-${id}`),
      }),
    revokeSessions: (id) => apiPost(`/admin/users/${id}/revoke-sessions`, {}),
    delete: (id) => apiDelete(`/admin/users/${id}`),
    exportCsv: (params = {}, filename = 'motafawweq-users.csv') =>
      downloadAdminCsv(`/admin/users/export${buildQuery(params)}`, filename),
    exportExcel: (params = {}, filename = 'motafawweq-users.xlsx') =>
      downloadAdminExcel(`/admin/users/export-excel${buildQuery(params)}`, filename),
  },

  // ─── 4. Courses Moderation & Ministry of Education Curricula CMS ───────────
  courses: {
    list: (params = {}) => apiGet(`/admin/courses${buildQuery(params)}`),
    get: (uuid) => apiGet(`/admin/courses/${uuid}`),
    togglePublish: (uuid, data = {}) => apiPatch(`/admin/courses/${uuid}/toggle-publish`, data),
    toggleFeatured: (uuid) => apiPatch(`/admin/courses/${uuid}/toggle-featured`, {}),
    delete: (uuid, data = {}) => apiDelete(`/admin/courses/${uuid}`, { body: data }),
  },

  ministryCurricula: {
    list: (params = {}) => apiGet(`/admin/ministry-curricula${buildQuery(params)}`),
    get: (uuid) => apiGet(`/admin/ministry-curricula/${uuid}`),
    create: (data) =>
      apiPost('/admin/ministry-curricula', data, {
        headers: makeIdempotencyHeader('moe-curr-create'),
      }),
    update: (uuid, data) => apiPut(`/admin/ministry-curricula/${uuid}`, data),
    togglePublish: (uuid) => apiPatch(`/admin/ministry-curricula/${uuid}/toggle-publish`, {}),
    delete: (uuid, data = {}) => apiDelete(`/admin/ministry-curricula/${uuid}`, { body: data }),

    // Units & Lessons management inside a Ministry course
    addUnit: (uuid, data) => apiPost(`/admin/ministry-curricula/${uuid}/units`, data),
    updateUnit: (uuid, unitIndex, data) =>
      apiPut(`/admin/ministry-curricula/${uuid}/units/${unitIndex}`, data),
    deleteUnit: (uuid, unitIndex) =>
      apiDelete(`/admin/ministry-curricula/${uuid}/units/${unitIndex}`),

    addLesson: (uuid, data) => apiPost(`/admin/ministry-curricula/${uuid}/lessons`, data),
    updateLesson: (uuid, unitIndex, lessonId, data) =>
      apiPut(`/admin/ministry-curricula/${uuid}/units/${unitIndex}/lessons/${encodeURIComponent(lessonId)}`, data),
    deleteLesson: (uuid, unitIndex, lessonId) =>
      apiDelete(`/admin/ministry-curricula/${uuid}/units/${unitIndex}/lessons/${encodeURIComponent(lessonId)}`),
    reorderLessons: (uuid, unitIndex, lessonIds) =>
      apiPatch(`/admin/ministry-curricula/${uuid}/units/${unitIndex}/lessons/reorder`, { lessonIds }),
  },

  // ─── 5. Financials: Overview, Invoices, Manual Costs, Pricing Plans, Payouts & Coupons
  financials: {
    getOverview: () => apiGet('/admin/financials/overview'),

    invoices: {
      list: (params = {}) => apiGet(`/admin/financials/invoices${buildQuery(params)}`),
    },

    expenses: {
      list: (params = {}) => apiGet(`/admin/financials/expenses${buildQuery(params)}`),
      create: (data) =>
        apiPost('/admin/financials/expenses', data, { headers: makeIdempotencyHeader('exp-create') }),
      update: (uuid, data) => apiPut(`/admin/financials/expenses/${uuid}`, data),
      delete: (uuid) => apiDelete(`/admin/financials/expenses/${uuid}`),
    },

    plans: {
      list: (params = {}) => apiGet(`/admin/financials/plans${buildQuery(params)}`),
      create: (data) =>
        apiPost('/admin/financials/plans', data, { headers: makeIdempotencyHeader('plan-create') }),
      update: (uuid, data) => apiPut(`/admin/financials/plans/${uuid}`, data),
      toggleActive: (uuid) => apiPatch(`/admin/financials/plans/${uuid}/toggle-active`, {}),
      delete: (uuid) => apiDelete(`/admin/financials/plans/${uuid}`),
      resetDefaults: () =>
        apiPost('/admin/financials/plans/reset-defaults', {}, {
          headers: makeIdempotencyHeader('plan-reset'),
        }),
    },

    payouts: {
      list: (params = {}) => apiGet(`/admin/financials/payouts${buildQuery(params)}`),
      create: (data) =>
        apiPost('/admin/financials/payouts', data, { headers: makeIdempotencyHeader('payout-create') }),
      approve: (uuid, data = {}) =>
        apiPost(`/admin/financials/payouts/${uuid}/approve`, data, {
          headers: makeIdempotencyHeader(`payout-approve-${uuid}`),
        }),
      reject: (uuid, data = {}) =>
        apiPost(`/admin/financials/payouts/${uuid}/reject`, data, {
          headers: makeIdempotencyHeader(`payout-reject-${uuid}`),
        }),
    },

    coupons: {
      list: (params = {}) => apiGet(`/admin/financials/coupons${buildQuery(params)}`),
      create: (data) =>
        apiPost('/admin/financials/coupons', data, { headers: makeIdempotencyHeader('coupon-create') }),
      update: (uuid, data) => apiPut(`/admin/financials/coupons/${uuid}`, data),
      toggleActive: (uuid) => apiPatch(`/admin/financials/coupons/${uuid}/toggle-active`, {}),
      delete: (uuid) => apiDelete(`/admin/financials/coupons/${uuid}`),
    },
  },

  // ─── 6. Global Center Gate Attendance Monitoring ───────────────────────────
  attendance: {
    getGates: (params = {}) => apiGet(`/admin/attendance/gates${buildQuery(params)}`),
    exportCsv: (params = {}, filename = 'motafawweq-gate-logs.csv') =>
      downloadAdminCsv(`/admin/attendance/gates/export${buildQuery(params)}`, filename),
  },

  // ─── 7. Platform Announcements & News Ticker ───────────────────────────────
  announcements: {
    list: (params = {}) => apiGet(`/admin/announcements${buildQuery(params)}`),
    create: (data) =>
      apiPost('/admin/announcements', data, { headers: makeIdempotencyHeader('ann-create') }),
    update: (uuid, data) => apiPut(`/admin/announcements/${uuid}`, data),
    toggleActive: (uuid) => apiPatch(`/admin/announcements/${uuid}/toggle-active`, {}),
    delete: (uuid) => apiDelete(`/admin/announcements/${uuid}`),
  },

  // ─── 8. System Telemetry, Policies, Cache & Global Audit Logs ──────────────
  system: {
    getOverview: () => apiGet('/admin/system/overview'),
    updateSettings: (data) => apiPut('/admin/system/settings', data),
    flushCache: () => apiPost('/admin/system/cache/flush', {}),
    listAuditLogs: (params = {}) => apiGet(`/admin/system/audit-logs${buildQuery(params)}`),
    getSecuritySummary: () => apiGet('/admin/system/security-summary'),
  },
};

export const publicPlatformApi = {
  champions: () => apiGet('/public/champions', { skipAuthRefresh: true }),
  announcements: (audience = 'all') =>
    apiGet(`/public/announcements${buildQuery({ audience })}`, { skipAuthRefresh: true }),
  pricingPlans: (role = null) =>
    apiGet(`/public/pricing-plans${buildQuery({ role })}`, { skipAuthRefresh: true }),
  status: () => apiGet('/public/status', { skipAuthRefresh: true }),
};

export default adminApi;
