/**
 * Motafawweq Platform — Teacher Data Model Baseline
 * Static mock data removed. All entities are loaded dynamically from Laravel API endpoints.
 */

export const TEACHER_PROFILE = {
  nameAr: '',
  nameEn: '',
  titleAr: '',
  titleEn: '',
  subjectAr: '',
  subjectEn: '',
  email: '',
  phone: '',
  bioAr: '',
  avatar: '',
  stagesTaught: [],
  payoutMethods: [],
  defaultPayout: null,
};

export const TEACHER_COURSES = [];

export const TEACHER_EXAMS = [];

export const TEACHER_HOMEWORKS = [];

export const TEACHER_COURSE_LEAGUE = {
  podium: [],
  leaderboard: [],
};

export const TEACHER_ANALYTICS = {
  overallGpa: '0.0',
  overallGpaNum: 0,
  averageAttendancePct: 0,
  attendanceRate: 0,
  totalStudentsAudited: 0,
  totalStudents: 0,
  revenueTotalEgp: 0,
  atRiskCount: 0,
  weakAreas: [],
  atRiskRadar: [],
  centerDistribution: [],
};

import { TEACHER_SUBSCRIPTION_CATALOG } from '../constants/teacherPlanFeatures';

export const TEACHER_CERTIFICATES = [];

export const TEACHER_SUBSCRIPTION_PLANS = TEACHER_SUBSCRIPTION_CATALOG;

export const MOCK_TEACHER_INVOICES = [];

export const MOCK_TEACHER_DIRECT_PAYMENTS = [];
