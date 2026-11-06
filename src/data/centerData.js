/**
 * Motafawweq — Center Subscription Plans and Mock Data
 * Single Source of Truth for Center Pricing & Billing
 * Strictly adheres to Motafawweq unified brand palette (#1588C7)
 */

export const CENTER_SUBSCRIPTION_PLANS = [
  {
    id: 'plan-center-free',
    nameAr: 'باقة السنتر المجانية',
    nameEn: 'Center Free',
    tier: 'free',
    pricing: {
      monthly: { priceEgp: 0, originalPriceEgp: null, periodAr: 'دائم مجاناً', periodEn: 'Free Forever', badgeAr: 'بدون أي تكلفة', badgeEn: '100% Free' },
      term: { priceEgp: 0, originalPriceEgp: null, periodAr: 'دائم مجاناً', periodEn: 'Free Forever', badgeAr: 'بدون أي تكلفة', badgeEn: '100% Free' },
      annual: { priceEgp: 0, originalPriceEgp: null, periodAr: 'دائم مجاناً', periodEn: 'Free Forever', badgeAr: 'بدون أي تكلفة', badgeEn: '100% Free' }
    },
    priceEgp: 0,
    periodAr: 'دائم مجاناً',
    periodEn: 'Free Forever',
    badgeAr: 'بدون أي تكلفة',
    badgeEn: '100% Free',
    taglineAr: 'لتجربة تنظيم القاعات وتسجيل الحضور الأساسي',
    taglineEn: 'Try basic hall scheduling and attendance logging',
    usersLimitAr: 'حتى 100 مستخدم (طلاب ومعلمين)',
    usersLimitEn: 'Up to 100 active users (students & tutors)',
    featuresAr: [
      'سعة استيعاب حتى 100 مستخدم نشط (طلاب ومعلمين)',
      'إدارة حتى 3 مدرسين ومجموعاتهم الدراسية',
      'إدارة قاعتين دراسيتين وجدول مواعيد مبسط',
      'تسجيل حضور يدوي أساسي للطلاب وكشوف ورقية',
      'تصدير كشوف أسماء الطلاب والدرجات بصيغة رقمية للطباعة',
      'دعم فني عبر البريد الإلكتروني'
    ],
    featuresEn: [
      'Up to 100 active users capacity (students & teachers)',
      'Manage up to 3 teachers & their study cohorts',
      '2 classrooms capacity and standard schedule timeline',
      'Basic manual student attendance logging & rosters',
      'Export student attendance and grades as PDF',
      'Standard email technical support'
    ],
    limitationsAr: [
      'غير شاملة الحضور السريع بمسح الباركود ورمز الاستجابة السريع',
      'غير شاملة إشعارات واتساب التلقائية لأولياء الأمور',
      'غير شاملة نظام تسوية نسب الأرباح والخزينة',
      'علامة متفوق المائية على الكروت والإيصالات'
    ],
    limitationsEn: [
      'Excludes rapid QR & Barcode gate scanner',
      'Excludes automated WhatsApp alerts to parents',
      'Excludes automated commission split engine',
      'Standard Motafawweq branding on cards & receipts'
    ],
    color: '#64748B',
    popular: false
  },
  {
    id: 'plan-center-plus',
    nameAr: 'باقة السنتر بلس',
    nameEn: 'Center Plus',
    tier: 'plus',
    pricing: {
      monthly: { priceEgp: 200, originalPriceEgp: null, periodAr: 'شهرياً', periodEn: 'per month', badgeAr: 'الأنسب للسناتر المتوسطة', badgeEn: 'Best for Medium Centers' },
      term: { priceEgp: 800, originalPriceEgp: 1000, periodAr: 'للترم (5 شهور)', periodEn: 'per semester (5 mo)', badgeAr: 'توفير 20% (وفر 200 ج.م)', badgeEn: 'Save 20% (200 EGP off)' },
      annual: { priceEgp: 1500, originalPriceEgp: 2000, periodAr: 'للعام كاملاً (10 شهور)', periodEn: 'per full year (10 mo)', badgeAr: 'توفير 25% (وفر 500 ج.م)', badgeEn: 'Save 25% (500 EGP off)' }
    },
    priceEgp: 200,
    periodAr: 'شهرياً',
    periodEn: 'per month',
    badgeAr: 'الأنسب للسناتر المتوسطة',
    badgeEn: 'Best for Medium Centers',
    taglineAr: 'الخيار المثالي للسناتر النامية لإدارة القاعات والباركود',
    taglineEn: 'Ideal for growing centers: QR gate & hall clash prevention',
    usersLimitAr: 'حتى 500 مستخدم نشط (طلاب ومعلمين ومساعدين)',
    usersLimitEn: 'Up to 500 active users (students, tutors & staff)',
    featuresAr: [
      'جميع مزايا الباقة المجانية بالكامل',
      'سعة حتى 500 مستخدم نشط مسجل بالسنتر',
      'إدارة حتى 12 معلماً ومساعديهم بكامل صلاحياتهم',
      'إدارة حتى 8 قاعات ومدرجات مع كشف التعارض الزمني الذكي',
      'نظام الحضور السريع بمسح الباركود ورمز الاستجابة السريع على البوابات',
      'حساب تلقائي لنسب أرباح السنتر والمدرسين لكل حصة',
      'تسوية الخزينة اليومية وطباعة كشوفات الإيرادات والمصروفات',
      'إدارة المجموعات وقوائم الانتظار والتحويل بين المواعيد',
      'دعم فني سريع ومساعد رقمي خلال 24 ساعة'
    ],
    featuresEn: [
      'All Free Plan features included',
      'Capacity for up to 500 active center users',
      'Manage up to 12 teachers and teaching assistants',
      'Up to 8 classrooms with smart clash detection',
      'High-speed QR / Barcode gate attendance scanner',
      'Automated commission split logic per class session',
      'Daily cash reconciliation & revenue/expense reports',
      'Cohort waitlists and student session transfers',
      'Fast technical support with 24h SLA'
    ],
    limitationsAr: [
      'الحد الأقصى 500 مستخدم نشط',
      'غير شاملة إرسال رسائل واتساب غير محدودة لأولياء الأمور',
      'غير شاملة النطاق الخاص والهوية المستقلة الكاملة'
    ],
    limitationsEn: [
      'Capacity capped at 500 active users',
      'Excludes unlimited automated WhatsApp parent messages',
      'Excludes custom domain and full white-label suite'
    ],
    color: '#1588C7',
    popular: false
  },
  {
    id: 'plan-center-pro',
    nameAr: 'باقة السنتر برو',
    nameEn: 'Center Pro',
    tier: 'pro',
    pricing: {
      monthly: { priceEgp: 400, originalPriceEgp: null, periodAr: 'شهرياً', periodEn: 'per month', badgeAr: 'الأكثر طلباً للسناتر الكبرى', badgeEn: 'Most Popular for Centers' },
      term: { priceEgp: 1600, originalPriceEgp: 2000, periodAr: 'للترم بالكامل (5 شهور)', periodEn: 'per semester (5 mo)', badgeAr: 'الأكثر اختياراً (وفر 400 ج.م)', badgeEn: 'Most Popular (Save 400 EGP)' },
      annual: { priceEgp: 3000, originalPriceEgp: 4000, periodAr: 'للعام كاملاً (10 شهور)', periodEn: 'per full year (10 mo)', badgeAr: 'القيمة القصوى (وفر 1000 ج.م)', badgeEn: 'Ultimate Value (Save 1000 EGP)' }
    },
    priceEgp: 400,
    periodAr: 'شهرياً',
    periodEn: 'per month',
    badgeAr: 'الأكثر طلباً للسناتر الكبرى',
    badgeEn: 'Most Popular for Centers',
    taglineAr: 'الحل الشامل المتكامل: مستخدمين غير محدودين وهوية خاصة ودعم بأولوية قصوى',
    taglineEn: 'The ultimate enterprise solution: unlimited users & white-label',
    usersLimitAr: 'مستخدمين وطلاب غير محدودين',
    usersLimitEn: 'Unlimited active users & students',
    featuresAr: [
      'جميع مزايا باقة السنتر بلس بالكامل',
      'عدد غير محدود من المستخدمين والطلاب المسجلين',
      'عدد غير محدود من المدرسين، المساعدين، والقاعات، والفروع',
      'الهوية المخصصة بالكامل باسم وشعار السنتر مع نطاق خاص مستقل',
      'بوابة الحضور السريعة المربوطة بإشعارات واتساب فورية لأولياء الأمور',
      'نظام مالي متكامل: خزينة مجمعة، مصروفات تشغيلية، ونسب إيرادات دقيقة',
      'طباعة كروت الطلاب الذكية المدمجة برمز الاستجابة السريع وإيصالات رسمية',
      'سجل تدقيق أمني شامل لكافة حركات موظفي الاستقبال والخزينة',
      'مدير حساب مخصص وتدريب ميداني لطاقم السنتر ودعم فني على مدار الساعة'
    ],
    featuresEn: [
      'All Center Plus features included',
      'Unlimited users, students, and enrollments capacity',
      'Unlimited teachers, staff, classrooms, and branches',
      'Full custom branding, logos, and custom web domain (White-Label)',
      'Instant automated WhatsApp gate check-in alerts for parents',
      'Comprehensive financial ERP: cash ledger, overheads & split revenue',
      'Branded printable student smart ID cards and official receipts',
      'Full staff activity audit logs & security permissions',
      'Dedicated account manager, on-site training & 24/7 VIP support'
    ],
    limitationsAr: [],
    limitationsEn: [],
    color: '#1588C7',
    popular: true
  }
];

export const MOCK_CENTER_INVOICES = [
  {
    id: 'C-INV-2026-801',
    date: '2026-09-01',
    descriptionAr: 'اشتراك باقة السنتر بلس - الفصل الدراسي الأول (5 شهور)',
    descriptionEn: 'Center Plus Pass - Semester 1 (5 Months)',
    amount: '800 ج.م',
    amountEn: '800 EGP',
    method: 'إنستاباي',
    methodAr: 'إنستاباي',
    methodEn: 'InstaPay Transfer',
    status: 'مدفوع'
  },
  {
    id: 'C-INV-2026-620',
    date: '2026-08-01',
    descriptionAr: 'اشتراك باقة السنتر بلس - تجديد شهري',
    descriptionEn: 'Center Plus Pass - Monthly Renewal',
    amount: '200 ج.م',
    amountEn: '200 EGP',
    method: 'فودافون كاش',
    methodAr: 'فودافون كاش ومحافظ المحمول',
    methodEn: 'Vodafone Cash',
    status: 'مدفوع'
  }
];
