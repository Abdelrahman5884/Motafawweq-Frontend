import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Check, 
  Sparkles, 
  Zap, 
  Shield, 
  ArrowRight, 
  ArrowLeft,
  Building2, 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  Award,
  Crown,
  HelpCircle,
  Clock
} from 'lucide-react';
import { CENTER_SUBSCRIPTION_PLANS } from '../../data/centerData';
import { TEACHER_SUBSCRIPTION_PLANS } from '../../data/teacherData';

export const PricingPage = () => {
  const { navigate, switchRole } = useAuth();
  const { lang, isRtl } = useLanguage();
  const [selectedRole, setSelectedRole] = useState('center'); // 'center' | 'teacher' | 'student'
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

  const discount = billingCycle === 'yearly' ? 0.8 : 1;
  const ActionArrow = isRtl ? ArrowLeft : ArrowRight;

  // Student specific plans
  const studentPlans = [
    {
      id: 'student-free',
      nameAr: 'طالب مجاني',
      nameEn: 'Student Free',
      tier: 'free',
      taglineAr: 'للاطلاع على الحصص والمحتوى الأساسي',
      taglineEn: 'Access base lecture materials & recordings',
      price: 0,
      periodAr: 'دائماً مجاناً',
      periodEn: 'Forever Free',
      color: 'var(--text-secondary)',
      popular: false,
      usersLimitAr: 'حساب شخصي لطالب واحد',
      usersLimitEn: 'Single student account',
      featuresAr: [
        'الوصول للحصص المسجلة والمرفوعة من المدرسين',
        'حل الواجبات الأساسية واستلام الدرجات',
        'متابعة جدول الحصص الأسبوعي',
        'دعم عبر مجتمع الطلاب'
      ],
      featuresEn: [
        'Access recorded lessons uploaded by tutors',
        'Submit standard homework & view scores',
        'View weekly sessions schedule',
        'Community forum support'
      ],
      role: 'student',
      ctaAr: 'ابدأ كطالب مجاناً',
      ctaEn: 'Start Free as Student'
    },
    {
      id: 'student-plus',
      nameAr: 'طالب بلس (Student Plus)',
      nameEn: 'Student Plus',
      tier: 'plus',
      taglineAr: 'للطالب الراغب في الفهم العميق وأعلى الدرجات',
      taglineEn: 'For ambitious students aiming for top marks',
      price: Math.round(49 * discount),
      periodAr: 'جنيه مصري / شهرياً',
      periodEn: 'EGP / month',
      color: '#06B6D4',
      popular: true,
      usersLimitAr: 'حساب طالب VIP مميز',
      usersLimitEn: 'VIP Student account',
      featuresAr: [
        'الوصول الكامل لغرفة المذاكرة التفاعلية بالذكاء الاصطناعي',
        'القفز اللحظي من النص لتسجيل الحصة (Hyperlinked Timestamps)',
        'مركز تقوية نقاط الضعف الذكي والتدريب الموجه (Weak Areas Hub)',
        'تصفح خرائط المفاهيم التفاعلية ثلاثية الأبعاد',
        'امتحانات تدريبية تفاعلية غير محدودة مع شرح الإجابات',
        'جمع نقاط الخبرة (XP) والتنافس في دوري المتفوقين'
      ],
      featuresEn: [
        'Full AI interactive audio-linked study room',
        'Click-to-jump audio seeker in lecture transcripts',
        'AI Weak Areas Diagnostics & personalized drills',
        'Interactive 3D knowledge concept maps',
        'Unlimited practice smart quizzes with solution keys',
        'XP leaderboards & weekly student challenge leagues'
      ],
      role: 'student',
      ctaAr: 'اشترك كطالب بلس',
      ctaEn: 'Upgrade to Student Plus'
    }
  ];

  // Convert teacher plans to display cards
  const teacherCards = TEACHER_SUBSCRIPTION_PLANS.map(p => ({
    id: p.id,
    nameAr: p.nameAr,
    nameEn: p.nameEn,
    tier: p.tier,
    taglineAr: p.tier === 'free' ? 'لتجربة محرك التسجيل والخرائط' : (p.tier === 'plus' ? 'الأنسب لمعلمي المجموعات والسناتر' : 'الخيار الأكثر شعبية لمعلمي الثانوية والإعدادية'),
    taglineEn: p.tier === 'free' ? 'Try the core transcription engine' : (p.tier === 'plus' ? 'Ideal for tutoring cohorts' : 'Most popular for top Egyptian tutors'),
    price: Math.round(p.pricing[billingCycle === 'yearly' ? 'annual' : 'monthly'].priceEgp * (billingCycle === 'yearly' ? (1/10) : 1)),
    periodAr: p.tier === 'free' ? 'دائماً مجاناً' : (billingCycle === 'yearly' ? 'ج.م / شهرياً (تدفع سنوياً)' : 'جنيه مصري / شهرياً'),
    periodEn: p.tier === 'free' ? 'Forever Free' : (billingCycle === 'yearly' ? 'EGP / mo (billed yearly)' : 'EGP / month'),
    usersLimitAr: p.tier === 'free' ? 'حتى 50 طالباً' : (p.tier === 'plus' ? 'حتى 500 طالب نشط' : 'طلاب غير محدودين (Unlimited)'),
    usersLimitEn: p.tier === 'free' ? 'Up to 50 students' : (p.tier === 'plus' ? 'Up to 500 active students' : 'Unlimited students'),
    color: p.color,
    popular: p.popular,
    featuresAr: p.featuresAr.slice(0, 6),
    featuresEn: p.featuresEn.slice(0, 6),
    role: 'teacher',
    ctaAr: p.tier === 'free' ? 'ابدأ كمعلم مجاناً' : (p.tier === 'plus' ? 'اشترك في باقة بلس' : 'اشترك في باقة برو'),
    ctaEn: p.tier === 'free' ? 'Start as Teacher Free' : (p.tier === 'plus' ? 'Get Teacher Plus' : 'Get Teacher Pro')
  }));

  // Convert center plans to display cards (Free, Plus 200 EGP, Pro 400 EGP)
  const centerCards = CENTER_SUBSCRIPTION_PLANS.map(p => ({
    id: p.id,
    nameAr: p.nameAr,
    nameEn: p.nameEn,
    tier: p.tier,
    taglineAr: p.taglineAr,
    taglineEn: p.taglineEn,
    price: billingCycle === 'yearly' ? Math.round(p.pricing.annual.priceEgp / 10) : p.pricing.monthly.priceEgp,
    periodAr: p.tier === 'free' ? 'دائماً مجاناً' : (billingCycle === 'yearly' ? 'ج.م / شهرياً (تدفع سنوياً)' : 'جنيه مصري / شهرياً'),
    periodEn: p.tier === 'free' ? 'Forever Free' : (billingCycle === 'yearly' ? 'EGP / mo (billed yearly)' : 'EGP / month'),
    usersLimitAr: p.usersLimitAr,
    usersLimitEn: p.usersLimitEn,
    color: p.color,
    popular: p.popular,
    featuresAr: p.featuresAr,
    featuresEn: p.featuresEn,
    role: 'center',
    ctaAr: p.tier === 'free' ? 'ابدأ للسنتر مجاناً' : (p.tier === 'plus' ? 'اشترك في سنتر بلس (200 ج.م)' : 'اشترك في سنتر برو (400 ج.م)'),
    ctaEn: p.tier === 'free' ? 'Start Center Free' : (p.tier === 'plus' ? 'Get Center Plus (200 EGP)' : 'Get Center Pro (400 EGP)')
  }));

  // Active cards according to selected role
  const activePlans = selectedRole === 'center' ? centerCards : (selectedRole === 'teacher' ? teacherCards : studentPlans);

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '50px 20px 100px',
      fontFamily: isRtl ? 'var(--font-arabic, "Cairo", sans-serif)' : 'var(--font-sans, "Inter", sans-serif)'
    }}>
      {/* ══════════════════ HERO SECTION ══════════════════ */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(21, 136, 199, 0.12)',
          border: '1px solid rgba(21, 136, 199, 0.28)',
          color: 'var(--primary, #1588C7)',
          fontSize: '12.5px',
          fontWeight: '700',
          marginBottom: '16px'
        }}>
          <Sparkles size={15} />
          <span>{lang === 'ar' ? 'أسعار عادلة وشفافة بالجنيه المصري 🇪🇬' : 'Transparent Pricing in Egyptian Pounds 🇪🇬'}</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(30px, 4vw, 42px)',
          fontWeight: '900',
          color: 'var(--text-primary)',
          marginBottom: '16px',
          lineHeight: 1.25
        }}>
          {lang === 'ar' ? 'باقات مرنة تناسب السناتر، المدرسين، والطلاب' : 'Flexible Plans Tailored for Centers, Teachers & Students'}
        </h1>

        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: '680px', margin: '0 auto' }}>
          {lang === 'ar' 
            ? 'اختر باقة السنتر المناسبة لحجم طلابك، أو باقات المعلم الفردي، مع فترة تجربة مجانية وإمكانية الإلغاء أو الترقية في أي وقت.'
            : 'Select the ideal plan for your learning center capacity or individual tutoring, with free trial access and flexible scaling.'}
        </p>

        {/* ══════════════════ ROLE SELECTOR TABS ══════════════════ */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px',
          borderRadius: '16px',
          backgroundColor: 'var(--bg-subtle, #f1f5f9)',
          border: '1px solid var(--border-medium)',
          marginTop: '28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <button
            onClick={() => setSelectedRole('center')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: selectedRole === 'center' ? 'var(--primary, #1588C7)' : 'transparent',
              color: selectedRole === 'center' ? '#FFFFFF' : 'var(--text-primary)',
              fontSize: '13.5px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: selectedRole === 'center' ? '0 4px 12px rgba(21, 136, 199, 0.35)' : 'none'
            }}
          >
            <Building2 size={16} />
            <span>{lang === 'ar' ? 'باقات السناتر التعليمية' : 'Center Academy Plans'}</span>
            <span style={{
              fontSize: '11px',
              padding: '2px 7px',
              borderRadius: '9999px',
              backgroundColor: selectedRole === 'center' ? 'rgba(255,255,255,0.25)' : 'var(--bg-surface-elevated, #FFFFFF)',
              color: selectedRole === 'center' ? '#FFFFFF' : 'var(--primary)'
            }}>
              {lang === 'ar' ? 'جديد 200 & 400 ج.م' : 'New 200/400'}
            </span>
          </button>

          <button
            onClick={() => setSelectedRole('teacher')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: selectedRole === 'teacher' ? 'var(--primary, #1588C7)' : 'transparent',
              color: selectedRole === 'teacher' ? '#FFFFFF' : 'var(--text-primary)',
              fontSize: '13.5px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: selectedRole === 'teacher' ? '0 4px 12px rgba(21, 136, 199, 0.35)' : 'none'
            }}
          >
            <Users size={16} />
            <span>{lang === 'ar' ? 'باقات المعلمين' : 'Teacher Plans'}</span>
          </button>

          <button
            onClick={() => setSelectedRole('student')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: selectedRole === 'student' ? 'var(--primary, #1588C7)' : 'transparent',
              color: selectedRole === 'student' ? '#FFFFFF' : 'var(--text-primary)',
              fontSize: '13.5px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: selectedRole === 'student' ? '0 4px 12px rgba(21, 136, 199, 0.35)' : 'none'
            }}
          >
            <GraduationCap size={16} />
            <span>{lang === 'ar' ? 'باقات الطلاب' : 'Student Plans'}</span>
          </button>
        </div>

        {/* ══════════════════ BILLING CYCLE TOGGLE (MONTHLY / YEARLY) ══════════════════ */}
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: billingCycle === 'monthly' ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: billingCycle === 'monthly' ? '700' : '500' }}>
            {lang === 'ar' ? 'الدفع شهرياً' : 'Monthly'}
          </span>

          <button
            onClick={() => setBillingCycle(b => b === 'monthly' ? 'yearly' : 'monthly')}
            style={{
              width: '52px',
              height: '28px',
              borderRadius: '9999px',
              backgroundColor: 'var(--primary, #1588C7)',
              border: 'none',
              padding: '3px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: billingCycle === 'yearly' ? 'flex-end' : 'flex-start',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </button>

          <span style={{ fontSize: '13px', color: billingCycle === 'yearly' ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: billingCycle === 'yearly' ? '700' : '500' }}>
            {lang === 'ar' ? 'الدفع سنوياً' : 'Yearly'}
          </span>

          <span style={{
            fontSize: '11px',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '9999px',
            backgroundColor: '#10B981',
            color: '#FFFFFF'
          }}>
            {lang === 'ar' ? 'وفر 20% - 25%' : 'Save up to 25%'}
          </span>
        </div>
      </div>

      {/* ══════════════════ ROLE INTRO BANNER ══════════════════ */}
      {selectedRole === 'center' && (
        <div style={{
          backgroundColor: 'rgba(139, 92, 246, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: '16px',
          padding: '18px 24px',
          maxWidth: '820px',
          margin: '0 auto 36px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          textAlign: isRtl ? 'right' : 'left'
        }}>
          <Building2 size={28} color="#8B5CF6" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px' }}>
              {lang === 'ar' ? 'تقسيمة باقات السنتر التعليمي (مجاني — بلس 200 ج.م — برو 400 ج.م)' : 'Learning Center Pricing Tiers (Free — Plus 200 EGP — Pro 400 EGP)'}
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {lang === 'ar'
                ? 'تم تصميم باقة بلس (200 ج.م/شهر) للسناتر المتوسطة بسعة محددة حتى 500 مستخدم، وباقة برو (400 ج.م/شهر) بعدد مستخدمين وطلاب غير محدود وبكامل ميزات الهوية الخاصة والربط مع واتساب.'
                : 'Plus plan (200 EGP/mo) is optimized for medium centers with up to 500 users, while Pro plan (400 EGP/mo) provides unlimited users, white-label branding, and WhatsApp integration.'}
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════ PRICING CARDS GRID ══════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '26px',
        alignItems: 'stretch',
        marginBottom: '60px'
      }}>
        {activePlans.map(plan => {
          const isPop = plan.popular;
          return (
            <div
              key={plan.id}
              style={{
                position: 'relative',
                backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)',
                border: isPop ? `2px solid ${plan.color}` : '1px solid var(--border-medium)',
                borderRadius: '20px',
                padding: '34px 28px',
                boxShadow: isPop ? `0 16px 36px ${plan.color}30` : 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              {isPop && (
                <div style={{
                  position: 'absolute',
                  top: '-13px',
                  [isRtl ? 'right' : 'left']: '28px',
                  backgroundColor: plan.color,
                  color: '#FFFFFF',
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: '800',
                  letterSpacing: '0.4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: `0 4px 12px ${plan.color}40`
                }}>
                  <Crown size={13} />
                  <span>{lang === 'ar' ? 'الباقة الأكثر طلباً' : 'MOST POPULAR'}</span>
                </div>
              )}

              <div>
                {/* Header & Tagline */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '21px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                    {lang === 'ar' ? plan.nameAr : plan.nameEn}
                  </h3>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '3px 9px',
                    borderRadius: '8px',
                    backgroundColor: `${plan.color}15`,
                    color: plan.color
                  }}>
                    {plan.tier.toUpperCase()}
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px', minHeight: '36px', lineHeight: 1.5 }}>
                  {lang === 'ar' ? plan.taglineAr : plan.taglineEn}
                </p>

                {/* Capacity User Limit Pill */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle, #f8fafc)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: '700',
                  marginBottom: '20px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <Users size={14} color={plan.color} />
                  <span>{lang === 'ar' ? plan.usersLimitAr : plan.usersLimitEn}</span>
                </div>

                {/* Price Tag */}
                <div style={{
                  marginBottom: '24px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid var(--border-medium)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{
                      fontSize: '44px',
                      fontWeight: '900',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-heading, inherit)'
                    }}>
                      {plan.price}
                    </span>
                    <span style={{ fontSize: '13.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                      {lang === 'ar' ? plan.periodAr : plan.periodEn}
                    </span>
                  </div>
                </div>

                {/* Feature List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  {(lang === 'ar' ? plan.featuresAr : plan.featuresEn).map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '2px',
                        flexShrink: 0
                      }}>
                        <Check size={12} color="#10B981" />
                      </div>
                      <span style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to action button */}
              <button
                onClick={() => {
                  switchRole(plan.role);
                  if (plan.role === 'center') navigate('/center/dashboard');
                  else if (plan.role === 'teacher') navigate('/teacher/studio');
                  else navigate('/student/dashboard');
                }}
                style={{
                  width: '100%',
                  padding: '13px 18px',
                  borderRadius: '12px',
                  backgroundColor: isPop ? plan.color : 'var(--bg-subtle, #f1f5f9)',
                  color: isPop ? '#FFFFFF' : 'var(--text-primary)',
                  border: isPop ? 'none' : '1px solid var(--border-medium)',
                  fontSize: '13.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: isPop ? `0 6px 18px ${plan.color}40` : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{lang === 'ar' ? plan.ctaAr : plan.ctaEn}</span>
                <ActionArrow size={15} />
              </button>
            </div>
          );
        })}
      </div>

      {/* ══════════════════ FAQ & ASSURANCE ══════════════════ */}
      <div style={{
        backgroundColor: 'var(--bg-surface-elevated, #FFFFFF)',
        border: '1px solid var(--border-medium)',
        borderRadius: '20px',
        padding: '36px 30px',
        maxWidth: '920px',
        margin: '0 auto',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
            {lang === 'ar' ? 'الأسئلة الشائعة حول باقات السناتر والاشتراكات' : 'Frequently Asked Questions about Center Pricing'}
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
            {lang === 'ar' ? 'كل ما تحتاج معرفته عن ترقية اشتراك السنتر وطرق الدفع المتاحة' : 'Everything you need to know about center tiers and payment options'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
          {[
            {
              qAr: 'ما الفرق الرئيسي بين باقة السنتر بلس (200 ج.م) والبرو (400 ج.م)؟',
              qEn: 'What is the main difference between Center Plus (200 EGP) and Pro (400 EGP)?',
              aAr: 'باقة بلس (200 ج.م) تمنحك حتى 500 مستخدم مع قارئ الباركود وجداول القاعات، بينما باقة برو (400 ج.م) تمنحك عدد مستخدمين وطلاب غير محدود، مع إشعارات واتساب فورية لأولياء الأمور وهوية السنتر الخاصة ودومين مخصص.',
              aEn: 'Center Plus (200 EGP) covers up to 500 users with QR gate scanning, while Center Pro (400 EGP) unlocks unlimited users, automated WhatsApp gate alerts to parents, and custom domain white-labeling.'
            },
            {
              qAr: 'ما هي طرق الدفع المتاحة لتجديد اشتراك السنتر؟',
              qEn: 'Which payment methods are accepted in Egypt?',
              aAr: 'نوفر الدفع الفوري والمحلي عبر إنستاباي (InstaPay)، فودافون كاش ومحافظ المحمول، فوري باي (Fawry Pay)، والبطاقات الائتمانية والبنكية (Visa / Mastercard).',
              aEn: 'We support local Egyptian payment options including InstaPay, Vodafone Cash, Fawry Pay, and Credit/Debit cards.'
            },
            {
              qAr: 'هل يمكنني تجربة المنصة مجاناً قبل الاشتراك في باقة بلس أو برو؟',
              qEn: 'Can we try the platform before subscribing to Plus or Pro?',
              aAr: 'نعم بالتأكيد! تتيح لك الباقة المجانية تجربة إدارة حتى 3 مدرسين و100 طالب وقاعتين لتتأكد من ملاءمة النظام لسنترك بالكامل.',
              aEn: 'Yes! The Free Center plan gives you full access to test with up to 3 teachers, 100 students, and 2 classrooms.'
            },
            {
              qAr: 'هل يحصل السنتر على تدريب لفريق العمل وموظفي الاستقبال؟',
              qEn: 'Does the center staff receive onboarding and training?',
              aAr: 'مشتركو باقة السنتر برو (400 ج.م) يحصلون على مدير حساب مخصص وجلسة تدريب مباشرة لموظفي الاستقبال على مسح الباركود وتنظيم الخزينة.',
              aEn: 'Center Pro subscribers get a dedicated account manager and specialized training for reception staff on QR gate check-ins.'
            }
          ].map((faq, i) => (
            <div
              key={i}
              style={{
                padding: '18px 20px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-subtle, #f8fafc)',
                border: '1px solid var(--border-medium)'
              }}
            >
              <h5 style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {lang === 'ar' ? faq.qAr : faq.qEn}
              </h5>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {lang === 'ar' ? faq.aAr : faq.aEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
