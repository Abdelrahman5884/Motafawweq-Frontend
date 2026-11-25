/**
 * Motafawweq — API Service Layer
 * Enterprise HTTP client with Bearer authentication, automatic refresh-token rotation,
 * and structured error parsing matching the Laravel V1 backend envelope.
 */

import { API_BASE_URL, STORAGE_KEYS } from '../constants';

// ─── Structured API Error ──────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor({ message, status = 0, errorCode = null, errors = null, meta = null, data = null }) {
    super(message || 'حدث خطأ أثناء الاتصال بالخادم.');
    this.name = 'ApiError';
    this.status = status;
    this.errorCode = errorCode;
    this.errors = errors;
    this.meta = meta;
    this.data = data;
  }

  /**
   * Returns a flat map of first validation message per field: { email: '...', password: '...' }
   */
  getFieldErrors() {
    if (!this.errors || typeof this.errors !== 'object') return {};
    return Object.entries(this.errors).reduce((acc, [field, msgs]) => {
      acc[field] = Array.isArray(msgs) ? msgs[0] : String(msgs);
      return acc;
    }, {});
  }
}

// ─── Token & Locale Helpers ────────────────────────────────────────────────────

const getActiveLang = () => {
  try {
    const stored =
      localStorage.getItem('motafawweq_lang') ||
      localStorage.getItem(STORAGE_KEYS.LANGUAGE) ||
      (typeof document !== 'undefined' ? document.documentElement.getAttribute('lang') : null);
    return stored === 'en' ? 'en' : 'ar';
  } catch {
    return 'ar';
  }
};

const getActiveStore = () => {
  try {
    const mode = localStorage.getItem(STORAGE_KEYS.TOKEN_STORAGE);
    return mode === 'session' ? sessionStorage : localStorage;
  } catch {
    return localStorage;
  }
};

export const tokenStorage = {
  getAccessToken() {
    try {
      return (
        sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ||
        localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ||
        null
      );
    } catch {
      return null;
    }
  },

  getRefreshToken() {
    try {
      return (
        sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ||
        localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ||
        null
      );
    } catch {
      return null;
    }
  },

  setTokens({ access_token, refresh_token }, rememberMe = true) {
    try {
      const mode = rememberMe ? 'local' : 'session';
      localStorage.setItem(STORAGE_KEYS.TOKEN_STORAGE, mode);
      const primary = rememberMe ? localStorage : sessionStorage;
      const secondary = rememberMe ? sessionStorage : localStorage;

      secondary.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      secondary.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (access_token) primary.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
      if (refresh_token) primary.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
    } catch {
      // Storage unavailable
    }
  },

  updateRotatedTokens({ access_token, refresh_token }) {
    try {
      const store = getActiveStore();
      if (access_token) store.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
      if (refresh_token) store.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
    } catch {
      // Storage unavailable
    }
  },

  clearTokens() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.TOKEN_STORAGE);
      sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch {
      // ignore
    }
  },
};

// ─── Silent Token Rotation (Single-Flight) ─────────────────────────────────────

let refreshInFlight = null;

async function refreshTokenPair() {
  if (refreshInFlight) return refreshInFlight;

  const lang = getActiveLang();
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    throw new ApiError({
      message: lang === 'en' ? 'Session expired. Please sign in again.' : 'انتهت الجلسة، يرجى تسجيل الدخول مجدداً.',
      status: 401,
    });
  }

  refreshInFlight = (async () => {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': lang,
        'X-Locale': lang,
        'Authorization': `Bearer ${refreshToken}`,
      },
    });

    const payload = await res.json().catch(() => ({}));

    if (!res.ok || !payload?.data?.access_token) {
      tokenStorage.clearTokens();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('motafawweq:auth-expired'));
      }
      throw new ApiError({
        message:
          payload?.message ||
          (lang === 'en' ? 'Session expired. Please sign in again.' : 'انتهت الجلسة، يرجى تسجيل الدخول مجدداً.'),
        status: res.status,
        errorCode: payload?.error_code || 'INVALID_REFRESH_TOKEN',
      });
    }

    tokenStorage.updateRotatedTokens(payload.data);
    return payload.data;
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

// ─── Core Request Executor ─────────────────────────────────────────────────────

const NON_REFRESHABLE_PATHS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/password/forgot', '/auth/password/verify-otp', '/auth/password/reset'];

export async function apiRequest(path, { method = 'GET', body, headers: extraHeaders = {}, tokenOverride, skipAuthRefresh = false, keepalive = false } = {}) {
  const token = tokenOverride ?? tokenStorage.getAccessToken();
  const lang = getActiveLang();
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const buildHeaders = (bearer) => {
    const headers = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      'Accept': 'application/json',
      'Accept-Language': lang,
      'X-Locale': lang,
      ...extraHeaders,
    };
    if (bearer) {
      headers['Authorization'] = `Bearer ${bearer}`;
    }
    return headers;
  };

  const serializedBody = body === undefined ? undefined : (isFormData ? body : JSON.stringify(body));

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: buildHeaders(token),
      body: serializedBody,
      keepalive,
    });
  } catch {
    throw new ApiError({
      message:
        lang === 'en'
          ? 'Unable to connect to the server. Please check your internet connection.'
          : 'تعذر الاتصال بالخادم. تأكد من تشغيل السيرفر أو اتصالك بالإنترنت.',
      status: 0,
      errorCode: 'NETWORK_ERROR',
    });
  }

  // Transparent 401 retry via rotating refresh token
  const canTryRefresh =
    res.status === 401 &&
    !skipAuthRefresh &&
    !NON_REFRESHABLE_PATHS.includes(path) &&
    Boolean(tokenStorage.getRefreshToken());

  if (canTryRefresh) {
    try {
      const freshTokens = await refreshTokenPair();
      res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: buildHeaders(freshTokens.access_token),
        body: serializedBody,
      });
    } catch (refreshErr) {
      throw refreshErr;
    }
  }

  const payload = await res.json().catch(() => ({}));

  if (!res.ok || payload?.success === false) {
    if (res.status === 401 && !NON_REFRESHABLE_PATHS.includes(path) && tokenStorage.getAccessToken()) {
      tokenStorage.clearTokens();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('motafawweq:auth-expired'));
      }
    }

    if (
      res.status === 403 &&
      (payload?.error_code === 'SUBSCRIPTION_REQUIRED' || payload?.error_code === 'PLAN_QUOTA_EXCEEDED') &&
      typeof window !== 'undefined'
    ) {
      window.dispatchEvent(
        new CustomEvent('motafawweq:plan-updated', {
          detail: { planTier: payload?.current_plan || 'free' },
        })
      );
    }

    // Extract first validation error if available for easy display
    let firstFieldError = null;
    if (payload?.errors && typeof payload.errors === 'object') {
      const firstKey = Object.keys(payload.errors)[0];
      const msgs = payload.errors[firstKey];
      firstFieldError = Array.isArray(msgs) ? msgs[0] : msgs;
    }

    // Security defense-in-depth: never render raw SQL, DB connection strings, or 5xx stack details in UI
    const rawMsg = firstFieldError || payload?.message || '';
    const looksInternal =
      res.status >= 500 ||
      /SQLSTATE|Connection:\s*\w+|Stack trace|Syntax error|Unknown column|PDOException/i.test(String(rawMsg));

    const safeMessage = looksInternal
      ? (lang === 'en'
        ? 'A temporary server issue occurred. Please try again later.'
        : 'حدثت مشكلة مؤقتة في الخادم، يرجى المحاولة مرة أخرى لاحقاً.')
      : (rawMsg || (lang === 'en' ? `Request failed (${res.status})` : `تعذر تنفيذ الطلب (${res.status})`));

    throw new ApiError({
      message: safeMessage,
      status: res.status,
      errorCode: payload?.error_code || (res.status >= 500 ? 'SERVER_ERROR' : null),
      errors: res.status >= 500 ? null : (payload?.errors || null),
      meta: payload?.meta || null,
      data: res.status >= 500 ? null : (payload || null),
    });
  }

  return payload;
}

export const apiGet    = (path, opts)       => apiRequest(path, { ...opts, method: 'GET' });
export const apiPost   = (path, body, opts) => apiRequest(path, { ...opts, method: 'POST', body });
export const apiPut    = (path, body, opts) => apiRequest(path, { ...opts, method: 'PUT', body });
export const apiPatch  = (path, body, opts) => apiRequest(path, { ...opts, method: 'PATCH', body });
export const apiDelete = (path, opts)       => apiRequest(path, { ...opts, method: 'DELETE' });

// ─── Domain Service Modules ────────────────────────────────────────────────────

export const studentService = {
  getProfile:   () => apiGet('/student/profile'),
  getCourses:   () => apiGet('/student/courses'),
  getHomework:  () => apiGet('/student/homework'),
  getExams:     () => apiGet('/student/exams'),
  getAnalytics: () => apiGet('/student/analytics'),
  getLeague:    () => apiGet('/student/league'),
};

export const quizService = {
  getQuestions:  (lessonId)        => apiGet(`/quiz/${lessonId}/questions`),
  submitAnswers: (quizId, answers) => apiPost(`/quiz/${quizId}/submit`, { answers }),
};

export const teacherService = {
  getProfile:    ()        => apiGet('/teacher/profile'),
  getClasses:    ()        => apiGet('/teacher/classes'),
  getStudents:   (classId) => apiGet(`/teacher/classes/${classId}/students`),
  getFinancials: ()        => apiGet('/teacher/financials'),
};

// ─── Full V1 Auth Service ──────────────────────────────────────────────────────

export const authService = {
  register: (data) =>
    apiPost('/auth/register', data, { skipAuthRefresh: true }),

  login: (credentials) =>
    apiPost('/auth/login', credentials, { skipAuthRefresh: true }),

  refresh: () =>
    refreshTokenPair(),

  me: () =>
    apiGet('/auth/me'),

  updateProfile: (data) =>
    apiPut('/auth/profile', data),

  changePassword: ({ current_password, new_password, new_password_confirmation }) =>
    apiPost('/auth/change-password', {
      current_password,
      new_password,
      new_password_confirmation,
    }),

  logout: () =>
    apiPost('/auth/logout', {}),

  logoutAll: () =>
    apiPost('/auth/logout-all', {}),

  deleteAccount: (password) =>
    apiRequest('/auth/account', {
      method: 'DELETE',
      body: { password },
    }),

  verifyEmail: (code) =>
    apiPost('/auth/email/verify', { code: String(code).trim() }),

  resendEmailOtp: () =>
    apiPost('/auth/email/resend', {}),

  forgotPassword: (email) =>
    apiPost('/auth/password/forgot', { email: String(email).trim() }, { skipAuthRefresh: true }),

  verifyPasswordResetOtp: ({ email, code }) =>
    apiPost(
      '/auth/password/verify-otp',
      {
        email: String(email).trim(),
        code: String(code).trim(),
      },
      { skipAuthRefresh: true }
    ),

  resetPassword: ({ email, code, password, password_confirmation }) =>
    apiPost(
      '/auth/password/reset',
      {
        email: String(email).trim(),
        code: String(code).trim(),
        password,
        password_confirmation,
      },
      { skipAuthRefresh: true }
    ),

  getSessions: () =>
    apiGet('/auth/sessions'),

  revokeSession: (sessionId) =>
    apiDelete(`/auth/sessions/${encodeURIComponent(sessionId)}`),

  revokeOtherSessions: () =>
    apiDelete('/auth/sessions'),

  getLoginHistory: (perPage = 20) =>
    apiGet(`/auth/login-history?per_page=${perPage}`),
};

export { teacherApi } from './teacherApi';
export { adminApi, publicPlatformApi } from './adminApi';
