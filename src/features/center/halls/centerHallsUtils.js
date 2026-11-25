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

export const FLOOR_OPTIONS = [
  'الطابق الأرضي',
  'الطابق الأول',
  'الطابق الثاني',
  'الطابق الثالث',
  'الطابق الرابع',
];

export const PRESET_ROOM_EQUIPMENT = [
  'شاشة ذكية تفاعلية',
  'تكييف مركزي',
  'نظام صوتيات لاسلكي',
  'سبورة ذكية عريضة',
  'كاميرات مراقبة وتسجيل',
  'بروجيكتور عالي الدقة',
  'واي فاي فائق السرعة',
];

export const getTodayWeekdayKey = () => {
  const dayIndex = new Date().getDay();
  const map = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return map[dayIndex] || 'saturday';
};

export const formatTimeTo12h = (t24, isAr = true) => {
  if (!t24) return '';
  const parts = String(t24).split(':');
  if (parts.length < 2) return String(t24);
  const h = Number(parts[0]);
  const m = Number(parts[1]);
  if (Number.isNaN(h) || Number.isNaN(m)) return String(t24);
  const period = h >= 12 ? (isAr ? 'م' : 'PM') : isAr ? 'ص' : 'AM';
  const h12 = h % 12 || 12;
  const minStr = m < 10 ? `0${m}` : String(m);
  return `${h12}:${minStr} ${period}`;
};

export const normalizeHallKey = (value = '') =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[()\s\-_]+/g, '');

/**
 * Exact room matching without partial substring collisions (e.g. "قاعة 1" vs "قاعة 10").
 */
export const doesSlotMatchRoom = (slot, group, room) => {
  if (!room) return false;
  if (slot?.roomId && room.id) {
    return String(slot.roomId) === String(room.id);
  }
  if (!slot?.roomId && group?.roomId && room.id) {
    return String(group.roomId) === String(room.id);
  }
  const roomKey = normalizeHallKey(room.nameAr || room.nameEn);
  const slotKey = normalizeHallKey(slot?.hall || slot?.hallName || group?.hallName);
  return Boolean(roomKey && slotKey && roomKey === slotKey);
};

export const doesGroupMatchRoom = (group, room) => {
  if (!group || !room) return false;
  if (group.roomId && room.id && String(group.roomId) === String(room.id)) {
    return true;
  }
  const slots = group.scheduleSlots || group.slots || [];
  if (slots.some((s) => doesSlotMatchRoom(s, group, room))) {
    return true;
  }
  if (!group.roomId) {
    const roomKey = normalizeHallKey(room.nameAr || room.nameEn);
    const groupHallKey = normalizeHallKey(group.hallName);
    return Boolean(roomKey && groupHallKey && roomKey === groupHallKey);
  }
  return false;
};

export const resolveGroupEnrolledCount = (group, enrolledStudentsMap = {}) => {
  if (!group) return 0;
  const rosterList = enrolledStudentsMap[group.id];
  if (Array.isArray(rosterList) && rosterList.length > 0) {
    return rosterList.length;
  }
  const count = Number(group.enrolledCount ?? group.enrolled_count ?? 0);
  return Number.isNaN(count) ? 0 : Math.max(0, count);
};

/**
 * Compute authoritative assigned cohorts and utilization efficiency for a room.
 */
export const computeRoomCohortsAndEfficiency = (room, groups = [], enrolledStudentsMap = {}) => {
  const capacity = Math.max(1, Number(room?.capacity) || 40);
  const matchedGroups = groups.filter((g) => doesGroupMatchRoom(g, room));

  if (matchedGroups.length > 0) {
    const cohorts = matchedGroups.map((g) => {
      const enrolledCount = resolveGroupEnrolledCount(g, enrolledStudentsMap);
      const fillRatio = Math.min(100, Math.round((enrolledCount / capacity) * 100));
      return {
        id: g.id,
        nameAr: g.nameAr,
        nameEn: g.nameEn || g.nameAr,
        subjectAr: g.subjectAr,
        gradeAr: g.gradeAr,
        scheduleAr: g.scheduleAr,
        teacherNameAr: g.teacherNameAr || 'معلم معتمد',
        enrolledCount,
        capacity,
        fillRatio,
      };
    });

    const avgFill = Math.round(
      cohorts.reduce((sum, c) => sum + c.fillRatio, 0) / cohorts.length
    );

    return {
      assignedCohorts: cohorts,
      efficiencyPct: avgFill,
    };
  }

  // Fallback to backend pre-hydrated cohorts on room object when groups list is still loading
  const backendCohorts = Array.isArray(room?.assignedCohorts) ? room.assignedCohorts : [];
  const backendEfficiency =
    typeof room?.efficiencyPct === 'number' && !Number.isNaN(room.efficiencyPct)
      ? Math.min(100, Math.max(0, Math.round(room.efficiencyPct)))
      : 0;

  return {
    assignedCohorts: backendCohorts,
    efficiencyPct: backendCohorts.length > 0 ? backendEfficiency : 0,
  };
};
