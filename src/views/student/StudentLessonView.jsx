import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Play, Pause, RotateCcw, FastForward, Volume2, VolumeX,
  FileText, Download, Bookmark, BookmarkCheck, CheckCircle2, Circle,
  ArrowRight, ArrowLeft, Sparkles, HelpCircle, Clock, BookOpen,
  Headphones, Video, ChevronDown, X, Maximize2, Minimize2,
  Send, Trash2, Check, Award, Star, Map, ChevronRight,
  Zap, Target, Brain, Lock, Unlock, ExternalLink, CheckSquare, Square,
  AlertCircle, ChevronLeft, Calendar, Folder, AlignLeft, Search,
  RotateCw, Share2, Network, GitBranch, Layers
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   World-Class Student Lesson Study Workspace
   Features:
   1. Clean 5 Header Tabs (Exact Match to Reference Image):
      - ملاحظات الدرس
      - نص الحصة
      - خريطة الحصة (مع خريطة البطاقات + الرسم البياني الشبكي Interactive Graph)
      - الملفات
      - الأسئلة
   2. "درس اليوم" Card with circular donut progress (Image 2)
   3. "محتوى الدورة" with explicit percentage (Image 2)
   4. Universal Confirmation Modals for all buttons on page
   5. Landscape / horizontal playback for mobile
   6. Premium animations & micro-interactions
   ═══════════════════════════════════════════════════════════ */

export const StudentLessonView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { lang, isRtl } = useLanguage();
  const { isDark } = useTheme();

  // ─── Refs ─────────────────────────────────────────────────
  const playerRef = useRef(null);
  const kmRef = useRef(null);

  // ─── Course Info ──────────────────────────────────────────
  const courseInfo = {
    titleAr: 'ماستر كلاس الأحياء: البناء الضوئي وحركية الخلية والوراثة',
    subjectAr: 'الأحياء',
    gradeAr: 'الصف الثالث الثانوي',
    teacherAr: 'د. سلمى السيد',
    teacherImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    summaryPdf: 'ملخص_البناء_الضوئي_الشامل.pdf'
  };

  // ─── Lessons Database for Playlist ────────────────────────
  const lessonsDatabase = {
    l1: {
      id: 'l1',
      titleAr: 'مقدمة البناء الضوئي وتركيب البلاستيدة الخضراء',
      descAr: 'دراسة تشريح البلاستيدة الخضراء، أغشية الثيلاكويد، والستروما، وأهمية صبغة الكلوروفيل أ وب في امتصاص الطيف الضوئي.',
      durationSec: 1500,
      durationFmt: '25:00',
      time: '25 دقيقة',
      videoUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1400&auto=format&fit=crop&q=80',
      completed: true,
      chapters: [
        { id: 1, titleAr: 'تركيب البلاستيدة وأقراص الجرانا', startSec: 0, endSec: 450, keyTerms: ['جرانا', 'ستروما', 'ثيلاكويد'], descAr: 'البنية الدقيقة للبلاستيدة وخصائص الغشاء المزدوج.' },
        { id: 2, titleAr: 'أصباغ التمثيل الضوئي ومطياف الامتصاص', startSec: 450, endSec: 950, keyTerms: ['كلوروفيل أ', 'كلوروفيل ب', 'زانثوفيل'], descAr: 'طيف امتصاص الضوء الأزرق والأحمر وعلاقة الكاروتين بحماية الأصباغ.' },
        { id: 3, titleAr: 'المقارنة بين كفاءة الأصباغ الأساسية والإضافية', startSec: 950, endSec: 1500, keyTerms: ['مطياف', 'امتصاص ضوئي'], descAr: 'تحليل المنحنيات البيانية لامتصاص الضوء وكفاءة التمثيل.' }
      ]
    },
    l2: {
      id: 'l2',
      titleAr: 'الأصباغ النباتية ومطياف الامتصاص والطاقة الضوئية',
      descAr: 'تحليل امتصاص الفوتونات الضوئية بواسطة الإلكترونات في ذرة المغنيسيوم الموجودة بمركز جزيء الكلوروفيل أ.',
      durationSec: 1800,
      durationFmt: '30:00',
      time: '30 دقيقة',
      videoUrl: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=1400&auto=format&fit=crop&q=80',
      completed: true,
      chapters: [
        { id: 1, titleAr: 'ذرة المغنيسيوم في الكلوروفيل ونظرية الاستثارة', startSec: 0, endSec: 600, keyTerms: ['مغنيسيوم', 'فوتون', 'إثارة إلكترونية'], descAr: 'دور ذرة المغنيسيوم المركزية في حبس الطاقة الضوئية.' },
        { id: 2, titleAr: 'الأنظمة الضوئية PSI و PSII', startSec: 600, endSec: 1200, keyTerms: ['نظام ضوئي 1', 'نظام ضوئي 2', 'P680', 'P700'], descAr: 'مجمع اصطياد الضوء ومسار الإلكترونات النشطة.' },
        { id: 3, titleAr: 'تحويل الطاقة الضوئية إلى طاقة وضع كيميائية', startSec: 1200, endSec: 1800, keyTerms: ['طاقة وضع', 'كيميائية'], descAr: 'كيف تختزن البلاستيدة الطاقة في صورة روابط جزيئية أولية.' }
      ]
    },
    l3: {
      id: 'l3',
      titleAr: 'Lecture 3: البناء الضوئي وحركية الطاقة في الخلايا النباتية',
      descAr: 'Feature maps, photosynthesis architecture, Van Niel isotope experiment, Z-scheme electron transport, and Calvin cycle synthesis.',
      durationSec: 2100,
      durationFmt: '35:00',
      time: '35 دقيقة',
      videoUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1400&auto=format&fit=crop&q=80',
      completed: false,
      chapters: [
        { id: 1, titleAr: 'مقدمة التفاعلات الضوئية وامتصاص الكلوروفيل', startSec: 0, endSec: 480, keyTerms: ['كلوروفيل', 'ثيلاكويد', 'نظام ضوئي'], descAr: 'تعرف على البنية الدقيقة للبلاستيدة الخضراء ودور صبغة الكلوروفيل في امتصاص الطاقة الضوئية وتحويلها إلى طاقة كيميائية مستثارة.' },
        { id: 2, titleAr: 'انشطار الماء وتجربة فان نيل بالأكسجين المشع (O18)', startSec: 480, endSec: 1020, keyTerms: ['O18', 'فان نيل', 'انشطار ضوئي', 'بكتيريا الكبريت'], descAr: 'إثبات تجريبي بالبراهين المعملية أن الأكسجين المتصاعد مصدره جزيئات الماء وليس ثاني أكسيد الكربون عبر نظائر الأكسجين المشعة.' },
        { id: 3, titleAr: 'تكوين NADPH2 والفسفرة الضوئية لإنتاج ATP', startSec: 1020, endSec: 1560, keyTerms: ['NADPH2', 'ATP', 'فسفرة ضوئية', 'سلسلة الإلكترون'], descAr: 'آلية تكوين مركبات الطاقة التثبيتية عبر انحدار الإلكترونات وضخ البروتونات عبر إنزيم بناء ATP Synthase.' },
        { id: 4, titleAr: 'التفاعلات اللاضوئية ودورة كالفن وتكوين PGAL', startSec: 1560, endSec: 2100, keyTerms: ['كالفن', 'PGAL', 'ستروما', 'تثبيت CO2'], descAr: 'تثبيت غاز ثاني أكسيد الكربون في ستروما البلاستيدة وتخليق أول مركب كيميائي عضوي ثابت فوسفوجليسرالدهيد (PGAL) بعد ثانيتين فقط.' }
      ]
    },
    l4: {
      id: 'l4',
      titleAr: 'Lecture 4: التنفس الخلوي وانشطار الجلوكوز في السيتوسول',
      descAr: 'مراحل تحلل الجلوكوز، إنتاج حمض البيروفيك، وحساب صافي مركبات ATP و NADH قبل دخول الميتوكوندريا.',
      durationSec: 2400,
      durationFmt: '40:00',
      time: '40 دقيقة',
      videoUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=1400&auto=format&fit=crop&q=80',
      completed: false,
      chapters: [
        { id: 1, titleAr: 'تنشيط الجلوكوز واستهلاك جزيئي ATP', startSec: 0, endSec: 700, keyTerms: ['جلوكوز 6 فوسفات', 'فركتوز 1-6 ثنائي الفوسفات'], descAr: 'خطوات استثمار الطاقة الأولية لتحويل السكر السداسي.' },
        { id: 2, titleAr: 'انشطار الجزيء إلى مركبين PGAL', startSec: 700, endSec: 1500, keyTerms: ['انشطار', 'PGAL'], descAr: 'أكسدة السكر الثلاثي واختزال مرافقات الإنزيم NAD+.' },
        { id: 3, titleAr: 'إنتاج حمض البيروفيك وصافي الطاقة (2 ATP + 2 NADH)', startSec: 1500, endSec: 2400, keyTerms: ['بيروفيك', 'صافي ATP'], descAr: 'حساب الحصيلة النهائية من التحلل السكري في السيتوسول.' }
      ]
    },
    l5: {
      id: 'l5',
      titleAr: 'Lecture 5: دورة كريبس وسلسلة نقل الإلكترون التنافسية',
      descAr: 'أكسدة أستيل كو-أ، دورات حمض الستريك، والأكسدة الفسفورية لإنتاج 38 جزيء ATP لكل جزيء جلوكوز.',
      durationSec: 2700,
      durationFmt: '45:00',
      time: '45 دقيقة',
      videoUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1400&auto=format&fit=crop&q=80',
      completed: false,
      chapters: [
        { id: 1, titleAr: 'تحول البيروفيك إلى أستيل كوانزيم أ', startSec: 0, endSec: 800, keyTerms: ['أستيل كو-أ', 'نزع كربون'], descAr: 'دخول نواتج التحلل إلى حشوة الميتوكوندريا.' },
        { id: 2, titleAr: 'تفاعلات دورة كريبس والتعاقب الإنزيمي', startSec: 800, endSec: 1800, keyTerms: ['حمض الستريك', 'FADH2', 'NADH'], descAr: 'دورتان متتاليتان لكل جزيء جلوكوز وتكوين مركبات الطاقة.' },
        { id: 3, titleAr: 'السيتوكرومات وتكوين الماء وحساب 38 ATP', startSec: 1800, endSec: 2700, keyTerms: ['سيتوكرومات', 'أكسجين مستقبل أخير'], descAr: 'دور الأكسجين كمستقبل أخير للإلكترونات والبروتونات.' }
      ]
    },
    l6: {
      id: 'l6',
      titleAr: 'Lecture 6: التخمر اللاهوائي والتطبيقات الحيوية المعاصرة',
      descAr: 'التخمر الحمضي في العضلات والتخمر الكحولي في فطر الخميرة، وأضرار الإجهاد العضلي وتراكم حمض اللاكتيك.',
      durationSec: 1680,
      durationFmt: '28:00',
      time: '28 دقيقة',
      videoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400&auto=format&fit=crop&q=80',
      completed: false,
      chapters: [
        { id: 1, titleAr: 'ميكانيكية التخمر عند غياب الأكسجين', startSec: 0, endSec: 500, keyTerms: ['غياب O2', 'تخمر'], descAr: 'إعادة تدوير مرافق الإنزيم NAD+ لضمان استمرار إنتاج 2 ATP.' },
        { id: 2, titleAr: 'التخمر الحمضي وحمض اللاكتيك في الخلايا العضلية', startSec: 500, endSec: 1100, keyTerms: ['لاكتيك', 'شد عضلي'], descAr: 'أسباب الإجهاد العضلي ومعادلة الاختزال.' },
        { id: 3, titleAr: 'التخمر الكحولي والصناعات الدوائية والغذائية', startSec: 1100, endSec: 1680, keyTerms: ['كحول إيثيلي', 'خميرة', 'CO2'], descAr: 'تطبيقات التخمر في المخابز وتصنيع المواد الحيوية.' }
      ]
    }
  };

  // ─── Active Lesson State ──────────────────────────────────
  const [activeLessonId, setActiveLessonId] = useState('l3');
  const [lessonStatuses, setLessonStatuses] = useState(() => {
    const saved = localStorage.getItem('mtfq_lesson_statuses');
    return saved ? JSON.parse(saved) : { l1: true, l2: true, l3: false, l4: false, l5: false, l6: false };
  });

  const lesson = lessonsDatabase[activeLessonId] || lessonsDatabase.l3;

  // Mobile drawer state
  const [mobilePlaylistOpen, setMobilePlaylistOpen] = useState(false);

  // ─── Media State ──────────────────────────────────────────
  const [mediaMode, setMediaMode] = useState('video'); // 'video' | 'audio'
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => {
    const s = localStorage.getItem(`mtfq_pos_${activeLessonId}`);
    return s ? parseInt(s, 10) : 480;
  });
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayerFS, setIsPlayerFS] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  // Statuses
  const isCompleted = !!lessonStatuses[activeLessonId];
  const [isBookmarked, setIsBookmarked] = useState(() =>
    localStorage.getItem(`mtfq_bm_${activeLessonId}`) === 'true'
  );
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  // ─── Checklist State ("درس اليوم" Card - Image 2) ─────────
  const [lessonChecklist, setLessonChecklist] = useState({
    watchVideo: true,
    reviewNotes: true,
    solveQuestions: false,
    completeMaterials: false
  });

  const toggleChecklistItem = (key) => {
    setLessonChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // ─── Universal Confirmation Modal State ───────────────────
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    confirmColor: 'emerald',
    action: null
  });

  const triggerConfirm = ({ title, message, confirmText, cancelText, confirmColor, onConfirm }) => {
    setConfirmDialog({
      open: true,
      title,
      message,
      confirmText: confirmText || (lang === 'ar' ? 'تأكيد' : 'Confirm'),
      cancelText: cancelText || (lang === 'ar' ? 'إلغاء' : 'Cancel'),
      confirmColor: confirmColor || 'emerald',
      action: onConfirm
    });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.action) {
      confirmDialog.action();
    }
    setConfirmDialog(p => ({ ...p, open: false }));
  };

  // ─── 5 Tabs State (Matching Image 1) ──────────────────────
  // 'notes' | 'transcript' | 'roadmap' | 'materials' | 'questions'
  const [activeTab, setActiveTab] = useState('notes');
  const [mobileSubpage, setMobileSubpage] = useState(null); // 'notes' | 'transcript' | 'roadmap' | 'materials' | 'questions' | null

  // Body scroll lock when dedicated mobile subpage is open
  useEffect(() => {
    if (mobileSubpage) {
      const origOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = origOverflow;
      };
    }
  }, [mobileSubpage]);

  // ─── Knowledge Map & Graph Sub-Mode ───────────────────────
  const [roadmapViewMode, setRoadmapViewMode] = useState('cards'); // 'cards' | 'graph'
  const [isKMFS, setIsKMFS] = useState(false);
  const [expandedConcept, setExpandedConcept] = useState(2);
  const [masteredConcepts, setMasteredConcepts] = useState({ 1: true });
  const [selectedGraphNode, setSelectedGraphNode] = useState('gn4');

  // Interactive Graph Nodes (الرسم البياني الشبكي)
  const graphNodes = [
    { id: 'gn1', label: 'البلاستيدة الخضراء', tag: 'التركيب العام والستروما', x: 120, y: 180, startSec: 0, color: '#10B981', r: 34, desc: 'البنية الدقيقة والغشاء المزدوج وحشوة الستروما ومراكز الطاقة.' },
    { id: 'gn2', label: 'أقراص الجرانا (الثيلاكويد)', tag: 'أغشية الامتصاص', x: 280, y: 90, startSec: 240, color: '#06B6D4', r: 30, desc: 'حبيبات الجرانا المرتبة لزيادة مساحة امتصاص الفوتونات الضوئية.' },
    { id: 'gn3', label: 'أصباغ الكلوروفيل أ وب', tag: 'مركز التفاعل الضوئي', x: 280, y: 270, startSec: 360, color: '#6C4DFF', r: 30, desc: 'ذرة المغنيسيوم المركزية واستثارة الإلكترونات إلى مدارات عليا.' },
    { id: 'gn4', label: 'انشطار الماء الضوئي H2O', tag: 'تفاعل التحلل الضوئي', x: 480, y: 90, startSec: 480, color: '#38BDF8', r: 32, desc: 'تحلل جزيء الماء إلى بروتونات وإلكترونات نشطة وانطلاق غاز الأكسجين O2.' },
    { id: 'gn5', label: 'نظائر الأكسجين O18', tag: 'تجربة فان نيل', x: 670, y: 50, startSec: 720, color: '#EC4899', r: 28, desc: 'البرهان العلمي المعملي القاطع على أن الماء هو المصدر الحقيقي للأكسجين وليس CO2.' },
    { id: 'gn6', label: 'سلسلة الإلكترون Z-Scheme', tag: 'انحدار الطاقة الحركية', x: 640, y: 190, startSec: 1020, color: '#F59E0B', r: 30, desc: 'انتقال الإلكترونات المستثارة لضخ البروتونات وتوليد فرق جهد كيميائي أسموزي.' },
    { id: 'gn7', label: 'تكوين NADPH2 و ATP', tag: 'مركبا الطاقة التثبيتية', x: 810, y: 190, startSec: 1260, color: '#10B981', r: 32, desc: 'اختزال مرافق الإنزيم NADP+ وتخليق وحدات ATP عبر إنزيم بناء ATP Synthase.' },
    { id: 'gn8', label: 'دورة كالفن اللاضوئية', tag: 'تثبيت ثاني أكسيد الكربون', x: 960, y: 240, startSec: 1560, color: '#8B5CF6', r: 34, desc: 'التفاعلات الإنزيمية في الستروما دون الحاجة المباشرة للضوء وتثبيت غاز CO2.' },
    { id: 'gn9', label: 'تخليق مركب PGAL', tag: 'أول مركب كيميائي ثابت', x: 1110, y: 240, startSec: 1800, color: '#2563EB', r: 36, desc: 'فوسفوجليسرالدهيد ثلاثي الكربون لتخليق الجلوكوز والنشا والدهون بعد ثانيتين فقط.' }
  ];

  const graphEdges = [
    { from: 'gn1', to: 'gn2' },
    { from: 'gn1', to: 'gn3' },
    { from: 'gn2', to: 'gn4' },
    { from: 'gn3', to: 'gn4' },
    { from: 'gn4', to: 'gn5' },
    { from: 'gn4', to: 'gn6' },
    { from: 'gn6', to: 'gn7' },
    { from: 'gn7', to: 'gn8' },
    { from: 'gn1', to: 'gn8' },
    { from: 'gn8', to: 'gn9' },
  ];

  // Transcript Search State
  const [transcriptSearch, setTranscriptSearch] = useState('');

  // Notes State
  const [notes, setNotes] = useState([
    { id: 'n1', ts: '08:00', sec: 480, text: 'انشطار الماء الضوئي (H2O) هو المصدر الحقيقي للأكسجين المتصاعد، وليس CO2 طبقاً لتجربة فان نيل بالأكسجين المشع O18.', date: 'اليوم 12:30 م' },
    { id: 'n2', ts: '12:45', sec: 765, text: 'مركب PGAL (فوسفوجليسرالدهيد) هو أول مركب كيميائي ثابت ينتج عن البناء الضوئي بعد ثانيتين فقط.', date: 'أمس 04:15 م' },
  ]);
  const [noteInput, setNoteInput] = useState('');

  // Questions State
  const [savedQ, setSavedQ] = useState({ q1: true, q2: false, q3: true });
  const [revealedA, setRevealedA] = useState({ q1: true });
  const questions = [
    {
      id: 'q1',
      q: 'ما هو المركب الكيميائي الأول الثابت الناتج عن التفاعلات اللاضوئية وفق تجربة ملفن كالفن باستخدام طحلب الكلوريلا؟',
      diff: 'متوسط',
      a: 'مركب فوسفوجليسرالدهيد (PGAL) المكون من 3 ذرات كربون، والذي يتكون بعد ثانيتين فقط من التعرض للضوء.',
      src: 'امتحان ثانوية عامة 2024'
    },
    {
      id: 'q2',
      q: 'أين تحدث التفاعلات الضوئية تحديداً داخل البلاستيدة الخضراء، وما هو الدور الحاسم لأقراص الجرانا؟',
      diff: 'سهل',
      a: 'تحدث حصراً على أغشية الثيلاكويد (أقراص الجرانا) لوجود جزيئات صبغة الكلوروفيل والأنظمة الضوئية وإنزيمات بناء ATP.',
      src: 'بنك أسئلة الوزارة'
    },
    {
      id: 'q3',
      q: 'ماذا يحدث في نواتج البناء الضوئي إذا تم إمداد النبات بماء طبيعي H2O وغاز CO2 يحتوي على نظير الأكسجين المشع O18؟',
      diff: 'صعب',
      a: 'يظهر الأكسجين المشع O18 في جزيئات الجلوكوز والماء الناتج، بينما يتصاعد غاز الأكسجين O2 خالي تماماً من الإشعاع لأن مصدره انشطار الماء.',
      src: 'نماذج الوزارة الاسترشادية'
    },
  ];

  // Attachments State
  const [dlId, setDlId] = useState(null);
  const [dlToast, setDlToast] = useState(null);
  const attachments = [
    { id: 'a1', titleAr: 'مذكرة الشرح الشاملة والخرائط المفاهيمية للدرس', size: '4.8 MB', pages: '18 صفحة', type: 'PDF' },
    { id: 'a2', titleAr: 'مخطط كورنيل التلخيصي لتفاعلات انشطار الماء وحلقة كالفن', size: '2.1 MB', pages: '4 صفحات', type: 'PDF' },
    { id: 'a3', titleAr: 'بنك أسئلة الوزارة وتدريبات البابل شيت مع نماذج الإجابة', size: '3.4 MB', pages: '12 صفحة', type: 'PDF' },
  ];

  // Transcript Database (نص الحصة الذكي)
  const transcriptSegments = [
    {
      id: 't1',
      startSec: 0,
      endSec: 240,
      speaker: 'د. سلمى السيد',
      text: 'أهلاً بكم يا شباب في المحاضرة الثالثة من كورس الأحياء للثانوية العامة. اليوم هنركز على موضوع في غاية الأهمية والخطورة وهو آلية البناء الضوئي وحركية الطاقة. قبل ما ندخل في المعادلات، لازم نفهم البنية التشريحية للبلاستيدة الخضراء وأغشية الثيلاكويد.'
    },
    {
      id: 't2',
      startSec: 240,
      endSec: 480,
      speaker: 'د. سلمى السيد',
      text: 'الكلوروفيل مش مجرد صبغة خضراء، دي شبكة معقدة لاصطياد الفوتونات الضوئية. ذرة المغنيسيوم الموجودة في مركز الجزيء بتمتص طاقة الفوتون، وده بيؤدي إلى إثارة إلكتروناتها وانتقالها لمستوى طاقة أعلى.'
    },
    {
      id: 't3',
      startSec: 480,
      endSec: 850,
      speaker: 'د. سلمى السيد',
      text: 'هنا بنوصل لتجربة العالم فان نيل الحاسمة. لسنوات طويلة كان الاعتقاد السائد أن الأكسجين المتصاعد جاي من ثاني أكسيد الكربون! لكن فان نيل استخدم بكتيريا الكبريت الخضراء والأرجوانية، وأثبت أن الماء هو المصدر الحقيقي للأكسجين عبر نظائر الأكسجين المشعة O18.'
    },
    {
      id: 't4',
      startSec: 850,
      endSec: 1300,
      speaker: 'د. سلمى السيد',
      text: 'عند انشطار الماء ضوئياً، بنحصل على بروتونات الهيدروجين والإلكترونات النشطة، وبيتم تحميلها على مرافق الإنزيم NADP+ ليتحول إلى NADPH2. بالتوازي مع ده، بيحدث انحدار إلكتروني يولد طاقة كافية لإنتاج جزيئات ATP عبر الفسفرة الضوئية.'
    },
    {
      id: 't5',
      startSec: 1300,
      endSec: 1800,
      speaker: 'د. سلمى السيد',
      text: 'في المرحلة الثانية، بننتقل من الجرانا إلى الستروما، وهنا بتبدأ التفاعلات اللاضوئية أو دورة كالفن. د. ملفن كالفن عرض طحلب الكلوريلا للضوء لثانيتين فقط، واكتشف أن أول مركب كيميائي ثابت هو PGAL ثلاثي الكربون.'
    },
    {
      id: 't6',
      startSec: 1800,
      endSec: 2100,
      speaker: 'د. سلمى السيد',
      text: 'من مركب PGAL، تستطيع الخلية النباتية بناء الجلوكوز، والنشا، والدهون، والبروتينات. هذا هو الركيزة الأساسية للحياة على كوكب الأرض، وأي خلل في هذه المسارات يؤثر مباشرة على تدفق الطاقة الحيوية.'
    }
  ];

  // ─── Playlist Array ───────────────────────────────────────
  const playlist = Object.keys(lessonsDatabase).map(key => ({
    id: key,
    titleAr: lessonsDatabase[key].titleAr,
    time: lessonsDatabase[key].time,
    completed: !!lessonStatuses[key],
    active: key === activeLessonId
  }));

  const completedCount = playlist.filter(l => l.completed).length;
  const courseCompletionPct = Math.round((completedCount / playlist.length) * 100);
  const currentCh = lesson.chapters.find(c => currentTime >= c.startSec && currentTime < c.endSec) || lesson.chapters[0];
  const progress = Math.min(100, Math.max(0, ((currentTime / lesson.durationSec) * 100))).toFixed(1);
  const remainingSec = Math.max(0, lesson.durationSec - currentTime);

  // ─── Lesson Switching with Confirmation ───────────────────
  const switchLesson = (lid) => {
    setActiveLessonId(lid);
    setIsPlaying(false);
    const s = localStorage.getItem(`mtfq_pos_${lid}`);
    setCurrentTime(s ? parseInt(s, 10) : 0);
    setIsBookmarked(localStorage.getItem(`mtfq_bm_${lid}`) === 'true');
    setMobilePlaylistOpen(false);
  };

  const handlePlaylistLessonClick = (targetLesson) => {
    if (targetLesson.id === activeLessonId) return;
    if (isPlaying || currentTime > 60) {
      triggerConfirm({
        title: lang === 'ar' ? 'الانتقال إلى درس آخر' : 'Switch Lesson',
        message: lang === 'ar'
          ? `أنت تذاكر حالياً "${lesson.titleAr}". هل تريد الانتقال إلى "${targetLesson.titleAr}" وحفظ موضع توقفك الحالي؟`
          : `Switch to "${targetLesson.titleAr}"? Your current progress will be preserved.`,
        confirmText: lang === 'ar' ? 'نعم، انتقل للدرس' : 'Yes, Switch',
        cancelText: lang === 'ar' ? 'البقاء في الدرس' : 'Stay Here',
        confirmColor: 'primary',
        onConfirm: () => switchLesson(targetLesson.id)
      });
    } else {
      switchLesson(targetLesson.id);
    }
  };

  // ─── Video Time Simulation ────────────────────────────────
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= lesson.durationSec) {
            setIsPlaying(false);
            if (!lessonStatuses[activeLessonId]) {
              const nextStatuses = { ...lessonStatuses, [activeLessonId]: true };
              setLessonStatuses(nextStatuses);
              localStorage.setItem('mtfq_lesson_statuses', JSON.stringify(nextStatuses));
              setShowCelebrationModal(true);
            }
            return lesson.durationSec;
          }
          const next = prev + 1;
          localStorage.setItem(`mtfq_pos_${activeLessonId}`, next.toString());
          return next;
        });
      }, 1000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, lesson.durationSec, activeLessonId, lessonStatuses]);

  const fmt = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const seekTo = (sec) => {
    const target = Math.max(0, Math.min(lesson.durationSec, sec));
    setCurrentTime(target);
    localStorage.setItem(`mtfq_pos_${activeLessonId}`, target.toString());
  };

  const seekBy = (sec) => seekTo(currentTime + sec);

  // ─── Universal Button Confirmation Triggers ───────────────
  const handleCompleteButtonClick = () => {
    if (!isCompleted) {
      triggerConfirm({
        title: lang === 'ar' ? 'تأكيد إكمال الحصة' : 'Confirm Lesson Completion',
        message: lang === 'ar'
          ? 'هل أنت متأكد من تحديد هذه الحصة كمكتملة؟ سيتم منحك +50 XP وتحديث نسبة تقدمك العامة في المنهج.'
          : 'Are you sure you want to mark this lesson as completed? You will receive +50 XP.',
        confirmText: lang === 'ar' ? 'نعم، أتممت الحصة' : 'Yes, Complete',
        confirmColor: 'emerald',
        onConfirm: () => {
          const nextStatuses = { ...lessonStatuses, [activeLessonId]: true };
          setLessonStatuses(nextStatuses);
          localStorage.setItem('mtfq_lesson_statuses', JSON.stringify(nextStatuses));
          try {
            confetti({
              particleCount: 85,
              spread: 75,
              origin: { y: 0.6 }
            });
          } catch (e) {}
          setShowCelebrationModal(true);
        }
      });
    } else {
      triggerConfirm({
        title: lang === 'ar' ? 'إلغاء إتمام الحصة' : 'Revert Completion',
        message: lang === 'ar'
          ? 'هل تريد إرجاع حالة الحصة إلى "قيد المذاكرة"؟ لن يتم حذف أي من ملاحظاتك أو إجاباتك.'
          : 'Do you want to revert this lesson status to in-progress?',
        confirmText: lang === 'ar' ? 'نعم، إلغاء الإتمام' : 'Yes, Revert',
        confirmColor: 'amber',
        onConfirm: () => {
          const nextStatuses = { ...lessonStatuses, [activeLessonId]: false };
          setLessonStatuses(nextStatuses);
          localStorage.setItem('mtfq_lesson_statuses', JSON.stringify(nextStatuses));
        }
      });
    }
  };

  const handleSummaryClick = () => {
    triggerConfirm({
      title: lang === 'ar' ? 'تأكيد تحميل ملخص الحصة' : 'Download Summary PDF',
      message: lang === 'ar'
        ? `هل تريد بدء تحميل ملخص المحاضرة الشامل بصيغة PDF (${courseInfo.summaryPdf})؟`
        : 'Do you want to download the comprehensive lesson summary PDF?',
      confirmText: lang === 'ar' ? 'نعم، ابدأ التحميل' : 'Yes, Download',
      confirmColor: 'primary',
      onConfirm: () => handleDL({ id: 'summary', titleAr: courseInfo.summaryPdf })
    });
  };

  const handleBookmarkClick = () => {
    triggerConfirm({
      title: isBookmarked
        ? (lang === 'ar' ? 'إلغاء حفظ الحصة' : 'Remove Bookmark')
        : (lang === 'ar' ? 'تأكيد حفظ الحصة' : 'Bookmark Lesson'),
      message: isBookmarked
        ? (lang === 'ar' ? 'هل تريد إزالة هذه الحصة من قائمة المحفوظات للمراجعة السريعة؟' : 'Remove from bookmarked lessons?')
        : (lang === 'ar' ? 'هل تريد إضافة هذه الحصة إلى قائمة المحفوظات للرجوع إليها قبل الامتحانات؟' : 'Bookmark this lesson for quick revision?'),
      confirmText: isBookmarked ? (lang === 'ar' ? 'نعم، إزالة' : 'Remove') : (lang === 'ar' ? 'نعم، حفظ الحصة' : 'Bookmark'),
      confirmColor: isBookmarked ? 'amber' : 'emerald',
      onConfirm: () => {
        const next = !isBookmarked;
        setIsBookmarked(next);
        localStorage.setItem(`mtfq_bm_${activeLessonId}`, next.toString());
      }
    });
  };

  const handleDeleteNoteClick = (note) => {
    triggerConfirm({
      title: lang === 'ar' ? 'تأكيد حذف الملاحظة' : 'Delete Note',
      message: lang === 'ar'
        ? `هل أنت متأكد من حذف الملاحظة المسجلة عند التوقيت (${note.ts})؟ لا يمكن التراجع عن هذا الإجراء.`
        : 'Are you sure you want to delete this note? This cannot be undone.',
      confirmText: lang === 'ar' ? 'حذف نهائياً' : 'Delete',
      confirmColor: 'rose',
      onConfirm: () => {
        setNotes(notes.filter(x => x.id !== note.id));
      }
    });
  };

  const handleAttachmentDownloadClick = (att) => {
    triggerConfirm({
      title: lang === 'ar' ? `تحميل ملف: ${att.titleAr}` : `Download: ${att.titleAr}`,
      message: lang === 'ar'
        ? `هل تريد تحميل ملف "${att.titleAr}" (${att.size} • ${att.pages}) إلى جهازك؟`
        : `Download "${att.titleAr}" (${att.size})?`,
      confirmText: lang === 'ar' ? 'بدء التنزيل' : 'Download Now',
      confirmColor: 'emerald',
      onConfirm: () => handleDL(att)
    });
  };

  const handleSaveQuestionClick = (q) => {
    const isSaved = savedQ[q.id];
    triggerConfirm({
      title: isSaved ? (lang === 'ar' ? 'إلغاء حفظ السؤال' : 'Unsave Question') : (lang === 'ar' ? 'حفظ السؤال للمراجعة' : 'Save Question'),
      message: isSaved
        ? (lang === 'ar' ? 'هل تريد إزالة هذا السؤال من بنك أسئلتك المحفوظة؟' : 'Remove this question from saved list?')
        : (lang === 'ar' ? 'سيتم حفظ هذا السؤال في بنك أسئلتك المخصصة للتدريب الذكي قبل الامتحانات.' : 'Save this question to your practice bank?'),
      confirmText: isSaved ? (lang === 'ar' ? 'نعم، إزالة' : 'Remove') : (lang === 'ar' ? 'تأكيد الحفظ' : 'Save'),
      confirmColor: isSaved ? 'amber' : 'emerald',
      onConfirm: () => setSavedQ(p => ({ ...p, [q.id]: !p[q.id] }))
    });
  };

  const handleToggleMasteredClick = (ch) => {
    const isMastered = !!masteredConcepts[ch.id];
    triggerConfirm({
      title: isMastered
        ? (lang === 'ar' ? 'إلغاء تأكيد استيعاب المفهوم' : 'Unmark Concept')
        : (lang === 'ar' ? `تأكيد استيعاب: ${ch.titleAr}` : 'Confirm Concept Mastery'),
      message: isMastered
        ? (lang === 'ar' ? 'هل تريد إرجاع هذا المفهوم إلى قائمة المفاهيم الجاري مراجعتها؟' : 'Revert this concept to review status?')
        : (lang === 'ar' ? 'سيتم تسجيل هذا المفهوم ضمن المفاهيم المتقنة في سجلك التعليمي لرفع نسبة التحصيل.' : 'Mark this concept as mastered in your learning report?'),
      confirmText: isMastered ? (lang === 'ar' ? 'نعم، إلغاء التأكيد' : 'Unmark') : (lang === 'ar' ? 'نعم، أتقنت المفهوم' : 'Confirm Mastery'),
      confirmColor: isMastered ? 'amber' : 'emerald',
      onConfirm: () => setMasteredConcepts(p => ({ ...p, [ch.id]: !p[ch.id] }))
    });
  };

  const addNote = (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    const newNote = {
      id: `n${Date.now()}`,
      ts: fmt(currentTime),
      sec: currentTime,
      text: noteInput.trim(),
      date: lang === 'ar' ? 'الآن' : 'Just now'
    };
    setNotes([newNote, ...notes]);
    setNoteInput('');
  };

  const handleDL = (att) => {
    setDlId(att.id);
    setTimeout(() => {
      setDlId(null);
      setDlToast(att.titleAr);
      setTimeout(() => setDlToast(null), 3500);
    }, 1000);
  };

  // ─── Mobile Landscape Fullscreen Controller ──────────────
  const toggleLandscape = async () => {
    if (!playerRef.current) return;
    try {
      if (!isLandscape) {
        if (playerRef.current.requestFullscreen) {
          await playerRef.current.requestFullscreen();
        }
        if (window.screen.orientation && window.screen.orientation.lock) {
          await window.screen.orientation.lock('landscape').catch(() => {});
        }
        setIsLandscape(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen().catch(() => {});
        }
        if (window.screen.orientation && window.screen.orientation.unlock) {
          window.screen.orientation.unlock();
        }
        setIsLandscape(false);
      }
    } catch (e) {
      setIsLandscape(!isLandscape);
    }
  };

  const togglePlayerFS = async () => {
    if (!playerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await playerRef.current.requestFullscreen();
        setIsPlayerFS(true);
      } else {
        await document.exitFullscreen();
        setIsPlayerFS(false);
      }
    } catch (e) {
      setIsPlayerFS(!isPlayerFS);
    }
  };

  const toggleKMFS = async () => {
    if (!kmRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await kmRef.current.requestFullscreen();
        setIsKMFS(true);
      } else {
        await document.exitFullscreen();
        setIsKMFS(false);
      }
    } catch (e) {
      setIsKMFS(!isKMFS);
    }
  };

  // ─── 5 Clean Tabs (Exact Match to User Reference Image) ───
  const tabs = [
    { id: 'notes', label: lang === 'ar' ? 'ملاحظات الدرس' : 'Lesson Notes', icon: FileText },
    { id: 'transcript', label: lang === 'ar' ? 'نص الحصة' : 'Transcript', icon: AlignLeft },
    { id: 'roadmap', label: lang === 'ar' ? 'خريطة الحصة' : 'Lesson Map', icon: Map },
    { id: 'materials', label: lang === 'ar' ? 'الملفات' : 'Files', icon: Folder },
    { id: 'questions', label: lang === 'ar' ? 'الأسئلة' : 'Questions', icon: HelpCircle },
  ];

  // Donut progress calculation for Image 2 Card
  const donutProgressVal = isCompleted ? 100 : Math.max(15, Math.round(progress));
  const donutRadius = 36;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutDashoffset = donutCircumference - (donutProgressVal / 100) * donutCircumference;

  const activeGraphNodeObj = graphNodes.find(n => n.id === selectedGraphNode) || graphNodes[3];

  const renderTabContent = (targetTab) => {
    return (
      <>
        {/* ── TAB 1: NOTES (ملاحظات الدرس) ── */}
        {targetTab === 'notes' && (
          <div className="lv-notes">
            <div className="lv-notes__head">
              <div className="lv-notes__title-group">
                <h3 className="lv-notes__heading">{lang === 'ar' ? 'مفكرة الطالب الذكية' : 'Student Notebook'}</h3>
                <span className="lv-notes__saved">
                  <span className="lv-notes__saved-dot" />
                  {lang === 'ar' ? `تم الحفظ تلقائياً: ${fmt(currentTime)}` : `Auto-saved: ${fmt(currentTime)}`}
                </span>
              </div>
            </div>

            <form onSubmit={addNote} className="lv-notes__form">
              <textarea
                rows={3}
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                placeholder={lang === 'ar' ? 'اكتب ملاحظاتك هنا... سيتم ربط الملاحظة بالوقت الحالي للمقطع' : 'Type your notes here... linked to current video timestamp.'}
                className="lv-notes__input"
              />
              <div className="lv-notes__form-footer">
                <span className="lv-notes__hint">
                  {lang === 'ar' ? `سيتم تسجيل الملاحظة عند الدقيقة ${fmt(currentTime)}` : `Linked at ${fmt(currentTime)}`}
                </span>
                <button type="submit" disabled={!noteInput.trim()} className="lv-notes__submit">
                  <Sparkles size={13} />
                  <span>{lang === 'ar' ? 'حفظ الملاحظة' : 'Save Note'}</span>
                </button>
              </div>
            </form>

            {notes.length > 0 && (
              <div className="lv-notes__list">
                {notes.map((n, i) => (
                  <div key={n.id} className="lv-note" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="lv-note__top">
                      <button
                        className="lv-note__ts"
                        onClick={() => seekTo(n.sec)}
                        title="انتقل لهذا التوقيت في الفيديو"
                      >
                        <Play size={10} fill="currentColor" />
                        <span>{n.ts}</span>
                      </button>
                      <div className="lv-note__actions">
                        <span className="lv-note__date">{n.date}</span>
                        <button
                          className="lv-note__del"
                          onClick={() => handleDeleteNoteClick(n)}
                          title="حذف الملاحظة"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <p className="lv-note__text">{n.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: TRANSCRIPT (نص الحصة الذكي) ── */}
        {targetTab === 'transcript' && (
          <div className="lv-transcript">
            {/* Search bar inside transcript */}
            <div className="lv-transcript__search-bar">
              <Search size={15} />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'ابحث في كلمات وشرح الحصة...' : 'Search in lecture transcript...'}
                value={transcriptSearch}
                onChange={e => setTranscriptSearch(e.target.value)}
                className="lv-transcript__search-input"
              />
              {transcriptSearch && (
                <button onClick={() => setTranscriptSearch('')} className="lv-transcript__search-clear">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Segments List */}
            <div className="lv-transcript__list">
              {transcriptSegments
                .filter(seg => !transcriptSearch || seg.text.toLowerCase().includes(transcriptSearch.toLowerCase()))
                .map(seg => {
                  const isCurrent = currentTime >= seg.startSec && currentTime < seg.endSec;
                  return (
                    <div
                      key={seg.id}
                      className={`lv-transcript__item ${isCurrent ? 'active' : ''}`}
                      onClick={() => seekTo(seg.startSec)}
                    >
                      <button className="lv-transcript__time-btn" title="تشغيل من هذه النقطة">
                        <Play size={11} fill="currentColor" />
                        <span>{fmt(seg.startSec)}</span>
                      </button>
                      <div className="lv-transcript__content">
                        <div className="lv-transcript__speaker">{seg.speaker}</div>
                        <p className="lv-transcript__p">{seg.text}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ── TAB 3: ROADMAP (خريطة الحصة + الرسم البياني الشبكي ك جراف) ── */}
        {targetTab === 'roadmap' && (
          <div className="lv-roadmap-tab" ref={kmRef}>
            <div className="lv-km__header">
              <div className="lv-km__header-left">
                <div className="lv-km__header-icon"><Brain size={20} /></div>
                <div className="lv-km__header-text">
                  <h2 className="lv-km__title">
                    {lang === 'ar' ? 'خارطة المفاهيم وشبكة المعرفة التفاعلية' : 'Interactive Knowledge Roadmap & Graph'}
                  </h2>
                  <p className="lv-km__sub">
                    {courseInfo.subjectAr} • {lesson.titleAr}
                  </p>
                </div>
              </div>

              <div className="lv-km__header-actions">
                {/* Sub-mode Switcher: Cards vs Graph */}
                <div className="lv-roadmap-toggle-group">
                  <button
                    className={`lv-roadmap-toggle-btn ${roadmapViewMode === 'cards' ? 'active' : ''}`}
                    onClick={() => setRoadmapViewMode('cards')}
                  >
                    <Layers size={13} />
                    <span>{lang === 'ar' ? 'بطاقات الشرح' : 'Cards View'}</span>
                  </button>

                  <button
                    className={`lv-roadmap-toggle-btn ${roadmapViewMode === 'graph' ? 'active' : ''}`}
                    onClick={() => setRoadmapViewMode('graph')}
                  >
                    <Network size={13} />
                    <span>{lang === 'ar' ? 'الرسم البياني (Graph)' : 'Network Graph'}</span>
                  </button>
                </div>

                <button className="lv-km__action" onClick={toggleKMFS} title="شاشة كاملة">
                  {isKMFS ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>
            </div>

            {/* ── SUB-MODE 1: Interactive Network Graph (خريطة ك جراف) ── */}
            {roadmapViewMode === 'graph' && (
              <div className="lv-graph-container">
                <div className="lv-graph-hint">
                  <Sparkles size={14} />
                  <span>{lang === 'ar' ? 'اضغط على أي عقدة (Node) لاستكشاف العلاقات والانتقال المباشر لتوقيتها (اسحب يميناً ويساراً ↔)' : 'Click any node to explore connections & jump in video (swipe to pan ↔)'}</span>
                </div>

                {/* SVG Network Graph */}
                <div className="lv-graph-svg-wrap">
                  <svg viewBox="0 0 1260 360" className="lv-graph-svg">
                    <defs>
                      <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6C4DFF" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
                      </linearGradient>

                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Render Connecting Edges */}
                    {graphEdges.map((e, idx) => {
                      const source = graphNodes.find(n => n.id === e.from);
                      const target = graphNodes.find(n => n.id === e.to);
                      if (!source || !target) return null;
                      const midX = (source.x + target.x) / 2;
                      const pathData = `M ${source.x} ${source.y} C ${midX} ${source.y}, ${midX} ${target.y}, ${target.x} ${target.y}`;
                      return (
                        <g key={idx}>
                          <path
                            d={pathData}
                            stroke="var(--border-subtle)"
                            strokeWidth="3"
                            fill="none"
                          />
                          <path
                            d={pathData}
                            stroke="url(#edgeGrad)"
                            strokeWidth="2.5"
                            strokeDasharray="8 6"
                            className="lv-graph-edge-flow"
                            fill="none"
                          />
                        </g>
                      );
                    })}

                    {/* Render Graph Nodes */}
                    {graphNodes.map(node => {
                      const isSelected = selectedGraphNode === node.id;
                      const isCurrent = currentTime >= node.startSec && currentTime < (node.startSec + 300);
                      return (
                        <g
                          key={node.id}
                          transform={`translate(${node.x}, ${node.y})`}
                          className={`lv-graph-node ${isSelected ? 'selected' : ''} ${isCurrent ? 'current' : ''}`}
                          onClick={() => setSelectedGraphNode(node.id)}
                        >
                          {isCurrent && (
                            <circle
                              r={node.r + 10}
                              fill="none"
                              stroke={node.color}
                              strokeWidth="2"
                              className="lv-graph-node-pulse"
                            />
                          )}

                          <circle
                            r={node.r}
                            fill="var(--bg-surface)"
                            stroke={isSelected ? '#6C4DFF' : node.color}
                            strokeWidth={isSelected ? 3.5 : 2}
                            filter="url(#glow)"
                          />

                          <circle
                            r={node.r - 5}
                            fill={node.color}
                            fillOpacity="0.16"
                          />

                          <text
                            y="-6"
                            textAnchor="middle"
                            fill="var(--text-primary)"
                            fontSize="12.5"
                            fontWeight="800"
                            fontFamily="var(--font-heading)"
                          >
                            {node.label}
                          </text>

                          <text
                            y="12"
                            textAnchor="middle"
                            fill="var(--text-secondary)"
                            fontSize="9.5"
                            fontWeight="600"
                          >
                            {node.tag}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Selected Node Details Bar */}
                {activeGraphNodeObj && (
                  <div className="lv-graph-card animate-pop">
                    <div className="lv-graph-card__head">
                      <div className="lv-graph-card__title-group">
                        <span
                          className="lv-graph-card__dot"
                          style={{ backgroundColor: activeGraphNodeObj.color }}
                        />
                        <h4 className="lv-graph-card__title">{activeGraphNodeObj.label}</h4>
                        <span className="lv-graph-card__tag">{activeGraphNodeObj.tag}</span>
                      </div>

                      <button
                        className="lv-graph-card__jump-btn"
                        onClick={() => {
                          seekTo(activeGraphNodeObj.startSec);
                          setIsPlaying(true);
                        }}
                      >
                        <Play size={13} fill="currentColor" />
                        <span>{lang === 'ar' ? `تشغيل الحصة من هذه النقطة (${fmt(activeGraphNodeObj.startSec)})` : `Play from ${fmt(activeGraphNodeObj.startSec)}`}</span>
                      </button>
                    </div>

                    <p className="lv-graph-card__desc">{activeGraphNodeObj.desc}</p>
                  </div>
                )}
              </div>
            )}

            {/* ── SUB-MODE 2: Concept Cards Roadmap (خريطة البطاقات) ── */}
            {roadmapViewMode === 'cards' && (
              <>
                {/* Overall Lesson Progress */}
                <div className="lv-km__progress">
                  <div className="lv-km__progress-bar">
                    <div className="lv-km__progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="lv-km__progress-text">
                    {progress}% {lang === 'ar' ? 'مكتمل من المعرفة التراكمية لهذه الحصة' : 'completed of roadmap'}
                  </span>
                </div>

                {/* Central Node Badge */}
                <div className="lv-km__center-badge">
                  <Sparkles size={14} />
                  <span>{lang === 'ar' ? 'المفهوم الجوهري: حركية الطاقة وانشطار الماء وتثبيت الكربون' : 'Core Concept: Photosynthesis Energy Transfer'}</span>
                </div>

                {/* Concept Roadmap Cards */}
                <div className="lv-km__grid">
                  {lesson.chapters.map((ch, i) => {
                    const isDone = currentTime >= ch.endSec;
                    const isCurrent = currentCh.id === ch.id;
                    const isExpanded = expandedConcept === ch.id;
                    const isMastered = !!masteredConcepts[ch.id];
                    const chProgress = isCurrent
                      ? Math.min(100, Math.max(0, ((currentTime - ch.startSec) / (ch.endSec - ch.startSec)) * 100))
                      : isDone ? 100 : 0;

                    return (
                      <div
                        key={ch.id}
                        className={`lv-concept ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''} ${isExpanded ? 'expanded' : ''}`}
                        style={{ animationDelay: `${i * 0.08}s` }}
                        onClick={() => setExpandedConcept(isExpanded ? null : ch.id)}
                      >
                        <div className="lv-concept__status">
                          {isDone ? (
                            <CheckCircle2 size={18} />
                          ) : isCurrent ? (
                            <Play size={14} fill="currentColor" />
                          ) : (
                            <Lock size={14} />
                          )}
                        </div>

                        <div className="lv-concept__body">
                          <div className="lv-concept__head">
                            <span className="lv-concept__num">{lang === 'ar' ? `المحطة ${ch.id}` : `Node ${ch.id}`}</span>
                            <span className="lv-concept__time">{fmt(ch.startSec)} — {fmt(ch.endSec)}</span>
                          </div>
                          <h4 className="lv-concept__title">{ch.titleAr}</h4>

                          <div className="lv-concept__bar">
                            <div className="lv-concept__bar-fill" style={{ width: `${chProgress}%` }} />
                          </div>

                          {isExpanded && (
                            <div className="lv-concept__details" onClick={e => e.stopPropagation()}>
                              <p className="lv-concept__desc">{ch.descAr}</p>
                              <div className="lv-concept__terms">
                                <span className="lv-concept__terms-label">
                                  {lang === 'ar' ? 'المصطلحات المحورية:' : 'Key Terms:'}
                                </span>
                                {ch.keyTerms.map(t => (
                                  <span key={t} className="lv-concept__term">{t}</span>
                                ))}
                              </div>
                              <div className="lv-concept__actions">
                                <button
                                  className="lv-concept__jump"
                                  onClick={() => {
                                    seekTo(ch.startSec);
                                    setIsPlaying(true);
                                  }}
                                >
                                  <Play size={12} fill="currentColor" />
                                  <span>{lang === 'ar' ? `انتقل لهذا الجزء في الحصة (${fmt(ch.startSec)})` : `Jump to ${fmt(ch.startSec)}`}</span>
                                </button>

                                <button
                                  className={`lv-concept__mastery ${isMastered ? 'mastered' : ''}`}
                                  onClick={() => handleToggleMasteredClick(ch)}
                                >
                                  {isMastered ? <CheckSquare size={14} /> : <Square size={14} />}
                                  <span>{isMastered ? (lang === 'ar' ? 'تم استيعاب المفهوم' : 'Mastered') : (lang === 'ar' ? 'تأكيد الاستيعاب' : 'Mark Mastered')}</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <ChevronDown size={15} className={`lv-concept__chevron ${isExpanded ? 'open' : ''}`} />
                      </div>
                    );
                  })}
                </div>

                {/* Learning Outcomes Checklist */}
                <div className="lv-km__outcomes">
                  <h3 className="lv-km__outcomes-title">
                    <Target size={16} />
                    <span>{lang === 'ar' ? 'نواتج التعلم المستهدفة طبقاً لمواصفات الوزارة' : 'Target Learning Outcomes'}</span>
                  </h3>
                  {[
                    'تفسير معادلة البناء الضوئي وحركية انتقال الإلكترونات المستثارة عبر أغشية الثيلاكويد.',
                    'البرهنة بالدليل التجريبي على دور الماء كمصدر للأكسجين المتصاعد باستخدام نظائر O18 المشعة.',
                    'الربط بين مركبات الطاقة المختزنة NADPH2 و ATP وتفاعلات تثبيت غاز CO2 في ستروما البلاستيدة وتكوين PGAL.',
                  ].map((outcome, i) => (
                    <div key={i} className="lv-km__outcome" style={{ animationDelay: `${i * 0.1}s` }}>
                      <Check size={14} className="lv-km__outcome-icon" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── TAB 4: MATERIALS (الملفات) ── */}
        {targetTab === 'materials' && (
          <div className="lv-materials">
            {attachments.map((a, i) => (
              <div key={a.id} className="lv-att" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="lv-att__icon">
                  <FileText size={22} />
                </div>
                <div className="lv-att__info">
                  <div className="lv-att__name">{a.titleAr}</div>
                  <div className="lv-att__meta">{a.size} • {a.pages} • ملف {a.type}</div>
                </div>
                <button
                  className="lv-att__dl"
                  onClick={() => handleAttachmentDownloadClick(a)}
                  disabled={dlId === a.id}
                >
                  <Download size={14} />
                  <span>{dlId === a.id ? (lang === 'ar' ? 'جاري التحميل...' : 'Downloading...') : (lang === 'ar' ? 'تحميل' : 'Download')}</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 5: QUESTIONS (الأسئلة) ── */}
        {targetTab === 'questions' && (
          <div className="lv-questions">
            {questions.map((q, i) => (
              <div key={q.id} className="lv-q" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="lv-q__head">
                  <span className={`lv-q__diff ${q.diff === 'صعب' ? 'hard' : q.diff === 'سهل' ? 'easy' : 'med'}`}>
                    {q.diff}
                  </span>
                  <span className="lv-q__src">{q.src}</span>
                  <button
                    className={`lv-q__save ${savedQ[q.id] ? 'on' : ''}`}
                    onClick={() => handleSaveQuestionClick(q)}
                    title="حفظ السؤال للمراجعة"
                  >
                    <Star size={14} fill={savedQ[q.id] ? 'currentColor' : 'transparent'} />
                  </button>
                </div>

                <p className="lv-q__text">{q.q}</p>

                <div className="lv-q__reveal-action">
                  <button
                    className="lv-q__toggle-btn"
                    onClick={() => setRevealedA(p => ({ ...p, [q.id]: !p[q.id] }))}
                  >
                    {revealedA[q.id] ? (lang === 'ar' ? 'إخفاء الإجابة النموذجية' : 'Hide Answer') : (lang === 'ar' ? 'عرض الإجابة النموذجية والتفسير' : 'Show Model Answer')}
                  </button>
                </div>

                {revealedA[q.id] && (
                  <div className="lv-q__answer">
                    <div className="lv-q__answer-bar" />
                    <div className="lv-q__answer-content">
                      <strong>{lang === 'ar' ? 'الإجابة المعتمدة: ' : 'Official Answer: '}</strong>
                      <span>{q.a}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="lv">
      {/* ── Feedback Toast ── */}
      {dlToast && (
        <div className="lv-toast">
          <CheckCircle2 size={16} />
          <span>{lang === 'ar' ? `تم تحميل "${dlToast}" بنجاح` : `Downloaded "${dlToast}"`}</span>
        </div>
      )}

      {/* ══════════ BREADCRUMB BAR ══════════ */}
      <div className="lv-top-bar">
        <nav className="lv-crumb" aria-label="Breadcrumb">
          <button className="lv-crumb-link" onClick={() => navigate('/student/courses')}>
            {lang === 'ar' ? 'مقرراتي (حصصي)' : 'My Courses'}
          </button>
          <ChevronRight size={13} className="lv-crumb-sep" />
          <span className="lv-crumb-link" onClick={() => navigate('/student/courses')}>
            {courseInfo.titleAr}
          </span>
          <ChevronRight size={13} className="lv-crumb-sep" />
          <span className="lv-crumb-current">{lesson.titleAr}</span>
        </nav>
      </div>

      {/* ══════════ MAIN 2-COLUMN LAYOUT ══════════ */}
      <div className="lv-layout">

        {/* ─── MAIN COLUMN: Content Area ─── */}
        <main className="lv-content">

          {/* ══ MEDIA PLAYER ══ */}
          <div className={`lv-player ${isPlayerFS || isLandscape ? 'lv-player--fs' : ''}`} ref={playerRef}>
            {mediaMode === 'video' ? (
              /* Video Screen */
              <div className="lv-player__screen">
                <img src={lesson.videoUrl} alt={lesson.titleAr} className="lv-player__video" />
                <div className="lv-player__video-gradient" />

                {/* Chapter Pill */}
                <div className="lv-player__chapter-pill">
                  <span className="lv-player__chapter-num">
                    {lang === 'ar' ? `المحطة ${currentCh.id} من 4` : `Part ${currentCh.id}/4`}
                  </span>
                  <span className="lv-player__chapter-title">{currentCh.titleAr}</span>
                </div>

                {/* Center Play/Pause Overlay */}
                <button
                  className="lv-player__center-btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                  title={isPlaying ? 'إيقاف' : 'تشغيل'}
                >
                  <span className="lv-player__center-ring" />
                  {isPlaying ? (
                    <Pause size={28} />
                  ) : (
                    <Play size={28} fill="currentColor" style={{ marginInlineStart: '3px' }} />
                  )}
                </button>

                {/* Fullscreen & Landscape Buttons */}
                <div className="lv-player__top-actions">
                  <button
                    className="lv-player__fs-btn lv-player__rotate-btn"
                    onClick={toggleLandscape}
                    title={lang === 'ar' ? 'تشغيل بالعرض (Landscape للتليفون)' : 'Landscape Orientation'}
                  >
                    <RotateCw size={15} />
                  </button>

                  <button
                    className="lv-player__fs-btn"
                    onClick={togglePlayerFS}
                    title={isPlayerFS ? 'إنهاء وضع الشاشة الكاملة' : 'شاشة كاملة'}
                  >
                    {isPlayerFS ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                </div>
              </div>
            ) : (
              /* Audio Studio (Adaptive Mode) */
              <div className="lv-player__audio-studio">
                <div className="lv-player__audio-glow" />
                <div className="lv-player__audio-avatar-wrap">
                  <img src={courseInfo.teacherImg} alt={courseInfo.teacherAr} className="lv-player__audio-avatar" />
                  <div className="lv-player__audio-badge"><Headphones size={13} /></div>
                </div>
                <p className="lv-player__audio-label">
                  {lang === 'ar' ? 'تسجيل الحصة الصوتي عالي النقاء (HD Podcast)' : 'HD Master Audio'}
                </p>
                <h3 className="lv-player__audio-title">{lesson.titleAr}</h3>
                <p className="lv-player__audio-sub">{courseInfo.teacherAr} • {currentCh.titleAr}</p>

                {/* Pulsing Audio Waveform */}
                <div className="lv-waveform">
                  {Array.from({ length: 32 }, (_, i) => (
                    <div
                      key={i}
                      className="lv-waveform__bar"
                      style={{
                        animationDelay: `${(i % 8) * 0.12}s`,
                        animationPlayState: isPlaying ? 'running' : 'paused'
                      }}
                    />
                  ))}
                </div>

                <div className="lv-player__audio-footer">
                  <span className="lv-player__data-badge">
                    {lang === 'ar' ? '⚡ يوفر 85% من باقة الإنترنت' : '⚡ 85% Data Saved'}
                  </span>
                  <button className="lv-player__fs-btn" onClick={togglePlayerFS} title="شاشة كاملة">
                    {isPlayerFS ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* ══ Player Scrubber & Controls ══ */}
            <div className="lv-controls">
              {/* Scrub Track */}
              <div
                className="lv-scrub"
                onClick={e => {
                  const r = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
                  seekTo(Math.round(pct * lesson.durationSec));
                }}
              >
                <div className="lv-scrub__track">
                  {lesson.chapters.map((c, i) => i > 0 && (
                    <div
                      key={c.id}
                      className="lv-scrub__mark"
                      style={{ left: `${(c.startSec / lesson.durationSec) * 100}%` }}
                      title={c.titleAr}
                    />
                  ))}
                  <div className="lv-scrub__fill" style={{ width: `${progress}%` }} />
                  <div className="lv-scrub__thumb" style={{ left: `${progress}%` }} />
                </div>
              </div>

              {/* Controls Row */}
              <div className="lv-controls__row">
                <div className="lv-controls__left">
                  <button className="lv-ctrl-btn" onClick={() => seekBy(-10)} title="-10s">
                    <RotateCcw size={16} />
                  </button>
                  <button className="lv-ctrl-btn" onClick={() => seekBy(10)} title="+10s">
                    <FastForward size={16} />
                  </button>
                  <div className="lv-time">
                    <span className="lv-time__curr">{fmt(currentTime)}</span>
                    <span className="lv-time__sep">/</span>
                    <span className="lv-time__tot">{lesson.durationFmt}</span>
                  </div>
                </div>

                {/* Primary Play Button */}
                <button
                  className="lv-play-btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                  title={isPlaying ? 'إيقاف' : 'تشغيل'}
                >
                  {isPlaying ? (
                    <Pause size={19} />
                  ) : (
                    <Play size={19} fill="currentColor" style={{ marginInlineStart: '2px' }} />
                  )}
                </button>

                <div className="lv-controls__right">
                  {/* Mute / Volume */}
                  <button
                    className="lv-ctrl-btn"
                    onClick={() => setIsMuted(!isMuted)}
                    title={isMuted ? 'إلغاء الكتم' : 'كتم'}
                  >
                    {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={e => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="lv-vol"
                    title="مستوى الصوت"
                  />

                  {/* Playback Speed */}
                  <select
                    value={speed}
                    onChange={e => setSpeed(parseFloat(e.target.value))}
                    className="lv-speed"
                    title="سرعة التشغيل"
                  >
                    {[0.75, 1, 1.25, 1.5, 1.75, 2].map(s => (
                      <option key={s} value={s}>{s === 1 ? '1.0x' : `${s}x`}</option>
                    ))}
                  </select>

                  {/* Mobile Landscape Quick Switcher */}
                  <button
                    className="lv-ctrl-btn lv-mobile-rot-btn mobile-only"
                    onClick={toggleLandscape}
                    title="تشغيل بالعرض (Landscape)"
                  >
                    <RotateCw size={15} />
                  </button>

                  {/* Adaptive Media Switcher (Video vs Audio) */}
                  <button
                    className={`lv-ctrl-btn lv-mode-toggle ${mediaMode === 'audio' ? 'active' : ''}`}
                    onClick={() => setMediaMode(m => m === 'video' ? 'audio' : 'video')}
                    title={mediaMode === 'video' ? 'التحويل للاستماع الصوتي (Podcast)' : 'التحويل للفيديو'}
                  >
                    {mediaMode === 'video' ? <Headphones size={16} /> : <Video size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ══ LESSON HEADER (Clean, Professional, Exactly Matching Reference) ══ */}
          <div className="lv-info">
            <div className="lv-info__header">
              {/* Right Side in RTL: Title, Meta, and Description */}
              <div className="lv-info__main">
                <h1 className="lv-info__title">{lesson.titleAr}</h1>

                <div className="lv-info__meta">
                  <div className="lv-info__teacher">
                    <img src={courseInfo.teacherImg} alt={courseInfo.teacherAr} className="lv-info__avatar" />
                    <span>{courseInfo.teacherAr}</span>
                  </div>
                  <span className="lv-info__dot">•</span>
                  <div className="lv-info__duration">
                    <Clock size={13} />
                    <span>{lesson.durationFmt.replace(':', ' دقيقة و ')} ثانية</span>
                  </div>
                  <span className="lv-info__dot">•</span>
                  <span className="lv-info__badge">{courseInfo.subjectAr}</span>
                  {isCompleted && (
                    <span className="lv-info__status-pill completed">
                      <CheckCircle2 size={12} />
                      <span>{lang === 'ar' ? 'مكتملة' : 'Completed'}</span>
                    </span>
                  )}
                </div>

                <p className="lv-info__desc">{lesson.descAr}</p>
              </div>

              {/* Left Side in RTL: Action Buttons (With Universal Confirmation) */}
              <div className="lv-info__actions">
                <button
                  className={`lv-info__complete-btn ${isCompleted ? 'completed' : ''}`}
                  onClick={handleCompleteButtonClick}
                  title={isCompleted ? 'إلغاء الإتمام' : 'تحديد كمكتمل'}
                >
                  <CheckCircle2 size={16} />
                  <span>{isCompleted ? (lang === 'ar' ? 'مكتمل بنجاح' : 'Completed') : (lang === 'ar' ? 'تحديد كمكتمل' : 'Mark Complete')}</span>
                </button>

                <button
                  className="lv-info__summary-btn"
                  onClick={handleSummaryClick}
                  title="تحميل ملخص الحصة"
                >
                  <Download size={15} />
                  <span>{lang === 'ar' ? 'تحميل الملخص (PDF)' : 'Summary PDF'}</span>
                </button>

                <button
                  className={`lv-info__bm-btn ${isBookmarked ? 'active' : ''}`}
                  onClick={handleBookmarkClick}
                  title="حفظ للمراجعة اللاحقة"
                >
                  {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* ══ TABS NAVIGATION ══ */}
          <div className="lv-tabs">
            <div className="lv-tabs__header" role="tablist">
              {tabs.map(t => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={isActive}
                    className={`lv-tabs__btn ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(t.id);
                      if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                        setMobileSubpage(t.id);
                      }
                    }}
                  >
                    <Icon size={16} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Desktop Tabs Body */}
            <div className="lv-tabs__body lv-tabs__body--desktop-only">
              {renderTabContent(activeTab)}
            </div>

            {/* Mobile Dedicated Page Quick-Open Banner */}
            <div className="lv-mobile-open-banner">
              <div className="lv-mobile-open-banner__info">
                <div className="lv-mobile-open-banner__icon">
                  {(() => {
                    const curr = tabs.find(t => t.id === activeTab);
                    const TabIcon = curr ? curr.icon : FileText;
                    return <TabIcon size={18} />;
                  })()}
                </div>
                <div className="lv-mobile-open-banner__text">
                  <span className="lv-mobile-open-banner__title">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </span>
                  <span className="lv-mobile-open-banner__sub">
                    {lang === 'ar' ? 'عرض مستقل بملء الشاشة لراحة أكبر وبدون تشتيت' : 'Distraction-free full screen view'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="lv-mobile-open-banner__btn"
                onClick={() => setMobileSubpage(activeTab)}
              >
                <span>{lang === 'ar' ? 'فتح في صفحة مخصصة' : 'Open Full Page'}</span>
                {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
              </button>
            </div>
          </div>
        </main>

        {/* ─── RIGHT COLUMN: Course Playlist Sidebar ─── */}
        <aside className="lv-sidebar">

          {/* ══════════ "درس اليوم" CARD (Exact Match to User Image 2) ══════════ */}
          <div className="lv-today-card">
            {/* Header: Calendar Icon + Title + Subtitle */}
            <div className="lv-today-card__head">
              <div className="lv-today-card__title-row">
                <h3 className="lv-today-card__title">
                  {lang === 'ar' ? 'درس اليوم' : 'Today’s Lesson'}
                </h3>
                <div className="lv-today-card__icon-wrap">
                  <Calendar size={18} />
                </div>
              </div>
              <p className="lv-today-card__subtitle">
                {lang === 'ar' ? 'أكمل تقدمك في هذا الدرس' : 'Continue your progress in this lesson'}
              </p>
            </div>

            {/* Circular Progress Donut Section */}
            <div className="lv-today-card__gauge-row">
              {/* Radial Donut SVG */}
              <div className="lv-today-card__circle-wrap">
                <svg width="84" height="84" viewBox="0 0 84 84">
                  {/* Background Track */}
                  <circle
                    cx="42"
                    cy="42"
                    r={donutRadius}
                    fill="transparent"
                    stroke="var(--border-subtle)"
                    strokeWidth="7"
                  />
                  {/* Green Progress Stroke */}
                  <circle
                    cx="42"
                    cy="42"
                    r={donutRadius}
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="7"
                    strokeDasharray={donutCircumference}
                    strokeDashoffset={donutDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 42 42)"
                    style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                  />
                </svg>
                <div className="lv-today-card__circle-text">
                  <span>{donutProgressVal}%</span>
                </div>
              </div>

              {/* Progress Text Info */}
              <div className="lv-today-card__gauge-info">
                <h4 className="lv-today-card__status-title">
                  {isCompleted
                    ? (lang === 'ar' ? 'تم إكمال الدرس' : 'Lesson Completed')
                    : (lang === 'ar' ? 'تم إكمال الدرس' : 'Lesson Progress')}
                </h4>
                <p className="lv-today-card__remaining-time">
                  {lang === 'ar'
                    ? `الوقت المتبقي: ${fmt(remainingSec)} دقيقة`
                    : `Time Remaining: ${fmt(remainingSec)} min`}
                </p>
              </div>
            </div>

            {/* Interactive Checklist Box */}
            <div className="lv-today-card__checklist">
              {/* Item 1: مشاهدة الفيديو */}
              <div
                className="lv-today-card__check-item"
                onClick={() => toggleChecklistItem('watchVideo')}
              >
                <span className="lv-today-card__check-label">
                  {lang === 'ar' ? 'مشاهدة الفيديو' : 'Watch Video'}
                </span>
                <span className={`lv-today-card__check-icon ${lessonChecklist.watchVideo ? 'checked' : ''}`}>
                  {lessonChecklist.watchVideo ? <CheckCircle2 size={17} /> : <Circle size={17} />}
                </span>
              </div>

              {/* Item 2: مراجعة الملاحظات */}
              <div
                className="lv-today-card__check-item"
                onClick={() => toggleChecklistItem('reviewNotes')}
              >
                <span className="lv-today-card__check-label">
                  {lang === 'ar' ? 'مراجعة الملاحظات' : 'Review Notes'}
                </span>
                <span className={`lv-today-card__check-icon ${lessonChecklist.reviewNotes ? 'checked' : ''}`}>
                  {lessonChecklist.reviewNotes ? <CheckCircle2 size={17} /> : <Circle size={17} />}
                </span>
              </div>

              {/* Item 3: حل الأسئلة */}
              <div
                className="lv-today-card__check-item"
                onClick={() => toggleChecklistItem('solveQuestions')}
              >
                <span className="lv-today-card__check-label">
                  {lang === 'ar' ? 'حل الأسئلة' : 'Solve Questions'}
                </span>
                <span className={`lv-today-card__check-icon ${lessonChecklist.solveQuestions ? 'checked' : ''}`}>
                  {lessonChecklist.solveQuestions ? <CheckCircle2 size={17} /> : <Circle size={17} />}
                </span>
              </div>

              {/* Item 4: إكمال مصادر إضافية */}
              <div
                className="lv-today-card__check-item"
                onClick={() => toggleChecklistItem('completeMaterials')}
              >
                <span className="lv-today-card__check-label">
                  {lang === 'ar' ? 'إكمال مصادر إضافية' : 'Supplementary Materials'}
                </span>
                <span className={`lv-today-card__check-icon ${lessonChecklist.completeMaterials ? 'checked' : ''}`}>
                  {lessonChecklist.completeMaterials ? <CheckCircle2 size={17} /> : <Circle size={17} />}
                </span>
              </div>
            </div>

            {/* Prominent CTA Button: متابعة الدرس ▶ */}
            <button
              className="lv-today-card__btn"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <span>{isPlaying ? (lang === 'ar' ? 'إيقاف مؤقت' : 'Pause') : (lang === 'ar' ? 'متابعة الدرس' : 'Resume Lesson')}</span>
              {isPlaying ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
            </button>
          </div>

          {/* ══════════ COURSE PLAYLIST ITEMS (Matching User Image 2 Request) ══════════ */}
          <div className="lv-sidebar__playlist-box">
            <div className="lv-sidebar__head">
              <div className="lv-sidebar__title-row">
                <h3 className="lv-sidebar__title">{lang === 'ar' ? 'محتوى الدورة' : 'Course Content'}</h3>
                {/* Course Completion Percentage Badge Requested by User */}
                <span className="lv-sidebar__pct-badge">{courseCompletionPct}%</span>
              </div>

              <span className="lv-sidebar__progress-text">
                {completedCount} {lang === 'ar' ? `من أصل ${playlist.length} درساً مكتمل` : `of ${playlist.length} done`}
              </span>
            </div>

            {/* Visual Progress Bar for the Course */}
            <div className="lv-sidebar__bar">
              <div
                className="lv-sidebar__bar-fill"
                style={{ width: `${courseCompletionPct}%` }}
              />
            </div>

            {/* Playlist List */}
            <div className="lv-playlist">
              {playlist.map((item, i) => (
                <div
                  key={item.id}
                  className={`lv-playlist__item ${item.active ? 'active' : ''} ${item.completed ? 'done' : ''}`}
                  style={{ animationDelay: `${i * 0.04}s` }}
                  onClick={() => handlePlaylistLessonClick(item)}
                >
                  <div className="lv-playlist__icon">
                    {item.completed ? (
                      <CheckCircle2 size={16} />
                    ) : item.active ? (
                      <Play size={13} fill="currentColor" />
                    ) : (
                      <Circle size={14} />
                    )}
                  </div>

                  <div className="lv-playlist__body">
                    <div className="lv-playlist__top-line">
                      <span className="lv-playlist__num">.{i + 1}</span>
                      <span className="lv-playlist__title">{item.titleAr}</span>
                    </div>
                    <span className="lv-playlist__time">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ══════════ MOBILE FLOATING PLAYLIST TRIGGER ══════════ */}
      <div className="lv-mobile-bar mobile-only">
        <button
          className="lv-mobile-bar__btn"
          onClick={() => setMobilePlaylistOpen(true)}
        >
          <BookOpen size={16} />
          <span>{lang === 'ar' ? 'محتوى الدورة' : 'Course Content'}</span>
          <span className="lv-mobile-bar__count">{courseCompletionPct}%</span>
        </button>
      </div>

      {/* ══════════ MOBILE PLAYLIST DRAWER ══════════ */}
      {mobilePlaylistOpen && (
        <div className="lv-mobile-drawer-overlay mobile-only" onClick={() => setMobilePlaylistOpen(false)}>
          <div className="lv-mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="lv-mobile-drawer__head">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>
                    {lang === 'ar' ? 'محتوى الدورة' : 'Course Content'}
                  </h3>
                  <span className="lv-sidebar__pct-badge">{courseCompletionPct}%</span>
                </div>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  {completedCount} {lang === 'ar' ? `من أصل ${playlist.length} درساً مكتمل` : `of ${playlist.length} done`}
                </span>
              </div>
              <button className="lv-km__action" onClick={() => setMobilePlaylistOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="lv-playlist" style={{ maxHeight: '60vh' }}>
              {playlist.map((item, i) => (
                <div
                  key={item.id}
                  className={`lv-playlist__item ${item.active ? 'active' : ''} ${item.completed ? 'done' : ''}`}
                  onClick={() => handlePlaylistLessonClick(item)}
                >
                  <div className="lv-playlist__icon">
                    {item.completed ? <CheckCircle2 size={16} /> : item.active ? <Play size={13} fill="currentColor" /> : <Circle size={14} />}
                  </div>
                  <div className="lv-playlist__body">
                    <div className="lv-playlist__top-line">
                      <span className="lv-playlist__num">.{i + 1}</span>
                      <span className="lv-playlist__title">{item.titleAr}</span>
                    </div>
                    <span className="lv-playlist__time">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════ UNIVERSAL ANIMATED CONFIRMATION MODAL ══════════ */}
      {confirmDialog.open && (
        <div className="lv-modal-bg" onClick={() => setConfirmDialog(p => ({ ...p, open: false }))}>
          <div className="lv-modal lv-modal--confirm animate-pop" onClick={e => e.stopPropagation()}>
            <div className={`lv-modal__icon lv-modal__icon--${confirmDialog.confirmColor}`}>
              {confirmDialog.confirmColor === 'emerald' ? (
                <CheckCircle2 size={34} />
              ) : confirmDialog.confirmColor === 'amber' ? (
                <RotateCcw size={34} />
              ) : confirmDialog.confirmColor === 'rose' ? (
                <Trash2 size={34} />
              ) : (
                <Sparkles size={34} />
              )}
            </div>

            <h3 className="lv-modal__title">{confirmDialog.title}</h3>
            <p className="lv-modal__desc">{confirmDialog.message}</p>

            <div className="lv-modal__buttons lv-modal__buttons--row">
              <button
                className={`lv-modal__action-btn lv-modal__action-btn--${confirmDialog.confirmColor}`}
                onClick={handleConfirmAction}
              >
                {confirmDialog.confirmText}
              </button>
              <button
                className="lv-modal__secondary"
                onClick={() => setConfirmDialog(p => ({ ...p, open: false }))}
              >
                {confirmDialog.cancelText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ LESSON COMPLETION CELEBRATION MODAL ══════════ */}
      {showCelebrationModal && (
        <div className="lv-modal-bg" onClick={() => setShowCelebrationModal(false)}>
          <div className="lv-modal animate-pop" onClick={e => e.stopPropagation()}>
            <div className="lv-modal__icon lv-modal__icon--emerald"><Award size={38} /></div>
            <div className="lv-modal__xp">+50 XP مكتسبة</div>
            <h3 className="lv-modal__title">{lang === 'ar' ? 'أحسنت يا بطل! أتممت الحصة' : 'Outstanding Achievement!'}</h3>
            <p className="lv-modal__desc">
              {lang === 'ar'
                ? `تم تحديث نسبة إنجازك في مادة ${courseInfo.subjectAr}. يمكنك الآن تثبيت معلوماتك بحل كويز فوري أو الاستمرار في الحصة التالية.`
                : 'Your curriculum progress has been updated! Test your knowledge now or continue.'}
            </p>
            <div className="lv-modal__buttons">
              <button
                className="lv-modal__primary"
                onClick={() => {
                  setShowCelebrationModal(false);
                  navigate('/student/quiz');
                }}
              >
                {lang === 'ar' ? 'حل كويز تثبيت الفهم' : 'Take Practice Quiz'}
              </button>
              <button
                className="lv-modal__secondary"
                onClick={() => setShowCelebrationModal(false)}
              >
                {lang === 'ar' ? 'متابعة المذاكرة هنا' : 'Stay Here'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ DEDICATED FULL-SCREEN MOBILE SUBPAGE ══════════ */}
      {mobileSubpage && (
        <div className="lv-mobile-subpage" role="dialog" aria-modal="true">
          {/* Top Bar */}
          <div className="lv-mobile-subpage__header">
            <button
              type="button"
              className="lv-mobile-subpage__back-btn"
              onClick={() => setMobileSubpage(null)}
              title={lang === 'ar' ? 'العودة للحصة' : 'Back to Lesson'}
            >
              {isRtl ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
              <span>{lang === 'ar' ? 'العودة للحصة' : 'Back to Lesson'}</span>
            </button>

            <div className="lv-mobile-subpage__title">
              {(() => {
                const currentT = tabs.find(t => t.id === mobileSubpage);
                if (!currentT) return null;
                const TabIcon = currentT.icon;
                return (
                  <>
                    <TabIcon size={16} />
                    <span>{currentT.label}</span>
                  </>
                );
              })()}
            </div>

            <button
              type="button"
              className="lv-mobile-subpage__close-btn"
              onClick={() => setMobileSubpage(null)}
              title={lang === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Tab Switcher Strip */}
          <div className="lv-mobile-subpage__pills">
            {tabs.map(t => {
              const Icon = t.icon;
              const isActive = mobileSubpage === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`lv-mobile-subpage__pill ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setMobileSubpage(t.id);
                    setActiveTab(t.id);
                  }}
                >
                  <Icon size={14} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scrollable Subpage Body */}
          <div className="lv-mobile-subpage__body">
            {renderTabContent(mobileSubpage)}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLessonView;
