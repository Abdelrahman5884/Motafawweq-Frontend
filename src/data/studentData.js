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
  levelTitleAr: 'متفوّق عبقري ⭐',
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
  { id: 'sub-bio', name: 'Biology', nameAr: 'الأحياء', icon: '🧬', color: '#10B981', count: 6 },
  { id: 'sub-phy', name: 'Physics', nameAr: 'الفيزياء', icon: '⚡', color: '#06B6D4', count: 5 },
  { id: 'sub-chem', name: 'Chemistry', nameAr: 'الكيمياء', icon: '🧪', color: '#8B5CF6', count: 5 },
  { id: 'sub-ar', name: 'Arabic Language', nameAr: 'اللغة العربية والبلاغة', icon: '📜', color: '#F59E0B', count: 8 },
  { id: 'sub-math', name: 'Pure & Applied Math', nameAr: 'الرياضيات التطبيقية والبحته', icon: '📐', color: '#EC4899', count: 7 },
  { id: 'sub-en', name: 'English First Language', nameAr: 'اللغة الإنجليزية المتقدمة', icon: '🌍', color: '#3B82F6', count: 4 }
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
    date: 'الأحد القادم',
    time: '06:00 مساءً',
    durationMinutes: 45,
    questionsCount: 25,
    maxScore: 60,
    attemptsAllowed: 2,
    attemptsUsed: 0,
    status: 'ready',
    cover: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'exam-phy-weekly2',
    titleAr: 'امتحان كيرشوف والدوائر المعقدة الأسبوعي',
    subjectAr: 'الفيزياء',
    date: 'الثلاثاء القادم',
    time: '07:30 مساءً',
    durationMinutes: 35,
    questionsCount: 20,
    maxScore: 50,
    attemptsAllowed: 1,
    attemptsUsed: 0,
    status: 'upcoming',
    cover: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&auto=format&fit=crop&q=80'
  }
];

export const HOMEWORK_LIST = [
  {
    id: 'hw-bio-01',
    titleAr: 'واجب تطبيق انشطار الماء ومعادلة فان نيل بالأكسجين المشع',
    courseId: 'course-bio-301',
    subjectAr: 'الأحياء',
    teacherNameAr: 'د. سلمى السيد',
    deadline: '2026-09-19 23:59',
    deadlineTextAr: 'ينتهي اليوم خلال 6 ساعات',
    status: 'pending', // 'pending' | 'submitted' | 'graded'
    questionsCount: 6,
    maxScore: 20,
    earnedScore: null,
    submissionText: '',
    submittedFileUrl: null,
    teacherFeedbackAr: '',
    instructionsAr: 'قم بحل المسائل في كشكولك وتصوير الحل أو كتابة التحليل العلمي لخطوات تفاعل الضوء في خانة الإجابة، مع ذكر دور مركب NADPH.'
  },
  {
    id: 'hw-bio-02',
    titleAr: 'واجب مقارنة أقراص الثيلاكويد بالستروما ومسارات الطاقة',
    courseId: 'course-bio-301',
    subjectAr: 'الأحياء',
    teacherNameAr: 'د. سلمى السيد',
    deadline: '2026-09-15 23:59',
    deadlineTextAr: 'تم التسليم والتصحيح',
    status: 'graded',
    questionsCount: 8,
    maxScore: 20,
    earnedScore: 19,
    submissionText: 'تم شرح دور التفاعلات الضوئية بدقة وإرفاق الرسم البياني لامتصاص أطياف الضوء.',
    submittedFileUrl: 'homework-omar-bio-week1.pdf',
    teacherFeedbackAr: 'إجابة ممتازة جداً يا عمر! صياغتك العلمية لدور إنزيم روبيسكو دقيقة، والدرجة 19 من 20.',
    gradedDate: '2026-09-16'
  },
  {
    id: 'hw-phy-01',
    titleAr: 'مسائل قوانين كيرشوف المعقدة وحسابات الجهد بالمسارات المغلقة',
    courseId: 'course-phy-302',
    subjectAr: 'الفيزياء',
    teacherNameAr: 'د. هاني الشناوي',
    deadline: '2026-09-22 18:00',
    deadlineTextAr: 'باقي 4 أيام',
    status: 'pending',
    questionsCount: 5,
    maxScore: 25,
    earnedScore: null,
    submissionText: '',
    submittedFileUrl: null,
    teacherFeedbackAr: '',
    instructionsAr: 'طبق القانون الأول على العقدة (A) والقانون الثاني على الحلقتين (I) و (II) وأوجد شدة التيارات I1, I2, I3.'
  }
];

// Competitive League (دوري المتفوقين)
export const LEAGUE_LEADERBOARD = [
  { rank: 1, nameAr: 'سارة خالد منصور', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', score: 3920, streak: 24, badge: '👑 بطلة الأسبوع', tier: 'Diamond' },
  { rank: 2, nameAr: 'عمر طارق القاضي (أنت)', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80', score: 3450, streak: 16, badge: '🔥 صاعد بقوة', tier: 'Diamond', isMe: true },
  { rank: 3, nameAr: 'مريم عادل شنودة', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80', score: 3280, streak: 12, badge: '⭐ متفوقة', tier: 'Gold' },
  { rank: 4, nameAr: 'كريم مصطفى بدوي', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80', score: 2950, streak: 9, badge: '🚀 مثابر', tier: 'Gold' },
  { rank: 5, nameAr: 'زياد هشام فهمي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', score: 2710, streak: 7, badge: '⚡ نشط', tier: 'Silver' }
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
  { id: 'b1', titleAr: 'سيد البناء الضوئي 🧬', descAr: 'إتقان جميع مفاهيم النبات بدرجة 90%+', unlocked: true, icon: '🧬', date: '2026-09-12' },
  { id: 'b2', titleAr: 'شعلة الالتزام (16 يوم) 🔥', descAr: 'المذاكرة المتواصلة دون انقطاع', unlocked: true, icon: '🔥', date: '2026-09-18' },
  { id: 'b3', titleAr: 'قناص الامتحانات 🎯', descAr: 'الحصول على الدرجة النهائية في 3 اختبارات', unlocked: true, icon: '🎯', date: '2026-09-08' },
  { id: 'b4', titleAr: 'صائد الأخطاء 🛡️', descAr: 'حل 15 سؤالاً من بنك الأخطاء وتصحيحها', unlocked: true, icon: '🛡️', date: '2026-09-14' },
  { id: 'b5', titleAr: 'بطل دوري النخبة 👑', descAr: 'الوصول لقائمة أفضل 3 طلاب على مستوى الجمهورية', unlocked: true, icon: '👑', date: '2026-09-17' },
  { id: 'b6', titleAr: 'عبقري الذكاء الاصطناعي 🧠', descAr: 'توليد 10 كويزات ذكية من المحاضرات الصوتية', unlocked: false, icon: '🧠', date: null }
];

export const CERTIFICATES_LIST = [
  {
    id: 'cert-bio-master-2026',
    titleAr: 'شهادة إتمام وتفوق في علم الأحياء الفسيولوجي والخلوي',
    titleEn: 'Certificate of Mastery in Physiological & Cellular Biology',
    studentNameAr: 'عمر طارق القاضي',
    studentNameEn: 'Omar Tarek El-Kady',
    gradeAr: 'الصف الثالث الثانوي 2026',
    completionDate: '15 سبتمبر 2026',
    score: '96.5%',
    serialId: 'MTF-2026-BIO-99482',
    instructorAr: 'د. سلمى السيد',
    verificationUrl: 'https://motafawweq.me/verify/MTF-2026-BIO-99482',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://motafawweq.me/verify/MTF-2026-BIO-99482',
    status: 'claimed'
  }
];

export const SUBSCRIPTION_PLANS = [
  {
    id: 'plan-monthly',
    nameAr: 'الباقة الشهرية المتكاملة',
    nameEn: 'Monthly All-Access Pass',
    priceEgp: 350,
    periodAr: 'شهرياً',
    featuresAr: [
      'وصول كامل لحصص جميع المواد المسجل بها',
      'كويزات ذكية غير محدودة بالذكاء الاصطناعي',
      'تصحيح الواجبات وتغذية راجعة من المدرسين',
      'ميزة الاستماع الصوتي وتحميل الملازم PDF',
      'المشاركة في دوري المتفوقين الأسبوعي'
    ],
    popular: false,
    color: '#06B6D4'
  },
  {
    id: 'plan-term',
    nameAr: 'باقة الفصل الدراسي الأول (توفير 25%)',
    nameEn: 'Semester 1 Hero Pass',
    priceEgp: 1100,
    originalPriceEgp: 1400,
    periodAr: 'للترم بالكامل',
    featuresAr: [
      'جميع مميزات الباقة الشهرية طوال الفصل الدراسي',
      'أولوية الإجابة على أسئلتك من المعلمين الخبراء',
      'بنك امتحانات نصف العام والمراجعات النهائية',
      'تقارير أسبوعية تفصيلية لولي الأمر',
      'شهادة إتمام معتمدة بكود توثيق رسمي'
    ],
    popular: true,
    badgeAr: 'الأكثر اختياراً من الأوائل ⭐',
    color: '#6C4DFF'
  },
  {
    id: 'plan-annual',
    nameAr: 'باقة الثانوية العامة السنوية الشاملة',
    nameEn: 'Full Thanawya Year Pass',
    priceEgp: 2200,
    originalPriceEgp: 3200,
    periodAr: 'للعام الدراسي كاملاً حتى الامتحانات',
    featuresAr: [
      'وصول غير محدود لكل المواد والكورسات طوال العام',
      'معسكرات ليلة الامتحان وتوقعات البابل شيت',
      'حضور حصص البث المباشر التفاعلية (Live Rooms)',
      'استشارات فردية وتشخيص ذكي لنقاط الضعف',
      'ضمان التميز والتفوق الدراسي'
    ],
    popular: false,
    color: '#10B981'
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
