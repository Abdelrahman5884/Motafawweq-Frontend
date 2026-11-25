export const WEEKDAYS = [
  { key: 'saturday', labelAr: 'السبت', labelEn: 'Saturday' },
  { key: 'sunday', labelAr: 'الأحد', labelEn: 'Sunday' },
  { key: 'monday', labelAr: 'الاثنين', labelEn: 'Monday' },
  { key: 'tuesday', labelAr: 'الثلاثاء', labelEn: 'Tuesday' },
  { key: 'wednesday', labelAr: 'الأربعاء', labelEn: 'Wednesday' },
  { key: 'thursday', labelAr: 'الخميس', labelEn: 'Thursday' },
  { key: 'friday', labelAr: 'الجمعة', labelEn: 'Friday' },
];

export const STANDARD_CENTER_SLOTS = [
  { label: '10:00 ص - 12:00 م', startTime: '10:00', endTime: '12:00' },
  { label: '12:00 م - 02:00 م', startTime: '12:00', endTime: '14:00' },
  { label: '02:00 م - 04:00 م', startTime: '14:00', endTime: '16:00' },
  { label: '04:00 م - 06:00 م', startTime: '16:00', endTime: '18:00' },
  { label: '06:00 م - 08:00 م', startTime: '18:00', endTime: '20:00' },
  { label: '08:00 م - 10:00 م', startTime: '20:00', endTime: '22:00' },
];

export const GRADE_OPTIONS = [
  'الصف الأول الإعدادي',
  'الصف الثاني الإعدادي',
  'الصف الثالث الإعدادي',
  'الصف الأول الثانوي',
  'الصف الثاني الثانوي',
  'الصف الثالث الثانوي',
];

export function formatTimeTo12h(t24, isAr = true) {
  if (!t24 || typeof t24 !== 'string') return '';
  const parts = t24.split(':');
  if (parts.length < 2) return t24;
  const h = Number.parseInt(parts[0], 10);
  const m = Number.parseInt(parts[1], 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return t24;
  const isPm = h >= 12;
  const period = isAr ? (isPm ? 'م' : 'ص') : (isPm ? 'PM' : 'AM');
  const h12 = h % 12 || 12;
  const mStr = m < 10 ? `0${m}` : String(m);
  return `${h12}:${mStr} ${period}`;
}

export function generateScheduleSummary(sessions = [], isAr = true) {
  if (!Array.isArray(sessions) || sessions.length === 0) return '';
  const dayLabels = sessions.map((s) => {
    const found = WEEKDAYS.find((w) => w.key === s.day);
    return found ? (isAr ? found.labelAr : found.labelEn) : s.day;
  });
  const uniqueDays = Array.from(new Set(dayLabels));
  const firstSess = sessions[0];
  if (isAr) {
    return `${uniqueDays.join(' و')} من ${formatTimeTo12h(firstSess.startTime, true)} إلى ${formatTimeTo12h(firstSess.endTime, true)}`;
  }
  return `${uniqueDays.join(', ')} (${formatTimeTo12h(firstSess.startTime, false)} - ${formatTimeTo12h(firstSess.endTime, false)})`;
}

export function getSlotAvailabilityForSession(
  dayKey,
  hallName,
  currentSessionIdx,
  sessions = [],
  checkScheduleConflict,
  excludeGroupId = null,
  teacherHint = null
) {
  const dayObj = WEEKDAYS.find((w) => w.key === dayKey);
  const dayAr = dayObj?.labelAr || dayKey;

  return STANDARD_CENTER_SLOTS.map((slot) => {
    const extConflict = checkScheduleConflict
      ? checkScheduleConflict(
          {
            day: dayKey,
            dayAr,
            startTime: slot.startTime,
            endTime: slot.endTime,
            hall: hallName,
          },
          null,
          excludeGroupId,
          teacherHint
        )
      : { hasConflict: false };

    let internalConflict = false;
    let internalReason = '';
    sessions.forEach((otherSess, otherIdx) => {
      if (
        otherIdx !== currentSessionIdx &&
        otherSess.day === dayKey &&
        (otherSess.hall || '').trim() === (hallName || '').trim()
      ) {
        const overlap = slot.startTime < otherSess.endTime && slot.endTime > otherSess.startTime;
        if (overlap) {
          internalConflict = true;
          internalReason = `الحصة رقم ${otherIdx + 1} محجوزة في نفس التوقيت`;
        }
      }
    });

    const isAvailable = !extConflict?.hasConflict && !internalConflict;
    const conflictMsg = extConflict?.hasConflict
      ? extConflict.conflictingGroup
        ? `محجوز لـ «${extConflict.conflictingGroup.nameAr}»`
        : extConflict.messageAr || 'محجوز لمجموعة أخرى'
      : internalConflict
      ? internalReason
      : '';

    return {
      ...slot,
      isAvailable,
      conflictMsg,
    };
  });
}

export function computeSessionConflicts(
  sessions = [],
  checkScheduleConflict,
  excludeGroupId = null,
  teacherHint = null
) {
  return sessions.map((sess, idx) => {
    const dayObj = WEEKDAYS.find((w) => w.key === sess.day);
    const conflictResult = checkScheduleConflict
      ? checkScheduleConflict(
          {
            day: sess.day,
            dayAr: dayObj?.labelAr || sess.day,
            startTime: sess.startTime,
            endTime: sess.endTime,
            hall: sess.hall,
          },
          null,
          excludeGroupId,
          teacherHint
        )
      : { hasConflict: false };

    let internalConflict = false;
    let internalConflictMsg = '';
    sessions.forEach((otherSess, otherIdx) => {
      if (otherIdx !== idx && otherSess.day === sess.day) {
        const overlap = sess.startTime < otherSess.endTime && sess.endTime > otherSess.startTime;
        if (overlap) {
          const sameHall =
            (otherSess.hall || '').trim() !== '' &&
            (otherSess.hall || '').trim() === (sess.hall || '').trim();
          internalConflict = true;
          internalConflictMsg = sameHall
            ? `تعارض داخلي: يتطابق توقيت هذه الحصة مع الحصة رقم ${otherIdx + 1} في نفس القاعة!`
            : `تعارض داخلي: لا يمكن جدولة حصتين لنفس المجموعة في نفس التوقيت يوم ${dayObj?.labelAr || sess.day}!`;
        }
      }
    });

    const hasConflict = Boolean(conflictResult?.hasConflict || internalConflict);
    const messageAr = conflictResult?.hasConflict ? conflictResult.messageAr : internalConflictMsg;

    return {
      session: sess,
      dayLabel: dayObj?.labelAr || sess.day,
      hasConflict,
      messageAr,
    };
  });
}

export function playScannerBeep() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const audioCtx = new AudioCtx();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } catch {
    // AudioContext not permitted or unsupported
  }
}
