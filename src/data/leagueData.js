// Detailed data for General Ministry Subject Leagues and Teacher Course Leagues (No Emojis)

export const ALL_LEAGUES = [
  // ================= 1. دوريات المواد العامة (التربية والتعليم) =================
  {
    id: 'general-republic',
    category: 'general',
    nameAr: 'دوري الجمهورية العام (كل المواد)',
    titleAr: 'دوري الجمهورية العام (المجموع الكلي لكافة المواد)',
    subtitleAr: 'البطولة الوطنية الكبرى • وزارة التربية والتعليم',
    badge: 'دوري الجمهورية',
    isRepublicLeague: true,
    descriptionAr: 'المنافسة الكبرى على مستوى مدارس جمهورية مصر العربية في المجموع الكلي لكافة المواد. صاحب المركز الأول يتوج أسبوعياً وتُوضع صورته في سلايدر الشرف الوطني أمام جميع الطلاب والمعلمين!',
    participantsCount: 48900,
    myRank: 2,
    champion: {
      nameAr: 'سارة خالد منصور',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
      schoolAr: 'مدرسة المتفوقات STEM كفر الشيخ',
      governorate: 'كفر الشيخ',
      score: 18450,
      streak: 28,
      title: 'بطلة الجمهورية للأسبوع الحالي',
      quoteAr: 'الاستمرار اليومي وحل امتحانات الوزارة الشاملة في كل المواد هو سر الصدارة في دوري الجمهورية.'
    },
    students: [
      { rank: 1, nameAr: 'سارة خالد منصور', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', score: 18450, streak: 28, badge: 'بطلة الجمهورية 👑', tier: 'Diamond', schoolAr: 'المتفوقات STEM كفر الشيخ', perfectQuizzes: 48, examsSolved: 92, lessonsStudied: 160, change: 0, isChampion: true },
      { rank: 2, nameAr: 'عمر طارق القاضي (أنت)', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80', score: 17290, streak: 16, badge: 'وصيف الجمهورية 🥈', tier: 'Diamond', isMe: true, schoolAr: 'السعيدية الثانوية العسكرية، الجيزة', perfectQuizzes: 42, examsSolved: 84, lessonsStudied: 148, change: 1 },
      { rank: 3, nameAr: 'خالد عبد الرحمن النجار', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80', score: 16800, streak: 26, badge: 'المركز الثالث 🥉', tier: 'Diamond', schoolAr: 'المنصورة العسكرية بنين', perfectQuizzes: 39, examsSolved: 78, lessonsStudied: 135, change: -1 },
      { rank: 4, nameAr: 'أحمد بهاء الدين الصاوي', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', score: 15950, streak: 22, badge: 'المستوى الماسي', tier: 'Diamond', schoolAr: 'المتفوقين عين شمس بنين', perfectQuizzes: 36, examsSolved: 72, lessonsStudied: 126, change: 2 },
      { rank: 5, nameAr: 'منى شمس الدين', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', score: 15100, streak: 18, badge: 'المستوى الذهبي', tier: 'Gold', schoolAr: 'المعادي القومية بنات', perfectQuizzes: 33, examsSolved: 66, lessonsStudied: 118, change: 0 },
      { rank: 6, nameAr: 'محمد أشرف رضوان', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', score: 14600, streak: 15, badge: 'المستوى الذهبي', tier: 'Gold', schoolAr: 'الإبراهيمية الثانوية، الإسكندرية', perfectQuizzes: 30, examsSolved: 60, lessonsStudied: 110, change: -2 },
      { rank: 7, nameAr: 'فاطمة الزهراء مصطفى', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80', score: 13950, streak: 12, badge: 'المستوى الفضي', tier: 'Silver', schoolAr: 'السنية الثانوية بنات، القاهرة', perfectQuizzes: 27, examsSolved: 54, lessonsStudied: 98, change: 1 },
      { rank: 8, nameAr: 'كريم مصطفى بدوي', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', score: 13200, streak: 10, badge: 'المستوى الفضي', tier: 'Silver', schoolAr: 'الأورمان النموذجية، الدقي', perfectQuizzes: 24, examsSolved: 48, lessonsStudied: 88, change: 0 }
    ]
  },

  // ================= 2. دوريات كورسات المدرسين =================
  {
    id: 'tch-salma',
    category: 'teachers',
    nameAr: 'د. سلمى السيد',
    titleAr: 'دوري كورس الأحياء • د. سلمى السيد',
    subtitleAr: 'ماستر كورس الأحياء والوراثة الجزيئية',
    teacherName: 'د. سلمى السيد',
    subject: 'الأحياء',
    badge: 'كورس د. سلمى',
    descriptionAr: 'المنافسة الحصرية لطلاب ماستر كورس دكتورة سلمى السيد على بنوك أسئلة الحصص والكويزات الأسبوعية.',
    participantsCount: 4120,
    myRank: 2,
    students: [
      { rank: 1, nameAr: 'سارة خالد منصور', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', score: 3920, streak: 24, badge: 'متصدرة الكورس', tier: 'Diamond', schoolAr: 'المتفوقات STEM كفر الشيخ', perfectQuizzes: 14, examsSolved: 28, lessonsStudied: 52, change: 0 },
      { rank: 2, nameAr: 'عمر طارق القاضي (أنت)', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80', score: 3450, streak: 16, badge: 'وصيف الكورس', tier: 'Diamond', isMe: true, schoolAr: 'السعيدية الثانوية العسكرية، الجيزة', perfectQuizzes: 11, examsSolved: 24, lessonsStudied: 42, change: 1 },
      { rank: 3, nameAr: 'مريم عادل شنودة', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80', score: 3280, streak: 12, badge: 'منصة التتويج', tier: 'Diamond', schoolAr: 'القومية لغات بالإسكندرية', perfectQuizzes: 9, examsSolved: 20, lessonsStudied: 38, change: -1 },
      { rank: 4, nameAr: 'كريم مصطفى بدوي', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80', score: 2950, streak: 9, badge: 'نشط', tier: 'Gold', schoolAr: 'الأورمان النموذجية، الدقي', perfectQuizzes: 7, examsSolved: 17, lessonsStudied: 30, change: 0 },
      { rank: 5, nameAr: 'نور الهدى عثمان', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80', score: 2650, streak: 7, badge: 'مثابرة', tier: 'Gold', schoolAr: 'المنصورة الثانوية بنات', perfectQuizzes: 6, examsSolved: 14, lessonsStudied: 25, change: 2 },
      { rank: 6, nameAr: 'زياد هشام فهمي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', score: 2510, streak: 6, badge: 'صاعد', tier: 'Gold', schoolAr: 'عباس العقاد الرسمية', perfectQuizzes: 5, examsSolved: 13, lessonsStudied: 22, change: -1 },
      { rank: 7, nameAr: 'أحمد وائل حجازي', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80', score: 2340, streak: 5, badge: 'متألق', tier: 'Silver', schoolAr: 'طنطا الثانوية بنين', perfectQuizzes: 4, examsSolved: 11, lessonsStudied: 19, change: 1 },
      { rank: 8, nameAr: 'ياسمين حسام النجار', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80', score: 2180, streak: 4, badge: 'مستمرة', tier: 'Silver', schoolAr: 'الزهراء الرسمية، أسيوط', perfectQuizzes: 3, examsSolved: 9, lessonsStudied: 15, change: 0 }
    ]
  },
  {
    id: 'tch-hany',
    category: 'teachers',
    nameAr: 'د. هاني الشناوي',
    titleAr: 'دوري كورس الفيزياء • د. هاني الشناوي',
    subtitleAr: 'الفيزياء الحديثة وقوانين كيرشوف والدينامو',
    teacherName: 'د. هاني الشناوي',
    subject: 'الفيزياء',
    badge: 'كورس د. هاني',
    descriptionAr: 'دوري أبطال الفيزياء التابع لأكاديمية الدكتور هاني الشناوي، لحل مسائل الدوائر المعقدة والتحديات اليومية.',
    participantsCount: 3890,
    myRank: 1,
    students: [
      { rank: 1, nameAr: 'عمر طارق القاضي (أنت)', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80', score: 2890, streak: 16, badge: 'بطل الكورس', tier: 'Diamond', isMe: true, schoolAr: 'السعيدية الثانوية العسكرية، الجيزة', perfectQuizzes: 12, examsSolved: 21, lessonsStudied: 38, change: 2 },
      { rank: 2, nameAr: 'محمد أشرف رضوان', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80', score: 2810, streak: 15, badge: 'وصيف الكورس', tier: 'Diamond', schoolAr: 'الإبراهيمية الثانوية، الإسكندرية', perfectQuizzes: 11, examsSolved: 20, lessonsStudied: 35, change: -1 },
      { rank: 3, nameAr: 'سلمى إبراهيم حمزة', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', score: 2690, streak: 12, badge: 'منصة التتويج', tier: 'Diamond', schoolAr: 'الشهيد هشام بركات، القاهرة', perfectQuizzes: 9, examsSolved: 18, lessonsStudied: 32, change: 1 },
      { rank: 4, nameAr: 'فادي رؤوف زكي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', score: 2480, streak: 8, badge: 'نشط', tier: 'Gold', schoolAr: 'المنارة بنين، المعادي', perfectQuizzes: 7, examsSolved: 15, lessonsStudied: 27, change: 0 },
      { rank: 5, nameAr: 'داليا محمود عزمي', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80', score: 2320, streak: 6, badge: 'مثابرة', tier: 'Gold', schoolAr: 'شبرا الرسمية لغات', perfectQuizzes: 5, examsSolved: 13, lessonsStudied: 23, change: -1 },
      { rank: 6, nameAr: 'حمزة توفيق الجوهري', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80', score: 2190, streak: 5, badge: 'متقدم', tier: 'Silver', schoolAr: 'الزهور الثانوية، بورسعيد', perfectQuizzes: 4, examsSolved: 11, lessonsStudied: 19, change: 1 },
      { rank: 7, nameAr: 'رنا إيهاب سمير', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80', score: 2010, streak: 4, badge: 'صاعدة', tier: 'Silver', schoolAr: 'طه حسين الرسمية، المنيا', perfectQuizzes: 3, examsSolved: 9, lessonsStudied: 16, change: 0 },
      { rank: 8, nameAr: 'ماجد كمال نصار', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80', score: 1880, streak: 3, badge: 'مستمر', tier: 'Silver', schoolAr: 'الفيوم الثانوية بنين', perfectQuizzes: 2, examsSolved: 8, lessonsStudied: 13, change: 0 }
    ]
  },
  {
    id: 'tch-ehab',
    category: 'teachers',
    nameAr: 'د. إيهاب عبد العظيم',
    titleAr: 'دوري كورس الكيمياء • د. إيهاب عبد العظيم',
    subtitleAr: 'الاتزان الكيميائي والكيمياء الكهربية والتحليلية',
    teacherName: 'د. إيهاب عبد العظيم',
    subject: 'الكيمياء',
    badge: 'كورس د. إيهاب',
    descriptionAr: 'منافسات كورس الكيمياء الشامل بإشراف د. إيهاب عبد العظيم، مع تقييمات الواجبات الأسبوعية وبنك المسائل التراكمي.',
    participantsCount: 2940,
    myRank: 4,
    students: [
      { rank: 1, nameAr: 'حازم شريف الجمل', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', score: 3240, streak: 19, badge: 'بطل الكورس', tier: 'Diamond', schoolAr: 'الأورمان الثانوية بنين', perfectQuizzes: 12, examsSolved: 24, lessonsStudied: 42, change: 0 },
      { rank: 2, nameAr: 'منى شمس الدين', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', score: 3110, streak: 16, badge: 'وصيفة الكورس', tier: 'Diamond', schoolAr: 'المعادي القومية بنات', perfectQuizzes: 11, examsSolved: 22, lessonsStudied: 39, change: 1 },
      { rank: 3, nameAr: 'أدهم وليد شاكر', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80', score: 2980, streak: 13, badge: 'منصة التتويج', tier: 'Gold', schoolAr: 'النصر للبنين، الإسكندرية', perfectQuizzes: 9, examsSolved: 19, lessonsStudied: 34, change: -1 },
      { rank: 4, nameAr: 'عمر طارق القاضي (أنت)', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80', score: 2650, streak: 16, badge: 'منافس قوي', tier: 'Gold', isMe: true, schoolAr: 'السعيدية الثانوية العسكرية، الجيزة', perfectQuizzes: 8, examsSolved: 18, lessonsStudied: 33, change: 2 },
      { rank: 5, nameAr: 'نهال فوزي عبد الله', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80', score: 2460, streak: 7, badge: 'نشطة', tier: 'Gold', schoolAr: 'الزقازيق الثانوية بنات', perfectQuizzes: 6, examsSolved: 14, lessonsStudied: 24, change: -1 },
      { rank: 6, nameAr: 'طارق رمزي متولي', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80', score: 2280, streak: 5, badge: 'متقدم', tier: 'Silver', schoolAr: 'دمياط العسكرية بنين', perfectQuizzes: 4, examsSolved: 12, lessonsStudied: 20, change: 0 },
      { rank: 7, nameAr: 'شهد علاء فاروق', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80', score: 2090, streak: 4, badge: 'طموحة', tier: 'Silver', schoolAr: 'بني سويف التجريبية', perfectQuizzes: 3, examsSolved: 10, lessonsStudied: 16, change: 1 },
      { rank: 8, nameAr: 'كريم أشرف حلمي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', score: 1910, streak: 3, badge: 'مستمر', tier: 'Silver', schoolAr: 'قنا الثانوية بنين', perfectQuizzes: 2, examsSolved: 8, lessonsStudied: 13, change: -1 }
    ]
  },
  {
    id: 'tch-walid',
    category: 'teachers',
    nameAr: 'مستر وليد محسن',
    titleAr: 'دوري كورس اللغة العربية • مستر وليد محسن',
    subtitleAr: 'مراجعة النحو الشاملة والبلاغة التراكمية',
    teacherName: 'مستر وليد محسن',
    subject: 'اللغة العربية',
    badge: 'كورس مستر وليد',
    descriptionAr: 'المضمار الأسبوعي لنخبة طلاب مستر وليد محسن في فك شفرات النحو والبلاغة وإعراب أصعب الشواهد.',
    participantsCount: 3500,
    myRank: 3,
    students: [
      { rank: 1, nameAr: 'خالد عبد الرحمن النجار', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80', score: 3580, streak: 23, badge: 'فارس النحو', tier: 'Diamond', schoolAr: 'المنصورة العسكرية بنين', perfectQuizzes: 14, examsSolved: 27, lessonsStudied: 47, change: 0 },
      { rank: 2, nameAr: 'فاطمة الزهراء مصطفى', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80', score: 3340, streak: 18, badge: 'وصيفة الكورس', tier: 'Diamond', schoolAr: 'السنية الثانوية بنات، القاهرة', perfectQuizzes: 12, examsSolved: 24, lessonsStudied: 43, change: 1 },
      { rank: 3, nameAr: 'عمر طارق القاضي (أنت)', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80', score: 3120, streak: 16, badge: 'منصة التتويج', tier: 'Diamond', isMe: true, schoolAr: 'السعيدية الثانوية العسكرية، الجيزة', perfectQuizzes: 10, examsSolved: 22, lessonsStudied: 39, change: 1 },
      { rank: 4, nameAr: 'سلمى كمال بدر', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80', score: 2790, streak: 9, badge: 'مثابرة', tier: 'Gold', schoolAr: 'طلائع المستقبل لغات', perfectQuizzes: 7, examsSolved: 16, lessonsStudied: 27, change: -2 },
      { rank: 5, nameAr: 'إبراهيم يوسف غنيم', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80', score: 2540, streak: 7, badge: 'دقيق النحو', tier: 'Gold', schoolAr: 'الإبراهيمية الثانوية', perfectQuizzes: 6, examsSolved: 14, lessonsStudied: 23, change: 1 },
      { rank: 6, nameAr: 'هدى عصام الدين', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80', score: 2390, streak: 5, badge: 'نشطة', tier: 'Silver', schoolAr: 'المنيا الثانوية بنات', perfectQuizzes: 4, examsSolved: 12, lessonsStudied: 19, change: 0 },
      { rank: 7, nameAr: 'يوسف جمال الدين', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', score: 2190, streak: 4, badge: 'واعد', tier: 'Silver', schoolAr: 'كفر الشيخ بنين', perfectQuizzes: 3, examsSolved: 10, lessonsStudied: 15, change: 2 },
      { rank: 8, nameAr: 'مروة صبري أنور', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80', score: 1980, streak: 3, badge: 'مثابرة', tier: 'Silver', schoolAr: 'السويس الثانوية بنات', perfectQuizzes: 2, examsSolved: 8, lessonsStudied: 12, change: -1 }
    ]
  }
];

export const DEFAULT_LEAGUE = ALL_LEAGUES[0];
