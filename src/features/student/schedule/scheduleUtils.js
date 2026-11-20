/**
 * Shared constants, color palettes, priority metadata, and pure formatting / conflict helpers
 * for the Student Weekly Schedule feature.
 */

export const DAYS_CONFIG = [
  { key: 'saturday', ar: 'السبت', en: 'Saturday', shortAr: 'سبت', shortEn: 'Sat', dayIndex: 6 },
  { key: 'sunday', ar: 'الأحد', en: 'Sunday', shortAr: 'أحد', shortEn: 'Sun', dayIndex: 0 },
  { key: 'monday', ar: 'الاثنين', en: 'Monday', shortAr: 'اثنين', shortEn: 'Mon', dayIndex: 1 },
  { key: 'tuesday', ar: 'الثلاثاء', en: 'Tuesday', shortAr: 'ثلاثاء', shortEn: 'Tue', dayIndex: 2 },
  { key: 'wednesday', ar: 'الأربعاء', en: 'Wednesday', shortAr: 'أربعاء', shortEn: 'Wed', dayIndex: 3 },
  { key: 'thursday', ar: 'الخميس', en: 'Thursday', shortAr: 'خميس', shortEn: 'Thu', dayIndex: 4 },
  { key: 'friday', ar: 'الجمعة', en: 'Friday', shortAr: 'جمعة', shortEn: 'Fri', dayIndex: 5 },
];

export const STUDY_COLOR_PRESETS = [
  { hex: '#1588C7', labelAr: 'أزرق سماوي', labelEn: 'Ocean Blue', lightBg: 'rgba(21, 136, 199, 0.08)', darkBg: 'rgba(21, 136, 199, 0.16)', border: 'rgba(21, 136, 199, 0.34)' },
  { hex: '#7C3AED', labelAr: 'بنفسجي', labelEn: 'Violet', lightBg: 'rgba(124, 58, 237, 0.07)', darkBg: 'rgba(124, 58, 237, 0.16)', border: 'rgba(124, 58, 237, 0.34)' },
  { hex: '#059669', labelAr: 'أخضر زمردي', labelEn: 'Emerald', lightBg: 'rgba(5, 150, 105, 0.07)', darkBg: 'rgba(5, 150, 105, 0.16)', border: 'rgba(5, 150, 105, 0.34)' },
  { hex: '#D97706', labelAr: 'كهرماني', labelEn: 'Amber', lightBg: 'rgba(217, 119, 6, 0.08)', darkBg: 'rgba(217, 119, 6, 0.16)', border: 'rgba(217, 119, 6, 0.34)' },
  { hex: '#E11D48', labelAr: 'قرمزي', labelEn: 'Rose', lightBg: 'rgba(225, 29, 72, 0.07)', darkBg: 'rgba(225, 29, 72, 0.16)', border: 'rgba(225, 29, 72, 0.34)' },
  { hex: '#4F46E5', labelAr: 'نيلي', labelEn: 'Indigo', lightBg: 'rgba(79, 70, 229, 0.07)', darkBg: 'rgba(79, 70, 229, 0.16)', border: 'rgba(79, 70, 229, 0.34)' },
];

export const NOTE_PRIORITIES = {
  high: {
    key: 'high',
    labelAr: 'عاجلة',
    labelEn: 'High',
    color: '#DC2626',
    bgLight: 'rgba(220, 38, 38, 0.1)',
    bgDark: 'rgba(248, 113, 113, 0.16)',
    border: 'rgba(220, 38, 38, 0.3)',
  },
  medium: {
    key: 'medium',
    labelAr: 'متوسطة',
    labelEn: 'Medium',
    color: '#D97706',
    bgLight: 'rgba(217, 119, 6, 0.1)',
    bgDark: 'rgba(251, 191, 36, 0.16)',
    border: 'rgba(217, 119, 6, 0.3)',
  },
  low: {
    key: 'low',
    labelAr: 'عادية',
    labelEn: 'Low',
    color: '#0284C7',
    bgLight: 'rgba(2, 132, 199, 0.1)',
    bgDark: 'rgba(56, 189, 248, 0.16)',
    border: 'rgba(2, 132, 199, 0.28)',
  },
};

export const DEFAULT_SUBJECTS = [
  'الأحياء (الثانوية العامة)',
  'الفيزياء (الثانوية العامة)',
  'الكيمياء',
  'اللغة العربية',
  'اللغة الإنجليزية',
  'الرياضيات',
  'الجيولوجيا وعلوم البيئة',
];

export function getTodayDayKey() {
  const dayNum = new Date().getDay();
  const found = DAYS_CONFIG.find((d) => d.dayIndex === dayNum);
  return found ? found.key : 'saturday';
}

export function getColorPreset(hex) {
  const normalized = String(hex || '').trim().toUpperCase();
  return (
    STUDY_COLOR_PRESETS.find((p) => p.hex.toUpperCase() === normalized) ||
    STUDY_COLOR_PRESETS[0]
  );
}

export function parseTimeToMinutes(time24) {
  if (!time24 || typeof time24 !== 'string' || !time24.includes(':')) return -1;
  const [h, m] = time24.trim().split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return -1;
  return h * 60 + m;
}

export function formatTimeTo12h(time24, isAr = true) {
  const mins = parseTimeToMinutes(time24);
  if (mins < 0) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h >= 12 ? (isAr ? 'م' : 'PM') : (isAr ? 'ص' : 'AM');
  const h12 = h % 12 || 12;
  return `${h12}:${m < 10 ? `0${m}` : m} ${period}`;
}

export function formatDurationLabel(minutes, isAr = true) {
  const total = Math.max(0, Math.round(Number(minutes) || 0));
  if (total <= 0) return isAr ? '0 د' : '0m';
  const hrs = Math.floor(total / 60);
  const rem = total % 60;
  if (isAr) {
    if (hrs === 0) return `${rem} دقيقة`;
    if (rem === 0) {
      if (hrs === 1) return 'ساعة واحدة';
      if (hrs === 2) return 'ساعتان';
      return `${hrs} ساعات`;
    }
    return `${hrs} س ${rem} د`;
  }
  if (hrs === 0) return `${rem}m`;
  if (rem === 0) return `${hrs}h`;
  return `${hrs}h ${rem}m`;
}

export function formatStudyHoursValue(totalMinutes, isAr = true) {
  const mins = Math.max(0, Math.round(Number(totalMinutes) || 0));
  if (mins === 0) {
    return { value: '0', unit: isAr ? 'ساعة أسبوعياً' : 'Hours / wk' };
  }
  if (mins < 60) {
    return { value: String(mins), unit: isAr ? 'دقيقة أسبوعياً' : 'Min / wk' };
  }
  const hrs = mins / 60;
  const formatted = Number.isInteger(hrs) ? String(hrs) : hrs.toFixed(1);
  return { value: formatted, unit: isAr ? 'ساعة أسبوعياً' : 'Hours / wk' };
}

export function formatSlotsCount(count, isAr = true) {
  const n = Number(count) || 0;
  if (!isAr) {
    if (n === 0) return 'Free';
    return n === 1 ? '1 Slot' : `${n} Slots`;
  }
  if (n === 0) return 'لا مواعيد';
  if (n === 1) return 'موعد واحد';
  if (n === 2) return 'موعدان';
  if (n <= 10) return `${n} مواعيد`;
  return `${n} موعداً`;
}

export function formatArabicSessionsUnit(count, singular, dual, plural, isAr = true, enSingular = 'Item', enPlural = 'Items') {
  const n = Number(count) || 0;
  if (!isAr) return n === 1 ? enSingular : enPlural;
  if (n === 1) return singular;
  if (n === 2) return dual;
  if (n >= 3 && n <= 10) return plural;
  return singular;
}

/**
 * Check a proposed study session against ALL confirmed timetable items on that day
 * (independent of UI search/filter state).
 */
export function findScheduleConflict({
  day,
  startTime,
  endTime,
  allTimetableByDay,
  editingSessionId = null,
  isAr = true,
}) {
  const startMin = parseTimeToMinutes(startTime);
  const endMin = parseTimeToMinutes(endTime);
  if (startMin < 0 || endMin < 0 || endMin <= startMin) {
    return isAr
      ? 'وقت انتهاء جلسة المذاكرة يجب أن يكون بعد وقت البداية.'
      : 'End time must be after start time.';
  }

  const daySessions = allTimetableByDay?.[day] || [];
  for (const s of daySessions) {
    if (editingSessionId && s.id === editingSessionId) continue;
    const sStart = parseTimeToMinutes(s.startTime);
    const sEnd = parseTimeToMinutes(s.endTime);
    if (sStart >= 0 && sEnd > sStart && startMin < sEnd && endMin > sStart) {
      const safeTitle = String(s.title || '').length > 48
        ? `${String(s.title).slice(0, 48)}…`
        : s.title;
      return isAr
        ? `يوجد تعارض في هذا الموعد مع «${safeTitle}» (${formatTimeTo12h(s.startTime, true)} - ${formatTimeTo12h(s.endTime, true)}).`
        : `Time conflict with "${safeTitle}" (${formatTimeTo12h(s.startTime, false)} - ${formatTimeTo12h(s.endTime, false)}).`;
    }
  }
  return '';
}
