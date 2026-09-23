// Comprehensive Teacher Data Engine for Motafawweq Platform
// Reflecting realistic curriculum, exams, homework, leagues, analytics, and settings for Dr. Salma El-Sayed

export const TEACHER_PROFILE = {
  id: 'tch-salma',
  name: 'Dr. Salma El-Sayed',
  nameAr: 'د. سلمى السيد',
  title: 'Senior Biology Lecturer & Educational Author',
  titleAr: 'كبير معلمي الأحياء ومؤلفة سلسلة المتفوق',
  subject: 'Biology',
  subjectAr: 'الأحياء والجيولوجيا',
  bioAr: 'خبرة أكثر من 18 عاماً في تدريس مادة الأحياء للثانوية العامة والشهادات الدولية. مؤلفة سلسلة كتب المتفوق ومنسقة بنك الأسئلة المعتمد.',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  email: 'salma.biology@motafawweq.me',
  phone: '+20 101 234 5678',
  rating: 4.96,
  reviewsCount: 1420,
  totalStudents: 4120,
  activeEnrolled: 3890,
  totalLessonsPublished: 18,
  pendingProcessing: 2,
  monthlyEarningsEgp: 78400,
  walletBalanceEgp: 46250,
  stages: [
    { id: 'stage-sec', nameAr: 'المرحلة الثانوية', grades: ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'] },
    { id: 'stage-prep', nameAr: 'المرحلة الإعدادية', grades: ['الصف الثالث الإعدادي (علوم متقدمة)'] }
  ],
  centers: [
    { id: 'ctr-1', nameAr: 'سنتر الدقي النخبة', location: 'شارع التحرير، الدقي', studentsCount: 1250 },
    { id: 'ctr-2', nameAr: 'سنتر الرواد بمدينة نصر', location: 'شارع عباس العقاد', studentsCount: 980 },
    { id: 'ctr-3', nameAr: 'أكاديمية المتفوق الإلكترونية (أونلاين)', location: 'المنصة الرسمية', studentsCount: 1890 }
  ],
  payoutMethods: [
    { id: 'pm-1', type: 'instapay', address: 'salma-biology@instapay', isDefault: true, label: 'InstaPay (فوري)' },
    { id: 'pm-2', type: 'cib', accountNumber: '1000 4892 7812', isDefault: false, label: 'البنك التجاري الدولي (CIB)' },
    { id: 'pm-3', type: 'vodafone', phone: '01012345678', isDefault: false, label: 'محفظة فودافون كاش' }
  ]
};

export const TEACHER_COURSES = [
  {
    id: 'course-bio-301',
    title: 'Photosynthesis & Molecular Genetics Elite Program',
    titleAr: 'ماستر كلاس الأحياء: البناء الضوئي وحركية الخلية والوراثة الجزيئية',
    stage: 'المرحلة الثانوية',
    stageId: 'sec',
    gradeAr: 'الصف الثالث الثانوي',
    subjectAr: 'الأحياء',
    cover: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=80',
    priceEgp: 350,
    studentsCount: 2450,
    rating: 4.96,
    lessonsCount: 14,
    hoursTotal: '28 ساعة',
    status: 'published',
    completionRate: 88,
    revenueEgp: 857500,
    descriptionAr: 'كورس شامل يغطي تركيب البلاستيدة، التفاعلات الضوئية واللاضوئية، دورة كالفن، والبيولوجيا الجزيئية وتطبيقات الهندسة الوراثية بنظام البابل شيت الحديث.'
  },
  {
    id: 'course-bio-302',
    title: 'Final Revision & High-Yield Thanawya Question Bank',
    titleAr: 'معسكر المراجعة النهائية ومصائد امتحانات الثانوية العامة',
    stage: 'المرحلة الثانوية',
    stageId: 'sec',
    gradeAr: 'الصف الثالث الثانوي',
    subjectAr: 'الأحياء',
    cover: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=400&auto=format&fit=crop&q=80',
    priceEgp: 280,
    studentsCount: 1890,
    rating: 4.98,
    lessonsCount: 8,
    hoursTotal: '16 ساعة',
    status: 'published',
    completionRate: 94,
    revenueEgp: 529200,
    descriptionAr: 'مراجعة وحل أكثر من 1,500 سؤال بابل شيت متقدم بنظام مستويات التفكير العليا، مع تحليل وتفكيك إجابات الوزارة النموذجية.'
  },
  {
    id: 'course-bio-201',
    title: 'Human Physiology & Coordination Fundamentals',
    titleAr: 'أساسيات فسيولوجيا الإنسان والتنسيق الهرموني',
    stage: 'المرحلة الثانوية',
    stageId: 'sec',
    gradeAr: 'الصف الثاني الثانوي',
    subjectAr: 'الأحياء',
    cover: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400&auto=format&fit=crop&q=80',
    priceEgp: 250,
    studentsCount: 980,
    rating: 4.92,
    lessonsCount: 10,
    hoursTotal: '20 ساعة',
    status: 'published',
    completionRate: 82,
    revenueEgp: 245000,
    descriptionAr: 'شرح مبسط وتأسيسي لأجهزة النقل والتنفس والإخراج في الكائنات الحية وآليات الاتزان البدني والتغذية الذاتية.'
  },
  {
    id: 'course-sci-prep3',
    title: 'Advanced Prep 3 Sciences & Genetics Introduction',
    titleAr: 'العلوم المتكاملة والمدخل إلى علم الوراثة المندلية',
    stage: 'المرحلة الإعدادية',
    stageId: 'prep',
    gradeAr: 'الصف الثالث الإعدادي',
    subjectAr: 'العلوم',
    cover: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&auto=format&fit=crop&q=80',
    priceEgp: 180,
    studentsCount: 650,
    rating: 4.94,
    lessonsCount: 6,
    hoursTotal: '12 ساعة',
    status: 'published',
    completionRate: 91,
    revenueEgp: 117000,
    descriptionAr: 'تأسيس قوي لطلاب الشهادة الإعدادية في قوانين مندل والانقسام الميوزي والميتوزي تأهيلاً للثانوية العامة ومدارس المتفوقين STEM.'
  }
];

export const TEACHER_EXAMS = [
  {
    id: 'ex-bio-101',
    titleAr: 'امتحان الفصل الأول: البناء الضوئي والتنفس الخلوي الشامل',
    titleEn: 'Photosynthesis & Respiration Comprehensive Exam',
    courseId: 'course-bio-301',
    courseTitleAr: 'ماستر كلاس الأحياء (3 ثانوي)',
    questionsCount: 30,
    durationMinutes: 45,
    passScore: 60,
    fullMark: 60,
    studentsSubmitted: 2180,
    avgScore: 50.4, // 84%
    passRate: 91.5,
    status: 'active',
    dueDate: '2026-09-30',
    topScoreCount: 420, // Full mark students
    isBubbleSheet: true,
    questions: [
      {
        id: 'q-1',
        number: 1,
        questionAr: 'ما هو المانح المباشر لإلكترونات تعويض كلوروفيل (أ) في النظام الضوئي الثاني؟',
        optionsAr: ['الماء H2O', 'غاز ثاني أكسيد الكربون CO2', 'مركب NADPH', 'جزيء الجلوكوز C6H12O6'],
        correctIndex: 0,
        difficulty: 'متوسط',
        successRate: 88,
        explanationAr: 'أثبت العالم فان نيل ثم تجارب روبرت هيل أن انشطار الماء ضوئياً هو المصدر المباشر لتعويض الإلكترونات وإطلاق غاز الأكسجين.'
      },
      {
        id: 'q-2',
        number: 2,
        questionAr: 'أي من المركبات التالية يمثل أول مركب كيميائي ثابت ناتج عن التفاعلات اللاضوئية في دورة كالفن؟',
        optionsAr: ['فوسفو جليسرالدهيد (PGAL)', 'حمض الستريك', 'فوسفو إينول بيروفات', 'حمض اللاكتيك'],
        correctIndex: 0,
        difficulty: 'مباشر',
        successRate: 94,
        explanationAr: 'استخدم كالفن طحلب الكلوريلا والكربون المشع C-14 وأثبت أن مركب PGAL يتكون بعد ثانيتين فقط من التعرض للضوء.'
      },
      {
        id: 'q-3',
        number: 3,
        questionAr: 'إذا تعطل إنزيم RuBisCO في الستروما داخل البلاستيدة الخضراء، فما النتيجة الفورية المترتبة على ذلك؟',
        optionsAr: ['توقف تثبيت غاز ثاني أكسيد الكربون', 'توقف انشطار جزيء الماء', 'توقف امتصاص الضوء عبر الكلوروفيل', 'زيادة تصاعد غاز الأكسجين'],
        correctIndex: 0,
        difficulty: 'مستويات تفكير عليا',
        successRate: 64,
        explanationAr: 'إنزيم روبيسكو هو المحفز الأساسي لارتباط ثاني أكسيد الكربون بمركب ريبولوز ثنائي الفوسفات في بداية دورة كالفن.'
      }
    ]
  },
  {
    id: 'ex-bio-102',
    titleAr: 'كويز سريع: التفاعلات الضوئية وأغشية الثيلاكويد',
    titleEn: 'Quick Quiz: Light Reactions & Thylakoid',
    courseId: 'course-bio-301',
    courseTitleAr: 'ماستر كلاس الأحياء (3 ثانوي)',
    questionsCount: 10,
    durationMinutes: 15,
    passScore: 12,
    fullMark: 20,
    studentsSubmitted: 2410,
    avgScore: 17.2,
    passRate: 96.2,
    status: 'active',
    dueDate: '2026-09-25',
    topScoreCount: 780,
    isBubbleSheet: true
  },
  {
    id: 'ex-bio-103',
    titleAr: 'امتحان المحاكاة التجريبي الأول (نظام البابل شيت الوزاري 2026)',
    titleEn: 'Thanawya Mock Exam 1 (Ministry Standard)',
    courseId: 'course-bio-302',
    courseTitleAr: 'معسكر المراجعة النهائية',
    questionsCount: 46,
    durationMinutes: 90,
    passScore: 50,
    fullMark: 60,
    studentsSubmitted: 1650,
    avgScore: 47.8,
    passRate: 85.0,
    status: 'scheduled',
    dueDate: '2026-10-05',
    topScoreCount: 210,
    isBubbleSheet: true
  }
];

export const TEACHER_HOMEWORKS = [
  {
    id: 'hw-bio-01',
    titleAr: 'واجب الأسبوع 3: مقارنة التفاعلات الضوئية واللاضوئية ورسم البلاستيدة',
    courseTitleAr: 'ماستر كلاس الأحياء (3 ثانوي)',
    dueDate: '2026-09-26',
    totalAssigned: 2450,
    submittedCount: 2210,
    gradedCount: 1980,
    pendingGrading: 230,
    avgGrade: 18.4,
    maxGrade: 20,
    submissions: [
      {
        id: 'sub-1',
        studentId: 'std-omar-2026',
        studentNameAr: 'عمر طارق القاضي',
        studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        schoolAr: 'مدرسة السعيدية الثانوية العسكرية، الجيزة',
        submittedAt: '2026-09-22 18:45',
        status: 'graded',
        score: 20,
        maxScore: 20,
        feedbackAr: 'إجابة نموذجية ورائعة يا عمر! التفسير الدقيق لدور NADP+ في نقل الهيدروجين ممتاز جداً ويدل على فهم عميق.',
        attachments: ['حل_عمر_طارق_واجب3.pdf']
      },
      {
        id: 'sub-2',
        studentId: 'std-sara-01',
        studentNameAr: 'سارة خالد منصور',
        studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        schoolAr: 'مدرسة المتفوقات STEM كفر الشيخ',
        submittedAt: '2026-09-22 14:10',
        status: 'graded',
        score: 20,
        maxScore: 20,
        feedbackAr: 'تقفيل كامل كالعادة يا سارة، تنظيم الورقة واستخدام المخططات التوضيحية رائع ومبهر.',
        attachments: ['واجب_سارة_منصور_احياء.pdf']
      },
      {
        id: 'sub-3',
        studentId: 'std-khaled-02',
        studentNameAr: 'خالد عبد الرحمن النجار',
        studentAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        schoolAr: 'المنصورة العسكرية بنين',
        submittedAt: '2026-09-23 09:30',
        status: 'pending',
        score: null,
        maxScore: 20,
        feedbackAr: '',
        attachments: ['حل_خالد_النجار_احياء_الاسبوع3.pdf']
      }
    ]
  },
  {
    id: 'hw-bio-02',
    titleAr: 'واجب تطبيقي: حل مسائل ATP وحساب جزيئات الجلوكوز في دورة كالفن',
    courseTitleAr: 'ماستر كلاس الأحياء (3 ثانوي)',
    dueDate: '2026-09-29',
    totalAssigned: 2450,
    submittedCount: 1420,
    gradedCount: 950,
    pendingGrading: 470,
    avgGrade: 17.1,
    maxGrade: 20,
    submissions: []
  }
];

export const TEACHER_COURSE_LEAGUE = {
  courseId: 'course-bio-301',
  courseNameAr: 'دوري ماستر كورس الأحياء • د. سلمى السيد',
  totalCompetitors: 4120,
  seasonAr: 'الموسم الأكاديمي 2026 • الجولة الرابعة',
  weeklyXpPool: 50000,
  podium: [
    { rank: 1, nameAr: 'سارة خالد منصور', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', score: 3920, streak: 24, badge: 'بطلة الكورس 🥇', tier: 'Diamond', schoolAr: 'المتفوقات STEM كفر الشيخ' },
    { rank: 2, nameAr: 'عمر طارق القاضي', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80', score: 3450, streak: 16, badge: 'وصيف الكورس 🥈', tier: 'Diamond', schoolAr: 'السعيدية الثانوية العسكرية، الجيزة' },
    { rank: 3, nameAr: 'مريم عادل شنودة', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', score: 3280, streak: 12, badge: 'منصة التتويج 🥉', tier: 'Diamond', schoolAr: 'القومية لغات بالإسكندرية' }
  ],
  leaderboard: [
    { rank: 1, nameAr: 'سارة خالد منصور', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', score: 3920, streak: 24, badge: 'بطلة الكورس', tier: 'Diamond', schoolAr: 'المتفوقات STEM كفر الشيخ', perfectExams: 18, examsSolved: 24 },
    { rank: 2, nameAr: 'عمر طارق القاضي', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80', score: 3450, streak: 16, badge: 'وصيف الكورس', tier: 'Diamond', schoolAr: 'السعيدية الثانوية العسكرية، الجيزة', perfectExams: 16, examsSolved: 24 },
    { rank: 3, nameAr: 'مريم عادل شنودة', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', score: 3280, streak: 12, badge: 'منصة التتويج', tier: 'Diamond', schoolAr: 'القومية لغات بالإسكندرية', perfectExams: 14, examsSolved: 22 },
    { rank: 4, nameAr: 'كريم مصطفى بدوي', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', score: 2950, streak: 9, badge: 'نشط', tier: 'Gold', schoolAr: 'الأورمان النموذجية، الدقي', perfectExams: 11, examsSolved: 20 },
    { rank: 5, nameAr: 'نور الهدى عثمان', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', score: 2650, streak: 7, badge: 'مثابرة', tier: 'Gold', schoolAr: 'المنصورة الثانوية بنات', perfectExams: 9, examsSolved: 18 },
    { rank: 6, nameAr: 'زياد هشام فهمي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', score: 2510, streak: 6, badge: 'صاعد', tier: 'Gold', schoolAr: 'عباس العقاد الرسمية', perfectExams: 8, examsSolved: 17 },
    { rank: 7, nameAr: 'أحمد وائل حجازي', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', score: 2340, streak: 5, badge: 'متألق', tier: 'Silver', schoolAr: 'طنطا الثانوية بنين', perfectExams: 6, examsSolved: 15 },
    { rank: 8, nameAr: 'ياسمين حسام النجار', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', score: 2180, streak: 4, badge: 'مستمرة', tier: 'Silver', schoolAr: 'الزهراء الرسمية، أسيوط', perfectExams: 5, examsSolved: 14 }
  ]
};

export const TEACHER_ANALYTICS = {
  overallGpa: '84.5%',
  totalStudentsAudited: 4120,
  averageAttendancePct: 92.4,
  mostMissedQuestions: [
    {
      id: 'mm-1',
      questionAr: 'تأثير درجة الحرارة والضوء الحرج على نشاط إنزيم روبيسكو في تثبيت CO2',
      topicAr: 'التفاعلات اللاضوئية - دورة كالفن',
      errorRatePct: 46,
      commonMistakeAr: 'الخلط بين العوامل المحددة لسرعة التفاعلات الضوئية (الضوء) واللاضوئية (الحرارة والإنزيمات)',
      aiRecommendationAr: 'تخصيص أول 10 دقائق في المحاضرة القادمة لشرح منحنى Q10 الحراري وعلاقته بالنشاط الإنزيمي.'
    },
    {
      id: 'mm-2',
      questionAr: 'حساب عدد جزيئات ATP و NADPH اللازمة لتكوين جزيء جلوكوز واحد من PGAL',
      topicAr: 'حسابات الطاقة الكيميائية',
      errorRatePct: 38,
      commonMistakeAr: 'نسيان أن تكوين جزيء جلوكوز يتطلب دورتين كاملتين من كالفن (2 جزيء PGAL)',
      aiRecommendationAr: 'إضافة تدريب تفاعلي مصور ومسائل خطوات بالأرقام في بنك الأسئلة.'
    },
    {
      id: 'mm-3',
      questionAr: 'التفريق بين أصباغ الكلوروفيل أ، ب والكاروتين والزانثوفيل في امتصاص الأطوال الموجية',
      topicAr: 'أصباغ البلاستيدة الخضراء',
      errorRatePct: 31,
      commonMistakeAr: 'عدم تذكر نسب الأصباغ المئوية ولون كل صبغ ونطاق امتصاصه للضوء الأزرق والأحمر',
      aiRecommendationAr: 'عرض جدول مقارنة بصري في ملخص كورنيل داخل الحصة.'
    }
  ],
  atRiskStudents: [
    { id: 'std-risk-1', nameAr: 'ماجد كمال نصار', gradeAr: 'الصف الثالث الثانوي', groupAr: 'سنتر الدقي - مجموعة السبت', attendancePct: 62, avgExamScore: 48, alertReasonAr: 'غياب حصتين متتاليتين وتراجع في كويز البناء الضوئي' },
    { id: 'std-risk-2', nameAr: 'شهد علاء فاروق', gradeAr: 'الصف الثالث الثانوي', groupAr: 'أونلاين المنصة - مجموعة الأحد', attendancePct: 70, avgExamScore: 52, alertReasonAr: 'تعثر متكرر في مسائل حسابات الطاقة الكيميائية' },
    { id: 'std-risk-3', nameAr: 'كريم أشرف حلمي', gradeAr: 'الصف الثالث الثانوي', groupAr: 'سنتر مدينة نصر - مجموعة الثلاثاء', attendancePct: 58, avgExamScore: 44, alertReasonAr: 'عدم تسليم الواجب الأسبوعي للأسبوعين السابقين' }
  ]
};

export const TEACHER_CERTIFICATES = [
  {
    id: 'cert-issue-01',
    certNumber: 'MTF-BIO-2026-0891',
    studentNameAr: 'عمر طارق القاضي',
    studentEmail: 'omar.tarek@motafawweq.me',
    schoolAr: 'مدرسة السعيدية الثانوية العسكرية، الجيزة',
    courseNameAr: 'ماستر كلاس الأحياء: البناء الضوئي وحركية الطاقة',
    gradePercent: 96.5,
    honorsTitleAr: 'شهادة تميز وتفوق بالدرجة النهائية (Full Mark)',
    issueDate: '2026-09-20',
    qrCodeUrl: 'https://motafawweq.me/verify/MTF-BIO-2026-0891',
    status: 'verified'
  },
  {
    id: 'cert-issue-02',
    certNumber: 'MTF-BIO-2026-0892',
    studentNameAr: 'سارة خالد منصور',
    studentEmail: 'sara.mansour@stem.edu.eg',
    schoolAr: 'مدرسة المتفوقات STEM كفر الشيخ',
    courseNameAr: 'ماستر كلاس الأحياء: البناء الضوئي وحركية الطاقة',
    gradePercent: 99.0,
    honorsTitleAr: 'شهادة صدارة وبطلة الدوري الأكاديمي',
    issueDate: '2026-09-20',
    qrCodeUrl: 'https://motafawweq.me/verify/MTF-BIO-2026-0892',
    status: 'verified'
  },
  {
    id: 'cert-issue-03',
    certNumber: 'MTF-BIO-2026-0893',
    studentNameAr: 'مريم عادل شنودة',
    studentEmail: 'mariam.adel@gmail.com',
    schoolAr: 'القومية لغات بالإسكندرية',
    courseNameAr: 'ماستر كلاس الأحياء: البناء الضوئي وحركية الطاقة',
    gradePercent: 94.0,
    honorsTitleAr: 'شهادة إتمام الكورس بمرتبة الشرف',
    issueDate: '2026-09-21',
    qrCodeUrl: 'https://motafawweq.me/verify/MTF-BIO-2026-0893',
    status: 'verified'
  }
];
