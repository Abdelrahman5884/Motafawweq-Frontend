/**
 * Motafawweq — Teacher Domain API Client
 * Enterprise-grade typed API module covering all 15 stages of the Teacher Portal.
 */

import { apiGet, apiPost, apiPut, apiDelete, tokenStorage } from './api';
import { API_BASE_URL } from '../constants';

export const teacherApi = {
  // ─── Stage 1 & 2: Settings, Profile & Preferences ────────────────────────────
  settings: {
    get: () => apiGet('/teacher/settings'),
    updateProfile: (data) => apiPut('/teacher/settings/profile', data),
    uploadAvatar: async (file) => {
      const formData = new FormData();
      formData.append('avatar', file);

      const token = tokenStorage.getAccessToken();
      const res = await fetch(`${API_BASE_URL}/teacher/settings/avatar`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok || payload?.success === false) {
        throw new Error(payload?.message || 'فشل رفع الصورة الشخصية.');
      }
      return payload;
    },
  },

  // ─── Stage 3: Encrypted Payout Accounts ──────────────────────────────────────
  payoutAccounts: {
    list: () => apiGet('/teacher/payout-accounts'),
    create: (data) => apiPost('/teacher/payout-accounts', data),
    toggleActive: (uuid) => apiPatch(`/teacher/payout-accounts/${uuid}/toggle-active`),
    setDefault: (uuid) => apiPatch(`/teacher/payout-accounts/${uuid}/set-default`),
    delete: (uuid) => apiDelete(`/teacher/payout-accounts/${uuid}`),
  },

  // ─── Stage 4: Course Management ──────────────────────────────────────────────
  courses: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/courses${qs ? `?${qs}` : ''}`);
    },
    get: (uuid) => apiGet(`/teacher/courses/${uuid}`),
    create: (data) => apiPost('/teacher/courses', data),
    update: (uuid, data) => apiPut(`/teacher/courses/${uuid}`, data),
    toggleStatus: (uuid) => apiPatch(`/teacher/courses/${uuid}/toggle-status`),
    delete: (uuid) => apiDelete(`/teacher/courses/${uuid}`),
  },

  // ─── Stage 5 & 6: Studio Lessons & Workspace ─────────────────────────────────
  studio: {
    listLessons: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/studio/lessons${qs ? `?${qs}` : ''}`);
    },
    getLesson: (uuid) => apiGet(`/teacher/studio/lessons/${uuid}`),
    createLesson: (data) => apiPost('/teacher/studio/lessons', data),
    uploadMedia: async (uuid, file, options = {}) => {
      const formData = new FormData();
      formData.append('media_file', file);
      if (options.duration_seconds) formData.append('duration_seconds', options.duration_seconds);

      const token = tokenStorage.getAccessToken();
      const res = await fetch(`${API_BASE_URL}/teacher/studio/lessons/${uuid}/media`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok || payload?.success === false) {
        throw new Error(payload?.message || 'فشل رفع ملف الوسائط.');
      }
      return payload;
    },
    uploadAttachment: async (uuid, file, type = 'pdf', titleAr = '') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      if (titleAr) formData.append('title_ar', titleAr);

      const token = tokenStorage.getAccessToken();
      const res = await fetch(`${API_BASE_URL}/teacher/studio/lessons/${uuid}/attachments`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok || payload?.success === false) {
        throw new Error(payload?.message || 'فشل رفع المرفق.');
      }
      return payload;
    },
    deleteAttachment: (uuid, attachmentUuid) =>
      apiDelete(`/teacher/studio/lessons/${uuid}/attachments/${attachmentUuid}`),
  },

  workspace: {
    getLesson: (uuid) => apiGet(`/teacher/workspace/lessons/${uuid}`),
    updateWorkspace: (uuid, data) => apiPut(`/teacher/workspace/lessons/${uuid}`, data),
    saveChapters: (uuid, chapters) =>
      apiPost(`/teacher/workspace/lessons/${uuid}/chapters`, { chapters }),
    saveTranscripts: (uuid, segments) =>
      apiPost(`/teacher/workspace/lessons/${uuid}/transcripts`, { segments }),
    saveConceptGraph: (uuid, treeData) =>
      apiPost(`/teacher/workspace/lessons/${uuid}/concept-graph`, { tree_data: treeData }),
  },

  // ─── Stage 7 & 9: Study Groups, Schedule & QR Attendance ────────────────────
  groups: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/study-groups${qs ? `?${qs}` : ''}`);
    },
    get: (uuid) => apiGet(`/teacher/study-groups/${uuid}`),
    create: (data) => apiPost('/teacher/study-groups', data),
    update: (uuid, data) => apiPut(`/teacher/study-groups/${uuid}`, data),
    delete: (uuid) => apiDelete(`/teacher/study-groups/${uuid}`),
    regenerateJoinCode: (uuid) => apiPost(`/teacher/study-groups/${uuid}/regenerate-join-code`),
  },

  schedule: {
    getWeekly: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/schedule${qs ? `?${qs}` : ''}`);
    },
    createNote: (data) => apiPost('/teacher/schedule/notes', data),
    toggleNote: (uuid) => apiPatch(`/teacher/schedule/notes/${uuid}/toggle`),
    deleteNote: (uuid) => apiDelete(`/teacher/schedule/notes/${uuid}`),
  },

  attendance: {
    scan: (groupUuid, barcode, method = 'qr_scan') =>
      apiPost(`/teacher/study-groups/${groupUuid}/attendance/scan`, { barcode, method }),
    toggleManual: (groupUuid, studentId, status, sessionId = null) =>
      apiPost(`/teacher/study-groups/${groupUuid}/attendance/toggle`, {
        student_id: studentId,
        status,
        session_id: sessionId,
      }),
    listSessions: (groupUuid) =>
      apiGet(`/teacher/study-groups/${groupUuid}/attendance/sessions`),
    getSessionDetails: (groupUuid, sessionUuid) =>
      apiGet(`/teacher/study-groups/${groupUuid}/attendance/sessions/${sessionUuid}`),
  },

  // ─── Stage 8: Student Roster & Invites ──────────────────────────────────────
  roster: {
    list: (groupUuid, params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/study-groups/${groupUuid}/roster${qs ? `?${qs}` : ''}`);
    },
    searchStudents: (query) =>
      apiGet(`/teacher/students/search?search=${encodeURIComponent(query)}`),
    invite: (groupUuid, studentId) =>
      apiPost(`/teacher/study-groups/${groupUuid}/invite`, { student_id: studentId }),
    accept: (groupUuid, enrollmentUuid) =>
      apiPost(`/teacher/study-groups/${groupUuid}/enrollments/${enrollmentUuid}/accept`),
    reject: (groupUuid, enrollmentUuid, reason = '') =>
      apiPost(`/teacher/study-groups/${groupUuid}/enrollments/${enrollmentUuid}/reject`, { reason }),
    remove: (groupUuid, enrollmentUuid) =>
      apiDelete(`/teacher/study-groups/${groupUuid}/enrollments/${enrollmentUuid}`),
  },

  // ─── Stage 10 & 11: Exams & Grading ─────────────────────────────────────────
  exams: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/exams${qs ? `?${qs}` : ''}`);
    },
    get: (uuid) => apiGet(`/teacher/exams/${uuid}`),
    create: (data) => apiPost('/teacher/exams', data),
    update: (uuid, data) => apiPut(`/teacher/exams/${uuid}`, data),
    toggleStatus: (uuid) => apiPatch(`/teacher/exams/${uuid}/toggle-status`),
    toggleResults: (uuid) => apiPatch(`/teacher/exams/${uuid}/toggle-results`),
    duplicate: (uuid) => apiPost(`/teacher/exams/${uuid}/duplicate`),
    delete: (uuid) => apiDelete(`/teacher/exams/${uuid}`),

    listSubmissions: (uuid, params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/exams/${uuid}/submissions${qs ? `?${qs}` : ''}`);
    },
    getSubmission: (uuid, submissionUuid) =>
      apiGet(`/teacher/exams/${uuid}/submissions/${submissionUuid}`),
    gradeEssayAnswer: (uuid, submissionUuid, answerId, pointsAwarded, teacherFeedback = '') =>
      apiPatch(`/teacher/exams/${uuid}/submissions/${submissionUuid}/grade-essay`, {
        answer_id: answerId,
        points_awarded: pointsAwarded,
        teacher_feedback: teacherFeedback,
      }),
  },

  // ─── Stage 12: Homework Management & Grading ────────────────────────────────
  homeworks: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/homeworks${qs ? `?${qs}` : ''}`);
    },
    get: (uuid) => apiGet(`/teacher/homeworks/${uuid}`),
    create: (data) => apiPost('/teacher/homeworks', data),
    update: (uuid, data) => apiPut(`/teacher/homeworks/${uuid}`, data),
    delete: (uuid) => apiDelete(`/teacher/homeworks/${uuid}`),
    listSubmissions: (uuid, params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/homeworks/${uuid}/submissions${qs ? `?${qs}` : ''}`);
    },
    getSubmission: (uuid, submissionUuid) =>
      apiGet(`/teacher/homeworks/${uuid}/submissions/${submissionUuid}`),
    gradeSubmission: (uuid, submissionUuid, gradeScore, feedbackAr = '') =>
      apiPatch(`/teacher/homeworks/${uuid}/submissions/${submissionUuid}/grade`, {
        grade_score: gradeScore,
        teacher_feedback_ar: feedbackAr,
      }),
  },

  // ─── Stage 13: Leagues & Leaderboards ───────────────────────────────────────
  leagues: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/leagues${qs ? `?${qs}` : ''}`);
    },
    get: (uuid) => apiGet(`/teacher/leagues/${uuid}`),
    create: (data) => apiPost('/teacher/leagues', data),
    awardXp: (uuid, studentId, xpPoints, reason = '') =>
      apiPost(`/teacher/leagues/${uuid}/award-xp`, {
        student_id: studentId,
        xp_points: xpPoints,
        reason,
      }),
    recalculate: (uuid) => apiPost(`/teacher/leagues/${uuid}/recalculate`),
    delete: (uuid) => apiDelete(`/teacher/leagues/${uuid}`),
  },

  // ─── Stage 14: Analytics & Dashboard ────────────────────────────────────────
  dashboard: {
    get: () => apiGet('/teacher/dashboard'),
  },

  analytics: {
    getOverview: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/analytics/overview${qs ? `?${qs}` : ''}`);
    },
    getWeakAreas: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/analytics/weak-areas${qs ? `?${qs}` : ''}`);
    },
    getAtRiskRadar: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/analytics/at-risk-radar${qs ? `?${qs}` : ''}`);
    },
    resolveRiskSignal: (uuid, action = 'resolve', notes = '') =>
      apiPost(`/teacher/analytics/at-risk/${uuid}/resolve`, { action, notes }),
  },

  // ─── Stage 15: Certificates, Financials & Billing ───────────────────────────
  certificates: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/certificates${qs ? `?${qs}` : ''}`);
    },
    issue: (data) => apiPost('/teacher/certificates', data),
    bulkIssue: (data) => apiPost('/teacher/certificates/bulk-issue', data),
    revoke: (uuid, reason = '') =>
      apiPatch(`/teacher/certificates/${uuid}/revoke`, { reason }),
    verifyPublic: (certNumber) =>
      apiGet(`/verify-certificate/${encodeURIComponent(certNumber)}`),
  },

  financials: {
    getOverview: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/financials${qs ? `?${qs}` : ''}`);
    },
    confirmPayment: (uuid) =>
      apiPost(`/teacher/financials/payments/${uuid}/confirm`),
    rejectPayment: (uuid, reason = '', notes = '') =>
      apiPost(`/teacher/financials/payments/${uuid}/reject`, { reason, notes }),
  },

  billing: {
    getSummary: () => apiGet('/teacher/billing'),
    validateCoupon: (code, orderAmount = 0) =>
      apiPost('/teacher/billing/validate-coupon', { code, order_amount: orderAmount }),
    subscribe: (data) => apiPost('/teacher/billing/subscribe', data),
  },
};

/**
 * Convenience helper for PATCH requests using fetch.
 */
function apiPatch(path, body = {}, opts = {}) {
  const token = tokenStorage.getAccessToken();
  return fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    ...opts,
  }).then(async (res) => {
    const payload = await res.json().catch(() => ({}));
    if (!res.ok || payload?.success === false) {
      throw new Error(payload?.message || `HTTP ${res.status}`);
    }
    return payload;
  });
}

export default teacherApi;

