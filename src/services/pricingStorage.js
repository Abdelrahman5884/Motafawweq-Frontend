/**
 * Motafawweq — Platform Subscription & Package Pricing Service
 * Single source of truth for platform pricing management across:
 * - Centers (السناتر التعليمية)
 * - Teachers (المعلمون ومقدمو المحتوى)
 * - Students (الطلاب وأولياء الأمور)
 */

export const INITIAL_SUBSCRIPTION_PLANS = [
  // ── 1. Centers (السناتر التعليمية) ──
  {
    id: 'plan-center-starter',
    targetRole: 'center',
    nameAr: 'باقة السنتر الأساسية',
    nameEn: 'Starter Center Plan',
    billingCycle: 'monthly',
    priceEgp: 850,
    annualPriceEgp: 8500,
    isActive: true,
    isPopular: false,
    badgeAr: 'سناتر ناشئة',
    badgeEn: 'Starter',
    featuresAr: [
      'حتى قاعتين تعليميتين مجهزتين',
      'سعة استيعابية حتى 350 طالباً مسجلاً',
      'بوابة باركود ذكية واحدة لتسجيل الحضور',
      'طباعة فواتير وإيصالات تحصيل حرارية',
      'تقارير غياب وحضور الحصص الأسبوعية'
    ],
    featuresEn: [
      'Up to 2 classrooms',
      'Up to 350 active students',
      '1 Smart barcode admission gate',
      'Thermal receipt printing',
      'Weekly attendance reports'
    ]
  },
  {
    id: 'plan-center-plus',
    targetRole: 'center',
    nameAr: 'باقة السنتر بلس (الأكثر طلباً)',
    nameEn: 'Center Plus (Recommended)',
    billingCycle: 'monthly',
    priceEgp: 1950,
    annualPriceEgp: 19500,
    isActive: true,
    isPopular: true,
    badgeAr: 'الأكثر طلباً للسناتر',
    badgeEn: 'Best Seller',
    featuresAr: [
      'حتى 6 قاعات تعليمية مع إدارة الحجوزات',
      'سعة استيعابية حتى 1,500 طالب',
      '3 بوابات باركود ذكية مع مزامنة سريعة',
      'تنبيهات SMS وواتساب فورية لأولياء الأمور',
      'لوحة تحكم كاملة للخزينة والمصروفات اليومية',
      'ربط شبكي لحظي مع حسابات معلمي السنتر'
    ],
    featuresEn: [
      'Up to 6 classrooms with schedule manager',
      'Up to 1,500 active students',
      '3 Smart barcode admission gates',
      'Instant SMS/WhatsApp alerts to parents',
      'Cash register and petty cash tracker',
      'Real-time sync with affiliated tutors'
    ]
  },
  {
    id: 'plan-center-pro',
    targetRole: 'center',
    nameAr: 'باقة صروح وسلاسل السناتر الكبرى',
    nameEn: 'Enterprise Mega Center',
    billingCycle: 'monthly',
    priceEgp: 3800,
    annualPriceEgp: 38000,
    isActive: true,
    isPopular: false,
    badgeAr: 'مؤسسي واحترافي',
    badgeEn: 'Enterprise',
    featuresAr: [
      'قاعات وسعة طلابية مفتوحة بلا قيود',
      'شبكة بوابات باركود وكاميرات غير محدودة',
      'إدارة الفروع المتعددة بحساب إداري موحد',
      'أولوية معالجة السيرفر ومزامنة أوفلاين للطوارئ',
      'مدير حساب تقني مخصص ودعم فني على مدار الساعة'
    ],
    featuresEn: [
      'Unlimited classrooms and student capacity',
      'Unlimited smart gates and multi-branch nodes',
      'Centralized multi-campus dashboard',
      'Offline emergency sync backup',
      'Dedicated 24/7 technical account manager'
    ]
  },

  // ── 2. Teachers (المعلمون ومقدمو المحتوى) ──
  {
    id: 'plan-teacher-starter',
    targetRole: 'teacher',
    nameAr: 'الباقة المجانية للمعلم',
    nameEn: 'Teacher Free',
    billingCycle: 'monthly',
    priceEgp: 0,
    annualPriceEgp: 0,
    isActive: true,
    isPopular: false,
    badgeAr: 'مجانية 100%',
    badgeEn: 'Free Start',
    featuresAr: [
      'إنشاء كورس واحد فقط',
      'رفع حتى 3 حصص بدون استخدام AI',
      'إنشاء مجموعة دراسية واحدة فقط بحد أقصى 50 طالب',
      'إدارة قائمة طلاب المجموعة والحضور بالباركود'
    ],
    featuresEn: [
      'Create 1 active course',
      'Upload up to 3 lessons without AI',
      'Create 1 study group with up to 50 students',
      'Student roster and QR attendance tracking'
    ]
  },
  {
    id: 'plan-teacher-plus',
    targetRole: 'teacher',
    nameAr: 'باقة المعلم بلس (Plus)',
    nameEn: 'Teacher Plus',
    billingCycle: 'monthly',
    priceEgp: 120,
    annualPriceEgp: 900,
    isActive: true,
    isPopular: true,
    badgeAr: 'الأكثر اختياراً للمعلمين',
    badgeEn: 'Most Popular',
    featuresAr: [
      'إنشاء حتى 12 مجموعة دراسية بطلاب مفتوحين',
      'كورسات وحصص غير محدودة (بدون AI)',
      'الجدول الأسبوعي لتنظيم المجموعات والملاحظات',
      'الامتحانات، الواجبات، الدوري، الشهادات والماليات'
    ],
    featuresEn: [
      'Up to 12 study groups with unlimited students',
      'Unlimited courses and lessons (without AI)',
      'Weekly schedule organizer & conflict detection',
      'Exams, Homework, Leagues, Certificates & Financials'
    ]
  },
  {
    id: 'plan-teacher-pro',
    targetRole: 'teacher',
    nameAr: 'باقة المعلم برو (Pro)',
    nameEn: 'Teacher Pro',
    billingCycle: 'monthly',
    priceEgp: 150,
    annualPriceEgp: 1125,
    isActive: true,
    isPopular: false,
    badgeAr: 'شاملة AI بالكامل',
    badgeEn: 'Full AI Included',
    featuresAr: [
      'كل مزايا باقة المعلم بلس بدون حدود',
      'إنشاء عدد غير محدود من المجموعات الدراسية',
      'التفريغ النصي الذكي للحصص بالذكاء الاصطناعي (AI)',
      'خرائط المفاهيم التفاعلية وفهرسة الفصول بالـ AI'
    ],
    featuresEn: [
      'Everything in Teacher Plus with no limits',
      'Unlimited study groups',
      'AI Synchronized Lesson Transcripts',
      'AI Concept Mind Maps & Smart Chapter Indexing'
    ]
  },

  // ── 3. Students (الطلاب وأولياء الأمور) ──
  {
    id: 'plan-student-basic',
    targetRole: 'student',
    nameAr: 'اشتراك الطالب الأساسي',
    nameEn: 'Student Standard',
    billingCycle: 'monthly',
    priceEgp: 120,
    annualPriceEgp: 1100,
    isActive: true,
    isPopular: false,
    badgeAr: 'المنهج المدرسي',
    badgeEn: 'Standard',
    featuresAr: [
      'دخول كامل لكافة الحصص والواجبات المسجلة',
      'بنك أسئلة الوزارة ونماذج الامتحانات الشهرية',
      'تقييم فوري للواجبات مع تصحيح الأخطاء',
      'باركود الحضور الذكي في جميع سناتر المنصة'
    ],
    featuresEn: [
      'Full access to enrolled courses and lessons',
      'Official question bank & monthly practice exams',
      'Instant homework grading with step-by-step review',
      'Universal QR barcode for connected center gates'
    ]
  },
  {
    id: 'plan-student-ai-plus',
    targetRole: 'student',
    nameAr: 'باقة المتفوق بلس (مع الذكاء الاصطناعي)',
    nameEn: 'Motafawweq Plus AI',
    billingCycle: 'monthly',
    priceEgp: 220,
    annualPriceEgp: 2100,
    isActive: true,
    isPopular: true,
    badgeAr: 'الأكثر اختياراً للطلبة',
    badgeEn: 'Student Choice',
    featuresAr: [
      'المساعد الصوتي الذكي «متفوق» متاح 24/7 لأي سؤال',
      'تلخيص صوتي فوري للمحاضرات والدروس المعقدة',
      'مذكرات المراجعة المركزة والخرائط الذهنية الذكية',
      'المشاركة في دوري أبطال الجمهورية الشهري مع الأوسمة',
      'لوحة متابعة تفصيلية لولي الأمر مع تنبيهات الغياب والدرجات'
    ],
    featuresEn: [
      '24/7 Conversational AI Tutor "Motafawweq"',
      'Instant audio transcription & lecture summarizer',
      'Smart mind-maps and targeted revision notes',
      'Eligibility for National Monthly Champions League & Medals',
      'Real-time parent telemetry dashboard with score alerts'
    ]
  },
  {
    id: 'plan-student-annual-all',
    targetRole: 'student',
    nameAr: 'الباقة الشاملة السنوية للثانوية العامة',
    nameEn: 'High School All-Access Pass',
    billingCycle: 'annual',
    priceEgp: 1800,
    annualPriceEgp: 1800,
    isActive: true,
    isPopular: false,
    badgeAr: 'توفير سنوي فائق',
    badgeEn: 'Best Annual Value',
    featuresAr: [
      'شاملة لجميع مواد الشعبة على مدار العام الدراسي كاملاً',
      'كافة مزايا الذكاء الاصطناعي والمذكرات مجاناً دون اشتراك شهري',
      'معسكرات مراجعة ليلة الامتحان ونماذج التوقعات المرئية',
      'استشارات فردية وتوجيه أكاديمي مستمر حتى إعلان التنسيق'
    ],
    featuresEn: [
      'Full year access to all enrolled academic subjects',
      'All AI perks and smart study notes included for free',
      'Final exam eve cram bootcamps & predicted model papers',
      '1-on-1 academic counseling until university placement'
    ]
  }
];

const STORAGE_KEY = 'motafawweq_subscription_plans_v1';

export const getSubscriptionPlans = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SUBSCRIPTION_PLANS));
      return INITIAL_SUBSCRIPTION_PLANS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SUBSCRIPTION_PLANS));
      return INITIAL_SUBSCRIPTION_PLANS;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to read subscription plans from localStorage:', e);
    return INITIAL_SUBSCRIPTION_PLANS;
  }
};

export const saveSubscriptionPlans = (plans) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pricing-updated', { detail: plans }));
    }
  } catch (e) {
    console.error('Failed to save subscription plans:', e);
  }
};

export const updateSubscriptionPlan = (id, fields) => {
  const current = getSubscriptionPlans();
  const updated = current.map(item => item.id === id ? { ...item, ...fields } : item);
  saveSubscriptionPlans(updated);
  return updated;
};

export const addSubscriptionPlan = (plan) => {
  const current = getSubscriptionPlans();
  const newPlan = {
    ...plan,
    id: plan.id || `plan-${plan.targetRole}-${Date.now()}`,
    isActive: plan.isActive !== undefined ? plan.isActive : true
  };
  const updated = [newPlan, ...current];
  saveSubscriptionPlans(updated);
  return updated;
};

export const deleteSubscriptionPlan = (id) => {
  const current = getSubscriptionPlans();
  const updated = current.filter(item => item.id !== id);
  saveSubscriptionPlans(updated);
  return updated;
};

export const togglePlanActive = (id) => {
  const current = getSubscriptionPlans();
  const updated = current.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item);
  saveSubscriptionPlans(updated);
  return updated;
};

export const resetPlansToDefault = () => {
  saveSubscriptionPlans(INITIAL_SUBSCRIPTION_PLANS);
  return INITIAL_SUBSCRIPTION_PLANS;
};

