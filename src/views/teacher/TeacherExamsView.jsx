import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { TEACHER_EXAMS } from '../../data/teacherData';
import { 
  ClipboardList, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Award, 
  HelpCircle, 
  FileText, 
  Eye, 
  X,
  Sparkles,
  TrendingUp,
  Download,
  Check,
  AlertCircle,
  FileCheck,
  ArrowRight,
  BookOpen,
  Search,
  Lock,
  Unlock,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Settings2,
  AlertTriangle,
  Edit3
} from 'lucide-react';

// Rich Mock Question Bank using exclusively platform tones
const INITIAL_EXAMS_DATABASE = [
  {
    ...TEACHER_EXAMS[0],
    id: 'ex-bio-101',
    titleAr: 'امتحان البناء الضوئي والتنفس الخلوي',
    titleEn: 'Photosynthesis & Cellular Respiration Exam',
    courseTitleAr: 'ماستر كلاس الأحياء (3 ثانوي)',
    questionsCount: 5,
    durationMinutes: 45,
    fullMark: 50,
    passScore: 30,
    avgScore: 42.5,
    passRate: 91.5,
    topScoreCount: 420,
    status: 'active', // 'active' (متاح للطلاب) | 'closed' (مغلق)
    dueDate: '2026-09-30',
    questions: [
      {
        id: 'q-101-1',
        number: 1,
        type: 'mcq',
        typeNameAr: 'اختيار من متعدد',
        questionAr: 'ما هو المانح المباشر لإلكترونات تعويض كلوروفيل (أ) في النظام الضوئي الثاني؟',
        optionsAr: ['الماء H2O', 'غاز ثاني أكسيد الكربون CO2', 'مركب NADPH', 'جزيء الجلوكوز C6H12O6'],
        correctIndex: 0,
        explanationAr: 'أثبتت تجارب روبن وهيل أن انشطار الماء ضوئياً هو المصدر المباشر لتعويض الإلكترونات وإطلاق الأكسجين.'
      },
      {
        id: 'q-101-2',
        number: 2,
        type: 'mcq',
        typeNameAr: 'اختيار من متعدد',
        questionAr: 'أي من المركبات التالية يمثل أول مركب كيميائي ثابت ناتج عن التفاعلات اللاضوئية في دورة كالفن؟',
        optionsAr: ['فوسفو جليسرالدهيد (PGAL)', 'حمض الستريك', 'فوسفو إينول بيروفات', 'حمض اللاكتيك'],
        correctIndex: 0,
        explanationAr: 'أثبت كالفن باستخدام نظير الكربون C-14 أن مركب PGAL ثلاثي الكربون يتكون بعد ثانيتين فقط كأول ناتج ثابت.'
      },
      {
        id: 'q-101-3',
        number: 3,
        type: 'true_false',
        typeNameAr: 'صح وخطأ',
        questionAr: 'تحدث دورة كريبس بالكامل داخل الغشاء الداخلي للميتوكوندريا دون الحاجة إلى تفاعلات تمهيدية.',
        correctBool: false,
        explanationAr: 'دورة كريبس تحدث داخل مادة الأساس للميتوكوندريا، وتتطلب مسبقاً انشطار الجلوكوز بالسيتوسول وأكسدة البيروفات.'
      },
      {
        id: 'q-101-4',
        number: 4,
        type: 'true_false',
        typeNameAr: 'صح وخطأ',
        questionAr: 'تنتج غالبية جزيئات ATP أثناء التنفس الهوائي عبر الفسفرة التأكسدية بسلسلة نقل الإلكترون.',
        correctBool: true,
        explanationAr: 'تنتج سلسلة نقل الإلكترون 34 جزيء ATP من أصل 38 جزيء ناتجة عن أكسدة جزيء جلوكوز واحد.'
      },
      {
        id: 'q-101-5',
        number: 5,
        type: 'essay',
        typeNameAr: 'مقالي',
        questionAr: 'علل: توقف التفاعلات اللاضوئية بعد فترة وجيزة من انعدام الضوء رغم أنها لا تحتاج للضوء مباشرة.',
        modelAnswerAr: 'تعتمد التفاعلات اللاضوئية اعتماداً كلياً على نواتج المرحلة الضوئية وهما ATP و NADPH. وبانقطاع الضوء ينفد مخزون الخلية منهما سريعاً، مما يعطل اختزال CO2 وبناء الكربوهيدرات.',
        rubricPointsAr: [
          'ذكر الاعتماد على نواتج التفاعلات الضوئية (درجة)',
          'تحديد مركبي ATP و NADPH ونفادهما في الظلام (درجة)',
          'توضيح توقف اختزال ثاني أكسيد الكربون (درجة)'
        ],
        explanationAr: 'سؤال ربط تكاملي يقيس الفهم لمسارات الطاقة التثبيتية بين شطري البناء الضوئي.'
      }
    ]
  },
  {
    ...TEACHER_EXAMS[1],
    id: 'ex-bio-102',
    titleAr: 'كويز سريع: التفاعلات الضوئية وأغشية الثيلاكويد',
    titleEn: 'Quick Quiz: Light Reactions & Thylakoids',
    courseTitleAr: 'ماستر كلاس الأحياء (3 ثانوي)',
    questionsCount: 3,
    durationMinutes: 15,
    fullMark: 20,
    passScore: 12,
    avgScore: 17.2,
    passRate: 96.2,
    topScoreCount: 780,
    status: 'active',
    dueDate: '2026-09-28',
    questions: [
      {
        id: 'q-102-1',
        number: 1,
        type: 'mcq',
        typeNameAr: 'اختيار من متعدد',
        questionAr: 'أين تتمركز أصباغ الكلوروفيل والأنظمة الضوئية المستقبلة للطاقة داخل البلاستيدة؟',
        optionsAr: ['أغشية الثيلاكويد بالجرانا', 'الستروما النخاعية', 'الغشاء الخارجي المزدوج', 'حبيبات النشا'],
        correctIndex: 0,
        explanationAr: 'تنتظم أصباغ الكلوروفيل في أقراص الجرانا لزيادة مساحة السطح المعرضة لامتصاص الضوء.'
      },
      {
        id: 'q-102-2',
        number: 2,
        type: 'true_false',
        typeNameAr: 'صح وخطأ',
        questionAr: 'يتم انشطار جزيء الماء بفعل الطاقة الضوئية الممتصة مباشرة في النظام الضوئي الأول.',
        correctBool: false,
        explanationAr: 'انشطار جزيء الماء يتم بجوار النظام الضوئي الثاني PS II لتعويض الإلكترونات المفقودة منه.'
      },
      {
        id: 'q-102-3',
        number: 3,
        type: 'essay',
        typeNameAr: 'مقالي',
        questionAr: 'وضح بإيجاز: أهمية تدرج تركيز أيونات الهيدروجين (البروتونات) عبر غشاء الثيلاكويد.',
        modelAnswerAr: 'تراكم البروتونات في تجويف الثيلاكويد يخلق تدرجاً كيميائياً، وعند اندفاعها عبر إنزيم بناء ATP نحو الستروما تنطلق طاقة تستخدم في ربط ADP بمجموعة فوسفات لتكوين ATP.',
        rubricPointsAr: [
          'توضيح تراكم البروتونات وتكوين التدرج (درجة)',
          'شرح دور إنزيم بناء ATP في الفسفرة الضوئية (درجة)'
        ],
        explanationAr: 'تطبيق مباشر على مبدأ الفسفرة الكيميائية التناضحية بالبلاستيدة.'
      }
    ]
  },
  {
    ...TEACHER_EXAMS[2],
    id: 'ex-bio-103',
    titleAr: 'امتحان المحاكاة الشامل: منهج الأحياء للثانوية العامة',
    titleEn: 'Comprehensive Thanawya Mock Exam',
    courseTitleAr: 'معسكر المراجعة النهائية ومصائد الامتحان',
    questionsCount: 4,
    durationMinutes: 90,
    fullMark: 60,
    passScore: 36,
    avgScore: 47.8,
    passRate: 85.0,
    topScoreCount: 210,
    status: 'closed',
    dueDate: '2026-10-05',
    questions: [
      {
        id: 'q-103-1',
        number: 1,
        type: 'mcq',
        typeNameAr: 'اختيار من متعدد',
        questionAr: 'كم عدد جزيئات ATP الناتجة عن أكسدة جزيء واحد من حمض البيروفيك هوائياً؟',
        optionsAr: ['15 جزيء ATP', '30 جزيء ATP', '12 جزيء ATP', '38 جزيء ATP'],
        correctIndex: 0,
        explanationAr: 'أكسدة بيروفيك واحد تنتج 1 NADH أكسدة تمهيدية (3 ATP) + دورة كريبس واحدة (12 ATP) = 15 ATP.'
      },
      {
        id: 'q-103-2',
        number: 2,
        type: 'true_false',
        typeNameAr: 'صح وخطأ',
        questionAr: 'يعمل مركب FAD كمستقبل للإلكترونات والهيدروجين في تفاعلات انشطار الجلوكوز بالسيتوسول.',
        correctBool: false,
        explanationAr: 'المستقبل الوحيد في انشطار الجلوكوز بالسيتوسول هو NAD+، بينما يقتصر عمل FAD على دورة كريبس.'
      },
      {
        id: 'q-103-3',
        number: 3,
        type: 'true_false',
        typeNameAr: 'صح وخطأ',
        questionAr: 'التخمر الكحولي والتخمر الحمضي كلاهما يحرران نفس الكمية الصافية من ATP الناتجة عن انشطار الجلوكوز.',
        correctBool: true,
        explanationAr: 'كلا المسارين ينتج عنهما صافي 2 ATP فقط لكل جزيء جلوكوز خلال مرحلة الانشطار.'
      },
      {
        id: 'q-103-4',
        number: 4,
        type: 'essay',
        typeNameAr: 'مقالي',
        questionAr: 'قارن بين التخمر الحمضي والتخمر الكحولي من حيث: الناتج النهائي ومصير غاز CO2.',
        modelAnswerAr: 'التخمر الحمضي: ينتج حمض اللاكتيك ولا يتصاعد غاز CO2. التخمر الكحولي: ينتج الكحول الإيثيلي مع تصاعد غاز ثاني أكسيد الكربون CO2.',
        rubricPointsAr: [
          'تحديد الناتج النهائي لكل تخمر بدقة (درجة)',
          'توضيح تصاعد CO2 في الكحولي وعدم تصاعده في الحمضي (درجة)'
        ],
        explanationAr: 'مقارنة أساسية متكررة في الامتحانات الوزارية للتمييز بين مسارات التنفس اللاهوائي.'
      }
    ]
  }
];

export const TeacherExamsView = () => {
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const isAr = lang === 'ar';

  // Navigation: 'list' (Main Cards View) | 'detail' (Dedicated Exam Page) | 'create' (Dedicated Wizard Page)
  const [viewMode, setViewMode] = useState('list');
  const [exams, setExams] = useState(INITIAL_EXAMS_DATABASE);
  const [selectedExamId, setSelectedExamId] = useState(INITIAL_EXAMS_DATABASE[0].id);

  // Search & Filter on Main List Page
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'closed'

  // Dedicated Detail Page Filters
  const [questionTypeFilter, setQuestionTypeFilter] = useState('all'); // 'all' | 'mcq' | 'true_false' | 'essay'
  const [showAnswerKey, setShowAnswerKey] = useState(true);

  // Dedicated Create Wizard Page State (Step 1 -> Step 2 -> Step 3)
  const [wizardStep, setWizardStep] = useState(1); // 1: Info, 2: Questions Builder
  const [formTitle, setFormTitle] = useState('');
  const [formCourse, setFormCourse] = useState('ماستر كلاس الأحياء (3 ثانوي)');
  const [formDuration, setFormDuration] = useState('45');
  const [formFullMark, setFormFullMark] = useState('50');
  const [formPassScore, setFormPassScore] = useState('30');
  const [formTargetCount, setFormTargetCount] = useState(3);

  // Step-by-Step Question Builder Buffer
  const [currentBuilderIndex, setCurrentBuilderIndex] = useState(0);
  const [builderQuestions, setBuilderQuestions] = useState([
    {
      number: 1,
      type: 'mcq',
      typeNameAr: 'اختيار من متعدد',
      questionAr: '',
      optionsAr: ['', '', '', ''],
      correctIndex: 0,
      correctBool: true,
      modelAnswerAr: '',
      rubricPointsAr: ['استيفاء الفكرة العلمية الأساسية (درجة)', 'الاستدلال والتفسير المنطقي (درجة)'],
      explanationAr: ''
    }
  ]);

  // Custom In-App Confirmation Dialog State (for deleting exams or questions)
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    type: null, // 'exam' | 'question'
    id: null,
    title: ''
  });

  // Question Inline Edit State (والامتحان يكون مغلق أقدر أعدل على الأسئلة)
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editBuffer, setEditBuffer] = useState({
    questionAr: '',
    type: 'mcq',
    optionsAr: ['', '', '', ''],
    correctIndex: 0,
    correctBool: true,
    modelAnswerAr: '',
    rubricPointsAr: [],
    explanationAr: ''
  });

  const handleStartEditQuestion = (q) => {
    setEditingQuestionId(q.id);
    setEditBuffer({
      questionAr: q.questionAr || '',
      type: q.type,
      optionsAr: q.optionsAr ? [...q.optionsAr] : ['', '', '', ''],
      correctIndex: q.correctIndex !== undefined ? q.correctIndex : 0,
      correctBool: q.correctBool !== undefined ? q.correctBool : true,
      modelAnswerAr: q.modelAnswerAr || '',
      rubricPointsAr: q.rubricPointsAr ? [...q.rubricPointsAr] : ['معيار التقييم الأول (درجة)', 'معيار التقييم الثاني (درجة)'],
      explanationAr: q.explanationAr || ''
    });
  };

  const handleSaveEditedQuestion = (qId) => {
    const updatedQuestions = selectedExam.questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          questionAr: editBuffer.questionAr.trim() || q.questionAr,
          optionsAr: q.type === 'mcq' ? editBuffer.optionsAr : q.optionsAr,
          correctIndex: editBuffer.correctIndex,
          correctBool: editBuffer.correctBool,
          modelAnswerAr: q.type === 'essay' ? editBuffer.modelAnswerAr : q.modelAnswerAr,
          rubricPointsAr: q.type === 'essay' ? editBuffer.rubricPointsAr : q.rubricPointsAr,
          explanationAr: editBuffer.explanationAr
        };
      }
      return q;
    });

    const updatedExam = {
      ...selectedExam,
      questions: updatedQuestions
    };

    setExams(prev => prev.map(ex => ex.id === selectedExam.id ? updatedExam : ex));
    setEditingQuestionId(null);
  };

  const selectedExam = exams.find(e => e.id === selectedExamId) || exams[0];

  // Filtered exams for main list
  const filteredExams = exams.filter(exam => {
    const matchesSearch = !searchQuery.trim() || 
      exam.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.courseTitleAr.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered questions for the dedicated exam view
  const displayedQuestions = selectedExam?.questions?.filter(q => {
    if (questionTypeFilter === 'all') return true;
    return q.type === questionTypeFilter;
  }) || [];

  // Toggle Exam Open / Closed status (1-click, concise)
  const handleToggleStatus = (examId, e) => {
    if (e) e.stopPropagation();
    setExams(prev => prev.map(exam => {
      if (exam.id === examId) {
        const nextStatus = exam.status === 'active' ? 'closed' : 'active';
        return { ...exam, status: nextStatus };
      }
      return exam;
    }));
  };

  // Open Exam Detail Page
  const handleOpenExamDetail = (examId) => {
    setSelectedExamId(examId);
    setQuestionTypeFilter('all');
    setShowAnswerKey(true);
    setViewMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Dedicated Create Wizard Page
  const handleOpenCreatePage = () => {
    setFormTitle('');
    setFormDuration('45');
    setFormFullMark('50');
    setFormPassScore('30');
    setFormTargetCount(3);
    setWizardStep(1);
    setBuilderQuestions([
      {
        number: 1,
        type: 'mcq',
        typeNameAr: 'اختيار من متعدد',
        questionAr: '',
        optionsAr: ['', '', '', ''],
        correctIndex: 0,
        correctBool: true,
        modelAnswerAr: '',
        rubricPointsAr: ['استيفاء الفكرة العلمية الأساسية (درجة)', 'الاستدلال والتفسير المنطقي (درجة)'],
        explanationAr: ''
      }
    ]);
    setCurrentBuilderIndex(0);
    setViewMode('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Request Delete Confirmation Dialog
  const promptDeleteExam = (examId, examTitle, e) => {
    if (e) e.stopPropagation();
    setDeleteDialog({
      isOpen: true,
      type: 'exam',
      id: examId,
      title: examTitle
    });
  };

  const promptDeleteQuestion = (questionId, questionNumber) => {
    setDeleteDialog({
      isOpen: true,
      type: 'question',
      id: questionId,
      title: `السؤال رقم (${questionNumber})`
    });
  };

  // Confirm Delete Action
  const handleConfirmDelete = () => {
    if (deleteDialog.type === 'exam') {
      const remaining = exams.filter(x => x.id !== deleteDialog.id);
      setExams(remaining);
      if (selectedExamId === deleteDialog.id && remaining.length > 0) {
        setSelectedExamId(remaining[0].id);
      }
      if (viewMode === 'detail' && selectedExamId === deleteDialog.id) {
        setViewMode('list');
      }
    } else if (deleteDialog.type === 'question' && selectedExam) {
      if (selectedExam.questions.length <= 1) {
        alert(isAr ? 'يجب أن يحتوي الاختبار على سؤال واحد على الأقل.' : 'Exam must contain at least one question.');
        setDeleteDialog({ isOpen: false, type: null, id: null, title: '' });
        return;
      }
      const filtered = selectedExam.questions
        .filter(q => q.id !== deleteDialog.id)
        .map((q, idx) => ({ ...q, number: idx + 1 }));

      const updatedExam = {
        ...selectedExam,
        questionsCount: filtered.length,
        questions: filtered
      };
      setExams(prev => prev.map(ex => ex.id === selectedExam.id ? updatedExam : ex));
    }
    setDeleteDialog({ isOpen: false, type: null, id: null, title: '' });
  };

  // Add a blank question directly into the exam (Top 3 buttons in detail page)
  const handleAddQuestionToExam = (type) => {
    if (!selectedExam) return;
    const currentQCount = selectedExam.questions.length;
    let newQ = null;

    if (type === 'mcq') {
      newQ = {
        id: `q-${Date.now()}`,
        number: currentQCount + 1,
        type: 'mcq',
        typeNameAr: 'اختيار من متعدد',
        questionAr: `سؤال اختيار من متعدد جديد رقم (${currentQCount + 1})`,
        optionsAr: ['الخيار الأول', 'الخيار الثاني', 'الخيار الثالث', 'الخيار الرابع'],
        correctIndex: 0,
        explanationAr: 'تفسير الإجابة النموذجية المعتمدة.'
      };
    } else if (type === 'true_false') {
      newQ = {
        id: `q-${Date.now()}`,
        number: currentQCount + 1,
        type: 'true_false',
        typeNameAr: 'صح وخطأ',
        questionAr: `عبارة صح وخطأ جديدة رقم (${currentQCount + 1})`,
        correctBool: true,
        explanationAr: 'العبارة صحيحة ومطابقة للمفاهيم المقررة.'
      };
    } else {
      newQ = {
        id: `q-${Date.now()}`,
        number: currentQCount + 1,
        type: 'essay',
        typeNameAr: 'مقالي',
        questionAr: `سؤال مقالي جديد رقم (${currentQCount + 1})`,
        modelAnswerAr: 'الإجابة النموذجية المعتمدة مع توضيح الفكرة العلمية.',
        rubricPointsAr: ['ذكر المفهوم العلمي الدقيق (درجة)', 'الاستدلال والتفسير (درجة)'],
        explanationAr: 'معايير التقييم وتوزيع الدرجات المعتمدة.'
      };
    }

    const updatedExam = {
      ...selectedExam,
      questionsCount: currentQCount + 1,
      questions: [...selectedExam.questions, newQ]
    };
    setExams(prev => prev.map(ex => ex.id === selectedExam.id ? updatedExam : ex));
  };

  // The Plus (+) Button on a question card: adds a blank question of the same type right below it
  const handleInsertBlankBelow = (referenceQuestion) => {
    if (!selectedExam) return;
    const newQ = {
      id: `q-blank-${Date.now()}`,
      number: selectedExam.questions.length + 1,
      type: referenceQuestion.type,
      typeNameAr: referenceQuestion.typeNameAr,
      questionAr: `سؤال جديد (${referenceQuestion.typeNameAr})`,
      optionsAr: referenceQuestion.type === 'mcq' ? ['خيار 1', 'خيار 2', 'خيار 3', 'خيار 4'] : undefined,
      correctIndex: 0,
      correctBool: true,
      modelAnswerAr: referenceQuestion.type === 'essay' ? 'اكتب الإجابة النموذجية هنا...' : undefined,
      rubricPointsAr: referenceQuestion.type === 'essay' ? ['معيار التقييم الأول (درجة)', 'معيار التقييم الثاني (درجة)'] : undefined,
      explanationAr: 'تفسير الإجابة النموذجية.'
    };

    const updatedExam = {
      ...selectedExam,
      questionsCount: selectedExam.questions.length + 1,
      questions: [...selectedExam.questions, newQ]
    };
    setExams(prev => prev.map(ex => ex.id === selectedExam.id ? updatedExam : ex));
  };

  // Finish Creation Wizard
  const handleFinishCreate = () => {
    const finalTitle = formTitle.trim() || (isAr ? 'اختبار تقييمي جديد' : 'New Assessment');
    const finalQuestions = builderQuestions.map((bq, idx) => ({
      ...bq,
      id: `q-new-${Date.now()}-${idx}`,
      number: idx + 1,
      questionAr: bq.questionAr.trim() || `سؤال رقم (${idx + 1})`,
      optionsAr: bq.type === 'mcq' ? bq.optionsAr.map((opt, oIdx) => opt.trim() || `الخيار ${oIdx + 1}`) : undefined
    }));

    const newExamObj = {
      id: `ex-${Date.now()}`,
      titleAr: finalTitle,
      titleEn: finalTitle,
      courseTitleAr: formCourse,
      questionsCount: finalQuestions.length,
      durationMinutes: Number(formDuration) || 45,
      fullMark: Number(formFullMark) || 50,
      passScore: Number(formPassScore) || 30,
      avgScore: 0,
      passRate: 100,
      topScoreCount: 0,
      status: 'active', // متاح للطلاب تلقائياً
      dueDate: '2026-10-15',
      questions: finalQuestions
    };

    setExams([newExamObj, ...exams]);
    setSelectedExamId(newExamObj.id);
    setViewMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step builder: Next Question
  const handleBuilderNextQuestion = () => {
    if (currentBuilderIndex < formTargetCount - 1) {
      if (!builderQuestions[currentBuilderIndex + 1]) {
        setBuilderQuestions([
          ...builderQuestions,
          {
            number: currentBuilderIndex + 2,
            type: 'mcq',
            typeNameAr: 'اختيار من متعدد',
            questionAr: '',
            optionsAr: ['', '', '', ''],
            correctIndex: 0,
            correctBool: true,
            modelAnswerAr: '',
            rubricPointsAr: ['استيفاء الفكرة العلمية الأساسية (درجة)', 'الاستدلال والتفسير المنطقي (درجة)'],
            explanationAr: ''
          }
        ]);
      }
      setCurrentBuilderIndex(currentBuilderIndex + 1);
    }
  };

  // Step builder: Prev Question
  const handleBuilderPrevQuestion = () => {
    if (currentBuilderIndex > 0) {
      setCurrentBuilderIndex(currentBuilderIndex - 1);
    }
  };

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '24px 20px 120px',
      fontFamily: 'var(--font-arabic)',
      boxSizing: 'border-box'
    }}>
      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 1: CLEAN MAIN EXAMS LIST (نفس ديزاين المنصة والمقررات، ألوان هادية)
          ══════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'list' && (
        <div>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}>
                  {isAr ? 'بنك الأسئلة والاختبارات' : 'Exam Management'}
                </span>
              </div>

              <h1 style={{
                fontSize: '21px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                margin: 0,
                fontFamily: 'var(--font-heading)'
              }}>
                {isAr ? 'إدارة الاختبارات والتقييمات' : 'Exam & Assessment Management'}
              </h1>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
                {isAr 
                  ? 'متابعة الامتحانات، التحكم في إتاحتها للطلاب، ونماذج الإجابة المعتمدة' 
                  : 'Manage exams, availability status, and verified answer keys'}
              </p>
            </div>

            <button
              onClick={handleOpenCreatePage}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Plus size={15} />
              <span>{isAr ? 'إنشاء اختبار جديد' : 'New Exam'}</span>
            </button>
          </div>

          {/* Calm Summary Strip (Platform Colors Only) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
            gap: '12px',
            marginBottom: '20px'
          }}>
            {[
              { labelAr: 'إجمالي الاختبارات', val: `${exams.length}`, sub: 'اختبارات منشورة', icon: ClipboardList },
              { labelAr: 'متاح للطلاب الآن', val: `${exams.filter(e => e.status === 'active').length}`, sub: 'يمكن للطلاب حلها', icon: Unlock },
              { labelAr: 'إجمالي إجابات الطلاب', val: '6,240', sub: 'تم تصحيحها', icon: CheckCircle2 },
              { labelAr: 'متوسط الدرجات العام', val: '86.4%', sub: 'مستوى استيعاب متقدم', icon: TrendingUp }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '14px 16px',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                      {stat.labelAr}
                    </span>
                    <Icon size={15} color="var(--primary)" />
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                    {stat.val}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {stat.sub}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clean Search & Status Filter Strip */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '10px 14px',
            marginBottom: '20px',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '7px',
              padding: '6px 12px',
              flex: 1,
              minWidth: '220px',
              maxWidth: '420px'
            }}>
              <Search size={14} color="var(--text-muted)" />
              <input
                type="text"
                placeholder={isAr ? 'بحث في أسماء الاختبارات...' : 'Search exams...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {[
                { id: 'all', labelAr: 'الكل', count: exams.length },
                { id: 'active', labelAr: 'متاح للطلاب', count: exams.filter(e => e.status === 'active').length },
                { id: 'closed', labelAr: 'مغلق', count: exams.filter(e => e.status === 'closed').length }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${statusFilter === f.id ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    backgroundColor: statusFilter === f.id ? 'var(--bg-subtle)' : 'transparent',
                    color: statusFilter === f.id ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: statusFilter === f.id ? '700' : '500',
                    cursor: 'pointer'
                  }}
                >
                  {f.labelAr} ({f.count})
                </button>
              ))}
            </div>
          </div>

          {/* ── EXAMS CARDS GRID (Clean, quiet, platform-styled) ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '16px'
          }}>
            {filteredExams.map(exam => {
              const isOpen = exam.status === 'active';

              return (
                <div
                  key={exam.id}
                  onClick={() => handleOpenExamDetail(exam.id)}
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xs)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <div>
                    {/* Header Tag + Concise Status Button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '10px' }}>
                      <span style={{
                        fontSize: '10.5px',
                        fontWeight: '700',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--bg-subtle)',
                        padding: '2px 7px',
                        borderRadius: '5px'
                      }}>
                        {exam.courseTitleAr}
                      </span>

                      {/* Concise Status Button */}
                      <button
                        onClick={(e) => handleToggleStatus(exam.id, e)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: `1px solid ${isOpen ? 'var(--primary)' : 'var(--border-subtle)'}`,
                          backgroundColor: isOpen ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                          color: isOpen ? 'var(--primary)' : 'var(--text-secondary)',
                          fontSize: '10.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {isOpen ? <Unlock size={11} /> : <Lock size={11} />}
                        <span>{isOpen ? (isAr ? 'متاح للطلاب' : 'Open') : (isAr ? 'مغلق' : 'Closed')}</span>
                      </button>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: '14.5px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      margin: '0 0 10px',
                      lineHeight: 1.4
                    }}>
                      {exam.titleAr}
                    </h3>

                    {/* Compact Specs Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '11.5px',
                      color: 'var(--text-secondary)',
                      padding: '8px 10px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: '6px',
                      marginBottom: '14px'
                    }}>
                      <span>{exam.questions.length} أسئلة</span>
                      <span>•</span>
                      <span>{exam.durationMinutes} دقيقة</span>
                      <span>•</span>
                      <span>{exam.fullMark} درجة</span>
                    </div>
                  </div>

                  {/* Card Action Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border-subtle)',
                    gap: '8px'
                  }}>
                    <button
                      onClick={() => handleOpenExamDetail(exam.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        border: 'none',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      {isAr ? 'عرض الأسئلة ونموذج الإجابة' : 'View Exam & Answers'}
                    </button>

                    <button
                      onClick={(e) => promptDeleteExam(exam.id, exam.titleAr, e)}
                      title={isAr ? 'حذف' : 'Delete'}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)',
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
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 2: DEDICATED FULL EXAM PAGE (كاردز ملمومة، ألوان هادية، علامة + واحدة)
          ══════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'detail' && selectedExam && (
        <div>
          {/* Top Bar: Back Button + Title + Status Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '7px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <ArrowRight size={14} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
                <span>{isAr ? 'الرجوع للاختبارات' : 'Back'}</span>
              </button>

              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-subtle)', padding: '3px 8px', borderRadius: '5px' }}>
                {selectedExam.courseTitleAr}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Concise Status Button */}
              <button
                onClick={(e) => handleToggleStatus(selectedExam.id, e)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '7px',
                  border: `1px solid ${selectedExam.status === 'active' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  backgroundColor: selectedExam.status === 'active' ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                  color: selectedExam.status === 'active' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {selectedExam.status === 'active' ? <Unlock size={12} /> : <Lock size={12} />}
                <span>{selectedExam.status === 'active' ? (isAr ? 'الامتحان متاح للطلاب' : 'Active') : (isAr ? 'الامتحان مغلق' : 'Closed')}</span>
              </button>

              {/* PDF Print Button */}
              <button
                onClick={() => window.print()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 10px',
                  borderRadius: '7px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Download size={13} />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Exam Specs Box (Compact) */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            boxShadow: 'var(--shadow-xs)',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {selectedExam.titleAr}
              </h2>

              <button
                onClick={() => setShowAnswerKey(!showAnswerKey)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: showAnswerKey ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                  color: showAnswerKey ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <Eye size={12} />
                <span>{showAnswerKey ? (isAr ? 'نموذج الإجابة ظاهر' : 'Answers Visible') : (isAr ? 'إظهار نموذج الإجابة' : 'Show Answers')}</span>
              </button>
            </div>

            <div style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '8px'
            }}>
              <span>الأسئلة: <strong style={{ color: 'var(--text-primary)' }}>{selectedExam.questions.length}</strong></span>
              <span>المدة: <strong style={{ color: 'var(--text-primary)' }}>{selectedExam.durationMinutes} دقيقة</strong></span>
              <span>الدرجة النهائية: <strong style={{ color: 'var(--primary)' }}>{selectedExam.fullMark}</strong></span>
              <span>درجة النجاح: <strong style={{ color: 'var(--text-primary)' }}>{selectedExam.passScore}</strong></span>
              <span>متوسط الدرجات: <strong style={{ color: 'var(--text-primary)' }}>{selectedExam.avgScore}</strong></span>
            </div>
          </div>

          {/* Closed Status Edit Banner (والامتحان يكون مغلق أقدر أعدل على الأسئلة) */}
          {selectedExam.status === 'closed' && (
            <div style={{
              backgroundColor: 'var(--primary-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '10px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              fontSize: '12px',
              color: 'var(--text-primary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={14} color="var(--primary)" />
                <span>
                  <strong>الامتحان مغلق أمام الطلاب:</strong> يمكنك تعديل نصوص الأسئلة والخيارات والإجابات النموذجية بحرية بالضغط على أيقونة التعديل (✎) بجانب أي سؤال.
                </span>
              </div>
            </div>
          )}

          {/* ── TOP ADD QUESTION BUTTONS (اختيار من متعدد • صح وخطأ • مقالي - بدون تكرار كلام) ── */}
          <div style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
              {isAr ? 'إضافة سؤال جديد:' : 'Add Question:'}
            </span>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* Button 1: MCQ */}
              <button
                onClick={() => handleAddQuestionToExam('mcq')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <Plus size={12} color="var(--primary)" />
                <span>اختيار من متعدد</span>
              </button>

              {/* Button 2: True / False */}
              <button
                onClick={() => handleAddQuestionToExam('true_false')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <Plus size={12} color="var(--primary)" />
                <span>صح وخطأ</span>
              </button>

              {/* Button 3: Essay */}
              <button
                onClick={() => handleAddQuestionToExam('essay')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <Plus size={12} color="var(--primary)" />
                <span>مقالي</span>
              </button>
            </div>
          </div>

          {/* Questions Filter Strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: '12px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {isAr ? `الأسئلة (${selectedExam.questions.length})` : `Questions (${selectedExam.questions.length})`}
            </span>

            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'all', label: 'الكل' },
                { id: 'mcq', label: 'اختيار من متعدد' },
                { id: 'true_false', label: 'صح وخطأ' },
                { id: 'essay', label: 'مقالي' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setQuestionTypeFilter(f.id)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '5px',
                    border: `1px solid ${questionTypeFilter === f.id ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    backgroundColor: questionTypeFilter === f.id ? 'var(--bg-subtle)' : 'transparent',
                    color: questionTypeFilter === f.id ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: questionTypeFilter === f.id ? '700' : '500',
                    cursor: 'pointer'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── COMPACT QUESTIONS LIST (ملمومة، هادية، تحت بعضها) ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayedQuestions.map((q) => {
              return (
                <div
                  key={q.id}
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '14px 16px',
                    boxShadow: 'var(--shadow-xs)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  {/* Question Header: Number + Type + Actions (+ and Trash) */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        color: 'var(--primary)',
                        backgroundColor: 'var(--bg-subtle)',
                        padding: '2px 7px',
                        borderRadius: '5px'
                      }}>
                        سؤال {q.number}
                      </span>

                      <span style={{
                        fontSize: '10.5px',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--bg-subtle)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {q.typeNameAr}
                      </span>
                    </div>

                    {/* Actions: Edit (✎), Plus (+), and Trash */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        onClick={() => {
                          if (editingQuestionId === q.id) {
                            setEditingQuestionId(null);
                          } else {
                            handleStartEditQuestion(q);
                          }
                        }}
                        title={isAr ? 'تعديل السؤال والخيارات والإجابة' : 'Edit Question'}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          backgroundColor: editingQuestionId === q.id ? 'var(--primary)' : 'var(--bg-subtle)',
                          border: '1px solid var(--border-subtle)',
                          color: editingQuestionId === q.id ? '#FFFFFF' : 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit3 size={13} />
                      </button>

                      <button
                        onClick={() => handleInsertBlankBelow(q)}
                        title={isAr ? 'إضافة سكشن سؤال جديد' : 'Add Question'}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--bg-subtle)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Plus size={14} />
                      </button>

                      <button
                        onClick={() => promptDeleteQuestion(q.id, q.number)}
                        title={isAr ? 'حذف السؤال' : 'Delete'}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--bg-subtle)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* ── QUESTION CARD CONTENT: EDIT MODE vs DISPLAY MODE ── */}
                  {editingQuestionId === q.id ? (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '12px',
                      borderRadius: '7px',
                      border: '1.5px solid var(--primary)',
                      marginTop: '4px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--primary)' }}>
                          تعديل {q.typeNameAr}:
                        </span>
                        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                          قم بتعديل النص والإجابة المعتمدة ثم اضغط حفظ
                        </span>
                      </div>

                      {/* Question Textarea */}
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                          نص السؤال:
                        </label>
                        <textarea
                          rows={2}
                          value={editBuffer.questionAr}
                          onChange={(e) => setEditBuffer({ ...editBuffer, questionAr: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-surface-elevated)',
                            color: 'var(--text-primary)',
                            fontSize: '12.5px',
                            outline: 'none',
                            resize: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      {/* MCQ Options Edit */}
                      {q.type === 'mcq' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                            الخيارات الأربعة (حدد الإجابة الصحيحة بالدائرة):
                          </label>
                          {editBuffer.optionsAr.map((opt, oIdx) => {
                            const isCorrect = editBuffer.correctIndex === oIdx;
                            return (
                              <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <input
                                  type="radio"
                                  name={`edit-opt-${q.id}`}
                                  checked={isCorrect}
                                  onChange={() => setEditBuffer({ ...editBuffer, correctIndex: oIdx })}
                                  style={{ cursor: 'pointer' }}
                                />
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const newOpts = [...editBuffer.optionsAr];
                                    newOpts[oIdx] = e.target.value;
                                    setEditBuffer({ ...editBuffer, optionsAr: newOpts });
                                  }}
                                  style={{
                                    flex: 1,
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    border: `1px solid ${isCorrect ? 'var(--primary)' : 'var(--border-subtle)'}`,
                                    backgroundColor: isCorrect ? 'var(--primary-surface)' : 'var(--bg-surface-elevated)',
                                    color: 'var(--text-primary)',
                                    fontSize: '12px',
                                    outline: 'none'
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* True / False Option Edit */}
                      {q.type === 'true_false' && (
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                            الإجابة الصحيحة:
                          </label>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {[true, false].map((bVal) => {
                              const isSelected = editBuffer.correctBool === bVal;
                              return (
                                <button
                                  key={String(bVal)}
                                  type="button"
                                  onClick={() => setEditBuffer({ ...editBuffer, correctBool: bVal })}
                                  style={{
                                    flex: 1,
                                    padding: '7px',
                                    borderRadius: '6px',
                                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                                    backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-surface-elevated)',
                                    color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                                    fontWeight: '700',
                                    fontSize: '11.5px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {bVal ? 'صح' : 'خطأ'}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Essay Model Answer Edit */}
                      {q.type === 'essay' && (
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                            الإجابة النموذجية المعتمدة:
                          </label>
                          <textarea
                            rows={2}
                            value={editBuffer.modelAnswerAr}
                            onChange={(e) => setEditBuffer({ ...editBuffer, modelAnswerAr: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-surface-elevated)',
                              color: 'var(--text-primary)',
                              fontSize: '12px',
                              outline: 'none',
                              resize: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      )}

                      {/* Explanation Edit */}
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                          التفسير والتعليل:
                        </label>
                        <input
                          type="text"
                          value={editBuffer.explanationAr}
                          onChange={(e) => setEditBuffer({ ...editBuffer, explanationAr: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-surface-elevated)',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      {/* Edit Actions: Cancel & Save */}
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                        <button
                          type="button"
                          onClick={() => setEditingQuestionId(null)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-surface-elevated)',
                            color: 'var(--text-secondary)',
                            fontSize: '11.5px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          إلغاء
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSaveEditedQuestion(q.id)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: 'var(--primary)',
                            color: '#FFFFFF',
                            fontSize: '11.5px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          حفظ التعديل
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Normal Display Mode */}
                      <div style={{
                        fontSize: '13.5px',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        lineHeight: 1.45
                      }}>
                        {q.questionAr}
                      </div>

                      {/* 1. MCQ Options */}
                      {q.type === 'mcq' && q.optionsAr && (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                          gap: '6px'
                        }}>
                          {q.optionsAr.map((opt, optIdx) => {
                            const isCorrect = showAnswerKey && optIdx === q.correctIndex;
                            return (
                              <div
                                key={optIdx}
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: '7px',
                                  backgroundColor: isCorrect ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                                  color: isCorrect ? 'var(--primary)' : 'var(--text-secondary)',
                                  border: isCorrect ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                                  fontWeight: isCorrect ? '700' : '500',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between'
                                }}
                              >
                                <span>{String.fromCharCode(65 + optIdx)}) {opt}</span>
                                {isCorrect && (
                                  <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--primary)' }}>
                                    الإجابة الصحيحة ✓
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* 2. True / False Options */}
                      {q.type === 'true_false' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {[
                            { bool: true, label: 'صح' },
                            { bool: false, label: 'خطأ' }
                          ].map((item, idx) => {
                            const isCorrect = showAnswerKey && item.bool === q.correctBool;
                            return (
                              <div
                                key={idx}
                                style={{
                                  flex: 1,
                                  padding: '8px 12px',
                                  borderRadius: '7px',
                                  backgroundColor: isCorrect ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                                  color: isCorrect ? 'var(--primary)' : 'var(--text-secondary)',
                                  border: isCorrect ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                                  fontSize: '12px',
                                  fontWeight: isCorrect ? '700' : '500',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between'
                                }}
                              >
                                <span>{item.label}</span>
                                {isCorrect && <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--primary)' }}>الإجابة الصحيحة ✓</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* 3. Essay Model Answer */}
                      {q.type === 'essay' && showAnswerKey && (
                        <div style={{
                          backgroundColor: 'var(--bg-subtle)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '7px',
                          padding: '10px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--primary)' }}>
                            الإجابة النموذجية المعتمدة:
                          </span>
                          <div style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                            {q.modelAnswerAr}
                          </div>

                          {q.rubricPointsAr && (
                            <div style={{ borderTop: '1px dashed var(--border-subtle)', paddingTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>توزيع الدرجات:</span>
                              {q.rubricPointsAr.map((r, ri) => (
                                <div key={ri} style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                  • {r}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Concise Scientific Explanation */}
                      {showAnswerKey && q.explanationAr && (
                        <div style={{
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          backgroundColor: 'var(--bg-subtle)',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)'
                        }}>
                          <strong style={{ color: 'var(--text-primary)' }}>التفسير: </strong>
                          {q.explanationAr}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 3: DEDICATED FULL-PAGE EXAM CREATION (STEPS WITH FREE BACK-AND-FORTH)
          (يدخلني على صفحة تانية، steps كدة، وأقدر أرجع أعدل أي حاجة)
          ══════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'create' && (
        <div style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-xs)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <ArrowRight size={13} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
                <span>إلغاء والرجوع</span>
              </button>
              <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {isAr ? 'إنشاء اختبار جديد' : 'Create New Exam'}
              </h2>
            </div>

            {/* Steps Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setWizardStep(1)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${wizardStep === 1 ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  backgroundColor: wizardStep === 1 ? 'var(--primary-surface)' : 'transparent',
                  color: wizardStep === 1 ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                1. البيانات الأساسية
              </button>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>←</span>
              <button
                type="button"
                onClick={() => setWizardStep(2)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${wizardStep === 2 ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  backgroundColor: wizardStep === 2 ? 'var(--primary-surface)' : 'transparent',
                  color: wizardStep === 2 ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                2. بناء الأسئلة ({builderQuestions.length})
              </button>
            </div>
          </div>

          {/* ── STEP 1: BASIC DATA (CAN RETURN TO THIS ANYTIME!) ── */}
          {wizardStep === 1 && (
            <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  {isAr ? 'عنوان الاختبار' : 'Exam Title'}
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: امتحان الباب الأول' : 'Exam title'}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '7px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    {isAr ? 'المقرر' : 'Course'}
                  </label>
                  <select
                    value={formCourse}
                    onChange={(e) => setFormCourse(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px',
                      borderRadius: '7px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  >
                    <option value="ماستر كلاس الأحياء (3 ثانوي)">ماستر كلاس الأحياء (3 ثانوي)</option>
                    <option value="معسكر المراجعة النهائية ومصائد الامتحان">معسكر المراجعة النهائية ومصائد الامتحان</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    {isAr ? 'المدة (دقيقة)' : 'Duration (mins)'}
                  </label>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '7px',
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    {isAr ? 'الدرجة النهائية' : 'Full Mark'}
                  </label>
                  <input
                    type="number"
                    value={formFullMark}
                    onChange={(e) => setFormFullMark(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '7px',
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    {isAr ? 'عدد الأسئلة المطلوب' : 'Questions Target'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={formTargetCount}
                    onChange={(e) => setFormTargetCount(Number(e.target.value) || 1)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '7px',
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

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '7px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {isAr ? 'المتابعة إلى كتابة الأسئلة ←' : 'Proceed to Questions'}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: STEP-BY-STEP QUESTION BUILDER ── */}
          {wizardStep === 2 && (
            <div style={{ maxWidth: '720px' }}>
              {/* Back to Step 1 shortcut */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: 'none',
                    background: 'none',
                    color: 'var(--primary)',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <ArrowRight size={13} style={{ transform: isRtl ? 'none' : 'rotate(180deg)' }} />
                  <span>الرجوع لتعديل البيانات الأساسية (الاسم أو العدد)</span>
                </button>

                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  سؤال {currentBuilderIndex + 1} من {formTargetCount}
                </span>
              </div>

              {/* Type Switcher */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                {[
                  { id: 'mcq', label: 'اختيار من متعدد' },
                  { id: 'true_false', label: 'صح وخطأ' },
                  { id: 'essay', label: 'مقالي' }
                ].map(t => {
                  const currentQ = builderQuestions[currentBuilderIndex] || {};
                  const isCurrent = currentQ.type === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        const updated = [...builderQuestions];
                        updated[currentBuilderIndex] = {
                          ...updated[currentBuilderIndex],
                          type: t.id,
                          typeNameAr: t.label
                        };
                        setBuilderQuestions(updated);
                      }}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        border: `1px solid ${isCurrent ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        backgroundColor: isCurrent ? 'var(--primary)' : 'var(--bg-subtle)',
                        color: isCurrent ? '#FFFFFF' : 'var(--text-secondary)',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Question Text */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  نص السؤال:
                </label>
                <textarea
                  rows={2}
                  placeholder={isAr ? 'اكتب نص السؤال هنا...' : 'Question text...'}
                  value={builderQuestions[currentBuilderIndex]?.questionAr || ''}
                  onChange={(e) => {
                    const updated = [...builderQuestions];
                    updated[currentBuilderIndex] = { ...updated[currentBuilderIndex], questionAr: e.target.value };
                    setBuilderQuestions(updated);
                  }}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '7px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* MCQ Options */}
              {builderQuestions[currentBuilderIndex]?.type === 'mcq' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  <label style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                    الخيارات الأربعة (حدد الإجابة الصحيحة):
                  </label>
                  {[0, 1, 2, 3].map((optIdx) => {
                    const isCorrect = builderQuestions[currentBuilderIndex]?.correctIndex === optIdx;
                    return (
                      <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="radio"
                          name={`builder-correct-${currentBuilderIndex}`}
                          checked={isCorrect}
                          onChange={() => {
                            const updated = [...builderQuestions];
                            updated[currentBuilderIndex] = { ...updated[currentBuilderIndex], correctIndex: optIdx };
                            setBuilderQuestions(updated);
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                        <input
                          type="text"
                          placeholder={`الخيار ${optIdx + 1}`}
                          value={builderQuestions[currentBuilderIndex]?.optionsAr?.[optIdx] || ''}
                          onChange={(e) => {
                            const updated = [...builderQuestions];
                            const newOpts = [...(updated[currentBuilderIndex]?.optionsAr || ['', '', '', ''])];
                            newOpts[optIdx] = e.target.value;
                            updated[currentBuilderIndex] = { ...updated[currentBuilderIndex], optionsAr: newOpts };
                            setBuilderQuestions(updated);
                          }}
                          style={{
                            flex: 1,
                            padding: '7px 10px',
                            borderRadius: '6px',
                            border: `1px solid ${isCorrect ? 'var(--primary)' : 'var(--border-subtle)'}`,
                            backgroundColor: isCorrect ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* True / False Options */}
              {builderQuestions[currentBuilderIndex]?.type === 'true_false' && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    الإجابة الصحيحة:
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[true, false].map((boolVal) => {
                      const isSelected = builderQuestions[currentBuilderIndex]?.correctBool === boolVal;
                      return (
                        <button
                          key={String(boolVal)}
                          type="button"
                          onClick={() => {
                            const updated = [...builderQuestions];
                            updated[currentBuilderIndex] = { ...updated[currentBuilderIndex], correctBool: boolVal };
                            setBuilderQuestions(updated);
                          }}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '6px',
                            border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                            backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                            color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                            fontWeight: '700',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          {boolVal ? 'صح' : 'خطأ'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Essay Model Answer */}
              {builderQuestions[currentBuilderIndex]?.type === 'essay' && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    الإجابة النموذجية المعتمدة:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="اكتب الإجابة النموذجية ومعايير التقييم..."
                    value={builderQuestions[currentBuilderIndex]?.modelAnswerAr || ''}
                    onChange={(e) => {
                      const updated = [...builderQuestions];
                      updated[currentBuilderIndex] = { ...updated[currentBuilderIndex], modelAnswerAr: e.target.value };
                      setBuilderQuestions(updated);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              {/* Navigation Toolbar (السابق • التالي • إنهاء ونشر) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <button
                  type="button"
                  onClick={handleBuilderPrevQuestion}
                  disabled={currentBuilderIndex === 0}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: currentBuilderIndex === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: currentBuilderIndex === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  السابق
                </button>

                {currentBuilderIndex < formTargetCount - 1 ? (
                  <button
                    type="button"
                    onClick={handleBuilderNextQuestion}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    السؤال التالي ←
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishCreate}
                    style={{
                      padding: '7px 18px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    إنهاء ونشر الاختبار الآن
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          CUSTOM IN-APP CONFIRMATION DIALOG (دايلوج التأكيد عند الحذف)
          ══════════════════════════════════════════════════════════════════════ */}
      {deleteDialog.isOpen && (
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
            padding: '20px',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              color: 'var(--primary)'
            }}>
              <AlertTriangle size={20} />
            </div>

            <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
              {isAr ? 'تأكيد الحذف' : 'Confirm Delete'}
            </h3>

            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 18px', lineHeight: 1.5 }}>
              {isAr
                ? `هل أنت متأكد من حذف "${deleteDialog.title}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete "${deleteDialog.title}"?`}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setDeleteDialog({ isOpen: false, type: null, id: null, title: '' })}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {isAr ? 'نعم، حذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherExamsView;
