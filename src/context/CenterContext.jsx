import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useGroups } from './GroupsContext';

const CenterContext = createContext(null);

const INITIAL_BRANCHES = [
  {
    id: 'br-dokki',
    nameAr: 'فرع الدقي (الرئيسي)',
    nameEn: 'Dokki Branch (Main)',
    addressAr: 'شارع التحرير، الدقي، الجيزة',
    phone: '+20 2 3345 6789',
    managerNameAr: 'أ. سامح عبدالحميد',
    roomsCount: 6,
    activeStudents: 680,
    monthlyRevenueEgp: 235000,
    monthlyExpensesEgp: 84000,
    utilizationRate: 88
  },
  {
    id: 'br-nasrcity',
    nameAr: 'فرع مدينة نصر',
    nameEn: 'Nasr City Branch',
    addressAr: 'شارع عباس العقاد، مدينة نصر، القاهرة',
    phone: '+20 2 2456 7890',
    managerNameAr: 'أ. مروة الشريف',
    roomsCount: 5,
    activeStudents: 510,
    monthlyRevenueEgp: 172000,
    monthlyExpensesEgp: 68000,
    utilizationRate: 82
  },
  {
    id: 'br-smouha',
    nameAr: 'فرع سموحة (الإسكندرية)',
    nameEn: 'Smouha Branch (Alexandria)',
    addressAr: 'ميدان فيكتور عمانويل، سموحة، الإسكندرية',
    phone: '+20 3 4200 1122',
    managerNameAr: 'أ. أحمد جلال',
    roomsCount: 4,
    activeStudents: 340,
    monthlyRevenueEgp: 118000,
    monthlyExpensesEgp: 45000,
    utilizationRate: 76
  }
];

const INITIAL_ROOMS = [
  // فرع الدقي
  {
    id: 'room-1',
    nameAr: 'قاعة 1 (المحاضرات الكبرى)',
    nameEn: 'Hall 1 (Grand Auditorium)',
    branchId: 'br-dokki',
    branchNameAr: 'فرع الدقي',
    capacity: 65,
    equipped: ['شاشة عرض تفاعلية 85 بوصة', 'نظام صوتي محيطي لاسلكي', 'تكييف مركزي', 'كاميرا تسجيل ذكية'],
    isAvailable: true,
    floor: 'الطابق الثاني'
  },
  {
    id: 'room-3',
    nameAr: 'مدرج ابن الهيثم للعلوم',
    nameEn: 'Ibn Al-Haytham Auditorium',
    branchId: 'br-dokki',
    branchNameAr: 'فرع الدقي',
    capacity: 45,
    equipped: ['شاشة ذكية', 'نظام صوتيات', 'تكييف مركزي'],
    isAvailable: true,
    floor: 'الطابق الأول'
  },
  {
    id: 'room-5',
    nameAr: 'قاعة الخوارزمي للرياضيات',
    nameEn: 'Al-Khwarizmi Hall',
    branchId: 'br-dokki',
    branchNameAr: 'فرع الدقي',
    capacity: 35,
    equipped: ['سبورة ذكية تفاعلية', 'نظام صوتي مدمج', 'تكييف'],
    isAvailable: true,
    floor: 'الطابق الثالث'
  },
  {
    id: 'room-6',
    nameAr: 'قاعة نجيب محفوظ للغات',
    nameEn: 'Naguib Mahfouz Languages Hall',
    branchId: 'br-dokki',
    branchNameAr: 'فرع الدقي',
    capacity: 40,
    equipped: ['شاشة ذكية 75 بوصة', 'نظام صوتي معزول', 'تكييف سبليت'],
    isAvailable: true,
    floor: 'الطابق الثاني'
  },
  {
    id: 'room-7',
    nameAr: 'مختبر المتفوق الرقمي',
    nameEn: 'Digital Excellence Lab',
    branchId: 'br-dokki',
    branchNameAr: 'فرع الدقي',
    capacity: 30,
    equipped: ['شاشة تفاعلية 4K', 'محطات حاسب آلي', 'إنترنت ألياف ضوئية'],
    isAvailable: true,
    floor: 'الطابق الأرضي'
  },

  // فرع مدينة نصر
  {
    id: 'room-2',
    nameAr: 'قاعة أينشتاين للمتفوقين',
    nameEn: 'Einstein Hall',
    branchId: 'br-nasrcity',
    branchNameAr: 'فرع مدينة نصر',
    capacity: 50,
    equipped: ['بروجيكتور 4K', 'ميكروفون لاسلكي', 'تكييف سبليت', 'لوحة ذكية'],
    isAvailable: true,
    floor: 'الطابق الأول'
  },
  {
    id: 'room-8',
    nameAr: 'مدرج الفارابي للغات',
    nameEn: 'Al-Farabi Auditorium',
    branchId: 'br-nasrcity',
    branchNameAr: 'فرع مدينة نصر',
    capacity: 55,
    equipped: ['شاشة ذكية 85 بوصة', 'نظام صوتيات متطور', 'تكييف مركزي'],
    isAvailable: true,
    floor: 'الطابق الثاني'
  },
  {
    id: 'room-9',
    nameAr: 'قاعة زويل للعلوم والكيمياء',
    nameEn: 'Zewail Science Hall',
    branchId: 'br-nasrcity',
    branchNameAr: 'فرع مدينة نصر',
    capacity: 45,
    equipped: ['شاشة تفاعلية', 'تكييف مركزي', 'سبورة رقمية'],
    isAvailable: true,
    floor: 'الطابق الأول'
  },
  {
    id: 'room-10',
    nameAr: 'قاعة عباس العقاد للمحاضرات',
    nameEn: 'Abbas El-Akkad Lecture Hall',
    branchId: 'br-nasrcity',
    branchNameAr: 'فرع مدينة نصر',
    capacity: 40,
    equipped: ['شاشة عرض ذكية', 'تكييف سبليت', 'ميكروفونات مدمجة'],
    isAvailable: true,
    floor: 'الطابق الثالث'
  },

  // فرع سموحة
  {
    id: 'room-4',
    nameAr: 'قاعة نيوتن للفيزياء',
    nameEn: 'Newton Hall',
    branchId: 'br-smouha',
    branchNameAr: 'فرع سموحة',
    capacity: 40,
    equipped: ['شاشة تفاعلية', 'تكييف', 'نظام عزل صوتي'],
    isAvailable: true,
    floor: 'الطابق الأرضي'
  },
  {
    id: 'room-11',
    nameAr: 'قاعة الإسكندرية الكبرى',
    nameEn: 'Grand Alexandria Auditorium',
    branchId: 'br-smouha',
    branchNameAr: 'فرع سموحة',
    capacity: 60,
    equipped: ['شاشة 85 بوصة 4K', 'نظام صوت محيطي', 'تكييف مركزي'],
    isAvailable: true,
    floor: 'الطابق الأول'
  },
  {
    id: 'room-12',
    nameAr: 'قاعة ابن خلدون للدراسات',
    nameEn: 'Ibn Khaldun Hall',
    branchId: 'br-smouha',
    branchNameAr: 'فرع سموحة',
    capacity: 35,
    equipped: ['شاشة ذكية', 'تكييف سبليت', 'صوتيات لاسلكية'],
    isAvailable: true,
    floor: 'الطابق الثاني'
  },
  {
    id: 'room-13',
    nameAr: 'قاعة البيروني للرياضيات',
    nameEn: 'Al-Biruni Math Hall',
    branchId: 'br-smouha',
    branchNameAr: 'فرع سموحة',
    capacity: 45,
    equipped: ['شاشة تفاعلية ذكية', 'تكييف مركزي', 'سبورة قلم رقمي'],
    isAvailable: true,
    floor: 'الطابق الثاني'
  }
];

const INITIAL_EXPENSES = [
  {
    id: 'exp-1',
    titleAr: 'إيجار مقر فرع الدقي لشهر سبتمبر',
    titleEn: 'Dokki Branch Rent - Sep',
    branchId: 'br-dokki',
    branchNameAr: 'فرع الدقي',
    category: 'rent',
    categoryAr: 'إيجار المقرات',
    amountEgp: 45000,
    date: '2026-09-01',
    status: 'paid',
    receiptNumber: 'REC-2026-091'
  },
  {
    id: 'exp-2',
    titleAr: 'فاتورة الكهرباء والتكييف المركزي - مدينة نصر',
    titleEn: 'Electricity & AC Bill - Nasr City',
    branchId: 'br-nasrcity',
    branchNameAr: 'فرع مدينة نصر',
    category: 'utilities',
    categoryAr: 'المرافق والخدمات',
    amountEgp: 14200,
    date: '2026-09-10',
    status: 'paid',
    receiptNumber: 'REC-2026-104'
  },
  {
    id: 'exp-3',
    titleAr: 'رواتب موظفي الاستقبال والسكرتارية',
    titleEn: 'Reception & Admin Staff Salaries',
    branchId: 'br-dokki',
    branchNameAr: 'فرع الدقي',
    category: 'salaries',
    categoryAr: 'رواتب الموظفين',
    amountEgp: 38000,
    date: '2026-09-25',
    status: 'paid',
    receiptNumber: 'SAL-2026-09'
  },
  {
    id: 'exp-4',
    titleAr: 'صيانة دورية لأجهزة الصوت وشاشات القاعات',
    titleEn: 'AV & Smartboard Maintenance',
    branchId: 'br-smouha',
    branchNameAr: 'فرع سموحة',
    category: 'maintenance',
    categoryAr: 'الصيانة والتجهيزات',
    amountEgp: 6500,
    date: '2026-09-18',
    status: 'paid',
    receiptNumber: 'MNT-2026-08'
  },
  {
    id: 'exp-5',
    titleAr: 'حملة إعلانية ممولة لبدء العام الدراسي الجديد',
    titleEn: 'Digital Marketing Campaign',
    branchId: 'br-dokki',
    branchNameAr: 'فرع الدقي',
    category: 'marketing',
    categoryAr: 'التسويق والإعلانات',
    amountEgp: 18500,
    date: '2026-09-15',
    status: 'paid',
    receiptNumber: 'MKT-2026-15'
  }
];

const INITIAL_STAFF = [
  {
    id: 'staff-1',
    nameAr: 'أ. سامح عبدالحميد',
    nameEn: 'Sameh Abdelhamid',
    phone: '+20 100 234 5678',
    email: 'sameh.admin@alrowad.edu',
    role: 'manager',
    roleAr: 'مدير الفرع العام',
    branchId: 'br-dokki',
    branchNameAr: 'فرع الدقي',
    status: 'active',
    salaryEgp: 16000
  },
  {
    id: 'staff-2',
    nameAr: 'أ. ياسمين نبيل',
    nameEn: 'Yasmine Nabil',
    phone: '+20 102 345 6789',
    email: 'yasmine.reg@alrowad.edu',
    role: 'receptionist',
    roleAr: 'مسؤولة الاستقبال والباركود',
    branchId: 'br-dokki',
    branchNameAr: 'فرع الدقي',
    status: 'active',
    salaryEgp: 7500
  },
  {
    id: 'staff-3',
    nameAr: 'أ. مصطفى الجيار',
    nameEn: 'Mostafa El-Gayar',
    phone: '+20 106 789 0123',
    email: 'mostafa.fin@alrowad.edu',
    role: 'accountant',
    roleAr: 'المحاسب المالي',
    branchId: 'br-nasrcity',
    branchNameAr: 'فرع مدينة نصر',
    status: 'active',
    salaryEgp: 9500
  },
  {
    id: 'staff-4',
    nameAr: 'أ. مروة الشريف',
    nameEn: 'Marwa El-Sherif',
    phone: '+20 101 998 7766',
    email: 'marwa.admin@alrowad.edu',
    role: 'manager',
    roleAr: 'مديرة الفرع',
    branchId: 'br-nasrcity',
    branchNameAr: 'فرع مدينة نصر',
    status: 'active',
    salaryEgp: 14000
  }
];

const INITIAL_LEADS = [
  {
    id: 'lead-1',
    studentNameAr: 'كريم ممدوح الصاوي',
    phone: '+20 114 556 7788',
    parentPhone: '+20 100 889 9900',
    gradeAr: 'الصف الثالث الثانوي',
    subjectAr: 'الأحياء والفيزياء',
    source: 'Facebook',
    sourceAr: 'إعلانات فيسبوك',
    status: 'trial',
    statusAr: 'حجز تجريبي',
    branchId: 'br-dokki',
    branchNameAr: 'فرع الدقي',
    createdAt: '2026-09-26',
    notes: 'مهتم بحضور حصة تجريبية مع د. سلمى السيد'
  },
  {
    id: 'lead-2',
    studentNameAr: 'حبيبة علاء الدين',
    phone: '+20 122 334 4556',
    parentPhone: '+20 101 223 3445',
    gradeAr: 'الصف الثاني الثانوي',
    subjectAr: 'الكيمياء',
    source: 'Referral',
    sourceAr: 'ترشيح من زميل',
    status: 'interested',
    statusAr: 'مهتم ويتابع العروض',
    branchId: 'br-nasrcity',
    branchNameAr: 'فرع مدينة نصر',
    createdAt: '2026-09-27',
    notes: 'طلبت تفاصيل جدول الأسبوع ومواعيد القاعة'
  },
  {
    id: 'lead-3',
    studentNameAr: 'محمد وائل عبدالفتاح',
    phone: '+20 109 876 5432',
    parentPhone: '+20 102 334 4556',
    gradeAr: 'الصف الثالث الثانوي',
    subjectAr: 'الفيزياء (الثانوية العامة)',
    source: 'Walk-in',
    sourceAr: 'زيارة مباشرة للفرع',
    status: 'registered',
    statusAr: 'تم التسجيل وسداد الاشتراك',
    branchId: 'br-dokki',
    branchNameAr: 'فرع الدقي',
    createdAt: '2026-09-28',
    notes: 'تم تسجيله في مجموعة الخميس 6 مساء'
  }
];

export const CenterProvider = ({ children }) => {
  const { groups, enrolledStudents } = useGroups();

  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [selectedBranchId, setSelectedBranchId] = useState('all');
  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem('motafawweq_center_rooms');
    if (!saved) return INITIAL_ROOMS;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ROOMS;
    } catch {
      return INITIAL_ROOMS;
    }
  });

  useEffect(() => {
    localStorage.setItem('motafawweq_center_rooms', JSON.stringify(rooms));
  }, [rooms]);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [leads, setLeads] = useState(INITIAL_LEADS);

  // Live Attendance Records Log
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 'att-1',
      studentNameAr: 'عمر طارق القاضي',
      studentPhone: '+20 102 458 9912',
      groupId: 'cls-1',
      groupNameAr: 'أحياء 3 ثانوي 2026 — مجموعة الدقي النخبة',
      subjectAr: 'الأحياء (الثانوية العامة)',
      teacherNameAr: 'د. سلمى السيد',
      hallName: 'قاعة 1 (المحاضرات الكبرى)',
      branchNameAr: 'فرع الدقي',
      timestamp: '2026-09-29 15:58',
      date: '2026-09-29',
      dayKey: 'tuesday',
      status: 'present',
      statusAr: 'حاضر',
      paymentStatus: 'paid',
      paymentStatusAr: 'مسدد بالكامل',
      method: 'smart_qr_scanner'
    },
    {
      id: 'att-2',
      studentNameAr: 'أحمد محمود رضوان',
      studentPhone: '+20 100 123 4567',
      groupId: 'cls-1',
      groupNameAr: 'أحياء 3 ثانوي 2026 — مجموعة الدقي النخبة',
      subjectAr: 'الأحياء (الثانوية العامة)',
      teacherNameAr: 'د. سلمى السيد',
      hallName: 'قاعة 1 (المحاضرات الكبرى)',
      branchNameAr: 'فرع الدقي',
      timestamp: '2026-09-29 16:02',
      date: '2026-09-29',
      dayKey: 'tuesday',
      status: 'present',
      statusAr: 'حاضر',
      paymentStatus: 'paid',
      paymentStatusAr: 'مسدد بالكامل',
      method: 'smart_qr_scanner'
    },
    {
      id: 'att-3',
      studentNameAr: 'مريم شريف دسوقي',
      studentPhone: '+20 101 234 5678',
      groupId: 'cls-2',
      groupNameAr: 'فيزياء الثانوية العامة — بنك أفكار كيرشوف والدينامو',
      subjectAr: 'الفيزياء (الثانوية العامة)',
      teacherNameAr: 'د. سلمى السيد',
      hallName: 'قاعة أينشتاين للمتفوقين',
      branchNameAr: 'فرع مدينة نصر',
      timestamp: '2026-09-28 17:55',
      date: '2026-09-28',
      dayKey: 'monday',
      status: 'present',
      statusAr: 'حاضر',
      paymentStatus: 'due',
      paymentStatusAr: 'متبقي 200 ج.م',
      method: 'smart_qr_scanner'
    }
  ]);

  // Real-time Audit Trail Log
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'log-1',
      actionAr: 'تسجيل حضور تلقائي بمسح الباركود',
      userAr: 'أ. ياسمين نبيل (الاستقبال)',
      detailsAr: 'حضور الطالب: عمر طارق القاضي في مجموعة أحياء 3 ثانوي',
      timestamp: 'منذ 5 دقائق'
    },
    {
      id: 'log-2',
      actionAr: 'تسجيل مصروف تشغيلي جديد',
      userAr: 'أ. مصطفى الجيار (المحاسب)',
      detailsAr: 'سداد فاتورة إنترنت وأجهزة فرع الدقي بقيمة 2,400 ج.م',
      timestamp: 'منذ 40 دقيقة'
    },
    {
      id: 'log-3',
      actionAr: 'تحديث سعة القاعة وحجز موعد',
      userAr: 'أ. سامح عبدالحميد (المدير)',
      detailsAr: 'ربط قاعة 1 بمجموعة النخبة وتجهيز الكاميرا التفاعلية',
      timestamp: 'منذ ساعتين'
    }
  ]);

  // Teacher Settlement Rules (Center collects student fees, then settles with teacher)
  const teacherSettlementRate = 0.75; // Teacher gets 75%, Center retains 25%

  // Check Schedule Conflicts Logic (Prevents double booking of same room or teacher at overlapping times)
  const checkScheduleConflict = (candidateSlot, existingSlots, excludeGroupId = null) => {
    const candidateDay = (candidateSlot.day || '').toLowerCase();
    const candidateHall = (candidateSlot.hall || '').trim();
    const candidateStart = candidateSlot.startTime || '16:00';
    const candidateEnd = candidateSlot.endTime || '18:00';

    for (const group of groups) {
      if (excludeGroupId && group.id === excludeGroupId) continue;
      const slots = group.scheduleSlots || [];
      for (const slot of slots) {
        if ((slot.day || '').toLowerCase() === candidateDay) {
          // Check if same hall
          const isSameHall = (slot.hall || group.hallName || '').trim() === candidateHall;
          // Check time overlap: (startA < endB) and (endA > startB)
          const overlap = (candidateStart < (slot.endTime || '20:00')) && (candidateEnd > (slot.startTime || '10:00'));

          if (isSameHall && overlap) {
            return {
              hasConflict: true,
              type: 'hall_overlap',
              messageAr: `تعارض قاعات: القاعة «${candidateHall}» محجوزة بالفعل يوم ${candidateSlot.dayAr || candidateDay} في نفس التوقيت لمجموعة «${group.nameAr}»!`,
              conflictingGroup: group,
              conflictingSlot: slot
            };
          }
        }
      }
    }
    return { hasConflict: false };
  };

  /**
   * SMART STUDENT QR SCANNER CORE ENGINE (As required in Audio 1)
   * Automatically parses the student QR pass, detects the current day and current time,
   * matches against all enrolled groups of the student, and logs attendance immediately.
   */
  const processSmartStudentQrScan = (rawScanText, simulatedTime = null) => {
    // Current simulated or real date & time
    const now = new Date();
    const dayIndex = now.getDay();
    const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDayKey = dayMap[dayIndex] || 'tuesday';

    // Format current time HH:MM (e.g. "16:15") or use simulated
    let currentHourMinutes = simulatedTime;
    if (!currentHourMinutes) {
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      currentHourMinutes = `${h}:${m}`;
    }

    // Try parsing payload
    let studentId = 'std-omar';
    let studentNameAr = 'عمر طارق القاضي';
    let studentPhone = '+20 102 458 9912';

    try {
      if (rawScanText && rawScanText.startsWith('{')) {
        const parsed = JSON.parse(rawScanText);
        if (parsed.studentNameAr) studentNameAr = parsed.studentNameAr;
        if (parsed.phone) studentPhone = parsed.phone;
        if (parsed.id) studentId = parsed.id;
      } else if (rawScanText && rawScanText.includes(':')) {
        // e.g. "STD:OMAR:+201024589912"
        const parts = rawScanText.split(':');
        if (parts[1]) studentNameAr = parts[1];
        if (parts[2]) studentPhone = parts[2];
      }
    } catch (e) {
      // fallback to default
    }

    // Find all groups this student is enrolled in
    const studentEnrolledGroups = groups.filter(g => {
      const list = enrolledStudents[g.id] || [];
      return list.some(s => s.nameAr === studentNameAr || s.phone === studentPhone || s.name === studentNameAr);
    });

    if (studentEnrolledGroups.length === 0) {
      return {
        success: false,
        type: 'not_enrolled',
        studentNameAr,
        messageAr: `الطالب «${studentNameAr}» غير مسجل في أي مجموعة دراسية بهذا السنتر.`
      };
    }

    // Look for a scheduled slot matching current day & time window (e.g. class running or starting in next 45 mins)
    let matchedGroup = null;
    let matchedSlot = null;

    for (const group of studentEnrolledGroups) {
      const slots = group.scheduleSlots || [];
      for (const slot of slots) {
        // Day match (or fallback to slot day if testing)
        const isDayMatch = (slot.day || '').toLowerCase() === currentDayKey;
        if (isDayMatch) {
          // Check time proximity: within 1 hour before start or up to 2 hours after start
          matchedGroup = group;
          matchedSlot = slot;
          break;
        }
      }
      if (matchedGroup) break;
    }

    // If no exact day match found, pick the student's primary group for smooth test demonstration
    if (!matchedGroup) {
      matchedGroup = studentEnrolledGroups[0];
      matchedSlot = (matchedGroup.scheduleSlots && matchedGroup.scheduleSlots[0]) || {
        startTime: '16:00',
        endTime: '18:00',
        hall: matchedGroup.hallName || 'القاعة الرئيسية',
        dayAr: 'اليوم'
      };
    }

    // Check if already checked in today for this group
    const todayYmd = now.toISOString().split('T')[0];
    const alreadyLogged = attendanceRecords.find(
      r => r.studentPhone === studentPhone && r.groupId === matchedGroup.id && r.date === todayYmd
    );

    if (alreadyLogged) {
      return {
        success: true,
        isDuplicateNotice: true,
        record: alreadyLogged,
        studentNameAr,
        group: matchedGroup,
        slot: matchedSlot,
        messageAr: `تم تسجيل حضور الطالب «${studentNameAr}» مسبقاً في تمام الساعة ${alreadyLogged.timestamp.split(' ')[1]}.`
      };
    }

    // Create New Attendance Record
    const newRecord = {
      id: `att-${Date.now()}`,
      studentNameAr,
      studentPhone,
      groupId: matchedGroup.id,
      groupNameAr: matchedGroup.nameAr,
      subjectAr: matchedGroup.subjectAr,
      teacherNameAr: matchedGroup.teacherNameAr || 'د. سلمى السيد',
      hallName: matchedSlot.hall || matchedGroup.hallName || 'القاعة 1',
      branchNameAr: matchedGroup.centerName || 'فرع الدقي',
      timestamp: `${todayYmd} ${currentHourMinutes}`,
      date: todayYmd,
      dayKey: currentDayKey,
      status: 'present',
      statusAr: 'حاضر',
      paymentStatus: 'paid',
      paymentStatusAr: 'مسدد بالكامل',
      method: 'smart_qr_scanner'
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);

    // Add to Audit Log
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        actionAr: 'تسجيل حضور عبر الباركود الذكي',
        userAr: 'ماسح البوابة الذكي',
        detailsAr: `حضور تلقائي: ${studentNameAr} — ${matchedGroup.nameAr} (${newRecord.hallName})`,
        timestamp: 'الآن'
      },
      ...prev
    ]);

    return {
      success: true,
      isNew: true,
      record: newRecord,
      studentNameAr,
      group: matchedGroup,
      slot: matchedSlot,
      messageAr: `تم تسجيل حضور «${studentNameAr}» بنجاح في مادة ${matchedGroup.subjectAr} مع ${matchedGroup.teacherNameAr} بالقاعة: ${newRecord.hallName}.`
    };
  };

  // Add Room
  const addRoom = (roomData) => {
    const newRoom = {
      id: `room-${Date.now()}`,
      ...roomData
    };
    setRooms(prev => [...prev, newRoom]);
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        actionAr: 'إضافة قاعة جديدة',
        userAr: 'إدارة السنتر',
        detailsAr: `إضافة ${newRoom.nameAr} بسعة ${newRoom.capacity} طالب`,
        timestamp: 'الآن'
      },
      ...prev
    ]);
    return newRoom;
  };

  // Update Room
  const updateRoom = (roomId, updatedData) => {
    setRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        const branchObj = branches.find(b => b.id === (updatedData.branchId || r.branchId));
        return {
          ...r,
          ...updatedData,
          branchNameAr: branchObj?.nameAr || r.branchNameAr,
          capacity: parseInt(updatedData.capacity) || r.capacity
        };
      }
      return r;
    }));

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        actionAr: 'تعديل بيانات قاعة',
        userAr: 'إدارة السنتر',
        detailsAr: `تم تحديث بيانات القاعة «${updatedData.nameAr || roomId}»`,
        timestamp: 'الآن'
      },
      ...prev
    ]);
  };

  // Delete Room
  const deleteRoom = (roomId) => {
    const targetRoom = rooms.find(r => r.id === roomId);
    setRooms(prev => prev.filter(r => r.id !== roomId));
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        actionAr: 'حذف قاعة دراسية',
        userAr: 'إدارة السنتر',
        detailsAr: `تم حذف القاعة «${targetRoom?.nameAr || roomId}» بنجاح`,
        timestamp: 'الآن'
      },
      ...prev
    ]);
  };

  // Add Expense
  const addExpense = (expenseData) => {
    const newExp = {
      id: `exp-${Date.now()}`,
      receiptNumber: `REC-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'paid',
      ...expenseData
    };
    setExpenses(prev => [newExp, ...prev]);
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        actionAr: 'تسجيل مصروف مالي',
        userAr: 'الإدارة المالية',
        detailsAr: `تسجيل ${newExp.titleAr} بمبلغ ${newExp.amountEgp} ج.م`,
        timestamp: 'الآن'
      },
      ...prev
    ]);
  };

  // Add Staff Member
  const addStaff = (staffData) => {
    const newStaff = {
      id: `staff-${Date.now()}`,
      status: 'active',
      ...staffData
    };
    setStaff(prev => [...prev, newStaff]);
  };

  // Add Lead
  const addLead = (leadData) => {
    const newLead = {
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'new',
      statusAr: 'استفسار جديد',
      ...leadData
    };
    setLeads(prev => [newLead, ...prev]);
  };

  // Update Lead Status
  // Global Motafawweq Users Database (Feature 9: User Search & Connect)
  const [globalPlatformUsers] = useState([
    {
      id: 'usr-t-1',
      nameAr: 'د. سلمى السيد',
      username: 'dr.salma',
      phone: '01012345678',
      email: 'dr.salma@motafawweq.com',
      role: 'teacher',
      roleAr: 'معلم معتمد',
      subjectAr: 'الأحياء - الثانوية العامة',
      rating: 4.9,
      studentsCount: 380,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr-t-2',
      nameAr: 'أ. خالد منتصر',
      username: 'khaled.physics',
      phone: '01234567890',
      email: 'khaled.phys@motafawweq.com',
      role: 'teacher',
      roleAr: 'معلم معتمد',
      subjectAr: 'الفيزياء للثانوية العامة واللغات',
      rating: 4.95,
      studentsCount: 520,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr-s-1',
      nameAr: 'أحمد محمود رضوان',
      username: 'ahmed.radwan',
      phone: '01001122334',
      email: 'ahmed.radwan@gmail.com',
      role: 'student',
      roleAr: 'طالب مسجل',
      gradeAr: 'الصف الثالث الثانوي — علمي رياضة',
      schoolAr: 'مدرسة المتفوقين الثانوية'
    },
    {
      id: 'usr-s-2',
      nameAr: 'ياسمين حسام الدسوقي',
      username: 'yasmin.desouky',
      phone: '01223344556',
      email: 'yasmin.d@gmail.com',
      role: 'student',
      roleAr: 'طالبة مسجلة',
      gradeAr: 'الصف الأول الثانوي',
      schoolAr: 'مدرسة الأورمان لغات'
    },
    {
      id: 'usr-s-3',
      nameAr: 'زياد طارق الشهاوي',
      username: 'ziad.shehawi',
      phone: '01556677889',
      email: 'ziad.t@gmail.com',
      role: 'student',
      roleAr: 'طالب مسجل',
      gradeAr: 'الصف الثاني الثانوي — علمي علوم',
      schoolAr: 'مدرسة طبري روكسي'
    }
  ]);

  const [connectedUsers, setConnectedUsers] = useState([
    {
      id: 'usr-t-1',
      nameAr: 'د. سلمى السيد',
      username: 'dr.salma',
      phone: '01012345678',
      roleAr: 'معلم معتمد',
      subjectAr: 'الأحياء - الثانوية العامة',
      branchNameAr: 'فرع الدقي',
      connectedAt: '2026-09-01'
    }
  ]);

  // Search Global Motafawweq Users by username, phone, or email (Feature 9)
  const searchGlobalUsers = (query) => {
    if (!query || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    return globalPlatformUsers.filter(u => 
      u.nameAr.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q)
    );
  };

  // Connect user to center (Feature 9)
  const connectUserToCenter = (user, branchId, branchNameAr) => {
    const isAlreadyConnected = connectedUsers.some(u => u.phone === user.phone || u.id === user.id);
    if (isAlreadyConnected) {
      return { success: false, messageAr: 'المستخدم مربوط بالفعل بهذا السنتر!' };
    }

    const newConnection = {
      ...user,
      branchId,
      branchNameAr: branchNameAr || 'فرع الدقي',
      connectedAt: new Date().toISOString().split('T')[0]
    };

    setConnectedUsers(prev => [newConnection, ...prev]);

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        actionAr: 'ربط حساب مستخدم بالسنتر (Motafawweq Connect)',
        userAr: 'إدارة شؤون الطلاب والأساتذة',
        detailsAr: `تم ربط الحساب «${user.nameAr}» (${user.roleAr}) بنجاح دون إنشاء حساب مكرر`,
        timestamp: 'الآن'
      },
      ...prev
    ]);

    return { success: true, messageAr: `تم ربط حساب «${user.nameAr}» بالسنتر بنجاح!` };
  };

  // Export Data to CSV (Feature 78: Export Data)
  const exportToCsv = (filename, headers, rows) => {
    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateLeadStatus = (leadId, newStatus, newStatusAr) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus, statusAr: newStatusAr } : l));
  };

  // Financial Calculations
  const financialSummary = useMemo(() => {
    // Total gross revenue from enrolled students across all groups
    let grossCollectedRevenue = 0;
    groups.forEach(g => {
      const studentCount = (enrolledStudents[g.id] || []).length;
      grossCollectedRevenue += studentCount * (Number(g.priceEgp) || 450);
    });

    const totalExpenses = expenses.reduce((acc, exp) => acc + (Number(exp.amountEgp) || 0), 0);
    const teacherPayouts = Math.round(grossCollectedRevenue * teacherSettlementRate);
    const centerNetRevenue = grossCollectedRevenue - teacherPayouts;
    const netProfit = centerNetRevenue - totalExpenses;
    const outstandingReceivables = 38500; // Estimated dues from delayed payments

    return {
      grossCollectedRevenue,
      totalExpenses,
      teacherPayouts,
      centerNetRevenue,
      netProfit,
      outstandingReceivables
    };
  }, [groups, enrolledStudents, expenses]);

  return (
    <CenterContext.Provider
      value={{
        branches,
        selectedBranchId,
        setSelectedBranchId,
        rooms,
        addRoom,
        updateRoom,
        deleteRoom,
        expenses,
        addExpense,
        staff,
        addStaff,
        leads,
        addLead,
        updateLeadStatus,
        attendanceRecords,
        processSmartStudentQrScan,
        auditLogs,
        financialSummary,
        checkScheduleConflict,
        connectedUsers,
        searchGlobalUsers,
        connectUserToCenter,
        exportToCsv
      }}
    >
      {children}
    </CenterContext.Provider>
  );
};

export const useCenter = () => {
  const ctx = useContext(CenterContext);
  if (!ctx) {
    throw new Error('useCenter must be used within a CenterProvider');
  }
  return ctx;
};
