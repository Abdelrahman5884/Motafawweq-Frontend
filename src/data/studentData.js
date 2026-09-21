// Motafawweq Student Mock Engine & Comprehensive Curriculum Data

export const STUDENT_PROFILE = {
  id: 'std-omar-2026',
  name: 'Omar Tarek El-Kady',
  nameAr: 'عمر طارق القاضي',
  gradeId: 'sec-3',
  gradeName: '3rd Secondary (Thanawya Amma)',
  gradeNameAr: 'الصف الثالث الثانوي (الثانوية العامة)',
  track: 'Scientific - Biology Track',
  trackAr: 'شعبة علمي علوم',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  email: 'omar.tarek@motafawweq.me',
  phone: '+20 102 458 9912',
  parentPhone: '+20 100 123 4567',
  school: 'El-Saidia Secondary School, Giza',
  schoolAr: 'مدرسة السعيدية الثانوية العسكرية، الجيزة',
  center: 'Dokki Elite Center & Online',
  centerAr: 'سنتر الدقي النخبة والمنصة الإلكترونية',
  xp: 3450,
  level: 9,
  levelTitle: 'Senior Scholar',
  levelTitleAr: 'متفوّق عبقري',
  streakDays: 16,
  examStreak: 8,
  studyMinutesToday: 55,
  dailyGoalMinutes: 60,
  completedLessonsCount: 42,
  totalEnrolledLessons: 68,
  overallGpa: '94.6%',
  referralCode: 'OMAR-TOP2026',
  referralBonusEgp: 150
};

export const SUBJECTS_LIST = [
  { id: 'sub-bio', name: 'Biology', nameAr: 'الأحياء', icon: 'Dna', color: '#10B981', count: 6 },
  { id: 'sub-phy', name: 'Physics', nameAr: 'الفيزياء', icon: 'Zap', color: '#06B6D4', count: 5 },
  { id: 'sub-chem', name: 'Chemistry', nameAr: 'الكيمياء', icon: 'FlaskConical', color: '#0284C7', count: 5 },
  { id: 'sub-ar', name: 'Arabic Language', nameAr: 'اللغة العربية والبلاغة', icon: 'BookOpen', color: '#F59E0B', count: 8 },
  { id: 'sub-math', name: 'Pure & Applied Math', nameAr: 'الرياضيات التطبيقية والبحته', icon: 'Compass', color: '#EC4899', count: 7 },
  { id: 'sub-en', name: 'English First Language', nameAr: 'اللغة الإنجليزية المتقدمة', icon: 'Globe', color: '#3B82F6', count: 4 }
];

export const COURSES_CATALOG = [
  {
    id: 'course-bio-301',
    title: 'Photosynthesis & Molecular Genetics Elite Program',
    titleAr: 'ماستر كلاس الأحياء: البناء الضوئي وحركية الخلية والوراثة الجزيئية',
    subjectId: 'sub-bio',
    subjectAr: 'الأحياء',
    grade: '3rd Secondary',
    gradeAr: 'الصف الثالث الثانوي',
    teacher: {
      id: 'tch-salma',
      name: 'Dr. Salma El-Sayed',
      nameAr: 'د. سلمى السيد',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      titleAr: 'كبير معلمي الأحياء ومؤلفة سلسلة المتفوق',
      rating: 4.96,
      studentsCount: 4120
    },
    cover: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
    lessonsCount: 18,
    durationHours: '32 ساعة',
    priceEgp: 450,
    isEnrolled: true,
    progressPercent: 78,
    lastLessonId: 'les-bio-301',
    lastLessonTitleAr: 'البناء الضوئي وحركية الطاقة في الخلايا النباتية',
    lastLessonSeconds: 320,
    lastLessonTimeFormatted: '05:20',
    descriptionAr: 'شرح تفكيكي عميق لمنهج الأحياء للثانوية العامة طبقاً لنظام البابل شيت ومخرجات التعلم الحديثة، متضمناً تدريبات على كل مخرجات الفهم والتحليل.',
    attachmentsCount: 14,
    rating: 4.97,
    reviewsCount: 680,
    tags: ['أحياء 3 ثانوي', 'تفاعلي', 'شرح + حل بابل شيت']
  },
  {
    id: 'course-phy-302',
    title: 'Modern Physics & Kirchhoff Electrical Circuits Mastery',
    titleAr: 'دورة الفيزياء الحديثة وقوانين كيرشوف والدينامو الكهربي',
    subjectId: 'sub-phy',
    subjectAr: 'الفيزياء',
    grade: '3rd Secondary',
    gradeAr: 'الصف الثالث الثانوي',
    teacher: {
      id: 'tch-hany',
      name: 'Dr. Hany El-Shennawy',
      nameAr: 'د. هاني الشناوي',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      titleAr: 'خبير تدريس الفيزياء والمسابقات الأولمبية',
      rating: 4.92,
      studentsCount: 3890
    },
    cover: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80',
    lessonsCount: 22,
    durationHours: '40 ساعة',
    priceEgp: 500,
    isEnrolled: true,
    progressPercent: 62,
    lastLessonId: 'les-phy-201',
    lastLessonTitleAr: 'دوائر التيار المتردد وتطبيقات الحث الكهرومغناطيسي',
    lastLessonSeconds: 480,
    lastLessonTimeFormatted: '08:00',
    descriptionAr: 'تحليل دقيق لأصعب أفكار الفيزياء للثانوية العامة وربطها بالتجارب المعملية الرقمية مع بنك أسئلة الوزارة الاسترشادية.',
    attachmentsCount: 20,
    rating: 4.94,
    reviewsCount: 520,
    tags: ['فيزياء 3 ثانوي', 'بنك أفكار عليا']
  },
  {
    id: 'course-chem-303',
    title: 'Organic Chemistry & Transition Metals Deep Dive',
    titleAr: 'معسكر الكيمياء العضوية والعناصر الانتقالية المتقدم',
    subjectId: 'sub-chem',
    subjectAr: 'الكيمياء',
    grade: '3rd Secondary',
    gradeAr: 'الصف الثالث الثانوي',
    teacher: {
      id: 'tch-rady',
      name: 'Mr. Mahmoud Rady',
      nameAr: 'أ. محمود راضي',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      titleAr: 'أستاذ الكيمياء بمدارس المتفوقين STEM',
      rating: 4.89,
      studentsCount: 2950
    },
    cover: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&auto=format&fit=crop&q=80',
    lessonsCount: 16,
    durationHours: '28 ساعة',
    priceEgp: 420,
    isEnrolled: false,
    progressPercent: 0,
    descriptionAr: 'فك شفرات الكيمياء العضوية وتفاعلات البلمرة والألكانات والألكينات، مع مخططات ذهنية لربط جميع التفاعلات في ورقة واحدة.',
    attachmentsCount: 12,
    rating: 4.91,
    reviewsCount: 380,
    tags: ['كيمياء عضوية', 'STEM']
  },
  {
    id: 'course-ar-304',
    title: 'Arabic Comprehensive Syntax, Rhetoric & Text Analysis',
    titleAr: 'موسوعة النحو والبلاغة والنصوص المتحررة للثانوية العامة',
    subjectId: 'sub-ar',
    subjectAr: 'اللغة العربية والبلاغة',
    grade: '3rd Secondary',
    gradeAr: 'الصف الثالث الثانوي',
    teacher: {
      id: 'tch-essam',
      name: 'Prof. Ahmed Essam',
      nameAr: 'أ. أحمد عصام',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      titleAr: 'كبير موجهي اللغة العربية ومعد البرامج التعليمية',
      rating: 4.95,
      studentsCount: 5200
    },
    cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    lessonsCount: 24,
    durationHours: '45 ساعة',
    priceEgp: 400,
    isEnrolled: true,
    progressPercent: 85,
    lastLessonId: 'les-ar-101',
    lastLessonTitleAr: 'إعراب الفعل المضارع وإعمال المشتقات في النحو',
    lastLessonSeconds: 210,
    lastLessonTimeFormatted: '03:30',
    descriptionAr: 'شرح شامل ومبسط لقواعد النحو كاملة، وأسرار البلاغة والتذوق الأدبي، وحل مئات القطع المتحررة.',
    attachmentsCount: 25,
    rating: 4.98,
    reviewsCount: 890,
    tags: ['لغة عربية', 'نحو وبلاغة']
  }
];

export const MINISTRY_CURRICULUM = [
  {
    id: 'min-bio-3',
    titleAr: 'الأحياء - الصف الثالث الثانوي',
    subjectAr: 'الأحياء',
    subjectId: 'sub-bio',
    gradeAr: 'الثانوية العامة (شعبة علمي علوم)',
    sourceAr: 'وزارة التربية والتعليم والتعليم الفني',
    unitsCount: 4,
    chaptersCount: 12,
    progressPercent: 78,
    activeUnitAr: 'الوحدة الأولى: التركيب والوظيفة في الكائنات الحية',
    topics: ['الدعامة والحركة', 'التنسيق الهرموني', 'التكاثر في الكائنات الحية', 'المناعة والبيولوجيا الجزيئية'],
    hasTextbookPdf: true,
    hasQuestionBank: true,
    cover: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'min-phy-3',
    titleAr: 'الفيزياء - الصف الثالث الثانوي',
    subjectAr: 'الفيزياء',
    subjectId: 'sub-phy',
    gradeAr: 'الثانوية العامة (علمي علوم وعلمي رياضة)',
    sourceAr: 'وزارة التربية والتعليم والتعليم الفني',
    unitsCount: 4,
    chaptersCount: 14,
    progressPercent: 64,
    activeUnitAr: 'الوحدة الأولى: التيار الكهربي وقانون أوم وقوانين كيرشوف',
    topics: ['التيار الكهربي وقانون أوم', 'التأثير المغناطيسي وأجهزة القياس', 'الحث الكهرومغناطيسي', 'مقدمة في الفيزياء الحديثة'],
    hasTextbookPdf: true,
    hasQuestionBank: true,
    cover: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'min-chem-3',
    titleAr: 'الكيمياء - الصف الثالث الثانوي',
    subjectAr: 'الكيمياء',
    subjectId: 'sub-chem',
    gradeAr: 'الثانوية العامة (علمي علوم وعلمي رياضة)',
    sourceAr: 'وزارة التربية والتعليم والتعليم الفني',
    unitsCount: 5,
    chaptersCount: 15,
    progressPercent: 50,
    activeUnitAr: 'الباب الأول: العناصر الانتقالية والسلسلة الانتقالية الأولى',
    topics: ['العناصر الانتقالية', 'التحليل الكيميائي الوصفي والكمي', 'الاتزان الكيميائي والأيوني', 'الكيمياء الكهربية والخلايا الجلفانية', 'الكيمياء العضوية'],
    hasTextbookPdf: true,
    hasQuestionBank: true,
    cover: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'min-ar-3',
    titleAr: 'اللغة العربية - الصف الثالث الثانوي',
    subjectAr: 'اللغة العربية',
    subjectId: 'sub-ar',
    gradeAr: 'الثانوية العامة (كافة الشعب)',
    sourceAr: 'وزارة التربية والتعليم والتعليم الفني',
    unitsCount: 7,
    chaptersCount: 22,
    progressPercent: 82,
    activeUnitAr: 'الوحدة الثانية: المشتقات وإعمالها والمصادر في النحو',
    topics: ['قواعد النحو العربي السبع', 'البلاغة والتذوق الأدبي', 'النصوص الشعرية والنثرية المتحررة', 'الأدب والمدارس الشعرية', 'التعبير والقراءة المتحررة'],
    hasTextbookPdf: true,
    hasQuestionBank: true,
    cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80'
  }
];

export const TODAY_TASKS = [
  {
    id: 'task-1',
    type: 'lesson',
    titleAr: 'استكمال سماع حصة البناء الضوئي (الفصل 2: التفاعلات الضوئية)',
    subjectAr: 'الأحياء',
    duration: '25 دقيقة',
    icon: 'Play',
    status: 'in_progress',
    actionRoute: '/student/lesson',
    deadline: 'اليوم 8:00 مساءً',
    priority: 'high'
  },
  {
    id: 'task-2',
    type: 'homework',
    titleAr: 'تسليم واجب التفاعلات الكيميائية وانشطار الماء (10 أسئلة مقالية)',
    subjectAr: 'الأحياء',
    duration: '30 دقيقة',
    icon: 'FileText',
    status: 'pending',
    actionRoute: '/student/homework',
    deadline: 'الليلة قبل 11:59 مساءً',
    priority: 'urgent'
  },
  {
    id: 'task-3',
    type: 'quiz',
    titleAr: 'كويز سريع: فحص فهم نواتج دورة كالفن ومركب PGAL',
    subjectAr: 'الأحياء',
    duration: '10 دقائق',
    icon: 'Sparkles',
    status: 'pending',
    actionRoute: '/student/quiz',
    deadline: 'غداً 4:00 عصراً',
    priority: 'medium'
  }
];

export const UPCOMING_EXAMS = [
  {
    id: 'exam-bio-final1',
    titleAr: 'امتحان نصف الفصل الدراسي في الأحياء (شامل الوحدة الأولى)',
    subjectAr: 'الأحياء',
    subjectId: 'sub-bio',
    subjectIcon: 'Dna',
    subjectColor: '#10B981',
    teacherNameAr: 'د. سلمى السيد',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    date: 'الأحد القادم',
    time: '06:00 مساءً',
    durationMinutes: 45,
    questionsCount: 25,
    maxScore: 60,
    passingScore: 36,
    attemptsAllowed: 2,
    attemptsUsed: 0,
    status: 'ready',
    typeAr: 'بابل شيت رسمي',
    difficultyAr: 'مستوى متقدم',
    cover: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'exam-phy-weekly2',
    titleAr: 'امتحان كيرشوف والدوائر المعقدة الأسبوعي',
    subjectAr: 'الفيزياء',
    subjectId: 'sub-phy',
    subjectIcon: 'Zap',
    subjectColor: '#06B6D4',
    teacherNameAr: 'د. هاني الشناوي',
    teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    date: 'الثلاثاء القادم',
    time: '07:30 مساءً',
    durationMinutes: 35,
    questionsCount: 20,
    maxScore: 50,
    passingScore: 30,
    attemptsAllowed: 1,
    attemptsUsed: 0,
    status: 'ready',
    typeAr: 'اختبار دوري تقييمي',
    difficultyAr: 'مستوى التحدي',
    cover: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'exam-chem-unit2',
    titleAr: 'اختبار الاتزان الكيميائي والعوامل المؤثرة على لوشاتيليه',
    subjectAr: 'الكيمياء',
    subjectId: 'sub-chem',
    subjectIcon: 'FlaskConical',
    subjectColor: '#0284C7',
    teacherNameAr: 'أ. محمود الكردي',
    teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    date: 'الخميس القادم',
    time: '05:00 مساءً',
    durationMinutes: 40,
    questionsCount: 20,
    maxScore: 50,
    passingScore: 30,
    attemptsAllowed: 2,
    attemptsUsed: 0,
    status: 'ready',
    typeAr: 'بابل شيت تفاعلي',
    difficultyAr: 'مستوى متوسط',
    cover: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'exam-ar-grammar1',
    titleAr: 'امتحان النحو الشامل: المشتقات وإعراب المصادر والممنوع من الصرف',
    subjectAr: 'اللغة العربية',
    subjectId: 'sub-ar',
    subjectIcon: 'BookOpen',
    subjectColor: '#F59E0B',
    teacherNameAr: 'د. وليد محسن',
    teacherAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    date: 'السبت القادم',
    time: '08:00 مساءً',
    durationMinutes: 50,
    questionsCount: 30,
    maxScore: 80,
    passingScore: 48,
    attemptsAllowed: 1,
    attemptsUsed: 0,
    status: 'upcoming',
    typeAr: 'محاكاة الامتحان الوزاري',
    difficultyAr: 'مستوى فائق',
    cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&auto=format&fit=crop&q=80'
  }
];

export const HOMEWORK_LIST = [
  {
    id: 'hw-bio-01',
    titleAr: 'واجب تطبيق انشطار الماء ومعادلة فان نيل بالأكسجين المشع',
    courseId: 'course-bio-301',
    subjectAr: 'الأحياء',
    teacherNameAr: 'د. سلمى السيد',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80',
    deadline: '2026-09-19 23:59',
    deadlineTextAr: 'ينتهي اليوم خلال 6 ساعات',
    status: 'pending', // 'pending' | 'submitted' | 'graded'
    questionsCount: 6,
    maxScore: 20,
    earnedScore: null,
    submissionText: '',
    submittedFileUrl: null,
    teacherFeedbackAr: '',
    instructionsAr: 'قم بحل المسائل في كشكولك وتصوير الحل أو كتابة التحليل العلمي لخطوات تفاعل الضوء في خانة الإجابة، مع ذكر دور مركب NADPH.',
    teacherAttachmentPdf: {
      fileName: 'شيت-واجب-الأحياء-انشطار-الماء-د-سلمى.pdf',
      fileSize: '2.4 MB',
      pagesCount: 3,
      previewQuestions: [
        'السؤال الأول: فسر تجربة فان نيل وأثر نظير الأكسجين O18 على معادلة البناء الضوئي.',
        'السؤال الثاني: ما هو مصير جزيئات PGAL المتكونة بعد ثانيتين من التعريض للضوء في طحلب الكلوريلا؟',
        'السؤال الثالث: وضح برسم تخطيطي مبسط مسار الإلكترونات في الفسفرة الضوئية.'
      ]
    }
  },
  {
    id: 'hw-phy-01',
    titleAr: 'مسائل قوانين كيرشوف المعقدة وحسابات الجهد بالمسارات المغلقة',
    courseId: 'course-phy-302',
    subjectAr: 'الفيزياء',
    teacherNameAr: 'د. هاني الشناوي',
    teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
    deadline: '2026-09-22 18:00',
    deadlineTextAr: 'باقي 3 أيام',
    status: 'pending',
    questionsCount: 5,
    maxScore: 25,
    earnedScore: null,
    submissionText: '',
    submittedFileUrl: null,
    teacherFeedbackAr: '',
    instructionsAr: 'طبق القانون الأول على العقدة (A) والقانون الثاني على الحلقتين (I) و (II) وأوجد شدة التيارات المارة في كل فرع بدقة.',
    teacherAttachmentPdf: {
      fileName: 'مسائل-كيرشوف-المعقدة-نماذج-الوزارة-د-هاني.pdf',
      fileSize: '3.8 MB',
      pagesCount: 4,
      previewQuestions: [
        'المسألة الأولى: في الدائرة الكهربية الموضحة بالرسم، احسب فرق الجهد بين النقطتين (A) و (B).',
        'المسألة الثانية: أوجد القوة الدافعة الكهربية للبطارية المجهولة بتطبيق قانون كيرشوف الثاني في المسار المغلق.',
        'المسألة الثالثة: احسب القدرة المستهلكة في المقاومة 4 أوم.'
      ]
    }
  },
  {
    id: 'hw-bio-02',
    titleAr: 'واجب مقارنة أقراص الثيلاكويد بالستروما ومسارات الطاقة',
    courseId: 'course-bio-301',
    subjectAr: 'الأحياء',
    teacherNameAr: 'د. سلمى السيد',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80',
    deadline: '2026-09-15 23:59',
    deadlineTextAr: 'تم التسليم والتصحيح',
    status: 'graded',
    questionsCount: 8,
    maxScore: 20,
    earnedScore: 19,
    submissionText: 'تم شرح دور التفاعلات الضوئية بدقة وإرفاق الرسم البياني لامتصاص أطياف الضوء ودور حاملات الطاقة ATP و NADPH.',
    submittedFileUrl: 'حل-واجب-عمر-طارق-الأحياء.pdf',
    teacherFeedbackAr: 'إجابة نموذجية ومبهرة يا عمر! تحليلك لدور إنزيم روبيسكو واختزال CO2 في الستروما دقيق جداً ويدل على فهم عميق. تم منحك 19 من 20.',
    gradedDate: '2026-09-16',
    teacherAttachmentPdf: {
      fileName: 'ورقة-أسئلة-الثيلاكويد-والستروما.pdf',
      fileSize: '1.9 MB',
      pagesCount: 2,
      previewQuestions: [
        'قارن في جدول بين التفاعلات الضوئية واللاضوئية من حيث مكان الحدوث والنواتج.',
        'ما الدور الفسيولوجي لصبغة الزانثوفيل والكاروتين في توجيه الطاقة الضوئية؟'
      ]
    }
  },
  {
    id: 'hw-chem-01',
    titleAr: 'تطبيقات قاعدة لوشاتيليه ومسائل ثابت الاتزان Kc و Kp',
    courseId: 'course-chem-303',
    subjectAr: 'الكيمياء',
    teacherNameAr: 'أ. محمود راضي',
    teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
    deadline: '2026-09-20 20:00',
    deadlineTextAr: 'تم التسليم • بانتظار التصحيح',
    status: 'submitted',
    questionsCount: 6,
    maxScore: 20,
    earnedScore: null,
    submissionText: 'تم حساب قيمة ثابت الاتزان بدقة مع رسم المنحنيات البيانية لتأثير زيادة الضغط على موضع الاتزان.',
    submittedFileUrl: 'حل-مسائل-الاتزان-الكيميائي.pdf',
    teacherFeedbackAr: 'الواجب قيد المراجعة بواسطة أ. محمود راضي.',
    teacherAttachmentPdf: {
      fileName: 'تدريبات-الاتزان-الكيميائي-أ-محمود-راضي.pdf',
      fileSize: '2.1 MB',
      pagesCount: 3,
      previewQuestions: [
        'المسألة الأولى: احسب قيمة Kc للتفاعل الغازي عند درجة حرارة 400 كلفن.',
        'المسألة الثانية: وضح أثر إضافة عامل حفاز على موضع الاتزان وقيمة ثابت الاتزان.'
      ]
    }
  }
];

// Competitive League (دوري المتفوقين)
export const LEAGUE_LEADERBOARD = [
  { rank: 1, nameAr: 'سارة خالد منصور', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', score: 3920, streak: 24, badge: 'بطلة الأسبوع', tier: 'Diamond', schoolAr: 'المتفوقات STEM كفر الشيخ', perfectQuizzes: 14, change: 0 },
  { rank: 2, nameAr: 'عمر طارق القاضي (أنت)', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80', score: 3450, streak: 16, badge: 'صاعد بقوة', tier: 'Diamond', isMe: true, schoolAr: 'السعيدية الثانوية العسكرية، الجيزة', perfectQuizzes: 11, change: 2 },
  { rank: 3, nameAr: 'مريم عادل شنودة', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80', score: 3280, streak: 12, badge: 'متفوقة', tier: 'Diamond', schoolAr: 'القومية لغات بالإسكندرية', perfectQuizzes: 9, change: -1 },
  { rank: 4, nameAr: 'كريم مصطفى بدوي', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80', score: 2950, streak: 9, badge: 'مثابر', tier: 'Gold', schoolAr: 'الأورمان النموذجية، الدقي', perfectQuizzes: 7, change: 1 },
  { rank: 5, nameAr: 'زياد هشام فهمي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', score: 2710, streak: 7, badge: 'نشط', tier: 'Gold', schoolAr: 'عباس العقاد الرسمية، مدينة نصر', perfectQuizzes: 6, change: 3 },
  { rank: 6, nameAr: 'نور الهدى عثمان', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80', score: 2540, streak: 6, badge: 'دقيقة', tier: 'Gold', schoolAr: 'المنصورة الثانوية بنات', perfectQuizzes: 5, change: -2 },
  { rank: 7, nameAr: 'أحمد وائل حجازي', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80', score: 2390, streak: 5, badge: 'متألق', tier: 'Silver', schoolAr: 'طنطا الثانوية بنين', perfectQuizzes: 4, change: 1 },
  { rank: 8, nameAr: 'ياسمين حسام النجار', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80', score: 2210, streak: 4, badge: 'صاعدة', tier: 'Silver', schoolAr: 'الزهراء الرسمية، أسيوط', perfectQuizzes: 3, change: 0 }
];

export const LEAGUE_TIERS = [
  { id: 'Diamond', nameAr: 'دوري النخبة الماسي', color: '#1588C7', minScore: 3000, descriptionAr: 'أقوى 5% من طلاب الثانوية العامة على مستوى الجمهورية' },
  { id: 'Gold', nameAr: 'الدوري الذهبي', color: '#F59E0B', minScore: 2500, descriptionAr: 'المنافسة على بطاقات التأهل لدوري النخبة' },
  { id: 'Silver', nameAr: 'الدوري الفضي', color: '#64748B', minScore: 1800, descriptionAr: 'مرحلة حصد النقاط وتثبيت الاستريك الأسبوعي' }
];

export const LEAGUE_RULES = [
  {
    titleAr: 'سؤال الاختيار من متعدد: نقطة واحدة',
    descAr: 'تحصل على نقطة واحدة (1 pt) عن كل إجابة صحيحة في أي سؤال اختيار من متعدد.'
  },
  {
    titleAr: 'تقفيل الامتحان: 3 نقاط إضافية',
    descAr: 'عند إحراز الدرجة النهائية كاملة (100%) في أي اختبار تحصل على 3 نقاط بونص للتقفيل.'
  },
  {
    titleAr: 'استريك المذاكرة: نقطة يومياً',
    descAr: 'الحفاظ على الاستريك اليومي يمنحك نقطة إضافية تضاف إلى رصيدك عن كل يوم متواصل.'
  }
];

export const LEAGUE_PRIZES = [
  { rankAr: 'المركز الأول', titleAr: 'درع المتفوق الذهبي + اشتراك مجاني كامل للشهر التالي + جلسة توجيه فردية مع كبار الأساتذة' },
  { rankAr: 'المركز الثاني', titleAr: 'وسام التميز الفضي + خصم 50% على جميع باقات المراجعة النهائية والكتب الرقمية' },
  { rankAr: 'المركز الثالث', titleAr: 'وسام التفوق البرونزي + شارة حصرية في الملف الشخصي وباقة بنوك الأسئلة الوزارية' },
  { rankAr: 'المراكز 4 إلى 10', titleAr: 'شهادات تفوق وتقدير رقمية معتمدة قابلة للتحميل والطباعة فوراً' }
];

export const AI_LECTURE_QUESTIONS_BANK = [
  {
    id: 'ai-gen-1',
    questionAr: 'طبقاً للتفريغ الصوتي للمحاضرة: ما هو المستقبل النهائي للإلكترونات في التفاعلات الضوئية للبناء الضوئي؟',
    optionsAr: [
      'جزيئات الماء (H2O)',
      'مستقبل الإنزيم المساعد NADP+ ليتحول إلى NADPH',
      'غاز ثاني أكسيد الكربون (CO2) في الستروما',
      'مركب ثنائي فوسفات الأدينوزين (ADP)'
    ],
    correctIndex: 1,
    explanationAr: 'ذكرت د. سلمى في الدقيقة 14:15 أن NADP+ هو المستقبل النهائي للإلكترونات والبروتونات الناتجة من انشطار جزيء الماء داخل أغشية الثيلاكويد لمنع هدر الطاقة.',
    conceptId: 'nadp-electron-acceptor'
  },
  {
    id: 'ai-gen-2',
    questionAr: 'من تفريغ تجربة كالفن الإشعاعية: لماذا استخدم كالفن طحلب الكلوريلا بالتحديد في اختباره؟',
    optionsAr: [
      'لأنه كائن وحيد الخلية سريع البناء الضوئي ويسهل التحكم في بيئته وتعريضه للضوء بدقة',
      'لأنه لا يحتاج إلى غاز ثاني أكسيد الكربون إطلاقاً',
      'لأنه ينتج غاز الأكسجين في الظلام فقط دون الضوء',
      'لأن جدار خلويته مصنوع من الجلوكوز النقي'
    ],
    correctIndex: 0,
    explanationAr: 'طحلب الكلوريلا الأخضر وحيد الخلية هو النموذج المثالي للتجارب السريعة لدراسة مسار الكربون المشع C14 أثناء الثواني الأولى من التفاعلات الكيميائية.',
    conceptId: 'chlorella-calvin'
  },
  {
    id: 'ai-gen-3',
    questionAr: 'حسابياً: كم دورة كالفن كاملة وكم جزيء CO2 يلزم لتكوين جزيء واحد من الجلوكوز؟',
    optionsAr: [
      'دورة واحدة و 3 جزيئات CO2',
      'دورتان و 6 جزيئات CO2 (تثبيت 6 جزيئات كربون)',
      '4 دورات و 12 جزيء CO2',
      '6 دورات و جزيء واحد CO2'
    ],
    correctIndex: 1,
    explanationAr: 'لتكوين جزيء جلوكوز واحد سداسي الكربون (C6H12O6)، يلزم تثبيت 6 جزيئات CO2 من خلال دورتين كاملتين لمسار كالفن لإنتاج جزيئي PGAL.',
    conceptId: 'calvin-stoichiometry'
  },
  {
    id: 'ai-gen-4',
    questionAr: 'ما العامل المحدد الأساسي لسرعة التفاعلات اللاضوئية (تفاعلات الستروما والإنزيمات)؟',
    optionsAr: [
      'شدة الضوء وحدها',
      'درجة الحرارة لأنها تفاعلات إنزيمية حساسة للحرارة',
      'كمية الماء الممتصة من التربة فقط',
      'سمك الغشاء المزدوج للبلاستيدة'
    ],
    correctIndex: 1,
    explanationAr: 'التفاعلات اللاضوئية تعتمد كلياً على نشاط الإنزيمات في الستروما (مثل إنزيم الروبيسكو)، وبالتالي تعتبر درجة الحرارة هي العامل المحدد لسرعتها.',
    conceptId: 'temp-enzymes-stroma'
  }
];


// Mistake Bank (بنك الأسئلة الخاطئة للمراجعة)
export const MISTAKE_BANK = [
  {
    id: 'mistake-1',
    subjectAr: 'الأحياء',
    lessonTitleAr: 'البناء الضوئي وحركية الطاقة في الخلايا النباتية',
    topicAr: 'دورة كالفن والتفاعلات اللاضوئية',
    questionAr: 'هل يمكن لدورة كالفن الاستمرار في العمل بكفاءة داخل ظلام دامس لمدة 48 ساعة؟',
    wrongAnswerGivenAr: 'نعم — لأنها تسمى تفاعلات لاضوئية ولا تتطلب الضوء.',
    correctAnswerAr: 'خطأ — لأنها تتوقف سريعاً بمجرد نفاد مخزون مركبَي الطاقة التثبيتية ATP و NADPH الناتجة في الضوء.',
    explanationAr: 'على الرغم من أن إنزيمات دورة كالفن لا تحتاج فوتونات الضوء مباشرة، إلا أنها تشترط توافر الـ ATP والـ NADPH، ومع استمرار الظلام ينفد المخزون وتتوقف الدورة تماماً.',
    examSourceAr: 'كويز الحصة 1',
    solvedCorrectlyNow: false
  },
  {
    id: 'mistake-2',
    subjectAr: 'الأحياء',
    lessonTitleAr: 'البناء الضوئي وحركية الطاقة في الخلايا النباتية',
    topicAr: 'حسابات طاقة مركب PGAL',
    questionAr: 'كم عدد جزيئات فوسفو جليسرالدهيد PGAL اللازمة لبناء جزيء واحد كامل من سكر الجلوكوز C6H12O6؟',
    wrongAnswerGivenAr: 'جزيء واحد PGAL',
    correctAnswerAr: 'جزيئان اثنان (2 molecules)',
    explanationAr: 'مركب PGAL ثلاثي الكربون (3C)، والجلوكوز سداسي الكربون (6C)، لذا يلزم اتحاد جزيئين PGAL لتخليق جزيء جلوكوز.',
    examSourceAr: 'اختبار نصف الشهر',
    solvedCorrectlyNow: false
  },
  {
    id: 'mistake-3',
    subjectAr: 'الفيزياء',
    lessonTitleAr: 'قوانين كيرشوف والدوائر الكهربائية',
    topicAr: 'إشارة القوة الدافعة الكهربية VB',
    questionAr: 'عند تتبع مسار مغلق من القطب السالب إلى القطب الموجب داخل البطارية، ما إشارة الـ VB؟',
    wrongAnswerGivenAr: 'سالبة (-VB)',
    correctAnswerAr: 'موجبة (+VB)',
    explanationAr: 'الانتقال من السالب إلى الموجب يعتبر زيادة في الجهد الكهربي وبالتالي تأخذ القوة الدافعة إشارة موجبة (+VB) في معادلة كيرشوف الثانية.',
    examSourceAr: 'امتحان فيزياء أسبوعي 2',
    solvedCorrectlyNow: true
  }
];

// 52-Week GitHub-style Activity Matrix generator
export const generateActivityStreakGrid = () => {
  const weeks = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  // 52 weeks x 7 days
  for (let w = 51; w >= 0; w--) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      
      // Activity intensity (0 to 4)
      const dayRand = (Math.sin(w * 3 + d * 5) + 1) / 2;
      let level = 0;
      let minutes = 0;
      let quizzes = 0;
      
      // Make recent 16 days high streak
      if (w <= 2) {
        level = Math.floor(Math.random() * 2) + 3; // 3 or 4
        minutes = 45 + Math.floor(Math.random() * 40);
        quizzes = 1 + Math.floor(Math.random() * 3);
      } else if (dayRand > 0.4) {
        level = Math.floor(dayRand * 4) + 1;
        minutes = level * 25;
        quizzes = level > 2 ? 1 : 0;
      }

      days.push({
        date: date.toISOString().split('T')[0],
        dayName: daysOfWeek[d],
        level: Math.min(level, 4),
        minutes,
        quizzes
      });
    }
    weeks.push(days);
  }
  return weeks;
};

export const STUDENT_BADGES = [
  { id: 'b1', titleAr: 'سيد البناء الضوئي', descAr: 'إتقان جميع مفاهيم النبات بدرجة 90%+', unlocked: true, icon: 'Dna', date: '2026-09-12' },
  { id: 'b2', titleAr: 'شعلة الالتزام (16 يوم)', descAr: 'المذاكرة المتواصلة دون انقطاع', unlocked: true, icon: 'Flame', date: '2026-09-18' },
  { id: 'b3', titleAr: 'قناص الامتحانات', descAr: 'الحصول على الدرجة النهائية في 3 اختبارات', unlocked: true, icon: 'Target', date: '2026-09-08' },
  { id: 'b4', titleAr: 'صائد الأخطاء', descAr: 'حل 15 سؤالاً من بنك الأخطاء وتصحيحها', unlocked: true, icon: 'Shield', date: '2026-09-14' },
  { id: 'b5', titleAr: 'بطل دوري النخبة', descAr: 'الوصول لقائمة أفضل 3 طلاب على مستوى الجمهورية', unlocked: true, icon: 'Trophy', date: '2026-09-17' },
  { id: 'b6', titleAr: 'عبقري الذكاء الاصطناعي', descAr: 'توليد 10 كويزات ذكية من المحاضرات الصوتية', unlocked: false, icon: 'Brain', date: null }
];

export const CERTIFICATES_LIST = [
  {
    id: 'cert-math-ministry-2026',
    issuerType: 'ministry', // 'ministry' | 'teacher' | 'league'
    category: 'ministry',
    issuerNameAr: 'منصة متفوّق التعليمية (منهج وزارة التربية والتعليم)',
    issuerNameEn: 'Motafawweq Platform (Ministry of Education Curriculum)',
    instructorTitleAr: 'قسم التوجيه والامتحانات الرسمية لوزارة التربية والتعليم',
    instructorTitleEn: 'Official Ministry Assessments & Guidance Division',
    titleAr: 'شهادة إنجاز وتفوق أكاديمي',
    titleEn: 'Certificate of Academic Excellence',
    subtitleAr: 'شهادة إتمام المادة والامتحانات الرسمية لوزارة التربية والتعليم',
    subtitleEn: 'Official Ministry of Education Subject Completion & Assessments',
    courseNameAr: 'الرياضيات للصف الثالث الثانوي',
    courseNameEn: 'Mathematics - 3rd Secondary (Thanawya Amma)',
    studentNameAr: 'عبدالرحمن حسن',
    studentNameEn: 'Abdulrahman Hassan',
    gradeAr: 'الصف الثالث الثانوي 2026',
    gradeEn: 'Grade 12 (Thanawya Amma) 2026',
    completionDate: '15 سبتمبر 2026',
    completionDateEn: 'September 15, 2026',
    completionRate: '100%',
    completionRateAr: '100%',
    completionRateEn: '100%',
    score: '98.5%',
    scoreEn: '98.5%',
    serialId: 'MTF-2026-MATH-99482',
    instructorAr: 'إدارة منصة متفوّق التعليمية',
    instructorEn: 'Motafawweq Platform Administration',
    badgeAr: 'معتمدة من المنصة (التربية والتعليم)',
    badgeEn: 'Platform & Ministry Certified',
    criteriaType: 'ministry_curriculum',
    criteriaMetAr: 'إتمام كامل المادة والامتحانات الوزارية النازلة على المنصة',
    criteriaMetEn: 'Completed entire subject curriculum & passed official platform exams',
    verificationUrl: 'https://motafawweq.me/verify/MTF-2026-MATH-99482',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://motafawweq.me/verify/MTF-2026-MATH-99482',
    status: 'claimed'
  },
  {
    id: 'cert-bio-salma-2026',
    issuerType: 'teacher',
    category: 'teacher',
    issuerNameAr: 'د. سلمى السيد',
    issuerNameEn: 'Dr. Salma El-Sayed',
    instructorTitleAr: 'مدرس أول الأحياء والجيولوجيا للثانوية العامة',
    instructorTitleEn: 'Senior Biology Educator',
    titleAr: 'شهادة إنجاز واجتياز كورس معتمد',
    titleEn: 'Certificate of Certified Course Completion',
    subtitleAr: 'شهادة إتمام كورس الأستاذ المعتمد',
    subtitleEn: 'Certified Teacher Course Completion Certificate',
    courseNameAr: 'الأحياء الفسيولوجية والخلوي للثانوية العامة',
    courseNameEn: 'Physiological & Cellular Biology (Teacher Course)',
    studentNameAr: 'عبدالرحمن حسن',
    studentNameEn: 'Abdulrahman Hassan',
    gradeAr: 'الصف الثالث الثانوي 2026',
    gradeEn: 'Grade 12 (Thanawya Amma) 2026',
    completionDate: '10 سبتمبر 2026',
    completionDateEn: 'September 10, 2026',
    completionRate: '100%',
    completionRateAr: '100%',
    completionRateEn: '100%',
    score: '96.5%',
    scoreEn: '96.5%',
    serialId: 'MTF-2026-BIO-88210',
    instructorAr: 'د. سلمى السيد',
    instructorEn: 'Dr. Salma El-Sayed',
    badgeAr: 'معتمدة من المعلم',
    badgeEn: 'Teacher Certified',
    criteriaType: 'teacher_course',
    criteriaMetAr: 'إكمال 100% من كورس المعلم واختباراته المعتمدة',
    criteriaMetEn: 'Completed 100% of teacher course lectures and quizzes',
    verificationUrl: 'https://motafawweq.me/verify/MTF-2026-BIO-88210',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://motafawweq.me/verify/MTF-2026-BIO-88210',
    status: 'claimed'
  },
  {
    id: 'cert-league-champ-sep',
    issuerType: 'league',
    category: 'league',
    issuerNameAr: 'منصة متفوّق التعليمية الرسمية',
    issuerNameEn: 'Motafawweq Official Platform',
    instructorTitleAr: 'مجلس إدارة منظومة متفوّق والمسابقات الوطنية',
    instructorTitleEn: 'Motafawweq Board & National Competitions Committee',
    titleAr: 'شهادة تفوق وريادة في دوري الأبطال',
    titleEn: 'Certificate of Distinction & League Championship',
    subtitleAr: 'شهادة الصدارة والفوز في دوري المتفوقين الوطني',
    subtitleEn: 'National League Champion & Top 3 Rank Certificate',
    courseNameAr: 'دوري المتفوقين الوطني - دوري النخبة لشهر سبتمبر 2026',
    courseNameEn: 'National Student League Championship (Top 3 - Sep 2026)',
    studentNameAr: 'عبدالرحمن حسن',
    studentNameEn: 'Abdulrahman Hassan',
    gradeAr: 'الصف الثالث الثانوي 2026',
    gradeEn: 'Grade 12 (Thanawya Amma) 2026',
    completionDate: '20 سبتمبر 2026',
    completionDateEn: 'September 20, 2026',
    isTop3: true,
    rank: 1,
    rankAr: 'المركز الأول (بطل الدوري) 🥇',
    rankEn: '1st Place Champion 🥇',
    points: 3980,
    pointsAr: '3,980 نقطة (XP)',
    pointsEn: '3,980 XP',
    score: '99.5%',
    scoreEn: '99.5%',
    serialId: 'MTF-2026-LEAGUE-001',
    instructorAr: 'مجلس إدارة منصة متفوّق',
    instructorEn: 'Motafawweq Platform Administration',
    badgeAr: 'شهادة دوري المتفوقين',
    badgeEn: 'League Champion Certified',
    criteriaType: 'league_winner',
    criteriaMetAr: 'الفوز بالدوري وتحقيق المركز الأول على مستوى الجمهورية برصيد 3,980 نقطة',
    criteriaMetEn: 'Ranked 1st Place National Champion in the Student League with 3,980 XP',
    verificationUrl: 'https://motafawweq.me/verify/MTF-2026-LEAGUE-001',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://motafawweq.me/verify/MTF-2026-LEAGUE-001',
    status: 'claimed'
  },
  {
    id: 'cert-physics-ministry-2026',
    issuerType: 'ministry',
    category: 'ministry',
    issuerNameAr: 'منصة متفوّق التعليمية (منهج وزارة التربية والتعليم)',
    issuerNameEn: 'Motafawweq Platform (Ministry of Education Curriculum)',
    instructorTitleAr: 'قسم امتحانات الفيزياء الوزارية المعتمدة',
    instructorTitleEn: 'Accredited Ministry Physics Assessments Board',
    titleAr: 'شهادة إنجاز وتفوق أكاديمي',
    titleEn: 'Certificate of Academic Excellence',
    subtitleAr: 'شهادة إتمام المادة والامتحانات الرسمية لوزارة التربية والتعليم',
    subtitleEn: 'Official Ministry of Education Subject Completion & Assessments',
    courseNameAr: 'الفيزياء الكهربية والحديثة للثانوية العامة',
    courseNameEn: 'Electricity & Modern Physics - 3rd Secondary',
    studentNameAr: 'عبدالرحمن حسن',
    studentNameEn: 'Abdulrahman Hassan',
    gradeAr: 'الصف الثالث الثانوي 2026',
    gradeEn: 'Grade 12 (Thanawya Amma) 2026',
    completionDate: '01 سبتمبر 2026',
    completionDateEn: 'September 01, 2026',
    completionRate: '100%',
    completionRateAr: '100%',
    completionRateEn: '100%',
    score: '99.0%',
    scoreEn: '99.0%',
    serialId: 'MTF-2026-PHY-7712',
    instructorAr: 'إدارة منصة متفوّق التعليمية',
    instructorEn: 'Motafawweq Platform Administration',
    badgeAr: 'معتمدة من المنصة (التربية والتعليم)',
    badgeEn: 'Platform & Ministry Certified',
    criteriaType: 'ministry_curriculum',
    criteriaMetAr: 'إتمام كامل المادة والامتحانات الوزارية النازلة على المنصة',
    criteriaMetEn: 'Completed entire subject curriculum & passed official platform exams',
    verificationUrl: 'https://motafawweq.me/verify/MTF-2026-PHY-7712',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://motafawweq.me/verify/MTF-2026-PHY-7712',
    status: 'claimed'
  }
];

export const SUBSCRIPTION_PLANS = [
  {
    id: 'plan-free',
    nameAr: 'الباقة المجانية',
    nameEn: 'Free Plan',
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
    featuresAr: [
      'شرح ومناهج وزارة التربية والتعليم الرسمية لجميع المواد',
      'تصفح الدروس والمذكرات الأساسية المفتوحة مجاناً',
      'جدول المذاكرة العام ومتابعة المهام اليومية'
    ],
    featuresEn: [
      'Official Ministry of Education curriculum & video lectures',
      'Access to open free lessons and core summary files',
      'General study schedule and daily learning tasks'
    ],
    limitationsAr: [
      'غير شاملة الامتحانات التقييمية بنظام البابل شيت',
      'غير شاملة تحويل المحاضرات الذكي بالـ AI',
      'غير شاملة دوريات المتفوقين أو الشهادات المعتمدة'
    ],
    limitationsEn: [
      'Excludes Bubble Sheet assessments & exams',
      'Excludes AI lecture audio/video transcription',
      'Excludes student leagues & verified certificates'
    ],
    color: '#64748B',
    popular: false
  },
  {
    id: 'plan-plus',
    nameAr: 'باقة بلس (Plus)',
    nameEn: 'Plus Plan',
    tier: 'plus',
    pricing: {
      monthly: { priceEgp: 60, originalPriceEgp: null, periodAr: 'شهرياً', periodEn: 'per month', badgeAr: 'الأنسب للأساسيات', badgeEn: 'Great for Essentials' },
      term: { priceEgp: 240, originalPriceEgp: 300, periodAr: 'للترم (5 شهور)', periodEn: 'per semester (5 mo)', badgeAr: 'توفير 20%', badgeEn: 'Save 20%' },
      annual: { priceEgp: 450, originalPriceEgp: 600, periodAr: 'للعام كاملاً (10 شهور)', periodEn: 'per full year (10 mo)', badgeAr: 'توفير 25%', badgeEn: 'Save 25%' }
    },
    priceEgp: 60,
    periodAr: 'شهرياً',
    periodEn: 'per month',
    badgeAr: 'الأنسب للأساسيات',
    badgeEn: 'Great for Essentials',
    featuresAr: [
      'جميع مزايا الباقة المجانية بالكامل',
      'الامتحانات التقييمية وبنك الأسئلة الشامل بنظام البابل شيت',
      'المشاركة في دوريات المتفوقين والتحديات الأسبوعية ونقاط (XP)',
      'الاشتراك في كورسات ومقررات المعلمين المعتمدين',
      'بنك الأخطاء الذكي واستخراج المفاهيم المتعثرة وتصحيحها',
      'شهادات إتمام المقررات والمنهج المعتمدة رسمياً بكود QR'
    ],
    featuresEn: [
      'All Free Plan features included',
      'Comprehensive question bank & Bubble Sheet exams',
      'Full participation in weekly student leagues & XP ranking',
      'Enrollment in certified teacher courses and modules',
      'Smart mistake bank & weak concept correction',
      'QR-verified official subject & course completion certificates'
    ],
    limitationsAr: [
      'غير شاملة تحويل المحاضرات الذكي بالـ AI (تفريغ صوت وفيديو ومذكرات)',
      'غير شاملة توليد الكويزات التلقائية بالذكاء الاصطناعي'
    ],
    limitationsEn: [
      'Excludes AI Smart Lecture conversion (audio/video/PDF transcripts)',
      'Excludes AI automated bubble-sheet quiz generation'
    ],
    color: '#0284C7',
    popular: false
  },
  {
    id: 'plan-pro',
    nameAr: 'باقة برو الشاملة (Pro)',
    nameEn: 'Pro VIP Plan (All-Access)',
    tier: 'pro',
    pricing: {
      monthly: { priceEgp: 120, originalPriceEgp: null, periodAr: 'شهرياً', periodEn: 'per month', badgeAr: 'الباقة الشاملة القصوى ⭐', badgeEn: 'All-Inclusive VIP ⭐' },
      term: { priceEgp: 450, originalPriceEgp: 600, periodAr: 'للترم بالكامل (5 شهور)', periodEn: 'per semester (5 mo)', badgeAr: 'الأكثر طلباً (وفر 150 ج.م) ⭐', badgeEn: 'Most Popular (Save 150 EGP) ⭐' },
      annual: { priceEgp: 850, originalPriceEgp: 1200, periodAr: 'للعام كاملاً حتى الامتحانات (10 شهور)', periodEn: 'per full year (10 mo)', badgeAr: 'القيمة الأفضل (وفر 350 ج.م) 👑', badgeEn: 'Ultimate Value (Save 350 EGP) 👑' }
    },
    priceEgp: 120,
    periodAr: 'شهرياً',
    periodEn: 'per month',
    badgeAr: 'الباقة الشاملة القصوى ⭐',
    badgeEn: 'All-Inclusive VIP ⭐',
    featuresAr: [
      'كل أدوات ومزايا المنصة بالكامل بلا أي قيود (VIP)',
      'تحويل المحاضرات الذكي بالـ AI (تفريغ صوت وفيديو ومذكرات PDF)',
      'توليد كويزات تقييمية بنظام البابل شيت بالـ AI بعد كل درس وتصحيح فوري',
      'الوصول لغرفة المذاكرة والقفز اللحظي من النص للشرح الصوتي',
      'الخرائط الذهنية التفاعلية وتلخيصات كبسولات المنهج المركزة',
      'جميع امتحانات ودوريات المتفوقين ومقررات المعلمين بالكامل',
      'حصص البث المباشر التفاعلية (Live Rooms) مع كبار المعلمين',
      'معسكرات ليلة الامتحان النهائية وتوقعات البابل شيت الرسمية',
      'وضع المذاكرة أوفلاين غير المحدود وتحميل كافة المذكرات والملازم',
      'تقارير أسبوعية تفصيلية لولي الأمر لمتابعة التحصيل الدراسي',
      'كافة الشهادات والأوسمة المعتمدة بكود QR ودرع صدارة الدوري'
    ],
    featuresEn: [
      'Complete, unrestricted VIP access to all platform features',
      'AI Lecture Conversion (Audio, Video & PDF Transcripts)',
      'Instant AI Bubble-Sheet Quizzes generated after each lesson',
      'Interactive study room with instant click-to-audio sync',
      'Interactive concept mind maps & high-yield summary capsules',
      'All certified teacher courses & official Ministry exam bank',
      'Interactive Live Rooms broadcasting with top educators',
      'Final exam night camps & official Bubble Sheet predictions',
      'Unlimited offline study mode with downloadable booklets',
      'Weekly guardian progress reports & streak analytics',
      'All verified credentials, QR certificates, and League Trophy'
    ],
    limitationsAr: [],
    limitationsEn: [],
    color: '#1588C7',
    popular: true
  }
];

export const LIVE_CLASSES_SCHEDULE = [
  {
    id: 'live-1',
    titleAr: 'مراجعة البث المباشر: حل 50 فكرة بابل شيت على البناء الضوئي',
    teacherNameAr: 'د. سلمى السيد',
    subjectAr: 'الأحياء',
    dateAr: 'الجمعة 20 سبتمبر',
    timeAr: '08:00 مساءً (مباشر)',
    duration: '90 دقيقة',
    enrolledCount: 840,
    reminderSet: true
  },
  {
    id: 'live-2',
    titleAr: 'ورشة حل مسائل العقد والحلقات المغلقة لكيرشوف',
    teacherNameAr: 'د. هاني الشناوي',
    subjectAr: 'الفيزياء',
    dateAr: 'الإثنين 23 سبتمبر',
    timeAr: '07:00 مساءً (مباشر)',
    duration: '75 دقيقة',
    enrolledCount: 620,
    reminderSet: false
  }
];
