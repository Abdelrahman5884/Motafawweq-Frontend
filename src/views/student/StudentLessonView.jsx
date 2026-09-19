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
  PanelRightClose, PanelRightOpen, AlertCircle, ChevronLeft
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   World-Class Student Lesson Study Workspace
   Matching Reference Layout with:
   - Clean 2-column layout (content + collapsible playlist)
   - Collapsible & expandable course content playlist
   - In-header action buttons with smooth confirmation dialogs
   - NotebookLM Interactive Knowledge Map with Fullscreen
   - Adaptive video / audio single player with real fullscreen
   - Fully responsive & adaptive for mobile phones and tablets
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

  // ─── Collapsible Course Content Sidebar ───────────────────
  const [isPlaylistCollapsed, setIsPlaylistCollapsed] = useState(false);
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

  // Statuses
  const isCompleted = !!lessonStatuses[activeLessonId];
  const [isBookmarked, setIsBookmarked] = useState(() =>
    localStorage.getItem(`mtfq_bm_${activeLessonId}`) === 'true'
  );
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  // ─── Confirmation Modal State ─────────────────────────────
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null, // 'complete' | 'uncomplete' | 'delete_note'
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    confirmColor: 'primary',
    payload: null
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState('notes');

  // NotebookLM Knowledge Map State
  const [showKM, setShowKM] = useState(false);
  const [isKMFS, setIsKMFS] = useState(false);
  const [expandedConcept, setExpandedConcept] = useState(2);
  const [masteredConcepts, setMasteredConcepts] = useState({ 1: true });

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

  // ─── Playlist Array ───────────────────────────────────────
  const playlist = Object.keys(lessonsDatabase).map(key => ({
    id: key,
    titleAr: lessonsDatabase[key].titleAr,
    time: lessonsDatabase[key].time,
    completed: !!lessonStatuses[key],
    active: key === activeLessonId
  }));

  const completedCount = playlist.filter(l => l.completed).length;
  const currentCh = lesson.chapters.find(c => currentTime >= c.startSec && currentTime < c.endSec) || lesson.chapters[0];
  const progress = Math.min(100, Math.max(0, ((currentTime / lesson.durationSec) * 100))).toFixed(1);

  // ─── Lesson Switching ─────────────────────────────────────
  const switchLesson = (lid) => {
    setActiveLessonId(lid);
    setIsPlaying(false);
    const s = localStorage.getItem(`mtfq_pos_${lid}`);
    setCurrentTime(s ? parseInt(s, 10) : 0);
    setIsBookmarked(localStorage.getItem(`mtfq_bm_${lid}`) === 'true');
    setMobilePlaylistOpen(false);
  };

  // ─── Playback Tick ────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    const iv = setInterval(() => {
      setCurrentTime(p => {
        if (p >= lesson.durationSec) {
          setIsPlaying(false);
          return lesson.durationSec;
        }
        const n = p + 1;
        localStorage.setItem(`mtfq_pos_${activeLessonId}`, n.toString());
        return n;
      });
    }, 1000 / speed);
    return () => clearInterval(iv);
  }, [isPlaying, speed, lesson.durationSec, activeLessonId]);

  // ─── Keyboard Shortcuts ───────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(p => !p);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seekBy(isRtl ? -10 : 10);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seekBy(isRtl ? 10 : -10);
      } else if (e.code === 'KeyM') {
        setIsMuted(m => !m);
      } else if (e.code === 'Escape') {
        setShowKM(false);
        setIsKMFS(false);
        setConfirmDialog(p => ({ ...p, open: false }));
        setShowCelebrationModal(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isRtl]);

  // ─── Fullscreen Event Listener ────────────────────────────
  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) {
        setIsPlayerFS(false);
        setIsKMFS(false);
      }
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // ─── Playback Actions ─────────────────────────────────────
  const seekBy = (s) => {
    setCurrentTime(p => {
      const n = Math.max(0, Math.min(lesson.durationSec, p + s));
      localStorage.setItem(`mtfq_pos_${activeLessonId}`, n.toString());
      return n;
    });
  };

  const seekTo = (s) => {
    setCurrentTime(s);
    localStorage.setItem(`mtfq_pos_${activeLessonId}`, s.toString());
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // ─── Confirmation Handlers ────────────────────────────────
  const handleCompleteButtonClick = () => {
    if (isCompleted) {
      // Prompt for uncomplete confirmation
      setConfirmDialog({
        open: true,
        type: 'uncomplete',
        title: lang === 'ar' ? 'إلغاء تحديد إتمام الحصة' : 'Reset Completion',
        message: lang === 'ar'
          ? `هل ترغب في إعادة تعيين حالة درس "${lesson.titleAr}" إلى غير مكتمل لمتابعة المذاكرة من جديد؟`
          : 'Do you want to reset this lesson status to uncompleted?',
        confirmText: lang === 'ar' ? 'نعم، إعادة التعيين' : 'Yes, Reset',
        cancelText: lang === 'ar' ? 'تراجع' : 'Cancel',
        confirmColor: 'amber',
        payload: null
      });
    } else {
      // Prompt for completion confirmation with enthusiasm
      setConfirmDialog({
        open: true,
        type: 'complete',
        title: lang === 'ar' ? 'تأكيد إتمام الحصة التعليمية' : 'Complete Lesson',
        message: lang === 'ar'
          ? `هل أتممت استيعاب ومذاكرة "${lesson.titleAr}"؟ سيتم تسجيل إنجازك ومنحك +50 نقطة خبرة XP!`
          : 'Confirm that you finished studying this lesson? You will earn +50 XP!',
        confirmText: lang === 'ar' ? 'نعم، أتممت الحصة والحمد لله 🎉' : 'Yes, Complete! 🎉',
        cancelText: lang === 'ar' ? 'متابعة المذاكرة' : 'Keep Studying',
        confirmColor: 'emerald',
        payload: null
      });
    }
  };

  const handleDeleteNoteClick = (note) => {
    setConfirmDialog({
      open: true,
      type: 'delete_note',
      title: lang === 'ar' ? 'تأكيد حذف الملاحظة' : 'Delete Note',
      message: lang === 'ar'
        ? `هل أنت متأكد من رغبتك في حذف الملاحظة المسجلة عند التوقيت (${note.ts})؟ لا يمكن التراجع عن هذا الإجراء.`
        : `Are you sure you want to delete note at (${note.ts})?`,
      confirmText: lang === 'ar' ? 'تأكيد الحذف' : 'Delete',
      cancelText: lang === 'ar' ? 'إلغاء' : 'Cancel',
      confirmColor: 'rose',
      payload: note.id
    });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.type === 'complete') {
      const nextStatuses = { ...lessonStatuses, [activeLessonId]: true };
      setLessonStatuses(nextStatuses);
      localStorage.setItem('mtfq_lesson_statuses', JSON.stringify(nextStatuses));
      setConfirmDialog(p => ({ ...p, open: false }));
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
        });
      } catch (e) {}
      setShowCelebrationModal(true);
    } else if (confirmDialog.type === 'uncomplete') {
      const nextStatuses = { ...lessonStatuses, [activeLessonId]: false };
      setLessonStatuses(nextStatuses);
      localStorage.setItem('mtfq_lesson_statuses', JSON.stringify(nextStatuses));
      setConfirmDialog(p => ({ ...p, open: false }));
    } else if (confirmDialog.type === 'delete_note') {
      setNotes(notes.filter(x => x.id !== confirmDialog.payload));
      setConfirmDialog(p => ({ ...p, open: false }));
    }
  };

  const toggleBookmark = () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    localStorage.setItem(`mtfq_bm_${activeLessonId}`, next.toString());
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

  // ─── Tab Configuration ────────────────────────────────────
  const tabs = [
    { id: 'notes', label: lang === 'ar' ? 'ملاحظات الدرس' : 'Lesson Notes', icon: Sparkles, badge: notes.length },
    { id: 'questions', label: lang === 'ar' ? 'الأسئلة والأجوبة' : 'Q&A', icon: HelpCircle, badge: questions.length },
    { id: 'materials', label: lang === 'ar' ? 'المصادر الإضافية' : 'Materials', icon: FileText, badge: attachments.length },
  ];

  return (
    <div className="lv">
      {/* ── Feedback Toast ── */}
      {dlToast && (
        <div className="lv-toast">
          <CheckCircle2 size={16} />
          <span>{lang === 'ar' ? `تم تحميل "${dlToast}" بنجاح` : `Downloaded "${dlToast}"`}</span>
        </div>
      )}

      {/* ══════════ BREADCRUMB & CONTROLS BAR ══════════ */}
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

        {/* Collapsed Playlist Re-open Button */}
        {isPlaylistCollapsed && (
          <button
            className="lv-playlist-expand-btn desktop-only"
            onClick={() => setIsPlaylistCollapsed(false)}
            title="إظهار محتوى الدورة"
          >
            <BookOpen size={15} />
            <span>{lang === 'ar' ? 'محتوى الدورة' : 'Course Content'}</span>
            <span className="lv-playlist-expand-badge">{completedCount}/{playlist.length}</span>
            <PanelRightOpen size={15} />
          </button>
        )}
      </div>

      {/* ══════════ MAIN 2-COLUMN LAYOUT ══════════ */}
      <div className={`lv-layout ${isPlaylistCollapsed ? 'lv-layout--collapsed' : ''}`}>

        {/* ─── MAIN COLUMN: Content Area ─── */}
        <main className="lv-content">

          {/* ══ MEDIA PLAYER ══ */}
          <div className={`lv-player ${isPlayerFS ? 'lv-player--fs' : ''}`} ref={playerRef}>
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

                {/* Fullscreen Button */}
                <button
                  className="lv-player__fs-btn"
                  onClick={togglePlayerFS}
                  title={isPlayerFS ? 'إنهاء وضع الشاشة الكاملة' : 'شاشة كاملة'}
                >
                  {isPlayerFS ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
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

              {/* Left Side in RTL: Action Buttons */}
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
                  onClick={() => handleDL({ id: 'summary', titleAr: courseInfo.summaryPdf })}
                  title="تحميل ملخص الحصة"
                >
                  <Download size={15} />
                  <span>{lang === 'ar' ? 'تحميل الملخص (PDF)' : 'Summary PDF'}</span>
                </button>

                <button
                  className={`lv-info__bm-btn ${isBookmarked ? 'active' : ''}`}
                  onClick={toggleBookmark}
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
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={activeTab === t.id}
                    className={`lv-tabs__btn ${activeTab === t.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(t.id)}
                  >
                    <Icon size={15} />
                    <span>{t.label}</span>
                    {t.badge > 0 && <span className="lv-tabs__badge">{t.badge}</span>}
                  </button>
                );
              })}
            </div>

            <div className="lv-tabs__body">
              {/* ── TAB 1: NOTES ── */}
              {activeTab === 'notes' && (
                <div className="lv-notes">
                  <div className="lv-notes__head">
                    <div className="lv-notes__title-group">
                      <h3 className="lv-notes__heading">{lang === 'ar' ? 'مفكرة الطالب' : 'Student Notebook'}</h3>
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

              {/* ── TAB 2: QUESTIONS ── */}
              {activeTab === 'questions' && (
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
                          onClick={() => setSavedQ(p => ({ ...p, [q.id]: !p[q.id] }))}
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

              {/* ── TAB 3: MATERIALS ── */}
              {activeTab === 'materials' && (
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
                        onClick={() => handleDL(a)}
                        disabled={dlId === a.id}
                      >
                        <Download size={14} />
                        <span>{dlId === a.id ? (lang === 'ar' ? 'جاري التحميل...' : 'Downloading...') : (lang === 'ar' ? 'تحميل' : 'Download')}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ─── RIGHT COLUMN: Course Playlist Sidebar (Collapsible) ─── */}
        {!isPlaylistCollapsed && (
          <aside className="lv-sidebar">
            {/* Header */}
            <div className="lv-sidebar__head">
              <div>
                <h3 className="lv-sidebar__title">{lang === 'ar' ? 'محتوى الدورة' : 'Course Content'}</h3>
                <span className="lv-sidebar__progress-text">
                  <span className="lv-sidebar__pct">{Math.round((completedCount / playlist.length) * 100)}%</span>
                  {' '}
                  {completedCount} {lang === 'ar' ? `من أصل ${playlist.length} درساً مكتمل` : `of ${playlist.length} done`}
                </span>
              </div>

              {/* Collapse Button */}
              <button
                className="lv-sidebar__collapse-btn desktop-only"
                onClick={() => setIsPlaylistCollapsed(true)}
                title={lang === 'ar' ? 'طي قائمة الحصص' : 'Collapse Playlist'}
              >
                <PanelRightClose size={16} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="lv-sidebar__bar">
              <div
                className="lv-sidebar__bar-fill"
                style={{ width: `${(completedCount / playlist.length) * 100}%` }}
              />
            </div>

            {/* Playlist Items */}
            <div className="lv-playlist">
              {playlist.map((item, i) => (
                <div
                  key={item.id}
                  className={`lv-playlist__item ${item.active ? 'active' : ''} ${item.completed ? 'done' : ''}`}
                  style={{ animationDelay: `${i * 0.04}s` }}
                  onClick={() => switchLesson(item.id)}
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

            {/* Knowledge Map Roadmap Button */}
            <button className="lv-km-btn" onClick={() => setShowKM(true)}>
              <Map size={17} />
              <span>{lang === 'ar' ? 'خارطة الطريق التعليمية' : 'Learning Roadmap'}</span>
            </button>
          </aside>
        )}
      </div>

      {/* ══════════ MOBILE FLOATING PLAYLIST TRIGGER ══════════ */}
      <div className="lv-mobile-bar mobile-only">
        <button
          className="lv-mobile-bar__btn"
          onClick={() => setMobilePlaylistOpen(true)}
        >
          <BookOpen size={16} />
          <span>{lang === 'ar' ? 'قائمة الحصص' : 'Playlist'}</span>
          <span className="lv-mobile-bar__count">{completedCount}/{playlist.length}</span>
        </button>

        <button
          className="lv-mobile-bar__btn lv-mobile-bar__btn--km"
          onClick={() => setShowKM(true)}
        >
          <Map size={16} />
          <span>{lang === 'ar' ? 'خريطة المفاهيم' : 'Roadmap'}</span>
        </button>
      </div>

      {/* ══════════ MOBILE PLAYLIST DRAWER ══════════ */}
      {mobilePlaylistOpen && (
        <div className="lv-mobile-drawer-overlay mobile-only" onClick={() => setMobilePlaylistOpen(false)}>
          <div className="lv-mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="lv-mobile-drawer__head">
              <div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>
                  {lang === 'ar' ? 'محتوى الدورة' : 'Course Content'}
                </h3>
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
                  onClick={() => switchLesson(item.id)}
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

      {/* ══════════ NOTEBOOKLM KNOWLEDGE MAP MODAL ══════════ */}
      {showKM && (
        <div className="lv-km-overlay" onClick={() => { setShowKM(false); setIsKMFS(false); }}>
          <div
            className={`lv-km ${isKMFS ? 'lv-km--fs' : ''}`}
            ref={kmRef}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="lv-km__header">
              <div className="lv-km__header-left">
                <div className="lv-km__header-icon"><Brain size={20} /></div>
                <div>
                  <h2 className="lv-km__title">
                    {lang === 'ar' ? 'خارطة الطريق التعليمية — خريطة المفاهيم (NotebookLM)' : 'Interactive Knowledge Roadmap'}
                  </h2>
                  <p className="lv-km__sub">
                    {courseInfo.subjectAr} • {lesson.titleAr}
                  </p>
                </div>
              </div>
              <div className="lv-km__header-actions">
                <button className="lv-km__action" onClick={toggleKMFS} title="شاشة كاملة">
                  {isKMFS ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button className="lv-km__action" onClick={() => { setShowKM(false); setIsKMFS(false); }} title="إغلاق">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Overall Lesson Progress */}
            <div className="lv-km__progress">
              <div className="lv-km__progress-bar">
                <div className="lv-km__progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="lv-km__progress-text">
                {progress}% {lang === 'ar' ? 'مكتمل من المعرفة التراكمية لهذه الحصة' : 'completed of this lesson roadmap'}
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
                    {/* Status indicator */}
                    <div className="lv-concept__status">
                      {isDone ? (
                        <CheckCircle2 size={18} />
                      ) : isCurrent ? (
                        <Play size={14} fill="currentColor" />
                      ) : (
                        <Lock size={14} />
                      )}
                    </div>

                    {/* Body */}
                    <div className="lv-concept__body">
                      <div className="lv-concept__head">
                        <span className="lv-concept__num">{lang === 'ar' ? `المحطة ${ch.id}` : `Node ${ch.id}`}</span>
                        <span className="lv-concept__time">{fmt(ch.startSec)} — {fmt(ch.endSec)}</span>
                      </div>
                      <h4 className="lv-concept__title">{ch.titleAr}</h4>

                      {/* Mini Progress */}
                      <div className="lv-concept__bar">
                        <div className="lv-concept__bar-fill" style={{ width: `${chProgress}%` }} />
                      </div>

                      {/* Expanded Details */}
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
                                setShowKM(false);
                                setIsPlaying(true);
                              }}
                            >
                              <Play size={12} fill="currentColor" />
                              <span>{lang === 'ar' ? `انتقل لهذا الجزء في الحصة (${fmt(ch.startSec)})` : `Jump to ${fmt(ch.startSec)}`}</span>
                            </button>

                            <button
                              className={`lv-concept__mastery ${isMastered ? 'mastered' : ''}`}
                              onClick={() => setMasteredConcepts(p => ({ ...p, [ch.id]: !p[ch.id] }))}
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
          </div>
        </div>
      )}

      {/* ══════════ ANIMATED CONFIRMATION MODAL ("الموافقة وكدا") ══════════ */}
      {confirmDialog.open && (
        <div className="lv-modal-bg" onClick={() => setConfirmDialog(p => ({ ...p, open: false }))}>
          <div className="lv-modal lv-modal--confirm animate-pop" onClick={e => e.stopPropagation()}>
            <div className={`lv-modal__icon lv-modal__icon--${confirmDialog.confirmColor}`}>
              {confirmDialog.confirmColor === 'emerald' ? (
                <CheckCircle2 size={34} />
              ) : confirmDialog.confirmColor === 'amber' ? (
                <RotateCcw size={34} />
              ) : (
                <Trash2 size={34} />
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
    </div>
  );
};
export default StudentLessonView;
