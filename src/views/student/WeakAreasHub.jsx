import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_LESSON } from '../../data/mockData';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  Sparkles, 
  Brain, 
  HelpCircle, 
  ArrowRight,
  Clock
} from 'lucide-react';

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
          <AlertTriangle size={20} color="#EF4444" />
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#EF4444', letterSpacing: '0.5px' }}>
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
          <div
            key={c.id}
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#FEF2F2',
                    color: '#EF4444'
                  }}>
                    {lang === 'ar' ? c.statusAr : c.status}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    • {lang === 'ar' ? `نسبة الإتقان: ${c.mastery}%` : `Mastery: ${c.mastery}%`}
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                  {lang === 'ar' ? c.titleAr : c.title}
                </h3>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => navigate('lesson-study')}
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
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(108, 77, 255, 0.3)'
                  }}
                >
                  <Play size={13} fill="#FFFFFF" />
                  <span>{lang === 'ar' ? `سماع دقيقة [${c.timestamp}]` : `Listen [${c.timestamp}]`}</span>
                </button>

                <button
                  onClick={() => navigate('take-exam')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <HelpCircle size={14} color="var(--primary)" />
                  <span>{lang === 'ar' ? 'تدريب 5 أسئلة' : 'Practice 5 Qs'}</span>
                </button>
              </div>
            </div>

            {/* Mastery Bar */}
            <div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'var(--border-subtle)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${c.mastery}%`,
                  height: '100%',
                  backgroundColor: c.mastery < 70 ? '#EF4444' : '#F59E0B',
                  borderRadius: '4px'
                }} />
              </div>
            </div>

            {/* Misconception Diagnostic Note */}
            <div style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>{lang === 'ar' ? '💡 سبب الخطأ الشائع: ' : '💡 Common Misconception: '}</strong>
              {lang === 'ar' ? c.mistakePatternAr : c.mistakePattern}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
