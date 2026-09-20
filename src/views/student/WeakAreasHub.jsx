import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AlertTriangle } from 'lucide-react';
import { WeakAreaCard } from '../../features/student/analytics';

export const WeakAreasHub = () => {
  const { navigate } = useAuth();
  const { lang, isRtl } = useLanguage();

  const weakConcepts = [
    {
      id: 'node-nadph',
      title: 'NADP+ & ATP Synthesis',
      titleAr: 'مركبا الطاقة التثبيتية (NADPH و ATP)',
      mastery: 64,
      status: 'Needs Immediate Review',
      statusAr: 'يحتاج مراجعة فورية',
      timestamp: '11:20',
      seconds: 680,
      mistakePattern: 'Confusing the role of NADP+ with chlorophyll pigments in photolysis.',
      mistakePatternAr: 'الخلط بين دور مستقبل الهيدروجين NADP+ وبين امتصاص الأصباغ للضوء.'
    },
    {
      id: 'node-pgal',
      title: 'PGAL Synthesis in Calvin Cycle',
      titleAr: 'تكوين فوسفو جليسرالدهيد (PGAL) في دورة كالفن',
      mastery: 68,
      status: 'Moderate Difficulty',
      statusAr: 'صعوبة متوسطة',
      timestamp: '19:00',
      seconds: 1140,
      mistakePattern: 'Forgetting that PGAL is formed after 2 seconds only and is a 3-carbon intermediate.',
      mistakePatternAr: 'نسيان أن PGAL يتكون بعد ثانيتين فقط وهو أول مركب ثابت ثلاثي الكربون.'
    },
    {
      id: 'node-dark',
      title: 'Dark Reactions in Stroma',
      titleAr: 'التفاعلات اللاضوئية في الستروما',
      mastery: 72,
      status: 'Improving',
      statusAr: 'قيد التحسن',
      timestamp: '14:45',
      seconds: 885,
      mistakePattern: 'Believing dark reactions can only occur at night.',
      mistakePatternAr: 'الاعتقاد الخاطئ بأن التفاعلات اللاضوئية تحدث في الليل فقط.'
    }
  ];

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '36px 24px 80px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <AlertTriangle size={20} color="var(--danger)" />
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--danger)', letterSpacing: '0.5px' }}>
            {lang === 'ar' ? 'تشخيص الذكاء الاصطناعي الذاتي' : 'AI Diagnostic Engine'}
          </span>
        </div>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          margin: '0 0 6px 0',
          fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
        }}>
          {lang === 'ar' ? 'مركز معالجة نقاط الضعف والمراجعة الذكية' : 'Weak Areas & Targeted Revision Hub'}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          {lang === 'ar' ? 'يقوم ليرنورا بتحليل أخطائك في الامتحانات ليرشدك مباشرة إلى اللحظات الزمنية التي يجب عليك إعادة سماعها دون إضاعة وقتك.' : 'Learnora pinpoints your exact quiz misconceptions and hyperlinks you directly to the 2-minute audio explanation.'}
        </p>
      </div>

      {/* Weak Concept Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {weakConcepts.map(c => (
          <WeakAreaCard
            key={c.id}
            concept={c}
            lang={lang}
            onListen={() => navigate('lesson-study')}
            onPractice={() => navigate('take-exam')}
          />
        ))}
      </div>
    </div>
  );
};
