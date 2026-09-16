import React, { createContext, useContext, useState, useEffect } from 'react';

const DICTIONARY = {
  en: {
    // Brand & Tagline
    brandName: 'Motafawweq',
    brandNameArabic: 'متفوّق',
    tagline: 'Learn Today. Go Further.',
    subTagline: 'Record your lecture once, and let educational AI generate interactive 3D concept maps, timestamped transcripts, Cornell notes, adaptive quizzes, and diagnostic analytics.',
    
    // Global Navigation
    navHome: 'Home',
    navFeatures: 'Features',
    navTeachers: 'For Teachers',
    navStudents: 'For Students',
    navParents: 'For Parents',
    navCenters: 'Learning Centers',
    navMarketplace: 'Marketplace',
    navPricing: 'Pricing',
    navLogin: 'Sign In',
    navRegister: 'Create Account',
    navDashboard: 'Dashboard',
    navLogout: 'Sign Out',
    
    // Auth Translations
    loginTitle: 'Welcome Back to Motafawweq',
    loginSubtitle: 'Enter your credentials to access your educational workspace',
    registerTitle: 'Join Motafawweq Today',
    registerSubtitle: 'Start smarter learning & teaching powered by Egyptian curriculum AI',
    forgotPasswordTitle: 'Reset Your Password',
    forgotPasswordSubtitle: 'We will send a 4-digit verification code to your email or phone',
    emailLabel: 'Email Address',
    phoneLabel: 'Egyptian Phone Number',
    passwordLabel: 'Password',
    confirmPasswordLabel: 'Confirm Password',
    rememberMe: 'Remember me on this device',
    forgotPasswordLink: 'Forgot password?',
    signInBtn: 'Sign In to Workspace',
    signUpBtn: 'Create My Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    quickDemoAccess: 'Quick 1-Click Demo Login',
    roleStudent: 'Student',
    roleTeacher: 'Teacher',
    roleParent: 'Parent',
    roleCenter: 'Educational Center',
    roleAdmin: 'Platform Admin',
    selectRolePrompt: 'Select your role to personalize your experience:',
    gradeLabel: 'High School Year',
    grade1: '1st Secondary',
    grade2: '2nd Secondary',
    grade3: '3rd Secondary (Thanawya Amma)',
    subjectLabel: 'Specialized Subject',
    centerCodeLabel: 'Center or Teacher Code (Optional)',
    centerNameLabel: 'Academy / Center Name',
    governorateLabel: 'Governorate / City',

    // Quick Demo Role Switcher
    roleSwitcherTitle: 'Interactive Role Switcher',
    currentRole: 'Active Demo Role',

    // Hero CTAs
    ctaGetStarted: 'Start Free Trial',
    ctaWatchDemo: 'Watch Live Interactive Demo',
    ctaRecordLesson: 'New Lesson & Record',
    ctaExploreMarket: 'Discover Teachers',

    // Pipeline Steps
    pipelineTitle: 'The "Teach Once. Get Everything." Engine',
    stepRecording: 'Audio Recording',
    stepTranscript: 'Timestamped Transcript',
    stepKnowledgeMap: 'Interactive Knowledge Map',
    stepSummary: 'Cornell Lesson Summary',
    stepQuiz: 'Auto-Generated Quiz',
    stepAnalytics: 'Student Diagnostics',

    // Dashboard Common
    searchPlaceholder: 'Search lessons, concepts, students, classes, or exams... (Ctrl+K)',
    totalStudents: 'Total Students',
    activeClasses: 'Active Classes',
    totalLessons: 'Processed Lessons',
    avgScore: 'Average Score',
    attendanceRate: 'Attendance Rate',
    monthlyRevenue: 'Monthly Revenue',
    aiMinutesUsed: 'AI Processing Quota',
    buyMoreMinutes: 'Buy AI Minutes',
    createNew: 'Create New',

    // Lesson Studio
    recordingStudio: 'Lesson Recording Studio',
    step1Info: '1. Lesson Information',
    step2Record: '2. Live Audio Studio',
    step3Process: '3. AI Engine Processing',
    lessonTitle: 'Lesson Title',
    subject: 'Subject',
    classSelect: 'Select Class',
    unitChapter: 'Unit / Chapter',
    startRecording: 'Start Recording Lesson',
    pauseRecording: 'Pause',
    resumeRecording: 'Resume',
    stopRecording: 'Stop & Process with AI',
    uploadAudio: 'Or Upload Audio/Video (MP3, WAV, M4A, MP4)',
    micLive: 'Microphone Active — Speaking Level',
    recordingDuration: 'Recording Elapsed Duration',
    
    // AI Processing Screen
    processingTitle: 'Turning your lecture into an intelligent learning experience...',
    processingSub: 'Motafawweq AI pipeline is transcribing, mapping concepts, extracting Thanawya traps, and formulating quizzes.',
    procStep1: 'Uploading audio recording securely',
    procStep2: 'Transcribing speech & Egyptian dialect alignment',
    procStep3: 'Detecting chapters & key timestamps',
    procStep4: 'Extracting key concepts & definitions',
    procStep5: 'Generating interactive Knowledge Map',
    procStep6: 'Formulating structured summary',
    procStep7: 'Creating adaptive quiz questions',

    // Lesson Tabs
    tabOverview: 'Overview',
    tabKnowledgeMap: 'Knowledge Map',
    tabTranscript: 'Transcript',
    tabSummary: 'Summary',
    tabQuiz: 'Quiz & Exam',
    tabAnalytics: 'Analytics',

    // Knowledge Map UI
    kmTitle: 'Interactive Concept Knowledge Map',
    kmSubtitle: 'Click any concept node to view its detailed breakdown, formula, and jump to the exact audio timestamp.',
    kmSearch: 'Filter concepts...',
    kmZoomIn: 'Zoom In',
    kmZoomOut: 'Zoom Out',
    kmReset: 'Reset View',
    kmFullscreen: 'Toggle Fullscreen',
    jumpToTimestamp: 'Jump to Audio at',
    masteryScore: 'Class Mastery',
    relatedQuestions: 'Related Quiz Questions',

    // Transcript UI
    transcriptTitle: 'Timestamped Interactive Transcript',
    searchTranscript: 'Search transcript text...',
    copyTranscript: 'Copy Text',
    downloadPdf: 'Export PDF',
    editTranscript: 'Edit Transcript',

    // Quiz UI
    quizTitle: 'Generated Lesson Quiz',
    generateQuizBtn: 'Generate Quiz with AI',
    publishQuiz: 'Publish to Class',
    addQuestion: 'Add Question',
    difficulty: 'Difficulty',
    correctAnswer: 'Correct Answer',
    explanation: 'Explanation',

    // Student UI
    greetingStudent: 'Welcome back, Omar! 🔥',
    studentGoal: 'Weekly Goal: 8/10 Lessons Reviewed',
    streakBadge: '14-Day Streak',
    xpBadge: '2,150 XP (Gold Rank)',
    weakAreasTitle: 'Diagnostic: Areas Needing Review',
    continueLearning: 'Continue Where You Left Off',
    takeExam: 'Take Timed Quiz',

    // Currency
    currency: 'EGP'
  },
  ar: {
    // Brand & Tagline
    brandName: 'متفوّق',
    brandNameArabic: 'متفوّق',
    tagline: 'تعلّم اليوم.. لتنطلق نحو القمّة.',
    subTagline: 'سجّل حصتك مرة واحدة، ودع الذكاء الاصطناعي يتولى تحويلها إلى خريطة مفاهيم تفاعلية، وتفريغ نصي متزامن، وملخص كورنيل، واختبارات متكيفة لجميع المراحل الدراسية.',
    
    // Global Navigation
    navHome: 'الرئيسية',
    navFeatures: 'المميزات',
    navTeachers: 'للمعلمين',
    navStudents: 'للطلاب',
    navParents: 'لأولياء الأمور',
    navCenters: 'للسناتر والمراكز',
    navMarketplace: 'دليل المعلمين',
    navPricing: 'الأسعار والباقات',
    navLogin: 'تسجيل الدخول',
    navRegister: 'إنشاء حساب جديد',
    navDashboard: 'لوحة التحكم',
    navLogout: 'تسجيل الخروج',

    // Auth Translations
    loginTitle: 'مرحباً بك مجدداً في متفوّق',
    loginSubtitle: 'سجل دخولك للوصول إلى مساحتك التعليمية التفاعلية',
    registerTitle: 'انضم إلى عائلة متفوّق',
    registerSubtitle: 'ابدأ تجربة تعليمية ذكية مدعومة بالذكاء الاصطناعي المتوافق مع مناهج مصر',
    forgotPasswordTitle: 'استعادة كلمة المرور',
    forgotPasswordSubtitle: 'سنرسل رمز تحقق مكون من 4 أرقام لهاتفك أو بريدك الإلكتروني',
    emailLabel: 'البريد الإلكتروني',
    phoneLabel: 'رقم الهاتف (مصر)',
    passwordLabel: 'كلمة المرور',
    confirmPasswordLabel: 'تأكيد كلمة المرور',
    rememberMe: 'تذكرني على هذا الجهاز',
    forgotPasswordLink: 'نسيت كلمة المرور؟',
    signInBtn: 'دخول إلى الحساب',
    signUpBtn: 'إنشاء الحساب والبدء فورا',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    dontHaveAccount: 'ليس لديك حساب بعد؟',
    quickDemoAccess: 'دخول تجريبي سريع بنقرة واحدة',
    roleStudent: 'طالب',
    roleTeacher: 'معلم',
    roleParent: 'ولي أمر',
    roleCenter: 'سنتر تعليمي',
    roleAdmin: 'إدارة المنصة',
    selectRolePrompt: 'اختر نوع الحساب لتخصيص بيئة عملك:',
    gradeLabel: 'المرحلة الدراسية',
    grade1: 'الصف الأول الثانوي',
    grade2: 'الصف الثاني الثانوي',
    grade3: 'الصف الثالث الثانوي (ثانوية عامة)',
    subjectLabel: 'المادة الدراسية / التخصص',
    centerCodeLabel: 'كود السنتر أو المدرس (اختياري)',
    centerNameLabel: 'اسم الأكاديمية أو السنتر',
    governorateLabel: 'المحافظة / المنطقة',

    // Quick Demo Role Switcher
    roleSwitcherTitle: 'تبديل الدور التفاعلي',
    currentRole: 'الدور النشط للتجربة',

    // Hero CTAs
    ctaGetStarted: 'ابدأ تجربتك المجانية',
    ctaWatchDemo: 'شاهد العرض التفاعلي الحي',
    ctaRecordLesson: 'تسجيل حصة جديدة',
    ctaExploreMarket: 'تصفح نخبة المعلمين',

    // Pipeline Steps
    pipelineTitle: 'محرك "اشرح مرة واحدة.. واحصل على كل شيء"',
    stepRecording: 'تسجيل الحصة صوتياً',
    stepTranscript: 'تفريغ نصي زمني فوري',
    stepKnowledgeMap: 'خريطة المفاهيم التفاعلية',
    stepSummary: 'ملخص شامل بنظام كورنيل',
    stepQuiz: 'توليد اختبار ذكي تلقائي',
    stepAnalytics: 'تحليلات ونقاط الضعف',

    // Dashboard Common
    searchPlaceholder: 'ابحث عن حصة، مفهوم علمي، طالب، مجموعة، أو اختبار... (Ctrl+K)',
    totalStudents: 'إجمالي الطلاب',
    activeClasses: 'المجموعات النشطة',
    totalLessons: 'الحصص المعالجة',
    avgScore: 'متوسط الدرجات',
    attendanceRate: 'نسبة الحضور',
    monthlyRevenue: 'الإيراد الشهري',
    aiMinutesUsed: 'دقائق الذكاء الاصطناعي',
    buyMoreMinutes: 'شراء دقائق إضافية',
    createNew: 'إضافة جديد',

    // Lesson Studio
    recordingStudio: 'أستوديو تسجيل الحصة',
    step1Info: '1. بيانات الحصة',
    step2Record: '2. التسجيل المباشر',
    step3Process: '3. معالجة الذكاء الاصطناعي',
    lessonTitle: 'عنوان الحصة',
    subject: 'المادة الدراسية',
    classSelect: 'اختر المجموعة',
    unitChapter: 'الوحدة / الباب',
    startRecording: 'بدء تسجيل الحصة الآن',
    pauseRecording: 'إيقاف مؤقت',
    resumeRecording: 'استئناف',
    stopRecording: 'إنهاء وبدء المعالجة بالذكاء الاصطناعي',
    uploadAudio: 'أو ارفع ملف تسجيل صوتي أو فيديو (MP3, WAV, M4A, MP4)',
    micLive: 'المايكروفون متصل — مستوى الصوت',
    recordingDuration: 'مدة التسجيل المنقضية',

    // AI Processing Screen
    processingTitle: 'جاري تحويل حصتك إلى تجربة تعليمية ذكية متكاملة...',
    processingSub: 'يقوم محرك متفوّق الآن بالتفريغ باللهجة المصرية، واستخراج خرائط المفاهيم، ورصد مصائد الامتحانات، وتوليد بنك الأسئلة.',
    procStep1: 'رفع ملف التسجيل بأمان فائق وتشفير سحابي',
    procStep2: 'التفريغ الصوتي ومزامنة الكلمات زمنياً باللكنة المصرية',
    procStep3: 'تقسيم الحصة إلى فصول ونقاط زمنية دقيقة',
    procStep4: 'استخراج المفاهيم والمعادلات ومصائد الثانوية العامة',
    procStep5: 'بناء الخريطة المعرفية التفاعلية ثلاثية الأبعاد',
    procStep6: 'صياغة الملخص التعليمي المنظم بنظام كورنيل',
    procStep7: 'توليد بنك الأسئلة والاختبار الذكي المتدرج',

    // Lesson Tabs
    tabOverview: 'نظرة عامة',
    tabKnowledgeMap: 'الخريطة المعرفية',
    tabTranscript: 'التفريغ الزمني',
    tabSummary: 'الملخص المنظم',
    tabQuiz: 'الاختبار التفاعلي',
    tabAnalytics: 'تحليلات الحصة',

    // Knowledge Map UI
    kmTitle: 'الخريطة المعرفية التفاعلية للمفاهيم',
    kmSubtitle: 'انقر على أي عقدة لاستعراض شرح المفهوم، معادلته، والانتقال الفوري للثانية التي تم شرحه فيها في التسجيل.',
    kmSearch: 'تصفية المفاهيم...',
    kmZoomIn: 'تكبير',
    kmZoomOut: 'تصغير',
    kmReset: 'إعادة الضبط',
    kmFullscreen: 'شاشة كاملة',
    jumpToTimestamp: 'انتقل لصوت الحصة عند',
    masteryScore: 'إتقان الطلاب للمفهوم',
    relatedQuestions: 'أسئلة مرتبطة بهذا المفهوم',

    // Transcript UI
    transcriptTitle: 'التفريغ النصي المتزامن مع الصوت',
    searchTranscript: 'بحث في نص الحصة...',
    copyTranscript: 'نسخ النص',
    downloadPdf: 'تحميل PDF',
    editTranscript: 'تعديل التفريغ',

    // Quiz UI
    quizTitle: 'الاختبار الذكي المولد من الحصة',
    generateQuizBtn: 'توليد اختبار إضافي بالذكاء الاصطناعي',
    publishQuiz: 'نشر الاختبار للطلاب',
    addQuestion: 'إضافة سؤال يدوي',
    difficulty: 'مستوى الصعوبة',
    correctAnswer: 'الإجابة النموذجية',
    explanation: 'التفسير العلمي للحل',

    // Student UI
    greetingStudent: 'مرحباً بعودتك، يا عمر! 🔥',
    studentGoal: 'هدف الأسبوع: مراجعة 8 من 10 حصص',
    streakBadge: 'سلسلة 14 يوم متواصلة',
    xpBadge: '2,150 نقطة خبرة (المستوى الذهبي)',
    weakAreasTitle: 'تشخيص نقاط الضعف التي تحتاج لمراجعة',
    continueLearning: 'تابع دراستك من حيث توقفت',
    takeExam: 'بدء الاختبار التقييمي',

    // Currency
    currency: 'ج.م'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Default to Arabic as primary Egyptian audience, easily toggleable to English
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('motafawweq_lang') || 'ar';
  });

  useEffect(() => {
    const isRtl = lang === 'ar';
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('motafawweq_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key) => {
    return DICTIONARY[lang]?.[key] || DICTIONARY['ar']?.[key] || DICTIONARY['en']?.[key] || key;
  };

  const isRtl = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, isRtl, toggleLanguage, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
