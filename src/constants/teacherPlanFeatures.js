/**
 * Motafawweq — Teacher Subscription Plans, Quotas & Feature Gating Registry
 * Mirrors App\Enums\TeacherPlanTier & TeacherBillingService::getPlansCatalog().
 */

export const TEACHER_TIER_RANK = {
  free: 0,
  plus: 1,
  pro: 2,
};

export const TEACHER_PLANS = {
  free: {
    tier: 'free',
    nameAr: 'الباقة المجانية للمعلم',
    nameEn: 'Teacher Free',
    shortAr: 'مجاني',
    shortEn: 'Free',
    monthlyPriceEgp: 0,
  },
  plus: {
    tier: 'plus',
    nameAr: 'باقة المعلم بلس (Plus)',
    nameEn: 'Teacher Plus',
    shortAr: 'Plus',
    shortEn: 'Plus',
    monthlyPriceEgp: 120,
  },
  pro: {
    tier: 'pro',
    nameAr: 'باقة المعلم برو (Pro)',
    nameEn: 'Teacher Pro',
    shortAr: 'Pro',
    shortEn: 'Pro',
    monthlyPriceEgp: 150,
  },
};

export const TEACHER_PLAN_QUOTAS = {
  free: {
    maxCourses: 1,
    maxLessons: 3,
    maxGroups: 1,
    maxStudentsPerGroup: 50,
    maxStudents: 50,
    allowsAi: false,
  },
  plus: {
    maxCourses: null,
    maxLessons: null,
    maxGroups: 12,
    maxStudentsPerGroup: null,
    maxStudents: null,
    allowsAi: false,
  },
  pro: {
    maxCourses: null,
    maxLessons: null,
    maxGroups: null,
    maxStudentsPerGroup: null,
    maxStudents: null,
    allowsAi: true,
  },
};

export const TEACHER_SUBSCRIPTION_CATALOG = [
  {
    id: 'teacher-plan-free',
    tier: 'free',
    nameAr: 'الباقة المجانية للمعلم',
    nameEn: 'Teacher Free',
    subtitleAr: 'ابدأ تجربتك على المنصة بإنشاء كورس واحد ومجموعة واحدة مجاناً.',
    subtitleEn: 'Start on the platform with 1 course, up to 3 lessons, and 1 study group for free.',
    color: 'var(--text-secondary)',
    popular: false,
    pricing: {
      monthly: {
        priceEgp: 0,
        originalPriceEgp: null,
        periodAr: 'مجاناً مدى الحياة',
        periodEn: 'Forever Free',
        badgeAr: 'مجانية 100%',
        badgeEn: '100% Free',
      },
      term: {
        priceEgp: 0,
        originalPriceEgp: null,
        periodAr: 'مجاناً مدى الحياة',
        periodEn: 'Forever Free',
        badgeAr: 'مجانية 100%',
        badgeEn: '100% Free',
      },
      annual: {
        priceEgp: 0,
        originalPriceEgp: null,
        periodAr: 'مجاناً مدى الحياة',
        periodEn: 'Forever Free',
        badgeAr: 'مجانية 100%',
        badgeEn: '100% Free',
      },
    },
    featuresAr: [
      'إنشاء كورس دراسي واحد (1 كورس فقط)',
      'رفع حتى 3 حصص دراسية (صوت أو فيديو أو PDF) بدون AI',
      'إنشاء مجموعة دراسية واحدة فقط بحد أقصى 50 طالب',
      'إدارة قائمة طلاب المجموعة وتسجيل الحضور والغياب بالباركود',
    ],
    featuresEn: [
      'Create 1 active course',
      'Upload up to 3 lessons (Audio, Video, or PDF) without AI',
      'Create 1 study group with up to 50 students max',
      'Student roster management and QR attendance tracking',
    ],
    limitationsAr: [
      'الجدول الأسبوعي المنظّم للمجموعات والحصص',
      'الامتحانات الإلكترونية والواجبات ودوري الكورس والشهادات والماليات',
      'كافة أدوات الذكاء الاصطناعي (AI) على الحصص',
    ],
    limitationsEn: [
      'Weekly timetable organizer for groups & sessions',
      'Exams, Homework grading, Course Leagues, Certificates & Financials',
      'All lesson AI capabilities (Transcript, Mind Map & Smart Chapters)',
    ],
  },
  {
    id: 'teacher-plan-plus',
    tier: 'plus',
    nameAr: 'باقة المعلم بلس (Plus)',
    nameEn: 'Teacher Plus',
    subtitleAr: 'كل أدوات إدارة الكورسات والمجموعات والجدول والامتحانات والماليات بلا قيود — ماعدا AI.',
    subtitleEn: 'Full teaching suite: up to 12 groups, unlimited courses & lessons, weekly schedule, exams & financials (without AI).',
    color: '#0284C7',
    popular: true,
    pricing: {
      monthly: {
        priceEgp: 120,
        originalPriceEgp: null,
        periodAr: 'اشتراك شهري (30 يوماً)',
        periodEn: 'Monthly (30 days)',
        badgeAr: 'الأكثر اختياراً للمعلمين',
        badgeEn: 'Most Popular',
      },
      term: {
        priceEgp: 480,
        originalPriceEgp: 600,
        periodAr: 'نصف سنة دراسية (5 شهور)',
        periodEn: 'Semester Pass (5 Months)',
        badgeAr: 'وفر 20%',
        badgeEn: 'Save 20%',
      },
      annual: {
        priceEgp: 900,
        originalPriceEgp: 1200,
        periodAr: 'سنة دراسية كاملة (10 شهور)',
        periodEn: 'Full Academic Year',
        badgeAr: 'وفر 25%',
        badgeEn: 'Save 25%',
      },
    },
    featuresAr: [
      'إنشاء حتى 12 مجموعة دراسية بعدد طلاب مفتوح في كل مجموعة',
      'إنشاء عدد غير محدود من الكورسات ورفع عدد غير محدود من الحصص',
      'الجدول الأسبوعي الكامل لتنظيم مواعيد المجموعات والملاحظات بدون تعارض',
      'الامتحانات الإلكترونية وبنك الأسئلة + الواجبات والتصحيح الكامل',
      'دوري الكورس التنافسي، الشهادات المعتمدة بكود QR، وإدارة المدفوعات والماليات',
      'العلامة المائية الديناميكية لحماية الحصص وتنبيهات ولي الأمر',
    ],
    featuresEn: [
      'Create up to 12 study groups with unlimited students',
      'Unlimited courses and unlimited lesson uploads',
      'Full Weekly Schedule organizer with conflict detection & notes',
      'Online Exams, Question Bank & Homework grading workflows',
      'Course Leagues, QR-verified Certificates & Direct Financials',
      'Dynamic DRM watermark protection & parent alerts',
    ],
    limitationsAr: [
      'أدوات الذكاء الاصطناعي (AI) على الحصص (التفريغ النصي، خريطة المفاهيم، والمعالجة الذكية)',
    ],
    limitationsEn: [
      'Lesson AI capabilities (AI Transcript, Concept Mind Map & AI Processing)',
    ],
  },
  {
    id: 'teacher-plan-pro',
    tier: 'pro',
    nameAr: 'باقة المعلم برو (Pro)',
    nameEn: 'Teacher Pro',
    subtitleAr: 'كل مزايا بلس + مجموعات غير محدودة + كافة أدوات الذكاء الاصطناعي (AI) على الحصص.',
    subtitleEn: 'Everything in Plus + unlimited study groups + the complete AI lesson studio & workspace.',
    color: '#1588C7',
    popular: false,
    pricing: {
      monthly: {
        priceEgp: 150,
        originalPriceEgp: null,
        periodAr: 'اشتراك شهري (30 يوماً)',
        periodEn: 'Monthly (30 days)',
        badgeAr: 'شاملة AI ومجموعات مفتوحة',
        badgeEn: 'All AI • Unlimited Groups',
      },
      term: {
        priceEgp: 600,
        originalPriceEgp: 750,
        periodAr: 'نصف سنة دراسية (5 شهور)',
        periodEn: 'Semester Pass (5 Months)',
        badgeAr: 'شاملة AI • وفر 20%',
        badgeEn: 'AI Included • Save 20%',
      },
      annual: {
        priceEgp: 1125,
        originalPriceEgp: 1500,
        periodAr: 'سنة دراسية كاملة (10 شهور)',
        periodEn: 'Full Academic Year',
        badgeAr: 'أقوى قيمة • وفر 25%',
        badgeEn: 'Best Value • Save 25%',
      },
    },
    featuresAr: [
      'كافة مزايا باقة المعلم بلس بدون أي قيود',
      'إنشاء عدد غير محدود من المجموعات الدراسية (أكثر من 12 مجموعة)',
      'التفريغ النصي الذكي المتزامن للحصص بالذكاء الاصطناعي (AI Speech-to-Text)',
      'توليد خرائط المفاهيم التفاعلية (NotebookLM Concept Graph) تلقائياً لكل حصة',
      'فهرسة الفصول والمفاهيم الذكية وشاشة معالجة الحصص بالذكاء الاصطناعي',
    ],
    featuresEn: [
      'Everything in Teacher Plus with zero limits',
      'Unlimited study groups (beyond 12 groups)',
      'AI Synchronized Lesson Transcript (Speech-to-Text)',
      'AI Interactive Concept Mind Maps (NotebookLM Concept Graph)',
      'AI Smart Chapter Indexing & AI Lesson Processing Studio',
    ],
    limitationsAr: [],
    limitationsEn: [],
  },
];

export const TEACHER_FEATURE_GATES = {
  schedule: {
    key: 'schedule',
    requiredTier: 'plus',
    titleAr: 'جدول المواعيد والقاعات الأسبوعي',
    titleEn: 'Weekly Schedule & Timetable Organizer',
    descAr:
      'الجدول الأسبوعي لتنظيم مواعيد المجموعات والقاعات ومنع تعارض الحصص وتدوين الملاحظات اليومية متاح لمشتركي باقة المعلم بلس (Plus) أو باقة المعلم برو (Pro).',
    descEn:
      'The interactive weekly schedule organizer with conflict detection and daily notes requires an active Teacher Plus or Teacher Pro subscription.',
  },
  exams: {
    key: 'exams',
    requiredTier: 'plus',
    titleAr: 'بنك الأسئلة والامتحانات الإلكترونية',
    titleEn: 'Question Bank & Online Exams',
    descAr:
      'إنشاء الامتحانات الإلكترونية وبنك الأسئلة ونظام البابل شيت والتصحيح التلقائي والمقالي متاح لمشتركي باقة المعلم بلس (Plus) أو باقة المعلم برو (Pro).',
    descEn:
      'Building online exams, Bubble Sheet tests, question banks, and grading workflows requires an active Teacher Plus or Teacher Pro subscription.',
  },
  homework: {
    key: 'homework',
    requiredTier: 'plus',
    titleAr: 'الواجبات المنزلية والتصحيح',
    titleEn: 'Homework Management & Grading',
    descAr:
      'إنشاء الواجبات الدراسية واستقبال تسليمات الطلاب وتصحيحها ورصد الدرجات والملاحظات متاح لمشتركي باقة المعلم بلس (Plus) أو باقة المعلم برو (Pro).',
    descEn:
      'Assigning homework, reviewing student submissions, and grading with feedback requires an active Teacher Plus or Teacher Pro subscription.',
  },
  leagues: {
    key: 'leagues',
    requiredTier: 'plus',
    titleAr: 'دوري الكورس والتحديات التنافسية',
    titleEn: 'Course Leagues & XP Leaderboards',
    descAr:
      'إطلاق دوري الكورس التنافسي ومنح نقاط XP وتتويج أوائل الطلاب بلوحة المتصدرين متاح لمشتركي باقة المعلم بلس (Plus) أو باقة المعلم برو (Pro).',
    descEn:
      'Launching competitive course leagues, awarding XP, and crowning top students requires an active Teacher Plus or Teacher Pro subscription.',
  },
  certificates: {
    key: 'certificates',
    requiredTier: 'plus',
    titleAr: 'الشهادات المعتمدة بكود QR',
    titleEn: 'QR-Verified Academic Certificates',
    descAr:
      'إصدار شهادات الإتمام والتفوق الرقمية الموثّقة برقم تسلسلي وكود تحقق QR لطلابك متاح لمشتركي باقة المعلم بلس (Plus) أو باقة المعلم برو (Pro).',
    descEn:
      'Issuing verified digital completion and excellence certificates with serial numbers and QR codes requires an active Teacher Plus or Teacher Pro subscription.',
  },
  financials: {
    key: 'financials',
    requiredTier: 'plus',
    titleAr: 'الأرباح والمحفظة ومتابعة المدفوعات',
    titleEn: 'Earnings, Payouts & Direct Student Payments',
    descAr:
      'متابعة إيرادات الكورسات ومراجعة تحويلات الطلاب المباشرة وتأكيد الاشتراكات متاح لمشتركي باقة المعلم بلس (Plus) أو باقة المعلم برو (Pro).',
    descEn:
      'Tracking course revenue, reviewing direct student transfers, and confirming enrollments requires an active Teacher Plus or Teacher Pro subscription.',
  },
  ai_processing: {
    key: 'ai_processing',
    requiredTier: 'pro',
    titleAr: 'معالجة الحصص بالذكاء الاصطناعي (AI)',
    titleEn: 'AI Lesson Processing Studio',
    descAr:
      'معالجة الحصص تلقائياً بالذكاء الاصطناعي لتوليد التفريغ النصي وخرائط المفاهيم وفهرسة الفصول متاح حصرياً لمشتركي باقة المعلم برو (Pro).',
    descEn:
      'Automated AI lesson processing for synchronized transcripts, concept maps, and smart chapters is exclusively available on Teacher Pro.',
  },
  ai_studio: {
    key: 'ai_studio',
    requiredTier: 'pro',
    titleAr: 'أدوات الذكاء الاصطناعي في استوديو التسجيل',
    titleEn: 'AI Recording Studio Capabilities',
    descAr:
      'تفعيل الذكاء الاصطناعي على الحصص أثناء التسجيل والرفع متاح حصرياً لمشتركي باقة المعلم برو (Pro).',
    descEn:
      'Enabling AI lesson analysis during recording and upload is exclusively available on Teacher Pro.',
  },
  ai_transcript: {
    key: 'ai_transcript',
    requiredTier: 'pro',
    titleAr: 'التفريغ النصي الذكي للحصة (AI Speech-to-Text)',
    titleEn: 'AI Synchronized Lesson Transcript',
    descAr:
      'التفريغ النصي المتزامن للحصص بالذكاء الاصطناعي وتعديله متاح حصرياً لمشتركي باقة المعلم برو (Pro).',
    descEn:
      'AI synchronized lesson transcription and editing is exclusively available on Teacher Pro.',
  },
  ai_mindmap: {
    key: 'ai_mindmap',
    requiredTier: 'pro',
    titleAr: 'خريطة المفاهيم الذكية (AI Concept Mind Map)',
    titleEn: 'AI Interactive Concept Mind Map',
    descAr:
      'توليد وبناء خرائط المفاهيم التفاعلية (NotebookLM) على الحصص بالذكاء الاصطناعي متاح حصرياً لمشتركي باقة المعلم برو (Pro).',
    descEn:
      'Generating and editing interactive NotebookLM concept mind maps for lessons is exclusively available on Teacher Pro.',
  },
};

export function normalizeTeacherPlanTier(raw) {
  const clean = String(raw || '').trim().toLowerCase();
  return clean === 'pro' || clean === 'plus' ? clean : 'free';
}

export function getTeacherFeatureGate(featureKey) {
  return TEACHER_FEATURE_GATES[featureKey] || null;
}

export function hasTeacherFeatureAccess(planTier, featureKey) {
  const gate = getTeacherFeatureGate(featureKey);
  if (!gate) return true;
  const currentRank = TEACHER_TIER_RANK[normalizeTeacherPlanTier(planTier)] ?? 0;
  const requiredRank = TEACHER_TIER_RANK[gate.requiredTier] ?? 0;
  return currentRank >= requiredRank;
}

export function getTeacherPlanQuotas(planTier) {
  const tier = normalizeTeacherPlanTier(planTier);
  return TEACHER_PLAN_QUOTAS[tier] || TEACHER_PLAN_QUOTAS.free;
}
