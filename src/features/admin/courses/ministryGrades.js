/**
 * Canonical 12-grade Egyptian Ministry of Education catalog (1st Primary -> 3rd Secondary)
 * plus strict client-side YouTube URL parsing helpers mirroring App\Support\YouTubeUrlParser.
 */

export const MINISTRY_GRADES = [
  { gradeAr: 'الصف الأول الابتدائي', gradeEn: '1st Primary', shortAr: '1 ابتدائي', stage: 'stage-primary', stageGroup: 'stage-primary' },
  { gradeAr: 'الصف الثاني الابتدائي', gradeEn: '2nd Primary', shortAr: '2 ابتدائي', stage: 'stage-primary', stageGroup: 'stage-primary' },
  { gradeAr: 'الصف الثالث الابتدائي', gradeEn: '3rd Primary', shortAr: '3 ابتدائي', stage: 'stage-primary', stageGroup: 'stage-primary' },
  { gradeAr: 'الصف الرابع الابتدائي', gradeEn: '4th Primary', shortAr: '4 ابتدائي', stage: 'stage-primary', stageGroup: 'stage-primary' },
  { gradeAr: 'الصف الخامس الابتدائي', gradeEn: '5th Primary', shortAr: '5 ابتدائي', stage: 'stage-primary', stageGroup: 'stage-primary' },
  { gradeAr: 'الصف السادس الابتدائي', gradeEn: '6th Primary', shortAr: '6 ابتدائي', stage: 'stage-primary', stageGroup: 'stage-primary' },
  { gradeAr: 'الصف الأول الإعدادي', gradeEn: '1st Preparatory', shortAr: '1 إعدادي', stage: 'stage-prep', stageGroup: 'stage-prep' },
  { gradeAr: 'الصف الثاني الإعدادي', gradeEn: '2nd Preparatory', shortAr: '2 إعدادي', stage: 'stage-prep', stageGroup: 'stage-prep' },
  { gradeAr: 'الصف الثالث الإعدادي', gradeEn: '3rd Preparatory', shortAr: '3 إعدادي', stage: 'stage-prep', stageGroup: 'stage-prep' },
  { gradeAr: 'الصف الأول الثانوي', gradeEn: '1st Secondary', shortAr: '1 ثانوي', stage: 'stage-secondary', stageGroup: 'secondary_all' },
  { gradeAr: 'الصف الثاني الثانوي', gradeEn: '2nd Secondary', shortAr: '2 ثانوي', stage: 'stage-secondary', stageGroup: 'secondary_all' },
  { gradeAr: 'الصف الثالث الثانوي', gradeEn: '3rd Secondary', shortAr: '3 ثانوي', stage: 'stage-thanawya', stageGroup: 'secondary_all' },
];

export const STAGE_GROUPS = [
  { id: 'all', labelAr: 'كل المراحل (1 ابتدائي — 3 ثانوي)', labelEn: 'All Stages (1st Pri — 3rd Sec)' },
  { id: 'stage-primary', labelAr: 'المرحلة الابتدائية (1–6)', labelEn: 'Primary (1–6)' },
  { id: 'stage-prep', labelAr: 'المرحلة الإعدادية (1–3)', labelEn: 'Preparatory (1–3)' },
  { id: 'secondary_all', labelAr: 'المرحلة الثانوية (1–3)', labelEn: 'Secondary (1–3)' },
];

export const TERM_OPTIONS = [
  { value: 'full_year', labelAr: 'العام الدراسي الكامل', labelEn: 'Full Academic Year' },
  { value: 'first', labelAr: 'الفصل الدراسي الأول', labelEn: 'First Term' },
  { value: 'second', labelAr: 'الفصل الدراسي الثاني', labelEn: 'Second Term' },
];

export const TRACK_OPTIONS = [
  'عام',
  'علمي علوم',
  'علمي رياضة',
  'أدبي',
  'لغات',
  'أزهر',
];

export const COMMON_SUBJECTS = [
  { ar: 'اللغة العربية', en: 'Arabic Language' },
  { ar: 'الرياضيات', en: 'Mathematics' },
  { ar: 'اللغة الإنجليزية', en: 'English Language' },
  { ar: 'العلوم', en: 'Science' },
  { ar: 'الدراسات الاجتماعية', en: 'Social Studies' },
  { ar: 'العلوم و ICT', en: 'Science & ICT' },
  { ar: 'الفيزياء', en: 'Physics' },
  { ar: 'الكيمياء', en: 'Chemistry' },
  { ar: 'الأحياء', en: 'Biology' },
  { ar: 'التاريخ', en: 'History' },
  { ar: 'الجغرافيا', en: 'Geography' },
  { ar: 'الفلسفة والمنطق', en: 'Philosophy & Logic' },
  { ar: 'اللغة الفرنسية', en: 'French Language' },
  { ar: 'التربية الدينية', en: 'Religious Education' },
];

export const RESOURCE_TYPES = [
  { value: 'summary', labelAr: 'ملخص وشرح نصي', labelEn: 'Written Summary' },
  { value: 'pdf', labelAr: 'ملف PDF / مذكرة', labelEn: 'PDF / Booklet' },
  { value: 'worksheet', labelAr: 'تدريبات وأسئلة', labelEn: 'Worksheet' },
  { value: 'link', labelAr: 'رابط مرجعي', labelEn: 'Reference Link' },
];

const YOUTUBE_ALLOWED_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'www.youtu.be',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]);

const YOUTUBE_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;

/**
 * Strictly parse a YouTube URL into canonical metadata, or return null if invalid.
 */
export function parseYouTubeUrl(rawUrl) {
  const input = String(rawUrl || '').trim();
  if (!input) return null;

  if (YOUTUBE_ID_REGEX.test(input)) {
    return buildYouTubeMeta(input);
  }

  let parsed;
  try {
    parsed = new URL(input);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  if (!YOUTUBE_ALLOWED_HOSTS.has(host)) {
    return null;
  }

  const segments = parsed.pathname.split('/').filter(Boolean);
  let videoId = null;

  if (host === 'youtu.be' || host === 'www.youtu.be') {
    videoId = segments[0] || null;
  } else {
    videoId = parsed.searchParams.get('v');
    if (!videoId && segments.length >= 2 && ['embed', 'shorts', 'live', 'v'].includes(segments[0])) {
      videoId = segments[1];
    }
  }

  if (!videoId || !YOUTUBE_ID_REGEX.test(videoId)) {
    return null;
  }

  return buildYouTubeMeta(videoId);
}

function buildYouTubeMeta(videoId) {
  return {
    youtubeId: videoId,
    youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };
}

export function getTermLabel(term, lang = 'ar') {
  const found = TERM_OPTIONS.find((t) => t.value === term) || TERM_OPTIONS[0];
  return lang === 'ar' ? found.labelAr : found.labelEn;
}

export function getStageBadgeStyle(stage) {
  if (stage === 'stage-primary') {
    return { bg: 'rgba(16, 185, 129, 0.12)', color: '#047857', border: 'rgba(16, 185, 129, 0.3)', labelAr: 'ابتدائي', labelEn: 'Primary' };
  }
  if (stage === 'stage-prep') {
    return { bg: 'rgba(245, 158, 11, 0.14)', color: '#B45309', border: 'rgba(245, 158, 11, 0.35)', labelAr: 'إعدادي', labelEn: 'Prep' };
  }
  return { bg: 'rgba(21, 136, 199, 0.12)', color: 'var(--primary)', border: 'rgba(21, 136, 199, 0.32)', labelAr: 'ثانوي', labelEn: 'Secondary' };
}
