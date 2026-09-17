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
  Flame,
  Clock,
  Radio,
  ExternalLink,
  GraduationCap,
  Building2,
  Check,
  CreditCard
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const { lang, t, isRtl } = useLanguage();
  const { isDark } = useTheme();
  const [activePipelineStep, setActivePipelineStep] = useState(2); // default Knowledge Map

  const pipelineSteps = [
    {
      id: 0,
      title: lang === 'ar' ? '1. تسجيل صوتي أو رفع' : '1. Record or Upload',
      subtitle: lang === 'ar' ? 'سجل حصتك حتى 90 دقيقة بنقاء فائق وعزل للضوضاء' : 'Live mic or upload lesson audio up to 90 mins',
      icon: Mic,
      color: '#6C4DFF',
      badge: lang === 'ar' ? 'المدخل الصوتي المباشر' : 'Live Audio Input',
      headline: lang === 'ar' ? 'حصة الأحياء: البناء الضوئي وحركية الطاقة' : 'Biology: Photosynthesis & Energy Dynamics',
      desc: lang === 'ar' ? 'تسجيل مباشر بصوت د. سلمى السيد (42 دقيقة و 18 ثانية) مع خوارزمية عزل ضوضاء القاعات المدرسية وسنتر الدروس.' : 'Direct classroom recording (42m 18s) with Egyptian classroom noise suppression.'
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
      title: lang === 'ar' ? '3. خريطة معرفية ثلاثية الأبعاد' : '3. 3D Concept Map',
      subtitle: lang === 'ar' ? 'تحويل الشرح لشبكة مفاهيمية ذكية تكشف العلاقات وروابط الامتحانات' : 'Interactive concept network with draggable nodes & deep links',
      icon: Share2,
      color: '#A855F7',
      badge: lang === 'ar' ? 'قلب متفوّق الثوري' : 'The Motafawweq Flagship',
      headline: lang === 'ar' ? '14 مفهوماً علمياً مترابطاً ومربوطاً بالصوت والامتحانات' : '14 Interconnected Concepts Mapped in 3D',
      desc: lang === 'ar' ? 'يستخرج الذكاء الاصطناعي المفاهيم الرئيسية والفرعية، ويبني شبكة ترابطية تكشف فوراً أين تقع نقاط صعوبة الفهم لدى الطلاب.' : 'Extracts root and child concepts with mastery ratings, enabling non-linear revision and targeted diagnostics.'
    },
    {
      id: 3,
      title: lang === 'ar' ? '4. ملخص كورنيل الذكي' : '4. Cornell Summary',
      subtitle: lang === 'ar' ? 'ملاحظات هيكلية، مصطلحات أساسية، ومعادلات كيميائية' : 'Structured definitions, formulas & key takeaways',
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
      desc: lang === 'ar' ? 'يصيغ الذكاء الاصطناعي أسئلة مستوحاة من كلام المدرس في الحصة، مع تعليلات فورية لكل إجابة ورابط للحظة الشرح.' : 'Formulates questions directly from spoken examples, with rationale and instant links back to the audio timestamp.'
    },
    {
      id: 5,
      title: lang === 'ar' ? '6. تشخيص نقاط الضعف' : '6. Learning Diagnostics',
      subtitle: lang === 'ar' ? 'تحديد دقيق للمفاهيم التي لم يستوعبها الطلاب لإعادة شرحها' : 'Real-time mastery tracking & automated review queues',
      icon: Award,
      color: '#EC4899',
      badge: lang === 'ar' ? 'ذكاء تعليمي دقيق' : 'Actionable Insights',
      headline: lang === 'ar' ? 'دورة كالفن وإنتاج NADPH: نسبة الفهم 71%' : 'Calvin Cycle & NADPH: 71% Mastery Alert',
      desc: lang === 'ar' ? 'يرى المعلم بدقة أين يتعثر الطلاب قبل موعد الامتحان، ويرسل مراجعة دقيقة لـ 5 دقائق فقط.' : 'Reveals class bottlenecks before official exams, automatically sending targeted 5-minute refresher micro-lessons.'
    }
  ];

  const currentStep = pipelineSteps[activePipelineStep];

  return (
    <div style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', overflow: 'hidden' }}>
      
      {/* =========================================================================
          HERO SECTION with Animated Glowing Cyber Orbs, Light Beams & Particles
         ========================================================================= */}
      <section style={{
        position: 'relative',
        padding: 'clamp(40px, 6vw, 70px) 16px clamp(60px, 8vw, 100px)',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Animated Cyber Grid Layer */}
        <div className="cyber-grid-overlay" />

        {/* Sweeping Light Beam */}
        <div className="hero-light-beam" />

        {/* 4 Animated Glowing Multi-Color Orbs */}
        <div className="hero-glow-orb hero-orb-1" />
        <div className="hero-glow-orb hero-orb-2" />
        <div className="hero-glow-orb hero-orb-3" />
        <div className="hero-glow-orb hero-orb-4" />

        {/* Floating Twinkling Sparkles */}
        <div className="sparkle-particle" style={{ top: '18%', left: '22%', width: '4px', height: '4px', animationDelay: '0.2s' }} />
        <div className="sparkle-particle" style={{ top: '28%', right: '18%', width: '5px', height: '5px', animationDelay: '1.2s' }} />
        <div className="sparkle-particle" style={{ top: '65%', left: '15%', width: '3px', height: '3px', animationDelay: '2.1s' }} />
        <div className="sparkle-particle" style={{ top: '75%', right: '25%', width: '4px', height: '4px', animationDelay: '0.8s' }} />
        <div className="sparkle-particle" style={{ top: '42%', left: '80%', width: '5px', height: '5px', animationDelay: '1.7s' }} />

        <div style={{ maxWidth: '1080px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          
          {/* Floating EdTech Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '22px' }} className="animate-float">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid rgba(108, 77, 255, 0.35)',
              boxShadow: '0 8px 24px rgba(108, 77, 255, 0.15)',
              backdropFilter: 'blur(12px)'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 10px #10B981'
              }} />
              <Sparkles size={15} color="var(--primary)" />
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {lang === 'ar' 
                  ? 'منصة الذكاء الاصطناعي التعليمي لجميع المراحل الدراسية في مصر' 
                  : 'Egypt\'s Leading AI EdTech Platform for All Educational Stages'}
              </span>
            </div>
          </div>

          {/* Animated Hero Logo — Pure CSS + SVG, no background box */}
          <style>{`
            @keyframes heroLogoFloat {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              33%  { transform: translateY(-14px) rotate(1deg); }
              66%  { transform: translateY(-7px) rotate(-1deg); }
            }
            @keyframes heroRingPulse {
              0%, 100% { opacity: 0.5; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.12); }
            }
            @keyframes heroRingPulse2 {
              0%, 100% { opacity: 0.25; transform: scale(1); }
              50% { opacity: 0.65; transform: scale(1.2); }
            }
            @keyframes heroOrbitSpin {
              from { transform: rotate(0deg); }
              to   { transform: rotate(360deg); }
            }
            @keyframes heroOrbitSpinReverse {
              from { transform: rotate(0deg); }
              to   { transform: rotate(-360deg); }
            }
            @keyframes heroParticleGlow {
              0%, 100% { opacity: 0.7; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.6); }
            }
            @keyframes heroLogoGlow {
              0%, 100% { filter: drop-shadow(0 0 18px rgba(108,77,255,0.6)) drop-shadow(0 0 8px rgba(6,182,212,0.2)); }
              50% { filter: drop-shadow(0 0 36px rgba(108,77,255,0.95)) drop-shadow(0 0 20px rgba(6,182,212,0.5)); }
            }
            @keyframes heroLogoEntrance {
              from { opacity: 0; transform: scale(0.6); }
              to   { opacity: 1; transform: scale(1); }
            }
            .hero-logo-wrapper {
              position: relative;
              width: 160px;
              height: 160px;
              display: flex;
              align-items: center;
              justify-content: center;
              animation: heroLogoFloat 4.5s ease-in-out infinite, heroLogoEntrance 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            .hero-logo-img {
              width: 88px;
              height: 88px;
              object-fit: contain;
              position: relative;
              z-index: 10;
              animation: heroLogoGlow 3s ease-in-out infinite;
            }
            .hero-ring-1 {
              position: absolute;
              inset: 0;
              border-radius: 50%;
              border: 1.5px solid rgba(108,77,255,0.45);
              animation: heroRingPulse 2.8s ease-in-out infinite;
            }
            .hero-ring-2 {
              position: absolute;
              inset: -18px;
              border-radius: 50%;
              border: 1px dashed rgba(108,77,255,0.25);
              animation: heroOrbitSpin 12s linear infinite;
            }
            .hero-ring-3 {
              position: absolute;
              inset: -36px;
              border-radius: 50%;
              border: 1px dashed rgba(6,182,212,0.2);
              animation: heroOrbitSpinReverse 18s linear infinite;
            }
            .hero-ring-4 {
              position: absolute;
              inset: -54px;
              border-radius: 50%;
              border: 1px solid rgba(168,85,247,0.12);
              animation: heroRingPulse2 3.5s ease-in-out infinite 0.8s;
            }
            .hero-orbit-dot {
              position: absolute;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              animation: heroParticleGlow 2s ease-in-out infinite;
            }
          `}</style>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
            <div className="hero-logo-wrapper">
              {/* Glow rings */}
              <div className="hero-ring-1" />
              <div className="hero-ring-2">
                {/* Orbiting particle on ring 2 */}
                <div className="hero-orbit-dot" style={{
                  top: '-4px', left: '50%', marginLeft: '-4px',
                  backgroundColor: '#6C4DFF',
                  boxShadow: '0 0 10px 3px rgba(108,77,255,0.8)'
                }} />
              </div>
              <div className="hero-ring-3">
                {/* Two orbiting particles on ring 3 */}
                <div className="hero-orbit-dot" style={{
                  top: '10%', right: '-4px',
                  width: '6px', height: '6px',
                  backgroundColor: '#06B6D4',
                  boxShadow: '0 0 8px 3px rgba(6,182,212,0.8)',
                  animationDelay: '0.5s'
                }} />
                <div className="hero-orbit-dot" style={{
                  bottom: '10%', left: '-3px',
                  width: '5px', height: '5px',
                  backgroundColor: '#A855F7',
                  boxShadow: '0 0 8px 3px rgba(168,85,247,0.8)',
                  animationDelay: '1s'
                }} />
              </div>
              <div className="hero-ring-4" />
              {/* The logo itself */}
              <img
                src={isDark ? '/logo-dark.png' : '/logo-light.png'}
                alt="متفوّق – Motafawweq"
                className="hero-logo-img"
              />
            </div>
          </div>

          {/* Dynamic Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
            fontWeight: '900',
            lineHeight: 1.15,
            letterSpacing: '-1.5px',
            fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)',
            marginBottom: '20px'
          }}>
            <span>{lang === 'ar' ? 'اشرح حصتك مرة واحدة..' : 'Teach Once.'}</span>
            <br />
            <span className="text-gradient-primary">
              {lang === 'ar' ? 'واحصل على كل شيء بذكاء متفوّق' : 'Get Everything.'}
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            maxWidth: '820px',
            margin: '0 auto 36px',
            fontWeight: '500'
          }}>
            {t('subTagline')}
          </p>

          {/* Hero CTAs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '40px'
          }}>
            <Link
              to="/register"
              className="btn btn-primary btn-lg"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 36px',
                fontSize: '16px',
                fontWeight: '800',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 12px 32px rgba(108, 77, 255, 0.4)',
                textDecoration: 'none'
              }}
            >
              <Sparkles size={18} />
              <span>{t('ctaGetStarted')}</span>
              {isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </Link>

            <Link
              to="/teacher/studio"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 28px',
                fontSize: '15px',
                fontWeight: '700',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-medium)',
                boxShadow: 'var(--shadow-sm)',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Mic size={18} color="var(--primary)" />
              <span>{lang === 'ar' ? 'تجربة استوديو التسجيل' : 'Try Live Recording Studio'}</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            fontSize: '13px',
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
              <span>{lang === 'ar' ? 'نموذج صوتي خاص باللكنة والمصطلحات المصرية' : 'Egyptian Dialect Whisper AI'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ANIMATED LIVE AI PIPELINE ENGINE (The Interactive Showcase)
         ========================================================================= */}
      <section style={{
        padding: 'clamp(10px, 2vw, 20px) clamp(12px, 2vw, 24px) clamp(60px, 8vw, 90px)',
        maxWidth: '1240px',
        margin: '0 auto'
      }}>
        <div
          className="pipeline-card"
          style={{
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(16px, 4vw, 36px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
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
            marginBottom: '32px'
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--primary)',
                fontWeight: '700',
                fontSize: '12.5px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                marginBottom: '6px'
              }}>
                <Sparkles size={16} />
                <span>{t('pipelineTitle')}</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'كيف يحول متفوّق 45 دقيقة شرح إلى تجربة تعليمية ذكية؟' : 'How Motafawweq Transforms 45 Minutes of Lecture'}
              </h2>
            </div>

            <Link
              to="/teacher/workspace"
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
                border: '1px solid var(--primary-light)',
                textDecoration: 'none'
              }}
            >
              <span>{lang === 'ar' ? 'افتح مساحة العمل التفاعلية الكاملة' : 'Open Full Workspace'}</span>
              {isRtl ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
            </Link>
          </div>

          {/* 6 Step Tab Buttons */}
          <div
            className="pipeline-steps-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '10px',
              marginBottom: '32px'
            }}
          >
            {pipelineSteps.map((step) => {
              const StepIcon = step.icon;
              const isActive = activePipelineStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActivePipelineStep(step.id)}
                  className="pipeline-step-btn"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '16px 14px',
                    borderRadius: 'var(--radius-lg)',
                    border: isActive ? `2px solid ${step.color}` : '1px solid var(--border-subtle)',
                    backgroundColor: isActive ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    textAlign: isRtl ? 'right' : 'left'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: `${step.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px',
                    color: step.color
                  }}>
                    <StepIcon size={18} />
                  </div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
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
            backgroundColor: 'var(--bg-app)',
            border: `1.5px solid ${currentStep.color}40`,
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(16px, 3.5vw, 32px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '24px',
            alignItems: 'center',
            overflow: 'hidden'
          }} className="animate-fade-in pipeline-stage-card">
            {/* Left/Text Description */}
            <div>
              <div style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: `${currentStep.color}15`,
                color: currentStep.color,
                fontWeight: '700',
                fontSize: '12px',
                marginBottom: '12px'
              }}>
                {currentStep.badge}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
                {currentStep.headline}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
                {currentStep.desc}
              </p>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link
                  to="/teacher/workspace"
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
                  <span>{lang === 'ar' ? 'عرض تجريبي مباشر' : 'Live Interactive Demo'}</span>
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
                  {lang === 'ar' ? 'جرب مجاناً بحصتك' : 'Try With Your Class'}
                </Link>
              </div>
            </div>

            {/* Right Interactive Graphical Simulation Box */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(14px, 3vw, 24px)',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}>
              {/* Dynamic Step Visualization */}
              {activePipelineStep === 0 && (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '60px', marginBottom: '16px' }}>
                    <div className="audio-bar" style={{ animationDelay: '0s' }} />
                    <div className="audio-bar" style={{ animationDelay: '0.2s', height: '28px' }} />
                    <div className="audio-bar" style={{ animationDelay: '0.4s', height: '42px' }} />
                    <div className="audio-bar" style={{ animationDelay: '0.1s', height: '36px' }} />
                    <div className="audio-bar" style={{ animationDelay: '0.5s', height: '50px' }} />
                    <div className="audio-bar" style={{ animationDelay: '0.3s', height: '22px' }} />
                    <div className="audio-bar" style={{ animationDelay: '0.15s', height: '44px' }} />
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#6C4DFF' }}>
                    {lang === 'ar' ? '🔴 جاري التسجيل الحي والمزامنة الفورية' : '🔴 Live Recording Active'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    42:18 • 48 kHz FLAC • Dokki Center Hall A
                  </div>
                </div>
              )}

              {activePipelineStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#38BDF825', color: '#38BDF8', fontWeight: '700' }}>05:20</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>"الماء هنا يا دكاترة هو المصدر الرئيسي للإلكترونات..."</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#38BDF825', color: '#38BDF8', fontWeight: '700' }}>07:45</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>"فان نيل أثبت التجربة دي ببكتيريا الكبريت الخضراء..."</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#38BDF825', color: '#38BDF8', fontWeight: '700' }}>11:12</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>"NADP+ بيستقبل الهيدروجين علشان ما يرجعش يتحد مع الأكسجين!"</span>
                  </div>
                </div>
              )}

              {activePipelineStep === 2 && (
                <div style={{
                  position: 'relative',
                  width: '100%',
                  padding: '16px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  overflow: 'hidden'
                }}>
                  {/* Top Child Concept */}
                  <div style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1.5px solid rgba(6, 182, 212, 0.4)',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    color: '#06B6D4',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(6, 182, 212, 0.12)',
                    maxWidth: '100%',
                    textAlign: 'center'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#06B6D4' }} />
                    {lang === 'ar' ? 'التفاعلات الضوئية (الجرانا)' : 'Light Reactions (Grana)'}
                  </div>

                  {/* Central Hub Concept */}
                  <div style={{
                    padding: '9px 20px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#6C4DFF',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '13px',
                    boxShadow: '0 8px 24px rgba(108,77,255,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 2,
                    maxWidth: '100%',
                    textAlign: 'center'
                  }}>
                    <Sparkles size={14} />
                    {lang === 'ar' ? 'البناء الضوئي' : 'Photosynthesis'}
                  </div>

                  {/* Bottom Child Concept */}
                  <div style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1.5px solid rgba(16, 185, 129, 0.4)',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.12)',
                    maxWidth: '100%',
                    textAlign: 'center'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    {lang === 'ar' ? 'دورة كالفن (الستروما)' : 'Calvin Cycle (Stroma)'}
                  </div>
                </div>
              )}

              {activePipelineStep >= 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)', flexWrap: 'wrap', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {lang === 'ar' ? 'س: ما هو المستقبل النهائي للإلكترونات في التفاعلات الضوئية؟' : 'Q: Final electron acceptor in light reactions?'}
                    </span>
                    <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '700' }}>✓ NADP+</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {lang === 'ar' ? 'معدل استيعاب الطلاب للمفهوم:' : 'Student Mastery:'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#F59E0B', fontWeight: '800' }}>88.4%</span>
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
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '12px' }}>
            {lang === 'ar' ? 'منظومة واحدة ذكية تخدم كافة أطراف العملية التعليمية' : 'One Unified Platform for All 4 Stakeholders'}
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
            {lang === 'ar' 
              ? 'صُمم متفوّق خصيصاً ليواكب احتياجات سوق التعليم المصري من أكبر السناتر التعليمية حتى الطالب في المنزل.'
              : 'Built specifically for the Egyptian educational ecosystem from premier centers to home study.'}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {/* Card 1: Teachers */}
          <div className="glow-card" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(108,77,255,0.15)',
                color: '#6C4DFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <GraduationCap size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {lang === 'ar' ? 'للمعلمين والمحاضرين' : 'For Teachers'}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                {lang === 'ar' 
                  ? 'سجّل حصتك مرة واحدة، واحصل على التفريغ، الخريطة المعرفية، وبنك الأسئلة تلقائياً. وفر 8 ساعات تحضير كل أسبوع.'
                  : 'Record once, get automatic transcripts, interactive mind maps, and quiz banks. Save 8+ hours weekly.'}
              </p>
            </div>
            <Link
              to="/teacher/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#6C4DFF',
                fontWeight: '700',
                fontSize: '13px',
                textDecoration: 'none'
              }}
            >
              <span>{lang === 'ar' ? 'دخول بوابة المعلم' : 'Open Teacher Suite'}</span>
              {isRtl ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
            </Link>
          </div>

          {/* Card 2: Students */}
          <div className="glow-card" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(6,182,212,0.15)',
                color: '#06B6D4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {lang === 'ar' ? 'للطلاب في جميع المراحل' : 'For Students — All Stages'}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                {lang === 'ar' 
                  ? 'لا تضيع وقتك في إعادة سماع تسجيلات 3 ساعات! اضغط على أي نقطة مبهمة في الخريطة لتسمع شرحها، وتدرب على أسئلة الامتحانات.'
                  : 'Skip re-listening to hours of audio. Click confusing concept nodes, jump to exact seconds, and solve adaptive quizzes tailored to your grade.'}
              </p>
            </div>
            <Link
              to="/student/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#06B6D4',
                fontWeight: '700',
                fontSize: '13px',
                textDecoration: 'none'
              }}
            >
              <span>{lang === 'ar' ? 'دخول مكتب المذاكرة' : 'Open Student Desk'}</span>
              {isRtl ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
            </Link>
          </div>

          {/* Card 3: Parents */}
          <div className="glow-card" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16,185,129,0.15)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {lang === 'ar' ? 'لأولياء الأمور' : 'For Parents'}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                {lang === 'ar' 
                  ? 'إشعارات حية بنسبة حضور الحصص، نتائج الاختبارات الأسبوعية، وتشخيص نقاط الضعف التي تحتاج لتقوية مباشرة على موبايلك.'
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
              {isRtl ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
            </Link>
          </div>

          {/* Card 4: Centers */}
          <div className="glow-card" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(245,158,11,0.15)',
                color: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Building2 size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {lang === 'ar' ? 'للسناتر والمراكز التعليمية' : 'For Learning Centers'}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                {lang === 'ar' 
                  ? 'إدارة متكاملة للقاعات والمجموعات، جداول المدرسين، ونظام دومين مخصص وهوية كاملة باسم السنتر.'
                  : 'Multi-teacher oversight, hall schedules, consolidated revenue split, and white-label branding.'}
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
              {isRtl ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EGYPTIAN STATS BANNER
         ========================================================================= */}
      <section style={{
        padding: '50px 24px',
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
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
          <div>
            <div style={{ fontSize: '38px', fontWeight: '900', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              34,800+
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {lang === 'ar' ? 'طالب ثانوي نشط في مصر' : 'Active High School Students'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '38px', fontWeight: '900', color: '#06B6D4', fontFamily: 'var(--font-heading)' }}>
              1,420+
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {lang === 'ar' ? 'معلم وسنتر مسجل ومعتمد' : 'Verified Egyptian Educators'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '38px', fontWeight: '900', color: '#10B981', fontFamily: 'var(--font-heading)' }}>
              99.4%
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {lang === 'ar' ? 'دقة تفريغ المصطلحات العلمية' : 'Dialect & Scientific Accuracy'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '38px', fontWeight: '900', color: '#F59E0B', fontFamily: 'var(--font-heading)' }}>
              8+ {lang === 'ar' ? 'ساعات' : 'Hours'}
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {lang === 'ar' ? 'يوفرها المعلم أسبوعياً في التحضير' : 'Saved Weekly per Educator'}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TESTIMONIALS FROM EGYPTIAN EDUCATORS & STUDENTS
         ========================================================================= */}
      <section style={{ padding: 'clamp(50px, 6vw, 80px) 16px', maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.75rem)', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
            {lang === 'ar' ? 'ماذا يقول كبار المعلمين وأوائل الجمهورية عن متفوّق؟' : 'Trusted by Top Educators & High Achievers'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {lang === 'ar' ? 'تجارب حقيقية من قاعات السناتر والمدارس في القاهرة والإسكندرية والمنصورة' : 'Real success stories across Cairo, Alexandria, and Mansoura'}
          </p>
        </div>

          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', gap: '4px', color: '#F59E0B', marginBottom: '14px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" />)}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '18px' }}>
              {lang === 'ar'
                ? '"أنا بشرح الأحياء لأكثر من 1,200 طالب في الأسبوع. خريطة المفاهيم التفاعلية وفرت عليا مراجعات لا تنتهي. الطالب بقى يدخل على المفهوم اللي مش فاهمه ويسمع الدقيقة بتاعته فوراً."'
                : '"I teach biology to 1,200+ students weekly. The concept map saves me endless revision hours. Students click directly on the confusing concept and listen instantly."'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} alt="" />
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'د. سلمى السيد' : 'Dr. Salma El-Sayed'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {lang === 'ar' ? 'كبير معلمي الأحياء - الدقي والمهندسين' : 'Senior Biology Teacher - Dokki & Mohandessin'}
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', gap: '4px', color: '#F59E0B', marginBottom: '14px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" />)}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '18px' }}>
              {lang === 'ar'
                ? '"كل دقيقة في المذاكرة بتفرق. ملخصات كورنيل وبنك الأسئلة المولد من شرح المستر خلاني أحل أسئلة الامتحانات وأنا واثق جداً من نفسي والحمد لله جبت 98.4%."'
                : '"Every study minute matters. The Cornell summaries and AI-generated quizzes gave me the confidence to ace my exams. Scored 98.4%!"'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} alt="" />
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {lang === 'ar' ? 'عمر طارق القاضي' : 'Omar Tarek El-Kady'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {lang === 'ar' ? 'طالب متفوق - شعبة علمي علوم' : 'High Achieving Student - Science Division'}
                </div>
              </div>
            </div>
          </div>
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
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '14px' }}>
            {lang === 'ar' ? 'جاهز للانطلاق نحو القمة في دراستك وتدريسك؟' : 'Ready to Transform Your Teaching and Learning?'}
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            {lang === 'ar' ? 'انضم الآن مجاناً وابدأ تجربة محرك الذكاء الاصطناعي الأقوى في مصر.' : 'Join free today and experience Egypt’s most powerful educational AI engine.'}
          </p>
          <Link
            to="/register"
            className="btn btn-primary btn-lg"
            style={{
              padding: '16px 40px',
              fontSize: '16px',
              fontWeight: '800',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              boxShadow: '0 12px 32px rgba(108,77,255,0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span>{t('ctaGetStarted')}</span>
            {isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
          </Link>
        </div>
      </section>

      {/* =========================================================================
          FOOTER with Egyptian Payment Badges & Brand Info
         ========================================================================= */}
      <footer style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        padding: 'clamp(30px, 4vw, 50px) 16px 24px'
      }}>
        <div
          className="footer-top-row"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            paddingBottom: '30px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={isDark ? '/logo-dark.png' : '/logo-light.png'} alt="متفوّق" style={{ width: '36px', height: '36px' }} />
            <div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'متفوّق | Motafawweq' : 'Motafawweq'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {t('tagline')}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links" style={{ display: 'flex', gap: '20px', fontSize: '13px', fontWeight: '600' }}>
            <Link to="/features" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('navFeatures')}</Link>
            <Link to="/pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('navPricing')}</Link>
            <Link to="/marketplace" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('navMarketplace')}</Link>
            <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{t('navLogin')}</Link>
          </div>

          {/* Egyptian Payment Badges */}
          <div className="footer-payment-badges" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>{lang === 'ar' ? 'طرق الدفع المتاحة في مصر:' : 'Supported Payments in Egypt:'}</span>
            <span style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', fontWeight: '700', color: 'var(--text-primary)' }}>Fawry</span>
            <span style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', fontWeight: '700', color: 'var(--text-primary)' }}>Vodafone Cash</span>
            <span style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', fontWeight: '700', color: 'var(--text-primary)' }}>InstaPay</span>
          </div>
        </div>

        <div
          className="footer-bottom-row"
          style={{
            maxWidth: '1200px',
            margin: '20px auto 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}
        >
          <div>© {new Date().getFullYear()} {lang === 'ar' ? 'منصة متفوّق (Motafawweq). جميع الحقوق محفوظة.' : 'Motafawweq Inc. All rights reserved.'}</div>
          <div>{lang === 'ar' ? 'صُنعت بحب في مصر 🇪🇬 لتطوير التعليم' : 'Crafted with passion in Egypt 🇪🇬'}</div>
        </div>
      </footer>
    </div>
  );
};
