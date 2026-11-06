import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  ChildSwitcher,
  ChildSummaryCard,
  ChildSessionAndFeedback
} from '../../features/parent';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  BookOpen,
  FileText,
  Award,
  CreditCard,
  Phone,
  ShieldCheck,
  X,
  Send,
  Bell,
  Building2,
  MessageSquare,
  QrCode,
  Download,
  Settings,
  User,
  Save,
  Lock
} from 'lucide-react';

export const ParentDashboard = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab State synced with URL query (?tab=...)
  const tabFromUrl = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab'));
    }
  }, [searchParams]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  const [selectedChild, setSelectedChild] = useState('child-omar');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkStudentCode, setLinkStudentCode] = useState('');
  const [linkSuccessToast, setLinkSuccessToast] = useState('');

  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccessToast, setContactSuccessToast] = useState('');

  // ══════════════════ PARENT SETTINGS STATE ══════════════════
  const [parentName, setParentName] = useState('طارق عبد الرحمن القاضي');
  const [parentPhone, setParentPhone] = useState('01001234567');
  const [parentEmergencyPhone, setParentEmergencyPhone] = useState('01122334455');
  const [parentEmail, setParentEmail] = useState('tarek.elkady@motafawweq.me');

  const [notifyGateCheckIn, setNotifyGateCheckIn] = useState(true);
  const [notifyAbsenceLate, setNotifyAbsenceLate] = useState(true);
  const [notifyExamResults, setNotifyExamResults] = useState(true);
  const [notifyHomeworkDue, setNotifyHomeworkDue] = useState(true);
  const [notifyTuitionRenewal, setNotifyTuitionRenewal] = useState(true);

  const [settingsSavedToast, setSettingsSavedToast] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccessToast, setPasswordSuccessToast] = useState('');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettingsSavedToast(lang === 'ar' ? 'تم حفظ وتحديث إعدادات ولي الأمر بنجاح.' : 'Settings saved successfully.');
    setTimeout(() => setSettingsSavedToast(''), 4000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setPasswordSuccessToast(lang === 'ar' ? 'تم تحديث كلمة المرور وتأمين الحساب بنجاح.' : 'Password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSuccessToast(''), 4000);
  };

  // ══════════════════ STUDENTS DATA (LINKED DIRECTLY TO PLATFORM DATA) ══════════════════
  const childrenData = {
    'child-omar': {
      id: 'child-omar',
      studentCode: 'STD-2026-OMAR',
      name: 'Omar Tarek El-Kady',
      nameAr: 'عمر طارق القاضي',
      grade: '3rd Secondary (Thanawya Amma)',
      gradeAr: 'الصف الثالث الثانوي (شعبة علمي علوم)',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      school: 'El-Saidia Secondary Military School, Giza',
      schoolAr: 'مدرسة السعيدية الثانوية العسكرية، الجيزة',
      center: 'Dokki Elite Center & Online Platform',
      centerAr: 'سنتر الدقي النخبة والمنصة الإلكترونية',
      phone: '01024589912',
      parentPhone: '01001234567',
      attendanceRate: 96.5,
      avgQuizScore: 94.6,
      streakDays: 16,
      completedLessons: 42,
      totalLessons: 68,
      centerWalletEgp: 150,
      nextSession: 'Sunday 4:00 PM - Biology (Dr. Salma El-Sayed) - Room 1',
      nextSessionAr: 'الأحد 4:00 عصراً - أحياء (د. سلمى السيد) - قاعة 1 بسنتر الدقي',
      teacherNotes: 'Omar shows exceptional grasp in Cell Biology. Needs slight revision on Calvin Cycle energy calculations before the mid-term exam.',
      teacherNotesAr: 'عمر ممتاز جداً ومنضبط بالقاعة. نوصي بمراجعة بسيطة لحسابات الطاقة في دورة كالفن قبل امتحان نصف الفصل القادم.',

      // Enrolled Courses
      courses: [
        {
          id: 'course-bio-301',
          name: 'Biology',
          nameAr: 'الأحياء',
          teacherName: 'Dr. Salma El-Sayed',
          teacherNameAr: 'د. سلمى السيد',
          teacherTitleAr: 'كبير معلمي الأحياء ومؤلفة سلسلة المتفوق',
          teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
          progress: 78,
          completedLessons: 14,
          totalLessons: 18,
          lastLesson: 'Photosynthesis and Energy Dynamics in Plants',
          lastLessonAr: 'البناء الضوئي وحركية الطاقة في الخلايا النباتية',
          avgScore: '95%',
          attendance: '100%',
          room: 'قاعة 1'
        },
        {
          id: 'course-phy-302',
          name: 'Physics',
          nameAr: 'الفيزياء',
          teacherName: 'Dr. Hany El-Shennawy',
          teacherNameAr: 'د. هاني الشناوي',
          teacherTitleAr: 'خبير تدريس الفيزياء والمسابقات الأولمبية',
          teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          progress: 62,
          completedLessons: 13,
          totalLessons: 22,
          lastLesson: 'Kirchhoff Laws & Complex Closed Circuits',
          lastLessonAr: 'قوانين كيرشوف وتطبيقات الدوائر الكهربية المعقدة',
          avgScore: '90%',
          attendance: '95%',
          room: 'قاعة 3'
        },
        {
          id: 'course-chem-303',
          name: 'Chemistry',
          nameAr: 'الكيمياء',
          teacherName: 'Mr. Mahmoud Rady',
          teacherNameAr: 'أ. محمود راضي',
          teacherTitleAr: 'خبير الكيمياء للثانوية العامة',
          teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
          progress: 50,
          completedLessons: 8,
          totalLessons: 16,
          lastLesson: 'Chemical Equilibrium & Le Chatelier Principle',
          lastLessonAr: 'الاتزان الكيميائي والعوامل المؤثرة وقاعدة لوشاتيليه',
          avgScore: '92%',
          attendance: '100%',
          room: 'قاعة 2'
        },
        {
          id: 'course-ar-304',
          name: 'Arabic Language',
          nameAr: 'اللغة العربية والبلاغة',
          teacherName: 'Dr. Walid Mohsen',
          teacherNameAr: 'د. وليد محسن',
          teacherTitleAr: 'خبير اللغة العربية والنحو للثانوية العامة',
          teacherAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
          progress: 82,
          completedLessons: 18,
          totalLessons: 22,
          lastLesson: 'Arabic Grammar: Derivatives and Semantic Sources',
          lastLessonAr: 'إعمال المشتقات العاملة وصيغ المبالغة والمصادر',
          avgScore: '96.7%',
          attendance: '96%',
          room: 'قاعة 1'
        }
      ],

      // Gate Attendance Log
      attendanceLogs: [
        {
          id: 'att-1',
          date: '2026-11-05',
          dateAr: 'الخميس 5 نوفمبر 2026',
          subjectAr: 'الأحياء (د. سلمى السيد)',
          subjectEn: 'Biology (Dr. Salma)',
          roomAr: 'قاعة 1 - الدور الأرضي',
          scanTime: '03:52 م',
          status: 'present',
          statusAr: 'حاضر في الموعد',
          statusEn: 'Present on time'
        },
        {
          id: 'att-2',
          date: '2026-11-03',
          dateAr: 'الثلاثاء 3 نوفمبر 2026',
          subjectAr: 'الفيزياء (د. هاني الشناوي)',
          subjectEn: 'Physics (Dr. Hany)',
          roomAr: 'قاعة 3 - الدور الثاني',
          scanTime: '05:25 م',
          status: 'present',
          statusAr: 'حاضر في الموعد',
          statusEn: 'Present on time'
        },
        {
          id: 'att-3',
          date: '2026-11-01',
          dateAr: 'الأحد 1 نوفمبر 2026',
          subjectAr: 'الكيمياء (أ. محمود راضي)',
          subjectEn: 'Chemistry (Mr. Mahmoud)',
          roomAr: 'قاعة 2 - الدور الأول',
          scanTime: '03:58 م',
          status: 'present',
          statusAr: 'حاضر في الموعد',
          statusEn: 'Present on time'
        },
        {
          id: 'att-4',
          date: '2026-10-29',
          dateAr: 'الخميس 29 أكتوبر 2026',
          subjectAr: 'الأحياء (د. سلمى السيد)',
          subjectEn: 'Biology (Dr. Salma)',
          roomAr: 'قاعة 1 - الدور الأرضي',
          scanTime: '04:11 م',
          status: 'late',
          statusAr: 'تأخر 11 دقيقة بعذر مسجل',
          statusEn: 'Late with excuse'
        },
        {
          id: 'att-5',
          date: '2026-10-27',
          dateAr: 'الثلاثاء 27 أكتوبر 2026',
          subjectAr: 'الفيزياء (د. هاني الشناوي)',
          subjectEn: 'Physics (Dr. Hany)',
          roomAr: 'قاعة 3 - الدور الثاني',
          scanTime: '05:20 م',
          status: 'present',
          statusAr: 'حاضر في الموعد',
          statusEn: 'Present on time'
        }
      ],

      // Exam & Quiz Scorecards
      examReports: [
        {
          id: 'ex-1',
          titleAr: 'كويز تفاعلات البناء الضوئي وانشطار الماء',
          titleEn: 'Photosynthesis & Water Splitting Quiz',
          subjectAr: 'الأحياء',
          teacherAr: 'د. سلمى السيد',
          date: '2026-11-05',
          score: 19,
          maxScore: 20,
          percent: '95%',
          rankAr: 'المركز 2 على المجموعة',
          notesAr: 'فهم دقيق وممتاز لمعادلة فان نيل ونواتج الفسفرة الضوئية.'
        },
        {
          id: 'ex-2',
          titleAr: 'اختبار كيرشوف والدوائر الكهربية المعقدة الأسبوعي',
          titleEn: 'Kirchhoff Circuit Analysis Test',
          subjectAr: 'الفيزياء',
          teacherAr: 'د. هاني الشناوي',
          date: '2026-11-03',
          score: 27,
          maxScore: 30,
          percent: '90%',
          rankAr: 'المركز 3 على المجموعة',
          notesAr: 'تطبيق هندسي رائع لقانوني كيرشوف الأول والثاني في المسارات المغلقة.'
        },
        {
          id: 'ex-3',
          titleAr: 'اختبار الاتزان الكيميائي والعوامل المؤثرة',
          titleEn: 'Chemical Equilibrium & Le Chatelier Test',
          subjectAr: 'الكيمياء',
          teacherAr: 'أ. محمود راضي',
          date: '2026-11-01',
          score: 23,
          maxScore: 25,
          percent: '92%',
          rankAr: 'المركز 2 على المجموعة',
          notesAr: 'حلول دقيقة لمسائل ثابت الاتزان وتأثير الضغط والحرارة.'
        },
        {
          id: 'ex-4',
          titleAr: 'امتحان النحو والبلاغة الشامل لشهر أكتوبر',
          titleEn: 'Comprehensive Grammar & Rhetoric Exam',
          subjectAr: 'اللغة العربية',
          teacherAr: 'د. وليد محسن',
          date: '2026-10-25',
          score: 58,
          maxScore: 60,
          percent: '96.7%',
          rankAr: 'الأول على المجموعة',
          notesAr: 'إعراب نموذجي وبلاغة رفيعة مع درجات تفوق كاملة في القراءة المتحررة.'
        }
      ],

      // Homework Tracker
      homeworkItems: [
        {
          id: 'hw-1',
          titleAr: 'واجب تطبيق انشطار الماء ومعادلة فان نيل بالأكسجين المشع',
          subjectAr: 'الأحياء',
          teacherAr: 'د. سلمى السيد',
          deadlineAr: 'ينتهي الليلة قبل 11:59 مساءً',
          status: 'pending',
          statusAr: 'قيد التسليم',
          statusEn: 'Pending',
          maxScore: 20,
          earnedScore: null,
          notesAr: 'مطلوب إرفاق الخطوات الحسابية وتوضيح دور مستقبلات الهيدروجين.'
        },
        {
          id: 'hw-2',
          titleAr: 'مسائل قوانين كيرشوف المعقدة وحسابات الجهد بالمسارات المغلقة',
          subjectAr: 'الفيزياء',
          teacherAr: 'د. هاني الشناوي',
          deadlineAr: 'باقي 3 أيام',
          status: 'pending',
          statusAr: 'قيد التسليم',
          statusEn: 'Pending',
          maxScore: 25,
          earnedScore: null,
          notesAr: 'يرجى مراجعة المسارات المغلقة وتحديد اتجاهات التيارات بدقة.'
        },
        {
          id: 'hw-3',
          titleAr: 'واجب مقارنة أقراص الثيلاكويد بالستروما ومسارات الطاقة',
          subjectAr: 'الأحياء',
          teacherAr: 'د. سلمى السيد',
          deadlineAr: 'تم التسليم والتصحيح',
          status: 'graded',
          statusAr: 'تم التصحيح والتقييم',
          statusEn: 'Graded',
          maxScore: 20,
          earnedScore: 19,
          notesAr: 'إجابة نموذجية ومبهرة يا عمر! تحليلك لدور إنزيم روبيسكو دقيق جداً ويدل على فهم عميق.'
        },
        {
          id: 'hw-4',
          titleAr: 'تطبيقات قاعدة لوشاتيليه ومسائل ثابت الاتزان الكيميائي',
          subjectAr: 'الكيمياء',
          teacherAr: 'أ. محمود راضي',
          deadlineAr: 'تم التسليم • بانتظار مراجعة المعلم',
          status: 'submitted',
          statusAr: 'تم التسليم وبانتظار التصحيح',
          statusEn: 'Submitted',
          maxScore: 20,
          earnedScore: null,
          notesAr: 'تم تسليم ورقة الحل كاملة وقيد المراجعة بواسطة أستاذ المادة.'
        }
      ],

      // Financials & Invoices
      invoices: [
        {
          id: 'INV-2026-901',
          date: '2026-11-01',
          descriptionAr: 'اشتراك شهر نوفمبر - مادة الأحياء (د. سلمى السيد)',
          amount: '450 ج.م',
          methodAr: 'دفع نقدي بالاستقبال',
          statusAr: 'مسدد بالكامل',
          receiptNo: '#REC-8921'
        },
        {
          id: 'INV-2026-894',
          date: '2026-11-01',
          descriptionAr: 'اشتراك شهر نوفمبر - مادة الفيزياء (د. هاني الشناوي)',
          amount: '500 ج.م',
          methodAr: 'تحويل إلكتروني إنستاباي',
          statusAr: 'مسدد بالكامل',
          receiptNo: '#REC-8944'
        },
        {
          id: 'INV-2026-870',
          date: '2026-10-20',
          descriptionAr: 'شراء مذكرة بنك الأسئلة والتدريبات الامتحانية في الكيمياء',
          amount: '120 ج.م',
          methodAr: 'خصم من محفظة السنتر',
          statusAr: 'مسدد بالكامل',
          receiptNo: '#REC-8703'
        },
        {
          id: 'INV-2026-850',
          date: '2026-10-01',
          descriptionAr: 'اشتراك شهر أكتوبر - مادة الكيمياء (أ. محمود راضي)',
          amount: '400 ج.م',
          methodAr: 'فودافون كاش ومحافظ المحمول',
          statusAr: 'مسدد بالكامل',
          receiptNo: '#REC-8501'
        }
      ]
    },

    // Sarah Tarek El-Kady (Child 2)
    'child-sarah': {
      id: 'child-sarah',
      studentCode: 'STD-2026-SARAH',
      name: 'Sarah Tarek El-Kady',
      nameAr: 'سارة طارق القاضي',
      grade: '1st Prep',
      gradeAr: 'الصف الأول الإعدادي',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      school: 'Orman Prep School for Girls, Dokki',
      schoolAr: 'مدرسة الأورمان الإعدادية بنات، الدقي',
      center: 'Dokki Elite Center',
      centerAr: 'سنتر الدقي النخبة',
      phone: '01055566778',
      parentPhone: '01001234567',
      attendanceRate: 98.0,
      avgQuizScore: 94.5,
      streakDays: 19,
      completedLessons: 36,
      totalLessons: 44,
      centerWalletEgp: 200,
      nextSession: 'Monday 5:00 PM - Science (Mrs. Rania Kamel) - Room 4',
      nextSessionAr: 'الإثنين 5:00 مساءً - علوم (أ. رانيا كامل) - قاعة 4 بسنتر الدقي',
      teacherNotes: 'Sarah is top of her class this week in Matter & Atomic Structure quiz! Outstanding engagement and neat homework presentation.',
      teacherNotesAr: 'سارة متفوقة جداً والأولى على مجموعتها هذا الأسبوع في كويز تركيب المادة والذرة! إجاباتها منظمة ومنضبطة بالقاعة.',

      courses: [
        {
          id: 'course-sci-101',
          name: 'Science',
          nameAr: 'العلوم',
          teacherName: 'Mrs. Rania Kamel',
          teacherNameAr: 'أ. رانيا كامل',
          teacherTitleAr: 'خبيرة تدريس العلوم للمرحلة الإعدادية',
          teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          progress: 88,
          completedLessons: 12,
          totalLessons: 14,
          lastLesson: 'Atomic Structure & Chemical Activity',
          lastLessonAr: 'التركيب الذري للمادة والنشاط الكيميائي للعناصر',
          avgScore: '98%',
          attendance: '100%',
          room: 'قاعة 4'
        },
        {
          id: 'course-math-102',
          name: 'Mathematics',
          nameAr: 'الرياضيات',
          teacherName: 'Mr. Ashraf Sobhy',
          teacherNameAr: 'أ. أشرف صبحي',
          teacherTitleAr: 'خبير الرياضيات للمرحلة الإعدادية',
          teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
          progress: 80,
          completedLessons: 16,
          totalLessons: 20,
          lastLesson: 'Rational Numbers & Algebraic Operations',
          lastLessonAr: 'مجموعة الأعداد النسبية والعمليات الجبرية',
          avgScore: '93%',
          attendance: '96%',
          room: 'قاعة 2'
        }
      ],

      attendanceLogs: [
        {
          id: 'att-s1',
          date: '2026-11-04',
          dateAr: 'الأربعاء 4 نوفمبر 2026',
          subjectAr: 'العلوم (أ. رانيا كامل)',
          subjectEn: 'Science (Mrs. Rania)',
          roomAr: 'قاعة 4 - الدور الأول',
          scanTime: '04:50 م',
          status: 'present',
          statusAr: 'حاضر في الموعد',
          statusEn: 'Present on time'
        },
        {
          id: 'att-s2',
          date: '2026-11-02',
          dateAr: 'الإثنين 2 نوفمبر 2026',
          subjectAr: 'الرياضيات (أ. أشرف صبحي)',
          subjectEn: 'Math (Mr. Ashraf)',
          roomAr: 'قاعة 2 - الدور الأول',
          scanTime: '03:55 م',
          status: 'present',
          statusAr: 'حاضر في الموعد',
          statusEn: 'Present on time'
        }
      ],

      examReports: [
        {
          id: 'ex-s1',
          titleAr: 'كويز تركيب المادة والجدول الذري الدوري',
          titleEn: 'Matter & Atomic Structure Quiz',
          subjectAr: 'العلوم',
          teacherAr: 'أ. رانيا كامل',
          date: '2026-11-04',
          score: 20,
          maxScore: 20,
          percent: '100%',
          rankAr: 'المركز 1 على المجموعة',
          notesAr: 'درجة كاملة وإجابة نموذجية في توزيع الإلكترونات بمستويات الطاقة.'
        }
      ],

      homeworkItems: [
        {
          id: 'hw-s1',
          titleAr: 'واجب رسم التوزيع الإلكتروني لأول 20 عنصراً',
          subjectAr: 'العلوم',
          teacherAr: 'أ. رانيا كامل',
          deadlineAr: 'تم التسليم والتصحيح',
          status: 'graded',
          statusAr: 'تم التصحيح والتقييم',
          statusEn: 'Graded',
          maxScore: 20,
          earnedScore: 20,
          notesAr: 'ممتازة جداً يا سارة! رسمك لمستويات الطاقة والمدارات دقيق ومرتب للغاية.'
        }
      ],

      invoices: [
        {
          id: 'INV-2026-S01',
          date: '2026-11-01',
          descriptionAr: 'اشتراك شهر نوفمبر - مادة العلوم (أ. رانيا كامل)',
          amount: '300 ج.م',
          methodAr: 'دفع نقدي بالاستقبال',
          statusAr: 'مسدد بالكامل',
          receiptNo: '#REC-7801'
        }
      ]
    }
  };

  const childrenList = [
    {
      id: 'child-omar',
      name: childrenData['child-omar'].name,
      nameAr: childrenData['child-omar'].nameAr,
      grade: childrenData['child-omar'].grade,
      gradeAr: childrenData['child-omar'].gradeAr,
      avatar: childrenData['child-omar'].avatar
    },
    {
      id: 'child-sarah',
      name: childrenData['child-sarah'].name,
      nameAr: childrenData['child-sarah'].nameAr,
      grade: childrenData['child-sarah'].grade,
      gradeAr: childrenData['child-sarah'].gradeAr,
      avatar: childrenData['child-sarah'].avatar
    }
  ];

  const activeChild = childrenData[selectedChild] || childrenData['child-omar'];

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    if (!linkStudentCode.trim()) return;
    setLinkSuccessToast(lang === 'ar'
      ? `تم ربط حساب الطالب بنجاح بكود "${linkStudentCode.trim()}"!`
      : `Student successfully linked with code "${linkStudentCode.trim()}"!`);
    setShowLinkModal(false);
    setLinkStudentCode('');
    setTimeout(() => setLinkSuccessToast(''), 4500);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setContactSuccessToast(lang === 'ar'
      ? 'تم إرسال استفسارك إلى إدارة السنتر والمعلم بنجاح وسيتواصلون معك هاتفياً.'
      : 'Your inquiry was delivered to the center and teacher.');
    setShowContactModal(false);
    setContactSubject('');
    setContactMessage('');
    setTimeout(() => setContactSuccessToast(''), 5000);
  };

  // Tab Definitions (Removed Weak Areas, Added Settings)
  const tabs = [
    { id: 'overview', labelAr: 'نظرة عامة والملخص', labelEn: 'Overview', icon: Users },
    { id: 'courses', labelAr: 'المقررات والدروس', labelEn: 'Enrolled Courses', icon: BookOpen },
    { id: 'attendance', labelAr: 'سجل حضور السنتر', labelEn: 'Gate Attendance', icon: Calendar },
    { id: 'exams', labelAr: 'الامتحانات والدرجات', labelEn: 'Exam Scorecards', icon: Award },
    { id: 'homework', labelAr: 'الواجبات والتسليمات', labelEn: 'Homework Tracker', icon: FileText },
    { id: 'financials', labelAr: 'المصروفات والاشتراكات', labelEn: 'Tuition & Fees', icon: CreditCard },
    { id: 'settings', labelAr: 'الإعدادات والملف الشخصي', labelEn: 'Settings & Profile', icon: Settings }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '28px 20px 80px',
      fontFamily: isRtl ? 'var(--font-arabic, "Cairo", sans-serif)' : 'var(--font-sans, "Inter", sans-serif)'
    }}>
      {/* ══════════════════ HEADER ══════════════════ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '99px',
              backgroundColor: 'var(--primary-surface, rgba(21, 136, 199, 0.1))',
              color: 'var(--primary)',
              fontWeight: '800'
            }}>
              {lang === 'ar' ? 'بوابة أولياء الأمور الذكية' : 'Smart Parent Portal'}
            </span>
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 4px 0',
            fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
          }}>
            {lang === 'ar' ? 'متابعة مسار وتحصيل الأبناء' : 'Student Progress & Performance Hub'}
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0 }}>
            {lang === 'ar'
              ? 'متابعة لحظية لدخول قاعات السنتر، نتائج الامتحانات الأسبوعية، والواجبات والمصروفات أولاً بأول.'
              : 'Real-time monitoring of center gate check-ins, weekly quiz scores, homework status, and tuition statements.'}
          </p>
        </div>

        {/* Child Switcher Pills with Add Student Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <ChildSwitcher
            children={childrenList}
            selectedChild={selectedChild}
            onSelectChild={setSelectedChild}
            lang={lang}
            onLinkNewChild={() => setShowLinkModal(true)}
          />

          <button
            onClick={() => setShowContactModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Phone size={14} />
            <span>{lang === 'ar' ? 'تواصل مع السنتر' : 'Contact Center'}</span>
          </button>
        </div>
      </div>

      {/* ══════════════════ SUCCESS TOASTS ══════════════════ */}
      {linkSuccessToast && (
        <div style={{
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(22, 163, 74, 0.1)',
          border: '1px solid rgba(22, 163, 74, 0.25)',
          color: 'var(--success, #16A34A)',
          fontSize: '13.5px',
          fontWeight: '700',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          <span>{linkSuccessToast}</span>
        </div>
      )}

      {contactSuccessToast && (
        <div style={{
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(21, 136, 199, 0.1)',
          border: '1px solid rgba(21, 136, 199, 0.25)',
          color: 'var(--primary)',
          fontSize: '13.5px',
          fontWeight: '700',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          <span>{contactSuccessToast}</span>
        </div>
      )}

      {/* ══════════════════ ACTIVE CHILD SUMMARY CARD ══════════════════ */}
      <ChildSummaryCard
        activeChild={activeChild}
        lang={lang}
        isRtl={isRtl}
      />

      {/* ══════════════════ NAVIGATION TABS ══════════════════ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        overflowX: 'auto',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '8px',
        marginBottom: '24px'
      }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: isActive ? 'var(--primary-surface, rgba(21, 136, 199, 0.1))' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: isActive ? '800' : '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* ══════════════════ TAB 1: OVERVIEW ══════════════════ */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Next Session & Teacher Notes */}
          <ChildSessionAndFeedback
            activeChild={activeChild}
            lang={lang}
          />

          {/* Real-time Gate Arrival Alert & Center Check-in Status */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  {lang === 'ar' ? 'آخر إشعار مسح باركود لبوابة السنتر' : 'Latest Gate Check-in Notification'}
                </h3>
              </div>
              <span style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '99px',
                backgroundColor: 'rgba(22, 163, 74, 0.12)',
                color: 'var(--color-success, #16A34A)',
                fontWeight: '700'
              }}>
                {lang === 'ar' ? 'تم التحقق بنجاح' : 'Verified'}
              </span>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {activeChild.attendanceLogs[0]?.subjectAr}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                  {activeChild.attendanceLogs[0]?.roomAr} • {activeChild.attendanceLogs[0]?.dateAr}
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--bg-surface)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <Clock size={14} color="var(--primary)" />
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {activeChild.attendanceLogs[0]?.scanTime}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '700' }}>
                  ({activeChild.attendanceLogs[0]?.statusAr})
                </span>
              </div>
            </div>
          </div>

          {/* Quick Enrolled Courses Row */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'المقررات التي يدرسها الطالب حالياً' : 'Current Enrolled Courses'}
              </h3>
              <button
                onClick={() => handleTabChange('courses')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'عرض كافة المقررات والدروس ←' : 'View all courses →'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {activeChild.courses.map(course => (
                <div
                  key={course.id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '18px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <img
                      src={course.teacherAvatar}
                      alt=""
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                        {lang === 'ar' ? course.nameAr : course.name}
                      </h4>
                      <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '700', marginTop: '2px' }}>
                        {course.teacherNameAr}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <span>{lang === 'ar' ? 'إنجاز المنهج:' : 'Course progress:'}</span>
                      <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{course.progress}%</span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '99px', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
                      <div style={{ width: `${course.progress}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '99px' }} />
                    </div>
                  </div>

                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {lang === 'ar' ? 'آخر درس تم دراسته:' : 'Last studied lesson:'} <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{course.lastLessonAr}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ TAB 2: COURSES & SYLLABUS ══════════════════ */}
      {activeTab === 'courses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                {lang === 'ar' ? 'المقررات الدراسية المعتمدة ومعدل التقدم' : 'Enrolled Courses & Curriculum Progress'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                {lang === 'ar'
                  ? 'متابعة تفصيلية لسير الطالب في كل مادة دراسية ونسبة تغطية فصول المنهج طبقاً لنظام الثانوية العامة.'
                  : 'Detailed tracking of syllabus coverage and active chapters across all enrolled subjects.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            {activeChild.courses.map(c => (
              <div
                key={c.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-subtle)',
                  padding: '22px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={c.teacherAvatar}
                        alt=""
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-light)' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                          {lang === 'ar' ? c.nameAr : c.name}
                        </h4>
                        <div style={{ fontSize: '12.5px', color: 'var(--primary)', fontWeight: '700', marginTop: '2px' }}>
                          {c.teacherNameAr}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {c.teacherTitleAr}
                        </div>
                      </div>
                    </div>

                    <span style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(21, 136, 199, 0.1)',
                      color: 'var(--primary)',
                      fontWeight: '800'
                    }}>
                      {c.room}
                    </span>
                  </div>

                  <div style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      {lang === 'ar' ? 'آخر درس استمع له الطالب في المنصة:' : 'Last completed lecture:'}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      {c.lastLessonAr}
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'تغطية المنهج الدراسي:' : 'Syllabus coverage:'}</span>
                      <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{c.completedLessons} من {c.totalLessons} حصة ({c.progress}%)</span>
                    </div>
                    <div style={{ height: '7px', borderRadius: '99px', backgroundColor: 'var(--bg-subtle)', overflow: 'hidden' }}>
                      <div style={{ width: `${c.progress}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '99px' }} />
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)' }}>
                    <CheckCircle2 size={14} />
                    <span>{lang === 'ar' ? `حضور السنتر: ${c.attendance}` : `Attendance: ${c.attendance}`}</span>
                  </div>
                  <div style={{ fontWeight: '800', color: 'var(--primary)' }}>
                    {lang === 'ar' ? `متوسط الدرجات: ${c.avgScore}` : `Avg: ${c.avgScore}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════ TAB 3: GATE ATTENDANCE LOG ══════════════════ */}
      {activeTab === 'attendance' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                {lang === 'ar' ? 'سجل حضور وانضباط الطالب في السنتر' : 'Center Attendance & Gate Check-in Records'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                {lang === 'ar'
                  ? 'رصد توقيت مسح باركود الطالب عند بوابة الدخول لكل حصة دراسية مع تحديد القاعة واليوم.'
                  : 'Automated timestamped logs captured when student card barcode is scanned at the center gate.'}
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(22, 163, 74, 0.1)',
              color: 'var(--color-success, #16A34A)',
              fontSize: '12.5px',
              fontWeight: '700'
            }}>
              <CheckCircle2 size={15} />
              <span>{lang === 'ar' ? 'نسبة الانضباط الإجمالية: 98%' : 'Overall Punctuality: 98%'}</span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'المادة والمعلم' : 'Subject & Teacher'}</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'القاعة' : 'Classroom'}</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'توقيت مسح الكود' : 'Gate Scan Time'}</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'حالة الحضور' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {activeChild.attendanceLogs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 12px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {log.dateAr}
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>
                      {log.subjectAr}
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      {log.roomAr}
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} color="var(--primary)" />
                        {log.scanTime}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{
                        fontSize: '11.5px',
                        fontWeight: '700',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: log.status === 'present' ? 'rgba(22, 163, 74, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        color: log.status === 'present' ? 'var(--color-success, #16A34A)' : 'var(--color-warning, #F59E0B)'
                      }}>
                        {log.statusAr}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════ TAB 4: EXAM SCORECARDS ══════════════════ */}
      {activeTab === 'exams' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                {lang === 'ar' ? 'كشف درجات الاختبارات الدورية والكويزات' : 'Periodic Exam Scorecards & Quiz Reports'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                {lang === 'ar'
                  ? 'نتائج امتحانات السنتر الأسبوعية والشهرية مع ملاحظات معلم المادة وترتيب الطالب.'
                  : 'Official graded results with teacher assessment notes and cohort rankings.'}
              </p>
            </div>

            <button
              onClick={() => {
                alert(lang === 'ar' ? 'جاري تجهيز تقرير الدرجات الشامل للطباعة...' : 'Preparing full report for download...');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Download size={14} />
              <span>{lang === 'ar' ? 'تحميل كشف الدرجات' : 'Download Scorecard'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeChild.examReports.map(ex => (
              <div
                key={ex.id}
                style={{
                  padding: '18px 20px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(21, 136, 199, 0.1)',
                      color: 'var(--primary)',
                      fontWeight: '800'
                    }}>
                      {ex.subjectAr}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      المعلم: {ex.teacherAr} • {ex.date}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                    {ex.titleAr}
                  </h4>

                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {lang === 'ar' ? 'تقييم المعلم:' : 'Teacher note:'} <span style={{ color: 'var(--text-primary)' }}>"{ex.notesAr}"</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{ex.rankAr}</div>
                    <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--primary)' }}>
                      {ex.score} / {ex.maxScore}
                    </div>
                  </div>

                  <div style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(22, 163, 74, 0.12)',
                    color: 'var(--color-success, #16A34A)',
                    fontSize: '16px',
                    fontWeight: '900'
                  }}>
                    {ex.percent}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════ TAB 5: HOMEWORK TRACKER ══════════════════ */}
      {activeTab === 'homework' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
            {lang === 'ar' ? 'متابعة التزام الطالب بتسليم الواجبات والتكليفات' : 'Homework & Assignments Submission Tracker'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
            {lang === 'ar'
              ? 'متابعة الواجبات المسندة للطالب أولاً بأول مع درجات التصحيح وملاحظات المعلم لكل تكليف.'
              : 'Keep track of pending and graded homework submissions with feedback notes.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeChild.homeworkItems.map(hw => (
              <div
                key={hw.id}
                style={{
                  padding: '18px 20px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}
              >
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(21, 136, 199, 0.1)',
                      color: 'var(--primary)',
                      fontWeight: '800'
                    }}>
                      {hw.subjectAr}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      المعلم: {hw.teacherAr} • الموعد: {hw.deadlineAr}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                    {hw.titleAr}
                  </h4>

                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {hw.notesAr}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {hw.earnedScore !== null && (
                    <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-success, #16A34A)' }}>
                      {hw.earnedScore} / {hw.maxScore}
                    </div>
                  )}

                  <span style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: hw.status === 'graded'
                      ? 'rgba(22, 163, 74, 0.12)'
                      : hw.status === 'submitted'
                      ? 'rgba(21, 136, 199, 0.12)'
                      : 'rgba(245, 158, 11, 0.12)',
                    color: hw.status === 'graded'
                      ? 'var(--color-success, #16A34A)'
                      : hw.status === 'submitted'
                      ? 'var(--primary)'
                      : 'var(--color-warning, #F59E0B)'
                  }}>
                    {hw.statusAr}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════ TAB 6: FINANCIALS & INVOICES ══════════════════ */}
      {activeTab === 'financials' && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                {lang === 'ar' ? 'سجل المصروفات والاشتراكات وإيصالات الدفع' : 'Tuition Fees & Official Payment Receipts'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                {lang === 'ar'
                  ? 'شفافية كاملة لجميع اشتراكات الحصص الشهرية والمذكرات المسددة بالسنتر أو إلكترونياً.'
                  : 'Full transparency over all course subscription fees, book purchases, and payment receipts.'}
              </p>
            </div>

            <div style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--primary-surface, rgba(21, 136, 199, 0.1))',
              border: '1px solid var(--border-subtle)',
              textAlign: isRtl ? 'left' : 'right'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {lang === 'ar' ? 'رصيد محفظة السنتر المتاح للطالب' : 'Available Center Wallet'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--primary)' }}>
                {activeChild.centerWalletEgp} ج.م
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'رقم الإيصال' : 'Receipt No.'}</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'البيان' : 'Description'}</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'طريقة السداد' : 'Payment Method'}</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                  <th style={{ padding: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {activeChild.invoices.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 12px', fontSize: '12.5px', fontWeight: '800', color: 'var(--primary)' }}>
                      {inv.receiptNo}
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      {inv.date}
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {inv.descriptionAr}
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      {inv.methodAr}
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {inv.amount}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'rgba(22, 163, 74, 0.12)',
                        color: 'var(--color-success, #16A34A)'
                      }}>
                        {inv.statusAr}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════ TAB 7: SETTINGS & PROFILE ══════════════════ */}
      {activeTab === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section 1: Parent Profile & Contact Info */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <User size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'بيانات ولي الأمر والاتصال' : 'Parent Profile & Contact Information'}
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
              {lang === 'ar'
                ? 'تُستخدم هذه البيانات للتواصل المباشر مع إدارة السنتر والمعلمين وإرسال التقارير الشهرية.'
                : 'Used by center administration and teachers to reach you and dispatch reports.'}
            </p>

            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'اسم ولي الأمر بالكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'رقم الهاتف الأساسي (تلقي الرسائل)' : 'Primary Mobile Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'رقم هاتف إضافي أو للطوارئ' : 'Secondary Emergency Number'}
                  </label>
                  <input
                    type="tel"
                    value={parentEmergencyPhone}
                    onChange={(e) => setParentEmergencyPhone(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                    {lang === 'ar' ? 'البريد الإلكتروني للتقارير' : 'Email for Reports'}
                  </label>
                  <input
                    type="email"
                    required
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '11px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {settingsSavedToast && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(22, 163, 74, 0.1)',
                  border: '1px solid rgba(22, 163, 74, 0.25)',
                  color: 'var(--success, #16A34A)',
                  fontSize: '13px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <CheckCircle2 size={16} />
                  <span>{settingsSavedToast}</span>
                </div>
              )}

              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 22px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <Save size={15} />
                <span>{lang === 'ar' ? 'حفظ تعديلات الملف الشخصي' : 'Save Profile'}</span>
              </button>
            </form>
          </div>

          {/* Section 2: Notification & Alert Preferences */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Bell size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'تخصيص الإشعارات والتنبيهات المباشرة' : 'Instant Alert & Notification Preferences'}
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
              {lang === 'ar'
                ? 'تحكم في نوعية الإشعارات والتنبيهات الفورية التي تصلك على هاتفك عند حركة الطالب.'
                : 'Configure automated push and SMS alerts for gate entries, grades, and sessions.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                {
                  key: 'gate',
                  titleAr: 'إشعار فوري عند مسح كود الطالب بالبوابة (دخول وخروج السنتر)',
                  titleEn: 'Instant gate barcode check-in and check-out notification',
                  descAr: 'يصلك إشعار بالوقت المحدد واسم القاعة فور تمرير كارت الطالب بالبوابة.',
                  descEn: 'Receive a timestamped alert the second student card is scanned at center gate.',
                  value: notifyGateCheckIn,
                  setter: setNotifyGateCheckIn
                },
                {
                  key: 'absence',
                  titleAr: 'تنبيه فوري في حال تأخر الطالب أو غيابه عن موعد الحصة',
                  titleEn: 'Immediate warning if student is absent or late to class',
                  descAr: 'إرسال تنبيه عاجل لولي الأمر إذا لم يمر الطالب من البوابة بعد بدء الحصة بربع ساعة.',
                  descEn: 'Send urgent alert if student does not arrive 15 minutes after session start.',
                  value: notifyAbsenceLate,
                  setter: setNotifyAbsenceLate
                },
                {
                  key: 'exams',
                  titleAr: 'إشعار لحظي فور اعتماد ورصد نتائج الامتحانات والكويزات',
                  titleEn: 'Instant scorecard alert as soon as test grades are published',
                  descAr: 'عرض الدرجة التي حققها الطالب والترتيب على الدفعة فور انتهاء تصحيح المعلم.',
                  descEn: 'Direct scorecard notification with grade and cohort ranking after correction.',
                  value: notifyExamResults,
                  setter: setNotifyExamResults
                },
                {
                  key: 'homework',
                  titleAr: 'تذكير ذكي بمواعيد تسليم الواجبات والتكليفات المدرسية',
                  titleEn: 'Smart reminders before homework submission deadlines',
                  descAr: 'تنبيه قبل انتهاء مهلة تسليم الواجب بـ 12 ساعة لمتابعة إنجاز الطالب.',
                  descEn: 'Gentle notification 12 hours prior to deadline to ensure homework completion.',
                  value: notifyHomeworkDue,
                  setter: setNotifyHomeworkDue
                },
                {
                  key: 'tuition',
                  titleAr: 'إشعارات تجديد الاشتراكات الشهرية وتأكيد سداد الإيصالات',
                  titleEn: 'Monthly tuition renewal reminders and payment receipt confirmations',
                  descAr: 'تذكير قبل بداية كل شهر جديد وتأكيد فوري بعد استلام الخزينة للاشتراك.',
                  descEn: 'Monthly fee reminders and immediate digital receipt verification upon payment.',
                  value: notifyTuitionRenewal,
                  setter: setNotifyTuitionRenewal
                }
              ].map(item => (
                <label
                  key={item.key}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {lang === 'ar' ? item.titleAr : item.titleEn}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: 1.4 }}>
                      {lang === 'ar' ? item.descAr : item.descEn}
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={item.value}
                    onChange={(e) => item.setter(e.target.checked)}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      marginTop: '3px',
                      accentColor: 'var(--primary)'
                    }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Linked Students Management */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                    {lang === 'ar' ? 'إدارة الأبناء المربوطين بالحساب' : 'Linked Student Profiles'}
                  </h3>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  {lang === 'ar'
                    ? 'يمكنك إضافة أكثر من ابن لمتابعة مسارهم الدراسي من حساب موحد.'
                    : 'Manage multiple children profiles from a single unified parent dashboard.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowLinkModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <span>{lang === 'ar' ? 'ربط طالب جديد +' : 'Link Student +'}</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {childrenList.map(ch => (
                <div
                  key={ch.id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={ch.avatar}
                      alt=""
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {lang === 'ar' ? ch.nameAr : ch.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {lang === 'ar' ? ch.gradeAr : ch.grade}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(22, 163, 74, 0.1)',
                    color: 'var(--color-success, #16A34A)'
                  }}>
                    {lang === 'ar' ? 'نشط ومربوط' : 'Linked'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Password & Security */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <ShieldCheck size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'أمان الحساب وتغيير كلمة المرور' : 'Account Security & Password'}
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
              {lang === 'ar'
                ? 'يُنصح باستخدام كلمة مرور قوية تحتوي على أرقام وحروف لتأمين حساب المتابعة.'
                : 'Ensure a secure password to protect your family monitoring portal.'}
            </p>

            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '500px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              {passwordSuccessToast && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(22, 163, 74, 0.1)',
                  border: '1px solid rgba(22, 163, 74, 0.25)',
                  color: 'var(--success, #16A34A)',
                  fontSize: '13px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <CheckCircle2 size={16} />
                  <span>{passwordSuccessToast}</span>
                </div>
              )}

              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {lang === 'ar' ? 'تحديث كلمة المرور' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════ MODAL: LINK NEW STUDENT CODE ══════════════════ */}
      {showLinkModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setShowLinkModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              padding: '28px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'ربط ابن أو طالب جديد بحسابك' : 'Link Another Student Profile'}
              </h3>
              <button
                onClick={() => setShowLinkModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              {lang === 'ar'
                ? 'أدخل كود الطالب المسجل على كارنيه السنتر لربط حسابه ومتابعة حضوره وامتحاناته تلقائياً.'
                : 'Enter the student enrollment code from the center ID card to monitor their progress.'}
            </p>

            <form onSubmit={handleLinkSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'كود الطالب بالسنتر' : 'Student Enrollment Code'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'مثال: كود الطالب أو رقم الكارنيه' : 'e.g. Student Code'}
                  value={linkStudentCode}
                  onChange={(e) => setLinkStudentCode(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '11px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'تأكيد الربط' : 'Confirm Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  style={{
                    padding: '11px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════ MODAL: CONTACT CENTER / TEACHER ══════════════════ */}
      {showContactModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setShowContactModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              padding: '28px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  {lang === 'ar' ? 'التواصل المباشر مع إدارة السنتر والمعلم' : 'Direct Communication with Center & Teachers'}
                </h3>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12.5px',
              color: 'var(--text-secondary)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Phone size={15} color="var(--primary)" />
              <span>{lang === 'ar' ? 'رقم الاستقبال المباشر بالسنتر: 01003344220' : 'Direct Center Reception: 01003344220'}</span>
            </div>

            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'الموضوع أو الاستفسار' : 'Subject'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'مثال: استفسار حول موعد حجز المراجعة النهائية' : 'e.g. Revision reservation inquiry'}
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'نص الرسالة أو الملاحظة' : 'Message'}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={lang === 'ar' ? 'اكتب ملاحظتك أو استفسارك هنا وسيقوم المشرف بالتواصل معك فوراً...' : 'Write your inquiry here...'}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '11px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Send size={14} />
                  <span>{lang === 'ar' ? 'إرسال الاستفسار' : 'Send Message'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  style={{
                    padding: '11px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
