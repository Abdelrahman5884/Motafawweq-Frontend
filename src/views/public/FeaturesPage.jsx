import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sparkles, 
  Mic, 
  FileText, 
  Share2, 
  Brain, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  Shield,
  Layers,
  GraduationCap,
  Users,
  Building2,
  UserCheck,
  Award,
  BarChart3,
  Wallet,
  Calendar,
  Search,
  Bell,
  Target,
  Clock,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Cpu,
  Check,
  Sliders,
  ExternalLink
} from 'lucide-react';

export const FeaturesPage = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const { lang, isRtl } = useLanguage();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Arrow icon based on RTL
  const ActionArrow = isRtl ? ArrowLeft : ArrowRight;

  // Roles definition with meta
  const roleTabs = [
    { 
      id: 'all', 
      labelAr: 'جميع الميزات', 
      labelEn: 'All Features', 
      icon: Layers, 
      color: '#1588C7',
      count: 26 
    },
    { 
      id: 'teacher', 
      labelAr: 'المعلم والمدرّس', 
      labelEn: 'Teacher & Educator', 
      icon: Mic, 
      color: '#1588C7',
      roleKey: 'teacher',
      badgeAr: '8 ميزات حصرية',
      badgeEn: '8 Features'
    },
    { 
      id: 'student', 
      labelAr: 'الطالب', 
      labelEn: 'Student', 
      icon: GraduationCap, 
      color: '#06B6D4',
      roleKey: 'student',
      badgeAr: '8 ميزات ذكية',
      badgeEn: '8 Features'
    },
    { 
      id: 'center', 
      labelAr: 'السنتر التعليمي', 
      labelEn: 'Learning Center', 
      icon: Building2, 
      color: '#8B5CF6',
      roleKey: 'center',
      badgeAr: '6 أدوات إدارة',
      badgeEn: '6 Features'
    },
    { 
      id: 'parent', 
      labelAr: 'ولي الأمر', 
      labelEn: 'Parent & Guardian', 
      icon: UserCheck, 
      color: '#10B981',
      roleKey: 'parent',
      badgeAr: '5 أدوات متابعة',
      badgeEn: '5 Features'
    },
    { 
      id: 'ai', 
      labelAr: 'محرك الذكاء الاصطناعي', 
      labelEn: 'Core AI Engine', 
      icon: Sparkles, 
      color: '#F59E0B',
      roleKey: 'teacher',
      badgeAr: 'تقنيات مصرية مخصصة',
      badgeEn: 'Egyptian AI'
    }
  ];

  // Comprehensive feature list across all roles
  const allFeatures = [
    // ══════════════════ 1. TEACHER FEATURES ══════════════════
    {
      role: 'teacher',
      categoryAr: 'استوديو الذكاء الاصطناعي',
      categoryEn: 'AI Studio',
      titleAr: 'استوديو التسجيل وتفريغ اللهجة المصرية',
      titleEn: 'Proprietary Egyptian Dialect ASR Studio',
      descAr: 'محرك ذكاء اصطناعي مدرب على آلاف الساعات من شروحات المدرسين المصريين، يفرغ الكلام بدقة متناهية حتى عند مزج العامية بالمصطلحات العلمية الإنجليزية مع ربط زمني فوري.',
      descEn: 'Engineered specifically for Egyptian educators. Effortlessly transcribes mixed Egyptian Arabic dialect and advanced English terminology with sample-accurate audio timestamps.',
      icon: Mic,
      color: '#1588C7',
      route: '/teacher/studio',
      targetRole: 'teacher',
      highlightsAr: [
        'فهم للمصطلحات العلمية بالإنجليزية والعربية',
        'ربط كل كلمة في التفريغ بالثانية الدقيقة في الصوت',
        'فلترة الضوضاء وتنقية صوت الميكروفون آلياً'
      ],
      highlightsEn: [
        'Recognizes scientific terms in English & Egyptian slang',
        'Deep-links every transcript word to exact audio second',
        'Automatic noise cancellation and voice isolation'
      ]
    },
    {
      role: 'teacher',
      categoryAr: 'التخطيط والمعرفة',
      categoryEn: 'Knowledge Graphs',
      titleAr: 'التوليد التلقائي لخرائط المفاهيم ومساحة الدرس',
      titleEn: 'Automated Concept Graphing & Lesson Workspace',
      descAr: 'تحويل الحصة الخطية إلى شبكة بصرية ذكية ترصد العلاقات بين المفاهيم (السبب، النتيجة، المكونات)، مع توليد ملخصات كورنيل ومصائد الامتحانات تلقائياً.',
      descEn: 'Transforms linear lectures into interactive visual concept graphs, illustrating hierarchical connections, Cornell notes, and board exam traps.',
      icon: Share2,
      color: '#06B6D4',
      route: '/teacher/workspace',
      targetRole: 'teacher',
      highlightsAr: [
        'خريطة مفاهيم شجرية وتفاعلية قابلة للضغط',
        'استخراج تلقائي لمصائد الامتحانات والخدع الشائعة',
        'ملاحظات كورنيل جاهزة للطباعة والتوزيع'
      ],
      highlightsEn: [
        'Interactive, clickable hierarchical concept map',
        'Automatic extraction of common exam traps & tricks',
        'Print-ready, beautifully structured Cornell notes'
      ]
    },
    {
      role: 'teacher',
      categoryAr: 'التقييم والاختبارات',
      categoryEn: 'Adaptive Exams',
      titleAr: 'بنك الأسئلة ومولد الامتحانات المتكيفة',
      titleEn: 'Adaptive AI Question & Exam Generator',
      descAr: 'توليد اختبارات إلكترونية وواجبات متدرجة الصعوبة (تذكر، تطبيق، مستويات عليا) مباشرة من محتوى الحصة، مع نماذج إجابة وتفسيرات علمية جاهزة.',
      descEn: 'Generates tiered Bloom-taxonomy questions directly based on lecture audio, with automated grading and detailed solution rationales.',
      icon: Brain,
      color: '#8B5CF6',
      route: '/teacher/exams',
      targetRole: 'teacher',
      highlightsAr: [
        'تدرج في الصعوبة وفق تصنيف بلوم للمستويات العليا',
        'تصحيح إلكتروني فوري ورصد تلقائي للدرجات',
        'تفسير وشرح نموذجي لكل بديل في الاختيارات'
      ],
      highlightsEn: [
        'Tiered questions adhering to high-order thinking standards',
        'Instant automated grading and gradebook sync',
        'Explanatory rationales for every multiple-choice option'
      ]
    },
    {
      role: 'teacher',
      categoryAr: 'إدارة المجموعات',
      categoryEn: 'Class Manager',
      titleAr: 'إدارة المجموعات ومواعيد الحصص',
      titleEn: 'Class & Cohort Management Suite',
      descAr: 'تنظيم مجموعات السناتر والحصص الأونلاين في لوحة واحدة، مع جدولة المواعيد، متابعة الطاقة الاستيعابية للقاعات، وإدارة قوائم الانتظار.',
      descEn: 'Consolidated scheduling for in-center and online cohorts with capacity tracking, schedule conflict prevention, and waitlist handling.',
      icon: Users,
      color: '#3B82F6',
      route: '/teacher/classes',
      targetRole: 'teacher',
      highlightsAr: [
        'فصل مرن بين مجموعات السنتر ومجموعات الأونلاين',
        'منع تضارب المواعيد بين الفروع والقاعات',
        'إدارة سهلة لطلبات التحويل بين المواعيد'
      ],
      highlightsEn: [
        'Seamless separation of in-person and online batches',
        'Automatic scheduling conflict detection across centers',
        'One-click student transfers between time slots'
      ]
    },
    {
      role: 'teacher',
      categoryAr: 'متابعة الطلاب',
      categoryEn: 'Student Roster',
      titleAr: 'سجل الطلاب ورصد الحضور والواجبات',
      titleEn: 'Comprehensive Student Roster & Homework Hub',
      descAr: 'ملف أكاديمي كامل لكل طالب يشمل سجل الحضور، درجات الامتحانات التراكمية، الواجبات المسلمة، وتنبيهات مبكرة للطلاب المعرضين للهبوط في المستوى.',
      descEn: 'Complete academic dossiers with attendance records, cumulative exam scores, homework submissions, and early risk flags.',
      icon: BookOpen,
      color: '#10B981',
      route: '/teacher/students',
      targetRole: 'teacher',
      highlightsAr: [
        'ملف فردي شامل لدرجات وسلوك كل طالب',
        'تنبيهات فورية عند تراجع درجات أي طالب',
        'تصدير تقارير المتابعة بصيغة PDF وExcel'
      ],
      highlightsEn: [
        'Individual academic dossier for every enrolled student',
        'Early warning alerts for drops in academic performance',
        'Instant PDF & Excel exports for assistant teachers'
      ]
    },
    {
      role: 'teacher',
      categoryAr: 'التحليلات الأكاديمية',
      categoryEn: 'Analytics',
      titleAr: 'لوحة تحليلات استيعاب الطلاب ونقاط الضعف',
      titleEn: 'Cohort Learning Analytics & Insight Engine',
      descAr: 'رؤية بيانية متقدمة تكشف الأسئلة التي تعثر فيها أغلب الطلاب، ومعدلات الفهم لكل درس، مما يساعد المعلم على إعادة شرح النقاط الصعبة في الحصة القادمة.',
      descEn: 'Visual intelligence revealing high-failure questions, topic retention rates, and batch-wide conceptual bottlenecks.',
      icon: BarChart3,
      color: '#EC4899',
      route: '/teacher/analytics',
      targetRole: 'teacher',
      highlightsAr: [
        'تحديد أصعب الأسئلة التي أخطأ فيها الطلاب بالامتحانات',
        'خريطة حرارية (Heatmap) لمستوى استيعاب أجزاء المنهج',
        'مقارنة الأداء بين مختلف المجموعات والسناتر'
      ],
      highlightsEn: [
        'Identifies trick questions with highest student failure rate',
        'Visual comprehension heatmap across syllabus chapters',
        'Side-by-side performance comparison across center branches'
      ]
    },
    {
      role: 'teacher',
      categoryAr: 'الماليات والاشتراكات',
      categoryEn: 'Financials',
      titleAr: 'إدارة الشؤون المالية وحساب نسب السناتر',
      titleEn: 'Teacher Financial Ledger & Automated Billing',
      descAr: 'تتبع دخل الحصص والاشتراكات الشهرية، مع حساب تلقائي لنسبة السنتر ونسب المساعدين وتصدير فواتير دقيقة ومفصلة بدون أي لبس حسابي.',
      descEn: 'Streamlined revenue tracking with automated center commission splits, assistant payouts, and clear downloadable financial summaries.',
      icon: Wallet,
      color: '#F59E0B',
      route: '/teacher/financials',
      targetRole: 'teacher',
      highlightsAr: [
        'حساب آلي لنسب السنات والمساعدين والمنصة',
        'تقارير تفصيلية للإيرادات الشهرية والحصص الفردية',
        'متابعة المتأخرات والاشتراكات غير المسددة'
      ],
      highlightsEn: [
        'Automated commission split logic with centers and staff',
        'Itemized monthly earnings and session revenue breakdowns',
        'Overdue payment reminders and ledger reconciliation'
      ]
    },
    {
      role: 'teacher',
      categoryAr: 'التحفيز والتكريم',
      categoryEn: 'Gamification',
      titleAr: 'دوري المتفوقين والشهادات التقديرية الآلية',
      titleEn: 'Teacher League & Automated Student Certificates',
      descAr: 'تحفيز الطلاب من خلال لوحة متصدرين ومسابقات أسبوعية، مع إمكانية إصدار شهادات تقدير إلكترونية معتمدة للمتفوقين وطباعتها بنقرة واحدة.',
      descEn: 'Boost cohort engagement via competitive weekly leaderboards and generate personalized, verifiable certificates of excellence in seconds.',
      icon: Award,
      color: '#14B8A6',
      route: '/teacher/certificates',
      targetRole: 'teacher',
      highlightsAr: [
        'إصدار فوري لشهادات التميز مع اسم الطالب وتوقيع المعلم',
        'لوحة شرف لأوائل المجموعات والمحافظات',
        'تصاميم فاخرة قابلة للمشاركة على وسائل التواصل'
      ],
      highlightsEn: [
        'Instant branded honor certificates with verified credentials',
        'Top-performers honor roll across all centers and branches',
        'Social-shareable designs to celebrate student achievements'
      ]
    },

    // ══════════════════ 2. STUDENT FEATURES ══════════════════
    {
      role: 'student',
      categoryAr: 'المحاضرات الذكية',
      categoryEn: 'Smart Lectures',
      titleAr: 'المحاضرات المحولة والقفز الصوتي اللحظي',
      titleEn: 'Smart Converted Lectures & Audio Hyperlinking',
      descAr: 'استعراض الحصص بتفريغ نصي كامل متزامن، مع إمكانية الضغط على أي كلمة للقفز فوراً لثانيتها في تسجيل المستر، دون تضييع الوقت في البحث العشوائي.',
      descEn: 'Transcribed lectures with synchronized audio. Click any sentence or term to jump immediately to that exact second in the teacher explanation.',
      icon: Zap,
      color: '#06B6D4',
      route: '/student/converted-lectures',
      targetRole: 'student',
      highlightsAr: [
        'مزامنة الكلمة المنطوقة مع النص المقروء في شاشة واحدة',
        'تسريع الصوت وتحديد النقاط الهامة والملاحظات الشخصية',
        'إمكانية الاستماع والمذاكرة دون استهلاك عالي للباقة'
      ],
      highlightsEn: [
        'Real-time voice-to-text highlighting during playback',
        'Variable speed playback and contextual personal bookmarks',
        'Bandwidth-optimized streaming for mobile and tablet study'
      ]
    },
    {
      role: 'student',
      categoryAr: 'التعلم البصري',
      categoryEn: 'Visual Learning',
      titleAr: 'خرائط المفاهيم التفاعلية',
      titleEn: 'Interactive Knowledge Graphs for Deep Retention',
      descAr: 'وداعاً للحفظ التلقيني؛ تصفح شبكة بصرية توضح كيف ترتبط فصول ومفاهيم المنهج ببعضها، مع ربط كل عقدة في الخريطة بجزء الشرح الخاص بها.',
      descEn: 'Say goodbye to rote memorization. Explore conceptual nodes showing causes, consequences, and relationships with direct links to lecture clips.',
      icon: Share2,
      color: '#1588C7',
      route: '/student/smart-lecture',
      targetRole: 'student',
      highlightsAr: [
        'استكشاف بصري تفاعلي يثبت المعلومة في الذاكرة طويلة المدى',
        'الربط بين أسئلة الربط المعقدة في امتحانات النظام الجديد',
        'بحث فوري عن أي مفهوم والوصول لشرحه في ثانية'
      ],
      highlightsEn: [
        'Visual interactive graphs driving long-term conceptual recall',
        'Master cross-chapter synthesis questions for modern exams',
        'Instant search jumping directly to the relevant node and clip'
      ]
    },
    {
      role: 'student',
      categoryAr: 'المراجعة المركزة',
      categoryEn: 'Revision',
      titleAr: 'ملخصات كورنيل ومصائد الامتحانات',
      titleEn: 'High-Yield Cornell Summaries & Exam Traps',
      descAr: 'ملخصات جاهزة تلخص كل درس في نقاط جوهرية وقوانين ومصطلحات هامة، مع تحذير الطالب باللون الأحمر من الخدع ومصائد امتحانات الثانوية العامة.',
      descEn: 'Structured study sheets breaking lessons into cues, summaries, and vital formulas, with vivid alerts highlighting notorious exam traps.',
      icon: Brain,
      color: '#10B981',
      route: '/student/revision',
      targetRole: 'student',
      highlightsAr: [
        'تنظيم كورنيل العالمي للمذاكرة السريعة قبل الامتحان',
        'تنبيهات مخصصة لمصائد واضعي الامتحانات السابقة',
        'تجميع القوانين والمعادلات الحيوية في كروت مراجعة'
      ],
      highlightsEn: [
        'World-class Cornell format for high-speed pre-exam review',
        'Dedicated warnings covering traps from past national exams',
        'Formula & equation index organized for instant memorization'
      ]
    },
    {
      role: 'student',
      categoryAr: 'علاج القصور',
      categoryEn: 'Weak Areas',
      titleAr: 'مركز تقوية نقاط الضعف الذكي',
      titleEn: 'AI Weak Areas Diagnostic & Treatment Hub',
      descAr: 'نظام تشخيصي ذكي يرصد الأسئلة والمفاهيم التي يخطئ فيها الطالب، ويصمم له مسار مراجعة وتمارين كويزات علاجية مخصصة حتى يتقنها تماماً.',
      descEn: 'Intelligent diagnostic engine identifying recurring mistakes and tailoring custom remediation quizzes until complete mastery is achieved.',
      icon: Target,
      color: '#DC2626',
      route: '/student/weak-areas',
      targetRole: 'student',
      highlightsAr: [
        'تحديد فوري للدروس التي تحتاج إعادة تثبيت ومراجعة',
        'توليد تدريبات مخصصة فقط على الأجزاء التي أخطأ فيها',
        'مؤشر إتقان يتغير مع كل خطوة تحسن وتدريب'
      ],
      highlightsEn: [
        'Real-time identification of topics requiring reinforcement',
        'Targeted mini-quizzes focusing exclusively on weak concepts',
        'Mastery score dynamically reflecting student improvement'
      ]
    },
    {
      role: 'student',
      categoryAr: 'الامتحانات والواجبات',
      categoryEn: 'Exams & Homework',
      titleAr: 'الامتحانات والواجبات التفاعلية بتصحيح فوري',
      titleEn: 'Adaptive Exam Taking with Explanatory Feedback',
      descAr: 'خوض الامتحانات الإلكترونية في بيئة تحاكي امتحانات التابلت ونظام الامتحانات الحقيقي، مع تصحيح لحظي وشرح بالفيديو والتعليل لكل سؤال.',
      descEn: 'Take timed online tests simulating real exam conditions with instant grading, score breakdowns, and step-by-step explanatory feedback.',
      icon: FileText,
      color: '#8B5CF6',
      route: '/student/homework',
      targetRole: 'student',
      highlightsAr: [
        'مؤقت زمني وتجربة محاكاة لأجواء الامتحان الحقيقي',
        'شرح مفصل لسبب اختيار كل إجابة صحيحة أو خاطئة',
        'إمكانية إعادة المحاولة ومراجعة الأخطاء في بنك الأسئلة'
      ],
      highlightsEn: [
        'Realistic countdown timer mimicking national board conditions',
        'Detailed rationale explaining why choices are correct or false',
        'Mistake review vault for targeted practice before final exams'
      ]
    },
    {
      role: 'student',
      categoryAr: 'التحفيز والتنافس',
      categoryEn: 'Gamification',
      titleAr: 'دوري المتفوقين ونظام النقاط والشارات',
      titleEn: 'Student League, XP Points & Achievement Badges',
      descAr: 'تحويل المذاكرة إلى تجربة ممتعة من خلال تجميع نقاط الخبرة (XP)، الفوز بالشارات التقديرية، والتنافس على المركز الأول في لوحة الشرف الأسبوعية.',
      descEn: 'Gamify your study sessions with XP points, unlock milestone badges, and climb the weekly leaderboard among students across Egypt.',
      icon: Award,
      color: '#F59E0B',
      route: '/student/league',
      targetRole: 'student',
      highlightsAr: [
        'نقاط تمنح مع كل درس يكتمل وكل كويز يتم حله',
        'شارات تميز للمذاكرة المتواصلة والدرجات النهائية',
        'تنافس شريف بين طلاب السنتر وطلاب المحافظات'
      ],
      highlightsEn: [
        'Earn XP for completing lectures, quizzes, and homework',
        'Unlock collectible achievement badges for streaks and full marks',
        'Friendly regional leaderboards celebrating top scholars'
      ]
    },
    {
      role: 'student',
      categoryAr: 'التكريم والشهادات',
      categoryEn: 'Certificates',
      titleAr: 'شهادات التفوق المعتمدة ومحفظة الإنجازات',
      titleEn: 'Verified Certificates & Personal Achievement Vault',
      descAr: 'احصل على شهادات تفوق إلكترونية موثقة عند إتمام الدورات والحصول على الدرجات النهائية، وشاركها مع أهلك وأصدقائك بضغطة زر.',
      descEn: 'Receive tamper-proof digital certificates of achievement upon course completion, exportable as high-res images and PDFs for social sharing.',
      icon: CheckCircle2,
      color: '#14B8A6',
      route: '/student/certificates',
      targetRole: 'student',
      highlightsAr: [
        'شهادات رسمية باسم الطالب ودرجاته معتمدة من المعلم',
        'رابط تحقق إلكتروني مباشر يمكن مشاركته',
        'تحميل فوري بجودة عالية للطباعة'
      ],
      highlightsEn: [
        'Official certificates verified with teacher and academy stamps',
        'Unique digital verification link shareable on LinkedIn & social',
        'High-resolution PDF download ready for framing and printing'
      ]
    },
    {
      role: 'student',
      categoryAr: 'لوحة التحكم',
      categoryEn: 'Dashboard',
      titleAr: 'لوحة متابعة الأداء ومواعيد الحصص',
      titleEn: 'Student Central Dashboard & Study Schedule',
      descAr: 'شاشة مركزية واحدة توضح لك كل ما تحتاجه: الحصص القادمة، الواجبات المطلوبة، مواعيد الاختبارات، ومؤشر عام لمدى تقدمك في كل مادة.',
      descEn: 'Unified home screen displaying upcoming live sessions, pending homework deadlines, exam dates, and holistic course progress gauges.',
      icon: Calendar,
      color: '#3B82F6',
      route: '/student/dashboard',
      targetRole: 'student',
      highlightsAr: [
        'جدول أسبوعي تفاعلي بمواعيد الحصص ومجموعات السنتر',
        'تذكيرات تلقائية بمواعيد تسليم الواجبات قبل إغلاقها',
        'شريط تقدم يوضح نسبة إنجاز كل منهج دراسي'
      ],
      highlightsEn: [
        'Interactive weekly timetable covering center and online classes',
        'Smart countdown alerts before homework deadlines close',
        'Holistic completion progress trackers for each enrolled subject'
      ]
    },

    // ══════════════════ 3. CENTER FEATURES ══════════════════
    {
      role: 'center',
      categoryAr: 'إدارة القاعات',
      categoryEn: 'Halls Management',
      titleAr: 'إدارة القاعات وجداول الحصص الذكية',
      titleEn: 'Room Allocation & Dynamic Hall Scheduling',
      descAr: 'تنسيق قاعات السنتر، متابعة الطاقة الاستيعابية، ومنع التعارضات الزمنية بين المدرسين مع خريطة حية لإشغال القاعات على مدار اليوم.',
      descEn: 'Coordinate center halls, monitor seat capacities, and eliminate time slot overlaps with a live interactive room occupancy timeline.',
      icon: Building2,
      color: '#8B5CF6',
      route: '/center/halls',
      targetRole: 'center',
      highlightsAr: [
        'خريطة بصرية تفاعلية لحالة إشغال كل قاعة لحظياً',
        'كشف ذكي وتنبيه فوري لأي تضارب في المواعيد',
        'تخصيص القاعات حسب أعداد مجموعات كل مدرس'
      ],
      highlightsEn: [
        'Visual interactive grid for live hall occupancy per branch',
        'Intelligent clash detection flagging overlapping sessions',
        'Optimized room matching based on class enrollment size'
      ]
    },
    {
      role: 'center',
      categoryAr: 'العمليات والباركود',
      categoryEn: 'Attendance & Gate',
      titleAr: 'الحضور السريع بنظام الباركود وبوابات الدخول',
      titleEn: 'Rapid Barcode/QR Attendance & Gate Operations',
      descAr: 'تسجيل حضور مئات الطلاب في دقائق معدودة عبر مسح كود الطالب (QR Code)، مع إرسال إشعار فوري وتلقائي لولي الأمر لحظة الدخول.',
      descEn: 'Process hundreds of student check-ins per minute via instant QR/barcode scanning, triggering real-time SMS/app alerts to parents.',
      icon: UserCheck,
      color: '#10B981',
      route: '/center/groups',
      targetRole: 'center',
      highlightsAr: [
        'مسح باركود فائق السرعة عبر كاميرا الهاتف أو جهاز الباركود',
        'إشعار لحظي لهاتف ولي الأمر بوصول الطالب أو تأخره',
        'منع دخول الطلاب غير المقيدين أو غير المسددين تلقائياً'
      ],
      highlightsEn: [
        'High-speed scanning via smartphone camera or hand-held scanner',
        'Automated parent push notification on arrival or late entry',
        'Instant gate validation rejecting unregistered or unpaid students'
      ]
    },
    {
      role: 'center',
      categoryAr: 'شؤون المدرسين',
      categoryEn: 'Multi-Teacher',
      titleAr: 'إدارة مجموعات ومساعدي المدرسين المتعددين',
      titleEn: 'Multi-Teacher Directory & Assistant Permissions',
      descAr: 'إدارة كاملة لجميع المدرسين المقيدين بالسنتر، مساعديهم، ومجموعاتهم، مع تخصيص صلاحيات محددة لكل موظف ومساعد داخل السنتر.',
      descEn: 'Manage rosters for dozens of teachers, their teaching assistants, and class groups with granular role-based access control.',
      icon: Users,
      color: '#1588C7',
      route: '/center/groups',
      targetRole: 'center',
      highlightsAr: [
        'دليل موحد لجميع المدرسين المقيدين بالسنتر ومواعيدهم',
        'تحديد صلاحيات دقيقة للمساعدين وموظفي الاستقبال',
        'نقل الطلاب وتبديل المجموعات بسهولة بضغطة زر'
      ],
      highlightsEn: [
        'Unified registry of all center educators and their schedules',
        'Granular permissions for assistants and front-desk staff',
        'One-click student transfers between teachers and cohorts'
      ]
    },
    {
      role: 'center',
      categoryAr: 'الماليات وتوزيع الأرباح',
      categoryEn: 'Financial Split',
      titleAr: 'حساب الإيرادات ونسب الأرباح آلياً',
      titleEn: 'Automated Revenue Splits & Financial Ledger',
      descAr: 'حساب نسب المدرسين وإيرادات السنتر وتكاليف التشغيل تلقائياً بعد كل حصة، مع تقارير ختامة يومية وخزينة دقيقة بنسبة خطأ 0%.',
      descEn: 'Split tuition fees between center and teachers automatically, with error-free daily cash reconciliation and accounting reports.',
      icon: Wallet,
      color: '#F59E0B',
      route: '/center/operations',
      targetRole: 'center',
      highlightsAr: [
        'حساب فوري لنسبة السنتر ونسبة المدرس لكل حصة',
        'تقرير تسوية خزينة يومي مطبوع بنقرة زر',
        'سجل شامل لمبيعات المذكرات وكروت الحصص'
      ],
      highlightsEn: [
        'Instant automated formula calculation for teacher/center cuts',
        'One-click printed end-of-day cash drawer reconciliation',
        'Complete tracking for book sales, sheet fees, and cards'
      ]
    },
    {
      role: 'center',
      categoryAr: 'العمليات والمكتب',
      categoryEn: 'Operations Hub',
      titleAr: 'لوحة التحكم في العمليات والموظفين',
      titleEn: 'Operations Command Center & Staff Audit Logs',
      descAr: 'متابعة حركة اليوم الدراسي بالكامل: الحصص الجارية، القاعات المشغولة، أداء موظفي الاستقبال، وسجلات تدقيق لكافة العمليات المالية والتنظيمية.',
      descEn: 'Live operational bird’s-eye view: active lectures, room status, receptionist metrics, and audit logs for all security and financial changes.',
      icon: Sliders,
      color: '#06B6D4',
      route: '/center/operations',
      targetRole: 'center',
      highlightsAr: [
        'متابعة لحظية لجميع القاعات والحصص المقامة الآن',
        'سجل تدقيق كامل لكافة العمليات المالية والإدارية',
        'إدارة فروع السنتر المتعددة من لوحة رئيسية واحدة'
      ],
      highlightsEn: [
        'Real-time overview of ongoing classes across all rooms',
        'Comprehensive audit log tracking all staff transactions',
        'Multi-branch management under a single umbrella account'
      ]
    },
    {
      role: 'center',
      categoryAr: 'الهوية والتخصيص',
      categoryEn: 'White-Label',
      titleAr: 'الهوية المخصصة للسنتر',
      titleEn: 'White-Label Branding, Custom Domain & Badges',
      descAr: 'حوّل المنصة لتكون باسم وشعار السنتر وألوانه وهويته البصرية بالكامل، مع إمكانية ربط دومين خاص وطباعة كروت وإيصالات تحمل اسم السنتر.',
      descEn: 'Deploy Motafawweq under your center brand name, logos, custom domain, and customized receipts and student ID badges.',
      icon: Layers,
      color: '#EC4899',
      route: '/center/settings',
      targetRole: 'center',
      highlightsAr: [
        'تخصيص الشعار والألوان والخطوط لتطابق هوية السنتر',
        'طباعة كروت الطلاب وإيصالات الدفع بشعار السنتر الرسمي',
        'إمكانية تشغيل المنصة على رابط مخصص خاص بكم'
      ],
      highlightsEn: [
        'Custom logos, color schemes, and fonts matching center identity',
        'Branded printed student ID cards and official receipts',
        'Custom web domain support for premium enterprise centers'
      ]
    },

    // ══════════════════ 4. PARENT FEATURES ══════════════════
    {
      role: 'parent',
      categoryAr: 'لوحة الأبناء',
      categoryEn: 'Family Dashboard',
      titleAr: 'لوحة المتابعة الشاملة لجميع الأبناء',
      titleEn: 'Unified Family Dashboard & Multi-Student Tracking',
      descAr: 'شاشة واحدة تمكن ولي الأمر من متابعة مسار جميع أبنائه بمختلف المراحل الدراسية، والاطلاع على المواعيد والدرجات والواجبات بضغطة زر.',
      descEn: 'A single unified dashboard enabling parents to oversee all their enrolled children across grades, classes, and subjects effortlessly.',
      icon: Users,
      color: '#10B981',
      route: '/parent/dashboard',
      targetRole: 'parent',
      highlightsAr: [
        'التبديل الفوري بين ملفات الأبناء من شاشة واحدة',
        'رؤية شاملة للمواعيد القادمة في السناتر أو الأونلاين',
        'تواصل سريع ومباشر مع إدارة السنتر والمعلمين'
      ],
      highlightsEn: [
        'Instant one-click switching between children profiles',
        'Clear weekly calendar of upcoming sessions and homework',
        'Direct communication channels with centers and teachers'
      ]
    },
    {
      role: 'parent',
      categoryAr: 'الأمان والحضور',
      categoryEn: 'Instant Alerts',
      titleAr: 'إشعارات الحضور والغياب اللحظية',
      titleEn: 'Real-Time Attendance & Gate Check-in Alerts',
      descAr: 'اطمئن على ابنك لحظة بلحظة؛ يستقبل ولي الأمر إشعاراً فورياً على هاتفه عند مسح الطالب للباركود في باب السنتر، وتنبيه مبكر في حال الغياب.',
      descEn: 'Enjoy complete peace of mind. Receive instantaneous mobile alerts the moment your student checks into the center, plus immediate absence warnings.',
      icon: Bell,
      color: '#1588C7',
      route: '/parent/dashboard',
      targetRole: 'parent',
      highlightsAr: [
        'إشعار لحظي بدخول الطالب للسنتر وتوقيت الحصة بدقة',
        'تنبيه فوري في حال تخلف الطالب عن الحضور لحمايته',
        'سجل شهري كامل لنسب الحضور والانضباط'
      ],
      highlightsEn: [
        'Instant timestamped check-in alerts when entering center',
        'Proactive warning notifications if student misses a lecture',
        'Monthly attendance integrity log and punctuality breakdown'
      ]
    },
    {
      role: 'parent',
      categoryAr: 'التقييم الأكاديمي',
      categoryEn: 'Academic Report',
      titleAr: 'تقارير الدرجات والتحصيل الدوري',
      titleEn: 'Academic Gradebook & Periodic Scorecards',
      descAr: 'كشف درجات تفصيلي لكل امتحان دوري أو كويز أو واجب، مع رسوم بيانية توضح تطور مستوى الطالب صعوداً وهبوطاً طوال العام الدراسي.',
      descEn: 'Detailed grade reports for every weekly test, quiz, and assignment, paired with longitudinal progress charts revealing growth trends.',
      icon: BarChart3,
      color: '#8B5CF6',
      route: '/parent/dashboard',
      targetRole: 'parent',
      highlightsAr: [
        'إشعار فوري بدرجة كل امتحان بعد انتهاء التصحيح',
        'رسم بياني يوضح تطور مستوى الطالب ومقارنته بمتوسط الدفعة',
        'متابعة التزام الطالب بتسليم الواجبات الدورية'
      ],
      highlightsEn: [
        'Instant notification with test score as soon as graded',
        'Visual progression chart benchmarking against cohort average',
        'Tracking homework submission consistency and quality'
      ]
    },
    {
      role: 'parent',
      categoryAr: 'الإعدادات والتحكم',
      categoryEn: 'Parent Settings',
      titleAr: 'إعدادات المنظومة وتخصيص الإشعارات',
      titleEn: 'Notification Settings & Profile Preferences',
      descAr: 'تحكم كامل في إعدادات تنبيهات واتساب، قنوات التواصل، وإدارة ربط حسابات الأبناء وأرقام هواتف الطوارئ لضمان متابعة مريحة ودقيقة.',
      descEn: 'Customize notification channels, WhatsApp gate alerts, emergency contact numbers, and linked student profiles effortlessly.',
      icon: Settings,
      color: '#1588C7',
      route: '/parent/dashboard?tab=settings',
      targetRole: 'parent',
      highlightsAr: [
        'تخصيص تنبيهات البوابات ومسح الباركود على هاتفك',
        'إدارة سهلة لربط الأبناء في مختلف المراحل الدراسية',
        'تحديث بيانات الاتصال وأرقام الطوارئ بضغطة زر'
      ],
      highlightsEn: [
        'Customizable gate check-in and absence alert preferences',
        'Seamless linking and management of multi-student accounts',
        'Easy updates for parent emergency contacts and channels'
      ]
    },
    {
      role: 'parent',
      categoryAr: 'الشفافية المالية',
      categoryEn: 'Financial Transparency',
      titleAr: 'سجل المدفوعات والاشتراكات الشفاف',
      titleEn: 'Transparent Payment History & Fee Statements',
      descAr: 'اطلاع كامل على جميع المصروفات، اشتراكات الحصص، وأسعار المذكرات، مع إيصالات دفع رقمية تضمن عدم حدوث أي التباس أو دفع متكرر.',
      descEn: 'Full visibility over tuition fees, course renewals, and book costs with downloadable digital receipts ensuring zero ambiguity.',
      icon: Wallet,
      color: '#06B6D4',
      route: '/parent/dashboard',
      targetRole: 'parent',
      highlightsAr: [
        'سجل كامل بالدفعات السابقة والمبالغ المتبقية إن وجدت',
        'إيصالات دفع إلكترونية موثقة تحفظ حق ولي الأمر والسنتر',
        'تذكير ذكي بمواعيد تجديد الاشتراكات قبل انتهاء مهلتها'
      ],
      highlightsEn: [
        'Itemized ledger of all paid sessions and outstanding fees',
        'Official electronic receipts safeguarding parent rights',
        'Timely reminders before subscription renewal deadlines'
      ]
    },

    // ══════════════════ 5. CORE AI ENGINE FEATURES ══════════════════
    {
      role: 'ai',
      categoryAr: 'الذكاء الاصطناعي التأسيسي',
      categoryEn: 'Core Engine',
      titleAr: 'محرك التفريغ الصوتي للهجة المصرية والمصطلحات العلمية',
      titleEn: 'Proprietary Egyptian Dialect & STEM Speech Engine',
      descAr: 'أول محرك تفريغ صوتي متخصص في اللهجة المصرية، مدرب على أكثر من 10,000 ساعة من شروحات الأحياء، الكيمياء، الفيزياء، والرياضيات.',
      descEn: 'Egypt’s first bespoke speech recognition engine trained on over 10,000 hours of STEM tutorials, mastering colloquial vernacular and English terminology.',
      icon: Mic,
      color: '#1588C7',
      route: '/teacher/studio',
      targetRole: 'teacher',
      highlightsAr: [
        'دقة تفوق 98% في استيعاب المصطلحات العلمية المزدوجة',
        'مزامنة زمنية فائقة الدقة لكل مقطع صوتي',
        'معالجة سحابية فائقة السرعة تُنهي الحصة في دقائق'
      ],
      highlightsEn: [
        'Over 98% accuracy on mixed colloquial & English STEM terms',
        'Sub-second timestamp synchronization for every speech chunk',
        'Blazing-fast cloud pipeline processing full lectures in minutes'
      ]
    },
    {
      role: 'ai',
      categoryAr: 'الهيكلة المعرفية',
      categoryEn: 'Knowledge Modeling',
      titleAr: 'التوليد الآلي لشبكات المعرفة الدلالية',
      titleEn: 'Automated Semantic Knowledge Graph Extraction',
      descAr: 'تحويل الشرح الصوتي والمكتوب إلى تمثيل معرفي منظم يربط بين المفاهيم والقوانين والعلاقات الرياضية والبيولوجية بصورة بصرية تفاعلية.',
      descEn: 'Extracts ontological concept hierarchies and relational links from unstructured lecture discourse into structured visual graphs.',
      icon: Share2,
      color: '#06B6D4',
      route: '/teacher/workspace',
      targetRole: 'teacher',
      highlightsAr: [
        'تحليل منطقي لروابط السبب والنتيجة والمقارنات',
        'بناء خرائط ذهنية متعددة المستويات لكل فصل دراسي',
        'ربط كل عقدة معرفية بالمراجع ونماذج الأسئلة'
      ],
      highlightsEn: [
        'Extracts causal, compositional, and relational dependencies',
        'Builds multi-tier mental models for every textbook chapter',
        'Directly links knowledge nodes to exam questions and references'
      ]
    },
    {
      role: 'ai',
      categoryAr: 'صناعة الأسئلة',
      categoryEn: 'Item Generation',
      titleAr: 'توليد الأسئلة وفق تصنيف بلوم للمستويات العليا',
      titleEn: 'Tiered Question Generation (Recall to Synthesis)',
      descAr: 'توليد بنك أسئلة ذكي يقيس الفهم العميق والربط بين الدروس بدلاً من الحفظ، مع وضع مشتتات ذكية وتفسير فلسفة كل سؤال بدقة واضعي الامتحانات.',
      descEn: 'Generates tiered assessment items spanning Recall, Application, and Synthesis with intelligent plausible distractors and deep answer rationales.',
      icon: Brain,
      color: '#8B5CF6',
      route: '/teacher/exams',
      targetRole: 'teacher',
      highlightsAr: [
        'صياغة أسئلة تقيس الفهم والتحليل والتطبيق بدقة',
        'توليد مشتتات واقعية تكشف أخطاء الطلاب المفاهيمية',
        'توفير خطوات الحل النموذجية وتفسير الأخطاء المحتملة'
      ],
      highlightsEn: [
        'Generates items testing analysis and synthesis over memorization',
        'Plausible distractors diagnosing specific student misconceptions',
        'Step-by-step model solution keys with misconception guides'
      ]
    },
    {
      role: 'ai',
      categoryAr: 'التلخيص الذكي',
      categoryEn: 'Smart Synthesis',
      titleAr: 'التلخيص الهيكلي واستخراج مصائد الامتحانات',
      titleEn: 'Structural Cornell Summaries & Exam Trap Extraction',
      descAr: 'توليد ملخصات مكثفة عالية الجودة تركز على النقاط ذات الثقل في الامتحانات، مع رصد مباشر للخدع الشائعة التي يقع فيها أغلب الطلاب في امتحانات الوزارة.',
      descEn: 'Synthesizes high-yield study briefs focusing on high-weight board exam topics, actively pinpointing trick wording and historical stumbling blocks.',
      icon: Sparkles,
      color: '#F59E0B',
      route: '/student/revision',
      targetRole: 'student',
      highlightsAr: [
        'تحديد الخدع اللفظية ومصائد امتحانات الثانوية العامة بدقة',
        'تلخيص الدروس في أشكال جداول مقارنة وقوانين مركزة',
        'توفير ساعات طويلة من التلخيص اليدوي المرهق'
      ],
      highlightsEn: [
        'Detects deceptive wording and historical exam traps',
        'Structures knowledge into comparison tables and formula sheets',
        'Saves dozens of hours of manual note-taking and revision prep'
      ]
    }
  ];

  // Filter features based on tab and search
  const filteredFeatures = useMemo(() => {
    return allFeatures.filter((feat) => {
      // Tab filter
      const matchesTab = activeTab === 'all' || feat.role === activeTab;

      // Search filter
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesTab;

      const title = (lang === 'ar' ? feat.titleAr : feat.titleEn).toLowerCase();
      const desc = (lang === 'ar' ? feat.descAr : feat.descEn).toLowerCase();
      const cat = (lang === 'ar' ? feat.categoryAr : feat.categoryEn).toLowerCase();
      const highlights = (lang === 'ar' ? feat.highlightsAr : feat.highlightsEn).join(' ').toLowerCase();

      const matchesSearch = 
        title.includes(q) || 
        desc.includes(q) || 
        cat.includes(q) || 
        highlights.includes(q);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, lang]);

  // Handler for testing a feature live
  const handleTryFeature = (feat) => {
    if (feat.targetRole) {
      switchRole(feat.targetRole);
    }
    navigate(feat.route);
  };

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '40px 20px 100px',
      fontFamily: isRtl ? 'var(--font-arabic, "Cairo", sans-serif)' : 'var(--font-sans, "Inter", sans-serif)'
    }}>
      {/* ══════════════════ HERO SECTION ══════════════════ */}
      <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(21, 136, 199, 0.12)',
          border: '1px solid rgba(21, 136, 199, 0.28)',
          color: 'var(--primary, #1588C7)',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '20px'
        }}>
          <Sparkles size={16} />
          <span>{lang === 'ar' ? 'منظومة متفوق التعليمية المتكاملة' : 'Motafawweq All-In-One Ecosystem'}</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(30px, 4vw, 44px)',
          fontWeight: '900',
          color: 'var(--text-primary)',
          lineHeight: 1.25,
          marginBottom: '18px'
        }}>
          {lang === 'ar' 
            ? 'ميزات ذكية صُممت خصيصاً لكل ركن في العملية التعليمية' 
            : 'Tailored Features Built for Every Stakeholder in Modern Education'}
        </h1>

        <p style={{
          fontSize: '16.5px',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          maxWidth: '720px',
          margin: '0 auto'
        }}>
          {lang === 'ar'
            ? 'سواء كنت معلماً يبحث عن أتمتة مهام الحصص، أو طالباً يسعى لفهم حقيقي وتفوق دائم، أو إدارة سنتر تدير آلاف الطلاب، أو ولي أمر يتابع مستقبل أبنائه — متفوّق صُمم لأجلك.'
            : 'Whether you are an educator automating tedious tasks, a student aiming for deep mastery, a center director scaling operations, or a parent supporting your children — Motafawweq is built for you.'}
        </p>
      </div>

      {/* ══════════════════ ROLE TABS & SEARCH BAR ══════════════════ */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {/* Role Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {roleTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 20px',
                  borderRadius: '14px',
                  border: isActive ? `2px solid ${tab.color}` : '1px solid var(--border-medium)',
                  backgroundColor: isActive ? `${tab.color}18` : 'var(--bg-surface-elevated, #FFFFFF)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '800' : '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? `0 4px 16px ${tab.color}30` : 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? tab.color : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? '#FFFFFF' : tab.color
                }}>
                  <TabIcon size={16} />
                </div>
                <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
                {tab.count !== undefined ? (
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: isActive ? tab.color : 'var(--bg-subtle, #f1f5f9)',
                    color: isActive ? '#FFFFFF' : 'var(--text-secondary)'
                  }}>
                    {tab.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Search Bar & Results Counter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          maxWidth: '780px',
          margin: '0 auto',
          width: '100%'
        }}>
          <div style={{
            position: 'relative',
            flex: 1,
            minWidth: '280px'
          }}>
            <Search 
              size={18} 
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                [isRtl ? 'right' : 'left']: '16px',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث عن ميزة بالاسم، أو المحتوى، أو الكلمة المفتاحية...' : 'Search features by name, keyword, or capability...'}
              style={{
                width: '100%',
                padding: isRtl ? '12px 46px 12px 18px' : '12px 18px 12px 46px',
                borderRadius: '12px',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
          </div>

          <div style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            fontWeight: '600'
          }}>
            {lang === 'ar' ? `عرض ${filteredFeatures.length} ميزة` : `Showing ${filteredFeatures.length} features`}
          </div>
        </div>
      </div>

      {/* ══════════════════ ACTIVE ROLE SPOTLIGHT BANNER ══════════════════ */}
      {activeTab !== 'all' && (
        <div style={{
          marginBottom: '35px',
          padding: '24px 30px',
          borderRadius: '18px',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            {(() => {
              const currentTabMeta = roleTabs.find(t => t.id === activeTab);
              const TabIcon = currentTabMeta?.icon || Sparkles;
              return (
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: `${currentTabMeta?.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: currentTabMeta?.color
                }}>
                  <TabIcon size={28} />
                </div>
              );
            })()}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  {lang === 'ar' 
                    ? `ميزات ${roleTabs.find(t => t.id === activeTab)?.labelAr}`
                    : `${roleTabs.find(t => t.id === activeTab)?.labelEn} Feature Suite`}
                </h3>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '700',
                  backgroundColor: 'rgba(21, 136, 199, 0.15)',
                  color: 'var(--primary)'
                }}>
                  {lang === 'ar' 
                    ? roleTabs.find(t => t.id === activeTab)?.badgeAr 
                    : roleTabs.find(t => t.id === activeTab)?.badgeEn}
                </span>
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0 }}>
                {activeTab === 'teacher' && (lang === 'ar' ? 'حلول ذكية لتقليل وقت التحضير، وتسجيل الحصص، وتصحيح الاختبارات ومتابعة الطلاب بدقة.' : 'Smart automation eliminating lecture prep, grading, and administrative overhead for educators.')}
                {activeTab === 'student' && (lang === 'ar' ? 'أدوات مذاكرة متطورة تعتمد على الفهم العميق، والخرائط البصرية، وعلاج نقاط الضعف.' : 'Visual, audio-linked study tools designed for high retention and active exam preparation.')}
                {activeTab === 'center' && (lang === 'ar' ? 'منظومة عمليات متكاملة لإدارة السنتر، الحضور بالباركود، القاعات، وحساب الإيرادات.' : 'End-to-end management for learning centers: hall scheduling, QR attendance, and automated revenue splits.')}
                {activeTab === 'parent' && (lang === 'ar' ? 'راحة بال كاملة عبر متابعة الحضور، إشعارات الغياب الفورية، وتقارير الدرجات الدورية.' : 'Total peace of mind with instant check-in alerts, absence notifications, and academic grade reports.')}
                {activeTab === 'ai' && (lang === 'ar' ? 'خوارزميات ذكاء اصطناعي مصرية متخصصة ومصممة خصيصاً للمناهج واللهجة المصرية.' : 'Proprietary AI models built ground-up for Egyptian dialect transcription and syllabus graphs.')}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const meta = roleTabs.find(t => t.id === activeTab);
              if (meta?.roleKey) {
                switchRole(meta.roleKey);
                if (meta.roleKey === 'teacher') navigate('/teacher/dashboard');
                else if (meta.roleKey === 'student') navigate('/student/dashboard');
                else if (meta.roleKey === 'center') navigate('/center/dashboard');
                else if (meta.roleKey === 'parent') navigate('/parent/dashboard');
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 22px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary, #1588C7)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(21, 136, 199, 0.3)'
            }}
          >
            <span>{lang === 'ar' ? 'تجربة هذه اللوحة الآن' : 'Test This Dashboard Demo'}</span>
            <ActionArrow size={16} />
          </button>
        </div>
      )}

      {/* ══════════════════ FEATURES GRID ══════════════════ */}
      {filteredFeatures.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'var(--bg-surface-elevated)',
          borderRadius: '16px',
          border: '1px dashed var(--border-medium)'
        }}>
          <HelpCircle size={40} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
            {lang === 'ar' ? 'لا توجد ميزات تطابق بحثك' : 'No features match your search query'}
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {lang === 'ar' ? 'جرب البحث بكلمة أخرى أو قم بمسح نص البحث.' : 'Try adjusting your search terms or clearing the search input.'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          {filteredFeatures.map((feat, idx) => {
            const FeatIcon = feat.icon;
            const roleMeta = roleTabs.find(r => r.id === feat.role);
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '18px',
                  padding: '28px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = feat.color;
                  e.currentTarget.style.boxShadow = `0 12px 28px -6px ${feat.color}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div>
                  {/* Top Bar: Icon + Category Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '18px'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      backgroundColor: `${feat.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: feat.color
                    }}>
                      <FeatIcon size={24} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '11.5px',
                        fontWeight: '700',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        backgroundColor: `${roleMeta?.color || feat.color}15`,
                        color: roleMeta?.color || feat.color
                      }}>
                        {lang === 'ar' ? (roleMeta?.labelAr || feat.role) : (roleMeta?.labelEn || feat.role)}
                      </span>
                      <span style={{
                        fontSize: '11.5px',
                        fontWeight: '600',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        backgroundColor: 'var(--bg-subtle, #f1f5f9)',
                        color: 'var(--text-secondary)'
                      }}>
                        {lang === 'ar' ? feat.categoryAr : feat.categoryEn}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    marginBottom: '10px',
                    lineHeight: 1.35
                  }}>
                    {lang === 'ar' ? feat.titleAr : feat.titleEn}
                  </h3>

                  <p style={{
                    fontSize: '13.5px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.65,
                    marginBottom: '20px'
                  }}>
                    {lang === 'ar' ? feat.descAr : feat.descEn}
                  </p>

                  {/* Highlights Bullet List */}
                  <div style={{
                    backgroundColor: 'var(--bg-subtle, #f8fafc)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    marginBottom: '22px'
                  }}>
                    {(lang === 'ar' ? feat.highlightsAr : feat.highlightsEn).map((point, pIdx) => (
                      <div
                        key={pIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontSize: '12.5px',
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                          marginBottom: pIdx === feat.highlightsAr.length - 1 ? 0 : '8px'
                        }}
                      >
                        <Check 
                          size={15} 
                          color={feat.color} 
                          style={{ minWidth: '15px', marginTop: '2px' }} 
                        />
                        <span style={{ lineHeight: 1.45 }}>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <button
                  onClick={() => handleTryFeature(feat)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '11px 16px',
                    borderRadius: '10px',
                    backgroundColor: 'transparent',
                    border: `1.5px solid ${feat.color}50`,
                    color: feat.color,
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = feat.color;
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = feat.color;
                  }}
                >
                  <span>
                    {lang === 'ar'
                      ? (feat.role === 'teacher' ? 'فتح في مساحة المعلم' :
                         feat.role === 'student' ? 'تجربة في مساحة الطالب' :
                         feat.role === 'center' ? 'استعراض في بوابة السنتر' :
                         feat.role === 'parent' ? 'مشاهدة شاشة ولي الأمر' : 'تجربة الأداة الآن')
                      : 'Explore in Live Demo'}
                  </span>
                  <ActionArrow size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════════════ WHY MOTAFAWWEQ ECOSYSTEM ══════════════════ */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: '24px',
        padding: '40px 30px',
        marginBottom: '60px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 35px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
            {lang === 'ar' ? 'كيف تتكامل أدوار المنظومة معاً؟' : 'How the Ecosystem Converges Seamlessly'}
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)' }}>
            {lang === 'ar'
              ? 'متفوّق ليس مجرد برنامج تسجيل أو نظام إدارة منفصل؛ إنها شبكة حية تربط كل أطراف التعليم في تدفق واحد متناغم.'
              : 'Motafawweq is not a standalone tool; it is a synchronized ecosystem keeping every participant connected in real time.'}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {[
            {
              role: lang === 'ar' ? 'المعلم يشرح' : 'Teacher Teaches',
              desc: lang === 'ar' ? 'يسجل صوته، والذكاء الاصطناعي يفرغ الشرح ويستخرج خرائط المعرفة والامتحانات آلياً.' : 'Records the audio; AI transcribes, maps concepts, and synthesizes quizzes instantly.',
              icon: Mic,
              color: '#1588C7'
            },
            {
              role: lang === 'ar' ? 'السنتر ينظم' : 'Center Coordinates',
              desc: lang === 'ar' ? 'يسجل حضور الطالب بالباركود، يفرز القاعات، ويحسب نسب الإيرادات تلقائياً.' : 'Scans QR codes for rapid attendance, schedules halls, and calculates commission splits.',
              icon: Building2,
              color: '#8B5CF6'
            },
            {
              role: lang === 'ar' ? 'الطالب يتقن' : 'Student Masters',
              desc: lang === 'ar' ? 'يذاكر بالقفز الزمني للصوت وخرائط المفاهيم ويعالج نقاط ضعفه بتمارين تكيفية.' : 'Learns with audio-hyperlinked transcripts and targets weak concepts through AI drills.',
              icon: GraduationCap,
              color: '#06B6D4'
            },
            {
              role: lang === 'ar' ? 'ولي الأمر يطمئن' : 'Parent Follows',
              desc: lang === 'ar' ? 'يستقبل إشعار الحضور الفوري والدرجات الدورية وتوصيات الدعم الدراسي.' : 'Receives instant gate arrival alerts, exam scorecards, and diagnostic advice.',
              icon: UserCheck,
              color: '#10B981'
            }
          ].map((item, i) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={i}
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-subtle, #f8fafc)',
                  border: '1px solid var(--border-medium)',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: `${item.color}15`,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px'
                }}>
                  <ItemIcon size={22} />
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {item.role}
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════ TRY LIVE WORKSPACE CTA ══════════════════ */}
      <div style={{
        backgroundColor: 'var(--primary-surface, rgba(21, 136, 199, 0.08))',
        border: '1px solid var(--primary-light, rgba(21, 136, 199, 0.3))',
        borderRadius: '24px',
        padding: '45px 30px',
        textAlign: 'center',
        maxWidth: '780px',
        margin: '0 auto'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary, #1588C7)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px',
          boxShadow: '0 8px 24px rgba(21, 136, 199, 0.4)'
        }}>
          <Sparkles size={28} />
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '12px' }}>
          {lang === 'ar' ? 'جاهز لتجربة متفوّق عملياً الآن؟' : 'Ready to Experience Motafawweq in Action?'}
        </h2>

        <p style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
          maxWidth: '600px',
          margin: '0 auto 28px'
        }}>
          {lang === 'ar' 
            ? 'ادخل مباشرة لمساحة العمل التفاعلية كمعلم أو كطالب أو كسنتر لتستكشف كيف يُحدث الذكاء الاصطناعي فارقاً حقيقياً في دقائق.'
            : 'Step into the live interactive demo workspace as an educator, student, or center director and witness modern AI in action.'}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <button
            onClick={() => {
              switchRole('teacher');
              navigate('/teacher/workspace');
            }}
            style={{
              padding: '13px 26px',
              borderRadius: '9999px',
              backgroundColor: 'var(--primary, #1588C7)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(21, 136, 199, 0.35)'
            }}
          >
            <span>{lang === 'ar' ? 'فتح مساحة عمل المعلم والدرس' : 'Open Teacher Lesson Workspace'}</span>
            <ActionArrow size={16} />
          </button>

          <button
            onClick={() => {
              switchRole('student');
              navigate('/student/dashboard');
            }}
            style={{
              padding: '13px 26px',
              borderRadius: '9999px',
              backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-medium)',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{lang === 'ar' ? 'تجربة حساب الطالب' : 'Try Student Experience'}</span>
            <ActionArrow size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
