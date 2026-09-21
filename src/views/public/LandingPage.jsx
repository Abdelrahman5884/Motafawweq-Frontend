import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  Mic,
  FileText,
  Share2,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Play,
  Star,
  TrendingUp,
  ShieldCheck,
  Users,
  Zap,
  Brain,
  Layers,
  Award,
  ChevronRight,
  ChevronDown,
  Clock,
  GraduationCap,
  Building2,
  Check,
  CreditCard,
  HelpCircle,
  Smartphone,
  Laptop,
  Compass,
  FileCheck,
  CheckCheck,
  Shield,
  BarChart3,
  ExternalLink,
  Trophy
} from 'lucide-react';

import { PlexusBackground } from '../../components/common/PlexusBackground';
import { SpiderManWeb } from '../../components/common/SpiderManWeb';
import { MonthlyChampionsSlider } from '../../components/landing/MonthlyChampionsSlider';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const { lang, t, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const [activePipelineStep, setActivePipelineStep] = useState(2); // default Knowledge Map
  const [openFaqIndex, setOpenFaqIndex] = useState(0); // first FAQ open by default

  const pipelineSteps = [
    {
      id: 0,
      title: lang === 'ar' ? '1. تسجيل صوتي أو رفع' : '1. Record or Upload',
      subtitle: lang === 'ar' ? 'سجل حصتك حتى 90 دقيقة بنقاء فائق وعزل للضوضاء' : 'Live mic or upload lesson audio up to 90 mins',
      icon: Mic,
      color: 'var(--primary, #1588C7)',
      badge: lang === 'ar' ? 'المدخل الصوتي المباشر' : 'Live Audio Input',
      headline: lang === 'ar' ? 'حصة الأحياء: البناء الضوئي وحركية الطاقة' : 'Biology: Photosynthesis & Energy Dynamics',
      desc: lang === 'ar' ? 'تسجيل مباشر بصوت المعلم مع خوارزمية تنقية وعزل ضوضاء القاعات المدرسية وسنتر الدروس.' : 'Direct classroom recording with Egyptian classroom noise suppression.'
    },
    {
      id: 1,
      title: lang === 'ar' ? '2. تفريغ نصي دقيق' : '2. Synced Transcript',
      subtitle: lang === 'ar' ? 'تفريغ فوري مدرب على اللهجة المصرية والمصطلحات العلمية' : 'Whisper AI tuned for Egyptian dialect & scientific terms',
      icon: FileText,
      color: '#38BDF8',
      badge: lang === 'ar' ? 'تفريغ زمني بالثواني' : 'Timestamped AI',
      headline: '[05:20] التفاعلات الضوئية وانشطار جزيء الماء H2O',
      desc: lang === 'ar' ? 'كل كلمة مربوطة بلحظتها الزمنية بدقة أجزاء من الثانية. اضغط على أي جملة في الملخص لتسمع شرح المعلم لها فوراً.' : 'Every sentence is hyperlinked to exact audio milliseconds. Click any word to jump directly to that explanation.'
    },
    {
      id: 2,
      title: lang === 'ar' ? '3. خريطة معرفية تفاعلية' : '3. Concept Mind Map',
      subtitle: lang === 'ar' ? 'تنظيم الشرح في شبكة مفاهيمية ذكية تكشف العلاقات وروابط الامتحانات' : 'Interactive concept network with draggable nodes & deep links',
      icon: Share2,
      color: '#1588C7',
      badge: lang === 'ar' ? 'جوهر متفوّق' : 'The Motafawweq Flagship',
      headline: lang === 'ar' ? '14 مفهوماً علمياً مترابطاً ومربوطاً بالصوت والامتحانات' : '14 Interconnected Concepts Mapped in 3D',
      desc: lang === 'ar' ? 'تنظيم وترتيب المفاهيم الرئيسية والفرعية في شبكة بصرية واضحة، تكشف بدقة ترابط أجزاء المنهج ونقاط التركيز في الامتحانات.' : 'Extracts root and child concepts with mastery ratings, enabling non-linear revision and targeted diagnostics.'
    },
    {
      id: 3,
      title: lang === 'ar' ? '4. ملخص كورنيل الدراسي' : '4. Cornell Summary',
      subtitle: lang === 'ar' ? 'ملاحظات هيكلية، مصطلحات أساسية، ومعادلات هامة' : 'Structured definitions, formulas & key takeaways',
      icon: Brain,
      color: '#10B981',
      badge: lang === 'ar' ? 'مذاكرة مركزة للثانوية' : 'Thanawya High-Yield Notes',
      headline: lang === 'ar' ? 'ملخص الحصة وفق معايير ونواتج تعلم الثانوية العامة' : 'Board Exam Focused Summary & Cheat Sheet',
      desc: lang === 'ar' ? 'تلخيص فوري يوفر على الطالب ساعات من تبييض المحاضرة، متضمناً أهم فخاخ وتريكات الامتحانات الوزارية.' : 'Instantly generates Cornell-style revision notes, highlighting common Thanawya exam traps.'
    },
    {
      id: 4,
      title: lang === 'ar' ? '5. توليد بنك الأسئلة' : '5. Auto Quiz Generator',
      subtitle: lang === 'ar' ? 'أسئلة بنظام البابل شيت وقياس مهارات التفكير العليا' : 'Adaptive MCQs with bloom taxonomy difficulty levels',
      icon: Zap,
      color: '#F59E0B',
      badge: lang === 'ar' ? 'تقييم ذكي متدرج' : 'Adaptive Assessment',
      headline: lang === 'ar' ? '15 سؤالاً تغطي كافة أجزاء الدرس بدرجات صعوبة متوازنة' : '15 Tailored Questions with Detailed Explanations',
      desc: lang === 'ar' ? 'صياغة أسئلة تفاعلية مستوحاة من كلام المدرس في الحصة، مع تعليلات فورية لكل إجابة ورابط للحظة الشرح.' : 'Formulates questions directly from spoken examples, with rationale and instant links back to the audio timestamp.'
    },
    {
      id: 5,
      title: lang === 'ar' ? '6. تشخيص نقاط الضعف' : '6. Learning Diagnostics',
      subtitle: lang === 'ar' ? 'تحديد دقيق للمفاهيم التي لم يستوعبها الطلاب لإعادة شرحها' : 'Real-time mastery tracking & automated review queues',
      icon: Award,
      color: '#06254E',
      badge: lang === 'ar' ? 'ذكاء تعليمي دقيق' : 'Actionable Insights',
      headline: lang === 'ar' ? 'دورة كالفن وإنتاج NADPH: نسبة الفهم 71%' : 'Calvin Cycle & NADPH: 71% Mastery Alert',
      desc: lang === 'ar' ? 'يرى المعلم بدقة أين يتعثر الطلاب قبل موعد الامتحان، ويرسل مراجعة دقيقة لـ 5 دقائق فقط.' : 'Reveals class bottlenecks before official exams, automatically sending targeted 5-minute refresher micro-lessons.'
    }
  ];

  const currentStep = pipelineSteps[activePipelineStep];

  const faqs = [
    {
      qAr: 'هل تدعم المنصة نظام امتحانات الثانوية العامة الجديد والبابل شيت؟',
      qEn: 'Does the platform support the new Egyptian Thanawya Amma bubble sheet exam system?',
      aAr: 'نعم تماماً. تم تصميم بنوك الأسئلة والاختبارات التفاعلية لتطابق نظام التقييم الوزاري المصري، بنظام أسئلة الاختيار من متعدد (MCQ) والبابل شيت، وقياس مهارات الفهم والتطبيق والتفكير العليا بدلاً من الحفظ والتلقين.',
      aEn: 'Yes absolutely. Question banks and interactive quizzes match the Egyptian ministry guidelines with MCQs, bubble sheets, and high-order thinking assessments.'
    },
    {
      qAr: 'كيف يستفيد المعلم من المنصة دون تغيير طريقة شرحه المعتادة؟',
      qEn: 'How does the teacher benefit without changing their usual teaching routine?',
      aAr: 'المعلم يشرح حصته كالمعتاد تماماً في الفصل أو السنتر ويسجلها عبر هاتفه أو ميكروفون الاستوديو. تتولى المنصة فوراً تحويل التسجيل إلى خريطة مفاهيمية، تفريغ نصي بالثواني، ملخص دراسي، وبنك أسئلة متكامل جاهز للطباعة أو الحل التفاعلي.',
      aEn: 'Teachers deliver their classes naturally. Simply record audio in class, and Motafawweq automatically generates mind maps, synchronized transcripts, Cornell notes, and quiz banks.'
    },
    {
      qAr: 'هل تعمل منصة متفوّق بسلاسة على الهاتف المحمول وتابلت الوزارة؟',
      qEn: 'Does Motafawweq work smoothly on mobile phones and Egyptian Ministry tablets?',
      aAr: 'نعم، تم تطوير واجهة متفوّق بتقنيات استجابة سريعة جداً وخفيفة على باقة الإنترنت، وتعمل بكفاءة تامة على متصفح تابلت الثانوية العامة، والهواتف الذكية بنظامي أندرويد و iOS وأجهزة الكمبيوتر.',
      aEn: 'Yes, the responsive web interface is optimized for low data usage and runs flawlessly on ministry tablets, iOS, Android, and desktop browsers.'
    },
    {
      qAr: 'كيف يتابع ولي الأمر حضور ابنه ومستواه الحقيقي؟',
      qEn: 'How do parents monitor their student attendance and genuine progress?',
      aAr: 'توفر المنصة بوابة مخصصة لأولياء الأمور تعرض نسب حضور الحصص، حل التدريبات، ودرجات الامتحانات، بالإضافة إلى تقرير بياني يحدد بدقة الدروس والمفاهيم التي أتقنها الطالب وتلك التي تحتاج لمراجعة إضافية.',
      aEn: 'Parents have a dedicated dashboard showing lesson completion, weekly test results, and clear diagnostic reports detailing mastered and struggling topics.'
    },
    {
      qAr: 'هل يتعرف نظام الصوت على اللهجة المصرية والمصطلحات الدارجة في السنتر؟',
      qEn: 'Does the speech engine recognize the Egyptian Arabic dialect and classroom idioms?',
      aAr: 'تم تدريب وتطوير محرك الصوت خصيصاً على طريقة وأسلوب المدرس المصري في شرح المواد العلمية والأدبية، ويدمج بكفاءة المصطلحات بالإنجليزية واللاتينية مع العامية المصرية بأعلى دقة ممكنة.',
      aEn: 'The audio engine is custom-tuned to Egyptian classroom speech, seamlessly transcribing Egyptian Arabic alongside scientific terms in English and Latin.'
    },
    {
      qAr: 'ما هي طرق الدفع المتاحة للاشتراك داخل مصر؟',
      qEn: 'What payment methods are supported in Egypt?',
      aAr: 'نوفر جميع وسائل الدفع المحلية السريعة والمعتمدة في مصر: إنستاباي (InstaPay)، محافظ الموبايل (فودافون كاش، أورنج كاش، اتصالات كاش)، فوري (Fawry)، بالإضافة إلى البطاقات البنكية وبطاقات ميزة الوطنية.',
      aEn: 'We support all Egyptian local payment methods: InstaPay, Vodafone/Orange/Etisalat Cash, Fawry kiosks, and bank debit/credit cards including Meeza.'
    }
  ];

  return (
    <div style={{ position: 'relative', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', overflow: 'hidden' }}>

      {/* ── Realistic Spider-Man on Web (Landing Page Exclusive) ── */}
      <SpiderManWeb />

      {/* ── Interactive Neural / Spiderweb Constellation Canvas Background ── */}
      <PlexusBackground />

      {/* =========================================================================
          HERO SECTION with Animated Cyber Grid, Light Beams & Particles
         ========================================================================= */}
      <section style={{
        position: 'relative',
        padding: 'clamp(40px, 6vw, 70px) 16px clamp(50px, 7vw, 80px)',
        textAlign: 'center',
        overflow: 'hidden',
        zIndex: 1
      }}>
        {/* Animated Cyber Grid Layer (Motafawweq Blue) */}
        <div className="cyber-grid-overlay" />

        {/* Sweeping Light Beam */}
        <div className="hero-light-beam" />

        {/* Floating Twinkling Sparkles */}
        <div className="sparkle-particle" style={{ top: '18%', left: '22%', width: '4px', height: '4px', animationDelay: '0.2s' }} />
        <div className="sparkle-particle" style={{ top: '28%', right: '18%', width: '5px', height: '5px', animationDelay: '1.2s' }} />
        <div className="sparkle-particle" style={{ top: '65%', left: '15%', width: '3px', height: '3px', animationDelay: '2.1s' }} />
        <div className="sparkle-particle" style={{ top: '75%', right: '25%', width: '4px', height: '4px', animationDelay: '0.8s' }} />
        <div className="sparkle-particle" style={{ top: '42%', left: '80%', width: '5px', height: '5px', animationDelay: '1.7s' }} />

        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          {/* Floating EdTech Badge */}
          <div className="landing-hero-badge" style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-surface-elevated, var(--bg-surface))',
              border: '1px solid var(--border-medium)',
              boxShadow: '0 4px 16px rgba(21, 136, 199, 0.12)',
              backdropFilter: 'blur(12px)'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                boxShadow: '0 0 10px var(--primary)'
              }} />
              <Sparkles size={15} color="var(--primary)" />
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {lang === 'ar'
                  ? '🇪🇬 المنصة التعليمية المتكاملة لجميع المراحل الدراسية في مصر'
                  : 'Egypt\'s Premier Educational Platform for All Academic Stages'}
              </span>
            </div>
          </div>

          {/* 2-Column Hero Grid: Text & CTAs on right, Monthly Champions Slider on left */}
          <div className="landing-hero-2col">
            {/* Text & Action Column */}
            <div>
              {/* Top Tag: Our Students Success Stories / Monthly Champions */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--primary)',
                fontSize: '13px',
                fontWeight: '800',
                marginBottom: '12px'
              }}>
                <Trophy size={16} color="#FBBF24" />
                <span>{lang === 'ar' ? 'قصص نجاح طلابنا • أبطال دوري المتفوقين' : 'Student Success Stories • League Champions'}</span>
              </div>

              {/* Dynamic Headline */}
              <h1 className="landing-hero-headline" style={{
                fontSize: 'clamp(2.1rem, 3.8vw, 3.4rem)',
                fontWeight: '900',
                lineHeight: 1.25,
                letterSpacing: '-1px',
                fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)',
                marginBottom: '18px'
              }}>
                <span>{lang === 'ar' ? 'اشرح حصتك مرة واحدة..' : 'Teach Your Class Once..'}</span>
                <br />
                <span style={{ color: 'var(--primary)' }}>
                  {lang === 'ar' ? 'واحصل على كل ما يلزم لتفوق طلابك' : 'And Empower Your Students with Motafawweq'}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="landing-hero-subtitle" style={{
                fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                maxWidth: '620px',
                margin: '0 0 28px',
                fontWeight: '500'
              }}>
                {lang === 'ar'
                  ? 'سجل حصتك الدراسية بكل سهولة، ودع متفوّق يحولها فوراً إلى خريطة مفاهيم تفاعلية، وتفريغ نصي بالثواني، وملخصات كورنيل الهيكلية، وبنوك أسئلة بنظام البابل شيت للثانوية العامة وكافة المراحل.'
                  : 'Record your lecture once and let Motafawweq instantly create concept mind maps, synced transcripts, Cornell notes, and adaptive Thanawya exam quizzes.'}
              </p>

              {/* Hero CTAs */}
              <div className="landing-hero-ctas" style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '32px'
              }}>
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg landing-cta-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 28px',
                    fontSize: '15px',
                    fontWeight: '800',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 8px 24px rgba(21, 136, 199, 0.35)',
                    textDecoration: 'none'
                  }}
                >
                  <span>{lang === 'ar' ? 'ابدأ تجربتك المجانية الآن' : 'Start Free Trial'}</span>
                  {isRtl ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
                </Link>

                <Link
                  to="/student/lesson"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '13px 22px',
                    fontSize: '14px',
                    fontWeight: '700',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    border: '1.5px solid var(--border-medium)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    textDecoration: 'none'
                  }}
                >
                  <BookOpen size={16} color="var(--primary)" />
                  <span>{lang === 'ar' ? 'استعراض تجربة الطالب (الحصص)' : 'View Student Lesson View'}</span>
                </Link>

                <Link
                  to="/teacher/studio"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '13px 20px',
                    fontSize: '14px',
                    fontWeight: '700',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    border: '1.5px solid var(--border-medium)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    textDecoration: 'none'
                  }}
                >
                  <Mic size={16} color="var(--primary)" />
                  <span>{lang === 'ar' ? 'استوديو التسجيل' : 'Recording Studio'}</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="landing-hero-trust" style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                fontSize: '12.5px',
                color: 'var(--text-secondary)',
                fontWeight: '600'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>{lang === 'ar' ? 'بدون بطاقة ائتمان' : 'No credit card required'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>{lang === 'ar' ? 'متوافق 100% مع مناهج مصر' : '100% Egyptian Curriculum Aligned'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>{lang === 'ar' ? 'نظام البابل شيت والتابلت المدرسي' : 'Bubble Sheet & School Tablet Ready'}</span>
                </div>
              </div>
            </div>

            {/* Monthly Champions Slider Column (The Winners of each month) */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MonthlyChampionsSlider isRtl={isRtl} />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE INTERACTIVE 6-STEP WORKFLOW ENGINE
         ========================================================================= */}
      <section style={{
        padding: 'clamp(10px, 2vw, 20px) clamp(12px, 2vw, 24px) clamp(50px, 6vw, 80px)',
        maxWidth: '1240px',
        margin: '0 auto'
      }}>
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(18px, 4vw, 36px)',
            boxShadow: '0 10px 35px rgba(0,0,0,0.04)',
            position: 'relative'
          }}
        >
          {/* Section Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '28px'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--primary)',
                fontWeight: '700',
                fontSize: '12.5px',
                backgroundColor: 'var(--primary-surface)',
                padding: '4px 12px',
                borderRadius: '6px',
                marginBottom: '8px'
              }}>
                <Compass size={15} />
                <span>{lang === 'ar' ? 'محرك الحصة التفاعلي' : 'Interactive Lecture Pipeline'}</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {lang === 'ar' ? 'كيف يحول متفوّق 45 دقيقة شرح إلى منظومة تعليمية ذكية؟' : 'How Motafawweq Transforms 45 Minutes into a Smart System'}
              </h2>
            </div>

            <Link
              to="/student/lesson"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)',
                fontWeight: '700',
                fontSize: '13px',
                border: '1px solid rgba(21, 136, 199, 0.3)',
                textDecoration: 'none'
              }}
            >
              <span>{lang === 'ar' ? 'تجربة الحصة التفاعلية كاملة' : 'Open Full Lesson Workspace'}</span>
              {isRtl ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
            </Link>
          </div>

          {/* 6 Step Tab Buttons */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '10px',
              marginBottom: '28px'
            }}
          >
            {pipelineSteps.map((step) => {
              const StepIcon = step.icon;
              const isActive = activePipelineStep === step.id;
              return (
                <button
                  className="landing-pipeline-step"
                  key={step.id}
                  onClick={() => setActivePipelineStep(step.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '14px 12px',
                    borderRadius: 'var(--radius-lg)',
                    border: isActive ? `2px solid var(--primary)` : '1px solid var(--border-subtle)',
                    backgroundColor: isActive ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: isRtl ? 'right' : 'left'
                  }}
                >
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px',
                    color: isActive ? '#ffffff' : 'var(--primary)'
                  }}>
                    <StepIcon size={17} />
                  </div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: isActive ? 'var(--primary)' : 'var(--text-primary)',
                    marginBottom: '3px'
                  }}>
                    {step.title}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.3
                  }}>
                    {step.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Step Preview Stage Card */}
          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(16px, 3.5vw, 28px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '24px',
            alignItems: 'center'
          }}>
            {/* Left/Text Description */}
            <div>
              <div style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary)',
                fontWeight: '700',
                fontSize: '12px',
                marginBottom: '10px'
              }}>
                {currentStep.badge}
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
                {currentStep.headline}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
                {currentStep.desc}
              </p>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link
                  to="/student/lesson"
                  className="btn btn-primary"
                  style={{
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: '700',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{lang === 'ar' ? 'معاينة تجريبية فورية' : 'Live Interactive Demo'}</span>
                  {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                </Link>
                <Link
                  to="/register"
                  style={{
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    textDecoration: 'none'
                  }}
                >
                  {lang === 'ar' ? 'سجل مجاناً بحصتك' : 'Try With Your Class'}
                </Link>
              </div>
            </div>

            {/* Right Interactive Graphical Simulation Box */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 'clamp(14px, 3vw, 20px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {activePipelineStep === 0 && (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '50px', marginBottom: '14px' }}>
                    <div className="audio-bar" style={{ animationDelay: '0s', background: 'var(--primary)' }} />
                    <div className="audio-bar" style={{ animationDelay: '0.2s', height: '28px', background: 'var(--primary)' }} />
                    <div className="audio-bar" style={{ animationDelay: '0.4s', height: '42px', background: 'var(--primary)' }} />
                    <div className="audio-bar" style={{ animationDelay: '0.1s', height: '36px', background: 'var(--primary)' }} />
                    <div className="audio-bar" style={{ animationDelay: '0.5s', height: '48px', background: 'var(--primary)' }} />
                    <div className="audio-bar" style={{ animationDelay: '0.3s', height: '22px', background: 'var(--primary)' }} />
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>
                    {lang === 'ar' ? '🔴 جاري التسجيل المباشر بنقاء صوتي عالي' : '🔴 High Fidelity Live Recording'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    42:18 • عزل ضوضاء القاعات المدرسية وسناتر الدروس
                  </div>
                </div>
              )}

              {activePipelineStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--primary-surface)', color: 'var(--primary)', fontWeight: '700' }}>05:20</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>"الماء هنا يا دكاترة هو المصدر الرئيسي للإلكترونات..."</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--primary-surface)', color: 'var(--primary)', fontWeight: '700' }}>07:45</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>"فان نيل أثبت التجربة دي بنظائر الأكسجين المشع..."</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--primary-surface)', color: 'var(--primary)', fontWeight: '700' }}>11:12</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>"مركب PGAL بيتكون بعد ثانيتين بس في ستروما البلاستيدة!"</span>
                  </div>
                </div>
              )}

              {activePipelineStep === 2 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 0'
                }}>
                  <div style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'var(--primary)'
                  }}>
                    {lang === 'ar' ? 'التفاعلات الضوئية (الجرانا)' : 'Light Reactions (Grana)'}
                  </div>
                  <div style={{
                    padding: '8px 20px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--primary)',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '13px',
                    boxShadow: '0 4px 14px rgba(21, 136, 199, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Sparkles size={14} />
                    {lang === 'ar' ? 'البناء الضوئي وحركية الطاقة' : 'Photosynthesis & Energy'}
                  </div>
                  <div style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#10B981'
                  }}>
                    {lang === 'ar' ? 'دورة كالفن وتكوين PGAL' : 'Calvin Cycle & PGAL'}
                  </div>
                </div>
              )}

              {activePipelineStep >= 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)', flexWrap: 'wrap', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {lang === 'ar' ? 'س: ما هو المستقبل النهائي للإلكترونات في التفاعلات الضوئية؟' : 'Q: Final electron acceptor in light reactions?'}
                    </span>
                    <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '800' }}>✓ NADP+</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {lang === 'ar' ? 'معدل استيعاب طلاب المجموعة للدرس:' : 'Student Group Mastery:'}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '800' }}>88.4%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          THE 4 EDUCATIONAL PILLARS (Teacher, Student, Parent, Center)
         ========================================================================= */}
      <section style={{
        padding: 'clamp(40px, 5vw, 60px) 16px',
        maxWidth: '1240px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '38px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '10px' }}>
            {lang === 'ar' ? 'منظومة واحدة تخدم كافة أطراف العملية التعليمية' : 'One Unified Platform for All 4 Stakeholders'}
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
            {lang === 'ar'
              ? 'صُمم متفوّق خصيصاً ليواكب احتياجات منظومة التعليم في مصر من أكبر السناتر التعليمية حتى الطالب في المنزل.'
              : 'Built specifically for the Egyptian educational ecosystem from premier centers to home study.'}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {/* Card 1: Teachers */}
          <div className="glow-card" style={{ padding: '26px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'rgba(21, 136, 199, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}>
                <GraduationCap size={22} />
              </div>
              <h3 style={{ fontSize: '17.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {lang === 'ar' ? 'للمعلمين والمحاضرين' : 'For Teachers'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '18px' }}>
                {lang === 'ar'
                  ? 'سجّل حصتك مرة واحدة، واحصل على التفريغ، الخريطة المعرفية، وبنك الأسئلة تلقائياً. وفر 8 ساعات تحضير كل أسبوع.'
                  : 'Record once, get automatic transcripts, mind maps, and quiz banks. Save 8+ hours weekly.'}
              </p>
            </div>
            <Link
              to="/teacher/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--primary)',
                fontWeight: '700',
                fontSize: '13px',
                textDecoration: 'none'
              }}
            >
              <span>{lang === 'ar' ? 'دخول بوابة المعلم' : 'Open Teacher Suite'}</span>
              {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </Link>
          </div>

          {/* Card 2: Students */}
          <div className="glow-card" style={{ padding: '26px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'rgba(92, 182, 219, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}>
                <BookOpen size={22} />
              </div>
              <h3 style={{ fontSize: '17.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {lang === 'ar' ? 'للطلاب في جميع المراحل' : 'For Students — All Stages'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '18px' }}>
                {lang === 'ar'
                  ? 'لا تضيع وقتك في إعادة سماع تسجيلات 3 ساعات! اضغط على أي نقطة مبهمة في الخريطة لتسمع شرحها، وتدرب على أسئلة الامتحانات.'
                  : 'Skip re-listening to hours of audio. Click confusing concept nodes, jump to exact seconds, and solve adaptive quizzes.'}
              </p>
            </div>
            <Link
              to="/student/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--primary)',
                fontWeight: '700',
                fontSize: '13px',
                textDecoration: 'none'
              }}
            >
              <span>{lang === 'ar' ? 'دخول مكتب المذاكرة' : 'Open Student Desk'}</span>
              {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </Link>
          </div>

          {/* Card 3: Parents */}
          <div className="glow-card" style={{ padding: '26px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}>
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: '17.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {lang === 'ar' ? 'لأولياء الأمور' : 'For Parents'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '18px' }}>
                {lang === 'ar'
                  ? 'إشعارات حية بنسبة حضور الحصص، نتائج الاختبارات الأسبوعية، وتشخيص نقاط الضعف التي تحتاج لتقوية مباشرة على هاتفك.'
                  : 'Real-time attendance alerts, weekly exam scores, and weak-area diagnosis directly on your phone.'}
              </p>
            </div>
            <Link
              to="/parent/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#10B981',
                fontWeight: '700',
                fontSize: '13px',
                textDecoration: 'none'
              }}
            >
              <span>{lang === 'ar' ? 'دخول بوابة المتابعة' : 'Open Parent Portal'}</span>
              {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </Link>
          </div>

          {/* Card 4: Centers */}
          <div className="glow-card" style={{ padding: '26px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                color: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}>
                <Building2 size={22} />
              </div>
              <h3 style={{ fontSize: '17.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {lang === 'ar' ? 'للسناتر والمراكز التعليمية' : 'For Learning Centers'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '18px' }}>
                {lang === 'ar'
                  ? 'إدارة متكاملة للقاعات والمجموعات، جداول المدرسين، ونظام دومين مخصص وهوية كاملة باسم السنتر.'
                  : 'Multi-teacher oversight, hall schedules, consolidated analytics, and custom branding.'}
              </p>
            </div>
            <Link
              to="/center/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#F59E0B',
                fontWeight: '700',
                fontSize: '13px',
                textDecoration: 'none'
              }}
            >
              <span>{lang === 'ar' ? 'دخول لوحة السنتر' : 'Open Center Hub'}</span>
              {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EGYPTIAN EDUCATIONAL STAGES (Primary, Preparatory, Secondary)
         ========================================================================= */}
      <section style={{
        padding: 'clamp(45px, 6vw, 75px) 16px',
        backgroundColor: 'var(--bg-subtle)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--primary)',
              fontWeight: '700',
              fontSize: '12px',
              backgroundColor: 'var(--primary-surface)',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              marginBottom: '12px'
            }}>
              <GraduationCap size={15} />
              <span>{lang === 'ar' ? 'منظومة تعليمية متكاملة لكافة الأعمار' : 'Comprehensive Educational Continuum'}</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.3rem)', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '12px' }}>
              {lang === 'ar' ? 'المراحل الدراسية في منصة متفوّق' : 'Academic Stages Powered by Motafawweq'}
            </h2>
            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
              {lang === 'ar'
                ? 'تجربة تعليمية ذكية ومخصصة لكل مرحلة عمرية، تلبي متطلبات الطالب وتدعم المعلم وولي الأمر بأعلى كفاءة.'
                : 'Tailored learning frameworks engineered for each developmental stage, empowering students, teachers, and parents.'}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {/* Stage 1: Primary */}
            <div className="landing-curriculum-card" style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              padding: '30px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              position: 'relative',
              transition: 'all 0.3s ease'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(21, 136, 199, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}>
                    <BookOpen size={24} />
                  </div>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    backgroundColor: 'var(--primary-surface)',
                    padding: '4px 12px',
                    borderRadius: '99px'
                  }}>
                    {lang === 'ar' ? 'تأسيس وفهم مبكر' : 'Early Foundation'}
                  </span>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '10px' }}>
                  {lang === 'ar' ? 'المرحلة الابتدائية' : 'Primary Stage'}
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
                  {lang === 'ar'
                    ? 'بناء الأساس الأكاديمي المتين وغرس حب الاستكشاف لدى الطالب منذ الصغر؛ عبر تحويل المفاهيم الدراسية المجردة إلى عناصر بصرية وتفاعلية مبسطة تثبت المعلومة دون حفظ تلقيني، مع تقارير متابعة مبسطة تضع ولي الأمر في قلب رحلة تعلم طفله أولاً بأول.'
                    : 'Fostering intellectual curiosity and foundational fluency through visual concept breakdowns and real-time parent progress indicators.'}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: '600' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                  <span>{lang === 'ar' ? 'خرائط مفاهيم بصرية تناسب الفئات العمرية المبكرة' : 'Child-friendly visual concept frameworks'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: '600' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                  <span>{lang === 'ar' ? 'تنمية مهارات الفهم والاستنتاج الذاتي' : 'Cultivating independent reasoning'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: '600' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                  <span>{lang === 'ar' ? 'إشعارات ذكية لولي الأمر لمتابعة التطور الدراسي' : 'Transparent parent mastery dashboards'}</span>
                </div>
              </div>
            </div>

            {/* Stage 2: Preparatory */}
            <div className="landing-curriculum-card" style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              padding: '30px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              position: 'relative',
              transition: 'all 0.3s ease'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(92, 182, 219, 0.16)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0284C7'
                  }}>
                    <Layers size={24} />
                  </div>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: '800',
                    color: '#0284C7',
                    backgroundColor: 'rgba(92, 182, 219, 0.12)',
                    padding: '4px 12px',
                    borderRadius: '99px'
                  }}>
                    {lang === 'ar' ? 'بناء المهارات والتنظيم' : 'Skill Development'}
                  </span>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '10px' }}>
                  {lang === 'ar' ? 'المرحلة الإعدادية' : 'Preparatory Stage'}
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
                  {lang === 'ar'
                    ? 'الجسر الحاسم نحو تشكيل العقلية الدراسية المنظمة؛ ندرب الطالب على ربط الأفكار وتحليلها عبر شبكات المعرفة الذكية، وإدارة وقته واستيعاب الحصص بكفاءة عالية، مع بنوك تدريب متدرجة تقيس الفهم الواقعي وتزيل أي رهبة من الاختبارات.'
                    : 'Empowering independent thinking with organized mental structures, time management tools, and continuous self-assessments.'}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: '600' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                  <span>{lang === 'ar' ? 'تنظيم الشرح في شبكات مفاهيمية واضحة' : 'Interconnected relational knowledge networks'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: '600' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                  <span>{lang === 'ar' ? 'تدريب ذاتي فوري بعد كل درس لتثبيت المعلومات' : 'Immediate post-lesson adaptive quizzes'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: '600' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                  <span>{lang === 'ar' ? 'تشخيص مبكر لأي صعوبات دراسية ومعالجتها' : 'Targeted diagnostic bottleneck resolution'}</span>
                </div>
              </div>
            </div>

            {/* Stage 3: Secondary */}
            <div className="landing-curriculum-card" style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--primary)',
              borderRadius: 'var(--radius-xl)',
              padding: '30px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 28px rgba(21, 136, 199, 0.08)',
              position: 'relative',
              transition: 'all 0.3s ease'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(21, 136, 199, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}>
                    <Award size={24} />
                  </div>
                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: '800',
                    color: '#ffffff',
                    backgroundColor: 'var(--primary)',
                    padding: '4px 12px',
                    borderRadius: '99px'
                  }}>
                    {lang === 'ar' ? 'القمة والتفوق' : 'Summit of Excellence'}
                  </span>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '10px' }}>
                  {lang === 'ar' ? 'المرحلة الثانوية' : 'Secondary Stage'}
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
                  {lang === 'ar'
                    ? 'المحطة المصيرية لتحقيق أهدافك والوصول لكليات القمة؛ منظومة احترافية تركز على مهارات التفكير العليا ونواتج التعلم الوزارية، مع ملخصات كورنيل الذكية وبنوك أسئلة بنظام البابل شيت الحديث توفر عشرات الساعات من الإرهاق.'
                    : 'Targeted preparation for Thanawya and national examinations, featuring higher-order thinking quizzes and high-yield Cornell summaries.'}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: '600' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                  <span>{lang === 'ar' ? 'محاكاة كاملة لأسئلة البابل شيت ونواتج التعلم' : 'Bubble-sheet exam simulations & mastery metrics'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: '600' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                  <span>{lang === 'ar' ? 'ملخصات هيكلية وتفريغ ذكي يوفر ساعات التحضير' : 'Timestamped summaries saving 8+ hours weekly'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: '600' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                  <span>{lang === 'ar' ? 'تشخيص دقيق لنقاط الضعف الفردية قبل الامتحانات' : 'Precision diagnosis of weak conceptual spots'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EGYPTIAN STATS BANNER
         ========================================================================= */}
      <section style={{
        padding: '48px 24px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          textAlign: 'center'
        }}>
          <div className="landing-stat-item">
            <div style={{ fontSize: '36px', fontWeight: '900', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              +34,800
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {lang === 'ar' ? 'طالب ثانوي نشط في محافظات مصر' : 'Active High School Students'}
            </div>
          </div>
          <div className="landing-stat-item">
            <div style={{ fontSize: '36px', fontWeight: '900', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              +1,420
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {lang === 'ar' ? 'معلم وسنتر تعليمي معتمد' : 'Verified Egyptian Educators & Centers'}
            </div>
          </div>
          <div className="landing-stat-item">
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#10B981', fontFamily: 'var(--font-heading)' }}>
              99.4%
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {lang === 'ar' ? 'دقة تفريغ المصطلحات العلمية' : 'Scientific Terminology Accuracy'}
            </div>
          </div>
          <div className="landing-stat-item">
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#F59E0B', fontFamily: 'var(--font-heading)' }}>
              8+ {lang === 'ar' ? 'ساعات' : 'Hours'}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {lang === 'ar' ? 'يوفرها المعلم أسبوعياً في التحضير' : 'Saved Weekly per Educator'}
            </div>
          </div>
        </div>
      </section>



      {/* =========================================================================
          TESTIMONIALS & VERIFIED REVIEWS
         ========================================================================= */}
      <section style={{ padding: 'clamp(40px, 5vw, 70px) 16px', maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
            {lang === 'ar' ? 'ماذا يقول كبار المعلمين وأوائل الجمهورية عن متفوّق؟' : 'Trusted by Top Educators & High Achievers'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {lang === 'ar' ? 'تجارب حقيقية من سناتر وقاعات القاهرة والإسكندرية والمنصورة وأسيوط' : 'Real success stories across Egyptian schools and educational centers'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '18px' }}>
          {/* Review 1 */}
          <div className="card landing-testimonial-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', gap: '4px', color: '#F59E0B', marginBottom: '12px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#F59E0B" />)}
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>
              {lang === 'ar'
                ? '"أنا بشرح الأحياء لأكثر من 1,200 طالب أسبوعياً في سناتر المهندسين والدقي. خريطة المفاهيم التفاعلية وفرت عليا مراجعات مجهدة. الطالب بقى يضغط على المفهوم اللي مش فاهمه ويسمع الدقيقة بتاعته فوراً."'
                : '"I teach biology to 1,200+ students weekly. The interactive concept map saves endless revision time."'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} alt="" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>د. سلمى السيد</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>كبير معلمي الأحياء للثانوية العامة</div>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', gap: '4px', color: '#F59E0B', marginBottom: '12px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#F59E0B" />)}
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>
              {lang === 'ar'
                ? '"كل دقيقة في الثانوية العامة بتفرق. ملخصات كورنيل وبنك الأسئلة المولد من شرح المستر خلاني أحل أسئلة الامتحانات وأنا واثق جداً من نفسي، والحمد لله طلعت من أوائل الجمهورية بمجموع 98.4%."'
                : '"Every minute in Thanawya Amma counts. Cornell summaries and auto-quizzes helped me score 98.4%."'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} alt="" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>عمر طارق القاضي</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>طالب متفوق - شعبة علمي علوم</div>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', gap: '4px', color: '#F59E0B', marginBottom: '12px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#F59E0B" />)}
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>
              {lang === 'ar'
                ? '"بصفتي ولي أمر لطالبة في 3 ثانوي، متفوّق طمني جداً. بيجيلي إشعار بدرجات الامتحانات الأسبوعية والدروس اللي محتاجة تركيز أكبر بدون ما أحتاج أسأل كل شوية."'
                : '"As a parent, Motafawweq keeps me peacefully in the loop with test scores and focus areas."'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} alt="" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>م. هاني منصور</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ولي أمر طالبة في المرحلة الثانوية</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FREQUENTLY ASKED QUESTIONS (FAQ Accordion)
         ========================================================================= */}
      <section style={{
        padding: 'clamp(40px, 5vw, 65px) 16px',
        maxWidth: '860px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '34px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--primary)',
            fontWeight: '700',
            fontSize: '12px',
            backgroundColor: 'var(--primary-surface)',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            marginBottom: '10px'
          }}>
            <HelpCircle size={14} />
            <span>{lang === 'ar' ? 'إجابات مباشرة وشفافة' : 'Questions & Answers'}</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '10px' }}>
            {lang === 'ar' ? 'الأسئلة الأكثر شيوعاً عن منصة متفوّق' : 'Frequently Asked Questions'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {lang === 'ar' ? 'كل ما تود معرفته عن طريقة عمل المنصة والاشتراكات في مصر' : 'Everything you need to know about Motafawweq in Egypt'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                className="landing-faq-item"
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: isOpen ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: isRtl ? 'right' : 'left'
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {lang === 'ar' ? faq.qAr : faq.qEn}
                  </span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      color: isOpen ? 'var(--primary)' : 'var(--text-muted)',
                      flexShrink: 0
                    }}
                  />
                </button>
                {isOpen && (
                  <div style={{
                    padding: '0 20px 18px',
                    fontSize: '13.5px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '12px'
                  }}>
                    {lang === 'ar' ? faq.aAr : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          FINAL CALL TO ACTION BANNER
         ========================================================================= */}
      <section
        className="cta-section"
        style={{
          padding: 'clamp(50px, 7vw, 80px) 16px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, var(--bg-app) 0%, var(--bg-surface) 100%)',
          borderTop: '1px solid var(--border-subtle)',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <img src={isDark ? '/logo-dark.png' : '/logo-light.png'} alt="متفوّق" style={{ width: '64px', height: '64px', marginBottom: '16px' }} />
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '12px' }}>
            {lang === 'ar' ? 'جاهز للانطلاق نحو القمة في دراستك وتدريسك؟' : 'Ready to Transform Your Teaching and Learning?'}
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', marginBottom: '30px' }}>
            {lang === 'ar' ? 'انضم الآن مجاناً وابدأ تجربة المنظومة التعليمية الأقوى والأشمل في مصر.' : 'Join free today and experience Egypt’s premier educational platform.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <Link
              to="/register"
              className="btn btn-primary btn-lg landing-cta-primary"
              style={{
                padding: '15px 38px',
                fontSize: '15.5px',
                fontWeight: '800',
                borderRadius: 'var(--radius-full)',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(21, 136, 199, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{t('ctaGetStarted')}</span>
              {isRtl ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
            </Link>

            <Link
              to="/student/lesson"
              style={{
                padding: '14px 26px',
                fontSize: '14.5px',
                fontWeight: '700',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                border: '1.5px solid var(--border-medium)',
                textDecoration: 'none'
              }}
            >
              {lang === 'ar' ? 'استعراض الحصص والمحتوى' : 'View Sample Lesson'}
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EXPANDED EGYPTIAN EDTECH FOOTER
         ========================================================================= */}
      <footer style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        padding: 'clamp(40px, 5vw, 60px) 16px 28px'
      }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
            paddingBottom: '36px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <img src={isDark ? '/logo-dark.png' : '/logo-light.png'} alt="متفوّق" style={{ width: '38px', height: '38px' }} />
              <div>
                <div style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'متفوّق | Motafawweq' : 'Motafawweq'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {lang === 'ar' ? 'المنصة التعليمية الذكية في مصر' : 'Egyptian EdTech Platform'}
                </div>
              </div>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
              {lang === 'ar'
                ? 'المنظومة المتكاملة لتحويل الحصص المدرسية وسناتر الدروس إلى خرائط مفاهيمية، بنوك أسئلة بابل شيت، وملخصات دراسية ذكية.'
                : 'Empowering Egyptian educators and students with smart lecture conversion, interactive mind maps, and Thanawya assessments.'}
            </p>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px' }}>
              {lang === 'ar' ? 'بوابات المنصة' : 'Platform Portals'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <Link to="/teacher/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{lang === 'ar' ? 'بوابة المعلم واستوديو التسجيل' : 'Teacher Suite'}</Link>
              <Link to="/student/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{lang === 'ar' ? 'مكتب مذاكرة الطالب' : 'Student Desk'}</Link>
              <Link to="/student/lesson" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{lang === 'ar' ? 'مشاهدة حصة تفاعلية' : 'Interactive Lesson'}</Link>
              <Link to="/parent/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{lang === 'ar' ? 'بوابة متابعة ولي الأمر' : 'Parent Portal'}</Link>
              <Link to="/center/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{lang === 'ar' ? 'لوحة تحكم السنتر' : 'Center Hub'}</Link>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px' }}>
              {lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <Link to="/features" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('navFeatures')}</Link>
              <Link to="/pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('navPricing')}</Link>
              <Link to="/marketplace" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('navMarketplace')}</Link>
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>{t('navLogin')}</Link>
              <Link to="/register" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('signUpBtn')}</Link>
            </div>
          </div>

          {/* Col 4: Payments & Security */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px' }}>
              {lang === 'ar' ? 'طرق الدفع المعتمدة في مصر' : 'Egyptian Payment Methods'}
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', fontWeight: '700', fontSize: '12px', color: 'var(--text-primary)' }}>إنستاباي (InstaPay)</span>
              <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', fontWeight: '700', fontSize: '12px', color: 'var(--text-primary)' }}>فودافون كاش</span>
              <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', fontWeight: '700', fontSize: '12px', color: 'var(--text-primary)' }}>فوري (Fawry)</span>
              <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', fontWeight: '700', fontSize: '12px', color: 'var(--text-primary)' }}>كروت ميزة</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#10B981" />
              <span>{lang === 'ar' ? 'دفع آمن وحماية 100% لخصوصية المعلم والطالب' : '100% secure payments and data privacy'}</span>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: '1200px',
            margin: '22px auto 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}
        >
          <div>© {new Date().getFullYear()} {lang === 'ar' ? 'منصة متفوّق التعليمية (Motafawweq). جميع الحقوق محفوظة.' : 'Motafawweq Inc. All rights reserved.'}</div>
          <div>{lang === 'ar' ? 'صُنعت بكل فخر في مصر 🇪🇬 لتطوير التعليم ومستقبل طلابنا' : 'Crafted with pride in Egypt 🇪🇬'}</div>
        </div>
      </footer>
    </div>
  );
};
