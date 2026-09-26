import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sparkles, 
  Mic, 
  FileText, 
  Share2, 
  Video, 
  ArrowRight,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { ProcessingStepper } from '../../features/teacher/ai-processing';

export const AIProcessingScreen = () => {
  const { navigate } = useAuth();
  const { lang, isRtl } = useLanguage();
  const [progress, setProgress] = useState(15);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Read selected AI features from Recording Studio (Text, Graph, Chapters)
  const selectedFeatures = React.useMemo(() => {
    try {
      const stored = sessionStorage.getItem('selectedAIFeatures');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return { speechToText: true, conceptGraph: true, chapterIndexing: true };
  }, []);

  // Dynamically constructed pipeline matching selected features (Question generation step removed per user request)
  const steps = React.useMemo(() => {
    const list = [
      {
        id: 'upload',
        title: lang === 'ar' ? 'رفع ملف الحصة السحابي وعزل الضوضاء الخلفية' : 'Media Upload & Classroom Noise Suppression',
        icon: Video
      }
    ];

    if (selectedFeatures.speechToText !== false) {
      list.push({
        id: 'speechToText',
        title: lang === 'ar' ? 'التفريغ النصي الذكي (Speech-to-Text اللهجة المصرية والمصطلحات)' : 'Whisper ASR: Speech-to-Text & Egyptian Dialect',
        icon: FileText
      });
    }

    if (selectedFeatures.chapterIndexing !== false) {
      list.push({
        id: 'chapters',
        title: lang === 'ar' ? 'اكتشاف الفصول وتوقيتات اللحظات الزمنية بالثواني' : 'Chapter Segmentation & Timestamp Indexing',
        icon: Clock
      });
    }

    if (selectedFeatures.conceptGraph !== false) {
      list.push({
        id: 'graph',
        title: lang === 'ar' ? 'استخراج المفاهيم وبناء خريطة المعرفة الشجرية (NotebookLM Graph)' : 'Concept Extraction & NotebookLM Mind Map Graph',
        icon: Share2
      });
    }

    // Evenly distribute progress thresholds up to 100%
    return list.map((step, idx) => ({
      ...step,
      threshold: Math.round(((idx + 1) / list.length) * 100)
    }));
  }, [selectedFeatures, lang]);

  // Progress stepper simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 9) + 5;
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
      backgroundColor: 'var(--bg-app)',
      fontFamily: isRtl ? 'var(--font-arabic)' : 'inherit'
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
            : (lang === 'ar' ? 'جاري معالجة الحصة وتوليد النص والخريطة...' : 'Processing lecture into transcript and concept map...')}
        </h1>

        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
          {lang === 'ar'
            ? 'نقوم برفع ومعالجة الحصة، واستخراج التفريغ النصي الدقيق، وتوليد خريطة المفاهيم التفاعلية الشجرية (NotebookLM)...'
            : 'Uploading and processing media, generating speech-to-text transcript, and building interactive NotebookLM tree graph...'}
        </p>

        {/* Progress Bar & Percentage */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>
            <span style={{ color: 'var(--text-primary)' }}>{lang === 'ar' ? 'نسبة الإنجاز' : 'Pipeline Progress'}</span>
            <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: '900' }}>
              {progress}%
            </span>
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
              background: 'linear-gradient(90deg, #1588C7 0%, #38BDF8 50%, #10B981 100%)',
              borderRadius: '5px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* 4 Step Pipeline Status List */}
        <ProcessingStepper
          steps={steps}
          progress={progress}
          currentStepIndex={currentStepIndex}
          isComplete={isComplete}
          isRtl={isRtl}
        />

        {/* Action Button */}
        {isComplete ? (
          <button
            onClick={() => navigate('lesson-workspace')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 34px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '15px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(21, 136, 199, 0.35)',
              transition: 'transform 0.15s ease'
            }}
            className="animate-scale-in"
          >
            <span>{lang === 'ar' ? 'فتح مساحة عمل الدرس الآن' : 'Open Lesson Workspace'}</span>
            <ArrowRight size={16} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
          </button>
        ) : (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {lang === 'ar' ? 'المعالجة تستغرق عادة من 20 إلى 35 ثانية...' : 'Processing typically takes 20-35 seconds...'}
          </div>
        )}
      </div>
    </div>
  );
};
export default AIProcessingScreen;
