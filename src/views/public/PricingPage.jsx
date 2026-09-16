import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Check, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';

export const PricingPage = () => {
  const { navigate, switchRole } = useAuth();
  const { lang, isRtl } = useLanguage();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

  const discount = billingCycle === 'yearly' ? 0.8 : 1;

  const plans = [
    {
      id: 'free',
      name: lang === 'ar' ? 'الباقة المجانية' : 'Starter Free',
      tagline: lang === 'ar' ? 'لتجربة محرك التسجيل والخرائط' : 'Try the core transcription & map engine',
      price: 0,
      period: lang === 'ar' ? 'دائماً مجاناً' : 'Forever free',
      color: 'var(--text-secondary)',
      features: [
        lang === 'ar' ? '60 دقيقة معالجة صوتية شهرياً' : '60 AI audio processing mins/mo',
        lang === 'ar' ? 'مجموعة طلابية واحدة (حتى 30 طالب)' : '1 class group (up to 30 students)',
        lang === 'ar' ? 'خريطة معرفية مبسطة' : 'Standard knowledge map',
        lang === 'ar' ? 'توليد 5 أسئلة لكل حصة' : '5 auto-generated quiz questions',
        lang === 'ar' ? 'دعم فني عبر البريد' : 'Standard email support'
      ],
      cta: lang === 'ar' ? 'ابدأ مجاناً الآن' : 'Get Started Free',
      role: 'teacher'
    },
    {
      id: 'teacher-pro',
      name: lang === 'ar' ? 'معلم محترف (Teacher Pro)' : 'Teacher Pro',
      tagline: lang === 'ar' ? 'الخيار الأكثر شعبية لمعلمي الثانوية والإعدادية' : 'Most popular for top Egyptian tutors',
      price: Math.round(399 * discount),
      period: lang === 'ar' ? 'جنيه مصري / شهرياً' : 'EGP / month',
      popular: true,
      color: 'var(--primary)',
      features: [
        lang === 'ar' ? '300 دقيقة معالجة ذكية شهرياً' : '300 AI processing mins/mo',
        lang === 'ar' ? 'مجموعات وفصول غير محدودة' : 'Unlimited classes & students',
        lang === 'ar' ? 'خرائط معرفية ثلاثية الأبعاد تفاعلية' : 'Interactive draggable knowledge graphs',
        lang === 'ar' ? 'ملخصات كورنيل وبنوك أسئلة بلا حدود' : 'Full Cornell notes & unlimited exam builder',
        lang === 'ar' ? 'إرسال تقارير الحضور والغياب لأولياء الأمور' : 'Automated WhatsApp/SMS parent alerts',
        lang === 'ar' ? 'تحصيل الاشتراكات والمحفظة بنسبة 5% فقط' : 'Payment gateway integration (5% fee)',
        lang === 'ar' ? 'دعم فني مخصص VIP' : 'Priority VIP WhatsApp support'
      ],
      cta: lang === 'ar' ? 'اشترك في باقة المعلم' : 'Start Teacher Pro',
      role: 'teacher'
    },
    {
      id: 'student-plus',
      name: lang === 'ar' ? 'طالب بلس (Student Plus)' : 'Student Plus',
      tagline: lang === 'ar' ? 'للطالب الراغب في التفوق وأعلى الدرجات' : 'For ambitious Thanawya Amma students',
      price: Math.round(49 * discount),
      period: lang === 'ar' ? 'جنيه مصري / شهرياً' : 'EGP / month',
      color: '#06B6D4',
      features: [
        lang === 'ar' ? 'الوصول لغرفة المذاكرة التفاعلية' : 'Full interactive audio study room',
        lang === 'ar' ? 'القفز اللحظي من النص لتسجيل الحصة' : 'Click-to-jump audio seeker in transcripts',
        lang === 'ar' ? 'تشخيص ذكي لنقاط الضعف' : 'AI weak areas diagnostics & review queues',
        lang === 'ar' ? 'امتحانات تدريبية ذكية غير محدودة' : 'Unlimited practice smart quizzes',
        lang === 'ar' ? 'نقاط الخبرة وعداد الحماس اليومي 🔥' : 'XP leaderboards & study streak 🔥'
      ],
      cta: lang === 'ar' ? 'اشترك كطالب' : 'Get Student Plus',
      role: 'student'
    },
    {
      id: 'center',
      name: lang === 'ar' ? 'سنتر تعليمي (Academy Center)' : 'Center Academy',
      tagline: lang === 'ar' ? 'لإدارة السناتر والفروع المتعددة' : 'For learning centers & multi-branch hubs',
      price: Math.round(999 * discount),
      period: lang === 'ar' ? 'جنيه مصري / شهرياً' : 'EGP / month',
      color: '#F59E0B',
      features: [
        lang === 'ar' ? '1,500 دقيقة معالجة صوتية شهرياً' : '1,500 AI minutes pooled for all teachers',
        lang === 'ar' ? 'إدارة حتى 25 معلماً و 2,000 طالب' : 'Up to 25 teachers & 2,000 students',
        lang === 'ar' ? 'هوية السنتر الخاصة ودومين مخصص (White-Label)' : 'Custom branding, logo & domain',
        lang === 'ar' ? 'جدول حجز القاعات والشاشات الذكية' : 'Hall scheduling & room occupancy',
        lang === 'ar' ? 'تقارير مالية مجمعة ونسب أرباح المدرسين' : 'Automated revenue share splits',
        lang === 'ar' ? 'مدير حساب مخصص وتدريب ميداني' : 'Dedicated account manager & staff training'
      ],
      cta: lang === 'ar' ? 'تواصل مع فريق السناتر' : 'Get Center Suite',
      role: 'center'
    }
  ];

  return (
    <div style={{
      maxWidth: 'var(--max-content-width)',
      margin: '0 auto',
      padding: '60px 24px 100px'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 14px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--primary-surface)',
          color: 'var(--primary)',
          fontSize: '12px',
          fontWeight: '700',
          marginBottom: '16px'
        }}>
          <Sparkles size={14} />
          <span>{lang === 'ar' ? 'أسعار واضحة وعادلة بالجنيه المصري 🇪🇬' : 'Transparent Egyptian Pricing in EGP 🇪🇬'}</span>
        </div>

        <h1 style={{
          fontSize: '38px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          marginBottom: '16px',
          fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
        }}>
          {lang === 'ar' ? 'استثمر في راحة بالك ونجاح طلابك' : 'Simple, Transparent Pricing Plans'}
        </h1>

        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {lang === 'ar' 
            ? 'سواء كنت معلماً مستقلاً، طالباً في الثانوية العامة، أو سنتر تعليمي عملاق، لدينا الباقة المناسبة تماماً لاحتياجاتك.'
            : 'Whether you are a solo tutor, Thanawya student, or multi-branch center, choose the tier built for your goals.'}
        </p>

        {/* Billing Toggle (Monthly / Yearly) */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          marginTop: '24px'
        }}>
          <button
            onClick={() => setBillingCycle('monthly')}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: billingCycle === 'monthly' ? 'var(--primary)' : 'transparent',
              color: billingCycle === 'monthly' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {lang === 'ar' ? 'الدفع شهرياً' : 'Monthly'}
          </button>

          <button
            onClick={() => setBillingCycle('yearly')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 20px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: billingCycle === 'yearly' ? 'var(--primary)' : 'transparent',
              color: billingCycle === 'yearly' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{lang === 'ar' ? 'الدفع سنوياً' : 'Annually'}</span>
            <span style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: billingCycle === 'yearly' ? 'rgba(255,255,255,0.25)' : '#10B981',
              color: '#FFFFFF'
            }}>
              {lang === 'ar' ? 'خصم 20%' : 'Save 20%'}
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px',
        alignItems: 'stretch'
      }}>
        {plans.map(plan => (
          <div
            key={plan.id}
            style={{
              position: 'relative',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: plan.popular ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              padding: '32px 24px',
              boxShadow: plan.popular ? '0 16px 36px rgba(108, 77, 255, 0.2)' : 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transform: plan.popular ? 'scale(1.03)' : 'none',
              zIndex: plan.popular ? 2 : 1
            }}
          >
            {plan.popular && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                padding: '4px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 12px rgba(108, 77, 255, 0.4)'
              }}>
                {lang === 'ar' ? 'الأكثر طلباً بين المدرسين' : 'MOST POPULAR'}
              </div>
            )}

            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
                {plan.name}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', minHeight: '38px' }}>
                {plan.tagline}
              </p>

              {/* Price Tag */}
              <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '38px', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Feature List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {plan.features.map((feat, idx) => (
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
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                switchRole(plan.role);
                navigate(plan.role === 'teacher' ? 'recording-studio' : (plan.role === 'student' ? 'student-dashboard' : 'center-portal'));
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: plan.popular ? 'var(--primary)' : 'var(--bg-subtle)',
                color: plan.popular ? '#FFFFFF' : 'var(--text-primary)',
                border: plan.popular ? 'none' : '1px solid var(--border-subtle)',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: plan.popular ? '0 6px 18px rgba(108, 77, 255, 0.35)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
