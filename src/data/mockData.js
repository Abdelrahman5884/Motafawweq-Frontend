/**
 * Motafawweq — Platform Data Baseline
 * Static mock lesson, classes, and student arrays removed.
 */

export const MOCK_LESSON = {
  id: '',
  title: '',
  titleAr: '',
  subject: '',
  subjectAr: '',
  grade: '',
  gradeAr: '',
  unit: '',
  unitAr: '',
  description: '',
  descriptionAr: '',
  videoUrl: '',
  videoSourceType: 'embed',
  videoFileName: '',
  attachments: {
    pdfs: [],
    whiteboardImages: [],
  },
  chapters: [],
  transcript: [],
  conceptGraph: {
    nodes: [],
    edges: [],
  },
  quizzes: [],
};

export const ALL_PUBLISHED_LESSONS = [];

export const MOCK_CLASSES = [];

export const MOCK_STUDENTS = [];

export const MOCK_TEACHER_EARNINGS = {
  totalBalanceEgp: 0,
  pendingClearanceEgp: 0,
  totalWithdrawnEgp: 0,
  activeStudentsCount: 0,
  transactions: [],
};

export const MOCK_CENTER_DATA = {
  nameAr: '',
  branches: [],
  halls: [],
};

export const MOCK_ADMIN_ECONOMICS = {
  mrrEgp: 0,
  activeTeachers: 0,
  activeStudents: 0,
  activeCenters: 0,
};
