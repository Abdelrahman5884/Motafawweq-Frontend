/**
 * Motafawweq Platform — Student Data Model Baseline
 * Static mock data removed. All entities are loaded dynamically from Laravel API endpoints.
 */

export const STUDENT_PROFILE = {
  id: '',
  name: '',
  nameAr: '',
  gradeId: '',
  gradeName: '',
  gradeNameAr: '',
  track: '',
  trackAr: '',
  avatar: '',
  email: '',
  phone: '',
  parentPhone: '',
  school: '',
  schoolAr: '',
  center: '',
  centerAr: '',
  xp: 0,
  level: 1,
  levelTitle: '',
  levelTitleAr: '',
  streakDays: 0,
  examStreak: 0,
  studyMinutesToday: 0,
  dailyGoalMinutes: 60,
  completedLessonsCount: 0,
  totalEnrolledLessons: 0,
  overallGpa: '0%',
  referralCode: '',
  referralBonusEgp: 0,
};

export const SUBJECTS_LIST = [];

export const COURSES_CATALOG = [];

export const MINISTRY_CURRICULUM = [];

export const TODAY_TASKS = [];

export const UPCOMING_EXAMS = [];

export const HOMEWORK_LIST = [];

export const LEAGUE_LEADERBOARD = [];

export const LEAGUE_TIERS = [];

export const LEAGUE_RULES = [];

export const LEAGUE_PRIZES = [];

export const AI_LECTURE_QUESTIONS_BANK = [];

export const MISTAKE_BANK = [];

export const generateActivityStreakGrid = () =>
  Array.from({ length: 52 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => ({
      date: `2026-W${w + 1}-D${d + 1}`,
      level: 0,
      minutes: 0,
      lessons: 0,
    }))
  );

export const STUDENT_BADGES = [];

export const CERTIFICATES_LIST = [];

export const SUBSCRIPTION_PLANS = [];

export const LIVE_CLASSES_SCHEDULE = [];
