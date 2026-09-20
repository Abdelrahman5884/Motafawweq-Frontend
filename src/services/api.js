/**
 * Motafawweq — API Service Layer
 * Base client and service stubs. All API calls go through here.
 * Replace mock responses with real fetch/axios calls when backend is ready.
 */

import { API_BASE_URL } from '../constants';

// ─── Base Client ───────────────────────────────────────────────────────────────

const defaultHeaders = () => ({
  'Content-Type': 'application/json',
  // Add Authorization header here when auth tokens are implemented:
  // 'Authorization': `Bearer ${getToken()}`,
});

export async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: defaultHeaders(),
  });
  if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: defaultHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: defaultHeaders(),
  });
  if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
  return res.json();
}

// ─── Service Modules (stubs — replace with real API calls) ────────────────────

export const studentService = {
  getProfile:    () => apiGet('/student/profile'),
  getCourses:    () => apiGet('/student/courses'),
  getHomework:   () => apiGet('/student/homework'),
  getExams:      () => apiGet('/student/exams'),
  getAnalytics:  () => apiGet('/student/analytics'),
  getLeague:     () => apiGet('/student/league'),
};

export const quizService = {
  getQuestions:   (lessonId) => apiGet(`/quiz/${lessonId}/questions`),
  submitAnswers:  (quizId, answers) => apiPost(`/quiz/${quizId}/submit`, { answers }),
};

export const teacherService = {
  getProfile:   () => apiGet('/teacher/profile'),
  getClasses:   () => apiGet('/teacher/classes'),
  getStudents:  (classId) => apiGet(`/teacher/classes/${classId}/students`),
  getFinancials:() => apiGet('/teacher/financials'),
};

export const authService = {
  login:          (credentials) => apiPost('/auth/login', credentials),
  register:       (data)        => apiPost('/auth/register', data),
  logout:         ()            => apiPost('/auth/logout', {}),
  forgotPassword: (email)       => apiPost('/auth/forgot-password', { email }),
};
