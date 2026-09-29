import React, { createContext, useContext, useState, useEffect } from 'react';

export const parseScheduleSlots = (scheduleStr = '', defaultHall = 'القاعة الرئيسية') => {
  const text = (scheduleStr || '').toLowerCase();
  const slots = [];
  const dayConfigs = [
    { key: 'saturday', ar: 'السبت', en: 'Saturday', regex: /السبت/ },
    { key: 'sunday', ar: 'الأحد', en: 'Sunday', regex: /(الأحد|الاحد|الحد)/ },
    { key: 'monday', ar: 'الاثنين', en: 'Monday', regex: /(الإثنين|الاثنين|الاتنين)/ },
    { key: 'tuesday', ar: 'الثلاثاء', en: 'Tuesday', regex: /(الثلاثاء|الثلاثا|التلات)/ },
    { key: 'wednesday', ar: 'الأربعاء', en: 'Wednesday', regex: /(الأربعاء|الاربعاء|الاربعا)/ },
    { key: 'thursday', ar: 'الخميس', en: 'Thursday', regex: /الخميس/ },
    { key: 'friday', ar: 'الجمعة', en: 'Friday', regex: /الجمعة/ },
  ];

  let start = '16:00';
  let end = '18:00';
  if (text.includes('6') || text.includes('٦')) {
    start = '18:00'; end = '20:00';
  } else if (text.includes('5') || text.includes('٥')) {
    start = '17:00'; end = '19:00';
  } else if (text.includes('2') || text.includes('٢')) {
    start = '14:00'; end = '16:30';
  } else if (text.includes('10') || text.includes('١٠')) {
    start = '10:00'; end = '12:00';
  }

  dayConfigs.forEach(dc => {
    if (dc.regex.test(text)) {
      slots.push({
        id: `slot-${dc.key}-${Math.random().toString(36).slice(2, 7)}`,
        day: dc.key,
        dayAr: dc.ar,
        dayEn: dc.en,
        startTime: start,
        endTime: end,
        hall: defaultHall || 'القاعة الرئيسية'
      });
    }
  });

  if (slots.length === 0) {
    slots.push({
      id: `slot-sun-${Math.random().toString(36).slice(2, 7)}`,
      day: 'sunday',
      dayAr: 'الأحد',
      dayEn: 'Sunday',
      startTime: start,
      endTime: end,
      hall: defaultHall || 'القاعة الرئيسية'
    });
  }
  return slots;
};

const INITIAL_GROUPS = [
  {
    id: 'cls-1',
    nameAr: 'أحياء 3 ثانوي 2026 — مجموعة الدقي النخبة',
    nameEn: 'Thanawya Amma Biology 2026 — Dokki Elite Cohort',
    subjectAr: 'الأحياء (الثانوية العامة)',
    subjectEn: 'Biology',
    gradeAr: 'الصف الثالث الثانوي',
    gradeEn: 'Grade 12',
    scheduleAr: 'الأحد والأربعاء 4:00 عصراً',
    scheduleEn: 'Sundays & Wednesdays 4:00 PM',
    centerName: 'سنتر الرواد التعليمي — الدقي',
    hallName: 'قاعة 1 (المحاضرات الكبرى)',
    priceEgp: 450,
    joinCode: 'BIO-DK-2026',
    teacherNameAr: 'د. سلمى السيد',
    teacherNameEn: 'Dr. Salma El-Sayed',
    scheduleSlots: [
      { id: 'slot-1-1', day: 'sunday', dayAr: 'الأحد', dayEn: 'Sunday', startTime: '16:00', endTime: '18:00', hall: 'قاعة 1' },
      { id: 'slot-1-2', day: 'wednesday', dayAr: 'الأربعاء', dayEn: 'Wednesday', startTime: '16:00', endTime: '18:00', hall: 'قاعة 1' }
    ]
  },
  {
    id: 'cls-2',
    nameAr: 'فيزياء الثانوية العامة — بنك أفكار كيرشوف والدينامو',
    nameEn: '3rd Secondary Physics — Kirchhoff & Dynamo Problem Bank',
    subjectAr: 'الفيزياء (الثانوية العامة)',
    subjectEn: 'Physics',
    gradeAr: 'الصف الثالث الثانوي',
    gradeEn: 'Grade 12',
    scheduleAr: 'الإثنين والخميس 6:00 مساءً',
    scheduleEn: 'Mondays & Thursdays 6:00 PM',
    centerName: 'سنتر النخبة التعليمي — مدينة نصر',
    hallName: 'قاعة أينشتاين للمتفوقين',
    priceEgp: 500,
    joinCode: 'PHY-OLYMP-26',
    teacherNameAr: 'د. سلمى السيد',
    teacherNameEn: 'Dr. Salma El-Sayed',
    scheduleSlots: [
      { id: 'slot-2-1', day: 'monday', dayAr: 'الاثنين', dayEn: 'Monday', startTime: '18:00', endTime: '20:00', hall: 'قاعة أينشتاين' },
      { id: 'slot-2-2', day: 'thursday', dayAr: 'الخميس', dayEn: 'Thursday', startTime: '18:00', endTime: '20:00', hall: 'قاعة أينشتاين' }
    ]
  },
  {
    id: 'cls-3',
    nameAr: 'أحياء ثانية ثانوي — التغذية والنقل في الكائنات الحية',
    nameEn: 'Grade 11 Biology — Nutrition & Transport',
    subjectAr: 'الأحياء (الصف الثاني الثانوي)',
    subjectEn: 'Biology',
    gradeAr: 'الصف الثاني الثانوي',
    gradeEn: 'Grade 11',
    scheduleAr: 'الثلاثاء 5:00 مساءً',
    scheduleEn: 'Tuesdays 5:00 PM',
    centerName: 'سنتر الأوائل — المهندسين',
    hallName: 'قاعة 3 (المعمل الذكي)',
    priceEgp: 380,
    joinCode: 'BIO-611-FND',
    teacherNameAr: 'د. سلمى السيد',
    teacherNameEn: 'Dr. Salma El-Sayed',
    scheduleSlots: [
      { id: 'slot-3-1', day: 'tuesday', dayAr: 'الثلاثاء', dayEn: 'Tuesday', startTime: '17:00', endTime: '19:00', hall: 'قاعة 3' }
    ]
  },
  {
    id: 'cls-4',
    nameAr: 'مكثف ومراجعة الأحياء الشاملة — السبت',
    nameEn: 'Saturday Intensive Biology Revision',
    subjectAr: 'الأحياء (الثانوية العامة)',
    subjectEn: 'Biology',
    gradeAr: 'الصف الثالث الثانوي',
    gradeEn: 'Grade 12',
    scheduleAr: 'السبت 2:00 ظهراً',
    scheduleEn: 'Saturdays 2:00 PM',
    centerName: 'سنتر الأهرام التعليمي — الجيزة',
    hallName: 'المدرج الرئيسي',
    priceEgp: 420,
    joinCode: 'BIO-SAT-MAX',
    teacherNameAr: 'د. سلمى السيد',
    teacherNameEn: 'Dr. Salma El-Sayed',
    scheduleSlots: [
      { id: 'slot-4-1', day: 'saturday', dayAr: 'السبت', dayEn: 'Saturday', startTime: '14:00', endTime: '16:30', hall: 'المدرج الرئيسي' }
    ]
  }
];

const INITIAL_SCHEDULE_NOTES = {
  tuesday: [
    {
      id: 'note-tue-1',
      text: 'تجهيز كويز التغذية الذاتية وطباعة نماذج الإجابة لسنتر الأوائل',
      time: '16:30',
      priority: 'high',
      isDone: false,
      createdAt: '2026-09-29'
    },
    {
      id: 'note-tue-2',
      text: 'تسليم كشوف الحضور والغياب لإدارة السنتر بعد انتهاء الحصة',
      time: '19:15',
      priority: 'medium',
      isDone: true,
      createdAt: '2026-09-29'
    }
  ],
  sunday: [
    {
      id: 'note-sun-1',
      text: 'مراجعة واجب الفصل الأول مع مساعدي التدريس قبل دخول القاعة',
      time: '15:30',
      priority: 'high',
      isDone: false,
      createdAt: '2026-09-27'
    }
  ],
  monday: [
    {
      id: 'note-mon-1',
      text: 'إحضار نماذج دوائر كيرشوف للشرح العملي',
      time: '17:30',
      priority: 'medium',
      isDone: false,
      createdAt: '2026-09-28'
    }
  ],
  wednesday: [
    {
      id: 'note-wed-1',
      text: 'تكريم الطلاب أصحاب العلامات الكاملة في الكويز السابق',
      time: '17:45',
      priority: 'high',
      isDone: false,
      createdAt: '2026-09-25'
    }
  ],
  thursday: [
    {
      id: 'note-thu-1',
      text: 'إرسال درجات الامتحان الأسبوعي لأولياء الأمور عبر الرسائل',
      time: '20:30',
      priority: 'high',
      isDone: false,
      createdAt: '2026-09-24'
    }
  ],
  saturday: [
    {
      id: 'note-sat-1',
      text: 'توزيع مذكرة المراجعة المكثفة واستلام اشتراكات الشهر الجديد',
      time: '13:45',
      priority: 'medium',
      isDone: false,
      createdAt: '2026-09-26'
    }
  ]
};

const INITIAL_ENROLLED_STUDENTS = {
  'cls-1': [
    {
      id: 'std-1',
      name: 'Omar Tarek El-Kady',
      nameAr: 'عمر طارق القاضي',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      phone: '+20 102 458 9912',
      parentName: 'Eng. Tarek El-Kady',
      parentNameAr: 'م. طارق القاضي',
      parentPhone: '+20 100 123 4567',
      attendanceRate: 96.4,
      attendedSessions: 14,
      totalSessions: 14,
      avgQuizScore: 91.2,
      streakDays: 14,
      status: 'Excellence'
    },
    {
      id: 'std-2',
      name: 'Sarah Khaled Mansour',
      nameAr: 'سارة خالد منصور',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      phone: '+20 111 876 5432',
      parentName: 'Dr. Khaled Mansour',
      parentNameAr: 'د. خالد منصور',
      parentPhone: '+20 122 987 6543',
      attendanceRate: 98.0,
      attendedSessions: 21,
      totalSessions: 21,
      avgQuizScore: 95.8,
      streakDays: 21,
      status: 'Top 1%'
    },
    {
      id: 'std-3',
      name: 'Kareem Mostafa Badawi',
      nameAr: 'كريم مصطفى بدوي',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      phone: '+20 106 332 1980',
      parentName: 'Mostafa Badawi',
      parentNameAr: 'أ. مصطفى بدوي',
      parentPhone: '+20 106 554 4332',
      attendanceRate: 82.5,
      attendedSessions: 11,
      totalSessions: 14,
      avgQuizScore: 68.0,
      streakDays: 3,
      status: 'Needs Support'
    },
    {
      id: 'std-4',
      name: 'Mariam Adel Shenouda',
      nameAr: 'مريم عادل شنودة',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      phone: '+20 120 445 7789',
      parentName: 'Adel Shenouda',
      parentNameAr: 'أ. عادل شنودة',
      parentPhone: '+20 122 334 5566',
      attendanceRate: 92.0,
      attendedSessions: 13,
      totalSessions: 14,
      avgQuizScore: 87.5,
      streakDays: 9,
      status: 'Good'
    }
  ],
  'cls-2': [
    {
      id: 'std-1',
      name: 'Omar Tarek El-Kady',
      nameAr: 'عمر طارق القاضي',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      phone: '+20 102 458 9912',
      parentName: 'Eng. Tarek El-Kady',
      parentNameAr: 'م. طارق القاضي',
      parentPhone: '+20 100 123 4567',
      attendanceRate: 94.0,
      attendedSessions: 12,
      totalSessions: 12,
      avgQuizScore: 89.0,
      streakDays: 14,
      status: 'Excellence'
    },
    {
      id: 'std-2',
      name: 'Sarah Khaled Mansour',
      nameAr: 'سارة خالد منصور',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      phone: '+20 111 876 5432',
      parentName: 'Dr. Khaled Mansour',
      parentNameAr: 'د. خالد منصور',
      parentPhone: '+20 122 987 6543',
      attendanceRate: 97.0,
      attendedSessions: 12,
      totalSessions: 12,
      avgQuizScore: 94.5,
      streakDays: 21,
      status: 'Top 1%'
    }
  ],
  'cls-3': [
    {
      id: 'std-1',
      name: 'Omar Tarek El-Kady',
      nameAr: 'عمر طارق القاضي',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      phone: '+20 102 458 9912',
      parentName: 'Eng. Tarek El-Kady',
      parentNameAr: 'م. طارق القاضي',
      parentPhone: '+20 100 123 4567',
      attendanceRate: 98.0,
      attendedSessions: 11,
      totalSessions: 11,
      avgQuizScore: 92.5,
      streakDays: 14,
      status: 'Top 1%'
    },
    {
      id: 'std-5',
      name: 'Youssef Ahmed El-Shennawy',
      nameAr: 'يوسف أحمد الشناوي',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      phone: '+20 109 988 7766',
      parentName: 'Ahmed El-Shennawy',
      parentNameAr: 'أحمد الشناوي',
      parentPhone: '+20 100 998 8776',
      attendanceRate: 90.0,
      attendedSessions: 10,
      totalSessions: 11,
      avgQuizScore: 85.0,
      streakDays: 8,
      status: 'Good'
    }
  ]
};

const INITIAL_PENDING_STUDENTS = {
  'cls-1': [
    {
      id: 'pnd-1',
      name: 'Youssef Ahmed El-Shennawy',
      nameAr: 'يوسف أحمد الشناوي',
      phone: '+20 109 988 7766',
      parentNameAr: 'أحمد الشناوي',
      parentPhone: '+20 100 998 8776',
      requestedAt: 'اليوم، 06:30 م',
      method: 'مسح الباركود (QR Code)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'pnd-2',
      name: 'Salma Mahmoud Ezzat',
      nameAr: 'سلمى محمود عزت',
      phone: '+20 115 544 3322',
      parentNameAr: 'محمود عزت',
      parentPhone: '+20 111 223 3445',
      requestedAt: 'أمس، 09:15 م',
      method: 'دعوة مباشرة بالبحث',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80'
    }
  ],
  'cls-2': [
    {
      id: 'pnd-3',
      name: 'Ahmed Mohamed Fathy',
      nameAr: 'أحمد محمد فتحي',
      phone: '+20 128 877 6655',
      parentNameAr: 'محمد فتحي',
      parentPhone: '+20 122 887 7665',
      requestedAt: 'اليوم، 02:40 م',
      method: 'مسح الباركود (QR Code)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
    }
  ],
  'cls-3': []
};

// Registered students database available for teacher search invitations
export const ALL_REGISTERED_STUDENTS = [
  { id: 'all-std-1', nameAr: 'عمر طارق القاضي', nameEn: 'Omar Tarek El-Kady', phone: '+20 102 458 9912', parentNameAr: 'م. طارق القاضي', parentPhone: '+20 100 123 4567', gradeAr: 'الصف الثالث الثانوي', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80' },
  { id: 'all-std-2', nameAr: 'سارة خالد منصور', nameEn: 'Sarah Khaled Mansour', phone: '+20 111 876 5432', parentNameAr: 'د. خالد منصور', parentPhone: '+20 122 987 6543', gradeAr: 'الصف الثالث الثانوي', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { id: 'all-std-3', nameAr: 'كريم مصطفى بدوي', nameEn: 'Kareem Mostafa Badawi', phone: '+20 106 332 1980', parentNameAr: 'أ. مصطفى بدوي', parentPhone: '+20 106 554 4332', gradeAr: 'الصف الثالث الثانوي', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { id: 'all-std-4', nameAr: 'مريم عادل شنودة', nameEn: 'Mariam Adel Shenouda', phone: '+20 120 445 7789', parentNameAr: 'أ. عادل شنودة', parentPhone: '+20 122 334 5566', gradeAr: 'الصف الثالث الثانوي', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { id: 'all-std-5', nameAr: 'يوسف أحمد الشناوي', nameEn: 'Youssef Ahmed El-Shennawy', phone: '+20 109 988 7766', parentNameAr: 'أحمد الشناوي', parentPhone: '+20 100 998 8776', gradeAr: 'الصف الثاني الثانوي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
  { id: 'all-std-6', nameAr: 'سلمى محمود عزت', nameEn: 'Salma Mahmoud Ezzat', phone: '+20 115 544 3322', parentNameAr: 'محمود عزت', parentPhone: '+20 111 223 3445', gradeAr: 'الصف الثالث الثانوي', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80' },
  { id: 'all-std-7', nameAr: 'أحمد محمد فتحي', nameEn: 'Ahmed Mohamed Fathy', phone: '+20 128 877 6655', parentNameAr: 'محمد فتحي', parentPhone: '+20 122 887 7665', gradeAr: 'الصف الثالث الثانوي', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' },
  { id: 'all-std-8', nameAr: 'نورهان هاني الجوهري', nameEn: 'Nourhan Hany El-Gohary', phone: '+20 101 122 3344', parentNameAr: 'هاني الجوهري', parentPhone: '+20 100 556 6778', gradeAr: 'الصف الثاني الثانوي', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
  { id: 'all-std-9', nameAr: 'عبدالرحمن حسن مصطفى', nameEn: 'Abdulrahman Hassan', phone: '+20 100 012 3456', parentNameAr: 'حسن مصطفى', parentPhone: '+20 101 123 4567', gradeAr: 'الصف الثالث الثانوي', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' }
];

export const INITIAL_STUDENT_STUDY_SESSIONS = [
  {
    id: 'study-1',
    day: 'tuesday',
    subject: 'الأحياء (الثانوية العامة)',
    title: 'مراجعة التغذية الذاتية وحل 30 سؤال بنك الأسئلة',
    startTime: '20:00',
    endTime: '22:00',
    durationMinutes: 120,
    isCompleted: false,
    color: '#1588C7',
    notes: 'التركيز على تفاعلات البناء الضوئي ومخطط الطاقة'
  },
  {
    id: 'study-2',
    day: 'wednesday',
    subject: 'الفيزياء (الثانوية العامة)',
    title: 'حل شيت مسائل قانوني كيرشوف وتطبيقات المقاومات',
    startTime: '18:30',
    endTime: '20:30',
    durationMinutes: 120,
    isCompleted: true,
    color: '#8B5CF6',
    notes: 'مراجعة الحالات الخاصة لقانون كيرشوف الثاني'
  },
  {
    id: 'study-3',
    day: 'thursday',
    subject: 'الكيمياء',
    title: 'مذاكرة الاتزان الكيميائي والعوامل المؤثرة على سرعة التفاعل',
    startTime: '17:00',
    endTime: '19:00',
    durationMinutes: 120,
    isCompleted: false,
    color: '#10B981',
    notes: 'حل تدريبات قاعدة لوشاتيليه'
  },
  {
    id: 'study-4',
    day: 'sunday',
    subject: 'اللغة العربية',
    title: 'مراجعة النحو: اسم الفاعل وصيغ المبالغة وإعمالهما',
    startTime: '19:00',
    endTime: '20:30',
    durationMinutes: 90,
    isCompleted: false,
    color: '#F59E0B',
    notes: 'حل 20 نموذج من تدريبات الامتحان'
  }
];

const GroupsContext = createContext(null);

export const GroupsProvider = ({ children }) => {
  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem('motafawweq_groups');
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [enrolledStudents, setEnrolledStudents] = useState(() => {
    const saved = localStorage.getItem('motafawweq_enrolled_students');
    return saved ? JSON.parse(saved) : INITIAL_ENROLLED_STUDENTS;
  });

  const [pendingStudents, setPendingStudents] = useState(() => {
    const saved = localStorage.getItem('motafawweq_pending_students');
    return saved ? JSON.parse(saved) : INITIAL_PENDING_STUDENTS;
  });

  // Track active group for Student Roster view
  const [activeGroupId, setActiveGroupId] = useState(() => {
    const saved = localStorage.getItem('motafawweq_active_group_id');
    return saved || 'cls-1';
  });

  // Schedule Notes per day
  const [scheduleNotes, setScheduleNotes] = useState(() => {
    const saved = localStorage.getItem('motafawweq_schedule_notes');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE_NOTES;
  });

  // Student Study Sessions (Self-Study slots)
  const [studentStudySessions, setStudentStudySessions] = useState(() => {
    const saved = localStorage.getItem('motafawweq_student_study_sessions');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_STUDY_SESSIONS;
  });

  // Global toast message notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    localStorage.setItem('motafawweq_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('motafawweq_enrolled_students', JSON.stringify(enrolledStudents));
  }, [enrolledStudents]);

  useEffect(() => {
    localStorage.setItem('motafawweq_pending_students', JSON.stringify(pendingStudents));
  }, [pendingStudents]);

  useEffect(() => {
    localStorage.setItem('motafawweq_active_group_id', activeGroupId);
  }, [activeGroupId]);

  useEffect(() => {
    localStorage.setItem('motafawweq_schedule_notes', JSON.stringify(scheduleNotes));
  }, [scheduleNotes]);

  useEffect(() => {
    localStorage.setItem('motafawweq_student_study_sessions', JSON.stringify(studentStudySessions));
  }, [studentStudySessions]);

  // Add new group
  const addGroup = (groupData) => {
    const randomCodeSuffix = Math.floor(100 + Math.random() * 900);
    const generatedCode = groupData.joinCode?.trim() || `GRP-${Date.now().toString().slice(-4)}-${randomCodeSuffix}`;
    const slots = (Array.isArray(groupData.scheduleSlots) && groupData.scheduleSlots.length > 0)
      ? groupData.scheduleSlots
      : parseScheduleSlots(groupData.scheduleAr, groupData.hallName || 'القاعة الرئيسية');

    const newGroup = {
      id: `cls-${Date.now()}`,
      nameAr: groupData.nameAr || 'مجموعة دراسية جديدة',
      nameEn: groupData.nameEn || groupData.nameAr || 'New Study Group',
      subjectAr: groupData.subjectAr || 'المادة الدراسية',
      subjectEn: groupData.subjectEn || groupData.subjectAr || 'Subject',
      gradeAr: groupData.gradeAr || 'الصف الثالث الثانوي',
      gradeEn: groupData.gradeEn || '3rd Secondary',
      scheduleAr: groupData.scheduleAr || 'الأحد والأربعاء',
      scheduleEn: groupData.scheduleEn || groupData.scheduleAr,
      centerName: groupData.centerName || 'السنتر التعليمي',
      hallName: groupData.hallName || 'القاعة الرئيسية',
      priceEgp: Number(groupData.priceEgp) || 400,
      joinCode: generatedCode,
      teacherNameAr: 'د. سلمى السيد',
      teacherNameEn: 'Dr. Salma El-Sayed',
      scheduleSlots: slots
    };

    setGroups(prev => [newGroup, ...prev]);
    setEnrolledStudents(prev => ({ ...prev, [newGroup.id]: [] }));
    setPendingStudents(prev => ({ ...prev, [newGroup.id]: [] }));
    showToast('تم إنشاء المجموعة وإضافتها تلقائياً لجدول الحصص الأسبوعي!');
    return newGroup;
  };

  // Update existing group
  const updateGroup = (groupId, updatedData) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const slots = (Array.isArray(updatedData.scheduleSlots) && updatedData.scheduleSlots.length > 0)
          ? updatedData.scheduleSlots
          : (updatedData.scheduleAr ? parseScheduleSlots(updatedData.scheduleAr, updatedData.hallName || g.hallName) : g.scheduleSlots);

        return { ...g, ...updatedData, scheduleSlots: slots };
      }
      return g;
    }));
    showToast('تم حفظ تعديلات المجموعة وتحديث جدول المواعيد تلقائياً!');
  };

  // Schedule Notes CRUD
  const addScheduleNote = (dayKey, noteData) => {
    const newNote = {
      id: `note-${Date.now()}`,
      text: noteData.text,
      time: noteData.time || '16:00',
      priority: noteData.priority || 'medium',
      isDone: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setScheduleNotes(prev => ({
      ...prev,
      [dayKey]: [newNote, ...(prev[dayKey] || [])]
    }));
    showToast('تمت إضافة الملاحظة بنجاح إلى جدول المواعيد!');
    return newNote;
  };

  const toggleScheduleNote = (dayKey, noteId) => {
    setScheduleNotes(prev => ({
      ...prev,
      [dayKey]: (prev[dayKey] || []).map(n => n.id === noteId ? { ...n, isDone: !n.isDone } : n)
    }));
  };

  const deleteScheduleNote = (dayKey, noteId) => {
    setScheduleNotes(prev => ({
      ...prev,
      [dayKey]: (prev[dayKey] || []).filter(n => n.id !== noteId)
    }));
    showToast('تم حذف الملاحظة بنجاح.');
  };

  // Student Study Sessions Handlers
  const addStudySession = (session) => {
    const newSession = {
      id: `study-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      day: session.day || 'tuesday',
      subject: session.subject || 'مذاكرة عامة',
      title: session.title || 'جلسة استذكار ومراجعة',
      startTime: session.startTime || '19:00',
      endTime: session.endTime || '21:00',
      durationMinutes: Number(session.durationMinutes) || 120,
      isCompleted: false,
      color: session.color || '#1588C7',
      notes: session.notes || ''
    };
    setStudentStudySessions(prev => [newSession, ...prev]);
    showToast(`تمت إضافة جلسة مذاكرة «${newSession.subject}» إلى جدولك بنجاح!`);
    return newSession;
  };

  const updateStudySession = (id, updatedData) => {
    setStudentStudySessions(prev =>
      prev.map(s => s.id === id ? { ...s, ...updatedData } : s)
    );
    showToast('تم تحديث جلسة المذاكرة بنجاح.');
  };

  const toggleStudySession = (id) => {
    setStudentStudySessions(prev =>
      prev.map(s => s.id === id ? { ...s, isCompleted: !s.isCompleted } : s)
    );
  };

  const deleteStudySession = (id) => {
    setStudentStudySessions(prev => prev.filter(s => s.id !== id));
    showToast('تم حذف جلسة المذاكرة من جدولك.');
  };

  // Delete group
  const deleteGroup = (groupId) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
    setEnrolledStudents(prev => {
      const copy = { ...prev };
      delete copy[groupId];
      return copy;
    });
    setPendingStudents(prev => {
      const copy = { ...prev };
      delete copy[groupId];
      return copy;
    });
    if (activeGroupId === groupId) {
      const remaining = groups.filter(g => g.id !== groupId);
      if (remaining.length > 0) setActiveGroupId(remaining[0].id);
    }
    showToast('تم حذف المجموعة وسجلها بنجاح!');
  };

  // Accept pending student
  const acceptPendingStudent = (groupId, pendingId) => {
    const list = pendingStudents[groupId] || [];
    const student = list.find(s => s.id === pendingId);
    if (!student) return;

    // Convert to enrolled student
    const newEnrolled = {
      id: student.id.startsWith('pnd-') ? `std-${Date.now()}` : student.id,
      name: student.name || student.nameAr,
      nameAr: student.nameAr,
      avatar: student.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      phone: student.phone,
      parentName: student.parentName || student.parentNameAr,
      parentNameAr: student.parentNameAr,
      parentPhone: student.parentPhone,
      attendanceRate: 100,
      attendedSessions: 1,
      totalSessions: 1,
      avgQuizScore: 90,
      streakDays: 1,
      status: 'Good'
    };

    setEnrolledStudents(prev => ({
      ...prev,
      [groupId]: [newEnrolled, ...(prev[groupId] || [])]
    }));

    setPendingStudents(prev => ({
      ...prev,
      [groupId]: (prev[groupId] || []).filter(s => s.id !== pendingId)
    }));

    showToast(`تم قبول الطالب «${student.nameAr}» وإضافته لقائمة طلاب المجموعة!`);
  };

  // Reject pending student
  const rejectPendingStudent = (groupId, pendingId) => {
    const list = pendingStudents[groupId] || [];
    const student = list.find(s => s.id === pendingId);
    setPendingStudents(prev => ({
      ...prev,
      [groupId]: (prev[groupId] || []).filter(s => s.id !== pendingId)
    }));
    showToast(`تم رفض طلب انضمام «${student?.nameAr || 'الطالب'}».`, 'warning');
  };

  // Remove enrolled student from group
  const removeStudentFromGroup = (groupId, studentId) => {
    const list = enrolledStudents[groupId] || [];
    const student = list.find(s => s.id === studentId);
    setEnrolledStudents(prev => ({
      ...prev,
      [groupId]: (prev[groupId] || []).filter(s => s.id !== studentId)
    }));
    showToast(`تم إلغاء قيد الطالب «${student?.nameAr || ''}» من هذه المجموعة.`);
  };

  // Invite student directly by teacher search
  const inviteStudentToGroup = (groupId, studentData) => {
    const currentEnrolled = enrolledStudents[groupId] || [];
    const currentPending = pendingStudents[groupId] || [];

    if (currentEnrolled.some(s => s.nameAr === studentData.nameAr || s.phone === studentData.phone)) {
      showToast('هذا الطالب مسجل ومقبول بالفعل في هذه المجموعة!', 'warning');
      return false;
    }
    if (currentPending.some(s => s.nameAr === studentData.nameAr || s.phone === studentData.phone)) {
      showToast('يوجد طلب دعوة معلق بالفعل لهذا الطالب!', 'warning');
      return false;
    }

    const pendingItem = {
      id: `pnd-${Date.now()}`,
      name: studentData.nameEn || studentData.nameAr,
      nameAr: studentData.nameAr,
      phone: studentData.phone,
      parentNameAr: studentData.parentNameAr || 'ولي الأمر',
      parentPhone: studentData.parentPhone || studentData.phone,
      requestedAt: 'الآن',
      method: 'دعوة مباشرة من المعلم',
      avatar: studentData.avatar
    };

    setPendingStudents(prev => ({
      ...prev,
      [groupId]: [pendingItem, ...(prev[groupId] || [])]
    }));

    showToast(`تم إرسال دعوة الانضمام للطالب «${studentData.nameAr}» بنجاح!`);
    return true;
  };

  // Student scans QR or submits join code
  const studentJoinByCode = (joinCode, studentProfile = {}) => {
    const cleanCode = joinCode.trim().toUpperCase();
    const group = groups.find(g => g.joinCode.toUpperCase() === cleanCode);
    if (!group) {
      return { success: false, error: 'كود المجموعة غير صحيح أو انتهت صلاحيته' };
    }

    const currentEnrolled = enrolledStudents[group.id] || [];
    const currentPending = pendingStudents[group.id] || [];
    const studentName = studentProfile.nameAr || 'عمر طارق القاضي';
    const studentPhone = studentProfile.phone || '+20 102 458 9912';

    if (currentEnrolled.some(s => s.nameAr === studentName || s.phone === studentPhone)) {
      return { success: false, error: 'أنت مسجل ومقبول بالفعل في هذه المجموعة!' };
    }
    if (currentPending.some(s => s.nameAr === studentName || s.phone === studentPhone)) {
      return { success: false, error: 'طلب انضمامك مسجل بالفعل وقيد انتظار موافقة المعلم!' };
    }

    const newRequest = {
      id: `pnd-${Date.now()}`,
      name: studentProfile.name || studentName,
      nameAr: studentName,
      phone: studentPhone,
      parentNameAr: studentProfile.parentNameAr || 'م. طارق القاضي',
      parentPhone: studentProfile.parentPhone || '+20 100 123 4567',
      requestedAt: 'الآن',
      method: 'مسح الباركود السريع (QR Scan)',
      avatar: studentProfile.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80'
    };

    setPendingStudents(prev => ({
      ...prev,
      [group.id]: [newRequest, ...(prev[group.id] || [])]
    }));

    showToast(`تم إرسال طلب الانضمام لمجموعة «${group.nameAr}» بنجاح!`);
    return { success: true, group };
  };

  const getActiveGroup = () => {
    return groups.find(g => g.id === activeGroupId) || groups[0] || null;
  };

  return (
    <GroupsContext.Provider
      value={{
        groups,
        activeGroupId,
        setActiveGroupId,
        getActiveGroup,
        addGroup,
        updateGroup,
        deleteGroup,
        enrolledStudents,
        pendingStudents,
        acceptPendingStudent,
        rejectPendingStudent,
        removeStudentFromGroup,
        inviteStudentToGroup,
        studentJoinByCode,
        scheduleNotes,
        addScheduleNote,
        toggleScheduleNote,
        deleteScheduleNote,
        studentStudySessions,
        addStudySession,
        updateStudySession,
        toggleStudySession,
        deleteStudySession,
        showToast
      }}
    >
      {children}

      {/* Floating Global Notification Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 100000,
          backgroundColor: toast.type === 'warning' ? '#B45309' : '#06254E',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.25), 0 0 0 1px rgba(21, 136, 199, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: '700',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <span>{toast.message}</span>
        </div>
      )}
    </GroupsContext.Provider>
  );
};

export const useGroups = () => {
  const ctx = useContext(GroupsContext);
  if (!ctx) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return ctx;
};
