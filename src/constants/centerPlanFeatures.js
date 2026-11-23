/**
 * Motafawweq — Center Subscription Plans, Quotas & Feature Gating Registry
 * Mirrors App\Enums\CenterPlanTier & CenterBillingService::getPlansCatalog().
 */

export const CENTER_TIER_RANK = {
  free: 0,
  plus: 1,
  pro: 2,
};

export const CENTER_PLANS = {
  free: {
    tier: 'free',
    nameAr: 'باقة السنتر المجانية',
    nameEn: 'Center Free',
    shortAr: 'مجاني',
    shortEn: 'Free',
    monthlyPriceEgp: 0,
  },
  plus: {
    tier: 'plus',
    nameAr: 'باقة السنتر بلس (Plus)',
    nameEn: 'Center Plus',
    shortAr: 'Plus',
    shortEn: 'Plus',
    monthlyPriceEgp: 200,
  },
  pro: {
    tier: 'pro',
    nameAr: 'باقة السنتر برو (Pro)',
    nameEn: 'Center Pro',
    shortAr: 'Pro',
    shortEn: 'Pro',
    monthlyPriceEgp: 400,
  },
};

export const CENTER_PLAN_QUOTAS = {
  free: {
    maxUsers: 20,
    maxGroups: 2,
    maxBranches: 1,
    maxRooms: 1,
    maxTeachers: 2,
    maxStaff: 0,
  },
  plus: {
    maxUsers: 500,
    maxGroups: 20,
    maxBranches: 5,
    maxRooms: 8,
    maxTeachers: 12,
    maxStaff: 15,
  },
  pro: {
    maxUsers: null,
    maxGroups: null,
    maxBranches: null,
    maxRooms: null,
    maxTeachers: null,
    maxStaff: null,
  },
};

export const CENTER_SUBSCRIPTION_CATALOG = [
  {
    id: 'plan-center-free',
    tier: 'free',
    nameAr: 'باقة السنتر المجانية',
    nameEn: 'Center Free',
    taglineAr: 'لتجربة تنظيم السنتر الأساسي بسعة محدودة',
    taglineEn: 'Try basic center management with starter limits',
    popular: false,
    pricing: {
      monthly: {
        priceEgp: 0,
        originalPriceEgp: null,
        periodAr: 'دائم مجاناً',
        periodEn: 'Free Forever',
        badgeAr: 'باقة تجريبية مجانية',
        badgeEn: 'Starter Free',
      },
      term: {
        priceEgp: 0,
        originalPriceEgp: null,
        periodAr: 'دائم مجاناً',
        periodEn: 'Free Forever',
        badgeAr: 'باقة تجريبية مجانية',
        badgeEn: 'Starter Free',
      },
      annual: {
        priceEgp: 0,
        originalPriceEgp: null,
        periodAr: 'دائم مجاناً',
        periodEn: 'Free Forever',
        badgeAr: 'باقة تجريبية مجانية',
        badgeEn: 'Starter Free',
      },
    },
    featuresAr: [
      'سعة استيعاب حتى 20 مستخدم نشط فقط (طلاب ومعلمون)',
      'فرع واحد رئيسي وقاعة دراسية واحدة فقط',
      'إدارة حتى معلمين (2) ومجموعتين دراسيتين (2)',
      'تسجيل الحضور اليدوي الأساسي وإدارة سجل الطلاب',
      'لوحة تحكم أساسية لمتابعة المجموعات',
    ],
    featuresEn: [
      'Up to 20 active users max (students & teachers)',
      '1 main branch and 1 classroom only',
      'Manage up to 2 teachers and 2 study cohorts',
      'Basic manual student attendance and roster tracking',
      'Essential center overview dashboard',
    ],
    limitationsAr: [
      'ماسح الباركود و QR للحضور الفوري (USB والكاميرا)',
      'الجدول الأسبوعي الشامل ومنع تعارض القاعات',
      'إدارة الموظفين الإداريين والصلاحيات',
      'سجل العمليات والرقابة والأمان والتقرير التنفيذي',
      'الماليات وتسويات المعلمين والنسخ الاحتياطي السحابي',
    ],
    limitationsEn: [
      'Instant QR & Barcode attendance scanner (USB & Camera)',
      'Weekly master schedule & conflict detection',
      'Administrative staff accounts & permissions',
      'Security audit logs & executive performance reports',
      'Financials ERP, settlements & cloud backups',
    ],
  },
  {
    id: 'plan-center-plus',
    tier: 'plus',
    nameAr: 'باقة السنتر بلس',
    nameEn: 'Center Plus',
    taglineAr: 'الأمثل للسناتر النامية: الباركود، الجدول الأسبوعي، والفروع المتعددة',
    taglineEn: 'Ideal for growing centers: QR scanner, weekly schedule & multi-branch',
    popular: false,
    pricing: {
      monthly: {
        priceEgp: 200,
        originalPriceEgp: null,
        periodAr: 'شهرياً (30 يوماً)',
        periodEn: 'Monthly (30 days)',
        badgeAr: 'الأنسب للسناتر النامية',
        badgeEn: 'Best for Growing Centers',
      },
      term: {
        priceEgp: 800,
        originalPriceEgp: 1000,
        periodAr: 'للترم (5 شهور)',
        periodEn: 'Semester (5 mo)',
        badgeAr: 'وفر 20% (200 ج.م)',
        badgeEn: 'Save 20% (200 EGP)',
      },
      annual: {
        priceEgp: 1500,
        originalPriceEgp: 2000,
        periodAr: 'سنة دراسية (10 شهور)',
        periodEn: 'Full Year (10 mo)',
        badgeAr: 'وفر 25% (500 ج.م)',
        badgeEn: 'Save 25% (500 EGP)',
      },
    },
    featuresAr: [
      'سعة حتى 500 مستخدم نشط مسجل بالسنتر',
      'حتى 5 فروع، 8 قاعات دراسية، 12 معلماً، و 20 مجموعة',
      'إدارة حتى 15 موظفاً إدارياً بصلاحيات مخصصة',
      'ماسح الباركود و QR الفوري (USB + كاميرا) وبطاقات الطلاب',
      'الجدول الأسبوعي الشامل وكشف التعارض الزمني الذكي',
      'نظام الماليات وتسويات نسب الأرباح والمصروفات',
    ],
    featuresEn: [
      'Up to 500 active center users capacity',
      'Up to 5 branches, 8 classrooms, 12 teachers & 20 cohorts',
      'Manage up to 15 administrative staff with custom roles',
      'High-speed QR / Barcode scanner (USB & Camera) & ID cards',
      'Full weekly master schedule with smart clash detection',
      'Financials ERP, commission splits & expense tracking',
    ],
    limitationsAr: [
      'سجل العمليات والرقابة والأمان (Audit Log)',
      'التقرير التنفيذي الشامل لأداء السنتر والفروع',
      'إشعارات واتساب، الهوية المستقلة، والنسخ الاحتياطي السحابي',
    ],
    limitationsEn: [
      'Security Audit Log trail',
      'Executive Performance Report',
      'WhatsApp parent alerts, White-Label & Cloud Backups',
    ],
  },
  {
    id: 'plan-center-pro',
    tier: 'pro',
    nameAr: 'باقة السنتر برو',
    nameEn: 'Center Pro',
    taglineAr: 'كل الأدوات بلا قيود: مستخدمون وفروع مفتوحة + الرقابة والتقرير التنفيذي',
    taglineEn: 'Unlimited enterprise suite: unlimited capacity + audit logs & executive reports',
    popular: true,
    pricing: {
      monthly: {
        priceEgp: 400,
        originalPriceEgp: null,
        periodAr: 'شهرياً (30 يوماً)',
        periodEn: 'Monthly (30 days)',
        badgeAr: 'الأكثر طلباً للسناتر الكبرى',
        badgeEn: 'Most Popular',
      },
      term: {
        priceEgp: 1600,
        originalPriceEgp: 2000,
        periodAr: 'للترم (5 شهور)',
        periodEn: 'Semester (5 mo)',
        badgeAr: 'وفر 20% (400 ج.م)',
        badgeEn: 'Save 20% (400 EGP)',
      },
      annual: {
        priceEgp: 3000,
        originalPriceEgp: 4000,
        periodAr: 'سنة دراسية (10 شهور)',
        periodEn: 'Full Year (10 mo)',
        badgeAr: 'أقوى قيمة • وفر 25%',
        badgeEn: 'Best Value • Save 25%',
      },
    },
    featuresAr: [
      'جميع مزايا باقة السنتر بلس بالكامل بدون أي حدود',
      'عدد غير محدود من المستخدمين، الطلاب، المعلمين، والموظفين',
      'عدد غير محدود من الفروع، القاعات الدراسية، والمجموعات',
      'سجل العمليات والرقابة والأمان الكامل (Audit Log)',
      'التقرير التنفيذي الشامل لمقارنة أداء الفروع والقاعات',
      'تنبيهات واتساب، الهوية المخصصة، والنسخ الاحتياطي السحابي',
    ],
    featuresEn: [
      'Everything in Center Plus with zero capacity limits',
      'Unlimited active users, students, teachers & staff',
      'Unlimited branches, classrooms & study cohorts',
      'Full immutable Security Audit Log trail',
      'Comprehensive Executive Performance Reports',
      'WhatsApp alerts, White-Label branding & Cloud Backups',
    ],
    limitationsAr: [],
    limitationsEn: [],
  },
];

export const CENTER_FEATURE_GATES = {
  qr_scanner: {
    key: 'qr_scanner',
    requiredTier: 'plus',
    titleAr: 'ماسح الباركود و QR للحضور الفوري',
    titleEn: 'Instant QR & Barcode Attendance Scanner',
    descAr:
      'تسجيل الحضور الفوري بمسح الباركود (جهاز USB، الكاميرا المباشرة، أو صورة الباركود) متاح لمشتركي باقة السنتر بلس (Plus) أو برو (Pro). يمكنك متابعة الحضور يدوياً على الباقة المجانية.',
    descEn:
      'High-speed barcode & QR attendance scanning (USB gun, live camera, or photo scan) requires Center Plus or Center Pro. Manual attendance remains available on Free.',
  },
  master_schedule: {
    key: 'master_schedule',
    requiredTier: 'plus',
    titleAr: 'الجدول الأسبوعي الشامل ومنع التعارض',
    titleEn: 'Weekly Master Schedule & Conflict Prevention',
    descAr:
      'الجدول الأسبوعي التفاعلي لعرض جميع الحصص، المواعيد الشاغرة بالقاعات، ومنع تعارض القاعات والمعلمين تلقائياً متاح لمشتركي باقة السنتر بلس (Plus) أو برو (Pro).',
    descEn:
      'The interactive weekly master schedule, open slot booking, and automated conflict detection require Center Plus or Center Pro.',
  },
  staff_management: {
    key: 'staff_management',
    requiredTier: 'plus',
    titleAr: 'إدارة الموظفين الإداريين والصلاحيات',
    titleEn: 'Administrative Staff & Permissions',
    descAr:
      'إضافة موظفي الاستقبال والخزينة وتعيين الصلاحيات وربطهم بالفروع متاح لمشتركي باقة السنتر بلس (Plus — حتى 15 موظفاً) أو برو (Pro — بلا حدود).',
    descEn:
      'Managing receptionists, cashiers, and staff permissions across branches requires Center Plus (up to 15 staff) or Center Pro (unlimited).',
  },
  financials: {
    key: 'financials',
    requiredTier: 'plus',
    titleAr: 'النظام المالي وتسويات المعلمين',
    titleEn: 'Financials ERP & Teacher Settlements',
    descAr:
      'إدارة الإيرادات والمصروفات وتسوية مستحقات المعلمين ومتابعة المتأخرات متاحة لمشتركي باقة السنتر بلس (Plus) أو برو (Pro).',
    descEn:
      'Center revenue ledgers, expenses, teacher commission settlements, and dues tracking require Center Plus or Center Pro.',
  },
  audit_logs: {
    key: 'audit_logs',
    requiredTier: 'pro',
    titleAr: 'سجل العمليات والرقابة والأمان (Audit Log)',
    titleEn: 'Immutable Security Audit Trail',
    descAr:
      'توثيق ومراقبة جميع العمليات الإدارية والأمنية بالسنتر مع البحث والترقيم والتدقيق الكامل متاح حصرياً لمشتركي باقة السنتر برو (Pro).',
    descEn:
      'Full immutable audit trail logging all administrative and security actions is exclusively available on Center Pro.',
  },
  executive_reports: {
    key: 'executive_reports',
    requiredTier: 'pro',
    titleAr: 'التقرير التنفيذي لأداء السنتر والفروع',
    titleEn: 'Executive Performance Report',
    descAr:
      'استخراج التقرير التنفيذي الشامل لمقارنة أداء الفروع ونسب إشغال القاعات والمجموعات متاح حصرياً لمشتركي باقة السنتر برو (Pro).',
    descEn:
      'Generating executive reports benchmarking branches, classroom utilization, and operations is exclusively available on Center Pro.',
  },
  whatsapp_alerts: {
    key: 'whatsapp_alerts',
    requiredTier: 'pro',
    titleAr: 'إشعارات واتساب الفورية لأولياء الأمور',
    titleEn: 'Automated WhatsApp Parent Alerts',
    descAr:
      'إرسال تنبيهات الحضور والغياب التلقائية لأولياء الأمور عبر واتساب متاح حصرياً لمشتركي باقة السنتر برو (Pro).',
    descEn:
      'Automated WhatsApp attendance and absence alerts for parents are exclusively available on Center Pro.',
  },
  cloud_backup: {
    key: 'cloud_backup',
    requiredTier: 'pro',
    titleAr: 'النسخ الاحتياطي السحابي المشفّر',
    titleEn: 'Encrypted Cloud Backups',
    descAr:
      'إنشاء واستعادة النسخ الاحتياطية السحابية لبيانات السنتر متاح حصرياً لمشتركي باقة السنتر برو (Pro).',
    descEn:
      'Automated encrypted cloud backups for center data are exclusively available on Center Pro.',
  },
};

export function normalizeCenterPlanTier(raw) {
  const clean = String(raw || '').trim().toLowerCase();
  if (clean === 'pro' || clean === 'plan-center-pro') return 'pro';
  if (clean === 'plus' || clean === 'plan-center-plus') return 'plus';
  return 'free';
}

export function getCenterFeatureGate(featureKey) {
  return CENTER_FEATURE_GATES[featureKey] || null;
}

export function hasCenterFeatureAccess(planTier, featureKey) {
  const gate = getCenterFeatureGate(featureKey);
  if (!gate) return true;
  const currentRank = CENTER_TIER_RANK[normalizeCenterPlanTier(planTier)] ?? 0;
  const requiredRank = CENTER_TIER_RANK[gate.requiredTier] ?? 0;
  return currentRank >= requiredRank;
}

export function getCenterPlanQuotas(planTier) {
  const tier = normalizeCenterPlanTier(planTier);
  return CENTER_PLAN_QUOTAS[tier] || CENTER_PLAN_QUOTAS.free;
}
