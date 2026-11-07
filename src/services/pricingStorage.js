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
    nameAr: 'باقة المعلم الأساسية (الانطلاق)',
    nameEn: 'Teacher Starter',
    billingCycle: 'monthly',
    priceEgp: 0,
    annualPriceEgp: 0,
    isActive: true,
    isPopular: false,
    badgeAr: 'مجانية 100%',
    badgeEn: 'Free Start',
    commissionPercent: 15,
    featuresAr: [
      'حتى 150 طالباً نشطاً في الكورسات',
      '600 دقيقة معالجة صوت ذكية مجانية شهرياً',
      'توليد الكويزات التلقائية وبنوك الأسئلة',
      'حماية الفيديوهات بمنع التحميل المباشر',
      'نسبة المنصة من المبيعات: 15% فقط'
    ],
    featuresEn: [
      'Up to 150 active course students',
      '600 Free AI transcription minutes/mo',
      'Automatic quiz generator',
      'Anti-download video protection',
      'Platform commission: 15% only'
    ]
  },
  {
    id: 'plan-teacher-pro',
    targetRole: 'teacher',
    nameAr: 'باقة المعلم المحترف (Pro Tutor)',
    nameEn: 'Pro Tutor Tier',
    billingCycle: 'monthly',
    priceEgp: 450,
    annualPriceEgp: 4500,
    isActive: true,
    isPopular: true,
    badgeAr: 'الأكثر شعبية للمعلمين',
    badgeEn: 'Most Popular',
    commissionPercent: 10,
    featuresAr: [
      'حتى 2,000 طالب نشط عبر السناتر والمنصة',
      '3,000 دقيقة تفريغ ومساعد صوتي ذكي للمحاضرات',
      'توليد مذكرات وملخصات PDF فائقة التنسيق بضغطة زر',
      'حماية الفيديو القصوى (علامة مائية ديناميكية بكود الطالب)',
      'نسبة المنصة مخفضة: 10% فقط'
    ],
    featuresEn: [
      'Up to 2,000 active students',
      '3,000 AI lecture audio minutes/mo',
      'One-click stylized PDF study guide generation',
      'Dynamic forensic student-ID watermarking',
      'Reduced platform commission: 10% only'
    ]
  },
  {
    id: 'plan-teacher-vip',
    targetRole: 'teacher',
    nameAr: 'باقة كبار المعلمين والسناتر الخاصة',
    nameEn: 'Master Tutor VIP',
    billingCycle: 'monthly',
    priceEgp: 950,
    annualPriceEgp: 9500,
    isActive: true,
    isPopular: false,
    badgeAr: 'نخبة الجمهورية',
    badgeEn: 'VIP Elite',
    commissionPercent: 7,
    featuresAr: [
      'طلاب غير محدودين في جميع المراحل التعليمية',
      'دقائق معالجة صوت وذكاء اصطناعي مفتوحة بلا حدود',
      'نطاق مخصص وبراند كامل باسم المعلم وتطبيقه الخاص',
      'أقل نسبة عمولة للمنصة على الإطلاق: 7% فقط',
      'أولوية التسوية وسحب الأرباح الفورية خلال دقائق'
    ],
    featuresEn: [
      'Unlimited enrolled students',
      'Unlimited AI speech and transcription processing',
      'Custom sub-domain & white-label teacher branding',
      'Lowest platform commission rate: 7% only',
      'Priority instant payout settlements'
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

