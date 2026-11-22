export const MAX_HOMEWORK_FILE_BYTES = 25 * 1024 * 1024; // 25 MB (matches backend max:25600 KB)

export const ALLOWED_HOMEWORK_MIMES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
]);

export const ALLOWED_HOMEWORK_EXTENSIONS = new Set(['pdf', 'png', 'jpg', 'jpeg', 'webp']);

export const QUICK_FEEDBACK_CHIPS = [
  {
    ar: 'إجابة نموذجية ومكتملة الخطوات',
    en: 'Model answer with complete steps',
  },
  {
    ar: 'يرجى مراجعة الرسم التوضيحي والبيانات',
    en: 'Please review the diagram and labels',
  },
  {
    ar: 'كتابة خطوات القانون والوحدات بدقة',
    en: 'Write formula steps and units clearly',
  },
  {
    ar: 'تنسيق وتنظيم متميز للإجابة',
    en: 'Excellent structure and presentation',
  },
  {
    ar: 'الحل غير مكتمل — يرجى استكمال باقي المسائل وإعادة التسليم',
    en: 'Incomplete solution — please finish remaining questions and resubmit',
  },
];

export function formatFileSize(bytes, isAr = true) {
  const num = Number(bytes || 0);
  if (!Number.isFinite(num) || num <= 0) return '';
  if (num < 1024) return `${num} B`;
  const kb = num / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(kb >= 100 ? 0 : 1)} ${isAr ? 'ك.ب' : 'KB'}`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(mb >= 10 ? 1 : 2)} ${isAr ? 'م.ب' : 'MB'}`;
}

export function formatSubmissionDate(iso, isAr = true) {
  if (!iso) return '—';
  try {
    const dt = new Date(iso);
    if (Number.isNaN(dt.getTime())) return String(iso);
    return dt.toLocaleString(isAr ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(iso);
  }
}

export function buildLocationOptions(groups = [], isAr = true) {
  const base = [
    {
      id: 'all',
      label: isAr ? 'جميع الأماكن (كل المجموعات + الأونلاين)' : 'All Locations (All Groups + Online)',
    },
    {
      id: 'ctr-online',
      label: isAr ? 'المنصة أونلاين فقط' : 'Online Platform Only',
    },
  ];

  const seen = new Set(['all', 'ctr-online']);
  for (const group of groups) {
    const rawId = String(group.uuid || group.id || '').trim();
    const label = String(group.centerName || group.nameAr || group.name || '').trim();
    if (!rawId || !label || seen.has(rawId)) continue;
    seen.add(rawId);
    const fullLabel =
      group.centerName && group.nameAr && group.centerName !== group.nameAr
        ? `${group.centerName} — ${group.nameAr}`
        : label;
    base.push({ id: rawId, label: fullLabel });
  }

  return base;
}

export function createEmptyHomeworkForm(defaultCourse = null) {
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  return {
    title: '',
    courseId: defaultCourse?.id || defaultCourse?.uuid || '',
    courseTitle: defaultCourse?.titleAr || defaultCourse?.title || '',
    lessonId: '',
    lessonTitle: '',
    targetLocationId: 'all',
    targetLocationAr: 'جميع الأماكن (كل المجموعات + الأونلاين)',
    type: 'file',
    textContent: '',
    maxGrade: '20',
    dueDate: nextWeek,
    dueTime: '23:59',
    removeExistingAttachment: false,
  };
}

export function homeworkToForm(hw) {
  return {
    title: hw.titleAr || '',
    courseId: hw.courseId || '',
    courseTitle: hw.courseTitleAr || '',
    lessonId: hw.lessonId || '',
    lessonTitle: hw.lessonAr || '',
    targetLocationId: hw.targetLocationId || 'all',
    targetLocationAr: hw.targetLocationAr || 'جميع الأماكن (كل المجموعات + الأونلاين)',
    type: hw.attachmentUrl || hw.type === 'file' ? 'file' : 'text',
    textContent: hw.textContent || '',
    maxGrade: String(hw.maxGrade ?? 20),
    dueDate: hw.dueDate || '',
    dueTime: hw.dueTime || '23:59',
    removeExistingAttachment: false,
  };
}
