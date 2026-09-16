import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  Mic, 
  FileText, 
  Share2, 
  Brain, 
  Zap, 
  ArrowRight
} from 'lucide-react';

export const AIProcessingScreen = () => {
  const { navigate } = useAuth();
  const { lang, isRtl } = useLanguage();
  const [progress, setProgress] = useState(12);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    {
      id: 0,
      title: lang === 'ar' ? 'رفع الصوت وعزل الضوضاء الخلفية للقاعة' : 'Uploading & Classroom Noise Suppression',
      icon: Mic,
      threshold: 15
    },
    {
      id: 1,
      title: lang === 'ar' ? 'تفريغ دقيق بالذكاء الاصطناعي (اللهجة المصرية والمصطلحات)' : 'Whisper ASR: Egyptian Dialect & Scientific Jargon',
      icon: FileText,
      threshold: 35
    },
    {
      id: 2,
      title: lang === 'ar' ? 'اكتشاف الفصول وفهرسة اللحظات الزمنية بالثواني' : 'Chapter Segmentation & Timestamp Indexing',
      icon: Sparkles,
      threshold: 55
    },
    {
      id: 3,
      title: lang === 'ar' ? 'استخراج المفاهيم وبناء خريطة المعرفة التفاعلية' : 'Knowledge Graph: Concept Extraction & Mapping',
      icon: Share2,
      threshold: 75
    },
    {
      id: 4,
      title: lang === 'ar' ? 'توليد ملخص كورنيل، المعادلات، ومصائد الامتحانات' : 'Synthesizing Cornell Summary & Thanawya Exam Traps',
      icon: Brain,
      threshold: 90
    },
    {
      id: 5,
      title: lang === 'ar' ? 'صياغة 12 سؤال اختيار متعدد بمستويات تفكير متدرجة' : 'Generating Adaptive Assessment & Question Bank',
      icon: Zap,
      threshold: 100
    }
  ];

  // Progress stepper simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        return Math.min(100, next);
      });
    }, 600);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const current = steps.findIndex(s => progress < s.threshold);
    if (current === -1) {
      setCurrentStepIndex(steps.length - 1);
    } else {
      setCurrentStepIndex(current);
    }
  }, [progress]);

  const isComplete = progress >= 100;

  return (
    <div style={{
      minHeight: 'calc(100vh - var(--topbar-height))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      backgroundColor: 'var(--bg-app)'
    }}>
      <div style={{
        maxWidth: '680px',
        width: '100%',
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '36px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        textAlign: 'center'
      }}>
        {/* Glow AI Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--primary-surface)',
          color: 'var(--primary)',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '20px'
        }}>
          <Sparkles size={16} />
          <span>{lang === 'ar' ? 'محرك ليرنورا للذكاء الاصطناعي قيد العمل' : 'Learnora Intelligence Engine Active'}</span>
        </div>

        <h1 style={{
          fontSize: '26px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          marginBottom: '10px',
          fontFamily: isRtl ? 'var(--font-arabic)' : 'var(--font-heading)'
        }}>
          {isComplete
            ? (lang === 'ar' ? '🎉 اكتملت المعالجة بنجاح!' : '🎉 Processing Completed!')
            : (lang === 'ar' ? 'جاري تحويل حصتك إلى تجربة تعليمية متكاملة...' : 'Turning your lesson into a complete learning experience...')}
        </h1>

        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
          {lang === 'ar'
            ? 'نقوم بتحليل الحصة الصوتية وبناء خريطة المعرفة وتجهيز أسئلة الامتحانات التفاعلية...'
            : 'Transcribing speech, mapping concepts onto interactive graph, generating notes and adaptive quizzes...'}
        </p>

        {/* Progress Bar & Percentage */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>
            <span style={{ color: 'var(--text-primary)' }}>{lang === 'ar' ? 'نسبة الإنجاز' : 'Pipeline Progress'}</span>
            <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontSize: '16px' }}>{progress}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '10px',
            backgroundColor: 'var(--border-subtle)',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6C4DFF 0%, #4C8DFF 50%, #06B6D4 100%)',
              borderRadius: '5px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* 6 Step Pipeline Status List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          textAlign: isRtl ? 'right' : 'left',
          marginBottom: '36px'
        }}>
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isFinished = progress >= step.threshold;
            const isCurrent = currentStepIndex === idx && !isComplete;

            return (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isCurrent ? 'var(--primary-surface)' : 'var(--bg-subtle)',
                  border: isCurrent ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isFinished ? '#10B981' : (isCurrent ? 'var(--primary)' : 'var(--border-medium)'),
                  color: '#FFFFFF',
                  flexShrink: 0
                }}>
                  {isFinished ? (
                    <CheckCircle2 size={16} />
                  ) : isCurrent ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <StepIcon size={14} />
                  )}
                </div>

                <span style={{
                  fontSize: '13.5px',
                  fontWeight: isCurrent || isFinished ? '700' : '500',
                  color: isFinished ? 'var(--text-primary)' : (isCurrent ? 'var(--primary)' : 'var(--text-muted)')
                }}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        {isComplete ? (
          <button
            onClick={() => navigate('lesson-workspace')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 32px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '15px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(108, 77, 255, 0.4)',
              transition: 'transform 0.15s ease'
            }}
            className="animate-scale-in"
          >
            <span>{lang === 'ar' ? 'فتح مساحة عمل الدرس الآن' : 'Open Lesson Workspace'}</span>
            <ArrowRight size={16} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
          </button>
        ) : (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {lang === 'ar' ? 'المعالجة تستغرق عادة من 30 إلى 45 ثانية...' : 'Processing typically takes 30-45 seconds...'}
          </div>
        )}
      </div>
    </div>
  );
};
