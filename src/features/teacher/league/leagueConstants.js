/**
 * Constants, tier definitions, scoring rules fallback, and normalizers
 * for the Teacher Course League feature.
 * Strictly aligned with backend LeagueDuration, LeagueTier, and LeagueRulesService.
 */

export const LEAGUE_DURATION_OPTIONS = [
  { id: 'weekly', days: 7, labelAr: 'أسبوعي (7 أيام)', labelEn: 'Weekly (7 days)', shortAr: 'أسبوعي', shortEn: 'Weekly' },
  { id: 'monthly', days: 30, labelAr: 'شهري (30 يوم)', labelEn: 'Monthly (30 days)', shortAr: 'شهري', shortEn: 'Monthly' },
  { id: 'half_year', days: 90, labelAr: 'نصف سنة (90 يوم)', labelEn: 'Half Year (90 days)', shortAr: 'نصف سنوي', shortEn: 'Half Year' },
  { id: 'full_year', days: 180, labelAr: 'سنة كاملة (180 يوم)', labelEn: 'Full Year (180 days)', shortAr: 'سنوي', shortEn: 'Full Year' },
];

export const LEAGUE_TIERS = [
  { id: 'Diamond', minXp: 251, labelAr: 'الماسي', fullLabelAr: 'دوري الماسي', labelEn: 'Diamond', color: '#0EA5E9', bg: 'rgba(14, 165, 233, 0.14)' },
  { id: 'Gold', minXp: 151, labelAr: 'الذهبي', fullLabelAr: 'دوري ذهبي', labelEn: 'Gold', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.14)' },
  { id: 'Silver', minXp: 66, labelAr: 'الفضي', fullLabelAr: 'دوري فضي', labelEn: 'Silver', color: '#64748B', bg: 'rgba(100, 116, 139, 0.16)' },
  { id: 'Bronze', minXp: 0, labelAr: 'البرونزي', fullLabelAr: 'دوري برونزي', labelEn: 'Bronze', color: '#B45309', bg: 'rgba(180, 83, 9, 0.14)' },
];

export const TIER_MAP = Object.fromEntries(LEAGUE_TIERS.map((t) => [t.id, t]));

export const DEFAULT_SCORING_RULES = [
  {
    id: 'question-essay',
    points: 5,
    pointsLabelAr: '+5 نقاط',
    pointsLabelEn: '+5 pts',
    titleAr: 'السؤال المقالي الصحيح',
    titleEn: 'Correct Essay Question',
    descAr: '5 نقاط عن كل سؤال مقالي يُعتمد صحيحاً بالكامل بعد تصحيح المعلم.',
    descEn: '5 pts for every essay question graded fully correct by the teacher.',
  },
  {
    id: 'question-mcq',
    points: 3,
    pointsLabelAr: '+3 نقاط',
    pointsLabelEn: '+3 pts',
    titleAr: 'السؤال الاختياري الصحيح (MCQ)',
    titleEn: 'Correct MCQ Question',
    descAr: '3 نقاط تلقائياً عن كل سؤال اختيار من متعدد صحيح في الامتحان.',
    descEn: '3 pts automatically for every correct multiple-choice question.',
  },
  {
    id: 'question-true-false',
    points: 1,
    pointsLabelAr: '+1 نقطة',
    pointsLabelEn: '+1 pt',
    titleAr: 'سؤال الصواب والخطأ الصحيح',
    titleEn: 'Correct True / False Question',
    descAr: 'نقطة واحدة عن كل سؤال صواب وخطأ صحيح في الامتحان.',
    descEn: '1 pt for every correct True/False question.',
  },
  {
    id: 'exam-full-mark',
    points: 3,
    pointsLabelAr: '+3 نقاط بونص',
    pointsLabelEn: '+3 bonus pts',
    titleAr: 'تقفيل الامتحان (Full Mark 100%)',
    titleEn: 'Exam Full Mark Bonus (100%)',
    descAr: '+3 نقاط بونص إضافية عند تحقيق الدرجة النهائية كاملة في الامتحان.',
    descEn: '+3 bonus points on top of question points for a 100% score.',
  },
  {
    id: 'daily-streak',
    points: 3,
    pointsLabelAr: '+3 نقاط / يوم',
    pointsLabelEn: '+3 pts / day',
    titleAr: 'الاستريك اليومي (الالتزام)',
    titleEn: 'Daily Streak Bonus',
    descAr: '+3 نقاط عن كل يوم التزام متواصل وتكسر التعادل في الترتيب.',
    descEn: '+3 pts per consecutive active day and breaks rank ties.',
  },
];

export function resolveTierFromXp(xp) {
  const num = Number(xp) || 0;
  if (num >= 251) return TIER_MAP.Diamond;
  if (num >= 151) return TIER_MAP.Gold;
  if (num >= 66) return TIER_MAP.Silver;
  return TIER_MAP.Bronze;
}

export function getDurationMeta(durationType) {
  return (
    LEAGUE_DURATION_OPTIONS.find((d) => d.id === durationType) ||
    LEAGUE_DURATION_OPTIONS[1]
  );
}

export function addDaysToDateInput(baseIsoDate, days) {
  const base = baseIsoDate ? new Date(baseIsoDate) : new Date();
  if (Number.isNaN(base.getTime())) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + Number(days || 30));
    return fallback.toISOString().slice(0, 10);
  }
  const target = new Date(base.getTime());
  target.setDate(target.getDate() + Number(days || 30));
  return target.toISOString().slice(0, 10);
}

export function normalizeLeagueItem(raw, prev = {}) {
  if (!raw || typeof raw !== 'object') return prev;
  const id = raw.id || raw.uuid || prev.id || '';
  const key = raw.key || id;
  const hasDetails = Array.isArray(raw.leaderboard) || Array.isArray(raw.podium);
  const durationType = raw.durationType || raw.duration_type || prev.durationType || 'monthly';
  const durMeta = getDurationMeta(durationType);

  return {
    ...prev,
    id,
    key,
    courseId: raw.courseId ?? raw.course_id ?? prev.courseId ?? null,
    groupId: raw.groupId ?? raw.group_id ?? prev.groupId ?? 'all',
    leagueTitle: raw.leagueTitle || raw.title_ar || prev.leagueTitle || 'دوري الكورس',
    courseNameAr: raw.courseNameAr || raw.course_name_ar || prev.courseNameAr || 'المقرر الدراسي',
    groupNameAr: raw.groupNameAr || raw.group_name_ar || prev.groupNameAr || 'جميع المجموعات',
    durationLabelAr: raw.durationLabelAr || prev.durationLabelAr || `دوري ${durMeta.shortAr}`,
    durationType,
    durationDays: Number(raw.durationDays ?? prev.durationDays ?? durMeta.days),
    totalCompetitors: Number(raw.totalCompetitors ?? prev.totalCompetitors ?? 0),
    roundDaysRemaining: Number(raw.roundDaysRemaining ?? prev.roundDaysRemaining ?? 0),
    isActive: raw.isActive !== undefined ? Boolean(raw.isActive) : (prev.isActive ?? true),
    startsAt: raw.startsAt ?? prev.startsAt ?? null,
    endsAt: raw.endsAt ?? prev.endsAt ?? null,
    podium: Array.isArray(raw.podium) ? raw.podium : (prev.podium || []),
    leaderboard: Array.isArray(raw.leaderboard) ? raw.leaderboard : (prev.leaderboard || []),
    scoringRules: Array.isArray(raw.scoringRules) ? raw.scoringRules : (prev.scoringRules || DEFAULT_SCORING_RULES),
    tiers: Array.isArray(raw.tiers) ? raw.tiers : (prev.tiers || null),
    _detailsLoaded: hasDetails ? true : Boolean(prev._detailsLoaded),
  };
}
