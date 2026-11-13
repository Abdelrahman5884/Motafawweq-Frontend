/**
 * Motafawweq — Teacher Domain API Client
 * Enterprise-grade typed API module covering all 15 stages of the Teacher Portal.
 * Strictly aligned with routes/api.php and backend controllers.
 */

import { apiGet, apiPost, apiPut, apiDelete, tokenStorage } from './api';
import { API_BASE_URL } from '../constants';
import storageService from './storageService';

export const teacherApi = {
  // ─── Stage 1 & 2: Settings, Profile & Preferences ────────────────────────────
  settings: {
    get: () => apiGet('/teacher/settings'),
    update: (data) => apiPut('/teacher/settings', data),
    updateProfile: (data) => apiPut('/teacher/settings/profile', data),
    updateStages: (stagesTaught) =>
      apiPut('/teacher/settings/stages', { stages_taught: stagesTaught }),
    updatePreferences: (data) => apiPut('/teacher/settings/preferences', data),
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
    delete: (uuid) => apiDelete(`/teacher/courses/${uuid}`),
  },

  // ─── Stage 5: Studio Lessons & Attachments ──────────────────────────────────
  studio: {
    listLessons: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/lessons${qs ? `?${qs}` : ''}`);
    },
    getLesson: (uuid) => apiGet(`/teacher/lessons/${uuid}`),
    createLesson: (data) => apiPost('/teacher/lessons', data),
    updateLesson: (uuid, data) => apiPut(`/teacher/lessons/${uuid}`, data),
    deleteLesson: (uuid) => apiDelete(`/teacher/lessons/${uuid}`),

    uploadMedia: async (uuid, file, options = {}) => {
      const formData = new FormData();
      formData.append('media', file);
      if (options.mode) formData.append('mode', options.mode);
      if (options.duration_seconds) formData.append('duration_seconds', options.duration_seconds);

      const token = tokenStorage.getAccessToken();
      const res = await fetch(`${API_BASE_URL}/teacher/lessons/${uuid}/media`, {
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

    uploadPdf: async (uuid, file, titleAr = '', pagesCount = null) => {
      const formData = new FormData();
      formData.append('file', file);
      if (titleAr) formData.append('title', titleAr);
      if (pagesCount) formData.append('pagesCount', pagesCount);

      const token = tokenStorage.getAccessToken();
      const res = await fetch(`${API_BASE_URL}/teacher/lessons/${uuid}/attachments/pdfs`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok || payload?.success === false) {
        throw new Error(payload?.message || 'فشل رفع ملف الـ PDF.');
      }
      return payload;
    },

    uploadImage: async (uuid, file, { titleAr = '', captionAr = '', order = 1 } = {}) => {
      const formData = new FormData();
      formData.append('file', file);
      if (titleAr) formData.append('title', titleAr);
      if (captionAr) formData.append('caption', captionAr);
      if (order !== undefined) formData.append('order', order);

      const token = tokenStorage.getAccessToken();
      const res = await fetch(`${API_BASE_URL}/teacher/lessons/${uuid}/attachments/images`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok || payload?.success === false) {
        throw new Error(payload?.message || 'فشل رفع الصورة.');
      }
      return payload;
    },

    uploadAttachment: async (uuid, file, type = 'pdf', options = {}) => {
      if (type === 'audio' || type === 'media') {
        return teacherApi.studio.uploadMedia(uuid, file, options);
      }
      if (type === 'pdf') {
        return teacherApi.studio.uploadPdf(uuid, file, options.titleAr || file.name);
      }
      return teacherApi.studio.uploadImage(uuid, file, options);
    },

    uploadMediaDirect: async (uuid, file, { onProgress = null, durationSeconds = null } = {}) => {
      return storageService.uploadFile({
        entityType: 'lesson_media',
        entityId: uuid,
        file,
        duration: durationSeconds,
        onProgress,
      });
    },

    uploadAttachmentDirect: async (uuid, file, { type = 'pdf', titleAr = '', captionAr = '', onProgress = null } = {}) => {
      return storageService.uploadFile({
        entityType: 'lesson_attachment',
        entityId: uuid,
        file,
        title: titleAr || file.name,
        caption: captionAr,
        onProgress,
      });
    },

    reorderAttachments: (uuid, attachmentUuids) =>
      apiPut(`/teacher/lessons/${uuid}/attachments/reorder`, {
        attachment_uuids: attachmentUuids,
      }),

    deleteAttachment: (uuid, attachmentUuid) =>
      apiDelete(`/teacher/lessons/${uuid}/attachments/${attachmentUuid}`),

    getMediaStreamUrl: (uuid) => `${API_BASE_URL}/teacher/lessons/${uuid}/media/stream`,
    getAttachmentStreamUrl: (uuid, attachmentUuid) =>
      `${API_BASE_URL}/teacher/lessons/${uuid}/attachments/${attachmentUuid}/stream`,
  },

  // ─── Stage 6: Lesson Workspace (Chapters, Transcript, Concept Graph) ─────────
  workspace: {
    index: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/workspace${qs ? `?${qs}` : ''}`);
    },
    getLesson: (uuid) => apiGet(`/teacher/workspace/lessons/${uuid}`),
    syncChapters: (uuid, chapters) =>
      apiPut(`/teacher/workspace/lessons/${uuid}/chapters`, { chapters }),
    syncTranscript: (uuid, transcript) =>
      apiPut(`/teacher/workspace/lessons/${uuid}/transcript`, { transcript }),
    saveConceptGraph: (uuid, treeData) =>
      apiPut(`/teacher/workspace/lessons/${uuid}/concept-graph`, { tree_data: treeData }),
  },

  // ─── Stage 7: Study Groups ───────────────────────────────────────────────────
  groups: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/groups${qs ? `?${qs}` : ''}`);
    },
    get: (uuid) => apiGet(`/teacher/groups/${uuid}`),
    create: (data) => apiPost('/teacher/groups', data),
    update: (uuid, data) => apiPut(`/teacher/groups/${uuid}`, data),
    delete: (uuid) => apiDelete(`/teacher/groups/${uuid}`),
    regenerateCode: (uuid) => apiPost(`/teacher/groups/${uuid}/regenerate-code`),
  },

  // ─── Stage 8: Student Roster & Invites ───────────────────────────────────────
  roster: {
    list: (groupUuid, params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/groups/${groupUuid}/roster${qs ? `?${qs}` : ''}`);
    },
    searchStudents: (query) =>
      apiGet(`/teacher/students/search?search=${encodeURIComponent(query)}`),
    invite: (groupUuid, studentId) =>
      apiPost(`/teacher/groups/${groupUuid}/invite`, { student_id: studentId }),
    accept: (groupUuid, enrollmentUuid) =>
      apiPost(`/teacher/groups/${groupUuid}/enrollments/${enrollmentUuid}/accept`),
    reject: (groupUuid, enrollmentUuid, reason = '') =>
      apiPost(`/teacher/groups/${groupUuid}/enrollments/${enrollmentUuid}/reject`, { reason }),
    remove: (groupUuid, enrollmentUuid) =>
      apiDelete(`/teacher/groups/${groupUuid}/enrollments/${enrollmentUuid}`),
  },

  // ─── Stage 9: Attendance & Schedule ──────────────────────────────────────────
  attendance: {
    scan: (groupUuid, barcode, method = 'qr_scan') =>
      apiPost(`/teacher/groups/${groupUuid}/attendance/scan`, { barcode, method }),
    toggleManual: (groupUuid, data) =>
      apiPost(`/teacher/groups/${groupUuid}/attendance/toggle`, data),
    listSessions: (groupUuid) =>
      apiGet(`/teacher/groups/${groupUuid}/attendance/sessions`),
    getSessionDetails: (groupUuid, sessionUuid) =>
      apiGet(`/teacher/groups/${groupUuid}/attendance/sessions/${sessionUuid}`),
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
    gradeEssayAnswer: (uuid, submissionUuid, { answerId, pointsAwarded, teacherFeedback = '' }) =>
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
    create: async (data, file = null) => {
      if (file instanceof File) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, val]) => {
          if (val !== undefined && val !== null) formData.append(key, val);
        });
        formData.append('file', file);

        const token = tokenStorage.getAccessToken();
        const res = await fetch(`${API_BASE_URL}/teacher/homeworks`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        });

        const payload = await res.json().catch(() => ({}));
        if (!res.ok || payload?.success === false) {
          throw new Error(payload?.message || 'فشل إنشاء الواجب.');
        }
        return payload;
      }
      return apiPost('/teacher/homeworks', data);
    },
    update: (uuid, data) => apiPut(`/teacher/homeworks/${uuid}`, data),
    delete: (uuid) => apiDelete(`/teacher/homeworks/${uuid}`),

    listSubmissions: (uuid, params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/homeworks/${uuid}/submissions${qs ? `?${qs}` : ''}`);
    },
    getSubmission: (uuid, submissionUuid) =>
      apiGet(`/teacher/homeworks/${uuid}/submissions/${submissionUuid}`),
    gradeSubmission: (uuid, submissionUuid, { gradeScore, feedbackAr = '' }) =>
      apiPatch(`/teacher/homeworks/${uuid}/submissions/${submissionUuid}/grade`, {
        grade_score: gradeScore,
        teacher_feedback_ar: feedbackAr,
      }),
    downloadAttachmentUrl: (uuid) => `${API_BASE_URL}/teacher/homeworks/${uuid}/attachment`,
    downloadSubmissionAttachmentUrl: (submissionUuid) =>
      `${API_BASE_URL}/teacher/homeworks/submissions/${submissionUuid}/attachment`,
  },

  // ─── Stage 13: Course Leagues & XP ──────────────────────────────────────────
  leagues: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/leagues${qs ? `?${qs}` : ''}`);
    },
    get: (uuid) => apiGet(`/teacher/leagues/${uuid}`),
    create: (data) => apiPost('/teacher/leagues', data),
    update: (uuid, data) => apiPut(`/teacher/leagues/${uuid}`, data),
    addParticipant: (uuid, data) => apiPost(`/teacher/leagues/${uuid}/participants`, data),
    awardXp: (uuid, { studentId, xpPoints, reason = '' }) =>
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
    resolveRiskSignal: (uuid, { action = 'resolve', notes = '' } = {}) =>
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
    verifyPublic: (serialNumber) =>
      apiGet(`/verify-certificate/${encodeURIComponent(serialNumber)}`),
  },

  financials: {
    getOverview: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiGet(`/teacher/financials${qs ? `?${qs}` : ''}`);
    },
    confirmPayment: (uuid) =>
      apiPost(`/teacher/financials/payments/${uuid}/confirm`),
    rejectPayment: (uuid, { reason = '', notes = '' } = {}) =>
      apiPost(`/teacher/financials/payments/${uuid}/reject`, { reason, notes }),
  },

  billing: {
    getSummary: () => apiGet('/teacher/billing'),
    validateCoupon: (code, orderAmount = 0) =>
      apiPost('/teacher/billing/validate-coupon', { code, order_amount: orderAmount }),
    subscribe: (data) => apiPost('/teacher/billing/subscribe', data),
  },

  // Centralized Supabase Storage
  storage: storageService,
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
