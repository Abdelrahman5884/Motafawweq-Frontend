/**
 * Motafawweq — Student Subscription Plans & Feature Gating Registry
 * Mirrors App\Enums\StudentPlanTier & StudentBillingService::getPlansCatalog().
 */

export const STUDENT_TIER_RANK = {
  free: 0,
  plus: 1,
  pro: 2,
};

export const STUDENT_PLANS = {
  free: {
    tier: 'free',
    nameAr: 'باقة الطالب المجانية',
    nameEn: 'Student Free',
    shortAr: 'مجاني',
    shortEn: 'Free',
    monthlyPriceEgp: 0,
  },
  plus: {
    tier: 'plus',
    nameAr: 'باقة الطالب بلس (Plus)',
    nameEn: 'Student Plus',
    shortAr: 'Plus',
    shortEn: 'Plus',
    monthlyPriceEgp: 50,
  },
  pro: {
    tier: 'pro',
    nameAr: 'باقة الطالب برو (Pro)',
    nameEn: 'Student Pro',
    shortAr: 'Pro',
    shortEn: 'Pro',
    monthlyPriceEgp: 80,
  },
};

export const STUDENT_FEATURE_GATES = {
  league: {
    key: 'league',
    requiredTier: 'plus',
    titleAr: 'دوري المتفوقين والترتيب',
    titleEn: 'Honors League & Leaderboard',
    descAr:
      'المنافسة في دوري المعلمين ودوري أبطال الجمهورية ونظام النقاط والترتيب الرسمي متاحة فقط لمشتركي باقة الطالب بلس (Plus) أو باقة الطالب برو (Pro).',
    descEn:
      'Teacher Course Leagues, Republic League, and official rankings require an active Student Plus or Student Pro subscription.',
  },
  gamification: {
    key: 'gamification',
    requiredTier: 'plus',
    titleAr: 'الإنجازات والجوائز والتحديات',
    titleEn: 'Achievements, Badges & Challenges',
    descAr:
      'لوحة إنجازاتك، التحديات الأسبوعية، شارات التميز، وخريطة الالتزام اليومي متاحة لمشتركي باقة الطالب بلس (Plus) أو باقة الطالب برو (Pro).',
    descEn:
      'Achievements hub, weekly challenges, badges, and activity heatmap require an active Student Plus or Student Pro subscription.',
  },
  certificates: {
    key: 'certificates',
    requiredTier: 'plus',
    titleAr: 'الشهادات المعتمدة بكود QR',
    titleEn: 'Verified QR Certificates',
    descAr:
      'إصدار وتحميل شهادات الإتمام والتفوق الرسمية الموثّقة برقم تسلسلي وكود QR متاح لمشتركي باقة الطالب بلس (Plus) أو باقة الطالب برو (Pro).',
    descEn:
      'Official verified certificates with serial numbers and QR verification require an active Student Plus or Student Pro subscription.',
  },
  quiz: {
    key: 'quiz',
    requiredTier: 'plus',
    titleAr: 'الكويزات والتدريبات الذكية',
    titleEn: 'Practice Quizzes & Question Banks',
    descAr:
      'الاختبارات التدريبية وبنوك الأسئلة غير المحدودة متاحة لمشتركي باقة الطالب بلس (Plus) أو باقة الطالب برو (Pro).',
    descEn:
      'Unlimited practice quizzes and question banks require an active Student Plus or Student Pro subscription.',
  },
  'smart-lecture': {
    key: 'smart-lecture',
    requiredTier: 'pro',
    titleAr: 'تحويل المحاضرة بالذكاء الاصطناعي (AI)',
    titleEn: 'AI Smart Lecture Converter',
    descAr:
      'تحويل محاضرات الصوت والفيديو وملفات PDF إلى ملخصات وخرائط مفاهيم وكويزات بابل شيت فورية متاح حصرياً لمشتركي باقة الطالب برو (Pro).',
    descEn:
      'Converting audio, video, and PDF lectures into summaries, mind maps, and Bubble-Sheet quizzes is exclusively available on Student Pro.',
  },
  'converted-lectures': {
    key: 'converted-lectures',
    requiredTier: 'pro',
    titleAr: 'أرشيف المحاضرات المحولة بالـ AI',
    titleEn: 'AI Converted Lectures Archive',
    descAr:
      'الوصول إلى أرشيف المحاضرات المحولة بالذكاء الاصطناعي وملخصاتها وخرائطها الذهنية متاح حصرياً لمشتركي باقة الطالب برو (Pro).',
    descEn:
      'Accessing your AI-converted lectures archive, summaries, and mind maps is exclusively available on Student Pro.',
  },
  revision: {
    key: 'revision',
    requiredTier: 'pro',
    titleAr: 'المراجعة الذكية وخطة التفوق',
    titleEn: 'Smart Revision Planner',
    descAr:
      'خطة المراجعة الشخصية الذكية وبنك الأخطاء متاح حصرياً لمشتركي باقة الطالب برو (Pro).',
    descEn:
      'Personalized AI revision planning and mistake bank review are exclusively available on Student Pro.',
  },
  'weak-areas': {
    key: 'weak-areas',
    requiredTier: 'pro',
    titleAr: 'مركز تقوية نقاط الضعف بالـ AI',
    titleEn: 'AI Weak-Areas Diagnostics Hub',
    descAr:
      'تشخيص نقاط الضعف وتحليل الأخطاء بالذكاء الاصطناعي متاح حصرياً لمشتركي باقة الطالب برو (Pro).',
    descEn:
      'AI weak-areas diagnostics and targeted error analysis are exclusively available on Student Pro.',
  },
};

export function normalizeStudentPlanTier(raw) {
  const clean = String(raw || '').trim().toLowerCase();
  return clean === 'pro' || clean === 'plus' ? clean : 'free';
}

export function getStudentFeatureGate(featureKey) {
  return STUDENT_FEATURE_GATES[featureKey] || null;
}

export function hasStudentFeatureAccess(planTier, featureKey) {
  const gate = getStudentFeatureGate(featureKey);
  if (!gate) return true;
  const currentRank = STUDENT_TIER_RANK[normalizeStudentPlanTier(planTier)] ?? 0;
  const requiredRank = STUDENT_TIER_RANK[gate.requiredTier] ?? 0;
  return currentRank >= requiredRank;
}
