import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  FileText, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Send, 
  Search, 
  X, 
  FileCheck,
  MessageSquare,
  AlertCircle,
  Trash2,
  Edit3,
  Eye,
  Download,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Check,
  Image as ImageIcon,
  Layers,
  MapPin,
  Users,
  Award,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  BookOpen,
  Filter,
  CheckCircle,
  XCircle,
  UploadCloud,
  Paperclip
} from 'lucide-react';

// Courses and their available lessons for assignment linking
const COURSES_WITH_LESSONS = [
  {
    courseTitle: 'ماستر كلاس الأحياء (3 ثانوي)',
    subject: 'الأحياء',
    lessons: [
      'حصة 1: تركيب البلاستيدات الخضراء والكلوروفيل',
      'حصة 2: التفاعلات الضوئية وحركة الإلكترونات بأغشية الثيلاكويد',
      'حصة 3: التفاعلات اللاضوئية ودورة كالفن وحسابات PGAL',
      'حصة 4: التنفس الخلوي الهوائي ودورة كريبس',
      'حصة 5: سلسلة نقل الإلكترون وحسابات جزيئات ATP'
    ]
  },
  {
    courseTitle: 'معسكر المراجعة النهائية ومصائد الامتحانات',
    subject: 'الأحياء',
    lessons: [
      'حصة 1: مراجعة الدعامة والحركة والمفاصل',
      'حصة 2: مراجعة التنسيق الهرموني والغدد الصماء',
      'حصة 3: مراجعة التكاثر في الكائنات الحية',
      'حصة 4: مراجعة المناعة والبيولوجيا الجزيئية'
    ]
  },
  {
    courseTitle: 'أساسيات فسيولوجيا الإنسان (2 ثانوي)',
    subject: 'الأحياء',
    lessons: [
      'حصة 1: التغذية الذاتية في النباتات الراقية',
      'حصة 2: الهضم في الإنسان وآلية عمل الإنزيمات',
      'حصة 3: النقل في النبات وأوعية الخشب واللحاء',
      'حصة 4: الجهاز الدوري والدم في الإنسان'
    ]
  },
  {
    courseTitle: 'العلوم المتكاملة والوراثة (3 إعدادي)',
    subject: 'العلوم',
    lessons: [
      'حصة 1: قوانين مندل الأول والثاني',
      'حصة 2: الانقسام الميتوزي والميوزي',
      'حصة 3: التفاعلات الكيميائية وسرعة التفاعل'
    ]
  }
];

// Target Locations / Centers
const TARGET_LOCATIONS = [
  { id: 'all', nameAr: 'جميع الأماكن (كل السناتر + الأونلاين)' },
  { id: 'ctr-1', nameAr: 'سنتر الدقي النخبة' },
  { id: 'ctr-2', nameAr: 'سنتر الرواد بمدينة نصر' },
  { id: 'ctr-3', nameAr: 'أكاديمية المتفوق الإلكترونية (أونلاين)' }
];

// Rich Initial Homeworks Database
const INITIAL_HOMEWORKS_DATABASE = [
  {
    id: 'hw-bio-01',
    titleAr: 'واجب الأسبوع 3: مقارنة التفاعلات الضوئية واللاضوئية ورسم البلاستيدة',
    courseTitleAr: 'ماستر كلاس الأحياء (3 ثانوي)',
    lessonAr: 'حصة 3: التفاعلات اللاضوئية ودورة كالفن وحسابات PGAL',
    targetLocationAr: 'جميع الأماكن (كل السناتر + الأونلاين)',
    targetLocationId: 'all',
    type: 'file', // 'file' | 'text' | 'image'
    fileType: 'pdf',
    attachmentName: 'كراسة_واجب_الأسبوع_3_الأحياء.pdf',
    textContent: '',
    dueDate: '2026-09-26',
    dueTime: '23:59',
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
        locationAr: 'سنتر الدقي النخبة',
        submittedAt: '2026-09-22 18:45',
        type: 'pdf',
        attachmentName: 'حل_عمر_طارق_واجب3.pdf',
        status: 'graded',
        score: 20,
        maxScore: 20,
        feedbackAr: 'إجابة نموذجية ورائعة يا عمر! التفسير الدقيق لدور NADP+ في نقل الهيدروجين ممتاز جداً ويدل على فهم عميق للباب.',
        sampleSolutionText: ''
      },
      {
        id: 'sub-2',
        studentId: 'std-sara-01',
        studentNameAr: 'سارة خالد منصور',
        studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        schoolAr: 'مدرسة المتفوقات STEM كفر الشيخ',
        locationAr: 'أكاديمية المتفوق الإلكترونية (أونلاين)',
        submittedAt: '2026-09-22 14:10',
        type: 'pdf',
        attachmentName: 'واجب_سارة_منصور_احياء.pdf',
        status: 'graded',
        score: 20,
        maxScore: 20,
        feedbackAr: 'تقفيل كامل كالعادة يا سارة، تنظيم الورقة واستخدام المخططات التوضيحية رائع ومبهر.',
        sampleSolutionText: ''
      },
      {
        id: 'sub-3',
        studentId: 'std-khaled-02',
        studentNameAr: 'خالد عبد الرحمن النجار',
        studentAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        schoolAr: 'المنصورة العسكرية بنين',
        locationAr: 'سنتر الرواد بمدينة نصر',
        submittedAt: '2026-09-23 09:30',
        type: 'image',
        attachmentName: 'صورة_كشكول_الواجب_خالد.jpg',
        status: 'pending',
        score: null,
        maxScore: 20,
        feedbackAr: '',
        sampleSolutionText: ''
      },
      {
        id: 'sub-4',
        studentId: 'std-mariam-03',
        studentNameAr: 'مريم عادل شنودة',
        studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        schoolAr: 'القومية لغات بالإسكندرية',
        locationAr: 'أكاديمية المتفوق الإلكترونية (أونلاين)',
        submittedAt: '2026-09-23 11:15',
        type: 'text',
        attachmentName: '',
        status: 'pending',
        score: null,
        maxScore: 20,
        feedbackAr: '',
        sampleSolutionText: 'حل السؤال الأول:\nالتفاعلات الضوئية تحدث داخل أغشية الجرانا في الثيلاكويد وتحتاج للضوء وصبغة الكلوروفيل، وينتج عنها انشطار الماء وتصاعد O2 وتكوين جزيئات الطاقة ATP و NADPH.\n\nحل السؤال الثاني:\nالتفاعلات اللاضوئية (دورة كالفن) تحدث في الستروما بمساعدة الإنزيمات، ويتم فيها تثبيت غاز ثاني أكسيد الكربون CO2 بواسطة الهيدروجين المحمول على NADPH بمساعدة طاقة ATP لإنتاج PGAL ثم الجلوكوز.\n\nحل المسألة:\nلتكوين 1 جزيء جلوكوز نحتاج 2 جزيء فوسفوجليسرالدهيد PGAL، وبالتالي تتطلب الدورة 6 جزيئات CO2 و 18 جزيء ATP و 12 جزيء NADPH.'
      },
      {
        id: 'sub-5',
        studentId: 'std-karim-04',
        studentNameAr: 'كريم مصطفى بدوي',
        studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        schoolAr: 'الأورمان النموذجية، الدقي',
        locationAr: 'سنتر الدقي النخبة',
        submittedAt: '2026-09-23 15:40',
        type: 'pdf',
        attachmentName: 'حل_كريم_بدوي_احياء.pdf',
        status: 'graded',
        score: 18,
        maxScore: 20,
        feedbackAr: 'ممتاز يا كريم، لكن راجع رسم غشاء البلاستيدة المزدوج والمسافة بين حبيبات الجرانا.',
        sampleSolutionText: ''
      },
      {
        id: 'sub-6',
        studentId: 'std-nour-05',
        studentNameAr: 'نور الهدى عثمان',
        studentAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
        schoolAr: 'المنصورة الثانوية بنات',
        locationAr: 'أكاديمية المتفوق الإلكترونية (أونلاين)',
        submittedAt: '2026-09-24 10:05',
        type: 'image',
        attachmentName: 'رسمة_البلاستيدة_نور.png',
        status: 'pending',
        score: null,
        maxScore: 20,
        feedbackAr: '',
        sampleSolutionText: ''
      },
      {
        id: 'sub-7',
        studentId: 'std-zeyad-06',
        studentNameAr: 'زياد هشام فهمي',
        studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        schoolAr: 'عباس العقاد الرسمية',
        locationAr: 'سنتر الرواد بمدينة نصر',
        submittedAt: '2026-09-24 12:20',
        type: 'pdf',
        attachmentName: 'حل_زياد_فهمي_احياء.pdf',
        status: 'rejected',
        score: 0,
        maxScore: 20,
        feedbackAr: 'تم رفض الملف لعدم وضوح التصوير ونقص الصفحة الثانية الخاصة بمسائل دورة كالفن. يرجى إعادة الرفع.',
        sampleSolutionText: ''
      }
    ]
  },
  {
    id: 'hw-bio-02',
    titleAr: 'واجب تطبيقي: حل مسائل ATP وحساب جزيئات الجلوكوز في دورة كالفن',
    courseTitleAr: 'ماستر كلاس الأحياء (3 ثانوي)',
    lessonAr: 'حصة 4: التنفس الخلوي الهوائي ودورة كريبس',
    targetLocationAr: 'سنتر الدقي النخبة',
    targetLocationId: 'ctr-1',
    type: 'text',
    fileType: null,
    attachmentName: '',
    textContent: '1. احسب عدد جزيئات ATP الناتجة من أكسدة 3 جزيئات جلوكوز أكسدة هوائية تامة داخل وخارج الميتوكوندريا.\n2. قارن بين نواتج دورة كريبس لجزيء أستيل واحد ونواتج الجزيئين.\n3. علل: يعتبر السيتوكروم حاملاً للإلكترونات ومستقبلاً نهائياً للطاقة.',
    dueDate: '2026-09-29',
    dueTime: '20:00',
    totalAssigned: 2450,
    submittedCount: 1420,
    gradedCount: 950,
    pendingGrading: 470,
    avgGrade: 17.1,
    maxGrade: 20,
    submissions: [
      {
        id: 'sub-201',
        studentId: 'std-omar-2026',
        studentNameAr: 'عمر طارق القاضي',
        studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        schoolAr: 'مدرسة السعيدية الثانوية العسكرية، الجيزة',
        locationAr: 'سنتر الدقي النخبة',
        submittedAt: '2026-09-27 16:30',
        type: 'text',
        attachmentName: '',
        status: 'graded',
        score: 19,
        maxScore: 20,
        feedbackAr: 'حل رائع وحسابات دقيقة لجزيئات الـ ATP الناتجة عن أكسدة الجلوكوز.',
        sampleSolutionText: 'ناتج أكسدة 3 جزيئات جلوكوز:\n- الجزيء الواحد يعطي 38 ATP في الأكسدة الهوائية التامة.\n- إذن 3 جزيئات = 3 × 38 = 114 جزيء ATP.\n- الناتجة في السيتوسول (انشطار الجلوكوز فقط) = 3 × 2 = 6 جزيء ATP مباشر.\n- الناتجة داخل الميتوكوندريا = 3 × 36 = 108 جزيء ATP.'
      },
      {
        id: 'sub-202',
        studentId: 'std-sara-01',
        studentNameAr: 'سارة خالد منصور',
        studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        schoolAr: 'مدرسة المتفوقات STEM كفر الشيخ',
        locationAr: 'سنتر الدقي النخبة',
        submittedAt: '2026-09-27 17:10',
        type: 'pdf',
        attachmentName: 'حل_سارة_مسائل_ATP.pdf',
        status: 'pending',
        score: null,
        maxScore: 20,
        feedbackAr: '',
        sampleSolutionText: ''
      }
    ]
  },
  {
    id: 'hw-bio-03',
    titleAr: 'تطبيق عملي: رسم قطاع عرضي في ورقة نبات ذو فلقتين وتحديد مسار الغذاء',
    courseTitleAr: 'أساسيات فسيولوجيا الإنسان (2 ثانوي)',
    lessonAr: 'حصة 1: التغذية الذاتية في النباتات الراقية',
    targetLocationAr: 'أكاديمية المتفوق الإلكترونية (أونلاين)',
    targetLocationId: 'ctr-3',
    type: 'file',
    fileType: 'image',
    attachmentName: 'مخطط_قطاع_الورقة_النموذجي.png',
    textContent: '',
    dueDate: '2026-10-02',
    dueTime: '22:00',
    totalAssigned: 980,
    submittedCount: 820,
    gradedCount: 750,
    pendingGrading: 70,
    avgGrade: 14.2,
    maxGrade: 15,
    submissions: [
      {
        id: 'sub-301',
        studentId: 'std-khaled-02',
        studentNameAr: 'خالد عبد الرحمن النجار',
        studentAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        schoolAr: 'المنصورة العسكرية بنين',
        locationAr: 'أكاديمية المتفوق الإلكترونية (أونلاين)',
        submittedAt: '2026-09-28 14:00',
        type: 'image',
        attachmentName: 'رسمة_قطاع_الورقة_خالد.jpg',
        status: 'pending',
        score: null,
        maxScore: 15,
        feedbackAr: '',
        sampleSolutionText: ''
      }
    ]
  },
  {
    id: 'hw-bio-04',
    titleAr: 'بنك أسئلة الدعامة والحركة: 25 مسألة مستويات تفكير عليا',
    courseTitleAr: 'معسكر المراجعة النهائية ومصائد الامتحانات',
    lessonAr: 'حصة 1: مراجعة الدعامة والحركة والمفاصل',
    targetLocationAr: 'جميع الأماكن (كل السناتر + الأونلاين)',
    targetLocationId: 'all',
    type: 'file',
    fileType: 'pdf',
    attachmentName: 'شيت_مسائل_الدعامة_والحركة.pdf',
    textContent: '',
    dueDate: '2026-10-08',
    dueTime: '23:59',
    totalAssigned: 1890,
    submittedCount: 1650,
    gradedCount: 1500,
    pendingGrading: 150,
    avgGrade: 27.8,
    maxGrade: 30,
    submissions: []
  }
];

export const TeacherHomeworkView = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const isAr = lang === 'ar';

  const [homeworks, setHomeworks] = useState(INITIAL_HOMEWORKS_DATABASE);
  
  // Navigation / View state: 'list' | 'detail' | 'grading'
  const [viewMode, setViewMode] = useState('list');
  const [selectedHwId, setSelectedHwId] = useState(homeworks[0]?.id || null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'completed'

  // Table search & filter inside Detail View
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [tableStatusFilter, setTableStatusFilter] = useState('all'); // 'all' | 'pending' | 'graded' | 'rejected'

  // Student Grading Desk States
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [gradeSuccessToast, setGradeSuccessToast] = useState(false);

  // Create Homework Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    courseTitle: COURSES_WITH_LESSONS[0].courseTitle,
    lesson: COURSES_WITH_LESSONS[0].lessons[0],
    targetLocationId: 'all',
    type: 'file', // 'file' | 'text'
    files: [], // Array of { id, file, url, name, size, type: 'pdf' | 'image' }
    textContent: '',
    maxGrade: '20',
    dueDate: '2026-10-06',
    dueTime: '23:59'
  });

  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileUploadError, setFileUploadError] = useState('');
  const [previewAttachmentModal, setPreviewAttachmentModal] = useState(null);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const processSelectedFiles = (incomingFiles) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    setFileUploadError('');

    const validFiles = Array.from(incomingFiles);

    validFiles.forEach((file) => {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isImg = file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name);

      if (!isPdf && !isImg) {
        setFileUploadError(isAr ? `الملف "${file.name}" ليس بصيغة مدعومة (فقط PDF أو صور).` : `Unsupported format: ${file.name}`);
        return;
      }

      if (file.size > 30 * 1024 * 1024) {
        setFileUploadError(isAr ? `حجم الملف "${file.name}" كبير جداً (أقصى حد 30 ميجابايت).` : `File ${file.name} is too large (>30MB).`);
        return;
      }

      const fileId = `hw-file-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const fileType = isPdf ? 'pdf' : 'image';

      const reader = new FileReader();
      reader.onload = (e) => {
        setCreateForm(prev => {
          const exists = prev.files.some(f => f.name === file.name && f.size === formatFileSize(file.size));
          if (exists) return prev;
          return {
            ...prev,
            files: [
              ...prev.files,
              {
                id: fileId,
                file: file,
                url: e.target.result,
                name: file.name,
                size: formatFileSize(file.size),
                type: fileType
              }
            ]
          };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processSelectedFiles(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processSelectedFiles(files);
    }
  };

  const handleRemoveSingleFile = (fileId) => {
    setCreateForm(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    }));
  };

  const handleClearAllFiles = () => {
    setCreateForm(prev => ({
      ...prev,
      files: []
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFileUploadError('');
  };

  // Delete Dialog state
  const [deleteHwDialog, setDeleteHwDialog] = useState({
    isOpen: false,
    id: null,
    title: ''
  });

  // Current selected homework & submission derived objects
  const selectedHw = homeworks.find(h => h.id === selectedHwId) || homeworks[0];
  const activeSubmission = selectedHw?.submissions?.find(s => s.id === selectedSubmissionId) || selectedHw?.submissions?.[0] || null;

  // Filtered Homeworks for View 1 (List)
  const filteredHomeworks = homeworks.filter(hw => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = hw.titleAr.toLowerCase().includes(q);
      const matchCourse = hw.courseTitleAr.toLowerCase().includes(q);
      const matchLesson = hw.lessonAr.toLowerCase().includes(q);
      if (!matchTitle && !matchCourse && !matchLesson) return false;
    }
    if (filterCourse !== 'all' && hw.courseTitleAr !== filterCourse) return false;
    if (filterStatus === 'pending' && hw.pendingGrading === 0) return false;
    if (filterStatus === 'completed' && hw.pendingGrading > 0) return false;
    return true;
  });

  // Filtered Submissions for View 2 (Table)
  const filteredSubmissions = (selectedHw?.submissions || []).filter(sub => {
    if (tableSearchQuery.trim()) {
      const q = tableSearchQuery.toLowerCase();
      const matchName = sub.studentNameAr.toLowerCase().includes(q);
      const matchSchool = sub.schoolAr.toLowerCase().includes(q);
      const matchLocation = (sub.locationAr || '').toLowerCase().includes(q);
      if (!matchName && !matchSchool && !matchLocation) return false;
    }
    if (tableStatusFilter !== 'all' && sub.status !== tableStatusFilter) return false;
    return true;
  });

  // Open Detail View (Students Submissions Table)
  const handleOpenHomeworkDetail = (hwId) => {
    setSelectedHwId(hwId);
    setViewMode('detail');
    setTableSearchQuery('');
    setTableStatusFilter('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Grading Desk for a specific student submission
  const handleOpenGradingDesk = (hwId, subId) => {
    setSelectedHwId(hwId);
    setSelectedSubmissionId(subId);
    const targetHw = homeworks.find(h => h.id === hwId);
    const targetSub = targetHw?.submissions?.find(s => s.id === subId);
    if (targetSub) {
      setGradeInput(targetSub.score !== null && targetSub.score !== undefined ? String(targetSub.score) : '');
      setFeedbackInput(targetSub.feedbackAr || '');
    }
    setViewMode('grading');
    setGradeSuccessToast(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reject Submission Button
  const handleRejectSubmission = () => {
    if (!activeSubmission || !selectedHw) return;
    const updatedSubmissions = selectedHw.submissions.map(sub => {
      if (sub.id === activeSubmission.id) {
        return {
          ...sub,
          status: 'rejected',
          score: 0,
          feedbackAr: feedbackInput.trim() || 'تم رفض الواجب لعدم استيفاء الشروط أو نقص الحل. يرجى مراجعة المعلم وإعادة المحاولة.'
        };
      }
      return sub;
    });

    const updatedHw = {
      ...selectedHw,
      submissions: updatedSubmissions,
      pendingGrading: Math.max(0, selectedHw.pendingGrading - (activeSubmission.status === 'pending' ? 1 : 0))
    };

    setHomeworks(prev => prev.map(h => h.id === selectedHw.id ? updatedHw : h));
    setGradeInput('0');
    setGradeSuccessToast(true);
    setTimeout(() => setGradeSuccessToast(false), 2500);
  };

  // Save / Approve Grade and Feedback
  const handleSaveGrading = (e) => {
    if (e) e.preventDefault();
    if (!activeSubmission || !selectedHw) return;

    const numericScore = Math.min(selectedHw.maxGrade, Math.max(0, Number(gradeInput) || 0));

    const updatedSubmissions = selectedHw.submissions.map(sub => {
      if (sub.id === activeSubmission.id) {
        return {
          ...sub,
          status: 'graded',
          score: numericScore,
          feedbackAr: feedbackInput
        };
      }
      return sub;
    });

    const newlyGraded = activeSubmission.status === 'pending' ? 1 : 0;
    const updatedHw = {
      ...selectedHw,
      submissions: updatedSubmissions,
      gradedCount: selectedHw.gradedCount + newlyGraded,
      pendingGrading: Math.max(0, selectedHw.pendingGrading - newlyGraded)
    };

    setHomeworks(prev => prev.map(h => h.id === selectedHw.id ? updatedHw : h));
    setGradeSuccessToast(true);
    setTimeout(() => setGradeSuccessToast(false), 2500);
  };

  // Student Navigator in Grading Desk
  const handleNextStudent = () => {
    const list = selectedHw?.submissions || [];
    const currentIndex = list.findIndex(s => s.id === activeSubmission?.id);
    if (currentIndex >= 0 && currentIndex < list.length - 1) {
      const nextSub = list[currentIndex + 1];
      setSelectedSubmissionId(nextSub.id);
      setGradeInput(nextSub.score !== null && nextSub.score !== undefined ? String(nextSub.score) : '');
      setFeedbackInput(nextSub.feedbackAr || '');
      setGradeSuccessToast(false);
    }
  };

  const handlePrevStudent = () => {
    const list = selectedHw?.submissions || [];
    const currentIndex = list.findIndex(s => s.id === activeSubmission?.id);
    if (currentIndex > 0) {
      const prevSub = list[currentIndex - 1];
      setSelectedSubmissionId(prevSub.id);
      setGradeInput(prevSub.score !== null && prevSub.score !== undefined ? String(prevSub.score) : '');
      setFeedbackInput(prevSub.feedbackAr || '');
      setGradeSuccessToast(false);
    }
  };

  // Create Homework Handler
  const handleCreateHomework = (e) => {
    e.preventDefault();
    if (!createForm.title.trim()) return;

    if (createForm.type === 'file' && createForm.files.length === 0) {
      setFileUploadError(isAr ? 'يرجى اختيار وإرفاق ملف واحد على الأقل (PDF أو صورة) للواجب.' : 'Please attach at least one file (PDF or image).');
      return;
    }

    const targetLoc = TARGET_LOCATIONS.find(l => l.id === createForm.targetLocationId);

    const attachmentsList = createForm.files.map(f => ({
      id: f.id,
      name: f.name,
      size: f.size,
      type: f.type,
      url: f.url
    }));

    const firstFile = attachmentsList[0];
    const defaultAttachmentName = firstFile 
      ? firstFile.name 
      : `${createForm.title.trim().replace(/\s+/g, '_')}.pdf`;

    const newHwObj = {
      id: `hw-${Date.now()}`,
      titleAr: createForm.title.trim(),
      courseTitleAr: createForm.courseTitle,
      lessonAr: createForm.lesson,
      targetLocationAr: targetLoc ? targetLoc.nameAr : 'جميع الأماكن',
      targetLocationId: createForm.targetLocationId,
      type: createForm.type,
      fileType: firstFile ? firstFile.type : 'pdf',
      attachmentName: defaultAttachmentName,
      attachments: attachmentsList,
      attachmentCount: attachmentsList.length,
      fileUrl: firstFile?.url || '',
      fileSize: firstFile?.size || '1.8 MB',
      textContent: createForm.type === 'text' ? createForm.textContent : '',
      dueDate: createForm.dueDate,
      dueTime: createForm.dueTime,
      totalAssigned: 2450,
      submittedCount: 0,
      gradedCount: 0,
      pendingGrading: 0,
      avgGrade: 0,
      maxGrade: Number(createForm.maxGrade) || 20,
      submissions: []
    };

    setHomeworks([newHwObj, ...homeworks]);
    setShowCreateModal(false);
    setSelectedHwId(newHwObj.id);
    setViewMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Homework Prompt & Confirm
  const promptDeleteHomework = (id, title, e) => {
    if (e) e.stopPropagation();
    setDeleteHwDialog({
      isOpen: true,
      id,
      title
    });
  };

  const handleConfirmDeleteHomework = () => {
    setHomeworks(prev => prev.filter(h => h.id !== deleteHwDialog.id));
    setDeleteHwDialog({ isOpen: false, id: null, title: '' });
    if (viewMode !== 'list') {
      setViewMode('list');
    }
  };

  // Overall Statistics for top ribbon
  const totalHomeworksCount = homeworks.length;
  const totalSubmissionsCount = homeworks.reduce((acc, h) => acc + (h.submittedCount || 0), 0);
  const totalGradedCount = homeworks.reduce((acc, h) => acc + (h.gradedCount || 0), 0);
  const totalPendingCount = homeworks.reduce((acc, h) => acc + (h.pendingGrading || 0), 0);

  return (
    <div className="hw-container" style={{
      maxWidth: '1240px',
      margin: '0 auto',
      fontFamily: 'var(--font-arabic)',
      boxSizing: 'border-box'
    }}>
      <style>{`
        .hw-container {
          padding: 28px 24px 100px;
        }
        @media (max-width: 768px) {
          .hw-container {
            padding: 16px 12px 100px !important;
          }
          .hw-header-row {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 14px !important;
          }
          .hw-header-btn {
            width: 100% !important;
            justify-content: center !important;
          }
          .hw-view1-search-box {
            max-width: 100% !important;
            width: 100% !important;
          }
          .hw-controls-row {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
            padding: 12px !important;
          }
          .hw-filter-search-box {
            max-width: 100% !important;
            width: 100% !important;
          }
          .hw-filter-tabs-wrap {
            width: 100% !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            white-space: nowrap !important;
            padding: 4px !important;
          }
          .hw-filter-tabs-wrap button {
            flex-shrink: 0 !important;
          }
          .hw-submissions-table-wrap {
            display: none !important;
          }
          .hw-submissions-mobile-cards {
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
            width: 100% !important;
          }
        }

        @media (min-width: 769px) {
          .hw-submissions-table-wrap {
            display: block !important;
          }
          .hw-submissions-mobile-cards {
            display: none !important;
          }
        }

        /* View 3: Grading Desk Grid */
        .hw-grading-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.95fr);
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 991px) {
          .hw-grading-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 16px !important;
            width: 100% !important;
          }
          .hw-grading-grid > div {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════════
          VIEW 1: HOMEWORKS LIST CARDS (نفس ديزاين الاختبارات وبنك الأسئلة)
         ═══════════════════════════════════════════════════════════════════ */}
      {viewMode === 'list' && (
        <div>
          {/* Top Header */}
          <div className="hw-header-row" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? 'rgba(0, 102, 204, 0.15)' : 'rgba(0, 102, 204, 0.08)',
                  color: 'var(--primary)',
                  fontSize: '11.5px',
                  fontWeight: '800'
                }}>
                  <BookOpen size={13} />
                  <span>{isAr ? 'التطبيقات والواجبات الأسبوعية' : 'Weekly Homework & Tasks'}</span>
                </span>
              </div>

              <h1 style={{
                fontSize: '22px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                margin: 0,
                fontFamily: 'var(--font-heading), var(--font-arabic)'
              }}>
                {isAr ? 'إدارة وتصحيح الواجبات المنزلية' : 'Homework Grading & Feedback'}
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                {isAr 
                  ? 'متابعة حلول الطلاب للواجبات، التصحيح السريع، وإرسال التغذية الراجعة الفورية' 
                  : 'Review student homework submissions, assign grades, and provide feedback'}
              </p>
            </div>

            <button
              className="hw-header-btn"
              onClick={() => {
                setCreateForm({
                  title: '',
                  courseTitle: COURSES_WITH_LESSONS[0].courseTitle,
                  lesson: COURSES_WITH_LESSONS[0].lessons[0],
                  targetLocationId: 'all',
                  type: 'file',
                  files: [],
                  textContent: '',
                  maxGrade: '20',
                  dueDate: '2026-10-06',
                  dueTime: '23:59'
                });
                setFileUploadError('');
                setShowCreateModal(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.92'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <Plus size={16} />
              <span>{isAr ? 'إضافة واجب جديد' : 'New Assignment'}</span>
            </button>
          </div>

          {/* Clean Overview Stats Ribbon (matching Exams design) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 18px',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                {isAr ? 'إجمالي الواجبات المنشورة' : 'Total Assignments'}
              </div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '4px' }}>
                {totalHomeworksCount} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>واجب</span>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 18px',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                {isAr ? 'إجمالي تسليمات الطلاب' : 'Total Submissions'}
              </div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary)', marginTop: '4px' }}>
                {totalSubmissionsCount.toLocaleString()} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>تسليم</span>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 18px',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                {isAr ? 'تم تصحيحه واعتماده' : 'Graded Submissions'}
              </div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--success)', marginTop: '4px' }}>
                {totalGradedCount.toLocaleString()} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>طالب</span>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 18px',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                {isAr ? 'قيد الانتظار والتصحيح' : 'Pending Review'}
              </div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', marginTop: '4px' }}>
                {totalPendingCount.toLocaleString()} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>طالب</span>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="hw-controls-row" style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '14px 18px',
            marginBottom: '24px',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            {/* Search Input Box */}
            <div className="hw-view1-search-box" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '8px 14px',
              flex: 1,
              minWidth: '220px',
              maxWidth: '440px'
            }}>
              <Search size={15} color="var(--text-muted)" />
              <input
                type="text"
                placeholder={isAr ? 'بحث في أسماء الواجبات، الحصص، أو المقررات...' : 'Search homeworks by title or lesson...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  width: '100%',
                  fontFamily: 'inherit'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Course Filter Dropdown & Status Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">{isAr ? 'جميع المقررات والكورسات' : 'All Courses'}</option>
                {COURSES_WITH_LESSONS.map(c => (
                  <option key={c.courseTitle} value={c.courseTitle}>{c.courseTitle}</option>
                ))}
              </select>

              <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-subtle)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                {[
                  { id: 'all', label: isAr ? 'الكل' : 'All' },
                  { id: 'pending', label: isAr ? 'قيد التصحيح' : 'Pending' },
                  { id: 'completed', label: isAr ? 'مكتمل' : 'Completed' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterStatus(tab.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: filterStatus === tab.id ? 'var(--primary)' : 'transparent',
                      color: filterStatus === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── HOMEWORKS CARDS GRID (Clean, balanced platform design) ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '18px'
          }}>
            {filteredHomeworks.map(hw => {
              return (
                <div
                  key={hw.id}
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-xs)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                  }}
                >
                  <div>
                    {/* Top Row: Course Tag + Format Tag + Delete Button */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: isDark ? 'rgba(0, 102, 204, 0.15)' : 'rgba(0, 102, 204, 0.08)',
                          color: 'var(--primary)',
                          border: '1px solid rgba(0, 102, 204, 0.2)'
                        }}>
                          {hw.courseTitleAr}
                        </span>

                        <span style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {hw.type === 'text' ? <FileText size={11} color="var(--primary)" /> : <FileCheck size={11} color="var(--primary)" />}
                          <span>{hw.type === 'text' ? 'واجب نصي' : (hw.fileType === 'image' ? 'صورة' : 'ملف PDF')}</span>
                        </span>
                      </div>

                      {/* Delete Homework button */}
                      <button
                        type="button"
                        onClick={(e) => promptDeleteHomework(hw.id, hw.titleAr, e)}
                        title={isAr ? 'حذف الواجب' : 'Delete Homework'}
                        style={{
                          padding: '4px 6px',
                          borderRadius: '6px',
                          backgroundColor: 'transparent',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#EF4444';
                          e.currentTarget.style.borderColor = '#FCA5A5';
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-muted)';
                          e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Homework Title */}
                    <h2 style={{
                      fontSize: '15.5px',
                      fontWeight: '900',
                      color: 'var(--text-primary)',
                      margin: '0 0 10px',
                      lineHeight: 1.45,
                      fontFamily: 'var(--font-heading), var(--font-arabic)'
                    }}>
                      {hw.titleAr}
                    </h2>

                    {/* Clean Metadata: Lesson & Deadline */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <Layers size={13} color="var(--primary)" />
                        <span>{hw.lessonAr}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        <Calendar size={12} />
                        <span>آخر موعد: {hw.dueDate} ({hw.dueTime || '23:59'})</span>
                        <span>•</span>
                        <MapPin size={12} />
                        <span>{hw.targetLocationAr}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Clean Stats Strip (Standard platform tokens, no yellow colors) */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '6px',
                      padding: '10px 8px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '14px',
                      textAlign: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>
                          {hw.submittedCount}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          المسلّمون
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>
                          {hw.pendingGrading}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          قيد الانتظار
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--primary)' }}>
                          {hw.maxGrade} درجة
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          الدرجة الكلية
                        </div>
                      </div>
                    </div>

                    {/* Action Button: Opens Table View */}
                    <button
                      type="button"
                      onClick={() => handleOpenHomeworkDetail(hw.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-xs)',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.92'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <Users size={14} />
                      <span>{isAr ? `عرض جدول الطلاب (${hw.submittedCount})` : 'View Students Table'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          VIEW 2: HOMEWORK DETAIL & SUBMISSIONS TABLE (جدول الطلاب المسلمين)
         ═══════════════════════════════════════════════════════════════════ */}
      {viewMode === 'detail' && selectedHw && (
        <div>
          {/* Back Button & Top Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <ArrowRight size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
              <span>{isAr ? 'الرجوع لقائمة الواجبات' : 'Back to Assignments'}</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={(e) => promptDeleteHomework(selectedHw.id, selectedHw.titleAr, e)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  color: '#EF4444',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={13} />
                <span>{isAr ? 'حذف هذا الواجب' : 'Delete Homework'}</span>
              </button>
            </div>
          </div>

          {/* Homework Specs Header Card */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px',
            marginBottom: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(0, 102, 204, 0.1)',
                color: 'var(--primary)',
                border: '1px solid rgba(0, 102, 204, 0.2)'
              }}>
                {selectedHw.courseTitleAr}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)'
              }}>
                {selectedHw.lessonAr}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)'
              }}>
                المكان: {selectedHw.targetLocationAr}
              </span>
            </div>

            <h1 style={{
              fontSize: '20px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              margin: '0 0 14px',
              fontFamily: 'var(--font-heading), var(--font-arabic)'
            }}>
              {selectedHw.titleAr}
            </h1>

            {/* Quick Specs Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12.5px'
            }}>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>الدرجة الكلية للواجب: </span>
                <strong style={{ color: 'var(--primary)' }}>{selectedHw.maxGrade} درجة</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>آخر موعد للتسليم: </span>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedHw.dueDate} ({selectedHw.dueTime || '23:59'})</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>إجمالي من سلّموا: </span>
                <strong style={{ color: 'var(--success)' }}>{selectedHw.submittedCount} طالب</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>المتبقي للتصحيح: </span>
                <strong style={{ color: selectedHw.pendingGrading > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                  {selectedHw.pendingGrading} طالب قيد الانتظار
                </strong>
              </div>
            </div>

            {/* If homework has attached files, show them */}
            {selectedHw.type === 'file' && (
              <div style={{
                marginTop: '14px',
                padding: '16px 18px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Paperclip size={15} color="var(--primary)" />
                    <span>
                      {isAr 
                        ? `الملفات والمستندات المرفقة بالواجب (${selectedHw.attachments?.length || 1} ملفات):` 
                        : `Attached Assignment Materials (${selectedHw.attachments?.length || 1} files):`}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {isAr ? 'يمكن للطلاب تصفح وتحميل كل ملف بشكل منفصل' : 'Students can preview and download each file'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '10px' }}>
                  {(selectedHw.attachments && selectedHw.attachments.length > 0 
                    ? selectedHw.attachments 
                    : [{ id: 'legacy-1', name: selectedHw.attachmentName || 'ملف_الواجب.pdf', type: selectedHw.fileType || 'pdf', size: selectedHw.fileSize || '1.8 MB', url: selectedHw.fileUrl }]
                  ).map((att, attIdx) => (
                    <div
                      key={att.id || attIdx}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          backgroundColor: att.type === 'pdf' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 102, 204, 0.1)',
                          color: att.type === 'pdf' ? '#EF4444' : 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {att.type === 'pdf' ? <FileText size={18} /> : <ImageIcon size={18} />}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{
                            fontSize: '12.5px',
                            fontWeight: '800',
                            color: 'var(--text-primary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {att.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {att.size}
                            </span>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: '700',
                              color: att.type === 'pdf' ? '#EF4444' : 'var(--primary)',
                              backgroundColor: att.type === 'pdf' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0, 102, 204, 0.08)',
                              padding: '1px 5px',
                              borderRadius: '4px'
                            }}>
                              {att.type === 'pdf' ? 'مستند PDF' : 'صورة'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewAttachmentModal({
                              url: att.url,
                              name: att.name,
                              type: att.type
                            });
                          }}
                          title={isAr ? 'معاينة' : 'Preview'}
                          style={{
                            padding: '6px 9px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-surface-elevated)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Eye size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (att.url) {
                              const a = document.createElement('a');
                              a.href = att.url;
                              a.download = att.name;
                              a.click();
                            } else {
                              alert(`جاري تحميل: ${att.name}`);
                            }
                          }}
                          title={isAr ? 'تحميل' : 'Download'}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: 'var(--primary)',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Download size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* If homework has text content, show it */}
            {selectedHw.type === 'text' && selectedHw.textContent && (
              <div style={{
                marginTop: '14px',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px dashed var(--border-subtle)',
                fontSize: '12.5px',
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                whiteSpace: 'pre-line'
              }}>
                <div style={{ fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
                  نص ومسائل الواجب المطلوب حلها من الطلاب:
                </div>
                {selectedHw.textContent}
              </div>
            )}
          </div>

          {/* Table Controls (Search & Status Filter Tabs) */}
          <div className="hw-controls-row" style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '14px 18px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div className="hw-filter-search-box" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '8px 14px',
              flex: 1,
              maxWidth: '400px'
            }}>
              <Search size={14} color="var(--text-muted)" />
              <input
                type="text"
                placeholder={isAr ? 'بحث في جدول الطلاب باسم الطالب أو المدرسة أو السنتر...' : 'Search student name or school...'}
                value={tableSearchQuery}
                onChange={(e) => setTableSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  width: '100%',
                  fontFamily: 'inherit'
                }}
              />
              {tableSearchQuery && (
                <button
                  onClick={() => setTableSearchQuery('')}
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="hw-filter-tabs-wrap" style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-subtle)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              {[
                { id: 'all', label: isAr ? `الكل (${selectedHw?.submissions?.length || 0})` : 'All' },
                { id: 'pending', label: isAr ? `قيد الانتظار (${selectedHw?.submissions?.filter(s => s.status === 'pending').length || 0})` : 'Pending' },
                { id: 'graded', label: isAr ? `تم التصحيح (${selectedHw?.submissions?.filter(s => s.status === 'graded').length || 0})` : 'Graded' },
                { id: 'rejected', label: isAr ? `مرفوض (${selectedHw?.submissions?.filter(s => s.status === 'rejected').length || 0})` : 'Rejected' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setTableStatusFilter(tab.id)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: tableStatusFilter === tab.id ? 'var(--primary)' : 'transparent',
                    color: tableStatusFilter === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── THE SUBMISSIONS TABLE (DESKTOP: جدول الطلاب الذين سلموا الواجب) ── */}
          <div className="hw-submissions-table-wrap" style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: isRtl ? 'right' : 'left',
                fontSize: '13px'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderBottom: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontWeight: '800',
                    fontSize: '12px'
                  }}>
                    <th style={{ padding: '12px 16px', width: '40px' }}>#</th>
                    <th style={{ padding: '12px 16px' }}>الطالب والمدرسة</th>
                    <th style={{ padding: '12px 16px' }}>المكان / السنتر</th>
                    <th style={{ padding: '12px 16px' }}>وقت التسليم</th>
                    <th style={{ padding: '12px 16px' }}>نوع الحل المرفق</th>
                    <th style={{ padding: '12px 16px' }}>حالة الواجب</th>
                    <th style={{ padding: '12px 16px' }}>الدرجة المرصودة</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((sub, idx) => (
                      <tr
                        key={sub.id}
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontWeight: '700' }}>
                          {idx + 1}
                        </td>

                        {/* Student Name & Avatar */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={sub.studentAvatar}
                              alt={sub.studentNameAr}
                              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                                {sub.studentNameAr}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                {sub.schoolAr}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Location / Center */}
                        <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {sub.locationAr || 'المنصة أونلاين'}
                        </td>

                        {/* Submitted timestamp */}
                        <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {sub.submittedAt}
                        </td>

                        {/* Submission attachment type */}
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '11.5px',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--bg-subtle)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-subtle)'
                          }}>
                            {sub.type === 'pdf' ? <FileCheck size={12} color="var(--primary)" /> : 
                             sub.type === 'image' ? <ImageIcon size={12} color="var(--primary)" /> :
                             <FileText size={12} color="var(--primary)" />}
                            <span>
                              {sub.type === 'pdf' ? (sub.attachmentName || 'ملف PDF') :
                               sub.type === 'image' ? (sub.attachmentName || 'صورة الحل') :
                               'إجابة نصية مكتوبة'}
                            </span>
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td style={{ padding: '14px 16px' }}>
                          {sub.status === 'graded' ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 9px',
                              borderRadius: '6px',
                              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
                              color: 'var(--success)',
                              border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.25)' : '#A7F3D0'}`,
                              fontSize: '11.5px',
                              fontWeight: '800'
                            }}>
                              <CheckCircle size={12} />
                              <span>تم الرصد والاعتماد</span>
                            </span>
                          ) : sub.status === 'rejected' ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 9px',
                              borderRadius: '6px',
                              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
                              color: '#EF4444',
                              border: '1px solid rgba(239, 68, 68, 0.25)',
                              fontSize: '11.5px',
                              fontWeight: '800'
                            }}>
                              <XCircle size={12} />
                              <span>مرفوض (إعادة رفع)</span>
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 9px',
                              borderRadius: '6px',
                              backgroundColor: isDark ? 'rgba(0, 102, 204, 0.12)' : 'rgba(0, 102, 204, 0.06)',
                              color: 'var(--primary)',
                              border: '1px solid rgba(0, 102, 204, 0.2)',
                              fontSize: '11.5px',
                              fontWeight: '800'
                            }}>
                              <Clock size={12} />
                              <span>قيد الانتظار</span>
                            </span>
                          )}
                        </td>

                        {/* Score Column */}
                        <td style={{ padding: '14px 16px' }}>
                          {sub.status === 'graded' ? (
                            <span style={{ fontWeight: '900', color: 'var(--primary)', fontSize: '13.5px' }}>
                              {sub.score} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ {selectedHw.maxGrade}</span>
                            </span>
                          ) : sub.status === 'rejected' ? (
                            <span style={{ fontWeight: '800', color: '#EF4444', fontSize: '12px' }}>
                              0 / {selectedHw.maxGrade}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                              — / {selectedHw.maxGrade}
                            </span>
                          )}
                        </td>

                        {/* Action Column */}
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenGradingDesk(selectedHw.id, sub.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 14px',
                              borderRadius: '6px',
                              backgroundColor: sub.status === 'pending' ? 'var(--primary)' : 'var(--bg-subtle)',
                              color: sub.status === 'pending' ? '#FFFFFF' : 'var(--text-primary)',
                              border: sub.status === 'pending' ? 'none' : '1px solid var(--border-subtle)',
                              fontSize: '12px',
                              fontWeight: '800',
                              cursor: 'pointer',
                              boxShadow: sub.status === 'pending' ? '0 2px 8px rgba(0, 102, 204, 0.25)' : 'none'
                            }}
                          >
                            <Edit3 size={12} />
                            <span>{sub.status === 'pending' ? 'تصحيح الواجب' : 'مراجعة التصحيح'}</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        لا توجد تسليمات مطابقة للبحث أو التصفية الحالية.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── MOBILE SUBMISSIONS CARDS (عرض متجاوب بالكامل للتليفون بدون اسكرول أفقي) ── */}
          <div className="hw-submissions-mobile-cards">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((sub, idx) => (
                <div
                  key={sub.id}
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '14px',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  {/* Top Row: Student Avatar, Name, School & Status Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    marginBottom: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <img
                        src={sub.studentAvatar}
                        alt={sub.studentNameAr}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontWeight: '900',
                          color: 'var(--text-primary)',
                          fontSize: '13.5px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {sub.studentNameAr}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          marginTop: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {sub.schoolAr}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div style={{ flexShrink: 0 }}>
                      {sub.status === 'graded' ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
                          color: 'var(--success)',
                          border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.25)' : '#A7F3D0'}`,
                          fontSize: '11px',
                          fontWeight: '800',
                          whiteSpace: 'nowrap'
                        }}>
                          <CheckCircle size={11} />
                          <span>تم الرصد</span>
                        </span>
                      ) : sub.status === 'rejected' ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
                          color: '#EF4444',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          fontSize: '11px',
                          fontWeight: '800',
                          whiteSpace: 'nowrap'
                        }}>
                          <XCircle size={11} />
                          <span>مرفوض</span>
                        </span>
                      ) : (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: isDark ? 'rgba(0, 102, 204, 0.12)' : 'rgba(0, 102, 204, 0.06)',
                          color: 'var(--primary)',
                          border: '1px solid rgba(0, 102, 204, 0.2)',
                          fontSize: '11px',
                          fontWeight: '800',
                          whiteSpace: 'nowrap'
                        }}>
                          <Clock size={11} />
                          <span>قيد الانتظار</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metadata Grid (Center, Format, Time, Score) */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '6px 8px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '11.5px',
                    marginBottom: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', minWidth: 0 }}>
                      <MapPin size={11} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sub.locationAr || 'أونلاين'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', minWidth: 0 }}>
                      {sub.type === 'pdf' ? <FileCheck size={11} color="var(--primary)" style={{ flexShrink: 0 }} /> : 
                       sub.type === 'image' ? <ImageIcon size={11} color="var(--primary)" style={{ flexShrink: 0 }} /> :
                       <FileText size={11} color="var(--primary)" style={{ flexShrink: 0 }} />}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sub.type === 'pdf' ? (sub.attachmentName || 'ملف PDF') :
                         sub.type === 'image' ? (sub.attachmentName || 'صورة') :
                         'نص مكتوب'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                      <Clock size={11} style={{ flexShrink: 0 }} />
                      <span>{sub.submittedAt}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Award size={11} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span style={{
                        fontWeight: '800',
                        color: sub.status === 'graded' ? 'var(--primary)' : sub.status === 'rejected' ? '#EF4444' : 'var(--text-muted)'
                      }}>
                        الدرجة: {sub.status === 'graded' ? `${sub.score} / ${selectedHw.maxGrade}` : sub.status === 'rejected' ? `0 / ${selectedHw.maxGrade}` : `— / ${selectedHw.maxGrade}`}
                      </span>
                    </div>
                  </div>

                  {/* Action Button: 100% full width, large tap target */}
                  <button
                    type="button"
                    onClick={() => handleOpenGradingDesk(selectedHw.id, sub.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      backgroundColor: sub.status === 'pending' ? 'var(--primary)' : 'var(--bg-subtle)',
                      color: sub.status === 'pending' ? '#FFFFFF' : 'var(--text-primary)',
                      border: sub.status === 'pending' ? 'none' : '1px solid var(--border-subtle)',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: sub.status === 'pending' ? '0 2px 8px rgba(0, 102, 204, 0.25)' : 'none'
                    }}
                  >
                    <Edit3 size={13} />
                    <span>{sub.status === 'pending' ? 'تصحيح الواجب' : 'مراجعة التصحيح'}</span>
                  </button>
                </div>
              ))
            ) : (
              <div style={{
                padding: '30px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                fontSize: '13px'
              }}>
                لا توجد تسليمات مطابقة للبحث أو التصفية الحالية.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          VIEW 3: STUDENT GRADING DESK (شاشة تصحيح ورصد درجات الطالب)
         ═══════════════════════════════════════════════════════════════════ */}
      {viewMode === 'grading' && selectedHw && activeSubmission && (
        <div>
          {/* Top Bar: Back to table & Student navigator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <button
              type="button"
              onClick={() => setViewMode('detail')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <ArrowRight size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
              <span>{isAr ? 'الرجوع لجدول تسليمات الواجب' : 'Back to Submissions Table'}</span>
            </button>

            {/* Quick Student Switcher buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                طالب {(selectedHw?.submissions || []).findIndex(s => s.id === activeSubmission.id) + 1} من {(selectedHw?.submissions || []).length}
              </span>

              <button
                type="button"
                onClick={handlePrevStudent}
                disabled={(selectedHw?.submissions || []).findIndex(s => s.id === activeSubmission.id) === 0}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: (selectedHw?.submissions || []).findIndex(s => s.id === activeSubmission.id) === 0 ? 'not-allowed' : 'pointer',
                  opacity: (selectedHw?.submissions || []).findIndex(s => s.id === activeSubmission.id) === 0 ? 0.4 : 1
                }}
              >
                السابق
              </button>

              <button
                type="button"
                onClick={handleNextStudent}
                disabled={(selectedHw?.submissions || []).findIndex(s => s.id === activeSubmission.id) === (selectedHw?.submissions || []).length - 1}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: (selectedHw?.submissions || []).findIndex(s => s.id === activeSubmission.id) === (selectedHw?.submissions || []).length - 1 ? 'not-allowed' : 'pointer',
                  opacity: (selectedHw?.submissions || []).findIndex(s => s.id === activeSubmission.id) === (selectedHw?.submissions || []).length - 1 ? 0.4 : 1
                }}
              >
                التالي
              </button>
            </div>
          </div>

          {/* Grading Desk Split Layout: Left Solution Preview, Right Grading Form */}
          <div className="hw-grading-grid">
            {/* ── LEFT PANE: STUDENT SOLUTION PREVIEW ── */}
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '22px',
              boxShadow: 'var(--shadow-xs)'
            }}>
              {/* Student Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '18px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={activeSubmission.studentAvatar}
                    alt={activeSubmission.studentNameAr}
                    style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
                      {activeSubmission.studentNameAr}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {activeSubmission.schoolAr} • السنتر: {activeSubmission.locationAr || 'أونلاين'}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>
                    وقت وتاريخ التسليم:
                  </span>
                  <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {activeSubmission.submittedAt}
                  </span>
                </div>
              </div>

              {/* Solution Canvas / Content Viewer */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Eye size={15} color="var(--primary)" />
                    <span>
                      {activeSubmission.type === 'pdf' ? 'معاينة ملف الـ PDF المرفق من الطالب:' :
                       activeSubmission.type === 'image' ? 'معاينة صورة كشكول الواجب المرفوعة من الطالب:' :
                       'معاينة الإجابة النصية المكتوبة من الطالب:'}
                    </span>
                  </div>

                  {activeSubmission.type !== 'text' && (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {activeSubmission.attachmentName}
                    </span>
                  )}
                </div>

                {/* PDF PREVIEW CANCEL */}
                {activeSubmission.type === 'pdf' && (
                  <div style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1.5px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '24px',
                    minHeight: '380px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.04)'
                  }}>
                    <div style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '16px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <FileCheck size={26} color="var(--primary)" />
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: '900', color: 'var(--text-primary)' }}>
                            {activeSubmission.attachmentName || 'حل_الواجب_النموذجي.pdf'}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                            مستند PDF رسمي • صفحتان ممسوحتان ضوئياً بجودة عالية
                          </div>
                        </div>
                      </div>

                      {/* Mock Rendered PDF Page Content */}
                      <div style={{
                        backgroundColor: '#FFFFFF',
                        color: '#1E293B',
                        padding: '18px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        fontSize: '12.5px',
                        lineHeight: 1.7,
                        fontFamily: 'monospace'
                      }}>
                        <div style={{ borderBottom: '1px dashed #CBD5E1', paddingBottom: '8px', marginBottom: '10px', fontWeight: 'bold' }}>
                          ورقة إجابة الطالب: {activeSubmission.studentNameAr} • كود: {activeSubmission.studentId}
                        </div>
                        <div>
                          <strong>إجابة س1: مقارنة التفاعلات الضوئية واللاضوئية:</strong><br />
                          1. التفاعلات الضوئية: تحدث في الجرانا، تتطلب الضوء، ينتج ATP و NADPH وانشطار الماء.<br />
                          2. التفاعلات اللاضوئية (دورة كالفن): تحدث في الستروما، لا تتطلب ضوء مباشر وتعتمد على نواتج المرحلة الضوئية لتثبيت CO2 وإنتاج سكر الجلوكوز.<br />
                          <br />
                          <strong>إجابة س2: رسم وتسمية البلاستيدة الخضراء:</strong><br />
                          (تم رسم الغشاء المزدوج، أقراص الثيلاكويد المرصوصة، حبيبات النشا، والستروما الشفافة بدقة).
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => alert(`جاري تنزيل ملف الطالب: ${activeSubmission.attachmentName}`)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-surface-elevated)',
                          color: 'var(--text-primary)',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        <Download size={13} />
                        <span>تحميل الملف الأصلي</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* IMAGE PREVIEW */}
                {activeSubmission.type === 'image' && (
                  <div style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1.5px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '10px'
                    }}>
                      <img
                        src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80"
                        alt="Handwritten solution"
                        style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }}
                      />
                    </div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      صورة واضحة تم التقاطها لكشكول الواجب بخط يد الطالب ({activeSubmission.attachmentName})
                    </span>
                  </div>
                )}

                {/* TEXT PREVIEW */}
                {activeSubmission.type === 'text' && (
                  <div style={{
                    backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#FFFDF7',
                    border: '1.5px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '20px',
                    minHeight: '280px',
                    lineHeight: 1.8,
                    fontSize: '13.5px',
                    color: 'var(--text-primary)',
                    whiteSpace: 'pre-line',
                    boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.05)'
                  }}>
                    {activeSubmission.sampleSolutionText || 'تمت الإجابة نصياً على جميع أسئلة الواجب المطلوب.'}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT PANE: GRADING DESK & SCORING CONTROLS ── */}
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '22px',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Award size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                  رصد الدرجة والتصحيح
                </h3>
              </div>

              {/* Success Toast banner */}
              {gradeSuccessToast && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid var(--success)',
                  color: 'var(--success)',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <CheckCircle2 size={16} />
                  <span>تم اعتماد الدرجة وإرسال التغذية الراجعة لحساب الطالب بنجاح!</span>
                </div>
              )}

              {/* Grading Form */}
              <form onSubmit={handleSaveGrading} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                      الدرجة المستحقة للطالب:
                    </label>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      الحد الأقصى: {selectedHw.maxGrade} درجة
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      min="0"
                      max={selectedHw.maxGrade}
                      step="0.5"
                      required
                      value={gradeInput}
                      onChange={(e) => setGradeInput(e.target.value)}
                      placeholder={`مثال: ${selectedHw.maxGrade}`}
                      style={{
                        width: '100px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--primary)',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '16px',
                        fontWeight: '900',
                        textAlign: 'center',
                        outline: 'none'
                      }}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                      من {selectedHw.maxGrade} درجات
                    </span>
                  </div>
                </div>

                {/* Quick Feedback Chips (No emojis) */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    قوالب توجيهات سريعة:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {[
                      'إجابة نموذجية ومكتملة الخطوات',
                      'يرجى مراجعة الرسم التوضيحي والبيانات',
                      'كتابة خطوات القانون والوحدات بدقة',
                      'تنسيق وتنظيم متميز للإجابة'
                    ].map((chip, cIdx) => (
                      <button
                        key={cIdx}
                        type="button"
                        onClick={() => setFeedbackInput(prev => prev ? `${prev}\n${chip}` : chip)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-secondary)',
                          fontSize: '11.5px',
                          cursor: 'pointer'
                        }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Teacher Feedback Textarea */}
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    ملاحظات وتوجيهات المعلم (تصل فوراً لحساب الطالب):
                  </label>
                  <textarea
                    rows="4"
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="اكتب تعليقك ونقاط القوة أو الأخطاء التي يجب على الطالب الانتباه لها..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '12.5px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Actions: Save Grade or Reject */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    style={{
                      flex: '1 1 180px',
                      padding: '11px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Send size={15} />
                    <span>اعتماد الدرجة ورصد التصحيح</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRejectSubmission}
                    style={{
                      flex: '1 1 120px',
                      padding: '11px 16px',
                      borderRadius: '8px',
                      border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #FECACA',
                      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEF2F2',
                      color: '#EF4444',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <XCircle size={15} />
                    <span>رفض الواجب</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          CREATE HOMEWORK MODAL (إضافة واجب جديد: نص أو ملف + ربط الحصة والمكان)
         ═══════════════════════════════════════════════════════════════════ */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            width: '100%',
            maxWidth: '580px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
                  إضافة وتكليف واجب أسبوعي جديد
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateHomework} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Title */}
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  عنوان الواجب والتطبيق:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: واجب الأسبوع 4: مسائل حسابات ATP ودورة كالفن"
                  value={createForm.title}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Course & Linked Lesson Selection */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    المادة والمقرر الدراسي:
                  </label>
                  <select
                    value={createForm.courseTitle}
                    onChange={(e) => {
                      const selectedCourse = COURSES_WITH_LESSONS.find(c => c.courseTitle === e.target.value);
                      setCreateForm(prev => ({
                        ...prev,
                        courseTitle: e.target.value,
                        lesson: selectedCourse?.lessons[0] || 'حصة عامة'
                      }));
                    }}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '12.5px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    {COURSES_WITH_LESSONS.map(c => (
                      <option key={c.courseTitle} value={c.courseTitle}>{c.courseTitle}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    الحصة المرتبطة من الحصص المسجلة:
                  </label>
                  <select
                    value={createForm.lesson}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, lesson: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '12.5px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    {(COURSES_WITH_LESSONS.find(c => c.courseTitle === createForm.courseTitle)?.lessons || []).map(les => (
                      <option key={les} value={les}>{les}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Location / Centers selection */}
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  المكان المستهدف (السناتر أو الأونلاين):
                </label>
                <select
                  value={createForm.targetLocationId}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, targetLocationId: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '12.5px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  {TARGET_LOCATIONS.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.nameAr}</option>
                  ))}
                </select>
              </div>

              {/* Homework Type Switcher: Text vs File/Image */}
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  طريقة ونوع إضافة الواجب:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setCreateForm(prev => ({ ...prev, type: 'file' }))}
                    style={{
                      padding: '9px',
                      borderRadius: '8px',
                      border: `1.5px solid ${createForm.type === 'file' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      backgroundColor: createForm.type === 'file' ? 'rgba(0, 102, 204, 0.1)' : 'var(--bg-subtle)',
                      color: createForm.type === 'file' ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <UploadCloud size={14} />
                    <span>إرفاق كملف (PDF أو صورة)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreateForm(prev => ({ ...prev, type: 'text' }))}
                    style={{
                      padding: '9px',
                      borderRadius: '8px',
                      border: `1.5px solid ${createForm.type === 'text' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      backgroundColor: createForm.type === 'text' ? 'rgba(0, 102, 204, 0.1)' : 'var(--bg-subtle)',
                      color: createForm.type === 'text' ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: '12.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={14} />
                    <span>كتابة الواجب كنص ومسائل</span>
                  </button>
                </div>
              </div>

              {/* Conditional Inputs based on format */}
              {createForm.type === 'file' ? (
                <div style={{
                  padding: '14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {/* File Type Filter / Hint Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Paperclip size={14} color="var(--primary)" />
                      <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        مرفقات الواجب (يمكنك رفع عدة ملفات PDF وعدة صور معاً):
                      </span>
                    </div>
                    {createForm.files.length > 0 && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'var(--primary)',
                        backgroundColor: 'rgba(0, 102, 204, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        {createForm.files.length} {createForm.files.length === 1 ? 'ملف مرفق' : 'ملفات مرفقة'}
                      </span>
                    )}
                  </div>

                  {/* Hidden Multi-File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,application/pdf,image/png,image/jpeg,image/webp,image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />

                  {/* Dropzone Box */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{
                      padding: createForm.files.length > 0 ? '16px' : '24px 16px',
                      borderRadius: '10px',
                      backgroundColor: isDragging ? 'rgba(0, 102, 204, 0.08)' : 'var(--bg-surface-elevated)',
                      border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isDragging) {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)';
                      }
                    }}
                  >
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: isDragging ? 'rgba(0, 102, 204, 0.15)' : 'var(--bg-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)'
                    }}>
                      <UploadCloud size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {isAr 
                          ? (createForm.files.length > 0 ? 'انقر أو اسحب لإضافة المزيد من ملفات الـ PDF أو الصور' : 'انقر لاختيار ملفات PDF أو صور الواجب، أو اسحب الملفات هنا')
                          : 'Click to select PDF files or images, or drag & drop files here'}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {isAr 
                          ? 'يمكنك تحديد واختيار أكثر من ملف PDF وأكثر من صورة في نفس الوقت (بحد أقصى 30MB لكل ملف)'
                          : 'You can attach multiple PDFs and images together'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      style={{
                        marginTop: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 16px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: '800',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-xs)'
                      }}
                    >
                      <Plus size={14} />
                      <span>{createForm.files.length > 0 ? (isAr ? 'إضافة ملفات أخرى' : 'Add More Files') : (isAr ? 'اختيار الملفات من الجهاز' : 'Choose Files')}</span>
                    </button>
                  </div>

                  {/* List of Uploaded Files */}
                  {createForm.files.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                          الملفات المرفقة حالياً ({createForm.files.length}):
                        </span>
                        <button
                          type="button"
                          onClick={handleClearAllFiles}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#EF4444',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 4px'
                          }}
                        >
                          <Trash2 size={12} />
                          <span>مسح الكل</span>
                        </button>
                      </div>

                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        maxHeight: '220px',
                        overflowY: 'auto',
                        paddingRight: '2px'
                      }}>
                        {createForm.files.map((fileObj, idx) => (
                          <div
                            key={fileObj.id || idx}
                            style={{
                              backgroundColor: 'var(--bg-surface-elevated)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '10px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                              {fileObj.type === 'image' ? (
                                <img
                                  src={fileObj.url}
                                  alt="Preview"
                                  style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '6px',
                                    objectFit: 'cover',
                                    border: '1px solid var(--border-subtle)',
                                    flexShrink: 0
                                  }}
                                />
                              ) : (
                                <div style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '6px',
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  color: '#EF4444',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}>
                                  <FileText size={18} />
                                </div>
                              )}

                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{
                                  fontSize: '12.5px',
                                  fontWeight: '800',
                                  color: 'var(--text-primary)',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {fileObj.name}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                    {fileObj.size}
                                  </span>
                                  <span style={{
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    color: fileObj.type === 'pdf' ? '#EF4444' : 'var(--primary)',
                                    backgroundColor: fileObj.type === 'pdf' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0, 102, 204, 0.08)',
                                    padding: '1px 5px',
                                    borderRadius: '4px'
                                  }}>
                                    {fileObj.type === 'pdf' ? 'مستند PDF' : 'صورة'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewAttachmentModal({
                                    url: fileObj.url,
                                    name: fileObj.name,
                                    type: fileObj.type
                                  });
                                }}
                                title={isAr ? 'معاينة' : 'Preview'}
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid var(--border-subtle)',
                                  backgroundColor: 'var(--bg-subtle)',
                                  color: 'var(--text-primary)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Eye size={13} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemoveSingleFile(fileObj.id)}
                                title={isAr ? 'إزالة' : 'Remove'}
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid var(--border-subtle)',
                                  backgroundColor: 'transparent',
                                  color: '#EF4444',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Error banner if file upload failed */}
                  {fileUploadError && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#EF4444',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}>
                      <AlertCircle size={15} />
                      <span>{fileUploadError}</span>
                    </div>
                  )}

                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {createForm.fileType === 'pdf'
                      ? 'يمكن للطلاب فتح ملف مستند الـ PDF وحله، وتنزيله مباشرة من حساباتهم.'
                      : 'يمكن للطلاب عرض الصورة بوضوح عالي، وتنزيلها لحل التمارين المطلوبة.'}
                  </div>
                </div>
              ) : (
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    نص ومسائل الواجب (اكتب الأسئلة هنا):
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={createForm.textContent}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, textContent: e.target.value }))}
                    placeholder="اكتب نصوص الأسئلة والمسائل المطلوب من الطالب حلها بالتفصيل..."
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '12.5px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              {/* Max Grade and Deadline */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    درجة الواجب:
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={createForm.maxGrade}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, maxGrade: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    تاريخ التسليم:
                  </label>
                  <input
                    type="date"
                    required
                    value={createForm.dueDate}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    ساعة الديدلاين:
                  </label>
                  <input
                    type="time"
                    required
                    value={createForm.dueTime}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, dueTime: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {isAr ? 'نشر الواجب للطلاب' : 'Publish Homework'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CONFIRM DELETE HOMEWORK MODAL ── */}
      {deleteHwDialog.isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '380px',
            padding: '22px',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              color: '#EF4444'
            }}>
              <AlertTriangle size={22} />
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px' }}>
              {isAr ? 'تأكيد حذف الواجب' : 'Confirm Delete Assignment'}
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: 1.5 }}>
              {isAr
                ? `هل أنت متأكد من رغبتك في حذف واجب "${deleteHwDialog.title}"؟ سيتم إزالته وحذف جميع تسليمات الطلاب المرتبطة به.`
                : `Are you sure you want to delete "${deleteHwDialog.title}"?`}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteHwDialog({ isOpen: false, id: null, title: '' })}
                style={{
                  padding: '9px',
                  borderRadius: '7px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteHomework}
                style={{
                  padding: '9px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                }}
              >
                {isAr ? 'نعم، حذف الواجب' : 'Delete Homework'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {previewAttachmentModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xl)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {previewAttachmentModal.type === 'pdf' ? <FileText size={18} color="#EF4444" /> : <ImageIcon size={18} color="var(--primary)" />}
                <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {previewAttachmentModal.name || 'معاينة الملف المرفق'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAttachmentModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '260px',
              backgroundColor: 'var(--bg-surface)'
            }}>
              {previewAttachmentModal.type === 'image' ? (
                previewAttachmentModal.url ? (
                  <img
                    src={previewAttachmentModal.url}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '68vh', objectFit: 'contain', borderRadius: '8px' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                    <ImageIcon size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                    <div>{isAr ? 'صورة توضيحية لملف تمرين الواجب' : 'Homework exercise image file'}</div>
                  </div>
                )
              ) : (
                previewAttachmentModal.url ? (
                  <iframe
                    src={previewAttachmentModal.url}
                    title="PDF Preview"
                    style={{ width: '100%', height: '68vh', border: 'none', borderRadius: '8px' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                    <FileText size={52} color="#EF4444" style={{ margin: '0 auto 12px' }} />
                    <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {previewAttachmentModal.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                      {isAr ? 'مستند PDF رسمي خاص بأسئلة ومسائل الواجب' : 'Official PDF homework sheet'}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '12px 18px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              backgroundColor: 'var(--bg-subtle)'
            }}>
              {previewAttachmentModal.url && (
                <button
                  type="button"
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = previewAttachmentModal.url;
                    a.download = previewAttachmentModal.name;
                    a.click();
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  <Download size={13} />
                  <span>{isAr ? 'تحميل' : 'Download'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setPreviewAttachmentModal(null)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherHomeworkView;
