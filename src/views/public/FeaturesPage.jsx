import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sparkles, 
  Mic, 
  FileText, 
  Share2, 
  Brain, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Layers
} from 'lucide-react';

export const FeaturesPage = () => {
  const { navigate, switchRole } = useAuth();
  const { lang, isRtl } = useLanguage();

  const features = [
    {
      title: lang === 'ar' ? 'تفريغ صوتي مصري فائق الدقة' : 'Proprietary Egyptian Dialect ASR',
      desc: lang === 'ar' 
        ? 'تم تدريب نماذج الذكاء الاصطناعي لدينا على آلاف الساعات من شروحات المدرسين المصريين، مما يضمن دقة لا مثيل لها في فهم المصطلحات العلمية الإنجليزية الممتزجة باللهجة العامية.'
        : 'Engineered specifically for Egyptian educators. Effortlessly transcribes mixed Egyptian Arabic dialect and advanced English terminology.',
      icon: Mic,
      color: '#6C4DFF'
    },
    {
      title: lang === 'ar' ? 'التوليد التلقائي لخرائط المعرفة' : 'Automated Concept Graphing',
      desc: lang === 'ar' 
        ? 'لا مزيد من الحفظ التلقيني. يحلل النظام العلاقات بين المفاهيم (السبب، النتيجة، المكونات) ويبني خريطة بصرية ترشد الطالب لكيفية ترابط أجزاء المنهج.'
        : 'Transforms linear lectures into interactive visual concept graphs, illustrating hierarchical and functional connections across chapters.',
      icon: Share2,
      color: '#06B6D4'
    },
    {
      title: lang === 'ar' ? 'القفز الزمني اللحظي للصوت' : 'Hyperlinked Audio Timestamps',
      desc: lang === 'ar' 
        ? 'كل كلمة في التفريغ النصي وكل عقدة في خريطة المعرفة مربوطة بالثانية الدقيقة في التسجيل الصوتي. بنقرة واحدة يقفز الطالب للنقطة التي يريد مراجعتها.'
        : 'Deep-links every transcript word and knowledge map node to exact audio seconds. No more endless scrubbing to find key explanations.',
      icon: Zap,
      color: '#4C8DFF'
    },
    {
      title: lang === 'ar' ? 'ملخصات كورنيل ومصائد الامتحانات' : 'Cornell Notes & Exam Traps',
      desc: lang === 'ar' 
        ? 'يلخص النظام الدرس في شكل أسئلة وملاحظات هامشية ومعادلات كيميائية، مع تسليط الضوء على الخدع والمصائد الشائعة في امتحانات الثانوية العامة.'
        : 'Synthesizes high-yield Cornell study sheets, mathematical/chemical formulas, and warnings regarding notorious board exam traps.',
      icon: Brain,
      color: '#10B981'
    },
    {
      title: lang === 'ar' ? 'توليد الاختبارات المتكيفة' : 'Adaptive AI Question Generator',
      desc: lang === 'ar' 
        ? 'توليد أسئلة اختيار من متعدد فورية بعد كل حصة تقيس الفهم والتطبيق والتحليل، مع تقديم تعليلات نموذجية لكل إجابة.'
        : 'Generates tiered questions (recall, application, high-order thinking) directly based on the concepts discussed in the lecture.',
      icon: Sparkles,
      color: '#F59E0B'
    },
    {
      title: lang === 'ar' ? 'منظومة السنتر وهوية المؤسسة' : 'Multi-Teacher & White-Label Suite',
      desc: lang === 'ar' 
        ? 'حل متكامل للسناتر التعليمية الكبرى: إدارة قاعات، جداول المدرسين، توزيع الإيرادات، وتطبيق هويتكم البصرية ودومينكم المخصص.'
        : 'Turnkey infrastructure for major learning centers with multi-teacher rosters, room scheduling, revenue splits, and full custom branding.',
      icon: Layers,
      color: '#EC4899'
    }
  ];

  return (
    <div style={{
      maxWidth: 'var(--max-content-width)',
      margin: '0 auto',
      padding: '50px 24px 100px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 60px' }}>
        <h1 style={{
          fontSize: '38px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          marginBottom: '16px',
          fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
        }}>
          {lang === 'ar' ? 'المحرك التعليمي الأكثر تطوراً في الشرق الأوسط' : 'Built for the Demands of Modern Education'}
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {lang === 'ar'
            ? 'اكتشف كيف تندمج أحدث تقنيات معالجة اللغات الطبيعية والشبكات المعرفية مع واقع التعليم المصري لتقديم تجربة لا تضاهى.'
            : 'Explore how generative AI and structured knowledge graphs converge to eliminate busywork for educators and amplify student retention.'}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '28px',
        marginBottom: '60px'
      }}>
        {features.map((feat, idx) => {
          const FeatIcon = feat.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-xl)',
                padding: '32px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = feat.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-medium)';
              }}
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: `${feat.color}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <FeatIcon size={22} color={feat.color} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
                {feat.title}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {feat.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Try demo CTA */}
      <div style={{
        backgroundColor: 'var(--primary-surface)',
        border: '1px solid var(--primary-light)',
        borderRadius: 'var(--radius-xl)',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '680px',
        margin: '0 auto'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
          {lang === 'ar' ? 'شاهد كل ذلك يعمل عملياً في ثوانٍ' : 'Experience the AI Pipeline in Real-Time'}
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {lang === 'ar' ? 'ادخل إلى استوديو التسجيل التجريبي أو استعرض خريطة المعرفة لحصة الأحياء النموذجية.' : 'Step into the recording studio demo or test the interactive knowledge map now.'}
        </p>
        <button
          onClick={() => {
            switchRole('teacher');
            navigate('lesson-workspace');
          }}
          style={{
            padding: '12px 28px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(108, 77, 255, 0.35)'
          }}
        >
          {lang === 'ar' ? 'فتح مساحة الدرس التفاعلية' : 'Open Interactive Lesson Workspace'}
        </button>
      </div>
    </div>
  );
};
