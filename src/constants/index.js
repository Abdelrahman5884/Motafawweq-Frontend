/**
 * Motafawweq — Application Constants
 * Centralized constants used across the entire platform.
 */

// ─── Route Paths ──────────────────────────────────────────────────────────────
export const ROUTES = {
  // Public
  HOME:           '/',
  FEATURES:       '/features',
  PRICING:        '/pricing',
  MARKETPLACE:    '/marketplace',

  // Auth
  LOGIN:          '/login',
  REGISTER:       '/register',
  FORGOT_PW:      '/forgot-password',

  // Student
  STUDENT_DASHBOARD:     '/student/dashboard',
  STUDENT_COURSES:       '/student/courses',
  STUDENT_LESSON:        '/student/lesson',
  STUDENT_QUIZ:          '/student/quiz',
  STUDENT_EXAM:          '/student/exam',
  STUDENT_HOMEWORK:      '/student/homework',
  STUDENT_REVISION:      '/student/revision',
  STUDENT_LEAGUE:        '/student/league',
  STUDENT_ANALYTICS:     '/student/analytics',
  STUDENT_GAMIFICATION:  '/student/gamification',
  STUDENT_CERTIFICATES:  '/student/certificates',
  STUDENT_BILLING:       '/student/billing',
  STUDENT_SMART_LECTURE: '/student/smart-lecture',
  STUDENT_WEAK_AREAS:    '/student/weak-areas',

  // Teacher
  TEACHER_DASHBOARD:     '/teacher/dashboard',
  TEACHER_STUDIO:        '/teacher/studio',
  TEACHER_WORKSPACE:     '/teacher/workspace',
  TEACHER_CLASSES:       '/teacher/classes',
  TEACHER_ROSTER:        '/teacher/roster',
  TEACHER_FINANCIALS:    '/teacher/financials',
  TEACHER_PROCESSING:    '/teacher/processing',

  // Parent / Admin
  PARENT_DASHBOARD:      '/parent/dashboard',
  ADMIN_DASHBOARD:       '/admin/dashboard',
  CENTER_DASHBOARD:      '/center/dashboard',
};

// ─── Pagination ────────────────────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  COURSES_PAGE_SIZE: 12,
  LEADERBOARD_SIZE:  20,
};

// ─── Quiz / Exam ───────────────────────────────────────────────────────────────
export const QUIZ = {
  DEFAULT_TIMER_SECONDS:  600,  // 10 minutes
  AI_QUIZ_TIMER_SECONDS:  300,  // 5 minutes
  POINTS_PER_CORRECT:     1,
  FULL_MARK_BONUS:        3,
  STREAK_BONUS:           1,
  PASS_THRESHOLD_PERCENT: 60,
  EXCELLENT_THRESHOLD:    80,
};

// ─── League Tiers ──────────────────────────────────────────────────────────────
export const LEAGUE_TIER_IDS = {
  DIAMOND: 'Diamond',
  GOLD:    'Gold',
  SILVER:  'Silver',
  BRONZE:  'Bronze',
};

// ─── Storage Keys ──────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  THEME:    'motafawweq-theme',
  LANGUAGE: 'motafawweq-lang',
  AUTH:     'motafawweq-auth',
};

// ─── API ───────────────────────────────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
