/**
 * Motafawweq — Teacher Courses Constants & Authoritative API Mapper
 * Mirrors App\Enums\StageType, App\Enums\CourseStatus & TeacherCourseResource.
 */

export const STAGE_OPTIONS = [
  {
    id: 'sec',
    labelAr: 'المرحلة الثانوية',
    labelEn: 'Secondary Stage',
    grades: [
      'الصف الأول الثانوي',
      'الصف الثاني الثانوي',
      'الصف الثالث الثانوي',
    ],
    defaultGrade: 'الصف الثالث الثانوي',
  },
  {
    id: 'prep',
    labelAr: 'المرحلة الإعدادية',
    labelEn: 'Preparatory Stage',
    grades: [
      'الصف الأول الإعدادي',
      'الصف الثاني الإعدادي',
      'الصف الثالث الإعدادي',
    ],
    defaultGrade: 'الصف الثالث الإعدادي',
  },
  {
    id: 'prim',
    labelAr: 'المرحلة الابتدائية',
    labelEn: 'Primary Stage',
    grades: [
      'الصف الرابع الابتدائي',
      'الصف الخامس الابتدائي',
      'الصف السادس الابتدائي',
    ],
    defaultGrade: 'الصف السادس الابتدائي',
  },
];

export const COURSE_STATUS_META = {
  published: {
    id: 'published',
    labelAr: 'منشور',
    labelEn: 'Published',
    bg: 'rgba(16, 185, 129, 0.12)',
    color: 'var(--success)',
    border: 'rgba(16, 185, 129, 0.28)',
  },
  draft: {
    id: 'draft',
    labelAr: 'مسودة',
    labelEn: 'Draft',
    bg: 'rgba(245, 158, 11, 0.12)',
    color: '#D97706',
    border: 'rgba(245, 158, 11, 0.28)',
  },
  archived: {
    id: 'archived',
    labelAr: 'مؤرشف',
    labelEn: 'Archived',
    bg: 'var(--bg-subtle)',
    color: 'var(--text-muted)',
    border: 'var(--border-subtle)',
  },
};

export function getStageOption(stageId) {
  return STAGE_OPTIONS.find((s) => s.id === stageId) || STAGE_OPTIONS[0];
}

export function resolveStageId(rawStage, gradeAr = '') {
  const g = String(gradeAr || '');
  if (g.includes('الإعدادي')) return 'prep';
  if (g.includes('الابتدائي')) return 'prim';
  if (g.includes('الثانوي')) return 'sec';

  const normalized = String(rawStage || '').trim().toLowerCase();
  if (normalized === 'prep' || normalized === 'stage-prep') return 'prep';
  if (normalized === 'prim' || normalized === 'primary' || normalized === 'stage-primary') return 'prim';
  return 'sec';
}

export function mapCourseFromApi(c) {
  const uuid = c.uuid || c.id;
  const rawPrice = c.priceEgp !== undefined && c.priceEgp !== null ? c.priceEgp : c.price_egp;
  const priceEgp = rawPrice !== undefined && rawPrice !== null && !Number.isNaN(Number(rawPrice))
    ? Number(rawPrice)
    : 0;

  const gradeAr = c.gradeAr || c.grade_ar || 'الصف الثالث الثانوي';
  const stageId = resolveStageId(c.stageId || c.stage_id || c.stageType || c.stage_type, gradeAr);
  const stageOpt = getStageOption(stageId);

  return {
    id: uuid,
    uuid,
    titleAr: c.titleAr || c.title_ar || c.title || '',
    titleEn: c.titleEn || c.title_en || c.title || c.titleAr || '',
    stageId,
    stageNameAr: c.stage || stageOpt.labelAr,
    stageNameEn: stageOpt.labelEn,
    gradeAr,
    subjectAr: c.subjectAr || c.subject_ar || '',
    subjectEn: c.subjectEn || c.subject_en || c.subjectAr || '',
    priceEgp,
    studentsCount: Number(c.studentsCount ?? c.enrolledStudentsCount ?? 0),
    lessonsCount: Number(c.lessonsCount ?? c.lessons_count ?? 0),
    actualLessonsCount: Number(c.actualLessonsCount ?? 0),
    hoursTotal: c.hoursTotal || c.hours_total || '0 ساعة',
    status: COURSE_STATUS_META[c.status] ? c.status : 'published',
    completionRate: Number(c.completionRate ?? 0),
    revenueEgp: Number(c.revenueEgp ?? 0),
    descriptionAr: c.descriptionAr ?? c.description_ar ?? '',
    descriptionEn: c.descriptionEn ?? c.description_en ?? c.descriptionAr ?? '',
    createdAt: c.createdAt || null,
  };
}
