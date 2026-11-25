export const QUEUE_WEEKDAYS = [
  { key: 'saturday', labelAr: 'السبت', labelEn: 'Saturday' },
  { key: 'sunday', labelAr: 'الأحد', labelEn: 'Sunday' },
  { key: 'monday', labelAr: 'الاثنين', labelEn: 'Monday' },
  { key: 'tuesday', labelAr: 'الثلاثاء', labelEn: 'Tuesday' },
  { key: 'wednesday', labelAr: 'الأربعاء', labelEn: 'Wednesday' },
  { key: 'thursday', labelAr: 'الخميس', labelEn: 'Thursday' },
  { key: 'friday', labelAr: 'الجمعة', labelEn: 'Friday' },
];

const JS_DAY_TO_KEY = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

/**
 * Returns the lowercase English weekday key matching the current local date.
 */
export function getTodayDayKey() {
  return JS_DAY_TO_KEY[new Date().getDay()] || 'saturday';
}

/**
 * Formats a 24h time string ("14:30" or "14:30:00") into localized 12h string.
 */
export function formatTime12h(timeStr, isAr = true) {
  if (!timeStr || typeof timeStr !== 'string') return '--:--';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const rawHour = Number.parseInt(parts[0], 10);
  const minute = parts[1].slice(0, 2);
  if (Number.isNaN(rawHour)) return timeStr;

  const isPm = rawHour >= 12;
  const hour12 = rawHour % 12 === 0 ? 12 : rawHour % 12;
  const periodLabel = isAr ? (isPm ? 'م' : 'ص') : (isPm ? 'PM' : 'AM');
  return `${hour12}:${minute} ${periodLabel}`;
}

/**
 * Formats a numeric duration in minutes into a localized readable label.
 */
export function formatDurationLabel(durationMinutes, isAr = true) {
  const mins = Number(durationMinutes);
  if (!Number.isFinite(mins) || mins <= 0) return '--';

  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;

  if (hours === 0) {
    return isAr ? `${remMins} دقيقة` : `${remMins} mins`;
  }
  if (remMins === 0) {
    if (isAr) {
      return hours === 1 ? 'ساعة واحدة' : hours === 2 ? 'ساعتان' : `${hours} ساعات`;
    }
    return hours === 1 ? '1 hr' : `${hours} hrs`;
  }
  return isAr ? `${hours} س ${remMins} د` : `${hours}h ${remMins}m`;
}
