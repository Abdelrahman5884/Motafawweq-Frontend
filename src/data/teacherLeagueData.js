/**
 * Teacher Course League Mock Data
 * Supporting multiple courses, individual and unified groups,
 * podium rankings, and full student leaderboards (Clean, No Emojis).
 */

export const TEACHER_COURSES_FOR_LEAGUE = [
  {
    id: 'course-bio-301',
    titleAr: 'ماستر كلاس الأحياء: البناء الضوئي وحركية الخلية (3 ثانوي)',
    titleEn: 'Photosynthesis & Molecular Genetics Elite Program',
    gradeAr: 'الصف الثالث الثانوي',
    subjectAr: 'الأحياء',
    totalStudents: 2450,
    groups: [
      { id: 'all', nameAr: 'جميع المجموعات (دوري الكورس الموحد)', studentCount: 2450 },
      { id: 'grp-dokki', nameAr: 'سنتر الدقي النخبة (السبت والثلاثاء)', studentCount: 148 },
      { id: 'grp-nasr', nameAr: 'سنتر مدينة نصر (الأحد والأربعاء)', studentCount: 135 },
      { id: 'grp-online', nameAr: 'طلاب أونلاين المنصة التفاعلية', studentCount: 2167 }
    ]
  },
  {
    id: 'course-bio-302',
    titleAr: 'معسكر المراجعة النهائية ومصائد الامتحانات (3 ثانوي)',
    titleEn: 'Final Revision & High-Yield Question Bank',
    gradeAr: 'الصف الثالث الثانوي',
    subjectAr: 'الأحياء',
    totalStudents: 1890,
    groups: [
      { id: 'all', nameAr: 'جميع المجموعات (دوري المعسكر العام)', studentCount: 1890 },
      { id: 'grp-alex', nameAr: 'سنتر الإسكندرية المكثف (الجمعة)', studentCount: 320 },
      { id: 'grp-online-rev', nameAr: 'أونلاين المراجعة المركزة', studentCount: 1570 }
    ]
  },
  {
    id: 'course-bio-201',
    titleAr: 'أساسيات فسيولوجيا الإنسان والتنسيق الهرموني (2 ثانوي)',
    titleEn: 'Human Physiology & Coordination Fundamentals',
    gradeAr: 'الصف الثاني الثانوي',
    subjectAr: 'الأحياء',
    totalStudents: 980,
    groups: [
      { id: 'all', nameAr: 'جميع المجموعات (دوري ثانية ثانوي الموحد)', studentCount: 980 },
      { id: 'grp-g11-tue', nameAr: 'سنتر المهندسين (الثلاثاء)', studentCount: 85 },
      { id: 'grp-g11-online', nameAr: 'أونلاين الدفعة', studentCount: 895 }
    ]
  }
];

export const INITIAL_LEAGUES_BY_COURSE_GROUP = {
  // Course 1: Bio 301 - All Groups
  'course-bio-301_all': {
    courseId: 'course-bio-301',
    groupId: 'all',
    leagueTitle: 'دوري ماستر كلاس الأحياء - د. سلمى السيد',
    courseNameAr: 'ماستر كلاس الأحياء (3 ثانوي)',
    groupNameAr: 'جميع المجموعات (دوري موحد)',
    durationLabelAr: 'دوري شهري',
    durationDays: 30,
    totalCompetitors: 2450,
    roundDaysRemaining: 12,
    isActive: true,
    podium: [
      { 
        rank: 1, 
        nameAr: 'سارة خالد منصور', 
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140&auto=format&fit=crop&q=80', 
        score: 3920, 
        streak: 24, 
        badge: 'بطلة الكورس', 
        tier: 'Diamond', 
        schoolAr: 'المتفوقات STEM كفر الشيخ',
        groupAr: 'طلاب أونلاين المنصة',
        perfectExams: 18,
        examsSolved: 24,
        homeworkRate: '100%',
        attendanceRate: '98%'
      },
      { 
        rank: 2, 
        nameAr: 'عمر طارق القاضي', 
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=140&auto=format&fit=crop&q=80', 
        score: 3450, 
        streak: 16, 
        badge: 'وصيف الكورس', 
        tier: 'Diamond', 
        schoolAr: 'السعيدية الثانوية العسكرية، الجيزة',
        groupAr: 'سنتر الدقي النخبة',
        perfectExams: 16,
        examsSolved: 24,
        homeworkRate: '96%',
        attendanceRate: '95%'
      },
      { 
        rank: 3, 
        nameAr: 'مريم عادل شنودة', 
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=140&auto=format&fit=crop&q=80', 
        score: 3280, 
        streak: 12, 
        badge: 'المركز الثالث', 
        tier: 'Diamond', 
        schoolAr: 'القومية لغات بالإسكندرية',
        groupAr: 'سنتر مدينة نصر',
        perfectExams: 14,
        examsSolved: 22,
        homeworkRate: '94%',
        attendanceRate: '92%'
      }
    ],
    leaderboard: [
      { rank: 1, nameAr: 'سارة خالد منصور', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', score: 3920, streak: 24, badge: 'بطلة الكورس', tier: 'Diamond', schoolAr: 'المتفوقات STEM كفر الشيخ', groupAr: 'أونلاين المنصة', perfectExams: 18, examsSolved: 24, homeworkRate: '100%' },
      { rank: 2, nameAr: 'عمر طارق القاضي', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80', score: 3450, streak: 16, badge: 'وصيف الكورس', tier: 'Diamond', schoolAr: 'السعيدية الثانوية العسكرية، الجيزة', groupAr: 'سنتر الدقي', perfectExams: 16, examsSolved: 24, homeworkRate: '96%' },
      { rank: 3, nameAr: 'مريم عادل شنودة', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', score: 3280, streak: 12, badge: 'المركز الثالث', tier: 'Diamond', schoolAr: 'القومية لغات بالإسكندرية', groupAr: 'سنتر مدينة نصر', perfectExams: 14, examsSolved: 22, homeworkRate: '94%' },
      { rank: 4, nameAr: 'كريم مصطفى بدوي', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', score: 2950, streak: 9, badge: 'نشط', tier: 'Gold', schoolAr: 'الأورمان النموذجية، الدقي', groupAr: 'سنتر الدقي', perfectExams: 11, examsSolved: 20, homeworkRate: '90%' },
      { rank: 5, nameAr: 'نور الهدى عثمان', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', score: 2650, streak: 7, badge: 'مثابرة', tier: 'Gold', schoolAr: 'المنصورة الثانوية بنات', groupAr: 'أونلاين المنصة', perfectExams: 9, examsSolved: 18, homeworkRate: '88%' },
      { rank: 6, nameAr: 'زياد هشام فهمي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', score: 2510, streak: 6, badge: 'صاعد', tier: 'Gold', schoolAr: 'عباس العقاد الرسمية', groupAr: 'سنتر مدينة نصر', perfectExams: 8, examsSolved: 17, homeworkRate: '85%' },
      { rank: 7, nameAr: 'أحمد وائل حجازي', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', score: 2340, streak: 5, badge: 'متألق', tier: 'Silver', schoolAr: 'طنطا الثانوية بنين', groupAr: 'أونلاين المنصة', perfectExams: 6, examsSolved: 15, homeworkRate: '82%' },
      { rank: 8, nameAr: 'ياسمين حسام النجار', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', score: 2180, streak: 4, badge: 'مستمرة', tier: 'Silver', schoolAr: 'الزهراء الرسمية، أسيوط', groupAr: 'أونلاين المنصة', perfectExams: 5, examsSolved: 14, homeworkRate: '80%' },
      { rank: 9, nameAr: 'حازم خالد الشربيني', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', score: 1980, streak: 3, badge: 'منافس', tier: 'Silver', schoolAr: 'الخديوية الثانوية، القاهرة', groupAr: 'سنتر الدقي', perfectExams: 4, examsSolved: 13, homeworkRate: '78%' },
      { rank: 10, nameAr: 'رنا إبراهيم السيد', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', score: 1850, streak: 3, badge: 'صاعدة', tier: 'Bronze', schoolAr: 'طلائع المستقبل لغات', groupAr: 'سنتر مدينة نصر', perfectExams: 3, examsSolved: 12, homeworkRate: '75%' }
    ]
  },

  // Course 1: Bio 301 - Dokki Center Group
  'course-bio-301_grp-dokki': {
    courseId: 'course-bio-301',
    groupId: 'grp-dokki',
    leagueTitle: 'دوري ماستر كلاس الأحياء - سنتر الدقي',
    courseNameAr: 'ماستر كلاس الأحياء (3 ثانوي)',
    groupNameAr: 'سنتر الدقي النخبة',
    durationLabelAr: 'دوري شهري',
    durationDays: 30,
    totalCompetitors: 148,
    roundDaysRemaining: 12,
    isActive: true,
    podium: [
      { 
        rank: 1, 
        nameAr: 'عمر طارق القاضي', 
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=140&auto=format&fit=crop&q=80', 
        score: 3450, 
        streak: 16, 
        badge: 'بطل المجموعة', 
        tier: 'Diamond', 
        schoolAr: 'السعيدية الثانوية العسكرية، الجيزة',
        groupAr: 'سنتر الدقي النخبة',
        perfectExams: 16,
        examsSolved: 24,
        homeworkRate: '96%',
        attendanceRate: '98%'
      },
      { 
        rank: 2, 
        nameAr: 'كريم مصطفى بدوي', 
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=140&auto=format&fit=crop&q=80', 
        score: 2950, 
        streak: 9, 
        badge: 'وصيف المجموعة', 
        tier: 'Gold', 
        schoolAr: 'الأورمان النموذجية، الدقي',
        groupAr: 'سنتر الدقي النخبة',
        perfectExams: 11,
        examsSolved: 20,
        homeworkRate: '90%',
        attendanceRate: '94%'
      },
      { 
        rank: 3, 
        nameAr: 'حازم خالد الشربيني', 
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=140&auto=format&fit=crop&q=80', 
        score: 1980, 
        streak: 3, 
        badge: 'المركز الثالث', 
        tier: 'Silver', 
        schoolAr: 'الخديوية الثانوية، القاهرة',
        groupAr: 'سنتر الدقي النخبة',
        perfectExams: 4,
        examsSolved: 13,
        homeworkRate: '78%',
        attendanceRate: '88%'
      }
    ],
    leaderboard: [
      { rank: 1, nameAr: 'عمر طارق القاضي', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80', score: 3450, streak: 16, badge: 'بطل المجموعة', tier: 'Diamond', schoolAr: 'السعيدية الثانوية العسكرية، الجيزة', groupAr: 'سنتر الدقي النخبة', perfectExams: 16, examsSolved: 24, homeworkRate: '96%' },
      { rank: 2, nameAr: 'كريم مصطفى بدوي', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', score: 2950, streak: 9, badge: 'وصيف المجموعة', tier: 'Gold', schoolAr: 'الأورمان النموذجية، الدقي', groupAr: 'سنتر الدقي النخبة', perfectExams: 11, examsSolved: 20, homeworkRate: '90%' },
      { rank: 3, nameAr: 'حازم خالد الشربيني', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', score: 1980, streak: 3, badge: 'المركز الثالث', tier: 'Silver', schoolAr: 'الخديوية الثانوية، القاهرة', groupAr: 'سنتر الدقي النخبة', perfectExams: 4, examsSolved: 13, homeworkRate: '78%' },
      { rank: 4, nameAr: 'ماجد كمال نصار', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', score: 1720, streak: 2, badge: 'متوسط', tier: 'Bronze', schoolAr: 'الأورمان الثانوية', groupAr: 'سنتر الدقي النخبة', perfectExams: 3, examsSolved: 11, homeworkRate: '72%' }
    ]
  },

  // Course 1: Bio 301 - Nasr City Group
  'course-bio-301_grp-nasr': {
    courseId: 'course-bio-301',
    groupId: 'grp-nasr',
    leagueTitle: 'دوري ماستر كلاس الأحياء - سنتر مدينة نصر',
    courseNameAr: 'ماستر كلاس الأحياء (3 ثانوي)',
    groupNameAr: 'سنتر مدينة نصر',
    durationLabelAr: 'دوري شهري',
    durationDays: 30,
    totalCompetitors: 135,
    roundDaysRemaining: 12,
    isActive: true,
    podium: [
      { 
        rank: 1, 
        nameAr: 'مريم عادل شنودة', 
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=140&auto=format&fit=crop&q=80', 
        score: 3280, 
        streak: 12, 
        badge: 'بطلة المجموعة', 
        tier: 'Diamond', 
        schoolAr: 'القومية لغات بالإسكندرية',
        groupAr: 'سنتر مدينة نصر',
        perfectExams: 14,
        examsSolved: 22,
        homeworkRate: '94%',
        attendanceRate: '96%'
      },
      { 
        rank: 2, 
        nameAr: 'زياد هشام فهمي', 
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=140&auto=format&fit=crop&q=80', 
        score: 2510, 
        streak: 6, 
        badge: 'وصيف المجموعة', 
        tier: 'Gold', 
        schoolAr: 'عباس العقاد الرسمية',
        groupAr: 'سنتر مدينة نصر',
        perfectExams: 8,
        examsSolved: 17,
        homeworkRate: '85%',
        attendanceRate: '90%'
      },
      { 
        rank: 3, 
        nameAr: 'رنا إبراهيم السيد', 
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=140&auto=format&fit=crop&q=80', 
        score: 1850, 
        streak: 3, 
        badge: 'المركز الثالث', 
        tier: 'Bronze', 
        schoolAr: 'طلائع المستقبل لغات',
        groupAr: 'سنتر مدينة نصر',
        perfectExams: 3,
        examsSolved: 12,
        homeworkRate: '75%',
        attendanceRate: '86%'
      }
    ],
    leaderboard: [
      { rank: 1, nameAr: 'مريم عادل شنودة', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', score: 3280, streak: 12, badge: 'بطلة المجموعة', tier: 'Diamond', schoolAr: 'القومية لغات بالإسكندرية', groupAr: 'سنتر مدينة نصر', perfectExams: 14, examsSolved: 22, homeworkRate: '94%' },
      { rank: 2, nameAr: 'زياد هشام فهمي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', score: 2510, streak: 6, badge: 'وصيف المجموعة', tier: 'Gold', schoolAr: 'عباس العقاد الرسمية', groupAr: 'سنتر مدينة نصر', perfectExams: 8, examsSolved: 17, homeworkRate: '85%' },
      { rank: 3, nameAr: 'رنا إبراهيم السيد', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', score: 1850, streak: 3, badge: 'المركز الثالث', tier: 'Bronze', schoolAr: 'طلائع المستقبل لغات', groupAr: 'سنتر مدينة نصر', perfectExams: 3, examsSolved: 12, homeworkRate: '75%' }
    ]
  },

  // Course 1: Bio 301 - Online Group
  'course-bio-301_grp-online': {
    courseId: 'course-bio-301',
    groupId: 'grp-online',
    leagueTitle: 'دوري ماستر كلاس الأحياء - أونلاين',
    courseNameAr: 'ماستر كلاس الأحياء (3 ثانوي)',
    groupNameAr: 'طلاب أونلاين المنصة',
    durationLabelAr: 'دوري شهري',
    durationDays: 30,
    totalCompetitors: 2167,
    roundDaysRemaining: 12,
    isActive: true,
    podium: [
      { 
        rank: 1, 
        nameAr: 'سارة خالد منصور', 
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140&auto=format&fit=crop&q=80', 
        score: 3920, 
        streak: 24, 
        badge: 'بطلة الأونلاين', 
        tier: 'Diamond', 
        schoolAr: 'المتفوقات STEM كفر الشيخ',
        groupAr: 'طلاب أونلاين المنصة',
        perfectExams: 18,
        examsSolved: 24,
        homeworkRate: '100%',
        attendanceRate: '98%'
      },
      { 
        rank: 2, 
        nameAr: 'نور الهدى عثمان', 
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=140&auto=format&fit=crop&q=80', 
        score: 2650, 
        streak: 7, 
        badge: 'وصيفة الأونلاين', 
        tier: 'Gold', 
        schoolAr: 'المنصورة الثانوية بنات',
        groupAr: 'طلاب أونلاين المنصة',
        perfectExams: 9,
        examsSolved: 18,
        homeworkRate: '88%',
        attendanceRate: '92%'
      },
      { 
        rank: 3, 
        nameAr: 'أحمد وائل حجازي', 
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=140&auto=format&fit=crop&q=80', 
        score: 2340, 
        streak: 5, 
        badge: 'المركز الثالث', 
        tier: 'Silver', 
        schoolAr: 'طنطا الثانوية بنين',
        groupAr: 'طلاب أونلاين المنصة',
        perfectExams: 6,
        examsSolved: 15,
        homeworkRate: '82%',
        attendanceRate: '89%'
      }
    ],
    leaderboard: [
      { rank: 1, nameAr: 'سارة خالد منصور', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', score: 3920, streak: 24, badge: 'بطلة الأونلاين', tier: 'Diamond', schoolAr: 'المتفوقات STEM كفر الشيخ', groupAr: 'أونلاين المنصة', perfectExams: 18, examsSolved: 24, homeworkRate: '100%' },
      { rank: 2, nameAr: 'نور الهدى عثمان', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', score: 2650, streak: 7, badge: 'وصيفة الأونلاين', tier: 'Gold', schoolAr: 'المنصورة الثانوية بنات', groupAr: 'أونلاين المنصة', perfectExams: 9, examsSolved: 18, homeworkRate: '88%' },
      { rank: 3, nameAr: 'أحمد وائل حجازي', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', score: 2340, streak: 5, badge: 'المركز الثالث', tier: 'Silver', schoolAr: 'طنطا الثانوية بنين', groupAr: 'أونلاين المنصة', perfectExams: 6, examsSolved: 15, homeworkRate: '82%' },
      { rank: 4, nameAr: 'ياسمين حسام النجار', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', score: 2180, streak: 4, badge: 'مستمرة', tier: 'Silver', schoolAr: 'الزهراء الرسمية، أسيوط', groupAr: 'أونلاين المنصة', perfectExams: 5, examsSolved: 14, homeworkRate: '80%' }
    ]
  },

  // Course 2: Final Revision
  'course-bio-302_all': {
    courseId: 'course-bio-302',
    groupId: 'all',
    leagueTitle: 'دوري معسكر المراجعة النهائية - د. سلمى السيد',
    courseNameAr: 'معسكر المراجعة النهائية ومصائد الامتحانات (3 ثانوي)',
    groupNameAr: 'جميع المجموعات',
    durationLabelAr: 'دوري أسبوعي',
    durationDays: 7,
    totalCompetitors: 1890,
    roundDaysRemaining: 4,
    isActive: true,
    podium: [
      { 
        rank: 1, 
        nameAr: 'محمد إبراهيم الدسوقي', 
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=140&auto=format&fit=crop&q=80', 
        score: 3840, 
        streak: 19, 
        badge: 'فارس المراجعة', 
        tier: 'Diamond', 
        schoolAr: 'المتفوقين بعين شمس',
        groupAr: 'سنتر الإسكندرية',
        perfectExams: 15,
        examsSolved: 18,
        homeworkRate: '98%',
        attendanceRate: '100%'
      },
      { 
        rank: 2, 
        nameAr: 'هدى مصطفى كامل', 
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140&auto=format&fit=crop&q=80', 
        score: 3310, 
        streak: 14, 
        badge: 'وصيفة المعسكر', 
        tier: 'Diamond', 
        schoolAr: 'كلية البنات القومية',
        groupAr: 'أونلاين المراجعة',
        perfectExams: 12,
        examsSolved: 18,
        homeworkRate: '95%',
        attendanceRate: '96%'
      },
      { 
        rank: 3, 
        nameAr: 'يوسف شريف عبد الله', 
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=140&auto=format&fit=crop&q=80', 
        score: 3090, 
        streak: 11, 
        badge: 'المركز الثالث', 
        tier: 'Gold', 
        schoolAr: 'جمال عبد الناصر الثانوية',
        groupAr: 'أونلاين المراجعة',
        perfectExams: 10,
        examsSolved: 16,
        homeworkRate: '90%',
        attendanceRate: '91%'
      }
    ],
    leaderboard: [
      { rank: 1, nameAr: 'محمد إبراهيم الدسوقي', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', score: 3840, streak: 19, badge: 'فارس المراجعة', tier: 'Diamond', schoolAr: 'المتفوقين بعين شمس', groupAr: 'سنتر الإسكندرية', perfectExams: 15, examsSolved: 18, homeworkRate: '98%' },
      { rank: 2, nameAr: 'هدى مصطفى كامل', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', score: 3310, streak: 14, badge: 'وصيفة المعسكر', tier: 'Diamond', schoolAr: 'كلية البنات القومية', groupAr: 'أونلاين المراجعة', perfectExams: 12, examsSolved: 18, homeworkRate: '95%' },
      { rank: 3, nameAr: 'يوسف شريف عبد الله', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80', score: 3090, streak: 11, badge: 'المركز الثالث', tier: 'Gold', schoolAr: 'جمال عبد الناصر الثانوية', groupAr: 'أونلاين المراجعة', perfectExams: 10, examsSolved: 16, homeworkRate: '90%' },
      { rank: 4, nameAr: 'فاطمة حسان', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', score: 2780, streak: 8, badge: 'متألقة', tier: 'Gold', schoolAr: 'سان فنسان دي بول', groupAr: 'سنتر الإسكندرية', perfectExams: 8, examsSolved: 15, homeworkRate: '88%' }
    ]
  },

  // Course 3: Grade 11
  'course-bio-201_all': {
    courseId: 'course-bio-201',
    groupId: 'all',
    leagueTitle: 'دوري أساسيات الأحياء 2 ثانوي - د. سلمى السيد',
    courseNameAr: 'أساسيات فسيولوجيا الإنسان والتنسيق الهرموني (2 ثانوي)',
    groupNameAr: 'جميع المجموعات',
    durationLabelAr: 'دوري فصلي (نصف سنة)',
    durationDays: 90,
    totalCompetitors: 980,
    roundDaysRemaining: 24,
    isActive: true,
    podium: [
      { 
        rank: 1, 
        nameAr: 'حبيبة أحمد الشافعي', 
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140&auto=format&fit=crop&q=80', 
        score: 3120, 
        streak: 15, 
        badge: 'صدارة الدفعة', 
        tier: 'Diamond', 
        schoolAr: 'مصر للغات الدولية',
        groupAr: 'سنتر المهندسين',
        perfectExams: 10,
        examsSolved: 12,
        homeworkRate: '100%',
        attendanceRate: '100%'
      },
      { 
        rank: 2, 
        nameAr: 'محمود عصام رضوان', 
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=140&auto=format&fit=crop&q=80', 
        score: 2840, 
        streak: 10, 
        badge: 'وصيف الدفعة', 
        tier: 'Gold', 
        schoolAr: 'التوفيقية الثانوية بنين',
        groupAr: 'أونلاين الدفعة',
        perfectExams: 8,
        examsSolved: 12,
        homeworkRate: '92%',
        attendanceRate: '95%'
      },
      { 
        rank: 3, 
        nameAr: 'أروى طارق نبيل', 
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=140&auto=format&fit=crop&q=80', 
        score: 2600, 
        streak: 8, 
        badge: 'المركز الثالث', 
        tier: 'Gold', 
        schoolAr: 'شبرا الرسمية لغات',
        groupAr: 'أونلاين الدفعة',
        perfectExams: 7,
        examsSolved: 11,
        homeworkRate: '88%',
        attendanceRate: '90%'
      }
    ],
    leaderboard: [
      { rank: 1, nameAr: 'حبيبة أحمد الشافعي', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', score: 3120, streak: 15, badge: 'صدارة الدفعة', tier: 'Diamond', schoolAr: 'مصر للغات الدولية', groupAr: 'سنتر المهندسين', perfectExams: 10, examsSolved: 12, homeworkRate: '100%' },
      { rank: 2, nameAr: 'محمود عصام رضوان', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', score: 2840, streak: 10, badge: 'وصيف الدفعة', tier: 'Gold', schoolAr: 'التوفيقية الثانوية بنين', groupAr: 'أونلاين الدفعة', perfectExams: 8, examsSolved: 12, homeworkRate: '92%' },
      { rank: 3, nameAr: 'أروى طارق نبيل', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', score: 2600, streak: 8, badge: 'المركز الثالث', tier: 'Gold', schoolAr: 'شبرا الرسمية لغات', groupAr: 'أونلاين الدفعة', perfectExams: 7, examsSolved: 11, homeworkRate: '88%' }
    ]
  }
};
