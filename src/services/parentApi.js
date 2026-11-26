/**
 * Motafawweq — Parent Portal API Client
 * Connects the Parent Dashboard to all /api/v1/parent/... endpoints with
 * Bearer authentication, Idempotency-Key headers, and formula-safe CSV export.
 */

import { apiGet, apiPost, apiPut, apiDelete, tokenStorage, ApiError } from './api';
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

const makeIdempotencyHeader = (prefix = 'par') => {
  const rand =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return { 'Idempotency-Key': `${prefix}:${rand}` };
};

export async function downloadParentScorecardCsv(studentId, filename = 'student-scorecard.csv') {
  const token = tokenStorage.getAccessToken();
  const res = await fetch(`${API_BASE_URL}/parent/children/${studentId}/exams/export`, {
    method: 'GET',
    headers: {
      Accept: 'text/csv, application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errPayload = await res.json().catch(() => ({}));
    throw new ApiError({
      message: errPayload?.message || `فشل تحميل كشف الدرجات (${res.status})`,
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

export const parentApi = {
  getOverview: (params = {}) => apiGet(`/parent/overview${buildQuery(params)}`),

  getChildDashboard: (studentId) => apiGet(`/parent/children/${studentId}/dashboard`),
  getChildCourses: (studentId) => apiGet(`/parent/children/${studentId}/courses`),
  getChildAttendance: (studentId, params = {}) =>
    apiGet(`/parent/children/${studentId}/attendance${buildQuery(params)}`),
  getChildExams: (studentId, params = {}) =>
    apiGet(`/parent/children/${studentId}/exams${buildQuery(params)}`),
  exportChildExamsCsv: (studentId, filename) => downloadParentScorecardCsv(studentId, filename),
  getChildHomework: (studentId, params = {}) =>
    apiGet(`/parent/children/${studentId}/homework${buildQuery(params)}`),
  getChildFinancials: (studentId) => apiGet(`/parent/children/${studentId}/financials`),

  linkChild: (studentCode) =>
    apiPost(
      '/parent/children/link',
      { student_code: studentCode },
      { headers: makeIdempotencyHeader('par-link') }
    ),

  unlinkChild: (studentId) => apiDelete(`/parent/children/${studentId}`),

  listInquiries: (params = {}) => apiGet(`/parent/inquiries${buildQuery(params)}`),
  createInquiry: (payload) =>
    apiPost('/parent/inquiries', payload, { headers: makeIdempotencyHeader('par-inq') }),

  getSettings: () => apiGet('/parent/settings'),
  updateSettings: (payload) => apiPut('/parent/settings', payload),
};

export default parentApi;
