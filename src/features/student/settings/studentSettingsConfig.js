/**
 * Motafawweq — Student Settings Configuration & Pure Helpers
 * Canonical Egyptian curriculum grades, tracks, governorates, and form state helpers.
 */

export const GRADE_GROUPS = [
  {
    id: 'stage-primary',
    labelAr: 'المرحلة الابتدائية',
    labelEn: 'Primary Stage',
    grades: [
      { value: 'الصف الأول الابتدائي', labelAr: 'الصف الأول الابتدائي', labelEn: '1st Primary', stage: 'stage-primary' },
      { value: 'الصف الثاني الابتدائي', labelAr: 'الصف الثاني الابتدائي', labelEn: '2nd Primary', stage: 'stage-primary' },
      { value: 'الصف الثالث الابتدائي', labelAr: 'الصف الثالث الابتدائي', labelEn: '3rd Primary', stage: 'stage-primary' },
      { value: 'الصف الرابع الابتدائي', labelAr: 'الصف الرابع الابتدائي', labelEn: '4th Primary', stage: 'stage-primary' },
      { value: 'الصف الخامس الابتدائي', labelAr: 'الصف الخامس الابتدائي', labelEn: '5th Primary', stage: 'stage-primary' },
      { value: 'الصف السادس الابتدائي', labelAr: 'الصف السادس الابتدائي', labelEn: '6th Primary', stage: 'stage-primary' },
    ],
  },
  {
    id: 'stage-prep',
    labelAr: 'المرحلة الإعدادية',
    labelEn: 'Preparatory Stage',
    grades: [
      { value: 'الصف الأول الإعدادي', labelAr: 'الصف الأول الإعدادي', labelEn: '1st Preparatory', stage: 'stage-prep' },
      { value: 'الصف الثاني الإعدادي', labelAr: 'الصف الثاني الإعدادي', labelEn: '2nd Preparatory', stage: 'stage-prep' },
      { value: 'الصف الثالث الإعدادي', labelAr: 'الصف الثالث الإعدادي (الشهادة الإعدادية)', labelEn: '3rd Preparatory (Certificate)', stage: 'stage-prep' },
    ],
  },
  {
    id: 'stage-secondary',
    labelAr: 'المرحلة الثانوية',
    labelEn: 'Secondary Stage',
    grades: [
      { value: 'الصف الأول الثانوي', labelAr: 'الصف الأول الثانوي', labelEn: '1st Secondary', stage: 'stage-secondary' },
      { value: 'الصف الثاني الثانوي', labelAr: 'الصف الثاني الثانوي', labelEn: '2nd Secondary', stage: 'stage-secondary' },
      { value: 'الصف الثالث الثانوي', labelAr: 'الصف الثالث الثانوي (الثانوية العامة)', labelEn: '3rd Secondary (Thanawya Amma)', stage: 'stage-thanawya' },
    ],
  },
];

const LEGACY_GRADE_MAP = {
  '1st Primary': 'الصف الأول الابتدائي',
  '2nd Primary': 'الصف الثاني الابتدائي',
  '3rd Primary': 'الصف الثالث الابتدائي',
  '4th Primary': 'الصف الرابع الابتدائي',
  '5th Primary': 'الصف الخامس الابتدائي',
  '6th Primary': 'الصف السادس الابتدائي',
  '1st Preparatory': 'الصف الأول الإعدادي',
  '2nd Preparatory': 'الصف الثاني الإعدادي',
  '3rd Preparatory': 'الصف الثالث الإعدادي',
  '3rd Preparatory (Certificate)': 'الصف الثالث الإعدادي',
  '1st Secondary': 'الصف الأول الثانوي',
  '2nd Secondary': 'الصف الثاني الثانوي',
  '3rd Secondary': 'الصف الثالث الثانوي',
  '3rd Secondary (Thanawya Amma)': 'الصف الثالث الثانوي',
};

const ALL_GRADES = GRADE_GROUPS.flatMap((g) => g.grades);

export function normalizeGradeAr(raw) {
  const clean = String(raw || '').trim();
  if (!clean) return 'الصف الثالث الثانوي';
  if (LEGACY_GRADE_MAP[clean]) return LEGACY_GRADE_MAP[clean];
  const exists = ALL_GRADES.some((g) => g.value === clean);
  return exists ? clean : 'الصف الثالث الثانوي';
}

export function getStageForGrade(gradeAr) {
  const normalized = normalizeGradeAr(gradeAr);
  return ALL_GRADES.find((g) => g.value === normalized)?.stage || 'stage-thanawya';
}

export function getTracksForGrade(gradeAr) {
  const normalized = normalizeGradeAr(gradeAr);

  if (normalized === 'الصف الثالث الثانوي') {
    return [
      { value: 'علمي علوم', labelAr: 'علمي علوم', labelEn: 'Scientific — Biology' },
      { value: 'علمي رياضة', labelAr: 'علمي رياضة', labelEn: 'Scientific — Mathematics' },
      { value: 'أدبي', labelAr: 'الشعبة الأدبية (أدبي)', labelEn: 'Literary / Humanities' },
      { value: 'علمي علوم لغات', labelAr: 'علمي علوم (لغات)', labelEn: 'Scientific Biology (Languages)' },
      { value: 'علمي رياضة لغات', labelAr: 'علمي رياضة (لغات)', labelEn: 'Scientific Math (Languages)' },
      { value: 'أزهر', labelAr: 'التعليم الأزهري', labelEn: 'Al-Azhar' },
    ];
  }

  if (normalized === 'الصف الثاني الثانوي') {
    return [
      { value: 'علمي', labelAr: 'الشعبة العلمية (علمي)', labelEn: 'Scientific Track' },
      { value: 'أدبي', labelAr: 'الشعبة الأدبية (أدبي)', labelEn: 'Literary Track' },
      { value: 'علمي لغات', labelAr: 'علمي (لغات)', labelEn: 'Scientific (Languages)' },
      { value: 'أدبي لغات', labelAr: 'أدبي (لغات)', labelEn: 'Literary (Languages)' },
      { value: 'أزهر', labelAr: 'التعليم الأزهري', labelEn: 'Al-Azhar' },
    ];
  }

  return [
    { value: 'عام', labelAr: 'التعليم العام (عربي)', labelEn: 'General Curriculum (Arabic)' },
    { value: 'لغات', labelAr: 'مدارس لغات وتجريبي', labelEn: 'Experimental / Languages' },
    { value: 'أزهر', labelAr: 'التعليم الأزهري', labelEn: 'Al-Azhar' },
  ];
}

export const EGYPT_GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'القليوبية',
  'الدقهلية',
  'الشرقية',
  'المنوفية',
  'الغربية',
  'البحيرة',
  'دمياط',
  'كفر الشيخ',
  'بورسعيد',
  'الإسماعيلية',
  'السويس',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'البحر الأحمر',
  'الوادي الجديد',
  'مطروح',
  'شمال سيناء',
  'جنوب سيناء',
];

export const PLAYBACK_SPEED_OPTIONS = ['0.75x', '1.0x', '1.25x', '1.5x', '1.75x', '2.0x'];
export const DAILY_GOAL_OPTIONS = [30, 60, 90, 120, 180];
export const WEEKLY_EXAMS_OPTIONS = [1, 2, 3, 5, 7];
export const TARGET_SCORE_OPTIONS = [75, 80, 85, 90, 95, 100];

export const PLAYBACK_SPEED_STORAGE_KEY = 'motafawweq_student_playback_speed';

export function normalizePlaybackSpeed(raw) {
  const num = parseFloat(String(raw || '1.0').replace(/x$/i, ''));
  const allowed = [0.75, 1, 1.25, 1.5, 1.75, 2];
  const valid = allowed.includes(num) ? num : 1;
  return valid === 1 ? '1.0x' : valid === 2 ? '2.0x' : `${valid}x`;
}

export function buildFormStateFromProfile(profile = {}, fallbackUser = {}) {
  const gradeAr = normalizeGradeAr(profile.gradeAr ?? fallbackUser?.grade);
  const validTracks = getTracksForGrade(gradeAr);
  const rawTrack = String(profile.trackAr ?? fallbackUser?.track ?? '').trim();
  const trackAr = validTracks.some((t) => t.value === rawTrack)
    ? rawTrack
    : validTracks[0].value;

  const hasProfileAvatar = Object.prototype.hasOwnProperty.call(profile, 'avatar');
  const avatar = hasProfileAvatar ? (profile.avatar || null) : (fallbackUser?.avatar || null);

  return {
    name: String(profile.name ?? fallbackUser?.nameAr ?? fallbackUser?.name ?? ''),
    email: String(profile.email ?? fallbackUser?.email ?? ''),
    emailVerified: Boolean(profile.emailVerified ?? fallbackUser?.email_verified ?? true),
    phone: String(profile.phone ?? fallbackUser?.phone ?? ''),
    parentPhone: String(profile.parentPhone ?? ''),
    studentCode: String(profile.studentCode ?? fallbackUser?.student_code ?? fallbackUser?.studentCode ?? ''),
    avatar,
    gradeAr,
    trackAr,
    governorate: String(profile.governorate ?? ''),
    schoolName: String(profile.schoolName ?? ''),
    centerName: String(profile.centerName ?? ''),
    dailyStudyGoalMinutes: Number(profile.dailyStudyGoalMinutes || 120),
    weeklyExamsGoal: Number(profile.weeklyExamsGoal || 3),
    targetScorePercent: Number(profile.targetScorePercent || 90),
    showOnLeaderboard: profile.showOnLeaderboard !== undefined ? Boolean(profile.showOnLeaderboard) : true,
    displayNameMode: ['full', 'initials', 'nickname'].includes(profile.displayNameMode)
      ? profile.displayNameMode
      : 'full',
    nickname: String(profile.nickname ?? ''),
    playbackSpeed: normalizePlaybackSpeed(profile.preferences?.playbackSpeed || '1.0x'),
  };
}

const TRACKED_EDITABLE_KEYS = [
  'name',
  'phone',
  'parentPhone',
  'gradeAr',
  'trackAr',
  'governorate',
  'schoolName',
  'centerName',
  'dailyStudyGoalMinutes',
  'weeklyExamsGoal',
  'targetScorePercent',
  'showOnLeaderboard',
  'displayNameMode',
  'nickname',
  'playbackSpeed',
];

export function isFormDirty(current, snapshot) {
  if (!current || !snapshot) return false;
  return TRACKED_EDITABLE_KEYS.some((key) => String(current[key] ?? '') !== String(snapshot[key] ?? ''));
}

/**
 * Mirrors StudentGamificationService::resolveMaskedDisplayName so the student sees
 * an exact live preview of how classmates see them on league leaderboards.
 */
export function formatLeaderboardPreview({ name, showOnLeaderboard, displayNameMode, nickname, isAr }) {
  const cleanName = String(name || '').trim() || (isAr ? 'طالب متفوق' : 'Motafawweq Student');

  if (!showOnLeaderboard) {
    return isAr ? 'طالب متفوق (مخفي)' : 'Top Student (Hidden)';
  }

  if (displayNameMode === 'nickname' && String(nickname || '').trim()) {
    return String(nickname).trim();
  }

  if (displayNameMode === 'initials') {
    const parts = cleanName.split(/\s+/).filter(Boolean);
    const first = parts[0] || cleanName;
    const secondInitial = parts[1] ? `${Array.from(parts[1])[0]}.` : '';
    return `${first} ${secondInitial}`.trim();
  }

  return cleanName;
}
