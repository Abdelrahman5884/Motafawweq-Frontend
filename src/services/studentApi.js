/**
 * Motafawweq — Student Portal API Service Layer
 * Connects Student views and contexts to the secured /api/v1/student/* endpoints.
 */

import { apiGet, apiPost, apiPut, apiPatch, apiDelete, apiRequest } from './api';

const makeIdempotencyKey = (prefix = 'std') =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const buildQueryString = (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    const trimmed = typeof value === 'string' ? value.trim() : '';
    if (trimmed) {
      qs.set(key, trimmed);
    }
  });
  const encoded = qs.toString();
  return encoded ? `?${encoded}` : '';
};

export const studentApi = {
  // Phase 2: Profile, Study Goals, Preferences & Privacy
  profile: {
    get: () => apiGet('/student/profile'),
    update: (data) => apiPut('/student/profile', data),
    uploadAvatar: (file) => {
      const formData = new FormData();
      formData.append('avatar', file);
      return apiRequest('/student/profile/avatar', {
        method: 'POST',
        body: formData,
      });
    },
    deleteAvatar: () => apiDelete('/student/profile/avatar'),
  },

  // Phase 3: Study Groups, Schedule, Personal Study Sessions & Attendance
  groups: {
    list: () => apiGet('/student/groups'),
    join: (joinCode, extra = {}) =>
      apiRequest('/student/groups/join', {
        method: 'POST',
        headers: { 'Idempotency-Key': makeIdempotencyKey('join') },
        body: { join_code: joinCode, ...extra },
      }),
    acceptInvitation: (enrollmentUuid) =>
      apiRequest(`/student/groups/invitations/${enrollmentUuid}/accept`, {
        method: 'POST',
        headers: { 'Idempotency-Key': makeIdempotencyKey('inv-acc') },
      }),
    declineInvitation: (enrollmentUuid) =>
      apiRequest(`/student/groups/invitations/${enrollmentUuid}/decline`, {
        method: 'POST',
        headers: { 'Idempotency-Key': makeIdempotencyKey('inv-dec') },
      }),
    leave: (groupUuid) => apiDelete(`/student/groups/${groupUuid}/leave`),
  },

  schedule: {
    getWeekly: () => apiGet('/student/schedule'),
    createStudySession: (data) => apiPost('/student/study-sessions', data),
    updateStudySession: (uuid, data) => apiPut(`/student/study-sessions/${uuid}`, data),
    toggleStudySession: (uuid) => apiPatch(`/student/study-sessions/${uuid}/toggle`),
    deleteStudySession: (uuid) => apiDelete(`/student/study-sessions/${uuid}`),
    createNote: (data) => apiPost('/student/schedule/notes', data),
    updateNote: (uuid, data) => apiPut(`/student/schedule/notes/${uuid}`, data),
    toggleNote: (uuid) => apiPatch(`/student/schedule/notes/${uuid}/toggle`),
    deleteNote: (uuid) => apiDelete(`/student/schedule/notes/${uuid}`),
  },

  attendance: {
    getOverview: () => apiGet('/student/attendance'),
  },

  // Phase 4: Courses, Lessons, Anti-Skip Progress Heartbeat, Bookmarks & Notes
  courses: {
    list: (search = '') => apiGet(`/student/courses${buildQueryString({ search })}`),
    get: (courseUuid) => apiGet(`/student/courses/${courseUuid}`),
  },

  lessons: {
    get: (lessonUuid) => apiGet(`/student/lessons/${lessonUuid}`),
    recordProgress: (lessonUuid, data) =>
      apiPost(`/student/lessons/${lessonUuid}/progress`, data),
    toggleComplete: (lessonUuid, isCompleted = null) =>
      apiPost(
        `/student/lessons/${lessonUuid}/toggle-complete`,
        isCompleted === null ? {} : { is_completed: Boolean(isCompleted) }
      ),
    toggleBookmark: (lessonUuid) =>
      apiPost(`/student/lessons/${lessonUuid}/bookmark`),
    createNote: (lessonUuid, data) =>
      apiPost(`/student/lessons/${lessonUuid}/notes`, data),
    updateNote: (noteUuid, data) =>
      apiPut(`/student/lessons/notes/${noteUuid}`, data),
    deleteNote: (noteUuid) => apiDelete(`/student/lessons/notes/${noteUuid}`),
  },

  // Phase 5: Exams, Timed Attempts & Mistake Bank
  exams: {
    list: (search = '') => apiGet(`/student/exams${buildQueryString({ search })}`),
    getResult: (examUuid) => apiGet(`/student/exams/${examUuid}/result`),
    start: (examUuid) =>
      apiRequest(`/student/exams/${examUuid}/start`, {
        method: 'POST',
        headers: { 'Idempotency-Key': makeIdempotencyKey('exam-start') },
      }),
    submit: (examUuid, data) =>
      apiRequest(`/student/exams/${examUuid}/submit`, {
        method: 'POST',
        headers: { 'Idempotency-Key': makeIdempotencyKey('exam-sub') },
        body: data,
      }),
    mistakeBank: () => apiGet('/student/mistake-bank'),
  },

  // Official Egyptian Ministry of Education Curricula & Guided Practice Exams
  ministry: {
    listCurricula: (gradeOrOpts = '') => {
      const params =
        typeof gradeOrOpts === 'string'
          ? { grade: gradeOrOpts }
          : { grade: gradeOrOpts?.grade || '', search: gradeOrOpts?.search || '' };
      return apiGet(`/student/ministry/curricula${buildQueryString(params)}`);
    },
    toggleUnit: (code, unitIndex) =>
      apiPost(`/student/ministry/curricula/${encodeURIComponent(code)}/units/${unitIndex}/toggle`, {}),
    listExams: (gradeOrOpts = '') => {
      const params =
        typeof gradeOrOpts === 'string'
          ? { grade: gradeOrOpts }
          : { grade: gradeOrOpts?.grade || '', search: gradeOrOpts?.search || '' };
      return apiGet(`/student/ministry/exams${buildQueryString(params)}`);
    },
    startExam: (code, { retake = false } = {}) =>
      apiRequest(`/student/ministry/exams/${encodeURIComponent(code)}/start`, {
        method: 'POST',
        headers: { 'Idempotency-Key': makeIdempotencyKey('moe-exam-start') },
        body: { retake: Boolean(retake) },
      }),
    submitExam: (code, data) =>
      apiRequest(`/student/ministry/exams/${encodeURIComponent(code)}/submit`, {
        method: 'POST',
        headers: { 'Idempotency-Key': makeIdempotencyKey('moe-exam-sub') },
        body: data,
      }),
    getExamResult: (code) =>
      apiGet(`/student/ministry/exams/${encodeURIComponent(code)}/result`),
  },

  // Phase 6: Homeworks
  homeworks: {
    list: () => apiGet('/student/homeworks'),
    submit: (homeworkUuid, formDataOrPayload) =>
      apiRequest(`/student/homeworks/${homeworkUuid}/submit`, {
        method: 'POST',
        headers: { 'Idempotency-Key': makeIdempotencyKey('hw-sub') },
        body: formDataOrPayload,
      }),
  },

  // Phase 7 & 8: Gamification, Leagues, Leaderboard & Certificates
  gamification: {
    workspace: (timezone) =>
      apiGet(
        timezone
          ? `/student/gamification/workspace?timezone=${encodeURIComponent(timezone)}`
          : '/student/gamification/workspace'
      ),
    summary: (timezone) =>
      apiGet(
        timezone
          ? `/student/gamification?timezone=${encodeURIComponent(timezone)}`
          : '/student/gamification'
      ),
    heatmap: (timezone) =>
      apiGet(
        timezone
          ? `/student/gamification/heatmap?timezone=${encodeURIComponent(timezone)}`
          : '/student/gamification/heatmap'
      ),
    challenges: (timezone) =>
      apiGet(
        timezone
          ? `/student/gamification/challenges?timezone=${encodeURIComponent(timezone)}`
          : '/student/gamification/challenges'
      ),
    leagues: () => apiGet('/student/leagues'),
    pastLeagues: () => apiGet('/student/leagues/history'),
    leaderboard: (leagueUuid) =>
      leagueUuid === 'general'
        ? apiGet('/student/leagues/general/leaderboard')
        : apiGet(`/student/leagues/${leagueUuid}/leaderboard`),
    certificates: () => apiGet('/student/certificates'),
    certificateEligibility: () => apiGet('/student/certificates/eligibility'),
    certificatesWorkspace: () => apiGet('/student/certificates/workspace'),
    claimCertificate: (targetId, track = 'teacher') =>
      apiRequest('/student/certificates/claim', {
        method: 'POST',
        headers: { 'Idempotency-Key': makeIdempotencyKey('cert-claim') },
        body: { track, target_id: targetId },
      }),
    verifyCertificate: (serialNumber) =>
      apiGet(`/verify-certificate/${encodeURIComponent(String(serialNumber || '').trim())}`),
  },

  // Phase 12: Converted Lectures Archive
  convertedLectures: {
    list: () => apiGet('/student/converted-lectures'),
    get: (uuid) => apiGet(`/student/converted-lectures/${uuid}`),
    status: (uuid) => apiGet(`/student/converted-lectures/${uuid}/status`),
    retry: (uuid) => apiPost(`/student/converted-lectures/${uuid}/retry`, {}),
    generateQuiz: (uuid, { quizCount = 5 } = {}) =>
      apiPost(`/student/converted-lectures/${uuid}/quiz`, { quiz_count: quizCount }),
    create: (formDataOrPayload) =>
      apiRequest('/student/converted-lectures', {
        method: 'POST',
        headers: { 'Idempotency-Key': makeIdempotencyKey('conv') },
        body: formDataOrPayload,
      }),
    addAttachments: (uuid, formData) =>
      apiRequest(`/student/converted-lectures/${uuid}/attachments`, {
        method: 'POST',
        body: formData,
      }),
    deleteAttachment: (uuid, attachmentId) =>
      apiDelete(`/student/converted-lectures/${uuid}/attachments/${attachmentId}`),
    delete: (uuid) => apiDelete(`/student/converted-lectures/${uuid}`),
  },

  // Student AI Suite: Accessible Lessons, Direct Lesson AI Quiz, Weak-Area AI Coach & Job Status
  ai: {
    listLessons: () => apiGet('/student/ai/lessons'),
    generateLessonQuiz: (lessonUuid, { quizCount = 5 } = {}) =>
      apiPost(`/student/ai/lessons/${lessonUuid}/quiz`, { quiz_count: quizCount }),
    getLatestWeakAreasDiagnosis: () => apiGet('/student/ai/weak-areas/latest'),
    diagnoseWeakAreas: ({ mistakeIds = [], includeQuiz = true, quizCount = 5 } = {}) =>
      apiPost('/student/ai/weak-areas/diagnose', {
        ...(Array.isArray(mistakeIds) && mistakeIds.length > 0 ? { mistake_ids: mistakeIds } : {}),
        include_quiz: Boolean(includeQuiz),
        quiz_count: quizCount,
      }),
    getJobStatus: (jobUuid) => apiGet(`/student/ai/jobs/${jobUuid}`),
  },

  // Phase 9: Billing, Student Subscriptions, Coupons & Direct Payments
  billing: {
    overview: () => apiGet('/student/billing'),
    subscribe: (data) =>
      apiRequest('/student/billing/subscribe', {
        method: 'POST',
        headers: { 'Idempotency-Key': makeIdempotencyKey('std-sub') },
        body: data,
      }),
    cancel: () => apiPost('/student/billing/cancel', {}),
    validateCoupon: (code, amountEgp = 0) =>
      apiPost('/student/billing/coupons/validate', { code, amount_egp: amountEgp }),
    createPayment: (data) =>
      apiRequest('/student/billing/payments', {
        method: 'POST',
        headers: { 'Idempotency-Key': makeIdempotencyKey('pay') },
        body: data,
      }),
  },

  // Phase 10: Dashboard, Daily Platform Activity Heartbeat, Analytics & Revision Hub
  dashboard: {
    get: (timezone) =>
      apiGet(
        timezone
          ? `/student/dashboard?timezone=${encodeURIComponent(timezone)}`
          : '/student/dashboard'
      ),
    analytics: () => apiGet('/student/analytics'),
    revision: () => apiGet('/student/revision'),
  },

  activity: {
    heartbeat: (data, opts = {}) =>
      apiPost('/student/activity/heartbeat', data, opts),
  },
};
